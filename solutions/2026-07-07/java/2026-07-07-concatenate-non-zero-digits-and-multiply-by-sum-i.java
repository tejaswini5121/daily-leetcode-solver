// Problem Summary:
// Given an integer n, form a new integer x by concatenating its non-zero digits in their original order.
// If x has no non-zero digits (e.g., n=0), x is 0.
// Calculate the sum of digits in x.
// Return the product of x and its sum of digits.

// Link to the problem:
// https://leetcode.com/problems/concatenate-non-zero-digits-and-multiply-by-sum-i/

// Approach Explanation:
// The problem requires processing digits in their original order (left to right).
// The most straightforward way to achieve this is to convert the integer `n` into a string.
// 1. Convert `n` to a string `s`.
// 2. Iterate through the characters of `s`. For each character that is not '0', append it to a `StringBuilder`.
// 3. After iterating, if the `StringBuilder` is empty (meaning `n` had no non-zero digits, like `n=0`), then `x` is 0.
//    Otherwise, convert the `StringBuilder` content to a `long` to get the value of `x`.
// 4. Calculate the sum of digits for `x`. This can be done by repeatedly taking `x % 10` to get the last digit and `x /= 10` to remove it, until `x` becomes 0.
// 5. Finally, return the product `x * sum`.
// This approach handles edge cases like `n=0` correctly, resulting in `x=0`, `sum=0`, and `0*0=0`.

// Time Complexity Analysis:
// Let `D` be the number of digits in `n`. For `n <= 10^9`, `D` is at most 10.
// 1. `String.valueOf(n)`: Takes O(D) time to convert the integer to a string.
// 2. Iterating through the string `s` and appending to `StringBuilder`: This loop runs `D` times. Appending to `StringBuilder` is amortized O(1). Total O(D).
// 3. `Long.parseLong(xBuilder.toString())`: Converting a string of length up to `D` to a long takes O(D) time.
// 4. Calculating `sum` using a `while` loop (modulo and division): This loop runs `D'` times, where `D'` is the number of digits in `x`. `D'` is at most `D`. Each operation is O(1). Total O(D').
// Overall, the dominant factor is `D`. Since `D` is small (max 10), the time complexity is effectively O(1).

// Space Complexity Analysis:
// 1. `String s = String.valueOf(n)`: Stores a string representation of `n`, taking O(D) space.
// 2. `StringBuilder xBuilder`: Stores the concatenated non-zero digits, taking up to O(D) space.
// 3. `s.toCharArray()`: Creates a temporary character array of size `D`, taking O(D) space.
// Overall, the space complexity is O(D). Since `D` is small (max 10), the space complexity is effectively O(1).

class Solution {
    public long concatenateNonZeroDigitsAndMultiply(int n) {
        // Step 1: Convert the input integer n to a string.
        // This allows easy iteration through digits in their original, left-to-right order.
        String s = String.valueOf(n);

        // Step 2: Initialize a StringBuilder to build the new integer x
        // by concatenating only the non-zero digits.
        StringBuilder xBuilder = new StringBuilder();

        // Iterate through each character (digit) of the string s.
        for (char c : s.toCharArray()) {
            // If the digit is not '0', append it to xBuilder.
            if (c != '0') {
                xBuilder.append(c);
            }
        }

        // Step 3: Determine the value of x.
        long x;
        // If xBuilder is empty, it means there were no non-zero digits in n (e.g., n=0).
        // In this case, according to the problem, x is 0.
        if (xBuilder.length() == 0) {
            x = 0;
        } else {
            // Otherwise, convert the string of concatenated non-zero digits to a long.
            x = Long.parseLong(xBuilder.toString());
        }

        // Step 4: Calculate the sum of digits in x.
        long sum = 0;
        // Use a temporary variable to calculate sum without modifying x.
        long tempX = x;

        // If x is 0, its sum of digits is also 0.
        if (tempX == 0) {
            sum = 0;
        } else {
            // Loop while tempX is greater than 0 to extract and sum its digits.
            while (tempX > 0) {
                // Add the last digit (tempX % 10) to sum.
                sum += tempX % 10;
                // Remove the last digit by integer division (tempX /= 10).
                tempX /= 10;
            }
        }

        // Step 5: Return the product of x and sum.
        return x * sum;
    }
}