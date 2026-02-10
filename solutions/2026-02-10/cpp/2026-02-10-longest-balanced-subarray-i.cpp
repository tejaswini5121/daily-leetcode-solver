```cpp
// Solves the Longest Balanced Subarray I problem.
// Problem Link: https://leetcode.com/problems/longest-balanced-subarray-i/
//
// Approach:
// The problem asks for the longest subarray where the count of distinct even numbers
// equals the count of distinct odd numbers.
//
// We can iterate through all possible subarrays. For each subarray, we can maintain
// sets of distinct even and distinct odd numbers encountered so far. If the sizes
// of these sets are equal, we update the maximum length found.
//
// To optimize this, we can use prefix sums/differences.
// Let's define a "balance value" for each number:
// - If a number is even, it contributes +1 to the "even count".
// - If a number is odd, it contributes +1 to the "odd count".
//
// We are looking for a subarray nums[i...j] such that the count of distinct even numbers
// in this subarray equals the count of distinct odd numbers.
//
// This definition of "balance" is tricky with distinct numbers. If a number appears
// multiple times, it only counts once for the distinct count.
//
// A more direct approach without complex prefix sums for distinct elements:
// Iterate through all possible start points `i` of a subarray.
// For each `i`, iterate through all possible end points `j` (from `i` to `n-1`).
// For each subarray `nums[i...j]`:
//   - Use two sets: `even_distinct` and `odd_distinct`.
//   - Iterate from `k = i` to `j`.
//   - If `nums[k]` is even, insert it into `even_distinct`.
//   - If `nums[k]` is odd, insert it into `odd_distinct`.
//   - After iterating through the subarray, check if `even_distinct.size() == odd_distinct.size()`.
//   - If they are equal, update `maxLength = max(maxLength, j - i + 1)`.
//
// Time Complexity: O(N^3) where N is the length of nums.
//   - Outer loop for `i`: N iterations.
//   - Inner loop for `j`: N iterations.
//   - Innermost loop for `k` (or processing subarray): N operations, set insertions are O(log K) where K is distinct count, max K is N. So O(N log N) per subarray. Total N * N * N log N = O(N^3 log N).
//   - However, the set insertion can be considered O(1) on average if we hash elements, or more precisely O(distinct_count) within the subarray.
//   - With the current approach, processing a subarray takes O(length_of_subarray * log(distinct_numbers)).
//   - The overall complexity for iterating through all subarrays and processing them with sets is O(N^2 * N * log N) which is too slow.
//
// Let's refine the O(N^3) approach.
// For each start `i`:
//   Initialize `even_distinct` and `odd_distinct` sets.
//   For each end `j` from `i` to `n-1`:
//     Add `nums[j]` to its respective set.
//     If `even_distinct.size() == odd_distinct.size()`, update `maxLength`.
//
// This refined approach:
// Time Complexity: O(N^2 * log(N)) because for each of the O(N^2) subarrays, set insertion takes O(log N) in the worst case.
// Space Complexity: O(N) in the worst case for storing distinct elements in the sets.
// Given N <= 1500, O(N^2 log N) might be acceptable. 1500^2 * log(1500) is roughly 2.25 * 10^6 * 11 which is about 25 * 10^6 operations.
// This should pass within time limits.

#include <vector>
#include <unordered_set>
#include <algorithm>

class Solution {
public:
    int longestBalancedSubarray(std::vector<int>& nums) {
        int n = nums.size();
        int maxLength = 0; // Initialize maximum length to 0

        // Iterate through all possible start indices `i` of a subarray
        for (int i = 0; i < n; ++i) {
            // For each starting index `i`, we will explore all possible ending indices `j`
            // We need to keep track of distinct even and odd numbers for the current subarray `nums[i...j]`

            std::unordered_set<int> even_distinct; // Set to store distinct even numbers
            std::unordered_set<int> odd_distinct;  // Set to store distinct odd numbers

            // Iterate through all possible end indices `j` of a subarray, starting from `i`
            for (int j = i; j < n; ++j) {
                // Process the current element `nums[j]`
                if (nums[j] % 2 == 0) {
                    // If the number is even, insert it into the `even_distinct` set
                    even_distinct.insert(nums[j]);
                } else {
                    // If the number is odd, insert it into the `odd_distinct` set
                    odd_distinct.insert(nums[j]);
                }

                // Check if the number of distinct even numbers equals the number of distinct odd numbers
                if (even_distinct.size() == odd_distinct.size()) {
                    // If they are equal, the current subarray `nums[i...j]` is balanced.
                    // Update `maxLength` with the length of this balanced subarray if it's greater.
                    // The length of the subarray `nums[i...j]` is `j - i + 1`.
                    maxLength = std::max(maxLength, j - i + 1);
                }
            }
        }

        // Return the maximum length of a balanced subarray found
        return maxLength;
    }
};
```