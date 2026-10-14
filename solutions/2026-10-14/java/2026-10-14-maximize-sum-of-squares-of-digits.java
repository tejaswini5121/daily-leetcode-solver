```java
class Solution {
    /**
     * Problem: Maximize Sum of Squares of Digits
     * Link: https://leetcode.com/problems/maximize-sum-of-squares-of-digits/
     *
     * Approach:
     * To maximize the sum of squares of digits, we should try to place the largest possible digits (9s)
     * at the most significant positions (leftmost digits) as much as possible, while still satisfying the
     * total sum constraint. This is a greedy approach.
     *
     * We can iterate from the most significant digit to the least significant digit. For each digit position,
     * we try to place the largest possible digit (from 9 down to 0) such that the remaining sum can still
     * be formed by the remaining digits.
     *
     * Let 'num' be the number of digits and 'sum' be the required sum of digits.
     * For the current digit position, the maximum value we can place is 9.
     * However, we must ensure that the remaining 'num - 1' digits can sum up to 'sum - current_digit'.
     * The minimum sum for 'num - 1' digits is 0 (all zeros), and the maximum sum is (num - 1) * 9.
     * So, we must satisfy: 0 <= sum - current_digit <= (num - 1) * 9.
     * Rearranging this, we get: sum - (num - 1) * 9 <= current_digit <= sum.
     * Combining with the constraint that the digit must be at most 9, the largest possible digit for the
     * current position is min(9, sum - (num - 1) * 9).
     * We greedily pick this largest possible digit, append it to our result string, and update the remaining
     * 'num' and 'sum'.
     *
     * We repeat this process until all 'num' digits are placed.
     *
     * Edge Cases:
     * - If at any point the required 'sum' becomes negative, or if the remaining 'sum' is greater than the
     *   maximum possible sum for the remaining digits (remaining_num * 9), then no such good integer exists.
     * - If the initial 'sum' is greater than 'num * 9', it's impossible to form the number, so return "".
     * - If 'num' is 1 and 'sum' is greater than 9, it's impossible, return "".
     *
     * Time Complexity: O(num) - We iterate 'num' times to construct the digits.
     * Space Complexity: O(num) - To store the resulting string.
     */
    public String maximizeSumOfSquaresOfDigits(int num, int sum) {
        // If the maximum possible sum of digits for 'num' digits is less than the required 'sum',
        // or if the minimum possible sum (which is 0) is greater than the required 'sum' (this check
        // is implicitly handled by sum < 1 below), then it's impossible.
        // Also, if sum is 0 and num > 0, it's impossible as numbers must be positive.
        if (sum > num * 9 || sum < 1) {
            return "";
        }

        // Use a StringBuilder for efficient string concatenation.
        StringBuilder result = new StringBuilder();
        
        // Iterate to determine each digit from most significant to least significant.
        for (int i = 0; i < num; i++) {
            // 'remainingDigits' is the number of digits yet to be determined.
            int remainingDigits = num - 1 - i;
            
            // Determine the largest possible digit for the current position.
            // The digit 'd' must satisfy:
            // 1. d <= 9 (digit constraint)
            // 2. sum - d >= 0 (remaining sum must be non-negative)
            // 3. sum - d <= remainingDigits * 9 (remaining sum must be formable by remaining digits)
            // From (2) and (3), we get: sum - remainingDigits * 9 <= d <= sum
            // Combining with (1), the largest possible digit is min(9, sum - remainingDigits * 9)
            
            // Calculate the maximum possible digit for the current position.
            // We subtract remainingDigits * 9 from sum. If this difference is negative, it means
            // even if we put 0 for all remaining digits, the current sum is still too large to be formed.
            // So, the digit cannot be larger than 'sum'.
            // Therefore, the digit is capped by min(9, sum - remainingDigits * 9).
            // We take Math.max(0, ...) because the digit cannot be negative.
            int currentDigit = Math.min(9, sum - remainingDigits * 9);
            currentDigit = Math.max(0, currentDigit); // Ensure digit is not negative

            // Append the determined digit to the result.
            result.append(currentDigit);
            
            // Subtract the chosen digit from the total sum.
            sum -= currentDigit;
        }
        
        // After placing all 'num' digits, the 'sum' should be exactly 0.
        // If sum is not 0, it implies an issue or impossibility, though our logic should prevent this
        // if an initial valid state was possible.
        // The problem statement implies we should return "" if no such integer exists.
        // Our initial checks and greedy strategy should ensure this.
        // However, if sum > 0 after loop, it means we couldn't form the sum.
        if (sum != 0) {
            return "";
        }

        // The problem asks for the maximum integer if multiple exist with the max score.
        // Our greedy approach of placing larger digits on the left naturally generates the largest
        // possible integer for a given set of digits that maximizes the score.
        // For example, if digits are {3, 0} for num=2, sum=3, max score is 3^2 + 0^2 = 9.
        // Numbers are "30" and "03". "30" is greater. Our greedy places '3' first.
        // If digits are {9, 8} for num=2, sum=17, max score is 9^2 + 8^2 = 145.
        // Numbers are "98" and "89". "98" is greater. Our greedy places '9' first.

        return result.toString();
    }
}
```