/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number[][]}
 *
 * Problem Summary: Rotates each layer of a grid cyclically counter-clockwise k times.
 * Link: https://leetcode.com/problems/cyclically-rotating-a-grid/
 *
 * Approach:
 * The problem can be solved by treating each layer of the grid as a separate list and performing a cyclic rotation on that list.
 *
 * 1. Identify Layers: We can iterate through the grid from the outermost layer inwards. A layer is defined by its top-left corner (row, col) and its bottom-right corner (m-1-row, n-1-col).
 * 2. Extract Layer Elements: For each layer, we extract its elements into a 1D array in counter-clockwise order.
 * 3. Cyclic Rotation: We then perform a cyclic rotation on this 1D array by `k` positions. Since rotations are cyclical, we can take `k` modulo the length of the 1D array to find the effective number of rotations.
 * 4. Populate Layer: After rotating the 1D array, we populate the corresponding layer in the original grid with the rotated elements, again in counter-clockwise order.
 * 5. Repeat for All Layers: We repeat this process for all layers, moving inwards. The number of layers is `min(m, n) / 2`.
 *
 * Time Complexity:
 * Let m be the number of rows and n be the number of columns.
 * Extracting elements from a layer: The perimeter of a layer at depth `d` is `2 * (m - 2*d) + 2 * (n - 2*d) - 4` (subtract 4 for the corners counted twice). This is O(m + n).
 * Rotating a 1D array of length `L`: O(L).
 * Populating a layer: O(m + n).
 * There are `min(m, n) / 2` layers.
 * In the worst case (outermost layer), the number of elements is O(m + n).
 * The total time complexity is approximately O(min(m, n) * (m + n)).
 *
 * Space Complexity:
 * We use a temporary 1D array to store the elements of each layer. The maximum size of this array is O(m + n) (for the outermost layer).
 * Therefore, the space complexity is O(m + n).
 */
var rotateGrid = function(grid, k) {
    const m = grid.length;
    const n = grid[0].length;
    const numLayers = Math.min(m, n) / 2; // Number of layers is half of the smaller dimension

    // Create a deep copy of the grid to store the rotated result
    const rotatedGrid = grid.map(row => [...row]);

    // Iterate through each layer
    for (let layer = 0; layer < numLayers; layer++) {
        // Define the boundaries of the current layer
        let top = layer;
        let bottom = m - 1 - layer;
        let left = layer;
        let right = n - 1 - layer;

        // Extract elements of the current layer into a 1D array (counter-clockwise)
        const layerElements = [];

        // Top row (left to right)
        for (let j = left; j <= right; j++) {
            layerElements.push(grid[top][j]);
        }
        // Right column (top to bottom, excluding top-right corner already added)
        for (let i = top + 1; i <= bottom; i++) {
            layerElements.push(grid[i][right]);
        }
        // Bottom row (right to left, excluding bottom-right corner already added)
        for (let j = right - 1; j >= left; j--) {
            layerElements.push(grid[bottom][j]);
        }
        // Left column (bottom to top, excluding bottom-left and top-left corners already added)
        for (let i = bottom - 1; i > top; i--) {
            layerElements.push(grid[i][left]);
        }

        // Calculate the effective number of rotations
        const effectiveK = k % layerElements.length;

        // Rotate the layer elements cyclically
        const rotatedLayerElements = new Array(layerElements.length);
        for (let i = 0; i < layerElements.length; i++) {
            rotatedLayerElements[(i + effectiveK) % layerElements.length] = layerElements[i];
        }

        // Populate the rotated elements back into the grid layer
        let elementIndex = 0;

        // Top row (left to right)
        for (let j = left; j <= right; j++) {
            rotatedGrid[top][j] = rotatedLayerElements[elementIndex++];
        }
        // Right column (top to bottom)
        for (let i = top + 1; i <= bottom; i++) {
            rotatedGrid[i][right] = rotatedLayerElements[elementIndex++];
        }
        // Bottom row (right to left)
        for (let j = right - 1; j >= left; j--) {
            rotatedGrid[bottom][j] = rotatedLayerElements[elementIndex++];
        }
        // Left column (bottom to top)
        for (let i = bottom - 1; i > top; i--) {
            rotatedGrid[i][left] = rotatedLayerElements[elementIndex++];
        }
    }

    return rotatedGrid;
};
```