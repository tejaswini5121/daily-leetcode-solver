/*
Problem Summary:
This problem asks for the minimum moves to collect all 'L' (litter) items in a grid classroom, starting from 'S' (start) with a given maximum energy. Moving to an adjacent cell costs 1 energy. 'R' (reset) cells restore full energy. 'X' (obstacle) cells are impassable. If energy reaches 0, movement is only possible if on an 'R' cell.

Problem Link:
https://leetcode.com/problems/minimum-moves-to-clean-the-classroom/

Approach Explanation:
This problem can be modeled as a shortest path problem on a graph, where the state includes not only the current cell coordinates (row, col) but also the current energy level and the set of collected litter items. Since we want the minimum number of moves, Breadth-First Search (BFS) is a suitable algorithm.

A state in our BFS will be represented by a tuple: `(row, col, current_energy, collected_litter_mask)`.
- `row`, `col`: Current coordinates of the student.
- `current_energy`: Remaining energy.
- `collected_litter_mask`: A bitmask representing which litter items have been collected. If there are `k` litter items, a `k`-bit integer can represent all combinations. For example, if the 0-th bit is set, the first litter item is collected.

The BFS queue will store `[row, col, current_energy, collected_litter_mask, moves]`.
To avoid revisiting states and ensure optimality for moves, we need a `visited` set. A key for the `visited` set could be `(row, col, current_energy, collected_litter_mask)`. However, since energy can vary, a simpler approach for `visited` is `visited[row][col][current_energy][collected_litter_mask] = true`. Since `energy` can be up to 50, and `row/col` up to 20, and `collected_litter_mask` up to `2^10 - 1 = 1023`, this state space could be `20 * 20 * 51 * 1024`, which is large but potentially manageable for BFS. More effectively, we can store the minimum moves to reach a specific state, i.e., `dist[row][col][current_energy][collected_litter_mask] = minimum_moves`. Initialize `dist` with infinity and update it during BFS.

Steps:
1. Preprocessing:
   - Find the starting position 'S'.
   - Identify all 'L' (litter) locations and assign them an index (0 to k-1). Store these in a list, e.g., `litter_locations`. `num_litter = litter_locations.length`.
   - The target `collected_litter_mask` will be `(1 << num_litter) - 1`.

2. BFS Initialization:
   - Create a queue and add the initial state: `[start_row, start_col, initial_energy, 0, 0]` (0 litter collected, 0 moves).
   - Create a 4D `dist` array initialized to `Infinity`. `dist[start_row][start_col][initial_energy][0] = 0`.

3. BFS Loop:
   - While the queue is not empty:
     - Dequeue `[r, c, current_energy, collected_mask, moves]`.
     - If `collected_mask` is equal to the target `(1 << num_litter) - 1`, return `moves` (this is the first time we reach the final state, so it's the minimum).

     - Explore neighbors (up, down, left, right): `(nr, nc)`.
       - Check boundary conditions: `0 <= nr < m`, `0 <= nc < n`.
       - Check for obstacles: `classroom[nr][nc] !== 'X'`.

       - Calculate `next_energy` and `next_collected_mask`:
         - `next_energy = current_energy - 1`.
         - `next_collected_mask = collected_mask`.

       - Handle energy constraints:
         - If `next_energy < 0`:
           - If `classroom[r][c] === 'R'`, then we are on a reset cell. The move to `(nr, nc)` from `(r, c)` is valid, and energy will be reset *after* moving from `(r, c)`. So, `next_energy` will be `max_energy - 1`.
           - If `classroom[r][c] !== 'R'`, then we cannot move, skip this neighbor.
         - If `classroom[nr][nc] === 'R'`:
           - `next_energy = max_energy`.
         - If `classroom[nr][nc]` is a litter 'L' at `litter_locations[i]`:
           - `next_collected_mask = next_collected_mask | (1 << i)`.

       - If the new state `(nr, nc, next_energy, next_collected_mask)` has not been visited with fewer moves:
         - If `moves + 1 < dist[nr][nc][next_energy][next_collected_mask]`:
           - Update `dist[nr][nc][next_energy][next_collected_mask] = moves + 1`.
           - Enqueue `[nr, nc, next_energy, next_collected_mask, moves + 1]`.

4. If the queue becomes empty and the target mask is not reached, return -1.

Important Note on Energy: The problem states: "If the energy reaches 0, the student can only continue if they are on a reset area 'R', which resets the energy to its maximum capacity energy." This means if `current_energy` is 1, and we move, `next_energy` becomes 0. If `classroom[r][c]` is not 'R', we cannot move. If `classroom[r][c]` is 'R', we can move, and then the energy is reset *after* the move. So, if we are at `(r, c)` with energy `E` and `classroom[r][c]` is 'R', and `E - 1 < 0` (i.e., `E=0`), it implies we cannot move. This implies the reset happens *before* movement if at 'R'. Let's clarify: "resets the student's energy to full capacity, regardless of their current energy level (can be used multiple times)". This implies if you are on 'R', your energy is `max_energy`. If you move from 'R', it costs 1 energy, so you move with `max_energy - 1`. If you move onto 'R', your energy becomes `max_energy`.

Let's refine energy handling based on this interpretation:
When moving from `(r, c)` to `(nr, nc)`:
1. Calculate `energy_after_move_cost`: This is the energy after spending 1 unit.
   - If `classroom[r][c] === 'R'`, `current_energy` should effectively be `max_energy` before spending. So `energy_after_move_cost = max_energy - 1`.
   - Else, `energy_after_move_cost = current_energy - 1`.

2. Check move validity based on `energy_after_move_cost`:
   - If `energy_after_move_cost < 0`, this move is impossible. Skip.

3. Determine `final_energy_at_next_cell`:
   - If `classroom[nr][nc] === 'R'`, `final_energy_at_next_cell = max_energy`.
   - Else, `final_energy_at_next_cell = energy_after_move_cost`.

This clarifies the energy logic. Let's re-state for states. The energy in the state `(r, c, current_energy, ...)` means the energy *at* `(r, c)`.
When we are at `(r, c)` with `current_energy`:
- If `classroom[r][c] === 'R'`, `current_energy` is effectively `max_energy` for the purpose of making the next move.
  - So, available energy to move = `max_energy`.
- Else, available energy to move = `current_energy`.

- If `available_energy_to_move - 1 < 0`, we cannot move. (This means if `available_energy_to_move` is 0, we are stuck unless `classroom[r][c]` is 'R', which makes `available_energy_to_move` `max_energy`).

- If we move to `(nr, nc)`, `next_energy_before_reset_check = available_energy_to_move - 1`.
- If `classroom[nr][nc] === 'R'`, then `next_energy = max_energy`.
- Else, `next_energy = next_energy_before_reset_check`.

Time Complexity:
The number of states is `m * n * (energy + 1) * 2^k`, where `m, n` are grid dimensions, `energy` is max energy, and `k` is the number of litter items.
`m, n <= 20`, `energy <= 50`, `k <= 10`.
Max states: `20 * 20 * 51 * 2^10 = 400 * 51 * 1024 approx 2 * 10^7`.
Each state transition involves checking 4 neighbors.
So, `O(m * n * energy * 2^k * 4)` which is `O(m * n * energy * 2^k)`.
With the given constraints, `20 * 20 * 51 * 1024 * 4` operations is roughly `8 * 10^7`, which is feasible within typical time limits (1-2 seconds).

Space Complexity:
The `dist` array stores the minimum moves for each state.
`O(m * n * energy * 2^k)` for the `dist` array and the queue.
`20 * 20 * 51 * 1024` integers. Each integer can be 4 bytes, so `~80 MB`, which is acceptable.
*/

