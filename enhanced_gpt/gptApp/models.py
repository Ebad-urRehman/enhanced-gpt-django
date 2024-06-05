from django.db import models


class UserInfo(models.Model):
    # columns
    # user_id = models.AutoField()
    user_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254)
    password = models.CharField(max_length=128)
    api_key = models.CharField(max_length=500)
    # created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_name


# class ChatPromptResponses(models.Model):
#     prompt_response_name = models.CharField(254)
#     prompt_response = models.CharField(10000)
#     image_response_image = models.CharField(1000)



