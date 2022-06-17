from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(request, "index.html")


def table(request):
    return render(request, "table.html")


def home(request):
    return render(request, "home.html")


def test(request):
    callback = request.GET.get("callback")
    print(callback)
    return HttpResponse("%s('情人节快乐！')" % callback)
