```python
# Problem: Rectangle Overlap
# Link: https://leetcode.com/problems/rectangle-overlap/
#
# Approach:
# Two rectangles overlap if and only if their horizontal intervals overlap AND their vertical intervals overlap.
# A simpler way to think about overlap is to consider when they DO NOT overlap.
# Two rectangles do not overlap if:
# 1. One rectangle is entirely to the left of the other.
# 2. One rectangle is entirely to the right of the other.
# 3. One rectangle is entirely below the other.
# 4. One rectangle is entirely above the other.
#
# For rec1 = [x1, y1, x2, y2] and rec2 = [ax1, ay1, ax2, ay2]:
# - They do not overlap horizontally if x2 <= ax1 (rec1 is to the left of rec2)
#   OR ax2 <= x1 (rec2 is to the left of rec1).
# - They do not overlap vertically if y2 <= ay1 (rec1 is below rec2)
#   OR ay2 <= y1 (rec2 is below rec1).
#
# If NONE of these non-overlapping conditions are met, then the rectangles must overlap.
# So, we return the negation of the condition that they do NOT overlap.
#
# Time Complexity: O(1) - The solution involves a fixed number of comparisons, regardless of the input size.
# Space Complexity: O(1) - The solution uses a constant amount of extra space.

class Solution:
    def isRectangleOverlap(self, rec1: list[int], rec2: list[int]) -> bool:
        # Unpack coordinates for clarity
        x1, y1, x2, y2 = rec1
        ax1, ay1, ax2, ay2 = rec2

        # Check for non-overlapping conditions
        # If rec1's right edge is to the left of or touching rec2's left edge
        # OR rec1's left edge is to the right of or touching rec2's right edge
        horizontal_no_overlap = (x2 <= ax1) or (x1 >= ax2)

        # If rec1's top edge is below or touching rec2's bottom edge
        # OR rec1's bottom edge is above or touching rec2's top edge
        vertical_no_overlap = (y2 <= ay1) or (y1 >= ay2)

        # If either horizontal or vertical non-overlap conditions are true,
        # then the rectangles do not overlap.
        # We return the negation, meaning they DO overlap if neither non-overlap condition is met.
        return not (horizontal_no_overlap or vertical_no_overlap)

```