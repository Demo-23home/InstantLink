# Generated by Django 5.0.4 on 2024-05-18 12:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="message",
            name="created",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
