# Processes a string with special operations.
# Link: https://leetcode.com/problems/process-string-with-special-operations-i/
#
# Approach:
# We iterate through the input string `s` character by character. We maintain a list `result`
# to build the processed string.
# - If the character is a lowercase letter, we append it to `result`.
# - If the character is '*', we remove the last element from `result` if `result` is not empty.
# - If the character is '#', we duplicate the current `result` by appending it to itself.
# - If the character is '%', we reverse the `result` list.
# Finally, we join the characters in `result` to form the final string.
#
# Time Complexity: O(N*M), where N is the length of the input string `s` and M is the
# maximum length of the intermediate `result` string. Operations like '#' and '%' can
# potentially double the length of `result` in each step, leading to a quadratic growth
# in the worst case. However, given the constraint `s.length <= 20`, the maximum length
# of `result` will be manageable.
# Space Complexity: O(M), where M is the maximum length of the intermediate `result` string.

class Solution:
    def finalString(self, s: str) -> str:
        # Initialize an empty list to store the processed characters.
        result = []

        # Iterate through each character in the input string `s`.
        for char in s:
            # If the character is a lowercase letter, append it to the result list.
            if 'a' <= char <= 'z':
                result.append(char)
            # If the character is '*', remove the last character from result if it exists.
            elif char == '*':
                if result:  # Check if result is not empty before popping
                    result.pop()
            # If the character is '#', duplicate the current result and append it to itself.
            elif char == '#':
                # Create a copy of the current result and extend the original result with the copy.
                result.extend(result.copy())
            # If the character is '%', reverse the current result.
            elif char == '%':
                result.reverse()

        # Join the characters in the result list to form the final string.
        return "".join(result)

```