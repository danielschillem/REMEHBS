from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("members", "0003_add_notification_model"),
    ]

    operations = [
        migrations.AddField(
            model_name="member",
            name="role",
            field=models.CharField(
                choices=[
                    ("membre", "Membre"),
                    ("bureau", "Bureau"),
                    ("tresorier", "Trésorier"),
                    ("comite_scientifique", "Comité scientifique"),
                ],
                default="membre",
                max_length=30,
                verbose_name="Rôle",
            ),
        ),
    ]
