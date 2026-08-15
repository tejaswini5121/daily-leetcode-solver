// Problem: Longest Subsequence With Non-Zero Bitwise XOR
// Link: https://leetcode.com/problems/longest-subsequence-with-non-zero-bitwise-xor/
//
// Approach:
// The problem asks for the longest subsequence whose bitwise XOR sum is non-zero.
// A subsequence can be formed by picking any number of elements from the original array,
// maintaining their relative order.
//
// Consider the properties of XOR:
// 1. x XOR x = 0
// 2. x XOR 0 = x
// 3. XOR is associative and commutative.
//
// If all elements in the array are 0, then any subsequence will also have an XOR sum of 0.
// In this case, the answer is 0.
//
// If there is at least one non-zero element in the array, we can always form a
// subsequence with a non-zero XOR sum.
// The longest possible subsequence is the entire array itself.
// We need to check if the XOR sum of the entire array is non-zero.
//
// If the XOR sum of the entire array is non-zero, then the longest subsequence
// with a non-zero XOR sum is the entire array itself. Its length is `nums.length`.
//
// If the XOR sum of the entire array is zero, it implies that the set of non-zero
// elements in the array can be partitioned into pairs whose XOR is zero, or there
// are an even number of each unique non-zero bit pattern that can cancel each other out.
// In such a scenario, we can always remove one element from the array to ensure
// the remaining subsequence has a non-zero XOR sum. Why?
// Let the XOR sum of the entire array be `S`. If `S = 0`.
// If we remove any element `nums[i]`, the new XOR sum will be `S XOR nums[i]`.
// Since `S = 0`, `S XOR nums[i] = 0 XOR nums[i] = nums[i]`.
// If `nums[i]` is non-zero, then the new XOR sum is non-zero.
// Since we are guaranteed to have at least one non-zero element (otherwise we would have
// returned 0 at the beginning), we can always find a non-zero `nums[i]` to remove,
// and the remaining subsequence of length `nums.length - 1` will have a non-zero XOR sum.
//
// So, the strategy is:
// 1. Check if all elements are 0. If so, return 0.
// 2. Calculate the XOR sum of all elements in `nums`.
// 3. If the XOR sum is non-zero, return `nums.length`.
// 4. If the XOR sum is zero, return `nums.length - 1`.
//
// Time Complexity: O(N), where N is the length of the `nums` array.
// We iterate through the array once to calculate the XOR sum.
//
// Space Complexity: O(1), as we only use a single variable to store the XOR sum.
//
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestSubsequence = function(nums) {
    // Handle the edge case where all numbers are 0.
    // If all numbers are 0, any subsequence will have an XOR sum of 0.
    // In this case, no subsequence with a non-zero XOR exists, so return 0.
    let allZeros = true;
    for (const num of nums) {
        if (num !== 0) {
            allZeros = false;
            break;
        }
    }
    if (allZeros) {
        return 0;
    }

    // Calculate the bitwise XOR sum of all elements in the array.
    let xorSum = 0;
    for (const num of nums) {
        xorSum ^= num;
    }

    // If the XOR sum of the entire array is non-zero,
    // then the longest subsequence with a non-zero XOR sum is the entire array itself.
    if (xorSum !== 0) {
        return nums.length;
    } else {
        // If the XOR sum of the entire array is zero, it means we can form a non-zero
        // XOR sum subsequence by removing just one element.
        // Since we've already handled the all-zeros case, we know there's at least one
        // non-zero element. Removing any element `x` from a subsequence with XOR sum 0
        // will result in a new XOR sum of `0 XOR x = x`.
        // Thus, a subsequence of length `nums.length - 1` will have a non-zero XOR sum.
        return nums.length - 1;
    }
};
```