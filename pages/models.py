from django.db import models
from pymongo.mongo_client import MongoClient
import certifi
from bson.objectid import ObjectId
from decouple import config

class AuctioneerData(models.Model):
    # Define your model fields here
    

    @staticmethod
    def get_auctioneer_data(data_id):
        MONGODB_AUCTIONEER_KEY = config('MONGODB_AUCTIONEER_KEY', default='')
        uri = "mongodb+srv://lukecoburn:" + MONGODB_AUCTIONEER_KEY + "@cluster0.zghmmde.mongodb.net/?retryWrites=true&w=majority"
        client = MongoClient(uri, tlsCAFile=certifi.where())
        db = client["Auctioneers"]
        AuctioneerData = db["SeptemberTrial"]
        object_id = ObjectId(data_id)
        data = AuctioneerData.find_one({"_id": object_id})
        client.close()
        return data