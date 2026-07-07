// Problem Summary:
// This problem requires forming a new integer 'x' by concatenating all non-zero digits of a given integer 'n' in their original order.
// If 'n' is 0, 'x' is 0. Then, calculate 'sum', which is the sum of digits in 'x'. Finally, return the product of 'x' and 'sum'.

// Link to the problem:
// https://leetcode.com/problems/concatenate-non-zero-digits-and-multiply-by-sum-i/

// Approach Explanation:
// The most straightforward way to extract digits in their original order and concatenate them is to convert the integer `n` into a string.
// 1. **Handle `n = 0`:** An immediate check for `n = 0` allows returning 0 directly, as `x` would be 0 and `sum` would be 0.
// 2. **Form `x`:**
//    a. Convert the input integer `n` into its string representation (`n_str`).
//    b. Initialize an empty string `x_str`.
//    c. Iterate through each character (digit) in `n_str`. If a character is not '0', append it to `x_str`. This effectively concatenates all non-zero digits.
//    d. Convert the resulting `x_str` back to a `long long` integer, which will be our `x`. Using `long long` is important as `x` can be up to 10^9.
// 3. **Calculate `sum`:**
//    a. Initialize `sum_digits = 0`.
//    b. Use a temporary variable `temp_x` initialized with `x`.
//    c. In a loop, extract the last digit of `temp_x` using the modulo operator (`temp_x % 10`) and add it to `sum_digits`.
//    d. Remove the last digit from `temp_x` using integer division (`temp_x /= 10`).
//    e. Repeat until `temp_x` becomes 0.
// 4. **Return Result:** Calculate `x * sum_digits`. The result should also be `long long` to prevent potential overflow, as `x` can be large and `sum` can be up to 90.

// Time Complexity Analysis:
// Let `D` be the number of digits in `n`. For the given constraint `0 <= n <= 10^9`, `D` is at most 10.
// - `std::to_string(n)`: Converts an integer to a string, taking `O(D)` time.
// - Iterating through `n_str` to build `x_str`: This loop runs `D` times. String concatenation (`+=`) is amortized `O(1)`. Total `O(D)`.
// - `std::stoll(x_str)`: Converts `x_str` (which has at most `D` digits) back to a `long long`, taking `O(D)` time.
// - Calculating `sum_digits`: This loop runs for each digit in `x` (at most `D` times). Each arithmetic operation is `O(1)`. Total `O(D)`.
// Overall, the dominant operations are proportional to the number of digits, making the time complexity `O(D)`. Given that `D` is small and bounded (max 10), this is effectively `O(1)` constant time.

// Space Complexity Analysis:
// Let `D` be the number of digits in `n`.
// - `std::string n_str`: Stores the string representation of `n`, requiring `O(D)` space.
// - `std::string x_str`: Stores the string representation of `x`, requiring `O(D)` space.
// All other variables (`x`, `sum_digits`, `temp_x`) use `O(1)` space.
// Therefore, the total space complexity is `O(D)`. Similar to time complexity, this is effectively `O(1)` due to the small, fixed maximum value of `D`.

#include <string> // Required for std::to_string, std::string, std::stoll

// Define the Solution class as per LeetCode problem structure.
class Solution {
public:
    // Function to concatenate non-zero digits and multiply by their sum.
    long long concatenateNonZeroDigitsAndMultiply(int n) {
        // Handle the edge case where the input integer n is 0.
        // If n is 0, there are no non-zero digits, so x = 0.
        // The sum of digits in x is 0.
        // Therefore, x * sum = 0 * 0 = 0.
        if (n == 0) {
            return 0;
        }

        // Convert the integer n to its string representation.
        // This allows easy iteration through digits in their original order.
        std::string n_str = std::to_string(n);
        
        // Initialize an empty string to build the new integer x from non-zero digits.
        std::string x_str = ""; 

        // Iterate through each character (digit) in the string representation of n.
        for (char digit_char : n_str) {
            // If the current digit character is not '0', append it to x_str.
            // This effectively concatenates only the non-zero digits.
            if (digit_char != '0') {
                x_str += digit_char;
            }
        }

        // Convert the string x_str (which contains concatenated non-zero digits)
        // back to a long long integer.
        // long long is used to handle potential large values of x (up to 10^9).
        long long x = std::stoll(x_str);

        // Initialize a variable to store the sum of digits in x.
        long long sum_digits = 0;
        // Use a temporary variable to calculate the sum of digits without modifying x itself.
        long long temp_x = x; 

        // Loop to extract and sum digits of temp_x.
        // The loop continues as long as temp_x has digits remaining (i.e., is greater than 0).
        while (temp_x > 0) {
            // Get the last digit of temp_x using the modulo operator.
            sum_digits += temp_x % 10;
            // Remove the last digit from temp_x using integer division.
            temp_x /= 10;
        }

        // Finally, return the product of x and sum_digits.
        // The result is also a long long to accommodate large products
        // (e.g., if x is 10^9 and sum_digits is 90, the product is 9 * 10^10).
        return x * sum_digits;
    }
};
// End of file.