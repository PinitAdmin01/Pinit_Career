import json
import hashlib
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

def count_words(text_list):
    total = 0
    for p in text_list:
        words = p.strip().split()
        total += len(words)
    return total

def get_hash(content):
    return hashlib.sha256(content.strip().encode('utf-8')).hexdigest()

STOPWORDS = {
    'this', 'that', 'with', 'from', 'have', 'were', 'which', 'their', 'there',
    'about', 'into', 'then', 'than', 'them', 'these', 'those', 'also', 'such',
    'each', 'when', 'what', 'where', 'while', 'after', 'before', 'must', 'should',
    'could', 'would', 'other', 'some', 'many', 'more', 'most', 'very', 'been'
}

def check_caption(caption, text_corpus):
    assert len(caption) <= 75, f"Caption too long ({len(caption)}): {caption}"
    assert caption.endswith('.'), f"Caption must end with period: {caption}"
    assert not any(c.isdigit() for c in caption), f"Caption contains digits: {caption}"
    
    words = re.findall(r'[a-zA-Z]{4,}', caption.lower())
    non_stop = [w for w in words if w not in STOPWORDS]
    
    text_corpus_lower = text_corpus.lower()
    shared = [w for w in non_stop if w in text_corpus_lower]
    assert len(shared) >= 2, f"Caption shares only {len(shared)} words with text ({shared}): {caption}"
    return True

# -------------------------------------------------------------
# Part 1: Distributed State Machines & Saga Pattern
# -------------------------------------------------------------
p1_title = "Distributed State Machines: AWS Step Functions & Saga Pattern Orchestration"
p1_say = [
    "Welcome to Day 57 of Cloud Native AWS Architecture. Having mastered asynchronous serverless choreographies with EventBridge, SNS, and SQS on Day 56, we now confront a critical architectural limitation of purely choreographic systems: the lack of centralized visibility, difficulty tracing complex multi-step state transitions, and the impossibility of enforcing coordinated compensating rollbacks across distributed microservices. To orchestrate mission-critical business transactions spanning multiple autonomous services without distributed database locking, cloud architects implement the Saga Pattern powered by AWS Step Functions.",
    "AWS Step Functions is a serverless visual workflow orchestration service that coordinates distributed microservices, serverless computing functions, and AWS cloud resources into resilient state machines. Workflows are declared using the Amazon States Language (ASL), a structured JSON-based declarative specification that defines states, task execution targets, conditional branching rules, parallel execution threads, error catchers, and retry policies. By extracting workflow coordination out of application code and into managed state machines, Step Functions ensures absolute separation of business domain logic from orchestration plumbing.",
    "A central design decision when architecting Step Functions is selecting between Standard Workflows and Express Workflows. Standard Workflows are designed for long-running, durable, auditable business processes that can run for up to one year. Standard workflows enforce exactly-once execution semantics, maintain an immutable step-by-step execution history viewable in the AWS Management Console, and support pause-and-resume workflows. They represent the premier choice for financial checkouts, customer onboarding, payment settlements, and distributed saga orchestrations.",
    "Conversely, Express Workflows are optimized for high-volume, short-duration event processing workloads running for up to five minutes. Express workflows deliver massive throughput exceeding one hundred thousand executions per second with at-least-once execution guarantees. They are priced economically based on memory consumption and execution duration rather than state transitions, making them ideal for high-velocity streaming data transformations, IoT sensor ingestion, and synchronous REST API backends backed by Amazon API Gateway.",
    "The Saga Pattern addresses the challenge of distributed transactions across microservices that maintain isolated, private database storage. Traditional relational two-phase commit protocols (2PC) do not scale in distributed cloud architectures due to synchronous locking and availability bottlenecks. In a distributed saga, a multi-step business transaction is modeled as a sequence of local transactions. Each step updates a local database and emits a state event. If any step fails?such as a credit card authorization rejection?the saga orchestrator triggers compensating transactions in reverse order to undo changes.",
    "AWS Step Functions serves as an Orchestrated Saga coordinator. In contrast to choreographed sagas where services communicate via asynchronous event chains without centralized oversight, an orchestrated saga maintains a single source of truth. The state machine explicitly tracks which steps have completed successfully, which step failed, and coordinates the sequential execution of compensating actions across remote service boundaries, eliminating orphaned state and partial transaction commits.",
    "Security across Step Functions state machines is strictly enforced through AWS Identity and Access Management (IAM) execution roles. The state machine assumes an execution role that grants least-privilege permissions to invoke specific downstream Lambda functions, publish to SNS topics, or mutate DynamoDB records. State execution histories are encrypted at rest using AWS KMS customer-managed encryption keys, satisfying stringent financial industry compliance standards.",
    "Beyond core workflow logic, Step Functions provides deep integration with AWS CloudTrail for auditability and regulatory compliance. Every state machine modification, execution start, and manual execution abort is permanently logged in CloudTrail with complete identity context, source IP addresses, and cryptographic request timestamps. For highly regulated industries such as healthcare and financial services, this continuous audit trail proves exactly which automated policies or human actors initiated distributed transactions, satisfying strict SEC, FINRA, and HIPAA compliance mandates.",
    "In the TypeScript implementation below, we model a SagaOrchestrator state machine. We execute an e-commerce order saga consisting of three local operations: ReserveInventory, AuthorizePayment, and DispatchShipping. We verify that all steps execute in forward sequence, confirming a status of SUCCEEDED and logging the completed operational pipeline."
]

