// Problem: Smallest Missing Multiple of K
// Link: https://leetcode.com/problems/smallest-missing-multiple-of-k/
// Approach:
// We need to find the smallest positive multiple of k that is not present in the given array nums.
// We can iterate through positive multiples of k (k, 2k, 3k, ...) and check if each multiple exists in nums.
// To efficiently check for the existence of a number in nums, we can use a hash set (std::unordered_set in C++).
// We insert all elements of nums into the hash set.
// Then, we start checking multiples of k:
// Initialize a variable `current_multiple` to `k`.
// In a loop:
//   Check if `current_multiple` is present in the hash set.
//   If it's NOT present, then `current_multiple` is the smallest missing multiple of k. Return it.
//   If it IS present, increment `current_multiple` by `k` and continue the loop.
// Since the constraints on nums.length, nums[i], and k are small (up to 100), the maximum possible smallest missing multiple would be around 100 * 100 = 10000.
// The loop will eventually find a missing multiple.
// Time Complexity: O(N + M), where N is the length of nums and M is the value of the smallest missing multiple of k.
// In the worst case, M can be roughly N * k. So, roughly O(N * k).
// More precisely, the insertion into the hash set takes O(N) on average. The loop to find the missing multiple
// runs at most `k * (max_val_in_nums / k + 1)` times. Given the constraints, this is efficient.
// Space Complexity: O(N) for storing the elements of nums in the hash set.
#include <vector>
#include <unordered_set>

class Solution {
public:
    int findKthPositiveString(std::vector<int>& nums, int k) {
        // Create a hash set to store the numbers present in nums for efficient lookups.
        std::unordered_set<int> present_nums;
        for (int num : nums) {
            present_nums.insert(num);
        }

        // Start checking multiples of k.
        // The first multiple of k is k itself.
        int current_multiple = k;

        // Loop indefinitely until we find the smallest missing multiple.
        while (true) {
            // Check if the current multiple of k is present in the hash set.
            // The `count` method of unordered_set returns 1 if the element exists, 0 otherwise.
            if (present_nums.count(current_multiple) == 0) {
                // If the current multiple is NOT found in the hash set, it's the smallest missing multiple.
                return current_multiple;
            }
            // If the current multiple is found, move to the next multiple of k.
            current_multiple += k;
        }
        // This part of the code is unreachable because the loop will always find a missing multiple
        // given the constraints and the nature of the problem.
    }
};
