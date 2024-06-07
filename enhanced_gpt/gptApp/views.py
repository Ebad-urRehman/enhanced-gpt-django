from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from gptApp import functions
from django.shortcuts import render, redirect
from gptApp.models import UserInfo, UserMetaData
from django.contrib import messages
from django.contrib.auth.models import auth, User
from django.contrib.auth.decorators import login_required

from django.core.mail import EmailMessage
from django.views.decorators.csrf import csrf_protect


def index(request):
    return render(request, '../templates/index.html')


def image_generator(request):
    return render(request, '../templates/image_generator.html')


def chat_history(request):
    return render(request, '../templates/history.html')


def image_generator_history(request):
    return render(request, '../templates/image_history.html')


def pdf_reader(request):
    return render(request, '../templates/pdf_reader.html')


def pdf_reader_history(request):
    return render(request, '../templates/pdf_reader_history.html')




@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        username = request.POST['name']
        email = request.POST['email']
        password = request.POST['password']
        # password_confirm = request.POST['password_confirm']
        # if password == password_confirm:
        if UserInfo.objects.filter(username=username).exists():
            messages.error(request, "User Name already exists")
            return redirect('register')
        elif UserInfo.objects.filter(email=email).exists():
            messages.error(request, "Already signed up? login then.")
            return redirect('register')
        else:
            user = UserInfo.objects.create_user(username=username, email=email, password=password)
            user.save()
            messages.success(request, "Signed up successfully!")
            return redirect('login')
        # else:
        #     messages.error("Password does not match")
    else:
        return render(request, 'register.html')


@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.POST['name']
        password = request.POST['password']
        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            return redirect("/")
        else:
            messages.error(request, "Wrong email or password! Make sure you have already register with same email and password")
            return redirect('login')
    else:
        return render(request, 'login.html')


@csrf_exempt
def receive_data(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body.decode('utf-8'))
            data["response"] = functions.get_chat_response(model=data['model'], messages=data['messages'],
                                                           max_tokens=int(data['tokens']), frequency_penalty=int(data['frequency']),
                                                           no_of_responses=int(data['no-responses']),
                                                           stream=data['stream'])
            tab_name = None
            if data['tab-name'] is None:
                tab_name = functions.generate_chat_name(json.dumps(data['messages']))

            if tab_name:
                data['tab-name'] = tab_name
            return JsonResponse({'success': data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
@login_required
def store_chat_tabs(request):
    user = request.user
    if not user:
        return JsonResponse({'error', 'Signup and login first'}, status=401)

    current_user_metadata, created = UserMetaData.objects.get_or_create(user=user)

    if request.method == 'POST':
        try:
            metadata = json.loads(request.body.decode('utf-8'))
            settings = metadata['settings']
            chat_tab_list = metadata['chat_tab_list']
            image_tab_list = metadata['image_tab_list']

            if settings:
                current_user_metadata.settings = settings
            if chat_tab_list:
                current_user_metadata.chat_tab_list = chat_tab_list
            if image_tab_list:
                current_user_metadata.image_tab_list = image_tab_list

            current_user_metadata.save()
            UserMetaData.objects.get(user=user)
            return JsonResponse({'success': metadata})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)











