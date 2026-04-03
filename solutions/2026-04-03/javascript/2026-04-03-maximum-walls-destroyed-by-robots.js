/*
Problem Summary:
Given robot positions and their bullet distances, and wall positions, find the maximum number of unique walls that can be destroyed. Robots can shoot left or right, but their bullets stop if they hit another robot before reaching maximum distance.

Problem Link:
https://leetcode.com/problems/maximum-walls-destroyed-by-robots/

Approach Explanation:
The problem asks for the maximum number of *unique* walls destroyed. Each robot can shoot either left or right. The crucial rule is that a bullet stops if it hits another robot. This means for each robot's shot, we need to determine its effective range, which might be shorter than its `distance[i]` due to an obstructing robot.

1.  **Preprocessing Robots:**
    -   Combine `robots` and `distance` into an array of objects `{pos: robots[i], dist: distance[i]}`.
    -   Sort this array `robotInfo` by robot `pos` in ascending order. This allows us to quickly find the nearest robots to the left and right.

2.  **Determine Effective Shot Ranges:**
    -   For each robot `k` in the sorted `robotInfo`:
        -   **Left Shot:** The theoretical left range is `[robotInfo[k].pos - robotInfo[k].dist, robotInfo[k].pos]`.
            -   Check if there's an obstructing robot to its left (`robotInfo[k-1]`). If `robotInfo[k-1].pos` is within the theoretical range (i.e., `robotInfo[k-1].pos >= robotInfo[k].pos - robotInfo[k].dist`), then the effective left range becomes `[robotInfo[k-1].pos, robotInfo[k].pos]`. Otherwise, it's the full theoretical range.
        -   **Right Shot:** The theoretical right range is `[robotInfo[k].pos, robotInfo[k].pos + robotInfo[k].dist]`.
            -   Check if there's an obstructing robot to its right (`robotInfo[k+1]`). If `robotInfo[k+1].pos` is within the theoretical range (i.e., `robotInfo[k+1].pos <= robotInfo[k].pos + robotInfo[k].dist`), then the effective right range becomes `[robotInfo[k].pos, robotInfo[k+1].pos]`. Otherwise, it's the full theoretical range.
    -   Each effective range `[start, end]` represents an interval where walls can be destroyed.

3.  **Sweep Line Algorithm:**
    -   Collect all "events":
        -   For each effective range `[start, end]`: add `(start, 'start')` and `(end, 'end')` events.
        -   For each `wall_pos` in `walls`: add `(wall_pos, 'wall')` event.
    -   Sort all events primarily by their `coord` (position). If coordinates are equal, apply a secondary sort order: 'start' events first, then 'wall' events, then 'end' events. This ensures that intervals become active *before* walls at the same position are considered, and walls are considered *before* intervals become inactive at the same position.
    -   Iterate through the sorted events:
        -   Maintain a counter `active_intervals` which represents how many destruction ranges are currently active.
        -   When a 'start' event is encountered, increment `active_intervals`.
        -   When an 'end' event is encountered, decrement `active_intervals`.
        -   When a 'wall' event is encountered: if `active_intervals > 0`, it means this wall is covered by at least one active bullet path. Add its position to a `Set` to count unique destroyed walls.

4.  **Result:** The size of the `Set` of destroyed walls is the maximum number of unique walls destroyed.

Time Complexity:
-   Sorting `robotInfo`: O(N log N), where N is `robots.length`.
-   Generating events: O(N) for robot shots, O(M) for walls. Total events E = O(N + M).
-   Sorting events: O(E log E) = O((N + M) log (N + M)).
-   Sweep line pass: O(E) = O(N + M). Each set `add` operation is O(1) on average.
-   Overall Time Complexity: O((N + M) log (N + M)). Given N, M <= 10^5, this is efficient enough.

Space Complexity:
-   `robotInfo` array: O(N).
-   `events` array: O(N + M).
-   `destroyed_walls_set`: O(M) in the worst case (all walls are destroyed).
-   Overall Space Complexity: O(N + M).
*/

/**
 * @param {number[]} robots
 * @param {number[]} distance
 * @param {number[]} walls
 * @return {number}
 */
var maximumWallsDestroyedByRobots = function(robots, distance, walls) {
    // Step 1: Preprocessing Robots
    // Create an array of robot objects and sort them by position.
    // This allows efficient lookup of adjacent robots for obstruction checks.
    const robotInfo = [];
    for (let i = 0; i < robots.length; i++) {
        robotInfo.push({ pos: robots[i], dist: distance[i] });
    }
    robotInfo.sort((a, b) => a.pos - b.pos);

    // Step 2 & 3: Determine Effective Shot Ranges and Collect Events
    // Create an array to store all sweep line events.
    // Events are { coord: number, type: 'start' | 'end' | 'wall' }.
    const events = [];

    // Add events for each robot's shots
    for (let i = 0; i < robotInfo.length; i++) {
        const P = robotInfo[i].pos;
        const D = robotInfo[i].dist;

        // Calculate effective range for shooting left
        let leftEffectiveEnd = P - D;
        // If there's a robot to the left (i > 0) and it's within the bullet's theoretical range,
        // the bullet stops at that robot's position.
        if (i > 0 && robotInfo[i - 1].pos >= leftEffectiveEnd) {
            leftEffectiveEnd = robotInfo[i - 1].pos;
        }
        // Add events for the left shot interval [leftEffectiveEnd, P]
        events.push({ coord: leftEffectiveEnd, type: 'start' });
        events.push({ coord: P, type: 'end' });

        // Calculate effective range for shooting right
        let rightEffectiveEnd = P + D;
        // If there's a robot to the right (i < robotInfo.length - 1) and it's within the bullet's theoretical range,
        // the bullet stops at that robot's position.
        if (i < robotInfo.length - 1 && robotInfo[i + 1].pos <= rightEffectiveEnd) {
            rightEffectiveEnd = robotInfo[i + 1].pos;
        }
        // Add events for the right shot interval [P, rightEffectiveEnd]
        events.push({ coord: P, type: 'start' });
        events.push({ coord: rightEffectiveEnd, type: 'end' });
    }

    // Add events for each wall
    for (const wallPos of walls) {
        events.push({ coord: wallPos, type: 'wall' });
    }

    // Sort events for the sweep line algorithm.
    // Primary sort key: coordinate.
    // Secondary sort key (for same coordinate): 'start' (0), then 'wall' (1), then 'end' (2).
    // This order ensures:
    // 1. Intervals starting at 'X' become active.
    // 2. Walls at 'X' are processed while intervals starting at 'X' are active.
    // 3. Intervals ending at 'X' become inactive after walls at 'X' are processed.
    const typeOrder = { 'start': 0, 'wall': 1, 'end': 2 };
    events.sort((a, b) => {
        if (a.coord !== b.coord) {
            return a.coord - b.coord;
        }
        return typeOrder[a.type] - typeOrder[b.type];
    });

    // Initialize sweep line variables
    let activeIntervals = 0; // Counts how many bullet ranges are currently active
    const destroyedWalls = new Set(); // Stores unique positions of destroyed walls

    // Step 4: Sweep Line Algorithm
    for (const event of events) {
        if (event.type === 'start') {
            activeIntervals++;
        } else if (event.type === 'end') {
            activeIntervals--;
        } else if (event.type === 'wall') {
            // If there's at least one active interval, this wall is hit.
            if (activeIntervals > 0) {
                destroyedWalls.add(event.coord);
            }
        }
    }

    // The result is the number of unique walls stored in the set.
    return destroyedWalls.size;
};