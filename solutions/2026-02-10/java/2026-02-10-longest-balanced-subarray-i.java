```java
// /**
//  * Problem: Longest Balanced Subarray I
//  * Link: https://leetcode.com/problems/longest-balanced-subarray-i/
//  *
//  * Problem Summary:
//  * Find the longest subarray where the count of distinct even numbers equals the count of distinct odd numbers.
//  *
//  * Approach:
//  * We can iterate through all possible subarrays and for each subarray, count the distinct even and odd numbers.
//  * This brute-force approach has a time complexity of O(n^3) which might be too slow given the constraints.
//  *
//  * A more optimized approach uses the concept of prefix sums and a hash map.
//  * We can transform the problem into finding a subarray where the difference between the count of distinct even numbers
//  * and the count of distinct odd numbers is zero.
//  *
//  * Let's define a "balance" value. For each number, if it's even, we can consider it as +1 and if it's odd, as -1.
//  * However, this doesn't account for *distinct* numbers.
//  *
//  * A better approach is to iterate through all possible start and end points of a subarray.
//  * For each subarray `nums[i...j]`, we use sets to store distinct even and odd numbers.
//  * If `evenSet.size() == oddSet.size()`, we update the maximum length.
//  *
//  * Time Complexity: O(n^2), where n is the length of nums. This is because we have nested loops to iterate through all subarrays,
//  * and inside the inner loop, we iterate through the subarray to populate sets, which takes O(k) for a subarray of length k.
//  * In the worst case, k can be n, leading to O(n^3) if not careful. However, by iterating from `i` to `j` and updating sets incrementally,
//  * the inner loop's set operations are amortized. The dominant factor is the two nested loops over `i` and `j`.
//  *
//  * Space Complexity: O(n) in the worst case, as the sets can store up to n distinct numbers (either even or odd).
//  *
//  */
import java.util.HashSet;
import java.util.Set;

class Solution {
    /**
     * Finds the length of the longest balanced subarray.
     * A subarray is balanced if the number of distinct even numbers equals the number of distinct odd numbers.
     *
     * @param nums The input array of integers.
     * @return The length of the longest balanced subarray.
     */
    public int longestBalancedSubarray(int[] nums) {
        int n = nums.length; // Get the length of the input array
        int maxLength = 0; // Initialize the maximum length of a balanced subarray found so far

        // Iterate through all possible starting points of a subarray
        for (int i = 0; i < n; i++) {
            Set<Integer> distinctEven = new HashSet<>(); // Set to store distinct even numbers in the current subarray
            Set<Integer> distinctOdd = new HashSet<>();  // Set to store distinct odd numbers in the current subarray

            // Iterate through all possible ending points of a subarray, starting from the current start point 'i'
            for (int j = i; j < n; j++) {
                // Check if the current number is even or odd
                if (nums[j] % 2 == 0) {
                    distinctEven.add(nums[j]); // Add the even number to the distinctEven set
                } else {
                    distinctOdd.add(nums[j]);  // Add the odd number to the distinctOdd set
                }

                // Check if the current subarray (from index i to j) is balanced
                // A subarray is balanced if the count of distinct even numbers equals the count of distinct odd numbers
                if (distinctEven.size() == distinctOdd.size()) {
                    // If balanced, calculate the length of the current subarray and update maxLength if it's greater
                    maxLength = Math.max(maxLength, j - i + 1);
                }
            }
        }

        // Return the maximum length of a balanced subarray found
        return maxLength;
    }
}
```