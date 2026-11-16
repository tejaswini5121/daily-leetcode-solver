// /**
//  * @param {string} s
//  * @param {number} k
//  * @return {string}
//  */
// Problem: Calculate Digit Sum of a String
// Link: https://leetcode.com/problems/calculate-digit-sum-of-a-string/
// Approach:
// The problem requires repeatedly transforming a string by summing digits in groups of size k until the string's length is no longer greater than k.
// We can use a while loop to continue the process as long as the length of the string 's' is greater than 'k'.
// Inside the loop, we iterate through the string 's' with a step of 'k' to form groups.
// For each group, we calculate the sum of its digits. This sum is then converted to a string.
// These summed digit strings are concatenated to form the new 's' for the next round.
// The loop terminates when s.length <= k, and the final string 's' is returned.
//
// Time Complexity:
// Let N be the initial length of the string s.
// In each round, the length of the string decreases significantly.
// The number of rounds is logarithmic with respect to N and depends on k.
// In the worst case, each round reduces the length by roughly a factor of k (if all sums are single digits).
// The sum of digits for a group of size k takes O(k) time.
// So, in each round, we iterate through the string of length M, which takes O(M) to create groups and O(M) to sum digits.
// The total length of the string decreases in each step.
// Let's consider the maximum number of rounds. If k=2, the length can roughly halve each time. So log_2(N) rounds.
// If k is larger, the reduction is faster.
// The dominant operations are string manipulation and digit summing.
// The maximum length of s is 100, and k is 100.
// The number of rounds will be small. For example, if s.length=100 and k=2, the length becomes ~50, then ~25, ~13, ~7, ~4, ~2. About 5 rounds.
// The maximum sum of digits in a group of k=100 would be 9 * 100 = 900. This results in at most 3 digits.
// So, the string length doesn't grow excessively in terms of digits per sum.
// Roughly, the complexity per round is O(current_length).
// Since the length decreases, a loose upper bound could be O(N^2) in the worst-case scenario if k is very small and the sums produce many digits. However, given the constraints (N<=100, k<=100), the actual performance is much better. A tighter analysis suggests the number of rounds is logarithmic, and each round takes linear time on the current string length. Overall, it's effectively close to O(N * number_of_rounds) where number_of_rounds is small.

// Space Complexity:
// O(N) for storing the new string in each round. The string length decreases, so it doesn't grow unboundedly.
// If we consider the maximum intermediate string length, it's bounded by the initial length N.

var calculateDigitSum = function(s, k) {
    // Continue the process as long as the length of the string 's' is greater than 'k'.
    while (s.length > k) {
        let next_s = ""; // Initialize an empty string to build the result of the current round.

        // Iterate through the string 's' in steps of 'k' to form groups.
        for (let i = 0; i < s.length; i += k) {
            let group = s.substring(i, i + k); // Extract the current group of size 'k' (or smaller for the last group).
            let current_sum = 0; // Initialize the sum of digits for the current group.

            // Iterate through the characters of the group.
            for (let j = 0; j < group.length; j++) {
                // Convert the character digit to an integer and add it to the current_sum.
                current_sum += parseInt(group[j]);
            }

            // Convert the calculated sum back to a string and append it to 'next_s'.
            next_s += current_sum.toString();
        }

        // Update 's' with the newly formed string for the next round.
        s = next_s;
    }

    // Once the loop finishes (s.length <= k), return the final string 's'.
    return s;
};
```