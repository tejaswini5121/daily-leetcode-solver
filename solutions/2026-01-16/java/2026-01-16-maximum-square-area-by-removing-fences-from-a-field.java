/**
 * Problem: Maximum Square Area by Removing Fences From a Field
 * Link: https://leetcode.com/problems/maximum-square-area-by-removing-fences-from-a-field/
 *
 * Approach:
 * The problem asks for the maximum area of a square that can be formed by removing some horizontal and vertical fences.
 * A square can be formed by choosing a set of horizontal fence coordinates and a set of vertical fence coordinates such that the difference between adjacent chosen horizontal fences is equal to the difference between adjacent chosen vertical fences. This common difference would be the side length of the square.
 * To maximize the square area, we need to maximize this side length.
 *
 * The key insight is that the boundaries of the field (1 and m for horizontal, 1 and n for vertical) are also considered fences and cannot be removed.
 * So, the potential horizontal lines that can form the top/bottom of a square are 1, m, and the coordinates in hFences. Similarly, for vertical lines, they are 1, n, and the coordinates in vFences.
 *
 * Let's consider all possible horizontal segments we can form by using the boundary fences and the given horizontal fences. If we sort the horizontal fences and add 1 and m to them, we get a sorted list of horizontal lines: `[1, hFences[0], hFences[1], ..., hFences[k], m]`. The differences between adjacent elements in this sorted list represent the possible heights of rectangular regions.
 *
 * Similarly, for vertical segments, we sort vFences and add 1 and n to them: `[1, vFences[0], vFences[1], ..., vFences[l], n]`. The differences between adjacent elements in this sorted list represent the possible widths of rectangular regions.
 *
 * To form a square, we need to find a horizontal segment length `h_diff` and a vertical segment length `v_diff` such that `h_diff == v_diff`. The maximum possible side length of a square will be the maximum `h_diff` that also exists as a `v_diff`.
 *
 * We can iterate through all possible horizontal segment lengths and check if they also exist as vertical segment lengths. To efficiently check for existence, we can store the vertical segment lengths in a hash set.
 *
 * Algorithm:
 * 1. Create a sorted list of all horizontal boundaries: `horizontal_boundaries = [1] + hFences + [m]`. Sort `hFences` first, then add 1 and m.
 * 2. Calculate all possible horizontal segment lengths (differences between adjacent elements in `horizontal_boundaries`). Store these differences.
 * 3. Create a sorted list of all vertical boundaries: `vertical_boundaries = [1] + vFences + [n]`. Sort `vFences` first, then add 1 and n.
 * 4. Calculate all possible vertical segment lengths (differences between adjacent elements in `vertical_boundaries`). Store these differences in a hash set for efficient lookup.
 * 5. Initialize `max_side = 0`.
 * 6. Iterate through the calculated horizontal segment lengths. For each horizontal segment length `h_diff`:
 *    a. Check if `h_diff` is present in the hash set of vertical segment lengths.
 *    b. If it is, update `max_side = max(max_side, h_diff)`.
 * 7. If `max_side == 0`, it's impossible to form a square (other than 0x0, which is not a valid square for area calculation), so return -1.
 * 8. Otherwise, the maximum area is `max_side * max_side`. Since the answer can be large, return `(max_side * max_side) % (10^9 + 7)`.
 *
 * The modulo operation should be applied to the final result. Note that `max_side` itself can be up to `10^9`, so `max_side * max_side` can exceed `long` limits if not careful. However, since we are asked to return the result modulo `10^9 + 7`, we can perform calculations with `long` and then apply modulo. A `long` can hold up to `9 * 10^18`, which is enough for `(10^9)^2`.
 *
 * Time Complexity:
 * - Sorting `hFences`: O(H log H), where H is the length of `hFences`.
 * - Sorting `vFences`: O(V log V), where V is the length of `vFences`.
 * - Generating horizontal differences: O(H).
 * - Generating vertical differences and inserting into a hash set: O(V).
 * - Iterating through horizontal differences and checking in hash set: O(H).
 * Overall time complexity is dominated by sorting: O(H log H + V log V). Given the constraints H, V <= 600, this is efficient.
 *
 * Space Complexity:
 * - Storing horizontal differences: O(H).
 * - Storing vertical differences in a hash set: O(V).
 * Overall space complexity is O(H + V).
 */
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.ArrayList;

