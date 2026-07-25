// Problem Summary: Find the largest product achievable by multiplying any two digits of a given positive integer.
// Link: https://leetcode.com/problems/maximum-product-of-two-digits/
// Approach:
// 1. Convert the integer `n` into a string to easily access its digits.
// 2. Extract each digit from the string and store them as numbers in an array.
// 3. Sort the array of digits in descending order. This is because the maximum product will be achieved by multiplying the two largest digits.
// 4. The maximum product is then the product of the first two elements of the sorted array (which are the two largest digits).
// Time Complexity: O(D log D), where D is the number of digits in `n`. Converting to string takes O(D), sorting takes O(D log D). Since D is at most 10 (for n <= 10^9), this is effectively O(1).
// Space Complexity: O(D) to store the digits in an array. Again, since D is at most 10, this is effectively O(1).
/**
 * @param {number} n
 * @return {number}
 */
var maxProduct = function(n) {
    // Convert the integer to a string to easily iterate over its digits.
    const s = n.toString();
    // Create an array to store the digits as numbers.
    const digits = [];

    // Iterate through the string and push each digit (converted to a number) into the array.
    for (let i = 0; i < s.length; i++) {
        digits.push(parseInt(s[i]));
    }

    // Sort the digits in descending order.
    // This ensures that the two largest digits will be at the beginning of the array.
    digits.sort((a, b) => b - a);

    // The maximum product is the product of the two largest digits.
    // Since the array is sorted in descending order, these are the first two elements.
    return digits[0] * digits[1];
};
