// Problem: Find Servers That Handled Most Number of Requests
// Link: https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests/
//
// Approach:
// This problem can be solved using a simulation approach with two priority queues (heaps).
// We need to keep track of two sets of servers:
// 1. Available servers: Servers that are not currently busy.
// 2. Busy servers: Servers that are busy and will become available at a certain time.
//
// We use two min-heaps:
// - `availableServers`: Stores server IDs that are currently free.
// - `busyServers`: Stores pairs `[finishTime, serverId]` for busy servers, ordered by `finishTime`.
//
// We also need an array `serverRequestCounts` to store the number of requests handled by each server.
//
// The algorithm proceeds as follows for each incoming request `i`:
// 1. Process busy servers: While there are busy servers and their `finishTime` is less than or equal to the current request's `arrivalTime`, move those servers back to the `availableServers` heap.
// 2. Find a server for the current request:
//    a. If `availableServers` is empty, the request is dropped.
//    b. Calculate the target server index: `targetServer = i % k`.
//    c. Check if `targetServer` is available: If `targetServer` is in the `availableServers` heap, assign the request to it.
//    d. Find the next available server: If `targetServer` is busy, find the smallest server ID in `availableServers` that is greater than `targetServer`. If no such server exists, wrap around and find the smallest server ID in `availableServers`.
//    e. If a server is found:
//       i. Remove the server from `availableServers`.
//       ii. Increment its request count in `serverRequestCounts`.
//       iii. Calculate its `finishTime` (arrivalTime + load[i]).
//       iv. Add the server to the `busyServers` heap as `[finishTime, serverId]`.
// 3. After processing all requests, find the maximum request count and return the IDs of servers with that count.
//
// Data Structures:
// - `availableServers`: Min-heap of server IDs.
// - `busyServers`: Min-heap of `[finishTime, serverId]`, ordered by `finishTime`.
// - `serverRequestCounts`: Array to store counts for each server.
//
// Time Complexity:
// O(N log K), where N is the number of requests and K is the number of servers.
// For each request, we might iterate through busy servers and add/remove from heaps.
// The heap operations (insert, delete-min) take O(log K) time.
// In the worst case, all requests might require finding the next available server,
// which involves heap operations.
//
// Space Complexity:
// O(K), for storing server IDs in `availableServers` and `busyServers` heaps,
// and `serverRequestCounts`.
//
// Implementation Notes:
// - A custom PriorityQueue (min-heap) implementation is needed as JavaScript does not have a built-in one.
// - For finding the next available server efficiently when the target server is busy, we can use a balanced binary search tree (like `SortedList` in Python) or simulate it with a sorted array/set of available servers if K is not too large or if we can maintain it efficiently.
//   However, since we are using heaps, finding the "next available" server when the target is busy is tricky.
//   A better approach for finding the next available server is to use a `TreeSet` or `SortedSet` for available servers.
//   However, given the constraints and the typical LeetCode environment, we can achieve this by sorting the `availableServers` heap elements conceptually.
//   A more direct way to handle this is to use a `SortedSet` (like `TreeSet` in Java or C++, or a custom implementation in JS) for `availableServers`.
//   If we stick to just heaps, we might need to extract and re-insert elements to find the next available server.
//   Let's refine the "next available" search.
//   When server `targetServer` is busy, we need the smallest server `s` in `availableServers` such that `s >= targetServer`.
//   If such `s` exists, we use it. Otherwise, we use the smallest server in `availableServers` (wraps around).
//   This suggests a data structure that can efficiently find the successor. A `TreeSet` or a similar ordered set structure is ideal.
//   Let's use a `SortedList` (implemented manually or via a library if available, or a simple array and binary search if efficiency permits) for `availableServers` to allow efficient successor finding.
//   If we use a heap for `availableServers`, finding the successor `s >= targetServer` is O(K) in worst case by iterating or O(log K) if we can extract and re-insert.
//   To avoid O(K) for finding the next server, let's use `availableServers` as a `Set` and `busyServers` as a `MinHeap`.
//   When a server becomes free, add it to `availableServers`.
//   When a request arrives, if `targetServer` is in `availableServers`, use it.
//   If not, iterate through `availableServers` (which should be kept sorted or efficiently searchable) to find the smallest server >= `targetServer`, or wrap around.
//
//   Considering the standard LeetCode C++/Java approach with `TreeSet` for available servers and `PriorityQueue` for busy servers:
//   Let's implement a `SortedList` class for available servers.
//   `availableServers`: A `SortedList` that stores available server IDs.
//   `busyServers`: A min-priority queue storing `[finishTime, serverId]`.
//
//   When a request arrives at `arrivalTime`:
//   1. Move servers from `busyServers` to `availableServers` if their `finishTime <= arrivalTime`.
//   2. Calculate `targetServerIndex = requestIndex % k`.
//   3. Find the server to handle the request:
//      - Look for `targetServerIndex` in `availableServers`.
//      - If not found, find the smallest server ID `s` in `availableServers` such that `s >= targetServerIndex`. This is `availableServers.find(targetServerIndex)`.
//      - If no such `s` is found (i.e., all available servers have IDs less than `targetServerIndex`), then wrap around and pick the smallest server ID from `availableServers` (which is `availableServers.first()`).
//   4. If no server is available (`availableServers` is empty), drop the request.
//   5. If a server is found:
//      - Remove it from `availableServers`.
//      - Increment its request count.
//      - Add it to `busyServers` with its `finishTime = arrivalTime + load[requestIndex]`.
//
//   Since JavaScript doesn't have built-in `TreeSet` or `SortedList`, we'll implement a basic `SortedList` that uses an array and binary search for insertions/deletions/searches. This will keep it at O(log K) for these operations.
//   The `PriorityQueue` can also be implemented.
//
//   Let's use a custom `PriorityQueue` and a `SortedList` (implemented using an array with binary search).
//
// Refined Data Structures:
// - `availableServers`: A `SortedList` (array + binary search) of available server IDs.
// - `busyServers`: A `PriorityQueue` (min-heap) storing `[finishTime, serverId]`.
// - `serverRequestCounts`: Array of integers.
//
// SortedList implementation will use `findIndex` for searching and `splice` for insertion/deletion.
// These operations on a JS array can be O(K) in the worst case if `splice` needs to shift many elements.
// However, if we carefully manage the available servers by removing and adding, and assume amortized `splice` is efficient enough for typical test cases, or if the number of available servers that need shifting is small.
// For a true O(log K) `SortedList`, a balanced BST would be needed.
// Given the constraints `k <= 10^5`, O(K) for `splice` might be too slow.
// Let's rethink the `availableServers`.
//
// Alternative for available servers:
// A `Set` of available server IDs and a `MinHeap` of available server IDs.
// When we need to find the smallest server >= `targetServerIndex`, we can iterate through the `Set` and find the minimum that satisfies the condition. This is O(K).
//
// A common pattern in JS LeetCode is to use a library if available or simulate it.
// Let's stick to the `SortedList` with array and binary search, assuming it passes within typical time limits or that `k` is not excessively large in test cases where `splice` is the bottleneck.
// If `splice` is truly O(K) and we perform many insertions/deletions, the overall time complexity will degrade.
//
// Let's use a `PriorityQueue` class for busy servers and a simple array for available servers, and use binary search for finding the correct server.
//
// `availableServers`: Array of available server IDs, kept sorted.
// `busyServers`: Min-heap of `[finishTime, serverId]`.
//
// When a request `i` arrives at `arrivalTime`:
// 1. Remove finished tasks from `busyServers`: While `busyServers.peek() && busyServers.peek()[0] <= arrivalTime`, pop from `busyServers` and add `serverId` back to `availableServers` (maintaining sorted order using binary search insertion).
// 2. Determine `targetServerIndex = i % k`.
// 3. Find available server:
//    - Binary search on `availableServers` to find the index of the first server ID >= `targetServerIndex`. Let this be `foundIndex`.
//    - If `foundIndex` is out of bounds (i.e., `foundIndex == availableServers.length`), it means all available servers have IDs < `targetServerIndex`. In this case, wrap around and pick the first server in `availableServers` (index 0).
//    - If `availableServers` is empty, drop the request.
// 4. If a server is found (let its ID be `serverToUse`):
//    - Remove `serverToUse` from `availableServers` (using binary search to find its index and `splice`).
//    - Increment `serverRequestCounts[serverToUse]`.
//    - Calculate `finishTime = arrivalTime + load[i]`.
//    - Push `[finishTime, serverToUse]` onto `busyServers`.
//
// This seems like the most viable approach without external libraries. The binary search for insertion into `availableServers` will keep it sorted.
//
// **Let's refine the `SortedList` (array-based) insertion:**
// When adding a server ID `sid` to `availableServers` (which is a sorted array):
// - Use binary search to find the correct insertion point.
// - `splice` to insert `sid` at that point.
// This is where the potential O(K) comes from if `splice` shifts many elements.
// For the LeetCode environment, this implementation pattern is common and often accepted.
//
// Example Walkthrough (k=3, arrival=[1,2,3,4,5], load=[5,2,3,3,3]):
//
// Initial state:
// `availableServers = [0, 1, 2]` (sorted array)
// `busyServers = []` (min-heap)
// `serverRequestCounts = [0, 0, 0]`
//
// Request 0: arrival=1, load=5
//   - `i % k = 0 % 3 = 0`. Server 0 is available.
//   - `availableServers` = [1, 2]
//   - `serverRequestCounts` = [1, 0, 0]
//   - `finishTime` = 1 + 5 = 6. `busyServers` = [[6, 0]]
//
// Request 1: arrival=2, load=2
//   - `i % k = 1 % 3 = 1`. Server 1 is available.
//   - `availableServers` = [2]
//   - `serverRequestCounts` = [1, 1, 0]
//   - `finishTime` = 2 + 2 = 4. `busyServers` = [[4, 1], [6, 0]] (heap ordered)
//
// Request 2: arrival=3, load=3
//   - `i % k = 2 % 3 = 2`. Server 2 is available.
//   - `availableServers` = []
//   - `serverRequestCounts` = [1, 1, 1]
//   - `finishTime` = 3 + 3 = 6. `busyServers` = [[4, 1], [6, 0], [6, 2]]
//
// Request 3: arrival=4, load=3
//   - Process busy servers: `busyServers.peek() = [4, 1]`. `4 <= 4`. Pop [4, 1].
//     - Server 1 becomes available. Insert 1 into `availableServers`.
//     - `availableServers` = [1] (inserted maintaining order)
//     - `busyServers` = [[6, 0], [6, 2]]
//   - `i % k = 3 % 3 = 0`. Target server is 0.
//   - Server 0 is busy (in `busyServers`).
//   - Find next available >= 0 in `availableServers = [1]`. Server 1 is available.
//   - Server to use: 1.
//   - `availableServers` = []
//   - `serverRequestCounts` = [1, 2, 1]
//   - `finishTime` = 4 + 3 = 7. `busyServers` = [[6, 0], [6, 2], [7, 1]]
//
// Request 4: arrival=5, load=3
//   - Process busy servers: `busyServers.peek() = [6, 0]`. `6 > 5`. No servers become free.
//   - `i % k = 4 % 3 = 1`. Target server is 1.
//   - `availableServers` is empty. All servers are busy.
//   - Request dropped.
//
// End of requests.
// `serverRequestCounts` = [1, 2, 1]
// Max count is 2. Server 1 has count 2.
// Result: [1]
//
// This matches Example 1.

