```python
# Problem Summary: Count letters that appear in both lowercase and uppercase within a string.
# Link: https://leetcode.com/problems/count-the-number-of-special-characters-i/
# Approach Explanation:
# We can use two sets to store the lowercase and uppercase letters encountered in the string.
# Iterate through the input string 'word'.
# For each character, convert it to lowercase and add it to the 'lowercase_chars' set.
# Also, convert it to uppercase and add it to the 'uppercase_chars' set.
# After processing the entire string, iterate through the 'lowercase_chars' set.
# For each lowercase character, check if its uppercase equivalent is present in the 'uppercase_chars' set.
# If both are present, it means this letter is "special", so increment a counter.
# Finally, return the total count of special letters.
# Time Complexity Analysis: O(N), where N is the length of the input string 'word'.
# We iterate through the string once to populate the sets, and then iterate through the lowercase set (at most 26 elements).
# Set insertions and lookups are O(1) on average.
# Space Complexity Analysis: O(1), as the size of the sets is bounded by the number of lowercase and uppercase English letters (26 each).
class Solution:
    def numberOfSpecialChars(self, word: str) -> int:
        # Initialize a set to store all lowercase characters found
        lowercase_chars = set()
        # Initialize a set to store all uppercase characters found
        uppercase_chars = set()
        
        # Iterate through each character in the input string
        for char in word:
            # Add the lowercase version of the character to the lowercase_chars set
            lowercase_chars.add(char.lower())
            # Add the uppercase version of the character to the uppercase_chars set
            uppercase_chars.add(char.upper())
            
        # Initialize a counter for special characters
        special_count = 0
        
        # Iterate through each unique lowercase character found
        for lower_char in lowercase_chars:
            # Check if the uppercase version of this lowercase character also exists in the uppercase_chars set
            if lower_char.upper() in uppercase_chars:
                # If both lowercase and uppercase versions are present, increment the special_count
                special_count += 1
                
        # Return the total count of special characters
        return special_count

```