/**
 * @fileoverview LeetCode problem: Concatenate Non-Zero Digits and Multiply by Sum I
 * @problem_summary Given an integer n, form a new integer x by concatenating its non-zero digits. Calculate the sum of digits in x. Return x * sum.
 * @link https://leetcode.com/problems/concatenate-non-zero-digits-and-multiply-by-sum-i/
 * @approach
 * 1. Convert the input integer `n` to a string to easily iterate through its digits.
 * 2. Initialize `x_str` as an empty string to build the concatenated non-zero digits.
 * 3. Initialize `sum` to 0 to store the sum of non-zero digits.
 * 4. Iterate through each character (digit) of the string representation of `n`.
 * 5. If a digit is not '0':
 *    a. Append the digit to `x_str`.
 *    b. Convert the digit to an integer and add it to `sum`.
 * 6. If `x_str` is empty after iterating (meaning `n` had no non-zero digits or was 0), set `x` to 0. Otherwise, convert `x_str` to an integer for `x`.
 * 7. Return `x * sum`.
 * @time_complexity O(log10(n)). The time complexity is determined by the number of digits in n, which is proportional to the base-10 logarithm of n. Converting to string and iterating through digits takes logarithmic time.
 * @space_complexity O(log10(n)). The space complexity is determined by the string representation of `n` and the `x_str`, both of which have a length proportional to the number of digits in `n`.
 */

/**
 * @param {number} n
 * @return {number}
 */
const concatenateNonZeroAndMultiplyBySum = (n) => {
    // Convert the input integer to a string to easily access its digits.
    const nStr = n.toString();
    
    // Initialize an empty string to build the concatenated non-zero digits.
    let x_str = "";
    
    // Initialize a variable to store the sum of the non-zero digits.
    let sum = 0;

    // Iterate through each character (digit) of the string representation of n.
    for (let i = 0; i < nStr.length; i++) {
        const digitChar = nStr[i];
        
        // Check if the current digit is not '0'.
        if (digitChar !== '0') {
            // If it's a non-zero digit, append it to our concatenated string.
            x_str += digitChar;
            
            // Convert the digit character to an integer and add it to the sum.
            sum += parseInt(digitChar, 10);
        }
    }

    // Determine the value of x.
    // If x_str is empty (meaning n had no non-zero digits or was 0), x is 0.
    // Otherwise, convert the concatenated string of non-zero digits to an integer.
    const x = x_str === "" ? 0 : parseInt(x_str, 10);

    // Return the product of x and its sum of digits.
    return x * sum;
};
```