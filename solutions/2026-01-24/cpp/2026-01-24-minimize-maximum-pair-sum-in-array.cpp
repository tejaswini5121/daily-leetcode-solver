// Problem: Minimize Maximum Pair Sum in Array
// Link: https://leetcode.com/problems/minimize-maximum-pair-sum-in-array/
//
// Summary: Given an array of even length, pair up elements to minimize the largest sum among all pairs.
//
// Approach:
// The problem asks us to minimize the maximum pair sum. This suggests a greedy approach.
// To minimize the largest sum, we should try to pair the smallest elements with the largest elements.
// If we sort the array, we can pair the smallest element with the largest, the second smallest with the second largest, and so on.
//
// Let the sorted array be nums[0], nums[1], ..., nums[n-1].
// We can form pairs (nums[0], nums[n-1]), (nums[1], nums[n-2]), ..., (nums[n/2 - 1], nums[n/2]).
// The sum of each pair is nums[i] + nums[n-1-i] for i from 0 to n/2 - 1.
// We then find the maximum of these sums.
//
// Consider an example: nums = [3, 5, 2, 3]
// Sorted: [2, 3, 3, 5]
// Pairs: (2, 5), (3, 3)
// Sums: 2 + 5 = 7, 3 + 3 = 6
// Maximum pair sum = max(7, 6) = 7
//
// This greedy strategy works because if we have any other pairing, say we swap two elements from different pairs:
// Original pairs: (a, z) and (b, y) where a <= b <= y <= z. Sums are a+z and b+y.
// If we swap to form (a, y) and (b, z), the new sums are a+y and b+z.
// Since a <= b and y <= z:
// a+y <= b+y (since a <= b)
// b+y <= b+z (since y <= z)
//
// Also, a+y <= a+z (since y <= z)
// and b+y <= a+z (since b <= a is false, but if we consider the original sorted order: a is the smallest, z is the largest, b and y are in between.
// The largest sum will always be formed by pairing the smallest remaining element with the largest remaining element.
// By pairing nums[i] with nums[n-1-i] after sorting, we are effectively pairing the i-th smallest element with the i-th largest element.
// This ensures that the largest possible sums are minimized.
//
// Time Complexity:
// O(N log N) due to sorting the array, where N is the number of elements in nums.
// The traversal to find the maximum pair sum takes O(N/2) which is O(N).
//
// Space Complexity:
// O(1) if the sorting algorithm used is in-place (like heapsort or introsort which is typically used by std::sort in C++).
// If a non-in-place sort is used, it could be O(N) or O(log N) depending on the implementation.
// std::sort in C++ typically uses IntroSort, which has an average and worst-case time complexity of O(N log N) and
// an auxiliary space complexity of O(log N) due to recursion stack.
// However, for practical purposes and typical interview scenarios, O(1) space is often assumed for std::sort if it's modifying the input array.
//
// Approach using Two Pointers:
// 1. Sort the input array `nums`.
// 2. Initialize two pointers, `left` at the beginning (index 0) and `right` at the end (index n-1).
// 3. Initialize `max_pair_sum` to 0.
// 4. While `left` is less than `right`:
//    a. Calculate the current pair sum: `current_sum = nums[left] + nums[right]`.
//    b. Update `max_pair_sum = max(max_pair_sum, current_sum)`.
//    c. Move `left` pointer one step to the right: `left++`.
//    d. Move `right` pointer one step to the left: `right--`.
// 5. Return `max_pair_sum`.

#include <vector>
#include <algorithm>
#include <iostream>

class Solution {
public:
    int minPairSum(std::vector<int>& nums) {
        // Sort the array to enable the greedy pairing strategy.
        // This arranges elements in non-decreasing order.
        std::sort(nums.begin(), nums.end());

        // Initialize pointers for the two-pointer approach.
        // `left` starts at the smallest element.
        int left = 0;
        // `right` starts at the largest element.
        int right = nums.size() - 1;

        // Initialize the variable to store the maximum pair sum found so far.
        // We start with 0 as all numbers are positive, so any valid sum will be greater.
        int max_pair_sum = 0;

        // Iterate as long as the left pointer is to the left of the right pointer.
        // This ensures we form pairs from the outside inwards.
        while (left < right) {
            // Calculate the sum of the current pair.
            // The greedy strategy pairs the smallest available element (nums[left])
            // with the largest available element (nums[right]).
            int current_sum = nums[left] + nums[right];

            // Update `max_pair_sum` if the current pair's sum is larger.
            max_pair_sum = std::max(max_pair_sum, current_sum);

            // Move the `left` pointer one step to the right to consider the next smallest element.
            left++;
            // Move the `right` pointer one step to the left to consider the next largest element.
            right--;
        }

        // Return the minimized maximum pair sum.
        return max_pair_sum;
    }
};

/*
// Example Usage (for testing purposes, not part of the LeetCode solution submission)
int main() {
    Solution sol;

    std::vector<int> nums1 = {3, 5, 2, 3};
    std::cout << "Input: [3, 5, 2, 3]" << std::endl;
    std::cout << "Output: " << sol.minPairSum(nums1) << std::endl; // Expected: 7

    std::vector<int> nums2 = {3, 5, 4, 2, 4, 6};
    std::cout << "Input: [3, 5, 4, 2, 4, 6]" << std::endl;
    std::cout << "Output: " << sol.minPairSum(nums2) << std::endl; // Expected: 8

    return 0;
}
*/
