/*
Problem Summary:
This problem asks for the minimum number of moves a student needs to collect all litter ('L') in a grid classroom, starting from 'S'. The student has a maximum energy capacity and loses 1 energy per move. Energy can be restored to full at 'R' (reset) cells. Obstacles 'X' cannot be passed.

Link to the problem:
https://leetcode.com/problems/minimum-moves-to-clean-the-classroom/

Approach Explanation:
This problem can be modeled as a shortest path problem on a graph where nodes represent states and edges represent moves. Since we need the *minimum* number of moves, Breadth-First Search (BFS) is the appropriate algorithm.

A state in our BFS needs to capture:
1.  `row`: The current row position of the student.
2.  `col`: The current column position of the student.
3.  `current_energy`: The remaining energy the student has.
4.  `litter_mask`: A bitmask representing which litter items have been collected. Each 'L' cell is assigned a unique index (0 to `num_litter - 1`), and the corresponding bit in the mask is set to 1 when that litter is collected.

The BFS explores states layer by layer, ensuring that the first time we reach a state where all litter is collected, we have found the minimum number of moves.

The `dist[row][col][energy][litter_mask]` 4D array is used to store the minimum moves required to reach a specific state. It also serves as a `visited` set to prevent redundant computations and cycles. It's initialized to -1 (unvisited).

Energy mechanics:
- Moving to an adjacent cell costs 1 energy.
- If the student is on an 'R' cell, their energy is fully restored to `initial_energy` *before* they make the next move.
- If the student's `current_energy` is 0 and they are *not* on an 'R' cell, they cannot make any further moves from that position.
- If the student moves to an 'R' cell, their energy is immediately reset to `initial_energy` *upon arrival* at that cell.
- If the student moves to an 'L' cell, that litter is considered collected, and the `litter_mask` is updated.

Time Complexity:
The total number of states is `m * n * (energy + 1) * (1 << num_litter)`.
- `m, n` are grid dimensions (up to 20).
- `energy` is max energy (up to 50).
- `num_litter` is the count of 'L' cells (up to 10).
For each state, we explore at most 4 neighbors.
So, the time complexity is `O(m * n * energy * 2^num_litter)`.
With the given constraints: `20 * 20 * 50 * 2^10 = 400 * 50 * 1024 = 20,480,000` operations, which is efficient enough for typical time limits.

Space Complexity:
The primary space consumer is the `dist` array.
Its size is `m * n * (energy + 1) * (1 << num_litter)` integers.
`20 * 20 * 51 * 1024 * sizeof(int)` (assuming `sizeof(int) = 4` bytes).
`400 * 51 * 1024 * 4 = 83,558,400` bytes, which is approximately `83.5 MB`. This should be acceptable within typical memory limits (e.g., 256MB or 512MB). The queue also stores states, but its maximum size is bounded by the total number of states.
*/

#include <vector>   // For std::vector
#include <string>   // For std::string
#include <queue>    // For std::queue
#include <tuple>    // For std::tuple
#include <cstring>  // For memset

// Define maximum grid dimensions, energy, and litter count based on constraints.
const int MAX_M = 20;
const int MAX_N = 20;
const int MAX_ENERGY = 50;
const int MAX_LITTER_COUNT = 10; // Maximum number of 'L' cells allowed

// The dist array stores the minimum moves to reach a specific state (r, c, current_energy, litter_mask).
// Initialized to -1 to signify unvisited states.
// Declared globally or as static member to avoid stack overflow for large fixed-size arrays.
int dist[MAX_M][MAX_N][MAX_ENERGY + 1][1 << MAX_LITTER_COUNT];

// litter_index_grid stores the assigned index for each 'L' cell.
// If a cell is not 'L', it stores -1. This helps quickly get the bit index for the mask.
int litter_index_grid[MAX_M][MAX_N];

// Arrays for movement directions: up, down, left, right.
int dr[] = {-1, 1, 0, 0};
int dc[] = {0, 0, -1, 1};

