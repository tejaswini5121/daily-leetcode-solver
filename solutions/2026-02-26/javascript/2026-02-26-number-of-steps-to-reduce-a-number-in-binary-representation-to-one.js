/**
 * @summary Calculates the number of steps to reduce a binary number string to 1.
 * The number is reduced by dividing by 2 if even, and adding 1 if odd.
 * @link https://leetcode.com/problems/number-of-steps-to-reduce-a-number-in-binary-representation-to-one/
 *
 * @approach
 * We can simulate the process of reducing the binary string directly.
 * The key observation is how addition and division by 2 affect the binary string.
 *
 * 1. If the last bit is '0' (even number):
 *    Dividing by 2 is equivalent to right-shifting the binary string, effectively removing the last '0'.
 *    e.g., "1100" (12) -> "110" (6)
 *
 * 2. If the last bit is '1' (odd number):
 *    Adding 1 to an odd binary number results in carrying over.
 *    We find the rightmost '0', flip it to '1', and all subsequent '1's to '0's.
 *    If there's no '0' (e.g., "111"), we prepend a '1' and set all original bits to '0's.
 *    e.g., "1101" (13) -> add 1 -> "1110" (14)
 *          "111" (7) -> add 1 -> "1000" (8)
 *
 * We iterate through the string from right to left.
 * - If the current bit is '0', we can effectively divide by 2 by moving to the next bit (leftward). Increment step count.
 * - If the current bit is '1', we need to add 1. This requires a "carry".
 *   We flip the current '1' to a '0' and propagate the carry to the left. This "add 1" operation takes one step.
 *   Then, we treat the carry propagation similar to division by 2 if the carry results in a '0' at the next position.
 *
 * A more optimized approach can be to process from right to left without explicitly building new strings.
 * We can use a `carry` variable.
 * Iterate from the rightmost character:
 *   - If `s[i]` is '0' and `carry` is 0: The number is even. We effectively divide by 2. Move to `s[i-1]`. Increment step count.
 *   - If `s[i]` is '1' and `carry` is 0: The number is odd. We need to add 1. This takes 1 step. Set `carry` to 1. Now, this position conceptually becomes '0' due to the addition. We then effectively divide by 2. Move to `s[i-1]`. Increment step count.
 *   - If `s[i]` is '0' and `carry` is 1: The number is odd (0 + 1). We need to add 1. This takes 1 step. Set `carry` to 0. Now, this position conceptually becomes '1'. We then effectively divide by 2. Move to `s[i-1]`. Increment step count.
 *   - If `s[i]` is '1' and `carry` is 1: The number is even (1 + 1). We need to add 1. This takes 1 step. Set `carry` to 1. Now, this position conceptually becomes '0' due to the addition. We then effectively divide by 2. Move to `s[i-1]`. Increment step count.
 *
 * The loop continues until we reach the beginning of the string.
 * If after the loop, `carry` is still 1, it means we have a final '1' that needs to be reduced (which will require one more add 1 step if the conceptual number is odd and then it becomes even, effectively divided by 2). This final '1' reduction needs an additional step if carry is 1.
 *
 * Example: s = "1101"
 * i = 3 (rightmost '1'), carry = 0. Odd.
 *   steps = 1 (add 1). carry = 1. Current conceptual bit is '0'.
 * i = 2 ('0'), carry = 1. Odd (0+1).
 *   steps = 1 + 1 = 2. carry = 0. Current conceptual bit is '1'.
 * i = 1 ('1'), carry = 0. Odd.
 *   steps = 2 + 1 = 3. carry = 1. Current conceptual bit is '0'.
 * i = 0 ('1'), carry = 1. Even (1+1).
 *   steps = 3 + 1 = 4. carry = 1. Current conceptual bit is '0'.
 * End of loop. carry = 1. This remaining carry needs to be reduced.
 *   steps = 4 + 1 = 5 (for the conceptual '1' resulting from carry).
 * This simulation is a bit tricky to get right.

 * Let's simplify the logic:
 * We can treat the string as a mutable array of characters and perform operations.
 * Iterate while the string is not "1".
 * If the last character is '0': Remove it (divide by 2). Increment steps.
 * If the last character is '1':
 *   Find the rightmost '0'.
 *   If no '0' is found (e.g., "111"): Prepend '1', change all existing '1's to '0's.
 *   If a '0' is found at index `k`: Change `s[k]` to '1', and all characters `s[k+1]` onwards to '0'.
 *   Increment steps (for the add 1 operation).
 * This string manipulation can be slow due to array operations.

 * A better simulation using an array and pointer for the "end" of the number.
 * Convert string to array. Use `s.length - 1` as the rightmost index.
 * Iterate from right to left.
 * `steps = 0`
 * `carry = 0`
 * Loop from `i = s.length - 1` down to `0`:
 *   `digit = (s[i] - '0') + carry`
 *   If `digit % 2 === 0` (even):
 *     `carry = digit / 2` // For '0' -> 0, for '10' (2) -> 1
 *   Else (`digit % 2 === 1`) (odd):
 *     `steps++` // This is the 'add 1' operation
 *     `carry = (digit + 1) / 2` // For '1' -> 1, for '11' (3) -> 2
 *
 * After the loop, if `carry` is 1, we still need to account for the final reduction of '1'.
 * `steps += carry`
 *
 * Example: s = "1101"
 * Initial: steps = 0, carry = 0
 * i = 3: s[3] = '1'. digit = (1) + 0 = 1. Odd.
 *   steps = 1. carry = (1 + 1) / 2 = 1.
 * i = 2: s[2] = '0'. digit = (0) + 1 = 1. Odd.
 *   steps = 1 + 1 = 2. carry = (1 + 1) / 2 = 1.
 * i = 1: s[1] = '1'. digit = (1) + 1 = 2. Even.
 *   carry = 2 / 2 = 1.
 * i = 0: s[0] = '1'. digit = (1) + 1 = 2. Even.
 *   carry = 2 / 2 = 1.
 *
 * End of loop. carry = 1.
 * steps = 2 + carry = 2 + 1 = 3. This is incorrect.
 * The issue is how carry is handled. The carry represents the *next* bit.
 *
 * Let's re-think the operations on the binary string itself without converting to a large number.
 *
 * Algorithm refined:
 * Iterate while the string is not "1".
 * If the last character is '0':
 *   Remove the last character (effectively dividing by 2).
 *   Increment steps.
 * If the last character is '1':
 *   We need to perform an "add 1" operation.
 *   This operation involves finding the rightmost '0' and flipping it to '1', and flipping all subsequent '1's to '0's.
 *   If there's no '0' (string is all '1's), we prepend a '1' and turn all existing '1's to '0's.
 *   Increment steps for the "add 1" operation.
 *
 * Example: s = "1101"
 * Initial: steps = 0
 *
 * 1. s = "1101". Last char is '1'.
 *    Find rightmost '0': it's at index 2.
 *    Flip s[2] to '1', and s[3] to '0'. String becomes "1110".
 *    steps = 1.
 *
 * 2. s = "1110". Last char is '0'.
 *    Remove last char. String becomes "111".
 *    steps = 1 + 1 = 2.
 *
 * 3. s = "111". Last char is '1'.
 *    No '0' found. Prepend '1', flip existing '1's to '0's. String becomes "1000".
 *    steps = 2 + 1 = 3.
 *
 * 4. s = "1000". Last char is '0'.
 *    Remove last char. String becomes "100".
 *    steps = 3 + 1 = 4.
 *
 * 5. s = "100". Last char is '0'.
 *    Remove last char. String becomes "10".
 *    steps = 4 + 1 = 5.
 *
 * 6. s = "10". Last char is '0'.
 *    Remove last char. String becomes "1".
 *    steps = 5 + 1 = 6.
 *
 * String is "1". Loop terminates. Return steps = 6.
 * This matches Example 1.
 *
 * Implementation detail: String manipulation in JavaScript can be inefficient.
 * Using an array of characters and performing modifications would be better.
 * However, the constraints `s.length <= 500` suggest that direct string manipulation might pass.
 *
 * Let's try to implement this directly with string operations first.
 *
 * Time complexity:
 * In the worst case, we might have a string of all '1's like "111...1" (500 ones).
 * Adding 1 to such a string takes O(N) time where N is the length of the string. This results in "100...0".
 * Then, we perform N divisions by 2, each taking O(1) (if we consider slicing/substring efficient enough, or effectively O(N) if we consider the cost of creating new strings).
 * If we have a string like "100...0", we perform N divisions by 2.
 * The "add 1" operation is the most expensive.
 * Consider the case where we have many "add 1" operations.
 * Each "add 1" operation flips at least one bit from '0' to '1' or prepends a '1'.
 * The number of '1's in the string generally decreases over time, or the length increases.
 * When we add 1 to `111...1` (N ones), it becomes `100...0` (N+1 length). This is one step.
 * Then we do N steps of division by 2. Total N+1 steps.
 * The number of steps is roughly proportional to the number of bits plus the number of carries.
 * If the number is D, the number of steps is O(log D) divisions and O(log D) additions.
 * Since D can be up to 2^500, log D is around 500.
 * The string manipulation:
 * - Removing last char: O(N) using slice/substring.
 * - Finding rightmost '0': O(N).
 * - Flipping bits and prepending: O(N).
 * In the worst case, we might have around 2*N operations where each operation takes O(N).
 * So, the time complexity is O(N^2). Given N=500, N^2 = 250,000, which should be acceptable.
 *
 * Space complexity:
 * If we use string slicing, we are creating new strings, which can take O(N) space for each slice.
 * However, if we consider the total space used by strings throughout the process, it could be more.
 * If we use an array of characters and modify it in place, it would be O(N) space.
 * The problem statement implies we can always reach 1, so we don't need to worry about infinite loops or numbers growing indefinitely.
 * The total number of steps is bounded.
 * The dominant factor for space will be the representation of the number itself, which is O(N).
 *
 *
 * Let's use an array of characters for efficiency in modification.
 *
 *
 */
