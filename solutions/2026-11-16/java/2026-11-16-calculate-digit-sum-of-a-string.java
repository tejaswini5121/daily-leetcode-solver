// Summary: Repeatedly groups digits and sums them until the string length is no longer greater than k.
// Link: https://leetcode.com/problems/calculate-digit-sum-of-a-string/
// Approach:
// The problem requires us to repeatedly process the string until its length is less than or equal to k.
// In each round, we iterate through the string, taking chunks of size k.
// For each chunk, we sum its digits. The sum is then converted back to a string.
// These resulting sum strings are concatenated to form the new string for the next round.
// We continue this process using a while loop that checks the string's length against k.
// Time Complexity:
// In the worst case, the string length decreases significantly in each round.
// The maximum initial length of s is 100.
// The number of rounds is relatively small.
// In each round, we iterate through the string once to form groups and then iterate through each group to sum digits.
// Let N be the initial length of s.
// In a round, forming groups takes O(N). Summing digits in a group of size k takes O(k). There are N/k such groups. So summing takes O(N/k * k) = O(N).
// Converting the sum to a string takes at most O(log(sum)). The maximum sum for a group of k digits is 9*k. So log(9*k) is a small constant.
// Concatenating strings can be O(N).
// The length of the string decreases in each step. If the length is L, in the next step it becomes roughly L/k * (number of digits in sum).
// Since k >= 2, the length decreases.
// The overall complexity is hard to pinpoint precisely without a more formal analysis of length reduction, but it's efficient for the given constraints.
// A loose upper bound can be considered O(N * log_k(N)) where log_k(N) represents the number of rounds.
// Space Complexity:
// We create a new string or StringBuilder in each round to store the result of the current round.
// The maximum length of the string in any round is the initial length of s.
// Therefore, the space complexity is O(N), where N is the initial length of s.
class Solution {
    public String digitSum(String s, int k) {
        // Continue rounds as long as the length of s is greater than k.
        while (s.length() > k) {
            // StringBuilder to build the new string for the next round.
            StringBuilder next_s = new StringBuilder();
            // Iterate through the string in chunks of size k.
            for (int i = 0; i < s.length(); i += k) {
                // Determine the end index of the current group.
                // It's either i + k or the end of the string if it's the last group.
                int end = Math.min(i + k, s.length());
                // Extract the current group.
                String group = s.substring(i, end);
                // Calculate the sum of digits in the current group.
                int current_sum = 0;
                for (char c : group.toCharArray()) {
                    // Convert char digit to integer and add to sum.
                    current_sum += c - '0';
                }
                // Append the string representation of the sum to the next_s.
                next_s.append(current_sum);
            }
            // Update s with the newly formed string for the next round.
            s = next_s.toString();
        }
        // Return the final string s once its length is less than or equal to k.
        return s;
    }
}
