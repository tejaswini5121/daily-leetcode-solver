```python
# Problem Summary: Find the minimum number of key presses to type a given word
# with distinct letters, by optimally remapping telephone keys.
# Link: https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-i/
#
# Approach:
# The problem asks us to minimize the total number of pushes. To achieve this,
# we should map the most frequent letters to keys that require fewer pushes (i.e.,
# mapping them to be the first or second letter on a key). Since all letters
# in the input `word` are distinct, the frequency of each letter is effectively 1.
#
# We can think of the available keys as 8 keys (2-9).
# - The first 8 letters can be mapped to be the first letter on each of the 8 keys. This requires 1 push each.
# - The next 8 letters can be mapped to be the second letter on each of the 8 keys. This requires 2 pushes each.
# - The remaining letters (up to 26) can be mapped to be the third letter on each of the 8 keys. This requires 3 pushes each.
#
# Therefore, the strategy is to sort the letters of the input `word` in any order
# (since they all have a frequency of 1) and then assign them to the keys in a way
# that utilizes the 1-push positions first, then 2-push positions, and then 3-push positions.
#
# We can iterate through the letters of the word and assign them to "slots".
# Slot 1: 8 letters, each costing 1 push.
# Slot 2: 8 letters, each costing 2 pushes.
# Slot 3: Remaining letters, each costing 3 pushes.
#
# The total number of pushes will be the sum of pushes for each letter.
# For example, if the word has length 10:
# - The first 8 letters will cost 1 push each (total 8 * 1 = 8).
# - The next 2 letters will cost 2 pushes each (total 2 * 2 = 4).
# Total pushes = 8 + 4 = 12.
#
# Time Complexity Analysis:
# - Sorting the word is not strictly necessary because all characters are distinct and
#   we are assigning them greedily to slots. The length of the word is at most 26.
# - We iterate through the word once to calculate the pushes.
# - The calculation involves simple arithmetic operations.
# Therefore, the time complexity is O(N), where N is the length of the word.
# Since N <= 26, this is effectively O(1) constant time.
#
# Space Complexity Analysis:
# - We are not using any extra data structures that grow with the input size,
#   beyond a few variables for calculation.
# Therefore, the space complexity is O(1).
#
class Solution:
    def minimumPushes(self, word: str) -> int:
        # The length of the word. Since all letters are distinct, each letter's frequency is 1.
        n = len(word)
        
        # Initialize the total number of pushes to 0.
        total_pushes = 0
        
        # Calculate pushes for letters mapped to be the first on a key (1 push).
        # There are 8 such positions available across 8 keys (2-9).
        # If n is less than or equal to 8, all letters use 1 push.
        # If n is greater than 8, the first 8 letters use 1 push.
        pushes_for_slot_1 = min(n, 8) * 1
        total_pushes += pushes_for_slot_1
        
        # If there are more letters, calculate pushes for letters mapped to be the second on a key (2 pushes).
        # There are another 8 such positions available.
        # We consider letters remaining after the first 8.
        remaining_letters_after_slot_1 = max(0, n - 8)
        pushes_for_slot_2 = min(remaining_letters_after_slot_1, 8) * 2
        total_pushes += pushes_for_slot_2
        
        # If there are still more letters, calculate pushes for letters mapped to be the third on a key (3 pushes).
        # The remaining letters after the first 16 (8 from slot 1 + 8 from slot 2).
        remaining_letters_after_slot_2 = max(0, n - 16)
        pushes_for_slot_3 = remaining_letters_after_slot_2 * 3
        total_pushes += pushes_for_slot_3
        
        # Return the total calculated pushes.
        return total_pushes

```