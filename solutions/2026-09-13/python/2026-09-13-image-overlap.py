```python
# Problem: Image Overlap
# Summary: Find the maximum overlap between two binary images after translating one of them.
# Link: https://leetcode.com/problems/image-overlap/
#
# Approach:
# The core idea is to try every possible relative translation of img1 with respect to img2 and
# count the overlap for each translation. Since we are looking for the *largest* overlap,
# we'll keep track of the maximum overlap found.
#
# A translation can be represented by a horizontal shift (dx) and a vertical shift (dy).
# If we fix img2, we can think of translating img1.
# For each '1' in img1 at (r1, c1), we can imagine it being placed over a '1' in img2
# at (r2, c2). The translation vector would be (r2 - r1, c2 - c1).
#
# Instead of explicitly iterating through all possible shifts (which could be up to 2*n-1 for each dimension),
# we can use a more efficient approach.
#
# Let's iterate through all '1's in img1 and all '1's in img2.
# For each pair of '1's, (r1, c1) from img1 and (r2, c2) from img2, if they were to overlap,
# it means that img1 has been shifted by (r2 - r1) vertically and (c2 - c1) horizontally
# relative to img2.
#
# We can use a hash map (dictionary in Python) to store the counts of each possible translation vector.
# The keys of the map will be tuples (dy, dx) representing the translation (vertical, horizontal).
# The values will be the number of times this translation occurs, meaning the number of '1' pairs
# that align with this specific translation.
#
# Algorithm:
# 1. Initialize a dictionary `translation_counts` to store the frequency of each translation vector.
# 2. Iterate through each cell (r1, c1) in img1.
# 3. If img1[r1][c1] is 1:
#    a. Iterate through each cell (r2, c2) in img2.
#    b. If img2[r2][c2] is 1:
#       i. Calculate the translation vector: dy = r2 - r1, dx = c2 - c1.
#       ii. Increment the count for the tuple (dy, dx) in `translation_counts`.
# 4. After iterating through all pairs of '1's, the maximum value in `translation_counts`
#    will represent the largest number of overlapping '1's for any single translation.
# 5. If `translation_counts` is empty (meaning no '1's in either image or no overlaps possible),
#    the maximum overlap is 0.
#
# Example Walkthrough:
# img1 = [[1,1,0],[0,1,0],[0,1,0]]
# img2 = [[0,0,0],[0,1,1],[0,0,1]]
#
# '1's in img1: (0,0), (0,1), (1,1), (2,1)
# '1's in img2: (1,1), (1,2), (2,2)
#
# Consider img1[0][0] = 1.
# - Overlap with img2[1][1]=1: dy=1-0=1, dx=1-0=1. Translation (1,1). Count for (1,1) += 1.
# - Overlap with img2[1][2]=1: dy=1-0=1, dx=2-0=2. Translation (1,2). Count for (1,2) += 1.
# - Overlap with img2[2][2]=1: dy=2-0=2, dx=2-0=2. Translation (2,2). Count for (2,2) += 1.
#
# Consider img1[0][1] = 1.
# - Overlap with img2[1][1]=1: dy=1-0=1, dx=1-1=0. Translation (1,0). Count for (1,0) += 1.
# - Overlap with img2[1][2]=1: dy=1-0=1, dx=2-1=1. Translation (1,1). Count for (1,1) += 1.
# - Overlap with img2[2][2]=1: dy=2-0=2, dx=2-1=1. Translation (2,1). Count for (2,1) += 1.
#
# Consider img1[1][1] = 1.
# - Overlap with img2[1][1]=1: dy=1-1=0, dx=1-1=0. Translation (0,0). Count for (0,0) += 1.
# - Overlap with img2[1][2]=1: dy=1-1=0, dx=2-1=1. Translation (0,1). Count for (0,1) += 1.
# - Overlap with img2[2][2]=1: dy=2-1=1, dx=2-1=1. Translation (1,1). Count for (1,1) += 1.
#
# Consider img1[2][1] = 1.
# - Overlap with img2[1][1]=1: dy=1-2=-1, dx=1-1=0. Translation (-1,0). Count for (-1,0) += 1.
# - Overlap with img2[1][2]=1: dy=1-2=-1, dx=2-1=1. Translation (-1,1). Count for (-1,1) += 1.
# - Overlap with img2[2][2]=1: dy=2-2=0, dx=2-1=1. Translation (0,1). Count for (0,1) += 1.
#
# Final counts:
# (1,1): 3  (from (0,0)-(1,1), (0,1)-(1,2), (1,1)-(2,2))
# (1,2): 1
# (2,2): 1
# (1,0): 1
# (2,1): 1
# (0,0): 1
# (0,1): 2
# (-1,0): 1
# (-1,1): 1
#
# Maximum count is 3.
#
# Time Complexity: O(n^4)
#   - We have two nested loops for iterating through img1 (n*n).
#   - Inside those, we have two nested loops for iterating through img2 (n*n).
#   - Dictionary operations (get/set) are O(1) on average.
#   - Total: n*n * n*n = n^4.
#
# Space Complexity: O(n^2)
#   - In the worst case, every pair of '1's from img1 and img2 could result in a unique
#     translation vector. The possible range of dx and dy is from -(n-1) to (n-1).
#   - This gives at most (2n-1) * (2n-1) = O(n^2) possible translation vectors.
#   - The dictionary can store up to O(n^2) entries.

from collections import defaultdict

class Solution:
    def largestOverlap(self, img1: list[list[int]], img2: list[list[int]]) -> int:
        n = len(img1)
        
        # Use defaultdict to easily increment counts for translation vectors
        # Key: tuple (dy, dx) representing vertical and horizontal shift
        # Value: count of '1' pairs that align with this translation
        translation_counts = defaultdict(int)
        
        # Store the coordinates of all '1's in img1
        ones_img1 = []
        for r in range(n):
            for c in range(n):
                if img1[r][c] == 1:
                    ones_img1.append((r, c))
                    
        # Store the coordinates of all '1's in img2
        ones_img2 = []
        for r in range(n):
            for c in range(n):
                if img2[r][c] == 1:
                    ones_img2.append((r, c))

        # If either image has no '1's, the overlap is 0
        if not ones_img1 or not ones_img2:
            return 0
            
        # Iterate through each '1' in img1 and each '1' in img2
        # For each pair of '1's, calculate the translation required for them to overlap
        for r1, c1 in ones_img1:
            for r2, c2 in ones_img2:
                # The translation vector (dy, dx) is the difference in row and column indices
                # If img1[r1][c1] is to overlap with img2[r2][c2], then img1 needs to be shifted
                # by dy = r2 - r1 and dx = c2 - c1 relative to img2.
                dy = r2 - r1
                dx = c2 - c1
                
                # Increment the count for this specific translation vector
                translation_counts[(dy, dx)] += 1
        
        # The maximum overlap is the maximum count among all translation vectors.
        # If translation_counts is empty (e.g., no '1's found in either image, though handled above),
        # max() on an empty iterable would raise an error.
        # We can use 0 as a default value if the dictionary is empty.
        max_overlap = 0
        if translation_counts:
            max_overlap = max(translation_counts.values())
            
        return max_overlap

```