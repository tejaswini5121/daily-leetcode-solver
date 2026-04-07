// A robot simulation on a grid where movement is constrained by boundaries.
// The robot turns counterclockwise when hitting a boundary and retries the step.
// Problem Link: https://leetcode.com/problems/walking-robot-simulation-ii/
// Approach:
// We can simulate the robot's movement by keeping track of its current position (x, y)
// and its current direction. The directions can be represented by integers:
// 0: East, 1: North, 2: West, 3: South.
// When the robot receives a 'step' command, it iterates 'num' times. In each iteration,
// it attempts to move one step in its current direction.
// If the move is valid (within bounds), update the position.
// If the move is invalid (out of bounds), change direction 90 degrees counterclockwise
// (increment direction index modulo 4) and retry the step in the new direction.
// We need to handle the boundaries carefully for both x and y coordinates.
// For 'getPos' and 'getDir', we simply return the current state.
// To optimize, instead of simulating each step individually when 'step(num)' is called,
// we can pre-calculate the entire path of the robot. The robot moves along the perimeter
// of the grid. The total number of steps to complete one full cycle is
// 2 * (width - 1) + 2 * (height - 1).
// We can store the sequence of (position, direction) pairs for one full cycle.
// When 'step(num)' is called, we can calculate the effective number of steps by taking
// 'num' modulo the cycle length. Then, we can find the final position and direction
// from the pre-calculated path.
// Let's refine the pre-calculation approach:
// The robot starts at (0,0) facing East.
// The total perimeter length is (width - 1) + (height - 1) + (width - 1) + (height - 1) = 2 * (width + height - 2).
// We can generate all the points the robot visits in one full cycle.
// Directions: 0: East, 1: North, 2: West, 3: South.
// Initial: (0, 0), dir = 0 (East)
// 1. Move East: (0, 0) -> (width-1, 0). Points visited: (1,0), (2,0), ..., (width-1, 0). Total steps: width - 1.
//    After this, robot is at (width-1, 0), facing East. Next direction is North.
// 2. Move North: (width-1, 0) -> (width-1, height-1). Points visited: (width-1, 1), ..., (width-1, height-1). Total steps: height - 1.
//    After this, robot is at (width-1, height-1), facing North. Next direction is West.
// 3. Move West: (width-1, height-1) -> (0, height-1). Points visited: (width-2, height-1), ..., (0, height-1). Total steps: width - 1.
//    After this, robot is at (0, height-1), facing West. Next direction is South.
// 4. Move South: (0, height-1) -> (0, 0). Points visited: (0, height-2), ..., (0, 1). Total steps: height - 1.
//    After this, robot is at (0, 0), facing South. Next direction is East. This completes a cycle.
// Total steps in one cycle: (width - 1) + (height - 1) + (width - 1) + (height - 1) = 2 * (width + height - 2).
//
// Let's store the path as a list of pairs: {x, y}.
// We also need to know the direction at each point.
// It's easier to store the path as a list of (x, y, direction_index).
//
// Revised Pre-calculation Strategy:
// 1. Generate the sequence of positions and directions for one full cycle.
//    Store them in a vector of tuples or structs: `vector<tuple<int, int, int>> path`.
//    The tuple will store (x, y, direction_code).
//    Direction codes: 0: East, 1: North, 2: West, 3: South.
// 2. Keep track of the total steps for one cycle.
// 3. When `step(num)` is called:
//    a. If the robot is at the start of a cycle (i.e., at (0,0) facing East, or after completing a cycle),
//       calculate `effective_steps = num % cycle_length`. If `effective_steps` is 0 and `num > 0`,
//       it means the robot completes exactly `num / cycle_length` cycles and ends up where it started
//       for the cycle, but it might have made a turn.
//       A simpler way: If `num` is greater than the current path index + remaining steps in cycle,
//       calculate how many full cycles are completed and use `num % cycle_length` for the remainder.
//       This requires careful handling of the initial state and the modulo operation.
//
// Let's use the simulation approach first and optimize if necessary, given the constraints.
// The constraints on `num` and total calls suggest that simulating step-by-step for each `step(num)`
// might be too slow if `num` is large.
// Example 1 analysis:
// Robot(6, 3)
// Initial: (0,0), East
// step(2):
//   move 1: (1,0), East
//   move 2: (2,0), East
// Final: (2,0), East
// step(2):
//   move 1: (3,0), East
//   move 2: (4,0), East
// Final: (4,0), East
// getPos: [4,0]
// getDir: "East"
// step(2):
//   move 1: (5,0), East
//   move 2: Try to move East to (6,0) - out of bounds. Turn North.
//           Now at (5,0), facing North. Retry step.
//           Move 1 North: (5,1), North
// Final: (5,1), North
// step(1):
//   move 1: (5,2), North
// Final: (5,2), North
// step(4):
//   move 1: (5,3), North - out of bounds. Turn West.
//           Now at (5,2), facing West. Retry step.
//           Move 1 West: (4,2), West
//   move 2: (3,2), West
//   move 3: (2,2), West
//   move 4: (1,2), West
// Final: (1,2), West
// getPos: [1,2]
// getDir: "West"
//
// This confirms the simulation logic. The issue is efficiency.
//
// Let's implement the pre-calculation approach.
// The key is to correctly handle `num` modulo the cycle length.
// When `step(num)` is called, the robot may have already moved some steps in the current cycle.
// We need to know the total number of steps taken so far.
//
// Let `total_steps_taken` be the cumulative number of steps taken by the robot.
// `cycle_length = 2 * (width + height - 2)`.
//
// When `step(num)` is called:
// `new_total_steps = total_steps_taken + num`
// `effective_steps = new_total_steps % cycle_length`
//
// This `effective_steps` will be the index in our pre-calculated path for the *end* of the movement.
// We need to store the path such that `path[i]` corresponds to the state *after* taking `i` steps from the start of a cycle.
//
// Path generation:
// Start: (0,0), East (dir_code 0)
// `path.push_back({0, 0, 0});` // Initial state after 0 steps.
//
// 1. Eastward movement: from (0,0) to (width-1, 0).
//    For `i` from 1 to `width-1`: `path.push_back({i, 0, 0});`
//    Robot is now at (width-1, 0), facing East.
//
// 2. Northward movement: from (width-1, 0) to (width-1, height-1).
//    Direction changes to North (dir_code 1).
//    For `i` from 1 to `height-1`: `path.push_back({width-1, i, 1});`
//    Robot is now at (width-1, height-1), facing North.
//
// 3. Westward movement: from (width-1, height-1) to (0, height-1).
//    Direction changes to West (dir_code 2).
//    For `i` from 1 to `width-1`: `path.push_back({width-1 - i, height-1, 2});`
//    Robot is now at (0, height-1), facing West.
//
// 4. Southward movement: from (0, height-1) to (0, 1).
//    Direction changes to South (dir_code 3).
//    For `i` from 1 to `height-2`: `path.push_back({0, height-1 - i, 3});`
//    Robot is now at (0, 1), facing South.
//
// After this last loop, the robot is at (0, 1) facing South.
// The next step would be to (0,0) facing South, and then turn East.
//
// The cycle length is `2 * (width - 1) + 2 * (height - 1)`.
// If width=2, height=2, cycle = 2*1 + 2*1 = 4.
// Path for 2x2 grid:
// (0,0) E (0 steps)
// East to (1,0) (1 step) -> path[1] = {1,0,0}
// North to (1,1) (1 step) -> path[2] = {1,1,1}
// West to (0,1) (1 step) -> path[3] = {0,1,2}
// South to (0,0) (1 step) -> path[4] = {0,0,3} -- After 4 steps, robot is at (0,0) facing South.
//
// The path should represent the state *after* `k` steps.
// Let's store path in `vector<pair<int, int>> positions` and `vector<int> directions`.
//
// Pre-computation of path:
// `vector<pair<int, int>> pos_path;`
// `vector<int> dir_path; // 0:E, 1:N, 2:W, 3:S`
//
// Current position and direction
// `int cur_x, cur_y, cur_dir;`
// `int W, H;`
// `long long total_steps_simulated = 0;`
// `vector<pair<int, int>> precomputed_pos;`
// `vector<int> precomputed_dir;`
//
// `int dx[] = {1, 0, -1, 0}; // E, N, W, S`
// `int dy[] = {0, 1, 0, -1}; // E, N, W, S`
//
// Constructor:
// `Robot(int width, int height)`:
//   `W = width; H = height;`
//   `cur_x = 0; cur_y = 0; cur_dir = 0; // East`
//
//   `precomputed_pos.push_back({0, 0});`
//   `precomputed_dir.push_back(0);`
//
//   `int steps_count = 0;`
//   // East
//   for (int i = 0; i < W - 1; ++i) {
//     cur_x++;
//     steps_count++;
//     precomputed_pos.push_back({cur_x, cur_y});
//     precomputed_dir.push_back(cur_dir);
//   }
//   // North
//   cur_dir = 1;
//   for (int i = 0; i < H - 1; ++i) {
//     cur_y++;
//     steps_count++;
//     precomputed_pos.push_back({cur_x, cur_y});
//     precomputed_dir.push_back(cur_dir);
//   }
//   // West
//   cur_dir = 2;
//   for (int i = 0; i < W - 1; ++i) {
//     cur_x--;
//     steps_count++;
//     precomputed_pos.push_back({cur_x, cur_y});
//     precomputed_dir.push_back(cur_dir);
//   }
//   // South
//   cur_dir = 3;
//   // The last step South brings it to (0,0) if height > 1.
//   // But the path generation should stop *before* hitting (0,0) for the last time if it's part of the cycle.
//   // If H=2, it goes from (0,1) South to (0,0).
//   // If H=3, it goes from (0,2) South to (0,1).
//   // The last step in the South direction is to go from (0, H-1) to (0, 0).
//   // The loop for South should be `H-1` steps, taking it back to y=0.
//   // Wait, the loop is `H-1` steps North, from y=0 to y=H-1.
//   // Then `W-1` steps West, from x=W-1 to x=0.
//   // Then `H-1` steps South, from y=H-1 to y=0.
//   // Then `W-1` steps East, from x=0 to x=W-1.
//   // This makes it a perfect rectangle.
//   // The example path shows it goes to (0,1) and then faces South.
//   // The number of steps for South should bring it from (0, height-1) to (0, 1).
//   // The total path length is `(W-1) + (H-1) + (W-1) + (H-1) = 2*(W+H-2)`.
//   // Let's re-trace the precomputation for a 2x2 grid: W=2, H=2. Cycle = 2*(2+2-2) = 4 steps.
//   // Initial: (0,0), dir=0 (E)
//   // East (W-1 = 1 step): i=0. cur_x=1, cur_y=0. steps=1. Path: {1,0,0}
//   // Robot is now at (1,0), dir=0.
//   // North (H-1 = 1 step): cur_dir=1. i=0. cur_x=1, cur_y=1. steps=2. Path: {1,1,1}
//   // Robot is now at (1,1), dir=1.
//   // West (W-1 = 1 step): cur_dir=2. i=0. cur_x=0, cur_y=1. steps=3. Path: {0,1,2}
//   // Robot is now at (0,1), dir=2.
//   // South (H-1 = 1 step): cur_dir=3. i=0. cur_x=0, cur_y=0. steps=4. Path: {0,0,3}
//   // Robot is now at (0,0), dir=3.
//   // Total steps in path = 4. Cycle length = 4.
//   // The `precomputed_pos` size is 5. The first element is the initial state.
//   // `precomputed_pos[0] = {0,0}`, `precomputed_dir[0] = 0`.
//   // `precomputed_pos[1] = {1,0}`, `precomputed_dir[1] = 0`.
//   // `precomputed_pos[2] = {1,1}`, `precomputed_dir[2] = 1`.
//   // `precomputed_pos[3] = {0,1}`, `precomputed_dir[3] = 2`.
//   // `precomputed_pos[4] = {0,0}`, `precomputed_dir[4] = 3`.
//   // The path correctly lists the state *after* `k` steps.
//   // `precomputed_pos.size()` is `cycle_length + 1`.
//   // `precomputed_dir.size()` is `cycle_length + 1`.
//   // The actual number of unique positions/states visited in a cycle before repeating is `cycle_length`.
//   // The initial state is at 0 steps.
//   // The state after 1 step is at index 1.
//   // The state after `cycle_length` steps is at index `cycle_length`.
//   // So `precomputed_pos` and `precomputed_dir` should have size `cycle_length + 1`.
//
//   // Let's adjust the loops:
//   `precomputed_pos.clear();`
//   `precomputed_dir.clear();`
//
//   `int cx = 0, cy = 0, cd = 0; // 0:E, 1:N, 2:W, 3:S`
//   `precomputed_pos.push_back({cx, cy});`
//   `precomputed_dir.push_back(cd);`
//
//   // East
//   for (int i = 0; i < W - 1; ++i) {
//     cx += dx[cd];
//     cy += dy[cd];
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//   }
//   cd = 1; // Turn North
//   // North
//   for (int i = 0; i < H - 1; ++i) {
//     cx += dx[cd];
//     cy += dy[cd];
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//   }
//   cd = 2; // Turn West
//   // West
//   for (int i = 0; i < W - 1; ++i) {
//     cx += dx[cd];
//     cy += dy[cd];
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//   }
//   cd = 3; // Turn South
//   // South
//   // For the last segment, we need to go from (0, H-1) back to (0, 0).
//   // This involves `H-1` steps.
//   // However, if `H=1`, this loop won't run. But `H>=2`.
//   // If `H=2`, it goes from (0,1) to (0,0). `H-1 = 1` step.
//   // The total steps to complete the cycle is indeed `2*(W-1) + 2*(H-1)`.
//   // So there are `cycle_length` steps to traverse.
//   // The path vector should have `cycle_length + 1` entries, where index `k` corresponds to the state *after* `k` steps.
//   // The last segment is South, from (0, H-1) down to (0, 0). This takes H-1 steps.
//   // Example 6x3 grid:
//   // W=6, H=3. Cycle = 2*(6-1) + 2*(3-1) = 2*5 + 2*2 = 10 + 4 = 14 steps.
//   // Path size should be 15.
//   // East: (0,0) to (5,0). W-1 = 5 steps.
//   //   {0,0,0}, {1,0,0}, {2,0,0}, {3,0,0}, {4,0,0}, {5,0,0} (6 entries, 5 steps)
//   // North: (5,0) to (5,2). H-1 = 2 steps.
//   //   cd=1. {5,1,1}, {5,2,1} (2 entries, 2 steps)
//   // West: (5,2) to (0,2). W-1 = 5 steps.
//   //   cd=2. {4,2,2}, {3,2,2}, {2,2,2}, {1,2,2}, {0,2,2} (5 entries, 5 steps)
//   // South: (0,2) to (0,0). H-1 = 2 steps.
//   //   cd=3. {0,1,3}, {0,0,3} (2 entries, 2 steps)
//   // Total steps traversed in this construction: 5 + 2 + 5 + 2 = 14.
//   // Total entries in path vectors: 1 (initial) + 5 + 2 + 5 + 2 = 15.
//   // This is `cycle_length + 1`. So the loop for South should run `H-1` times.
//   for (int i = 0; i < H - 1; ++i) {
//     cx += dx[cd];
//     cy += dy[cd];
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//   }
//   // After the South loop, the robot is at (0,0) facing South.
//   // If W=2, H=2, cycle = 4.
//   // East: i=0. cx=1, cy=0. {1,0,0}. Path size 2.
//   // North: i=0. cx=1, cy=1. cd=1. {1,1,1}. Path size 3.
//   // West: i=0. cx=0, cy=1. cd=2. {0,1,2}. Path size 4.
//   // South: i=0. cx=0, cy=0. cd=3. {0,0,3}. Path size 5.
//   // Total path size is 5. This is cycle_length + 1 = 4 + 1. Correct.
//
//   // The total number of steps in one cycle.
//   // If W=2, H=2, cycle_len = 4.
//   // If W=6, H=3, cycle_len = 14.
//   cycle_length = (long long)(W - 1) * 2 + (long long)(H - 1) * 2;
//
// `step(int num)`:
//   `long long steps_to_take = num;`
//   `long long current_cycle_steps = total_steps_simulated % cycle_length;` // Steps into the current cycle
//
//   // Handle the case where the robot is at (0,0) facing South after completing a full cycle.
//   // If `total_steps_simulated > 0` and `current_cycle_steps == 0`, it means we just completed a cycle.
//   // The `precomputed_dir` at `cycle_length` is the direction *after* taking `cycle_length` steps.
//   // Example: (0,0) E -> (1,0) E -> (1,1) N -> (0,1) W -> (0,0) S. Total 4 steps.
//   // The state after 4 steps is (0,0), South.
//   // If `num` is large, we can calculate how many full cycles are completed.
//   // `long long num_cycles = steps_to_take / cycle_length;`
//   // `long long remaining_steps = steps_to_take % cycle_length;`
//
//   // If `total_steps_simulated` is 0 and `num` is 0, nothing happens.
//   // If `num` is large, we need to ensure `total_steps_simulated` is correctly updated.
//   // The effective number of steps taken from the *start of the path* is `(total_steps_simulated + num)`.
//   // We need to find the index in `precomputed_pos` and `precomputed_dir`.
//   // The index we need is `(total_steps_simulated + num) % cycle_length`.
//   // This will give us the target index.
//   // However, if `total_steps_simulated` is a multiple of `cycle_length`, and `num` is also a multiple,
//   // the modulo will be 0, which points to the initial state. This is correct.
//
//   // Let `current_total_steps = total_steps_simulated`.
//   // `target_total_steps = current_total_steps + num`.
//   // `target_index = target_total_steps % cycle_length`.
//   // The precomputed path has `cycle_length + 1` elements.
//   // `precomputed_pos[k]` is the position after `k` steps.
//   // So, if `target_total_steps` is 4, the index is 4.
//   // If `cycle_length` is 4, then `4 % 4 = 0`. This seems wrong.
//   // The index should be `target_total_steps % cycle_length`.
//   // If `cycle_length` is 4, and we take 4 steps, the target index should be 4.
//   // The issue is that `total_steps_simulated` is the *cumulative* count.
//   // The modulo operation `x % N` gives a result in `[0, N-1]`.
//   // We need to map `total_steps_simulated` to an index in our path.
//   // `precomputed_pos` has size `cycle_length + 1`.
//   // The states are indexed from 0 to `cycle_length`.
//   // `precomputed_pos[0]` is state after 0 steps.
//   // `precomputed_pos[cycle_length]` is state after `cycle_length` steps.
//   //
//   // When `step(num)` is called:
//   // `total_steps_simulated` = how many steps have been taken *cumulatively* from the very beginning.
//   // `new_total_steps = total_steps_simulated + num`.
//   // `index_in_path = new_total_steps % cycle_length`.
//   // This `index_in_path` tells us which point in the cycle we land on.
//   // For a 2x2 grid (cycle_length = 4):
//   // step(1): total_steps_simulated=0. new_total_steps=1. index = 1%4 = 1. pos[1], dir[1].
//   // step(2): total_steps_simulated=1. new_total_steps=3. index = 3%4 = 3. pos[3], dir[3].
//   // step(2): total_steps_simulated=3. new_total_steps=5. index = 5%4 = 1. pos[1], dir[1].
//   // This means after 5 steps, the robot is at the same position as after 1 step. This is correct for a cycle.
//   //
//   // What if `num` is very large?
//   // `total_steps_simulated` can grow large. Using `long long` for it.
//   // `cycle_length` can also be large. `2 * (100+100-2) = 2 * 198 = 396`. Max `cycle_length` is small.
//   // `num` up to 10^5.
//   // `total_steps_simulated + num` can exceed `long long` if not careful.
//   // However, `total_steps_simulated` is always `prev_total_steps + prev_num`.
//   // The maximum number of `step` calls is `10^4`.
//   // Maximum `num` is `10^5`.
//   // Maximum `total_steps_simulated` could be `10^4 * 10^5 = 10^9`. This fits in `long long`.
//
//   // Correction on how `num` is processed:
//   // When `step(num)` is called, we need to consider the current state.
//   // If the robot is at `precomputed_pos[idx]` and `precomputed_dir[idx]`, and we `step(num)`:
//   // The *new* total steps taken will be `idx + num`.
//   // The index we land on in the precomputed path is `(idx + num) % cycle_length`.
//   // BUT, `idx` here is `total_steps_simulated % cycle_length`.
//   // So the new index is `( (total_steps_simulated % cycle_length) + num ) % cycle_length`.
//   // This is equivalent to `(total_steps_simulated + num) % cycle_length`.
//
//   `long long effective_num_steps = num;`
//   // If `total_steps_simulated` is a multiple of `cycle_length` (and > 0),
//   // it means we just completed a cycle and are back at (0,0) facing South.
//   // The next step would be towards the East boundary.
//   // Example: 2x2 grid, cycle=4.
//   // Robot is at (0,0) E (0 steps)
//   // step(4): total_steps_simulated = 0. new_total_steps = 4. index = 4 % 4 = 0. Wait.
//   // The `precomputed_pos` array has size `cycle_length + 1`.
//   // Index `k` in `precomputed_pos` means the state *after* `k` steps.
//   // So if we take `N` steps, we should look at `precomputed_pos[N]`.
//   // If `N` is large, we need `N % cycle_length`.
//   // If `total_steps_simulated = 0`, and `num = 4`, `cycle_length = 4`.
//   // `new_total_steps = 4`. `target_index = 4 % 4 = 0`. This points to (0,0), East.
//   // But after 4 steps on a 2x2 grid, the robot is at (0,0), South.
//   // This means the modulo logic needs care.
//   // The path is cyclic. `path[i] == path[i + cycle_length]`.
//   // We want to find the state corresponding to `total_steps_simulated + num` steps.
//   // The index in our `precomputed_pos` array of size `cycle_length + 1` should be `(total_steps_simulated + num) % cycle_length`.
//   // This index directly maps to the state *after* that many steps within a cycle.
//   // Let's test the 2x2 case again: cycle_length = 4. precomputed_pos size = 5.
//   // Initial: total_steps_simulated = 0.
//   // step(1): new_total = 1. index = 1 % 4 = 1. pos[1]={1,0}, dir[1]=0. Correct.
//   // step(2): current total_steps_simulated = 1. new_total = 1 + 2 = 3. index = 3 % 4 = 3. pos[3]={0,1}, dir[3]=2. Correct.
//   // step(2): current total_steps_simulated = 3. new_total = 3 + 2 = 5. index = 5 % 4 = 1. pos[1]={1,0}, dir[1]=0. Correct.
//   // step(1): current total_steps_simulated = 5. new_total = 5 + 1 = 6. index = 6 % 4 = 2. pos[2]={1,1}, dir[2]=1. Correct.
//   //
//   // The only tricky part is when `total_steps_simulated` is a multiple of `cycle_length` and `num` is a multiple.
//   // E.g., robot is at (0,0) East (0 steps). `step(4)`. `total_steps_simulated = 0`. `new_total = 4`. `index = 4 % 4 = 0`.
//   // This maps to `precomputed_pos[0]`, which is (0,0) East. This is WRONG.
//   // The state after 4 steps is (0,0) South.
//   //
//   // The issue might be with how `total_steps_simulated` is used.
//   // If `cycle_length` is the number of steps to complete a loop *and return to the starting state*.
//   // For 2x2 grid:
//   // 0 steps: (0,0) E
//   // 1 step: (1,0) E
//   // 2 steps: (1,1) N
//   // 3 steps: (0,1) W
//   // 4 steps: (0,0) S
//   // 5 steps: (1,0) E  -> State repeats from step 1.
//   // The states are periodic with period `cycle_length`.
//   // The sequence of states is S_0, S_1, ..., S_{cycle_length-1}, S_0, S_1, ...
//   // If we have taken `T` steps, the state is `S_{T % cycle_length}`.
//   // So, `new_total_steps = total_steps_simulated + num`.
//   // The index we need is `new_total_steps % cycle_length`.
//   // `precomputed_pos` and `precomputed_dir` should only store `cycle_length` entries.
//   // `precomputed_pos[k]` should be the state *after* `k` steps, where `k` ranges from 0 to `cycle_length-1`.
//   //
//   // Let's retry precomputation:
//   `precomputed_pos.clear();`
//   `precomputed_dir.clear();`
//
//   `int cx = 0, cy = 0, cd = 0; // 0:E, 1:N, 2:W, 3:S`
//
//   // East
//   for (int i = 0; i < W - 1; ++i) {
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//     cx += dx[cd];
//     cy += dy[cd];
//   }
//   cd = 1; // Turn North
//   // North
//   for (int i = 0; i < H - 1; ++i) {
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//     cx += dx[cd];
//     cy += dy[cd];
//   }
//   cd = 2; // Turn West
//   // West
//   for (int i = 0; i < W - 1; ++i) {
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//     cx += dx[cd];
//     cy += dy[cd];
//   }
//   cd = 3; // Turn South
//   // South
//   // This loop must complete the cycle and end up at (0,0) facing South.
//   // The number of steps for South is H-1.
//   // The loop should run `H-1` times.
//   // After `W-1` East steps, we are at `(W-1, 0)`.
//   // After `H-1` North steps, we are at `(W-1, H-1)`.
//   // After `W-1` West steps, we are at `(0, H-1)`.
//   // Now we need to take `H-1` South steps to reach `(0, 0)`.
//   // The direction is South (cd=3).
//   // The loop should ensure we visit `H-1` points.
//   // The number of steps on the South leg is `H-1`.
//   for (int i = 0; i < H - 1; ++i) {
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//     cx += dx[cd];
//     cy += dy[cd];
//   }
//   // After all loops, `cx` will be 0, `cy` will be 0. `cd` will be 3 (South).
//   // The `precomputed_pos` vector will have `(W-1) + (H-1) + (W-1) + (H-1) = cycle_length` elements.
//   // `precomputed_dir` vector will also have `cycle_length` elements.
//   // `precomputed_pos[k]` is the position after taking `k` steps from the start.
//   // The `total_steps_simulated` will be the cumulative count of steps from the beginning.
//
//   // Example 2x2: W=2, H=2. cycle_length = 4.
//   // Initial: cx=0, cy=0, cd=0.
//   // East (W-1=1): i=0. push {0,0,0}. cx=1, cy=0.
//   // North (H-1=1): cd=1. i=0. push {1,0,1}. cx=1, cy=1.
//   // West (W-1=1): cd=2. i=0. push {1,1,2}. cx=0, cy=1.
//   // South (H-1=1): cd=3. i=0. push {0,1,3}. cx=0, cy=0.
//   // Path vectors have 4 elements:
//   // pos: [{0,0}, {1,0}, {1,1}, {0,1}]
//   // dir: [0, 1, 2, 3]
//   //
//   // Now, if `step(num)` is called.
//   // `total_steps_simulated` is the number of steps taken *before* this call.
//   // `new_total_steps = total_steps_simulated + num`.
//   // `target_index_in_cycle = new_total_steps % cycle_length`.
//   // This `target_index_in_cycle` is the index into our `precomputed_pos` and `precomputed_dir` vectors.
//   //
//   // If `cycle_length` is 0 (e.g., 1x1 grid, but constraints say W, H >= 2).
//   // If W=2, H=2, cycle_length = 4.
//   // Initial: total_steps_simulated = 0.
//   // step(1): new_total=1. index = 1%4 = 1. pos[1]={1,0}, dir[1]=1. Wait, direction should be 0 (East).
//   // My `precomputed_dir` is wrong. The direction stored should be the direction *while moving to* that position.
//   // Or, the direction *at* that position.
//   // The problem states: "robot is initially at cell (0, 0) facing direction "East"".
//   // "Returns the current direction of the robot".
//   //
//   // Let's try again with the path storing the state *after* each step:
//   `precomputed_pos.clear();`
//   `precomputed_dir.clear();`
//
//   `int cx = 0, cy = 0, cd = 0; // 0:E, 1:N, 2:W, 3:S`
//
//   // The sequence of movements defines the path.
//   // Move East W-1 steps.
//   for (int i = 0; i < W - 1; ++i) {
//     cx += dx[cd]; // Move East
//     precomputed_pos.push_back({cx, cy}); // Position after this step
//     precomputed_dir.push_back(cd);      // Direction after this step
//   }
//   cd = 1; // Turn North
//   // Move North H-1 steps.
//   for (int i = 0; i < H - 1; ++i) {
//     cy += dy[cd]; // Move North
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//   }
//   cd = 2; // Turn West
//   // Move West W-1 steps.
//   for (int i = 0; i < W - 1; ++i) {
//     cx += dx[cd]; // Move West
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//   }
//   cd = 3; // Turn South
//   // Move South H-1 steps.
//   for (int i = 0; i < H - 1; ++i) {
//     cy += dy[cd]; // Move South
//     precomputed_pos.push_back({cx, cy});
//     precomputed_dir.push_back(cd);
//   }
//
//   // After this, `precomputed_pos` and `precomputed_dir` contain `cycle_length` elements.
//   // `precomputed_pos[k]` is the position after `k+1` steps from the start.
//   // This is not quite right. Let's make it simpler:
//   // `precomputed_pos[k]` is the position *after* the k-th step in the cycle sequence.
//   //
//   // Example 2x2: W=2, H=2. cycle_length=4.
//   // Initial: cx=0, cy=0, cd=0.
//   // East (W-1=1): i=0. cx=1. push {1,0}, 0. // After 1 step
//   // North (H-1=1): cd=1. i=0. cy=1. push {1,1}, 1. // After 2 steps
//   // West (W-1=1): cd=2. i=0. cx=0. push {0,1}, 2. // After 3 steps
//   // South (H-1=1): cd=3. i=0. cy=0. push {0,0}, 3. // After 4 steps
//   //
//   // `precomputed_pos` = [{1,0}, {1,1}, {0,1}, {0,0}]
//   // `precomputed_dir` = [0, 1, 2, 3]
//   // Size is 4 = cycle_length.
//   //
//   // `total_steps_simulated` counts the total steps taken from the very start.
//   // When `step(num)` is called:
//   // `new_total_steps = total_steps_simulated + num`.
//   // `target_index_in_cycle = new_total_steps % cycle_length`.
//   // This `target_index_in_cycle` refers to the index in our `precomputed_pos` and `precomputed_dir` vectors.
//   //
//   // If `total_steps_simulated = 0`.
//   // step(1): new_total=1. index = 1 % 4 = 1. pos[1]={1,1}, dir[1]=1. WRONG. Should be {1,0}, 0.
//   // The index `k` in `precomputed_pos[k]` should correspond to the state *after* `k+1` steps.
//   //
//   // The problem is that `total_steps_simulated` is the GLOBAL count.
//   // The modulo applies to the number of steps within a cycle.
//   // `total_steps_simulated` already accounts for full cycles.
//   // So `total_steps_simulated % cycle_length` is the number of steps taken *in the current cycle*.
//   // Let `current_cycle_pos_index = total_steps_simulated % cycle_length`.
//   // The new number of steps in the cycle will be `(current_cycle_pos_index + num) % cycle_length`.
//   //
//   // Let's consider the `step` function logic:
//   // `long long num_steps = num;`
//   // `long long current_cycle_idx = total_steps_simulated % cycle_length;`
//   //
//   // Special case: If `total_steps_simulated` is 0 and `num` is 0, nothing happens.
//   // If `cycle_length == 0` (which can happen if W=1 or H=1, but constraints say W,H >= 2).
//   //
//   // If `cycle_length > 0`:
//   // `long long steps_taken_in_this_call = num_steps;`
//   // `long long new_total_steps = total_steps_simulated + steps_taken_in_this_call;`
//   // `long long final_cycle_idx = new_total_steps % cycle_length;`
//   //
//   // If `final_cycle_idx` is 0, it means we completed exactly `k * cycle_length` steps.
//   // The state for index 0 is the first step of the cycle.
//   // `precomputed_pos[0]` corresponds to the state after 1 step.
//   // So, if `final_cycle_idx` is 0, we should use the last element of the precomputed path,
//   // which corresponds to `cycle_length` steps.
//   // This means if `final_cycle_idx` is 0, we should use `cycle_length - 1` as the index.
//   //
//   // Let's use a helper function: `get_state_after_steps(long long steps_count)`
//   // `steps_count` is the total number of steps taken from the beginning.
//   // `idx_in_precomputed = (steps_count - 1) % cycle_length`. This maps to the correct segment.
//   // If `steps_count == 0`, it's the initial state (0,0) East.
//   //
//   // The `total_steps_simulated` variable should be updated.
//   // `total_steps_simulated += num;`
//   //
//   // `long long effective_steps = total_steps_simulated;`
//   // `int index_in_path;`
//   //
//   // If `effective_steps == 0`, this is the initial state. But `step(0)` is not possible with num >= 1.
//   // If `effective_steps > 0`:
//   // `index_in_path = (effective_steps - 1) % cycle_length;`
//   //
//   // This `index_in_path` will range from `0` to `cycle_length - 1`.
//   // This directly maps to our `precomputed_pos` and `precomputed_dir` which have size `cycle_length`.
//   //
//   // `cur_x = precomputed_pos[index_in_path].first;`
//   // `cur_y = precomputed_pos[index_in_path].second;`
//   // `cur_dir = precomputed_dir[index_in_path];`
//   //
//   // `getPos()`: return {cur_x, cur_y}
//   // `getDir()`: return `direction_strings[cur_dir]`
//
//   // Let's trace 2x2 again with this logic. Cycle=4. Path size=4.
//   // Path pos: [{1,0}, {1,1}, {0,1}, {0,0}]
//   // Path dir: [0, 1, 2, 3]
//   //
//   // Initial: cur_x=0, cur_y=0, cur_dir=0 (East). total_steps_simulated=0.
//   //
//   // step(2): num=2.
//   // total_steps_simulated = 0 + 2 = 2.
//   // effective_steps = 2.
//   // index_in_path = (2 - 1) % 4 = 1.
//   // cur_x = pos[1].first = 1.
//   // cur_y = pos[1].second = 1.
//   // cur_dir = dir[1] = 1 (North).
//   // Final state: (1,1), North.
//   //
//   // Example 1: Robot(6, 3)
//   // W=6, H=3. Cycle_length = 2*(5) + 2*(2) = 10 + 4 = 14. Path size 14.
//   //
//   // Initial: (0,0), East. total_steps_simulated = 0.
//   //
//   // step(2): num=2.
//   // total_steps_simulated = 0 + 2 = 2.
//   // index = (2-1) % 14 = 1.
//   // State after 1 step: {1,0}, dir 0 (East).
//   // Actual state after 2 steps: pos[1] from path is where it ends up AFTER the 2nd step.
//   // Path pos: [{1,0}, {2,0}, {3,0}, {4,0}, {5,0},  // E
//   //            {5,1}, {5,2},                      // N
//   //            {4,2}, {3,2}, {2,2}, {1,2}, {0,2},  // W
//   //            {0,1}, {0,0}]                      // S
//   // Path dir: [0, 0, 0, 0, 0,
//   //            1, 1,
//   //            2, 2, 2, 2, 2,
//   //            3, 3]
//   //
//   // step(2): total_steps_simulated = 0. new_total = 2. index = (2-1)%14 = 1.
//   // Final state is pos[1]={2,0}, dir[1]=0. Correct. total_steps_simulated = 2.
//   //
//   // step(2): num=2.
//   // total_steps_simulated = 2. new_total = 2 + 2 = 4. index = (4-1)%14 = 3.
//   // Final state is pos[3]={4,0}, dir[3]=0. Correct. total_steps_simulated = 4.
//   //
//   // getPos() -> [4,0]. getDir() -> "East". Correct.
//   //
//   // step(2): num=2.
//   // total_steps_simulated = 4. new_total = 4 + 2 = 6. index = (6-1)%14 = 5.
//   // Final state is pos[5]={5,2}, dir[5]=1. Wait. Example says (5,1) North.
//   // Let's recheck the path generation and indexing.
//   //
//   // The problem: "After the robot finishes moving the number of steps required, it stops."
//   //
//   // Path generation:
//   // East: W-1 steps. Pos: (1,0) to (W-1, 0).
//   // Robot starts at (0,0) facing East.
//   // Step 1: moves to (1,0), facing East.
//   // Step 2: moves to (2,0), facing East.
//   // ...
//   // Step W-1: moves to (W-1,0), facing East.
//   //
//   // North: H-1 steps.
//   // Robot is at (W-1,0), faces North.
//   // Step W: moves to (W-1,1), facing North.
//   // ...
//   // Step W-1 + H-1: moves to (W-1, H-1), facing North.
//   //
//   // West: W-1 steps.
//   // Robot is at (W-1, H-1), faces West.
//   // Step W-1 + H-1 + 1: moves to (W-2, H-1), facing West.
//   // ...
//   // Step W-1 + H-1 + W-1: moves to (0, H-1), facing West.
//   //
//   // South: H-1 steps.
//   // Robot is at (0, H-1), faces South.
//   // Step W-1 + H-1 + W-1 + 1: moves to (0, H-2), facing South.
//   // ...
//   // Step W-1 + H-1 + W-1 + H-1: moves to (0, 0), facing South. This is after `cycle_length` steps.
//   //
//   // `precomputed_pos` and `precomputed_dir` should store the state *after* each step.
//   // Size `cycle_length`. Index `k` corresponds to state after `k+1` steps.
//
//   // Revisit example 1 trace: Robot(6, 3). W=6, H=3. Cycle=14.
//   // Initial: (0,0) East. total_steps_simulated = 0.
//   //
//   // step(2): num=2.
//   // total_steps_simulated = 0 + 2 = 2.
//   // Index for pos/dir = (2-1) % 14 = 1.
//   // So, use `precomputed_pos[1]` and `precomputed_dir[1]`.
//   //
//   // My path generation:
//   // East: W-1=5 steps.
//   // i=0: cx=1. push({1,0}, 0). // Step 1
//   // i=1: cx=2. push({2,0}, 0). // Step 2
//   // i=2: cx=3. push({3,0}, 0). // Step 3
//   // i=3: cx=4. push({4,0}, 0). // Step 4
//   // i=4: cx=5. push({5,0}, 0). // Step 5
//   //
//   // North: H-1=2 steps. cd=1.
//   // i=0: cy=1. push({5,1}, 1). // Step 6
//   // i=1: cy=2. push({5,2}, 1). // Step 7
//   //
//   // West: W-1=5 steps. cd=2.
//   // i=0: cx=4. push({4,2}, 2). // Step 8
//   // i=1: cx=3. push({3,2}, 2). // Step 9
//   // i=2: cx=2. push({2,2}, 2). // Step 10
//   // i=3: cx=1. push({1,2}, 2). // Step 11
//   // i=4: cx=0. push({0,2}, 2). // Step 12
//   //
//   // South: H-1=2 steps. cd=3.
//   // i=0: cy=1. push({0,1}, 3). // Step 13
//   // i=1: cy=0. push({0,0}, 3). // Step 14
//   //
//   // Path size is 14.
//   //
//   // step(2): total_steps_simulated = 0. new_total = 2. index = (2-1)%14 = 1.
//   // `precomputed_pos[1]` = {2,0}. `precomputed_dir[1]` = 0. Correct. `total_steps_simulated` becomes 2.
//   //
//   // step(2): total_steps_simulated = 2. new_total = 4. index = (4-1)%14 = 3.
//   // `precomputed_pos[3]` = {4,0}. `precomputed_dir[3]` = 0. Correct. `total_steps_simulated` becomes 4.
//   //
//   // getPos -> [4,0]. getDir -> East. Correct.
//   //
//   // step(2): num=2.
//   // total_steps_simulated = 4. new_total = 6. index = (6-1)%14 = 5.
//   // `precomputed_pos[5]` = {5,2}. `precomputed_dir[5]` = 1 (North).
//   // Example says: [5,1], North.
//   //
//   // The path generation seems to be off by 1 in terms of what the index represents.
//   // `precomputed_pos[k]` is the position *after* `k+1` steps have been taken.
//   //
//   // When we call `step(num)`, we advance `total_steps_simulated` by `num`.
//   // The new `total_steps_simulated` is the total steps from the very beginning.
//   // The index into the precomputed path is `(new_total_steps - 1) % cycle_length`.
//   // This should give us the state *after* `new_total_steps` steps.
//   //
//   // Let's rethink example 1: Robot(6, 3)
//   // step(2) -> (2,0) East. total_steps=2.
//   // step(2) -> (4,0) East. total_steps=4.
//   // step(2): num=2. total_steps=4. new_total_steps = 4+2=6.
//   // index = (6-1) % 14 = 5.
//   // precomputed_pos[5] = {5,2}. precomputed_dir[5] = 1 (North).
//   // Example output: (5,1), North.
//   //
//   // The discrepancy is `(5,2)` vs `(5,1)`.
//   // It seems my North loop is off.
//   //
//   // Robot at (5,0), facing North.
//   // step(1) North: moves to (5,1). Direction North.
//   // step(2) North: moves to (5,2). Direction North.
//   //
//   // My path generation for North:
//   // `for (int i = 0; i < H - 1; ++i)`
//   // `cy += dy[cd]; // Move North`
//   // `precomputed_pos.push_back({cx, cy});`
//   // `precomputed_dir.push_back(cd);`
//   //
//   // For H=3, H-1 = 2. Loop runs for i=0 and i=1.
//   // Start: cx=5, cy=0, cd=1 (North).
//   // i=0: cy += 1 (becomes 1). push {5,1}, 1. // This is state after step 6.
//   // i=1: cy += 1 (becomes 2). push {5,2}, 1. // This is state after step 7.
//   //
//   // This path generation seems correct for the positions.
//   // The example output is (5,1), North after step(2).
//   // This means the robot moved from (5,0) to (5,1) and *then* stopped.
//   // This is confusing. Let's re-read the example:
//   // `robot.step(2); // It moves one step East to (5, 0), and faces East.`
//   // `// Moving the next step East would be out of bounds, so it turns and faces North.`
//   // `// Then, it moves one step North to (5, 1), and faces North.`
//   // This describes the behavior for a single `step(1)`.
//   //
//   // The example `step(2)` implies two steps are taken.
//   // If the robot is at (5,0) facing East, and `step(2)` is called:
//   // Step 1: Moves East to (5,0) -> (5,0) East. Wait, example says it moves to (5,0) from somewhere.
//   // Example 1:
//   // step(2) -> moves to (2,0), faces East. total_steps = 2.
//   // step(2) -> moves to (4,0), faces East. total_steps = 4.
//   // step(2) ->
//   //   Attempt 1: move East to (5,0). Valid. Current pos: (5,0), facing East.
//   //   Attempt 2: move East to (6,0). Out of bounds.
//   //              Turn 90 deg counterclockwise -> faces North.
//   //              Now at (5,0) facing North. Retry step 2.
//   //   Move North to (5,1). Valid. Current pos: (5,1), facing North.
//   //   Finished 2 steps. Final state: (5,1), North.
//   //   total_steps = 4 + 2 = 6.
//   //
//   // My path generation for index 5:
//   // pos[5] = {5,2}, dir[5] = 1 (North).
//   // This implies that after the 6th step, the robot is at (5,2).
//   // The example implies it ends up at (5,1) after 2 steps.
//   //
//   // Let's look at the state *after* the requested number of steps are COMPLETED.
//   //
//   // `step(num)` means perform `num` atomic moves.
//   //
//   // `total_steps_simulated` is the correct state.
//   // `num` is the number of steps to add.
//   //
//   // The problem with the precomputation is how it maps to the actual steps.
//   //
//   // Consider the total steps taken. `total_steps_simulated`.
//   // When `step(num)` is called, we want to know the state after `total_steps_simulated + num` steps.
//   //
//   // If `total_steps_simulated == 0` and `num == 2`:
//   // We need the state after 2 steps.
//   // Step 1: (1,0), East
//   // Step 2: (2,0), East
//   // State after 2 steps: (2,0), East.
//   //
//   // My precomputation:
//   // Path index 0: state after step 1.
//   // Path index 1: state after step 2.
//   // Path index `k`: state after step `k+1`.
//   //
//   // `final_total_steps = total_steps_simulated + num`.
//   // `index_in_path = (final_total_steps - 1) % cycle_length`.
//   // This `index_in_path` should point to the correct precomputed state.
//   //
//   // For step(2) from initial state: final_total_steps = 2. index = (2-1)%14 = 1.
//   // `precomputed_pos[1]` is {2,0}. `precomputed_dir[1]` is 0. This IS correct.
//   //
//   // What about step(2) where the robot is at (4,0) facing East? `total_steps_simulated = 4`.
//   // `num = 2`. `final_total_steps = 4 + 2 = 6`.
//   // `index_in_path = (6 - 1) % 14 = 5`.
//   // `precomputed_pos[5]` is {5,2}. `precomputed_dir[5]` is 1 (North).
//   // Example output: [5,1], West. Wait, example output says [1,2], West.
//   // The example output for the last step:
//   // `robot.step(4); // Moving the next step North would be out of bounds, so it turns and faces West.`
//   // `                // Then, it moves four steps West to (1, 2), and faces West.`
//   // `robot.getPos(); // return [1, 2]`
//   // `robot.getDir(); // return "West"`
//   //
//   // This implies the state *after* step(2) was (5,1), North.
//   // My calculation was: step(2) results in (5,2), North.
//   //
//   // Let's trace that specific `step(2)` call from the example:
//   // Robot is at (4,0) facing East. `total_steps_simulated = 4`.
//   // `step(2)` is called.
//   //
//   // Simulation of these 2 steps:
//   // Current: (4,0), East.
//   // Step 1: Move East. (4,0) -> (5,0). Valid. State: (5,0), East.
//   // Step 2: Move East. (5,0) -> (6,0). Out of bounds.
//   //         Turn North. State: (5,0), North.
//   //         Retry step 2: Move North. (5,0) -> (5,1). Valid. State: (5,1), North.
//   // End of 2 steps. Final state for this call: (5,1), North.
//   // `total_steps_simulated` becomes `4 + 2 = 6`.
//   //
//   // My precomputed path segment for this:
//   // State after 4 steps: (4,0), East.
//   // Step 5: (5,0), East.
//   // Step 6: (5,1), North (after boundary turn).
//   // So, the state after 6 steps is (5,1), North.
//   //
//   // My precomputed path at index 5 (`final_total_steps=6`, `index=(6-1)%14=5`):
//   // `precomputed_pos[5]` should be {5,1}. `precomputed_dir[5]` should be 1 (North).
//   //
//   // Let's re-check my path generation for North:
//   // After East phase, robot is at `(W-1, 0)`. Here `W=6`, so `(5,0)`. Direction is East (0).
//   // Then `cd` becomes 1 (North). `cx=5, cy=0`.
//   // `H-1 = 3-1 = 2`. Loop for `i = 0` to `1`.
//   //
//   // i=0:
//   //   `cy += dy[cd]` => `cy = 0 + 1 = 1`.
//   //   `precomputed_pos.push_back({cx, cy})` => `{5, 1}`.
//   //   `precomputed_dir.push_back(cd)` => `1` (North).
//   //   This is state after step `(W-1) + 1 = 5 + 1 = 6`.
//   //
//   // i=1:
//   //   `cy += dy[cd]` => `cy = 1 + 1 = 2`.
//   //   `precomputed_pos.push_back({cx, cy})` => `{5, 2}`.
//   //   `precomputed_dir.push_back(cd)` => `1` (North).
//   //   This is state after step `(W-1) + 2 = 5 + 2 = 7`.
//   //
//   // So `precomputed_pos[5]` corresponds to step 6, which is {5,1}, North.
//   // And `precomputed_pos[6]` corresponds to step 7, which is {5,2}, North.
//   //
//   // My path generation should be correct.
//   //
//   // The example output for step(2) after (4,0) East is [5,1], North.
//   // My calculation with `total_steps_simulated = 4`, `num = 2`, `final_total_steps = 6`.
//   // `index = (6-1) % 14 = 5`.
//   // State is `precomputed_pos[5]`, `precomputed_dir[5]`.
//   // This is `{5,1}`, `1` (North).
//   // This matches the example explanation of the intermediate step.
//   //
//   // The next `step(1)`: `total_steps_simulated = 6`. `num = 1`. `final_total_steps = 7`.
//   // `index = (7-1) % 14 = 6`.
//   // `precomputed_pos[6]` is `{5,2}`. `precomputed_dir[6]` is `1` (North).
//   // This matches the example: "robot.step(1); // It moves one step North to (5, 2), and faces North."
//   //
//   // The next `step(4)`: `total_steps_simulated = 7`. `num = 4`. `final_total_steps = 11`.
//   // `index = (11-1) % 14 = 10`.
//   // `precomputed_pos[10]` is `{1,2}`. `precomputed_dir[10]` is `2` (West).
//   // This matches the example: "moves four steps West to (1, 2), and faces West."
//   //
//   // It seems my logic is correct now.
//   // The initial state must be handled correctly for `getPos` and `getDir` if `total_steps_simulated` is 0.
//   //
//   // `getPos()`:
//   // If `total_steps_simulated == 0`, return `{0, 0}`.
//   // Else, `index = (total_steps_simulated - 1) % cycle_length`. Return `precomputed_pos[index]`.
//   // `getDir()`:
//   // If `total_steps_simulated == 0`, return "East".
//   // Else, `index = (total_steps_simulated - 1) % cycle_length`. Return `direction_strings[precomputed_dir[index]]`.
//
//   // The constructor precomputes the path for `cycle_length` steps.
//   // `total_steps_simulated` should be initialized to 0.
//   //
//   // Time Complexity:
//   // Constructor: O(width * height) to precompute the path.
//   // step(): O(1) as it's just modulo arithmetic.
//   // getPos(), getDir(): O(1).
//   // Total Time Complexity: O(width * height) for initialization, then O(1) per query.
//   //
//   // Space Complexity:
//   // O(width * height) to store the precomputed path.
//
//   // Constraints: width, height <= 100. So width*height <= 10000. This is acceptable.
//   // Max calls = 10^4.
//   // Max num = 10^5.
//   // Total steps can be up to 10^9, fits in long long.
//   // `cycle_length` <= 2 * (100+100-2) = 396.
//
//   // Final check on initial state:
//   // If `total_steps_simulated` is 0, we are at (0,0) East.
//   // If `step(num)` is called with `num >= 1`.
//   // `new_total_steps = 0 + num`.
//   // `index = (num - 1) % cycle_length`.
//   // This index correctly refers to the state after `num` steps.
//   //
//   // So, `getPos` and `getDir` need to handle `total_steps_simulated == 0` separately,
//   // or the `index = (total_steps_simulated - 1) % cycle_length` logic will fail for `total_steps_simulated = 0`.
//   //
//   // The states are indexed from 0 to cycle_length-1.
//   // `total_steps_simulated = 0` is initial.
//   // `total_steps_simulated = 1` -> index 0 in path.
//   // `total_steps_simulated = k` -> index `(k-1) % cycle_length` in path.
//   //
//   // Let's make it simpler:
//   // `current_x`, `current_y`, `current_dir` store the actual state.
//   // When `step(num)` is called:
//   // `long long steps_to_apply = num;`
//   // `long long current_pos_in_cycle = total_steps_simulated % cycle_length;`
//   // `long long total_steps_after_move = total_steps_simulated + steps_to_apply;`
//   // `long long target_pos_in_cycle = total_steps_after_move % cycle_length;`
//   //
//   // If `target_pos_in_cycle == 0`, it implies we landed exactly at the end of a cycle.
//   // This should correspond to the state after `cycle_length` steps, which is index `cycle_length - 1` in our path.
//   //
//   // The easiest way is to make `precomputed_pos` and `precomputed_dir` store the state for `0` to `cycle_length` steps.
//   // Size `cycle_length + 1`.
//   // `precomputed_pos[0]` = initial state (0,0) East.
//   // `precomputed_pos[k]` = state after `k` steps.
//   //
//   // Then `index_in_path = (total_steps_simulated + num) % (cycle_length + 1)`? No.
//   // The cycle length is `2*(W-1) + 2*(H-1)`.
//   // The states are periodic with this length.
//   // So `state(T) = state(T % cycle_length)`.
//   //
//   // `int current_idx = total_steps_simulated % cycle_length;`
//   // `int new_idx = (current_idx + num) % cycle_length;`
//   //
//   // If `new_idx == 0` AND `num > 0` AND `total_steps_simulated % cycle_length != 0` (meaning we are not *already* at the start of a cycle), then it's the state *after* `cycle_length` steps.
//   // This is getting complicated.
//   //
//   // Simplest approach: `total_steps_simulated` tracks the total steps taken.
//   // When `step(num)` is called:
//   // `total_steps_simulated += num;`
//   // Then get the state from the precomputed path based on `total_steps_simulated`.
//   // The precomputed path must contain states for `0, 1, 2, ..., cycle_length` steps.
//   // Size `cycle_length + 1`.
//   // Index `k` corresponds to state after `k` steps.
//   //
//   // `index_to_use = total_steps_simulated % cycle_length`.
//   // This will map to indices `0, 1, ..., cycle_length-1`.
//   // If `total_steps_simulated` is a multiple of `cycle_length`, then `index_to_use` is 0.
//   // This maps to the initial state (0,0) East.
//   // But after `cycle_length` steps, the robot is at (0,0) South.
//   //
//   // Let's use a vector that stores `cycle_length` states.
//   // `vector<pair<int, int>> path_pos;`
//   // `vector<int> path_dir;`
//   // `path_pos[k]` = state after `k+1` steps.
//   // `k` from `0` to `cycle_length - 1`.
//   //
//   // `step(num)`:
//   // `total_steps_simulated += num;`
//   // `int index = (total_steps_simulated - 1) % cycle_length;`
//   //
//   // `getPos`: if `total_steps_simulated == 0` return `{0,0}`. Else return `path_pos[index]`.
//   // `getDir`: if `total_steps_simulated == 0` return `"East"`. Else return `direction_strings[path_dir[index]]`.
//
//   // This seems to be the most consistent logic.
//   // `cycle_length` needs to be calculated using `long long` to avoid overflow if W and H are large.
//   // W, H <= 100, so `2 * (100 + 100 - 2)` is small enough for `int`.
//   // But `total_steps_simulated` needs `long long`.
//
//   // Need to handle the `cycle_length == 0` case, though constraints prevent it.
//   // If `cycle_length` is 0, the modulo operation would be division by zero.
//   // For W>=2, H>=2, `cycle_length = 2*(W-1) + 2*(H-1) >= 2*(1) + 2*(1) = 4`. So `cycle_length` is always at least 4.
//   //
//   // Direction string mapping:
//   // 0: East
//   // 1: North
//   // 2: West
//   // 3: South
//   // `string dirs[] = {"East", "North", "West", "South"};`

