/**
 * Data Structures & Algorithms in Python: full-length lessons (about 20-30 minutes each), one per course day, written in plain
 * words for the Python track. Every code sample runs in the browser (Pyodide) and prints exactly
 * its `output`; tests/python_track_long_lessons.test.ts checks this and each lesson's length.
 * Days without a long lesson here still use the shorter lesson plan.
 */
import type { LongLesson } from './longLessons';

export const DSA_PYTHON_LONG_LESSONS: LongLesson[] = [
  {
    "day": 1,
    "title": "Time & Space Complexity (Big-O Asymptotics & Dominant Terms)",
    "goal": "You can look at a piece of code and say how its running time grows as the input grows: O(1), O(log N), O(N) or O(N^2).",
    "minutes": 30,
    "recap": "Welcome to Data Structures and Algorithms in Python. You already know Python basics: variables, lists, loops and functions. This month you will learn to write code that stays fast even with millions of items.",
    "parts": [
      {
        "title": "Why speed depends on the size of the input",
        "say": [
          "An algorithm is just a recipe: a list of steps that solves a problem. Two recipes can give the same answer and still take very different amounts of time. This course is about choosing and building the fast recipes.",
          "The time a program takes depends mostly on how much data it has to handle. Finding a name in a list of 10 names is instant whatever you do. Finding it in a list of 10 million names is where good and bad algorithms separate.",
          "So instead of measuring seconds, which change from laptop to laptop, we count steps and ask one question: when the input gets bigger, how fast does the number of steps grow? That growth is what Big-O describes.",
          "Today's code counts steps for you. Watch how one loop over n items takes n steps, and a loop inside a loop takes n times n steps. That difference is everything in this course."
        ],
        "example": "Imagine checking attendance. Calling out every name on a register of 60 students takes 60 calls. If for every student you also had to compare them with every other student (to find twins, say), that is 60 x 60 = 3,600 comparisons. Same class, very different amount of work.",
        "code": "def count_single_loop(n):\n    steps = 0\n    for i in range(n):\n        steps += 1\n    return steps\n\ndef count_nested_loop(n):\n    steps = 0\n    for i in range(n):\n        for j in range(n):\n            steps += 1\n    return steps\n\nfor n in [10, 100, 1000]:\n    print(n, count_single_loop(n), count_nested_loop(n))",
        "output": "10 10 100\n100 100 10000\n1000 1000 1000000",
        "codeNotes": [
          {
            "line": 3,
            "note": "One loop over n items: n steps."
          },
          {
            "line": 10,
            "note": "A loop inside a loop: n x n steps."
          }
        ],
        "tryIt": "Add 2000 to the list on line 14 and run it. The single loop doubles to 2000, but the nested loop jumps to 4,000,000.",
        "check": {
          "question": "When n goes from 1000 to 2000, what happens to the steps of the nested loop?",
          "options": [
            "They double",
            "They go up about 4 times",
            "They stay the same"
          ],
          "answer": 1,
          "why": "The nested loop does n x n steps. Doubling n gives 2n x 2n = 4 x n x n, so about four times the work."
        }
      },
      {
        "title": "Big-O: keep the part that grows fastest",
        "say": [
          "Big-O notation writes down the growth in a short form. O(N) means the steps grow in step with N. O(N^2) means they grow with N times N. O(1) means the steps stay the same however big N gets.",
          "When we write Big-O we drop constant numbers. A function that does 3N + 5 steps is still O(N), because for a million items the \"+ 5\" is nothing and the \"3 times\" does not change the shape of the growth.",
          "We also keep only the fastest-growing term. N^2 + N is O(N^2), because when N is a million, N^2 is a trillion and the extra million hardly matters. This is called the dominant term.",
          "Big-O usually describes the worst case: the most work the algorithm might ever have to do. That is what you need to know before you trust code with real users' data."
        ],
        "example": "Think of a journey of 300 km with a 10 minute tea stop. Whether you stop for tea or not, the journey time is decided by the 300 km. The tea stop is the \"+ 5\": real, but not what decides how long long journeys take.",
        "code": "def steps_linear(n):\n    return 3 * n + 5\n\ndef steps_quadratic(n):\n    return n * n + n\n\nfor n in [10, 1000, 1000000]:\n    extra = n\n    share = extra / steps_quadratic(n) * 100\n    print(n, steps_linear(n), steps_quadratic(n), f\"the +n part is {share:.4f}% of the work\")",
        "output": "10 35 110 the +n part is 9.0909% of the work\n1000 3005 1001000 the +n part is 0.0999% of the work\n1000000 3000005 1000001000000 the +n part is 0.0001% of the work",
        "codeNotes": [
          {
            "line": 2,
            "note": "3N + 5 is still O(N): constants are dropped."
          },
          {
            "line": 9,
            "note": "For big n, the + n part becomes a tiny share of n*n + n."
          }
        ],
        "tryIt": "Change line 8 so that extra is 5 and share uses steps_linear(n). You will see the + 5 become almost 0% of the work for big n.",
        "check": {
          "question": "What is the Big-O of an algorithm that takes 5N^2 + 100N + 7 steps?",
          "options": [
            "O(N)",
            "O(5N^2)",
            "O(N^2)"
          ],
          "answer": 2,
          "why": "Drop the constants (5, 100, 7) and keep the fastest-growing term, N^2. So it is O(N^2)."
        }
      },
      {
        "title": "O(1) and O(N): constant and linear time",
        "say": [
          "O(1), constant time, means the work does not depend on the size of the data. Reading nums[500] from a Python list takes the same time whether the list has 1,000 or 1,000,000 items, because Python jumps straight to that position.",
          "Looking up a key in a dict is also O(1) on average. That is why dicts are so useful: you can ask \"is this username taken?\" instantly, even with millions of users.",
          "O(N), linear time, means the work grows in step with N. Finding the largest number in an unsorted list is O(N): you must look at every item, because the largest could be anywhere.",
          "The keyword in is a trap to watch for. x in my_list is O(N) because Python checks items one by one. x in my_set or x in my_dict is O(1). Same looking code, very different speed."
        ],
        "example": "Finding the flat of your friend in a building is O(1) if you know the flat number: you walk straight to it. If you only know their name, you knock on every door until you find them: O(N).",
        "code": "def count_checks_in_list(items, target):\n    checks = 0\n    for x in items:\n        checks += 1\n        if x == target:\n            break\n    return checks\n\nnumbers = list(range(100000))\nprint(\"index lookup: 1 step, value\", numbers[99999])\nprint(\"list search checks:\", count_checks_in_list(numbers, 99999))\nlookup = set(numbers)\nprint(\"set lookup:\", 99999 in lookup)",
        "output": "index lookup: 1 step, value 99999\nlist search checks: 100000\nset lookup: True",
        "codeNotes": [
          {
            "line": 10,
            "note": "Reading by position is O(1): Python jumps straight there."
          },
          {
            "line": 11,
            "note": "Searching a list for a value checks items one by one: O(N)."
          },
          {
            "line": 13,
            "note": "A set finds values in O(1) on average."
          }
        ],
        "tryIt": "Change the target on line 11 to 5 and run it. Only 6 checks: the best case is fast, but Big-O cares about the worst case.",
        "check": {
          "question": "Which of these is O(N) for a Python list called users?",
          "options": [
            "users[0]",
            "\"asha\" in users",
            "len(users)"
          ],
          "answer": 1,
          "why": "in on a list checks items one by one, so it is O(N). Reading users[0] and len(users) are both O(1)."
        }
      },
      {
        "title": "O(log N): halving the problem",
        "say": [
          "O(log N), logarithmic time, is the next best thing after O(1). It happens when each step throws away half of what is left. log2 of N is how many times you can halve N before you get down to 1.",
          "The numbers are amazing. Halving 1,000,000 takes only 20 steps to reach 1. Halving a billion takes about 30. So an O(log N) algorithm barely notices when the data grows a thousand times.",
          "The classic example is binary search on a sorted list: look at the middle, decide which half the answer must be in, and throw the other half away. You will build it properly on Day 10.",
          "Whenever you see a loop where n is divided by 2 each time (n = n // 2), think O(log N)."
        ],
        "example": "Guessing a number between 1 and 100 when your friend says \"higher\" or \"lower\": if you always guess the middle, you never need more than 7 guesses, because 2 to the power 7 is 128. That is log2(100), about 7.",
        "code": "import math\n\ndef halving_steps(n):\n    steps = 0\n    while n > 1:\n        n = n // 2\n        steps += 1\n    return steps\n\nfor n in [100, 1000000, 1000000000]:\n    print(n, halving_steps(n), round(math.log2(n), 1))",
        "output": "100 6 6.6\n1000000 19 19.9\n1000000000 29 29.9",
        "codeNotes": [
          {
            "line": 6,
            "note": "Each step keeps only half: this is what makes it O(log N)."
          },
          {
            "line": 11,
            "note": "Our counted steps match log2(n), rounded down."
          }
        ],
        "tryIt": "Add 1000000000000 (a trillion) to the list. Even a trillion only needs about 40 halvings.",
        "check": {
          "question": "Roughly how many halving steps does it take to get from 1,000,000 down to 1?",
          "options": [
            "About 20",
            "About 1,000",
            "About 500,000"
          ],
          "answer": 0,
          "why": "Each step halves the size. 2 to the power 20 is 1,048,576, so about 20 steps."
        }
      },
      {
        "title": "O(N^2) and how to spot it",
        "say": [
          "O(N^2), quadratic time, usually comes from a loop inside a loop over the same data. It is fine for 100 items (10,000 steps) but painful for 100,000 items (10 billion steps).",
          "A very common hidden O(N^2) is using in on a list inside a loop. The outer loop is N, and each in check is another N. Changing the list to a set makes each check O(1), and the whole thing becomes O(N).",
          "The real skill is to read code and count the loops: one loop over the data is usually O(N), a loop inside a loop is usually O(N^2), and a loop that halves is O(log N). Sorting with sorted() is O(N log N).",
          "In the practice today you will write a function that measures step counts for N and 2N and names the complexity from how much they grow. That is exactly the doubling test you have been doing in this lesson."
        ],
        "example": "Checking whether any two students in a class share a birthday by comparing every pair is O(N^2). Writing each birthday on a board and checking if it is already there is O(N). Same question, far less work.",
        "code": "def has_duplicate_slow(items):\n    for i in range(len(items)):\n        for j in range(i + 1, len(items)):\n            if items[i] == items[j]:\n                return True\n    return False\n\ndef has_duplicate_fast(items):\n    seen = set()\n    for x in items:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n\ndata = list(range(2000)) + [5]\nprint(has_duplicate_slow(data), has_duplicate_fast(data))",
        "output": "True True",
        "codeNotes": [
          {
            "line": 3,
            "note": "A loop inside a loop: O(N^2)."
          },
          {
            "line": 11,
            "note": "Checking a set is O(1), so the whole function is O(N)."
          }
        ],
        "tryIt": "Both give True. Now think: which one would you trust with 1,000,000 items? Write your answer as a comment at the bottom.",
        "check": {
          "question": "A function loops over a list and, inside the loop, checks x in other_list. Both lists have N items. What is its Big-O?",
          "options": [
            "O(N)",
            "O(N^2)",
            "O(log N)"
          ],
          "answer": 1,
          "why": "The outer loop runs N times and each in check on a list is O(N), so N x N = O(N^2). Using a set for other_list would make it O(N)."
        }
      },
      {
        "title": "Space complexity: memory counts too",
        "say": [
          "Big-O also describes memory, called space complexity. It asks: how much extra memory does the algorithm need as N grows?",
          "Reversing a list in place with two pointers that swap items needs only a couple of extra variables, whatever the size of the list. That is O(1) extra space.",
          "Making a new reversed copy, like items[::-1], needs a second list of N items. That is O(N) extra space. Both are correct; the in-place version saves memory, the copy keeps the original safe.",
          "In the fast duplicate check from the last part, the seen set can grow to N items, so it uses O(N) space to save time. Trading memory for speed like this is one of the most common decisions in this course."
        ],
        "example": "Rearranging books on your own shelf needs no extra shelf: O(1) space. Copying every book onto a new shelf in reverse order needs a whole second shelf: O(N) space.",
        "code": "def reverse_in_place(items):\n    left, right = 0, len(items) - 1\n    while left < right:\n        items[left], items[right] = items[right], items[left]\n        left += 1\n        right -= 1\n    return items\n\nprint(reverse_in_place([1, 2, 3, 4, 5]))\noriginal = [1, 2, 3]\ncopy = original[::-1]\nprint(original, copy)",
        "output": "[5, 4, 3, 2, 1]\n[1, 2, 3] [3, 2, 1]",
        "codeNotes": [
          {
            "line": 2,
            "note": "Only two extra variables, whatever the list size: O(1) space."
          },
          {
            "line": 11,
            "note": "Slicing makes a whole new list: O(N) space."
          }
        ],
        "tryIt": "Call reverse_in_place on a list stored in a variable, then print that variable. The original list itself has changed, because it was reversed in place.",
        "check": {
          "question": "A function builds a new dict with one entry for every item in the input list. What is its extra space?",
          "options": [
            "O(1)",
            "O(N)",
            "O(N^2)"
          ],
          "answer": 1,
          "why": "One dict entry per item means the dict grows to N entries, so the extra space is O(N)."
        }
      }
    ],
    "summary": [
      "Big-O describes how the steps (or memory) grow as the input size N grows, not the exact seconds.",
      "Drop constants and keep the fastest-growing term: 3N + 5 is O(N), N^2 + N is O(N^2).",
      "Common classes from fast to slow: O(1), O(log N), O(N), O(N log N), O(N^2).",
      "A loop is usually O(N), a loop inside a loop is usually O(N^2), a loop that halves is O(log N).",
      "x in list is O(N) but x in set or dict is O(1) on average."
    ],
    "projectStep": {
      "title": "Start your DSA toolkit",
      "steps": [
        "Create a file called dsa_toolkit.py on your laptop. You will add one tool to it every day this month.",
        "Add today's halving_steps(n) and has_duplicate_fast(items) functions with a one-line comment above each saying its Big-O.",
        "At the bottom, add a few print() lines that call them, and run the file with python dsa_toolkit.py."
      ]
    }
  },
  {
    "day": 2,
    "title": "Dynamic Arrays & Amortized Geometric Resizing",
    "goal": "You understand how a Python list grows by doubling, why append is fast on average, and how to change a list in place.",
    "minutes": 30,
    "recap": "Yesterday you learned Big-O: O(1), O(log N), O(N) and O(N^2), and how to spot each one by counting loops.",
    "parts": [
      {
        "title": "An array: items side by side in memory",
        "say": [
          "A Python list is built on an array: a block of memory where items sit next to each other, like houses on a street. Because they are side by side, Python can find item number i with simple arithmetic.",
          "The address of item i is start + i x size_of_one_item. That is why reading nums[i] is O(1): no searching, just one calculation and a jump.",
          "Items being next to each other also makes loops fast in practice, because the computer loads nearby memory together. This is called cache locality.",
          "The downside of an array is that its size is fixed when the block is reserved. So how does a Python list keep growing when you append? That is the clever trick of today's lesson."
        ],
        "example": "Seats in a cinema row are numbered 1 to 20. To find seat 14 you do not check every seat; you count straight to it. An array works the same way: the position tells you exactly where to go.",
        "code": "def address_of(start, index, item_size=8):\n    return start + index * item_size\n\nstart = 1000\nfor i in range(4):\n    print(\"item\", i, \"is at address\", address_of(start, i))\n\nnums = [10, 20, 30, 40]\nprint(nums[2])",
        "output": "item 0 is at address 1000\nitem 1 is at address 1008\nitem 2 is at address 1016\nitem 3 is at address 1024\n30",
        "codeNotes": [
          {
            "line": 2,
            "note": "One multiplication and one addition: O(1), whatever the index."
          }
        ],
        "tryIt": "Change item_size to 4 and run it. The addresses are now 4 apart, like smaller houses on the same street.",
        "check": {
          "question": "Why is nums[i] O(1) for a Python list?",
          "options": [
            "Python remembers the last item you read",
            "The position is worked out with one calculation",
            "Lists are always short"
          ],
          "answer": 1,
          "why": "Items sit side by side, so the address is start + i x item size. One calculation, no searching."
        }
      },
      {
        "title": "Growing by doubling",
        "say": [
          "When a list's block of memory is full and you append one more item, Python reserves a bigger block, copies every item across, and then adds the new one. Copying N items is O(N) work.",
          "If Python grew the block by just 1 each time, every append would copy everything: very slow. Instead it grows the capacity by a multiple (CPython uses about 1.125x plus a little; our model doubles, which shows the idea most clearly).",
          "With doubling, copies happen when the size reaches 1, 2, 4, 8, 16 and so on. Most appends find free space and cost O(1). Only the rare ones at a power of two pay for a copy.",
          "You will build this exact DynamicArray class in today's practice. The code below is a small version that also counts how many items get copied."
        ],
        "example": "A family renting a flat that is too small does not move to a flat one room bigger every time a baby is born. They move to one twice the size, so they do not have to move again for a long time.",
        "code": "class DynamicArray:\n    def __init__(self):\n        self.capacity = 1\n        self.size = 0\n        self.data = [None]\n        self.copies = 0\n\n    def append(self, value):\n        if self.size == self.capacity:\n            self.capacity *= 2\n            bigger = [None] * self.capacity\n            for i in range(self.size):\n                bigger[i] = self.data[i]\n                self.copies += 1\n            self.data = bigger\n        self.data[self.size] = value\n        self.size += 1\n\narr = DynamicArray()\nfor x in range(9):\n    arr.append(x)\n    print(\"size\", arr.size, \"capacity\", arr.capacity)",
        "output": "size 1 capacity 1\nsize 2 capacity 2\nsize 3 capacity 4\nsize 4 capacity 4\nsize 5 capacity 8\nsize 6 capacity 8\nsize 7 capacity 8\nsize 8 capacity 8\nsize 9 capacity 16",
        "codeNotes": [
          {
            "line": 9,
            "note": "Full? Then grow before adding."
          },
          {
            "line": 10,
            "note": "Double the capacity so the next copies are far apart."
          },
          {
            "line": 12,
            "note": "Copy every existing item: the rare O(N) moment."
          }
        ],
        "tryIt": "Print arr.copies after the loop. For 9 appends it is 15 copies, less than 2 per append.",
        "check": {
          "question": "With doubling, when does an append have to copy all the items?",
          "options": [
            "On every append",
            "Only when the array is full",
            "Never"
          ],
          "answer": 1,
          "why": "Only when size equals capacity. Then the capacity doubles, so the next full moment is twice as far away."
        }
      },
      {
        "title": "Amortized O(1): the average cost",
        "say": [
          "Most appends are cheap and a few are expensive. The fair way to measure this is the average cost over many appends, called the amortized cost.",
          "Add up all the copying for N appends with doubling: 1 + 2 + 4 + ... up to N, which is less than 2N. Spread over N appends, that is less than 2 copies per append: a constant. So append is amortized O(1).",
          "This is why you can append a million items to a Python list without worrying. Inserting at the front with insert(0, x) is different: every item has to shift, so each insert is O(N).",
          "The same idea explains why list.pop() from the end is O(1) but list.pop(0) from the front is O(N). Adding and removing at the end is the list's fast side."
        ],
        "example": "Paying 1,200 rupees for a gym membership once a year feels big, but spread over 365 days it is about 3 rupees a day. Amortized cost is the per-day price of the expensive moments.",
        "code": "def total_copies(n):\n    capacity, size, copies = 1, 0, 0\n    for _ in range(n):\n        if size == capacity:\n            copies += size\n            capacity *= 2\n        size += 1\n    return copies\n\nfor n in [10, 1000, 1000000]:\n    c = total_copies(n)\n    print(n, \"appends:\", c, \"copies, about\", round(c / n, 2), \"per append\")",
        "output": "10 appends: 15 copies, about 1.5 per append\n1000 appends: 1023 copies, about 1.02 per append\n1000000 appends: 1048575 copies, about 1.05 per append",
        "codeNotes": [
          {
            "line": 5,
            "note": "A full array copies all its items."
          },
          {
            "line": 12,
            "note": "The average stays below 2, however big n gets: amortized O(1)."
          }
        ],
        "tryIt": "Try n = 1025 (just past a power of two). The average jumps to about 2, because a big copy just happened. It is still a constant.",
        "check": {
          "question": "What is the amortized cost of append on a list that doubles when full?",
          "options": [
            "O(1)",
            "O(N)",
            "O(log N)"
          ],
          "answer": 0,
          "why": "All the copying for N appends adds up to less than 2N, so on average each append costs a constant amount: O(1)."
        }
      },
      {
        "title": "Changing a list in place with a write pointer",
        "say": [
          "Many interview questions ask you to change a list in place: fix it without building a new list, using O(1) extra space. The most common tool is a write pointer.",
          "Keep two positions. A read position walks over every item. A write position marks where the next item you want to keep should go. When an item should stay, copy it to the write position and move write forward.",
          "At the end, the first write items are the ones you kept, in the same order. The rest of the list is leftover you can ignore or cut off with del nums[write:].",
          "This is exactly Practice 2 today: remove every copy of a value in place and return how many items are left."
        ],
        "example": "Tidying a bookshelf by moving each book you want to keep to the next free spot on the left. By the end, all the keepers are packed at the left and the gaps are on the right.",
        "code": "def remove_duplicates_sorted(nums):\n    if not nums:\n        return 0\n    write = 1\n    for read in range(1, len(nums)):\n        if nums[read] != nums[read - 1]:\n            nums[write] = nums[read]\n            write += 1\n    return write\n\nnums = [1, 1, 2, 3, 3, 3, 4]\nk = remove_duplicates_sorted(nums)\nprint(k, nums[:k])",
        "output": "4 [1, 2, 3, 4]",
        "codeNotes": [
          {
            "line": 4,
            "note": "write marks the next free spot for an item we keep."
          },
          {
            "line": 7,
            "note": "Keep this item: copy it to the write spot."
          }
        ],
        "tryIt": "Add del nums[k:] after line 12 and print nums. Now the list itself is exactly [1, 2, 3, 4].",
        "check": {
          "question": "What is the extra space used by the write-pointer method?",
          "options": [
            "O(N), because it copies items",
            "O(1), just two positions",
            "O(N^2)"
          ],
          "answer": 1,
          "why": "It moves items inside the same list and only keeps two numbers (read and write), so the extra space is O(1)."
        }
      },
      {
        "title": "List operations and their costs",
        "say": [
          "Knowing the cost of each list operation lets you predict how fast your code will be. Reading or changing by index, append and pop() from the end are O(1) (append is amortized O(1)).",
          "insert(0, x), pop(0) and remove(x) are O(N), because items have to shift along to close or open a gap. x in nums is O(N) because it searches.",
          "Slicing nums[a:b] makes a copy of that part, so it costs O(b - a). sorted(nums) and nums.sort() are O(N log N).",
          "When you need fast adding and removing at both ends, use collections.deque instead of a list. You will meet it on Day 6."
        ],
        "example": "A queue of people in a line: someone joining at the back is quick. Someone leaving from the front means everyone shuffles forward one step, and that takes time for a long line.",
        "code": "nums = [5, 3, 8]\nnums.append(1)\nprint(nums)\nlast = nums.pop()\nprint(last, nums)\nnums.insert(0, 9)\nprint(nums)\nfirst = nums.pop(0)\nprint(first, nums)\nprint(sorted(nums))",
        "output": "[5, 3, 8, 1]\n1 [5, 3, 8]\n[9, 5, 3, 8]\n9 [5, 3, 8]\n[3, 5, 8]",
        "codeNotes": [
          {
            "line": 2,
            "note": "append: amortized O(1)."
          },
          {
            "line": 6,
            "note": "insert at the front: O(N), everything shifts right."
          },
          {
            "line": 8,
            "note": "pop(0): O(N), everything shifts left."
          }
        ],
        "tryIt": "Replace insert(0, 9) with append(9) and pop(0) with pop(). Same values go in and out, but now every step is O(1).",
        "check": {
          "question": "Which list operation is O(N)?",
          "options": [
            "nums.append(x)",
            "nums[3] = x",
            "nums.insert(0, x)"
          ],
          "answer": 2,
          "why": "Inserting at the front shifts every item one place to the right, so it is O(N). The other two are O(1)."
        }
      },
      {
        "title": "Lists of lists and the copy trap",
        "say": [
          "Grids, boards and tables are stored as a list of lists: grid[row][col]. You will use them for dynamic programming tables on Days 25 to 27 and for boards on Day 28.",
          "There is a famous trap when you build one. [[0] * 3] * 3 looks like a 3 by 3 grid, but the outer * 3 copies the reference to the same inner list three times. Change one cell and the whole column changes.",
          "The safe way is a list comprehension: [[0] * 3 for _ in range(3)]. The comprehension runs [0] * 3 again for each row, so every row is its own separate list.",
          "This is the difference between copying a reference and copying the data. A variable holding a list is a label pointing at the list, not the list itself. Keep this in mind whenever you pass lists into functions."
        ],
        "example": "Three people given the same house key are not three houses. If one of them paints the door, everyone sees the new colour. [[0] * 3] * 3 hands out three keys to one house.",
        "code": "wrong = [[0] * 3] * 3\nwrong[0][0] = 9\nprint(wrong)\n\nright = [[0] * 3 for _ in range(3)]\nright[0][0] = 9\nprint(right)\n\nprint(wrong[0] is wrong[1], right[0] is right[1])",
        "output": "[[9, 0, 0], [9, 0, 0], [9, 0, 0]]\n[[9, 0, 0], [0, 0, 0], [0, 0, 0]]\nTrue False",
        "codeNotes": [
          {
            "line": 1,
            "note": "The same inner list three times: a trap."
          },
          {
            "line": 5,
            "note": "A new inner list for each row: safe."
          },
          {
            "line": 9,
            "note": "is checks whether two names point at the same object."
          }
        ],
        "tryIt": "Build a 2 by 4 grid of zeros the safe way and set grid[1][3] = 5. Print it to check only one cell changed.",
        "check": {
          "question": "What does [[0] * 2] * 2 create?",
          "options": [
            "Two separate rows",
            "Two references to the same row",
            "An error"
          ],
          "answer": 1,
          "why": "The outer * 2 repeats the reference to one inner list, so both rows are the same list. Use a list comprehension for separate rows."
        }
      }
    ],
    "summary": [
      "A Python list is an array: items side by side, so nums[i] is O(1).",
      "When full, the list grows by a multiple and copies everything; doubling makes append amortized O(1).",
      "Amortized cost is the average over many operations: rare expensive steps shared out.",
      "Front operations (insert(0, x), pop(0)) are O(N); end operations are O(1).",
      "A write pointer changes a list in place with O(1) extra space."
    ],
    "projectStep": {
      "title": "Add a growing array to your toolkit",
      "steps": [
        "Add the DynamicArray class from part 2 to dsa_toolkit.py, including the copies counter.",
        "Append 1,000 items and print the capacity and copies. Check that copies divided by 1,000 is below 2.",
        "Add remove_duplicates_sorted(nums) and test it on a sorted list with repeats."
      ]
    }
  },
  {
    "day": 3,
    "title": "Singly & Doubly Linked Lists & Pointer Node Manipulation",
    "goal": "You can build linked lists from nodes, walk them, reverse one in place and detect a loop with two pointers.",
    "minutes": 30,
    "recap": "Yesterday you saw how a list (array) keeps items side by side and grows by doubling, and why inserting at the front is O(N).",
    "parts": [
      {
        "title": "Nodes that point to the next node",
        "say": [
          "A linked list stores items in separate nodes. Each node holds a value and a reference to the next node. The nodes can be anywhere in memory; the references link them into a chain.",
          "In Python a node is a small class with two attributes, val and next. The last node's next is None, which marks the end. The first node is called the head, and holding the head gives you the whole list.",
          "Because nodes are not side by side, you cannot jump to item 50. You have to start at the head and follow next 50 times, so reading by position is O(N). That is the price.",
          "The reward: once you are at a node, adding or removing the node after it is O(1). You only change a couple of references. No shifting of other items."
        ],
        "example": "A treasure hunt: each clue tells you where the next clue is hidden. To reach clue 5 you must follow clues 1 to 4. But adding a new clue in the middle only means changing one note.",
        "code": "class ListNode:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\nhead = ListNode(10, ListNode(20, ListNode(30)))\n\nnode = head\nwhile node is not None:\n    print(node.val)\n    node = node.next",
        "output": "10\n20\n30",
        "codeNotes": [
          {
            "line": 4,
            "note": "next is the link to the following node, or None at the end."
          },
          {
            "line": 6,
            "note": "Three nodes chained together: 10 -> 20 -> 30."
          },
          {
            "line": 11,
            "note": "Move along the chain by following next."
          }
        ],
        "tryIt": "Put a new node with 15 between 10 and 20: head.next = ListNode(15, head.next). Run it and you should see 10, 15, 20, 30.",
        "check": {
          "question": "What does the last node of a singly linked list point to?",
          "options": [
            "The head",
            "None",
            "Itself"
          ],
          "answer": 1,
          "why": "The last node's next is None. That is how a loop over the list knows it has reached the end."
        }
      },
      {
        "title": "Walking, counting and finding",
        "say": [
          "Almost every linked list function starts the same way: set a variable to the head and move it along with node = node.next until it becomes None.",
          "To count the nodes, add 1 at each step. To find a value, compare node.val at each step and stop when it matches. Both are O(N), because in the worst case you visit every node.",
          "Always handle the empty list: head can be None. The while node loop handles it for free, because the loop simply does not run.",
          "Turning a linked list into a Python list is a handy helper for printing and testing. You will see it in almost every example this week."
        ],
        "example": "Walking down a train from the engine, coach by coach, counting coaches or looking for coach B4. You cannot skip coaches; you go through each door in turn.",
        "code": "class ListNode:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\ndef to_list(head):\n    out = []\n    while head:\n        out.append(head.val)\n        head = head.next\n    return out\n\ndef contains(head, target):\n    while head:\n        if head.val == target:\n            return True\n        head = head.next\n    return False\n\nhead = ListNode(4, ListNode(8, ListNode(15)))\nprint(to_list(head), contains(head, 8), contains(head, 99))\nprint(to_list(None))",
        "output": "[4, 8, 15] True False\n[]",
        "codeNotes": [
          {
            "line": 8,
            "note": "While there is a node, keep going."
          },
          {
            "line": 22,
            "note": "An empty list (None) just gives []."
          }
        ],
        "tryIt": "Write length(head) that counts nodes the same way and print length(head). It should print 3.",
        "check": {
          "question": "What is the Big-O of finding a value in a linked list of N nodes?",
          "options": [
            "O(1)",
            "O(log N)",
            "O(N)"
          ],
          "answer": 2,
          "why": "You may have to follow next through every node before you find it (or find it missing), so it is O(N)."
        }
      },
      {
        "title": "Reversing a list in place",
        "say": [
          "Reversing a linked list is the most famous linked list question, and it is Practice 1 today. The idea: walk the list once and turn every arrow around.",
          "You need three variables. prev is the part already reversed (it starts as None). curr is the node you are working on. Before you change curr.next, save it in nxt, or you lose the rest of the list.",
          "Each step: save nxt = curr.next, point curr.next back to prev, then move both forward: prev = curr and curr = nxt. When curr becomes None, prev is the new head.",
          "It visits each node once, so it is O(N) time, and it only uses three variables, so O(1) extra space."
        ],
        "example": "A line of people each pointing at the person in front of them. To reverse the line without anyone moving, you go along and ask each person to turn round and point at the person behind them instead.",
        "code": "class ListNode:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\ndef to_list(head):\n    out = []\n    while head:\n        out.append(head.val)\n        head = head.next\n    return out\n\ndef reverse(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n\nhead = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))\nprint(to_list(reverse(head)))",
        "output": "[4, 3, 2, 1]",
        "codeNotes": [
          {
            "line": 16,
            "note": "Save the rest of the list before changing the link."
          },
          {
            "line": 17,
            "note": "Turn this node's arrow round to point backwards."
          },
          {
            "line": 20,
            "note": "When curr is None, prev is the new first node."
          }
        ],
        "tryIt": "Remove line 16 and use curr.next in line 19 instead of nxt. Run it: you lose the list after the first node. That is why nxt matters.",
        "check": {
          "question": "Why must you save curr.next before setting curr.next = prev?",
          "options": [
            "To make the code faster",
            "Otherwise you lose the link to the rest of the list",
            "Python requires it"
          ],
          "answer": 1,
          "why": "After curr.next = prev, the old next node is no longer reachable from curr. Saving it in nxt keeps the rest of the list."
        }
      },
      {
        "title": "Fast and slow pointers",
        "say": [
          "Some linked lists are broken: the last node points back to an earlier node, so walking the list never ends. Practice 2 asks you to detect this cycle using O(1) memory.",
          "Floyd's algorithm uses two pointers. slow moves one node at a time; fast moves two. If there is no cycle, fast reaches the end (None) and you return False.",
          "If there is a cycle, fast goes round the loop and catches slow from behind, like a faster runner lapping a slower one on a track. When they are the same node (slow is fast), there is a cycle.",
          "Fast and slow pointers also find the middle of a list: when fast reaches the end, slow is halfway. It is one of the most reused tricks in this course."
        ],
        "example": "Two friends jogging on a circular track, one twice as fast. The fast friend will always catch up with the slow one from behind. On a straight road with an end, the fast friend just reaches the end.",
        "code": "class ListNode:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\ndef has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False\n\na, b, c = ListNode(1), ListNode(2), ListNode(3)\na.next, b.next = b, c\nprint(has_cycle(a))\nc.next = a\nprint(has_cycle(a))",
        "output": "False\nTrue",
        "codeNotes": [
          {
            "line": 8,
            "note": "Stop when fast falls off the end: no cycle."
          },
          {
            "line": 10,
            "note": "fast jumps two nodes each step."
          },
          {
            "line": 11,
            "note": "Same node object: they met inside the loop."
          }
        ],
        "tryIt": "Make the loop point to b instead: c.next = b. The answer is still True; the cycle can start anywhere.",
        "check": {
          "question": "In Floyd's cycle detection, how fast does the fast pointer move?",
          "options": [
            "One node per step",
            "Two nodes per step",
            "It jumps to the end"
          ],
          "answer": 1,
          "why": "fast moves two nodes per step and slow moves one, so inside a loop fast gains one node each step and must meet slow."
        }
      },
      {
        "title": "Doubly linked lists and when to use linked lists",
        "say": [
          "In a doubly linked list each node has two links: next and prev. You can walk both ways, and you can remove a node in O(1) if you already hold it, because you can reach its neighbours on both sides.",
          "That O(1) removal is exactly what an LRU cache needs, and you will build one on Day 5 with a doubly linked list plus a dict.",
          "A common trick is to add dummy nodes called sentinels at both ends. With a dummy head and a dummy tail, every real node always has a node before and after it, so you never need special cases for the first or last node.",
          "Use a Python list when you mostly read by position and add at the end. Use a linked list when you add and remove in the middle a lot and already hold the node you want to change."
        ],
        "example": "A music playlist with Previous and Next buttons is a doubly linked list: from any song you can go either way, and removing a song only means joining its neighbours together.",
        "code": "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.prev = None\n        self.next = None\n\nhead, tail = Node(\"HEAD\"), Node(\"TAIL\")\nhead.next, tail.prev = tail, head\n\ndef add_before_tail(node):\n    node.prev, node.next = tail.prev, tail\n    tail.prev.next = node\n    tail.prev = node\n\ndef remove(node):\n    node.prev.next = node.next\n    node.next.prev = node.prev\n\nsongs = [Node(name) for name in [\"Kesariya\", \"Naatu Naatu\", \"Jhoome Jo Pathaan\"]]\nfor s in songs:\n    add_before_tail(s)\nremove(songs[1])\nnode = head.next\nwhile node is not tail:\n    print(node.val)\n    node = node.next",
        "output": "Kesariya\nJhoome Jo Pathaan",
        "codeNotes": [
          {
            "line": 7,
            "note": "Two sentinel nodes: the list is never really empty."
          },
          {
            "line": 16,
            "note": "Removing only joins the neighbours: O(1)."
          }
        ],
        "tryIt": "Remove songs[0] as well and run it. Only one song is left, and remove() needed no special case for the first node.",
        "check": {
          "question": "What is the main advantage of sentinel (dummy) head and tail nodes?",
          "options": [
            "They store extra data",
            "Every real node always has neighbours, so no special cases",
            "They make lists sorted"
          ],
          "answer": 1,
          "why": "With a dummy head and tail, adding or removing the first or last real node works exactly like any other node."
        }
      },
      {
        "title": "Deleting nodes with a dummy head",
        "say": [
          "To delete a node from a singly linked list, you change the link of the node before it: before.next = before.next.next. The deleted node is skipped and Python frees it later.",
          "The awkward case is deleting the head itself, because there is no node before it. Beginners write a special if for it, and that is where bugs creep in.",
          "The clean trick is a dummy node placed in front of the head. Now every real node, including the first, has a node before it. At the end, return dummy.next as the new head.",
          "You will use a dummy head again on Day 12 when you merge two sorted lists. Whenever the head might change, reach for a dummy node."
        ],
        "example": "Taking one person out of a line by asking the person in front of them to hold hands with the person behind them instead. The dummy node is a volunteer standing at the very front, so even the first person has someone in front of them.",
        "code": "class ListNode:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\ndef to_list(head):\n    out = []\n    while head:\n        out.append(head.val)\n        head = head.next\n    return out\n\ndef delete_all(head, target):\n    dummy = ListNode(0, head)\n    before = dummy\n    while before.next:\n        if before.next.val == target:\n            before.next = before.next.next\n        else:\n            before = before.next\n    return dummy.next\n\nhead = ListNode(7, ListNode(7, ListNode(3, ListNode(7, ListNode(5)))))\nprint(to_list(delete_all(head, 7)))",
        "output": "[3, 5]",
        "codeNotes": [
          {
            "line": 14,
            "note": "The dummy stands in front of the real head."
          },
          {
            "line": 18,
            "note": "Skip the node: link past it."
          },
          {
            "line": 21,
            "note": "The real head may have changed, so return dummy.next."
          }
        ],
        "tryIt": "Delete 5 instead of 7 and run it. Then delete 9, which is not in the list: nothing changes.",
        "check": {
          "question": "Why do we return dummy.next instead of head?",
          "options": [
            "dummy.next is faster",
            "The original head may have been deleted",
            "head is always None"
          ],
          "answer": 1,
          "why": "If the first node was deleted, head points at a removed node. dummy.next is always the true first node of the list."
        }
      }
    ],
    "summary": [
      "A linked list is a chain of nodes; each node has a value and a link to the next (and the previous, if doubly linked).",
      "Reading by position is O(N), but adding or removing next to a node you hold is O(1).",
      "Reverse a list with prev, curr and nxt: O(N) time, O(1) space.",
      "Fast and slow pointers detect cycles (and find the middle) with O(1) memory.",
      "Sentinel nodes remove the special cases at the ends of a doubly linked list."
    ],
    "projectStep": {
      "title": "Linked list tools",
      "steps": [
        "Add ListNode, to_list(head) and reverse(head) to dsa_toolkit.py.",
        "Add has_cycle(head) and test it on a list with and without a loop.",
        "Bonus: write middle(head) with fast and slow pointers and test it on lists of 5 and 6 nodes."
      ]
    }
  },
  {
    "day": 4,
    "title": "Stacks (LIFO): Valid Parentheses & Monotonic Next Greater Element",
    "goal": "You can use a Python list as a stack, check brackets with it, and solve \"next greater element\" problems with a monotonic stack.",
    "minutes": 30,
    "recap": "Yesterday you built linked lists, reversed one in place and caught loops with fast and slow pointers.",
    "parts": [
      {
        "title": "A stack: last in, first out",
        "say": [
          "A stack is a pile where you only add and remove at the top. The last item you put in is the first one to come out. This is called LIFO: last in, first out.",
          "A Python list is a perfect stack. append(x) puts x on top and pop() takes the top item off. Both are O(1). To look at the top without removing it, use stack[-1].",
          "Before calling pop() or stack[-1], check the stack is not empty, or Python raises an IndexError. if stack: is True when the stack has items.",
          "Stacks appear everywhere: the Undo button, the Back button in a browser, and even the way Python runs functions (the call stack, which you will meet on Day 11)."
        ],
        "example": "A stack of plates in a canteen: clean plates go on top, and the next person takes the top one. Nobody pulls a plate from the bottom.",
        "code": "stack = []\nstack.append(\"open file\")\nstack.append(\"type hello\")\nstack.append(\"make bold\")\nprint(\"top:\", stack[-1])\nprint(\"undo:\", stack.pop())\nprint(\"undo:\", stack.pop())\nprint(\"left:\", stack)\nprint(\"empty?\", not stack)",
        "output": "top: make bold\nundo: make bold\nundo: type hello\nleft: ['open file']\nempty? False",
        "codeNotes": [
          {
            "line": 2,
            "note": "append puts an item on top."
          },
          {
            "line": 6,
            "note": "pop removes the most recent item: last in, first out."
          }
        ],
        "tryIt": "Add one more stack.pop() and then print(not stack). The stack is empty, so it prints True. Now try one more pop() and read the error.",
        "check": {
          "question": "You push A, then B, then C onto a stack. What does pop() return?",
          "options": [
            "A",
            "B",
            "C"
          ],
          "answer": 2,
          "why": "C went in last, so it comes out first. Last in, first out."
        }
      },
      {
        "title": "Matching brackets with a stack",
        "say": [
          "Practice 1 asks: is a string of brackets valid? Every (, [ and { must be closed by the matching bracket, in the right order. \"([])\" is valid; \"([)]\" is not.",
          "The rule \"the most recent unclosed bracket must be closed first\" is exactly last in, first out. So push each opening bracket onto a stack.",
          "When you see a closing bracket, the stack's top must be its matching opener. If the stack is empty, or the top does not match, the string is invalid. If it matches, pop it.",
          "At the end the stack must be empty. Something left on the stack means a bracket was opened but never closed. A dict like {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"} makes matching easy."
        ],
        "example": "Russian dolls: you must close the smallest doll before the bigger one around it. The doll you opened last is the one you must close first.",
        "code": "def is_valid(s):\n    pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    stack = []\n    for ch in s:\n        if ch in \"([{\":\n            stack.append(ch)\n        elif not stack or stack.pop() != pairs[ch]:\n            return False\n    return not stack\n\nfor s in [\"([])\", \"([)]\", \"((\", \"{[]()}\"]:\n    print(s, is_valid(s))",
        "output": "([]) True\n([)] False\n(( False\n{[]()} True",
        "codeNotes": [
          {
            "line": 6,
            "note": "Opening bracket: remember it on the stack."
          },
          {
            "line": 7,
            "note": "Closing bracket: the top must be its partner."
          },
          {
            "line": 9,
            "note": "Anything left over was never closed."
          }
        ],
        "tryIt": "Add \"\" (an empty string) to the list. With nothing to match it is valid, so it prints True.",
        "check": {
          "question": "Why is \"((\" invalid even though no bracket is wrongly matched?",
          "options": [
            "It is too short",
            "The stack is not empty at the end",
            "Round brackets need a square one"
          ],
          "answer": 1,
          "why": "Two brackets were opened and never closed, so they are still on the stack at the end. The string is only valid when the stack ends empty."
        }
      },
      {
        "title": "The next greater element",
        "say": [
          "Practice 2: for each number in a list, find the first number to its right that is bigger. If there is none, the answer is -1. For [2, 1, 2, 4, 3] the answer is [4, 2, 4, -1, -1].",
          "The simple way checks every later number for every number: O(N^2). A stack does it in O(N).",
          "Walk left to right and keep a stack of positions that are still waiting for their bigger number. When the current number is bigger than the number at the top position, the top has found its answer: pop it and record the current number.",
          "Keep popping while the current number beats the top, then push the current position. Each position is pushed once and popped at most once, so the whole thing is O(N)."
        ],
        "example": "People waiting in a queue to see over a wall. Each new, taller person who arrives is the \"next taller\" for everyone shorter still waiting in front of them, and those people can stop waiting.",
        "code": "def next_greater(nums):\n    result = [-1] * len(nums)\n    waiting = []\n    for i, x in enumerate(nums):\n        while waiting and nums[waiting[-1]] < x:\n            result[waiting.pop()] = x\n        waiting.append(i)\n    return result\n\nprint(next_greater([2, 1, 2, 4, 3]))\nprint(next_greater([5, 4, 3]))",
        "output": "[4, 2, 4, -1, -1]\n[-1, -1, -1]",
        "codeNotes": [
          {
            "line": 3,
            "note": "Positions still waiting for a bigger number."
          },
          {
            "line": 5,
            "note": "The current number answers every smaller waiting number."
          },
          {
            "line": 7,
            "note": "Now this position waits too."
          }
        ],
        "tryIt": "Try next_greater([1, 3, 2, 5]). Predict first: [3, 5, 5, -1].",
        "check": {
          "question": "Why is the stack version O(N) even though it has a while loop inside a for loop?",
          "options": [
            "Python loops are fast",
            "Each position is pushed once and popped at most once",
            "The while loop runs once per number"
          ],
          "answer": 1,
          "why": "Across the whole run there are N pushes and at most N pops, so the total work is O(N), not N x N."
        }
      },
      {
        "title": "What \"monotonic\" means",
        "say": [
          "In the next greater solution, the numbers at the waiting positions always go down from bottom to top. A stack that stays in one order like this is called a monotonic stack.",
          "We keep it decreasing by popping anything smaller than the new number before pushing it. The popped items are exactly the ones whose question (\"who is bigger than me?\") has just been answered.",
          "Monotonic stacks solve a whole family of problems: next greater, next smaller, daily temperatures (how many days until a warmer day), and stock span.",
          "For \"next smaller\", flip the comparison: pop while the top is bigger than the current number. The pattern stays the same."
        ],
        "example": "Daily temperatures: for each day, how many days until it gets warmer? A cooler day stays in the stack until a warmer one arrives and answers it.",
        "code": "def days_until_warmer(temps):\n    answer = [0] * len(temps)\n    stack = []\n    for day, t in enumerate(temps):\n        while stack and temps[stack[-1]] < t:\n            cold_day = stack.pop()\n            answer[cold_day] = day - cold_day\n        stack.append(day)\n    return answer\n\nprint(days_until_warmer([30, 31, 29, 28, 33, 32]))",
        "output": "[1, 3, 2, 1, 0, 0]",
        "codeNotes": [
          {
            "line": 7,
            "note": "Instead of the warmer value, store how many days later it came."
          }
        ],
        "tryIt": "Change the comparison on line 5 to > and read the result: now it counts days until a cooler day.",
        "check": {
          "question": "In a decreasing monotonic stack, what do you do before pushing a new, larger number?",
          "options": [
            "Push it anyway",
            "Pop every smaller number from the top",
            "Clear the whole stack"
          ],
          "answer": 1,
          "why": "Pop the smaller numbers first; each of them has just found its next greater number. Then push the new one, keeping the stack decreasing."
        }
      },
      {
        "title": "A min stack: O(1) minimum",
        "say": [
          "A common interview extension: build a stack that can also tell you its smallest value in O(1), even after pops.",
          "Keep a second stack alongside. Every time you push, also push the smaller of the new value and the current minimum onto the min stack. Every time you pop, pop both.",
          "The top of the min stack is always the minimum of everything currently in the main stack. When you pop, the older minimum comes back automatically.",
          "This is the \"trade memory for speed\" idea again: O(N) extra space to make get_min O(1) instead of O(N)."
        ],
        "example": "Writing your lowest exam mark so far next to each new mark in a notebook. If you tear off the last page, the page before still shows the lowest mark up to that point.",
        "code": "class MinStack:\n    def __init__(self):\n        self.items = []\n        self.mins = []\n\n    def push(self, x):\n        self.items.append(x)\n        self.mins.append(x if not self.mins else min(x, self.mins[-1]))\n\n    def pop(self):\n        self.mins.pop()\n        return self.items.pop()\n\n    def get_min(self):\n        return self.mins[-1]\n\ns = MinStack()\nfor x in [5, 3, 7, 2]:\n    s.push(x)\nprint(s.get_min())\ns.pop()\nprint(s.get_min())",
        "output": "2\n3",
        "codeNotes": [
          {
            "line": 8,
            "note": "Remember the minimum at this height of the stack."
          },
          {
            "line": 22,
            "note": "After popping 2, the minimum goes back to 3 automatically."
          }
        ],
        "tryIt": "Push 1 and then print get_min(). Then pop twice and print it again. Predict each answer before running.",
        "check": {
          "question": "What is the time cost of get_min() in this MinStack?",
          "options": [
            "O(1)",
            "O(N)",
            "O(log N)"
          ],
          "answer": 0,
          "why": "It only reads the top of the mins stack, which is always the current minimum. One step: O(1)."
        }
      },
      {
        "title": "A calculator built on a stack",
        "say": [
          "Stacks can evaluate maths. In reverse Polish notation the operator comes after its two numbers: \"3 4 +\" means 3 + 4. There are no brackets, and a stack evaluates it in one pass.",
          "Read the tokens left to right. A number goes on the stack. An operator pops the top two numbers, applies itself, and pushes the result back. At the end, the one number left is the answer.",
          "Order matters when you pop: the first pop is the right-hand number and the second pop is the left-hand one. For \"10 2 -\", you pop 2, then 10, and compute 10 - 2.",
          "Calculators, compilers and spreadsheet engines use stacks like this inside. The same last in, first out idea from the bracket checker is doing real arithmetic here."
        ],
        "example": "Adding up a shopping bill on paper: you write numbers down, and each time you reach a \"+\" you combine the last two numbers you wrote into one.",
        "code": "def eval_rpn(tokens):\n    stack = []\n    for t in tokens:\n        if t in \"+-*/\":\n            right = stack.pop()\n            left = stack.pop()\n            if t == \"+\": stack.append(left + right)\n            elif t == \"-\": stack.append(left - right)\n            elif t == \"*\": stack.append(left * right)\n            else: stack.append(int(left / right))\n        else:\n            stack.append(int(t))\n    return stack[0]\n\nprint(eval_rpn(\"3 4 +\".split()))\nprint(eval_rpn(\"10 2 -\".split()))\nprint(eval_rpn(\"2 3 4 * +\".split()))",
        "output": "7\n8\n14",
        "codeNotes": [
          {
            "line": 5,
            "note": "The first pop is the right-hand number."
          },
          {
            "line": 12,
            "note": "Numbers wait on the stack until an operator needs them."
          }
        ],
        "tryIt": "Work out \"5 1 2 + 4 * + 3 -\" on paper first (the answer is 14), then run it to check.",
        "check": {
          "question": "What does \"6 3 /\" evaluate to in reverse Polish notation?",
          "options": [
            "0",
            "2",
            "0.5"
          ],
          "answer": 1,
          "why": "Pop 3 (right), then 6 (left), and compute 6 / 3 = 2. The order of the pops decides which number is on which side."
        }
      }
    ],
    "summary": [
      "A stack is last in, first out; in Python use append() and pop() on a list, both O(1).",
      "Check a stack is not empty before pop() or stack[-1].",
      "Bracket matching: push openers, match and pop on closers, and the stack must end empty.",
      "A monotonic stack solves next greater / next smaller problems in O(N).",
      "A second stack of minimums gives O(1) get_min."
    ],
    "projectStep": {
      "title": "Stack tools",
      "steps": [
        "Add is_valid(s) and next_greater(nums) to dsa_toolkit.py.",
        "Add the MinStack class and test push, pop and get_min.",
        "Bonus: write days_until_warmer(temps) for a week of your city's real temperatures."
      ]
    }
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Production LRU Cache Engine (Doubly Linked List + Hash Map)",
    "goal": "You can build an LRU cache with get and put in O(1), first with a dict plus a doubly linked list, then with OrderedDict.",
    "minutes": 30,
    "recap": "This week you learned Big-O, dynamic arrays, linked lists and stacks. Today you combine a dict and a doubly linked list into your first real engineering component.",
    "parts": [
      {
        "title": "What a cache is and why it needs a limit",
        "say": [
          "A cache keeps recent answers close by so you do not have to fetch them again. Your browser caches images, apps cache API results, and databases cache pages of data. Reading from a cache can be a thousand times faster than the original source.",
          "Memory is limited, so a cache has a capacity. When it is full and a new item arrives, something must be thrown out. The rule for choosing what to throw out is called the eviction policy.",
          "LRU means least recently used: throw out the item nobody has touched for the longest time. The idea is that things used recently are likely to be used again soon.",
          "The challenge in Practice 1 is to make both get(key) and put(key, value) O(1). That needs two data structures working together."
        ],
        "example": "A small fridge at home: when it is full and you bring new vegetables, you take out whatever has been sitting untouched the longest. The things you used yesterday stay.",
        "code": "from collections import OrderedDict\n\ncache = OrderedDict()\ncapacity = 2\n\ndef put(key, value):\n    cache[key] = value\n    cache.move_to_end(key)\n    if len(cache) > capacity:\n        old_key, _ = cache.popitem(last=False)\n        print(\"evicted\", old_key)\n\nput(\"home\", \"<html>home</html>\")\nput(\"about\", \"<html>about</html>\")\nput(\"contact\", \"<html>contact</html>\")\nprint(list(cache))",
        "output": "evicted home\n['about', 'contact']",
        "codeNotes": [
          {
            "line": 8,
            "note": "The most recently used key moves to the end."
          },
          {
            "line": 10,
            "note": "The first key is the least recently used: evict it."
          }
        ],
        "tryIt": "Before the third put, read the \"home\" page with cache.move_to_end(\"home\"). Run it again: now \"about\" is evicted instead, because home was used more recently.",
        "check": {
          "question": "In an LRU cache that is full, which item is removed when a new one arrives?",
          "options": [
            "The newest item",
            "The item used longest ago",
            "A random item"
          ],
          "answer": 1,
          "why": "LRU evicts the least recently used item: the one nobody has read or written for the longest time."
        }
      },
      {
        "title": "Two structures, two jobs",
        "say": [
          "To get O(1) for everything we split the work. A dict maps each key to its node, so finding any key is O(1). That handles \"where is it?\".",
          "A doubly linked list keeps the order of use. The most recently used node sits right after a dummy head; the least recently used sits right before a dummy tail. That handles \"what is oldest?\".",
          "On get(key): look the node up in the dict, move it to the front of the list, return its value. On put: update or create the node, move it to the front, and if there are too many, remove the node before the tail and delete its key from the dict.",
          "Moving a node is just \"remove it\" plus \"add it after head\". With a doubly linked list both are O(1), as you saw on Day 3."
        ],
        "example": "A library with a catalogue card for every book (the dict: find any book instantly) and a returns trolley in order of use (the list: the oldest is always at one end).",
        "code": "class Node:\n    def __init__(self, key=0, value=0):\n        self.key, self.value = key, value\n        self.prev = self.next = None\n\nhead, tail = Node(), Node()\nhead.next, tail.prev = tail, head\nnodes = {}\n\ndef add_front(node):\n    node.prev, node.next = head, head.next\n    head.next.prev = node\n    head.next = node\n\nfor key in [\"a\", \"b\", \"c\"]:\n    nodes[key] = Node(key, key.upper())\n    add_front(nodes[key])\n\norder, node = [], head.next\nwhile node is not tail:\n    order.append(node.key)\n    node = node.next\nprint(\"newest to oldest:\", order)\nprint(\"find b in O(1):\", nodes[\"b\"].value)",
        "output": "newest to oldest: ['c', 'b', 'a']\nfind b in O(1): B",
        "codeNotes": [
          {
            "line": 8,
            "note": "The dict: key -> node, for O(1) lookup."
          },
          {
            "line": 10,
            "note": "Newest nodes go straight after the dummy head."
          }
        ],
        "tryIt": "Add a fourth key \"d\" to the loop. It appears first in the order, and \"a\" is now the oldest, just before the tail.",
        "check": {
          "question": "In the dict + doubly linked list design, what does the dict store?",
          "options": [
            "The order of use",
            "Each key mapped to its node",
            "Only the oldest key"
          ],
          "answer": 1,
          "why": "The dict maps each key to its node so any key can be found in O(1). The linked list is what keeps the order of use."
        }
      },
      {
        "title": "Building get and put",
        "say": [
          "Now we put it all into one class. The helpers _remove(node) and _add_front(node) do the pointer work; get and put only call them.",
          "get: if the key is missing return -1. Otherwise take the node out of its place and add it at the front, because reading it made it the most recently used, then return its value.",
          "put: if the key exists, remove its old node first. Then make a fresh node, add it at the front and store it in the dict. If the dict now has more keys than capacity, the victim is tail.prev: remove it from the list and delete its key from the dict.",
          "This is why the node stores its key as well as its value: when you evict a node from the list, you need its key to delete it from the dict."
        ],
        "example": "A barista with a counter for 3 cups. Every time a customer picks up or orders a drink, that cup moves to the front. When a 4th order arrives, the cup at the back, untouched longest, is cleared away.",
        "code": "class Node:\n    def __init__(self, key=0, value=0):\n        self.key, self.value = key, value\n        self.prev = self.next = None\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.map = {}\n        self.head, self.tail = Node(), Node()\n        self.head.next, self.tail.prev = self.tail, self.head\n\n    def _remove(self, node):\n        node.prev.next, node.next.prev = node.next, node.prev\n\n    def _add_front(self, node):\n        node.prev, node.next = self.head, self.head.next\n        self.head.next.prev = node\n        self.head.next = node\n\n    def get(self, key):\n        if key not in self.map:\n            return -1\n        node = self.map[key]\n        self._remove(node)\n        self._add_front(node)\n        return node.value\n\n    def put(self, key, value):\n        if key in self.map:\n            self._remove(self.map[key])\n        node = Node(key, value)\n        self._add_front(node)\n        self.map[key] = node\n        if len(self.map) > self.capacity:\n            lru = self.tail.prev\n            self._remove(lru)\n            del self.map[lru.key]\n\ncache = LRUCache(2)\ncache.put(1, \"one\")\ncache.put(2, \"two\")\nprint(cache.get(1))\ncache.put(3, \"three\")\nprint(cache.get(2), cache.get(3), cache.get(1))",
        "output": "one\n-1 three one",
        "codeNotes": [
          {
            "line": 26,
            "note": "Reading a key makes it the most recently used."
          },
          {
            "line": 36,
            "note": "The node before the tail is the least recently used."
          },
          {
            "line": 38,
            "note": "The node remembers its key so we can delete it from the dict."
          }
        ],
        "tryIt": "Change the capacity to 3 and run it again. Now nothing is evicted, and get(2) returns \"two\".",
        "check": {
          "question": "After put(1), put(2), get(1), put(3) on a capacity-2 LRU cache, which key was evicted?",
          "options": [
            "1",
            "2",
            "3"
          ],
          "answer": 1,
          "why": "get(1) made key 1 recent, so key 2 was the least recently used when key 3 arrived. get(2) returns -1."
        }
      },
      {
        "title": "The OrderedDict shortcut",
        "say": [
          "Python's collections.OrderedDict is a dict that remembers the order of keys, and it has move_to_end(key) and popitem(last=False). Inside, it is a dict plus a doubly linked list: the same design you just built.",
          "So an LRU cache in real Python code is often only a dozen lines: move_to_end on every get and put, and popitem(last=False) when there are too many keys.",
          "You also get functools.lru_cache, a decorator that caches a function's results with LRU eviction. @lru_cache(maxsize=128) on a slow function can make repeated calls instant.",
          "Knowing how to build it by hand is what interviews test; knowing the library tools is what you use at work. Now you know both."
        ],
        "example": "Building a table yourself teaches you how joints work; buying a ready-made table is what you do when you just need a table. OrderedDict is the ready-made table built the same way.",
        "code": "from collections import OrderedDict\nfrom functools import lru_cache\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.items = OrderedDict()\n\n    def get(self, key):\n        if key not in self.items:\n            return -1\n        self.items.move_to_end(key)\n        return self.items[key]\n\n    def put(self, key, value):\n        self.items[key] = value\n        self.items.move_to_end(key)\n        if len(self.items) > self.capacity:\n            self.items.popitem(last=False)\n\nc = LRUCache(2)\nc.put(\"x\", 1); c.put(\"y\", 2); c.get(\"x\"); c.put(\"z\", 3)\nprint(list(c.items))\n\ncalls = 0\n@lru_cache(maxsize=100)\ndef slow_square(n):\n    global calls\n    calls += 1\n    return n * n\n\nprint(slow_square(12), slow_square(12), \"real calls:\", calls)",
        "output": "['x', 'z']\n144 144 real calls: 1",
        "codeNotes": [
          {
            "line": 12,
            "note": "move_to_end marks the key as most recently used."
          },
          {
            "line": 19,
            "note": "last=False removes the oldest key."
          },
          {
            "line": 26,
            "note": "lru_cache remembers results of this function."
          }
        ],
        "tryIt": "Call slow_square(13) as well and print calls again. It becomes 2: the second 12 came from the cache.",
        "check": {
          "question": "What does OrderedDict.popitem(last=False) remove?",
          "options": [
            "The newest key",
            "The oldest key",
            "A random key"
          ],
          "answer": 1,
          "why": "last=False removes from the front, the key that was added or moved to the end longest ago, which is exactly the LRU victim."
        }
      },
      {
        "title": "Testing your cache like an engineer",
        "say": [
          "Practice 2 replays a list of operations and collects the results of every get. This is how engineers test a cache: a sequence of puts and gets with known answers.",
          "Good tests cover the edge cases: reading a missing key (-1), updating an existing key (it should not be evicted and should become recent), and capacity 1 (every new key evicts the previous one).",
          "Write the expected results by hand first, before running. If you cannot predict the answer, you do not yet fully understand the eviction rule.",
          "This milestone ties together Big-O (O(1) operations), linked lists (O(1) removal) and hash maps (O(1) lookup). It is a real interview question at many product companies."
        ],
        "example": "A pilot runs through a checklist before every flight, even though the plane worked yesterday. Replaying a known list of operations is the checklist for your data structure.",
        "code": "from collections import OrderedDict\n\ndef run_ops(capacity, ops):\n    cache, results = OrderedDict(), []\n    for op in ops:\n        if op[0] == \"put\":\n            _, key, value = op\n            cache[key] = value\n            cache.move_to_end(key)\n            if len(cache) > capacity:\n                cache.popitem(last=False)\n        else:\n            key = op[1]\n            if key in cache:\n                cache.move_to_end(key)\n                results.append(cache[key])\n            else:\n                results.append(-1)\n    return results\n\nops = [(\"put\", 1, 1), (\"put\", 2, 2), (\"get\", 1), (\"put\", 3, 3), (\"get\", 2), (\"put\", 1, 10), (\"get\", 1)]\nprint(run_ops(2, ops))\nprint(run_ops(1, [(\"put\", \"a\", 1), (\"put\", \"b\", 2), (\"get\", \"a\"), (\"get\", \"b\")]))",
        "output": "[1, -1, 10]\n[-1, 2]",
        "codeNotes": [
          {
            "line": 16,
            "note": "Every get result is recorded, including -1 for misses."
          },
          {
            "line": 21,
            "note": "Updating key 1 keeps it and makes it recent."
          }
        ],
        "tryIt": "Before running, write the two expected lists as a comment. Then run and compare. Did you predict [1, -1, 10] and [-1, 2]?",
        "check": {
          "question": "In a capacity-1 LRU cache, you put \"a\" then put \"b\". What does get(\"a\") return?",
          "options": [
            "The value of a",
            "-1",
            "The value of b"
          ],
          "answer": 1,
          "why": "Capacity 1 means putting \"b\" evicts \"a\", so get(\"a\") is a miss and returns -1."
        }
      },
      {
        "title": "Measuring a cache: hit rate",
        "say": [
          "A cache is only worth having if it is used. The key measure is the hit rate: the share of requests answered from the cache, hits divided by all requests.",
          "A hit rate of 90 percent means only one request in ten goes to the slow source. That can turn a slow app into a fast one without buying any new servers.",
          "Capacity changes the hit rate. Too small, and useful items are evicted before they are used again. Bigger is better up to a point, then you are only paying for memory that is rarely used.",
          "Engineers replay real traffic through caches of different sizes and pick the smallest capacity that gives a good hit rate. You are about to do a tiny version of that experiment."
        ],
        "example": "A tea stall that keeps 5 flasks ready: if customers mostly order the same 5 teas, almost everyone is served at once (a high hit rate). If they order 20 different teas, most people wait for a fresh brew.",
        "code": "from collections import OrderedDict\n\ndef hit_rate(capacity, requests):\n    cache, hits = OrderedDict(), 0\n    for key in requests:\n        if key in cache:\n            hits += 1\n            cache.move_to_end(key)\n        else:\n            cache[key] = True\n            if len(cache) > capacity:\n                cache.popitem(last=False)\n    return round(hits / len(requests) * 100, 1)\n\npages = [\"home\", \"shop\", \"home\", \"cart\", \"home\", \"shop\", \"help\", \"home\", \"shop\", \"cart\"]\nfor capacity in [1, 2, 3, 4]:\n    print(\"capacity\", capacity, \"hit rate\", hit_rate(capacity, pages), \"%\")",
        "output": "capacity 1 hit rate 0.0 %\ncapacity 2 hit rate 20.0 %\ncapacity 3 hit rate 50.0 %\ncapacity 4 hit rate 60.0 %",
        "codeNotes": [
          {
            "line": 7,
            "note": "Found in the cache: a hit."
          },
          {
            "line": 13,
            "note": "Hits as a percentage of all requests."
          }
        ],
        "tryIt": "Add capacity 5 to the list. The hit rate stays the same as capacity 4, because there are only 4 different pages: more memory no longer helps.",
        "check": {
          "question": "A cache answered 45 of 60 requests. What is its hit rate?",
          "options": [
            "45%",
            "75%",
            "25%"
          ],
          "answer": 1,
          "why": "Hit rate is hits divided by all requests: 45 / 60 = 0.75, which is 75 percent."
        }
      }
    ],
    "summary": [
      "A cache stores recent results; LRU evicts the least recently used item when full.",
      "O(1) get and put need a dict (key -> node) plus a doubly linked list (order of use).",
      "Nodes store their key so the evicted node can be deleted from the dict.",
      "OrderedDict gives the same design ready-made: move_to_end and popitem(last=False).",
      "Test a cache with a replayed list of operations and hand-predicted results."
    ],
    "projectStep": {
      "title": "Milestone 1: LRU cache",
      "steps": [
        "Add your hand-built LRUCache class (dict + doubly linked list) to dsa_toolkit.py.",
        "Write run_ops(capacity, ops) and test it with at least three operation lists, including capacity 1 and updating an existing key.",
        "Bonus: use @lru_cache on a function that computes the n-th Fibonacci number recursively and time fib(35) with and without it."
      ]
    }
  },
  {
    "day": 6,
    "title": "Queues (FIFO), Circular Ring Buffers & Deques",
    "goal": "You can use queues and deques in Python, build a fixed-size ring buffer, and turn a queue into a stack.",
    "minutes": 30,
    "recap": "Last week you built linked lists, stacks and an LRU cache. Stacks are last in, first out; today you meet their opposite.",
    "parts": [
      {
        "title": "A queue: first in, first out",
        "say": [
          "A queue is a line where items join at the back and leave from the front. The first item in is the first item out: FIFO. Printers, customer support tickets and messages between servers all wait in queues.",
          "You could use a Python list, with append to join and pop(0) to leave. But pop(0) shifts every other item forward, so it is O(N). With a long queue that becomes slow.",
          "collections.deque is built for this. append adds at the back and popleft removes from the front, both O(1). Use deque whenever you need a queue in Python.",
          "The name deque means double-ended queue: it is fast at both ends. You will use it on Day 16 for tree level order and on Day 20 for graph search."
        ],
        "example": "The token queue at a bank: the person who took token 1 is served first, and new customers take the next token and wait at the back.",
        "code": "from collections import deque\n\ntickets = deque()\ntickets.append(\"T101 login problem\")\ntickets.append(\"T102 refund\")\ntickets.append(\"T103 password reset\")\nprint(\"serving:\", tickets.popleft())\nprint(\"serving:\", tickets.popleft())\nprint(\"still waiting:\", list(tickets))\nprint(\"next up:\", tickets[0])",
        "output": "serving: T101 login problem\nserving: T102 refund\nstill waiting: ['T103 password reset']\nnext up: T103 password reset",
        "codeNotes": [
          {
            "line": 4,
            "note": "Join the queue at the back."
          },
          {
            "line": 7,
            "note": "popleft takes from the front: first in, first out."
          },
          {
            "line": 10,
            "note": "Look at the front without removing it."
          }
        ],
        "tryIt": "Add a fourth ticket after the two popleft calls. It joins behind T103, so T103 is still next up.",
        "check": {
          "question": "You add A, B and C to a queue. Which comes out first?",
          "options": [
            "C",
            "A",
            "B"
          ],
          "answer": 1,
          "why": "A queue is first in, first out, so A, which joined first, leaves first."
        }
      },
      {
        "title": "Why deque beats a list for queues",
        "say": [
          "A list keeps its items side by side starting at position 0. Removing the front item means every other item moves one place left, which is N moves.",
          "A deque is built from linked blocks, so it can remove from the front by changing where the front starts, with no shifting. That is why popleft is O(1).",
          "The trade-off: reading an item in the middle of a deque by index is slower than in a list. Deques are for the ends; lists are for jumping to any position.",
          "The code below counts how many moves each approach needs for the same queue work. The numbers make the Big-O difference easy to see."
        ],
        "example": "Shifting every chair in a cinema row one seat left whenever the first person leaves, compared with just moving a \"row starts here\" sign one seat along.",
        "code": "def list_queue_moves(n):\n    moves = 0\n    size = n\n    while size > 0:\n        moves += size - 1\n        size -= 1\n    return moves\n\ndef deque_queue_moves(n):\n    return 0\n\nfor n in [10, 1000, 100000]:\n    print(n, \"items: list shifts\", list_queue_moves(n), \"| deque shifts\", deque_queue_moves(n))",
        "output": "10 items: list shifts 45 | deque shifts 0\n1000 items: list shifts 499500 | deque shifts 0\n100000 items: list shifts 4999950000 | deque shifts 0",
        "codeNotes": [
          {
            "line": 5,
            "note": "Each pop(0) shifts all the items behind the front one."
          },
          {
            "line": 10,
            "note": "popleft never shifts items."
          }
        ],
        "tryIt": "Work out list_queue_moves(4) by hand: 3 + 2 + 1 + 0 = 6. Add 4 to the list on line 12 to check.",
        "check": {
          "question": "What is the cost of removing the front item from a Python list with pop(0)?",
          "options": [
            "O(1)",
            "O(N)",
            "O(log N)"
          ],
          "answer": 1,
          "why": "Every remaining item shifts one place towards the front, so the work grows with N."
        }
      },
      {
        "title": "A ring buffer: a queue of fixed size",
        "say": [
          "Sometimes a queue must never grow past a fixed size, for example the last 100 log lines or sensor readings. A ring buffer (circular queue) stores them in a fixed list and reuses the slots.",
          "Keep a head index (the front) and a count. The back slot is (head + count) % capacity. The % makes the index wrap round to 0 after the last slot, like the hands of a clock.",
          "en_queue writes at the back and adds 1 to count, or refuses when count equals capacity. de_queue moves head forward with (head + 1) % capacity and takes 1 from count.",
          "Nothing is ever shifted or copied, so both operations are O(1), and the memory used never changes. This is exactly Practice 1 today."
        ],
        "example": "A round table with 4 seats at a restaurant: guests are seated in the next free seat going round, and when someone leaves their seat is reused. The table never gets bigger.",
        "code": "class RingBuffer:\n    def __init__(self, capacity):\n        self.data = [None] * capacity\n        self.capacity = capacity\n        self.head = 0\n        self.count = 0\n\n    def en_queue(self, value):\n        if self.count == self.capacity:\n            return False\n        self.data[(self.head + self.count) % self.capacity] = value\n        self.count += 1\n        return True\n\n    def de_queue(self):\n        if self.count == 0:\n            return None\n        value = self.data[self.head]\n        self.head = (self.head + 1) % self.capacity\n        self.count -= 1\n        return value\n\nrb = RingBuffer(3)\nprint(rb.en_queue(\"a\"), rb.en_queue(\"b\"), rb.en_queue(\"c\"), rb.en_queue(\"d\"))\nprint(rb.de_queue(), rb.en_queue(\"d\"))\nprint(rb.data, \"head at\", rb.head)",
        "output": "True True True False\na True\n['d', 'b', 'c'] head at 1",
        "codeNotes": [
          {
            "line": 11,
            "note": "The back slot wraps round with %."
          },
          {
            "line": 19,
            "note": "Moving head forward also wraps round."
          },
          {
            "line": 26,
            "note": "\"d\" reused slot 0, the one \"a\" left."
          }
        ],
        "tryIt": "Call de_queue() three more times and print the results. You get b, c and d in the order they joined.",
        "check": {
          "question": "In a ring buffer of capacity 5, what is the slot after slot 4?",
          "options": [
            "Slot 5",
            "Slot 0",
            "There is none"
          ],
          "answer": 1,
          "why": "(4 + 1) % 5 is 0, so the index wraps round to the start and reuses slot 0."
        }
      },
      {
        "title": "deque with a maximum length",
        "say": [
          "Python gives you a ring-buffer behaviour for free: deque(maxlen=n). When the deque is full and you append, the oldest item is dropped from the other end automatically.",
          "This is perfect for \"the last N things\": the last 5 searches, the last 60 heart-rate readings, or a moving average over recent prices.",
          "A moving average adds the new value, lets maxlen drop the oldest, and divides the sum by the length. With a small window this is cheap and very useful.",
          "deque also has appendleft and pop, so you can add or remove at either end. Some algorithms, like the sliding window maximum, use both ends."
        ],
        "example": "A phone's \"recent calls\" list that only keeps the last few calls: when a new call comes in, the oldest one silently disappears from the bottom.",
        "code": "from collections import deque\n\nrecent = deque(maxlen=3)\nfor search in [\"python\", \"dsa\", \"linked list\", \"queue\", \"deque\"]:\n    recent.append(search)\n    print(list(recent))\n\nprices = [100, 102, 101, 105, 110]\nwindow = deque(maxlen=3)\nfor p in prices:\n    window.append(p)\n    print(\"avg of last\", len(window), \"=\", round(sum(window) / len(window), 2))",
        "output": "['python']\n['python', 'dsa']\n['python', 'dsa', 'linked list']\n['dsa', 'linked list', 'queue']\n['linked list', 'queue', 'deque']\navg of last 1 = 100.0\navg of last 2 = 101.0\navg of last 3 = 101.0\navg of last 3 = 102.67\navg of last 3 = 105.33",
        "codeNotes": [
          {
            "line": 3,
            "note": "maxlen=3: the deque never holds more than 3 items."
          },
          {
            "line": 5,
            "note": "When full, appending drops the oldest from the left."
          }
        ],
        "tryIt": "Change maxlen to 2 on line 9 and run it again. The average now follows the prices more closely.",
        "check": {
          "question": "A deque(maxlen=2) holds [1, 2]. You append 3. What does it hold now?",
          "options": [
            "[1, 2, 3]",
            "[2, 3]",
            "[1, 3]"
          ],
          "answer": 1,
          "why": "It is full, so appending 3 at the right drops the oldest item, 1, from the left."
        }
      },
      {
        "title": "Building a stack from a queue",
        "say": [
          "Practice 2 is a classic puzzle: build a stack (last in, first out) using only queue operations. It trains you to think about the order items come out in.",
          "The trick: after you append a new item to the back, rotate the queue by moving every older item from the front to the back. Now the newest item is at the front.",
          "Then pop is just popleft, and top is just looking at the front. Push costs O(N) because of the rotation, but pop and top are O(1).",
          "Puzzles like this look artificial, but they show you understand exactly what each structure can and cannot do cheaply, which is what interviewers want to see."
        ],
        "example": "A single-file tunnel where people can only enter at the back and leave at the front. To let the newest person out first, everyone ahead of them walks round and re-enters behind them.",
        "code": "from collections import deque\n\nclass StackFromQueue:\n    def __init__(self):\n        self.q = deque()\n\n    def push(self, x):\n        self.q.append(x)\n        for _ in range(len(self.q) - 1):\n            self.q.append(self.q.popleft())\n\n    def pop(self):\n        return self.q.popleft()\n\n    def top(self):\n        return self.q[0]\n\ns = StackFromQueue()\nfor x in [1, 2, 3]:\n    s.push(x)\n    print(\"pushed\", x, \"queue is now\", list(s.q))\nprint(s.pop(), s.pop(), s.top())",
        "output": "pushed 1 queue is now [1]\npushed 2 queue is now [2, 1]\npushed 3 queue is now [3, 2, 1]\n3 2 1",
        "codeNotes": [
          {
            "line": 9,
            "note": "Rotate every older item behind the new one."
          },
          {
            "line": 13,
            "note": "The newest item is at the front, so popleft works like a stack pop."
          }
        ],
        "tryIt": "Push 4 after the two pops and print s.top(). It is 4, the most recent push.",
        "check": {
          "question": "In this design, which operation costs O(N)?",
          "options": [
            "push",
            "pop",
            "top"
          ],
          "answer": 0,
          "why": "push rotates every older item to the back, which is N moves. pop and top only touch the front: O(1)."
        }
      },
      {
        "title": "Queues in real systems",
        "say": [
          "Queues are everywhere in real software. A web server puts incoming requests in a queue for its workers. Apps send emails through a queue so the user does not wait for the email to go out.",
          "Big systems use message queues like Kafka, RabbitMQ or Amazon SQS between services. One service puts messages in, another takes them out at its own speed. The queue absorbs bursts of traffic.",
          "The key numbers are the queue length and the rate: if items arrive faster than they are processed, the queue grows forever. Watching queue length tells you when to add workers.",
          "The simulation below processes a burst of arrivals with a fixed number of jobs per second, the same reasoning engineers use to size a system."
        ],
        "example": "A railway ticket counter at festival time: when more people arrive per minute than the clerk can serve, the line keeps growing. Opening a second counter is \"adding a worker\".",
        "code": "from collections import deque\n\narrivals = [5, 5, 5, 0, 0, 0]\nserved_per_second = 3\nqueue = deque()\njob = 0\nfor second, new in enumerate(arrivals):\n    for _ in range(new):\n        job += 1\n        queue.append(job)\n    for _ in range(min(served_per_second, len(queue))):\n        queue.popleft()\n    print(\"second\", second, \"waiting\", len(queue))",
        "output": "second 0 waiting 2\nsecond 1 waiting 4\nsecond 2 waiting 6\nsecond 3 waiting 3\nsecond 4 waiting 0\nsecond 5 waiting 0",
        "codeNotes": [
          {
            "line": 3,
            "note": "5 new jobs per second for 3 seconds, then none."
          },
          {
            "line": 11,
            "note": "Workers can only take 3 jobs per second."
          }
        ],
        "tryIt": "Change served_per_second to 5 and run again. Now the queue never grows: workers keep up with arrivals.",
        "check": {
          "question": "Jobs arrive at 10 per second and workers finish 8 per second. What happens to the queue?",
          "options": [
            "It stays empty",
            "It grows by about 2 each second",
            "It shrinks"
          ],
          "answer": 1,
          "why": "Arrivals beat processing by 2 per second, so 2 more jobs are left waiting each second, and the queue keeps growing."
        }
      }
    ],
    "summary": [
      "A queue is first in, first out; a stack is last in, first out.",
      "Use collections.deque for queues: append and popleft are O(1); list.pop(0) is O(N).",
      "A ring buffer reuses a fixed list with head and count, wrapping indexes with %.",
      "deque(maxlen=n) keeps only the last n items automatically.",
      "If items arrive faster than they are processed, a queue grows without limit."
    ],
    "projectStep": {
      "title": "Queue tools",
      "steps": [
        "Add the RingBuffer class to dsa_toolkit.py and test it filling up, emptying and wrapping round.",
        "Add a moving_average(prices, window) function that uses deque(maxlen=window).",
        "Bonus: add StackFromQueue and check that pushing 1, 2, 3 then popping gives 3, 2, 1."
      ]
    }
  },
  {
    "day": 7,
    "title": "Hash Tables, Collision Resolution & Load Factors",
    "goal": "You can explain how a hash table stores and finds keys in O(1), handle collisions, and use dicts to solve problems like two sum.",
    "minutes": 30,
    "recap": "Yesterday you used queues, deques and ring buffers. Today you open up the structure behind Python's dict and set.",
    "parts": [
      {
        "title": "Hashing: turning a key into a position",
        "say": [
          "A hash table stores items in a list of buckets. To decide which bucket a key goes in, it runs the key through a hash function, which turns the key into a number, and then takes that number % the number of buckets.",
          "The same key always gives the same hash, so to find a key later you compute the same bucket and look only there. No searching through everything: that is where O(1) comes from.",
          "Python has a built-in hash() function, and dict and set use it inside. Strings, numbers and tuples can be hashed; lists cannot, because they can change after being stored.",
          "A good hash function spreads keys evenly across the buckets. If many keys land in the same bucket, that bucket becomes a slow list to search."
        ],
        "example": "A school with lockers numbered by the first letter of your surname: Aarav goes to locker A, Meera to locker M. To find Meera's bag you go straight to M instead of opening every locker.",
        "code": "def bucket_for(key, buckets=8):\n    total = 0\n    for ch in key:\n        total = total * 31 + ord(ch)\n    return total % buckets\n\nfor name in [\"aarav\", \"meera\", \"rohan\", \"diya\", \"kabir\"]:\n    print(name, \"-> bucket\", bucket_for(name))",
        "output": "aarav -> bucket 7\nmeera -> bucket 4\nrohan -> bucket 0\ndiya -> bucket 5\nkabir -> bucket 5",
        "codeNotes": [
          {
            "line": 4,
            "note": "A simple hash: mix the character codes into one number."
          },
          {
            "line": 5,
            "note": "% squeezes the big number into a bucket index."
          }
        ],
        "tryIt": "Run bucket_for(\"meera\") twice. It always gives the same bucket; that is what makes lookups possible.",
        "check": {
          "question": "Why can a hash table find a key without looking at every item?",
          "options": [
            "It keeps the keys sorted",
            "The key's hash tells it which bucket to look in",
            "It remembers the last key"
          ],
          "answer": 1,
          "why": "Hashing the key gives the bucket directly, so only that bucket is searched."
        }
      },
      {
        "title": "Collisions and chaining",
        "say": [
          "Two different keys can land in the same bucket. This is called a collision, and it is unavoidable: there are far more possible keys than buckets.",
          "The simplest fix is chaining: each bucket holds a small list of (key, value) pairs. To find a key, go to its bucket and check the few pairs there.",
          "As long as buckets stay short, this is still O(1) on average. In the worst case, if everything lands in one bucket, a lookup becomes O(N), which is why the hash function and the table size matter.",
          "Practice 1 today asks you to build exactly this: a hash map without Python's dict, using buckets of pairs."
        ],
        "example": "Two students with surnames starting with M share locker M. Each one has a labelled bag inside, so you open locker M and check the two name tags. Still quick, because only a couple of bags share it.",
        "code": "class SimpleHashMap:\n    def __init__(self, size=4):\n        self.buckets = [[] for _ in range(size)]\n\n    def _bucket(self, key):\n        return self.buckets[hash(key) % len(self.buckets)]\n\n    def put(self, key, value):\n        bucket = self._bucket(key)\n        for pair in bucket:\n            if pair[0] == key:\n                pair[1] = value\n                return\n        bucket.append([key, value])\n\n    def get(self, key):\n        for k, v in self._bucket(key):\n            if k == key:\n                return v\n        return -1\n\nm = SimpleHashMap(4)\nfor k in [1, 5, 9, 2]:\n    m.put(k, k * 10)\nprint(m.get(5), m.get(9), m.get(7))\nprint(m.buckets)",
        "output": "50 90 -1\n[[], [[1, 10], [5, 50], [9, 90]], [[2, 20]], []]",
        "codeNotes": [
          {
            "line": 6,
            "note": "For whole numbers, hash(k) is k, so 1, 5 and 9 all land in bucket 1."
          },
          {
            "line": 12,
            "note": "The key already exists: update its value instead of adding a duplicate."
          },
          {
            "line": 26,
            "note": "Bucket 1 holds three pairs: a chain of collisions."
          }
        ],
        "tryIt": "Change the size to 8 and run again. Now 1 and 9 still share bucket 1, but 5 moves to bucket 5.",
        "check": {
          "question": "What is a collision in a hash table?",
          "options": [
            "Two keys with the same value",
            "Two different keys landing in the same bucket",
            "A key that cannot be hashed"
          ],
          "answer": 1,
          "why": "A collision is when two different keys map to the same bucket. Chaining stores both in that bucket's list."
        }
      },
      {
        "title": "Load factor and resizing",
        "say": [
          "The load factor is the number of items divided by the number of buckets. With 8 items in 16 buckets, the load factor is 0.5: on average half an item per bucket.",
          "As the load factor rises, chains get longer and lookups slow down. So hash tables resize: when the load factor passes a limit (often 0.75), they make a table about twice as big and re-insert every item.",
          "Re-inserting is O(N), but just like the dynamic array on Day 2 it happens rarely, so adding items stays amortized O(1).",
          "Python's dict does all of this for you, which is why you can add millions of keys and still look them up instantly."
        ],
        "example": "A parking lot that opens a second floor when it is three-quarters full, instead of waiting until cars are circling for the last space.",
        "code": "items = 0\nbuckets = 8\nfor new_key in range(1, 21):\n    items += 1\n    load = items / buckets\n    if load > 0.75:\n        buckets *= 2\n        print(\"item\", items, \": load\", round(load, 2), \"-> resize to\", buckets, \"buckets\")\nprint(\"final load factor:\", round(items / buckets, 2))",
        "output": "item 7 : load 0.88 -> resize to 16 buckets\nitem 13 : load 0.81 -> resize to 32 buckets\nfinal load factor: 0.62",
        "codeNotes": [
          {
            "line": 5,
            "note": "Load factor: items per bucket on average."
          },
          {
            "line": 7,
            "note": "Past 0.75, double the buckets (and re-insert every item)."
          }
        ],
        "tryIt": "Change the limit to 0.5 on line 6. You get more resizes and a lower final load factor: faster lookups, more memory.",
        "check": {
          "question": "A hash table has 12 items in 16 buckets. What is its load factor?",
          "options": [
            "0.75",
            "1.33",
            "12"
          ],
          "answer": 0,
          "why": "Load factor is items divided by buckets: 12 / 16 = 0.75."
        }
      },
      {
        "title": "Counting with a dict",
        "say": [
          "The most common real use of a hash table is counting. counts[x] = counts.get(x, 0) + 1 counts how many times each item appears, in one O(N) pass.",
          "collections.Counter does this in one line and adds useful methods like most_common(k), which returns the k most frequent items.",
          "Counting solves many interview problems: are two words anagrams (same letter counts)? Which item appears most? Which appears only once?",
          "Remember the difference from Day 1: counting with a dict is O(N), while counting by calling list.count(x) for every x is O(N^2)."
        ],
        "example": "A tally sheet at a class vote: each time a name is called you add a stroke next to it. You never recount the whole pile; you just add one stroke.",
        "code": "from collections import Counter\n\nvotes = [\"asha\", \"ravi\", \"asha\", \"meena\", \"asha\", \"ravi\"]\ncounts = {}\nfor v in votes:\n    counts[v] = counts.get(v, 0) + 1\nprint(counts)\nprint(Counter(votes).most_common(2))\n\ndef is_anagram(a, b):\n    return Counter(a) == Counter(b)\n\nprint(is_anagram(\"listen\", \"silent\"), is_anagram(\"rat\", \"car\"))",
        "output": "{'asha': 3, 'ravi': 2, 'meena': 1}\n[('asha', 3), ('ravi', 2)]\nTrue False",
        "codeNotes": [
          {
            "line": 6,
            "note": "get(v, 0) starts a new name at 0 before adding 1."
          },
          {
            "line": 8,
            "note": "most_common gives the top items and their counts."
          },
          {
            "line": 11,
            "note": "Two words are anagrams if every letter count matches."
          }
        ],
        "tryIt": "Check whether \"dusty\" and \"study\" are anagrams. Then try \"night\" and \"thing\".",
        "check": {
          "question": "What is the Big-O of counting every item in a list of N items with a dict?",
          "options": [
            "O(N)",
            "O(N^2)",
            "O(1)"
          ],
          "answer": 0,
          "why": "One pass over the list, with an O(1) dict update for each item: O(N)."
        }
      },
      {
        "title": "Two sum with a hash map",
        "say": [
          "Practice 2 is two sum, one of the most asked interview questions: find the positions of two numbers that add up to a target.",
          "The slow way checks every pair: O(N^2). The hash map way walks the list once. For each number x, the partner it needs is target - x. If that partner has been seen already, you have the answer.",
          "Store each number's position in a dict as you go: seen[x] = i. Checking \"is the partner in seen?\" is O(1), so the whole solution is O(N).",
          "Check for the partner before storing x, so a number is never paired with itself."
        ],
        "example": "At a party, everyone wants a dance partner whose height adds up to a target. Instead of trying every pair, each new arrival asks the host: \"Is the person I need already here?\" The host checks the guest list instantly.",
        "code": "def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        partner = target - x\n        if partner in seen:\n            return [seen[partner], i]\n        seen[x] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))\nprint(two_sum([3, 2, 4], 6))\nprint(two_sum([3, 3], 6))\nprint(two_sum([1, 2], 10))",
        "output": "[0, 1]\n[1, 2]\n[0, 1]\n[]",
        "codeNotes": [
          {
            "line": 4,
            "note": "The number we need to reach the target."
          },
          {
            "line": 5,
            "note": "O(1) check: have we already seen the partner?"
          },
          {
            "line": 7,
            "note": "Store x only after checking, so it cannot pair with itself."
          }
        ],
        "tryIt": "Swap lines 5-6 and line 7 around (store first, then check) and run two_sum([3, 2, 4], 6). It wrongly pairs 3 with itself.",
        "check": {
          "question": "What does the dict store in the two sum solution?",
          "options": [
            "Each pair tried so far",
            "Each number seen and its position",
            "Only the target"
          ],
          "answer": 1,
          "why": "seen maps each number to its index, so when the partner turns up you can return both positions."
        }
      },
      {
        "title": "Sets and what can be a key",
        "say": [
          "A set is a hash table with keys and no values. It answers \"have I seen this?\" in O(1), removes duplicates, and supports maths like union (|), intersection (&) and difference (-).",
          "Keys in a dict and items in a set must be hashable: they must never change. Numbers, strings and tuples work; lists and dicts do not, because changing them would move them to the wrong bucket.",
          "If you need a list as a key, turn it into a tuple first. For example, to group words that are anagrams, use tuple(sorted(word)) as the key.",
          "Dicts also keep keys in the order they were added (since Python 3.7). You relied on that in the LRU cache on Day 5."
        ],
        "example": "Your Aadhaar number never changes, so it works as a key to find your records. Your address can change, so it would be a bad key: records filed under the old address would be lost.",
        "code": "a = {\"python\", \"sql\", \"react\"}\nb = {\"python\", \"java\"}\nprint(sorted(a & b), sorted(a | b), sorted(a - b))\n\ngroups = {}\nfor word in [\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]:\n    key = tuple(sorted(word))\n    groups.setdefault(key, []).append(word)\nprint(list(groups.values()))\n\ntry:\n    bad = {[1, 2]: \"list key\"}\nexcept TypeError as err:\n    print(\"error:\", err)",
        "output": "['python'] ['java', 'python', 'react', 'sql'] ['react', 'sql']\n[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]\nerror: unhashable type: 'list'",
        "codeNotes": [
          {
            "line": 3,
            "note": "& is in both, | is in either, - is only in the first."
          },
          {
            "line": 7,
            "note": "A tuple of sorted letters: the same for every anagram."
          },
          {
            "line": 12,
            "note": "Lists cannot be keys because they can change."
          }
        ],
        "tryIt": "Add \"tab\" to the word list. It joins \"bat\" in the same group.",
        "check": {
          "question": "Which of these can be a dict key?",
          "options": [
            "[1, 2]",
            "(1, 2)",
            "{1: 2}"
          ],
          "answer": 1,
          "why": "A tuple cannot change, so it is hashable and can be a key. Lists and dicts can change, so they cannot."
        }
      }
    ],
    "summary": [
      "A hash table uses hash(key) % buckets to find the right bucket in O(1) on average.",
      "Collisions are normal; chaining keeps several pairs in one bucket.",
      "The load factor (items / buckets) is kept low by resizing, which is amortized O(1).",
      "Dicts count in O(N) and solve two sum in O(N) by looking up the partner.",
      "Keys must be hashable (unchanging): numbers, strings and tuples, not lists."
    ],
    "projectStep": {
      "title": "Hash map tools",
      "steps": [
        "Add SimpleHashMap to dsa_toolkit.py with put, get and a remove(key) method you write yourself.",
        "Add two_sum(nums, target) and test it on at least three lists.",
        "Bonus: add group_anagrams(words) using tuple(sorted(word)) keys."
      ]
    }
  },
  {
    "day": 8,
    "title": "Two Pointers Technique (Opposite Direction & Fast/Slow Pointers)",
    "goal": "You can solve pair and palindrome problems in O(N) with two pointers moving towards each other or at different speeds.",
    "minutes": 30,
    "recap": "Yesterday you used hash maps to find partners in O(N). Today you learn a way to do it with no extra memory when the data is sorted.",
    "parts": [
      {
        "title": "Two pointers from both ends",
        "say": [
          "The two pointers technique keeps two positions in a list and moves them based on what you see. The most common version starts one pointer at the left end and one at the right end and moves them towards each other.",
          "On a sorted list this is powerful. To find two numbers that add up to a target: if the pair sum is too small, move the left pointer right (to a bigger number); if it is too big, move the right pointer left.",
          "Each step moves one pointer, and they never cross, so there are at most N steps: O(N) time and O(1) extra space. No dict needed.",
          "The key is that each move safely throws away one option. When the sum is too small, the left number cannot work with any number (all are at most the right one), so it is done."
        ],
        "example": "Two friends searching a sorted bookshelf from both ends for two books whose prices add up to a gift card. If the total is too little, the friend at the cheap end moves up; too much, the friend at the expensive end moves down.",
        "code": "def pair_with_sum(sorted_nums, target):\n    left, right = 0, len(sorted_nums) - 1\n    while left < right:\n        total = sorted_nums[left] + sorted_nums[right]\n        if total == target:\n            return sorted_nums[left], sorted_nums[right]\n        if total < target:\n            left += 1\n        else:\n            right -= 1\n    return None\n\nprint(pair_with_sum([1, 3, 4, 6, 8, 11], 10))\nprint(pair_with_sum([2, 5, 9], 20))",
        "output": "(4, 6)\nNone",
        "codeNotes": [
          {
            "line": 8,
            "note": "Too small: the left number is too small for any partner, move it right."
          },
          {
            "line": 10,
            "note": "Too big: the right number is too big for any partner, move it left."
          }
        ],
        "tryIt": "Print left and right inside the loop to watch the pointers close in on the answer.",
        "check": {
          "question": "In a sorted list, the pair sum is smaller than the target. Which pointer moves?",
          "options": [
            "The right one moves left",
            "The left one moves right",
            "Both move"
          ],
          "answer": 1,
          "why": "A smaller sum needs a bigger number, and moving left rightwards gives a bigger number."
        }
      },
      {
        "title": "Container with the most water",
        "say": [
          "Practice 1: vertical lines of different heights stand at positions 0, 1, 2 and so on. Pick two lines; the water they hold is the width between them times the shorter height. Find the biggest amount.",
          "Checking every pair is O(N^2). With two pointers at the ends you start with the widest container, then move inwards.",
          "Which pointer to move? Always the shorter line. The water is limited by the shorter line, so keeping it and moving the taller one can only make things worse: narrower and still limited by the same short line.",
          "Moving the shorter line gives a chance of finding a taller one that makes up for the lost width. Track the best area as you go."
        ],
        "example": "Two people holding a tarpaulin to catch rain: the water level can only reach the height of the shorter person. To catch more, you replace the shorter person, not the taller one.",
        "code": "def max_area(height):\n    left, right, best = 0, len(height) - 1, 0\n    while left < right:\n        water = (right - left) * min(height[left], height[right])\n        best = max(best, water)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return best\n\nprint(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))\nprint(max_area([1, 1]))",
        "output": "49\n1",
        "codeNotes": [
          {
            "line": 4,
            "note": "Width times the shorter of the two lines."
          },
          {
            "line": 6,
            "note": "Move the shorter line: it can never do better where it is."
          }
        ],
        "tryIt": "Try max_area([4, 3, 2, 1, 4]). The best uses the two 4s at the ends: 4 x 4 = 16.",
        "check": {
          "question": "Why move the pointer at the shorter line?",
          "options": [
            "It is always on the left",
            "The water is limited by it, so it cannot do better where it is",
            "To save memory"
          ],
          "answer": 1,
          "why": "The shorter line caps the water. Any container keeping it is narrower and still capped, so it is safe to move on from it."
        }
      },
      {
        "title": "Checking a palindrome",
        "say": [
          "A palindrome reads the same forwards and backwards, like \"madam\" or \"A man, a plan, a canal: Panama\" once you ignore spaces, punctuation and capitals. Practice 2 asks you to check this.",
          "Two pointers from both ends work perfectly: compare the left and right characters, then move both inwards. If any pair differs, it is not a palindrome.",
          "To ignore punctuation, skip characters that are not letters or digits with ch.isalnum(). To ignore case, compare ch.lower().",
          "This uses O(1) extra space. The shortcut s == s[::-1] also works after cleaning, but it builds a reversed copy, O(N) space. Both are O(N) time."
        ],
        "example": "Checking a word written on a strip of paper by folding it in half: the letters on the two sides must match pair by pair, from the outside in.",
        "code": "def is_palindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        if not s[left].isalnum():\n            left += 1\n        elif not s[right].isalnum():\n            right -= 1\n        elif s[left].lower() != s[right].lower():\n            return False\n        else:\n            left += 1\n            right -= 1\n    return True\n\nprint(is_palindrome(\"A man, a plan, a canal: Panama\"))\nprint(is_palindrome(\"race a car\"))\nprint(is_palindrome(\"Malayalam\"))",
        "output": "True\nFalse\nTrue",
        "codeNotes": [
          {
            "line": 4,
            "note": "Skip spaces and punctuation on the left."
          },
          {
            "line": 8,
            "note": "Compare ignoring upper and lower case."
          }
        ],
        "tryIt": "Check \"Was it a car or a cat I saw?\". It is a palindrome, so you should get True.",
        "check": {
          "question": "What extra space does the two-pointer palindrome check use?",
          "options": [
            "O(1)",
            "O(N)",
            "O(N^2)"
          ],
          "answer": 0,
          "why": "It only keeps two index numbers and compares characters in place, so the extra space is constant."
        }
      },
      {
        "title": "Removing duplicates with same-direction pointers",
        "say": [
          "Two pointers can also move in the same direction at different speeds. You used this on Day 2 with read and write positions, and on Day 3 with fast and slow pointers.",
          "For a sorted list, the slow pointer marks the end of the part with no duplicates, and the fast pointer scans ahead. When fast finds a new value, it is copied next to slow.",
          "Everything is done in place, in one pass: O(N) time and O(1) space. The same idea moves all zeros to the end of a list, or partitions numbers into two groups.",
          "When you see \"in place\" and \"O(1) extra space\" in a question about a list, think two pointers."
        ],
        "example": "Sorting fruit on a conveyor belt: one worker walks ahead checking each fruit, and a second worker behind only packs the good ones into the next empty box.",
        "code": "def move_zeros_to_end(nums):\n    write = 0\n    for read in range(len(nums)):\n        if nums[read] != 0:\n            nums[write], nums[read] = nums[read], nums[write]\n            write += 1\n    return nums\n\nprint(move_zeros_to_end([0, 1, 0, 3, 12]))\nprint(move_zeros_to_end([4, 0, 0, 2]))",
        "output": "[1, 3, 12, 0, 0]\n[4, 2, 0, 0]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Swap the non-zero number forward to the write position."
          },
          {
            "line": 6,
            "note": "write only moves when a non-zero number is placed."
          }
        ],
        "tryIt": "Run it on [0, 0, 0, 1]. The 1 moves to the front and the zeros end up at the back.",
        "check": {
          "question": "What do the read and write pointers do when read finds a 0 in move_zeros_to_end?",
          "options": [
            "Both move",
            "Only read moves",
            "Only write moves"
          ],
          "answer": 1,
          "why": "A zero is skipped: read moves on, write stays put, waiting for the next non-zero number."
        }
      },
      {
        "title": "Three sum: two pointers inside a loop",
        "say": [
          "Two pointers combine with a loop to solve harder problems. Three sum asks for all groups of three numbers that add to 0.",
          "Sort the list. Fix the first number with a loop, then use two pointers on the rest to find pairs that add up to minus that number. That is the pair-sum problem from part 1, run once per first number.",
          "The loop is O(N) and the two pointers are O(N) inside it, so the total is O(N^2), which is much better than checking every triple, O(N^3).",
          "Skipping repeated values after sorting stops you from reporting the same triple twice."
        ],
        "example": "Choosing three dishes whose calories add up to a target: pick a first dish, then use the two-ends trick on the sorted menu to find the other two, and repeat for each first dish.",
        "code": "def three_sum(nums):\n    nums = sorted(nums)\n    result = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            total = nums[i] + nums[left] + nums[right]\n            if total == 0:\n                result.append([nums[i], nums[left], nums[right]])\n                left += 1\n                while left < right and nums[left] == nums[left - 1]:\n                    left += 1\n            elif total < 0:\n                left += 1\n            else:\n                right -= 1\n    return result\n\nprint(three_sum([-1, 0, 1, 2, -1, -4]))",
        "output": "[[-1, -1, 2], [-1, 0, 1]]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Skip a first number we have already tried."
          },
          {
            "line": 7,
            "note": "Two pointers on the rest of the sorted list."
          }
        ],
        "tryIt": "Run three_sum([0, 0, 0, 0]). Thanks to the skipping, you get [[0, 0, 0]] only once.",
        "check": {
          "question": "What is the Big-O of three sum with sorting and two pointers?",
          "options": [
            "O(N)",
            "O(N^2)",
            "O(N^3)"
          ],
          "answer": 1,
          "why": "For each of N first numbers, the two pointers do O(N) work, giving O(N^2). Sorting, O(N log N), is smaller."
        }
      },
      {
        "title": "Choosing between two pointers and a hash map",
        "say": [
          "You now have two ways to find pairs: a hash map (Day 7) and two pointers (today). Which should you use?",
          "Two pointers need the data sorted and use O(1) extra space. If the list is not sorted, sorting first costs O(N log N) and loses the original positions.",
          "A hash map works on unsorted data, keeps the original positions, and runs in O(N), but uses O(N) extra memory.",
          "So: if the question gives a sorted list or asks for O(1) space, use two pointers. If the list is unsorted and you need positions, use a hash map. Interviewers like it when you say this trade-off out loud."
        ],
        "example": "Finding two friends in a crowd: if everyone is lined up by height, walk in from both ends (two pointers). If they are scattered, write down who you have met on a list (hash map).",
        "code": "def pair_hash(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        if target - x in seen:\n            return [seen[target - x], i]\n        seen[x] = i\n\ndef pair_pointers(nums, target):\n    order = sorted(range(len(nums)), key=lambda i: nums[i])\n    left, right = 0, len(order) - 1\n    while left < right:\n        total = nums[order[left]] + nums[order[right]]\n        if total == target:\n            return sorted([order[left], order[right]])\n        if total < target:\n            left += 1\n        else:\n            right -= 1\n\nnums = [11, 2, 15, 7]\nprint(pair_hash(nums, 9), pair_pointers(nums, 9))",
        "output": "[1, 3] [1, 3]",
        "codeNotes": [
          {
            "line": 9,
            "note": "Sort the positions by value so we can still report original positions."
          },
          {
            "line": 21,
            "note": "Both find positions 1 and 3 (the 2 and the 7)."
          }
        ],
        "tryIt": "Which one would you pick for a list of 10 million unsorted numbers on a phone with little memory? Write your answer and reason as a comment.",
        "check": {
          "question": "A list is unsorted and you must return the original positions quickly. Which is the natural choice?",
          "options": [
            "Two pointers",
            "A hash map",
            "Checking every pair"
          ],
          "answer": 1,
          "why": "A hash map works on unsorted data in O(N) and remembers each number's original position."
        }
      }
    ],
    "summary": [
      "Opposite-direction pointers on sorted data find pairs in O(N) with O(1) space.",
      "For container with most water, always move the shorter line.",
      "Palindromes: compare from both ends, skipping non-letters and ignoring case.",
      "Same-direction (read/write) pointers change lists in place.",
      "Pick two pointers for sorted data or O(1) space; a hash map for unsorted data with positions."
    ],
    "projectStep": {
      "title": "Two pointer tools",
      "steps": [
        "Add max_area(height) and is_palindrome(s) to dsa_toolkit.py.",
        "Add move_zeros_to_end(nums) and test it on lists with zeros at the start, middle and end.",
        "Bonus: add three_sum(nums) and test it on a list with repeated numbers."
      ]
    }
  },
  {
    "day": 9,
    "title": "Sliding Window Technique (Fixed vs Dynamic Windows)",
    "goal": "You can use fixed and flexible sliding windows to answer \"best stretch in a row\" questions in O(N).",
    "minutes": 30,
    "recap": "Yesterday you moved two pointers towards each other and in the same direction. A sliding window is two pointers that mark the start and end of a stretch.",
    "parts": [
      {
        "title": "What a sliding window is",
        "say": [
          "Many questions ask about a stretch of items in a row: the best 7-day sales, the longest word with no repeated letter, the shortest part of a list that adds up to at least 50.",
          "A window is that stretch, marked by a left and a right position. Instead of rebuilding the window from scratch at every position, you slide it: add the new item entering on the right and remove the item leaving on the left.",
          "Rebuilding a window of size k at each of N positions is O(N x k). Sliding is O(N), because each item enters the window once and leaves once.",
          "There are two kinds: fixed windows, where the size k stays the same, and flexible windows, where the window grows and shrinks to meet a rule. Today you will build both."
        ],
        "example": "Looking through a train window as it moves: new scenery enters on one side and old scenery leaves on the other. You do not rebuild the whole view; it just slides.",
        "code": "def all_windows(nums, k):\n    return [nums[i:i + k] for i in range(len(nums) - k + 1)]\n\nfor w in all_windows([4, 2, 7, 1, 8, 3], 3):\n    print(w, \"sum\", sum(w))",
        "output": "[4, 2, 7] sum 13\n[2, 7, 1] sum 10\n[7, 1, 8] sum 16\n[1, 8, 3] sum 12",
        "codeNotes": [
          {
            "line": 2,
            "note": "Every stretch of k items in a row."
          }
        ],
        "tryIt": "Change k to 2 and run it. There are now 5 windows instead of 4.",
        "check": {
          "question": "How many windows of size 3 does a list of 6 items have?",
          "options": [
            "3",
            "4",
            "6"
          ],
          "answer": 1,
          "why": "Windows start at positions 0 to 6 - 3 = 3, which is 4 windows."
        }
      },
      {
        "title": "Fixed window: the best sum of k in a row",
        "say": [
          "Practice 2 asks for the biggest sum of any k numbers in a row. Summing each window again is O(N x k).",
          "Instead, sum the first k numbers once. Then, to slide one step, add the number coming in and subtract the number going out: window_sum += nums[i] - nums[i - k].",
          "Each slide is O(1), so the whole thing is O(N). Keep the best sum you have seen as you go.",
          "This trick works for anything you can update by adding and removing one item: sums, counts, and averages (sum divided by k)."
        ],
        "example": "Your 7-day step count: each new day you add today's steps and subtract the steps from 8 days ago, instead of re-adding the whole week.",
        "code": "def max_sum_of_k(nums, k):\n    window = sum(nums[:k])\n    best = window\n    for i in range(k, len(nums)):\n        window += nums[i] - nums[i - k]\n        best = max(best, window)\n    return best\n\nsales = [120, 80, 150, 90, 200, 60, 170]\nprint(max_sum_of_k(sales, 3))\nprint(max_sum_of_k([2, 1, 5, 1, 3, 2], 3))",
        "output": "440\n9",
        "codeNotes": [
          {
            "line": 2,
            "note": "Sum the first window once."
          },
          {
            "line": 5,
            "note": "Slide: add the new number, subtract the one leaving."
          }
        ],
        "tryIt": "Also return the average: best / k. For the sales list with k = 3 it should be about 146.67.",
        "check": {
          "question": "How is the window sum updated when the window slides one step?",
          "options": [
            "Recount all k numbers",
            "Add the new number and subtract the one leaving",
            "Double it"
          ],
          "answer": 1,
          "why": "Only one number enters and one leaves, so adjust the sum by those two: O(1) per step."
        }
      },
      {
        "title": "Flexible window: longest stretch with no repeats",
        "say": [
          "Practice 1 asks for the length of the longest part of a string with no repeated characters. The window size is not fixed; it grows while the rule holds and shrinks when it breaks.",
          "Move right one character at a time. Keep the last position where each character was seen in a dict. If the new character was already seen inside the current window, jump left to just past that earlier position.",
          "After each step the window has no repeats, so its length right - left + 1 is a candidate for the answer.",
          "Each character is visited once by right, and left only moves forward, so it is O(N)."
        ],
        "example": "Building the longest line of students with no two wearing the same colour shirt. When a new student repeats a colour, the students from the front up to the earlier same-colour shirt step out.",
        "code": "def longest_unique(s):\n    last_seen = {}\n    left = best = 0\n    for right, ch in enumerate(s):\n        if ch in last_seen and last_seen[ch] >= left:\n            left = last_seen[ch] + 1\n        last_seen[ch] = right\n        best = max(best, right - left + 1)\n    return best\n\nprint(longest_unique(\"abcabcbb\"))\nprint(longest_unique(\"bbbbb\"))\nprint(longest_unique(\"pwwkew\"))",
        "output": "3\n1\n3",
        "codeNotes": [
          {
            "line": 5,
            "note": "A repeat inside the window?"
          },
          {
            "line": 6,
            "note": "Jump left past the earlier copy."
          },
          {
            "line": 8,
            "note": "The window has no repeats now: measure it."
          }
        ],
        "tryIt": "Also return the substring itself, s[left:right + 1] at the moment best improves. For \"pwwkew\" it is \"wke\".",
        "check": {
          "question": "For \"abba\", what is the length of the longest part with no repeated letters?",
          "options": [
            "1",
            "2",
            "3"
          ],
          "answer": 1,
          "why": "\"ab\" and \"ba\" both have length 2; any 3 letters in a row contain a repeat."
        }
      },
      {
        "title": "Flexible window: shortest stretch reaching a total",
        "say": [
          "The opposite kind of flexible window finds the shortest stretch that meets a target, like the fewest days in a row whose sales reach 500.",
          "Grow the window by moving right and adding numbers. As soon as the total reaches the target, record the length, then shrink from the left while it still reaches the target, recording shorter lengths.",
          "This works when the numbers are all positive, because adding a number can only raise the total and removing one can only lower it.",
          "Like before, left and right only move forward, so the whole thing is O(N)."
        ],
        "example": "Filling a bucket to at least 10 litres from a row of jugs: keep pouring jugs in order until it is full enough, then try pouring back the earliest jugs while it stays full, to find the fewest jugs needed.",
        "code": "def shortest_to_reach(nums, target):\n    left = total = 0\n    best = float(\"inf\")\n    for right, x in enumerate(nums):\n        total += x\n        while total >= target:\n            best = min(best, right - left + 1)\n            total -= nums[left]\n            left += 1\n    return 0 if best == float(\"inf\") else best\n\nprint(shortest_to_reach([2, 3, 1, 2, 4, 3], 7))\nprint(shortest_to_reach([1, 1, 1], 10))",
        "output": "2\n0",
        "codeNotes": [
          {
            "line": 6,
            "note": "While the window reaches the target, try to shrink it."
          },
          {
            "line": 10,
            "note": "If nothing ever reached the target, return 0."
          }
        ],
        "tryIt": "Try target 4 on the first list. [4] on its own is enough, so the answer is 1.",
        "check": {
          "question": "Why does this shrinking-window method need all numbers to be positive?",
          "options": [
            "Negative numbers are not allowed in Python",
            "So adding always raises the total and removing always lowers it",
            "To make it faster"
          ],
          "answer": 1,
          "why": "With negative numbers, shrinking could raise the total, so \"shrink while it reaches the target\" would no longer be safe."
        }
      },
      {
        "title": "Counting letters in a window",
        "say": [
          "Windows often keep counts, not just sums. To check if a string contains an anagram of a pattern, slide a window the size of the pattern and keep letter counts for it.",
          "Counter from collections holds the counts. When the window slides, add one to the count of the letter coming in and take one from the letter going out, deleting it when it reaches 0.",
          "If the window's counts equal the pattern's counts, you have found an anagram. Comparing two small Counters is quick, because there are at most 26 letters.",
          "This pattern, a fixed window with counts, solves \"find all anagrams\", \"permutation in string\" and many text-searching problems."
        ],
        "example": "Checking every 3-card hand along a row of cards to see if it has the same cards as yours, just in a different order. Each slide swaps one card in and one card out of the hand.",
        "code": "from collections import Counter\n\ndef anagram_starts(text, pattern):\n    k = len(pattern)\n    need = Counter(pattern)\n    window = Counter(text[:k])\n    starts = [0] if window == need else []\n    for i in range(k, len(text)):\n        window[text[i]] += 1\n        window[text[i - k]] -= 1\n        if window[text[i - k]] == 0:\n            del window[text[i - k]]\n        if window == need:\n            starts.append(i - k + 1)\n    return starts\n\nprint(anagram_starts(\"cbaebabacd\", \"abc\"))",
        "output": "[0, 6]",
        "codeNotes": [
          {
            "line": 9,
            "note": "The letter entering the window."
          },
          {
            "line": 10,
            "note": "The letter leaving the window."
          },
          {
            "line": 12,
            "note": "Remove zero counts so the Counters compare correctly."
          }
        ],
        "tryIt": "Try anagram_starts(\"abab\", \"ab\"). Every window of 2 is an anagram, so you get [0, 1, 2].",
        "check": {
          "question": "When the window slides, how many letter counts change?",
          "options": [
            "Only the letters entering and leaving",
            "All 26 letters",
            "None"
          ],
          "answer": 0,
          "why": "One letter enters and one leaves, so at most two counts change: O(1) per slide."
        }
      },
      {
        "title": "Spotting a window problem",
        "say": [
          "Window problems have a pattern in their wording: \"in a row\", \"contiguous\", \"substring\", \"subarray\", and a question about the longest, shortest, biggest or count.",
          "Decide first if the size is fixed (k is given) or flexible (a rule decides). Then decide what you need to track as the window slides: a sum, a count, the last positions, or a Counter.",
          "If an item cannot be added and removed cheaply, a plain window may not work, and you might need a deque to keep the window's maximum, or a different technique.",
          "Say the complexity out loud in interviews: \"each item enters once and leaves once, so it is O(N)\". That one sentence shows you understand why the window is fast."
        ],
        "example": "A mechanic hearing \"noise when turning left\" already has a good idea where to look. Words like \"in a row\" and \"substring\" point you straight at a sliding window.",
        "code": "questions = [\n    \"max sum of 5 numbers in a row\",\n    \"longest substring with at most 2 distinct letters\",\n    \"two numbers anywhere that add to 10\",\n    \"shortest subarray with sum at least 100\",\n]\nfor q in questions:\n    window = any(word in q for word in [\"in a row\", \"substring\", \"subarray\"])\n    print(\"window\" if window else \"not a window\", \"->\", q)",
        "output": "window -> max sum of 5 numbers in a row\nwindow -> longest substring with at most 2 distinct letters\nnot a window -> two numbers anywhere that add to 10\nwindow -> shortest subarray with sum at least 100",
        "codeNotes": [
          {
            "line": 8,
            "note": "The wording is a strong hint."
          }
        ],
        "tryIt": "Add \"count pairs with the same colour\" to the list. It is not about a stretch in a row, so it is not a window problem.",
        "check": {
          "question": "Which question is best solved with a sliding window?",
          "options": [
            "Find two numbers anywhere that sum to 10",
            "Find the longest substring with no repeated letters",
            "Sort a list"
          ],
          "answer": 1,
          "why": "A substring is a stretch in a row, and \"longest with no repeats\" is a flexible window rule."
        }
      }
    ],
    "summary": [
      "A sliding window tracks a stretch in a row with left and right positions.",
      "Fixed windows add the new item and remove the old one: O(1) per slide.",
      "Flexible windows grow with right and shrink with left to keep a rule true.",
      "Each item enters and leaves the window once, so windows are O(N).",
      "Words like \"in a row\", \"substring\" and \"subarray\" point to a window."
    ],
    "projectStep": {
      "title": "Window tools",
      "steps": [
        "Add max_sum_of_k(nums, k) and longest_unique(s) to dsa_toolkit.py.",
        "Add shortest_to_reach(nums, target) and test it with a target that is never reached.",
        "Bonus: add anagram_starts(text, pattern) and try it on a paragraph of your own."
      ]
    }
  },
  {
    "day": 10,
    "title": "Binary Search Algorithm & Monotonic Search Space Reduction",
    "goal": "You can write binary search without off-by-one mistakes, search a rotated list, and binary-search an answer.",
    "minutes": 30,
    "recap": "Yesterday you slid windows across lists in O(N). Today you learn to find things in O(log N) by throwing away half the data at every step.",
    "parts": [
      {
        "title": "Binary search on a sorted list",
        "say": [
          "On Day 1 you saw that halving a million items takes only 20 steps. Binary search uses this to find a value in a sorted list in O(log N).",
          "Keep left and right bounds. Look at the middle: if it is the target, you are done. If the middle is too small, the target can only be to the right, so move left to mid + 1. If it is too big, move right to mid - 1.",
          "Repeat while left <= right. If the bounds cross, the target is not there, so return -1.",
          "The list must be sorted. On an unsorted list, \"too small, so look right\" is simply not true, and binary search gives wrong answers."
        ],
        "example": "Finding a word in a paper dictionary: you open it in the middle, see you are at M but want D, and ignore the whole second half. A few openings later you are on the right page.",
        "code": "def binary_search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\nnums = [3, 8, 15, 21, 42, 57, 66]\nprint(binary_search(nums, 42), binary_search(nums, 3), binary_search(nums, 10))",
        "output": "4 0 -1",
        "codeNotes": [
          {
            "line": 3,
            "note": "<= so a single remaining item is still checked."
          },
          {
            "line": 8,
            "note": "mid is too small: everything left of it is too, so skip past mid."
          }
        ],
        "tryIt": "Add a print(left, mid, right) at the start of the loop and search for 57. Watch the range halve each time.",
        "check": {
          "question": "Why is it left = mid + 1 and not left = mid?",
          "options": [
            "To go faster",
            "mid was already checked, and keeping it can loop forever",
            "Python needs +1"
          ],
          "answer": 1,
          "why": "mid is known not to be the target. Keeping it in range wastes a step and can get stuck when left and right are next to each other."
        }
      },
      {
        "title": "The off-by-one traps",
        "say": [
          "Binary search is short but famous for small mistakes. The three to watch are the loop condition, how the bounds move, and what to return when the target is missing.",
          "With right = len(nums) - 1, use while left <= right and move to mid + 1 or mid - 1. Mixing styles (for example right = len(nums) with <=) reads past the end of the list.",
          "When the loop ends without finding the target, left is exactly where the target would be inserted to keep the list sorted. That is useful: it is how you find \"the first number bigger than x\".",
          "Python's bisect module does this for you: bisect_left(nums, x) returns that insert position. Knowing how to write it yourself still matters for rotated lists and answer searches."
        ],
        "example": "Measuring a table with a tape: are you counting from 0 or 1, and is the last centimetre included? Getting the ends wrong by one is the classic mistake, in carpentry and in code.",
        "code": "import bisect\n\ndef insert_position(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return left\n\nnums = [10, 20, 30, 40]\nfor x in [5, 20, 25, 50]:\n    print(x, insert_position(nums, x), bisect.bisect_left(nums, x))",
        "output": "5 0 0\n20 1 1\n25 2 2\n50 4 4",
        "codeNotes": [
          {
            "line": 11,
            "note": "When the loop ends, left is where target belongs."
          },
          {
            "line": 15,
            "note": "bisect_left gives the same answer."
          }
        ],
        "tryIt": "Insert 25 into the list at that position with nums.insert(...) and print nums. It stays sorted.",
        "check": {
          "question": "After a binary search for a missing value ends, what does left tell you?",
          "options": [
            "Nothing useful",
            "Where the value would go to keep the list sorted",
            "The biggest item"
          ],
          "answer": 1,
          "why": "left ends at the first position whose value is not smaller than the target: the insert position."
        }
      },
      {
        "title": "Searching a rotated sorted list",
        "say": [
          "Practice 1 gives a sorted list that has been rotated, like [4, 5, 6, 7, 0, 1, 2]. It is two sorted runs joined together, and you must still search in O(log N).",
          "At any middle point, at least one half is properly sorted. If nums[left] <= nums[mid], the left half is sorted; otherwise the right half is.",
          "Check whether the target lies inside the sorted half's range. If it does, search that half; if not, search the other half.",
          "Each step still throws away half, so it stays O(log N). The trick is to always ask \"which half is sorted?\" first."
        ],
        "example": "A clock face read starting from 4 o'clock: 4, 5, 6, ... 12, 1, 2, 3. It is still in order, just starting in the middle. You can still tell which side a time is on.",
        "code": "def search_rotated(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        else:\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n    return -1\n\nnums = [4, 5, 6, 7, 0, 1, 2]\nprint(search_rotated(nums, 0), search_rotated(nums, 6), search_rotated(nums, 3))",
        "output": "4 2 -1",
        "codeNotes": [
          {
            "line": 7,
            "note": "The left half is sorted."
          },
          {
            "line": 8,
            "note": "Is the target inside the sorted left half?"
          },
          {
            "line": 13,
            "note": "Otherwise the right half is sorted; check its range."
          }
        ],
        "tryIt": "Search for every number in the list with a loop and check each index is right.",
        "check": {
          "question": "In a rotated sorted list, what is always true at any mid point?",
          "options": [
            "Both halves are sorted",
            "At least one half is sorted",
            "Neither half is sorted"
          ],
          "answer": 1,
          "why": "The rotation breaks the order in at most one place, so at least one side of mid is a normal sorted run."
        }
      },
      {
        "title": "Finding the smallest in a rotated list",
        "say": [
          "Practice 2 asks for the smallest number in a rotated sorted list. The smallest number is where the rotation happened, the point where the order \"resets\".",
          "Compare the middle with the right end. If nums[mid] > nums[right], the reset is to the right of mid, so move left to mid + 1. Otherwise the smallest is at mid or to its left, so move right to mid.",
          "Here we use while left < right and right = mid (not mid - 1), because mid itself might be the answer. When left and right meet, that position holds the smallest number.",
          "This is a different style of binary search from part 1. Both are correct; what matters is that the loop condition and the bound moves agree."
        ],
        "example": "Finding the start of a circular queue of people by asking one person in the middle if the person at the very end is taller or shorter than them.",
        "code": "def find_min(nums):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] > nums[right]:\n            left = mid + 1\n        else:\n            right = mid\n    return nums[left]\n\nprint(find_min([4, 5, 6, 7, 0, 1, 2]))\nprint(find_min([3, 4, 5, 1, 2]))\nprint(find_min([1, 2, 3]))",
        "output": "0\n1\n1",
        "codeNotes": [
          {
            "line": 5,
            "note": "mid is bigger than the end: the reset is further right."
          },
          {
            "line": 8,
            "note": "mid could be the smallest, so keep it in range."
          }
        ],
        "tryIt": "What happens with a list of one item, [7]? Predict, then run find_min([7]).",
        "check": {
          "question": "Why is it right = mid instead of right = mid - 1 in find_min?",
          "options": [
            "mid might be the smallest number",
            "It is faster",
            "To avoid a Python error"
          ],
          "answer": 0,
          "why": "When nums[mid] <= nums[right], mid could itself be the minimum, so it must stay inside the range."
        }
      },
      {
        "title": "Binary search on the answer",
        "say": [
          "Binary search is not only for lists. If a question asks for the smallest value that works, and \"works\" is true for every value above some point, you can binary-search the answer itself.",
          "Example: the slowest eating speed to finish all banana piles within h hours. A higher speed always works if a lower one does. So search speeds from 1 to the biggest pile and test each middle speed.",
          "Write a helper can_finish(speed) that checks one speed. Binary search then calls it only about log2(max pile) times instead of trying every speed.",
          "This idea, searching over possible answers with a yes/no test, solves shipping capacity, minimum time and many optimisation questions."
        ],
        "example": "Setting an alarm: you want the latest time that still gets you to college on time. You try 7:30 (late), then 7:00 (on time), then 7:15, halving the gap each time instead of trying every minute.",
        "code": "import math\n\ndef min_speed(piles, hours):\n    def can_finish(speed):\n        return sum(math.ceil(p / speed) for p in piles) <= hours\n\n    left, right = 1, max(piles)\n    while left < right:\n        mid = (left + right) // 2\n        if can_finish(mid):\n            right = mid\n        else:\n            left = mid + 1\n    return left\n\nprint(min_speed([3, 6, 7, 11], 8))\nprint(min_speed([30, 11, 23, 4, 20], 5))",
        "output": "4\n30",
        "codeNotes": [
          {
            "line": 5,
            "note": "Hours needed at this speed: each pile rounded up."
          },
          {
            "line": 11,
            "note": "This speed works: try slower ones, keeping this one."
          }
        ],
        "tryIt": "Give the second example 6 hours instead of 5. More time means a slower speed is enough.",
        "check": {
          "question": "What must be true to binary-search the answer?",
          "options": [
            "The input list is sorted",
            "If a value works, every bigger value also works",
            "The answer is always 1"
          ],
          "answer": 1,
          "why": "The yes/no test must switch from \"no\" to \"yes\" only once as the value grows; then halving the range is safe."
        }
      },
      {
        "title": "Binary search in real life",
        "say": [
          "Binary search is inside many tools you use. Databases use sorted indexes to find rows fast. Python's bisect keeps lists sorted as you insert.",
          "git bisect finds which commit introduced a bug by testing the middle commit and halving the history. Out of 1,000 commits, you only test about 10.",
          "Whenever you catch yourself trying values one by one, ask: is there an order, and does the answer switch from no to yes only once? If so, halve.",
          "The code below uses bisect to grade marks quickly: the sorted cut-offs are searched in O(log N) instead of a long chain of if statements."
        ],
        "example": "Finding which day your phone started draining battery: you check the middle day of the month, then the middle of the half where it was already bad, and soon you know the exact day.",
        "code": "import bisect\nimport math\n\ndef grade(mark):\n    cutoffs = [35, 50, 60, 75, 90]\n    grades = [\"F\", \"D\", \"C\", \"B\", \"A\", \"A+\"]\n    return grades[bisect.bisect_right(cutoffs, mark)]\n\nfor mark in [20, 35, 59, 60, 88, 95]:\n    print(mark, grade(mark))\n\nprint(\"commits to test for 1000:\", math.ceil(math.log2(1000)))",
        "output": "20 F\n35 D\n59 C\n60 B\n88 A\n95 A+\ncommits to test for 1000: 10",
        "codeNotes": [
          {
            "line": 7,
            "note": "bisect_right finds how many cut-offs the mark has passed."
          },
          {
            "line": 12,
            "note": "About log2(1000), 10 tests."
          }
        ],
        "tryIt": "Add a new grade band: an \"O\" (outstanding) for 98 and above. Add 98 to cutoffs and \"O\" to grades.",
        "check": {
          "question": "git bisect searches 1,000 commits for the one that broke the build. Roughly how many tests are needed?",
          "options": [
            "About 10",
            "About 500",
            "About 1,000"
          ],
          "answer": 0,
          "why": "Each test halves the commits left, and 2 to the power 10 is 1,024, so about 10 tests."
        }
      }
    ],
    "summary": [
      "Binary search halves a sorted range each step: O(log N).",
      "Keep the loop condition and bound moves consistent (<= with mid + 1 / mid - 1, or < with right = mid).",
      "When a search ends, left is the insert position; bisect gives it directly.",
      "In a rotated list, one half is always sorted: check it first.",
      "Binary-search the answer when \"works\" switches from no to yes only once."
    ],
    "projectStep": {
      "title": "Search tools",
      "steps": [
        "Add binary_search(nums, target) and search_rotated(nums, target) to dsa_toolkit.py.",
        "Add find_min(nums) and test it on a rotated list and a list that is not rotated.",
        "Bonus: add min_speed(piles, hours) and test it with your own numbers."
      ]
    }
  },
  {
    "day": 11,
    "title": "Recursion, Call Stack Mechanics & Backtracking Principles",
    "goal": "You can write recursive functions with a clear base case, and use backtracking to generate all subsets and permutations.",
    "minutes": 30,
    "recap": "Yesterday you halved problems with binary search. Today you learn recursion: solving a problem by solving smaller copies of itself.",
    "parts": [
      {
        "title": "A function that calls itself",
        "say": [
          "A recursive function solves a problem by calling itself on a smaller version of the same problem. Every recursive function needs two things: a base case and a recursive step.",
          "The base case is the smallest version, which you answer directly without recursion. Without it, the function calls itself forever and Python stops it with a RecursionError.",
          "The recursive step makes the problem smaller and trusts the smaller call to give the right answer. For factorial: 5! is 5 x 4!, and 4! is 4 x 3!, down to the base case 1! = 1.",
          "The trick to writing recursion is to believe the smaller call works, and only think about one level: \"if I had the answer for n - 1, how do I get the answer for n?\""
        ],
        "example": "Russian dolls: to count how many dolls there are, you open the outer one and ask \"how many are inside this smaller doll?\", plus one. The smallest doll, which does not open, is the base case.",
        "code": "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\ndef count_down(n):\n    if n == 0:\n        print(\"lift off\")\n        return\n    print(n)\n    count_down(n - 1)\n\nprint(factorial(5))\ncount_down(3)",
        "output": "120\n3\n2\n1\nlift off",
        "codeNotes": [
          {
            "line": 2,
            "note": "Base case: stop here, no more calls."
          },
          {
            "line": 4,
            "note": "Recursive step: a smaller copy of the same problem."
          }
        ],
        "tryIt": "Write sum_to(n) that returns 1 + 2 + ... + n recursively. sum_to(4) should be 10.",
        "check": {
          "question": "What happens if a recursive function has no base case?",
          "options": [
            "It returns 0",
            "It calls itself until Python raises a RecursionError",
            "It runs once"
          ],
          "answer": 1,
          "why": "Nothing stops the calls, so they pile up until Python's limit (about 1,000 levels) and it raises RecursionError."
        }
      },
      {
        "title": "The call stack",
        "say": [
          "Each time a function is called, Python puts a frame on the call stack: a record of that call's variables and where to return to. When the call finishes, its frame is popped off.",
          "Recursion stacks up frames: factorial(3) waits for factorial(2), which waits for factorial(1). Only when the base case returns do the waiting calls finish, from the top of the stack down.",
          "This is the stack from Day 4, used by Python itself. It is also why very deep recursion fails: Python allows about 1,000 frames by default.",
          "Printing with indentation by depth, like the code below, is a great way to see the stack grow and shrink."
        ],
        "example": "A pile of books you are reading at once: you put one down to look something up in another, then another. You can only go back to a book once you finish the one on top of it.",
        "code": "def factorial(n, depth=0):\n    print(\"  \" * depth + f\"factorial({n}) called\")\n    if n <= 1:\n        result = 1\n    else:\n        result = n * factorial(n - 1, depth + 1)\n    print(\"  \" * depth + f\"factorial({n}) returns {result}\")\n    return result\n\nfactorial(3)",
        "output": "factorial(3) called\n  factorial(2) called\n    factorial(1) called\n    factorial(1) returns 1\n  factorial(2) returns 2\nfactorial(3) returns 6",
        "codeNotes": [
          {
            "line": 2,
            "note": "Indent by depth to see the stack of calls."
          },
          {
            "line": 6,
            "note": "This call waits here until the smaller call returns."
          }
        ],
        "tryIt": "Call factorial(5) instead. Count the \"called\" lines: that is the deepest the stack gets.",
        "check": {
          "question": "In what order do the recursive calls of factorial(3) return?",
          "options": [
            "factorial(3) first",
            "factorial(1) first, then 2, then 3",
            "All at the same time"
          ],
          "answer": 1,
          "why": "factorial(1) is on top of the stack, so it finishes first, then factorial(2) can finish, then factorial(3)."
        }
      },
      {
        "title": "Recursion on lists and repeated work",
        "say": [
          "Recursion is natural for things that contain smaller versions of themselves: a list is its first item plus the rest of the list, and a folder contains smaller folders.",
          "Fibonacci is the classic warning. fib(n) = fib(n - 1) + fib(n - 2) is correct, but fib(30) makes over a million calls, because the same small values are recomputed again and again.",
          "The fix is memoization: remember each answer the first time. Python's @lru_cache from Day 5 does this in one line and makes it O(N).",
          "You will study this properly as dynamic programming on Day 25. For now, remember: if a recursive function solves the same small problem many times, cache it."
        ],
        "example": "Being asked the same maths question ten times and working it out from scratch each time, instead of writing the answer on a sticky note after the first time.",
        "code": "from functools import lru_cache\n\ncalls = 0\ndef fib(n):\n    global calls\n    calls += 1\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nprint(fib(20), \"calls:\", calls)\n\n@lru_cache(maxsize=None)\ndef fib_fast(n):\n    return n if n < 2 else fib_fast(n - 1) + fib_fast(n - 2)\n\nprint(fib_fast(80))\n\ndef total(nums):\n    return 0 if not nums else nums[0] + total(nums[1:])\n\nprint(total([4, 5, 6]))",
        "output": "6765 calls: 21891\n23416728348467685\n15",
        "codeNotes": [
          {
            "line": 7,
            "note": "Correct, but recomputes the same values many times."
          },
          {
            "line": 11,
            "note": "lru_cache remembers each answer: O(N) instead of exponential."
          },
          {
            "line": 18,
            "note": "A list is its first item plus the rest."
          }
        ],
        "tryIt": "Try fib(25) with the slow version and look at the call count. Then try fib_fast(300).",
        "check": {
          "question": "Why is the plain recursive fib(n) slow?",
          "options": [
            "Python is slow at maths",
            "It recomputes the same smaller values many times",
            "It has no base case"
          ],
          "answer": 1,
          "why": "fib(n - 1) and fib(n - 2) both recompute the same smaller values, so the number of calls grows exponentially."
        }
      },
      {
        "title": "Backtracking: choose, explore, un-choose",
        "say": [
          "Backtracking is recursion that builds answers step by step and undoes each choice when it is done exploring it. It generates every possible combination in an organised way.",
          "The pattern has three moves. Choose: add an item to the current answer. Explore: recurse to make the remaining choices. Un-choose: remove the item, so the next choice starts clean.",
          "Practice 1 asks for every subset of a list. For [1, 2, 3] there are 2^3 = 8, from [] to [1, 2, 3]. At each position you either take the next item or move past it.",
          "Save a copy of the current answer with current[:] when you record it. If you saved current itself, every saved answer would be the same list that keeps changing."
        ],
        "example": "Trying outfits: put on a shirt, try each pair of trousers with it, then take the shirt off and try the next shirt. Taking it off is the un-choose step.",
        "code": "def subsets(nums):\n    result = []\n    current = []\n\n    def backtrack(start):\n        result.append(current[:])\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            backtrack(i + 1)\n            current.pop()\n\n    backtrack(0)\n    return result\n\nprint(subsets([1, 2, 3]))\nprint(len(subsets([1, 2, 3, 4])))",
        "output": "[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]\n16",
        "codeNotes": [
          {
            "line": 6,
            "note": "Record a copy of the current subset."
          },
          {
            "line": 8,
            "note": "Choose nums[i]."
          },
          {
            "line": 9,
            "note": "Explore the choices after it."
          },
          {
            "line": 10,
            "note": "Un-choose, ready for the next i."
          }
        ],
        "tryIt": "Replace current[:] with current on line 6 and run it. Every saved subset shows as [] because they are all the same list.",
        "check": {
          "question": "How many subsets does a list of 5 different items have?",
          "options": [
            "5",
            "25",
            "32"
          ],
          "answer": 2,
          "why": "Each item is either in or out, so there are 2 x 2 x 2 x 2 x 2 = 32 subsets."
        }
      },
      {
        "title": "Permutations: every possible order",
        "say": [
          "Practice 2 asks for every order of the numbers: the permutations. [1, 2, 3] has 3! = 6 orders.",
          "Use the same choose, explore, un-choose pattern, but at each step you may pick any number not used yet. A used list (or set) remembers which numbers are already in the current order.",
          "When the current order has all the numbers, record a copy. Then un-choose: remove the last number and mark it unused, so it can go in a later position.",
          "Permutations grow very fast: 10 items have 3,628,800 orders. Backtracking lists them all, so it is only practical for small inputs, which is what interview questions use."
        ],
        "example": "Arranging 3 friends in a photo: pick who stands on the left (3 choices), then the middle (2 left), then the right (1 left). 3 x 2 x 1 = 6 photos.",
        "code": "def permute(nums):\n    result, current = [], []\n    used = [False] * len(nums)\n\n    def backtrack():\n        if len(current) == len(nums):\n            result.append(current[:])\n            return\n        for i, x in enumerate(nums):\n            if used[i]:\n                continue\n            used[i] = True\n            current.append(x)\n            backtrack()\n            current.pop()\n            used[i] = False\n\n    backtrack()\n    return result\n\nfor order in permute([1, 2, 3]):\n    print(order)",
        "output": "[1, 2, 3]\n[1, 3, 2]\n[2, 1, 3]\n[2, 3, 1]\n[3, 1, 2]\n[3, 2, 1]",
        "codeNotes": [
          {
            "line": 6,
            "note": "A full order: record it."
          },
          {
            "line": 10,
            "note": "Skip numbers already placed."
          },
          {
            "line": 15,
            "note": "Un-choose so x can be used in a later position."
          }
        ],
        "tryIt": "Run len(permute([1, 2, 3, 4])). It should be 24, which is 4!.",
        "check": {
          "question": "What does the used list prevent?",
          "options": [
            "Recording the same order twice",
            "Using the same number twice in one order",
            "Running out of memory"
          ],
          "answer": 1,
          "why": "used marks numbers already in the current order, so each number appears once per order."
        }
      },
      {
        "title": "Pruning: stopping early",
        "say": [
          "Backtracking can be slow because it explores every branch. Pruning means stopping a branch as soon as you know it cannot lead to a valid answer.",
          "Example: find combinations of numbers that add up to a target. If the running total already passes the target (with positive numbers), there is no point adding more. Return straight away.",
          "Good pruning can turn an impossible search into a fast one. You will use it heavily on Day 28 for N-Queens and Sudoku.",
          "The code counts how many calls are made with and without the early stop, so you can see how much work pruning saves."
        ],
        "example": "Planning a trip on a budget: once the hotel alone costs more than your whole budget, you do not bother checking flights for that hotel.",
        "code": "def combos(nums, target, prune):\n    result, current = [], []\n    calls = 0\n\n    def backtrack(start, total):\n        nonlocal calls\n        calls += 1\n        if total == target:\n            result.append(current[:])\n        if prune and total >= target:\n            return\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            backtrack(i + 1, total + nums[i])\n            current.pop()\n\n    backtrack(0, 0)\n    return result, calls\n\nnums = [2, 3, 5, 6, 7, 8, 9, 10]\nprint(combos(nums, 10, prune=False))\nprint(combos(nums, 10, prune=True))",
        "output": "([[2, 3, 5], [2, 8], [3, 7], [10]], 256)\n([[2, 3, 5], [2, 8], [3, 7], [10]], 64)",
        "codeNotes": [
          {
            "line": 10,
            "note": "Already at or over the target: stop exploring this branch."
          },
          {
            "line": 7,
            "note": "Count every call to measure the work."
          }
        ],
        "tryIt": "Sort nums in reverse and run again. The results are the same, but the number of calls changes.",
        "check": {
          "question": "What does pruning do in backtracking?",
          "options": [
            "Finds more answers",
            "Stops exploring branches that cannot succeed",
            "Sorts the answers"
          ],
          "answer": 1,
          "why": "Pruning cuts off a branch as soon as it is clear it cannot lead to a valid answer, saving work."
        }
      }
    ],
    "summary": [
      "Recursion needs a base case and a step that makes the problem smaller.",
      "Each call adds a frame to the call stack; very deep recursion raises RecursionError.",
      "If recursion recomputes the same values, cache them with @lru_cache.",
      "Backtracking: choose, explore, un-choose; record copies with current[:].",
      "Subsets: 2^N; permutations: N!; prune branches that cannot succeed."
    ],
    "projectStep": {
      "title": "Recursion tools",
      "steps": [
        "Add subsets(nums) and permute(nums) to dsa_toolkit.py.",
        "Add a fib with @lru_cache and print fib(100).",
        "Bonus: write a function that lists all files in a nested dict of folders recursively."
      ]
    }
  },
  {
    "day": 12,
    "title": "Merge Sort & Divide-and-Conquer Recurrences",
    "goal": "You can sort in O(N log N) with merge sort, merge sorted lists and linked lists, and explain divide and conquer.",
    "minutes": 30,
    "recap": "Yesterday you learned recursion and backtracking. Merge sort is recursion used to sort: split, sort the halves, merge.",
    "parts": [
      {
        "title": "Divide and conquer",
        "say": [
          "Divide and conquer solves a big problem in three steps: divide it into smaller parts, conquer each part (usually by recursion), and combine the answers.",
          "Binary search on Day 10 divided the problem and kept one half. Merge sort keeps both halves: it sorts each half and then merges them.",
          "The base case for sorting is easy: a list of 0 or 1 items is already sorted.",
          "Divide and conquer is behind fast sorting, fast multiplication of huge numbers, and many graphics and data-processing algorithms.",
          "When you meet a new problem, ask: can I split it into two smaller problems of the same kind, and can I combine their answers cheaply? If both answers are yes, divide and conquer is worth trying, and the recursion from yesterday does the splitting for you."
        ],
        "example": "Marking 400 exam papers: split them among 4 teachers, each marks 100, and then the head teacher combines the four sorted mark lists into one ranking.",
        "code": "def split(items):\n    if len(items) <= 1:\n        return [items]\n    mid = len(items) // 2\n    return split(items[:mid]) + split(items[mid:])\n\nprint(split([38, 27, 43, 3, 9, 82, 10]))",
        "output": "[[38], [27], [43], [3], [9], [82], [10]]",
        "codeNotes": [
          {
            "line": 3,
            "note": "Base case: one item is already sorted."
          },
          {
            "line": 5,
            "note": "Divide in half and keep dividing."
          }
        ],
        "tryIt": "Count how many single-item pieces a list of 8 items splits into, and how many levels of halving it takes (3, because 2^3 = 8).",
        "check": {
          "question": "What is the base case of merge sort?",
          "options": [
            "A list of 0 or 1 items",
            "A list of 10 items",
            "A sorted list"
          ],
          "answer": 0,
          "why": "A list with 0 or 1 items is sorted already, so the recursion can stop there."
        }
      },
      {
        "title": "Merging two sorted lists",
        "say": [
          "The heart of merge sort is merging: joining two sorted lists into one sorted list. Look at the front of each list and take the smaller one. Repeat until one list is empty, then add what is left of the other.",
          "Each step takes one item, so merging lists with N items in total is O(N).",
          "Use <= when comparing, so equal items keep the order they had. That makes the sort stable, which matters when you sort records by one field after another.",
          "Merging is useful on its own too: combining sorted log files or two sorted lists of search results.",
          "Notice that merging never goes backwards: i and j only move forward. That is why it is O(N) and why it also works on data too large for memory, read piece by piece from two sorted files on disk."
        ],
        "example": "Two queues of students already in height order being merged into one line: the teacher always lets the shorter of the two front students go next.",
        "code": "def merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nprint(merge([3, 27, 38], [9, 10, 43, 82]))\nprint(merge([], [1, 2]))",
        "output": "[3, 9, 10, 27, 38, 43, 82]\n[1, 2]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Take the smaller front item; <= keeps equal items in order."
          },
          {
            "line": 11,
            "note": "One list is empty: the rest of the other is already sorted."
          }
        ],
        "tryIt": "Merge [1, 5, 9] and [2, 3, 10, 11] on paper first, then check with the code.",
        "check": {
          "question": "What is the cost of merging two sorted lists with N items in total?",
          "options": [
            "O(N)",
            "O(N log N)",
            "O(N^2)"
          ],
          "answer": 0,
          "why": "Each step moves one item into the result, so N steps: O(N)."
        }
      },
      {
        "title": "Merge sort put together",
        "say": [
          "Practice 1: merge_sort(arr) splits the list in half, merge sorts each half, and merges the two sorted halves.",
          "Why O(N log N)? The list is halved about log N times, so there are log N levels of recursion. At each level, all the merging together touches every item once: O(N). N work times log N levels.",
          "Merge sort is O(N log N) in every case, even on a list that is already sorted or reversed. Its cost is extra memory: the merged lists need O(N) space.",
          "Python's own sorted() uses Timsort, which is a merge sort improved to spot runs that are already sorted."
        ],
        "example": "Sorting a big pile of exam papers by splitting it in half again and again until each pile has one paper, then merging piles back together in pairs.",
        "code": "def merge(left, right):\n    result, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]\n\ndef merge_sort(arr):\n    if len(arr) <= 1:\n        return arr[:]\n    mid = len(arr) // 2\n    return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:]))\n\ndata = [38, 27, 43, 3, 9, 82, 10]\nprint(merge_sort(data))\nprint(data)",
        "output": "[3, 9, 10, 27, 38, 43, 82]\n[38, 27, 43, 3, 9, 82, 10]",
        "codeNotes": [
          {
            "line": 12,
            "note": "Return a copy so the caller's list is never changed."
          },
          {
            "line": 14,
            "note": "Sort both halves, then merge them."
          },
          {
            "line": 18,
            "note": "The original list is untouched."
          }
        ],
        "tryIt": "Sort a list of words with merge_sort. Strings compare alphabetically, so it just works.",
        "check": {
          "question": "Why is merge sort O(N log N)?",
          "options": [
            "It compares every pair",
            "log N levels of halving, O(N) merging per level",
            "It sorts in place"
          ],
          "answer": 1,
          "why": "Halving gives about log N levels, and the merges at each level touch all N items once."
        }
      },
      {
        "title": "Merging sorted linked lists",
        "say": [
          "Practice 2 merges two sorted linked lists into one, reusing the nodes rather than making new ones.",
          "Use a dummy node, like on Day 3, so you never need a special case for the head. A tail pointer marks the end of the merged list so far.",
          "Compare the front nodes, link the smaller one after tail, move that list forward and move tail forward. When one list runs out, link the rest of the other one in a single step.",
          "This is O(N) time and O(1) extra space, because the nodes are only re-linked, never copied."
        ],
        "example": "Joining two sorted trains into one sorted train in a shunting yard: you keep uncoupling the front coach with the smaller number and attaching it to the new train.",
        "code": "class ListNode:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\ndef build(values):\n    head = None\n    for v in reversed(values):\n        head = ListNode(v, head)\n    return head\n\ndef to_list(head):\n    out = []\n    while head:\n        out.append(head.val)\n        head = head.next\n    return out\n\ndef merge_lists(a, b):\n    dummy = tail = ListNode(0)\n    while a and b:\n        if a.val <= b.val:\n            tail.next, a = a, a.next\n        else:\n            tail.next, b = b, b.next\n        tail = tail.next\n    tail.next = a or b\n    return dummy.next\n\nprint(to_list(merge_lists(build([1, 4, 7]), build([2, 3, 8, 9]))))",
        "output": "[1, 2, 3, 4, 7, 8, 9]",
        "codeNotes": [
          {
            "line": 20,
            "note": "The dummy node avoids a special case for the first node."
          },
          {
            "line": 27,
            "note": "Link whatever is left in one step."
          }
        ],
        "tryIt": "Merge an empty list with build([5, 6]): merge_lists(None, build([5, 6])). It should print [5, 6].",
        "check": {
          "question": "Why is merging linked lists O(1) extra space?",
          "options": [
            "It uses a dict",
            "It re-links the existing nodes instead of copying them",
            "Linked lists are small"
          ],
          "answer": 1,
          "why": "Only the next links change; no new nodes are made, apart from the single dummy."
        }
      },
      {
        "title": "Counting inversions with merge sort",
        "say": [
          "Merge sort can answer more than \"sort this\". An inversion is a pair of items that are in the wrong order: a bigger number before a smaller one.",
          "Counting inversions by checking every pair is O(N^2). But during a merge, when an item from the right half is taken before items still left in the left half, it is smaller than all of them: that is several inversions counted at once.",
          "Adding these counts during every merge gives the total number of inversions in O(N log N).",
          "Inversion counts measure how different two rankings are, for example how far a user's movie ranking is from a recommended ranking."
        ],
        "example": "Comparing two friends' top-5 cricket player lists: the number of pairs they order differently tells you how much their opinions differ.",
        "code": "def sort_and_count(arr):\n    if len(arr) <= 1:\n        return arr[:], 0\n    mid = len(arr) // 2\n    left, a = sort_and_count(arr[:mid])\n    right, b = sort_and_count(arr[mid:])\n    merged, count, i, j = [], a + b, 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            merged.append(left[i]); i += 1\n        else:\n            merged.append(right[j]); j += 1\n            count += len(left) - i\n    return merged + left[i:] + right[j:], count\n\nprint(sort_and_count([2, 4, 1, 3, 5]))\nprint(sort_and_count([5, 4, 3, 2, 1]))",
        "output": "([1, 2, 3, 4, 5], 3)\n([1, 2, 3, 4, 5], 10)",
        "codeNotes": [
          {
            "line": 13,
            "note": "right[j] is smaller than every item left in the left half."
          }
        ],
        "tryIt": "Check the first answer by hand: the pairs in the wrong order are (2, 1), (4, 1) and (4, 3). That is 3.",
        "check": {
          "question": "How many inversions does a list sorted in reverse, [4, 3, 2, 1], have?",
          "options": [
            "4",
            "6",
            "3"
          ],
          "answer": 1,
          "why": "Every pair is in the wrong order, and 4 items have 4 x 3 / 2 = 6 pairs."
        }
      },
      {
        "title": "Sorting in practice with sorted() and key",
        "say": [
          "In real Python code you rarely write merge sort; you call sorted() or list.sort(), both O(N log N) and stable. sorted() returns a new list; .sort() changes the list in place.",
          "The key argument decides what to sort by: key=len sorts by length, key=lambda s: s[\"marks\"] sorts records by marks. reverse=True sorts from biggest to smallest.",
          "Because sorting is stable, you can sort by a second field first and then by the main field, and ties in the main field keep the second field's order.",
          "Knowing how merge sort works tells you why these guarantees hold, and what to do when you must sort data too big for memory: sort chunks and merge them."
        ],
        "example": "Arranging a class list by marks, with students who have equal marks kept in alphabetical order. Sort by name first, then by marks, and stability keeps the names in order within each mark.",
        "code": "students = [\n    {\"name\": \"Riya\", \"marks\": 88},\n    {\"name\": \"Aman\", \"marks\": 92},\n    {\"name\": \"Zoya\", \"marks\": 88},\n    {\"name\": \"Dev\", \"marks\": 75},\n]\nby_name = sorted(students, key=lambda s: s[\"name\"])\nranked = sorted(by_name, key=lambda s: s[\"marks\"], reverse=True)\nfor s in ranked:\n    print(s[\"marks\"], s[\"name\"])\n\nwords = [\"kiwi\", \"fig\", \"banana\", \"apple\"]\nprint(sorted(words, key=len))",
        "output": "92 Aman\n88 Riya\n88 Zoya\n75 Dev\n['fig', 'kiwi', 'apple', 'banana']",
        "codeNotes": [
          {
            "line": 7,
            "note": "First sort by the tie-breaker (name)."
          },
          {
            "line": 8,
            "note": "Then by the main field; stable sorting keeps names in order for equal marks."
          }
        ],
        "tryIt": "Add a student named \"Bina\" with 92 marks. Predict her place before running: she ties with Aman, and A comes before B in the name sort, so she is second.",
        "check": {
          "question": "What does it mean that Python's sort is stable?",
          "options": [
            "It never crashes",
            "Items that compare equal keep their original order",
            "It always takes the same time"
          ],
          "answer": 1,
          "why": "Stable means equal items stay in the order they were in before sorting, which makes multi-step sorting work."
        }
      }
    ],
    "summary": [
      "Divide and conquer: split the problem, solve the parts, combine the answers.",
      "Merging two sorted lists takes the smaller front item each step: O(N).",
      "Merge sort is O(N log N) in every case and uses O(N) extra memory.",
      "Merging linked lists re-links nodes with a dummy head: O(1) extra space.",
      "Python's sorted() is stable; use key= and reverse= instead of writing your own sort."
    ],
    "projectStep": {
      "title": "Sorting tools",
      "steps": [
        "Add merge(left, right) and merge_sort(arr) to dsa_toolkit.py.",
        "Add merge_lists(a, b) for linked lists, using your ListNode from Day 3.",
        "Bonus: add sort_and_count(arr) and count the inversions in a list of your choice."
      ]
    }
  },
  {
    "day": 13,
    "title": "Quick Sort & Quick Select (Kth Largest Element in O(N))",
    "goal": "You can partition a list around a pivot, sort in place with quick sort, and find the k-th largest item with quickselect.",
    "minutes": 30,
    "recap": "Yesterday you used merge sort: split first, then do the work while merging. Quick sort does the work first, while splitting.",
    "parts": [
      {
        "title": "Partitioning around a pivot",
        "say": [
          "Quick sort starts by choosing a pivot, one value from the list. It then rearranges the list so everything smaller than or equal to the pivot is on its left and everything bigger is on its right.",
          "This is called partitioning. After it, the pivot is in its final sorted position, even though the two sides are not sorted yet.",
          "The Lomuto partition uses the last item as the pivot and a pointer p that marks where the next small item should go, like the write pointer from Day 2.",
          "Walk through the list; each time you find an item <= pivot, swap it to position p and move p forward. Finally, swap the pivot into position p."
        ],
        "example": "Lining up students around one chosen student: everyone shorter stands to their left and everyone taller to their right. That chosen student is now exactly where they belong in height order.",
        "code": "def partition(arr, lo, hi):\n    pivot = arr[hi]\n    p = lo\n    for i in range(lo, hi):\n        if arr[i] <= pivot:\n            arr[i], arr[p] = arr[p], arr[i]\n            p += 1\n    arr[p], arr[hi] = arr[hi], arr[p]\n    return p\n\narr = [7, 2, 9, 4, 3, 8, 5]\np = partition(arr, 0, len(arr) - 1)\nprint(\"pivot 5 now at\", p, \"->\", arr)",
        "output": "pivot 5 now at 3 -> [2, 4, 3, 5, 9, 8, 7]",
        "codeNotes": [
          {
            "line": 2,
            "note": "The last item is the pivot."
          },
          {
            "line": 6,
            "note": "A small item is swapped into the left part."
          },
          {
            "line": 8,
            "note": "Put the pivot between the two parts."
          }
        ],
        "tryIt": "Check that every number left of position 3 is <= 5 and every number right of it is > 5.",
        "check": {
          "question": "After partitioning, what is true about the pivot?",
          "options": [
            "It is at position 0",
            "It is in its final sorted position",
            "It is removed"
          ],
          "answer": 1,
          "why": "Everything smaller is left of it and everything bigger is right of it, so it is exactly where it belongs."
        }
      },
      {
        "title": "Quick sort",
        "say": [
          "Practice 2: quick sort partitions the list, then quick sorts the left part and the right part. The pivot is already in place, so it is left out of both.",
          "Quick sort works in place: it swaps items inside the same list, so it needs no extra lists, only the recursion stack.",
          "On average each partition splits the list roughly in half, giving about log N levels of O(N) work: O(N log N).",
          "The base case is a range with 0 or 1 items, when lo >= hi."
        ],
        "example": "Sorting a class by height: pick one student, split the class into shorter and taller groups around them, then do the same inside each group until every group has one student.",
        "code": "def partition(arr, lo, hi):\n    pivot, p = arr[hi], lo\n    for i in range(lo, hi):\n        if arr[i] <= pivot:\n            arr[i], arr[p] = arr[p], arr[i]\n            p += 1\n    arr[p], arr[hi] = arr[hi], arr[p]\n    return p\n\ndef quick_sort(arr, lo=0, hi=None):\n    if hi is None:\n        hi = len(arr) - 1\n    if lo < hi:\n        p = partition(arr, lo, hi)\n        quick_sort(arr, lo, p - 1)\n        quick_sort(arr, p + 1, hi)\n    return arr\n\nprint(quick_sort([7, 2, 9, 4, 3, 8, 5]))\nprint(quick_sort([3, 3, 1, 2, 1]))",
        "output": "[2, 3, 4, 5, 7, 8, 9]\n[1, 1, 2, 3, 3]",
        "codeNotes": [
          {
            "line": 13,
            "note": "Base case: 0 or 1 items need no sorting."
          },
          {
            "line": 15,
            "note": "Sort the left part, skipping the pivot."
          },
          {
            "line": 16,
            "note": "Sort the right part."
          }
        ],
        "tryIt": "Print arr after each partition call to watch the pivots settle into place one by one.",
        "check": {
          "question": "Why does quick sort need very little extra memory?",
          "options": [
            "It swaps items inside the same list",
            "It uses a dict",
            "It sorts only half the list"
          ],
          "answer": 0,
          "why": "Partitioning swaps items in place, so no extra lists are made, only the recursion stack."
        }
      },
      {
        "title": "The worst case and random pivots",
        "say": [
          "Quick sort has a weakness. If the pivot is always the smallest or largest item, one side is empty and the other has N - 1 items. Then there are N levels, and the work becomes O(N^2).",
          "With the last item as pivot, this happens on a list that is already sorted, which is common in real data.",
          "The fix is to choose the pivot at random, then swap it to the end before partitioning. A random pivot makes the bad case extremely unlikely, so the expected time is O(N log N).",
          "The code counts comparisons for a sorted list with the last-item pivot versus a random pivot. The difference grows fast with N."
        ],
        "example": "Always picking the tallest student to split a class gives one group of everyone and one group of nobody, and nothing gets easier. Picking someone at random usually splits the class sensibly.",
        "code": "import random\n\ndef count_comparisons(arr, randomised):\n    arr = arr[:]\n    count = 0\n    def sort(lo, hi):\n        nonlocal count\n        if lo >= hi:\n            return\n        if randomised:\n            r = random.randint(lo, hi)\n            arr[r], arr[hi] = arr[hi], arr[r]\n        pivot, p = arr[hi], lo\n        for i in range(lo, hi):\n            count += 1\n            if arr[i] <= pivot:\n                arr[i], arr[p] = arr[p], arr[i]\n                p += 1\n        arr[p], arr[hi] = arr[hi], arr[p]\n        sort(lo, p - 1)\n        sort(p + 1, hi)\n    sort(0, len(arr) - 1)\n    return count\n\nrandom.seed(1)\ndata = list(range(300))\nprint(\"sorted input, last pivot:\", count_comparisons(data, False))\nprint(\"sorted input, random pivot:\", count_comparisons(data, True))",
        "output": "sorted input, last pivot: 44850\nsorted input, random pivot: 2535",
        "codeNotes": [
          {
            "line": 11,
            "note": "Pick a random pivot and move it to the end."
          },
          {
            "line": 25,
            "note": "A fixed seed so this demo prints the same numbers each run."
          }
        ],
        "tryIt": "Change 300 to 600. The last-pivot count roughly quadruples (O(N^2)); the random one roughly doubles.",
        "check": {
          "question": "On an already sorted list, what is quick sort's cost if it always picks the last item as pivot?",
          "options": [
            "O(N log N)",
            "O(N^2)",
            "O(N)"
          ],
          "answer": 1,
          "why": "The pivot is always the largest, so each partition only removes one item, giving N levels of O(N) work."
        }
      },
      {
        "title": "Quickselect: the k-th largest in O(N)",
        "say": [
          "Practice 1 asks for the k-th largest number without fully sorting. Quickselect uses partitioning but only follows the side that contains the answer.",
          "The k-th largest is at position len(nums) - k in sorted order. Partition; if the pivot lands exactly there, you are done. If the pivot is too far left, search only the right part; otherwise only the left part.",
          "Because you throw away one side each time, the work is N + N/2 + N/4 + ..., which adds up to about 2N: O(N) on average.",
          "Quickselect is how you find a median or top-k item fast when you do not need the rest sorted."
        ],
        "example": "Finding the student with the 3rd highest marks without ranking the whole class: split the class around one student's marks, then only look in the group that must contain the 3rd highest.",
        "code": "import random\n\ndef kth_largest(nums, k):\n    nums = nums[:]\n    target = len(nums) - k\n    lo, hi = 0, len(nums) - 1\n    while True:\n        r = random.randint(lo, hi)\n        nums[r], nums[hi] = nums[hi], nums[r]\n        pivot, p = nums[hi], lo\n        for i in range(lo, hi):\n            if nums[i] <= pivot:\n                nums[i], nums[p] = nums[p], nums[i]\n                p += 1\n        nums[p], nums[hi] = nums[hi], nums[p]\n        if p == target:\n            return nums[p]\n        if p < target:\n            lo = p + 1\n        else:\n            hi = p - 1\n\nprint(kth_largest([3, 2, 1, 5, 6, 4], 2))\nprint(kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4))",
        "output": "5\n4",
        "codeNotes": [
          {
            "line": 5,
            "note": "The k-th largest sits here in sorted order."
          },
          {
            "line": 19,
            "note": "The answer is to the right: ignore the left part."
          },
          {
            "line": 21,
            "note": "The answer is to the left: ignore the right part."
          }
        ],
        "tryIt": "Find the median of [7, 1, 5, 3, 9] with kth_largest(nums, 3). It should be 5.",
        "check": {
          "question": "Why is quickselect O(N) on average while quick sort is O(N log N)?",
          "options": [
            "Quickselect only follows one side after each partition",
            "Quickselect does not compare items",
            "It uses binary search"
          ],
          "answer": 0,
          "why": "Quick sort sorts both sides; quickselect follows only the side with the answer, so the work shrinks by half each time."
        }
      },
      {
        "title": "heapq and choosing the right tool",
        "say": [
          "Python's heapq module offers another way to get the largest items: heapq.nlargest(k, nums) runs in O(N log k). You will learn how heaps work on Day 18.",
          "So for the k-th largest you now have three tools: sort everything (O(N log N)), quickselect (O(N) average), or a heap (O(N log k)).",
          "For small k, a heap is simple and fast. For finding a median or any single position in a big list, quickselect is the fastest. For showing a full ranking, just sort.",
          "Interviewers love this comparison. Being able to say which tool fits which question, and why, matters as much as writing the code."
        ],
        "example": "Choosing between reading a whole book (sorting), jumping to the right chapter (quickselect), or only keeping track of your favourite 3 pages as you flip (a heap of size k).",
        "code": "import heapq\n\nnums = [12, 45, 7, 23, 56, 89, 34, 78]\nprint(\"sorted:\", sorted(nums, reverse=True)[:3])\nprint(\"heapq:\", heapq.nlargest(3, nums))\nprint(\"3rd largest:\", heapq.nlargest(3, nums)[-1])\nprint(\"smallest 2:\", heapq.nsmallest(2, nums))",
        "output": "sorted: [89, 78, 56]\nheapq: [89, 78, 56]\n3rd largest: 56\nsmallest 2: [7, 12]",
        "codeNotes": [
          {
            "line": 5,
            "note": "nlargest keeps only the top k while scanning."
          },
          {
            "line": 6,
            "note": "The last of the top 3 is the 3rd largest."
          }
        ],
        "tryIt": "Use heapq.nsmallest to find the 2 cheapest items from a list of your own prices.",
        "check": {
          "question": "You need the single median of 10 million numbers. Which is the best fit?",
          "options": [
            "Sort them all",
            "Quickselect",
            "heapq.nlargest with k = 5 million"
          ],
          "answer": 1,
          "why": "Quickselect finds one position in O(N) on average, without sorting everything."
        }
      },
      {
        "title": "Merge sort or quick sort?",
        "say": [
          "Both are O(N log N) on average. Merge sort is O(N log N) in every case and stable, but needs O(N) extra memory. Quick sort works in place and is often faster in practice, but its worst case is O(N^2) and it is not stable.",
          "For linked lists, merge sort is the natural choice, because merging only re-links nodes. For arrays in memory, quick sort (with random pivots) is common.",
          "Real libraries mix techniques. Python uses Timsort (merge-based and stable). C++ uses introsort, a quick sort that switches to heap sort if it detects a bad case.",
          "Knowing these trade-offs helps you answer \"which sort would you use and why?\", a very common interview question."
        ],
        "example": "Choosing between a courier that always arrives in 2 days (merge sort: predictable) and one that usually arrives in 1 day but very occasionally takes a week (quick sort: faster on average).",
        "code": "comparison = [\n    (\"average time\", \"O(N log N)\", \"O(N log N)\"),\n    (\"worst time\", \"O(N log N)\", \"O(N^2)\"),\n    (\"extra memory\", \"O(N)\", \"O(log N) stack\"),\n    (\"stable\", \"yes\", \"no\"),\n]\nprint(f\"{'':14}{'merge sort':>12}{'quick sort':>16}\")\nfor name, merge, quick in comparison:\n    print(f\"{name:14}{merge:>12}{quick:>16}\")",
        "output": "                merge sort      quick sort\naverage time    O(N log N)      O(N log N)\nworst time      O(N log N)          O(N^2)\nextra memory          O(N)  O(log N) stack\nstable                 yes              no",
        "codeNotes": [
          {
            "line": 7,
            "note": "An f-string with widths lines the table up in columns."
          }
        ],
        "tryIt": "Add a row (\"works on linked lists\", \"very well\", \"awkwardly\") and run it.",
        "check": {
          "question": "Which sort guarantees O(N log N) even in the worst case?",
          "options": [
            "Quick sort",
            "Merge sort",
            "Both"
          ],
          "answer": 1,
          "why": "Merge sort always halves evenly, so it is O(N log N) in every case. Quick sort can degrade to O(N^2)."
        }
      }
    ],
    "summary": [
      "Partitioning puts smaller items left of the pivot and bigger ones right; the pivot lands in its final place.",
      "Quick sort partitions and recurses on both sides, in place: O(N log N) on average.",
      "A bad pivot gives O(N^2); a random pivot avoids it in practice.",
      "Quickselect follows only the side with the answer: O(N) on average for the k-th item.",
      "Merge sort: stable, predictable, O(N) memory. Quick sort: in place, usually fast, not stable."
    ],
    "projectStep": {
      "title": "Quick sort tools",
      "steps": [
        "Add partition(arr, lo, hi) and quick_sort(arr) to dsa_toolkit.py.",
        "Add kth_largest(nums, k) using quickselect with a random pivot.",
        "Bonus: time quick_sort on list(range(2000)) with and without random pivots using the time module."
      ]
    }
  },
  {
    "day": 14,
    "title": "Non-Comparison Sorting: Counting Sort & Radix Sort",
    "goal": "You can sort small whole numbers in O(N + K) with counting sort, sort 0s, 1s and 2s in one pass, and explain radix sort.",
    "minutes": 30,
    "recap": "Yesterday you used quick sort and quickselect. Every sort so far compared items; today you sort without comparing.",
    "parts": [
      {
        "title": "The O(N log N) wall and how to get round it",
        "say": [
          "Any sort that works only by comparing pairs of items needs about N log N comparisons in the worst case. Merge sort and quick sort already reach this limit; no comparison sort can beat it.",
          "But if the items are small whole numbers, like marks from 0 to 100 or ages from 0 to 120, you do not need to compare them. You can count them.",
          "These are non-comparison sorts. Counting sort runs in O(N + K), where K is the range of values. When K is small, that is effectively linear.",
          "The trade-off: they only work on data with a known, limited range, like whole numbers or fixed-length codes."
        ],
        "example": "Sorting 500 coins by value: you do not compare coins with each other. You drop each one into the 1, 2, 5, 10 or 20 rupee tray, then read the trays in order.",
        "code": "import math\n\nfor n in [1000, 1000000]:\n    comparisons = round(n * math.log2(n))\n    print(n, \"items: comparison sort about\", comparisons, \"steps; counting sort with K=100 about\", n + 100)",
        "output": "1000 items: comparison sort about 9966 steps; counting sort with K=100 about 1100\n1000000 items: comparison sort about 19931569 steps; counting sort with K=100 about 1000100",
        "codeNotes": [
          {
            "line": 4,
            "note": "The best any comparison sort can do."
          },
          {
            "line": 5,
            "note": "Counting sort only walks the data and the value range."
          }
        ],
        "tryIt": "Change K to 1000000 in the message. When the range is as big as the data, counting sort loses its advantage.",
        "check": {
          "question": "What is the best worst-case cost of a sort that only compares pairs of items?",
          "options": [
            "O(N)",
            "O(N log N)",
            "O(N^2)"
          ],
          "answer": 1,
          "why": "Comparison sorts need about N log N comparisons in the worst case; merge sort already achieves it."
        }
      },
      {
        "title": "Counting sort",
        "say": [
          "Practice 2: counting sort sorts whole numbers from 0 to max_val. Make a counts list with one slot per possible value, all starting at 0.",
          "Walk the data once and add 1 to counts[x] for each number. Then walk the counts from 0 upwards and write each value out as many times as it was counted.",
          "That is one pass over the N items and one pass over the K possible values: O(N + K) time and O(K) extra space.",
          "If K is huge compared with N, for example sorting 10 numbers that can be up to a billion, counting sort wastes time and memory. Use it when the range is small."
        ],
        "example": "Counting votes for 5 candidates: you make 5 tally boxes and add a stroke to the right box for each ballot. Reading the boxes gives the result without ever comparing two ballots.",
        "code": "def counting_sort(arr, max_val):\n    counts = [0] * (max_val + 1)\n    for x in arr:\n        counts[x] += 1\n    result = []\n    for value, count in enumerate(counts):\n        result.extend([value] * count)\n    return result\n\nmarks = [7, 3, 9, 3, 0, 10, 7, 7]\nprint(counting_sort(marks, 10))",
        "output": "[0, 3, 3, 7, 7, 7, 9, 10]",
        "codeNotes": [
          {
            "line": 4,
            "note": "One tally per value."
          },
          {
            "line": 7,
            "note": "Write each value as many times as it appeared."
          }
        ],
        "tryIt": "Print counts before building the result. You can read how many of each mark there were straight away.",
        "check": {
          "question": "What is the time cost of counting sort for N numbers in the range 0 to K?",
          "options": [
            "O(N log N)",
            "O(N + K)",
            "O(N x K)"
          ],
          "answer": 1,
          "why": "One pass over N items to count and one pass over K+1 slots to write out: O(N + K)."
        }
      },
      {
        "title": "Sorting 0s, 1s and 2s in one pass",
        "say": [
          "Practice 1 is the Dutch national flag problem: sort a list containing only 0s, 1s and 2s in place, in a single pass, with O(1) extra space.",
          "Use three pointers. Everything before low is 0, everything after high is 2, and mid scans the unknown part in between.",
          "If nums[mid] is 0, swap it to low and move both low and mid on. If it is 1, it is already in the middle section, so just move mid. If it is 2, swap it to high and move high back, but do not move mid, because the swapped-in item has not been checked yet.",
          "Stop when mid passes high. Every item was looked at once: O(N) time, O(1) space."
        ],
        "example": "Sorting a basket of red, white and blue balls into three sections of a single tray by moving each ball once, instead of counting and refilling.",
        "code": "def sort_colors(nums):\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1\n            mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1\n    return nums\n\nprint(sort_colors([2, 0, 2, 1, 1, 0]))\nprint(sort_colors([2, 2, 0]))",
        "output": "[0, 0, 1, 1, 2, 2]\n[0, 2, 2]",
        "codeNotes": [
          {
            "line": 5,
            "note": "A 0: swap it into the 0 section."
          },
          {
            "line": 12,
            "note": "A 2: swap it to the end, but check the swapped-in item next."
          }
        ],
        "tryIt": "Add a print(nums, low, mid, high) at the start of the loop and follow the pointers on [2, 0, 1].",
        "check": {
          "question": "When nums[mid] is 2 and you swap it with nums[high], why does mid not move forward?",
          "options": [
            "It is a mistake",
            "The item swapped in from high has not been checked yet",
            "mid must stay at 0"
          ],
          "answer": 1,
          "why": "The item that came from the high end could be a 0, 1 or 2, so mid must look at it before moving on."
        }
      },
      {
        "title": "Stable counting sort for records",
        "say": [
          "Real data is usually records, not bare numbers: students with a grade, orders with a priority. You want to sort the records by a small key and keep equal keys in their original order (stable).",
          "The stable version builds one bucket per key value and appends each record to its bucket in the order it appears. Reading the buckets in key order gives a stable sort.",
          "This bucket idea is the building block of radix sort in the next part.",
          "It is still O(N + K): one pass to fill the buckets and one pass over the K buckets."
        ],
        "example": "Hospital triage: patients are put into priority 1, 2 and 3 queues as they arrive. Within each priority they are seen in the order they came in.",
        "code": "def sort_by_small_key(records, key, max_key):\n    buckets = [[] for _ in range(max_key + 1)]\n    for r in records:\n        buckets[key(r)].append(r)\n    return [r for bucket in buckets for r in bucket]\n\npatients = [(\"Anil\", 2), (\"Bela\", 1), (\"Chirag\", 2), (\"Divya\", 1), (\"Esha\", 3)]\nfor name, priority in sort_by_small_key(patients, key=lambda p: p[1], max_key=3):\n    print(priority, name)",
        "output": "1 Bela\n1 Divya\n2 Anil\n2 Chirag\n3 Esha",
        "codeNotes": [
          {
            "line": 4,
            "note": "Each record goes into its key's bucket, keeping arrival order."
          },
          {
            "line": 5,
            "note": "Read the buckets in order: a stable sort."
          }
        ],
        "tryIt": "Add a patient (\"Farah\", 1) at the end of the list. She comes after Bela and Divya among priority 1.",
        "check": {
          "question": "Why is the bucket version of counting sort stable?",
          "options": [
            "Buckets are sorted afterwards",
            "Records join each bucket in their original order",
            "It uses random pivots"
          ],
          "answer": 1,
          "why": "Records are appended to buckets in the order they appear, so equal keys keep their original order."
        }
      },
      {
        "title": "Radix sort: digit by digit",
        "say": [
          "Counting sort needs a small range. Radix sort handles big numbers by sorting them one digit at a time, using a stable counting sort for each digit.",
          "Start with the ones digit, then the tens, then the hundreds. After the last digit, the list is fully sorted, because each stable pass keeps the order from the less important digits.",
          "For N numbers with D digits, that is D passes of O(N + 10): O(D x N). For fixed-length numbers like PIN codes or phone numbers, D is a constant, so it is effectively linear.",
          "Getting a digit is simple arithmetic: (number // 10**place) % 10."
        ],
        "example": "Sorting a stack of cheques by account number: first into 10 piles by the last digit, restack in order, then into piles by the second-last digit, and so on. After the first digit, the whole stack is in order.",
        "code": "def radix_sort(nums):\n    place = 0\n    while any(n // 10 ** place for n in nums):\n        buckets = [[] for _ in range(10)]\n        for n in nums:\n            buckets[(n // 10 ** place) % 10].append(n)\n        nums = [n for b in buckets for n in b]\n        print(\"after digit\", place, \":\", nums)\n        place += 1\n    return nums\n\nradix_sort([170, 45, 75, 90, 802, 24, 2, 66])",
        "output": "after digit 0 : [170, 90, 802, 2, 24, 45, 75, 66]\nafter digit 1 : [802, 2, 24, 45, 66, 170, 75, 90]\nafter digit 2 : [2, 24, 45, 66, 75, 90, 170, 802]",
        "codeNotes": [
          {
            "line": 6,
            "note": "Put each number in the bucket for its current digit."
          },
          {
            "line": 7,
            "note": "Restack in bucket order: a stable pass."
          }
        ],
        "tryIt": "Add 1000 to the list. One more pass is needed for the thousands digit.",
        "check": {
          "question": "Which digit does this radix sort look at first?",
          "options": [
            "The most significant digit",
            "The ones digit",
            "A random digit"
          ],
          "answer": 1,
          "why": "It starts with the ones digit (place 0) and works upwards; stable passes keep the earlier ordering."
        }
      },
      {
        "title": "Choosing a sort",
        "say": [
          "You now know several sorts. In everyday Python, use sorted(); it is fast, stable and tested.",
          "Reach for counting sort when you have many whole numbers in a small range, like marks, ages or ratings. Reach for radix sort for many fixed-length numbers or codes.",
          "Use the three-pointer method when there are only two or three distinct values and you must sort in place.",
          "In interviews, say the constraint that makes a special sort possible: \"the values are only 0 to 100, so counting sort gives O(N)\". That shows you are thinking about the data, not just the algorithm."
        ],
        "example": "You would not hire a truck to move one chair, or carry a sofa on a bicycle. Picking a sort is picking the right vehicle for the load.",
        "code": "def pick_sort(n, value_range, only_three_values=False):\n    if only_three_values:\n        return \"three pointers (Dutch flag)\"\n    if value_range <= 10 * n:\n        return \"counting sort\"\n    return \"sorted() (Timsort)\"\n\nprint(pick_sort(1000000, 101))\nprint(pick_sort(20, 1000000000))\nprint(pick_sort(50, 3, only_three_values=True))",
        "output": "counting sort\nsorted() (Timsort)\nthree pointers (Dutch flag)",
        "codeNotes": [
          {
            "line": 4,
            "note": "A small range compared with the amount of data suits counting sort."
          }
        ],
        "tryIt": "Add a case for exam roll numbers: 5,000 students with numbers from 1 to 5,000. Which sort does pick_sort choose?",
        "check": {
          "question": "You have 5 million ratings from 1 to 5 stars. Which sort fits best?",
          "options": [
            "Quick sort",
            "Counting sort",
            "Merge sort"
          ],
          "answer": 1,
          "why": "The range is tiny (5 values) and the data is huge, so counting sort runs in O(N + 5)."
        }
      }
    ],
    "summary": [
      "Comparison sorts cannot beat O(N log N); counting sorts can, for small whole-number ranges.",
      "Counting sort tallies each value and writes them back: O(N + K).",
      "The Dutch national flag sorts 0s, 1s and 2s in one pass with three pointers.",
      "Bucket-based counting sort is stable, which radix sort relies on.",
      "Radix sort sorts digit by digit from the ones digit up: O(D x N)."
    ],
    "projectStep": {
      "title": "Counting sort tools",
      "steps": [
        "Add counting_sort(arr, max_val) and sort_colors(nums) to dsa_toolkit.py.",
        "Add radix_sort(nums) and compare its result with sorted() on 20 random numbers.",
        "Bonus: sort your class's marks (0 to 100) with counting sort and print how many students got each mark."
      ]
    }
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: High-Throughput Stream Median Finder (Dual Binary Heaps)",
    "goal": "You can keep a running median of a stream of numbers in O(log N) per number using two heaps.",
    "minutes": 30,
    "recap": "Two weeks done: arrays, lists, stacks, queues, hashing, windows, searching and sorting. Milestone 2 combines them into a streaming engine.",
    "parts": [
      {
        "title": "Streams and why sorting every time is too slow",
        "say": [
          "A stream is data that keeps arriving: prices every second, sensor readings, response times of a website. You often need a statistic after every new number.",
          "The median is the middle value when the numbers are sorted. It is better than the average for things like response times, because one huge value does not drag it up.",
          "With an odd count there is one middle value. With an even count there are two, and the median is their average, which is why some answers today are floats like 10.0.",
          "Sorting all the numbers again after each arrival costs O(N log N) per number. After a million numbers, that is far too slow.",
          "Today you will build a structure that adds a number in O(log N) and gives the median in O(1). It uses two heaps, which you will study in detail on Day 18."
        ],
        "example": "The median salary in a company: if the CEO gets a huge raise, the average salary jumps, but the median, the person in the middle, does not change. That is why it is a fairer summary.",
        "code": "import statistics\n\nresponse_ms = [120, 95, 110, 105, 5000]\nprint(\"average:\", statistics.mean(response_ms))\nprint(\"median:\", statistics.median(response_ms))\n\nstream = [5, 15, 1, 3]\nseen = []\nfor x in stream:\n    seen.append(x)\n    print(\"after\", x, \"median is\", statistics.median(sorted(seen)))",
        "output": "average: 1086\nmedian: 110\nafter 5 median is 5\nafter 15 median is 10.0\nafter 1 median is 5\nafter 3 median is 4.0",
        "codeNotes": [
          {
            "line": 4,
            "note": "One slow request pulls the average up a lot."
          },
          {
            "line": 11,
            "note": "Sorting everything again each time: too slow for big streams."
          }
        ],
        "tryIt": "Change 5000 to 50000 on line 3. The average jumps again; the median stays 110.",
        "check": {
          "question": "Why is the median often better than the average for response times?",
          "options": [
            "It is easier to compute",
            "One extreme value does not drag it far",
            "It is always smaller"
          ],
          "answer": 1,
          "why": "The median only depends on the middle value, so a few very slow requests do not distort it."
        }
      },
      {
        "title": "heapq: a min-heap in Python",
        "say": [
          "A heap is a structure where the smallest item is always at the front, and adding or removing an item costs O(log N). Python's heapq module turns a plain list into a min-heap.",
          "heapq.heappush(h, x) adds x, heapq.heappop(h) removes and returns the smallest, and h[0] peeks at the smallest without removing it.",
          "Python only has a min-heap. For a max-heap, a common trick is to store negative numbers: the smallest negative is the largest original number.",
          "You will build a heap yourself on Day 18. Today, use heapq as a tool."
        ],
        "example": "A hospital emergency room: whoever is most urgent is always seen next, no matter when they arrived. A heap always hands you the most urgent (smallest) item.",
        "code": "import heapq\n\nh = []\nfor x in [7, 2, 9, 4]:\n    heapq.heappush(h, x)\nprint(\"smallest:\", h[0])\nprint(\"pop:\", heapq.heappop(h), heapq.heappop(h))\n\nmax_heap = []\nfor x in [7, 2, 9, 4]:\n    heapq.heappush(max_heap, -x)\nprint(\"largest:\", -max_heap[0])",
        "output": "smallest: 2\npop: 2 4\nlargest: 9",
        "codeNotes": [
          {
            "line": 6,
            "note": "h[0] is always the smallest item."
          },
          {
            "line": 11,
            "note": "Store negatives to turn a min-heap into a max-heap."
          }
        ],
        "tryIt": "Pop everything from max_heap in a loop, printing -heapq.heappop(max_heap). The numbers come out largest first.",
        "check": {
          "question": "How do you get a max-heap with Python's heapq?",
          "options": [
            "heapq.maxheap()",
            "Store negated values in a min-heap",
            "Sort in reverse"
          ],
          "answer": 1,
          "why": "heapq only provides a min-heap, so pushing -x makes the largest original value the smallest stored value."
        }
      },
      {
        "title": "Two heaps split the numbers in half",
        "say": [
          "The trick: keep the smaller half of the numbers in a max-heap called low, and the larger half in a min-heap called high.",
          "The top of low is the largest of the small half; the top of high is the smallest of the big half. The median sits right between them.",
          "Keep the halves balanced: low may have one more number than high, but never more. With an odd count, the median is the top of low. With an even count, it is the average of the two tops.",
          "Each heap operation is O(log N), and reading the two tops is O(1).",
          "Why not one heap? A single heap only gives you its smallest (or largest) item quickly. The median is in the middle, and two heaps turn the middle into the meeting point of two tops, which is exactly what heaps are good at."
        ],
        "example": "Splitting a class into a shorter half and a taller half, standing in two lines facing each other. The tallest of the short line and the shortest of the tall line meet in the middle: that is the median height.",
        "code": "import heapq\n\nlow, high = [], []\nfor x in [1, 3, 5]:\n    heapq.heappush(low, -x)\nfor x in [7, 9]:\n    heapq.heappush(high, x)\n\nprint(\"small half top:\", -low[0], \"| big half top:\", high[0])\ncount = len(low) + len(high)\nmedian = -low[0] if count % 2 else (-low[0] + high[0]) / 2\nprint(\"median:\", median)",
        "output": "small half top: 5 | big half top: 7\nmedian: 5",
        "codeNotes": [
          {
            "line": 5,
            "note": "low is a max-heap of the smaller half (stored as negatives)."
          },
          {
            "line": 11,
            "note": "Odd count: the top of low. Even: average the two tops."
          }
        ],
        "tryIt": "Push 8 into high and run again. Now there are 6 numbers and the median is (5 + 7) / 2 = 6.0.",
        "check": {
          "question": "In the two-heap design, where is the median when there is an odd number of values?",
          "options": [
            "At the top of high",
            "At the top of low",
            "At the bottom of low"
          ],
          "answer": 1,
          "why": "low holds the extra number when the count is odd, and its top is the middle value."
        }
      },
      {
        "title": "Adding a number and rebalancing",
        "say": [
          "Practice 1 builds MedianFinder with add_num and find_median. The add has two steps: put the number in the right half, then fix the sizes.",
          "A simple safe way: push the new number into low, then move low's largest to high. That guarantees every number in low is <= every number in high.",
          "Then, if high has more numbers than low, move high's smallest back to low. Now low has the same number or one more.",
          "Three heap operations per add, each O(log N): O(log N) per number, however long the stream gets."
        ],
        "example": "A new student joins the class line-up: they first stand with the short group, the tallest of that group steps over to the tall group, and if the tall group is now bigger, its shortest steps back.",
        "code": "import heapq\n\nclass MedianFinder:\n    def __init__(self):\n        self.low = []\n        self.high = []\n\n    def add_num(self, num):\n        heapq.heappush(self.low, -num)\n        heapq.heappush(self.high, -heapq.heappop(self.low))\n        if len(self.high) > len(self.low):\n            heapq.heappush(self.low, -heapq.heappop(self.high))\n\n    def find_median(self):\n        if len(self.low) > len(self.high):\n            return -self.low[0]\n        return (-self.low[0] + self.high[0]) / 2\n\nmf = MedianFinder()\nfor x in [5, 15, 1, 3, 8]:\n    mf.add_num(x)\n    print(\"added\", x, \"median\", mf.find_median())",
        "output": "added 5 median 5\nadded 15 median 10.0\nadded 1 median 5\nadded 3 median 4.0\nadded 8 median 5",
        "codeNotes": [
          {
            "line": 10,
            "note": "Move the largest of the small half across: halves stay in order."
          },
          {
            "line": 12,
            "note": "Keep low the same size as high or one bigger."
          }
        ],
        "tryIt": "Add a print of -low[0] and high[0] after each add to watch the two halves meet in the middle.",
        "check": {
          "question": "What is the cost of add_num in the two-heap MedianFinder?",
          "options": [
            "O(1)",
            "O(log N)",
            "O(N)"
          ],
          "answer": 1,
          "why": "It does a few heap pushes and pops, each O(log N), so adding is O(log N)."
        }
      },
      {
        "title": "Running medians of a stream",
        "say": [
          "Practice 2 returns the median after each number is added: the running median. With MedianFinder this is one loop.",
          "Check the answers by hand for a short stream. For [5, 15, 1, 3]: after 5 the median is 5; after 15 it is 10.0; after 1 it is 5; after 3 it is 4.0.",
          "Notice the type: an even count gives a float from the division, like 10.0, while an odd count gives the number itself. Tests in the practice compare with exactly these values.",
          "The same engine is used for real-time dashboards, where you want the median latency of the last requests updated live."
        ],
        "example": "A live cricket scoreboard showing the median runs per over, updated after every over, without re-reading all the overs from the start.",
        "code": "import heapq\n\ndef running_medians(nums):\n    low, high, out = [], [], []\n    for num in nums:\n        heapq.heappush(low, -num)\n        heapq.heappush(high, -heapq.heappop(low))\n        if len(high) > len(low):\n            heapq.heappush(low, -heapq.heappop(high))\n        out.append(-low[0] if len(low) > len(high) else (-low[0] + high[0]) / 2)\n    return out\n\nprint(running_medians([5, 15, 1, 3]))\nprint(running_medians([2, 2, 2]))",
        "output": "[5, 10.0, 5, 4.0]\n[2, 2.0, 2]",
        "codeNotes": [
          {
            "line": 10,
            "note": "Record the median after every number."
          }
        ],
        "tryIt": "Run it on your own list of 6 daily temperatures and check the last value against statistics.median.",
        "check": {
          "question": "What is the running median list for [4, 8]?",
          "options": [
            "[4, 8]",
            "[4, 6.0]",
            "[6.0, 6.0]"
          ],
          "answer": 1,
          "why": "After 4 alone the median is 4; after 4 and 8 it is (4 + 8) / 2 = 6.0."
        }
      },
      {
        "title": "Milestone review: what you built",
        "say": [
          "This milestone combined several ideas: Big-O thinking (O(log N) instead of re-sorting), heaps as priority queues, and careful balancing of two structures.",
          "Compare the costs: re-sorting after every number is O(N log N) each time; keeping a sorted list with bisect.insort is O(N) each time because of shifting; two heaps are O(log N) each time.",
          "For a million numbers, that is the difference between minutes and a fraction of a second. The code below measures the insort method against two heaps on the same stream.",
          "You are now ready for trees and heaps in detail next week. Well done on reaching Milestone 2."
        ],
        "example": "Three ways to keep a queue in height order as people arrive: re-line everyone each time, squeeze each person into the right place, or keep two groups meeting in the middle. The last one is fastest for huge crowds.",
        "code": "import bisect\nimport heapq\nimport random\nimport time\n\nrandom.seed(5)\nstream = [random.randint(1, 1000000) for _ in range(20000)]\n\nstart = time.perf_counter()\narr = []\nfor x in stream:\n    bisect.insort(arr, x)\ninsort_median = arr[len(arr) // 2]\ninsort_time = time.perf_counter() - start\n\nstart = time.perf_counter()\nlow, high = [], []\nfor x in stream:\n    heapq.heappush(low, -x)\n    heapq.heappush(high, -heapq.heappop(low))\n    if len(high) > len(low):\n        heapq.heappush(low, -heapq.heappop(high))\nheap_median = (-low[0] + high[0]) / 2\nheap_time = time.perf_counter() - start\n\nprint(\"same median:\", (arr[9999] + arr[10000]) / 2 == heap_median)\nprint(\"both finished:\", insort_time > 0 and heap_time > 0)",
        "output": "same median: True\nboth finished: True",
        "codeNotes": [
          {
            "line": 12,
            "note": "insort finds the place in O(log N) but shifting is O(N)."
          },
          {
            "line": 26,
            "note": "Both methods agree on the median of all 20,000 numbers."
          }
        ],
        "tryIt": "Print round(insort_time, 3) and round(heap_time, 3) to compare them on your machine. Increase the stream to 100,000 and compare again.",
        "check": {
          "question": "What is the cost per number of keeping a sorted list with bisect.insort?",
          "options": [
            "O(log N)",
            "O(N), because items shift to make room",
            "O(1)"
          ],
          "answer": 1,
          "why": "Finding the position is O(log N), but inserting into the list shifts items: O(N)."
        }
      }
    ],
    "summary": [
      "The median resists extreme values; streams need it updated after every number.",
      "heapq gives a min-heap; store negatives for a max-heap.",
      "Keep the smaller half in a max-heap and the larger half in a min-heap.",
      "Add with push, move across, rebalance: O(log N); read the median in O(1).",
      "Even counts give the average of the two tops (a float); odd counts give the top of the small half."
    ],
    "projectStep": {
      "title": "Milestone 2: stream median",
      "steps": [
        "Add the MedianFinder class to dsa_toolkit.py.",
        "Add running_medians(nums) and check it against statistics.median on a few lists.",
        "Bonus: simulate 1,000 random response times and print the median after every 100."
      ]
    }
  },
  {
    "day": 16,
    "title": "Binary Trees: Preorder, Inorder, Postorder & Level-Order BFS",
    "goal": "You can build binary trees, walk them in preorder, inorder, postorder and level order, and measure their depth.",
    "minutes": 30,
    "recap": "Last week ended with the stream median milestone. This week you move from lines of data to trees and graphs, where items branch.",
    "parts": [
      {
        "title": "Trees: nodes with children",
        "say": [
          "A tree is made of nodes, like a linked list, but each node can point to several children instead of one next node. The top node is the root; nodes with no children are leaves.",
          "In a binary tree each node has at most two children, called left and right. In Python a tree node is a small class with val, left and right, where a missing child is None.",
          "Trees are everywhere: folders on your computer, the HTML of a web page, a company's org chart, and the decision trees used in machine learning.",
          "The depth of a node is how many steps it is from the root. The height of the tree is the number of levels. A tree of height h can hold up to 2^h - 1 nodes, which is why balanced trees are so shallow.",
          "Almost every tree function is recursive, because a tree is a node plus two smaller trees. The base case is an empty tree: None."
        ],
        "example": "A family tree: grandparents at the top, their children below, grandchildren below them. To find everyone, you start at the top and follow each branch down.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n#        1\n#       / \\\n#      2   3\n#     / \\\n#    4   5\nroot = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))\n\ndef count_nodes(node):\n    if node is None:\n        return 0\n    return 1 + count_nodes(node.left) + count_nodes(node.right)\n\nprint(\"nodes:\", count_nodes(root))\nprint(\"root:\", root.val, \"left child:\", root.left.val, \"right child:\", root.right.val)",
        "output": "nodes: 5\nroot: 1 left child: 2 right child: 3",
        "codeNotes": [
          {
            "line": 12,
            "note": "The tree drawn in the comments above, built from nested nodes."
          },
          {
            "line": 15,
            "note": "Base case: an empty tree has no nodes."
          },
          {
            "line": 17,
            "note": "This node plus the nodes in each subtree."
          }
        ],
        "tryIt": "Write count_leaves(node) that counts nodes with no children. For this tree it should be 3 (4, 5 and 3).",
        "check": {
          "question": "In a binary tree, how many children can a node have?",
          "options": [
            "Exactly two",
            "At most two",
            "Any number"
          ],
          "answer": 1,
          "why": "A binary tree node has a left and a right child, and either or both can be missing (None)."
        }
      },
      {
        "title": "Depth-first walks: preorder, inorder, postorder",
        "say": [
          "A depth-first walk goes as deep as possible down one branch before coming back. There are three orders, depending on when you visit the node itself.",
          "Preorder visits the node, then the left subtree, then the right. It is used to copy a tree or print a folder structure top-down.",
          "Inorder visits the left subtree, then the node, then the right. For a binary search tree (Day 17) this gives the values in sorted order.",
          "Postorder visits left, right, and the node last. It is used to delete a tree or to add up folder sizes, because children must be handled before their parent.",
          "All three are the same recursive function with the visit line in a different place. Each node is visited once, so every walk is O(N)."
        ],
        "example": "Reading a book's table of contents is preorder: chapter title, then its sections. Working out a chapter's total pages is postorder: you need every section's pages before the chapter's total.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nroot = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))\n\ndef preorder(n, out):\n    if n:\n        out.append(n.val); preorder(n.left, out); preorder(n.right, out)\n    return out\n\ndef inorder(n, out):\n    if n:\n        inorder(n.left, out); out.append(n.val); inorder(n.right, out)\n    return out\n\ndef postorder(n, out):\n    if n:\n        postorder(n.left, out); postorder(n.right, out); out.append(n.val)\n    return out\n\nprint(\"pre: \", preorder(root, []))\nprint(\"in:  \", inorder(root, []))\nprint(\"post:\", postorder(root, []))",
        "output": "pre:  [1, 2, 4, 5, 3]\nin:   [4, 2, 5, 1, 3]\npost: [4, 5, 2, 3, 1]",
        "codeNotes": [
          {
            "line": 11,
            "note": "Preorder: the node first."
          },
          {
            "line": 16,
            "note": "Inorder: the node between its subtrees."
          },
          {
            "line": 21,
            "note": "Postorder: the node last."
          }
        ],
        "tryIt": "Add a right child 6 under node 3 and predict all three orders before running.",
        "check": {
          "question": "Which walk visits a node after both of its subtrees?",
          "options": [
            "Preorder",
            "Inorder",
            "Postorder"
          ],
          "answer": 2,
          "why": "Postorder handles left, then right, then the node itself last."
        }
      },
      {
        "title": "Level order with a queue",
        "say": [
          "Practice 1 walks the tree level by level: the root, then all nodes on level 2, then level 3, and so on. This is breadth-first search (BFS).",
          "BFS uses a queue (Day 6). Start with the root in a deque. Each round, note how many nodes are in the queue: that is exactly one level. Pop that many, record their values, and push their children.",
          "Taking the length of the queue before the round begins is the key step. It separates one level from the next, even though children are being added to the same queue.",
          "Every node enters and leaves the queue once, so level order is O(N) time. The queue holds at most one level, which can be up to about N/2 nodes in a full tree.",
          "Level order answers questions like \"what is visible from the right side of the tree?\" (the last node of each level) and \"what is the minimum depth?\" (the first level with a leaf)."
        ],
        "example": "Announcing results at a family reunion generation by generation: first the grandparents, then all their children, then all the grandchildren. You finish one generation before starting the next.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nfrom collections import deque\n\ndef level_order(root):\n    if not root:\n        return []\n    result, queue = [], deque([root])\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left: queue.append(node.left)\n            if node.right: queue.append(node.right)\n        result.append(level)\n    return result\n\nroot = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))\nprint(level_order(root))\nprint([level[-1] for level in level_order(root)])",
        "output": "[[3], [9, 20], [15, 7]]\n[3, 20, 7]",
        "codeNotes": [
          {
            "line": 15,
            "note": "len(queue) now is exactly the size of this level."
          },
          {
            "line": 18,
            "note": "Children join the back of the queue for the next level."
          },
          {
            "line": 25,
            "note": "The last node of each level: the right side view."
          }
        ],
        "tryIt": "Change line 25 to print the first node of each level: the left side view. It should be [3, 9, 15].",
        "check": {
          "question": "Which data structure does level order traversal use?",
          "options": [
            "A stack",
            "A queue",
            "A heap"
          ],
          "answer": 1,
          "why": "Nodes must come out in the order they were found, level by level: first in, first out, which is a queue."
        }
      },
      {
        "title": "Maximum depth",
        "say": [
          "Practice 2 asks for the number of levels, the maximum depth. The recursive idea is short: the depth of a tree is 1 (for this node) plus the larger depth of its two subtrees.",
          "The base case is an empty tree, which has depth 0. A single leaf then has depth 1 + max(0, 0) = 1.",
          "You can also answer with level order: count how many levels BFS produces. Both are O(N) time.",
          "The recursive version uses the call stack, as deep as the tree is tall. For a very unbalanced tree (a long chain), that can hit Python's recursion limit; the BFS version cannot.",
          "Depth matters for speed: many tree operations cost O(height). A balanced tree of a million nodes is only about 20 levels deep; a chain of a million nodes is a million levels deep."
        ],
        "example": "Measuring how many generations a family tree has: ask each child \"how many generations are below you?\", take the biggest answer, and add one for yourself.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef max_depth(node):\n    if node is None:\n        return 0\n    return 1 + max(max_depth(node.left), max_depth(node.right))\n\nbalanced = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3, TreeNode(6), TreeNode(7)))\nchain = TreeNode(1, None, TreeNode(2, None, TreeNode(3, None, TreeNode(4))))\nprint(max_depth(balanced), max_depth(chain), max_depth(None))",
        "output": "3 4 0",
        "codeNotes": [
          {
            "line": 8,
            "note": "Empty tree: depth 0."
          },
          {
            "line": 10,
            "note": "One for this node, plus the deeper subtree."
          }
        ],
        "tryIt": "The balanced tree holds 7 nodes in 3 levels; the chain holds only 4 nodes in 4 levels. Add a node to the end of the chain and watch its depth grow by 1.",
        "check": {
          "question": "What is the maximum depth of a tree with only a root node?",
          "options": [
            "0",
            "1",
            "2"
          ],
          "answer": 1,
          "why": "The root is one level: 1 + max(depth of None, depth of None) = 1 + 0 = 1."
        }
      },
      {
        "title": "Walking a tree with your own stack",
        "say": [
          "Recursion uses Python's call stack. You can do the same walk with your own stack, which avoids recursion limits and shows what recursion really does.",
          "For preorder: push the root. While the stack is not empty, pop a node, visit it, then push its right child and then its left child. Left is pushed last so it is popped first.",
          "Swapping the queue in BFS for a stack turns breadth-first into depth-first. That one change of data structure is the whole difference between the two searches.",
          "This matters in interviews (\"can you do it without recursion?\") and in real code that handles very deep trees, like deeply nested JSON.",
          "The same stack-based idea works on graphs on Day 20, where the structure can be much deeper than a typical tree."
        ],
        "example": "Exploring a building with a to-do list of rooms: if you always take the most recently added room, you go deep down one corridor first. If you take the oldest, you sweep floor by floor.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef preorder_iterative(root):\n    if not root:\n        return []\n    out, stack = [], [root]\n    while stack:\n        node = stack.pop()\n        out.append(node.val)\n        if node.right: stack.append(node.right)\n        if node.left: stack.append(node.left)\n    return out\n\nroot = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))\nprint(preorder_iterative(root))",
        "output": "[1, 2, 4, 5, 3]",
        "codeNotes": [
          {
            "line": 12,
            "note": "Take the most recently added node: depth-first."
          },
          {
            "line": 15,
            "note": "Push left last so it is visited first."
          }
        ],
        "tryIt": "Swap lines 14 and 15 and run it. You get a mirror-image order: 1, 3, 2, 5, 4.",
        "check": {
          "question": "What changes a breadth-first walk into a depth-first walk?",
          "options": [
            "Using a stack instead of a queue",
            "Sorting the nodes",
            "Starting from a leaf"
          ],
          "answer": 0,
          "why": "A queue takes the oldest node (level by level); a stack takes the newest (deep first)."
        }
      },
      {
        "title": "Trees from lists and tree problems in general",
        "say": [
          "Interview platforms often describe trees as a list in level order, with None for missing children: [3, 9, 20, None, None, 15, 7]. Building a tree from that list uses the same queue idea as level order.",
          "Most tree problems follow one of two shapes. Either combine answers from the children (depth, size, sums: postorder thinking), or pass information down to the children (the path so far, allowed ranges: preorder thinking).",
          "Before coding, ask: what should this function return for an empty tree? What does a node need from its children, or give to them? Answering those two questions writes most of the code.",
          "Tomorrow's binary search trees pass a range down to the children; today's depth combined answers coming up. You will see both shapes again and again.",
          "Draw small trees on paper. Three to five nodes are enough to check any tree function by hand."
        ],
        "example": "In a company, the total salary cost of a team is combined upwards from each sub-team (answers coming up), while a spending limit is passed down from each manager to their team (information going down).",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nfrom collections import deque\n\ndef build(values):\n    if not values or values[0] is None:\n        return None\n    root = TreeNode(values[0])\n    queue, i = deque([root]), 1\n    while queue and i < len(values):\n        node = queue.popleft()\n        for side in (\"left\", \"right\"):\n            if i < len(values) and values[i] is not None:\n                child = TreeNode(values[i])\n                setattr(node, side, child)\n                queue.append(child)\n            i += 1\n    return root\n\ndef path_sums(node, so_far=0):\n    if node is None:\n        return []\n    total = so_far + node.val\n    if not node.left and not node.right:\n        return [total]\n    return path_sums(node.left, total) + path_sums(node.right, total)\n\nroot = build([3, 9, 20, None, None, 15, 7])\nprint(root.val, root.left.val, root.right.val, root.right.left.val)\nprint(\"root-to-leaf sums:\", path_sums(root))",
        "output": "3 9 20 15\nroot-to-leaf sums: [12, 38, 30]",
        "codeNotes": [
          {
            "line": 19,
            "note": "setattr sets node.left or node.right by name."
          },
          {
            "line": 27,
            "note": "The running total is passed down to the children."
          },
          {
            "line": 29,
            "note": "At a leaf, the path is complete."
          }
        ],
        "tryIt": "Build the tree [1, 2, 3, 4, 5] and print its root-to-leaf sums. They should be [7, 8, 4].",
        "check": {
          "question": "A function that computes the size of each subtree from its children's sizes is using which kind of thinking?",
          "options": [
            "Answers combined from the children (postorder)",
            "Information passed down (preorder)",
            "Level order"
          ],
          "answer": 0,
          "why": "A node's size needs its children's sizes first, so the answers are combined on the way back up."
        }
      }
    ],
    "summary": [
      "A binary tree node has a value and up to two children; an empty tree is None.",
      "Preorder, inorder and postorder are depth-first walks that differ only in when the node is visited.",
      "Level order is breadth-first search with a queue; len(queue) at the start of a round is one level.",
      "Max depth = 1 + the larger depth of the two subtrees; empty trees have depth 0.",
      "Swap a queue for a stack to go from breadth-first to depth-first."
    ],
    "projectStep": {
      "title": "Tree tools",
      "steps": [
        "Add TreeNode, build(values) and level_order(root) to dsa_toolkit.py.",
        "Add max_depth(node) and the three depth-first walks.",
        "Bonus: add right_side_view(root) using level order."
      ]
    }
  },
  {
    "day": 17,
    "title": "Binary Search Trees (BST): Tree Invariants & Range Query Search",
    "goal": "You can explain the binary search tree rule, check whether a tree follows it, search it, and find the lowest common ancestor.",
    "minutes": 30,
    "recap": "Yesterday you walked binary trees depth-first and level by level. Today's trees keep their values in order, which makes searching fast.",
    "parts": [
      {
        "title": "The binary search tree rule",
        "say": [
          "A binary search tree (BST) is a binary tree with one rule: for every node, all values in its left subtree are smaller, and all values in its right subtree are bigger.",
          "The rule applies to whole subtrees, not just the direct children. A node deep in the left subtree must be smaller than every ancestor it sits to the left of.",
          "The rule makes searching like binary search: at each node, go left if the target is smaller and right if it is bigger. Each step skips a whole subtree.",
          "Walking a BST in inorder (left, node, right) gives the values in sorted order. That is a quick way to check your understanding of the rule.",
          "Databases and file systems use search trees like this (usually wider B-trees) to find records among billions quickly."
        ],
        "example": "A phone book arranged as a tree: at each page you ask \"is my name before or after this one?\" and open only one half. You never read the half that cannot contain your name.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef insert(node, val):\n    if node is None:\n        return TreeNode(val)\n    if val < node.val:\n        node.left = insert(node.left, val)\n    else:\n        node.right = insert(node.right, val)\n    return node\n\ndef inorder(node):\n    return inorder(node.left) + [node.val] + inorder(node.right) if node else []\n\nroot = None\nfor v in [50, 30, 70, 20, 40, 60, 80]:\n    root = insert(root, v)\nprint(inorder(root))\nprint(root.val, root.left.val, root.right.val)",
        "output": "[20, 30, 40, 50, 60, 70, 80]\n50 30 70",
        "codeNotes": [
          {
            "line": 11,
            "note": "Smaller values go into the left subtree."
          },
          {
            "line": 17,
            "note": "Inorder of a BST is sorted."
          }
        ],
        "tryIt": "Insert 65 and predict where it goes before running: right of 50, left of 70, right of 60.",
        "check": {
          "question": "In a BST, where are all values smaller than a node?",
          "options": [
            "In its right subtree",
            "In its left subtree",
            "Anywhere"
          ],
          "answer": 1,
          "why": "The BST rule puts every smaller value in the left subtree and every bigger value in the right subtree."
        }
      },
      {
        "title": "Searching and the cost of balance",
        "say": [
          "To search a BST, start at the root and move left or right until you find the value or reach None. Each step goes one level down.",
          "So search costs O(height). In a balanced BST the height is about log2 N, so search is O(log N): 20 steps for a million values.",
          "But inserting sorted data makes the tree a chain: every new value goes to the right of the last one. The height becomes N, and search becomes O(N), no better than a list.",
          "Self-balancing trees (like AVL and red-black trees) rotate nodes after inserts to keep the height near log N. You will not build them here, but you should know why they exist.",
          "Python has no built-in BST; dicts and sets use hashing instead. When you need sorted order with fast inserts, libraries like sortedcontainers fill that gap."
        ],
        "example": "A librarian filing books by always adding the next one to the right: after a while the \"tree\" is one long shelf, and finding a book means walking the whole shelf.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef insert(node, val):\n    if node is None:\n        return TreeNode(val)\n    if val < node.val:\n        node.left = insert(node.left, val)\n    else:\n        node.right = insert(node.right, val)\n    return node\n\ndef search_steps(node, target):\n    steps = 0\n    while node:\n        steps += 1\n        if target == node.val:\n            return steps\n        node = node.left if target < node.val else node.right\n    return steps\n\nbalanced = None\nfor v in [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15]:\n    balanced = insert(balanced, v)\nchain = None\nfor v in range(1, 16):\n    chain = insert(chain, v)\nprint(\"find 15 in balanced tree:\", search_steps(balanced, 15), \"steps\")\nprint(\"find 15 in chain:\", search_steps(chain, 15), \"steps\")",
        "output": "find 15 in balanced tree: 4 steps\nfind 15 in chain: 15 steps",
        "codeNotes": [
          {
            "line": 22,
            "note": "Each step skips a whole subtree."
          },
          {
            "line": 27,
            "note": "Inserted in a good order: height 4."
          },
          {
            "line": 30,
            "note": "Inserted in sorted order: a chain of height 15."
          }
        ],
        "tryIt": "Search both trees for 1. The balanced tree needs 4 steps and the chain only 1: the chain is fast only for the values at its start.",
        "check": {
          "question": "What is the search cost in a BST built by inserting 1, 2, 3, ..., N in order?",
          "options": [
            "O(log N)",
            "O(N)",
            "O(1)"
          ],
          "answer": 1,
          "why": "Sorted inserts make every node the right child of the previous one, a chain of height N, so search is O(N)."
        }
      },
      {
        "title": "Validating a BST with ranges",
        "say": [
          "Practice 1 checks whether a tree follows the BST rule. The trap: checking only that left child < node < right child is not enough, because the rule covers whole subtrees.",
          "The correct method passes an allowed range down the tree. The root may be anything. Going left, the upper limit becomes the node's value; going right, the lower limit becomes the node's value.",
          "Each node must lie strictly inside its range. If any node falls outside, the tree is not a valid BST. Start with low = float(\"-inf\") and high = float(\"inf\").",
          "This is the \"pass information down\" shape from yesterday. Every node is checked once: O(N).",
          "Another correct method uses inorder: a tree is a valid BST exactly when its inorder walk is strictly increasing."
        ],
        "example": "A seating plan where each row's organiser tells the next row \"your numbers must be between 10 and 20\". The limits get tighter as you go down, and one person outside their limits breaks the plan.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef is_valid_bst(node, low=float(\"-inf\"), high=float(\"inf\")):\n    if node is None:\n        return True\n    if not (low < node.val < high):\n        return False\n    return is_valid_bst(node.left, low, node.val) and is_valid_bst(node.right, node.val, high)\n\ngood = TreeNode(5, TreeNode(3, TreeNode(1), TreeNode(4)), TreeNode(8))\ntricky = TreeNode(5, TreeNode(1), TreeNode(7, TreeNode(4), TreeNode(9)))\nprint(is_valid_bst(good), is_valid_bst(tricky))",
        "output": "True False",
        "codeNotes": [
          {
            "line": 10,
            "note": "Each node must fit inside the range passed down to it."
          },
          {
            "line": 12,
            "note": "Left: the upper limit shrinks. Right: the lower limit rises."
          },
          {
            "line": 15,
            "note": "4 is below 7 but also in 5's right subtree, so it must be above 5."
          }
        ],
        "tryIt": "Change the 4 in the tricky tree to 6. Now every node fits its range and the answer is True.",
        "check": {
          "question": "Why is checking only \"left child < node < right child\" not enough?",
          "options": [
            "It is too slow",
            "A deeper node can break the rule for an ancestor",
            "Leaves have no children"
          ],
          "answer": 1,
          "why": "The rule covers whole subtrees; a grandchild can be on the correct side of its parent but the wrong side of the root."
        }
      },
      {
        "title": "Lowest common ancestor in a BST",
        "say": [
          "Practice 2: the lowest common ancestor (LCA) of two values p and q is the deepest node that has both of them in its subtree (a node counts as in its own subtree).",
          "In a BST the rule makes this easy. Start at the root. If both p and q are smaller than the node, the LCA must be in the left subtree. If both are bigger, it is in the right subtree.",
          "Otherwise they split: one goes left and one goes right, or one of them is the node itself. That node is the LCA.",
          "The walk goes down one path, so it costs O(height): O(log N) in a balanced tree.",
          "LCA answers questions like \"what is the closest shared manager of these two employees?\" or \"which folder contains both of these files?\"."
        ],
        "example": "Two cousins trying to find their closest shared ancestor in a family tree: follow the generations down from the oldest ancestor until the path to one cousin and the path to the other go different ways.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef lca(node, p, q):\n    while node:\n        if p < node.val and q < node.val:\n            node = node.left\n        elif p > node.val and q > node.val:\n            node = node.right\n        else:\n            return node.val\n\nroot = TreeNode(6,\n    TreeNode(2, TreeNode(0), TreeNode(4, TreeNode(3), TreeNode(5))),\n    TreeNode(8, TreeNode(7), TreeNode(9)))\nprint(lca(root, 2, 8), lca(root, 2, 4), lca(root, 3, 5))",
        "output": "6 2 4",
        "codeNotes": [
          {
            "line": 9,
            "note": "Both smaller: the answer is further left."
          },
          {
            "line": 14,
            "note": "They split here (or one is this node): this is the LCA."
          }
        ],
        "tryIt": "Find lca(root, 0, 5) and lca(root, 7, 9) and check them on the drawing in the code.",
        "check": {
          "question": "In a BST, p = 3 and q = 9 and the current node is 6. What is the LCA?",
          "options": [
            "3",
            "6",
            "9"
          ],
          "answer": 1,
          "why": "3 is smaller and 9 is bigger than 6, so they split at 6, which makes 6 the lowest common ancestor."
        }
      },
      {
        "title": "The k-th smallest and range queries",
        "say": [
          "Because inorder gives sorted order, the k-th smallest value is simply the k-th value in the inorder walk. You can stop as soon as you reach it instead of walking the whole tree.",
          "A range query asks for all values between low and high. Use the BST rule to skip subtrees: if the node is smaller than low, nothing useful is on its left.",
          "Skipping subtrees makes range queries fast even on big trees: the cost is about the height plus the number of results.",
          "These are the operations that make search trees useful in databases: \"the 10 cheapest products\" or \"orders between 1 March and 31 March\".",
          "You will meet another way to get the k-th smallest tomorrow, using a heap."
        ],
        "example": "Finding every book on a shelf between call numbers 400 and 500: you skip whole sections that are clearly outside the range instead of checking every book.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef kth_smallest(root, k):\n    stack, node = [], root\n    while stack or node:\n        while node:\n            stack.append(node)\n            node = node.left\n        node = stack.pop()\n        k -= 1\n        if k == 0:\n            return node.val\n        node = node.right\n\ndef in_range(node, low, high, out):\n    if node is None:\n        return out\n    if node.val > low:\n        in_range(node.left, low, high, out)\n    if low <= node.val <= high:\n        out.append(node.val)\n    if node.val < high:\n        in_range(node.right, low, high, out)\n    return out\n\nroot = TreeNode(50, TreeNode(30, TreeNode(20), TreeNode(40)), TreeNode(70, TreeNode(60), TreeNode(80)))\nprint(kth_smallest(root, 1), kth_smallest(root, 3))\nprint(in_range(root, 35, 65, []))",
        "output": "20 40\n[40, 50, 60]",
        "codeNotes": [
          {
            "line": 10,
            "note": "Go as far left as possible: the smallest values first."
          },
          {
            "line": 15,
            "note": "Count values in sorted order until the k-th."
          },
          {
            "line": 22,
            "note": "Only go left if smaller values could still be in range."
          }
        ],
        "tryIt": "Ask for kth_smallest(root, 7), the largest value. It should be 80.",
        "check": {
          "question": "What order does an inorder walk of a BST give?",
          "options": [
            "Level by level",
            "Sorted from smallest to largest",
            "Random"
          ],
          "answer": 1,
          "why": "Left subtree (smaller), node, right subtree (bigger), so inorder lists a BST in sorted order."
        }
      },
      {
        "title": "Deleting from a BST",
        "say": [
          "Deleting shows how the rule is protected. There are three cases. A leaf is simply removed. A node with one child is replaced by that child.",
          "A node with two children is the tricky case. Replace its value with the smallest value in its right subtree (its successor), then delete that successor from the right subtree.",
          "The successor is bigger than everything on the left and smaller than everything else on the right, so the rule still holds after the swap.",
          "Each case walks down one path, so delete costs O(height), like search and insert.",
          "You rarely write BST deletion at work, but it is a favourite interview question because it tests whether you really understand the rule."
        ],
        "example": "A manager leaving a company: if they have no team, the role disappears; if they have one direct report, that person moves up; with two teams, the most junior person who could lead the senior team takes the role.",
        "code": "class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef insert(node, val):\n    if node is None:\n        return TreeNode(val)\n    if val < node.val:\n        node.left = insert(node.left, val)\n    else:\n        node.right = insert(node.right, val)\n    return node\n\ndef delete(node, val):\n    if node is None:\n        return None\n    if val < node.val:\n        node.left = delete(node.left, val)\n    elif val > node.val:\n        node.right = delete(node.right, val)\n    else:\n        if node.left is None:\n            return node.right\n        if node.right is None:\n            return node.left\n        successor = node.right\n        while successor.left:\n            successor = successor.left\n        node.val = successor.val\n        node.right = delete(node.right, successor.val)\n    return node\n\ndef inorder(node):\n    return inorder(node.left) + [node.val] + inorder(node.right) if node else []\n\nroot = None\nfor v in [50, 30, 70, 20, 40, 60, 80]:\n    root = insert(root, v)\nroot = delete(root, 50)\nprint(root.val, inorder(root))",
        "output": "60 [20, 30, 40, 60, 70, 80]",
        "codeNotes": [
          {
            "line": 25,
            "note": "No left child: the right child takes this place (also handles leaves)."
          },
          {
            "line": 28,
            "note": "Two children: find the smallest value on the right."
          },
          {
            "line": 31,
            "note": "Copy it up, then delete it from the right subtree."
          }
        ],
        "tryIt": "Delete 20 (a leaf) and then 30 (now with one child) and print inorder each time. The list stays sorted.",
        "check": {
          "question": "When deleting a node with two children, which value replaces it?",
          "options": [
            "The largest value in the whole tree",
            "The smallest value in its right subtree",
            "Its left child"
          ],
          "answer": 1,
          "why": "The successor, the smallest value on the right, keeps everything on the left smaller and everything on the right bigger."
        }
      }
    ],
    "summary": [
      "BST rule: everything in the left subtree is smaller, everything in the right subtree is bigger.",
      "Search, insert and delete cost O(height): O(log N) balanced, O(N) for a chain.",
      "Validate a BST by passing an allowed range down, not by checking only direct children.",
      "The LCA is where p and q split to different sides.",
      "Inorder of a BST is sorted, which gives the k-th smallest and range queries."
    ],
    "projectStep": {
      "title": "BST tools",
      "steps": [
        "Add insert(node, val) and is_valid_bst(node) to dsa_toolkit.py.",
        "Add lca(node, p, q) and kth_smallest(root, k).",
        "Bonus: insert 1 to 1000 in random order and in sorted order, and compare max_depth of the two trees."
      ]
    }
  },
  {
    "day": 18,
    "title": "Min/Max Binary Heaps & Priority Queues",
    "goal": "You can build a min-heap in a list with sift up and sift down, and use heapq for top-k problems and priority queues.",
    "minutes": 30,
    "recap": "Yesterday you kept values in order in a binary search tree. A heap is a different tree: it only keeps the smallest value at the top.",
    "parts": [
      {
        "title": "A heap stored in a list",
        "say": [
          "A binary heap is a complete binary tree where every parent is smaller than or equal to its children (a min-heap). The smallest value is always at the root.",
          "Complete means every level is full except maybe the last, which fills from the left. That shape lets us store the tree in a plain list with no node objects at all.",
          "For the item at index i, its children are at 2i + 1 and 2i + 2, and its parent is at (i - 1) // 2. Moving around the tree is just arithmetic.",
          "A heap is only partly ordered: siblings can be in any order, and the list is not sorted. That weaker rule is why heap operations are cheaper than keeping everything sorted.",
          "Python's heapq module uses exactly this layout on a normal list, which is why h[0] is the smallest item."
        ],
        "example": "Seats in a stadium numbered row by row: seat i's two \"children\" in the row below are at fixed seat numbers, so you can find them without any map.",
        "code": "heap = [1, 3, 2, 7, 4, 5, 6]\n\ndef children(i):\n    return 2 * i + 1, 2 * i + 2\n\ndef parent(i):\n    return (i - 1) // 2\n\nfor i in range(3):\n    l, r = children(i)\n    print(\"parent\", heap[i], \"-> children\", heap[l], heap[r])\nprint(\"parent of index 5 is\", heap[parent(5)])\nprint(\"heap rule holds:\", all(heap[parent(i)] <= heap[i] for i in range(1, len(heap))))",
        "output": "parent 1 -> children 3 2\nparent 3 -> children 7 4\nparent 2 -> children 5 6\nparent of index 5 is 2\nheap rule holds: True",
        "codeNotes": [
          {
            "line": 4,
            "note": "Children of index i sit at 2i+1 and 2i+2."
          },
          {
            "line": 7,
            "note": "The parent sits at (i-1)//2."
          },
          {
            "line": 13,
            "note": "Every parent is <= its children."
          }
        ],
        "tryIt": "Change heap[4] from 4 to 0 and run it. The rule breaks, because 0 is smaller than its parent 3.",
        "check": {
          "question": "In a list-based heap, where are the children of the item at index 3?",
          "options": [
            "At 4 and 5",
            "At 7 and 8",
            "At 6 and 7"
          ],
          "answer": 1,
          "why": "Children are at 2 x 3 + 1 = 7 and 2 x 3 + 2 = 8."
        }
      },
      {
        "title": "Push with sift up",
        "say": [
          "To add a value, put it at the end of the list, which keeps the tree complete. The heap rule might now be broken between the new item and its parent.",
          "Fix it by sifting up: while the new item is smaller than its parent, swap them. It rises until its parent is smaller or it reaches the root.",
          "The tree has about log2 N levels, so sifting up takes at most log N swaps: push is O(log N).",
          "This is Practice 1's push. You will build the whole MinHeap class across the next two parts.",
          "A good habit: after each operation, check the heap rule holds for every parent. The check line from part 1 does this in one line."
        ],
        "example": "A new employee who is more senior than their manager swaps places with them, and keeps moving up the chart until their manager is more senior than them.",
        "code": "def push(heap, val):\n    heap.append(val)\n    i = len(heap) - 1\n    while i > 0:\n        p = (i - 1) // 2\n        if heap[i] < heap[p]:\n            heap[i], heap[p] = heap[p], heap[i]\n            i = p\n        else:\n            break\n\nheap = []\nfor x in [7, 3, 9, 1, 5]:\n    push(heap, x)\n    print(\"pushed\", x, \"->\", heap)",
        "output": "pushed 7 -> [7]\npushed 3 -> [3, 7]\npushed 9 -> [3, 7, 9]\npushed 1 -> [1, 3, 9, 7]\npushed 5 -> [1, 3, 9, 7, 5]",
        "codeNotes": [
          {
            "line": 2,
            "note": "Add at the end: the tree stays complete."
          },
          {
            "line": 7,
            "note": "Smaller than the parent: swap and keep rising."
          }
        ],
        "tryIt": "Push 0 at the end. It rises all the way to index 0 in about log2(6) swaps.",
        "check": {
          "question": "What is the cost of pushing into a heap of N items?",
          "options": [
            "O(1)",
            "O(log N)",
            "O(N)"
          ],
          "answer": 1,
          "why": "The new item rises at most one level per swap, and there are about log N levels."
        }
      },
      {
        "title": "Pop with sift down",
        "say": [
          "Pop removes the smallest item, the root. To keep the tree complete, move the last item into the root's place, which probably breaks the heap rule at the top.",
          "Fix it by sifting down: compare the item with its children and swap it with the smaller child, as long as that child is smaller. Repeat until it is smaller than both children or has none.",
          "Swapping with the smaller child matters: it guarantees the new parent is smaller than the other child too.",
          "Sifting down also takes at most log N steps, so pop is O(log N). peek (heap[0]) is O(1).",
          "Popping every item one by one gives them in sorted order. That is heap sort: N pops of O(log N) each, O(N log N) in total."
        ],
        "example": "When the top manager leaves, the most junior person is put in charge temporarily and keeps stepping down below whichever of their two reports is more senior, until the order is right again.",
        "code": "def pop(heap):\n    smallest = heap[0]\n    last = heap.pop()\n    if heap:\n        heap[0] = last\n        i = 0\n        while True:\n            l, r, small = 2 * i + 1, 2 * i + 2, i\n            if l < len(heap) and heap[l] < heap[small]: small = l\n            if r < len(heap) and heap[r] < heap[small]: small = r\n            if small == i:\n                break\n            heap[i], heap[small] = heap[small], heap[i]\n            i = small\n    return smallest\n\nheap = [1, 3, 7, 9, 5]\nprint([pop(heap) for _ in range(5)])",
        "output": "[1, 3, 5, 7, 9]",
        "codeNotes": [
          {
            "line": 5,
            "note": "The last item fills the root's place."
          },
          {
            "line": 10,
            "note": "Pick the smaller of the two children."
          },
          {
            "line": 18,
            "note": "Popping everything gives sorted order: heap sort."
          }
        ],
        "tryIt": "Print heap after the first pop only. It should be [3, 5, 7, 9].",
        "check": {
          "question": "When sifting down, which child do you swap with?",
          "options": [
            "The left child always",
            "The smaller child",
            "The larger child"
          ],
          "answer": 1,
          "why": "Swapping with the smaller child makes the new parent smaller than both children, keeping the heap rule."
        }
      },
      {
        "title": "heapq and the k-th smallest",
        "say": [
          "In real code, use heapq: heappush, heappop, heapify (turns a list into a heap in O(N)), nsmallest and nlargest.",
          "Practice 2 asks for the k-th smallest number with heapq. One way: heapify the list, then pop k - 1 times; the next item is the answer. That is O(N + k log N).",
          "Another way keeps a max-heap of size k (using negatives): push each number, and if the heap grows beyond k, pop the largest. At the end, the top is the k-th smallest. That is O(N log k) and uses only O(k) memory.",
          "The size-k heap is the better choice when the data is a huge stream and k is small, because you never store more than k numbers.",
          "heapq also accepts tuples, compared item by item, so you can push (priority, name) pairs and get the lowest priority first."
        ],
        "example": "Keeping only your 3 best exam scores on a card: when a new score beats the worst of the three, you cross that one out. You never need the full list of scores.",
        "code": "import heapq\n\ndef kth_smallest_heapify(nums, k):\n    h = list(nums)\n    heapq.heapify(h)\n    for _ in range(k - 1):\n        heapq.heappop(h)\n    return h[0]\n\ndef kth_smallest_bounded(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, -x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return -h[0]\n\nnums = [7, 10, 4, 3, 20, 15]\nprint(kth_smallest_heapify(nums, 3), kth_smallest_bounded(nums, 3))\nprint(heapq.nsmallest(3, nums))",
        "output": "7 7\n[3, 4, 7]",
        "codeNotes": [
          {
            "line": 5,
            "note": "heapify builds a heap from a list in O(N)."
          },
          {
            "line": 15,
            "note": "Too many: drop the largest, keeping the k smallest."
          }
        ],
        "tryIt": "Find the 2nd smallest of [5, 1, 9, 1, 7]. With duplicates allowed, it is 1.",
        "check": {
          "question": "Why keep a heap of size k instead of heapifying all N numbers?",
          "options": [
            "It is always faster",
            "It uses only O(k) memory, good for huge streams",
            "It gives a different answer"
          ],
          "answer": 1,
          "why": "The bounded heap never stores more than k items, so it works on streams too big to hold in memory."
        }
      },
      {
        "title": "Priority queues for tasks",
        "say": [
          "A heap is the natural way to build a priority queue: items come out by priority, not by arrival time. The operating system uses one to decide which program runs next.",
          "Push (priority, order, task) tuples. The counter breaks ties between equal priorities, so equal-priority tasks come out in arrival order and Python never has to compare the tasks themselves.",
          "You will use a priority queue on Day 21 (top auto-complete suggestions) and Day 22 (Dijkstra's shortest path always expands the closest node first).",
          "When you hear \"always handle the most urgent next\" or \"repeatedly take the smallest\", think heap.",
          "Priority queues are also how event simulations work: each event has a time, and the next event to happen is always the one with the smallest time."
        ],
        "example": "An airline boarding queue: business class boards first whatever time they arrived, and within business class, first come first served. Priority first, then arrival order.",
        "code": "import heapq\nfrom itertools import count\n\nqueue, order = [], count()\ndef add(priority, task):\n    heapq.heappush(queue, (priority, next(order), task))\n\nadd(3, \"send newsletter\")\nadd(1, \"fix payment outage\")\nadd(2, \"reply to customer\")\nadd(1, \"restart server\")\nwhile queue:\n    priority, _, task = heapq.heappop(queue)\n    print(priority, task)",
        "output": "1 fix payment outage\n1 restart server\n2 reply to customer\n3 send newsletter",
        "codeNotes": [
          {
            "line": 6,
            "note": "The counter breaks ties: equal priorities keep arrival order."
          },
          {
            "line": 13,
            "note": "Always the lowest priority number first."
          }
        ],
        "tryIt": "Add add(0, \"security breach\") at the end, before the while loop. It jumps to the front.",
        "check": {
          "question": "Why include a counter in the tuples pushed into the priority queue?",
          "options": [
            "To make it faster",
            "To break ties so equal priorities keep arrival order",
            "heapq requires three items"
          ],
          "answer": 1,
          "why": "With equal priorities, the counter decides the order, so tasks never need to be compared themselves."
        }
      },
      {
        "title": "Merging k sorted lists with a heap",
        "say": [
          "A heap solves \"merge k sorted lists\" efficiently. Put the first item of each list into a heap, along with which list it came from.",
          "Pop the smallest, add it to the result, and push the next item from the same list. The heap always holds at most k items, one per list.",
          "Each of the N total items is pushed and popped once, at O(log k) each: O(N log k). Merging the lists two at a time would be slower.",
          "This is how search engines combine results from many servers, and how databases merge sorted files when sorting data too big for memory.",
          "Python even has heapq.merge, which does exactly this lazily, producing items one at a time."
        ],
        "example": "Three counters selling tickets, each with its queue already sorted by token number. The announcer always calls the smallest token at the front of any counter.",
        "code": "import heapq\n\ndef merge_k(lists):\n    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]\n    heapq.heapify(heap)\n    result = []\n    while heap:\n        val, i, j = heapq.heappop(heap)\n        result.append(val)\n        if j + 1 < len(lists[i]):\n            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))\n    return result\n\nlists = [[1, 4, 7], [2, 5, 8], [0, 3, 6, 9]]\nprint(merge_k(lists))\nprint(list(heapq.merge(*lists)))",
        "output": "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\n[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Start with the first item of each list."
          },
          {
            "line": 11,
            "note": "Replace it with the next item from the same list."
          }
        ],
        "tryIt": "Add an empty list [] to lists. The if on line 4 skips it, and the result is unchanged.",
        "check": {
          "question": "What is the cost of merging k sorted lists with N items in total using a heap?",
          "options": [
            "O(N log k)",
            "O(N k)",
            "O(k)"
          ],
          "answer": 0,
          "why": "Each item goes through a heap of at most k items once: O(log k) per item, O(N log k) in total."
        }
      }
    ],
    "summary": [
      "A min-heap keeps every parent <= its children; the smallest is at index 0.",
      "Stored in a list: children at 2i+1 and 2i+2, parent at (i-1)//2.",
      "push sifts up and pop sifts down: both O(log N); peek is O(1).",
      "heapq gives heappush, heappop, heapify, nsmallest, nlargest and merge.",
      "Heaps power priority queues, top-k, k-way merge, Dijkstra and more."
    ],
    "projectStep": {
      "title": "Heap tools",
      "steps": [
        "Add a MinHeap class with push, pop, peek and size to dsa_toolkit.py, using today's sift up and sift down.",
        "Add kth_smallest_bounded(nums, k) with heapq.",
        "Bonus: add merge_k(lists) and test it on three sorted lists of your own."
      ]
    }
  },
  {
    "day": 19,
    "title": "Tries (Prefix Trees) & Fast Prefix Auto-Complete",
    "goal": "You can build a trie (prefix tree), check words and prefixes in O(length of the word), and list every word with a given prefix.",
    "minutes": 30,
    "recap": "Yesterday you used heaps to always get the smallest item fast. Today's tree is built from letters, for finding words by their beginning.",
    "parts": [
      {
        "title": "A tree of letters",
        "say": [
          "A trie (pronounced \"try\", from retrieval) stores words by their letters. Each node represents a prefix, and each edge adds one letter. The root is the empty prefix.",
          "Words that share a beginning share a path. \"car\", \"card\" and \"care\" share the nodes for c, a and r, and then branch.",
          "Each node has a dict of children, from letter to node, and a flag is_end that marks where a complete word ends. Without the flag you could not tell the word \"car\" from a mere prefix of \"card\".",
          "Looking up a word takes one step per letter, so it costs O(L), where L is the word's length, no matter how many words are stored.",
          "Tries power the auto-complete in search boxes, spell checkers and the routing tables inside internet routers."
        ],
        "example": "A dictionary with thumb tabs: you open the C section, then the CA pages, then CAR. Every word starting with CAR is together, so you never read the rest of the dictionary.",
        "code": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nroot = TrieNode()\nfor word in [\"car\", \"card\", \"care\", \"dog\"]:\n    node = root\n    for ch in word:\n        node = node.children.setdefault(ch, TrieNode())\n    node.is_end = True\n\nprint(\"first letters:\", sorted(root.children))\nc_a_r = root.children[\"c\"].children[\"a\"].children[\"r\"]\nprint(\"after c-a-r:\", sorted(c_a_r.children), \"| car is a word:\", c_a_r.is_end)",
        "output": "first letters: ['c', 'd']\nafter c-a-r: ['d', 'e'] | car is a word: True",
        "codeNotes": [
          {
            "line": 10,
            "note": "Follow the letter's child, creating it if it is missing."
          },
          {
            "line": 11,
            "note": "Mark the end of a complete word."
          },
          {
            "line": 15,
            "note": "\"car\" ends here, and \"card\" and \"care\" continue."
          }
        ],
        "tryIt": "Insert \"cat\" as well and print sorted(root.children[\"c\"].children[\"a\"].children). It should show ['r', 't'].",
        "check": {
          "question": "Why does each trie node need an is_end flag?",
          "options": [
            "To count letters",
            "To tell complete words apart from prefixes",
            "To sort the children"
          ],
          "answer": 1,
          "why": "Without it, \"car\" would look the same as the prefix of \"card\"; is_end marks where a real word stops."
        }
      },
      {
        "title": "insert, search and starts_with",
        "say": [
          "Practice 1 builds a Trie class with three methods. insert walks the letters, creating missing nodes, and sets is_end on the last one.",
          "search walks the letters; if a letter is missing it returns False straight away. If the walk finishes, the answer is the last node's is_end.",
          "starts_with is the same walk, but it returns True as soon as the walk finishes, whether or not a word ends there.",
          "A private helper that walks a string and returns the final node (or None) removes the repeated code from search and starts_with.",
          "All three methods are O(L) for a word of length L. A set could check whole words in O(1), but it cannot answer \"does any word start with this?\" quickly. That is the trie's strength."
        ],
        "example": "Typing a phone contact's name letter by letter: after \"Ra\" the phone knows there are contacts starting that way (starts_with), and after \"Ravi\" it knows one is exactly Ravi (search).",
        "code": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for ch in word:\n            node = node.children.setdefault(ch, TrieNode())\n        node.is_end = True\n\n    def _walk(self, text):\n        node = self.root\n        for ch in text:\n            node = node.children.get(ch)\n            if node is None:\n                return None\n        return node\n\n    def search(self, word):\n        node = self._walk(word)\n        return node is not None and node.is_end\n\n    def starts_with(self, prefix):\n        return self._walk(prefix) is not None\n\nt = Trie()\nfor w in [\"apple\", \"app\", \"apply\"]:\n    t.insert(w)\nprint(t.search(\"app\"), t.search(\"appl\"), t.starts_with(\"appl\"), t.starts_with(\"b\"))",
        "output": "True False True False",
        "codeNotes": [
          {
            "line": 19,
            "note": ".get returns None when the letter is missing."
          },
          {
            "line": 26,
            "note": "A whole word only if the walk ends on an is_end node."
          },
          {
            "line": 29,
            "note": "A prefix only needs the walk to succeed."
          }
        ],
        "tryIt": "Insert \"ban\" and \"banana\". Check search(\"bana\") (False) and starts_with(\"bana\") (True).",
        "check": {
          "question": "A trie holds only \"apple\". What do search(\"app\") and starts_with(\"app\") return?",
          "options": [
            "True and True",
            "False and True",
            "False and False"
          ],
          "answer": 1,
          "why": "\"app\" is a prefix of \"apple\" but not a complete word, so search is False and starts_with is True."
        }
      },
      {
        "title": "Listing words with a prefix",
        "say": [
          "Practice 2 lists every word starting with a prefix. First walk down to the prefix's node. If it does not exist, the answer is an empty list.",
          "Then explore everything below that node with depth-first search, building the word letter by letter. Whenever you reach a node with is_end, add the word so far to the results.",
          "Visiting children in sorted letter order gives the words in alphabetical order, which is what a suggestion box usually shows.",
          "The cost is the prefix length plus the size of the part of the trie below it, which is usually small compared with the whole dictionary.",
          "This is the first half of tomorrow's and Day 21's auto-complete engine; the second half ranks the suggestions by popularity."
        ],
        "example": "Typing \"pyt\" in a search bar and seeing \"python\", \"python course\" and \"pytorch\": the app jumped to the \"pyt\" section and listed everything under it.",
        "code": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\ndef insert(root, word):\n    node = root\n    for ch in word:\n        node = node.children.setdefault(ch, TrieNode())\n    node.is_end = True\n\ndef words_with_prefix(root, prefix):\n    node = root\n    for ch in prefix:\n        if ch not in node.children:\n            return []\n        node = node.children[ch]\n    found = []\n    def dfs(n, word):\n        if n.is_end:\n            found.append(word)\n        for ch in sorted(n.children):\n            dfs(n.children[ch], word + ch)\n    dfs(node, prefix)\n    return found\n\nroot = TrieNode()\nfor w in [\"car\", \"care\", \"card\", \"cart\", \"cat\", \"dog\"]:\n    insert(root, w)\nprint(words_with_prefix(root, \"car\"))\nprint(words_with_prefix(root, \"ca\"))\nprint(words_with_prefix(root, \"z\"))",
        "output": "['car', 'card', 'care', 'cart']\n['car', 'card', 'care', 'cart', 'cat']\n[]",
        "codeNotes": [
          {
            "line": 16,
            "note": "The prefix is not in the trie: no words."
          },
          {
            "line": 21,
            "note": "A complete word below the prefix."
          },
          {
            "line": 22,
            "note": "Sorted letters give alphabetical results."
          }
        ],
        "tryIt": "Insert your own name and a few names that start the same way, then list them by their first two letters.",
        "check": {
          "question": "How does words_with_prefix find the words below the prefix?",
          "options": [
            "It checks every word in the dictionary",
            "It walks to the prefix node, then does a depth-first search below it",
            "It uses binary search"
          ],
          "answer": 1,
          "why": "Only the part of the trie under the prefix node is explored."
        }
      },
      {
        "title": "Counting words and prefixes",
        "say": [
          "Tries can store extra information in each node. A count of how many words pass through a node answers \"how many words start with this prefix?\" in O(L), without listing them.",
          "Increase the count on every node along the path during insert. The count at the prefix's node is the answer.",
          "You can also store a word's frequency at its end node, which is exactly what an auto-complete ranking needs. You will do that on Day 21.",
          "Storing more in each node uses more memory but makes common questions instant. It is the same memory-for-speed trade you have seen all month.",
          "Deleting a word is the reverse: lower the counts along its path and clear is_end on its last node."
        ],
        "example": "A library tracking how many borrowed books start with each call-number prefix, updated whenever a book is borrowed, instead of counting the shelves every time someone asks.",
        "code": "class Node:\n    def __init__(self):\n        self.children = {}\n        self.count = 0\n\nroot = Node()\ndef insert(word):\n    node = root\n    for ch in word:\n        node = node.children.setdefault(ch, Node())\n        node.count += 1\n\ndef count_prefix(prefix):\n    node = root\n    for ch in prefix:\n        if ch not in node.children:\n            return 0\n        node = node.children[ch]\n    return node.count\n\nfor w in [\"apple\", \"apply\", \"ape\", \"banana\", \"band\"]:\n    insert(w)\nprint(count_prefix(\"ap\"), count_prefix(\"app\"), count_prefix(\"ban\"), count_prefix(\"x\"))",
        "output": "3 2 2 0",
        "codeNotes": [
          {
            "line": 11,
            "note": "Every node on the path counts one more word."
          },
          {
            "line": 19,
            "note": "The count at the prefix node answers in O(L)."
          }
        ],
        "tryIt": "Insert \"application\" and check count_prefix(\"app\") again: it goes from 2 to 3.",
        "check": {
          "question": "What does the count stored in a trie node represent here?",
          "options": [
            "How many children it has",
            "How many inserted words pass through it",
            "Its depth"
          ],
          "answer": 1,
          "why": "Every insert adds 1 to each node along its path, so the count is the number of words with that prefix."
        }
      },
      {
        "title": "Tries versus sets and sorted lists",
        "say": [
          "You could store words in a set: whole-word checks are O(L) for hashing, but finding all words with a prefix means checking every word.",
          "A sorted list with bisect can find the range of words starting with a prefix in O(log N): search for the prefix, then read forward while words still start with it.",
          "A trie finds prefixes in O(L) regardless of N and shares memory between words with common beginnings. But each node has its own dict, so tries can use a lot of memory for large dictionaries.",
          "For an interview auto-complete question, the trie is the expected answer. In production, sorted lists or specialised search engines are also common. Knowing the options is what matters.",
          "Compressed tries (radix trees) merge long single-child chains into one node to save memory; routers use them for IP addresses."
        ],
        "example": "Three ways to find every contact starting with \"Ra\": flip through every card (set), jump to the R tab in an alphabetical card box (sorted list), or use a card box with a tab for every letter pair (trie).",
        "code": "import bisect\n\nwords = sorted([\"car\", \"card\", \"care\", \"cat\", \"dog\", \"cart\", \"apple\"])\n\ndef prefix_range(sorted_words, prefix):\n    start = bisect.bisect_left(sorted_words, prefix)\n    out = []\n    for w in sorted_words[start:]:\n        if not w.startswith(prefix):\n            break\n        out.append(w)\n    return out\n\nprint(prefix_range(words, \"car\"))\nprint([w for w in words if w.startswith(\"car\")])",
        "output": "['car', 'card', 'care', 'cart']\n['car', 'card', 'care', 'cart']",
        "codeNotes": [
          {
            "line": 6,
            "note": "Binary search finds where the prefix would go."
          },
          {
            "line": 9,
            "note": "Stop at the first word that no longer matches."
          },
          {
            "line": 15,
            "note": "The set-style approach checks every word."
          }
        ],
        "tryIt": "Add \"carbon\" and \"careful\" to the words and check that both methods still agree.",
        "check": {
          "question": "What is a trie's main advantage over a set of words?",
          "options": [
            "Less memory always",
            "Fast prefix questions, independent of how many words there are",
            "Faster whole-word checks"
          ],
          "answer": 1,
          "why": "A trie answers \"which words start with this?\" by walking only the prefix, while a set must check every word."
        }
      },
      {
        "title": "A word-search game with a trie",
        "say": [
          "Tries shine when you must check many prefixes at once, for example finding dictionary words in a grid of letters (like Boggle).",
          "Without a trie you would try every path in the grid and check each one against the dictionary. With a trie you stop a path as soon as its letters are not a prefix of any word: that is the pruning idea from Day 11.",
          "Walk the grid with depth-first search, moving through the trie at the same time. When the trie node has is_end, record the word.",
          "Marking cells as visited during a path, and unmarking them afterwards, is backtracking again: choose, explore, un-choose.",
          "This combines three topics from this month: tries, depth-first search and backtracking with pruning."
        ],
        "example": "Playing a word game where you stop reading a line of letters the moment it cannot start any real word, like \"XQZ\", instead of reading to the end.",
        "code": "def find_words(grid, words):\n    trie = {}\n    for w in words:\n        node = trie\n        for ch in w:\n            node = node.setdefault(ch, {})\n        node[\"$\"] = w\n    rows, cols, found = len(grid), len(grid[0]), set()\n\n    def dfs(r, c, node):\n        ch = grid[r][c]\n        if ch not in node:\n            return\n        node = node[ch]\n        if \"$\" in node:\n            found.add(node[\"$\"])\n        grid[r][c] = \"#\"\n        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < rows and 0 <= nc < cols:\n                dfs(nr, nc, node)\n        grid[r][c] = ch\n\n    for r in range(rows):\n        for c in range(cols):\n            dfs(r, c, trie)\n    return sorted(found)\n\ngrid = [list(\"oath\"), list(\"etae\"), list(\"ihkr\"), list(\"iflv\")]\nprint(find_words(grid, [\"oath\", \"pea\", \"eat\", \"rain\", \"hike\"]))",
        "output": "['eat', 'oath']",
        "codeNotes": [
          {
            "line": 7,
            "note": "A plain-dict trie; \"$\" marks the end and stores the word."
          },
          {
            "line": 12,
            "note": "Not a prefix of any word: stop this path (pruning)."
          },
          {
            "line": 17,
            "note": "Mark the cell used for this path, and restore it after."
          }
        ],
        "tryIt": "Add \"the\" to the word list. It is in the grid too, so it appears in the result.",
        "check": {
          "question": "How does the trie speed up the word search?",
          "options": [
            "It sorts the grid",
            "It stops paths whose letters are not a prefix of any word",
            "It checks words in parallel"
          ],
          "answer": 1,
          "why": "As soon as a path's letters are not in the trie, that path cannot become a word, so it is abandoned."
        }
      }
    ],
    "summary": [
      "A trie stores words letter by letter; shared beginnings share nodes.",
      "Each node has a dict of children and an is_end flag for complete words.",
      "insert, search and starts_with all cost O(L) for a word of length L.",
      "List words with a prefix by walking to the prefix node and doing a DFS below it.",
      "Extra data in nodes (counts, frequencies) answers prefix questions instantly."
    ],
    "projectStep": {
      "title": "Trie tools",
      "steps": [
        "Add the Trie class with insert, search and starts_with to dsa_toolkit.py.",
        "Add words_with_prefix(trie_root, prefix) returning words in alphabetical order.",
        "Bonus: load 50 words of your choice and print how many start with each letter using prefix counts."
      ]
    }
  },
  {
    "day": 20,
    "title": "Graph Representations (Adjacency List/Matrix) & BFS/DFS",
    "goal": "You can store a graph as an adjacency list, find shortest paths with BFS, explore with DFS and count connected groups.",
    "minutes": 30,
    "recap": "You have used trees all week. A graph is a tree without the rules: any node can connect to any other, and there can be loops.",
    "parts": [
      {
        "title": "Graphs and how to store them",
        "say": [
          "A graph is a set of nodes (also called vertices) connected by edges. Cities and roads, people and friendships, web pages and links are all graphs.",
          "Edges can be undirected (a friendship goes both ways) or directed (a follow on social media goes one way). They can also have weights, like distances; that is Day 22.",
          "The usual way to store a graph in Python is an adjacency list: a dict mapping each node to the list of its neighbours. It uses O(V + E) memory for V nodes and E edges.",
          "An adjacency matrix, a V by V grid of 0s and 1s, answers \"is there an edge from a to b?\" in O(1), but uses V^2 memory even when few edges exist. For big sparse graphs like social networks, adjacency lists win.",
          "Building the adjacency list from a list of edges is the first step of almost every graph problem."
        ],
        "example": "A metro map: stations are nodes and the tracks between them are edges. For each station, the map lists which stations you can reach in one stop: that is the adjacency list.",
        "code": "from collections import defaultdict\n\nedges = [(\"Majestic\", \"MG Road\"), (\"MG Road\", \"Indiranagar\"), (\"Majestic\", \"Vijayanagar\"), (\"Indiranagar\", \"Baiyappanahalli\")]\ngraph = defaultdict(list)\nfor a, b in edges:\n    graph[a].append(b)\n    graph[b].append(a)\n\nfor station in sorted(graph):\n    print(station, \"->\", graph[station])\n\nn = len(graph)\nprint(\"matrix cells:\", n * n, \"| list entries:\", 2 * len(edges))",
        "output": "Baiyappanahalli -> ['Indiranagar']\nIndiranagar -> ['MG Road', 'Baiyappanahalli']\nMG Road -> ['Majestic', 'Indiranagar']\nMajestic -> ['MG Road', 'Vijayanagar']\nVijayanagar -> ['Majestic']\nmatrix cells: 25 | list entries: 8",
        "codeNotes": [
          {
            "line": 4,
            "note": "defaultdict(list) creates an empty list for a new node automatically."
          },
          {
            "line": 7,
            "note": "Undirected: add the edge in both directions."
          },
          {
            "line": 13,
            "note": "A matrix stores every pair; the list stores only real edges."
          }
        ],
        "tryIt": "Make the graph directed by deleting line 7, then print it again. Stations only list the stations their tracks lead to.",
        "check": {
          "question": "Why is an adjacency list usually preferred for large social networks?",
          "options": [
            "It is faster to draw",
            "It uses memory for real edges only, not every possible pair",
            "It sorts friends"
          ],
          "answer": 1,
          "why": "Each person has relatively few friends, so storing only real edges (O(V + E)) uses far less memory than a V x V matrix."
        }
      },
      {
        "title": "BFS: shortest path in steps",
        "say": [
          "Practice 1 finds the fewest edges between two nodes in an unweighted graph. Breadth-first search does this naturally, because it explores nodes in order of their distance from the start.",
          "Use a queue of (node, distance) pairs and a visited set. Start with (start, 0). Pop a node; if it is the target, return its distance. Otherwise push each unvisited neighbour with distance + 1.",
          "Mark a node visited when you push it, not when you pop it. That stops the same node being added to the queue many times.",
          "Graphs can have cycles, unlike trees, so the visited set is essential. Without it, BFS on a graph with a loop would run forever.",
          "BFS visits every node and edge at most once: O(V + E) time."
        ],
        "example": "Degrees of separation on social media: your friends are 1 step away, their friends are 2 steps. Checking all 1-step people before any 2-step people is exactly breadth-first search.",
        "code": "from collections import deque\n\ndef shortest_path(graph, start, target):\n    queue = deque([(start, 0)])\n    visited = {start}\n    while queue:\n        node, dist = queue.popleft()\n        if node == target:\n            return dist\n        for nb in graph.get(node, []):\n            if nb not in visited:\n                visited.add(nb)\n                queue.append((nb, dist + 1))\n    return -1\n\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [\"D\"], \"C\": [\"D\", \"E\"], \"D\": [\"F\"], \"E\": [\"F\"], \"F\": []}\nprint(shortest_path(graph, \"A\", \"F\"), shortest_path(graph, \"A\", \"A\"), shortest_path(graph, \"F\", \"A\"))",
        "output": "3 0 -1",
        "codeNotes": [
          {
            "line": 5,
            "note": "Remember nodes already queued; graphs can have loops."
          },
          {
            "line": 12,
            "note": "Mark visited when pushing, so a node is queued once."
          },
          {
            "line": 14,
            "note": "The queue emptied without reaching the target."
          }
        ],
        "tryIt": "Also record each node's parent when you push it, then rebuild the actual path from F back to A.",
        "check": {
          "question": "Why does BFS find the fewest edges in an unweighted graph?",
          "options": [
            "It is random",
            "It explores all nodes at distance d before any at distance d + 1",
            "It uses a stack"
          ],
          "answer": 1,
          "why": "Nodes leave the queue in order of distance, so the first time the target is reached, it is by a shortest path."
        }
      },
      {
        "title": "DFS: going deep",
        "say": [
          "Depth-first search follows one path as far as it can before backing up. It can be written recursively or with a stack, just like the tree walks on Day 16.",
          "DFS does not find shortest paths, but it is ideal for \"can I reach this?\", \"which nodes are connected?\", finding cycles, and exploring mazes.",
          "The visited set is still needed, for the same reason: cycles.",
          "Recursive DFS is short and clear, but for very large graphs the recursion depth can hit Python's limit. The stack version has no such limit.",
          "Both BFS and DFS are O(V + E). Choose BFS for shortest steps; choose either for reachability."
        ],
        "example": "Exploring a maze by always taking the first unexplored turn and only going back when you hit a dead end, dropping a pebble at each junction so you know where you have been.",
        "code": "def dfs_recursive(graph, node, visited=None):\n    if visited is None:\n        visited = []\n    visited.append(node)\n    for nb in graph[node]:\n        if nb not in visited:\n            dfs_recursive(graph, nb, visited)\n    return visited\n\ndef dfs_stack(graph, start):\n    visited, stack = [], [start]\n    while stack:\n        node = stack.pop()\n        if node in visited:\n            continue\n        visited.append(node)\n        for nb in reversed(graph[node]):\n            stack.append(nb)\n    return visited\n\ngraph = {\"A\": [\"B\", \"C\"], \"B\": [\"D\"], \"C\": [\"E\"], \"D\": [\"A\"], \"E\": []}\nprint(dfs_recursive(graph, \"A\"))\nprint(dfs_stack(graph, \"A\"))",
        "output": "['A', 'B', 'D', 'C', 'E']\n['A', 'B', 'D', 'C', 'E']",
        "codeNotes": [
          {
            "line": 6,
            "note": "Skip nodes already seen: D links back to A."
          },
          {
            "line": 17,
            "note": "Reversed so the first neighbour is explored first, matching the recursive version."
          }
        ],
        "tryIt": "Remove the check on line 6 and run it. The cycle A -> B -> D -> A makes it loop until Python stops it.",
        "check": {
          "question": "Which search should you use to find the fewest steps between two nodes?",
          "options": [
            "DFS",
            "BFS",
            "Either gives the fewest steps"
          ],
          "answer": 1,
          "why": "BFS explores in order of distance; DFS may find a long path first."
        }
      },
      {
        "title": "Counting connected components",
        "say": [
          "Practice 2 counts how many separate groups (connected components) an undirected graph has, for n nodes and a list of edges.",
          "Build the adjacency list. Then go through every node. If it has not been visited, it starts a new group: add 1 to the count and run BFS or DFS from it to mark its whole group visited.",
          "Every node is visited once and every edge looked at twice (once from each end): O(V + E).",
          "Nodes with no edges at all are groups of their own. Building the adjacency list for all n nodes, even those without edges, makes sure they are counted.",
          "Component counting finds friend circles, separate islands on a map, and disconnected parts of a computer network."
        ],
        "example": "Counting how many separate friend circles there are at a school: pick any student not yet in a circle, find everyone connected to them, and call that one circle. Repeat until everyone is placed.",
        "code": "from collections import deque\n\ndef count_components(n, edges):\n    graph = {i: [] for i in range(n)}\n    for a, b in edges:\n        graph[a].append(b)\n        graph[b].append(a)\n    visited, groups = set(), 0\n    for start in range(n):\n        if start in visited:\n            continue\n        groups += 1\n        queue = deque([start])\n        visited.add(start)\n        while queue:\n            node = queue.popleft()\n            for nb in graph[node]:\n                if nb not in visited:\n                    visited.add(nb)\n                    queue.append(nb)\n    return groups\n\nprint(count_components(5, [[0, 1], [1, 2], [3, 4]]))\nprint(count_components(4, []))",
        "output": "2\n4",
        "codeNotes": [
          {
            "line": 4,
            "note": "Every node gets a list, even with no edges."
          },
          {
            "line": 12,
            "note": "An unvisited node starts a new group."
          },
          {
            "line": 15,
            "note": "BFS marks the whole group as visited."
          }
        ],
        "tryIt": "Add the edge [2, 3] to the first example. The two groups join, so the answer becomes 1.",
        "check": {
          "question": "A graph has 6 nodes and no edges. How many connected components does it have?",
          "options": [
            "0",
            "1",
            "6"
          ],
          "answer": 2,
          "why": "With no edges, every node is a group on its own: 6 components."
        }
      },
      {
        "title": "Grids are graphs too",
        "say": [
          "A grid, like a map of land and water, is a graph in disguise. Each cell is a node, and its neighbours are the cells up, down, left and right.",
          "You do not need to build an adjacency list. Loop over the four directions and check the new position is inside the grid.",
          "Counting islands (groups of land cells) is the component count from the last part, on a grid: start a BFS or DFS from every land cell not yet visited.",
          "Shortest paths in a maze are BFS on a grid, with walls as cells you cannot enter.",
          "Grid problems are among the most common graph questions in interviews, so practise writing the four-direction loop until it is automatic."
        ],
        "example": "A satellite photo of the Lakshadweep islands divided into squares: land squares that touch each other form one island. Counting islands means counting groups of touching land squares.",
        "code": "def count_islands(grid):\n    rows, cols = len(grid), len(grid[0])\n    seen = set()\n    islands = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == \"1\" and (r, c) not in seen:\n                islands += 1\n                stack = [(r, c)]\n                seen.add((r, c))\n                while stack:\n                    cr, cc = stack.pop()\n                    for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:\n                        nr, nc = cr + dr, cc + dc\n                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == \"1\" and (nr, nc) not in seen:\n                            seen.add((nr, nc))\n                            stack.append((nr, nc))\n    return islands\n\ngrid = [\"11000\", \"11000\", \"00100\", \"00011\"]\nprint(count_islands(grid))",
        "output": "3",
        "codeNotes": [
          {
            "line": 7,
            "note": "Unvisited land starts a new island."
          },
          {
            "line": 13,
            "note": "The four neighbours of a cell."
          },
          {
            "line": 15,
            "note": "Inside the grid, land, and not seen yet."
          }
        ],
        "tryIt": "Change the grid's third row to \"01100\". The first two islands join into one, so the count drops to 2.",
        "check": {
          "question": "In a grid problem, what are a cell's neighbours usually?",
          "options": [
            "Every other cell",
            "The cells up, down, left and right",
            "Only the cell to the right"
          ],
          "answer": 1,
          "why": "Grid graphs usually connect each cell to its four side neighbours (sometimes eight, if diagonals count)."
        }
      },
      {
        "title": "Choosing BFS or DFS and planning a graph solution",
        "say": [
          "For any graph problem, first decide what the nodes and edges are. Sometimes they are given; sometimes, like grids or word ladders, you have to see the graph hiding in the problem.",
          "Then pick the search. Fewest steps in an unweighted graph: BFS. Reachability, components or cycles: BFS or DFS. Weighted shortest paths: Dijkstra on Day 22. Order of tasks: topological sort on Day 23.",
          "Always keep a visited set, and think about the size: O(V + E) is fine for millions of edges, O(V^2) usually is not.",
          "Write down a tiny example graph and walk your search on paper before coding. Graph bugs are much easier to see on a drawing.",
          "Next week builds on this: auto-complete (Day 21), Dijkstra (Day 22), topological sort (Day 23) and union-find (Day 24) are all graph tools."
        ],
        "example": "A word ladder, turning COLD into WARM one letter at a time with real words at each step, is a hidden graph: each word is a node, and words one letter apart are connected. The fewest steps is BFS.",
        "code": "from collections import deque\n\ndef word_ladder(start, end, words):\n    words = set(words)\n    queue, seen = deque([(start, 1)]), {start}\n    while queue:\n        word, steps = queue.popleft()\n        if word == end:\n            return steps\n        for i in range(len(word)):\n            for ch in \"abcdefghijklmnopqrstuvwxyz\":\n                nxt = word[:i] + ch + word[i + 1:]\n                if nxt in words and nxt not in seen:\n                    seen.add(nxt)\n                    queue.append((nxt, steps + 1))\n    return 0\n\nprint(word_ladder(\"cold\", \"warm\", [\"cord\", \"card\", \"ward\", \"warm\", \"word\", \"worm\", \"wold\"]))",
        "output": "5",
        "codeNotes": [
          {
            "line": 12,
            "note": "Neighbours are words that differ by one letter."
          },
          {
            "line": 13,
            "note": "Only real, unseen words become new nodes."
          }
        ],
        "tryIt": "Remove \"worm\" and \"wold\" from the list. Is there still a ladder? Predict the answer, then run it.",
        "check": {
          "question": "What is the right search for the fewest word changes in a word ladder?",
          "options": [
            "DFS",
            "BFS",
            "Binary search"
          ],
          "answer": 1,
          "why": "Each change is one edge in an unweighted graph, so BFS finds the fewest steps."
        }
      }
    ],
    "summary": [
      "A graph is nodes and edges; store it as an adjacency list (dict of neighbour lists).",
      "BFS with a queue and a visited set finds the fewest edges: O(V + E).",
      "DFS with recursion or a stack explores reachability and components.",
      "Count components by starting a search from every unvisited node.",
      "Grids and word ladders are graphs in disguise."
    ],
    "projectStep": {
      "title": "Graph tools",
      "steps": [
        "Add shortest_path(graph, start, target) and count_components(n, edges) to dsa_toolkit.py.",
        "Add count_islands(grid) and test it on a grid you draw yourself.",
        "Bonus: build a graph of 6 friends and find how many steps separate each pair."
      ]
    }
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Fast Auto-Complete Engine (Trie + Frequency Min-Heap)",
    "goal": "You can build an auto-complete engine that stores word frequencies in a trie and returns the top k suggestions for a prefix.",
    "minutes": 30,
    "recap": "This week you learned trees, BSTs, heaps, tries and graphs. Milestone 3 joins a trie and ranking into a search-box feature.",
    "parts": [
      {
        "title": "What an auto-complete engine must do",
        "say": [
          "When you type \"pyt\" in a search box, it instantly suggests \"python\", \"python course\" and \"pytorch\", most popular first. That feature is auto-complete, and it has two jobs.",
          "Job one is finding: every stored phrase that starts with what was typed. You solved that on Day 19 with a trie.",
          "Job two is ranking: order the matches by how often people chose them, and show only the top k. Ties are broken alphabetically so the order is predictable.",
          "Practice 1 builds AutocompleteSystem with insert(word, freq) and suggest(prefix, k). Practice 2 writes the ranking step on its own.",
          "Real search engines add spelling correction and personalisation, but the core is exactly what you build today."
        ],
        "example": "A shopkeeper who, when you say \"I need a ph...\", points to the phone chargers first because most customers who start that way want a charger, then the phone covers.",
        "code": "searches = {\"python\": 120, \"pytorch\": 45, \"python course\": 80, \"pycharm\": 30, \"java\": 200}\ntyped = \"pyt\"\nmatches = [w for w in searches if w.startswith(typed)]\nranked = sorted(matches, key=lambda w: (-searches[w], w))\nprint(matches)\nprint(ranked[:2])",
        "output": "['python', 'pytorch', 'python course']\n['python', 'python course']",
        "codeNotes": [
          {
            "line": 3,
            "note": "Job one: find the matches (here by checking every word)."
          },
          {
            "line": 4,
            "note": "Job two: most frequent first, alphabetical on ties."
          }
        ],
        "tryIt": "Change typed to \"py\" and the top 3. \"pycharm\" now matches but stays last because of its low count.",
        "check": {
          "question": "Why sort with the key (-frequency, word)?",
          "options": [
            "To sort alphabetically only",
            "Highest frequency first, and alphabetical order on ties",
            "To remove duplicates"
          ],
          "answer": 1,
          "why": "Negating the frequency puts big counts first; the word breaks ties in alphabetical order."
        }
      },
      {
        "title": "Storing frequencies in the trie",
        "say": [
          "Checking every word, as in the last part, is O(N) for each keystroke. A trie makes the finding step depend only on the prefix and the matching part of the dictionary.",
          "Add a freq field to each trie node. insert(word, freq) walks the letters, creating nodes, and adds freq to the end node, so inserting the same word twice adds the counts together.",
          "A node whose freq is above 0 marks a complete word, which replaces the is_end flag from Day 19.",
          "The same trie can be filled from yesterday's search logs: each logged search calls insert(query, 1).",
          "Adding to an existing count, instead of replacing it, is what Practice 1 asks for."
        ],
        "example": "A tally board for song requests at a wedding: every time someone asks for a song, one more stroke goes next to it, so popular songs build up high counts.",
        "code": "class Node:\n    def __init__(self):\n        self.children = {}\n        self.freq = 0\n\nroot = Node()\ndef insert(word, freq=1):\n    node = root\n    for ch in word:\n        node = node.children.setdefault(ch, Node())\n    node.freq += freq\n\nfor query in [\"pizza\", \"pizza\", \"pasta\", \"pizza hut\", \"pizza\"]:\n    insert(query)\ninsert(\"pasta\", 5)\n\ndef freq_of(word):\n    node = root\n    for ch in word:\n        node = node.children.get(ch)\n        if node is None:\n            return 0\n    return node.freq\n\nprint(freq_of(\"pizza\"), freq_of(\"pasta\"), freq_of(\"pizza hut\"), freq_of(\"piz\"))",
        "output": "3 6 1 0",
        "codeNotes": [
          {
            "line": 11,
            "note": "Add to the count, so repeated searches build up."
          },
          {
            "line": 25,
            "note": "\"piz\" is only a prefix, so its count is 0."
          }
        ],
        "tryIt": "Insert \"pizza hut\" 4 more times and print its count. It should be 5.",
        "check": {
          "question": "The word \"chai\" is inserted with freq 3 and then again with freq 2. What is its stored frequency?",
          "options": [
            "2",
            "3",
            "5"
          ],
          "answer": 2,
          "why": "insert adds to the existing count, so 3 + 2 = 5."
        }
      },
      {
        "title": "Collecting the matches below a prefix",
        "say": [
          "To suggest, first walk down the trie to the prefix node. If a letter is missing, there are no suggestions, so return an empty list.",
          "Then run a depth-first search below that node, building each word letter by letter, and collect (freq, word) for every node with freq above 0.",
          "This is the same DFS you wrote on Day 19, now also carrying the frequency.",
          "The time depends on the size of the subtree under the prefix. For short prefixes like \"a\" that can be large, which is why real systems cache the top suggestions at each node.",
          "Once you have the matches, the ranking step picks the best k."
        ],
        "example": "Opening only the \"P\" drawer of a filing cabinet and reading every folder inside it, noting how many times each folder was requested.",
        "code": "class Node:\n    def __init__(self):\n        self.children = {}\n        self.freq = 0\n\nroot = Node()\ndef insert(word, freq=1):\n    node = root\n    for ch in word:\n        node = node.children.setdefault(ch, Node())\n    node.freq += freq\n\ndef matches(prefix):\n    node = root\n    for ch in prefix:\n        if ch not in node.children:\n            return []\n        node = node.children[ch]\n    found = []\n    def dfs(n, word):\n        if n.freq > 0:\n            found.append((n.freq, word))\n        for ch, child in n.children.items():\n            dfs(child, word + ch)\n    dfs(node, prefix)\n    return found\n\nfor w, f in [(\"react\", 100), (\"reach\", 80), (\"redux\", 50), (\"read\", 80), (\"java\", 90)]:\n    insert(w, f)\nprint(sorted(matches(\"rea\")))\nprint(matches(\"x\"))",
        "output": "[(80, 'reach'), (80, 'read'), (100, 'react')]\n[]",
        "codeNotes": [
          {
            "line": 17,
            "note": "Missing letter: nothing starts with this prefix."
          },
          {
            "line": 21,
            "note": "A complete word: collect its frequency."
          }
        ],
        "tryIt": "Print sorted(matches(\"re\")) as well. \"redux\" joins the list because it also starts with \"re\".",
        "check": {
          "question": "What does matches() return when the prefix is not in the trie?",
          "options": [
            "All words",
            "An empty list",
            "An error"
          ],
          "answer": 1,
          "why": "The walk hits a missing letter and returns [] straight away."
        }
      },
      {
        "title": "Picking the top k with a heap",
        "say": [
          "Sorting every match is O(M log M) for M matches. When k is small, heapq.nsmallest(k, ...) with the right key is O(M log k), because it keeps only the best k while scanning.",
          "The key is (-freq, word): nsmallest then returns the highest frequencies first, and alphabetical order breaks ties, exactly like the sort in part 1.",
          "This is the \"keep only the best k\" idea from Day 18 applied to suggestions.",
          "Practice 2, rank_suggestions(words, prefix, k), is this step on its own: filter by prefix, then take the top k with the tie rule.",
          "Getting the tie rule exactly right matters: tests (and users) expect the same order every time."
        ],
        "example": "A talent show judge who only keeps a shortlist of the top 3 while watching 200 acts, replacing the weakest on the shortlist whenever a better act appears.",
        "code": "import heapq\n\ndef rank_suggestions(words, prefix, k):\n    matching = [(freq, w) for w, freq in words.items() if w.startswith(prefix)]\n    best = heapq.nsmallest(k, matching, key=lambda fw: (-fw[0], fw[1]))\n    return [w for _, w in best]\n\nwords = {\"react\": 100, \"reach\": 80, \"read\": 80, \"redux\": 50, \"java\": 90}\nprint(rank_suggestions(words, \"rea\", 2))\nprint(rank_suggestions(words, \"re\", 3))\nprint(rank_suggestions(words, \"z\", 3))",
        "output": "['react', 'reach']\n['react', 'reach', 'read']\n[]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Highest frequency first; alphabetical on ties."
          },
          {
            "line": 9,
            "note": "\"reach\" and \"read\" tie at 80; \"reach\" wins alphabetically."
          }
        ],
        "tryIt": "Give \"read\" a frequency of 81 and run again. Now \"read\" beats \"reach\" for second place.",
        "check": {
          "question": "\"read\" and \"reach\" both have frequency 80. Which comes first?",
          "options": [
            "read",
            "reach",
            "Either, randomly"
          ],
          "answer": 1,
          "why": "Ties are broken alphabetically, and \"reach\" comes before \"read\"."
        }
      },
      {
        "title": "The complete AutocompleteSystem",
        "say": [
          "Now combine the parts into one class: a trie with frequencies, insert(word, freq), and suggest(prefix, k) that walks to the prefix, collects matches and ranks the top k.",
          "Keep each method small. A helper that returns the node for a prefix (or None) is used by suggest, and could be reused for a count or a delete method later.",
          "Test it the way users will use it: several inserts, repeated inserts of the same word, a prefix with no matches, and a k larger than the number of matches.",
          "This class is your Milestone 3. It combines tries (Day 19), depth-first search (Days 16 and 20) and top-k selection with heaps (Day 18).",
          "A good next step in real life is caching suggest results for popular prefixes, since the same prefixes are typed millions of times."
        ],
        "example": "A library's smart catalogue: librarians add each borrowed title to it, and when a reader types the first letters, it lists the most borrowed matching titles.",
        "code": "import heapq\n\nclass Node:\n    def __init__(self):\n        self.children = {}\n        self.freq = 0\n\nclass AutocompleteSystem:\n    def __init__(self):\n        self.root = Node()\n\n    def insert(self, word, freq=1):\n        node = self.root\n        for ch in word:\n            node = node.children.setdefault(ch, Node())\n        node.freq += freq\n\n    def _node_for(self, prefix):\n        node = self.root\n        for ch in prefix:\n            node = node.children.get(ch)\n            if node is None:\n                return None\n        return node\n\n    def suggest(self, prefix, k=3):\n        start = self._node_for(prefix)\n        if start is None:\n            return []\n        found, stack = [], [(start, prefix)]\n        while stack:\n            node, word = stack.pop()\n            if node.freq > 0:\n                found.append((node.freq, word))\n            for ch, child in node.children.items():\n                stack.append((child, word + ch))\n        best = heapq.nsmallest(k, found, key=lambda fw: (-fw[0], fw[1]))\n        return [w for _, w in best]\n\nac = AutocompleteSystem()\nfor w, f in [(\"python\", 120), (\"pytorch\", 45), (\"python course\", 80), (\"pycharm\", 30)]:\n    ac.insert(w, f)\nac.insert(\"pytorch\", 50)\nprint(ac.suggest(\"pyt\"))\nprint(ac.suggest(\"py\", 2))\nprint(ac.suggest(\"java\"))",
        "output": "['python', 'pytorch', 'python course']\n['python', 'pytorch']\n[]",
        "codeNotes": [
          {
            "line": 30,
            "note": "Collect matches with our own stack instead of recursion."
          },
          {
            "line": 37,
            "note": "Top k by frequency, alphabetical on ties."
          },
          {
            "line": 43,
            "note": "Repeat inserts add up: pytorch now has 95."
          }
        ],
        "tryIt": "Insert \"pytorch\" with 30 more. It now has 125 and becomes the first suggestion for \"pyt\".",
        "check": {
          "question": "Which three topics from this month does the auto-complete engine combine?",
          "options": [
            "Tries, DFS and heaps",
            "Sorting, queues and hashing only",
            "Binary search and recursion only"
          ],
          "answer": 0,
          "why": "A trie stores the words, DFS collects matches under the prefix, and a heap picks the top k."
        }
      },
      {
        "title": "Making suggestions fast at scale",
        "say": [
          "For a big search engine, running a DFS for every keystroke is too slow for short prefixes like \"a\", which match millions of phrases.",
          "The standard fix is to store the current top k suggestions at every trie node. Then suggest is just walking to the prefix node and reading its list: O(length of the prefix).",
          "The cost moves to insert: when a word's count changes, every node on its path may need its top-k list updated. That is fine, because typing (reading) happens far more often than logging (writing).",
          "This read-fast, write-slower trade-off appears everywhere in system design: precompute the answer when data changes, so reads are instant.",
          "You will meet more of these trade-offs in the Distributed Systems course."
        ],
        "example": "A restaurant that keeps a printed \"today's top 3 dishes\" card on each table instead of asking the kitchen every time a customer wonders what is popular. The card is updated when orders change.",
        "code": "class Node:\n    def __init__(self):\n        self.children = {}\n        self.top = []\n\nroot, counts, K = Node(), {}, 2\n\ndef record(word):\n    counts[word] = counts.get(word, 0) + 1\n    node = root\n    for ch in word:\n        node = node.children.setdefault(ch, Node())\n        candidates = set(node.top) | {word}\n        node.top = sorted(candidates, key=lambda w: (-counts[w], w))[:K]\n\ndef suggest(prefix):\n    node = root\n    for ch in prefix:\n        node = node.children.get(ch)\n        if node is None:\n            return []\n    return node.top\n\nfor q in [\"maps\", \"mail\", \"maps\", \"music\", \"mail\", \"maps\"]:\n    record(q)\nprint(suggest(\"m\"), suggest(\"ma\"), suggest(\"mu\"))",
        "output": "['maps', 'mail'] ['maps', 'mail'] ['music']",
        "codeNotes": [
          {
            "line": 14,
            "note": "Update the stored top list on every node along the word's path."
          },
          {
            "line": 22,
            "note": "Suggest just reads the list: no search at all."
          }
        ],
        "tryIt": "Record \"music\" three more times and print suggest(\"m\") again. \"music\" climbs into the top 2.",
        "check": {
          "question": "What does storing the top k at every trie node trade?",
          "options": [
            "Slower suggestions for faster inserts",
            "Slower inserts for instant suggestions",
            "More accuracy for less speed"
          ],
          "answer": 1,
          "why": "Each insert updates lists along the path (more work when writing) so each suggestion is a simple read."
        }
      }
    ],
    "summary": [
      "Auto-complete has two jobs: find matches for the prefix, then rank them.",
      "Store frequencies at trie end nodes; repeated inserts add up.",
      "Collect matches with a DFS below the prefix node.",
      "Pick the top k with heapq.nsmallest and the key (-freq, word).",
      "At scale, precompute each node's top k so suggestions are instant."
    ],
    "projectStep": {
      "title": "Milestone 3: auto-complete",
      "steps": [
        "Add the AutocompleteSystem class to dsa_toolkit.py.",
        "Fill it with 20 of your own recent searches and print suggestions for three prefixes.",
        "Bonus: add a delete(word) method that sets the word's frequency back to 0."
      ]
    }
  },
  {
    "day": 22,
    "title": "Dijkstra's Shortest Path Algorithm & Weighted Graphs",
    "goal": "You can find the cheapest route through a weighted graph with Dijkstra's algorithm and a heap, and explain why it needs non-negative weights.",
    "minutes": 30,
    "recap": "Yesterday you built auto-complete. On Day 20, BFS found the fewest steps. Today edges have costs, and the fewest steps is not always the cheapest route.",
    "parts": [
      {
        "title": "Weighted graphs",
        "say": [
          "In a weighted graph each edge has a number: a distance, a travel time, a price. Route planners, flight search and network routing all work on weighted graphs.",
          "Store it as an adjacency list of (neighbour, weight) pairs: graph[\"A\"] = [(\"B\", 4), (\"C\", 2)].",
          "BFS no longer works for the cheapest route, because it counts edges, not costs. Two cheap edges can beat one expensive edge.",
          "Dijkstra's algorithm (1956) finds the cheapest route from one start node to every other node, as long as no edge weight is negative.",
          "It is the basis of the routing in Google Maps, network protocols like OSPF, and many games."
        ],
        "example": "Going from Majestic to the airport: the direct bus takes 90 minutes, but the metro to Hebbal (25 minutes) plus the airport bus (40 minutes) takes 65. Fewer changes is not always faster.",
        "code": "graph = {\n    \"Majestic\": [(\"Airport\", 90), (\"Hebbal\", 25)],\n    \"Hebbal\": [(\"Airport\", 40)],\n    \"Airport\": [],\n}\ndirect = 90\nvia_hebbal = 25 + 40\nprint(\"direct:\", direct, \"minutes | via Hebbal:\", via_hebbal, \"minutes\")\nprint(\"fewest edges is cheapest?\", direct <= via_hebbal)",
        "output": "direct: 90 minutes | via Hebbal: 65 minutes\nfewest edges is cheapest? False",
        "codeNotes": [
          {
            "line": 2,
            "note": "Each neighbour comes with the cost of that edge."
          }
        ],
        "tryIt": "Change the Hebbal to Airport time to 70 and run it. Now the direct route is cheaper.",
        "check": {
          "question": "Why can't BFS find the cheapest route in a weighted graph?",
          "options": [
            "BFS is too slow",
            "BFS counts edges, not their costs",
            "BFS only works on trees"
          ],
          "answer": 1,
          "why": "BFS finds the fewest edges; with weights, several cheap edges can cost less than one expensive edge."
        }
      },
      {
        "title": "The idea: always settle the closest node",
        "say": [
          "Dijkstra keeps a best-known distance for every node, starting at 0 for the start node and infinity for the rest.",
          "Repeatedly pick the unsettled node with the smallest known distance. Its distance is now final: any other route would pass through a node that is already at least as far away.",
          "Then relax its edges: for each neighbour, if going through this node is cheaper than the neighbour's known distance, update it.",
          "Because every distance only ever goes down, and the closest node is always settled next, the answers are correct when all weights are non-negative.",
          "Picking the smallest distance quickly is exactly what a min-heap does, which is why Dijkstra uses heapq."
        ],
        "example": "Water spreading from a spot on a flat floor: it reaches nearby tiles first and far tiles later. The moment the water reaches a tile is its shortest distance, and it never gets shorter.",
        "code": "dist = {\"A\": 0, \"B\": float(\"inf\"), \"C\": float(\"inf\")}\nedges_from_A = [(\"B\", 4), (\"C\", 2)]\nfor nb, w in edges_from_A:\n    if dist[\"A\"] + w < dist[nb]:\n        dist[nb] = dist[\"A\"] + w\nprint(\"after settling A:\", dist)\nedges_from_C = [(\"B\", 1)]\nfor nb, w in edges_from_C:\n    if dist[\"C\"] + w < dist[nb]:\n        dist[nb] = dist[\"C\"] + w\nprint(\"after settling C:\", dist)",
        "output": "after settling A: {'A': 0, 'B': 4, 'C': 2}\nafter settling C: {'A': 0, 'B': 3, 'C': 2}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Relax: is going through A cheaper than what we know?"
          },
          {
            "line": 10,
            "note": "C (the closest, 2) improves B from 4 to 3."
          }
        ],
        "tryIt": "Work out by hand what happens if the edge C to B cost 5 instead of 1. B stays at 4.",
        "check": {
          "question": "Which node does Dijkstra settle next?",
          "options": [
            "The one added most recently",
            "The unsettled node with the smallest known distance",
            "A random neighbour"
          ],
          "answer": 1,
          "why": "The closest unsettled node's distance cannot be improved later (with non-negative weights), so it is final."
        }
      },
      {
        "title": "Dijkstra with heapq",
        "say": [
          "Practice 1: dijkstra(graph, start) returns the shortest distance to every reachable node. Push (0, start) onto a heap and keep a dist dict.",
          "Pop the smallest (d, node). If d is bigger than dist[node], this entry is out of date (a cheaper route was found later), so skip it. This is called lazy deletion.",
          "Otherwise relax each edge: if d + w beats the neighbour's distance, record it and push (d + w, neighbour).",
          "With a heap, the whole algorithm is O((V + E) log V): each edge may push once, and each push or pop is O(log V).",
          "Nodes that can never be reached simply never appear in dist, which is what the practice expects."
        ],
        "example": "A travel agent working through a to-do list sorted by cheapest fare so far, always handling the cheapest trip first, and ignoring an old note if a cheaper fare to that city has already been found.",
        "code": "import heapq\n\ndef dijkstra(graph, start):\n    dist = {start: 0}\n    heap = [(0, start)]\n    while heap:\n        d, node = heapq.heappop(heap)\n        if d > dist[node]:\n            continue\n        for nb, w in graph.get(node, []):\n            nd = d + w\n            if nd < dist.get(nb, float(\"inf\")):\n                dist[nb] = nd\n                heapq.heappush(heap, (nd, nb))\n    return dist\n\ngraph = {\"A\": [(\"B\", 4), (\"C\", 2)], \"B\": [(\"D\", 10)], \"C\": [(\"B\", 1), (\"D\", 5)], \"D\": [], \"E\": [(\"A\", 1)]}\nprint(dijkstra(graph, \"A\"))",
        "output": "{'A': 0, 'B': 3, 'C': 2, 'D': 7}",
        "codeNotes": [
          {
            "line": 8,
            "note": "An out-of-date entry: a cheaper route was found after it was pushed."
          },
          {
            "line": 12,
            "note": "Relax: found a cheaper route to nb."
          },
          {
            "line": 18,
            "note": "E cannot be reached from A, so it is not in the result."
          }
        ],
        "tryIt": "Add an edge (\"E\", 3) to D's list and run dijkstra(graph, \"A\"). E appears with distance 10.",
        "check": {
          "question": "Why does the code skip a popped entry when d > dist[node]?",
          "options": [
            "It is a bug",
            "A cheaper route to that node was already found, so this entry is outdated",
            "To avoid negative numbers"
          ],
          "answer": 1,
          "why": "The heap may hold older, more expensive entries for the same node; they can be ignored."
        }
      },
      {
        "title": "Recovering the actual route",
        "say": [
          "Distances are useful, but a map app must also show the route. Keep a prev dict: whenever a node's distance improves, remember which node you came from.",
          "To rebuild the route to a target, start at the target and follow prev back to the start, then reverse the list.",
          "If the target never got a distance, there is no route. Check this before following prev.",
          "This parent-pointer trick works for BFS too; it is how you turn \"how far?\" into \"which way?\".",
          "Storing prev costs O(V) extra memory, the price of being able to answer \"show me the way\"."
        ],
        "example": "Leaving a note at each junction saying which road you arrived by. At your destination, you read the notes backwards to retrace the whole route.",
        "code": "import heapq\n\ndef route(graph, start, target):\n    dist, prev = {start: 0}, {}\n    heap = [(0, start)]\n    while heap:\n        d, node = heapq.heappop(heap)\n        if d > dist[node]:\n            continue\n        for nb, w in graph.get(node, []):\n            if d + w < dist.get(nb, float(\"inf\")):\n                dist[nb], prev[nb] = d + w, node\n                heapq.heappush(heap, (d + w, nb))\n    if target not in dist:\n        return None, []\n    path = [target]\n    while path[-1] != start:\n        path.append(prev[path[-1]])\n    return dist[target], path[::-1]\n\ngraph = {\"Home\": [(\"Market\", 7), (\"Park\", 2)], \"Park\": [(\"Market\", 3), (\"Office\", 9)], \"Market\": [(\"Office\", 4)], \"Office\": []}\nprint(route(graph, \"Home\", \"Office\"))\nprint(route(graph, \"Office\", \"Home\"))",
        "output": "(9, ['Home', 'Park', 'Market', 'Office'])\n(None, [])",
        "codeNotes": [
          {
            "line": 12,
            "note": "Remember where the cheaper route came from."
          },
          {
            "line": 18,
            "note": "Walk back from the target to the start."
          },
          {
            "line": 19,
            "note": "Reverse to get the route from start to target."
          }
        ],
        "tryIt": "Change the Park to Market cost to 6 and run again. The route and cost both change.",
        "check": {
          "question": "How do you rebuild the cheapest route after Dijkstra?",
          "options": [
            "Sort the distances",
            "Follow the prev links back from the target, then reverse",
            "Run BFS again"
          ],
          "answer": 1,
          "why": "Each prev entry records the node before it on the best route, so following them backwards gives the path."
        }
      },
      {
        "title": "Network delay time",
        "say": [
          "Practice 2: a signal starts at node k and travels along directed links with given delays. How long until every node has received it? If some node never does, return -1.",
          "Run Dijkstra from k. The time for everyone is the largest shortest distance, because the last node to hear the signal decides the answer.",
          "If fewer than n nodes appear in the distances, some node is unreachable: return -1.",
          "Build the graph from the list of [from, to, time] links first; nodes are numbered 1 to n.",
          "This pattern, \"run Dijkstra, then look at all the distances\", solves many questions: the farthest city, the slowest delivery, the worst-case latency."
        ],
        "example": "A WhatsApp message forwarded around a family group: it reaches the last relative only when the slowest chain of forwards arrives. That slowest chain is the answer.",
        "code": "import heapq\nfrom collections import defaultdict\n\ndef network_delay(times, n, k):\n    graph = defaultdict(list)\n    for u, v, w in times:\n        graph[u].append((v, w))\n    dist = {k: 0}\n    heap = [(0, k)]\n    while heap:\n        d, node = heapq.heappop(heap)\n        if d > dist[node]:\n            continue\n        for nb, w in graph[node]:\n            if d + w < dist.get(nb, float(\"inf\")):\n                dist[nb] = d + w\n                heapq.heappush(heap, (d + w, nb))\n    return max(dist.values()) if len(dist) == n else -1\n\nprint(network_delay([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2))\nprint(network_delay([[1, 2, 1]], 2, 2))",
        "output": "2\n-1",
        "codeNotes": [
          {
            "line": 7,
            "note": "Directed links: only from u to v."
          },
          {
            "line": 18,
            "note": "Everyone reached? The slowest arrival is the answer."
          }
        ],
        "tryIt": "Add a link [1, 4, 5] to the first example. Node 4 is still reached faster through 3, so the answer stays 2.",
        "check": {
          "question": "After Dijkstra, what is the network delay time when every node is reachable?",
          "options": [
            "The smallest distance",
            "The largest shortest distance",
            "The sum of all distances"
          ],
          "answer": 1,
          "why": "Everyone has the signal only when the last node receives it, which is the largest of the shortest times."
        }
      },
      {
        "title": "Why negative weights break Dijkstra",
        "say": [
          "Dijkstra assumes that once a node is settled, nothing can make it cheaper. With a negative edge, a longer route could later become cheaper, and the settled answer would be wrong.",
          "Negative weights are real: a cashback that makes one leg of a trip pay you, or exchange rates in currency trading.",
          "For graphs with negative edges, use the Bellman-Ford algorithm, which relaxes every edge V - 1 times. It is slower, O(V x E), but correct. You will use a version of it on Day 30.",
          "If a cycle has a negative total, costs can fall forever and there is no cheapest route at all. Bellman-Ford can detect this.",
          "Rule of thumb: non-negative weights, Dijkstra; negative weights, Bellman-Ford; no weights, BFS."
        ],
        "example": "A travel app that gives 50 rupees cashback on one connecting bus: suddenly a longer route can be \"cheaper\", and a planner that had already fixed the price of the middle stop gives the wrong answer.",
        "code": "def bellman_ford(nodes, edges, start):\n    dist = {n: float(\"inf\") for n in nodes}\n    dist[start] = 0\n    for _ in range(len(nodes) - 1):\n        for u, v, w in edges:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    return dist\n\nnodes = [\"A\", \"B\", \"C\"]\nedges = [(\"A\", \"B\", 4), (\"A\", \"C\", 5), (\"C\", \"B\", -3)]\nprint(bellman_ford(nodes, edges, \"A\"))",
        "output": "{'A': 0, 'B': 2, 'C': 5}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Relax every edge V - 1 times."
          },
          {
            "line": 11,
            "note": "A negative edge: going via C makes B cost 2, not 4."
          }
        ],
        "tryIt": "Dijkstra would settle B at 4 before looking at C. Trace that on paper, then compare with this correct answer of 2.",
        "check": {
          "question": "Which algorithm should you use for shortest paths when some edges are negative?",
          "options": [
            "Dijkstra",
            "Bellman-Ford",
            "BFS"
          ],
          "answer": 1,
          "why": "Bellman-Ford does not rely on settled nodes staying final, so negative edges are handled correctly."
        }
      }
    ],
    "summary": [
      "Weighted graphs store (neighbour, cost) pairs; BFS no longer finds the cheapest route.",
      "Dijkstra always settles the closest unsettled node and relaxes its edges.",
      "With heapq and lazy deletion it runs in O((V + E) log V).",
      "Keep prev links to rebuild the actual route.",
      "Negative weights break Dijkstra; use Bellman-Ford instead."
    ],
    "projectStep": {
      "title": "Routing tools",
      "steps": [
        "Add dijkstra(graph, start) and route(graph, start, target) to dsa_toolkit.py.",
        "Model 6 places in your town with travel times and find the quickest route between two of them.",
        "Bonus: add network_delay(times, n, k) and test a case where one node is unreachable."
      ]
    }
  },
  {
    "day": 23,
    "title": "Topological Sort (Kahn's In-Degree Algorithm) & DAGs",
    "goal": "You can order tasks that depend on each other with topological sort (Kahn's algorithm) and detect when no valid order exists.",
    "minutes": 30,
    "recap": "Yesterday you found cheapest routes with Dijkstra. Today's graphs describe dependencies: which task must come before which.",
    "parts": [
      {
        "title": "Dependencies as a directed graph",
        "say": [
          "Many problems are about order: courses with prerequisites, build steps, recipe steps, software packages that need other packages installed first.",
          "Draw each task as a node and each \"a must come before b\" as a directed edge a -> b. The result is a directed graph.",
          "If the graph has no cycles, it is a DAG (directed acyclic graph), and at least one valid order exists. That order is a topological sort.",
          "If there is a cycle, like a needs b and b needs a, no valid order exists. Detecting that is just as important as finding the order.",
          "Package managers (pip, npm), spreadsheet recalculation and build tools like Make all do topological sorts."
        ],
        "example": "Getting dressed: socks before shoes, shirt before tie, trousers before shoes. Many orders work, but \"shoes before socks\" does not.",
        "code": "prereqs = [(\"maths 1\", \"maths 2\"), (\"maths 2\", \"machine learning\"), (\"python\", \"machine learning\"), (\"python\", \"web dev\")]\ngraph = {}\nfor before, after in prereqs:\n    graph.setdefault(before, []).append(after)\n    graph.setdefault(after, [])\nfor course, unlocks in graph.items():\n    print(course, \"->\", unlocks)",
        "output": "maths 1 -> ['maths 2']\nmaths 2 -> ['machine learning']\nmachine learning -> []\npython -> ['machine learning', 'web dev']\nweb dev -> []",
        "codeNotes": [
          {
            "line": 4,
            "note": "An edge from the course you take first to the course it unlocks."
          },
          {
            "line": 5,
            "note": "Make sure every course appears, even if it unlocks nothing."
          }
        ],
        "tryIt": "Add (\"machine learning\", \"maths 1\") and think: can this plan still be completed? (No: it creates a cycle.)",
        "check": {
          "question": "What is a DAG?",
          "options": [
            "A graph with weights",
            "A directed graph with no cycles",
            "A tree with two children per node"
          ],
          "answer": 1,
          "why": "Directed acyclic graph: edges have a direction and you can never follow them back to where you started."
        }
      },
      {
        "title": "In-degree: counting what you still need",
        "say": [
          "The in-degree of a node is how many edges point into it: how many things must happen before it.",
          "A task with in-degree 0 has nothing blocking it, so it can be done now. In a DAG there is always at least one such task.",
          "When you complete a task, every task it unlocks has one fewer blocker: subtract 1 from their in-degrees. Some of them may drop to 0 and become ready.",
          "Counting in-degrees takes one pass over the edges: O(E).",
          "This is the key insight behind Kahn's algorithm in the next part."
        ],
        "example": "A to-do list where each job shows how many other jobs it is waiting for. Jobs showing 0 can start now; finishing a job lowers the waiting number on the jobs that depended on it.",
        "code": "prereqs = [[1, 0], [2, 0], [3, 1], [3, 2]]\nn = 4\nin_degree = [0] * n\nfor course, before in prereqs:\n    in_degree[course] += 1\nprint(\"in-degrees:\", in_degree)\nprint(\"ready now:\", [c for c in range(n) if in_degree[c] == 0])",
        "output": "in-degrees: [0, 1, 1, 2]\nready now: [0]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Each pair is [course, prerequisite], as in the practice."
          },
          {
            "line": 7,
            "note": "Nothing blocks these courses."
          }
        ],
        "tryIt": "Add [0, 3] to prereqs. Now no course has in-degree 0, a sign of a cycle.",
        "check": {
          "question": "What does an in-degree of 0 mean for a task?",
          "options": [
            "It is finished",
            "Nothing must happen before it, so it can be done now",
            "Nothing depends on it"
          ],
          "answer": 1,
          "why": "In-degree counts incoming edges (prerequisites). Zero means no prerequisites are left."
        }
      },
      {
        "title": "Kahn's algorithm",
        "say": [
          "Practice 1: find_order(num_courses, prerequisites) returns a valid order, or an empty list if there is none.",
          "Put every node with in-degree 0 in a queue. Repeatedly take one out, add it to the order, and lower the in-degree of each node it unlocks; any that reach 0 join the queue.",
          "Each node and edge is handled once: O(V + E).",
          "When the queue runs dry, check the order's length. If it contains every node, it is a valid topological order. If not, the missing nodes are stuck in a cycle, so return [].",
          "Different queue orders give different valid answers; any order that respects every prerequisite is correct.",
          "Trace the example by hand once: course 0 is ready first; finishing it lowers courses 1 and 2 to zero; finishing both of those finally frees course 3. Watching the in-degree numbers fall is the best way to understand the algorithm."
        ],
        "example": "A college timetable planner that each term offers every course whose prerequisites are all done, and unlocks new courses as students pass them.",
        "code": "from collections import deque\n\ndef find_order(n, prerequisites):\n    graph = [[] for _ in range(n)]\n    in_degree = [0] * n\n    for course, before in prerequisites:\n        graph[before].append(course)\n        in_degree[course] += 1\n    queue = deque(c for c in range(n) if in_degree[c] == 0)\n    order = []\n    while queue:\n        c = queue.popleft()\n        order.append(c)\n        for nxt in graph[c]:\n            in_degree[nxt] -= 1\n            if in_degree[nxt] == 0:\n                queue.append(nxt)\n    return order if len(order) == n else []\n\nprint(find_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]]))\nprint(find_order(2, [[1, 0], [0, 1]]))",
        "output": "[0, 1, 2, 3]\n[]",
        "codeNotes": [
          {
            "line": 9,
            "note": "Start with everything that has no prerequisites."
          },
          {
            "line": 15,
            "note": "One prerequisite done for nxt."
          },
          {
            "line": 18,
            "note": "Missing nodes mean a cycle blocked them."
          }
        ],
        "tryIt": "Add a course 4 with no prerequisites: find_order(5, ...). It appears right after course 0, because it is ready from the very start.",
        "check": {
          "question": "In Kahn's algorithm, how do you know the graph had a cycle?",
          "options": [
            "The queue never empties",
            "The final order has fewer nodes than the graph",
            "A node has in-degree 1"
          ],
          "answer": 1,
          "why": "Nodes in a cycle never reach in-degree 0, so they never join the order."
        }
      },
      {
        "title": "Can all courses be finished?",
        "say": [
          "Practice 2 only asks yes or no: can every course be finished? That is the same as asking whether the graph has no cycle.",
          "The simplest correct answer reuses Kahn's algorithm: all courses can be finished exactly when the order contains all of them.",
          "You can also detect cycles with depth-first search, marking nodes as \"visiting\" while on the current path. Reaching a \"visiting\" node again means you went round a loop.",
          "Both are O(V + E). Kahn's version is often easier to get right under interview pressure.",
          "Real tools report the cycle to the user (\"package A requires B requires A\") so they can fix it; the DFS version can do that by remembering the current path."
        ],
        "example": "Two friends each saying \"I will go to the party only if you go first\". Nobody can start, so neither goes: a cycle means the plan can never complete.",
        "code": "def can_finish(n, prerequisites):\n    graph = [[] for _ in range(n)]\n    for course, before in prerequisites:\n        graph[before].append(course)\n    state = [0] * n\n\n    def has_cycle(c):\n        if state[c] == 1:\n            return True\n        if state[c] == 2:\n            return False\n        state[c] = 1\n        if any(has_cycle(nxt) for nxt in graph[c]):\n            return True\n        state[c] = 2\n        return False\n\n    return not any(has_cycle(c) for c in range(n))\n\nprint(can_finish(2, [[1, 0]]))\nprint(can_finish(3, [[1, 0], [2, 1], [0, 2]]))",
        "output": "True\nFalse",
        "codeNotes": [
          {
            "line": 5,
            "note": "0 = not seen, 1 = on the current path, 2 = fully explored."
          },
          {
            "line": 9,
            "note": "Back on a node of the current path: a cycle."
          },
          {
            "line": 15,
            "note": "Explored with no cycle: safe to reuse."
          }
        ],
        "tryIt": "Remove [0, 2] from the second example. The cycle is gone, so the answer becomes True.",
        "check": {
          "question": "In the DFS method, what does reaching a node marked \"visiting\" (state 1) mean?",
          "options": [
            "The node is finished",
            "We came back to a node on the current path: a cycle",
            "The node has no edges"
          ],
          "answer": 1,
          "why": "State 1 means the node is on the path we are currently exploring, so reaching it again closes a loop."
        }
      },
      {
        "title": "Build systems and parallel steps",
        "say": [
          "Topological order also tells you what can run at the same time. Everything that is ready together in one round of Kahn's algorithm can run in parallel.",
          "Processing the queue level by level, like level-order traversal on Day 16, groups the tasks into stages.",
          "The number of stages is the fewest rounds needed if you have unlimited workers. Build systems use this to run independent jobs in parallel and finish sooner.",
          "This is the critical path idea from project management: the longest chain of dependencies decides the finishing time, no matter how many people help.",
          "The code groups a small software build into stages."
        ],
        "example": "Cooking a meal: rice and dal can cook at the same time, but tadka must wait for the dal. Grouping steps into \"what can happen together\" is how a cook finishes faster.",
        "code": "def build_stages(deps):\n    tasks = set(deps) | {d for ds in deps.values() for d in ds}\n    waiting = {t: set(deps.get(t, [])) for t in tasks}\n    stages = []\n    while waiting:\n        ready = sorted(t for t, need in waiting.items() if not need)\n        if not ready:\n            raise ValueError(\"cycle in dependencies\")\n        stages.append(ready)\n        for t in ready:\n            del waiting[t]\n        for need in waiting.values():\n            need.difference_update(ready)\n    return stages\n\ndeps = {\"app\": [\"api\", \"ui\"], \"api\": [\"database\"], \"ui\": [\"design system\"], \"tests\": [\"app\"]}\nfor i, stage in enumerate(build_stages(deps), 1):\n    print(\"stage\", i, stage)",
        "output": "stage 1 ['database', 'design system']\nstage 2 ['api', 'ui']\nstage 3 ['app']\nstage 4 ['tests']",
        "codeNotes": [
          {
            "line": 6,
            "note": "Everything with no remaining needs can run now, together."
          },
          {
            "line": 13,
            "note": "These tasks are done, so remove them from what others wait for."
          }
        ],
        "tryIt": "Add \"docs\": [] to deps. It joins stage 1, because it needs nothing.",
        "check": {
          "question": "How many stages does a chain a -> b -> c -> d need, even with many workers?",
          "options": [
            "1",
            "2",
            "4"
          ],
          "answer": 2,
          "why": "Each task must wait for the one before it, so the chain forces 4 stages one after another."
        }
      },
      {
        "title": "Choosing the right graph tool",
        "say": [
          "You now have four graph tools: BFS (fewest steps), DFS (reachability, cycles), Dijkstra (cheapest with non-negative weights) and topological sort (order of dependencies).",
          "Read the question for clues. \"Prerequisite\", \"depends on\", \"before\", \"order of tasks\": topological sort. \"Minimum cost\", \"fastest route\": Dijkstra. \"Minimum number of moves\": BFS.",
          "Topological sort only makes sense on directed graphs. For undirected graphs, questions about groups and connections use components or tomorrow's union-find.",
          "In interviews, say which tool you picked and why before writing code. It shows you understand the problem, not just a memorised solution.",
          "Tomorrow completes the set with union-find, a tool for grouping and cycle detection in undirected graphs.",
          "Keyword matching like the code below is only a first guess. Always confirm by asking what the nodes are, whether edges have a direction, whether they have costs, and what exactly the question wants back: an order, a distance, a yes or no, or a count."
        ],
        "example": "A toolbox: you would not use a hammer on a screw. Recognising the problem type picks the tool before you start working.",
        "code": "def pick_graph_tool(question):\n    q = question.lower()\n    if any(w in q for w in [\"prerequisite\", \"depends\", \"order of tasks\"]):\n        return \"topological sort\"\n    if any(w in q for w in [\"cheapest\", \"minimum cost\", \"fastest\"]):\n        return \"Dijkstra\"\n    if any(w in q for w in [\"fewest moves\", \"minimum number of steps\"]):\n        return \"BFS\"\n    return \"DFS or BFS\"\n\nfor q in [\"Course prerequisites: find an order\", \"Cheapest flight from Delhi to Goa\", \"Fewest moves for a knight\", \"Are these two computers connected?\"]:\n    print(pick_graph_tool(q), \"<-\", q)",
        "output": "topological sort <- Course prerequisites: find an order\nDijkstra <- Cheapest flight from Delhi to Goa\nBFS <- Fewest moves for a knight\nDFS or BFS <- Are these two computers connected?",
        "codeNotes": [
          {
            "line": 3,
            "note": "Dependency words point to topological sort."
          }
        ],
        "tryIt": "Add a question of your own, for example \"Which pages can I reach from the home page?\". Does the function pick a sensible tool?",
        "check": {
          "question": "A question asks for an installation order of software packages that depend on each other. Which tool fits?",
          "options": [
            "Dijkstra",
            "Topological sort",
            "Binary search"
          ],
          "answer": 1,
          "why": "Dependencies define a DAG, and a topological sort gives an order that installs every dependency first."
        }
      }
    ],
    "summary": [
      "Dependencies form a directed graph; with no cycles it is a DAG.",
      "In-degree counts prerequisites; in-degree 0 means ready now.",
      "Kahn's algorithm repeatedly takes ready tasks and unlocks others: O(V + E).",
      "If the order misses nodes, there is a cycle and no valid order.",
      "Rounds of ready tasks are stages that can run in parallel."
    ],
    "projectStep": {
      "title": "Dependency tools",
      "steps": [
        "Add find_order(n, prerequisites) and can_finish(n, prerequisites) to dsa_toolkit.py.",
        "Write the prerequisites of 6 subjects you know and print a valid study order.",
        "Bonus: add build_stages(deps) and try it on the steps of a recipe."
      ]
    }
  },
  {
    "day": 24,
    "title": "Disjoint Set Union (Union-Find) with Path Compression",
    "goal": "You can group items with union-find (disjoint set union), use path compression and union by rank, and find the edge that creates a cycle.",
    "minutes": 30,
    "recap": "Yesterday you ordered dependencies with topological sort. Today's tool answers \"are these two in the same group?\" almost instantly, even as groups merge.",
    "parts": [
      {
        "title": "Groups that merge over time",
        "say": [
          "Some problems keep merging groups: friend requests join friend circles, new cables join computer networks, and new roads join towns.",
          "You need two operations: find(x), which tells you which group x is in, and union(x, y), which merges x's group with y's.",
          "Running BFS after every merge would be O(V + E) each time. Union-find (also called disjoint set union, DSU) does both operations in nearly O(1).",
          "The idea: each group is a tree, and every item points to a parent. The root of the tree is the group's representative. find follows parents up to the root.",
          "Two items are in the same group exactly when find gives the same root for both."
        ],
        "example": "Every family nominates a head. To know if two people are related, ask each of them \"who is your family head?\" and compare the answers. Merging families means one head agrees to report to the other.",
        "code": "parent = {name: name for name in [\"asha\", \"bala\", \"chitra\", \"dev\"]}\n\ndef find(x):\n    while parent[x] != x:\n        x = parent[x]\n    return x\n\ndef union(a, b):\n    parent[find(a)] = find(b)\n\nunion(\"asha\", \"bala\")\nunion(\"chitra\", \"dev\")\nprint(find(\"asha\") == find(\"bala\"), find(\"asha\") == find(\"dev\"))\nunion(\"bala\", \"dev\")\nprint(find(\"asha\") == find(\"dev\"))",
        "output": "True False\nTrue",
        "codeNotes": [
          {
            "line": 1,
            "note": "Everyone starts as the head of their own group."
          },
          {
            "line": 4,
            "note": "Follow parents up to the root."
          },
          {
            "line": 9,
            "note": "Merge: one root points to the other."
          }
        ],
        "tryIt": "Print parent after the three unions. You can see the chain of \"reports to\" links.",
        "check": {
          "question": "How do you check whether x and y are in the same group?",
          "options": [
            "Compare x and y directly",
            "Check if find(x) == find(y)",
            "Count the group sizes"
          ],
          "answer": 1,
          "why": "Each group has one root; two items share a group exactly when they have the same root."
        }
      },
      {
        "title": "Path compression",
        "say": [
          "Without care, the trees can become long chains, and find becomes slow, O(N) in the worst case.",
          "Path compression fixes this. After find(x) discovers the root, it points x (and every node on the way) straight at the root. The next find for any of them takes one step.",
          "The recursive version is short: parent[x] = find(parent[x]); return parent[x].",
          "Path compression changes the tree shape but never the group membership, so answers stay correct.",
          "Combined with union by rank (next part), the average cost per operation becomes O(alpha(N)), where alpha grows so slowly that it is below 5 for any number of items in the universe. In practice: constant."
        ],
        "example": "After asking \"who is your family head?\" through a long chain of relatives, everyone on that chain writes the head's name down, so next time they answer at once.",
        "code": "parent = [0, 0, 1, 2, 3]\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\nprint(\"before:\", parent)\nprint(\"find(4) =\", find(4))\nprint(\"after: \", parent)",
        "output": "before: [0, 0, 1, 2, 3]\nfind(4) = 0\nafter:  [0, 0, 0, 0, 0]",
        "codeNotes": [
          {
            "line": 1,
            "note": "A chain: 4 -> 3 -> 2 -> 1 -> 0."
          },
          {
            "line": 5,
            "note": "Point x straight at the root on the way back."
          }
        ],
        "tryIt": "Call find(4) again after the first call. It now takes just one step.",
        "check": {
          "question": "What does path compression do?",
          "options": [
            "Deletes nodes from a group",
            "Points nodes on the find path directly at the root",
            "Sorts the groups"
          ],
          "answer": 1,
          "why": "After finding the root, every node visited is re-linked to the root, flattening the tree."
        }
      },
      {
        "title": "Union by rank and the UnionFind class",
        "say": [
          "Practice 1 builds a UnionFind class for nodes 0 to n - 1 with find, union and connected.",
          "Union by rank keeps trees shallow: attach the shorter tree under the taller one. rank is an estimate of each root's height, and it only grows when two trees of the same rank are joined.",
          "union(x, y) should return False when x and y are already in the same group (nothing to merge) and True after a real merge. That return value is what cycle detection needs.",
          "Keeping a count of groups, reduced by one on every real merge, answers \"how many groups are there?\" in O(1).",
          "This class is only about 20 lines and appears in many interview problems, so it is worth writing until you can do it from memory."
        ],
        "example": "When two companies merge, the smaller one usually becomes a division of the larger, rather than the other way round. That keeps the chain of command short.",
        "code": "class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n        self.groups = n\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n\n    def union(self, x, y):\n        rx, ry = self.find(x), self.find(y)\n        if rx == ry:\n            return False\n        if self.rank[rx] < self.rank[ry]:\n            rx, ry = ry, rx\n        self.parent[ry] = rx\n        if self.rank[rx] == self.rank[ry]:\n            self.rank[rx] += 1\n        self.groups -= 1\n        return True\n\n    def connected(self, x, y):\n        return self.find(x) == self.find(y)\n\nuf = UnionFind(5)\nprint(uf.union(0, 1), uf.union(1, 2), uf.union(0, 2))\nprint(uf.connected(0, 2), uf.connected(0, 3), \"groups:\", uf.groups)",
        "output": "True True False\nTrue False groups: 3",
        "codeNotes": [
          {
            "line": 15,
            "note": "Already in the same group: nothing to merge."
          },
          {
            "line": 17,
            "note": "Make rx the taller tree."
          },
          {
            "line": 21,
            "note": "A real merge: one group fewer."
          }
        ],
        "tryIt": "Union 3 and 4 as well, then print uf.groups. There are now 2 groups: {0, 1, 2} and {3, 4}.",
        "check": {
          "question": "What does union(x, y) return when x and y are already connected?",
          "options": [
            "True",
            "False",
            "The group size"
          ],
          "answer": 1,
          "why": "Nothing is merged, so it returns False, which signals that adding this link would close a loop."
        }
      },
      {
        "title": "Finding the redundant connection",
        "say": [
          "Practice 2: a network of n computers was a tree, and then one extra cable was added, creating a loop. Find the first edge in the list that connects two computers already connected.",
          "Go through the edges in order and union their ends. The moment union returns False, both ends were already connected, so this edge is the redundant one.",
          "This is cycle detection in an undirected graph in O(E alpha(V)), without any BFS or DFS.",
          "Nodes here are numbered from 1 to n, so make the UnionFind one bigger (size n + 1) and ignore index 0.",
          "The same trick finds which road, pipe or cable closes a loop in any network."
        ],
        "example": "Laying phone cables between villages one at a time from a list. If a new cable joins two villages that can already call each other, that cable was not needed.",
        "code": "def find_redundant(edges):\n    parent = list(range(len(edges) + 1))\n    def find(x):\n        if parent[x] != x:\n            parent[x] = find(parent[x])\n        return parent[x]\n    for a, b in edges:\n        ra, rb = find(a), find(b)\n        if ra == rb:\n            return [a, b]\n        parent[ra] = rb\n    return []\n\nprint(find_redundant([[1, 2], [1, 3], [2, 3]]))\nprint(find_redundant([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]))",
        "output": "[2, 3]\n[1, 4]",
        "codeNotes": [
          {
            "line": 2,
            "note": "One slot per computer; index 0 is unused."
          },
          {
            "line": 10,
            "note": "Already connected: this edge closes a loop."
          }
        ],
        "tryIt": "Move [1, 4] to the end of the second list. Before running, trace which edge is now reported first, then run it to check your trace.",
        "check": {
          "question": "In find_redundant, when is an edge reported?",
          "options": [
            "When it is the longest",
            "When its two ends already have the same root",
            "When it is the last edge"
          ],
          "answer": 1,
          "why": "Same root means the two computers were already connected, so this edge creates a cycle."
        }
      },
      {
        "title": "Kruskal's minimum spanning tree",
        "say": [
          "A minimum spanning tree (MST) connects all nodes with the cheapest total edge cost and no loops. Think: the cheapest way to lay cables so every building is connected.",
          "Kruskal's algorithm sorts the edges from cheapest to most expensive and adds each one if it joins two different groups. union returning False means it would make a loop, so skip it.",
          "Sorting is O(E log E); the union-find work is almost O(E). Stop early once V - 1 edges are chosen, because a tree on V nodes has exactly V - 1 edges.",
          "MSTs are used to design networks, electricity grids and road plans, and also in clustering data.",
          "This is union-find's most famous use and a common interview question."
        ],
        "example": "Connecting five villages to the power grid with the least wire: always build the shortest remaining link, unless those two villages are already connected through others.",
        "code": "def kruskal(n, edges):\n    parent = list(range(n))\n    def find(x):\n        if parent[x] != x:\n            parent[x] = find(parent[x])\n        return parent[x]\n    total, chosen = 0, []\n    for w, a, b in sorted(edges):\n        ra, rb = find(a), find(b)\n        if ra != rb:\n            parent[ra] = rb\n            total += w\n            chosen.append((a, b, w))\n    return total, chosen\n\nedges = [(4, 0, 1), (1, 1, 2), (3, 0, 2), (2, 2, 3), (5, 1, 3)]\nprint(kruskal(4, edges))",
        "output": "(6, [(1, 2, 1), (2, 3, 2), (0, 2, 3)])",
        "codeNotes": [
          {
            "line": 8,
            "note": "Cheapest edges first."
          },
          {
            "line": 10,
            "note": "Different groups: this edge adds no loop, so take it."
          }
        ],
        "tryIt": "Change the cost of edge (0, 2) from 3 to 6 and run it again. Kruskal now uses edge (0, 1) instead.",
        "check": {
          "question": "Why does Kruskal skip an edge whose ends are already in the same group?",
          "options": [
            "It is too expensive",
            "It would create a loop",
            "It is a duplicate"
          ],
          "answer": 1,
          "why": "Both ends are already connected, so adding the edge would form a cycle, which a spanning tree cannot have."
        }
      },
      {
        "title": "Union-find or BFS?",
        "say": [
          "Both union-find and BFS/DFS can count groups and detect cycles in undirected graphs. Which should you use?",
          "If the graph is given all at once and you ask one question, BFS or DFS is simple and fine.",
          "If edges keep arriving and you must answer \"are these connected?\" after each one, union-find wins: nearly O(1) per operation, instead of a whole new search each time.",
          "Union-find cannot easily split groups apart again, and it does not give paths between nodes. For those, you still need graph searches.",
          "Knowing when a structure fits, and when it does not, is the skill interviews are really testing."
        ],
        "example": "A wedding guest list growing as RSVPs arrive: after each reply you want to know whether two families are now linked. Updating family heads as you go beats re-reading every reply each time.",
        "code": "import random\n\nrandom.seed(3)\nn = 1000\nparent = list(range(n))\ndef find(x):\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]\n        x = parent[x]\n    return x\n\ngroups = n\nfor step in range(1, 3001):\n    a, b = random.randrange(n), random.randrange(n)\n    ra, rb = find(a), find(b)\n    if ra != rb:\n        parent[ra] = rb\n        groups -= 1\n    if step % 1000 == 0:\n        print(\"after\", step, \"random links:\", groups, \"groups\")",
        "output": "after 1000 random links: 171 groups\nafter 2000 random links: 19 groups\nafter 3000 random links: 1 groups",
        "codeNotes": [
          {
            "line": 8,
            "note": "A loop version of path compression: point to the grandparent while walking up."
          },
          {
            "line": 18,
            "note": "Each real merge reduces the group count by one."
          }
        ],
        "tryIt": "Change the number of links to 6000. How close does the network get to a single group?",
        "check": {
          "question": "When is union-find a better choice than running BFS each time?",
          "options": [
            "When edges keep arriving and connectivity is asked after each one",
            "When you need the actual path",
            "When groups must be split apart"
          ],
          "answer": 0,
          "why": "Union-find answers \"connected?\" in almost O(1) as edges arrive, while BFS would redo a whole search each time."
        }
      }
    ],
    "summary": [
      "Union-find keeps groups as trees; find returns the root, union merges two roots.",
      "Path compression flattens trees during find.",
      "Union by rank attaches the shorter tree under the taller one.",
      "union returning False means the two items were already connected: a cycle.",
      "Kruskal's MST adds the cheapest edges that join different groups."
    ],
    "projectStep": {
      "title": "Union-find tools",
      "steps": [
        "Add the UnionFind class (find, union, connected, groups) to dsa_toolkit.py.",
        "Add find_redundant(edges) and test it on a small network with one extra cable.",
        "Bonus: add kruskal(n, edges) and find the cheapest way to connect 5 places you choose."
      ]
    }
  },
  {
    "day": 25,
    "title": "Dynamic Programming: 1D Memoization vs Tabulation",
    "goal": "You can solve problems with overlapping subproblems using memoization and tabulation, including house robber and climbing stairs.",
    "minutes": 30,
    "recap": "Yesterday you grouped items with union-find. Today begins dynamic programming: remembering answers to small problems so big ones become fast.",
    "parts": [
      {
        "title": "What dynamic programming is",
        "say": [
          "Dynamic programming (DP) solves a problem by breaking it into smaller subproblems, solving each subproblem once, and reusing the answers.",
          "It works when two things are true. Overlapping subproblems: the same small problem appears again and again. Optimal substructure: the best answer to the big problem is built from best answers to smaller ones.",
          "You met the warning sign on Day 11: plain recursive fib(n) makes over a million calls for n = 30 because it solves fib(28) and the rest again and again.",
          "DP turns that exponential work into linear work by storing each answer. The name sounds grand, but the idea is simply \"do not work anything out twice\".",
          "DP questions are among the most common in product-company interviews, so the next three days are worth your full attention."
        ],
        "example": "If someone asks you 1 + 1 + 1 + 1 + 1, you count 5. If they add \"+ 1\", you do not recount; you say 6. You remembered the earlier answer. That is dynamic programming.",
        "code": "calls = 0\ndef fib(n):\n    global calls\n    calls += 1\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nfor n in [10, 20, 25]:\n    calls = 0\n    print(\"fib(\" + str(n) + \") =\", fib(n), \"with\", calls, \"calls\")",
        "output": "fib(10) = 55 with 177 calls\nfib(20) = 6765 with 21891 calls\nfib(25) = 75025 with 242785 calls",
        "codeNotes": [
          {
            "line": 7,
            "note": "Two calls per call: the same values are recomputed many times."
          }
        ],
        "tryIt": "Add 30 to the list and notice how long it takes. That delay is exponential growth.",
        "check": {
          "question": "Which two properties make a problem suitable for dynamic programming?",
          "options": [
            "Sorted input and small numbers",
            "Overlapping subproblems and optimal substructure",
            "Recursion and loops"
          ],
          "answer": 1,
          "why": "The same subproblems repeat (so storing helps), and the best overall answer is built from best sub-answers."
        }
      },
      {
        "title": "Memoization: top-down DP",
        "say": [
          "Memoization keeps the recursive code but stores each answer in a dict (the memo) the first time it is computed. Next time, it returns the stored answer immediately.",
          "This is top-down: you start from the big problem and recurse down, filling the memo on the way back up.",
          "In Python, @lru_cache(maxsize=None) adds memoization to a function in one line, as you saw on Day 5 and Day 11.",
          "With a memo, fib(n) makes about 2n calls instead of an exponential number: O(N) time and O(N) memory.",
          "Memoization is often the easiest way to start a DP problem: write the plain recursion first, check it on small inputs, then add the memo."
        ],
        "example": "Keeping a notebook of answers while doing homework: before working out a question, check the notebook. If the answer is there, copy it; if not, work it out and write it down.",
        "code": "from functools import lru_cache\n\nmemo = {}\ndef fib_memo(n):\n    if n < 2:\n        return n\n    if n not in memo:\n        memo[n] = fib_memo(n - 1) + fib_memo(n - 2)\n    return memo[n]\n\n@lru_cache(maxsize=None)\ndef fib_cached(n):\n    return n if n < 2 else fib_cached(n - 1) + fib_cached(n - 2)\n\nprint(fib_memo(50), fib_cached(50))\nprint(\"answers stored:\", len(memo))",
        "output": "12586269025 12586269025\nanswers stored: 49",
        "codeNotes": [
          {
            "line": 7,
            "note": "Only compute an answer we have not stored yet."
          },
          {
            "line": 11,
            "note": "lru_cache does the same bookkeeping for you."
          }
        ],
        "tryIt": "Print fib_memo(200). It is instant, and the number has 42 digits.",
        "check": {
          "question": "What does memoization store?",
          "options": [
            "The input list",
            "The answer to each subproblem, the first time it is computed",
            "Only the final answer"
          ],
          "answer": 1,
          "why": "Each subproblem's answer is saved, so every later request for it is a quick lookup."
        }
      },
      {
        "title": "Tabulation: bottom-up DP",
        "say": [
          "Tabulation fills a table from the smallest subproblems upwards, with a loop instead of recursion. dp[i] holds the answer for size i.",
          "For fib, dp[0] = 0, dp[1] = 1, and each dp[i] = dp[i - 1] + dp[i - 2]. By the time you need dp[i], the entries it depends on are already filled.",
          "Tabulation avoids recursion limits and function-call overhead, so it is often a little faster and safe for very large n.",
          "Often you only need the last few entries. Keeping just two variables instead of the whole table cuts memory from O(N) to O(1).",
          "Top-down or bottom-up: both are dynamic programming. Use whichever is clearer to you, then optimise."
        ],
        "example": "Building a staircase from the ground up: each new step rests on the ones below it, which are already built.",
        "code": "def fib_table(n):\n    if n < 2:\n        return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i - 1] + dp[i - 2]\n    return dp[n]\n\ndef fib_two_vars(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n\nprint(fib_table(30), fib_two_vars(30), fib_two_vars(90))",
        "output": "832040 832040 2880067194370816120",
        "codeNotes": [
          {
            "line": 7,
            "note": "Each entry uses two entries that are already filled."
          },
          {
            "line": 13,
            "note": "Only the last two values are needed: O(1) memory."
          }
        ],
        "tryIt": "Print fib_table(10) and the whole dp list inside the function to see the table fill up.",
        "check": {
          "question": "What is the main difference between memoization and tabulation?",
          "options": [
            "Only tabulation stores answers",
            "Memoization recurses top-down; tabulation loops bottom-up",
            "Tabulation is always slower"
          ],
          "answer": 1,
          "why": "Both store sub-answers; memoization starts from the top with recursion, tabulation fills a table from the bottom."
        }
      },
      {
        "title": "Climbing stairs",
        "say": [
          "Practice 2: how many different ways can you climb n stairs taking 1 or 2 steps at a time?",
          "Think about the last move. To reach stair n, you were either on stair n - 1 (then took 1 step) or on stair n - 2 (then took 2 steps). So ways(n) = ways(n - 1) + ways(n - 2).",
          "The base cases: ways(1) = 1 and ways(2) = 2 (1 + 1, or 2). It is the Fibonacci pattern in disguise.",
          "This \"think about the last move\" question is the key to most DP problems. Write the answer for n in terms of answers for smaller n.",
          "With two variables, the solution is O(N) time and O(1) space."
        ],
        "example": "Walking up the steps of a temple: your last move was either one step or two. The number of ways to reach the top is the ways to reach the step below plus the ways to reach the step two below.",
        "code": "def climb_stairs(n):\n    if n <= 2:\n        return n\n    two_below, one_below = 1, 2\n    for _ in range(3, n + 1):\n        two_below, one_below = one_below, two_below + one_below\n    return one_below\n\nfor n in [1, 2, 3, 4, 5, 10]:\n    print(n, \"stairs:\", climb_stairs(n), \"ways\")",
        "output": "1 stairs: 1 ways\n2 stairs: 2 ways\n3 stairs: 3 ways\n4 stairs: 5 ways\n5 stairs: 8 ways\n10 stairs: 89 ways",
        "codeNotes": [
          {
            "line": 4,
            "note": "ways(1) and ways(2) start the pattern."
          },
          {
            "line": 6,
            "note": "ways(n) = ways(n - 1) + ways(n - 2)."
          }
        ],
        "tryIt": "List all 5 ways for 4 stairs by hand (for example 1+1+1+1 and 2+2) to check the answer.",
        "check": {
          "question": "Why is ways(n) = ways(n - 1) + ways(n - 2) for climbing stairs?",
          "options": [
            "It is a formula to memorise",
            "The last move was either 1 step from n - 1 or 2 steps from n - 2",
            "Because stairs are Fibonacci numbers"
          ],
          "answer": 1,
          "why": "Every way to reach n ends with a 1-step or a 2-step, so add the ways to reach the two stairs it could come from."
        }
      },
      {
        "title": "House robber: choose or skip",
        "say": [
          "Practice 1: houses in a row hold some money, and you cannot take from two neighbouring houses. What is the most you can take?",
          "At each house there are two choices. Skip it: you keep the best total up to the previous house. Take it: you add its money to the best total up to two houses back.",
          "So best(i) = max(best(i - 1), best(i - 2) + money[i]). This is the \"choose or skip\" pattern, and it appears in many DP problems.",
          "Like climbing stairs, only the last two answers are needed, so two variables are enough.",
          "Always test the edge cases: no houses (0), one house (its money), and two houses (the bigger one)."
        ],
        "example": "Choosing which festival stalls to visit in a street where you cannot visit two stalls side by side: at each stall, decide whether it is worth giving up the stall before it.",
        "code": "def rob(money):\n    prev2, prev1 = 0, 0\n    for m in money:\n        prev2, prev1 = prev1, max(prev1, prev2 + m)\n    return prev1\n\nprint(rob([2, 7, 9, 3, 1]))\nprint(rob([1, 2, 3, 1]))\nprint(rob([]), rob([5]), rob([5, 10]))",
        "output": "12\n4\n0 5 10",
        "codeNotes": [
          {
            "line": 4,
            "note": "Skip this house (prev1) or take it plus the best two back (prev2 + m)."
          },
          {
            "line": 9,
            "note": "Edge cases: no houses, one house, two houses."
          }
        ],
        "tryIt": "Also record which houses were taken. Hint: keep a list for each of prev1 and prev2. For [2, 7, 9, 3, 1] the houses are 0, 2 and 4.",
        "check": {
          "question": "What does rob([2, 1, 1, 2]) return?",
          "options": [
            "3",
            "4",
            "2"
          ],
          "answer": 1,
          "why": "Take the first and last houses, 2 + 2 = 4; they are not neighbours."
        }
      },
      {
        "title": "A recipe for DP problems",
        "say": [
          "Most DP problems can be solved with the same five steps. One: define what dp[i] means in words, for example \"the most money from the first i houses\".",
          "Two: write the recurrence, how dp[i] comes from smaller entries. Three: set the base cases. Four: decide the order to fill the table (usually small to big). Five: find where the final answer is.",
          "Then check the recurrence on a tiny example by hand before trusting the code.",
          "Finally, look at which entries each step uses. If only the last one or two are needed, shrink the table to a few variables.",
          "Tomorrow you will use this recipe on coin change and the knapsack problem, and on Day 27 on two-dimensional tables for comparing strings."
        ],
        "example": "A cooking recipe: ingredients (base cases), method (recurrence), order of steps (fill order) and where to find the finished dish (the answer). Follow the same recipe every time and DP stops feeling like magic.",
        "code": "def min_cost_climbing(cost):\n    # dp[i] = cheapest way to stand on step i (you pay a step's cost when you leave it)\n    n = len(cost)\n    dp = [0] * (n + 1)\n    for i in range(2, n + 1):\n        dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])\n    return dp[n]\n\nprint(min_cost_climbing([10, 15, 20]))\nprint(min_cost_climbing([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]))",
        "output": "15\n6",
        "codeNotes": [
          {
            "line": 2,
            "note": "Step one of the recipe: say in words what dp[i] means."
          },
          {
            "line": 6,
            "note": "The recurrence: arrive from one or two steps below."
          },
          {
            "line": 7,
            "note": "The answer: the top is just past the last step."
          }
        ],
        "tryIt": "Write the five recipe steps for climbing stairs as comments above climb_stairs in your toolkit.",
        "check": {
          "question": "What is the first step of the DP recipe?",
          "options": [
            "Write the loop",
            "Define in words what dp[i] means",
            "Pick the answer"
          ],
          "answer": 1,
          "why": "A clear definition of dp[i] makes the recurrence, base cases and answer much easier to find."
        }
      }
    ],
    "summary": [
      "DP stores answers to overlapping subproblems so each is solved once.",
      "Memoization: recursion plus a memo (or @lru_cache), top-down.",
      "Tabulation: a loop filling dp[] from the base cases, bottom-up.",
      "Climbing stairs and house robber come from thinking about the last move or choice.",
      "Recipe: define dp[i], recurrence, base cases, fill order, answer."
    ],
    "projectStep": {
      "title": "DP tools",
      "steps": [
        "Add climb_stairs(n) and rob(money) to dsa_toolkit.py.",
        "Add a memoized and a tabulated fib and check they agree for n up to 50.",
        "Bonus: add min_cost_climbing(cost) and write the five recipe steps as comments."
      ]
    }
  },
  {
    "day": 26,
    "title": "⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Optimization Engine",
    "goal": "You can solve coin change and the 0/1 knapsack problem with dynamic programming, and explain why greedy choices fail on them.",
    "minutes": 30,
    "recap": "Yesterday you learned memoization, tabulation and the five-step DP recipe. Milestone 4 uses that recipe on two classic optimisation problems.",
    "parts": [
      {
        "title": "When greedy choices fail",
        "say": [
          "A greedy algorithm always takes the choice that looks best right now. For Indian rupee coins (1, 2, 5, 10), always taking the biggest coin that fits does give the fewest coins.",
          "But with coins 1, 3 and 4, making 6 greedily gives 4 + 1 + 1, which is three coins, while 3 + 3 uses only two. The locally best choice led to a worse overall answer.",
          "When greedy fails, dynamic programming tries every choice systematically, but reuses answers so it stays fast.",
          "That is today's theme: optimisation problems where you must compare combinations, not just grab the biggest piece.",
          "Always test a greedy idea on small tricky inputs before trusting it. A single counter-example proves it wrong."
        ],
        "example": "Packing for a trip by always grabbing the heaviest useful item first: the big blanket fills the bag, and there is no room left for the three small things you needed more.",
        "code": "def greedy_coins(coins, amount):\n    used = []\n    for c in sorted(coins, reverse=True):\n        while amount >= c:\n            amount -= c\n            used.append(c)\n    return used if amount == 0 else None\n\nprint(\"rupees, 18:\", greedy_coins([1, 2, 5, 10], 18))\nprint(\"1/3/4, 6:  \", greedy_coins([1, 3, 4], 6))\nprint(\"best for 6 is [3, 3], only 2 coins\")",
        "output": "rupees, 18: [10, 5, 2, 1]\n1/3/4, 6:   [4, 1, 1]\nbest for 6 is [3, 3], only 2 coins",
        "codeNotes": [
          {
            "line": 3,
            "note": "Greedy: always try the biggest coin first."
          },
          {
            "line": 10,
            "note": "Greedy picks 4 + 1 + 1: three coins."
          }
        ],
        "tryIt": "Try greedy_coins([5, 2], 6). Greedy takes 5 and gets stuck with 1 left, even though 2 + 2 + 2 works.",
        "check": {
          "question": "With coins 1, 3 and 4, what is the fewest number of coins that make 6?",
          "options": [
            "3",
            "2",
            "1"
          ],
          "answer": 1,
          "why": "3 + 3 = 6 uses two coins; greedy's 4 + 1 + 1 uses three."
        }
      },
      {
        "title": "Coin change with a DP table",
        "say": [
          "Practice 1: coin_change(coins, amount) returns the fewest coins that make the amount, using each coin as often as you like, or -1 if it cannot be done.",
          "Follow the recipe. best[x] means the fewest coins that make x. The base case is best[0] = 0, since zero needs no coins. Everything else starts at infinity, meaning \"not possible yet\".",
          "The recurrence comes from the last coin used: if the last coin was c, the rest makes x - c. So best[x] = min over coins c of best[x - c] + 1.",
          "Fill x from 1 up to the amount, so best[x - c] is always ready. The answer is best[amount], or -1 if it is still infinity.",
          "Time is O(amount x number of coins), and memory is O(amount)."
        ],
        "example": "A shopkeeper who writes down, for every amount from 1 rupee upwards, the fewest coins needed. For a new amount, they just look at their notes for the amounts one coin smaller.",
        "code": "def coin_change(coins, amount):\n    best = [0] + [float(\"inf\")] * amount\n    for x in range(1, amount + 1):\n        for c in coins:\n            if c <= x and best[x - c] + 1 < best[x]:\n                best[x] = best[x - c] + 1\n    return best[amount] if best[amount] != float(\"inf\") else -1\n\nprint(coin_change([1, 3, 4], 6))\nprint(coin_change([1, 2, 5], 11))\nprint(coin_change([2], 3))",
        "output": "2\n3\n-1",
        "codeNotes": [
          {
            "line": 2,
            "note": "best[0] = 0; every other amount starts as impossible."
          },
          {
            "line": 5,
            "note": "Using coin c last: the rest is best[x - c]."
          },
          {
            "line": 7,
            "note": "Still infinity means it cannot be made."
          }
        ],
        "tryIt": "Print the whole best list for coins [1, 3, 4] and amount 6. Check that best[6] is 2 and best[5] is 2 (4 + 1).",
        "check": {
          "question": "In coin change, what does best[x - c] + 1 represent?",
          "options": [
            "Using coin c twice",
            "Using coin c last, plus the fewest coins for the rest",
            "The number of coin types"
          ],
          "answer": 1,
          "why": "If the last coin is c, the remaining x - c needs best[x - c] coins, plus one for c."
        }
      },
      {
        "title": "Counting the ways instead",
        "say": [
          "A close cousin asks how many different combinations of coins make the amount, rather than the fewest coins.",
          "The table now stores counts: ways[0] = 1 (one way to make zero: use nothing), and each coin adds ways[x - c] to ways[x].",
          "The loop order matters. Putting coins in the outer loop counts combinations (1 + 2 and 2 + 1 are the same). Putting amounts in the outer loop would count orders as different.",
          "Small changes in the question (\"fewest\", \"how many ways\", \"is it possible\") change min, sum or or in the recurrence, but the table idea stays the same.",
          "Reading the question slowly and deciding what dp[x] stores is half of every DP solution."
        ],
        "example": "Counting how many ways you can pay 10 rupees exactly using 2 and 5 rupee coins: five 2s, or two 5s. That is 2 ways, and the order you hand them over does not matter.",
        "code": "def count_ways(coins, amount):\n    ways = [1] + [0] * amount\n    for c in coins:\n        for x in range(c, amount + 1):\n            ways[x] += ways[x - c]\n    return ways[amount]\n\nprint(count_ways([2, 5], 10))\nprint(count_ways([1, 2, 5], 5))\nprint(count_ways([2], 3))",
        "output": "2\n4\n0",
        "codeNotes": [
          {
            "line": 2,
            "note": "One way to make zero: use no coins."
          },
          {
            "line": 3,
            "note": "Coins outside: each combination is counted once."
          }
        ],
        "tryIt": "List the 4 ways to make 5 from coins 1, 2 and 5 on paper, then compare with the output.",
        "check": {
          "question": "Coin change asks for the fewest coins. What changes when you want the number of ways?",
          "options": [
            "Nothing",
            "The table stores counts and adds them instead of taking a minimum",
            "You must use recursion"
          ],
          "answer": 1,
          "why": "Same table idea, different question: add up the ways instead of taking the minimum."
        }
      },
      {
        "title": "The 0/1 knapsack problem",
        "say": [
          "Practice 2: each item has a weight and a value, and your bag holds a limited weight. Each item can be taken at most once. What is the largest total value you can carry?",
          "For each item there are two choices: skip it, or take it (if it fits). That is the \"choose or skip\" pattern from house robber, now with a weight limit.",
          "best[c] means the biggest value that fits in capacity c using the items seen so far. Taking item (w, v) gives best[c - w] + v.",
          "The trick: loop the capacity from high to low. Then best[c - w] still holds the value from before this item was considered, so the item cannot be used twice.",
          "Time is O(number of items x capacity). This \"pseudo-polynomial\" cost is fine when the capacity is a modest number."
        ],
        "example": "A trekker choosing gear for a 5 kg bag limit: a stove, a tent, a camera, a book. Each has a weight and a usefulness score, and they must pick the best set that stays under 5 kg.",
        "code": "def knapsack(weights, values, capacity):\n    best = [0] * (capacity + 1)\n    for w, v in zip(weights, values):\n        for c in range(capacity, w - 1, -1):\n            best[c] = max(best[c], best[c - w] + v)\n    return best[capacity]\n\nprint(knapsack([2, 3, 4, 5], [3, 4, 5, 6], 5))\nprint(knapsack([1, 1, 1], [10, 20, 30], 2))\nprint(knapsack([5], [10], 4))",
        "output": "7\n50\n0",
        "codeNotes": [
          {
            "line": 4,
            "note": "High to low, so each item is used at most once."
          },
          {
            "line": 5,
            "note": "Skip the item, or take it and add its value."
          }
        ],
        "tryIt": "Change the capacity in the first example to 9. The answer becomes 12, from the items weighing 2, 3 and 4.",
        "check": {
          "question": "Why does the knapsack loop go through capacities from high to low?",
          "options": [
            "It is faster",
            "So each item is only counted once",
            "So the answer is sorted"
          ],
          "answer": 1,
          "why": "Going downwards means best[c - w] has not yet been updated for this item, so the item cannot be added twice."
        }
      },
      {
        "title": "Which items were taken?",
        "say": [
          "A useful answer names the chosen items, not just the value. For that, keep the full two-dimensional table: dp[i][c] is the best value using the first i items with capacity c.",
          "After filling it, walk backwards from dp[n][capacity]. If dp[i][c] differs from dp[i - 1][c], item i was taken, so record it and reduce c by its weight.",
          "This costs more memory, O(n x capacity), but it lets you explain the answer, which matters in real products like budget planners.",
          "The same backtracking walk works for most DP tables: the answer tells you the value, and the table remembers how you got there.",
          "You will use the same idea tomorrow to rebuild the common letters of two strings."
        ],
        "example": "A shopping bill that not only says the total came to 950 rupees, but lists which items made up that total.",
        "code": "def knapsack_items(names, weights, values, capacity):\n    n = len(names)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        w, v = weights[i - 1], values[i - 1]\n        for c in range(capacity + 1):\n            dp[i][c] = dp[i - 1][c]\n            if w <= c:\n                dp[i][c] = max(dp[i][c], dp[i - 1][c - w] + v)\n    taken, c = [], capacity\n    for i in range(n, 0, -1):\n        if dp[i][c] != dp[i - 1][c]:\n            taken.append(names[i - 1])\n            c -= weights[i - 1]\n    return dp[n][capacity], taken[::-1]\n\nprint(knapsack_items([\"stove\", \"tent\", \"camera\", \"book\"], [2, 3, 4, 1], [3, 4, 5, 1], 5))",
        "output": "(7, ['stove', 'tent'])",
        "codeNotes": [
          {
            "line": 7,
            "note": "Skip item i: same as without it."
          },
          {
            "line": 12,
            "note": "The value changed, so item i was taken."
          },
          {
            "line": 14,
            "note": "Take away its weight and keep walking back."
          }
        ],
        "tryIt": "Change the book's value to 4 and run it. Now the best choice changes to the camera and the book.",
        "check": {
          "question": "When walking back through the table, how do you know item i was taken?",
          "options": [
            "dp[i][c] is 0",
            "dp[i][c] is different from dp[i - 1][c]",
            "The item is the heaviest"
          ],
          "answer": 1,
          "why": "If adding item i changed the best value, the best answer must use item i."
        }
      },
      {
        "title": "Milestone 4: an optimisation engine",
        "say": [
          "Your Milestone 4 combines both tools into one small engine: make change with the fewest coins and pack the most valuable load under a limit.",
          "Put them behind clear function names, validate the inputs (no negative amounts or weights), and return helpful results such as -1 or an empty list when nothing works.",
          "These two problems are the parents of many real systems: cutting stock in factories, choosing ads for a page, budgeting a project, and loading delivery trucks.",
          "In interviews, if you hear \"choose items with a limit to maximise or minimise something\", think knapsack. If you hear \"make an amount from pieces\", think coin change.",
          "Test with the greedy counter-examples from part 1. If your engine passes those, it is truly doing DP."
        ],
        "example": "A small business planner that tells a caterer both the fewest serving trays to reach 37 portions and which dishes to bring within a budget for the biggest crowd satisfaction.",
        "code": "def coin_change(coins, amount):\n    if amount < 0:\n        raise ValueError(\"amount must not be negative\")\n    best = [0] + [float(\"inf\")] * amount\n    for x in range(1, amount + 1):\n        best[x] = min([best[x - c] + 1 for c in coins if c <= x], default=float(\"inf\"))\n    return best[amount] if best[amount] != float(\"inf\") else -1\n\ndef knapsack(weights, values, capacity):\n    best = [0] * (capacity + 1)\n    for w, v in zip(weights, values):\n        for c in range(capacity, w - 1, -1):\n            best[c] = max(best[c], best[c - w] + v)\n    return best[capacity]\n\nprint(\"trays of 4, 6, 10 for 37 portions:\", coin_change([4, 6, 10], 37))\nprint(\"trays of 4, 6, 10 for 38 portions:\", coin_change([4, 6, 10], 38))\nprint(\"best value in a 10 kg budget:\", knapsack([5, 4, 6, 3], [10, 40, 30, 50], 10))",
        "output": "trays of 4, 6, 10 for 37 portions: -1\ntrays of 4, 6, 10 for 38 portions: 5\nbest value in a 10 kg budget: 90",
        "codeNotes": [
          {
            "line": 6,
            "note": "The same recurrence in one line, with default for \"no coin fits\"."
          },
          {
            "line": 16,
            "note": "37 is odd and every tray is even, so it is impossible."
          }
        ],
        "tryIt": "Try coin_change([1, 3, 4], 6) with this engine to confirm it beats the greedy answer from part 1.",
        "check": {
          "question": "A question says: \"choose projects within a 100-hour budget to maximise profit\". Which pattern fits?",
          "options": [
            "Coin change",
            "0/1 knapsack",
            "Binary search"
          ],
          "answer": 1,
          "why": "Each project is taken once or not at all, under a limit, to maximise a value: the 0/1 knapsack."
        }
      }
    ],
    "summary": [
      "Greedy choices can fail; one small counter-example proves it.",
      "Coin change: best[x] = min over coins of best[x - c] + 1.",
      "Counting ways adds counts instead of taking the minimum.",
      "0/1 knapsack: loop capacity downwards so each item is used once.",
      "Keep the 2D table and walk back to find which items were chosen."
    ],
    "projectStep": {
      "title": "Milestone 4: optimisation engine",
      "steps": [
        "Add coin_change(coins, amount) and knapsack(weights, values, capacity) to dsa_toolkit.py.",
        "Add knapsack_items to report which items were chosen.",
        "Bonus: plan a weekend with 5 activities (hours and fun score) and a 10-hour limit."
      ]
    }
  },
  {
    "day": 27,
    "title": "2D Dynamic Programming: Longest Common Subsequence & Edit Distance",
    "goal": "You can fill a two-dimensional DP table to find the longest common subsequence and the edit distance between two strings.",
    "minutes": 30,
    "recap": "Yesterday's DP tables had one index (an amount or a capacity). Comparing two strings needs two indexes, one for each string.",
    "parts": [
      {
        "title": "Comparing two strings",
        "say": [
          "Many tools compare two pieces of text: git diff shows changed lines, spell checkers suggest the closest word, and DNA tools line up two gene sequences.",
          "A subsequence keeps letters in their order but may skip some. \"ace\" is a subsequence of \"abcde\"; \"aec\" is not, because the order changed.",
          "The longest common subsequence (LCS) of two strings is the longest subsequence found in both. For \"abcde\" and \"ace\" it is \"ace\", length 3.",
          "Trying every subsequence is exponential: a string of 20 letters has over a million subsequences. DP brings it down to O(M x N).",
          "The key new idea: dp[i][j] describes the first i letters of one string and the first j letters of the other."
        ],
        "example": "Two friends comparing their to-do lists for the day: the longest list of tasks that both have, in the same order, even if other tasks sit in between.",
        "code": "def is_subsequence(small, big):\n    it = iter(big)\n    return all(ch in it for ch in small)\n\nprint(is_subsequence(\"ace\", \"abcde\"))\nprint(is_subsequence(\"aec\", \"abcde\"))\nprint(is_subsequence(\"\", \"abc\"))",
        "output": "True\nFalse\nTrue",
        "codeNotes": [
          {
            "line": 3,
            "note": "\"ch in it\" moves forward through big, so the order is enforced."
          }
        ],
        "tryIt": "Check whether \"gta\" is a subsequence of \"genetics data\". Then try \"atg\".",
        "check": {
          "question": "Is \"ace\" a subsequence of \"abcde\"?",
          "options": [
            "No, the letters are not next to each other",
            "Yes, the letters appear in the same order",
            "Only if the strings are the same length"
          ],
          "answer": 1,
          "why": "A subsequence may skip letters; it just has to keep their order."
        }
      },
      {
        "title": "The LCS recurrence",
        "say": [
          "Compare the last letters of the two prefixes, text1[i - 1] and text2[j - 1].",
          "If they match, that letter can end the common subsequence: dp[i][j] = dp[i - 1][j - 1] + 1, one more than the answer without both letters.",
          "If they do not match, at least one of them is not used. Drop one or the other and keep the better: dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]).",
          "The base case is an empty prefix: dp[0][j] = dp[i][0] = 0, since nothing is common with an empty string. That is why the table has one extra row and column.",
          "Fill the table row by row; every cell needs only the cell above, the cell to the left and the diagonal, all filled already."
        ],
        "example": "Two people reading their lists from the end. If the last tasks match, count it and step both back. If not, one of them steps back, and they keep whichever way finds more matches.",
        "code": "def lcs_table(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    return dp\n\ndp = lcs_table(\"abcde\", \"ace\")\nprint(\"    -  a  c  e\")\nfor letter, row in zip(\"-abcde\", dp):\n    print(letter, \" \".join(f\"{v:2}\" for v in row))\nprint(\"LCS length:\", dp[-1][-1])",
        "output": "    -  a  c  e\n-  0  0  0  0\na  0  1  1  1\nb  0  1  1  1\nc  0  1  2  2\nd  0  1  2  2\ne  0  1  2  3\nLCS length: 3",
        "codeNotes": [
          {
            "line": 6,
            "note": "Letters match: diagonal plus one."
          },
          {
            "line": 8,
            "note": "No match: best of dropping a letter from either string."
          },
          {
            "line": 15,
            "note": "The answer is in the bottom-right cell."
          }
        ],
        "tryIt": "Print the table for \"abc\" and \"def\". Every cell stays 0, because there is nothing in common.",
        "check": {
          "question": "When the current letters match, what is dp[i][j]?",
          "options": [
            "max(dp[i - 1][j], dp[i][j - 1])",
            "dp[i - 1][j - 1] + 1",
            "0"
          ],
          "answer": 1,
          "why": "A matching letter extends the best common subsequence of the two shorter prefixes by one."
        }
      },
      {
        "title": "Rebuilding the common letters",
        "say": [
          "Practice 1 asks only for the length, but seeing the actual letters helps you trust the table.",
          "Start at the bottom-right cell. If the letters match, that letter is part of the answer, so step diagonally up-left. Otherwise step towards the neighbour (up or left) with the bigger value.",
          "You collect the letters backwards, so reverse them at the end. This is the same walk-back idea as knapsack_items yesterday.",
          "When there are ties, several different LCS strings may exist with the same length. Any one of them is a correct answer.",
          "Diff tools use this walk to decide which lines stayed the same and which were added or removed."
        ],
        "example": "Retracing footprints in the snow: from the end point, each footprint tells you which step came before, until you are back at the start.",
        "code": "def lcs_string(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            if a[i - 1] == b[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    i, j, letters = len(a), len(b), []\n    while i > 0 and j > 0:\n        if a[i - 1] == b[j - 1]:\n            letters.append(a[i - 1])\n            i, j = i - 1, j - 1\n        elif dp[i - 1][j] >= dp[i][j - 1]:\n            i -= 1\n        else:\n            j -= 1\n    return \"\".join(reversed(letters))\n\nprint(lcs_string(\"abcde\", \"ace\"))\nprint(lcs_string(\"bangalore\", \"mangalore\"))\nprint(repr(lcs_string(\"abc\", \"xyz\")))",
        "output": "ace\nangalore\n''",
        "codeNotes": [
          {
            "line": 12,
            "note": "A match is part of the answer."
          },
          {
            "line": 14,
            "note": "Otherwise move towards the bigger neighbour."
          },
          {
            "line": 18,
            "note": "Letters were collected backwards."
          }
        ],
        "tryIt": "Try lcs_string(\"programming\", \"gaming\"). Check the answer is a subsequence of both words.",
        "check": {
          "question": "Why are the letters reversed at the end?",
          "options": [
            "To sort them",
            "The walk goes from the end of the strings to the start",
            "Python strings are stored backwards"
          ],
          "answer": 1,
          "why": "The walk starts at the last letters, so the letters come out in reverse order."
        }
      },
      {
        "title": "Edit distance",
        "say": [
          "Practice 2: edit distance is the fewest single-letter inserts, deletes or replacements that turn one word into another. It powers \"did you mean...?\" in search and spell checkers.",
          "dp[i][j] is the edit distance between the first i letters of word1 and the first j letters of word2. The base cases: dp[i][0] = i (delete everything) and dp[0][j] = j (insert everything).",
          "If the current letters match, no edit is needed: dp[i][j] = dp[i - 1][j - 1].",
          "Otherwise try all three edits and take the cheapest, plus one: delete (dp[i - 1][j]), insert (dp[i][j - 1]) or replace (dp[i - 1][j - 1]).",
          "Like LCS, it is O(M x N) time. \"horse\" to \"ros\" takes 3 edits: replace h with r, delete r, delete e."
        ],
        "example": "Correcting a typo on your phone: the keyboard suggests the dictionary word that needs the fewest letter changes from what you typed.",
        "code": "def min_distance(word1, word2):\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1):\n        dp[i][0] = i\n    for j in range(n + 1):\n        dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i - 1] == word2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[m][n]\n\nprint(min_distance(\"horse\", \"ros\"))\nprint(min_distance(\"kitten\", \"sitting\"))\nprint(min_distance(\"\", \"abc\"), min_distance(\"same\", \"same\"))",
        "output": "3\n3\n3 0",
        "codeNotes": [
          {
            "line": 5,
            "note": "Turning i letters into nothing takes i deletes."
          },
          {
            "line": 11,
            "note": "Same letter: no edit needed."
          },
          {
            "line": 13,
            "note": "Delete, insert or replace: take the cheapest."
          }
        ],
        "tryIt": "Work out min_distance(\"cat\", \"cut\") in your head first (1 replace), then run it to check.",
        "check": {
          "question": "What is dp[i][0] in the edit distance table?",
          "options": [
            "0",
            "i, because turning i letters into an empty word takes i deletes",
            "j"
          ],
          "answer": 1,
          "why": "An empty target means every one of the i letters must be deleted."
        }
      },
      {
        "title": "A tiny spell checker",
        "say": [
          "Put edit distance to work: given a typed word and a dictionary, suggest the dictionary words closest to it.",
          "Compute the distance to every word and keep those within a small limit, often 2. Sort by distance, then alphabetically for ties.",
          "This checks every word, which is fine for a few thousand words. Large systems first narrow the candidates using tries or indexes of letter groups, then run edit distance on the few that remain.",
          "Notice how the DP function becomes a building block. You do not rewrite it; you call it inside a bigger feature, just like the auto-complete engine used the trie.",
          "That habit, small tested functions composed into features, is what makes large programs manageable."
        ],
        "example": "A teacher marking spelling tests who, for each wrong word, writes the closest correct word in the margin.",
        "code": "def min_distance(a, b):\n    prev = list(range(len(b) + 1))\n    for i in range(1, len(a) + 1):\n        cur = [i] + [0] * len(b)\n        for j in range(1, len(b) + 1):\n            if a[i - 1] == b[j - 1]:\n                cur[j] = prev[j - 1]\n            else:\n                cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])\n        prev = cur\n    return prev[-1]\n\ndef suggest(word, dictionary, limit=2):\n    scored = sorted((min_distance(word, w), w) for w in dictionary)\n    return [w for d, w in scored if d <= limit]\n\nwords = [\"python\", \"pyramid\", \"typhoon\", \"java\", \"pythons\", \"person\"]\nprint(suggest(\"pyhton\", words))\nprint(suggest(\"jav\", words))",
        "output": "['python']\n['java']",
        "codeNotes": [
          {
            "line": 2,
            "note": "Only the previous row is needed, saving memory."
          },
          {
            "line": 14,
            "note": "Closest first, alphabetical on ties."
          }
        ],
        "tryIt": "Add \"pylon\" to the dictionary and suggest(\"pyhon\", words). Which words come back, and at what distance?",
        "check": {
          "question": "Why does min_distance here keep only two rows?",
          "options": [
            "It gives a different answer",
            "Each row only needs the row above it, so memory drops to O(N)",
            "Python limits list sizes"
          ],
          "answer": 1,
          "why": "Every cell uses the current and previous rows only, so older rows can be thrown away."
        }
      },
      {
        "title": "Spotting 2D DP problems",
        "say": [
          "Two inputs to compare (two strings, two lists) usually means a table with one index for each: dp[i][j].",
          "Grid questions, like counting paths in a grid from the top-left to the bottom-right, are 2D DP too: each cell's answer comes from the cell above and the cell to the left.",
          "Ask the recipe questions again: what does dp[i][j] mean, how does it come from neighbours, what are the first row and column, and where is the answer?",
          "Draw the table for a tiny example before coding. Most bugs in 2D DP are off-by-one mistakes between table indexes and string indexes, which a drawing catches.",
          "Tomorrow switches to backtracking, for problems where you must list or count every valid arrangement."
        ],
        "example": "A city laid out in square blocks: the number of ways to walk from home to school moving only right or down is the ways to the block above plus the ways to the block on the left.",
        "code": "def grid_paths(rows, cols):\n    dp = [[1] * cols for _ in range(rows)]\n    for r in range(1, rows):\n        for c in range(1, cols):\n            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]\n    return dp[-1][-1]\n\nprint(grid_paths(2, 2), grid_paths(3, 3), grid_paths(3, 7))",
        "output": "2 6 28",
        "codeNotes": [
          {
            "line": 2,
            "note": "First row and column: only one way to reach them."
          },
          {
            "line": 5,
            "note": "From above plus from the left."
          }
        ],
        "tryIt": "Calculate grid_paths(10, 10). It is 48620: far too many to list by hand, but instant with DP.",
        "check": {
          "question": "In a grid where you can only move right or down, where does the number of paths to a cell come from?",
          "options": [
            "Only the cell above",
            "The cell above plus the cell to the left",
            "The diagonal cell"
          ],
          "answer": 1,
          "why": "The last move into the cell was either down (from above) or right (from the left)."
        }
      }
    ],
    "summary": [
      "Two strings need a 2D table: dp[i][j] for the first i and first j letters.",
      "LCS: match gives diagonal + 1; otherwise take the best of up and left.",
      "Edit distance: match copies the diagonal; otherwise 1 + the cheapest of three edits.",
      "Walk back through the table to rebuild the actual answer.",
      "Two rows are enough when each row only needs the one above."
    ],
    "projectStep": {
      "title": "String DP tools",
      "steps": [
        "Add longest_common_subsequence and min_distance to dsa_toolkit.py.",
        "Add suggest(word, dictionary) and test it with 10 words you often mistype.",
        "Bonus: add lcs_string and use it to show what two sentences have in common."
      ]
    }
  },
  {
    "day": 28,
    "title": "Backtracking: N-Queens & Constraint Satisfaction",
    "goal": "You can solve search problems with backtracking: choose, explore, un-choose, and prune early, as in N-Queens and Sudoku validation.",
    "minutes": 30,
    "recap": "DP helped when subproblems overlap. Some problems instead ask for every valid arrangement. Backtracking explores those arrangements, abandoning bad paths early.",
    "parts": [
      {
        "title": "Choose, explore, un-choose",
        "say": [
          "Backtracking builds a solution one choice at a time. After each choice it explores further. If that path fails, or once it is finished, it undoes the choice and tries the next one.",
          "The pattern is always the same: choose (add to the current solution), explore (recurse), un-choose (remove it again).",
          "It is a depth-first search over a tree of partial solutions. Each level is one decision, and each leaf is a complete candidate.",
          "Generating all permutations of a list is the simplest example: pick an unused item for each position.",
          "The un-choose step is what people forget. Without it, choices from one branch leak into the next, and the results are wrong."
        ],
        "example": "Finding your way through a maze by hand: at each junction pick a path, and if it dead-ends, walk back to the junction and try the next path.",
        "code": "def permutations(items):\n    result, current, used = [], [], [False] * len(items)\n    def explore():\n        if len(current) == len(items):\n            result.append(current[:])\n            return\n        for i, item in enumerate(items):\n            if not used[i]:\n                used[i] = True\n                current.append(item)\n                explore()\n                current.pop()\n                used[i] = False\n    explore()\n    return result\n\nfor p in permutations([\"tea\", \"coffee\", \"juice\"]):\n    print(p)",
        "output": "['tea', 'coffee', 'juice']\n['tea', 'juice', 'coffee']\n['coffee', 'tea', 'juice']\n['coffee', 'juice', 'tea']\n['juice', 'tea', 'coffee']\n['juice', 'coffee', 'tea']",
        "codeNotes": [
          {
            "line": 5,
            "note": "A complete arrangement: save a copy."
          },
          {
            "line": 10,
            "note": "Choose."
          },
          {
            "line": 11,
            "note": "Explore."
          },
          {
            "line": 12,
            "note": "Un-choose, so the next branch starts clean."
          }
        ],
        "tryIt": "Remove the current.pop() line and run it. The output breaks, showing why un-choosing matters.",
        "check": {
          "question": "What are the three steps of backtracking?",
          "options": [
            "Sort, search, return",
            "Choose, explore, un-choose",
            "Divide, conquer, combine"
          ],
          "answer": 1,
          "why": "Make a choice, explore what follows from it, then undo it before trying the next choice."
        }
      },
      {
        "title": "Pruning: stop early",
        "say": [
          "A plain search tries every arrangement, which grows factorially: 10 items have 3,628,800 orders.",
          "Pruning means checking constraints as you go and abandoning a path as soon as it cannot lead to a valid answer. Whole subtrees are skipped.",
          "Subset sum shows this well: choose numbers that add up to a target. If the numbers are sorted and the running total already exceeds the target, every bigger number will too, so stop.",
          "Good pruning can turn an impossible search into an instant one. The earlier a bad choice is detected, the more work is saved.",
          "In the code, the counter shows how many calls happen with and without pruning."
        ],
        "example": "A chef testing recipes who stops tasting a sauce the moment it is too salty, instead of finishing the whole dish to find out.",
        "code": "calls = 0\ndef subsets_with_sum(nums, target, prune):\n    global calls\n    nums, found, current = sorted(nums), [], []\n    def explore(start, total):\n        global calls\n        calls += 1\n        if total == target:\n            found.append(current[:])\n        for i in range(start, len(nums)):\n            if prune and total + nums[i] > target:\n                break\n            current.append(nums[i])\n            explore(i + 1, total + nums[i])\n            current.pop()\n    explore(0, 0)\n    return found\n\nnums = [3, 34, 4, 12, 5, 2, 8, 21, 13, 7]\nfor prune in [False, True]:\n    calls = 0\n    answer = subsets_with_sum(nums, 9, prune)\n    print(\"prune\" if prune else \"no prune\", answer, \"calls:\", calls)",
        "output": "no prune [[2, 3, 4], [2, 7], [4, 5]] calls: 1024\nprune [[2, 3, 4], [2, 7], [4, 5]] calls: 15",
        "codeNotes": [
          {
            "line": 11,
            "note": "Sorted numbers: once one is too big, all later ones are too."
          },
          {
            "line": 13,
            "note": "Choose, explore, un-choose."
          }
        ],
        "tryIt": "Change the target to 20 and compare the call counts again.",
        "check": {
          "question": "What does pruning do in backtracking?",
          "options": [
            "Removes duplicate answers",
            "Abandons a path as soon as it cannot lead to a valid answer",
            "Sorts the answers"
          ],
          "answer": 1,
          "why": "Stopping early skips the whole subtree of choices below a bad partial solution."
        }
      },
      {
        "title": "N-Queens",
        "say": [
          "Practice 1: place n queens on an n x n chessboard so that no two attack each other: no shared row, column or diagonal. Count the ways.",
          "Place one queen per row. For each row, try every column, skipping any square that is attacked by the queens already placed.",
          "Checking attacks quickly is the clever part. Squares on the same \"\\\" diagonal share row - col, and squares on the same \"/\" diagonal share row + col. Keep three sets: used columns, used row - col, used row + col.",
          "Each check is O(1), and bad squares are skipped straight away, which prunes huge parts of the search. 8 queens has 92 solutions and is found in a blink.",
          "When a row has no safe column, the function simply returns 0 for that branch, and the loop above tries the next column: that is the backtrack."
        ],
        "example": "Seating guests at a wedding where certain relatives must not sit in the same row, column or diagonal line of tables. You seat them one row at a time and move someone the moment a conflict appears.",
        "code": "def total_n_queens(n):\n    cols, diag1, diag2 = set(), set(), set()\n    def place(row):\n        if row == n:\n            return 1\n        count = 0\n        for col in range(n):\n            if col in cols or row - col in diag1 or row + col in diag2:\n                continue\n            cols.add(col); diag1.add(row - col); diag2.add(row + col)\n            count += place(row + 1)\n            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)\n        return count\n    return place(0)\n\nfor n in [1, 4, 6, 8]:\n    print(n, \"queens:\", total_n_queens(n), \"solutions\")",
        "output": "1 queens: 1 solutions\n4 queens: 2 solutions\n6 queens: 4 solutions\n8 queens: 92 solutions",
        "codeNotes": [
          {
            "line": 8,
            "note": "Attacked square: prune immediately."
          },
          {
            "line": 10,
            "note": "Choose: mark the column and both diagonals."
          },
          {
            "line": 12,
            "note": "Un-choose before trying the next column."
          }
        ],
        "tryIt": "Try n = 2 and n = 3. Both have 0 solutions: no safe arrangement exists.",
        "check": {
          "question": "Two squares are on the same \"\\\" diagonal when...",
          "options": [
            "Their rows are equal",
            "Their row - col values are equal",
            "Their row + col values are equal"
          ],
          "answer": 1,
          "why": "Moving one step down-right adds 1 to both row and col, so row - col stays the same."
        }
      },
      {
        "title": "Printing a board",
        "say": [
          "Counting is useful, but it helps to see one solution. Instead of counting, record the column chosen in each row and stop at the first complete board.",
          "Returning True as soon as a solution is found stops the whole search early. This is a common variation: \"find one\" is usually much faster than \"find all\".",
          "Printing Q for queens and dots for empty squares makes the answer easy to check by eye.",
          "This small change, from counting to recording, is typical. The backtracking skeleton stays the same; only what happens at the leaf changes.",
          "Try reading the board and checking by hand that no two queens share a column or diagonal."
        ],
        "example": "Solving a jigsaw and stopping as soon as it is complete, rather than looking for every other way the pieces could fit.",
        "code": "def one_board(n):\n    queens = []\n    def place(row):\n        if row == n:\n            return True\n        for col in range(n):\n            if all(col != c and abs(col - c) != row - r for r, c in enumerate(queens)):\n                queens.append(col)\n                if place(row + 1):\n                    return True\n                queens.pop()\n        return False\n    place(0)\n    return [\"\".join(\"Q\" if c == col else \".\" for c in range(n)) for col in queens]\n\nfor line in one_board(6):\n    print(line)",
        "output": ".Q....\n...Q..\n.....Q\nQ.....\n..Q...\n....Q.",
        "codeNotes": [
          {
            "line": 7,
            "note": "Same column, or same diagonal (column gap equals row gap)."
          },
          {
            "line": 10,
            "note": "Found a full board: stop searching."
          }
        ],
        "tryIt": "Print one_board(8). It is a valid 8-queens board: check two of the diagonals by hand.",
        "check": {
          "question": "Why is \"find one solution\" usually faster than \"count all solutions\"?",
          "options": [
            "It uses less memory",
            "The search stops as soon as the first solution is found",
            "It skips pruning"
          ],
          "answer": 1,
          "why": "Returning True up the call chain ends the search immediately."
        }
      },
      {
        "title": "Sudoku validation with sets",
        "say": [
          "Practice 2 is a constraint check rather than a search: is a partly filled Sudoku board valid, with no digit repeated in any row, column or 3 x 3 box?",
          "Record each digit three ways in one set: (\"row\", r, d), (\"col\", c, d) and (\"box\", r // 3, c // 3, d). If any record is already in the set, the board breaks a rule.",
          "r // 3 and c // 3 turn a cell's position into its box number, from (0, 0) to (2, 2).",
          "This single pass over 81 cells is O(1) for a fixed board size. It is exactly the check a Sudoku solver runs before each choice, which is how solvers prune.",
          "A full solver is backtracking plus this check: fill an empty cell with each digit that keeps the board valid, recurse, and undo on failure."
        ],
        "example": "A cinema checking seat bookings: no seat number twice in a row, a column, or a small section. One list of \"already booked\" records catches every clash.",
        "code": "def is_valid_sudoku(board):\n    seen = set()\n    for r in range(9):\n        for c in range(9):\n            d = board[r][c]\n            if d == \".\":\n                continue\n            records = [(\"row\", r, d), (\"col\", c, d), (\"box\", r // 3, c // 3, d)]\n            if any(rec in seen for rec in records):\n                return False\n            seen.update(records)\n    return True\n\nboard = [[\".\"] * 9 for _ in range(9)]\nboard[0][0], board[0][4], board[4][4] = \"5\", \"3\", \"7\"\nprint(is_valid_sudoku(board))\nboard[2][2] = \"5\"\nprint(is_valid_sudoku(board))",
        "output": "True\nFalse",
        "codeNotes": [
          {
            "line": 8,
            "note": "One digit, three records: its row, column and box."
          },
          {
            "line": 9,
            "note": "A record already seen means a clash."
          },
          {
            "line": 17,
            "note": "Another 5 in the top-left box: invalid."
          }
        ],
        "tryIt": "Instead of [2][2], put the second 5 at board[0][8] (same row). It should also print False.",
        "check": {
          "question": "Which box does the cell at row 4, column 7 belong to?",
          "options": [
            "(1, 2)",
            "(4, 7)",
            "(2, 1)"
          ],
          "answer": 0,
          "why": "4 // 3 = 1 and 7 // 3 = 2, so it is box (1, 2)."
        }
      },
      {
        "title": "When to reach for backtracking",
        "say": [
          "Clues in a question: \"list all\", \"every combination\", \"count arrangements\", \"place pieces so that...\", or puzzles like Sudoku and crosswords.",
          "Backtracking is exponential in the worst case, so it suits small inputs, typically up to around 20 choices, or problems where pruning is very strong.",
          "If the same partial states repeat, add memoization and it becomes DP. If you only need the best value, DP or greedy may be far faster.",
          "Write the skeleton first: a base case that records a solution, a loop over choices, a validity check, then choose, explore and un-choose. Fill in the problem-specific parts after.",
          "Tomorrow is a change of pace: bit manipulation, small tricks that save memory and time."
        ],
        "example": "A locksmith trying combinations on a 3-digit lock: 1000 options is fine to try, but a 20-digit lock needs something smarter than trying them all.",
        "code": "def combinations(items, k):\n    result, current = [], []\n    def explore(start):\n        if len(current) == k:\n            result.append(current[:])\n            return\n        for i in range(start, len(items)):\n            current.append(items[i])\n            explore(i + 1)\n            current.pop()\n    explore(0)\n    return result\n\nteams = combinations([\"Asha\", \"Bala\", \"Chitra\", \"Dev\"], 2)\nprint(len(teams), \"pairs:\", teams)",
        "output": "6 pairs: [['Asha', 'Bala'], ['Asha', 'Chitra'], ['Asha', 'Dev'], ['Bala', 'Chitra'], ['Bala', 'Dev'], ['Chitra', 'Dev']]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Base case: a complete choice."
          },
          {
            "line": 9,
            "note": "Start after i, so each pair appears once in one order."
          }
        ],
        "tryIt": "Make teams of 3 instead. There should be 4 of them.",
        "check": {
          "question": "Which clue suggests backtracking?",
          "options": [
            "\"Find the shortest route\"",
            "\"List all valid arrangements\"",
            "\"Find the maximum in a list\""
          ],
          "answer": 1,
          "why": "Listing or counting every valid arrangement is the classic backtracking job."
        }
      }
    ],
    "summary": [
      "Backtracking: choose, explore, un-choose, over a tree of partial solutions.",
      "Pruning abandons paths early, skipping whole subtrees.",
      "N-Queens tracks columns and both diagonals (row - col, row + col) in sets.",
      "Returning as soon as one solution is found stops the search early.",
      "Sudoku validation records (row, col, box) facts in one set."
    ],
    "projectStep": {
      "title": "Backtracking tools",
      "steps": [
        "Add total_n_queens(n) and is_valid_sudoku(board) to dsa_toolkit.py.",
        "Add combinations(items, k) and list every pair of 5 friends for a doubles game.",
        "Bonus: turn is_valid_sudoku into a full solver using backtracking."
      ]
    }
  },
  {
    "day": 29,
    "title": "Bit Manipulation & XOR Tricks (O(1) Space Magic)",
    "goal": "You can read numbers in binary and use &, |, ^, << and >> to solve problems with O(1) extra memory, including single number and counting 1 bits.",
    "minutes": 30,
    "recap": "Yesterday you searched arrangements with backtracking. Today's tools work on the individual bits inside a number.",
    "parts": [
      {
        "title": "Numbers in binary",
        "say": [
          "Computers store whole numbers in binary: each digit is a bit, 0 or 1, and each position is worth double the one to its right: 1, 2, 4, 8, 16 and so on.",
          "11 is 1011 in binary: 8 + 0 + 2 + 1. In Python, bin(11) gives \"0b1011\", and format(11, \"04b\") gives \"1011\" padded to 4 digits.",
          "Bit manipulation works on these bits directly. It is very fast, because the processor does it in one step, and it can pack many true/false values into one number.",
          "You will find it in permissions (read, write, execute), network addresses, graphics, compression, and in many interview questions.",
          "Before any trick, get comfortable converting small numbers between decimal and binary."
        ],
        "example": "A row of light switches: each switch is on or off, and the whole row together can be read as one number.",
        "code": "for n in [1, 2, 5, 11, 16, 255]:\n    print(n, \"=\", format(n, \"08b\"))\nprint(int(\"1011\", 2))\nprint(bin(13).count(\"1\"), \"one bits in 13\")",
        "output": "1 = 00000001\n2 = 00000010\n5 = 00000101\n11 = 00001011\n16 = 00010000\n255 = 11111111\n11\n3 one bits in 13",
        "codeNotes": [
          {
            "line": 2,
            "note": "Show each number as 8 binary digits."
          },
          {
            "line": 3,
            "note": "Convert binary text back to a number."
          }
        ],
        "tryIt": "Write 6 and 9 in binary on paper, then print them to check.",
        "check": {
          "question": "What is 1011 in binary as a decimal number?",
          "options": [
            "13",
            "11",
            "7"
          ],
          "answer": 1,
          "why": "8 + 0 + 2 + 1 = 11."
        }
      },
      {
        "title": "The bitwise operators",
        "say": [
          "a & b (AND) keeps a bit only if it is 1 in both. a | b (OR) keeps a bit if it is 1 in either. a ^ b (XOR) keeps a bit if it is 1 in exactly one.",
          "a << k shifts the bits left by k places, which multiplies by 2 to the power k. a >> k shifts right, dividing by 2 to the power k and dropping the remainder.",
          "Common single-bit jobs: n & (1 << i) tests bit i, n | (1 << i) sets it, and n & ~(1 << i) clears it.",
          "n & 1 tells you whether n is odd, without using the % operator.",
          "Read each result in binary in the code output; the patterns become obvious once you see them lined up."
        ],
        "example": "Two class attendance sheets written as rows of 1s and 0s. AND shows who came both days, OR shows who came on any day, and XOR shows who came on only one of the days.",
        "code": "a, b = 0b1100, 0b1010\nprint(\"a     \", format(a, \"04b\"))\nprint(\"b     \", format(b, \"04b\"))\nprint(\"a & b \", format(a & b, \"04b\"))\nprint(\"a | b \", format(a | b, \"04b\"))\nprint(\"a ^ b \", format(a ^ b, \"04b\"))\nprint(\"5 << 1 =\", 5 << 1, \"| 20 >> 2 =\", 20 >> 2)\nn = 0b0101\nprint(\"bit 2 set?\", bool(n & (1 << 2)), \"| odd?\", bool(n & 1))",
        "output": "a      1100\nb      1010\na & b  1000\na | b  1110\na ^ b  0110\n5 << 1 = 10 | 20 >> 2 = 5\nbit 2 set? True | odd? True",
        "codeNotes": [
          {
            "line": 4,
            "note": "AND: 1 only where both are 1."
          },
          {
            "line": 6,
            "note": "XOR: 1 where exactly one is 1."
          },
          {
            "line": 7,
            "note": "Shifts multiply or divide by powers of 2."
          }
        ],
        "tryIt": "Set bit 1 of n with n | (1 << 1) and print it in binary. It becomes 0111.",
        "check": {
          "question": "What is 6 ^ 3?",
          "options": [
            "7",
            "5",
            "2"
          ],
          "answer": 1,
          "why": "110 XOR 011 = 101, which is 5."
        }
      },
      {
        "title": "XOR magic: single number",
        "say": [
          "Practice 1: every number in a list appears twice, except one. Find it using O(1) extra memory.",
          "XOR has three useful rules: x ^ x = 0 (a number cancels itself), x ^ 0 = x, and the order of XORs does not matter.",
          "So XOR all the numbers together. Every pair cancels to 0, and only the single number is left.",
          "A set or Counter would work too, but uses O(N) memory. XOR solves it in one pass with a single variable.",
          "The same rules find a missing number from 0 to n: XOR all indexes and all values, and everything cancels except the missing one."
        ],
        "example": "Socks on a washing line: take down every matching pair, and the one left hanging is the odd sock.",
        "code": "def single_number(nums):\n    result = 0\n    for x in nums:\n        result ^= x\n    return result\n\ndef missing_number(nums):\n    result = len(nums)\n    for i, x in enumerate(nums):\n        result ^= i ^ x\n    return result\n\nprint(single_number([4, 1, 2, 1, 2]))\nprint(single_number([7, 3, 7]))\nprint(missing_number([3, 0, 1]))",
        "output": "4\n3\n2",
        "codeNotes": [
          {
            "line": 4,
            "note": "Pairs cancel: x ^ x = 0."
          },
          {
            "line": 10,
            "note": "Indexes and values cancel except the missing one."
          }
        ],
        "tryIt": "Print the value of result inside the loop for [4, 1, 2, 1, 2] in binary to watch the pairs cancel.",
        "check": {
          "question": "Why does XOR-ing all numbers find the single one?",
          "options": [
            "XOR sorts the list",
            "Each pair cancels (x ^ x = 0), leaving only the single number",
            "XOR finds the largest value"
          ],
          "answer": 1,
          "why": "Order does not matter for XOR, so every pair cancels out and only the unpaired number remains."
        }
      },
      {
        "title": "Counting 1 bits",
        "say": [
          "Practice 2: count how many 1 bits a number has. This is called the Hamming weight, and it is used in error detection and in comparing fingerprints of images.",
          "The simple way checks the lowest bit with n & 1, then shifts right, once for every bit.",
          "The clever way uses n & (n - 1), which clears the lowest 1 bit. Subtracting 1 flips the lowest 1 to 0 and the 0s after it to 1, and AND wipes those out.",
          "So repeat n &= n - 1 until n is 0, counting the steps. It loops once per 1 bit, not once per bit.",
          "A related trick: n > 0 and n & (n - 1) == 0 is True exactly when n is a power of two, because powers of two have a single 1 bit."
        ],
        "example": "Crossing off the lowest ticked box on a form, one tick at a time, and counting how many times you did it.",
        "code": "def hamming_weight(n):\n    count = 0\n    while n:\n        n &= n - 1\n        count += 1\n    return count\n\nn = 12\nprint(format(n, \"04b\"), \"&\", format(n - 1, \"04b\"), \"=\", format(n & (n - 1), \"04b\"))\nprint(hamming_weight(11), hamming_weight(255), hamming_weight(0))\nprint([x for x in range(1, 70) if x & (x - 1) == 0])",
        "output": "1100 & 1011 = 1000\n3 8 0\n[1, 2, 4, 8, 16, 32, 64]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Clear the lowest 1 bit."
          },
          {
            "line": 9,
            "note": "1100 & 1011 = 1000: the lowest 1 disappeared."
          },
          {
            "line": 11,
            "note": "Powers of two have exactly one 1 bit."
          }
        ],
        "tryIt": "Count the 1 bits of 1023 before running. (1023 is 2 to the power 10 minus 1.)",
        "check": {
          "question": "What does n & (n - 1) do?",
          "options": [
            "Doubles n",
            "Clears the lowest 1 bit of n",
            "Sets all bits to 1"
          ],
          "answer": 1,
          "why": "Subtracting 1 flips the lowest 1 and the zeros below it; AND-ing removes that lowest 1."
        }
      },
      {
        "title": "Bitmasks as tiny sets",
        "say": [
          "A number with n bits can represent any subset of n items: bit i is 1 if item i is in the set. This is a bitmask.",
          "Adding item i is mask | (1 << i), checking it is mask & (1 << i), and joining two sets is a | b. All are single, fast operations.",
          "Looping mask from 0 to 2 to the power n minus 1 visits every subset exactly once, a neat alternative to backtracking for small n.",
          "Unix file permissions are bitmasks: read = 4, write = 2, execute = 1, so 7 means all three and 5 means read and execute.",
          "Bitmask DP, where the mask is part of the DP state, solves problems like the travelling salesman for small numbers of cities."
        ],
        "example": "A pizza order form with a checkbox for each topping. The row of ticks is one number, and every combination of toppings is a different number.",
        "code": "toppings = [\"cheese\", \"corn\", \"onion\", \"paneer\"]\ndef describe(mask):\n    return [t for i, t in enumerate(toppings) if mask & (1 << i)]\n\norder = 0\norder |= 1 << 0\norder |= 1 << 3\nprint(format(order, \"04b\"), describe(order))\nprint(\"all subsets:\", 2 ** len(toppings))\nfor mask in range(4):\n    print(format(mask, \"04b\"), describe(mask))\nREAD, WRITE, EXECUTE = 4, 2, 1\nperm = READ | EXECUTE\nprint(\"permission\", perm, \"can write?\", bool(perm & WRITE))",
        "output": "1001 ['cheese', 'paneer']\nall subsets: 16\n0000 []\n0001 ['cheese']\n0010 ['corn']\n0011 ['cheese', 'corn']\npermission 5 can write? False",
        "codeNotes": [
          {
            "line": 6,
            "note": "Add cheese (bit 0)."
          },
          {
            "line": 10,
            "note": "Every mask is a different subset."
          },
          {
            "line": 13,
            "note": "Read and execute: 4 + 1 = 5."
          }
        ],
        "tryIt": "Change the loop to range(16) to list every possible pizza.",
        "check": {
          "question": "With READ = 4, WRITE = 2 and EXECUTE = 1, what does permission 6 mean?",
          "options": [
            "Read and execute",
            "Read and write",
            "Write and execute"
          ],
          "answer": 1,
          "why": "6 = 4 + 2, which is read and write."
        }
      },
      {
        "title": "Using bits wisely",
        "say": [
          "Bit tricks are fast and compact, but they are harder to read. In everyday application code, a clear set or boolean is usually better.",
          "Use bits when memory really matters (millions of flags), when a format demands it (network protocols, file headers), or when an interview question asks for O(1) extra space.",
          "Python integers never overflow, which makes some tricks behave differently from languages like Java or C. For example, ~5 is -6 in Python, not a large positive number.",
          "Always add a short comment explaining a bit trick, so the next reader does not have to decode it.",
          "Tomorrow is the capstone, where you combine graphs, heaps and DP into a flight-routing engine."
        ],
        "example": "Shorthand notes are quick to write but hard for someone else to read. Use them when speed truly matters, and add a legend so others can follow.",
        "code": "def is_power_of_two(n):\n    # A power of two has exactly one 1 bit; n & (n - 1) clears it.\n    return n > 0 and n & (n - 1) == 0\n\nflags = 0\nfor day in [1, 3, 4, 10]:\n    flags |= 1 << day\nprint(\"attended day 3?\", bool(flags & (1 << 3)), \"| day 5?\", bool(flags & (1 << 5)))\nprint(\"days attended:\", bin(flags).count(\"1\"))\nprint([n for n in [0, 1, 6, 8, 64, 100] if is_power_of_two(n)])\nprint(~5)",
        "output": "attended day 3? True | day 5? False\ndays attended: 4\n[1, 8, 64]\n-6",
        "codeNotes": [
          {
            "line": 2,
            "note": "A short comment explains the trick."
          },
          {
            "line": 7,
            "note": "One number stores attendance for many days."
          },
          {
            "line": 11,
            "note": "Python's ~5 is -6."
          }
        ],
        "tryIt": "Store your own attendance for the past two weeks in one number and print how many days you attended.",
        "check": {
          "question": "When is a bit trick a good choice over a plain set?",
          "options": [
            "Always",
            "When memory or speed really matters, or a format requires it",
            "Never"
          ],
          "answer": 1,
          "why": "Bits save memory and time, but cost readability, so use them where those savings matter."
        }
      }
    ],
    "summary": [
      "Each bit is a power of two; bin() and format(n, \"b\") show them.",
      "&, |, ^ combine bits; << and >> multiply and divide by powers of two.",
      "XOR cancels pairs: x ^ x = 0, which finds the single number.",
      "n & (n - 1) clears the lowest 1 bit, used to count bits and test powers of two.",
      "Bitmasks store small sets in one number."
    ],
    "projectStep": {
      "title": "Bit tools",
      "steps": [
        "Add single_number(nums) and hamming_weight(n) to dsa_toolkit.py.",
        "Add is_power_of_two(n) with a comment explaining the trick.",
        "Bonus: use a bitmask loop to list every subset of 4 study topics."
      ]
    }
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Real-Time Global Flight Path Routing & Navigation Optimizer",
    "goal": "You can build a flight-routing engine that finds the cheapest route with at most k stops, audits the network, and explain the trade-offs of the algorithms you chose.",
    "minutes": 30,
    "recap": "In 30 days you learned complexity, arrays, hashing, recursion, sorting, trees, heaps, tries, graphs, DP, backtracking and bits. The capstone brings the most important of them together.",
    "parts": [
      {
        "title": "The capstone problem",
        "say": [
          "You are building the route engine for a flight search site. Airports are numbered 0 to n - 1, and each flight is [from, to, price].",
          "Travellers want the cheapest ticket from src to dst, but many refuse more than k stops. So the question is: the cheapest route that uses at most k + 1 flights.",
          "Plain Dijkstra finds the cheapest route overall, but it ignores the number of stops, so it may return a cheap route with too many changes.",
          "Practice 1 is find_cheapest_flight(n, flights, src, dst, k). Practice 2 is audit_flight_graph(flights), a summary of the network for the operations team.",
          "Before coding, model the data: which structure fits flights, and what does each step of the algorithm need to know?"
        ],
        "example": "Booking a Delhi to Goa trip: a route with three changes might be cheapest, but most people would pay a little more for at most one stop.",
        "code": "flights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]]\nnames = {0: \"DEL\", 1: \"BOM\", 2: \"BLR\", 3: \"GOI\"}\nfor u, v, price in flights:\n    print(names[u], \"->\", names[v], \"Rs\", price)\nprint(\"DEL-BOM-GOI costs\", 100 + 600, \"with 1 stop\")\nprint(\"DEL-BOM-BLR-GOI costs\", 100 + 100 + 200, \"with 2 stops\")",
        "output": "DEL -> BOM Rs 100\nBOM -> BLR Rs 100\nBLR -> DEL Rs 100\nBOM -> GOI Rs 600\nBLR -> GOI Rs 200\nDEL-BOM-GOI costs 700 with 1 stop\nDEL-BOM-BLR-GOI costs 400 with 2 stops",
        "codeNotes": [
          {
            "line": 1,
            "note": "Each flight: from, to, price."
          },
          {
            "line": 6,
            "note": "Cheaper, but needs two stops."
          }
        ],
        "tryIt": "Add a direct flight [0, 3, 750]. With k = 0 stops, it is now the only allowed route.",
        "check": {
          "question": "Why is plain Dijkstra not enough for \"at most k stops\"?",
          "options": [
            "It is too slow",
            "It finds the cheapest route but ignores how many stops it uses",
            "It cannot handle prices"
          ],
          "answer": 1,
          "why": "Dijkstra minimises cost alone; the cheapest route overall may have too many stops."
        }
      },
      {
        "title": "Bellman-Ford limited to k + 1 rounds",
        "say": [
          "Recall Bellman-Ford from Day 22: relax every edge, round after round. After round r, the costs are correct for routes using at most r flights.",
          "That is exactly the stop limit we need. Run k + 1 rounds (k stops means k + 1 flights) and read cost[dst].",
          "One important detail: in each round, read from the costs of the previous round, and write into a copy. Otherwise one round could chain several flights together and break the limit.",
          "Each round is O(E), so the total is O(k x E). Airports that stay at infinity cannot be reached within the limit, so return -1.",
          "This is the DP idea too: the state is (airport, flights used), and each round builds on the round before."
        ],
        "example": "Spreading news round by round: in each round, only people who already knew at the start of the round can pass it on. After k + 1 rounds, you know who can be reached in k + 1 hops.",
        "code": "def find_cheapest_flight(n, flights, src, dst, k):\n    cost = [float(\"inf\")] * n\n    cost[src] = 0\n    for _ in range(k + 1):\n        new = cost[:]\n        for u, v, price in flights:\n            if cost[u] + price < new[v]:\n                new[v] = cost[u] + price\n        cost = new\n    return cost[dst] if cost[dst] != float(\"inf\") else -1\n\nflights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]]\nprint(find_cheapest_flight(4, flights, 0, 3, 1))\nprint(find_cheapest_flight(4, flights, 0, 3, 2))\nprint(find_cheapest_flight(3, [[0, 1, 100], [1, 2, 200]], 0, 2, 0))",
        "output": "700\n400\n-1",
        "codeNotes": [
          {
            "line": 4,
            "note": "k stops means at most k + 1 flights: one round per flight."
          },
          {
            "line": 5,
            "note": "Write into a copy so one round adds only one flight."
          },
          {
            "line": 7,
            "note": "Read from last round's costs."
          }
        ],
        "tryIt": "Change the code to update cost directly instead of new and run the k = 1 case. It wrongly returns 400.",
        "check": {
          "question": "Why does each round work on a copy of the costs?",
          "options": [
            "To save memory",
            "So a single round cannot chain several flights and exceed the stop limit",
            "To sort the prices"
          ],
          "answer": 1,
          "why": "Reading only last round's costs guarantees each round extends routes by exactly one flight."
        }
      },
      {
        "title": "A heap-based alternative",
        "say": [
          "A second approach adapts Dijkstra: put (cost, airport, stops used) on a heap, always expanding the cheapest state first.",
          "Only expand a state if its stops are within the limit. The first time dst is popped, its cost is the cheapest valid answer.",
          "To avoid endless work, remember the fewest stops with which each airport has been reached; a state that is both more expensive and uses more stops can be skipped.",
          "Which is better? Bellman-Ford is simpler and has a clear O(k x E) bound. The heap version is often faster when k is large and the answer is found early.",
          "Comparing two correct approaches and choosing one with reasons is what senior engineers do every day."
        ],
        "example": "Two travel agents: one checks every route level by level, the other always follows up on the cheapest lead first. Both find the best ticket; they just search in a different order.",
        "code": "import heapq\nfrom collections import defaultdict\n\ndef cheapest_with_heap(n, flights, src, dst, k):\n    graph = defaultdict(list)\n    for u, v, price in flights:\n        graph[u].append((v, price))\n    fewest_stops = {}\n    heap = [(0, src, 0)]\n    while heap:\n        cost, node, flights_used = heapq.heappop(heap)\n        if node == dst:\n            return cost\n        if flights_used > k or fewest_stops.get(node, float(\"inf\")) <= flights_used:\n            continue\n        fewest_stops[node] = flights_used\n        for nb, price in graph[node]:\n            heapq.heappush(heap, (cost + price, nb, flights_used + 1))\n    return -1\n\nflights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]]\nprint([cheapest_with_heap(4, flights, 0, 3, k) for k in [0, 1, 2]])",
        "output": "[-1, 700, 400]",
        "codeNotes": [
          {
            "line": 12,
            "note": "The first time dst comes off the heap, it is the cheapest valid route."
          },
          {
            "line": 14,
            "note": "Too many flights, or already reached more cheaply with fewer stops."
          }
        ],
        "tryIt": "Compare its answers with find_cheapest_flight for k = 0, 1 and 2. They should match.",
        "check": {
          "question": "In the heap version, what does each heap entry hold?",
          "options": [
            "Only the airport",
            "(cost so far, airport, flights used)",
            "The whole route"
          ],
          "answer": 1,
          "why": "The heap orders states by cost, and flights used enforces the stop limit."
        }
      },
      {
        "title": "Auditing the network",
        "say": [
          "Practice 2: audit_flight_graph(flights) returns a summary with the number of routes, the number of different airports, and the cheapest price (or None when there are no flights).",
          "A set collects airports from both ends of every flight, so each is counted once, which is the hashing idea from Week 1.",
          "min(..., default=None) handles the empty network without a special if.",
          "Audits like this are the first thing an operations team looks at: they catch empty data, missing airports, or suspicious prices before any routing runs.",
          "Always handle the empty case. Real data feeds fail, and your code should give a clear answer rather than crash."
        ],
        "example": "An airport manager's morning report: how many flights today, how many destinations, and the lowest fare on the board.",
        "code": "def audit_flight_graph(flights):\n    airports = {a for f in flights for a in f[:2]}\n    cheapest = min((f[2] for f in flights), default=None)\n    return {\"routes\": len(flights), \"airports\": len(airports), \"cheapest\": cheapest}\n\nprint(audit_flight_graph([[0, 1, 100], [1, 2, 80], [0, 2, 150]]))\nprint(audit_flight_graph([]))",
        "output": "{'routes': 3, 'airports': 3, 'cheapest': 80}\n{'routes': 0, 'airports': 0, 'cheapest': None}",
        "codeNotes": [
          {
            "line": 2,
            "note": "Both ends of every flight, each airport counted once."
          },
          {
            "line": 3,
            "note": "default=None handles an empty network."
          }
        ],
        "tryIt": "Add a \"busiest\" key: the airport that appears in the most flights. Hint: use collections.Counter.",
        "check": {
          "question": "Why is a set used to count airports?",
          "options": [
            "Sets are sorted",
            "Each airport appears in many flights but should be counted once",
            "Sets use less memory than numbers"
          ],
          "answer": 1,
          "why": "A set keeps one copy of each airport, however many flights mention it."
        }
      },
      {
        "title": "Putting the engine together",
        "say": [
          "The final engine wraps both functions in a class, adds input validation, and returns the route itself, not just its price.",
          "To return the route, keep the route that produced each cost alongside it. When a flight improves an airport's price, its new route is the route to the departure airport plus this airport. Copying routes per round keeps them within the stop limit.",
          "Validate early: airport numbers must be in range, prices must not be negative, and k must be at least 0. Clear error messages save hours of debugging later.",
          "This is what \"production-ready\" means at small scale: correct algorithm, clear interface, validated inputs, handled edge cases and tests.",
          "Your dsa_toolkit.py now contains every tool from the course, ready to reuse and to show in interviews."
        ],
        "example": "A finished product at a shop counter: not just a working engine inside, but a label, instructions, safety checks and a receipt that shows what you bought.",
        "code": "class FlightRouter:\n    def __init__(self, n, flights):\n        for u, v, price in flights:\n            if not (0 <= u < n and 0 <= v < n) or price < 0:\n                raise ValueError(\"bad flight: \" + str([u, v, price]))\n        self.n, self.flights = n, flights\n\n    def cheapest(self, src, dst, k):\n        cost = [float(\"inf\")] * self.n\n        route = [[] for _ in range(self.n)]\n        cost[src], route[src] = 0, [src]\n        for _ in range(k + 1):\n            new_cost, new_route = cost[:], route[:]\n            for u, v, price in self.flights:\n                if cost[u] + price < new_cost[v]:\n                    new_cost[v], new_route[v] = cost[u] + price, route[u] + [v]\n            cost, route = new_cost, new_route\n        if cost[dst] == float(\"inf\"):\n            return -1, []\n        return cost[dst], route[dst]\n\nrouter = FlightRouter(4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]])\nprint(router.cheapest(0, 3, 1))\nprint(router.cheapest(0, 3, 2))\nprint(router.cheapest(3, 0, 2))",
        "output": "(700, [0, 1, 3])\n(400, [0, 1, 2, 3])\n(-1, [])",
        "codeNotes": [
          {
            "line": 4,
            "note": "Validate every flight before using it."
          },
          {
            "line": 16,
            "note": "The new route: the route to u, then fly to v."
          },
          {
            "line": 19,
            "note": "Unreachable within k stops."
          }
        ],
        "tryIt": "Try FlightRouter(4, [[0, 9, 100]]). It should raise a clear error about the bad flight.",
        "check": {
          "question": "What does \"production-ready\" add beyond a correct algorithm?",
          "options": [
            "More comments only",
            "A clear interface, validated inputs, handled edge cases and tests",
            "Faster hardware"
          ],
          "answer": 1,
          "why": "Correctness is the start; real code also has to be safe to call, clear to use and tested."
        }
      },
      {
        "title": "Looking back, and next steps",
        "say": [
          "You began with Big-O and ended by comparing two graph algorithms and choosing one with reasons. That judgement, not memorised code, is what interviews and real jobs test.",
          "Review plan: redo one practice problem from each week without looking at your old code. Where you get stuck, reread that day's lesson summary.",
          "Keep solving: two or three problems a week keep the patterns fresh. Label each by pattern (two pointers, sliding window, BFS, DP, backtracking) so you notice them faster.",
          "Explain your solutions out loud. Being able to say \"I used a heap because I need the smallest item repeatedly\" is as important as the code.",
          "Finish the capstone project and final assessment to earn your certificate. Congratulations on completing the course!"
        ],
        "example": "Finishing a driving course: you know the rules and have practised every manoeuvre, but confidence comes from driving a little every week.",
        "code": "patterns = {\n    \"fast lookup\": \"dict / set\",\n    \"smallest repeatedly\": \"heap\",\n    \"prefix search\": \"trie\",\n    \"fewest steps\": \"BFS\",\n    \"cheapest route\": \"Dijkstra\",\n    \"dependency order\": \"topological sort\",\n    \"merging groups\": \"union-find\",\n    \"overlapping subproblems\": \"dynamic programming\",\n    \"all arrangements\": \"backtracking\",\n}\nfor need, tool in patterns.items():\n    print(f\"{need:24} -> {tool}\")",
        "output": "fast lookup              -> dict / set\nsmallest repeatedly      -> heap\nprefix search            -> trie\nfewest steps             -> BFS\ncheapest route           -> Dijkstra\ndependency order         -> topological sort\nmerging groups           -> union-find\noverlapping subproblems  -> dynamic programming\nall arrangements         -> backtracking",
        "codeNotes": [
          {
            "line": 1,
            "note": "A cheat sheet from the whole course."
          }
        ],
        "tryIt": "Add three more rows from earlier weeks, for example \"sorted array search\" -> \"binary search\".",
        "check": {
          "question": "What is the most valuable skill this course aimed to build?",
          "options": [
            "Memorising code",
            "Recognising the right pattern and explaining why it fits",
            "Typing fast"
          ],
          "answer": 1,
          "why": "Choosing a structure or algorithm, and explaining the choice, is what interviews and real work reward."
        }
      }
    ],
    "summary": [
      "Cheapest route with at most k stops: Bellman-Ford limited to k + 1 rounds.",
      "Each round reads the previous round's costs and writes a copy.",
      "A heap with (cost, airport, flights used) is an alternative approach.",
      "Audit data first: count routes and airports, handle the empty case.",
      "Production-ready means validation, clear results and tests, not just a correct algorithm."
    ],
    "projectStep": {
      "title": "Final capstone: flight router",
      "steps": [
        "Add find_cheapest_flight and audit_flight_graph to dsa_toolkit.py.",
        "Build the FlightRouter class that returns both the price and the route.",
        "Model 6 real airports with made-up prices and print the cheapest route for k = 0, 1 and 2."
      ]
    }
  }
];
