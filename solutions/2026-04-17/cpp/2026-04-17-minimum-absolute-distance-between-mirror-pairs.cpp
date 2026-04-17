```cpp
// Find the minimum absolute distance between indices of mirror pairs in an array.
// A mirror pair (i, j) exists if reverse(nums[i]) == nums[j] and i < j.
// Link: https://leetcode.com/problems/minimum-absolute-distance-between-mirror-pairs/
//
// Approach:
// We can iterate through the array and for each number, calculate its reversed version.
// We'll use a hash map (unordered_map in C++) to store the indices of numbers encountered so far.
// For each number `nums[i]`, we reverse it to get `reversed_num`.
// Then, we check if `reversed_num` is present in our hash map.
// If it is, it means we've found a potential mirror pair. We retrieve all indices `j` where `nums[j] == reversed_num`
// that appeared before `i`. For each such `j`, `(j, i)` forms a mirror pair because `reverse(nums[j]) == nums[i]`
// is NOT what we are looking for.
// Instead, we are looking for `reverse(nums[i]) == nums[j]`. So, for each `nums[i]`, we compute `reversed_i = reverse(nums[i])`.
// If `reversed_i` is found in the map, it means there exists some `j < i` such that `nums[j] == reversed_i`.
// This implies `reverse(nums[j])` (which is `nums[j]` reversed) would be equal to `reversed_i` reversed. This is not helpful.
//
// Let's rethink the condition: a mirror pair is (i, j) such that 0 <= i < j < nums.length, and reverse(nums[i]) == nums[j].
// So, when we are at index `i`, we compute `reversed_num_i = reverse(nums[i])`.
// We then need to check if `reversed_num_i` exists in the array at an index `j` where `j > i`.
// This approach requires looking ahead, which can be inefficient if done naively.
//
// A better approach: Iterate through the array and for each number `nums[i]`:
// 1. Calculate its reversed value: `reversed_val = reverse(nums[i])`.
// 2. Check if `reversed_val` has been seen before in the array at an index `j`.
//    If `reversed_val` has been seen at index `j`, then we have a potential mirror pair.
//    The pair would be `(j, i)` if `reverse(nums[j]) == nums[i]`. This is NOT the definition.
//    The definition is `reverse(nums[i]) == nums[j]`.
//
// Let's re-strategize:
// We are looking for `(i, j)` with `i < j` and `reverse(nums[i]) == nums[j]`.
//
// When we iterate through `nums` from left to right (index `i` from 0 to n-1):
// For each `nums[i]`, we can calculate `rev_i = reverse(nums[i])`.
// We need to see if `rev_i` exists in the array at any index `j` where `j > i`.
// This is still looking ahead.
//
// Alternative:
// Store the indices for each number.
// `map<int, vector<int>> indices_map;`
// Iterate through `nums`: `for (int i = 0; i < nums.size(); ++i) { indices_map[nums[i]].push_back(i); }`
//
// Now, iterate through `nums` again (index `i`):
// Calculate `rev_i = reverse(nums[i])`.
// Check if `rev_i` is in `indices_map`.
// If `indices_map.count(rev_i)`:
//   For each index `j` in `indices_map[rev_i]`:
//     If `j > i`:
//       We found a mirror pair `(i, j)` since `reverse(nums[i]) == rev_i == nums[j]`.
//       Calculate distance `abs(i - j)` which is `j - i`.
//       Update minimum distance.
//
// This might involve iterating through multiple indices for a single `rev_i`, which can be O(N^2) in worst case if many numbers are the same.
//
// Let's try to optimize using a hash map that stores the *first* occurrence of a number.
// `unordered_map<int, int> first_occurrence;`
// `min_dist = infinity`
//
// Iterate `i` from 0 to n-1:
//   `current_num = nums[i]`
//   `reversed_num = reverse(current_num)`
//
//   We need to find `j` such that `j > i` and `nums[j] == reversed_num`.
//   This still requires looking ahead.
//
// Consider processing from right to left?
// Iterate `i` from n-1 down to 0:
//   `current_num = nums[i]`
//   `reversed_num = reverse(current_num)`
//
//   We need to find `j` such that `j < i` and `reverse(nums[j]) == nums[i]`.
//   Let's re-read the definition: a mirror pair is (i, j) such that 0 <= i < j < nums.length, and reverse(nums[i]) == nums[j].
//
//   When we are at index `j`, we have `nums[j]`. We need to check if there was an index `i < j` such that `reverse(nums[i]) == nums[j]`.
//   This means for `nums[j]`, we are looking for its reverse, `reverse(nums[j])`.
//   If `reverse(nums[j])` exists in the array at an index `i < j`, AND `reverse(nums[i]) == nums[j]`. This is circular.
//
//   Let's simplify:
//   We are looking for `(i, j)` with `i < j` and `reverse(nums[i]) == nums[j]`.
//
//   We can iterate through the array using index `j`. For each `nums[j]`, we want to see if there exists an `i < j` such that `reverse(nums[i]) == nums[j]`.
//   This means we are looking for the value `nums[j]` to be the *reversed* version of some `nums[i]`.
//   So, we are interested in `reverse(nums[j])`. If `reverse(nums[j])` exists in the array at some index `i < j`, then `(i, j)` is a mirror pair.
//   No, this is incorrect. The condition is `reverse(nums[i]) == nums[j]`.
//
//   Correct logic:
//   Iterate through the array with index `j` from 0 to n-1.
//   For each `nums[j]`, we need to find an `i < j` such that `reverse(nums[i]) == nums[j]`.
//   This means we need to know, for each value `V` we've seen so far (at indices `i < j`), what its reversed value is.
//   And then check if that reversed value is equal to `nums[j]`.
//
//   Let's use a map to store the indices of numbers encountered so far.
//   `unordered_map<int, vector<int>> seen_indices;`
//   `min_dist = infinity`
//
//   Iterate `j` from 0 to n-1:
//     `current_num = nums[j]`
//     `reversed_current_num = reverse(current_num)`
//
//     Now, we need to find if `reversed_current_num` exists in `seen_indices`.
//     If `seen_indices.count(reversed_current_num)`:
//       This means there exists at least one index `i` where `nums[i] == reversed_current_num`.
//       But we need `reverse(nums[i]) == nums[j]`.
//
//       Let's consider the pair definition again: `reverse(nums[i]) == nums[j]`.
//       This means `nums[j]` is the reversed form of `nums[i]`.
//
//       So, when we are at index `j`, we look at `nums[j]`.
//       We are looking for some `i < j` such that `nums[i]` when reversed equals `nums[j]`.
//       This means we should check if `reverse(nums[j])` has appeared at some index `i < j`.
//       No, this is still not right.
//
//       Let's use the reverse function to map values.
//       `unordered_map<int, int> val_to_index;` // Stores the *first* index where a value appeared.
//       `min_abs_dist = infinity;`
//
//       Iterate `i` from 0 to n-1:
//         `current_val = nums[i];`
//         `reversed_val = reverse(current_val);`
//
//         // We are looking for a pair (k, i) such that k < i and reverse(nums[k]) == nums[i].
//         // This means nums[i] is the reverse of some nums[k].
//         // So, we are interested in the value nums[i] and what number reversed would produce it.
//         // The number whose reverse is nums[i] is reverse(nums[i]).
//         // So, we check if reverse(nums[i]) exists in our map of previously seen numbers.
//
//         // If `reversed_val` (which is `reverse(nums[i])`) has been seen before at index `k`.
//         // i.e., if `val_to_index.count(reversed_val)`.
//         // Let `k = val_to_index[reversed_val]`.
//         // Then `nums[k] == reversed_val`.
//         // So `nums[k] == reverse(nums[i])`.
//         // This gives us a pair `(k, i)` where `k < i` (because we are storing first occurrences)
//         // and `nums[k] == reverse(nums[i])`.
//         // This is NOT the condition `reverse(nums[i]) == nums[j]`.
//
//       Let's try again with the definition: `reverse(nums[i]) == nums[j]` for `i < j`.
//
//       We can iterate through the array with index `j`. For each `nums[j]`, we want to find if there's an `i < j` such that `reverse(nums[i]) == nums[j]`.
//       This means `nums[j]` is the target value we are looking for *as a reversed number*.
//       So, for each `nums[j]`, we need to find if `nums[j]` itself is the result of reversing some `nums[i]` where `i < j`.
//       This means `nums[j]` must be present in a conceptual list of `reverse(nums[k])` for all `k < j`.
//
//       Let's use a map to store the mapping from a *reversed* number to its original index.
//       `unordered_map<int, int> reversed_val_to_original_index;`
//       `min_dist = infinity;`
//
//       Iterate `j` from 0 to n-1:
//         `current_val = nums[j];`
//
//         // We are looking for an `i < j` such that `reverse(nums[i]) == current_val`.
//         // This means `current_val` is the *target* value.
//         // We need to check if any `nums[i]` (for `i < j`) has `current_val` as its reverse.
//         // So, we should check if `current_val` has been seen as a reversed value before.
//         // How do we know what values were seen as reversed?
//
//       Let's try storing the indices where specific values *are* the reversed form of something.
//       `unordered_map<int, int> value_to_first_index;` // Stores value -> first index encountered.
//       `min_dist = INT_MAX;`
//
//       Iterate `i` from 0 to n-1:
//         `num = nums[i];`
//         `rev_num = reverse(num);`
//
//         // We are looking for pairs (k, i) such that k < i and reverse(nums[k]) == nums[i].
//         // So, if `rev_num` (which is `reverse(nums[i])`) has been seen before as `nums[k]`, this doesn't help directly.
//
//       Let's focus on the definition: `reverse(nums[i]) == nums[j]`.
//       When we are at index `j`, we have `nums[j]`. We are looking for an `i < j` such that `reverse(nums[i]) == nums[j]`.
//       This means `nums[j]` must be a number that can be formed by reversing some `nums[i]` with `i < j`.
//       So, we need to check if `nums[j]` is present in the set of reversed numbers formed by `nums[0], ..., nums[j-1]`.
//
//       Let's maintain a map `seen_reversed_values` where keys are reversed numbers and values are their *first* original index.
//       `unordered_map<int, int> seen_reversed_values;` // Map: reversed_value -> index `i` where `reverse(nums[i]) == reversed_value`
//       `min_dist = INT_MAX;`
//
//       Iterate `j` from 0 to n-1:
//         `current_num = nums[j];`
//
//         // We need to check if `current_num` is equal to `reverse(nums[i])` for some `i < j`.
//         // This means we need to see if `current_num` exists as a key in our `seen_reversed_values` map.
//         // If `seen_reversed_values.count(current_num)`:
//         //   Let `i = seen_reversed_values[current_num]`.
//         //   Then we know that `reverse(nums[i]) == current_num` (which is `nums[j]`).
//         //   And we know `i < j` because we add to the map as we iterate `j`.
//         //   So, `(i, j)` is a mirror pair.
//         //   Update `min_dist = min(min_dist, j - i)`.
//
//         // After checking for pairs ending at `j`, we need to update `seen_reversed_values` for the *next* iterations.
//         // We need to consider `nums[j]` as a potential `nums[i]` for future `k > j`.
//         // So, we calculate `rev_of_current = reverse(current_num)`.
//         // If `rev_of_current` is not already in the map, add it: `seen_reversed_values[rev_of_current] = j`.
//         // We only store the *first* occurrence of a reversed value because we want the minimum distance,
//         // and `j - i` will be minimized when `i` is as small as possible (i.e., the first occurrence).
//
//       Revised logic:
//       `unordered_map<int, int> reversed_to_first_idx;` // Stores: the reversed value -> the smallest index `i` such that `nums[i]` when reversed yields this key.
//       `min_dist = INT_MAX;`
//
//       Iterate `j` from 0 to nums.size() - 1:
//         `current_num = nums[j];`
//
//         // Check if `current_num` is a reversed value of some number encountered earlier.
//         // If `reversed_to_first_idx.count(current_num)`:
//         //   This means there exists an index `i` (which is `reversed_to_first_idx[current_num]`)
//         //   such that `reverse(nums[i]) == current_num`.
//         //   Since we iterate `j` from left to right and store the first index `i`, we guarantee `i < j`.
//         //   So, `(i, j)` is a mirror pair.
//         //   `min_dist = min(min_dist, j - i);`
//
//         // Now, we need to add the reversed form of `current_num` to our map for future checks.
//         // We are interested in `reverse(nums[i]) == nums[j]`.
//         // So for current `j`, `nums[j]` is the target.
//         // We need to add `reverse(nums[j])` as a *potential* `nums[i]` to be matched with future `nums[k]` (where `k > j`).
//         // NO. This is still confusing.
//
//       Let's stick to the definition: `reverse(nums[i]) == nums[j]`, `i < j`.
//
//       When we are at index `j`, we have `nums[j]`. We are looking for an `i < j` such that `reverse(nums[i]) == nums[j]`.
//       This means `nums[j]` *must be* the reversed value of some `nums[i]` that came before it.
//       So, we need to efficiently check if `nums[j]` is in the set of `reverse(nums[0]), reverse(nums[1]), ..., reverse(nums[j-1])`.
//       And if it is, we need the *smallest* index `i` such that `reverse(nums[i]) == nums[j]`.
//
//       Data structure: `unordered_map<int, int> val_to_first_idx_for_reverse;`
//       Key: a number that is the result of reversing some `nums[k]`.
//       Value: the smallest index `k` for which `reverse(nums[k])` produced this key.
//
//       Iterate `j` from 0 to n-1:
//         `current_num = nums[j];`
//
//         // Check if `current_num` itself is a reversed number that we've "registered" earlier.
//         // If `val_to_first_idx_for_reverse.count(current_num)`:
//         //   This means there's an index `i = val_to_first_idx_for_reverse[current_num]`
//         //   such that `reverse(nums[i]) == current_num`.
//         //   Since we are iterating `j` forward and `i` was stored as the *first* occurrence of `reverse(nums[i])` being available,
//         //   and `j` is the current index, we ensure `i < j`.
//         //   So, `(i, j)` is a mirror pair.
//         //   `min_dist = min(min_dist, j - i);`
//
//         // Now, we must register the reverse of the *current* number `nums[j]` for future checks.
//         // The number `nums[j]` will be `nums[i]` for future indices `k > j`.
//         // So we compute `reversed_current = reverse(current_num)`.
//         // If `reversed_current` has not been seen as a target value before:
//         //   Add it to the map: `val_to_first_idx_for_reverse[reversed_current] = j;`
//         // We only add if it's not present to ensure we always have the smallest `i`.
//
//       Example Walkthrough: nums = [12, 21, 45, 33, 54]
//       `val_to_first_idx_for_reverse = {}`, `min_dist = INT_MAX`
//
//       j = 0, `current_num = 12`
//         Check `12` in `val_to_first_idx_for_reverse`? No.
//         `reversed_current = reverse(12) = 21`.
//         `21` not in map keys. `val_to_first_idx_for_reverse[21] = 0`.
//         `val_to_first_idx_for_reverse = {21: 0}`
//
//       j = 1, `current_num = 21`
//         Check `21` in `val_to_first_idx_for_reverse`? Yes. `i = val_to_first_idx_for_reverse[21] = 0`.
//         Pair `(0, 1)` found. `reverse(nums[0]) = reverse(12) = 21 = nums[1]`.
//         `min_dist = min(INT_MAX, 1 - 0) = 1`.
//         `reversed_current = reverse(21) = 12`.
//         `12` not in map keys. `val_to_first_idx_for_reverse[12] = 1`.
//         `val_to_first_idx_for_reverse = {21: 0, 12: 1}`
//
//       j = 2, `current_num = 45`
//         Check `45` in `val_to_first_idx_for_reverse`? No.
//         `reversed_current = reverse(45) = 54`.
//         `54` not in map keys. `val_to_first_idx_for_reverse[54] = 2`.
//         `val_to_first_idx_for_reverse = {21: 0, 12: 1, 54: 2}`
//
//       j = 3, `current_num = 33`
//         Check `33` in `val_to_first_idx_for_reverse`? No.
//         `reversed_current = reverse(33) = 33`.
//         `33` not in map keys. `val_to_first_idx_for_reverse[33] = 3`.
//         `val_to_first_idx_for_reverse = {21: 0, 12: 1, 54: 2, 33: 3}`
//
//       j = 4, `current_num = 54`
//         Check `54` in `val_to_first_idx_for_reverse`? Yes. `i = val_to_first_idx_for_reverse[54] = 2`.
//         Pair `(2, 4)` found. `reverse(nums[2]) = reverse(45) = 54 = nums[4]`.
//         `min_dist = min(1, 4 - 2) = min(1, 2) = 1`.
//         `reversed_current = reverse(54) = 45`.
//         `45` not in map keys. `val_to_first_idx_for_reverse[45] = 4`.
//         `val_to_first_idx_for_reverse = {21: 0, 12: 1, 54: 2, 33: 3, 45: 4}`
//
//       End of loop. `min_dist = 1`.
//
//       If `min_dist` is still `INT_MAX`, it means no mirror pair was found. Return -1. Otherwise return `min_dist`.
//
//       The `reverse` function needs to handle leading zeros and be efficient.
//       `int reverse_int(int x)`:
//         `int reversed = 0;`
//         `while (x > 0)`:
//           `digit = x % 10;`
//           `reversed = reversed * 10 + digit;`
//           `x /= 10;`
//         `return reversed;`
//
//       Consider `nums = [120, 21]`
//       `val_to_first_idx_for_reverse = {}`, `min_dist = INT_MAX`
//
//       j = 0, `current_num = 120`
//         Check `120` in map? No.
//         `reversed_current = reverse(120) = 21`.
//         `21` not in map keys. `val_to_first_idx_for_reverse[21] = 0`.
//         `val_to_first_idx_for_reverse = {21: 0}`
//
//       j = 1, `current_num = 21`
//         Check `21` in map? Yes. `i = val_to_first_idx_for_reverse[21] = 0`.
//         Pair `(0, 1)` found. `reverse(nums[0]) = reverse(120) = 21 = nums[1]`.
//         `min_dist = min(INT_MAX, 1 - 0) = 1`.
//         `reversed_current = reverse(21) = 12`.
//         `12` not in map keys. `val_to_first_idx_for_reverse[12] = 1`.
//         `val_to_first_idx_for_reverse = {21: 0, 12: 1}`
//
//       End loop. `min_dist = 1`.
//
//       Consider `nums = [21, 120]`
//       `val_to_first_idx_for_reverse = {}`, `min_dist = INT_MAX`
//
//       j = 0, `current_num = 21`
//         Check `21` in map? No.
//         `reversed_current = reverse(21) = 12`.
//         `12` not in map keys. `val_to_first_idx_for_reverse[12] = 0`.
//         `val_to_first_idx_for_reverse = {12: 0}`
//
//       j = 1, `current_num = 120`
//         Check `120` in map? No.
//         `reversed_current = reverse(120) = 21`.
//         `21` not in map keys. `val_to_first_idx_for_reverse[21] = 1`.
//         `val_to_first_idx_for_reverse = {12: 0, 21: 1}`
//
//       End loop. `min_dist = INT_MAX`. Return -1.
//
//       This logic seems sound.
//
// Time complexity:
// The `reverse_int` function takes O(log10(x)) time, where x is the value of the number. Since x <= 10^9, this is roughly constant time (max 10 digits).
// We iterate through the `nums` array once (N elements).
// For each element, we perform a hash map lookup (average O(1)), a hash map insertion (average O(1)), and the `reverse_int` operation.
// Total time complexity is O(N * log10(max(nums))), which is effectively O(N) because log10(max(nums)) is small and constant.
//
// Space complexity:
// We use an `unordered_map` to store `reversed_val_to_original_index`.
// In the worst case, all reversed numbers are distinct, so the map can store up to N entries.
// Space complexity is O(N).
//
// Constraints check:
// 1 <= nums.length <= 10^5. O(N) time and space are acceptable.
// 1 <= nums[i] <= 10^9. The `reverse_int` function needs to handle numbers up to 10^9, which fits within a standard `int` type in C++ (typically up to 2 * 10^9). The reversed number will also fit.

#include <vector>
#include <unordered_map>
#include <algorithm> // for std::min
#include <limits>    // for std::numeric_limits

class Solution {
public:
    // Helper function to reverse the digits of an integer.
    // Leading zeros are omitted after reversing.
    // For example, reverse(120) = 21.
    int reverse_int(int x) {
        int reversed = 0;
        while (x > 0) {
            int digit = x % 10; // Get the last digit
            reversed = reversed * 10 + digit; // Append the digit to the reversed number
            x /= 10; // Remove the last digit from the original number
        }
        return reversed;
    }

    int minimumAbsDifference(std::vector<int>& nums) {
        // Map to store: the reversed value -> the smallest index 'i' encountered so far
        // such that reverse(nums[i]) results in this key.
        // We store the smallest index to ensure the minimum absolute difference `j - i`.
        std::unordered_map<int, int> reversed_val_to_first_idx;

        // Initialize minimum absolute distance to a very large value.
        int min_dist = std::numeric_limits<int>::max();

        // Iterate through the array with index 'j'.
        for (int j = 0; j < nums.size(); ++j) {
            int current_num = nums[j];

            // Check if the 'current_num' (nums[j]) is present as a key in our map.
            // If it is, it means 'current_num' is the reversed value of some 'nums[i]'
            // where 'i' is the value stored in the map (reversed_val_to_first_idx[current_num]).
            // Since we iterate 'j' from left to right and store the first index 'i',
            // we are guaranteed that 'i < j'.
            // Thus, (i, j) forms a mirror pair where reverse(nums[i]) == nums[j].
            if (reversed_val_to_first_idx.count(current_num)) {
                int i = reversed_val_to_first_idx[current_num];
                // Update the minimum absolute distance.
                min_dist = std::min(min_dist, j - i);
            }

            // Now, we need to prepare for future iterations.
            // The current number `nums[j]` could be the `nums[i]` for a future mirror pair.
            // So, we calculate its reversed value.
            int reversed_current = reverse_int(current_num);

            // If this `reversed_current` value has not been encountered as a reversed number before,
            // or if the current index 'j' provides a smaller index for this reversed value,
            // we add/update it in the map.
            // We only store the *first* occurrence's index to guarantee the minimum distance.
            // So, we only insert if the key is not already present.
            if (reversed_val_to_first_idx.find(reversed_current) == reversed_val_to_first_idx.end()) {
                reversed_val_to_first_idx[reversed_current] = j;
            }
        }

        // If min_dist is still its initial maximum value, it means no mirror pair was found.
        // Otherwise, return the found minimum absolute distance.
        return (min_dist == std::numeric_limits<int>::max()) ? -1 : min_dist;
    }
};
```