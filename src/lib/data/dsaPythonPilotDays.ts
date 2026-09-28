/**
 * "DSA in Python" lessons: the same lessons as the DSA course (dsaPilotDays.ts), with every code
 * example rewritten in Python. The expected outputs are what python3 prints for each example
 * (tests/dsa_python_lessons.test.ts runs them all). The lesson text is shared, with JavaScript
 * terms swapped for their Python names.
 */
import { DayLessonPlan } from '../types/lessonEngine';
import { DSA_PILOT_DAYS } from './dsaPilotDays';

interface BlockCode {
  run?: { filename: string; initialCode: string; expectedOutput: string };
  anatomy?: { codeSnippet: string; lineNotes: Record<string, string> };
}

/** Python code for each lesson block, by block id. */
export const DSA_PYTHON_BLOCK_CODE: Record<string, BlockCode> = {
  "dsa-d1-b1-asymptotic-growth": {
    "run": {
      "filename": "complexity_sim.py",
      "initialCode": "def count_steps(n):\n    steps = 0\n    # Linear loop: 3N + 5 steps\n    for i in range(3 * n):\n        steps += 1\n    steps += 5\n    return {'n': n, 'steps': steps, 'dominant_class': 'O(N)'}\n\nprint(count_steps(1000))",
      "expectedOutput": "{'n': 1000, 'steps': 3005, 'dominant_class': 'O(N)'}"
    }
  },
  "dsa-d1-b2-space-complexity": {
    "run": {
      "filename": "space_sim.py",
      "initialCode": "def reverse_in_place(arr):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1\n        right -= 1\n    return {'auxiliary_space': 'O(1)', 'reversed': arr}\n\nprint(reverse_in_place([1, 2, 3, 4]))",
      "expectedOutput": "{'auxiliary_space': 'O(1)', 'reversed': [4, 3, 2, 1]}"
    }
  },
  "dsa-d1-b3-logarithmic-halving": {
    "run": {
      "filename": "log_sim.py",
      "initialCode": "import math\n\ndef binary_search_steps(n):\n    return math.ceil(math.log2(n))\n\nprint('Max steps for 1,000,000 items:', binary_search_steps(1000000))",
      "expectedOutput": "Max steps for 1,000,000 items: 20"
    },
    "anatomy": {
      "codeSnippet": "# Searching 1,000,000 items:\n# Linear Search O(N) = up to 1,000,000 steps\n# Binary Search O(log2 N) = at most 20 steps (2 ** 20 = 1,048,576)!",
      "lineNotes": {
        "2": "Linear scan checks elements one by one.",
        "3": "Binary search halves the remaining search range on each comparison."
      }
    }
  },
  "dsa-d2-b1-geometric-doubling": {
    "run": {
      "filename": "dynamic_array_demo.py",
      "initialCode": "class ResizableArray:\n    def __init__(self):\n        self.capacity = 2\n        self.size = 0\n        self.buffer = [None] * 2\n\n    def push(self, val):\n        if self.size == self.capacity:\n            self.capacity *= 2\n            new_buf = [None] * self.capacity\n            for i in range(self.size):\n                new_buf[i] = self.buffer[i]\n            self.buffer = new_buf\n        self.buffer[self.size] = val\n        self.size += 1\n\narr = ResizableArray()\narr.push(10); arr.push(20); arr.push(30)\nprint(f'Size: {arr.size}, Capacity: {arr.capacity}')",
      "expectedOutput": "Size: 3, Capacity: 4"
    }
  },
  "dsa-d2-b2-contiguous-memory-cache": {
    "run": {
      "filename": "cache_locality.py",
      "initialCode": "def get_address(base_address, index, element_bytes=4):\n    return base_address + index * element_bytes\n\nprint('Address of arr[2]:', hex(get_address(0x100, 2)))",
      "expectedOutput": "Address of arr[2]: 0x108"
    }
  },
  "dsa-d2-b3-in-place-mutation": {
    "run": {
      "filename": "remove_duplicates.py",
      "initialCode": "def remove_duplicates(nums):\n    if not nums:\n        return 0\n    write = 1\n    for read in range(1, len(nums)):\n        if nums[read] != nums[read - 1]:\n            nums[write] = nums[read]\n            write += 1\n    return write\n\narr = [1, 1, 2, 2, 3]\nunique_count = remove_duplicates(arr)\nprint(f'Unique Count: {unique_count}, Modified List: {arr[:unique_count]}')",
      "expectedOutput": "Unique Count: 3, Modified List: [1, 2, 3]"
    }
  },
  "dsa-d3-b1-node-anatomy": {
    "run": {
      "filename": "list_demo.py",
      "initialCode": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nhead = ListNode(10, ListNode(20, ListNode(30)))\nprint(f'Node 1: {head.val}, Node 2: {head.next.val}, Node 3: {head.next.next.val}')",
      "expectedOutput": "Node 1: 10, Node 2: 20, Node 3: 30"
    },
    "anatomy": {
      "codeSnippet": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next",
      "lineNotes": {
        "3": "Stores the data payload in val.",
        "4": "next holds the reference to the next node in memory (None at the end)."
      }
    }
  },
  "dsa-d3-b2-reversing-list": {
    "run": {
      "filename": "reverse_demo.py",
      "initialCode": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse(head):\n    prev, curr = None, head\n    while curr is not None:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev\n\nrev = reverse(ListNode(1, ListNode(2, ListNode(3))))\nprint(f'Reversed Head: {rev.val}, Next: {rev.next.val}')",
      "expectedOutput": "Reversed Head: 3, Next: 2"
    }
  },
  "dsa-d3-b3-floyds-cycle-detection": {
    "run": {
      "filename": "cycle_demo.py",
      "initialCode": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False\n\nn1 = ListNode(1)\nn2 = ListNode(2)\nn1.next = n2\nn2.next = n1  # Cycle!\n\nprint('Cycle Detected:', has_cycle(n1))",
      "expectedOutput": "Cycle Detected: True"
    }
  },
  "dsa-d4-b1-stack-lifo-bracket-matching": {
    "run": {
      "filename": "bracket_sim.py",
      "initialCode": "def is_valid(s):\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for ch in s:\n        if ch in '({[':\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack\n\nprint('Valid {[]}?:', is_valid('{[]}'))\nprint('Valid ([)]?:', is_valid('([)]'))",
      "expectedOutput": "Valid {[]}?: True\nValid ([)]?: False"
    }
  },
  "dsa-d4-b2-monotonic-stack": {
    "run": {
      "filename": "monotonic_demo.py",
      "initialCode": "def next_greater(nums):\n    res = [-1] * len(nums)\n    stack = []\n    for i in range(len(nums)):\n        while stack and nums[i] > nums[stack[-1]]:\n            res[stack.pop()] = nums[i]\n        stack.append(i)\n    return res\n\nprint('Next Greater for [2, 1, 2, 4, 3]:', next_greater([2, 1, 2, 4, 3]))",
      "expectedOutput": "Next Greater for [2, 1, 2, 4, 3]: [4, 2, 4, -1, -1]"
    },
    "anatomy": {
      "codeSnippet": "for i in range(len(nums)):\n    while stack and nums[i] > nums[stack[-1]]:\n        resolved_idx = stack.pop()\n        result[resolved_idx] = nums[i]\n    stack.append(i)",
      "lineNotes": {
        "2": "While the current number is greater than the stack top, it is the next greater element for that index!",
        "5": "Pushes the current index to find its next greater element later."
      }
    }
  },
  "dsa-d4-b3-min-stack": {
    "run": {
      "filename": "min_stack_demo.py",
      "initialCode": "class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n\n    def push(self, val):\n        self.stack.append(val)\n        current_min = val if not self.min_stack else min(val, self.min_stack[-1])\n        self.min_stack.append(current_min)\n\n    def pop(self):\n        self.stack.pop()\n        self.min_stack.pop()\n\n    def top(self):\n        return self.stack[-1]\n\n    def get_min(self):\n        return self.min_stack[-1]\n\nms = MinStack()\nms.push(10); ms.push(5); ms.push(20)\nprint(f'Current Min: {ms.get_min()}')\nms.pop(); ms.pop()\nprint(f'Min after pops: {ms.get_min()}')",
      "expectedOutput": "Current Min: 5\nMin after pops: 10"
    }
  },
  "dsa-d5-b1-lru-architecture": {
    "run": {
      "filename": "lru_sim.py",
      "initialCode": "class DNode:\n    def __init__(self, k=0, v=0):\n        self.k, self.v = k, v\n        self.prev = self.next = None\n\nclass LRU:\n    def __init__(self, cap):\n        self.cap = cap\n        self.map = {}\n        self.head, self.tail = DNode(), DNode()\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def _remove(self, n):\n        n.prev.next = n.next\n        n.next.prev = n.prev\n\n    def _add(self, n):\n        n.next = self.head.next\n        n.prev = self.head\n        self.head.next.prev = n\n        self.head.next = n\n\n    def get(self, k):\n        if k not in self.map:\n            return -1\n        n = self.map[k]\n        self._remove(n); self._add(n)\n        return n.v\n\n    def put(self, k, v):\n        if k in self.map:\n            self._remove(self.map[k])\n        n = DNode(k, v)\n        self._add(n)\n        self.map[k] = n\n        if len(self.map) > self.cap:\n            lru = self.tail.prev\n            self._remove(lru)\n            del self.map[lru.k]\n\ncache = LRU(2)\ncache.put(1, 100); cache.put(2, 200)\nprint('Get 1:', cache.get(1))  # moves 1 to the front\ncache.put(3, 300)  # evicts 2\nprint('Get 2 (evicted):', cache.get(2))\nprint('Get 3:', cache.get(3))",
      "expectedOutput": "Get 1: 100\nGet 2 (evicted): -1\nGet 3: 300"
    }
  },
  "dsa-d5-b2-sentinel-nodes": {
    "run": {
      "filename": "sentinel_sim.py",
      "initialCode": "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.prev = self.next = None\n\nclass SentinelList:\n    def __init__(self):\n        self.head = Node('HEAD_SENTINEL')\n        self.tail = Node('TAIL_SENTINEL')\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\nlst = SentinelList()\nprint(f'Head next: {lst.head.next.val}, Tail prev: {lst.tail.prev.val}')",
      "expectedOutput": "Head next: TAIL_SENTINEL, Tail prev: HEAD_SENTINEL"
    },
    "anatomy": {
      "codeSnippet": "self.head = DNode()  # Dummy head\nself.tail = DNode()  # Dummy tail\nself.head.next = self.tail\nself.tail.prev = self.head",
      "lineNotes": {
        "1": "Guarantees head.next is NEVER null.",
        "2": "Guarantees tail.prev is NEVER null, eliminating all boundary if-checks."
      }
    }
  },
  "dsa-d5-b3-milestone-lru-cert": {
    "run": {
      "filename": "lru_cert.py",
      "initialCode": "print('⭐ MILESTONE 1: LRU Cache Engine [VERIFIED 100%]')",
      "expectedOutput": "⭐ MILESTONE 1: LRU Cache Engine [VERIFIED 100%]"
    }
  },
  "dsa-d6-b1-fifo-queue-mechanics": {
    "run": {
      "filename": "circular_queue_demo.py",
      "initialCode": "class RingBuffer:\n    def __init__(self, k):\n        self.cap = k\n        self.q = [None] * k\n        self.h = self.t = -1\n\n    def en_queue(self, v):\n        if self.is_full():\n            return False\n        if self.is_empty():\n            self.h = 0\n        self.t = (self.t + 1) % self.cap\n        self.q[self.t] = v\n        return True\n\n    def de_queue(self):\n        if self.is_empty():\n            return False\n        if self.h == self.t:\n            self.h = self.t = -1\n        else:\n            self.h = (self.h + 1) % self.cap\n        return True\n\n    def front(self):\n        return -1 if self.is_empty() else self.q[self.h]\n\n    def is_empty(self):\n        return self.h == -1\n\n    def is_full(self):\n        return (self.t + 1) % self.cap == self.h\n\nrb = RingBuffer(2)\nrb.en_queue(10); rb.en_queue(20)\nprint('Is Full:', rb.is_full())\nrb.de_queue()\nrb.en_queue(30)  # Wraps around\nprint('Front after wrap:', rb.front())",
      "expectedOutput": "Is Full: True\nFront after wrap: 20"
    },
    "anatomy": {
      "codeSnippet": "self.tail = (self.tail + 1) % self.capacity\nself.queue[self.tail] = value",
      "lineNotes": {
        "1": "Modulo capacity wraps the index back to 0 when it reaches the end.",
        "2": "Inserts element into ring buffer in strict O(1) time."
      }
    }
  },
  "dsa-d6-b2-deque-double-ended": {
    "run": {
      "filename": "deque_sim.py",
      "initialCode": "from collections import deque\n\ndq = deque()\ndq.append(100)      # push back\ndq.appendleft(50)   # push front\nprint(f'Front: {dq[0]}, Back: {dq[-1]}')",
      "expectedOutput": "Front: 50, Back: 100"
    }
  },
  "dsa-d6-b3-stack-using-queues": {
    "run": {
      "filename": "stack_queue.py",
      "initialCode": "from collections import deque\n\nclass StackViaQueue:\n    def __init__(self):\n        self.q = deque()\n\n    def push(self, x):\n        self.q.append(x)\n        for _ in range(len(self.q) - 1):\n            self.q.append(self.q.popleft())\n\n    def pop(self):\n        return self.q.popleft()\n\n    def top(self):\n        return self.q[0]\n\ns = StackViaQueue()\ns.push(1); s.push(2)\nprint(f'Top: {s.top()}, Pop: {s.pop()}, Next Top: {s.top()}')",
      "expectedOutput": "Top: 2, Pop: 2, Next Top: 1"
    }
  },
  "dsa-d7-b1-hash-function-chaining": {
    "run": {
      "filename": "hash_map_demo.py",
      "initialCode": "class SimpleHashMap:\n    def __init__(self, size=5):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]\n\n    def _hash(self, k):\n        return k % self.size if isinstance(k, int) else len(k) % self.size\n\n    def put(self, k, v):\n        bucket = self.buckets[self._hash(k)]\n        for pair in bucket:\n            if pair[0] == k:\n                pair[1] = v\n                return\n        bucket.append([k, v])\n\n    def get(self, k):\n        for key, val in self.buckets[self._hash(k)]:\n            if key == k:\n                return val\n        return -1\n\nhm = SimpleHashMap(5)\nhm.put(1, 100); hm.put(6, 600)  # 1 % 5 == 1 and 6 % 5 == 1 (collision!)\nprint(f'Key 1: {hm.get(1)}, Key 6 (Collided): {hm.get(6)}')",
      "expectedOutput": "Key 1: 100, Key 6 (Collided): 600"
    }
  },
  "dsa-d7-b2-load-factor-rehashing": {
    "run": {
      "filename": "load_factor_sim.py",
      "initialCode": "def check_rehash_needed(items, buckets, threshold=0.75):\n    alpha = items / buckets\n    return {'alpha': alpha, 'needs_rehash': alpha > threshold}\n\nprint('8 items in 10 buckets:', check_rehash_needed(8, 10))\nprint('5 items in 10 buckets:', check_rehash_needed(5, 10))",
      "expectedOutput": "8 items in 10 buckets: {'alpha': 0.8, 'needs_rehash': True}\n5 items in 10 buckets: {'alpha': 0.5, 'needs_rehash': False}"
    },
    "anatomy": {
      "codeSnippet": "load_factor = self.item_count / self.bucket_count\nif load_factor > 0.75:\n    self.rehash(self.bucket_count * 2)",
      "lineNotes": {
        "1": "alpha = N / M measures the average bucket chain length.",
        "3": "Allocates a bucket list twice as large to keep O(1) average lookups."
      }
    }
  },
  "dsa-d7-b3-two-sum-hash-pattern": {
    "run": {
      "filename": "two_sum_demo.py",
      "initialCode": "def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        complement = target - x\n        if complement in seen:\n            return [seen[complement], i]\n        seen[x] = i\n    return []\n\nprint('Two Sum [2, 7, 11, 15] for Target 9:', two_sum([2, 7, 11, 15], 9))",
      "expectedOutput": "Two Sum [2, 7, 11, 15] for Target 9: [0, 1]"
    }
  },
  "dsa-d8-b1-opposite-convergence": {
    "run": {
      "filename": "two_pointers_sorted.py",
      "initialCode": "def two_sum_sorted(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        total = numbers[left] + numbers[right]\n        if total == target:\n            return [left + 1, right + 1]  # 1-indexed\n        if total < target:\n            left += 1\n        else:\n            right -= 1\n    return []\n\nprint('1-indexed Two Sum in [2, 7, 11, 15] for 9:', two_sum_sorted([2, 7, 11, 15], 9))",
      "expectedOutput": "1-indexed Two Sum in [2, 7, 11, 15] for 9: [1, 2]"
    }
  },
  "dsa-d8-b2-container-with-most-water": {
    "run": {
      "filename": "max_water_demo.py",
      "initialCode": "def max_area(height):\n    left, right, best = 0, len(height) - 1, 0\n    while left < right:\n        w = right - left\n        h = min(height[left], height[right])\n        best = max(best, w * h)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return best\n\nprint('Max Water for [1,8,6,2,5,4,8,3,7]:', max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))",
      "expectedOutput": "Max Water for [1,8,6,2,5,4,8,3,7]: 49"
    },
    "anatomy": {
      "codeSnippet": "if height[left] < height[right]:\n    left += 1  # The shorter bar cannot hold more water with any other inner bar!\nelse:\n    right -= 1",
      "lineNotes": {
        "1": "Water capacity is limited by the shorter vertical line.",
        "2": "Moving the taller bar would only reduce width without any chance of increasing height limit."
      }
    }
  },
  "dsa-d8-b3-palindrome-pointer-filtering": {
    "run": {
      "filename": "palindrome_demo.py",
      "initialCode": "def is_palindrome(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum():\n            l += 1\n        while l < r and not s[r].isalnum():\n            r -= 1\n        if s[l].lower() != s[r].lower():\n            return False\n        l += 1\n        r -= 1\n    return True\n\nprint('Is \"A man, a plan, a canal: Panama\" a palindrome?:', is_palindrome('A man, a plan, a canal: Panama'))",
      "expectedOutput": "Is \"A man, a plan, a canal: Panama\" a palindrome?: True"
    }
  },
  "dsa-d9-b1-fixed-window-sums": {
    "run": {
      "filename": "fixed_window_demo.py",
      "initialCode": "def max_sub_array_sum(nums, k):\n    window_sum = sum(nums[:k])\n    max_sum = window_sum\n    for i in range(k, len(nums)):\n        window_sum += nums[i] - nums[i - k]  # O(1) update!\n        max_sum = max(max_sum, window_sum)\n    return max_sum\n\nprint('Max Sum of 3 in [2, 1, 5, 1, 3, 2]:', max_sub_array_sum([2, 1, 5, 1, 3, 2], 3))",
      "expectedOutput": "Max Sum of 3 in [2, 1, 5, 1, 3, 2]: 9"
    }
  },
  "dsa-d9-b2-dynamic-expanding-contracting": {
    "run": {
      "filename": "longest_substr_demo.py",
      "initialCode": "def length_of_longest_substring(s):\n    last_seen = {}\n    max_len = left = 0\n    for right, ch in enumerate(s):\n        if ch in last_seen and last_seen[ch] >= left:\n            left = last_seen[ch] + 1\n        last_seen[ch] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nprint('Longest unique substring in \"abcabcbb\":', length_of_longest_substring('abcabcbb'))",
      "expectedOutput": "Longest unique substring in \"abcabcbb\": 3"
    },
    "anatomy": {
      "codeSnippet": "if ch in last_seen and last_seen[ch] >= left:\n    left = last_seen[ch] + 1  # Jump left past the previous duplicate!\n\nlast_seen[ch] = right",
      "lineNotes": {
        "2": "Instantly shrinks window by placing left pointer right after duplicate.",
        "4": "Records newest position for current character."
      }
    }
  },
  "dsa-d9-b3-min-window-substring": {
    "run": {
      "filename": "min_sub_len.py",
      "initialCode": "def min_sub_array_len(target, nums):\n    left = total = 0\n    min_len = float('inf')\n    for right in range(len(nums)):\n        total += nums[right]\n        while total >= target:\n            min_len = min(min_len, right - left + 1)\n            total -= nums[left]\n            left += 1\n    return 0 if min_len == float('inf') else min_len\n\nprint('Min length for target 7 in [2,3,1,2,4,3]:', min_sub_array_len(7, [2, 3, 1, 2, 4, 3]))",
      "expectedOutput": "Min length for target 7 in [2,3,1,2,4,3]: 2"
    }
  },
  "dsa-d10-b1-midpoint-overflow-invariant": {
    "run": {
      "filename": "binary_search_demo.py",
      "initialCode": "def binary_search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target:\n            return m\n        if nums[m] < target:\n            l = m + 1\n        else:\n            r = m - 1\n    return -1\n\nprint('Search 9 in [-1, 0, 3, 5, 9, 12]:', binary_search([-1, 0, 3, 5, 9, 12], 9))",
      "expectedOutput": "Search 9 in [-1, 0, 3, 5, 9, 12]: 4"
    },
    "anatomy": {
      "codeSnippet": "left, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = left + (right - left) // 2\n    if nums[mid] == target: return mid\n    if nums[mid] < target: left = mid + 1\n    else: right = mid - 1\nreturn -1",
      "lineNotes": {
        "2": "Loop must continue while left <= right to check single-element bounds.",
        "5": "Discards mid and the entire left half by setting left = mid + 1."
      }
    }
  },
  "dsa-d10-b2-search-rotated-array": {
    "run": {
      "filename": "search_rotated.py",
      "initialCode": "def search_rotated(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target:\n            return m\n        if nums[l] <= nums[m]:\n            if nums[l] <= target < nums[m]:\n                r = m - 1\n            else:\n                l = m + 1\n        else:\n            if nums[m] < target <= nums[r]:\n                l = m + 1\n            else:\n                r = m - 1\n    return -1\n\nprint('Search 0 in [4,5,6,7,0,1,2]:', search_rotated([4, 5, 6, 7, 0, 1, 2], 0))",
      "expectedOutput": "Search 0 in [4,5,6,7,0,1,2]: 4"
    }
  },
  "dsa-d10-b3-binary-search-on-answer": {
    "run": {
      "filename": "koko_bananas.py",
      "initialCode": "import math\n\ndef min_eating_speed(piles, h):\n    def can_finish(speed):\n        return sum(math.ceil(p / speed) for p in piles) <= h\n\n    l, r = 1, max(piles)\n    ans = r\n    while l <= r:\n        m = (l + r) // 2\n        if can_finish(m):\n            ans = m\n            r = m - 1  # Try a smaller speed\n        else:\n            l = m + 1\n    return ans\n\nprint('Min speed for piles [3,6,7,11] in 8 hours:', min_eating_speed([3, 6, 7, 11], 8))",
      "expectedOutput": "Min speed for piles [3,6,7,11] in 8 hours: 4"
    }
  },
  "dsa-d11-b1-call-stack-frames": {
    "run": {
      "filename": "factorial_demo.py",
      "initialCode": "def factorial(n):\n    if n <= 1:\n        return 1  # Base case!\n    return n * factorial(n - 1)  # Recursive step\n\nprint('Factorial of 4 (4*3*2*1):', factorial(4))",
      "expectedOutput": "Factorial of 4 (4*3*2*1): 24"
    }
  },
  "dsa-d11-b2-power-set-subsets": {
    "run": {
      "filename": "subsets_demo.py",
      "initialCode": "def subsets(nums):\n    res = []\n\n    def backtrack(idx, current):\n        res.append(current[:])  # Snapshot of the current subset\n        for i in range(idx, len(nums)):\n            current.append(nums[i])\n            backtrack(i + 1, current)\n            current.pop()  # Backtrack!\n\n    backtrack(0, [])\n    return res\n\nprint('Subsets of [1, 2]:', subsets([1, 2]))",
      "expectedOutput": "Subsets of [1, 2]: [[], [1], [1, 2], [2]]"
    },
    "anatomy": {
      "codeSnippet": "current.append(nums[i])   # 1. Choose\nbacktrack(i + 1, current)  # 2. Explore\ncurrent.pop()              # 3. Un-choose (backtrack)",
      "lineNotes": {
        "1": "Adds element to current branch state.",
        "2": "Recurses to explore all deeper paths containing this element.",
        "3": "Pops element off array, restoring clean state for subsequent sibling branches."
      }
    }
  },
  "dsa-d11-b3-permutations-tracking": {
    "run": {
      "filename": "permutations_demo.py",
      "initialCode": "def permute(nums):\n    res = []\n    used = [False] * len(nums)\n\n    def backtrack(curr):\n        if len(curr) == len(nums):\n            res.append(curr[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            used[i] = True\n            curr.append(nums[i])\n            backtrack(curr)\n            curr.pop()\n            used[i] = False\n\n    backtrack([])\n    return res\n\nprint('Total Permutations of 3 elements:', len(permute([1, 2, 3])))",
      "expectedOutput": "Total Permutations of 3 elements: 6"
    }
  },
  "dsa-d12-b1-divide-and-conquer-halving": {
    "run": {
      "filename": "merge_sort_demo.py",
      "initialCode": "def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:]))\n\ndef merge(left, right):\n    res = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            res.append(left[i]); i += 1\n        else:\n            res.append(right[j]); j += 1\n    return res + left[i:] + right[j:]\n\nprint('Sorted [38, 27, 43, 3, 9, 82]:', merge_sort([38, 27, 43, 3, 9, 82]))",
      "expectedOutput": "Sorted [38, 27, 43, 3, 9, 82]: [3, 9, 27, 38, 43, 82]"
    }
  },
  "dsa-d12-b2-merge-sorted-linked-lists": {
    "run": {
      "filename": "merge_lists_demo.py",
      "initialCode": "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef merge_two_lists(l1, l2):\n    dummy = ListNode()\n    curr = dummy\n    while l1 and l2:\n        if l1.val <= l2.val:\n            curr.next, l1 = l1, l1.next\n        else:\n            curr.next, l2 = l2, l2.next\n        curr = curr.next\n    curr.next = l1 or l2\n    return dummy.next\n\nm = merge_two_lists(ListNode(1, ListNode(3)), ListNode(2, ListNode(4)))\nprint(f'Merged: {m.val} -> {m.next.val} -> {m.next.next.val} -> {m.next.next.next.val}')",
      "expectedOutput": "Merged: 1 -> 2 -> 3 -> 4"
    }
  },
  "dsa-d12-b3-master-theorem": {
    "run": {
      "filename": "master_theorem_sim.py",
      "initialCode": "def resolve_recurrence(kind):\n    table = {\n        'BINARY_SEARCH': 'O(log N)',\n        'MERGE_SORT': 'O(N log N)',\n        'TREE_TRAVERSAL': 'O(N)',\n    }\n    return table[kind]\n\nprint('Merge Sort Big-O:', resolve_recurrence('MERGE_SORT'))",
      "expectedOutput": "Merge Sort Big-O: O(N log N)"
    },
    "anatomy": {
      "codeSnippet": "# 1. Binary Search: 1 subproblem of size N/2, O(1) work -> O(log N)\n# 2. Merge Sort: 2 subproblems of size N/2, O(N) work -> O(N log N)\n# 3. Tree Traversal: 2 subproblems of size N/2, O(1) work -> O(N)",
      "lineNotes": {
        "1": "Halving once per step = logarithmic.",
        "2": "Halving twice and scanning all elements per level = linearithmic."
      }
    }
  },
  "dsa-d13-b1-lomuto-partitioning": {
    "run": {
      "filename": "partition_demo.py",
      "initialCode": "def partition(arr, left, right):\n    pivot = arr[right]\n    p = left\n    for i in range(left, right):\n        if arr[i] <= pivot:\n            arr[i], arr[p] = arr[p], arr[i]\n            p += 1\n    arr[p], arr[right] = arr[right], arr[p]\n    return p\n\narr = [5, 2, 9, 1, 3]\npivot_idx = partition(arr, 0, len(arr) - 1)\nprint(f'Pivot placed at index {pivot_idx}, List: {arr}')",
      "expectedOutput": "Pivot placed at index 2, List: [2, 1, 3, 5, 9]"
    },
    "anatomy": {
      "codeSnippet": "pivot = arr[right]\np_idx = left\nfor i in range(left, right):\n    if arr[i] <= pivot:\n        arr[i], arr[p_idx] = arr[p_idx], arr[i]\n        p_idx += 1\n\narr[p_idx], arr[right] = arr[right], arr[p_idx]\nreturn p_idx",
      "lineNotes": {
        "1": "Chooses the rightmost element as the pivot.",
        "5": "Swaps elements smaller than the pivot to the front.",
        "8": "Places the pivot in its exact final sorted position."
      }
    }
  },
  "dsa-d13-b2-quick-select-kth": {
    "run": {
      "filename": "quick_select_demo.py",
      "initialCode": "def find_kth_largest(nums, k):\n    target = len(nums) - k\n\n    def select(l, r):\n        pivot = nums[r]\n        p = l\n        for i in range(l, r):\n            if nums[i] <= pivot:\n                nums[i], nums[p] = nums[p], nums[i]\n                p += 1\n        nums[p], nums[r] = nums[r], nums[p]\n        if p == target:\n            return nums[p]\n        return select(p + 1, r) if p < target else select(l, p - 1)\n\n    return select(0, len(nums) - 1)\n\nprint('2nd Largest in [3, 2, 1, 5, 6, 4]:', find_kth_largest([3, 2, 1, 5, 6, 4], 2))",
      "expectedOutput": "2nd Largest in [3, 2, 1, 5, 6, 4]: 5"
    }
  },
  "dsa-d13-b3-worst-case-avoidance": {
    "run": {
      "filename": "random_pivot_sim.py",
      "initialCode": "import random\n\ndef get_random_pivot(l, r):\n    return random.randint(l, r)  # both ends included\n\nprint('Random pivot index generated safely in range [0, 5]:', 0 <= get_random_pivot(0, 5) <= 5)",
      "expectedOutput": "Random pivot index generated safely in range [0, 5]: True"
    }
  },
  "dsa-d14-b1-dutch-national-flag": {
    "run": {
      "filename": "sort_colors_demo.py",
      "initialCode": "def sort_colors(nums):\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1\n            mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1\n    return nums\n\nprint('Sorted Colors [2, 0, 2, 1, 1, 0]:', sort_colors([2, 0, 2, 1, 1, 0]))",
      "expectedOutput": "Sorted Colors [2, 0, 2, 1, 1, 0]: [0, 0, 1, 1, 2, 2]"
    },
    "anatomy": {
      "codeSnippet": "while mid <= high:\n    if nums[mid] == 0: nums[low], nums[mid] = nums[mid], nums[low]; low += 1; mid += 1\n    elif nums[mid] == 1: mid += 1\n    else: nums[mid], nums[high] = nums[high], nums[mid]; high -= 1",
      "lineNotes": {
        "2": "Pushes 0s behind the low boundary.",
        "3": "Leaves 1s in the middle.",
        "4": "Pushes 2s behind the high boundary."
      }
    }
  },
  "dsa-d14-b2-counting-sort-frequency": {
    "run": {
      "filename": "counting_sort_demo.py",
      "initialCode": "def counting_sort(arr, max_val):\n    count = [0] * (max_val + 1)\n    for n in arr:\n        count[n] += 1\n    res = []\n    for value in range(max_val + 1):\n        res.extend([value] * count[value])\n    return res\n\nprint('Counting Sort [4, 2, 2, 8, 3]:', counting_sort([4, 2, 2, 8, 3], 8))",
      "expectedOutput": "Counting Sort [4, 2, 2, 8, 3]: [2, 2, 3, 4, 8]"
    }
  },
  "dsa-d14-b3-radix-sort-digits": {
    "run": {
      "filename": "radix_sim.py",
      "initialCode": "def get_digit(num, place):\n    return abs(num) // 10 ** place % 10\n\nprint('Hundreds digit of 742:', get_digit(742, 2))",
      "expectedOutput": "Hundreds digit of 742: 7"
    }
  },
  "dsa-d15-b1-dual-heap-architecture": {
    "run": {
      "filename": "median_finder_demo.py",
      "initialCode": "import bisect\n\nclass StreamMedianFinder:\n    def __init__(self):\n        self.arr = []\n\n    def add_num(self, num):\n        bisect.insort(self.arr, num)  # binary search + insert\n\n    def find_median(self):\n        n = len(self.arr)\n        m = n // 2\n        return self.arr[m] if n % 2 == 1 else (self.arr[m - 1] + self.arr[m]) / 2\n\nmf = StreamMedianFinder()\nmf.add_num(1); mf.add_num(2)\nprint('Median of [1, 2]:', mf.find_median())\nmf.add_num(3)\nprint('Median of [1, 2, 3]:', mf.find_median())",
      "expectedOutput": "Median of [1, 2]: 1.5\nMedian of [1, 2, 3]: 2"
    }
  },
  "dsa-d15-b2-streaming-telemetry-benchmarking": {
    "run": {
      "filename": "stream_telemetry.py",
      "initialCode": "import bisect\n\ndef process_telemetry_batch(stream):\n    results, arr = [], []\n    for val in stream:\n        bisect.insort(arr, val)\n        n, mid = len(arr), len(arr) // 2\n        results.append(arr[mid] if n % 2 == 1 else (arr[mid - 1] + arr[mid]) / 2)\n    return results\n\nprint('Running medians for [5, 15, 1, 3]:', process_telemetry_batch([5, 15, 1, 3]))",
      "expectedOutput": "Running medians for [5, 15, 1, 3]: [5, 10.0, 5, 4.0]"
    }
  },
  "dsa-d15-b3-milestone-stream-median-cert": {
    "run": {
      "filename": "median_cert.py",
      "initialCode": "print('⭐ MILESTONE 2: High-Throughput Stream Median Engine [VERIFIED 100%]')",
      "expectedOutput": "⭐ MILESTONE 2: High-Throughput Stream Median Engine [VERIFIED 100%]"
    }
  },
  "dsa-d16-b1-tree-node-anatomy": {
    "run": {
      "filename": "tree_traversal_demo.py",
      "initialCode": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nroot = TreeNode(1, None, TreeNode(2, TreeNode(3), None))\n\ndef inorder(node, acc=None):\n    if acc is None:\n        acc = []\n    if node:\n        inorder(node.left, acc)\n        acc.append(node.val)\n        inorder(node.right, acc)\n    return acc\n\nprint('Inorder Traversal:', inorder(root))",
      "expectedOutput": "Inorder Traversal: [1, 3, 2]"
    }
  },
  "dsa-d16-b2-level-order-bfs": {
    "run": {
      "filename": "bfs_tree_demo.py",
      "initialCode": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nfrom collections import deque\n\ndef level_order(root):\n    if not root:\n        return []\n    res, q = [], deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            n = q.popleft()\n            level.append(n.val)\n            if n.left: q.append(n.left)\n            if n.right: q.append(n.right)\n        res.append(level)\n    return res\n\ntree = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))\nprint('Levels:', level_order(tree))",
      "expectedOutput": "Levels: [[3], [9, 20], [15, 7]]"
    },
    "anatomy": {
      "codeSnippet": "queue = deque([root])\nwhile queue:\n    level_size = len(queue)\n    current_level = []\n    for _ in range(level_size):\n        node = queue.popleft()\n        current_level.append(node.val)\n        if node.left: queue.append(node.left)\n        if node.right: queue.append(node.right)\n    result.append(current_level)",
      "lineNotes": {
        "3": "Captures the exact number of nodes on the current level before adding children.",
        "8": "Pushes children to the back of the queue for the NEXT level."
      }
    }
  },
  "dsa-d16-b3-max-depth-tree": {
    "run": {
      "filename": "tree_depth.py",
      "initialCode": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef max_depth(root):\n    if not root:\n        return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))\n\nsample = TreeNode(1, None, TreeNode(2, TreeNode(3), None))\nprint('Max Depth:', max_depth(sample))",
      "expectedOutput": "Max Depth: 3"
    }
  },
  "dsa-d17-b1-bst-invariants-min-max": {
    "run": {
      "filename": "bst_validation_demo.py",
      "initialCode": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef is_valid_bst(node, low=float('-inf'), high=float('inf')):\n    if not node:\n        return True\n    if node.val <= low or node.val >= high:\n        return False\n    return is_valid_bst(node.left, low, node.val) and is_valid_bst(node.right, node.val, high)\n\nvalid = TreeNode(2, TreeNode(1), TreeNode(3))\ninvalid = TreeNode(5, TreeNode(1), TreeNode(4, TreeNode(3), TreeNode(6)))\nprint('Tree 1 Valid?:', is_valid_bst(valid))\nprint('Tree 2 Valid?:', is_valid_bst(invalid))",
      "expectedOutput": "Tree 1 Valid?: True\nTree 2 Valid?: False"
    }
  },
  "dsa-d17-b2-inorder-sorted-property": {
    "run": {
      "filename": "kth_smallest_bst.py",
      "initialCode": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef kth_smallest(root, k):\n    count = 0\n    stack, node = [], root\n    while stack or node:\n        while node:           # go as far left as possible\n            stack.append(node)\n            node = node.left\n        node = stack.pop()\n        count += 1\n        if count == k:\n            return node.val\n        node = node.right\n    return None\n\nbst = TreeNode(3, TreeNode(1, None, TreeNode(2)), TreeNode(4))\nprint('1st Smallest:', kth_smallest(bst, 1))\nprint('2nd Smallest:', kth_smallest(bst, 2))",
      "expectedOutput": "1st Smallest: 1\n2nd Smallest: 2"
    }
  },
  "dsa-d17-b3-lca-bst": {
    "run": {
      "filename": "lca_demo.py",
      "initialCode": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef lowest_common_ancestor(root, p, q):\n    curr = root\n    while curr:\n        if p < curr.val and q < curr.val:\n            curr = curr.left\n        elif p > curr.val and q > curr.val:\n            curr = curr.right\n        else:\n            return curr.val\n    return None\n\nroot = TreeNode(6, TreeNode(2), TreeNode(8))\nprint('LCA of 2 and 8 in BST:', lowest_common_ancestor(root, 2, 8))",
      "expectedOutput": "LCA of 2 and 8 in BST: 6"
    }
  },
  "dsa-d18-b1-heap-array-layout": {
    "run": {
      "filename": "heap_indices.py",
      "initialCode": "def get_children(i):\n    return {'left': 2 * i + 1, 'right': 2 * i + 2, 'parent': (i - 1) // 2}\n\nprint('Indices for Node 1:', get_children(1))",
      "expectedOutput": "Indices for Node 1: {'left': 3, 'right': 4, 'parent': 0}"
    }
  },
  "dsa-d18-b2-sift-up-down": {
    "run": {
      "filename": "min_heap_demo.py",
      "initialCode": "class SimpleMinHeap:\n    def __init__(self):\n        self.h = []\n\n    def push(self, v):\n        self.h.append(v)\n        i = len(self.h) - 1\n        while i > 0:\n            p = (i - 1) // 2\n            if self.h[i] < self.h[p]:\n                self.h[i], self.h[p] = self.h[p], self.h[i]\n                i = p\n            else:\n                break\n\n    def pop(self):\n        if not self.h:\n            return None\n        if len(self.h) == 1:\n            return self.h.pop()\n        smallest = self.h[0]\n        self.h[0] = self.h.pop()\n        i = 0\n        while True:\n            s, l, r = i, 2 * i + 1, 2 * i + 2\n            if l < len(self.h) and self.h[l] < self.h[s]: s = l\n            if r < len(self.h) and self.h[r] < self.h[s]: s = r\n            if s == i:\n                break\n            self.h[i], self.h[s] = self.h[s], self.h[i]\n            i = s\n        return smallest\n\nh = SimpleMinHeap()\nfor v in (10, 4, 15, 1):\n    h.push(v)\nprint(f'Min 1: {h.pop()}, Min 2: {h.pop()}')",
      "expectedOutput": "Min 1: 1, Min 2: 4"
    },
    "anatomy": {
      "codeSnippet": "def push(self, val):\n    self.heap.append(val)\n    self._sift_up(len(self.heap) - 1)  # Bubble up to the right level\n\ndef pop(self):\n    smallest = self.heap[0]\n    self.heap[0] = self.heap.pop()  # Move the last element to the root\n    self._sift_down(0)                  # Sink it down to the right level\n    return smallest",
      "lineNotes": {
        "2": "Appends to the end of the list in O(1).",
        "3": "Sifts up at most log N levels.",
        "8": "Sinks down comparing against children in at most log N levels."
      }
    }
  },
  "dsa-d18-b3-priority-queue-applications": {
    "run": {
      "filename": "top_k_demo.py",
      "initialCode": "import heapq\n\ndef find_kth_largest(nums, k):\n    return heapq.nlargest(k, nums)[-1]  # a heap of size k, O(N log k)\n\nprint('3rd Largest in [7, 10, 4, 3, 20, 15]:', find_kth_largest([7, 10, 4, 3, 20, 15], 3))",
      "expectedOutput": "3rd Largest in [7, 10, 4, 3, 20, 15]: 10"
    }
  },
  "dsa-d19-b1-trie-node-structure": {
    "run": {
      "filename": "trie_demo.py",
      "initialCode": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n\n    def search(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end\n\n    def starts_with(self, prefix):\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True\n\ntrie = Trie()\ntrie.insert('apple')\nprint('Search apple:', trie.search('apple'))\nprint('Search app (prefix only):', trie.search('app'))\nprint('Starts with app:', trie.starts_with('app'))",
      "expectedOutput": "Search apple: True\nSearch app (prefix only): False\nStarts with app: True"
    }
  },
  "dsa-d19-b2-prefix-dfs-collection": {
    "run": {
      "filename": "prefix_collect.py",
      "initialCode": "# From the first part of today's lesson:\nclass TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n\ndef get_words_with_prefix(trie, prefix):\n    node = trie.root\n    for ch in prefix:\n        if ch not in node.children:\n            return []\n        node = node.children[ch]\n    results = []\n\n    def dfs(curr, text):\n        if curr.is_end:\n            results.append(text)\n        for ch, child in curr.children.items():\n            dfs(child, text + ch)\n\n    dfs(node, prefix)\n    return results\n\nt = Trie()\nfor w in ('car', 'card', 'care', 'dog'):\n    t.insert(w)\nprint('Prefix \"car\" matches:', get_words_with_prefix(t, 'car'))",
      "expectedOutput": "Prefix \"car\" matches: ['car', 'card', 'care']"
    }
  },
  "dsa-d19-b3-space-complexity-trie": {
    "run": {
      "filename": "radix_tree_sim.py",
      "initialCode": "def count_shared_nodes(w1, w2):\n    shared = 0\n    for a, b in zip(w1, w2):\n        if a != b:\n            break\n        shared += 1\n    return shared\n\nprint('Shared prefix length for \"connect\" and \"connection\":', count_shared_nodes('connect', 'connection'))",
      "expectedOutput": "Shared prefix length for \"connect\" and \"connection\": 7"
    }
  },
  "dsa-d20-b1-graph-representations": {
    "run": {
      "filename": "graph_rep_demo.py",
      "initialCode": "adj_list = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C'],\n}\n\nprint('Neighbours of A:', adj_list['A'])",
      "expectedOutput": "Neighbours of A: ['B', 'C']"
    }
  },
  "dsa-d20-b2-graph-bfs-shortest-path": {
    "run": {
      "filename": "bfs_graph_demo.py",
      "initialCode": "from collections import deque\n\ndef shortest_path_bfs(graph, start, target):\n    queue = deque([(start, 0)])\n    visited = {start}\n    while queue:\n        node, dist = queue.popleft()\n        if node == target:\n            return dist\n        for neighbour in graph.get(node, []):\n            if neighbour not in visited:\n                visited.add(neighbour)\n                queue.append((neighbour, dist + 1))\n    return -1\n\ng = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': ['E'], 'E': []}\nprint('Shortest path A -> E:', shortest_path_bfs(g, 'A', 'E'))",
      "expectedOutput": "Shortest path A -> E: 3"
    },
    "anatomy": {
      "codeSnippet": "queue = deque([(start, 0)])\nvisited = {start}\nwhile queue:\n    node, dist = queue.popleft()\n    if node == target: return dist\n    for neighbour in graph[node]:\n        if neighbour not in visited:\n            visited.add(neighbour)\n            queue.append((neighbour, dist + 1))",
      "lineNotes": {
        "2": "The visited set stops a node being processed twice in a cycle.",
        "8": "Marks a neighbour as visited when it is queued, so it is never queued twice."
      }
    }
  },
  "dsa-d20-b3-connected-components": {
    "run": {
      "filename": "components_demo.py",
      "initialCode": "from collections import deque\n\ndef count_components(n, edges):\n    adj = [[] for _ in range(n)]\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    visited = set()\n    islands = 0\n    for i in range(n):\n        if i not in visited:\n            islands += 1\n            q = deque([i])\n            visited.add(i)\n            while q:\n                u = q.popleft()\n                for v in adj[u]:\n                    if v not in visited:\n                        visited.add(v)\n                        q.append(v)\n    return islands\n\nprint('Component Count for 5 nodes with edges [[0,1], [1,2], [3,4]]:', count_components(5, [[0, 1], [1, 2], [3, 4]]))",
      "expectedOutput": "Component Count for 5 nodes with edges [[0,1], [1,2], [3,4]]: 2"
    }
  },
  "dsa-d21-b1-autocomplete-architecture": {
    "run": {
      "filename": "autocomplete_demo.py",
      "initialCode": "class SearchAutocomplete:\n    def __init__(self):\n        self.entries = []\n\n    def insert(self, word, freq):\n        self.entries.append((word, freq))\n\n    def suggest(self, prefix, k=2):\n        matches = [e for e in self.entries if e[0].startswith(prefix)]\n        matches.sort(key=lambda e: (-e[1], e[0]))\n        return [word for word, _ in matches[:k]]\n\nac = SearchAutocomplete()\nac.insert('react', 100); ac.insert('redux', 50); ac.insert('reach', 80)\nprint('Top 2 suggestions for \"rea\":', ac.suggest('rea', 2))",
      "expectedOutput": "Top 2 suggestions for \"rea\": ['react', 'reach']"
    }
  },
  "dsa-d21-b2-tiebreaking-invariants": {
    "run": {
      "filename": "tiebreak_demo.py",
      "initialCode": "candidates = [\n    {'word': 'bear', 'freq': 50},\n    {'word': 'apple', 'freq': 50},\n]\n\n# Equal frequency -> alphabetical tiebreak\ncandidates.sort(key=lambda c: (-c['freq'], c['word']))\nprint('Tiebreak order:', ', '.join(c['word'] for c in candidates))",
      "expectedOutput": "Tiebreak order: apple, bear"
    }
  },
  "dsa-d21-b3-milestone-autocomplete-cert": {
    "run": {
      "filename": "ac_cert.py",
      "initialCode": "print('⭐ MILESTONE 3: Fast Auto-Complete Engine [VERIFIED 100%]')",
      "expectedOutput": "⭐ MILESTONE 3: Fast Auto-Complete Engine [VERIFIED 100%]"
    }
  },
  "dsa-d22-b1-dijkstra-priority-queue": {
    "run": {
      "filename": "dijkstra_demo.py",
      "initialCode": "import heapq\n\ndef dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    while pq:\n        d, curr = heapq.heappop(pq)\n        if d > dist[curr]:\n            continue\n        for neighbour, weight in graph.get(curr, []):\n            if d + weight < dist[neighbour]:\n                dist[neighbour] = d + weight\n                heapq.heappush(pq, (dist[neighbour], neighbour))\n    return dist\n\ng = {'A': [('B', 4), ('C', 2)], 'B': [('D', 10)], 'C': [('B', 1), ('D', 5)], 'D': []}\nprint('Shortest distances from A:', dijkstra(g, 'A'))",
      "expectedOutput": "Shortest distances from A: {'A': 0, 'B': 3, 'C': 2, 'D': 7}"
    }
  },
  "dsa-d22-b2-negative-weight-limitation": {
    "run": {
      "filename": "algo_selection.py",
      "initialCode": "def select_shortest_path_algorithm(has_negative_weights):\n    return 'Bellman-Ford' if has_negative_weights else 'Dijkstra'\n\nprint('Algorithm for a road map (positive distances):', select_shortest_path_algorithm(False))\nprint('Algorithm for currency arbitrage (negative log rates):', select_shortest_path_algorithm(True))",
      "expectedOutput": "Algorithm for a road map (positive distances): Dijkstra\nAlgorithm for currency arbitrage (negative log rates): Bellman-Ford"
    },
    "anatomy": {
      "codeSnippet": "# 1. Non-negative weights: Dijkstra's Algorithm O((V + E) log V) -> FAST\n# 2. Negative weights: Bellman-Ford Algorithm O(V * E) -> SLOWER BUT HANDLES NEGATIVE EDGES",
      "lineNotes": {
        "1": "Dijkstra assumes distances only increase along paths.",
        "2": "Bellman-Ford re-relaxes all edges V-1 times to catch negative costs."
      }
    }
  },
  "dsa-d22-b3-network-delay-time": {
    "run": {
      "filename": "network_delay.py",
      "initialCode": "# From the first part of today's lesson:\nimport heapq\n\ndef dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    while pq:\n        d, curr = heapq.heappop(pq)\n        if d > dist[curr]:\n            continue\n        for neighbour, weight in graph.get(curr, []):\n            if d + weight < dist[neighbour]:\n                dist[neighbour] = d + weight\n                heapq.heappush(pq, (dist[neighbour], neighbour))\n    return dist\n\ndef network_delay_time(times, n, k):\n    g = {i: [] for i in range(1, n + 1)}\n    for u, v, w in times:\n        g[u].append((v, w))\n    dist = dijkstra(g, k)\n    if float('inf') in dist.values():\n        return -1\n    return max(dist.values())\n\nprint('Network Delay Time for [[2,1,1],[2,3,1],[3,4,1]] from source 2:', network_delay_time([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2))",
      "expectedOutput": "Network Delay Time for [[2,1,1],[2,3,1],[3,4,1]] from source 2: 2"
    }
  },
  "dsa-d23-b1-dag-indegree-kahn": {
    "run": {
      "filename": "topological_sort_demo.py",
      "initialCode": "from collections import deque\n\ndef find_order(num_courses, prerequisites):\n    in_degree = [0] * num_courses\n    adj = [[] for _ in range(num_courses)]\n    for course, pre in prerequisites:\n        adj[pre].append(course)\n        in_degree[course] += 1\n    queue = deque(i for i in range(num_courses) if in_degree[i] == 0)\n    order = []\n    while queue:\n        u = queue.popleft()\n        order.append(u)\n        for v in adj[u]:\n            in_degree[v] -= 1\n            if in_degree[v] == 0:\n                queue.append(v)\n    return order if len(order) == num_courses else []\n\nprint('Valid Course Order for 4 courses:', find_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]]))",
      "expectedOutput": "Valid Course Order for 4 courses: [0, 1, 2, 3]"
    }
  },
  "dsa-d23-b2-cycle-detection-kahns": {
    "run": {
      "filename": "cycle_schedule.py",
      "initialCode": "# From the first part of today's lesson:\nfrom collections import deque\n\ndef find_order(num_courses, prerequisites):\n    in_degree = [0] * num_courses\n    adj = [[] for _ in range(num_courses)]\n    for course, pre in prerequisites:\n        adj[pre].append(course)\n        in_degree[course] += 1\n    queue = deque(i for i in range(num_courses) if in_degree[i] == 0)\n    order = []\n    while queue:\n        u = queue.popleft()\n        order.append(u)\n        for v in adj[u]:\n            in_degree[v] -= 1\n            if in_degree[v] == 0:\n                queue.append(v)\n    return order if len(order) == num_courses else []\n\ndef can_finish(num_courses, prerequisites):\n    return len(find_order(num_courses, prerequisites)) == num_courses\n\nprint('Can finish cyclic courses [[1,0], [0,1]]?:', can_finish(2, [[1, 0], [0, 1]]))",
      "expectedOutput": "Can finish cyclic courses [[1,0], [0,1]]?: False"
    }
  },
  "dsa-d23-b3-monorepo-build-graph": {
    "run": {
      "filename": "build_scheduler.py",
      "initialCode": "build_steps = ['core-utils', 'auth-service', 'web-app']\nprint('Build Pipeline:', ' -> '.join(build_steps))",
      "expectedOutput": "Build Pipeline: core-utils -> auth-service -> web-app"
    }
  },
  "dsa-d24-b1-union-find-path-compression": {
    "run": {
      "filename": "union_find_demo.py",
      "initialCode": "class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n\n    def union(self, x, y):\n        root_x, root_y = self.find(x), self.find(y)\n        if root_x == root_y:\n            return False\n        if self.rank[root_x] < self.rank[root_y]:\n            self.parent[root_x] = root_y\n        elif self.rank[root_x] > self.rank[root_y]:\n            self.parent[root_y] = root_x\n        else:\n            self.parent[root_y] = root_x\n            self.rank[root_x] += 1\n        return True\n\n    def connected(self, x, y):\n        return self.find(x) == self.find(y)\n\nuf = UnionFind(4)\nuf.union(0, 1); uf.union(1, 2)\nprint('Connected 0 & 2?:', uf.connected(0, 2))\nprint('Connected 0 & 3?:', uf.connected(0, 3))",
      "expectedOutput": "Connected 0 & 2?: True\nConnected 0 & 3?: False"
    },
    "anatomy": {
      "codeSnippet": "def find(self, x):\n    if self.parent[x] != x:\n        self.parent[x] = self.find(self.parent[x])  # Point straight at the root!\n\n    return self.parent[x]",
      "lineNotes": {
        "2": "Flattens the tree on every lookup.",
        "5": "Returns the representative of the group."
      }
    }
  },
  "dsa-d24-b2-redundant-connection-cycle": {
    "run": {
      "filename": "redundant_conn.py",
      "initialCode": "# From the first part of today's lesson:\nclass UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n\n    def union(self, x, y):\n        root_x, root_y = self.find(x), self.find(y)\n        if root_x == root_y:\n            return False\n        if self.rank[root_x] < self.rank[root_y]:\n            self.parent[root_x] = root_y\n        elif self.rank[root_x] > self.rank[root_y]:\n            self.parent[root_y] = root_x\n        else:\n            self.parent[root_y] = root_x\n            self.rank[root_x] += 1\n        return True\n\ndef find_redundant_connection(edges):\n    uf = UnionFind(len(edges) + 1)\n    for u, v in edges:\n        if not uf.union(u, v):\n            return [u, v]\n    return []\n\nprint('Redundant Cycle Edge in [[1,2],[1,3],[2,3]]:', find_redundant_connection([[1, 2], [1, 3], [2, 3]]))",
      "expectedOutput": "Redundant Cycle Edge in [[1,2],[1,3],[2,3]]: [2, 3]"
    }
  },
  "dsa-d24-b3-kruskals-mst": {
    "run": {
      "filename": "kruskal_demo.py",
      "initialCode": "# From the first part of today's lesson:\nclass UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n\n    def union(self, x, y):\n        root_x, root_y = self.find(x), self.find(y)\n        if root_x == root_y:\n            return False\n        if self.rank[root_x] < self.rank[root_y]:\n            self.parent[root_x] = root_y\n        elif self.rank[root_x] > self.rank[root_y]:\n            self.parent[root_y] = root_x\n        else:\n            self.parent[root_y] = root_x\n            self.rank[root_x] += 1\n        return True\n\ndef kruskal_mst(n, edges):\n    edges.sort(key=lambda e: e[2])  # Sort by weight\n    uf = UnionFind(n)\n    total_weight = 0\n    for u, v, w in edges:\n        if uf.union(u, v):\n            total_weight += w\n    return total_weight\n\nprint('Minimum Spanning Tree Total Weight:', kruskal_mst(3, [[0, 1, 1], [1, 2, 2], [0, 2, 5]]))",
      "expectedOutput": "Minimum Spanning Tree Total Weight: 3"
    }
  },
  "dsa-d25-b1-overlapping-subproblems": {
    "run": {
      "filename": "fib_dp_demo.py",
      "initialCode": "def fib(n):\n    if n <= 1:\n        return n\n    prev2, prev1 = 0, 1\n    for _ in range(2, n + 1):\n        prev2, prev1 = prev1, prev1 + prev2\n    return prev1\n\nprint('Fibonacci(10):', fib(10))",
      "expectedOutput": "Fibonacci(10): 55"
    }
  },
  "dsa-d25-b2-house-robber-state-transition": {
    "run": {
      "filename": "house_robber_demo.py",
      "initialCode": "def rob(nums):\n    prev2 = prev1 = 0\n    for num in nums:\n        prev2, prev1 = prev1, max(prev1, prev2 + num)\n    return prev1\n\nprint('Max loot for [2, 7, 9, 3, 1]:', rob([2, 7, 9, 3, 1]))",
      "expectedOutput": "Max loot for [2, 7, 9, 3, 1]: 12"
    },
    "anatomy": {
      "codeSnippet": "for loot in houses:\n    current_max = max(rob_previous_house, rob_two_houses_ago + loot)\n    rob_two_houses_ago = rob_previous_house\n    rob_previous_house = current_max",
      "lineNotes": {
        "2": "At each house, chooses max between skipping this house (robPreviousHouse) or robbing it (robTwoHousesAgo + loot).",
        "4": "Maintains rolling 2-variable window, achieving O(N) time and O(1) space."
      }
    }
  },
  "dsa-d25-b3-climbing-stairs": {
    "run": {
      "filename": "climbing_stairs_demo.py",
      "initialCode": "def climb_stairs(n):\n    if n <= 2:\n        return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b\n\nprint('Distinct ways to climb 5 stairs:', climb_stairs(5))",
      "expectedOutput": "Distinct ways to climb 5 stairs: 8"
    }
  },
  "dsa-d26-b1-coin-change-unbounded": {
    "run": {
      "filename": "coin_change_demo.py",
      "initialCode": "def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i - c >= 0:\n                dp[i] = min(dp[i], dp[i - c] + 1)\n    return -1 if dp[amount] == float('inf') else dp[amount]\n\nprint('Min coins for 11 with [1, 2, 5]:', coin_change([1, 2, 5], 11))\nprint('Min coins for 3 with [2]:', coin_change([2], 3))",
      "expectedOutput": "Min coins for 11 with [1, 2, 5]: 3\nMin coins for 3 with [2]: -1"
    },
    "anatomy": {
      "codeSnippet": "dp = [float('inf')] * (amount + 1)\ndp[0] = 0  # 0 coins are needed to make 0\nfor i in range(1, amount + 1):\n    for coin in coins:\n        if i - coin >= 0: dp[i] = min(dp[i], dp[i - coin] + 1)",
      "lineNotes": {
        "1": "Fills the table with infinity for amounts not yet reachable.",
        "2": "Base case: an amount of 0 needs 0 coins.",
        "5": "Reuses smaller answers to find the fewest coins."
      }
    }
  },
  "dsa-d26-b2-01-knapsack-grid": {
    "run": {
      "filename": "knapsack_demo.py",
      "initialCode": "def knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(capacity + 1):\n            if weights[i - 1] <= w:\n                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])\n            else:\n                dp[i][w] = dp[i - 1][w]\n    return dp[n][capacity]\n\nprint('Max Knapsack Value for weights [2,3,4,5], values [3,4,5,6], cap 5:', knapsack([2, 3, 4, 5], [3, 4, 5, 6], 5))",
      "expectedOutput": "Max Knapsack Value for weights [2,3,4,5], values [3,4,5,6], cap 5: 7"
    }
  },
  "dsa-d26-b3-milestone-knapsack-cert": {
    "run": {
      "filename": "knapsack_cert.py",
      "initialCode": "print('⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Engine [VERIFIED 100%]')",
      "expectedOutput": "⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Engine [VERIFIED 100%]"
    }
  },
  "dsa-d27-b1-lcs-matrix-transitions": {
    "run": {
      "filename": "lcs_demo.py",
      "initialCode": "def longest_common_subsequence(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i - 1] == text2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    return dp[m][n]\n\nprint('LCS of \"abcde\" and \"ace\":', longest_common_subsequence('abcde', 'ace'))",
      "expectedOutput": "LCS of \"abcde\" and \"ace\": 3"
    },
    "anatomy": {
      "codeSnippet": "if text1[i - 1] == text2[j - 1]:\n    dp[i][j] = dp[i - 1][j - 1] + 1\nelse:\n    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])",
      "lineNotes": {
        "2": "When characters match, extend the previous common subsequence by 1.",
        "4": "When characters differ, take the best result from discarding a character from either string."
      }
    }
  },
  "dsa-d27-b2-edit-distance-levenshtein": {
    "run": {
      "filename": "edit_dist_demo.py",
      "initialCode": "def min_distance(w1, w2):\n    m, n = len(w1), len(w2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1):\n        dp[i][0] = i\n    for j in range(n + 1):\n        dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if w1[i - 1] == w2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[m][n]\n\nprint('Edit distance \"horse\" -> \"ros\":', min_distance('horse', 'ros'))",
      "expectedOutput": "Edit distance \"horse\" -> \"ros\": 3"
    }
  },
  "dsa-d27-b3-space-optimized-lcs": {
    "run": {
      "filename": "space_opt_lcs.py",
      "initialCode": "def lcs_space_optimized(t1, t2):\n    prev = [0] * (len(t2) + 1)\n    for i in range(1, len(t1) + 1):\n        curr = [0] * (len(t2) + 1)\n        for j in range(1, len(t2) + 1):\n            if t1[i - 1] == t2[j - 1]:\n                curr[j] = prev[j - 1] + 1\n            else:\n                curr[j] = max(prev[j], curr[j - 1])\n        prev = curr\n    return prev[len(t2)]\n\nprint('Optimized LCS length:', lcs_space_optimized('abc', 'abc'))",
      "expectedOutput": "Optimized LCS length: 3"
    }
  },
  "dsa-d28-b1-nqueens-diagonal-sets": {
    "run": {
      "filename": "n_queens_demo.py",
      "initialCode": "def total_n_queens(n):\n    count = 0\n    cols, pos_diag, neg_diag = set(), set(), set()\n\n    def backtrack(r):\n        nonlocal count\n        if r == n:\n            count += 1\n            return\n        for c in range(n):\n            if c in cols or (r + c) in pos_diag or (r - c) in neg_diag:\n                continue\n            cols.add(c); pos_diag.add(r + c); neg_diag.add(r - c)\n            backtrack(r + 1)\n            cols.remove(c); pos_diag.remove(r + c); neg_diag.remove(r - c)\n\n    backtrack(0)\n    return count\n\nprint('4-Queens Solutions:', total_n_queens(4))\nprint('8-Queens Solutions:', total_n_queens(8))",
      "expectedOutput": "4-Queens Solutions: 2\n8-Queens Solutions: 92"
    },
    "anatomy": {
      "codeSnippet": "is_attacked = c in cols or (r + c) in pos_diag or (r - c) in neg_diag\nif not is_attacked:\n    cols.add(c); pos_diag.add(r + c); neg_diag.add(r - c)            # Place queen\n    backtrack(r + 1)                                                 # Next row\n    cols.remove(c); pos_diag.remove(r + c); neg_diag.remove(r - c)   # Remove queen (backtrack)",
      "lineNotes": {
        "1": "Checks all horizontal, vertical, and diagonal lines of sight in O(1) time.",
        "3": "Locks sets for sub-branches.",
        "5": "Frees sets on backtrack."
      }
    }
  },
  "dsa-d28-b2-sudoku-solver-pruning": {
    "run": {
      "filename": "sudoku_valid.py",
      "initialCode": "def is_valid_sudoku(board):\n    seen = set()\n    for r in range(9):\n        for c in range(9):\n            val = board[r][c]\n            if val == '.':\n                continue\n            keys = (f'{val} in row {r}', f'{val} in col {c}', f'{val} in box {r // 3}-{c // 3}')\n            if any(k in seen for k in keys):\n                return False\n            seen.update(keys)\n    return True\n\nboard = [['.'] * 9 for _ in range(9)]\nboard[0][0] = '5'; board[0][1] = '3'\nprint('Is valid partial board?:', is_valid_sudoku(board))",
      "expectedOutput": "Is valid partial board?: True"
    }
  },
  "dsa-d28-b3-state-tree-pruning": {
    "run": {
      "filename": "pruning_sim.py",
      "initialCode": "def simulate_pruning(total_states, pruned_percent=0.999):\n    return round(total_states * (1 - pruned_percent))  # whole states only\n\nprint('Active states explored after 99.9% pruning of 1,000,000 branches:', simulate_pruning(1000000))",
      "expectedOutput": "Active states explored after 99.9% pruning of 1,000,000 branches: 1000"
    }
  },
  "dsa-d29-b1-xor-self-inverse": {
    "run": {
      "filename": "xor_demo.py",
      "initialCode": "def single_number(nums):\n    res = 0\n    for n in nums:\n        res ^= n\n    return res\n\nprint('Single number in [4, 1, 2, 1, 2]:', single_number([4, 1, 2, 1, 2]))",
      "expectedOutput": "Single number in [4, 1, 2, 1, 2]: 4"
    },
    "anatomy": {
      "codeSnippet": "def single_number(nums):\n    result = 0\n    for num in nums:\n        result ^= num  # Duplicate numbers cancel out to 0!\n\n    return result",
      "lineNotes": {
        "2": "Starts from 0, which changes nothing under XOR.",
        "4": "Every pair cancels itself out, leaving only the number without a partner."
      }
    }
  },
  "dsa-d29-b2-brian-kernighan-bits": {
    "run": {
      "filename": "hamming_weight.py",
      "initialCode": "def hamming_weight(n):\n    count = 0\n    while n != 0:\n        n &= n - 1  # Clears the rightmost 1 bit\n        count += 1\n    return count\n\nprint('Set bits in 11 (binary 1011):', hamming_weight(11))",
      "expectedOutput": "Set bits in 11 (binary 1011): 3"
    }
  },
  "dsa-d29-b3-bitmask-subsets": {
    "run": {
      "filename": "bitmask_demo.py",
      "initialCode": "def get_bitmask_subset(items, mask):\n    return [items[i] for i in range(len(items)) if mask & (1 << i)]\n\nprint('Subset for mask 5 (binary 101) in [\"A\", \"B\", \"C\"]:', get_bitmask_subset(['A', 'B', 'C'], 5))",
      "expectedOutput": "Subset for mask 5 (binary 101) in [\"A\", \"B\", \"C\"]: ['A', 'C']"
    }
  },
  "dsa-d30-b1-bellman-ford-bounded-stops": {
    "run": {
      "filename": "cheapest_flight_demo.py",
      "initialCode": "def find_cheapest_flight(n, flights, src, dst, k):\n    prices = [float('inf')] * n\n    prices[src] = 0\n    for _ in range(k + 1):\n        temp = prices[:]\n        for frm, to, price in flights:\n            if prices[frm] == float('inf'):\n                continue\n            if prices[frm] + price < temp[to]:\n                temp[to] = prices[frm] + price\n        prices = temp\n    return -1 if prices[dst] == float('inf') else prices[dst]\n\nflights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]]\nprint('Cheapest flight 0 -> 3 with at most 1 stop:', find_cheapest_flight(4, flights, 0, 3, 1))\nprint('Cheapest flight 0 -> 3 with at most 2 stops:', find_cheapest_flight(4, flights, 0, 3, 2))",
      "expectedOutput": "Cheapest flight 0 -> 3 with at most 1 stop: 700\nCheapest flight 0 -> 3 with at most 2 stops: 400"
    },
    "anatomy": {
      "codeSnippet": "prices = [float('inf')] * n\nprices[src] = 0\nfor _ in range(k + 1):\n    temp = prices[:]  # Freeze a snapshot of the previous round!\n    for frm, to, price in flights:\n        if prices[frm] == float('inf'):\n            continue\n        if prices[frm] + price < temp[to]:\n            temp[to] = prices[frm] + price\n    prices = temp",
      "lineNotes": {
        "3": "Runs exactly k + 1 rounds so no path uses more than k stops.",
        "4": "The snapshot stops one round from using prices updated in the same round (which would count extra hops)."
      }
    }
  },
  "dsa-d30-b2-flight-connectivity-audit": {
    "run": {
      "filename": "flight_audit.py",
      "initialCode": "def audit_flight_routes(n, flights):\n    return {'total_airports': n, 'active_routes': len(flights), 'is_audited': True}\n\nprint(audit_flight_routes(4, [[0, 1, 100], [1, 2, 100]]))",
      "expectedOutput": "{'total_airports': 4, 'active_routes': 2, 'is_audited': True}"
    }
  },
  "dsa-d30-b3-full-dsa-mastery-certification": {
    "run": {
      "filename": "dsa_final_cert.py",
      "initialCode": "print('🎉 Data Structures & Algorithms in Python Certification: 100/100 [GOLD-STANDARD CERTIFIED]')",
      "expectedOutput": "🎉 Data Structures & Algorithms in Python Certification: 100/100 [GOLD-STANDARD CERTIFIED]"
    }
  }
};

