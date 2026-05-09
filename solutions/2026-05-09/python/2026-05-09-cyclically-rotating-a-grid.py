```python
# Problem: Cyclically Rotating a Grid
# Link: https://leetcode.com/problems/cyclically-rotating-a-grid/
#
# Approach:
# The problem requires cyclically rotating each layer of the grid counter-clockwise.
# We can extract each layer as a 1D list, perform the cyclic rotation on this list,
# and then place the rotated elements back into the grid.
#
# To extract layers:
# A layer is defined by its top-left corner (row1, col1) and bottom-right corner (row2, col2).
# For a grid of size m x n, the outermost layer has corners (0, 0) and (m-1, n-1).
# The next layer has corners (1, 1) and (m-2, n-2), and so on.
# We can iterate from the outermost layer inwards. For each layer, we collect its elements
# by traversing its perimeter: top row (left to right), right column (top to bottom),
# bottom row (right to left), and left column (bottom to top).
#
# Cyclic Rotation of a 1D list:
# To cyclically rotate a list `arr` by `k` positions counter-clockwise, we can use the
# modulo operator. If the length of the list is `L`, then `k` rotations is equivalent to
# `k % L` rotations. The new position of an element at index `i` will be `(i - k % L + L) % L`.
# A simpler way is to slice the list: `rotated_arr = arr[k % L:] + arr[:k % L]`.
#
# Placing elements back:
# After rotating the 1D list for a layer, we place these elements back into the grid
# in the same order they were extracted, effectively performing the counter-clockwise
# rotation.
#
# The number of layers is `min(m, n) // 2`.
# We iterate through these layers. For each layer, we determine its boundary coordinates.
# We then extract the elements of that layer into a temporary list.
# We perform the cyclic rotation on this temporary list.
# Finally, we populate the grid with the rotated elements.
#
# Time Complexity:
# Let m be the number of rows and n be the number of columns.
# Extracting elements for a layer takes O(perimeter of layer) time. The perimeter of layer `l` is 2*(m - 2*l) + 2*(n - 2*l) - 4.
# Summing the perimeters for all layers:
# For the outermost layer (l=0), perimeter is 2*m + 2*n - 4.
# For the next layer (l=1), perimeter is 2*(m-2) + 2*(n-2) - 4.
# ...
# The total number of elements in the grid is m*n.
# Extracting all elements and placing them back takes O(m*n) time.
# Performing cyclic rotation on a list of size `P` (perimeter) takes O(P) time using slicing.
# The sum of perimeters is proportional to m*n.
# Thus, the total time complexity is O(m*n).
#
# Space Complexity:
# We use a temporary list to store the elements of a single layer. The maximum size of this
# list is the perimeter of the largest layer, which is O(m+n).
# Therefore, the space complexity is O(m+n).
#
class Solution:
    def cyclicallyRotatingGrid(self, grid: list[list[int]], k: int) -> list[list[int]]:
        m = len(grid)
        n = len(grid[0])
        
        # Number of layers in the grid
        num_layers = min(m, n) // 2

        # Iterate through each layer from outermost to innermost
        for layer_idx in range(num_layers):
            # Define the boundaries of the current layer
            row1, col1 = layer_idx, layer_idx
            row2, col2 = m - 1 - layer_idx, n - 1 - layer_idx

            # If the layer is invalid (e.g., a single row/column which shouldn't happen with even m, n)
            if row1 >= row2 or col1 >= col2:
                break
            
            # Extract elements of the current layer into a 1D list
            layer_elements = []
            
            # Traverse top row (left to right)
            for c in range(col1, col2):
                layer_elements.append(grid[row1][c])
            
            # Traverse right column (top to bottom)
            for r in range(row1, row2):
                layer_elements.append(grid[r][col2])
            
            # Traverse bottom row (right to left)
            for c in range(col2, col1, -1):
                layer_elements.append(grid[row2][c])
            
            # Traverse left column (bottom to top)
            for r in range(row2, row1, -1):
                layer_elements.append(grid[r][col1])

            # Calculate the effective number of rotations for this layer
            # The length of the layer elements list is its perimeter
            layer_len = len(layer_elements)
            effective_k = k % layer_len
            
            # Perform the cyclic rotation on the extracted layer elements
            # Counter-clockwise rotation: elements from index `effective_k` to the end
            # followed by elements from the beginning up to `effective_k`.
            rotated_layer_elements = layer_elements[effective_k:] + layer_elements[:effective_k]
            
            # Place the rotated elements back into the grid for the current layer
            element_idx = 0
            
            # Traverse top row (left to right)
            for c in range(col1, col2):
                grid[row1][c] = rotated_layer_elements[element_idx]
                element_idx += 1
            
            # Traverse right column (top to bottom)
            for r in range(row1, row2):
                grid[r][col2] = rotated_layer_elements[element_idx]
                element_idx += 1
            
            # Traverse bottom row (right to left)
            for c in range(col2, col1, -1):
                grid[row2][c] = rotated_layer_elements[element_idx]
                element_idx += 1
            
            # Traverse left column (bottom to top)
            for r in range(row2, row1, -1):
                grid[r][col1] = rotated_layer_elements[element_idx]
                element_idx += 1
        
        return grid

```