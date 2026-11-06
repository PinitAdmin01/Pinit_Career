import json
import hashlib
import os
import re

from data_devops_day31 import DAY_31
from data_devops_day32 import DAY_32
from data_devops_day33 import DAY_33
from data_devops_day34 import DAY_34
from data_devops_day35 import DAY_35

ALL_DAYS = [DAY_31, DAY_32, DAY_33, DAY_34, DAY_35]

STOPWORDS = {
    'this', 'that', 'with', 'from', 'have', 'were', 'been', 'their', 'there',
    'which', 'about', 'would', 'could', 'should', 'these', 'those', 'where',
    'after', 'before', 'while', 'under', 'other', 'into', 'then', 'than',
    'when', 'what', 'some', 'more', 'most', 'such', 'only', 'over', 'also'
}

def extract_meaningful_words(text: str) -> set:
    words = re.findall(r'[a-zA-Z]{4,}', text.lower())
    return {w for w in words if w not in STOPWORDS}

def get_text_at_step(part: dict, at: str) -> str:
    if at.startswith("say"):
        idx = int(at[3:]) - 1
        if 0 <= idx < len(part.get("say", [])):
            return part["say"][idx]
    elif at == "example":
        return part.get("example", "")
    elif at == "tryIt":
        return part.get("tryIt", "")
    return ""

def validate_caption(caption: str, lesson_text: str, context: str):
    assert len(caption) <= 75, f"{context}: caption exceeds 75 chars ({len(caption)}): '{caption}'"
    assert caption.endswith('.'), f"{context}: caption must end with period: '{caption}'"
    assert not any(c.isdigit() for c in caption), f"{context}: caption contains digits: '{caption}'"
    caption_words = extract_meaningful_words(caption)
    lesson_words = extract_meaningful_words(lesson_text)
    shared = caption_words.intersection(lesson_words)
    assert len(shared) >= 2, f"{context}: caption shares < 2 words ({shared}) with text: '{caption}'"

