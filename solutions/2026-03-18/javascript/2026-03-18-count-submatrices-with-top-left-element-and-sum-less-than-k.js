// /**
//  * @param {number[][]} grid
//  * @param {number} k
//  * @return {number}
//  */
// // Problem Summary: Count submatrices with the top-left element and sum <= k.
// // Link: https://leetcode.com/problems/count-submatrices-with-top-left-element-and-sum-less-than-k/
// // Approach:
// // We can use a 2D prefix sum array to efficiently calculate the sum of any submatrix.
// // Since we are only interested in submatrices that start at the top-left element (0,0),
// // any submatrix defined by its bottom-right corner (r, c) will automatically include the top-left element.
// // We can iterate through all possible bottom-right corners (r, c) of the grid.
// // For each (r, c), we calculate the sum of the submatrix from (0,0) to (r,c) using the prefix sum array.
// // If this sum is less than or equal to k, we increment our count.
// //
// // The 2D prefix sum `prefixSum[r][c]` will store the sum of all elements in the submatrix
// // from (0,0) to (r-1, c-1).
// // The recurrence relation for `prefixSum` is:
// // `prefixSum[r][c] = grid[r-1][c-1] + prefixSum[r-1][c] + prefixSum[r][c-1] - prefixSum[r-1][c-1]`
// //
// // When calculating the sum of a submatrix from (0,0) to (r,c), it would be `prefixSum[r+1][c+1]`.
// //
// // Time Complexity: O(m * n), where m is the number of rows and n is the number of columns.
// //   We iterate through the grid once to build the prefix sum array (m*n).
// //   We then iterate through the grid again to check each submatrix (m*n).
// // Space Complexity: O(m * n) for storing the 2D prefix sum array.
//
// var countSubmatrices = function(grid, k) {
//     const m = grid.length;
//     const n = grid[0].length;
//
//     // Initialize a 2D prefix sum array with dimensions (m+1) x (n+1) for easier calculations.
//     // prefixSum[r][c] will store the sum of the submatrix from (0,0) to (r-1, c-1) in the original grid.
//     const prefixSum = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
//
//     // Build the 2D prefix sum array.
//     for (let r = 1; r <= m; r++) {
//         for (let c = 1; c <= n; c++) {
//             // The sum of the current submatrix ending at (r-1, c-1) is:
//             // The element itself (grid[r-1][c-1])
//             // plus the sum of the submatrix above it (prefixSum[r-1][c])
//             // plus the sum of the submatrix to its left (prefixSum[r][c-1])
//             // minus the sum of the overlapping submatrix (prefixSum[r-1][c-1]) to avoid double counting.
//             prefixSum[r][c] = grid[r - 1][c - 1] + prefixSum[r - 1][c] + prefixSum[r][c - 1] - prefixSum[r - 1][c - 1];
//         }
//     }
//
//     let count = 0;
//
//     // Iterate through all possible bottom-right corners (r, c) of submatrices.
//     // Since all submatrices must contain the top-left element (0,0),
//     // any submatrix defined by its bottom-right corner (r,c) will satisfy this condition.
//     for (let r = 0; r < m; r++) {
//         for (let c = 0; c < n; c++) {
//             // The sum of the submatrix from (0,0) to (r,c) is stored in prefixSum[r+1][c+1].
//             const currentSubmatrixSum = prefixSum[r + 1][c + 1];
//
//             // If the sum of the current submatrix is less than or equal to k, increment the count.
//             if (currentSubmatrixSum <= k) {
//                 count++;
//             }
//         }
//     }
//
//     return count;
// };
//
// // Example 1:
// // Input: grid = [[7,6,3],[6,6,1]], k = 18
// // Output: 4
// // Explanation: The submatrices are:
// // [[7]] sum=7 <= 18
// // [[7,6]] sum=13 <= 18
// // [[7],[6]] sum=13 <= 18
// // [[7,6],[6,6]] sum=25 > 18
// // [[7,6,3]] sum=16 <= 18
// // [[7],[6],[2]] (not in this example, but concept)
// // [[7,6,3],[6,6,1]] sum=29 > 18
//
// // Example 2:
// // Input: grid = [[7,2,9],[1,5,0],[2,6,6]], k = 20
// // Output: 6
//
// // Let's trace Example 1: grid = [[7,6,3],[6,6,1]], k = 18
// // m = 2, n = 3
//
// // prefixSum initialization (3x4):
// // [[0, 0, 0, 0],
// //  [0, 0, 0, 0],
// //  [0, 0, 0, 0]]
//
// // Building prefixSum:
// // r=1, c=1: grid[0][0]=7. prefixSum[1][1] = 7 + 0 + 0 - 0 = 7
// // r=1, c=2: grid[0][1]=6. prefixSum[1][2] = 6 + 0 + 7 - 0 = 13
// // r=1, c=3: grid[0][2]=3. prefixSum[1][3] = 3 + 0 + 13 - 0 = 16
// // prefixSum:
// // [[0, 0, 0, 0],
// //  [0, 7, 13, 16],
// //  [0, 0, 0, 0]]
//
// // r=2, c=1: grid[1][0]=6. prefixSum[2][1] = 6 + 7 + 0 - 0 = 13
// // r=2, c=2: grid[1][1]=6. prefixSum[2][2] = 6 + 13 + 13 - 7 = 25
// // r=2, c=3: grid[1][2]=1. prefixSum[2][3] = 1 + 16 + 25 - 13 = 29
// // prefixSum:
// // [[0, 0, 0, 0],
// //  [0, 7, 13, 16],
// //  [0, 13, 25, 29]]
//
// // Counting submatrices:
// // r=0, c=0: sum = prefixSum[1][1] = 7. 7 <= 18. count = 1. (Submatrix: [[7]])
// // r=0, c=1: sum = prefixSum[1][2] = 13. 13 <= 18. count = 2. (Submatrix: [[7,6]])
// // r=0, c=2: sum = prefixSum[1][3] = 16. 16 <= 18. count = 3. (Submatrix: [[7,6,3]])
// // r=1, c=0: sum = prefixSum[2][1] = 13. 13 <= 18. count = 4. (Submatrix: [[7],[6]])
// // r=1, c=1: sum = prefixSum[2][2] = 25. 25 > 18.
// // r=1, c=2: sum = prefixSum[2][3] = 29. 29 > 18.
//
// // Final count = 4.
//
// // Let's trace Example 2: grid = [[7,2,9],[1,5,0],[2,6,6]], k = 20
// // m = 3, n = 3
//
// // prefixSum initialization (4x4):
// // [[0, 0, 0, 0],
// //  [0, 0, 0, 0],
// //  [0, 0, 0, 0],
// //  [0, 0, 0, 0]]
//
// // Building prefixSum:
// // Row 1: [7, 9, 18]
// // Row 2: [8, 21, 21]
// // Row 3: [10, 36, 42]
// // prefixSum:
// // [[0,  0,  0,  0],
// //  [0,  7,  9, 18],
// //  [0,  8, 21, 21],
// //  [0, 10, 36, 42]]
//
// // Correct prefixSum calculation:
// // r=1, c=1: grid[0][0]=7. ps[1][1] = 7+0+0-0 = 7
// // r=1, c=2: grid[0][1]=2. ps[1][2] = 2+0+7-0 = 9
// // r=1, c=3: grid[0][2]=9. ps[1][3] = 9+0+9-0 = 18
// //
// // r=2, c=1: grid[1][0]=1. ps[2][1] = 1+7+0-0 = 8
// // r=2, c=2: grid[1][1]=5. ps[2][2] = 5+9+8-7 = 15
// // r=2, c=3: grid[1][2]=0. ps[2][3] = 0+18+15-9 = 24
// //
// // r=3, c=1: grid[2][0]=2. ps[3][1] = 2+8+0-0 = 10
// // r=3, c=2: grid[2][1]=6. ps[3][2] = 6+15+10-8 = 23
// // r=3, c=3: grid[2][2]=6. ps[3][3] = 6+24+23-15 = 38
// //
// // Final prefixSum:
// // [[0,  0,  0,  0],
// //  [0,  7,  9, 18],
// //  [0,  8, 15, 24],
// //  [0, 10, 23, 38]]
//
// // Counting submatrices (k=20):
// // r=0, c=0: ps[1][1]=7. 7<=20. count=1. ([[7]])
// // r=0, c=1: ps[1][2]=9. 9<=20. count=2. ([[7,2]])
// // r=0, c=2: ps[1][3]=18. 18<=20. count=3. ([[7,2,9]])
// //
// // r=1, c=0: ps[2][1]=8. 8<=20. count=4. ([[7],[1]])
// // r=1, c=1: ps[2][2]=15. 15<=20. count=5. ([[7,2],[1,5]])
// // r=1, c=2: ps[2][3]=24. 24>20.
// //
// // r=2, c=0: ps[3][1]=10. 10<=20. count=6. ([[7],[1],[2]])
// // r=2, c=1: ps[3][2]=23. 23>20.
// // r=2, c=2: ps[3][3]=38. 38>20.
//
// // Final count = 6.
//
// // The problem statement is: "Return the number of submatrices that contain the top-left element of the grid, and have a sum less than or equal to k."
// // My interpretation of "submatrices that contain the top-left element" is that the top-left corner of the submatrix *must be* grid[0][0].
// // This means any submatrix is defined by its bottom-right corner (r, c), and it will always include (0,0).
// // This is what the prefix sum approach correctly calculates.
//
//
// // Alternative interpretation: if "contain the top-left element" means that the submatrix simply *includes* grid[0][0] as one of its cells,
// // but doesn't necessarily have (0,0) as its top-left corner.
// // However, the examples clearly show submatrices starting at (0,0) and expanding.
// // Example 1 image:
// // The first image shows 4 submatrices.
// // The first is [[7]] (0,0 to 0,0)
// // The second is [[7,6]] (0,0 to 0,1)
// // The third is [[7],[6]] (0,0 to 1,0)
// // The fourth is [[7,6],[6,6]] (0,0 to 1,1) - wait, the sum of this is 25, which is > 18.
// // The image for example 1 is crucial.
// // The submatrices shown are:
// // 1. [[7]] -> sum 7
// // 2. [[7,6]] -> sum 13
// // 3. [[7],[6]] -> sum 13
// // 4. [[7,6,3]] -> sum 16
// //
// // This confirms my interpretation. All submatrices start at grid[0][0].
//
// // The code looks correct based on this interpretation and the examples.
//
//
// // Function signature and variable names are standard and clear.
// // Comments explain the prefix sum logic and the iteration for counting.
// // Edge cases: grid size 1x1 is handled. k can be large, so sum won't overflow standard JS numbers.
//
//
// // Final check on constraints: 1 <= n, m <= 1000. O(m*n) is fine.
// // 0 <= grid[i][j] <= 1000. Max sum can be 1000*1000*1000 = 10^9. Fits in JS number.
// // 1 <= k <= 10^9.
//
//
// // Code structure is good.
// // It's a single function as expected for LeetCode.
//
// // It might be slightly more efficient to combine the prefix sum calculation and the counting if the grid is very large and k is small.
// // However, the current approach with two passes is cleaner and the complexity remains O(m*n).
// // For example, if we wanted to optimize space, we could potentially do this row by row without storing the full prefix sum matrix,
// // but that would make calculating sums of submatrices more complex.
// // Given the constraints and the problem, O(m*n) space is acceptable and common for prefix sum problems.
//
//
// // Consider if there's any edge case with k. If k=0, and grid[0][0] > 0, count would be 0. Correct.
// // If grid[0][0] = 0 and k=0, count would be 1. Correct.
//
// // The problem asks for "submatrices that contain the top-left element".
// // If the top-left element is at grid[0][0], then any submatrix whose top-left corner is grid[0][0] will contain it.
// // If the problem meant *any* submatrix that *happens* to have grid[0][0] within its bounds (even if grid[0][0] is not its top-left),
// // the problem would be much harder and require a different approach.
// // However, the examples and problem phrasing strongly suggest the former.
// // "submatrices that contain the top-left element of the grid" -> this implies the submatrix's own top-left corner is grid[0][0].
// // If it meant "submatrices that have grid[0][0] as one of their cells", it would typically be phrased as "submatrices that include the cell at (0,0)".
//
// // The current solution directly addresses the most common interpretation of such problems and matches the provided examples.
//
// // The code looks ready.