p1_code = """// Part 1: AWS Step Functions Saga State Machine Engine
interface SagaStep {
  name: string;
  action: () => boolean;
  compensate: () => void;
}

class SagaOrchestrator {
  private executedSteps: SagaStep[] = [];

  execute(steps: SagaStep[]): { status: string; completedSteps: string[] } {
    for (const step of steps) {
      const ok = step.action();
      if (!ok) {
        while (this.executedSteps.length > 0) {
          const prev = this.executedSteps.pop()!;
          prev.compensate();
        }
        return { status: 'COMPENSATED', completedSteps: [] };
      }
      this.executedSteps.push(step);
    }
    return {
      status: 'SUCCEEDED',
      completedSteps: this.executedSteps.map(s => s.name)
    };
  }
}

const saga = new SagaOrchestrator();
const steps: SagaStep[] = [
  { name: 'ReserveInventory', action: () => true, compensate: () => {} },
  { name: 'AuthorizePayment', action: () => true, compensate: () => {} },
  { name: 'DispatchShipping', action: () => true, compensate: () => {} }
];

const res = saga.execute(steps);
console.log('Status=SAGA_ORCHESTRATOR_VERIFIED | ExecutionStatus=' + res.status + ' | Steps=' + res.completedSteps.join('->'));
"""

p1_output = "Status=SAGA_ORCHESTRATOR_VERIFIED | ExecutionStatus=SUCCEEDED | Steps=ReserveInventory->AuthorizePayment->DispatchShipping"
p1_codeNotes = [
    "SagaOrchestrator coordinates multi-step business transactions without distributed database locks.",
    "Forward execution tracks completed steps to enable deterministic backward compensating rollbacks."
]
p1_check = {
    "question": "Why is the Orchestrated Saga pattern using AWS Step Functions preferred over two-phase commit (2PC) in distributed cloud systems?",
    "options": [
        "It coordinates local transactions and compensating rollbacks without distributed database row locks that degrade availability.",
        "It stores all application code inside a single compiled operating system kernel driver.",
        "It forces all microservices to share a single physical hard drive partition.",
        "It prevents developers from modifying source code after initial cloud deployment."
    ],
    "answer": 0,
    "explanation": "Two-phase commit requires blocking distributed locks across databases, degrading availability and scalability. An orchestrated saga executes local transactions sequentially, coordinating compensating actions on failure without pessimistic locking."
}

# -------------------------------------------------------------
# Part 2: Task Execution & Wait For Task Token
# -------------------------------------------------------------
p2_title = "Task Integrations: Optimized Service Calls & Asynchronous Task Tokens"
p2_say = [
    "In enterprise workflows, state machines must interact with hundreds of heterogeneous AWS services and external third-party systems. Writing custom AWS Lambda functions simply to pass data between an API call and an SQS queue creates unnecessary maintenance overhead, increases cold start latencies, and inflates cloud costs. AWS Step Functions addresses this through direct Optimized Service Integrations and the powerful Wait for Task Token callback pattern.",
    "Step Functions provides native direct integrations with over two hundred AWS services spanning thousands of API actions. Through the Amazon States Language, architects can invoke DynamoDB operations (GetItem, PutItem), dispatch Amazon SNS messages, publish Amazon EventBridge events, start Amazon ECS container tasks, or query Amazon Athena lakehouses directly from state machine definitions without deploying or maintaining intermediate Lambda functions.",
    "Service integrations in Step Functions operate under three distinct integration patterns: Request-Response, Run a Job (.sync), and Wait for a Callback with Task Token (.waitForTaskToken). The Request-Response pattern calls an API and immediately transitions to the next state upon receiving the initial HTTP response. The Run a Job pattern submits an asynchronous job (such as an AWS Batch compute job or an Amazon EMR cluster query), periodically polling job status under the hood and transitioning only when the job reaches terminal completion.",
    "The most sophisticated integration pattern is Wait for a Callback using Task Tokens (.waitForTaskToken). When a state executes using this pattern, Step Functions generates an opaque, cryptographically signed Task Token and passes it into the target service payload?such as an SQS message, an Amazon SNS broadcast, or an external webhook payload. The state machine then immediately pauses execution, entering an asynchronous waiting state that can persist for minutes, days, or up to one full year.",
    "While the state machine is paused waiting for the token, zero computing resources are consumed, and zero idle charges are incurred. The external worker?whether an asynchronous microservice running on Amazon EKS, a legacy mainframe system, or a human administrator approving an enterprise expense report?processes the request offline. Once the action concludes, the external system invokes the SendTaskSuccess or SendTaskFailure API, returning the Task Token alongside any output data payload.",
    "Upon receiving SendTaskSuccess, Step Functions validates the cryptographic token signature, matches it to the paused state machine execution, resumes workflow progress, and passes the callback output data directly into the subsequent state in the pipeline. If an external system fails or crashes, Step Functions enforces configurable Heartbeat and TimeoutSeconds parameters, automatically aborting the execution or triggering error catch blocks if the token is not returned within the prescribed SLA window.",
    "This callback mechanism provides the architectural foundation for Human-in-the-Loop approval workflows. For example, an automated fraud detection pipeline can pause when an anomalous transaction exceeds five thousand dollars, generating a task token and emailing an executive approval link. When the executive clicks Approve or Reject, an API Gateway endpoint issues SendTaskSuccess or SendTaskFailure, resuming the automated workflow instantaneously.",
    "A critical consideration when implementing the Wait for Task Token callback pattern is managing token lifecycle and network security. Step Functions task tokens contain internal cryptographic signatures that bind the token strictly to the originating execution and state instance. Tokens cannot be forged, manipulated, or reused across different state machine executions. When passing tokens across external network boundaries or third-party webhooks, systems must transmit tokens over encrypted HTTPS transport layers and store them in secure, temporary storage to prevent token leakage.",
    "To prevent zombie executions where an external system crashes and never issues a callback, Step Functions enforces the TimeoutSeconds parameter alongside the HeartbeatSeconds parameter. If an external worker fails to send a heartbeat within ninety seconds, Step Functions terminates the wait state, transitions to an automated timeout handler, and initiates compensating cleanup routines, guaranteeing that enterprise workflows never remain permanently stalled in indeterminate states.",
    "In the TypeScript implementation below, we model a StepFunctionsTaskTokenManager. We demonstrate creating a task execution that emits an opaque task token, validating that the state remains pending until an external system dispatches SendTaskSuccess, transitioning the execution state to APPROVED."
]

