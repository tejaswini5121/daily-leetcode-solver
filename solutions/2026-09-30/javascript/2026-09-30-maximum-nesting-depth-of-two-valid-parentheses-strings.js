/**
 * Problem Summary:
 * Given a Valid Parentheses String (VPS) `seq`, split it into two disjoint subsequences A and B,
 * such that both A and B are VPSs, and the maximum of their nesting depths (max(depth(A), depth(B)))
 * is minimized. Return an array indicating which subsequence each character of `seq` belongs to (0 for A, 1 for B).
 *
 * Problem Link:
 * https://leetcode.com/problems/maximum-nesting-depth-of-two-valid-parentheses-strings/
 *
 * Approach Explanation:
 * The key idea is to distribute the parentheses to A and B such that the nesting depth in each
 * subsequence is minimized. We observe that when we encounter an opening parenthesis '(',
 * the current nesting depth increases. When we encounter a closing parenthesis ')', the current
 * nesting depth decreases.
 *
 * To minimize the maximum depth, we can try to "alternate" which subsequence gets the parentheses
 * based on the current nesting depth.
 *
 * Consider the current nesting depth `d` as we iterate through `seq`.
 * When `seq[i]` is '(':
 *   The nesting depth `d` increases by 1. We want to assign this '(' to either A or B.
 *   If we assign it to A, the depth of A increases. If to B, the depth of B increases.
 *   To keep depths balanced, we can assign it to A if `d` is even, and to B if `d` is odd (or vice versa).
 *   After assigning, the *current* depth for the next character will be `d+1`.
 *   So, we assign based on `d` *before* incrementing.
 *   Specifically, for `seq[i] == '('`, assign to `d % 2`. Then increment `d`.
 *
 * When `seq[i]` is ')':
 *   The nesting depth `d` decreases by 1. We want to assign this ')' to either A or B.
 *   It should correspond to an opening parenthesis that was assigned to the same subsequence.
 *   To maintain the alternating pattern and ensure balance, we assign based on the *new* depth `d-1`.
 *   Specifically, for `seq[i] == ')'`, decrement `d`. Then assign to `d % 2`.
 *
 * Let's trace with an example: "(()())"
 * Initialize `depth = 0`, `result = []`
 *
 * i = 0, seq[0] = '('
 *   Current depth is 0. 0 % 2 = 0. Assign to A. `result[0] = 0`.
 *   Increment depth. `depth = 1`.
 *
 * i = 1, seq[1] = '('
 *   Current depth is 1. 1 % 2 = 1. Assign to B. `result[1] = 1`.
 *   Increment depth. `depth = 2`.
 *
 * i = 2, seq[2] = ')'
 *   Decrement depth. `depth = 1`.
 *   Current depth is 1. 1 % 2 = 1. Assign to B. `result[2] = 1`.
 *
 * i = 3, seq[3] = '('
 *   Current depth is 1. 1 % 2 = 1. Assign to B. `result[3] = 1`.
 *   Increment depth. `depth = 2`.
 *
 * i = 4, seq[4] = ')'
 *   Decrement depth. `depth = 1`.
 *   Current depth is 1. 1 % 2 = 1. Assign to B. `result[4] = 1`.
 *
 * i = 5, seq[5] = ')'
 *   Decrement depth. `depth = 0`.
 *   Current depth is 0. 0 % 2 = 0. Assign to A. `result[5] = 0`.
 *
 * Final `result`: [0, 1, 1, 1, 1, 0]
 * This matches Example 1.
 *
 * Why does this work?
 * Each `(` increments the current "global" depth. Each `)` decrements it.
 * By assigning based on `depth % 2`, we are essentially trying to give characters at
 * even depths to one subsequence (e.g., A) and characters at odd depths to the other (e.g., B).
 *
 * Consider a pair `( ... )` at global depth `d`.
 * The opening `(` is at global depth `d-1` (just before it's processed, it makes the depth `d`).
 * So, `result[i_open] = (d-1) % 2`.
 * The closing `)` is at global depth `d-1` (just after it's processed, the depth becomes `d-1`).
 * So, `result[i_close] = (d-1) % 2`.
 * This ensures that corresponding `(` and `)` are assigned to the same subsequence, forming valid pairs.
 * The maximum depth in A will be `ceil(max_total_depth / 2)` and in B will be `floor(max_total_depth / 2)`,
 * or vice-versa depending on the parity choice. This evenly distributes the depth.
 * This strategy guarantees that the maximum depth for A and B will be `ceil(max_overall_depth / 2)`.
 *
 * Time Complexity:
 * O(N), where N is the length of `seq`. We iterate through the string once.
 *
 * Space Complexity:
 * O(N), where N is the length of `seq`. We store the result array of the same length as `seq`.
 */
var maxDepthAfterSplit = function(seq) {
    let depth = 0; // Initialize current nesting depth
    const result = new Array(seq.length); // Array to store the assignment (0 for A, 1 for B)

    // Iterate through each character of the input sequence
    for (let i = 0; i < seq.length; i++) {
        if (seq[i] === '(') {
            // For an opening parenthesis, assign it to the subsequence
            // determined by the current depth's parity.
            // Then, increment the depth as we are going one level deeper.
            result[i] = depth % 2;
            depth++;
        } else { // seq[i] === ')'
            // For a closing parenthesis, first decrement the depth
            // as we are coming out of a nested level.
            // Then, assign it to the subsequence determined by the new (decremented) depth's parity.
            depth--;
            result[i] = depth % 2;
        }
    }

    return result; // Return the array of assignments
};