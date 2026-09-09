// src/lib/curriculum/pythonFullStack/batch025.ts
// Single Source of Truth for PINIT BATCH 025 (COMPLETE · DAYS 123–127): Month 7 · Week 25 · Days 1–5
// Semester 2 Launch: Django 6.0 Architecture, Gateway Interfaces, Template Foundations & Pipeline Middleware
// Pedagogical Flow: UNDERSTAND (Django 6.0 & WSGI/ASGI) -> APPLY (URL Routing & FBVs) -> BUILD (DTL Templates & Auto-Escaping) -> DEBUG (Middleware & Exception Handlers) -> TRANSFER (Formative Assessment: Stateless Web Gateway)
// STRICT ORM FIREWALL: Batch 025 features ZERO database models, zero migrations, and zero schema definitions.

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_DJANGO_FOUNDATIONS = 'comp-pfs-m7-025';

// ── CANONICAL DOMAIN EXCEPTIONS & DEFINED CONSTRAINTS ──
// Strict ORM Firewall: Batch 025 teaches gateway interfaces, HTTP request/response lifecycles, routing, DTL templates, and middleware.
// Django ORM database model classes and schema migrations are strictly quarantined until Batch 026+.

// ── DAY 123: UNDERSTAND — Django 6.0 Architecture, Python 3.14 Baseline & WSGI vs ASGI Gateway Interfaces ──
export const DAY_123_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w25-025',
  dayNumber: 1,
  title: 'Django 6.0 Architecture, Python 3.14 Baseline & WSGI vs ASGI Gateway Interfaces',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b25-d123-01',
      type: 'THEORY',
      order: 1,
      title: 'Django 6.0 Framework Core, Request/Response Pipeline & Gateway Interfaces (WSGI/ASGI)',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 foundational architecture running on Python 3.14: framework decomposition, the full HTTP request/response pipeline through middleware layers, the WSGI synchronous gateway interface application(environ, start_response), the ASGI asynchronous callable interface application(scope, receive, send), and production settings security invariants.',
      whatItIs: 'Django is a high-level Python web framework designed for secure, maintainable web applications. Key architectural foundations include:\n1. Python 3.14 Baseline & Django 6.0 Security Patch Baseline:\n   - Pinned to patched security release Django==6.0.8 running on Python 3.14 runtime.\n   - Enforcing patched production baselines (e.g. Django 6.0.8, which mitigates high/moderate severity security advisories and CVEs found in earlier 6.0.x releases) is a mandatory production-security invariant. Under Django semantic versioning, the third digit designates backward-compatible bug and security patch releases; initial minor releases (e.g. 6.0.0) must never be deployed or taught as production baselines.\n   - Leverages Python 3.14 performance optimizations and modern typing annotations.\n2. The Two Web Server Gateway Interfaces:\n   - WSGI (Web Server Gateway Interface, PEP 3333): Exposes a synchronous callable interface application(environ, start_response). In WSGI, the web server passes an environ dictionary containing CGI-like environment variables and HTTP headers, along with a start_response callback to set status and response headers. Concurrency in WSGI deployments (e.g. Gunicorn, uWSGI) is handled according to the deployment server\'s configured process and thread worker pool model (e.g. prefork worker processes or thread pools), not by arbitrary thread-per-request assumptions in the application code.\n   - ASGI (Asynchronous Server Gateway Interface): Exposes an asynchronous callable interface application(scope, receive, send). In ASGI, scope is a dictionary describing the connection, receive is an async callable to yield incoming event messages (request bodies, WebSocket frames), and send is an async callable to dispatch outgoing events. ASGI natively handles concurrent asynchronous HTTP and persistent stateful connections (WebSockets, Server-Sent Events).\n3. The Request/Response Pipeline:\n   - Web Server (Nginx) -> Gateway (Gunicorn/Uvicorn) -> WSGI/ASGI Handler -> Request Middleware chain -> URL Resolver -> View Callable -> Template Engine -> Response Middleware chain -> Gateway -> Client.\n4. Core Security Invariants in settings.py:\n   - SECRET_KEY: Cryptographic signing key for sessions, CSRF tokens, and password reset hashes. MUST be loaded from environment variables and NEVER committed to version control.\n   - DEBUG = False: In production, DEBUG MUST be False. Setting DEBUG = True leaks sensitive environment variables, source code, and database configuration upon unhandled exceptions.\n   - ALLOWED_HOSTS: Explicit allowlist of valid Host header domain names to prevent HTTP Host Header Poisoning attacks.',
      whyItExists: 'Provides standard protocols (PEP 3333 and ASGI) separating application code from web servers, while enforcing defense-in-depth security defaults.',
      problemSolved: 'Eliminates tight coupling between web applications and specific server software, prevents Host header poisoning, and protects cryptographic session secrets.',
      mentalModel: 'The Airport International Border & Customs Processing: An incoming passenger flight (HTTP request) arrives at the airport runway (Nginx). The passenger enters the customs gateway terminal (WSGI/ASGI application), where immigration officers (Middleware pipeline: SecurityMiddleware, SessionMiddleware, CsrfViewMiddleware) inspect their passport, verify stamps, and check baggage. If approved, the passenger is routed to the domestic transit desk (URL Dispatcher) to meet their driver (View Function). On leaving, baggage is sealed (Response Middleware) before departure.',
      realWorldUse: 'High-throughput enterprise portals, e-commerce backends, government services, and SaaS platforms requiring uncompromising security defaults.',
      commonMistakes: [
        'Committing settings.py with a hardcoded SECRET_KEY to public Git repositories.',
        'Deploying to production with DEBUG = True, exposing interactive tracebacks and environment secrets to external attackers.',
        'Setting ALLOWED_HOSTS = ["*"] in production, leaving the application vulnerable to cache poisoning and password reset hijacking via forged Host headers.',
        'Misunderstanding WSGI concurrency: assuming WSGI code can handle asynchronous WebSocket connections without ASGI.',
      ],
      commonMisconceptions: [
        'WSGI creates an operating system thread for each incoming HTTP request (concurrency depends entirely on the WSGI server worker model, e.g. Gunicorn prefork processes or gevent greenlets).',
        'Django 6.0 requires an active database to run (Django operates cleanly as a pure stateless HTTP routing and rendering engine without any database configured).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b25-d123-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Minimal Standalone Django 6.0 Configuration with Secure Environment Loading',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates configuring a minimal, secure Django 6.0 application instance without database dependencies, enforcing strict environment validation.',
      codeSnippet: `# settings.py (Production Baseline for Django 6.0 on Python 3.14)
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# 1. ENFORCE STRICT SECRET_KEY ENVIRONMENT LOADING
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")
if not SECRET_KEY:
    if os.environ.get("DJANGO_ENV") == "production":
        raise RuntimeError("CRITICAL SECURITY VIOLATION: DJANGO_SECRET_KEY must be set in production.")
    SECRET_KEY = "insecure-dev-key-change-in-production-0000000000000000000000000"

# 2. STRICT PRODUCTION DEBUG TOGGLE
DEBUG = os.environ.get("DJANGO_DEBUG", "False").lower() in ("true", "1", "yes")

# 3. EXPLICIT ALLOWED HOSTS (PREVENTS HOST HEADER POISONING)
ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if host.strip()
]

# 4. LEAN APPLICATION REGISTRY (ZERO ORM / ZERO DATABASE)
INSTALLED_APPS = [
    "django.contrib.staticfiles",
]

# 5. CORE MIDDLEWARE PIPELINE
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "myproject.urls"

# 6. TEMPLATES WITH AUTO-ESCAPING ENABLED
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
            ],
        },
    },
]

# 7. GATEWAY INTERFACE ENTRY POINTS
WSGI_APPLICATION = "myproject.wsgi.application"
ASGI_APPLICATION = "myproject.asgi.application"`,
      language: 'python',
      explanation: 'The configuration strictly validates that SECRET_KEY is supplied via the environment in production, disallows wildcard ALLOWED_HOSTS, and demonstrates that Django can run as a lean, fast HTTP and template engine with zero database dependencies.',
    } as ExampleBlock,
    {
      id: 'blk-b25-d123-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Auditing settings.py Security Invariants and WSGI/ASGI Handlers',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Audit the provided insecure Django settings configuration and eliminate hardcoded secrets.',
        'Ensure DEBUG is disabled when DJANGO_ENV is set to "production".',
        'Configure ALLOWED_HOSTS using a comma-separated environment variable parser.',
        'Define a validate_runtime_security(settings_dict) verification function that raises ValueError on security violations.',
      ],
      starterArtifact: `def validate_runtime_security(settings_dict):
  # TODO: Validate SECRET_KEY, DEBUG, and ALLOWED_HOSTS invariants
  pass`,
      expectedOutcome: `def validate_runtime_security(settings_dict):
  secret_key = settings_dict.get("SECRET_KEY", "")
  debug = settings_dict.get("DEBUG", True)
  allowed_hosts = settings_dict.get("ALLOWED_HOSTS", [])

  if not secret_key or "insecure" in secret_key.lower():
    raise ValueError("Insecure or missing SECRET_KEY")

  if debug is True:
    raise ValueError("DEBUG must be False in production environments")

  if not allowed_hosts or "*" in allowed_hosts:
    raise ValueError("ALLOWED_HOSTS must not be empty or contain wildcards in production")

  return True`,
      hints: [
        'Host header poisoning occurs when ALLOWED_HOSTS contains "*" or is empty, allowing attackers to forge password reset emails.',
        'Never permit fallback development keys when evaluating production configuration.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_FOUNDATIONS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b25-d123-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: WSGI vs ASGI Gateway Architecture & Settings Security',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which statement accurately describes the distinction between WSGI and ASGI gateway interfaces and the role of ALLOWED_HOSTS in Django?',
      options: [
        'WSGI exposes a synchronous callable application(environ, start_response) where concurrency is managed by the deployment server\'s worker process/thread pool model, while ASGI exposes an asynchronous callable application(scope, receive, send) for HTTP and WebSockets; ALLOWED_HOSTS defends against HTTP Host header poisoning.',
        'WSGI creates an asynchronous greenlet for every request, while ASGI runs only in Node.js; ALLOWED_HOSTS specifies client IP addresses allowed to connect.',
        'WSGI is deprecated and cannot be used in Python 3.14; ASGI requires DEBUG = True in order to route URLs.',
        'WSGI handles database connections, while ASGI handles HTML rendering.',
      ],
      correctIndex: 0,
      explanation: 'WSGI (PEP 3333) defines a synchronous callable interface where concurrency is governed by the server worker model (e.g. Gunicorn prefork workers or threads). ASGI provides an asynchronous callable interface capable of handling concurrent HTTP and long-lived WebSocket connections. ALLOWED_HOSTS validates the incoming HTTP Host header to prevent Host Header Poisoning attacks.',
      misconceptionIdentified: 'Believing WSGI application code manages threads per request directly or confusing client IP addresses with Host header validation.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b25-d123-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Gateway Abstractions and Production Readiness',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why standardized gateway interfaces (WSGI/ASGI) have allowed Python web software to remain durable and portable for over two decades.',
      guidingQuestions: [
        'How does separating the HTTP server (Nginx/Gunicorn/Uvicorn) from the application logic (Django) enable independent scaling and security hardening?',
        'Why are security invariants like ALLOWED_HOSTS and SECRET_KEY non-negotiable foundations before writing a single line of application code?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b25-d123-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 025 Reference Sheet: Django 6.0 & Gateway Interface Standards',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PEP 3333: Python Web Server Gateway Interface v1.0.1',
          url: 'https://peps.python.org/pep-3333/',
        },
        {
          title: 'ASGI (Asynchronous Server Gateway Interface) Specification',
          url: 'https://asgi.readthedocs.io/en/latest/',
        },
        {
          title: 'Django 6.0 Documentation: Deployment Checklist',
          url: 'https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/',
        },
      ],
      documentationExtracts: [
        'PEP 3333: The WSGI interface has two sides: the "server" or "gateway" side, and the "application" or "framework" side. The application object is simply a callable object that accepts two arguments: environ and start_response.',
        'Django Security: The ALLOWED_HOSTS setting is a list of strings representing the host/domain names that this Django site can serve. This is a security measure to prevent HTTP Host header attacks.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 124: APPLY — URL Dispatcher, Hierarchical Routing, View Functions (FBVs) & HTTP Contract ──
export const DAY_124_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w25-025',
  dayNumber: 2,
  title: 'URL Dispatcher, Hierarchical Routing, View Functions (FBVs) & HTTP Contract',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b25-d124-01',
      type: 'THEORY',
      order: 1,
      title: 'URLconf Resolution, Path Converters, Function-Based Views (FBVs) & HTTP Contracts',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 URLconf resolution mechanics, built-in path converters (<int>, <str>, <slug>, <uuid>), modular routing via include(), Function-Based Views (FBVs), the HttpRequest input contract, HttpResponse status codes and headers, and JsonResponse serialization.',
      whatItIs: 'Routing and request handling form the central bridge of Django applications:\n1. The URL Dispatcher Architecture (URLconf):\n   - When a request arrives, Django matches request.path_info against urlpatterns in ROOT_URLCONF sequentially.\n   - path(route, view, name=...): Clean route definitions with typed path converters.\n   - Built-in Path Converters: <int:name> (matches 1+ ASCII digits, converts to Python int), <str:name> (matches any non-empty string excluding /), <slug:name> (matches ASCII letters, numbers, hyphens, underscores), <uuid:name> (matches canonical formatted UUID string, converts to uuid.UUID instance).\n   - Modular Sub-routing: include("app.urls", namespace="...") allows decomposing routes hierarchically into self-contained domain modules.\n   - Reverse URL Resolution: reverse("namespace:route_name", args=[...], kwargs={...}) eliminates hardcoded URL strings throughout the codebase.\n2. The View Contract (Function-Based Views):\n   - A Django view callable MUST accept an HttpRequest instance as its first argument and MUST return an HttpResponse (or subclass: JsonResponse, HttpResponseNotFound, HttpResponseRedirect) instance. If a view returns None or a raw string, Django raises a ValueError.\n3. HttpRequest Properties:\n   - request.method: Normalized uppercase HTTP verb (GET, POST, PUT, DELETE).\n   - request.GET / request.POST: QueryDict instances handling multi-value query parameters.\n   - request.headers: Case-insensitive dictionary of HTTP request headers.\n   - request.body: Raw bytes of the request payload.\n4. HttpResponse and JsonResponse:\n   - HttpResponse(content, content_type="text/html; charset=utf-8", status=200).\n   - JsonResponse(data, safe=True): Automatically sets Content-Type: application/json and serializes data via json.dumps. Setting safe=False allows serializing top-level JSON arrays.',
      whyItExists: 'Provides declarative, clean, two-way URL routing and enforces strict HTTP contract boundaries for request handling.',
      problemSolved: 'Eliminates brittle regex routing, prevents hardcoded URLs, and guarantees standardized HTTP response generation.',
      mentalModel: 'The Telephone Switchboard and Operator: The incoming call arrives at the central switchboard (ROOT_URLCONF). The switchboard operator checks the area code and extension (Path Converters), converts them to a direct department line (Modular include()), and rings the specific specialist desk (View Function). The specialist hears the client request (HttpRequest) and must hand back an official signed document (HttpResponse).',
      realWorldUse: 'RESTful API routing, public-facing content URLs, authenticated client endpoints, and microservice dispatchers.',
      commonMistakes: [
        'Returning a raw Python dict or string from a view instead of wrapping it in JsonResponse(data) or HttpResponse(text), resulting in a 500 error.',
        'Hardcoding URL paths (e.g. href="/api/v1/sensors/12/") instead of using reverse("api:sensor_detail", kwargs={"pk": 12}).',
        'Passing safe=True to JsonResponse when serializing a top-level list, which throws a TypeError.',
        'Forgetting the trailing slash in route definitions when APPEND_SLASH is enabled in settings.',
      ],
      commonMisconceptions: [
        'Class-Based Views (CBVs) are superior to Function-Based Views (FBVs) in all cases (FBVs provide superior clarity, explicit control flow, and simplicity for microservices and targeted endpoints).',
        'request.GET can only contain one value per key (QueryDict.getlist() handles multiple values for the same key, e.g. ?tag=web&tag=python).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b25-d124-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Hierarchical URLconf with Path Converters and Robust Function-Based Views',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates modular hierarchical routing with path converters, reverse resolution, and Function-Based Views returning typed JSON responses.',
      codeSnippet: `# urls.py (Main Routing Dispatcher)
from django.urls import path, include

urlpatterns = [
    path("api/v1/telemetry/", include(("telemetry.urls", "telemetry"), namespace="telemetry")),
]

# telemetry/urls.py (Modular App Router)
from django.urls import path
from . import views

urlpatterns = [
    path("", views.telemetry_index_view, name="index"),
    path("<int:sensor_id>/", views.sensor_detail_view, name="sensor_detail"),
    path("<uuid:batch_id>/status/", views.batch_status_view, name="batch_status"),
]

# telemetry/views.py (Strict Function-Based Views)
import uuid
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed
from django.urls import reverse

# In-memory mock store (adhering to STRICT ZERO-ORM firewall)
MOCK_SENSORS = {
    101: {"id": 101, "name": "Lidar Front", "status": "ACTIVE"},
    102: {"id": 102, "name": "Barometer A", "status": "IDLE"},
}

def telemetry_index_view(request: HttpRequest) -> HttpResponse:
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])
    
    # Return top-level array safely with safe=False
    sensor_list = list(MOCK_SENSORS.values())
    return JsonResponse(sensor_list, safe=False)

def sensor_detail_view(request: HttpRequest, sensor_id: int) -> HttpResponse:
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    sensor = MOCK_SENSORS.get(sensor_id)
    if not sensor:
        return JsonResponse({"error": f"Sensor {sensor_id} not found"}, status=404)

    # Demonstrate reverse URL resolution
    detail_url = reverse("telemetry:sensor_detail", kwargs={"sensor_id": sensor_id})
    payload = {**sensor, "_links": {"self": detail_url}}
    return JsonResponse(payload)

def batch_status_view(request: HttpRequest, batch_id: uuid.UUID) -> HttpResponse:
    return JsonResponse({
        "batch_id": str(batch_id),
        "processed": True,
    })`,
      language: 'python',
      explanation: 'Demonstrates hierarchical routing via include(), typed path conversion (<int:sensor_id>, <uuid:batch_id>), defensive method filtering with HttpResponseNotAllowed, safe=False for JSON arrays, and programmatic reverse URL resolution.',
    } as ExampleBlock,
    {
      id: 'blk-b25-d124-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Implementing Path Converters and Enforcing View Contracts',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Create a view function route_sensor_action(request, sensor_id, action) validating method and parameters.',
        'Return HttpResponseNotAllowed if request.method is not POST or GET.',
        'Return 404 JsonResponse if sensor_id is not in the active registry.',
        'Return 200 JsonResponse containing action confirmation and canonical reverse URL.',
      ],
      starterArtifact: `def route_sensor_action(request, sensor_id, action):
  # TODO: Implement method check, sensor lookup, and JsonResponse
  pass`,
      expectedOutcome: `from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseNotAllowed
from django.urls import reverse

REGISTRY = {1: {"id": 1, "active": True}}

def route_sensor_action(request: HttpRequest, sensor_id: int, action: str) -> HttpResponse:
  if request.method not in ("GET", "POST"):
    return HttpResponseNotAllowed(["GET", "POST"])

  if sensor_id not in REGISTRY:
    return JsonResponse({"error": "Sensor not found"}, status=404)

  return JsonResponse({
    "sensor_id": sensor_id,
    "action": action,
    "status": "SUCCESS",
    "method": request.method,
  }, status=200)`,
      hints: [
        'A view function must always return an HttpResponse or subclass instance; returning a dict or None will crash Django.',
        'HttpResponseNotAllowed takes a list of permitted uppercase HTTP verbs.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_FOUNDATIONS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b25-d124-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Path Converters, Reverse URLs & View Contracts',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What happens if a Django Function-Based View returns a standard Python dictionary instead of an HttpResponse or JsonResponse instance?',
      options: [
        'Django raises a ValueError ("The view ... didn\'t return an HttpResponse object. It returned a dict instead.") and returns an HTTP 500 server error to the client.',
        'Django automatically serializes the dictionary to JSON and returns HTTP 200 OK.',
        'Django converts the dictionary into an HTML table using the default template.',
        'Django passes the dictionary directly to the WSGI gateway without headers.',
      ],
      correctIndex: 0,
      explanation: 'The Django view contract strictly requires returning an instance of HttpResponse (or a subclass such as JsonResponse). If a view returns a dict, None, or a string, the framework handler catches the invalid type and raises a ValueError, causing an HTTP 500 error.',
      misconceptionIdentified: 'Assuming Django views automatically serialize arbitrary Python return types like FastAPI or Flask.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b25-d124-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Explicit Routing Boundaries and Two-Way Resolution',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how Django\'s URLconf architecture separates URL design from view implementation.',
      guidingQuestions: [
        'Why is two-way URL resolution (forward path matching and reverse URL generation) essential for maintainable software architectures?',
        'How do built-in path converters prevent entire classes of type coercion and validation bugs before request parameters reach the view logic?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b25-d124-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 025 Reference Sheet: URLconf & View Standards',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0: URL dispatcher and Path Converters',
          url: 'https://docs.djangoproject.com/en/6.0/topics/http/urls/',
        },
        {
          title: 'Django 6.0: Writing Views and View Contracts',
          url: 'https://docs.djangoproject.com/en/6.0/topics/http/views/',
        },
        {
          title: 'Django 6.0: Request and Response Objects',
          url: 'https://docs.djangoproject.com/en/6.0/ref/request-response/',
        },
      ],
      documentationExtracts: [
        'Django URLconf: To design URLs for an app, you create a Python module informally called a URLconf. This module is pure Python code and is a mapping between URL path expressions to Python functions (your views).',
        'Django Views: A view function, or view for short, is a Python function that takes a Web request and returns a Web response. This response can be the HTML contents of a Web page, or a redirect, or a 404 error, or an XML document, or an image... or anything, really.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 125: BUILD — Django Template Language (DTL), Template Inheritance & Auto-Escaping Security ──
export const DAY_125_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w25-025',
  dayNumber: 3,
  title: 'Django Template Language (DTL), Template Inheritance & Auto-Escaping Security',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b25-d125-01',
      type: 'THEORY',
      order: 1,
      title: 'The DTL Compilation Pipeline, Template Inheritance & Built-in XSS Auto-Escaping',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the Django Template Language (DTL) architecture: the two-step compile-and-render pipeline, template inheritance tree ({% extends %}, {% block %}, {% include %}), variable dot-lookup resolution, context processors, and contextual HTML auto-escaping for XSS prevention.',
      whatItIs: 'The Django Template Language provides a secure, declarative presentation engine:\n1. The Two-Step Compilation Pipeline:\n   - Step 1: Compilation. The template source string is parsed into an abstract syntax tree of Node objects (TextNode, VariableNode, BlockNode).\n   - Step 2: Rendering. The compiled Node tree is evaluated against a Context dictionary, outputting the final rendered string.\n2. Template Inheritance Tree:\n   - {% extends "base.html" %}: MUST be the first template tag in a child template. Establishes a parent-child relationship.\n   - {% block content %} ... {% endblock %}: Defines named override regions that child templates populate or extend using {{ block.super }}.\n   - {% include "partials/nav.html" %}: Inlines reusable template fragments into the current context.\n3. Variable Dot-Lookup Algorithm:\n   - When DTL encounters {{ item.attr }}, it executes a strict sequential fallback resolution:\n     1. Dictionary lookup: item["attr"]\n     2. Attribute lookup: getattr(item, "attr")\n     3. Method call: item.attr() (executed only if method takes 0 arguments and does not have alters_data = True)\n     4. List-index lookup: item[int(attr)]\n     5. If unresolved, falls back to string_if_invalid (empty string by default).\n4. Built-in HTML Auto-Escaping (XSS Defense):\n   - DTL automatically escapes five critical HTML characters in all variable interpolations:\n     < -> &lt;\n     > -> &gt;\n     & -> &amp;\n     \' -> &#x27;\n     " -> &quot;\n   - Disabling Auto-Escaping: The |safe filter or {% autoescape off %} tag marks strings as SafeString. MUST NEVER be used on untrusted user-supplied input.',
      whyItExists: 'Enables clean separation of presentation markup from application logic while enforcing bulletproof Cross-Site Scripting (XSS) defense by default.',
      problemSolved: 'Eliminates code duplication across web layouts and prevents stored and reflected XSS attacks from executing malicious scripts in the browser.',
      mentalModel: 'The Stencil and the Colored Marker: The parent template (base.html) is a sturdy architectural stencil with cutout holes (blocks) for the title, header, and main content. The child template provides the specific colors and text to fill in those cutouts. The auto-escaping engine is a safety filter over the ink: if someone tries to slip corrosive acid (script tags) into the marker, the filter instantly neutralizes it into harmless inert mineral water (&lt;script&gt;) before it touches the paper.',
      realWorldUse: 'Server-side rendered enterprise dashboards, public web portals, administrative consoles, and automated HTML email templating.',
      commonMistakes: [
        'Placing HTML markup or comments before {% extends "base.html" %}, which breaks the inheritance compiler and raises a TemplateSyntaxError.',
        'Applying the |safe filter to untrusted user input or URL query parameters, introducing critical XSS vulnerabilities.',
        'Attempting to execute complex business logic or Python code with arguments inside template tags (DTL intentionally prohibits function calls with arguments to preserve MVC separation).',
        'Confusing {% include %} with {% extends %}; include simply copies a snippet, while extends establishes the skeletal inheritance structure.',
      ],
      commonMisconceptions: [
        'DTL executes raw Python code inside templates (DTL is a sandboxed language that explicitly disallows arbitrary Python expressions).',
        'Disabling auto-escaping is required to render line breaks (use the |linebreaks filter instead of marking raw strings as safe).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b25-d125-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Production Template Inheritance Tree with Secure Variable Escaping',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates base layout templating with block overrides, semantic HTML5 landmarks, and verifying automatic XSS character neutralization.',
      codeSnippet: `<!-- templates/base.html (Canonical Semantic Base Layout) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% block title %}Career OS{% endblock %}</title>
  <link rel="stylesheet" href="{% block stylesheet %}/static/css/main.css{% endblock %}">
</head>
<body>
  <header>
    {% include "partials/navigation.html" %}
  </header>

  <main id="main-content">
    {% block content %}
    <!-- Child templates override this region -->
    {% endblock %}
  </main>

  <footer>
    <p>&copy; {% now "Y" %} Career OS Engineering Portal</p>
  </footer>
</body>
</html>

<!-- templates/telemetry/dashboard.html (Child Template) -->
{% extends "base.html" %}

{% block title %}Telemetry Dashboard | {{ block.super }}{% endblock %}

{% block content %}
<article>
  <header>
    <h1>Active Sensor Grid</h1>
  </header>

  <!-- AUTO-ESCAPING DEMONSTRATION:
       If untrusted_label contains '<script>alert(1)</script>',
       DTL renders: '&lt;script&gt;alert(1)&lt;/script&gt;'
       The browser prints it as plain text and NEVER executes script! -->
  <p class="status-summary">Grid Status: <strong>{{ grid_status }}</strong></p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Sensor ID</th>
        <th>Telemetry Reading</th>
      </tr>
    </thead>
    <tbody>
      {% for sensor in sensors %}
      <tr>
        <td>{{ sensor.id }}</td>
        <td>{{ sensor.reading }}</td>
      </tr>
      {% empty %}
      <tr>
        <td colspan="2">No active sensors detected.</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</article>
{% endblock %}`,
      language: 'html',
      explanation: 'The child template extends base.html, using {{ block.super }} to retain parent title branding. The {% for ... empty %} structure handles empty data sets cleanly. All variable interpolations automatically escape dangerous HTML characters to prevent XSS.',
    } as ExampleBlock,
    {
      id: 'blk-b25-d125-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Authoring Semantic DTL Inheritance and Testing Auto-Escaping',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Construct a child template extending base.html with a content block.',
        'Iterate over a telemetry_records collection and render an accessible table.',
        'Inject a potentially malicious string containing <script> and verify it is auto-escaped into &lt;script&gt;.',
        'Ensure the extends tag is strictly the first line of the child template.',
      ],
      starterArtifact: `<!-- Child Template -->
<div>Unwanted top markup</div>
{% extends "base.html" %}
{% block content %}
<!-- TODO: Render telemetry records and verify escaping -->
{% endblock %}`,
      expectedOutcome: `{% extends "base.html" %}

{% block title %}Sensor Telemetry Report{% endblock %}

{% block content %}
<section aria-labelledby="report-heading">
  <h1 id="report-heading">Sensor Telemetry Report</h1>
  <p>Operator Note: {{ user_input }}</p>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      {% for item in telemetry_records %}
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.value }}</td>
      </tr>
      {% empty %}
      <tr>
        <td colspan="2">No telemetry available</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</section>
{% endblock %}`,
      hints: [
        'The {% extends %} tag must be on line 1; any characters or comments before it will cause a TemplateSyntaxError.',
        'Never wrap user_input in the |safe filter.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_FOUNDATIONS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b25-d125-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: DTL Dot-Lookup & Contextual Auto-Escaping Invariants',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which sequence correctly represents how the Django Template Language resolves variable dot-notation {{ user.profile }} and handles HTML characters?',
      options: [
        'DTL evaluates dictionary lookup, then attribute lookup, then 0-argument method call, then list index; all interpolated variables automatically escape <, >, &, \', and " to neutralize Cross-Site Scripting (XSS).',
        'DTL evaluates method calls first with arbitrary arguments, and auto-escaping is only enabled if the |escape filter is manually appended to every variable.',
        'DTL translates dot notation into SQL queries directly and disables escaping for administrative users.',
        'DTL evaluates dot notation via regex matching on the file system and converts all variables to base64.',
      ],
      correctIndex: 0,
      explanation: 'Per the Django documentation, variable dot lookup follows a strict order: dictionary lookup -> attribute lookup -> method call (if takes 0 arguments) -> list-index. DTL enables HTML auto-escaping by default, converting <, >, &, \', and " to safe HTML entities to prevent XSS.',
      misconceptionIdentified: 'Believing DTL allows arbitrary method arguments or requires manual escaping on every variable.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b25-d125-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Batch 025 Engineering Retrospective: Launching Semester 2 with Solid Foundations',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on entering Semester 2: how starting Django from gateway interfaces, routing, and templates (without jumping prematurely into database ORM) builds deeper architectural confidence.',
      guidingQuestions: [
        'How does understanding the web server gateway interface (WSGI/ASGI) empower you to deploy and debug production applications effectively?',
        'Why is template auto-escaping such a critical first line of defense in modern application security?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b25-d125-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 025 Reference Sheet: Django Template Architecture & Security',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: The Django Template Language',
          url: 'https://docs.djangoproject.com/en/6.0/topics/templates/',
        },
        {
          title: 'Django Security: Cross-Site Scripting (XSS) Protection',
          url: 'https://docs.djangoproject.com/en/6.0/topics/security/#cross-site-scripting-xss-protection',
        },
        {
          title: 'OWASP: Cross Site Scripting Prevention Cheat Sheet',
          url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html',
        },
      ],
      documentationExtracts: [
        'Django Templates: Template inheritance allows you to build a base "skeleton" template that contains all the common elements of your site and defines blocks that child templates can override.',
        'Django Security: By default, the Django template system automatically escapes all variable outputs that could be dangerous in an HTML context.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 126: DEBUG — Request/Response Pipeline Diagnostics, Custom Telemetry Middleware & Static Asset Resolution ──
export const DAY_126_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w25-025',
  dayNumber: 4,
  title: 'Request/Response Pipeline Diagnostics, Custom Telemetry Middleware & Static Asset Resolution',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b25-d126-01',
      type: 'THEORY',
      order: 1,
      title: 'Middleware Pipeline Execution Order, Exception Lifecycle & Production Static Asset Serving',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 middleware internals: the onion-layer execution lifecycle (__call__, process_view, process_exception), ordering dependencies, custom correlation ID and latency telemetry injection, exception sanitization without leaking debug tracebacks, and production static asset pipeline integration with WhiteNoise.',
      whatItIs: 'Middleware forms the cross-cutting request/response processing pipeline in Django:\n1. The Middleware Onion Architecture:\n   - Each middleware is a callable initialized with get_response. On each request, execution travels DOWN the MIDDLEWARE list (request phase), invokes the view, and bubbles UP in reverse order (response phase).\n   - Short-circuiting: If any middleware returns an HttpResponse during the request phase, downstream middleware and views are bypassed, and execution immediately unwinds up the response chain.\n2. Key Lifecycle Hooks:\n   - __call__(request): Standard wrapping logic before and after downstream invocation.\n   - process_view(request, view_func, view_args, view_kwargs): Called just before view execution. Can return an HttpResponse to bypass the view.\n   - process_exception(request, exception): Called when an unhandled exception occurs in a view or downstream middleware. Can return an HttpResponse (such as a sanitized error page or JSON payload with an incident tracking code) or None to pass the exception upstream.\n3. Telemetry Invariants:\n   - X-Correlation-ID: A globally unique identifier (UUID4) attached to request state (request.correlation_id) and returned in response headers for end-to-end distributed tracing.\n   - X-Response-Time-MS: Elapsed wall-clock time calculated via time.perf_counter() around downstream execution.\n4. Static Assets & WhiteNoise Integration:\n   - In development (DEBUG = True), Django\'s runserver serves static files automatically.\n   - In production (DEBUG = False), Django\'s static handler is disabled for security and performance. WhiteNoiseMiddleware (placed directly after SecurityMiddleware) intercepts static URL prefixes and serves static files directly through WSGI/ASGI with Brotli/Gzip compression and immutable cache-control headers derived from hash-versioned filenames generated by collectstatic.',
      whyItExists: 'Provides clean separation of concerns for cross-cutting application infrastructure (telemetry, security headers, exception handling, static files) without polluting individual view functions.',
      problemSolved: 'Prevents debug traceback leakage, enables distributed request correlation across microservices, and guarantees reliable static asset delivery without requiring dedicated CDN infrastructure during intermediate deployments.',
      mentalModel: 'The Concentric Security & Instrumentation Onion: An incoming request enters through outer defense layers (SecurityMiddleware), passes through identity checkpoints (SessionMiddleware), receives an entry timestamp and tracking badge (CorrelationTelemetryMiddleware), reaches the executive vault (View), and on the way out is inspected, sealed with cryptographic stamps, and tracked with an exit timestamp before exiting the facility.',
      realWorldUse: 'Production web gateways serving millions of requests where tracing headers, latency metrics, and fail-safe exception masking are non-negotiable compliance requirements.',
      commonMistakes: [
        'Placing custom telemetry middleware after SessionMiddleware or AuthenticationMiddleware when unauthenticated or rejected requests need correlation IDs.',
        'Returning a raw traceback or uncaught exception to users in production, leaking database credentials, environment variables, or file paths.',
        'Forgetting to run collectstatic before starting the production WSGI server when WhiteNoise with CompressedManifestStaticFilesStorage is enabled.',
        'Misordering WhiteNoiseMiddleware (it must be placed immediately below SecurityMiddleware to ensure compression and security headers apply correctly).',
      ],
      commonMisconceptions: [
        'process_exception is called for every exception (it is only called for unhandled exceptions raised in views or downstream middleware, never if a previous middleware caught and handled it).',
        'WhiteNoise is too slow for production (WhiteNoise serves static files directly from the Python process with kernel-level sendfile and efficient caching, handling thousands of requests per second for standard sites).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b25-d126-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Production Telemetry Middleware & WhiteNoise Static Gateway Configuration',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `# telemetry_middleware.py
import time
import uuid
import logging
from django.http import JsonResponse, HttpRequest, HttpResponse

logger = logging.getLogger('gateway.telemetry')

class CorrelationTelemetryMiddleware:
    """
    Injects or propagates X-Correlation-ID and computes end-to-end latency.
    Attaches X-Correlation-ID and X-Response-Time-MS to outgoing HTTP responses.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        # Extract existing correlation ID or generate a fresh UUID4
        correlation_id = request.headers.get('X-Correlation-ID', str(uuid.uuid4()))
        request.correlation_id = correlation_id

        start_time = time.perf_counter()
        
        # Invoke downstream pipeline
        response = self.get_response(request)

        # Calculate latency in milliseconds
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        # Attach telemetry headers
        response['X-Correlation-ID'] = correlation_id
        response['X-Response-Time-MS'] = f"{elapsed_ms:.2f}"

        return response

    def process_exception(self, request: HttpRequest, exception: Exception):
        """
        Catches unhandled exceptions, logs internal details, and returns
        a sanitized response with the correlation ID to avoid leaking tracebacks.
        """
        correlation_id = getattr(request, 'correlation_id', 'unknown')
        logger.error(
            "Unhandled exception [correlation_id=%s]: %s",
            correlation_id,
            exception,
            exc_info=True
        )
        return JsonResponse(
            {
                "error": "Internal Server Error",
                "message": "An unexpected error occurred. Please quote the correlation ID when contacting support.",
                "correlation_id": correlation_id,
            },
            status=500
        )

# settings.py configuration snippet:
# MIDDLEWARE = [
#     'django.middleware.security.SecurityMiddleware',
#     'whitenoise.middleware.WhiteNoiseMiddleware',
#     'core.middleware.CorrelationTelemetryMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
# ]
# STATIC_URL = '/static/'
# STATIC_ROOT = BASE_DIR / 'staticfiles'
# STORAGES = {
#     "staticfiles": {
#         "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
#     },
# }
`,
      explanation: 'Demonstrates a production-grade Django middleware adhering to Django 6.0 and Python 3.14 standards: robust correlation ID extraction/generation, precise performance timing using time.perf_counter(), process_exception sanitization that protects sensitive error tracebacks, and WhiteNoise settings placement.',
    } as ExampleBlock,
    {
      id: 'blk-b25-d126-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Diagnosing Pipeline Ordering Bugs & Resolving Production Static Asset 404s',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Audit the MIDDLEWARE setting order and verify where custom telemetry and exception sanitization must be positioned relative to built-in middlewares.',
        'Implement process_exception to intercept unhandled exceptions and return a sanitized JsonResponse containing the correlation ID while logging the traceback securely on the server.',
        'Configure WhiteNoiseMiddleware immediately below SecurityMiddleware and set STATIC_ROOT and CompressedManifestStaticFilesStorage.',
        'Execute collectstatic in a simulated build pipeline to generate the staticfiles manifest.',
      ],
      expectedOutcome: `# 1. Position CorrelationTelemetryMiddleware near the top of MIDDLEWARE so it surrounds all subsequent layers:
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'gateway.middleware.CorrelationTelemetryMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
]

# 2. In settings.py:
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STORAGES = {
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}
`,
      hints: [
        'Remember that middleware executes downwards for requests and upwards for responses.',
        'process_exception only catches exceptions from downstream components; placing exception handling at the top guarantees it catches errors from all lower middleware and views.',
        'WhiteNoise must be placed immediately below SecurityMiddleware so it can serve static files before session or database middleware run.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_FOUNDATIONS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b25-d126-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Middleware Ordering, Exception Safety & Static Delivery',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In what order do middleware layers execute during incoming requests and outgoing responses, and what is the return contract of process_exception(request, exception)?',
      options: [
        'Top-to-bottom for incoming requests; bottom-to-top (reverse order) for outgoing responses. process_exception must return an HttpResponse (halting propagation) or None (continuing default exception handling).',
        'Top-to-bottom for both incoming and outgoing phases. process_exception must return boolean True or False.',
        'Bottom-to-top for both incoming and outgoing phases. process_exception is a void method that cannot return an HttpResponse.',
        'Middleware executes concurrently using background thread pools. process_exception must re-raise the exception wrapped in a tuple.',
      ],
      correctIndex: 0,
      explanation: 'Django middleware forms an onion architecture: request phases execute downwards from top-to-bottom, while response phases execute upwards in reverse order. If process_exception returns an HttpResponse, exception propagation halts and that response is returned; returning None allows default exception handling to continue.',
      misconceptionIdentified: 'Believing middleware executes in the same direction for both request and response phases, or that process_exception cannot return an HttpResponse.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b25-d126-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Batch 025 Engineering Retrospective: Middleware as Cross-Cutting Infrastructure',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how middleware acts as a declarative infrastructure layer in Django applications.',
      guidingQuestions: [
        'How does centralizing telemetry and error masking in middleware prevent code duplication across individual view functions?',
        'What are the security and performance implications of improper middleware ordering?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b25-d126-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 025 Reference Sheet: Django Middleware & Static Asset Pipeline',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Middleware',
          url: 'https://docs.djangoproject.com/en/6.0/topics/http/middleware/',
        },
        {
          title: 'WhiteNoise Documentation: Serving Static Assets',
          url: 'https://whitenoise.readthedocs.io/en/latest/',
        },
        {
          title: 'Django 6.0 Documentation: Managing Static Files',
          url: 'https://docs.djangoproject.com/en/6.0/howto/static-files/',
        },
      ],
      documentationExtracts: [
        'Django Middleware: Middleware is a framework of hooks into Django\'s request/response processing. It\'s a light, low-level "plugin" system for globally altering Django\'s input or output.',
        'WhiteNoise: With WhiteNoise, your web app serves its own static files without relying on Nginx, Amazon S3, or any other external service. It is designed to work in both modern PaaS environments and traditional hosting.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 127: TRANSFER — Formative Assessment: Secure Stateless Web Gateway & Dynamic Template Portal ──
export const DAY_127_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m7-w25-025',
  title: 'Formative Assessment: Secure Stateless Web Gateway & Dynamic Template Portal',
  type: 'FORMATIVE',
  mode: 'FORMATIVE',
  passingScore: 80,
  timeLimitMinutes: 60,
  rubric: [
    {
      id: 'rub-b25-01',
      title: 'Gateway Architecture & Production Settings Security',
      description: 'WSGI/ASGI gateway compatibility, Python 3.14 runtime, Django 6.0.8 security baseline, DEBUG=False, strict ALLOWED_HOSTS, and externalized SECRET_KEY.',
      weight: 0.20,
    },
    {
      id: 'rub-b25-02',
      title: 'Hierarchical Routing & View Contract Enforcement',
      description: 'Modular URLconf decomposition with include(), typed path converters (<int>, <str>, <slug>, <uuid>), reverse URL resolution, and strict HttpRequest/HttpResponse contracts.',
      weight: 0.20,
    },
    {
      id: 'rub-b25-03',
      title: 'DTL Template Architecture & XSS Auto-Escaping Defense',
      description: 'Multi-level template inheritance ({% extends %}, {% block %}), sequential dot-lookup resolution, safe custom filters, and contextual HTML auto-escaping without raw unsanitized output.',
      weight: 0.20,
    },
    {
      id: 'rub-b25-04',
      title: 'Custom Telemetry & Exception Handling Middleware',
      description: 'Custom middleware injecting X-Correlation-ID and X-Response-Time-MS headers, proper middleware ordering, and process_exception error masking preventing traceback leakage.',
      weight: 0.20,
    },
    {
      id: 'rub-b25-05',
      title: 'WhiteNoise Static Asset Hardening & Performance',
      description: 'WhiteNoise middleware configuration, STATIC_URL/STATIC_ROOT configuration, hash-versioned caching with CompressedManifestStaticFilesStorage, and collectstatic verification.',
      weight: 0.20,
    },
  ],
};

export const DAY_127_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w25-025',
  dayNumber: 5,
  title: 'Formative Assessment: Secure Stateless Web Gateway & Dynamic Template Portal',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b25-d127-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Formative Assessment: Build and Harden the Stateless Web Gateway & Dynamic Portal',
      estimatedMinutes: 75,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Enterprise Healthcare Telemetry & Stateless Ingress Web Gateway',
      task: 'Build a production-hardened stateless web gateway running Django 6.0.8 on Python 3.14 with modular URLconf routing, dynamic DTL template rendering with auto-escaping, custom middleware injecting X-Correlation-ID and latency headers, process_exception traceback masking, and WhiteNoise hash-versioned static serving with zero ORM database dependencies.',
      constraints: [
        'Must pin Django==6.0.8 running on Python 3.14 baseline.',
        'Strict zero-ORM firewall: ZERO database models, zero migrations, and zero database engine configurations.',
        'All views must strictly enforce the HttpRequest -> HttpResponse contract.',
        'All unhandled 500 exceptions must return a sanitized response referencing the correlation ID without leaking stack traces.',
        'All HTML template outputs must rely on contextual auto-escaping; never use the |safe filter on unvalidated user input.',
      ],
      difficulty: 'ADVANCED',
      timeExpectationMinutes: 75,
      targetCompetencyId: COMPETENCY_ID_DJANGO_FOUNDATIONS,
      assessmentRef: 'asm-pfs-m7-w25-025',
    } as TransferChallengeBlock,
    {
      id: 'blk-b25-d127-02',
      type: 'REFLECTION',
      order: 2,
      title: 'Batch 025 Retrospective: Mastery of Stateless Django Architecture',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on completing Batch 025: how mastering Django as a pure stateless gateway (without database models) establishes a deeper understanding of web protocols, middleware pipelines, and security foundations before introducing data persistence.',
      guidingQuestions: [
        'How does a firm grasp of the HTTP request/response pipeline make debugging complex web systems easier?',
        'Why is it an architectural advantage that Django can operate cleanly as a stateless rendering engine without requiring an active database?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b25-d127-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Batch 025 Architectural Master Reference',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Release Notes & Security Baselines',
          url: 'https://docs.djangoproject.com/en/6.0/releases/6.0/',
        },
        {
          title: 'OWASP Top 10 Web Application Security Risks',
          url: 'https://owasp.org/www-project-top-ten/',
        },
        {
          title: 'The Twelve-Factor App: Config, Port Binding & Stateless Processes',
          url: 'https://12factor.net/',
        },
      ],
      documentationExtracts: [
        'Stateless Architecture: Twelve-Factor processes are stateless and share-nothing. Any data that needs to persist must be stored in a stateful backing service.',
        'Django Security: Never run production systems with DEBUG=True. Keep security patches updated by tracking maintenance releases like 6.0.8.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 025 MANIFEST (COMPLETE BATCH · DAYS 123–127 · 5 DAYS · 425 MIN) ──
export const BATCH_025_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m7-w25-025',
  batchCode: 'P2-M7-W25-BATCH025',
  title: 'Semester 2 Launch: Django 6.0 Architecture, Gateway Interfaces, Template Foundations & Pipeline Middleware',
  difficulty: 'ADVANCED',
  days: [
    DAY_123_MANIFEST,
    DAY_124_MANIFEST,
    DAY_125_MANIFEST,
    DAY_126_MANIFEST,
    DAY_127_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
};

