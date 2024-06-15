from rest_framework import serializers
from .models import User, Connection


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        username = validated_data["username"].lower()
        first_name = validated_data["first_name"].lower()
        last_name = validated_data["last_name"].lower()

        user = User.objects.create(
            username=username,
            first_name=first_name,
            last_name=last_name,
        )

        password = validated_data['password']
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("username", "name", "thumbnail")

    def get_name(self, obj):
        fname = obj.first_name.capitalize()
        lname = obj.last_name.capitalize()

        return fname + " " + lname




class SearchSerializer(UserSerializer):
    status = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields =('username', 'name', 'thumbnail', 'status')

    def get_status(self, obj):
        if obj.pending_them:
            return "pending-them"
        elif obj.pending_me:
            return "pending-me"
        elif obj.connected:
            return "connected"
        return 'no-connection'
    


class RequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer()
    class Meta:
        model = Connection
        fields = ('sender', 'receiver', 'accepted', 'updated', 'created')





class FriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()
    updated = serializers.SerializerMethodField()
    
    class Meta:
        model = Connection
        fields = ['id', 'friend', 'preview', 'updated']
    
    def get_friend(self, obj):
        # if Iam the sender
        user = self.context['user']
        if user == obj.sender:
            return UserSerializer(obj.receiver).data
        
        # if Iam the receiver
        elif user == obj.receiver:
            return UserSerializer(obj.sender).data
        
        else:
            print("Error, NO User found in FriendSerializer")

    def get_preview(self, obj):
        if not obj.latest_text:
            return "New Connection"
        return obj.latest_text
    


    def get_updated(self, obj):
        date = obj.latest_created or obj.updated
        return date.isoformat()
        