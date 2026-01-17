```python
# Finds the maximum area of a square that fits within the intersection of any two rectangles.
# Problem Link: https://leetcode.com/problems/find-the-largest-area-of-square-inside-two-rectangles/
#
# Approach:
# The problem asks for the largest square that can fit inside the intersection of *any* two given rectangles.
# We can iterate through all possible pairs of rectangles. For each pair, we calculate their intersection rectangle.
# If the intersection is valid (i.e., it has a positive width and height), we then determine the largest square
# that can fit inside this intersection. The side length of this square will be the minimum of the width and height
# of the intersection rectangle. We keep track of the maximum side length found across all intersecting pairs.
# Finally, the maximum area is the square of this maximum side length.
#
# To find the intersection of two rectangles (rect1 and rect2):
# rect1: bottomLeft1 = [x1_bl, y1_bl], topRight1 = [x1_tr, y1_tr]
# rect2: bottomLeft2 = [x2_bl, y2_bl], topRight2 = [x2_tr, y2_tr]
#
# The intersection rectangle's bottom-left x-coordinate is the maximum of the two bottom-left x-coordinates.
# The intersection rectangle's bottom-left y-coordinate is the maximum of the two bottom-left y-coordinates.
# The intersection rectangle's top-right x-coordinate is the minimum of the two top-right x-coordinates.
# The intersection rectangle's top-right y-coordinate is the minimum of the two top-right y-coordinates.
#
# Intersection:
# x_intersect_bl = max(x1_bl, x2_bl)
# y_intersect_bl = max(y1_bl, y2_bl)
# x_intersect_tr = min(x1_tr, x2_tr)
# y_intersect_tr = min(y1_tr, y2_tr)
#
# The width of the intersection is max(0, x_intersect_tr - x_intersect_bl).
# The height of the intersection is max(0, y_intersect_tr - y_intersect_bl).
#
# If width > 0 and height > 0, the largest square side length is min(width, height).
#
# Time Complexity:
# We iterate through all pairs of n rectangles. This is O(n^2) pairs. For each pair, the intersection
# and maximum square calculation is O(1). Therefore, the total time complexity is O(n^2).
#
# Space Complexity:
# We use a few variables to store the maximum side length and intermediate intersection calculations.
# This is constant extra space, so the space complexity is O(1).
#
class Solution:
    def largestOverlapArea(self, bottomLeft: list[list[int]], topRight: list[list[int]]) -> int:
        n = len(bottomLeft)
        max_side_length = 0  # Initialize the maximum side length of a possible square to 0

        # Iterate through all possible pairs of rectangles
        for i in range(n):
            for j in range(i + 1, n):
                # Coordinates of the first rectangle
                x1_bl, y1_bl = bottomLeft[i]
                x1_tr, y1_tr = topRight[i]

                # Coordinates of the second rectangle
                x2_bl, y2_bl = bottomLeft[j]
                x2_tr, y2_tr = topRight[j]

                # Calculate the intersection rectangle's coordinates
                # The bottom-left x of the intersection is the maximum of the two bottom-left x's
                intersect_x_bl = max(x1_bl, x2_bl)
                # The bottom-left y of the intersection is the maximum of the two bottom-left y's
                intersect_y_bl = max(y1_bl, y2_bl)
                # The top-right x of the intersection is the minimum of the two top-right x's
                intersect_x_tr = min(x1_tr, x2_tr)
                # The top-right y of the intersection is the minimum of the two top-right y's
                intersect_y_tr = min(y1_tr, y2_tr)

                # Calculate the width and height of the intersection rectangle
                # If intersect_x_tr <= intersect_x_bl or intersect_y_tr <= intersect_y_bl, there is no overlap.
                intersection_width = max(0, intersect_x_tr - intersect_x_bl)
                intersection_height = max(0, intersect_y_tr - intersect_y_bl)

                # If there is a valid intersection (positive width and height)
                if intersection_width > 0 and intersection_height > 0:
                    # The largest square that can fit inside this intersection has a side length
                    # equal to the minimum of the intersection's width and height.
                    current_side_length = min(intersection_width, intersection_height)
                    # Update the overall maximum side length found so far
                    max_side_length = max(max_side_length, current_side_length)

        # The maximum area of a square is the square of the maximum side length found.
        return max_side_length * max_side_length

```