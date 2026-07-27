// Problem: Maximum Product of Two Elements in an Array
// LeetCode Link: https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/
//
// Problem Summary: Find the maximum product of two distinct elements in an array after subtracting 1 from each.
//
// Approach:
// To maximize the product (nums[i]-1)*(nums[j]-1), we need to find the two largest numbers in the array.
// This is because subtracting 1 from larger numbers will still result in larger values,
// thus maximizing their product.
//
// We can achieve this by either:
// 1. Sorting the array: After sorting, the two largest numbers will be at the end of the array.
// 2. Iterating and keeping track of the two largest numbers: This avoids the overhead of a full sort
//    if the array is very large, but for the given constraints, sorting is also efficient.
//
// This solution uses sorting. We sort the array in ascending order.
// The two largest numbers will then be nums[n-1] and nums[n-2], where n is the length of the array.
// We then calculate (nums[n-1]-1) * (nums[n-2]-1).
//
// Time Complexity:
// O(N log N) due to sorting the array, where N is the number of elements in nums.
//
// Space Complexity:
// O(log N) or O(N) depending on the sorting algorithm implementation (e.g., in-place quicksort vs. merge sort).
// If we consider the space used by the sorting algorithm, it can vary. However, if we consider
// only the auxiliary space used beyond the input array, it might be O(1) for some in-place sorts.
// In JavaScript's `sort` method, the space complexity can be O(log N) on average due to recursion stack.

/**
 * @param {number[]} nums
 * @return {number}
 */
const maxProduct = function(nums) {
    // Sort the array in ascending order.
    // The sort function needs a comparator for numbers.
    nums.sort((a, b) => a - b);

    // The array length.
    const n = nums.length;

    // The two largest numbers will be at the end of the sorted array.
    // nums[n-1] is the largest, and nums[n-2] is the second largest.
    // Calculate the product (nums[i]-1)*(nums[j]-1) for these two largest elements.
    const largest = nums[n - 1];
    const secondLargest = nums[n - 2];

    return (largest - 1) * (secondLargest - 1);
};