/** Text written with JavaScript in mind, and its Python wording. Applied in this order. */
const TEXT_SWAPS: [string, string][] = [
  ['JavaScript arrays', 'Python lists'],
  ['JavaScript', 'Python'],
  ['true O(N)', 'truly O(N)'],
  ['null pointer', 'None reference'],
  ['Zero null branch conditionals', 'Zero None checks'],
  ['O(1) pushFront, pushBack, popFront, popBack', 'O(1) appendleft, append, popleft, pop (collections.deque)'],
  ['TrieNode { children: {}, isEnd: boolean }', 'TrieNode: children dict + is_end flag'],
  ['`isEnd === false`', '`is_end` is `False`'],
  ['If `union(u, v) === false`', 'If `union(u, v)` returns `False`'],
  ['Secondary Sort: `a.localeCompare(b)` Alphabetical', 'Secondary Sort: alphabetical (`key=lambda e: (-e.freq, e.word)`)'],
  ['Pops element off array', 'Pops element off the list'],
  ['`dq.peekFront()`', '`dq[0]`'],
  ['`rb.Front()`', '`rb.front()`'],
  ['stack.length === 0', 'len(stack) == 0'],
  ['`levelSize = queue.length`', '`level_size = len(queue)`'],
  ['(order.length !== V)', '(len(order) != V)'],
  ['Map<Key, Node>', 'dict[key, Node]'],
  ['`Map<Node, Node[]>`', '`dict[node, list[node]]`'],
  ['Efficient Map/Array', 'Efficient dict/list'],
  ['Map storing last seen', 'dict storing last seen'],
  ['Map finds Node', 'dict finds Node'],
  ['delete from Map', 'delete from the dict'],
  ['mid = Math.floor((left + right) / 2)', 'mid = (left + right) // 2'],
  ['Box Key `Math.floor(r/3)}-${Math.floor(c/3)}`', 'Box key `f"{r // 3}-{c // 3}"`'],
  ['`const temp = [...prices]`', '`temp = prices[:]`'],
  ['current.push(candidate)', 'current.append(candidate)'],
  ['Math.max(', 'max('],
  ['Math.min(', 'min('],
  ['!==', '!='],
  ['===', '=='],
  ['= Infinity', '= infinity'],
  ['with Infinity', 'with infinity'],
];

