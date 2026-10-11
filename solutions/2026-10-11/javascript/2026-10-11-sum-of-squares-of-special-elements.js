/**
 * Calculates the sum of squares of "special" elements in a 1-indexed array.
 * An element nums[i] is special if its index i divides the length of the array n.
 *
 * Link: https://leetcode.com/problems/sum-of-squares-of-special-elements/
 *
 * Approach:
 * We iterate through the array from index 1 to n (inclusive) because the problem
 * defines a 1-indexed array. For each index `i`, we check if `i` divides the
 * length of the array `n` evenly (n % i === 0). If it does, then the element
 * at this index (nums[i-1] in 0-indexed JavaScript) is considered special.
 * We then square this special element and add it to a running sum.
 *
 * Time Complexity: O(n) - We iterate through the array once.
 * Space Complexity: O(1) - We only use a single variable to store the sum.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
const sumOfSquaresOfSpecialElements = function(nums) {
    // Get the length of the array. The problem uses 1-based indexing, so n is the length.
    const n = nums.length;
    // Initialize a variable to store the sum of squares of special elements.
    let sumOfSquares = 0;

    // Iterate through the array using 1-based indexing from 1 to n.
    for (let i = 1; i <= n; i++) {
        // Check if the current index `i` divides the length of the array `n` evenly.
        if (n % i === 0) {
            // If `i` is a divisor of `n`, then nums[i] (using 1-based indexing) is a special element.
            // In JavaScript, arrays are 0-indexed, so we access the element using `nums[i-1]`.
            // Square the special element and add it to the sumOfSquares.
            sumOfSquares += nums[i - 1] * nums[i - 1];
        }
    }

    // Return the total sum of squares of all special elements.
    return sumOfSquares;
};
```