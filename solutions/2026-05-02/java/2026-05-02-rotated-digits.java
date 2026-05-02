```java
/**
 * Problem Summary:
 * Count numbers in a range [1, n] that are "good" after 180-degree digit rotation.
 * A good number becomes a valid, different number after rotating each digit.
 * Valid rotations: 0->0, 1->1, 8->8, 2->5, 5->2, 6->9, 9->6.
 * Invalid rotations: 3, 4, 7.
 *
 * Link: https://leetcode.com/problems/rotated-digits/
 *
 * Approach:
 * We can iterate through each number from 1 to n and check if it's a "good" number.
 * To check if a number is "good", we can convert it to a string, iterate through its digits,
 * and perform the rotation. We maintain two flags: `has_invalid_digit` and `has_rotated_digit`.
 * `has_invalid_digit` becomes true if any digit is 3, 4, or 7.
 * `has_rotated_digit` becomes true if any digit rotates to a different digit (2, 5, 6, 9).
 * A number is "good" if it does not have any invalid digits AND it has at least one digit that rotated to a different digit.
 * This ensures the rotated number is valid and different from the original.
 *
 * For optimization, we can use dynamic programming. Let dp[i] be the state of number i:
 * 0: invalid (contains 3, 4, 7)
 * 1: valid and remains the same (contains only 0, 1, 8)
 * 2: valid and changes (contains at least one of 2, 5, 6, 9, and no invalid digits)
 *
 * Base cases:
 * dp[0] = 1 (0 is valid and remains the same)
 *
 * Transitions:
 * For each digit `d` from 0 to 9:
 *   - If `d` is 2, 5, 6, 9: `rot_d = 2`
 *   - If `d` is 0, 1, 8: `rot_d = 1`
 *   - If `d` is 3, 4, 7: `rot_d = 0`
 *
 * To calculate dp[i]:
 * Let `prev_num = i / 10` and `last_digit = i % 10`.
 * Let `prev_state = dp[prev_num]` and `last_state = rot_map[last_digit]`.
 * If `prev_state == 0` or `last_state == 0`, then `dp[i] = 0`.
 * If `prev_state == 1` and `last_state == 1`, then `dp[i] = 1`.
 * If `prev_state == 1` and `last_state == 2`, then `dp[i] = 2`.
 * If `prev_state == 2` and `last_state == 1`, then `dp[i] = 2`.
 * If `prev_state == 2` and `last_state == 2`, then `dp[i] = 2`.
 *
 * The final answer is the count of numbers `i` in [1, n] where `dp[i] == 2`.
 *
 * Time Complexity Analysis:
 * The DP approach has a time complexity of O(n) because we iterate through each number from 1 to n once,
 * and for each number, we perform constant-time operations (division, modulo, array lookups).
 * The brute-force approach would be O(n * log10(n)) where log10(n) is the number of digits.
 *
 * Space Complexity Analysis:
 * The DP approach uses an array of size n+1 to store the states, so the space complexity is O(n).
 */
class Solution {
    // Mapping for rotated digits. 0: invalid, 1: same, 2: different.
    private static final int[] ROT_MAP = {1, 1, 2, 0, 0, 2, 2, 0, 1, 2};
    // dp[i] stores the state of number i:
    // 0: invalid (contains 3, 4, 7)
    // 1: valid and remains the same (contains only 0, 1, 8)
    // 2: valid and changes (contains at least one of 2, 5, 6, 9, and no invalid digits)
    private int[] dp;

    public int rotatedDigits(int n) {
        // Initialize DP array. Size n+1 to accommodate numbers up to n.
        dp = new int[n + 1];
        // dp[0] is a base case, representing the number 0, which is valid and stays the same.
        dp[0] = 1;

        int count = 0; // Counter for good numbers.

        // Iterate through each number from 1 to n.
        for (int i = 1; i <= n; i++) {
            // Get the previous number by removing the last digit.
            int prevNum = i / 10;
            // Get the last digit of the current number.
            int lastDigit = i % 10;

            // Get the state of the previous number from the DP array.
            int prevState = dp[prevNum];
            // Get the rotation state of the last digit.
            int lastState = ROT_MAP[lastDigit];

            // Calculate the state of the current number 'i' based on the states of the previous number and the last digit.

            // If either the previous number is invalid (state 0) or the last digit is invalid (state 0),
            // then the current number 'i' is also invalid.
            if (prevState == 0 || lastState == 0) {
                dp[i] = 0;
            }
            // If the previous number is valid and stays the same (state 1), AND the last digit is valid and stays the same (state 1),
            // then the current number 'i' is valid and stays the same.
            else if (prevState == 1 && lastState == 1) {
                dp[i] = 1;
            }
            // In all other cases where the number is valid (no invalid digits),
            // the rotated number will be different from the original. This happens if:
            // - Previous number stays the same (state 1) AND last digit rotates differently (state 2).
            // - Previous number rotates differently (state 2) AND last digit stays the same (state 1).
            // - Previous number rotates differently (state 2) AND last digit rotates differently (state 2).
            else {
                dp[i] = 2;
            }

            // If the state of the current number 'i' is 2, it means it's a "good" number
            // (valid and rotates to a different number). Increment the count.
            if (dp[i] == 2) {
                count++;
            }
        }

        // Return the total count of good numbers.
        return count;
    }
}
```