/**
 * @param {string[]} classroom
 * @param {number} energy
 * @return {number}
 */
var minimumMoves = function(classroom, energy) {
    const m = classroom.length;
    const n = classroom[0].length;
    const max_energy = energy; // Store initial max energy

    let start_row, start_col;
    const litter_locations = []; // Stores {row, col, id} for each 'L'

    // Directions for BFS (up, down, left, right)
    const dr = [-1, 1, 0, 0];
    const dc = [0, 0, -1, 1];

    // Preprocessing: Find 'S' and 'L' locations
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (classroom[r][c] === 'S') {
                start_row = r;
                start_col = c;
            } else if (classroom[r][c] === 'L') {
                litter_locations.push({ row: r, col: c, id: litter_locations.length });
            }
        }
    }

    const num_litter = litter_locations.length;
    const all_litter_collected_mask = (1 << num_litter) - 1; // Target mask when all litter is collected

    // dist[row][col][current_energy][collected_litter_mask] = min_moves
    // Initialize with Infinity
    const dist = Array(m).fill(0).map(() =>
        Array(n).fill(0).map(() =>
            Array(max_energy + 1).fill(0).map(() =>
                Array(1 << num_litter).fill(Infinity)
            )
        )
    );

    // BFS queue: [row, col, current_energy, collected_litter_mask, moves]
    const queue = [];

    // Initial state
    dist[start_row][start_col][max_energy][0] = 0;
    queue.push([start_row, start_col, max_energy, 0, 0]);

    let head = 0;
    while (head < queue.length) {
        const [r, c, current_energy, collected_mask, moves] = queue[head++];

        // If all litter is collected, we found the minimum moves
        if (collected_mask === all_litter_collected_mask) {
            return moves;
        }

        // Explore neighbors
        for (let i = 0; i < 4; i++) {
            const nr = r + dr[i];
            const nc = c + dc[i];

            // Check boundary conditions
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
                continue;
            }

            // Check for obstacles
            if (classroom[nr][nc] === 'X') {
                continue;
            }

            let energy_for_move = current_energy;
            // If current cell is 'R', energy is reset to max_energy before moving
            if (classroom[r][c] === 'R') {
                energy_for_move = max_energy;
            }

            // Check if student has enough energy to make the move
            if (energy_for_move - 1 < 0) {
                continue; // Cannot move if energy becomes negative
            }

            let next_energy = energy_for_move - 1; // Energy after moving
            let next_collected_mask = collected_mask;

            // If next cell is 'R', energy is reset to max_energy
            if (classroom[nr][nc] === 'R') {
                next_energy = max_energy;
            }

            // If next cell contains litter 'L', collect it
            for (const litter of litter_locations) {
                if (litter.row === nr && litter.col === nc) {
                    next_collected_mask |= (1 << litter.id);
                    break;
                }
            }

            // If this path is shorter than previously found paths to this state
            if (moves + 1 < dist[nr][nc][next_energy][next_collected_mask]) {
                dist[nr][nc][next_energy][next_collected_mask] = moves + 1;
                queue.push([nr, nc, next_energy, next_collected_mask, moves + 1]);
            }
        }
    }

    // If queue is empty and target mask not reached, it's impossible
    return -1;
};