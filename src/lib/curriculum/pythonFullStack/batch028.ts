// src/lib/curriculum/pythonFullStack/batch028.ts
// Single Source of Truth for PINIT BATCH 028 (COMPLETE · DAYS 138–142): Month 7 · Week 28 · Days 1–5
// Enterprise User Modeling, Authentication Architecture, Session Security & Django RBAC
// Pedagogical Flow: UNDERSTAND (Custom User Models & Identity) -> APPLY (Session Security & Password Hashers) -> BUILD (Authorization & RBAC) -> DEBUG (Access Control & BOLA Defense) -> TRANSFER (Formative Assessment: Enterprise Security Gateway)

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

export const COMPETENCY_ID_USER_AUTH_AND_SECURITY = 'comp-pfs-m7-028';

// ── DAY 138: UNDERSTAND — Custom User Model Architecture, AUTH_USER_MODEL & Identity Fundamentals ──
export const DAY_138_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w28-028',
  dayNumber: 1,
  title: 'Custom User Model Architecture, AUTH_USER_MODEL & Identity Fundamentals',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b28-d138-01',
      type: 'THEORY',
      order: 1,
      title: 'Custom User Model Architecture, The AUTH_USER_MODEL Invariant & Identity Contracts',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 user authentication architecture on Python 3.14: the non-negotiable AUTH_USER_MODEL configuration invariant, the minimum AbstractBaseUser contract (USERNAME_FIELD, REQUIRED_FIELDS, BaseUserManager, is_active), and the foundational distinction between Authentication ("Who are you?") and Authorization ("What are you permitted to do?").',
      whatItIs: 'User identity is the security root of web applications:\n1. The Non-Negotiable AUTH_USER_MODEL Invariant:\n   - Django comes with a default User model (django.contrib.auth.models.User). However, Django core documentation strongly recommends setting up a custom user model when starting a project.\n   - INVARIANT: AUTH_USER_MODEL = "users.User" MUST be declared in settings.py BEFORE running the very first manage.py migrate on a new project.\n   - Why: Changing AUTH_USER_MODEL after initial migrations have been applied is notoriously difficult because existing foreign keys in django.contrib.admin, sessions, and third-party apps point to the historical table, requiring painful manual database schema surgery.\n2. Minimum AbstractBaseUser Contract:\n   - To implement a custom user model from scratch, subclass AbstractBaseUser and PermissionsMixin (or manage permissions manually).\n   - AbstractBaseUser provides core password hashing (password, last_login) and requires:\n     * USERNAME_FIELD: String name of the field that acts as the unique identifier (e.g. USERNAME_FIELD = "email"). Must be unique=True.\n     * REQUIRED_FIELDS: List of required field names prompted when creating a user via createsuperuser. MUST NOT include USERNAME_FIELD or password.\n     * is_active: Mandatory boolean field indicating whether the account is permitted to authenticate. Disabling accounts via is_active = False avoids deleting user rows and preserving relational referential integrity (foreign keys).\n3. Custom BaseUserManager Contract:\n   - A custom user model requires a dedicated BaseUserManager subclass implementing two core methods:\n     * create_user(username_or_email, password=None, **extra_fields): Normalizes email with self.normalize_email(email), hashes password via user.set_password(password), and saves to database.\n     * create_superuser(username_or_email, password=None, **extra_fields): Enforces is_staff=True, is_superuser=True, and calls create_user.\n4. Fundamental Architectural Distinction: Authentication vs Authorization:\n   - Authentication ("AuthN"): Answering "Who are you?" Validates credentials (passwords, tokens, biometric assertions, MFA) to establish identity.\n   - Authorization ("AuthZ"): Answering "What are you allowed to do?" Validates access control policies (roles, groups, object-level permissions).\n   - Pedagogical Boundary: Batch 028 focuses strictly on identity, password hashing, and session management. Role-based permissions, group hierarchies, and admin interfaces are covered starting on Day 140+.',
      whyItExists: 'Enables flexible, enterprise-grade identity models (such as email-based logins without usernames) while preventing costly migration failures and maintaining strict identity boundaries.',
      problemSolved: 'Eliminates brittle username-based legacy patterns and prevents schema deadlock when introducing custom authentication fields.',
      mentalModel: 'The Corporate Security Badge Office: Setting AUTH_USER_MODEL before migration is laying the physical turnstile wiring before pouring the concrete floor of the corporate lobby. The User Model is the photo ID badge itself. BaseUserManager is the badge printing machine that encodes the microchip. USERNAME_FIELD is the employee email printed across the front. is_active is the badge status: if an employee leaves, security flips the switch to inactive (is_active=False) rather than erasing their historical entry logs from the building registry.',
      realWorldUse: 'Enterprise SaaS platforms requiring email-only logins, multi-tenant B2B portals, and healthcare systems with strict credential lifecycles.',
      commonMistakes: [
        'Running manage.py migrate on a fresh project before configuring AUTH_USER_MODEL in settings.py.',
        'Including USERNAME_FIELD or password inside REQUIRED_FIELDS on a custom user model (Django automatically prompts for both; including them causes createsuperuser to fail).',
        'Deleting user rows from the database instead of setting is_active = False, breaking historical foreign key audit references.',
        'Using raw assignments like user.password = raw_password instead of user.set_password(raw_password), storing plaintext passwords in the database.',
      ],
      commonMisconceptions: [
        'Changing AUTH_USER_MODEL later in a project is easy with standard migrations (Django officially documents that changing AUTH_USER_MODEL mid-project is not supported by standard migrations).',
        'Authentication and Authorization are interchangeable terms (Authentication verifies identity; Authorization governs permissions).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b28-d138-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Enterprise Email-Based Custom User Model and Manager Implementation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class EnterpriseUserManager(BaseUserManager):
    """
    Custom manager for EnterpriseUser where email is the unique identifier.
    """
    def create_user(self, email: str, password: str | None = None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        
        # Normalize the email domain (e.g. lowercase domain component)
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        
        # Hash password securely via PBKDF2/Argon2
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
            
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str | None = None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class EnterpriseUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom User Model adhering to enterprise security standards:
    - Email as primary identifier (USERNAME_FIELD = 'email')
    - UUID primary key
    - Soft-deactivation via is_active
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=64, blank=True, default="")
    last_name = models.CharField(max_length=64, blank=True, default="")
    
    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this user should be treated as active."
    )
    is_staff = models.BooleanField(
        default=False,
        help_text="Designates whether the user can log into the admin site."
    )
    date_joined = models.DateTimeField(default=timezone.now)

    objects = EnterpriseUserManager()

    USERNAME_FIELD = "email"
    # REQUIRED_FIELDS is used by createsuperuser; do NOT include USERNAME_FIELD or password!
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        db_table = "auth_enterprise_users"
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self) -> str:
        return self.email
