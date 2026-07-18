```java
// Problem Summary: Find the GCD of the smallest and largest numbers in an array.
// Link: https://leetcode.com/problems/find-greatest-common-divisor-of-array/
// Approach:
// 1. Find the minimum and maximum elements in the input array `nums`.
// 2. Implement a helper function `gcd` to calculate the greatest common divisor of two numbers using the Euclidean algorithm.
// 3. Return the GCD of the minimum and maximum elements found.
// Time Complexity: O(N + log(min(a, b))), where N is the length of the array.
//   - O(N) to find the minimum and maximum elements.
//   - O(log(min(a, b))) for the Euclidean algorithm to find GCD, where 'a' and 'b' are the min and max numbers.
// Space Complexity: O(1) as we only use a few variables to store min, max, and temporary values during GCD calculation.

class Solution {
    /**
     * Finds the greatest common divisor of the smallest and largest numbers in an array.
     * @param nums The input integer array.
     * @return The greatest common divisor of the smallest and largest numbers.
     */
    public int findGCD(int[] nums) {
        // Initialize min and max with the first element of the array.
        int minVal = nums[0];
        int maxVal = nums[0];

        // Iterate through the array to find the minimum and maximum values.
        for (int num : nums) {
            if (num < minVal) {
                minVal = num; // Update minimum value
            }
            if (num > maxVal) {
                maxVal = num; // Update maximum value
            }
        }

        // Calculate and return the GCD of the minimum and maximum values.
        return gcd(minVal, maxVal);
    }

    /**
     * Calculates the greatest common divisor (GCD) of two non-negative integers using the Euclidean algorithm.
     * The Euclidean algorithm is based on the principle that the greatest common divisor of two numbers
     * does not change if the larger number is replaced by its difference with the smaller number.
     * This process is repeated until one of the numbers becomes zero, at which point the other number is the GCD.
     *
     * @param a The first non-negative integer.
     * @param b The second non-negative integer.
     * @return The greatest common divisor of 'a' and 'b'.
     */
    private int gcd(int a, int b) {
        // Base case: if b is 0, then a is the GCD.
        if (b == 0) {
            return a;
        }
        // Recursive step: call gcd with b and the remainder of a divided by b.
        // This is equivalent to gcd(a, b) = gcd(b, a % b).
        return gcd(b, a % b);
    }
}
```