from rest_framework.views import APIView
from rest_framework.response import Response
from image_convert.serializers import ImageConvertSerializer
from django.conf import settings
from .models import Image
import os
import shutil


class TextTransform(APIView):

    @staticmethod
    def post(request):

        data = {
            "name": str(request.data["image_raw"]),
            "image_raw": request.data["image_raw"],
            "image_converted": request.data["image_raw"]
        }

        # Delete all notes from database
        Image.objects.all().delete()

        # Delete media
        try:
            shutil.rmtree(settings.MEDIA_ROOT)
        except OSError as e:
            print("Error: %s - %s." % (e.filename, e.strerror))

        serializer = ImageConvertSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
