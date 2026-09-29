import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';
import { CLOUD_30_DAYS_CONFIGS } from './cloud30DayData';

/**
 * Cloud Engineering in Python (course-cloud-python), for the Python track.
 *
 * The same 30 days and topics as Cloud Native Architectures (AWS) (course-cloud-native), but every
 * practice task is written and checked in Python. The lessons are the long Python lessons (longLessons.ts).
 * Checks are plain `assert` statements run after the student's code; the reference answers live in
 * tests/fixtures/cloud_python_solutions.json, not here, so students never download them.
 */
type Task = { title: string; desc: string; starter: string; hint: string; test: string };
type Day = { e: Task; a: Task };

const DAYS: Day[] = [
  {
    "e": {
      "title": "Shared Responsibility Owner",
      "desc": "Write `responsibility_owner(layer, model)` that returns 'AWS' or 'CUSTOMER'. The layers from the bottom up are: 'PHYSICAL_DATACENTER', 'HYPERVISOR', 'OS_PATCHING', 'RUNTIME', 'APPLICATION_CODE', 'DATA'. With 'IaaS' AWS owns the first 2 layers; with 'PaaS' the first 4; with 'SaaS' the first 5. The customer always owns 'DATA'.",
      "starter": "LAYERS = ['PHYSICAL_DATACENTER', 'HYPERVISOR', 'OS_PATCHING', 'RUNTIME', 'APPLICATION_CODE', 'DATA']\n\n\ndef responsibility_owner(layer, model):\n    # AWS owns the bottom 2 layers (IaaS), 4 (PaaS) or 5 (SaaS)\n    pass",
      "hint": "aws_layers = {'IaaS': 2, 'PaaS': 4, 'SaaS': 5}[model]; return 'AWS' if LAYERS.index(layer) < aws_layers else 'CUSTOMER'",
      "test": "assert responsibility_owner('PHYSICAL_DATACENTER', 'IaaS') == 'AWS', 'AWS always runs the buildings'\nassert responsibility_owner('OS_PATCHING', 'IaaS') == 'CUSTOMER', 'On EC2 (IaaS) you patch the operating system'\nassert responsibility_owner('OS_PATCHING', 'PaaS') == 'AWS', 'On RDS (PaaS) AWS patches the operating system'\nassert responsibility_owner('APPLICATION_CODE', 'PaaS') == 'CUSTOMER', 'On PaaS your code is still yours'\nassert responsibility_owner('APPLICATION_CODE', 'SaaS') == 'AWS', 'On SaaS the vendor writes the application'\nassert responsibility_owner('DATA', 'SaaS') == 'CUSTOMER', 'Your data is always yours'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Cloud Model Categorizer",
      "desc": "Write `cloud_model(service)` that returns 'IaaS', 'PaaS' or 'SaaS' for an AWS service name. IaaS: 'EC2', 'EBS', 'VPC'. PaaS: 'RDS', 'Lambda', 'Elastic Beanstalk', 'DynamoDB'. SaaS: 'WorkDocs', 'Chime', 'QuickSight'. Any other name returns 'UNKNOWN'.",
      "starter": "def cloud_model(service):\n    pass",
      "hint": "Keep a dict from service name to model and use .get(service, 'UNKNOWN').",
      "test": "assert cloud_model('EC2') == 'IaaS', 'EC2 gives you a virtual machine: IaaS'\nassert cloud_model('RDS') == 'PaaS', 'RDS runs the database for you: PaaS'\nassert cloud_model('Lambda') == 'PaaS', 'Lambda runs your function: PaaS'\nassert cloud_model('WorkDocs') == 'SaaS', 'WorkDocs is a finished application: SaaS'\nassert cloud_model('Minecraft') == 'UNKNOWN', 'Unknown names return UNKNOWN'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Multi-AZ Fault Tolerance Check",
      "desc": "Write `is_fault_tolerant(nodes)` where nodes is a list of dicts like {'id': 'i-1', 'az': 'us-east-1a'}. Return True only when the nodes span at least 2 different Availability Zones.",
      "starter": "def is_fault_tolerant(nodes):\n    pass",
      "hint": "Put every node['az'] into a set and check len(...) >= 2.",
      "test": "single = [{'id': 'i-1', 'az': 'us-east-1a'}, {'id': 'i-2', 'az': 'us-east-1a'}]\nmulti = [{'id': 'i-1', 'az': 'us-east-1a'}, {'id': 'i-2', 'az': 'us-east-1b'}]\nassert is_fault_tolerant(single) is False, 'Two servers in one AZ fail together'\nassert is_fault_tolerant(multi) is True, 'Two AZs survive one AZ outage'\nassert is_fault_tolerant([]) is False, 'No servers is not fault tolerant'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Region Code Validator",
      "desc": "Write `is_valid_region(code)` that returns True for AWS region codes shaped like 'us-east-1', 'eu-west-2', 'ap-south-1' or 'ap-southeast-1': a 2-letter lowercase area, a dash, a lowercase direction word (north, south, east, west, central, northeast, northwest, southeast, southwest), a dash and a number. Anything else returns False.",
      "starter": "import re\n\n\ndef is_valid_region(code):\n    pass",
      "hint": "re.fullmatch(r'[a-z]{2}-(north|south|east|west|central|northeast|northwest|southeast|southwest)-\\d+', code) is not None",
      "test": "assert is_valid_region('us-east-1') is True, 'us-east-1 is a real region'\nassert is_valid_region('ap-south-1') is True, 'ap-south-1 (Mumbai) is a real region'\nassert is_valid_region('ap-southeast-2') is True, 'ap-southeast-2 (Sydney) is a real region'\nassert is_valid_region('invalid-region') is False, 'Not a region code'\nassert is_valid_region('US-EAST-1') is False, 'Region codes are lowercase'\nassert is_valid_region('us-east-1a') is False, 'us-east-1a is an Availability Zone, not a region'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Subnet Usable IP Calculator",
      "desc": "Write `usable_subnet_ips(mask)` for a subnet with CIDR mask /mask. The subnet has 2 ** (32 - mask) addresses and AWS reserves 5 of them in every subnet. Return the number left. AWS subnets must be between /16 and /28; for any other mask return 0.",
      "starter": "def usable_subnet_ips(mask):\n    pass",
      "hint": "if not 16 <= mask <= 28: return 0; return 2 ** (32 - mask) - 5",
      "test": "assert usable_subnet_ips(24) == 251, '/24 has 256 addresses, minus 5 = 251'\nassert usable_subnet_ips(28) == 11, '/28 has 16 addresses, minus 5 = 11'\nassert usable_subnet_ips(16) == 65531, '/16 has 65,536 addresses, minus 5'\nassert usable_subnet_ips(30) == 0, 'AWS does not allow subnets smaller than /28'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Public Route Table Inspector",
      "desc": "Write `has_internet_route(routes)` where routes is a list of dicts like {'destination': '0.0.0.0/0', 'target': 'igw-123'}. Return True when a route sends '0.0.0.0/0' to a target whose id starts with 'igw-' (an internet gateway). That is what makes a subnet public.",
      "starter": "def has_internet_route(routes):\n    pass",
      "hint": "any(r['destination'] == '0.0.0.0/0' and r['target'].startswith('igw-') for r in routes)",
      "test": "public = [{'destination': '10.0.0.0/16', 'target': 'local'}, {'destination': '0.0.0.0/0', 'target': 'igw-123'}]\nprivate = [{'destination': '10.0.0.0/16', 'target': 'local'}, {'destination': '0.0.0.0/0', 'target': 'nat-123'}]\nassert has_internet_route(public) is True, 'A default route to an igw- target makes the subnet public'\nassert has_internet_route(private) is False, 'A NAT gateway route keeps the subnet private'\nassert has_internet_route([{'destination': '10.1.0.0/16', 'target': 'igw-9'}]) is False, 'Only the 0.0.0.0/0 route counts'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Security Group Traffic Check",
      "desc": "Write `security_group_allows(rules, traffic)`. rules is a list like {'protocol': 'TCP', 'from_port': 443, 'to_port': 443}. traffic is a dict like {'protocol': 'TCP', 'port': 443}, and it may have 'is_return': True. Security groups are stateful: return traffic is always allowed. Otherwise return True only if a rule has the same protocol and from_port <= port <= to_port.",
      "starter": "def security_group_allows(rules, traffic):\n    pass",
      "hint": "if traffic.get('is_return'): return True; then any(rule matches protocol and port range)",
      "test": "rules = [{'protocol': 'TCP', 'from_port': 443, 'to_port': 443}, {'protocol': 'TCP', 'from_port': 8000, 'to_port': 8100}]\nassert security_group_allows(rules, {'protocol': 'TCP', 'port': 443}) is True, 'HTTPS on 443 is allowed'\nassert security_group_allows(rules, {'protocol': 'TCP', 'port': 8050}) is True, '8050 is inside the 8000-8100 range'\nassert security_group_allows(rules, {'protocol': 'TCP', 'port': 80}) is False, 'Port 80 has no rule'\nassert security_group_allows(rules, {'protocol': 'UDP', 'port': 443}) is False, 'The protocol must match too'\nassert security_group_allows([], {'protocol': 'TCP', 'port': 51000, 'is_return': True}) is True, 'Stateful: replies are always allowed'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Network ACL Decision",
      "desc": "Write `nacl_decision(rules, port)`. Each rule is {'rule_number': 100, 'port': 22, 'action': 'ALLOW' or 'DENY'}; a rule with 'port': '*' matches every port. Network ACLs check rules from the lowest rule_number up and the first match wins. Return that rule's action, or 'DENY' when nothing matches (the hidden final rule).",
      "starter": "def nacl_decision(rules, port):\n    pass",
      "hint": "for rule in sorted(rules, key=lambda r: r['rule_number']): if rule['port'] in ('*', port): return rule['action']",
      "test": "rules = [\n    {'rule_number': 200, 'port': '*', 'action': 'ALLOW'},\n    {'rule_number': 100, 'port': 22, 'action': 'DENY'},\n    {'rule_number': 150, 'port': 443, 'action': 'ALLOW'},\n]\nassert nacl_decision(rules, 22) == 'DENY', 'Rule 100 (DENY 22) is checked before rule 200'\nassert nacl_decision(rules, 443) == 'ALLOW', 'Rule 150 allows 443'\nassert nacl_decision(rules, 3306) == 'ALLOW', 'Rule 200 allows everything else'\nassert nacl_decision([{'rule_number': 100, 'port': 443, 'action': 'ALLOW'}], 22) == 'DENY', 'No match means the final DENY'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "VPC Topology Validator",
      "desc": "Write `validate_vpc(vpc)`. vpc has 'has_internet_gateway', 'has_nat_gateway' and 'subnets' (a list of {'id', 'az', 'type'} where type is 'PUBLIC' or 'PRIVATE'). Return {'valid': ..., 'az_count': ..., 'problems': [...]}. az_count is the number of distinct AZs over all subnets. Add these problems in this order when they apply: 'NEEDS_2_AZS', 'NEEDS_2_PUBLIC_SUBNETS', 'NEEDS_2_PRIVATE_SUBNETS', 'NO_INTERNET_GATEWAY', 'NO_NAT_GATEWAY'. valid is True when there are no problems.",
      "starter": "def validate_vpc(vpc):\n    pass",
      "hint": "Count subnets by type, collect set(s['az'] for s in subnets), then append each problem that applies.",
      "test": "good = {\n    'has_internet_gateway': True, 'has_nat_gateway': True,\n    'subnets': [\n        {'id': 's-1', 'az': 'us-east-1a', 'type': 'PUBLIC'},\n        {'id': 's-2', 'az': 'us-east-1b', 'type': 'PUBLIC'},\n        {'id': 's-3', 'az': 'us-east-1a', 'type': 'PRIVATE'},\n        {'id': 's-4', 'az': 'us-east-1b', 'type': 'PRIVATE'},\n    ],\n}\nassert validate_vpc(good) == {'valid': True, 'az_count': 2, 'problems': []}, 'The textbook VPC is valid'\nno_nat = dict(good, has_nat_gateway=False)\nassert validate_vpc(no_nat) == {'valid': False, 'az_count': 2, 'problems': ['NO_NAT_GATEWAY']}, 'Private subnets need a NAT gateway'\none_az = dict(good, subnets=[dict(s, az='us-east-1a') for s in good['subnets']])\nassert validate_vpc(one_az)['problems'] == ['NEEDS_2_AZS'], 'Everything in one AZ is one failure away from an outage'\nbare = {'has_internet_gateway': False, 'has_nat_gateway': False, 'subnets': [{'id': 's-1', 'az': 'us-east-1a', 'type': 'PUBLIC'}]}\nassert validate_vpc(bare)['problems'] == ['NEEDS_2_AZS', 'NEEDS_2_PUBLIC_SUBNETS', 'NEEDS_2_PRIVATE_SUBNETS', 'NO_INTERNET_GATEWAY', 'NO_NAT_GATEWAY'], 'List every problem, in order'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Subnet CIDR Overlap Checker",
      "desc": "Write `subnets_distinct(cidrs)` where cidrs is a list of strings like '10.0.1.0/24'. Return True when no two blocks overlap (and none repeat). You may use the standard `ipaddress` module: ipaddress.ip_network(a).overlaps(ipaddress.ip_network(b)).",
      "starter": "import ipaddress\n\n\ndef subnets_distinct(cidrs):\n    pass",
      "hint": "Turn each string into ipaddress.ip_network(...) and compare every pair with .overlaps().",
      "test": "assert subnets_distinct(['10.0.1.0/24', '10.0.2.0/24']) is True, 'Two separate /24 blocks'\nassert subnets_distinct(['10.0.1.0/24', '10.0.1.0/24']) is False, 'The same block twice overlaps'\nassert subnets_distinct(['10.0.0.0/16', '10.0.5.0/24']) is False, '10.0.5.0/24 sits inside 10.0.0.0/16'\nassert subnets_distinct(['10.0.0.0/24', '10.0.1.0/24', '10.0.2.0/23']) is True, '10.0.2.0/23 covers 10.0.2.x and 10.0.3.x only'\nassert subnets_distinct(['10.0.0.0/24', '10.0.1.0/24', '10.0.1.128/25']) is False, 'Check every pair, not just neighbours at the start'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "IAM Policy Decision Engine",
      "desc": "Write `evaluate_iam(statements, request)`. Each statement is {'effect': 'Allow' or 'Deny', 'action': ..., 'resource': ...}; request is {'action': ..., 'resource': ...}. A pattern ending in * matches any text that starts with the part before the *; otherwise it must be equal. Rules: an explicit Deny that matches always wins; otherwise a matching Allow gives 'ALLOW'; with no match the answer is 'DENY' (implicit deny).",
      "starter": "def matches(pattern, value):\n    # 's3:*' matches 's3:GetObject'; 's3:GetObject' matches only itself\n    pass\n\n\ndef evaluate_iam(statements, request):\n    pass",
      "hint": "matches: if pattern.endswith('*'): return value.startswith(pattern[:-1]). Then check Deny statements first, then Allow.",
      "test": "statements = [\n    {'effect': 'Allow', 'action': 's3:GetObject', 'resource': 'arn:aws:s3:::my-bucket/*'},\n    {'effect': 'Deny', 'action': 's3:*', 'resource': 'arn:aws:s3:::my-bucket/confidential/*'},\n]\nassert evaluate_iam(statements, {'action': 's3:GetObject', 'resource': 'arn:aws:s3:::my-bucket/photo.jpg'}) == 'ALLOW', 'The Allow matches'\nassert evaluate_iam(statements, {'action': 's3:GetObject', 'resource': 'arn:aws:s3:::my-bucket/confidential/keys.txt'}) == 'DENY', 'Explicit Deny beats Allow'\nassert evaluate_iam(statements, {'action': 's3:PutObject', 'resource': 'arn:aws:s3:::my-bucket/photo.jpg'}) == 'DENY', 'Nothing allows PutObject: implicit deny'\nassert evaluate_iam([], {'action': 'ec2:RunInstances', 'resource': '*'}) == 'DENY', 'No statements: deny'\nprint('All checks passed.')"
    },
    "a": {
      "title": "ARN Parser",
      "desc": "Write `parse_arn(arn)` for strings shaped 'arn:partition:service:region:account:resource'. Return {'partition', 'service', 'region', 'account', 'resource'}. The resource part may itself contain ':' characters, so split at most 5 times. If the text does not start with 'arn:' or has fewer than 6 parts, return None.",
      "starter": "def parse_arn(arn):\n    pass",
      "hint": "parts = arn.split(':', 5); check len(parts) == 6 and parts[0] == 'arn'",
      "test": "p = parse_arn('arn:aws:s3:us-east-1:123456789012:bucket/key')\nassert p == {'partition': 'aws', 'service': 's3', 'region': 'us-east-1', 'account': '123456789012', 'resource': 'bucket/key'}, f'Got {p}'\nq = parse_arn('arn:aws:lambda:eu-west-1:111122223333:function:resize-image')\nassert q['service'] == 'lambda' and q['resource'] == 'function:resize-image', 'The resource keeps its own colons'\nassert parse_arn('arn:aws:iam::111122223333:role/admin')['region'] == '', 'IAM is global, so the region is empty'\nassert parse_arn('not-an-arn') is None, 'Not an ARN'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Target Tracking Capacity",
      "desc": "Write `desired_capacity(current, metric, target, min_size, max_size)`. Target tracking scales so the metric moves to the target: new = ceil(current * metric / target). Clamp the answer between min_size and max_size.",
      "starter": "import math\n\n\ndef desired_capacity(current, metric, target, min_size, max_size):\n    pass",
      "hint": "wanted = math.ceil(current * metric / target); return max(min_size, min(max_size, wanted))",
      "test": "assert desired_capacity(4, 80, 50, 2, 10) == 7, '4 * 80 / 50 = 6.4, round up to 7'\nassert desired_capacity(4, 20, 50, 2, 10) == 2, '1.6 rounds up to 2, which is also the minimum'\nassert desired_capacity(4, 10, 50, 3, 10) == 3, '0.8 rounds up to 1, but never below the minimum of 3'\nassert desired_capacity(8, 90, 50, 2, 10) == 10, '14.4 is capped at the maximum of 10'\nassert desired_capacity(5, 50, 50, 2, 10) == 5, 'On target: stay the same'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Spot Interruption Planner",
      "desc": "Write `spot_action(seconds_notice)`. AWS gives a 2-minute (120 second) warning before taking back a Spot instance. Return 'DRAIN_NOW' when seconds_notice is 120 or less and more than 0, 'ALREADY_GONE' when it is 0 or less, and 'KEEP_WORKING' otherwise.",
      "starter": "def spot_action(seconds_notice):\n    pass",
      "hint": "if seconds_notice <= 0: ...; elif seconds_notice <= 120: ...; else: ...",
      "test": "assert spot_action(120) == 'DRAIN_NOW', 'The 2-minute warning has arrived'\nassert spot_action(30) == 'DRAIN_NOW', '30 seconds left: drain now'\nassert spot_action(300) == 'KEEP_WORKING', 'No warning yet'\nassert spot_action(0) == 'ALREADY_GONE', 'Time is up'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "ALB Path Routing",
      "desc": "Write `route_alb(rules, path)`. rules is a list of {'pattern': '/api/v1/*', 'target_group': 'tg-api'} checked in order. A pattern ending in '*' matches paths starting with the part before the '*'; other patterns must equal the path. Return the first match's target_group, or 'tg-default' when none match.",
      "starter": "def route_alb(rules, path):\n    pass",
      "hint": "for rule in rules: p = rule['pattern']; if (p.endswith('*') and path.startswith(p[:-1])) or p == path: return rule['target_group']",
      "test": "rules = [\n    {'pattern': '/api/v1/*', 'target_group': 'tg-api-v1'},\n    {'pattern': '/static/*', 'target_group': 'tg-static'},\n    {'pattern': '/health', 'target_group': 'tg-health'},\n]\nassert route_alb(rules, '/api/v1/users') == 'tg-api-v1', 'API calls go to the API servers'\nassert route_alb(rules, '/static/logo.png') == 'tg-static', 'Files go to the static group'\nassert route_alb(rules, '/health') == 'tg-health', 'Exact match'\nassert route_alb(rules, '/healthz') == 'tg-default', 'An exact pattern does not match longer paths'\nassert route_alb(rules, '/home') == 'tg-default', 'No rule: default group'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Health Check State Machine",
      "desc": "Write `target_state(results, healthy_threshold=3, unhealthy_threshold=2)`. results is a list of health check outcomes, True (passed) or False, oldest first. A target starts 'UNHEALTHY'. It becomes 'HEALTHY' after healthy_threshold passes in a row, and goes back to 'UNHEALTHY' after unhealthy_threshold failures in a row. Return the final state.",
      "starter": "def target_state(results, healthy_threshold=3, unhealthy_threshold=2):\n    pass",
      "hint": "Keep two counters (passes in a row, failures in a row); reset the other one on each result.",
      "test": "assert target_state([True, True, True]) == 'HEALTHY', '3 passes in a row'\nassert target_state([True, True]) == 'UNHEALTHY', 'Not yet 3 passes'\nassert target_state([True, True, True, False]) == 'HEALTHY', 'One failure is not enough to go unhealthy'\nassert target_state([True, True, True, False, False]) == 'UNHEALTHY', '2 failures in a row'\nassert target_state([True, True, False, True, True]) == 'UNHEALTHY', 'The failure reset the pass count'\nassert target_state([]) == 'UNHEALTHY', 'New targets start unhealthy'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "S3 Lifecycle Storage Class",
      "desc": "Write `storage_class(age_days, access)`. Return 'DEEP_ARCHIVE' when age_days >= 365, 'GLACIER_FLEXIBLE' when >= 90, 'STANDARD_IA' when >= 30 and access is 'INFREQUENT', otherwise 'STANDARD'.",
      "starter": "def storage_class(age_days, access):\n    pass",
      "hint": "Check the oldest rule first: 365, then 90, then 30 with INFREQUENT.",
      "test": "assert storage_class(400, 'INFREQUENT') == 'DEEP_ARCHIVE', 'Over a year old'\nassert storage_class(100, 'FREQUENT') == 'GLACIER_FLEXIBLE', 'Over 90 days old'\nassert storage_class(45, 'INFREQUENT') == 'STANDARD_IA', 'A month old and rarely read'\nassert storage_class(45, 'FREQUENT') == 'STANDARD', 'Still read often'\nassert storage_class(10, 'INFREQUENT') == 'STANDARD', 'Too new to move'\nprint('All checks passed.')"
    },
    "a": {
      "title": "S3 Versioning Reader",
      "desc": "With versioning on, deleting an object only adds a 'delete marker' on top. Write `current_version(versions)` where versions is a list of {'version_id': ..., 'is_delete_marker': bool}, newest LAST. Return the version_id a normal GET returns: the newest entry, unless it is a delete marker, in which case return None (the object looks deleted).",
      "starter": "def current_version(versions):\n    pass",
      "hint": "if not versions or versions[-1]['is_delete_marker']: return None",
      "test": "v = [{'version_id': 'v1', 'is_delete_marker': False}, {'version_id': 'v2', 'is_delete_marker': False}]\nassert current_version(v) == 'v2', 'GET returns the newest version'\ndeleted = v + [{'version_id': 'd1', 'is_delete_marker': True}]\nassert current_version(deleted) is None, 'A delete marker on top hides the object'\nrestored = deleted[:-1]\nassert current_version(restored) == 'v2', 'Removing the delete marker brings v2 back'\nassert current_version([]) is None, 'No versions: no object'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Bucket Policy TLS Check",
      "desc": "Write `enforces_tls(policy)` for a bucket policy dict {'Statement': [...]}. Return True only if some statement has 'Effect' == 'Deny' and a Condition of {'Bool': {'aws:SecureTransport': 'false'}} (it denies every plain-HTTP request).",
      "starter": "def enforces_tls(policy):\n    pass",
      "hint": "s.get('Condition', {}).get('Bool', {}).get('aws:SecureTransport') == 'false'",
      "test": "secure = {'Statement': [{'Effect': 'Deny', 'Action': 's3:*', 'Condition': {'Bool': {'aws:SecureTransport': 'false'}}}]}\nassert enforces_tls(secure) is True, 'Denies insecure transport'\nwrong_effect = {'Statement': [{'Effect': 'Allow', 'Action': 's3:*', 'Condition': {'Bool': {'aws:SecureTransport': 'false'}}}]}\nassert enforces_tls(wrong_effect) is False, 'Allowing insecure transport is the opposite'\nassert enforces_tls({'Statement': [{'Effect': 'Allow', 'Action': 's3:GetObject'}]}) is False, 'No TLS condition'\nassert enforces_tls({'Statement': []}) is False, 'Empty policy'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Bucket Name Validator",
      "desc": "Write `is_valid_bucket_name(name)`. Rules: 3 to 63 characters; only lowercase letters, digits, dots and hyphens; must start and end with a letter or digit; no two dots in a row; must not look like an IP address (four numbers separated by dots).",
      "starter": "import re\n\n\ndef is_valid_bucket_name(name):\n    pass",
      "hint": "re.fullmatch(r'[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]', name), then check '..' not in name and not re.fullmatch(r'\\d+\\.\\d+\\.\\d+\\.\\d+', name)",
      "test": "assert is_valid_bucket_name('my-valid-bucket.123') is True, 'A normal name'\nassert is_valid_bucket_name('INVALID_NAME') is False, 'Uppercase and underscores are not allowed'\nassert is_valid_bucket_name('ab') is False, 'Too short'\nassert is_valid_bucket_name('a' * 64) is False, 'Too long'\nassert is_valid_bucket_name('-starts-with-dash') is False, 'Must start with a letter or digit'\nassert is_valid_bucket_name('my..bucket') is False, 'No two dots in a row'\nassert is_valid_bucket_name('192.168.5.4') is False, 'Must not look like an IP address'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Lambda Cost Calculator",
      "desc": "Write `lambda_cost(invocations, duration_ms, memory_mb)`. Compute cost = invocations * (duration_ms / 1000) * (memory_mb / 1024) * 0.0000166667 (dollars per GB-second), plus 0.20 dollars per million invocations. Round to 4 decimal places.",
      "starter": "def lambda_cost(invocations, duration_ms, memory_mb):\n    pass",
      "hint": "gb_seconds = invocations * duration_ms / 1000 * memory_mb / 1024; round(gb_seconds * 0.0000166667 + invocations / 1_000_000 * 0.20, 4)",
      "test": "assert lambda_cost(1_000_000, 200, 512) == 1.8667, '100,000 GB-s = $1.6667, plus $0.20 for a million calls'\nassert lambda_cost(1_000_000, 100, 128) == 0.4083, '12,500 GB-s = $0.2083, plus $0.20'\nassert lambda_cost(0, 500, 1024) == 0.0, 'No calls, no bill'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Cold Start Mitigation Choice",
      "desc": "Write `concurrency_model(cold_start_ms, latency_critical)`. Return 'PROVISIONED' when the function is latency critical and its cold start is over 200 ms; 'SNAPSTART' when it is latency critical and the cold start is 200 ms or less but over 100 ms; otherwise 'ON_DEMAND'.",
      "starter": "def concurrency_model(cold_start_ms, latency_critical):\n    pass",
      "hint": "if not latency_critical: return 'ON_DEMAND' first.",
      "test": "assert concurrency_model(900, True) == 'PROVISIONED', 'A slow cold start on a critical path'\nassert concurrency_model(150, True) == 'SNAPSTART', 'A medium cold start on a critical path'\nassert concurrency_model(80, True) == 'ON_DEMAND', 'A fast cold start needs nothing'\nassert concurrency_model(900, False) == 'ON_DEMAND', 'A background job can wait'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Lambda Authorizer Response",
      "desc": "Write `authorizer_response(principal_id, effect, resource_arn)` that returns the dict API Gateway expects: {'principalId': principal_id, 'policyDocument': {'Version': '2012-10-17', 'Statement': [{'Action': 'execute-api:Invoke', 'Effect': effect, 'Resource': resource_arn}]}}. If effect is not 'Allow' or 'Deny', raise ValueError.",
      "starter": "def authorizer_response(principal_id, effect, resource_arn):\n    pass",
      "hint": "Check effect in ('Allow', 'Deny') first, then build the nested dict.",
      "test": "arn = 'arn:aws:execute-api:us-east-1:123456789012:abc123/prod/GET/orders'\nok = authorizer_response('user_101', 'Allow', arn)\nassert ok['principalId'] == 'user_101', 'principalId is the caller'\nstmt = ok['policyDocument']['Statement'][0]\nassert stmt == {'Action': 'execute-api:Invoke', 'Effect': 'Allow', 'Resource': arn}, f'Got {stmt}'\nassert ok['policyDocument']['Version'] == '2012-10-17', 'Policies use version 2012-10-17'\nassert authorizer_response('user_bad', 'Deny', arn)['policyDocument']['Statement'][0]['Effect'] == 'Deny', 'Deny works too'\ntry:\n    authorizer_response('x', 'Maybe', arn)\n    raise AssertionError('Maybe is not an effect: raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "CORS Headers",
      "desc": "Write `cors_headers(origin, allowed_origins)`. If origin is in allowed_origins, return {'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization', 'Vary': 'Origin'}. Otherwise return an empty dict (the browser will then block the call).",
      "starter": "def cors_headers(origin, allowed_origins):\n    pass",
      "hint": "if origin not in allowed_origins: return {}",
      "test": "allowed = ['https://app.pinit.com', 'https://admin.pinit.com']\nh = cors_headers('https://app.pinit.com', allowed)\nassert h['Access-Control-Allow-Origin'] == 'https://app.pinit.com', 'Echo the allowed origin back'\nassert h['Access-Control-Allow-Methods'] == 'GET,POST,OPTIONS', 'List the methods'\nassert h['Vary'] == 'Origin', 'Tell caches the answer depends on Origin'\nassert cors_headers('https://evil.example', allowed) == {}, 'Unknown origins get no CORS headers'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Partition Key Hot Spot Finder",
      "desc": "DynamoDB spreads items over partitions by partition key. Write `hot_keys(access_log, share=0.5)` where access_log is a list of partition keys, one per read. Return a sorted list of keys that got MORE than share of all reads (a hot partition). An empty log returns [].",
      "starter": "from collections import Counter\n\n\ndef hot_keys(access_log, share=0.5):\n    pass",
      "hint": "counts = Counter(access_log); total = len(access_log); sorted(k for k, n in counts.items() if n / total > share)",
      "test": "log = ['user_1'] * 6 + ['user_2'] * 2 + ['user_3'] * 2\nassert hot_keys(log) == ['user_1'], 'user_1 gets 60% of reads'\nassert hot_keys(log, 0.15) == ['user_1', 'user_2', 'user_3'], 'With a 15% limit all three are hot, sorted'\nassert hot_keys(['a', 'b', 'c', 'd']) == [], 'An even spread has no hot key'\nassert hot_keys(['a', 'a', 'b', 'b'], 0.5) == [], 'Exactly half is not more than half'\nassert hot_keys([]) == [], 'No reads'\nprint('All checks passed.')"
    },
    "a": {
      "title": "DynamoDB Read Capacity",
      "desc": "Write `required_rcu(item_size_bytes, reads_per_sec, strongly_consistent)`. One read capacity unit (RCU) is one strongly consistent read per second of up to 4 KB (4096 bytes); bigger items use ceil(size / 4096) units per read. Eventually consistent reads cost half. Return the RCUs needed, rounded up to a whole number.",
      "starter": "import math\n\n\ndef required_rcu(item_size_bytes, reads_per_sec, strongly_consistent):\n    pass",
      "hint": "units = math.ceil(item_size_bytes / 4096) * reads_per_sec; if not strongly_consistent: units / 2; math.ceil(...)",
      "test": "assert required_rcu(8192, 10, True) == 20, '8 KB is 2 units, times 10 reads'\nassert required_rcu(4096, 10, False) == 5, 'Eventually consistent reads cost half'\nassert required_rcu(5000, 3, True) == 6, '5,000 bytes rounds up to 2 units'\nassert required_rcu(1000, 3, False) == 2, '1.5 rounds up to 2'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "RDS Multi-AZ Failover",
      "desc": "Write `failover(cluster)` where cluster is a dict {'primary_az', 'standby_az', 'multi_az'}. If multi_az is True and there is a standby_az, swap primary_az and standby_az IN the dict and return {'success': True, 'new_primary': ...}. Otherwise leave the dict alone and return {'success': False, 'new_primary': None}.",
      "starter": "def failover(cluster):\n    pass",
      "hint": "cluster['primary_az'], cluster['standby_az'] = cluster['standby_az'], cluster['primary_az']",
      "test": "c = {'primary_az': 'us-east-1a', 'standby_az': 'us-east-1b', 'multi_az': True}\nassert failover(c) == {'success': True, 'new_primary': 'us-east-1b'}, 'The standby becomes primary'\nassert c['primary_az'] == 'us-east-1b' and c['standby_az'] == 'us-east-1a', f'Swap the AZs in the dict, got {c}'\nsingle = {'primary_az': 'us-east-1a', 'standby_az': None, 'multi_az': False}\nassert failover(single) == {'success': False, 'new_primary': None}, 'No standby, no failover'\nassert single['primary_az'] == 'us-east-1a', 'Leave it alone'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Read Replica Router",
      "desc": "Write `route_query(sql, primary, replicas, counter)`. Queries starting with SELECT (any case, ignoring leading spaces) are reads; send them to replicas[counter % len(replicas)] (round robin). Everything else, and every read when there are no replicas, goes to primary.",
      "starter": "def route_query(sql, primary, replicas, counter):\n    pass",
      "hint": "is_read = sql.strip().upper().startswith('SELECT')",
      "test": "reps = ['replica-1', 'replica-2']\nassert route_query('SELECT * FROM orders', 'primary', reps, 0) == 'replica-1', 'Reads go to a replica'\nassert route_query('  select id from users', 'primary', reps, 1) == 'replica-2', 'Round robin, any case'\nassert route_query('INSERT INTO orders VALUES (1)', 'primary', reps, 0) == 'primary', 'Writes go to the primary'\nassert route_query('SELECT 1', 'primary', [], 5) == 'primary', 'No replicas: the primary serves reads'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Serverless Video Pipeline",
      "desc": "Write `process_upload(event, db, transcode)`. event looks like an S3 notification: {'Records': [{'s3': {'bucket': {'name': ...}, 'object': {'key': ..., 'size': ...}}}]}. For EVERY record: call transcode(bucket, key), which returns an output URL; save db[key] = {'bucket': bucket, 'output_url': url, 'status': 'DONE'}. If transcode raises, save db[key] = {'bucket': bucket, 'output_url': None, 'status': 'FAILED'} and carry on. Return {'processed': number DONE, 'failed': number FAILED}.",
      "starter": "def process_upload(event, db, transcode):\n    pass",
      "hint": "for record in event.get('Records', []): bucket = record['s3']['bucket']['name']; key = record['s3']['object']['key']; try/except around transcode.",
      "test": "def transcode(bucket, key):\n    if key.endswith('.bad'):\n        raise RuntimeError('corrupt file')\n    return f'https://{bucket}.s3.amazonaws.com/processed/{key}'\n\n\ndef rec(bucket, key):\n    return {'s3': {'bucket': {'name': bucket}, 'object': {'key': key, 'size': 1024}}}\n\n\ndb = {}\nres = process_upload({'Records': [rec('raw-videos', 'demo.mp4'), rec('raw-videos', 'clip.bad'), rec('raw-videos', 'talk.mp4')]}, db, transcode)\nassert res == {'processed': 2, 'failed': 1}, f'Two good files, one bad, got {res}'\nassert db['demo.mp4'] == {'bucket': 'raw-videos', 'output_url': 'https://raw-videos.s3.amazonaws.com/processed/demo.mp4', 'status': 'DONE'}, 'Save each result'\nassert db['clip.bad']['status'] == 'FAILED' and db['talk.mp4']['status'] == 'DONE', 'One failure must not stop the rest'\nassert process_upload({'Records': []}, {}, transcode) == {'processed': 0, 'failed': 0}, 'No records'\nprint('All checks passed.')"
    },
    "a": {
      "title": "S3 Event Record Parser",
      "desc": "Write `parse_s3_record(record)` returning {'bucket': ..., 'key': ..., 'size': ...} from one S3 event record. S3 events URL-encode object keys, so a key with spaces arrives as 'my+holiday%20video.mp4'. Turn every '+' and every '%20' back into a space.",
      "starter": "def parse_s3_record(record):\n    pass",
      "hint": "key = record['s3']['object']['key'].replace('+', ' ').replace('%20', ' ')",
      "test": "r = {'s3': {'bucket': {'name': 'b1'}, 'object': {'key': 'vid.mp4', 'size': 1024}}}\nassert parse_s3_record(r) == {'bucket': 'b1', 'key': 'vid.mp4', 'size': 1024}, 'Read the three fields'\nspaced = {'s3': {'bucket': {'name': 'b1'}, 'object': {'key': 'my+holiday%20video.mp4', 'size': 5}}}\nassert parse_s3_record(spaced)['key'] == 'my holiday video.mp4', 'Decode + and %20 into spaces'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "CloudFront Edge TTL",
      "desc": "Write `edge_ttl(cache_control, default_ttl=86400)`. Read a Cache-Control header value like 'public, max-age=3600'. If it contains 'no-store' or 'private', return 0 (the CDN must not cache it). If it has 's-maxage=N', return N (it is meant for shared caches like CloudFront and wins over max-age). Else if it has 'max-age=N', return N. Otherwise return default_ttl.",
      "starter": "def edge_ttl(cache_control, default_ttl=86400):\n    pass",
      "hint": "Split on ',' and strip each directive; look for 'no-store'/'private', then 's-maxage=', then 'max-age='.",
      "test": "assert edge_ttl('public, max-age=3600') == 3600, 'Use max-age'\nassert edge_ttl('public, max-age=60, s-maxage=600') == 600, 's-maxage wins at the CDN'\nassert edge_ttl('') == 86400, 'No header: the default TTL'\nassert edge_ttl('no-cache', 60) == 60, 'A custom default'\nassert edge_ttl('private, max-age=600') == 0, 'Private data must not be cached at the edge'\nassert edge_ttl('no-store') == 0, 'no-store means never cache'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Cache Key Builder",
      "desc": "CloudFront caches by a 'cache key'. Write `cache_key(path, headers, query, key_headers, key_params)`. Lowercase all header names; keep only the headers named in key_headers (given in lowercase) and the query params named in key_params. Return a string: path, then '|' and 'name=value' pairs of the kept headers sorted by name joined by '&', then '|' and the kept query params sorted by name, joined by '&'.",
      "starter": "def cache_key(path, headers, query, key_headers, key_params):\n    pass",
      "hint": "h = {k.lower(): v for k, v in headers.items()}; kept = sorted((k, h[k]) for k in key_headers if k in h)",
      "test": "headers = {'Accept-Language': 'en', 'User-Agent': 'Mozilla', 'X-Device': 'mobile'}\nquery = {'page': '2', 'utm_source': 'ad', 'sort': 'price'}\nk = cache_key('/products', headers, query, ['x-device', 'accept-language'], ['sort', 'page'])\nassert k == '/products|accept-language=en&x-device=mobile|page=2&sort=price', f'Got {k}'\nother = cache_key('/products', {'x-device': 'mobile', 'accept-language': 'en', 'User-Agent': 'Chrome'}, {'sort': 'price', 'page': '2', 'utm_source': 'mail'}, ['x-device', 'accept-language'], ['sort', 'page'])\nassert other == k, 'User-Agent and utm_source are not in the key, so both visitors share one cached copy'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Route 53 Failover Resolver",
      "desc": "Write `resolve_dns(config, health)`. config has 'policy' ('SIMPLE' or 'FAILOVER') and 'primary' and optional 'secondary' IPs. health maps an IP to True/False. SIMPLE always returns primary (no health checks). FAILOVER returns primary when it is healthy, else secondary when it is healthy, else primary anyway (Route 53 answers with the primary when every record is unhealthy).",
      "starter": "def resolve_dns(config, health):\n    pass",
      "hint": "if config['policy'] == 'SIMPLE': return config['primary']; then health.get(ip, False) checks.",
      "test": "cfg = {'policy': 'FAILOVER', 'primary': '1.1.1.1', 'secondary': '2.2.2.2'}\nassert resolve_dns(cfg, {'1.1.1.1': True, '2.2.2.2': True}) == '1.1.1.1', 'Healthy primary'\nassert resolve_dns(cfg, {'1.1.1.1': False, '2.2.2.2': True}) == '2.2.2.2', 'Fail over to the secondary'\nassert resolve_dns(cfg, {'1.1.1.1': False, '2.2.2.2': False}) == '1.1.1.1', 'All unhealthy: answer with the primary'\nassert resolve_dns({'policy': 'SIMPLE', 'primary': '3.3.3.3'}, {'3.3.3.3': False}) == '3.3.3.3', 'SIMPLE ignores health'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Weighted Record Selector",
      "desc": "Write `pick_weighted(records, roll)`. records is a list of {'endpoint': ..., 'weight': int}; roll is a number from 0 up to (not including) the total weight. Walk the records adding up weights and return the endpoint of the first record whose running total is greater than roll. Records with weight 0 never get traffic.",
      "starter": "def pick_weighted(records, roll):\n    pass",
      "hint": "total = 0; for r in records: total += r['weight']; if roll < total: return r['endpoint']",
      "test": "recs = [{'endpoint': 'blue', 'weight': 90}, {'endpoint': 'green', 'weight': 10}]\nassert pick_weighted(recs, 0) == 'blue', 'Rolls 0-89 go to blue'\nassert pick_weighted(recs, 89) == 'blue', '89 is still blue'\nassert pick_weighted(recs, 90) == 'green', 'Rolls 90-99 go to green (the canary)'\noff = [{'endpoint': 'old', 'weight': 0}, {'endpoint': 'new', 'weight': 100}]\nassert pick_weighted(off, 0) == 'new', 'Weight 0 gets nothing'\nshare = {}\nfor roll in range(100):\n    e = pick_weighted(recs, roll)\n    share[e] = share.get(e, 0) + 1\nassert share == {'blue': 90, 'green': 10}, f'Over all rolls the split is 90/10, got {share}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "SQS Visibility Timeout Queue",
      "desc": "Build a tiny SQS queue. Write a class `Queue` with `send(body)`, `receive(now)` and `delete(message_id)`. send stores a message with ids 'm1', 'm2', ... in order. receive(now) returns the first message (as {'id', 'body', 'receive_count'}) that is visible at time now (seconds), or None; receiving hides it until now + visibility_timeout (set in __init__, default 30) and adds 1 to its receive_count. delete removes it for good. A message that was received but not deleted becomes visible again when its timeout ends.",
      "starter": "class Queue:\n    def __init__(self, visibility_timeout=30):\n        pass\n\n    def send(self, body):\n        pass\n\n    def receive(self, now):\n        pass\n\n    def delete(self, message_id):\n        pass",
      "hint": "Keep a list of dicts with 'id', 'body', 'receive_count' and 'visible_at' (0 when sent).",
      "test": "q = Queue(visibility_timeout=30)\nq.send('order-1')\nq.send('order-2')\nm = q.receive(now=0)\nassert m == {'id': 'm1', 'body': 'order-1', 'receive_count': 1}, f'Got {m}'\nassert q.receive(now=5)['id'] == 'm2', 'm1 is hidden, so the next receive gets m2'\nassert q.receive(now=10) is None, 'Both are in flight'\nagain = q.receive(now=31)\nassert again['id'] == 'm1' and again['receive_count'] == 2, 'm1 was not deleted, so it comes back after 30 s'\nq.delete('m1')\nassert q.receive(now=100)['id'] == 'm2', 'm1 is gone for good; m2 is visible again'\nprint('All checks passed.')"
    },
    "a": {
      "title": "FIFO Deduplication Window",
      "desc": "SQS FIFO queues drop a message whose deduplication id was already seen in the last 5 minutes. Write `accept_messages(messages, window=300)` where messages is a list of (dedup_id, time_in_seconds) in time order. Return the list of dedup ids that are accepted, in order. A message is a duplicate when the same id was ACCEPTED less than window seconds before.",
      "starter": "def accept_messages(messages, window=300):\n    pass",
      "hint": "Keep last_accepted = {}; accept when id not in it or t - last_accepted[id] >= window.",
      "test": "msgs = [('pay-1', 0), ('pay-1', 10), ('pay-2', 20), ('pay-1', 299), ('pay-1', 300), ('pay-2', 400)]\nassert accept_messages(msgs) == ['pay-1', 'pay-2', 'pay-1', 'pay-2'], 'Drop repeats inside 5 minutes of the accepted copy'\nassert accept_messages([('a', 0), ('a', 59), ('a', 60)], window=60) == ['a', 'a'], 'A custom window'\nassert accept_messages([]) == [], 'Nothing sent'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "SNS Fanout",
      "desc": "Write `fanout(subscriptions, message, deliver)`. subscriptions is a list of {'endpoint': ..., 'status': 'CONFIRMED' or 'PENDING'}. Call deliver(endpoint, message) for every CONFIRMED subscription, in order. If deliver raises for one endpoint, keep going. Return {'delivered': [endpoints that worked], 'failed': [endpoints that raised], 'skipped': number of PENDING}.",
      "starter": "def fanout(subscriptions, message, deliver):\n    pass",
      "hint": "Loop, skip PENDING (count them), try/except around deliver.",
      "test": "sent = []\n\n\ndef deliver(endpoint, message):\n    if endpoint == 'arn:sqs:broken':\n        raise RuntimeError('queue deleted')\n    sent.append((endpoint, message['event']))\n\n\nsubs = [\n    {'endpoint': 'arn:sqs:billing', 'status': 'CONFIRMED'},\n    {'endpoint': 'arn:sqs:broken', 'status': 'CONFIRMED'},\n    {'endpoint': 'arn:sqs:email', 'status': 'CONFIRMED'},\n    {'endpoint': 'arn:sqs:new', 'status': 'PENDING'},\n]\nres = fanout(subs, {'event': 'ORDER_PLACED'}, deliver)\nassert res == {'delivered': ['arn:sqs:billing', 'arn:sqs:email'], 'failed': ['arn:sqs:broken'], 'skipped': 1}, f'Got {res}'\nassert sent == [('arn:sqs:billing', 'ORDER_PLACED'), ('arn:sqs:email', 'ORDER_PLACED')], 'Each confirmed queue gets its own copy'\nassert fanout([], {'event': 'X'}, deliver) == {'delivered': [], 'failed': [], 'skipped': 0}, 'No subscribers'\nprint('All checks passed.')"
    },
    "a": {
      "title": "SNS Filter Policy",
      "desc": "Write `matches_filter(policy, attributes)`. policy maps an attribute name to a list of allowed values, e.g. {'customer': ['VIP', 'ENTERPRISE']}. attributes maps a name to {'Type': 'String', 'Value': ...}. Return True only when EVERY attribute in the policy is present and its Value is in the allowed list. An empty policy matches everything.",
      "starter": "def matches_filter(policy, attributes):\n    pass",
      "hint": "all(name in attributes and attributes[name]['Value'] in allowed for name, allowed in policy.items())",
      "test": "policy = {'customer': ['VIP', 'ENTERPRISE'], 'region': ['EU']}\nvip_eu = {'customer': {'Type': 'String', 'Value': 'VIP'}, 'region': {'Type': 'String', 'Value': 'EU'}}\nassert matches_filter(policy, vip_eu) is True, 'Both attributes match'\nassert matches_filter(policy, dict(vip_eu, region={'Type': 'String', 'Value': 'US'})) is False, 'Every attribute must match'\nassert matches_filter(policy, {'customer': {'Type': 'String', 'Value': 'VIP'}}) is False, 'A missing attribute does not match'\nassert matches_filter({}, {}) is True, 'An empty policy lets everything through'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "EventBridge Pattern Matcher",
      "desc": "Write `match_pattern(pattern, event)`. Every key in pattern must be in event. When the pattern value is a list, the event value must be one of its items. When the pattern value is a dict, match it the same way against the event's dict at that key (nesting, e.g. for 'detail'). An empty pattern matches every event.",
      "starter": "def match_pattern(pattern, event):\n    pass",
      "hint": "for key, want in pattern.items(): if key not in event: False; if isinstance(want, dict): recurse; else: event[key] in want",
      "test": "pattern = {'source': ['pinit.billing'], 'detail-type': ['PaymentSucceeded'], 'detail': {'currency': ['USD', 'EUR']}}\nok = {'source': 'pinit.billing', 'detail-type': 'PaymentSucceeded', 'detail': {'amount': 500, 'currency': 'EUR'}}\nassert match_pattern(pattern, ok) is True, 'Everything matches'\nassert match_pattern(pattern, dict(ok, source='pinit.auth')) is False, 'Wrong source'\nassert match_pattern(pattern, dict(ok, detail={'amount': 5, 'currency': 'INR'})) is False, 'Nested detail must match too'\nassert match_pattern(pattern, {'source': 'pinit.billing', 'detail-type': 'PaymentSucceeded'}) is False, 'Missing detail'\nassert match_pattern({}, ok) is True, 'Empty pattern matches all'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Event Envelope Builder",
      "desc": "Write `make_event(source, detail_type, detail, event_id, time)` returning an EventBridge event: {'version': '0', 'id': event_id, 'source': source, 'detail-type': detail_type, 'time': time, 'detail': detail}. The source must look like 'company.service' (contain a dot and not start with 'aws.', which is reserved for AWS); otherwise raise ValueError.",
      "starter": "def make_event(source, detail_type, detail, event_id, time):\n    pass",
      "hint": "if '.' not in source or source.startswith('aws.'): raise ValueError(...)",
      "test": "e = make_event('pinit.orders', 'OrderPlaced', {'order_id': 101}, 'ev-1', '2026-09-29T10:00:00Z')\nassert e == {'version': '0', 'id': 'ev-1', 'source': 'pinit.orders', 'detail-type': 'OrderPlaced', 'time': '2026-09-29T10:00:00Z', 'detail': {'order_id': 101}}, f'Got {e}'\nfor bad in ('orders', 'aws.ec2'):\n    try:\n        make_event(bad, 'X', {}, 'ev-2', '2026-09-29T10:00:00Z')\n        raise AssertionError(f'{bad} is not an allowed custom source')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Microservices Event Bus",
      "desc": "Write `route_event(event, rules, queues)`. Each rule is {'source', 'detail_type', 'target'}; it matches when both equal the event's 'source' and 'detail-type'. For every matching rule, append the event to queues[target]. If a target queue does not exist, count it in 'dead_letters' instead of crashing. Return {'matched': number of matching rules, 'dead_letters': number, 'status': 'ROUTED' if anything was delivered else 'NO_MATCH'}.",
      "starter": "def route_event(event, rules, queues):\n    pass",
      "hint": "for rule in rules: if matches: matched += 1; if rule['target'] in queues: append else: dead_letters += 1",
      "test": "queues = {'inventory': [], 'email': []}\nrules = [\n    {'source': 'orders', 'detail_type': 'OrderCreated', 'target': 'inventory'},\n    {'source': 'orders', 'detail_type': 'OrderCreated', 'target': 'email'},\n    {'source': 'orders', 'detail_type': 'OrderCreated', 'target': 'loyalty'},\n    {'source': 'orders', 'detail_type': 'OrderCancelled', 'target': 'inventory'},\n]\nev = {'source': 'orders', 'detail-type': 'OrderCreated', 'detail': {'order_id': 'ord_99'}}\nres = route_event(ev, rules, queues)\nassert res == {'matched': 3, 'dead_letters': 1, 'status': 'ROUTED'}, f'Got {res}'\nassert queues['inventory'] == [ev] and queues['email'] == [ev], 'Each subscribed service gets the event'\nnone = route_event({'source': 'auth', 'detail-type': 'Login'}, rules, queues)\nassert none == {'matched': 0, 'dead_letters': 0, 'status': 'NO_MATCH'}, 'Nothing listens for logins'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Dead Letter Redrive",
      "desc": "Write `redrive(messages, max_receive_count)` where messages is a list of {'id', 'receive_count'}. SQS moves a message to the dead letter queue once it has been received MORE than max_receive_count times. Return (main, dlq): two lists of ids, keeping the original order.",
      "starter": "def redrive(messages, max_receive_count):\n    pass",
      "hint": "main = [m['id'] for m in messages if m['receive_count'] <= max_receive_count]",
      "test": "msgs = [{'id': 'a', 'receive_count': 1}, {'id': 'b', 'receive_count': 4}, {'id': 'c', 'receive_count': 3}, {'id': 'd', 'receive_count': 5}]\nassert redrive(msgs, 3) == (['a', 'c'], ['b', 'd']), 'More than 3 receives: to the DLQ'\nassert redrive(msgs, 10) == (['a', 'b', 'c', 'd'], []), 'Nobody has failed 10 times yet'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Fargate Task Size Validator",
      "desc": "Write `valid_fargate_size(cpu, memory_mb)`. Fargate allows these pairs: cpu 256 with 512, 1024 or 2048 MB; cpu 512 with 1024 to 4096 MB in steps of 1024; cpu 1024 with 2048 to 8192 MB in steps of 1024; cpu 2048 with 4096 to 16384 MB in steps of 1024; cpu 4096 with 8192 to 30720 MB in steps of 1024. Return True only for an allowed pair.",
      "starter": "def valid_fargate_size(cpu, memory_mb):\n    pass",
      "hint": "Build ALLOWED = {256: {512, 1024, 2048}, 512: set(range(1024, 4097, 1024)), ...} and check memory_mb in ALLOWED.get(cpu, set()).",
      "test": "assert valid_fargate_size(256, 512) is True, '0.25 vCPU with 0.5 GB'\nassert valid_fargate_size(256, 8192) is False, '0.25 vCPU cannot have 8 GB'\nassert valid_fargate_size(1024, 4096) is True, '1 vCPU with 4 GB'\nassert valid_fargate_size(1024, 1024) is False, '1 vCPU needs at least 2 GB'\nassert valid_fargate_size(4096, 30720) is True, '4 vCPU with 30 GB'\nassert valid_fargate_size(300, 1024) is False, '300 is not a Fargate CPU size'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Container Environment Merger",
      "desc": "Write `container_env(plain, secrets)`. plain is a dict of normal settings (name to value); secrets is a dict of name to a Secrets Manager ARN. Return {'environment': [{'name', 'value'} sorted by name], 'secrets': [{'name', 'valueFrom'} sorted by name]}. If a name is in both, raise ValueError (a secret must never also be written as plain text).",
      "starter": "def container_env(plain, secrets):\n    pass",
      "hint": "clash = set(plain) & set(secrets); if clash: raise ValueError(...)",
      "test": "env = container_env({'PORT': '8080', 'LOG_LEVEL': 'info'}, {'DB_PASS': 'arn:aws:secretsmanager:us-east-1:1:secret:db'})\nassert env == {\n    'environment': [{'name': 'LOG_LEVEL', 'value': 'info'}, {'name': 'PORT', 'value': '8080'}],\n    'secrets': [{'name': 'DB_PASS', 'valueFrom': 'arn:aws:secretsmanager:us-east-1:1:secret:db'}],\n}, f'Got {env}'\ntry:\n    container_env({'DB_PASS': 'hunter2'}, {'DB_PASS': 'arn:x'})\n    raise AssertionError('DB_PASS is in both lists: raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Saga With Compensation",
      "desc": "Write `run_saga(steps)`. Each step is {'name', 'do', 'undo'} where do and undo are functions with no arguments. Run each step's do in order. If one raises, run undo for every step that already SUCCEEDED, newest first, and return {'success': False, 'failed_step': name, 'undone': [names undone in order]}. If all succeed return {'success': True, 'failed_step': None, 'undone': []}.",
      "starter": "def run_saga(steps):\n    pass",
      "hint": "done = []; for step in steps: try: step['do'](); done.append(step) except Exception: for s in reversed(done): s['undo']()",
      "test": "log = []\n\n\ndef step(name, fails=False):\n    def do():\n        if fails:\n            raise RuntimeError(f'{name} failed')\n        log.append(f'do {name}')\n\n    def undo():\n        log.append(f'undo {name}')\n    return {'name': name, 'do': do, 'undo': undo}\n\n\nres = run_saga([step('ReserveHotel'), step('BookFlight'), step('ChargeCard', fails=True), step('SendEmail')])\nassert res == {'success': False, 'failed_step': 'ChargeCard', 'undone': ['BookFlight', 'ReserveHotel']}, f'Got {res}'\nassert log == ['do ReserveHotel', 'do BookFlight', 'undo BookFlight', 'undo ReserveHotel'], f'Undo newest first and never run later steps, got {log}'\nlog.clear()\nassert run_saga([step('A'), step('B')]) == {'success': True, 'failed_step': None, 'undone': []}, 'All steps worked'\nassert log == ['do A', 'do B'], 'No undo when everything works'\nprint('All checks passed.')"
    },
    "a": {
      "title": "State Machine Validator",
      "desc": "Write `validate_state_machine(definition)` for a Step Functions definition {'StartAt': name, 'States': {name: {'Type': ..., 'Next': ... or 'End': True}}}. Return a sorted list of problems (empty when valid): 'BAD_START' if StartAt is not a state; 'BAD_TYPE:<name>' if Type is not one of Task, Choice, Parallel, Map, Pass, Wait, Succeed, Fail; 'BAD_NEXT:<name>' if Next names a missing state. (Only check Next when it is present.)",
      "starter": "VALID_TYPES = {'Task', 'Choice', 'Parallel', 'Map', 'Pass', 'Wait', 'Succeed', 'Fail'}\n\n\ndef validate_state_machine(definition):\n    pass",
      "hint": "states = definition['States']; loop over states.items(); collect problems; return sorted(problems)",
      "test": "good = {'StartAt': 'Charge', 'States': {'Charge': {'Type': 'Task', 'Next': 'Ship'}, 'Ship': {'Type': 'Task', 'Next': 'Done'}, 'Done': {'Type': 'Succeed'}}}\nassert validate_state_machine(good) == [], 'A valid machine'\nbad = {'StartAt': 'Begin', 'States': {'Charge': {'Type': 'Job', 'Next': 'Ship'}, 'Done': {'Type': 'Succeed'}}}\nassert validate_state_machine(bad) == ['BAD_NEXT:Charge', 'BAD_START', 'BAD_TYPE:Charge'], f'Got {validate_state_machine(bad)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Terraform Address Parser",
      "desc": "Write `parse_tf_address(address)`. Terraform addresses look like 'aws_s3_bucket.data_lake' or 'module.vpc.aws_subnet.public' (modules can nest: 'module.net.module.vpc.aws_subnet.public'). Return {'modules': [module names in order], 'type': ..., 'name': ...}.",
      "starter": "def parse_tf_address(address):\n    pass",
      "hint": "parts = address.split('.'); while parts[0] == 'module': modules.append(parts[1]); parts = parts[2:]",
      "test": "assert parse_tf_address('aws_s3_bucket.data_lake') == {'modules': [], 'type': 'aws_s3_bucket', 'name': 'data_lake'}, 'No module'\nassert parse_tf_address('module.vpc.aws_subnet.public') == {'modules': ['vpc'], 'type': 'aws_subnet', 'name': 'public'}, 'One module'\ngot = parse_tf_address('module.net.module.vpc.aws_route_table.private')\nassert got == {'modules': ['net', 'vpc'], 'type': 'aws_route_table', 'name': 'private'}, f'Nested modules, got {got}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Terraform Plan Summary",
      "desc": "Write `plan_summary(changes)` where changes is a list of {'address', 'actions'} and actions is a list such as ['create'], ['update'], ['delete'], ['no-op'] or ['delete', 'create'] (a replace). Return {'add': n, 'change': n, 'destroy': n, 'replace': [addresses being replaced, sorted]}. A replace counts as one add AND one destroy, like `terraform plan` prints.",
      "starter": "def plan_summary(changes):\n    pass",
      "hint": "Treat actions containing both 'delete' and 'create' as a replace; count add/destroy for it too.",
      "test": "changes = [\n    {'address': 'aws_s3_bucket.logs', 'actions': ['create']},\n    {'address': 'aws_instance.web', 'actions': ['delete', 'create']},\n    {'address': 'aws_security_group.web', 'actions': ['update']},\n    {'address': 'aws_iam_role.old', 'actions': ['delete']},\n    {'address': 'aws_vpc.main', 'actions': ['no-op']},\n]\nassert plan_summary(changes) == {'add': 2, 'change': 1, 'destroy': 2, 'replace': ['aws_instance.web']}, f'Got {plan_summary(changes)}'\nassert plan_summary([]) == {'add': 0, 'change': 0, 'destroy': 0, 'replace': []}, 'Nothing to do'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "CloudWatch Alarm Evaluator",
      "desc": "Write `alarm_state(datapoints, threshold, operator, periods)`. operator is 'GreaterThanThreshold' or 'LessThanThreshold'. The alarm is 'ALARM' when the LAST `periods` datapoints all breach the threshold; 'INSUFFICIENT_DATA' when there are fewer than `periods` datapoints; otherwise 'OK'.",
      "starter": "def alarm_state(datapoints, threshold, operator, periods):\n    pass",
      "hint": "recent = datapoints[-periods:]; breach = (lambda v: v > threshold) or (lambda v: v < threshold)",
      "test": "assert alarm_state([45, 60, 85, 90, 95], 80, 'GreaterThanThreshold', 3) == 'ALARM', 'The last 3 are all above 80'\nassert alarm_state([85, 90, 75], 80, 'GreaterThanThreshold', 3) == 'OK', 'One dip means no alarm'\nassert alarm_state([90, 95], 80, 'GreaterThanThreshold', 3) == 'INSUFFICIENT_DATA', 'Only 2 datapoints'\nassert alarm_state([30, 5, 4, 3], 10, 'LessThanThreshold', 3) == 'ALARM', 'Free disk below 10 for 3 periods'\nassert alarm_state([30, 5, 4, 30], 10, 'LessThanThreshold', 3) == 'OK', 'Recovered'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Log Insights Error Summary",
      "desc": "Write `error_summary(logs, min_status=500)` where logs is a list of {'path', 'status'}. Keep entries with status >= min_status and return a list of (path, count) pairs sorted by count (highest first), then by path. This is what a Logs Insights query 'filter status >= 500 | stats count(*) by path' gives you.",
      "starter": "from collections import Counter\n\n\ndef error_summary(logs, min_status=500):\n    pass",
      "hint": "counts = Counter(l['path'] for l in logs if l['status'] >= min_status); sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))",
      "test": "logs = [\n    {'path': '/pay', 'status': 500}, {'path': '/pay', 'status': 503}, {'path': '/home', 'status': 200},\n    {'path': '/cart', 'status': 502}, {'path': '/login', 'status': 404}, {'path': '/pay', 'status': 200},\n    {'path': '/auth', 'status': 500},\n]\nassert error_summary(logs) == [('/pay', 2), ('/auth', 1), ('/cart', 1)], f'Got {error_summary(logs)}'\nassert error_summary(logs, 400) == [('/pay', 2), ('/auth', 1), ('/cart', 1), ('/login', 1)], 'Include 4xx with a lower limit'\nassert error_summary([]) == [], 'No logs'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Envelope Encryption",
      "desc": "Simulate KMS envelope encryption with XOR (for learning only, never for real secrets). Write `xor_bytes(data, key)` that XORs each byte of data with key[i % len(key)] and returns bytes. Then write `envelope_encrypt(plaintext, data_key, master_key, key_id)` returning {'ciphertext': xor_bytes(plaintext.encode(), data_key).hex(), 'encrypted_data_key': xor_bytes(data_key, master_key).hex(), 'key_id': key_id}, and `envelope_decrypt(envelope, master_key)` that reverses it and returns the plaintext string.",
      "starter": "def xor_bytes(data, key):\n    pass\n\n\ndef envelope_encrypt(plaintext, data_key, master_key, key_id):\n    pass\n\n\ndef envelope_decrypt(envelope, master_key):\n    pass",
      "hint": "bytes(b ^ key[i % len(key)] for i, b in enumerate(data)). To decrypt: data_key = xor_bytes(bytes.fromhex(env['encrypted_data_key']), master_key).",
      "test": "master = b'master-key-in-kms'\ndata_key = b'\\x13\\x37\\xbe\\xef\\x42'\nenv = envelope_encrypt('CustomerSSN_123', data_key, master, 'arn:aws:kms:us-east-1:1:key/abc')\nassert env['key_id'] == 'arn:aws:kms:us-east-1:1:key/abc', 'Record which master key was used'\nassert 'CustomerSSN' not in env['ciphertext'] and 'CustomerSSN'.encode().hex() not in env['ciphertext'], 'The plaintext must not show'\nassert env['encrypted_data_key'] != data_key.hex(), 'Never store the data key in the clear'\nassert envelope_decrypt(env, master) == 'CustomerSSN_123', 'Decrypting gives the plaintext back'\nassert xor_bytes(b'\\x0f\\xf0', b'\\xff') == b'\\xf0\\x0f', 'XOR each byte with the key'\nprint('All checks passed.')"
    },
    "a": {
      "title": "KMS Key Policy Audit",
      "desc": "Write `key_policy_risks(policy)` for a KMS key policy {'Statement': [...]}. Return a sorted list of problems: 'PUBLIC_PRINCIPAL' when an Allow statement has Principal '*' (or {'AWS': '*'}) and no Condition; 'KMS_WILDCARD' when an Allow statement's Action is 'kms:*' and its Principal is not the account root (a principal string ending in ':root'). No duplicates.",
      "starter": "def key_policy_risks(policy):\n    pass",
      "hint": "principal = s.get('Principal'); if isinstance(principal, dict): principal = principal.get('AWS'); collect into a set; return sorted(...)",
      "test": "safe = {'Statement': [\n    {'Effect': 'Allow', 'Principal': {'AWS': 'arn:aws:iam::111122223333:root'}, 'Action': 'kms:*'},\n    {'Effect': 'Allow', 'Principal': '*', 'Action': 'kms:Decrypt', 'Condition': {'StringEquals': {'kms:ViaService': 's3.us-east-1.amazonaws.com'}}},\n]}\nassert key_policy_risks(safe) == [], 'Root admin plus a conditioned statement is fine'\nrisky = {'Statement': [\n    {'Effect': 'Allow', 'Principal': '*', 'Action': 'kms:Decrypt'},\n    {'Effect': 'Allow', 'Principal': {'AWS': 'arn:aws:iam::111122223333:role/app'}, 'Action': 'kms:*'},\n    {'Effect': 'Allow', 'Principal': {'AWS': '*'}, 'Action': 'kms:*'},\n]}\nassert key_policy_risks(risky) == ['KMS_WILDCARD', 'PUBLIC_PRINCIPAL'], f'Got {key_policy_risks(risky)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "WAF Web ACL Inspector",
      "desc": "Write `inspect_request(rules, request)`. rules are checked in order; each is {'type': 'IP_BLOCK', 'ips': [...]}, {'type': 'SQLI'} or {'type': 'RATE_LIMIT', 'limit': n}. request has 'ip', 'query' and 'count_5min' (calls from that IP in the last 5 minutes). IP_BLOCK blocks listed IPs. SQLI blocks when the lowercased query contains any of: \"' or 1=1\", 'union select', '; drop table', '--'. RATE_LIMIT blocks when count_5min > limit. Return {'action': 'BLOCK', 'rule': type} for the first rule that blocks, else {'action': 'ALLOW', 'rule': None}.",
      "starter": "SQLI_SIGNS = [\"' or 1=1\", 'union select', '; drop table', '--']\n\n\ndef inspect_request(rules, request):\n    pass",
      "hint": "for rule in rules: check its type; return at the first block.",
      "test": "rules = [{'type': 'IP_BLOCK', 'ips': ['6.6.6.6']}, {'type': 'SQLI'}, {'type': 'RATE_LIMIT', 'limit': 100}]\nclean = {'ip': '1.2.3.4', 'query': 'page=1', 'count_5min': 50}\nassert inspect_request(rules, clean) == {'action': 'ALLOW', 'rule': None}, 'A clean request'\nassert inspect_request(rules, dict(clean, query=\"id=1' OR 1=1\")) == {'action': 'BLOCK', 'rule': 'SQLI'}, 'Classic SQL injection'\nassert inspect_request(rules, dict(clean, query='q=1 UNION SELECT password FROM users')) == {'action': 'BLOCK', 'rule': 'SQLI'}, 'UNION attack'\nassert inspect_request(rules, dict(clean, count_5min=150)) == {'action': 'BLOCK', 'rule': 'RATE_LIMIT'}, 'Too many calls'\nassert inspect_request(rules, dict(clean, ip='6.6.6.6', count_5min=500)) == {'action': 'BLOCK', 'rule': 'IP_BLOCK'}, 'The first matching rule is reported'\nprint('All checks passed.')"
    },
    "a": {
      "title": "WAF IP Set Validator",
      "desc": "Write `valid_ip_set(ranges)`. Every entry must be a CIDR block with an explicit '/' prefix length that the standard `ipaddress` module accepts (IPv4 or IPv6) with strict=True (no host bits set). Return True only if all entries are valid and the list is not empty.",
      "starter": "import ipaddress\n\n\ndef valid_ip_set(ranges):\n    pass",
      "hint": "try: ipaddress.ip_network(r, strict=True) except ValueError: return False; also require '/' in r",
      "test": "assert valid_ip_set(['192.168.1.0/24', '10.0.0.0/8']) is True, 'Two IPv4 blocks'\nassert valid_ip_set(['2001:db8::/32']) is True, 'IPv6 works too'\nassert valid_ip_set(['not-an-ip']) is False, 'Not an address'\nassert valid_ip_set(['10.0.0.5/24']) is False, 'Host bits set: 10.0.0.5/24 should be 10.0.0.0/24'\nassert valid_ip_set(['10.0.0.1']) is False, 'WAF needs a prefix length like /32'\nassert valid_ip_set([]) is False, 'An empty set protects nothing'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Savings Plan Bill",
      "desc": "Write `cloud_bill(hours_used, plan_rate, on_demand_rate, committed_hours)`. A Savings Plan charges for committed_hours at plan_rate whether you use them or not; any hours above that are billed at on_demand_rate. Return the total rounded to 2 decimals.",
      "starter": "def cloud_bill(hours_used, plan_rate, on_demand_rate, committed_hours):\n    pass",
      "hint": "committed_hours * plan_rate + max(0, hours_used - committed_hours) * on_demand_rate",
      "test": "assert cloud_bill(100, 0.05, 0.10, 80) == 6.0, '80 * 0.05 + 20 * 0.10'\nassert cloud_bill(60, 0.05, 0.10, 0) == 6.0, 'All on demand'\nassert cloud_bill(100, 0.05, 0.10, 100) == 5.0, 'Fully covered'\nassert cloud_bill(50, 0.05, 0.10, 80) == 4.0, 'You pay for all 80 committed hours even when you use 50'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Cost Tag Auditor",
      "desc": "Write `untagged_resources(resources, required)` where resources is a list of {'id', 'tags': {...}}. A tag counts only if its value is a non-empty string. Return a dict mapping each resource id that is missing tags to a sorted list of the missing tag names. Resources with every tag are left out.",
      "starter": "def untagged_resources(resources, required):\n    pass",
      "hint": "missing = sorted(t for t in required if not r['tags'].get(t))",
      "test": "resources = [\n    {'id': 'i-1', 'tags': {'Environment': 'prod', 'Project': 'pinit', 'Owner': 'devops'}},\n    {'id': 'i-2', 'tags': {'Environment': 'dev'}},\n    {'id': 'db-1', 'tags': {'Environment': 'prod', 'Project': '', 'Owner': 'data'}},\n]\ngot = untagged_resources(resources, ['Environment', 'Project', 'Owner'])\nassert got == {'i-2': ['Owner', 'Project'], 'db-1': ['Project']}, f'Got {got}'\nassert untagged_resources(resources[:1], ['Environment']) == {}, 'Fully tagged'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Disaster Recovery Strategy",
      "desc": "Write `dr_strategy(rto_minutes, rpo_minutes)`. Pick the cheapest strategy that meets BOTH targets: 'BackupAndRestore' handles RTO >= 1440 and RPO >= 60; 'PilotLight' handles RTO >= 60 and RPO >= 10; 'WarmStandby' handles RTO >= 5 and RPO >= 1; anything tighter needs 'MultiSiteActiveActive'.",
      "starter": "def dr_strategy(rto_minutes, rpo_minutes):\n    pass",
      "hint": "Check from cheapest to most expensive and return the first that fits both numbers.",
      "test": "assert dr_strategy(0, 0) == 'MultiSiteActiveActive', 'Zero downtime'\nassert dr_strategy(10, 5) == 'WarmStandby', '10 minute RTO'\nassert dr_strategy(60, 30) == 'PilotLight', '1 hour RTO'\nassert dr_strategy(1440, 720) == 'BackupAndRestore', 'A day is fine'\nassert dr_strategy(2000, 5) == 'WarmStandby', 'A long RTO but a tight RPO still needs warm standby'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Downtime and Data Loss Cost",
      "desc": "Write `outage_cost(rto_minutes, rpo_minutes, orders_per_minute, order_value)`. During the RTO no orders come in; during the RPO window orders already taken are lost. Return {'lost_sales': rto * orders * value, 'lost_data': rpo * orders * value, 'total': both added}.",
      "starter": "def outage_cost(rto_minutes, rpo_minutes, orders_per_minute, order_value):\n    pass",
      "hint": "per_minute = orders_per_minute * order_value",
      "test": "assert outage_cost(30, 15, 100, 50) == {'lost_sales': 150000, 'lost_data': 75000, 'total': 225000}, '30 min down, 15 min of data lost'\nassert outage_cost(0, 0, 100, 50) == {'lost_sales': 0, 'lost_data': 0, 'total': 0}, 'Active-active: nothing lost'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Multi-Region Transaction Router",
      "desc": "Write `route_transaction(regions, txn)`. regions is a list of {'code', 'healthy', 'latency_ms', 'allowed_countries'}. Pick the healthy region with the lowest latency whose allowed_countries contains txn['country'] (data residency). Ties go to the region listed first. Return {'success': True, 'region': code}, or {'success': False, 'region': None} when none qualifies.",
      "starter": "def route_transaction(regions, txn):\n    pass",
      "hint": "ok = [r for r in regions if r['healthy'] and txn['country'] in r['allowed_countries']]; min(ok, key=lambda r: r['latency_ms'])",
      "test": "regions = [\n    {'code': 'us-east-1', 'healthy': True, 'latency_ms': 25, 'allowed_countries': ['US', 'CA']},\n    {'code': 'eu-west-1', 'healthy': True, 'latency_ms': 110, 'allowed_countries': ['DE', 'FR', 'US']},\n    {'code': 'eu-central-1', 'healthy': False, 'latency_ms': 15, 'allowed_countries': ['DE', 'FR']},\n]\nassert route_transaction(regions, {'country': 'US', 'amount': 5000}) == {'success': True, 'region': 'us-east-1'}, 'Closest healthy region'\nassert route_transaction(regions, {'country': 'DE', 'amount': 90}) == {'success': True, 'region': 'eu-west-1'}, 'Frankfurt is down, so Ireland; data stays in the EU'\nassert route_transaction(regions, {'country': 'IN', 'amount': 10}) == {'success': False, 'region': None}, 'No region may hold Indian data here'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Cloud Readiness Audit",
      "desc": "Write `readiness_audit(checks)` where checks maps a check name ('multi_region', 'security', 'backups_tested', 'cost_tags', ...) to True or False, plus a 'finops_score' from 0 to 100. Return {'certified': ..., 'failed': [failed check names, sorted], 'grade': ...}. certified is True when every True/False check passed, there is at least one, and finops_score >= 80. grade is 'TIER_1' when certified, 'TIER_2' when at most one check failed and finops_score >= 60, otherwise 'NOT_READY'.",
      "starter": "def readiness_audit(checks):\n    pass",
      "hint": "score = checks.get('finops_score', 0); flags = {k: v for k, v in checks.items() if k != 'finops_score'}",
      "test": "good = {'multi_region': True, 'security': True, 'backups_tested': True, 'finops_score': 85}\nassert readiness_audit(good) == {'certified': True, 'failed': [], 'grade': 'TIER_1'}, 'Ready'\none_gap = dict(good, security=False)\nassert readiness_audit(one_gap) == {'certified': False, 'failed': ['security'], 'grade': 'TIER_2'}, 'One gap'\ncheap_miss = dict(good, finops_score=70)\nassert readiness_audit(cheap_miss)['grade'] == 'TIER_2', 'Every check passed but FinOps is below 80'\nbad = {'multi_region': False, 'security': False, 'backups_tested': True, 'finops_score': 90}\nassert readiness_audit(bad) == {'certified': False, 'failed': ['multi_region', 'security'], 'grade': 'NOT_READY'}, 'Two gaps'\nassert readiness_audit({'finops_score': 100})['certified'] is False, 'No checks, no certificate'\nprint('All checks passed.')"
    }
  }
];

export const CLOUD_PYTHON_30_DAYS_CONFIGS: DayConfig[] = CLOUD_30_DAYS_CONFIGS.map((cfg, i) => {
  const day = DAYS[i];
  return {
    ...cfg,
    eTitle: day.e.title,
    eDesc: day.e.desc,
    eStarter: day.e.starter,
    eHint: day.e.hint,
    eTest: day.e.test,
    aTitle: day.a.title,
    aDesc: day.a.desc,
    aStarter: day.a.starter,
    aHint: day.a.hint,
    aTest: day.a.test,
  };
});

export const CLOUD_PYTHON_30_DAYS_QUESTS: CourseQuest[] = CLOUD_PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('cloud-py', idx + 1, cfg)
);
