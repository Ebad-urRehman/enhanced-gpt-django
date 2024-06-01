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
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('imageGenerator/', views.image_generator, name="image-gen"),
    path('history/', views.chat_history, name="chat-history"),
    path('imageGenerator/history/', views.image_generator_history, name="image-gen-his"),
    path('pdfReader/', views.pdf_reader, name="pdf-reader"),
    path('pdfReader/history', views.pdf_reader_history, name="pdf-reader-his"),

]
