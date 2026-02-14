```python
# Summary: Simulate champagne pouring into a pyramid of glasses and determine the fill level of a specific glass.
# Link: https://leetcode.com/problems/champagne-tower/
# Approach: Dynamic Programming. We can use a 2D array (or a list of lists in Python) to represent the glasses in the tower.
# dp[i][j] will store the amount of champagne that reaches glass (i, j).
# The top glass (0, 0) receives the total poured amount.
# For any glass (i, j) that receives more than 1 cup of champagne, the excess overflows equally to the glasses (i+1, j) and (i+1, j+1).
# We iterate through the rows, calculating the amount of champagne in each glass based on the overflow from the glass above.
# The amount in a glass is capped at 1.0.
# Finally, we return the amount in the queried glass (query_row, query_glass), ensuring it's not more than 1.0.
# Time complexity: O(R^2), where R is the query_row. Since query_row < 100, this is effectively O(1) in terms of problem constraints.
# Space complexity: O(R^2) for storing the DP table. Similar to time complexity, this is O(1) given the constraints.

class Solution:
    def champagneTower(self, poured: int, query_row: int, query_glass: int) -> float:
        # Initialize a 2D DP table (list of lists) to store the amount of champagne in each glass.
        # The size of the table should be enough to cover all rows up to query_row.
        # We use query_row + 1 rows and query_row + 1 columns.
        # Each element is initialized to 0.0.
        dp = [[0.0] * (query_row + 1) for _ in range(query_row + 1)]

        # The top glass (0, 0) receives all the poured champagne initially.
        dp[0][0] = float(poured)

        # Iterate through each row up to the query_row.
        for r in range(query_row + 1):
            # Iterate through each glass in the current row.
            # The number of glasses in row r is r + 1.
            for c in range(r + 1):
                # If the current glass has more than 1 cup of champagne, it overflows.
                # The excess amount is (current_amount - 1.0).
                overflow = max(0.0, dp[r][c] - 1.0)

                # If there's an overflow, it's split equally between the two glasses below:
                # 1. The glass directly below and to the left (r+1, c).
                # 2. The glass directly below and to the right (r+1, c+1).

                # Add half of the overflow to the glass at (r+1, c), if it exists (i.e., r+1 is within bounds).
                if r + 1 <= query_row:
                    dp[r + 1][c] += overflow / 2.0

                # Add half of the overflow to the glass at (r+1, c+1), if it exists (i.e., c+1 is within bounds for row r+1).
                if r + 1 <= query_row and c + 1 <= r + 1: # Ensure c+1 is a valid index for the next row
                    dp[r + 1][c + 1] += overflow / 2.0

        # The amount of champagne in the queried glass is dp[query_row][query_glass].
        # Since a glass can hold at most 1 cup, we take the minimum of the calculated amount and 1.0.
        return min(1.0, dp[query_row][query_glass])
```