from django.urls import path
from game.views.index import index, table, home, test

urlpatterns = [
    path("", index, name="index"),
    path("table/", table, name="table"),
    path("home/", home, name="home"),


    path("t/", test),
]
