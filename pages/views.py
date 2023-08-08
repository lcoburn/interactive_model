from django.shortcuts import render
# from .models import AuctioneerData
import json
from pymongo.mongo_client import MongoClient
from decouple import config
from bson.objectid import ObjectId
from django.http import JsonResponse
import certifi

# Create your views here.
def home(request):
    return render(request, 'pages/home.html')

def download_json(request, data_id):
    mongodb_key = "ZbnxA9SAT9aLVa58"
    uri = "mongodb+srv://lukecoburn:"+mongodb_key+"@cluster0.zghmmde.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(uri, tlsCAFile=certifi.where())
    db = client["Auctioneers"]
    AuctioneerData = db["SeptemberTrial"]
    object_id = ObjectId(data_id)
    data = AuctioneerData.find_one({"_id": object_id})

    client.close()
    if data is None:
        return render(request, 'pages/404.html')

    # house_data = {
    #     'address': data['data']['houseInfo']['address_string'],
    #     'postcode': data['data']['houseInfo']['postcode'],
    # }

    return render(request, 'pages/house.html', { 'house_data': data['data'] })