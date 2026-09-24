```java
/**
 * Problem: Smallest Index With Digit Sum Equal to Index
 * Link: https://leetcode.com/problems/smallest-index-with-digit-sum-equal-to-index/
 *
 * Approach:
 * Iterate through the input array `nums` from index 0 to nums.length - 1.
 * For each index `i`, calculate the sum of the digits of `nums[i]`.
 * If the calculated digit sum is equal to the current index `i`, then we have found the smallest such index, so return `i`.
 * If the loop completes without finding such an index, return -1.
 *
 * To calculate the sum of digits of a number:
 * Initialize a sum variable to 0.
 * While the number is greater than 0, extract the last digit using the modulo operator (%), add it to the sum, and then remove the last digit by integer division (/).
 *
 * Time Complexity: O(N * log(max_val)), where N is the length of nums and max_val is the maximum value in nums.
 * The outer loop runs N times. The inner loop (digit sum calculation) runs at most log10(max_val) times for each number.
 *
 * Space Complexity: O(1), as we only use a few extra variables for calculations.
 */
class Solution {
    /**
     * Finds the smallest index `i` such that the sum of the digits of `nums[i]` equals `i`.
     *
     * @param nums The input integer array.
     * @return The smallest index `i` satisfying the condition, or -1 if no such index exists.
     */
    public int smallestEqual(int[] nums) {
        // Iterate through each index of the array
        for (int i = 0; i < nums.length; i++) {
            // Calculate the sum of digits for the element at the current index
            int digitSum = calculateDigitSum(nums[i]);

            // Check if the digit sum is equal to the current index
            if (digitSum == i) {
                // If it is, we've found the smallest such index, so return it
                return i;
            }
        }

        // If no such index was found after checking all elements, return -1
        return -1;
    }

    /**
     * Calculates the sum of the digits of a given non-negative integer.
     *
     * @param num The integer for which to calculate the digit sum.
     * @return The sum of the digits of `num`.
     */
    private int calculateDigitSum(int num) {
        int sum = 0;
        // Handle the case where the number is 0 separately
        if (num == 0) {
            return 0;
        }
        // Iterate while the number is positive
        while (num > 0) {
            // Get the last digit using the modulo operator
            sum += num % 10;
            // Remove the last digit by integer division
            num /= 10;
        }
        // Return the calculated sum of digits
        return sum;
    }
}
```