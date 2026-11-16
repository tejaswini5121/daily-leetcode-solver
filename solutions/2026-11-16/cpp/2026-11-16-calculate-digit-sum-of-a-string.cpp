```cpp
// Problem: Calculate Digit Sum of a String
// Summary: Repeatedly sums digits in groups of size k until the string length is <= k.
// Link: https://leetcode.com/problems/calculate-digit-sum-of-a-string/
// Approach:
// The problem requires simulating the process of repeatedly summing digits in groups.
// We can use a while loop that continues as long as the length of the string `s` is greater than `k`.
// Inside the loop, we'll build a new string `next_s` to store the result of one round.
// We iterate through the current string `s` in chunks of size `k`.
// For each chunk, we calculate the sum of its digits.
// The sum is then converted back to a string and appended to `next_s`.
// After processing all chunks, we update `s` to `next_s` and the loop continues.
// Once the loop terminates (i.e., `s.length() <= k`), we return the final `s`.
// Time Complexity: O(N * K) in the worst case for each round, where N is the length of the string.
// The number of rounds can be logarithmic in relation to N, and the string length decreases in each round.
// A more precise analysis suggests it's closer to O(N*K*log_k(N)) or O(N*K*log(N)) depending on the exact rate of reduction.
// Since N and K are small (<= 100), this is efficient enough.
// Space Complexity: O(N) to store the intermediate and final strings.
class Solution {
public:
    string digitSum(string s, int k) {
        // Continue rounds as long as the string length is greater than k.
        while (s.length() > k) {
            string next_s = ""; // String to store the result of the current round.
            
            // Iterate through the string `s` in chunks of size `k`.
            for (int i = 0; i < s.length(); i += k) {
                int current_sum = 0; // Sum of digits for the current group.
                
                // Calculate the sum of digits for the current group.
                // The loop runs for `k` characters or until the end of the string.
                for (int j = 0; j < k && (i + j) < s.length(); ++j) {
                    current_sum += s[i + j] - '0'; // Convert char digit to int and add.
                }
                
                // Convert the sum back to a string and append it to `next_s`.
                next_s += to_string(current_sum);
            }
            
            // Update `s` with the result of the current round.
            s = next_s;
        }
        
        // Return the final string `s` when its length is less than or equal to `k`.
        return s;
    }
};
```