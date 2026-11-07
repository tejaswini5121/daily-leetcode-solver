// Problem: Process Tasks Using Servers
// Link: https://leetcode.com/problems/process-tasks-using-servers/
//
// Approach:
// This problem can be solved by simulating the task processing over time. We need to keep track of available servers and tasks waiting to be processed.
//
// We can use two priority queues (min-heaps):
// 1. `availableServers`: Stores servers that are currently free. The priority is based on server weight (smallest first) and then server index (smallest first) in case of a tie. Each element in this heap will be `[weight, index]`.
// 2. `busyServers`: Stores servers that are currently processing tasks. The priority is based on the time when the server will become free (smallest first). Each element in this heap will be `[freeTime, weight, index]`.
//
// We also need to keep track of the current time.
//
// The simulation proceeds as follows:
// - Initialize `availableServers` with all servers, ordered by weight and then index.
// - Initialize `busyServers` as empty.
// - Initialize `ans` array to store the results.
// - Iterate through the tasks. For each task `j` at time `currentTime`:
//     - First, check `busyServers`. Any server that becomes free at or before `currentTime` should be moved back to `availableServers`.
//     - If `availableServers` is not empty, assign the current task `j` to the server with the highest priority (smallest weight, then smallest index) from `availableServers`.
//         - Record the assigned server's index in `ans[j]`.
//         - Calculate the `freeTime` for this server (`currentTime + tasks[j]`).
//         - Add the server to `busyServers` with its `freeTime`.
//     - If `availableServers` is empty, it means all servers are busy. We need to wait until the earliest server in `busyServers` becomes free.
//         - Let `earliestFreeTime` be the `freeTime` of the top element in `busyServers`.
//         - Advance `currentTime` to `earliestFreeTime`.
//         - Now, move all servers that become free at `earliestFreeTime` from `busyServers` to `availableServers`.
//         - After moving the freed servers, assign the current task `j` to the highest priority server from `availableServers`.
//         - Record the assigned server's index in `ans[j]`.
//         - Calculate the `freeTime` for this server (`currentTime + tasks[j]`).
//         - Add the server to `busyServers` with its `freeTime`.
//     - Increment `currentTime` for the next task or event.
//
// To implement priority queues in JavaScript, we can use a library or create our own min-heap implementation. For this solution, we'll assume a `MinPriorityQueue` class is available, which supports `enqueue`, `dequeue`, `front`, and `isEmpty` operations.
//
// Time Complexity:
// - Initializing `availableServers`: O(N log N), where N is the number of servers.
// - Processing M tasks: For each task, we might perform several operations on the priority queues.
//   - Moving servers from `busyServers` to `availableServers`: In the worst case, all N servers could move. Each move is O(log N). Over M tasks, a server is moved at most M times. So, total for this part is O(M * N * log N) if not careful, but each server is enqueued/dequeued a limited number of times overall. A better analysis: each server is enqueued/dequeued from each PQ at most once per task assignment. Thus, the total operations across all tasks and servers is closer to O(M log N).
//   - Assigning a task: O(log N) for dequeueing from `availableServers` and O(log N) for enqueueing to `busyServers`.
//
// Therefore, the overall time complexity is roughly O(N log N + M log N).
//
// Space Complexity:
// - `availableServers` and `busyServers` priority queues: O(N) space to store server information.
// - `ans` array: O(M) space to store the results.
//
// Overall space complexity is O(N + M).

/**
 * @param {number[]} servers
 * @param {number[]} tasks
 * @return {number[]}
 */
