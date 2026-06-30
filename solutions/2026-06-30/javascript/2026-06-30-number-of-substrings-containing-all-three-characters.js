// Problem: Number of Substrings Containing All Three Characters
// Link: https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/
//
// Approach:
// This problem can be efficiently solved using a sliding window approach.
// We maintain a window defined by two pointers, `left` and `right`.
// We also keep track of the counts of characters 'a', 'b', and 'c' within the current window.
//
// The `right` pointer expands the window by iterating through the string.
// For each character encountered by the `right` pointer, we increment its count.
//
// Once the window contains at least one 'a', one 'b', and one 'c' (i.e., `countA > 0 && countB > 0 && countC > 0`),
// it means that any substring starting from `left` up to the current `right` pointer (inclusive)
// and ending at any point from `right` to the end of the string will contain all three characters.
//
// Therefore, for each valid window, the number of such substrings is `s.length - right`.
// This is because any substring starting at `left` and ending at `right`, `right+1`, ..., `s.length-1`
// will contain all three characters.
//
// After counting the valid substrings for the current `left`, we then try to shrink the window
// from the left by moving the `left` pointer. We decrement the count of the character at `left`
// and move `left` one step to the right. This process continues until the window no longer
// contains all three characters.
//
// We repeat this expansion and contraction of the window until the `right` pointer reaches the end of the string.
//
// Time Complexity: O(N), where N is the length of the string s.
// Both the `left` and `right` pointers traverse the string at most once.
//
// Space Complexity: O(1), as we are only using a constant amount of extra space for the character counts (a map or fixed-size array).
//
// Example 1: s = "abcabc"
// right = 0, s[0] = 'a', counts = {a: 1}, left = 0, ans = 0
// right = 1, s[1] = 'b', counts = {a: 1, b: 1}, left = 0, ans = 0
// right = 2, s[2] = 'c', counts = {a: 1, b: 1, c: 1}, left = 0. Window is valid.
//    Add s.length - right = 6 - 2 = 4 to ans. ans = 4. ("abc", "abca", "abcab", "abcabc")
//    Shrink window: s[left] = 'a', counts = {a: 0, b: 1, c: 1}, left = 1. Window is not valid.
// right = 3, s[3] = 'a', counts = {a: 1, b: 1, c: 1}, left = 1. Window is valid.
//    Add s.length - right = 6 - 3 = 3 to ans. ans = 4 + 3 = 7. ("bca", "bcab", "bcabc")
//    Shrink window: s[left] = 'b', counts = {a: 1, b: 0, c: 1}, left = 2. Window is not valid.
// right = 4, s[4] = 'b', counts = {a: 1, b: 1, c: 1}, left = 2. Window is valid.
//    Add s.length - right = 6 - 4 = 2 to ans. ans = 7 + 2 = 9. ("cab", "cabc")
//    Shrink window: s[left] = 'c', counts = {a: 1, b: 1, c: 0}, left = 3. Window is not valid.
// right = 5, s[5] = 'c', counts = {a: 1, b: 1, c: 1}, left = 3. Window is valid.
//    Add s.length - right = 6 - 5 = 1 to ans. ans = 9 + 1 = 10. ("abc")
//    Shrink window: s[left] = 'a', counts = {a: 0, b: 1, c: 1}, left = 4. Window is not valid.
// right reaches end. Final ans = 10.

var numberOfSubstrings = function(s) {
    // Initialize counts for characters 'a', 'b', and 'c'
    let countA = 0;
    let countB = 0;
    let countC = 0;
    // Initialize the left pointer of the sliding window
    let left = 0;
    // Initialize the total count of valid substrings
    let ans = 0;
    // Get the length of the input string
    const n = s.length;

    // Iterate through the string with the right pointer
    for (let right = 0; right < n; right++) {
        // Increment the count of the character at the current right pointer
        if (s[right] === 'a') {
            countA++;
        } else if (s[right] === 'b') {
            countB++;
        } else { // s[right] === 'c'
            countC++;
        }

        // While the current window contains at least one of each character ('a', 'b', 'c')
        while (countA > 0 && countB > 0 && countC > 0) {
            // If the window is valid, any substring starting from 'left' and ending
            // from 'right' to 'n-1' will contain all three characters.
            // The number of such substrings is (n - right).
            ans += (n - right);

            // Now, try to shrink the window from the left to find more valid starting points.
            // Decrement the count of the character at the left pointer.
            if (s[left] === 'a') {
                countA--;
            } else if (s[left] === 'b') {
                countB--;
            } else { // s[left] === 'c'
                countC--;
            }
            // Move the left pointer to the right, shrinking the window.
            left++;
        }
    }

    // Return the total count of substrings containing at least one 'a', 'b', and 'c'.
    return ans;
};
```