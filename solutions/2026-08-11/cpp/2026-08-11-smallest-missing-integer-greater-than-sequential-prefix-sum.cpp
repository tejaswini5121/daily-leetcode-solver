// Problem: Smallest Missing Integer Greater Than Sequential Prefix Sum
// Link: https://leetcode.com/problems/smallest-missing-integer-greater-than-sequential-prefix-sum/
//
// Approach:
// First, we need to find the longest sequential prefix. We can iterate through the array,
// keeping track of the current sum and checking if the next element is exactly one greater
// than the previous element. If the sequence breaks, we stop and record the sum of the
// sequential prefix found so far.
// After finding the sum of the longest sequential prefix, we need to find the smallest
// integer greater than or equal to this sum that is missing from the array.
// A simple way to do this is to use a hash set (unordered_set in C++) to store all elements
// of the input array for quick lookups. Then, we can start checking from the sum of the
// sequential prefix and increment until we find a number that is not present in the hash set.
//
// Time Complexity:
// Finding the longest sequential prefix takes O(N) time, where N is the length of nums.
// Inserting all elements into the hash set takes O(N) time.
// Checking for missing integers starts from the prefix sum and increments. In the worst case,
// we might check up to N+1 numbers (if the prefix sum is small and all numbers up to that point are present).
// So, checking for the missing integer takes O(N) time in the worst case.
// Therefore, the overall time complexity is O(N).
//
// Space Complexity:
// We use a hash set to store all elements of nums, which takes O(N) space.
// The variables used for calculation take O(1) space.
// Therefore, the overall space complexity is O(N).

#include <vector>
#include <numeric>
#include <unordered_set>

class Solution {
public:
    int findSmallestInteger(std::vector<int>& nums) {
        // Calculate the sum of the longest sequential prefix.
        long long current_sum = 0; // Use long long to avoid potential overflow for sum.
        int n = nums.size();

        // Handle the case where the first element itself starts a sequential prefix.
        if (n > 0) {
            current_sum = nums[0]; // Initialize sum with the first element.
            // Iterate from the second element to find the longest sequential prefix.
            for (int i = 1; i < n; ++i) {
                // Check if the current element is exactly one greater than the previous element.
                if (nums[i] == nums[i - 1] + 1) {
                    current_sum += nums[i]; // Extend the sequential prefix.
                } else {
                    // The sequential prefix is broken. Stop here.
                    break;
                }
            }
        }
        // If nums is empty, current_sum remains 0, and we'll start checking from 0.
        // However, the problem constraints state 1 <= nums.length <= 50, so nums is never empty.

        // Create a hash set to efficiently check for the presence of numbers.
        std::unordered_set<int> num_set;
        for (int num : nums) {
            num_set.insert(num);
        }

        // Start checking from the sum of the longest sequential prefix.
        // Find the smallest integer >= current_sum that is not in the set.
        long long missing_candidate = current_sum;
        while (true) {
            // Check if the current candidate is present in the set.
            if (num_set.find(static_cast<int>(missing_candidate)) == num_set.end()) {
                // If not found, this is our smallest missing integer.
                return static_cast<int>(missing_candidate);
            }
            // If found, increment the candidate and check again.
            missing_candidate++;
        }
    }
};
```