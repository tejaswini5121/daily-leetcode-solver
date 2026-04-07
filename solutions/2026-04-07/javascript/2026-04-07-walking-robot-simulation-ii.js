/**
 * @summary Simulates a robot moving on a grid, turning counterclockwise when hitting boundaries.
 * @link https://leetcode.com/problems/walking-robot-simulation-ii/
 *
 * @approach
 * The robot's movement on the grid can be thought of as a continuous path along the perimeter of the grid.
 * We can pre-calculate the total perimeter length and the sequence of positions visited along this path.
 * When the robot is instructed to take `num` steps, we can use the modulo operator with the total perimeter
 * to determine the robot's final position and direction on its cyclical path.
 *
 * 1. Calculate the perimeter length and store all visited positions and directions.
 *    - Start at (0, 0) facing East.
 *    - Move East until the boundary is reached.
 *    - Turn North and move until the boundary is reached.
 *    - Turn West and move until the boundary is reached.
 *    - Turn South and move until the boundary is reached (but not back to (0,0) if it's the first move).
 *    - This completes one full cycle.
 *    - Store each position `[x, y]` and its corresponding direction in a list.
 *
 * 2. Implement the `step(num)` function:
 *    - Keep track of the robot's current "effective" step count within the cycle.
 *    - For each `step(num)` call, add `num` to the current step count.
 *    - Use the modulo operator (`%`) with the total perimeter length to find the index of the final position in our pre-calculated path.
 *    - Handle the edge case where `num` is 0 for the initial `step(0)` call to place the robot at the starting position correctly if the perimeter is only one point (which shouldn't happen based on constraints, but good practice).
 *    - The pre-calculated path needs to account for the initial facing direction and the fact that the robot starts at (0,0). The path should logically represent the robot traversing the perimeter.
 *
 * 3. Implement `getPos()` and `getDir()`:
 *    - These methods simply return the `x`, `y` coordinates and the direction of the robot based on its current effective step count.
 *
 * Optimization: Instead of simulating step-by-step in `step(num)`, we can directly calculate the final position.
 * The total number of steps taken is cumulative. Let `totalSteps` be the sum of all `num` passed to `step`.
 * The robot's position on the perimeter path is determined by `totalSteps % perimeterLength`.
 *
 * Detailed Path Generation:
 * - `directions`: ["East", "North", "West", "South"]
 * - `dx`: [1, 0, -1, 0]
 * - `dy`: [0, 1, 0, -1]
 *
 * Start at (0, 0), direction index 0 (East).
 *
 * Path:
 * 1. Move East: from (0, 0) to (width-1, 0). Add `[i, 0]` for `i` from 0 to `width-1`.
 *    Direction is East.
 * 2. Move North: from (width-1, 1) to (width-1, height-1). Add `[width-1, i]` for `i` from 1 to `height-1`.
 *    Direction is North.
 * 3. Move West: from (width-2, height-1) to (0, height-1). Add `[i, height-1]` for `i` from `width-2` down to 0.
 *    Direction is West.
 * 4. Move South: from (0, height-2) to (0, 1). Add `[0, i]` for `i` from `height-2` down to 1.
 *    Direction is South.
 *
 * Note that the robot starts at (0,0) facing East. The path generation needs to be careful about the order and include (0,0) as the first point.
 * The `step(num)` function updates a cumulative step count. The final position is then found by `cumulativeSteps % perimeterLength`.
 *
 * Let's redefine the path generation to be more precise about the sequence of positions and directions.
 *
 * The robot path is essentially a cycle.
 * If width=6, height=3:
 * Path:
 * (0,0) East -> (1,0) East -> (2,0) East -> (3,0) East -> (4,0) East -> (5,0) East (boundary)
 * Turn North.
 * (5,1) North -> (5,2) North (boundary)
 * Turn West.
 * (4,2) West -> (3,2) West -> (2,2) West -> (1,2) West -> (0,2) West (boundary)
 * Turn South.
 * (0,1) South (boundary, but not back to start if it's the first full loop).
 *
 * The crucial observation is that the path is cyclic. We can pre-compute one full cycle of the path.
 * The total length of one cycle is `2 * (width - 1) + 2 * (height - 1)`. However, the starting point (0,0) is counted.
 * A better way to think about the path is the sequence of cells visited.
 *
 * Example: width=6, height=3
 * (0,0) E -> (1,0) E -> (2,0) E -> (3,0) E -> (4,0) E -> (5,0) E
 * (5,1) N -> (5,2) N
 * (4,2) W -> (3,2) W -> (2,2) W -> (1,2) W -> (0,2) W
 * (0,1) S
 *
 * The path list should contain:
 * [ [0,0,"East"], [1,0,"East"], [2,0,"East"], [3,0,"East"], [4,0,"East"], [5,0,"East"],  // width-1 steps East from 0
 *   [5,1,"North"], [5,2,"North"],                                                 // height-1 steps North from 0
 *   [4,2,"West"], [3,2,"West"], [2,2,"West"], [1,2,"West"], [0,2,"West"],            // width-1 steps West from 0
 *   [0,1,"South"]                                                                  // height-2 steps South from 0
 * ]
 *
 * Total cells visited in one loop (excluding the first (0,0) for direction change logic):
 * (width - 1) steps East
 * (height - 1) steps North
 * (width - 1) steps West
 * (height - 2) steps South
 *
 * The total number of "moves" in one full cycle to reach the starting point again is:
 * (width - 1) + (height - 1) + (width - 1) + (height - 1)
 * = 2*(width - 1) + 2*(height - 1)
 * = 2*width - 2 + 2*height - 2
 * = 2*width + 2*height - 4
 *
 * Let's trace the path carefully for `step(num)` and `getPos`/`getDir`.
 *
 * The state needs to be:
 * `currentX`, `currentY`, `currentDirIndex` (0: East, 1: North, 2: West, 3: South)
 *
 * When `step(num)` is called:
 * Simulate `num` steps one by one.
 * For each step:
 *   Calculate the next potential position.
 *   Check for boundary conditions.
 *   If out of bounds:
 *     Turn counterclockwise: `currentDirIndex = (currentDirIndex + 1) % 4`.
 *     Recalculate the next potential position with the new direction.
 *   Update `currentX`, `currentY`.
 *
 * This direct simulation within `step(num)` can be too slow if `num` is large and called many times.
 * The `num` can be up to 10^5, and total calls up to 10^4. Total steps could be 10^9, which is too much for simulation.
 *
 * The cyclic path approach is necessary.
 *
 * Let's define the path as a sequence of (x, y, direction) tuples.
 * The total number of *moves* (not unique cells) to traverse the entire perimeter and return to (0,0) facing East is `2*(width-1) + 2*(height-1)`.
 *
 * Consider width=6, height=3. Perimeter moves = 2*(5) + 2*(2) = 10 + 4 = 14.
 *
 * Path:
 * Initial state: pos=(0,0), dir="East"
 *
 * step(2):
 * (0,0) E -> (1,0) E -> (2,0) E. Final pos=(2,0), dir="East".
 *
 * step(2):
 * (2,0) E -> (3,0) E -> (4,0) E. Final pos=(4,0), dir="East".
 *
 * step(2):
 * (4,0) E -> (5,0) E. Next step East is out of bounds. Turn North.
 * (5,0) N -> (5,1) N. Final pos=(5,1), dir="North".
 *
 * step(1):
 * (5,1) N -> (5,2) N. Final pos=(5,2), dir="North".
 *
 * step(4):
 * (5,2) N. Next step North is out of bounds. Turn West.
 * (5,2) W -> (4,2) W -> (3,2) W -> (2,2) W -> (1,2) W. Final pos=(1,2), dir="West".
 *
 * This simulation implies the state must be `x`, `y`, and `direction`.
 *
 * The key insight for optimization: The robot is always moving along the perimeter. The path is repetitive.
 *
 * Let's define the path segments:
 * 1. East: (0,0) to (width-1, 0). Length: `width - 1`.
 * 2. North: (width-1, 0) to (width-1, height-1). Length: `height - 1`.
 * 3. West: (width-1, height-1) to (0, height-1). Length: `width - 1`.
 * 4. South: (0, height-1) to (0, 0). Length: `height - 1`.
 *
 * Total cells visited *along the perimeter* (including start, excluding end if it's start again for one cycle):
 * (width-1) moves East
 * (height-1) moves North
 * (width-1) moves West
 * (height-1) moves South
 *
 * Total number of steps to complete one full loop and return to (0,0) facing East is `2 * (width - 1) + 2 * (height - 1)`.
 *
 * We need to keep track of the cumulative number of steps taken.
 * Let `cumulativeSteps` be the total steps.
 *
 * `Robot(width, height)`:
 *   `this.width = width`
 *   `this.height = height`
 *   `this.x = 0`
 *   `this.y = 0`
 *   `this.dir = 0` // 0: East, 1: North, 2: West, 3: South
 *   `this.dirs = ["East", "North", "West", "South"]`
 *   `this.dx = [1, 0, -1, 0]`
 *   `this.dy = [0, 1, 0, -1]`
 *   `this.totalSteps = 0` // Cumulative steps taken
 *
 *   // Calculate the perimeter length for one full cycle, starting from (0,0) and returning to it.
 *   // The number of steps to traverse the entire perimeter back to (0,0) is:
 *   // (width-1) East + (height-1) North + (width-1) West + (height-1) South
 *   // = 2 * (width - 1) + 2 * (height - 1)
 *   // This is the effective number of steps in one cycle.
 *   `this.perimeterSteps = 2 * (width - 1) + 2 * (height - 1)`
 *
 * `step(num)`:
 *   `this.totalSteps += num`
 *
 * `getPos()`:
 *   // If totalSteps is 0, it means robot hasn't moved, so it's at (0,0).
 *   // If the perimeterSteps is 0 (e.g., 2x2 grid, but constraints are >= 2), handle that.
 *   // For width=2, height=2: perimeterSteps = 2*(1) + 2*(1) = 4.
 *   // Path: (0,0)E -> (1,0)E -> (1,1)N -> (0,1)W -> (0,0)S (but turns before hitting (0,0) again).
 *   // The effective cycle length is tricky.
 *   // Let's consider the states (pos, dir).
 *
 *   // The robot moves along a fixed path. We need to find its position on that path.
 *   // The number of steps within a cycle.
 *   `const stepsInCycle = this.totalSteps % this.perimeterSteps`
 *
 *   // Now simulate `stepsInCycle` from the origin (0,0) facing East.
 *   `let currentX = 0`
 *   `let currentY = 0`
 *   `let currentDir = 0` // 0: East
 *
 *   `let stepsTaken = 0`
 *   while (stepsTaken < stepsInCycle) {
 *     let moveDist = 0
 *     // Determine how many steps we can take in the current direction before hitting a boundary
 *     if (currentDir === 0) { // East
 *       moveDist = this.width - 1 - currentX
 *     } else if (currentDir === 1) { // North
 *       moveDist = this.height - 1 - currentY
 *     } else if (currentDir === 2) { // West
 *       moveDist = currentX // Moving West, distance to boundary is currentX
 *     } else { // South
 *       moveDist = currentY // Moving South, distance to boundary is currentY
 *     }
 *
 *     // Calculate how many steps we *actually* take in this segment
 *     const canTake = Math.min(moveDist, stepsInCycle - stepsTaken)
 *
 *     // Update position based on `canTake` steps
 *     currentX += this.dx[currentDir] * canTake
 *     currentY += this.dy[currentDir] * canTake
 *     stepsTaken += canTake
 *
 *     // If we have completed the required steps for the cycle, break.
 *     if (stepsTaken === stepsInCycle) {
 *       break
 *     }
 *
 *     // If we hit a boundary and still have steps left, turn.
 *     // This happens when `canTake === moveDist` AND `stepsTaken < stepsInCycle`.
 *     // If `moveDist === 0` (already at boundary) AND `stepsTaken < stepsInCycle`, we still need to turn.
 *     if (moveDist === canTake) {
 *       currentDir = (currentDir + 1) % 4
 *     }
 *   }
 *
 *   // Special case: If totalSteps is 0, robot is at (0,0).
 *   // If perimeterSteps is 0 (e.g. 1x1 grid which is not allowed by constraints, but for safety),
 *   // and totalSteps is 0, it's at (0,0). If totalSteps > 0, it's also at (0,0) because it can't move.
 *   // For 2x2 grid, perimeterSteps is 4.
 *   // Initial state (0,0) East. totalSteps=0.
 *   // step(1): totalSteps=1. stepsInCycle=1%4=1. Simulate 1 step.
 *   //   currentX=0, currentY=0, currentDir=0(E). moveDist=width-1-0=1. canTake=min(1, 1-0)=1.
 *   //   currentX += 1*1 = 1. currentY += 0*1 = 0. stepsTaken=1. Break. Pos=(1,0).
 *   // step(1): totalSteps=2. stepsInCycle=2%4=2. Simulate 2 steps.
 *   //   currentX=0, currentY=0, currentDir=0(E). moveDist=1. canTake=min(1, 2-0)=1.
 *   //   currentX=1, currentY=0. stepsTaken=1.
 *   //   Now at (1,0), dir=0(E). Need 1 more step. moveDist=width-1-currentX=1-1=0.
 *   //   Oh, this calculation of moveDist is tricky.
 *
 *   // Let's refine the `stepsInCycle` simulation.
 *   // The logic for `moveDist` needs to be based on the *current* position in the simulation *within* `getPos`.
 *   // The problem states robot is *initially* at (0,0) facing East.
 *   // `totalSteps` is the total number of unit steps taken.
 *
 *   // The actual starting point for `getPos` simulation should be (0,0) facing East.
 *   // The loop should simulate `stepsInCycle` steps.
 *
 *   // Example: width=6, height=3. perimeterSteps = 2*(5) + 2*(2) = 14.
 *   // step(2) -> totalSteps=2. stepsInCycle=2.
 *   //   sim_x=0, sim_y=0, sim_dir=0(E). steps_rem=2.
 *   //   Dir E: boundary is x=5. Max steps East from 0 is 5.
 *   //   Steps to take in this segment: min(5, 2) = 2.
 *   //   sim_x += 1*2 = 2. sim_y += 0*2 = 0. steps_rem -= 2 = 0.
 *   //   Break. Final pos (2,0). Correct.
 *
 *   // step(2) -> totalSteps=4. stepsInCycle=4.
 *   //   sim_x=0, sim_y=0, sim_dir=0(E). steps_rem=4.
 *   //   Dir E: boundary x=5. Max steps East from 0 is 5.
 *   //   Steps to take: min(5, 4) = 4.
 *   //   sim_x += 1*4 = 4. sim_y += 0*4 = 0. steps_rem -= 4 = 0.
 *   //   Break. Final pos (4,0). Correct.
 *
 *   // step(2) -> totalSteps=6. stepsInCycle=6.
 *   //   sim_x=0, sim_y=0, sim_dir=0(E). steps_rem=6.
 *   //   Dir E: boundary x=5. Max steps East from 0 is 5.
 *   //   Steps to take: min(5, 6) = 5.
 *   //   sim_x += 1*5 = 5. sim_y += 0*5 = 0. steps_rem -= 5 = 1.
 *   //   At (5,0), dir=0(E), steps_rem=1. Hit boundary (x=5).
 *   //   Turn North. sim_dir = 1.
 *   //   Dir N: boundary y=2. Max steps North from 0 is 2.
 *   //   Steps to take: min(2, 1) = 1.
 *   //   sim_x += 0*1 = 5. sim_y += 1*1 = 1. steps_rem -= 1 = 0.
 *   //   Break. Final pos (5,1). Correct.
 *
 *   // step(1) -> totalSteps=7. stepsInCycle=7.
 *   //   sim_x=0, sim_y=0, sim_dir=0(E). steps_rem=7.
 *   //   Dir E: max steps 5. Take 5.
 *   //   sim_x=5, sim_y=0. steps_rem=2.
 *   //   Turn North. sim_dir=1.
 *   //   Dir N: boundary y=2. Max steps North from 0 is 2.
 *   //   Steps to take: min(2, 2) = 2.
 *   //   sim_x += 0*2 = 5. sim_y += 1*2 = 2. steps_rem -= 2 = 0.
 *   //   Break. Final pos (5,2). Correct.
 *
 *   // step(4) -> totalSteps=11. stepsInCycle=11.
 *   //   sim_x=0, sim_y=0, sim_dir=0(E). steps_rem=11.
 *   //   Dir E: max steps 5. Take 5.
 *   //   sim_x=5, sim_y=0. steps_rem=6.
 *   //   Turn North. sim_dir=1.
 *   //   Dir N: max steps 2. Take 2.
 *   //   sim_x=5, sim_y=2. steps_rem=4.
 *   //   Turn West. sim_dir=2.
 *   //   Dir W: boundary x=0. Max steps West from 5 is 5.
 *   //   Steps to take: min(5, 4) = 4.
 *   //   sim_x += -1*4 = 1. sim_y += 0*4 = 2. steps_rem -= 4 = 0.
 *   //   Break. Final pos (1,2). Correct.
 *
 *   // The simulation logic seems correct now.
 *
 *   // Handle the special case: If the robot has taken 0 total steps, it is at (0,0) facing East.
 *   // The `stepsInCycle` will be 0. The loop `while (stepsTaken < stepsInCycle)` will not run.
 *   // So `currentX=0, currentY=0, currentDir=0` will be the result.
 *   // This is correct for `getPos()` and `getDir()` when `totalSteps` is 0.
 *
 *   // The problem states `2 <= width, height`. So `width-1 >= 1` and `height-1 >= 1`.
 *   // This means `perimeterSteps = 2*(w-1) + 2*(h-1) >= 2*1 + 2*1 = 4`.
 *   // So `perimeterSteps` will never be 0.
 *
 *   // The edge case `stepsInCycle === 0` means `totalSteps` is a multiple of `perimeterSteps`.
 *   // This implies the robot has completed full cycles and is back at its initial position *before* the start of a new cycle.
 *   // However, the simulation logic `while (stepsTaken < stepsInCycle)` correctly handles `stepsInCycle = 0` by not entering the loop,
 *   // thus returning `currentX=0, currentY=0, currentDir=0`. This is the correct state after completing full cycles and before taking the first step of the next.
 *   // The direction will be East.
 *
 *   `getDir()`:
 *     // We already computed the final `currentDir` in `getPos`.
 *     // To avoid recomputing, we can store the `currentDir` and `currentX`, `currentY` after `step`.
 *     // Or, just recompute it.
 *     `const stepsInCycle = this.totalSteps % this.perimeterSteps`
 *     if (this.totalSteps === 0) { // If no steps taken, initial state is (0,0) East.
 *       return "East";
 *     }
 *
 *     `let currentX = 0`
 *     `let currentY = 0`
 *     `let currentDir = 0` // 0: East
 *
 *     `let stepsTaken = 0`
 *     while (stepsTaken < stepsInCycle) {
 *       let moveDist = 0
 *       if (currentDir === 0) { // East
 *         moveDist = this.width - 1 - currentX
 *       } else if (currentDir === 1) { // North
 *         moveDist = this.height - 1 - currentY
 *       } else if (currentDir === 2) { // West
 *         moveDist = currentX
 *       } else { // South
 *         moveDist = currentY
 *       }
 *
 *       // If `moveDist` is 0 and we still need to move (`stepsInCycle > stepsTaken`), it means we are at a boundary point and need to turn.
 *       // This can happen if `stepsInCycle` lands us exactly on a corner.
 *       // Example: width=2, height=2. perimeterSteps = 4.
 *       // Path: (0,0)E -> (1,0)E -> (1,1)N -> (0,1)W -> (0,0)S (conceptual end of loop)
 *       // (0,0)E, steps_rem = 4
 *       // Dir E: bound x=1. max steps = 1. canTake=min(1, 4)=1.
 *       // curX=1, curY=0, stepsTaken=1. steps_rem=3.
 *       // (1,0), dir=E. Hit bound. Turn N. curDir=1.
 *       // Dir N: bound y=1. max steps = 1. canTake=min(1, 3)=1.
 *       // curX=1, curY=1, stepsTaken=2. steps_rem=2.
 *       // (1,1), dir=N. Hit bound. Turn W. curDir=2.
 *       // Dir W: bound x=0. max steps = 1. canTake=min(1, 2)=1.
 *       // curX=0, curY=1, stepsTaken=3. steps_rem=1.
 *       // (0,1), dir=W. Hit bound. Turn S. curDir=3.
 *       // Dir S: bound y=0. max steps = 1. canTake=min(1, 1)=1.
 *       // curX=0, curY=0, stepsTaken=4. steps_rem=0.
 *       // Break. Final pos (0,0), dir=S.
 *       // This simulation gives (0,0) South.
 *       // However, the problem example shows after step(4) for Robot(6,3), it gets pos [1,2] dir "West".
 *       // My `perimeterSteps` for 6x3 is 14.
 *       // step(4) -> totalSteps=11. stepsInCycle=11.
 *       // My simulation for 11 steps resulted in [1,2] West.
 *       // The direction from the example for [1,2] is "West".
 *       // So the direction returned by `getDir()` should correspond to the direction *after* the last move that lands the robot at `getPos()`.
 *       // My simulation correctly calculates this `currentDir` which will be the direction the robot is facing *at* that final `currentX, currentY`.
 *
 *       // IMPORTANT: If `stepsInCycle` is 0, it means we completed full loops. The robot is at (0,0) and facing East.
 *       // This is handled by `this.totalSteps === 0` check.
 *       // If `this.totalSteps` is a multiple of `perimeterSteps` but not 0, `stepsInCycle` will be 0.
 *       // The loop `while (stepsTaken < stepsInCycle)` won't run.
 *       // So `currentX=0, currentY=0, currentDir=0` are returned. This means (0,0) East.
 *       // This seems correct for completing full cycles.
 *
 *       // Special handling for `moveDist = 0` when `stepsInCycle > stepsTaken`.
 *       // This occurs at corners. E.g., at (width-1, 0) facing East. `moveDist` is 0.
 *       // The logic should be: if `stepsTaken` is still less than `stepsInCycle` AFTER taking `canTake` steps, and `canTake` was equal to `moveDist`, then we must turn.
 *       // If `canTake < moveDist`, it means we stopped *before* hitting a boundary, so we don't turn yet.
 *
 *       // Let's rethink the `moveDist` calculation.
 *       // `moveDist` should be the number of unit steps possible in the current direction from the current simulated position until a boundary is hit.
 *       let stepsPossibleInDir;
 *       if (currentDir === 0) { // East
 *         stepsPossibleInDir = this.width - 1 - currentX;
 *       } else if (currentDir === 1) { // North
 *         stepsPossibleInDir = this.height - 1 - currentY;
 *       } else if (currentDir === 2) { // West
 *         stepsPossibleInDir = currentX; // Distance to x=0 is currentX
 *       } else { // South
 *         stepsPossibleInDir = currentY; // Distance to y=0 is currentY
 *       }
 *
 *       // Number of steps to take in this iteration:
 *       // It's either the number of steps remaining in the cycle (`stepsInCycle - stepsTaken`)
 *       // or the number of steps until the boundary (`stepsPossibleInDir`), whichever is smaller.
 *       const stepsToTakeInSegment = Math.min(stepsPossibleInDir, stepsInCycle - stepsTaken);
 *
 *       // Update position
 *       currentX += this.dx[currentDir] * stepsToTakeInSegment;
 *       currentY += this.dy[currentDir] * stepsToTakeInSegment;
 *       stepsTaken += stepsToTakeInSegment;
 *
 *       // If we have taken exactly the number of steps needed for the cycle, break.
 *       if (stepsTaken === stepsInCycle) {
 *         break;
 *       }
 *
 *       // If we took all possible steps in this direction segment (`stepsToTakeInSegment === stepsPossibleInDir`)
 *       // and we still have steps left to complete the cycle (`stepsTaken < stepsInCycle`),
 *       // it means we hit a boundary, so we need to turn.
 *       // The `stepsPossibleInDir` might be 0 if we are already at a boundary.
 *       // If `stepsPossibleInDir` is 0 and we still need to move, we must turn.
 *       // The condition `stepsToTakeInSegment === stepsPossibleInDir` correctly covers this.
 *       // If `stepsPossibleInDir` was 0, then `stepsToTakeInSegment` must be 0.
 *       // In this case, `stepsTaken` would not increase, and we would loop infinitely if we don't turn.
 *       // So, if `stepsToTakeInSegment` is 0 (because `stepsPossibleInDir` is 0) AND `stepsInCycle > stepsTaken`, we must turn.
 *       // This is implicitly handled by the fact that `stepsToTakeInSegment` will be 0, and `stepsTaken` won't advance.
 *       // The only way to advance `stepsTaken` is to increase `stepsToTakeInSegment`.
 *       // If `stepsPossibleInDir` is 0, `stepsToTakeInSegment` is 0.
 *       // If `stepsInCycle - stepsTaken` is also 0, we break.
 *       // If `stepsInCycle - stepsTaken > 0` but `stepsPossibleInDir` is 0, we are stuck at a boundary.
 *       // This implies we must turn.
 *       // The condition should be: if `stepsToTakeInSegment` advanced us to a boundary AND we still need to move.
 *       // More simply: if `stepsToTakeInSegment == stepsPossibleInDir` AND `stepsTaken < stepsInCycle`.
 *       // This implies we completed a segment and need to continue.
 *       // The check `stepsToTakeInSegment === stepsPossibleInDir` is the correct trigger to turn.
 *       if (stepsToTakeInSegment === stepsPossibleInDir) {
 *         currentDir = (currentDir + 1) % 4;
 *       }
 *     }
 *
 *     // After the loop, `currentDir` holds the final direction.
 *     return this.dirs[currentDir];
 *
 *
 * `getPos()`:
 *   // Need to re-simulate the path to get the final X and Y coordinates.
 *   // The simulation logic is identical to `getDir`, but we return `[currentX, currentY]`.
 *   // This means the `getPos` and `getDir` methods will both perform a simulation.
 *   // This is acceptable given the constraints.
 *   // If `totalSteps` is 0, it's (0,0).
 *   if (this.totalSteps === 0) {
 *     return [0, 0];
 *   }
 *
 *   // Calculate effective steps in one cycle.
 *   // If `this.perimeterSteps` is 0, it's an invalid grid (but constraints prevent this).
 *   // If `this.totalSteps` is a multiple of `this.perimeterSteps`, `stepsInCycle` is 0.
 *   // The simulation loop will not run, `currentX=0, currentY=0`. This is correct.
 *   const stepsInCycle = this.totalSteps % this.perimeterSteps;
 *
 *   let currentX = 0;
 *   let currentY = 0;
 *   let currentDir = 0; // 0: East
 *
 *   let stepsTaken = 0;
 *   while (stepsTaken < stepsInCycle) {
 *     let stepsPossibleInDir;
 *     if (currentDir === 0) { // East
 *       stepsPossibleInDir = this.width - 1 - currentX;
 *     } else if (currentDir === 1) { // North
 *       stepsPossibleInDir = this.height - 1 - currentY;
 *     } else if (currentDir === 2) { // West
 *       stepsPossibleInDir = currentX;
 *     } else { // South
 *       stepsPossibleInDir = currentY;
 *     }
 *
 *     const stepsToTakeInSegment = Math.min(stepsPossibleInDir, stepsInCycle - stepsTaken);
 *
 *     currentX += this.dx[currentDir] * stepsToTakeInSegment;
 *     currentY += this.dy[currentDir] * stepsToTakeInSegment;
 *     stepsTaken += stepsToTakeInSegment;
 *
 *     if (stepsTaken === stepsInCycle) {
 *       break;
 *     }
 *
 *     // If we completed a segment and still have steps left, turn.
 *     // `stepsPossibleInDir` could be 0 if we are already at a boundary.
 *     // If `stepsToTakeInSegment` is 0 (because `stepsPossibleInDir` is 0) AND we still need to move, we must turn.
 *     // This logic `stepsToTakeInSegment === stepsPossibleInDir` is crucial.
 *     // If `stepsToTakeInSegment` is 0 (because `stepsPossibleInDir` is 0), this condition is met.
 *     // This means we are at a corner or edge and need to change direction.
 *     if (stepsToTakeInSegment === stepsPossibleInDir) {
 *       currentDir = (currentDir + 1) % 4;
 *     }
 *   }
 *
 *   return [currentX, currentY];
 *
 *
 * Time Complexity:
 * - `Robot(width, height)`: O(1) - initialization is constant time.
 * - `step(num)`: O(1) - simply adds `num` to `totalSteps`.
 * - `getPos()`: O(width + height) - In the worst case, `stepsInCycle` can be up to `2*(width-1) + 2*(height-1)`, which is proportional to `width + height`. The simulation loop iterates at most `width + height` times.
 * - `getDir()`: O(width + height) - Similar to `getPos()`.
 *
 * The total number of calls to `step` is at most `10^4`. The number of calls to `getPos`/`getDir` is also bounded.
 * The dominant factor is the `getPos`/`getDir` calls. If there are `N_pos_dir` calls to `getPos` or `getDir`, the total time complexity is O(N_pos_dir * (width + height)).
 * Given `width, height <= 100`, this is `O(N_pos_dir * 200)`, which is efficient enough.
 *
 * Space Complexity:
 * - O(1) - The robot class stores a fixed number of variables regardless of input size.
 *
 * The constraint `At most 10^4 calls in total will be made to step, getPos, and getDir.` means `N_pos_dir` is at most `10^4`.
 * So total time is roughly `10^4 * 200`, which is `2 * 10^6` operations, well within typical time limits.
 */

