// Problem: Check if There is a Valid Path in a Grid
// Link: https://leetcode.com/problems/check-if-there-is-a-valid-path-in-a-grid/
//
// Approach:
// We can solve this problem using either Breadth-First Search (BFS) or Depth-First Search (DFS).
// The core idea is to start from the top-left cell (0, 0) and explore possible paths by following the street connections.
// We need to keep track of visited cells to avoid infinite loops.
// For each cell, we determine its possible outgoing connections based on its street type and the connections of adjacent cells.
// If we reach the bottom-right cell (m-1, n-1), we have found a valid path.
//
// Let's define the connections for each street type:
// 1: Left <-> Right
// 2: Up <-> Down
// 3: Left <-> Down
// 4: Right <-> Down
// 5: Left <-> Up
// 6: Right <-> Up
//
// We can represent the possible moves from a cell (r, c) based on its `grid[r][c]` value.
// For a given cell (r, c) and its street type `grid[r][c]`, we need to check if it can connect to its neighbors.
// For example, if `grid[r][c]` is 1 (Left <-> Right), it can connect to the cell to its left if the cell to its left can connect back to its right.
//
// We'll use BFS for this implementation.
//
// Time Complexity: O(m * n)
// We visit each cell at most once. For each cell, we perform a constant number of operations to check its neighbors.
//
// Space Complexity: O(m * n)
// In the worst case, the queue for BFS can store all cells in the grid. The visited set can also store all cells.
//

/**
 * @param {number[][]} grid
 * @return {boolean}
 */
