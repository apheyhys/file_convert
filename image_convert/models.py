from django.db import models
from PIL import Image as ImageConvert


class Image(models.Model):
    name = models.CharField(max_length=255)
    created = models.DateField(auto_now_add=True)
    image_raw = models.ImageField(blank=False, upload_to='image_raw', max_length=100)
    image_converted = models.ImageField(blank=False, upload_to='image_converted', max_length=100)

    def __str__(self):
        return f'Title - "{self.name}", Date - "{self.created}"'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        img = ImageConvert.open(self.image_converted.path).convert('L')

        if img.height > 300 or img.width > 300:
            new_size = (300, 300)
            img.thumbnail(new_size)
            rotate_img = img.rotate(-10, expand=True)
            rotate_img.save(self.image_converted.path)
        else:
            rotate_img = img.rotate(-10, expand=True)
            rotate_img.save(self.image_converted.path)
            img.save(self.image_converted.path)