var countSubmatrices = function(grid, k) {
    // Get the dimensions of the grid.
    const m = grid.length;
    const n = grid[0].length;

    // Initialize a 2D prefix sum array.
    // The prefixSum array will have dimensions (m+1) x (n+1) to simplify boundary calculations.
    // prefixSum[r][c] will store the sum of all elements in the submatrix
    // from grid[0][0] up to grid[r-1][c-1].
    const prefixSum = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    // Build the 2D prefix sum array.
    // We iterate from r=1 to m and c=1 to n because prefixSum[r][c] corresponds to grid[r-1][c-1].
    for (let r = 1; r <= m; r++) {
        for (let c = 1; c <= n; c++) {
            // The sum of the submatrix ending at grid[r-1][c-1] is calculated using the inclusion-exclusion principle:
            // 1. Add the current element: grid[r-1][c-1]
            // 2. Add the sum of the submatrix directly above it: prefixSum[r-1][c]
            // 3. Add the sum of the submatrix directly to its left: prefixSum[r][c-1]
            // 4. Subtract the sum of the overlapping submatrix (top-left diagonal) to avoid double-counting: prefixSum[r-1][c-1]
            prefixSum[r][c] = grid[r - 1][c - 1] + prefixSum[r - 1][c] + prefixSum[r][c - 1] - prefixSum[r - 1][c - 1];
        }
    }

    // Initialize a counter for submatrices that meet the criteria.
    let count = 0;

    // Iterate through all possible bottom-right corners (r, c) of submatrices.
    // Since the problem requires submatrices to contain the top-left element of the grid (grid[0][0]),
    // any submatrix defined by its bottom-right corner (r, c) where r >= 0 and c >= 0 will automatically
    // include grid[0][0] as its top-left element.
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            // The sum of the submatrix from grid[0][0] to grid[r][c] is stored in prefixSum[r+1][c+1].
            const currentSubmatrixSum = prefixSum[r + 1][c + 1];

            // If the sum of this submatrix is less than or equal to k, increment the count.
            if (currentSubmatrixSum <= k) {
                count++;
            }
        }
    }

    // Return the total count of valid submatrices.
    return count;
};
