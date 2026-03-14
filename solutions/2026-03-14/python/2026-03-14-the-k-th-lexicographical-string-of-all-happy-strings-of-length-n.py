```python
# Problem Summary: Find the k-th lexicographically smallest happy string of length n.
# A happy string consists only of 'a', 'b', 'c' and no adjacent characters are the same.
# Link: https://leetcode.com/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/
#
# Approach:
# We can use a backtracking (depth-first search) approach to generate all happy strings of length n in lexicographical order.
# We maintain a global counter `k` and decrement it each time we generate a valid happy string.
# When `k` becomes 0, we have found the k-th string and can stop the search.
# The backtracking function will recursively build the string. At each step, it tries to append 'a', 'b', or 'c'
# if the character is different from the last character added to the string.
#
# Time Complexity:
# The maximum number of happy strings of length n is limited. For each position, there are at most 2 choices for the next character.
# So, the total number of happy strings is at most 3 * 2^(n-1).
# In the worst case, we might generate up to k happy strings. Since k is at most 100 and n is at most 10,
# the total number of strings generated will be relatively small.
# The time complexity can be considered O(min(k, 3 * 2^(n-1)) * n), where the `n` factor comes from string concatenations or building.
# Given the constraints, this is efficient enough.
#
# Space Complexity:
# The space complexity is dominated by the recursion depth of the backtracking function, which is `n` (the length of the string),
# and the space used to store the current happy string being built, which is also O(n).
# Therefore, the space complexity is O(n).

class Solution:
    def getHappyString(self, n: int, k: int) -> str:
        self.result = ""  # To store the k-th happy string
        self.k = k        # Global counter for k
        self.chars = ['a', 'b', 'c'] # Possible characters

        # Start the backtracking process
        # We iterate through the initial characters to ensure lexicographical order
        for char in self.chars:
            self._backtrack(char, n)
            if self.result: # If k-th string is found, we can stop
                break
        
        return self.result

    def _backtrack(self, current_string: str, length: int):
        # If we have already found the k-th string, stop further exploration
        if self.result:
            return

        # If the current string has reached the desired length
        if len(current_string) == length:
            self.k -= 1 # Decrement k as we found a valid happy string
            if self.k == 0: # If this is the k-th string
                self.result = current_string # Store it
            return

        # Try appending each of the possible characters
        for char in self.chars:
            # Check if the new character is different from the last character of the current string
            if current_string[-1] != char:
                # Recursively call backtrack with the new string
                self._backtrack(current_string + char, length)
                # If the k-th string is found during the recursive call, we can propagate the exit
                if self.result:
                    return

# Example Usage (for testing locally):
# sol = Solution()
# print(sol.getHappyString(1, 3)) # Output: "c"
# print(sol.getHappyString(1, 4)) # Output: ""
# print(sol.getHappyString(3, 9)) # Output: "cab"
# print(sol.getHappyString(2, 7)) # Output: "" (only 6 happy strings of length 2: ab, ac, ba, bc, ca, cb)
```