/**
 * @constructor
 * @param {number} width The width of the grid.
 * @param {number} height The height of the grid.
 */
var Robot = function(width, height) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    // 0: East, 1: North, 2: West, 3: South
    this.dirIndex = 0;
    this.directions = ["East", "North", "West", "South"];
    // Changes in x and y for each direction
    this.dx = [1, 0, -1, 0];
    this.dy = [0, 1, 0, -1];

    // totalSteps keeps track of the cumulative number of unit steps taken by the robot.
    this.totalSteps = 0;

    // Calculate the number of steps to complete one full cycle along the perimeter.
    // This is the sum of steps taken moving East, North, West, and South to return to the origin.
    // Example: 2x2 grid. Width=2, Height=2. PerimeterSteps = 2*(2-1) + 2*(2-1) = 2*1 + 2*1 = 4.
    // Path: (0,0)E -> (1,0)E (1 step). Hit boundary.
    // Turn North. (1,0)N -> (1,1)N (1 step). Hit boundary.
    // Turn West. (1,1)W -> (0,1)W (1 step). Hit boundary.
    // Turn South. (0,1)S -> (0,0)S (1 step). Back to origin conceptually.
    // Total steps in a cycle = 4.
    this.perimeterSteps = 2 * (width - 1) + 2 * (height - 1);
};

