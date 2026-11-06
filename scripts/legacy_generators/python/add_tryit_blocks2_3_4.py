import sys
import pprint

sys.path.insert(0, 'scripts')

tryit_prompts = {
    # Block 2
    6: [
        "Try modifying the switch statement to add a case for Sunday (day 7) and verify the returned name.",
        "Try removing the break statement from case 2 and observe how execution falls through into case 3.",
        "Try converting the colon-based switch statement to Java 14+ arrow syntax (case 1 -> 'Monday';).",
        "Try using the yield keyword inside a multi-line arrow block to return a computed value from a switch expression.",
        "Try passing an unhandled integer (e.g. 99) to getDayName and verify that the default branch returns 'Unknown'."
    ],
    7: [
        "Try changing the while loop condition from n > 1 to n > 0 and verify if factorial(0) still returns 1.",
        "Try implementing a do-while loop that prompts the user at least once even if the exit condition is initially true.",
        "Try decrementing the loop counter inside a while loop and trace the loop invariant on each iteration.",
        "Try testing the while loop against negative inputs to ensure it terminates without entering an infinite loop.",
        "Try adding a break statement that prematurely exits the while loop when an accumulator exceeds 10,000."
    ],
    8: [
        "Try changing the for loop increment step from i++ to i += 2 to iterate exclusively through even indices.",
        "Try rewriting a standard indexed for-loop into an enhanced for-each loop and observe the absence of index tracking.",
        "Try measuring CPU cache locality differences when traversing a 2D array row-by-row versus column-by-column.",
        "Try using continue inside a for loop to skip odd numbers during an accumulation pass.",
        "Try nesting two for loops to compute the Cartesian product of two integer arrays."
    ],
    9: [
        "Try passing a primitive int to a helper method that reassigns the parameter, and verify the caller's value is unchanged.",
        "Try returning early from a method using an if-guard return statement to eliminate nested else blocks.",
        "Try declaring a method with multiple return parameters using a small container class or array.",
        "Try mutating an array element inside a method and verify that changes are visible to the caller (reference passing).",
        "Try designing a pure method that produces no side effects and always returns the same output for identical inputs."
    ],
    10: [
        "Try calling a recursive method without a base condition and observe the JVM StackOverflowError.",
        "Try computing Fibonacci numbers using recursion and trace each stack frame pushed onto the thread stack.",
        "Try converting a recursive method into an iterative loop using an explicit Java Stack object.",
        "Try memoizing recursive results in an array to reduce exponential O(2^N) time complexity to linear O(N).",
        "Try testing the Milestone 2 Financial Utility Engine with boundary values (0, negative numbers, extreme amounts)."
    ],
    # Block 3
    11: [
        "Try adding a three-argument calculateArea method for trapezoids and test compile-time resolution.",
        "Try calling calculateArea with arguments that require automatic primitive widening (e.g., int promoted to double).",
        "Try declaring two methods with identical parameter types but different return types and observe the compile error.",
        "Try overloading a method with both primitive int and boxed Integer and observe autoboxing precedence.",
        "Try overloading a method with varargs (int... values) and test calling it with 0, 1, and 5 arguments."
    ],
    12: [
        "Try initializing an array with new int[0] and verify that array.length equals 0 without NullPointerException.",
        "Try accessing an array index equal to array.length and observe the ArrayIndexOutOfBoundsException.",
        "Try finding the maximum value in an array containing only negative numbers and ensure correct initialization.",
        "Try cloning an array using array.clone() and verify that mutating the clone does not affect the original.",
        "Try filling an array with a default sentinel value using Arrays.fill(arr, -1)."
    ],
    13: [
        "Try counting both positive and negative numbers in a single for-each traversal pass.",
        "Try accumulating the running product of an array and guard against multiplication by zero.",
        "Try joining array elements with custom delimiters using String.join(\", \", strArray).",
        "Try reversing an array in place using two pointers without allocating a secondary heap buffer.",
        "Try calculating the average of an integer array and ensure casting to double prevents integer truncation."
    ],
    14: [
        "Try computing the anti-diagonal (secondary diagonal) sum of an N x N square matrix.",
        "Try handling ragged (non-rectangular) 2D arrays where each row has a different column length.",
        "Try transposing an M x N matrix into an N x M matrix in memory.",
        "Try summing all border elements of a 2D matrix while skipping the interior cells.",
        "Try flattening a 2D matrix into a single 1D array of size rows * cols."
    ],
    15: [
        "Try executing linear search on an unsorted array and record the worst-case O(N) iteration count.",
        "Try executing binary search on an unsorted array and observe why the sorting invariant is strictly required.",
        "Try using binary search to find the insertion point of a missing element using low pointer position.",
        "Try comparing the execution time of linear search vs binary search on a 100,000-element sorted array.",
        "Try testing the Milestone 3 Binary Search Ledger with target keys at the exact boundaries (index 0 and N-1)."
    ],
    # Block 4
    16: [
        "Try instantiating two BankAccount objects and verify that their instance fields mutate independently on the heap.",
        "Try printing an uninitialized instance field of reference type and verify that the default JVM value is null.",
        "Try setting an object reference variable to null and observe the NullPointerException when dereferencing it.",
        "Try measuring the heap allocation size of an empty class instance versus an instance with 4 primitive long fields.",
        "Try creating an array of BankAccount object references and verify that elements are initialized to null by default."
    ],
    17: [
        "Try invoking one constructor from another constructor using this(params) and verify it must be the very first statement.",
        "Try removing the this.field prefix when the parameter has the same name and observe the shadowing bug.",
        "Try declaring a class with only parameterized constructors and attempt calling new ClassName() without arguments.",
        "Try passing the this reference as an argument to an external logger inside a constructor.",
        "Try making a constructor private to restrict instantiation to static factory methods."
    ],
    18: [
        "Try accessing a private field directly from an external test class and note the compile-time visibility error.",
        "Try adding defensive validation in a setter to reject negative GPA values and throw IllegalArgumentException.",
        "Try returning a defensive copy of a mutable internal array from a getter to preserve encapsulation invariants.",
        "Try marking class fields as final and initializing them strictly through the constructor to achieve true immutability.",
        "Try comparing the security of public mutable fields versus encapsulated private fields in concurrent environments."
    ],
    19: [
        "Try calling a superclass method from a subclass using the super keyword.",
        "Try adding an explicit super(arguments) call in a subclass constructor and verify constructor chaining order.",
        "Try declaring a class with final class Subclass and attempt to extend it to observe the non-subclassable restriction.",
        "Try inheriting protected helper methods across packages and verify visibility rules.",
        "Try demonstrating the Liskov Substitution Principle by substituting a Manager instance into an Employee reference."
    ],
    20: [
        "Try overriding a superclass method without the @Override annotation and note the lack of compile-time signature checks.",
        "Try assigning a subclass object to a superclass reference and observe polymorphic dynamic method dispatch at runtime.",
        "Try invoking a subclass-specific method through a superclass reference and observe the compile-time symbol error.",
        "Try safely downcasting a superclass reference to a subclass type using the instanceof operator and pattern matching.",
        "Try declaring a method as final in the superclass and attempt to override it in the subclass to verify immutability."
    ]
}

# Update block2, block3, block4 files
for b, d_range in [(2, range(6, 11)), (3, range(11, 16)), (4, range(16, 21))]:
    for d in d_range:
        file_path = f'scripts/block{b}_day{d}.py'
        var_name = f'DAY_{d}'
        mod = __import__(f'block{b}_day{d}')
        day_obj = getattr(mod, var_name)
        
        prompts = tryit_prompts[d]
        for p_idx, part in enumerate(day_obj['parts']):
            part['tryIt'] = prompts[p_idx]
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(f"# Day {d}: {day_obj['title']}\n\n")
            f.write(f"{var_name} = " + pprint.pformat(day_obj, width=120, sort_dicts=False) + "\n")
        print(f"Updated {file_path} with tryIt prompts.")

print("\nALL BLOCKS 2, 3, 4 UPDATED WITH INTERACTIVE TRYIT PROMPTS!")
