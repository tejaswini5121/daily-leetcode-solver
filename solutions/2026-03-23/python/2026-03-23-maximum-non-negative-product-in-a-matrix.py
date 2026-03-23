```python
# Problem: Maximum Non-Negative Product in a Matrix
# Link: https://leetcode.com/problems/maximum-non-negative-product-in-a-matrix/
#
# Approach:
# This problem can be solved using dynamic programming. For each cell (i, j) in the grid, we need to keep track of two values:
# 1. The maximum possible non-negative product to reach this cell.
# 2. The minimum possible product (most negative) to reach this cell. This is important because multiplying a negative product by a negative number can result in a large positive product.
#
# We can define two DP tables: `max_prod[i][j]` and `min_prod[i][j]`.
#
# Base Case:
# For the starting cell (0, 0):
# `max_prod[0][0] = grid[0][0]`
# `min_prod[0][0] = grid[0][0]`
#
# Recurrence Relation:
# For any cell (i, j), we can reach it either from (i-1, j) (moving down) or from (i, j-1) (moving right).
#
# When `grid[i][j]` is non-negative:
# `max_prod[i][j]` will be `grid[i][j]` multiplied by the maximum of `max_prod[i-1][j]` and `max_prod[i][j-1]`.
# `min_prod[i][j]` will be `grid[i][j]` multiplied by the minimum of `min_prod[i-1][j]` and `min_prod[i][j-1]`.
#
# When `grid[i][j]` is negative:
# `max_prod[i][j]` will be `grid[i][j]` multiplied by the minimum of `min_prod[i-1][j]` and `min_prod[i][j-1]` (because multiplying a negative by the most negative gives the most positive).
# `min_prod[i][j]` will be `grid[i][j]` multiplied by the maximum of `max_prod[i-1][j]` and `max_prod[i][j-1]` (because multiplying a negative by the most positive gives the most negative).
#
# For cells on the first row (i=0, j>0):
# `max_prod[0][j] = grid[0][j] * max_prod[0][j-1]`
# `min_prod[0][j] = grid[0][j] * min_prod[0][j-1]`
#
# For cells on the first column (i>0, j=0):
# `max_prod[i][0] = grid[i][0] * max_prod[i-1][0]`
# `min_prod[i][0] = grid[i][0] * min_prod[i-1][0]`
#
# For general cells (i>0, j>0):
# Let `prev_max1 = max_prod[i-1][j]` and `prev_min1 = min_prod[i-1][j]`
# Let `prev_max2 = max_prod[i][j-1]` and `prev_min2 = min_prod[i][j-1]`
#
# Possible products at (i, j) are:
# `grid[i][j] * prev_max1`, `grid[i][j] * prev_min1`, `grid[i][j] * prev_max2`, `grid[i][j] * prev_min2`
#
# `max_prod[i][j] = max(grid[i][j] * prev_max1, grid[i][j] * prev_min1, grid[i][j] * prev_max2, grid[i][j] * prev_min2)`
# `min_prod[i][j] = min(grid[i][j] * prev_max1, grid[i][j] * prev_min1, grid[i][j] * prev_max2, grid[i][j] * prev_min2)`
#
# After filling the DP tables, the maximum non-negative product will be `max_prod[m-1][n-1]`.
# If `max_prod[m-1][n-1]` is negative, return -1. Otherwise, return `max_prod[m-1][n-1]` modulo 10^9 + 7.
#
# Time Complexity: O(m * n), where m is the number of rows and n is the number of columns. We visit each cell once.
# Space Complexity: O(m * n) for storing the DP tables. This can be optimized to O(min(m, n)) if we only store the previous row/column. However, given the constraints (m, n <= 15), O(m*n) is acceptable.
#
class Solution:
    def maxNonNegativeProduct(self, grid: list[list[int]]) -> int:
        m = len(grid)
        n = len(grid[0])
        MOD = 10**9 + 7

        # Initialize DP tables to store maximum and minimum products
        # max_prod[i][j]: maximum non-negative product to reach (i, j)
        # min_prod[i][j]: minimum (most negative) product to reach (i, j)
        max_prod = [[float('-inf')] * n for _ in range(m)]
        min_prod = [[float('inf')] * n for _ in range(m)]

        # Base case: starting cell (0, 0)
        max_prod[0][0] = grid[0][0]
        min_prod[0][0] = grid[0][0]

        # Fill the first row
        for j in range(1, n):
            val = grid[0][j]
            # If the current cell value is positive
            if val >= 0:
                max_prod[0][j] = val * max_prod[0][j-1]
                min_prod[0][j] = val * min_prod[0][j-1]
            # If the current cell value is negative
            else:
                max_prod[0][j] = val * min_prod[0][j-1] # Negative * min_negative = max_positive
                min_prod[0][j] = val * max_prod[0][j-1] # Negative * max_positive = min_negative

        # Fill the first column
        for i in range(1, m):
            val = grid[i][0]
            # If the current cell value is positive
            if val >= 0:
                max_prod[i][0] = val * max_prod[i-1][0]
                min_prod[i][0] = val * min_prod[i-1][0]
            # If the current cell value is negative
            else:
                max_prod[i][0] = val * min_prod[i-1][0] # Negative * min_negative = max_positive
                min_prod[i][0] = val * max_prod[i-1][0] # Negative * max_positive = min_negative

        # Fill the rest of the DP tables
        for i in range(1, m):
            for j in range(1, n):
                val = grid[i][j]

                # Products from the cell above (i-1, j)
                prod1_max = max_prod[i-1][j]
                prod1_min = min_prod[i-1][j]

                # Products from the cell to the left (i, j-1)
                prod2_max = max_prod[i][j-1]
                prod2_min = min_prod[i][j-1]

                # Calculate potential max and min products by considering all combinations
                # The candidate products are val * (max product from previous cells) and val * (min product from previous cells)
                # We need to take the max/min of these potential products.
                candidates = []
                if prod1_max != float('-inf'): # Ensure the path from above exists and is not uninitialized
                    candidates.append(val * prod1_max)
                    candidates.append(val * prod1_min)
                if prod2_max != float('-inf'): # Ensure the path from left exists and is not uninitialized
                    candidates.append(val * prod2_max)
                    candidates.append(val * prod2_min)
                
                # If there are no valid paths from previous cells (e.g., starting cell was 0 and subsequent values made paths impossible),
                # then we should only consider the current cell's value. This scenario is handled by the initial values of max/min_prod.
                # However, if `candidates` list is empty, it means that either grid[i][j] is 0 and previous products were also 0, or some issue occurred.
                # In a valid path, at least one of prod1_max/prod1_min or prod2_max/prod2_min will be valid after initialization.
                # The logic needs to ensure we pick the best among the possible paths.

                # Re-calculating `max_prod[i][j]` and `min_prod[i][j]` by considering all 4 products:
                # grid[i][j] * max_prod[i-1][j]
                # grid[i][j] * min_prod[i-1][j]
                # grid[i][j] * max_prod[i][j-1]
                # grid[i][j] * min_prod[i][j-1]

                # We need to find the max and min among these 4 values
                potential_prods = []
                if max_prod[i-1][j] != float('-inf'):
                    potential_prods.append(val * max_prod[i-1][j])
                    potential_prods.append(val * min_prod[i-1][j])
                if max_prod[i][j-1] != float('-inf'):
                    potential_prods.append(val * max_prod[i][j-1])
                    potential_prods.append(val * min_prod[i][j-1])
                
                if not potential_prods: # This case should ideally not happen for valid grids where path is possible.
                                        # It could happen if the initial cell itself prevents any path extension.
                                        # For example, if grid[0][0] = 0 and grid[0][1] = 0, then max_prod[0][1] = 0.
                                        # If we encounter a cell where both paths are impossible to extend validly,
                                        # this implies no path. But the problem guarantees connectivity.
                    # If no paths from previous cells resulted in valid products (e.g., due to initial negative infinities or previous zeros that lead to all zeros),
                    # the current cell's value is the only consideration for this DP state IF it can be reached.
                    # However, since we are iterating and building upon valid previous states, potential_prods should not be empty unless there's an issue.
                    # For this problem, we can assume that if i>0 or j>0, at least one valid path from previous cells exists.
                    # The initial `float('-inf')` and `float('inf')` are placeholders, not actual product values unless explicitly set.
                    # Let's rethink the logic slightly for clarity.

                    # Option 1: From top (i-1, j)
                    res_from_top = []
                    if max_prod[i-1][j] != float('-inf'): # If there's a valid max product from top
                        res_from_top.append(val * max_prod[i-1][j])
                        res_from_top.append(val * min_prod[i-1][j])
                    
                    # Option 2: From left (i, j-1)
                    res_from_left = []
                    if max_prod[i][j-1] != float('-inf'): # If there's a valid max product from left
                        res_from_left.append(val * max_prod[i][j-1])
                        res_from_left.append(val * min_prod[i][j-1])
                    
                    all_possible_prods = res_from_top + res_from_left

                    if not all_possible_prods:
                         # This case should generally not be hit if the starting cell (0,0) is validly initialized.
                         # If grid[0][0] is 0, then max_prod[0][0]=0 and min_prod[0][0]=0.
                         # Any subsequent multiplication by 0 will yield 0.
                         # If grid[0][0] is non-zero, then subsequent products will be calculated.
                         # The initialization ensures that at least one of the previous cells (i-1,j) or (i,j-1) would have a valid product.
                         # Let's proceed assuming `all_possible_prods` will not be empty for valid paths.
                         pass # This part of the conditional should not be reachable in a valid path construction.

                    max_prod[i][j] = max(all_possible_prods)
                    min_prod[i][j] = min(all_possible_prods)
                else:
                    # If the current cell value is non-negative
                    if val >= 0:
                        max_prod[i][j] = val * max(max_prod[i-1][j], max_prod[i][j-1])
                        min_prod[i][j] = val * min(min_prod[i-1][j], min_prod[i][j-1])
                    # If the current cell value is negative
                    else:
                        max_prod[i][j] = val * min(min_prod[i-1][j], min_prod[i][j-1]) # Negative * most negative gives largest positive
                        min_prod[i][j] = val * max(max_prod[i-1][j], max_prod[i][j-1]) # Negative * most positive gives smallest negative
        
        # The final result is the maximum non-negative product at the bottom-right corner
        result = max_prod[m-1][n-1]

        # If the maximum product is negative, return -1. Otherwise, return the result modulo 10^9 + 7.
        if result < 0:
            return -1
        else:
            return result % MOD

```