```java
// Problem: Count Binary Substrings
// Link: https://leetcode.com/problems/count-binary-substrings/
//
// Summary:
// Counts binary substrings with equal consecutive 0s and 1s.
//
// Approach:
// The core idea is to iterate through the string and identify consecutive groups of identical characters ('0's or '1's).
// We maintain two variables: `prevGroupCount` (the count of the previous consecutive group) and `currentGroupCount` (the count of the current consecutive group).
// When we transition from one group to another (e.g., from '0's to '1's or vice versa), we can form valid substrings. The number of such valid substrings is the minimum of `prevGroupCount` and `currentGroupCount`.
// For example, if we have "00011", the previous group of '0's has a count of 3, and the current group of '1's has a count of 2. The number of valid substrings we can form at this boundary is min(3, 2) = 2. These substrings are "01" and "0011".
// We then update `prevGroupCount` to `currentGroupCount` and reset `currentGroupCount` for the new group.
//
// Time Complexity:
// O(n), where n is the length of the string. We iterate through the string once.
//
// Space Complexity:
// O(1), as we only use a few constant extra variables.

class Solution {
    public int countBinarySubstrings(String s) {
        int count = 0; // Initialize the total count of valid substrings
        int prevGroupCount = 0; // Stores the count of the previous consecutive group of characters
        int currentGroupCount = 1; // Stores the count of the current consecutive group of characters, starting with the first character.

        // Iterate through the string starting from the second character
        for (int i = 1; i < s.length(); i++) {
            // Check if the current character is the same as the previous one
            if (s.charAt(i) == s.charAt(i - 1)) {
                // If they are the same, increment the count of the current consecutive group
                currentGroupCount++;
            } else {
                // If the characters are different, it means we've found a boundary between two consecutive groups.
                // The number of valid substrings that can be formed at this boundary is the minimum
                // of the previous group's count and the current group's count.
                // For example, if we have "00011", prevGroupCount (for '0's) is 3, and currentGroupCount (for '1's) is 2.
                // The valid substrings are "01" and "0011", which is min(3, 2) = 2.
                count += Math.min(prevGroupCount, currentGroupCount);

                // Update the previous group count to the current group count,
                // as the current group is now becoming the previous group for the next transition.
                prevGroupCount = currentGroupCount;
                // Reset the current group count to 1 for the new group of characters starting at s.charAt(i).
                currentGroupCount = 1;
            }
        }

        // After the loop finishes, we need to add the count for the last boundary.
        // This is because the loop condition (i < s.length()) stops before processing the last group's contribution.
        // The last `currentGroupCount` and the last `prevGroupCount` form the final potential boundary.
        count += Math.min(prevGroupCount, currentGroupCount);

        return count; // Return the total count of valid binary substrings
    }
}
```