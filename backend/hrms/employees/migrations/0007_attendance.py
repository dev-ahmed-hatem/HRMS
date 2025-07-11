# Generated by Django 5.2 on 2025-06-05 22:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0006_alter_department_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(error_messages={'invalid': 'يرجى إدخال تاريخ صحيح.', 'null': 'يرجى تحديد التاريخ.'}, verbose_name='تاريخ الحضور')),
                ('check_in', models.TimeField(error_messages={'invalid': 'يرجى إدخال وقت صالح.', 'null': 'يرجى إدخال وقت الحضور.'}, verbose_name='وقت الحضور')),
                ('check_out', models.TimeField(blank=True, error_messages={'invalid': 'يرجى إدخال وقت صالح.'}, null=True, verbose_name='وقت الانصراف')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employees.employee', verbose_name='الموظف')),
            ],
            options={
                'verbose_name': 'تسجيل حضور',
                'verbose_name_plural': 'تسجيلات الحضور',
                'ordering': ['-check_in'],
            },
        ),
    ]
