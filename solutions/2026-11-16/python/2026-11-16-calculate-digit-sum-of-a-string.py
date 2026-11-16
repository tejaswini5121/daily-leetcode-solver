```python
# LeetCode Problem: Calculate Digit Sum of a String
# Difficulty: Easy
# Topics: String, Simulation
# Link: https://leetcode.com/problems/calculate-digit-sum-of-a-string/

# Approach:
# The problem requires repeatedly performing an operation until the string's length is no longer greater than k.
# In each round:
# 1. The string 's' is divided into contiguous groups of size 'k'. The last group might be smaller.
# 2. For each group, the sum of its digits is calculated. This sum is then converted back to a string.
# 3. These new string representations of the sums are concatenated to form the new string 's'.
# This process continues as long as the length of 's' is greater than 'k'.

# Time Complexity: O(N * log_k(N)), where N is the initial length of 's'.
# In each round, the length of 's' is reduced by a factor of roughly k (since a sum of k digits typically results in a string of 1 or 2 digits).
# The number of rounds is logarithmic with base k.
# In each round, we iterate through the string once to form groups and sum digits.
# The summation of digits in a group of size k takes O(k) time. Converting the sum back to a string takes O(log(sum)) which is roughly O(log(k)) if the sum is small.
# The total length of the string processed in a round is N. So, each round is approximately O(N).
# Therefore, the overall time complexity is O(N * log_k(N)). Given the constraints (N <= 100), this is very efficient.

# Space Complexity: O(N) in the worst case, to store the new string 's' in each round.
# The intermediate strings formed by sums also contribute to space, but their lengths are bounded.

class Solution:
    def digitSum(self, s: str, k: int) -> str:
        # Continue rounds as long as the length of the string 's' is greater than 'k'.
        while len(s) > k:
            new_s = ""  # Initialize an empty string to build the result of the current round.
            
            # Iterate through the string 's' in steps of 'k' to form groups.
            for i in range(0, len(s), k):
                # Extract the current group of characters. The slice will automatically handle the last group which might be smaller than 'k'.
                group = s[i : i + k]
                
                current_sum = 0  # Initialize sum for the current group.
                # Iterate through each character (digit) in the group.
                for digit_char in group:
                    # Convert the character digit to an integer and add it to the sum.
                    current_sum += int(digit_char)
                
                # Convert the calculated sum back to a string and append it to 'new_s'.
                new_s += str(current_sum)
            
            # After processing all groups in the round, update 's' with the newly formed string.
            s = new_s
        
        # Once the loop finishes, it means len(s) <= k. Return the final string 's'.
        return s

# Example Usage (for testing purposes, not part of the LeetCode submission)
# sol = Solution()
# print(sol.digitSum("11111222223", 3))  # Output: "135"
# print(sol.digitSum("00000000", 3))     # Output: "000"
# print(sol.digitSum("11", 3))          # Output: "11" (length is already <= k)
```