from django.shortcuts import render
from .models import AuctioneerData

# Create your views here.
def home(request):
    return render(request, 'pages/home.html')

def download_json(request, data_id):
    data = AuctioneerData.get_auctioneer_data(data_id)
    if data is None:
        return render(request, 'pages/404.html')  
    else:
        return render(request, 'pages/house_mobile.html', { 'house_data': data['data'] })