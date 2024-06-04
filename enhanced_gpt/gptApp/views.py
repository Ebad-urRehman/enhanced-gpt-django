from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from gptApp import functions


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


# @csrf_exempt
# def receive_data(request):
#     if request.method == 'POST':
#         try:
#             # Attempt to parse the JSON data from the request body
#             data = json.loads(request.body.decode('utf-8'))
#         except json.JSONDecodeError:
#             # If JSON parsing fails, return an error response
#             return JsonResponse({'status': 'error', 'message': 'Invalid JSON format'}, status=400)
#
#         try:
#             # Process the data and get the response (assuming get_chat_response takes input data)
#             response = get_chat_response(data)
#             print(response)
#             return JsonResponse({'status': 'success', 'data_received': response})
#         except Exception as e:
#             # Handle any exceptions that occur during data processing
#             return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
#
#     # If the request method is not POST, return an error response
#     return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


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

            return JsonResponse({'success': data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
