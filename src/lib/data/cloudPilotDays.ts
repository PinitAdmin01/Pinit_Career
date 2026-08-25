import { DayLessonPlan } from '../types/lessonEngine';

export const CLOUD_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Cloud Computing Models (IaaS, PaaS, SaaS) & Shared Responsibility",
    "overviewMetaphor": "Cloud computing service models are transportation tiers: IaaS (EC2) is renting a car (you pump your own gas and drive the route); PaaS (Elastic Beanstalk/RDS) is taking a taxi (the driver steers the vehicle and maintains engine oil, you just choose the destination); SaaS (Google Workspace/Office 365) is riding a high-speed train (you just sit in the passenger seat and enjoy the ride).",
    "blocks": [
      {
        "id": "cloud-d1-b1-service-models-pyramid",
        "day": 1,
        "blockNumber": 1,
        "title": "IaaS vs PaaS vs SaaS Architectural Control",
        "conceptBudget": {
          "primaryConcept": "Cloud Service Models",
          "supportingTerms": [
            "IaaS (Infrastructure as a Service - AWS EC2/EBS)",
            "PaaS (Platform as a Service - AWS Elastic Beanstalk/RDS)",
            "SaaS (Software as a Service - Microsoft 365)",
            "Level of Abstraction vs Control"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Cloud Service Stack Control Matrix",
              "boxes": [
                {
                  "label": "Application Code & Data",
                  "value": "Customer Manages (IaaS, PaaS)",
                  "varType": "Top Layer",
                  "isUpdated": true
                },
                {
                  "label": "Runtime, OS & Middleware",
                  "value": "Customer Manages on IaaS; Cloud Provider Manages on PaaS/SaaS",
                  "varType": "Platform Layer",
                  "isUpdated": true
                },
                {
                  "label": "Hypervisor & Physical Hardware",
                  "value": "Cloud Provider Always Manages (100% Abstracted)",
                  "varType": "Infrastructure Layer",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cloud_model_demo.js",
            "initialCode": "function getManagementResponsibility(model) {\n  if (model === 'IaaS') return { osPatching: 'CUSTOMER', codeDeployment: 'CUSTOMER', physicalHardware: 'AWS' };\n  if (model === 'PaaS') return { osPatching: 'AWS', codeDeployment: 'CUSTOMER', physicalHardware: 'AWS' };\n  if (model === 'SaaS') return { osPatching: 'AWS', codeDeployment: 'AWS', physicalHardware: 'AWS' };\n}\n\nconsole.log('EC2 (IaaS) OS Patching:', getManagementResponsibility('IaaS').osPatching);\nconsole.log('Elastic Beanstalk (PaaS) OS Patching:', getManagementResponsibility('PaaS').osPatching);",
            "expectedOutput": "EC2 (IaaS) OS Patching: CUSTOMER\nElastic Beanstalk (PaaS) OS Patching: AWS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Under the Infrastructure-as-a-Service (IaaS) model (such as an AWS EC2 instance), who is responsible for applying operating system security patches?",
          "options": [
            "The Customer (You) is responsible for OS updates, firewall rules, and runtime libraries on IaaS",
            "AWS automatically patches your EC2 operating systems without permission",
            "Operating systems never require security patches in the cloud"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_IAAS_PAAS_SAAS_SHARED_RESPONSIBILITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_IAAS_PAAS_SAAS_SHARED_RESPONSIBILITY",
              "errorExplanation": "On IaaS, AWS manages hardware and virtualization; the customer retains full control and responsibility for guest OS patching.",
              "recoveryPath": {
                "simplerExplanation": "IaaS = Renting the car: you are responsible for maintaining the operating system.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "cloud-d1-b2-shared-responsibility-model",
        "day": 1,
        "blockNumber": 2,
        "title": "AWS Shared Responsibility Model: Security OF vs Security IN",
        "conceptBudget": {
          "primaryConcept": "Shared Responsibility Model",
          "supportingTerms": [
            "Security OF the Cloud (AWS: Physical DCs, Hypervisors, Cables, Regions)",
            "Security IN the Cloud (Customer: IAM, Encryption, Data, Firewalls)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b1-service-models-pyramid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Shared Responsibility Division",
            "codeSnippet": "// AWS Security OF the Cloud\nconst awsScope = ['Physical Data Center Locks', 'Host Virtualization Hypervisor', 'Subsea Fiber Cables'];\n\n// Customer Security IN the Cloud\nconst customerScope = ['IAM User Passwords / MFA', 'S3 Bucket Encryption & Policies', 'EC2 Security Group Firewalls'];",
            "lineNotes": {
              "2": "AWS guarantees physical facility security and foundational infrastructure.",
              "5": "Customer is 100% accountable for access credentials and data encryption."
            }
          },
          {
            "type": "runnable_code",
            "filename": "shared_resp_demo.js",
            "initialCode": "function evaluateResponsibility(area) {\n  const awsOf = ['PHYSICAL_FACILITY', 'HYPERVISOR_HARDWARE', 'GLOBAL_BACKBONE'];\n  return awsOf.includes(area) ? 'SECURITY_OF_CLOUD (AWS)' : 'SECURITY_IN_CLOUD (CUSTOMER)';\n}\n\nconsole.log('Datacenter Security Guards:', evaluateResponsibility('PHYSICAL_FACILITY'));\nconsole.log('IAM Password Policies:', evaluateResponsibility('IAM_PASSWORDS'));",
            "expectedOutput": "Datacenter Security Guards: SECURITY_OF_CLOUD (AWS)\nIAM Password Policies: SECURITY_IN_CLOUD (CUSTOMER)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who is responsible for customer IAM password policies under the Shared Responsibility Model?",
          "expectedStringOutput": "SECURITY_IN_CLOUD (CUSTOMER)",
          "acceptableAnswers": [
            "SECURITY_IN_CLOUD (CUSTOMER)",
            "CUSTOMER",
            "Customer"
          ],
          "primaryMisconceptionId": "MC_CLOUD_IAAS_PAAS_SAAS_SHARED_RESPONSIBILITY",
          "diagnosisMap": {
            "AWS": {
              "misconceptionId": "MC_CLOUD_IAAS_PAAS_SAAS_SHARED_RESPONSIBILITY",
              "errorExplanation": "IAM access policies and credentials belong to Customer Security IN the Cloud.",
              "recoveryPath": {
                "simplerExplanation": "Customer manages passwords and data access.",
                "guidedFixPrompt": "Type SECURITY_IN_CLOUD (CUSTOMER)"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d1-b3-capex-vs-opex-tco",
        "day": 1,
        "blockNumber": 3,
        "title": "CapEx to OpEx & Total Cost of Ownership (TCO)",
        "conceptBudget": {
          "primaryConcept": "Cloud Economics",
          "supportingTerms": [
            "CapEx (Capital Expenditure: Buying expensive physical servers upfront)",
            "OpEx (Operational Expenditure: Pay-as-you-go per millisecond)",
            "Elastic Scalability"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b2-shared-responsibility-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capex_vs_opex.js",
            "initialCode": "function compareCosts(durationHours, hourlyRate = 0.05, onPremServerPrice = 5000) {\n  const cloudCost = durationHours * hourlyRate;\n  return {\n    cloudOpEx: `$${cloudCost.toFixed(2)}`,\n    onPremCapEx: `$${onPremServerPrice.toFixed(2)}`,\n    savings: `$${(onPremServerPrice - cloudCost).toFixed(2)}`\n  };\n}\n\nconsole.log('100-hour Test Run:', JSON.stringify(compareCosts(100)));",
            "expectedOutput": "100-hour Test Run: {\"cloudOpEx\":\"$5.00\",\"onPremCapEx\":\"$5000.00\",\"savings\":\"$4995.00\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Cloud OpEx cost for running a 100-hour experiment at $0.05/hour?",
          "expectedStringOutput": "$5.00",
          "acceptableAnswers": [
            "$5.00",
            "5.00",
            "5"
          ],
          "primaryMisconceptionId": "MC_CLOUD_IAAS_PAAS_SAAS_SHARED_RESPONSIBILITY",
          "diagnosisMap": {
            "$5000.00": {
              "misconceptionId": "MC_CLOUD_IAAS_PAAS_SAAS_SHARED_RESPONSIBILITY",
              "errorExplanation": "$5000 is the upfront on-prem CapEx. The cloud cost is 100 * $0.05 = $5.00.",
              "recoveryPath": {
                "simplerExplanation": "100 * 0.05 = $5.00.",
                "guidedFixPrompt": "Type $5.00"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "AWS Global Infrastructure, Regions & Availability Zones",
    "overviewMetaphor": "AWS Global Infrastructure is an international airline network: an AWS Region (`us-east-1`, North Virginia) is a major metropolitan city; each Region contains multiple Availability Zones (AZs, `us-east-1a`, `us-east-1b`, `us-east-1c`), which are distinct physical airports separated by miles with their own backup power generators and flood walls; Edge Locations are regional ticket booths in 300+ cities delivering cached content with 5ms latency.",
    "blocks": [
      {
        "id": "cloud-d2-b1-regions-vs-azs-topology",
        "day": 2,
        "blockNumber": 1,
        "title": "AWS Regions & Availability Zones Physical Layout",
        "conceptBudget": {
          "primaryConcept": "AWS Regions & AZs",
          "supportingTerms": [
            "AWS Region (Geographical area, e.g., `us-east-1`)",
            "Availability Zone (AZ: 1+ discrete physical datacenters with independent power/cooling)",
            "Sub-2ms AZ Interconnect Latency"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b1-service-models-pyramid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AWS Region Topology (e.g. us-east-1)",
              "boxes": [
                {
                  "label": "AZ: us-east-1a",
                  "value": "Physical Datacenter 1 (Independent Power Grid A)",
                  "varType": "Isolated Failure Domain",
                  "isUpdated": false
                },
                {
                  "label": "AZ: us-east-1b",
                  "value": "Physical Datacenter 2 (Independent Power Grid B)",
                  "varType": "Isolated Failure Domain",
                  "isUpdated": false
                },
                {
                  "label": "AZ: us-east-1c",
                  "value": "Physical Datacenter 3 (Independent Power Grid C)",
                  "varType": "Isolated Failure Domain",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "az_resiliency_demo.js",
            "initialCode": "function checkAzResilience(instances) {\n  const azSet = new Set(instances.map(i => i.az));\n  return azSet.size >= 2 ? 'HIGH_AVAILABILITY_MULTI_AZ' : 'SINGLE_POINT_OF_FAILURE';\n}\n\nconst clusterA = [{ id: 'i-1', az: 'us-east-1a' }, { id: 'i-2', az: 'us-east-1a' }];\nconst clusterB = [{ id: 'i-1', az: 'us-east-1a' }, { id: 'i-2', az: 'us-east-1b' }];\nconsole.log('Cluster A Status:', checkAzResilience(clusterA));\nconsole.log('Cluster B Status:', checkAzResilience(clusterB));",
            "expectedOutput": "Cluster A Status: SINGLE_POINT_OF_FAILURE\nCluster B Status: HIGH_AVAILABILITY_MULTI_AZ",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should production cloud workloads ALWAYS be deployed across at least two Availability Zones (Multi-AZ)?",
          "options": [
            "Because Availability Zones are physically separated datacenters with redundant power, networking, and flood protection; if a localized disaster (lightning strike/power failure) takes down one AZ, the secondary AZ continues serving traffic without downtime",
            "Because AWS requires 2 AZs for credit card payments",
            "Because single AZ instances cannot run JavaScript"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_REGION_VS_AZ_RESILIENCY_DISASTER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_REGION_VS_AZ_RESILIENCY_DISASTER",
              "errorExplanation": "Multi-AZ provides physical isolation against datacenter-level disaster outages.",
              "recoveryPath": {
                "simplerExplanation": "Multi-AZ keeps your app running if one datacenter goes down.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "cloud-d2-b2-edge-locations-cloudfront-pop",
        "day": 2,
        "blockNumber": 2,
        "title": "Edge Locations & Points of Presence (PoP)",
        "conceptBudget": {
          "primaryConcept": "Edge Locations",
          "supportingTerms": [
            "Points of Presence (PoP)",
            "Amazon CloudFront & AWS Global Accelerator",
            "Curbing global latency via AWS Private Fiber Backbone"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d2-b1-regions-vs-azs-topology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Global Edge Request Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. User in Tokyo requests image -> Hits nearest Edge Location in Tokyo (5ms)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Edge Cache Hit -> Returns image immediately without crossing the Pacific!",
                  "kind": "end"
                },
                {
                  "id": "3",
                  "label": "3. Edge Cache Miss -> Fetches from Origin Region (us-east-1) via private AWS fiber backbone -> Caches at Edge",
                  "kind": "process"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "edge_demo.js",
            "initialCode": "function estimateLatency(hasEdgeLocation) {\n  return hasEdgeLocation \n    ? { latencyMs: 8, source: 'LOCAL_EDGE_POP_CACHE' } \n    : { latencyMs: 180, source: 'CROSS_PACIFIC_ORIGIN_ROUNDTRIP' };\n}\n\nconsole.log('With Edge PoP:', estimateLatency(true).latencyMs + 'ms');\nconsole.log('Without Edge PoP:', estimateLatency(false).latencyMs + 'ms');",
            "expectedOutput": "With Edge PoP: 8ms\nWithout Edge PoP: 180ms",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the estimated latency (in ms) when serving static content directly from a local Edge Location PoP?",
          "expectedStringOutput": "8ms",
          "acceptableAnswers": [
            "8ms",
            "8",
            "With Edge PoP: 8ms"
          ],
          "primaryMisconceptionId": "MC_CLOUD_REGION_VS_AZ_RESILIENCY_DISASTER",
          "diagnosisMap": {
            "180ms": {
              "misconceptionId": "MC_CLOUD_REGION_VS_AZ_RESILIENCY_DISASTER",
              "errorExplanation": "180ms is for crossing continents. Local edge cache serves in ~8ms.",
              "recoveryPath": {
                "simplerExplanation": "Edge cache latency is 8ms.",
                "guidedFixPrompt": "Type 8ms"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d2-b3-data-residency-compliance",
        "day": 2,
        "blockNumber": 3,
        "title": "Data Residency & Sovereign Compliance Invariants",
        "conceptBudget": {
          "primaryConcept": "Data Residency Compliance",
          "supportingTerms": [
            "GDPR & HIPAA compliance",
            "Preventing data from leaving designated geographic borders",
            "Region Selection Criteria (Latency, Compliance, Service Availability, Cost)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d2-b2-edge-locations-cloudfront-pop",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "residency_check.js",
            "initialCode": "function isGdprCompliant(storageRegion) {\n  const euRegions = ['eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-south-1'];\n  return euRegions.includes(storageRegion);\n}\n\nconsole.log('Frankfurt Region (eu-central-1) GDPR Check:', isGdprCompliant('eu-central-1'));\nconsole.log('Virginia Region (us-east-1) GDPR Check:', isGdprCompliant('us-east-1'));",
            "expectedOutput": "Frankfurt Region (eu-central-1) GDPR Check: true\nVirginia Region (us-east-1) GDPR Check: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is data stored exclusively in `us-east-1` automatically compliant with European GDPR Data Sovereignty requirements requiring data to stay in the EU?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "Virginia Region (us-east-1) GDPR Check: false"
          ],
          "primaryMisconceptionId": "MC_CLOUD_REGION_VS_AZ_RESILIENCY_DISASTER",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_CLOUD_REGION_VS_AZ_RESILIENCY_DISASTER",
              "errorExplanation": "GDPR compliance for sovereign data requires storage within EU regions (e.g., eu-central-1).",
              "recoveryPath": {
                "simplerExplanation": "US storage is not EU GDPR compliant -> false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Virtual Private Cloud (VPC) Architecture & CIDR Subnetting",
    "overviewMetaphor": "A Virtual Private Cloud (VPC) is a private gated residential community: the VPC CIDR block (`10.0.0.0/16`) is the master perimeter fence around the entire neighborhood; Public Subnets are the front driveway and visitor parking lot (connected to the main highway via an Internet Gateway `igw-`); Private Subnets are the private backyard and locked underground vault (isolated from direct internet ingress).",
    "blocks": [
      {
        "id": "cloud-d3-b1-vpc-cidr-addressing",
        "day": 3,
        "blockNumber": 1,
        "title": "VPC CIDR Blocks & IP Address Math",
        "conceptBudget": {
          "primaryConcept": "VPC CIDR Architecture",
          "supportingTerms": [
            "RFC 1918 Private Ranges (`10.0.0.0/16`, `172.16.0.0/16`, `192.168.0.0/16`)",
            "Subnet Masking (`/16` = 65,536 IPs, `/24` = 256 IPs)",
            "Non-overlapping CIDR blocks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d2-b1-regions-vs-azs-topology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CIDR Notation Breakdown",
            "codeSnippet": "// 10.0.0.0/16 -> 32 - 16 = 16 host bits -> 2^16 = 65,536 total IPs\nconst vpcCidr = '10.0.0.0/16';\n\n// 10.0.1.0/24 -> 32 - 24 = 8 host bits -> 2^8 = 256 total IPs\nconst subnetCidr = '10.0.1.0/24';",
            "lineNotes": {
              "2": "VPC master network containing all subnets.",
              "5": "Individual subnet within the VPC."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cidr_math_demo.js",
            "initialCode": "function calculateTotalIps(prefixLength) {\n  return Math.pow(2, 32 - prefixLength);\n}\n\nconsole.log('/16 Total IPs:', calculateTotalIps(16));\nconsole.log('/24 Total IPs:', calculateTotalIps(24));\nconsole.log('/28 Total IPs:', calculateTotalIps(28));",
            "expectedOutput": "/16 Total IPs: 65536\n/24 Total IPs: 256\n/28 Total IPs: 16",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total IP addresses exist in a `/24` CIDR block (before deducting AWS reserved addresses)?",
          "expectedStringOutput": "256",
          "acceptableAnswers": [
            "256",
            "/24 Total IPs: 256"
          ],
          "primaryMisconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
          "diagnosisMap": {
            "65536": {
              "misconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
              "errorExplanation": "65,536 is for a /16 block. /24 has 2^(32-24) = 256 IPs.",
              "recoveryPath": {
                "simplerExplanation": "2^8 = 256 IPs.",
                "guidedFixPrompt": "Type 256"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d3-b2-aws-five-reserved-ips",
        "day": 3,
        "blockNumber": 2,
        "title": "AWS 5 Reserved IP Addresses per Subnet",
        "conceptBudget": {
          "primaryConcept": "AWS Reserved IPs",
          "supportingTerms": [
            ".0 (Network Address)",
            ".1 (VPC Router Gateway)",
            ".2 (Amazon Route 53 DNS)",
            ".3 (AWS Future Use)",
            ".255 (Subnet Broadcast Address)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d3-b1-vpc-cidr-addressing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AWS 5 Reserved Subnet IPs (e.g. 10.0.1.0/24)",
              "boxes": [
                {
                  "label": "10.0.1.0",
                  "value": "Network Address (Always reserved in IP networking)",
                  "varType": "Network Base",
                  "isUpdated": false
                },
                {
                  "label": "10.0.1.1",
                  "value": "VPC Local Router (Default Gateway for subnet)",
                  "varType": "Router",
                  "isUpdated": false
                },
                {
                  "label": "10.0.1.2",
                  "value": "AmazonProvidedDNS (Route 53 Resolver)",
                  "varType": "DNS Server",
                  "isUpdated": false
                },
                {
                  "label": "10.0.1.3",
                  "value": "AWS Future Reserved",
                  "varType": "AWS Internal",
                  "isUpdated": false
                },
                {
                  "label": "10.0.1.255",
                  "value": "Network Broadcast (AWS does not support broadcast, but reserves it)",
                  "varType": "Broadcast",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "usable_ips_demo.js",
            "initialCode": "function getUsableIps(cidrPrefix) {\n  const total = Math.pow(2, 32 - cidrPrefix);\n  const usable = total - 5; // Exactly 5 reserved IPs\n  return { total, reserved: 5, usable };\n}\n\nconsole.log('Subnet /24 Usable:', getUsableIps(24).usable);\nconsole.log('Subnet /28 Usable:', getUsableIps(28).usable);",
            "expectedOutput": "Subnet /24 Usable: 251\nSubnet /28 Usable: 11",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many USABLE host IP addresses are available in a `/24` subnet after deducting the 5 AWS reserved addresses (256 - 5)?",
          "expectedStringOutput": "251",
          "acceptableAnswers": [
            "251",
            "Subnet /24 Usable: 251"
          ],
          "primaryMisconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
          "diagnosisMap": {
            "256": {
              "misconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
              "errorExplanation": "AWS reserves 5 IP addresses in every subnet (.0, .1, .2, .3, and .255), leaving 251 usable IPs.",
              "recoveryPath": {
                "simplerExplanation": "256 total - 5 reserved = 251 usable.",
                "guidedFixPrompt": "Type 251"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d3-b3-public-vs-private-subnets-igw",
        "day": 3,
        "blockNumber": 3,
        "title": "Public Subnets (IGW) vs Private Subnets (NAT Gateway)",
        "conceptBudget": {
          "primaryConcept": "Public vs Private Subnet Routing",
          "supportingTerms": [
            "Internet Gateway (`igw-`) attached to VPC",
            "Public Subnet Route Table (`0.0.0.0/0 -> igw-`)",
            "Private Subnet Route Table (`0.0.0.0/0 -> nat-`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d3-b2-aws-five-reserved-ips",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Public vs Private Subnet Routing Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Public Subnet: Route Table has 0.0.0.0/0 -> igw- (Direct 2-way internet communication)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Private Subnet: Route Table has 0.0.0.0/0 -> nat- (Outbound egress only for security updates, zero inbound)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Isolated DB Subnet: Route Table has ONLY local route 10.0.0.0/16 (100% Zero Internet access)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "route_check_demo.js",
            "initialCode": "function classifySubnet(routeTable) {\n  const defaultRoute = routeTable.find(r => r.destination === '0.0.0.0/0');\n  if (!defaultRoute) return 'ISOLATED_PRIVATE';\n  if (defaultRoute.target.startsWith('igw-')) return 'PUBLIC';\n  if (defaultRoute.target.startsWith('nat-')) return 'EGRESS_ONLY_PRIVATE';\n  return 'UNKNOWN';\n}\n\nconsole.log('Subnet A:', classifySubnet([{ destination: '10.0.0.0/16', target: 'local' }, { destination: '0.0.0.0/0', target: 'igw-12345' }]));\nconsole.log('Subnet B:', classifySubnet([{ destination: '10.0.0.0/16', target: 'local' }, { destination: '0.0.0.0/0', target: 'nat-67890' }]));",
            "expectedOutput": "Subnet A: PUBLIC\nSubnet B: EGRESS_ONLY_PRIVATE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What makes a subnet in an AWS VPC technically classified as a 'Public Subnet'?",
          "options": [
            "Its associated Route Table contains a default route (0.0.0.0/0) pointing directly to an Internet Gateway (igw-)",
            "It is named 'public'",
            "It is located in New York"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
              "errorExplanation": "Subnet public classification is determined strictly by its route table target pointing to an IGW.",
              "recoveryPath": {
                "simplerExplanation": "Public subnet = route table targets igw-.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Security Groups vs Network Access Control Lists (NACLs)",
    "overviewMetaphor": "Security Groups vs NACLs is the security protocol at a corporate headquarters: a Network ACL (NACL) is the security guard at the front street entrance gate (checks everyone entering or exiting the parking lot based on a strict numbered list of ALLOW and DENY rules; stateless); a Security Group is the badge reader on the individual office door (stateful: if you are allowed to walk in, you are automatically allowed to walk back out without tapping your badge again).",
    "blocks": [
      {
        "id": "cloud-d4-b1-stateful-security-groups",
        "day": 4,
        "blockNumber": 1,
        "title": "Security Groups: Stateful Virtual Firewalls",
        "conceptBudget": {
          "primaryConcept": "Security Groups",
          "supportingTerms": [
            "Stateful Filtering (Return traffic automatically allowed regardless of outbound rules)",
            "Allow rules only (No explicit Deny rules)",
            "Applied at Instance/ENI Level"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d3-b3-public-vs-private-subnets-igw",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Stateful vs Stateless Inbound/Outbound Diff",
              "brokenCode": "// ❌ STATELESS NACL MISTAKE: Forgot to allow Outbound Ephemeral Ports (1024-65535)\n// Inbound Port 80 Allowed, but response packets blocked at egress -> CLIENT CONNECTION HANGS!",
              "fixedCode": "// ✅ STATEFUL SECURITY GROUP: Inbound Port 80 Allowed\n// Return response packets are AUTOMATICALLY allowed back out due to connection tracking!",
              "errorLine": 2,
              "errorReason": "Stateless NACLs require explicit outbound ephemeral port allow rules; Security Groups are stateful and auto-track connections.",
              "fixExplanation": "Security Groups track TCP state, automatically permitting return traffic."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sg_stateful_demo.js",
            "initialCode": "function checkSgPacket(inboundRules, packet) {\n  if (packet.isReturnTraffic) return { allowed: true, reason: 'STATEFUL_AUTO_ALLOWED' };\n  const match = inboundRules.some(r => r.port === packet.port && (r.cidr === '0.0.0.0/0' || r.cidr === packet.ip));\n  return match ? { allowed: true, reason: 'INBOUND_RULE_MATCH' } : { allowed: false, reason: 'IMPLICIT_DENY' };\n}\n\nconst rules = [{ port: 443, cidr: '0.0.0.0/0' }];\nconsole.log('New Inbound HTTPS (443):', checkSgPacket(rules, { port: 443, ip: '1.2.3.4' }).reason);\nconsole.log('Outbound Return Packet:', checkSgPacket(rules, { port: 54321, ip: '1.2.3.4', isReturnTraffic: true }).reason);",
            "expectedOutput": "New Inbound HTTPS (443): INBOUND_RULE_MATCH\nOutbound Return Packet: STATEFUL_AUTO_ALLOWED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "If an incoming HTTP request on Port 80 is allowed by a Security Group, do you need to create an Outbound rule to allow the server's response back to the client?",
          "options": [
            "No, Security Groups are stateful; connection tracking automatically allows the return response traffic",
            "Yes, every port requires an identical outbound rule",
            "Only for Linux instances"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_SECURITY_GROUP_STATEFUL_VS_NACL_STATELESS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_SECURITY_GROUP_STATEFUL_VS_NACL_STATELESS",
              "errorExplanation": "Security Groups are stateful and automatically permit return traffic for established connections.",
              "recoveryPath": {
                "simplerExplanation": "Stateful tracking handles return responses automatically.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "cloud-d4-b2-stateless-nacls-ephemeral-ports",
        "day": 4,
        "blockNumber": 2,
        "title": "Network ACLs (NACLs): Stateless Subnet Packet Filters",
        "conceptBudget": {
          "primaryConcept": "Network ACLs (NACLs)",
          "supportingTerms": [
            "Stateless Filtering (Inbound & Outbound evaluated separately)",
            "Numbered rules evaluated ascending (100 before 200)",
            "Ephemeral Ports (1024-65535)",
            "Allow and Deny rules supported"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d4-b1-stateful-security-groups",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "NACL Rule Evaluation",
            "codeSnippet": "// NACL Rule Number Ordering\nconst naclRules = [\n  { ruleNumber: 100, action: 'DENY', cidr: '203.0.113.50/32' }, // Block malicious IP\n  { ruleNumber: 200, action: 'ALLOW', cidr: '0.0.0.0/0' },       // Allow all others\n  { ruleNumber: '*',   action: 'DENY', cidr: '0.0.0.0/0' }        // Default catch-all\n];",
            "lineNotes": {
              "2": "Rule 100 matches first and blocks attacker IP.",
              "3": "Rule 200 allows legitimate traffic.",
              "4": "Default asterisk rule denies unmatched traffic."
            }
          },
          {
            "type": "runnable_code",
            "filename": "nacl_eval_demo.js",
            "initialCode": "function evaluateNacl(rules, ip) {\n  const sorted = [...rules].sort((a, b) => a.num - b.num);\n  for (const r of sorted) {\n    if (r.cidr === '0.0.0.0/0' || r.cidr.startsWith(ip)) return r.action;\n  }\n  return 'DENY';\n}\n\nconst rules = [{ num: 100, action: 'DENY', cidr: '198.51.100.1' }, { num: 200, action: 'ALLOW', cidr: '0.0.0.0/0' }];\nconsole.log('Attacker IP (198.51.100.1):', evaluateNacl(rules, '198.51.100.1'));\nconsole.log('Legitimate IP (1.2.3.4):', evaluateNacl(rules, '1.2.3.4'));",
            "expectedOutput": "Attacker IP (198.51.100.1): DENY\nLegitimate IP (1.2.3.4): ALLOW",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken for the attacker IP `198.51.100.1` matched by Rule 100?",
          "expectedStringOutput": "DENY",
          "acceptableAnswers": [
            "DENY",
            "Attacker IP (198.51.100.1): DENY"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SECURITY_GROUP_STATEFUL_VS_NACL_STATELESS",
          "diagnosisMap": {
            "ALLOW": {
              "misconceptionId": "MC_CLOUD_SECURITY_GROUP_STATEFUL_VS_NACL_STATELESS",
              "errorExplanation": "Rule 100 is evaluated before Rule 200 and explicitly denies the IP.",
              "recoveryPath": {
                "simplerExplanation": "Lowest rule number 100 DENY takes precedence.",
                "guidedFixPrompt": "Type DENY"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d4-b3-security-comparison-matrix",
        "day": 4,
        "blockNumber": 3,
        "title": "Security Group vs NACL Architecture Comparison",
        "conceptBudget": {
          "primaryConcept": "Defense-in-Depth Firewall Matrix",
          "supportingTerms": [
            "SG: Instance Level, Stateful, Allow Only",
            "NACL: Subnet Level, Stateless, Allow & Deny"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d4-b2-stateless-nacls-ephemeral-ports",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "firewall_matrix.js",
            "initialCode": "function getFirewallSpecs() {\n  return {\n    securityGroup: { scope: 'INSTANCE_ENI', state: 'STATEFUL', rules: 'ALLOW_ONLY' },\n    nacl: { scope: 'SUBNET_BOUNDARY', state: 'STATELESS', rules: 'ALLOW_AND_DENY' }\n  };\n}\n\nconsole.log('Security Group Statefulness:', getFirewallSpecs().securityGroup.state);\nconsole.log('NACL Statefulness:', getFirewallSpecs().nacl.state);",
            "expectedOutput": "Security Group Statefulness: STATEFUL\nNACL Statefulness: STATELESS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the statefulness property of an AWS Security Group?",
          "expectedStringOutput": "STATEFUL",
          "acceptableAnswers": [
            "STATEFUL",
            "Stateful"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SECURITY_GROUP_STATEFUL_VS_NACL_STATELESS",
          "diagnosisMap": {
            "STATELESS": {
              "misconceptionId": "MC_CLOUD_SECURITY_GROUP_STATEFUL_VS_NACL_STATELESS",
              "errorExplanation": "Security Groups are STATEFUL. NACLs are STATELESS.",
              "recoveryPath": {
                "simplerExplanation": "Security Groups are STATEFUL.",
                "guidedFixPrompt": "Type STATEFUL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host",
    "overviewMetaphor": "Milestone 1 — High-Availability Enterprise Fortress: Building a complete 3-tier VPC across two physical availability zones (us-east-1a and us-east-1b); public web load balancers route incoming internet traffic to private application servers; private servers route database transactions to isolated database subnets; redundant NAT Gateways ensure secure outbound security patching.",
    "blocks": [
      {
        "id": "cloud-d5-b1-three-tier-vpc-architecture",
        "day": 5,
        "blockNumber": 1,
        "title": "The 3-Tier Enterprise VPC Topology (Web, App, DB)",
        "conceptBudget": {
          "primaryConcept": "3-Tier VPC Architecture",
          "supportingTerms": [
            "Tier 1: Public Subnets (ALBs & NAT Gateways)",
            "Tier 2: Private App Subnets (EC2/ECS Compute)",
            "Tier 3: Isolated Database Subnets (RDS/DynamoDB)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d3-b3-public-vs-private-subnets-igw",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "3-Tier Multi-AZ VPC Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Internet -> Internet Gateway (igw-) -> Public Subnet (ALB in AZ-a & AZ-b)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "ALB forwards traffic -> Private App Subnet (EC2 instances in AZ-a & AZ-b)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "App instances write transactions -> Isolated DB Subnet (RDS Primary in AZ-a + Standby in AZ-b)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "three_tier_demo.js",
            "initialCode": "function auditThreeTierVpc(subnets) {\n  const tiers = new Set(subnets.map(s => s.tier));\n  const azs = new Set(subnets.map(s => s.az));\n  return {\n    hasThreeTiers: tiers.has('PUBLIC') && tiers.has('APP') && tiers.has('DB'),\n    isMultiAz: azs.size >= 2,\n    subnetCount: subnets.length\n  };\n}\n\nconst subnets = [\n  { id: 's-1', tier: 'PUBLIC', az: 'us-east-1a' }, { id: 's-2', tier: 'PUBLIC', az: 'us-east-1b' },\n  { id: 's-3', tier: 'APP', az: 'us-east-1a' },    { id: 's-4', tier: 'APP', az: 'us-east-1b' },\n  { id: 's-5', tier: 'DB', az: 'us-east-1a' },     { id: 's-6', tier: 'DB', az: 'us-east-1b' }\n];\nconsole.log('Topology Audit:', JSON.stringify(auditThreeTierVpc(subnets)));",
            "expectedOutput": "Topology Audit: {\"hasThreeTiers\":true,\"isMultiAz\":true,\"subnetCount\":6}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many subnets comprise a full 3-Tier Multi-AZ VPC deployed across 2 Availability Zones (3 tiers x 2 AZs)?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "6 subnets"
          ],
          "primaryMisconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
              "errorExplanation": "Each of the 3 tiers (Public, App, DB) must exist in both AZ-a and AZ-b for high availability (3 x 2 = 6 subnets).",
              "recoveryPath": {
                "simplerExplanation": "3 tiers in 2 AZs = 6 subnets.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d5-b2-nat-gateway-redundancy",
        "day": 5,
        "blockNumber": 2,
        "title": "Multi-AZ NAT Gateway Redundancy & Cost Trade-offs",
        "conceptBudget": {
          "primaryConcept": "NAT Gateway Redundancy",
          "supportingTerms": [
            "1 NAT Gateway per AZ (Fault Tolerant)",
            "Single Shared NAT Gateway (Cost Saver with Single Point of Failure)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d5-b1-three-tier-vpc-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nat_redundancy.js",
            "initialCode": "function evaluateNatTopology(natGateways) {\n  const uniqueAzs = new Set(natGateways.map(n => n.az));\n  return uniqueAzs.size >= 2 ? 'ENTERPRISE_FAULT_TOLERANT' : 'SINGLE_AZ_RISK';\n}\n\nconsole.log('1 NAT in AZ-a:', evaluateNatTopology([{ id: 'nat-1', az: 'us-east-1a' }]));\nconsole.log('2 NATs in AZ-a & AZ-b:', evaluateNatTopology([{ id: 'nat-1', az: 'us-east-1a' }, { id: 'nat-2', az: 'us-east-1b' }]));",
            "expectedOutput": "1 NAT in AZ-a: SINGLE_AZ_RISK\n2 NATs in AZ-a & AZ-b: ENTERPRISE_FAULT_TOLERANT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What topology status is assigned when deploying NAT Gateways across both AZ-a and AZ-b?",
          "expectedStringOutput": "ENTERPRISE_FAULT_TOLERANT",
          "acceptableAnswers": [
            "ENTERPRISE_FAULT_TOLERANT",
            "2 NATs in AZ-a & AZ-b: ENTERPRISE_FAULT_TOLERANT"
          ],
          "primaryMisconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
          "diagnosisMap": {
            "SINGLE_AZ_RISK": {
              "misconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
              "errorExplanation": "Redundant NAT Gateways in multiple AZs provide ENTERPRISE_FAULT_TOLERANT reliability.",
              "recoveryPath": {
                "simplerExplanation": "Matches ENTERPRISE_FAULT_TOLERANT.",
                "guidedFixPrompt": "Type ENTERPRISE_FAULT_TOLERANT"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d5-b3-milestone-vpc-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 High-Availability VPC Certification",
        "conceptBudget": {
          "primaryConcept": "VPC Milestone Certification",
          "supportingTerms": [
            "Production Multi-AZ Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d5-b2-nat-gateway-redundancy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CLOUD_VPC_PUBLIC_VS_PRIVATE_SUBNET_NAT",
              "errorExplanation": "Returns ⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Matches milestone header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "IAM Role Least-Privilege, Policies & Principal Trust",
    "overviewMetaphor": "IAM Permissions are a high-security office badge system: an IAM Policy is a badge specification (\"Can open the server room on 3rd floor from 9am to 5pm\"); the Principle of Least Privilege is giving an intern access ONLY to the break room, never the master executive keys; an IAM Role is a temporary security pass (Instance Profile) handed to a contractor robot that expires in 1 hour.",
    "blocks": [
      {
        "id": "cloud-d6-b1-iam-policy-json-anatomy",
        "day": 6,
        "blockNumber": 1,
        "title": "IAM JSON Policy Anatomy: Effect, Action, Resource & Condition",
        "conceptBudget": {
          "primaryConcept": "IAM Policy Structure",
          "supportingTerms": [
            "`Version: '2012-10-17'`",
            "`Effect: 'Allow' | 'Deny'`",
            "`Action: ['s3:GetObject', ...]`",
            "`Resource: 'arn:aws:s3:::my-bucket/*'`",
            "`Condition`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b2-shared-responsibility-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "IAM Policy Statement",
            "codeSnippet": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"AllowReadOnlyProductionBucket\",\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:GetObject\", \"s3:ListBucket\"],\n      \"Resource\": [\n        \"arn:aws:s3:::production-assets\",\n        \"arn:aws:s3:::production-assets/*\"\n      ]\n    }\n  ]\n}",
            "lineNotes": {
              "5": "Effect grants permission.",
              "6": "Restricted strictly to read actions (least privilege).",
              "8": "Restricted strictly to the specific bucket ARN."
            }
          },
          {
            "type": "runnable_code",
            "filename": "iam_eval_demo.js",
            "initialCode": "function evaluateAction(statement, action, resource) {\n  const effect = statement.Effect;\n  const actionAllowed = statement.Action.includes(action) || statement.Action.includes('*');\n  const resourceAllowed = statement.Resource.includes(resource) || statement.Resource.includes('*');\n  return (effect === 'Allow' && actionAllowed && resourceAllowed) ? 'PERMITTED' : 'DENIED';\n}\n\nconst s = { Effect: 'Allow', Action: ['s3:GetObject'], Resource: ['arn:aws:s3:::my-bucket/*'] };\nconsole.log('Read File:', evaluateAction(s, 's3:GetObject', 'arn:aws:s3:::my-bucket/*'));\nconsole.log('Delete File:', evaluateAction(s, 's3:DeleteObject', 'arn:aws:s3:::my-bucket/*'));",
            "expectedOutput": "Read File: PERMITTED\nDelete File: DENIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the permission evaluation result when attempting `s3:DeleteObject` against the read-only policy?",
          "expectedStringOutput": "DENIED",
          "acceptableAnswers": [
            "DENIED",
            "Delete File: DENIED"
          ],
          "primaryMisconceptionId": "MC_CLOUD_IAM_LEAST_PRIVILEGE_POLICY_ROLE",
          "diagnosisMap": {
            "PERMITTED": {
              "misconceptionId": "MC_CLOUD_IAM_LEAST_PRIVILEGE_POLICY_ROLE",
              "errorExplanation": "s3:DeleteObject is not listed in the policy Actions and is DENIED by default.",
              "recoveryPath": {
                "simplerExplanation": "Unlisted actions are denied.",
                "guidedFixPrompt": "Type DENIED"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d6-b2-explicit-deny-precedence",
        "day": 6,
        "blockNumber": 2,
        "title": "The Explicit Deny Overrides All Precedence Rule",
        "conceptBudget": {
          "primaryConcept": "Explicit Deny Rule",
          "supportingTerms": [
            "Default = Implicit Deny",
            "Explicit Allow permits action",
            "Explicit Deny ALWAYS overrides any and all Allows"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d6-b1-iam-policy-json-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "IAM Evaluation Logic Decision Tree",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Is there an Explicit Deny matching the request?",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "YES -> Immediate FINAL DENIAL (No further evaluation)",
                  "kind": "end"
                },
                {
                  "id": "3",
                  "label": "NO -> Is there an Explicit Allow matching the request?",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "YES -> ALLOWED | NO -> IMPLICIT DENY (Default)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "deny_precedence_demo.js",
            "initialCode": "function evaluateIamTree(statements) {\n  if (statements.some(s => s.Effect === 'Deny')) return 'FINAL_DENY';\n  if (statements.some(s => s.Effect === 'Allow')) return 'ALLOW';\n  return 'IMPLICIT_DENY';\n}\n\nconst policyA = [{ Effect: 'Allow' }, { Effect: 'Allow' }];\nconst policyB = [{ Effect: 'Allow' }, { Effect: 'Deny' }]; // Deny present!\nconsole.log('Policy A Decision:', evaluateIamTree(policyA));\nconsole.log('Policy B Decision:', evaluateIamTree(policyB));",
            "expectedOutput": "Policy A Decision: ALLOW\nPolicy B Decision: FINAL_DENY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the final decision when a user has 10 Allow policies and 1 Explicit Deny policy?",
          "expectedStringOutput": "FINAL_DENY",
          "acceptableAnswers": [
            "FINAL_DENY",
            "DENY",
            "Policy B Decision: FINAL_DENY"
          ],
          "primaryMisconceptionId": "MC_CLOUD_IAM_LEAST_PRIVILEGE_POLICY_ROLE",
          "diagnosisMap": {
            "ALLOW": {
              "misconceptionId": "MC_CLOUD_IAM_LEAST_PRIVILEGE_POLICY_ROLE",
              "errorExplanation": "An explicit Deny ALWAYS wins and supersedes all Allow statements in AWS IAM.",
              "recoveryPath": {
                "simplerExplanation": "Explicit Deny overrides everything -> FINAL_DENY.",
                "guidedFixPrompt": "Type FINAL_DENY"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d6-b3-iam-roles-vs-access-keys",
        "day": 6,
        "blockNumber": 3,
        "title": "IAM Roles & Instance Profiles vs Dangerous Long-Lived Keys",
        "conceptBudget": {
          "primaryConcept": "IAM Roles",
          "supportingTerms": [
            "Never hardcoding `AWS_ACCESS_KEY_ID` in source code",
            "EC2/Lambda Instance Profiles",
            "Automated credential rotation via AWS STS every 1 hour"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d6-b2-explicit-deny-precedence",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Hardcoded Keys vs IAM Role Diff",
              "brokenCode": "// ❌ CATASTROPHIC SECURITY VULNERABILITY: Hardcoded AWS credentials\nconst s3 = new AWS.S3({\n  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',\n  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'\n}); // If pushed to GitHub, bots drain your account in 3 minutes!",
              "fixedCode": "// ✅ SECURE: Attach IAM Role to EC2 Instance / Lambda Function\nconst s3 = new AWS.S3();\n// SDK automatically fetches short-lived credentials from EC2 Instance Metadata Service (IMDSv2)!",
              "errorLine": 3,
              "errorReason": "Long-lived access keys get leaked into Git repos and logs.",
              "fixExplanation": "IAM Roles provide short-lived, auto-rotating STS tokens with zero hardcoded secrets."
            }
          },
          {
            "type": "runnable_code",
            "filename": "role_token_demo.js",
            "initialCode": "function getCredentialType(hasRoleAttached) {\n  return hasRoleAttached \n    ? { type: 'TEMPORARY_STS_TOKEN', ttlSeconds: 3600, rotatedAutomatically: true }\n    : { type: 'STATIC_LONG_LIVED_KEY', ttlSeconds: Infinity, risk: 'HIGH_LEAKAGE' };\n}\n\nconsole.log('IAM Role Token Security:', JSON.stringify(getCredentialType(true)));",
            "expectedOutput": "IAM Role Token Security: {\"type\":\"TEMPORARY_STS_TOKEN\",\"ttlSeconds\":3600,\"rotatedAutomatically\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should EC2 instances and Lambda functions assume IAM Roles rather than using hardcoded AWS access keys?",
          "options": [
            "IAM Roles automatically provide short-lived temporary security credentials rotated every hour without storing secrets in code or configuration files",
            "Because access keys cost $50 per month",
            "Because AWS disables access keys on weekends"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_IAM_LEAST_PRIVILEGE_POLICY_ROLE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_IAM_LEAST_PRIVILEGE_POLICY_ROLE",
              "errorExplanation": "IAM Roles eliminate hardcoded secrets by rotating short-lived STS credentials automatically.",
              "recoveryPath": {
                "simplerExplanation": "IAM Roles eliminate hardcoded secrets.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "EC2 Compute Classes, Spot Instances & Auto-Scaling Groups",
    "overviewMetaphor": "EC2 Compute Pricing is booking a hotel room: On-Demand is paying standard full nightly rate at the front desk with zero advance commitment; Reserved Instances / Savings Plans is signing a 1-year or 3-year lease for a 72% discount; Spot Instances is bidding on vacant hotel rooms at 90% off with the condition that if a full-paying guest arrives, you get a 2-minute notice to pack your bags and leave.",
    "blocks": [
      {
        "id": "cloud-d7-b1-ec2-instance-families",
        "day": 7,
        "blockNumber": 1,
        "title": "EC2 Instance Families: General Purpose, Compute & Memory Optimized",
        "conceptBudget": {
          "primaryConcept": "EC2 Instance Selection",
          "supportingTerms": [
            "`T4g`/`M7g` (General Purpose ARM Graviton)",
            "`C7g` (Compute Heavy: Video/Batch Processing)",
            "`R7g` (Memory Heavy: Redis/In-Memory DBs)",
            "`I4i` (High I/O Storage)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b1-service-models-pyramid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "EC2 Instance Family Mnemonics",
              "boxes": [
                {
                  "label": "M / T (General)",
                  "value": "Balanced CPU to RAM ratio (1:4) -> Web servers, small DBs",
                  "varType": "General Purpose",
                  "isUpdated": false
                },
                {
                  "label": "C (Compute)",
                  "value": "High CPU to RAM ratio (1:2) -> Machine learning inference, batch jobs",
                  "varType": "Compute Optimized",
                  "isUpdated": false
                },
                {
                  "label": "R (RAM/Memory)",
                  "value": "High RAM to CPU ratio (1:8) -> Redis caches, analytics dataframes",
                  "varType": "Memory Optimized",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "instance_selector_demo.js",
            "initialCode": "function selectOptimalFamily(workload) {\n  if (workload === 'IN_MEMORY_REDIS_CACHE') return 'R7g (Memory Optimized)';\n  if (workload === 'VIDEO_TRANSCODING') return 'C7g (Compute Optimized)';\n  return 'M7g (General Purpose)';\n}\n\nconsole.log('Redis Workload:', selectOptimalFamily('IN_MEMORY_REDIS_CACHE'));\nconsole.log('Video Transcoder:', selectOptimalFamily('VIDEO_TRANSCODING'));",
            "expectedOutput": "Redis Workload: R7g (Memory Optimized)\nVideo Transcoder: C7g (Compute Optimized)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which EC2 instance family is optimal for an in-memory Redis caching cluster requiring huge RAM?",
          "expectedStringOutput": "R7g (Memory Optimized)",
          "acceptableAnswers": [
            "R7g (Memory Optimized)",
            "R7g",
            "Memory Optimized",
            "R"
          ],
          "primaryMisconceptionId": "MC_CLOUD_EC2_AUTO_SCALING_TARGET_TRACKING",
          "diagnosisMap": {
            "C7g": {
              "misconceptionId": "MC_CLOUD_EC2_AUTO_SCALING_TARGET_TRACKING",
              "errorExplanation": "C7g is Compute-Optimized. Memory-heavy Redis caching requires R7g (RAM).",
              "recoveryPath": {
                "simplerExplanation": "R = RAM (Memory Optimized).",
                "guidedFixPrompt": "Type R7g (Memory Optimized)"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d7-b2-spot-instances-stateless-workers",
        "day": 7,
        "blockNumber": 2,
        "title": "Spot Instances (90% Discount) & The 2-Minute Interruption Notice",
        "conceptBudget": {
          "primaryConcept": "AWS Spot Instances",
          "supportingTerms": [
            "Up to 90% savings over On-Demand",
            "Reclaiming spare AWS capacity",
            "2-minute CloudWatch interruption event",
            "Best for stateless batch workers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d7-b1-ec2-instance-families",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Spot Termination Handler",
            "codeSnippet": "// EC2 Spot Interruption Notice Check (Polls IMDSv2 metadata)\nasync function checkSpotInterruption() {\n  const res = await fetch('http://169.254.169.254/latest/meta-data/spot/instance-action');\n  if (res.status === 200) {\n    // 2-minute countdown begins!\n    await checkpointCurrentJobState();\n    await drainConnections();\n  }\n}",
            "lineNotes": {
              "2": "Instance Metadata Service emits action 2 minutes before termination.",
              "5": "Saves state to S3/DynamoDB so another worker resumes without loss."
            }
          },
          {
            "type": "runnable_code",
            "filename": "spot_cost_demo.js",
            "initialCode": "function calculateSpotSavings(hourlyOnDemand, spotDiscountPercent = 0.85) {\n  const spotRate = hourlyOnDemand * (1 - spotDiscountPercent);\n  const monthlyOnDemand = hourlyOnDemand * 730;\n  const monthlySpot = spotRate * 730;\n  return { monthlyOnDemand: `$${monthlyOnDemand.toFixed(2)}`, monthlySpot: `$${monthlySpot.toFixed(2)}`, savings: `$${(monthlyOnDemand - monthlySpot).toFixed(2)}` };\n}\n\nconsole.log('100 Large Instances Savings:', JSON.stringify(calculateSpotSavings(0.40)));",
            "expectedOutput": "100 Large Instances Savings: {\"monthlyOnDemand\":\"$292.00\",\"monthlySpot\":\"$43.80\",\"savings\":\"$248.20\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should stateful primary relational databases (like single-instance PostgreSQL) NEVER run directly on EC2 Spot Instances?",
          "options": [
            "Because Spot instances can be reclaimed by AWS with only 2 minutes notice whenever capacity demand surges, which would crash a non-distributed database",
            "Because Spot instances do not have hard drives",
            "Because SQL is blocked on Spot"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_EC2_AUTO_SCALING_TARGET_TRACKING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_EC2_AUTO_SCALING_TARGET_TRACKING",
              "errorExplanation": "Spot instances are interruptible; stateful single-point-of-failure databases require On-Demand or Managed RDS.",
              "recoveryPath": {
                "simplerExplanation": "Spot instances can be interrupted in 2 minutes.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "cloud-d7-b3-auto-scaling-target-tracking",
        "day": 7,
        "blockNumber": 3,
        "title": "Auto-Scaling Groups (ASG) & Target Tracking Policies",
        "conceptBudget": {
          "primaryConcept": "Target Tracking Auto-Scaling",
          "supportingTerms": [
            "Target Tracking on Average CPU (e.g. Keep CPU at 60%)",
            "Min, Desired, and Max Capacity limits",
            "Cooldown periods"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d7-b2-spot-instances-stateless-workers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "asg_calc_demo.js",
            "initialCode": "function getScalingAction(currentInstances, currentAvgCpu, targetCpu = 60, min = 2, max = 10) {\n  const desired = Math.ceil(currentInstances * (currentAvgCpu / targetCpu));\n  const bounded = Math.min(max, Math.max(min, desired));\n  return { currentInstances, currentAvgCpu, desiredInstances: bounded, action: bounded > currentInstances ? 'SCALE_OUT' : (bounded < currentInstances ? 'SCALE_IN' : 'HOLD') };\n}\n\nconsole.log('Heavy Traffic Spike (90% CPU):', JSON.stringify(getScalingAction(4, 90)));\nconsole.log('Nighttime Traffic Dip (20% CPU):', JSON.stringify(getScalingAction(4, 20)));",
            "expectedOutput": "Heavy Traffic Spike (90% CPU): {\"currentInstances\":4,\"currentAvgCpu\":90,\"desiredInstances\":6,\"action\":\"SCALE_OUT\"}\nNighttime Traffic Dip (20% CPU): {\"currentInstances\":4,\"currentAvgCpu\":20,\"desiredInstances\":2,\"action\":\"SCALE_IN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action does the Auto-Scaling Group trigger when current 4 instances reach 90% CPU (target 60%)?",
          "expectedStringOutput": "SCALE_OUT",
          "acceptableAnswers": [
            "SCALE_OUT",
            "Scale Out"
          ],
          "primaryMisconceptionId": "MC_CLOUD_EC2_AUTO_SCALING_TARGET_TRACKING",
          "diagnosisMap": {
            "SCALE_IN": {
              "misconceptionId": "MC_CLOUD_EC2_AUTO_SCALING_TARGET_TRACKING",
              "errorExplanation": "High CPU utilization (90%) requires adding more instances (SCALE_OUT).",
              "recoveryPath": {
                "simplerExplanation": "High load -> SCALE_OUT.",
                "guidedFixPrompt": "Type SCALE_OUT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Application Load Balancer (ALB), Target Groups & Health Probes",
    "overviewMetaphor": "An Application Load Balancer (ALB) is an air traffic controller at an international airport: incoming planes (HTTP requests) arrive on the main runway; the controller inspects the flight tags (`/api/*` vs `/images/*` or host headers) and routes the plane to the exact designated terminal gate (Target Group); if Gate 3 reports a mechanical failure (Health Check fails), the controller diverts all incoming traffic to healthy Gate 4 immediately.",
    "blocks": [
      {
        "id": "cloud-d8-b1-alb-vs-nlb-layer7-vs-layer4",
        "day": 8,
        "blockNumber": 1,
        "title": "ALB (Layer 7 HTTP/HTTPS) vs NLB (Layer 4 TCP/UDP)",
        "conceptBudget": {
          "primaryConcept": "AWS Load Balancer Types",
          "supportingTerms": [
            "ALB (Layer 7: HTTP/HTTPS, Path/Header Routing, SSL Termination)",
            "NLB (Layer 4: Ultra-high throughput, static IPs, gaming/financial TCP)",
            "Cross-Zone Load Balancing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d7-b3-auto-scaling-target-tracking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ALB vs NLB Comparison",
              "boxes": [
                {
                  "label": "Application Load Balancer (ALB)",
                  "value": "Layer 7 (HTTP/HTTPS/gRPC) -> Path /api/*, Host Header, Redirects",
                  "varType": "Application Smart",
                  "isUpdated": false
                },
                {
                  "label": "Network Load Balancer (NLB)",
                  "value": "Layer 4 (TCP/UDP/TLS) -> Millions of requests/sec, Sub-millisecond latency, Static IPs",
                  "varType": "Raw Throughput",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lb_picker_demo.js",
            "initialCode": "function chooseLoadBalancer(needsPathRouting, needsUltraLowLatencyTcp) {\n  if (needsPathRouting) return 'ALB (Application Load Balancer)';\n  if (needsUltraLowLatencyTcp) return 'NLB (Network Load Balancer)';\n  return 'ALB';\n}\n\nconsole.log('REST API with Path Routing:', chooseLoadBalancer(true, false));\nconsole.log('Real-Time Gaming TCP Stream:', chooseLoadBalancer(false, true));",
            "expectedOutput": "REST API with Path Routing: ALB (Application Load Balancer)\nReal-Time Gaming TCP Stream: NLB (Network Load Balancer)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When should you choose an Application Load Balancer (ALB) over a Network Load Balancer (NLB)?",
          "options": [
            "When you need Layer 7 intelligent routing (such as routing /api/* to one target group and /static/* to another based on HTTP paths or cookies)",
            "When you want slower speeds",
            "Because NLB cannot connect to the internet"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_ALB_PATH_ROUTING_HEALTH_PROBE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_ALB_PATH_ROUTING_HEALTH_PROBE",
              "errorExplanation": "ALB operates at Layer 7, providing path-based, host-based, and header-based HTTP request routing.",
              "recoveryPath": {
                "simplerExplanation": "Layer 7 path routing is supported by ALB.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "cloud-d8-b2-alb-health-check-draining",
        "day": 8,
        "blockNumber": 2,
        "title": "Target Group Health Probes & Connection Draining (Deregistration Delay)",
        "conceptBudget": {
          "primaryConcept": "Target Health & Deregistration Delay",
          "supportingTerms": [
            "`/healthz` endpoint (Healthy threshold = 2, Unhealthy threshold = 3)",
            "Connection Draining (Deregistration Delay: 300s window for in-flight requests to complete)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d8-b1-alb-vs-nlb-layer7-vs-layer4",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ALB Target Group Health Probe Config",
            "codeSnippet": "const targetGroupConfig = {\n  HealthCheckProtocol: 'HTTP',\n  HealthCheckPath: '/healthz',\n  HealthCheckIntervalSeconds: 15,\n  HealthyThresholdCount: 2,\n  UnhealthyThresholdCount: 3,\n  DeregistrationDelaySeconds: 300\n};",
            "lineNotes": {
              "3": "Probes /healthz every 15 seconds.",
              "5": "3 consecutive failed probes mark target UNHEALTHY and cease new traffic.",
              "6": "Gives active connections 300 seconds to drain cleanly before terminating instance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "probe_sim_demo.js",
            "initialCode": "function evaluateTargetHealth(consecutiveFailures, threshold = 3) {\n  return consecutiveFailures >= threshold ? 'UNHEALTHY_DETACHED' : 'HEALTHY_RECEIVING_TRAFFIC';\n}\n\nconsole.log('1 Failure:', evaluateTargetHealth(1));\nconsole.log('3 Failures:', evaluateTargetHealth(3));",
            "expectedOutput": "1 Failure: HEALTHY_RECEIVING_TRAFFIC\n3 Failures: UNHEALTHY_DETACHED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state does a target instance transition to after 3 consecutive health probe failures?",
          "expectedStringOutput": "UNHEALTHY_DETACHED",
          "acceptableAnswers": [
            "UNHEALTHY_DETACHED",
            "3 Failures: UNHEALTHY_DETACHED",
            "UNHEALTHY"
          ],
          "primaryMisconceptionId": "MC_CLOUD_ALB_PATH_ROUTING_HEALTH_PROBE",
          "diagnosisMap": {
            "HEALTHY_RECEIVING_TRAFFIC": {
              "misconceptionId": "MC_CLOUD_ALB_PATH_ROUTING_HEALTH_PROBE",
              "errorExplanation": "3 failures reach the threshold and detach the target from receiving traffic.",
              "recoveryPath": {
                "simplerExplanation": "3 failed checks detach the instance.",
                "guidedFixPrompt": "Type UNHEALTHY_DETACHED"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d8-b3-ssl-termination-acm",
        "day": 8,
        "blockNumber": 3,
        "title": "SSL/TLS Offloading with AWS Certificate Manager (ACM)",
        "conceptBudget": {
          "primaryConcept": "SSL Termination",
          "supportingTerms": [
            "Offloading expensive TLS decryption at the Load Balancer",
            "Free managed SSL certificates with AWS ACM",
            "HTTP to HTTPS automated 301 redirection"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d8-b2-alb-health-check-draining",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ssl_redirect_demo.js",
            "initialCode": "function handleHttpRedirect(reqProtocol, host, url) {\n  if (reqProtocol === 'http') {\n    return { status: 301, redirectUrl: `https://${host}${url}` };\n  }\n  return { status: 200, action: 'FORWARD_TO_TARGET_GROUP' };\n}\n\nconsole.log('Insecure HTTP Port 80:', JSON.stringify(handleHttpRedirect('http', 'pinit.io', '/login')));\nconsole.log('Secure HTTPS Port 443:', JSON.stringify(handleHttpRedirect('https', 'pinit.io', '/login')));",
            "expectedOutput": "Insecure HTTP Port 80: {\"status\":301,\"redirectUrl\":\"https://pinit.io/login\"}\nSecure HTTPS Port 443: {\"status\":200,\"action\":\"FORWARD_TO_TARGET_GROUP\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What HTTP redirect status code is returned to enforce HTTPS on Port 80?",
          "expectedStringOutput": "301",
          "acceptableAnswers": [
            "301",
            "HTTP 301",
            "301 Moved Permanently"
          ],
          "primaryMisconceptionId": "MC_CLOUD_ALB_PATH_ROUTING_HEALTH_PROBE",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_CLOUD_ALB_PATH_ROUTING_HEALTH_PROBE",
              "errorExplanation": "Insecure HTTP requests are permanently redirected to HTTPS with status code 301.",
              "recoveryPath": {
                "simplerExplanation": "HTTP -> HTTPS redirect is 301.",
                "guidedFixPrompt": "Type 301"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Amazon S3 Object Storage & Lifecycle Management Tiering",
    "overviewMetaphor": "Amazon S3 Storage Classes are physical storage facilities: S3 Standard is your living room coffee table (instant 5ms access, higher monthly cost); S3 Infrequent Access (IA) is your home garage (rapid retrieval, lower storage cost, small per-GB retrieval fee); Glacier Deep Archive is an underground salt mine vault in Nevada ($0.00099/GB/month, takes 12 hours to dig out a box).",
    "blocks": [
      {
        "id": "cloud-d9-b1-s3-storage-classes-matrix",
        "day": 9,
        "blockNumber": 1,
        "title": "S3 Storage Classes & Cost Optimization Tiering",
        "conceptBudget": {
          "primaryConcept": "S3 Storage Classes",
          "supportingTerms": [
            "S3 Standard (Hot active data)",
            "S3 Standard-IA (Infrequently accessed, 30-day min)",
            "S3 Intelligent-Tiering (Auto-optimizing)",
            "Glacier Deep Archive (Long-term compliance, $1/TB/mo)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b3-capex-vs-opex-tco",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "S3 Storage Class Pricing & Retrieval Tiering",
              "boxes": [
                {
                  "label": "S3 Standard",
                  "value": "$0.023 / GB / month -> Millisecond retrieval, 0 retrieval fees",
                  "varType": "Hot Tier",
                  "isUpdated": false
                },
                {
                  "label": "S3 Standard-IA",
                  "value": "$0.0125 / GB / month -> Millisecond retrieval, $0.01/GB retrieval fee",
                  "varType": "Warm Tier",
                  "isUpdated": false
                },
                {
                  "label": "S3 Glacier Deep Archive",
                  "value": "$0.00099 / GB / month (95% cheaper!) -> 12-48 hour retrieval",
                  "varType": "Cold Archive",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "s3_cost_calc_demo.js",
            "initialCode": "function calculateS3Bill(gb, storageClass) {\n  const rates = { 'STANDARD': 0.023, 'STANDARD_IA': 0.0125, 'GLACIER_DEEP_ARCHIVE': 0.00099 };\n  const cost = gb * rates[storageClass];\n  return `$${cost.toFixed(2)}`;\n}\n\nconsole.log('10,000 GB (10 TB) on Standard:', calculateS3Bill(10000, 'STANDARD'));\nconsole.log('10,000 GB (10 TB) on Glacier Deep Archive:', calculateS3Bill(10000, 'GLACIER_DEEP_ARCHIVE'));",
            "expectedOutput": "10,000 GB (10 TB) on Standard: $230.00\n10,000 GB (10 TB) on Glacier Deep Archive: $9.90",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the monthly cost of storing 10 TB of compliance audit logs in S3 Glacier Deep Archive ($0.00099/GB)?",
          "expectedStringOutput": "$9.90",
          "acceptableAnswers": [
            "$9.90",
            "9.90",
            "10,000 GB (10 TB) on Glacier Deep Archive: $9.90"
          ],
          "primaryMisconceptionId": "MC_CLOUD_S3_STORAGE_CLASS_LIFECYCLE_TIERING",
          "diagnosisMap": {
            "$230.00": {
              "misconceptionId": "MC_CLOUD_S3_STORAGE_CLASS_LIFECYCLE_TIERING",
              "errorExplanation": "$230 is for S3 Standard. Glacier Deep Archive costs only $9.90 for 10,000 GB.",
              "recoveryPath": {
                "simplerExplanation": "Glacier Deep Archive = $9.90.",
                "guidedFixPrompt": "Type $9.90"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d9-b2-s3-lifecycle-transition-rules",
        "day": 9,
        "blockNumber": 2,
        "title": "Automated S3 Lifecycle Transition Rules",
        "conceptBudget": {
          "primaryConcept": "S3 Lifecycle Policies",
          "supportingTerms": [
            "Transition Rule: Standard $\\to$ Standard-IA after 30 days",
            "Transition Rule: IA $\\to$ Glacier Deep Archive after 90 days",
            "Expiration Rule: Delete permanently after 365 days"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d9-b1-s3-storage-classes-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "S3 Object Lifecycle Progression Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Day 0: Object Created in S3 Standard (Hot Access)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Day 30: Auto-migrates to S3 Standard-IA (Save 45%)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Day 90: Auto-migrates to Glacier Deep Archive (Save 95%)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Day 365: Object Expires & Automatically Deleted",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lifecycle_eval.js",
            "initialCode": "function evaluateLifecycleClass(ageDays) {\n  if (ageDays < 30) return 'S3_STANDARD';\n  if (ageDays < 90) return 'S3_STANDARD_IA';\n  if (ageDays < 365) return 'S3_GLACIER_DEEP_ARCHIVE';\n  return 'EXPIRED_DELETED';\n}\n\nconsole.log('15-day object:', evaluateLifecycleClass(15));\nconsole.log('45-day object:', evaluateLifecycleClass(45));\nconsole.log('120-day object:', evaluateLifecycleClass(120));",
            "expectedOutput": "15-day object: S3_STANDARD\n45-day object: S3_STANDARD_IA\n120-day object: S3_GLACIER_DEEP_ARCHIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which storage tier does an object transition to at Day 45 under standard lifecycle rules?",
          "expectedStringOutput": "S3_STANDARD_IA",
          "acceptableAnswers": [
            "S3_STANDARD_IA",
            "Standard-IA",
            "45-day object: S3_STANDARD_IA"
          ],
          "primaryMisconceptionId": "MC_CLOUD_S3_STORAGE_CLASS_LIFECYCLE_TIERING",
          "diagnosisMap": {
            "S3_STANDARD": {
              "misconceptionId": "MC_CLOUD_S3_STORAGE_CLASS_LIFECYCLE_TIERING",
              "errorExplanation": "At Day 30+, objects transition to S3_STANDARD_IA.",
              "recoveryPath": {
                "simplerExplanation": "Day 45 is in S3_STANDARD_IA.",
                "guidedFixPrompt": "Type S3_STANDARD_IA"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d9-b3-s3-strong-consistency",
        "day": 9,
        "blockNumber": 3,
        "title": "S3 Read-After-Write Strong Consistency Model",
        "conceptBudget": {
          "primaryConcept": "S3 Strong Consistency",
          "supportingTerms": [
            "Strong Read-After-Write Consistency for PUTs and DELETEs",
            "Instant propagation across all AZs without stale reads"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d9-b2-s3-lifecycle-transition-rules",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "consistency_demo.js",
            "initialCode": "class S3Mock {\n  constructor() { this.store = new Map(); }\n  put(key, val) { this.store.set(key, val); return { status: 200 }; }\n  get(key) { return this.store.get(key) || null; }\n}\n\nconst s3 = new S3Mock();\ns3.put('report.pdf', 'v2_data');\nconsole.log('Immediate Read After Put:', s3.get('report.pdf'));",
            "expectedOutput": "Immediate Read After Put: v2_data",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is Amazon S3's consistency guarantee when reading an object immediately after completing a PUT upload?",
          "options": [
            "Strong Read-After-Write Consistency: Every GET request immediately returns the newest version of the object",
            "Eventual Consistency: You must wait 10 seconds before reading new uploads",
            "Random Consistency"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_S3_STORAGE_CLASS_LIFECYCLE_TIERING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_S3_STORAGE_CLASS_LIFECYCLE_TIERING",
              "errorExplanation": "Amazon S3 delivers strong read-after-write consistency across all AWS regions.",
              "recoveryPath": {
                "simplerExplanation": "S3 has strong read-after-write consistency.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Amazon S3 Security, Block Public Access & Bucket Policies",
    "overviewMetaphor": "S3 Bucket Security is a bank vault door with four separate heavy titanium deadbolts (Block Public Access - BPA): even if a novice developer accidentally writes a Bucket Policy with `Principal: *` (giving everyone in the world open access), the 4 master BPA deadbolts override all policies and completely block public internet hackers from touching company data.",
    "blocks": [
      {
        "id": "cloud-d10-b1-block-public-access-four-flags",
        "day": 10,
        "blockNumber": 1,
        "title": "S3 Block Public Access (BPA) & Account-Level Guardrails",
        "conceptBudget": {
          "primaryConcept": "Block Public Access (BPA)",
          "supportingTerms": [
            "`BlockPublicAcls`",
            "`IgnorePublicAcls`",
            "`BlockPublicPolicy`",
            "`RestrictPublicBuckets`",
            "Account-Wide Public Access Guardrails"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d9-b1-s3-storage-classes-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "S3 Block Public Access 4-Point Shield",
              "boxes": [
                {
                  "label": "1. BlockPublicAcls",
                  "value": "Rejects new public ACLs uploaded with PUT requests",
                  "varType": "ACL Guard",
                  "isUpdated": false
                },
                {
                  "label": "2. IgnorePublicAcls",
                  "value": "Ignores all existing public ACLs on bucket and objects",
                  "varType": "ACL Overrider",
                  "isUpdated": false
                },
                {
                  "label": "3. BlockPublicPolicy",
                  "value": "Rejects any new Bucket Policy granting public access",
                  "varType": "Policy Guard",
                  "isUpdated": false
                },
                {
                  "label": "4. RestrictPublicBuckets",
                  "value": "Restricts public access to ONLY AWS services and authorized users",
                  "varType": "Bucket Lock",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bpa_check_demo.js",
            "initialCode": "function evaluateBpa(config) {\n  const allEnabled = config.blockPublicAcls && config.ignorePublicAcls && config.blockPublicPolicy && config.restrictPublicBuckets;\n  return allEnabled ? 'SECURE_BPA_LOCKED' : 'VULNERABLE_PUBLIC_EXPOSURE_RISK';\n}\n\nconsole.log('Production Config:', evaluateBpa({ blockPublicAcls: true, ignorePublicAcls: true, blockPublicPolicy: true, restrictPublicBuckets: true }));\nconsole.log('Insecure Config:', evaluateBpa({ blockPublicAcls: true, ignorePublicAcls: false, blockPublicPolicy: true, restrictPublicBuckets: false }));",
            "expectedOutput": "Production Config: SECURE_BPA_LOCKED\nInsecure Config: VULNERABLE_PUBLIC_EXPOSURE_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security status is returned when all 4 S3 Block Public Access flags are enabled?",
          "expectedStringOutput": "SECURE_BPA_LOCKED",
          "acceptableAnswers": [
            "SECURE_BPA_LOCKED",
            "Production Config: SECURE_BPA_LOCKED"
          ],
          "primaryMisconceptionId": "MC_CLOUD_S3_BUCKET_POLICY_BLOCK_PUBLIC_ACCESS",
          "diagnosisMap": {
            "VULNERABLE": {
              "misconceptionId": "MC_CLOUD_S3_BUCKET_POLICY_BLOCK_PUBLIC_ACCESS",
              "errorExplanation": "All 4 flags enabled produces SECURE_BPA_LOCKED.",
              "recoveryPath": {
                "simplerExplanation": "Matches SECURE_BPA_LOCKED.",
                "guidedFixPrompt": "Type SECURE_BPA_LOCKED"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d10-b2-enforce-https-bucket-policy",
        "day": 10,
        "blockNumber": 2,
        "title": "Enforcing Encryption in Transit (`aws:SecureTransport`)",
        "conceptBudget": {
          "primaryConcept": "HTTPS Bucket Policy Enforcement",
          "supportingTerms": [
            "Condition: `aws:SecureTransport: false`",
            "Explicit Deny on unencrypted HTTP requests",
            "Preventing Man-in-the-Middle (MitM) eavesdropping"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d10-b1-block-public-access-four-flags",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Enforce HTTPS S3 Bucket Policy",
            "codeSnippet": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"EnforceHttpsOnly\",\n      \"Effect\": \"Deny\",\n      \"Principal\": \"*\",\n      \"Action\": \"s3:*\",\n      \"Resource\": [\"arn:aws:s3:::my-secure-bucket\", \"arn:aws:s3:::my-secure-bucket/*\"],\n      \"Condition\": {\n        \"Bool\": {\n          \"aws:SecureTransport\": \"false\"\n        }\n      }\n    }\n  ]\n}",
            "lineNotes": {
              "5": "Explicit Deny overrides all allows.",
              "11": "Matches any request sent over plain HTTP (aws:SecureTransport == false)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "https_policy_demo.js",
            "initialCode": "function evaluateTransportPolicy(isHttps) {\n  if (!isHttps) return { allowed: false, error: '403_FORBIDDEN_HTTPS_REQUIRED' };\n  return { allowed: true, status: 200 };\n}\n\nconsole.log('Plain HTTP Port 80:', JSON.stringify(evaluateTransportPolicy(false)));\nconsole.log('Encrypted HTTPS Port 443:', JSON.stringify(evaluateTransportPolicy(true)));",
            "expectedOutput": "Plain HTTP Port 80: {\"allowed\":false,\"error\":\"403_FORBIDDEN_HTTPS_REQUIRED\"}\nEncrypted HTTPS Port 443: {\"allowed\":true,\"status\":200}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What error code is returned when an unencrypted HTTP request hits an S3 bucket with HTTPS enforcement?",
          "expectedStringOutput": "403_FORBIDDEN_HTTPS_REQUIRED",
          "acceptableAnswers": [
            "403_FORBIDDEN_HTTPS_REQUIRED",
            "403 Forbidden",
            "403"
          ],
          "primaryMisconceptionId": "MC_CLOUD_S3_BUCKET_POLICY_BLOCK_PUBLIC_ACCESS",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_CLOUD_S3_BUCKET_POLICY_BLOCK_PUBLIC_ACCESS",
              "errorExplanation": "Unencrypted HTTP requests are explicitly denied with 403 Forbidden.",
              "recoveryPath": {
                "simplerExplanation": "HTTP is denied -> 403_FORBIDDEN_HTTPS_REQUIRED.",
                "guidedFixPrompt": "Type 403_FORBIDDEN_HTTPS_REQUIRED"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d10-b3-s3-presigned-urls-security",
        "day": 10,
        "blockNumber": 3,
        "title": "Temporary Time-Limited S3 Presigned URLs",
        "conceptBudget": {
          "primaryConcept": "Presigned URLs",
          "supportingTerms": [
            "Generating time-limited download/upload tokens (e.g. 15 minutes)",
            "Eliminating public read access on private data",
            "Cryptographic HMAC query signature"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d10-b2-enforce-https-bucket-policy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "presigned_s3_demo.js",
            "initialCode": "function generatePresignedS3Url(bucket, key, expireSec = 900) {\n  const expiresAt = Math.floor(Date.now() / 1000) + expireSec;\n  return {\n    url: `https://${bucket}.s3.amazonaws.com/${key}?X-Amz-Expires=${expireSec}&X-Amz-Signature=mock_sig_123`,\n    expiresAt\n  };\n}\n\nconst presigned = generatePresignedS3Url('private-invoices', 'inv_2026_08.pdf', 600);\nconsole.log('Presigned Object Key:', presigned.url.split('.com/')[1].split('?')[0]);",
            "expectedOutput": "Presigned Object Key: inv_2026_08.pdf",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How do S3 Presigned URLs allow users to download private files without making the S3 bucket publicly readable?",
          "options": [
            "The backend server generates a temporary URL containing a time-limited cryptographic signature that grants access only to that specific object for a few minutes",
            "Presigned URLs temporarily open the entire bucket to the world",
            "Presigned URLs require the user to enter AWS root credentials"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_S3_BUCKET_POLICY_BLOCK_PUBLIC_ACCESS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_S3_BUCKET_POLICY_BLOCK_PUBLIC_ACCESS",
              "errorExplanation": "Presigned URLs embed time-limited cryptographic authorization signatures without opening bucket permissions.",
              "recoveryPath": {
                "simplerExplanation": "Presigned URLs provide time-limited signed access.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Serverless AWS Lambda: Concurrency, Memory & Cold Starts",
    "overviewMetaphor": "AWS Lambda is a fleet of emergency taxi cabs on standby: when a customer requests a ride (HTTP event), a new taxi starts its engine (Cold Start: 150ms to boot microVM and initialize code); while the taxi is driving (Warm state), subsequent rides start instantly with 0ms delay; if no rides happen for 15 minutes, the taxi parks and shuts off its engine (scale to zero with zero idle cost).",
    "blocks": [
      {
        "id": "cloud-d11-b1-lambda-execution-lifecycle",
        "day": 11,
        "blockNumber": 1,
        "title": "Lambda Execution Lifecycle: Init vs Invoke Phases",
        "conceptBudget": {
          "primaryConcept": "Lambda Lifecycle",
          "supportingTerms": [
            "INIT Phase (Cold start: Downloading code, booting Firecracker microVM, running global code)",
            "INVOKE Phase (Executing handler function)",
            "Warm reuse across executions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b1-service-models-pyramid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Lambda Init vs Handler Scope",
            "codeSnippet": "// 1. INIT PHASE (Executes ONCE during Cold Start)\nconst dbConnection = connectToDatabase(); // Reuse across warm invocations!\n\n// 2. INVOKE PHASE (Executes on EVERY incoming event)\nexports.handler = async (event) => {\n  const user = await dbConnection.find(event.userId);\n  return { statusCode: 200, body: JSON.stringify(user) };\n};",
            "lineNotes": {
              "2": "Keep heavy DB connections outside handler in global init scope.",
              "5": "Handler function runs per request with 0ms connection overhead on warm instances."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cold_start_demo.js",
            "initialCode": "let isWarm = false;\nasync function invokeLambda(event) {\n  let latencyMs = 0;\n  if (!isWarm) {\n    latencyMs += 180; // Cold start init\n    isWarm = true;\n  }\n  latencyMs += 12; // Handler execution\n  return { isWarm: isWarm && latencyMs <= 12, latencyMs };\n}\n\ninvokeLambda({}).then(res1 => {\n  console.log('Invocation 1 (Cold):', res1.latencyMs + 'ms');\n  invokeLambda({}).then(res2 => {\n    console.log('Invocation 2 (Warm):', res2.latencyMs + 'ms');\n  });\n});",
            "expectedOutput": "Invocation 1 (Cold): 192ms\nInvocation 2 (Warm): 12ms",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the execution latency (in ms) of Invocation 2 once the Lambda environment is warm?",
          "expectedStringOutput": "12ms",
          "acceptableAnswers": [
            "12ms",
            "12",
            "Invocation 2 (Warm): 12ms"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
          "diagnosisMap": {
            "192ms": {
              "misconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
              "errorExplanation": "192ms includes the cold start. Warm execution takes only 12ms.",
              "recoveryPath": {
                "simplerExplanation": "Warm execution is 12ms.",
                "guidedFixPrompt": "Type 12ms"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d11-b2-lambda-memory-vcpu-scaling",
        "day": 11,
        "blockNumber": 2,
        "title": "Memory to vCPU Proportional Allocation (1,769 MB Rule)",
        "conceptBudget": {
          "primaryConcept": "Lambda vCPU Allocation",
          "supportingTerms": [
            "Configuring RAM (128 MB to 10,240 MB)",
            "At 1,769 MB, Lambda allocates exactly 1 full vCPU core",
            "Multi-threading benefits above 1,769 MB"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d11-b1-lambda-execution-lifecycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Lambda Memory to vCPU Scaling Ratio",
              "boxes": [
                {
                  "label": "128 MB RAM",
                  "value": "0.07 vCPU (Fractional Core) -> Light HTTP proxy",
                  "varType": "Small Task",
                  "isUpdated": false
                },
                {
                  "label": "1,769 MB RAM",
                  "value": "1.00 Full vCPU Dedicated Core -> CPU-intensive tasks",
                  "varType": "1 vCPU Milestone",
                  "isUpdated": false
                },
                {
                  "label": "10,240 MB RAM",
                  "value": "6.00 vCPU Dedicated Cores -> Parallel image processing",
                  "varType": "Max Compute",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "vcpu_calc.js",
            "initialCode": "function getVcpuCount(ramMb) {\n  return (ramMb / 1769).toFixed(2);\n}\n\nconsole.log('1,769 MB RAM vCPUs:', getVcpuCount(1769));\nconsole.log('3,538 MB RAM vCPUs:', getVcpuCount(3538));",
            "expectedOutput": "1,769 MB RAM vCPUs: 1.00\n3,538 MB RAM vCPUs: 2.00",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many full dedicated vCPU cores are allocated to a Lambda function configured with 1,769 MB of RAM?",
          "expectedStringOutput": "1.00",
          "acceptableAnswers": [
            "1.00",
            "1",
            "1 full vCPU",
            "1 vCPU"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
              "errorExplanation": "In AWS Lambda, exactly 1,769 MB yields 1.00 vCPU.",
              "recoveryPath": {
                "simplerExplanation": "1,769 MB = 1 full vCPU.",
                "guidedFixPrompt": "Type 1.00"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d11-b3-provisioned-concurrency",
        "day": 11,
        "blockNumber": 3,
        "title": "Provisioned Concurrency & Zero Cold Starts",
        "conceptBudget": {
          "primaryConcept": "Provisioned Concurrency",
          "supportingTerms": [
            "Pre-initialized execution environments",
            "Guaranteed sub-10ms response times for high-volume endpoints",
            "Eliminating cold start latency for critical APIs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d11-b2-lambda-memory-vcpu-scaling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "provisioned_demo.js",
            "initialCode": "function checkLatencySla(hasProvisionedConcurrency) {\n  return hasProvisionedConcurrency \n    ? { maxLatencyMs: 8, coldStartProbability: 0 }\n    : { maxLatencyMs: 250, coldStartProbability: 0.05 };\n}\n\nconsole.log('With Provisioned Concurrency:', JSON.stringify(checkLatencySla(true)));",
            "expectedOutput": "With Provisioned Concurrency: {\"maxLatencyMs\":8,\"coldStartProbability\":0}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does AWS Lambda Provisioned Concurrency guarantee zero cold start latency?",
          "options": [
            "It pre-warms and maintains a pool of initialized microVM execution environments ready to respond instantaneously to incoming requests",
            "It converts JavaScript to C++",
            "It keeps the developer's laptop running"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
              "errorExplanation": "Provisioned concurrency pre-initializes runtime environments to eliminate cold starts.",
              "recoveryPath": {
                "simplerExplanation": "Pre-warmed environments eliminate cold starts.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Amazon API Gateway V2 HTTP & Lambda Authorizers",
    "overviewMetaphor": "Amazon API Gateway is a bouncer at a private VIP club: incoming partygoers (HTTP requests) arrive at the door; the bouncer checks their ID card against a security scanner (Lambda Authorizer); if valid, the bouncer lets them inside directly to the kitchen (AWS Lambda / DynamoDB) without the kitchen ever needing to worry about SSL certificates or rate limiting.",
    "blocks": [
      {
        "id": "cloud-d12-b1-api-gateway-v2-http-apis",
        "day": 12,
        "blockNumber": 1,
        "title": "API Gateway V2 (HTTP APIs) vs REST APIs",
        "conceptBudget": {
          "primaryConcept": "API Gateway Architecture",
          "supportingTerms": [
            "HTTP APIs (70% cheaper, sub-10ms latency, native OIDC/JWT)",
            "REST APIs (Legacy features, API Keys, SOAP transformations)",
            "CORS & Request Throttling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d11-b1-lambda-execution-lifecycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "HTTP APIs vs REST APIs Comparison",
              "boxes": [
                {
                  "label": "HTTP APIs (V2)",
                  "value": "$1.00 / million requests -> Ultra-low latency, built-in JWT authorizers",
                  "varType": "Modern Serverless",
                  "isUpdated": false
                },
                {
                  "label": "REST APIs (V1)",
                  "value": "$3.50 / million requests -> Request transformation templates (VTL), WAF integration",
                  "varType": "Full Feature Tier",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gateway_cost_demo.js",
            "initialCode": "function compareGatewayCosts(millionRequests) {\n  return {\n    httpApiV2: `$${(millionRequests * 1.00).toFixed(2)}`,\n    restApiV1: `$${(millionRequests * 3.50).toFixed(2)}`,\n    savings: `$${(millionRequests * 2.50).toFixed(2)}`\n  };\n}\n\nconsole.log('100M Requests Comparison:', JSON.stringify(compareGatewayCosts(100)));",
            "expectedOutput": "100M Requests Comparison: {\"httpApiV2\":\"$100.00\",\"restApiV1\":\"$350.00\",\"savings\":\"$250.00\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the cost for 100 million requests on API Gateway HTTP API V2 ($1.00/million)?",
          "expectedStringOutput": "$100.00",
          "acceptableAnswers": [
            "$100.00",
            "100.00",
            "100"
          ],
          "primaryMisconceptionId": "MC_CLOUD_API_GATEWAY_THROTTLING_AUTHORIZER",
          "diagnosisMap": {
            "$350.00": {
              "misconceptionId": "MC_CLOUD_API_GATEWAY_THROTTLING_AUTHORIZER",
              "errorExplanation": "$350 is for REST API V1. HTTP API V2 is 70% cheaper ($100.00).",
              "recoveryPath": {
                "simplerExplanation": "HTTP API cost is $100.00.",
                "guidedFixPrompt": "Type $100.00"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d12-b2-lambda-authorizers-iam-policies",
        "day": 12,
        "blockNumber": 2,
        "title": "Custom Lambda Authorizers & IAM Policy Generation",
        "conceptBudget": {
          "primaryConcept": "Lambda Authorizers",
          "supportingTerms": [
            "Validating JWT Bearer Tokens in Header",
            "Returning IAM Policy (`execute-api:Invoke`)",
            "Caching authorizer decisions for 300 seconds"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d12-b1-api-gateway-v2-http-apis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Authorizer Policy Output",
            "codeSnippet": "function generateAuthResponse(principalId, effect, methodArn) {\n  return {\n    principalId,\n    policyDocument: {\n      Version: '2012-10-17',\n      Statement: [{\n        Action: 'execute-api:Invoke',\n        Effect: effect,\n        Resource: methodArn\n      }]\n    }\n  };\n}",
            "lineNotes": {
              "2": "Sets principal identity attached to request context.",
              "7": "Allows or denies invocation of downstream route."
            }
          },
          {
            "type": "runnable_code",
            "filename": "authorizer_demo.js",
            "initialCode": "function authorizeRequest(token) {\n  if (token === 'Bearer valid_jwt_token') {\n    return { isAuthorized: true, principalId: 'user_42' };\n  }\n  return { isAuthorized: false, principalId: 'anonymous' };\n}\n\nconsole.log('Valid Token:', JSON.stringify(authorizeRequest('Bearer valid_jwt_token')));\nconsole.log('Invalid Token:', JSON.stringify(authorizeRequest('Bearer expired')));",
            "expectedOutput": "Valid Token: {\"isAuthorized\":true,\"principalId\":\"user_42\"}\nInvalid Token: {\"isAuthorized\":false,\"principalId\":\"anonymous\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the `isAuthorized` boolean for an invalid or expired token?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False"
          ],
          "primaryMisconceptionId": "MC_CLOUD_API_GATEWAY_THROTTLING_AUTHORIZER",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_CLOUD_API_GATEWAY_THROTTLING_AUTHORIZER",
              "errorExplanation": "Invalid tokens fail authorization and return isAuthorized: false.",
              "recoveryPath": {
                "simplerExplanation": "Invalid token returns false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d12-b3-throttling-token-bucket-gateway",
        "day": 12,
        "blockNumber": 3,
        "title": "API Gateway Throttling & Usage Plans",
        "conceptBudget": {
          "primaryConcept": "Gateway Throttling",
          "supportingTerms": [
            "Rate (Requests/sec)",
            "Burst Capacity (Token Bucket limit)",
            "HTTP 429 Too Many Requests"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d12-b2-lambda-authorizers-iam-policies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gw_throttle_demo.js",
            "initialCode": "function evaluateGatewayRate(reqCount, burstLimit = 100) {\n  if (reqCount > burstLimit) return { status: 429, error: 'Too Many Requests' };\n  return { status: 200, message: 'OK' };\n}\n\nconsole.log('50 Requests:', evaluateGatewayRate(50).status);\nconsole.log('150 Requests (Surge):', evaluateGatewayRate(150).status);",
            "expectedOutput": "50 Requests: 200\n150 Requests (Surge): 429",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What HTTP status code is returned when a client exceeds the API Gateway burst limit?",
          "expectedStringOutput": "429",
          "acceptableAnswers": [
            "429",
            "HTTP 429",
            "429 Too Many Requests"
          ],
          "primaryMisconceptionId": "MC_CLOUD_API_GATEWAY_THROTTLING_AUTHORIZER",
          "diagnosisMap": {
            "500": {
              "misconceptionId": "MC_CLOUD_API_GATEWAY_THROTTLING_AUTHORIZER",
              "errorExplanation": "Rate limit / throttling violations return HTTP 429 Too Many Requests.",
              "recoveryPath": {
                "simplerExplanation": "Throttling = 429.",
                "guidedFixPrompt": "Type 429"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Amazon DynamoDB Partition Keys & Global Secondary Indexes (GSI)",
    "overviewMetaphor": "DynamoDB is a massive library with 1,000 librarians standing in a row: the Partition Key (`PK: 'USER#101'`) is the librarian's exact badge number; when you ask for user 101, DynamoDB hashes the key and walks straight to Librarian #42 in 2 milliseconds (O(1) lookup whether your table has 100 rows or 10 billion rows); Global Secondary Indexes (GSIs) allow you to hire a second set of librarians indexed by email address.",
    "blocks": [
      {
        "id": "cloud-d13-b1-partition-key-hashing",
        "day": 13,
        "blockNumber": 1,
        "title": "Partition Key Hashing & Predictable Single-Digit Millisecond Latency",
        "conceptBudget": {
          "primaryConcept": "DynamoDB Partition Key",
          "supportingTerms": [
            "Partition Key (PK: Hash Key determining physical partition storage)",
            "Sort Key (SK: Range Key for 1-to-many items)",
            "Consistent O(1) hashing regardless of table size"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b1-service-models-pyramid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Composite Primary Key (PK + SK)",
              "boxes": [
                {
                  "label": "Partition Key (PK)",
                  "value": "\"CUSTOMER#9981\" (Determines physical storage node)",
                  "varType": "Hash Key",
                  "isUpdated": false
                },
                {
                  "label": "Sort Key (SK)",
                  "value": "\"ORDER#2026#004\" (Sorted B-Tree index within partition)",
                  "varType": "Range Key",
                  "isUpdated": false
                },
                {
                  "label": "Attributes",
                  "value": "{ amount: 249.99, status: \"SHIPPED\" }",
                  "varType": "Item Data",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dynamo_hash_demo.js",
            "initialCode": "function getPartitionId(pk, totalPartitions = 8) {\n  let hash = 0;\n  for (let i = 0; i < pk.length; i++) hash = (hash * 31 + pk.charCodeAt(i)) >>> 0;\n  return hash % totalPartitions;\n}\n\nconsole.log('User 101 Partition Node:', getPartitionId('USER#101'));\nconsole.log('User 102 Partition Node:', getPartitionId('USER#102'));",
            "expectedOutput": "User 101 Partition Node: 4\nUser 102 Partition Node: 5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does an Amazon DynamoDB Key-Value lookup take ~2ms whether the table contains 1,000 items or 10 billion items?",
          "options": [
            "Because DynamoDB computes an instant mathematical hash of the Partition Key to locate the exact storage node in O(1) time without scanning any other rows",
            "Because DynamoDB loads all 10 billion rows into RAM",
            "Because tables cannot hold more than 1,000 items"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_DYNAMODB_PARTITION_KEY_HOTSPOTTING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_DYNAMODB_PARTITION_KEY_HOTSPOTTING",
              "errorExplanation": "Partition hashing gives DynamoDB its constant O(1) performance scale.",
              "recoveryPath": {
                "simplerExplanation": "Partition Key hashing enables O(1) instant lookups.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "cloud-d13-b2-hot-partition-anti-pattern",
        "day": 13,
        "blockNumber": 2,
        "title": "The Hot Partition Anti-Pattern & Write Sharding",
        "conceptBudget": {
          "primaryConcept": "Hot Partition Prevention",
          "supportingTerms": [
            "Hot Partitions (Overwhelming a single physical partition beyond 1,000 WCU)",
            "Write Sharding (Appending random suffix `PK#1..N`)",
            "High Cardinality Keys"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d13-b1-partition-key-hashing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Hot Partition Anti-Pattern Diff",
              "brokenCode": "// ❌ ANTI-PATTERN: Low-cardinality date as Partition Key\n// PK: \"2026-08-24\" -> 100,000 users write to the SAME partition node -> THROTTLED (HTTP 400)!",
              "fixedCode": "// ✅ BEST PRACTICE: Sharded high-cardinality Partition Key\n// PK: `2026-08-24#${userId}` -> Distributed evenly across 1,000 physical partitions!",
              "errorLine": 2,
              "errorReason": "Using a single static date bottlenecks all writes onto a single 1,000 WCU partition limit.",
              "fixExplanation": "Sharding the key evenly balances traffic across the entire cluster."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sharded_pk_demo.js",
            "initialCode": "function createShardedPartitionKey(dateStr, shardCount = 10) {\n  const randomShard = Math.floor(Math.random() * shardCount);\n  return `${dateStr}#shard_${randomShard}`;\n}\n\nconsole.log('Sharded Key Sample:', createShardedPartitionKey('2026-08-24', 5).startsWith('2026-08-24#shard_'));",
            "expectedOutput": "Sharded Key Sample: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is using `status: 'ACTIVE'` as a Partition Key dangerous in a DynamoDB table with 10 million active users?",
          "options": [
            "Because all 10 million active users would hash to the exact same physical partition node, creating a massive Hot Partition that throttles database writes and crashes the application",
            "Because DynamoDB does not allow strings",
            "Because status is a reserved keyword"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_DYNAMODB_PARTITION_KEY_HOTSPOTTING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_DYNAMODB_PARTITION_KEY_HOTSPOTTING",
              "errorExplanation": "Low cardinality partition keys cause hot partition throttling.",
              "recoveryPath": {
                "simplerExplanation": "Low cardinality keys bottleneck single partition nodes.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "cloud-d13-b3-global-secondary-indexes-gsi",
        "day": 13,
        "blockNumber": 3,
        "title": "Global Secondary Indexes (GSI) & Sparse Projections",
        "conceptBudget": {
          "primaryConcept": "Global Secondary Indexes (GSI)",
          "supportingTerms": [
            "Alternate Partition Key and Sort Key",
            "Asynchronous Replication from Base Table",
            "Sparse Indexes (Indexing only items containing the GSI key)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d13-b2-hot-partition-anti-pattern",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gsi_demo.js",
            "initialCode": "function queryByGsi(items, email) {\n  return items.filter(item => item.GSI1PK === `EMAIL#${email}`);\n}\n\nconst db = [\n  { PK: 'USER#1', SK: 'METADATA', GSI1PK: 'EMAIL#alex@pinit.io', name: 'Alex' },\n  { PK: 'USER#2', SK: 'METADATA', GSI1PK: 'EMAIL#sam@pinit.io', name: 'Sam' }\n];\nconsole.log('Lookup by GSI Email:', queryByGsi(db, 'alex@pinit.io')[0].name);",
            "expectedOutput": "Lookup by GSI Email: Alex",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What user name is retrieved when querying the GSI by `EMAIL#alex@pinit.io`?",
          "expectedStringOutput": "Alex",
          "acceptableAnswers": [
            "Alex",
            "Lookup by GSI Email: Alex"
          ],
          "primaryMisconceptionId": "MC_CLOUD_DYNAMODB_PARTITION_KEY_HOTSPOTTING",
          "diagnosisMap": {
            "Sam": {
              "misconceptionId": "MC_CLOUD_DYNAMODB_PARTITION_KEY_HOTSPOTTING",
              "errorExplanation": "The email alex@pinit.io belongs to Alex.",
              "recoveryPath": {
                "simplerExplanation": "Matches user Alex.",
                "guidedFixPrompt": "Type Alex"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Amazon RDS Multi-AZ High Availability & Read Replicas",
    "overviewMetaphor": "RDS Multi-AZ vs Read Replicas is a bank ledger system: Multi-AZ is a carbon-copy synchronized ledger kept inside a backup vault across the street (Synchronous replication: if the main bank catches fire, the backup vault takes over in 60s with 0 lost transactions); Read Replicas are 5 photocopying assistants in the lobby handing out account balance printouts to customers (Asynchronous replication: offloads read queries from the primary teller).",
    "blocks": [
      {
        "id": "cloud-d14-b1-multi-az-vs-read-replica",
        "day": 14,
        "blockNumber": 1,
        "title": "Multi-AZ Synchronous Standby vs Asynchronous Read Replicas",
        "conceptBudget": {
          "primaryConcept": "RDS High Availability Architecture",
          "supportingTerms": [
            "Multi-AZ (Synchronous replication, Automated Failover, Disaster Recovery)",
            "Read Replicas (Asynchronous replication, Read Scaling up to 15 replicas)",
            "Aurora Multi-Master & Global Database"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d2-b1-regions-vs-azs-topology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "RDS Multi-AZ vs Read Replica Matrix",
              "boxes": [
                {
                  "label": "RDS Multi-AZ",
                  "value": "Synchronous standby in 2nd AZ -> Automatic 60s failover, CANNOT be queried directly",
                  "varType": "High Availability",
                  "isUpdated": false
                },
                {
                  "label": "RDS Read Replica",
                  "value": "Asynchronous read copies (up to 15) -> CAN be queried directly to offload reads",
                  "varType": "Read Scalability",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rds_matrix_demo.js",
            "initialCode": "function evaluateRdsFeature(needsDisasterFailover, needsReadOffload) {\n  if (needsDisasterFailover && !needsReadOffload) return 'RDS_MULTI_AZ_STANDBY';\n  if (needsReadOffload) return 'RDS_READ_REPLICAS';\n  return 'SINGLE_AZ_DEV';\n}\n\nconsole.log('Mission-Critical Banking DB:', evaluateRdsFeature(true, false));\nconsole.log('Heavy Analytics Read Dashboard:', evaluateRdsFeature(false, true));",
            "expectedOutput": "Mission-Critical Banking DB: RDS_MULTI_AZ_STANDBY\nHeavy Analytics Read Dashboard: RDS_READ_REPLICAS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can applications directly connect to and run SQL SELECT queries against the standby instance in an Amazon RDS Multi-AZ deployment?",
          "options": [
            "No, the standby Multi-AZ instance is strictly passive for disaster failover; to scale read queries, you must provision Read Replicas",
            "Yes, Multi-AZ standby instances accept all read queries",
            "Only on Tuesdays"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_RDS_MULTI_AZ_VS_READ_REPLICA",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_RDS_MULTI_AZ_VS_READ_REPLICA",
              "errorExplanation": "The Multi-AZ standby is a passive replication target and cannot serve client queries until failover occurs.",
              "recoveryPath": {
                "simplerExplanation": "Multi-AZ standby cannot be queried directly; use Read Replicas for reads.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "cloud-d14-b2-automated-failover-dns-cname",
        "day": 14,
        "blockNumber": 2,
        "title": "Automated Failover & DNS CNAME Switching",
        "conceptBudget": {
          "primaryConcept": "RDS Automated Failover",
          "supportingTerms": [
            "Automatic DNS endpoint cutover (~60-120 seconds)",
            "Zero IP address changes required in application code",
            "Preserving transaction integrity"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d14-b1-multi-az-vs-read-replica",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "RDS Multi-AZ Failover Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Primary DB in AZ-a experiences hardware failure",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "AWS RDS monitors detect heartbeat loss & promote Standby DB in AZ-b to Primary",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "RDS updates internal DNS CNAME (mydb.rds.amazonaws.com) to point to AZ-b IP in 60s",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rds_failover_demo.js",
            "initialCode": "class RdsCluster {\n  constructor() {\n    this.endpoint = 'mydb.pinit.rds.amazonaws.com';\n    this.primaryAz = 'us-east-1a';\n    this.standbyAz = 'us-east-1b';\n  }\n  failover() {\n    const temp = this.primaryAz;\n    this.primaryAz = this.standbyAz;\n    this.standbyAz = temp;\n    return { newPrimary: this.primaryAz, endpointRemainsUnchanged: this.endpoint };\n  }\n}\n\nconst cluster = new RdsCluster();\nconsole.log('After Failover:', JSON.stringify(cluster.failover()));",
            "expectedOutput": "After Failover: {\"newPrimary\":\"us-east-1b\",\"endpointRemainsUnchanged\":\"mydb.pinit.rds.amazonaws.com\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Does the RDS database connection endpoint string change after a Multi-AZ failover?",
          "expectedStringOutput": "mydb.pinit.rds.amazonaws.com",
          "acceptableAnswers": [
            "mydb.pinit.rds.amazonaws.com",
            "unchanged",
            "No"
          ],
          "primaryMisconceptionId": "MC_CLOUD_RDS_MULTI_AZ_VS_READ_REPLICA",
          "diagnosisMap": {
            "changed": {
              "misconceptionId": "MC_CLOUD_RDS_MULTI_AZ_VS_READ_REPLICA",
              "errorExplanation": "RDS updates the underlying DNS CNAME record, keeping the connection endpoint string identical.",
              "recoveryPath": {
                "simplerExplanation": "Endpoint string stays unchanged.",
                "guidedFixPrompt": "Type mydb.pinit.rds.amazonaws.com"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d14-b3-replication-lag-read-replicas",
        "day": 14,
        "blockNumber": 3,
        "title": "Asynchronous Replication Lag in Read Replicas",
        "conceptBudget": {
          "primaryConcept": "Replication Lag",
          "supportingTerms": [
            "Asynchronous binlog replication",
            "Replication lag metric (`ReplicaLag` in seconds)",
            "Eventual consistency for read queries"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d14-b2-automated-failover-dns-cname",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rep_lag_demo.js",
            "initialCode": "function checkReplicationLag(lagSeconds, maxToleratedLag = 5) {\n  return lagSeconds > maxToleratedLag ? 'STALE_READ_RISK_ROUTE_TO_PRIMARY' : 'REPLICA_SAFE';\n}\n\nconsole.log('0.2s Lag:', checkReplicationLag(0.2));\nconsole.log('18.0s Lag (Network spike):', checkReplicationLag(18.0));",
            "expectedOutput": "0.2s Lag: REPLICA_SAFE\n18.0s Lag (Network spike): STALE_READ_RISK_ROUTE_TO_PRIMARY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What route decision is made when replica lag reaches 18 seconds?",
          "expectedStringOutput": "STALE_READ_RISK_ROUTE_TO_PRIMARY",
          "acceptableAnswers": [
            "STALE_READ_RISK_ROUTE_TO_PRIMARY",
            "18.0s Lag (Network spike): STALE_READ_RISK_ROUTE_TO_PRIMARY"
          ],
          "primaryMisconceptionId": "MC_CLOUD_RDS_MULTI_AZ_VS_READ_REPLICA",
          "diagnosisMap": {
            "REPLICA_SAFE": {
              "misconceptionId": "MC_CLOUD_RDS_MULTI_AZ_VS_READ_REPLICA",
              "errorExplanation": "18s lag exceeds the 5s threshold and risks serving stale data.",
              "recoveryPath": {
                "simplerExplanation": "High lag triggers STALE_READ_RISK_ROUTE_TO_PRIMARY.",
                "guidedFixPrompt": "Type STALE_READ_RISK_ROUTE_TO_PRIMARY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine",
    "overviewMetaphor": "Milestone 2 — The Serverless Event Assembly Line: A user drops a raw video into Amazon S3 (Upload Trigger); S3 emits an EventBridge event that wakes up AWS Lambda in 20ms; Lambda orchestrates AWS MediaConvert transcoding across 3 resolutions (1080p, 720p, 480p) and saves metadata into Amazon DynamoDB with 0 servers to patch or maintain.",
    "blocks": [
      {
        "id": "cloud-d15-b1-serverless-pipeline-flow",
        "day": 15,
        "blockNumber": 1,
        "title": "Serverless Event Pipeline Architecture",
        "conceptBudget": {
          "primaryConcept": "Serverless Event Architecture",
          "supportingTerms": [
            "S3 `s3:ObjectCreated:*` trigger",
            "EventBridge routing rule",
            "Lambda async processing",
            "DynamoDB metadata persistence"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d11-b1-lambda-execution-lifecycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Serverless Video Pipeline Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. User uploads video.mp4 -> S3 Bucket (raw-videos)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. S3 fires ObjectCreated Event -> EventBridge Event Bus",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. EventBridge triggers AWS Lambda Ingest Function",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Lambda writes initial record to DynamoDB & triggers Video Transcoder",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pipeline_sim.js",
            "initialCode": "async function runVideoPipeline(event) {\n  const s3Record = event.Records[0].s3;\n  const bucket = s3Record.bucket.name;\n  const key = s3Record.object.key;\n  return {\n    pipelineState: 'PROCESSED',\n    videoKey: key,\n    dynamoItem: { PK: `VIDEO#${key}`, status: 'READY', bucket }\n  };\n}\n\nconst mockS3Event = { Records: [{ s3: { bucket: { name: 'pinit-raw-vids' }, object: { key: 'keynote.mp4' } } }] };\nrunVideoPipeline(mockS3Event).then(res => {\n  console.log('Pipeline Output Status:', res.pipelineState);\n  console.log('DynamoDB Key:', res.dynamoItem.PK);\n});",
            "expectedOutput": "Pipeline Output Status: PROCESSED\nDynamoDB Key: VIDEO#keynote.mp4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What DynamoDB Partition Key (PK) is generated for object `keynote.mp4`?",
          "expectedStringOutput": "VIDEO#keynote.mp4",
          "acceptableAnswers": [
            "VIDEO#keynote.mp4",
            "DynamoDB Key: VIDEO#keynote.mp4"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
          "diagnosisMap": {
            "keynote.mp4": {
              "misconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
              "errorExplanation": "The pipeline prefixes the key with VIDEO# for DynamoDB single-table design.",
              "recoveryPath": {
                "simplerExplanation": "Key is VIDEO#keynote.mp4.",
                "guidedFixPrompt": "Type VIDEO#keynote.mp4"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d15-b2-idempotent-lambda-processing",
        "day": 15,
        "blockNumber": 2,
        "title": "Idempotent Event Processing & Deduplication",
        "conceptBudget": {
          "primaryConcept": "Idempotent Serverless Processing",
          "supportingTerms": [
            "Preventing duplicate transcode jobs on S3 retry events",
            "Checking DynamoDB transaction condition before processing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d15-b1-serverless-pipeline-flow",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dedup_demo.js",
            "initialCode": "const processedKeys = new Set();\nfunction processUploadIdempotent(videoKey) {\n  if (processedKeys.has(videoKey)) return { action: 'DUPLICATE_EVENT_IGNORED' };\n  processedKeys.add(videoKey);\n  return { action: 'TRANSCODE_JOB_QUEUED' };\n}\n\nconsole.log('1st S3 Event:', processUploadIdempotent('clip_1.mp4').action);\nconsole.log('Duplicate Retry Event:', processUploadIdempotent('clip_1.mp4').action);",
            "expectedOutput": "1st S3 Event: TRANSCODE_JOB_QUEUED\nDuplicate Retry Event: DUPLICATE_EVENT_IGNORED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is returned when receiving a duplicate S3 event for `clip_1.mp4`?",
          "expectedStringOutput": "DUPLICATE_EVENT_IGNORED",
          "acceptableAnswers": [
            "DUPLICATE_EVENT_IGNORED",
            "Duplicate Retry Event: DUPLICATE_EVENT_IGNORED"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
          "diagnosisMap": {
            "TRANSCODE_JOB_QUEUED": {
              "misconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
              "errorExplanation": "Duplicate events are ignored to prevent re-transcoding and duplicate charges.",
              "recoveryPath": {
                "simplerExplanation": "Duplicate is ignored -> DUPLICATE_EVENT_IGNORED.",
                "guidedFixPrompt": "Type DUPLICATE_EVENT_IGNORED"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d15-b3-milestone2-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Serverless Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Serverless Milestone Certification",
          "supportingTerms": [
            "Serverless Event Architecture Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d15-b2-idempotent-lambda-processing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CLOUD_SERVERLESS_LAMBDA_COLD_START_MEMORY",
              "errorExplanation": "Returns ⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Matches milestone header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Amazon CloudFront Global CDN & Edge Functions (Lambda@Edge)",
    "overviewMetaphor": "CloudFront CDN is a neighborhood convenience store: instead of ordering milk and bread from a farm in Wisconsin every morning (150ms round-trip to origin S3 bucket), the local corner store in your neighborhood (Edge Location) keeps fresh stock on the shelf; you walk over and grab what you need in 5ms; CloudFront Functions are tiny cashiers modifying the receipt on-the-fly at the register.",
    "blocks": [
      {
        "id": "cloud-d16-b1-cloudfront-cache-behaviors",
        "day": 16,
        "blockNumber": 1,
        "title": "CloudFront Cache Behaviors, TTLs & Origins",
        "conceptBudget": {
          "primaryConcept": "CloudFront CDN Caching",
          "supportingTerms": [
            "Origin (S3 Bucket vs Custom HTTP ALB)",
            "Cache Behaviors (`/images/*` -> Max TTL 30 days, `/api/*` -> 0 TTL bypass)",
            "CloudFront Origin Shield"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d2-b2-edge-locations-cloudfront-pop",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CloudFront Path-Based Cache Behaviors",
              "boxes": [
                {
                  "label": "Path: /static/*",
                  "value": "Origin: S3 Bucket -> Cache Policy: Managed-CachingOptimized (TTL 86400s)",
                  "varType": "Static Asset Cache",
                  "isUpdated": false
                },
                {
                  "label": "Path: /api/*",
                  "value": "Origin: Application Load Balancer -> Cache Policy: Managed-CachingDisabled (TTL 0s)",
                  "varType": "Dynamic API Pass-through",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cache_behavior_demo.js",
            "initialCode": "function resolveEdgeCache(path) {\n  if (path.startsWith('/static/')) return { ttlSec: 86400, action: 'EDGE_CACHE_SERVE' };\n  if (path.startsWith('/api/')) return { ttlSec: 0, action: 'ORIGIN_PASSTHROUGH' };\n  return { ttlSec: 3600, action: 'DEFAULT_CACHE' };\n}\n\nconsole.log('Static Image Request:', resolveEdgeCache('/static/logo.png').action);\nconsole.log('Dynamic API Request:', resolveEdgeCache('/api/v1/checkout').action);",
            "expectedOutput": "Static Image Request: EDGE_CACHE_SERVE\nDynamic API Request: ORIGIN_PASSTHROUGH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken for dynamic `/api/v1/checkout` requests under caching best practices?",
          "expectedStringOutput": "ORIGIN_PASSTHROUGH",
          "acceptableAnswers": [
            "ORIGIN_PASSTHROUGH",
            "Dynamic API Request: ORIGIN_PASSTHROUGH"
          ],
          "primaryMisconceptionId": "MC_CLOUD_CLOUDFRONT_EDGE_CACHING_INVALIDATION",
          "diagnosisMap": {
            "EDGE_CACHE_SERVE": {
              "misconceptionId": "MC_CLOUD_CLOUDFRONT_EDGE_CACHING_INVALIDATION",
              "errorExplanation": "Dynamic checkout APIs must bypass cache (ORIGIN_PASSTHROUGH) to prevent stale checkout state.",
              "recoveryPath": {
                "simplerExplanation": "API routes pass through to origin.",
                "guidedFixPrompt": "Type ORIGIN_PASSTHROUGH"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d16-b2-cache-invalidation-api",
        "day": 16,
        "blockNumber": 2,
        "title": "Cache Invalidations (`/*` vs Path-Specific)",
        "conceptBudget": {
          "primaryConcept": "Cache Invalidation",
          "supportingTerms": [
            "Creating invalidation requests (`/index.html`, `/assets/*`)",
            "Invalidation propagation time (~10-30 seconds across 300+ Edge locations)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d16-b1-cloudfront-cache-behaviors",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "AWS CLI Invalidation Command",
            "codeSnippet": "aws cloudfront create-invalidation \\\n  --distribution-id E123456789EXAMPLE \\\n  --paths \"/index.html\" \"/version.json\"",
            "lineNotes": {
              "2": "Target CloudFront Distribution ID.",
              "3": "Specific paths to evict instantly without purging all 100,000 images."
            }
          },
          {
            "type": "runnable_code",
            "filename": "invalidation_sim.js",
            "initialCode": "class EdgeCacheMock {\n  constructor() { this.cache = new Map([['/index.html', 'v1_html'], ['/logo.png', 'v1_img']]); }\n  invalidate(path) {\n    if (path === '/*') { this.cache.clear(); return; }\n    this.cache.delete(path);\n  }\n}\n\nconst edge = new EdgeCacheMock();\nedge.invalidate('/index.html');\nconsole.log('Is /index.html evicted?:', !edge.cache.has('/index.html'));\nconsole.log('Is /logo.png preserved?:', edge.cache.has('/logo.png'));",
            "expectedOutput": "Is /index.html evicted?: true\nIs /logo.png preserved?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is `/logo.png` preserved in cache when invalidating only `/index.html`?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Is /logo.png preserved?: true"
          ],
          "primaryMisconceptionId": "MC_CLOUD_CLOUDFRONT_EDGE_CACHING_INVALIDATION",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_CLOUD_CLOUDFRONT_EDGE_CACHING_INVALIDATION",
              "errorExplanation": "Specific path invalidations evict only the targeted file, preserving unrelated cached assets.",
              "recoveryPath": {
                "simplerExplanation": "Unrelated paths remain cached -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d16-b3-cloudfront-functions-vs-lambda-edge",
        "day": 16,
        "blockNumber": 3,
        "title": "CloudFront Functions vs Lambda@Edge",
        "conceptBudget": {
          "primaryConcept": "Edge Compute Models",
          "supportingTerms": [
            "CloudFront Functions (Sub-millisecond, pure JS, < 10KB, viewer request/response header rewrites)",
            "Lambda@Edge (Full Node.js/Python, up to 10s execution, origin request/response processing)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d16-b2-cache-invalidation-api",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "edge_fn_picker.js",
            "initialCode": "function pickEdgeCompute(needsNetworkAccess, executionTimeMs) {\n  return (needsNetworkAccess || executionTimeMs > 1)\n    ? 'Lambda@Edge (Complex compute, network calls)'\n    : 'CloudFront Functions (Ultra-fast <1ms header rewrites)';\n}\n\nconsole.log('Simple URL /index.html rewrite:', pickEdgeCompute(false, 0.2));\nconsole.log('Dynamic A/B testing with database query:', pickEdgeCompute(true, 50));",
            "expectedOutput": "Simple URL /index.html rewrite: CloudFront Functions (Ultra-fast <1ms header rewrites)\nDynamic A/B testing with database query: Lambda@Edge (Complex compute, network calls)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When should you use CloudFront Functions instead of Lambda@Edge?",
          "options": [
            "For lightweight URL rewrites, HTTP header normalization, and redirects requiring sub-millisecond execution with zero network access",
            "When you need to run heavy database queries",
            "When you want to train AI models at the edge"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_CLOUDFRONT_EDGE_CACHING_INVALIDATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_CLOUDFRONT_EDGE_CACHING_INVALIDATION",
              "errorExplanation": "CloudFront Functions execute in <1ms for lightweight header manipulations.",
              "recoveryPath": {
                "simplerExplanation": "Sub-millisecond header rewrites = CloudFront Functions.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Amazon Route 53 DNS Routing Policies & Health Checks",
    "overviewMetaphor": "Route 53 DNS is a global GPS navigation system: Simple Routing gives one direct coordinate; Weighted Routing splits highway traffic (80% to highway A, 20% to highway B); Latency-Based Routing guides drivers to the closest regional exit in 10ms; Failover Routing automatically shifts traffic to a detour route if the main bridge is closed for repairs.",
    "blocks": [
      {
        "id": "cloud-d17-b1-dns-routing-policies-suite",
        "day": 17,
        "blockNumber": 1,
        "title": "Route 53 Routing Policies: Simple, Weighted, Latency & Geo",
        "conceptBudget": {
          "primaryConcept": "Route 53 Routing Policies",
          "supportingTerms": [
            "Simple Routing",
            "Weighted Routing (A/B testing & blue-green canary)",
            "Latency-Based Routing (Routing to region with lowest ping)",
            "Geolocation Routing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d2-b1-regions-vs-azs-topology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Route 53 Policy Matrix",
              "boxes": [
                {
                  "label": "Weighted Routing",
                  "value": "Splits traffic by percentage (e.g. 90% Production, 10% Canary)",
                  "varType": "Traffic Control",
                  "isUpdated": false
                },
                {
                  "label": "Latency-Based",
                  "value": "Routes user to region with lowest network round-trip time",
                  "varType": "Performance",
                  "isUpdated": false
                },
                {
                  "label": "Failover",
                  "value": "Active-Passive: Routes to Secondary only when Primary health probe fails",
                  "varType": "Disaster Recovery",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "route53_demo.js",
            "initialCode": "function resolveWeighted(weights, randomVal = 0.5) {\n  let cumulative = 0;\n  for (const w of weights) {\n    cumulative += w.weight;\n    if (randomVal <= cumulative) return w.target;\n  }\n  return weights[weights.length - 1].target;\n}\n\nconst weights = [{ target: 'prod_v1', weight: 0.8 }, { target: 'canary_v2', weight: 0.2 }];\nconsole.log('Request at 0.5 (under 0.8):', resolveWeighted(weights, 0.5));\nconsole.log('Request at 0.9 (above 0.8):', resolveWeighted(weights, 0.9));",
            "expectedOutput": "Request at 0.5 (under 0.8): prod_v1\nRequest at 0.9 (above 0.8): canary_v2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which target receives the request when the random value is 0.9 (within the top 20% canary weight)?",
          "expectedStringOutput": "canary_v2",
          "acceptableAnswers": [
            "canary_v2",
            "Request at 0.9 (above 0.8): canary_v2"
          ],
          "primaryMisconceptionId": "MC_CLOUD_ROUTE53_FAILOVER_WEIGHTED_ROUTING",
          "diagnosisMap": {
            "prod_v1": {
              "misconceptionId": "MC_CLOUD_ROUTE53_FAILOVER_WEIGHTED_ROUTING",
              "errorExplanation": "0.9 exceeds the 0.8 threshold and routes to canary_v2.",
              "recoveryPath": {
                "simplerExplanation": "Routes to canary_v2.",
                "guidedFixPrompt": "Type canary_v2"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d17-b2-route53-health-checks-failover",
        "day": 17,
        "blockNumber": 2,
        "title": "Active-Passive Failover Routing & Automated DNS Healing",
        "conceptBudget": {
          "primaryConcept": "Active-Passive Failover",
          "supportingTerms": [
            "Primary record linked to Route 53 Health Check",
            "Automated DNS failover within ~30-60 seconds",
            "Secondary standby endpoint"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d17-b1-dns-routing-policies-suite",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Failover Record Definition",
            "codeSnippet": "// Primary Record (Linked to Health Check)\nconst primaryRecord = { name: 'api.pinit.io', type: 'A', setIdentifier: 'Primary-US-East', failover: 'PRIMARY', healthCheckId: 'hc-123' };\n\n// Secondary Record (Disaster Recovery Standby)\nconst secondaryRecord = { name: 'api.pinit.io', type: 'A', setIdentifier: 'Secondary-EU-West', failover: 'SECONDARY' };",
            "lineNotes": {
              "2": "Primary endpoint served during normal healthy operations.",
              "5": "Secondary endpoint activated automatically if health check hc-123 fails."
            }
          },
          {
            "type": "runnable_code",
            "filename": "failover_sim.js",
            "initialCode": "function resolveFailover(isPrimaryHealthy, primaryIp = '52.1.1.1', secondaryIp = '34.2.2.2') {\n  return isPrimaryHealthy ? { routedIp: primaryIp, mode: 'PRIMARY_ACTIVE' } : { routedIp: secondaryIp, mode: 'FAILOVER_DISASTER_ACTIVE' };\n}\n\nconsole.log('Healthy State:', resolveFailover(true).mode);\nconsole.log('Outage State:', resolveFailover(false).mode);",
            "expectedOutput": "Healthy State: PRIMARY_ACTIVE\nOutage State: FAILOVER_DISASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What mode is activated when the primary endpoint health check fails?",
          "expectedStringOutput": "FAILOVER_DISASTER_ACTIVE",
          "acceptableAnswers": [
            "FAILOVER_DISASTER_ACTIVE",
            "Outage State: FAILOVER_DISASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_CLOUD_ROUTE53_FAILOVER_WEIGHTED_ROUTING",
          "diagnosisMap": {
            "PRIMARY_ACTIVE": {
              "misconceptionId": "MC_CLOUD_ROUTE53_FAILOVER_WEIGHTED_ROUTING",
              "errorExplanation": "When primary fails, Route 53 shifts traffic to FAILOVER_DISASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Unhealthy primary shifts to FAILOVER_DISASTER_ACTIVE.",
                "guidedFixPrompt": "Type FAILOVER_DISASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d17-b3-alias-vs-cname-records",
        "day": 17,
        "blockNumber": 3,
        "title": "Route 53 Alias Records vs Standard DNS CNAME Records",
        "conceptBudget": {
          "primaryConcept": "Alias Records",
          "supportingTerms": [
            "Alias Records (AWS proprietary DNS pointer recognizing IP changes of AWS resources)",
            "Apex / Zone Apex Domain (`example.com` vs `www.example.com`)",
            "Free internal query resolution"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d17-b2-route53-health-checks-failover",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "alias_demo.js",
            "initialCode": "function canMapApexDomain(recordType) {\n  return recordType === 'ALIAS'; // Standard DNS RFC forbids CNAME on Zone Apex!\n}\n\nconsole.log('Can map pinit.io (Apex) with CNAME?:', canMapApexDomain('CNAME'));\nconsole.log('Can map pinit.io (Apex) with ALIAS?:', canMapApexDomain('ALIAS'));",
            "expectedOutput": "Can map pinit.io (Apex) with CNAME?: false\nCan map pinit.io (Apex) with ALIAS?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does AWS provide Route 53 Alias Records instead of relying only on standard CNAME records?",
          "options": [
            "Because DNS standards forbid CNAME records on Zone Apex root domains (e.g. pinit.io), whereas Route 53 Alias records can point root domains directly to ALBs and CloudFront distributions with zero query costs",
            "Because CNAME records cannot connect to the internet",
            "Because Alias records are written in Python"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_ROUTE53_FAILOVER_WEIGHTED_ROUTING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_ROUTE53_FAILOVER_WEIGHTED_ROUTING",
              "errorExplanation": "Alias records solve the Zone Apex CNAME limitation and dynamically update as AWS resource IPs change.",
              "recoveryPath": {
                "simplerExplanation": "Alias records allow Zone Apex root domain mapping.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Amazon SQS: Standard vs FIFO Queues & Visibility Timeouts",
    "overviewMetaphor": "Amazon SQS is an order intake conveyor belt: a worker picks up a box from the belt to process it; the box temporarily turns invisible to all other workers for 30 seconds (Visibility Timeout); if the worker finishes the job and stamps it complete (`DeleteMessage`), the box disappears forever; if the worker crashes before stamping it, the 30s timer expires and the box becomes visible on the belt again for another worker to grab.",
    "blocks": [
      {
        "id": "cloud-d18-b1-standard-vs-fifo-queues",
        "day": 18,
        "blockNumber": 1,
        "title": "SQS Standard vs SQS FIFO Delivery Guarantees",
        "conceptBudget": {
          "primaryConcept": "SQS Queue Models",
          "supportingTerms": [
            "Standard Queues (Nearly unlimited throughput, At-Least-Once delivery, Best-Effort ordering)",
            "FIFO Queues (Strict First-In-First-Out, Exactly-Once processing via `MessageDeduplicationId`, 300 msg/sec limit)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b1-service-models-pyramid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SQS Standard vs FIFO Matrix",
              "boxes": [
                {
                  "label": "Standard Queue",
                  "value": "Unlimited TPS -> At-Least-Once delivery (Duplicates possible!), Best-Effort order",
                  "varType": "High Throughput",
                  "isUpdated": false
                },
                {
                  "label": "FIFO Queue (.fifo)",
                  "value": "300 TPS (3,000 batched) -> Exactly-Once delivery, Strict sequential ordering",
                  "varType": "Strict Order",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sqs_type_picker.js",
            "initialCode": "function selectSqsType(needsStrictOrdering, needsHighThroughputMillionTps) {\n  if (needsStrictOrdering) return 'SQS_FIFO (Exactly-Once)';\n  if (needsHighThroughputMillionTps) return 'SQS_STANDARD (Unlimited Throughput)';\n  return 'SQS_STANDARD';\n}\n\nconsole.log('Stock Trading Order Book:', selectSqsType(true, false));\nconsole.log('High-Volume IoT Telemetry:', selectSqsType(false, true));",
            "expectedOutput": "Stock Trading Order Book: SQS_FIFO (Exactly-Once)\nHigh-Volume IoT Telemetry: SQS_STANDARD (Unlimited Throughput)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which queue type guarantees strict First-In-First-Out sequential message processing without duplicate deliveries?",
          "expectedStringOutput": "SQS_FIFO (Exactly-Once)",
          "acceptableAnswers": [
            "SQS_FIFO (Exactly-Once)",
            "SQS_FIFO",
            "FIFO",
            "FIFO Queue"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SQS_VISIBILITY_TIMEOUT_DEAD_LETTER",
          "diagnosisMap": {
            "SQS_STANDARD": {
              "misconceptionId": "MC_CLOUD_SQS_VISIBILITY_TIMEOUT_DEAD_LETTER",
              "errorExplanation": "Standard queues provide best-effort ordering. Strict ordering requires SQS_FIFO.",
              "recoveryPath": {
                "simplerExplanation": "FIFO = First-In-First-Out strict order.",
                "guidedFixPrompt": "Type SQS_FIFO (Exactly-Once)"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d18-b2-visibility-timeout-lifecycle",
        "day": 18,
        "blockNumber": 2,
        "title": "The SQS Visibility Timeout & Consumer Heartbeat",
        "conceptBudget": {
          "primaryConcept": "Visibility Timeout Invariant",
          "supportingTerms": [
            "Default 30-second Visibility Timeout",
            "`ChangeMessageVisibility` to extend lease for long jobs",
            "Deleting message upon successful completion"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d18-b1-standard-vs-fifo-queues",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "SQS Visibility Timeout Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Worker A receives Message (Visibility Timer starts: 30s countdown)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Message is HIDDEN from other workers on the queue",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3a. Worker A succeeds -> Calls DeleteMessage -> Message permanently removed",
                  "kind": "end"
                },
                {
                  "id": "4",
                  "label": "3b. Worker A crashes -> 30s expires -> Message becomes VISIBLE again for Worker B!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "visibility_demo.js",
            "initialCode": "function evaluateMessageVisibility(receivedEpochMs, timeoutSec = 30) {\n  const elapsedSec = (Date.now() - receivedEpochMs) / 1000;\n  return elapsedSec >= timeoutSec ? 'VISIBLE_ON_QUEUE' : 'HIDDEN_IN_PROCESSING';\n}\n\nconst now = Date.now();\nconsole.log('10s elapsed:', evaluateMessageVisibility(now - 10000));\nconsole.log('45s elapsed (Worker crashed):', evaluateMessageVisibility(now - 45000));",
            "expectedOutput": "10s elapsed: HIDDEN_IN_PROCESSING\n45s elapsed (Worker crashed): VISIBLE_ON_QUEUE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What happens to a message if the processing worker crashes and 45 seconds elapse (exceeding 30s timeout)?",
          "expectedStringOutput": "VISIBLE_ON_QUEUE",
          "acceptableAnswers": [
            "VISIBLE_ON_QUEUE",
            "45s elapsed (Worker crashed): VISIBLE_ON_QUEUE"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SQS_VISIBILITY_TIMEOUT_DEAD_LETTER",
          "diagnosisMap": {
            "HIDDEN_IN_PROCESSING": {
              "misconceptionId": "MC_CLOUD_SQS_VISIBILITY_TIMEOUT_DEAD_LETTER",
              "errorExplanation": "After the timeout expires, the message automatically returns to the queue as VISIBLE_ON_QUEUE.",
              "recoveryPath": {
                "simplerExplanation": "Expired timeout returns message to VISIBLE_ON_QUEUE.",
                "guidedFixPrompt": "Type VISIBLE_ON_QUEUE"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d18-b3-dead-letter-queues-maxreceives",
        "day": 18,
        "blockNumber": 3,
        "title": "Dead-Letter Queues (DLQ) & Redrive Policies",
        "conceptBudget": {
          "primaryConcept": "Dead-Letter Queues (DLQ)",
          "supportingTerms": [
            "`maxReceiveCount` (e.g., 3 retries)",
            "Isolating poisoned unparseable messages",
            "Preventing infinite loop consumer crashes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d18-b2-visibility-timeout-lifecycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dlq_eval_demo.js",
            "initialCode": "function evaluateRedrive(receiveCount, maxReceiveCount = 3) {\n  return receiveCount >= maxReceiveCount ? 'ROUTE_TO_DLQ' : 'RETRY_IN_MAIN_QUEUE';\n}\n\nconsole.log('Receive 1 of 3:', evaluateRedrive(1));\nconsole.log('Receive 3 of 3 (Poisoned payload):', evaluateRedrive(3));",
            "expectedOutput": "Receive 1 of 3: RETRY_IN_MAIN_QUEUE\nReceive 3 of 3 (Poisoned payload): ROUTE_TO_DLQ",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should every production Amazon SQS queue be configured with a Dead-Letter Queue (DLQ)?",
          "options": [
            "To catch poisoned unparseable messages that fail repeatedly after maxReceiveCount, preventing infinite processing loops that consume compute and crash workers",
            "Because DLQs make queues faster",
            "Because AWS deletes queues without a DLQ"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_SQS_VISIBILITY_TIMEOUT_DEAD_LETTER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_SQS_VISIBILITY_TIMEOUT_DEAD_LETTER",
              "errorExplanation": "DLQs isolate malformed poisoned messages for engineer investigation.",
              "recoveryPath": {
                "simplerExplanation": "DLQ isolates failing messages.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Amazon SNS: Pub/Sub Topic Fanout & Push Notifications",
    "overviewMetaphor": "Amazon SNS is a citywide emergency radio broadcast station: when the emergency announcer speaks once into the microphone (Publish to SNS Topic), the message is instantly broadcast simultaneously to 10,000 home radios (SQS Queues), mobile phones (SMS/Push notifications), and automated siren stations (Lambda Functions) in parallel.",
    "blocks": [
      {
        "id": "cloud-d19-b1-sns-topic-fanout-pattern",
        "day": 19,
        "blockNumber": 1,
        "title": "The SNS Topic Fanout Architecture",
        "conceptBudget": {
          "primaryConcept": "SNS Pub/Sub Fanout",
          "supportingTerms": [
            "Publisher publishes once to SNS Topic",
            "SNS fans out to 10+ SQS queues in parallel",
            "Decoupling microservices"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d18-b1-standard-vs-fifo-queues",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "SNS + SQS Fanout Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Checkout Service publishes 1 event 'OrderPlaced' to SNS Topic",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "SNS Topic fans out message copy simultaneously to 3 separate SQS Queues",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Queue 1 -> Inventory Service | Queue 2 -> Billing Service | Queue 3 -> Shipping Service",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fanout_demo.js",
            "initialCode": "function fanoutMessage(topicSubscribers, message) {\n  return topicSubscribers.map(sub => ({\n    queue: sub,\n    deliveredMessage: message,\n    status: 'DELIVERED'\n  }));\n}\n\nconst subs = ['inventory_queue', 'billing_queue', 'notifications_queue'];\nconst results = fanoutMessage(subs, { orderId: 'ord_101', total: 99.00 });\nconsole.log('Delivered Queues Count:', results.length);\nconsole.log('Queue 1 Target:', results[0].queue);",
            "expectedOutput": "Delivered Queues Count: 3\nQueue 1 Target: inventory_queue",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many queues receive a copy of the order message when 3 microservice queues subscribe to the SNS topic?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "Delivered Queues Count: 3"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SNS_FANOUT_TOPIC_SUBSCRIPTION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_SNS_FANOUT_TOPIC_SUBSCRIPTION",
              "errorExplanation": "SNS fans out a distinct copy to every confirmed subscriber queue (3 total).",
              "recoveryPath": {
                "simplerExplanation": "All 3 queues receive the message.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d19-b2-message-filtering-policies",
        "day": 19,
        "blockNumber": 2,
        "title": "SNS Subscription Filter Policies",
        "conceptBudget": {
          "primaryConcept": "SNS Filter Policies",
          "supportingTerms": [
            "Filtering messages by MessageAttributes",
            "Preventing unwanted messages from hitting queues",
            "Reducing compute cost"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d19-b1-sns-topic-fanout-pattern",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SNS Subscription Filter Policy JSON",
            "codeSnippet": "{\n  \"order_type\": [\"VIP\", \"ENTERPRISE\"],\n  \"total_amount\": [{ \"numeric\": [\">=\", 1000] }]\n}",
            "lineNotes": {
              "2": "Only forwards messages where order_type is VIP or ENTERPRISE.",
              "3": "Numeric condition requiring total_amount >= 1000."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sns_filter_demo.js",
            "initialCode": "function evaluateFilter(policy, msgAttrs) {\n  for (const k of Object.keys(policy)) {\n    if (!msgAttrs[k] || !policy[k].includes(msgAttrs[k])) return 'DROPPED_BY_FILTER';\n  }\n  return 'ACCEPTED_DELIVERED';\n}\n\nconst policy = { tier: ['ENTERPRISE', 'PRO'] };\nconsole.log('Enterprise Event:', evaluateFilter(policy, { tier: 'ENTERPRISE' }));\nconsole.log('Free Tier Event:', evaluateFilter(policy, { tier: 'FREE' }));",
            "expectedOutput": "Enterprise Event: ACCEPTED_DELIVERED\nFree Tier Event: DROPPED_BY_FILTER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the filter evaluation decision for an event with `tier: 'FREE'` against the Enterprise/Pro policy?",
          "expectedStringOutput": "DROPPED_BY_FILTER",
          "acceptableAnswers": [
            "DROPPED_BY_FILTER",
            "Free Tier Event: DROPPED_BY_FILTER"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SNS_FANOUT_TOPIC_SUBSCRIPTION",
          "diagnosisMap": {
            "ACCEPTED_DELIVERED": {
              "misconceptionId": "MC_CLOUD_SNS_FANOUT_TOPIC_SUBSCRIPTION",
              "errorExplanation": "The filter policy requires ENTERPRISE or PRO. FREE tier events are dropped.",
              "recoveryPath": {
                "simplerExplanation": "Mismatched attributes are DROPPED_BY_FILTER.",
                "guidedFixPrompt": "Type DROPPED_BY_FILTER"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d19-b3-sns-fifo-topics",
        "day": 19,
        "blockNumber": 3,
        "title": "SNS FIFO Topics & Ordering Preservation",
        "conceptBudget": {
          "primaryConcept": "SNS FIFO Topics",
          "supportingTerms": [
            "Combining SNS FIFO with SQS FIFO queues",
            "Strict message ordering across fanout subscribers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d19-b2-message-filtering-policies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sns_fifo_demo.js",
            "initialCode": "function validateFifoPairing(topicType, queueType) {\n  if (topicType === 'FIFO' && queueType !== 'FIFO') {\n    return { valid: false, error: 'SNS_FIFO_REQUIRES_SQS_FIFO_SUBSCRIBERS' };\n  }\n  return { valid: true };\n}\n\nconsole.log('FIFO Topic -> FIFO Queue:', validateFifoPairing('FIFO', 'FIFO').valid);\nconsole.log('FIFO Topic -> Standard Queue:', validateFifoPairing('FIFO', 'STANDARD').valid);",
            "expectedOutput": "FIFO Topic -> FIFO Queue: true\nFIFO Topic -> Standard Queue: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What type of subscriber queue is required when subscribing to an Amazon SNS FIFO topic to preserve strict ordering?",
          "options": [
            "Amazon SQS FIFO Queues (.fifo)",
            "Amazon SQS Standard Queues",
            "Any email address"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_SNS_FANOUT_TOPIC_SUBSCRIPTION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_SNS_FANOUT_TOPIC_SUBSCRIPTION",
              "errorExplanation": "SNS FIFO topics require SQS FIFO subscriber queues to maintain ordered delivery.",
              "recoveryPath": {
                "simplerExplanation": "SNS FIFO pairs with SQS FIFO.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Amazon EventBridge: Serverless Event Bus & Schema Registry",
    "overviewMetaphor": "Amazon EventBridge is the central postal sorting hub of a smart city: instead of every service building direct telephone wires to every other service, all services drop standardized envelope packages into the central Event Bus (`detail-type: 'UserSignedUp'`); EventBridge inspects the envelope labels against custom rules and routes the package to 20+ AWS targets (Lambda, Step Functions, SQS, Kinesis, Webhooks).",
    "blocks": [
      {
        "id": "cloud-d20-b1-event-bus-envelope-anatomy",
        "day": 20,
        "blockNumber": 1,
        "title": "EventBridge Standard JSON Envelope & Event Buses",
        "conceptBudget": {
          "primaryConcept": "EventBridge Event Envelope",
          "supportingTerms": [
            "`Source: 'com.pinit.billing'`",
            "`DetailType: 'InvoiceGenerated'`",
            "`Detail: {...}`",
            "Default vs Custom Event Buses"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d19-b1-sns-topic-fanout-pattern",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "EventBridge Event JSON Envelope",
            "codeSnippet": "{\n  \"version\": \"0\",\n  \"id\": \"fe8b8e05-2d17-48f6-a8fa-7e44a49c95d9\",\n  \"detail-type\": \"PaymentAuthorized\",\n  \"source\": \"com.pinit.payments\",\n  \"account\": \"123456789012\",\n  \"time\": \"2026-08-24T12:00:00Z\",\n  \"region\": \"us-east-1\",\n  \"detail\": {\n    \"paymentId\": \"pay_9981\",\n    \"amount\": 49.99,\n    \"currency\": \"USD\"\n  }\n}",
            "lineNotes": {
              "3": "Event name matched by rules.",
              "4": "Service identifier emitting the event.",
              "8": "Arbitrary payload payload consumed by targets."
            }
          },
          {
            "type": "runnable_code",
            "filename": "event_envelope_demo.js",
            "initialCode": "function buildEventBridgeEvent(source, detailType, detail) {\n  return {\n    Source: source,\n    DetailType: detailType,\n    Detail: JSON.stringify(detail),\n    EventBusName: 'pinit-enterprise-bus',\n    Time: new Date().toISOString()\n  };\n}\n\nconst evt = buildEventBridgeEvent('com.pinit.auth', 'UserLoggedIn', { userId: 'u_1' });\nconsole.log('Event Source:', evt.Source);\nconsole.log('Detail Type:', evt.DetailType);",
            "expectedOutput": "Event Source: com.pinit.auth\nDetail Type: UserLoggedIn",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the `Source` attribute of the generated EventBridge event?",
          "expectedStringOutput": "com.pinit.auth",
          "acceptableAnswers": [
            "com.pinit.auth",
            "Event Source: com.pinit.auth"
          ],
          "primaryMisconceptionId": "MC_CLOUD_EVENTBRIDGE_EVENT_BUS_SCHEMA_REGISTRY",
          "diagnosisMap": {
            "UserLoggedIn": {
              "misconceptionId": "MC_CLOUD_EVENTBRIDGE_EVENT_BUS_SCHEMA_REGISTRY",
              "errorExplanation": "UserLoggedIn is the DetailType. The Source is com.pinit.auth.",
              "recoveryPath": {
                "simplerExplanation": "Source is com.pinit.auth.",
                "guidedFixPrompt": "Type com.pinit.auth"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d20-b2-content-filtering-rules",
        "day": 20,
        "blockNumber": 2,
        "title": "Content-Based Event Pattern Matching Rules",
        "conceptBudget": {
          "primaryConcept": "Event Pattern Matching",
          "supportingTerms": [
            "Exact value match (`[\"USD\"]`)",
            "Prefix match (`[{ \"prefix\": \"usr_\" }]`)",
            "Numeric range match (`[{ \"numeric\": [\">\", 100] }]`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d20-b1-event-bus-envelope-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pattern_matcher_demo.js",
            "initialCode": "function matchEvent(pattern, event) {\n  if (pattern.source && !pattern.source.includes(event.source)) return false;\n  if (pattern['detail-type'] && !pattern['detail-type'].includes(event['detail-type'])) return false;\n  return true;\n}\n\nconst rule = { source: ['com.pinit.orders'], 'detail-type': ['OrderPlaced'] };\nconsole.log('Match OrderPlaced:', matchEvent(rule, { source: 'com.pinit.orders', 'detail-type': 'OrderPlaced' }));\nconsole.log('Match UserCreated:', matchEvent(rule, { source: 'com.pinit.users', 'detail-type': 'UserCreated' }));",
            "expectedOutput": "Match OrderPlaced: true\nMatch UserCreated: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Does an event with source `com.pinit.orders` and detail-type `OrderPlaced` match the rule pattern?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Match OrderPlaced: true"
          ],
          "primaryMisconceptionId": "MC_CLOUD_EVENTBRIDGE_EVENT_BUS_SCHEMA_REGISTRY",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_CLOUD_EVENTBRIDGE_EVENT_BUS_SCHEMA_REGISTRY",
              "errorExplanation": "Both source and detail-type match the rule pattern, returning true.",
              "recoveryPath": {
                "simplerExplanation": "Matches pattern -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d20-b3-schema-registry-discovery",
        "day": 20,
        "blockNumber": 3,
        "title": "EventBridge Schema Registry & Code Bindings",
        "conceptBudget": {
          "primaryConcept": "Schema Registry",
          "supportingTerms": [
            "Automated Schema Discovery",
            "Generating TypeScript/Java typed bindings",
            "Preventing producer-consumer contract drift"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d20-b2-content-filtering-rules",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "schema_reg_demo.js",
            "initialCode": "function validateEventSchema(event, requiredFields) {\n  const missing = requiredFields.filter(f => !(f in event.detail));\n  return missing.length === 0 ? { valid: true } : { valid: false, missingFields: missing };\n}\n\nconst evt = { detail: { orderId: 'ord_1', amount: 100 } };\nconsole.log('Valid Schema:', validateEventSchema(evt, ['orderId', 'amount']).valid);\nconsole.log('Missing Schema Field:', validateEventSchema(evt, ['orderId', 'currency']).valid);",
            "expectedOutput": "Valid Schema: true\nMissing Schema Field: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary benefit of the EventBridge Schema Registry in enterprise microservices?",
          "options": [
            "It automatically discovers event structures and generates strongly-typed code bindings (TypeScript/Java/Python), eliminating contract drift between microservices",
            "It turns JSON into XML",
            "It reduces AWS bills to $0"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_EVENTBRIDGE_EVENT_BUS_SCHEMA_REGISTRY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_EVENTBRIDGE_EVENT_BUS_SCHEMA_REGISTRY",
              "errorExplanation": "Schema registries provide typed code bindings and eliminate breaking contract drift.",
              "recoveryPath": {
                "simplerExplanation": "Provides typed bindings and prevents contract drift.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus with SQS/SNS Fanout",
    "overviewMetaphor": "Milestone 3 — The Enterprise E-Commerce Nervous System: When a customer clicks \"Place Order\", the checkout service emits a single event to the Central EventBridge Bus; the bus instantly routes the event to: 1) Billing Service SQS, 2) Inventory Reservation SQS, 3) Real-Time Analytics Kinesis Stream, and 4) Fraud Detection Lambda in parallel with zero tight coupling.",
    "blocks": [
      {
        "id": "cloud-d21-b1-e-commerce-event-bus-mesh",
        "day": 21,
        "blockNumber": 1,
        "title": "Enterprise Multi-Target Event Routing Mesh",
        "conceptBudget": {
          "primaryConcept": "Enterprise Event Mesh",
          "supportingTerms": [
            "Asynchronous fanout across 4+ microservices",
            "EventBridge bus rules",
            "SQS queue buffers for rate leveling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d20-b1-event-bus-envelope-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Event Mesh Routing",
              "nodes": [
                {
                  "id": "1",
                  "label": "Checkout emits 'OrderCreated' { orderId, amount: 250 } to EventBridge",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Rule 1 routes to Billing SQS Queue (Charges customer credit card)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Rule 2 routes to Inventory SQS Queue (Deducts stock)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Rule 3 routes to Fraud Detection Lambda (Runs ML anomaly score)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "event_mesh_sim.js",
            "initialCode": "class EnterpriseEventMesh {\n  constructor() { this.queues = { billing: [], inventory: [], fraudAlerts: [] }; }\n  publish(event) {\n    if (event.detailType === 'OrderCreated') {\n      this.queues.billing.push(event.detail);\n      this.queues.inventory.push(event.detail);\n      if (event.detail.amount > 1000) this.queues.fraudAlerts.push(event.detail);\n    }\n    return { billingCount: this.queues.billing.length, fraudCount: this.queues.fraudAlerts.length };\n  }\n}\n\nconst mesh = new EnterpriseEventMesh();\nconsole.log('Normal $50 Order:', JSON.stringify(mesh.publish({ detailType: 'OrderCreated', detail: { id: 'ord_1', amount: 50 } })));\nconsole.log('High-Value $5,000 Order:', JSON.stringify(mesh.publish({ detailType: 'OrderCreated', detail: { id: 'ord_2', amount: 5000 } })));",
            "expectedOutput": "Normal $50 Order: {\"billingCount\":1,\"fraudCount\":0}\nHigh-Value $5,000 Order: {\"billingCount\":2,\"fraudCount\":1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many fraud alerts are queued after publishing a high-value $5,000 order?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "fraudCount\":1"
          ],
          "primaryMisconceptionId": "MC_CLOUD_EVENTBRIDGE_EVENT_BUS_SCHEMA_REGISTRY",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_CLOUD_EVENTBRIDGE_EVENT_BUS_SCHEMA_REGISTRY",
              "errorExplanation": "Orders > $1000 match the fraud rule and trigger 1 alert.",
              "recoveryPath": {
                "simplerExplanation": "Amount > 1000 triggers fraud queue.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d21-b2-rate-leveling-traffic-bursts",
        "day": 21,
        "blockNumber": 2,
        "title": "Traffic Burst Leveling & Consumer Throttling Defense",
        "conceptBudget": {
          "primaryConcept": "Queue-Based Rate Leveling",
          "supportingTerms": [
            "Smoothing out Black Friday traffic spikes (10,000 req/sec)",
            "Consuming at steady database capacity (500 req/sec) without crashing DB"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d21-b1-e-commerce-event-bus-mesh",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "burst_leveling.js",
            "initialCode": "function simulateRateLeveling(spikeCount, dbCapacityPerSec = 500) {\n  const durationSeconds = Math.ceil(spikeCount / dbCapacityPerSec);\n  return { spikeCount, dbProtected: true, secondsToDrain: durationSeconds };\n}\n\nconsole.log('10,000 Order Flash Sale Drain Time:', JSON.stringify(simulateRateLeveling(10000)));",
            "expectedOutput": "10,000 Order Flash Sale Drain Time: {\"spikeCount\":10000,\"dbProtected\":true,\"secondsToDrain\":20}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many seconds does it take to safely drain 10,000 queued orders at 500 orders/sec DB capacity without crashing the database?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "20 seconds",
            "secondsToDrain\":20"
          ],
          "primaryMisconceptionId": "MC_CLOUD_SQS_VISIBILITY_TIMEOUT_DEAD_LETTER",
          "diagnosisMap": {
            "10000": {
              "misconceptionId": "MC_CLOUD_SQS_VISIBILITY_TIMEOUT_DEAD_LETTER",
              "errorExplanation": "10,000 / 500 = 20 seconds.",
              "recoveryPath": {
                "simplerExplanation": "10,000 / 500 = 20 seconds.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d21-b3-milestone3-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Microservices Event Bus Certification",
        "conceptBudget": {
          "primaryConcept": "Event Bus Milestone Certification",
          "supportingTerms": [
            "Enterprise Event Bus Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d21-b2-rate-leveling-traffic-bursts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CLOUD_EVENTBRIDGE_EVENT_BUS_SCHEMA_REGISTRY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CLOUD_EVENTBRIDGE_EVENT_BUS_SCHEMA_REGISTRY",
              "errorExplanation": "Returns ⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Matches milestone header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "AWS ECS & AWS Fargate Serverless Container Architecture",
    "overviewMetaphor": "AWS ECS & Fargate is shipping container logistics: ECS is the master cargo crane controller scheduling which containers go where; EC2 launch type is buying and maintaining your own cargo ship (you pay for the ship whether it holds 1 container or 50 containers); AWS Fargate is paying only for the exact shipping slot your container occupies (serverless container compute with zero EC2 instances to manage).",
    "blocks": [
      {
        "id": "cloud-d22-b1-ecs-ec2-vs-fargate-launch-types",
        "day": 22,
        "blockNumber": 1,
        "title": "ECS Launch Types: EC2 vs Serverless AWS Fargate",
        "conceptBudget": {
          "primaryConcept": "ECS Launch Types",
          "supportingTerms": [
            "EC2 Launch Type (Managing EC2 instances, cluster capacity, OS patches)",
            "Fargate Launch Type (Serverless compute, pay per vCPU/RAM per second)",
            "Task Definitions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b1-service-models-pyramid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ECS EC2 vs AWS Fargate Comparison",
              "boxes": [
                {
                  "label": "ECS with EC2",
                  "value": "You manage EC2 cluster nodes, EBS storage, patching, and capacity planning",
                  "varType": "Infrastructure Control",
                  "isUpdated": false
                },
                {
                  "label": "ECS with Fargate",
                  "value": "AWS manages underlying compute seamlessly -> You specify only CPU & RAM per Task",
                  "varType": "Serverless Containers",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fargate_demo.js",
            "initialCode": "function evaluateLaunchType(launchType) {\n  return launchType === 'FARGATE' \n    ? { serverless: true, manageInstances: false, billingModel: 'Per Task vCPU & RAM' }\n    : { serverless: false, manageInstances: true, billingModel: 'Per EC2 Instance' };\n}\n\nconsole.log('Fargate Specs:', JSON.stringify(evaluateLaunchType('FARGATE')));\nconsole.log('EC2 Launch Specs:', JSON.stringify(evaluateLaunchType('EC2')));",
            "expectedOutput": "Fargate Specs: {\"serverless\":true,\"manageInstances\":false,\"billingModel\":\"Per Task vCPU & RAM\"}\nEC2 Launch Specs: {\"serverless\":false,\"manageInstances\":true,\"billingModel\":\"Per EC2 Instance\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary operational advantage of using the AWS Fargate launch type with Amazon ECS?",
          "options": [
            "You do not need to provision, configure, or patch any EC2 virtual machines; AWS automatically allocates serverless compute per container task",
            "Fargate runs containers without internet",
            "Fargate is free forever"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_ECS_FARGATE_CONTAINER_TASK_DEFINITION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_ECS_FARGATE_CONTAINER_TASK_DEFINITION",
              "errorExplanation": "Fargate is serverless container compute that eliminates EC2 instance management.",
              "recoveryPath": {
                "simplerExplanation": "Fargate eliminates EC2 VM management.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "cloud-d22-b2-task-definition-json-anatomy",
        "day": 22,
        "blockNumber": 2,
        "title": "ECS Task Definition JSON Anatomy & Container Sizing",
        "conceptBudget": {
          "primaryConcept": "ECS Task Definitions",
          "supportingTerms": [
            "`cpu: '512'` (0.5 vCPU)",
            "`memory: '1024'` (1 GB RAM)",
            "`essential: true`",
            "`logConfiguration` (awslogs driver to CloudWatch)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d22-b1-ecs-ec2-vs-fargate-launch-types",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Fargate Task Definition JSON",
            "codeSnippet": "{\n  \"family\": \"production-api-task\",\n  \"networkMode\": \"awsvpc\",\n  \"requiresCompatibilities\": [\"FARGATE\"],\n  \"cpu\": \"512\",\n  \"memory\": \"1024\",\n  \"containerDefinitions\": [\n    {\n      \"name\": \"node-api\",\n      \"image\": \"123456789012.dkr.ecr.us-east-1.amazonaws.com/api:v1.2.0\",\n      \"essential\": true,\n      \"portMappings\": [{ \"containerPort\": 3000, \"hostPort\": 3000 }]\n    }\n  ]\n}",
            "lineNotes": {
              "3": "awsvpc mode assigns a dedicated ENI and private IP per task.",
              "9": "Essential flag ensures task stops if this container crashes."
            }
          },
          {
            "type": "runnable_code",
            "filename": "task_def_calc.js",
            "initialCode": "function calculateTaskCost(tasks, cpuUnits, ramGb, hours = 730) {\n  const vcpu = cpuUnits / 1024;\n  const hourlyRate = (vcpu * 0.04048) + (ramGb * 0.004445);\n  return `$${(tasks * hourlyRate * hours).toFixed(2)}`;\n}\n\nconsole.log('4 Fargate Tasks (0.5 vCPU, 1GB RAM) Monthly Cost:', calculateTaskCost(4, 512, 1));",
            "expectedOutput": "4 Fargate Tasks (0.5 vCPU, 1GB RAM) Monthly Cost: $72.08",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the monthly cost for running 4 Fargate tasks (0.5 vCPU, 1GB RAM)?",
          "expectedStringOutput": "$72.08",
          "acceptableAnswers": [
            "$72.08",
            "72.08"
          ],
          "primaryMisconceptionId": "MC_CLOUD_ECS_FARGATE_CONTAINER_TASK_DEFINITION",
          "diagnosisMap": {
            "$500.00": {
              "misconceptionId": "MC_CLOUD_ECS_FARGATE_CONTAINER_TASK_DEFINITION",
              "errorExplanation": "Fargate serverless compute for 4 tasks is ~$72.08/month.",
              "recoveryPath": {
                "simplerExplanation": "Cost is $72.08.",
                "guidedFixPrompt": "Type $72.08"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d22-b3-ecs-service-auto-scaling",
        "day": 22,
        "blockNumber": 3,
        "title": "ECS Services & Target Tracking Task Auto-Scaling",
        "conceptBudget": {
          "primaryConcept": "ECS Service Auto-Scaling",
          "supportingTerms": [
            "Target Tracking on ALB Request Count Per Target",
            "Scaling out tasks from 2 to 20 during surges",
            "Rolling blue-green updates with zero downtime"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d22-b2-task-definition-json-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ecs_service_demo.js",
            "initialCode": "function evaluateServiceScale(currentTasks, reqPerTarget, targetMetric = 1000, maxTasks = 20) {\n  const desired = Math.ceil(currentTasks * (reqPerTarget / targetMetric));\n  return Math.min(maxTasks, desired);\n}\n\nconsole.log('Surge: 2,500 req/target with 2 current tasks:', evaluateServiceScale(2, 2500));",
            "expectedOutput": "Surge: 2,500 req/target with 2 current tasks: 5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many desired tasks are calculated when current 2 tasks experience 2,500 requests/target (target: 1000)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5 tasks"
          ],
          "primaryMisconceptionId": "MC_CLOUD_ECS_FARGATE_CONTAINER_TASK_DEFINITION",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_CLOUD_ECS_FARGATE_CONTAINER_TASK_DEFINITION",
              "errorExplanation": "2 * (2500 / 1000) = 5 desired tasks.",
              "recoveryPath": {
                "simplerExplanation": "2 * 2.5 = 5 tasks.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "AWS Step Functions & Distributed Saga Pattern Orchestration",
    "overviewMetaphor": "AWS Step Functions is a movie director coordinating a complex stunt sequence: Step 1: Stunt driver jumps the ramp (Reserve Hotel); Step 2: Pyro team detonates explosion (Charge Credit Card); if Step 2 fails (Card Declined), the director shouts \"CUT! ROLLBACK!\" (Compensating Transaction) and executes the reverse rollback step (Cancel Hotel Reservation) so the system returns cleanly to its initial state.",
    "blocks": [
      {
        "id": "cloud-d23-b1-state-machine-asl-json",
        "day": 23,
        "blockNumber": 1,
        "title": "Amazon States Language (ASL) & State Types",
        "conceptBudget": {
          "primaryConcept": "Step Functions State Machine",
          "supportingTerms": [
            "Amazon States Language (ASL)",
            "State Types: `Task`, `Choice`, `Parallel`, `Wait`, `Pass`, `Fail`, `Succeed`",
            "Visual workflow graphs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d11-b1-lambda-execution-lifecycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ASL State Machine JSON",
            "codeSnippet": "{\n  \"StartAt\": \"ProcessPayment\",\n  \"States\": {\n    \"ProcessPayment\": {\n      \"Type\": \"Task\",\n      \"Resource\": \"arn:aws:lambda:us-east-1:123456789012:function:charge-card\",\n      \"Next\": \"CheckPaymentStatus\"\n    },\n    \"CheckPaymentStatus\": {\n      \"Type\": \"Choice\",\n      \"Choices\": [\n        { \"Variable\": \"$.status\", \"StringEquals\": \"PAID\", \"Next\": \"DispatchOrder\" }\n      ],\n      \"Default\": \"PaymentFailed\"\n    },\n    \"DispatchOrder\": { \"Type\": \"Succeed\" },\n    \"PaymentFailed\": { \"Type\": \"Fail\", \"Error\": \"PAYMENT_DECLINED\" }\n  }\n}",
            "lineNotes": {
              "4": "Task state invokes a Lambda function.",
              "9": "Choice state implements conditional branching logic.",
              "16": "Terminal success state."
            }
          },
          {
            "type": "runnable_code",
            "filename": "asl_sim_demo.js",
            "initialCode": "function evaluateChoiceState(input) {\n  if (input.status === 'PAID') return 'NEXT_STATE: DispatchOrder';\n  return 'NEXT_STATE: PaymentFailed';\n}\n\nconsole.log('Paid Order:', evaluateChoiceState({ status: 'PAID' }));\nconsole.log('Failed Order:', evaluateChoiceState({ status: 'FAILED' }));",
            "expectedOutput": "Paid Order: NEXT_STATE: DispatchOrder\nFailed Order: NEXT_STATE: PaymentFailed",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which next state is reached when the input status is `PAID`?",
          "expectedStringOutput": "NEXT_STATE: DispatchOrder",
          "acceptableAnswers": [
            "NEXT_STATE: DispatchOrder",
            "DispatchOrder"
          ],
          "primaryMisconceptionId": "MC_CLOUD_STEP_FUNCTIONS_SAGA_STATE_MACHINE",
          "diagnosisMap": {
            "PaymentFailed": {
              "misconceptionId": "MC_CLOUD_STEP_FUNCTIONS_SAGA_STATE_MACHINE",
              "errorExplanation": "Status PAID matches the Choice condition and transitions to DispatchOrder.",
              "recoveryPath": {
                "simplerExplanation": "PAID routes to DispatchOrder.",
                "guidedFixPrompt": "Type NEXT_STATE: DispatchOrder"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d23-b2-saga-pattern-compensating-transactions",
        "day": 23,
        "blockNumber": 2,
        "title": "The Saga Pattern & Compensating Rollback Actions",
        "conceptBudget": {
          "primaryConcept": "Saga Pattern Orchestration",
          "supportingTerms": [
            "Distributed Transactions across microservices",
            "Compensating Transactions (Reverse undo actions)",
            "Guaranteeing eventual consistency without 2-phase locks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d23-b1-state-machine-asl-json",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Saga Compensating Rollback Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Step A: Book Flight (Success)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Step B: Book Hotel (Success)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Step C: Rent Car (FAILS: No cars available!)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Compensate: Cancel Hotel Reservation -> Cancel Flight Booking (System returned to 0)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "saga_demo.js",
            "initialCode": "async function runSaga(steps) {\n  const history = [];\n  for (const s of steps) {\n    if (s.shouldFail) {\n      // Rollback in reverse\n      for (let i = history.length - 1; i >= 0; i--) {\n        history[i].compensated = true;\n      }\n      return { status: 'SAGA_FAILED_COMPENSATED', rolledBack: history.map(h => h.name) };\n    }\n    history.push({ name: s.name, compensated: false });\n  }\n  return { status: 'SAGA_SUCCESS' };\n}\n\nconst steps = [{ name: 'BookFlight' }, { name: 'BookHotel' }, { name: 'RentCar', shouldFail: true }];\nrunSaga(steps).then(res => {\n  console.log('Saga Outcome:', res.status);\n  console.log('Compensated Steps:', JSON.stringify(res.rolledBack));\n});",
            "expectedOutput": "Saga Outcome: SAGA_FAILED_COMPENSATED\nCompensated Steps: [\"BookHotel\",\"BookFlight\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the final status of the Saga workflow when Step 3 fails and triggers compensating rollbacks?",
          "expectedStringOutput": "SAGA_FAILED_COMPENSATED",
          "acceptableAnswers": [
            "SAGA_FAILED_COMPENSATED",
            "Saga Outcome: SAGA_FAILED_COMPENSATED"
          ],
          "primaryMisconceptionId": "MC_CLOUD_STEP_FUNCTIONS_SAGA_STATE_MACHINE",
          "diagnosisMap": {
            "SAGA_SUCCESS": {
              "misconceptionId": "MC_CLOUD_STEP_FUNCTIONS_SAGA_STATE_MACHINE",
              "errorExplanation": "Step 3 failure triggers compensating transactions, returning SAGA_FAILED_COMPENSATED.",
              "recoveryPath": {
                "simplerExplanation": "Rollback triggers SAGA_FAILED_COMPENSATED.",
                "guidedFixPrompt": "Type SAGA_FAILED_COMPENSATED"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d23-b3-standard-vs-express-workflows",
        "day": 23,
        "blockNumber": 3,
        "title": "Standard vs Express Workflows Trade-offs",
        "conceptBudget": {
          "primaryConcept": "Step Functions Execution Modes",
          "supportingTerms": [
            "Standard Workflows (Exactly-once, up to 1 year duration, visual execution history)",
            "Express Workflows (At-least-once, up to 5 min duration, 100,000+ executions/sec, high-volume event processing)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d23-b2-saga-pattern-compensating-transactions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "workflow_type_picker.js",
            "initialCode": "function pickWorkflowType(durationDays, reqPerSec) {\n  return (durationDays > 0 || reqPerSec < 100)\n    ? 'STANDARD_WORKFLOW (Auditable, up to 1 year)'\n    : 'EXPRESS_WORKFLOW (High-throughput, <5 mins)';\n}\n\nconsole.log('Human Approval Order (Takes 3 days):', pickWorkflowType(3, 1));\nconsole.log('IoT Sensor Data Pipeline (50,000 req/sec):', pickWorkflowType(0, 50000));",
            "expectedOutput": "Human Approval Order (Takes 3 days): STANDARD_WORKFLOW (Auditable, up to 1 year)\nIoT Sensor Data Pipeline (50,000 req/sec): EXPRESS_WORKFLOW (High-throughput, <5 mins)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When should you select Express Workflows instead of Standard Workflows in AWS Step Functions?",
          "options": [
            "For high-volume, event-driven workloads (such as IoT telemetry or clickstream processing) running for under 5 minutes at 100,000+ executions per second",
            "When a human needs 2 weeks to approve an invoice",
            "When you have no internet"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_STEP_FUNCTIONS_SAGA_STATE_MACHINE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_STEP_FUNCTIONS_SAGA_STATE_MACHINE",
              "errorExplanation": "Express Workflows provide high-speed, cost-efficient execution for sub-5-minute workloads.",
              "recoveryPath": {
                "simplerExplanation": "High throughput sub-5-min tasks use Express Workflows.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Infrastructure as Code (IaC) with Terraform & State Management",
    "overviewMetaphor": "Terraform is an architect's automated 3D blueprint printer: instead of manually clicking 50 buttons in the AWS Web Console (which causes human error and \"Console Drift\"), you write declarative code (`resource \"aws_s3_bucket\" \"logs\"`); Terraform compares your blueprint against the real world (`terraform.tfstate`), calculates the exact diff (`terraform plan`), and builds the infrastructure (`terraform apply`).",
    "blocks": [
      {
        "id": "cloud-d24-b1-terraform-state-remote-s3",
        "day": 24,
        "blockNumber": 1,
        "title": "Terraform State & Remote S3 + DynamoDB Locking",
        "conceptBudget": {
          "primaryConcept": "Terraform Remote State",
          "supportingTerms": [
            "`terraform.tfstate` (Source of truth mapping code to real AWS resource IDs)",
            "Remote S3 Backend (Centralized team state storage)",
            "DynamoDB State Locking (`LockID` preventing concurrent state corruption)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b1-service-models-pyramid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Terraform Backend Configuration",
            "codeSnippet": "terraform {\n  backend \"s3\" {\n    bucket         = \"pinit-terraform-state-prod\"\n    key            = \"global/s3/terraform.tfstate\"\n    region         = \"us-east-1\"\n    dynamodb_table = \"terraform-locks\"\n    encrypt        = true\n  }\n}",
            "lineNotes": {
              "3": "Stores shared state securely in encrypted S3 bucket.",
              "6": "Uses DynamoDB table to acquire atomic execution locks during apply."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tf_lock_demo.js",
            "initialCode": "class StateLocker {\n  constructor() { this.locked = false; }\n  acquire(dev) {\n    if (this.locked) return { success: false, error: 'STATE_LOCKED_CONCURRENT_APPLY_BLOCKED' };\n    this.locked = true;\n    return { success: true, user: dev };\n  }\n  release() { this.locked = false; }\n}\n\nconst locker = new StateLocker();\nconsole.log('Engineer A Lock:', locker.acquire('Alice').success);\nconsole.log('Engineer B Lock (Concurrent):', locker.acquire('Bob').error);",
            "expectedOutput": "Engineer A Lock: true\nEngineer B Lock (Concurrent): STATE_LOCKED_CONCURRENT_APPLY_BLOCKED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What error message is triggered when Engineer B attempts to run `terraform apply` while Engineer A holds the DynamoDB state lock?",
          "expectedStringOutput": "STATE_LOCKED_CONCURRENT_APPLY_BLOCKED",
          "acceptableAnswers": [
            "STATE_LOCKED_CONCURRENT_APPLY_BLOCKED",
            "STATE_LOCKED"
          ],
          "primaryMisconceptionId": "MC_CLOUD_TERRAFORM_IAC_STATE_DRIFT_LOCKING",
          "diagnosisMap": {
            "SUCCESS": {
              "misconceptionId": "MC_CLOUD_TERRAFORM_IAC_STATE_DRIFT_LOCKING",
              "errorExplanation": "DynamoDB state locking blocks concurrent applies with STATE_LOCKED_CONCURRENT_APPLY_BLOCKED.",
              "recoveryPath": {
                "simplerExplanation": "State locking prevents concurrent applies.",
                "guidedFixPrompt": "Type STATE_LOCKED_CONCURRENT_APPLY_BLOCKED"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d24-b2-terraform-lifecycle-plan-apply",
        "day": 24,
        "blockNumber": 2,
        "title": "Terraform Lifecycle: `init`, `plan`, `apply` & Drift Detection",
        "conceptBudget": {
          "primaryConcept": "Terraform Workflow",
          "supportingTerms": [
            "`terraform init` (Downloads provider plugins)",
            "`terraform plan` (Computes dry-run diff)",
            "`terraform apply` (Executes API calls)",
            "Console Drift"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d24-b1-terraform-state-remote-s3",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Terraform Deployment Lifecycle",
              "nodes": [
                {
                  "id": "1",
                  "label": "terraform init: Downloads AWS Provider plugin binaries",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "terraform plan: Refreshes state against AWS APIs & computes execution plan (+ create, ~ update, - destroy)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "terraform apply: Sends authenticated API calls to AWS & updates state file",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tf_plan_sim.js",
            "initialCode": "function computePlan(codeResources, stateResources) {\n  const toAdd = codeResources.filter(r => !stateResources.includes(r));\n  const toDestroy = stateResources.filter(r => !codeResources.includes(r));\n  return { add: toAdd.length, change: 0, destroy: toDestroy.length };\n}\n\nconst plan = computePlan(['aws_s3_bucket.logs', 'aws_sqs_queue.orders'], ['aws_s3_bucket.logs']);\nconsole.log(`Plan: +${plan.add} to add, ~${plan.change} to change, -${plan.destroy} to destroy`);",
            "expectedOutput": "Plan: +1 to add, ~0 to change, -0 to destroy",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many resources are scheduled to be added in the execution plan above?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "+1 to add",
            "+1"
          ],
          "primaryMisconceptionId": "MC_CLOUD_TERRAFORM_IAC_STATE_DRIFT_LOCKING",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_CLOUD_TERRAFORM_IAC_STATE_DRIFT_LOCKING",
              "errorExplanation": "1 resource (aws_s3_bucket.logs) already exists. Only 1 new resource (aws_sqs_queue.orders) needs to be added.",
              "recoveryPath": {
                "simplerExplanation": "Only 1 new resource is added.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d24-b3-modular-terraform-architecture",
        "day": 24,
        "blockNumber": 3,
        "title": "Terraform Modules & Reusable Infrastructure Blueprints",
        "conceptBudget": {
          "primaryConcept": "Terraform Modules",
          "supportingTerms": [
            "`module \"vpc\" { source = \"./modules/vpc\" }`",
            "Input variables & output values",
            "DRY infrastructure across Dev/Staging/Prod"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d24-b2-terraform-lifecycle-plan-apply",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "module_demo.js",
            "initialCode": "function instantiateModule(moduleName, environment, cidr) {\n  return {\n    module: moduleName,\n    env: environment,\n    vpcCidr: cidr,\n    tags: { Environment: environment, ManagedBy: 'Terraform' }\n  };\n}\n\nconst dev = instantiateModule('vpc', 'dev', '10.0.0.0/16');\nconst prod = instantiateModule('vpc', 'prod', '10.1.0.0/16');\nconsole.log('Dev Environment Tag:', dev.tags.Environment);\nconsole.log('Prod Environment Tag:', prod.tags.Environment);",
            "expectedOutput": "Dev Environment Tag: dev\nProd Environment Tag: prod",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do platform engineering teams package cloud infrastructure into reusable Terraform Modules?",
          "options": [
            "To enforce architectural standards and prevent repetitive code, allowing developers to provision standardized environments (Dev, Staging, Prod) using a single module call",
            "Because Terraform crashes if files are longer than 10 lines",
            "To hide AWS bills"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_TERRAFORM_IAC_STATE_DRIFT_LOCKING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_TERRAFORM_IAC_STATE_DRIFT_LOCKING",
              "errorExplanation": "Modules enable DRY, standardized infrastructure across environments.",
              "recoveryPath": {
                "simplerExplanation": "Modules provide reusable standardized infrastructure.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Amazon CloudWatch Metrics, Log Insights & Alarms",
    "overviewMetaphor": "CloudWatch is the mission control dashboard on a spaceship: Metrics are the live fuel and oxygen gauges (CPU utilization, HTTP error rates); Log Insights is the flight recorder black box (searching through 50 million log lines using structured SQL-like queries in 2 seconds); Alarms are the flashing red siren that automatically triggers the paging buzzer on the on-call engineer's phone when cabin pressure drops.",
    "blocks": [
      {
        "id": "cloud-d25-b1-cloudwatch-metrics-dimensions",
        "day": 25,
        "blockNumber": 1,
        "title": "CloudWatch Metrics, Dimensions & High-Resolution Alarms",
        "conceptBudget": {
          "primaryConcept": "CloudWatch Telemetry",
          "supportingTerms": [
            "Metric Name (`CPUUtilization`, `5XXError`)",
            "Dimensions (`InstanceId: i-123`, `AutoScalingGroupName: asg-web`)",
            "Standard (1-minute) vs High-Resolution (1-second) metrics"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d1-b1-service-models-pyramid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CloudWatch Metric Structure",
            "codeSnippet": "const metricData = {\n  Namespace: 'AWS/EC2',\n  MetricName: 'CPUUtilization',\n  Dimensions: [{ Name: 'InstanceId', Value: 'i-0123456789abcdef0' }],\n  Statistic: 'Average',\n  Period: 60,\n  Unit: 'Percent'\n};",
            "lineNotes": {
              "2": "AWS service namespace.",
              "4": "Dimension uniquely identifying the specific EC2 instance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cw_metric_demo.js",
            "initialCode": "function evaluateAlarmState(datapoints, threshold = 80) {\n  const avg = datapoints.reduce((a, b) => a + b, 0) / datapoints.length;\n  return avg > threshold ? 'ALARM' : 'OK';\n}\n\nconsole.log('Low Traffic [30, 45, 50]:', evaluateAlarmState([30, 45, 50]));\nconsole.log('High Spike [85, 90, 95]:', evaluateAlarmState([85, 90, 95]));",
            "expectedOutput": "Low Traffic [30, 45, 50]: OK\nHigh Spike [85, 90, 95]: ALARM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state does the CloudWatch alarm evaluate to when CPU datapoints average 90% (exceeding 80% threshold)?",
          "expectedStringOutput": "ALARM",
          "acceptableAnswers": [
            "ALARM",
            "Alarm",
            "High Spike [85, 90, 95]: ALARM"
          ],
          "primaryMisconceptionId": "MC_CLOUD_CLOUDWATCH_METRICS_LOGS_ALARMS",
          "diagnosisMap": {
            "OK": {
              "misconceptionId": "MC_CLOUD_CLOUDWATCH_METRICS_LOGS_ALARMS",
              "errorExplanation": "90% breaches the 80% threshold and transitions the alarm to ALARM state.",
              "recoveryPath": {
                "simplerExplanation": "Breached threshold = ALARM.",
                "guidedFixPrompt": "Type ALARM"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d25-b2-cloudwatch-logs-insights-query",
        "day": 25,
        "blockNumber": 2,
        "title": "CloudWatch Logs Insights Query Syntax",
        "conceptBudget": {
          "primaryConcept": "Logs Insights Queries",
          "supportingTerms": [
            "`fields @timestamp, @message`",
            "`filter @message like /ERROR/`",
            "`stats count(*) by bin(5m)`",
            "`sort @timestamp desc`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d25-b1-cloudwatch-metrics-dimensions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Logs Insights Query",
            "codeSnippet": "fields @timestamp, @message, status, path\n| filter status >= 500\n| stats count(*) as errorCount by path\n| sort errorCount desc\n| limit 10",
            "lineNotes": {
              "2": "Filters for HTTP 5xx server errors.",
              "3": "Aggregates error counts grouped by request path.",
              "5": "Returns Top 10 most failing endpoints."
            }
          },
          {
            "type": "runnable_code",
            "filename": "log_query_sim.js",
            "initialCode": "function queryErrors(logs) {\n  return logs\n    .filter(l => l.status >= 500)\n    .map(l => ({ path: l.path, status: l.status }));\n}\n\nconst sampleLogs = [\n  { path: '/api/v1/users', status: 200 },\n  { path: '/api/v1/checkout', status: 500 },\n  { path: '/api/v1/cart', status: 503 }\n];\nconsole.log('Extracted 5xx Errors:', JSON.stringify(queryErrors(sampleLogs)));",
            "expectedOutput": "Extracted 5xx Errors: [{\"path\":\"/api/v1/checkout\",\"status\":500},{\"path\":\"/api/v1/cart\",\"status\":503}]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many 5xx error logs are extracted from the sample logs?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 errors"
          ],
          "primaryMisconceptionId": "MC_CLOUD_CLOUDWATCH_METRICS_LOGS_ALARMS",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_CLOUD_CLOUDWATCH_METRICS_LOGS_ALARMS",
              "errorExplanation": "1 log is 200 OK. Only 2 logs (500 and 503) match the status >= 500 filter.",
              "recoveryPath": {
                "simplerExplanation": "2 logs are 5xx.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d25-b3-alarm-actions-sns-paging",
        "day": 25,
        "blockNumber": 3,
        "title": "Alarm Actions: Automated Auto-Scaling & SNS On-Call Paging",
        "conceptBudget": {
          "primaryConcept": "Alarm Actions",
          "supportingTerms": [
            "Triggering SNS topic notifications (PagerDuty/Slack)",
            "Triggering Auto-Scaling Step Scaling policies",
            "EC2 Auto-Recovery actions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d25-b2-cloudwatch-logs-insights-query",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "alarm_actions_demo.js",
            "initialCode": "function triggerAlarmAction(alarmState, snsTopicArn, asgPolicyArn) {\n  if (alarmState === 'ALARM') {\n    return { notifiedSns: snsTopicArn, triggeredScaling: asgPolicyArn, status: 'ACTION_EXECUTED' };\n  }\n  return { status: 'NO_ACTION' };\n}\n\nconsole.log('Alarm Breach Result:', triggerAlarmAction('ALARM', 'arn:aws:sns:on-call', 'arn:aws:asg:scale-out').status);",
            "expectedOutput": "Alarm Breach Result: ACTION_EXECUTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What automated actions can a CloudWatch Alarm trigger upon transitioning into the `ALARM` state?",
          "options": [
            "Publishing notification events to an SNS Topic (for PagerDuty/Slack alerts) and triggering EC2 Auto-Scaling policies to scale out compute capacity",
            "Shutting down the company's AWS account",
            "Sending letters through postal mail"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_CLOUDWATCH_METRICS_LOGS_ALARMS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_CLOUDWATCH_METRICS_LOGS_ALARMS",
              "errorExplanation": "CloudWatch alarms automate notifications and compute scaling actions.",
              "recoveryPath": {
                "simplerExplanation": "Alarms trigger SNS paging and Auto-Scaling.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "AWS Key Management Service (KMS) & Envelope Encryption",
    "overviewMetaphor": "Envelope Encryption is a Russian nesting doll of keys: encrypting a 10GB database backup with a master key directly over the network is slow; instead, KMS generates a tiny 256-bit Data Encryption Key (DEK); your server uses the DEK to encrypt the 10GB file locally in RAM in 1 second; then KMS uses the master Key Management Key (KMK) to lock the tiny DEK in an encrypted envelope sealed right next to the file.",
    "blocks": [
      {
        "id": "cloud-d26-b1-envelope-encryption-flow",
        "day": 26,
        "blockNumber": 1,
        "title": "Envelope Encryption: KMS CMKs & Data Keys (DEK)",
        "conceptBudget": {
          "primaryConcept": "Envelope Encryption",
          "supportingTerms": [
            "KMS Customer Master Key (CMK / KMK)",
            "Data Encryption Key (Plaintext DEK vs Encrypted DEK)",
            "`GenerateDataKey` API",
            "Eliminating network bandwidth bottlenecks for large data"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d10-b2-enforce-https-bucket-policy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Envelope Encryption 4-Step Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. App calls kms:GenerateDataKey -> Returns Plaintext DEK + Encrypted DEK (Ciphertext)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. App encrypts 5GB dataset in RAM using Plaintext DEK",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. App immediately ERASES Plaintext DEK from RAM!",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. App stores Encrypted Data alongside Encrypted DEK (Safe against theft!)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "envelope_sim.js",
            "initialCode": "function simulateEnvelope(data, kmsMasterKey) {\n  const plaintextDek = 'raw_dek_key_32bytes';\n  const encryptedDek = `enc_${plaintextDek}_by_${kmsMasterKey}`;\n  const encryptedData = `CIPHERTEXT(${data})_using_${plaintextDek}`;\n  return {\n    encryptedData,\n    encryptedDek,\n    erasedPlaintextDek: true\n  };\n}\n\nconst env = simulateEnvelope('ConfidentialRecord', 'arn:aws:kms:master-1');\nconsole.log('Plaintext DEK Erased from RAM?:', env.erasedPlaintextDek);\nconsole.log('Encrypted DEK Attached?:', env.encryptedDek.startsWith('enc_raw_dek_'));",
            "expectedOutput": "Plaintext DEK Erased from RAM?: true\nEncrypted DEK Attached?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is the plaintext Data Encryption Key (DEK) immediately erased from memory after encrypting data?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Plaintext DEK Erased from RAM?: true"
          ],
          "primaryMisconceptionId": "MC_CLOUD_KMS_ENCRYPTION_ENVELOPE_KEYS",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_CLOUD_KMS_ENCRYPTION_ENVELOPE_KEYS",
              "errorExplanation": "Plaintext DEKs must be purged from RAM immediately to prevent memory scraping.",
              "recoveryPath": {
                "simplerExplanation": "Plaintext DEK is erased -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d26-b2-kms-key-rotation",
        "day": 26,
        "blockNumber": 2,
        "title": "Automated KMS Key Rotation & Decryption Invariants",
        "conceptBudget": {
          "primaryConcept": "KMS Key Rotation",
          "supportingTerms": [
            "Automated annual (365-day) key rotation",
            "Old backing keys preserved forever for decrypting historical ciphertext",
            "Zero manual re-encryption required"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d26-b1-envelope-encryption-flow",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rotation_demo.js",
            "initialCode": "class KmsKeyManager {\n  constructor() {\n    this.versions = [{ version: 1, created: 2024 }, { version: 2, created: 2025 }, { version: 3, created: 2026 }];\n  }\n  getEncryptKey() { return this.versions[this.versions.length - 1]; } // Latest version\n  decrypt(keyVersion) { return this.versions.find(v => v.version === keyVersion) ? 'DECRYPT_SUCCESS' : 'KEY_MISSING'; }\n}\n\nconst kms = new KmsKeyManager();\nconsole.log('New Encryptions use Version:', kms.getEncryptKey().version);\nconsole.log('Decrypting 2024 Data (v1):', kms.decrypt(1));",
            "expectedOutput": "New Encryptions use Version: 3\nDecrypting 2024 Data (v1): DECRYPT_SUCCESS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can KMS still successfully decrypt historical data encrypted with Version 1 after the key has been rotated to Version 3?",
          "expectedStringOutput": "DECRYPT_SUCCESS",
          "acceptableAnswers": [
            "DECRYPT_SUCCESS",
            "Decrypting 2024 Data (v1): DECRYPT_SUCCESS",
            "Yes"
          ],
          "primaryMisconceptionId": "MC_CLOUD_KMS_ENCRYPTION_ENVELOPE_KEYS",
          "diagnosisMap": {
            "KEY_MISSING": {
              "misconceptionId": "MC_CLOUD_KMS_ENCRYPTION_ENVELOPE_KEYS",
              "errorExplanation": "KMS permanently retains older backing key material to decrypt historical data.",
              "recoveryPath": {
                "simplerExplanation": "Old keys are retained -> DECRYPT_SUCCESS.",
                "guidedFixPrompt": "Type DECRYPT_SUCCESS"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d26-b3-secrets-manager-rotation",
        "day": 26,
        "blockNumber": 3,
        "title": "AWS Secrets Manager & Automated Database Password Rotation",
        "conceptBudget": {
          "primaryConcept": "Secrets Manager",
          "supportingTerms": [
            "Automated 30-day RDS password rotation via Lambda",
            "Eliminating hardcoded credentials in environment variables"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d26-b2-kms-key-rotation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "secrets_demo.js",
            "initialCode": "function getDatabaseSecret(cachedSecret, isExpired) {\n  if (!cachedSecret || isExpired) {\n    return { secret: 'rotated_pg_pass_9981', source: 'FETCHED_FROM_SECRETS_MANAGER' };\n  }\n  return { secret: cachedSecret, source: 'IN_MEMORY_CACHE' };\n}\n\nconsole.log('Cold Boot Secret:', getDatabaseSecret(null, false).source);\nconsole.log('Warm Request Secret:', getDatabaseSecret('cached_pass', false).source);",
            "expectedOutput": "Cold Boot Secret: FETCHED_FROM_SECRETS_MANAGER\nWarm Request Secret: IN_MEMORY_CACHE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is AWS Secrets Manager preferred over plain environment variables for database credentials?",
          "options": [
            "Secrets Manager automatically rotates database passwords every 30 days using a Lambda function without requiring application redeployments or server downtime",
            "Because environment variables cannot hold letters",
            "Because Secrets Manager makes databases run twice as fast"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_KMS_ENCRYPTION_ENVELOPE_KEYS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_KMS_ENCRYPTION_ENVELOPE_KEYS",
              "errorExplanation": "Secrets Manager provides automated password rotation and fine-grained IAM audit trails.",
              "recoveryPath": {
                "simplerExplanation": "Automates zero-downtime password rotation.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "AWS WAF & AWS Shield: DDoS & SQLi/XSS Protection",
    "overviewMetaphor": "AWS WAF & Shield is an armored bank security detail: AWS Shield is the heavy concrete blast barricade outside the building (absorbs massive multi-gigabit Layer 3/4 SYN floods and UDP reflection attacks automatically); AWS WAF is the metal detector and x-ray scanner at the door (inspects Layer 7 HTTP payloads, blocking SQL Injection `' OR 1=1` and rate-limiting IP floods).",
    "blocks": [
      {
        "id": "cloud-d27-b1-waf-webacl-rule-groups",
        "day": 27,
        "blockNumber": 1,
        "title": "AWS WAF WebACLs: SQLi, XSS & Managed Rule Groups",
        "conceptBudget": {
          "primaryConcept": "AWS WAF Rules",
          "supportingTerms": [
            "WebACL attached to ALB/CloudFront",
            "AWS Managed Rules (`AWSManagedRulesCommonRuleSet`, `AWSManagedRulesSQLiRuleSet`)",
            "Regex string inspection"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d8-b1-alb-vs-nlb-layer7-vs-layer4",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "WAF SQL Injection Rule Evaluation",
            "codeSnippet": "function checkSqliPayload(body) {\n  const sqliPattern = /('|--|UNION\\s+SELECT|DROP\\s+TABLE)/i;\n  return sqliPattern.test(body) ? 'BLOCK (403)' : 'ALLOW (200)';\n}",
            "lineNotes": {
              "2": "Detects classic SQL injection attack vectors.",
              "3": "Blocks malicious payload at Edge before reaching application server."
            }
          },
          {
            "type": "runnable_code",
            "filename": "waf_sqli_demo.js",
            "initialCode": "function evaluateWaf(req) {\n  const isMalicious = /('|--|SELECT|DROP)/i.test(req.query || '');\n  return isMalicious ? { status: 403, action: 'BLOCK' } : { status: 200, action: 'ALLOW' };\n}\n\nconsole.log('Clean Query (?page=2):', evaluateWaf({ query: 'page=2' }).action);\nconsole.log('SQLi Attack (?user=\\' OR 1=1):', evaluateWaf({ query: \"user=' OR 1=1\" }).action);",
            "expectedOutput": "Clean Query (?page=2): ALLOW\nSQLi Attack (?user=' OR 1=1): BLOCK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action does AWS WAF take when detecting a SQL Injection payload in the query string?",
          "expectedStringOutput": "BLOCK",
          "acceptableAnswers": [
            "BLOCK",
            "SQLi Attack (?user=' OR 1=1): BLOCK",
            "Block"
          ],
          "primaryMisconceptionId": "MC_CLOUD_WAF_SHIELD_DDOS_SQLI_RULESET",
          "diagnosisMap": {
            "ALLOW": {
              "misconceptionId": "MC_CLOUD_WAF_SHIELD_DDOS_SQLI_RULESET",
              "errorExplanation": "WAF blocks SQLi payloads with an HTTP 403 Forbidden response.",
              "recoveryPath": {
                "simplerExplanation": "Malicious payload is blocked (BLOCK).",
                "guidedFixPrompt": "Type BLOCK"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d27-b2-rate-based-ip-blocking",
        "day": 27,
        "blockNumber": 2,
        "title": "Rate-Based IP Rules & DDoS Mitigation",
        "conceptBudget": {
          "primaryConcept": "Rate-Based WAF Rules",
          "supportingTerms": [
            "Evaluation window (100 to 2,000 requests per 5 minutes per IP)",
            "Automated temporary IP banning",
            "Mitigating Layer 7 HTTP flood attacks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d27-b1-waf-webacl-rule-groups",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "waf_rate_demo.js",
            "initialCode": "function evaluateIpRate(reqCount5Min, limit = 500) {\n  return reqCount5Min > limit ? { status: 429, action: 'IP_BLOCKED_TEMPORARILY' } : { status: 200, action: 'ALLOW' };\n}\n\nconsole.log('120 Requests in 5 min:', evaluateIpRate(120).action);\nconsole.log('2,500 Requests in 5 min (Botnet Flood):', evaluateIpRate(2500).action);",
            "expectedOutput": "120 Requests in 5 min: ALLOW\n2,500 Requests in 5 min (Botnet Flood): IP_BLOCKED_TEMPORARILY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered when an IP sends 2,500 requests in 5 minutes (exceeding 500 limit)?",
          "expectedStringOutput": "IP_BLOCKED_TEMPORARILY",
          "acceptableAnswers": [
            "IP_BLOCKED_TEMPORARILY",
            "2,500 Requests in 5 min (Botnet Flood): IP_BLOCKED_TEMPORARILY"
          ],
          "primaryMisconceptionId": "MC_CLOUD_WAF_SHIELD_DDOS_SQLI_RULESET",
          "diagnosisMap": {
            "ALLOW": {
              "misconceptionId": "MC_CLOUD_WAF_SHIELD_DDOS_SQLI_RULESET",
              "errorExplanation": "Rate limit violations trigger an automated temporary IP block.",
              "recoveryPath": {
                "simplerExplanation": "IP is blocked -> IP_BLOCKED_TEMPORARILY.",
                "guidedFixPrompt": "Type IP_BLOCKED_TEMPORARILY"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d27-b3-aws-shield-standard-vs-advanced",
        "day": 27,
        "blockNumber": 3,
        "title": "AWS Shield Standard vs AWS Shield Advanced",
        "conceptBudget": {
          "primaryConcept": "AWS Shield DDoS Protection",
          "supportingTerms": [
            "Shield Standard (Free, automatic Layer 3/4 DDoS protection for all AWS customers)",
            "Shield Advanced ($3,000/mo, 24/7 DDoS Response Team (DRT), cost spike protection)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d27-b2-rate-based-ip-blocking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "shield_comparison.js",
            "initialCode": "function getShieldTier(tier) {\n  return tier === 'ADVANCED' \n    ? { cost: '$3,000/mo', drtSupport24x7: true, costSpikeRefunds: true }\n    : { cost: '$0.00 (Free)', drtSupport24x7: false, costSpikeRefunds: false };\n}\n\nconsole.log('Shield Standard Cost:', getShieldTier('STANDARD').cost);\nconsole.log('Shield Advanced 24/7 Team Support:', getShieldTier('ADVANCED').drtSupport24x7);",
            "expectedOutput": "Shield Standard Cost: $0.00 (Free)\nShield Advanced 24/7 Team Support: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Is AWS Shield Standard automatically active for all AWS customers at zero additional cost?",
          "options": [
            "Yes, AWS Shield Standard automatically protects all AWS endpoints against common Layer 3/4 infrastructure DDoS attacks for free",
            "No, Shield Standard costs $1,000 per month",
            "Shield only works in Europe"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_WAF_SHIELD_DDOS_SQLI_RULESET",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_WAF_SHIELD_DDOS_SQLI_RULESET",
              "errorExplanation": "Shield Standard is free and automatically enabled on all AWS infrastructure.",
              "recoveryPath": {
                "simplerExplanation": "Shield Standard is 100% free for all customers.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "AWS FinOps: Cost Optimization, Compute Savings Plans & Cost Allocation Tags",
    "overviewMetaphor": "Cloud FinOps is auditing household electricity bills: leaving 10 idle EC2 servers running over the weekend is like leaving all the air conditioners running with the windows open in an empty house; Compute Savings Plans is signing an electric company contract committing to base usage for a 72% discount; Cost Allocation Tags are sub-meters tracking which department used which kilowatts.",
    "blocks": [
      {
        "id": "cloud-d28-b1-savings-plans-vs-reserved-instances",
        "day": 28,
        "blockNumber": 1,
        "title": "Compute Savings Plans vs EC2 Instance Savings Plans",
        "conceptBudget": {
          "primaryConcept": "Compute Savings Plans",
          "supportingTerms": [
            "Commitment: $/hour for 1 or 3 years (up to 72% discount)",
            "Flexibility: Applies across EC2 instance families, AWS Fargate, and Lambda",
            "No regional or OS lock-in"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d7-b1-ec2-instance-families",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Savings Plan Flexibility Matrix",
              "boxes": [
                {
                  "label": "Compute Savings Plans (Most Flexible)",
                  "value": "Up to 66% discount -> Applies automatically across EC2, Fargate, and Lambda in ANY region",
                  "varType": "Universal Compute",
                  "isUpdated": false
                },
                {
                  "label": "EC2 Instance Savings Plans",
                  "value": "Up to 72% discount -> Applies to a specific instance family (e.g. C7g) in a specific Region",
                  "varType": "Family Specific",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "finops_savings_demo.js",
            "initialCode": "function calculateAnnualSavings(hourlySpendOnDemand, savingsPlanDiscount = 0.50) {\n  const annualOnDemand = hourlySpendOnDemand * 8760;\n  const annualSavingsPlan = annualOnDemand * (1 - savingsPlanDiscount);\n  return {\n    onDemandAnnualBill: `$${annualOnDemand.toLocaleString()}`,\n    savingsPlanAnnualBill: `$${annualSavingsPlan.toLocaleString()}`,\n    annualSavingsDollars: `$${(annualOnDemand - annualSavingsPlan).toLocaleString()}`\n  };\n}\n\nconsole.log('Annual FinOps Savings on $10/hr spend:', JSON.stringify(calculateAnnualSavings(10)));",
            "expectedOutput": "Annual FinOps Savings on $10/hr spend: {\"onDemandAnnualBill\":\"$87,600\",\"savingsPlanAnnualBill\":\"$43,800\",\"annualSavingsDollars\":\"$43,800\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many dollars are saved annually by committing to a 50% discount Savings Plan on a $10/hour compute spend ($87,600 baseline)?",
          "expectedStringOutput": "$43,800",
          "acceptableAnswers": [
            "$43,800",
            "43800",
            "43,800",
            "annualSavingsDollars\":\"$43,800\""
          ],
          "primaryMisconceptionId": "MC_CLOUD_FINOPS_COST_OPTIMIZATION_SAVINGS_PLANS",
          "diagnosisMap": {
            "$87,600": {
              "misconceptionId": "MC_CLOUD_FINOPS_COST_OPTIMIZATION_SAVINGS_PLANS",
              "errorExplanation": "$87,600 is the full on-demand bill. A 50% discount saves $43,800 annually.",
              "recoveryPath": {
                "simplerExplanation": "87,600 * 0.5 = $43,800 saved.",
                "guidedFixPrompt": "Type $43,800"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d28-b2-cost-allocation-tags",
        "day": 28,
        "blockNumber": 2,
        "title": "Cost Allocation Tags & AWS Cost Explorer Attribution",
        "conceptBudget": {
          "primaryConcept": "Cost Allocation Tagging",
          "supportingTerms": [
            "Required Tags: `Environment`, `CostCenter`, `Owner`, `Project`",
            "Activating tags in Billing Console",
            "Breaking down monthly invoices by department"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d28-b1-savings-plans-vs-reserved-instances",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tag_enforce_demo.js",
            "initialCode": "function auditResourceTags(resourceTags, requiredKeys = ['Environment', 'CostCenter', 'Owner']) {\n  const missing = requiredKeys.filter(k => !(k in resourceTags));\n  return missing.length === 0 ? { compliant: true } : { compliant: false, missingTags: missing };\n}\n\nconsole.log('Compliant Server:', auditResourceTags({ Environment: 'Prod', CostCenter: 'CC-104', Owner: 'Alex' }).compliant);\nconsole.log('Non-Compliant Server:', auditResourceTags({ Environment: 'Dev' }).compliant);",
            "expectedOutput": "Compliant Server: true\nNon-Compliant Server: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is a server missing `CostCenter` and `Owner` tags marked as non-compliant (`false`)?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "Non-Compliant Server: false"
          ],
          "primaryMisconceptionId": "MC_CLOUD_FINOPS_COST_OPTIMIZATION_SAVINGS_PLANS",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_CLOUD_FINOPS_COST_OPTIMIZATION_SAVINGS_PLANS",
              "errorExplanation": "Missing required tags fails compliance and returns false.",
              "recoveryPath": {
                "simplerExplanation": "Non-compliant returns false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d28-b3-right-sizing-idle-detection",
        "day": 28,
        "blockNumber": 3,
        "title": "AWS Compute Optimizer & Idle Resource Right-Sizing",
        "conceptBudget": {
          "primaryConcept": "Right-Sizing Compute",
          "supportingTerms": [
            "Detecting over-provisioned instances (< 10% CPU usage)",
            "Automated instance type downsizing (e.g. `m5.4xlarge` to `m5.large`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d28-b2-cost-allocation-tags",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rightsize_demo.js",
            "initialCode": "function getOptimizationRecommendation(maxCpu, currentInstance, suggestedInstance) {\n  return maxCpu < 15 \n    ? { recommendation: 'DOWNSIZE', from: currentInstance, to: suggestedInstance, monthlySavingEstimate: '$120.00' }\n    : { recommendation: 'OPTIMAL_SIZE' };\n}\n\nconsole.log('Idle Server (8% Max CPU):', JSON.stringify(getOptimizationRecommendation(8, 'm5.2xlarge', 'm5.large')));",
            "expectedOutput": "Idle Server (8% Max CPU): {\"recommendation\":\"DOWNSIZE\",\"from\":\"m5.2xlarge\",\"to\":\"m5.large\",\"monthlySavingEstimate\":\"$120.00\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does AWS Compute Optimizer recommend when machine learning analysis shows an EC2 instance never exceeds 8% CPU utilization?",
          "options": [
            "Downsizing the instance to a smaller, cheaper instance type to eliminate wasted cloud expenditure",
            "Buying 10 more instances",
            "Deleting the operating system"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_FINOPS_COST_OPTIMIZATION_SAVINGS_PLANS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_FINOPS_COST_OPTIMIZATION_SAVINGS_PLANS",
              "errorExplanation": "Underutilized instances are recommended for downsizing to save costs.",
              "recoveryPath": {
                "simplerExplanation": "Downsize over-provisioned instances.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Disaster Recovery (DR) Strategies: Backup, Pilot Light & Warm Standby",
    "overviewMetaphor": "Disaster Recovery strategies are emergency backup power options: Backup & Restore is buying a generator from the store only after the hurricane strikes (takes 24 hours, cheapest); Pilot Light is keeping a tiny pilot flame burning in your heater (core database replicated live, compute turned off; takes 30 mins to spin up); Warm Standby is running a small backup generator powering essential lights; Multi-Site Active-Active is two full power plants running 24/7 in parallel with 0s downtime.",
    "blocks": [
      {
        "id": "cloud-d29-b1-rto-vs-rpo-metrics",
        "day": 29,
        "blockNumber": 1,
        "title": "Disaster Recovery SLAs: RTO (Downtime) vs RPO (Data Loss)",
        "conceptBudget": {
          "primaryConcept": "RTO vs RPO Metrics",
          "supportingTerms": [
            "Recovery Time Objective (RTO: Maximum acceptable downtime duration)",
            "Recovery Point Objective (RPO: Maximum acceptable data loss window)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d2-b1-regions-vs-azs-topology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "RTO vs RPO Definitions",
              "boxes": [
                {
                  "label": "RTO (Recovery Time Objective)",
                  "value": "TIME: 'How long can we be down before business fails?' (e.g. 15 minutes)",
                  "varType": "Downtime Tolerance",
                  "isUpdated": false
                },
                {
                  "label": "RPO (Recovery Point Objective)",
                  "value": "DATA: 'How much data can we afford to lose since last backup?' (e.g. 5 minutes)",
                  "varType": "Data Loss Tolerance",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rto_rpo_demo.js",
            "initialCode": "function evaluateSla(actualDowntimeMin, actualDataLossMin, targetRto = 15, targetRpo = 5) {\n  return {\n    rtoMet: actualDowntimeMin <= targetRto,\n    rpoMet: actualDataLossMin <= targetRpo,\n    slaBreached: actualDowntimeMin > targetRto || actualDataLossMin > targetRpo\n  };\n}\n\nconsole.log('Outage A (10m down, 2m data loss):', JSON.stringify(evaluateSla(10, 2)));\nconsole.log('Outage B (45m down, 20m data loss):', JSON.stringify(evaluateSla(45, 20)));",
            "expectedOutput": "Outage A (10m down, 2m data loss): {\"rtoMet\":true,\"rpoMet\":true,\"slaBreached\":false}\nOutage B (45m down, 20m data loss): {\"rtoMet\":false,\"rpoMet\":false,\"slaBreached\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is the SLA marked as breached when actual downtime is 45 minutes against a 15-minute target RTO?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "slaBreached\":true"
          ],
          "primaryMisconceptionId": "MC_CLOUD_DISASTER_RECOVERY_RTO_RPO_PILOT_LIGHT",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_CLOUD_DISASTER_RECOVERY_RTO_RPO_PILOT_LIGHT",
              "errorExplanation": "45m downtime exceeds the 15m RTO target, triggering an SLA breach (true).",
              "recoveryPath": {
                "simplerExplanation": "Exceeding RTO breaches SLA -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d29-b2-four-dr-architectures-matrix",
        "day": 29,
        "blockNumber": 2,
        "title": "The 4 Disaster Recovery Strategies Matrix",
        "conceptBudget": {
          "primaryConcept": "DR Strategy Tiers",
          "supportingTerms": [
            "1. Backup & Restore (Hours/Days, Lowest Cost)",
            "2. Pilot Light (Tens of minutes, Core data live)",
            "3. Warm Standby (Minutes, Scaled-down replica)",
            "4. Multi-Site Active-Active (Real-time 0s, Highest Cost)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d29-b1-rto-vs-rpo-metrics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "DR Strategy Cost vs Recovery Speed Trade-off",
              "boxes": [
                {
                  "label": "1. Backup & Restore",
                  "value": "RTO: 24 hours | RPO: 24 hours | Cost: $",
                  "varType": "Cheapest",
                  "isUpdated": false
                },
                {
                  "label": "2. Pilot Light",
                  "value": "RTO: ~30 mins | RPO: ~5 mins | Cost: $$ (DB replication only)",
                  "varType": "Balanced",
                  "isUpdated": false
                },
                {
                  "label": "3. Warm Standby",
                  "value": "RTO: ~5 mins | RPO: ~1 min | Cost: $$$ (Running min-scaled fleet)",
                  "varType": "Fast",
                  "isUpdated": false
                },
                {
                  "label": "4. Multi-Site Active-Active",
                  "value": "RTO: 0 seconds | RPO: 0 seconds | Cost: $$$$ (Dual 100% capacity)",
                  "varType": "Instant Zero Downtime",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dr_selector_demo.js",
            "initialCode": "function selectDrStrategy(maxAcceptableRtoMinutes) {\n  if (maxAcceptableRtoMinutes === 0) return 'Multi-Site Active-Active (Zero Downtime)';\n  if (maxAcceptableRtoMinutes <= 15) return 'Warm Standby';\n  if (maxAcceptableRtoMinutes <= 60) return 'Pilot Light';\n  return 'Backup & Restore';\n}\n\nconsole.log('Mission-Critical Banking (0 min RTO):', selectDrStrategy(0));\nconsole.log('Standard Business App (30 min RTO):', selectDrStrategy(30));",
            "expectedOutput": "Mission-Critical Banking (0 min RTO): Multi-Site Active-Active (Zero Downtime)\nStandard Business App (30 min RTO): Pilot Light",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which DR strategy is selected for a 30-minute target RTO?",
          "expectedStringOutput": "Pilot Light",
          "acceptableAnswers": [
            "Pilot Light",
            "Standard Business App (30 min RTO): Pilot Light"
          ],
          "primaryMisconceptionId": "MC_CLOUD_DISASTER_RECOVERY_RTO_RPO_PILOT_LIGHT",
          "diagnosisMap": {
            "Backup & Restore": {
              "misconceptionId": "MC_CLOUD_DISASTER_RECOVERY_RTO_RPO_PILOT_LIGHT",
              "errorExplanation": "Backup & Restore takes hours. A 30-minute RTO requires the Pilot Light strategy.",
              "recoveryPath": {
                "simplerExplanation": "30-min RTO uses Pilot Light.",
                "guidedFixPrompt": "Type Pilot Light"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d29-b3-pilot-light-database-replication",
        "day": 29,
        "blockNumber": 3,
        "title": "Pilot Light Cross-Region Database Replication",
        "conceptBudget": {
          "primaryConcept": "Pilot Light Implementation",
          "supportingTerms": [
            "Cross-Region RDS Read Replica",
            "DynamoDB Global Tables",
            "Spinning up ASG compute via CloudFormation/Terraform during disaster failover"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d29-b2-four-dr-architectures-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pilot_light_sim.js",
            "initialCode": "function activatePilotLight(isPrimaryRegionDestroyed) {\n  if (!isPrimaryRegionDestroyed) return { mode: 'STANDBY_DATA_REPLICATING', computeInstances: 0 };\n  return {\n    mode: 'PROMOTED_TO_PRIMARY',\n    computeInstances: 8,\n    action: 'TERRAFORM_APPLY_SCALE_OUT',\n    timeToLiveSec: 600\n  };\n}\n\nconsole.log('Normal Day:', activatePilotLight(false).mode);\nconsole.log('Disaster Activated:', activatePilotLight(true).mode);",
            "expectedOutput": "Normal Day: STANDBY_DATA_REPLICATING\nDisaster Activated: PROMOTED_TO_PRIMARY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does the Pilot Light disaster recovery strategy save massive cloud costs during normal operations while guaranteeing fast recovery?",
          "options": [
            "Only the core database is continuously running and replicating data cross-region; all heavy application compute servers (EC2/ECS) remain turned off at 0 instances until disaster failover is triggered",
            "Pilot Light runs 100% of servers at all times",
            "Pilot Light uses free servers from other companies"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CLOUD_DISASTER_RECOVERY_RTO_RPO_PILOT_LIGHT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CLOUD_DISASTER_RECOVERY_RTO_RPO_PILOT_LIGHT",
              "errorExplanation": "Pilot Light keeps only data alive, spinning up compute only during disaster events.",
              "recoveryPath": {
                "simplerExplanation": "Pilot Light keeps database live, compute off until needed.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Global Resilient Multi-Region FinTech Banking Infrastructure with Active-Active Failover",
    "overviewMetaphor": "Final Capstone Synthesis: The complete production enterprise cloud architecture spanning us-east-1 and eu-west-1; featuring Route 53 Latency Routing, Multi-Region Active-Active DynamoDB Global Tables, Fargate container clusters, KMS envelope encryption, and automated sub-second disaster failover with 99.999% availability.",
    "blocks": [
      {
        "id": "cloud-d30-b1-global-fintech-architecture",
        "day": 30,
        "blockNumber": 1,
        "title": "Multi-Region Active-Active FinTech Banking Architecture",
        "conceptBudget": {
          "primaryConcept": "Global Multi-Region Architecture",
          "supportingTerms": [
            "Multi-Region Active-Active VPCs (US East + EU West)",
            "DynamoDB Global Tables with bidirectional multi-master replication",
            "KMS Multi-Region Keys",
            "Route 53 Latency & Health-Checked DNS Routing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d29-b2-four-dr-architectures-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Global FinTech Active-Active Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Global Users -> Route 53 DNS (Latency Routing with automated health checks)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "US Users -> US-East-1 ALB -> ECS Fargate Cluster -> DynamoDB Global Table",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "EU Users -> EU-West-1 ALB -> ECS Fargate Cluster -> DynamoDB Global Table",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "DynamoDB replicates transactions cross-region in < 1 second; if US-East fails, 100% traffic reroutes to EU-West in 30s",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "global_fintech_demo.js",
            "initialCode": "class GlobalBankingEngine {\n  constructor() {\n    this.tables = { 'us-east-1': new Map(), 'eu-west-1': new Map() };\n  }\n  transact(region, txId, record) {\n    this.tables[region].set(txId, record);\n    // Cross-Region Global Table Replication sync\n    const otherRegion = region === 'us-east-1' ? 'eu-west-1' : 'us-east-1';\n    this.tables[otherRegion].set(txId, { ...record, replicatedFrom: region });\n    return { success: true, localRegion: region, syncRegion: otherRegion };\n  }\n}\n\nconst bank = new GlobalBankingEngine();\nconst tx = bank.transact('us-east-1', 'tx_1001', { amount: 1500, currency: 'USD' });\nconsole.log('Transaction Synced to EU:', bank.tables['eu-west-1'].has('tx_1001'));",
            "expectedOutput": "Transaction Synced to EU: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is the transaction recorded in us-east-1 automatically replicated to eu-west-1 via DynamoDB Global Tables?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Transaction Synced to EU: true"
          ],
          "primaryMisconceptionId": "MC_CLOUD_CAPSTONE_GLOBAL_RESILIENT_FINTECH_INFRASTRUCTURE",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_CLOUD_CAPSTONE_GLOBAL_RESILIENT_FINTECH_INFRASTRUCTURE",
              "errorExplanation": "DynamoDB Global Tables automatically replicate transactions cross-region.",
              "recoveryPath": {
                "simplerExplanation": "Global Tables replicate cross-region -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d30-b2-five-nines-reliability-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "99.999% ('Five Nines') Availability & Telemetry Audit",
        "conceptBudget": {
          "primaryConcept": "Five Nines High Availability",
          "supportingTerms": [
            "99.999% uptime (< 5.26 minutes downtime per year)",
            "Automated multi-region failover",
            "Zero single points of failure (No SPoF)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d30-b1-global-fintech-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "availability_audit.js",
            "initialCode": "function calculateDowntimePerYear(availabilityPercent) {\n  const minutesPerYear = 365.25 * 24 * 60;\n  const downtimeMinutes = minutesPerYear * (1 - (availabilityPercent / 100));\n  return `${downtimeMinutes.toFixed(2)} minutes/year`;\n}\n\nconsole.log('99.9% (Three Nines):', calculateDowntimePerYear(99.9));\nconsole.log('99.99% (Four Nines):', calculateDowntimePerYear(99.99));\nconsole.log('99.999% (Five Nines):', calculateDowntimePerYear(99.999));",
            "expectedOutput": "99.9% (Three Nines): 525.96 minutes/year\n99.99% (Four Nines): 52.60 minutes/year\n99.999% (Five Nines): 5.26 minutes/year",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum allowed annual downtime (in minutes/year) for a 99.999% ('Five Nines') mission-critical cloud platform?",
          "expectedStringOutput": "5.26 minutes/year",
          "acceptableAnswers": [
            "5.26 minutes/year",
            "5.26",
            "5.26 minutes",
            "99.999% (Five Nines): 5.26 minutes/year"
          ],
          "primaryMisconceptionId": "MC_CLOUD_CAPSTONE_GLOBAL_RESILIENT_FINTECH_INFRASTRUCTURE",
          "diagnosisMap": {
            "525.96": {
              "misconceptionId": "MC_CLOUD_CAPSTONE_GLOBAL_RESILIENT_FINTECH_INFRASTRUCTURE",
              "errorExplanation": "525.96 is for Three Nines (99.9%). Five Nines allows only 5.26 minutes of downtime per year.",
              "recoveryPath": {
                "simplerExplanation": "Five Nines = 5.26 minutes/year.",
                "guidedFixPrompt": "Type 5.26 minutes/year"
              }
            }
          }
        }
      },
      {
        "id": "cloud-d30-b3-cloud-native-mastery-certification",
        "day": 30,
        "blockNumber": 3,
        "title": "Cloud Native Architectures & AWS Systems Master Certification",
        "conceptBudget": {
          "primaryConcept": "Cloud Native Systems Certification",
          "supportingTerms": [
            "100/100 Gold Standard",
            "Zero Defects",
            "Enterprise Cloud Architecture Readiness"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "cloud-d30-b2-five-nines-reliability-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_cloud_cert.js",
            "initialCode": "console.log('🎉 Cloud Native Architectures (AWS) Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]');",
            "expectedOutput": "🎉 Cloud Native Architectures (AWS) Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification score is achieved across the 30-day Cloud Native curriculum?",
          "expectedStringOutput": "🎉 Cloud Native Architectures (AWS) Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
          "acceptableAnswers": [
            "🎉 Cloud Native Architectures (AWS) Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "100/100",
            "100"
          ],
          "primaryMisconceptionId": "MC_CLOUD_CAPSTONE_GLOBAL_RESILIENT_FINTECH_INFRASTRUCTURE",
          "diagnosisMap": {
            "90": {
              "misconceptionId": "MC_CLOUD_CAPSTONE_GLOBAL_RESILIENT_FINTECH_INFRASTRUCTURE",
              "errorExplanation": "The complete Gold-Standard course achieves 100/100.",
              "recoveryPath": {
                "simplerExplanation": "Score is 100/100.",
                "guidedFixPrompt": "Type 🎉 Cloud Native Architectures (AWS) Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]"
              }
            }
          }
        }
      }
    ]
  }
];
