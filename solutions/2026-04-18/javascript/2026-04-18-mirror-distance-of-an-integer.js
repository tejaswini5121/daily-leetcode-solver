// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
// Problem: Calculate the mirror distance of an integer, defined as the absolute difference between the integer and its reversed counterpart.
// Link: https://leetcode.com/problems/mirror-distance-of-an-integer/
// Approach:
// 1. Convert the integer to a string to easily reverse its digits.
// 2. Reverse the string representation of the number.
// 3. Convert the reversed string back to an integer. Leading zeros will be handled automatically by parseInt.
// 4. Calculate the absolute difference between the original integer and the reversed integer.
// Time Complexity: O(log10(n)) - The time complexity is dominated by converting the number to a string and reversing it, which is proportional to the number of digits in n. The number of digits in n is approximately log10(n).
// Space Complexity: O(log10(n)) - The space complexity is due to storing the string representation of the number and its reversed version, which also depends on the number of digits.
const mirrorDistance = (n) => {
    // Convert the integer to a string to facilitate digit reversal.
    const nStr = n.toString();

    // Reverse the string representation of the number.
    // split('') converts the string into an array of characters.
    // reverse() reverses the order of elements in the array.
    // join('') joins the array elements back into a string.
    const reversedNStr = nStr.split('').reverse().join('');

    // Convert the reversed string back to an integer.
    // parseInt handles leading zeros correctly (e.g., "01" becomes 1).
    const reversedN = parseInt(reversedNStr, 10);

    // Calculate the absolute difference between the original number and its reversed version.
    // Math.abs() ensures we return a non-negative value.
    return Math.abs(n - reversedN);
};
// @lc code=end