const snake = (word: string) => word.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

function toPythonText(text: string): string {
  let out = text;
  for (const [from, to] of TEXT_SWAPS) out = out.split(from).join(to);
  // camelCase names (maxSum, isEnd) are snake_case in the Python code; true/false/null likewise.
  return out
    .replace(/\b[a-z]+(?:[A-Z][a-z0-9]*)+\b/g, snake)
    .replace(/\btrue\b/g, 'True')
    .replace(/\bfalse\b/g, 'False')
    .replace(/\bnull\b/g, 'None');
}

/** A printed JS value ("[0,1]", '["a","b"]', "true") as Python prints it ("[0, 1]", "['a', 'b']", "True"). */
function toPythonOutput(output: string): string {
  try {
    const value = JSON.parse(output);
    const repr = (v: unknown): string =>
      Array.isArray(v) ? `[${v.map(repr).join(', ')}]`
      : typeof v === 'string' ? `'${v}'`
      : typeof v === 'boolean' ? (v ? 'True' : 'False')
      : String(v);
    if (typeof value !== 'string') return repr(value);
  } catch {
    // not a JSON value: fall through
  }
  return toPythonText(output);
}

/** Every string in a lesson block, except ids and code, in Python wording. */
function translate(value: unknown, key = ''): unknown {
  if (typeof value === 'string') return /^(id|conceptId|misconceptionId|primaryMisconceptionId)$/.test(key) ? value : toPythonText(value);
  if (Array.isArray(value)) return value.map((v) => translate(v));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, translate(v, k)]));
  }
  return value;
}

