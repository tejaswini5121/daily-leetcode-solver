```python
# Problem: Binary Gap
# Summary: Find the longest distance between adjacent 1s in the binary representation of a number.
# Link: https://leetcode.com/problems/binary-gap/

# Approach:
# 1. Convert the integer to its binary string representation.
# 2. Iterate through the binary string to find the positions of all '1's.
# 3. Keep track of the index of the last encountered '1'.
# 4. For each subsequent '1' found, calculate the distance from the previous '1' and update the maximum distance if the current distance is greater.
# 5. If no two '1's are found, the maximum distance remains 0.

# Time Complexity: O(log n) - The conversion to binary string takes O(log n) time, and iterating through the string also takes O(log n) time, where n is the input integer.
# Space Complexity: O(log n) - The binary string representation of n can have a length of O(log n).

class Solution:
    def binaryGap(self, n: int) -> int:
        # Convert the integer to its binary representation.
        # The bin() function returns a string like "0b10110".
        # We slice from index 2 to remove the "0b" prefix.
        binary_representation = bin(n)[2:]

        # Initialize the maximum gap found so far.
        max_gap = 0
        # Initialize the index of the last encountered '1'.
        # We use -1 to indicate that no '1' has been found yet.
        last_one_index = -1

        # Iterate through the binary string with both index and character.
        for i, bit in enumerate(binary_representation):
            # If the current bit is '1':
            if bit == '1':
                # Check if we have encountered a previous '1'.
                if last_one_index != -1:
                    # Calculate the distance between the current '1' and the last '1'.
                    # The distance is the difference in their indices.
                    current_gap = i - last_one_index
                    # Update the maximum gap if the current gap is larger.
                    max_gap = max(max_gap, current_gap)

                # Update the index of the last encountered '1' to the current index.
                last_one_index = i

        # Return the maximum gap found. If no adjacent 1s were found, max_gap will remain 0.
        return max_gap

```