/**
 * @summary Counts the number of servers that can communicate with at least one other server.
 *          Two servers communicate if they share the same row or column.
 * @link https://leetcode.com/problems/count-servers-that-communicate/
 * @approach The problem can be solved by iterating through the grid and, for each server,
 *           checking if there are any other servers in its row or column.
 *           To efficiently count servers in rows and columns, we can pre-compute the number
 *           of servers in each row and each column.
 *           If a server is at `grid[r][c] == 1`:
 *           - It communicates if `rowCounts[r] > 1` or `colCounts[c] > 1`.
 *           - `rowCounts[r]` is the total number of servers in row `r`.
 *           - `colCounts[c]` is the total number of servers in column `c`.
 *           We initialize `rowCounts` and `colCounts` arrays with zeros.
 *           We then iterate through the grid once to populate `rowCounts` and `colCounts`.
 *           Finally, we iterate through the grid again. If `grid[r][c] == 1` and
 *           (`rowCounts[r] > 1` or `colCounts[c] > 1`), we increment our result count.
 * @timeComplexity O(m * n), where m is the number of rows and n is the number of columns.
 *                 We iterate through the grid twice.
 * @spaceComplexity O(m + n), for storing `rowCounts` and `colCounts` arrays.
 */
var countServers = function(grid) {
    const m = grid.length;
    const n = grid[0].length;

    // Arrays to store the count of servers in each row and column.
    const rowCounts = new Array(m).fill(0);
    const colCounts = new Array(n).fill(0);

    // First pass: Populate rowCounts and colCounts.
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] === 1) {
                rowCounts[r]++;
                colCounts[c]++;
            }
        }
    }

    let communicatingServers = 0;

    // Second pass: Count servers that communicate.
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            // If there is a server at this cell.
            if (grid[r][c] === 1) {
                // A server communicates if there's more than one server in its row
                // OR more than one server in its column.
                if (rowCounts[r] > 1 || colCounts[c] > 1) {
                    communicatingServers++;
                }
            }
        }
    }

    return communicatingServers;
};
```