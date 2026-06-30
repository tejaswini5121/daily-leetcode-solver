// Problem: Number of Substrings Containing All Three Characters
// Link: https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/
//
// Approach:
// We will use a sliding window approach. We maintain a window [left, right] and a count of characters 'a', 'b', and 'c' within this window.
// We expand the window by moving the 'right' pointer. For each character encountered at 'right', we increment its count.
// Once the window contains at least one 'a', one 'b', and one 'c', we know that any substring starting from 'left' up to 'right' and extending to the end of the string will also contain all three characters.
// The number of such valid substrings ending at 'right' is (n - right), where 'n' is the length of the string.
// We add this to our total count.
// Then, we try to shrink the window from the left by moving the 'left' pointer. We decrement the count of the character at 'left'.
// If the window still contains at least one 'a', one 'b', and one 'c' after shrinking, it means we've found more valid substrings starting from the new 'left' position. We again add (n - right) to our total count.
// We continue this process until 'right' reaches the end of the string.
//
// Time Complexity: O(n), where n is the length of the string. Both 'left' and 'right' pointers traverse the string at most once.
// Space Complexity: O(1), as we only use a fixed-size array (or map) to store counts of 'a', 'b', and 'c'.

#include <string>
#include <vector>
#include <unordered_map>

class Solution {
public:
    int numberOfSubstrings(std::string s) {
        // Get the length of the input string.
        int n = s.length();
        // Initialize the total count of valid substrings.
        int count = 0;
        // Initialize the left pointer of the sliding window.
        int left = 0;
        // Initialize a frequency map (or array) to store the counts of 'a', 'b', and 'c'.
        // Using an array of size 3 for 'a', 'b', 'c' is more efficient than a map.
        // Index 0 for 'a', 1 for 'b', 2 for 'c'.
        std::vector<int> freq(3, 0);

        // Iterate through the string with the right pointer.
        for (int right = 0; right < n; ++right) {
            // Increment the frequency of the character at the current 'right' pointer.
            // We subtract 'a' to get an index: 'a' -> 0, 'b' -> 1, 'c' -> 2.
            freq[s[right] - 'a']++;

            // Check if the current window [left, right] contains at least one of each character ('a', 'b', 'c').
            // This condition `freq[0] > 0 && freq[1] > 0 && freq[2] > 0` means we have seen 'a', 'b', and 'c' at least once.
            while (freq[0] > 0 && freq[1] > 0 && freq[2] > 0) {
                // If the window is valid (contains all three characters),
                // then any substring starting from 'left' and ending at 'right',
                // or any substring starting from 'left' and ending at any index after 'right'
                // will also contain at least one of each character.
                // The number of such substrings is `n - right`.
                // For example, if s = "abcabc", n=6, and our window is [0, 2] ("abc"), right=2.
                // The valid substrings ending at or after index 2 are:
                // "abc" (ends at 2)
                // "abca" (ends at 3)
                // "abcab" (ends at 4)
                // "abcabc" (ends at 5)
                // The number of these is n - right = 6 - 2 = 4.
                count += (n - right);

                // Now, try to shrink the window from the left to find more potential valid starting points.
                // Decrement the frequency of the character at the 'left' pointer.
                freq[s[left] - 'a']--;
                // Move the left pointer one step to the right.
                left++;
            }
        }

        // Return the total count of substrings containing at least one 'a', 'b', and 'c'.
        return count;
    }
};
```