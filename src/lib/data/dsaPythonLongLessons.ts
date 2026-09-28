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
  }
];
