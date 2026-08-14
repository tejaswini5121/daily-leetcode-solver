```cpp
// Given a string s, find the maximum length of a substring that contains at most two occurrences of each character.
// Link: https://leetcode.com/problems/maximum-length-substring-with-two-occurrences/

/*
Approach:
This problem can be solved using a sliding window approach. We maintain a window [left, right] and a frequency map (or an array for lowercase English letters) to keep track of character counts within the current window.
We expand the window by moving the `right` pointer. For each character at `right`, we increment its count in the frequency map.
If the count of any character exceeds 2, we need to shrink the window from the left. We do this by incrementing the `left` pointer and decrementing the count of the character at `left` in the frequency map until all character counts are at most 2 again.
At each step where the window is valid (all character counts <= 2), we update the maximum length found so far, which is `right - left + 1`.

Time Complexity: O(N), where N is the length of the string. Both `left` and `right` pointers traverse the string at most once. The operations inside the loop (map updates and checks) take constant time on average for a hash map or strictly constant time for an array.
Space Complexity: O(1), as the frequency map (or array) will store counts for at most 26 lowercase English letters, which is a constant number.
*/

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int maximumLengthSubstring(std::string s) {
        int n = s.length(); // Length of the input string
        int maxLength = 0; // Stores the maximum length of a valid substring found so far
        int left = 0; // Left pointer of the sliding window
        std::vector<int> charCount(26, 0); // Frequency map for lowercase English letters

        // Iterate through the string with the right pointer of the sliding window
        for (int right = 0; right < n; ++right) {
            // Increment the count of the character at the current right pointer
            charCount[s[right] - 'a']++;

            // While the count of the current character is greater than 2, shrink the window from the left
            while (charCount[s[right] - 'a'] > 2) {
                // Decrement the count of the character at the left pointer
                charCount[s[left] - 'a']--;
                // Move the left pointer to the right
                left++;
            }

            // The current window [left, right] is valid (all characters appear at most twice)
            // Update the maximum length if the current window is longer
            maxLength = std::max(maxLength, right - left + 1);
        }

        return maxLength; // Return the maximum length found
    }
};

/*
// Example Usage:
int main() {
    Solution sol;
    std::string s1 = "bcbbbcba";
    std::cout << "Input: " << s1 << std::endl;
    std::cout << "Output: " << sol.maximumLengthSubstring(s1) << std::endl; // Expected: 4

    std::string s2 = "aaaa";
    std::cout << "Input: " << s2 << std::endl;
    std::cout << "Output: " << sol.maximumLengthSubstring(s2) << std::endl; // Expected: 2

    std::string s3 = "aabc";
    std::cout << "Input: " << s3 << std::endl;
    std::cout << "Output: " << sol.maximumLengthSubstring(s3) << std::endl; // Expected: 4

    std::string s4 = "aabbcc";
    std::cout << "Input: " << s4 << std::endl;
    std::cout << "Output: " << sol.maximumLengthSubstring(s4) << std::endl; // Expected: 6

    std::string s5 = "abcabcabc";
    std::cout << "Input: " << s5 << std::endl;
    std::cout << "Output: " << sol.maximumLengthSubstring(s5) << std::endl; // Expected: 6

    return 0;
}
*/
```