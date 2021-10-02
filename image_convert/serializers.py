from rest_framework import serializers


from .models import Image


class ImageConvertSerializer(serializers.ModelSerializer):

    def save(self, **kwargs):
        kwargs["name"] = "converted_img-" + self.validated_data["name"]
        self.instance = super().save(**kwargs)
        return self.instance

    class Meta:
        model = Image
        fields = [
            "name",
            "created",
            "image_raw",
            "image_converted",
        ]



