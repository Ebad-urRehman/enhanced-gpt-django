from django.db import models
from django.contrib.auth.models import AbstractUser

# creating custom auto fields
# class CustomAutoFieldUserInfo(models.AutoField):
#     def __init__(self, *args, **kwargs):
#         kwargs.setdefault('primary_key', True)
#         kwargs.setdefault('editable', False)  # Disable editing
#         kwargs.setdefault('unique', True)  # Ensure uniqueness
#         kwargs.setdefault('auto_created', True)  # Mark as auto created
#         super().__init__(*args, **kwargs)


class UserInfo(AbstractUser):
    api_key = models.CharField(max_length=500, null=True, blank=True)


class UserMetaData(models.Model):
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name="meta_data_entries")
    settings = models.JSONField(null=True, blank=True)
    chat_tab_list = models.JSONField(null=True, blank=True)
    image_tab_list = models.JSONField(null=True, blank=True)


class ChatsData(models.Model):
    user = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name="chat_data_entries")
    chat_name = models.CharField(max_length=100)
    prompt_response_dict = models.JSONField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'chat_name')

# class ChatsData(models.Model):
#     chat_name = models.CharField(max_length=100, primary_key=True)



# class ChatPromptResponses(models.Model):
#     prompt_response_name = models.CharField(254)
#     prompt_response = models.CharField(10000)
#     image_response_image = models.CharField(1000)