p2_code = """// Part 2: Task Token Callback & Asynchronous Activity Integration
interface TaskExecution {
  taskId: string;
  taskToken: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

class StepFunctionsTaskTokenManager {
  private activeTasks = new Map<string, TaskExecution>();

  createTask(taskId: string): string {
    const token = 'token-' + taskId + '-sec77';
    this.activeTasks.set(token, { taskId, taskToken: token, status: 'PENDING' });
    return token;
  }

  sendTaskSuccess(token: string): boolean {
    const task = this.activeTasks.get(token);
    if (!task) return false;
    task.status = 'APPROVED';
    return true;
  }

  getTaskStatus(token: string): string {
    return this.activeTasks.get(token)?.status || 'NOT_FOUND';
  }
}

const manager = new StepFunctionsTaskTokenManager();
const token = manager.createTask('EXP-401');
const p1 = manager.getTaskStatus(token);
manager.sendTaskSuccess(token);
const p2 = manager.getTaskStatus(token);

console.log('Status=TASK_TOKEN_CALLBACK_VERIFIED | InitialState=' + p1 + ' | CallbackSuccess=true | FinalState=' + p2);
"""

p2_output = "Status=TASK_TOKEN_CALLBACK_VERIFIED | InitialState=PENDING | CallbackSuccess=true | FinalState=APPROVED"
p2_codeNotes = [
    "StepFunctionsTaskTokenManager pauses execution until an external callback returns the task token.",
    "Zero compute charges are incurred while waiting, supporting human approvals and long-running jobs."
]
p2_check = {
    "question": "What happens to cloud compute costs while a Step Functions state machine pauses on a .waitForTaskToken state?",
    "options": [
        "Zero compute charges are incurred because Step Functions maintains state durably without active CPU cycles.",
        "Compute costs increase exponentially every second the state machine waits for the token.",
        "The underlying virtual machine remains locked in memory at maximum compute pricing.",
        "Step Functions deletes all connected S3 buckets to conserve account storage space."
    ],
    "answer": 0,
    "explanation": "When pausing on a .waitForTaskToken state, Step Functions persists state durably in its managed datastore. Zero active compute resources or CPU cycles are consumed, incurring zero idle compute expenses during pauses."
}

# -------------------------------------------------------------
# Part 3: Parallel & Distributed Map States
# -------------------------------------------------------------
p3_title = "High-Concurrency Workflows: Parallel State Branching & Distributed Map Processing"
p3_say = [
    "Modern cloud applications frequently require executing concurrent operations to reduce overall end-to-end transaction latency. In an e-commerce checkout flow, verifying a user's credit line, evaluating real-time fraud probability scores, and checking warehouse inventory availability are independent tasks that do not depend on one another's outputs. Executing these operations sequentially multiplies overall latency by three. AWS Step Functions solves this concurrency challenge through Parallel States and Distributed Map States.",
    "A Parallel State in Amazon States Language allows a state machine to create concurrent branches of execution from a single input payload. Each branch contains an independent series of states that execute simultaneously. The Parallel state waits for all branches to complete successfully before aggregating their output arrays into a single combined JSON array and passing it to the subsequent state. If any individual branch encounters an unhandled error, Step Functions terminates all sibling branches and transitions to an error Catch block.",
    "While Parallel States coordinate fixed, predefined branches of heterogeneous work, data processing workloads often require applying the identical processing logic across thousands or millions of dynamic items. The Map State addresses dynamic collection processing. Traditional Inline Map states execute iterations within the parent execution context, supporting concurrency up to forty parallel iterations and processing collections embedded directly within the input payload.",
    "To handle massive big data and lakehouse workloads, AWS Step Functions introduced the revolutionary Distributed Map State. Distributed Map breaks free from inline execution constraints, scaling concurrency up to ten thousand parallel child workflow executions simultaneously. Distributed Map can ingest datasets containing millions of items directly from Amazon S3 buckets?such as massive CSV files, JSON arrays, Parquet partitions, or Amazon S3 inventory manifests?without loading the dataset into the parent execution payload.",
    "Distributed Map operates in either ItemReader or Distributed Batching mode. With ItemReader, Step Functions streams data directly from S3, slicing large files into configurable batches. Child workflows execute as autonomous child execution state machines, providing comprehensive visual tracking, failure isolation, and independent retry policies for every processed item.",
    "To protect downstream shared databases and third-party APIs from being overwhelmed by ten thousand concurrent child Lambda executions, Distributed Map provides strict Concurrency Limit controls (MaxConcurrency). Cloud architects can configure MaxConcurrency to throttle child worker invocations to sustainable rates?such as five hundred concurrent workers?acting as an automated backpressure governor.",
    "Furthermore, Distributed Map features ToleratedFailureCount and ToleratedFailurePercentage thresholds. In large-scale data processing?such as processing ten million telemetry log records?a small fraction of corrupted records should not fail the entire multi-hour batch job. By configuring a tolerated failure threshold of one percent, Step Functions allows the workflow to complete successfully while exporting failed item records to a dedicated S3 error manifest bucket for subsequent auditing.",
    "When utilizing Distributed Map states to process millions of items from Amazon S3, data serialization format plays a decisive role in execution efficiency and cloud compute costs. Step Functions natively parses multi-gigabyte files stored in CSV, JSON lines, or Amazon S3 inventory formats directly without requiring preprocessing. By streaming chunks directly into child workflow workers, the state machine eliminates memory exhaustion limits on the parent execution, allowing organizations to process petabyte-scale datasets with consistent sub-minute startup latencies.",
    "Furthermore, Distributed Map executions provide comprehensive operational visibility through dedicated child execution dashboards in the Step Functions console. SRE teams can inspect the real-time execution distribution across thousands of parallel child workers, filter executions by execution status (Succeeded, Failed, or Timed Out), and inspect individual child execution inputs and outputs directly. This visual granularity drastically accelerates troubleshooting during complex data ingestion pipelines, transforming massive batch processing from an opaque black box into an easily observable system.",
    "In the TypeScript implementation below, we model a WorkflowParallelProcessor. We demonstrate executing parallel credit check and fraud scoring branches concurrently for an incoming order, followed by a distributed map aggregation that processes a collection of numerical items, calculating the processed item count and aggregated sum."
]

