import java.util.*;

/*
 * Problem Summary: Find the minimum moves to collect all litter ('L') in a grid classroom, starting from 'S' with limited energy.
 * Energy is consumed per move, can be restored at 'R' cells, and 'X' cells are obstacles.
 * Link: https://leetcode.com/problems/minimum-moves-to-clean-the-classroom/
 *
 * Approach Explanation:
 * This problem can be modeled as a shortest path problem on a state graph. A state must capture not only the
 * current position (row, col) and moves made, but also the remaining energy and which litter items have been collected.
 * Since we want the minimum moves, Breadth-First Search (BFS) is suitable.
 *
 * State Representation: A tuple (row, col, remaining_energy, collected_litter_mask, moves)
 * - row, col: Current coordinates in the grid.
 * - remaining_energy: Current energy units.
 * - collected_litter_mask: A bitmask representing collected litter. If there are K litter items, this will be an integer
 *   from 0 to (2^K - 1), where the i-th bit is set if the i-th litter item has been collected.
 * - moves: The number of moves taken to reach this state.
 *
 * BFS Initialization:
 * 1. Pre-process the grid to find the 'S' position and all 'L' positions. Assign a unique index to each 'L' cell.
 * 2. Initialize a queue for BFS and add the starting state: (start_row, start_col, initial_energy, 0, 0).
 * 3. Use a 4D array or a Set<State> to keep track of visited states to avoid redundant computations and cycles.
 *    A visited state should be (row, col, remaining_energy, collected_litter_mask). The `moves` count is implicitly handled
 *    by BFS because the first time a state is reached, it's via the minimum number of moves.
 *    The `remaining_energy` dimension can be up to `initial_energy + 1`. The `collected_litter_mask` can be up to `2^K`.
 *
 * BFS Steps:
 * 1. While the queue is not empty, dequeue a state (r, c, current_energy, mask, current_moves).
 * 2. If the mask indicates all litter has been collected (mask == (1 << num_litter_items) - 1), return current_moves.
 * 3. For each of the 4 adjacent cells (nr, nc):
 *    a. Check boundary conditions and if the cell is an obstacle ('X').
 *    b. Calculate new energy: `new_energy = current_energy - 1`.
 *    c. If `new_energy < 0` (meaning current_energy was 0 and not on 'R'), skip this move unless the current cell is 'R'
 *       and `current_energy` was `max_energy` (meaning we just moved *from* an 'R' cell after resetting energy).
 *       This condition is tricky: we *can* move from a cell if energy reaches 0 *unless* that cell is 'R' and we just refilled.
 *       No, simpler: if `current_energy` is 0, we can only move if the *current cell* is 'R'.
 *       When moving to (nr, nc): if grid[nr][nc] is 'R', then `new_energy` becomes `initial_energy`.
 *       Otherwise, `new_energy = current_energy - 1`.
 *       If `new_energy < 0`, this move is invalid because energy ran out before reaching 'R' or a new cell.
 *       Correct logic for energy:
 *       - If `current_energy == 0` AND the *current cell* `classroom[r][c]` is NOT 'R', then we cannot move.
 *       - If `current_energy == 0` AND `classroom[r][c]` IS 'R', then it means we refilled energy, so `current_energy` would actually be `initial_energy`.
 *         This implies that the check for `current_energy == 0` only happens if we just moved *from* a non-'R' cell.
 *         So, `new_energy = current_energy - 1`. If `new_energy < 0`, this move is invalid unless `classroom[r][c]` was 'R'.
 *         Let's re-evaluate energy cost:
 *         Moving from (r, c) to (nr, nc) costs 1 energy.
 *         Energy after move (before checking type of (nr, nc)): `next_energy_temp = current_energy - 1`.
 *         If `next_energy_temp < 0`: Invalid move. Student runs out of energy *before* reaching the next cell.
 *         If `classroom[nr][nc] == 'R'`: `next_energy = initial_energy`.
 *         Else: `next_energy = next_energy_temp`.
 *    d. Calculate new mask: `new_mask = mask`. If `classroom[nr][nc]` is 'L', set the corresponding bit in `new_mask`.
 *    e. If the state (nr, nc, new_energy, new_mask) has not been visited, mark it as visited and enqueue it
 *       with `current_moves + 1`.
 *
 * 4. If the queue becomes empty and all litter items have not been collected, return -1.
 *
 * Maximum number of 'L' cells is 10. So mask up to 2^10 = 1024.
 * Grid size up to 20x20. Energy up to 50.
 * State space: (20 * 20 * 51 * 1024) approximately 2 * 10^7 states. Each state processes 4 neighbors.
 * Total complexity: O(m * n * E * 2^K * 4). With M=20, N=20, E=50, K=10:
 * 20 * 20 * 51 * 1024 * 4 approx 8 * 10^7 operations, which should be acceptable within 1-2 seconds.
 *
 * Space complexity: O(m * n * E * 2^K) for the visited array/set and queue.
 */

class Solution {

    // Helper class to represent a state in the BFS
    static class State {
        int row;
        int col;
        int energy;
        int collectedLitterMask;
        int moves;

        public State(int row, int col, int energy, int collectedLitterMask, int moves) {
            this.row = row;
            this.col = col;
            this.energy = energy;
            this.collectedLitterMask = collectedLitterMask;
            this.moves = moves;
        }

