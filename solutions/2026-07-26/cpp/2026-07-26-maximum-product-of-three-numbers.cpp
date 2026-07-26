// Problem: Maximum Product of Three Numbers
// Link: https://leetcode.com/problems/maximum-product-of-three-numbers/
//
// Approach:
// The maximum product of three numbers can be achieved in two possible scenarios:
// 1. The product of the three largest numbers. This is straightforward if all numbers are positive.
// 2. The product of the two smallest (most negative) numbers and the largest number. This is important when there are negative numbers, as the product of two negatives is positive.
//
// Therefore, we need to find the three largest numbers and the two smallest numbers.
// Sorting the array makes it easy to find these numbers. After sorting:
// - The three largest numbers will be at the end of the array.
// - The two smallest numbers will be at the beginning of the array.
//
// We then compare the product of the three largest numbers with the product of the two smallest and the largest number, and return the maximum of these two.
//
// Time Complexity:
// O(N log N) due to the sorting of the input array, where N is the number of elements in nums.
//
// Space Complexity:
// O(1) if the sorting is done in-place, or O(log N) or O(N) depending on the sorting algorithm's auxiliary space usage (e.g., for recursion stack in quicksort or merge sort).
// Standard `std::sort` in C++ typically uses introsort, which has O(log N) space complexity in the worst case for recursion.

#include <vector>
#include <algorithm>

class Solution {
public:
    int maximumProduct(std::vector<int>& nums) {
        // Sort the array in ascending order.
        // This allows us to easily identify the smallest and largest elements.
        std::sort(nums.begin(), nums.end());

        // Get the size of the array.
        int n = nums.size();

        // There are two potential candidates for the maximum product:
        // 1. The product of the three largest numbers.
        //    These are located at the end of the sorted array: nums[n-1], nums[n-2], nums[n-3].
        int product_of_three_largest = nums[n - 1] * nums[n - 2] * nums[n - 3];

        // 2. The product of the two smallest numbers and the largest number.
        //    This scenario is important when there are negative numbers.
        //    The two smallest numbers are at the beginning: nums[0], nums[1].
        //    The largest number is at the end: nums[n-1].
        int product_of_two_smallest_and_largest = nums[0] * nums[1] * nums[n - 1];

        // Return the maximum of these two products.
        return std::max(product_of_three_largest, product_of_two_smallest_and_largest);
    }
};
