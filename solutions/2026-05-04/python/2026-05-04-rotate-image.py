```python
# Problem: Rotate Image
# Summary: Rotates an n x n 2D matrix representing an image by 90 degrees clockwise in-place.
# Link: https://leetcode.com/problems/rotate-image/
#
# Approach:
# The rotation can be achieved in two main steps:
# 1. Transpose the matrix: Swap elements across the main diagonal. For a matrix `matrix[i][j]`, swap it with `matrix[j][i]`.
# 2. Reverse each row: After transposing, each row needs to be reversed to achieve the 90-degree clockwise rotation.
#
# This approach works because:
# - Transposing moves elements `(i, j)` to `(j, i)`.
# - Reversing the row at index `j` moves the element from `(j, i)` to `(j, n-1-i)`.
#   This final position `(j, n-1-i)` is the correct position for an element originally at `(i, j)` after a 90-degree clockwise rotation.
#
# Example walk-through:
# Initial: [[1, 2, 3],
#           [4, 5, 6],
#           [7, 8, 9]]
#
# Transpose:
# Swap (0,1) with (1,0) -> 2 and 4
# Swap (0,2) with (2,0) -> 3 and 7
# Swap (1,2) with (2,1) -> 6 and 8
# Matrix becomes: [[1, 4, 7],
#                  [2, 5, 8],
#                  [3, 6, 9]]
#
# Reverse each row:
# Row 0: [1, 4, 7] -> [7, 4, 1]
# Row 1: [2, 5, 8] -> [8, 5, 2]
# Row 2: [3, 6, 9] -> [9, 6, 3]
# Final matrix: [[7, 4, 1],
#                [8, 5, 2],
#                [9, 6, 3]]
#
# Time Complexity: O(n^2)
# - Transposing the matrix involves iterating through roughly half of the elements, which is O(n^2).
# - Reversing each of the n rows takes O(n) time per row, totaling O(n*n) = O(n^2).
# - Therefore, the total time complexity is O(n^2).
#
# Space Complexity: O(1)
# - The rotation is performed in-place, meaning no additional data structures proportional to the input size are used.
# - Only a few variables are used for swapping elements, which is constant space.

class Solution:
    def rotate(self, matrix: list[list[int]]) -> None:
        """
        Do not return anything, modify matrix in-place instead.
        """
        n = len(matrix) # Get the dimension of the square matrix

        # Step 1: Transpose the matrix
        # Iterate through the upper triangle of the matrix (including the diagonal)
        # For each element matrix[i][j], swap it with matrix[j][i]
        # We only need to iterate up to j < i because swapping matrix[i][j] and matrix[j][i]
        # covers both pairs. If we iterate j from 0 to n-1, we'd swap twice.
        for i in range(n):
            for j in range(i + 1, n): # Iterate from i+1 to avoid redundant swaps and swapping with itself
                # Swap matrix[i][j] and matrix[j][i]
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

        # Step 2: Reverse each row
        # Iterate through each row of the transposed matrix
        for i in range(n):
            # Reverse the current row in-place
            # We can use slicing with a step of -1 for efficient reversal
            matrix[i] = matrix[i][::-1]

```