// Problem: Maximum Product of Three Numbers
// Link: https://leetcode.com/problems/maximum-product-of-three-numbers/
// Approach:
// The maximum product of three numbers can come from two scenarios:
// 1. The product of the three largest numbers in the array. This is the case when all numbers are positive or when the two smallest numbers are positive and very small.
// 2. The product of the two smallest (most negative) numbers and the largest number in the array. This is relevant when there are negative numbers, as the product of two negatives is positive.
// To find these numbers efficiently, we can sort the array. After sorting:
// - The three largest numbers will be at the end of the array (nums[n-1], nums[n-2], nums[n-3]).
// - The two smallest numbers will be at the beginning of the array (nums[0], nums[1]).
// We then compare the product of the three largest numbers with the product of the two smallest and the largest number, and return the maximum of the two.
// Time Complexity: O(n log n) due to sorting the array.
// Space Complexity: O(log n) or O(n) depending on the sorting algorithm used by JavaScript's `sort` method. In practice, it's often O(log n) for typical implementations.
const maximumProduct = (nums) => {
    // Sort the array in ascending order.
    // This allows us to easily identify the smallest and largest numbers.
    nums.sort((a, b) => a - b);

    // Get the length of the sorted array.
    const n = nums.length;

    // Scenario 1: Product of the three largest numbers.
    // These are the last three elements after sorting.
    const product1 = nums[n - 1] * nums[n - 2] * nums[n - 3];

    // Scenario 2: Product of the two smallest numbers and the largest number.
    // The two smallest numbers are the first two elements (which could be negative).
    // The largest number is the last element.
    const product2 = nums[0] * nums[1] * nums[n - 1];

    // Return the maximum of the two possible products.
    return Math.max(product1, product2);
};