# Visual specs data across all 5 days
VISUAL_SPECS = {
    31: [
        {
            "title": "OverlayFS upper and lower directory comparison",
            "leftLabel": "Read-Only Lower Directory",
            "rightLabel": "Mutable Upper Directory",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Linux containers rely on union filesystem drivers to assemble directories.",
                    "left": { "code": "lowerdirLayers", "result": { "text": "immutable" }, "tone": "ok" },
                    "right": { "code": "overlayFsDriver", "result": { "text": "runtime" }, "tone": "accent" }
                },
                {
                    "at": "say2",
                    "caption": "Container engine lower layers are strictly read only on host storage.",
                    "left": { "code": "imageLayers", "result": { "text": "read-only" }, "tone": "ok" },
                    "right": { "code": "hostFilesystem", "result": { "text": "shared" }, "tone": "accent" }
                },
                {
                    "at": "example",
                    "caption": "Shifting large dataset files to external volume mounts avoids penalty.",
                    "left": { "code": "datasetStorage", "result": { "text": "external" }, "tone": "ok" },
                    "right": { "code": "volumeMounts", "result": { "text": "zero-cow" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Adding large memory files triggers duplicate allocation in upper layer.",
                    "left": { "code": "lowerMemoryFile", "result": { "text": "allocated" }, "tone": "ok" },
                    "right": { "code": "upperDuplication", "result": { "text": "copied" }, "tone": "accent" }
                }
            ]
        },
        {
            "title": "BuildKit parallel execution and secret mounts",
            "leftLabel": "Legacy Docker Builder",
            "rightLabel": "Modern BuildKit LLB",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Legacy Docker builders executed instructions sequentially line by line.",
                    "left": { "code": "legacyBuilder", "result": { "text": "sequential" }, "tone": "warn" },
                    "right": { "code": "buildKitEngine", "result": { "text": "parallel" }, "tone": "ok" }
                },
                {
                    "at": "say3",
                    "caption": "Mounting private tokens directly into run instructions leaves zero trace.",
                    "left": { "code": "dockerfileArgs", "result": { "text": "leaked" }, "tone": "warn" },
                    "right": { "code": "secretMounts", "result": { "text": "in-memory" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Fintech platform microservices cut build duration using remote caching.",
                    "left": { "code": "legacyDuration", "result": { "text": "slow" }, "tone": "warn" },
                    "right": { "code": "cachedDuration", "result": { "text": "ninety-sec" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Uncached stages extend execution while preserving zero secret exposure.",
                    "left": { "code": "stageDuration", "result": { "text": "extended" }, "tone": "data" },
                    "right": { "code": "secretExposure", "result": { "text": "zero" }, "tone": "ok" }
                }
            ]
        },
        {
            "title": "Rootless user namespace credential mapping",
            "leftLabel": "Host User Credentials",
            "rightLabel": "Container Namespace",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Traditional container runtimes execute with full host root privileges.",
                    "left": { "code": "dockerDaemon", "result": { "text": "host-root" }, "tone": "warn" },
                    "right": { "code": "rootlessDaemon", "result": { "text": "unprivileged" }, "tone": "ok" }
                },
                {
                    "at": "say2",
                    "caption": "Rootless container technology allows unprivileged users to run daemons.",
                    "left": { "code": "standardUser", "result": { "text": "unprivileged" }, "tone": "ok" },
                    "right": { "code": "userNamespace", "result": { "text": "isolated" }, "tone": "accent" }
                },
                {
                    "at": "example",
                    "caption": "Shared student laboratory prevented breakout using rootless podman.",
                    "left": { "code": "studentExploit", "result": { "text": "contained" }, "tone": "ok" },
                    "right": { "code": "hostSecurity", "result": { "text": "protected" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Target host file owner permissions determine container access rights.",
                    "left": { "code": "fileOwnership", "result": { "text": "validated" }, "tone": "ok" },
                    "right": { "code": "kernelAccess", "result": { "text": "restricted" }, "tone": "accent" }
                }
            ]
        },
        {
            "title": "Distroless runtime minimal image footprint",
            "leftLabel": "General Distribution Image",
            "rightLabel": "Hardened Distroless Base",
            "steps": [
                {
                    "at": "say1",
                    "caption": "General purpose distribution images package unnecessary utility binaries.",
                    "left": { "code": "ubuntuBase", "result": { "text": "bloated" }, "tone": "warn" },
                    "right": { "code": "distrolessBase", "result": { "text": "minimal" }, "tone": "ok" }
                },
                {
                    "at": "say3",
                    "caption": "Absence of shell binaries prevents remote command injection attacks.",
                    "left": { "code": "shellPresent", "result": { "text": "vulnerable" }, "tone": "warn" },
                    "right": { "code": "zeroShells", "result": { "text": "defended" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Payment gateway microservice thwarted intrusion by omitting shells.",
                    "left": { "code": "intrusionAttempt", "result": { "text": "blocked" }, "tone": "ok" },
                    "right": { "code": "distrolessNode", "result": { "text": "protected" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Auditor inspects container manifest to detect active shell presence.",
                    "left": { "code": "manifestAudit", "result": { "text": "evaluated" }, "tone": "ok" },
                    "right": { "code": "securityVerdict", "result": { "text": "verified" }, "tone": "accent" }
                }
            ]
        },
        {
            "title": "Seccomp BPF filter and capability restrictions",
            "leftLabel": "Default System Calls",
            "rightLabel": "Filtered Seccomp BPF",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Standard Linux kernel exposes numerous system calls to applications.",
                    "left": { "code": "rawKernelCalls", "result": { "text": "unrestricted" }, "tone": "warn" },
                    "right": { "code": "seccompFilter", "result": { "text": "restricted" }, "tone": "ok" }
                },
                {
                    "at": "say3",
                    "caption": "Seccomp inspects system calls to intercept unauthorized invocations.",
                    "left": { "code": "blockedSyscalls", "result": { "text": "killed" }, "tone": "warn" },
                    "right": { "code": "whitelistedCalls", "result": { "text": "allowed" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Strict seccomp filters protected containers from memory vulnerability.",
                    "left": { "code": "dirtyCowExploit", "result": { "text": "neutralized" }, "tone": "ok" },
                    "right": { "code": "bpfProtection", "result": { "text": "shielded" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Hardened seccomp profile immediately terminates unauthorized calls.",
                    "left": { "code": "evaluatedSyscall", "result": { "text": "intercepted" }, "tone": "ok" },
                    "right": { "code": "defenseAction", "result": { "text": "terminated" }, "tone": "accent" }
                }
            ]
        }
    ],
    32: [
        {
            "title": "Kube-APIServer admission webhook pipeline",
            "leftLabel": "Incoming REST Request",
            "rightLabel": "Validated etcd Persistence",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Every client interaction passes through the API server request pipeline.",
                    "left": { "code": "clientRequest", "result": { "text": "incoming" }, "tone": "data" },
                    "right": { "code": "apiServerPipeline", "result": { "text": "stateless" }, "tone": "ok" }
                },
                {
                    "at": "say2",
                    "caption": "Authentication plugins extract verified user identity from credentials.",
                    "left": { "code": "clientToken", "result": { "text": "presented" }, "tone": "data" },
                    "right": { "code": "authenticatedUser", "result": { "text": "verified" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Validating admission webhook rejected invalid deployment image tag.",
                    "left": { "code": "latestImageTag", "result": { "text": "rejected" }, "tone": "warn" },
                    "right": { "code": "gatekeeperPolicy", "result": { "text": "enforced" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Validating admission phase rejects forbidden image tags with error.",
                    "left": { "code": "submittedRequest", "result": { "text": "intercepted" }, "tone": "data" },
                    "right": { "code": "validationVerdict", "result": { "text": "rejected" }, "tone": "warn" }
                }
            ]
        },
        {
            "title": "etcd v3 multi-version concurrency control",
            "leftLabel": "Historical Revisions",
            "rightLabel": "Latest Quorum State",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Distributed state storage guarantees linearizable operations for cluster.",
                    "left": { "code": "clusterRegistry", "result": { "text": "serialized" }, "tone": "ok" },
                    "right": { "code": "etcdConsensus", "result": { "text": "strongly-consistent" }, "tone": "accent" }
                },
                {
                    "at": "say2",
                    "caption": "Multi version concurrency control appends revision records to storage.",
                    "left": { "code": "pastRevisions", "result": { "text": "preserved" }, "tone": "ok" },
                    "right": { "code": "globalCounter", "result": { "text": "incremented" }, "tone": "accent" }
                },
                {
                    "at": "example",
                    "caption": "Surviving quorum nodes preserved linearizable reads during outage.",
                    "left": { "code": "failedNode", "result": { "text": "isolated" }, "tone": "warn" },
                    "right": { "code": "quorumMajority", "result": { "text": "operational" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Database compaction safely purges older revisions up to boundary.",
                    "left": { "code": "compactBoundary", "result": { "text": "specified" }, "tone": "data" },
                    "right": { "code": "purgedRevisions", "result": { "text": "reclaimed" }, "tone": "ok" }
                }
            ]
        },
        {
            "title": "Kube-Scheduler filtering and scoring phases",
            "leftLabel": "Candidate Worker Nodes",
            "rightLabel": "Optimal Target Host",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Scheduler executes deterministic cycles to assign pods to worker nodes.",
                    "left": { "code": "pendingPods", "result": { "text": "queued" }, "tone": "data" },
                    "right": { "code": "schedulerEngine", "result": { "text": "deterministic" }, "tone": "ok" }
                },
                {
                    "at": "say2",
                    "caption": "Filtering phase evaluates binary predicates to eliminate nodes.",
                    "left": { "code": "candidateNodes", "result": { "text": "evaluated" }, "tone": "data" },
                    "right": { "code": "feasibleNodes", "result": { "text": "filtered" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Scheduler filtered incompatible machines and scored cached image nodes.",
                    "left": { "code": "filteredNodes", "result": { "text": "discarded" }, "tone": "data" },
                    "right": { "code": "bestCandidate", "result": { "text": "assigned" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Tainted nodes repel unmatching pods and reduce feasible node counts.",
                    "left": { "code": "nodeTolerations", "result": { "text": "checked" }, "tone": "data" },
                    "right": { "code": "selectedWorker", "result": { "text": "fallback" }, "tone": "ok" }
                }
            ]
        },
        {
            "title": "Kubelet PLEG event synchronization cycle",
            "leftLabel": "CRI Container Runtime",
            "rightLabel": "Kubelet In-Memory Cache",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Node agent translates desired state into physical container execution.",
                    "left": { "code": "kubeletAgent", "result": { "text": "authoritative" }, "tone": "ok" },
                    "right": { "code": "runtimeContainers", "result": { "text": "managed" }, "tone": "accent" }
                },
                {
                    "at": "say3",
                    "caption": "PLEG compares current container runtime states against cached records.",
                    "left": { "code": "runtimeListing", "result": { "text": "polled" }, "tone": "data" },
                    "right": { "code": "lifecycleEvents", "result": { "text": "generated" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Kubelet detected unhealthy relist duration and rescheduled busy pods.",
                    "left": { "code": "throttledStorage", "result": { "text": "detected" }, "tone": "warn" },
                    "right": { "code": "podRescheduling", "result": { "text": "healthy" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Simulate unresponding runtime duration triggering status changes.",
                    "left": { "code": "relistDuration", "result": { "text": "exceeded" }, "tone": "warn" },
                    "right": { "code": "nodeCondition", "result": { "text": "not-ready" }, "tone": "warn" }
                }
            ]
        },
        {
            "title": "Custom resource reconciliation workqueue",
            "leftLabel": "Shared Informer Lister",
            "rightLabel": "Reconciliation WorkQueue",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Custom controllers observe live resources and eliminate cluster drift.",
                    "left": { "code": "desiredState", "result": { "text": "declarative" }, "tone": "ok" },
                    "right": { "code": "reconcilerLoop", "result": { "text": "converging" }, "tone": "accent" }
                },
                {
                    "at": "say3",
                    "caption": "Informer consumes watch events and updates local in memory indexer.",
                    "left": { "code": "streamEvents", "result": { "text": "consumed" }, "tone": "data" },
                    "right": { "code": "localIndexer", "result": { "text": "cached" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Operator queued reconciliation key and scaled replica set smoothly.",
                    "left": { "code": "databaseOperator", "result": { "text": "triggered" }, "tone": "ok" },
                    "right": { "code": "replicaState", "result": { "text": "reconciled" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "WorkQueue deduplication ensures unique resource keys process cleanly.",
                    "left": { "code": "enqueuedKeys", "result": { "text": "deduplicated" }, "tone": "ok" },
                    "right": { "code": "workerThread", "result": { "text": "processed" }, "tone": "accent" }
                }
            ]
        }
    ],
    33: [
        {
            "title": "IPVS constant-time service packet routing",
            "leftLabel": "Linear iptables Chains",
            "rightLabel": "Kernel IPVS Hash Tables",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Every pod receives unique routable network address from IPAM pool.",
                    "left": { "code": "podNetworkInterface", "result": { "text": "routable" }, "tone": "ok" },
                    "right": { "code": "vethPair", "result": { "text": "bridged" }, "tone": "accent" }
                },
                {
                    "at": "say5",
                    "caption": "IPVS stores backend service endpoints inside in memory hash tables.",
                    "left": { "code": "linearIptables", "result": { "text": "sequential" }, "tone": "warn" },
                    "right": { "code": "kernelIpvs", "result": { "text": "constant-time" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Platform cut packet lookup latency by migrating to kernel IPVS mode.",
                    "left": { "code": "iptablesDelay", "result": { "text": "spiking" }, "tone": "warn" },
                    "right": { "code": "ipvsSpeedup", "result": { "text": "ultra-fast" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Scaling backend endpoint counts leaves IPVS packet latency flat.",
                    "left": { "code": "endpointScaling", "result": { "text": "expanded" }, "tone": "data" },
                    "right": { "code": "lookupLatency", "result": { "text": "constant" }, "tone": "ok" }
                }
            ]
        },
        {
            "title": "CoreDNS query amplification mitigation",
            "leftLabel": "Standard ndots:5 Resolv",
            "rightLabel": "Optimized NodeLocal Cache",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Domain name resolution translates hostnames into service virtual IPs.",
                    "left": { "code": "domainQuery", "result": { "text": "translated" }, "tone": "data" },
                    "right": { "code": "coreDnsServer", "result": { "text": "resolved" }, "tone": "ok" }
                },
                {
                    "at": "say3",
                    "caption": "Resolver sequentially appends each cluster search path to queries.",
                    "left": { "code": "searchDomains", "result": { "text": "amplified" }, "tone": "warn" },
                    "right": { "code": "absoluteQuery", "result": { "text": "delayed" }, "tone": "warn" }
                },
                {
                    "at": "example",
                    "caption": "Deploying local node caching reduced upstream query volume safely.",
                    "left": { "code": "conntrackExhaustion", "result": { "text": "mitigated" }, "tone": "ok" },
                    "right": { "code": "upstreamReduction", "result": { "text": "optimized" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Trailing dots instruct resolver to treat domain queries as absolute.",
                    "left": { "code": "trailingDot", "result": { "text": "appended" }, "tone": "ok" },
                    "right": { "code": "queryCount", "result": { "text": "single" }, "tone": "accent" }
                }
            ]
        },
        {
            "title": "Envoy proxy dynamic xDS routing protocol",
            "leftLabel": "Static Process Reloads",
            "rightLabel": "Dynamic xDS Stream",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Modern services require sophisticated Layer seven application routing.",
                    "left": { "code": "applicationRouting", "result": { "text": "layer-seven" }, "tone": "ok" },
                    "right": { "code": "envoyDataPlane", "result": { "text": "performant" }, "tone": "accent" }
                },
                {
                    "at": "say2",
                    "caption": "Dynamic discovery APIs update configuration state without restarts.",
                    "left": { "code": "processReloads", "result": { "text": "disruptive" }, "tone": "warn" },
                    "right": { "code": "dynamicXds", "result": { "text": "zero-downtime" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Ingress gateway synchronized new endpoints without dropped calls.",
                    "left": { "code": "scaleUpBatch", "result": { "text": "synchronized" }, "tone": "ok" },
                    "right": { "code": "connectionDrops", "result": { "text": "zero" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Unhealthy upstream endpoints return gateway error gracefully.",
                    "left": { "code": "unhealthyBackends", "result": { "text": "evicted" }, "tone": "warn" },
                    "right": { "code": "gatewayResponse", "result": { "text": "handled" }, "tone": "ok" }
                }
            ]
        },
        {
            "title": "Istio mutual TLS and SPIFFE workload identity",
            "leftLabel": "Cleartext HTTP Traffic",
            "rightLabel": "Encrypted Strict mTLS",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Service mesh architecture addresses operational networking complexity.",
                    "left": { "code": "distributedServices", "result": { "text": "decoupled" }, "tone": "data" },
                    "right": { "code": "serviceMesh", "result": { "text": "orchestrated" }, "tone": "ok" }
                },
                {
                    "at": "say4",
                    "caption": "Cryptographic workload identity adheres to standard SPIFFE format.",
                    "left": { "code": "serviceAccount", "result": { "text": "mapped" }, "tone": "ok" },
                    "right": { "code": "spiffeIdentity", "result": { "text": "verifiable" }, "tone": "accent" }
                },
                {
                    "at": "example",
                    "caption": "Strict mutual TLS policy rejected connection from unauthenticated pod.",
                    "left": { "code": "unauthorizedCaller", "result": { "text": "rejected" }, "tone": "warn" },
                    "right": { "code": "meshSecurity", "result": { "text": "enforced" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Permissive modes permit legacy unauthenticated traffic during migration.",
                    "left": { "code": "permissiveMode", "result": { "text": "flexible" }, "tone": "data" },
                    "right": { "code": "handshakeVerdict", "result": { "text": "connected" }, "tone": "ok" }
                }
            ]
        },
        {
            "title": "Calico eBPF kernel network policy firewall",
            "leftLabel": "Default Open Network",
            "rightLabel": "Kernel eBPF Sandboxing",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Default clusters allow unrestricted communication between all pods.",
                    "left": { "code": "flatNetworking", "result": { "text": "open" }, "tone": "warn" },
                    "right": { "code": "networkPolicy", "result": { "text": "isolated" }, "tone": "ok" }
                },
                {
                    "at": "say4",
                    "caption": "Kernel programs evaluate network packets and drop unauthorized calls.",
                    "left": { "code": "trafficHook", "result": { "text": "intercepted" }, "tone": "data" },
                    "right": { "code": "bpfMapLookup", "result": { "text": "instant" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Traffic control hook dropped unauthorized metadata requests quickly.",
                    "left": { "code": "exploitAttempt", "result": { "text": "blocked" }, "tone": "ok" },
                    "right": { "code": "kernelFirewall", "result": { "text": "defended" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Blocked subnets reject unauthorized network traffic immediately.",
                    "left": { "code": "blockedDestination", "result": { "text": "checked" }, "tone": "data" },
                    "right": { "code": "packetVerdict", "result": { "text": "dropped" }, "tone": "warn" }
                }
            ]
        }
    ],
    34: [
        {
            "title": "GitOps declarative three-way merge reconciliation",
            "leftLabel": "Live Cluster Drift",
            "rightLabel": "Git Source of Truth",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Traditional push pipelines require high privilege cluster credentials.",
                    "left": { "code": "pushPipeline", "result": { "text": "vulnerable" }, "tone": "warn" },
                    "right": { "code": "pullGitOps", "result": { "text": "hardened" }, "tone": "ok" }
                },
                {
                    "at": "say4",
                    "caption": "Three way merge algorithm compares desired Git state with live state.",
                    "left": { "code": "liveClusterState", "result": { "text": "inspected" }, "tone": "data" },
                    "right": { "code": "gitDesiredState", "result": { "text": "reconciled" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Operator corrected manual live modifications via automated healing.",
                    "left": { "code": "manualDrift", "result": { "text": "detected" }, "tone": "warn" },
                    "right": { "code": "gitRestoration", "result": { "text": "restored" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Set live replicas to match git desired state and observe sync.",
                    "left": { "code": "desiredReplicas", "result": { "text": "aligned" }, "tone": "ok" },
                    "right": { "code": "reconciliationState", "result": { "text": "in-sync" }, "tone": "accent" }
                }
            ]
        },
        {
            "title": "ArgoCD ApplicationSet Cartesian matrix generator",
            "leftLabel": "Target Cluster Registry",
            "rightLabel": "Automated Applications",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Managing individual application manifests manually is unsustainable.",
                    "left": { "code": "manualManifests", "result": { "text": "repetitive" }, "tone": "warn" },
                    "right": { "code": "applicationSets", "result": { "text": "automated" }, "tone": "ok" }
                },
                {
                    "at": "say5",
                    "caption": "Matrix generator combines cluster lists with microservice manifests.",
                    "left": { "code": "clusterGenerator", "result": { "text": "discovered" }, "tone": "data" },
                    "right": { "code": "matrixProduct", "result": { "text": "templated" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Media platform deployed recommendation engines across global fleet.",
                    "left": { "code": "globalClusters", "result": { "text": "hydrated" }, "tone": "ok" },
                    "right": { "code": "deployedServices", "result": { "text": "synchronized" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Add cluster target to generator and verify matrix scales.",
                    "left": { "code": "clusterRegistry", "result": { "text": "expanded" }, "tone": "ok" },
                    "right": { "code": "generatedApplications", "result": { "text": "scaled" }, "tone": "accent" }
                }
            ]
        },
        {
            "title": "Kustomize strategic merge overlays and hashing",
            "leftLabel": "Base Deployment Manifest",
            "rightLabel": "Environment Overlay",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Managing configurations across diverse environments poses challenges.",
                    "left": { "code": "environmentConfigs", "result": { "text": "diverse" }, "tone": "data" },
                    "right": { "code": "kustomizeEngine", "result": { "text": "declarative" }, "tone": "ok" }
                },
                {
                    "at": "say4",
                    "caption": "Strategic merge patches override specific replica fields cleanly.",
                    "left": { "code": "baseReplicas", "result": { "text": "defaults" }, "tone": "data" },
                    "right": { "code": "overlayReplicas", "result": { "text": "overridden" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Fintech platform updated logging configurations across environments.",
                    "left": { "code": "baseEdits", "result": { "text": "centralized" }, "tone": "ok" },
                    "right": { "code": "overlayPropagation", "result": { "text": "harmonized" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Staging overlays generate distinct environment configuration files.",
                    "left": { "code": "overlayDefinition", "result": { "text": "synthesized" }, "tone": "ok" },
                    "right": { "code": "environmentArtifact", "result": { "text": "customized" }, "tone": "accent" }
                }
            ]
        },
        {
            "title": "Helm OCI packaging and pre-upgrade hooks",
            "leftLabel": "Upstream Chart Artifact",
            "rightLabel": "Pre-Upgrade Hook Job",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Helm package manager distributes software across cloud native ecosystem.",
                    "left": { "code": "helmCharts", "result": { "text": "packaged" }, "tone": "ok" },
                    "right": { "code": "ociRegistries", "result": { "text": "versioned" }, "tone": "accent" }
                },
                {
                    "at": "say5",
                    "caption": "Lifecycle hooks execute database migrations before workloads boot.",
                    "left": { "code": "preUpgradeHook", "result": { "text": "executed" }, "tone": "data" },
                    "right": { "code": "schemaMigration", "result": { "text": "verified" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Billing system aborted upgrade and rolled back after migration error.",
                    "left": { "code": "migrationFailure", "result": { "text": "caught" }, "tone": "warn" },
                    "right": { "code": "atomicRollback", "result": { "text": "restored" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Failed schema migrations immediately trigger atomic release rollbacks.",
                    "left": { "code": "jobOutcome", "result": { "text": "failed" }, "tone": "warn" },
                    "right": { "code": "releaseRollback", "result": { "text": "reverted" }, "tone": "ok" }
                }
            ]
        },
        {
            "title": "ArgoCD AppProject isolation and sync windows",
            "leftLabel": "Project Security Policies",
            "rightLabel": "Authorized Deployments",
            "steps": [
                {
                    "at": "say1",
                    "caption": "ArgoCD operates with extensive administrative permissions on clusters.",
                    "left": { "code": "gitOpsController", "result": { "text": "privileged" }, "tone": "warn" },
                    "right": { "code": "appProjectSecurity", "result": { "text": "hardened" }, "tone": "ok" }
                },
                {
                    "at": "say3",
                    "caption": "AppProjects restrict target clusters and allowed source repositories.",
                    "left": { "code": "repoWhitelists", "result": { "text": "enforced" }, "tone": "ok" },
                    "right": { "code": "destinationNamespaces", "result": { "text": "isolated" }, "tone": "accent" }
                },
                {
                    "at": "example",
                    "caption": "Multi tenant platform blocked unauthorized deployment attempts safely.",
                    "left": { "code": "unauthorizedNamespace", "result": { "text": "blocked" }, "tone": "warn" },
                    "right": { "code": "projectBoundary", "result": { "text": "defended" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Unauthorized destination namespaces are denied by policy auditor.",
                    "left": { "code": "requestedNamespace", "result": { "text": "checked" }, "tone": "data" },
                    "right": { "code": "auditorVerdict", "result": { "text": "denied" }, "tone": "warn" }
                }
            ]
        }
    ],
    35: [
        {
            "title": "Argo Rollouts canary progressive delivery",
            "leftLabel": "Stable Production ReplicaSet",
            "rightLabel": "Canary Rollout Stage",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Standard rolling updates replace pods blindly regardless of errors.",
                    "left": { "code": "standardDeployment", "result": { "text": "unaware" }, "tone": "warn" },
                    "right": { "code": "argoRollout", "result": { "text": "metric-driven" }, "tone": "ok" }
                },
                {
                    "at": "say3",
                    "caption": "Canary deployments split live traffic across independent replica sets.",
                    "left": { "code": "stableReplicaSet", "result": { "text": "baseline" }, "tone": "ok" },
                    "right": { "code": "canaryReplicaSet", "result": { "text": "candidate" }, "tone": "accent" }
                },
                {
                    "at": "example",
                    "caption": "Banking application aborted canary release when error rates spiked.",
                    "left": { "code": "canarySpike", "result": { "text": "detected" }, "tone": "warn" },
                    "right": { "code": "automatedRollback", "result": { "text": "restored" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Supervisor immediately aborts rollout when analysis fails.",
                    "left": { "code": "analysisOutcome", "result": { "text": "failed" }, "tone": "warn" },
                    "right": { "code": "trafficWeight", "result": { "text": "zeroed" }, "tone": "ok" }
                }
            ]
        },
        {
            "title": "Prometheus automated metric analysis and rollback",
            "leftLabel": "Canary Telemetry Stream",
            "rightLabel": "Automated Mitigation",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Progressive delivery relies on rigorous automated observability metrics.",
                    "left": { "code": "canaryTelemetry", "result": { "text": "evaluated" }, "tone": "data" },
                    "right": { "code": "decisionEngine", "result": { "text": "automated" }, "tone": "ok" }
                },
                {
                    "at": "say5",
                    "caption": "Breached thresholds trigger instantaneous traffic restoration sequence.",
                    "left": { "code": "breachedThreshold", "result": { "text": "detected" }, "tone": "warn" },
                    "right": { "code": "trafficRestoration", "result": { "text": "sub-second" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Analysis template detected latency regression and rolled back version.",
                    "left": { "code": "latencyRegression", "result": { "text": "flagged" }, "tone": "warn" },
                    "right": { "code": "stableVersion", "result": { "text": "active" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Verify that abortTriggered is false and restored version promotes.",
                    "left": { "code": "measuredErrorRate", "result": { "text": "healthy" }, "tone": "ok" },
                    "right": { "code": "rolloutPromotion", "result": { "text": "promoted" }, "tone": "accent" }
                }
            ]
        },
        {
            "title": "External Secrets Operator vault orchestration",
            "leftLabel": "Cloud Provider Secret Vault",
            "rightLabel": "Native Kubernetes Secret",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Committing raw secret credentials to Git creates security vulnerabilities.",
                    "left": { "code": "cleartextSecrets", "result": { "text": "unsecured" }, "tone": "warn" },
                    "right": { "code": "vaultedSecrets", "result": { "text": "encrypted" }, "tone": "ok" }
                },
                {
                    "at": "say5",
                    "caption": "External secrets operator synchronizes credentials into cluster RAM.",
                    "left": { "code": "secretStore", "result": { "text": "authenticated" }, "tone": "ok" },
                    "right": { "code": "clusterSecret", "result": { "text": "synchronized" }, "tone": "accent" }
                },
                {
                    "at": "example",
                    "caption": "Fintech platform synchronized database credentials with zero exposure.",
                    "left": { "code": "vaultCredentials", "result": { "text": "rotated" }, "tone": "ok" },
                    "right": { "code": "gitRepositories", "result": { "text": "clean" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Updating vault secret versions syncs payload to cluster secret store.",
                    "left": { "code": "vaultUpdate", "result": { "text": "updated" }, "tone": "ok" },
                    "right": { "code": "k8sSecretStore", "result": { "text": "refreshed" }, "tone": "accent" }
                }
            ]
        },
        {
            "title": "Multi-region disaster recovery and DNS steering",
            "leftLabel": "Failed Primary Region",
            "rightLabel": "Active Standby Cluster",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Platforms must survive total regional outages through disaster recovery.",
                    "left": { "code": "catastrophicOutage", "result": { "text": "isolated" }, "tone": "warn" },
                    "right": { "code": "disasterRecovery", "result": { "text": "resilient" }, "tone": "ok" }
                },
                {
                    "at": "say5",
                    "caption": "Backup operators restore volume snapshots and persistent state data.",
                    "left": { "code": "veleroRestore", "result": { "text": "hydrated" }, "tone": "ok" },
                    "right": { "code": "volumeSnapshots", "result": { "text": "restored" }, "tone": "accent" }
                },
                {
                    "at": "example",
                    "caption": "Healthcare system shifted traffic to secondary region during disaster.",
                    "left": { "code": "primaryOutage", "result": { "text": "diverted" }, "tone": "warn" },
                    "right": { "code": "secondaryTraffic", "result": { "text": "operational" }, "tone": "ok" }
                },
                {
                    "at": "tryIt",
                    "caption": "Healthy primary clusters anchor traffic without failover disruption.",
                    "left": { "code": "primaryHealth", "result": { "text": "healthy" }, "tone": "ok" },
                    "right": { "code": "trafficSteering", "result": { "text": "stable" }, "tone": "accent" }
                }
            ]
        },
        {
            "title": "Milestone seven grand capstone platform audit",
            "leftLabel": "Ten Architecture Controls",
            "rightLabel": "Accredited Zero Trust",
            "steps": [
                {
                    "at": "say1",
                    "caption": "Synthesis verifies mastery across cloud native systems architecture.",
                    "left": { "code": "systemsMastery", "result": { "text": "synthesized" }, "tone": "ok" },
                    "right": { "code": "platformArchitecture", "result": { "text": "accredited" }, "tone": "accent" }
                },
                {
                    "at": "say2",
                    "caption": "Automated scorecards verify platform integrity and zero trust controls.",
                    "left": { "code": "platformScorecard", "result": { "text": "evaluated" }, "tone": "data" },
                    "right": { "code": "securityPosture", "result": { "text": "verified" }, "tone": "ok" }
                },
                {
                    "at": "example",
                    "caption": "Enterprise audit verified platform controls achieving accreditation.",
                    "left": { "code": "platformAudit", "result": { "text": "conducted" }, "tone": "ok" },
                    "right": { "code": "accreditationScore", "result": { "text": "perfect" }, "tone": "accent" }
                },
                {
                    "at": "tryIt",
                    "caption": "Failing any architecture pillar revokes production accreditation score.",
                    "left": { "code": "pillarVerification", "result": { "text": "checked" }, "tone": "data" },
                    "right": { "code": "certificationStatus", "result": { "text": "governed" }, "tone": "warn" }
                }
            ]
        }
    ]
}

print("--- VALIDATING AND WRITING VISUAL FILES ---")

os.makedirs("src/lib/data/lessonVisuals/devops", exist_ok=True)

for day_data in ALL_DAYS:
    day = day_data["day"]
    entries = []
    specs = VISUAL_SPECS[day]
    assert len(specs) == 5, f"Day {day} must have 5 visual specs"
    
    for i in range(5):
        part = day_data["parts"][i]
        spec_data = specs[i]
        
        # Verify captions
        for step in spec_data["steps"]:
            at = step["at"]
            caption = step["caption"]
            text = get_text_at_step(part, at)
            validate_caption(caption, text, f"Day {day} Part {i+1} step {at}")
        
        code = part["code"]
        code_hash = hashlib.sha256(code.encode('utf-8')).hexdigest()
        
        spec = {
            "template": "compare",
            "title": spec_data["title"],
            "leftLabel": spec_data["leftLabel"],
            "rightLabel": spec_data["rightLabel"],
            "steps": spec_data["steps"]
        }
        
        entry = {
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": spec,
            "filled": spec
        }
        entries.append(entry)
    
    day_file = {
        "schemaVersion": 2,
        "prefix": "devops",
        "day": day,
        "promptSha": hashlib.sha256(f"devops-day-{day}".encode('utf-8')).hexdigest(),
        "model": "google/gemini-2.5-pro",
        "entries": entries
    }
    
    out_path = f"src/lib/data/lessonVisuals/devops/day-{day}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(day_file, f, indent=2)
    print(f"Wrote {out_path} with 5 valid visual entries!")

print("--- ALL 5 VISUAL FILES GENERATED AND VALIDATED 100%! ---")
