# Generated by Django 5.2 on 2025-05-23 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0010_project_progress_start_date_alter_project_end_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='progress_start_date',
            field=models.DateTimeField(blank=True, null=True, verbose_name='تاريخ بدء التنفيذ'),
        ),
    ]
