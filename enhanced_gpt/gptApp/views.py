from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
def receive_data(request):
    if request.method == 'POST':
        data = request.POST
        response = get_chat_response()
        # You can process the data here
        return JsonResponse({'status': 'success', 'data_received': response})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})