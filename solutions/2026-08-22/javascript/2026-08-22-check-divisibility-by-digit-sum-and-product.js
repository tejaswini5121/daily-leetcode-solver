/**
 * @param {number} n
 * @return {boolean}
 */
/**
 * Problem Summary: Check if a positive integer 'n' is divisible by the sum of its digit sum and digit product.
 * Link: https://leetcode.com/problems/check-divisibility-by-digit-sum-and-product/
 *
 * Approach:
 * 1. Initialize variables for digit sum and digit product.
 * 2. Iterate through the digits of the number 'n' by repeatedly taking the number modulo 10 to get the last digit and then dividing the number by 10 to remove the last digit.
 * 3. During the iteration, add the current digit to the digit sum and multiply it with the digit product.
 * 4. Handle the case where a digit is 0. If any digit is 0, the digit product will be 0.
 * 5. After iterating through all digits, calculate the total divisor by adding the digit sum and digit product.
 * 6. Check if 'n' is divisible by the calculated total divisor using the modulo operator.
 * 7. Return true if divisible, false otherwise.
 *
 * Time Complexity: O(log10(n)). The number of iterations to extract digits is proportional to the number of digits in 'n', which is logarithmic with respect to 'n'.
 * Space Complexity: O(1). We use a constant amount of extra space for variables regardless of the input size.
 */
const isDivisibleByDigitSumAndProduct = (n) => {
    // Store the original number to perform the final division check
    const originalN = n;
    let digitSum = 0;
    let digitProduct = 1; // Initialize product to 1 to ensure correct multiplication

    // Iterate through each digit of the number
    while (n > 0) {
        // Get the last digit
        const digit = n % 10;

        // Add the digit to the sum
        digitSum += digit;

        // Multiply the digit with the product
        digitProduct *= digit;

        // Remove the last digit from the number
        n = Math.floor(n / 10);
    }

    // Calculate the total divisor by summing the digit sum and digit product
    // If digitProduct is 0 (because one of the digits was 0), it will correctly be 0.
    const totalDivisor = digitSum + digitProduct;

    // Check if the original number is divisible by the total divisor
    // If totalDivisor is 0 (only possible if n was 0, but problem statement says n is positive, so this won't happen),
    // division by zero would be an issue, but for positive n, totalDivisor will always be >= 1.
    return originalN % totalDivisor === 0;
};
```