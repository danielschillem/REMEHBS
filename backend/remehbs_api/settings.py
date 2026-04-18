"""
REMEHBS API — Django Settings
"""
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
from django.core.exceptions import ImproperlyConfigured
try:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
except ImportError:
    sentry_sdk = None
    DjangoIntegration = None

try:
    import dj_database_url
    HAS_DJ_DATABASE_URL = True
except ImportError:
    HAS_DJ_DATABASE_URL = False

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

_secret = os.getenv("SECRET_KEY")
if not _secret:
    raise ImproperlyConfigured(
        "La variable d'environnement SECRET_KEY est manquante. "
        "Créez un fichier .env à la racine du backend avec : SECRET_KEY=<votre-clé>"
    )
SECRET_KEY = _secret

DEBUG = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

# ── Applications ──────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    # REMEHBS apps
    "members",
    "payments",
    "events",
    # Celery
    "django_celery_beat",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "remehbs_api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "remehbs_api.wsgi.application"

# ── Base de données ────────────────────────────
if HAS_DJ_DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default="sqlite:///" + str(BASE_DIR / "db.sqlite3"),
            conn_max_age=600,
        )
    }
else:
    DATABASE_URL = os.getenv("DATABASE_URL", "")
    if DATABASE_URL.startswith("postgresql"):
        import re
        m = re.match(r"postgresql://(.+):(.+)@(.+):(\d+)/(.+)", DATABASE_URL)
        if m:
            DATABASES = {
                "default": {
                    "ENGINE": "django.db.backends.postgresql",
                    "NAME": m.group(5), "USER": m.group(1),
                    "PASSWORD": m.group(2), "HOST": m.group(3), "PORT": m.group(4),
                }
            }
        else:
            DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}
    else:
        DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}

# ── Auth & JWT ────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTHENTICATION_BACKENDS = [
    "remehbs_api.backends.EmailBackend",       # connexion par email
    "django.contrib.auth.backends.ModelBackend",  # fallback username (admin Django)
]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":  timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ROTATE_REFRESH_TOKENS":  True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES":      ("Bearer",),
}

# ── DRF ──────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "120/hour",
        "user": "600/hour",
        "auth_login": "15/min",
        "auth_password_reset": "6/hour",
        "adhesion_submit": "10/hour",
        "payment_init": "30/hour",
        "payment_webhook": "180/min",
    },
}

# ── Swagger / OpenAPI ─────────────────────────
SPECTACULAR_SETTINGS = {
    "TITLE": "REMEHBS API",
    "DESCRIPTION": "API du Réseau Mère Enfant des Hauts-Bassins",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# ── CORS ──────────────────────────────────────
_cors_extra = os.getenv("CORS_ALLOWED_ORIGINS", "")
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
] + [o.strip() for o in _cors_extra.split(",") if o.strip()]
CORS_ALLOW_CREDENTIALS = True

# ── Internationalisation ──────────────────────
LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Africa/Ouagadougou"
USE_I18N = True
USE_TZ = True

# ── Fichiers statiques & médias ───────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
MEDIA_URL  = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── CinetPay ─────────────────────────────────
CINETPAY_API_KEY    = os.getenv("CINETPAY_API_KEY", "")
CINETPAY_SITE_ID    = os.getenv("CINETPAY_SITE_ID", "")
CINETPAY_SECRET_KEY = os.getenv("CINETPAY_SECRET_KEY", "")
CINETPAY_BASE_URL   = os.getenv("CINETPAY_BASE_URL", "https://api-checkout.cinetpay.com/v2")

# ── Upload limits ───────────────────────────
MAX_PROFILE_PHOTO_SIZE = int(os.getenv("MAX_PROFILE_PHOTO_SIZE", 5 * 1024 * 1024))
MAX_ABSTRACT_FILE_SIZE = int(os.getenv("MAX_ABSTRACT_FILE_SIZE", 10 * 1024 * 1024))

# ── Resend (emails) ───────────────────────────
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM     = os.getenv("EMAIL_FROM", "noreply@remehbs-bf.org")

# ── Frontend URL ──────────────────────────────
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# ── Celery ────────────────────────────────────
CELERY_BROKER_URL        = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND    = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CELERY_ACCEPT_CONTENT    = ["json"]
CELERY_TASK_SERIALIZER   = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE          = TIME_ZONE
CELERY_BEAT_SCHEDULE     = {
    "rappel-cotisations-quotidien": {
        "task": "members.tasks.rappel_cotisations",
        "schedule": 86400.0,   # toutes les 24 h
    },
}

# ── Monitoring (Sentry) ─────────────────────
SENTRY_DSN = os.getenv("SENTRY_DSN", "").strip()
if SENTRY_DSN and sentry_sdk and DjangoIntegration:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        environment=os.getenv("SENTRY_ENVIRONMENT", "production"),
        traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
        integrations=[DjangoIntegration()],
        send_default_pii=False,
    )

# ── Sécurité Production ───────────────────────
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000          # 1 an
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
