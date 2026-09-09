// src/lib/curriculum/pythonFullStack/batch007.ts
// Single Source of Truth for PINIT BATCH 007: Month 2 · Week 7 · Days 31–35
// Inheritance, Method Overriding, Polymorphic Dispatch & Extensible Domain Design
// Pedagogical Flow: UNDERSTAND (Inheritance Fundamentals) -> APPLY (Overriding & super()) -> BUILD (Polymorphism & Duck Typing) -> DEBUG (Inheritance Traps & Hierarchy Bugs) -> TRANSFER (Extensible Domain Engine)

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  GuidedLabBlock,
  IndependentPracticeBlock,
  DebuggingChallengeBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_INHERITANCE_POLYMORPHISM = 'comp-pfs-m2-007';

// ── DAY 31: UNDERSTAND — Inheritance Fundamentals & Specialization ───────────
export const DAY_31_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w7-007',
  dayNumber: 1,
  title: 'Inheritance Fundamentals & Specialization',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b7-d31-01',
      type: 'THEORY',
      order: 1,
      title: 'Inheritance as Type Specialization: Base Classes, Subclasses & Method Lookup',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand Python class inheritance as a mechanism for modeling genuine IS-A specialization relationships, mastering base classes, derived subclasses, single-inheritance attribute lookup, isinstance(), and issubclass().',
      whatItIs: 'Inheritance is an object-oriented mechanism where a new derived class (subclass) inherits attributes and methods from an existing base class (`class SubClass(BaseClass):`). The subclass is a specialized type of the base class (an "IS-A" relationship).',
      whyItExists: 'When multiple domain entities share common structural traits and operations but require specialized capabilities, inheritance allows software engineers to define common state and operations in a shared base class while specializing behaviors in derived types.',
      problemSolved: 'Eliminates redundant code across closely related entity types and establishes substitutable, specialized types that share a common foundation.',
      mentalModel: 'Base Type to Specialized Type (IS-A) & Simplified Single-Inheritance Lookup: Think of a Vehicle as a base type. A DeliveryTruck IS-A Vehicle with specialized cargo capacity; an ElectricVan IS-A Vehicle with specialized battery telemetry. In Python\'s simplified single-inheritance lookup model, when an attribute or method is requested on a truck instance, Python checks: instance namespace -> child class namespace -> base class namespace -> built-in object namespace. Do not treat inheritance merely as "code reuse"—inheritance represents genuine domain specialization where the subclass is meaningfully substitutable for the base type.',
      realWorldUse: 'Specialized vehicle telemetry devices, user permission roles, and categorized financial transaction types.',
      commonMistakes: [
        'Using inheritance for relationships that are merely associations or collaborations (e.g. `class Student(Course)` or `class Car(Engine)` instead of using composition).',
        'Creating deep, fragile inheritance hierarchies with 4 or 5 levels of base classes when shallow 1-level specialization is cleaner and more maintainable.',
        'Assuming child classes copy parent code into their own dictionary instead of participating in Python\'s runtime attribute resolution lookup.',
      ],
      commonMisconceptions: [
        'Misconception: "Inheritance should be used whenever two classes share any code." Reality: Inheritance is appropriate only when a true IS-A specialization relationship exists. If objects merely collaborate, composition is preferred.',
        'Misconception: "`isinstance(x, Base)` is False for a subclass instance." Reality: Python\'s `isinstance(obj, Class)` returns True if `obj` is an instance of `Class` OR any subclass derived from `Class`.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b7-d31-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Base Class Definition, Derived Subclasses & Attribute Resolution Lookup',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating single inheritance, attribute resolution lookup from child to parent, and checking type relationships with isinstance() and issubclass().',
      language: 'python',
      codeSnippet: `# 1. Base Class: General Vehicle
class Vehicle:
    def __init__(self, vin, make, model):
        self.vin = str(vin).strip()
        self.make = str(make).strip()
        self.model = str(model).strip()
        self.odometer_km = 0.0

    def drive(self, distance_km):
        if distance_km > 0.0:
            self.odometer_km += distance_km
            return True
        return False

    def get_specs(self):
        return f"{self.make} {self.model} (VIN: {self.vin}) - {self.odometer_km} km"


# 2. Derived Subclass: CargoTruck (Specialization: cargo payload limits)
class CargoTruck(Vehicle):
    def __init__(self, vin, make, model, max_payload_kg):
        # super() provides access to the next implementation in inheritance lookup
        super().__init__(vin, make, model)
        self.max_payload_kg = float(max_payload_kg)
        self.current_payload_kg = 0.0

    def load_cargo(self, weight_kg):
        if weight_kg <= 0.0 or self.current_payload_kg + weight_kg > self.max_payload_kg:
            return False
        self.current_payload_kg += weight_kg
        return True


# 3. Demonstration & Type Introspection
truck = CargoTruck("TRK-9001", "Volvo", "FH16", 18000.0)

# Inherited method lookup resolves to Vehicle.drive()
truck.drive(150.0)
truck.load_cargo(12000.0)

print(truck.get_specs())
print("Current Payload:", truck.current_payload_kg, "kg")

# Type hierarchy verification
print("isinstance(truck, CargoTruck):", isinstance(truck, CargoTruck))
print("isinstance(truck, Vehicle):", isinstance(truck, Vehicle))
print("issubclass(CargoTruck, Vehicle):", issubclass(CargoTruck, Vehicle))`,
      expectedOutput: `Volvo FH16 (VIN: TRK-9001) - 150.0 km
Current Payload: 12000.0 kg
isinstance(truck, CargoTruck): True
isinstance(truck, Vehicle): True
issubclass(CargoTruck, Vehicle): True`,
    } as ExampleBlock,
    {
      id: 'blk-b7-d31-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Inheritance Structure & Hierarchy Drills',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Define a base class `Sensor(sensor_id, location)` with `is_active` state and a `toggle_power()` method.',
        'Define a derived subclass `TemperatureSensor(sensor_id, location, unit="CELSIUS")` that inherits from `Sensor` and adds `record_reading(temp_val)`.',
        'Verify that the derived class inherits base methods and passes `isinstance()` checks.',
      ],
      starterCode: `class Sensor:
    def __init__(self, sensor_id, location):
        self.sensor_id = str(sensor_id)
        self.location = str(location)
        self.is_active = True

    def toggle_power(self):
        self.is_active = not self.is_active
        return self.is_active


class TemperatureSensor(Sensor):
    def __init__(self, sensor_id, location, unit="CELSIUS"):
        super().__init__(sensor_id, location)
        self.unit = str(unit).upper()
        self.readings = []

    def record_reading(self, temp_val):
        if not self.is_active:
            return False
        self.readings.append(float(temp_val))
        return True


# Verification
temp_s = TemperatureSensor("TEMP-01", "ServerRoom-A")
temp_s.record_reading(22.5)
temp_s.toggle_power()  # Inherited from Sensor

print("Sensor Active:", temp_s.is_active)
print("Readings:", temp_s.readings)
print("Is Sensor:", isinstance(temp_s, Sensor))`,
      hints: [
        'Use `super().__init__(sensor_id, location)` inside `TemperatureSensor.__init__` to initialize base state.',
        'Remember that `temp_s.toggle_power()` is found on `Sensor` via attribute resolution lookup.',
      ],
      expectedOutcome: 'Learner constructs clean single-inheritance hierarchy and understands attribute resolution lookup.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b7-d31-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic Check: IS-A vs HAS-A & Method Resolution Lookup',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which of the following scenarios represents a genuine IS-A specialization relationship where class inheritance is defensible?',
      options: [
        '`class Car(Engine)`: A Car inherits from Engine because it needs an engine to run.',
        '`class ElectricCar(Vehicle)`: An ElectricCar is a specialized Vehicle with battery-specific state and operations.',
        '`class University(Student)`: A University inherits from Student because universities have students.',
        '`class ShoppingCart(Item)`: A ShoppingCart inherits from Item because it contains items.',
      ],
      correctIndex: 1,
      explanation: 'Inheritance represents an IS-A specialization relationship: an `ElectricCar` IS-A `Vehicle`. In contrast, a Car HAS-AN Engine, a University HAS Students, and a ShoppingCart HAS Items—these are ownership or containment relationships correctly modeled with Composition or Association, NOT inheritance.',
      misconceptionIdentified: 'Confusing ownership/containment (HAS-A) with type specialization (IS-A).',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b7-d31-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Official Python 3.14 Documentation: Inheritance',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Tutorial: Inheritance',
          url: 'https://docs.python.org/3/tutorial/classes.html#inheritance',
          description: 'Official Python reference on derived class definitions, method resolution order basics, isinstance, and issubclass.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 32: APPLY — Method Overriding & super() ───────────────────────────────
