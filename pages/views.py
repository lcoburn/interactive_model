from django.shortcuts import render
# from .models import AuctioneerData
import json
from pymongo.mongo_client import MongoClient
from decouple import config
from bson.objectid import ObjectId
from django.http import JsonResponse

# Create your views here.
def home(request):
    return render(request, 'pages/home.html')

def download_json(request, data_id):
    mongodb_key = "ZbnxA9SAT9aLVa58"
    uri = "mongodb+srv://lukecoburn:"+mongodb_key+"@cluster0.zghmmde.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(uri)
    db = client["Auctioneers"]
    AuctioneerData = db["SeptemberTrial"]
    # try:    
    # field_name = "data.houseInfo.id"
    # query = {field_name: data_id}
    # data = AuctioneerData.find_one(query)
    object_id = ObjectId(data_id)
    data = AuctioneerData.find_one({"_id": data_id})
    client.close()
    if house_data is None:
        return render(request, 'pages/404.html')
    house_data = json.loads(data)    
    return render(request, 'pages/house.html', {'house_data': house_data})
    # except: 
    #     return render(request, 'pages/404.html')