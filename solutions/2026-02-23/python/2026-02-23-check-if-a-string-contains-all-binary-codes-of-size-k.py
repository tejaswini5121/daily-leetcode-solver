```python
# Problem: Check If a String Contains All Binary Codes of Size K
# Summary: Checks if all possible binary strings of length k are substrings of a given binary string s.
# Link: https://leetcode.com/problems/check-if-a-string-contains-all-binary-codes-of-size-k/

# Approach:
# The core idea is to find all unique substrings of length k in the given string s and store them in a set.
# The total number of unique binary codes of length k is 2^k.
# If the size of the set of unique substrings of length k equals 2^k, it means all possible binary codes of length k are present as substrings in s.
# We can efficiently extract all substrings of length k by iterating through the string s from index 0 up to s.length - k.
# For each starting index i, the substring will be s[i : i + k].
# We add each of these substrings to a set.
# Finally, we compare the size of the set with 2^k.

# Time Complexity: O(N * K), where N is the length of the string s.
# This is because we iterate through the string once to extract substrings, and slicing a substring of length K takes O(K) time.
# If we consider the set insertion as O(1) on average (for hashable strings), the dominant factor is the slicing.
# Alternatively, if we use a rolling hash or bit manipulation to represent the substrings, we can achieve O(N) time complexity.
# For this solution, we are using string slicing, which leads to O(N*K). A more optimized approach using bit manipulation or rolling hash would be O(N).
# Given the constraints (s.length <= 5*10^5, k <= 20), N*K can be up to 10^7, which is acceptable.

# Space Complexity: O(2^K * K) in the worst case, where 2^K is the number of unique binary codes of length k, and K is the length of each code.
# The set stores up to 2^K unique binary strings, each of length K.
# However, if K is small (e.g., K=20, 2^K is about 1 million), this can be significant.
# With the given constraints, K <= 20, so 2^K can be up to 2^20 which is ~1 million. The space for storing these strings will be around 1 million * 20 bits (or bytes if string representation) which is manageable.

class Solution:
    def hasAllCodes(self, s: str, k: int) -> bool:
        # Calculate the total number of unique binary codes of length k.
        # This is 2 raised to the power of k.
        required_codes_count = 1 << k  # Equivalent to 2**k

        # Create a set to store the unique binary substrings of length k found in s.
        found_codes = set()

        # Iterate through the string s to extract all substrings of length k.
        # The loop runs from index 0 up to len(s) - k (inclusive),
        # ensuring that the substring s[i:i+k] is valid.
        for i in range(len(s) - k + 1):
            # Extract the substring of length k starting at index i.
            substring = s[i : i + k]
            # Add the extracted substring to the set. Sets automatically handle uniqueness.
            found_codes.add(substring)

        # Check if the number of unique codes found is equal to the total number of required codes.
        # If they are equal, it means all binary codes of length k are present as substrings in s.
        return len(found_codes) == required_codes_count

```