export const DAY_32_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w7-007',
  dayNumber: 2,
  title: 'Method Overriding & super()',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b7-d32-01',
      type: 'THEORY',
      order: 1,
      title: 'Method Overriding: Replacing vs Extending Behavior with super()',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master method overriding in Python, learning how subclasses customize behavior, how super() accesses the next implementation in inheritance lookup, and why an overriding method should preserve the expected calling contract of the base behavior.',
      whatItIs: 'Method overriding occurs when a derived subclass defines a method with the exact same name as a method in its base class. When called on a subclass instance, the subclass implementation executes instead of the base implementation. In Python, `super()` provides access to the next implementation in the inheritance lookup.',
      whyItExists: 'Specialized entities frequently need to customize or augment general operations. Overriding allows subclasses to adapt inherited behaviors while maintaining the same method interface.',
      problemSolved: 'Allows specialized types to tailor calculations, validations, or formatting while reusing common baseline logic.',
      mentalModel: 'Replacing vs Extending & Preserving Calling Contracts: When overriding a method, you have two choices: 1) Replace: Provide completely new logic without calling the base method. 2) Extend: Call `super().method_name(*args)` to execute the base implementation and then augment the returned result or state. Python does not automatically enforce override parameter compatibility at class definition time—a class with an incompatible parameter list compiles successfully. However, as a core software engineering practice, an overriding method should preserve the expected calling contract of the base behavior so callers can use the interface interchangeably without raising runtime TypeErrors.',
      realWorldUse: 'Custom fee calculations in payment processors, specialized validation in web forms, and custom event handlers in UI pipelines.',
      commonMistakes: [
        'Altering the method signature or parameter count when overriding, causing a `TypeError` at runtime when caller code invokes the method expecting the base interface.',
        'Hardcoding parent class names (e.g. `BaseClass.method(self)`) instead of using `super().method()`.',
        'Forgetting to return the result of `super().method()` when extending a method that produces a return value.',
      ],
      commonMisconceptions: [
        'Misconception: "`super()` only works inside `__init__`." Reality: `super()` can be used inside ANY instance method to delegate to the next implementation in Python\'s inheritance lookup.',
        'Misconception: "Python prevents defining a subclass method with different parameters than its parent." Reality: Python permits any method signature at definition time; the `TypeError` occurs later at the call site if the caller provides arguments the new signature does not accept.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b7-d32-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Overriding Methods: Replacing vs Extending with super()',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating replacing a method completely vs extending a method using super() to augment baseline computations.',
      language: 'python',
      codeSnippet: `class BaseAccount:
    def __init__(self, account_id, owner_name, initial_balance=0.0):
        self.account_id = account_id
        self.owner_name = owner_name
        self._balance = max(0.0, float(initial_balance))

    def calculate_monthly_fee(self):
        # Baseline fee for standard accounts
        return 5.0

    def get_summary(self):
        return f"Account {self.account_id} ({self.owner_name}): Balance \${self._balance:.2f}"


class StudentAccount(BaseAccount):
    # REPLACE: Student accounts have zero monthly fees
    def calculate_monthly_fee(self):
        return 0.0


class PremiumAccount(BaseAccount):
    # EXTEND: Premium accounts pay standard baseline fee + concierge service surcharge
    def calculate_monthly_fee(self):
        base_fee = super().calculate_monthly_fee()
        concierge_surcharge = 15.0
        return base_fee + concierge_surcharge

    # EXTEND: Augment summary string with tier badge
    def get_summary(self):
        base_str = super().get_summary()
        return f"[PREMIUM TIER] {base_str}"


# Demonstration
std = BaseAccount("ACC-01", "Alice", 200.0)
stu = StudentAccount("ACC-02", "Bob", 150.0)
prm = PremiumAccount("ACC-03", "Carol", 1000.0)

print("Standard Fee: \$", std.calculate_monthly_fee())
print("Student Fee:  \$", stu.calculate_monthly_fee())
print("Premium Fee:  \$", prm.calculate_monthly_fee())
print(prm.get_summary())`,
      expectedOutput: `Standard Fee: \$ 5.0
Student Fee:  \$ 0.0
Premium Fee:  \$ 20.0
[PREMIUM TIER] Account ACC-03 (Carol): Balance \$1000.00`,
    } as ExampleBlock,
    {
      id: 'blk-b7-d32-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Telemetry Packet Serializer Hierarchy',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a telemetry packet hierarchy where subclasses extend the base serializer to append specialized sensor metrics.',
      instructions: [
        'Implement base `TelemetryPacket(device_id, timestamp)` with `format_payload()` returning a base dictionary.',
        'Implement `EnvironmentTelemetryPacket` extending `format_payload()` with `temperature` and `humidity`.',
        'Implement `GPSLocationTelemetryPacket` extending `format_payload()` with `latitude` and `longitude`.',
      ],
      starterFiles: {
        'telemetry.py': `class TelemetryPacket:
    def __init__(self, device_id, timestamp_str):
        self.device_id = str(device_id).strip()
        self.timestamp_str = str(timestamp_str).strip()

    def format_payload(self):
        # Baseline payload dictionary
        return {
            "device_id": self.device_id,
            "timestamp": self.timestamp_str,
            "packet_type": "GENERIC",
        }


class EnvironmentTelemetryPacket(TelemetryPacket):
    def __init__(self, device_id, timestamp_str, temp_c, humidity_pct):
        super().__init__(device_id, timestamp_str)
        self.temp_c = float(temp_c)
        self.humidity_pct = float(humidity_pct)

    def format_payload(self):
        # Extend base payload with specialized environmental data
        payload = super().format_payload()
        payload["packet_type"] = "ENVIRONMENTAL"
        payload["temperature_c"] = self.temp_c
        payload["humidity_pct"] = self.humidity_pct
        return payload


class GPSLocationTelemetryPacket(TelemetryPacket):
    def __init__(self, device_id, timestamp_str, lat, lon):
        super().__init__(device_id, timestamp_str)
        self.lat = float(lat)
        self.lon = float(lon)

    def format_payload(self):
        # Extend base payload with specialized GPS coordinates
        payload = super().format_payload()
        payload["packet_type"] = "GPS_TRACKING"
        payload["latitude"] = self.lat
        payload["longitude"] = self.lon
        return payload


# Demonstration
p1 = EnvironmentTelemetryPacket("ENV-101", "2026-09-02T10:00:00Z", 24.2, 58.0)
p2 = GPSLocationTelemetryPacket("GPS-505", "2026-09-02T10:01:00Z", 37.7749, -122.4194)

print("Env Payload:", p1.format_payload())
print("GPS Payload:", p2.format_payload())`,
      },
      expectedBehavior: 'Derived classes successfully use super() to augment baseline packet data with specialized attributes.',
    } as GuidedLabBlock,
    {
      id: 'blk-b7-d32-04',
      type: 'INDEPENDENT_PRACTICE',
      order: 4,
      title: 'Independent Practice: Order Discount Pricing Hierarchy',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Create a pricing hierarchy with `StandardOrder(order_id, subtotal)` and specialized subclasses `BulkOrder` and `LoyaltyMemberOrder`.',
      starterCode: `class StandardOrder:
    def __init__(self, order_id, subtotal):
        self.order_id = str(order_id)
        self.subtotal = max(0.0, float(subtotal))

    def calculate_final_price(self):
        # Standard orders pay full subtotal with zero discount
        return round(self.subtotal, 2)


class BulkOrder(StandardOrder):
    def __init__(self, order_id, subtotal, quantity):
        super().__init__(order_id, subtotal)
        self.quantity = max(1, int(quantity))

    def calculate_final_price(self):
        # TODO: If quantity >= 10, apply 15% discount to base subtotal; else return standard price.
        pass


class LoyaltyMemberOrder(StandardOrder):
    def __init__(self, order_id, subtotal, loyalty_points):
        super().__init__(order_id, subtotal)
        self.loyalty_points = max(0, int(loyalty_points))

    def calculate_final_price(self):
        # TODO: Apply \$1 discount per 100 loyalty points (up to maximum 50% of subtotal).
        pass`,
      hints: [
        'Use `self.subtotal` inherited from `StandardOrder`.',
        'Ensure `calculate_final_price` returns a rounded `float`.',
      ],
      verificationRequirements: [
        'Subclasses properly inherit initialization from StandardOrder.',
        'Overridden methods correctly apply specialized pricing formulas.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b7-d32-05',
      type: 'KNOWLEDGE_CHECK',
      order: 5,
      title: 'Diagnostic Check: super() & Overridden Method Execution',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'A developer defines:\n```python\nclass Base:\n    def calculate(self, x):\n        return x * 2\n\nclass Derived(Base):\n    def calculate(self, x):\n        return super().calculate(x) + 5\n\nobj = Derived()\nprint(obj.calculate(10))\n```\nWhat is printed, and why?',
      options: [
        'It prints 20 because Base.calculate executes.',
        'It prints 25 because super().calculate(10) evaluates to 20, and + 5 yields 25.',
        'It raises a TypeError because super() requires self as an argument.',
        'It prints 15 because Derived overrides Base completely.',
      ],
      correctIndex: 1,
      explanation: 'Calling `super().calculate(x)` invokes the next implementation in inheritance lookup (`Base`), which computes `10 * 2 = 20`. The derived method then adds `5` to that intermediate result, returning `25`.',
      misconceptionIdentified: 'Believing overriding always replaces base logic completely without access to parent methods.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 33: BUILD — Polymorphism & Duck Typing ───────────────────────────────
export const DAY_33_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w7-007',
  dayNumber: 3,
  title: 'Polymorphism & Duck Typing',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b7-d33-01',
      type: 'THEORY',
      order: 1,
      title: 'Polymorphism & Duck Typing: Behavioral Interfaces over Type Checking',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master behavioral polymorphism and Python\'s duck typing philosophy, designing systems where different objects provide matching interfaces so consumer code can process them uniformly, reducing unnecessary type-specific branching when the consuming code only requires a shared behavior.',
      whatItIs: 'Polymorphism is the design principle where different object types implement the same method interface, allowing consumer code to treat them interchangeably. In Python, this is supported by Duck Typing: "If it walks like a duck and quacks like a duck, it\'s a duck." Python often supports behavioral polymorphism without requiring an explicit interface hierarchy.',
      whyItExists: 'Hardcoding rigid type checks across callers tightly couples code to specific classes and requires edits whenever a new type is added. Polymorphism allows new classes to be introduced cleanly without modifying existing consumer loops.',
      problemSolved: 'Enables extensible architectures where new entity types plug into existing processing loops.',
      mentalModel: 'Behavioral Interface vs Type Checking: Choose behavioral polymorphism when consuming code only needs a capability (e.g. calling `.send()` or `.calculate()`); use explicit type relationships and `isinstance` checks when the domain or safety requirements specifically justify them.',
      realWorldUse: 'Payment gateways supporting credit cards, PayPal, and crypto; document renderers producing HTML, PDF, and Markdown; and notification pipelines.',
      commonMistakes: [
        'Writing extensive chains of `if isinstance(...)` statements when the consuming code only requires a uniform shared method call.',
        'Giving different method names to objects that perform the same conceptual action (e.g. naming one `send_email()` and another `dispatch_sms()` instead of standardizing on `send()`).',
      ],
      commonMisconceptions: [
        'Misconception: "`isinstance` checks are always bad." Reality: `isinstance` is a useful tool when explicit type constraints or debugging checks are required; behavioral polymorphism is preferred when consumer code simply needs to invoke a shared operation.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b7-d33-02',
      type: 'GUIDED_LAB',
      order: 2,
      title: 'Guided Lab: Multichannel Notification Dispatch Pipeline',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a polymorphic notification system where Email, SMS, and Webhook dispatchers satisfy a common send() interface.',
      instructions: [
        'Implement `EmailNotification(recipient_email)`, `SMSNotification(phone_number)`, and `WebhookNotification(endpoint_url)`.',
        'Ensure all three classes implement `send(message_body)` returning a formatted delivery record dictionary.',
        'Implement a consumer function `broadcast_alert(notifiers, message_body)` that dispatches across all notifiers polymorphically.',
      ],
      starterFiles: {
        'notifier.py': `class EmailNotification:
    def __init__(self, recipient_email):
        self.recipient_email = str(recipient_email).strip()

    def send(self, message_body):
        return {
            "channel": "EMAIL",
            "destination": self.recipient_email,
            "status": "DELIVERED",
            "content": str(message_body),
        }


class SMSNotification:
    def __init__(self, phone_number):
        self.phone_number = str(phone_number).strip()

    def send(self, message_body):
        return {
            "channel": "SMS",
            "destination": self.phone_number,
            "status": "DELIVERED",
            "content": str(message_body)[:160],  # SMS length constraint
        }


class WebhookNotification:
    def __init__(self, endpoint_url):
        self.endpoint_url = str(endpoint_url).strip()

    def send(self, message_body):
        return {
            "channel": "WEBHOOK",
            "destination": self.endpoint_url,
            "status": "POSTED",
            "content": str(message_body),
        }


# Polymorphic Consumer Function (Invokes send() directly on any compatible object)
def broadcast_alert(notifiers, alert_text):
    delivery_reports = []
    for notifier in notifiers:
        # Polymorphic invocation: Python dispatches to each object's send() method
        report = notifier.send(alert_text)
        delivery_reports.append(report)
    return delivery_reports


# Demonstration
channels = [
    EmailNotification("devops@production.internal"),
    SMSNotification("+1-555-0199"),
    WebhookNotification("https://status.corp.internal/hooks/alerts"),
]

reports = broadcast_alert(channels, "CRITICAL: Database replica latency exceeded 500ms")
for r in reports:
    print(f"[{r['channel']}] -> {r['destination']}: {r['status']}")`,
      },
      expectedBehavior: 'Consumer function uniformly dispatches alerts across heterogeneous notifier objects via duck typing.',
    } as GuidedLabBlock,
    {
      id: 'blk-b7-d33-03',
      type: 'INDEPENDENT_PRACTICE',
      order: 3,
      title: 'Independent Practice: Document Rendering Engine Pipeline',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build document renderer classes (MarkdownRenderer, HTMLRenderer, PlainTextRenderer) that all implement `render(title, sections)`.',
      starterCode: `class MarkdownRenderer:
    def render(self, title, sections):
        # TODO: Format as # Title followed by ## Section and content
        pass


class HTMLRenderer:
    def render(self, title, sections):
        # TODO: Format as <h1>Title</h1> followed by <h2>Section</h2><p>Content</p>
        pass


class PlainTextRenderer:
    def render(self, title, sections):
        # TODO: Format as plain text with uppercase title
        pass


def render_all_formats(renderers, title, sections):
    # TODO: Polymorphically call render() on each renderer and return list of output strings
    pass`,
      hints: [
        '`sections` is a list of tuples: `[("Heading", "Body text"), ...]`',
        'Keep consumer function `render_all_formats` free of unnecessary type branching.',
      ],
      verificationRequirements: [
        'Each renderer correctly formats the input document.',
        'Consumer dispatches polymorphically across all renderer instances.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b7-d33-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Polymorphism vs Type-Specific Branching',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Why is polymorphic method dispatch useful when building systems with multiple interchangeable strategies? When might explicit type checking still be necessary?',
      guidingQuestions: [
        'How does standardized method naming enable duck typing across independent classes?',
        'In what scenarios would you choose explicit `isinstance` validation over purely dynamic dispatch?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 34: DEBUG / DEEPEN — Inheritance Debugging & Design Traps ─────────────
export const DAY_34_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w7-007',
  dayNumber: 4,
  title: 'Inheritance Debugging & Design Traps',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b7-d34-01',
      type: 'THEORY',
      order: 1,
      title: 'Debugging Object Hierarchies: Constructor Omissions, Signature Bugs & Misplaced Inheritance',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master diagnosing and resolving common object-oriented hierarchy bugs including omitted parent initializations, method signature mismatches at call sites, and misplaced inheritance designs.',
      whatItIs: 'Inheritance bugs in Python arise from specific runtime causes: 1) If a parent initializer establishes required attributes and a subclass overrides `__init__` without calling `super().__init__()`, later code that accesses those missing attributes raises `AttributeError`. 2) If a subclass changes parameter signatures in an override, defining the class succeeds, but calling the method with base arguments raises `TypeError` at the call site. 3) Forcing inheritance onto unrelated concepts creates fragile couplings that should be refactored to composition.',
      whyItExists: 'Understanding the exact sequence from definition to call site and identifying the actual exception produced is crucial for debugging object hierarchies.',
      problemSolved: 'Eliminates uninitialized state errors, call-site argument mismatches, and fragile inheritance designs.',
      mentalModel: 'The Hierarchy Debugging Diagnostic Sequence: DEFINITION -> CALL SITE -> ACTUAL ARGUMENTS -> ACTUAL EXCEPTION -> ROOT CAUSE -> FIX. 1) If an inherited method fails to find an attribute on `self`, check if `super().__init__()` was omitted. 2) If calling an overridden method raises `TypeError`, check the argument count at the call site versus the method definition. 3) If a class inherits behavior it cannot meaningfully fulfill, refactor to Composition.',
      commonMistakes: [
        'Assuming Python calls base `__init__` automatically when a subclass defines its own `__init__`.',
        'Defining a subclass method with fewer parameters than callers provide, triggering a `TypeError` when called.',
        'Inheriting from a class solely to use one utility function instead of composing an instance attribute.',
      ],
      commonMisconceptions: [
        'Misconception: "An incompatible override signature causes a SyntaxError or definition error." Reality: Python accepts any valid method definition; the `TypeError` occurs only when a caller attempts to invoke the method with mismatched arguments.',
        'Misconception: "Missing `super().__init__()` always causes an immediate error." Reality: Instantiating the object succeeds; the `AttributeError` occurs later when code attempts to access uninitialized attributes.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b7-d34-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge 1: The Omitted Base Initializer AttributeError',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'The `SecurityAuditLogger` class defines its own `__init__` without calling `super().__init__(log_file_path)`. When `logger.write_entry(...)` runs, the inherited method attempts to read `self.log_file_path`, which was never created, raising `AttributeError: \'SecurityAuditLogger\' object has no attribute \'log_file_path\'`.',
      symptom: 'AttributeError at runtime when an inherited method attempts to access a base attribute that was never initialized.',
      brokenArtifact: `# audit_logger.py
class BaseLogger:
    def __init__(self, log_file_path):
        self.log_file_path = log_file_path
        self.entries_count = 0

    def write_entry(self, message):
        self.entries_count += 1
        return f"[{self.log_file_path}] {message}"


class SecurityAuditLogger(BaseLogger):
    # ROOT CAUSE: Overrode __init__ but omitted super().__init__(log_file_path)!
    def __init__(self, log_file_path, encryption_key):
        self.encryption_key = encryption_key

logger = SecurityAuditLogger("/var/log/audit.log", "SECRET_KEY_123")
# Traceback:
# File "audit_logger.py", line 7, in write_entry: return f"[{self.log_file_path}] {message}"
# AttributeError: 'SecurityAuditLogger' object has no attribute 'log_file_path'
print(logger.write_entry("USER_LOGIN_SUCCESS"))`,
      expectedBehavior: 'Call `super().__init__(log_file_path)` inside `SecurityAuditLogger.__init__` so base attributes are established.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Observe the traceback: the error occurs inside `write_entry` on `self.log_file_path`.',
        'Hint 2: `SecurityAuditLogger.__init__` assigns `self.encryption_key` but does not run `BaseLogger.__init__`.',
        'Hint 3: Add `super().__init__(log_file_path)` as the first line of `SecurityAuditLogger.__init__`.',
      ],
      targetCompetencyId: COMPETENCY_ID_INHERITANCE_POLYMORPHISM,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b7-d34-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge 2: Incompatible Method Signature TypeError at Call Site',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'The class definition `class CryptoPaymentProcessor(BasePaymentProcessor):` compiles without error. However, at the call site, the polymorphic consumer passes `("TXN-101", 150.0)`. Because the overridden definition was changed to `def process_payment(self, wallet_address):`, Python raises `TypeError: CryptoPaymentProcessor.process_payment() takes 2 positional arguments but 3 were given` (including `self`).',
      symptom: 'TypeError at call site when caller provides arguments the overridden signature does not accept.',
      brokenArtifact: `# payment_gateways.py
class BasePaymentProcessor:
    def process_payment(self, transaction_id, amount_usd):
        return {"id": transaction_id, "amount": float(amount_usd), "status": "APPROVED"}


class CryptoPaymentProcessor(BasePaymentProcessor):
    # Definition succeeds, but signature changed from (transaction_id, amount_usd) to (wallet_address)!
    def process_payment(self, wallet_address):
        return {"wallet": wallet_address, "status": "CONFIRMED"}


processors = [
    BasePaymentProcessor(),
    CryptoPaymentProcessor(),
]

# Consumer loop expects uniform interface: process_payment(txn_id, amount)
for p in processors:
    # Crashes on 2nd iteration:
    # TypeError: CryptoPaymentProcessor.process_payment() takes 2 positional arguments but 3 were given
    res = p.process_payment("TXN-101", 150.0)
    print(res)`,
      expectedBehavior: 'Ensure `CryptoPaymentProcessor.process_payment` maintains compatible parameters `(self, transaction_id, amount_usd)`.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Look at the call site: `p.process_payment("TXN-101", 150.0)` passes 2 positional arguments (+ self = 3).',
        'Hint 2: `CryptoPaymentProcessor.process_payment` only declared `(self, wallet_address)`.',
        'Hint 3: Update `CryptoPaymentProcessor.process_payment(self, transaction_id, amount_usd)` so it matches the expected caller contract.',
      ],
      targetCompetencyId: COMPETENCY_ID_INHERITANCE_POLYMORPHISM,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b7-d34-04',
      type: 'DEBUGGING_CHALLENGE',
      order: 4,
      title: 'Debugging Challenge 3: Refactoring Misplaced Inheritance to Composition',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'An invoice generation module mistakenly subclasses `DatabaseConnection` instead of composing it, creating tight coupling and fragile state.',
      symptom: 'Architectural defect: `InvoiceGenerator` inherits database internals that do not represent a genuine IS-A relationship.',
      brokenArtifact: `# invoice_service.py
class DatabaseConnection:
    def __init__(self, db_host):
        self.db_host = db_host
        self.is_connected = True

    def query(self, sql):
        return f"Results from {self.db_host}: {sql}"


# DEFECT: InvoiceGenerator is NOT a DatabaseConnection! (Misplaced Inheritance)
class InvoiceGenerator(DatabaseConnection):
    def __init__(self, db_host, company_name):
        super().__init__(db_host)
        self.company_name = company_name

    def generate_invoice(self, invoice_id):
        raw_data = self.query(f"SELECT * FROM invoices WHERE id = '{invoice_id}'")
        return f"Invoice for {self.company_name}: {raw_data}"`,
      expectedBehavior: 'Refactor `InvoiceGenerator` to compose `db_connection` as an instance attribute rather than inheriting from `DatabaseConnection`.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: An InvoiceGenerator HAS A database connection; it IS NOT a database connection.',
        'Hint 2: Change `class InvoiceGenerator:` so it does not inherit from `DatabaseConnection`.',
        'Hint 3: Pass `db_connection` into `__init__` and store it on `self._db = db_connection`.',
      ],
      targetCompetencyId: COMPETENCY_ID_INHERITANCE_POLYMORPHISM,
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 35: TRANSFER + FORMATIVE ASSESSMENT — Extensible Logistics Engine ─────
export const DAY_35_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w7-007',
  dayNumber: 5,
  title: 'Extensible Logistics & Multimodal Dispatch Engine',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b7-d35-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Extensible Logistics & Shipping Dispatch Engine',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Multimodal Freight Logistics & Commercial Carrier Operations: Logistics platforms manage shipments across multiple specialized carrier types (Standard Ground, Express Air, Heavy Freight). Each carrier type calculates shipping rates based on base rates, weight brackets, and surcharge rules, while dispatch hubs manage carrier registries and aggregate fleet-wide delivery metrics. Software engineers design extensible object hierarchies and polymorphic dispatchers so new carrier types can be added without modifying dispatch logic.',
      task: `Design and implement an object-oriented, extensible logistics domain engine:
\`process_shipment_operations(operations)\`

PARAMETER DATA FORMATS:
1. \`operations\`: A sequence of operation request dictionaries:
   - \`{"action": "REGISTER_CARRIER", "carrier_id": "C-101", "carrier_type": "STANDARD", "base_rate": 15.0, "rate_per_kg": 2.0}\`
   - \`{"action": "REGISTER_CARRIER", "carrier_id": "C-201", "carrier_type": "EXPRESS", "base_rate": 25.0, "rate_per_kg": 4.0, "rush_surcharge": 10.0}\`
   - \`{"action": "REGISTER_CARRIER", "carrier_id": "C-301", "carrier_type": "HEAVY_FREIGHT", "base_rate": 50.0, "rate_per_kg": 1.5, "heavy_handling_threshold_kg": 100.0, "heavy_fee": 40.0}\`
   - \`{"action": "RECORD_SHIPMENT", "carrier_id": "C-101", "weight_kg": 12.5}\`
   - \`{"action": "SUMMARY"}\`

YOUR FUNCTION MUST PROCESS THE OPERATIONS IN SEQUENCE AND RETURN A FORMATTED EXECUTION REPORT STRING:
"""
REGISTERED_CARRIERS_COUNT: 3
TOTAL_SHIPMENTS_COMPLETED: 2
TOTAL_SHIPPING_FEES: 115.00
HEAVY_SHIPMENTS_HANDLED: 1
REJECTED_OPERATIONS: 0
PRIMARY_CARRIER_ID: C-101
"""

CARRIER PRICING RULES (POLYMOPHIC CALCULATIONS):
1. \`"STANDARD"\`:
   - \`fee = base_rate + (weight_kg * rate_per_kg)\`
2. \`"EXPRESS"\`:
   - \`fee = base_rate + (weight_kg * rate_per_kg) + rush_surcharge\`
3. \`"HEAVY_FREIGHT"\`:
   - \`fee = base_rate + (weight_kg * rate_per_kg)\`
   - If \`weight_kg >= heavy_handling_threshold_kg\`, add \`heavy_fee\` to the fee and count as a heavy shipment.

OPERATION PROCESSING & INVARIANT ENFORCEMENT:
- Process each operation dictionary in sequence.
- \`"REGISTER_CARRIER"\`:
  - Validate non-empty \`carrier_id\`, valid known \`carrier_type\`, \`base_rate\` >= 0.0, \`rate_per_kg\` >= 0.0.
  - Reject duplicate carrier IDs or non-positive thresholds/fees.
  - If valid: instantiate carrier entity and register. Otherwise increment rejected count.
- \`"RECORD_SHIPMENT"\`:
  - Validate that carrier exists and \`weight_kg\` > 0.0.
  - If valid: calculate fee polymorphically, record shipment, accumulate metrics.
  - Otherwise: increment rejected count.
- SUMMARY METRICS:
  - \`TOTAL_SHIPPING_FEES\`: formatted as 2 decimal places (e.g. \`115.00\`).
  - \`HEAVY_SHIPMENTS_HANDLED\`: total count of shipments where heavy handling applied.
  - \`PRIMARY_CARRIER_ID\`: ID of the carrier that completed the most shipments (or first registered carrier if tied; "NONE" if no carriers registered).
- BOUNDARY BEHAVIOR:
  - If operations sequence is empty: return 0 counts, 0.00 fees, and \`PRIMARY_CARRIER_ID: NONE\`.`,
      constraints: [
        'Apply Object-Oriented Principles: Use inheritance, overriding, or polymorphic strategy objects to model specialized carriers cleanly.',
        'Zero global state: all data must pass via parameters and return values.',
        'Zero external libraries, zero type annotations in student-required code.',
        'The autograder accepts multiple defensible OO designs without prescribing rigid class names.',
      ],
      difficulty: 'BEGINNER',
      timeExpectationMinutes: 45,
      targetCompetencyId: COMPETENCY_ID_INHERITANCE_POLYMORPHISM,
      assessmentRef: 'asm-pfs-m2-w7-poly-001',
    } as TransferChallengeBlock,
  ],
};

