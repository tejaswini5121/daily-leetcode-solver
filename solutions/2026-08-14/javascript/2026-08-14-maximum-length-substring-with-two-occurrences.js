// Finds the maximum length of a substring containing at most two occurrences of each character.
// LeetCode Problem: https://leetcode.com/problems/maximum-length-substring-with-two-occurrences/
// Approach: Sliding Window.
// We use two pointers, `left` and `right`, to define a window.
// We expand the window by moving `right`. A frequency map (`charCount`) keeps track of character counts within the current window.
// If any character's count exceeds 2, we shrink the window from the left by moving `left` and decrementing the character's count until all character counts are at most 2.
// At each step where the window is valid (all character counts <= 2), we update the `maxLength`.
// Time Complexity: O(N), where N is the length of the string. Each character is visited at most twice (once by `right` and once by `left`).
// Space Complexity: O(1), as the frequency map will store at most 26 lowercase English letters.
var maximumLengthSubstring = function(s) {
    // Initialize `left` pointer of the sliding window.
    let left = 0;
    // Initialize `maxLength` to store the maximum valid substring length found so far.
    let maxLength = 0;
    // Initialize a map to store the frequency of characters within the current window.
    const charCount = new Map();

    // Iterate through the string with the `right` pointer.
    for (let right = 0; right < s.length; right++) {
        // Get the character at the `right` pointer.
        const currentChar = s[right];

        // Increment the count of the `currentChar` in the `charCount` map.
        // If the character is not in the map, initialize its count to 0 before incrementing.
        charCount.set(currentChar, (charCount.get(currentChar) || 0) + 1);

        // While the current character's count exceeds 2, we need to shrink the window from the left.
        while (charCount.get(currentChar) > 2) {
            // Get the character at the `left` pointer.
            const leftChar = s[left];
            // Decrement the count of the `leftChar` in the `charCount` map.
            charCount.set(leftChar, charCount.get(leftChar) - 1);
            // If the count of `leftChar` becomes 0, remove it from the map (optional, but good practice).
            if (charCount.get(leftChar) === 0) {
                charCount.delete(leftChar);
            }
            // Move the `left` pointer one step to the right to shrink the window.
            left++;
        }

        // After ensuring the current window is valid (all character counts <= 2),
        // calculate the current window's length and update `maxLength` if it's greater.
        // The length of the current window is `right - left + 1`.
        maxLength = Math.max(maxLength, right - left + 1);
    }

    // Return the maximum length found.
    return maxLength;
};