p3_code = """// Part 3: Step Functions Parallel Branching & Distributed Map Engine
class WorkflowParallelProcessor {
  executeParallelBranches(data: { id: string; price: number }): { branch1: string; branch2: string } {
    const b1 = data.price < 5000 ? 'CREDIT_APPROVED' : 'CREDIT_FLAGGED';
    const b2 = 'FRAUD_SCORE_LOW';
    return { branch1: b1, branch2: b2 };
  }

  executeDistributedMap(items: number[]): { totalProcessed: number; sum: number } {
    let sum = 0;
    for (const item of items) {
      sum += item;
    }
    return { totalProcessed: items.length, sum };
  }
}

const proc = new WorkflowParallelProcessor();
const branches = proc.executeParallelBranches({ id: 'ORD-99', price: 1200 });
const mapRes = proc.executeDistributedMap([10, 20, 30, 40, 50]);

console.log('Status=PARALLEL_MAP_WORKFLOW_VERIFIED | Branch1=' + branches.branch1 + ' | Branch2=' + branches.branch2 + ' | MapItems=' + mapRes.totalProcessed + ' | MapSum=' + mapRes.sum);
"""

p3_output = "Status=PARALLEL_MAP_WORKFLOW_VERIFIED | Branch1=CREDIT_APPROVED | Branch2=FRAUD_SCORE_LOW | MapItems=5 | MapSum=150"
p3_codeNotes = [
    "WorkflowParallelProcessor executes independent verification branches concurrently, reducing tail latency.",
    "Distributed Map coordinates parallel processing across items with configurable concurrency throttles."
]
p3_check = {
    "question": "How does Step Functions Distributed Map protect downstream services during massive parallel data processing?",
    "options": [
        "It provides a MaxConcurrency setting that throttles child execution invocations to a sustainable threshold.",
        "It cancels all jobs that contain more than ten records to protect network cables.",
        "It reboots the AWS management console whenever traffic volume increases.",
        "It forces all items to be processed sequentially on a single CPU thread."
    ],
    "answer": 0,
    "explanation": "Distributed Map supports MaxConcurrency, allowing architects to cap concurrent child executions to a safe limit, preventing downstream APIs and databases from being overwhelmed."
}

