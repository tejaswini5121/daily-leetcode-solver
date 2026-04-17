/**
 * @param {number[]} nums
 * @return {number}
 */
// Problem: Minimum Absolute Distance Between Mirror Pairs
// Link: https://leetcode.com/problems/minimum-absolute-distance-between-mirror-pairs/
// Approach:
// We need to find mirror pairs (i, j) where reverse(nums[i]) == nums[j] and i < j.
// The goal is to find the minimum absolute difference between i and j among all such pairs.
//
// A naive approach would be to iterate through all possible pairs (i, j) with i < j,
// reverse nums[i], and check if it equals nums[j]. This would have a time complexity
// of O(n^2 * log(max_num)), where log(max_num) is for the reverse operation.
// This is too slow given the constraints (n <= 10^5).
//
// We can optimize this using a hash map (or a JavaScript object) to store the indices
// of numbers encountered so far.
//
// For each number nums[i] at index i:
// 1. Reverse nums[i] to get its reversed value.
// 2. Check if this reversed value exists as a key in our hash map.
//    - If it does, it means we have found a potential mirror pair. The map stores
//      the *first* index where this reversed value was seen. Let's call that index `prev_idx`.
//    - The current index is `i`. Since we are iterating from left to right, `prev_idx < i`.
//    - The absolute distance is `i - prev_idx`. We update our minimum distance if this
//      is smaller than the current minimum.
// 3. Add the current number `nums[i]` and its index `i` to the hash map.
//    - If `nums[i]` is already in the map, we don't need to do anything for this problem,
//      as we are interested in the *first* occurrence of a number to ensure `i < j`
//      when we find a mirror. However, the problem asks for *any* mirror pair.
//      To find the *minimum* absolute distance, if we find a reversed value that
//      exists in the map, we want to use the *earliest* index of that reversed value
//      to minimize `i - prev_idx`. So, we should store the *first* index encountered
//      for each number.
//
// Let's refine step 3:
// We will iterate through `nums`. For each `nums[i]` at index `i`:
// a. Calculate `reversed_num = reverse(nums[i])`.
// b. If `reversed_num` is present in our `num_to_first_index` map:
//    - This means `nums[j]` (which is `reversed_num`) was seen at index `j = num_to_first_index[reversed_num]`.
//    - We have a mirror pair `(j, i)` where `j < i`.
//    - The distance is `i - j`. Update `min_dist = min(min_dist, i - j)`.
// c. If `nums[i]` is NOT present in `num_to_first_index`:
//    - Store `num_to_first_index[nums[i]] = i`. This records the first occurrence of `nums[i]`.
//
// The `reverse` function:
// To reverse an integer, we can convert it to a string, reverse the string, and convert it back to an integer.
// Example: reverse(120)
// 1. Convert to string: "120"
// 2. Reverse string: "021"
// 3. Convert back to integer: 21 (leading zeros are omitted automatically by parseInt/Number).
//
// Initialization:
// `min_dist` should be initialized to infinity.
// `num_to_first_index` map will be empty.
//
// Edge Case: No mirror pairs found. If `min_dist` remains infinity after iterating through the array, return -1.
//
// Time Complexity:
// - We iterate through the `nums` array once, which is O(n).
// - For each number, we perform a reverse operation. Reversing a number up to 10^9 takes roughly log10(10^9) = 9 steps (converting to string, reversing, converting back). This is essentially O(log(max_val)).
// - Hash map operations (insertion and lookup) are O(1) on average.
// - Total time complexity: O(n * log(max_val)).
//
// Space Complexity:
// - The hash map `num_to_first_index` can store up to `n` distinct numbers.
// - Therefore, the space complexity is O(n).
//
// Let's refine the logic for handling multiple occurrences of the same number and ensuring `i < j` for mirror pairs.
// The problem statement defines a mirror pair as `(i, j)` such that `0 <= i < j < nums.length` and `reverse(nums[i]) == nums[j]`.
//
// Revised Approach:
// 1. Initialize `min_dist = Infinity`.
// 2. Initialize `num_to_indices = {}` (a map to store number -> list of indices).
//
// 3. First Pass: Populate `num_to_indices`.
//    Iterate through `nums` from `i = 0` to `nums.length - 1`.
//    For each `nums[i]`:
//      If `nums[i]` is not a key in `num_to_indices`, add it: `num_to_indices[nums[i]] = []`.
//      Append the current index `i` to the list: `num_to_indices[nums[i]].push(i)`.
//
// 4. Second Pass: Find mirror pairs and calculate minimum distance.
//    Iterate through `nums` from `i = 0` to `nums.length - 1`.
//    For each `nums[i]`:
//      a. Calculate `reversed_val = reverse(nums[i])`.
//      b. Check if `reversed_val` exists as a key in `num_to_indices`.
//      c. If `reversed_val` exists:
//         - Get the list of indices where `reversed_val` appears: `indices_of_reversed_val = num_to_indices[reversed_val]`.
//         - We are looking for pairs `(i, j)` where `i < j` and `reverse(nums[i]) == nums[j]`.
//         - Here, `nums[i]` is the number we are currently processing, and its reverse is `reversed_val`.
//         - We need to find an index `j` in `indices_of_reversed_val` such that `i < j`.
//         - Since `indices_of_reversed_val` is sorted (because we populated it by iterating from left to right), we can use binary search (or a simple scan from the right of the list) to find the smallest `j` such that `j > i`.
//         - For this problem, it's easier if we iterate through `nums` from left to right, and for `nums[i]`, we look for `reverse(nums[i])`.
//         - Let's rethink to ensure `i < j`.
//
// Alternative Revised Approach:
// This approach aims to directly find `j` when we process `i`, ensuring `i < j`.
//
// 1. Initialize `min_dist = Infinity`.
// 2. Initialize `num_to_first_index = {}`. This map will store `number -> first_index_seen`.
//
// 3. Iterate through `nums` from `i = 0` to `nums.length - 1`.
//    For each `nums[i]`:
//      a. Calculate `reversed_val = reverse(nums[i])`.
//      b. If `reversed_val` is a key in `num_to_first_index`:
//         - This means we've previously seen the value `reversed_val` at `prev_idx = num_to_first_index[reversed_val]`.
//         - We have a potential mirror pair `(prev_idx, i)` because `prev_idx < i` and `nums[i] == reversed_val`.
//         - The distance is `i - prev_idx`.
//         - Update `min_dist = Math.min(min_dist, i - prev_idx)`.
//      c. If `nums[i]` is NOT a key in `num_to_first_index`:
//         - Add `nums[i]` to the map with its current index: `num_to_first_index[nums[i]] = i`.
//
// This revised approach seems correct and simpler. Let's consider the definition carefully: `reverse(nums[i]) == nums[j]`.
//
// Example 1: nums = [12, 21, 45, 33, 54]
//
// i = 0, nums[0] = 12. reverse(12) = 21.
//   - num_to_first_index: {}.
//   - '12' not in map. Add '12': num_to_first_index = {12: 0}.
//
// i = 1, nums[1] = 21. reverse(21) = 12.
//   - num_to_first_index: {12: 0}.
//   - reversed_val = 12. Is '12' in map? Yes, at index 0.
//   - Potential pair (0, 1). Distance = 1 - 0 = 1. min_dist = 1.
//   - '21' not in map. Add '21': num_to_first_index = {12: 0, 21: 1}.
//
// i = 2, nums[2] = 45. reverse(45) = 54.
//   - num_to_first_index: {12: 0, 21: 1}.
//   - reversed_val = 54. Is '54' in map? No.
//   - '45' not in map. Add '45': num_to_first_index = {12: 0, 21: 1, 45: 2}.
//
// i = 3, nums[3] = 33. reverse(33) = 33.
//   - num_to_first_index: {12: 0, 21: 1, 45: 2}.
//   - reversed_val = 33. Is '33' in map? No.
//   - '33' not in map. Add '33': num_to_first_index = {12: 0, 21: 1, 45: 2, 33: 3}.
//
// i = 4, nums[4] = 54. reverse(54) = 45.
//   - num_to_first_index: {12: 0, 21: 1, 45: 2, 33: 3}.
//   - reversed_val = 45. Is '45' in map? Yes, at index 2.
//   - Potential pair (2, 4). Distance = 4 - 2 = 2. min_dist = Math.min(1, 2) = 1.
//   - '54' not in map. Add '54': num_to_first_index = {12: 0, 21: 1, 45: 2, 33: 3, 54: 4}.
//
// End of loop. min_dist is 1. Return 1.
// This logic seems to work for the condition `reverse(nums[i]) == nums[j]`.
//
// What if the array contains duplicates?
// Example: nums = [12, 21, 12, 21]
//
// i = 0, nums[0] = 12. reverse(12) = 21.
//   - num_to_first_index: {}.
//   - '12' not in map. Add '12': num_to_first_index = {12: 0}.
//
// i = 1, nums[1] = 21. reverse(21) = 12.
//   - num_to_first_index: {12: 0}.
//   - reversed_val = 12. Is '12' in map? Yes, at index 0.
//   - Potential pair (0, 1). Distance = 1 - 0 = 1. min_dist = 1.
//   - '21' not in map. Add '21': num_to_first_index = {12: 0, 21: 1}.
//
// i = 2, nums[2] = 12. reverse(12) = 21.
//   - num_to_first_index: {12: 0, 21: 1}.
//   - reversed_val = 21. Is '21' in map? Yes, at index 1.
//   - Potential pair (1, 2). Distance = 2 - 1 = 1. min_dist = Math.min(1, 1) = 1.
//   - '12' is already in map. `num_to_first_index[12]` remains 0. We do NOT update it to 2 because we want the *earliest* index for potential `j` values in future steps where `nums[j]` is being processed and its reverse is `12`.
//
// i = 3, nums[3] = 21. reverse(21) = 12.
//   - num_to_first_index: {12: 0, 21: 1}.
//   - reversed_val = 12. Is '12' in map? Yes, at index 0.
//   - Potential pair (0, 3). Distance = 3 - 0 = 3. min_dist = Math.min(1, 3) = 1.
//   - '21' is already in map. `num_to_first_index[21]` remains 1.
//
// End of loop. min_dist is 1. Return 1.
// This logic appears to correctly handle duplicates.
//
// The `reverse` helper function:
// Input: an integer `x`.
// Output: its reversed integer representation.
// Example: reverse(120) -> 21.
// Method:
// 1. Convert `x` to string.
// 2. Split the string into an array of characters.
// 3. Reverse the array.
// 4. Join the array back into a string.
// 5. Convert the reversed string back to an integer using `parseInt` or `Number`.
//
// Let's write the `reverse` function.
//
// Function to reverse digits of an integer.
// Example: reverse(120) = 21
// const reverse = (num) => {
//     const reversedString = String(num).split('').reverse().join('');
//     return parseInt(reversedString, 10); // Or Number(reversedString)
// };
//
// Final check on initialization and return value for no pairs:
// `min_dist` is initialized to `Infinity`.
// If the loop finishes and `min_dist` is still `Infinity`, it means no mirror pairs were found. In this case, we return -1.
//
// Constraints:
// 1 <= nums.length <= 10^5
// 1 <= nums[i] <= 10^9
//
// The `reverse` function will handle numbers up to 10^9.
// `String(10^9)` is "1000000000". Reversing it is "0000000001". `parseInt` or `Number` will correctly convert this to 1.
// `String(120)` is "120". Reversing is "021". `parseInt` or `Number` will correctly convert this to 21.
//
// The maximum value of `nums[i]` is 10^9.
// Reversing 10^9 gives 1.
// Reversing 123456789 gives 987654321.
//
// The problem asks for the minimum absolute distance between indices. `abs(i - j)` is simply `j - i` when `i < j`.
// Our algorithm correctly calculates `i - prev_idx` where `prev_idx < i`, so `i - prev_idx` is the absolute distance.
//
// What if `nums[i]` is a palindrome, like 33?
// `reverse(33) = 33`.
// If `nums = [33, 55, 33]`:
// i = 0, nums[0] = 33. reverse(33) = 33.
//   - num_to_first_index: {}. Add 33: {33: 0}.
// i = 1, nums[1] = 55. reverse(55) = 55.
//   - num_to_first_index: {33: 0}. Add 55: {33: 0, 55: 1}.
// i = 2, nums[2] = 33. reverse(33) = 33.
//   - num_to_first_index: {33: 0, 55: 1}.
//   - reversed_val = 33. Is '33' in map? Yes, at index 0.
//   - Potential pair (0, 2). Distance = 2 - 0 = 2. min_dist = 2.
//   - '33' is already in map. Don't update.
// Result: 2. This is correct.
//
// What if the number is 0? The constraint `1 <= nums[i]` means numbers are positive.
//
// The implementation looks solid.
//
// Let's consider the `reverse` function again. It can be done with arithmetic too, but string manipulation is often clearer and less prone to overflow issues in intermediate steps for very large numbers (though 10^9 is fine).
//
// Arithmetic reverse:
// const reverseArithmetic = (num) => {
//     let reversed = 0;
//     let temp = num;
//     while (temp > 0) {
//         const digit = temp % 10;
//         reversed = reversed * 10 + digit;
//         temp = Math.floor(temp / 10);
//     }
//     return reversed;
// };
//
// Example: reverseArithmetic(120)
// temp = 120, reversed = 0
// digit = 0, reversed = 0*10 + 0 = 0, temp = 12
// digit = 2, reversed = 0*10 + 2 = 2, temp = 1
// digit = 1, reversed = 2*10 + 1 = 21, temp = 0
// Returns 21.
//
// Example: reverseArithmetic(21)
// temp = 21, reversed = 0
// digit = 1, reversed = 0*10 + 1 = 1, temp = 2
// digit = 2, reversed = 1*10 + 2 = 12, temp = 0
// Returns 12.
//
// The string method is arguably simpler for JS and handles leading zeros omission naturally.
// `parseInt("021")` or `Number("021")` both yield `21`.
//
// Let's stick with the string method for `reverse` for clarity and simplicity.
//
// One final check on the problem statement: "reverse(x) denotes the integer formed by reversing the digits of x. Leading zeros are omitted after reversing, for example reverse(120) = 21." This is exactly what `parseInt(String(x).split('').reverse().join(''))` does.
//
// Example 3: nums = [21, 120]
// i = 0, nums[0] = 21. reverse(21) = 12.
//   - num_to_first_index: {}. Add 21: {21: 0}.
// i = 1, nums[1] = 120. reverse(120) = 21.
//   - num_to_first_index: {21: 0}.
//   - reversed_val = 21. Is '21' in map? Yes, at index 0.
//   - Potential pair (0, 1). Distance = 1 - 0 = 1. min_dist = 1.
//   - '120' not in map. Add 120: {21: 0, 120: 1}.
//
// Wait, Example 3 output is -1. Why?
// Ah, the example states:
// Input: nums = [21,120]
// Output: -1
// Explanation:
// There are no mirror pairs in the array.
//
// Let's re-read the definition of a mirror pair: `0 <= i < j < nums.length, and reverse(nums[i]) == nums[j]`.
//
// For nums = [21, 120]:
// i = 0, nums[0] = 21. reverse(nums[0]) = reverse(21) = 12.
// j = 1, nums[1] = 120.
// Is reverse(nums[0]) == nums[1]? Is 12 == 120? No.
//
// i = 1, nums[1] = 120. This index `i` cannot be part of a pair (i, j) with i < j if i is the last index.
//
// So, for (i, j) with `i < j`:
// Pair (0, 1): nums[0]=21, nums[1]=120.
// reverse(nums[0]) = reverse(21) = 12.
// Is 12 == nums[1] (120)? No.
//
// This means my interpretation of the example was wrong, and my algorithm was correct. The example explanation is key.
//
// Okay, I need to be careful about which element is `nums[i]` and which is `nums[j]`.
// The problem states `reverse(nums[i]) == nums[j]` where `i < j`.
//
// My algorithm:
// Iterate `i` from 0 to n-1.
// Calculate `reversed_val = reverse(nums[i])`.
// If `reversed_val` is in `num_to_first_index`:
//   This means `nums[prev_idx] == reversed_val` where `prev_idx = num_to_first_index[reversed_val]`.
//   So, we have found `prev_idx` and `i` such that `nums[prev_idx]` has `nums[i]` as its reverse.
//   This means `reverse(nums[prev_idx]) == nums[i]`.
//   And we know `prev_idx < i` because `num_to_first_index` stores the *first* occurrence.
//   So we have a mirror pair `(prev_idx, i)` satisfying `reverse(nums[prev_idx]) == nums[i]`.
//   This matches the definition.
//
// Let's re-trace Example 3: nums = [21, 120]
//
// i = 0, nums[0] = 21. reverse(21) = 12.
//   - num_to_first_index: {}.
//   - '21' not in map. Add '21' with index 0: num_to_first_index = {21: 0}.
//
// i = 1, nums[1] = 120. reverse(120) = 21.
//   - num_to_first_index: {21: 0}.
//   - reversed_val = 21. Is '21' in map? Yes, at index 0.
//   - This implies `prev_idx = 0`.
//   - We have found a pair where `reverse(nums[prev_idx]) == nums[i]`.
//     `reverse(nums[0]) = reverse(21) = 12`.
//     `nums[1] = 120`.
//     Is `12 == 120`? No.
//   - The algorithm looks for `reverse(current_num)` in the map.
//     When `i=1`, `nums[i]=120`. `reverse(nums[i]) = reverse(120) = 21`.
//     We check if `21` is in `num_to_first_index`. Yes, `num_to_first_index[21] = 0`.
//     This means `nums[0]` is `21`.
//     So, we have `nums[i] = 120` and `nums[prev_idx] = 21`.
//     The condition is `reverse(nums[i]) == nums[j]`.
//     The pair found by the algorithm is `(prev_idx, i)`.
//     So `i` in the problem statement corresponds to `prev_idx` in my loop, and `j` in the problem statement corresponds to `i` in my loop.
//     Thus, we are checking if `reverse(nums[prev_idx]) == nums[i]`.
//     `prev_idx = 0`, `i = 1`.
//     `reverse(nums[0]) = reverse(21) = 12`.
//     `nums[1] = 120`.
//     Is `12 == 120`? No.
//
//   - The logic needs to be:
//     For current `nums[i]`:
//     1. Calculate `reversed_current = reverse(nums[i])`.
//     2. We are looking for an index `j` such that `i < j` and `reverse(nums[i]) == nums[j]`.
//        OR
//     3. We are looking for an index `j` such that `j < i` and `reverse(nums[j]) == nums[i]`.
//
// The problem definition is `reverse(nums[i]) == nums[j]` with `i < j`.
//
// Let's rephrase the state needed in the map.
//
// We iterate `j` from 0 to n-1.
// For each `nums[j]`:
//   We want to find if there was a previous index `i` (where `i < j`) such that `reverse(nums[i]) == nums[j]`.
//   So, for the current `nums[j]`, we want to know if `nums[j]` itself is the reverse of some *previous* number.
//   This means we need to store the *reversed* values encountered so far.
//
// Revised Approach 2:
// 1. Initialize `min_dist = Infinity`.
// 2. Initialize `reversed_val_to_first_index = {}`. This map will store `reversed_number -> first_index_seen`.
//
// 3. Iterate through `nums` from `j = 0` to `nums.length - 1`. (Using `j` to align with the problem statement `i < j`)
//    For each `nums[j]`:
//      a. Calculate `reversed_val_of_current = reverse(nums[j])`.
//      b. Now, `nums[j]` is a potential `nums[j]` in a mirror pair `(i, j)`.
//         We need to find if `reversed_val_of_current` was seen as `nums[i]` for some `i < j`.
//         This means, for the current `nums[j]`, we need to know if it's the *reverse* of a previous number.
//         So, we should look for `nums[j]` in the map of *reversed* values.
//
// Let's try again with a clear understanding:
// The pair is `(i, j)` where `i < j` and `reverse(nums[i]) == nums[j]`.
//
// Iterate `i` from `0` to `n-1`. For each `nums[i]`:
//   Calculate `reversed_nums_i = reverse(nums[i])`.
//   We need to find if `reversed_nums_i` exists in `nums` at an index `j` where `j > i`.
//   To efficiently find this `j`, we can use a map.
//
// What should the map store?
// If we store `num -> index`, then when we process `nums[i]`, and calculate `reverse(nums[i])`, we can look up `reverse(nums[i])` in the map. If it exists, say at index `k`, then we have `nums[k] == reverse(nums[i])`.
// If `k > i`, then we found a pair `(i, k)` satisfying `reverse(nums[i]) == nums[k]` with `i < k`. Distance is `k - i`.
//
// This is exactly my first algorithm! Why did it fail Example 3?
//
// Example 3: nums = [21, 120]
//
// i = 0, nums[0] = 21. reverse(21) = 12.
//   - num_to_first_index: {}.
//   - '21' not in map. Add '21': num_to_first_index = {21: 0}.
//
// i = 1, nums[1] = 120. reverse(120) = 21.
//   - num_to_first_index: {21: 0}.
//   - reversed_val = 21. Is '21' in map? Yes, at index 0.
//   - This means `prev_idx = 0`.
//   - We have `nums[prev_idx] = 21` and `nums[i] = 120`.
//   - The condition checked by my algorithm is `reverse(nums[i]) == nums[prev_idx]`.
//     Is `reverse(120) == 21`? Yes, `21 == 21`.
//   - The problem definition is `reverse(nums[i]) == nums[j]` where `i < j`.
//   - My algorithm finds `prev_idx` and `i`.
//     If `reverse(nums[i]) == nums[prev_idx]`:
//       This is NOT what we want directly. We want `reverse(nums[some_idx]) == nums[other_idx]` where `some_idx < other_idx`.
//
// Let's rename for clarity.
//
// `map`: Stores `value -> first_index_seen`.
// Iterate `k` from 0 to n-1 (this `k` will be the `j` in `i < j`).
//   `current_num = nums[k]`
//   Calculate `reversed_current_num = reverse(current_num)`.
//   We are looking for an index `i` (where `i < k`) such that `reverse(nums[i]) == nums[k]`.
//   This means `nums[i]` must be the reverse of `nums[k]`.
//   So, `nums[i] == reversed_current_num`.
//   We need to check if `reversed_current_num` was seen at some index `i < k`.
//   Check if `reversed_current_num` is in the map.
//   If `reversed_current_num` is in `map` at `first_index_i`:
//     Then `nums[first_index_i] == reversed_current_num`.
//     And `first_index_i < k` (because we add to map as we iterate).
//     So, `reverse(nums[k]) == nums[first_index_i]` is NOT the condition we want.
//     We want `reverse(nums[first_index_i]) == nums[k]`.
//     This implies `nums[first_index_i]` must be `current_num`.
//     And `nums[k]` must be `reverse(current_num)`.
//
// Let's go back to the definition: `reverse(nums[i]) == nums[j]` and `i < j`.
//
// We iterate `i` from 0 to n-1.
// For each `nums[i]`:
//   Calculate `target_val = reverse(nums[i])`.
//   We need to find if `target_val` exists in `nums` at an index `j` such that `j > i`.
//
// To do this efficiently, we need a map that stores `value -> list_of_indices`.
//
// Map `value_to_indices = {}`.
// Populate the map:
// For `idx` from 0 to n-1:
//   `val = nums[idx]`
//   If `val` not in map, `value_to_indices[val] = []`.
//   `value_to_indices[val].push(idx)`.
//
// Now, iterate `i` from 0 to n-1:
//   `num_i = nums[i]`
//   `target_j_val = reverse(num_i)`
//   If `target_j_val` is in `value_to_indices`:
//     `indices_of_target = value_to_indices[target_j_val]`
//     We need to find an index `j` in `indices_of_target` such that `j > i`.
//     Since `indices_of_target` is sorted, we can use `binary search` (or `findIndex` from `lodash` or a manual loop) to find the smallest `j` such that `j > i`.
//     If such a `j` is found:
//       `distance = j - i`
//       `min_dist = min(min_dist, distance)`
//
// This approach uses O(n) to build the map, and then O(n * log n) for the search (or O(n^2) in worst case for simple loop if `indices_of_target` is large).
// For each `i`, searching `indices_of_target` can be done more efficiently.
// If `indices_of_target` is `[idx1, idx2, ..., idxm]`, we want to find the smallest `idx_k` such that `idx_k > i`.
// Since the list is sorted, we can iterate through `indices_of_target`. The *first* element `idx_k` that is greater than `i` is what we need.
// The number of such `idx_k` can be up to `n`. So this could still be O(n^2).
//
// Example 3: nums = [21, 120]
//
// Map population:
// value_to_indices = {
//   21: [0],
//   120: [1]
// }
//
// Iterate `i`:
//
// i = 0, nums[0] = 21.
//   target_j_val = reverse(21) = 12.
//   Is 12 in value_to_indices? No.
//
// i = 1, nums[1] = 120.
//   target_j_val = reverse(120) = 21.
//   Is 21 in value_to_indices? Yes. Indices are [0].
//   `indices_of_target = [0]`.
//   We need to find `j` in `[0]` such that `j > i` (which is 1).
//   Is there any `j` in `[0]` such that `j > 1`? No.
//
// Loop ends. `min_dist` is still `Infinity`. Return -1.
// THIS MATCHES EXAMPLE 3.
//
// So the issue was that my previous algorithm was checking `reverse(nums[i]) == nums[prev_idx]` where `prev_idx < i`. The problem requires `reverse(nums[i]) == nums[j]` where `i < j`.
//
// The approach with `value_to_indices` map seems correct.
//
// Time complexity of this `value_to_indices` approach:
// - Populating map: O(n * log(max_val)) for reverse, O(n) for map insertions. Total O(n * log(max_val)).
// - Second loop: Iterate `i` from 0 to n-1. O(n).
//   - Reverse: O(log(max_val)).
//   - Map lookup: O(1) average.
//   - Iterating through `indices_of_target`: In the worst case, a single value can appear many times. For example, `nums = [1, 1, 1, ..., 1]`. If `reverse(1)` is `1`, and we are looking for `j > i`, we might scan a large list.
//   - If `nums = [12, 21, 12, 21, 12, 21, ...]`, and `target_j_val = 21`. The list for 21 could be `[1, 3, 5, ...]`.
//   - For a given `i`, finding the smallest `j > i` in `indices_of_target` can be done efficiently. If we iterate through `indices_of_target`, the *first* element `j_candidate` that is `> i` is the one we need.
//   - The total number of index entries across all lists in `value_to_indices` is `n`.
//   - If we iterate through `indices_of_target` linearly, it might be `O(n^2)` in worst case.
//   - However, if we think about the total work done for the inner loop across all `i`: each index `j` is only considered as a potential `j` for `i` values that come before it.
//   - More precisely, for a given `target_j_val`, let its indices be `[idx_1, idx_2, ..., idx_m]`.
//     When we process `i=0`, we check `idx_1, idx_2, ...` for `> 0`.
//     When we process `i=1`, we check `idx_1, idx_2, ...` for `> 1`.
//     ...
//     This is still not clearly O(n * log(max_val)).
//
// Optimized search for `j > i`:
// Since `indices_of_target` is sorted, we can use binary search to find the *first index* `k` such that `indices_of_target[k] > i`.
// The `lower_bound` concept from C++ STL. In JavaScript, we can implement this manually or use `findIndex` and then check the index.
//
// `findIndex` example:
// `const k = indices_of_target.findIndex(idx => idx > i);`
// If `k !== -1`, then `j = indices_of_target[k]`, distance is `j - i`.
// The `findIndex` operation takes O(length of array) in worst case.
//
// Let's consider the total work if we use binary search.
// Building map: O(n * log(max_val))
// Iterating `i`: O(n)
//   Reverse: O(log(max_val))
//   Map lookup: O(1)
//   Binary search on `indices_of_target`: If the list has `m` elements, it's `O(log m)`.
//   The length `m` can be up to `n`. So, `O(log n)`.
// Total time complexity: O(n * log(max_val) + n * log(max_val) + n * log n) = O(n * (log(max_val) + log n)).
// Since `log(max_val)` is relatively small (around 9-10 for 10^9) and `n` can be up to 10^5, `log n` can be around 17.
// So, `O(n * log n)` dominates.
//
// Space Complexity: O(n) for the map.
//
// This seems like a robust approach.
//
// The `reverse` function:
const reverse = (num) => {
    const reversedString = String(num).split('').reverse().join('');
    return Number(reversedString); // Use Number for potentially cleaner conversion than parseInt
};
//
// Implementation details:
// Need to handle `min_dist = Infinity` case for returning -1.
// Initialize `min_dist = Number.MAX_SAFE_INTEGER` or `Infinity`.
//
// ```javascript
// /**
//  * @param {number[]} nums
//  * @return {number}
//  */
// const minAbsoluteDistance = function(nums) {
//     // Helper function to reverse the digits of an integer.
//     // Leading zeros are omitted after reversing, e.g., reverse(120) = 21.
//     const reverse = (num) => {
//         const reversedString = String(num).split('').reverse().join('');
//         return Number(reversedString);
//     };
//
//     // Map to store value -> array of indices where that value appears.
//     // This helps in finding indices `j` efficiently later.
//     const valueToIndices = {};
//     for (let idx = 0; idx < nums.length; idx++) {
//         const val = nums[idx];
//         if (!valueToIndices[val]) {
//             valueToIndices[val] = [];
//         }
//         valueToIndices[val].push(idx);
//     }
//
//     let minDistance = Infinity; // Initialize minimum distance to a very large value.
//
//     // Iterate through the array to find potential 'i' in a mirror pair (i, j).
//     for (let i = 0; i < nums.length; i++) {
//         const numI = nums[i];
//         // Calculate the target value for nums[j] if nums[i] is the first element of the pair.
//         const targetJValue = reverse(numI);
//
//         // Check if this target value exists in our map.
//         if (valueToIndices[targetJValue]) {
//             const indicesOfTarget = valueToIndices[targetJValue];
//
//             // We need to find an index `j` in `indicesOfTarget` such that `j > i`.
//             // Since `indicesOfTarget` is sorted, we can efficiently find the smallest `j > i`.
//             // We can use a binary search approach (like lower_bound) or a linear scan.
//             // A linear scan within the relevant part of the sorted indices is efficient enough.
//             // The `findIndex` method can be used to find the first element satisfying the condition.
//             const indexOfJ = indicesOfTarget.findIndex(j => j > i);
//
//             // If such a `j` is found:
//             if (indexOfJ !== -1) {
//                 const j = indicesOfTarget[indexOfJ];
//                 const currentDistance = j - i; // Absolute distance as j > i.
//                 minDistance = Math.min(minDistance, currentDistance);
//             }
//         }
//     }
//
//     // If minDistance is still Infinity, it means no mirror pair was found.
//     return minDistance === Infinity ? -1 : minDistance;
// };
// ```
//
// Let's consider the `findIndex` part.
// If `indicesOfTarget = [0, 5, 10, 15]` and `i = 6`.
// `findIndex(j => j > 6)`:
// - j = 0: 0 > 6? No.
// - j = 5: 5 > 6? No.
// - j = 10: 10 > 6? Yes. `findIndex` returns index 2 (the index within `indicesOfTarget` array).
// `j = indicesOfTarget[2]` which is 10. Distance = 10 - 6 = 4.
// This linear scan within `findIndex` for each `i` and each `targetJValue` can indeed lead to O(N^2) in worst case if the lists are long.
//
// Example worst case for O(N^2):
// `nums = [12, 21, 12, 21, 12, 21, ..., 12, 21]` (n/2 pairs of 12 and 21)
// `valueToIndices` will be `{ 12: [0, 2, 4, ...], 21: [1, 3, 5, ...] }`.
//
// Iterate `i` from 0 to n-1.
// Suppose `nums[i] = 12`. `reverse(12) = 21`.
// `targetJValue = 21`. `indicesOfTarget = [1, 3, 5, ...]`.
//
// If `i = 0` (value 12), we look for `j > 0`. `findIndex` on `[1, 3, 5, ...]` finds `j=1`. Distance 1.
// If `i = 1` (value 21), `reverse(21) = 12`. `targetJValue = 12`. `indicesOfTarget = [0, 2, 4, ...]`. We look for `j > 1`. `findIndex` finds `j=2`. Distance 1.
// If `i = 2` (value 12), `reverse(12) = 21`. `targetJValue = 21`. `indicesOfTarget = [1, 3, 5, ...]`. We look for `j > 2`. `findIndex` finds `j=3`. Distance 1.
//
// This example seems efficient.
//
// Consider `nums = [1, 1, ..., 1]` (n times).
// `valueToIndices = { 1: [0, 1, 2, ..., n-1] }`.
//
// Iterate `i`.
// `numI = 1`. `reverse(1) = 1`. `targetJValue = 1`.
// `indicesOfTarget = [0, 1, 2, ..., n-1]`.
//
// If `i = 0`: find `j > 0` in `[0, 1, ...]`. `findIndex` finds `j=1`. Distance 1. `minDist = 1`.
// If `i = 1`: find `j > 1` in `[0, 1, ...]`. `findIndex` finds `j=2`. Distance 1. `minDist = 1`.
// ...
// This still seems O(n * log(max_val) + n * log n) if `findIndex` is optimized.
//
// If `findIndex` is truly O(length of array), then the total time for the second loop is Sum(length of `indicesOfTarget` for values seen) which is O(N^2).
//
// To guarantee O(n log n), we need binary search for finding `j`.
//
// JavaScript's `Array.prototype.findIndex` does a linear scan.
// We can implement binary search to find the first element greater than `i`.
//
// ```javascript
// // Helper function for binary search to find the smallest index k such that arr[k] > target.
// // Returns the index in arr, or -1 if no such element exists.
// const findFirstGreaterThan = (arr, target) => {
//     let low = 0;
//     let high = arr.length - 1;
//     let ans = -1; // Default to -1 if no element found
//
//     while (low <= high) {
//         const mid = Math.floor((low + high) / 2);
//         if (arr[mid] > target) {
//             ans = mid; // Found a candidate, try to find an earlier one
//             high = mid - 1;
//         } else {
//             // arr[mid] <= target, so we need to look in the right half
//             low = mid + 1;
//         }
//     }
//     return ans;
// };
// ```
//
// Now replace `indicesOfTarget.findIndex(j => j > i)` with `findFirstGreaterThan(indicesOfTarget, i)`.
//
// This binary search approach should give the O(n * (log(max_val) + log n)) time complexity.
//
// Let's think about the constraint `1 <= nums[i] <= 10^9`.
// This means `nums[i]` is always positive.
// `reverse(nums[i])` will also be positive.
//
// Consider constraints on `nums.length <= 10^5`.
// `O(n log n)` is acceptable. `10^5 * log(10^5)` is approx `10^5 * 17`, which is around `1.7 * 10^6` operations, well within typical time limits (around `10^8` ops/sec).
//
// The problem uses "mirror pair". The logic seems to correctly implement the definition.
//
// One edge case: What if `nums[i]` is a palindrome, e.g., 33?
// `nums = [33, 45, 33]`
// `valueToIndices = { 33: [0, 2], 45: [1] }`
//
// `i = 0`, `nums[0] = 33`. `reverse(33) = 33`. `targetJValue = 33`.
// `indicesOfTarget = [0, 2]`.
// Find `j > i` (i.e., `j > 0`) in `[0, 2]`.
// `findFirstGreaterThan([0, 2], 0)`:
//   mid = 1, arr[1]=2. 2 > 0. ans = 1, high = 0.
//   low = 0, high = 0. mid = 0, arr[0]=0. 0 > 0? No. low = 1.
//   low = 1, high = 0. Loop ends. Returns ans = 1.
// `j = indicesOfTarget[1] = 2`.
// `distance = j - i = 2 - 0 = 2`. `minDistance = 2`.
//
// `i = 1`, `nums[1] = 45`. `reverse(45) = 54`. `targetJValue = 54`.
// `54` is not in `valueToIndices`. Nothing happens.
//
// `i = 2`, `nums[2] = 33`. `reverse(33) = 33`. `targetJValue = 33`.
// `indicesOfTarget = [0, 2]`.
// Find `j > i` (i.e., `j > 2`) in `[0, 2]`.
// `findFirstGreaterThan([0, 2], 2)`:
//   mid = 1, arr[1]=2. 2 > 2? No. low = 2.
//   low = 2, high = 1. Loop ends. Returns ans = -1.
// No `j > i` found.
//
// Final `minDistance = 2`. Correct for this case.
//
// The implementation should be correct with the binary search.
//
// Final check on variable names and clarity.
// `valueToIndices` is good.
// `numI` is okay.
// `targetJValue` is descriptive.
// `indicesOfTarget` is good.
// `findFirstGreaterThan` is descriptive.
// `minDistance` is good.
// `ans` in binary search is standard.
//
// Code structure:
// 1. Header comment block.
// 2. `reverse` helper function.
// 3. `findFirstGreaterThan` helper function.
// 4. Main `minAbsoluteDistance` function.
//    a. Initialize map.
//    b. Populate map (first pass).
//    c. Initialize `minDistance`.
//    d. Loop through `i` (second pass).
//       i. Calculate `targetJValue`.
//       ii. Check if `targetJValue` is in map.
//       iii. If yes, get `indicesOfTarget`.
//       iv. Use `findFirstGreaterThan` to find `j > i`.
//       v. If `j` found, update `minDistance`.
//    e. Return result.
//
// This structure looks good.
//
// One minor optimization on binary search: The `ans` variable is actually unnecessary if `low` is used correctly.
// If we want the first element strictly greater than `target`:
//
// ```javascript
// const findFirstGreaterThan = (arr, target) => {
//     let low = 0;
//     let high = arr.length; // Use arr.length for upper bound for insertion point logic
//
//     while (low < high) {
//         const mid = Math.floor((low + high) / 2);
//         if (arr[mid] <= target) { // If element is not greater than target, search in right half
//             low = mid + 1;
//         } else { // arr[mid] > target, this could be our answer, try to find an earlier one in the left half
//             high = mid;
//         }
//     }
//     // At the end, `low` is the index of the first element greater than `target`,
//     // or `arr.length` if no such element exists.
//     return low === arr.length ? -1 : low; // Return index or -1 if out of bounds
// };
// ```
//
// Example: `arr = [0, 2]`, `target = 0`
// low=0, high=2
// mid=1, arr[1]=2. 2 > 0. high=1.
// low=0, high=1
// mid=0, arr[0]=0. 0 <= 0. low=1.
// low=1, high=1. Loop ends.
// return low (1) === arr.length (2) ? -1 : 1. Returns 1. Correct.
//
// Example: `arr = [0, 2]`, `target = 2`
// low=0, high=2
// mid=1, arr[1]=2. 2 <= 2. low=2.
// low=2, high=2. Loop ends.
// return low (2) === arr.length (2) ? -1 : 2. Returns -1. Correct.
//
// This binary search variant is more standard for finding the "insertion point" or first element meeting a condition.
// This looks good.

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
// Problem: Minimum Absolute Distance Between Mirror Pairs
// Link: https://leetcode.com/problems/minimum-absolute-distance-between-mirror-pairs/
//
// Approach:
// We are looking for a pair of indices (i, j) such that 0 <= i < j < nums.length and reverse(nums[i]) == nums[j].
// We need to find the minimum absolute distance |i - j| among all such pairs.
//
// To solve this efficiently, we can use a hash map to store the occurrences of each number and their indices.
//
// 1. Preprocessing: Build a map `valueToIndices` where keys are the numbers from `nums` and values are arrays of indices where that number appears. This allows us to quickly find all occurrences of a specific number.
//    - Time complexity for this step: O(N * log(max_val)) where N is nums.length and max_val is the maximum value in nums. The log(max_val) comes from the reverse operation.
//    - Space complexity: O(N) in the worst case if all numbers are distinct.
//
// 2. Finding Mirror Pairs: Iterate through the array with index `i`. For each `nums[i]`:
//    a. Calculate `targetJValue = reverse(nums[i])`. This is the value we are looking for at index `j`.
//    b. Check if `targetJValue` exists as a key in `valueToIndices`.
//    c. If `targetJValue` exists, retrieve its list of indices (`indicesOfTarget`).
//    d. We need to find an index `j` in `indicesOfTarget` such that `j > i`. Since `indicesOfTarget` is sorted (because we populated it by iterating from left to right), we can efficiently find the smallest `j` that is greater than `i` using binary search.
//    e. If such a `j` is found, calculate the distance `j - i` and update `minDistance` if this is smaller than the current minimum.
//
//    - Time complexity for this step:
//      - The outer loop runs N times.
//      - Inside the loop:
//        - Reversing `nums[i]` takes O(log(max_val)).
//        - Map lookup is O(1) on average.
//        - Binary search on `indicesOfTarget` takes O(log K) where K is the number of occurrences of `targetJValue`. In the worst case, K can be N. So, O(log N).
//      - Total time for this step is O(N * (log(max_val) + log N)).
//
// Overall Time Complexity: O(N * (log(max_val) + log N)). Given constraints, this is dominated by O(N log N).
// Overall Space Complexity: O(N) for the hash map.
//
// If no mirror pair is found, `minDistance` will remain `Infinity`, and we return -1.
//
// Helper Function: `reverse(num)`
// Converts the number to a string, reverses the string, and converts it back to a number.
// Example: reverse(120) = 21.
//
// Helper Function: `findFirstGreaterThan(arr, target)`
// Performs binary search on a sorted array `arr` to find the index of the first element strictly greater than `target`.
// Returns the index, or -1 if no such element exists. This ensures we find the smallest `j` such that `j > i`.
//
/**
 * Reverses the digits of an integer.
 * Leading zeros are omitted after reversing, e.g., reverse(120) = 21.
 * @param {number} num The integer to reverse.
 * @returns {number} The reversed integer.
 */
