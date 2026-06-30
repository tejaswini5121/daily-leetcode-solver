// Problem Summary: Count substrings in "abc" strings that contain at least one 'a', 'b', and 'c'.
// Problem Link: https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/
// Approach Explanation:
// We use a sliding window approach. We maintain a window [left, right] and a frequency map (or array)
// to store the counts of 'a', 'b', and 'c' within the current window.
// We expand the window by moving the `right` pointer. For each position of `right`, we check if the
// current window contains at least one of each character ('a', 'b', 'c').
// If it does, it means all substrings starting from `left` and ending at `right` and any position
// after `right` (up to the end of the string) will also contain all three characters.
// The number of such substrings is `s.length() - right`.
// We add this count to our total result. Then, we shrink the window from the left by incrementing
// the `left` pointer and updating the frequency map. We continue shrinking as long as the window
// still contains all three characters, because any smaller valid window also contributes to the count.
// Time Complexity Analysis: O(N), where N is the length of the string. Both `left` and `right` pointers
// traverse the string at most once. The frequency map operations take constant time.
// Space Complexity Analysis: O(1), as the frequency map (array of size 3) will always store counts
// for 'a', 'b', and 'c', which is constant regardless of the input string size.
class Solution {
    public int numberOfSubstrings(String s) {
        // Initialize the count of valid substrings
        int count = 0;
        // Initialize the left pointer of the sliding window
        int left = 0;
        // Array to store the frequency of 'a', 'b', and 'c' within the current window.
        // Index 0 for 'a', 1 for 'b', 2 for 'c'.
        int[] freq = new int[3];

        // Iterate through the string with the right pointer of the sliding window
        for (int right = 0; right < s.length(); right++) {
            // Increment the frequency of the character at the current right pointer
            freq[s.charAt(right) - 'a']++;

            // While the current window [left, right] contains at least one of each character ('a', 'b', 'c')
            while (freq[0] > 0 && freq[1] > 0 && freq[2] > 0) {
                // If the window is valid, it means any substring starting from `left` and ending at `right`
                // or any position after `right` (up to `s.length() - 1`) is also valid.
                // The number of such valid substrings is `s.length() - right`.
                // For example, if s = "abcabc" and right = 2 (pointing to 'c'), left = 0.
                // The window "abc" is valid. Substrings starting at left=0 and ending at right=2, 3, 4, 5 are:
                // "abc" (ends at 2), "abca" (ends at 3), "abcab" (ends at 4), "abcabc" (ends at 5).
                // This is (s.length() - right) = 6 - 2 = 4 substrings.
                count += (s.length() - right);

                // Shrink the window from the left.
                // Decrement the frequency of the character at the left pointer.
                freq[s.charAt(left) - 'a']--;
                // Move the left pointer to the right.
                left++;
            }
        }

        // Return the total count of valid substrings
        return count;
    }
}