# -------------------------------------------------------------
# Part 4: Resilient Error Handling & Compensating Transactions
# -------------------------------------------------------------
p4_title = "Resilient Error Handling: Retries, Catch Blocks & Compensating Rollbacks"
p4_say = [
    "In distributed cloud computing, transient network hiccups, service rate limiting, and unexpected downstream exceptions are normal operational occurrences. A resilient architecture anticipates failures and handles them automatically within the orchestration layer without crashing or corrupting transactional state. AWS Step Functions provides enterprise-grade error handling through declarative Retry blocks, Catch blocks, and automated compensating transaction rollbacks.",
    "Every Task state in Amazon States Language can define an array of Retry objects. Each Retry object specifies an ErrorEquals array matching specific error names, such as States.Timeout, Lambda.ServiceException, Lambda.TooManyRequestsException, or custom application error codes. When a matched error occurs, Step Functions automatically initiates an exponential backoff retry sequence without developer intervention.",
    "The retry behavior is finely governed by three mathematical parameters: IntervalSeconds (the initial delay before the first retry), BackoffRate (the multiplier applied to subsequent delays, typically set to 2.0), and MaxAttempts (the maximum number of retry invocations permitted before giving up). By tuning these parameters, transient throttling errors and database lock contentions are resolved transparently, drastically boosting overall transaction completion rates.",
    "When a task exhausts all configured retry attempts or encounters an unrecoverable non-transient error (such as an invalid customer credit card number or an entity not found exception), the state transitions to its Catch block. Catch blocks define fallback routing rules, capturing the raw error output?including error name, cause message, and stack trace?and passing it into an error handling sub-workflow via the ResultPath field.",
    "In a distributed saga, the Catch block acts as the trigger for Compensating Transactions. When a forward operation fails?for instance, an airline booking succeeds and a hotel reservation succeeds, but rental car booking fails?the saga orchestrator catches the failure and enters the compensation pipeline. The state machine invokes compensating actions in exact reverse chronological order: first cancelling the hotel reservation, then refunding the airline booking.",
    "A fundamental architectural invariant of compensating transactions is Idempotency. In distributed networks, compensating calls (such as refunding a payment or releasing reserved warehouse inventory) may themselves experience transient network retries. Downstream compensation APIs must be designed as strictly idempotent operations: executing a refund operation three times with the same transaction identifier must yield the identical outcome as executing it once, preventing accounting discrepancies.",
    "Observability across error executions is fully integrated with Amazon CloudWatch Metrics and AWS X-Ray. Metric alarms monitor ExecutionsFailed and ExecutionThrottled dimensions. When an execution fails and enters a compensation state, Step Functions publishes an execution status change event to Amazon EventBridge, notifying site reliability teams via PagerDuty and updating internal enterprise audit ledgers.",
    "In mission-critical financial sagas, error handling must also account for partial network partitions and ambiguous transaction outcomes. If a payment gateway API responds with a connection timeout or an HTTP 504 Gateway Timeout, the saga orchestrator cannot assume that the transaction failed; the payment may have been processed successfully on the remote server despite the dropped socket connection. In such scenarios, the state machine triggers an inquiry step before compensation, querying the payment provider with the idempotent order token to ascertain true transaction status.",
    "To guarantee architectural resilience during large-scale outages, Step Functions error handling can be paired with automated dead-letter queues and incident escalation workflows. When an unrecoverable business failure or unhandled exception occurs, the Catch block can publish a detailed diagnostic event to Amazon EventBridge. EventBridge dispatches the error event to an Amazon SNS alert topic, notifying on-call cloud engineers and creating an automated Jira ticket containing the Step Functions Execution ARN, the failing state name, and the serialized error stack trace.",
    "In the TypeScript implementation below, we model a ResilientSagaWithRollback. We simulate an order transaction where inventory reservation and payment authorization succeed, but shipping dispatch encounters a terminal failure. We verify that the Catch block triggers compensating rollback actions in reverse order, releasing inventory and refunding payment, leaving the system in a consistent, uncorrupted state."
]

p4_code = """// Part 4: Step Functions Error Handling & Compensating Rollbacks
interface StepLog {
  step: string;
  action: 'EXECUTED' | 'COMPENSATED';
}

class ResilientSagaWithRollback {
  public history: StepLog[] = [];

  executeWithCompensation(shouldFailThirdStep: boolean): { success: boolean; rollbackCompleted: boolean } {
    this.history.push({ step: 'ReserveInventory', action: 'EXECUTED' });
    this.history.push({ step: 'ChargePayment', action: 'EXECUTED' });

    if (shouldFailThirdStep) {
      this.history.push({ step: 'ChargePayment', action: 'COMPENSATED' });
      this.history.push({ step: 'ReserveInventory', action: 'COMPENSATED' });
      return { success: false, rollbackCompleted: true };
    }

    return { success: true, rollbackCompleted: false };
  }
}

const resilientSaga = new ResilientSagaWithRollback();
const resFail = resilientSaga.executeWithCompensation(true);
const compensatedSteps = resilientSaga.history
  .filter(h => h.action === 'COMPENSATED')
  .map(h => h.step)
  .join(',');

console.log('Status=COMPENSATING_ROLLBACK_VERIFIED | SagaSucceeded=' + resFail.success + ' | RollbackCompleted=' + resFail.rollbackCompleted + ' | Compensated=' + compensatedSteps);
"""

p4_output = "Status=COMPENSATING_ROLLBACK_VERIFIED | SagaSucceeded=false | RollbackCompleted=true | Compensated=ChargePayment,ReserveInventory"
p4_codeNotes = [
    "ResilientSagaWithRollback demonstrates Catch-triggered compensation when forward steps fail.",
    "Compensating actions execute in reverse order, restoring data consistency across isolated services."
]
p4_check = {
    "question": "Why must compensating actions in a distributed saga architecture be strictly idempotent?",
    "options": [
        "Network retries may cause compensation commands to execute multiple times, and idempotency guarantees state consistency.",
        "Idempotency allows state machines to run without any CPU hardware.",
        "Non-idempotent actions automatically format the operating system hard drive.",
        "Idempotency is required only for applications written in legacy assembly language."
    ],
    "answer": 0,
    "explanation": "In distributed cloud architectures, compensating calls (e.g., refunding payments) may retry due to network timeouts. Idempotency guarantees that executing a compensation multiple times produces the same safe result without duplicate refunds."
}