const numSteps = (s) => {
    // Convert the input string to an array of characters for easier manipulation.
    let chars = s.split('');
    let steps = 0;

    // Continue as long as the binary number represented by chars is not "1".
    // The condition `chars.length > 1 || chars[0] !== '1'` checks if the array
    // represents a number greater than 1.
    while (chars.length > 1 || chars[0] !== '1') {
        // Check the last character of the array.
        const lastIndex = chars.length - 1;

        if (chars[lastIndex] === '0') {
            // If the last digit is '0', it's an even number.
            // Dividing by 2 in binary is equivalent to removing the last '0'.
            // We pop the last element from the array.
            chars.pop();
            steps++; // Increment step count for the division.
        } else {
            // If the last digit is '1', it's an odd number.
            // We need to add 1. This requires finding the rightmost '0'
            // to flip to '1', and then flipping all subsequent '1's to '0's.
            // This entire "add 1" operation counts as one step.

            let i = lastIndex; // Start from the last character.
            // Propagate the carry from right to left.
            while (i >= 0 && chars[i] === '1') {
                chars[i] = '0'; // Flip '1' to '0'.
                i--; // Move to the left.
            }

            if (i < 0) {
                // If we went through the entire array and all were '1's (e.g., "111"),
                // we need to prepend a '1'.
                // This handles cases like "111" -> "1000".
                chars.unshift('1');
            } else {
                // If we found a '0' at index 'i', flip it to '1'.
                // This is where the carry stops.
                chars[i] = '1';
            }
            steps++; // Increment step count for the addition.
        }
    }

    // Return the total number of steps.
    return steps;
};
/**
 * Example 1:
 * Input: s = "1101"
 * Output: 6
 * Explanation: "1101" corressponds to number 13 in their decimal representation.
 * Step 1) 13 is odd, add 1 and obtain 14. ("1101" -> "1110")
 * Step 2) 14 is even, divide by 2 and obtain 7. ("1110" -> "111")
 * Step 3) 7 is odd, add 1 and obtain 8. ("111" -> "1000")
 * Step 4) 8 is even, divide by 2 and obtain 4. ("1000" -> "100")
 * Step 5) 4 is even, divide by 2 and obtain 2. ("100" -> "10")
 * Step 6) 2 is even, divide by 2 and obtain 1. ("10" -> "1")
 *
 * Example 2:
 * Input: s = "10"
 * Output: 1
 * Explanation: "10" corresponds to number 2 in their decimal representation.
 * Step 1) 2 is even, divide by 2 and obtain 1. ("10" -> "1")
 *
 * Example 3:
 * Input: s = "1"
 * Output: 0
 * Explanation: The number is already 1, so 0 steps are needed.
 *
 * Constraints:
 * 1 <= s.length <= 500
 * s consists of characters '0' or '1'
 * s[0] == '1'
 *
 * Time Complexity: O(N^2) where N is the length of the string `s`.
 * In each step, we either perform a pop operation (O(1) amortized for array) or an "add 1" operation.
 * The "add 1" operation involves a loop that can go up to N characters (flipping '1's to '0's) and potentially an unshift operation (O(N)).
 * The number of "add 1" operations is related to the number of '1's that need to be cleared.
 * The total number of divisions by 2 is N-1.
 * The "add 1" operations can happen frequently.
 * Consider "111...1" (N ones). Adding 1 takes O(N). Then N divisions take O(N). Total O(N).
 * However, if we have a string like "101010...", the "add 1" operations might require scanning significant portions repeatedly.
 * The core operations (pop, finding '0', flipping, unshift) are O(N) in the worst case.
 * The total number of operations is bounded. Each bit eventually becomes '0' and is removed, or contributes to a carry that eventually gets resolved.
 * A tighter analysis could argue for O(N log N) or O(N*number_of_set_bits) but O(N^2) is a safe upper bound given the string manipulations.
 *
 * Space Complexity: O(N) where N is the length of the string `s`.
 * We use an array `chars` to store the binary representation, which takes O(N) space.
 * The string operations like `pop` and `unshift` on the array can modify it in place or create new array segments, but the total additional space used for the representation itself is O(N).
 */
```