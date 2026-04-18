```java
/**
 * Problem Summary: Calculate the absolute difference between an integer and its reversed version.
 * Link: https://leetcode.com/problems/mirror-distance-of-an-integer/
 *
 * Approach:
 * 1. Create a helper function to reverse an integer. This can be done by repeatedly taking the last digit
 *    using the modulo operator (%), multiplying the reversed number by 10, and adding the last digit.
 *    Then, divide the original number by 10 to remove the last digit.
 * 2. In the main function, call the helper function to get the reversed version of the input integer 'n'.
 * 3. Calculate the absolute difference between 'n' and its reversed version using Math.abs().
 *
 * Time Complexity: O(log10(n))
 * The time complexity is dominated by the reversal of the integer. The number of digits in an integer 'n' is
 * approximately log10(n). The reversal process iterates through each digit once.
 *
 * Space Complexity: O(1)
 * The space complexity is constant as we are only using a few variables to store intermediate results
 * during the reversal and calculation.
 */
class Solution {
    /**
     * Calculates the mirror distance of an integer.
     *
     * @param n The input integer.
     * @return The mirror distance of n.
     */
    public int mirrorDistance(int n) {
        // Call the helper function to get the reversed integer
        int reversedN = reverseInteger(n);
        // Calculate and return the absolute difference
        return Math.abs(n - reversedN);
    }

    /**
     * Helper function to reverse the digits of an integer.
     *
     * @param num The integer to reverse.
     * @return The integer with reversed digits.
     */
    private int reverseInteger(int num) {
        int reversedNum = 0;
        // Loop while the number is greater than 0
        while (num > 0) {
            // Get the last digit of the number
            int digit = num % 10;
            // Append the digit to the reversed number by multiplying by 10 and adding the digit
            reversedNum = reversedNum * 10 + digit;
            // Remove the last digit from the original number
            num /= 10;
        }
        // Return the fully reversed number
        return reversedNum;
    }
}
```