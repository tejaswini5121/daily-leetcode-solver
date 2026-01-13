```java
/**
 * Problem Summary: Find a horizontal line's y-coordinate that divides the total area of squares equally above and below it.
 * Problem Link: https://leetcode.com/problems/separate-squares-i/
 *
 * Approach:
 * This problem can be solved using binary search on the possible y-coordinate of the horizontal line.
 * The possible range for the y-coordinate is from 0 to the maximum possible y-coordinate.
 * For a given candidate y-coordinate `mid`, we calculate the total area of squares below `mid` and the total area of squares above `mid`.
 *
 * To calculate the area below `mid` for a square [xi, yi, li]:
 * - If the square is entirely below `mid` (yi + li <= mid), its full area `li * li` is below.
 * - If the square is entirely above `mid` (yi >= mid), its area below is 0.
 * - If the square straddles `mid` (yi < mid < yi + li), the portion below `mid` is a rectangle with width `li` and height `mid - yi`. Its area is `li * (mid - yi)`.
 *
 * To calculate the area above `mid` for a square [xi, yi, li]:
 * - If the square is entirely above `mid` (yi >= mid), its full area `li * li` is above.
 * - If the square is entirely below `mid` (yi + li <= mid), its area above is 0.
 * - If the square straddles `mid` (yi < mid < yi + li), the portion above `mid` is a rectangle with width `li` and height `(yi + li) - mid`. Its area is `li * ((yi + li) - mid)`.
 *
 * We want to find a `mid` such that `area_below(mid) == area_above(mid)`.
 * This is equivalent to finding `mid` such that `area_below(mid) == total_area / 2`.
 *
 * The binary search works as follows:
 * - Initialize `low = 0` and `high = max_possible_y_coordinate`. The maximum y-coordinate can be estimated. A safe upper bound could be the maximum `yi + li` of all squares, or even a very large number like 2e9 (since `yi` and `li` can be up to 10^9).
 * - In each iteration, calculate `mid = low + (high - low) / 2`.
 * - Calculate `current_area_below = calculate_area_below(mid)`.
 * - Calculate `total_area`.
 * - If `current_area_below < total_area / 2`, it means the line is too low, and we need to move it up. So, `low = mid`.
 * - If `current_area_below > total_area / 2`, it means the line is too high, and we need to move it down. So, `high = mid`.
 * - If `current_area_below == total_area / 2` (within a small epsilon due to floating-point precision), we have found our answer.
 * - We repeat this for a fixed number of iterations (e.g., 100) to achieve the desired precision of 10^-5.
 *
 * Time Complexity:
 * Let N be the number of squares.
 * The binary search performs a fixed number of iterations (e.g., 100) for precision.
 * In each iteration, we iterate through all N squares to calculate the area.
 * Therefore, the time complexity is O(Iterations * N), which is effectively O(N) because Iterations is a constant.
 *
 * Space Complexity:
 * We only use a few variables to store `low`, `high`, `mid`, `total_area`, and `current_area_below`.
 * Therefore, the space complexity is O(1).
 */
class Solution {
    public double separateSquares(int[][] squares) {
        // Calculate the total area of all squares.
        // We use double for total area to handle potential large values and for precision in division.
        double totalArea = 0;
        // A very large upper bound for y-coordinate.
        // yi and li can be up to 10^9, so yi + li can be up to 2 * 10^9.
        // We use 2e9 + 7 for a slightly safer upper bound if needed, but 2e9 should suffice.
        double high = 0; 
        for (int[] square : squares) {
            long l = square[2]; // Side length
            totalArea += (double)l * l;
            high = Math.max(high, (double)square[1] + l); // Update max y-coordinate to use as upper bound for binary search
        }

        // Binary search for the y-coordinate.
        // We are looking for a y-coordinate `y` such that the area below `y` equals totalArea / 2.
        double low = 0;
        // The number of iterations determines the precision. 100 iterations are usually sufficient for 10^-5 precision.
        int iterations = 100; 

        for (int i = 0; i < iterations; i++) {
            double mid = low + (high - low) / 2.0; // Candidate y-coordinate for the horizontal line

            // Calculate the total area of squares that are below the `mid` line.
            double areaBelowMid = calculateAreaBelow(squares, mid);

            // If the area below `mid` is less than half of the total area,
            // it means the line is too low, and we need to move it up.
            // So, we set `low = mid`.
            if (areaBelowMid < totalArea / 2.0) {
                low = mid;
            } 
            // If the area below `mid` is greater than half of the total area,
            // it means the line is too high, and we need to move it down.
            // So, we set `high = mid`.
            else {
                high = mid;
            }
        }

        // After the binary search, `low` (or `high`) will be very close to the desired y-coordinate.
        // We can return `low` or `high`.
        return low;
    }

    /**
     * Calculates the total area of the parts of squares that lie below a given y-coordinate `lineY`.
     *
     * @param squares The array of squares, where each square is [xi, yi, li].
     * @param lineY   The y-coordinate of the horizontal line.
     * @return The total area below the line.
     */
    private double calculateAreaBelow(int[][] squares, double lineY) {
        double areaBelow = 0;
        for (int[] square : squares) {
            double xi = square[0];
            double yi = square[1];
            double li = square[2];
            double squareTopY = yi + li;

            // Case 1: The square is entirely below the line.
            // The bottom of the square (yi) is below the line, and the top of the square (yi + li) is also below the line.
            if (squareTopY <= lineY) {
                areaBelow += li * li; // Add the full area of the square.
            }
            // Case 2: The square is entirely above the line.
            // The bottom of the square (yi) is above the line.
            else if (yi >= lineY) {
                // No part of the square is below the line.
                // areaBelow += 0;
            }
            // Case 3: The square straddles the line.
            // The bottom of the square is below the line, but the top is above or at the line.
            // Or, the bottom of the square is at or above the line, but the top is above.
            // Specifically, if yi < lineY < yi + li.
            else { // yi < lineY < yi + li
                // The portion below the line is a rectangle with width `li` and height `lineY - yi`.
                areaBelow += li * (lineY - yi);
            }
        }
        return areaBelow;
    }
}
```