/**
 * @summary Finds the greatest common divisor (GCD) of the smallest and largest numbers in an array.
 * @link https://leetcode.com/problems/find-greatest-common-divisor-of-array/
 *
 * @approach
 * 1. Find the minimum and maximum elements in the input array `nums`.
 * 2. Implement the Euclidean algorithm to calculate the GCD of the minimum and maximum elements.
 *    - The Euclidean algorithm repeatedly applies the modulo operation until the remainder is 0.
 *    - The last non-zero remainder is the GCD.
 *
 * @timeComplexity O(log(min(a, b))), where 'a' is the smallest number and 'b' is the largest number in the array.
 *                 This is due to the efficiency of the Euclidean algorithm. Finding min/max takes O(n).
 *                 So, overall O(n + log(min(a, b))). Since n is at least 2, it's effectively O(n).
 * @spaceComplexity O(1), as we only use a few variables to store min, max, and GCD.
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var findGCD = function(nums) {
    // Find the smallest number in the array
    let minNum = Math.min(...nums);
    // Find the largest number in the array
    let maxNum = Math.max(...nums);

    /**
     * Helper function to calculate the Greatest Common Divisor (GCD) of two numbers
     * using the Euclidean algorithm.
     * @param {number} a
     * @param {number} b
     * @returns {number} The GCD of a and b.
     */
    const gcd = (a, b) => {
        // Base case: if b is 0, then a is the GCD
        if (b === 0) {
            return a;
        }
        // Recursive step: call gcd with b and the remainder of a divided by b
        return gcd(b, a % b);
    };

    // Calculate and return the GCD of the smallest and largest numbers
    return gcd(minNum, maxNum);
};

// Example Usage:
// console.log(findGCD([2,5,6,9,10])); // Output: 2
// console.log(findGCD([7,5,6,8,3])); // Output: 1
// console.log(findGCD([3,3])); // Output: 3
```