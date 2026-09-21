/*
 * Problem Summary:
 * Given an array of positive integers `nums` and a positive integer `k`, find the number of ways to select a non-empty
 * contiguous subarray (by removing a prefix and a suffix) such that the product of its elements modulo `k` equals `x`.
 * This count should be determined for each `x` from `0` to `k-1`, and returned as an array `result` of size `k`.
 *
 * Problem Link: https://leetcode.com/problems/find-x-value-of-array-i/
 *
 * Approach Explanation:
 * This problem can be solved using dynamic programming. Since `k` is very small (up to 5), the state space for
 * products modulo `k` is also very small. We iterate through the input array `nums` from left to right,
 * building up counts of subarray products modulo `k`.
 *
 * Let `currentProductCounts[p]` be the number of contiguous subarrays ending at the *previous* index `i-1`
 * whose product modulo `k` is `p`.
 *
 * When we process `nums[i]` (the element at the current index `i`):
 * 1. `nums[i]` itself forms a new single-element subarray. Its product modulo `k` is `nums[i] % k`.
 *    We increment the count for this product in our temporary `nextProductCounts` array and in the final `result` array.
 * 2. All subarrays that ended at `i-1` can be extended by `nums[i]`. If a subarray ending at `i-1` had a product
 *    `p_old` (modulo `k`), then extending it with `nums[i]` will result in a new product `(p_old * (nums[i] % k)) % k`.
 *    For each `p_old` from `0` to `k-1`, we take `currentProductCounts[p_old]` (the number of subarrays with product `p_old`),
 *    calculate their new product modulo `k`, and add `currentProductCounts[p_old]` to the count for this new product
 *    in `nextProductCounts` and `result`.
 *
 * After processing all `p_old` values for the current `i`, `nextProductCounts` will contain the counts of all
 * subarrays ending at index `i` for each product modulo `k`. We then update `currentProductCounts = nextProductCounts`
 * to prepare for the next iteration.
 *
 * The `result` array accumulates counts from all subarrays, regardless of their ending position, thus storing the
 * total number of ways for each `x`.
 *
 * Time Complexity:
 * O(N * k), where N is the length of `nums` and k is the given modulus.
 * The outer loop iterates N times (for each element in `nums`).
 * The inner loop iterates k times (for each possible product modulo k).
 * Inside the inner loop, operations are constant time.
 * Given N <= 10^5 and k <= 5, N*k = 5 * 10^5, which is efficient.
 *
 * Space Complexity:
 * O(k), as we use arrays of size `k` (`result`, `currentProductCounts`, `nextProductCounts`) to store counts.
 * This is constant space with respect to N.
 */
class Solution {
    public int[] findXValueOfArray(int[] nums, int k) {
        // Initialize an array to store the total counts for each remainder x from 0 to k-1.
        // result[x] will store the number of subarrays whose product modulo k is x.
        int[] result = new int[k];

        // currentProductCounts[p] stores the number of contiguous subarrays ending at the
        // *previous* index (i-1) whose product modulo k is p.
        // This array helps in efficiently calculating products for subarrays ending at the current index.
        int[] currentProductCounts = new int[k];

        // Iterate through each number in the input array.
        // `i` represents the current ending index of potential subarrays.
        for (int i = 0; i < nums.length; i++) {
            // Calculate the current number's value modulo k. This is used for multiplications.
            int numModK = nums[i] % k;

            // Create a temporary array to store counts for subarrays ending at the current index `i`.
            // This prevents mixing counts from previous and current iterations during updates.
            // It will become the new `currentProductCounts` for the next iteration.
            int[] nextProductCounts = new int[k];

            // 1. Consider `nums[i]` itself as a single-element subarray.
            // Its product modulo k is `numModK`.
            nextProductCounts[numModK]++; // Increment count for this product ending at `i`.
            result[numModK]++;           // Increment total count for this product.

            // 2. Extend all subarrays that ended at the previous index `i-1` by including `nums[i]`.
            // For each possible product `p_old` (from 0 to k-1) that ended at `i-1`:
            for (int p_old = 0; p_old < k; p_old++) {
                // If there were any subarrays ending at `i-1` with product `p_old` (modulo k):
                if (currentProductCounts[p_old] > 0) {
                    // When these subarrays are extended by `nums[i]`, their new product modulo k
                    // will be `(p_old * numModK) % k`.
                    int newProduct = (p_old * numModK) % k;

                    // Add the count of these `currentProductCounts[p_old]` subarrays to the
                    // `nextProductCounts` for the `newProduct`. These are new subarrays ending at `i`.
                    nextProductCounts[newProduct] += currentProductCounts[p_old];

                    // Also, add these counts to the final `result` array, as they represent valid operations.
                    result[newProduct] += currentProductCounts[p_old];
                }
            }

            // Update `currentProductCounts` to `nextProductCounts` for the next iteration.
            // Now, `currentProductCounts` holds the counts of subarrays ending at `i`.
            currentProductCounts = nextProductCounts;
        }

        // Return the final result array containing x-values for each remainder.
        return result;
    }
}