```cpp
/*
Problem: Separate Squares I
Link: https://leetcode.com/problems/separate-squares-i/

Summary:
Given a list of squares defined by their bottom-left corner and side length, find a horizontal line (defined by its y-coordinate) that divides the total area of the squares into two equal halves: one half above the line and one half below the line.

Approach:
The problem asks for a y-coordinate that balances the total area of squares above and below it. This suggests a binary search approach. We need to define a search space for the y-coordinate. The minimum possible y-coordinate for the bottom of any square is 0. The maximum possible y-coordinate can be very large, so we can estimate a generous upper bound. A reasonable upper bound could be the maximum y-coordinate of any square's top edge plus the maximum side length, or even a very large constant like 2e9 (since coordinates and lengths can be up to 1e9).

For a given candidate y-coordinate `mid`, we can calculate the total area below `mid` and the total area above `mid`.
For each square `[xi, yi, li]`:
- The square's y-range is from `yi` to `yi + li`.
- The area of the square is `li * li`.

- If `mid` is below the square's bottom (`mid <= yi`): The entire square is above `mid`.
- If `mid` is above the square's top (`mid >= yi + li`): The entire square is below `mid`.
- If `mid` is within the square's y-range (`yi < mid < yi + li`):
    - The part below `mid` has height `mid - yi`. Its area is `li * (mid - yi)`.
    - The part above `mid` has height `(yi + li) - mid`. Its area is `li * (yi + li - mid)`.

We can sum up the areas below and above `mid` for all squares. Let `total_area_below` be the sum of areas of square parts below `mid`, and `total_area_above` be the sum of areas of square parts above `mid`.
The goal is to find `mid` such that `total_area_below` is approximately equal to `total_area_above`.
Since the total area of all squares is constant, we are essentially looking for a `mid` where `total_area_below` is half of the total area of all squares.

Binary search steps:
1. Initialize `low = 0.0` and `high = 2e9` (a sufficiently large upper bound).
2. Iterate for a fixed number of times (e.g., 100) to achieve the required precision (10^-5). This is a common technique for binary search on floating-point numbers when an exact equality check is difficult due to precision issues.
3. In each iteration:
   a. Calculate `mid = low + (high - low) / 2`.
   b. Calculate `area_below_mid` for all squares with respect to `mid`.
   c. If `area_below_mid` is less than half of the total area, it means `mid` is too low. We need to increase `mid`, so set `low = mid`.
   d. If `area_below_mid` is greater than or equal to half of the total area, it means `mid` is too high or just right. We can potentially find a smaller `mid`, so set `high = mid`.
4. After the iterations, `low` (or `high`) will be the answer.

To calculate `area_below_mid` efficiently:
For each square `[xi, yi, li]`:
- The bottom y-coordinate is `yi`.
- The top y-coordinate is `yi + li`.
- The side length is `li`.
- The width of the square is `li`.

- If `mid` is less than or equal to `yi`: The entire square is above `mid`. Contribution to `area_below_mid` is 0.
- If `mid` is greater than or equal to `yi + li`: The entire square is below `mid`. Contribution to `area_below_mid` is `li * li`.
- If `yi < mid < yi + li`: The portion of the square below `mid` has a height of `mid - yi`. The contribution to `area_below_mid` is `li * (mid - yi)`.

We will need to calculate the total area of all squares first to know our target value (half of the total area).

Total area calculation:
Sum of `li * li` for all squares.

Let's refine the `area_below_mid` calculation function. It should take `mid` and `squares` as input and return the total area of square portions below `mid`.

```cpp
double calculate_area_below(double y_line, const std::vector<std::vector<int>>& squares) {
    double total_area_below = 0.0;
    for (const auto& square : squares) {
        long long x = square[0];
        long long y_bottom = square[1];
        long long side_len = square[2];
        long long y_top = y_bottom + side_len;

        // Case 1: The square is entirely above the line.
        if (y_line <= y_bottom) {
            continue; // No area below the line from this square.
        }
        // Case 2: The square is entirely below the line.
        else if (y_line >= y_top) {
            total_area_below += static_cast<double>(side_len) * side_len;
        }
        // Case 3: The line intersects the square vertically.
        else {
            // The height of the portion below the line is `y_line - y_bottom`.
            // The width is `side_len`.
            total_area_below += static_cast<double>(side_len) * (y_line - y_bottom);
        }
    }
    return total_area_below;
}
```

The binary search will be:
`low = 0.0`, `high = 2e9` (or a slightly more precise bound if needed, e.g., max_y + max_l)
`total_area = sum(li*li for all squares)`
`target_area = total_area / 2.0`

Loop 100 times:
`mid = low + (high - low) / 2.0`
`current_area_below = calculate_area_below(mid, squares)`
If `current_area_below < target_area`: `low = mid` (need more area below, so move line up)
Else: `high = mid` (have enough or too much area below, try a lower line)

The maximum possible y-coordinate could be up to 10^9 for `yi` and 10^9 for `li`. So `yi + li` can be up to 2 * 10^9. A search space up to 2 * 10^9 is appropriate.

Time Complexity:
The binary search performs a fixed number of iterations (e.g., 100) to achieve the desired precision. Inside each iteration, we iterate through all `N` squares to calculate the area.
So, the time complexity is O(100 * N), which is effectively O(N) since 100 is a constant.

Space Complexity:
We only use a few variables to store `low`, `high`, `mid`, `total_area`, `target_area`, and the intermediate area calculation. This is constant extra space.
So, the space complexity is O(1).

Let's consider the data types. Coordinates and side lengths can be up to 10^9. Their product (area) can be up to 10^18. A `long long` can hold up to ~9 * 10^18. The total area of all squares can exceed `long long` if `squares.length` is large and `li` is large. The problem statement says "The total area of all the squares will not exceed 10^12", which fits within `long long`.
However, intermediate calculations involving `double` for `mid` and areas are necessary. When calculating `li * (mid - y_bottom)`, `mid` and `y_bottom` are `double` and `long long`. The multiplication should be done with `double` to maintain precision.

The problem states that answers within 10^-5 of the actual answer will be accepted. 100 iterations of binary search on a range of 2 * 10^9 should be sufficient.
Range size = 2 * 10^9. After 100 iterations, the range is reduced by 2^100.
(2 * 10^9) / (2^100) is extremely small, much smaller than 10^-5.
2^10 = 1024 ~ 10^3
2^100 = (2^10)^10 ~ (10^3)^10 = 10^30
So, (2 * 10^9) / 10^30 is very small.
Precision is guaranteed.
*/

#include <vector>
#include <iostream>
#include <iomanip>
#include <cmath>
#include <numeric>

class Solution {
public:
    // Function to calculate the total area of square portions below a given horizontal line.
    // y_line: The y-coordinate of the horizontal line.
    // squares: The input vector of squares, where each square is [xi, yi, li].
    double calculate_area_below(double y_line, const std::vector<std::vector<int>>& squares) {
        double total_area_below = 0.0;
        // Iterate through each square to calculate its contribution to the area below y_line.
        for (const auto& square : squares) {
            // Extract square properties. Using long long for y_bottom and side_len to avoid overflow
            // as their values can be up to 10^9.
            long long x_bottom_left = square[0]; // Not used in area calculation relative to y-axis
            long long y_bottom = square[1];
            long long side_len = square[2];
            long long y_top = y_bottom + side_len;

            // Case 1: The square's bottom edge is at or above the line.
            // If y_bottom >= y_line, the entire square is above the line.
            if (y_bottom >= y_line) {
                // No area of this square is below the line.
                continue;
            }
            // Case 2: The square's top edge is at or below the line.
            // If y_top <= y_line, the entire square is below the line.
            else if (y_top <= y_line) {
                // The entire area of the square is below the line.
                // Cast side_len to double before multiplication to avoid potential intermediate overflow
                // if side_len * side_len exceeds long long max, though problem statement limits total area.
                total_area_below += static_cast<double>(side_len) * static_cast<double>(side_len);
            }
            // Case 3: The horizontal line intersects the square vertically.
            // This happens when y_bottom < y_line < y_top.
            else {
                // The portion of the square below the line has a height of `y_line - y_bottom`.
                // The width of this portion is `side_len`.
                // Cast side_len to double for the multiplication.
                total_area_below += static_cast<double>(side_len) * (y_line - static_cast<double>(y_bottom));
            }
        }
        return total_area_below;
    }

    double solve(std::vector<std::vector<int>>& squares) {
        // Calculate the total area of all squares.
        // Use double for total_area to ensure precision in subsequent calculations.
        double total_area = 0.0;
        for (const auto& square : squares) {
            long long side_len = square[2];
            total_area += static_cast<double>(side_len) * static_cast<double>(side_len);
        }

        // The target area below the line is half of the total area.
        double target_area = total_area / 2.0;

        // Binary search for the y-coordinate of the horizontal line.
        // We are searching for a y-coordinate between 0 and a sufficiently large value.
        // The maximum possible y-coordinate could be max(yi) + max(li), which is roughly 2 * 10^9.
        // A generous upper bound like 2e9 ensures we cover all possibilities.
        double low = 0.0;
        double high = 2e9; // A safe upper bound for y-coordinates.

        // Perform binary search for a fixed number of iterations to achieve the required precision.
        // 100 iterations are generally sufficient for LeetCode's typical precision requirements (e.g., 10^-5).
        for (int i = 0; i < 100; ++i) {
            // Calculate the midpoint.
            double mid = low + (high - low) / 2.0;
            
            // Calculate the total area below the current midpoint line.
            double current_area_below = calculate_area_below(mid, squares);

            // If the area below `mid` is less than the target area, it means the line is too low.
            // We need to move the line up, so we set `low = mid`.
            if (current_area_below < target_area) {
                low = mid;
            }
            // If the area below `mid` is greater than or equal to the target area, it means the line is too high
            // or at the correct position. We try to find a potentially lower line, so we set `high = mid`.
            else {
                high = mid;
            }
        }

        // After the binary search, `low` (or `high`) will be very close to the desired y-coordinate.
        // Return `low` as the result.
        return low;
    }
};
```