import json
import base64
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.core.files.base import ContentFile
from accounts.serializers import UserSerializer, SearchSerializer
from accounts.models import User
from django.db.models import Q


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        user = self.scope["user"]
        print(user)
        print(user.is_authenticated)
        # Save username to be used as a group name for this user
        self.username = user.username

        # join this user to a group with their username
        async_to_sync(self.channel_layer.group_add)(self.username, self.channel_name)

        if not user.is_authenticated:
            return

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

        # Thumbnail upload
        if data_source == "thumbnail":
            self.receive_thumbnail(data)

        if data_source == "search":
            self.receive_search(data)

    def receive_search(self, data):
        query = data.get("query")
        # Get users from query search term
        users = User.objects.filter(
            Q(username__istartswith=query)
            | Q(first_name__istartswith=query)
            | Q(last_name__istartswith=query)
        ).exclude(
            username=self.username
            )
        # .annotate(
        #         pending_them = ...
        #         pending_me = ...
        #         connected = ...
        #     )

        # Serialize the result

        serialized = SearchSerializer(users, many=True)
        # Send search results back to the user
        self.send_group(self.username, 'search', serialized.data)

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

    # -----------------------------------------
    # Catch all boradcasts to a client helpers
    # -----------------------------------------

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