`,
      explanation: 'Demonstrates a production-ready custom user model on Python 3.14: implements normalize_email, set_password, set_unusable_password, UUID primary key, USERNAME_FIELD="email", and excludes email/password from REQUIRED_FIELDS.',
    } as ExampleBlock,
    {
      id: 'blk-b28-d138-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Implementing an Email-Based User Model Contract and Manager',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Define a custom CustomUserManager inheriting from BaseUserManager.',
        'Implement create_user ensuring email is validated, normalized with self.normalize_email(), and password hashed with user.set_password().',
        'Implement create_superuser ensuring is_staff=True and is_superuser=True.',
        'Define the CustomUser model with USERNAME_FIELD="email" and REQUIRED_FIELDS=["full_name"].',
      ],
      expectedOutcome: `from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]
`,
      hints: [
        'Never store raw passwords; always invoke set_password.',
        'REQUIRED_FIELDS must never contain USERNAME_FIELD.',
      ],
      targetCompetencyId: COMPETENCY_ID_USER_AUTH_AND_SECURITY,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b28-d138-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Custom User Models & Invariants',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why must AUTH_USER_MODEL be configured in settings.py BEFORE running initial database migrations on a new Django project?',
      options: [
        'Because changing AUTH_USER_MODEL mid-project creates broken foreign key references in django.contrib.admin and session tables, requiring manual database schema surgery not supported by automatic migrations.',
        'Because Python 3.14 refuses to import models that inherit from AbstractBaseUser after initial startup.',
        'Because Django automatically deletes all user records if AUTH_USER_MODEL is changed later.',
        'Because the email validator only works if configured before initial migrations.',
      ],
      correctIndex: 0,
      explanation: 'Django creates foreign key constraints in built-in apps (admin, contenttypes, sessions) referencing the user model. If you apply initial migrations against the default auth.User model and switch later, standard migrations cannot cleanly re-point those existing database foreign keys without extensive manual intervention.',
      misconceptionIdentified: 'Assuming Django migrations can automatically refactor all foreign keys across existing databases when switching user models mid-project.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b28-d138-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: The Architecture of Identity',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why decoupling identity (Authentication) from permissions (Authorization) is a foundational principle of scalable security architecture.',
      guidingQuestions: [
        'How does an email-based identity model accommodate modern identity providers (SSO, OAuth2, SAML) more cleanly than username-based models?',
        'Why is soft deactivation (is_active=False) vital for compliance and audit retention in regulated enterprise systems?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b28-d138-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 028 Reference Sheet: Custom User Models',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Customizing authentication in Django',
          url: 'https://docs.djangoproject.com/en/6.0/topics/auth/customizing/#substituting-a-custom-user-model',
        },
        {
          title: 'Django 6.0 Documentation: AbstractBaseUser Reference',
          url: 'https://docs.djangoproject.com/en/6.0/topics/auth/customizing/#django.contrib.auth.models.AbstractBaseUser',
        },
      ],
      documentationExtracts: [
        'Changing AUTH_USER_MODEL: Changing AUTH_USER_MODEL after migrations have been applied to your project is not straightforward and is not recommended.',
        'AbstractBaseUser: AbstractBaseUser provides the core implementation of a User model, including hashed passwords and tokenized password resets.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 139: APPLY — Authentication Backends, Session Security, Cookie Policies & Password Hasher Pipelines ──
export const DAY_139_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w28-028',
  dayNumber: 2,
  title: 'Authentication Backends, Session Security, Cookie Policies & Password Hasher Pipelines',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b28-d139-01',
      type: 'THEORY',
      order: 1,
      title: 'Authentication Backends, Session Cookie Hardening & Modern Password Hasher Pipelines',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 authentication internals on Python 3.14: custom authentication backends (authenticate, get_user), production session cookie security policies (HttpOnly, Secure, SameSite=Lax baseline, cycle_key session fixation defense), and modern password hashing algorithms (Argon2, PBKDF2) with constant-time verification.',
      whatItIs: 'Django provides extensible credential verification and hardened session management:\n1. Authentication Backends Architecture:\n   - In settings.py, AUTHENTICATION_BACKENDS lists classes evaluated sequentially when django.contrib.auth.authenticate(request, **credentials) is called.\n   - Contract for Custom Backends:\n     * authenticate(request, username=None, password=None, **kwargs): Verifies credentials. Returns a user instance if valid and active, or None if authentication fails.\n     * get_user(user_id): Retrieves user instance by primary key. Used by SessionMiddleware on subsequent requests.\n2. Session Security & Cookie Policies:\n   - When a user logs in, django.contrib.auth.login(request, user) serializes the user ID into the server-side session backend and calls request.session.cycle_key().\n   - Session Fixation Prevention: cycle_key() destroys the old session ID and generates a fresh session key upon authentication, neutralizing Session Fixation attacks.\n   - Production Session Cookie Invariants:\n     * SESSION_COOKIE_HTTPONLY = True: Prevents client-side JavaScript (document.cookie) from accessing the session token, neutralizing Cross-Site Scripting (XSS) session hijacking.\n     * SESSION_COOKIE_SECURE = True: Ensures the browser only transmits the cookie over encrypted HTTPS connections.\n     * SESSION_COOKIE_SAMESITE = "Lax": Default modern browser protection against Cross-Site Request Forgery (CSRF). Restricts cookie transmission on cross-site subrequests while permitting top-level navigation links.\n     * SESSION_COOKIE_AGE: Expiration window (default 1209600 seconds / 2 weeks). SESSION_EXPIRE_AT_BROWSER_CLOSE enables ephemeral sessions.\n3. Modern Password Hasher Pipelines (PASSWORD_HASHERS):\n   - Django stores passwords formatted as: <algorithm>$<iterations>$<salt>$<hash>.\n   - Algorithms:\n     * Argon2 (Argon2PasswordHasher): Winner of the Password Hashing Competition; memory-hard defense against GPU/ASIC brute-force cracking.\n     * PBKDF2 (PBKDF2PasswordHasher): Default standard using SHA256 with adaptive iteration stretching.\n   - Constant-Time Comparison: django.utils.crypto.constant_time_compare ensures verification times do not vary based on where strings mismatch, neutralizing timing side-channel attacks.\n   - Transparent Upgrades: When a user logs in with an older hasher (e.g. SHA1 or lower-iteration PBKDF2), Django automatically re-hashes their password with the preferred primary hasher without user interruption.',
      whyItExists: 'Protects user credentials from brute-force offline cracking, prevents session hijacking via XSS/CSRF, and neutralizes timing attack vectors.',
      problemSolved: 'Eliminates session fixation, defends against credential stuffing and rainbow table attacks, and provides seamless crypto-agility for password hashing.',
      mentalModel: 'The Multi-Tiered Vault & Keycard Exchange: Authenticating is walking up to the bank manager (AuthenticationBackend). You present your passkey. The manager does not compare your key against an unencrypted photo (plaintext); they run it through an intricate mechanical cryptographic labyrinth (Argon2 password hasher) where timing is identical whether the key is right or wrong (constant-time compare). Once approved, the manager shreds your visitor badge and issues a brand-new, tamper-evident executive keycard (session fixation defense: cycle_key) stored in an armored briefcase that no courier can peek into (HttpOnly, Secure, SameSite=Lax).',
      realWorldUse: 'High-security banking portals, HIPAA-compliant patient charts, single sign-on enterprise identity systems, and privacy-first web platforms.',
      commonMistakes: [
        'Deploying production systems with SESSION_COOKIE_SECURE = False, transmitting session tokens in plaintext over unencrypted HTTP.',
        'Setting SESSION_COOKIE_HTTPONLY = False so frontend scripts can read session IDs, opening the door to full account takeover via XSS.',
        'Writing authentication backends using standard == string comparisons instead of constant-time password verification (check_password), introducing timing side-channels.',
        'Neglecting to call cycle_key() during custom login workflows, leaving sessions vulnerable to session fixation.',
      ],
      commonMisconceptions: [
        'Django stores user passwords in the database (Django NEVER stores passwords; it stores a salted, computationally stretched cryptographic hash).',
        'SameSite="Lax" eliminates the need for CSRF tokens (SameSite="Lax" permits cookies on top-level GET navigations; CSRF tokens are still strictly required for state-changing POST requests).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b28-d139-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Custom Email Authentication Backend & Production Session Settings',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.http import HttpRequest

User = get_user_model()

class EmailAuthenticationBackend(BaseBackend):
    """
    Custom authentication backend authenticating users via case-insensitive email.
    Adheres strictly to Django 6.0 and Python 3.14 backend contracts.
    """
    def authenticate(self, request: HttpRequest | None, email: str | None = None, password: str | None = None, **kwargs):
        if not email or not password:
            return None

        # Case-insensitive lookup
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Run dummy password hasher check to mitigate timing attacks
            User().set_password(password)
            return None

        # Verify password using constant-time comparison and check active status
        if user.check_password(password) and self.user_can_authenticate(user):
            return user

        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def user_can_authenticate(self, user) -> bool:
        """Reject inactive users at the authentication layer."""
        return getattr(user, "is_active", True)

# Production settings.py security baseline:
# AUTHENTICATION_BACKENDS = [
#     "users.backends.EmailAuthenticationBackend",
# ]
# PASSWORD_HASHERS = [
#     "django.contrib.auth.hashers.Argon2PasswordHasher",
#     "django.contrib.auth.hashers.PBKDF2PasswordHasher",
# ]
# SESSION_COOKIE_HTTPONLY = True
# SESSION_COOKIE_SECURE = True
# SESSION_COOKIE_SAMESITE = "Lax"
# SESSION_COOKIE_AGE = 1209600
`,
      explanation: 'Exemplifies a production authentication backend: performs constant-time password checks even on missing users to prevent user-enumeration timing attacks, verifies user.is_active, and details the production session security settings baseline.',
    } as ExampleBlock,
    {
      id: 'blk-b28-d139-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Implementing an Email Backend and Auditing Session Security',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Implement an EmailAuthenticationBackend that accepts email and password.',
        'Ensure that when a user is not found, User().set_password(password) is called to equalize execution time and prevent user enumeration.',
        'Ensure inactive users (is_active=False) return None even with valid passwords.',
        'Configure the session security cookie settings in settings.py dictionary format.',
      ],
      expectedOutcome: `from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        if not email or not password:
            return None
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            User().set_password(password)
            return None
        if user.check_password(password) and user.is_active:
            return user
        return None

    def get_user(self, user_id):
        return User.objects.filter(pk=user_id).first()
`,
      hints: [
        'Always mitigate user enumeration timing attacks by running a dummy password check.',
        'Always check user.is_active before returning the authenticated user.',
      ],
      targetCompetencyId: COMPETENCY_ID_USER_AUTH_AND_SECURITY,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b28-d139-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Session Fixation & Cookie Policies',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What critical security vulnerability does django.contrib.auth.login() mitigate by automatically calling request.session.cycle_key() upon authentication?',
      options: [
        'Session Fixation: prevents an attacker who forced an unauthenticated session ID onto a victim from retaining access to the authenticated session after login.',
        'SQL Injection: drops the session table and re-indexes all user records.',
        'Buffer Overflow: empties the Python socket memory buffer.',
        'Cross-Site Scripting: disables all JavaScript on the login page.',
      ],
      correctIndex: 0,
      explanation: 'Session Fixation occurs when an attacker primes a victim\'s browser with a known session ID. If the server does not issue a new session identifier upon successful login, the attacker can use their pre-established session ID to impersonate the authenticated victim. Calling cycle_key() invalidates the pre-authentication session ID and issues a brand-new cryptographic session key.',
      misconceptionIdentified: 'Assuming session IDs should remain constant across the entire lifetime of a browser connection.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b28-d139-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Defense-in-Depth Session Hardening',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how multiple overlapping security controls (HttpOnly, Secure, SameSite, cycle_key) work together to protect user sessions.',
      guidingQuestions: [
        'If an application suffers from a stored XSS vulnerability, how does SESSION_COOKIE_HTTPONLY prevent full session token theft?',
        'Why are password hashing algorithms like Argon2 deliberately designed to be slow and memory-intensive?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b28-d139-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 028 Reference Sheet: Authentication & Session Security',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: How to use sessions',
          url: 'https://docs.djangoproject.com/en/6.0/topics/http/sessions/',
        },
        {
          title: 'Django 6.0 Documentation: Password management in Django',
          url: 'https://docs.djangoproject.com/en/6.0/topics/auth/passwords/',
        },
        {
          title: 'OWASP Session Management Cheat Sheet',
          url: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html',
        },
      ],
      documentationExtracts: [
        'Session Security: Django provides built-in mechanisms to protect sessions, including cookie flags like SESSION_COOKIE_HTTPONLY, SESSION_COOKIE_SECURE, and SESSION_COOKIE_SAMESITE.',
        'Password Hasher Pipelines: Django uses PBKDF2 with a SHA256 hash by default, and supports Argon2 via the argon2-cffi package for enhanced memory-hard security.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 140: BUILD — Authorization Architecture, Permission Modeling & Django Enterprise RBAC ──
export const DAY_140_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w28-028',
  dayNumber: 3,
  title: 'Authorization Architecture, Permission Modeling & Django Enterprise RBAC',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b28-d140-01',
      type: 'THEORY',
      order: 1,
      title: 'Django Permission Architecture, PermissionsMixin & Group-Based RBAC',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 authorization architecture on Python 3.14: built-in permission generation, the auth_permission and auth_group relational schema, PermissionsMixin API contracts (has_perm, has_perms, get_all_permissions), custom Meta.permissions, and declarative view gating with PermissionRequiredMixin.',
      whatItIs: 'Django provides an extensible, relational Role-Based Access Control (RBAC) subsystem:\n1. Built-In Permission Schema:\n   - For every registered model, Django automatically creates four permissions in the auth_permission table:\n     * add_<model>, change_<model>, delete_<model>, view_<model>.\n   - Database tables: auth_permission (tied to django_content_type), auth_group, auth_group_permissions, and user mapping tables (user_groups, user_permissions).\n2. The PermissionsMixin Contract:\n   - User models subclassing PermissionsMixin inherit granular authorization methods:\n     * user.has_perm("app_label.codename"): Returns True if the user has the permission directly or via group membership. Always returns True for superusers.\n     * user.has_perms(["app.perm1", "app.perm2"]): Validates a list of permissions.\n     * user.get_all_permissions(): Returns a set of all permission strings active for the user.\n     * user.get_group_permissions(): Returns only permissions inherited from assigned groups.\n3. Custom Model Permissions:\n   - Domain-specific permissions are declared on the model\'s inner Meta class:\n     class Meta:\n       permissions = [\n         ("can_sign_report", "Can digitally sign clinical report"),\n         ("can_archive_record", "Can archive patient record"),\n       ]\n4. Declarative View Gating:\n   - Class-Based Views (CBVs): Inherit PermissionRequiredMixin and declare permission_required = "records.can_sign_report". Setting raise_exception = True returns an immediate HTTP 403 Forbidden response instead of redirecting unauthenticated or unauthorized users to the login page.\n   - Function-Based Views (FBVs): Decorate with @permission_required("records.can_sign_report", raise_exception=True).\n5. Enterprise Role Hierarchies:\n   - Groups represent functional business roles (e.g. "Clinician", "Auditor", "BillingAdmin"). Permissions are granted to groups, and users are assigned to groups, decoupling individual user management from access policy definition.',
      whyItExists: 'Separates authorization policies from application business logic, enabling centralized, auditable access governance across enterprise applications.',
      problemSolved: 'Eliminates ad-hoc if user.role == "admin" condition checks scattered throughout views, providing a standardized, database-backed security model.',
      mentalModel: 'The Corporate Security Keycard Access System: The Building Security Office issues standard keycard profiles (Groups). A "Laboratory Scientist" keycard contains authorized door codes (Permissions: view_lab, operate_centrifuge). An individual scientist (User) is assigned the "Laboratory Scientist" keycard profile. When scanning at the lab door (PermissionRequiredMixin), the electronic lock checks if the card profile holds the required door code. Superusers carry a Master Key that mechanically bypasses every digital lock.',
      realWorldUse: 'Regulated healthcare applications, financial transaction approval systems, multi-tiered enterprise SaaS portals, and compliance-driven audit workflows.',
      commonMistakes: [
        'Hardcoding string role checks like if request.user.role == "auditor" instead of evaluating discrete capabilities via request.user.has_perm("compliance.view_audit_log").',
        'Omitting raise_exception = True on PermissionRequiredMixin, causing unauthorized users to be redirected to the login page instead of receiving an explicit HTTP 403 Forbidden.',
        'Assigning dozens of individual permissions directly to user records instead of assembling cohesive roles via Groups.',
        'Assuming user.has_perm() automatically checks object-level record ownership (model-level permissions only verify coarse entity capabilities).',
      ],
      commonMisconceptions: [
        'Superuser accounts need to be explicitly assigned to groups (Django\'s has_perm automatically returns True for is_superuser=True without checking database tables).',
        'Adding permissions to Meta.permissions automatically creates them without running migrations (Django requires makemigrations and migrate to populate auth_permission).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b28-d140-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Enterprise Healthcare Clinical Report RBAC Implementation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `import uuid
from django.db import models
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.views.generic import UpdateView
from django.core.exceptions import PermissionDenied

# 1. Model with Custom Capability Permissions
class ClinicalReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.CharField(max_length=64, db_index=True)
    diagnosis = models.TextField()
    is_signed = models.BooleanField(default=False)
    signed_by = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='signed_reports'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        permissions = [
            ("can_sign_report", "Can digitally sign clinical report"),
            ("can_archive_report", "Can archive historical patient report"),
        ]

# 2. Programmatic Group & Permission Provisioning
def setup_healthcare_roles():
    clinician_group, _ = Group.objects.get_or_create(name="Clinician")
    auditor_group, _ = Group.objects.get_or_create(name="MedicalAuditor")

    sign_perm = Permission.objects.get(
        codename="can_sign_report",
        content_type__app_label="records"
    )
    view_perm = Permission.objects.get(
        codename="view_clinicalreport",
        content_type__app_label="records"
    )

    # Clinicians can view and digitally sign reports
    clinician_group.permissions.add(sign_perm, view_perm)
    # Auditors have read-only access to clinical reports
    auditor_group.permissions.add(view_perm)

# 3. Secure CBV Gating with Explicit 403 Forbidden
class SignClinicalReportView(PermissionRequiredMixin, UpdateView):
    model = ClinicalReport
    fields = ['is_signed']
    template_name = 'records/sign_report.html'
    permission_required = 'records.can_sign_report'
    raise_exception = True  # Yields 403 Forbidden rather than login redirect

    def form_valid(self, form):
        report = form.save(commit=False)
        report.is_signed = True
        report.signed_by = self.request.user
        report.save()
        return super().form_valid(form)`,
      explanation: 'Demonstrates the complete Django RBAC triad: declaring granular custom capabilities via Meta.permissions, assembling groups with specific permission subsets, and enforcing declarative access control in class-based views with raise_exception=True.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b28-d140-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Lab: Assembling Group-Based Role Tiers & Permission Gating',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Define custom model permissions for an audit document management app, script a role provisioning utility, and secure a document review view.',
      instructions: [
        'Declare custom permissions ("can_approve_document", "can_publish_document") on an AuditDocument model.',
        'Write a utility function provision_roles() that establishes "DocumentReviewer" and "ComplianceOfficer" groups with appropriate permission subsets.',
        'Create a DocumentApprovalView inheriting PermissionRequiredMixin with permission_required = "audit.can_approve_document" and raise_exception = True.',
        'Verify that an unauthenticated user or a user without the permission receives an HTTP 403 Forbidden status.',
      ],
      hints: [
        'Permissions in Django are looked up using the format "<app_label>.<codename>".',
        'Always set raise_exception = True on PermissionRequiredMixin for API or authenticated portals to avoid misleading 302 redirects.',
      ],
      expectedOutcome: 'A clean, maintainable group-based RBAC architecture where business capabilities are explicitly declared and verified without hardcoded user checks.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b28-d140-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Django Permission Evaluation Invariants',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'If a user has is_superuser = False and has no individual permissions in auth_user_user_permissions, but belongs to a Group that has the "records.can_sign_report" permission, what does request.user.has_perm("records.can_sign_report") return?',
      options: [
        'True, because Django automatically aggregates and caches permissions inherited from all groups the user belongs to.',
        'False, because Django only evaluates direct user permissions assigned to the individual user record.',
        'False, unless the view explicitly calls user.load_group_permissions().',
        'An exception, because permissions cannot be queried on non-superusers.',
      ],
      correctIndex: 0,
      explanation: 'Django\'s PermissionsMixin evaluates both direct user permissions and inherited group permissions seamlessly. When user.has_perm() is invoked, Django checks the cached permissions set which aggregates both direct and group permissions.',
      misconceptionIdentified: 'Believing that group permissions require manual querying or separate evaluation from direct user permissions.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b28-d140-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Coarse Capabilities vs Role Explosion',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how capability-based permissions ("can_approve_expense") scale significantly better over time than hardcoded role names ("is_manager").',
      guidingQuestions: [
        'What happens when a company introduces a new "TeamLead" role that needs approval capabilities without being a full "Manager"?',
        'Why does checking capabilities in views make software resilient to organizational restructuring?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b28-d140-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 028 Reference Sheet: Django RBAC & Permission Architecture',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: User authentication in Django — Permissions and authorization',
          url: 'https://docs.djangoproject.com/en/6.0/topics/auth/default/#permissions-and-authorization',
        },
        {
          title: 'OWASP Authorization Cheat Sheet',
          url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',
        },
      ],
      documentationExtracts: [
        'PermissionsMixin: A mixin that adds the fields and methods necessary to support Django\'s Group and Permission model to your custom user class.',
        'PermissionRequiredMixin: Analogous to the permission_required decorator, this mixin verifies whether the user has all specified permissions before executing the view handler.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 141: DEBUG — Diagnostic Lab: Broken Access Control, BOLA/IDOR & Session Security Defense ──
export const DAY_141_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w28-028',
  dayNumber: 4,
  title: 'Diagnostic Lab: Broken Access Control, BOLA/IDOR & Session Security Defense',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b28-d141-01',
      type: 'THEORY',
      order: 1,
      title: 'Anatomy of Broken Access Control: BOLA, Horizontal Privilege Escalation & Permission Leaks',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Diagnose and remediate OWASP Top 10 Broken Access Control defects: the critical distinction between model-level permissions and object-level ownership checks (BOLA / IDOR), mass-assignment privilege escalation on administrative flags, unauthenticated AnonymousUser crashes, and permission caching invalidation.',
      whatItIs: 'Broken Access Control occurs when application policies fail to enforce proper user boundaries:\n1. Broken Object-Level Authorization (BOLA / IDOR):\n   - Model-level checks (e.g. user.has_perm("records.view_clinicalreport")) only verify whether a user has permission to view clinical reports in general.\n   - DEFECT: If a view retrieves an object by ID from the database without verifying ownership or tenancy (e.g. ClinicalReport.objects.get(pk=pk)), any authenticated clinician can view reports from other clinics or unauthorized patients simply by guessing or substituting the UUID/ID.\n   - REMEDIATION: Filter QuerySets by tenancy or ownership: ClinicalReport.objects.filter(tenant=request.user.tenant).get(pk=pk) or raise PermissionDenied in get_object().\n2. Privilege Escalation via Mass-Assignment:\n   - DEFECT: Binding form or serializer data with fields = "__all__" or accepting request.POST directly allows attackers to submit is_staff=True, is_superuser=True, or group IDs in registration or profile update forms.\n   - REMEDIATION: Enforce strict field allowlisting on ModelForms (fields = ["first_name", "last_name", "email"]) and never expose administrative flags to client input.\n3. AnonymousUser Null-Pointer Pitfalls:\n   - DEFECT: Evaluating request.user.tenant or request.user.has_perm() when request.user is an instance of django.contrib.auth.models.AnonymousUser raises AttributeError or behaves unpredictably.\n   - REMEDIATION: Always gate views with LoginRequiredMixin / login_required or explicitly check if request.user.is_authenticated.\n4. Permission Caching Invalidation:\n   - Django caches evaluated permissions on the user object in user._perm_cache.\n   - DEFECT: If an administrator revokes a permission or group during an active session, the user retains access until the user instance is re-fetched or the session expires.\n   - REMEDIATION: Invalidate user session caches or call del user._perm_cache when executing administrative permission changes.',
      whyItExists: 'Broken Access Control is the most prevalent and critical security vulnerability in enterprise applications (OWASP Top 10 A01:2021). Rigorous defensive patterns are essential to maintain multi-tenant and regulatory isolation.',
      problemSolved: 'Prevents horizontal data exfiltration, stops unauthorized administrative privilege escalation, and eliminates crash bugs from unauthenticated access.',
      mentalModel: 'The Hotel Keycard vs Room Number: A hotel room key (model permission) grants the bearer the capability to open hotel room doors in general. However, Room 402\'s digital lock must verify that this specific keycard is programmed for Room 402 (object-level check), not Room 405. If the door unlocks for any valid hotel keycard in the building, the hotel suffers from Broken Object-Level Authorization (BOLA).',
      realWorldUse: 'Multi-tenant cloud architectures, electronic medical records, banking statements, and confidential HR systems.',
      commonMistakes: [
        'Relying solely on @permission_required to protect detail or edit views without scoping the database query to the current user\'s tenant or ownership.',
        'Using ClinicalReport.objects.all() in a DetailView get_queryset() method in a multi-tenant application.',
        'Allowing users to modify their own roles or group memberships through user profile edit forms.',
        'Failing to handle AnonymousUser before inspecting custom user profile attributes.',
      ],
      commonMisconceptions: [
        'Django\'s built-in permissions automatically protect individual records by ID (Django permissions are purely table/model-level out of the box; object-level security requires explicit queryset scoping or guardian/custom backends).',
        'UUID primary keys make object-level authorization unnecessary (UUIDs obscure IDs but do not replace access control; knowledge of a UUID should never equate to permission to read it).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b28-d141-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Diagnosing & Remediating BOLA and Mass-Assignment Vulnerabilities',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      codeSnippet: `# ── VULNERABLE CODE (DO NOT USE) ──
class VulnerableReportDetailView(PermissionRequiredMixin, DetailView):
    model = ClinicalReport
    permission_required = 'records.view_clinicalreport'
    # DEFECT: Uses default get_queryset() -> ClinicalReport.objects.all()
    # Any clinician can access reports belonging to ANY clinic or patient!

# ── SECURE REFACTORED CODE ──
class SecureReportDetailView(PermissionRequiredMixin, DetailView):
    model = ClinicalReport
    permission_required = 'records.view_clinicalreport'
    raise_exception = True

    def get_queryset(self):
        """
        Enforce strict object-level boundary:
        Only return reports belonging to the user's assigned organization/clinic.
        """
        user = self.request.user
        if not user.is_authenticated:
            raise PermissionDenied("Authentication required.")
        
        # Superusers bypass tenant scoping for cross-system administration
        if user.is_superuser:
            return ClinicalReport.objects.all()
            
        return ClinicalReport.objects.filter(clinic_id=user.clinic_id)

    def get_object(self, queryset=None):
        obj = super().get_object(queryset=queryset)
        # Optional secondary invariant check: verify record is not archived
        if obj.is_archived and not self.request.user.has_perm('records.can_archive_report'):
            raise PermissionDenied("Archived records require specialized audit clearance.")
        return obj`,
      explanation: 'Contrasts a vulnerable detail view that relies solely on model-level permissions with a hardened view that overrides get_queryset() to scope database reads strictly to the requesting user\'s clinic/tenant.',
      language: 'python',
    } as ExampleBlock,
    {
      id: 'blk-b28-d141-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Diagnostic Lab: Patching Broken Authorization in an EHR Portal',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      taskDescription: 'Identify three critical security flaws in an existing medical records view and apply robust defense-in-depth mitigations.',
      instructions: [
        'Examine an EHR document update view that allows arbitrary record mutation based on URL parameter "id".',
        'Identify the BOLA defect where any doctor can edit records created by doctors in competing practices.',
        'Identify the mass-assignment vulnerability in the accompanying ModelForm where is_verified and approved_by are exposed in fields.',
        'Refactor the view and form to enforce strict tenant filtering in get_queryset() and explicit field allowlisting.',
      ],
      hints: [
        'Never trust client input for tenant IDs or user ownership IDs.',
        'Use self.request.user.tenant_id from the authenticated session as the authoritative source of truth.',
      ],
      expectedOutcome: 'A completely secured endpoint where cross-tenant data access is physically blocked at the database query level and administrative fields cannot be altered via HTTP POST.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b28-d141-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Model-Level Permissions vs Object-Level Authorization',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is checking user.has_perm("finance.view_invoice") insufficient to prevent an unauthorized user from viewing invoice #4092 in a multi-tenant SaaS application?',
      options: [
        'Because model-level permissions verify the general capability to view invoices, but do not verify that invoice #4092 belongs to the user\'s tenant.',
        'Because has_perm() only works for Django Admin and is ignored in public views.',
        'Because Django automatically exposes all database rows to any user who possesses the view permission.',
        'Because invoice #4092 might have been cached in Redis by another user.',
      ],
      correctIndex: 0,
      explanation: 'Model-level permissions answer: "Is this user allowed to view invoices?" Object-level authorization answers: "Is this user allowed to view THIS specific invoice?" In multi-tenant systems, both checks are mandatory for defense in depth.',
      misconceptionIdentified: 'Believing that standard Django permissions enforce record-level ownership or tenancy boundaries.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b28-d141-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Defense-in-Depth vs Single Point of Failure',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on the principle of defense-in-depth: why should access control be enforced at both the view layer (gating access) and the database query layer (scoping queries)?',
      guidingQuestions: [
        'If a developer forgets to add PermissionRequiredMixin to a new view, how does a scoped get_queryset() prevent cross-tenant data exposure?',
        'How does filtering by tenant_id in SQL ensure that database errors default to 404 Not Found rather than leaking data existence?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b28-d141-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 028 Reference Sheet: Access Control Security Guidelines',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'OWASP Top 10: A01:2021 — Broken Access Control',
          url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/',
        },
        {
          title: 'OWASP API Security Top 10: API1:2023 — Broken Object Level Authorization',
          url: 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/',
        },
      ],
      documentationExtracts: [
        'BOLA / IDOR Defense: Applications must verify that the authenticated user possesses explicit authorization to read or mutate the requested resource instance, not merely authorization to access the resource class.',
        'Mass-Assignment Mitigation: Always bind user-submitted data to explicit, allowlisted form/serializer schemas to prevent attackers from tampering with internal state flags.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 142: TRANSFER — Architectural Challenge & Formative Assessment: Enterprise Security Gateway ──
export const DAY_142_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w28-028',
  dayNumber: 5,
  title: 'Architectural Transfer Challenge & Formative Assessment: Enterprise RBAC Security Gateway',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b28-d142-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Batch 028 Formative Assessment: Enterprise Healthcare RBAC Security Gateway',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Enterprise multi-specialty clinical healthcare network managing sensitive HIPAA-governed electronic health records (EHR) across distributed hospital systems.',
      task: 'Architect and implement a secure Multi-Role RBAC Security Gateway combining custom user identity, password hashing, session security hardening, role hierarchies, custom capability permissions, object-level tenancy enforcement, and audit event logging.',
      constraints: [
        'Must declare custom model permissions ("can_sign_report", "can_archive_record") via Meta.permissions on the EHR document model.',
        'Must programmatically provision group-based role hierarchies for Clinician, MedicalAuditor, and BillingAdmin.',
        'Must enforce object-level tenancy checks in CBVs preventing any user from reading or modifying records outside their assigned clinic_id.',
        'Must verify request.user.is_authenticated before evaluating permission lookups to eliminate AnonymousUser crashes.',
        'Must configure session security cookie attributes (HttpOnly, Secure, SameSite="Lax") and enforce session key cycling on authentication.',
      ],
      difficulty: 'ADVANCED',
      timeExpectationMinutes: 60,
      targetCompetencyId: COMPETENCY_ID_USER_AUTH_AND_SECURITY,
    } as TransferChallengeBlock,
    {
      id: 'blk-b28-d142-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Batch 028 Synthesis Check: End-to-End Authentication & Authorization Defense',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In a production Django application, what is the most robust defense-in-depth architecture for safeguarding sensitive user resources against both horizontal and vertical privilege escalation?',
      options: [
        'Combining PermissionRequiredMixin with raise_exception=True for vertical capability verification, overriding get_queryset() to filter strictly by request.user.tenant_id for horizontal isolation, and using explicit ModelForm allowlisting.',
        'Relying solely on UUID primary keys in URLs so unauthorized users cannot guess resource identifiers.',
        'Checking if request.user.username == "admin" in template tags before displaying action buttons.',
        'Setting SESSION_COOKIE_AGE to 30 seconds and disabling all group permissions.',
      ],
      correctIndex: 0,
      explanation: 'True defense-in-depth requires multiple complementary layers: model-level capability checks (vertical gating), query-level tenant/ownership filtering (horizontal gating), and strict input allowlisting (mass-assignment defense).',
      misconceptionIdentified: 'Assuming that any single security control (e.g. obscure URLs or UI button hiding) is sufficient on its own.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b28-d142-03',
      type: 'REFLECTION',
      order: 3,
      title: 'Engineering Reflection: Completing the Month 7 Django Web Security Baseline',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on the journey across Month 7: from raw WSGI protocols, views, and templates, to ORM migrations, secure form lifecycles, and enterprise RBAC identity systems.',
      guidingQuestions: [
        'How does mastering the underlying HTTP request-response lifecycle make you a better architect when configuring high-level Django security abstractions?',
        'Why is identity and authentication strictly separated from database relational modeling in professional systems engineering?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b28-d142-04',
      type: 'REFERENCE',
      order: 4,
      title: 'Batch 028 Architecture Summary & OWASP ASVS Verification Matrix',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'OWASP Application Security Verification Standard (ASVS) v5.0 — Access Control',
          url: 'https://owasp.org/www-project-application-security-verification-standard/',
        },
        {
          title: 'Django 6.0 Security Guidelines',
          url: 'https://docs.djangoproject.com/en/6.0/topics/security/',
        },
      ],
      documentationExtracts: [
        'ASVS V4.1 Access Control Verification: Verify that the principle of least privilege exists - users should only be able to access unauthorized data and functions if explicitly granted.',
        'Django Security Checklist: Ensure AUTH_USER_MODEL is established early, CSRF protection is active, sessions use secure cookies, and object access is validated per tenant.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 028 FORMATIVE ASSESSMENT (DAY 142) ──
export const DAY_142_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m7-w28-028',
  moduleId: 'module-pfs-m7',
  courseId: 'course-python-fullstack',
  title: 'Batch 028 Formative Assessment: Enterprise Identity, Authentication & RBAC Architecture',
  description: 'Synthesize custom user modeling, password hashing, session hardening, group-based RBAC, and object-level authorization in an enterprise healthcare scenario.',
  type: 'FORMATIVE',
  mode: 'FORMATIVE',
  passingScore: 80,
  maxScore: 100,
  timeLimitMinutes: 60,
  rubric: [
    {
      id: 'rub-b28-01',
      criteria: 'Custom User Modeling & AUTH_USER_MODEL Invariant',
      weight: 0.20,
      description: 'Correct subclassing of AbstractBaseUser and PermissionsMixin, proper UserManager contract, and explicit USERNAME_FIELD declaration.',
    },
    {
      id: 'rub-b28-02',
      criteria: 'Authentication Backends & Session Security Hardening',
      weight: 0.20,
      description: 'Secure authentication backend implementation, session fixation defense via cycle_key(), and hardened cookie configuration.',
    },
    {
      id: 'rub-b28-03',
      criteria: 'Role-Based Access Control & Custom Permissions',
      weight: 0.20,
      description: 'Explicit Meta.permissions declaration, group-based role assignments, and CBV gating using PermissionRequiredMixin.',
    },
    {
      id: 'rub-b28-04',
      criteria: 'Object-Level Authorization & BOLA/IDOR Defense',
      weight: 0.20,
      description: 'Strict enforcement of tenant-level and record ownership boundaries in get_queryset() / get_object().',
    },
    {
      id: 'rub-b28-05',
      criteria: 'Access Diagnostics, Privilege Escalation Defense & Error Handling',
      weight: 0.20,
      description: 'Proper handling of AnonymousUser, 403 Forbidden exception handling, and defense against mass-assignment privilege escalation.',
    },
  ],
  questions: [
    {
      id: 'q-b28-01',
      questionText: 'Explain why object-level access control cannot rely solely on model-level permissions (e.g. view_record).',
      expectedAnswerSnippet: 'Model permissions are global to the model class; object-level authorization requires verifying tenancy or ownership of the individual record instance.',
      points: 20,
    },
  ],
};

// ── BATCH 028 MANIFEST (COMPLETE BATCH · DAYS 138–142 · 425 MIN) ──
export const BATCH_028_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m7-w28-028',
  batchCode: 'P2-M7-W28-BATCH028',
  title: 'Enterprise User Modeling, Authentication Architecture, Session Security & Django RBAC',
  difficulty: 'ADVANCED',
  days: [
    DAY_138_MANIFEST,
    DAY_139_MANIFEST,
    DAY_140_MANIFEST,
    DAY_141_MANIFEST,
    DAY_142_MANIFEST,
  ],
  isPartial: false,
  version: '2.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-09T00:00:00.000Z',
};

