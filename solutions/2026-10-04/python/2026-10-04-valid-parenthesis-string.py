```python
# Problem: Valid Parenthesis String
# Summary: Determines if a string containing '(', ')', and '*' is valid,
# where '*' can act as '(', ')', or an empty string.
# Link: https://leetcode.com/problems/valid-parenthesis-string/
#
# Approach:
# We can solve this problem using a greedy approach by keeping track of the
# possible range of open parentheses. We maintain two variables: `min_open`
# and `max_open`.
#
# `min_open` represents the minimum possible number of open parentheses required
# at the current position if we treat '*' optimally to close parentheses.
# `max_open` represents the maximum possible number of open parentheses at the
# current position if we treat '*' optimally to open parentheses.
#
# When we encounter '(':
#   - `min_open` increases by 1.
#   - `max_open` increases by 1.
# When we encounter ')':
#   - `min_open` decreases by 1.
#   - `max_open` decreases by 1.
# When we encounter '*':
#   - `min_open` decreases by 1 (if treated as ')').
#   - `max_open` increases by 1 (if treated as '(').
#   - If we treat '*' as an empty string, neither `min_open` nor `max_open` changes.
#
# Important considerations:
# - `min_open` can never be negative. If it becomes negative, it means we have
#   an excess of closing parentheses that cannot be balanced even by treating
#   all preceding '*' as '('. So, we reset `min_open` to 0.
# - If `max_open` becomes negative at any point, it means we have more closing
#   parentheses than can possibly be matched by open parentheses and '*' treated
#   as open parentheses. In this case, the string is invalid.
#
# Finally, for the string to be valid, `min_open` must be 0 at the end. This
# ensures that all open parentheses have been matched.
#
# Time Complexity: O(n), where n is the length of the string. We iterate through
# the string once.
# Space Complexity: O(1), as we only use a few variables to keep track of counts.

def checkValidString(s: str) -> bool:
    """
    Checks if a string containing '(', ')', and '*' is valid.

    Args:
        s: The input string.

    Returns:
        True if the string is valid, False otherwise.
    """
    min_open = 0  # Minimum possible number of open parentheses
    max_open = 0  # Maximum possible number of open parentheses

    for char in s:
        if char == '(':
            min_open += 1
            max_open += 1
        elif char == ')':
            min_open -= 1
            max_open -= 1
        elif char == '*':
            # If '*' is treated as ')', min_open decreases.
            # If '*' is treated as '(', max_open increases.
            # If '*' is treated as empty, no change for either.
            # So, for '*' we effectively have a range:
            min_open -= 1  # Treat '*' as ')' to minimize open count
            max_open += 1  # Treat '*' as '(' to maximize open count

        # If max_open becomes negative, it means we have an imbalance of
        # closing parentheses that cannot be resolved, even by treating all
        # '*' as opening parentheses.
        if max_open < 0:
            return False

        # min_open cannot be less than 0. If it drops below 0, it means
        # we've encountered more ')' than '(' can balance so far. We reset
        # it to 0, effectively treating some '*' as empty strings or '('.
        min_open = max(0, min_open)

    # For the string to be valid, the minimum number of open parentheses
    # remaining must be exactly 0. This means all open parentheses have been closed.
    return min_open == 0

```