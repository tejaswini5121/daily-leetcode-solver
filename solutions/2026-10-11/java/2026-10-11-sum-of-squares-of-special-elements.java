```java
class Solution {
    /**
     * Calculates the sum of squares of special elements in a 1-indexed array.
     * A special element nums[i] is defined as an element where its index i divides the length of the array n.
     * Problem: https://leetcode.com/problems/sum-of-squares-of-special-elements/
     *
     * Approach:
     * Iterate through the array using a 1-based index. For each index `i`, check if `n % i == 0`.
     * If it is, then `nums[i-1]` (due to 0-based indexing in Java arrays) is a special element.
     * Square this special element and add it to a running sum.
     *
     * Time Complexity: O(n), where n is the length of the array. We iterate through the array once.
     * Space Complexity: O(1), as we only use a constant amount of extra space for the sum variable.
     */
    public int sumOfSquares(int[] nums) {
        int n = nums.length; // Get the length of the array
        int sumOfSquares = 0; // Initialize the sum of squares to 0

        // Iterate through the array using 1-based indexing.
        // The loop goes from i = 1 to n (inclusive).
        for (int i = 1; i <= n; i++) {
            // Check if the current index 'i' divides the length of the array 'n' evenly.
            if (n % i == 0) {
                // If 'i' divides 'n', then nums[i-1] is a special element (using 0-based indexing for Java arrays).
                // Square the special element and add it to the total sum.
                sumOfSquares += nums[i - 1] * nums[i - 1];
            }
        }

        return sumOfSquares; // Return the calculated sum of squares of special elements
    }
}
```