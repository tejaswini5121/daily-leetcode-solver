```python
# Summary: Find a horizontal line such that the total area of squares above it equals the total area below.
# Link: https://leetcode.com/problems/separate-squares-i/
# Approach:
# The problem asks for a y-coordinate `y_line` such that the sum of areas of squares
# *above* the line equals the sum of areas of squares *below* the line.
# Let's define the contribution of a single square `[x, y, l]` to the area below a line `y_line`.
# If `y_line` is above the top of the square (i.e., `y_line >= y + l`), the entire square is below.
# If `y_line` is below the bottom of the square (i.e., `y_line <= y`), the entire square is above.
# Otherwise, a portion of the square is below the line. The height of this portion is `max(0, min(y + l, y_line) - y)`.
# The area below for a square is `l * max(0, min(y + l, y_line) - y)`.
#
# The total area of all squares is constant. Let this be `TotalArea`.
# If the area below the line is `AreaBelow`, then the area above the line is `TotalArea - AreaBelow`.
# We want `AreaBelow = TotalArea - AreaBelow`, which simplifies to `2 * AreaBelow = TotalArea`, or `AreaBelow = TotalArea / 2`.
#
# This means we are looking for a `y_line` such that the sum of areas of squares below `y_line`
# is exactly half of the total area of all squares.
#
# The function `calculate_area_below(y_line, squares)` calculates the total area of squares below the line `y_line`.
#
# The possible values for `y_line` can range from 0 (or even negative, though problem constraints suggest non-negative)
# up to the maximum possible y-coordinate of the top of any square. A safe upper bound could be `10^9 + 10^9` (max `yi` + max `li`).
# Since the function `calculate_area_below` is monotonically increasing with `y_line`, we can use binary search
# to find the `y_line` that results in `AreaBelow = TotalArea / 2`.
#
# We will set a search range for `y_line`. A reasonable lower bound is 0. A safe upper bound is `2 * 10^9` (or even `10^9 + 10^9`).
# We will perform binary search for a fixed number of iterations to achieve the required precision (10^-5).
#
# Time Complexity:
# Calculating the total area of all squares takes O(N) time, where N is the number of squares.
# The `calculate_area_below` function takes O(N) time.
# Binary search performs a fixed number of iterations (e.g., 100 iterations are usually sufficient for double precision).
# Therefore, the total time complexity is O(N * num_iterations), which is effectively O(N) since `num_iterations` is constant.
#
# Space Complexity:
# O(1) extra space is used, as we only store a few variables for calculations.
#
class Solution:
    def solve(self, squares: list[list[int]]) -> float:
        # Calculate the total area of all squares.
        # Note: Overlapping areas are counted multiple times as per the problem statement.
        total_area = 0
        for x, y, l in squares:
            total_area += l * l

        # Target area below the line is half of the total area.
        target_area_below = total_area / 2.0

        # Function to calculate the total area of squares that are below a given horizontal line `y_line`.
        def calculate_area_below(y_line: float) -> float:
            area_below = 0.0
            for x, y, l in squares:
                # The square spans from y to y + l.
                # The part of the square below y_line is between y and min(y + l, y_line).
                # The height of this part is max(0, min(y + l, y_line) - y).
                height_below = max(0.0, min(y + l, y_line) - y)
                area_below += l * height_below
            return area_below

        # Binary search for the y_line.
        # The search space for y_line can be from 0 up to the maximum possible y-coordinate of the top of any square.
        # A safe upper bound is 10^9 (max yi) + 10^9 (max li).
        low = 0.0
        high = 2e9 # A sufficiently large upper bound, considering max yi and max li are 10^9.

        # Perform binary search for a fixed number of iterations to achieve desired precision.
        # 100 iterations are generally enough for standard floating-point precision requirements.
        for _ in range(100):
            mid = (low + high) / 2.0
            current_area_below = calculate_area_below(mid)

            # If the current area below is less than the target, we need to raise the line (increase y_line).
            if current_area_below < target_area_below:
                low = mid
            # If the current area below is greater than or equal to the target, we can try lowering the line (decrease y_line).
            else:
                high = mid

        # After sufficient iterations, 'low' (or 'high') will be very close to the desired y_line.
        return low

```