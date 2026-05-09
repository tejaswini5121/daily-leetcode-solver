```java
import java.util.ArrayList;
import java.util.List;

// Problem: Cyclically Rotating a Grid
// Link: https://leetcode.com/problems/cyclically-rotating-a-grid/
//
// Approach:
// The problem involves cyclically rotating each "layer" of the grid counter-clockwise.
// An m x n grid (where m and n are even) can be visualized as concentric rectangular
// layers. We can extract each layer, perform a cyclic rotation on it, and then
// place it back into the grid.
//
// To extract a layer:
// We can iterate through the boundaries of a layer. For a layer defined by top-left
// corner (r1, c1) and bottom-right corner (r2, c2), we traverse:
// 1. Top row from left to right: grid[r1][c1] to grid[r1][c2]
// 2. Rightmost column from top to bottom: grid[r1+1][c2] to grid[r2][c2]
// 3. Bottom row from right to left: grid[r2][c2-1] to grid[r2][c1]
// 4. Leftmost column from bottom to top: grid[r2-1][c1] to grid[r1+1][c1]
//
// To perform a cyclic rotation on a layer:
// After extracting the elements of a layer into a list (or array), a cyclic rotation
// by `k` positions means the element at index `i` moves to index `(i - k) % size`
// (modulo `size` to wrap around). Since we are doing counter-clockwise rotation,
// we need to adjust the indices. If `k` is large, we can take `k % size` to get
// the effective number of rotations.
//
// To place a layer back:
// After rotating the extracted list of elements, we fill the grid cells of that layer
// in the same traversal order as extraction, but using the rotated elements.
//
// The layers are defined by the top-left corner (r1, c1) and bottom-right corner (r2, c2).
// For the outermost layer, r1=0, c1=0, r2=m-1, c2=n-1.
// For the next layer, r1=1, c1=1, r2=m-2, c2=n-2, and so on.
// This continues until r1 >= r2 or c1 >= c2.
//
// The maximum number of layers is min(m, n) / 2.
//
// Time Complexity:
// Let m be the number of rows and n be the number of columns.
// The number of elements in a layer is approximately 2*(width + height).
// For a layer, width = c2 - c1 + 1 and height = r2 - r1 + 1.
// The total number of elements in all layers is O(m*n).
// For each layer, we extract elements (O(layer_size)), rotate the list (O(layer_size)),
// and place elements back (O(layer_size)).
// The sum of layer sizes is O(m*n).
// The effective number of rotations `k` is taken modulo the size of the layer.
// Thus, the overall time complexity is O(m*n).
//
// Space Complexity:
// We use a temporary list to store the elements of each layer. The maximum size of this list
// is the size of the largest layer, which is O(m+n).
// Thus, the space complexity is O(m+n).
class Solution {
    public int[][] cyclicallyRotatingGrid(int[][] grid, int k) {
        int m = grid.length;
        int n = grid[0].length;

        // We process the grid layer by layer.
        // Each layer is defined by its top-left (r1, c1) and bottom-right (r2, c2) coordinates.
        // Layers are processed from the outermost to the innermost.
        for (int r1 = 0, c1 = 0, r2 = m - 1, c2 = n - 1; r1 < r2 && c1 < c2; r1++, c1++, r2--, c2--) {
            // Extract elements of the current layer into a list.
            List<Integer> layerElements = new ArrayList<>();

            // Traverse the top row from left to right
            for (int c = c1; c <= c2; c++) {
                layerElements.add(grid[r1][c]);
            }
            // Traverse the rightmost column from top to bottom (excluding the top-right corner already added)
            for (int r = r1 + 1; r <= r2; r++) {
                layerElements.add(grid[r][c2]);
            }
            // Traverse the bottom row from right to left (excluding the bottom-right corner already added)
            for (int c = c2 - 1; c >= c1; c--) {
                layerElements.add(grid[r2][c]);
            }
            // Traverse the leftmost column from bottom to top (excluding the bottom-left corner already added)
            for (int r = r2 - 1; r > r1; r--) {
                layerElements.add(grid[r][c1]);
            }

            // Calculate the effective number of rotations.
            // The size of the layer is the number of elements extracted.
            int layerSize = layerElements.size();
            // We only need to rotate by k % layerSize.
            // A counter-clockwise rotation by k positions means element at index i moves to (i - k) % layerSize.
            // To simplify calculations for rotation, we can think of it as shifting elements.
            // If we rotate `k` times counter-clockwise, the element that was at index `i`
            // will now be at `(i - k) % layerSize`.
            // However, when we are filling the grid, we want to know which element from the original
            // `layerElements` list should go into a specific position.
            // For a position that corresponds to the `j`-th element in the traversal order of the layer,
            // it should receive the element from `layerElements` that was `k` positions "behind" it
            // in the original sequence. This is equivalent to `layerElements.get((j - k % layerSize + layerSize) % layerSize)`.
            // A simpler way is to calculate the new position. If an element is at index `idx` in the list,
            // after `k` counter-clockwise rotations, its new index will be `(idx - k % layerSize + layerSize) % layerSize`.
            // When we are populating, for the `idx`-th position in the rotated list, it should get the element
            // that was originally at `(idx + k % layerSize) % layerSize`.
            // The modulo arithmetic needs to be handled carefully for negative results.
            int effectiveK = k % layerSize;

            // Place the rotated elements back into the grid.
            int elementIndex = 0; // Index into the layerElements list

            // Traverse the top row from left to right
            for (int c = c1; c <= c2; c++) {
                // The element at `grid[r1][c]` should be the element that was `effectiveK` positions ahead
                // in the original `layerElements` list.
                grid[r1][c] = layerElements.get((elementIndex + effectiveK) % layerSize);
                elementIndex++;
            }
            // Traverse the rightmost column from top to bottom
            for (int r = r1 + 1; r <= r2; r++) {
                grid[r][c2] = layerElements.get((elementIndex + effectiveK) % layerSize);
                elementIndex++;
            }
            // Traverse the bottom row from right to left
            for (int c = c2 - 1; c >= c1; c--) {
                grid[r2][c] = layerElements.get((elementIndex + effectiveK) % layerSize);
                elementIndex++;
            }
            // Traverse the leftmost column from bottom to top
            for (int r = r2 - 1; r > r1; r--) {
                grid[r][c1] = layerElements.get((elementIndex + effectiveK) % layerSize);
                elementIndex++;
            }
        }

        return grid;
    }
}
```