// src/lib/curriculum/pythonFullStack/batch027.ts
// Single Source of Truth for PINIT BATCH 027 (COMPLETE · DAYS 133–137): Month 7 · Week 27 · Days 1–5
// Django 6.0 Forms, ModelForms, Mass-Assignment Defense & Class-Based Views (CBVs)
// Pedagogical Flow: UNDERSTAND (Form Lifecycle & CSRF) -> APPLY (ModelForm Allowlisting & Mass-Assignment Defense) -> BUILD (Generic CBVs & Lifecycle Hooks) -> DEBUG (View Mixins & MRO Diagnostics) -> TRANSFER (Formative Assessment: Enterprise Patient Intake Portal)

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

export const COMPETENCY_ID_DJANGO_FORMS_AND_CBVS = 'comp-pfs-m7-027';

// ── DAY 133: UNDERSTAND — Form Processing Lifecycle, Data Normalization & Defense-in-Depth Validation ──
export const DAY_133_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w27-027',
  dayNumber: 1,
  title: 'Form Processing Lifecycle, Data Normalization & Defense-in-Depth Validation',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b27-d133-01',
      type: 'THEORY',
      order: 1,
      title: 'Django Form Validation Pipeline, Multi-Stage Cleaning & CSRF Defense',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 form processing internals on Python 3.14: bound vs unbound forms, the deterministic multi-stage validation pipeline (to_python -> validate -> run_validators -> clean_<field> -> clean), cleaned_data sanitization, ValidationError error codes, and CSRF token synchronization with SameSite cookies.',
      whatItIs: 'Django Forms provide server-side request data parsing, type conversion, validation, and security sanitization:\n1. Unbound vs Bound Forms:\n   - Unbound Form: Form(None) or Form(). Rendered with default values; is_bound is False; cannot be validated.\n   - Bound Form: Form(request.POST, request.FILES). Bound to submitted request data; is_bound is True; calling is_valid() initiates the validation sequence.\n2. The 5-Stage Form Validation Pipeline (full_clean):\n   - When form.is_valid() is invoked, Django executes self.full_clean(), which traverses five distinct stages:\n     1. to_python(value): Coerces raw string input into native Python types (e.g. "2026-09-08" -> datetime.date). Raises ValidationError on invalid formats.\n     2. validate(value): Checks field-level schema constraints (e.g. required=True rejecting empty values).\n     3. run_validators(value): Traverses all custom and built-in validators attached to the field (e.g. MinLengthValidator, EmailValidator).\n     4. clean_<fieldname>(): Optional form-level hook for custom single-field business rules. Returns the sanitized value for cleaned_data[fieldname].\n     5. clean(): Cross-field validation hook. Evaluates relationships between multiple fields (e.g. ensuring discharge_date > admission_date). Returns the full cleaned_data dictionary.\n3. The cleaned_data Dictionary & Error Invariants:\n   - Only fields that pass all validation stages are placed into form.cleaned_data.\n   - Any failed stage populates form.errors and excludes the field from cleaned_data.\n   - Never access request.POST directly in application logic; always read from form.cleaned_data.\n4. Cross-Site Request Forgery (CSRF) Defense:\n   - Django protects state-changing HTTP requests (POST, PUT, PATCH, DELETE) using the Synchronized Token Pattern.\n   - CsrfViewMiddleware sets an HttpOnly/SameSite="Lax" session cookie containing the secret token and requires an incoming form payload with {% csrf_token %} or X-CSRFToken header.\n   - Missing or mismatched tokens trigger an immediate HTTP 403 Forbidden rejection.',
      whyItExists: 'Enforces rigorous data normalization and defense-in-depth sanitization at the application ingress boundary before data can reach business services or database layers.',
      problemSolved: 'Eliminates Cross-Site Request Forgery, prevents type confusion bugs, and provides structured validation errors for front-end rendering.',
      mentalModel: 'The Diplomatic Border Processing Station: An incoming visitor carries a visa application (raw POST data). First, border guards verify the official wax seal (CSRF token). Next, the document goes through translation (to_python: dates and numbers converted to standard format). Individual officers verify the passport photo and fingerprint (field validators and clean_<field>). Finally, the senior commissioner reviews the entire packet to ensure the return flight date matches the visa duration (cross-field clean()). Only if all stamps are approved is the certified dossier (cleaned_data) handed to the executive office.',
      realWorldUse: 'High-security financial transfers, patient registration portals, sensitive credential changes, and mission-critical data entry.',
      commonMistakes: [
        'Reading raw values from request.POST instead of form.cleaned_data, bypassing all type coercion, normalization, and sanitization.',
        'Raising raw Python exceptions inside clean() methods instead of raising django.core.exceptions.ValidationError.',
        'Forgetting to return the cleaned value from clean_<fieldname>() methods (which silently sets that field in cleaned_data to None).',
        'Exempting views from CSRF protection (@csrf_exempt) without implementing alternative cryptographic API authentication.',
      ],
      commonMisconceptions: [
        'is_valid() modifies the database (forms are purely validation and conversion mechanisms; database persistence requires save() on ModelForms).',
        'CSRF tokens are static per user (Django masks CSRF tokens on every page render to defend against BREACH compression attacks).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b27-d133-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Clinical Trial Patient Intake Form with Multi-Stage Validation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `import datetime
from django import forms
from django.core.exceptions import ValidationError

class ClinicalTrialIntakeForm(forms.Form):
    """
    Demonstrates Django 6.0 form validation lifecycle:
    - Typed field normalization
    - clean_<field> single-field validation
    - clean() cross-field validation
    """
    trial_code = forms.CharField(
        max_length=16,
        help_text="Registry code e.g. NCT-2026-001"
    )
    participant_dob = forms.DateField(
        widget=forms.DateInput(attrs={"type": "date"}),
        help_text="Date of birth for eligibility verification"
    )
    baseline_systolic = forms.IntegerField(
        min_value=60,
        max_value=250,
        help_text="Baseline systolic blood pressure (mmHg)"
    )
    baseline_diastolic = forms.IntegerField(
        min_value=40,
        max_value=150,
        help_text="Baseline diastolic blood pressure (mmHg)"
    )

    def clean_trial_code(self) -> str:
        """Single-field validation: normalize to uppercase and check prefix."""
        code = self.cleaned_data.get("trial_code", "").strip().upper()
        if not code.startswith("NCT-"):
            raise ValidationError(
                "Trial code must begin with the standard 'NCT-' prefix.",
                code="invalid_trial_prefix"
            )
        return code

    def clean_participant_dob(self) -> datetime.date:
        """Single-field validation: verify participant is at least 18 years old."""
        dob = self.cleaned_data.get("participant_dob")
        if dob:
            today = datetime.date.today()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            if age < 18:
                raise ValidationError(
                    f"Participant must be at least 18 years old (Current age: {age}).",
                    code="participant_underage"
                )
        return dob

    def clean(self) -> dict:
        """Cross-field validation: verify systolic is strictly greater than diastolic."""
        cleaned_data = super().clean()
        systolic = cleaned_data.get("baseline_systolic")
        diastolic = cleaned_data.get("baseline_diastolic")

        if systolic is not None and diastolic is not None:
            if systolic <= diastolic:
                raise ValidationError(
                    "Systolic pressure must be strictly greater than diastolic pressure.",
                    code="invalid_blood_pressure_ratio"
                )

        return cleaned_data
`,
      explanation: 'Illustrates the complete validation lifecycle: field-level min/max constraints, clean_trial_code returning normalized uppercase strings, clean_participant_dob calculating age, and multi-field clean() validating clinical physiological invariants.',
    } as ExampleBlock,
    {
      id: 'blk-b27-d133-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Implementing Multi-Stage Form Validation and Error Handling',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Define an AppointmentBookingForm with appointment_date (DateField) and reason (CharField).',
        'Implement clean_appointment_date ensuring the date is in the future.',
        'Implement clean() validating that emergency consultations include a reason of at least 20 characters.',
        'Simulate validating both valid and invalid dictionary payloads via is_valid().',
      ],
      expectedOutcome: `import datetime
from django import forms
from django.core.exceptions import ValidationError

class AppointmentBookingForm(forms.Form):
    appointment_date = forms.DateField()
    is_emergency = forms.BooleanField(required=False)
    reason = forms.CharField(max_length=256, required=False)

    def clean_appointment_date(self):
        date_val = self.cleaned_data.get("appointment_date")
        if date_val and date_val < datetime.date.today():
            raise ValidationError("Appointment date cannot be in the past.")
        return date_val

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("is_emergency") and len(cleaned.get("reason", "").strip()) < 20:
            raise ValidationError("Emergency appointments require a detailed reason (at least 20 chars).")
        return cleaned
`,
      hints: [
        'Always return the cleaned value from clean_<fieldname>().',
        'Always call super().clean() first inside cross-field clean().',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_FORMS_AND_CBVS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b27-d133-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Form Cleaning Stages & CSRF Protection',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What happens if a developer defines a custom clean_email(self) method on a Django Form but forgets to include a return statement at the end of the method?',
      options: [
        'Python implicitly returns None, causing self.cleaned_data["email"] to be set to None, effectively erasing the validated email value.',
        'Django raises a FormConfigurationError at server startup.',
        'Django falls back to reading the raw value directly from request.POST.',
        'The form automatically marks the email field as invalid and sets status 500.',
      ],
      correctIndex: 0,
      explanation: 'In Django forms, clean_<field>() methods must return the value that should be stored in cleaned_data. If a function ends without an explicit return statement, Python returns None, resulting in cleaned_data[field] being overwritten with None even if the input was completely valid.',
      misconceptionIdentified: 'Assuming clean_<field> methods only validate via side-effects rather than returning the normalized value.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b27-d133-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: The Boundary Between Form and Model Validation',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how Django distributes validation responsibility between HTTP forms and relational database models.',
      guidingQuestions: [
        'What validation rules belong in Forms (user interaction, presentation formats) versus Models (business logic, relational invariants)?',
        'Why does relying solely on client-side HTML5 validation attributes (required, pattern) leave systems completely unprotected?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b27-d133-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 027 Reference Sheet: Django Forms & CSRF Defense',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Working with Forms',
          url: 'https://docs.djangoproject.com/en/6.0/topics/forms/',
        },
        {
          title: 'Django 6.0 Documentation: Form and Field Validation',
          url: 'https://docs.djangoproject.com/en/6.0/ref/forms/validation/',
        },
        {
          title: 'Django 6.0 Documentation: Cross Site Request Forgery Protection',
          url: 'https://docs.djangoproject.com/en/6.0/ref/csrf/',
        },
      ],
      documentationExtracts: [
        'Form Validation: Form validation happens when data is cleaned. If you want to customize this process, there are various places to make changes, each serving a different purpose: Field.to_python(), Field.validate(), Field.run_validators(), Form.clean_<field>(), and Form.clean().',
        'CSRF Protection: The CSRF middleware and template tag provide easy-to-use protection against Cross Site Request Forgeries.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 134: APPLY — ModelForms, Explicit Field Allowlisting & Mass-Assignment Vulnerability Mitigation ──
export const DAY_134_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w27-027',
  dayNumber: 2,
  title: 'ModelForms, Explicit Field Allowlisting & Mass-Assignment Vulnerability Mitigation',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b27-d134-01',
      type: 'THEORY',
      order: 1,
      title: 'ModelForm Introspection, Mass-Assignment Threat Model & Allowlist Invariants',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 ModelForms: automatic schema introspection, the mass-assignment vulnerability threat model, explicit field allowlisting (fields = [...]) versus exclude anti-patterns, instance binding and commit=False workflows, and ModelForm clean() integration.',
      whatItIs: 'ModelForms create a bi-directional bridge between Django models and user-facing web forms:\n1. ModelForm Introspection:\n   - Subclassing forms.ModelForm inspects Meta.model to generate corresponding form fields, widgets, validators, and error messages based on model field definitions.\n2. The Mass-Assignment Threat Model (Over-Posting Vulnerability):\n   - When a user submits an HTTP POST request, an attacker can tamper with form payloads and inject unauthorized parameters (e.g. is_staff=true, account_balance=999999, approved=true).\n   - If a ModelForm binds all model fields, the ORM assigns the attacker-controlled values directly to the model instance and persists them to the database.\n   - Contextual Allowlisting Policy: While fields = "__all__" is syntactically valid in Django for internal rapid prototypes, on any security-sensitive form where the model contains server-controlled, financial, or administrative fields, fields = "__all__" is a major security vulnerability.\n   - Explicit Field Allowlisting: Meta.fields MUST be an explicit list of permitted editable field names (e.g. fields = ["first_name", "last_name", "biomarker_score"]). Any parameters submitted outside this allowlist are discarded.\n   - The exclude Anti-Pattern: Using exclude = ["is_staff"] is brittle because when developers add new fields to the model in the future (e.g. is_verified), they are automatically exposed on public forms by default.\n3. Model Instance Binding & Two-Phase Saving (commit=False):\n   - form.save(commit=True): Immediately saves model instance and ManyToMany relations to database.\n   - form.save(commit=False): Instantiates and populates the model instance in memory without saving to the database. This allows server-side controllers to attach server-controlled attributes (e.g. instance.author = request.user, instance.ip_address = client_ip) before calling instance.save().\n   - When using commit=False with ManyToMany fields, form.save_m2m() MUST be called manually after saving the instance.',
      whyItExists: 'Automates form generation from models while providing strict defense against unauthorized model attribute manipulation and over-posting attacks.',
      problemSolved: 'Eliminates mass-assignment privilege escalation vulnerabilities, eliminates boilerplate form field definitions, and guarantees two-phase save safety.',
      mentalModel: 'The Airport Cargo Customs Manifest: A shipping company (User) submits a container of goods (POST payload). If the customs form allows "any cargo listed in the warehouse catalog" (fields="__all__"), the shipper could slip military contraband into the manifest. Explicit allowlisting (fields=[...]) provides a strict checklist of permitted items (e.g. fruit, textiles). Anything else found in the crate is confiscated at the border. Two-phase saving (commit=False) is the customs officer affixing an official government seal and inspection stamp before the crate is allowed into the central depot.',
      realWorldUse: 'User registration flows, patient chart updates, e-commerce checkouts, and multi-tenant account settings.',
      commonMistakes: [
        'Using fields = "__all__" on public registration or profile forms when the model includes fields like is_staff, is_superuser, or balance.',
        'Using exclude instead of explicit fields allowlists, inadvertently leaking newly added model columns to public input.',
        'Calling form.save(commit=False) and modifying the instance, but forgetting to call form.save_m2m() when the form contains ManyToMany relations.',
        'Modifying form.cleaned_data inside save() instead of overriding the form clean() method.',
      ],
      commonMisconceptions: [
        'Django forbids fields = "__all__" with a syntax error (Django permits it, but security standards require explicit allowlists for public/sensitive entities).',
        'commit=False creates a copy of the database row (commit=False merely constructs the model instance in Python memory without issuing an INSERT/UPDATE SQL query).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b27-d134-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Secure ModelForm with Explicit Allowlist and Two-Phase commit=False Save',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `from django import forms
from clinical.models import ClinicalPatientRecord

class PatientIntakeModelForm(forms.ModelForm):
    """
    Secure ModelForm adhering to Mass-Assignment Defense:
    - Explicit fields allowlist (never '__all__')
    - Custom widgets and styling
    - Demonstrates two-phase save with commit=False
    """
    class Meta:
        model = ClinicalPatientRecord
        # EXPLICIT ALLOWLIST: Excludes internal/audit fields (id, created_at, updated_at)
        fields = [
            "national_id",
            "first_name",
            "last_name",
            "middle_name",
            "biomarker_score",
        ]
        widgets = {
            "national_id": forms.TextInput(attrs={"placeholder": "e.g. NAT-987654"}),
            "biomarker_score": forms.NumberInput(attrs={"step": "0.01", "min": "0", "max": "100"}),
        }

    def clean_national_id(self) -> str:
        national_id = self.cleaned_data.get("national_id", "").strip().upper()
        return national_id

def patient_intake_view(request):
    """
    Demonstrates processing ModelForm with two-phase save (commit=False).
    """
    if request.method == "POST":
        form = PatientIntakeModelForm(request.POST)
        if form.is_valid():
            # Phase 1: Instantiate model in memory without saving to database
            patient = form.save(commit=False)
            
            # Phase 2: Inject server-controlled audit attributes
            patient.is_active = True
            
            # Phase 3: Persist to database
            patient.save()
            
            # If form had ManyToMany fields: form.save_m2m()
            return {"status": "SUCCESS", "patient_id": str(patient.id)}
    else:
        form = PatientIntakeModelForm()

    return {"form": form}
`,
      explanation: 'Exemplifies production ModelForm security: uses an explicit fields allowlist defending against mass-assignment, custom widgets for user input hints, and two-phase save(commit=False) injecting server-controlled attributes.',
    } as ExampleBlock,
    {
      id: 'blk-b27-d134-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Eliminating Mass-Assignment Risks in Vulnerable ModelForms',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Audit a vulnerable UserAccountForm configured with fields = "__all__" where the UserAccount model has is_admin and credit_limit fields.',
        'Refactor the ModelForm to specify an explicit fields allowlist containing only username, email, and display_name.',
        'Demonstrate that submitting an HTTP payload containing is_admin=True is ignored and cannot corrupt the model instance.',
        'Use commit=False to set the server-controlled account_tier = "STANDARD" before saving.',
      ],
      expectedOutcome: `from django import forms
from django.db import models

class UserAccount(models.Model):
    username = models.CharField(max_length=32)
    email = models.EmailField()
    display_name = models.CharField(max_length=64, blank=True, default="")
    is_admin = models.BooleanField(default=False)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    account_tier = models.CharField(max_length=16, default="STANDARD")

class SecureUserAccountForm(forms.ModelForm):
    class Meta:
        model = UserAccount
        fields = ["username", "email", "display_name"]
`,
      hints: [
        'Never use fields = "__all__" when models have privileged or server-managed columns.',
        'Any field omitted from fields is completely invisible to the form and will not be populated from POST data.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_FORMS_AND_CBVS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b27-d134-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Mass-Assignment & ModelForm Security',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is using exclude = ["is_staff"] considered a dangerous security anti-pattern compared to explicit fields allowlisting (fields = [...])?',
      options: [
        'Because if a developer adds a new sensitive column (e.g. is_superuser or account_balance) to the model in the future, exclude automatically exposes that new column to user input by default.',
        'Because Django completely disables all form validation when exclude is used.',
        'Because exclude causes an immediate SQL syntax error in PostgreSQL.',
        'Because exclude prevents the form from saving data to the database.',
      ],
      correctIndex: 0,
      explanation: 'Blacklisting via exclude follows an insecure-by-default model. When the underlying model evolves and new fields are added, exclude automatically exposes them on public forms unless developers remember to update the blacklist. Explicit allowlisting (fields = [...]) is secure-by-default because newly added model fields remain quarantined until explicitly permitted.',
      misconceptionIdentified: 'Believing blacklisting via exclude provides equivalent security to allowlisting via fields.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b27-d134-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Secure Defaults and Threat Modeling',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why secure-by-default architecture requires explicit allowlisting rather than reactive blacklisting across all layers of web software.',
      guidingQuestions: [
        'How does mass-assignment in Django ModelForms mirror similar vulnerabilities in other ecosystems (e.g. Rails Strong Parameters, Spring Data Binding)?',
        'What processes can teams put in place during code review to ensure fields = "__all__" is never deployed to production on sensitive models?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b27-d134-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 027 Reference Sheet: ModelForms & Over-Posting Prevention',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Creating forms from models',
          url: 'https://docs.djangoproject.com/en/6.0/topics/forms/modelforms/',
        },
        {
          title: 'OWASP Mass Assignment Vulnerability Cheat Sheet',
          url: 'https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html',
        },
      ],
      documentationExtracts: [
        'ModelForm fields: It is strongly recommended that you explicitly set all fields that should be edited in the form using the fields attribute. Failure to do so can easily result in security issues when fields are added to the model.',
        'The save() method: If you call save() with commit=False, then it will return an object that hasn\'t yet been saved to the database.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 135: BUILD — Class-Based Views (CBVs), Generic Display & Editing Views ──
export const DAY_135_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w27-027',
  dayNumber: 3,
  title: 'Class-Based Views (CBVs), Generic Display & Editing Views',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b27-d135-01',
      type: 'THEORY',
      order: 1,
      title: 'Class-Based View Architecture, as_view() Dispatch & Generic View Hierarchies',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 Class-Based Views (CBVs) on Python 3.14: the View base class, as_view() conversion to callable view functions, HTTP method dispatching (get, post), generic display views (ListView, DetailView), generic editing views (CreateView, UpdateView, DeleteView), and key lifecycle hooks (get_queryset, get_context_data, form_valid).',
      whatItIs: 'Class-Based Views organize HTTP request handling into reusable, object-oriented class hierarchies:\n1. The View Base Class & as_view() Conversion:\n   - Django URLconfs expect a callable accepting (request, *args, **kwargs). View.as_view(**initkwargs) returns a closure function view(request, *args, **kwargs) that instantiates the class per request, sets self.request/self.args/self.kwargs, and calls self.dispatch(request, *args, **kwargs).\n   - dispatch() inspects request.method and routes to matching lowercase methods (get, post, put, delete, head, options). If the method is not allowed, it returns HttpResponseNotAllowed.\n2. Generic Display Views:\n   - ListView: Renders a list of objects. Attributes: model, queryset, template_name, context_object_name, paginate_by. Key hook: get_queryset() for dynamic filtering.\n   - DetailView: Renders a single object identified by pk_url_kwarg (default "pk") or slug_url_kwarg (default "slug"). Key hook: get_object().\n3. Generic Editing Views:\n   - CreateView / UpdateView: Renders and processes a ModelForm. Attributes: model, form_class, template_name, success_url. Key hooks: form_valid(form) (invoked when form passes validation; calls form.save() and returns HttpResponseRedirect), form_invalid(form) (re-renders form with error context).\n   - DeleteView: Confirms and executes model deletion.\n4. Core Lifecycle Customization Hooks:\n   - get_queryset(): Dynamically filters data (e.g. scoping to active user or tenant).\n   - get_context_data(**kwargs): Injects extra context variables into the template dictionary.\n   - form_valid(form): Modifies the instance before saving or sends notifications upon successful submission.',
      whyItExists: 'Encapsulates common web patterns (CRUD, pagination, template rendering, form handling) into battle-tested reusable classes while providing granular extensibility via inheritance.',
      problemSolved: 'Eliminates repetitive boilerplate code for standard listing, detailing, and editing workflows.',
      mentalModel: 'The Assembly Line Framework: A Function-Based View is an artisan building a chair by hand from scratch on every request. A Generic Class-Based View is a modular automotive assembly line: the chassis arrives (View.as_view()), passes through standard inspection gates (dispatch()), moves along standard stations (get_queryset(), form_valid()), and exits with standard finishing (render_to_response()). If you need custom painting, you override a single station (get_context_data()) without rebuilding the factory.',
      realWorldUse: 'Standard administrative portals, SaaS CRUD interfaces, content management systems, and enterprise data management portals.',
      commonMistakes: [
        'Attempting to pass ViewClass directly to urlpatterns without calling ViewClass.as_view().',
        'Overriding dispatch() or form_valid() without calling and returning super().dispatch() or super().form_valid(form).',
        'Hardcoding success_url as a static string when dynamic parameters are required (override get_success_url() instead).',
        'Mutating class attributes on self during request processing, introducing race conditions across concurrent requests.',
      ],
      commonMisconceptions: [
        'CBVs maintain state between different requests (a new class instance is created for every single incoming HTTP request).',
        'Generic CBVs are only for simple CRUD and cannot handle complex logic (every single step of the CBV lifecycle is an overridable method).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b27-d135-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Full-Featured Generic CBV Pipeline: ListView and CreateView with Lifecycle Hooks',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `from django.views.generic import ListView, CreateView, DetailView
from django.urls import reverse_lazy
from django.db.models import Q
from clinical.models import ClinicalPatientRecord
from clinical.forms import PatientIntakeModelForm

class PatientDirectoryListView(ListView):
    """
    Generic display view with dynamic filtering and pagination.
    """
    model = ClinicalPatientRecord
    template_name = "clinical/patient_list.html"
    context_object_name = "patients"
    paginate_by = 25

    def get_queryset(self):
        """Dynamic queryset filtering based on search query parameter."""
        queryset = super().get_queryset().filter(is_active=True)
        search_term = self.request.GET.get("q", "").strip()
        if search_term:
            queryset = queryset.filter(
                Q(last_name__icontains=search_term) | Q(national_id__icontains=search_term)
            )
        return queryset

    def get_context_data(self, **kwargs):
        """Enrich template context with metadata."""
        context = super().get_context_data(**kwargs)
        context["search_query"] = self.request.GET.get("q", "")
        context["total_active_count"] = self.get_queryset().count()
        return context

class PatientIntakeCreateView(CreateView):
    """
    Generic editing view with custom form_valid injection.
    """
    model = ClinicalPatientRecord
    form_class = PatientIntakeModelForm
    template_name = "clinical/patient_form.html"
    success_url = reverse_lazy("clinical:patient_list")

    def form_valid(self, form):
        """Attach server-controlled metadata before persistence."""
        form.instance.is_active = True
        response = super().form_valid(form)
        return response
`,
      explanation: 'Demonstrates generic CBV architecture: ListView with dynamic search filtering in get_queryset() and context enrichment in get_context_data(), and CreateView with custom form_valid() persisting model state with reverse_lazy redirection.',
    } as ExampleBlock,
    {
      id: 'blk-b27-d135-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Implementing Generic CRUD with Dynamic Filtering',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Create an AppointmentListView inheriting from ListView that filters appointments by status="CONFIRMED".',
        'Override get_context_data to add page_title="Confirmed Appointments".',
        'Create an AppointmentCreateView inheriting from CreateView specifying model, form_class, and get_success_url().',
        'Override form_valid to send a confirmation notice before redirecting.',
      ],
      expectedOutcome: `from django.views.generic import ListView, CreateView
from django.urls import reverse

class AppointmentListView(ListView):
    template_name = "appointments/list.html"
    context_object_name = "appointments"

    def get_queryset(self):
        return super().get_queryset().filter(status="CONFIRMED")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["page_title"] = "Confirmed Appointments"
        return context

class AppointmentCreateView(CreateView):
    template_name = "appointments/create.html"

    def form_valid(self, form):
        response = super().form_valid(form)
        return response

    def get_success_url(self):
        return reverse("appointments:detail", kwargs={"pk": self.object.pk})
`,
      hints: [
        'In CreateView, after super().form_valid(form) is called, the newly created instance is accessible via self.object.',
        'Always return super().get_context_data(**kwargs) to retain standard pagination context.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_FORMS_AND_CBVS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b27-d135-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: CBV Dispatch & Lifecycle Hooks',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In a Django CreateView, what is the sequence of events and the role of the form_valid(self, form) method?',
      options: [
        'form_valid() is invoked only after the form passes all validation stages (is_valid() is True). It saves the model instance to the database and returns an HttpResponseRedirect to get_success_url().',
        'form_valid() is invoked on every GET request to populate initial form widgets.',
        'form_valid() executes before form.is_valid() to check if the database connection is alive.',
        'form_valid() is a static method that generates database migrations for the view.',
      ],
      correctIndex: 0,
      explanation: 'In Django generic editing views (CreateView, UpdateView), when a POST request is received, post() binds the form and calls form.is_valid(). If valid, post() calls form_valid(form), which calls form.save() and returns an HttpResponseRedirect. If invalid, post() calls form_invalid(form).',
      misconceptionIdentified: 'Believing form_valid executes on invalid or unbound form submissions.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b27-d135-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Choosing Between FBVs and CBVs',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on architectural criteria for deciding when to use Function-Based Views versus Class-Based Views.',
      guidingQuestions: [
        'When does the object-oriented structure of Generic CBVs save significant development time, and when does it introduce unnecessary complexity?',
        'How does team familiarity and code readability influence the choice of view paradigm?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b27-d135-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 027 Reference Sheet: Generic Class-Based Views',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Class-based views',
          url: 'https://docs.djangoproject.com/en/6.0/topics/class-based-views/',
        },
        {
          title: 'Classy Class-Based Views (ccbv.co.uk)',
          url: 'https://ccbv.co.uk/',
        },
      ],
      documentationExtracts: [
        'Class-Based Views: A view is a callable which takes a request and returns a response. This can be more than just a function, and Django provides an example of some classes which can be used as views.',
        'as_view(): Because the Django URL resolver expects to send the request and associated arguments to a callable function, class-based views have an as_view() class method.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 136: DEBUG — View Mixins, Multiple Inheritance MRO & Form Submission Defect Diagnostics ──
export const DAY_136_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w27-027',
  dayNumber: 4,
  title: 'View Mixins, Multiple Inheritance MRO & Form Submission Defect Diagnostics',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b27-d136-01',
      type: 'THEORY',
      order: 1,
      title: 'View Mixins, Python C3 MRO Invariants & Form Submission Defect Diagnostics',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Django 6.0 view mixins and multiple inheritance diagnostics: Python C3 Linearization (Method Resolution Order), the mandatory rule for mixin ordering (mixins to the left of base views), diagnosing silent form validation failures (form.errors.as_json(), non_field_errors()), and diagnosing CSRF 403 Forbidden errors.',
      whatItIs: 'Mixins provide modular, composable behaviors in Class-Based Views:\n1. The Mixin Architecture & The C3 Linearization Rule:\n   - Python uses C3 Linearization to determine Method Resolution Order (MRO).\n   - MANDATORY MIXIN ORDERING INVARIANT: In multiple inheritance class declarations, mixin classes MUST ALWAYS be positioned TO THE LEFT of the generic base view:\n     class SecurePatientCreateView(AuditLoggingMixin, LoginRequiredMixin, CreateView): ...\n   - WHY: Generic base views (like CreateView, View) contain concrete, terminal implementations of methods like dispatch() and form_valid(). If a base view is placed to the left of a mixin (e.g. class BrokenView(CreateView, LoginRequiredMixin):), Python\'s MRO executes the base view\'s method first, completely bypassing the mixin\'s security checks or logging!\n2. Composing View Behaviors:\n   - Common mixins: LoginRequiredMixin, PermissionRequiredMixin, UserPassesTestMixin.\n   - Always call super().dispatch() or super().form_valid() within mixins to allow execution to flow through the remaining MRO chain.\n3. Diagnosing Silent Form Submission Failures:\n   - Symptom: A user clicks Submit, the page simply reloads, but no error messages appear.\n   - Root Cause 1: Non-field errors. Errors raised in clean() without specifying a field parameter are attached to form.non_field_errors(). If the template only renders {{ form.field_name.errors }}, non-field errors are invisible to the user.\n   - Root Cause 2: Missing or invalid CSRF tokens. Submitting via AJAX or fetch() without the X-CSRFToken header causes an HTTP 403 Forbidden response.\n   - Diagnostic Procedure: Inspect form.is_bound, check form.errors.as_json(), print form.non_field_errors(), and verify that request.POST contains the expected input keys.',
      whyItExists: 'Enables safe reuse of authorization, logging, and audit functionality across hundreds of views while providing systematic diagnostic techniques for form defects.',
      problemSolved: 'Eliminates security bypasses caused by inverted MRO inheritance order and resolves elusive form validation bugs.',
      mentalModel: 'The Airport Security Checkpoint Queue: The passengers must walk through the metal detector (SecurityMixin) and passport control (LoginMixin) BEFORE they enter the executive departure lounge (CreateView). If you position the departure lounge doors before the metal detector (inverted MRO: class BadView(CreateView, SecurityMixin)), passengers enter the lounge immediately, and security screening is never invoked!',
      realWorldUse: 'Enterprise multi-tenant applications enforcing tenant isolation, role-based access control mixins, and audit logging on every mutation.',
      commonMistakes: [
        'Placing generic base views to the left of mixins (class MyView(CreateView, LoginRequiredMixin)), which silently bypasses login verification.',
        'Writing a custom mixin that overrides dispatch() without calling super().dispatch(request, *args, **kwargs).',
        'Failing to render {{ form.non_field_errors }} in templates, causing users to see unresponsive forms when cross-field validation fails.',
        'Assuming form.errors is empty when form.is_valid() has never been called on an unbound form.',
      ],
      commonMisconceptions: [
        'Python searches inherited classes in random order (Python strictly follows C3 Linearization, which can be inspected via ViewClass.__mro__).',
        'Mixins can inherit from View (mixins should inherit from object to avoid contaminating the MRO diamond inheritance graph).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b27-d136-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Audit Logging Mixin with Correct MRO and Form Defect Diagnosis',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      language: 'python',
      code: `import logging
from django.views.generic import CreateView
from django.http import HttpResponseForbidden, JsonResponse
from clinical.models import ClinicalPatientRecord
from clinical.forms import PatientIntakeModelForm

logger = logging.getLogger("clinical.audit")

class AuditLoggingMixin:
    """
    Mixin that logs all mutations and attaches audit metadata.
    Must inherit from object and be placed TO THE LEFT of base views.
    """
    def dispatch(self, request, *args, **kwargs):
        logger.info(
            "AuditLog: User %s accessing %s [Method: %s]",
            getattr(request, "user", "Anonymous"),
            request.path,
            request.method
        )
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        logger.info("AuditLog: Successful form submission for model %s", form._meta.model.__name__)
        return super().form_valid(form)

# CORRECT MRO: Mixin on LEFT, Base view on RIGHT
class AuditedPatientCreateView(AuditLoggingMixin, CreateView):
    model = ClinicalPatientRecord
    form_class = PatientIntakeModelForm
    template_name = "clinical/patient_form.html"

# DIAGNOSTIC HELPER: Diagnosing silent form failures
def diagnose_form_submission(form):
    """
    Prints complete diagnostic analysis of form state.
    """
    print(f"Is Bound: {form.is_bound}")
    print(f"Is Valid: {form.is_valid()}")
    if not form.is_valid():
        print(f"Field Errors: {form.errors.as_json()}")
        print(f"Non-Field Errors: {form.non_field_errors()}")
`,
      explanation: 'Demonstrates proper mixin construction: inherits from object, calls super(), sits to the left of CreateView in AuditedPatientCreateView, and includes diagnostic helpers to identify hidden non-field errors.',
    } as ExampleBlock,
    {
      id: 'blk-b27-d136-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Diagnosing Broken MRO Ordering and Unhandled Non-Field Errors',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Diagnose a broken view declaration class BrokenOrderView(CreateView, SecurityCheckMixin) where security checks are never executed.',
        'Fix the class inheritance order to adhere to Python C3 MRO rules.',
        'Verify the MRO using ViewClass.__mro__.',
        'Diagnose a form that fails validation silently because non_field_errors are omitted from template rendering.',
      ],
      expectedOutcome: `# 1. Fix MRO ordering: mixins on the left
class FixedOrderView(SecurityCheckMixin, CreateView):
    pass

# 2. Inspect MRO:
# FixedOrderView.__mro__ -> (FixedOrderView, SecurityCheckMixin, CreateView, ..., object)

# 3. Template fix: Always render non_field_errors
# {% if form.non_field_errors %}
#   <div class="alert alert-danger">{{ form.non_field_errors }}</div>
# {% endif %}
`,
      hints: [
        'Mixins must always precede the generic view in the inheritance tuple.',
        'Remember that non_field_errors come from the form-level clean() method.',
      ],
      targetCompetencyId: COMPETENCY_ID_DJANGO_FORMS_AND_CBVS,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b27-d136-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Mixin MRO & Silent Form Defect Diagnostics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why must custom mixins be declared to the left of generic base views (e.g. class View(MyMixin, CreateView)) in Django?',
      options: [
        'Because Python\'s C3 Method Resolution Order searches base classes from left to right; placing the base view on the left causes its terminal methods to execute first, bypassing the mixin.',
        'Because Django\'s template engine rejects any view whose class name has more than two parent classes.',
        'Because Python 3.14 raises a SyntaxError if a mixin is placed on the right.',
        'Because mixins on the right are executed asynchronously in background threads.',
      ],
      correctIndex: 0,
      explanation: 'Python\'s MRO resolves methods from left to right. Because Django\'s generic views (like CreateView) provide complete, terminal implementations of methods like dispatch() and form_valid(), placing CreateView before a mixin means CreateView\'s method runs first and the mixin\'s override is never reached.',
      misconceptionIdentified: 'Believing class inheritance order in Python is arbitrary or cosmetic.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b27-d136-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Composable Architecture and Debugging Rigor',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how understanding the underlying mechanics of Python (like MRO) demystifies framework behavior and prevents critical security defects.',
      guidingQuestions: [
        'How does an inverted MRO create silent security bypasses that unit tests might miss if not tested with live HTTP requests?',
        'Why is systematic diagnostic logging of form errors (as_json()) superior to guessing why a form submission failed?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b27-d136-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 027 Reference Sheet: Mixins & MRO Standards',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Documentation: Using mixins with class-based views',
          url: 'https://docs.djangoproject.com/en/6.0/topics/class-based-views/mixins/',
        },
        {
          title: 'Python Documentation: Method Resolution Order (C3 Linearization)',
          url: 'https://www.python.org/download/releases/2.3/mro/',
        },
      ],
      documentationExtracts: [
        'Using Mixins: As with any class-based views, mixins are ordered from left to right. The mixin must come before the base view class in the list of parent classes.',
        'C3 Linearization: The order in which base classes are searched when looking for a method is called the Method Resolution Order.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 137: TRANSFER — Formative Assessment: Enterprise Patient Intake Portal ──
export const DAY_137_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m7-w27-027',
  title: 'Formative Assessment: Enterprise Patient Admission & Clinical Trial Intake Portal',
  type: 'FORMATIVE',
  mode: 'FORMATIVE',
  passingScore: 80,
  timeLimitMinutes: 60,
  rubric: [
    {
      id: 'rub-b27-01',
      title: 'Form Validation Lifecycle & Multi-Stage Cleaning',
      description: 'Typed normalization in to_python, field-level clean_<field> validation, cross-field clean() rules, and correct ValidationError code usage.',
      weight: 0.20,
    },
    {
      id: 'rub-b27-02',
      title: 'Mass-Assignment Mitigation & Strict ModelForm Allowlisting',
      description: 'Strict fields allowlisting on ModelForms preventing over-posting attacks, avoidance of exclude anti-patterns, and two-phase commit=False saving.',
      weight: 0.20,
    },
    {
      id: 'rub-b27-03',
      title: 'Generic Class-Based View Architecture & Lifecycle Hooks',
      description: 'Proper use of ListView and CreateView, overriding get_queryset(), get_context_data(), and form_valid() with reverse_lazy redirection.',
      weight: 0.20,
    },
    {
      id: 'rub-b27-04',
      title: 'Mixin Multiple Inheritance & Method Resolution Order',
      description: 'Correct left-to-right inheritance ordering of custom mixins before base views, proper super() propagation, and MRO verification.',
      weight: 0.20,
    },
    {
      id: 'rub-b27-05',
      title: 'CSRF Protection & Form Submission Error Diagnostics',
      description: 'CSRF token integration, systematic debugging of non-field errors, and complete error payload extraction with form.errors.as_json().',
      weight: 0.20,
    },
  ],
};

export const DAY_137_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m7-w27-027',
  dayNumber: 5,
  title: 'Formative Assessment: Enterprise Patient Admission & Clinical Trial Intake Portal',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b27-d137-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Formative Assessment: Architect the Clinical Admission & Intake Portal',
      estimatedMinutes: 75,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Hospital Enterprise Emergency Admission & Trial Enrollment Portal',
      task: 'Build a secure, enterprise-grade patient admission and clinical trial intake portal running Django 6.0.8 on Python 3.14. You must implement a multi-stage Form with single-field and cross-field cleaning, develop a secure ModelForm with an explicit fields allowlist mitigating mass-assignment vulnerabilities, construct generic ListView and CreateView CBVs with dynamic query filtering and context enrichment, compose a custom audit-logging mixin adhering strictly to Python C3 MRO ordering, and implement robust error diagnostic handling for CSRF and non-field form defects.',
      constraints: [
        'Must pin Django==6.0.8 running on Python 3.14 baseline.',
        'All ModelForms must specify an explicit fields allowlist; fields = "__all__" and exclude are strictly forbidden.',
        'Form clean_<field> methods must return the normalized value to prevent cleaned_data corruption.',
        'View mixins must be positioned to the left of generic base views in the inheritance hierarchy.',
        'All state-changing POST requests must enforce CSRF token validation.',
        'Non-field errors must be explicitly rendered in templates or serialized in API responses.',
      ],
      difficulty: 'ADVANCED',
      timeExpectationMinutes: 75,
      targetCompetencyId: COMPETENCY_ID_DJANGO_FORMS_AND_CBVS,
      assessmentRef: 'asm-pfs-m7-w27-027',
    } as TransferChallengeBlock,
    {
      id: 'blk-b27-d137-02',
      type: 'REFLECTION',
      order: 2,
      title: 'Batch 027 Retrospective: Ingress Security and Object-Oriented View Architecture',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on completing Batch 027: how mastering the form validation lifecycle, mass-assignment defense, and generic view hierarchies prepares you to build robust, secure enterprise web applications.',
      guidingQuestions: [
        'How does explicit allowlisting across forms and models establish defense-in-depth against malicious user payloads?',
        'Why does understanding Python\'s MRO separate experienced Django engineers from those who struggle with mysterious mixin bugs?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b27-d137-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Batch 027 Master Reference Sheet',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Django 6.0 Forms API Reference',
          url: 'https://docs.djangoproject.com/en/6.0/ref/forms/api/',
        },
        {
          title: 'OWASP Top 10 Web Application Security: Broken Access Control',
          url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/',
        },
      ],
      documentationExtracts: [
        'Form Cleaning: The clean() method on a Form is called after the individual field cleaning methods. It should be used for validation that requires access to multiple fields.',
        'Security Best Practice: Never trust client-supplied input. Always validate data using strict server-side forms before passing it to models or business logic.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 027 MANIFEST (COMPLETE BATCH · DAYS 133–137 · 5 DAYS · 425 MIN) ──
export const BATCH_027_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m7-w27-027',
  batchCode: 'P2-M7-W27-BATCH027',
  title: 'Django 6.0 Forms, ModelForms, Mass-Assignment Defense & Class-Based Views (CBVs)',
  difficulty: 'ADVANCED',
  days: [
    DAY_133_MANIFEST,
    DAY_134_MANIFEST,
    DAY_135_MANIFEST,
    DAY_136_MANIFEST,
    DAY_137_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
};