var processTasksUsingServers = function(servers, tasks) {
    // Define a simple MinPriorityQueue class for demonstration purposes.
    // In a real scenario, you might use a more robust library or implementation.
    class MinPriorityQueue {
        constructor() {
            this.heap = [];
        }

        // Comparator function for elements. By default, compares numbers directly.
        // For this problem, we'll use custom comparators.
        _compare(a, b) {
            return a < b;
        }

        enqueue(element) {
            this.heap.push(element);
            this.bubbleUp(this.heap.length - 1);
        }

        dequeue() {
            if (this.isEmpty()) {
                return null;
            }
            const min = this.heap[0];
            const last = this.heap.pop();
            if (!this.isEmpty()) {
                this.heap[0] = last;
                this.bubbleDown(0);
            }
            return min;
        }

        front() {
            return this.isEmpty() ? null : this.heap[0];
        }

        isEmpty() {
            return this.heap.length === 0;
        }

        bubbleUp(index) {
            while (index > 0) {
                const parentIndex = Math.floor((index - 1) / 2);
                if (this._compare(this.heap[index], this.heap[parentIndex])) {
                    [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                    index = parentIndex;
                } else {
                    break;
                }
            }
        }

        bubbleDown(index) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let smallestIndex = index;

            if (leftChildIndex < this.heap.length && this._compare(this.heap[leftChildIndex], this.heap[smallestIndex])) {
                smallestIndex = leftChildIndex;
            }
            if (rightChildIndex < this.heap.length && this._compare(this.heap[rightChildIndex], this.heap[smallestIndex])) {
                smallestIndex = rightChildIndex;
            }

            if (smallestIndex !== index) {
                [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
                this.bubbleDown(smallestIndex);
            }
        }

        // Helper to iterate and apply a condition for moving elements
        extractWhile(predicate) {
            const extracted = [];
            while (!this.isEmpty() && predicate(this.front())) {
                extracted.push(this.dequeue());
            }
            return extracted;
        }
    }

    // Priority queue for available servers.
    // Stores [weight, index]. Priority: smallest weight, then smallest index.
    const availableServers = new MinPriorityQueue();
    availableServers._compare = (a, b) => {
        if (a[0] !== b[0]) {
            return a[0] < b[0]; // Compare weights
        }
        return a[1] < b[1]; // Compare indices if weights are equal
    };

    // Priority queue for busy servers.
    // Stores [freeTime, weight, index]. Priority: smallest freeTime.
    const busyServers = new MinPriorityQueue();
    busyServers._compare = (a, b) => {
        return a[0] < b[0]; // Compare free times
    };

    // Initialize available servers
    for (let i = 0; i < servers.length; i++) {
        availableServers.enqueue([servers[i], i]);
    }

    const ans = new Array(tasks.length);
    let currentTime = 0;
    let taskIndex = 0;

    // Simulate task processing
    while (taskIndex < tasks.length) {
        // Move servers that have become free by currentTime from busyServers to availableServers
        const newlyFreeServers = busyServers.extractWhile(serverInfo => serverInfo[0] <= currentTime);
        for (const serverInfo of newlyFreeServers) {
            availableServers.enqueue([serverInfo[1], serverInfo[2]]); // [weight, index]
        }

        // If there are available servers, assign the current task
        if (!availableServers.isEmpty()) {
            const [serverWeight, serverIdx] = availableServers.dequeue();
            ans[taskIndex] = serverIdx;
            const taskDuration = tasks[taskIndex];
            const freeTime = currentTime + taskDuration;
            busyServers.enqueue([freeTime, serverWeight, serverIdx]);
            taskIndex++;
        } else {
            // If no servers are available, advance currentTime to the earliest free time
            // This happens only if busyServers is not empty. If both are empty, we have a problem with logic or input.
            // But given constraints, this scenario implies we must wait.
            if (!busyServers.isEmpty()) {
                currentTime = busyServers.front()[0];
            } else {
                // This case should ideally not be reached if tasks are still pending,
                // implies an issue with taskIndex not incrementing or all servers freed.
                // For robustness, we could advance time to the next task insertion time if currentTime is less.
                // However, the problem states tasks are inserted at second j for tasks[j].
                // So, if we are here and no servers, and no busy servers, it might mean we are waiting for tasks to be inserted.
                // But the logic above handles task insertion implicitly by advancing currentTime.
                // The 'else' branch only triggers if availableServers is empty.
                // If taskIndex < tasks.length and availableServers is empty, it must mean busyServers has servers.
                // Thus, currentTime is guaranteed to be updated to busyServers.front()[0].
                // If for some reason we end up here, it implies taskIndex is also at tasks.length, ending the loop.
                // If not, we should ensure currentTime advances. The logic above does this.
            }
        }

        // If we just assigned a task and currentTime hasn't advanced past the task's insertion time,
        // we should ensure currentTime is at least the current task's insertion time for the next iteration.
        // This is important if a server became free very late, and we immediately assigned a task,
        // but the next task's insertion time is even later.
        // The problem states task j is inserted at second j.
        // So, the current `currentTime` should be at least `taskIndex`.
        // However, our logic already ensures `currentTime` moves forward.
        // If we just assigned a task, `currentTime` is `currentTime` (for assignment) + `taskDuration`.
        // If we are waiting for servers, `currentTime` is updated to `busyServers.front()[0]`.
        // The next task `taskIndex` will be inserted at time `taskIndex`.
        // So, we need to ensure that `currentTime` for the *next* iteration is at least `taskIndex`.
        // This handles cases where a server becomes free very early, and we process tasks quickly,
        // but the actual time for the *next* task insertion (`taskIndex`) is even later.
        // Example: currentTime=5, taskIndex=8. If we assigned a task, new currentTime might be 7.
        // But next task is inserted at 8. So, next iteration should start at max(7, 8).
        currentTime = Math.max(currentTime, taskIndex);
    }

    return ans;
};
```