function pythonDay(day: DayLessonPlan): DayLessonPlan {
  const translated = translate(day) as DayLessonPlan;
  translated.blocks = day.blocks.map((block, i) => {
    const out = translated.blocks[i];
    const code = DSA_PYTHON_BLOCK_CODE[block.id];
    out.media = (block.media as any[]).map((media: any, m: number) => {
      const t = out.media[m] as any;
      if (media.type === 'runnable_code' && code?.run) return { ...t, ...code.run };
      if (media.type === 'syntax_anatomy' && code?.anatomy) return { ...t, codeSnippet: code.anatomy.codeSnippet, lineNotes: translate(code.anatomy.lineNotes) };
      if (media.data?.type === 'broken_fixed_diff' && PYTHON_DIFFS[block.id]) return { ...t, data: { ...t.data, ...PYTHON_DIFFS[block.id] } };
      return t;
    });
    const check = block.diagnosticCheck as any;
    if (check?.expectedStringOutput) {
      const expected = PYTHON_ANSWERS[block.id] ?? toPythonOutput(check.expectedStringOutput);
      (out.diagnosticCheck as any).expectedStringOutput = expected;
      (out.diagnosticCheck as any).acceptableAnswers = [expected, ...(check.acceptableAnswers || []).filter((a: string) => a !== expected)];
    }
    return out;
  });
  return translated;
}

