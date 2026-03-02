```python
# Summary: Find the minimum swaps of adjacent rows to make a binary grid valid, where valid means all elements above the main diagonal are zero.
# Link: https://leetcode.com/problems/minimum-swaps-to-arrange-a-binary-grid/
# Approach:
# 1. For each row, calculate the number of trailing zeros. This is the key property of a row that determines its "suitability" for a given position. A row with k trailing zeros can satisfy the condition for the first n-k columns of the main diagonal.
# 2. Store these trailing zero counts in a list.
# 3. Iterate from the top row (index 0) to the second-to-last row (index n-2). For each row `i`, we need to find a row `j` (where `j >= i`) that has at least `n - 1 - i` trailing zeros. This is because the `i`-th row (0-indexed) needs to satisfy the condition up to column `n-1-i`.
# 4. If no such row `j` is found for row `i`, it's impossible to make the grid valid, so return -1.
# 5. If such a row `j` is found, we need to bring it to the `i`-th position. The minimum number of swaps to move row `j` to position `i` is `j - i`. We add this to our total swap count.
# 6. After finding and "swapping" row `j` to position `i` (conceptually, by moving its trailing zero count in our list), we remove it from the list of available rows to consider for subsequent positions.
# 7. If we successfully place all rows up to `n-1`, return the total swap count.
#
# Time Complexity: O(n^2) - Calculating trailing zeros for each row takes O(n) for each of the n rows, resulting in O(n^2). The greedy placement and swapping also take O(n^2) in the worst case (e.g., using a nested loop or list removal operations).
# Space Complexity: O(n) - To store the trailing zero counts for each row.

class Solution:
    def minSwaps(self, grid: list[list[int]]) -> int:
        n = len(grid)
        # Calculate the number of trailing zeros for each row
        # A row with k trailing zeros can satisfy the condition for the first n-k columns
        # i.e., it has enough zeros to place before the main diagonal elements
        trailing_zeros = []
        for row in grid:
            count = 0
            # Iterate from the right to count trailing zeros
            for j in range(n - 1, -1, -1):
                if row[j] == 0:
                    count += 1
                else:
                    break
            trailing_zeros.append(count)

        total_swaps = 0

        # Iterate through each row position (from top to bottom) that needs to be satisfied
        for i in range(n):
            # The i-th row (0-indexed) needs to satisfy the condition for the first n-1-i columns.
            # This means we need a row with at least n - 1 - i trailing zeros.
            required_trailing_zeros = n - 1 - i

            # Find the first row (starting from the current position i) that meets the requirement
            found_idx = -1
            for j in range(i, len(trailing_zeros)):
                if trailing_zeros[j] >= required_trailing_zeros:
                    found_idx = j
                    break

            # If no suitable row is found, the grid cannot be made valid
            if found_idx == -1:
                return -1

            # If a suitable row is found at index 'found_idx', we need to move it to position 'i'.
            # The number of swaps required is the distance between 'found_idx' and 'i'.
            total_swaps += (found_idx - i)

            # "Swap" the row by moving its trailing zero count to the current position 'i' in our list.
            # This simulates bringing the row to the correct position and removes it from further consideration
            # for positions before 'i' in the list conceptually.
            # We achieve this by taking the element at found_idx and inserting it at i,
            # then removing the original element at found_idx (which is now effectively at i).
            # A simpler way in Python is to just remove the element and insert it.
            row_to_move = trailing_zeros.pop(found_idx)
            trailing_zeros.insert(i, row_to_move)

        return total_swaps
```