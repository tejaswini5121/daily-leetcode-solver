// Problem: Minimum Absolute Difference
// Link: https://leetcode.com/problems/minimum-absolute-difference/
//
// Approach:
// To find the minimum absolute difference between any two elements in an array,
// it's most efficient to first sort the array. Once sorted, the minimum
// absolute difference will always occur between adjacent elements.
//
// We first iterate through the sorted array to find the smallest absolute
// difference between any two adjacent elements. We store this minimum
// difference.
//
// Then, we iterate through the sorted array again. This time, for each pair
// of adjacent elements, we check if their absolute difference is equal to
// the minimum absolute difference we found. If it is, we add this pair
// (in ascending order) to our result list.
//
// Time Complexity:
// The dominant operations are sorting the array (O(N log N)) and then two
// linear passes through the array (O(N)). Therefore, the overall time
// complexity is O(N log N), where N is the number of elements in the array.
//
// Space Complexity:
// The space complexity depends on the sorting algorithm used by the C++
// standard library (std::sort). Typically, it's O(log N) for the recursion
// stack or O(N) in the worst case if an out-of-place sort is used.
// Additionally, we use space to store the result, which in the worst case
// could be O(N) if all adjacent pairs have the minimum difference.
// Therefore, the overall space complexity is O(N) (dominated by the output
// storage and potentially sorting if not in-place).

#include <vector>
#include <algorithm>
#include <limits>

class Solution {
public:
    std::vector<std::vector<int>> minimumAbsDifference(std::vector<int>& arr) {
        // Sort the array in ascending order. This is crucial because the minimum
        // absolute difference will always be between adjacent elements after sorting.
        std::sort(arr.begin(), arr.end());

        // Initialize the minimum absolute difference to the largest possible integer value.
        // This ensures that the first calculated difference will be smaller.
        int minDiff = std::numeric_limits<int>::max();

        // First pass: Find the minimum absolute difference between adjacent elements.
        for (size_t i = 0; i < arr.size() - 1; ++i) {
            // Calculate the absolute difference between the current element and the next.
            // Since the array is sorted, arr[i+1] - arr[i] is always non-negative.
            int currentDiff = arr[i + 1] - arr[i];
            // Update minDiff if the current difference is smaller.
            minDiff = std::min(minDiff, currentDiff);
        }

        // Initialize a vector to store the resulting pairs.
        std::vector<std::vector<int>> result;

        // Second pass: Collect all pairs with the minimum absolute difference.
        for (size_t i = 0; i < arr.size() - 1; ++i) {
            // Check if the difference between the current adjacent pair equals the minimum difference found.
            if (arr[i + 1] - arr[i] == minDiff) {
                // If it matches, add the pair to the result.
                // The pair is [arr[i], arr[i+1]] as arr[i] < arr[i+1] due to sorting.
                result.push_back({arr[i], arr[i + 1]});
            }
        }

        // Return the list of pairs that have the minimum absolute difference.
        return result;
    }
};
