// Problem Summary: Calculate the GCD of the sum of the first n odd positive integers and the sum of the first n even positive integers.
// Link: https://leetcode.com/problems/gcd-of-odd-and-even-sums/
// Approach:
// The sum of the first n positive odd numbers is n^2.
// The sum of the first n positive even numbers is n * (n + 1).
// We need to find the GCD of n^2 and n * (n + 1).
// Using the property GCD(a*c, b*c) = c * GCD(a, b), we can factor out n:
// GCD(n^2, n * (n + 1)) = n * GCD(n, n + 1).
// The GCD of any two consecutive integers n and n + 1 is always 1.
// Therefore, GCD(n, n + 1) = 1.
// So, the final GCD is n * 1 = n.
//
// Time Complexity: O(1) - The calculations involve arithmetic operations which take constant time.
// Space Complexity: O(1) - The solution uses a constant amount of extra space.

/**
 * @param {number} n
 * @return {number}
 */
var gcdOfOddAndEvenSums = function(n) {
    // The sum of the first n positive odd numbers is n^2.
    // Example: n=4, sumOdd = 1 + 3 + 5 + 7 = 16 = 4^2
    // let sumOdd = n * n;

    // The sum of the first n positive even numbers is n * (n + 1).
    // Example: n=4, sumEven = 2 + 4 + 6 + 8 = 20 = 4 * (4 + 1)
    // let sumEven = n * (n + 1);

    // We need to find GCD(sumOdd, sumEven) which is GCD(n^2, n * (n + 1)).
    // Using the property GCD(ac, bc) = c * GCD(a, b), we can factor out n.
    // GCD(n^2, n * (n + 1)) = n * GCD(n, n + 1).
    // The greatest common divisor of any two consecutive integers (n and n + 1) is always 1.
    // Therefore, GCD(n, n + 1) = 1.
    // So, the result is n * 1 = n.
    return n;
};
```