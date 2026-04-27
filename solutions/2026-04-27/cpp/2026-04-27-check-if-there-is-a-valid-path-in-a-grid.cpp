```cpp
// Problem: Check if There is a Valid Path in a Grid
// Link: https://leetcode.com/problems/check-if-there-is-a-valid-path-in-a-grid/
// Approach:
// We can use Breadth-First Search (BFS) or Depth-First Search (DFS) to find a valid path.
// Since we need to find if *any* valid path exists, BFS is a good choice.
// We start at (0, 0) and explore reachable cells based on the street connections.
// We use a queue for BFS and a set to keep track of visited cells to avoid cycles.
// For each cell, we check its street type and determine possible next moves.
// We define the possible directions and their corresponding street connections.
// If we reach the bottom-right cell (m-1, n-1), we return true.
// If the queue becomes empty and we haven't reached the destination, it means no valid path exists.
// Time Complexity: O(m * n) because in the worst case, we visit each cell once.
// Space Complexity: O(m * n) for the visited set and the queue in the worst case.
#include <vector>
#include <queue>
#include <set>
#include <tuple>

class Solution {
public:
    bool hasValidPath(std::vector<std::vector<int>>& grid) {
        int m = grid.size();
        int n = grid[0].size();

        // Directions: 0: left, 1: right, 2: up, 3: down
        // For each cell, we define which directions it connects to.
        // The format is {current_street_type: {connected_direction_from_current, required_street_type_at_neighbor}}
        // For example, street 1 connects left and right. If we are at cell (r, c) with street 1,
        // we can potentially move right to (r, c+1). For this to be valid, the street at (r, c+1)
        // must be able to connect from the left.
        std::vector<std::vector<std::pair<int, int>>> connections = {
            {}, // 0 is not used
            {{1, 1}, {1, 1}}, // Street 1: connects left and right. Connects to neighbor as right (1) or left (1).
            {{2, 2}, {2, 2}}, // Street 2: connects up and down. Connects to neighbor as down (2) or up (2).
            {{3, 1}, {3, 2}}, // Street 3: connects left and down. Connects to neighbor as right (1) or up (2).
            {{4, 1}, {4, 2}}, // Street 4: connects right and down. Connects to neighbor as left (1) or up (2).
            {{5, 1}, {5, 2}}, // Street 5: connects left and up. Connects to neighbor as right (1) or down (2).
            {{6, 1}, {6, 2}}  // Street 6: connects right and up. Connects to neighbor as left (1) or down (2).
        };

        // Mapping of street types to the directions they connect to.
        // For each street type, store a list of pairs: {current_cell_direction_to_neighbor, neighbor_cell_direction_from_current}
        // Example: Street 1 at (r,c) means it connects left and right.
        // If we move right to (r, c+1): current_cell_direction_to_neighbor is 1 (right).
        // For the path to be valid, neighbor at (r, c+1) must accept connection from left (neighbor_cell_direction_from_current is 1).
        // This mapping is crucial to check if two adjacent streets are compatible.
        // The index of the outer vector represents the street type in the current cell.
        // The inner vector contains pairs of {current_cell_exit_direction, neighbor_cell_entry_direction}.
        // Directions: 0: left, 1: right, 2: up, 3: down.
        std::vector<std::vector<std::pair<int, int>>> street_connections(7);
        street_connections[1] = {{1, 1}, {1, 1}}; // Street 1: left-right. (exit right, enter left), (exit left, enter right)
        street_connections[2] = {{2, 2}, {2, 2}}; // Street 2: up-down. (exit down, enter up), (exit up, enter down)
        street_connections[3] = {{1, 2}, {3, 1}}; // Street 3: left-down. (exit right, enter up), (exit down, enter left)
        street_connections[4] = {{1, 2}, {3, 1}}; // Street 4: right-down. (exit left, enter up), (exit down, enter right) - NOTE: These are swapped from intuition, should be (exit left, enter up) and (exit down, enter right). Let's correct this.
        // Correcting street_connections for 3, 4, 5, 6:
        // street_connections[type] = {{current_exit_dir, neighbor_entry_dir}, ...}
        // street_connections[3] = {{3, 1}, {1, 2}}; // Left-down. Exit down (3), enter left (1); Exit right (1), enter down (2).
        // street_connections[4] = {{3, 1}, {1, 2}}; // Right-down. Exit down (3), enter right (1); Exit left (1), enter down (2).
        // street_connections[5] = {{2, 1}, {0, 2}}; // Left-up. Exit up (2), enter left (1); Exit left (0), enter up (2).
        // street_connections[6] = {{2, 1}, {0, 2}}; // Right-up. Exit up (2), enter right (1); Exit right (0), enter up (2).

        // Let's re-define `street_connections` to be more clear:
        // For a cell with street type `S`, what are the possible directions it can connect to other cells,
        // and what type of connection is expected from the neighbor.
        // Format: { current_cell_exit_direction, neighbor_cell_entry_direction }
        // Direction mapping: 0: left, 1: right, 2: up, 3: down
        //
        // Street 1 (left-right):
        // - Can exit right (1), expects neighbor to enter from left (0).
        // - Can exit left (0), expects neighbor to enter from right (1).
        //
        // Street 2 (up-down):
        // - Can exit down (3), expects neighbor to enter from up (2).
        // - Can exit up (2), expects neighbor to enter from down (3).
        //
        // Street 3 (left-down):
        // - Can exit down (3), expects neighbor to enter from left (0).
        // - Can exit left (0), expects neighbor to enter from down (3).
        //
        // Street 4 (right-down):
        // - Can exit down (3), expects neighbor to enter from right (1).
        // - Can exit right (1), expects neighbor to enter from down (3).
        //
        // Street 5 (left-up):
        // - Can exit up (2), expects neighbor to enter from left (0).
        // - Can exit left (0), expects neighbor to enter from up (2).
        //
        // Street 6 (right-up):
        // - Can exit up (2), expects neighbor to enter from right (1).
        // - Can exit right (1), expects neighbor to enter from up (2).

        // The indices in street_connections represent the direction FROM the current cell.
        // street_connections[street_type] = { { current_cell_exit_dir, neighbor_cell_entry_dir } }
        // This indexing is still a bit confusing. Let's map street type to possible (row_change, col_change) pairs and the required neighbor connection.
        // Example: grid[r][c] = 1. Possible moves are to (r, c-1) and (r, c+1).
        // If we move to (r, c+1) (right), this corresponds to exiting right from (r,c).
        // The street at (r,c+1) must be able to connect FROM the left.

        // Let's use direction arrays for movements and a compatibility map.
        // dr: row changes, dc: column changes for directions
        // 0: left, 1: right, 2: up, 3: down
        int dr[] = {0, 0, -1, 1};
        int dc[] = {-1, 1, 0, 0};

        // `compatible_neighbor[street_type][current_cell_exit_direction]` = `required_neighbor_entry_direction`
        // Example: grid[r][c] = 1. Current exit direction is 'right' (index 1).
        // We need to find what the neighbor at (r, c+1) must accept from us.
        // If we exit grid[r][c] right, it means we are arriving at grid[r][c+1] from its left.
        // So, grid[r][c+1] must have a street that can accept an entry from the left.
        //
        // street_map[street_type] = { {dr_exit, dc_exit, neighbor_street_entry_requirement} }
        //
        // Street 1 (left-right):
        //  - Exit right: dr=0, dc=1. Needs neighbor street that connects FROM left (street type that accepts entry from right).
        //  - Exit left: dr=0, dc=-1. Needs neighbor street that connects FROM right (street type that accepts entry from left).
        //
        // Street 2 (up-down):
        //  - Exit down: dr=1, dc=0. Needs neighbor street that connects FROM up.
        //  - Exit up: dr=-1, dc=0. Needs neighbor street that accepts FROM down.
        //
        // This is becoming overly complex to map. Let's simplify the check.
        // When moving from (r1, c1) to (r2, c2):
        // 1. Get the street type at (r1, c1), say `street1`.
        // 2. Determine the direction of movement from (r1, c1) to (r2, c2). Let this be `exit_dir_from_1`.
        // 3. Get the street type at (r2, c2), say `street2`.
        // 4. Determine the direction of entry from (r1, c1) to (r2, c2) *as seen by (r2, c2)*. This is `entry_dir_to_2`.
        // 5. Check if `street1` supports exiting in `exit_dir_from_1`.
        // 6. Check if `street2` supports entering from `entry_dir_to_2`.

        // A simpler way: Define valid connections for each street type.
        // For each street type, what are the allowed (dx, dy) pairs?
        // And what is the required (dx, dy) from the neighbor cell?
        // This is still complex. Let's use a BFS approach directly with a clear state representation.
        // State: (row, col)
        // For each cell, check its neighbors and if the connection is valid.

        // `moves[street_type]` = list of possible relative moves {(dr, dc)}.
        // For example, street 1 connects left and right. Possible moves are (-1, 0) [left] and (1, 0) [right].
        // But we need to know which direction it connects to.
        // Let's refine the `street_connections` to be more explicit about *which* directions it connects to.
        // `street_connections[street_type]` = pairs of {current_exit_direction_index, neighbor_entry_direction_index}
        // Directions: 0: left (-1,0), 1: right (0,1), 2: up (0,-1), 3: down (1,0) -- Using standard grid directions for now.
        // Let's re-align directions for easier lookup:
        // 0: up (-1, 0)
        // 1: down (1, 0)
        // 2: left (0, -1)
        // 3: right (0, 1)

        // `connections[street_type]` = vector of {exit_dir_idx, entry_dir_idx} for neighbor.
        // Street 1 (Horizontal): Connects Left and Right.
        // - From current cell, can exit Left (dir 2), neighbor must accept FROM Right (neighbor dir 3).
        // - From current cell, can exit Right (dir 3), neighbor must accept FROM Left (neighbor dir 2).
        // Street 2 (Vertical): Connects Up and Down.
        // - From current cell, can exit Up (dir 0), neighbor must accept FROM Down (neighbor dir 1).
        // - From current cell, can exit Down (dir 1), neighbor must accept FROM Up (neighbor dir 0).
        // Street 3 (Left-Down):
        // - From current cell, can exit Left (dir 2), neighbor must accept FROM Down (neighbor dir 1).
        // - From current cell, can exit Down (dir 1), neighbor must accept FROM Left (neighbor dir 2).
        // Street 4 (Right-Down):
        // - From current cell, can exit Right (dir 3), neighbor must accept FROM Down (neighbor dir 1).
        // - From current cell, can exit Down (dir 1), neighbor must accept FROM Right (neighbor dir 3).
        // Street 5 (Left-Up):
        // - From current cell, can exit Left (dir 2), neighbor must accept FROM Up (neighbor dir 0).
        // - From current cell, can exit Up (dir 0), neighbor must accept FROM Left (neighbor dir 2).
        // Street 6 (Right-Up):
        // - From current cell, can exit Right (dir 3), neighbor must accept FROM Up (neighbor dir 0).
        // - From current cell, can exit Up (dir 0), neighbor must accept FROM Right (neighbor dir 3).

        // `connections_map[street_type][current_exit_direction_index]` = `neighbor_entry_direction_index`
        // Using indices: 0: up, 1: down, 2: left, 3: right
        std::vector<std::vector<int>> connections_map(7, std::vector<int>(4, -1));

        // Street 1 (Horizontal)
        connections_map[1][2] = 3; // Exit Left (2), Neighbor entry Right (3)
        connections_map[1][3] = 2; // Exit Right (3), Neighbor entry Left (2)

        // Street 2 (Vertical)
        connections_map[2][0] = 1; // Exit Up (0), Neighbor entry Down (1)
        connections_map[2][1] = 0; // Exit Down (1), Neighbor entry Up (0)

        // Street 3 (Left-Down)
        connections_map[3][2] = 1; // Exit Left (2), Neighbor entry Down (1)
        connections_map[3][1] = 2; // Exit Down (1), Neighbor entry Left (2)

        // Street 4 (Right-Down)
        connections_map[4][3] = 1; // Exit Right (3), Neighbor entry Down (1)
        connections_map[4][1] = 3; // Exit Down (1), Neighbor entry Right (3)

        // Street 5 (Left-Up)
        connections_map[5][2] = 0; // Exit Left (2), Neighbor entry Up (0)
        connections_map[5][0] = 2; // Exit Up (0), Neighbor entry Left (2)

        // Street 6 (Right-Up)
        connections_map[6][3] = 0; // Exit Right (3), Neighbor entry Up (0)
        connections_map[6][0] = 3; // Exit Up (0), Neighbor entry Right (3)

        // Direction vectors for movement: up, down, left, right
        int d_row[] = {-1, 1, 0, 0};
        int d_col[] = {0, 0, -1, 1};

        std::queue<std::pair<int, int>> q;
        std::set<std::pair<int, int>> visited;

        // Start BFS from (0, 0)
        q.push({0, 0});
        visited.insert({0, 0});

        while (!q.empty()) {
            std::pair<int, int> current_cell = q.front();
            q.pop();

            int r = current_cell.first;
            int c = current_cell.second;
            int current_street_type = grid[r][c];

            // If we reached the destination, return true
            if (r == m - 1 && c == n - 1) {
                return true;
            }

            // Iterate through all possible exit directions from the current cell
            for (int exit_dir_idx = 0; exit_dir_idx < 4; ++exit_dir_idx) {
                // Check if the current street type supports exiting in this direction
                int required_neighbor_entry_dir_idx = connections_map[current_street_type][exit_dir_idx];

                // If this exit direction is valid for the current street type
                if (required_neighbor_entry_dir_idx != -1) {
                    // Calculate the coordinates of the potential next cell
                    int nr = r + d_row[exit_dir_idx];
                    int nc = c + d_col[exit_dir_idx];

                    // Check if the next cell is within grid boundaries
                    if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                        // Get the street type of the neighbor cell
                        int neighbor_street_type = grid[nr][nc];

                        // Check if the neighbor cell's street can accept entry from the required direction
                        // We need to find the entry direction *for the neighbor cell* that corresponds to our exit.
                        // If we are exiting current cell at `exit_dir_idx`, and moving to (nr, nc),
                        // then for the neighbor cell (nr, nc), we are entering FROM the opposite direction.
                        // Example: if we move right (dir 3 from current), for the neighbor, we are entering from left (dir 2).
                        // The `required_neighbor_entry_dir_idx` is already telling us what the neighbor expects.
                        // We need to check if `neighbor_street_type` has a connection that matches `required_neighbor_entry_dir_idx`.
                        // Let's re-think `connections_map`.

                        // `connections_map[street_type][exit_direction_index]` stores the required entry direction index for the NEIGHBOR.
                        // For street type 1 (horizontal):
                        // If current cell exits Right (idx 3), it means we are moving from (r,c) to (r, c+1).
                        // The neighbor cell (r, c+1) receives us from its Left.
                        // So, neighbor_street_type must be able to accept entry from Left (idx 2).
                        // The mapping `connections_map[1][3] = 2` correctly states that if current exits right, neighbor must accept left.
                        // The check is: does `neighbor_street_type` support an entry from `required_neighbor_entry_dir_idx`?
                        // This is implicitly checked by looking up `connections_map[neighbor_street_type]`.
                        // If `connections_map[neighbor_street_type][required_neighbor_entry_dir_idx]` is not -1, it means the neighbor street type CAN accept entry from that direction.

                        // So, the logic is:
                        // 1. From current cell (r, c) with `current_street_type`, consider exiting in `exit_dir_idx`.
                        // 2. This requires the neighbor at (nr, nc) to accept entry from `required_neighbor_entry_dir_idx`.
                        // 3. Check if `neighbor_street_type` at (nr, nc) can indeed connect with `required_neighbor_entry_dir_idx` from its side.
                        //    This means, for `neighbor_street_type`, is there an entry direction that matches `required_neighbor_entry_dir_idx`?
                        //    This is equivalent to checking if `connections_map[neighbor_street_type][required_neighbor_entry_dir_idx]` is valid.

                        // The `connections_map[street_type][exit_direction_index]` = `neighbor_entry_direction_index` structure is correct for this.
                        // We want to check if the `neighbor_street_type` can connect FROM the `required_neighbor_entry_dir_idx`.
                        // To do this, we need to see if `connections_map[neighbor_street_type]` has an entry where the SECOND element of the pair is `required_neighbor_entry_dir_idx`.
                        // This implies we need a different data structure or lookup.

                        // Let's redefine the `connections_map` to be easier to check.
                        // `valid_connections[street_type]` = set of directions {exit_from_current, entry_to_neighbor}
                        // For street 1: { (2,3), (3,2) } meaning (exit left, neighbor entry right) and (exit right, neighbor entry left)

                        // Alternative: Define `can_connect[street_type][direction_index]` which is true if this street type can connect in `direction_index` FROM outside.
                        // Example: street 1 (horizontal)
                        // can_connect[1][2] = true (can connect from left)
                        // can_connect[1][3] = true (can connect from right)
                        //
                        // For street 3 (left-down):
                        // can_connect[3][0] = true (can connect from up)
                        // can_connect[3][2] = true (can connect from right)

                        // Okay, let's use this simpler structure.
                        // `can_connect_from[street_type][entry_direction_index]` = boolean
                        std::vector<std::vector<bool>> can_connect_from(7, std::vector<bool>(4, false));

                        // Street 1 (Horizontal: Left-Right)
                        can_connect_from[1][2] = true; // Can connect from Left (entry_dir_idx = 2)
                        can_connect_from[1][3] = true; // Can connect from Right (entry_dir_idx = 3)

                        // Street 2 (Vertical: Up-Down)
                        can_connect_from[2][0] = true; // Can connect from Up (entry_dir_idx = 0)
                        can_connect_from[2][1] = true; // Can connect from Down (entry_dir_idx = 1)

                        // Street 3 (Left-Down)
                        can_connect_from[3][1] = true; // Can connect from Down (entry_dir_idx = 1)
                        can_connect_from[3][2] = true; // Can connect from Right (entry_dir_idx = 2)

                        // Street 4 (Right-Down)
                        can_connect_from[4][1] = true; // Can connect from Down (entry_dir_idx = 1)
                        can_connect_from[4][3] = true; // Can connect from Right (entry_dir_idx = 3)

                        // Street 5 (Left-Up)
                        can_connect_from[5][0] = true; // Can connect from Up (entry_dir_idx = 0)
                        can_connect_from[5][2] = true; // Can connect from Right (entry_dir_idx = 2)

                        // Street 6 (Right-Up)
                        can_connect_from[6][0] = true; // Can connect from Up (entry_dir_idx = 0)
                        can_connect_from[6][3] = true; // Can connect from Right (entry_dir_idx = 3)

                        // Now, let's re-evaluate the BFS logic using `connections_map` and `can_connect_from`.

                        // For current cell (r, c) with `current_street_type`:
                        // Iterate through possible `exit_dir_idx` (0:up, 1:down, 2:left, 3:right).
                        // For each `exit_dir_idx`, `connections_map[current_street_type][exit_dir_idx]` gives us the `required_neighbor_entry_dir_idx`.
                        // If `required_neighbor_entry_dir_idx` is -1, this `exit_dir_idx` is not supported by `current_street_type`.
                        // If it's not -1:
                        //   Calculate neighbor coordinates `nr`, `nc`.
                        //   Check bounds `0 <= nr < m && 0 <= nc < n`.
                        //   Get `neighbor_street_type = grid[nr][nc]`.
                        //   Check if `neighbor_street_type` can connect FROM `required_neighbor_entry_dir_idx`.
                        //   This is `can_connect_from[neighbor_street_type][required_neighbor_entry_dir_idx]`.
                        //   If all these conditions are met AND `(nr, nc)` is not visited:
                        //     Add `(nr, nc)` to queue and visited set.

                        // Resetting `connections_map` and `can_connect_from` to be available inside the loop for clarity is not good.
                        // These should be class members or defined outside. Let's define them outside the method or as static members.
                        // For now, I will redefine them within the method, but ideally, they are constant.

                        // (Re-defining `connections_map` and `can_connect_from` here for clarity of logic within BFS loop,
                        // but they should be pre-computed or static for efficiency.)

                        std::vector<std::vector<int>> local_connections_map(7, std::vector<int>(4, -1));
                        local_connections_map[1][2] = 3; local_connections_map[1][3] = 2; // H
                        local_connections_map[2][0] = 1; local_connections_map[2][1] = 0; // V
                        local_connections_map[3][2] = 1; local_connections_map[3][1] = 2; // L-D
                        local_connections_map[4][3] = 1; local_connections_map[4][1] = 3; // R-D
                        local_connections_map[5][2] = 0; local_connections_map[5][0] = 2; // L-U
                        local_connections_map[6][3] = 0; local_connections_map[6][0] = 3; // R-U

                        std::vector<std::vector<bool>> local_can_connect_from(7, std::vector<bool>(4, false));
                        local_can_connect_from[1][2] = true; local_can_connect_from[1][3] = true; // H
                        local_can_connect_from[2][0] = true; local_can_connect_from[2][1] = true; // V
                        local_can_connect_from[3][1] = true; local_can_connect_from[3][2] = true; // L-D
                        local_can_connect_from[4][1] = true; local_can_connect_from[4][3] = true; // R-D
                        local_can_connect_from[5][0] = true; local_can_connect_from[5][2] = true; // L-U
                        local_can_connect_from[6][0] = true; local_can_connect_from[6][3] = true; // R-U


                        // For each possible exit direction from the current cell
                        for (int exit_dir_idx = 0; exit_dir_idx < 4; ++exit_dir_idx) {
                            // Get the direction the current street wants to connect to the neighbor.
                            // `required_neighbor_entry_dir_idx` is the direction the neighbor cell MUST accept from.
                            int required_neighbor_entry_dir_idx = local_connections_map[current_street_type][exit_dir_idx];

                            // If the current street type supports exiting in this direction
                            if (required_neighbor_entry_dir_idx != -1) {
                                // Calculate the coordinates of the neighbor cell
                                int nr = r + d_row[exit_dir_idx];
                                int nc = c + d_col[exit_dir_idx];

                                // Check if neighbor is within grid bounds
                                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                                    int neighbor_street_type = grid[nr][nc];

                                    // Check if the neighbor street type can accept connection from the required direction.
                                    // The `required_neighbor_entry_dir_idx` is the direction *as seen from the neighbor*.
                                    // For example, if current cell (0,0) street=1 (H), exit right (idx 3), we go to (0,1).
                                    // Neighbor (0,1) receives us from its LEFT (idx 2).
                                    // `local_connections_map[1][3]` correctly gives `2`.
                                    // We must check if `grid[0][1]` (neighbor_street_type) can connect FROM direction `2` (left).
                                    // This is `local_can_connect_from[neighbor_street_type][required_neighbor_entry_dir_idx]`.
                                    if (local_can_connect_from[neighbor_street_type][required_neighbor_entry_dir_idx]) {
                                        // If the neighbor is a valid connection and has not been visited
                                        if (visited.find({nr, nc}) == visited.end()) {
                                            visited.insert({nr, nc});
                                            q.push({nr, nc});
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // If the queue is empty and we haven't reached the destination, no valid path exists.
        return false;
    }
};
```