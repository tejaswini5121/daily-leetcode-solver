// Problem: Find Target Indices After Sorting Array
// LeetCode Link: https://leetcode.com/problems/find-target-indices-after-sorting-array/
//
// Approach:
// First, sort the input array `nums` in non-decreasing order.
// After sorting, all occurrences of the `target` will be contiguous.
// We can then iterate through the sorted array and collect all indices
// where the element is equal to the `target`.
//
// An optimization can be made: instead of iterating through the entire sorted array,
// we can find the first occurrence of `target` using binary search (or by counting
// elements smaller than `target`), and then count how many times `target` appears.
// The indices will be `first_occurrence_index, first_occurrence_index + 1, ..., first_occurrence_index + count - 1`.
//
// For this problem, a simpler approach of counting elements smaller than target and
// then adding indices for each occurrence of target is also efficient given the constraints.
// Let's count how many numbers are strictly less than `target` and how many are equal to `target`.
// If `count_less` is the number of elements less than `target` and `count_equal` is the number of elements equal to `target`,
// then the target indices will be `count_less`, `count_less + 1`, ..., `count_less + count_equal - 1`.
//
// Time Complexity:
// Sorting the array takes O(N log N) where N is the length of `nums`.
// Counting elements less than `target` and equal to `target` takes O(N).
// Therefore, the dominant factor is sorting, resulting in O(N log N).
// If we use binary search to find the first and last occurrences, it would be O(log N)
// for each search after sorting, and O(N) for sorting, still O(N log N).
// The counting approach described above also takes O(N) after sorting, so O(N log N).
//
// Space Complexity:
// O(1) if we sort the array in-place. If a new sorted array is created, it would be O(N).
// The result list can store up to N elements, so O(N) for the output in the worst case.
// However, excluding output space, the auxiliary space is O(1) (or O(log N) for sort recursion stack).

#include <vector>
#include <algorithm>
#include <iostream>

class Solution {
public:
    std::vector<int> targetIndices(std::vector<int>& nums, int target) {
        // Sort the array in non-decreasing order.
        std::sort(nums.begin(), nums.end());

        std::vector<int> result_indices; // Vector to store the indices where target is found.

        // Iterate through the sorted array to find indices of the target.
        // Since the array is sorted, all occurrences of 'target' will be contiguous.
        for (int i = 0; i < nums.size(); ++i) {
            // If the current element is equal to the target, add its index to the result list.
            if (nums[i] == target) {
                result_indices.push_back(i);
            }
            // Optimization: If the current element is greater than the target,
            // we can stop searching because all subsequent elements will also be greater.
            else if (nums[i] > target) {
                break;
            }
        }

        // The problem statement guarantees that the returned list must be sorted in increasing order,
        // which is naturally achieved by iterating from left to right.
        return result_indices;
    }
};

/*
// Alternative approach using counting without explicit iteration for indices after sorting:
class Solution {
public:
    std::vector<int> targetIndices(std::vector<int>& nums, int target) {
        std::sort(nums.begin(), nums.end());

        int count_less = 0; // Counts elements strictly less than target.
        int count_equal = 0; // Counts elements equal to target.

        // Iterate through the sorted array to count relevant elements.
        for (int num : nums) {
            if (num < target) {
                count_less++;
            } else if (num == target) {
                count_equal++;
            } else {
                // Since the array is sorted, if num > target, we can stop early.
                break;
            }
        }

        std::vector<int> result_indices;
        // The target indices start from 'count_less' and continue for 'count_equal' times.
        for (int i = 0; i < count_equal; ++i) {
            result_indices.push_back(count_less + i);
        }

        return result_indices;
    }
};
*/

// Main function for testing purposes (optional, can be removed for submission).
int main() {
    Solution sol;
    std::vector<int> nums1 = {1, 2, 5, 2, 3};
    int target1 = 2;
    std::vector<int> result1 = sol.targetIndices(nums1, target1);
    std::cout << "Input: nums = [1,2,5,2,3], target = 2" << std::endl;
    std::cout << "Output: [";
    for (size_t i = 0; i < result1.size(); ++i) {
        std::cout << result1[i] << (i == result1.size() - 1 ? "" : ",");
    }
    std::cout << "]" << std::endl; // Expected: [1,2]

    std::vector<int> nums2 = {1, 2, 5, 2, 3};
    int target2 = 3;
    std::vector<int> result2 = sol.targetIndices(nums2, target2);
    std::cout << "Input: nums = [1,2,5,2,3], target = 3" << std::endl;
    std::cout << "Output: [";
    for (size_t i = 0; i < result2.size(); ++i) {
        std::cout << result2[i] << (i == result2.size() - 1 ? "" : ",");
    }
    std::cout << "]" << std::endl; // Expected: [3]

    std::vector<int> nums3 = {1, 2, 5, 2, 3};
    int target3 = 5;
    std::vector<int> result3 = sol.targetIndices(nums3, target3);
    std::cout << "Input: nums = [1,2,5,2,3], target = 5" << std::endl;
    std::cout << "Output: [";
    for (size_t i = 0; i < result3.size(); ++i) {
        std::cout << result3[i] << (i == result3.size() - 1 ? "" : ",");
    }
    std::cout << "]" << std::endl; // Expected: [4]

    std::vector<int> nums4 = {1, 1, 1, 1, 1};
    int target4 = 1;
    std::vector<int> result4 = sol.targetIndices(nums4, target4);
    std::cout << "Input: nums = [1,1,1,1,1], target = 1" << std::endl;
    std::cout << "Output: [";
    for (size_t i = 0; i < result4.size(); ++i) {
        std::cout << result4[i] << (i == result4.size() - 1 ? "" : ",");
    }
    std::cout << "]" << std::endl; // Expected: [0,1,2,3,4]

    std::vector<int> nums5 = {100};
    int target5 = 100;
    std::vector<int> result5 = sol.targetIndices(nums5, target5);
    std::cout << "Input: nums = [100], target = 100" << std::endl;
    std::cout << "Output: [";
    for (size_t i = 0; i < result5.size(); ++i) {
        std::cout << result5[i] << (i == result5.size() - 1 ? "" : ",");
    }
    std::cout << "]" << std::endl; // Expected: [0]

    std::vector<int> nums6 = {10,20,30};
    int target6 = 15;
    std::vector<int> result6 = sol.targetIndices(nums6, target6);
    std::cout << "Input: nums = [10,20,30], target = 15" << std::endl;
    std::cout << "Output: [";
    for (size_t i = 0; i < result6.size(); ++i) {
        std::cout << result6[i] << (i == result6.size() - 1 ? "" : ",");
    }
    std::cout << "]" << std::endl; // Expected: []

    return 0;
}
