# Generated by Django 5.2 on 2025-06-18 12:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0007_attendance'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Attendance',
        ),
    ]
