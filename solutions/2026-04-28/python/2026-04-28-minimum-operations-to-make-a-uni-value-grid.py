```python
# Problem Summary:
# Given a 2D grid and an integer x, find the minimum operations to make all grid elements equal.
# An operation involves adding or subtracting x from any element.
# Return -1 if it's impossible.
# Link: https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid/

# Approach Explanation:
# 1. Check for divisibility: For all elements to be made equal to some target value 't',
#    the difference between any element 'g' and 't' must be a multiple of 'x'.
#    This means (g - t) % x == 0, or equivalently, g % x == t % x.
#    Therefore, all elements in the grid must have the same remainder when divided by 'x'.
#    If this condition is not met, it's impossible to make the grid uni-value, so return -1.
# 2. Flatten the grid: Collect all elements of the grid into a single 1D list.
# 3. Find the median: If the condition in step 1 is met, it is always possible to make
#    the grid uni-value. The optimal target value to make all elements equal to is the median
#    of the flattened list. This is because the sum of absolute differences is minimized at the median.
#    Sort the flattened list and pick the middle element as the target.
# 4. Calculate operations: For each element in the flattened list, calculate the number of operations
#    required to change it to the median. This is `abs(element - median) // x`. Sum these operations.
#    The division by 'x' is safe because we've already established that all differences
#    `element - median` will be divisible by 'x'.

# Time Complexity Analysis:
# - Flattening the grid: O(m*n), where m is the number of rows and n is the number of columns.
# - Checking divisibility: O(m*n) to iterate through all elements.
# - Sorting the flattened list: O(N log N), where N = m*n.
# - Calculating operations: O(N) to iterate through the flattened list.
# The dominant factor is sorting, so the overall time complexity is O(N log N).

# Space Complexity Analysis:
# - Storing the flattened list: O(N), where N = m*n.
# The overall space complexity is O(N).

import math

class Solution:
    def minOperations(self, grid: list[list[int]], x: int) -> int:
        # Get the dimensions of the grid
        m = len(grid)
        n = len(grid[0])
        
        # Flatten the grid into a 1D list
        elements = []
        for row in grid:
            elements.extend(row)
            
        # Check if all elements have the same remainder when divided by x
        # This is a necessary condition for making the grid uni-value.
        remainder = elements[0] % x
        for elem in elements:
            if elem % x != remainder:
                return -1  # Impossible to make the grid uni-value

        # Sort the flattened list to find the median
        elements.sort()
        
        # The optimal target value to make all elements equal to is the median.
        # The median minimizes the sum of absolute differences.
        median = elements[len(elements) // 2]
        
        # Calculate the total number of operations
        total_operations = 0
        for elem in elements:
            # The difference is guaranteed to be divisible by x due to the initial check
            diff = abs(elem - median)
            total_operations += diff // x
            
        return total_operations

```