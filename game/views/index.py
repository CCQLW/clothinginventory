from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(request, "index.html")


def table(request):
    return render(request, "table.html")


def home(request):
    return render(request, "home.html")