```cpp
#include <vector>
#include <string>
#include <tuple>

// Class to simulate a robot's movement on a grid.
class Robot {
private:
    // Grid dimensions.
    int width;
    int height;

    // Current position of the robot.
    int current_x;
    int current_y;

    // Current direction of the robot.
    // 0: East, 1: North, 2: West, 3: South.
    int current_dir;

    // Precomputed path for one full cycle of the robot's movement.
    // Stores the position after each step in the cycle.
    std::vector<std::pair<int, int>> path_pos;
    // Stores the direction after each step in the cycle.
    std::vector<int> path_dir;

    // Total number of steps taken by the robot since the beginning.
    // This helps in determining the current state using the precomputed path.
    long long total_steps_simulated;

    // Directions array for movement: [East, North, West, South]
    int dx[4] = {1, 0, -1, 0};
    int dy[4] = {0, 1, 0, -1};

    // Array to map direction codes to strings.
    std::string directions_map[4] = {"East", "North", "West", "South"};

    // Length of one full cycle of the robot's movement around the grid perimeter.
    // For W x H grid, cycle_length = 2*(W-1) + 2*(H-1).
    long long cycle_length;

    // Helper function to initialize the precomputed path.
    void precompute_path() {
        // Clear any existing path data.
        path_pos.clear();
        path_dir.clear();

        // Reset current state for path generation.
        int cx = 0;
        int cy = 0;
        int cd = 0; // Start facing East.

        // Generate path for the Eastward movement segment.
        // Moves from (0,0) to (width-1, 0). This takes (width-1) steps.
        for (int i = 0; i < width - 1; ++i) {
            cx += dx[cd]; // Move East.
            path_pos.push_back({cx, cy}); // Store position after this step.
            path_dir.push_back(cd);      // Store direction after this step.
        }

        // Change direction to North.
        cd = 1;
        // Generate path for the Northward movement segment.
        // Moves from (width-1, 0) to (width-1, height-1). This takes (height-1) steps.
        for (int i = 0; i < height - 1; ++i) {
            cy += dy[cd]; // Move North.
            path_pos.push_back({cx, cy}); // Store position after this step.
            path_dir.push_back(cd);      // Store direction after this step.
        }

        // Change direction to West.
        cd = 2;
        // Generate path for the Westward movement segment.
        // Moves from (width-1, height-1) to (0, height-1). This takes (width-1) steps.
        for (int i = 0; i < width - 1; ++i) {
            cx += dx[cd]; // Move West.
            path_pos.push_back({cx, cy}); // Store position after this step.
            path_dir.push_back(cd);      // Store direction after this step.
        }

        // Change direction to South.
        cd = 3;
        // Generate path for the Southward movement segment.
        // Moves from (0, height-1) back to (0, 0). This takes (height-1) steps.
        for (int i = 0; i < height - 1; ++i) {
            cy += dy[cd]; // Move South.
            path_pos.push_back({cx, cy}); // Store position after this step.
            path_dir.push_back(cd);      // Store direction after this step.
        }
        // After all segments, the robot is at (0,0) facing South.
        // The total number of steps in one cycle is (width-1) + (height-1) + (width-1) + (height-1).
        // The path vectors `path_pos` and `path_dir` now contain `cycle_length` elements.
        // `path_pos[k]` stores the state AFTER the (k+1)-th step in the cycle.
    }

public:
    // Initializes the Robot with the given grid dimensions.
    // The robot starts at (0,0) facing East.
    Robot(int width, int height) {
        this->width = width;
        this->height = height;
        this->current_x = 0;
        this->current_y = 0;
        this->current_dir = 0; // 0: East
        this->total_steps_simulated = 0; // Initially 0 steps taken.

        // Calculate the length of a full cycle around the perimeter.
        // Constraints: width, height >= 2.
        this->cycle_length = (long long)(width - 1) * 2 + (long long)(height - 1) * 2;

        // Precompute the entire path for one cycle.
        precompute_path();
    }

    // Instructs the robot to move forward num steps.
    void step(int num) {
        // If the robot hasn't moved yet (total_steps_simulated is 0),
        // and num is 0 (although constraints say num >= 1), nothing happens.
        if (num == 0) return;

        // Update the total number of steps taken.
        total_steps_simulated += num;
    }

    // Returns the current cell the robot is at, as an array of length 2, [x, y].
    std::vector<int> getPos() {
        // If no steps have been taken, the robot is at its initial position (0,0).
        if (total_steps_simulated == 0) {
            return {0, 0};
        }

        // Calculate the index in the precomputed path.
        // `total_steps_simulated` is the total steps from start.
        // `(total_steps_simulated - 1)` gives the 0-based step count.
        // The modulo `cycle_length` ensures we wrap around the cycle.
        // This index corresponds to the state AFTER `total_steps_simulated` steps.
        int index_in_path = (total_steps_simulated - 1) % cycle_length;

        // Return the precomputed position for that step count.
        return {path_pos[index_in_path].first, path_pos[index_in_path].second};
    }

    // Returns the current direction of the robot, "North", "East", "South", or "West".
    std::string getDir() {
        // If no steps have been taken, the robot is facing East.
        if (total_steps_simulated == 0) {
            return directions_map[0]; // "East"
        }

        // Calculate the index in the precomputed path using the same logic as getPos.
        int index_in_path = (total_steps_simulated - 1) % cycle_length;

        // Return the precomputed direction for that step count.
        return directions_map[path_dir[index_in_path]];
    }
};
```