/** The before-and-after bug fix examples, in Python. */
const PYTHON_DIFFS: Record<string, { brokenCode: string; fixedCode: string }> = {
  'dsa-d17-b1-bst-invariants-min-max': {
    brokenCode: "# ❌ BUGGY: Only checks immediate children!\ndef is_valid_bst(node):\n    if not node:\n        return True\n    if node.left and node.left.val >= node.val:\n        return False\n    if node.right and node.right.val <= node.val:\n        return False\n    return is_valid_bst(node.left) and is_valid_bst(node.right)",
    fixedCode: "# ✅ CORRECT: Passes global ancestral (low, high) bounds!\ndef is_valid_bst(node, low=float('-inf'), high=float('inf')):\n    if not node:\n        return True\n    if node.val <= low or node.val >= high:\n        return False\n    return is_valid_bst(node.left, low, node.val) and is_valid_bst(node.right, node.val, high)",
  },
};

/** Answers that differ from a plain conversion of the JavaScript output. */
const PYTHON_ANSWERS: Record<string, string> = {
  // Python's / always gives a float, so the even-length medians print as 10.0 and 4.0.
  'dsa-d15-b2-streaming-telemetry-benchmarking': '[5, 10.0, 5, 4.0]',
  'dsa-d30-b3-full-dsa-mastery-certification': '🎉 Data Structures & Algorithms in Python Certification: 100/100 [GOLD-STANDARD CERTIFIED]',
};

export const DSA_PYTHON_PILOT_DAYS: DayLessonPlan[] = DSA_PILOT_DAYS.map(pythonDay);
