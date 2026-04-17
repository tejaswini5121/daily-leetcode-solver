```java
import java.util.HashMap;
import java.util.Map;

/**
 * Problem: Minimum Absolute Distance Between Mirror Pairs
 * Link: https://leetcode.com/problems/minimum-absolute-distance-between-mirror-pairs/
 *
 * Approach:
 * The problem asks for the minimum absolute difference between indices of a "mirror pair".
 * A mirror pair (i, j) exists if reverse(nums[i]) == nums[j] and i < j.
 * To efficiently find mirror pairs, we can iterate through the array and for each number,
 * calculate its reversed version. We can use a hash map to store the first occurrence of
 * each number and its index.
 *
 * When we encounter a number `nums[j]`, we reverse it to get `reversed_nums_j`.
 * We then check if `reversed_nums_j` exists as a key in our hash map.
 * If it does, it means we have found a potential mirror pair where the previous occurrence
 * of `reversed_nums_j` was at index `i = map.get(reversed_nums_j)`.
 * The current index is `j`. If `i < j`, then `(i, j)` is a mirror pair.
 * We calculate the absolute distance `j - i` and update our minimum distance if this distance
 * is smaller than the current minimum.
 *
 * After checking for a mirror pair, we must store the current number `nums[j]` and its index `j`
 * in the hash map. This is crucial because a number might be the reversed version of a later number.
 * However, we only want to consider the *first* occurrence of a number when forming a mirror pair
 * with a later element. This ensures that `i < j` is naturally handled and we find the minimum
 * `j - i` for any `nums[i]`.
 *
 * If the hash map already contains `nums[j]`, we do *not* update its index. This is because we
 * are interested in the earliest possible `i` for any `j`. If `nums[j]` appeared earlier at index `i_prev`,
 * and we find `nums[k]` (where `k > j`) such that `reverse(nums[k]) == nums[j]`, the distance
 * `k - i_prev` will always be smaller than `k - j`. By keeping the earliest index, we guarantee
 * finding the minimum distance for each potential mirror.
 *
 * The `reverse` function needs to handle integers and remove leading zeros after reversal.
 *
 * Initialization:
 * - `minDistance` is initialized to `Integer.MAX_VALUE`.
 * - `numIndexMap`: A HashMap to store `number -> its_first_index`.
 *
 * Iteration:
 * For each `nums[j]` at index `j` from 0 to `nums.length - 1`:
 *   1. Calculate `reversedNum = reverse(nums[j])`.
 *   2. Check if `reversedNum` is a key in `numIndexMap`.
 *      If yes, let `i = numIndexMap.get(reversedNum)`.
 *      Calculate `currentDistance = j - i`.
 *      Update `minDistance = Math.min(minDistance, currentDistance)`.
 *   3. If `nums[j]` is NOT in `numIndexMap`, add it: `numIndexMap.put(nums[j], j)`.
 *
 * Final Result:
 * If `minDistance` is still `Integer.MAX_VALUE`, it means no mirror pair was found, so return -1.
 * Otherwise, return `minDistance`.
 *
 * Time Complexity:
 * O(N * L), where N is the length of `nums` and L is the maximum number of digits in any number in `nums`.
 * The `reverse` operation takes time proportional to the number of digits in the number.
 * Since numbers are up to 10^9, L is at most 10.
 * HashMap operations (put, get, containsKey) are O(1) on average.
 * So, the overall time complexity is dominated by iterating through the array and reversing numbers.
 *
 * Space Complexity:
 * O(N) in the worst case, for the HashMap, if all numbers in `nums` are distinct.
 * Each entry in the map stores an integer and its index.
 */
class Solution {

    /**
     * Reverses the digits of an integer. Leading zeros are omitted after reversing.
     * For example, reverse(120) returns 21.
     *
     * @param x The integer to reverse.
     * @return The reversed integer.
     */
    private int reverse(int x) {
        int reversed = 0;
        while (x != 0) {
            int digit = x % 10;
            reversed = reversed * 10 + digit;
            x /= 10;
        }
        return reversed;
    }

    public int minimumAbsoluteDistance(int[] nums) {
        // Initialize minimum distance to a very large value.
        int minDistance = Integer.MAX_VALUE;

        // Use a HashMap to store numbers and their first encountered index.
        // Key: the number itself.
        // Value: the index where this number was first seen in the array.
        Map<Integer, Integer> numIndexMap = new HashMap<>();

        // Iterate through the array. For each element nums[j] at index j:
        for (int j = 0; j < nums.length; j++) {
            int currentNum = nums[j];
            // Calculate the reversed version of the current number.
            int reversedNum = reverse(currentNum);

            // Check if the reversed number has been seen before.
            // If reversedNum is in the map, it means we have a potential mirror pair.
            // The key (reversedNum) corresponds to nums[i], and currentNum (nums[j]) is its reverse.
            if (numIndexMap.containsKey(reversedNum)) {
                // Get the index 'i' of the first occurrence of reversedNum.
                int i = numIndexMap.get(reversedNum);
                // Calculate the absolute distance between indices i and j.
                // Since we iterate from left to right, j will always be >= i.
                int currentDistance = j - i;
                // Update minDistance if the current distance is smaller.
                minDistance = Math.min(minDistance, currentDistance);
            }

            // Store the current number and its index IF this number has not been seen before.
            // We only store the *first* occurrence of a number because we want the smallest 'i'
            // for any 'j' to ensure the minimum absolute distance j - i.
            // If a number is already in the map, we don't update its index, preserving the earliest one.
            if (!numIndexMap.containsKey(currentNum)) {
                numIndexMap.put(currentNum, j);
            }
        }

        // If minDistance is still its initial large value, it means no mirror pair was found.
        // In this case, return -1. Otherwise, return the calculated minimum distance.
        return minDistance == Integer.MAX_VALUE ? -1 : minDistance;
    }
}
```