class Solution {
public:
    int minimumMoves(std::vector<std::string>& classroom, int energy) {
        // Get the dimensions of the classroom grid.
        int m = classroom.size();
        int n = classroom[0].size();
        
        // Initialize the dist array with -1 to mark all states as unvisited.
        // memset is efficient for initializing large C-style arrays with a specific byte value (like -1 or 0).
        memset(dist, -1, sizeof(dist));
        
        // Variables to store the starting position and process litter locations.
        int start_r, start_c;
        std::vector<std::pair<int, int>> litter_locations; // Stores (r, c) for each 'L'

        // Initialize litter_index_grid with -1 for all cells.
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                litter_index_grid[i][j] = -1;
            }
        }

        // Iterate through the grid to find 'S' and all 'L' cells.
        for (int r = 0; r < m; ++r) {
            for (int c = 0; c < n; ++c) {
                if (classroom[r][c] == 'S') {
                    start_r = r; // Store starting row
                    start_c = c; // Store starting column
                } else if (classroom[r][c] == 'L') {
                    // Assign a unique index to each 'L' cell based on its order of discovery.
                    litter_index_grid[r][c] = litter_locations.size();
                    litter_locations.push_back({r, c}); // Store coordinates
                }
            }
        }
        
        // Get the total number of litter items.
        int num_litter = litter_locations.size();
        // Calculate the target bitmask: all bits set from 0 to num_litter-1.
        // E.g., if num_litter = 3, (1 << 3) - 1 = 8 - 1 = 7 (binary 111).
        int all_litter_collected_mask = (1 << num_litter) - 1;
        
        // Initialize BFS queue. Each element is a tuple: (row, col, current_energy, litter_mask).
        std::queue<std::tuple<int, int, int, int>> q;
        
        // Push the initial state into the queue.
        // Starting position, initial max energy, 0 litter collected.
        q.push({start_r, start_c, energy, 0});
        // Mark the initial state as visited and set its distance to 0 moves.
        dist[start_r][start_c][energy][0] = 0;
        
        // Main BFS loop.
        while (!q.empty()) {
            // Dequeue the current state.
            auto [r, c, current_energy, current_mask] = q.front();
            q.pop();
            
            // Get the minimum moves taken to reach this current state.
            int moves = dist[r][c][current_energy][current_mask];
            
            // If all litter items have been collected, we found the shortest path.
            if (current_mask == all_litter_collected_mask) {
                return moves;
            }
            
            // Determine the effective energy available for making a move *from* the current cell.
            // If the current cell is 'R', the student's energy is reset to full capacity *before* moving.
            // Otherwise, they use their current remaining energy.
            int effective_energy_for_move_from_current_cell;
            if (classroom[r][c] == 'R') {
                effective_energy_for_move_from_current_cell = energy; // Full initial energy
            } else {
                effective_energy_for_move_from_current_cell = current_energy;
            }

            // If the effective energy is 0, the student cannot make any further moves from this cell.
            // This condition is important as it implies energy must be positive to move.
            if (effective_energy_for_move_from_current_cell == 0) {
                continue;
            }

            // Explore all four adjacent cells (up, down, left, right).
            for (int i = 0; i < 4; ++i) {
                int next_r = r + dr[i];
                int next_c = c + dc[i];
                
                // Check if the next cell is within grid boundaries.
                if (next_r < 0 || next_r >= m || next_c < 0 || next_c >= n) {
                    continue; // Out of bounds
                }
                
                // Check if the next cell is an obstacle ('X').
                if (classroom[next_r][next_c] == 'X') {
                    continue; // Cannot move through obstacles
                }
                
                // Calculate the energy after moving to the next cell.
                // Each move costs 1 unit of energy.
                int next_energy = effective_energy_for_move_from_current_cell - 1;
                // Initialize the litter mask for the next state; it's initially the same as current.
                int next_mask = current_mask;
                
                // Apply specific effects based on the type of the destination cell (next_r, next_c).
                if (classroom[next_r][next_c] == 'L') {
                    // If moving to an 'L' cell, collect the litter by setting its corresponding bit in the mask.
                    next_mask |= (1 << litter_index_grid[next_r][next_c]);
                }
                
                if (classroom[next_r][next_c] == 'R') {
                    // If moving to an 'R' cell, the energy is reset to full capacity *upon arrival*.
                    next_energy = energy;
                }
                
                // Check if this new state (next_r, next_c, next_energy, next_mask) has been visited before,
                // or if we found a shorter path to it.
                if (dist[next_r][next_c][next_energy][next_mask] == -1) {
                    // If unvisited, mark it with the new minimum moves and enqueue it.
                    dist[next_r][next_c][next_energy][next_mask] = moves + 1;
                    q.push({next_r, next_c, next_energy, next_mask});
                }
            }
        }
        
        // If the BFS queue becomes empty and we haven't returned (meaning all litter was not collected),
        // it's impossible to collect all litter.
        return -1;
    }
};