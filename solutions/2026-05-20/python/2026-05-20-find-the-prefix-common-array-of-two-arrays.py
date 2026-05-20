```python
# Problem: Find the Prefix Common Array of Two Arrays
# Link: https://leetcode.com/problems/find-the-prefix-common-array-of-two-arrays/
# Approach:
# We need to calculate a prefix common array C where C[i] is the count of common elements
# within the first i+1 elements of arrays A and B.
# We can iterate through both arrays simultaneously from index 0 to n-1.
# At each index i, we consider the subarrays A[0...i] and B[0...i].
# To efficiently count common elements, we can use sets.
# We maintain two sets, `seen_a` and `seen_b`, to store elements encountered so far in A and B respectively.
# For each index `i`:
# 1. Add A[i] to `seen_a`.
# 2. Add B[i] to `seen_b`.
# 3. The common elements between A[0...i] and B[0...i] are the intersection of `seen_a` and `seen_b`.
# 4. The count of common elements is the size of this intersection. This count is C[i].
# Time Complexity: O(n), where n is the length of the arrays. We iterate through the arrays once. Set insertions and intersections take O(1) on average for the given constraints (n <= 50).
# Space Complexity: O(n), for storing the elements in the two sets `seen_a` and `seen_b`.
class Solution:
    def findThePrefixCommonArray(self, A: list[int], B: list[int]) -> list[int]:
        n = len(A)
        # Initialize the prefix common array C with zeros
        C = [0] * n
        # Initialize sets to keep track of elements seen so far in A and B
        seen_a = set()
        seen_b = set()

        # Iterate through the arrays from index 0 to n-1
        for i in range(n):
            # Add the current element from A to seen_a
            seen_a.add(A[i])
            # Add the current element from B to seen_b
            seen_b.add(B[i])

            # Calculate the intersection of seen_a and seen_b.
            # This gives us the common elements present in A[0...i] and B[0...i].
            common_elements = seen_a.intersection(seen_b)

            # The count of common elements is the length of the intersection set.
            # This count is stored at C[i].
            C[i] = len(common_elements)

        # Return the calculated prefix common array
        return C

```