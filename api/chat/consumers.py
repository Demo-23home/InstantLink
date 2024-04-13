import json
import base64
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.core.files.base import ContentFile
from accounts.serializers import UserSerializer


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
    # Handle Requests
    # -----------------------------
    def receive(self, text_data):
        # Receive data
        data = json.loads(text_data)
        data_source = data.get("source")
        print(data_source)
        # print(data.get('base64'))
        # print('receive:', data)
        if data_source == "thumbnail":
            self.receive_thumbnail(data)

    def receive_thumbnail(self, data):
        user = self.scope["user"]
        # convert the base64 to django content file
        image_str = data.get("base64")
        image = ContentFile(base64.b64decode(image_str))
        # Update the thumbnail Feild in the User Model
        filename = data.get("filename")
        user.thumbnail.save(filename, image, save=True)
        # Serialize User
        serialized = UserSerializer(user)
        # Send Updated User Data including Thumbnail
        self.send_group(self.username, "thumbnail", serialized.data)

    # -----------------------------------------
    # Catch all boradcasts to a client helpers
    # -----------------------------------------

    def send_group(self, source, group, data):
        response = {"type": "broadcast_group ", "data": data, "source": source}

        async_to_sync(self.channel_layer.group_send)(
            group, response
        )

    

    def broadcast_group(self, data):
        '''
        data:
            type: 'broadcast_group'
            source: where it has been orginated
            data: whatever you want to send
        '''

        data.pop('type')

        '''
        data:
            source: where it has been orginated
            data: whatever you want to send
        '''


        self.send(text_data=data)
