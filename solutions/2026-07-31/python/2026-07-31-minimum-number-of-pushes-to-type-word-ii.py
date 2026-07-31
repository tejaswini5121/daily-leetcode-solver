```python
# Summary: Minimize key presses for typing a word by remapping telephone keys.
# Link: https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii/
# Approach:
# The core idea is to assign the most frequent characters to keys that require fewer presses.
# We can use a frequency map to count the occurrences of each character in the input word.
# Then, sort the frequencies in descending order.
# We have 8 available keys (2-9). Each key can hold up to 3 characters before its press count increases.
# We can distribute the characters greedily:
# - The top 8 most frequent characters will be assigned to keys requiring 1 press.
# - The next 8 most frequent characters will be assigned to keys requiring 2 presses.
# - The remaining characters will be assigned to keys requiring 3 presses.
# We iterate through the sorted frequencies and assign them to these "slots" (1-press, 2-press, 3-press).
# For each character, we calculate its contribution to the total pushes by multiplying its frequency by the number of presses required for its assigned slot.
#
# Time Complexity: O(N + 26 log 26) where N is the length of the word.
#   - O(N) for counting character frequencies.
#   - O(26 log 26) for sorting the frequencies (since there are only 26 lowercase English letters).
#   - The distribution and summation take O(26) time.
#   Overall, the dominant factor is O(N) if N is significantly larger than 26.
# Space Complexity: O(26) for the frequency map, which is constant space.
import collections

class Solution:
    def minimumPushes(self, word: str) -> int:
        # Count the frequency of each character in the word.
        # collections.Counter is a dictionary subclass for counting hashable objects.
        freq_map = collections.Counter(word)

        # Get the frequencies as a list and sort them in descending order.
        # This ensures that the most frequent characters are processed first.
        sorted_frequencies = sorted(freq_map.values(), reverse=True)

        total_pushes = 0
        # The number of keys available is 8 (keys 2 through 9).
        num_available_keys = 8
        # The press count for each key starts at 1.
        press_count = 1
        # The index to keep track of which character frequency we are processing.
        freq_index = 0

        # We iterate in rounds, where each round corresponds to an increase in press count.
        # For example, the first 8 characters (most frequent) get 1 press.
        # The next 8 characters get 2 presses, and so on.
        while freq_index < len(sorted_frequencies):
            # For the current press_count, we can assign up to num_available_keys characters.
            # We iterate through the characters that will be assigned this press_count.
            for i in range(num_available_keys):
                # Check if we have processed all character frequencies.
                if freq_index >= len(sorted_frequencies):
                    break

                # Get the frequency of the current character.
                current_freq = sorted_frequencies[freq_index]
                # Add the cost for this character: frequency * press_count.
                total_pushes += current_freq * press_count

                # Move to the next character frequency.
                freq_index += 1

            # After assigning characters to all available keys for the current press_count,
            # we increment the press_count for the next round of assignments.
            press_count += 1

        # Return the total minimum number of pushes required.
        return total_pushes

```