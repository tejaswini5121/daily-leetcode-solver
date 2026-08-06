```java
// Problem: Smallest Divisible Digit Product I
// Link: https://leetcode.com/problems/smallest-divisible-digit-product-i/
// Problem Summary: Find the smallest number >= n whose digit product is divisible by t.

// Approach:
// We need to find the smallest number starting from 'n' that satisfies the condition.
// The most straightforward approach is to iterate through numbers starting from 'n'
// and for each number, calculate the product of its digits. If this product is
// divisible by 't', we return that number.

// The digit product calculation involves extracting each digit of the number
// and multiplying them. If any digit is 0, the product will be 0.
// A product of 0 is divisible by any non-zero 't'.

// Time Complexity: O(X * log10(X)) where X is the smallest number >= n that satisfies the condition.
// In the worst case, n is small (e.g., 1) and t is large, we might have to iterate many numbers.
// However, since n is up to 100 and t is up to 10, the search space for X is relatively small.
// The log10(X) factor comes from calculating the digit product of each number.
// For n <= 100 and t <= 10, X won't be excessively large. The maximum value of X will be
// bounded because we are guaranteed to find a solution (e.g., a number with a digit 0
// will have a product of 0, which is divisible by any t). The problem statement implies
// that a solution always exists within reasonable bounds for these constraints.

// Space Complexity: O(1)
// We are only using a few variables to store the current number, digit product, and digits.
// The space used does not grow with the input size.

class Solution {
    /**
     * Calculates the product of the digits of a given number.
     *
     * @param num The number to calculate the digit product for.
     * @return The product of the digits of the number. Returns 0 if any digit is 0.
     */
    private int calculateDigitProduct(int num) {
        // If the number is 0, its digit product is 0.
        if (num == 0) {
            return 0;
        }

        int product = 1;
        int temp = num; // Use a temporary variable to avoid modifying the original number

        // Iterate through each digit of the number
        while (temp > 0) {
            int digit = temp % 10; // Get the last digit

            // If any digit is 0, the product will be 0, which is divisible by any t.
            // We can return 0 immediately.
            if (digit == 0) {
                return 0;
            }

            product *= digit; // Multiply the digit into the product
            temp /= 10;       // Remove the last digit
        }
        return product;
    }

    /**
     * Finds the smallest number greater than or equal to n such that the product of its digits is divisible by t.
     *
     * @param n The starting number.
     * @param t The divisor.
     * @return The smallest number satisfying the condition.
     */
    public int smallestDivisibleDigitProduct(int n, int t) {
        // Start checking from 'n' itself.
        int currentNumber = n;

        // Loop indefinitely until a number satisfying the condition is found.
        // Since n >= 1 and t >= 1, and a 0 digit will always make the product 0
        // (which is divisible by any t), a solution is guaranteed to be found.
        while (true) {
            // Calculate the product of digits for the current number.
            int digitProduct = calculateDigitProduct(currentNumber);

            // Check if the digit product is divisible by 't'.
            // Note: If digitProduct is 0, and t is non-zero, 0 % t is 0, so it's divisible.
            if (digitProduct % t == 0) {
                // If divisible, we've found the smallest such number.
                return currentNumber;
            }

            // If not divisible, increment the number and try again.
            currentNumber++;
        }
    }

    // Main method for testing purposes (optional, but good for local execution)
    public static void main(String[] args) {
        Solution sol = new Solution();

        // Example 1:
        int n1 = 10, t1 = 2;
        System.out.println("Input: n = " + n1 + ", t = " + t1);
        System.out.println("Output: " + sol.smallestDivisibleDigitProduct(n1, t1)); // Expected: 10

        // Example 2:
        int n2 = 15, t2 = 3;
        System.out.println("Input: n = " + n2 + ", t = " + t2);
        System.out.println("Output: " + sol.smallestDivisibleDigitProduct(n2, t2)); // Expected: 16

        // Additional test case
        int n3 = 1, t3 = 5;
        System.out.println("Input: n = " + n3 + ", t = " + t3);
        System.out.println("Output: " + sol.smallestDivisibleDigitProduct(n3, t3)); // Expected: 5 (digit product 5)

        // Additional test case with 0
        int n4 = 9, t4 = 10;
        System.out.println("Input: n = " + n4 + ", t = " + t4);
        System.out.println("Output: " + sol.smallestDivisibleDigitProduct(n4, t4)); // Expected: 10 (digit product 0)

        // Additional test case with higher n and t
        int n5 = 50, t5 = 7;
        System.out.println("Input: n = " + n5 + ", t = " + t5);
        System.out.println("Output: " + sol.smallestDivisibleDigitProduct(n5, t5)); // Expected: 56 (5*6=30, not divisible. 57 -> 35, divisible)
    }
}
```