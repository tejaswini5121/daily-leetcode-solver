```python
# Problem: Maximum Side Length of a Square with Sum Less than or Equal to Threshold
# Problem Summary: Find the largest square subgrid whose elements sum up to a value
#                  less than or equal to a given threshold.
# Link: https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/
#
# Approach:
# The problem asks for the maximum side length. This suggests that we can use binary search
# on the possible side lengths. For a given side length 'k', we need to efficiently check
# if there exists any square subgrid of size k x k whose sum is less than or equal to
# the threshold.
#
# To efficiently calculate the sum of any square subgrid, we can use a 2D prefix sum array
# (also known as an integral image).
# Let `prefix_sum[i][j]` store the sum of all elements in the rectangle from (0, 0) to (i-1, j-1).
# The sum of a square subgrid with top-left corner (r1, c1) and bottom-right corner (r2, c2)
# can be calculated as:
# sum(r1, c1, r2, c2) = prefix_sum[r2+1][c2+1] - prefix_sum[r1][c2+1] - prefix_sum[r2+1][c1] + prefix_sum[r1][c1]
#
# For a square of side length `k` and top-left corner (r, c), the bottom-right corner will be
# (r + k - 1, c + k - 1).
#
# The binary search will operate on the range of possible side lengths, from 0 to min(m, n).
#
# The `check(k)` function will iterate through all possible top-left corners (r, c)
# for a square of side length `k`. For each potential square, it calculates its sum using
# the prefix sum array and checks if the sum is <= threshold. If such a square is found,
# `check(k)` returns True.
#
# Binary Search Logic:
# low = 0, high = min(m, n) + 1 (exclusive upper bound for convenience)
# while low < high:
#   mid = low + (high - low) // 2
#   if mid == 0:  # A square of side 0 always exists and has sum 0.
#       low = mid + 1
#       continue
#   if check(mid):
#       # If a square of side 'mid' exists, we try for a larger side.
#       # The answer could be 'mid' or larger.
#       low = mid + 1
#   else:
#       # If no square of side 'mid' exists, we need to try smaller sides.
#       high = mid
#
# The final answer will be `low - 1`.
#
# Time Complexity:
# - Building the 2D prefix sum array: O(m * n)
# - Binary search: The range of side lengths is from 0 to min(m, n). Let S = min(m, n).
#   The binary search performs log(S) iterations.
# - Inside the binary search, the `check(k)` function iterates through possible top-left
#   corners of squares of side `k`. There are approximately (m - k + 1) * (n - k + 1) such corners.
#   For each corner, calculating the sum is O(1) using the prefix sum.
#   So, `check(k)` is roughly O(m * n).
# - Total time complexity: O(m * n * log(min(m, n)))
#
# Space Complexity:
# - Storing the 2D prefix sum array: O(m * n)
#
class Solution:
    def maximalSquare(self, mat: list[list[int]], threshold: int) -> int:
        m = len(mat)
        n = len(mat[0])

        # 1. Build the 2D prefix sum array
        # prefix_sum[i][j] will store the sum of all elements in the rectangle
        # from (0, 0) to (i-1, j-1) in the original matrix.
        # We add an extra row and column of zeros to simplify calculations.
        prefix_sum = [[0] * (n + 1) for _ in range(m + 1)]
        for r in range(m):
            for c in range(n):
                prefix_sum[r + 1][c + 1] = mat[r][c] + prefix_sum[r][c + 1] + prefix_sum[r + 1][c] - prefix_sum[r][c]

        # Helper function to get the sum of a square subgrid
        # with top-left corner (r1, c1) and bottom-right corner (r2, c2).
        # Note: In the prefix_sum array, indices are 1-based for convenience.
        # So, matrix coordinates (r, c) correspond to prefix_sum indices (r+1, c+1).
        def get_square_sum(r1, c1, r2, c2):
            # Convert matrix 0-based indices to prefix_sum 1-based indices
            # The sum of a rectangle from (r1, c1) to (r2, c2) (inclusive)
            # is prefix_sum[r2+1][c2+1] - prefix_sum[r1][c2+1] - prefix_sum[r2+1][c1] + prefix_sum[r1][c1]
            return prefix_sum[r2 + 1][c2 + 1] - prefix_sum[r1][c2 + 1] - prefix_sum[r2 + 1][c1] + prefix_sum[r1][c1]

        # Helper function to check if there exists any square of side length 'k'
        # whose sum is less than or equal to the threshold.
        def check(k):
            if k == 0: # A square of side 0 always exists and its sum is 0.
                return True
            # Iterate through all possible top-left corners of a square of side 'k'.
            # The top-left corner (r, c) means the square spans from (r, c) to (r+k-1, c+k-1).
            for r in range(m - k + 1):
                for c in range(n - k + 1):
                    # Calculate the sum of the current k x k square
                    square_sum = get_square_sum(r, c, r + k - 1, c + k - 1)
                    if square_sum <= threshold:
                        return True # Found a square of side k with sum <= threshold
            return False # No such square of side k was found

        # 2. Binary search for the maximum side length
        # The side length can range from 0 to min(m, n).
        # 'low' will be the smallest possible side length that might work or larger.
        # 'high' will be the smallest side length that is definitely too large or the boundary.
        low = 0
        high = min(m, n) + 1 # Upper bound is exclusive, so we add 1

        ans = 0 # Initialize answer to 0

        while low < high:
            mid = low + (high - low) // 2 # Calculate middle side length

            if check(mid):
                # If a square of side 'mid' exists and satisfies the condition,
                # it means 'mid' is a possible answer, and we try to find a
                # larger side. So, we update 'low' to 'mid + 1'.
                # We also update 'ans' because 'mid' is a valid side length.
                ans = mid
                low = mid + 1
            else:
                # If no square of side 'mid' satisfies the condition,
                # it means 'mid' is too large, and we need to search in the
                # smaller half. So, we update 'high' to 'mid'.
                high = mid

        # The binary search ensures that 'ans' stores the largest 'mid' for which check(mid) was True.
        # If no square with sum <= threshold exists (even of size 1), 'ans' will remain 0.
        return ans

```