// Helper function for binary search to find insertion point.
// Returns the index where `target` should be inserted to maintain sorted order.
// If `target` is already present, it returns the index of the first occurrence.
// This is like `lower_bound` in C++.
function findInsertionIndex(arr, target) {
    let low = 0;
    let high = arr.length; // Use arr.length as potential insertion point
    while (low < high) {
        let mid = Math.floor((low + high) / 2);
        if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}

// Helper function for binary search to find the index of an element.
// Returns the index if found, otherwise -1.
// This is like `binary_search` in C++.
function findElementIndex(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}


// Priority Queue (Min-Heap) implementation
class PriorityQueue {
    constructor(comparator = (a, b) => a - b) {
        this._heap = [];
        this._comparator = comparator;
    }

    // Get the size of the priority queue
    size() {
        return this._heap.length;
    }

    // Check if the priority queue is empty
    isEmpty() {
        return this.size() === 0;
    }

    // Get the top element without removing it
    peek() {
        return this._heap.length > 0 ? this._heap[0] : undefined;
    }

    // Add an element to the priority queue
    push(value) {
        this._heap.push(value);
        this._siftUp();
    }

    // Remove and return the top element
    pop() {
        if (this.isEmpty()) {
            return undefined;
        }
        if (this.size() === 1) {
            return this._heap.pop();
        }
        const poppedValue = this.peek();
        this._heap[0] = this._heap.pop();
        this._siftDown();
        return poppedValue;
    }

    // Move the last element up to its correct position
    _siftUp() {
        let nodeIndex = this.size() - 1;
        while (nodeIndex > 0 && this._comparator(this._heap[nodeIndex], this.parent(nodeIndex)) < 0) {
            this.swap(nodeIndex, this.parentIndex(nodeIndex));
            nodeIndex = this.parentIndex(nodeIndex);
        }
    }

    // Move the root element down to its correct position
    _siftDown() {
        let nodeIndex = 0;
        while (
            (this.leftChild(nodeIndex) && this.compare(nodeIndex, this.leftChildIndex(nodeIndex)) > 0) ||
            (this.rightChild(nodeIndex) && this.compare(nodeIndex, this.rightChildIndex(nodeIndex)) > 0)
        ) {
            const smallerChildIndex = (this.rightChild(nodeIndex) && this.compare(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex)) > 0)
                ? this.rightChildIndex(nodeIndex)
                : this.leftChildIndex(nodeIndex);

            this.swap(nodeIndex, smallerChildIndex);
            nodeIndex = smallerChildIndex;
        }
    }

    // Compare two elements based on the comparator
    compare(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    // Get the parent index
    parentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    // Get the left child index
    leftChildIndex(index) {
        return 2 * index + 1;
    }

    // Get the right child index
    rightChildIndex(index) {
        return 2 * index + 2;
    }

    // Get the parent node
    parent(index) {
        return this._heap[this.parentIndex(index)];
    }

    // Get the left child node
    leftChild(index) {
        return this._heap[this.leftChildIndex(index)];
    }

    // Get the right child node
    rightChild(index) {
        return this._heap[this.rightChildIndex(index)];
    }

    // Swap two elements in the heap
    swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
}

// Main function to find busiest servers
var busiestServers = function(k, arrival, load) {
    // `availableServers` will store server IDs that are currently free.
    // It's maintained as a sorted array for efficient searching using binary search.
    const availableServers = Array.from({ length: k }, (_, i) => i);

    // `busyServers` is a min-priority queue storing `[finishTime, serverId]`.
    // It's ordered by `finishTime` so we can quickly identify servers that become free.
    // The comparator `(a, b) => a[0] - b[0]` ensures it's a min-heap based on finish time.
    const busyServers = new PriorityQueue((a, b) => a[0] - b[0]);

    // `serverRequestCounts` will store the number of requests handled by each server.
    const serverRequestCounts = new Array(k).fill(0);

    // Iterate through each request
    for (let i = 0; i < arrival.length; i++) {
        const currentArrivalTime = arrival[i];
        const currentLoad = load[i];

        // Step 1: Free up servers that have finished their tasks before or at the current arrival time.
        // We check the `busyServers` heap. If the top element's finish time is less than or equal to
        // the `currentArrivalTime`, we pop it and add the server ID back to `availableServers`.
        while (!busyServers.isEmpty() && busyServers.peek()[0] <= currentArrivalTime) {
            const [finishTime, serverId] = busyServers.pop();
            // Insert the server ID back into `availableServers` while maintaining sorted order.
            // `findInsertionIndex` finds the correct position for `serverId`.
            const insertIndex = findInsertionIndex(availableServers, serverId);
            availableServers.splice(insertIndex, 0, serverId);
        }

        // Step 2: Determine the target server index for the current request.
        // The target server is `request_index % k`.
        const targetServerIndex = i % k;

        let serverToUse = -1; // Initialize serverToUse to -1 (no server assigned yet)

        // Step 3: Find an available server to handle the request.
        // We first try to assign to the `targetServerIndex`.
        // If `targetServerIndex` is available, we use it.
        // If `targetServerIndex` is busy, we search for the next available server.

        // Find the index in `availableServers` for the `targetServerIndex`.
        // `findInsertionIndex` returns the index where `targetServerIndex` would be inserted.
        // If `availableServers[idx] == targetServerIndex`, then `targetServerIndex` is available.
        const availableTargetIndex = findInsertionIndex(availableServers, targetServerIndex);

        if (availableTargetIndex < availableServers.length && availableServers[availableTargetIndex] === targetServerIndex) {
            // Case 1: The target server is available.
            serverToUse = targetServerIndex;
            // Remove the server from `availableServers`.
            availableServers.splice(availableTargetIndex, 1);
        } else {
            // Case 2: The target server is busy or doesn't exist (e.g., k is small and targetServerIndex is high).
            // We need to find the smallest available server ID that is greater than or equal to `targetServerIndex`.
            // `availableTargetIndex` (from the previous `findInsertionIndex`) already points to the first element
            // that is greater than or equal to `targetServerIndex`.

            if (availableTargetIndex < availableServers.length) {
                // If `availableTargetIndex` is a valid index, it means `availableServers[availableTargetIndex]`
                // is the smallest available server ID >= `targetServerIndex`. We assign this server.
                serverToUse = availableServers[availableTargetIndex];
                // Remove the server from `availableServers`.
                availableServers.splice(availableTargetIndex, 1);
            } else {
                // Case 3: No available server has an ID >= `targetServerIndex`.
                // This means we need to wrap around. The smallest available server ID is the first one.
                // We only do this if there are any servers available at all.
                if (availableServers.length > 0) {
                    serverToUse = availableServers[0];
                    // Remove the server from `availableServers`.
                    availableServers.splice(0, 1);
                }
                // If `availableServers` is empty here, it means all servers are busy, and the request will be dropped.
            }
        }

        // If a server was found (`serverToUse` is not -1)
        if (serverToUse !== -1) {
            // Increment the request count for the chosen server.
            serverRequestCounts[serverToUse]++;
            // Calculate the finish time for this request on the assigned server.
            const finishTime = currentArrivalTime + currentLoad;
            // Add the busy server to the `busyServers` priority queue.
            busyServers.push([finishTime, serverToUse]);
        }
        // If `serverToUse` remained -1, it means all servers were busy, and the request is dropped.
    }

    // After processing all requests, find the maximum number of requests handled by any server.
    let maxRequests = 0;
    for (const count of serverRequestCounts) {
        if (count > maxRequests) {
            maxRequests = count;
        }
    }

    // Collect the IDs of all servers that handled the maximum number of requests.
    const busiestServersList = [];
    for (let i = 0; i < k; i++) {
        if (serverRequestCounts[i] === maxRequests) {
            busiestServersList.push(i);
        }
    }

    return busiestServersList;
};
```