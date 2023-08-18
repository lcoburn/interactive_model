from django.urls import path
from . import views

urlpatterns = [
    path('', views.home,name='home'),
    path('house/<str:data_id>', views.download_json, name='download_json'),
    path('house_mobile/<str:data_id>', views.download_json, name='download_json'),
]