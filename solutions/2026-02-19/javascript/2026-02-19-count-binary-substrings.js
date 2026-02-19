// Problem: Count Binary Substrings
// Summary: Count substrings with equal consecutive 0s and 1s.
// Link: https://leetcode.com/problems/count-binary-substrings/
//
// Approach:
// The core idea is to find consecutive groups of '0's and '1's.
// We can iterate through the string and group consecutive identical characters.
// For example, "00110011" would be grouped as [2, 2, 2, 2] (lengths of consecutive groups).
//
// Once we have these group lengths, we can count the valid substrings.
// A valid substring is formed at the boundary between two consecutive groups.
// The number of valid substrings at a boundary is determined by the minimum of the lengths of the two adjacent groups.
// For instance, if we have groups of length `prev_count` and `curr_count`, the number of valid substrings is `min(prev_count, curr_count)`.
//
// We can achieve this by iterating through the string, keeping track of the current consecutive count of a character and the previous consecutive count.
// When the character changes, we have found the end of a group. We then calculate the contribution to the total count using the previous and current group lengths, and reset the current count for the new character.
//
// Time Complexity: O(n) - We iterate through the string once.
// Space Complexity: O(1) - We only use a few variables to store counts.
//
// Example: s = "00110011"
//
// i = 0: s[0] = '0', current_count = 1
// i = 1: s[1] = '0', current_count = 2
// i = 2: s[2] = '1' (char changed)
//        - prev_count = 0, current_count = 2. Total_count += min(0, 2) = 0.
//        - prev_count = 2, current_count = 1 (for '1')
// i = 3: s[3] = '1', current_count = 2
// i = 4: s[4] = '0' (char changed)
//        - prev_count = 2, current_count = 2. Total_count += min(2, 2) = 2. ("01", "0011")
//        - prev_count = 2, current_count = 1 (for '0')
// i = 5: s[5] = '0', current_count = 2
// i = 6: s[6] = '1' (char changed)
//        - prev_count = 2, current_count = 2. Total_count += min(2, 2) = 2 + 2 = 4. ("10", "1100")
//        - prev_count = 2, current_count = 1 (for '1')
// i = 7: s[7] = '1', current_count = 2
// End of string:
//        - prev_count = 2, current_count = 2. Total_count += min(2, 2) = 4 + 2 = 6. ("01", "0011")
//
// Final total_count = 6.

const countBinarySubstrings = function(s) {
    // Initialize total count of valid substrings
    let totalCount = 0;
    // Initialize the count of the previous consecutive group of characters
    let prevCount = 0;
    // Initialize the count of the current consecutive group of characters
    let currentCount = 0;

    // Iterate through the string, starting from the second character
    for (let i = 0; i < s.length; i++) {
        // Increment the current count for the current character
        currentCount++;

        // Check if the current character is different from the next character,
        // or if we have reached the end of the string.
        // This condition signifies the end of a consecutive group.
        if (i + 1 === s.length || s[i] !== s[i + 1]) {
            // If prevCount is not zero (meaning we have a previous group to compare with)
            // add the minimum of prevCount and currentCount to totalCount.
            // This represents the number of valid substrings formed at the boundary of these two groups.
            if (prevCount > 0) {
                totalCount += Math.min(prevCount, currentCount);
            }
            // Update prevCount to be the currentCount, as this group will become the previous one
            // for the next iteration.
            prevCount = currentCount;
            // Reset currentCount to 0 for the new consecutive group that starts at the next character.
            currentCount = 0;
        }
    }

    // Return the total count of valid binary substrings
    return totalCount;
};
```