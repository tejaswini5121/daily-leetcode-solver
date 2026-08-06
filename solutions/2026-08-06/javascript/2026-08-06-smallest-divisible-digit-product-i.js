// Summary: Find the smallest number >= n where the product of its digits is divisible by t.
// Link: https://leetcode.com/problems/smallest-divisible-digit-product-i/
// Approach:
// We need to iterate through numbers starting from n and check if the product of their digits is divisible by t.
// The first number that satisfies this condition will be our answer.
// To calculate the digit product, we can convert the number to a string, iterate through its characters (digits),
// convert each character back to a number, and multiply them. Special case: if any digit is 0, the product is 0,
// which is divisible by any t (since t >= 1).
// Time Complexity: O( (ans - n) * log10(ans) ). In the worst case, `ans` can be significantly larger than `n`.
// However, given the constraints (n <= 100, t <= 10), the search space is small. The maximum number we might
// check won't be excessively large for these constraints. For larger constraints, this approach could be slow.
// Space Complexity: O(log10(ans)) due to string conversion for digit product calculation.

/**
 * @param {number} n
 * @param {number} t
 * @return {number}
 */
const smallestDivisibleDigitProduct = (n, t) => {
    // Helper function to calculate the product of digits of a number.
    const getDigitProduct = (num) => {
        // If the number is 0, its digit product is 0.
        if (num === 0) {
            return 0;
        }
        let product = 1;
        // Convert the number to a string to easily access its digits.
        const numStr = String(num);
        // Iterate through each character of the string.
        for (let i = 0; i < numStr.length; i++) {
            const digit = parseInt(numStr[i], 10);
            // If any digit is 0, the entire product will be 0.
            if (digit === 0) {
                return 0;
            }
            // Multiply the current product by the digit.
            product *= digit;
        }
        // Return the calculated product.
        return product;
    };

    // Start checking from the given number 'n'.
    let currentNum = n;
    // Loop indefinitely until we find a number that satisfies the condition.
    while (true) {
        // Calculate the product of digits for the current number.
        const digitProduct = getDigitProduct(currentNum);
        // Check if the digit product is divisible by 't'.
        // The modulo operator (%) returns 0 if it's divisible.
        if (digitProduct % t === 0) {
            // If divisible, this is the smallest number >= n that satisfies the condition.
            return currentNum;
        }
        // If not divisible, increment the number and check the next one.
        currentNum++;
    }
};