/**
 * @param {number} num The number of steps to move.
 * @return {void}
 */
Robot.prototype.step = function(num) {
    // Accumulate the total steps taken.
    this.totalSteps += num;
};

/**
 * @return {number[]} The current position [x, y] of the robot.
 */
Robot.prototype.getPos = function() {
    // If no steps have been taken, the robot is at its initial position (0, 0).
    if (this.totalSteps === 0) {
        return [0, 0];
    }

    // Calculate the effective number of steps within a single cycle.
    // `totalSteps % perimeterSteps` gives the position on the cyclical path.
    // If `perimeterSteps` is 0 (which shouldn't happen given constraints 2 <= width, height),
    // this would cause issues, but constraints prevent it.
    // If `totalSteps` is a multiple of `perimeterSteps` (and not 0), `stepsInCycle` will be 0.
    // This correctly implies the robot has completed full cycles and is back at the start of a cycle.
    const stepsInCycle = this.totalSteps % this.perimeterSteps;

    // Simulate the robot's movement for `stepsInCycle` steps, starting from (0,0) facing East.
    let currentX = 0;
    let currentY = 0;
    let currentDirIndex = 0; // Start facing East.

    let stepsTaken = 0;
    // Loop until all `stepsInCycle` are accounted for.
    while (stepsTaken < stepsInCycle) {
        let stepsPossibleInDir; // How many steps can be taken in the current direction before hitting a boundary.

        // Determine the maximum number of steps possible in the current direction.
        if (currentDirIndex === 0) { // East
            // Distance to the right boundary (width - 1) from the current x.
            stepsPossibleInDir = this.width - 1 - currentX;
        } else if (currentDirIndex === 1) { // North
            // Distance to the top boundary (height - 1) from the current y.
            stepsPossibleInDir = this.height - 1 - currentY;
        } else if (currentDirIndex === 2) { // West
            // Distance to the left boundary (0) from the current x.
            stepsPossibleInDir = currentX;
        } else { // South
            // Distance to the bottom boundary (0) from the current y.
            stepsPossibleInDir = currentY;
        }

        // The number of steps to take in this segment is the minimum of:
        // 1. The remaining steps needed to complete the cycle (`stepsInCycle - stepsTaken`).
        // 2. The maximum steps possible in the current direction before hitting a boundary (`stepsPossibleInDir`).
        const stepsToTakeInSegment = Math.min(stepsPossibleInDir, stepsInCycle - stepsTaken);

        // Update the robot's position by taking `stepsToTakeInSegment` steps.
        currentX += this.dx[currentDirIndex] * stepsToTakeInSegment;
        currentY += this.dy[currentDirIndex] * stepsToTakeInSegment;
        stepsTaken += stepsToTakeInSegment;

        // If we have taken exactly `stepsInCycle` steps, we have found the final position.
        if (stepsTaken === stepsInCycle) {
            break;
        }

        // If `stepsToTakeInSegment` was equal to `stepsPossibleInDir`, it means we hit a boundary
        // (or `stepsPossibleInDir` was 0, meaning we were already at a boundary and needed to turn).
        // Since we still have `stepsTaken < stepsInCycle`, we must turn to continue moving.
        if (stepsToTakeInSegment === stepsPossibleInDir) {
            // Turn 90 degrees counterclockwise.
            currentDirIndex = (currentDirIndex + 1) % 4;
        }
    }

    // Return the final [x, y] position.
    return [currentX, currentY];
};

