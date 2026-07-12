```cpp
/*
 * Problem: Rank Transform of an Array
 * Link: https://leetcode.com/problems/rank-transform-of-an-array/
 *
 * Summary: Replace each element in an array with its rank, where smaller elements have smaller ranks,
 *          equal elements share the same rank, and ranks start from 1 and are as small as possible.
 *
 * Approach:
 * 1. Create a sorted copy of the original array to determine the relative order of elements.
 * 2. Use a hash map (unordered_map in C++) to store the mapping from each unique element
 *    to its rank. Iterate through the sorted array. For each unique element encountered,
 *    assign it a rank starting from 1 and incrementing for each new unique element.
 * 3. Iterate through the original array and replace each element with its corresponding rank
 *    looked up from the hash map.
 *
 * Time Complexity:
 * - Sorting the array takes O(N log N) time, where N is the length of the array.
 * - Building the hash map takes O(N) time in the best and average case (if all elements are unique)
 *   and O(N) in the worst case (e.g., many duplicates, but still proportional to N unique elements).
 * - Replacing elements in the original array takes O(N) time using the hash map.
 * - Overall: O(N log N) due to the sorting step.
 *
 * Space Complexity:
 * - Storing the sorted copy of the array takes O(N) space.
 * - The hash map can store up to N unique elements, taking O(N) space in the worst case.
 * - The output array takes O(N) space.
 * - Overall: O(N).
 */

#include <vector>
#include <algorithm>
#include <unordered_map>

class Solution {
public:
    std::vector<int> arrayRankTransform(std::vector<int>& arr) {
        // Create a copy of the original array to sort.
        // This will help us determine the ranks without modifying the original array prematurely.
        std::vector<int> sorted_arr = arr;

        // Sort the copied array. This puts elements in ascending order,
        // which is crucial for determining their ranks.
        std::sort(sorted_arr.begin(), sorted_arr.end());

        // Create a hash map to store the mapping from each unique element to its rank.
        // The key will be the element value, and the value will be its rank (starting from 1).
        std::unordered_map<int, int> rank_map;

        // Initialize the rank. Ranks start from 1.
        int rank = 1;

        // Iterate through the sorted array to populate the rank map.
        for (int num : sorted_arr) {
            // Check if the current number has already been assigned a rank.
            // If it's not in the map, it's a new unique element.
            if (rank_map.find(num) == rank_map.end()) {
                // Assign the current rank to this unique number.
                rank_map[num] = rank;
                // Increment the rank for the next unique number.
                rank++;
            }
            // If the number is already in the map, it means it's a duplicate of a previously
            // encountered unique number, so it should share the same rank. We do nothing here.
        }

        // Create the result vector, which will store the ranks.
        std::vector<int> result;
        result.reserve(arr.size()); // Reserve space for efficiency.

        // Iterate through the original array again.
        for (int num : arr) {
            // For each element in the original array, look up its rank in the map
            // and add it to the result vector.
            result.push_back(rank_map[num]);
        }

        // Return the vector containing the ranks.
        return result;
    }
};
```