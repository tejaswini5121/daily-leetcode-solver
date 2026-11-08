```java
/**
 * Counts the number of servers that can communicate with at least one other server.
 * Two servers communicate if they are in the same row or same column.
 * Link: https://leetcode.com/problems/count-servers-that-communicate/
 *
 * Approach:
 * We can solve this problem by first counting the number of servers in each row and each column.
 * Then, iterate through the grid. For each server (grid[i][j] == 1), check if there is
 * another server in the same row (row_counts[i] > 1) or in the same column (col_counts[j] > 1).
 * If either condition is true, increment the count of communicating servers.
 *
 * Time Complexity: O(m * n), where m is the number of rows and n is the number of columns.
 * We iterate through the grid twice: once to precompute row and column counts, and once to
 * count the communicating servers.
 *
 * Space Complexity: O(m + n), to store the counts of servers in each row and column.
 */
class Solution {
    public int countServers(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // Arrays to store the count of servers in each row and column.
        int[] rowCounts = new int[m];
        int[] colCounts = new int[n];

        // First pass: Populate rowCounts and colCounts.
        // Iterate through each cell of the grid.
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // If a server is present at grid[i][j] (value is 1).
                if (grid[i][j] == 1) {
                    // Increment the server count for this row.
                    rowCounts[i]++;
                    // Increment the server count for this column.
                    colCounts[j]++;
                }
            }
        }

        // Variable to store the total number of communicating servers.
        int communicatingServers = 0;

        // Second pass: Count servers that communicate.
        // Iterate through each cell of the grid again.
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // If a server is present at grid[i][j] (value is 1).
                if (grid[i][j] == 1) {
                    // Check if this server communicates with any other server.
                    // A server communicates if there is more than one server in its row
                    // OR more than one server in its column.
                    if (rowCounts[i] > 1 || colCounts[j] > 1) {
                        // If it communicates, increment the counter.
                        communicatingServers++;
                    }
                }
            }
        }

        // Return the total count of communicating servers.
        return communicatingServers;
    }
}
```