var hasValidPath = function(grid) {
    const m = grid.length;
    const n = grid[0].length;

    // Define the possible connections for each street type.
    // `dirs[street_type]` maps to an array of possible directions it can connect to.
    // For example, if street_type is 1 (Left <-> Right), it can connect to the left (col - 1) and right (col + 1).
    // We'll use a mapping where the key is the street type and the value is an array of arrays.
    // Each inner array represents a possible connection: [dr, dc, required_neighbor_street_type_for_connection]
    // This mapping is a bit tricky, let's rethink the connection logic.

    // Let's define the directions a street at (r, c) can connect to.
    // We need to know which *outgoing* directions a street allows, and then check if the *neighbor* allows connection back.
    // Example: If `grid[r][c]` is 1 (Left <-> Right), it can go LEFT to (r, c-1) and RIGHT to (r, c+1).
    // To go LEFT from (r, c), the cell (r, c-1) must be able to connect to its RIGHT.
    // To go RIGHT from (r, c), the cell (r, c+1) must be able to connect to its LEFT.

    // Let's map street type to possible connections and their corresponding required neighbor connections.
    // Structure: `street_type -> [[dr, dc, neighbor_street_type_that_connects_back]]`
    //
    // Street Type:
    // 1: Left <-> Right
    //    - Connect Left: Needs neighbor at (r, c-1) to connect to its Right.
    //    - Connect Right: Needs neighbor at (r, c+1) to connect to its Left.
    // 2: Up <-> Down
    //    - Connect Up: Needs neighbor at (r-1, c) to connect to its Down.
    //    - Connect Down: Needs neighbor at (r+1, c) to connect to its Up.
    // 3: Left <-> Down
    //    - Connect Left: Needs neighbor at (r, c-1) to connect to its Right.
    //    - Connect Down: Needs neighbor at (r+1, c) to connect to its Up.
    // 4: Right <-> Down
    //    - Connect Right: Needs neighbor at (r, c+1) to connect to its Left.
    //    - Connect Down: Needs neighbor at (r+1, c) to connect to its Up.
    // 5: Left <-> Up
    //    - Connect Left: Needs neighbor at (r, c-1) to connect to its Right.
    //    - Connect Up: Needs neighbor at (r-1, c) to connect to its Down.
    // 6: Right <-> Up
    //    - Connect Right: Needs neighbor at (r, c+1) to connect to its Left.
    //    - Connect Up: Needs neighbor at (r-1, c) to connect to its Down.

    // Let's simplify this: what are the *outgoing* directions from cell (r, c) and what is the *required incoming* direction from the neighbor?
    // `street_connections[street_type]` = `[[dr, dc, required_neighbor_dir_index]]`
    // `required_neighbor_dir_index`:
    // 0: Left, 1: Right, 2: Up, 3: Down
    //
    // For street type 1 (Left <-> Right):
    // - Can go Left (-1 in col): Requires neighbor at (r, c-1) to be able to connect to its Right.
    // - Can go Right (+1 in col): Requires neighbor at (r, c+1) to be able to connect to its Left.
    //
    // Let's use a consistent representation for directions:
    // 0: Left (-1, 0)
    // 1: Right (1, 0)
    // 2: Up (0, -1)
    // 3: Down (0, 1)

    // `connections[street_type]` = `[[dr, dc, neighbor_connects_from_direction]]`
    // `neighbor_connects_from_direction` is the direction *from the neighbor's perspective* that connects to *our* cell.
    //
    // Street type 1 (1): Left <-> Right
    //   - To go Left (dr=0, dc=-1): Neighbor is at (r, c-1). Neighbor needs to connect to its Right (index 1).
    //   - To go Right (dr=0, dc=1): Neighbor is at (r, c+1). Neighbor needs to connect to its Left (index 0).
    //
    // Street type 2 (2): Up <-> Down
    //   - To go Up (dr=-1, dc=0): Neighbor is at (r-1, c). Neighbor needs to connect to its Down (index 3).
    //   - To go Down (dr=1, dc=0): Neighbor is at (r+1, c). Neighbor needs to connect to its Up (index 2).
    //
    // Street type 3 (3): Left <-> Down
    //   - To go Left (dr=0, dc=-1): Neighbor is at (r, c-1). Neighbor needs to connect to its Right (index 1).
    //   - To go Down (dr=1, dc=0): Neighbor is at (r+1, c). Neighbor needs to connect to its Up (index 2).
    //
    // Street type 4 (4): Right <-> Down
    //   - To go Right (dr=0, dc=1): Neighbor is at (r, c+1). Neighbor needs to connect to its Left (index 0).
    //   - To go Down (dr=1, dc=0): Neighbor is at (r+1, c). Neighbor needs to connect to its Up (index 2).
    //
    // Street type 5 (5): Left <-> Up
    //   - To go Left (dr=0, dc=-1): Neighbor is at (r, c-1). Neighbor needs to connect to its Right (index 1).
    //   - To go Up (dr=-1, dc=0): Neighbor is at (r-1, c). Neighbor needs to connect to its Down (index 3).
    //
    // Street type 6 (6): Right <-> Up
    //   - To go Right (dr=0, dc=1): Neighbor is at (r, c+1). Neighbor needs to connect to its Left (index 0).
    //   - To go Up (dr=-1, dc=0): Neighbor is at (r-1, c). Neighbor needs to connect to its Down (index 3).

    // `connections[street_type]` will be an array of objects: `{ dr, dc, required_neighbor_dir_idx }`
    const connections = {
        1: [{ dr: 0, dc: -1, required_neighbor_dir_idx: 1 }, { dr: 0, dc: 1, required_neighbor_dir_idx: 0 }], // Left <-> Right
        2: [{ dr: -1, dc: 0, required_neighbor_dir_idx: 3 }, { dr: 1, dc: 0, required_neighbor_dir_idx: 2 }], // Up <-> Down
        3: [{ dr: 0, dc: -1, required_neighbor_dir_idx: 1 }, { dr: 1, dc: 0, required_neighbor_dir_idx: 2 }], // Left <-> Down
        4: [{ dr: 0, dc: 1, required_neighbor_dir_idx: 0 }, { dr: 1, dc: 0, required_neighbor_dir_idx: 2 }], // Right <-> Down
        5: [{ dr: 0, dc: -1, required_neighbor_dir_idx: 1 }, { dr: -1, dc: 0, required_neighbor_dir_idx: 3 }], // Left <-> Up
        6: [{ dr: 0, dc: 1, required_neighbor_dir_idx: 0 }, { dr: -1, dc: 0, required_neighbor_dir_idx: 3 }]  // Right <-> Up
    };

    // Map direction indices to actual deltas for neighbor lookup.
    // This is for when we are checking if a neighbor connects back.
    // For example, if we are moving Left from (r, c) to (r, c-1), and we need the neighbor at (r, c-1)
    // to connect to its Right. The neighbor's "Right" means moving +1 in column from *its* perspective.
    // This corresponds to `dr=0, dc=1` relative to the neighbor's position.
    // This is essentially the inverse direction of moving Left from (r,c).
    const dir_deltas = [
        { dr: 0, dc: -1 }, // 0: Left from current cell's perspective
        { dr: 0, dc: 1 },  // 1: Right from current cell's perspective
        { dr: -1, dc: 0 }, // 2: Up from current cell's perspective
        { dr: 1, dc: 0 }   // 3: Down from current cell's perspective
    ];

    // For the purpose of checking the neighbor's connection, we need to know which direction *from the neighbor* connects to our cell.
    // This is the inverse of the direction we are taking from our cell.
    // If we go Left (0, -1) from our cell, the neighbor is to our Left, and it needs to connect to its Right. The direction from neighbor is (0, 1).
    // If we go Right (0, 1) from our cell, the neighbor is to our Right, and it needs to connect to its Left. The direction from neighbor is (0, -1).
    // If we go Up (-1, 0) from our cell, the neighbor is Up, and it needs to connect to its Down. The direction from neighbor is (1, 0).
    // If we go Down (1, 0) from our cell, the neighbor is Down, and it needs to connect to its Up. The direction from neighbor is (-1, 0).

    // Let's map the `required_neighbor_dir_idx` to the actual delta for the neighbor.
    // `neighbor_connection_deltas[required_neighbor_dir_idx]` will give us `[neighbor_dr, neighbor_dc]`.
    const neighbor_connection_deltas = [
        { dr: 0, dc: 1 },  // 0: Neighbor connects Right (from its perspective)
        { dr: 0, dc: -1 }, // 1: Neighbor connects Left (from its perspective)
        { dr: 1, dc: 0 },  // 2: Neighbor connects Down (from its perspective)
        { dr: -1, dc: 0 }  // 3: Neighbor connects Up (from its perspective)
    ];

    // Queue for BFS. Stores [row, col].
    const queue = [[0, 0]];
    // Set to keep track of visited cells.
    const visited = new Set();
    visited.add(`0,0`); // Mark the start cell as visited.

    while (queue.length > 0) {
        const [r, c] = queue.shift();

        // If we reached the destination, return true.
        if (r === m - 1 && c === n - 1) {
            return true;
        }

        const current_street_type = grid[r][c];
        const possible_moves = connections[current_street_type];

        // Iterate through each possible move from the current cell.
        for (const move of possible_moves) {
            const { dr, dc, required_neighbor_dir_idx } = move;

            const nr = r + dr;
            const nc = c + dc;

            // Check if the neighbor cell is within grid boundaries.
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                const neighbor_key = `${nr},${nc}`;

                // If the neighbor hasn't been visited yet.
                if (!visited.has(neighbor_key)) {
                    // Get the street type of the neighbor cell.
                    const neighbor_street_type = grid[nr][nc];

                    // Determine the connections of the neighbor.
                    const neighbor_possible_moves = connections[neighbor_street_type];

                    // Check if the neighbor allows a connection back to our current cell.
                    // We need to find a move from the neighbor where its outgoing direction matches
                    // what we require from it, based on `required_neighbor_dir_idx`.
                    let can_connect_back = false;
                    for (const neighbor_move of neighbor_possible_moves) {
                        // The `neighbor_move` tells us how the neighbor can connect OUTWARD.
                        // We need to check if one of its outgoing connections matches our required incoming connection.
                        // The `required_neighbor_dir_idx` tells us which direction *from the neighbor's perspective* should connect to us.
                        // E.g., if `required_neighbor_dir_idx` is 1 (neighbor connects Left), we are looking for a `neighbor_move`
                        // where `neighbor_move.dr` and `neighbor_move.dc` correspond to the neighbor moving Left.
                        // Let's re-verify the logic here.
                        //
                        // The `required_neighbor_dir_idx` in `move` for the current cell `(r, c)` indicates the direction *from the neighbor's perspective* that connects back to `(r, c)`.
                        // For example, if current cell `(r, c)` has type 1 (Left<->Right) and it's trying to move LEFT (dr=0, dc=-1),
                        // the neighbor is at `(r, c-1)`. From the neighbor's perspective, it needs to connect RIGHT to `(r, c)`. So `required_neighbor_dir_idx` is 1.
                        //
                        // So, we look at the `neighbor_street_type` and check if it has a connection
                        // that matches the `required_neighbor_dir_idx`.
                        // The `neighbor_move.dr` and `neighbor_move.dc` of the neighbor's street type should correspond to the inverse of the direction we are coming from.
                        //
                        // Let's simplify. We are at (r, c). We consider moving to (nr, nc).
                        // The `move` from `connections[grid[r][c]]` describes `(dr, dc)`.
                        // The neighbor is at `(nr, nc)`. The `required_neighbor_dir_idx` tells us what direction the neighbor must connect *from*.
                        // So, if `required_neighbor_dir_idx` is `k`, we are checking if `connections[grid[nr][nc]]` contains a move
                        // where the *neighbor's outgoing direction* is the inverse of our *current move direction*.
                        //
                        // Example:
                        // Current cell (0,0), street type 1. Try to move Left (dr=0, dc=-1). Neighbor at (0, -1) - invalid.
                        // Current cell (0,0), street type 1. Try to move Right (dr=0, dc=1). Neighbor at (0, 1).
                        // `move` = `{ dr: 0, dc: 1, required_neighbor_dir_idx: 0 }` (neighbor needs to connect Left)
                        // Neighbor at (0, 1) has street type `grid[0][1]`. Let's say it's 1 (Left<->Right).
                        // `connections[1]` = `[{ dr: 0, dc: -1, required_neighbor_dir_idx: 1 }, { dr: 0, dc: 1, required_neighbor_dir_idx: 0 }]`
                        // We are looking for a neighbor move that connects to our cell `(0,0)`.
                        // This means the neighbor at `(0,1)` should be able to connect to its Left.
                        // The `required_neighbor_dir_idx` for our move was 0, meaning neighbor connects *from* Left.
                        // So, we check if `connections[neighbor_street_type]` has a move whose `dr, dc` represent the neighbor connecting from the direction specified by `required_neighbor_dir_idx`.
                        //
                        // The `neighbor_move.dr, neighbor_move.dc` tells us where the neighbor connects TO.
                        // We need the neighbor to connect FROM a specific direction *back to us*.
                        // This means the neighbor's *outgoing* direction should be the inverse of our *incoming* direction from the neighbor.
                        //
                        // Let's redefine `required_neighbor_dir_idx` to be the direction from the neighbor that connects to our cell.
                        //
                        // Street Type 1 (1): Left <-> Right
                        //   - Current moves Left (0, -1). Neighbor is at (r, c-1). Neighbor needs to connect to (r, c). This is from neighbor's Right. So, required neighbor connection is Right (index 1).
                        //   - Current moves Right (0, 1). Neighbor is at (r, c+1). Neighbor needs to connect to (r, c). This is from neighbor's Left. So, required neighbor connection is Left (index 0).
                        //
                        // This `required_neighbor_dir_idx` seems to be the direction *from the neighbor's perspective* that connects to our cell.
                        //
                        // Let's simplify the check:
                        // We are at (r, c), moving to (nr, nc) with move `{dr, dc, required_neighbor_dir_idx}`.
                        // Neighbor is at (nr, nc). Street type is `neighbor_street_type`.
                        // We need to check if `neighbor_street_type` has a street segment that connects to our cell `(r, c)`.
                        // The `required_neighbor_dir_idx` tells us what direction *from the neighbor* should connect to us.
                        //
                        // Let's test the current mapping:
                        // `connections[street_type]` = `[{dr, dc, required_neighbor_dir_idx}]`
                        //
                        // Example:
                        // `grid = [[2,4,3],[6,5,2]]`
                        // Start at (0,0), street=2 (Up<->Down).
                        // Possible moves for 2:
                        // 1. dr=-1, dc=0, required_neighbor_dir_idx=3 (neighbor needs to connect Down). This move is UP.
                        // 2. dr=1, dc=0, required_neighbor_dir_idx=2 (neighbor needs to connect Up). This move is DOWN.
                        //
                        // From (0,0), only DOWN is possible to (1,0).
                        // Let's try to move DOWN: dr=1, dc=0. Neighbor is at (1,0).
                        // `move` = `{ dr: 1, dc: 0, required_neighbor_dir_idx: 2 }` (neighbor at (1,0) needs to connect UP)
                        // `nr = 0 + 1 = 1`, `nc = 0 + 0 = 0`. Neighbor at (1,0).
                        // `visited` does not have "1,0".
                        // `neighbor_street_type` = `grid[1][0]` = 6 (Right<->Up).
                        // `connections[6]` = `[{ dr: 0, dc: 1, required_neighbor_dir_idx: 0 }, { dr: -1, dc: 0, required_neighbor_dir_idx: 3 }]`
                        //
                        // We need to check if `connections[6]` has a move that connects UP to (0,0).
                        // The `required_neighbor_dir_idx` from our current move was 2 (neighbor connects UP).
                        // So we need to find if `connections[6]` has a move where the neighbor's connection is UP.
                        // The `neighbor_move.dr, neighbor_move.dc` describes where the neighbor connects TO.
                        // So if the neighbor connects UP, its `dr` would be -1, `dc` would be 0.
                        // Let's check `connections[6]`:
                        // 1. `{ dr: 0, dc: 1, required_neighbor_dir_idx: 0 }` -> neighbor connects Right.
                        // 2. `{ dr: -1, dc: 0, required_neighbor_dir_idx: 3 }` -> neighbor connects Up.
                        //
                        // The `required_neighbor_dir_idx` in our `move` for `grid[0][0]` was 2.
                        // This means the neighbor at (1,0) needs to connect UP.
                        // Does `connections[6]` have a way for the neighbor at (1,0) to connect UP?
                        // Yes, the second entry in `connections[6]` is `{ dr: -1, dc: 0, required_neighbor_dir_idx: 3 }`.
                        // BUT, this entry describes the neighbor connecting UP.
                        // The `required_neighbor_dir_idx` in our original move was 2.
                        // This means we are checking if the neighbor connects FROM the direction specified by index 2 of `dir_deltas`.
                        // `dir_deltas[2]` = `{ dr: -1, dc: 0 }` (Up).
                        // So we are looking for a move from the neighbor that allows it to connect to our cell, which is UP from the neighbor's perspective.
                        //
                        // Let's check the `neighbor_move.dr` and `neighbor_move.dc` against the actual neighbor connection.
                        // If `move` is `{dr: 1, dc: 0, required_neighbor_dir_idx: 2}`, it means we are moving DOWN.
                        // The neighbor is at `(r+1, c)`. It needs to connect UP.
                        // So, from `(r+1, c)`, we need to be able to move UP to `(r, c)`.
                        // This means the neighbor must have a connection that allows it to go UP.
                        // The `neighbor_street_type` must have a street that connects UP.
                        //
                        // Let's re-examine `connections[street_type]` structure:
                        // `connections[street_type]` = `[ {dr, dc, required_connection_from_neighbor_dir_idx} ]`
                        //
                        // Example:
                        // `grid[r][c] = 1` (Left <-> Right)
                        // Try to move Left: `dr=0, dc=-1`. Neighbor at `(r, c-1)`.
                        // From neighbor `(r, c-1)`'s perspective, it needs to connect to `(r, c)`. This is from its RIGHT.
                        // So, `required_connection_from_neighbor_dir_idx = 1` (Right).
                        // `connections[1]` entry: `{ dr: 0, dc: -1, required_connection_from_neighbor_dir_idx: 1 }`
                        //
                        // When we are at cell `(r, c)` and consider moving to `(nr, nc)` with a `move` from `connections[grid[r][c]]`.
                        // Let this `move` be `{ dr: current_dr, dc: current_dc, required_neighbor_dir_idx: RNDI }`.
                        // The neighbor is at `(nr, nc)`. Its street type is `grid[nr][nc]`.
                        // We need to check if `grid[nr][nc]` can connect back to `(r, c)`.
                        // The `RNDI` tells us what direction *from the neighbor* should connect to our cell.
                        //
                        // Let's get the actual delta for that direction from the neighbor's perspective.
                        // `const [neighbor_req_dr, neighbor_req_dc] = [neighbor_connection_deltas[RNDI].dr, neighbor_connection_deltas[RNDI].dc];`
                        //
                        // Now, we look at `connections[grid[nr][nc]]` and see if any of its entries match this `neighbor_req_dr, neighbor_req_dc`.
                        // This is still confusing.
                        //
                        // Let's simplify the `connections` definition.
                        // `connections[street_type]` = `[ {dr, dc, connects_to_neighbor_dr, connects_to_neighbor_dc} ]`
                        // This might be too verbose.
                        //
                        // Let's re-think the condition for `can_connect_back`.
                        // We are at `(r, c)`, current street `S_curr = grid[r][c]`.
                        // We are considering a move to `(nr, nc)`, neighbor street `S_neigh = grid[nr][nc]`.
                        // The `move` from `connections[S_curr]` has `(dr, dc)`.
                        // The neighbor at `(nr, nc)` must be able to receive a connection from `(r, c)`.
                        // This means the street `S_neigh` must have a connection that goes TO `(r, c)`.
                        // The direction from `(nr, nc)` to `(r, c)` is `(-dr, -dc)`.
                        // So, we need to check if `S_neigh` has a connection whose direction is `(-dr, -dc)`.
                        //
                        // Let's define `connections_map[street_type]` which maps `(dr, dc)` to the required connection from neighbor.
                        //
                        // `connections[street_type]` = `[ { dr, dc, neighbor_connects_from_idx } ]`
                        // `neighbor_connects_from_idx`:
                        // If current moves `dr, dc`:
                        //   - If `(dr, dc) = (0, -1)` (Left): Neighbor is at `(r, c-1)`. Neighbor needs to connect Right. `neighbor_connects_from_idx = 1`.
                        //   - If `(dr, dc) = (0, 1)` (Right): Neighbor is at `(r, c+1)`. Neighbor needs to connect Left. `neighbor_connects_from_idx = 0`.
                        //   - If `(dr, dc) = (-1, 0)` (Up): Neighbor is at `(r-1, c)`. Neighbor needs to connect Down. `neighbor_connects_from_idx = 3`.
                        //   - If `(dr, dc) = (1, 0)` (Down): Neighbor is at `(r+1, c)`. Neighbor needs to connect Up. `neighbor_connects_from_idx = 2`.
                        //
                        // This definition seems consistent.
                        //
                        // `neighbor_connection_deltas[idx]` maps `idx` to the actual `(dr, dc)` *from the neighbor's perspective*.
                        // `neighbor_connection_deltas[1]` = `{dr: 0, dc: -1}` (Neighbor connects Left)
                        // `neighbor_connection_deltas[0]` = `{dr: 0, dc: 1}`  (Neighbor connects Right)
                        // `neighbor_connection_deltas[3]` = `{dr: 1, dc: 0}`  (Neighbor connects Down)
                        // `neighbor_connection_deltas[2]` = `{dr: -1, dc: 0}` (Neighbor connects Up)
                        //
                        // This is the crucial part. The `required_neighbor_dir_idx` indicates which direction *from the neighbor* connects back to our cell.
                        // So, if `move.required_neighbor_dir_idx` is `K`, we are looking for a street type at `grid[nr][nc]`
                        // that has a connection such that the neighbor's *outgoing* direction is `neighbor_connection_deltas[K]`.
                        //
                        // Example:
                        // Current cell (0,0), street=2 (Up<->Down). Try moving DOWN.
                        // `move` = `{ dr: 1, dc: 0, required_neighbor_dir_idx: 2 }`.
                        // Neighbor at (1,0). `grid[1][0]` is 6 (Right<->Up).
                        // `RNDI = 2`. This means the neighbor at (1,0) must be able to connect UP.
                        // `neighbor_connection_deltas[2]` = `{dr: -1, dc: 0}`.
                        // So, we need to check if `connections[6]` has an entry whose `dr, dc` is `{-1, 0}`.
                        // `connections[6]` is `[{ dr: 0, dc: 1, ... }, { dr: -1, dc: 0, required_neighbor_dir_idx: 3 }]`
                        // Yes, the second entry has `dr: -1, dc: 0`. This confirms a valid connection.
                        //
                        // The `required_neighbor_dir_idx` within the `neighbor_move` itself is irrelevant for this check.
                        // We are checking if the *actual connection* from the neighbor (`neighbor_move.dr`, `neighbor_move.dc`) matches the required direction from the neighbor.

                        const required_connection_from_neighbor = neighbor_connection_deltas[required_neighbor_dir_idx];

                        // Check if any connection from the neighbor matches the required connection direction.
                        for (const neighbor_move_check of neighbor_possible_moves) {
                            if (neighbor_move_check.dr === required_connection_from_neighbor.dr &&
                                neighbor_move_check.dc === required_connection_from_neighbor.dc) {
                                can_connect_back = true;
                                break; // Found a valid connection back
                            }
                        }
                    }

                    if (can_connect_back) {
                        visited.add(neighbor_key);
                        queue.push([nr, nc]);
                    }
                }
            }
        }
    }

    // If the BFS completes without reaching the destination, return false.
    return false;
};
```