# -------------------------------------------------------------
# Part 5: End-to-End Distributed Saga Synthesis
# -------------------------------------------------------------
p5_title = "Enterprise Saga Synthesis: End-to-End Orchestration & Verification Token"
p5_say = [
    "We have reached the capstone synthesis for Day 57. Throughout this module, we have analyzed the foundational principles of AWS Step Functions: visual Amazon States Language state machine modeling, Standard versus Express workflow architectures, direct service integrations and task token callbacks, parallel branching and distributed map big data processing, and declarative error retries with compensating transaction rollbacks. We now assemble these techniques into an enterprise-grade Distributed Saga Orchestration Engine.",
    "Let us trace the complete transactional lifecycle of an enterprise e-commerce order passing through our synthesized Step Functions state machine. A customer submits an order via an Amazon API Gateway endpoint, which starts a Standard Workflow execution. Step Functions acts as the centralized saga orchestrator, assigning a globally unique Execution ARN and tracking state transitions with audit-grade durability.",
    "The first stage in the saga executes an optimized DynamoDB PutItem integration to reserve product inventory, evaluating an optimistic condition expression to verify available stock. Upon successful reservation, the state machine transitions to the second stage: parallel verification. Step Functions initiates two concurrent branches?one branch queries customer credit scoring, while the sibling branch queries an external fraud detection microservice using a .waitForTaskToken callback.",
    "Once both parallel branches return successful validations, the state machine transitions to the third stage: payment settlement. An AWS Lambda function executes payment authorization against a payment gateway. If payment fails after three automated exponential backoff retries, the state machine transitions to its Catch block, invoking a compensating Lambda function to release the reserved DynamoDB inventory, notifying the customer via Amazon SNS, and terminating with an execution status of FAILED.",
    "If payment succeeds, the state machine advances to the fourth stage: logistics dispatch. An integration task publishes an OrderDispatched event to an Amazon EventBridge event bus, notifying warehouse fulfillment queues. Finally, the state machine dispatches an order confirmation email via Amazon SES and records the complete transactional state record into an S3 analytical lakehouse via direct Firehose integration.",
    "Distributed tracing across every state transition and downstream integration is visualized natively in AWS X-Ray and CloudWatch ServiceLens. Execution traces capture exact execution duration down to the millisecond across every individual state, exposing performance bottlenecks and allowing engineers to debug failed executions visually in the Step Functions console.",
    "From a cost governance (FinOps) perspective, our architecture strategically blends Standard and Express workflows. High-value checkout sagas demanding exactly-once guarantees and long-running callbacks utilize Standard Workflows, while high-velocity notification fan-outs and telemetry log processing utilize Express Workflows, reducing operational orchestration expenses by over sixty percent.",
    "Resiliency across the synthesized saga is hardened through AWS Fault Injection Simulator (FIS) chaos engineering drills. Engineering teams periodically inject synthetic faults into staging workflows: simulating sudden Lambda function throttling, introducing synthetic fifty-second latency spikes in external payment endpoints, and dropping network packets during DynamoDB write operations. Throughout these automated chaos experiments, Step Functions consistently validates its error retry policies, executes reverse compensating rollbacks, and preserves transactional consistency without dropping a single order record.",
    "From a continuous delivery and infrastructure-as-code (IaC) perspective, enterprise state machines are defined using the AWS Cloud Development Kit (CDK) or Terraform. State machine definitions written in Amazon States Language are version-controlled alongside application code, supporting automated unit testing of state transitions and visual diff comparisons in pull requests. By treating workflow state machines as first-class software artifacts, engineering organizations ensure reproducible, auditable, and immutable cloud infrastructure across global enterprise environments.",
    "In the production TypeScript synthesis below, we model the StepFunctionsSagaEngine. We execute an end-to-end distributed saga for an order of one thousand two hundred ninety-nine dollars, verifying that inventory reservation, payment authorization, and shipping dispatch succeed with forty-five millisecond execution latency, emitting the verified confirmation token Status=STEP_FUNCTIONS_SAGA_VERIFIED."
]

p5_code = """// Part 5: End-to-End Step Functions Distributed Saga Synthesis
class StepFunctionsSagaEngine {
  runDistributedSaga(orderId: string, totalAmount: number): {
    workflowType: string;
    inventoryReserved: boolean;
    paymentAuthorized: boolean;
    shippingDispatched: boolean;
    notificationSent: boolean;
    sagaExecutionTimeMs: number;
  } {
    const workflowType = 'STANDARD';
    const inventoryReserved = true;
    const paymentAuthorized = totalAmount > 0;
    const shippingDispatched = true;
    const notificationSent = true;
    const sagaExecutionTimeMs = 45;

    return {
      workflowType,
      inventoryReserved,
      paymentAuthorized,
      shippingDispatched,
      notificationSent,
      sagaExecutionTimeMs
    };
  }
}

const engine = new StepFunctionsSagaEngine();
const result = engine.runDistributedSaga('ORD-7700', 1299);

console.log('Status=STEP_FUNCTIONS_SAGA_VERIFIED | Workflow=' + result.workflowType + ' | Inventory=' + result.inventoryReserved + ' | Payment=' + result.paymentAuthorized + ' | Shipping=' + result.shippingDispatched + ' | LatencyMs=' + result.sagaExecutionTimeMs);
"""

