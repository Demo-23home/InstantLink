import json
import base64
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.core.files.base import ContentFile
from accounts.serializers import (
    UserSerializer,
    SearchSerializer,
    RequestSerializer,
    FriendSerializer,
)
from accounts.models import User, Connection
from chat.models import Message
from django.db.models import Q, Exists, OuterRef
from django.db.models.functions import Coalesce
from chat.serializers import MessageSerializer


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        user = self.scope["user"]
        print(user, user.is_authenticated)

        if not user.is_authenticated:
            return

        # Save username to be used as a group name for this user
        self.username = user.username

        # join this user to a group with their username
        async_to_sync(self.channel_layer.group_add)(self.username, self.channel_name)
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

        # Get Friends List
        if data_source == "friend.list":
            self.receive_friend_list(data)

        # Message List
        elif data_source == "message.list":
            self.receive_message_list(data)

        # Message has been sent
        elif data_source == "message.send":
            self.receive_message_send(data)

        # Accept Friedn Request
        elif data_source == "request.accept":
            self.receive_request_accept(data)

        # Make friend request
        elif data_source == "request.connect":
            self.receive_request_connect(data)

        # Get request list
        elif data_source == "request.list":
            self.receive_request_list(data)

        # Search / filter users
        elif data_source == "search":
            self.receive_search(data)

        # Thumbnail upload
        elif data_source == "thumbnail":
            self.receive_thumbnail(data)

    def receive_message_list(self, data):
        user = self.scope["user"]
        connectionId = data.get("connectionId")
        page = data.get("page")

        try:
            connection = Connection.objects.get(id=connectionId)
        except Connection.DoesNotExist:
            print("Error: couldn't find connection")
            return

        # Get Messages
        messages = Message.objects.filter(connection=connection).order_by("-created")

        # Serialized Messages
        serialized_messages = MessageSerializer(
            messages, context={"user": user}, many=True
        )

        # Get recipient friend
        recipient = connection.sender
        if connection.sender != user:
            recipient = connection.receiver

        # Serialize Friend
        serialized_friend = UserSerializer(recipient)

        data = {"messages": serialized_messages.data, "friend": serialized_friend.data}

        # Send back to the requestor
        self.send_group(user.username, "message.list", data)

    def receive_message_send(self, data):
        user = self.scope["user"]
        connectionId = data.get("connectionId")
        message_text = data.get("message")
        try:
            connection = Connection.objects.get(id=connectionId)
        except Connection.DoesNotExist:
            print("Error: couldnt find connection")
            return

        message = Message.objects.create(
            connection=connection, user=user, text=message_text
        )

        # Get recipient friend
        recipient = connection.sender
        if connection.sender == user:
            recipient = connection.receiver

        # Send new message back to sender
        serialized_message = MessageSerializer(message, context={"user": user})
        serialized_friend = UserSerializer(recipient)
        data = {"message": serialized_message.data, "friend": serialized_friend.data}
        self.send_group(user.username, "message.send", data)

        # Send new message to receiver
        serialized_message = MessageSerializer(message, context={"user": recipient})
        serialized_friend = UserSerializer(user)
        data = {"message": serialized_message.data, "friend": serialized_friend.data}
        self.send_group(recipient.username, "message.send", data)

    def receive_friend_list(self, data):
        user = self.scope["user"]
        # lastest message subquery
        latest_message = Message.objects.filter(connection=OuterRef("id")).order_by(
            "-created"
        )[:1]

        # Get the connections of the user
        connections = (
            Connection.objects.filter(Q(sender=user) | Q(receiver=user), accepted=True)
            .annotate(
                latest_text=latest_message.values("text"),
                latest_created=latest_message.values("created"),
            )
            .order_by(Coalesce("latest_created", "updated").desc())
        )

        serialized = FriendSerializer(connections, context={"user": user}, many=True)

        # Send the data back to the user
        self.send_group(user.username, "friend.list", serialized.data)

    def receive_request_accept(self, data):
        username = data.get("username")
        # Fetch Connection object
        try:
            connection = Connection.objects.get(
                sender__username=username, receiver=self.scope["user"]
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
        users = (
            User.objects.filter(
                Q(username__istartswith=query)
                | Q(first_name__istartswith=query)
                | Q(last_name__istartswith=query)
            )
            .exclude(username=self.username)
            .annotate(
                pending_them=Exists(
                    Connection.objects.filter(
                        sender=self.scope["user"],
                        receiver=OuterRef("id"),
                        accepted=False,
                    )
                ),
                pending_me=Exists(
                    Connection.objects.filter(
                        sender=OuterRef("id"),
                        receiver=self.scope["user"],
                        accepted=False,
                    )
                ),
                connected=Exists(
                    Connection.objects.filter(
                        Q(sender=self.scope["user"], receiver=OuterRef("id"))
                        | Q(receiver=self.scope["user"], sender=OuterRef("id")),
                        accepted=True,
                    )
                ),
            )
        )

        # Serialize the result

        serialized = SearchSerializer(users, many=True)
        # Send search results back to the user
        self.send_group(self.username, "search", serialized.data)

    def receive_request_list(self, data):
        user = self.scope["user"]
        # get connections made to this user
        connections = Connection.objects.filter(receiver=user, accepted=False)
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
        response = {"type": "broadcast_group", "source": source, "data": data}
        async_to_sync(self.channel_layer.group_send)(group, response)

    def broadcast_group(self, data):
        """
        data:
                - type: 'broadcast_group'
                - source: where it originated from
                - data: what ever you want to send as a dict
        """
        data.pop("type")
        """
		return data:
			- source: where it originated from
			- data: what ever you want to send as a dict
		"""
        self.send(text_data=json.dumps(data))
