// Summary: Count the number of subarrays in a given array whose sum is odd.
// Link: https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/
// Approach:
// We can use the concept of prefix sums and parity to efficiently count subarrays with odd sums.
// Let `prefixSum[i]` be the sum of elements from `arr[0]` to `arr[i-1]`.
// A subarray sum from `arr[j]` to `arr[i-1]` is `prefixSum[i] - prefixSum[j]`.
// For this subarray sum to be odd, one of `prefixSum[i]` or `prefixSum[j]` must be odd, and the other must be even.
// We can maintain two counters: `oddCount` for the number of prefix sums encountered so far that are odd, and `evenCount` for those that are even.
// When we iterate through the array and calculate the current prefix sum `currentSum`:
// 1. If `currentSum` is odd:
//    - Any previous prefix sum that was even will result in an odd subarray sum when subtracted from `currentSum`. So, we add `evenCount` to our total.
//    - We then increment `oddCount` because the `currentSum` itself is odd.
// 2. If `currentSum` is even:
//    - Any previous prefix sum that was odd will result in an odd subarray sum when subtracted from `currentSum`. So, we add `oddCount` to our total.
//    - We then increment `evenCount` because the `currentSum` itself is even.
// We initialize `evenCount` to 1 to account for the empty prefix sum (sum 0, which is even) before the first element. This allows us to correctly count subarrays starting from index 0.
// The result should be taken modulo 10^9 + 7.
//
// Time Complexity: O(n), where n is the length of the array. We iterate through the array once.
// Space Complexity: O(1), as we only use a few constant-space variables to store counts.
const arr = [1, 3, 5];
const MOD = 10**9 + 7;

/**
 * @param {number[]} arr
 * @return {number}
 */
var numOfSubarrays = function(arr) {
    // Initialize count for subarrays with odd sum
    let oddSumCount = 0;
    // Initialize count for prefix sums that are odd
    let oddPrefixSums = 0;
    // Initialize count for prefix sums that are even.
    // Start with 1 to account for the initial prefix sum of 0 (before any elements), which is even.
    let evenPrefixSums = 1;
    // Initialize the current prefix sum
    let currentSum = 0;

    // Iterate through each element in the array
    for (const num of arr) {
        // Update the current prefix sum
        currentSum += num;

        // Check the parity of the current prefix sum
        if (currentSum % 2 === 1) { // Current prefix sum is odd
            // If current prefix sum is odd, then any previous even prefix sum
            // will result in an odd subarray sum when subtracted from the current sum.
            // (odd - even = odd)
            oddSumCount = (oddSumCount + evenPrefixSums) % MOD;
            // Increment the count of odd prefix sums encountered so far
            oddPrefixSums++;
        } else { // Current prefix sum is even
            // If current prefix sum is even, then any previous odd prefix sum
            // will result in an odd subarray sum when subtracted from the current sum.
            // (even - odd = odd)
            oddSumCount = (oddSumCount + oddPrefixSums) % MOD;
            // Increment the count of even prefix sums encountered so far
            evenPrefixSums++;
        }
    }

    // Return the total count of subarrays with odd sums, modulo 10^9 + 7
    return oddSumCount;
};

// console.log(numOfSubarrays([1, 3, 5])); // Output: 4
// console.log(numOfSubarrays([2, 4, 6])); // Output: 0
// console.log(numOfSubarrays([1, 2, 3, 4, 5, 6, 7])); // Output: 16
```