const reverse = (num) => {
    // Convert number to string, split into characters, reverse, and join back.
    const reversedString = String(num).split('').reverse().join('');
    // Convert the reversed string back to a number.
    // Number() handles potential leading zeros correctly (e.g., "021" becomes 21).
    return Number(reversedString);
};

/**
 * Performs binary search on a sorted array to find the index of the first element
 * strictly greater than the target.
 * @param {number[]} arr The sorted array to search within.
 * @param {number} target The value to compare against.
 * @returns {number} The index of the first element > target, or -1 if none found.
 */
const findFirstGreaterThan = (arr, target) => {
    let low = 0;
    // Set high to arr.length to allow finding an insertion point at the end.
    let high = arr.length;

    // Binary search loop.
    while (low < high) {
        // Calculate mid point, ensuring it's an integer.
        const mid = Math.floor((low + high) / 2);

        // If the element at mid is less than or equal to the target,
        // it means the first element greater than target must be in the right half.
        if (arr[mid] <= target) {
            low = mid + 1;
        } else {
            // If arr[mid] is greater than the target, this element is a potential candidate.
            // We try to find an even earlier element in the left half.
            high = mid;
        }
    }

    // After the loop, 'low' points to the index of the first element greater than 'target'.
    // If 'low' is equal to arr.length, it means no such element was found within the array bounds.
    return low === arr.length ? -1 : low;
};

