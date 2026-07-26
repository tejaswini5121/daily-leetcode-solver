```java
// Problem: Maximum Product of Three Numbers
// Link: https://leetcode.com/problems/maximum-product-of-three-numbers/
//
// Approach:
// The maximum product of three numbers can be achieved in two possible scenarios:
// 1. The product of the three largest numbers in the array. This is straightforward if all numbers are positive or if the largest numbers are positive.
// 2. The product of the two smallest (most negative) numbers and the largest number. This handles cases where there are negative numbers, as the product of two negative numbers is positive.
//
// To efficiently find these numbers, we can sort the array.
// After sorting, the three largest numbers will be at the end of the array (nums[n-1], nums[n-2], nums[n-3]).
// The two smallest numbers will be at the beginning of the array (nums[0], nums[1]).
// We then compare the product of the three largest numbers with the product of the two smallest and the largest number, and return the maximum of these two.
//
// Time Complexity: O(N log N) due to the sorting step, where N is the length of the input array.
// Space Complexity: O(1) if the sorting algorithm used is in-place (like Arrays.sort in Java for primitives). If a non-in-place sort is used, it could be O(log N) or O(N) depending on the implementation. For Java's `Arrays.sort` on primitive arrays, it's typically O(log N) for space complexity due to recursion stack or O(1) for heap sort.

import java.util.Arrays;

class Solution {
    /**
     * Finds the maximum product of three numbers in an integer array.
     *
     * @param nums The input integer array.
     * @return The maximum product of three numbers.
     */
    public int maximumProduct(int[] nums) {
        // Sort the array in ascending order.
        Arrays.sort(nums);

        // Get the length of the array.
        int n = nums.length;

        // Calculate the product of the three largest numbers.
        // These are the last three elements after sorting.
        int productOfThreeLargest = nums[n - 1] * nums[n - 2] * nums[n - 3];

        // Calculate the product of the two smallest (most negative) numbers and the largest number.
        // The two smallest are the first two elements, and the largest is the last element.
        int productOfTwoSmallestAndLargest = nums[0] * nums[1] * nums[n - 1];

        // The maximum product will be the larger of these two calculated products.
        return Math.max(productOfThreeLargest, productOfTwoSmallestAndLargest);
    }
}
```