```python
# Calculate weighted word mappings and concatenate them into a string.
# Problem: https://leetcode.com/problems/weighted-word-mapping/
#
# Approach:
# 1. For each word in the input `words` array:
#    a. Initialize the word's total weight to 0.
#    b. Iterate through each character in the word.
#    c. For each character, find its corresponding weight from the `weights` array.
#       The index for a character 'c' is ord(c) - ord('a').
#    d. Add the character's weight to the word's total weight.
#    e. After processing all characters in the word, calculate the word's mapped index:
#       `mapped_index = total_weight % 26`.
#    f. Convert this `mapped_index` to a character using reverse alphabetical order.
#       The mapping is: 0 -> 'z', 1 -> 'y', ..., 25 -> 'a'.
#       This can be achieved by `chr(ord('a') + 25 - mapped_index)`.
#    g. Append the mapped character to the result string.
# 2. Return the concatenated result string.
#
# Time Complexity:
# Let N be the number of words and L be the maximum length of a word.
# The outer loop iterates through N words.
# The inner loop iterates through the characters of each word, at most L times.
# Calculating the weight and mapping takes constant time per character.
# Therefore, the total time complexity is O(N * L).
#
# Space Complexity:
# The `result` string can store up to N characters.
# Other variables use constant extra space.
# Therefore, the space complexity is O(N) for the output string.
class Solution:
    def weightedWordMapping(self, words: list[str], weights: list[int]) -> str:
        # Initialize an empty string to store the concatenated mapped characters.
        result = ""

        # Iterate through each word in the input 'words' array.
        for word in words:
            # Initialize the total weight for the current word to 0.
            word_weight = 0
            # Iterate through each character in the current word.
            for char in word:
                # Calculate the index of the character in the alphabet (0 for 'a', 1 for 'b', etc.).
                char_index = ord(char) - ord('a')
                # Add the weight of the character from the 'weights' array to the word's total weight.
                word_weight += weights[char_index]

            # Calculate the mapped index by taking the word's total weight modulo 26.
            mapped_index = word_weight % 26

            # Convert the mapped index to a character using reverse alphabetical order.
            # 0 maps to 'z', 1 to 'y', ..., 25 to 'a'.
            # The ASCII value for 'a' is 97. The ASCII value for 'z' is 122.
            # The formula `ord('a') + 25 - mapped_index` achieves this mapping.
            # For example:
            # if mapped_index is 0, it becomes ord('a') + 25 = 97 + 25 = 122, which is 'z'.
            # if mapped_index is 25, it becomes ord('a') + 0 = 97, which is 'a'.
            mapped_char = chr(ord('a') + 25 - mapped_index)

            # Append the mapped character to the result string.
            result += mapped_char

        # Return the final string formed by concatenating all mapped characters.
        return result

```