class Solution {
    /**
     * Calculates the maximum square area that can be formed by removing fences.
     *
     * @param m The width of the field.
     * @param n The height of the field.
     * @param hFences An array of horizontal fence coordinates.
     * @param vFences An array of vertical fence coordinates.
     * @return The maximum square area modulo 10^9 + 7, or -1 if impossible.
     */
    public int maximumSquareArea(int m, int n, int[] hFences, int[] vFences) {
        // Define the modulo value as per the problem statement.
        long MOD = 1_000_000_007;

        // Create a list of all horizontal boundary coordinates.
        // These include the field boundaries (1 and m) and the given horizontal fences.
        List<Integer> hBoundaries = new ArrayList<>();
        hBoundaries.add(1); // Add the top boundary
        for (int fence : hFences) {
            hBoundaries.add(fence); // Add each horizontal fence
        }
        hBoundaries.add(m); // Add the bottom boundary
        // Sort the horizontal boundaries to easily calculate segment lengths.
        // Using a List and then converting to array for sorting is one way, or directly using Arrays.sort on a temporary array.
        // Since hFences can be up to 600, we can sort directly.
        // We are adding 2 elements to hFences, so length is hFences.length + 2.
        int[] hArr = new int[hFences.length + 2];
        hArr[0] = 1;
        for(int i = 0; i < hFences.length; i++) {
            hArr[i+1] = hFences[i];
        }
        hArr[hFences.length+1] = m;
        Arrays.sort(hArr);


        // Store all possible vertical segment lengths in a HashSet for efficient lookup.
        Set<Long> vSegmentLengths = new HashSet<>();

        // Create a list of all vertical boundary coordinates.
        // These include the field boundaries (1 and n) and the given vertical fences.
        List<Integer> vBoundaries = new ArrayList<>();
        vBoundaries.add(1); // Add the left boundary
        for (int fence : vFences) {
            vBoundaries.add(fence); // Add each vertical fence
        }
        vBoundaries.add(n); // Add the right boundary
        // Sort the vertical boundaries to easily calculate segment lengths.
        // Similar to horizontal fences.
        int[] vArr = new int[vFences.length + 2];
        vArr[0] = 1;
        for(int i = 0; i < vFences.length; i++) {
            vArr[i+1] = vFences[i];
        }
        vArr[vFences.length+1] = n;
        Arrays.sort(vArr);


        // Calculate all possible vertical segment lengths and add them to the set.
        // A segment length is the difference between two adjacent vertical boundaries.
        for (int i = 0; i < vArr.length - 1; i++) {
            vSegmentLengths.add((long) vArr[i+1] - vArr[i]);
        }

        // Variable to store the maximum side length of a possible square.
        long maxSide = 0;

        // Iterate through all possible horizontal segment lengths.
        // A segment length is the difference between two adjacent horizontal boundaries.
        for (int i = 0; i < hArr.length - 1; i++) {
            long currentHDiff = (long) hArr[i+1] - hArr[i];

            // If this horizontal segment length also exists as a vertical segment length,
            // it means we can form a square with this side length.
            if (vSegmentLengths.contains(currentHDiff)) {
                // Update maxSide if the current segment length is larger.
                maxSide = Math.max(maxSide, currentHDiff);
            }
        }

        // If maxSide is still 0, it means no common segment length was found,
        // so it's impossible to form a square (of positive area).
        if (maxSide == 0) {
            return -1;
        }

        // The maximum area is the square of the maximum side length.
        // We need to return this area modulo 10^9 + 7.
        // Calculate area using long to prevent overflow before applying modulo.
        long maxArea = (maxSide * maxSide) % MOD;

        return (int) maxArea;
    }
}
