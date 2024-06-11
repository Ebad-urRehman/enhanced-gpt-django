"""
URL configuration for enhanced_gpt project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from gptApp import views


urlpatterns = [
    # admin url
    path('admin/', admin.site.urls),

    # endpoint urls
    path('', views.index, name='index'),
    path('imageGenerator/', views.image_generator, name="image-gen"),
    path('history/', views.chat_history, name="chat-history"),
    path('imageGenerator/history/', views.image_generator_history, name="image-gen-his"),
    path('pdfReader/', views.pdf_reader, name="pdf-reader"),
    path('pdfReader/history', views.pdf_reader_history, name="pdf-reader-his"),
    path('receive-data/', views.receive_data, name='receive-data'),

    # urls for register and login
    path('register/', views.register_user, name='register'),
    path('login/', views.login, name='login'),

    # urls for storing and loading tabs
    path('store-chat-tabs/', views.store_chat_tabs, name='store-tab-chats'),
    path('load-chat-tabs/', views.load_chat_tabs, name='load-tab-chats'),
    # path('store-image-tabs/', views.store_image_tabs, name='store-image-tabs'),
    # path('load-image-tabs/', views.load_image_tabs, name='load-image-tabs'),
    #
    # # urls for storing and loading history
    path('store-chats-history/', views.store_chats_history, name='store-chats-history'),
    path('load-chats-history/', views.load_chats_history, name='load-chats-history'),
    # path('store-images-history/', views.store_images_history, name='store-images-history'),
    # path('load-images-history/', views.load_images_history, name='load-images-history')

]
