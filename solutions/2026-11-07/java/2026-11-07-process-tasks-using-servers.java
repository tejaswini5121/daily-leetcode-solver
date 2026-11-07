```java
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Comparator;
import java.util.Arrays;

class Solution {
    /**
     * Problem Summary: Assign tasks to servers based on availability and server properties,
     * prioritizing free servers with the lowest weight and index, and handling task
     * queueing when no servers are free.
     * Link: https://leetcode.com/problems/process-tasks-using-servers/
     *
     * Approach:
     * This problem can be solved using two priority queues:
     * 1. `freeServers`: Stores available servers. Each element in this queue will be a pair `(weight, index)`.
     *    It's prioritized by server weight (ascending), then server index (ascending).
     * 2. `busyServers`: Stores servers that are currently processing tasks. Each element will be a pair `(free_time, server_info)`.
     *    `server_info` is again `(weight, index)`. This queue is prioritized by `free_time` (ascending).
     *
     * We simulate the time progression. At each second `t`:
     * - First, check `busyServers` to see if any servers become free at time `t`. If so, move them back to `freeServers`.
     * - Then, if there are tasks waiting in the `taskQueue` and `freeServers` is not empty, assign tasks.
     *   A task is assigned to the server at the top of `freeServers`. The server is then moved to `busyServers` with its `free_time` calculated as `t + task_duration`.
     * - If there are no free servers but tasks are waiting, we simply wait for the next server to become free.
     * - New tasks are introduced at their respective seconds.
     *
     * Time Complexity: O((N+M) log N), where N is the number of servers and M is the number of tasks.
     * For each task, we might do a log N operation for inserting/removing from priority queues.
     * The total number of tasks processed is M. The number of server state changes is also related to M.
     *
     * Space Complexity: O(N + M), for storing free servers, busy servers, and the task queue.
     */
    public int[] getAssignment(int[] servers, int[] tasks) {
        int n = servers.length;
        int m = tasks.length;
        int[] ans = new int[m];

        // Priority queue for free servers: ordered by weight then index
        // Each element is an array: {server_weight, server_index}
        PriorityQueue<int[]> freeServers = new PriorityQueue<>(
                Comparator.<int[], Integer>comparing(arr -> arr[0]) // Compare by weight
                        .thenComparing(arr -> arr[1]) // Then by index
        );

        // Initialize free servers
        for (int i = 0; i < n; i++) {
            freeServers.offer(new int[]{servers[i], i});
        }

        // Priority queue for busy servers: ordered by free time
        // Each element is an array: {free_time, server_weight, server_index}
        PriorityQueue<int[]> busyServers = new PriorityQueue<>(
                Comparator.comparingInt(arr -> arr[0]) // Compare by free_time
        );

        // Queue for tasks waiting to be processed.
        // Stores task duration. Tasks are added to this queue chronologically.
        // Using a LinkedList as a Queue for simplicity here to simulate task arrival at specific times.
        // In a more optimized solution, we could manage task arrival within the main loop.
        // For this problem, since tasks are introduced at second j, we can process tasks based on current time.
        // Let's use a pointer `taskIndex` to track the next task to be added.
        int taskIndex = 0;
        long currentTime = 0; // Use long to avoid potential overflow for time calculations

        // Loop until all tasks are assigned
        while (taskIndex < m || !busyServers.isEmpty()) {

            // 1. Move servers that have finished their tasks from busyServers to freeServers
            while (!busyServers.isEmpty() && busyServers.peek()[0] <= currentTime) {
                int[] finishedServerInfo = busyServers.poll();
                // The server info is {free_time, server_weight, server_index}
                // We need to re-add {server_weight, server_index} to freeServers
                freeServers.offer(new int[]{finishedServerInfo[1], finishedServerInfo[2]});
            }

            // 2. Assign tasks to available servers
            // While there are free servers and tasks waiting to be assigned at the current time or earlier
            while (taskIndex < m && currentTime >= taskIndex && !freeServers.isEmpty()) {
                // Get the best available server (lowest weight, then lowest index)
                int[] serverToAssign = freeServers.poll();
                int serverWeight = serverToAssign[0];
                int serverIndex = serverToAssign[1];

                // Assign the current task (taskIndex) to this server
                ans[taskIndex] = serverIndex;

                // Calculate when this server will be free again
                long freeTime = currentTime + tasks[taskIndex];

                // Add the server to the busyServers queue
                busyServers.offer(new int[]{
                        (int) freeTime, // Cast back to int as per constraints, though long was used for calculation
                        serverWeight,
                        serverIndex
                });

                // Move to the next task
                taskIndex++;
            }

            // 3. Advance time
            if (freeServers.isEmpty()) {
                // If no free servers, we must wait for a server to become free.
                // Advance currentTime to the time the next server becomes free.
                if (!busyServers.isEmpty()) {
                    currentTime = busyServers.peek()[0];
                } else {
                    // This case should ideally not happen if taskIndex < m, as some task must be processed.
                    // If busyServers is also empty and freeServers is empty, it means all servers are busy and no tasks are waiting.
                    // We might need to jump to the time the next task arrives if taskIndex < m.
                    // Given the problem constraints and logic, if freeServers is empty and busyServers is empty, it implies we are waiting for the next task.
                    // The task arrival logic `currentTime >= taskIndex` handles this implicitly.
                    // If no servers are free AND no tasks are available to process at `currentTime`, we need to advance time to the next task's arrival time.
                    // However, the problem states tasks are inserted at second j. So if currentTime < taskIndex, we need to advance currentTime.
                    if (taskIndex < m) {
                        currentTime = Math.max(currentTime, taskIndex); // Ensure we don't go backward in time and process tasks as they arrive.
                    } else {
                        // All tasks processed, and servers are busy. This break is for safety.
                        break;
                    }
                }
            } else {
                // If there are free servers, but no tasks to assign at this moment (e.g., currentTime < taskIndex)
                // advance time to the next task's arrival time.
                if (taskIndex < m && currentTime < taskIndex) {
                    currentTime = taskIndex;
                } else {
                    // If there are free servers and tasks are ready or currentTime advanced,
                    // we don't need to explicitly advance time here if assignments happened.
                    // The loop will continue. If no assignments happened, and tasks are ready,
                    // the next iteration will handle assignments.
                    // If no tasks are ready (currentTime < taskIndex), currentTime will be advanced above.
                    // If currentTime is already sufficient for task arrival, and free servers are available, assignments will happen.
                    // If currentTime is advanced by busy server's free time, then loop continues.
                    // If no assignments and no busy servers, we just increment currentTime.
                    if (taskIndex < m && currentTime < taskIndex) { // Redundant check, handled above
                        currentTime = taskIndex;
                    } else {
                        // If no tasks can be assigned yet or no tasks are pending and servers are free
                        // and no busy servers, we should advance time by 1 to avoid infinite loop if tasks not arrived.
                        // However, the logic for advancing time in `freeServers.isEmpty()` covers the waiting scenario.
                        // If free servers exist but taskIndex hasn't caught up, currentTime becomes taskIndex.
                        // If assignments happen, loop continues.
                        // If no assignments happen because taskIndex is ahead of currentTime, currentTime is advanced.
                        // Let's ensure we always make progress.
                        // If we reach here, it means free servers are available, but either:
                        // 1. taskIndex >= m (all tasks arrived), but tasks are already assigned in the previous step.
                        // 2. currentTime >= taskIndex (tasks are ready), and assignments happened or will happen in next iteration.
                        // 3. currentTime < taskIndex (tasks not yet arrived), handled by advancing currentTime to taskIndex.

                        // If no tasks are pending for assignment and no servers are busy, we might be done or waiting for next tasks.
                        // The loop condition `taskIndex < m || !busyServers.isEmpty()` handles the termination.
                        // If free servers are available, and tasks are also ready (currentTime >= taskIndex), assignment will happen.
                        // If free servers are available, but tasks are not yet ready (currentTime < taskIndex), currentTime will be advanced to taskIndex.
                        // Thus, no explicit increment by 1 is needed here, as time advancement is handled by specific conditions.
                    }
                }
            }
            // If we have assigned all tasks AND no servers are busy, we can break.
            if (taskIndex == m && busyServers.isEmpty()) {
                break;
            }
        }

        return ans;
    }
}
```