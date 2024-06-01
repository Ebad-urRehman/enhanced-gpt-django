from django.shortcuts import render


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