/**
 * Finds the minimum absolute distance between the indices of any mirror pair in the array.
 * A mirror pair (i, j) satisfies 0 <= i < j < nums.length and reverse(nums[i]) == nums[j].
 * @param {number[]} nums The input array of integers.
 * @return {number} The minimum absolute distance, or -1 if no mirror pair exists.
 */
const minAbsoluteDistance = function(nums) {
    // Map to store number -> array of indices where that number appears.
    // Example: { 12: [0, 2], 21: [1, 3] }
    const valueToIndices = {};

    // First pass: Populate the valueToIndices map.
    // This allows us to quickly find all indices for any given number.
    for (let idx = 0; idx < nums.length; idx++) {
        const val = nums[idx];
        // If the value is not yet a key in the map, initialize it with an empty array.
        if (!valueToIndices[val]) {
            valueToIndices[val] = [];
        }
        // Add the current index to the list of indices for this value.
        valueToIndices[val].push(idx);
    }

    // Initialize minDistance to Infinity. If no pair is found, this will remain Infinity.
    let minDistance = Infinity;

    // Second pass: Iterate through the array to find potential 'i' in a mirror pair (i, j).
    // For each nums[i], we calculate its reverse and look for that reversed value at an index j > i.
    for (let i = 0; i < nums.length; i++) {
        const numI = nums[i]; // The current number, which could be nums[i] in a pair (i, j).

        // Calculate the value that nums[j] should have if nums[i] is the first element of a mirror pair.
        const targetJValue = reverse(numI);

        // Check if the calculated targetJValue exists in our map.
        // If it does, it means there are numbers in `nums` that are equal to `targetJValue`.
        if (valueToIndices[targetJValue]) {
            // Get the list of all indices where targetJValue appears.
            const indicesOfTarget = valueToIndices[targetJValue];

            // We need to find an index `j` from `indicesOfTarget` such that `j > i`.
            // Since `indicesOfTarget` is sorted, we use binary search to find the first `j` greater than `i`.
            const indexOfJInList = findFirstGreaterThan(indicesOfTarget, i);

            // If `findFirstGreaterThan` returned a valid index (not -1):
            if (indexOfJInList !== -1) {
                // Get the actual index `j` in the original `nums` array.
                const j = indicesOfTarget[indexOfJInList];
                // Calculate the absolute distance. Since j > i, it's simply j - i.
                const currentDistance = j - i;
                // Update `minDistance` if the current distance is smaller.
                minDistance = Math.min(minDistance, currentDistance);
            }
        }
    }

    // If `minDistance` is still Infinity, it means no mirror pair was found in the array.
    // In this case, return -1. Otherwise, return the calculated minimum distance.
    return minDistance === Infinity ? -1 : minDistance;
};
```