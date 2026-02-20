from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0002_suscripcionnewsletter_nombre'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contacto',
            name='leido',
        ),
        migrations.AddField(
            model_name='contacto',
            name='estado',
            field=models.CharField(
                choices=[
                    ('pendiente', 'Pendiente'),
                    ('leido', 'Leído'),
                    ('respondido', 'Respondido'),
                ],
                db_index=True,
                default='pendiente',
                max_length=20,
                verbose_name='estado',
            ),
        ),
    ]
