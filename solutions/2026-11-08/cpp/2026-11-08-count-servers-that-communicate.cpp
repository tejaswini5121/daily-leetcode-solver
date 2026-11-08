// Problem: Count Servers that Communicate
// Link: https://leetcode.com/problems/count-servers-that-communicate/
//
// Approach:
// We need to count servers that have at least one other server in the same row or column.
// A straightforward approach is to first count the number of servers in each row and each column.
// Then, iterate through the grid. For each server (grid[i][j] == 1), check if the count of servers
// in its row (row_counts[i]) is greater than 1 OR if the count of servers in its column (col_counts[j])
// is greater than 1. If either condition is true, this server communicates with at least one other server,
// so we increment our total count of communicating servers.
//
// Time Complexity:
// O(m * n), where m is the number of rows and n is the number of columns.
// We iterate through the grid twice: once to populate row and column counts, and once to count communicating servers.
//
// Space Complexity:
// O(m + n), for storing the counts of servers in each row and column.

#include <vector>
#include <numeric>

class Solution {
public:
    int countServers(std::vector<std::vector<int>>& grid) {
        int m = grid.size();
        int n = grid[0].size();

        // Vectors to store the count of servers in each row and column.
        std::vector<int> row_counts(m, 0);
        std::vector<int> col_counts(n, 0);

        // First pass: Count servers in each row and column.
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == 1) {
                    row_counts[i]++;
                    col_counts[j]++;
                }
            }
        }

        int communicating_servers_count = 0;

        // Second pass: Count servers that communicate.
        // A server communicates if it's in a row with more than one server OR
        // in a column with more than one server.
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                // Check if there is a server at this position.
                if (grid[i][j] == 1) {
                    // If the row has more than one server OR the column has more than one server,
                    // then this server communicates with at least one other server.
                    if (row_counts[i] > 1 || col_counts[j] > 1) {
                        communicating_servers_count++;
                    }
                }
            }
        }

        return communicating_servers_count;
    }
};
