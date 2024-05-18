from django.db import models

from accounts.models import Connection, User


class Message(models.Model):
    connection = models.ForeignKey(Connection, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_messages')
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.user.username  + ': ' + self.text