        // Custom hashCode and equals for use in HashSet or as keys in HashMap
        // This is crucial for correctly tracking visited states
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            State state = (State) o;
            return row == state.row &&
                   col == state.col &&
                   energy == state.energy &&
                   collectedLitterMask == state.collectedLitterMask;
        }

        @Override
        public int hashCode() {
            return Objects.hash(row, col, energy, collectedLitterMask);
        }
    }

    public int minimumMoves(String[] classroom, int energy) {
        int m = classroom.length;
        int n = classroom[0].length();

        int startRow = -1, startCol = -1;
        // Map to store coordinates of 'L' cells and their corresponding bit index
        Map<String, Integer> litterPositions = new HashMap<>();
        List<int[]> litterCoords = new ArrayList<>(); // Store 'L' coords in order of index

        // Pre-process the grid to find 'S' and 'L' positions
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                char cell = classroom[r].charAt(c);
                if (cell == 'S') {
                    startRow = r;
                    startCol = c;
                } else if (cell == 'L') {
                    // Assign a unique index to each litter, used for bitmask
                    litterPositions.put(r + "," + c, litterCoords.size());
                    litterCoords.add(new int[]{r, c});
                }
            }
        }

        int numLitter = litterCoords.size();
        // The target mask when all litter items are collected
        int allLitterCollectedMask = (1 << numLitter) - 1;

        // BFS setup
        Queue<State> queue = new LinkedList<>();
        // Using a 4D boolean array for visited states.
        // visited[row][col][energy_remaining][collected_litter_mask]
        // Energy can range from 0 to 'energy' (max_energy). So, size 'energy + 1'.
        // Mask can range from 0 to (1 << numLitter) - 1. So, size '1 << numLitter'.
        boolean[][][][] visited = new boolean[m][n][energy + 1][1 << numLitter];

        // Initial state: (startRow, startCol, initial_energy, initial_mask, initial_moves)
        // Check if 'S' itself is an 'L' and update mask if it is.
        int initialMask = 0;
        if (classroom[startRow].charAt(startCol) == 'L') {
            initialMask |= (1 << litterPositions.get(startRow + "," + startCol));
        }

        // Add the starting state to the queue
        queue.offer(new State(startRow, startCol, energy, initialMask, 0));
        // Mark the initial state as visited
        visited[startRow][startCol][energy][initialMask] = true;

        // Possible moves: up, down, left, right
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};

        // BFS loop
        while (!queue.isEmpty()) {
            State current = queue.poll();

            // If all litter is collected, return the number of moves
            if (current.collectedLitterMask == allLitterCollectedMask) {
                return current.moves;
            }

            // Explore neighbors
            for (int i = 0; i < 4; i++) {
                int newR = current.row + dr[i];
                int newC = current.col + dc[i];
                int newEnergy = current.energy - 1; // 1 unit energy cost for moving
                int newLitterMask = current.collectedLitterMask;

                // Check boundaries
                if (newR < 0 || newR >= m || newC < 0 || newC >= n) {
                    continue;
                }

                char nextCellType = classroom[newR].charAt(newC);

                // Check for obstacles
                if (nextCellType == 'X') {
                    continue;
                }

                // Check energy constraint
                // We only move if we have enough energy (current.energy > 0)
                // If current.energy is 0, we can only move if current cell is 'R' (which implies current.energy should have been max_energy)
                // A simpler interpretation of "If the energy reaches 0, the student can only continue if they are on a reset area 'R'"
                // is that you *must* be on 'R' at the moment energy becomes 0. If you try to move from a non-'R' cell with 0 energy, you can't.
                // Our current energy check logic: newEnergy = current.energy - 1. If newEnergy < 0, then current.energy must have been 0.
                // So, if current.energy is 0, we can't move unless we restore energy (which happens *at* 'R' not *from* 'R').
                // Let's refine energy logic:
                // We spend 1 energy to move *to* the next cell.
                // If `current.energy` is 0, we cannot move from the `current` cell.
                // The exception is that if we are *on* an 'R' cell, our energy would have been reset to `energy` (max capacity)
                // so we would not be at 0 energy unless the `initial_energy` was 0, which is not allowed by constraints (1 <= energy).
                // So, if `current.energy` is 0, we literally cannot move.
                if (current.energy == 0) {
                    continue;
                }

                // If moving to an 'R' cell, energy is reset
                if (nextCellType == 'R') {
                    newEnergy = energy; // Reset to max capacity
                }
                // If it's an 'L' cell, update the mask
                if (nextCellType == 'L') {
                    int litterIdx = litterPositions.get(newR + "," + newC);
                    newLitterMask |= (1 << litterIdx);
                }

                // Create the new state
                State nextState = new State(newR, newC, newEnergy, newLitterMask, current.moves + 1);

                // Check if this state has been visited with the same or better energy/mask configuration
                // The `visited` array ensures we only visit each (r, c, energy, mask) tuple once
                if (!visited[nextState.row][nextState.col][nextState.energy][nextState.collectedLitterMask]) {
                    visited[nextState.row][nextState.col][nextState.energy][nextState.collectedLitterMask] = true;
                    queue.offer(nextState);
                }
            }
        }

        // If the queue becomes empty and we haven't collected all litter, it's impossible
        return -1;
    }
}