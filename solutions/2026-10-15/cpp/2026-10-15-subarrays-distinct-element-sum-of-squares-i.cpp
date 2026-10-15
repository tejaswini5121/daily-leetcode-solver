```cpp
// Problem: Subarrays Distinct Element Sum of Squares I
// Link: https://leetcode.com/problems/subarrays-distinct-element-sum-of-squares-i/
//
// Approach:
// We need to iterate through all possible subarrays, calculate the number of distinct elements
// in each subarray, square this count, and sum up all these squares.
//
// A straightforward approach is to use nested loops. The outer loop iterates through all
// possible starting indices `i` of a subarray, and the inner loop iterates through all
// possible ending indices `j` of a subarray, starting from `i`.
//
// For each subarray `nums[i..j]`, we can use a hash set (like `std::unordered_set` in C++)
// to efficiently count the number of distinct elements. We insert each element from `nums[i]`
// to `nums[j]` into the hash set. The size of the hash set at the end will be the distinct count.
//
// We then square this distinct count and add it to a running total.
//
// Time Complexity:
// There are O(N^2) subarrays where N is the length of `nums`.
// For each subarray of length `k`, inserting elements into a hash set takes O(k) on average.
// In the worst case, k can be N. So, iterating through all subarrays and counting distinct elements
// for each would be O(N^3).
// However, we can optimize the distinct counting within the inner loop. For a fixed `i`, as `j`
// increases, we are just adding one new element to the subarray `nums[i..j-1]`. We can maintain
// the hash set and its size incrementally.
// For a fixed `i`, the inner loop runs from `j = i` to `N-1`. In each iteration of the inner loop,
// we add `nums[j]` to the hash set. This insertion takes O(1) on average.
// So, for each `i`, the inner loop takes O(N) time.
// Since the outer loop runs N times, the total time complexity is O(N^2).
//
// Space Complexity:
// For each subarray, we use a hash set to store distinct elements. In the worst case, a subarray
// can contain all distinct elements, up to N elements. Thus, the space complexity for the hash set
// within the loops is O(N).
// Since the constraints are small (N <= 100), O(N^2) time and O(N) space are well within limits.
//
// Given the constraints (nums.length <= 100), an O(N^3) approach would also pass.
// For example, for each subarray [i..j], create a new set and populate it.
// This implementation uses the O(N^2) approach by incrementally updating the set.

#include <vector>
#include <unordered_set>
#include <numeric> // For std::accumulate, though not strictly needed for this problem

class Solution {
public:
    int sumOfSquares(std::vector<int>& nums) {
        int n = nums.size();
        long long totalSumOfSquares = 0; // Use long long to prevent potential overflow for sum

        // Iterate through all possible start indices 'i' of a subarray
        for (int i = 0; i < n; ++i) {
            // For each start index, we'll build subarrays ending at 'j'
            std::unordered_set<int> distinctElements; // Set to store distinct elements for the current subarray

            // Iterate through all possible end indices 'j' of a subarray, starting from 'i'
            for (int j = i; j < n; ++j) {
                // Add the current element nums[j] to the set of distinct elements
                // unordered_set automatically handles duplicates.
                distinctElements.insert(nums[j]);

                // Get the count of distinct elements in the current subarray nums[i..j]
                int distinctCount = distinctElements.size();

                // Square the distinct count
                long long squaredDistinctCount = static_cast<long long>(distinctCount) * distinctCount;

                // Add the squared distinct count to the total sum
                totalSumOfSquares += squaredDistinctCount;
            }
        }

        // Return the total sum of squares of distinct counts
        // The problem statement implies the result fits in an int, but intermediate sums might exceed.
        // However, with N=100, max distinct count is 100. Max square is 10000.
        // Max number of subarrays is N*(N+1)/2 = 100*101/2 = 5050.
        // Max total sum ~ 5050 * 10000 = 50,500,000 which fits in a 32-bit signed int.
        // Let's cast back to int as per the return type.
        return static_cast<int>(totalSumOfSquares);
    }
};
```