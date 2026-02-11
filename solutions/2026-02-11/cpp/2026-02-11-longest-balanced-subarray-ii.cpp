```cpp
// Summary: Find the longest subarray where the count of distinct even numbers equals the count of distinct odd numbers.
// Link: https://leetcode.com/problems/longest-balanced-subarray-ii/
//
// Approach:
// The core idea is to transform the problem into finding the longest subarray with a net "balance" of 0.
// We can represent each distinct even number as +1 and each distinct odd number as -1.
// However, simply counting occurrences won't work because we need distinct numbers.
//
// Instead, we can use a prefix sum approach with a twist. For each element `nums[i]`:
// If `nums[i]` is even, we check if we've seen this distinct even number before within the current window.
// If `nums[i]` is odd, we check if we've seen this distinct odd number before within the current window.
//
// To efficiently track distinct elements and their first occurrences for calculating subarray lengths,
// we can maintain two hash maps: `last_even_pos` and `last_odd_pos`. These maps will store the last seen
// index of a distinct even or odd number, respectively.
//
// We can define a "balance" value. For each number, if it's a new distinct even number, the balance increases.
// If it's a new distinct odd number, the balance decreases. If it's a previously seen distinct even/odd number,
// it doesn't change the *net* distinct count for this specific number.
//
// Let's refine the state. We need to know the difference between the count of distinct even numbers
// and the count of distinct odd numbers.
//
// Consider a sliding window approach where we expand the window to the right.
// We maintain the set of distinct even numbers and distinct odd numbers encountered in the current window.
//
// A more efficient approach leverages prefix sums with a state that captures the difference between
// distinct even and odd counts. The challenge is that the "value" of a distinct number can change.
//
// The actual problem is more subtle. A subarray is balanced if `count(distinct_even_in_subarray) == count(distinct_odd_in_subarray)`.
//
// Let's consider transforming the array. For each `nums[i]`, we want to assign a value that, when summed up over a subarray,
// helps us find the balanced condition.
//
// The key insight for this problem often involves mapping the occurrences of distinct numbers to states.
// For each number `x`, we can map it to a unique identifier.
// Let's say we have `k` distinct even numbers and `m` distinct odd numbers.
// The balance condition is `k == m`.
//
// This problem is notoriously tricky and often solved using a technique similar to finding the longest subarray with a sum of `k`.
// We can transform the problem into finding the longest subarray where a specific "score" is 0.
//
// For each element `nums[i]`:
// If `nums[i]` is even, we can think of it as contributing +1 to the "even distinct count".
// If `nums[i]` is odd, we can think of it as contributing +1 to the "odd distinct count".
//
// The problem asks for `distinct_even_count == distinct_odd_count`.
//
// Let's consider a "score" that is 0 when the counts are equal.
// If we assign +1 for a *new* distinct even number and -1 for a *new* distinct odd number.
//
// This requires tracking the first occurrence of each distinct number.
//
// Let's define a "state" for the prefix up to index `i`. The state needs to capture the counts of distinct evens and odds.
//
// The provided solution for "Longest Balanced Subarray" (which is often a simpler version where `x == -x` for even/odd) uses
// mapping to `1` and `-1`. This problem requires distinct counts.
//
// The most common approach for this "Hard" version involves mapping the numbers themselves.
// For each number `v` in `nums`, if `v` is even, we can map it to `2 * v`. If `v` is odd, map it to `2 * v + 1`.
// This way, each distinct even number gets a unique even ID, and each distinct odd number gets a unique odd ID.
//
// Now, for a subarray `nums[l...r]`:
// We want `count(distinct_evens in nums[l...r]) == count(distinct_odds in nums[l...r])`.
//
// Let's process the array and maintain a mapping of seen numbers to their "parity group" IDs.
//
// For each `nums[i]`:
// If `nums[i]` is even, we assign it an ID from a pool of even IDs.
// If `nums[i]` is odd, we assign it an ID from a pool of odd IDs.
//
// The problem asks for `count(distinct even IDs) == count(distinct odd IDs)`.
//
// This can be solved with a prefix sum on a transformed array.
// For each `nums[i]`, we want to compute a value that represents its contribution to the balance.
//
// Let's create a mapping for all unique numbers encountered.
// We can use two maps: `even_id_map` and `odd_id_map`.
// Iterate through `nums`. If `nums[i]` is even, and not in `even_id_map`, assign it a new ID and increment an `even_count`.
// If `nums[i]` is odd, and not in `odd_id_map`, assign it a new ID and increment an `odd_count`.
//
// The state we are interested in for a prefix `nums[0...i]` is `(current_distinct_even_count, current_distinct_odd_count)`.
// We want to find `j < i` such that `distinct_even_count(j+1, i) == distinct_odd_count(j+1, i)`.
//
// This is equivalent to:
// `distinct_even_count(0, i) - distinct_even_count(0, j) == distinct_odd_count(0, i) - distinct_odd_count(0, j)`
//
// Rearranging:
// `distinct_even_count(0, i) - distinct_odd_count(0, i) == distinct_even_count(0, j) - distinct_odd_count(0, j)`
//
// This means we need to calculate a "balance score" for each prefix `nums[0...i]`:
// `balance_score[i] = distinct_even_count(0, i) - distinct_odd_count(0, i)`.
//
// We can then use a hash map to store the first occurrence of each `balance_score`.
// `map<balance_score, first_index>`.
//
// The challenge is efficiently calculating `distinct_even_count(0, i)` and `distinct_odd_count(0, i)`.
//
// We can iterate through the array. For each `nums[i]`:
// 1. Maintain the set of distinct even numbers encountered so far.
// 2. Maintain the set of distinct odd numbers encountered so far.
//
// This still feels like O(N^2) if we recompute distinct counts for each prefix.
//
// A more optimal approach uses two "counts" that we increment/decrement for distinct numbers.
// For each `nums[i]`, we map it to a value that helps us track its contribution.
//
// Let `val[i]` be a transformed value for `nums[i]`.
// If `nums[i]` is even, we want it to contribute positively to some "even score".
// If `nums[i]` is odd, we want it to contribute positively to some "odd score".
//
// The problem is about the *number* of distinct elements, not their values directly.
//
// We can use a technique where we maintain a running "state" representing the difference between
// the count of distinct even numbers and distinct odd numbers.
//
// For each distinct number, we can assign it a unique identifier.
// If `nums[i]` is even and it's the first time we see it, we increment the overall "distinct even count".
// If `nums[i]` is odd and it's the first time we see it, we increment the overall "distinct odd count".
//
// Let's consider the transformation from LeetCode discussions:
// For each distinct number `x`, we can assign it a unique index.
// If `x` is even, assign it an ID from the even pool.
// If `x` is odd, assign it an ID from the odd pool.
//
// The goal is to find the longest subarray `[l, r]` such that the number of unique even IDs in `nums[l..r]` equals the number of unique odd IDs in `nums[l..r]`.
//
// This is equivalent to finding the longest subarray where:
// `Sum(value_for_even_ids_in_nums[l..r]) == Sum(value_for_odd_ids_in_nums[l..r])`
// where `value_for_even_ids` is +1 and `value_for_odd_ids` is -1.
//
// This still doesn't seem right. We need counts.
//
// The problem can be rephrased: "longest subarray where the number of distinct elements with even parity equals the number of distinct elements with odd parity."
//
// The standard solution involves mapping numbers to unique IDs and then using prefix sums.
//
// Let's use two maps: `even_val_to_id` and `odd_val_to_id`.
// `next_even_id = 0`, `next_odd_id = 0`.
//
// For each `nums[i]`:
// If `nums[i]` is even:
//   If `nums[i]` is not in `even_val_to_id`:
//     `even_val_to_id[nums[i]] = next_even_id++`
//
// If `nums[i]` is odd:
//   If `nums[i]` is not in `odd_val_to_id`:
//     `odd_val_to_id[nums[i]] = next_odd_id++`
//
// This approach calculates the total number of distinct even and odd numbers in the *entire* array, which isn't what we need for subarrays.
//
// The core challenge is that the "distinct count" for a number depends on the window.
//
// A truly efficient solution for this specific problem requires mapping the occurrences of distinct values.
//
// Let's consider the state for a prefix `nums[0...i]` as the *difference* between the count of distinct even numbers and the count of distinct odd numbers.
// `diff[i] = count(distinct evens in nums[0...i]) - count(distinct odds in nums[0...i])`
// We are looking for `j < i` such that `diff[i] == diff[j]`.
//
// To compute `diff[i]`:
// We need to know, for each number `v`, whether it's a new distinct even or odd number in the prefix `0...i`.
//
// We can use maps to store the *last seen index* of each distinct even and odd number.
// `last_seen_even: map<int, int>` (value -> index)
// `last_seen_odd: map<int, int>` (value -> index)
//
// Iterate through `nums` from left to right (index `i` from 0 to n-1).
// Maintain `current_distinct_even_count` and `current_distinct_odd_count`.
//
// When we encounter `nums[i]`:
// If `nums[i]` is even:
//   If `nums[i]` is *not* in `last_seen_even`:
//     `current_distinct_even_count++`
//     `last_seen_even[nums[i]] = i`
//   Else ( `nums[i]` was seen before ):
//     // It's still a distinct even number within the current prefix. Its contribution to distinct count is already accounted for.
//     // We just update its last seen index.
//     `last_seen_even[nums[i]] = i`
//
// If `nums[i]` is odd:
//   If `nums[i]` is *not* in `last_seen_odd`:
//     `current_distinct_odd_count++`
//     `last_seen_odd[nums[i]] = i`
//   Else:
//     `last_seen_odd[nums[i]] = i`
//
// Now, the `balance_score = current_distinct_even_count - current_distinct_odd_count`.
// We need to store the first index `j` where a particular `balance_score` was achieved.
// `map<int, int> first_occurrence_of_balance_score;`
//
// Initialize `first_occurrence_of_balance_score[0] = -1` (to handle subarrays starting from index 0).
// `max_len = 0`.
//
// Iterate `i` from 0 to `n-1`:
//   Update `last_seen_even`, `last_seen_odd`, `current_distinct_even_count`, `current_distinct_odd_count`.
//   Calculate `current_balance_score = current_distinct_even_count - current_distinct_odd_count`.
//
//   If `current_balance_score` is in `first_occurrence_of_balance_score`:
//     `prev_index = first_occurrence_of_balance_score[current_balance_score]`
//     `max_len = max(max_len, i - prev_index)`
//   Else:
//     `first_occurrence_of_balance_score[current_balance_score] = i`
//
// This approach correctly identifies the longest subarray where the *net change* in distinct even and odd counts is the same.
// However, the problem states "number of distinct even numbers in the subarray is equal to the number of distinct odd numbers."
//
// The prefix sum approach `distinct_even_count(0, i) - distinct_odd_count(0, i) == distinct_even_count(0, j) - distinct_odd_count(0, j)`
// is correct for finding subarrays where the *difference* in distinct counts is preserved.
//
// Let's re-evaluate the state needed for `balance_score[i] = distinct_even_count(0, i) - distinct_odd_count(0, i)`.
//
// `distinct_even_count(0, i)`: This is the number of unique even values encountered from index 0 to `i`.
// `distinct_odd_count(0, i)`: This is the number of unique odd values encountered from index 0 to `i`.
//
// To calculate this efficiently, we can use two maps to store the *first occurrence* of each distinct even/odd number.
// `first_occurrence_even: map<int, int>` (value -> first index)
// `first_occurrence_odd: map<int, int>` (value -> first index)
//
// Iterate `i` from 0 to `n-1`:
//   If `nums[i]` is even:
//     If `nums[i]` is not in `first_occurrence_even`:
//       `first_occurrence_even[nums[i]] = i`
//
//   If `nums[i]` is odd:
//     If `nums[i]` is not in `first_occurrence_odd`:
//       `first_occurrence_odd[nums[i]] = i`
//
// The size of `first_occurrence_even` is `distinct_even_count(0, i)`.
// The size of `first_occurrence_odd` is `distinct_odd_count(0, i)`.
//
// So, `balance_score[i] = first_occurrence_even.size() - first_occurrence_odd.size()`.
//
// We need to re-calculate these map sizes for each `i`. This is too slow if done naively.
//
// The key is that when we move from `i-1` to `i`:
// If `nums[i]` is even and *new*: `current_distinct_even_count` increases by 1.
// If `nums[i]` is odd and *new*: `current_distinct_odd_count` increases by 1.
//
// We can maintain `current_distinct_even_count` and `current_distinct_odd_count` incrementally.
//
// `map<int, int> last_seen_even_value;`
// `map<int, int> last_seen_odd_value;`
//
// `current_distinct_even = 0;`
// `current_distinct_odd = 0;`
//
// `map<int, int> balance_prefix_map;` // Stores `balance_score -> first_index`
// `balance_prefix_map[0] = -1;` // Base case for subarrays starting at index 0.
// `max_len = 0;`
//
// Iterate `i` from 0 to `n-1`:
//   If `nums[i] % 2 == 0` (even):
//     If `last_seen_even_value.find(nums[i]) == last_seen_even_value.end()`:
//       // First time seeing this distinct even number
//       `current_distinct_even++;`
//       `last_seen_even_value[nums[i]] = i;` // Store its occurrence
//     Else:
//       // Seen before, just update last seen index (not strictly necessary for count, but good practice if we needed "last occurrence")
//       // `last_seen_even_value[nums[i]] = i;`
//       // The distinct count doesn't change for this number.
//       pass;
//   Else (odd):
//     If `last_seen_odd_value.find(nums[i]) == last_seen_odd_value.end()`:
//       // First time seeing this distinct odd number
//       `current_distinct_odd++;`
//       `last_seen_odd_value[nums[i]] = i;` // Store its occurrence
//     Else:
//       // Seen before
//       // `last_seen_odd_value[nums[i]] = i;`
//       pass;
//
//   `current_balance_score = current_distinct_even - current_distinct_odd;`
//
//   If `balance_prefix_map.count(current_balance_score)`:
//     // We found a previous prefix with the same balance score.
//     // The subarray between that previous prefix's end and the current index `i` is balanced.
//     `prev_index = balance_prefix_map[current_balance_score];`
//     `max_len = max(max_len, i - prev_index);`
//   Else:
//     // This is the first time we've encountered this balance score.
//     // Record the current index `i` as the first occurrence.
//     `balance_prefix_map[current_balance_score] = i;`
//
// This approach seems to correctly implement the prefix sum technique for this problem.
//
// Time Complexity: O(N * log M), where N is the length of nums, and M is the maximum value in nums.
// The log M factor comes from `std::map` operations (insert, find, access). If we use `std::unordered_map`,
// it would be O(N) on average, but O(N^2) in worst case. Given the constraints on `nums[i]`, `std::map` might be safer
// or we could consider coordinate compression if `nums[i]` were much larger but the number of distinct values was smaller.
// However, `nums[i] <= 10^5` and `N <= 10^5`, so `std::map` is acceptable.
//
// Space Complexity: O(N) in the worst case, as `last_seen_even_value`, `last_seen_odd_value`, and `balance_prefix_map` can store up to N distinct keys (though keys for value maps are bounded by 10^5, unique keys for balance scores are bounded by N).
//
// Let's refine the maps. The values in `nums` can be up to 10^5.
// `last_seen_even_value` and `last_seen_odd_value` will map `int` (value) to `int` (index).
// The number of distinct even/odd values can be at most N.
// The number of distinct balance scores can be at most N.
// So, O(N) space for maps is correct.

#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int longestBalancedSubarray(std::vector<int>& nums) {
        // Map to store the first occurrence of each distinct even number's value.
        // Key: distinct even number value, Value: index of its first occurrence.
        std::unordered_map<int, int> last_seen_even_value;

        // Map to store the first occurrence of each distinct odd number's value.
        // Key: distinct odd number value, Value: index of its first occurrence.
        std::unordered_map<int, int> last_seen_odd_value;

        // `balance_prefix_map` stores the first index at which a specific balance score was achieved.
        // The balance score is defined as (count of distinct even numbers) - (count of distinct odd numbers)
        // encountered in the prefix up to that index.
        // Key: balance score, Value: the earliest index `i` where this balance score was seen.
        std::unordered_map<int, int> balance_prefix_map;

        // Initialize balance_prefix_map with a balance score of 0 at index -1.
        // This handles cases where the longest balanced subarray starts from the beginning of the array (index 0).
        balance_prefix_map[0] = -1;

        int current_distinct_even_count = 0;
        int current_distinct_odd_count = 0;
        int max_len = 0;

        for (int i = 0; i < nums.size(); ++i) {
            if (nums[i] % 2 == 0) { // Current number is even
                // Check if this is the first time we've encountered this specific even number.
                if (last_seen_even_value.find(nums[i]) == last_seen_even_value.end()) {
                    // It's a new distinct even number. Increment the distinct even count.
                    current_distinct_even_count++;
                    // Record this even number and its first seen index.
                    last_seen_even_value[nums[i]] = i;
                }
                // If the even number was seen before, its distinct count contribution doesn't change for this prefix.
                // We only need to track its first occurrence for counting purposes.
            } else { // Current number is odd
                // Check if this is the first time we've encountered this specific odd number.
                if (last_seen_odd_value.find(nums[i]) == last_seen_odd_value.end()) {
                    // It's a new distinct odd number. Increment the distinct odd count.
                    current_distinct_odd_count++;
                    // Record this odd number and its first seen index.
                    last_seen_odd_value[nums[i]] = i;
                }
                // If the odd number was seen before, its distinct count contribution doesn't change for this prefix.
            }

            // Calculate the current balance score for the prefix ending at index `i`.
            // balance_score = (total distinct evens seen so far) - (total distinct odds seen so far)
            int current_balance_score = current_distinct_even_count - current_distinct_odd_count;

            // Check if this balance score has been seen before.
            if (balance_prefix_map.count(current_balance_score)) {
                // If it has, it means the subarray between the previous occurrence of this balance score
                // and the current index `i` is balanced.
                // The length of this balanced subarray is `i - balance_prefix_map[current_balance_score]`.
                int prev_index = balance_prefix_map[current_balance_score];
                max_len = std::max(max_len, i - prev_index);
            } else {
                // If this balance score is encountered for the first time, record the current index `i`
                // as the earliest occurrence of this score.
                balance_prefix_map[current_balance_score] = i;
            }
        }

        return max_len;
    }
};
```