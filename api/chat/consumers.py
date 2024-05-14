import json
import base64
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.core.files.base import ContentFile
from accounts.serializers import UserSerializer, SearchSerializer, RequestSerializer
from accounts.models import User, Connection
from django.db.models import Q ,Exists, OuterRef


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        user = self.scope['user']
        print(user, user.is_authenticated)
        
        if not user.is_authenticated:
            return
        
        # Save username to be used as a group name for this user
        self.username = user.username

        # join this user to a group with their username
        async_to_sync(self.channel_layer.group_add)(
			self.username, self.channel_name
		)
        self.accept()


    def disconnect(self, close_code):
		# Leave room/group
        async_to_sync(self.channel_layer.group_discard)(
			self.username, self.channel_name
		)

    # -----------------------------
    #       Handle Requests
    # -----------------------------

    def receive(self, text_data):
        # Receive message from websocket
        data = json.loads(text_data)
        data_source = data.get("source")

        # Pretty print  python dict
        print("receive", json.dumps(data, indent=2))

		# Accept Friedn Request
        if data_source == 'request.accept':
            self.receive_request_accept(data)
        
        # Make friend request
        if data_source == 'request.connect':
            self.receive_request_connect(data)

		# Get request list
        elif data_source == 'request.list':
            self.receive_request_list(data)

		# Search / filter users
        elif data_source == 'search':
            self.receive_search(data)

		# Thumbnail upload
        elif data_source == 'thumbnail':
            self.receive_thumbnail(data)
            

    def receive_request_accept(self, data):
        username = data.get("username")
        # Fetch Connection object
        try:
            connection = Connection.objects.get(
                sender__username = username,
                receiver = self.scope["user"]
            )
        except Connection.DoesNotExist:
            print("Error Connection not Found")
            return
        # Update the connection
        connection.accepted = True
        connection.save()
        
        serialized = RequestSerializer(connection)

        # Send accepted request to the sender
        self.send_group(connection.sender.username, "request.accept", serialized.data)

        # Send accepted reqeust to the receiver
        self.send_group(connection.receiver.username, "request.accept", serialized.data)
   
    def receive_request_connect(self, data):
        username = data.get("username")
        # Attemp to fetch the receiving user
        try:
            receiver = User.objects.get(username=username)
        except User.DoesNotExist:
            print("Error: User Not Found")
            return
        # Create connection
        connection, _ = Connection.objects.get_or_create(
            sender=self.scope["user"], receiver=receiver
        )

        serialized = RequestSerializer(connection)

        # Send to the sender
        self.send_group(connection.sender.username, "request.connect", serialized.data)

        # Send to recevier
        self.send_group(
            connection.receiver.username, "request.connect", serialized.data
        )

    def receive_search(self, data):
        query = data.get("query")
        # Get users from query search term
        users = User.objects.filter(
            Q(username__istartswith=query)
            | Q(first_name__istartswith=query)
            | Q(last_name__istartswith=query)
        ).exclude(username=self.username
        ).annotate(
                pending_them = Exists(
                    Connection.objects.filter(
                        sender = self.scope["user"],
                        receiver = OuterRef('id'),
                        accepted = False
                    )
                    ),
                    pending_me = Exists(
                    Connection.objects.filter(
                        sender = OuterRef('id'),
                        receiver = self.scope["user"],
                        accepted = False
                    )
                    ) ,
                    connected = Exists(
                    Connection.objects.filter(
                        Q(sender=self.scope['user'], receiver=OuterRef('id')) |
                        Q(receiver=self.scope['user'], sender=OuterRef('id')),
                        accepted=True
                    )
                    )

            )

        # Serialize the result

        serialized = SearchSerializer(users, many=True)
        # Send search results back to the user
        self.send_group(self.username, "search", serialized.data)



    def receive_request_list(self, data):
        user = self.scope['user']
        # get connections made to this user
        connections = Connection.objects.filter(
            receiver = user, 
            accepted = False
        )
        serilaized = RequestSerializer(connections, many=True)
        self.send_group(user.username, "request.list", serilaized.data)




    def receive_thumbnail(self, data):
        user = self.scope["user"]
        # Convert base64 data  to django content file
        image_str = data.get("base64")
        image = ContentFile(base64.b64decode(image_str))
        # Update thumbnail field
        filename = data.get("filename")
        user.thumbnail.save(filename, image, save=True)
        # Serialize user
        serialized = UserSerializer(user)
        # Send updated user data including new thumbnail
        self.send_group(self.username, "thumbnail", serialized.data)

    def send_group(self, group, source, data):
        response = {
			'type': 'broadcast_group',
			'source': source,
			'data': data
		}
        async_to_sync(self.channel_layer.group_send)(
			group, response
		)

    def broadcast_group(self, data):
        '''
		data:
			- type: 'broadcast_group'
			- source: where it originated from
			- data: what ever you want to send as a dict
		'''
        data.pop('type')
        '''
		return data:
			- source: where it originated from
			- data: what ever you want to send as a dict
		'''
        self.send(text_data=json.dumps(data))
		