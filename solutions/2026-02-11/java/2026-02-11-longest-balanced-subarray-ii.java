```java
import java.util.HashMap;
import java.util.Map;

/**
 * Problem Summary: Find the longest subarray where the count of distinct even numbers equals the count of distinct odd numbers.
 * Link: https://leetcode.com/problems/longest-balanced-subarray-ii/
 *
 * Approach:
 * This problem can be rephrased as finding the longest subarray where the difference between the count of distinct even numbers
 * and the count of distinct odd numbers is zero. We can use a prefix sum-like approach by transforming the problem into calculating
 * the difference between the number of distinct even numbers and distinct odd numbers encountered so far.
 *
 * We can maintain two sets, one for even numbers and one for odd numbers, to track distinct elements within a sliding window or a prefix.
 * However, tracking distinct counts directly for all possible subarrays would be O(n^3) or O(n^2).
 *
 * A more efficient approach involves a transformation and the use of a hash map to store prefix differences.
 * For each element `num` in `nums`:
 * - If `num` is even, it contributes +1 to the "even distinct count difference".
 * - If `num` is odd, it contributes -1 to the "even distinct count difference".
 *
 * The challenge is that the "distinct" nature requires tracking which numbers have been seen before. If a number reappears,
 * it doesn't change the *distinct* count.
 *
 * Let's refine the prefix sum idea. We can think about the *change* in the difference of distinct even and odd counts.
 *
 * Consider `diff = distinct_even_count - distinct_odd_count`. We want to find the longest subarray `nums[i...j]` such that
 * the `diff` within this subarray is 0.
 *
 * This is equivalent to finding `i` and `j` such that `prefix_diff[j] - prefix_diff[i-1] = 0`, where `prefix_diff` represents
 * the cumulative difference up to an index.
 *
 * The "distinct" part makes a simple prefix sum on +/- 1 not work directly. We need to handle the first occurrence of each number.
 *
 * Let's use a hash map `map` to store `(prefix_difference, first_occurrence_index)`.
 *
 * We iterate through `nums`. For each number `nums[k]`:
 * 1. We need to know the distinct even and odd numbers encountered *up to index k*.
 * 2. We can use two `HashSet`s: `seenEven` and `seenOdd`.
 * 3. `currentEvenDistinct = seenEven.size()`, `currentOddDistinct = seenOdd.size()`.
 * 4. `currentDiff = currentEvenDistinct - currentOddDistinct`.
 *
 * Now, we need to find an earlier index `i-1` such that the difference accumulated from `i` to `k` is zero.
 * This means `(distinct_even_count[k] - distinct_odd_count[k]) - (distinct_even_count[i-1] - distinct_odd_count[i-1]) = 0`.
 *
 * The issue is that `distinct_even_count[i-1]` and `distinct_odd_count[i-1]` depend on the specific numbers seen before `i-1`.
 *
 * The core idea of using a hash map with prefix sums usually works when the *value* added at each step is fixed or depends only on the current element. Here, the contribution depends on whether a number is *newly* distinct.
 *
 * Let's reconsider the problem transformation.
 * If `nums[k]` is even, it *potentially* increases `distinct_even_count`.
 * If `nums[k]` is odd, it *potentially* increases `distinct_odd_count`.
 *
 * The key is to identify the first occurrence of each distinct number.
 *
 * We can iterate through the array and maintain the current count of distinct even and odd numbers.
 * For `nums[i]`:
 * - If `nums[i]` is even and not seen before in the *current* consideration window, increment `current_distinct_even`.
 * - If `nums[i]` is odd and not seen before in the *current* consideration window, increment `current_distinct_odd`.
 *
 * The problem is that "current consideration window" is what we are trying to find.
 *
 * The standard solution for problems like "longest subarray with sum K" uses a hash map to store `(prefix_sum, index)`.
 * We are looking for `prefix_diff[j] == prefix_diff[i-1]`.
 *
 * Let's define a "score" for each number.
 * If `num` is even: score = 1
 * If `num` is odd: score = -1
 *
 * We want a subarray `nums[i..j]` such that the number of *distinct* evens equals the number of *distinct* odds.
 *
 * Consider a simplified version: if we just cared about the total count of evens and odds, then `prefix_even_count[j] - prefix_even_count[i-1] == prefix_odd_count[j] - prefix_odd_count[i-1]`.
 * This would lead to `(prefix_even_count - prefix_odd_count)[j] == (prefix_even_count - prefix_odd_count)[i-1]`.
 *
 * The "distinct" constraint is what makes this hard. If `nums[k]` is an even number that has already appeared, it doesn't change the distinct even count.
 *
 * Let's try to map the state to a value.
 * State: `(number_of_distinct_even, number_of_distinct_odd)`. We want this state to be `(X, X)`.
 *
 * We can process the array from left to right. For each `i`, we want to find the largest `j < i` such that `nums[j+1...i]` is balanced.
 *
 * This problem seems to be a variation of "Longest Subarray With Equal Number of 0s and 1s", where we treat 0s as evens and 1s as odds, but with the added complexity of "distinct".
 *
 * The standard technique for "Longest Subarray With Equal Number of X and Y" is:
 * Transform X to 1 and Y to -1. Find the longest subarray with sum 0. This means finding `i, j` such that `prefix_sum[j] - prefix_sum[i-1] == 0`.
 * Use a hash map: `map[prefix_sum] = index`. If `current_prefix_sum` is seen before at `prev_index`, then the subarray from `prev_index + 1` to `current_index` has sum 0.
 *
 * How to adapt this for "distinct"?
 *
 * Let's map each distinct even number to a unique identifier (e.g., its value or a new index).
 * Let's map each distinct odd number to a unique identifier.
 *
 * Instead of simply adding +1 or -1, we are essentially tracking the *set* of distinct evens and odds.
 *
 * The crucial insight for this "Hard" problem is likely how to represent the "distinct count difference" in a way that allows for prefix sum calculations.
 *
 * Consider the properties:
 * - When a new distinct even number appears, `distinct_even_count` increases by 1.
 * - When a new distinct odd number appears, `distinct_odd_count` increases by 1.
 * - When a non-distinct even/odd number appears, the counts don't change.
 *
 * Let `diff = distinct_even_count - distinct_odd_count`.
 * We are looking for a subarray `nums[i...j]` such that the change in `diff` within this subarray is 0.
 *
 * This means `diff_at_j - diff_at_i-1 = 0`.
 *
 * The problem is that `diff_at_k` depends on the *entire prefix* `nums[0...k]` and the distinct elements within it.
 *
 * Let's consider the distinct elements seen so far.
 * `seenEven = {e1, e2, ...}`
 * `seenOdd = {o1, o2, ...}`
 *
 * `diff_k = |seenEven| - |seenOdd|`
 *
 * If we are at index `k` and encounter `nums[k]`:
 * - If `nums[k]` is even and `nums[k]` is not in `seenEven`: `seenEven.add(nums[k])`. `diff_k = diff_{k-1} + 1`.
 * - If `nums[k]` is odd and `nums[k]` is not in `seenOdd`: `seenOdd.add(nums[k])`. `diff_k = diff_{k-1} - 1`.
 * - Otherwise (number already seen or parity doesn't add new distinct element): `diff_k = diff_{k-1}`.
 *
 * This `diff_k` is the prefix difference of distinct counts.
 * We need to find `i-1` such that `diff_k == diff_{i-1}`.
 *
 * We can use a `HashMap<Integer, Integer>` where the key is the `prefix_diff` and the value is the *first index* where that `prefix_diff` was encountered.
 *
 * Initialize `map.put(0, -1)` to handle the case where the balanced subarray starts from index 0.
 * `maxLength = 0`
 * `distinctEvenCount = 0`
 * `distinctOddCount = 0`
 * `seenEven = new HashSet<>()`
 * `seenOdd = new HashSet<>()`
 *
 * Iterate `k` from `0` to `nums.length - 1`:
 *   `num = nums[k]`
 *   `isNewEven = false`
 *   `isNewOdd = false`
 *
 *   If `num % 2 == 0`: // Even number
 *     If `seenEven.add(num)`: // If it's a new distinct even number
 *       `distinctEvenCount++`
 *       `isNewEven = true`
 *   Else: // Odd number
 *     If `seenOdd.add(num)`: // If it's a new distinct odd number
 *       `distinctOddCount++`
 *       `isNewOdd = true`
 *
 *   `currentDiff = distinctEvenCount - distinctOddCount`
 *
 *   If `map.containsKey(currentDiff)`:
 *     // We found a previous index `prevIndex = map.get(currentDiff)` where the prefix difference was the same.
 *     // This means the subarray `nums[prevIndex + 1 ... k]` has a difference of 0 in distinct counts.
 *     `maxLength = Math.max(maxLength, k - map.get(currentDiff))`
 *   Else:
 *     // This is the first time we are seeing this `currentDiff`. Store its index.
 *     `map.put(currentDiff, k)`
 *
 * This approach seems correct. The `seenEven` and `seenOdd` sets correctly track distinctness across the entire prefix being considered.
 * The `currentDiff` then represents the difference in distinct counts up to index `k`.
 * By storing `(currentDiff, k)` in the map, we are effectively looking for a previous state `(currentDiff, prev_k)` to find a subarray `nums[prev_k + 1 ... k]` that has a net change of 0 in `distinctEvenCount - distinctOddCount`.
 *
 * Time Complexity:
 * We iterate through the `nums` array once (O(n)).
 * Inside the loop:
 *   - `HashSet.add()` takes O(1) on average.
 *   - `HashMap.containsKey()` and `HashMap.put()` take O(1) on average.
 *
 * The maximum number of distinct even/odd numbers can be up to `n`. However, the values themselves are bounded by 10^5. If the values are very large and sparse, the `HashSet` operations are still O(1) on average.
 *
 * The constraints on `nums[i]` (<= 10^5) are relevant for the *values* in the sets, but not directly for the complexity of set operations themselves (which depend on hash distribution).
 *
 * Total Time Complexity: O(n) on average. In the worst case for hash collisions, it could degrade, but typically it's O(n).
 *
 * Space Complexity:
 * - `seenEven`: Stores distinct even numbers. In the worst case, all numbers could be distinct and even, up to O(n).
 * - `seenOdd`: Stores distinct odd numbers. In the worst case, up to O(n).
 * - `map`: Stores prefix differences. The number of possible prefix differences can be from `-n` to `n`, so up to O(n) entries.
 *
 * Total Space Complexity: O(n)
 */
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

class Solution {
    public int longestBalancedSubarray(int[] nums) {
        // Map to store the first occurrence of each prefix difference between distinct even and odd counts.
        // Key: prefix_difference (distinct_even_count - distinct_odd_count)
        // Value: index where this difference was first encountered.
        Map<Integer, Integer> prefixDiffMap = new HashMap<>();

        // Initialize the map with a difference of 0 at index -1.
        // This handles cases where the longest balanced subarray starts from the beginning of the array.
        prefixDiffMap.put(0, -1);

        // Sets to keep track of distinct even and odd numbers encountered so far.
        Set<Integer> seenEven = new HashSet<>();
        Set<Integer> seenOdd = new HashSet<>();

        // Variables to track the current count of distinct even and odd numbers.
        int distinctEvenCount = 0;
        int distinctOddCount = 0;

        // Variable to store the maximum length of a balanced subarray found.
        int maxLength = 0;

        // Iterate through the array from left to right.
        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];

            // Check if the number is even or odd and if it's a new distinct number.
            if (num % 2 == 0) { // Even number
                // If the number is newly added to the set of seen even numbers,
                // it means we have encountered a new distinct even number.
                if (seenEven.add(num)) {
                    distinctEvenCount++; // Increment the count of distinct even numbers.
                }
            } else { // Odd number
                // If the number is newly added to the set of seen odd numbers,
                // it means we have encountered a new distinct odd number.
                if (seenOdd.add(num)) {
                    distinctOddCount++; // Increment the count of distinct odd numbers.
                }
            }

            // Calculate the current difference between distinct even and odd counts.
            int currentDiff = distinctEvenCount - distinctOddCount;

            // If this `currentDiff` has been seen before:
            // This means the subarray between the previous occurrence of this `currentDiff`
            // and the current index `i` is balanced (i.e., the difference in distinct counts is zero for that subarray).
            if (prefixDiffMap.containsKey(currentDiff)) {
                // The length of this balanced subarray is `i - prefixDiffMap.get(currentDiff)`.
                // We update `maxLength` if this subarray is longer than any found so far.
                maxLength = Math.max(maxLength, i - prefixDiffMap.get(currentDiff));
            } else {
                // If this `currentDiff` is encountered for the first time,
                // store its index in the map. This index will be used later to calculate
                // the length of balanced subarrays ending at future indices.
                prefixDiffMap.put(currentDiff, i);
            }
        }

        // Return the maximum length of the longest balanced subarray found.
        return maxLength;
    }
}
```