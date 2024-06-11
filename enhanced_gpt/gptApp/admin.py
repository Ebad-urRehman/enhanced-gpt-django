from django.contrib import admin
from .models import UserInfo, UserMetaData, ChatsData

admin.site.register(UserInfo)
admin.site.register(UserMetaData)
admin.site.register(ChatsData)
