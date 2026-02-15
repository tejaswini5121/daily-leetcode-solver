// Problem: Add Binary
// Given two binary strings, return their sum as a binary string.
// Link: https://leetcode.com/problems/add-binary/
//
// Approach:
// We can simulate the process of binary addition just like we do with decimal numbers,
// from right to left. We'll use a carry variable to keep track of any overflow from
// adding the bits at the current position.
//
// 1. Initialize an empty string `result` to store the sum.
// 2. Initialize `carry` to 0.
// 3. Use two pointers, `i` and `j`, to iterate from the end of strings `a` and `b` respectively.
// 4. Loop while `i` or `j` are non-negative or `carry` is greater than 0.
// 5. In each iteration, get the current bits from `a` and `b` (or 0 if the pointer has gone past the beginning of the string). Convert these characters to integers.
// 6. Calculate the `sum` of the current bits and the `carry`.
// 7. The last bit of the `sum` (sum % 2) is the current bit of our `result`. Prepend this to the `result` string.
// 8. The new `carry` is `Math.floor(sum / 2)`.
// 9. Decrement `i` and `j`.
// 10. After the loop, `result` will contain the binary sum.
//
// Time Complexity: O(max(n, m)), where n is the length of string a and m is the length of string b.
// We iterate through the strings at most once, from right to left.
//
// Space Complexity: O(max(n, m)) for the result string. In the worst case, the sum can be one digit longer than the longer input string.

/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function(a, b) {
    let result = ""; // Initialize an empty string to store the binary sum
    let carry = 0;   // Initialize carry to 0

    // Initialize pointers to the end of both strings
    let i = a.length - 1;
    let j = b.length - 1;

    // Loop while there are digits in either string or there's a carry
    while (i >= 0 || j >= 0 || carry > 0) {
        // Get the current digit from string a, default to 0 if pointer is out of bounds
        const digitA = i >= 0 ? parseInt(a[i]) : 0;
        // Get the current digit from string b, default to 0 if pointer is out of bounds
        const digitB = j >= 0 ? parseInt(b[j]) : 0;

        // Calculate the sum of the current digits and the carry
        const sum = digitA + digitB + carry;

        // The current bit of the result is the remainder when sum is divided by 2
        // Prepend this bit to the result string
        result = (sum % 2) + result;

        // The new carry is the quotient when sum is divided by 2
        carry = Math.floor(sum / 2);

        // Move the pointers to the next digit (to the left)
        i--;
        j--;
    }

    // Return the final binary sum
    return result;
};