// ── DAY 35 INDEPENDENT FORMATIVE ASSESSMENT ──────────────────────────────────
export const DAY_35_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m2-w7-poly-001',
  assessmentCode: 'ASM-PFS-M2-W7-POLY',
  title: 'Inheritance, Overriding & Polymorphic Design Formative Assessment',
  description: 'Independent formative assessment evaluating single inheritance, method overriding, polymorphic dispatch, and extensible domain modeling in the browser sandbox. (Formative practice assessment; not certification-grade).',
  type: 'CODE',
  mode: 'FORMATIVE',
  version: '1.0.0',
  status: 'PUBLISHED',
  difficulty: 'BEGINNER',
  timeLimitMinutes: 45,
  attemptPolicy: 'LIMITED_BEST',
  maxAttempts: 3,
  passingScore: 75,
  targetCompetencyId: COMPETENCY_ID_INHERITANCE_POLYMORPHISM,
  items: [
    {
      id: 'item-poly-01',
      assessmentId: 'asm-pfs-m2-w7-poly-001',
      version: '1.0.0',
      itemType: 'CODE',
      prompt: `Implement a modular object-oriented logistics solution with \`process_shipment_operations(operations)\` that models carrier specializations, calculates shipping fees polymorphically, and returns the formatted execution report string. Multiple defensible class structures and naming choices are accepted.`,
      points: 100,
      order: 1,
      timeEstimateMinutes: 30,
      visibleTests: [
        {
          id: 'vt-poly-01',
          name: 'Standard, Express & Heavy Freight Registration and Delivery',
          input: JSON.stringify({
            operations: [
              { action: 'REGISTER_CARRIER', carrier_id: 'C-101', carrier_type: 'STANDARD', base_rate: 10.0, rate_per_kg: 2.0 },
              { action: 'REGISTER_CARRIER', carrier_id: 'C-201', carrier_type: 'EXPRESS', base_rate: 20.0, rate_per_kg: 3.0, rush_surcharge: 15.0 },
              { action: 'RECORD_SHIPMENT', carrier_id: 'C-101', weight_kg: 5.0 },
              { action: 'RECORD_SHIPMENT', carrier_id: 'C-201', weight_kg: 10.0 },
              { action: 'SUMMARY' },
            ],
          }),
          expectedOutput: 'REGISTERED_CARRIERS_COUNT: 2\\nTOTAL_SHIPMENTS_COMPLETED: 2\\nTOTAL_SHIPPING_FEES: 85.00\\nHEAVY_SHIPMENTS_HANDLED: 0\\nREJECTED_OPERATIONS: 0\\nPRIMARY_CARRIER_ID: C-101',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-poly-02',
          name: 'Heavy Handling Threshold Trigger and Invalid Operation Rejection',
          input: JSON.stringify({
            operations: [
              { action: 'REGISTER_CARRIER', carrier_id: 'C-301', carrier_type: 'HEAVY_FREIGHT', base_rate: 50.0, rate_per_kg: 1.0, heavy_handling_threshold_kg: 100.0, heavy_fee: 30.0 },
              { action: 'RECORD_SHIPMENT', carrier_id: 'C-301', weight_kg: 120.0 }, // Exceeds 100kg threshold -> 50 + 120 + 30 = 200.00
              { action: 'RECORD_SHIPMENT', carrier_id: 'C-999', weight_kg: 10.0 },  // Non-existent carrier
            ],
          }),
          expectedOutput: 'REGISTERED_CARRIERS_COUNT: 1\\nTOTAL_SHIPMENTS_COMPLETED: 1\\nTOTAL_SHIPPING_FEES: 200.00\\nHEAVY_SHIPMENTS_HANDLED: 1\\nREJECTED_OPERATIONS: 1\\nPRIMARY_CARRIER_ID: C-301',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-poly-01',
          name: 'Duplicate Carrier ID and Negative Weight Guards',
          input: JSON.stringify({
            operations: [
              { action: 'REGISTER_CARRIER', carrier_id: 'C-401', carrier_type: 'STANDARD', base_rate: 10.0, rate_per_kg: 2.0 },
              { action: 'REGISTER_CARRIER', carrier_id: 'C-401', carrier_type: 'STANDARD', base_rate: 10.0, rate_per_kg: 2.0 }, // Duplicate
              { action: 'RECORD_SHIPMENT', carrier_id: 'C-401', weight_kg: -5.0 }, // Negative weight
            ],
          }),
          expectedOutput: 'REGISTERED_CARRIERS_COUNT: 1\\nTOTAL_SHIPMENTS_COMPLETED: 0\\nTOTAL_SHIPPING_FEES: 0.00\\nHEAVY_SHIPMENTS_HANDLED: 0\\nREJECTED_OPERATIONS: 2\\nPRIMARY_CARRIER_ID: C-401',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-poly-02',
          name: 'Empty Operations Sequence Handling',
          input: JSON.stringify({
            operations: [],
          }),
          expectedOutput: 'REGISTERED_CARRIERS_COUNT: 0\\nTOTAL_SHIPMENTS_COMPLETED: 0\\nTOTAL_SHIPPING_FEES: 0.00\\nHEAVY_SHIPMENTS_HANDLED: 0\\nREJECTED_OPERATIONS: 0\\nPRIMARY_CARRIER_ID: NONE',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-poly-01',
          name: 'Anti-Hardcoding Dynamic Polymorphic Dispatch Probe',
          input: '{"probe_vector": "DYNAMIC_POLYMORPHISM_PROBE"}',
          expectedOutput: '{"dynamically_computed": true, "not_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-poly-01', name: 'FunctionalCorrectness', description: 'Accurately calculates shipping rates across all carrier specializations and tracks counts.', weight: 0.30, maxPoints: 30 },
        { id: 'rub-poly-02', name: 'ObjectModeling', description: 'Models clean entity hierarchies or polymorphic strategies with appropriate base attributes initialized.', weight: 0.20, maxPoints: 20 },
        { id: 'rub-poly-03', name: 'OverridePolymorphismBehavior', description: 'Correctly overrides fee calculation methods and delegates to base implementations where appropriate.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-poly-04', name: 'DesignJudgment', description: 'Avoids excessive type-checking cascades in consumers, utilizing behavioral polymorphism and duck typing.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-poly-05', name: 'DebuggingEdgeCases', description: 'Safely handles missing carriers, duplicate registrations, and invalid weights without crashing.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-poly-06', name: 'CodeQuality', description: 'Clear method names, consistent interface signatures, and clean class organization.', weight: 0.10, maxPoints: 10 },
      ],
    },
  ],
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};

// ── BATCH 007 COMPLETE MANIFEST (DAYS 31–35) ─────────────────────────────────
export const BATCH_007_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m2-w7-007',
  batchCode: 'P1-M2-W7-BATCH007',
  title: 'Inheritance, Overriding & Polymorphic Design (Days 31–35)',
  difficulty: 'BEGINNER',
  days: [
    DAY_31_MANIFEST,
    DAY_32_MANIFEST,
    DAY_33_MANIFEST,
    DAY_34_MANIFEST,
    DAY_35_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};
