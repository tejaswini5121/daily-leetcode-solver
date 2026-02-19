```python
# Summary: Count binary substrings with equal consecutive 0s and 1s.
# Link: https://leetcode.com/problems/count-binary-substrings/
# Approach:
# We can iterate through the string and count consecutive groups of 0s and 1s.
# For example, in "00110011", the groups are of lengths [2, 2, 2, 2].
# The number of valid substrings between two consecutive groups is the minimum
# of the lengths of those two groups. For instance, between a group of 2 '0's
# and a group of 2 '1's, we can form min(2, 2) = 2 valid substrings: "01" and "0011".
# We maintain a list of counts of consecutive characters. Then, we iterate through
# this list and sum up the minimum of adjacent counts.
# Time Complexity: O(n), where n is the length of the string. We iterate through the string once to group consecutive characters and then iterate through the group counts once.
# Space Complexity: O(n) in the worst case, if all characters are different (e.g., "010101..."). However, if there are long consecutive runs of the same character, the space complexity would be less. A more precise analysis would be O(k), where k is the number of distinct consecutive groups, which can be at most n.

class Solution:
    def countBinarySubstrings(self, s: str) -> int:
        # Initialize a list to store the lengths of consecutive groups of 0s or 1s.
        groups = []
        # Initialize the count of the current consecutive character.
        count = 1
        # Iterate through the string starting from the second character.
        for i in range(1, len(s)):
            # If the current character is the same as the previous one, increment the count.
            if s[i] == s[i-1]:
                count += 1
            # If the current character is different from the previous one,
            # it means a new consecutive group has started.
            else:
                # Append the count of the previous consecutive group to the 'groups' list.
                groups.append(count)
                # Reset the count for the new consecutive group.
                count = 1
        # After the loop, append the count of the last consecutive group.
        groups.append(count)

        # Initialize the total count of valid binary substrings.
        ans = 0
        # Iterate through the 'groups' list from the first element up to the second to last element.
        for i in range(len(groups) - 1):
            # For each pair of adjacent group lengths, the number of valid substrings
            # is the minimum of these two lengths.
            # For example, if we have group of 3 '0's followed by a group of 2 '1's,
            # we can form "01" and "0011". The number is min(3, 2) = 2.
            ans += min(groups[i], groups[i+1])

        # Return the total count of valid binary substrings.
        return ans

```