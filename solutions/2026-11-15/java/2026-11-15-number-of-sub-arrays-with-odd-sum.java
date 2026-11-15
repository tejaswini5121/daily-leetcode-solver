```java
// LeetCode Problem: Number of Sub-arrays With Odd Sum
// Link: https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/
// Approach: This problem can be solved efficiently using the concept of prefix sums and parity.
// We can iterate through the array and maintain the count of prefix sums that are even and odd.
// Let `prefixSum` be the sum of elements from the beginning of the array up to the current index.
// We are interested in the parity of the subarray sum. A subarray sum from index `i` to `j`
// is `prefixSum[j] - prefixSum[i-1]`.
// For the subarray sum to be odd, we need one of the following:
// 1. `prefixSum[j]` is odd and `prefixSum[i-1]` is even.
// 2. `prefixSum[j]` is even and `prefixSum[i-1]` is odd.
//
// We can maintain two counters: `oddCount` for the number of prefix sums encountered so far that are odd,
// and `evenCount` for the number of prefix sums encountered so far that are even.
//
// When we are at index `i` and calculate the current `prefixSum`:
// - If `prefixSum` is odd:
//   - Any previous even prefix sum `prefixSum[k]` (where `k < i`) will result in an odd subarray sum `prefixSum - prefixSum[k]`.
//   - So, we add `evenCount` to our total result.
//   - We also increment `oddCount` because the current `prefixSum` is odd.
// - If `prefixSum` is even:
//   - Any previous odd prefix sum `prefixSum[k]` (where `k < i`) will result in an odd subarray sum `prefixSum - prefixSum[k]`.
//   - So, we add `oddCount` to our total result.
//   - We also increment `evenCount` because the current `prefixSum` is even.
//
// We initialize `evenCount` to 1 because an empty prefix (before the first element) has a sum of 0, which is even.
// The modulo operation `10^9 + 7` should be applied at each addition to prevent overflow.
//
// Time Complexity: O(n), where n is the length of the array. We iterate through the array once.
// Space Complexity: O(1). We only use a few constant-space variables to store counts.

class Solution {
    public int numOfSubarrays(int[] arr) {
        // Modulo constant
        int MOD = 1_000_000_007;

        // Initialize counts of even and odd prefix sums encountered so far.
        // evenCount starts at 1 to account for the initial prefix sum of 0 (before any elements).
        int oddCount = 0;
        int evenCount = 1;

        // Variable to store the running prefix sum.
        int currentPrefixSum = 0;

        // Variable to store the total count of subarrays with odd sums.
        int totalOddSumSubarrays = 0;

        // Iterate through each element in the array.
        for (int num : arr) {
            // Update the current prefix sum.
            currentPrefixSum += num;

            // Check the parity of the current prefix sum.
            if (currentPrefixSum % 2 == 1) {
                // If the current prefix sum is odd:
                // A subarray ending at the current position will have an odd sum
                // if its preceding prefix sum was even.
                // For example, if currentPrefixSum = 5 (odd) and previousPrefixSum = 2 (even),
                // the subarray sum is 5 - 2 = 3 (odd).
                // So, we add the number of even prefix sums encountered so far to our total.
                totalOddSumSubarrays = (totalOddSumSubarrays + evenCount) % MOD;

                // Increment the count of odd prefix sums as the current prefix sum is odd.
                oddCount++;
            } else {
                // If the current prefix sum is even:
                // A subarray ending at the current position will have an odd sum
                // if its preceding prefix sum was odd.
                // For example, if currentPrefixSum = 6 (even) and previousPrefixSum = 1 (odd),
                // the subarray sum is 6 - 1 = 5 (odd).
                // So, we add the number of odd prefix sums encountered so far to our total.
                totalOddSumSubarrays = (totalOddSumSubarrays + oddCount) % MOD;

                // Increment the count of even prefix sums as the current prefix sum is even.
                evenCount++;
            }
        }

        // Return the total count of subarrays with odd sums, modulo 10^9 + 7.
        return totalOddSumSubarrays;
    }
}
```