// Problem: Find Unique Binary String
// Summary: Given an array of unique binary strings of length n, find a binary string of length n that is not present in the array.
// Link: https://leetcode.com/problems/find-unique-binary-string/
// Approach:
// The problem guarantees that we are given n unique binary strings, each of length n. This means there are a total of 2^n possible binary strings of length n. Since we are given n strings, and n is at most 16, 2^n will be at least n.
//
// A simple and efficient approach is to leverage the fact that we can construct a unique binary string by considering the i-th character of each of the n input strings. For each position `i` from 0 to `n-1`, we can choose a character for our unique string that is different from the character at the `i`-th position of the `i`-th string in the input array `nums`.
//
// For example, if `nums = ["01", "10"]`, then n = 2.
// For the first position (index 0): `nums[0][0]` is '0'. We can choose '1' for our unique string.
// For the second position (index 1): `nums[1][1]` is '0'. We can choose '1' for our unique string.
// This gives us "11", which is not in `nums`.
//
// If `nums = ["00", "01"]`, then n = 2.
// For the first position (index 0): `nums[0][0]` is '0'. We can choose '1'.
// For the second position (index 1): `nums[1][1]` is '1'. We can choose '0'.
// This gives us "10", which is not in `nums`.
//
// This greedy approach guarantees a unique binary string because for each position `i`, we are making a choice that is guaranteed to differentiate our constructed string from `nums[i]` at that specific position. Since each `nums[i]` is unique, and our constructed string differs from `nums[i]` at index `i`, our constructed string will not be equal to any of the strings in `nums`.
//
// Time Complexity: O(n)
// We iterate through the input array `nums` once, and for each string, we access a specific character. The length of each string is `n`. Therefore, constructing the unique string takes O(n) time.
//
// Space Complexity: O(n)
// We are creating a new string of length `n` to store the result. This contributes O(n) space. If we consider the output string as part of the space complexity, it's O(n). Otherwise, it's O(1) auxiliary space beyond the output.
/**
 * @param {string[]} nums
 * @return {string}
 */
const findDifferentBinaryString = function(nums) {
    // Get the length of the binary strings (and the number of strings).
    const n = nums.length;
    // Initialize an array to build the unique binary string.
    // This array will have a length of n.
    let uniqueBinaryStringChars = new Array(n);

    // Iterate through each position from 0 to n-1.
    for (let i = 0; i < n; i++) {
        // For the i-th position of our unique string,
        // we want to pick a character that is different from the
        // i-th character of the i-th string in the nums array.
        // If nums[i][i] is '0', we pick '1'.
        // If nums[i][i] is '1', we pick '0'.
        // This can be concisely done using a conditional (ternary) operator.
        uniqueBinaryStringChars[i] = nums[i][i] === '0' ? '1' : '0';
    }

    // Join the characters in the array to form the final unique binary string.
    return uniqueBinaryStringChars.join('');
};
