```cpp
// Problem: Minimum Distance Between Three Equal Elements I
// Summary: Find the minimum distance between three indices with equal elements in an array.
// Link: https://leetcode.com/problems/minimum-distance-between-three-equal-elements-i/
//
// Approach:
// We can iterate through all possible combinations of three distinct indices (i, j, k)
// and check if nums[i] == nums[j] == nums[k]. If they are equal, we calculate the
// distance abs(i - j) + abs(j - k) + abs(k - i) and update the minimum distance found so far.
// To efficiently find indices for a given value, we can pre-process the array
// to store the indices for each unique number. A hash map (std::unordered_map)
// can be used where the key is the number and the value is a vector of its indices.
//
// Then, for each number that appears at least 3 times, we iterate through all
// combinations of three indices from its list of occurrences and calculate the distance.
//
// Time Complexity:
// Let N be the length of the input array `nums`.
// In the worst case, if all elements are the same, we might have O(N) indices for a single value.
// The number of combinations of choosing 3 indices from K indices is O(K^3).
// If all elements are the same, K = N, so the combinations would be O(N^3).
// However, the problem constraints state N <= 100.
// Pre-processing takes O(N) time to build the hash map.
// Iterating through each number's indices: if a number appears `k` times, we do O(k^3) work.
// The sum of `k` for all distinct numbers is N.
// In the worst case, one number appears N times, leading to O(N^3) for distance calculation.
// Given N <= 100, N^3 is at most 1,000,000, which is acceptable.
//
// Space Complexity:
// O(N) in the worst case, where all elements are distinct and stored in the hash map,
// or if one element appears many times, its list of indices can take up to O(N) space.

#include <vector>
#include <cmath>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int minDistance(std::vector<int>& nums) {
        // Map to store indices for each unique number.
        // Key: the number, Value: a vector of indices where this number appears.
        std::unordered_map<int, std::vector<int>> indicesMap;

        // Populate the map with indices for each number.
        for (int i = 0; i < nums.size(); ++i) {
            indicesMap[nums[i]].push_back(i);
        }

        // Initialize minimum distance to a very large value.
        // Using `long long` to avoid potential overflow when summing distances, though
        // with N <= 100, int should be sufficient. But good practice.
        long long min_dist = -1; // Default to -1 if no good tuple is found.

        // Iterate through each number and its list of indices in the map.
        for (auto const& [num, indices] : indicesMap) {
            // If a number appears at least 3 times, it can form a good tuple.
            if (indices.size() >= 3) {
                // Iterate through all combinations of three distinct indices for this number.
                for (size_t i = 0; i < indices.size(); ++i) {
                    for (size_t j = i + 1; j < indices.size(); ++j) {
                        for (size_t k = j + 1; k < indices.size(); ++k) {
                            // Get the actual indices from the stored list.
                            int idx1 = indices[i];
                            int idx2 = indices[j];
                            int idx3 = indices[k];

                            // Calculate the distance for this tuple.
                            long long current_dist = std::abs(idx1 - idx2) + std::abs(idx2 - idx3) + std::abs(idx3 - idx1);

                            // Update the minimum distance if this is the first good tuple found
                            // or if the current distance is smaller.
                            if (min_dist == -1 || current_dist < min_dist) {
                                min_dist = current_dist;
                            }
                        }
                    }
                }
            }
        }

        // Return the minimum distance found, or -1 if no good tuple was possible.
        return static_cast<int>(min_dist);
    }
};
```