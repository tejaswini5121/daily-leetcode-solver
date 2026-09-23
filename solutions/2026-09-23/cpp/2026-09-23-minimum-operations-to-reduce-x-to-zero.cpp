// Summary: Find the minimum number of operations to reduce x to zero by removing
//          elements from either the left or right end of an array.
// Link: https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/
//
// Approach:
// The problem asks for the minimum number of operations to make the sum of removed
// elements equal to x. This is equivalent to finding the longest subarray whose sum
// is `total_sum - x`. If such a subarray exists, then the remaining elements at
// the ends must sum up to x. The number of operations will be `n - length_of_longest_subarray`.
//
// We can use a sliding window approach to find the longest subarray with sum `target = total_sum - x`.
//
// 1. Calculate the total sum of the array.
// 2. If `total_sum < x`, it's impossible to reach x, so return -1.
// 3. Calculate the `target` sum for the subarray: `target = total_sum - x`.
// 4. Initialize `left = 0`, `current_sum = 0`, and `max_len = -1` (to indicate no subarray found yet).
// 5. Iterate through the array with a `right` pointer from `0` to `n-1`:
//    a. Add `nums[right]` to `current_sum`.
//    b. While `current_sum > target` and `left <= right`:
//       i. Subtract `nums[left]` from `current_sum`.
//       ii. Increment `left`.
//    c. If `current_sum == target`:
//       i. Update `max_len = max(max_len, right - left + 1)`.
// 6. After the loop, if `max_len == -1`, it means no subarray with sum `target` was found,
//    so it's impossible to reach x. Return -1.
// 7. Otherwise, the minimum number of operations is `n - max_len`.
//
// Time Complexity: O(n), where n is the length of the array. We iterate through the array
//                  with the `right` pointer once, and the `left` pointer also moves at most n times.
// Space Complexity: O(1), as we only use a few variables to store sums and pointers.

#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    int minOperations(std::vector<int>& nums, int x) {
        // Calculate the total sum of the array.
        long long total_sum = 0;
        for (int num : nums) {
            total_sum += num;
        }

        // If the total sum is less than x, it's impossible to reach x.
        if (total_sum < x) {
            return -1;
        }

        // The target sum for the subarray that we want to *keep*.
        // The elements removed from the ends will sum up to x.
        // So, the remaining elements must sum up to total_sum - x.
        long long target = total_sum - x;

        // If x is equal to the total sum, we need to remove all elements.
        if (target == 0) {
            return nums.size();
        }

        int n = nums.size();
        int left = 0;
        long long current_sum = 0;
        int max_len = -1; // Initialize with -1 to indicate no subarray found yet.

        // Sliding window approach to find the longest subarray with sum equal to 'target'.
        for (int right = 0; right < n; ++right) {
            current_sum += nums[right];

            // Shrink the window from the left if current_sum exceeds the target.
            while (current_sum > target && left <= right) {
                current_sum -= nums[left];
                left++;
            }

            // If current_sum matches the target, update the maximum length of such a subarray.
            if (current_sum == target) {
                max_len = std::max(max_len, right - left + 1);
            }
        }

        // If max_len is still -1, it means no subarray with sum 'target' was found.
        // This implies it's impossible to achieve x by removing elements.
        if (max_len == -1) {
            return -1;
        }

        // The minimum number of operations is the total number of elements minus
        // the length of the longest subarray that sums to (total_sum - x).
        return n - max_len;
    }
};
