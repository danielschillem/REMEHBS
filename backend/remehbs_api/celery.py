"""
Celery — Configuration REMEHBS
"""
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "remehbs_api.settings")

app = Celery("remehbs_api")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