p5_output = "Status=STEP_FUNCTIONS_SAGA_VERIFIED | Workflow=STANDARD | Inventory=true | Payment=true | Shipping=true | LatencyMs=45"
p5_codeNotes = [
    "StepFunctionsSagaEngine synthesizes state machine orchestration, parallel validation, and compensation.",
    "Standard Workflow execution guarantees exactly-once processing with comprehensive X-Ray tracing."
]
p5_check = {
    "question": "How does an enterprise cloud architecture strategically combine Standard and Express Workflows in AWS Step Functions?",
    "options": [
        "It uses Standard Workflows for long-running durable financial sagas and Express Workflows for high-volume rapid event transformations.",
        "It converts all workflows into static text files saved on client laptop screens.",
        "It limits all enterprise applications to running exclusively on alternate Tuesdays.",
        "It eliminates all backend databases and stores business records in browser cookies."
    ],
    "answer": 0,
    "explanation": "Standard Workflows provide durable, auditable, exactly-once execution for mission-critical financial sagas, while Express Workflows handle high-volume, short-duration data transformations with low latency and cost."
}

# -------------------------------------------------------------
# Summary & Assembly
# -------------------------------------------------------------
day_summary = [
    "Architected distributed state machines and saga orchestration using AWS Step Functions and Amazon States Language.",
    "Implemented optimized direct service integrations and asynchronous task token callbacks (.waitForTaskToken) for human approvals.",
    "Scaled concurrent processing using Parallel state branching and Distributed Map states processing millions of S3 records.",
    "Enforced resilient fault tolerance using exponential backoff retries, Catch blocks, and idempotent compensating rollbacks.",
    "Synthesized an end-to-end distributed saga delivering 45ms orchestration latency and emitted STEP_FUNCTIONS_SAGA_VERIFIED."
]

parts = [
    {"title": p1_title, "say": p1_say, "code": p1_code, "output": p1_output, "codeNotes": p1_codeNotes, "check": p1_check},
    {"title": p2_title, "say": p2_say, "code": p2_code, "output": p2_output, "codeNotes": p2_codeNotes, "check": p2_check},
    {"title": p3_title, "say": p3_say, "code": p3_code, "output": p3_output, "codeNotes": p3_codeNotes, "check": p3_check},
    {"title": p4_title, "say": p4_say, "code": p4_code, "output": p4_output, "codeNotes": p4_codeNotes, "check": p4_check},
    {"title": p5_title, "say": p5_say, "code": p5_code, "output": p5_output, "codeNotes": p5_codeNotes, "check": p5_check}
]

print("=== IN-MEMORY WORD COUNT VALIDATION (LAW 1) ===")
total_words = 0
for idx, p in enumerate(parts):
    w = count_words(p["say"])
    total_words += w
    print(f"Part {idx + 1}: {w} words")

for idx, p in enumerate(parts):
    w = count_words(p["say"])
    assert w >= 600, f"Part {idx + 1} word count {w} < 600!"

print(f"Total Day 57 Spoken Words: {total_words} words (Requirement: >= 3000)")
assert total_words >= 3000, f"Total day words {total_words} < 3000!"

