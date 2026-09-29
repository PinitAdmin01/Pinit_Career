/**
 * Cloud Engineering in Python: full-length lessons (about 20-30 minutes each), one per course day, written in plain
 * words for the Python track. Every code sample runs in the browser (Pyodide) and prints exactly
 * its `output`; tests/python_track_long_lessons.test.ts checks this and each lesson's length.
 * Days without a long lesson here still use the shorter lesson plan.
 */
import type { LongLesson } from './longLessons';

export const CLOUD_PYTHON_LONG_LESSONS: LongLesson[] = [
  {
    "day": 1,
    "title": "Cloud Computing Models (IaaS, PaaS, SaaS) & Shared Responsibility",
    "goal": "You can explain what \"the cloud\" really is, tell IaaS, PaaS and SaaS apart, say who is responsible for what under the shared responsibility model, and compare the cost of owning servers with renting them.",
    "minutes": 30,
    "recap": "This is the first day of the cloud course. You already know how to write Python functions; now we use them to model how real companies run software on Amazon Web Services (AWS).",
    "parts": [
      {
        "title": "What the cloud really is",
        "say": [
          "The cloud is simply other people's computers that you rent by the second, through an API, instead of buying and running them yourself.",
          "Before the cloud, a company that wanted to launch a website had to buy servers, rent space in a data centre, wire up power and cooling, and wait weeks for delivery.",
          "With AWS you call an API (or click a button) and a virtual server is running in about a minute. When you no longer need it you delete it and stop paying.",
          "Three ideas make this work. On-demand: you get resources when you ask. Elastic: you can grow and shrink with traffic. Pay-as-you-go: you pay for what you use, like electricity.",
          "The trade is capital expense (a big cheque up front for hardware) for operating expense (a monthly bill that follows your usage).",
          "This matters most when traffic is uneven. A shop that is busy for one week in November would otherwise buy enough servers for that week and leave them idle for the other fifty-one.",
          "AWS is the largest cloud provider; Microsoft Azure and Google Cloud are the next two. The ideas in this course carry over to all of them, only the product names change.",
          "The example compares buying servers for your busiest day with renting exactly what each month needs."
        ],
        "example": "Owning a car versus taking taxis. If you drive every day, owning can be cheaper. If you need a van twice a year, renting wins easily.",
        "code": "monthly_peak_servers = [4, 4, 5, 4, 6, 5, 4, 4, 5, 8, 12, 20]\nserver_price_per_month = 300    # renting one cloud server for a month\nowned_server_cost = 250          # the same server bought, spread per month\n\nown = max(monthly_peak_servers) * owned_server_cost * 12\nrent = sum(monthly_peak_servers) * server_price_per_month\nprint(\"Buy for the peak:\", own)\nprint(\"Rent what you use:\", rent)\nprint(\"Saving:\", own - rent)",
        "output": "Buy for the peak: 60000\nRent what you use: 24300\nSaving: 35700",
        "codeNotes": [
          {
            "line": 5,
            "note": "Owning means buying enough for the busiest month and keeping it all year."
          },
          {
            "line": 6,
            "note": "Renting pays only for the servers each month really needs."
          }
        ],
        "tryIt": "Change the last month from 20 servers to 8. Is renting still cheaper? Why does the answer change?",
        "check": {
          "question": "Why does the cloud save the most money for a shop with a big holiday rush?",
          "options": [
            "Cloud servers are always cheaper per hour",
            "You pay for the rush only during the rush instead of owning peak capacity all year",
            "AWS gives free servers in November"
          ],
          "answer": 1,
          "why": "Per hour a rented server can cost more; the saving comes from not paying for idle peak capacity the rest of the year."
        }
      },
      {
        "title": "IaaS, PaaS and SaaS",
        "say": [
          "Cloud services come in three broad levels, depending on how much the provider manages for you.",
          "Infrastructure as a Service (IaaS) gives you raw building blocks: virtual machines, disks and networks. Amazon EC2 is the classic example. You install the operating system updates, the language runtime and your app.",
          "Platform as a Service (PaaS) runs the platform for you. With Amazon RDS you get a working database without ever logging into its server. With AWS Lambda you upload a function and AWS runs it.",
          "Software as a Service (SaaS) is a finished application you just use, like Gmail, Slack or Amazon WorkDocs. You manage only your own data and users.",
          "Moving from IaaS to SaaS you gain convenience and lose control. With EC2 you can tune every setting; with RDS you cannot install your own database plug-ins on the server.",
          "Most real systems mix all three: a React front end on a managed hosting service, an API on Lambda (PaaS), one special job on EC2 (IaaS), and email through a SaaS provider.",
          "The example sorts some AWS services into the three levels with a dictionary, which is exactly Practice 2 of today."
        ],
        "example": "Pizza four ways: make it at home (on-premises), buy a take-and-bake kit (IaaS), order delivery (PaaS), or eat at a restaurant (SaaS). Each step up, someone else does more of the work.",
        "code": "MODELS = {\n    \"EC2\": \"IaaS\", \"EBS\": \"IaaS\", \"VPC\": \"IaaS\",\n    \"RDS\": \"PaaS\", \"Lambda\": \"PaaS\", \"DynamoDB\": \"PaaS\",\n    \"WorkDocs\": \"SaaS\", \"Chime\": \"SaaS\",\n}\n\nfor service in [\"EC2\", \"Lambda\", \"WorkDocs\", \"Minecraft\"]:\n    print(service, \"->\", MODELS.get(service, \"UNKNOWN\"))",
        "output": "EC2 -> IaaS\nLambda -> PaaS\nWorkDocs -> SaaS\nMinecraft -> UNKNOWN",
        "codeNotes": [
          {
            "line": 8,
            "note": ".get with a default handles names we have not listed."
          }
        ],
        "tryIt": "Add \"Elastic Beanstalk\" (it deploys your web app onto servers it manages). Which level does it belong to?",
        "check": {
          "question": "You upload a Python function and AWS runs it when called. Which level is that?",
          "options": [
            "IaaS",
            "PaaS",
            "SaaS"
          ],
          "answer": 1,
          "why": "You manage only your code; AWS runs the servers, operating system and runtime, which makes Lambda a platform service."
        }
      },
      {
        "title": "The shared responsibility model",
        "say": [
          "Security in the cloud is a partnership. AWS calls it the shared responsibility model: AWS is responsible for security OF the cloud, you are responsible for security IN the cloud.",
          "Security OF the cloud means the buildings, the guards, the hardware, the network cables and the hypervisor software that splits one physical machine into many virtual ones.",
          "Security IN the cloud means everything you configure: who can log in, which ports are open, whether data is encrypted, and your application code.",
          "Where the line sits depends on the service level. On EC2 (IaaS) you must patch the operating system yourself. On RDS (PaaS) AWS patches it. On SaaS the vendor even writes the application.",
          "One thing never moves: your data and who can access it are always your responsibility. Most real cloud breaches are customer mistakes, such as a storage bucket left open to the whole internet.",
          "We can model the stack as a list of layers from the bottom up, and say how many bottom layers AWS owns for each model.",
          "That is Practice 1: responsibility_owner(layer, model) returns \"AWS\" or \"CUSTOMER\" using the index of the layer in the list."
        ],
        "example": "Renting a flat: the landlord keeps the roof, walls and wiring safe; you lock your own door and decide who gets a key.",
        "code": "LAYERS = [\"PHYSICAL_DATACENTER\", \"HYPERVISOR\", \"OS_PATCHING\",\n          \"RUNTIME\", \"APPLICATION_CODE\", \"DATA\"]\nAWS_OWNS = {\"IaaS\": 2, \"PaaS\": 4, \"SaaS\": 5}\n\ndef responsibility_owner(layer, model):\n    return \"AWS\" if LAYERS.index(layer) < AWS_OWNS[model] else \"CUSTOMER\"\n\nfor model in [\"IaaS\", \"PaaS\", \"SaaS\"]:\n    row = [responsibility_owner(layer, model)[0] for layer in LAYERS]\n    print(model, \" \".join(row))",
        "output": "IaaS A A C C C C\nPaaS A A A A C C\nSaaS A A A A A C",
        "codeNotes": [
          {
            "line": 3,
            "note": "How many layers, counted from the bottom, AWS looks after."
          },
          {
            "line": 6,
            "note": "A layer below the cut-off belongs to AWS."
          },
          {
            "line": 9,
            "note": "A for AWS, C for customer, one letter per layer."
          }
        ],
        "tryIt": "Print responsibility_owner(\"DATA\", model) for all three models. Why is it always CUSTOMER?",
        "check": {
          "question": "A company runs its database on EC2 and forgets to install a security patch. Whose responsibility was that?",
          "options": [
            "AWS, because it is their cloud",
            "The customer, because on IaaS the operating system is theirs to patch",
            "Nobody, patches are optional"
          ],
          "answer": 1,
          "why": "On EC2 AWS stops at the hypervisor; the guest operating system and everything above it is yours."
        }
      },
      {
        "title": "Paying for what you use",
        "say": [
          "Cloud prices are published per unit: per hour or second of a server, per gigabyte stored per month, per million function calls, per gigabyte sent out to the internet.",
          "Because the bill follows usage, engineers can see cost as part of design. A slow, wasteful program is not just annoying; it shows up on the invoice.",
          "The three biggest items on most bills are compute (servers and functions), storage (disks and object storage) and data transfer out (bytes leaving AWS to users).",
          "Data coming INTO AWS is usually free, while data going OUT costs money. That surprises many beginners when a popular download suddenly produces a large bill.",
          "Free tiers exist for learning, but they have limits. Always set a billing alarm on a new account so a forgotten server cannot run up a bill quietly.",
          "The example adds up a simple monthly bill from a list of line items. Real AWS bills are much longer, but they are built the same way: quantity times price, summed.",
          "Later in the course (Day 28) we return to cost with Savings Plans and tags, which is the job called FinOps."
        ],
        "example": "A mobile phone plan billed by minutes, texts and data: you can see exactly which habit made this month expensive.",
        "code": "items = [\n    (\"EC2 server hours\", 720, 0.0416),\n    (\"EBS disk GB-months\", 50, 0.08),\n    (\"S3 storage GB-months\", 200, 0.023),\n    (\"Data out to internet GB\", 100, 0.09),\n]\ntotal = 0\nfor name, qty, price in items:\n    cost = qty * price\n    total += cost\n    print(f\"{name:26} {cost:8.2f}\")\nprint(f\"{'TOTAL':26} {total:8.2f}\")",
        "output": "EC2 server hours              29.95\nEBS disk GB-months             4.00\nS3 storage GB-months           4.60\nData out to internet GB        9.00\nTOTAL                         47.55",
        "codeNotes": [
          {
            "line": 2,
            "note": "720 hours is one server running the whole month."
          },
          {
            "line": 9,
            "note": "Every cloud line item is quantity times unit price."
          }
        ],
        "tryIt": "Double the data out to 200 GB. Which line becomes the most expensive?",
        "check": {
          "question": "Which usually costs money on AWS?",
          "options": [
            "Uploading data into AWS",
            "Data sent out from AWS to users on the internet",
            "Deleting a server"
          ],
          "answer": 1,
          "why": "Inbound transfer is generally free; outbound transfer to the internet is charged per gigabyte."
        }
      },
      {
        "title": "How you talk to AWS: console, CLI and code",
        "say": [
          "There are three ways to control AWS. The web console is good for learning and looking around. The command line tool (the AWS CLI) is good for quick scripted jobs.",
          "The third way is code. In Python the official library is boto3. It turns Python calls such as ec2.run_instances(...) into signed calls to the AWS API.",
          "Every AWS action, whether from the console, the CLI or boto3, becomes the same kind of API call, checked against your permissions (Day 6) and recorded in an audit log.",
          "In this course the code runs in your browser, so it cannot reach real AWS. Instead we model AWS behaviour with plain Python data: dictionaries shaped like the real API responses.",
          "That is a genuine professional skill. Engineers write exactly these kinds of functions to check configurations, test policies and review infrastructure before it is deployed.",
          "The example shows the shape of a real boto3 response for a list of servers, and reads it the same way you would in production code.",
          "Notice that responses are nested dictionaries and lists. Most cloud scripting is careful reading of nested data like this."
        ],
        "example": "A restaurant kitchen takes orders from the waiter, the phone and the app, but the chef receives them all as the same kind of ticket.",
        "code": "# The shape of ec2.describe_instances() from boto3, trimmed down\nresponse = {\"Reservations\": [\n    {\"Instances\": [{\"InstanceId\": \"i-0a1\", \"State\": {\"Name\": \"running\"}, \"InstanceType\": \"t3.micro\"}]},\n    {\"Instances\": [{\"InstanceId\": \"i-0b2\", \"State\": {\"Name\": \"stopped\"}, \"InstanceType\": \"m5.large\"}]},\n]}\n\nfor reservation in response[\"Reservations\"]:\n    for inst in reservation[\"Instances\"]:\n        print(inst[\"InstanceId\"], inst[\"InstanceType\"], inst[\"State\"][\"Name\"])",
        "output": "i-0a1 t3.micro running\ni-0b2 m5.large stopped",
        "codeNotes": [
          {
            "line": 2,
            "note": "Real AWS responses group servers into reservations."
          },
          {
            "line": 9,
            "note": "Reading nested keys, exactly as with a live response."
          }
        ],
        "tryIt": "Count how many instances are running and print only that number.",
        "check": {
          "question": "What is boto3?",
          "options": [
            "A database",
            "The official Python library for calling AWS APIs",
            "A type of EC2 server"
          ],
          "answer": 1,
          "why": "boto3 wraps the AWS API so Python code can create and manage cloud resources."
        }
      },
      {
        "title": "Practice time: model the cloud in code",
        "say": [
          "Practice 1 is responsibility_owner(layer, model). Keep the list of layers, find the index of the layer, and compare it with how many layers AWS owns for that model.",
          "A dictionary such as {\"IaaS\": 2, \"PaaS\": 4, \"SaaS\": 5} turns the rule into data. Adding a new model later means adding one entry, not rewriting if statements.",
          "Practice 2 is cloud_model(service). A dictionary from service name to level, read with .get(service, \"UNKNOWN\"), handles every case including unknown names.",
          "Both tasks share a lesson: when business rules are a table, store them as a table. Code that reads a table is shorter and easier to check than a long chain of if and elif.",
          "The checks try each model and some edge cases, such as the DATA layer (always the customer) and a service name that is not on the list.",
          "Read each failing message carefully: it tells you which case failed and what was expected.",
          "The example below is a small warm-up: it prints who owns each layer on PaaS, which is the middle ground most teams choose."
        ],
        "example": "A seating chart for a wedding: instead of remembering where everyone sits, you write it down once and look it up.",
        "code": "LAYERS = [\"PHYSICAL_DATACENTER\", \"HYPERVISOR\", \"OS_PATCHING\",\n          \"RUNTIME\", \"APPLICATION_CODE\", \"DATA\"]\naws_count = {\"IaaS\": 2, \"PaaS\": 4, \"SaaS\": 5}[\"PaaS\"]\nfor i, layer in enumerate(LAYERS):\n    owner = \"AWS\" if i < aws_count else \"CUSTOMER\"\n    print(f\"{layer:20} {owner}\")",
        "output": "PHYSICAL_DATACENTER  AWS\nHYPERVISOR           AWS\nOS_PATCHING          AWS\nRUNTIME              AWS\nAPPLICATION_CODE     CUSTOMER\nDATA                 CUSTOMER",
        "codeNotes": [
          {
            "line": 3,
            "note": "Looking up the rule for PaaS in the table."
          },
          {
            "line": 4,
            "note": "enumerate gives each layer its position."
          }
        ],
        "tryIt": "Change \"PaaS\" to \"IaaS\" and compare the two outputs. Which layers moved to the customer?",
        "check": {
          "question": "Why store \"how many layers AWS owns\" in a dictionary?",
          "options": [
            "Dictionaries are faster than lists",
            "The rule is a table, so a table in code is shorter and easy to extend",
            "Python needs it for strings"
          ],
          "answer": 1,
          "why": "Data-driven rules are easier to read, test and extend than long chains of if statements."
        }
      }
    ],
    "summary": [
      "The cloud is rented computing, available on demand, elastic, and billed by use.",
      "IaaS gives building blocks (EC2), PaaS runs the platform (RDS, Lambda), SaaS is a finished app.",
      "Shared responsibility: AWS secures the cloud itself; you secure what you put in it, and your data is always yours.",
      "Bills are quantity times price; compute, storage and data out are the big items.",
      "Every AWS action is an API call; in Python you make them with boto3."
    ],
    "projectStep": {
      "title": "Cloud cost and responsibility sheet",
      "steps": [
        "Write responsibility_owner(layer, model) and print a table of all layers for all three models.",
        "List five AWS services your dream app would use and label each IaaS, PaaS or SaaS.",
        "Estimate a monthly bill for that app with quantity times price, and note which line is largest."
      ]
    }
  },
  {
    "day": 2,
    "title": "AWS Global Infrastructure, Regions & Availability Zones",
    "goal": "You can describe the AWS global network of Regions, Availability Zones and edge locations, choose a Region for a workload, validate region codes, and explain why spreading servers over two or more AZs keeps an app online.",
    "minutes": 30,
    "recap": "Yesterday you learned what the cloud is and who secures which parts. Today we look at where the cloud physically lives, because location decides speed, cost, law and survival.",
    "parts": [
      {
        "title": "Regions: separate clouds around the world",
        "say": [
          "AWS runs its cloud in more than 30 geographic Regions, such as us-east-1 (North Virginia), eu-west-1 (Ireland) and ap-south-1 (Mumbai).",
          "Each Region is a separate, independent cloud. Resources you create in one Region stay there unless you copy them elsewhere on purpose.",
          "Choosing a Region is one of the first design decisions for any project, and four questions decide it.",
          "First, law and compliance: some data, such as health or banking records, must stay inside a certain country or area. That can rule out most Regions at once.",
          "Second, latency: users get faster pages from a Region close to them, because data cannot travel faster than light in fibre.",
          "Third, services: new AWS services often launch in a few big Regions first. Fourth, price: the same server can cost noticeably more in one Region than another.",
          "The example scores Regions for a customer base in India, filtering by law first and then picking the fastest."
        ],
        "example": "Choosing which city to open a warehouse in: it must be legal to operate there, close to customers, stocked with what you need, and affordable.",
        "code": "regions = [\n    {\"code\": \"ap-south-1\", \"country\": \"IN\", \"latency_ms\": 20, \"price\": 1.00},\n    {\"code\": \"ap-southeast-1\", \"country\": \"SG\", \"latency_ms\": 60, \"price\": 1.05},\n    {\"code\": \"us-east-1\", \"country\": \"US\", \"latency_ms\": 210, \"price\": 0.90},\n]\nmust_stay_in = {\"IN\", \"SG\"}   # our (made-up) data rule\nallowed = [r for r in regions if r[\"country\"] in must_stay_in]\nbest = min(allowed, key=lambda r: r[\"latency_ms\"])\nprint(\"Allowed:\", [r[\"code\"] for r in allowed])\nprint(\"Choose:\", best[\"code\"])",
        "output": "Allowed: ['ap-south-1', 'ap-southeast-1']\nChoose: ap-south-1",
        "codeNotes": [
          {
            "line": 7,
            "note": "Law comes first: drop every Region the data may not live in."
          },
          {
            "line": 8,
            "note": "Then pick the lowest latency among what is left."
          }
        ],
        "tryIt": "Remove \"IN\" from must_stay_in. Which Region is chosen now, and is it the cheapest?",
        "check": {
          "question": "Your health app must keep patient data in Germany. What decides the Region first?",
          "options": [
            "The lowest price",
            "The data residency rule",
            "The Region with the most services"
          ],
          "answer": 1,
          "why": "A legal requirement is a hard filter; price and speed only choose among the Regions that are allowed."
        }
      },
      {
        "title": "Availability Zones: failure boundaries inside a Region",
        "say": [
          "Each Region contains several Availability Zones (AZs), usually three or more. An AZ is one or more data centres with their own power, cooling and network.",
          "AZs in a Region are many kilometres apart, so a fire, flood or power cut is unlikely to hit two at once. Yet they are linked by fast private fibre, typically with single-digit millisecond latency between them.",
          "AZ names add a letter to the Region code: us-east-1a, us-east-1b, us-east-1c. That is why \"us-east-1a\" is an AZ, not a Region.",
          "This design is the foundation of high availability on AWS. If you run your app in two AZs and one fails, the other keeps serving users.",
          "A single server, or several servers in one AZ, is a single point of failure: one bad day in one building takes you offline.",
          "Practice 1 checks this rule: is_fault_tolerant(nodes) returns True only when the servers cover at least two different AZs.",
          "A Python set is perfect for it, because a set keeps only distinct values, so its length is the number of different AZs."
        ],
        "example": "Keeping copies of your house keys at home and at a friend's house across town: one lost bag does not lock you out.",
        "code": "def is_fault_tolerant(nodes):\n    return len({n[\"az\"] for n in nodes}) >= 2\n\nsame_az = [{\"id\": \"i-1\", \"az\": \"us-east-1a\"}, {\"id\": \"i-2\", \"az\": \"us-east-1a\"}]\ntwo_azs = [{\"id\": \"i-1\", \"az\": \"us-east-1a\"}, {\"id\": \"i-2\", \"az\": \"us-east-1b\"}]\nprint(\"Two servers, one AZ:\", is_fault_tolerant(same_az))\nprint(\"Two servers, two AZs:\", is_fault_tolerant(two_azs))\nprint(\"No servers:\", is_fault_tolerant([]))",
        "output": "Two servers, one AZ: False\nTwo servers, two AZs: True\nNo servers: False",
        "codeNotes": [
          {
            "line": 2,
            "note": "A set comprehension keeps each AZ once; two or more means we survive an AZ outage."
          }
        ],
        "tryIt": "Add a third server in us-east-1c to same_az. Does the answer change? Why?",
        "check": {
          "question": "You run 10 servers, all in us-east-1a. The AZ loses power. What happens?",
          "options": [
            "Nothing, 10 servers is plenty",
            "The app goes down, because every server was in the failed AZ",
            "AWS moves them automatically"
          ],
          "answer": 1,
          "why": "The number of servers does not help if they share one failure boundary; spread them across AZs."
        }
      },
      {
        "title": "Checking region codes with a regular expression",
        "say": [
          "Region codes follow a strict pattern: a two-letter area (us, eu, ap, sa, ca, me, af), a direction word, and a number. For example ap-southeast-2 is Sydney.",
          "Scripts often receive region codes from users or config files. Checking the format early gives a clear error instead of a confusing failure deep inside a deployment.",
          "Practice 2 builds is_valid_region(code) with Python's re module. re.fullmatch requires the WHOLE string to match the pattern, not just a part of it.",
          "The pattern [a-z]{2} means exactly two lowercase letters. A group like (north|south|east|west|central|southeast) means one of those words. \\d+ means one or more digits.",
          "The order of words in the group does not matter for fullmatch, because the match must still reach the dash and number after it.",
          "Rejecting \"us-east-1a\" matters: it is an AZ, and passing an AZ where a Region is expected is a very common mistake.",
          "The example tests a handful of good and bad codes."
        ],
        "example": "A postcode checker on a delivery form: it cannot tell whether the house exists, but it catches typos before the parcel is sent.",
        "code": "import re\n\nDIRECTIONS = \"north|south|east|west|central|northeast|northwest|southeast|southwest\"\nPATTERN = rf\"[a-z]{{2}}-({DIRECTIONS})-\\d+\"\n\nfor code in [\"us-east-1\", \"ap-southeast-2\", \"eu-central-1\", \"US-EAST-1\", \"us-east-1a\", \"mars-north-1\"]:\n    print(f\"{code:15}\", re.fullmatch(PATTERN, code) is not None)",
        "output": "us-east-1       True\nap-southeast-2  True\neu-central-1    True\nUS-EAST-1       False\nus-east-1a      False\nmars-north-1    False",
        "codeNotes": [
          {
            "line": 4,
            "note": "In an f-string, {{2}} produces a literal {2} for the regex."
          },
          {
            "line": 7,
            "note": "fullmatch fails if anything extra, like the AZ letter, is left over."
          }
        ],
        "tryIt": "Try \"me-central-1\" (the UAE Region). Does the pattern accept it?",
        "check": {
          "question": "Why use re.fullmatch rather than re.search here?",
          "options": [
            "fullmatch is faster",
            "search would accept \"us-east-1a\" because part of it matches",
            "search does not work with dashes"
          ],
          "answer": 1,
          "why": "search finds a match anywhere in the text; fullmatch demands the whole string fit the pattern."
        }
      },
      {
        "title": "Edge locations and the speed of light",
        "say": [
          "Besides Regions, AWS has hundreds of edge locations (points of presence) in cities around the world. They do not run your servers; they cache content and answer DNS close to users.",
          "Amazon CloudFront (Day 16) and Route 53 (Day 17) use these edge locations, so a user in Chennai can get your images from a nearby edge instead of from Virginia.",
          "Why does distance matter so much? Light in optical fibre travels at about 200,000 km per second, roughly two thirds of its speed in a vacuum.",
          "That sounds instant, but a page that needs 20 round trips to a server 13,000 km away wastes more than two seconds just waiting for the wires.",
          "Real networks add routing hops, so actual latency is higher than the physics limit. The limit is still useful: no engineering trick can beat it.",
          "The example computes the best possible round-trip time for a few distances. This is why global apps put data near their users.",
          "Remember the three levels: edge locations (many, for caching), Regions (dozens, for workloads), and AZs (several per Region, for resilience)."
        ],
        "example": "Shouting across a valley: the echo takes time to return no matter how loudly you shout. Only moving closer shortens the wait.",
        "code": "FIBRE_KM_PER_S = 200_000\n\ndef best_round_trip_ms(distance_km):\n    return round(2 * distance_km / FIBRE_KM_PER_S * 1000, 1)\n\nfor place, km in [(\"Same city edge\", 20), (\"Mumbai to Singapore\", 3900), (\"Chennai to Virginia\", 13600)]:\n    rtt = best_round_trip_ms(km)\n    print(f\"{place:22} {rtt:6} ms per trip, {round(rtt * 20)} ms for 20 trips\")",
        "output": "Same city edge            0.2 ms per trip, 4 ms for 20 trips\nMumbai to Singapore      39.0 ms per trip, 780 ms for 20 trips\nChennai to Virginia     136.0 ms per trip, 2720 ms for 20 trips",
        "codeNotes": [
          {
            "line": 4,
            "note": "There and back is twice the distance; times 1000 turns seconds into milliseconds."
          }
        ],
        "tryIt": "How many round trips to Virginia fit in one second? Work it out, then check with code.",
        "check": {
          "question": "What do edge locations mainly do?",
          "options": [
            "Run your databases",
            "Cache content and answer DNS close to users",
            "Store backups for 10 years"
          ],
          "answer": 1,
          "why": "Edge locations serve cached content and DNS quickly; your main workloads run in Regions."
        }
      },
      {
        "title": "Designing for failure",
        "say": [
          "Werner Vogels, the chief technology officer of Amazon, often says: \"Everything fails, all the time.\" Cloud design starts by accepting that.",
          "Disks fail, servers reboot, network links drop, and occasionally a whole AZ has trouble. Good designs keep working when any one piece breaks.",
          "The common pattern is: at least two copies of everything, in at least two AZs, behind a load balancer (Day 8) that sends traffic only to healthy copies.",
          "We can put a number on it. If one AZ is up 99.9 percent of the time and failures are independent, the chance BOTH of two AZs are down is 0.001 times 0.001.",
          "That gives about 99.9999 percent availability for the pair, in theory. In practice failures are not perfectly independent, so real numbers are lower, but the improvement is still huge.",
          "The example shows how downtime per year shrinks as you add AZs.",
          "Multi-Region designs (Day 30) go one step further, for companies that must survive a whole Region going dark."
        ],
        "example": "A plane with two engines that can fly on either one: an engine failure becomes an event to fix, not a disaster.",
        "code": "single_az_uptime = 0.999\nminutes_per_year = 365 * 24 * 60\n\nfor azs in [1, 2, 3]:\n    all_down = (1 - single_az_uptime) ** azs\n    uptime = 1 - all_down\n    print(f\"{azs} AZ(s): {uptime * 100:.7f}% up, about {all_down * minutes_per_year:.4f} minutes down per year\")",
        "output": "1 AZ(s): 99.9000000% up, about 525.6000 minutes down per year\n2 AZ(s): 99.9999000% up, about 0.5256 minutes down per year\n3 AZ(s): 99.9999999% up, about 0.0005 minutes down per year",
        "codeNotes": [
          {
            "line": 5,
            "note": "Independent failures multiply: all AZs down at once gets rarer with each AZ."
          }
        ],
        "tryIt": "Change single_az_uptime to 0.99. How many minutes a year is one AZ down now?",
        "check": {
          "question": "Why does two AZs give much better availability than one?",
          "options": [
            "AWS charges less for two",
            "Both AZs must fail at the same time for the app to go down",
            "Two AZs make servers faster"
          ],
          "answer": 1,
          "why": "The service only stops when every copy is down together, which is far rarer than one copy failing."
        }
      },
      {
        "title": "Practice time: AZ checks and region codes",
        "say": [
          "Practice 1 is is_fault_tolerant(nodes). Build a set of every node's \"az\" value and check that it has at least two members. An empty list gives an empty set, so it is correctly not fault tolerant.",
          "Practice 2 is is_valid_region(code). Use re.fullmatch with the pattern for two letters, a direction word and a number.",
          "Common mistake for Practice 1: counting servers instead of AZs. Ten servers in one AZ are still one point of failure.",
          "Common mistake for Practice 2: forgetting that uppercase codes are invalid, or accepting AZ names like us-east-1a because the pattern was not anchored.",
          "Both functions are tiny, but they are the kind of guard rails real platform teams put in deployment pipelines so nobody ships a single-AZ database by accident.",
          "After you pass, try extending is_fault_tolerant to require at least one server in each of the AZs you list, a stricter rule some teams use.",
          "The example shows a quick report of servers per AZ using collections.Counter, a handy tool for this kind of question."
        ],
        "example": "A checklist a pilot runs before take-off: short, boring, and it prevents the mistakes that matter most.",
        "code": "from collections import Counter\n\nfleet = [\"us-east-1a\", \"us-east-1a\", \"us-east-1b\", \"us-east-1a\", \"us-east-1c\"]\nper_az = Counter(fleet)\nprint(per_az)\nprint(\"AZs used:\", len(per_az))\nprint(\"Most loaded AZ:\", per_az.most_common(1)[0])",
        "output": "Counter({'us-east-1a': 3, 'us-east-1b': 1, 'us-east-1c': 1})\nAZs used: 3\nMost loaded AZ: ('us-east-1a', 3)",
        "codeNotes": [
          {
            "line": 4,
            "note": "Counter counts how many servers sit in each AZ."
          }
        ],
        "tryIt": "If us-east-1a fails, how many of the five servers are left? Compute it from per_az.",
        "check": {
          "question": "Which fleet is fault tolerant across AZs?",
          "options": [
            "Five servers in us-east-1a",
            "One server in us-east-1a and one in us-east-1b",
            "One very large server"
          ],
          "answer": 1,
          "why": "Covering two AZs is what lets the service survive the loss of one."
        }
      }
    ],
    "summary": [
      "A Region is an independent AWS cloud in one area; choose it by law, latency, services and price.",
      "Availability Zones are separate data centres in a Region, linked by fast fibre; spread workloads across at least two.",
      "Region codes look like us-east-1; AZ names add a letter, like us-east-1a.",
      "Edge locations cache content and answer DNS near users; the speed of light sets a hard latency floor.",
      "Design for failure: two or more copies in two or more AZs turns outages into non-events."
    ],
    "projectStep": {
      "title": "Where should my app live?",
      "steps": [
        "Pick where your users are and any data rules, then choose a Region with a small scoring script.",
        "Write is_fault_tolerant and use it to check a planned fleet of servers.",
        "Estimate yearly downtime for one, two and three AZs."
      ]
    }
  },
  {
    "day": 3,
    "title": "Virtual Private Cloud (VPC) Architecture & CIDR Subnetting",
    "goal": "You can design a Virtual Private Cloud, read CIDR notation, split an address range into subnets, count the usable addresses in an AWS subnet, and tell a public subnet from a private one by its route table.",
    "minutes": 30,
    "recap": "Yesterday you learned that a Region has several Availability Zones. Today you build the private network your servers live in, spread across those AZs.",
    "parts": [
      {
        "title": "Your own private network: the VPC",
        "say": [
          "A Virtual Private Cloud (VPC) is your own isolated network inside an AWS Region. Nothing can reach your servers unless you open a path.",
          "When you create a VPC you choose its address range, for example 10.0.0.0/16. Every server in the VPC gets a private IP address from that range.",
          "Private ranges such as 10.x.x.x, 172.16-31.x.x and 192.168.x.x are reserved for internal networks and are never used on the public internet.",
          "A VPC spans all the AZs of its Region, but it is divided into subnets, and each subnet lives in exactly one AZ.",
          "So the classic layout is a VPC with, for each AZ, one public subnet for things that face the internet (load balancers) and one private subnet for everything else (app servers and databases).",
          "Plan the range carefully. You cannot easily change a VPC's main range later, and if you ever connect two VPCs or your office network, their ranges must not overlap.",
          "The example uses Python's built-in ipaddress module to look at a VPC range."
        ],
        "example": "A gated housing estate: the estate has its own internal streets and house numbers, and a guarded gate decides who comes in.",
        "code": "import ipaddress\n\nvpc = ipaddress.ip_network(\"10.0.0.0/16\")\nprint(\"VPC range:\", vpc)\nprint(\"First address:\", vpc.network_address)\nprint(\"Last address:\", vpc.broadcast_address)\nprint(\"Total addresses:\", vpc.num_addresses)\nprint(\"Is private:\", vpc.is_private)",
        "output": "VPC range: 10.0.0.0/16\nFirst address: 10.0.0.0\nLast address: 10.0.255.255\nTotal addresses: 65536\nIs private: True",
        "codeNotes": [
          {
            "line": 3,
            "note": "ip_network understands CIDR notation directly."
          },
          {
            "line": 8,
            "note": "10.0.0.0/8 is one of the private ranges."
          }
        ],
        "tryIt": "Try 192.168.0.0/24 and 8.8.8.0/24. Which one is private?",
        "check": {
          "question": "A subnet in AWS lives in how many Availability Zones?",
          "options": [
            "All AZs in the Region",
            "Exactly one AZ",
            "Two AZs for safety"
          ],
          "answer": 1,
          "why": "A VPC spans the Region, but each subnet belongs to a single AZ; you get resilience by using subnets in several AZs."
        }
      },
      {
        "title": "Reading CIDR notation",
        "say": [
          "CIDR notation writes a range as an address and a slash number, like 10.0.1.0/24. An IPv4 address has 32 bits.",
          "The slash number says how many of those bits are fixed (the network part). The remaining bits are free to number the hosts.",
          "So /24 fixes 24 bits and leaves 8 free: 2 to the power 8 = 256 addresses. /16 leaves 16 free bits: 65,536 addresses.",
          "A bigger slash number means a SMALLER network. /28 leaves only 4 free bits: 16 addresses. Beginners often get this backwards.",
          "A handy rule: each step of 1 in the slash number halves or doubles the size. /23 is twice /24; /25 is half of /24.",
          "AWS lets a VPC be anything from /16 (largest) to /28 (smallest), and the same limits apply to subnets.",
          "The example prints the size for several prefix lengths using 2 ** (32 - prefix)."
        ],
        "example": "A phone number with a fixed area code: the more digits the area code takes, the fewer numbers are left for the people in that area.",
        "code": "for prefix in [16, 20, 23, 24, 25, 28]:\n    size = 2 ** (32 - prefix)\n    print(f\"/{prefix}: {size:6} addresses\")",
        "output": "/16:  65536 addresses\n/20:   4096 addresses\n/23:    512 addresses\n/24:    256 addresses\n/25:    128 addresses\n/28:     16 addresses",
        "codeNotes": [
          {
            "line": 2,
            "note": "The free bits are 32 minus the prefix; each bit doubles the count."
          }
        ],
        "tryIt": "Without running it, how many addresses does /26 have? Then check.",
        "check": {
          "question": "Which network is larger?",
          "options": [
            "10.0.0.0/28",
            "10.0.0.0/20",
            "They are the same size"
          ],
          "answer": 1,
          "why": "/20 leaves 12 free bits (4,096 addresses); /28 leaves only 4 (16 addresses)."
        }
      },
      {
        "title": "The five addresses AWS keeps",
        "say": [
          "In every subnet, AWS reserves five addresses that you cannot give to servers.",
          "In 10.0.1.0/24 those are: .0 (the network address), .1 (the VPC router), .2 (the DNS server), .3 (kept for future use) and .255 (the last address, the broadcast address).",
          "So a /24 subnet has 256 addresses but only 251 usable ones. A tiny /28 has 16 addresses and only 11 usable.",
          "This matters when you size subnets. Lambda functions in a VPC, containers and load balancers all consume addresses, and running out stops new servers from starting.",
          "Practice 1 is usable_subnet_ips(mask): 2 ** (32 - mask) minus 5, and 0 for any mask outside AWS's allowed /16 to /28.",
          "Checking the range first is called a guard clause. It handles the invalid input at the top, so the main formula below stays simple.",
          "The example lists the reserved addresses of a real subnet with ipaddress."
        ],
        "example": "A car park where the first spaces are marked for staff, disabled drivers and deliveries: the sign says 256 spaces, but you can only use 251.",
        "code": "import ipaddress\n\ndef usable_subnet_ips(mask):\n    if not 16 <= mask <= 28:\n        return 0\n    return 2 ** (32 - mask) - 5\n\nsubnet = list(ipaddress.ip_network(\"10.0.1.0/24\"))\nprint(\"Reserved:\", [str(a) for a in subnet[:4]], \"and\", subnet[-1])\nfor m in [24, 28, 30]:\n    print(f\"/{m}: {usable_subnet_ips(m)} usable\")",
        "output": "Reserved: ['10.0.1.0', '10.0.1.1', '10.0.1.2', '10.0.1.3'] and 10.0.1.255\n/24: 251 usable\n/28: 11 usable\n/30: 0 usable",
        "codeNotes": [
          {
            "line": 4,
            "note": "Guard clause: AWS subnets must be /16 to /28."
          },
          {
            "line": 9,
            "note": "The first four addresses and the last one are AWS's."
          }
        ],
        "tryIt": "A team needs 100 containers in one subnet. What is the smallest subnet size that fits?",
        "check": {
          "question": "How many usable addresses does an AWS /28 subnet have?",
          "options": [
            "16",
            "14",
            "11"
          ],
          "answer": 2,
          "why": "16 addresses minus the 5 AWS reserves leaves 11."
        }
      },
      {
        "title": "Splitting a VPC into subnets",
        "say": [
          "Once you have a VPC range, you carve it into subnets. A common plan gives each subnet a /24 inside a /16 VPC, which allows up to 256 subnets.",
          "Subnets must not overlap. Two subnets that share addresses would confuse the router about where a packet belongs.",
          "Python's ipaddress module can split a network for you with .subnets(new_prefix=24), which yields the pieces in order.",
          "A tidy numbering scheme helps humans: for example 10.0.1.0/24 and 10.0.2.0/24 for public subnets in AZ a and b, 10.0.11.0/24 and 10.0.12.0/24 for private ones.",
          "Leave room to grow. It is easy to add more subnets later if the VPC range has space left; it is painful if you used it all up on day one.",
          "The example takes a /16 and hands out the first four /24 blocks to a two-AZ design.",
          "On Day 5 you will check that a whole layout like this has no overlaps, using .overlaps() from the same module."
        ],
        "example": "Dividing a big plot of land into numbered building plots with clear boundaries, keeping some plots empty for the future.",
        "code": "import ipaddress\n\nvpc = ipaddress.ip_network(\"10.0.0.0/16\")\nblocks = vpc.subnets(new_prefix=24)\nplan = [\"public-a\", \"public-b\", \"private-a\", \"private-b\"]\nfor name, block in zip(plan, blocks):\n    print(f\"{name:10} {block}\")\nprint(\"Blocks available in total:\", len(list(vpc.subnets(new_prefix=24))))",
        "output": "public-a   10.0.0.0/24\npublic-b   10.0.1.0/24\nprivate-a  10.0.2.0/24\nprivate-b  10.0.3.0/24\nBlocks available in total: 256",
        "codeNotes": [
          {
            "line": 4,
            "note": "subnets() splits the VPC into equal /24 blocks, in order."
          },
          {
            "line": 6,
            "note": "zip stops after the four names we need."
          }
        ],
        "tryIt": "Change new_prefix to 20. How many blocks are there, and how big is each?",
        "check": {
          "question": "Why must subnets inside one VPC never overlap?",
          "options": [
            "AWS charges extra",
            "The router could not tell which subnet an address belongs to",
            "Overlaps make the VPC slower but still work"
          ],
          "answer": 1,
          "why": "Every address must belong to exactly one subnet so traffic can be routed correctly."
        }
      },
      {
        "title": "Public and private subnets: it is all in the route table",
        "say": [
          "Here is a fact that surprises many people: AWS has no checkbox called \"public subnet\". What makes a subnet public is its route table.",
          "A route table is a list of rules: for this destination range, send packets to this target. Every subnet is linked to one route table.",
          "Every route table has a \"local\" route for the VPC range, so servers inside the VPC can always reach each other.",
          "A PUBLIC subnet has one extra route: destination 0.0.0.0/0 (anything not matched elsewhere) with target an internet gateway, whose id starts with igw-.",
          "A PRIVATE subnet has no route to an internet gateway. It may send 0.0.0.0/0 to a NAT gateway (nat-...), which lets servers download updates without being reachable from outside.",
          "Practice 2 is has_internet_route(routes): look for a route whose destination is exactly \"0.0.0.0/0\" and whose target starts with \"igw-\".",
          "The example checks two route tables with any() and a generator expression."
        ],
        "example": "A building's exits: a room with a door straight onto the street is public; a room whose only door leads to the reception desk is private, even if the reception can send out post for it.",
        "code": "def has_internet_route(routes):\n    return any(r[\"destination\"] == \"0.0.0.0/0\" and r[\"target\"].startswith(\"igw-\") for r in routes)\n\npublic_rt = [{\"destination\": \"10.0.0.0/16\", \"target\": \"local\"},\n             {\"destination\": \"0.0.0.0/0\", \"target\": \"igw-0abc\"}]\nprivate_rt = [{\"destination\": \"10.0.0.0/16\", \"target\": \"local\"},\n              {\"destination\": \"0.0.0.0/0\", \"target\": \"nat-0def\"}]\nprint(\"public route table ->\", has_internet_route(public_rt))\nprint(\"private route table ->\", has_internet_route(private_rt))",
        "output": "public route table -> True\nprivate route table -> False",
        "codeNotes": [
          {
            "line": 2,
            "note": "Both conditions must hold for the same route."
          },
          {
            "line": 7,
            "note": "A NAT gateway lets traffic out but nothing unsolicited in."
          }
        ],
        "tryIt": "Add a route {\"destination\": \"0.0.0.0/0\", \"target\": \"igw-0abc\"} to private_rt. What have you just done to that subnet?",
        "check": {
          "question": "What makes an AWS subnet public?",
          "options": [
            "A setting called Public = true",
            "A route sending 0.0.0.0/0 to an internet gateway",
            "Having servers with big disks"
          ],
          "answer": 1,
          "why": "Public means the route table has a default route to an internet gateway."
        }
      },
      {
        "title": "Practice time: sizes and routes",
        "say": [
          "Practice 1: usable_subnet_ips(mask). First the guard: if the mask is below 16 or above 28, return 0. Then return 2 ** (32 - mask) - 5.",
          "Test yourself: /24 gives 251, /28 gives 11, /16 gives 65,531. If you got 256 for /24, you forgot the five reserved addresses.",
          "Practice 2: has_internet_route(routes). A route to \"nat-123\" for 0.0.0.0/0 must NOT count, and an igw- route for some other destination must not count either.",
          "The key is checking both conditions on the same route inside one any(...) call, not checking \"some route is 0.0.0.0/0\" and \"some route is igw-\" separately.",
          "That second mistake is subtle: two different routes could each satisfy half the rule, and your function would wrongly say public.",
          "These two checks are exactly what tools such as AWS Config rules and security scanners run against real accounts every day.",
          "The example shows the difference between the correct check and the half-and-half mistake on a tricky route table."
        ],
        "example": "Checking a key fits the lock by trying it in the same door, not by noting that some key fits some door somewhere.",
        "code": "routes = [{\"destination\": \"0.0.0.0/0\", \"target\": \"nat-1\"},\n          {\"destination\": \"10.9.0.0/16\", \"target\": \"igw-1\"}]\n\nwrong = any(r[\"destination\"] == \"0.0.0.0/0\" for r in routes) and any(r[\"target\"].startswith(\"igw-\") for r in routes)\nright = any(r[\"destination\"] == \"0.0.0.0/0\" and r[\"target\"].startswith(\"igw-\") for r in routes)\nprint(\"half-and-half check says public:\", wrong)\nprint(\"correct check says public:\", right)",
        "output": "half-and-half check says public: True\ncorrect check says public: False",
        "codeNotes": [
          {
            "line": 4,
            "note": "Two separate any() calls can be satisfied by two different routes."
          },
          {
            "line": 5,
            "note": "One any() with both conditions checks each route as a whole."
          }
        ],
        "tryIt": "Change the second route's destination to 0.0.0.0/0. What do both checks say now?",
        "check": {
          "question": "A /24 subnet in AWS: how many servers can get an address?",
          "options": [
            "256",
            "254",
            "251"
          ],
          "answer": 2,
          "why": "256 minus the five addresses AWS reserves is 251."
        }
      }
    ],
    "summary": [
      "A VPC is your private network in a Region; it is split into subnets, each in one AZ.",
      "CIDR /n fixes n bits; the size is 2 ** (32 - n), so bigger n means a smaller network.",
      "AWS reserves 5 addresses per subnet: a /24 has 251 usable.",
      "Subnets must not overlap; plan numbering and leave room to grow.",
      "A subnet is public when its route table sends 0.0.0.0/0 to an internet gateway; private subnets use a NAT gateway or no internet route."
    ],
    "projectStep": {
      "title": "Draw your first VPC",
      "steps": [
        "Choose a /16 range and split it into two public and two private /24 subnets across two AZs with ipaddress.",
        "Write the route table for each subnet as a list of dicts.",
        "Run has_internet_route on each to prove which are public."
      ]
    }
  },
  {
    "day": 4,
    "title": "Security Groups vs Network Access Control Lists (NACLs)",
    "goal": "You can explain how security groups and network ACLs protect a VPC, what stateful and stateless mean, evaluate security group rules and NACL rule order in code, and design least-open rules for a web app.",
    "minutes": 30,
    "recap": "Yesterday you built a VPC with public and private subnets. Today you add the firewalls that decide which traffic may enter and leave.",
    "parts": [
      {
        "title": "Two layers of firewall",
        "say": [
          "AWS gives you two kinds of network firewall inside a VPC, and good designs use both.",
          "A security group is attached to a resource, such as a server, a database or a load balancer. It is like a personal bodyguard for that one resource.",
          "A network access control list (NACL) is attached to a subnet. It checks all traffic entering or leaving the subnet, like a guard at the gate of a neighbourhood.",
          "Security groups only have ALLOW rules. Anything not allowed is blocked. NACLs have both ALLOW and DENY rules, with numbered priorities.",
          "Most day-to-day work happens in security groups. NACLs are a coarser, second line of defence, often used to block a known bad address range for a whole subnet.",
          "Having two layers is defence in depth: if someone makes a mistake in one layer, the other may still stop an attack.",
          "The example lays out the differences as data and prints them as a small comparison table."
        ],
        "example": "An office building with a guard at the front gate (NACL, checks everyone entering the site) and a keycard lock on each room (security group, checks who may enter that room).",
        "code": "compare = [\n    (\"Attached to\", \"a resource (server, DB)\", \"a subnet\"),\n    (\"Rule types\", \"ALLOW only\", \"ALLOW and DENY\"),\n    (\"Rule order\", \"all rules checked\", \"lowest number first\"),\n    (\"Replies\", \"allowed automatically\", \"need their own rule\"),\n]\nprint(f\"{'':12} {'Security group':24} NACL\")\nfor label, sg, nacl in compare:\n    print(f\"{label:12} {sg:24} {nacl}\")",
        "output": "             Security group           NACL\nAttached to  a resource (server, DB)  a subnet\nRule types   ALLOW only               ALLOW and DENY\nRule order   all rules checked        lowest number first\nReplies      allowed automatically    need their own rule",
        "codeNotes": [
          {
            "line": 5,
            "note": "This row is the stateful versus stateless difference, explained next."
          }
        ],
        "tryIt": "Add a row \"Default for new\" with \"deny all inbound\" and \"allow all\" (the default NACL allows everything).",
        "check": {
          "question": "You want to block one bad IP range for every server in a subnet. Which tool fits best?",
          "options": [
            "A security group, since it has DENY rules",
            "A network ACL on that subnet",
            "Neither can do it"
          ],
          "answer": 1,
          "why": "Security groups cannot deny; a NACL DENY rule applies to the whole subnet at once."
        }
      },
      {
        "title": "Stateful versus stateless",
        "say": [
          "Security groups are stateful. If a request is allowed in, the reply is automatically allowed back out, and the other way round. You only write rules for who may start a connection.",
          "NACLs are stateless. They judge every packet on its own, with no memory of earlier packets. So a reply needs its own rule in the other direction.",
          "Replies from a server usually go to a high, random \"ephemeral\" port on the client, somewhere in 1024 to 65535. That is why NACLs often need an outbound rule for that whole range.",
          "Forgetting the ephemeral port rule is the classic NACL bug: the request gets in, the server answers, and the answer is silently dropped at the subnet edge.",
          "Practice 1 models security groups: return traffic is always allowed; for new traffic, some rule must match the protocol and have the port inside its from_port to to_port range.",
          "Rules can cover a range of ports, for example 8000 to 8100 for a group of services, so compare with from_port <= port <= to_port.",
          "The example evaluates a small set of rules against several kinds of traffic."
        ],
        "example": "A receptionist who remembers you walked in with a visitor badge and lets you out without questions (stateful), versus a turnstile that demands a ticket in both directions (stateless).",
        "code": "def security_group_allows(rules, traffic):\n    if traffic.get(\"is_return\"):\n        return True\n    return any(r[\"protocol\"] == traffic[\"protocol\"] and r[\"from_port\"] <= traffic[\"port\"] <= r[\"to_port\"]\n               for r in rules)\n\nweb_sg = [{\"protocol\": \"TCP\", \"from_port\": 443, \"to_port\": 443},\n          {\"protocol\": \"TCP\", \"from_port\": 80, \"to_port\": 80}]\nfor t in [{\"protocol\": \"TCP\", \"port\": 443}, {\"protocol\": \"TCP\", \"port\": 22},\n          {\"protocol\": \"UDP\", \"port\": 443}, {\"protocol\": \"TCP\", \"port\": 51432, \"is_return\": True}]:\n    print(t, \"->\", \"ALLOW\" if security_group_allows(web_sg, t) else \"DENY\")",
        "output": "{'protocol': 'TCP', 'port': 443} -> ALLOW\n{'protocol': 'TCP', 'port': 22} -> DENY\n{'protocol': 'UDP', 'port': 443} -> DENY\n{'protocol': 'TCP', 'port': 51432, 'is_return': True} -> ALLOW",
        "codeNotes": [
          {
            "line": 2,
            "note": "Stateful: replies to allowed connections always get through."
          },
          {
            "line": 4,
            "note": "Protocol must match and the port must fall in the range."
          }
        ],
        "tryIt": "Add a rule allowing TCP 22 only. What is the safer real-world way to allow SSH (hint: limit the source)?",
        "check": {
          "question": "A NACL allows inbound TCP 443 but has no outbound rules except DENY all. Will HTTPS work?",
          "options": [
            "Yes, replies are automatic",
            "No, the replies to the ephemeral ports are blocked because NACLs are stateless",
            "Only for IPv6"
          ],
          "answer": 1,
          "why": "NACLs do not remember connections, so the reply needs its own outbound allow rule."
        }
      },
      {
        "title": "NACL rule numbers: first match wins",
        "say": [
          "Each NACL rule has a number from 1 to 32766. AWS checks rules from the lowest number up and stops at the FIRST rule that matches.",
          "That means order is everything. A DENY at rule 100 beats an ALLOW at rule 200 for the same traffic, and vice versa.",
          "Every NACL also ends with a hidden rule, shown as \"*\", that denies anything not matched. You cannot delete it.",
          "Teams usually number rules in steps of 10 or 100 (100, 110, 120...) so a new rule can be slotted in between later without renumbering everything.",
          "Practice 2 is nacl_decision(rules, port): sort the rules by rule_number, return the action of the first rule whose port is \"*\" or equals the port, and return \"DENY\" if nothing matches.",
          "sorted(rules, key=lambda r: r[\"rule_number\"]) does the ordering without changing the original list.",
          "The example shows the same two rules giving opposite results when their numbers are swapped."
        ],
        "example": "A queue at a bouncer where the first person on the guest list who recognises you decides, and nobody further down is asked.",
        "code": "def nacl_decision(rules, port):\n    for r in sorted(rules, key=lambda r: r[\"rule_number\"]):\n        if r[\"port\"] == \"*\" or r[\"port\"] == port:\n            return r[\"action\"]\n    return \"DENY\"\n\na = [{\"rule_number\": 100, \"port\": 22, \"action\": \"DENY\"}, {\"rule_number\": 200, \"port\": \"*\", \"action\": \"ALLOW\"}]\nb = [{\"rule_number\": 200, \"port\": 22, \"action\": \"DENY\"}, {\"rule_number\": 100, \"port\": \"*\", \"action\": \"ALLOW\"}]\nprint(\"DENY 22 numbered first:\", nacl_decision(a, 22))\nprint(\"ALLOW all numbered first:\", nacl_decision(b, 22))\nprint(\"No rules at all:\", nacl_decision([], 443))",
        "output": "DENY 22 numbered first: DENY\nALLOW all numbered first: ALLOW\nNo rules at all: DENY",
        "codeNotes": [
          {
            "line": 2,
            "note": "Lowest rule number is checked first."
          },
          {
            "line": 5,
            "note": "The hidden final rule denies anything not matched."
          }
        ],
        "tryIt": "In list b, change the ALLOW rule to number 300. What does port 22 get now?",
        "check": {
          "question": "Rules: 100 ALLOW all ports, 150 DENY port 3389. What happens to port 3389?",
          "options": [
            "DENY, because DENY always wins",
            "ALLOW, because rule 100 matches first",
            "Both rules apply"
          ],
          "answer": 1,
          "why": "NACLs stop at the first matching rule; put specific DENY rules at lower numbers than broad ALLOW rules."
        }
      },
      {
        "title": "Security groups that reference each other",
        "say": [
          "One of the best features of security groups is that a rule's source can be another security group, not just an IP range.",
          "For example, the database security group can say: allow TCP 5432 from the app-server security group. Any server in the app group can connect; nothing else can.",
          "This keeps working as servers come and go. Auto Scaling (Day 7) can add ten new app servers, and they are allowed in automatically because they carry the app security group.",
          "Compare that with IP rules, which break the moment a server gets a new address.",
          "The standard three-tier chain is: internet to load balancer on 443; load balancer group to app group on the app port; app group to database group on the database port.",
          "Each tier accepts traffic only from the tier in front of it. An attacker who reaches the load balancer still cannot talk to the database directly.",
          "The example models that chain and checks which hops are allowed."
        ],
        "example": "Staff badges by department: the server room door opens for anyone with an IT badge, and new IT staff get the badge on their first day without anyone editing the door.",
        "code": "rules = {\n    \"alb-sg\": [(\"internet\", 443)],\n    \"app-sg\": [(\"alb-sg\", 8080)],\n    \"db-sg\": [(\"app-sg\", 5432)],\n}\n\ndef can_connect(source, target, port):\n    return (source, port) in rules.get(target, [])\n\nfor hop in [(\"internet\", \"alb-sg\", 443), (\"alb-sg\", \"app-sg\", 8080), (\"app-sg\", \"db-sg\", 5432), (\"internet\", \"db-sg\", 5432)]:\n    print(hop, \"->\", can_connect(*hop))",
        "output": "('internet', 'alb-sg', 443) -> True\n('alb-sg', 'app-sg', 8080) -> True\n('app-sg', 'db-sg', 5432) -> True\n('internet', 'db-sg', 5432) -> False",
        "codeNotes": [
          {
            "line": 4,
            "note": "The database trusts the app tier by group, not by IP."
          },
          {
            "line": 11,
            "note": "The *hop spreads the tuple into the three arguments."
          }
        ],
        "tryIt": "Add a bastion-sg that may reach app-sg on port 22. Test it with can_connect.",
        "check": {
          "question": "Why reference a security group instead of IP addresses?",
          "options": [
            "It is required by AWS",
            "The rule keeps working as servers are added or change address",
            "IP rules are not allowed on port 5432"
          ],
          "answer": 1,
          "why": "Group references follow membership, so scaling and replacements need no rule changes."
        }
      },
      {
        "title": "Least privilege on the network",
        "say": [
          "Least privilege means opening only what is needed, only to who needs it. On the network that means the smallest ports and the narrowest sources.",
          "The most dangerous rule is SSH (port 22) or RDP (port 3389) open to 0.0.0.0/0, the whole internet. Bots scan the internet constantly and will find it within minutes.",
          "Databases should never be open to 0.0.0.0/0 either. They belong in private subnets and accept traffic only from the app tier.",
          "Instead of opening SSH to the world, teams use a bastion host (Day 5) with a small allowed IP range, or AWS Systems Manager Session Manager, which needs no inbound port at all.",
          "Security tools scan for exactly these risky rules. Writing such a scanner is a great small project, and the example is the start of one.",
          "It flags any rule that opens a sensitive port to the whole internet.",
          "Remember: a rule that is \"just for testing\" and never removed is how many real breaches begin."
        ],
        "example": "Leaving the front door key under the mat: convenient for you, and the first place a burglar looks.",
        "code": "SENSITIVE = {22: \"SSH\", 3389: \"RDP\", 3306: \"MySQL\", 5432: \"PostgreSQL\", 6379: \"Redis\"}\nrules = [\n    {\"port\": 443, \"source\": \"0.0.0.0/0\"},\n    {\"port\": 22, \"source\": \"0.0.0.0/0\"},\n    {\"port\": 5432, \"source\": \"sg-app\"},\n    {\"port\": 6379, \"source\": \"0.0.0.0/0\"},\n]\nfor r in rules:\n    if r[\"source\"] == \"0.0.0.0/0\" and r[\"port\"] in SENSITIVE:\n        print(\"RISK:\", SENSITIVE[r[\"port\"]], \"open to the whole internet\")",
        "output": "RISK: SSH open to the whole internet\nRISK: Redis open to the whole internet",
        "codeNotes": [
          {
            "line": 9,
            "note": "HTTPS open to the world is normal; admin and database ports are not."
          }
        ],
        "tryIt": "Extend the scanner to also flag \"::/0\", the IPv6 version of \"everywhere\".",
        "check": {
          "question": "Which rule is the biggest risk?",
          "options": [
            "TCP 443 from 0.0.0.0/0 on a load balancer",
            "TCP 22 from 0.0.0.0/0 on an app server",
            "TCP 5432 from the app security group"
          ],
          "answer": 1,
          "why": "Public HTTPS on a load balancer is expected; SSH open to the whole internet invites brute-force attacks."
        }
      },
      {
        "title": "Practice time: evaluate the firewalls",
        "say": [
          "Practice 1: security_group_allows(rules, traffic). First handle return traffic (always allowed). Then use any() over the rules, checking protocol equality and the port range together.",
          "Watch the edges: a rule for TCP 8000 to 8100 must allow 8000 and 8100 themselves, so use <= on both sides.",
          "Practice 2: nacl_decision(rules, port). Sort by rule_number, loop, return the first matching action, and fall back to \"DENY\".",
          "Do not return \"ALLOW\" by default. The hidden final NACL rule denies, and the checks test that a port with no rule is denied.",
          "Both functions show a pattern you will meet all through cloud work: evaluate an ordered or unordered set of rules against a request.",
          "On Day 6 you do the same for IAM permissions, and on Day 27 for web firewall rules. The details differ, the shape is the same.",
          "The example runs one packet through both layers, NACL first at the subnet edge, then the security group at the server."
        ],
        "example": "Airport security: the outer checkpoint checks everyone, then the gate checks your boarding pass. You must pass both to board.",
        "code": "def nacl_decision(rules, port):\n    for r in sorted(rules, key=lambda r: r[\"rule_number\"]):\n        if r[\"port\"] in (\"*\", port):\n            return r[\"action\"]\n    return \"DENY\"\n\nnacl = [{\"rule_number\": 100, \"port\": 23, \"action\": \"DENY\"}, {\"rule_number\": 200, \"port\": \"*\", \"action\": \"ALLOW\"}]\nsg_ports = {443, 80}\nfor port in [443, 23, 8080]:\n    subnet_ok = nacl_decision(nacl, port) == \"ALLOW\"\n    server_ok = port in sg_ports\n    print(port, \"reaches the server:\", subnet_ok and server_ok)",
        "output": "443 reaches the server: True\n23 reaches the server: False\n8080 reaches the server: False",
        "codeNotes": [
          {
            "line": 10,
            "note": "Layer 1: the subnet NACL."
          },
          {
            "line": 11,
            "note": "Layer 2: the server's security group."
          }
        ],
        "tryIt": "Which layer blocked port 23, and which blocked 8080? Print the reason for each.",
        "check": {
          "question": "Traffic passes the NACL but not the security group. What happens?",
          "options": [
            "It reaches the server",
            "It is blocked; both layers must allow it",
            "It reaches the server but only once"
          ],
          "answer": 1,
          "why": "Defence in depth means every layer on the path must allow the traffic."
        }
      }
    ],
    "summary": [
      "Security groups protect resources, allow-only, stateful; NACLs protect subnets, allow and deny, stateless.",
      "Stateless NACLs need rules for replies, usually the ephemeral ports 1024-65535.",
      "NACL rules run from the lowest number and the first match wins; a hidden final rule denies everything else.",
      "Security groups can reference other groups, which keeps multi-tier rules working as servers scale.",
      "Never open admin or database ports to 0.0.0.0/0."
    ],
    "projectStep": {
      "title": "Firewall plan for a three-tier app",
      "steps": [
        "Write security group rules for load balancer, app and database tiers as data.",
        "Write a NACL for the private subnet that denies one bad range at a low rule number.",
        "Run a risky-rule scanner over your plan and fix anything it flags."
      ]
    }
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: High-Availability Multi-AZ VPC Network Topology & Bastion Host",
    "goal": "You can design a production-ready VPC across two Availability Zones with public and private subnets, internet and NAT gateways and a bastion host, and write a validator that lists every problem in a network plan.",
    "minutes": 30,
    "recap": "Over four days you learned cloud models, Regions and AZs, VPCs and subnets, and firewalls. Today's milestone puts them together into one network you could really deploy.",
    "parts": [
      {
        "title": "The reference architecture",
        "say": [
          "Almost every serious AWS workload starts from the same network shape. Learn it once and you will recognise it everywhere.",
          "One VPC, for example 10.0.0.0/16, spread over two (or three) Availability Zones.",
          "In each AZ, a public subnet holding the internet-facing parts: the load balancer and the NAT gateway.",
          "In each AZ, a private subnet holding the app servers and databases, which have no public IP addresses at all.",
          "An internet gateway attached to the VPC, used by the public subnets' route tables for 0.0.0.0/0.",
          "A NAT gateway in each public subnet, used by that AZ's private subnet so servers can download updates without being reachable from outside.",
          "The example builds this design as Python data. Tomorrow's scripts and your validator both read this same shape."
        ],
        "example": "A hotel: the lobby and front desk face the street (public subnets), guest rooms are upstairs behind key cards (private subnets), and the concierge runs errands outside for guests (NAT gateway).",
        "code": "vpc = {\n    \"cidr\": \"10.0.0.0/16\",\n    \"has_internet_gateway\": True,\n    \"has_nat_gateway\": True,\n    \"subnets\": [\n        {\"id\": \"public-a\", \"az\": \"us-east-1a\", \"type\": \"PUBLIC\", \"cidr\": \"10.0.1.0/24\"},\n        {\"id\": \"public-b\", \"az\": \"us-east-1b\", \"type\": \"PUBLIC\", \"cidr\": \"10.0.2.0/24\"},\n        {\"id\": \"private-a\", \"az\": \"us-east-1a\", \"type\": \"PRIVATE\", \"cidr\": \"10.0.11.0/24\"},\n        {\"id\": \"private-b\", \"az\": \"us-east-1b\", \"type\": \"PRIVATE\", \"cidr\": \"10.0.12.0/24\"},\n    ],\n}\nfor s in vpc[\"subnets\"]:\n    print(f\"{s['id']:10} {s['az']:11} {s['type']:8} {s['cidr']}\")",
        "output": "public-a   us-east-1a  PUBLIC   10.0.1.0/24\npublic-b   us-east-1b  PUBLIC   10.0.2.0/24\nprivate-a  us-east-1a  PRIVATE  10.0.11.0/24\nprivate-b  us-east-1b  PRIVATE  10.0.12.0/24",
        "codeNotes": [
          {
            "line": 6,
            "note": "One public and one private subnet per AZ."
          },
          {
            "line": 13,
            "note": "Each row is one subnet of the plan."
          }
        ],
        "tryIt": "Add a third AZ (us-east-1c) with its own public and private subnet.",
        "check": {
          "question": "Where should the database live in this design?",
          "options": [
            "A public subnet so the app can find it",
            "A private subnet, reachable only from the app tier",
            "Outside the VPC"
          ],
          "answer": 1,
          "why": "Databases never need to be reachable from the internet, so they go in private subnets."
        }
      },
      {
        "title": "NAT gateways: out but not in",
        "say": [
          "Servers in private subnets still need to reach the internet sometimes: to install security patches, call a payment API or download packages.",
          "A NAT gateway (network address translation) lets them start connections outward, while nothing on the internet can start a connection inward.",
          "It works by swapping the private server's address for the NAT gateway's public address on the way out, and swapping it back on the replies.",
          "NAT gateways live in a public subnet, because they themselves need the internet gateway. The private subnet's route table sends 0.0.0.0/0 to the NAT gateway.",
          "For resilience, run one NAT gateway per AZ. If both private subnets use a single NAT gateway in AZ a, losing AZ a also cuts AZ b off from the internet.",
          "They are not free: each NAT gateway costs money per hour and per gigabyte processed, so heavy download traffic through NAT can surprise you on the bill.",
          "The example simulates the address swap for an outgoing connection and its reply."
        ],
        "example": "A company post room: staff hand letters to the post room, which sends them with the company's return address and hands the replies back to the right desk. Strangers cannot post things straight to a desk.",
        "code": "nat_table = {}\nNAT_PUBLIC_IP = \"54.12.3.4\"\n\ndef outbound(private_ip, port):\n    public_port = 40000 + len(nat_table)\n    nat_table[public_port] = (private_ip, port)\n    return NAT_PUBLIC_IP, public_port\n\ndef inbound_reply(public_port):\n    return nat_table.get(public_port, \"DROPPED: nobody asked for this\")\n\nprint(\"Leaves as:\", outbound(\"10.0.11.25\", 51000))\nprint(\"Reply goes to:\", inbound_reply(40000))\nprint(\"Unsolicited packet:\", inbound_reply(40099))",
        "output": "Leaves as: ('54.12.3.4', 40000)\nReply goes to: ('10.0.11.25', 51000)\nUnsolicited packet: DROPPED: nobody asked for this",
        "codeNotes": [
          {
            "line": 6,
            "note": "The NAT gateway remembers who started each connection."
          },
          {
            "line": 10,
            "note": "Anything without a matching entry is dropped: no way in."
          }
        ],
        "tryIt": "Send outbound traffic from two different private servers. Which public port does each get?",
        "check": {
          "question": "Why put one NAT gateway in each AZ?",
          "options": [
            "AWS requires two",
            "So losing one AZ does not cut off the other AZ's private servers",
            "It makes downloads faster"
          ],
          "answer": 1,
          "why": "A shared NAT gateway makes its AZ a single point of failure for outbound traffic."
        }
      },
      {
        "title": "The bastion host",
        "say": [
          "Sometimes an engineer needs to log in to a private server, for example to investigate a problem. But private servers have no public address.",
          "A bastion host (also called a jump box) is one small, hardened server in a public subnet. Engineers connect to it first, then hop from it to private servers.",
          "Its security group allows SSH only from the company's office IP range, never from 0.0.0.0/0. The private servers allow SSH only from the bastion's security group.",
          "The bastion has nothing else installed, is patched often, and every login is logged. It is a single, well-guarded door instead of many unguarded ones.",
          "Today many teams replace bastions with AWS Systems Manager Session Manager, which opens a shell through the AWS API with no inbound ports at all. You should know both.",
          "The example checks that a bastion plan follows the rules: SSH to the bastion only from the office, and to private servers only from the bastion.",
          "Notice how the security group references from Day 4 make this rule easy to express."
        ],
        "example": "A castle with a single drawbridge watched by guards, instead of ladders left against every wall.",
        "code": "OFFICE = \"203.0.113.0/24\"\nplan = {\n    \"bastion-sg\": [{\"port\": 22, \"source\": OFFICE}],\n    \"app-sg\": [{\"port\": 22, \"source\": \"bastion-sg\"}, {\"port\": 8080, \"source\": \"alb-sg\"}],\n}\nproblems = []\nfor rule in plan[\"bastion-sg\"]:\n    if rule[\"port\"] == 22 and rule[\"source\"] != OFFICE:\n        problems.append(\"bastion SSH not limited to the office\")\nfor rule in plan[\"app-sg\"]:\n    if rule[\"port\"] == 22 and rule[\"source\"] != \"bastion-sg\":\n        problems.append(\"app SSH not limited to the bastion\")\nprint(problems or \"Bastion plan OK\")",
        "output": "Bastion plan OK",
        "codeNotes": [
          {
            "line": 8,
            "note": "SSH to the bastion only from the office range."
          },
          {
            "line": 11,
            "note": "SSH to app servers only through the bastion."
          }
        ],
        "tryIt": "Change the bastion source to \"0.0.0.0/0\" and run it again.",
        "check": {
          "question": "What should a bastion host's SSH rule allow?",
          "options": [
            "0.0.0.0/0 so engineers can work from anywhere",
            "Only the company's known IP range",
            "Only port 443"
          ],
          "answer": 1,
          "why": "The bastion must be reachable only from trusted addresses; open SSH to the world defeats its purpose."
        }
      },
      {
        "title": "Writing a validator that lists every problem",
        "say": [
          "Practice 1 is validate_vpc(vpc). It returns a dictionary with valid, az_count and a list of problems, in a fixed order.",
          "A good validator reports ALL problems at once, not just the first. Fixing one issue, rerunning, and finding the next is a slow, frustrating loop.",
          "The rules: at least 2 AZs, at least 2 public subnets, at least 2 private subnets, an internet gateway, and a NAT gateway.",
          "Count public and private subnets with sum(1 for s in subnets if s[\"type\"] == \"PUBLIC\"). Collect AZs with a set, as on Day 2.",
          "Append each problem code as you check it, in the order listed. Then valid is simply \"no problems\", which you can write as not problems.",
          "Returning codes such as \"NO_NAT_GATEWAY\" instead of long sentences makes the result easy to test and easy to translate into friendly messages later.",
          "The example runs a validator against a plan that has several mistakes at once."
        ],
        "example": "A car's annual inspection report: it lists every failed item at once so the mechanic can fix them in one visit.",
        "code": "def validate_vpc(vpc):\n    subnets = vpc[\"subnets\"]\n    azs = {s[\"az\"] for s in subnets}\n    public = sum(1 for s in subnets if s[\"type\"] == \"PUBLIC\")\n    private = sum(1 for s in subnets if s[\"type\"] == \"PRIVATE\")\n    problems = []\n    if len(azs) < 2: problems.append(\"NEEDS_2_AZS\")\n    if public < 2: problems.append(\"NEEDS_2_PUBLIC_SUBNETS\")\n    if private < 2: problems.append(\"NEEDS_2_PRIVATE_SUBNETS\")\n    if not vpc[\"has_internet_gateway\"]: problems.append(\"NO_INTERNET_GATEWAY\")\n    if not vpc[\"has_nat_gateway\"]: problems.append(\"NO_NAT_GATEWAY\")\n    return {\"valid\": not problems, \"az_count\": len(azs), \"problems\": problems}\n\ndraft = {\"has_internet_gateway\": True, \"has_nat_gateway\": False,\n         \"subnets\": [{\"az\": \"us-east-1a\", \"type\": \"PUBLIC\"}, {\"az\": \"us-east-1a\", \"type\": \"PRIVATE\"}]}\nprint(validate_vpc(draft))",
        "output": "{'valid': False, 'az_count': 1, 'problems': ['NEEDS_2_AZS', 'NEEDS_2_PUBLIC_SUBNETS', 'NEEDS_2_PRIVATE_SUBNETS', 'NO_NAT_GATEWAY']}",
        "codeNotes": [
          {
            "line": 3,
            "note": "Distinct AZs, as on Day 2."
          },
          {
            "line": 12,
            "note": "valid is just \"the problem list is empty\"."
          }
        ],
        "tryIt": "Fix the draft one problem at a time until validate_vpc says it is valid.",
        "check": {
          "question": "Why should a validator return every problem instead of stopping at the first?",
          "options": [
            "It runs faster",
            "The user can fix everything in one pass instead of rerunning again and again",
            "Python requires it"
          ],
          "answer": 1,
          "why": "Reporting all problems at once saves many slow fix-and-retry loops."
        }
      },
      {
        "title": "Proving subnets do not overlap",
        "say": [
          "A plan can pass every rule above and still be broken if two subnets share addresses. Practice 2 catches that: subnets_distinct(cidrs).",
          "The ipaddress module gives each network an .overlaps(other) method. Two blocks overlap if they share even one address.",
          "Overlap is not only \"the same block twice\". A /24 inside a /16 overlaps it, and a /25 inside a /24 overlaps it.",
          "You must compare every pair. With a list of n blocks, a double loop where j starts at i + 1 checks each pair exactly once.",
          "For the few dozen subnets in a VPC this is instant. Very large address plans use sorting to do it faster, but the simple version is correct and clear.",
          "The example checks a plan that hides a subtle overlap near the end.",
          "After the milestone, keep your validator. You will extend it on Day 24 when Terraform generates networks for you."
        ],
        "example": "Checking a seating plan so no two guests have the same seat, by comparing every guest with every other guest.",
        "code": "import ipaddress\n\ndef subnets_distinct(cidrs):\n    nets = [ipaddress.ip_network(c) for c in cidrs]\n    for i in range(len(nets)):\n        for j in range(i + 1, len(nets)):\n            if nets[i].overlaps(nets[j]):\n                print(\"  overlap:\", nets[i], \"and\", nets[j])\n                return False\n    return True\n\nprint(subnets_distinct([\"10.0.1.0/24\", \"10.0.2.0/24\", \"10.0.11.0/24\"]))\nprint(subnets_distinct([\"10.0.1.0/24\", \"10.0.2.0/24\", \"10.0.2.128/25\"]))",
        "output": "True\n  overlap: 10.0.2.0/24 and 10.0.2.128/25\nFalse",
        "codeNotes": [
          {
            "line": 6,
            "note": "j starts after i, so each pair is compared once."
          },
          {
            "line": 7,
            "note": "overlaps is True if the ranges share any address."
          }
        ],
        "tryIt": "Would 10.0.2.0/23 overlap 10.0.3.0/24? Predict, then test.",
        "check": {
          "question": "Do 10.0.0.0/16 and 10.0.200.0/24 overlap?",
          "options": [
            "No, they have different prefixes",
            "Yes, the /24 lies inside the /16",
            "Only if they are in the same AZ"
          ],
          "answer": 1,
          "why": "10.0.0.0/16 covers every 10.0.x.x address, including 10.0.200.x."
        }
      },
      {
        "title": "Milestone review: from plan to production",
        "say": [
          "You now have everything to plan a real AWS network: Regions and AZs, CIDR sizing, public and private subnets, route tables, security groups, NACLs, NAT gateways and a bastion.",
          "Professionals turn such a plan into code with tools like Terraform or AWS CloudFormation (Day 24), and run validators like yours in the pipeline before anything is created.",
          "Catching a single-AZ database or an overlapping subnet in a code review costs minutes. Catching it during an outage costs hours and customers.",
          "Your two practice tasks today are exactly that kind of check: validate_vpc and subnets_distinct.",
          "Take the time to make the messages clear. The people who read validator output are often in a hurry, sometimes at 3 a.m.",
          "The example runs both checks on one full plan, the way a pipeline step would, and prints a final pass or fail.",
          "Well done on reaching the first milestone. From tomorrow we move from the network to identity and compute."
        ],
        "example": "An architect's drawings checked by the building inspector before a single brick is laid.",
        "code": "import ipaddress\n\nplan = [(\"public-a\", \"us-east-1a\", \"PUBLIC\", \"10.0.1.0/24\"), (\"public-b\", \"us-east-1b\", \"PUBLIC\", \"10.0.2.0/24\"),\n        (\"private-a\", \"us-east-1a\", \"PRIVATE\", \"10.0.11.0/24\"), (\"private-b\", \"us-east-1b\", \"PRIVATE\", \"10.0.12.0/24\")]\nnets = [ipaddress.ip_network(p[3]) for p in plan]\noverlap = any(a.overlaps(b) for i, a in enumerate(nets) for b in nets[i + 1:])\nazs = {p[1] for p in plan}\nchecks = {\"2+ AZs\": len(azs) >= 2, \"no overlaps\": not overlap,\n          \"2+ private\": sum(p[2] == \"PRIVATE\" for p in plan) >= 2}\nfor name, ok in checks.items():\n    print(f\"{name:12} {'PASS' if ok else 'FAIL'}\")\nprint(\"DEPLOY\" if all(checks.values()) else \"BLOCKED\")",
        "output": "2+ AZs       PASS\nno overlaps  PASS\n2+ private   PASS\nDEPLOY",
        "codeNotes": [
          {
            "line": 6,
            "note": "A compact way to compare every pair once."
          },
          {
            "line": 12,
            "note": "The pipeline deploys only if every check passes."
          }
        ],
        "tryIt": "Change private-b to \"10.0.11.128/25\" and see which check blocks the deploy.",
        "check": {
          "question": "When is the cheapest time to catch a network design mistake?",
          "options": [
            "During an outage",
            "In a validation step before anything is deployed",
            "At the end of the month on the bill"
          ],
          "answer": 1,
          "why": "Automated checks before deployment catch mistakes when they cost the least to fix."
        }
      }
    ],
    "summary": [
      "The standard VPC: public and private subnets in each of two or more AZs, an internet gateway and a NAT gateway per AZ.",
      "NAT gateways let private servers reach out without letting anything in.",
      "A bastion host is one guarded entry point; Session Manager can replace it with no open ports.",
      "Validators should report every problem at once, as short codes.",
      "Check every pair of subnets for overlaps with ipaddress .overlaps()."
    ],
    "projectStep": {
      "title": "Milestone 1: validated two-AZ VPC",
      "steps": [
        "Write your full VPC plan as data: subnets, gateways and security groups.",
        "Run validate_vpc and subnets_distinct on it and fix every problem.",
        "Add one check of your own, such as \"no SSH open to 0.0.0.0/0\", and make it pass."
      ]
    }
  },
  {
    "day": 6,
    "title": "IAM Role Least-Privilege, Policies & Principal Trust",
    "goal": "You can explain IAM users, groups, roles and policies, read a JSON policy, evaluate Allow and Deny decisions exactly as AWS does, parse ARNs, and apply least privilege with temporary role credentials.",
    "minutes": 30,
    "recap": "Your network is designed and firewalled. But networks only control where traffic flows; today you control WHO may do WHAT in your AWS account.",
    "parts": [
      {
        "title": "Identity and Access Management",
        "say": [
          "AWS Identity and Access Management (IAM) decides who can call which AWS API on which resource. Every single AWS call, from any tool, is checked by IAM.",
          "The who is called a principal. It can be an IAM user (a person or program with long-term credentials), or an IAM role (an identity that is assumed temporarily).",
          "Groups collect users, so you attach permissions to \"Developers\" once instead of to each developer.",
          "The what is written in policies: JSON documents listing statements. Each statement has an Effect (Allow or Deny), Actions such as s3:GetObject, and Resources such as a bucket.",
          "The account's root user can do everything and cannot be restricted. Best practice is to lock it away with multi-factor authentication and never use it for daily work.",
          "Access keys that never expire are dangerous: if one leaks into a public code repository, attackers can use it until someone notices. Roles avoid that, as you will see.",
          "The example reads a real-shaped policy with Python's json module."
        ],
        "example": "A hotel key-card system: each card (principal) opens only certain doors (resources) for certain things (actions), and the front desk (IAM) checks every swipe.",
        "code": "import json\n\npolicy_text = \"\"\"{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\"Effect\": \"Allow\", \"Action\": \"s3:GetObject\", \"Resource\": \"arn:aws:s3:::photos/*\"},\n    {\"Effect\": \"Allow\", \"Action\": [\"s3:PutObject\"], \"Resource\": \"arn:aws:s3:::photos/uploads/*\"}\n  ]\n}\"\"\"\npolicy = json.loads(policy_text)\nfor s in policy[\"Statement\"]:\n    print(s[\"Effect\"], s[\"Action\"], \"on\", s[\"Resource\"])",
        "output": "Allow s3:GetObject on arn:aws:s3:::photos/*\nAllow ['s3:PutObject'] on arn:aws:s3:::photos/uploads/*",
        "codeNotes": [
          {
            "line": 4,
            "note": "Always \"2012-10-17\": the policy language version, not today's date."
          },
          {
            "line": 10,
            "note": "json.loads turns the text into dicts and lists."
          }
        ],
        "tryIt": "Add a third statement that allows s3:ListBucket on \"arn:aws:s3:::photos\".",
        "check": {
          "question": "What is an IAM principal?",
          "options": [
            "A kind of storage bucket",
            "The identity making the call, such as a user or role",
            "The price of an API call"
          ],
          "answer": 1,
          "why": "The principal is the \"who\" whose permissions IAM checks for each call."
        }
      },
      {
        "title": "How AWS decides: explicit deny wins",
        "say": [
          "AWS evaluates permissions with three simple rules, applied in this order.",
          "Rule one: by default everything is denied. A brand-new user can do nothing at all. This is called the implicit deny.",
          "Rule two: an explicit Deny in any policy that matches the call always wins. Nothing can override it.",
          "Rule three: otherwise, if some Allow matches, the call is allowed. If nothing matches, the implicit deny stands.",
          "So Deny beats Allow, and Allow beats silence. This makes Deny statements a powerful safety net, for example \"Deny deleting anything in the audit bucket\", which holds even if someone is later given broad Allow rights.",
          "Practice 1 is evaluate_iam(statements, request). Find every statement whose action and resource match, then apply the three rules.",
          "The example shows the three outcomes: an allowed read, an explicitly denied read, and an implicitly denied write."
        ],
        "example": "A school trip: no child goes without a signed form (default deny); a parent's \"my child must not go\" note beats any other permission (explicit deny); otherwise a signed form lets them go (allow).",
        "code": "def matches(pattern, value):\n    return value.startswith(pattern[:-1]) if pattern.endswith(\"*\") else pattern == value\n\ndef evaluate_iam(statements, request):\n    hits = [s for s in statements\n            if matches(s[\"action\"], request[\"action\"]) and matches(s[\"resource\"], request[\"resource\"])]\n    if any(s[\"effect\"] == \"Deny\" for s in hits): return \"DENY\"\n    if any(s[\"effect\"] == \"Allow\" for s in hits): return \"ALLOW\"\n    return \"DENY\"\n\nstmts = [{\"effect\": \"Allow\", \"action\": \"s3:GetObject\", \"resource\": \"arn:aws:s3:::docs/*\"},\n         {\"effect\": \"Deny\", \"action\": \"s3:*\", \"resource\": \"arn:aws:s3:::docs/secret/*\"}]\nfor action, res in [(\"s3:GetObject\", \"docs/a.pdf\"), (\"s3:GetObject\", \"docs/secret/k.pdf\"), (\"s3:PutObject\", \"docs/a.pdf\")]:\n    print(action, res, \"->\", evaluate_iam(stmts, {\"action\": action, \"resource\": \"arn:aws:s3:::\" + res}))",
        "output": "s3:GetObject docs/a.pdf -> ALLOW\ns3:GetObject docs/secret/k.pdf -> DENY\ns3:PutObject docs/a.pdf -> DENY",
        "codeNotes": [
          {
            "line": 2,
            "note": "A trailing * means \"starts with\"."
          },
          {
            "line": 7,
            "note": "Rule two: any matching Deny ends the decision."
          },
          {
            "line": 9,
            "note": "Rule one: nothing matched, so the default deny."
          }
        ],
        "tryIt": "Add an Allow for s3:* on \"arn:aws:s3:::docs/*\". Can the user now read the secret file? Why not?",
        "check": {
          "question": "A user has an Allow for s3:* and a Deny for s3:DeleteObject. Can they delete?",
          "options": [
            "Yes, s3:* includes delete",
            "No, the explicit Deny wins",
            "Only on Tuesdays"
          ],
          "answer": 1,
          "why": "An explicit Deny always overrides any Allow."
        }
      },
      {
        "title": "Wildcards and least privilege",
        "say": [
          "Policies can use * as a wildcard. \"s3:*\" means every S3 action; \"arn:aws:s3:::photos/*\" means every object in the photos bucket.",
          "Wildcards are convenient and dangerous. \"Action\": \"*\" with \"Resource\": \"*\" is full administrator access, and it is surprisingly common in rushed projects.",
          "Least privilege means granting only the actions and resources a job truly needs. A photo-resize function needs s3:GetObject on the uploads folder and s3:PutObject on the thumbnails folder, nothing more.",
          "If that function is ever hacked, least privilege limits the damage: the attacker cannot delete your database or read your billing data.",
          "AWS offers tools to help: IAM Access Analyzer can suggest a tight policy from the calls a role actually made over recent weeks.",
          "The example measures how broad some policies are by counting wildcard actions, a simple way to spot policies worth reviewing.",
          "In code reviews, any new \"*\" in a policy deserves a question: do we really need all of it?"
        ],
        "example": "Giving a plumber a key to the bathroom, not a master key to the whole building.",
        "code": "policies = {\n    \"resize-fn\": [(\"s3:GetObject\", \"arn:aws:s3:::uploads/*\"), (\"s3:PutObject\", \"arn:aws:s3:::thumbs/*\")],\n    \"rushed-app\": [(\"*\", \"*\")],\n    \"ops-team\": [(\"ec2:*\", \"*\"), (\"s3:GetObject\", \"*\")],\n}\nfor name, stmts in policies.items():\n    broad = [a for a, r in stmts if a.endswith(\"*\") or r == \"*\"]\n    label = \"ADMIN!\" if (\"*\", \"*\") in stmts else (\"review\" if broad else \"tight\")\n    print(f\"{name:11} {label:7} broad statements: {broad}\")",
        "output": "resize-fn   tight   broad statements: []\nrushed-app  ADMIN!  broad statements: ['*']\nops-team    review  broad statements: ['ec2:*', 's3:GetObject']",
        "codeNotes": [
          {
            "line": 7,
            "note": "Any wildcard action or resource marks a statement as broad."
          },
          {
            "line": 8,
            "note": "Action * on Resource * is full admin."
          }
        ],
        "tryIt": "Rewrite the ops-team policy so it only allows starting and stopping EC2 servers.",
        "check": {
          "question": "What is least privilege?",
          "options": [
            "Giving everyone the same small password",
            "Granting only the permissions a job needs",
            "Denying all access to everyone"
          ],
          "answer": 1,
          "why": "Least privilege limits both mistakes and the damage from a compromised identity."
        }
      },
      {
        "title": "Roles and temporary credentials",
        "say": [
          "An IAM role is an identity without a password or long-term keys. Something trusted assumes the role and receives temporary credentials, usually valid for an hour.",
          "This is how AWS services get permissions. An EC2 server or a Lambda function is given a role; the AWS SDK fetches and refreshes its temporary keys automatically. No secrets are stored in code.",
          "Every role has a trust policy that says WHO may assume it, for example \"the Lambda service\" or \"users from our other AWS account\". Its permission policies say WHAT it can then do.",
          "The AWS Security Token Service (STS) issues the temporary credentials. Because they expire, a leaked key is useful to an attacker for minutes, not years.",
          "People can use roles too. Engineers sign in once through single sign-on, then assume a role such as ReadOnly or Admin for a limited session.",
          "The example simulates assuming a role and checking whether the temporary credentials have expired.",
          "Rule of thumb: prefer roles everywhere; use long-lived access keys only when nothing else works, and rotate them."
        ],
        "example": "A visitor badge that the reception prints for today only: useful for the visit, worthless tomorrow if it is lost.",
        "code": "trust_policy = {\"role\": \"resize-fn-role\", \"trusted\": [\"lambda.amazonaws.com\"]}\n\ndef assume_role(caller, now, duration=3600):\n    if caller not in trust_policy[\"trusted\"]:\n        return None\n    return {\"role\": trust_policy[\"role\"], \"expires_at\": now + duration}\n\ncreds = assume_role(\"lambda.amazonaws.com\", now=1000)\nprint(\"Lambda gets:\", creds)\nprint(\"Stranger gets:\", assume_role(\"ec2.amazonaws.com\", now=1000))\nfor t in [2000, 4600, 4601]:\n    print(\"at\", t, \"expired:\", t > creds[\"expires_at\"])",
        "output": "Lambda gets: {'role': 'resize-fn-role', 'expires_at': 4600}\nStranger gets: None\nat 2000 expired: False\nat 4600 expired: False\nat 4601 expired: True",
        "codeNotes": [
          {
            "line": 4,
            "note": "The trust policy decides who may assume the role at all."
          },
          {
            "line": 6,
            "note": "Temporary credentials carry an expiry time."
          }
        ],
        "tryIt": "Change the duration to 900 seconds (15 minutes). When do the credentials expire now?",
        "check": {
          "question": "Why are roles safer than long-lived access keys?",
          "options": [
            "Roles are free",
            "Role credentials are temporary, so a leak is only useful for a short time",
            "Roles cannot be used by programs"
          ],
          "answer": 1,
          "why": "Short-lived credentials limit how long a stolen key can be abused."
        }
      },
      {
        "title": "Amazon Resource Names",
        "say": [
          "Every AWS resource has an Amazon Resource Name (ARN), a unique string used in policies, logs and API calls.",
          "The format is arn:partition:service:region:account-id:resource. For example arn:aws:lambda:eu-west-1:111122223333:function:resize-image.",
          "Some parts can be empty. IAM is global, so its ARNs have an empty region: arn:aws:iam::111122223333:role/admin. S3 bucket ARNs even leave out the account.",
          "The resource part may contain its own colons, as in function:resize-image. So when splitting, you must split at most five times and keep the rest together.",
          "Practice 2 is parse_arn(arn). Python's str.split(\":\", 5) does exactly that: it returns at most six pieces.",
          "Return None for text that is not an ARN. Defensive parsing like this stops a typo in a config file from causing a confusing crash later.",
          "The example parses three different ARNs, including the tricky ones."
        ],
        "example": "A full postal address: country, city, street, house number and flat. Some fields may be blank, but the order never changes.",
        "code": "def parse_arn(arn):\n    parts = arn.split(\":\", 5)\n    if len(parts) != 6 or parts[0] != \"arn\":\n        return None\n    keys = [\"partition\", \"service\", \"region\", \"account\", \"resource\"]\n    return dict(zip(keys, parts[1:]))\n\nfor a in [\"arn:aws:lambda:eu-west-1:111122223333:function:resize-image\",\n          \"arn:aws:iam::111122223333:role/admin\",\n          \"arn:aws:s3:::my-bucket/photo.jpg\", \"hello\"]:\n    print(parse_arn(a))",
        "output": "{'partition': 'aws', 'service': 'lambda', 'region': 'eu-west-1', 'account': '111122223333', 'resource': 'function:resize-image'}\n{'partition': 'aws', 'service': 'iam', 'region': '', 'account': '111122223333', 'resource': 'role/admin'}\n{'partition': 'aws', 'service': 's3', 'region': '', 'account': '', 'resource': 'my-bucket/photo.jpg'}\nNone",
        "codeNotes": [
          {
            "line": 2,
            "note": "maxsplit=5 keeps any colons inside the resource part."
          },
          {
            "line": 6,
            "note": "zip pairs each name with its piece."
          }
        ],
        "tryIt": "What happens if you use arn.split(\":\") without the 5? Try it on the Lambda ARN.",
        "check": {
          "question": "Why is the region empty in an IAM role ARN?",
          "options": [
            "It is a mistake",
            "IAM is a global service, not tied to one Region",
            "Roles live in every Region separately"
          ],
          "answer": 1,
          "why": "Global services such as IAM leave the region field empty."
        }
      },
      {
        "title": "Practice time: build the policy engine",
        "say": [
          "Practice 1: evaluate_iam(statements, request). Write a small helper matches(pattern, value) first: if the pattern ends with *, check value.startswith(pattern[:-1]); otherwise check equality.",
          "Then collect the statements where both action and resource match. If any is a Deny, return \"DENY\". If any is an Allow, return \"ALLOW\". Otherwise return \"DENY\".",
          "A classic bug is returning as soon as you find an Allow while looping. A Deny later in the list would then be missed. Look at ALL matching statements first.",
          "Practice 2: parse_arn(arn). Split with a maximum of five splits, check you got six parts and that the first is \"arn\", then build the dictionary.",
          "The checks include an IAM ARN with an empty region and a Lambda ARN with colons in the resource.",
          "Real IAM has more features (conditions, principals, permission boundaries, organisation policies), but the heart is exactly the logic you are writing.",
          "The example shows the classic early-return bug next to the correct version."
        ],
        "example": "Reading the whole contract before signing, not stopping at the first line you like.",
        "code": "stmts = [{\"effect\": \"Allow\", \"resource\": \"docs/*\"}, {\"effect\": \"Deny\", \"resource\": \"docs/secret/*\"}]\nres = \"docs/secret/plan.txt\"\nmatch = lambda p: res.startswith(p[:-1])\n\ndef buggy():\n    for s in stmts:\n        if match(s[\"resource\"]):\n            return s[\"effect\"].upper()\n    return \"DENY\"\n\ndef correct():\n    hits = [s[\"effect\"] for s in stmts if match(s[\"resource\"])]\n    return \"DENY\" if \"Deny\" in hits or not hits else \"ALLOW\"\n\nprint(\"buggy:\", buggy(), \"  correct:\", correct())",
        "output": "buggy: ALLOW   correct: DENY",
        "codeNotes": [
          {
            "line": 8,
            "note": "Returns at the first match: the Deny is never seen."
          },
          {
            "line": 13,
            "note": "Looks at every match before deciding."
          }
        ],
        "tryIt": "Swap the order of the two statements. Does the buggy version give the right answer now? Is it fixed?",
        "check": {
          "question": "Your evaluator returns ALLOW at the first matching Allow. What can go wrong?",
          "options": [
            "Nothing",
            "A later matching Deny is ignored, so forbidden calls are allowed",
            "It becomes too slow"
          ],
          "answer": 1,
          "why": "Deny must win regardless of order, so all matching statements must be considered."
        }
      }
    ],
    "summary": [
      "IAM checks every AWS call: a principal, an action and a resource.",
      "Default deny, explicit Deny always wins, otherwise a matching Allow allows.",
      "Least privilege: only the actions and resources a job needs; be suspicious of *.",
      "Roles give temporary credentials through STS; trust policies say who may assume them.",
      "ARNs identify resources: arn:partition:service:region:account:resource."
    ],
    "projectStep": {
      "title": "Least-privilege role for your app",
      "steps": [
        "Write the policy statements your app's server needs, with no wildcard actions.",
        "Run evaluate_iam over a list of calls your app makes and a few it must never make.",
        "Parse every ARN in the policy with parse_arn to catch typos."
      ]
    }
  },
  {
    "day": 7,
    "title": "EC2 Compute Classes, Spot Instances & Auto-Scaling Groups",
    "goal": "You can choose EC2 instance families and pricing models, explain Auto Scaling groups and target tracking, compute a desired capacity with clamping, and handle Spot interruptions safely.",
    "minutes": 30,
    "recap": "Yesterday you controlled who may call AWS. Today you use that to run compute: EC2 virtual servers, scaled automatically with demand.",
    "parts": [
      {
        "title": "EC2 instances and families",
        "say": [
          "Amazon Elastic Compute Cloud (EC2) rents virtual servers called instances. You choose an image (the operating system), an instance type (the hardware), a subnet and a security group.",
          "Instance types are named like m5.large: a family letter (m), a generation number (5) and a size (large). Bigger sizes double resources step by step: large, xlarge, 2xlarge.",
          "Families are tuned for different jobs. T (burstable) for small, spiky workloads; M (general purpose) for balanced apps; C (compute) for heavy CPU; R (memory) for caches and in-memory databases; G and P for GPUs.",
          "A letter after the number shows extras: g means AWS Graviton (ARM) processors, which are often cheaper for the same work; d means local NVMe disks.",
          "Right-sizing matters. A server that sits at 5 percent CPU all day is paying for 95 percent idle capacity.",
          "The example picks the cheapest type that meets a workload's CPU and memory needs from a small price list.",
          "Prices here are rounded examples; always check the current price list for your Region."
        ],
        "example": "Choosing a vehicle: a scooter for quick errands, a van for moving furniture, a truck for heavy loads. The right choice depends on the job.",
        "code": "types = [\n    {\"name\": \"t3.medium\", \"vcpu\": 2, \"gib\": 4, \"hourly\": 0.0416},\n    {\"name\": \"m5.large\", \"vcpu\": 2, \"gib\": 8, \"hourly\": 0.096},\n    {\"name\": \"c5.xlarge\", \"vcpu\": 4, \"gib\": 8, \"hourly\": 0.17},\n    {\"name\": \"r5.large\", \"vcpu\": 2, \"gib\": 16, \"hourly\": 0.126},\n]\ndef cheapest(need_cpu, need_gib):\n    fits = [t for t in types if t[\"vcpu\"] >= need_cpu and t[\"gib\"] >= need_gib]\n    return min(fits, key=lambda t: t[\"hourly\"])[\"name\"] if fits else None\n\nprint(\"Small web app:\", cheapest(2, 4))\nprint(\"Redis cache:\", cheapest(2, 12))\nprint(\"Video encoder:\", cheapest(4, 8))",
        "output": "Small web app: t3.medium\nRedis cache: r5.large\nVideo encoder: c5.xlarge",
        "codeNotes": [
          {
            "line": 8,
            "note": "Keep only types with enough CPU and memory."
          },
          {
            "line": 9,
            "note": "Then choose the cheapest of those."
          }
        ],
        "tryIt": "Add \"m6g.large\" with 2 vCPU, 8 GiB at 0.077 per hour. Which workloads switch to it?",
        "check": {
          "question": "Which family suits an in-memory cache best?",
          "options": [
            "C (compute optimised)",
            "R (memory optimised)",
            "T (burstable)"
          ],
          "answer": 1,
          "why": "Caches need lots of RAM per CPU, which is what memory-optimised R types offer."
        }
      },
      {
        "title": "On-Demand, Reserved, Savings Plans and Spot",
        "say": [
          "The same instance can be bought four ways, and choosing well can cut a bill by more than half.",
          "On-Demand: pay by the second with no commitment. Most flexible, highest price.",
          "Savings Plans and Reserved Instances: commit to a steady amount of usage for one or three years in exchange for a large discount, often 30 to 70 percent. Best for the steady base load.",
          "Spot: use AWS's spare capacity at up to 90 percent off, but AWS can take it back with a two-minute warning. Best for work that can stop and restart, such as batch jobs, rendering or test runs.",
          "A mature setup mixes them: commitments for the base that always runs, On-Demand for normal peaks, and Spot for flexible extra work.",
          "The example prices one month of a fleet under each model with rounded example discounts.",
          "On Day 28 you calculate Savings Plan bills exactly."
        ],
        "example": "Transport: a taxi (on-demand), a yearly season ticket (savings plan), or standby flights that are cheap but can bump you (spot).",
        "code": "hourly = 0.096\nhours = 730\nmodels = {\"On-Demand\": 0.0, \"Savings Plan (1 yr)\": 0.30, \"Spot\": 0.70}\nfor name, discount in models.items():\n    cost = hourly * (1 - discount) * hours\n    print(f\"{name:20} ${cost:7.2f} per server per month\")\n\nbase, peak_extra = 6, 4\nmixed = base * hourly * 0.70 * hours + peak_extra * hourly * 0.30 * hours\nprint(f\"Mix (6 on plan + 4 on Spot): ${mixed:.2f}\")",
        "output": "On-Demand            $  70.08 per server per month\nSavings Plan (1 yr)  $  49.06 per server per month\nSpot                 $  21.02 per server per month\nMix (6 on plan + 4 on Spot): $378.43",
        "codeNotes": [
          {
            "line": 5,
            "note": "A discount of 0.30 means you pay 70 percent of the price."
          },
          {
            "line": 9,
            "note": "Steady base on a plan, flexible extra on Spot."
          }
        ],
        "tryIt": "Price the same 10 servers all On-Demand and compare with the mix.",
        "check": {
          "question": "Which work suits Spot instances?",
          "options": [
            "The only database of a bank",
            "Batch video encoding that can restart if interrupted",
            "A login server that must never stop"
          ],
          "answer": 1,
          "why": "Spot can be reclaimed at short notice, so it fits interruptible, restartable work."
        }
      },
      {
        "title": "Auto Scaling groups",
        "say": [
          "An Auto Scaling group (ASG) keeps a fleet of identical instances running. You give it a launch template (what to start) and three numbers: minimum, maximum and desired capacity.",
          "If an instance fails its health check, the ASG replaces it automatically. This self-healing alone is worth using an ASG, even for a fixed fleet.",
          "The ASG spreads instances across the subnets you give it, so choosing subnets in several AZs gives you multi-AZ resilience for free.",
          "Scaling policies change the desired capacity. Scheduled scaling follows the clock (\"10 servers during office hours\"). Dynamic scaling follows metrics.",
          "The minimum protects availability (never fewer than two, one per AZ). The maximum protects your bill (never more than twenty, even under a flood of traffic or an attack).",
          "Instances in an ASG must be disposable: no important data on their local disk, because any of them may be replaced or removed at any time.",
          "The example simulates an ASG replacing an unhealthy instance and keeping the desired count."
        ],
        "example": "A taxi company that always keeps at least four cabs on the road, sends a replacement when one breaks down, and never runs more than twenty.",
        "code": "fleet = {\"i-1\": \"healthy\", \"i-2\": \"unhealthy\", \"i-3\": \"healthy\"}\ndesired = 3\nnext_id = 4\n\nfor inst, status in list(fleet.items()):\n    if status == \"unhealthy\":\n        del fleet[inst]\n        print(\"Terminated\", inst)\nwhile len(fleet) < desired:\n    fleet[f\"i-{next_id}\"] = \"healthy\"\n    print(\"Launched\", f\"i-{next_id}\")\n    next_id += 1\nprint(\"Fleet:\", fleet)",
        "output": "Terminated i-2\nLaunched i-4\nFleet: {'i-1': 'healthy', 'i-3': 'healthy', 'i-4': 'healthy'}",
        "codeNotes": [
          {
            "line": 5,
            "note": "list() copies the items so we can delete while looping."
          },
          {
            "line": 9,
            "note": "Launch until the fleet is back to the desired size."
          }
        ],
        "tryIt": "Mark two instances unhealthy. How many launches happen?",
        "check": {
          "question": "Why set a maximum size on an Auto Scaling group?",
          "options": [
            "To make scaling faster",
            "To cap cost during traffic floods or attacks",
            "AWS requires exactly 20"
          ],
          "answer": 1,
          "why": "The maximum puts an upper bound on how much the group can spend."
        }
      },
      {
        "title": "Target tracking: the thermostat of scaling",
        "say": [
          "The simplest dynamic policy is target tracking. You pick a metric and a target, for example \"keep average CPU at 50 percent\", and AWS does the maths.",
          "If load is spread evenly, capacity and utilisation are inversely related: double the servers and each one does half the work.",
          "So the new capacity is current capacity times current metric divided by target. Four servers at 80 percent CPU with a 50 percent target need 4 * 80 / 50 = 6.4, rounded UP to 7.",
          "Always round up when scaling out. Rounding down would leave the fleet slightly overloaded, which is the problem you were trying to fix.",
          "Then clamp the result between the minimum and maximum of the group. That is Practice 1: desired_capacity(current, metric, target, min_size, max_size).",
          "Real target tracking also waits a short cooldown between changes, so the fleet does not bounce up and down with every small blip.",
          "The example runs the formula over a busy day."
        ],
        "example": "A thermostat set to 21 degrees: when the room is too hot it turns the cooling up, too cold and it turns it down, always aiming at the target.",
        "code": "import math\n\ndef desired_capacity(current, metric, target, min_size, max_size):\n    wanted = math.ceil(current * metric / target)\n    return max(min_size, min(max_size, wanted))\n\ncapacity = 4\nfor hour, cpu in [(\"09:00\", 80), (\"12:00\", 95), (\"15:00\", 55), (\"22:00\", 12)]:\n    new = desired_capacity(capacity, cpu, 50, 2, 10)\n    print(f\"{hour} cpu {cpu:3}% on {capacity:2} servers -> {new}\")\n    capacity = new",
        "output": "09:00 cpu  80% on  4 servers -> 7\n12:00 cpu  95% on  7 servers -> 10\n15:00 cpu  55% on 10 servers -> 10\n22:00 cpu  12% on 10 servers -> 3",
        "codeNotes": [
          {
            "line": 4,
            "note": "math.ceil rounds up: 6.4 becomes 7."
          },
          {
            "line": 5,
            "note": "Clamp between the group minimum and maximum."
          }
        ],
        "tryIt": "At 12:00 the formula wants 14 servers. What did the group actually get, and why?",
        "check": {
          "question": "4 servers at 80% CPU, target 50%, min 2, max 10. What is the new desired capacity?",
          "options": [
            "6",
            "7",
            "10"
          ],
          "answer": 1,
          "why": "4 * 80 / 50 = 6.4, rounded up to 7, which is inside the 2 to 10 range."
        }
      },
      {
        "title": "Surviving Spot interruptions",
        "say": [
          "When AWS needs Spot capacity back, it posts an interruption notice two minutes before stopping the instance. Your code can read it from the instance metadata service or receive it as an EventBridge event.",
          "Two minutes is enough to do something useful, if you planned for it. Stop taking new work, finish or checkpoint the current task, and deregister from the load balancer.",
          "Checkpointing means saving progress, for example \"processed frames 1 to 4,000\", to S3 or a database, so the replacement instance can continue instead of starting over.",
          "Practice 2 is spot_action(seconds_notice): \"DRAIN_NOW\" inside the two-minute window, \"ALREADY_GONE\" at zero or below, \"KEEP_WORKING\" otherwise.",
          "Good Spot users also spread across many instance types and AZs. If one type becomes scarce, the others keep running.",
          "The example simulates a batch job that saves a checkpoint when the notice arrives, and a replacement that resumes from it.",
          "Designing work in small, restartable chunks makes Spot almost painless, and the savings are large."
        ],
        "example": "A library that announces \"closing in two minutes\": you bookmark your page and pick up exactly there tomorrow.",
        "code": "checkpoint = {\"done\": 0}\nframes = 10\n\ndef run(worker, notice_at=None):\n    for frame in range(checkpoint[\"done\"], frames):\n        if notice_at is not None and frame == notice_at:\n            print(worker, \"got the 2-minute notice, saved checkpoint at frame\", frame)\n            return\n        checkpoint[\"done\"] = frame + 1\n    print(worker, \"finished all\", frames, \"frames\")\n\nrun(\"spot-1\", notice_at=6)\nrun(\"spot-2\")",
        "output": "spot-1 got the 2-minute notice, saved checkpoint at frame 6\nspot-2 finished all 10 frames",
        "codeNotes": [
          {
            "line": 5,
            "note": "Start from the saved checkpoint, not from zero."
          },
          {
            "line": 9,
            "note": "Progress is saved after every frame."
          }
        ],
        "tryIt": "Remove the checkpoint (always start at 0). How much work does spot-2 repeat?",
        "check": {
          "question": "How much warning does AWS give before reclaiming a Spot instance?",
          "options": [
            "Two minutes",
            "Two hours",
            "None"
          ],
          "answer": 0,
          "why": "Spot interruption notices arrive two minutes before the instance is stopped or terminated."
        }
      },
      {
        "title": "Practice time: scale and survive",
        "say": [
          "Practice 1: desired_capacity. Multiply, divide, round up with math.ceil, then clamp with max(min_size, min(max_size, value)).",
          "Test the three paths: a normal scale-out (4 at 80 on target 50 gives 7), a scale-in that hits the minimum, and a scale-out that hits the maximum.",
          "A frequent mistake is using round() instead of math.ceil. round(6.4) is 6, which leaves the fleet overloaded.",
          "Another is clamping in the wrong order, such as min(min_size, ...) which always returns the minimum. Read the clamp as \"not below min, not above max\".",
          "Practice 2: spot_action. Check the zero-or-below case first, then the two-minute window, then the default.",
          "Order matters here too: if you checked \"120 or less\" first, a notice of 0 seconds would wrongly say DRAIN_NOW.",
          "The example shows why the clamp order matters with a quick table."
        ],
        "example": "Setting both a floor and a ceiling for a room: the lift can go anywhere in between, but never through the roof or into the basement.",
        "code": "def clamp_right(v, lo, hi):\n    return max(lo, min(hi, v))\n\ndef clamp_wrong(v, lo, hi):\n    return min(lo, max(hi, v))\n\nfor v in [1, 5, 15]:\n    print(f\"value {v:2}: right -> {clamp_right(v, 2, 10):2}, wrong -> {clamp_wrong(v, 2, 10)}\")",
        "output": "value  1: right ->  2, wrong -> 2\nvalue  5: right ->  5, wrong -> 2\nvalue 15: right -> 10, wrong -> 2",
        "codeNotes": [
          {
            "line": 2,
            "note": "Cap at the maximum first, then lift to the minimum."
          },
          {
            "line": 5,
            "note": "This version always returns the minimum."
          }
        ],
        "tryIt": "What does clamp_right(10, 2, 10) return? Why is the edge value allowed?",
        "check": {
          "question": "Why use math.ceil in the capacity formula?",
          "options": [
            "It is faster",
            "Rounding down would leave the fleet slightly overloaded",
            "Python cannot round down"
          ],
          "answer": 1,
          "why": "Scaling out should always give at least enough capacity for the target."
        }
      }
    ],
    "summary": [
      "EC2 instance types combine a family, generation and size; pick the family for the job and right-size.",
      "Pricing: On-Demand for flexibility, Savings Plans for steady load, Spot for interruptible work.",
      "Auto Scaling groups keep a healthy fleet between a minimum and maximum across AZs.",
      "Target tracking: new = ceil(current * metric / target), clamped to the group limits.",
      "Spot gives a two-minute warning; checkpoint work so replacements can resume."
    ],
    "projectStep": {
      "title": "Scaling plan for your app",
      "steps": [
        "Choose an instance type for your app with a small cheapest-fit script.",
        "Simulate a day of traffic through desired_capacity with your min and max.",
        "Split the work into restartable chunks and write the checkpoint logic for Spot."
      ]
    }
  },
  {
    "day": 8,
    "title": "Application Load Balancer (ALB), Target Groups & Health Probes",
    "goal": "You can explain how an Application Load Balancer spreads traffic, write path-based routing rules, model health checks with healthy and unhealthy thresholds, and describe TLS termination and sticky sessions.",
    "minutes": 30,
    "recap": "Yesterday your Auto Scaling group learned to add and remove servers. Now users need a single front door that always sends them to a healthy server.",
    "parts": [
      {
        "title": "Why a load balancer",
        "say": [
          "A load balancer is a single entry point that spreads incoming traffic across many servers. Users see one address; behind it, servers can come and go.",
          "AWS Elastic Load Balancing has three main types. The Application Load Balancer (ALB) works at the HTTP level (layer 7) and can route by path, host name or headers.",
          "The Network Load Balancer (NLB) works at the TCP/UDP level (layer 4), handles millions of connections with very low latency, and keeps a fixed IP address per AZ.",
          "The Gateway Load Balancer is for inserting security appliances such as firewalls into the traffic path; you will meet it less often.",
          "An ALB lives in public subnets in at least two AZs, and forwards traffic to targets in private subnets. It is itself highly available, managed by AWS.",
          "Round robin is the simplest way to spread traffic: each new call goes to the next server in turn. ALBs can also send to the target with the fewest outstanding calls.",
          "The example spreads twelve calls across three servers with round robin."
        ],
        "example": "A bank with one queue and several tellers: the next customer goes to whichever teller is free, and the queue keeps working when a teller takes a break.",
        "code": "from collections import Counter\n\nservers = [\"app-a\", \"app-b\", \"app-c\"]\nserved = Counter()\nfor call_number in range(12):\n    target = servers[call_number % len(servers)]\n    served[target] += 1\nprint(dict(served))",
        "output": "{'app-a': 4, 'app-b': 4, 'app-c': 4}",
        "codeNotes": [
          {
            "line": 6,
            "note": "Modulo cycles through the servers in turn."
          }
        ],
        "tryIt": "Remove app-b from the list (it failed). How are the 12 calls spread now?",
        "check": {
          "question": "Which load balancer can route /api and /images to different servers?",
          "options": [
            "Network Load Balancer",
            "Application Load Balancer",
            "Neither"
          ],
          "answer": 1,
          "why": "Only the ALB understands HTTP paths, so it can route by URL."
        }
      },
      {
        "title": "Listeners, rules and target groups",
        "say": [
          "An ALB has listeners, one per port and protocol, such as HTTPS on 443. Each listener has an ordered list of rules and a default action.",
          "A rule has conditions (path, host, header, method) and an action, usually \"forward to target group X\".",
          "A target group is a set of servers, containers, Lambda functions or IP addresses that do the same job, plus the health check settings for them.",
          "This lets one ALB serve a whole microservice system: /api/* to the API servers, /static/* to a group of file servers, admin.example.com to an admin service.",
          "Rules are checked in priority order and the first match wins, just like NACL rules on Day 4. If none matches, the default action runs.",
          "Practice 1 is route_alb(rules, path). A pattern ending in * matches any path that starts with the text before it; otherwise the path must match exactly.",
          "The example routes several paths through a small rule list."
        ],
        "example": "A shopping centre directory: food on floor 1, clothes on floor 2, and the information desk for anything else.",
        "code": "def route_alb(rules, path):\n    for rule in rules:\n        p = rule[\"pattern\"]\n        if (p.endswith(\"*\") and path.startswith(p[:-1])) or p == path:\n            return rule[\"target_group\"]\n    return \"tg-default\"\n\nrules = [{\"pattern\": \"/api/v1/*\", \"target_group\": \"tg-api\"},\n         {\"pattern\": \"/static/*\", \"target_group\": \"tg-static\"},\n         {\"pattern\": \"/health\", \"target_group\": \"tg-health\"}]\nfor path in [\"/api/v1/orders\", \"/static/app.js\", \"/health\", \"/healthz\", \"/\"]:\n    print(f\"{path:16} -> {route_alb(rules, path)}\")",
        "output": "/api/v1/orders   -> tg-api\n/static/app.js   -> tg-static\n/health          -> tg-health\n/healthz         -> tg-default\n/                -> tg-default",
        "codeNotes": [
          {
            "line": 4,
            "note": "Prefix match for * patterns, exact match otherwise."
          },
          {
            "line": 6,
            "note": "The default action when no rule matches."
          }
        ],
        "tryIt": "Add a rule \"/api/*\" to \"tg-api-old\" BEFORE the v1 rule. Where does /api/v1/orders go now? What does that teach about rule order?",
        "check": {
          "question": "Why does \"/healthz\" go to the default group?",
          "options": [
            "It is misspelled on purpose",
            "The /health rule has no *, so it needs an exact match",
            "ALBs ignore paths ending in z"
          ],
          "answer": 1,
          "why": "Patterns without a wildcard must equal the path exactly."
        }
      },
      {
        "title": "Health checks and thresholds",
        "say": [
          "A load balancer must never send users to a broken server. So it calls a health check path on every target, for example GET /health every 30 seconds.",
          "One slow answer should not remove a server, and one lucky answer should not add a broken one back. So ALBs use thresholds.",
          "A target becomes healthy after a number of passes IN A ROW (the healthy threshold), and unhealthy after a number of failures in a row (the unhealthy threshold).",
          "New targets start unhealthy and receive no traffic until they have passed enough checks. That gives the app time to start up.",
          "Practice 2 is target_state(results, healthy_threshold=3, unhealthy_threshold=2). Keep two counters; a pass resets the failure counter and a failure resets the pass counter.",
          "A good /health endpoint checks the things the server truly needs, such as its database connection, but stays fast and cheap.",
          "The example replays a history of check results and prints the state after each one."
        ],
        "example": "A new driver who must pass several lessons in a row before driving alone, and whose licence is suspended after a couple of offences in a row.",
        "code": "def replay(results, healthy_threshold=3, unhealthy_threshold=2):\n    state, passes, fails = \"UNHEALTHY\", 0, 0\n    for ok in results:\n        if ok:\n            passes, fails = passes + 1, 0\n            if passes >= healthy_threshold: state = \"HEALTHY\"\n        else:\n            passes, fails = 0, fails + 1\n            if fails >= unhealthy_threshold: state = \"UNHEALTHY\"\n        print(\"pass\" if ok else \"FAIL\", \"->\", state)\n\nreplay([True, True, True, False, True, False, False])",
        "output": "pass -> UNHEALTHY\npass -> UNHEALTHY\npass -> HEALTHY\nFAIL -> HEALTHY\npass -> HEALTHY\nFAIL -> HEALTHY\nFAIL -> UNHEALTHY",
        "codeNotes": [
          {
            "line": 5,
            "note": "A pass extends the streak and resets the failure count."
          },
          {
            "line": 9,
            "note": "Two failures in a row take the target out."
          }
        ],
        "tryIt": "Set unhealthy_threshold to 1. How does the output change? Is that too sensitive?",
        "check": {
          "question": "A healthy target fails one check, then passes. With unhealthy threshold 2, what is its state?",
          "options": [
            "UNHEALTHY",
            "HEALTHY",
            "DRAINING"
          ],
          "answer": 1,
          "why": "One failure is below the threshold of two in a row, so it stays healthy."
        }
      },
      {
        "title": "HTTPS and TLS termination",
        "say": [
          "Almost all web traffic today uses HTTPS: HTTP inside an encrypted TLS connection. The ALB can handle the TLS part for you.",
          "This is called TLS termination. The ALB holds the certificate, decrypts incoming traffic, applies your rules, and forwards to the targets.",
          "Certificates can come free from AWS Certificate Manager (ACM), which also renews them automatically. Expired certificates are a classic cause of outages; automatic renewal removes that risk.",
          "A common rule redirects HTTP on port 80 to HTTPS on 443, so users who type the plain address still end up on the secure one.",
          "Traffic from the ALB to the targets can be plain HTTP inside the private network, or encrypted again if your rules or compliance demand end-to-end encryption.",
          "The example models the listener setup and checks a list of incoming calls: plain HTTP gets a redirect, HTTPS is forwarded.",
          "ALBs also add headers such as X-Forwarded-For so your app can still see the user's real IP address."
        ],
        "example": "A secure mail room that opens sealed envelopes, checks them and passes the contents to the right desk inside the building.",
        "code": "listeners = {80: \"REDIRECT_TO_HTTPS\", 443: \"FORWARD\"}\n\ndef handle(port, path, client_ip):\n    action = listeners.get(port, \"REFUSE\")\n    if action == \"REDIRECT_TO_HTTPS\":\n        return f\"301 -> https://shop.example.com{path}\"\n    if action == \"FORWARD\":\n        return f\"forward {path} with X-Forwarded-For: {client_ip}\"\n    return \"connection refused\"\n\nfor port, path in [(80, \"/cart\"), (443, \"/cart\"), (8080, \"/\")]:\n    print(port, handle(port, path, \"49.36.10.7\"))",
        "output": "80 301 -> https://shop.example.com/cart\n443 forward /cart with X-Forwarded-For: 49.36.10.7\n8080 connection refused",
        "codeNotes": [
          {
            "line": 6,
            "note": "A permanent redirect keeps the same path on HTTPS."
          },
          {
            "line": 8,
            "note": "The ALB tells the app who the real client is."
          }
        ],
        "tryIt": "Add a listener for 8443 that forwards too. When might you use it?",
        "check": {
          "question": "What does TLS termination at the ALB mean?",
          "options": [
            "The ALB blocks all encrypted traffic",
            "The ALB decrypts HTTPS using its certificate and forwards to targets",
            "TLS is turned off everywhere"
          ],
          "answer": 1,
          "why": "The ALB ends the TLS connection, so it can read and route the HTTP inside it."
        }
      },
      {
        "title": "Sticky sessions and connection draining",
        "say": [
          "Some older apps keep a user's session in the memory of one server. If the next click lands on a different server, the user is suddenly logged out.",
          "Sticky sessions fix this by setting a cookie so the ALB keeps sending that user to the same target. It works, but it spreads load unevenly and breaks when that server is replaced.",
          "The better design is stateless servers: keep sessions in a shared store such as ElastiCache (Redis) or DynamoDB, so any server can handle any click.",
          "Connection draining (called deregistration delay on ALBs) handles servers leaving the group. The ALB stops sending new calls to the target but lets calls in progress finish, for up to a configured time.",
          "Draining is what makes scale-in and deployments invisible to users. Without it, a user uploading a file might have the connection cut halfway.",
          "The example shows stickiness pinning a user by hashing their session cookie, and what happens when their server disappears.",
          "Remember: prefer stateless servers; use stickiness only for legacy apps you cannot change yet."
        ],
        "example": "Always asking for the same waiter who remembers your order, versus a restaurant where the order is written on a shared ticket any waiter can read.",
        "code": "import hashlib\n\ndef pick(cookie, servers):\n    h = int(hashlib.sha256(cookie.encode()).hexdigest(), 16)\n    return servers[h % len(servers)]\n\nservers = [\"app-a\", \"app-b\", \"app-c\"]\nprint(\"Before:\", pick(\"session-42\", servers), pick(\"session-42\", servers))\nservers.remove(pick(\"session-42\", servers))\nprint(\"Their server was replaced; now:\", pick(\"session-42\", servers))",
        "output": "Before: app-a app-a\nTheir server was replaced; now: app-c",
        "codeNotes": [
          {
            "line": 4,
            "note": "The same cookie always hashes to the same number."
          },
          {
            "line": 9,
            "note": "Removing that server forces the user onto a new one."
          }
        ],
        "tryIt": "Try several different cookie values. Are users spread evenly across the three servers?",
        "check": {
          "question": "What is the best long-term fix for users being logged out when they hit another server?",
          "options": [
            "Sticky sessions forever",
            "Store sessions in a shared store so servers are stateless",
            "Use only one server"
          ],
          "answer": 1,
          "why": "Stateless servers with shared session storage scale and fail over cleanly."
        }
      },
      {
        "title": "Practice time: route and check health",
        "say": [
          "Practice 1: route_alb(rules, path). Loop over the rules in order. For a pattern ending in *, compare with path.startswith(pattern[:-1]); for others, compare with ==. Return \"tg-default\" if nothing matched.",
          "Be careful with the exact-match case. A pattern \"/health\" must not match \"/healthz\" or \"/health/deep\".",
          "Practice 2: target_state(results, healthy_threshold=3, unhealthy_threshold=2). Start \"UNHEALTHY\" with both counters at zero.",
          "On a pass, add one to passes and set fails to zero; if passes reached the threshold, the state is HEALTHY. On a failure, do the opposite.",
          "Do not count total passes. [True, True, False, True, True] has four passes but never three in a row, so the target stays unhealthy.",
          "Both tasks model features you will configure in real consoles and Terraform files, so understanding the rules precisely helps you set sensible numbers.",
          "The example contrasts counting passes in a row with counting all passes."
        ],
        "example": "A streak counter in a game: miss once and it resets to zero, no matter how many you got before.",
        "code": "history = [True, True, False, True, True]\ntotal_passes = sum(history)\nbest_streak = streak = 0\nfor ok in history:\n    streak = streak + 1 if ok else 0\n    best_streak = max(best_streak, streak)\nprint(\"Total passes:\", total_passes)\nprint(\"Longest run of passes:\", best_streak)\nprint(\"Healthy with threshold 3?\", best_streak >= 3)",
        "output": "Total passes: 4\nLongest run of passes: 2\nHealthy with threshold 3? False",
        "codeNotes": [
          {
            "line": 5,
            "note": "A failure resets the streak to zero."
          }
        ],
        "tryIt": "Append one more True to the history. Does the target become healthy?",
        "check": {
          "question": "Rules: \"/static/*\" then \"/static/admin\". Which target does \"/static/admin\" reach?",
          "options": [
            "The /static/admin target",
            "The /static/* target, because it is checked first and matches",
            "The default target"
          ],
          "answer": 1,
          "why": "The first matching rule wins, so put specific rules before broad ones."
        }
      }
    ],
    "summary": [
      "Load balancers give one front door and spread traffic across healthy targets.",
      "ALB (HTTP, layer 7) routes by path, host and headers; NLB (layer 4) handles raw TCP/UDP at huge scale.",
      "Listener rules are checked in priority order; the first match forwards to a target group.",
      "Health checks use thresholds of passes and failures in a row.",
      "Terminate TLS at the ALB with ACM certificates; prefer stateless servers over sticky sessions; drain connections on removal."
    ],
    "projectStep": {
      "title": "Front door for your app",
      "steps": [
        "Write listener rules for your app's paths and route a list of sample URLs.",
        "Pick health check thresholds and replay a flaky history through target_state.",
        "Design an HTTP-to-HTTPS redirect and explain where the certificate lives."
      ]
    }
  },
  {
    "day": 9,
    "title": "Amazon S3 Object Storage & Lifecycle Management Tiering",
    "goal": "You can explain object storage, work with S3 buckets, keys and prefixes, choose storage classes by access pattern and age, write lifecycle rules, and use versioning and delete markers to recover from mistakes.",
    "minutes": 30,
    "recap": "Your servers now sit behind a load balancer. But servers are disposable; the files your users upload need a home that never disappears. That home is Amazon S3.",
    "parts": [
      {
        "title": "Object storage and S3",
        "say": [
          "Amazon Simple Storage Service (S3) stores objects: files of any kind, from a few bytes up to 5 terabytes each, with practically no limit on how many.",
          "Objects live in buckets. A bucket name is unique across all of AWS, worldwide. Inside a bucket each object has a key, which is its full name, such as users/42/avatar.png.",
          "S3 has no real folders. The slashes are just part of the key; the console shows them as folders for convenience. A shared start of keys is called a prefix.",
          "S3 is designed for 99.999999999 percent (eleven nines) durability: it stores copies across at least three AZs, so losing a stored object is extremely unlikely.",
          "You read and write whole objects through an HTTP API. You cannot change a few bytes in the middle of an object; you upload a new version of the whole thing.",
          "This makes S3 perfect for images, videos, backups, logs, data lake files and static websites, and wrong for a database that changes small records constantly.",
          "The example models a bucket as a dictionary and lists keys by prefix, just as the S3 list API does."
        ],
        "example": "A huge valet coat check: you hand in any item, get a unique ticket (the key), and can collect it later. You cannot alter the coat while it is checked; you swap it for a new one.",
        "code": "bucket = {\n    \"users/42/avatar.png\": 48_000,\n    \"users/42/cv.pdf\": 210_000,\n    \"users/77/avatar.png\": 51_000,\n    \"logs/2026/09/29/app.log\": 3_400_000,\n}\ndef list_prefix(prefix):\n    return sorted(k for k in bucket if k.startswith(prefix))\n\nprint(list_prefix(\"users/42/\"))\nprint(list_prefix(\"logs/\"))\nprint(\"Total bytes:\", sum(bucket.values()))",
        "output": "['users/42/avatar.png', 'users/42/cv.pdf']\n['logs/2026/09/29/app.log']\nTotal bytes: 3709000",
        "codeNotes": [
          {
            "line": 1,
            "note": "Keys look like paths, but the bucket is really a flat key-to-object map."
          },
          {
            "line": 8,
            "note": "Listing by prefix is how \"folders\" work."
          }
        ],
        "tryIt": "List every avatar in the bucket, whatever the user id. What string test do you need?",
        "check": {
          "question": "What is an S3 key?",
          "options": [
            "A password for the bucket",
            "The full name of an object inside a bucket",
            "An encryption key"
          ],
          "answer": 1,
          "why": "Each object is found by its bucket and key, such as users/42/avatar.png."
        }
      },
      {
        "title": "Storage classes",
        "say": [
          "Not all data is used equally. S3 offers storage classes that trade retrieval speed and cost for a lower storage price.",
          "S3 Standard: for frequently used data, with millisecond access and the highest storage price.",
          "S3 Standard-Infrequent Access (Standard-IA): cheaper to store, but you pay a fee per gigabyte retrieved. Good for data read less than about once a month.",
          "S3 Intelligent-Tiering: moves objects between tiers automatically based on how they are used, for a small monitoring fee. Good when you cannot predict access.",
          "S3 Glacier classes: very cheap storage for archives. Glacier Instant Retrieval still reads in milliseconds; Glacier Flexible Retrieval takes minutes to hours; Glacier Deep Archive, the cheapest of all, takes up to about half a day.",
          "The example compares a year of storing 1,000 GB in each class with rounded example prices, and adds the cost of reading it all back once.",
          "The lesson: the cheapest class to store is not always the cheapest overall if you read the data often."
        ],
        "example": "Keeping clothes in your wardrobe, in boxes under the bed, or in a storage unit across town: cheaper storage, slower and costlier to get things back.",
        "code": "classes = {\n    \"STANDARD\": (0.023, 0.0),\n    \"STANDARD_IA\": (0.0125, 0.01),\n    \"GLACIER_FLEXIBLE\": (0.0036, 0.03),\n    \"DEEP_ARCHIVE\": (0.00099, 0.02),\n}\ngb = 1000\nfor name, (per_gb_month, per_gb_read) in classes.items():\n    store = per_gb_month * gb * 12\n    read_once = per_gb_read * gb\n    print(f\"{name:17} store 1 yr ${store:7.2f}   read all once ${read_once:5.2f}\")",
        "output": "STANDARD          store 1 yr $ 276.00   read all once $ 0.00\nSTANDARD_IA       store 1 yr $ 150.00   read all once $10.00\nGLACIER_FLEXIBLE  store 1 yr $  43.20   read all once $30.00\nDEEP_ARCHIVE      store 1 yr $  11.88   read all once $20.00",
        "codeNotes": [
          {
            "line": 2,
            "note": "Each class: storage price per GB-month and retrieval price per GB (example numbers)."
          }
        ],
        "tryIt": "Suppose you read all 1,000 GB every month. Which class is cheapest for the year now?",
        "check": {
          "question": "Old tax records you must keep for 7 years and almost never read. Which class fits?",
          "options": [
            "S3 Standard",
            "Glacier Deep Archive",
            "Standard-IA"
          ],
          "answer": 1,
          "why": "Rarely read, long-kept archives are what Deep Archive is priced for."
        }
      },
      {
        "title": "Lifecycle rules",
        "say": [
          "You do not have to move objects between classes by hand. Lifecycle rules do it for you, based on each object's age.",
          "A typical rule for logs: keep them in Standard for 30 days while people investigate problems, move them to Standard-IA, then to Glacier after 90 days, then Deep Archive after a year.",
          "Lifecycle rules can also expire (delete) objects, for example deleting temporary uploads after 7 days. Deleting data you no longer need is the biggest saving of all.",
          "Rules can target a prefix (only logs/) or objects with a certain tag, so different data in one bucket can age differently.",
          "Practice 1 is storage_class(age_days, access). Check the oldest thresholds first: 365 days or more is DEEP_ARCHIVE, 90 or more is GLACIER_FLEXIBLE, 30 or more AND infrequent is STANDARD_IA, otherwise STANDARD.",
          "Checking the largest threshold first matters. If you checked \"30 or more\" first, a 400-day-old object would stop there and never reach Deep Archive.",
          "The example applies the rule to a batch of objects of different ages."
        ],
        "example": "A kitchen where fresh food lives in the fridge, older stock moves to the pantry, and what has not been touched in a year goes to the garage shelf.",
        "code": "def storage_class(age_days, access):\n    if age_days >= 365: return \"DEEP_ARCHIVE\"\n    if age_days >= 90: return \"GLACIER_FLEXIBLE\"\n    if age_days >= 30 and access == \"INFREQUENT\": return \"STANDARD_IA\"\n    return \"STANDARD\"\n\nobjects = [(\"app.log\", 3, \"FREQUENT\"), (\"report.pdf\", 45, \"INFREQUENT\"),\n           (\"video.mp4\", 45, \"FREQUENT\"), (\"q1.csv\", 120, \"INFREQUENT\"), (\"2024.tar\", 500, \"INFREQUENT\")]\nfor key, age, access in objects:\n    print(f\"{key:11} {age:4} days -> {storage_class(age, access)}\")",
        "output": "app.log        3 days -> STANDARD\nreport.pdf    45 days -> STANDARD_IA\nvideo.mp4     45 days -> STANDARD\nq1.csv       120 days -> GLACIER_FLEXIBLE\n2024.tar     500 days -> DEEP_ARCHIVE",
        "codeNotes": [
          {
            "line": 2,
            "note": "The oldest rule is checked first."
          },
          {
            "line": 4,
            "note": "Only move to IA if the object is also rarely read."
          }
        ],
        "tryIt": "Add an \"expire after 730 days\" rule that returns \"DELETE\". Where must it go in the order?",
        "check": {
          "question": "Why check \"365 days or more\" before \"30 days or more\"?",
          "options": [
            "It is alphabetical",
            "Otherwise a very old object stops at the first, weaker rule",
            "S3 requires that order"
          ],
          "answer": 1,
          "why": "Ordered thresholds must go from the strictest to the loosest so each object reaches the right class."
        }
      },
      {
        "title": "Versioning and delete markers",
        "say": [
          "Turn on versioning for a bucket and S3 keeps every version of every object. Uploading the same key again adds a new version instead of overwriting.",
          "Deleting an object in a versioned bucket does not erase it. S3 adds a delete marker on top. A normal GET now sees the marker and says \"not found\", but the older versions are still there.",
          "To undelete, remove the delete marker. The newest real version becomes current again. To really erase, delete specific version ids.",
          "Versioning protects against accidents (a script that overwrites everything with empty files) and some ransomware attacks. Combine it with lifecycle rules that expire old versions, or storage costs grow forever.",
          "Practice 2 is current_version(versions): look at the newest entry; if it is a delete marker, the object looks deleted, so return None; otherwise return its version id.",
          "The example walks through upload, overwrite, delete and restore on one key.",
          "For extra protection, S3 Object Lock can make versions unchangeable for a set time, which some regulations require."
        ],
        "example": "A document with full edit history: \"deleting\" it just adds a \"deleted\" page on top, and you can tear that page off to get the document back.",
        "code": "versions = []\n\ndef current():\n    if not versions or versions[-1][\"is_delete_marker\"]:\n        return None\n    return versions[-1][\"version_id\"]\n\nversions.append({\"version_id\": \"v1\", \"is_delete_marker\": False}); print(\"upload ->\", current())\nversions.append({\"version_id\": \"v2\", \"is_delete_marker\": False}); print(\"overwrite ->\", current())\nversions.append({\"version_id\": \"d1\", \"is_delete_marker\": True}); print(\"delete ->\", current())\nversions.pop(); print(\"remove the marker ->\", current())\nprint(\"all versions kept:\", [v[\"version_id\"] for v in versions])",
        "output": "upload -> v1\noverwrite -> v2\ndelete -> None\nremove the marker -> v2\nall versions kept: ['v1', 'v2']",
        "codeNotes": [
          {
            "line": 4,
            "note": "A delete marker on top hides the object from normal reads."
          },
          {
            "line": 11,
            "note": "Removing the marker restores the newest real version."
          }
        ],
        "tryIt": "After the restore, how would you go back to v1 instead of v2?",
        "check": {
          "question": "In a versioned bucket you delete a file. What really happens?",
          "options": [
            "All versions are erased",
            "A delete marker is added and older versions remain",
            "The bucket is locked"
          ],
          "answer": 1,
          "why": "The delete only adds a marker; the data stays until versions are removed."
        }
      },
      {
        "title": "Uploading big files and presigned URLs",
        "say": [
          "For large files, S3 multipart upload splits the file into parts (at least 5 MB each, except the last) that upload in parallel and can be retried one by one.",
          "If part 37 of 200 fails, you retry only that part, not the whole file. AWS recommends multipart for files over about 100 MB.",
          "Browsers and phones should upload straight to S3 instead of streaming big files through your servers. A presigned URL makes this safe.",
          "Your server, which has permission, creates a URL that allows one specific action (such as PUT to one key) until a short expiry time. The client uses it without any AWS credentials of its own.",
          "This keeps your servers small and your bucket private: nobody can upload anything else, and the link stops working after a few minutes.",
          "The example splits a file into parts and computes how many parallel uploads are needed.",
          "You will use S3 uploads again on Day 15, where a new upload automatically starts a video-processing pipeline."
        ],
        "example": "Moving house with many small boxes and several friends instead of one giant crate: faster, and one dropped box does not ruin everything.",
        "code": "import math\n\nMB = 1024 * 1024\nfile_size = 1_300 * MB\npart_size = 100 * MB\nparts = math.ceil(file_size / part_size)\nprint(\"Parts:\", parts)\nprint(\"Last part MB:\", (file_size - (parts - 1) * part_size) // MB)\nworkers = 4\nprint(\"Rounds of parallel uploads with\", workers, \"workers:\", math.ceil(parts / workers))",
        "output": "Parts: 13\nLast part MB: 100\nRounds of parallel uploads with 4 workers: 4",
        "codeNotes": [
          {
            "line": 6,
            "note": "Round up so the last partial chunk gets its own part."
          }
        ],
        "tryIt": "Change the part size to 8 MB. How many parts now? (S3 allows up to 10,000.)",
        "check": {
          "question": "Why use presigned URLs for user uploads?",
          "options": [
            "They make files smaller",
            "Clients upload directly to S3 with limited, expiring permission and no AWS keys",
            "They skip encryption"
          ],
          "answer": 1,
          "why": "A presigned URL grants one narrow action for a short time."
        }
      },
      {
        "title": "Practice time: classes and versions",
        "say": [
          "Practice 1: storage_class(age_days, access). Four branches, oldest first. Remember that STANDARD_IA needs both conditions: 30 days or more AND \"INFREQUENT\".",
          "Test your thinking: a 45-day-old object read often stays STANDARD; the same object read rarely moves to STANDARD_IA; any object over 90 days goes to Glacier whatever its access.",
          "Practice 2: current_version(versions). Handle the empty list first, then look only at versions[-1].",
          "A common mistake is searching the whole list for any delete marker. An old marker that was later followed by a new upload does not hide the object; only the newest entry counts.",
          "These two functions are small models of real S3 behaviour, and they help you reason about costs and recovery before an incident, not during one.",
          "After passing, try combining them: expire noncurrent versions older than 90 days to keep versioning affordable.",
          "The example shows why only the newest entry matters."
        ],
        "example": "A noticeboard where only the top sheet counts: an old \"cancelled\" note under a newer \"event is on\" note does not cancel the event.",
        "code": "versions = [\n    {\"version_id\": \"v1\", \"is_delete_marker\": False},\n    {\"version_id\": \"d1\", \"is_delete_marker\": True},\n    {\"version_id\": \"v2\", \"is_delete_marker\": False},\n]\nwrong = None if any(v[\"is_delete_marker\"] for v in versions) else versions[-1][\"version_id\"]\nright = None if versions[-1][\"is_delete_marker\"] else versions[-1][\"version_id\"]\nprint(\"any-marker check:\", wrong)\nprint(\"newest-entry check:\", right)",
        "output": "any-marker check: None\nnewest-entry check: v2",
        "codeNotes": [
          {
            "line": 6,
            "note": "Wrong: an old marker still hides the re-uploaded object."
          },
          {
            "line": 7,
            "note": "Right: only the newest entry decides."
          }
        ],
        "tryIt": "Append another delete marker. What do both checks return now?",
        "check": {
          "question": "A 45-day-old object is read every day. Which class does our rule give?",
          "options": [
            "STANDARD_IA",
            "STANDARD",
            "GLACIER_FLEXIBLE"
          ],
          "answer": 1,
          "why": "It is under 90 days and not infrequent, so it stays in STANDARD."
        }
      }
    ],
    "summary": [
      "S3 stores objects in buckets under keys; \"folders\" are just key prefixes.",
      "S3 is built for eleven nines of durability by storing copies across AZs.",
      "Storage classes trade access speed and retrieval fees for lower storage prices.",
      "Lifecycle rules move and expire objects by age; check the oldest thresholds first.",
      "Versioning keeps every version; deletes add markers that can be removed to restore."
    ],
    "projectStep": {
      "title": "Storage plan for your app",
      "steps": [
        "List the kinds of files your app stores and how often each is read.",
        "Write lifecycle rules for each prefix and test them with storage_class.",
        "Simulate an accidental delete and a restore with a versions list."
      ]
    }
  },
  {
    "day": 10,
    "title": "Amazon S3 Security, Block Public Access & Bucket Policies",
    "goal": "You can explain how S3 buckets get leaked, use Block Public Access, write bucket policies that enforce HTTPS and limit access, validate bucket names, and choose between the S3 encryption options.",
    "minutes": 30,
    "recap": "Yesterday you stored and aged data in S3. Many famous data leaks were S3 buckets left open to the world, so today is about locking them down properly.",
    "parts": [
      {
        "title": "How buckets leak",
        "say": [
          "By default, a new S3 bucket is private: only the account that owns it can read it. Leaks happen when someone changes that, usually by accident.",
          "The usual causes are a bucket policy that allows \"Principal\": \"*\" (everyone), an access control list granting \"AllUsers\", or a presigned link that never really expires because it is regenerated and shared publicly.",
          "Attackers run automated scanners that try bucket names found in websites, apps and code. An open bucket can be found and copied within hours.",
          "Leaked buckets have exposed voter records, medical files and passwords. The data was never \"hacked\" in a clever way; it was simply left public.",
          "AWS added Block Public Access to stop this. It is a set of four switches, at the account or bucket level, that override any policy or ACL that would make data public.",
          "Leave Block Public Access on for every bucket unless the bucket truly hosts public content, and even then prefer serving it through CloudFront (Day 16).",
          "The example scans a list of bucket settings and flags the risky ones."
        ],
        "example": "Leaving a filing cabinet on the pavement with a sign saying \"help yourself\". Nobody needs to pick a lock.",
        "code": "buckets = [\n    {\"name\": \"invoices-prod\", \"block_public\": True, \"policy_principal\": \"account\"},\n    {\"name\": \"marketing-site\", \"block_public\": False, \"policy_principal\": \"*\"},\n    {\"name\": \"backup-2026\", \"block_public\": False, \"policy_principal\": \"account\"},\n]\nfor b in buckets:\n    if b[\"policy_principal\"] == \"*\" and not b[\"block_public\"]:\n        print(\"PUBLIC:\", b[\"name\"])\n    elif not b[\"block_public\"]:\n        print(\"WARNING, public access not blocked:\", b[\"name\"])\n    else:\n        print(\"ok:\", b[\"name\"])",
        "output": "ok: invoices-prod\nPUBLIC: marketing-site\nWARNING, public access not blocked: backup-2026",
        "codeNotes": [
          {
            "line": 7,
            "note": "A public policy with nothing blocking it: the data is open."
          },
          {
            "line": 9,
            "note": "Not public today, but one policy change away from it."
          }
        ],
        "tryIt": "Should marketing-site be public at all if CloudFront serves the website? What would you change?",
        "check": {
          "question": "What does S3 Block Public Access do?",
          "options": [
            "Encrypts every object",
            "Overrides policies and ACLs that would make data public",
            "Deletes public files"
          ],
          "answer": 1,
          "why": "It is a safety switch that stops public grants from taking effect."
        }
      },
      {
        "title": "Bucket policies",
        "say": [
          "A bucket policy is a JSON resource policy attached to the bucket itself. It uses the same language as IAM policies from Day 6, plus a Principal field saying WHO the statement applies to.",
          "Identity policies (on users and roles) say what an identity may do. Resource policies (on buckets) say who may touch this resource. Within one account, either one can allow; a Deny in either one wins.",
          "Bucket policies are the right place for bucket-wide rules: \"only our CloudFront distribution may read\", \"only this role may write\", \"deny anything over plain HTTP\".",
          "Conditions make policies precise. They compare request details, such as whether the connection is encrypted, the caller's IP range, or tags, before a statement applies.",
          "Resources in bucket policies usually come in two forms: arn:aws:s3:::bucket for bucket actions such as listing, and arn:aws:s3:::bucket/* for object actions such as reading.",
          "Mixing those up is a very common mistake: s3:GetObject on arn:aws:s3:::bucket (without /*) matches no objects at all.",
          "The example prints a policy that lets one role read objects and list the bucket."
        ],
        "example": "A sign on a door listing exactly who may enter and under what conditions, in addition to the keys each person carries.",
        "code": "import json\n\nrole = \"arn:aws:iam::111122223333:role/report-reader\"\npolicy = {\"Version\": \"2012-10-17\", \"Statement\": [\n    {\"Effect\": \"Allow\", \"Principal\": {\"AWS\": role}, \"Action\": \"s3:ListBucket\",\n     \"Resource\": \"arn:aws:s3:::reports\"},\n    {\"Effect\": \"Allow\", \"Principal\": {\"AWS\": role}, \"Action\": \"s3:GetObject\",\n     \"Resource\": \"arn:aws:s3:::reports/*\"},\n]}\nfor s in policy[\"Statement\"]:\n    print(s[\"Effect\"], s[\"Action\"], \"on\", s[\"Resource\"], \"for\", s[\"Principal\"][\"AWS\"].split(\"/\")[-1])\nprint(\"Policy size:\", len(json.dumps(policy)), \"characters (bucket policies may be up to 20 KB)\")",
        "output": "Allow s3:ListBucket on arn:aws:s3:::reports for report-reader\nAllow s3:GetObject on arn:aws:s3:::reports/* for report-reader\nPolicy size: 349 characters (bucket policies may be up to 20 KB)",
        "codeNotes": [
          {
            "line": 6,
            "note": "Bucket-level action: the bucket ARN without /*."
          },
          {
            "line": 8,
            "note": "Object-level action: the ARN with /* for every object."
          },
          {
            "line": 12,
            "note": "json.dumps turns the dict back into the text AWS stores."
          }
        ],
        "tryIt": "Add a statement denying s3:DeleteObject to everyone (\"Principal\": \"*\").",
        "check": {
          "question": "s3:GetObject is allowed on \"arn:aws:s3:::reports\". Can the role read reports/q1.pdf?",
          "options": [
            "Yes",
            "No, object actions need the resource arn:aws:s3:::reports/*",
            "Only if the file is small"
          ],
          "answer": 1,
          "why": "Objects are matched by bucket/key ARNs, so the resource must include /*."
        }
      },
      {
        "title": "Enforcing HTTPS with aws:SecureTransport",
        "say": [
          "Data must be protected in transit, not just at rest. S3 accepts both HTTP and HTTPS by default, so you should forbid plain HTTP explicitly.",
          "Every request carries a condition key, aws:SecureTransport, which is \"true\" for HTTPS and \"false\" for plain HTTP.",
          "The standard rule is a Deny statement for all S3 actions on the bucket and its objects, with the condition Bool aws:SecureTransport \"false\". Security audits look for exactly this statement.",
          "Because it is a Deny, it wins over every Allow, so no role or user can accidentally read the bucket over an unencrypted connection.",
          "Practice 1 is enforces_tls(policy). Return True only if some statement has Effect \"Deny\" and that Bool condition equal to \"false\".",
          "Use .get() with an empty dict default at each level, because many statements have no Condition at all, and indexing a missing key would crash.",
          "The example checks three policies: the correct one, one that ALLOWS insecure transport (the opposite of what we want), and an empty one."
        ],
        "example": "A bank rule that says \"no cash is handed over through an open window, ever\", which overrides any teller's own judgement.",
        "code": "def enforces_tls(policy):\n    for s in policy.get(\"Statement\", []):\n        secure = s.get(\"Condition\", {}).get(\"Bool\", {}).get(\"aws:SecureTransport\")\n        if s.get(\"Effect\") == \"Deny\" and secure == \"false\":\n            return True\n    return False\n\ndeny_http = {\"Effect\": \"Deny\", \"Principal\": \"*\", \"Action\": \"s3:*\",\n             \"Condition\": {\"Bool\": {\"aws:SecureTransport\": \"false\"}}}\nallow_http = dict(deny_http, Effect=\"Allow\")\nfor name, pol in [(\"deny http\", [deny_http]), (\"allow http\", [allow_http]), (\"empty\", [])]:\n    print(f\"{name:10} -> {enforces_tls({'Statement': pol})}\")",
        "output": "deny http  -> True\nallow http -> False\nempty      -> False",
        "codeNotes": [
          {
            "line": 3,
            "note": "Chained .get() calls never crash on missing keys."
          },
          {
            "line": 4,
            "note": "Only a Deny with SecureTransport false enforces HTTPS."
          }
        ],
        "tryIt": "What does the \"allow http\" statement actually do? Why is it dangerous rather than safe?",
        "check": {
          "question": "Which statement forces clients to use HTTPS?",
          "options": [
            "Allow when aws:SecureTransport is \"true\"",
            "Deny when aws:SecureTransport is \"false\"",
            "Allow s3:* to everyone"
          ],
          "answer": 1,
          "why": "Only an explicit Deny on insecure transport overrides every other Allow."
        }
      },
      {
        "title": "Bucket naming rules",
        "say": [
          "Bucket names are global across all AWS accounts, and they appear in URLs, so they follow strict DNS-friendly rules.",
          "A name is 3 to 63 characters long, uses only lowercase letters, digits, dots and hyphens, and must start and end with a letter or digit.",
          "It may not contain two dots in a row, and it may not look like an IP address such as 192.168.5.4.",
          "Many teams avoid dots entirely, because dotted names cause certificate problems with virtual-hosted HTTPS URLs.",
          "Since names are global and public, avoid putting secrets or customer names in them. A predictable name like companyname-backups is the first thing scanners try.",
          "Practice 2 is is_valid_bucket_name(name). One regular expression handles length, allowed characters and the start and end; two extra checks handle double dots and IP-like names.",
          "The example tests a list of candidate names and explains each failure."
        ],
        "example": "Choosing a website address: it must be unique in the world, use only certain characters, and should not reveal anything private.",
        "code": "import re\n\ndef why_invalid(name):\n    if not re.fullmatch(r\"[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]\", name):\n        return \"length, characters, or start/end\"\n    if \"..\" in name:\n        return \"two dots in a row\"\n    if re.fullmatch(r\"\\d+\\.\\d+\\.\\d+\\.\\d+\", name):\n        return \"looks like an IP address\"\n    return \"valid\"\n\nfor n in [\"pinit-media-prod\", \"Pinit_Media\", \"ab\", \"my..bucket\", \"10.0.0.1\", \"logs-2026.eu\"]:\n    print(f\"{n:18} {why_invalid(n)}\")",
        "output": "pinit-media-prod   valid\nPinit_Media        length, characters, or start/end\nab                 length, characters, or start/end\nmy..bucket         two dots in a row\n10.0.0.1           looks like an IP address\nlogs-2026.eu       valid",
        "codeNotes": [
          {
            "line": 4,
            "note": "{1,61} middle characters plus a first and last character gives 3 to 63."
          },
          {
            "line": 8,
            "note": "Four groups of digits separated by dots."
          }
        ],
        "tryIt": "Is \"-starts-with-dash\" valid? Which check catches it?",
        "check": {
          "question": "Which bucket name is valid?",
          "options": [
            "My-Bucket",
            "my-bucket-2026",
            "my_bucket"
          ],
          "answer": 1,
          "why": "Only lowercase letters, digits, dots and hyphens are allowed."
        }
      },
      {
        "title": "Encryption at rest",
        "say": [
          "Since 2023, S3 encrypts every new object automatically with S3-managed keys (SSE-S3). You get encryption at rest with no work at all.",
          "SSE-KMS uses keys from AWS Key Management Service (Day 26). You control the key's policy, can see every use of the key in the audit log, and can disable the key to make data unreadable.",
          "SSE-C lets you supply your own key with each request. AWS uses it and forgets it, so if you lose the key, the data is gone for good.",
          "Client-side encryption means you encrypt before uploading, so AWS only ever sees scrambled bytes.",
          "Most teams use SSE-KMS for sensitive data, because it adds a second permission check: to read an object, you need S3 access AND permission to use the KMS key.",
          "That second check is powerful. Even if a bucket policy is misconfigured, data encrypted with a tightly controlled KMS key stays unreadable to outsiders.",
          "The example chooses an encryption option from a data classification."
        ],
        "example": "A safe inside a locked room: getting into the room is not enough; you also need the combination, which is kept by someone else.",
        "code": "def choose_encryption(data_class, need_audit, bring_own_key=False):\n    if bring_own_key:\n        return \"SSE-C (you manage and must never lose the key)\"\n    if data_class in (\"confidential\", \"restricted\") or need_audit:\n        return \"SSE-KMS (key policy + audit log of every use)\"\n    return \"SSE-S3 (automatic, no extra cost)\"\n\nfor args in [(\"public\", False), (\"internal\", False), (\"confidential\", False), (\"internal\", True)]:\n    print(args, \"->\", choose_encryption(*args))",
        "output": "('public', False) -> SSE-S3 (automatic, no extra cost)\n('internal', False) -> SSE-S3 (automatic, no extra cost)\n('confidential', False) -> SSE-KMS (key policy + audit log of every use)\n('internal', True) -> SSE-KMS (key policy + audit log of every use)",
        "codeNotes": [
          {
            "line": 4,
            "note": "Sensitive or audited data gets a customer-controlled KMS key."
          }
        ],
        "tryIt": "Add a \"regulated\" class that must use client-side encryption. Where does the new check go?",
        "check": {
          "question": "Why does SSE-KMS add protection beyond the bucket policy?",
          "options": [
            "It makes objects smaller",
            "Readers also need permission to use the KMS key",
            "It turns off public access"
          ],
          "answer": 1,
          "why": "KMS adds an independent permission check on every decrypt."
        }
      },
      {
        "title": "Practice time: lock the bucket down",
        "say": [
          "Practice 1: enforces_tls(policy). Loop over policy.get(\"Statement\", []). For each statement read the condition with chained .get() calls and return True as soon as you find a Deny with \"false\".",
          "Remember that the value is the STRING \"false\", not the Python value False. Policies are JSON text, so condition values are strings.",
          "Practice 2: is_valid_bucket_name(name). Use re.fullmatch for the main shape, then reject names containing \"..\" and names that fully match the IP pattern.",
          "Test the edges: exactly 3 and exactly 63 characters are valid; 2 and 64 are not. \"a\" * 64 is a quick way to make a 64-character name.",
          "Together with Block Public Access and encryption, these checks form a basic S3 security baseline. Tools such as AWS Config and Security Hub run the same kinds of checks on every bucket, all the time.",
          "After passing, extend enforces_tls to also require that the statement covers both the bucket and its objects.",
          "The example builds a tiny baseline report for one bucket."
        ],
        "example": "A pre-flight safety card for storage: public access blocked, encryption on, HTTPS only, sensible name. Tick every box before take-off.",
        "code": "bucket = {\"name\": \"pinit-invoices-prod\", \"block_public\": True, \"encryption\": \"SSE-KMS\",\n          \"policy\": {\"Statement\": [{\"Effect\": \"Deny\", \"Condition\": {\"Bool\": {\"aws:SecureTransport\": \"false\"}}}]}}\nchecks = {\n    \"public access blocked\": bucket[\"block_public\"],\n    \"encrypted with KMS\": bucket[\"encryption\"] == \"SSE-KMS\",\n    \"HTTPS enforced\": any(s.get(\"Effect\") == \"Deny\" and\n        s.get(\"Condition\", {}).get(\"Bool\", {}).get(\"aws:SecureTransport\") == \"false\"\n        for s in bucket[\"policy\"][\"Statement\"]),\n}\nfor name, ok in checks.items():\n    print(f\"[{'x' if ok else ' '}] {name}\")",
        "output": "[x] public access blocked\n[x] encrypted with KMS\n[x] HTTPS enforced",
        "codeNotes": [
          {
            "line": 7,
            "note": "The string \"false\", not the boolean False."
          }
        ],
        "tryIt": "Set encryption to \"SSE-S3\". Which box is left empty? Is that always a problem?",
        "check": {
          "question": "In a bucket policy condition, how is \"insecure transport\" written?",
          "options": [
            "False (a Python boolean)",
            "\"false\" (a string)",
            "0"
          ],
          "answer": 1,
          "why": "Policy documents are JSON with string condition values, so compare with the string \"false\"."
        }
      }
    ],
    "summary": [
      "New buckets are private; leaks come from public policies or ACLs. Keep Block Public Access on.",
      "Bucket policies are resource policies with a Principal; bucket actions use the bucket ARN, object actions use bucket/*.",
      "Enforce HTTPS with a Deny on aws:SecureTransport \"false\".",
      "Bucket names: 3-63 chars, lowercase, digits, dots, hyphens, no \"..\", not an IP.",
      "S3 encrypts by default; use SSE-KMS for sensitive data to add a key-level permission check."
    ],
    "projectStep": {
      "title": "S3 security baseline",
      "steps": [
        "Write a bucket policy for your app that denies insecure transport and allows only your app role.",
        "Run enforces_tls and is_valid_bucket_name over your planned buckets.",
        "Pick an encryption option for each bucket and explain why."
      ]
    }
  },
  {
    "day": 11,
    "title": "Serverless AWS Lambda: Concurrency, Memory & Cold Starts",
    "goal": "You can explain how AWS Lambda runs functions, write a Python handler, calculate Lambda cost from invocations, duration and memory, reason about concurrency and cold starts, and choose between on-demand, SnapStart and provisioned concurrency.",
    "minutes": 30,
    "recap": "So far your code ran on servers you sized and scaled. Today you hand even that to AWS: with Lambda you upload a function and AWS runs it only when needed.",
    "parts": [
      {
        "title": "Functions without servers",
        "say": [
          "AWS Lambda runs your code in response to events: an HTTP call, a file landing in S3, a message in a queue, a timer. You never see or manage a server.",
          "You pay only while your code runs, measured in milliseconds, plus a small fee per call. A function that is called ten times a day costs almost nothing.",
          "Lambda scales automatically. If a thousand events arrive at once, AWS starts many copies of your function in parallel, up to your account's concurrency limit.",
          "There are limits to know. A single run can last at most 15 minutes. Memory can be set from 128 MB to 10 GB, and CPU power grows in proportion to memory.",
          "Lambda suits short, event-driven jobs: resizing an uploaded image, handling an API call, processing queue messages, running a nightly clean-up.",
          "It suits long-running or always-busy work less well; a container on Fargate (Day 22) or an EC2 server may then be cheaper and simpler.",
          "The example shows the shape of a Python Lambda function and calls it the way AWS would."
        ],
        "example": "A taxi instead of owning a car: it appears when called, you pay per trip, and a hundred taxis can come at once for a hundred people.",
        "code": "import json\n\ndef handler(event, context):\n    name = event.get(\"queryStringParameters\", {}).get(\"name\", \"world\")\n    return {\"statusCode\": 200, \"body\": json.dumps({\"message\": f\"Hello, {name}!\"})}\n\n# AWS calls handler(event, context) for every event; here we call it ourselves\nprint(handler({\"queryStringParameters\": {\"name\": \"Asha\"}}, None))\nprint(handler({}, None))",
        "output": "{'statusCode': 200, 'body': '{\"message\": \"Hello, Asha!\"}'}\n{'statusCode': 200, 'body': '{\"message\": \"Hello, world!\"}'}",
        "codeNotes": [
          {
            "line": 3,
            "note": "Every Python Lambda handler takes an event and a context."
          },
          {
            "line": 5,
            "note": "API Gateway expects a statusCode and a string body."
          }
        ],
        "tryIt": "Return a 400 status code with an error message when no name is given.",
        "check": {
          "question": "What is the longest a single Lambda invocation can run?",
          "options": [
            "1 minute",
            "15 minutes",
            "24 hours"
          ],
          "answer": 1,
          "why": "Lambda has a hard 15-minute timeout; longer jobs belong on containers or Step Functions."
        }
      },
      {
        "title": "How Lambda is priced",
        "say": [
          "Lambda charges for compute in gigabyte-seconds: the memory you configured, in GB, times how long each call runs, in seconds.",
          "A function with 512 MB (0.5 GB) that runs for 200 ms (0.2 s) uses 0.1 GB-seconds per call. A million such calls use 100,000 GB-seconds.",
          "The price for x86 functions in many Regions is about 0.0000166667 dollars per GB-second. There is also a request charge of 0.20 dollars per million calls.",
          "Practice 1 is lambda_cost(invocations, duration_ms, memory_mb): the compute cost plus the request cost, rounded to four decimal places.",
          "An important surprise: more memory also means more CPU, so a function can finish much faster. Doubling memory can halve the duration and cost the same, while users get answers twice as fast.",
          "Tools such as AWS Lambda Power Tuning run your function at several memory sizes and show the cheapest and fastest settings.",
          "The example prices a million calls at three memory sizes where the duration shrinks as memory grows."
        ],
        "example": "An electricity bill priced by how many appliances you run (memory) times for how long (duration), plus a small fee each time you switch something on.",
        "code": "def lambda_cost(invocations, duration_ms, memory_mb):\n    gb_seconds = invocations * (duration_ms / 1000) * (memory_mb / 1024)\n    return round(gb_seconds * 0.0000166667 + invocations / 1_000_000 * 0.20, 4)\n\nfor memory, duration in [(128, 1600), (512, 400), (1024, 210)]:\n    cost = lambda_cost(1_000_000, duration, memory)\n    print(f\"{memory:5} MB, {duration:5} ms -> ${cost:.4f}\")",
        "output": "  128 MB,  1600 ms -> $3.5333\n  512 MB,   400 ms -> $3.5333\n 1024 MB,   210 ms -> $3.7000",
        "codeNotes": [
          {
            "line": 2,
            "note": "Memory in GB times seconds, for every call."
          },
          {
            "line": 3,
            "note": "Compute cost plus the per-call fee."
          }
        ],
        "tryIt": "Try 2048 MB at 200 ms. Is it worth it compared with 1024 MB at 210 ms?",
        "check": {
          "question": "A function goes from 1,000 ms at 512 MB to 500 ms at 1,024 MB. What happens to compute cost?",
          "options": [
            "It doubles",
            "It stays about the same",
            "It halves"
          ],
          "answer": 1,
          "why": "GB-seconds are 0.5 x 1.0 = 0.5 and 1.0 x 0.5 = 0.5: the same cost, but twice as fast."
        }
      },
      {
        "title": "Cold starts and warm starts",
        "say": [
          "When Lambda has no ready copy of your function, it must create one: start a small secure environment, load the runtime, download your code and run your start-up code. This is a cold start.",
          "After that, the environment stays around for a while and handles further calls quickly. These are warm starts.",
          "Code outside the handler runs only once per environment. So put slow set-up there: creating database connections, loading configuration, building clients.",
          "Cold starts add latency, from under 100 ms for a small Python function to several seconds for large packages or Java without optimisation.",
          "Big dependencies make cold starts slower. Keep packages small, import only what you use, and avoid heavy work at start-up that is not needed for every call.",
          "The example simulates a function whose set-up runs once per environment and whose handler runs for every call.",
          "For most background work, cold starts do not matter. For user-facing APIs where every millisecond counts, you have options, covered next."
        ],
        "example": "Starting a car on a frosty morning takes a while; after that, every stop and start during the trip is quick.",
        "code": "environments = []\n\ndef new_environment():\n    env = {\"id\": len(environments) + 1, \"db\": \"connected\", \"calls\": 0}\n    environments.append(env)\n    return env\n\ndef invoke(env):\n    kind = \"cold\" if env[\"calls\"] == 0 else \"warm\"\n    env[\"calls\"] += 1\n    return f\"env {env['id']} call {env['calls']} ({kind})\"\n\ne1 = new_environment()\nfor _ in range(3): print(invoke(e1))\ne2 = new_environment()      # traffic grew: a second copy is needed\nprint(invoke(e2))",
        "output": "env 1 call 1 (cold)\nenv 1 call 2 (warm)\nenv 1 call 3 (warm)\nenv 2 call 1 (cold)",
        "codeNotes": [
          {
            "line": 4,
            "note": "Set-up like the database connection happens once per environment."
          },
          {
            "line": 9,
            "note": "Only the first call on each environment pays the cold start."
          }
        ],
        "tryIt": "If ten calls arrive at the same instant, how many cold starts will there be?",
        "check": {
          "question": "Where should you create a database connection in a Lambda function?",
          "options": [
            "Inside the handler, for every call",
            "Outside the handler, so warm calls reuse it",
            "In a separate Lambda"
          ],
          "answer": 1,
          "why": "Code outside the handler runs once per environment and is reused by warm invocations."
        }
      },
      {
        "title": "Concurrency",
        "say": [
          "Concurrency is how many copies of your function run at the same moment. It roughly equals calls per second times average duration in seconds.",
          "For example, 500 calls per second that each take 0.2 seconds need about 100 concurrent environments.",
          "Each account has a regional concurrency limit, 1,000 by default, shared by all functions. One runaway function could use it all and starve the others.",
          "Reserved concurrency sets aside a number for one function and also caps it. It is a good safety valve, for example to stop a function from opening more database connections than the database allows.",
          "When a function hits its limit, extra synchronous calls are throttled with an error, and queued events are retried later.",
          "The example estimates concurrency for a few workloads and flags any that would hit a limit.",
          "Remember the database lesson: a thousand concurrent Lambdas each opening a connection can overwhelm a database. RDS Proxy (Day 14) exists to pool those connections."
        ],
        "example": "A call centre: the number of agents busy at once equals calls per minute times minutes per call. If you have fewer agents, callers wait on hold.",
        "code": "LIMIT = 1000\nworkloads = {\n    \"api\": (500, 0.2),\n    \"thumbnails\": (40, 3.0),\n    \"black-friday api\": (6000, 0.2),\n}\nfor name, (per_second, seconds) in workloads.items():\n    needed = per_second * seconds\n    flag = \"THROTTLED\" if needed > LIMIT else \"ok\"\n    print(f\"{name:17} needs {needed:6.0f} concurrent  {flag}\")",
        "output": "api               needs    100 concurrent  ok\nthumbnails        needs    120 concurrent  ok\nblack-friday api  needs   1200 concurrent  THROTTLED",
        "codeNotes": [
          {
            "line": 8,
            "note": "Little's law: concurrency = arrival rate x time in the system."
          }
        ],
        "tryIt": "How could you bring the Black Friday API under the limit? Think about duration.",
        "check": {
          "question": "500 calls per second, each taking 2 seconds. Roughly how many concurrent executions?",
          "options": [
            "250",
            "500",
            "1,000"
          ],
          "answer": 2,
          "why": "500 x 2 = 1,000 concurrent executions."
        }
      },
      {
        "title": "Fighting cold starts: SnapStart and provisioned concurrency",
        "say": [
          "When cold starts hurt users, Lambda offers two main tools.",
          "SnapStart takes a snapshot of an initialised environment and restores from it, which cuts start-up time a lot. It is available for Java, Python and .NET functions and costs little.",
          "Provisioned concurrency keeps a chosen number of environments initialised and ready all the time. Calls up to that number never see a cold start, but you pay for those environments even when idle.",
          "So choose by how critical latency is and how bad the cold start is. Background work: plain on-demand. A user-facing API with a medium cold start: SnapStart. A payment API with a slow start and strict latency targets: provisioned concurrency.",
          "Practice 2 is concurrency_model(cold_start_ms, latency_critical). Not critical: \"ON_DEMAND\". Critical and over 200 ms: \"PROVISIONED\". Critical and over 100 ms: \"SNAPSTART\". Otherwise \"ON_DEMAND\".",
          "Check \"not critical\" first, then the larger threshold, then the smaller one, the same ordering idea as on Day 9.",
          "The example decides for a handful of functions."
        ],
        "example": "Keeping a few taxis waiting outside a busy hotel: guests never wait, but the hotel pays the drivers to wait.",
        "code": "def concurrency_model(cold_start_ms, latency_critical):\n    if not latency_critical:\n        return \"ON_DEMAND\"\n    if cold_start_ms > 200:\n        return \"PROVISIONED\"\n    if cold_start_ms > 100:\n        return \"SNAPSTART\"\n    return \"ON_DEMAND\"\n\nfor fn, cold, critical in [(\"nightly-report\", 2500, False), (\"checkout\", 900, True),\n                           (\"search\", 150, True), (\"health\", 60, True)]:\n    print(f\"{fn:15} -> {concurrency_model(cold, critical)}\")",
        "output": "nightly-report  -> ON_DEMAND\ncheckout        -> PROVISIONED\nsearch          -> SNAPSTART\nhealth          -> ON_DEMAND",
        "codeNotes": [
          {
            "line": 2,
            "note": "Background work never needs to pay for warm environments."
          },
          {
            "line": 4,
            "note": "The larger threshold is checked first."
          }
        ],
        "tryIt": "What is the monthly cost of keeping 10 environments of 1 GB provisioned, at about 0.0000041667 dollars per GB-second? Work it out.",
        "check": {
          "question": "Which option removes cold starts for a fixed number of concurrent calls, at a steady cost?",
          "options": [
            "On-demand",
            "Provisioned concurrency",
            "A bigger timeout"
          ],
          "answer": 1,
          "why": "Provisioned concurrency keeps environments initialised and billed whether or not they are used."
        }
      },
      {
        "title": "Practice time: cost and cold starts",
        "say": [
          "Practice 1: lambda_cost(invocations, duration_ms, memory_mb). Convert milliseconds to seconds (divide by 1000) and megabytes to gigabytes (divide by 1024).",
          "Then compute: GB-seconds times 0.0000166667, plus invocations divided by one million times 0.20. Round the total to 4 decimal places.",
          "Check with the numbers in the task: a million calls at 200 ms and 512 MB should cost 1.8667 dollars (1.6667 compute plus 0.20 for requests).",
          "A common mistake is dividing memory by 1000 instead of 1024. Lambda bills memory in binary gigabytes, and the checks expect 1024.",
          "Practice 2: concurrency_model(cold_start_ms, latency_critical). Four return paths, checked in the right order.",
          "After passing, use lambda_cost to decide whether a steady workload would be cheaper on a small container. That trade-off is a real architecture decision teams make.",
          "The example shows how the 1000 versus 1024 mistake changes the answer."
        ],
        "example": "Measuring flour in grams when the recipe is in ounces: close enough to look right, wrong enough to spoil the cake.",
        "code": "calls, ms, mb = 1_000_000, 200, 512\nright = calls * ms / 1000 * mb / 1024 * 0.0000166667 + calls / 1e6 * 0.20\nwrong = calls * ms / 1000 * mb / 1000 * 0.0000166667 + calls / 1e6 * 0.20\nprint(\"MB / 1024:\", round(right, 4))\nprint(\"MB / 1000:\", round(wrong, 4))",
        "output": "MB / 1024: 1.8667\nMB / 1000: 1.9067",
        "codeNotes": [
          {
            "line": 2,
            "note": "Lambda counts 1024 MB per GB."
          }
        ],
        "tryIt": "Work out the difference over a year of this traffic every day.",
        "check": {
          "question": "What does a Lambda bill charge for besides compute?",
          "options": [
            "Nothing",
            "A fee per million requests",
            "A fee per line of code"
          ],
          "answer": 1,
          "why": "Lambda adds a small per-request charge (0.20 dollars per million) to the GB-second compute cost."
        }
      }
    ],
    "summary": [
      "Lambda runs your function per event, scales automatically, and bills by GB-seconds plus requests.",
      "More memory also gives more CPU; the fastest setting can cost the same or less.",
      "Cold starts happen when a new environment starts; do set-up outside the handler.",
      "Concurrency is about calls per second times duration; watch account limits and database connections.",
      "Use SnapStart or provisioned concurrency only where latency truly matters."
    ],
    "projectStep": {
      "title": "Serverless function for your app",
      "steps": [
        "Write one Lambda handler for a task in your app and call it with test events.",
        "Estimate its monthly cost at three memory sizes with lambda_cost.",
        "Estimate peak concurrency and decide whether it needs SnapStart or provisioned concurrency."
      ]
    }
  },
  {
    "day": 12,
    "title": "Amazon API Gateway V2 HTTP & Lambda Authorizers",
    "goal": "You can explain what API Gateway adds in front of Lambda, compare HTTP and REST APIs, write a Lambda authorizer response, apply throttling limits, and return correct CORS headers for browser apps.",
    "minutes": 30,
    "recap": "Yesterday you wrote Lambda functions. To call them from a website or phone app, you need a public HTTP front door with security and limits. That is Amazon API Gateway.",
    "parts": [
      {
        "title": "API Gateway in front of Lambda",
        "say": [
          "Amazon API Gateway is a managed front door for APIs. It receives HTTPS calls from the internet, checks them, and forwards them to a backend such as a Lambda function.",
          "It handles the boring but essential parts: TLS certificates, custom domain names, authentication, throttling, request validation, and access logs.",
          "Routes map a method and path to a backend, for example GET /orders to the list-orders function and POST /orders to the create-order function.",
          "Path parameters capture parts of the URL: GET /orders/{id} passes the id to your function in the event.",
          "API Gateway converts the HTTP call into a JSON event for Lambda, and turns the function's returned dictionary (statusCode, headers, body) back into an HTTP response.",
          "The example routes a few calls with a dictionary of routes and a simple path-parameter match.",
          "This pairing of API Gateway and Lambda is the classic serverless API: no servers to patch, and cost that scales down to nearly zero when nobody is calling."
        ],
        "example": "A hotel reception desk: guests never walk straight into the kitchen; reception checks who they are and passes the order to the right staff.",
        "code": "routes = {(\"GET\", \"/orders\"): \"list_orders\", (\"POST\", \"/orders\"): \"create_order\",\n          (\"GET\", \"/orders/{id}\"): \"get_order\"}\n\ndef match(method, path):\n    for (m, pattern), fn in routes.items():\n        p_parts, parts = pattern.split(\"/\"), path.split(\"/\")\n        if m != method or len(p_parts) != len(parts):\n            continue\n        params = {p[1:-1]: v for p, v in zip(p_parts, parts) if p.startswith(\"{\")}\n        if all(p == v or p.startswith(\"{\") for p, v in zip(p_parts, parts)):\n            return fn, params\n    return \"404\", {}\n\nfor call in [(\"GET\", \"/orders\"), (\"GET\", \"/orders/981\"), (\"DELETE\", \"/orders/981\")]:\n    print(call, \"->\", match(*call))",
        "output": "('GET', '/orders') -> ('list_orders', {})\n('GET', '/orders/981') -> ('get_order', {'id': '981'})\n('DELETE', '/orders/981') -> ('404', {})",
        "codeNotes": [
          {
            "line": 9,
            "note": "Segments in braces become path parameters."
          },
          {
            "line": 10,
            "note": "Other segments must match exactly."
          }
        ],
        "tryIt": "Add a route DELETE /orders/{id} to \"cancel_order\" and test it.",
        "check": {
          "question": "What does API Gateway do with the dictionary a Lambda function returns?",
          "options": [
            "Ignores it",
            "Turns statusCode, headers and body into the HTTP response",
            "Saves it to S3"
          ],
          "answer": 1,
          "why": "The proxy integration maps the returned dict to an HTTP response."
        }
      },
      {
        "title": "HTTP APIs and REST APIs",
        "say": [
          "API Gateway has two main flavours for normal web APIs, and people often mix them up.",
          "HTTP APIs (sometimes called API Gateway v2) are the newer, simpler, faster and cheaper option, around 70 percent cheaper per million calls. They support JWT authorizers, Lambda authorizers and CORS out of the box.",
          "REST APIs are the older, feature-rich option. They add API keys with usage plans, request validation, caching and some advanced transformations.",
          "Choose an HTTP API by default. Choose a REST API only when you need one of its extra features, such as selling API access with usage plans.",
          "There is also a WebSocket API type for two-way, real-time connections such as chat, which you might meet in a later project.",
          "The example compares monthly costs for both types at a few traffic levels, using rounded example prices of about 1.00 and 3.50 dollars per million calls.",
          "At small scale the difference is small; at hundreds of millions of calls a month it becomes a real line on the bill."
        ],
        "example": "Two phone plans from the same company: a cheaper basic plan that covers most people, and a premium plan with extras only some people need.",
        "code": "PRICE_PER_MILLION = {\"HTTP API\": 1.00, \"REST API\": 3.50}\nfor monthly_calls in [1_000_000, 50_000_000, 500_000_000]:\n    row = [f\"{name}: ${monthly_calls / 1e6 * price:9,.2f}\" for name, price in PRICE_PER_MILLION.items()]\n    print(f\"{monthly_calls:>12,} calls  \" + \"   \".join(row))",
        "output": "   1,000,000 calls  HTTP API: $     1.00   REST API: $     3.50\n  50,000,000 calls  HTTP API: $    50.00   REST API: $   175.00\n 500,000,000 calls  HTTP API: $   500.00   REST API: $ 1,750.00",
        "codeNotes": [
          {
            "line": 3,
            "note": "Calls divided by a million, times the price per million."
          }
        ],
        "tryIt": "At what monthly call count does the REST API cost 1,000 dollars more than the HTTP API?",
        "check": {
          "question": "You need a simple, cheap JSON API with JWT login. Which type fits?",
          "options": [
            "REST API",
            "HTTP API",
            "WebSocket API"
          ],
          "answer": 1,
          "why": "HTTP APIs are cheaper and support JWT authorizers directly."
        }
      },
      {
        "title": "Lambda authorizers",
        "say": [
          "Before a call reaches your function, API Gateway can ask an authorizer: is this caller allowed?",
          "A JWT authorizer checks standard tokens from providers such as Amazon Cognito, Auth0 or Google, with no code at all.",
          "A Lambda authorizer is your own function. It receives the token or headers and returns an IAM policy that says Allow or Deny for execute-api:Invoke on the requested route.",
          "The response has a principalId (who the caller is) and a policyDocument with Version \"2012-10-17\" and one statement. API Gateway can cache the result for a few minutes so the authorizer does not run on every call.",
          "Practice 1 is authorizer_response(principal_id, effect, resource_arn). Build that exact nested dictionary, and raise ValueError for any effect other than \"Allow\" or \"Deny\".",
          "Refusing unknown values is important in security code. A typo such as \"allow\" in lowercase must fail loudly, never quietly grant or deny.",
          "The example checks a token against a tiny user table and builds the response."
        ],
        "example": "A doorman who checks your invitation and hands the door staff a note saying \"let this person into rooms A and B\".",
        "code": "TOKENS = {\"tok-asha\": \"user_101\", \"tok-ravi\": \"user_102\"}\n\ndef authorizer_response(principal_id, effect, resource_arn):\n    if effect not in (\"Allow\", \"Deny\"):\n        raise ValueError(\"effect must be Allow or Deny\")\n    return {\"principalId\": principal_id, \"policyDocument\": {\"Version\": \"2012-10-17\",\n            \"Statement\": [{\"Action\": \"execute-api:Invoke\", \"Effect\": effect, \"Resource\": resource_arn}]}}\n\narn = \"arn:aws:execute-api:us-east-1:111122223333:abc123/prod/GET/orders\"\nfor token in [\"tok-asha\", \"tok-stolen\"]:\n    user = TOKENS.get(token)\n    resp = authorizer_response(user or \"anonymous\", \"Allow\" if user else \"Deny\", arn)\n    print(token, \"->\", resp[\"principalId\"], resp[\"policyDocument\"][\"Statement\"][0][\"Effect\"])",
        "output": "tok-asha -> user_101 Allow\ntok-stolen -> anonymous Deny",
        "codeNotes": [
          {
            "line": 4,
            "note": "Reject anything that is not exactly Allow or Deny."
          },
          {
            "line": 7,
            "note": "The policy grants or denies invoking this one route."
          }
        ],
        "tryIt": "Call authorizer_response with \"allow\" in lowercase inside a try/except and print the error.",
        "check": {
          "question": "What does a Lambda authorizer return?",
          "options": [
            "An HTML login page",
            "A principal id and an IAM policy allowing or denying the call",
            "The database row for the user"
          ],
          "answer": 1,
          "why": "API Gateway enforces the returned policy before calling your backend."
        }
      },
      {
        "title": "Throttling and usage limits",
        "say": [
          "A public API must protect itself from floods, whether from a bug in a client, a popular launch, or an attacker.",
          "API Gateway throttles with a token bucket. The rate is how many calls per second are allowed on average; the burst is how many can arrive at once.",
          "Imagine a bucket that holds up to \"burst\" tokens and refills at \"rate\" tokens per second. Each call takes one token. With no tokens left, the call gets HTTP 429 Too Many Requests.",
          "Default account limits are generous (thousands of calls per second), but you should set lower limits per route or per client that match what your backend can really handle.",
          "Clients that receive 429 should retry with exponential backoff and jitter, as you learned for distributed systems: wait a little, then longer, with some randomness.",
          "The example runs a token bucket over one second of traffic arriving in bursts.",
          "Throttling at the gateway is cheap. Letting the flood through to Lambda and the database is expensive and can take everything down."
        ],
        "example": "A turnstile at a stadium that lets people through at a steady pace, with a small waiting area for bursts; when that area is full, new arrivals must wait outside.",
        "code": "def run_bucket(arrivals, rate, burst):\n    tokens, results = burst, []\n    for tick, count in enumerate(arrivals):\n        tokens = min(burst, tokens + (rate if tick else 0))\n        allowed = min(tokens, count)\n        tokens -= allowed\n        results.append((count, allowed, count - allowed))\n    return results\n\nfor sent, ok, rejected in run_bucket([8, 3, 0, 12, 5], rate=4, burst=10):\n    print(f\"sent {sent:2}  allowed {ok:2}  429s {rejected}\")",
        "output": "sent  8  allowed  8  429s 0\nsent  3  allowed  3  429s 0\nsent  0  allowed  0  429s 0\nsent 12  allowed 10  429s 2\nsent  5  allowed  4  429s 1",
        "codeNotes": [
          {
            "line": 4,
            "note": "Each tick refills rate tokens, never above the burst size."
          },
          {
            "line": 6,
            "note": "Every allowed call spends one token."
          }
        ],
        "tryIt": "Double the burst to 20. How many 429s are left?",
        "check": {
          "question": "What HTTP status tells a client it is being throttled?",
          "options": [
            "404",
            "429",
            "500"
          ],
          "answer": 1,
          "why": "429 Too Many Requests means slow down and retry later."
        }
      },
      {
        "title": "CORS for browser apps",
        "say": [
          "Browsers enforce the same-origin policy: JavaScript on app.pinit.com may not read responses from api.pinit.com unless the API explicitly allows it.",
          "Cross-Origin Resource Sharing (CORS) is how the API says \"this other origin is allowed\". It does that with response headers.",
          "Access-Control-Allow-Origin names the allowed origin. Access-Control-Allow-Methods and Access-Control-Allow-Headers list what the browser may send. Vary: Origin tells caches the answer depends on the caller's origin.",
          "For non-simple calls, such as a POST with JSON and an Authorization header, the browser first sends a \"preflight\" OPTIONS call to ask permission.",
          "Never answer with Access-Control-Allow-Origin: * on an API that uses cookies or login tokens. Keep an allow-list and echo back only origins on it.",
          "Practice 2 is cors_headers(origin, allowed_origins): return the four headers for an allowed origin, and an empty dictionary for anyone else.",
          "The example shows the allow-list in action for a real origin and an attacker's origin."
        ],
        "example": "A club that only admits guests from partner venues: the bouncer checks which venue sent you before letting you read the menu.",
        "code": "ALLOWED = [\"https://app.pinit.com\", \"https://admin.pinit.com\"]\n\ndef cors_headers(origin, allowed_origins):\n    if origin not in allowed_origins:\n        return {}\n    return {\"Access-Control-Allow-Origin\": origin,\n            \"Access-Control-Allow-Methods\": \"GET,POST,OPTIONS\",\n            \"Access-Control-Allow-Headers\": \"Content-Type,Authorization\",\n            \"Vary\": \"Origin\"}\n\nprint(cors_headers(\"https://app.pinit.com\", ALLOWED))\nprint(cors_headers(\"https://evil.example\", ALLOWED))",
        "output": "{'Access-Control-Allow-Origin': 'https://app.pinit.com', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization', 'Vary': 'Origin'}\n{}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Unknown origins get no CORS headers, so the browser blocks them."
          },
          {
            "line": 9,
            "note": "Vary: Origin stops a cache serving one origin's answer to another."
          }
        ],
        "tryIt": "Add \"http://localhost:3000\" for local development. Should it be allowed in production?",
        "check": {
          "question": "Why is Access-Control-Allow-Origin: * risky on a logged-in API?",
          "options": [
            "It is slower",
            "Any website could make calls using the visitor's login",
            "Browsers ignore it"
          ],
          "answer": 1,
          "why": "A wildcard lets any origin read responses; logged-in APIs should allow-list trusted origins."
        }
      },
      {
        "title": "Practice time: authorize and share",
        "say": [
          "Practice 1: authorizer_response(principal_id, effect, resource_arn). Check the effect first and raise ValueError for anything but \"Allow\" or \"Deny\".",
          "Then return the exact structure: principalId at the top, and policyDocument with Version and a Statement list holding one dictionary with Action, Effect and Resource.",
          "Spelling matters. API Gateway will reject a response that says \"PolicyDocument\" or \"principalID\". Copy the key names carefully.",
          "Practice 2: cors_headers(origin, allowed_origins). One membership test, then either an empty dictionary or the four headers.",
          "Include Vary: Origin. Without it, a CDN might cache the headers for one origin and serve them to another, which either breaks your app or opens it up.",
          "Both tasks are pure functions: same input, same output, no network. That makes them easy to unit-test before you deploy, which is exactly what the checks do.",
          "The example shows a small test table for cors_headers, the way you would write it in a real test file."
        ],
        "example": "Rehearsing lines before opening night: cheap to fix a mistake in rehearsal, embarrassing on stage.",
        "code": "ALLOWED = [\"https://app.pinit.com\"]\ndef cors_headers(origin, allowed):\n    return {\"Access-Control-Allow-Origin\": origin, \"Vary\": \"Origin\"} if origin in allowed else {}\n\ncases = [(\"https://app.pinit.com\", True), (\"https://app.pinit.com.evil.io\", False), (\"\", False)]\nfor origin, should_allow in cases:\n    got = bool(cors_headers(origin, ALLOWED))\n    print(f\"{origin or '(none)':30} expected {should_allow!s:5} got {got!s:5}\", \"ok\" if got == should_allow else \"FAIL\")",
        "output": "https://app.pinit.com          expected True  got True  ok\nhttps://app.pinit.com.evil.io  expected False got False ok\n(none)                         expected False got False ok",
        "codeNotes": [
          {
            "line": 5,
            "note": "A look-alike domain must not be allowed."
          },
          {
            "line": 7,
            "note": "An empty dict is falsy, so bool() tells us if headers were given."
          }
        ],
        "tryIt": "Why would a check like origin.startswith(\"https://app.pinit.com\") be dangerous? Test it on the look-alike.",
        "check": {
          "question": "Which key name is correct in an authorizer response?",
          "options": [
            "PolicyDocument",
            "policyDocument",
            "policy_document"
          ],
          "answer": 1,
          "why": "API Gateway expects the exact camelCase keys principalId and policyDocument."
        }
      }
    ],
    "summary": [
      "API Gateway is the managed HTTPS front door for APIs, routing methods and paths to backends like Lambda.",
      "Prefer HTTP APIs; choose REST APIs only for their extra features.",
      "Lambda authorizers return a principalId and an IAM policy for execute-api:Invoke.",
      "Throttling uses a token bucket with a rate and a burst; clients get 429 and should back off.",
      "CORS allows specific browser origins with response headers; never use * on logged-in APIs."
    ],
    "projectStep": {
      "title": "Public API for your app",
      "steps": [
        "List your API routes as method and path pairs and match sample calls to them.",
        "Write an authorizer that checks a token table and returns the right policy.",
        "Choose rate and burst limits and test them with the token bucket."
      ]
    }
  },
  {
    "day": 13,
    "title": "Amazon DynamoDB Partition Keys & Global Secondary Indexes (GSI)",
    "goal": "You can explain how DynamoDB stores items by partition and sort key, design keys from access patterns, spot hot partitions, use global secondary indexes, and calculate read capacity units.",
    "minutes": 30,
    "recap": "Your API can now receive calls. It needs a database that scales as easily as Lambda does. DynamoDB is AWS's serverless NoSQL database built for exactly that.",
    "parts": [
      {
        "title": "Tables, items and keys",
        "say": [
          "Amazon DynamoDB is a fully managed key-value and document database. There are no servers to size; tables scale to millions of calls per second with single-digit millisecond latency.",
          "A table holds items (like rows). Each item is a set of attributes (like columns), and different items may have different attributes.",
          "Every table has a primary key. A simple key is just a partition key, such as user_id. A composite key adds a sort key, such as order_date, so one partition can hold many sorted items.",
          "DynamoDB hashes the partition key to decide which physical partition stores the item. Items with the same partition key live together, sorted by sort key.",
          "Reads are fastest when you know the partition key: GetItem fetches one item, Query fetches items of one partition, optionally a sort-key range such as \"orders in September\".",
          "A Scan reads the whole table. It is slow and costly on large tables, so a good design avoids scans for everyday calls.",
          "The example models a table with a composite key and runs a Query for one user's September orders."
        ],
        "example": "A filing cabinet with one drawer per customer (partition key) and folders inside sorted by date (sort key). Finding a customer's recent folders is instant; searching every drawer is slow.",
        "code": "table = {\n    \"user#1\": [(\"2026-08-30\", \"ord-7\"), (\"2026-09-02\", \"ord-9\"), (\"2026-09-20\", \"ord-12\")],\n    \"user#2\": [(\"2026-09-05\", \"ord-10\")],\n}\n\ndef query(pk, start, end):\n    return [order for date, order in table.get(pk, []) if start <= date <= end]\n\nprint(\"user#1 September:\", query(\"user#1\", \"2026-09-01\", \"2026-09-30\"))\nprint(\"Scan (every item):\", [o for items in table.values() for _, o in items])",
        "output": "user#1 September: ['ord-9', 'ord-12']\nScan (every item): ['ord-7', 'ord-9', 'ord-12', 'ord-10']",
        "codeNotes": [
          {
            "line": 2,
            "note": "Items in one partition are kept sorted by the sort key."
          },
          {
            "line": 7,
            "note": "A query touches only one partition and a range of sort keys."
          }
        ],
        "tryIt": "Add orders for user#3 and query them. Which partitions did the query touch?",
        "check": {
          "question": "Why should everyday reads avoid Scan?",
          "options": [
            "Scan is not allowed in production",
            "Scan reads the whole table, which is slow and expensive at scale",
            "Scan only works on numbers"
          ],
          "answer": 1,
          "why": "Query and GetItem touch only the needed partition; Scan touches everything."
        }
      },
      {
        "title": "Designing keys from access patterns",
        "say": [
          "In SQL databases you design tables first and write queries later. In DynamoDB you do the opposite: list your access patterns first, then design keys that serve them.",
          "An access pattern is a sentence such as \"get a user's profile\", \"list a user's orders newest first\", \"get an order by id\".",
          "Good partition keys have many distinct values that are used fairly evenly, such as user ids or device ids. Bad ones have few values, such as \"status\" with only three options.",
          "Composite sort keys can encode several things, for example \"ORDER#2026-09-20#ord-12\", so one Query with a begins_with condition answers \"all of this user's orders\".",
          "Advanced designs even store several entity types in one table (single-table design), using prefixes like USER# and ORDER# in the keys.",
          "The example scores candidate partition keys by how many distinct values they have and how evenly traffic spreads over them.",
          "If you cannot name your access patterns yet, DynamoDB may not be the right first choice; a relational database is more forgiving of new questions."
        ],
        "example": "Organising a library by the way people actually ask for books, rather than by the colour of the covers.",
        "code": "from collections import Counter\n\ncalls = [{\"user\": f\"u{i % 50}\", \"country\": \"IN\" if i % 10 else \"US\", \"status\": \"PAID\" if i % 4 else \"NEW\"}\n         for i in range(1000)]\nfor key in [\"user\", \"country\", \"status\"]:\n    counts = Counter(c[key] for c in calls)\n    top_share = counts.most_common(1)[0][1] / len(calls)\n    print(f\"{key:8} distinct {len(counts):3}  busiest value gets {top_share:.0%} of traffic\")",
        "output": "user     distinct  50  busiest value gets 2% of traffic\ncountry  distinct   2  busiest value gets 90% of traffic\nstatus   distinct   2  busiest value gets 75% of traffic",
        "codeNotes": [
          {
            "line": 6,
            "note": "How many calls each key value would receive."
          },
          {
            "line": 7,
            "note": "A high share for one value means a hot partition."
          }
        ],
        "tryIt": "Which key is the best partition key here, and why is \"country\" poor?",
        "check": {
          "question": "Which makes the best partition key for an orders table?",
          "options": [
            "order_status (NEW, PAID, SHIPPED)",
            "customer_id",
            "the current year"
          ],
          "answer": 1,
          "why": "Customer ids have many values used fairly evenly, so load spreads across partitions."
        }
      },
      {
        "title": "Hot partitions",
        "say": [
          "Each physical partition has limits on reads and writes per second. If one partition key gets a huge share of the traffic, that partition throttles while others sit idle. This is a hot partition.",
          "Classic causes: a celebrity's profile, a single \"global counter\" item, or a date-based key where all of today's writes hit one value.",
          "DynamoDB has adaptive capacity that moves capacity towards busy partitions, but it cannot beat the per-partition ceiling for one single key.",
          "Fixes include write sharding (adding a random or calculated suffix such as counter#0 to counter#9, and summing on read) and caching hot reads with DynamoDB Accelerator (DAX) or ElastiCache.",
          "Practice 1 is hot_keys(access_log, share=0.5). Count reads per key with collections.Counter and return the sorted keys whose share of all reads is MORE than the limit.",
          "Use a strict \"greater than\". Exactly half is not more than half, and the checks test that edge.",
          "The example finds a hot key in a log and shows how sharding spreads it."
        ],
        "example": "A supermarket where everyone queues at the one till selling concert tickets, while the other tills are empty.",
        "code": "from collections import Counter\n\nlog = [\"celeb\"] * 70 + [f\"user{i}\" for i in range(30)]\ncounts = Counter(log)\nhot = sorted(k for k, n in counts.items() if n / len(log) > 0.5)\nprint(\"Hot keys:\", hot)\n\nsharded = [f\"celeb#{i % 10}\" if key == \"celeb\" else key for i, key in enumerate(log)]\nprint(\"Busiest after sharding:\", Counter(sharded).most_common(2))",
        "output": "Hot keys: ['celeb']\nBusiest after sharding: [('celeb#0', 7), ('celeb#1', 7)]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Strictly more than half of all reads."
          },
          {
            "line": 8,
            "note": "Suffixes spread one hot key over ten partition keys."
          }
        ],
        "tryIt": "With 10 shards, what share of all traffic does the busiest shard get now?",
        "check": {
          "question": "One item holds a global page-view counter and is throttled. What is a common fix?",
          "options": [
            "Make the item larger",
            "Shard the counter over several keys and add them up when reading",
            "Use Scan instead"
          ],
          "answer": 1,
          "why": "Write sharding spreads one hot key across many partitions."
        }
      },
      {
        "title": "Global secondary indexes",
        "say": [
          "Your primary key serves your main access pattern. What about others, such as \"find orders by status\" in a table keyed by customer?",
          "A global secondary index (GSI) is a second copy of chosen attributes, organised by a different partition key and optional sort key. You can Query the index just like a table.",
          "DynamoDB keeps GSIs updated automatically, a little behind the table (eventually consistent). Each write to the table may also cost writes to its indexes.",
          "A local secondary index (LSI) keeps the same partition key with a different sort key. It must be created with the table, so GSIs are far more common.",
          "Sparse indexes are a neat trick: only items that HAVE the index key attribute appear in the index. An attribute set only on \"open\" tickets gives you a small index of open tickets.",
          "The example builds a GSI by status from an orders table and queries it.",
          "Add indexes for real access patterns only; each one costs storage and write capacity."
        ],
        "example": "A book index at the back that lists topics with page numbers: a second way to find things without re-ordering the whole book.",
        "code": "orders = [\n    {\"customer\": \"c1\", \"order\": \"o1\", \"status\": \"SHIPPED\"},\n    {\"customer\": \"c1\", \"order\": \"o2\", \"status\": \"PENDING\"},\n    {\"customer\": \"c2\", \"order\": \"o3\", \"status\": \"PENDING\"},\n    {\"customer\": \"c3\", \"order\": \"o4\"},\n]\ngsi = {}\nfor item in orders:\n    if \"status\" in item:\n        gsi.setdefault(item[\"status\"], []).append(item[\"order\"])\nprint(\"Index by status:\", gsi)\nprint(\"Pending orders:\", gsi.get(\"PENDING\", []))",
        "output": "Index by status: {'SHIPPED': ['o1'], 'PENDING': ['o2', 'o3']}\nPending orders: ['o2', 'o3']",
        "codeNotes": [
          {
            "line": 9,
            "note": "Items without the key attribute stay out of the index: a sparse index."
          },
          {
            "line": 10,
            "note": "setdefault creates the list the first time a status appears."
          }
        ],
        "tryIt": "Build a second index keyed by customer that lists order ids. How does it compare with the table itself?",
        "check": {
          "question": "What is a global secondary index?",
          "options": [
            "A backup of the table",
            "A copy of items organised by a different key, which you can query",
            "A list of all tables"
          ],
          "answer": 1,
          "why": "GSIs let you query by keys other than the table's primary key."
        }
      },
      {
        "title": "Capacity: RCUs and WCUs",
        "say": [
          "DynamoDB has two billing modes. On-demand charges per call and needs no planning. Provisioned lets you set read and write capacity units, which is cheaper for steady, predictable traffic.",
          "One read capacity unit (RCU) is one strongly consistent read per second of an item up to 4 KB. Larger items use more units: ceil(size / 4 KB) per read.",
          "Eventually consistent reads, which may be a fraction of a second behind the latest write, cost half as much. They are the default and fine for most screens.",
          "One write capacity unit (WCU) is one write per second of an item up to 1 KB.",
          "Practice 2 is required_rcu(item_size_bytes, reads_per_sec, strongly_consistent). Compute the chunks with math.ceil(size / 4096), multiply by the read rate, halve for eventual consistency, and round up.",
          "Item size therefore matters. Storing big blobs such as images in DynamoDB is expensive; put them in S3 and store only the S3 key in the item.",
          "The example prices reads for a few item sizes and consistency choices."
        ],
        "example": "A lift with a weight limit per trip: small parcels go in one trip, a piano needs several.",
        "code": "import math\n\ndef required_rcu(size, per_sec, strong):\n    units = math.ceil(size / 4096) * per_sec\n    return math.ceil(units if strong else units / 2)\n\nfor size, per_sec, strong in [(1000, 100, True), (1000, 100, False), (9000, 100, True), (400_000, 10, False)]:\n    print(f\"{size:7} bytes x {per_sec} reads/s strong={strong!s:5} -> {required_rcu(size, per_sec, strong)} RCU\")",
        "output": "   1000 bytes x 100 reads/s strong=True  -> 100 RCU\n   1000 bytes x 100 reads/s strong=False -> 50 RCU\n   9000 bytes x 100 reads/s strong=True  -> 300 RCU\n 400000 bytes x 10 reads/s strong=False -> 490 RCU",
        "codeNotes": [
          {
            "line": 4,
            "note": "Each 4 KB chunk of the item costs one unit per read."
          },
          {
            "line": 5,
            "note": "Eventually consistent reads cost half, rounded up."
          }
        ],
        "tryIt": "How many WCUs do 50 writes per second of 2.5 KB items need? Write the formula.",
        "check": {
          "question": "An item is 9,000 bytes. How many RCUs does one strongly consistent read per second use?",
          "options": [
            "1",
            "2",
            "3"
          ],
          "answer": 2,
          "why": "9,000 / 4,096 is about 2.2, which rounds up to 3 chunks."
        }
      },
      {
        "title": "Practice time: hot keys and capacity",
        "say": [
          "Practice 1: hot_keys(access_log, share=0.5). Return [] for an empty log first, then count with Counter and keep keys where count / total > share, sorted.",
          "Sorting the result makes the output predictable, which is what the checks expect when several keys are hot.",
          "Practice 2: required_rcu(item_size_bytes, reads_per_sec, strongly_consistent). Chunks first with math.ceil, then multiply, then halve if eventually consistent, then math.ceil again.",
          "The second rounding matters: 3 eventually consistent reads of a small item need 1.5 units, and you cannot buy half a unit, so you need 2.",
          "Common slip: dividing by 4000 instead of 4096. DynamoDB uses binary kilobytes.",
          "These calculations are what you do on paper before choosing provisioned mode, and what alarms watch afterwards.",
          "The example shows the effect of the two roundings."
        ],
        "example": "Buying eggs by the box: 13 eggs means two boxes, and half a box is not for sale.",
        "code": "import math\nsize, per_sec = 1000, 3\nchunks = math.ceil(size / 4096)\nprint(\"chunks per read:\", chunks)\nprint(\"strong:\", chunks * per_sec)\nprint(\"eventual before rounding:\", chunks * per_sec / 2)\nprint(\"eventual RCU to provision:\", math.ceil(chunks * per_sec / 2))",
        "output": "chunks per read: 1\nstrong: 3\neventual before rounding: 1.5\neventual RCU to provision: 2",
        "codeNotes": [
          {
            "line": 3,
            "note": "A 1 KB item still uses one whole 4 KB chunk."
          }
        ],
        "tryIt": "Change per_sec to 4. Does the second rounding still change anything?",
        "check": {
          "question": "A log has 4 reads: a, a, b, b. With share 0.5, which keys are hot?",
          "options": [
            "a and b",
            "None",
            "Only a"
          ],
          "answer": 1,
          "why": "Each key has exactly half of the reads, and the rule is strictly more than half."
        }
      }
    ],
    "summary": [
      "DynamoDB stores items by partition key (and optional sort key); Query and GetItem are fast, Scan is costly.",
      "Design keys from access patterns; choose partition keys with many evenly used values.",
      "Hot partitions come from one key getting too much traffic; shard writes or cache reads.",
      "Global secondary indexes let you query by other keys; sparse indexes include only items with the key.",
      "RCU = ceil(size / 4 KB) per strong read per second; eventual reads cost half."
    ],
    "projectStep": {
      "title": "DynamoDB design for your app",
      "steps": [
        "Write down five access patterns for your app.",
        "Choose partition and sort keys (and any GSI) that serve them without scans.",
        "Estimate RCUs for your busiest read with required_rcu."
      ]
    }
  },
  {
    "day": 14,
    "title": "Amazon RDS Multi-AZ High Availability & Read Replicas",
    "goal": "You can explain what Amazon RDS manages for you, how Multi-AZ failover works, how read replicas scale reads, route queries between primary and replicas, and choose backups and connection pooling for a production database.",
    "minutes": 30,
    "recap": "Yesterday's DynamoDB is great for known access patterns. Many apps still need SQL: joins, transactions and flexible queries. Amazon RDS runs those relational databases for you.",
    "parts": [
      {
        "title": "Managed relational databases",
        "say": [
          "Amazon Relational Database Service (RDS) runs PostgreSQL, MySQL, MariaDB, Oracle and SQL Server for you. Amazon Aurora is AWS's own compatible engine with a distributed storage layer.",
          "RDS handles installation, operating system and database patching, automated backups, monitoring, and failover. You still design tables, write queries and tune indexes.",
          "That is PaaS from Day 1: you cannot log into the database server, but you are freed from most of the routine work that used to fill a database administrator's week.",
          "Put RDS in private subnets (Day 3) with a security group that only allows the app tier (Day 4). A database should never have a public address.",
          "Choose the instance size like EC2 (Day 7), and the storage type by how fast your disks must be. General purpose SSD suits most apps.",
          "The example compares running PostgreSQL yourself on EC2 with RDS as a list of jobs and who does them.",
          "Rule of thumb: use RDS or Aurora unless you truly need something they do not allow, such as a special extension or operating system access."
        ],
        "example": "Renting a fully serviced office instead of owning a building: someone else fixes the lifts and the heating while you run your business.",
        "code": "jobs = [\"install database\", \"patch OS\", \"patch database\", \"nightly backups\",\n        \"failover to standby\", \"design tables\", \"tune slow queries\"]\nrds_does = {\"install database\", \"patch OS\", \"patch database\", \"nightly backups\", \"failover to standby\"}\nfor job in jobs:\n    on_ec2 = \"you\"\n    on_rds = \"AWS\" if job in rds_does else \"you\"\n    print(f\"{job:20} EC2: {on_ec2:4} RDS: {on_rds}\")",
        "output": "install database     EC2: you  RDS: AWS\npatch OS             EC2: you  RDS: AWS\npatch database       EC2: you  RDS: AWS\nnightly backups      EC2: you  RDS: AWS\nfailover to standby  EC2: you  RDS: AWS\ndesign tables        EC2: you  RDS: you\ntune slow queries    EC2: you  RDS: you",
        "codeNotes": [
          {
            "line": 3,
            "note": "The chores RDS takes over."
          }
        ],
        "tryIt": "Which jobs stay yours even on RDS? Why can AWS not do them for you?",
        "check": {
          "question": "Where should an RDS database be placed?",
          "options": [
            "A public subnet with a public IP",
            "A private subnet reachable only from the app tier",
            "Outside any VPC"
          ],
          "answer": 1,
          "why": "Databases should never be exposed to the internet; keep them private and locked to the app."
        }
      },
      {
        "title": "Multi-AZ: a standby in another zone",
        "say": [
          "With Multi-AZ turned on, RDS keeps a standby copy of your database in a second Availability Zone and copies every write to it synchronously.",
          "Synchronous means a write is confirmed only after both copies have it. So if the primary fails, no confirmed data is lost.",
          "Your app connects to one DNS name, the endpoint. On failure, RDS promotes the standby and points the endpoint's DNS record (a CNAME) at it, usually within one or two minutes.",
          "Apps must reconnect after failover, so connection code should retry. Keeping DNS caching short helps apps find the new primary quickly.",
          "The classic standby is not used for reads; it just waits. Newer Multi-AZ cluster deployments add readable standbys, but the idea of a synchronous copy in another AZ is the same.",
          "Practice 1 is failover(cluster). If Multi-AZ is on and there is a standby, swap primary and standby in the dictionary and report the new primary; otherwise report failure and change nothing.",
          "The example simulates an AZ outage with and without Multi-AZ."
        ],
        "example": "A co-pilot who has followed every step of the flight and can take the controls the moment the pilot is unwell.",
        "code": "def failover(cluster):\n    if not cluster[\"multi_az\"] or not cluster[\"standby_az\"]:\n        return {\"success\": False, \"new_primary\": None}\n    cluster[\"primary_az\"], cluster[\"standby_az\"] = cluster[\"standby_az\"], cluster[\"primary_az\"]\n    return {\"success\": True, \"new_primary\": cluster[\"primary_az\"]}\n\nprod = {\"primary_az\": \"us-east-1a\", \"standby_az\": \"us-east-1b\", \"multi_az\": True}\ndev = {\"primary_az\": \"us-east-1a\", \"standby_az\": None, \"multi_az\": False}\nprint(\"prod:\", failover(prod), prod)\nprint(\"dev:\", failover(dev), dev)",
        "output": "prod: {'success': True, 'new_primary': 'us-east-1b'} {'primary_az': 'us-east-1b', 'standby_az': 'us-east-1a', 'multi_az': True}\ndev: {'success': False, 'new_primary': None} {'primary_az': 'us-east-1a', 'standby_az': None, 'multi_az': False}",
        "codeNotes": [
          {
            "line": 2,
            "note": "No Multi-AZ or no standby: nothing to fail over to."
          },
          {
            "line": 4,
            "note": "Tuple swap: the standby becomes primary and the old primary becomes the standby."
          }
        ],
        "tryIt": "Call failover(prod) a second time. Where is the primary now?",
        "check": {
          "question": "Why is Multi-AZ replication synchronous?",
          "options": [
            "To make writes faster",
            "So a confirmed write is never lost when the primary fails",
            "Because AZs are far apart"
          ],
          "answer": 1,
          "why": "Synchronous copying means the standby always has every confirmed write."
        }
      },
      {
        "title": "Read replicas: scaling reads",
        "say": [
          "Many apps read far more than they write: product pages, feeds and reports. Read replicas are extra copies that serve reads.",
          "Replication to read replicas is asynchronous. The primary confirms a write immediately and replicas catch up shortly after, usually within a second, sometimes longer under heavy load. That delay is called replica lag.",
          "Because of lag, a user who just saved something might not see it if their next read hits a replica. Read-your-own-writes screens should read from the primary.",
          "You can have several replicas, even in other Regions for global users or disaster recovery. A replica can be promoted to a standalone database if needed.",
          "Remember the difference: Multi-AZ is for availability (a standby that takes over), read replicas are for scaling reads (copies that serve traffic).",
          "The example shows replica lag: a write lands on the primary and a replica shows it only after the lag passes.",
          "Aurora makes replicas cheaper and faster because they share the same storage layer, but lag still exists."
        ],
        "example": "Photocopies of the menu at every table: diners read their own copy, and when the chef changes a dish, it takes a moment for new copies to reach every table.",
        "code": "primary = {\"price\": 100}\nreplica = {\"price\": 100}\npending = []\n\ndef write(key, value, now):\n    primary[key] = value\n    pending.append((now + 0.8, key, value))   # arrives on the replica 0.8 s later\n\ndef replica_read(key, now):\n    for arrive, k, v in [p for p in pending if p[0] <= now]:\n        replica[k] = v\n    return replica[key]\n\nwrite(\"price\", 120, now=10.0)\nfor t in [10.1, 10.5, 11.0]:\n    print(f\"t={t}: primary {primary['price']}, replica {replica_read('price', t)}\")",
        "output": "t=10.1: primary 120, replica 100\nt=10.5: primary 120, replica 100\nt=11.0: primary 120, replica 120",
        "codeNotes": [
          {
            "line": 7,
            "note": "Asynchronous: the replica gets the change a little later."
          },
          {
            "line": 10,
            "note": "Apply every change that has arrived by now."
          }
        ],
        "tryIt": "Change the lag to 3 seconds. At which time does the replica first show 120?",
        "check": {
          "question": "A user updates their profile and immediately reloads it. Where should that read go?",
          "options": [
            "Any read replica",
            "The primary, to avoid replica lag",
            "A backup snapshot"
          ],
          "answer": 1,
          "why": "Reads right after your own write should use the primary so they see the change."
        }
      },
      {
        "title": "Routing queries in the application",
        "say": [
          "RDS gives you separate endpoints: a writer endpoint for the primary and one per replica (Aurora adds a single reader endpoint that spreads over replicas).",
          "The application decides where each query goes. A simple rule: statements that change data go to the primary, SELECT statements go to replicas.",
          "Spread reads across replicas with round robin: replica number counter modulo the number of replicas, the same trick as the load balancer on Day 8.",
          "If there are no replicas, reads go to the primary. The app must never crash just because a replica was removed.",
          "Practice 2 is route_query(sql, primary, replicas, counter). Strip spaces and uppercase the start of the query before checking for SELECT, because SQL keywords are case-insensitive.",
          "Real apps also send reads inside transactions to the primary, and use the primary for read-after-write screens, but the basic rule covers most traffic.",
          "The example routes a stream of queries and counts where they went."
        ],
        "example": "A library with one librarian who handles new books and returns, and several assistants who help people find books to read.",
        "code": "from collections import Counter\n\ndef route_query(sql, primary, replicas, counter):\n    if sql.strip().upper().startswith(\"SELECT\") and replicas:\n        return replicas[counter % len(replicas)]\n    return primary\n\nqueries = [\"SELECT * FROM products\", \"  select name from users\", \"INSERT INTO carts VALUES (1)\",\n           \"SELECT 1\", \"UPDATE users SET name = 'A'\", \"SELECT count(*) FROM orders\"]\nwhere = Counter(route_query(q, \"writer\", [\"reader-1\", \"reader-2\"], i) for i, q in enumerate(queries))\nprint(dict(where))\nprint(\"no replicas ->\", route_query(\"SELECT 1\", \"writer\", [], 0))",
        "output": "{'reader-1': 1, 'reader-2': 3, 'writer': 2}\nno replicas -> writer",
        "codeNotes": [
          {
            "line": 4,
            "note": "strip() and upper() make the check work for any spacing and case."
          },
          {
            "line": 5,
            "note": "Round robin across the replicas."
          }
        ],
        "tryIt": "Add a query that starts with a comment, \"-- report\\nSELECT 1\". Where does it go? How could you handle it?",
        "check": {
          "question": "Which query must always go to the primary?",
          "options": [
            "SELECT name FROM products",
            "UPDATE orders SET status = 'PAID'",
            "select 1"
          ],
          "answer": 1,
          "why": "Only the primary accepts writes; replicas are read-only."
        }
      },
      {
        "title": "Backups, snapshots and connection pooling",
        "say": [
          "RDS takes automated daily backups and keeps transaction logs, so you can restore to any second within your retention period, up to 35 days. This is point-in-time recovery.",
          "Manual snapshots are kept until you delete them, which is useful before risky changes such as a big migration.",
          "A restore always creates a NEW database instance. You then point your app at it. Practise this before you need it; a backup you have never restored is only a hope.",
          "Connections are the other production concern. Each database connection uses memory, and databases have a maximum. Serverless apps with many Lambdas can open thousands.",
          "RDS Proxy sits between the app and the database and pools connections, so a thousand short-lived Lambdas share a small number of real database connections.",
          "The example checks whether a restore time is inside the retention window, and estimates connections with and without a proxy.",
          "Together, Multi-AZ, replicas, point-in-time recovery and pooling make a small database behave like a serious production system."
        ],
        "example": "A shared taxi rank for a busy station: instead of every traveller calling their own taxi, a few cabs shuttle everyone in turn.",
        "code": "retention_days = 7\nnow_day = 100\nfor restore_to in [99.5, 94, 90]:\n    ok = now_day - retention_days <= restore_to <= now_day\n    print(f\"restore to day {restore_to}: {'possible' if ok else 'too old'}\")\n\nlambdas, conns_each, db_max = 800, 1, 500\nprint(\"Direct connections:\", lambdas * conns_each, \"limit\", db_max)\nprint(\"Through RDS Proxy: about\", 50, \"pooled connections\")",
        "output": "restore to day 99.5: possible\nrestore to day 94: possible\nrestore to day 90: too old\nDirect connections: 800 limit 500\nThrough RDS Proxy: about 50 pooled connections",
        "codeNotes": [
          {
            "line": 4,
            "note": "Point-in-time recovery only reaches back as far as the retention period."
          }
        ],
        "tryIt": "Raise retention to 14 days. Which restore becomes possible?",
        "check": {
          "question": "What does RDS Proxy solve?",
          "options": [
            "Slow disks",
            "Too many database connections from many short-lived clients",
            "Missing backups"
          ],
          "answer": 1,
          "why": "The proxy pools connections so many clients share a few real database connections."
        }
      },
      {
        "title": "Practice time: fail over and route",
        "say": [
          "Practice 1: failover(cluster). Guard first: if multi_az is False or standby_az is empty, return failure without touching the dictionary.",
          "Then swap in one line with tuple assignment, and return success with the new primary. The checks confirm the dictionary itself changed, because real failover changes the cluster's state.",
          "Practice 2: route_query(sql, primary, replicas, counter). SELECT queries go to replicas[counter % len(replicas)] when replicas exist; everything else goes to the primary.",
          "Watch the empty replica list: counter % 0 would crash with ZeroDivisionError, so the \"and replicas\" test must come before you use the modulo.",
          "These two behaviours, failover and read routing, are what make database-backed apps both highly available and scalable.",
          "After passing, extend route_query with a force_primary flag for read-after-write screens.",
          "The example shows the ZeroDivisionError you avoid by checking the list first."
        ],
        "example": "Checking there is at least one open till before telling customers to pick a till at random.",
        "code": "replicas = []\ntry:\n    print(replicas[5 % len(replicas)])\nexcept ZeroDivisionError as err:\n    print(\"Crash:\", err)\nsafe = replicas[5 % len(replicas)] if replicas else \"primary\"\nprint(\"Safe choice:\", safe)",
        "output": "Crash: integer modulo by zero\nSafe choice: primary",
        "codeNotes": [
          {
            "line": 3,
            "note": "len([]) is 0, and anything modulo 0 raises an error."
          },
          {
            "line": 6,
            "note": "The conditional checks for replicas first."
          }
        ],
        "tryIt": "Add two replicas and rerun. Which one does counter 5 pick?",
        "check": {
          "question": "A Multi-AZ cluster fails over. What must the application do?",
          "options": [
            "Nothing ever",
            "Reconnect, ideally with retries, to the same endpoint",
            "Change its code to a new database name"
          ],
          "answer": 1,
          "why": "The endpoint name stays the same but moves; apps reconnect and retry."
        }
      }
    ],
    "summary": [
      "RDS runs relational databases and handles patching, backups and failover; you own schema and queries.",
      "Multi-AZ keeps a synchronous standby in another AZ and fails over by moving the endpoint.",
      "Read replicas scale reads asynchronously, with replica lag.",
      "Route writes to the primary and reads to replicas, falling back to the primary when there are none.",
      "Point-in-time recovery, tested restores and RDS Proxy make RDS production-ready."
    ],
    "projectStep": {
      "title": "Database plan for your app",
      "steps": [
        "Decide between DynamoDB and RDS for your app and write down why.",
        "Simulate a failover and route a day of queries between primary and replicas.",
        "Write a restore runbook: retention period, how to restore, how to repoint the app."
      ]
    }
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Serverless Event-Driven Video Processing Engine",
    "goal": "You can design and build an event-driven serverless pipeline: S3 upload events trigger Lambda, work is tracked in a database, failures are isolated, and every step is safe to retry.",
    "minutes": 30,
    "recap": "Milestone 2 combines S3 (Days 9-10), Lambda (Day 11), API Gateway (Day 12) and databases (Days 13-14) into one working system: a video-processing engine that runs itself.",
    "parts": [
      {
        "title": "The architecture",
        "say": [
          "Here is the goal. A user uploads a video. Without anyone pressing a button, the system transcodes it into a web-friendly format, records the result, and marks it ready to watch.",
          "Step one: the phone or browser gets a presigned URL from an API (API Gateway and Lambda) and uploads straight to a raw-videos S3 bucket.",
          "Step two: S3 sends an event notification when the upload completes. That event triggers a processing Lambda function.",
          "Step three: the function calls a transcoder (in real life AWS Elemental MediaConvert, or a container for long videos) and writes the output to a processed bucket.",
          "Step four: the function records the status (DONE or FAILED) and output location in DynamoDB, where the app can read it.",
          "This is event-driven architecture: components react to events instead of calling each other directly. Each piece can scale, fail and be replaced independently.",
          "The example prints the pipeline as a list of stages with the AWS service that runs each."
        ],
        "example": "A factory conveyor belt: each station reacts when an item arrives, does its one job, and passes it on. No manager has to shout instructions.",
        "code": "pipeline = [\n    (\"request upload URL\", \"API Gateway + Lambda\"),\n    (\"upload video\", \"S3 raw-videos bucket (presigned PUT)\"),\n    (\"upload finished event\", \"S3 event notification\"),\n    (\"transcode\", \"Lambda -> MediaConvert\"),\n    (\"save result\", \"S3 processed bucket + DynamoDB\"),\n]\nfor step, (what, service) in enumerate(pipeline, start=1):\n    print(f\"{step}. {what:22} {service}\")",
        "output": "1. request upload URL     API Gateway + Lambda\n2. upload video           S3 raw-videos bucket (presigned PUT)\n3. upload finished event  S3 event notification\n4. transcode              Lambda -> MediaConvert\n5. save result            S3 processed bucket + DynamoDB",
        "codeNotes": [
          {
            "line": 8,
            "note": "enumerate with start=1 numbers the steps from one."
          }
        ],
        "tryIt": "Add a step that sends the user a notification when the video is ready. Which service might do it (Day 19)?",
        "check": {
          "question": "What starts the processing Lambda in this design?",
          "options": [
            "A person clicking a button",
            "An S3 event when the upload completes",
            "A timer every hour"
          ],
          "answer": 1,
          "why": "The S3 event notification triggers the function automatically."
        }
      },
      {
        "title": "Reading S3 event records",
        "say": [
          "An S3 event arrives at Lambda as a dictionary with a Records list. Each record describes one object: its bucket, key, size and the event name, such as ObjectCreated:Put.",
          "One event can contain several records, so always loop over all of them. Code that reads only Records[0] silently skips files.",
          "Object keys in events are URL-encoded. A file called \"my holiday video.mp4\" arrives as \"my+holiday%20video.mp4\" depending on how it was uploaded. Decode it before using it as a key.",
          "Practice 2 is parse_s3_record(record): return the bucket, the decoded key and the size. For this course, turn every \"+\" and \"%20\" into a space.",
          "In production you would use urllib.parse.unquote_plus, which decodes every special character; our browser sandbox blocks that module, so we handle the two common cases by hand.",
          "The example parses a two-record event, one of them with a spaced file name.",
          "Always log the bucket and key you are processing. When something fails at 3 a.m., that line tells you which file to look at."
        ],
        "example": "Opening a delivery note that lists several parcels: you check every line, not just the first, and read each address carefully.",
        "code": "def parse_s3_record(record):\n    obj = record[\"s3\"][\"object\"]\n    return {\"bucket\": record[\"s3\"][\"bucket\"][\"name\"],\n            \"key\": obj[\"key\"].replace(\"+\", \" \").replace(\"%20\", \" \"),\n            \"size\": obj[\"size\"]}\n\nevent = {\"Records\": [\n    {\"eventName\": \"ObjectCreated:Put\", \"s3\": {\"bucket\": {\"name\": \"raw-videos\"}, \"object\": {\"key\": \"demo.mp4\", \"size\": 5242880}}},\n    {\"eventName\": \"ObjectCreated:Put\", \"s3\": {\"bucket\": {\"name\": \"raw-videos\"}, \"object\": {\"key\": \"my+holiday%20video.mp4\", \"size\": 7340032}}},\n]}\nfor r in event[\"Records\"]:\n    print(parse_s3_record(r))",
        "output": "{'bucket': 'raw-videos', 'key': 'demo.mp4', 'size': 5242880}\n{'bucket': 'raw-videos', 'key': 'my holiday video.mp4', 'size': 7340032}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Decode the URL-encoded spaces in the key."
          },
          {
            "line": 11,
            "note": "Loop over every record, never just the first."
          }
        ],
        "tryIt": "Add the size in MB (rounded to 1 decimal) to the output.",
        "check": {
          "question": "Why loop over event[\"Records\"] instead of reading Records[0]?",
          "options": [
            "Records[0] is always empty",
            "One event can hold several objects; the others would be skipped",
            "Looping is faster"
          ],
          "answer": 1,
          "why": "Every record is a separate file that needs processing."
        }
      },
      {
        "title": "Processing every record and isolating failures",
        "say": [
          "Practice 1 is process_upload(event, db, transcode). For each record, call transcode(bucket, key) and save the result in db under the key.",
          "If transcode raises an exception for one file, record that file as FAILED and carry on with the rest. One corrupt video must not block everyone else's uploads.",
          "This is failure isolation: a problem stays contained to the item that caused it.",
          "Return a summary with how many were processed and how many failed. Counts like these feed dashboards and alarms (Day 25).",
          "Passing transcode in as a parameter is called dependency injection. It lets the checks use a fake transcoder that fails on purpose, so you can test the error path without real videos.",
          "In real systems failed items also go to a dead-letter queue (Day 21) so someone can inspect and retry them.",
          "The example runs the pipeline over three uploads, one of which is corrupt."
        ],
        "example": "A post office sorting machine that sets aside a torn envelope in a separate tray and keeps sorting the rest.",
        "code": "def transcode(bucket, key):\n    if key.endswith(\".bad\"):\n        raise RuntimeError(\"corrupt file\")\n    return f\"s3://processed-videos/{key.rsplit('.', 1)[0]}.m3u8\"\n\ndef process_upload(event, db, transcode):\n    done = failed = 0\n    for r in event[\"Records\"]:\n        bucket, key = r[\"s3\"][\"bucket\"][\"name\"], r[\"s3\"][\"object\"][\"key\"]\n        try:\n            db[key] = {\"status\": \"DONE\", \"output_url\": transcode(bucket, key)}\n            done += 1\n        except Exception:\n            db[key] = {\"status\": \"FAILED\", \"output_url\": None}\n            failed += 1\n    return {\"processed\": done, \"failed\": failed}\n\nrec = lambda k: {\"s3\": {\"bucket\": {\"name\": \"raw-videos\"}, \"object\": {\"key\": k}}}\ndb = {}\nprint(process_upload({\"Records\": [rec(\"a.mp4\"), rec(\"b.bad\"), rec(\"c.mp4\")]}, db, transcode))\nprint(db)",
        "output": "{'processed': 2, 'failed': 1}\n{'a.mp4': {'status': 'DONE', 'output_url': 's3://processed-videos/a.m3u8'}, 'b.bad': {'status': 'FAILED', 'output_url': None}, 'c.mp4': {'status': 'DONE', 'output_url': 's3://processed-videos/c.m3u8'}}",
        "codeNotes": [
          {
            "line": 10,
            "note": "try/except around each file keeps failures contained."
          },
          {
            "line": 18,
            "note": "A tiny helper to build test records."
          }
        ],
        "tryIt": "Make transcode fail for any key containing \"tmp\". Run it with a file called \"tmp-1.mp4\".",
        "check": {
          "question": "One of five uploaded files is corrupt. What should the pipeline do?",
          "options": [
            "Stop and process none",
            "Mark that file FAILED and process the other four",
            "Retry forever"
          ],
          "answer": 1,
          "why": "Isolating the failure keeps the rest of the work flowing."
        }
      },
      {
        "title": "Idempotency: safe to run twice",
        "say": [
          "AWS event delivery is \"at least once\". Occasionally the same S3 event, or the same queue message, is delivered twice. Lambda also retries failed asynchronous calls automatically.",
          "So every event handler must be idempotent: running it twice with the same input gives the same result as running it once, with no double work or double charges.",
          "For our pipeline, check the database first. If this key is already DONE, skip the expensive transcode and return the saved result.",
          "For stronger guarantees, use a DynamoDB conditional write that only succeeds if the item does not exist yet. Two parallel copies of the handler then cannot both claim the same job.",
          "Idempotency also makes manual retries safe. An engineer can re-send every event from a bad hour without fear of creating duplicates.",
          "The example sends the same event twice and counts how many times the costly transcode actually ran.",
          "Whenever you write an event handler, ask: what happens if this exact event arrives again tomorrow?"
        ],
        "example": "Pressing a lift button that is already lit: pressing again does not call a second lift.",
        "code": "db = {}\ntranscode_runs = 0\n\ndef handle(key):\n    global transcode_runs\n    if db.get(key, {}).get(\"status\") == \"DONE\":\n        return \"skipped (already done)\"\n    transcode_runs += 1\n    db[key] = {\"status\": \"DONE\"}\n    return \"transcoded\"\n\nfor delivery in [1, 2]:\n    print(\"delivery\", delivery, \"->\", handle(\"demo.mp4\"))\nprint(\"Expensive transcodes:\", transcode_runs)",
        "output": "delivery 1 -> transcoded\ndelivery 2 -> skipped (already done)\nExpensive transcodes: 1",
        "codeNotes": [
          {
            "line": 6,
            "note": "Check the saved state before doing expensive work."
          }
        ],
        "tryIt": "What would go wrong if a FAILED item were also skipped? When should a failed file be retried?",
        "check": {
          "question": "Why must event handlers be idempotent?",
          "options": [
            "AWS requires Python",
            "Events can be delivered more than once and retries happen",
            "It makes code shorter"
          ],
          "answer": 1,
          "why": "At-least-once delivery means duplicates happen; idempotency makes them harmless."
        }
      },
      {
        "title": "Long jobs, costs and limits",
        "say": [
          "Lambda's 15-minute limit matters for video. A short clip transcodes in seconds, but a two-hour film does not.",
          "The pattern is to let Lambda start the job and let a dedicated service do the heavy work: MediaConvert for video, or a Fargate container (Day 22), or AWS Batch.",
          "The service then emits an event when finished (via EventBridge, Day 20), and a second small Lambda records the result. No function waits around doing nothing.",
          "Watch the costs too: S3 storage for raw and processed copies, transcoding minutes, Lambda time, and data transfer when users watch. Lifecycle rules (Day 9) can move raw originals to cheaper classes after processing.",
          "Set limits deliberately. Reserved concurrency on the processing function stops a flood of uploads from overwhelming the transcoder or your budget.",
          "The example decides where each video should be processed from its length.",
          "Good serverless design is about putting each job where it fits best, not forcing everything into one service."
        ],
        "example": "A restaurant where the waiter takes the order and the kitchen cooks it; the waiter does not stand at the stove for an hour.",
        "code": "LAMBDA_LIMIT_MIN = 15\n\ndef plan(video_minutes, speed=4.0):\n    est = video_minutes / speed   # minutes of processing\n    where = \"Lambda\" if est < LAMBDA_LIMIT_MIN * 0.5 else \"MediaConvert job\"\n    return round(est, 1), where\n\nfor minutes in [0.5, 12, 45, 130]:\n    est, where = plan(minutes)\n    print(f\"{minutes:6} min video -> about {est:5} min to process on {where}\")",
        "output": "   0.5 min video -> about   0.1 min to process on Lambda\n    12 min video -> about   3.0 min to process on Lambda\n    45 min video -> about  11.2 min to process on MediaConvert job\n   130 min video -> about  32.5 min to process on MediaConvert job",
        "codeNotes": [
          {
            "line": 5,
            "note": "Leave a safety margin: use Lambda only well under its limit."
          }
        ],
        "tryIt": "Why use half the limit as the cut-off instead of the full 15 minutes?",
        "check": {
          "question": "A two-hour video needs about 40 minutes to transcode. Where should it run?",
          "options": [
            "A single Lambda call",
            "A dedicated service such as MediaConvert or a container",
            "API Gateway"
          ],
          "answer": 1,
          "why": "It exceeds Lambda's 15-minute limit, so a long-running service must do the work."
        }
      },
      {
        "title": "Milestone practice: build the engine",
        "say": [
          "Practice 1: process_upload(event, db, transcode). Loop over event.get(\"Records\", []), pull bucket and key from each record, and wrap the transcode call in try/except.",
          "Save exactly {\"bucket\", \"output_url\", \"status\"} for each key, with output_url None and status \"FAILED\" on errors. Return the two counts.",
          "Handle an event with no records gracefully: the result should be zero processed and zero failed, not a crash.",
          "Practice 2: parse_s3_record(record). Read three fields and decode the key's \"+\" and \"%20\" characters into spaces.",
          "Together they form the core of the engine. Extensions to try afterwards: skip keys already DONE (idempotency), ignore files that are not videos, and record the file size.",
          "Congratulations on Milestone 2. You have built the most common serverless pattern in industry: storage events driving functions that write to a database.",
          "The example runs a final end-to-end check of both functions together."
        ],
        "example": "A factory's final inspection before the product ships: every station is checked working together, not just on its own.",
        "code": "def parse(r):\n    return r[\"s3\"][\"bucket\"][\"name\"], r[\"s3\"][\"object\"][\"key\"].replace(\"+\", \" \").replace(\"%20\", \" \")\n\nevent = {\"Records\": [{\"s3\": {\"bucket\": {\"name\": \"raw\"}, \"object\": {\"key\": \"team+demo.mp4\", \"size\": 9}}},\n                    {\"s3\": {\"bucket\": {\"name\": \"raw\"}, \"object\": {\"key\": \"notes.txt\", \"size\": 1}}}]}\ndb = {}\nfor record in event[\"Records\"]:\n    bucket, key = parse(record)\n    if not key.endswith(\".mp4\"):\n        db[key] = {\"status\": \"SKIPPED\"}\n        continue\n    db[key] = {\"status\": \"DONE\", \"output_url\": f\"s3://processed/{key}\"}\nprint(db)",
        "output": "{'team demo.mp4': {'status': 'DONE', 'output_url': 's3://processed/team demo.mp4'}, 'notes.txt': {'status': 'SKIPPED'}}",
        "codeNotes": [
          {
            "line": 9,
            "note": "Only video files enter the pipeline."
          },
          {
            "line": 12,
            "note": "The decoded key keeps its spaces in the output."
          }
        ],
        "tryIt": "Add a check that skips files larger than 5 GB with the status \"TOO_LARGE\".",
        "check": {
          "question": "What is the core pattern you built today?",
          "options": [
            "A cron job on one server",
            "Storage events triggering functions that record results in a database",
            "A single large monolith"
          ],
          "answer": 1,
          "why": "S3 events, Lambda processing and a status table is the classic serverless pipeline."
        }
      }
    ],
    "summary": [
      "Event-driven pipelines react to events: S3 uploads trigger Lambda, which records results.",
      "Loop over every record in an event and decode URL-encoded keys.",
      "Isolate failures per item so one bad file does not block the rest.",
      "Make handlers idempotent because events can arrive more than once.",
      "Hand long jobs to dedicated services; Lambda has a 15-minute limit."
    ],
    "projectStep": {
      "title": "Milestone 2: serverless media pipeline",
      "steps": [
        "Write process_upload with failure isolation and idempotency.",
        "Test it with events holding several files, including a corrupt one and a duplicate.",
        "Draw the architecture and note which service runs each step and why."
      ]
    }
  },
  {
    "day": 16,
    "title": "Amazon CloudFront Global CDN & Edge Functions (Lambda@Edge)",
    "goal": "You can explain how a CDN like CloudFront speeds up and protects a site, read Cache-Control headers to decide edge TTLs, design cache keys that keep hit rates high, and know when to run code at the edge.",
    "minutes": 30,
    "recap": "Your app now has an API, storage and a processing pipeline, all in one Region. Users far away still wait for the speed of light (Day 2). Today we move content closer to them.",
    "parts": [
      {
        "title": "What a CDN does",
        "say": [
          "A content delivery network (CDN) keeps copies of your content in edge locations around the world. Amazon CloudFront has hundreds of them.",
          "When a user asks for an image, CloudFront answers from the nearest edge if it has a cached copy (a cache hit). If not (a miss), it fetches from your origin, such as an S3 bucket or a load balancer, stores a copy and answers.",
          "Hits are fast for users and cheap for you: the origin does less work and CloudFront data transfer is usually cheaper than serving straight from the Region.",
          "CloudFront also protects the origin. Only CloudFront needs to reach your bucket, so the bucket can stay private (Day 10), using origin access control.",
          "It terminates TLS near the user, supports HTTP/2 and HTTP/3, and includes AWS Shield Standard against common network attacks (Day 27).",
          "The key number is the cache hit ratio: hits divided by all calls. A good static site often reaches over 90 percent.",
          "The example simulates an edge cache with a Python set and measures the hit ratio."
        ],
        "example": "A chain of local shops stocking popular items, so customers do not have to drive to the central warehouse for every purchase.",
        "code": "edge_cache = set()\nhits = misses = 0\ncalls = [\"/logo.png\", \"/app.js\", \"/logo.png\", \"/logo.png\", \"/app.js\", \"/video1.mp4\", \"/logo.png\"]\nfor path in calls:\n    if path in edge_cache:\n        hits += 1\n    else:\n        misses += 1\n        edge_cache.add(path)    # fetched from the origin, kept for next time\nprint(\"hits\", hits, \"misses\", misses)\nprint(f\"cache hit ratio: {hits / len(calls):.0%}\")",
        "output": "hits 4 misses 3\ncache hit ratio: 57%",
        "codeNotes": [
          {
            "line": 9,
            "note": "A miss goes to the origin once, then the edge keeps a copy."
          },
          {
            "line": 11,
            "note": "Hit ratio: the share of calls answered by the edge."
          }
        ],
        "tryIt": "Add ten more calls for \"/logo.png\". What happens to the hit ratio?",
        "check": {
          "question": "What happens on a cache miss at a CloudFront edge?",
          "options": [
            "The user gets an error",
            "CloudFront fetches from the origin, caches it and answers",
            "The file is deleted"
          ],
          "answer": 1,
          "why": "Misses go to the origin once; later calls can be hits."
        }
      },
      {
        "title": "Cache-Control and TTL",
        "say": [
          "How long may an edge keep a copy? That is its time to live (TTL), and the origin controls it with the Cache-Control response header.",
          "max-age=3600 says any cache may keep the response for an hour. s-maxage=600 applies only to shared caches such as CloudFront and wins over max-age there.",
          "no-store means never cache. private means only the user's own browser may cache it, never a shared cache, which matters for personal pages like account settings.",
          "If the origin sends no Cache-Control, CloudFront uses the distribution's default TTL, often 24 hours (86,400 seconds).",
          "Practice 1 is edge_ttl(cache_control, default_ttl=86400). Split the header on commas and strip spaces; check no-store and private first, then s-maxage, then max-age, then fall back to the default.",
          "The order matters for the same reason as always: the most important rule must win, and a private page must never be cached at the edge just because it also has max-age.",
          "The example parses a set of real-looking headers."
        ],
        "example": "A \"best before\" label on food: the shop may keep it on the shelf until then; some items say \"do not store\", and some say \"for the customer only\".",
        "code": "def edge_ttl(cache_control, default_ttl=86400):\n    directives = [d.strip() for d in cache_control.split(\",\") if d.strip()]\n    if \"no-store\" in directives or \"private\" in directives:\n        return 0\n    for name in (\"s-maxage=\", \"max-age=\"):\n        for d in directives:\n            if d.startswith(name):\n                return int(d[len(name):])\n    return default_ttl\n\nfor header in [\"public, max-age=3600\", \"max-age=60, s-maxage=600\", \"private, max-age=600\", \"no-store\", \"\"]:\n    print(f\"{header!r:30} -> {edge_ttl(header)}\")",
        "output": "'public, max-age=3600'         -> 3600\n'max-age=60, s-maxage=600'     -> 600\n'private, max-age=600'         -> 0\n'no-store'                     -> 0\n''                             -> 86400",
        "codeNotes": [
          {
            "line": 3,
            "note": "Personal or never-cache responses get 0 at the edge."
          },
          {
            "line": 5,
            "note": "s-maxage is checked before max-age."
          }
        ],
        "tryIt": "What TTL does \"public, max-age=31536000, immutable\" give? Why do sites use it for versioned files like app.3f9a.js?",
        "check": {
          "question": "Which header stops CloudFront caching a user's account page?",
          "options": [
            "public, max-age=60",
            "private, max-age=60",
            "s-maxage=60"
          ],
          "answer": 1,
          "why": "private allows only the user's browser to cache it, never a shared cache."
        }
      },
      {
        "title": "Cache keys and hit ratio",
        "say": [
          "The cache key is what CloudFront uses to decide whether two calls want the same object. By default it is the host and the path.",
          "You can add headers, cookies or query parameters to the key when the response really differs by them, for example the language header or a ?size= parameter.",
          "Every extra part splits the cache. If you add the User-Agent header, which has thousands of variations, almost every call becomes a miss and your hit ratio collapses.",
          "Tracking parameters such as utm_source never change the page, so they should NOT be in the key.",
          "Practice 2 is cache_key(path, headers, query, key_headers, key_params). Lowercase header names, keep only the listed headers and parameters, sort them, and join them into one string.",
          "Sorting makes the key independent of the order in which the browser happened to send things, so equal calls always produce equal keys.",
          "The example shows how a bad key choice destroys the hit ratio."
        ],
        "example": "A coat check where tickets are matched by coat colour and size only; if the attendant also matched on the time you arrived, nobody would ever find their coat.",
        "code": "calls = [{\"path\": \"/home\", \"lang\": \"en\", \"ua\": f\"browser-{i}\"} for i in range(6)]\ncalls += [{\"path\": \"/home\", \"lang\": \"hi\", \"ua\": \"browser-9\"}]\n\ndef hit_ratio(key_fn):\n    seen, hits = set(), 0\n    for c in calls:\n        k = key_fn(c)\n        hits += k in seen\n        seen.add(k)\n    return f\"{hits}/{len(calls)} hits\"\n\nprint(\"path + language:\", hit_ratio(lambda c: (c[\"path\"], c[\"lang\"])))\nprint(\"path + user agent:\", hit_ratio(lambda c: (c[\"path\"], c[\"ua\"])))",
        "output": "path + language: 5/7 hits\npath + user agent: 0/7 hits",
        "codeNotes": [
          {
            "line": 8,
            "note": "True counts as 1, so this adds a hit when the key was seen before."
          },
          {
            "line": 13,
            "note": "Every browser gets its own key: almost no hits."
          }
        ],
        "tryIt": "Add the user agent to the first key too. How many hits remain?",
        "check": {
          "question": "Why leave utm_source out of the cache key?",
          "options": [
            "It is too long",
            "It does not change the page, and including it splits the cache",
            "CloudFront forbids it"
          ],
          "answer": 1,
          "why": "Only parts that change the response belong in the key."
        }
      },
      {
        "title": "Invalidations and versioned file names",
        "say": [
          "What if you change a file that edges have cached for a day? You can create an invalidation for paths like /css/*, which tells every edge to drop its copy.",
          "Invalidations take a little time to spread, and after a free monthly allowance they cost money per path. Relying on them for every deploy is slow and fiddly.",
          "The better habit is versioned file names: build tools produce names like app.3f9a2c.js, containing a hash of the content. A changed file gets a new name, so it is simply a new object.",
          "Versioned files can be cached for a year with \"max-age=31536000, immutable\". Only the small HTML page that points to them needs a short TTL.",
          "This gives the best of both worlds: instant updates and near-perfect hit ratios.",
          "The example builds a versioned name from a hash of the content, so any change produces a new name.",
          "You have already used the same idea in Git commit ids and in the certificate hashes in this platform."
        ],
        "example": "Printing a new edition of a book with a new edition number instead of recalling every old copy from every library.",
        "code": "import hashlib\n\ndef versioned(name, content):\n    digest = hashlib.sha256(content.encode()).hexdigest()[:8]\n    stem, ext = name.rsplit(\".\", 1)\n    return f\"{stem}.{digest}.{ext}\"\n\nprint(versioned(\"app.js\", \"console-free build v1\"))\nprint(versioned(\"app.js\", \"console-free build v1\"))\nprint(versioned(\"app.js\", \"console-free build v2\"))",
        "output": "app.ad2a96c3.js\napp.ad2a96c3.js\napp.4b96ae6c.js",
        "codeNotes": [
          {
            "line": 4,
            "note": "The first 8 hex characters of the content hash."
          },
          {
            "line": 9,
            "note": "Same content, same name: caches stay valid."
          }
        ],
        "tryIt": "Change a single character in the content. Does the name change completely or only a little?",
        "check": {
          "question": "Why are hashed file names better than invalidating on every deploy?",
          "options": [
            "They are shorter",
            "A changed file gets a new name, so caches never serve the old one and can keep files for a long time",
            "Invalidations are not allowed"
          ],
          "answer": 1,
          "why": "New content means a new URL, so long cache times are safe."
        }
      },
      {
        "title": "Code at the edge",
        "say": [
          "Sometimes you want to change calls or responses at the edge, close to users, without going back to the origin.",
          "CloudFront Functions are tiny, very fast JavaScript functions for simple tasks on every call: redirects, rewriting URLs, adding security headers, normalising headers for the cache key.",
          "Lambda@Edge runs full Lambda functions (Node.js or Python) at regional edge caches. It is slower to start but can call other services, read the body, and do heavier work.",
          "Typical edge jobs: redirect old URLs, send users to a language version of the site, add headers like Strict-Transport-Security, or check a simple signed token before serving private files.",
          "Normalising headers is a classic one. Browsers send header names in different cases; lowercasing them at the edge keeps the cache key consistent.",
          "The example writes a small Python edge handler that lowercases header names and adds a security header.",
          "Keep edge code small and fast. It runs on every call, all over the world, and a bug there affects every user at once."
        ],
        "example": "Staff at each local shop who can gift-wrap or change a label on the spot, without sending the item back to headquarters.",
        "code": "def edge_handler(request):\n    headers = {name.lower(): value for name, value in request[\"headers\"].items()}\n    if request[\"uri\"] == \"/old-pricing\":\n        return {\"status\": 301, \"headers\": {\"location\": \"/pricing\"}}\n    headers[\"strict-transport-security\"] = \"max-age=63072000\"\n    return {\"uri\": request[\"uri\"], \"headers\": headers}\n\nprint(edge_handler({\"uri\": \"/pricing\", \"headers\": {\"Accept-Language\": \"en\", \"X-Device\": \"mobile\"}}))\nprint(edge_handler({\"uri\": \"/old-pricing\", \"headers\": {}}))",
        "output": "{'uri': '/pricing', 'headers': {'accept-language': 'en', 'x-device': 'mobile', 'strict-transport-security': 'max-age=63072000'}}\n{'status': 301, 'headers': {'location': '/pricing'}}",
        "codeNotes": [
          {
            "line": 2,
            "note": "A dict comprehension lowercases every header name."
          },
          {
            "line": 4,
            "note": "Redirects can be answered at the edge without touching the origin."
          }
        ],
        "tryIt": "Add a rule that sends visitors with \"accept-language\" starting with \"hi\" to \"/hi\" + uri.",
        "check": {
          "question": "Which is best for a simple redirect on every call with the lowest latency?",
          "options": [
            "An EC2 server in one Region",
            "A CloudFront Function at the edge",
            "A nightly batch job"
          ],
          "answer": 1,
          "why": "CloudFront Functions run lightweight code at every edge location in well under a millisecond."
        }
      },
      {
        "title": "Practice time: TTLs and cache keys",
        "say": [
          "Practice 1: edge_ttl(cache_control, default_ttl=86400). Build a clean list of directives: split on commas, strip spaces, and drop empty strings (an empty header gives one empty string).",
          "Return 0 for no-store or private. Then look for s-maxage=, then max-age=, and convert the number after the equals sign with int(). Otherwise return the default.",
          "Practice 2: cache_key(path, headers, query, key_headers, key_params). Make a lowercase copy of the headers, keep only names listed in key_headers, and sort the pairs.",
          "Do the same for query parameters. Then join everything as path|headers|params, with name=value pairs joined by \"&\".",
          "The checks send the same logical call twice, with different header case and order and a different tracking parameter, and expect identical keys.",
          "These two functions are the heart of CDN tuning: getting TTLs right and keys tight is how teams move hit ratios from 60 to 95 percent.",
          "The example shows why sorting is needed for equal keys."
        ],
        "example": "Alphabetising a shopping list before comparing it with a friend's: the same items in a different order are still the same list.",
        "code": "a = {\"x-device\": \"mobile\", \"accept-language\": \"en\"}\nb = {\"accept-language\": \"en\", \"x-device\": \"mobile\"}\nunsorted_a = \"&\".join(f\"{k}={v}\" for k, v in a.items())\nunsorted_b = \"&\".join(f\"{k}={v}\" for k, v in b.items())\nsorted_a = \"&\".join(f\"{k}={v}\" for k, v in sorted(a.items()))\nsorted_b = \"&\".join(f\"{k}={v}\" for k, v in sorted(b.items()))\nprint(\"unsorted equal:\", unsorted_a == unsorted_b)\nprint(\"sorted equal:\", sorted_a == sorted_b, sorted_a)",
        "output": "unsorted equal: False\nsorted equal: True accept-language=en&x-device=mobile",
        "codeNotes": [
          {
            "line": 5,
            "note": "sorted() orders the pairs by header name."
          }
        ],
        "tryIt": "Change one value in b. Are the sorted keys still equal? Should they be?",
        "check": {
          "question": "A header value \"public, max-age=60, s-maxage=600\". What TTL applies at CloudFront?",
          "options": [
            "60",
            "600",
            "86400"
          ],
          "answer": 1,
          "why": "s-maxage is meant for shared caches like CloudFront and overrides max-age there."
        }
      }
    ],
    "summary": [
      "CloudFront caches content at edge locations; hits are fast and cheap, misses go to the origin.",
      "Cache-Control sets TTLs: s-maxage for shared caches, max-age otherwise; no-store and private mean do not cache at the edge.",
      "Cache keys should include only what changes the response; sort parts so equal calls match.",
      "Prefer versioned, hashed file names over frequent invalidations.",
      "CloudFront Functions and Lambda@Edge run small pieces of code close to users."
    ],
    "projectStep": {
      "title": "CDN plan for your app",
      "steps": [
        "List your content types and give each a Cache-Control header.",
        "Design the cache key for your pages and test it with cache_key on sample calls.",
        "Write a tiny edge handler for one redirect and one security header."
      ]
    }
  },
  {
    "day": 17,
    "title": "Amazon Route 53 DNS Routing Policies & Health Checks",
    "goal": "You can explain how DNS resolution works, create Route 53 records, choose between simple, failover, weighted, latency and geolocation routing, use health checks, and implement failover and weighted selection in code.",
    "minutes": 30,
    "recap": "CloudFront brings content close to users. But how does a user's browser find your app at all, and how do you steer users away from a Region that is down? That is DNS, and Route 53.",
    "parts": [
      {
        "title": "How DNS finds your app",
        "say": [
          "The Domain Name System (DNS) turns names like shop.example.com into IP addresses. Every web visit starts with a DNS lookup.",
          "Your computer asks a resolver (usually run by your internet provider or a public service). The resolver walks the hierarchy: the root servers point to the .com servers, which point to the servers responsible for example.com.",
          "Those responsible servers are the authoritative name servers. Amazon Route 53 can be yours: it hosts your domain's records in a hosted zone.",
          "Resolvers cache answers for the record's TTL, often 60 to 300 seconds. A short TTL means changes spread quickly; a long TTL means fewer lookups and faster repeat visits.",
          "Route 53 is designed for 100 percent availability and answers from a global network of edge locations, so lookups are fast everywhere.",
          "The example walks a tiny pretend hierarchy to resolve a name, the way a resolver does.",
          "Knowing this chain helps when debugging: \"the site is down\" is sometimes \"DNS is still pointing at the old address because of caching\"."
        ],
        "example": "Asking for directions: the city information desk sends you to the right district office, which sends you to the right street office, which finally gives you the house number.",
        "code": "root = {\"com\": \"tld-com-server\"}\nservers = {\n    \"tld-com-server\": {\"example.com\": \"route53-ns-1\"},\n    \"route53-ns-1\": {\"shop.example.com\": \"203.0.113.10\"},\n}\n\ndef resolve(name):\n    tld = name.rsplit(\".\", 1)[-1]\n    tld_server = root[tld]\n    domain = \".\".join(name.split(\".\")[-2:])\n    ns = servers[tld_server][domain]\n    print(f\"root -> {tld_server} -> {ns}\")\n    return servers[ns][name]\n\nprint(\"shop.example.com =\", resolve(\"shop.example.com\"))",
        "output": "root -> tld-com-server -> route53-ns-1\nshop.example.com = 203.0.113.10",
        "codeNotes": [
          {
            "line": 9,
            "note": "The root points to the servers for the top-level domain."
          },
          {
            "line": 13,
            "note": "The authoritative server (Route 53) has the actual record."
          }
        ],
        "tryIt": "Add \"api.example.com\" with its own address to route53-ns-1 and resolve it.",
        "check": {
          "question": "What does a DNS record's TTL control?",
          "options": [
            "How long the website stays online",
            "How long resolvers may cache the answer",
            "How long a TLS certificate lasts"
          ],
          "answer": 1,
          "why": "Resolvers cache answers for the TTL, which decides how quickly DNS changes spread."
        }
      },
      {
        "title": "Record types and alias records",
        "say": [
          "DNS has several record types. An A record maps a name to an IPv4 address; AAAA to an IPv6 address; CNAME points a name at another name; MX names mail servers; TXT holds text, often for domain verification.",
          "A CNAME cannot be used at the zone apex (the bare domain, example.com), because the apex must hold other records such as the name server records.",
          "Route 53 solves that with alias records: an AWS extension that points any name, including the apex, at an AWS resource such as a load balancer, CloudFront distribution or S3 website.",
          "Alias records are resolved inside Route 53, follow the resource's changing IP addresses automatically, and lookups to AWS resources through them are free.",
          "So the usual setup is: example.com and www.example.com as alias A records to CloudFront, and api.example.com as an alias to the API's load balancer or API Gateway domain.",
          "The example prints a hosted zone and checks for the illegal CNAME at the apex.",
          "Always double-check record changes; a typo in DNS can take a whole site offline for the length of the TTL."
        ],
        "example": "An address book where most entries are street addresses, some say \"see the entry for Mum\", and a special kind says \"wherever the family business currently is\".",
        "code": "zone = \"example.com\"\nrecords = [\n    (\"example.com\", \"A-ALIAS\", \"d123.cloudfront.net\"),\n    (\"www.example.com\", \"CNAME\", \"example.com\"),\n    (\"api.example.com\", \"A-ALIAS\", \"my-alb-123.us-east-1.elb.amazonaws.com\"),\n    (\"example.com\", \"MX\", \"10 mail.example.com\"),\n]\nfor name, rtype, value in records:\n    problem = \"  <- CNAME not allowed at the apex\" if rtype == \"CNAME\" and name == zone else \"\"\n    print(f\"{name:18} {rtype:8} {value}{problem}\")",
        "output": "example.com        A-ALIAS  d123.cloudfront.net\nwww.example.com    CNAME    example.com\napi.example.com    A-ALIAS  my-alb-123.us-east-1.elb.amazonaws.com\nexample.com        MX       10 mail.example.com",
        "codeNotes": [
          {
            "line": 3,
            "note": "An alias record works even at the bare domain."
          },
          {
            "line": 9,
            "note": "A CNAME on the apex itself would be rejected."
          }
        ],
        "tryIt": "Change the first record to a CNAME and run it again.",
        "check": {
          "question": "How do you point example.com (the apex) at a CloudFront distribution in Route 53?",
          "options": [
            "A CNAME record",
            "An alias A record",
            "An MX record"
          ],
          "answer": 1,
          "why": "CNAMEs are not allowed at the apex; Route 53 alias records are."
        }
      },
      {
        "title": "Health checks and failover routing",
        "say": [
          "Route 53 health checks call your endpoint (for example https://api.example.com/health) from several locations around the world every 10 or 30 seconds.",
          "An endpoint is marked unhealthy after it fails a number of checks in a row, the same threshold idea as load balancer health checks on Day 8.",
          "Failover routing uses them. You create a primary record and a secondary record. While the primary is healthy, Route 53 answers with it; when it is not, it answers with the secondary.",
          "If every record is unhealthy, Route 53 answers with the primary anyway. Returning something is better than returning nothing, and it avoids a total blackout caused by a broken health check.",
          "Practice 1 is resolve_dns(config, health). SIMPLE policy always returns the primary. FAILOVER returns the primary if healthy, else a healthy secondary, else the primary.",
          "Use health.get(ip, False) so an IP that is missing from the health dictionary counts as unhealthy, the safe default.",
          "The example walks through a Region outage and recovery."
        ],
        "example": "A shop with a sign saying \"if closed, please visit our branch round the corner\", and if both are closed, you still get the main shop's address.",
        "code": "def resolve_dns(config, health):\n    if config[\"policy\"] == \"SIMPLE\":\n        return config[\"primary\"]\n    if health.get(config[\"primary\"], False):\n        return config[\"primary\"]\n    if config.get(\"secondary\") and health.get(config[\"secondary\"], False):\n        return config[\"secondary\"]\n    return config[\"primary\"]\n\ncfg = {\"policy\": \"FAILOVER\", \"primary\": \"us-east-1-alb\", \"secondary\": \"eu-west-1-alb\"}\nfor moment, h in [(\"normal\", {\"us-east-1-alb\": True, \"eu-west-1-alb\": True}),\n                  (\"us-east-1 down\", {\"us-east-1-alb\": False, \"eu-west-1-alb\": True}),\n                  (\"both down\", {\"us-east-1-alb\": False, \"eu-west-1-alb\": False})]:\n    print(f\"{moment:15} -> {resolve_dns(cfg, h)}\")",
        "output": "normal          -> us-east-1-alb\nus-east-1 down  -> eu-west-1-alb\nboth down       -> us-east-1-alb",
        "codeNotes": [
          {
            "line": 4,
            "note": "Missing health data counts as unhealthy."
          },
          {
            "line": 8,
            "note": "All unhealthy: answer with the primary rather than nothing."
          }
        ],
        "tryIt": "What would users see during failover if the record TTL were 1 hour instead of 60 seconds?",
        "check": {
          "question": "With failover routing, when does Route 53 answer with the secondary?",
          "options": [
            "Always, to spread load",
            "When the primary is unhealthy and the secondary is healthy",
            "Only on weekends"
          ],
          "answer": 1,
          "why": "Failover sends traffic to the secondary only while the primary fails its health checks."
        }
      },
      {
        "title": "Weighted routing and canary releases",
        "say": [
          "Weighted routing splits traffic between records by weight. With weights 90 and 10, about 90 percent of lookups get the first answer and 10 percent the second.",
          "This makes canary releases easy: send 10 percent of users to a new version, watch error rates, then move to 50 and 100 percent, or back to 0 if something is wrong.",
          "A weight of 0 turns a record off without deleting it, handy for keeping a standby ready.",
          "Route 53 picks with a random number, so over many lookups the split matches the weights. Individual users may still switch between versions when their cached answer expires.",
          "Practice 2 is pick_weighted(records, roll): walk the records adding up weights and return the first endpoint whose running total is greater than the roll.",
          "Passing the random number in as roll makes the function deterministic and easy to test. In production you would pass random.randrange(total_weight).",
          "The example checks the split over every possible roll."
        ],
        "example": "A raffle where one prize has 90 tickets in the drum and another has 10: any single draw is chance, but over many draws the share follows the tickets.",
        "code": "from collections import Counter\n\ndef pick_weighted(records, roll):\n    total = 0\n    for r in records:\n        total += r[\"weight\"]\n        if roll < total:\n            return r[\"endpoint\"]\n\nrecords = [{\"endpoint\": \"v1\", \"weight\": 90}, {\"endpoint\": \"v2-canary\", \"weight\": 10}]\nprint(\"roll 0 ->\", pick_weighted(records, 0), \"| roll 95 ->\", pick_weighted(records, 95))\nprint(Counter(pick_weighted(records, roll) for roll in range(100)))",
        "output": "roll 0 -> v1 | roll 95 -> v2-canary\nCounter({'v1': 90, 'v2-canary': 10})",
        "codeNotes": [
          {
            "line": 6,
            "note": "A running total turns weights into ranges: 0-89 and 90-99."
          },
          {
            "line": 12,
            "note": "Every possible roll once shows the exact split."
          }
        ],
        "tryIt": "Move the canary to 50/50 by changing the weights. What does the Counter show?",
        "check": {
          "question": "Weights: A = 70, B = 30. Roll 75. Which endpoint?",
          "options": [
            "A",
            "B",
            "Neither"
          ],
          "answer": 1,
          "why": "A covers rolls 0-69; 75 falls in B's range 70-99."
        }
      },
      {
        "title": "Latency and geolocation routing",
        "say": [
          "Latency-based routing answers with the Region that gives the user the lowest network latency, based on measurements AWS keeps between user networks and Regions.",
          "That is what global apps usually want: users in Mumbai get ap-south-1, users in Frankfurt get eu-central-1, automatically.",
          "Geolocation routing answers by the user's location instead, for example all users in Germany go to eu-central-1. It is used for legal reasons (data residency) or for country-specific content.",
          "Geolocation needs a default record for locations you did not list; otherwise users there get no answer at all.",
          "Geoproximity routing adds a bias to grow or shrink the area each Region serves, and multivalue answers return several healthy IPs so clients can pick one.",
          "All of these can be combined with health checks, so an unhealthy Region is skipped.",
          "The example chooses the lowest-latency healthy Region for users in three cities."
        ],
        "example": "A delivery company that sends each order from the nearest open warehouse, skipping any warehouse closed for repairs.",
        "code": "latency = {\n    \"Mumbai\": {\"ap-south-1\": 15, \"eu-central-1\": 120, \"us-east-1\": 190},\n    \"Berlin\": {\"ap-south-1\": 125, \"eu-central-1\": 12, \"us-east-1\": 95},\n    \"Boston\": {\"ap-south-1\": 200, \"eu-central-1\": 90, \"us-east-1\": 8},\n}\nhealthy = {\"ap-south-1\": True, \"eu-central-1\": False, \"us-east-1\": True}\nfor city, options in latency.items():\n    ok = {region: ms for region, ms in options.items() if healthy[region]}\n    best = min(ok, key=ok.get)\n    print(f\"{city:7} -> {best} ({ok[best]} ms)\")",
        "output": "Mumbai  -> ap-south-1 (15 ms)\nBerlin  -> us-east-1 (95 ms)\nBoston  -> us-east-1 (8 ms)",
        "codeNotes": [
          {
            "line": 8,
            "note": "Skip unhealthy Regions before choosing."
          },
          {
            "line": 9,
            "note": "min with key=ok.get picks the region with the smallest latency."
          }
        ],
        "tryIt": "Mark ap-south-1 unhealthy too. Where do Mumbai users go now?",
        "check": {
          "question": "Your app must serve German users only from an EU Region by law. Which routing fits?",
          "options": [
            "Weighted",
            "Geolocation",
            "Simple"
          ],
          "answer": 1,
          "why": "Geolocation routes by the user's location, which is what residency rules need."
        }
      },
      {
        "title": "Practice time: failover and weights",
        "say": [
          "Practice 1: resolve_dns(config, health). Handle SIMPLE first. Then check the primary, then the secondary (only if it exists), then fall back to the primary.",
          "Test the four situations in your head: both healthy, primary down, both down, and SIMPLE with an unhealthy primary. The checks cover all four.",
          "Practice 2: pick_weighted(records, roll). Keep a running total; the first record where roll < total wins. Weight-0 records never win because they do not increase the total.",
          "The checks also count the winners over rolls 0 to 99 and expect exactly a 90/10 split for weights 90 and 10.",
          "A common bug is using <= instead of <. Then roll 90 would still pick the first record, and the split becomes 91/9.",
          "DNS routing is often the outermost layer of a disaster recovery plan (Day 29), so these small functions model decisions that matter a great deal.",
          "The example shows the off-by-one error in action."
        ],
        "example": "Measuring a fence with a ruler that starts at 1 instead of 0: every post ends up one step out.",
        "code": "records = [(\"v1\", 90), (\"v2\", 10)]\n\ndef pick(roll, strict=True):\n    total = 0\n    for name, weight in records:\n        total += weight\n        if (roll < total) if strict else (roll <= total):\n            return name\n\nfor strict in [True, False]:\n    share = sum(pick(r, strict) == \"v1\" for r in range(100))\n    print(\"strict <\" if strict else \"sloppy <=\", \"gives v1\", share, \"of 100 rolls\")",
        "output": "strict < gives v1 90 of 100 rolls\nsloppy <= gives v1 91 of 100 rolls",
        "codeNotes": [
          {
            "line": 7,
            "note": "Using <= moves one roll into the wrong bucket."
          }
        ],
        "tryIt": "What would the sloppy version do with weights 50 and 50?",
        "check": {
          "question": "Primary unhealthy, secondary healthy, policy FAILOVER. What is returned?",
          "options": [
            "The primary",
            "The secondary",
            "Nothing"
          ],
          "answer": 1,
          "why": "Failover moves traffic to the healthy secondary."
        }
      }
    ],
    "summary": [
      "DNS resolves names through a hierarchy to authoritative servers; answers are cached for the TTL.",
      "Route 53 hosts zones; alias records point any name, even the apex, at AWS resources.",
      "Failover routing uses health checks to switch to a secondary, and returns the primary if all are down.",
      "Weighted routing splits traffic for canary releases; latency routing picks the fastest healthy Region.",
      "Geolocation routing serves users by location for legal or local reasons, with a default record."
    ],
    "projectStep": {
      "title": "DNS plan for your app",
      "steps": [
        "Write the records for your domain: apex, www, api and mail.",
        "Model a failover pair and a 90/10 canary with resolve_dns and pick_weighted.",
        "Choose TTLs and explain the trade-off between fast changes and fewer lookups."
      ]
    }
  },
  {
    "day": 18,
    "title": "Amazon SQS: Standard vs FIFO Queues & Visibility Timeouts",
    "goal": "You can explain why queues decouple services, how SQS standard and FIFO queues differ, how visibility timeouts and deletes give at-least-once delivery, how long polling works, and how FIFO deduplication drops repeats.",
    "minutes": 30,
    "recap": "So far services called each other directly: the browser called the API, which called the database. Today you add a buffer between services so a slow or broken part does not drag everything down.",
    "parts": [
      {
        "title": "Why queues",
        "say": [
          "A message queue sits between a producer (who sends work) and a consumer (who does it). The producer drops a message and moves on; the consumer picks it up when ready.",
          "This decoupling gives three big benefits. Resilience: if the consumer is down, messages wait safely instead of failing. Smoothing: a burst of 10,000 orders becomes a steady stream the workers can handle.",
          "And scaling: you can add more consumers when the queue grows, and remove them when it is empty, even scaling on queue length.",
          "Amazon Simple Queue Service (SQS) is AWS's fully managed queue. There are no servers or brokers to run, and it scales to almost any volume.",
          "Messages can be up to 256 KB. For larger data, put the data in S3 and send the S3 key in the message.",
          "The example shows a burst of orders arriving at once and a worker that processes a fixed number per second from the queue.",
          "Queues change the question from \"is the other service up right now?\" to \"will the work get done eventually?\", which is far easier to guarantee."
        ],
        "example": "A restaurant order spike: the waiters pin tickets on a rail and the kitchen works through them steadily, instead of every waiter shouting at the chef at once.",
        "code": "from collections import deque\n\nqueue = deque()\narrivals = [50, 0, 0, 0, 0, 0]   # a burst of 50 orders in the first second\nper_second = 10\nfor second, new in enumerate(arrivals):\n    queue.extend(range(new))\n    for _ in range(min(per_second, len(queue))):\n        queue.popleft()\n    print(f\"second {second}: {len(queue):2} waiting\")",
        "output": "second 0: 40 waiting\nsecond 1: 30 waiting\nsecond 2: 20 waiting\nsecond 3: 10 waiting\nsecond 4:  0 waiting\nsecond 5:  0 waiting",
        "codeNotes": [
          {
            "line": 7,
            "note": "The producer adds the burst to the queue instantly."
          },
          {
            "line": 8,
            "note": "The consumer works at its own steady rate."
          }
        ],
        "tryIt": "Add a second worker (per_second = 20). How much sooner is the queue empty?",
        "check": {
          "question": "What is the main benefit of putting a queue between two services?",
          "options": [
            "It makes messages smaller",
            "The producer keeps working even when the consumer is slow or down",
            "It removes the need for a database"
          ],
          "answer": 1,
          "why": "Queues decouple services so bursts and outages do not spread."
        }
      },
      {
        "title": "Receive, process, delete: the visibility timeout",
        "say": [
          "SQS does not remove a message when a consumer receives it. Instead, it hides the message for the visibility timeout, 30 seconds by default.",
          "The consumer processes the message and then deletes it explicitly. Only the delete removes it for good.",
          "If the consumer crashes before deleting, the timeout ends and the message becomes visible again for another consumer. No work is lost.",
          "This is at-least-once delivery. The price is that a message can occasionally be processed twice, so consumers must be idempotent, exactly as on Day 15.",
          "Set the visibility timeout longer than your normal processing time. If processing takes 45 seconds and the timeout is 30, a second consumer will pick up the message while the first is still working.",
          "Practice 1 is a small Queue class with send, receive(now) and delete. Each message remembers when it becomes visible again and how many times it was received.",
          "The example runs a worker that crashes on its first attempt, and shows the message coming back."
        ],
        "example": "Borrowing a library book: it is checked out to you for two weeks; return it and it is gone from your record, forget and it goes back on the shelf for someone else.",
        "code": "messages = [{\"id\": \"m1\", \"body\": \"charge order 17\", \"visible_at\": 0, \"receives\": 0}]\nTIMEOUT = 30\n\ndef receive(now):\n    for m in messages:\n        if m[\"visible_at\"] <= now:\n            m[\"visible_at\"], m[\"receives\"] = now + TIMEOUT, m[\"receives\"] + 1\n            return m\n\nm = receive(now=0); print(\"t=0 worker A got\", m[\"id\"], \"and crashed\")\nprint(\"t=10 worker B gets:\", receive(now=10))\nm = receive(now=31); print(\"t=31 worker B got\", m[\"id\"], \"receive count\", m[\"receives\"])\nmessages.remove(m); print(\"deleted; left:\", messages)",
        "output": "t=0 worker A got m1 and crashed\nt=10 worker B gets: None\nt=31 worker B got m1 receive count 2\ndeleted; left: []",
        "codeNotes": [
          {
            "line": 7,
            "note": "Receiving hides the message until now + timeout."
          },
          {
            "line": 13,
            "note": "Only an explicit delete removes it."
          }
        ],
        "tryIt": "What happens if worker B takes 40 seconds and never deletes before t=61?",
        "check": {
          "question": "A consumer receives a message and crashes. What happens to the message?",
          "options": [
            "It is lost",
            "It becomes visible again after the visibility timeout",
            "It is sent to the producer"
          ],
          "answer": 1,
          "why": "Undeleted messages reappear after the timeout, so another consumer can process them."
        }
      },
      {
        "title": "Standard and FIFO queues",
        "say": [
          "SQS offers two kinds of queue.",
          "Standard queues have nearly unlimited throughput. They deliver every message at least once, but occasionally more than once, and the order is best effort, not guaranteed.",
          "FIFO (first-in, first-out) queues keep strict order within a message group and remove duplicates. Their names end in .fifo. Throughput is lower, though high-throughput mode raises it a lot.",
          "Message groups let you have order where it matters and parallelism elsewhere. For example, use the account id as the group: each account's transactions stay in order, while different accounts are processed in parallel.",
          "Choose standard when order does not matter and volume is huge, such as resizing images. Choose FIFO when order matters, such as bank transactions or stock updates for one product.",
          "The example shows why order matters for one account: applying a withdrawal before the deposit it depends on gives a wrong answer.",
          "Most systems use standard queues and design consumers to handle any order; FIFO is for the cases where that is impossible."
        ],
        "example": "A bakery queue where each family is served in the order its members arrived, while different families can be served by different counters at the same time.",
        "code": "events = [(\"deposit\", 100), (\"withdraw\", 80), (\"deposit\", 20)]\n\ndef apply(order):\n    balance, log = 0, []\n    for kind, amount in order:\n        if kind == \"withdraw\" and amount > balance:\n            log.append(f\"REJECTED withdraw {amount}\")\n            continue\n        balance += amount if kind == \"deposit\" else -amount\n    return balance, log\n\nprint(\"FIFO order:\", apply(events))\nprint(\"Shuffled order:\", apply([events[1], events[0], events[2]]))",
        "output": "FIFO order: (40, [])\nShuffled order: (120, ['REJECTED withdraw 80'])",
        "codeNotes": [
          {
            "line": 6,
            "note": "A withdrawal before the deposit fails for lack of funds."
          }
        ],
        "tryIt": "Which message group id would you use for these events in a FIFO queue?",
        "check": {
          "question": "Which queue type guarantees order within a message group?",
          "options": [
            "Standard",
            "FIFO",
            "Both equally"
          ],
          "answer": 1,
          "why": "FIFO queues preserve order per message group; standard queues are best-effort."
        }
      },
      {
        "title": "FIFO deduplication",
        "say": [
          "FIFO queues remove duplicates automatically. Each message carries a deduplication id, either set by you or computed as a hash of the body.",
          "If a message with the same deduplication id was accepted in the last five minutes, SQS accepts the send call but silently drops the duplicate.",
          "This handles a common problem: the producer sends a message, the network times out before the reply arrives, and the producer retries. Without deduplication, the order would be charged twice.",
          "After five minutes, the same id is accepted again. The window protects against retries, not against a genuinely repeated action tomorrow.",
          "Practice 2 is accept_messages(messages, window=300). Remember when each id was last ACCEPTED, and accept a message only if its id is new or at least window seconds have passed since then.",
          "Compare with the time of the last accepted copy, not the last attempt. Dropped duplicates must not extend the window.",
          "The example runs a producer that retries after timeouts."
        ],
        "example": "A ticket machine that remembers ticket numbers for five minutes, so pressing \"print\" twice in a panic still gives one ticket.",
        "code": "def accept_messages(messages, window=300):\n    last_accepted, accepted = {}, []\n    for dedup_id, t in messages:\n        if dedup_id not in last_accepted or t - last_accepted[dedup_id] >= window:\n            last_accepted[dedup_id] = t\n            accepted.append((dedup_id, t))\n    return accepted\n\nsends = [(\"pay-17\", 0), (\"pay-17\", 4), (\"pay-17\", 9), (\"pay-18\", 12), (\"pay-17\", 320)]\nprint(accept_messages(sends))",
        "output": "[('pay-17', 0), ('pay-18', 12), ('pay-17', 320)]",
        "codeNotes": [
          {
            "line": 4,
            "note": "New id, or the window since the last accepted copy has passed."
          },
          {
            "line": 5,
            "note": "Only accepted messages update the time."
          }
        ],
        "tryIt": "Change the window to 10 seconds. Which messages are accepted now?",
        "check": {
          "question": "How long does SQS FIFO remember a deduplication id?",
          "options": [
            "5 seconds",
            "5 minutes",
            "Forever"
          ],
          "answer": 1,
          "why": "The deduplication interval is five minutes."
        }
      },
      {
        "title": "Long polling, batches and scaling consumers",
        "say": [
          "Consumers ask SQS for messages with ReceiveMessage. With short polling, an empty queue answers immediately with nothing, and a busy loop of empty receives costs money for nothing.",
          "Long polling waits up to 20 seconds for a message to arrive before answering. It cuts empty responses and cost dramatically. Set WaitTimeSeconds to 20 unless you have a reason not to.",
          "Receive and delete in batches of up to 10 messages per call. Fewer API calls means lower cost and higher throughput.",
          "Lambda can consume SQS directly: AWS polls the queue for you and calls your function with batches, scaling the number of concurrent functions with the queue length.",
          "For containers or servers, scale the number of workers on the queue metric ApproximateNumberOfMessagesVisible, or better on backlog per worker.",
          "The example compares the number of API calls with short and long polling over a quiet minute.",
          "Watch the age of the oldest message too. A rising age means consumers are falling behind, even if the count looks small."
        ],
        "example": "Waiting at the post office counter for a parcel that is due any moment, instead of walking in and out of the door every second.",
        "code": "import math\n\narrivals = [7, 33, 58]           # seconds when messages arrive in a quiet minute\nshort_poll_every = 1\nshort_calls = 60 // short_poll_every\nlong_calls = 0\nt = 0\nwhile t < 60:\n    nxt = [a for a in arrivals if a >= t]\n    t = min(nxt[0] if nxt and nxt[0] - t <= 20 else t + 20, 60) + 0.001\n    long_calls += 1\nprint(\"short polling calls:\", short_calls)\nprint(\"long polling calls:\", long_calls)",
        "output": "short polling calls: 60\nlong polling calls: 6",
        "codeNotes": [
          {
            "line": 10,
            "note": "Each long poll returns when a message arrives or after 20 seconds."
          }
        ],
        "tryIt": "How many calls would short polling make over a quiet day?",
        "check": {
          "question": "What does long polling do?",
          "options": [
            "Keeps messages longer",
            "Waits up to 20 seconds for messages before answering, reducing empty receives",
            "Makes messages larger"
          ],
          "answer": 1,
          "why": "Long polling cuts empty responses and cost."
        }
      },
      {
        "title": "Practice time: build the queue",
        "say": [
          "Practice 1: the Queue class. In __init__ store the visibility timeout, an empty list of messages and a counter for ids starting at 1.",
          "send(body) appends a dictionary with id \"m1\", \"m2\" and so on, receive_count 0 and visible_at 0. receive(now) returns the first visible message, hides it until now plus the timeout and adds one to its receive count.",
          "Return a fresh dictionary with just id, body and receive_count from receive, rather than the internal record. Callers should not be able to change the queue's internal state by accident.",
          "delete(message_id) keeps every message except the one with that id.",
          "Practice 2: accept_messages. The window check is t minus the last accepted time, compared with >= window.",
          "Together these two tasks model the two guarantees that make SQS dependable: undeleted work comes back, and FIFO duplicates go away.",
          "The example shows why returning a copy protects the queue."
        ],
        "example": "Giving a customer a photocopy of the form rather than the original from the file: they can scribble on it without changing your records.",
        "code": "internal = {\"id\": \"m1\", \"body\": \"hello\", \"visible_at\": 30, \"receive_count\": 1}\n\nleaky = internal\nsafe = {k: internal[k] for k in (\"id\", \"body\", \"receive_count\")}\nleaky[\"visible_at\"] = 0          # a caller changes the returned dict\nsafe[\"receive_count\"] = 99\nprint(\"internal after changes:\", internal)",
        "output": "internal after changes: {'id': 'm1', 'body': 'hello', 'visible_at': 0, 'receive_count': 1}",
        "codeNotes": [
          {
            "line": 3,
            "note": "Returning the same dict lets callers change the queue."
          },
          {
            "line": 4,
            "note": "A new dict with only the public fields."
          }
        ],
        "tryIt": "Which change reached the internal record, and what bug would it cause in a real queue?",
        "check": {
          "question": "Why set the visibility timeout longer than normal processing time?",
          "options": [
            "To save money",
            "So a message is not handed to a second consumer while the first is still working",
            "SQS requires 12 hours"
          ],
          "answer": 1,
          "why": "A timeout that is too short causes duplicate processing of in-flight messages."
        }
      }
    ],
    "summary": [
      "Queues decouple producers and consumers, absorb bursts and let consumers scale.",
      "Receive hides a message for the visibility timeout; only delete removes it: at-least-once delivery.",
      "Standard queues: huge throughput, best-effort order, possible duplicates. FIFO: ordered per group, deduplicated.",
      "FIFO deduplication drops repeats of an accepted id for five minutes.",
      "Use long polling (20 s) and batches; scale consumers on backlog and oldest message age."
    ],
    "projectStep": {
      "title": "Queue for your app",
      "steps": [
        "Pick one slow task in your app and move it behind a queue.",
        "Model it with the Queue class, including a crash and redelivery.",
        "Decide standard or FIFO and, for FIFO, the message group id."
      ]
    }
  },
  {
    "day": 19,
    "title": "Amazon SNS: Pub/Sub Topic Fanout & Push Notifications",
    "goal": "You can explain publish-subscribe messaging, fan one SNS message out to many subscribers, combine SNS with SQS for durable fan-out, filter messages with subscription filter policies, and handle delivery failures.",
    "minutes": 30,
    "recap": "Yesterday a queue connected one producer to one group of consumers. Often one event matters to many services at once: an order was placed, so billing, email, stock and analytics all need to know.",
    "parts": [
      {
        "title": "Publish and subscribe",
        "say": [
          "Publish-subscribe (pub/sub) messaging separates who announces an event from who cares about it. A publisher sends a message to a topic; every subscriber of the topic receives a copy.",
          "Amazon Simple Notification Service (SNS) provides topics. Subscribers can be SQS queues, Lambda functions, HTTPS endpoints, email addresses, or mobile push and SMS.",
          "The publisher does not know or care how many subscribers there are. Adding a new service that reacts to orders means adding a subscription, not changing the order service.",
          "Compare with a queue: in SQS, each message is processed by ONE consumer. In SNS, each message is delivered to EVERY subscriber.",
          "A new subscription starts as pending confirmation for some endpoint types (such as email and HTTPS). Only confirmed subscriptions receive messages.",
          "The example publishes one event to a topic with three subscribers.",
          "Pub/sub is how large systems stay loosely coupled: teams add features by listening to events rather than by editing each other's code."
        ],
        "example": "A newspaper: the publisher prints one edition, and every subscriber gets their own copy, whether there are ten readers or ten million.",
        "code": "topic = {\"name\": \"order-events\", \"subscribers\": []}\n\ndef subscribe(fn):\n    topic[\"subscribers\"].append(fn)\n\ndef publish(message):\n    for fn in topic[\"subscribers\"]:\n        fn(message)\n\nsubscribe(lambda m: print(\"billing: charge\", m[\"order_id\"]))\nsubscribe(lambda m: print(\"email: send receipt for\", m[\"order_id\"]))\nsubscribe(lambda m: print(\"stock: reserve items for\", m[\"order_id\"]))\npublish({\"event\": \"ORDER_PLACED\", \"order_id\": \"ord-981\"})",
        "output": "billing: charge ord-981\nemail: send receipt for ord-981\nstock: reserve items for ord-981",
        "codeNotes": [
          {
            "line": 7,
            "note": "Every subscriber gets the same message."
          },
          {
            "line": 10,
            "note": "Adding a subscriber needs no change to publish()."
          }
        ],
        "tryIt": "Add an analytics subscriber that counts orders. Did you change the publisher?",
        "check": {
          "question": "In SNS, how many subscribers receive each message?",
          "options": [
            "Exactly one",
            "Every confirmed subscriber of the topic",
            "None until they poll"
          ],
          "answer": 1,
          "why": "SNS pushes a copy of each message to all confirmed subscribers."
        }
      },
      {
        "title": "Fan-out with SNS and SQS",
        "say": [
          "SNS pushes messages and does not store them long. If a subscriber is down for an hour, it would miss messages. The fix is the SNS-to-SQS fan-out pattern.",
          "Subscribe an SQS queue for each consuming service to the topic. SNS drops a copy into each queue, and each service reads its own queue at its own pace, with retries and dead-letter queues.",
          "Now the billing service can be down for maintenance and catch up later; the email service can process slowly; neither affects the other.",
          "Practice 1 is fanout(subscriptions, message, deliver). Call deliver for every CONFIRMED subscription, count PENDING ones as skipped, and keep going if one delivery raises.",
          "Returning lists of delivered and failed endpoints makes the result easy to act on: retry the failures, alert if many fail.",
          "The example delivers to three queues, one of which has been deleted by mistake.",
          "This pattern, one topic fanning out to many queues, appears in almost every event-driven AWS architecture, including Milestone 3 on Day 21."
        ],
        "example": "A company memo copied into each department's in-tray: each department reads it when it can, and one department being on holiday does not stop the others.",
        "code": "queues = {\"billing-q\": [], \"email-q\": []}\n\ndef deliver(endpoint, message):\n    queues[endpoint].append(message)     # KeyError if the queue was deleted\n\nsubs = [{\"endpoint\": \"billing-q\", \"status\": \"CONFIRMED\"}, {\"endpoint\": \"old-q\", \"status\": \"CONFIRMED\"},\n        {\"endpoint\": \"email-q\", \"status\": \"CONFIRMED\"}, {\"endpoint\": \"new-q\", \"status\": \"PENDING\"}]\ndelivered, failed, skipped = [], [], 0\nfor s in subs:\n    if s[\"status\"] != \"CONFIRMED\":\n        skipped += 1\n        continue\n    try:\n        deliver(s[\"endpoint\"], {\"event\": \"ORDER_PLACED\"}); delivered.append(s[\"endpoint\"])\n    except Exception:\n        failed.append(s[\"endpoint\"])\nprint(\"delivered\", delivered, \"failed\", failed, \"skipped\", skipped)",
        "output": "delivered ['billing-q', 'email-q'] failed ['old-q'] skipped 1",
        "codeNotes": [
          {
            "line": 10,
            "note": "Pending subscriptions receive nothing."
          },
          {
            "line": 13,
            "note": "One broken endpoint must not stop the others."
          }
        ],
        "tryIt": "Print the contents of each queue afterwards. Which ones got the event?",
        "check": {
          "question": "Why put an SQS queue behind each SNS subscription?",
          "options": [
            "SNS cannot send to Lambda",
            "Queues store messages so each service can process at its own pace and survive downtime",
            "It makes messages cheaper"
          ],
          "answer": 1,
          "why": "The queue buffers messages durably for each subscriber."
        }
      },
      {
        "title": "Filter policies",
        "say": [
          "Not every subscriber wants every message. A VIP-support service only cares about orders from VIP customers; a warehouse service only about orders shipping from its country.",
          "SNS subscription filter policies let each subscription declare which messages it wants, based on message attributes (or the message body). SNS then delivers only matching messages.",
          "A policy maps attribute names to lists of allowed values, for example {\"customer\": [\"VIP\", \"ENTERPRISE\"]}. Every attribute in the policy must match; within a list, any value may match.",
          "Filtering at SNS means subscribers do not waste time and money receiving and discarding messages they do not need.",
          "Practice 2 is matches_filter(policy, attributes). Attributes arrive as {\"Type\": \"String\", \"Value\": \"VIP\"}, so compare against the Value field.",
          "An empty policy matches everything, and Python's all() of an empty sequence is True, so that case works automatically.",
          "The example routes four messages through two filtered subscriptions."
        ],
        "example": "A magazine subscription where you tick only the sections you want, and the publisher sends just those pages.",
        "code": "def matches_filter(policy, attributes):\n    return all(name in attributes and attributes[name][\"Value\"] in allowed\n               for name, allowed in policy.items())\n\nvip_support = {\"customer\": [\"VIP\", \"ENTERPRISE\"]}\nindia_warehouse = {\"country\": [\"IN\"]}\nmsgs = [{\"customer\": \"VIP\", \"country\": \"IN\"}, {\"customer\": \"BASIC\", \"country\": \"IN\"},\n        {\"customer\": \"ENTERPRISE\", \"country\": \"US\"}, {\"customer\": \"BASIC\", \"country\": \"US\"}]\nfor m in msgs:\n    attrs = {k: {\"Type\": \"String\", \"Value\": v} for k, v in m.items()}\n    print(m, \"vip:\", matches_filter(vip_support, attrs), \"india:\", matches_filter(india_warehouse, attrs))",
        "output": "{'customer': 'VIP', 'country': 'IN'} vip: True india: True\n{'customer': 'BASIC', 'country': 'IN'} vip: False india: True\n{'customer': 'ENTERPRISE', 'country': 'US'} vip: True india: False\n{'customer': 'BASIC', 'country': 'US'} vip: False india: False",
        "codeNotes": [
          {
            "line": 2,
            "note": "Every attribute in the policy must be present and have an allowed value."
          },
          {
            "line": 10,
            "note": "Build SNS-style attributes from plain values."
          }
        ],
        "tryIt": "Write a policy that matches only VIP customers in India. Test it on the four messages.",
        "check": {
          "question": "Policy {\"customer\": [\"VIP\"], \"region\": [\"EU\"]}. A message has customer VIP and no region. Does it match?",
          "options": [
            "Yes",
            "No, every attribute in the policy must match",
            "Only for VIP"
          ],
          "answer": 1,
          "why": "A missing attribute cannot match its list, so the whole policy fails."
        }
      },
      {
        "title": "Delivery retries and dead-letter queues",
        "say": [
          "What if a subscriber's endpoint is down when SNS delivers? SNS retries according to a delivery policy, with backoff, over a period that depends on the endpoint type.",
          "For SQS and Lambda subscribers, SNS retries many times over hours. For HTTPS endpoints the policy is configurable.",
          "If every retry fails, the message is dropped, unless you attach a dead-letter queue (DLQ) to the subscription. Then the failed message is kept in SQS for investigation.",
          "Always attach a DLQ for important subscriptions, and set an alarm on its message count. A DLQ that fills silently is a bug report no one reads.",
          "Retries with exponential backoff give a temporarily broken endpoint time to recover without being flooded.",
          "The example simulates delivery retries with backoff to an endpoint that recovers after a few attempts, and one that never does.",
          "This is the same retry discipline you met in distributed systems; managed services apply it for you, but you still choose the limits."
        ],
        "example": "A courier who tries to deliver three times on increasingly spaced days, then leaves the parcel at the depot with a note instead of throwing it away.",
        "code": "def deliver_with_retries(endpoint_ok_after, max_attempts=4, base=1):\n    waited = 0\n    for attempt in range(1, max_attempts + 1):\n        if attempt > endpoint_ok_after:\n            return f\"delivered on attempt {attempt} after waiting {waited}s\"\n        waited += base * 2 ** (attempt - 1)\n    return f\"moved to DLQ after {max_attempts} attempts ({waited}s of waiting)\"\n\nprint(\"endpoint back after 2 failures:\", deliver_with_retries(2))\nprint(\"endpoint never recovers:\", deliver_with_retries(99))",
        "output": "endpoint back after 2 failures: delivered on attempt 3 after waiting 3s\nendpoint never recovers: moved to DLQ after 4 attempts (15s of waiting)",
        "codeNotes": [
          {
            "line": 6,
            "note": "Exponential backoff: waits of 1, 2, 4, 8 seconds."
          },
          {
            "line": 7,
            "note": "After the last attempt the message goes to the dead-letter queue."
          }
        ],
        "tryIt": "Allow 6 attempts. How long does the never-recovering case wait in total?",
        "check": {
          "question": "What does a dead-letter queue on an SNS subscription do?",
          "options": [
            "Deletes failed messages faster",
            "Keeps messages that could not be delivered after all retries",
            "Sends messages twice"
          ],
          "answer": 1,
          "why": "The DLQ keeps undeliverable messages so they can be inspected and replayed."
        }
      },
      {
        "title": "Push notifications, email and SMS",
        "say": [
          "SNS also delivers straight to people: mobile push notifications (through Apple and Google push services), SMS text messages and email.",
          "For apps, you register each device's push token as an endpoint; publishing to that endpoint shows a notification on the phone.",
          "SMS and email through SNS suit simple alerts, such as \"your server CPU is high\". For marketing email or rich templates, Amazon SES (Simple Email Service) is the right tool.",
          "Respect limits and people: SMS costs money per message and is regulated in many countries, and users can opt out. Never send more than people asked for.",
          "CloudWatch alarms (Day 25) commonly publish to an SNS topic that emails the on-call engineer and posts to a chat channel at the same time.",
          "The example formats one alert differently for each channel, with a short text for SMS and a longer message for email.",
          "One event, many channels, each formatted for its audience: that is fan-out applied to people."
        ],
        "example": "A school that sends the same \"snow day\" notice as a text to parents, an email with details, and an announcement on the website.",
        "code": "alert = {\"service\": \"checkout-api\", \"metric\": \"5xx errors\", \"value\": 37, \"threshold\": 10}\n\ndef for_sms(a):\n    return f\"ALERT {a['service']}: {a['metric']} {a['value']}\"[:70]\n\ndef for_email(a):\n    return (f\"Subject: [ALARM] {a['service']}\\n\"\n            f\"{a['metric']} is {a['value']}, above the threshold of {a['threshold']}.\\n\"\n            \"Runbook: check the latest deploy and the payment provider status.\")\n\nprint(for_sms(alert))\nprint(for_email(alert))",
        "output": "ALERT checkout-api: 5xx errors 37\nSubject: [ALARM] checkout-api\n5xx errors is 37, above the threshold of 10.\nRunbook: check the latest deploy and the payment provider status.",
        "codeNotes": [
          {
            "line": 4,
            "note": "Keep SMS short; long texts are split and cost more."
          },
          {
            "line": 7,
            "note": "Email can carry the detail and a runbook link."
          }
        ],
        "tryIt": "Add a for_chat function that formats the alert with an emoji and the service name in bold markdown.",
        "check": {
          "question": "Which service fits a monthly newsletter with rich HTML templates?",
          "options": [
            "SNS email subscriptions",
            "Amazon SES",
            "SQS"
          ],
          "answer": 1,
          "why": "SNS email is for simple notifications; SES is built for rich and bulk email."
        }
      },
      {
        "title": "Practice time: fan out and filter",
        "say": [
          "Practice 1: fanout(subscriptions, message, deliver). Keep three results: a delivered list, a failed list and a skipped count.",
          "Skip non-confirmed subscriptions before trying to deliver, and wrap each deliver call in try/except so one failure does not stop the loop.",
          "The checks use a deliver function that raises for one endpoint, and verify that the others still received exactly one copy each.",
          "Practice 2: matches_filter(policy, attributes). One all(...) expression does the job: each policy attribute must be in the message attributes, and its Value must be in the allowed list.",
          "Read the Value field; comparing the whole {\"Type\": ..., \"Value\": ...} dictionary with a string will never match.",
          "These two functions are a miniature SNS. Real SNS adds numeric ranges, prefix matching and \"anything-but\" rules to filter policies, built on the same idea.",
          "The example shows the classic mistake of comparing the whole attribute dictionary."
        ],
        "example": "Checking the name on an envelope, not the whole envelope, against your guest list.",
        "code": "attrs = {\"customer\": {\"Type\": \"String\", \"Value\": \"VIP\"}}\nallowed = [\"VIP\", \"ENTERPRISE\"]\nprint(\"whole dict in list:\", attrs[\"customer\"] in allowed)\nprint(\"Value in list:\", attrs[\"customer\"][\"Value\"] in allowed)",
        "output": "whole dict in list: False\nValue in list: True",
        "codeNotes": [
          {
            "line": 3,
            "note": "A dict is never equal to a string, so this is always False."
          },
          {
            "line": 4,
            "note": "Compare the Value field instead."
          }
        ],
        "tryIt": "Add a numeric attribute {\"Type\": \"Number\", \"Value\": \"250\"} and write a rule for \"amount over 100\".",
        "check": {
          "question": "fanout gets 3 confirmed and 1 pending subscription; one confirmed endpoint raises. What are the counts?",
          "options": [
            "3 delivered, 0 failed, 1 skipped",
            "2 delivered, 1 failed, 1 skipped",
            "0 delivered, 3 failed, 1 skipped"
          ],
          "answer": 1,
          "why": "Two confirmed deliveries succeed, one fails and is recorded, and the pending one is skipped."
        }
      }
    ],
    "summary": [
      "Pub/sub sends one published message to every subscriber of a topic; publishers do not know subscribers.",
      "SNS-to-SQS fan-out gives each service its own durable queue.",
      "Filter policies deliver only matching messages; every policy attribute must match its allowed list.",
      "SNS retries with backoff; attach dead-letter queues to important subscriptions and alarm on them.",
      "SNS also reaches people through push, SMS and email; use SES for rich email."
    ],
    "projectStep": {
      "title": "Event fan-out for your app",
      "steps": [
        "Name one important event in your app and list every service that should react to it.",
        "Model the fan-out with fanout(), including a pending and a broken subscription.",
        "Write a filter policy for a subscriber that needs only some of the messages."
      ]
    }
  },
  {
    "day": 20,
    "title": "Amazon EventBridge: Serverless Event Bus & Schema Registry",
    "goal": "You can explain what an event bus adds beyond SNS, write EventBridge rules with nested event patterns, build valid custom events, use schedules and archives, and choose between SNS, SQS and EventBridge.",
    "minutes": 30,
    "recap": "You have queues (SQS) and topics (SNS). EventBridge is a smarter event router: it matches events on their content and connects your services, AWS services and SaaS apps.",
    "parts": [
      {
        "title": "Events and the event bus",
        "say": [
          "An event is a record that something happened: an order was placed, a file was uploaded, a server changed state. It describes the past and does not ask anyone to do anything.",
          "Amazon EventBridge collects events on an event bus. Every AWS account has a default bus that receives events from AWS services, such as \"EC2 instance stopped\".",
          "You can create custom buses for your own application events, and partner buses receive events from SaaS providers such as Zendesk or Shopify.",
          "Rules on a bus match events by pattern and send them to targets: Lambda, SQS, SNS, Step Functions, another bus, or an API destination (any HTTPS endpoint).",
          "Unlike SNS topics, where subscribers filter by attributes, EventBridge routes on the content of the whole event, including nested fields in the detail section.",
          "The example prints a typical EventBridge event so you know its shape.",
          "Thinking in events, \"what happened?\" rather than \"what should you do?\", keeps services independent and easy to extend."
        ],
        "example": "A town noticeboard where anyone can pin announcements, and people set up simple rules like \"tell me about anything posted by the library about children's events\".",
        "code": "event = {\n    \"version\": \"0\",\n    \"id\": \"6a7e8feb-b491-4cf7-a9f1-bf3703467718\",\n    \"detail-type\": \"PaymentSucceeded\",\n    \"source\": \"pinit.billing\",\n    \"time\": \"2026-09-29T10:15:00Z\",\n    \"region\": \"ap-south-1\",\n    \"detail\": {\"order_id\": \"ord-981\", \"amount\": 1499, \"currency\": \"INR\"},\n}\nfor key in [\"source\", \"detail-type\", \"time\"]:\n    print(f\"{key:12} {event[key]}\")\nprint(\"detail:\", event[\"detail\"])",
        "output": "source       pinit.billing\ndetail-type  PaymentSucceeded\ntime         2026-09-29T10:15:00Z\ndetail: {'order_id': 'ord-981', 'amount': 1499, 'currency': 'INR'}",
        "codeNotes": [
          {
            "line": 4,
            "note": "detail-type names what happened."
          },
          {
            "line": 8,
            "note": "detail holds your own data, any JSON you like."
          }
        ],
        "tryIt": "Write the event your app would send when a user signs up.",
        "check": {
          "question": "What is an event, in event-driven design?",
          "options": [
            "A command telling a service what to do",
            "A record that something happened",
            "A database table"
          ],
          "answer": 1,
          "why": "Events describe facts in the past; any interested service can react."
        }
      },
      {
        "title": "Event patterns",
        "say": [
          "A rule's event pattern is JSON with the same shape as the events it should match. Each field in the pattern lists the values it accepts.",
          "For example {\"source\": [\"pinit.billing\"], \"detail-type\": [\"PaymentSucceeded\"]} matches payment successes from billing, whatever the detail contains.",
          "Patterns can go into the detail: {\"detail\": {\"currency\": [\"USD\", \"EUR\"]}} matches only events whose nested currency is USD or EUR.",
          "Any field not mentioned in the pattern is ignored, so an empty pattern {} would match everything (EventBridge itself requires at least one field, but the matching idea is the same).",
          "Practice 1 is match_pattern(pattern, event). For each key in the pattern: the key must exist in the event; if the pattern value is a dictionary, match it recursively; otherwise the event value must be in the list.",
          "Recursion is the natural fit here, because patterns and events nest to any depth.",
          "The example tests one pattern against several events."
        ],
        "example": "A job alert that says \"software jobs, in Bengaluru or Pune, with a remote option\": each condition must hold, and any listed city will do.",
        "code": "def match_pattern(pattern, event):\n    for key, want in pattern.items():\n        if key not in event:\n            return False\n        if isinstance(want, dict):\n            if not isinstance(event[key], dict) or not match_pattern(want, event[key]):\n                return False\n        elif event[key] not in want:\n            return False\n    return True\n\npattern = {\"source\": [\"pinit.billing\"], \"detail\": {\"currency\": [\"USD\", \"EUR\"]}}\nfor ev in [{\"source\": \"pinit.billing\", \"detail\": {\"currency\": \"EUR\", \"amount\": 5}},\n           {\"source\": \"pinit.billing\", \"detail\": {\"currency\": \"INR\"}},\n           {\"source\": \"pinit.auth\", \"detail\": {\"currency\": \"USD\"}}]:\n    print(ev, \"->\", match_pattern(pattern, ev))",
        "output": "{'source': 'pinit.billing', 'detail': {'currency': 'EUR', 'amount': 5}} -> True\n{'source': 'pinit.billing', 'detail': {'currency': 'INR'}} -> False\n{'source': 'pinit.auth', 'detail': {'currency': 'USD'}} -> False",
        "codeNotes": [
          {
            "line": 5,
            "note": "A nested pattern is matched by calling the same function on the nested event."
          },
          {
            "line": 8,
            "note": "A list lists the accepted values."
          }
        ],
        "tryIt": "Add \"amount\" to the pattern's detail with the list [5]. Which events still match?",
        "check": {
          "question": "Pattern {\"source\": [\"a\"]}. Event {\"source\": \"a\", \"detail\": {\"x\": 1}}. Does it match?",
          "options": [
            "No, detail is not in the pattern",
            "Yes, fields not in the pattern are ignored",
            "Only if detail is empty"
          ],
          "answer": 1,
          "why": "Patterns only constrain the fields they mention."
        }
      },
      {
        "title": "Publishing your own events",
        "say": [
          "Applications publish custom events with the PutEvents API. You set the source, the detail-type and the detail; EventBridge fills in the id, time, account and region.",
          "Choose sources like \"company.service\", for example \"pinit.orders\". Sources starting with \"aws.\" are reserved for AWS services, and EventBridge rejects custom events that use them.",
          "Keep detail-type names in the past tense and specific: OrderPlaced, PaymentFailed, UserEmailVerified. Vague names such as \"Update\" make rules hard to write.",
          "Keep events small and self-contained. Include ids and the key facts; consumers can fetch more if they need it.",
          "Practice 2 is make_event(source, detail_type, detail, event_id, time). Validate the source (it must contain a dot and not start with \"aws.\") and return the full envelope with version \"0\".",
          "Passing event_id and time in, instead of generating them inside, keeps the function deterministic and testable, the same trick as in earlier days.",
          "The example builds a valid event and shows the validation catching a reserved source."
        ],
        "example": "Posting a notice on the board in the standard format the council requires, with your organisation's name, a clear title and the date.",
        "code": "def make_event(source, detail_type, detail, event_id, time):\n    if \".\" not in source or source.startswith(\"aws.\"):\n        raise ValueError(f\"bad source: {source}\")\n    return {\"version\": \"0\", \"id\": event_id, \"source\": source,\n            \"detail-type\": detail_type, \"time\": time, \"detail\": detail}\n\nprint(make_event(\"pinit.orders\", \"OrderPlaced\", {\"order_id\": \"ord-1\"}, \"ev-1\", \"2026-09-29T10:00:00Z\"))\nfor bad in [\"orders\", \"aws.s3\"]:\n    try:\n        make_event(bad, \"X\", {}, \"ev-2\", \"2026-09-29T10:00:00Z\")\n    except ValueError as err:\n        print(\"rejected:\", err)",
        "output": "{'version': '0', 'id': 'ev-1', 'source': 'pinit.orders', 'detail-type': 'OrderPlaced', 'time': '2026-09-29T10:00:00Z', 'detail': {'order_id': 'ord-1'}}\nrejected: bad source: orders\nrejected: bad source: aws.s3",
        "codeNotes": [
          {
            "line": 2,
            "note": "Custom sources look like company.service and must not start with aws."
          },
          {
            "line": 4,
            "note": "The standard EventBridge envelope."
          }
        ],
        "tryIt": "Also reject an empty detail_type. Where does the check go?",
        "check": {
          "question": "Why can a custom event not use the source \"aws.ec2\"?",
          "options": [
            "It is too short",
            "Sources starting with aws. are reserved for AWS services",
            "EC2 does not send events"
          ],
          "answer": 1,
          "why": "The aws. prefix belongs to events published by AWS itself."
        }
      },
      {
        "title": "Schedules, archives and replay",
        "say": [
          "EventBridge can also produce events on a timer. EventBridge Scheduler runs one-off or recurring schedules with cron or rate expressions, such as \"rate(5 minutes)\" or \"cron(0 2 * * ? *)\" for 2 a.m. every day.",
          "That replaces a server whose only job was running cron. A nightly clean-up Lambda needs no always-on machine.",
          "Archives keep a copy of events that pass through a bus, for as long as you choose. Replay sends archived events back through the bus.",
          "Replay is powerful for recovery and testing: if a consumer had a bug for two hours, fix it and replay those two hours of events. This only works safely because consumers are idempotent (Day 15).",
          "The schema registry discovers the structure of events on a bus and can generate code bindings, so teams know exactly what fields an event carries.",
          "The example computes the next few runs of a simple \"every N minutes\" schedule and replays archived events after a fix.",
          "Schedules, archives and replay turn the event bus into a small time machine for your system."
        ],
        "example": "A security camera recording: if something was missed, you rewind and watch that part again, this time paying attention.",
        "code": "start, every = 0, 15\nprint(\"next runs (minutes):\", [start + every * i for i in range(1, 5)])\n\narchive = [{\"id\": i, \"detail-type\": \"OrderPlaced\"} for i in range(1, 6)]\nprocessed_ok = {1, 2}                     # the buggy consumer failed from event 3 on\ndef fixed_consumer(ev):\n    processed_ok.add(ev[\"id\"])\nfor ev in archive:\n    if ev[\"id\"] not in processed_ok:\n        fixed_consumer(ev)\nprint(\"after replay:\", sorted(processed_ok))",
        "output": "next runs (minutes): [15, 30, 45, 60]\nafter replay: [1, 2, 3, 4, 5]",
        "codeNotes": [
          {
            "line": 9,
            "note": "Skipping already-processed events is what makes replay safe."
          }
        ],
        "tryIt": "What would happen on replay if the consumer were not idempotent and processed events 1 and 2 again?",
        "check": {
          "question": "What does EventBridge replay do?",
          "options": [
            "Deletes old events",
            "Sends archived events back through the bus",
            "Speeds up delivery"
          ],
          "answer": 1,
          "why": "Replay re-publishes archived events so fixed consumers can process them."
        }
      },
      {
        "title": "SNS, SQS or EventBridge?",
        "say": [
          "These three services overlap, and choosing well keeps designs simple.",
          "SQS is a queue: one message, processed by one consumer, stored until handled. Use it to buffer work and smooth load between two parts.",
          "SNS is a topic: one message, pushed to many subscribers quickly and cheaply, with simple attribute filters. Use it for high-volume fan-out and for notifying people.",
          "EventBridge is a router: rich content-based rules, many AWS and SaaS sources, schedules, archives and replay. Use it as the backbone between services and teams, when routing logic matters more than raw volume.",
          "They combine well. A common design: services publish to EventBridge; rules send matching events to SQS queues; each service consumes its own queue.",
          "The example turns these rules of thumb into a small decision function.",
          "When in doubt, ask two questions: how many receivers per message, and do I need to route on content?"
        ],
        "example": "Choosing between a mailbox (holds letters for one household), a loudspeaker (everyone hears at once) and a mail-sorting office (reads each address and sends it the right way).",
        "code": "def choose(receivers, route_on_content, need_replay=False):\n    if need_replay or route_on_content:\n        return \"EventBridge\"\n    if receivers > 1:\n        return \"SNS (+ SQS per subscriber for durability)\"\n    return \"SQS\"\n\ncases = [(\"resize jobs for one worker pool\", 1, False), (\"order placed to 5 services\", 5, False),\n         (\"only EUR payments to finance\", 2, True), (\"audit every event, replay later\", 3, False, True)]\nfor name, *args in cases:\n    print(f\"{name:34} -> {choose(*args)}\")",
        "output": "resize jobs for one worker pool    -> SQS\norder placed to 5 services         -> SNS (+ SQS per subscriber for durability)\nonly EUR payments to finance       -> EventBridge\naudit every event, replay later    -> EventBridge",
        "codeNotes": [
          {
            "line": 10,
            "note": "name, *args unpacks the first item and collects the rest."
          }
        ],
        "tryIt": "Add a case for \"text the on-call engineer\". Which service does it pick, and is that right?",
        "check": {
          "question": "Five services must each process every order event reliably. What is a good design?",
          "options": [
            "One SQS queue shared by all five",
            "SNS or EventBridge fanning out to one SQS queue per service",
            "Each service polls the database"
          ],
          "answer": 1,
          "why": "Fan-out gives each service its own copy, and per-service queues make it durable."
        }
      },
      {
        "title": "Practice time: match and build events",
        "say": [
          "Practice 1: match_pattern(pattern, event). Loop over the pattern's items. Missing key: False. Dictionary pattern value: recurse on the event's value (which must also be a dictionary). List: membership test.",
          "Return True only after every key has passed. An empty pattern never enters the loop, so it returns True, as the checks expect.",
          "Practice 2: make_event(source, detail_type, detail, event_id, time). Validate first and raise ValueError for bad sources; then return the envelope with the exact key \"detail-type\" (with a hyphen).",
          "Python cannot use detail-type as a variable name, which is why it is a string key in a dictionary here and a parameter called detail_type.",
          "The checks try \"orders\" (no dot) and \"aws.ec2\" (reserved), and compare your envelope with the expected dictionary exactly.",
          "With these, you have the building blocks of Milestone 3 tomorrow: events, patterns and routing to queues.",
          "The example shows the recursion working two levels deep."
        ],
        "example": "Russian nesting dolls: to check the smallest doll you open each one in turn, using the same steps every time.",
        "code": "def match(p, e):\n    return all(k in e and (match(v, e[k]) if isinstance(v, dict) else e[k] in v) for k, v in p.items())\n\npattern = {\"detail\": {\"customer\": {\"tier\": [\"gold\"]}}}\nprint(match(pattern, {\"detail\": {\"customer\": {\"tier\": \"gold\", \"id\": 7}}}))\nprint(match(pattern, {\"detail\": {\"customer\": {\"tier\": \"silver\"}}}))\nprint(match(pattern, {\"detail\": {}}))",
        "output": "True\nFalse\nFalse",
        "codeNotes": [
          {
            "line": 2,
            "note": "The same function handles every level of nesting."
          }
        ],
        "tryIt": "This compact version crashes in one case the long version handles. Find it (hint: what if e[k] is not a dict?).",
        "check": {
          "question": "Which key name must an EventBridge event use for its type?",
          "options": [
            "detail_type",
            "detail-type",
            "DetailType"
          ],
          "answer": 1,
          "why": "EventBridge events use the hyphenated key \"detail-type\"."
        }
      }
    ],
    "summary": [
      "EventBridge routes events on buses to targets using content-based rules.",
      "Event patterns mirror the event's shape; lists give allowed values and nested dicts match nested fields.",
      "Custom events need a source like company.service (not aws.) and a clear past-tense detail-type.",
      "Scheduler replaces cron servers; archives and replay let fixed consumers catch up safely.",
      "SQS buffers for one consumer, SNS fans out fast, EventBridge routes on content; combine them."
    ],
    "projectStep": {
      "title": "Event bus for your app",
      "steps": [
        "List five events your app would publish, with source, detail-type and detail.",
        "Write a rule pattern for each consumer and test it with match_pattern.",
        "Decide where you would use SQS, SNS and EventBridge in your design."
      ]
    }
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: High-Scale E-Commerce Microservices Event Bus with SQS/SNS Fanout",
    "goal": "You can design an event-driven microservices backbone for an online shop: route events to service queues by rule, handle unknown targets and poison messages with dead-letter queues, keep consumers idempotent, and trace an order through the system.",
    "minutes": 30,
    "recap": "Milestone 3 combines queues (Day 18), fan-out (Day 19) and event routing (Day 20) into the backbone of an e-commerce platform where services never call each other directly.",
    "parts": [
      {
        "title": "The shop as independent services",
        "say": [
          "A growing online shop is usually split into services owned by different teams: orders, payments, inventory, shipping, email and analytics.",
          "If the order service called each of the others directly, one slow email provider could make checkout slow, and adding analytics would mean changing the order service.",
          "Instead, the order service publishes one event, OrderCreated, to an event bus. Rules route it to a queue for each interested service. Each service reads only its own queue.",
          "The order service now knows nothing about who listens. Checkout stays fast even if email is down, because the email queue simply fills up and drains later.",
          "Each service also publishes its own events, such as PaymentSucceeded or StockReserved, which others can react to. The whole shop becomes a conversation of events.",
          "This is sometimes called choreography: no central conductor; each service knows its own part. On Day 23 you meet the alternative, orchestration.",
          "The example lists which services react to which events, as data."
        ],
        "example": "A newsroom where reporters post stories to a shared wire, and each desk (sport, business, local) picks up the stories it covers, without reporters phoning every desk.",
        "code": "subscriptions = {\n    \"OrderCreated\": [\"inventory\", \"payments\", \"email\", \"analytics\"],\n    \"PaymentSucceeded\": [\"shipping\", \"email\", \"analytics\"],\n    \"PaymentFailed\": [\"inventory\", \"email\"],\n    \"OrderShipped\": [\"email\", \"analytics\"],\n}\nfor event, services in subscriptions.items():\n    print(f\"{event:17} -> {', '.join(services)}\")\nbusiest = max({s for v in subscriptions.values() for s in v}, key=lambda s: sum(s in v for v in subscriptions.values()))\nprint(\"Service listening to the most events:\", busiest)",
        "output": "OrderCreated      -> inventory, payments, email, analytics\nPaymentSucceeded  -> shipping, email, analytics\nPaymentFailed     -> inventory, email\nOrderShipped      -> email, analytics\nService listening to the most events: email",
        "codeNotes": [
          {
            "line": 3,
            "note": "Each event lists the services that care about it."
          },
          {
            "line": 9,
            "note": "Count, for each service, how many event types it receives."
          }
        ],
        "tryIt": "Add a \"fraud-check\" service that listens to OrderCreated. Which service code had to change?",
        "check": {
          "question": "Why does publishing events keep checkout fast when the email service is down?",
          "options": [
            "Email is skipped forever",
            "The order service only publishes; the email queue holds the event until email recovers",
            "Checkout waits for email"
          ],
          "answer": 1,
          "why": "Queues decouple the services, so a slow consumer does not slow the producer."
        }
      },
      {
        "title": "Routing events to service queues",
        "say": [
          "Practice 1 is route_event(event, rules, queues). Each rule has a source, a detail_type and a target queue name. A rule matches when both fields equal the event's source and detail-type.",
          "For every matching rule, append the event to queues[target]. Several rules can match one event; that is the fan-out.",
          "A rule might point at a queue that no longer exists, perhaps a retired service. Do not crash; count it as a dead letter so someone can clean up the rule.",
          "Return how many rules matched, how many dead letters there were, and a status: ROUTED if at least one queue received the event, NO_MATCH otherwise.",
          "NO_MATCH is worth monitoring. An event no one listens to might be fine, or it might mean a rule has a typo and a service is silently missing work.",
          "The example routes an OrderCreated event through a small rule set that includes a stale target.",
          "This is a tiny model of what EventBridge rules with SQS targets do for you in the real service."
        ],
        "example": "A post room that copies each letter into every department tray on the list, and notes any department that has moved out.",
        "code": "def route_event(event, rules, queues):\n    matched = dead = delivered = 0\n    for r in rules:\n        if r[\"source\"] == event[\"source\"] and r[\"detail_type\"] == event[\"detail-type\"]:\n            matched += 1\n            if r[\"target\"] in queues:\n                queues[r[\"target\"]].append(event); delivered += 1\n            else:\n                dead += 1\n    return {\"matched\": matched, \"dead_letters\": dead, \"status\": \"ROUTED\" if delivered else \"NO_MATCH\"}\n\nqueues = {\"inventory-q\": [], \"email-q\": []}\nrules = [{\"source\": \"orders\", \"detail_type\": \"OrderCreated\", \"target\": t} for t in [\"inventory-q\", \"email-q\", \"loyalty-q\"]]\nprint(route_event({\"source\": \"orders\", \"detail-type\": \"OrderCreated\", \"detail\": {\"id\": 1}}, rules, queues))\nprint({name: len(q) for name, q in queues.items()})",
        "output": "{'matched': 3, 'dead_letters': 1, 'status': 'ROUTED'}\n{'inventory-q': 1, 'email-q': 1}",
        "codeNotes": [
          {
            "line": 6,
            "note": "A missing queue is counted, not a crash."
          },
          {
            "line": 10,
            "note": "ROUTED only if some queue actually received the event."
          }
        ],
        "tryIt": "Route an \"OrderCancelled\" event. What status comes back, and should anyone be alerted?",
        "check": {
          "question": "Two rules match an event and both queues exist. What happens?",
          "options": [
            "Only the first queue gets it",
            "Both queues get a copy",
            "The event is rejected"
          ],
          "answer": 1,
          "why": "Every matching rule delivers, which is how one event fans out to several services."
        }
      },
      {
        "title": "Poison messages and dead-letter queues",
        "say": [
          "Sometimes a message can never be processed: it has a missing field, a bug hits it every time, or it refers to data that was deleted. This is a poison message.",
          "Without protection, a poison message comes back after every visibility timeout (Day 18) and is retried forever, wasting money and hiding real work.",
          "SQS redrive policies fix this. You set maxReceiveCount, for example 3. When a message has been received more than that many times without being deleted, SQS moves it to a dead-letter queue (DLQ).",
          "The DLQ holds failed messages for engineers to inspect. After fixing the bug, you redrive them back to the main queue to be processed again.",
          "Practice 2 is redrive(messages, max_receive_count): split message ids into those that stay in the main queue and those moved to the DLQ, keeping the original order.",
          "Use \"more than\" (>), matching SQS: with a maximum of 3, a message is allowed three receives and moves on the fourth.",
          "The example processes a queue containing one poison message and shows it landing in the DLQ."
        ],
        "example": "A letter the post office has tried to deliver three times goes to the \"undeliverable\" shelf, instead of riding around in the van forever.",
        "code": "MAX_RECEIVES = 3\nqueue = [{\"id\": \"ok-1\", \"receives\": 0, \"poison\": False}, {\"id\": \"bad-7\", \"receives\": 0, \"poison\": True},\n         {\"id\": \"ok-2\", \"receives\": 0, \"poison\": False}]\ndlq, done = [], []\nwhile queue:\n    msg = queue.pop(0)\n    msg[\"receives\"] += 1\n    if not msg[\"poison\"]:\n        done.append(msg[\"id\"])\n    elif msg[\"receives\"] > MAX_RECEIVES - 1:\n        dlq.append(msg[\"id\"])\n    else:\n        queue.append(msg)       # not deleted: it comes back later\nprint(\"processed:\", done, \"dead-letter queue:\", dlq)",
        "output": "processed: ['ok-1', 'ok-2'] dead-letter queue: ['bad-7']",
        "codeNotes": [
          {
            "line": 10,
            "note": "After the third failed receive, the next redelivery would go to the DLQ."
          },
          {
            "line": 13,
            "note": "An undeleted message returns to the queue."
          }
        ],
        "tryIt": "Set MAX_RECEIVES to 5. Does the outcome change? What changes is how long the poison message wastes workers.",
        "check": {
          "question": "What is a dead-letter queue for?",
          "options": [
            "Storing deleted accounts",
            "Holding messages that failed too many times, for inspection and later redrive",
            "Speeding up the main queue"
          ],
          "answer": 1,
          "why": "The DLQ isolates poison messages so the main queue keeps flowing."
        }
      },
      {
        "title": "Idempotent consumers and exactly-once effects",
        "say": [
          "SQS standard queues and EventBridge deliver at least once, and redrive sends messages again on purpose. So every consumer in the shop must be idempotent.",
          "The payment service is the classic case. Charging a card twice for one order is the worst kind of bug, because customers notice and trust is lost.",
          "The pattern: every event carries a unique id (the EventBridge event id or an order id). Before acting, the consumer records the id in a table with a conditional write. If the id already exists, it skips the work.",
          "With DynamoDB, a conditional put with attribute_not_exists(event_id) succeeds only once, even if two copies of the consumer run at the same moment.",
          "You cannot get exactly-once delivery from the network, but you can get exactly-once effects: the charge happens once no matter how many times the message arrives.",
          "The example delivers the same payment event three times, including once in parallel, and the card is charged once.",
          "Payment providers support the same idea with idempotency keys on their APIs, so even retries to them are safe."
        ],
        "example": "A cloakroom that writes your ticket number in a book before taking your coat: if you hand over the same ticket again, the attendant sees it is already there.",
        "code": "processed_ids = set()\ncharges = []\n\ndef conditional_put(event_id):\n    if event_id in processed_ids:\n        return False\n    processed_ids.add(event_id)\n    return True\n\ndef handle_payment(event):\n    if not conditional_put(event[\"id\"]):\n        return \"duplicate ignored\"\n    charges.append(event[\"detail\"][\"amount\"])\n    return \"charged\"\n\nev = {\"id\": \"evt-555\", \"detail\": {\"order_id\": \"ord-9\", \"amount\": 1499}}\nprint([handle_payment(ev) for _ in range(3)])\nprint(\"card charged:\", charges)",
        "output": "['charged', 'duplicate ignored', 'duplicate ignored']\ncard charged: [1499]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Stands in for a DynamoDB put with attribute_not_exists."
          },
          {
            "line": 11,
            "note": "Record first, then act; a repeat is skipped."
          }
        ],
        "tryIt": "What goes wrong if the consumer charges FIRST and records the id afterwards, and crashes in between?",
        "check": {
          "question": "Can you get exactly-once delivery over a network?",
          "options": [
            "Yes, with SQS standard",
            "Not reliably, but idempotent consumers give exactly-once effects",
            "Only with UDP"
          ],
          "answer": 1,
          "why": "Duplicates are unavoidable in practice; idempotency makes them harmless."
        }
      },
      {
        "title": "Tracing an order through the system",
        "say": [
          "In a system of many services, \"where is order 981?\" is a hard question. Each service has its own logs on its own machines.",
          "Correlation ids solve it. The first service gives the order a correlation id (often the order id itself), and every event and log line about that order carries it.",
          "Then a single search across all logs for that id shows the whole journey: created, payment succeeded, stock reserved, shipped, emailed.",
          "AWS X-Ray and OpenTelemetry go further with distributed tracing, timing each hop so you can see where time went, as you learned in distributed systems.",
          "Log in a structured format (JSON) with fields like service, event, correlation_id and time. Structured logs can be searched and counted; free text cannot.",
          "The example collects log lines from four services and rebuilds one order's timeline by filtering and sorting on its correlation id.",
          "On Day 25 you will query logs like these with CloudWatch Logs Insights."
        ],
        "example": "A parcel tracking number printed on every label and scanned at every depot, so one search shows the whole route.",
        "code": "logs = [\n    {\"t\": 3, \"service\": \"payments\", \"event\": \"PaymentSucceeded\", \"cid\": \"ord-981\"},\n    {\"t\": 1, \"service\": \"orders\", \"event\": \"OrderCreated\", \"cid\": \"ord-981\"},\n    {\"t\": 2, \"service\": \"orders\", \"event\": \"OrderCreated\", \"cid\": \"ord-982\"},\n    {\"t\": 7, \"service\": \"email\", \"event\": \"ReceiptSent\", \"cid\": \"ord-981\"},\n    {\"t\": 5, \"service\": \"inventory\", \"event\": \"StockReserved\", \"cid\": \"ord-981\"},\n]\ntimeline = sorted((l for l in logs if l[\"cid\"] == \"ord-981\"), key=lambda l: l[\"t\"])\nfor l in timeline:\n    print(f\"t={l['t']}  {l['service']:10} {l['event']}\")",
        "output": "t=1  orders     OrderCreated\nt=3  payments   PaymentSucceeded\nt=5  inventory  StockReserved\nt=7  email      ReceiptSent",
        "codeNotes": [
          {
            "line": 8,
            "note": "Filter by the correlation id, then sort by time."
          }
        ],
        "tryIt": "Which step took longest after the previous one? Print the gap between each step.",
        "check": {
          "question": "What is a correlation id?",
          "options": [
            "A database password",
            "An id carried by every event and log line about one piece of work, so it can be traced",
            "The AWS account number"
          ],
          "answer": 1,
          "why": "Correlation ids tie together everything that happened for one order or call."
        }
      },
      {
        "title": "Milestone practice: build the backbone",
        "say": [
          "Practice 1: route_event(event, rules, queues). Compare rule[\"source\"] with event[\"source\"] and rule[\"detail_type\"] with event[\"detail-type\"] (note the hyphen in the event key).",
          "Keep three counters: matched, dead letters and delivered. The status depends on delivered, not matched: a rule that matched but pointed at a missing queue delivered nothing.",
          "Practice 2: redrive(messages, max_receive_count). Two list comprehensions, one with <= and one with >, keep the original order automatically.",
          "Together these model the two halves of a reliable backbone: getting each event to every service that needs it, and moving hopeless messages aside so the rest keep flowing.",
          "Extensions to try: route on a nested detail field with match_pattern from Day 20; alarm when the DLQ is not empty; and add a correlation id to every routed event.",
          "Well done on Milestone 3. You have designed the kind of event-driven backbone that real e-commerce companies run on.",
          "The example runs an end-to-end check: route, process, and redrive the failures."
        ],
        "example": "A railway signal box: each train is sent down every track it needs, and a broken-down train is shunted into a siding so the line stays open.",
        "code": "queues = {\"inventory-q\": [], \"email-q\": []}\nrules = [(\"orders\", \"OrderCreated\", \"inventory-q\"), (\"orders\", \"OrderCreated\", \"email-q\")]\nevents = [{\"source\": \"orders\", \"detail-type\": \"OrderCreated\", \"id\": i} for i in range(1, 4)]\nfor ev in events:\n    for src, dt, target in rules:\n        if (src, dt) == (ev[\"source\"], ev[\"detail-type\"]):\n            queues[target].append({\"id\": ev[\"id\"], \"receives\": 4 if ev[\"id\"] == 2 else 1})\nfor name, q in queues.items():\n    main = [m[\"id\"] for m in q if m[\"receives\"] <= 3]\n    dlq = [m[\"id\"] for m in q if m[\"receives\"] > 3]\n    print(f\"{name:12} main {main} dlq {dlq}\")",
        "output": "inventory-q  main [1, 3] dlq [2]\nemail-q      main [1, 3] dlq [2]",
        "codeNotes": [
          {
            "line": 6,
            "note": "Compare the pair (source, detail-type) in one go."
          },
          {
            "line": 9,
            "note": "Split each queue into main and dead-letter parts."
          }
        ],
        "tryIt": "Add a third rule for \"OrderCreated\" to \"analytics-q\" without creating that queue. What should your real route_event report?",
        "check": {
          "question": "In route_event, which counter decides the status ROUTED?",
          "options": [
            "matched",
            "delivered (events actually placed in a queue)",
            "dead_letters"
          ],
          "answer": 1,
          "why": "A match whose queue is missing did not deliver, so it cannot count as routed."
        }
      }
    ],
    "summary": [
      "Services publish events; rules route them to one queue per interested service (choreography).",
      "Count rules pointing at missing queues as dead letters instead of crashing; watch NO_MATCH.",
      "Redrive policies move messages received more than maxReceiveCount times to a DLQ.",
      "At-least-once delivery needs idempotent consumers; conditional writes give exactly-once effects.",
      "Correlation ids and structured logs let you trace one order across every service."
    ],
    "projectStep": {
      "title": "Milestone 3: shop event backbone",
      "steps": [
        "List your shop's events and the services that consume each one.",
        "Route a day of sample events with route_event and redrive any poison messages.",
        "Make the payment consumer idempotent and prove a triple delivery charges once."
      ]
    }
  },
  {
    "day": 22,
    "title": "AWS ECS & AWS Fargate Serverless Container Architecture",
    "goal": "You can explain containers, images and task definitions, run services on ECS with the Fargate launch type, choose valid CPU and memory sizes, pass configuration and secrets safely, and scale and deploy container services.",
    "minutes": 30,
    "recap": "Lambda runs short functions. Many apps are long-running web servers or workers packaged as containers. AWS ECS with Fargate runs those containers without you managing any servers.",
    "parts": [
      {
        "title": "Containers and images",
        "say": [
          "A container packages an application with everything it needs to run: the language runtime, libraries and configuration defaults. It runs the same on a laptop, in testing and in production.",
          "You describe how to build it in a Dockerfile, and the result is an image. Images are stored in a registry; on AWS that is Amazon Elastic Container Registry (ECR).",
          "Images are built in layers. Unchanged layers are cached, so putting rarely-changing steps (installing dependencies) before often-changing ones (copying your code) makes builds much faster.",
          "Tag images with something traceable, such as the Git commit id, rather than only \"latest\". Then you always know exactly what is running and can roll back.",
          "Containers start in seconds and share the host's kernel, so they are lighter than virtual machines, while still isolating apps from each other.",
          "The example shows a typical Python Dockerfile as text and checks it for two common mistakes.",
          "A small image is faster to pull and has fewer things that can be attacked, so slim base images are a good default."
        ],
        "example": "A shipping container: whatever is inside, every port, crane and ship knows how to handle the same standard box.",
        "code": "dockerfile = \"\"\"FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nUSER 1000\nCMD [\"gunicorn\", \"app:server\", \"--bind\", \"0.0.0.0:8080\"]\"\"\"\nlines = dockerfile.splitlines()\ncopy_all = next(i for i, l in enumerate(lines) if l.startswith(\"COPY . \"))\ninstall = next(i for i, l in enumerate(lines) if \"pip install\" in l)\nprint(\"dependencies installed before code copy (good caching):\", install < copy_all)\nprint(\"runs as a non-root user:\", any(l.startswith(\"USER \") and \"root\" not in l for l in lines))",
        "output": "dependencies installed before code copy (good caching): True\nruns as a non-root user: True",
        "codeNotes": [
          {
            "line": 3,
            "note": "Copy only the dependency list first, so this layer is cached."
          },
          {
            "line": 6,
            "note": "Do not run the app as root inside the container."
          }
        ],
        "tryIt": "Swap the COPY . . line above the pip install line. What does the caching check say, and why would builds get slower?",
        "check": {
          "question": "Why tag images with the Git commit id?",
          "options": [
            "It makes images smaller",
            "You know exactly which code is running and can roll back to a known image",
            "ECR requires it"
          ],
          "answer": 1,
          "why": "Traceable tags link each running container to the exact source that built it."
        }
      },
      {
        "title": "ECS: clusters, task definitions and services",
        "say": [
          "Amazon Elastic Container Service (ECS) runs containers for you. Three words matter.",
          "A task definition is the recipe: which image, how much CPU and memory, which port, environment variables, secrets, logging and the IAM role the task uses.",
          "A task is one running copy of that recipe. A service keeps a desired number of tasks running, replaces failed ones, and registers them with a load balancer target group (Day 8).",
          "A cluster is the logical group your services run in.",
          "Each task gets a task role (for calling AWS services, like Day 6) and an execution role (so ECS can pull the image and fetch secrets on its behalf). Keep them separate and minimal.",
          "Where do the containers actually run? With the EC2 launch type you manage the servers underneath. With Fargate, AWS runs them on managed infrastructure and you never see a server.",
          "The example builds a task definition as a Python dictionary, close to the real JSON."
        ],
        "example": "A restaurant chain: the recipe card (task definition), each dish being cooked (task), the manager who keeps ten dishes always ready (service), and the kitchen they are made in (cluster).",
        "code": "task_definition = {\n    \"family\": \"shop-api\",\n    \"cpu\": \"512\", \"memory\": \"1024\",\n    \"requiresCompatibilities\": [\"FARGATE\"],\n    \"taskRoleArn\": \"arn:aws:iam::111122223333:role/shop-api-task\",\n    \"executionRoleArn\": \"arn:aws:iam::111122223333:role/ecs-exec\",\n    \"containerDefinitions\": [{\"name\": \"api\", \"image\": \"111122223333.dkr.ecr.ap-south-1.amazonaws.com/shop-api:3f9a2c1\",\n                              \"portMappings\": [{\"containerPort\": 8080}]}],\n}\nservice = {\"desired\": 3, \"running\": 2}\nc = task_definition[\"containerDefinitions\"][0]\nprint(\"image tag:\", c[\"image\"].rsplit(\":\", 1)[1])\nprint(\"tasks to start:\", service[\"desired\"] - service[\"running\"])",
        "output": "image tag: 3f9a2c1\ntasks to start: 1",
        "codeNotes": [
          {
            "line": 3,
            "note": "Fargate sizes are set at the task level, as strings."
          },
          {
            "line": 7,
            "note": "The image tag is a commit id, not \"latest\"."
          }
        ],
        "tryIt": "Add an environment list with {\"name\": \"LOG_LEVEL\", \"value\": \"info\"} to the container.",
        "check": {
          "question": "What does an ECS service do?",
          "options": [
            "Builds images",
            "Keeps a desired number of tasks running and connected to a load balancer",
            "Stores secrets"
          ],
          "answer": 1,
          "why": "Services maintain the task count and replace failed tasks."
        }
      },
      {
        "title": "Fargate sizes",
        "say": [
          "Fargate does not accept any CPU and memory you like. CPU is set in units where 1024 means one vCPU, and each CPU size allows a range of memory sizes.",
          "For example, 256 units (a quarter vCPU) allows 512 MB, 1 GB or 2 GB. 1024 units (one vCPU) allows 2 GB to 8 GB in 1 GB steps. 4096 units allows 8 GB to 30 GB.",
          "Asking for an invalid pair makes the deployment fail, so teams validate sizes before deploying.",
          "Practice 1 is valid_fargate_size(cpu, memory_mb). Build a dictionary from each CPU size to the set of allowed memory values, using range with a step of 1024 for the larger sizes.",
          "Then the check is one line: memory_mb in ALLOWED.get(cpu, set()). An unknown CPU gets an empty set, so it is never valid.",
          "Choosing a size is right-sizing again (Day 7): measure what the container really uses, add headroom, and pick the smallest valid pair.",
          "The example lists the allowed memory sizes for a few CPU values."
        ],
        "example": "Choosing a T-shirt: sizes come in fixed combinations of chest and length, not any two numbers you like.",
        "code": "ALLOWED = {\n    256: {512, 1024, 2048},\n    512: set(range(1024, 4096 + 1, 1024)),\n    1024: set(range(2048, 8192 + 1, 1024)),\n    2048: set(range(4096, 16384 + 1, 1024)),\n}\nfor cpu, mems in ALLOWED.items():\n    print(f\"{cpu:5} CPU units ({cpu / 1024:g} vCPU): {min(mems)}-{max(mems)} MB, {len(mems)} options\")\nprint(\"1024 CPU with 3072 MB valid:\", 3072 in ALLOWED[1024])\nprint(\"1024 CPU with 1024 MB valid:\", 1024 in ALLOWED[1024])",
        "output": "  256 CPU units (0.25 vCPU): 512-2048 MB, 3 options\n  512 CPU units (0.5 vCPU): 1024-4096 MB, 4 options\n 1024 CPU units (1 vCPU): 2048-8192 MB, 7 options\n 2048 CPU units (2 vCPU): 4096-16384 MB, 13 options\n1024 CPU with 3072 MB valid: True\n1024 CPU with 1024 MB valid: False",
        "codeNotes": [
          {
            "line": 3,
            "note": "range(start, stop + 1, 1024) includes the top value."
          },
          {
            "line": 8,
            "note": ":g prints 0.25 and 1 without extra zeros."
          }
        ],
        "tryIt": "Add the 4096 CPU entry (8192 to 30720 MB). How many memory options does it have?",
        "check": {
          "question": "Is 256 CPU units with 4096 MB a valid Fargate size?",
          "options": [
            "Yes",
            "No, 256 units allows at most 2048 MB",
            "Only on Tuesdays"
          ],
          "answer": 1,
          "why": "A quarter vCPU supports only 512, 1024 or 2048 MB."
        }
      },
      {
        "title": "Configuration and secrets",
        "say": [
          "Containers read their settings from environment variables. That keeps one image usable in every environment: only the variables differ between staging and production.",
          "Secrets are different. Database passwords and API keys must never be written as plain environment values in the task definition, where anyone who can read the definition would see them.",
          "Instead, store secrets in AWS Secrets Manager or Systems Manager Parameter Store, and reference them in the task definition with valueFrom and the secret's ARN. ECS fetches them at start-up using the execution role.",
          "Practice 2 is container_env(plain, secrets). Return the environment list and the secrets list, each sorted by name, and raise ValueError if any name appears in both.",
          "That clash check is a real safety net. If DB_PASS appears as plain text and as a secret, one of them is a leaked password waiting to be found.",
          "Sorting by name makes the output stable, so re-running the tool does not show pointless differences in code review.",
          "The example builds the two lists and shows the clash being caught."
        ],
        "example": "A hotel giving staff the building address on a notice board (plain settings), but keeping the safe combination in a locked envelope handed over only at the start of a shift (secrets).",
        "code": "def container_env(plain, secrets):\n    clash = set(plain) & set(secrets)\n    if clash:\n        raise ValueError(f\"names in both lists: {sorted(clash)}\")\n    return {\"environment\": [{\"name\": n, \"value\": plain[n]} for n in sorted(plain)],\n            \"secrets\": [{\"name\": n, \"valueFrom\": secrets[n]} for n in sorted(secrets)]}\n\nprint(container_env({\"PORT\": \"8080\", \"LOG_LEVEL\": \"info\"}, {\"DB_PASS\": \"arn:aws:secretsmanager:ap-south-1:1:secret:db\"}))\ntry:\n    container_env({\"DB_PASS\": \"hunter2\"}, {\"DB_PASS\": \"arn:x\"})\nexcept ValueError as err:\n    print(\"blocked:\", err)",
        "output": "{'environment': [{'name': 'LOG_LEVEL', 'value': 'info'}, {'name': 'PORT', 'value': '8080'}], 'secrets': [{'name': 'DB_PASS', 'valueFrom': 'arn:aws:secretsmanager:ap-south-1:1:secret:db'}]}\nblocked: names in both lists: ['DB_PASS']",
        "codeNotes": [
          {
            "line": 2,
            "note": "Set intersection finds names used in both."
          },
          {
            "line": 6,
            "note": "valueFrom tells ECS to fetch the secret at start-up."
          }
        ],
        "tryIt": "Add a check that raises if a plain value looks like a password (for example the name contains \"PASS\").",
        "check": {
          "question": "Where should a database password for an ECS task live?",
          "options": [
            "As a plain environment variable in the task definition",
            "In Secrets Manager, referenced with valueFrom",
            "Inside the image"
          ],
          "answer": 1,
          "why": "Secrets Manager keeps it encrypted and out of the task definition and image."
        }
      },
      {
        "title": "Scaling and deploying services",
        "say": [
          "ECS services scale like Auto Scaling groups: target tracking on CPU, memory, or requests per target from the load balancer (Day 7 and Day 8 ideas again).",
          "Rolling deployments replace tasks gradually. minimumHealthyPercent and maximumPercent control the pace: with 100 and 200, ECS starts the new tasks first, waits for them to be healthy, then stops the old ones.",
          "The deployment circuit breaker watches a deployment and rolls back automatically if new tasks keep failing to start or failing health checks.",
          "Blue/green deployments (with AWS CodeDeploy) run the new version beside the old one and switch the load balancer over, with an instant way back.",
          "Fargate Spot runs tasks on spare capacity at a big discount, with the same two-minute warning as EC2 Spot (Day 7). Mix it in for workers that can be interrupted.",
          "The example simulates a rolling deployment with minimumHealthyPercent 100 and maximumPercent 150.",
          "Whatever the method, the goal is the same: users should never notice a deployment."
        ],
        "example": "Changing the tyres of a bus fleet one bus at a time, always keeping enough buses on the road for the timetable.",
        "code": "desired = 4\nold, new = desired, 0\nmax_total = desired * 150 // 100      # maximumPercent 150\nmin_healthy = desired * 100 // 100    # minimumHealthyPercent 100\nstep = 0\nwhile old > 0:\n    start = min(max_total - (old + new), desired - new)\n    new += start\n    stop = min(old, old + new - min_healthy)\n    old -= stop\n    step += 1\n    print(f\"step {step}: started {start}, stopped {stop} -> old {old}, new {new}\")",
        "output": "step 1: started 2, stopped 2 -> old 2, new 2\nstep 2: started 2, stopped 2 -> old 0, new 4",
        "codeNotes": [
          {
            "line": 7,
            "note": "Never run more than maximumPercent of desired tasks."
          },
          {
            "line": 9,
            "note": "Never drop below minimumHealthyPercent of desired."
          }
        ],
        "tryIt": "Set maximumPercent to 200 (max_total 8). How many steps does the deployment take now, and why is it faster?",
        "check": {
          "question": "What does the ECS deployment circuit breaker do?",
          "options": [
            "Stops the cluster at night",
            "Rolls back a deployment whose new tasks keep failing",
            "Limits network traffic"
          ],
          "answer": 1,
          "why": "It detects failing deployments and returns to the last working version."
        }
      },
      {
        "title": "Practice time: size and configure",
        "say": [
          "Practice 1: valid_fargate_size(cpu, memory_mb). Write the ALLOWED dictionary once at the top: 256 has a small fixed set; 512, 1024, 2048 and 4096 use ranges in steps of 1024.",
          "Mind the ends of each range: 512 goes from 1024 to 4096; 1024 from 2048 to 8192; 2048 from 4096 to 16384; 4096 from 8192 to 30720. range(start, stop + 1, 1024) includes the stop.",
          "Practice 2: container_env(plain, secrets). Check for clashes first, then build both sorted lists with list comprehensions.",
          "The checks compare your result with an exact expected dictionary, so key names must be \"name\", \"value\" and \"valueFrom\" exactly, as in real task definitions.",
          "Together these two functions are the kind of guard a platform team puts in a deployment tool, so broken task definitions are caught before they reach AWS.",
          "After passing, try generating a whole task definition dictionary from a few inputs and validating it with both functions.",
          "The example shows the off-by-one mistake with range."
        ],
        "example": "Counting fence posts: a 10-metre fence with a post every metre needs 11 posts, not 10.",
        "code": "without_plus_one = list(range(2048, 8192, 1024))\nwith_plus_one = list(range(2048, 8192 + 1, 1024))\nprint(\"range(2048, 8192, 1024):\", without_plus_one)\nprint(\"range(2048, 8193, 1024):\", with_plus_one)\nprint(\"8192 allowed?\", 8192 in without_plus_one, \"vs\", 8192 in with_plus_one)",
        "output": "range(2048, 8192, 1024): [2048, 3072, 4096, 5120, 6144, 7168]\nrange(2048, 8193, 1024): [2048, 3072, 4096, 5120, 6144, 7168, 8192]\n8192 allowed? False vs True",
        "codeNotes": [
          {
            "line": 1,
            "note": "range stops BEFORE the stop value."
          },
          {
            "line": 2,
            "note": "Adding 1 includes 8192 itself."
          }
        ],
        "tryIt": "Which real Fargate size would be wrongly rejected without the + 1?",
        "check": {
          "question": "container_env gets DB_PASS in both plain and secrets. What should happen?",
          "options": [
            "Keep the secret and drop the plain one silently",
            "Raise ValueError so the leak is fixed",
            "Keep both"
          ],
          "answer": 1,
          "why": "A name in both lists means a secret may be exposed as plain text; fail loudly."
        }
      }
    ],
    "summary": [
      "Containers package apps with their dependencies; images live in ECR and should carry traceable tags.",
      "ECS: task definitions are recipes, tasks are running copies, services keep the desired count.",
      "Fargate runs containers without servers; CPU and memory must be a valid pair.",
      "Plain settings go in environment; secrets go in Secrets Manager via valueFrom.",
      "Scale services on metrics; deploy with rolling updates, circuit breakers or blue/green."
    ],
    "projectStep": {
      "title": "Containerise your app",
      "steps": [
        "Write a Dockerfile with dependencies before code and a non-root user.",
        "Create a task definition dictionary and validate its size and environment.",
        "Plan a rolling deployment with minimum and maximum percentages."
      ]
    }
  },
  {
    "day": 23,
    "title": "AWS Step Functions & Distributed Saga Pattern Orchestration",
    "goal": "You can explain orchestration with AWS Step Functions, read Amazon States Language, validate a state machine definition, implement the saga pattern with compensating actions, and add retries and error handling to workflow steps.",
    "minutes": 30,
    "recap": "On Day 21 services reacted to each other's events (choreography). For multi-step business processes such as booking a trip, a single place that coordinates the steps and undoes them on failure is often clearer.",
    "parts": [
      {
        "title": "Orchestration and Step Functions",
        "say": [
          "AWS Step Functions runs workflows called state machines. You describe the steps and the transitions between them; Step Functions runs them, remembers where each run is, and shows every run visually.",
          "That is orchestration: one conductor tells each service what to do and when. It is easy to see the whole process in one place, which choreography cannot offer.",
          "Each step can call Lambda, run an ECS task, write to DynamoDB, send to SQS, wait for a person to approve, or call over 200 AWS services directly.",
          "Standard workflows can run for up to a year and record every step, which suits business processes like order fulfilment or loan approvals.",
          "Express workflows run for up to five minutes at very high volume and low cost, which suits high-throughput event processing.",
          "Choose orchestration when the process has a clear order, needs to be visible and audited, or must undo work on failure. Choose choreography when services should stay fully independent.",
          "The example runs a tiny three-step workflow and records each transition like the execution history does."
        ],
        "example": "A wedding planner who calls the caterer, the florist and the band in order, and knows exactly what to cancel if the venue falls through.",
        "code": "workflow = {\"StartAt\": \"ValidateOrder\",\n            \"States\": {\"ValidateOrder\": {\"Next\": \"ChargeCard\"}, \"ChargeCard\": {\"Next\": \"ShipOrder\"},\n                       \"ShipOrder\": {\"End\": True}}}\n\nstate, history = workflow[\"StartAt\"], []\nwhile True:\n    history.append(state)\n    step = workflow[\"States\"][state]\n    if step.get(\"End\"):\n        break\n    state = step[\"Next\"]\nprint(\" -> \".join(history))",
        "output": "ValidateOrder -> ChargeCard -> ShipOrder",
        "codeNotes": [
          {
            "line": 5,
            "note": "Every run begins at StartAt."
          },
          {
            "line": 11,
            "note": "Follow Next until a state marks the End."
          }
        ],
        "tryIt": "Insert a \"ReserveStock\" state between ValidateOrder and ChargeCard.",
        "check": {
          "question": "What is orchestration?",
          "options": [
            "Services react to events with no central control",
            "One coordinator directs the steps of a process",
            "A way to compress data"
          ],
          "answer": 1,
          "why": "An orchestrator such as Step Functions runs the steps in order and tracks progress."
        }
      },
      {
        "title": "Amazon States Language",
        "say": [
          "State machines are written in Amazon States Language (ASL), a JSON format. A definition has StartAt (the first state) and States (a dictionary of named states).",
          "Each state has a Type. Task does work. Choice branches on data. Parallel runs branches at the same time. Map runs a step for each item in a list. Wait pauses. Pass passes data through. Succeed and Fail end the run.",
          "Most states name the next state with Next, or end the run with \"End\": true. Choice states use Choices rules instead, and Succeed and Fail are always final.",
          "Practice 2 is validate_state_machine(definition). Report BAD_START if StartAt is not a state, BAD_TYPE for unknown types, and BAD_NEXT when Next names a missing state, sorted.",
          "Checking definitions before deploying saves painful failed deployments, and it is exactly what the AWS console's validator and linting tools do.",
          "Returning sorted problem codes makes the output deterministic, which is good for tests and for showing diffs in code review.",
          "The example validates a definition with a typo in one Next field."
        ],
        "example": "Checking a board game's rulebook: every \"go to square X\" must point at a square that exists on the board.",
        "code": "VALID = {\"Task\", \"Choice\", \"Parallel\", \"Map\", \"Pass\", \"Wait\", \"Succeed\", \"Fail\"}\n\ndef validate(defn):\n    states, problems = defn[\"States\"], []\n    if defn[\"StartAt\"] not in states: problems.append(\"BAD_START\")\n    for name, s in states.items():\n        if s.get(\"Type\") not in VALID: problems.append(f\"BAD_TYPE:{name}\")\n        if \"Next\" in s and s[\"Next\"] not in states: problems.append(f\"BAD_NEXT:{name}\")\n    return sorted(problems)\n\ndefn = {\"StartAt\": \"Charge\", \"States\": {\"Charge\": {\"Type\": \"Task\", \"Next\": \"Shipp\"},\n        \"Ship\": {\"Type\": \"Task\", \"End\": True}, \"Done\": {\"Type\": \"Finish\"}}}\nprint(validate(defn))",
        "output": "['BAD_NEXT:Charge', 'BAD_TYPE:Done']",
        "codeNotes": [
          {
            "line": 5,
            "note": "The first state must exist."
          },
          {
            "line": 8,
            "note": "Every Next must point at a real state."
          }
        ],
        "tryIt": "Fix both problems in the definition and run validate again.",
        "check": {
          "question": "Which ASL state type runs a step once for every item in a list?",
          "options": [
            "Parallel",
            "Map",
            "Choice"
          ],
          "answer": 1,
          "why": "Map iterates over an array, running its steps per item."
        }
      },
      {
        "title": "The saga pattern",
        "say": [
          "A business process often spans several services, each with its own database: reserve a hotel, book a flight, charge a card. There is no single database transaction that covers them all.",
          "A saga handles this. Each step has a matching compensating action that undoes it: cancel the hotel, cancel the flight, refund the card.",
          "Run the steps in order. If a step fails, run the compensations for every step that already SUCCEEDED, newest first, so the system returns to a consistent state.",
          "Newest first matters. You undo in reverse, like taking off clothes in the opposite order from putting them on.",
          "Practice 1 is run_saga(steps). Each step has do and undo functions. Keep a list of completed steps; on an exception, undo them in reverse and report which step failed and what was undone.",
          "Compensations should be idempotent too, because in real systems they can be retried.",
          "The example books a trip where the card is declined, and shows the compensations running."
        ],
        "example": "Packing for a trip in steps: if the flight is cancelled, you unpack in reverse order, taking the last thing you packed out first.",
        "code": "log = []\ndef step(name, fail=False):\n    def do():\n        if fail: raise RuntimeError(f\"{name} failed\")\n        log.append(f\"do {name}\")\n    return {\"name\": name, \"do\": do, \"undo\": lambda: log.append(f\"undo {name}\")}\n\ndef run_saga(steps):\n    done = []\n    for s in steps:\n        try:\n            s[\"do\"]()\n        except Exception:\n            undone = []\n            for prev in reversed(done):\n                prev[\"undo\"](); undone.append(prev[\"name\"])\n            return {\"success\": False, \"failed_step\": s[\"name\"], \"undone\": undone}\n        done.append(s)\n    return {\"success\": True, \"failed_step\": None, \"undone\": []}\n\nprint(run_saga([step(\"ReserveHotel\"), step(\"BookFlight\"), step(\"ChargeCard\", fail=True)]))\nprint(log)",
        "output": "{'success': False, 'failed_step': 'ChargeCard', 'undone': ['BookFlight', 'ReserveHotel']}\n['do ReserveHotel', 'do BookFlight', 'undo BookFlight', 'undo ReserveHotel']",
        "codeNotes": [
          {
            "line": 15,
            "note": "Compensate only completed steps, newest first."
          },
          {
            "line": 18,
            "note": "A step joins the done list only after it succeeds."
          }
        ],
        "tryIt": "Make BookFlight fail instead. Which compensations run now?",
        "check": {
          "question": "A saga has steps A, B, C. C fails. Which compensations run, in what order?",
          "options": [
            "A then B",
            "B then A",
            "C then B then A"
          ],
          "answer": 1,
          "why": "Only completed steps are undone, in reverse order: B, then A."
        }
      },
      {
        "title": "Retries, catches and timeouts",
        "say": [
          "Steps call real services, which fail sometimes. Step Functions lets each Task declare Retry rules and Catch rules.",
          "A Retry rule lists error names, an interval, a maximum number of attempts, and a backoff rate. For example: retry on Lambda.ServiceException, wait 2 seconds, then 4, then 8, at most 3 times.",
          "A Catch rule says where to go when retries are exhausted, for example to a compensation state or a Fail state that records the error.",
          "Timeouts matter too. A TimeoutSeconds on a Task stops the workflow waiting forever for a stuck service.",
          "Retry only errors that can succeed later, such as throttling or timeouts. Retrying \"card declined\" just annoys the bank; that error should go straight to Catch.",
          "The example simulates a Task with a retry policy against a flaky service that recovers, and against a permanent error.",
          "This is declarative error handling: you describe the policy in the definition instead of writing retry loops in every function."
        ],
        "example": "A phone call that goes to voicemail: you try again in a minute, then in five, and after three tries you send an email instead.",
        "code": "def run_task(fn, retry_on, max_attempts=3, interval=2, backoff=2.0):\n    wait, attempt = interval, 0\n    while True:\n        attempt += 1\n        try:\n            return f\"ok after {attempt} attempt(s): {fn(attempt)}\"\n        except Exception as err:\n            if type(err).__name__ not in retry_on or attempt > max_attempts:\n                return f\"Catch -> {type(err).__name__} after {attempt} attempt(s)\"\n            wait *= backoff\n\ndef flaky(attempt):\n    if attempt < 3: raise TimeoutError()\n    return \"shipped\"\ndef declined(attempt):\n    raise ValueError(\"card declined\")\nprint(run_task(flaky, {\"TimeoutError\"}))\nprint(run_task(declined, {\"TimeoutError\"}))",
        "output": "ok after 3 attempt(s): shipped\nCatch -> ValueError after 1 attempt(s)",
        "codeNotes": [
          {
            "line": 8,
            "note": "Only listed errors are retried; others go straight to Catch."
          },
          {
            "line": 10,
            "note": "Each wait is longer than the last."
          }
        ],
        "tryIt": "Make flaky fail 5 times. What happens with max_attempts=3?",
        "check": {
          "question": "Which error should NOT be retried?",
          "options": [
            "A throttling error",
            "A timeout",
            "Card declined by the bank"
          ],
          "answer": 2,
          "why": "Permanent business errors will fail again; send them to Catch instead."
        }
      },
      {
        "title": "Parallel steps and human approval",
        "say": [
          "Parallel states run independent branches at the same time and wait for all of them. Checking stock and running a fraud score for an order can happen together, cutting total time.",
          "The total time of a Parallel state is roughly the time of its slowest branch, not the sum of all branches.",
          "Map states process lists, for example resizing every image in an album, with a concurrency limit so you do not overwhelm a downstream service.",
          "Some processes need a person. A Task can wait for a callback token: Step Functions pauses (for up to a year in standard workflows) until your app reports approval or rejection.",
          "That makes workflows like \"refunds over 10,000 rupees need a manager's approval\" easy to build and audit.",
          "The example compares sequential and parallel timing for three independent checks.",
          "Look for independent steps in any workflow; running them in parallel is often the cheapest speed-up available."
        ],
        "example": "Cooking dinner: you boil the rice, grill the fish and chop the salad at the same time, and dinner is ready when the slowest dish is done.",
        "code": "checks = {\"stock\": 120, \"fraud-score\": 450, \"address\": 80}   # milliseconds\nsequential = sum(checks.values())\nparallel = max(checks.values())\nprint(\"sequential:\", sequential, \"ms\")\nprint(\"parallel:\", parallel, \"ms (waits for\", max(checks, key=checks.get) + \")\")\nprint(f\"saved: {1 - parallel / sequential:.0%}\")",
        "output": "sequential: 650 ms\nparallel: 450 ms (waits for fraud-score)\nsaved: 31%",
        "codeNotes": [
          {
            "line": 3,
            "note": "A Parallel state waits for its slowest branch."
          }
        ],
        "tryIt": "Speed up the fraud score to 100 ms. Which branch is now the slowest?",
        "check": {
          "question": "Three independent branches take 100, 300 and 200 ms. Roughly how long does a Parallel state take?",
          "options": [
            "600 ms",
            "300 ms",
            "100 ms"
          ],
          "answer": 1,
          "why": "Branches run together, so the slowest branch sets the total."
        }
      },
      {
        "title": "Practice time: saga and validator",
        "say": [
          "Practice 1: run_saga(steps). Loop with try/except around each do call. Append the step to done only after its do succeeds.",
          "On failure, loop over reversed(done), call each undo, collect the names, and return immediately. Later steps must never run after a failure.",
          "The checks record every do and undo call, so an undo of the failed step itself, or a later step running, will be caught.",
          "Practice 2: validate_state_machine(definition). Collect problem codes for the start state, each state's Type, and each Next that points nowhere, then return them sorted.",
          "Use state.get(\"Type\") and \"Next\" in state, because not every state has every field.",
          "These are two faces of the same idea: make multi-step processes safe, first by checking the plan, then by undoing cleanly when a step fails.",
          "The example shows the bug of adding a step to done before running it."
        ],
        "example": "Ticking a task off your list before you have done it: if it then fails, your list lies about what needs undoing.",
        "code": "log = []\nsteps = [(\"A\", False), (\"B\", True)]\ndone = []\nfor name, fails in steps:\n    done.append(name)                 # bug: recorded before it succeeded\n    if fails:\n        for prev in reversed(done):\n            log.append(f\"undo {prev}\")\n        break\nprint(log)",
        "output": "['undo B', 'undo A']",
        "codeNotes": [
          {
            "line": 5,
            "note": "B is added before it runs, so its undo runs even though it never happened."
          }
        ],
        "tryIt": "Move the append after the failure check and run again. What changes in the log?",
        "check": {
          "question": "In validate_state_machine, which result is correct for a definition with no problems?",
          "options": [
            "None",
            "[]",
            "True"
          ],
          "answer": 1,
          "why": "An empty list of problems means the definition is valid."
        }
      }
    ],
    "summary": [
      "Step Functions orchestrates workflows as state machines written in Amazon States Language.",
      "State types: Task, Choice, Parallel, Map, Pass, Wait, Succeed, Fail; validate StartAt and every Next.",
      "Sagas pair each step with a compensation and undo completed steps in reverse on failure.",
      "Retry transient errors with backoff; Catch permanent ones; set timeouts.",
      "Parallel branches cost the time of the slowest; callbacks let workflows wait for people."
    ],
    "projectStep": {
      "title": "Workflow for your app",
      "steps": [
        "Pick a multi-step process in your app and write its states as an ASL dictionary.",
        "Validate it and add a compensation for every step that changes something.",
        "Decide which errors to retry and which to catch."
      ]
    }
  },
  {
    "day": 24,
    "title": "Infrastructure as Code (IaC) with Terraform & State Management",
    "goal": "You can explain Infrastructure as Code, read Terraform resources and addresses, understand what state is and why it must be locked and stored remotely, read a plan summary, and use modules to reuse infrastructure.",
    "minutes": 30,
    "recap": "You have designed networks, databases, queues and containers. Creating them by clicking in the console is slow and impossible to repeat exactly. Today you describe infrastructure in code instead.",
    "parts": [
      {
        "title": "Infrastructure as Code",
        "say": [
          "Infrastructure as Code (IaC) means describing your cloud resources in text files that live in version control, and letting a tool create and update the real resources to match.",
          "The benefits are the same as for application code: review changes in pull requests, see who changed what and why, roll back, and create identical copies for development, staging and production.",
          "Clicking in the console leads to \"snowflake\" environments that nobody can rebuild exactly, and to surprises when production differs from staging in some forgotten setting.",
          "Terraform (by HashiCorp, with the open-source fork OpenTofu) is the most widely used IaC tool and works with AWS and many other providers. AWS also has CloudFormation and the AWS CDK, which lets you write IaC in Python.",
          "Terraform is declarative: you describe what you want, not the steps. Terraform works out the steps by comparing your code with what exists.",
          "The example shows a Terraform resource block as text and reads its type and name.",
          "A good rule for a team: if it is not in code, it does not exist. Anything created by hand will eventually be lost or broken."
        ],
        "example": "An architect's blueprint instead of verbal instructions to builders: anyone can build the same house again, and changes are drawn and approved before building.",
        "code": "hcl = \"\"\"resource \"aws_s3_bucket\" \"media\" {\n  bucket = \"pinit-media-prod\"\n  tags = { Environment = \"prod\", Owner = \"platform\" }\n}\"\"\"\nfirst = hcl.splitlines()[0].split()\nkind, rtype, name = first[0], first[1].strip('\"'), first[2].strip('\"')\nprint(\"block:\", kind, \"| type:\", rtype, \"| name:\", name)\nprint(\"address:\", f\"{rtype}.{name}\")",
        "output": "block: resource | type: aws_s3_bucket | name: media\naddress: aws_s3_bucket.media",
        "codeNotes": [
          {
            "line": 1,
            "note": "A resource block: the provider's type and your own local name."
          },
          {
            "line": 8,
            "note": "Terraform addresses a resource as type.name."
          }
        ],
        "tryIt": "Write a second block for an \"aws_sqs_queue\" called \"orders\" and print its address.",
        "check": {
          "question": "What does \"declarative\" mean for Terraform?",
          "options": [
            "You write every API call in order",
            "You describe the desired end state and Terraform works out the steps",
            "It only works on Tuesdays"
          ],
          "answer": 1,
          "why": "Terraform compares desired and actual state and plans the changes."
        }
      },
      {
        "title": "Resource addresses and modules",
        "say": [
          "Every resource Terraform manages has an address. A simple one is type.name, such as aws_s3_bucket.data_lake.",
          "Modules group resources into reusable packages, such as a \"vpc\" module that creates subnets, route tables and gateways from a few inputs. Addresses inside modules gain a prefix: module.vpc.aws_subnet.public.",
          "Modules can call other modules, so addresses can nest: module.network.module.vpc.aws_route_table.private.",
          "Practice 1 is parse_tf_address(address). Split on dots; while the first part is \"module\", take the next part as a module name and move on two places; what is left is the type and the name.",
          "You will read addresses constantly: in plan output, in error messages, and when moving or importing resources with commands like terraform state mv.",
          "Well-made modules are like functions: clear inputs (variables), clear outputs, and no surprises. Teams publish internal modules so every service gets a secure, standard VPC or bucket.",
          "The example parses several addresses of increasing depth."
        ],
        "example": "A full postal address for a flat inside a building inside an estate: estate, building, then the flat itself.",
        "code": "def parse_tf_address(address):\n    parts, modules = address.split(\".\"), []\n    while parts[0] == \"module\":\n        modules.append(parts[1])\n        parts = parts[2:]\n    return {\"modules\": modules, \"type\": parts[0], \"name\": parts[1]}\n\nfor a in [\"aws_s3_bucket.data_lake\", \"module.vpc.aws_subnet.public\",\n          \"module.network.module.vpc.aws_route_table.private\"]:\n    print(parse_tf_address(a))",
        "output": "{'modules': [], 'type': 'aws_s3_bucket', 'name': 'data_lake'}\n{'modules': ['vpc'], 'type': 'aws_subnet', 'name': 'public'}\n{'modules': ['network', 'vpc'], 'type': 'aws_route_table', 'name': 'private'}",
        "codeNotes": [
          {
            "line": 3,
            "note": "Peel off module.<name> pairs from the front."
          },
          {
            "line": 6,
            "note": "What remains is type and name."
          }
        ],
        "tryIt": "Addresses with count look like aws_instance.web[0]. How would you handle the [0]?",
        "check": {
          "question": "What is the address of resource aws_subnet \"public\" inside module \"vpc\"?",
          "options": [
            "aws_subnet.public.vpc",
            "module.vpc.aws_subnet.public",
            "vpc/aws_subnet/public"
          ],
          "answer": 1,
          "why": "Module addresses are prefixed with module.<name>."
        }
      },
      {
        "title": "State: Terraform's memory",
        "say": [
          "Terraform keeps a state file that maps each resource address in your code to the real resource id in AWS, such as aws_s3_bucket.media to the bucket pinit-media-prod.",
          "Without state, Terraform could not tell whether a resource in your code already exists, needs changing, or should be created.",
          "By default state is a local file, which is fine for learning and dangerous for teams: two people with different copies will fight, and a lost laptop loses the state.",
          "Teams store state remotely, for example in an S3 bucket with versioning and encryption, so everyone uses the same copy and old versions can be recovered.",
          "State can contain secrets, such as generated database passwords, so the state bucket must be private, encrypted and tightly permissioned.",
          "Drift is when someone changes a resource by hand so reality no longer matches the code. terraform plan detects drift and proposes to put things back.",
          "The example compares state with reality to find drift."
        ],
        "example": "A stock ledger in a shop: without it you cannot tell whether an item on your order list is already on the shelf. And everyone must use the same ledger.",
        "code": "code = {\"aws_s3_bucket.media\": {\"versioning\": True}, \"aws_sqs_queue.orders\": {\"visibility\": 30}}\nstate = {\"aws_s3_bucket.media\": \"pinit-media-prod\", \"aws_sqs_queue.orders\": \"orders-queue\"}\nreality = {\"pinit-media-prod\": {\"versioning\": False}, \"orders-queue\": {\"visibility\": 30}}\n\nfor address, wanted in code.items():\n    real = reality[state[address]]\n    drift = {k: (real[k], v) for k, v in wanted.items() if real[k] != v}\n    print(address, \"->\", drift or \"in sync\")",
        "output": "aws_s3_bucket.media -> {'versioning': (False, True)}\naws_sqs_queue.orders -> in sync",
        "codeNotes": [
          {
            "line": 6,
            "note": "State tells us which real resource belongs to each address."
          },
          {
            "line": 7,
            "note": "Differences between code and reality are drift."
          }
        ],
        "tryIt": "Someone turned versioning off by hand. What would terraform apply do about it?",
        "check": {
          "question": "Why store Terraform state remotely for a team?",
          "options": [
            "It is faster",
            "Everyone shares one copy, with locking and recovery, instead of conflicting local files",
            "AWS forbids local files"
          ],
          "answer": 1,
          "why": "A shared, versioned remote state avoids conflicts and loss."
        }
      },
      {
        "title": "Locking state",
        "say": [
          "What if two engineers run terraform apply at the same moment? Both read the same state, both make changes, and the second write overwrites the first. Resources get lost or duplicated.",
          "State locking prevents this. Before changing anything, Terraform takes a lock; a second run waits or fails with \"state locked\" until the first finishes.",
          "With the S3 backend, recent Terraform versions can lock using S3 itself. The long-standing method, still very common, is a DynamoDB table whose partition key is named LockID, of type String.",
          "Terraform writes an item with that LockID while it holds the lock, and deletes it afterwards. The conditional write (Day 21) guarantees only one run can hold it.",
          "Practice 2 is plan_summary(changes): the counts terraform plan prints. Before that, the example simulates two runs racing for the lock.",
          "If a run crashes while holding the lock, you may need terraform force-unlock. Only do that when you are sure no other run is active.",
          "In CI pipelines, one pipeline per environment at a time is the usual rule, which avoids most lock fights."
        ],
        "example": "A single key to the stock room: whoever holds it can rearrange shelves; everyone else waits until it is returned.",
        "code": "lock_table = {}\n\ndef acquire(lock_id, who):\n    if lock_id in lock_table:\n        return f\"{who}: state locked by {lock_table[lock_id]}\"\n    lock_table[lock_id] = who\n    return f\"{who}: lock acquired\"\n\ndef release(lock_id):\n    lock_table.pop(lock_id, None)\n\nLOCK = \"pinit-tf-state/prod/terraform.tfstate\"\nprint(acquire(LOCK, \"asha\"))\nprint(acquire(LOCK, \"ravi\"))\nrelease(LOCK)\nprint(acquire(LOCK, \"ravi\"))",
        "output": "asha: lock acquired\nravi: state locked by asha\nravi: lock acquired",
        "codeNotes": [
          {
            "line": 4,
            "note": "The conditional write: only succeed if nobody holds the lock."
          },
          {
            "line": 10,
            "note": "Releasing deletes the lock item."
          }
        ],
        "tryIt": "What would happen if asha's run crashed before release? How would ravi get the lock?",
        "check": {
          "question": "What must the DynamoDB lock table's partition key be called?",
          "options": [
            "id",
            "LockID",
            "StateKey"
          ],
          "answer": 1,
          "why": "Terraform's S3 backend expects a string partition key named LockID."
        }
      },
      {
        "title": "Plan, apply and reading a plan",
        "say": [
          "The core loop is: terraform init (download providers, set up the backend), terraform plan (show what would change), terraform apply (make the changes).",
          "Always read the plan. It lists each resource with a symbol: + create, ~ update in place, - destroy, and -/+ replace (destroy and create again).",
          "Replacements deserve extra care. Changing some settings, such as a database's engine or a subnet's CIDR, forces a replace, which can mean data loss or downtime.",
          "The summary line reads like \"Plan: 2 to add, 1 to change, 2 to destroy.\" A replace counts as one add and one destroy.",
          "Practice 2 is plan_summary(changes). Each change has actions such as [\"create\"], [\"update\"], [\"delete\"], [\"no-op\"] or [\"delete\", \"create\"]; count them as Terraform does and list replacements.",
          "In a good team workflow the plan is posted on the pull request, reviewed, and applied only after approval, often by the CI pipeline rather than a laptop.",
          "The example turns a plan into that summary line."
        ],
        "example": "A builder's quote that lists exactly what will be built, repaired and knocked down before any work starts, so you can say no to the wall they wanted to demolish.",
        "code": "changes = [(\"aws_s3_bucket.logs\", [\"create\"]), (\"aws_instance.web\", [\"delete\", \"create\"]),\n           (\"aws_security_group.web\", [\"update\"]), (\"aws_vpc.main\", [\"no-op\"])]\nsymbols = {(\"create\",): \"+\", (\"update\",): \"~\", (\"delete\",): \"-\", (\"delete\", \"create\"): \"-/+\", (\"no-op\",): \" \"}\nadd = change = destroy = 0\nfor address, actions in changes:\n    print(f\"{symbols[tuple(actions)]:>3} {address}\")\n    add += \"create\" in actions\n    destroy += \"delete\" in actions\n    change += \"update\" in actions\nprint(f\"Plan: {add} to add, {change} to change, {destroy} to destroy.\")",
        "output": "  + aws_s3_bucket.logs\n-/+ aws_instance.web\n  ~ aws_security_group.web\n    aws_vpc.main\nPlan: 2 to add, 1 to change, 1 to destroy.",
        "codeNotes": [
          {
            "line": 3,
            "note": "The symbols terraform plan prints for each action."
          },
          {
            "line": 7,
            "note": "A replace adds one to both add and destroy."
          }
        ],
        "tryIt": "Add a change that deletes \"aws_db_instance.main\". Would you approve this plan? What would you ask?",
        "check": {
          "question": "How does a replace (-/+) count in the plan summary?",
          "options": [
            "As one change",
            "As one add and one destroy",
            "It is not counted"
          ],
          "answer": 1,
          "why": "Terraform destroys and recreates the resource, so it counts in both."
        }
      },
      {
        "title": "Practice time: addresses and plans",
        "say": [
          "Practice 1: parse_tf_address(address). Split on \".\", peel off module pairs in a while loop, and return modules, type and name.",
          "Test all three shapes: no module, one module, and nested modules. The nested case is where a single if statement instead of a while loop fails.",
          "Practice 2: plan_summary(changes). For each change, add one to \"add\" if \"create\" is in its actions, to \"destroy\" if \"delete\" is, and to \"change\" if \"update\" is. Collect addresses with both create and delete as replacements, sorted.",
          "Ignore no-op changes: they count towards nothing.",
          "A useful extension used by real teams: fail the pipeline if any replace touches a database or a bucket, unless a human approves it explicitly.",
          "With IaC, every lesson from this course becomes repeatable: the VPC from Day 5, the buckets from Day 10, the queues from Day 18, all reviewable in code.",
          "The example shows a guard that blocks dangerous replacements."
        ],
        "example": "A second signature required on any cheque over a large amount: ordinary spending flows, risky spending gets a human look.",
        "code": "PROTECTED = (\"aws_db_instance\", \"aws_s3_bucket\", \"aws_dynamodb_table\")\nreplacements = [\"aws_instance.web\", \"aws_db_instance.main\"]\nblocked = [a for a in replacements if a.split(\".\")[0] in PROTECTED]\nif blocked:\n    print(\"BLOCKED: replacing\", blocked, \"needs manual approval\")\nelse:\n    print(\"plan can be applied automatically\")",
        "output": "BLOCKED: replacing ['aws_db_instance.main'] needs manual approval",
        "codeNotes": [
          {
            "line": 3,
            "note": "The resource type is the part before the first dot (for addresses without modules)."
          }
        ],
        "tryIt": "Make the guard work for addresses inside modules too, using parse_tf_address.",
        "check": {
          "question": "Which address has two nested modules?",
          "options": [
            "aws_subnet.public",
            "module.vpc.aws_subnet.public",
            "module.net.module.vpc.aws_subnet.public"
          ],
          "answer": 2,
          "why": "Each module.<name> pair adds one level of nesting."
        }
      }
    ],
    "summary": [
      "Infrastructure as Code keeps cloud resources in reviewed, versioned files; Terraform is declarative.",
      "Resources have addresses like type.name; modules add module.<name> prefixes and can nest.",
      "State maps addresses to real resources; store it remotely, encrypted and versioned.",
      "Lock state (for example a DynamoDB table with a LockID key) so only one run changes it at a time.",
      "Always read the plan: + create, ~ update, - destroy, -/+ replace (one add and one destroy)."
    ],
    "projectStep": {
      "title": "Your infrastructure in code",
      "steps": [
        "Write Terraform-style resource blocks for one bucket, one queue and one table from your app.",
        "Parse their addresses and simulate a plan with plan_summary.",
        "Add a guard that blocks replacing any data store without approval."
      ]
    }
  },
  {
    "day": 25,
    "title": "Amazon CloudWatch Metrics, Log Insights & Alarms",
    "goal": "You can explain CloudWatch metrics, logs and alarms, evaluate an alarm over consecutive datapoints, write Logs Insights-style summaries of errors, choose useful percentiles, and design dashboards and alerts that people act on.",
    "minutes": 30,
    "recap": "Your system now has many moving parts. When something goes wrong at 3 a.m., you need to know quickly and find the cause fast. That is observability, and on AWS it starts with Amazon CloudWatch.",
    "parts": [
      {
        "title": "Metrics, logs and traces",
        "say": [
          "Observability means being able to understand what your system is doing from the outside. It rests on three kinds of signal.",
          "Metrics are numbers over time: CPU percent, calls per second, error count, queue length. They are cheap to store and great for alarms and dashboards.",
          "Logs are records of individual events: \"order 981 failed: card declined\". They carry detail for investigating a specific problem.",
          "Traces follow one call through many services (Day 21 and AWS X-Ray), showing where time was spent.",
          "CloudWatch collects metrics from almost every AWS service automatically, such as Lambda errors, ALB response times and SQS queue depth. You can also publish your own custom metrics, like orders per minute.",
          "Metrics have a namespace, a name and dimensions (for example FunctionName=checkout), and are stored at a resolution such as one datapoint per minute.",
          "The example turns raw call records into per-minute metrics: count, errors and average latency."
        ],
        "example": "A car dashboard (metrics) shows speed and fuel at a glance; the mechanic's logbook (logs) has the details of each repair; a trip recorder (traces) shows where the time went on one journey.",
        "code": "calls = [(0, 120, 200), (0, 90, 200), (0, 400, 500), (1, 110, 200), (1, 95, 200), (1, 105, 200), (1, 800, 503)]\nminutes = sorted({m for m, _, _ in calls})\nfor m in minutes:\n    these = [(ms, status) for mm, ms, status in calls if mm == m]\n    errors = sum(status >= 500 for _, status in these)\n    avg = sum(ms for ms, _ in these) / len(these)\n    print(f\"minute {m}: count {len(these)} errors {errors} avg latency {avg:.0f} ms\")",
        "output": "minute 0: count 3 errors 1 avg latency 203 ms\nminute 1: count 4 errors 1 avg latency 278 ms",
        "codeNotes": [
          {
            "line": 5,
            "note": "Server errors are status codes 500 and above."
          },
          {
            "line": 6,
            "note": "The average hides the slow calls, as the next part shows."
          }
        ],
        "tryIt": "Add an error rate (errors / count) as a percentage to each line.",
        "check": {
          "question": "Which signal best answers \"why did order 981 fail?\"",
          "options": [
            "A CPU metric",
            "The log line for order 981",
            "The monthly bill"
          ],
          "answer": 1,
          "why": "Logs carry the detail of individual events."
        }
      },
      {
        "title": "Percentiles beat averages",
        "say": [
          "Averages hide pain. If 99 calls take 100 ms and one takes 10 seconds, the average is about 200 ms, which sounds fine, yet one user in a hundred waited ten seconds.",
          "Percentiles show the spread. p50 (the median) is what a typical call sees. p99 is the time that 99 percent of calls beat, which shows the slow tail.",
          "CloudWatch supports percentile statistics on latency metrics. Service level objectives are usually written with them, for example \"p99 latency under 500 ms\".",
          "The tail matters more than it looks. A page that makes 20 backend calls hits the p95 of at least one of them most of the time.",
          "The example computes the average, p50 and p99 of a latency sample with Python's statistics module.",
          "When you set latency alarms, use p90, p95 or p99, not the average.",
          "Percentiles are also why load tests and profiling focus on the slowest calls, not the typical ones."
        ],
        "example": "Measuring a bus service by the average wait hides the one bus a day that never comes; the people waiting for that bus remember it.",
        "code": "import statistics\n\nlatencies = [100] * 97 + [900, 2500, 10000]\nq = statistics.quantiles(latencies, n=100, method=\"inclusive\")\nprint(\"average:\", round(statistics.mean(latencies)), \"ms\")\nprint(\"p50:\", round(q[49]), \"ms\")\nprint(\"p99:\", round(q[98]), \"ms\")\nprint(\"max:\", max(latencies), \"ms\")",
        "output": "average: 231 ms\np50: 100 ms\np99: 2575 ms\nmax: 10000 ms",
        "codeNotes": [
          {
            "line": 4,
            "note": "quantiles with n=100 gives the 1st to 99th percentiles."
          },
          {
            "line": 7,
            "note": "p99 exposes the slow tail the average hides."
          }
        ],
        "tryIt": "If a page makes 20 independent calls, what is the chance at least one is slower than this p99? (Hint: 1 - 0.99 ** 20.)",
        "check": {
          "question": "Which statistic best shows the slow experience of the unluckiest users?",
          "options": [
            "Average",
            "p99",
            "Minimum"
          ],
          "answer": 1,
          "why": "High percentiles describe the tail that averages hide."
        }
      },
      {
        "title": "Alarms over consecutive datapoints",
        "say": [
          "A CloudWatch alarm watches one metric and changes state: OK, ALARM, or INSUFFICIENT_DATA when there is not enough data to judge.",
          "You choose a threshold, a comparison (GreaterThanThreshold, LessThanThreshold and others), a period (such as 1 minute) and how many periods must breach.",
          "Requiring several breaching periods in a row avoids alarms on single blips. \"CPU above 80 for 3 consecutive minutes\" is far more useful than \"CPU touched 81 once\".",
          "Practice 1 is alarm_state(datapoints, threshold, operator, periods). Look at the last periods datapoints; if there are not enough, return INSUFFICIENT_DATA; if all breach, ALARM; otherwise OK.",
          "Some metrics are bad when high (errors, latency) and others when low (free disk space, healthy host count), which is why the operator matters.",
          "Alarm actions can notify an SNS topic (Day 19), trigger Auto Scaling (Day 7), or run an automated fix.",
          "The example evaluates the alarm after each new datapoint arrives."
        ],
        "example": "A smoke detector that ignores one puff of steam from the kettle but sounds when smoke keeps building for a while.",
        "code": "def alarm_state(points, threshold, operator, periods):\n    if len(points) < periods:\n        return \"INSUFFICIENT_DATA\"\n    recent = points[-periods:]\n    if operator == \"GreaterThanThreshold\":\n        breached = all(v > threshold for v in recent)\n    else:\n        breached = all(v < threshold for v in recent)\n    return \"ALARM\" if breached else \"OK\"\n\ncpu = []\nfor value in [40, 85, 90, 70, 88, 91, 95]:\n    cpu.append(value)\n    print(f\"cpu {value:3} -> {alarm_state(cpu, 80, 'GreaterThanThreshold', 3)}\")",
        "output": "cpu  40 -> INSUFFICIENT_DATA\ncpu  85 -> INSUFFICIENT_DATA\ncpu  90 -> OK\ncpu  70 -> OK\ncpu  88 -> OK\ncpu  91 -> OK\ncpu  95 -> ALARM",
        "codeNotes": [
          {
            "line": 4,
            "note": "Only the most recent periods count."
          },
          {
            "line": 6,
            "note": "Every one of them must breach."
          }
        ],
        "tryIt": "Change periods to 2. At which datapoint does the alarm fire first?",
        "check": {
          "question": "CPU readings 85, 90, 75 with threshold 80 over 3 periods. What state?",
          "options": [
            "ALARM",
            "OK",
            "INSUFFICIENT_DATA"
          ],
          "answer": 1,
          "why": "The last reading did not breach, so not all three periods breached."
        }
      },
      {
        "title": "Logs and Logs Insights",
        "say": [
          "CloudWatch Logs stores log lines in log groups (one per application or function) and log streams (one per instance or container).",
          "Set a retention period on every log group. The default is to keep logs forever, which quietly grows the bill. Thirty or ninety days is common, with archives to S3 if you must keep more.",
          "Write structured JSON logs with fields such as path, status, latency_ms and correlation_id. Then CloudWatch Logs Insights can filter and aggregate them with a query language.",
          "A typical query: fields @timestamp, path, status | filter status >= 500 | stats count(*) by path | sort count desc.",
          "Practice 2 is error_summary(logs, min_status=500): the same thing in Python. Keep entries at or above the status, count by path, and sort by count (highest first), then by path.",
          "Metric filters can also turn log patterns into metrics, for example counting lines that contain \"PaymentFailed\", which you can then alarm on.",
          "The example runs the error summary over a small batch of structured logs."
        ],
        "example": "A searchable diary: instead of reading every page, you ask \"on which days did the car break down, and how often?\"",
        "code": "from collections import Counter\n\nlogs = [{\"path\": \"/pay\", \"status\": 500}, {\"path\": \"/pay\", \"status\": 503}, {\"path\": \"/home\", \"status\": 200},\n        {\"path\": \"/cart\", \"status\": 502}, {\"path\": \"/login\", \"status\": 404}, {\"path\": \"/auth\", \"status\": 500}]\ncounts = Counter(l[\"path\"] for l in logs if l[\"status\"] >= 500)\nsummary = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))\nprint(\"filter status >= 500 | stats count(*) by path\")\nfor path, n in summary:\n    print(f\"{path:6} {n}\")",
        "output": "filter status >= 500 | stats count(*) by path\n/pay   2\n/auth  1\n/cart  1",
        "codeNotes": [
          {
            "line": 5,
            "note": "filter status >= 500, then count by path."
          },
          {
            "line": 6,
            "note": "Sort by count descending (negative), then by path."
          }
        ],
        "tryIt": "Run the same summary for status >= 400. Which new path appears?",
        "check": {
          "question": "Why set a retention period on log groups?",
          "options": [
            "Logs are deleted after one day by default",
            "By default logs are kept forever and storage cost keeps growing",
            "Retention makes queries slower"
          ],
          "answer": 1,
          "why": "Retention caps storage cost; archive to S3 if long-term keeping is required."
        }
      },
      {
        "title": "Dashboards and alerts people act on",
        "say": [
          "A dashboard should answer \"is the system healthy right now, and if not, where?\" within seconds. Put the most important signals at the top.",
          "A widely used framework is the four golden signals: latency, traffic, errors and saturation (how full your resources are, like CPU, memory or queue depth).",
          "For each user-facing service, show those four, with percentiles for latency and rates for errors.",
          "Alerts must be actionable. Every alert that pages a person should mean \"a human needs to do something now\", and should link to a runbook explaining what to check.",
          "Too many noisy alerts cause alert fatigue: people start ignoring them, and then miss the real one. Delete or downgrade alerts nobody acts on.",
          "Composite alarms combine several alarms, for example \"error rate high AND healthy hosts low\", which cuts noise further.",
          "The example scores a list of alerts by whether they are actionable, from their history."
        ],
        "example": "A fire alarm that goes off every time someone makes toast soon gets ignored; a good one rings only for real fires and tells you where the exit is.",
        "code": "alerts = [\n    {\"name\": \"checkout 5xx > 2%\", \"fired\": 6, \"acted_on\": 6, \"runbook\": True},\n    {\"name\": \"CPU > 50% on any host\", \"fired\": 140, \"acted_on\": 1, \"runbook\": False},\n    {\"name\": \"orders DLQ not empty\", \"fired\": 3, \"acted_on\": 3, \"runbook\": True},\n    {\"name\": \"disk > 70%\", \"fired\": 55, \"acted_on\": 4, \"runbook\": False},\n]\nfor a in alerts:\n    useful = a[\"acted_on\"] / a[\"fired\"]\n    verdict = \"keep\" if useful >= 0.5 and a[\"runbook\"] else \"fix or delete\"\n    print(f\"{a['name']:24} acted on {useful:4.0%}  -> {verdict}\")",
        "output": "checkout 5xx > 2%        acted on 100%  -> keep\nCPU > 50% on any host    acted on   1%  -> fix or delete\norders DLQ not empty     acted on 100%  -> keep\ndisk > 70%               acted on   7%  -> fix or delete",
        "codeNotes": [
          {
            "line": 8,
            "note": "How often the alert led to real action."
          },
          {
            "line": 9,
            "note": "Keep alerts that are usually acted on and have a runbook."
          }
        ],
        "tryIt": "How would you change the CPU alert so it becomes useful? Think about percentiles, duration and user impact.",
        "check": {
          "question": "What makes an alert good?",
          "options": [
            "It fires often so people stay alert",
            "It means a human must act now and links to a runbook",
            "It is sent to everyone in the company"
          ],
          "answer": 1,
          "why": "Actionable alerts with runbooks keep people responsive and avoid alert fatigue."
        }
      },
      {
        "title": "Practice time: alarms and log summaries",
        "say": [
          "Practice 1: alarm_state(datapoints, threshold, operator, periods). Handle too few datapoints first. Then slice the last periods values with datapoints[-periods:] and use all() with the right comparison.",
          "Use strict comparisons: GreaterThanThreshold means strictly greater. A value exactly at the threshold does not breach.",
          "Practice 2: error_summary(logs, min_status=500). Counter over the paths of matching entries, then sorted with the key (-count, path).",
          "The negative count sorts high counts first while the path still sorts alphabetically for ties, in one sort.",
          "With these two functions you have the core of monitoring: decide when to wake someone, and show them where the errors are.",
          "After passing, combine them: compute per-minute error counts from logs, then run alarm_state over those counts.",
          "The example shows the (-count, path) sort key on a tie."
        ],
        "example": "Sorting a leaderboard by score, highest first, and alphabetically for players with the same score.",
        "code": "counts = {\"/pay\": 3, \"/auth\": 1, \"/cart\": 3, \"/home\": 1}\nprint(sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])))\nprint(sorted(counts.items(), key=lambda kv: kv[1], reverse=True))",
        "output": "[('/cart', 3), ('/pay', 3), ('/auth', 1), ('/home', 1)]\n[('/pay', 3), ('/cart', 3), ('/auth', 1), ('/home', 1)]",
        "codeNotes": [
          {
            "line": 2,
            "note": "Count descending, then path ascending for ties."
          },
          {
            "line": 3,
            "note": "reverse=True alone leaves ties in their original order."
          }
        ],
        "tryIt": "Why does the second line give a less predictable order for ties?",
        "check": {
          "question": "Datapoints [90, 95] with periods 3. What does alarm_state return?",
          "options": [
            "ALARM",
            "OK",
            "INSUFFICIENT_DATA"
          ],
          "answer": 2,
          "why": "Fewer datapoints than periods means there is not enough data to judge."
        }
      }
    ],
    "summary": [
      "Observability rests on metrics (numbers over time), logs (event detail) and traces (one call across services).",
      "Use percentiles such as p99 for latency; averages hide the slow tail.",
      "Alarms need several breaching periods in a row; the operator depends on whether high or low is bad.",
      "Structure logs as JSON, set retention, and summarise errors with Logs Insights queries.",
      "Dashboards show the four golden signals; alerts must be actionable and link to runbooks."
    ],
    "projectStep": {
      "title": "Monitoring for your app",
      "steps": [
        "List your app's four golden signals and the metric for each.",
        "Write two alarms with thresholds and periods, and test them with alarm_state.",
        "Summarise a sample of your logs with error_summary and write a runbook for the top error."
      ]
    }
  },
  {
    "day": 26,
    "title": "AWS Key Management Service (KMS) & Envelope Encryption",
    "goal": "You can explain encryption at rest and in transit, how AWS KMS manages keys, how envelope encryption works and why it is used, simulate it in Python, audit key policies for risky grants, and plan key rotation.",
    "minutes": 30,
    "recap": "On Day 10 you met S3 encryption options, and SSE-KMS added a second permission check. Today you look inside KMS and the envelope encryption pattern that nearly every AWS service uses.",
    "parts": [
      {
        "title": "Why encryption, and where",
        "say": [
          "Encryption turns readable data (plaintext) into scrambled data (ciphertext) that is useless without the right key.",
          "Encryption in transit protects data moving over networks, using TLS (the S in HTTPS). You enforced it for S3 on Day 10 and at the load balancer on Day 8.",
          "Encryption at rest protects stored data on disks, in databases, backups and object storage. If a disk is stolen or a snapshot is shared by mistake, the data stays unreadable.",
          "Modern encryption algorithms such as AES-256 are not the weak point. The hard part is managing keys: where they live, who can use them, and what happens if one leaks.",
          "AWS Key Management Service (KMS) is built for that. Keys are created and used inside hardware security modules and never leave KMS in plain form. You ask KMS to encrypt or decrypt, and every use is checked by IAM and recorded in CloudTrail.",
          "The example shows the difference between plaintext and ciphertext with a simple XOR demonstration. XOR is for learning only; real systems use AES.",
          "Remember: encryption moves the problem from protecting data to protecting keys, and KMS is how AWS helps with the second."
        ],
        "example": "A diary written in a secret code: anyone can steal the notebook, but without the codebook it is just nonsense.",
        "code": "def xor_bytes(data, key):\n    return bytes(b ^ key[i % len(key)] for i, b in enumerate(data))\n\nplaintext = b\"Card 4111-1111-1111-1111\"\nkey = b\"k3y!\"\nciphertext = xor_bytes(plaintext, key)\nprint(\"ciphertext hex:\", ciphertext.hex()[:32], \"...\")\nprint(\"decrypted:\", xor_bytes(ciphertext, key).decode())\nprint(\"wrong key:\", xor_bytes(ciphertext, b\"nope\"))",
        "output": "ciphertext hex: 28520b454b0748105a1e48105a025410 ...\ndecrypted: Card 4111-1111-1111-1111\nwrong key: b'F={ %h8u4q8u4m$u4m8i4m8u'",
        "codeNotes": [
          {
            "line": 2,
            "note": "XOR each byte with a byte of the key, repeating the key."
          },
          {
            "line": 9,
            "note": "With the wrong key you get garbage, not the card number."
          }
        ],
        "tryIt": "Encrypt the same plaintext twice with the same key. Is the ciphertext the same? Why is that a weakness real algorithms avoid?",
        "check": {
          "question": "What does encryption at rest protect against?",
          "options": [
            "Slow networks",
            "Someone reading stored data from a stolen disk or leaked backup",
            "Typos in code"
          ],
          "answer": 1,
          "why": "Stored data stays unreadable without the key."
        }
      },
      {
        "title": "KMS keys, policies and grants",
        "say": [
          "A KMS key (once called a customer master key) is identified by an ARN such as arn:aws:kms:ap-south-1:111122223333:key/1234abcd-....",
          "AWS managed keys are created automatically by services such as S3 or RDS. Customer managed keys are keys you create, with policies you control and the option to disable or schedule deletion.",
          "Every KMS key has a key policy, a resource policy like a bucket policy. Unlike most resources, IAM permissions alone are not enough: the key policy must allow the account (usually by allowing the account root) for IAM policies to take effect.",
          "Conditions make key policies precise. kms:ViaService limits use to calls coming through a specific service, for example allowing decryption only when S3 in ap-south-1 is the caller.",
          "Grants are temporary, programmatic permissions that services like EBS use to let a server decrypt its own disk.",
          "The example checks who may use a key under a simple key policy.",
          "Deleting a KMS key is irreversible and makes all data encrypted under it unreadable forever, which is why KMS enforces a waiting period of 7 to 30 days first."
        ],
        "example": "A bank safe deposit box whose rules are written on the box itself: who may open it, and only in the presence of a bank officer.",
        "code": "policy = [\n    {\"principal\": \"arn:aws:iam::111122223333:root\", \"actions\": [\"kms:*\"]},\n    {\"principal\": \"role/media-app\", \"actions\": [\"kms:Decrypt\"], \"via\": \"s3.ap-south-1.amazonaws.com\"},\n]\n\ndef may(principal, action, via=None):\n    for s in policy:\n        if s[\"principal\"] == principal and (action in s[\"actions\"] or \"kms:*\" in s[\"actions\"]):\n            if \"via\" not in s or s[\"via\"] == via:\n                return True\n    return False\n\nprint(\"decrypt via S3:\", may(\"role/media-app\", \"kms:Decrypt\", via=\"s3.ap-south-1.amazonaws.com\"))\nprint(\"decrypt directly:\", may(\"role/media-app\", \"kms:Decrypt\"))\nprint(\"delete the key:\", may(\"role/media-app\", \"kms:ScheduleKeyDeletion\"))",
        "output": "decrypt via S3: True\ndecrypt directly: False\ndelete the key: False",
        "codeNotes": [
          {
            "line": 3,
            "note": "The app may decrypt only when S3 makes the call on its behalf."
          },
          {
            "line": 9,
            "note": "The ViaService condition must also match."
          }
        ],
        "tryIt": "Add a statement letting \"role/backup\" encrypt (kms:Encrypt) with no condition. Test it.",
        "check": {
          "question": "Why is deleting a KMS key so dangerous?",
          "options": [
            "It costs a lot",
            "All data encrypted under it becomes unreadable forever",
            "It deletes your AWS account"
          ],
          "answer": 1,
          "why": "Without the key, the ciphertext can never be decrypted; KMS forces a waiting period for this reason."
        }
      },
      {
        "title": "Envelope encryption",
        "say": [
          "KMS can encrypt at most 4 KB of data directly, and every call goes over the network. Encrypting a 2 GB video through KMS byte by byte would be slow and impossible.",
          "Envelope encryption solves this. Ask KMS for a data key. KMS returns it twice: once in plaintext and once encrypted under your KMS key.",
          "Encrypt your data locally with the plaintext data key, which is fast. Then throw the plaintext data key away and store the encrypted data key next to the ciphertext.",
          "To decrypt, send the encrypted data key to KMS. If IAM and the key policy allow it, KMS returns the plaintext data key, and you decrypt the data locally.",
          "The master key never leaves KMS, each object can have its own data key, and only small data keys ever travel to KMS. S3, EBS, RDS and DynamoDB all use this pattern.",
          "Practice 1 is envelope_encrypt and envelope_decrypt with XOR standing in for the real ciphers: the data is XORed with the data key, and the data key with the master key.",
          "The example walks through both directions and shows what is stored."
        ],
        "example": "Putting a document in a locked box, then locking the box's key in a bank vault. You store the box and the receipt for the key; only the bank can give the key back.",
        "code": "def xor_bytes(data, key):\n    return bytes(b ^ key[i % len(key)] for i, b in enumerate(data))\n\nmaster_key = b\"lives-only-inside-kms\"\ndata_key = b\"\\x13\\x37\\xbe\\xef\\x42\\x10\"      # KMS GenerateDataKey gives this ...\nencrypted_data_key = xor_bytes(data_key, master_key)   # ... and this\nstored = {\"ciphertext\": xor_bytes(b\"Aadhaar 1234 5678 9012\", data_key).hex(),\n          \"encrypted_data_key\": encrypted_data_key.hex(), \"key_id\": \"alias/pinit-pii\"}\ndel data_key                                            # never store the plaintext key\nprint(\"stored:\", stored)\n\nrecovered_key = xor_bytes(bytes.fromhex(stored[\"encrypted_data_key\"]), master_key)   # KMS Decrypt\nprint(\"decrypted:\", xor_bytes(bytes.fromhex(stored[\"ciphertext\"]), recovered_key).decode())",
        "output": "stored: {'ciphertext': '5256da87237161178fdd7124330288d87a302a078fdd', 'encrypted_data_key': '7f5ec88a313d', 'key_id': 'alias/pinit-pii'}\ndecrypted: Aadhaar 1234 5678 9012",
        "codeNotes": [
          {
            "line": 6,
            "note": "The data key, encrypted under the master key, is safe to store."
          },
          {
            "line": 9,
            "note": "The plaintext data key is discarded after use."
          },
          {
            "line": 12,
            "note": "Only KMS (holding the master key) can unwrap the data key."
          }
        ],
        "tryIt": "Try decrypting with a different master key. What do you get?",
        "check": {
          "question": "In envelope encryption, what is stored next to the ciphertext?",
          "options": [
            "The plaintext data key",
            "The encrypted data key",
            "The KMS master key"
          ],
          "answer": 1,
          "why": "Only the wrapped (encrypted) data key is stored; KMS unwraps it when allowed."
        }
      },
      {
        "title": "Auditing key policies",
        "say": [
          "A key policy that is too open undoes the protection KMS offers. Two patterns are especially risky.",
          "First, a public principal: an Allow with \"Principal\": \"*\" (or {\"AWS\": \"*\"}) and no condition lets anyone in any AWS account use the key, if they also have some route to it.",
          "A \"*\" principal with a strong condition, such as kms:ViaService or kms:CallerAccount, can be acceptable, because the condition narrows it down.",
          "Second, broad admin: \"Action\": \"kms:*\" for anyone other than the account root. The root statement is the standard way to hand control to IAM; giving kms:* to an app role means the app could disable or delete the key.",
          "Practice 2 is key_policy_risks(policy): return a sorted list of risk codes, PUBLIC_PRINCIPAL and KMS_WILDCARD, without duplicates.",
          "Collect risks in a set so repeated findings appear once, then return sorted(risks) for a stable result.",
          "The example audits a policy with one of each risk."
        ],
        "example": "Checking a building's key register for master keys handed to temporary staff, and for any key labelled \"anyone may borrow\".",
        "code": "def key_policy_risks(policy):\n    risks = set()\n    for s in policy[\"Statement\"]:\n        if s.get(\"Effect\") != \"Allow\":\n            continue\n        p = s.get(\"Principal\")\n        p = p.get(\"AWS\") if isinstance(p, dict) else p\n        if p == \"*\" and not s.get(\"Condition\"):\n            risks.add(\"PUBLIC_PRINCIPAL\")\n        if s.get(\"Action\") == \"kms:*\" and not str(p).endswith(\":root\"):\n            risks.add(\"KMS_WILDCARD\")\n    return sorted(risks)\n\npol = {\"Statement\": [\n    {\"Effect\": \"Allow\", \"Principal\": {\"AWS\": \"arn:aws:iam::1:root\"}, \"Action\": \"kms:*\"},\n    {\"Effect\": \"Allow\", \"Principal\": {\"AWS\": \"arn:aws:iam::1:role/app\"}, \"Action\": \"kms:*\"},\n    {\"Effect\": \"Allow\", \"Principal\": \"*\", \"Action\": \"kms:Decrypt\"}]}\nprint(key_policy_risks(pol))",
        "output": "['KMS_WILDCARD', 'PUBLIC_PRINCIPAL']",
        "codeNotes": [
          {
            "line": 7,
            "note": "Principals can be a string or {\"AWS\": ...}; handle both."
          },
          {
            "line": 10,
            "note": "kms:* is expected only for the account root."
          }
        ],
        "tryIt": "Add a Condition with kms:ViaService to the third statement. Which risk disappears?",
        "check": {
          "question": "Which statement is the standard, acceptable use of kms:*?",
          "options": [
            "An app role with kms:*",
            "The account root principal with kms:*, so IAM policies can grant access",
            "Principal * with kms:*"
          ],
          "answer": 1,
          "why": "Allowing the account root delegates control to IAM; other principals should get only the actions they need."
        }
      },
      {
        "title": "Rotation, secrets and CloudTrail",
        "say": [
          "Key rotation limits how much data any one key version protects. KMS can rotate customer managed keys automatically, by default every year.",
          "Rotation keeps the same key id and ARN. KMS keeps old key material so older data still decrypts, and uses the new material for new encryptions. Nothing in your app changes.",
          "Application secrets such as database passwords and API keys belong in AWS Secrets Manager, which encrypts them with KMS and can rotate them automatically with a small Lambda function.",
          "Never put secrets in code, images or plain environment variables (Day 22). Secrets committed to Git are found by scanners within minutes.",
          "Every KMS call is logged in AWS CloudTrail: who asked to decrypt what, when, from where. Unusual patterns, such as a role decrypting thousands of objects at night, are a strong sign of trouble.",
          "The example checks which keys are due for rotation from their last rotation date.",
          "Good key hygiene is boring by design: automatic rotation, secrets in a manager, and logs that someone actually looks at."
        ],
        "example": "Changing the locks on a building every year while keeping old keys in a sealed safe, so old filing cabinets can still be opened.",
        "code": "from datetime import date\n\nkeys = {\"alias/pinit-pii\": date(2025, 8, 1), \"alias/pinit-logs\": date(2026, 6, 15), \"alias/legacy\": date(2023, 1, 10)}\ntoday = date(2026, 9, 29)\nfor alias, last in keys.items():\n    age = (today - last).days\n    status = \"ROTATE NOW\" if age > 365 else f\"ok ({365 - age} days left)\"\n    print(f\"{alias:17} last rotated {last}  {status}\")",
        "output": "alias/pinit-pii   last rotated 2025-08-01  ROTATE NOW\nalias/pinit-logs  last rotated 2026-06-15  ok (259 days left)\nalias/legacy      last rotated 2023-01-10  ROTATE NOW",
        "codeNotes": [
          {
            "line": 6,
            "note": "Subtracting dates gives a timedelta; .days is the whole number of days."
          }
        ],
        "tryIt": "Which key is most overdue, and by how many days?",
        "check": {
          "question": "After automatic KMS key rotation, what happens to data encrypted before?",
          "options": [
            "It must be re-encrypted immediately",
            "It still decrypts, because KMS keeps the older key material",
            "It is lost"
          ],
          "answer": 1,
          "why": "Rotation keeps old material for decryption and uses new material for new data."
        }
      },
      {
        "title": "Practice time: envelopes and policies",
        "say": [
          "Practice 1 has three functions. xor_bytes(data, key) is one line with enumerate and a bytes(...) around a generator.",
          "envelope_encrypt returns three fields: the plaintext encoded to bytes, XORed with the data key, as hex; the data key XORed with the master key, as hex; and the key id.",
          "envelope_decrypt reverses it: turn the hex back into bytes with bytes.fromhex, recover the data key with the master key, then recover the plaintext and .decode() it.",
          "The checks confirm the plaintext does not appear in the ciphertext, the data key is not stored in the clear, and a round trip gives the original text.",
          "Practice 2: key_policy_risks(policy). Skip non-Allow statements, normalise the principal, collect risks in a set and return them sorted.",
          "These exercises make the most important cloud security idea concrete: data is only as safe as the keys and the policies around them.",
          "The example shows the hex round trip that trips people up."
        ],
        "example": "Writing a phone number in a different script: the digits are the same, you just have to convert back before dialling.",
        "code": "raw = b\"\\x00\\x0f\\xf0\\xff\"\nas_hex = raw.hex()\nprint(\"hex text:\", as_hex, \"length\", len(as_hex))\nback = bytes.fromhex(as_hex)\nprint(\"round trip ok:\", back == raw)",
        "output": "hex text: 000ff0ff length 8\nround trip ok: True",
        "codeNotes": [
          {
            "line": 2,
            "note": "Each byte becomes two hex characters."
          },
          {
            "line": 4,
            "note": "bytes.fromhex reverses .hex()."
          }
        ],
        "tryIt": "What error do you get from bytes.fromhex(\"xyz\")? Why is hex a safe way to store bytes in JSON?",
        "check": {
          "question": "Which function reverses bytes.hex()?",
          "options": [
            "str.encode",
            "bytes.fromhex",
            "int.from_bytes"
          ],
          "answer": 1,
          "why": "bytes.fromhex turns a hex string back into the original bytes."
        }
      }
    ],
    "summary": [
      "Encrypt in transit with TLS and at rest with KMS-backed keys; the hard problem is key management.",
      "KMS keys never leave KMS; key policies (plus IAM) decide who may use them; deletion is irreversible.",
      "Envelope encryption: encrypt data locally with a data key and store the data key encrypted under the KMS key.",
      "Audit key policies for public principals without conditions and kms:* outside the account root.",
      "Rotate keys automatically, keep secrets in Secrets Manager, and watch CloudTrail."
    ],
    "projectStep": {
      "title": "Encryption plan for your app",
      "steps": [
        "Classify your app's data and choose a key (AWS managed or customer managed) for each class.",
        "Implement envelope encryption with XOR as a model and prove a round trip.",
        "Write a key policy and audit it with key_policy_risks."
      ]
    }
  },
  {
    "day": 27,
    "title": "AWS WAF & AWS Shield: DDoS & SQLi/XSS Protection",
    "goal": "You can explain common web attacks and DDoS, how AWS WAF web ACLs and rule order work, detect SQL injection and XSS signatures, apply rate-based rules, validate IP sets, and describe what AWS Shield adds.",
    "minutes": 30,
    "recap": "Your app is encrypted and access-controlled. But it is on the public internet, where attackers send malicious input and floods of traffic. Today you put a web application firewall in front.",
    "parts": [
      {
        "title": "Threats at the front door",
        "say": [
          "Anything public receives hostile traffic within minutes: bots probing for weaknesses, scrapers, credential stuffing with leaked passwords, and attempts to inject code.",
          "SQL injection sneaks database commands into input, such as a login name of ' OR 1=1 --, hoping the app pastes it into a query. It can dump or delete whole databases.",
          "Cross-site scripting (XSS) sneaks JavaScript into pages other users view, for example a comment containing a <script> tag, to steal their sessions.",
          "Distributed denial of service (DDoS) floods a service with traffic from many machines so real users cannot get through.",
          "The real fix for injection is in the code: parameterised queries and output escaping. A firewall is an extra layer that blocks known attack patterns before they reach the code, and buys time when a bug is found.",
          "The example shows why pasting input into SQL is dangerous and how a parameterised query treats the same input as plain data.",
          "Defence in depth again: safe code, a firewall in front, and monitoring behind."
        ],
        "example": "A bank teller who reads the amount on a cheque as a number, never as an instruction, even if someone writes \"and empty the vault\" in the amount box.",
        "code": "user_input = \"' OR 1=1 --\"\nunsafe = f\"SELECT * FROM users WHERE name = '{user_input}'\"\nprint(\"pasted into SQL:\", unsafe)\n\nquery = \"SELECT * FROM users WHERE name = ?\"\nparams = (user_input,)\nprint(\"parameterised:\", query, \"with value\", params)",
        "output": "pasted into SQL: SELECT * FROM users WHERE name = '' OR 1=1 --'\nparameterised: SELECT * FROM users WHERE name = ? with value (\"' OR 1=1 --\",)",
        "codeNotes": [
          {
            "line": 2,
            "note": "The input changes the meaning of the query: OR 1=1 matches every row."
          },
          {
            "line": 6,
            "note": "With parameters, the database treats the whole input as a name."
          }
        ],
        "tryIt": "Look at the pasted query closely. Which part of the input closes the quote and which part comments out the rest?",
        "check": {
          "question": "What is the primary defence against SQL injection?",
          "options": [
            "A firewall only",
            "Parameterised queries in the application code",
            "Longer passwords"
          ],
          "answer": 1,
          "why": "Parameters keep input as data; the firewall is an extra layer."
        }
      },
      {
        "title": "AWS WAF web ACLs",
        "say": [
          "AWS WAF is a web application firewall you attach to CloudFront, an Application Load Balancer, API Gateway and some other services.",
          "You configure a web ACL: an ordered list of rules, each with an action (Allow, Block, Count, or a CAPTCHA challenge), plus a default action for traffic no rule matched.",
          "Rules are evaluated by priority and the first rule that blocks or allows ends the evaluation, much like NACL rules on Day 4. Count only records a match, which is how you test a new rule safely.",
          "AWS Managed Rules give you ready-made rule groups: the core rule set for common attacks, SQL injection, known bad inputs, IP reputation lists and bot control.",
          "Practice 1 is inspect_request(rules, request) with three rule types: IP_BLOCK, SQLI and RATE_LIMIT, checked in order, returning the first blocking rule.",
          "Always roll out new rules in Count mode first, watch what they would have blocked, and only then switch to Block. A rule that blocks real customers is an outage you caused yourself.",
          "The example evaluates a web ACL over a few calls."
        ],
        "example": "Security at a stadium with several checkpoints in order: banned-list check, bag search, then a head count at the gate. The first checkpoint that stops you decides.",
        "code": "SQLI_SIGNS = [\"' or 1=1\", \"union select\", \"; drop table\", \"--\"]\n\ndef inspect_request(rules, req):\n    for rule in rules:\n        kind = rule[\"type\"]\n        if kind == \"IP_BLOCK\" and req[\"ip\"] in rule[\"ips\"]:\n            return {\"action\": \"BLOCK\", \"rule\": kind}\n        if kind == \"SQLI\" and any(s in req[\"query\"].lower() for s in SQLI_SIGNS):\n            return {\"action\": \"BLOCK\", \"rule\": kind}\n        if kind == \"RATE_LIMIT\" and req[\"count_5min\"] > rule[\"limit\"]:\n            return {\"action\": \"BLOCK\", \"rule\": kind}\n    return {\"action\": \"ALLOW\", \"rule\": None}\n\nacl = [{\"type\": \"IP_BLOCK\", \"ips\": [\"198.51.100.66\"]}, {\"type\": \"SQLI\"}, {\"type\": \"RATE_LIMIT\", \"limit\": 100}]\nfor req in [{\"ip\": \"49.36.1.2\", \"query\": \"page=2\", \"count_5min\": 12},\n            {\"ip\": \"49.36.1.2\", \"query\": \"id=5 UNION SELECT card FROM cards\", \"count_5min\": 12},\n            {\"ip\": \"49.36.1.3\", \"query\": \"page=2\", \"count_5min\": 900}]:\n    print(req[\"query\"][:28], \"->\", inspect_request(acl, req))",
        "output": "page=2 -> {'action': 'ALLOW', 'rule': None}\nid=5 UNION SELECT card FROM  -> {'action': 'BLOCK', 'rule': 'SQLI'}\npage=2 -> {'action': 'BLOCK', 'rule': 'RATE_LIMIT'}",
        "codeNotes": [
          {
            "line": 8,
            "note": "Lowercase first so UNION SELECT and union select both match."
          },
          {
            "line": 12,
            "note": "The default action when no rule blocks."
          }
        ],
        "tryIt": "Add an \"XSS\" rule type that blocks queries containing \"<script\". Where in the list should it go?",
        "check": {
          "question": "Why roll out a new WAF rule in Count mode first?",
          "options": [
            "Count mode is cheaper",
            "To see what it would block before it can block real customers",
            "Block mode needs a restart"
          ],
          "answer": 1,
          "why": "Count lets you check for false positives safely."
        }
      },
      {
        "title": "Rate-based rules",
        "say": [
          "Many attacks are simply too many calls from one place: password guessing, scraping, or a small flood. Rate-based rules count calls per IP address over a rolling window, usually 5 minutes.",
          "When an IP goes over the limit, WAF blocks it (or challenges it) until its rate falls back under the limit.",
          "Rate rules can be narrowed with scope-down statements, for example counting only calls to /login, where 20 attempts in 5 minutes is already suspicious, while browsing pages stays unlimited.",
          "Choose limits from real data. Look at the highest rates normal users reach, then set the limit comfortably above that.",
          "Remember shared addresses: a whole office or a mobile network may appear as one IP. Too low a limit blocks many innocent people at once.",
          "The example counts calls per IP in a 5-minute window and flags the ones over the limit.",
          "Rate limits in WAF protect everything behind them; rate limits in API Gateway (Day 12) protect individual APIs. Both are useful."
        ],
        "example": "A shop that lets any customer in, but stops the one person trying the fitting-room door 200 times in five minutes.",
        "code": "from collections import Counter\n\nwindow = [(\"49.36.1.2\", \"/products\")] * 40 + [(\"203.0.113.9\", \"/login\")] * 60 + [(\"49.36.7.7\", \"/login\")] * 3\nLOGIN_LIMIT = 20\nlogin_counts = Counter(ip for ip, path in window if path == \"/login\")\nfor ip, n in login_counts.items():\n    print(f\"{ip:12} {n:3} login attempts in 5 min ->\", \"BLOCK\" if n > LOGIN_LIMIT else \"allow\")\nprint(\"browsing is not limited:\", Counter(ip for ip, p in window if p == \"/products\"))",
        "output": "203.0.113.9   60 login attempts in 5 min -> BLOCK\n49.36.7.7      3 login attempts in 5 min -> allow\nbrowsing is not limited: Counter({'49.36.1.2': 40})",
        "codeNotes": [
          {
            "line": 5,
            "note": "The scope-down: only /login calls are counted."
          }
        ],
        "tryIt": "What limit would you choose if real users sometimes mistype their password 5 times? Explain.",
        "check": {
          "question": "A whole university campus shares one public IP. What is the risk of a very low rate limit?",
          "options": [
            "None",
            "Many innocent users get blocked together",
            "The campus gets faster access"
          ],
          "answer": 1,
          "why": "Shared addresses make one IP look like many users; limits must allow for that."
        }
      },
      {
        "title": "IP sets and CIDR validation",
        "say": [
          "IP sets are lists of addresses or ranges that rules can reference, such as \"known bad actors\" or \"our office ranges allowed into the admin site\".",
          "Entries are written in CIDR notation (Day 3), for IPv4 like 203.0.113.0/24 and IPv6 like 2001:db8::/32. A single address needs a prefix length too: /32 for IPv4, /128 for IPv6.",
          "A range written with host bits set, such as 10.0.0.5/24, is ambiguous: did the author mean 10.0.0.0/24 or just 10.0.0.5? Strict parsing rejects it so mistakes are caught.",
          "Practice 2 is valid_ip_set(ranges). Every entry must contain \"/\" and parse with ipaddress.ip_network(r, strict=True); an empty list is invalid too, because it protects nothing.",
          "Validating IP sets before deploying avoids nasty surprises, such as a typo that blocks 0.0.0.0/0 (everyone) instead of one range.",
          "The example validates several entries and prints why the bad ones fail.",
          "The same ipaddress module you used for subnets works for IPv6, so one function covers both."
        ],
        "example": "A guest list where every entry must be a complete, correctly written address; \"somewhere on Main Street\" is rejected.",
        "code": "import ipaddress\n\nfor entry in [\"203.0.113.0/24\", \"2001:db8::/32\", \"10.0.0.5/24\", \"10.0.0.1\", \"0.0.0.0/0\", \"banana\"]:\n    if \"/\" not in entry:\n        print(f\"{entry:15} INVALID: needs a prefix length like /32\")\n        continue\n    try:\n        net = ipaddress.ip_network(entry, strict=True)\n        note = \"  <- careful: this is EVERY address\" if net.prefixlen == 0 else \"\"\n        print(f\"{entry:15} ok ({net.num_addresses} addresses){note}\")\n    except ValueError as err:\n        print(f\"{entry:15} INVALID: {err}\")",
        "output": "203.0.113.0/24  ok (256 addresses)\n2001:db8::/32   ok (79228162514264337593543950336 addresses)\n10.0.0.5/24     INVALID: 10.0.0.5/24 has host bits set\n10.0.0.1        INVALID: needs a prefix length like /32\n0.0.0.0/0       ok (4294967296 addresses)  <- careful: this is EVERY address\nbanana          INVALID: needs a prefix length like /32",
        "codeNotes": [
          {
            "line": 8,
            "note": "strict=True rejects ranges with host bits set."
          },
          {
            "line": 9,
            "note": "A /0 range is valid but almost never what you meant in a block list."
          }
        ],
        "tryIt": "Add \"198.51.100.7/32\". How many addresses does it cover?",
        "check": {
          "question": "Why is 10.0.0.5/24 rejected with strict parsing?",
          "options": [
            "It is IPv6",
            "It has host bits set; the network would be 10.0.0.0/24",
            "It is too large"
          ],
          "answer": 1,
          "why": "Strict mode insists the address is the network address for that prefix."
        }
      },
      {
        "title": "DDoS and AWS Shield",
        "say": [
          "Distributed denial of service attacks come in layers. Network and transport attacks (layer 3 and 4) flood bandwidth or connection tables, such as SYN floods and UDP reflection.",
          "Application attacks (layer 7) send floods of real-looking HTTP calls to expensive pages, like search, to exhaust servers.",
          "AWS Shield Standard is included for everyone at no extra cost and protects against most common network and transport attacks on AWS edge services.",
          "AWS Shield Advanced is a paid service adding enhanced detection, the AWS Shield Response Team, cost protection for scaling during an attack, and automatic application-layer mitigation with WAF.",
          "Architecture matters as much as products: serve through CloudFront so the edge absorbs floods, keep origins private, use Auto Scaling, and cache aggressively so attacks hit the cache, not your servers.",
          "The example estimates how much of an attack reaches the origin when CloudFront caches most of it.",
          "Test your defences only with permission and through AWS's approved process; attacking even your own resources without it can breach the terms of service."
        ],
        "example": "A breakwater in front of a harbour: the waves still come, but they break on the wall instead of on the boats.",
        "code": "attack_calls_per_s = 200_000\nfor hit_ratio in [0.0, 0.90, 0.99]:\n    to_origin = attack_calls_per_s * (1 - hit_ratio)\n    print(f\"cache hit ratio {hit_ratio:4.0%}: {to_origin:9,.0f} calls/s reach the origin\")",
        "output": "cache hit ratio   0%:   200,000 calls/s reach the origin\ncache hit ratio  90%:    20,000 calls/s reach the origin\ncache hit ratio  99%:     2,000 calls/s reach the origin",
        "codeNotes": [
          {
            "line": 3,
            "note": "Only cache misses travel to your servers."
          }
        ],
        "tryIt": "If your origin can handle 5,000 calls per second, what hit ratio do you need to survive this attack?",
        "check": {
          "question": "What does AWS Shield Standard cost?",
          "options": [
            "A monthly subscription",
            "Nothing extra; it is included for all customers",
            "Per blocked attack"
          ],
          "answer": 1,
          "why": "Shield Standard is automatic and free; Shield Advanced is the paid tier."
        }
      },
      {
        "title": "Practice time: inspect and validate",
        "say": [
          "Practice 1: inspect_request(rules, request). Loop over the rules in order and return at the first one that blocks. Lowercase the query before looking for SQL injection signs.",
          "The signs list includes \"--\", the SQL comment marker, because attackers use it to cut off the rest of a query.",
          "The checks include a request that breaks several rules at once, and expect the FIRST rule in the list to be reported. Order is part of the behaviour.",
          "Practice 2: valid_ip_set(ranges). Empty list: False. Any entry without \"/\": False. Any entry that raises ValueError with strict=True: False. Otherwise True.",
          "Real WAF signatures are far more sophisticated than a list of strings, using parsing and scoring, but the structure of ordered rules and first-match wins is exactly the same.",
          "After passing, add a Count mode to your inspector that records which rules WOULD have blocked, without blocking.",
          "The example shows a Count-mode dry run over a batch of traffic."
        ],
        "example": "A dress rehearsal where the fire marshal notes every door that would have been locked, before the doors are actually locked on opening night.",
        "code": "SIGNS = [\"' or 1=1\", \"union select\", \"--\"]\ntraffic = [\"page=1\", \"q=shoes\", \"id=1' OR 1=1\", \"sort=price--desc\", \"q=union select\"]\nwould_block = [q for q in traffic if any(s in q.lower() for s in SIGNS)]\nprint(\"Count mode: would block\", len(would_block), \"of\", len(traffic))\nfor q in would_block:\n    print(\"  \", q)",
        "output": "Count mode: would block 3 of 5\n   id=1' OR 1=1\n   sort=price--desc\n   q=union select",
        "codeNotes": [
          {
            "line": 3,
            "note": "Count mode records matches without blocking."
          }
        ],
        "tryIt": "One of the matches is a false positive from a real customer. Which one, and how would you refine the rule?",
        "check": {
          "question": "A request breaks both the SQLI rule (listed first) and the RATE_LIMIT rule. What is reported?",
          "options": [
            "RATE_LIMIT",
            "SQLI",
            "Both"
          ],
          "answer": 1,
          "why": "Rules are evaluated in order, and the first blocking rule ends the evaluation."
        }
      }
    ],
    "summary": [
      "Public apps face injection, XSS, credential stuffing and DDoS; fix injection in code first.",
      "AWS WAF web ACLs evaluate prioritised rules; test new rules in Count mode.",
      "Rate-based rules limit calls per IP over 5 minutes; scope them to sensitive paths.",
      "IP sets use strict CIDR notation for IPv4 and IPv6; validate before deploying.",
      "Shield Standard is free; Shield Advanced adds response and cost protection; CloudFront caching absorbs floods."
    ],
    "projectStep": {
      "title": "Protect your app's front door",
      "steps": [
        "Write a web ACL for your app with at least three ordered rules.",
        "Run it in Count mode over sample traffic and remove false positives.",
        "Validate your IP sets and choose a login rate limit from expected user behaviour."
      ]
    }
  },
  {
    "day": 28,
    "title": "AWS FinOps: Cost Optimization, Compute Savings Plans & Cost Allocation Tags",
    "goal": "You can explain FinOps, read what drives a cloud bill, calculate Savings Plan bills and break-even, find idle and oversized resources, enforce cost allocation tags, and set budgets and alerts.",
    "minutes": 30,
    "recap": "You can now build almost anything on AWS. The next question every company asks is: what does it cost, who is spending it, and how do we spend less without breaking anything?",
    "parts": [
      {
        "title": "FinOps: engineering meets finance",
        "say": [
          "FinOps is the practice of managing cloud cost as a shared responsibility between engineering, finance and product teams.",
          "In the cloud, every engineer can spend money with an API call. That is powerful and dangerous, so cost has to be visible to the people who create it.",
          "The FinOps cycle has three phases. Inform: see who spends what. Optimise: remove waste and buy smarter. Operate: set budgets, targets and habits so savings stick.",
          "A useful measure is unit cost: cost per order, per active user or per thousand API calls. A growing bill is fine if unit cost falls; a flat bill is worrying if traffic fell.",
          "Most waste comes from a few causes: idle resources, oversized resources, paying on-demand prices for steady load, and forgotten storage.",
          "The example computes unit cost per order for three months to see whether efficiency improved.",
          "Cost is a design property, like speed or security. Good engineers consider it from the first sketch."
        ],
        "example": "A household budget where every family member can see the shared bills and knows which ones they run up.",
        "code": "months = [(\"Jul\", 42_000, 120_000), (\"Aug\", 51_000, 170_000), (\"Sep\", 55_000, 220_000)]\nfor name, bill, orders in months:\n    print(f\"{name}: bill {bill:>7,} orders {orders:>8,} cost per order {bill / orders:.3f}\")",
        "output": "Jul: bill  42,000 orders  120,000 cost per order 0.350\nAug: bill  51,000 orders  170,000 cost per order 0.300\nSep: bill  55,000 orders  220,000 cost per order 0.250",
        "codeNotes": [
          {
            "line": 3,
            "note": "Unit cost: the bill divided by the business result."
          }
        ],
        "tryIt": "The bill grew 31 percent from July to September. Is that good or bad news? Use the unit cost to answer.",
        "check": {
          "question": "Why track cost per order rather than only the total bill?",
          "options": [
            "It is required by AWS",
            "It shows whether spending grows efficiently with the business",
            "Totals are always wrong"
          ],
          "answer": 1,
          "why": "Unit cost separates healthy growth from waste."
        }
      },
      {
        "title": "Savings Plans and commitments",
        "say": [
          "On Day 7 you met the idea: commit to steady usage in exchange for a discount. Compute Savings Plans commit to a dollar amount per hour for one or three years and apply to EC2, Fargate and Lambda.",
          "You pay the committed amount every hour whether you use it or not. Usage above the commitment is billed at normal on-demand rates.",
          "So the art is choosing the commitment. Too low and you leave savings on the table; too high and you pay for hours you do not use.",
          "The usual advice is to commit to your baseline, the level you are confident you will use every hour, and let peaks run on-demand or Spot.",
          "Practice 1 is cloud_bill(hours_used, plan_rate, on_demand_rate, committed_hours): committed hours times the plan rate, plus any hours above the commitment at the on-demand rate, rounded to 2 decimals.",
          "Note the max(0, ...) around the extra hours: using fewer hours than committed does not give money back.",
          "The example compares several commitment levels for the same month and finds the cheapest."
        ],
        "example": "A gym membership: cheaper per visit if you go often, wasted money if you stop going, and day passes for the odd extra visit.",
        "code": "def cloud_bill(hours_used, plan_rate, on_demand_rate, committed_hours):\n    return round(committed_hours * plan_rate + max(0, hours_used - committed_hours) * on_demand_rate, 2)\n\nusage = 1000                        # server-hours this month\nfor commit in [0, 400, 700, 1000, 1300]:\n    print(f\"commit {commit:5} h -> bill {cloud_bill(usage, 0.06, 0.10, commit):7.2f}\")",
        "output": "commit     0 h -> bill  100.00\ncommit   400 h -> bill   84.00\ncommit   700 h -> bill   72.00\ncommit  1000 h -> bill   60.00\ncommit  1300 h -> bill   78.00",
        "codeNotes": [
          {
            "line": 2,
            "note": "Committed hours are always paid; only extra hours are on-demand."
          },
          {
            "line": 6,
            "note": "Try several commitments for the same usage."
          }
        ],
        "tryIt": "Usage drops to 600 hours next month. Which commitment is cheapest now, and what did over-committing cost?",
        "check": {
          "question": "You commit to 80 hours at 0.05 and use only 50. What do you pay for the commitment?",
          "options": [
            "50 x 0.05",
            "80 x 0.05",
            "Nothing"
          ],
          "answer": 1,
          "why": "Commitments are paid in full whether or not you use them."
        }
      },
      {
        "title": "Finding idle and oversized resources",
        "say": [
          "The fastest savings come from things nobody is using: servers left running after a test, unattached EBS disks, old snapshots, idle load balancers and forgotten development databases.",
          "Next come oversized resources: a server that never goes above 10 percent CPU could often be half the size or smaller (right-sizing, Day 7).",
          "AWS Compute Optimizer and Cost Explorer recommendations analyse usage and suggest right-sizing, and Trusted Advisor flags idle resources.",
          "Schedules help too. Development environments used only in office hours can stop at night and at weekends, cutting their cost by about two thirds.",
          "Always check with the owner before deleting anything. \"Idle\" sometimes means \"the disaster recovery standby we need once a year\".",
          "The example scans a small inventory and suggests an action for each resource.",
          "Make clean-up a habit: a monthly review of the top idle and oversized items pays for itself many times over."
        ],
        "example": "Going through the fridge each week: throwing out what went off, and buying smaller packs of what you never finish.",
        "code": "inventory = [\n    {\"id\": \"i-web-1\", \"type\": \"m5.2xlarge\", \"avg_cpu\": 7, \"monthly\": 280},\n    {\"id\": \"i-test-9\", \"type\": \"t3.large\", \"avg_cpu\": 0, \"monthly\": 60},\n    {\"id\": \"vol-old\", \"type\": \"ebs-unattached\", \"avg_cpu\": None, \"monthly\": 40},\n    {\"id\": \"i-batch\", \"type\": \"c5.xlarge\", \"avg_cpu\": 71, \"monthly\": 124},\n]\nfor r in inventory:\n    if r[\"avg_cpu\"] is None or r[\"avg_cpu\"] == 0:\n        action, saving = \"check owner, then delete\", r[\"monthly\"]\n    elif r[\"avg_cpu\"] < 20:\n        action, saving = \"right-size to half\", r[\"monthly\"] / 2\n    else:\n        action, saving = \"keep\", 0\n    print(f\"{r['id']:9} {action:25} save about {saving:6.0f}/month\")",
        "output": "i-web-1   right-size to half        save about    140/month\ni-test-9  check owner, then delete  save about     60/month\nvol-old   check owner, then delete  save about     40/month\ni-batch   keep                      save about      0/month",
        "codeNotes": [
          {
            "line": 8,
            "note": "Unattached disks and servers at 0 percent CPU are idle."
          },
          {
            "line": 10,
            "note": "Busy under 20 percent: a smaller size would do."
          }
        ],
        "tryIt": "Add the total monthly saving at the end.",
        "check": {
          "question": "What should you do before deleting an \"idle\" resource?",
          "options": [
            "Nothing, delete it",
            "Check with its owner, because it might be a rarely used standby",
            "Double its size"
          ],
          "answer": 1,
          "why": "Some resources are idle on purpose; tags and owners tell you which."
        }
      },
      {
        "title": "Cost allocation tags",
        "say": [
          "Tags are key-value labels on resources, such as Environment=production, Project=checkout, Owner=payments-team.",
          "Activated as cost allocation tags, they let Cost Explorer and the billing reports split the bill by team, project or environment. Without them, the bill is one big number nobody owns.",
          "A resource missing its tags is \"unallocated spend\". Many companies set a target such as \"under 5 percent unallocated\" and chase down the rest.",
          "Enforce tags early: Terraform modules can add them automatically (Day 24), AWS Organizations tag policies can require them, and pipelines can refuse untagged resources.",
          "Practice 2 is untagged_resources(resources, required). For each resource, list the required tags that are missing or empty, and return a dictionary of only the resources with gaps.",
          "An empty string counts as missing: a tag Owner=\"\" tells finance nothing.",
          "The example splits a bill by the Project tag and shows the unallocated share."
        ],
        "example": "Labelling every box in a shared storeroom with the team that owns it, so the storage bill can be shared fairly.",
        "code": "from collections import defaultdict\n\nresources = [({\"Project\": \"checkout\"}, 420), ({\"Project\": \"search\"}, 310),\n             ({\"Project\": \"checkout\"}, 90), ({}, 180), ({\"Project\": \"\"}, 50)]\nby_project = defaultdict(int)\nfor tags, cost in resources:\n    by_project[tags.get(\"Project\") or \"UNALLOCATED\"] += cost\ntotal = sum(by_project.values())\nfor project, cost in sorted(by_project.items(), key=lambda kv: -kv[1]):\n    print(f\"{project:12} {cost:5} ({cost / total:.0%})\")",
        "output": "checkout       510 (49%)\nsearch         310 (30%)\nUNALLOCATED    230 (22%)",
        "codeNotes": [
          {
            "line": 7,
            "note": "A missing or empty tag falls into UNALLOCATED."
          }
        ],
        "tryIt": "The company target is under 5 percent unallocated. Are they meeting it? What would you do next?",
        "check": {
          "question": "A resource has Owner=\"\" (an empty string). Is the Owner tag present for cost purposes?",
          "options": [
            "Yes",
            "No, an empty value tells nobody who owns it",
            "Only on weekends"
          ],
          "answer": 1,
          "why": "Tags must have meaningful values to allocate cost."
        }
      },
      {
        "title": "Budgets, alerts and anomaly detection",
        "say": [
          "AWS Budgets lets you set monthly limits per account, team tag or service, and sends alerts when actual or forecast spend crosses thresholds, for example 80 and 100 percent.",
          "Forecast alerts are the valuable ones: they warn you in the middle of the month that you are heading over, while there is still time to act.",
          "Cost Anomaly Detection uses machine learning to spot unusual spend, such as a runaway Lambda loop or a data transfer spike, and alerts within about a day.",
          "Budget actions can even apply a restrictive IAM policy or stop instances automatically when a budget is exceeded, which is useful for sandboxes and training accounts.",
          "Every new AWS account, especially for learning, should get a budget alert on day one. Stories of surprise bills almost always start with an account that had none.",
          "The example forecasts month-end spend from the first days and compares it with the budget.",
          "Budgets turn cost from a monthly surprise into a daily, visible number."
        ],
        "example": "A fuel gauge with a warning light: it tells you early that you will not reach the next town, not when the engine stops.",
        "code": "budget = 1500\ndaily_spend = [38, 41, 40, 39, 95, 97, 99, 101]   # something changed on day 5\ndays_in_month = 30\nspent = sum(daily_spend)\nrecent_rate = sum(daily_spend[-3:]) / 3\nforecast = spent + recent_rate * (days_in_month - len(daily_spend))\nprint(f\"spent so far {spent}, forecast {forecast:.0f} vs budget {budget}\")\nif forecast > budget:\n    print(f\"ALERT: forecast is {forecast / budget:.0%} of budget\")",
        "output": "spent so far 550, forecast 2728 vs budget 1500\nALERT: forecast is 182% of budget",
        "codeNotes": [
          {
            "line": 5,
            "note": "Use the recent daily rate, which reflects the change on day 5."
          },
          {
            "line": 8,
            "note": "Forecast alerts warn before the money is spent."
          }
        ],
        "tryIt": "Forecast with the average of ALL days instead of the last three. Would the alert still fire? Which forecast is more honest?",
        "check": {
          "question": "Why are forecast-based budget alerts more useful than actual-spend alerts?",
          "options": [
            "They are free",
            "They warn early, while you can still change course",
            "They are more accurate"
          ],
          "answer": 1,
          "why": "Forecasts give time to act before the budget is gone."
        }
      },
      {
        "title": "Practice time: bills and tags",
        "say": [
          "Practice 1: cloud_bill(hours_used, plan_rate, on_demand_rate, committed_hours). One expression: committed times plan rate, plus max(0, used minus committed) times on-demand rate, rounded to 2 places.",
          "Check the four cases in the task: partly covered, all on-demand, fully covered, and under-used commitment. The last one is where forgetting max(0, ...) gives a negative, wrong answer.",
          "Practice 2: untagged_resources(resources, required). For each resource, build the sorted list of required tags where tags.get(tag) is missing or empty; add the resource only if that list is not empty.",
          "Using \"not r['tags'].get(tag)\" catches both missing keys and empty strings in one test.",
          "Together these cover the two most common FinOps questions: are we buying compute smartly, and do we know who is spending?",
          "After passing, combine them into a monthly report: bill per project, plus the list of resources to tag.",
          "The example shows the negative-hours bug."
        ],
        "example": "A refund machine that gives you money back for gym visits you skipped: it would be nice, but it is not how commitments work.",
        "code": "used, committed, plan, od = 50, 80, 0.05, 0.10\nbuggy = committed * plan + (used - committed) * od\nright = committed * plan + max(0, used - committed) * od\nprint(\"without max(0, ...):\", round(buggy, 2))\nprint(\"with max(0, ...):   \", round(right, 2))",
        "output": "without max(0, ...): 1.0\nwith max(0, ...):    4.0",
        "codeNotes": [
          {
            "line": 2,
            "note": "Negative extra hours would wrongly reduce the bill."
          }
        ],
        "tryIt": "What is the difference between the two answers, and where did it come from?",
        "check": {
          "question": "cloud_bill(100, 0.05, 0.10, 80) equals?",
          "options": [
            "5.00",
            "6.00",
            "10.00"
          ],
          "answer": 1,
          "why": "80 x 0.05 = 4.00 plus 20 extra hours x 0.10 = 2.00 gives 6.00."
        }
      }
    ],
    "summary": [
      "FinOps makes cost visible and shared; track unit cost, not just the total bill.",
      "Savings Plans charge the commitment every hour; commit to the baseline and let peaks run on-demand.",
      "Find and remove idle resources, right-size oversized ones, and schedule development environments.",
      "Cost allocation tags split the bill by owner; empty or missing tags are unallocated spend.",
      "Budgets with forecast alerts and anomaly detection catch problems early."
    ],
    "projectStep": {
      "title": "Cost review for your app",
      "steps": [
        "Estimate your app's monthly bill and its cost per user.",
        "Choose a Savings Plan commitment by comparing several levels with cloud_bill.",
        "Define your required tags and audit a sample inventory with untagged_resources."
      ]
    }
  },
  {
    "day": 29,
    "title": "Disaster Recovery (DR) Strategies: Backup, Pilot Light & Warm Standby",
    "goal": "You can define RTO and RPO, compare the four AWS disaster recovery strategies by cost and speed, choose a strategy from recovery targets, price downtime and data loss, and plan backups and recovery drills.",
    "minutes": 30,
    "recap": "Multi-AZ designs (Days 2, 5 and 14) survive the loss of a data centre. Disaster recovery prepares for bigger events: a whole Region failing, a bad deployment that corrupts data, or ransomware.",
    "parts": [
      {
        "title": "RTO and RPO",
        "say": [
          "Two numbers define every disaster recovery plan.",
          "Recovery Time Objective (RTO) is how long the service may be down after a disaster, for example 1 hour.",
          "Recovery Point Objective (RPO) is how much data, measured in time, you may lose, for example 15 minutes. With an RPO of 15 minutes, orders from the last 15 minutes before the disaster might be gone.",
          "These are business decisions, not technical ones. Ask: what does an hour of downtime cost us? What does losing 15 minutes of orders cost? Then pay for the protection that makes sense.",
          "Tighter targets cost more. Near-zero RTO and RPO require duplicate systems running all the time in another Region.",
          "The example shows what each target means on a timeline around a disaster at 14:00.",
          "Write the targets down and get them agreed. A DR plan with no agreed RTO and RPO cannot be tested or judged."
        ],
        "example": "An insurance policy: how quickly you get a replacement car (RTO) and how many days of your holiday photos you might lose from the broken phone (RPO).",
        "code": "disaster_at = 14 * 60             # 14:00 in minutes\nrpo, rto = 15, 60\nfmt = lambda m: f\"{m // 60:02d}:{m % 60:02d}\"\nprint(\"last safe copy of data:\", fmt(disaster_at - rpo))\nprint(\"disaster:\", fmt(disaster_at))\nprint(\"service back by:\", fmt(disaster_at + rto))\nprint(f\"orders between {fmt(disaster_at - rpo)} and {fmt(disaster_at)} may be lost\")",
        "output": "last safe copy of data: 13:45\ndisaster: 14:00\nservice back by: 15:00\norders between 13:45 and 14:00 may be lost",
        "codeNotes": [
          {
            "line": 3,
            "note": "A small lambda to print minutes as HH:MM."
          },
          {
            "line": 4,
            "note": "RPO looks backwards from the disaster; RTO looks forwards."
          }
        ],
        "tryIt": "Change RPO to 1 minute and RTO to 4 hours. Which business would accept that trade-off?",
        "check": {
          "question": "What does RPO measure?",
          "options": [
            "How long the service is down",
            "How much data (in time) may be lost",
            "How many servers you run"
          ],
          "answer": 1,
          "why": "RPO is the acceptable data loss window before the disaster."
        }
      },
      {
        "title": "The four DR strategies",
        "say": [
          "AWS describes four strategies, from cheapest and slowest to most expensive and fastest.",
          "Backup and restore: take regular backups and copy them to another Region. After a disaster, rebuild everything from code (Day 24) and restore data. RTO in hours, RPO in hours. Cheapest.",
          "Pilot light: keep the core data live in the second Region (for example a replicated database) but no running app servers. After a disaster, start the servers. RTO in tens of minutes.",
          "Warm standby: run a smaller, fully working copy of the whole system in the second Region. After a disaster, scale it up and switch traffic. RTO in minutes.",
          "Multi-site active-active: run the full system in two or more Regions at once, all serving users. A Region failure just shifts traffic. RTO and RPO near zero. Most expensive and most complex.",
          "The example prints the four strategies with rough relative costs and recovery times.",
          "Different parts of one company can use different strategies: payments active-active, the internal wiki backup and restore."
        ],
        "example": "Preparing for a burst pipe at home: keep the plumber's number (backup), keep spare pipes (pilot light), keep a small second flat ready (warm standby), or live in two houses at once (active-active).",
        "code": "strategies = [\n    (\"Backup and restore\", \"hours\", \"hours\", 1),\n    (\"Pilot light\", \"10s of minutes\", \"minutes\", 2),\n    (\"Warm standby\", \"minutes\", \"seconds\", 4),\n    (\"Multi-site active-active\", \"near zero\", \"near zero\", 8),\n]\nprint(f\"{'strategy':26} {'RTO':16} {'RPO':10} relative cost\")\nfor name, rto, rpo, cost in strategies:\n    print(f\"{name:26} {rto:16} {rpo:10} {'$' * cost}\")",
        "output": "strategy                   RTO              RPO        relative cost\nBackup and restore         hours            hours      $\nPilot light                10s of minutes   minutes    $$\nWarm standby               minutes          seconds    $$$$\nMulti-site active-active   near zero        near zero  $$$$$$$$",
        "codeNotes": [
          {
            "line": 9,
            "note": "Each step up roughly doubles the cost in this illustration."
          }
        ],
        "tryIt": "Which strategy would you choose for a school timetable app? And for a stock exchange?",
        "check": {
          "question": "Which strategy keeps only core data live in the second Region, with servers started after a disaster?",
          "options": [
            "Backup and restore",
            "Pilot light",
            "Active-active"
          ],
          "answer": 1,
          "why": "Pilot light keeps the essential data running and starts the rest on demand."
        }
      },
      {
        "title": "Choosing a strategy from targets",
        "say": [
          "Practice 1 is dr_strategy(rto_minutes, rpo_minutes): pick the cheapest strategy that meets BOTH targets.",
          "In this course: backup and restore handles RTO of at least 1,440 minutes (a day) and RPO of at least 60. Pilot light handles RTO of at least 60 and RPO of at least 10. Warm standby handles RTO of at least 5 and RPO of at least 1. Anything tighter needs multi-site active-active.",
          "Keep the tiers in a list ordered from cheapest to most expensive and return the first that fits both numbers, the same table-driven style as Day 1.",
          "Both targets matter. A day of downtime might be acceptable, but if you can only lose 5 minutes of data, backups every few hours are not enough.",
          "Real numbers depend on your systems and must be proven by drills; the thresholds here are typical rules of thumb.",
          "The example runs several business requirements through the chooser.",
          "Choosing by table also makes the decision easy to explain to non-engineers: \"your targets put you in this row\"."
        ],
        "example": "Picking the cheapest delivery option that still arrives before the party and keeps the cake frozen.",
        "code": "TIERS = [(\"BackupAndRestore\", 1440, 60), (\"PilotLight\", 60, 10), (\"WarmStandby\", 5, 1)]\n\ndef dr_strategy(rto_minutes, rpo_minutes):\n    for name, rto, rpo in TIERS:\n        if rto_minutes >= rto and rpo_minutes >= rpo:\n            return name\n    return \"MultiSiteActiveActive\"\n\nfor system, rto, rpo in [(\"internal wiki\", 2880, 1440), (\"online shop\", 60, 15),\n                         (\"banking ledger\", 10, 1), (\"payments switch\", 0, 0), (\"reports\", 3000, 5)]:\n    print(f\"{system:15} RTO {rto:5} RPO {rpo:5} -> {dr_strategy(rto, rpo)}\")",
        "output": "internal wiki   RTO  2880 RPO  1440 -> BackupAndRestore\nonline shop     RTO    60 RPO    15 -> PilotLight\nbanking ledger  RTO    10 RPO     1 -> WarmStandby\npayments switch RTO     0 RPO     0 -> MultiSiteActiveActive\nreports         RTO  3000 RPO     5 -> WarmStandby",
        "codeNotes": [
          {
            "line": 4,
            "note": "Tiers are checked from cheapest to most expensive."
          },
          {
            "line": 5,
            "note": "Both targets must be met."
          }
        ],
        "tryIt": "Why does \"reports\" need warm standby even though its RTO is two days?",
        "check": {
          "question": "RTO 10 minutes, RPO 5 minutes. Which strategy does the chooser return?",
          "options": [
            "PilotLight",
            "WarmStandby",
            "BackupAndRestore"
          ],
          "answer": 1,
          "why": "Pilot light needs RTO of at least 60; warm standby fits 10 and 5."
        }
      },
      {
        "title": "Pricing downtime and data loss",
        "say": [
          "To justify DR spending, estimate what a disaster would cost without it.",
          "Downtime cost: during the RTO no sales happen. That is minutes of downtime times orders per minute times average order value.",
          "Data loss cost: orders taken during the RPO window are lost and must be refunded, re-entered or written off. That is RPO minutes times orders per minute times order value.",
          "Add reputational cost, penalties in contracts (SLA credits) and staff time, which are harder to count but real.",
          "Practice 2 is outage_cost(rto_minutes, rpo_minutes, orders_per_minute, order_value), returning lost sales, lost data and the total.",
          "Compare the result with the yearly cost of a better strategy. If warm standby costs 20,000 a year and one Region outage would cost 300,000, the decision is easy.",
          "The example compares the expected yearly loss under two strategies."
        ],
        "example": "Deciding whether to buy a spare tyre by working out what being stranded on the motorway would cost you.",
        "code": "def outage_cost(rto, rpo, orders_per_minute, order_value):\n    per_minute = orders_per_minute * order_value\n    return {\"lost_sales\": rto * per_minute, \"lost_data\": rpo * per_minute,\n            \"total\": (rto + rpo) * per_minute}\n\ndisasters_per_year = 0.5\nfor name, rto, rpo, yearly_cost in [(\"backup and restore\", 480, 240, 2_000), (\"warm standby\", 15, 1, 30_000)]:\n    loss = outage_cost(rto, rpo, 40, 25)[\"total\"] * disasters_per_year\n    print(f\"{name:18} expected loss {loss:9,.0f} + DR cost {yearly_cost:6,} = {loss + yearly_cost:9,.0f} per year\")",
        "output": "backup and restore expected loss   360,000 + DR cost  2,000 =   362,000 per year\nwarm standby       expected loss     8,000 + DR cost 30,000 =    38,000 per year",
        "codeNotes": [
          {
            "line": 4,
            "note": "Downtime and data loss both cost sales."
          },
          {
            "line": 8,
            "note": "Expected loss: cost of one disaster times how often it happens."
          }
        ],
        "tryIt": "Lower orders_per_minute to 2. Which strategy is cheaper overall now?",
        "check": {
          "question": "RTO 30, RPO 15, 100 orders per minute at 50 each. What is lost_data?",
          "options": [
            "150,000",
            "75,000",
            "225,000"
          ],
          "answer": 1,
          "why": "15 minutes x 100 orders x 50 = 75,000."
        }
      },
      {
        "title": "Backups that actually work",
        "say": [
          "AWS Backup manages backup plans across services (EBS, RDS, DynamoDB, EFS, S3 and more) from one place: schedules, retention and copies to another Region or account.",
          "Follow the 3-2-1 idea: at least three copies of data, on two different kinds of storage, with one copy somewhere else, such as another Region and another account.",
          "A separate backup account protects against the worst case: an attacker or a mistake that deletes everything in the main account. Backup vault locks can make backups undeletable for their retention period.",
          "Backups are only proven by restores. Schedule restore drills, measure how long they really take, and compare the result with your RTO.",
          "Game days go further: deliberately fail a component or a whole Region in a controlled way and practise the recovery, with a checklist, a timer and a review afterwards.",
          "The example checks a backup plan against the 3-2-1 rule and the RPO.",
          "Many teams discover in their first drill that the restore takes three times longer than they assumed. Better to learn that on a quiet Tuesday than during a real disaster."
        ],
        "example": "A fire drill: everyone knows the exit plan on paper, but only the drill shows that one door was blocked by boxes.",
        "code": "copies = [\n    {\"where\": \"ap-south-1 / prod account\", \"media\": \"EBS snapshot\"},\n    {\"where\": \"ap-south-1 / prod account\", \"media\": \"S3\"},\n    {\"where\": \"ap-southeast-1 / backup account\", \"media\": \"S3 Glacier\"},\n]\nbackup_every_minutes, rpo = 60, 15\nchecks = {\n    \"3+ copies\": len(copies) >= 3,\n    \"2+ media types\": len({c[\"media\"].split()[0] for c in copies}) >= 2,\n    \"1+ off-site copy\": any(\"backup account\" in c[\"where\"] for c in copies),\n    \"backups meet RPO\": backup_every_minutes <= rpo,\n}\nfor name, ok in checks.items():\n    print(f\"{name:18} {'PASS' if ok else 'FAIL'}\")",
        "output": "3+ copies          PASS\n2+ media types     PASS\n1+ off-site copy   PASS\nbackups meet RPO   FAIL",
        "codeNotes": [
          {
            "line": 9,
            "note": "Different kinds of storage, judged by the first word."
          },
          {
            "line": 11,
            "note": "Hourly backups cannot meet a 15-minute RPO."
          }
        ],
        "tryIt": "What would you change to meet the 15-minute RPO? (Hint: continuous backups or replication.)",
        "check": {
          "question": "How do you know your backups work?",
          "options": [
            "They finished without errors",
            "You regularly restore from them and measure the time",
            "The console shows a green tick"
          ],
          "answer": 1,
          "why": "Only a tested restore proves a backup is usable and fast enough."
        }
      },
      {
        "title": "Practice time: choose and price",
        "say": [
          "Practice 1: dr_strategy(rto_minutes, rpo_minutes). Store the tiers as a list of (name, minimum RTO, minimum RPO) from cheapest to most expensive; return the first that both numbers satisfy, else MultiSiteActiveActive.",
          "The checks include a long RTO with a tight RPO, which should NOT get backup and restore. That is the case that catches solutions checking only RTO.",
          "Practice 2: outage_cost(rto_minutes, rpo_minutes, orders_per_minute, order_value). Work out the value per minute once, then multiply by each window.",
          "Return exactly the keys lost_sales, lost_data and total. Zero RTO and RPO should cost zero, which is the promise of active-active.",
          "With these two functions you can have a grown-up conversation with a business: here are your targets, here is the matching strategy, here is what a disaster costs without it.",
          "After passing, combine them: for each system, compute the expected yearly loss under each strategy and choose the cheapest total.",
          "The example shows the RTO-only mistake."
        ],
        "example": "Choosing a car only by its top speed and forgetting to check whether it fits in your garage.",
        "code": "def rto_only(rto, rpo):\n    return \"BackupAndRestore\" if rto >= 1440 else \"PilotLight\" if rto >= 60 else \"WarmStandby\" if rto >= 5 else \"MultiSite\"\n\ndef both(rto, rpo):\n    for name, r, p in [(\"BackupAndRestore\", 1440, 60), (\"PilotLight\", 60, 10), (\"WarmStandby\", 5, 1)]:\n        if rto >= r and rpo >= p: return name\n    return \"MultiSite\"\n\nprint(\"RTO 2000, RPO 5 ->\", rto_only(2000, 5), \"vs\", both(2000, 5))",
        "output": "RTO 2000, RPO 5 -> BackupAndRestore vs WarmStandby",
        "codeNotes": [
          {
            "line": 2,
            "note": "Ignores RPO: daily backups would lose far more than 5 minutes of data."
          }
        ],
        "tryIt": "Find another pair of targets where the two functions disagree.",
        "check": {
          "question": "RTO 2 days but RPO 5 minutes. Is backup and restore enough?",
          "options": [
            "Yes, the RTO is long",
            "No, backups every few hours cannot meet a 5-minute RPO",
            "Only with more servers"
          ],
          "answer": 1,
          "why": "Both targets must be met; the RPO rules out periodic backups."
        }
      }
    ],
    "summary": [
      "RTO is acceptable downtime; RPO is acceptable data loss; both are business decisions.",
      "Strategies from cheap to costly: backup and restore, pilot light, warm standby, multi-site active-active.",
      "Pick the cheapest strategy that meets both targets.",
      "Price downtime and data loss to justify DR spending.",
      "Follow 3-2-1 backups with an off-account copy, and prove them with restore drills and game days."
    ],
    "projectStep": {
      "title": "DR plan for your app",
      "steps": [
        "Agree RTO and RPO for each part of your app and pick strategies with dr_strategy.",
        "Price a Region outage with outage_cost and compare with the yearly DR cost.",
        "Write a restore drill checklist and the date you will run it."
      ]
    }
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Global Resilient Multi-Region FinTech Banking Infrastructure with Active-Active Failover",
    "goal": "You can design a global, multi-Region, active-active banking platform: route transactions to the nearest healthy Region that is allowed to hold the customer's data, keep data consistent, fail over safely, and audit the whole architecture for readiness.",
    "minutes": 30,
    "recap": "Thirty days ago you learned what the cloud is. Today's capstone brings every piece together into the hardest kind of system to build: a bank that must stay online through the loss of a whole Region.",
    "parts": [
      {
        "title": "The capstone architecture",
        "say": [
          "The goal: a digital bank serving customers in India, Europe and the United States, with near-zero downtime and near-zero data loss (active-active from Day 29).",
          "Each Region runs a full copy of the stack: CloudFront and WAF at the edge (Days 16 and 27), an ALB and ECS services in private subnets across three AZs (Days 5, 8 and 22), and event queues between services (Days 18-21).",
          "Route 53 latency routing with health checks sends each customer to the nearest healthy Region (Day 17).",
          "Data is the hard part. Customer profiles can use DynamoDB global tables, which replicate across Regions in about a second. Money movements need stricter handling, covered in the next parts.",
          "Everything is defined in Terraform (Day 24), encrypted with KMS keys per Region (Day 26), monitored with CloudWatch (Day 25), and costed and tagged (Day 28).",
          "The example prints the stack per Region as layers, a checklist you could hand to a new engineer.",
          "Take a moment to notice how much you can already design. Every line below is a lesson you have completed."
        ],
        "example": "A global airline with hubs on three continents: each hub can run flights on its own, and if one hub closes, the others absorb its passengers.",
        "code": "layers = [\n    (\"Edge\", \"Route 53 latency + health checks, CloudFront, WAF, Shield\"),\n    (\"Entry\", \"ALB across 3 AZs, TLS from ACM\"),\n    (\"Compute\", \"ECS Fargate services, auto scaling\"),\n    (\"Messaging\", \"EventBridge -> SQS per service, DLQs\"),\n    (\"Data\", \"DynamoDB global tables, Aurora for the ledger\"),\n    (\"Security\", \"IAM roles, KMS keys per Region, Secrets Manager\"),\n    (\"Operations\", \"Terraform, CloudWatch alarms, budgets and tags\"),\n]\nregions = [\"ap-south-1\", \"eu-west-1\", \"us-east-1\"]\nfor layer, what in layers:\n    print(f\"{layer:10} x{len(regions)}  {what}\")",
        "output": "Edge       x3  Route 53 latency + health checks, CloudFront, WAF, Shield\nEntry      x3  ALB across 3 AZs, TLS from ACM\nCompute    x3  ECS Fargate services, auto scaling\nMessaging  x3  EventBridge -> SQS per service, DLQs\nData       x3  DynamoDB global tables, Aurora for the ledger\nSecurity   x3  IAM roles, KMS keys per Region, Secrets Manager\nOperations x3  Terraform, CloudWatch alarms, budgets and tags",
        "codeNotes": [
          {
            "line": 10,
            "note": "Every layer is deployed in every Region."
          }
        ],
        "tryIt": "Add a \"Backup\" layer (AWS Backup copies to a separate account). Which day taught you why?",
        "check": {
          "question": "How does a customer reach the right Region in this design?",
          "options": [
            "They choose from a menu",
            "Route 53 latency routing with health checks",
            "A random pick by the app"
          ],
          "answer": 1,
          "why": "Latency-based DNS with health checks sends users to the nearest healthy Region."
        }
      },
      {
        "title": "Routing transactions: health, latency and residency",
        "say": [
          "Routing a banking transaction has three rules, in this order.",
          "First, legal: the customer's data may only be processed in Regions allowed by data residency law. An Indian customer's data may have to stay in India or approved locations.",
          "Second, health: never send a transaction to an unhealthy Region.",
          "Third, speed: among the Regions that pass the first two rules, choose the lowest latency.",
          "Practice 1 is route_transaction(regions, txn). Filter by health and by allowed_countries containing the customer's country, then take the minimum latency. If nothing qualifies, fail safely rather than breaking the law.",
          "Python's min is stable: when two Regions have the same latency, the first one listed wins, which gives predictable behaviour.",
          "The example routes customers from three countries while one Region is down."
        ],
        "example": "A hospital ambulance service: go only to hospitals licensed for this kind of case, skip any that are closed, and then choose the nearest.",
        "code": "def route_transaction(regions, txn):\n    ok = [r for r in regions if r[\"healthy\"] and txn[\"country\"] in r[\"allowed_countries\"]]\n    if not ok:\n        return {\"success\": False, \"region\": None}\n    return {\"success\": True, \"region\": min(ok, key=lambda r: r[\"latency_ms\"])[\"code\"]}\n\nregions = [\n    {\"code\": \"ap-south-1\", \"healthy\": False, \"latency_ms\": 12, \"allowed_countries\": [\"IN\"]},\n    {\"code\": \"ap-south-2\", \"healthy\": True, \"latency_ms\": 25, \"allowed_countries\": [\"IN\"]},\n    {\"code\": \"eu-west-1\", \"healthy\": True, \"latency_ms\": 30, \"allowed_countries\": [\"DE\", \"FR\", \"IE\"]},\n]\nfor country in [\"IN\", \"DE\", \"US\"]:\n    print(country, \"->\", route_transaction(regions, {\"country\": country, \"amount\": 100}))",
        "output": "IN -> {'success': True, 'region': 'ap-south-2'}\nDE -> {'success': True, 'region': 'eu-west-1'}\nUS -> {'success': False, 'region': None}",
        "codeNotes": [
          {
            "line": 2,
            "note": "Health and residency filter first."
          },
          {
            "line": 5,
            "note": "Then the lowest latency wins."
          }
        ],
        "tryIt": "Mark ap-south-2 unhealthy too. What happens to Indian customers, and why is that the right behaviour for a bank?",
        "check": {
          "question": "Mumbai is down; the only other Region allowed for Indian data is Hyderabad. Frankfurt is faster. Where do Indian transactions go?",
          "options": [
            "Frankfurt, it is faster",
            "Hyderabad, the allowed healthy Region",
            "Nowhere, ever"
          ],
          "answer": 1,
          "why": "Legal residency rules come before latency."
        }
      },
      {
        "title": "Keeping money consistent across Regions",
        "say": [
          "Active-active is easy for data that can be briefly out of sync, like profile pictures. It is hard for balances, because two Regions could each approve a withdrawal from the same account at the same moment.",
          "Global tables resolve concurrent writes with \"last writer wins\". For a balance that could lose a withdrawal, which is unacceptable.",
          "A common solution is a home Region per account: each account's money movements are always processed in one Region, while reads and other data are served everywhere.",
          "If the home Region fails, a controlled failover moves the account's home to another Region, only after the replicated ledger has caught up, using fencing tokens from distributed systems to stop the old Region writing.",
          "Every money movement is also an event in an append-only ledger with an idempotency key (Day 21), so replays and retries never double-charge.",
          "The example shows two Regions approving withdrawals concurrently without a home Region, and the same with one.",
          "This is where cloud architecture and distributed systems meet: the services are managed, but the correctness rules are yours."
        ],
        "example": "A shared bank account where both partners have cards: the bank must check the one true balance, not two separate notebooks each partner keeps.",
        "code": "def withdraw(balance, amount):\n    return (balance - amount, \"approved\") if amount <= balance else (balance, \"declined\")\n\nbalance = 100\nmumbai = withdraw(balance, 80)\nfrankfurt = withdraw(balance, 70)        # both saw 100 at the same moment\nprint(\"no home Region:\", mumbai[1], frankfurt[1], \"-> the bank paid out\", 80 + 70, \"from 100\")\n\nhome_balance = 100\nhome_balance, first = withdraw(home_balance, 80)\nhome_balance, second = withdraw(home_balance, 70)\nprint(\"home Region:\", first, second, \"-> balance\", home_balance)",
        "output": "no home Region: approved approved -> the bank paid out 150 from 100\nhome Region: approved declined -> balance 20",
        "codeNotes": [
          {
            "line": 6,
            "note": "Each Region approved against a stale copy of the balance."
          },
          {
            "line": 11,
            "note": "One home Region applies withdrawals one after another."
          }
        ],
        "tryIt": "What must happen before an account's home Region can move during a failover?",
        "check": {
          "question": "Why is \"last writer wins\" unsafe for account balances?",
          "options": [
            "It is slow",
            "Concurrent withdrawals can both be approved and one update lost",
            "It uses too much storage"
          ],
          "answer": 1,
          "why": "Money needs a single ordered history, not a merge that drops updates."
        }
      },
      {
        "title": "Failing over a whole Region",
        "say": [
          "When a Region fails, several things happen, ideally automatically and certainly rehearsed.",
          "Route 53 health checks stop sending users to the failed Region within a minute or two (Day 17).",
          "Accounts whose home was the failed Region are moved, after the ledger replica is confirmed caught up, to their backup home Region.",
          "The surviving Regions scale out to absorb the extra traffic (Days 7 and 22). Capacity must already be allowed: account limits and Savings Plans (Day 28) should assume a Region can carry more than its normal share.",
          "Queues keep buffering events (Day 18); consumers in the failed Region simply stop, and messages are picked up elsewhere or after recovery.",
          "The example simulates traffic redistribution when one of three Regions fails and checks whether the survivors have enough headroom.",
          "The most common real failure is not the Region itself but a failover that has never been tested. Run game days (Day 29) with the full team."
        ],
        "example": "A relay team where every runner has trained to run an extra leg, in case a teammate twists an ankle on race day.",
        "code": "traffic = {\"ap-south-1\": 5000, \"eu-west-1\": 3000, \"us-east-1\": 2000}   # transactions per second\ncapacity = {\"ap-south-1\": 8000, \"eu-west-1\": 7000, \"us-east-1\": 6000}\nfailed = \"ap-south-1\"\nsurvivors = [r for r in traffic if r != failed]\nmoved = traffic[failed]\ntotal_surviving = sum(traffic[r] for r in survivors)\nfor r in survivors:\n    new_load = traffic[r] + moved * traffic[r] / total_surviving\n    print(f\"{r:10} load {new_load:6.0f} / capacity {capacity[r]}  {'OK' if new_load <= capacity[r] else 'OVERLOADED'}\")",
        "output": "eu-west-1  load   6000 / capacity 7000  OK\nus-east-1  load   4000 / capacity 6000  OK",
        "codeNotes": [
          {
            "line": 8,
            "note": "The failed Region's traffic spreads in proportion to each survivor's share."
          }
        ],
        "tryIt": "Fail eu-west-1 instead. Do the survivors cope?",
        "check": {
          "question": "What is the most common reason Region failovers go badly?",
          "options": [
            "AWS never fails",
            "The failover process was never rehearsed",
            "Too many health checks"
          ],
          "answer": 1,
          "why": "Untested failovers hide surprises; game days find them first."
        }
      },
      {
        "title": "The readiness audit",
        "say": [
          "Before a platform like this goes live, it passes a readiness review, sometimes called an operational readiness review or a Well-Architected review.",
          "The AWS Well-Architected Framework groups the questions into six pillars: operational excellence, security, reliability, performance efficiency, cost optimisation and sustainability. You have now practised every one.",
          "The review turns into checks with clear pass or fail answers: multi-Region failover tested, security baseline in place, backups restored in a drill, cost tags and budgets set, alarms with runbooks.",
          "Practice 2 is readiness_audit(checks). Certified means every check passed, there was at least one, and the FinOps score is at least 80. Grade TIER_2 allows one failed check with a score of at least 60; otherwise NOT_READY.",
          "Separate the numeric score from the True/False checks with a dictionary comprehension, then work on each part.",
          "A readiness audit is not a formality. It is how teams find the forgotten single-AZ database before customers do.",
          "The example runs an audit on a nearly ready platform."
        ],
        "example": "An aircraft certification: the plane does not carry passengers until every system has passed its tests and the paperwork proves it.",
        "code": "checks = {\"multi_region_failover_tested\": True, \"security_baseline\": True, \"backups_restored_in_drill\": False,\n          \"alarms_have_runbooks\": True, \"finops_score\": 84}\nscore = checks[\"finops_score\"]\nflags = {k: v for k, v in checks.items() if k != \"finops_score\"}\nfailed = sorted(k for k, ok in flags.items() if not ok)\ncertified = bool(flags) and not failed and score >= 80\ngrade = \"TIER_1\" if certified else (\"TIER_2\" if len(failed) <= 1 and score >= 60 else \"NOT_READY\")\nprint({\"certified\": certified, \"failed\": failed, \"grade\": grade})",
        "output": "{'certified': False, 'failed': ['backups_restored_in_drill'], 'grade': 'TIER_2'}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Everything except the score is a True/False check."
          },
          {
            "line": 7,
            "note": "One gap with a decent score is TIER_2."
          }
        ],
        "tryIt": "Fix the failed check. What grade does the platform get now?",
        "check": {
          "question": "Which pillar is NOT part of the AWS Well-Architected Framework?",
          "options": [
            "Reliability",
            "Marketing",
            "Cost optimisation"
          ],
          "answer": 1,
          "why": "The six pillars are operational excellence, security, reliability, performance efficiency, cost optimisation and sustainability."
        }
      },
      {
        "title": "Capstone practice and what comes next",
        "say": [
          "Practice 1: route_transaction(regions, txn). Filter by healthy and by allowed_countries, return failure if the list is empty, otherwise the lowest-latency Region's code.",
          "Practice 2: readiness_audit(checks). Take out finops_score, collect failed checks sorted, compute certified, then the grade.",
          "Watch the empty case in Practice 2: a dictionary with only a score has no checks, so it must not be certified. bool(flags) handles that.",
          "After this course you can design, build, secure, monitor, cost and recover real AWS systems. Good next steps are the AWS Certified Solutions Architect Associate exam, building one project end to end with Terraform, and reading the Well-Architected Framework itself.",
          "Most of all, keep building. Pick one of the projects from this course, deploy it on a free-tier account with a budget alarm, and break it on purpose to practise recovery.",
          "Congratulations on finishing the 30 days of Cloud Engineering in Python.",
          "The example prints your course journey as the milestones you passed."
        ],
        "example": "Graduating from flight school: you have the hours and the licence, and now the real flying begins.",
        "code": "milestones = {5: \"Multi-AZ VPC\", 15: \"Serverless video pipeline\", 21: \"Event-driven shop backbone\",\n              30: \"Multi-Region banking platform\"}\nfor day in range(1, 31):\n    if day in milestones:\n        print(f\"Day {day:2}: MILESTONE - {milestones[day]}\")\nprint(\"Days completed:\", 30, \"| next: build, break, recover, repeat\")",
        "output": "Day  5: MILESTONE - Multi-AZ VPC\nDay 15: MILESTONE - Serverless video pipeline\nDay 21: MILESTONE - Event-driven shop backbone\nDay 30: MILESTONE - Multi-Region banking platform\nDays completed: 30 | next: build, break, recover, repeat",
        "codeNotes": [
          {
            "line": 4,
            "note": "Only milestone days are printed."
          }
        ],
        "tryIt": "Add the three topics you most want to practise again, with the day number of each.",
        "check": {
          "question": "What should you do first when you create a new AWS account for practice?",
          "options": [
            "Open SSH to the world",
            "Set a budget alert",
            "Delete the root user"
          ],
          "answer": 1,
          "why": "A budget alert protects you from surprise bills while you learn."
        }
      }
    ],
    "summary": [
      "Active-active multi-Region runs the full stack in every Region behind latency-based DNS with health checks.",
      "Route transactions by residency law first, then health, then latency, and fail safely when nothing qualifies.",
      "Money needs a single ordered history: home Regions per account, idempotent ledgers and careful failover.",
      "Region failover needs headroom in survivors and rehearsed game days.",
      "Readiness audits turn the Well-Architected pillars into clear pass or fail checks."
    ],
    "projectStep": {
      "title": "Capstone: global banking platform",
      "steps": [
        "Draw the multi-Region architecture and list the AWS service for each layer.",
        "Implement route_transaction and simulate a Region failure with residency rules.",
        "Run readiness_audit on your design and write the plan to fix every failed check."
      ]
    }
  }
];
