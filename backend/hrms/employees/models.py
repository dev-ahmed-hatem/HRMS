from django.db import models
from hrms.utils import calculate_age
from users.models import User


class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Employee(models.Model):
    MARITAL_STATUS_CHOICES = [
        ("single", "أعزب"),
        ("married", "متزوج"),
        ("divorced", "مطلق"),
        ("widowed", "أرمل"),
    ]

    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    gender = models.CharField(max_length=6, choices=(("male", "ذكر"), ("female", "أنثى")))
    email = models.EmailField(max_length=100, unique=True)
    phone = models.CharField(max_length=20, unique=True)
    employee_id = models.CharField(max_length=10, unique=True)
    address = models.CharField(max_length=100)
    birth_date = models.DateField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    national_id = models.CharField(max_length=100, unique=True)
    marital_status = models.CharField(max_length=8, choices=MARITAL_STATUS_CHOICES)
    position = models.CharField(max_length=100)
    hire_date = models.DateField(null=True, blank=True)
    cv = models.FileField(upload_to='employees/cv', null=True, blank=True)
    image = models.ImageField(upload_to='employees/images', null=True, blank=True)
    mode = models.CharField(max_length=100,
                            choices=(("remote", "عن بُعد"), ("on-site", "من المقر"), ("hybrid", "هجين")))
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id} - {self.name}"

    def save(self, *args, **kwargs):
        if not self.age:
            self.age = calculate_age(self.birth_date)
        super().save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        if self.cv:
            self.cv.delete()
        if self.image:
            self.image.delete()
        return super().delete()