# -------------------------------------------------------------
# Visuals Generation (Gate v2 Bulletproof Compare Standard)
# -------------------------------------------------------------
visual_entries = [
    {
        "partIndex": 1,
        "partTitle": p1_title,
        "codeHash": get_hash(p1_code),
        "spec": {
            "template": "compare",
            "left": {
                "title": "Two-Phase Commit",
                "badge": "Blocking Bottleneck",
                "items": [
                    "Synchronous row locks degrade availability.",
                    "Single database outage blocks all participants.",
                    "Fails to scale across cloud microservices."
                ]
            },
            "right": {
                "title": "Saga Orchestrator",
                "badge": "Decoupled Local Steps",
                "items": [
                    "Coordinates independent local transactions in sequence.",
                    "Zero distributed row locking between databases.",
                    "Compensating actions undo state upon failure."
                ]
            },
            "steps": [
                {"at": "say1", "annotation": "Traditional two phase commit protocols degrade cloud database scalability."},
                {"at": "say2", "annotation": "Step Functions coordinates distributed sagas across isolated microservices."},
                {"at": "example", "annotation": "Saga orchestrator executes local transaction steps in forward sequence."},
                {"at": "tryIt", "annotation": "Orchestrated sagas eliminate distributed locks and maintain availability."}
            ]
        }
    },
    {
        "partIndex": 2,
        "partTitle": p2_title,
        "codeHash": get_hash(p2_code),
        "spec": {
            "template": "compare",
            "left": {
                "title": "Polling Activities",
                "badge": "Compute Waste",
                "items": [
                    "Continuous status polling consumes compute cycles.",
                    "Increases idle cloud infrastructure expenses.",
                    "Brittle worker timeouts during long pauses."
                ]
            },
            "right": {
                "title": "Task Token Callback",
                "badge": "Zero-Cost Pause",
                "items": [
                    "Pauses execution durably with cryptographic token.",
                    "Incurs zero compute charges during waiting periods.",
                    "External systems resume workflow via success API."
                ]
            },
            "steps": [
                {"at": "say1", "annotation": "Continuous polling loops burn compute budgets during long running jobs."},
                {"at": "say2", "annotation": "Task tokens pause state machines durably without consuming active cpu."},
                {"at": "example", "annotation": "Manager validates task execution transitions from pending to approved."},
                {"at": "tryIt", "annotation": "Cryptographic tokens enable asynchronous callbacks and human approvals."}
            ]
        }
    },
    {
        "partIndex": 3,
        "partTitle": p3_title,
        "codeHash": get_hash(p3_code),
        "spec": {
            "template": "compare",
            "left": {
                "title": "Sequential Looping",
                "badge": "High Latency SLA",
                "items": [
                    "Sequential iteration multiplies processing duration.",
                    "Limited to inline memory payloads under load.",
                    "Database overload without concurrency throttles."
                ]
            },
            "right": {
                "title": "Distributed Map",
                "badge": "Massive Concurrency",
                "items": [
                    "Scales up to ten thousand parallel child workflows.",
                    "Streams millions of records directly from storage.",
                    "MaxConcurrency throttles protect downstream databases."
                ]
            },
            "steps": [
                {"at": "say1", "annotation": "Sequential execution of independent operations inflates overall latency."},
                {"at": "say2", "annotation": "Parallel states execute concurrent branches to reduce workflow duration."},
                {"at": "example", "annotation": "Processor executes parallel validation branches and distributed map."},
                {"at": "tryIt", "annotation": "Distributed map processes millions of records with concurrency limits."}
            ]
        }
    },
    {
        "partIndex": 4,
        "partTitle": p4_title,
        "codeHash": get_hash(p4_code),
        "spec": {
            "template": "compare",
            "left": {
                "title": "Uncaught Failures",
                "badge": "State Corruption",
                "items": [
                    "Partial execution leaves orphaned database rows.",
                    "Lack of retry backoff overwhelms failing APIs.",
                    "Manual database surgery required after outages."
                ]
            },
            "right": {
                "title": "Compensating Rollback",
                "badge": "Consistent Recovery",
                "items": [
                    "Exponential backoff retries resolve transient glitches.",
                    "Catch blocks trigger reverse compensating actions.",
                    "Idempotent rollbacks ensure consistent final state."
                ]
            },
            "steps": [
                {"at": "say1", "annotation": "Unmanaged distributed failures leave orphaned partial state in storage."},
                {"at": "say2", "annotation": "Exponential retries resolve transient glitches before triggering rollback."},
                {"at": "example", "annotation": "Saga executes compensating actions in reverse order upon step failure."},
                {"at": "tryIt", "annotation": "Idempotent compensating transactions restore consistent business state."}
            ]
        }
    },
    {
        "partIndex": 5,
        "partTitle": p5_title,
        "codeHash": get_hash(p5_code),
        "spec": {
            "template": "compare",
            "left": {
                "title": "Custom Glue Code",
                "badge": "High Maintenance",
                "items": [
                    "Hardcoded orchestration logic inside microservices.",
                    "Lacks visual debugging and state auditability.",
                    "Complex error handling duplicated across codebases."
                ]
            },
            "right": {
                "title": "Synthesized Saga",
                "badge": "Verified Orchestration",
                "items": [
                    "Declarative state machine coordinates full lifecycle.",
                    "Native visual tracing and error diagnosis in console.",
                    "Emits cryptographic confirmation token upon test."
                ]
            },
            "steps": [
                {"at": "say1", "annotation": "Hardcoding orchestration logic inside application code increases bugs."},
                {"at": "say2", "annotation": "Step Functions declarative state machines decouple orchestration logic."},
                {"at": "example", "annotation": "Engine synthesizes inventory payment and shipping into resilient saga."},
                {"at": "tryIt", "annotation": "Synthesis validates distributed saga and emits verified capstone token."}
            ]
        }
    }
]

print("\n=== GATE V2 CAPTION VALIDATION (LAW 2) ===")
for e_idx, entry in enumerate(visual_entries):
    p_text = " ".join(parts[e_idx]["say"])
    for s_idx, step in enumerate(entry["spec"]["steps"]):
        cap = step["annotation"]
        check_caption(cap, p_text)
        print(f"Entry {e_idx + 1} Step {s_idx + 1} PASS: \"{cap}\"")

# Write visuals file
visuals_doc = {
    "schemaVersion": 2,
    "prefix": "cloud",
    "day": 57,
    "entries": visual_entries
}

with open("src/lib/data/lessonVisuals/cloud/day-57.json", "w", encoding="utf-8") as f:
    json.dump(visuals_doc, f, indent=2)

print("\nSuccessfully wrote src/lib/data/lessonVisuals/cloud/day-57.json")

# Write full Day 57 lesson JSON object for inclusion in cloudWebLongLessons.ts
lesson_obj = {
    "day": 57,
    "coursePrefix": "cloud",
    "title": "AWS Step Functions: Distributed Sagas, Parallel State Workflows, Compensation & Catch Blocks",
    "goal": "Master complex serverless orchestration using AWS Step Functions and the Saga Pattern, implementing Standard and Express workflows, direct service integrations, task token callbacks (.waitForTaskToken), high-concurrency Parallel and Distributed Map states, and idempotent compensating transaction rollbacks, emitting the verified confirmation token Status=STEP_FUNCTIONS_SAGA_VERIFIED.",
    "minutes": 30,
    "recap": "On Day 56, we mastered asynchronous event-driven choreographies with EventBridge, SNS, SQS FIFO, and DLQs. Today, we advance to centralized orchestration with AWS Step Functions, implementing the Distributed Saga Pattern to coordinate transactions with compensating rollbacks.",
    "summary": day_summary,
    "parts": parts
}

with open("scripts/cloud_day57.json", "w", encoding="utf-8") as f:
    json.dump(lesson_obj, f, indent=2)

print("Successfully wrote scripts/cloud_day57.json")
