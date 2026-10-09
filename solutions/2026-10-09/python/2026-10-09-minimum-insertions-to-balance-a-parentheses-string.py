```python
# Problem: Minimum Insertions to Balance a Parentheses String
# Link: https://leetcode.com/problems/minimum-insertions-to-balance-a-parentheses-string/
#
# Approach:
# We can solve this problem by iterating through the string and keeping track of the number of open parentheses that need to be closed.
# We maintain a `balance` variable, which represents the number of unmatched open parentheses.
# For each character:
# If it's '(', we increment `balance` because it needs two ')' to be balanced.
# If it's ')':
#   We check if the next character is also ')'.
#   If it is, we have a '))' pair. If `balance` is greater than 0, we decrement `balance` (as one '(' is now matched). If `balance` is 0, we need to insert an opening parenthesis, so we increment `insertions`. We then skip the next character as it's part of the current pair.
#   If it's not, we have a single ')'. If `balance` is greater than 0, we decrement `balance` and increment `insertions` by 1 (to add the second missing ')'). If `balance` is 0, we need to insert an opening parenthesis and another closing parenthesis, so we increment `insertions` by 2.
# After iterating through the string, any remaining `balance` means we have unmatched open parentheses. Each open parenthesis requires two closing parentheses, so we add `balance * 2` to `insertions`.
#
# Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
# Space Complexity: O(1), as we only use a few variables to store counts.

class Solution:
    def minInsertions(self, s: str) -> int:
        insertions = 0  # Number of insertions needed
        balance = 0     # Represents the count of unmatched open parentheses '('. Each '(' needs '))'
        i = 0           # Pointer to iterate through the string
        n = len(s)      # Length of the string

        while i < n:
            char = s[i]

            if char == '(':
                # If we see an open parenthesis, we need two closing parentheses for it.
                # So, we increment the balance by 2.
                balance += 2
                i += 1
            else: # char == ')'
                # If we see a closing parenthesis:

                # Check if the next character is also a closing parenthesis.
                if i + 1 < n and s[i+1] == ')':
                    # We have a '))' pair.
                    if balance >= 2:
                        # If we have at least two required closing parentheses (meaning at least one unmatched '('),
                        # we consume two ')' for one '('.
                        balance -= 2
                    elif balance == 1:
                        # If we need one ')' (meaning we are looking for the second ')' of a pair),
                        # this ')' completes that pair, but we still need to insert one ')' for the open bracket.
                        # So, we need to insert one ')' and consume the current ')' pair.
                        insertions += 1
                        balance -= 1 # Since we have found one matching ')' pair.
                    else: # balance == 0
                        # If balance is 0, it means no open parenthesis is waiting for a '))'.
                        # This '))' needs a preceding '('. So, we insert one '('.
                        insertions += 1
                        # We also need another ')' for this inserted '('.
                        # But we already have '))', so we are good for the inserted '('.
                        # Effectively, we consumed one ')' and inserted one '('.
                        # The balance remains 0.
                        pass # No change to balance, but we have handled the ')' pair.
                    i += 2 # Move past both closing parentheses.
                else:
                    # We have a single ')'. This means we are missing one ')' to form a '))' pair.
                    if balance >= 2:
                        # If we need at least two closing parentheses (meaning at least one unmatched '('),
                        # this single ')' can be considered as the first of a '))' pair.
                        # We decrement balance by 1, signifying we've partially matched an '('.
                        # We then need to insert one more ')' to complete the pair for this '('.
                        balance -= 1
                        insertions += 1
                    elif balance == 1:
                        # If we need exactly one closing parenthesis (meaning we are looking for the second ')' for an unmatched '('),
                        # this single ')' fulfills that need.
                        balance -= 1 # The '(' is now balanced.
                    else: # balance == 0
                        # If balance is 0, this single ')' needs a preceding '(' and another ')'.
                        # So, we insert one '(' and one ')'.
                        insertions += 2
                    i += 1 # Move past the single closing parenthesis.

        # After iterating through the string, any remaining 'balance' means we have unmatched open parentheses.
        # Each unmatched open parenthesis requires two closing parentheses.
        insertions += balance
        return insertions

```