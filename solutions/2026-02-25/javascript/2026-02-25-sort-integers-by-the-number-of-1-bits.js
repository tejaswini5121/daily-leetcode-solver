/**
 * @file Sort Integers by The Number of 1 Bits
 * @link https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/
 *
 * Problem Summary: Sort an array of integers first by the count of 1s in their binary representation (ascending),
 * and then by the integer value itself (ascending) for ties.
 *
 * Approach:
 * We can use a custom sorting function for the array. The custom sorting function will take two numbers, `a` and `b`,
 * and determine their order.
 *
 * 1. Count the number of set bits (1s) in the binary representation of `a` and `b`.
 *    - A common way to count set bits is to repeatedly check the last bit using the bitwise AND operator (`& 1`)
 *      and then right-shift the number (`>>= 1`) until the number becomes 0.
 *    - Alternatively, for positive integers, the `toString(2)` method followed by counting '1's can be used,
 *      but bitwise operations are generally more efficient.
 *
 * 2. Compare the bit counts:
 *    - If `countSetBits(a) < countSetBits(b)`, then `a` should come before `b`. Return -1.
 *    - If `countSetBits(a) > countSetBits(b)`, then `b` should come before `a`. Return 1.
 *
 * 3. If the bit counts are equal, compare the numbers themselves:
 *    - If `a < b`, then `a` should come before `b`. Return -1.
 *    - If `a > b`, then `b` should come before `a`. Return 1.
 *    - If `a == b`, their order doesn't matter. Return 0.
 *
 * We can implement a helper function `countSetBits` to perform the bit counting.
 *
 * Time Complexity:
 * The sorting operation itself typically has a time complexity of O(N log N), where N is the length of the array.
 * For each comparison within the sort, we call `countSetBits`. The `countSetBits` function iterates at most `log(max_val)` times,
 * where `max_val` is the maximum value in the array (since we are dealing with integers up to 10^4, this is a small constant, around 14 bits).
 * Therefore, the overall time complexity is O(N log N * log(max_val)). Given the constraints, log(max_val) is very small, so it's effectively O(N log N).
 *
 * Space Complexity:
 * The space complexity is primarily determined by the sorting algorithm used by the JavaScript engine. Most in-place sorting algorithms
 * have a space complexity of O(log N) or O(1) (for the call stack or auxiliary space). The `countSetBits` function uses O(1) auxiliary space.
 * Thus, the space complexity is O(log N) or O(1) depending on the sort implementation.
 */

/**
 * Counts the number of set bits (1s) in the binary representation of a non-negative integer.
 * @param {number} n The input integer.
 * @returns {number} The count of set bits.
 */
const countSetBits = (n) => {
    let count = 0;
    // Iterate while n is greater than 0.
    while (n > 0) {
        // Check if the last bit is 1 using bitwise AND with 1.
        // If n & 1 is 1, it means the last bit is 1.
        count += (n & 1);
        // Right-shift n by 1 bit to process the next bit.
        // This is equivalent to integer division by 2.
        n >>= 1;
    }
    return count;
};

/**
 * @param {number[]} arr
 * @return {number[]}
 */
const sortByBits = function(arr) {
    // Use the built-in sort method with a custom comparison function.
    arr.sort((a, b) => {
        // Count set bits for both numbers.
        const bitsA = countSetBits(a);
        const bitsB = countSetBits(b);

        // First, compare by the number of set bits.
        if (bitsA !== bitsB) {
            // If bitsA is less than bitsB, 'a' comes first.
            // If bitsA is greater than bitsB, 'b' comes first.
            return bitsA - bitsB;
        } else {
            // If the number of set bits is the same, sort by the integer value itself.
            // If 'a' is less than 'b', 'a' comes first.
            // If 'a' is greater than 'b', 'b' comes first.
            return a - b;
        }
    });

    // Return the sorted array.
    return arr;
};
```