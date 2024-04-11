import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):
    
    def connect(self):
        user = self.scope['user']
        print(user)
        print(user.is_authenticated)
        # Save username to be used as a group name for this user
        self.username = user.username

        # join this user to a group with their username
        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )

        if not user.is_authenticated:
            return
        
        self.accept()

    
    def disconnect(self, close_code):
        # Leave room/group
        async_to_sync(self.channel_layer.group_discard)(
            self.username, self.channel_name
        )


    #-----------------------------
    # Handle Requests
    #-----------------------------
    def receive(self, text_data):
         #Receive
         data = json.loads(text_data)
         print('receive', json.dumps(text_data, index=2))   