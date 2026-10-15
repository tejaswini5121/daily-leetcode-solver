```java
// Problem: Subarrays Distinct Element Sum of Squares I
// Link: https://leetcode.com/problems/subarrays-distinct-element-sum-of-squares-i/
//
// Approach:
// The problem asks us to calculate the sum of squares of the distinct element counts for all possible subarrays of a given array.
// A straightforward approach is to iterate through all possible subarrays, calculate the distinct element count for each subarray, square it, and add it to a running total.
//
// To iterate through all subarrays, we can use two nested loops. The outer loop `i` will represent the starting index of the subarray, and the inner loop `j` will represent the ending index.
// For each subarray `nums[i..j]`, we need to find the number of distinct elements. A `HashSet` is an efficient data structure for this purpose. We can iterate from `i` to `j`, adding each element to the `HashSet`. The size of the `HashSet` at the end will give us the distinct count.
//
// Once we have the distinct count for a subarray, we square it and add it to our `totalSum`.
//
// Time Complexity:
// The number of subarrays in an array of length `n` is O(n^2).
// For each subarray of length `k`, calculating the distinct count using a HashSet takes O(k) time.
// In the worst case, `k` can be up to `n`.
// So, the overall time complexity is O(n^3) because for each of the O(n^2) subarrays, we iterate up to `n` elements to count distinct elements.
// Given the constraint `nums.length <= 100`, an O(n^3) solution is acceptable.
//
// Space Complexity:
// For each subarray, we use a `HashSet` to store distinct elements. In the worst case, a subarray can contain up to `n` distinct elements.
// Therefore, the space complexity for the `HashSet` is O(n).
// Since we create a new `HashSet` for each subarray iteration, but it's reused, the auxiliary space complexity is O(n).
//
class Solution {
    public int sumOfSquares(int[] nums) {
        int n = nums.length;
        int totalSum = 0; // Initialize the total sum of squares

        // Iterate through all possible start indices of a subarray
        for (int i = 0; i < n; i++) {
            // For each start index, iterate through all possible end indices
            for (int j = i; j < n; j++) {
                // `i` is the start index, `j` is the end index of the current subarray
                // The subarray is nums[i..j]

                // Use a HashSet to count distinct elements in the current subarray
                java.util.Set<Integer> distinctElements = new java.util.HashSet<>();

                // Iterate through the elements of the current subarray nums[i..j]
                for (int k = i; k <= j; k++) {
                    distinctElements.add(nums[k]); // Add element to the set; duplicates are ignored
                }

                // Get the count of distinct elements
                int distinctCount = distinctElements.size();

                // Square the distinct count and add it to the total sum
                totalSum += distinctCount * distinctCount;
            }
        }

        // Return the final sum of squares of distinct counts
        return totalSum;
    }
}
```