/**
 * @return {string} The current direction of the robot.
 */
Robot.prototype.getDir = function() {
    // If no steps have been taken, the robot is at its initial direction ("East").
    if (this.totalSteps === 0) {
        return "East";
    }

    // Calculate the effective number of steps within a single cycle.
    const stepsInCycle = this.totalSteps % this.perimeterSteps;

    // Simulate the robot's movement for `stepsInCycle` steps to find its final direction.
    let currentX = 0;
    let currentY = 0;
    let currentDirIndex = 0; // Start facing East.

    let stepsTaken = 0;
    // Loop until all `stepsInCycle` are accounted for.
    while (stepsTaken < stepsInCycle) {
        let stepsPossibleInDir; // How many steps can be taken in the current direction before hitting a boundary.

        // Determine the maximum number of steps possible in the current direction.
        if (currentDirIndex === 0) { // East
            stepsPossibleInDir = this.width - 1 - currentX;
        } else if (currentDirIndex === 1) { // North
            stepsPossibleInDir = this.height - 1 - currentY;
        } else if (currentDirIndex === 2) { // West
            stepsPossibleInDir = currentX;
        } else { // South
            stepsPossibleInDir = currentY;
        }

        // The number of steps to take in this segment is the minimum of remaining steps needed and steps possible in direction.
        const stepsToTakeInSegment = Math.min(stepsPossibleInDir, stepsInCycle - stepsTaken);

        // Update robot's position (although we only care about direction here, position is needed to check boundaries).
        currentX += this.dx[currentDirIndex] * stepsToTakeInSegment;
        currentY += this.dy[currentDirIndex] * stepsToTakeInSegment;
        stepsTaken += stepsToTakeInSegment;

        // If we have taken exactly `stepsInCycle` steps, `currentDirIndex` is the final direction.
        if (stepsTaken === stepsInCycle) {
            break;
        }

        // If we completed a segment and still have steps left, we must turn.
        // This happens when `stepsToTakeInSegment` equals `stepsPossibleInDir`.
        if (stepsToTakeInSegment === stepsPossibleInDir) {
            // Turn 90 degrees counterclockwise.
            currentDirIndex = (currentDirIndex + 1) % 4;
        }
    }

    // Return the final direction string.
    return this.directions[currentDirIndex];
};
```