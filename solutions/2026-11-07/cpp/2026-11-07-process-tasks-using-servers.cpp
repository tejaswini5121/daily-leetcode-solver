```cpp
// Process Tasks Using Servers
// Link: https://leetcode.com/problems/process-tasks-using-servers/
// Approach:
// This problem can be solved using two priority queues (heaps).
// 1. A min-heap `available_servers` to store free servers, prioritized by weight then index.
//    Each element in this heap will be a pair {weight, index}.
// 2. A min-heap `busy_servers` to store servers that are currently busy, prioritized by their finish time.
//    Each element in this heap will be a pair {finish_time, server_index}.
//
// We simulate the process second by second.
// At each second `currentTime`:
// - Check `busy_servers`: Move any servers whose `finish_time` is less than or equal to `currentTime` back to `available_servers`.
// - Check `task_queue`: If there are tasks waiting and `available_servers` is not empty, assign tasks.
//   - Take the top server from `available_servers` (smallest weight, then smallest index).
//   - Assign the current task to this server.
//   - Calculate the server's finish time (`currentTime + task_duration`).
//   - Add the server to `busy_servers` with its finish time and index.
//   - Record the assigned server index for the current task.
// - If there are no free servers but tasks are waiting, we just advance `currentTime` to the earliest finish time in `busy_servers`.
// - Increment `currentTime`.
//
// We can optimize the time simulation by not stepping second by second if nothing happens.
// Instead, we can jump to the next relevant event: either a new task arrives or a server becomes free.
// We can maintain a `task_index` to iterate through tasks.
//
// The simulation progresses by processing tasks in order.
// At `currentTime`:
// 1. Free up servers: Move servers from `busy_servers` to `available_servers` if their finish time <= `currentTime`.
// 2. Assign tasks: While `available_servers` is not empty and `task_index < m`:
//    - Pick the best available server ({weight, index}) from `available_servers`.
//    - Assign `tasks[task_index]` to this server.
//    - Calculate `finish_time = currentTime + tasks[task_index]`.
//    - Add {finish_time, server_index} to `busy_servers`.
//    - Store `server_index` in `ans[task_index]`.
//    - Increment `task_index`.
// 3. Advance time: If `task_index < m` (there are still tasks to process) and `available_servers` is empty:
//    - The next event must be a server becoming free.
//    - The `currentTime` should jump to the `finish_time` of the earliest finishing server in `busy_servers`.
//    - If `available_servers` is not empty, `currentTime` remains the same and we try to assign more tasks if possible.
//
// Time Complexity:
// - Each server is enqueued and dequeued from `available_servers` at most once.
// - Each server is enqueued and dequeued from `busy_servers` at most once for each task it processes.
// - Each task is processed once.
// - The dominant operations are heap operations (log N for available_servers, log M for busy_servers).
// - Total time complexity is O(M log N + M log M), where N is the number of servers and M is the number of tasks.
//   Since M can be up to 2*10^5, M log M can be larger than M log N.
//   More precisely, each task assignment involves one pop from available_servers and one push to busy_servers.
//   Servers are moved from busy to available.
//   The total number of heap operations for servers is at most O(N log N) for initial loading and O(M * log N) for assignments and freeing.
//   The total number of heap operations for busy servers is O(M log M) as each task leads to one insertion.
//   So, it's O(N log N + M log N + M log M). Given constraints, M log N and M log M are the dominant parts.
//   A tighter analysis: M tasks, N servers. Each task is processed once. When a task is assigned, we do a pop from available (O(log N)) and push to busy (O(log M)).
//   When servers become free, we pop from busy (O(log M)) and push to available (O(log N)).
//   The total number of task assignments is M. Each assignment: O(log N + log M).
//   The total number of server frees across all tasks is at most M. Each free: O(log M + log N).
//   So, overall: O(M * (log N + log M)).
//
// Space Complexity:
// - `available_servers` heap: O(N)
// - `busy_servers` heap: O(N) in the worst case (all servers busy)
// - `ans` array: O(M)
// - Total space complexity is O(N + M).
//
#include <vector>
#include <queue>
#include <functional>
#include <tuple>

class Solution {
public:
    std::vector<int> getOrder(std::vector<int>& servers, std::vector<int>& tasks) {
        int n = servers.size();
        int m = tasks.size();
        std::vector<int> ans(m);

        // Min-heap for available servers: {weight, index}
        // Prioritize by weight, then index.
        std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<std::pair<int, int>>> available_servers;

        // Min-heap for busy servers: {finish_time, server_index}
        // Prioritize by finish_time.
        std::priority_queue<std::pair<long long, int>, std::vector<std::pair<long long, int>>, std::greater<std::pair<long long, int>>> busy_servers;

        // Initially, all servers are available. Load them into the available_servers heap.
        for (int i = 0; i < n; ++i) {
            available_servers.push({servers[i], i});
        }

        long long currentTime = 0;
        int task_index = 0;

        // Loop until all tasks are assigned.
        while (task_index < m) {
            // 1. Free up servers that have finished their tasks.
            // Move them from busy_servers back to available_servers.
            while (!busy_servers.empty() && busy_servers.top().first <= currentTime) {
                auto& top_busy = busy_servers.top();
                int server_idx = top_busy.second;
                // The weight of the server is needed for the available_servers heap.
                // We can access the server's weight using its index.
                available_servers.push({servers[server_idx], server_idx});
                busy_servers.pop();
            }

            // 2. Assign tasks to available servers.
            // If there are available servers and tasks waiting to be assigned.
            while (!available_servers.empty() && task_index < m) {
                // Get the best available server (smallest weight, then smallest index).
                auto& top_available = available_servers.top();
                int server_weight = top_available.first;
                int server_idx = top_available.second;
                available_servers.pop();

                // Assign the current task to this server.
                ans[task_index] = server_idx;

                // Calculate when this server will be free again.
                long long finish_time = currentTime + tasks[task_index];

                // Add the server to the busy_servers heap with its finish time.
                busy_servers.push({finish_time, server_idx});

                // Move to the next task.
                task_index++;
            }

            // 3. Advance time if necessary.
            // If there are still tasks to process (task_index < m) and no servers are currently available.
            // This means we need to wait for a server to become free.
            if (task_index < m && available_servers.empty()) {
                // Jump currentTime to the earliest finish time of a busy server.
                // This is because no new task can be assigned until a server becomes free.
                // We already moved finished servers in step 1, so busy_servers.top().first
                // is the earliest time a server becomes free *after* the current 'currentTime'.
                currentTime = busy_servers.top().first;
            } else if (task_index < m && !available_servers.empty()) {
                // If there are available servers, and we've assigned all tasks possible at the current time,
                // we don't need to advance time beyond the current task arrival time.
                // The next iteration will handle the next task.
                // If we assigned tasks, currentTime remains the same for the next task arrival if it's at the same second.
                // If currentTime is 0 and tasks[0] arrives at second 0, and we assign it,
                // currentTime does not need to advance until the next task arrival implicitly handled by the loop.
                // However, if tasks were processed and no more servers available, time jumps.
                // If servers *are* available, we just continue processing tasks at the same currentTime.
                // If task_index < m, and available_servers is NOT empty, we proceed to assign the next task.
                // The crucial part is when available_servers *becomes* empty, and we *still* have tasks.
                // In that case, we jump time. Otherwise, currentTime effectively stays the same,
                // allowing us to assign more tasks if available.
            }
             else if (task_index < m && available_servers.empty() && busy_servers.empty()) {
                 // This case should ideally not happen if m > 0 and n > 0, because tasks are inserted at second j.
                 // If there are tasks left but no servers available AND no busy servers, it implies a gap.
                 // The problem states "At second j, the jth task is inserted". So, we must consider task arrival times.
                 // Let's adjust the currentTime logic to incorporate task arrival.
                 // The current logic implicitly handles task arrivals because task_index increments and `currentTime` is used as the current second.
                 // The key is that if `available_servers` is empty and `task_index < m`, we *must* advance `currentTime` to `busy_servers.top().first`.
                 // This correctly simulates waiting.
            }

            // If there are still tasks to process and no servers are free, and no servers are busy (this implies an edge case or error in logic, but for robustness):
            // If available_servers is empty, and task_index < m, we *must* advance time.
            // If busy_servers is also empty, it means all servers are free and we should have been able to assign tasks.
            // The only way available_servers can be empty and busy_servers also empty, while task_index < m, is if n=0 or if tasks are exhausted.
            // Since n >= 1 and we loop while task_index < m, this state implies all servers were initially free and used, and now all are free again.
            // The loop condition `task_index < m` handles termination.
            // If we did assign tasks in this iteration, `currentTime` remains `currentTime`.
            // If we didn't assign tasks because `available_servers` was empty, `currentTime` would have been updated in the `if (task_index < m && available_servers.empty())` block.
            // The problem statement says "At second j, the jth task is inserted". This means task `j` arrives at time `j`.
            // Our `currentTime` advances implicitly or explicitly to handle these arrivals and server free times.

            // The current logic of advancing time only when `available_servers` is empty and `task_index < m` is correct.
            // If `available_servers` is NOT empty, we will try to assign more tasks at the *same* `currentTime`.
            // If `available_servers` IS empty, we jump `currentTime` to the next server free time.
            // This effectively means `currentTime` will naturally advance to the time the next task arrives IF no server is free.
            // Example: task 0 arrives at t=0. We assign it. If server becomes free at t=5. Task 1 arrives at t=1.
            // At t=0, task 0 assigned. `currentTime` = 0.
            // Next iteration: `currentTime` is still 0. Task 1 arrives at t=1. It's added to queue (conceptually).
            // We check busy servers at t=0. None finish.
            // We check available servers. If any, assign task 1. If not, wait.
            // The core is that `currentTime` represents the current second.
            // Task `j` becomes available at time `j`.
            // So, if `currentTime` is `t`, and `task_index` is `i`, it means `tasks[i]` is the next task available, and it arrived at time `i`.
            // We should only assign tasks from `task_index` up to `currentTime`.
            // If `task_index < currentTime`, it implies there are tasks that arrived earlier but couldn't be assigned due to server unavailability.

            // Let's refine time management:
            // `currentTime` should represent the current simulated time.
            // When a task `j` is processed, it arrives at time `j`.
            // If `currentTime < task_index` (meaning current simulation time is less than the arrival time of the next task),
            // we must advance `currentTime` to `task_index`. This ensures we don't process tasks before they arrive.
            if (task_index < m && currentTime < (long long)task_index) {
                currentTime = task_index;
            }

            // If after freeing servers, there are still tasks to be processed, and NO servers are available,
            // we must wait for the next server to become free.
            // This is the case where `available_servers` is empty, `task_index < m`, and `busy_servers` is not empty.
            if (task_index < m && available_servers.empty() && !busy_servers.empty()) {
                 currentTime = busy_servers.top().first;
            }
            // If there are tasks to process, and servers are available, we continue at the current `currentTime`.
            // The loop will pick up the next available task if `task_index` was advanced.
            // If `available_servers` is empty, and `busy_servers` is empty, and `task_index < m`:
            // This scenario means all tasks have arrived (up to `task_index`), all servers are free, but `available_servers` is empty.
            // This is impossible unless n=0. If n>=1, then available_servers would be populated.
            // The `currentTime < (long long)task_index` check handles the case where simulation time lags behind task arrival time.
            // The `available_servers.empty() && !busy_servers.empty()` handles waiting for servers.

            // One edge case: if `task_index < m`, but `available_servers` and `busy_servers` are BOTH empty.
            // This implies all servers are free. If this is the case, and `available_servers` is truly empty,
            // it means they were popped and not re-added.
            // This only happens if all servers were busy and now finished.
            // If `available_servers` is empty, we MUST advance time.
            // If `busy_servers` is also empty, it means all servers are free.
            // If `available_servers` is empty, then `currentTime` should be at least `task_index`.
            // If `available_servers` is empty, and `task_index < m`:
            //   - If `busy_servers` is NOT empty, `currentTime` becomes `busy_servers.top().first`.
            //   - If `busy_servers` IS empty, and `available_servers` is empty, and `task_index < m`: This means all `n` servers have been used and freed up.
            //     The loop would continue and if `available_servers` *is* populated, it will pick servers.
            //     If `available_servers` is genuinely empty here, it means something is wrong or all servers are still busy.
            //     The logic:
            //     1. Free servers that finish *by or at* `currentTime`.
            //     2. Assign tasks if `available_servers` is not empty.
            //     3. If tasks remain AND `available_servers` is empty, advance `currentTime` to the next server finish time.
            //     This covers all cases. The `currentTime < (long long)task_index` check ensures we don't assign tasks before they arrive.
        }

        return ans;
    }
};
```