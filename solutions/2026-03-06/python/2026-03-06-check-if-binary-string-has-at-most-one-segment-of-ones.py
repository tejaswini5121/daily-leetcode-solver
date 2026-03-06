```python
# Problem: Check if Binary String Has at Most One Segment of Ones
# Link: https://leetcode.com/problems/check-if-binary-string-has-at-most-one-segment-of-ones/
#
# Approach:
# The problem asks us to determine if a binary string has at most one contiguous
# block of '1's. Since the input string is guaranteed to not have leading zeros
# and s[0] is always '1', we know the string must start with a '1' (or be just "1").
#
# We can iterate through the string and keep track of whether we are currently
# inside a segment of ones.
#
# 1. Initialize a flag `in_ones_segment` to `False`.
# 2. Iterate through the string from the second character onwards (index 1).
# 3. If the current character is '1':
#    a. If `in_ones_segment` is already `True`, it means we've encountered
#       a new '1' after already being in a segment of ones. This implies
#       there are at least two separate segments of ones (e.g., "101"), so
#       we can immediately return `False`.
#    b. If `in_ones_segment` is `False`, it means this is the start of a new
#       segment of ones, so set `in_ones_segment` to `True`.
# 4. If the current character is '0':
#    a. We are no longer in a segment of ones, so set `in_ones_segment` to `False`.
# 5. If the loop completes without returning `False`, it means there was at most
#    one segment of ones. Return `True`.
#
# Example: s = "11010"
# - i=0, s[0]='1'. `in_ones_segment` is initially False. We assume we are in the first segment.
# - i=1, s[1]='1'. `in_ones_segment` is False. Set `in_ones_segment` to True.
# - i=2, s[2]='0'. Set `in_ones_segment` to False.
# - i=3, s[3]='1'. `in_ones_segment` is False. Set `in_ones_segment` to True.
# - i=4, s[4]='0'. Set `in_ones_segment` to False.
# Loop ends. Return True. (Wait, this is wrong. The logic needs refinement.)
#
# Let's rethink the logic. The issue is detecting a *second* segment of ones.
# If we encounter a '1' and we have *already* seen a '1' and then a '0', it means
# we are starting a new segment of ones.
#
# Revised Approach:
# 1. Initialize a counter `one_segments_found` to 0.
# 2. Initialize a boolean `encountered_zero` to `False`.
# 3. Iterate through the string.
# 4. If the current character is '1':
#    a. If `encountered_zero` is `True`, it means we previously saw a '0' and now we are seeing a '1' again. This signifies a new segment of ones. Increment `one_segments_found`.
#    b. If `one_segments_found` becomes greater than 1, return `False` immediately.
# 5. If the current character is '0':
#    a. Set `encountered_zero` to `True`.
# 6. If the loop completes, return `True` (because `one_segments_found` will be 0 or 1).
#
# Example: s = "1001"
# - i=0, s[0]='1'. `encountered_zero`=False. `one_segments_found`=0.
# - i=1, s[1]='0'. `encountered_zero`=True.
# - i=2, s[2]='0'. `encountered_zero`=True.
# - i=3, s[3]='1'. `encountered_zero`=True. Increment `one_segments_found` to 1. `one_segments_found` is not > 1.
# Loop ends. Return True. (This is still wrong for "1001" which should be False).
#
# The problem is that "1001" has two segments of ones separated by zeros.
#
# The most straightforward way might be to find the first '1', then the last '1',
# and check if all characters between them (inclusive) are '1's.
#
# Let's try the approach of checking for "11" pattern after a "10" pattern.
#
# Simplified Approach:
# Iterate through the string.
# If we find a '1' followed by a '0', this marks the potential end of the *first* segment of ones.
# After this point, if we encounter another '1', it means there is a second segment of ones.
#
# 1. Initialize a boolean flag `found_zero_after_one` to `False`.
# 2. Iterate through the string from index 0 to length-1.
# 3. If `s[i] == '1'`:
#    a. If `found_zero_after_one` is `True`, it means we previously saw a '1' followed by a '0', and now we've found another '1'. This is a second segment. Return `False`.
# 4. If `s[i] == '0'`:
#    a. We've now seen a '0' after potentially seeing some '1's. Set `found_zero_after_one` to `True`.
# 5. If the loop completes, return `True`.
#
# Example: s = "1001"
# - i=0, s[0]='1'. `found_zero_after_one`=False.
# - i=1, s[1]='0'. `found_zero_after_one`=True.
# - i=2, s[2]='0'. `found_zero_after_one`=True.
# - i=3, s[3]='1'. `found_zero_after_one` is True. Return `False`. (Correct!)
#
# Example: s = "110"
# - i=0, s[0]='1'. `found_zero_after_one`=False.
# - i=1, s[1]='1'. `found_zero_after_one`=False.
# - i=2, s[2]='0'. `found_zero_after_one`=True.
# Loop ends. Return `True`. (Correct!)
#
# Example: s = "1"
# - i=0, s[0]='1'. `found_zero_after_one`=False.
# Loop ends. Return `True`. (Correct!)
#
# Example: s = "111"
# - i=0, s[0]='1'. `found_zero_after_one`=False.
# - i=1, s[1]='1'. `found_zero_after_one`=False.
# - i=2, s[2]='1'. `found_zero_after_one`=False.
# Loop ends. Return `True`. (Correct!)
#
# This approach seems robust.
#
# Time Complexity: O(N), where N is the length of the string. We iterate through the string once.
# Space Complexity: O(1), as we only use a constant amount of extra space for the flag.
class Solution:
    def checkOnesSegment(self, s: str) -> bool:
        # Flag to indicate if we have encountered a '0' after seeing a '1'.
        # If this is True and we then see another '1', it means we have a second segment of ones.
        found_zero_after_one = False

        # Iterate through the string to check the pattern.
        for char in s:
            if char == '1':
                # If we have already seen a '0' after a '1' (meaning found_zero_after_one is True)
                # and we encounter another '1', it implies a second segment of ones.
                if found_zero_after_one:
                    return False
            else: # char == '0'
                # Once we encounter a '0', we set the flag to True.
                # Any subsequent '1' will then trigger the False return if this flag is True.
                found_zero_after_one = True

        # If the loop completes without returning False, it means there was at most one segment of ones.
        return True

```