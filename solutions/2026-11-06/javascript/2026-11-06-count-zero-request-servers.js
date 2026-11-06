/**
 * @param {number} n
 * @param {number[][]} logs
 * @param {number} x
 * @param {number[]} queries
 * @return {number[]}
 */
// Problem: Count Zero Request Servers
// Link: https://leetcode.com/problems/count-zero-request-servers/
// Approach:
// The problem asks us to count the number of servers that did NOT receive any requests within a given time interval [query - x, query] for each query.
// A naive approach would be to iterate through all servers for each query and check their logs. This would be too slow given the constraints (O(queries * n * logs.length)).
//
// We can optimize this by first processing the logs. Since we are interested in time intervals, sorting the logs by time will be very beneficial.
// After sorting the logs, we can use a sliding window approach for each query.
//
// For each query `q`:
// 1. Define the time window: `[startTime, endTime]`, where `startTime = q - x` and `endTime = q`.
// 2. We need to find servers that have NO logs within this `[startTime, endTime]` interval.
// 3. Instead of directly counting servers with zero requests, it's easier to count servers that HAVE received requests within this interval.
//    The total number of servers is `n`. So, `(n - servers_with_requests)` will give us the count of servers with zero requests.
//
// To efficiently count servers with requests in the time window:
// - Sort the `logs` array based on the `time` field.
// - For each query `q`:
//   - Maintain a sliding window of logs that fall within the `[startTime, endTime]` interval.
//   - We can use two pointers, `left` and `right`, to manage this window over the sorted `logs`.
//   - `right` pointer will iterate through the logs. If `logs[right][1]` is within the `[startTime, endTime]` window, we add `logs[right][0]` to a set of active servers.
//   - `left` pointer will move forward to remove logs whose time is less than `startTime`. When `logs[left][1] < startTime`, we remove `logs[left][0]` from the set of active servers IF it was the last request from that server within the current window. To do this efficiently, we can use a frequency map (or a set if we only care about presence) for servers within the window.
//
// A more refined approach with sorted logs and a frequency map/set for servers within the window:
// 1. Sort `logs` by `time`.
// 2. Initialize `results` array of the same length as `queries`.
// 3. Initialize `log_idx = 0` (pointer for logs).
// 4. For each query `queries[i]` at index `i`:
//    a. Calculate `startTime = queries[i] - x` and `endTime = queries[i]`.
//    b. Maintain a `Set` called `active_servers_in_window` to store `server_id`s that received requests in the current `[startTime, endTime]` window.
//    c. Use a `left_log_idx` pointer to keep track of the start of the valid log entries for the current window.
//    d. Iterate `log_idx` from its current position. While `log_idx < logs.length` and `logs[log_idx][1] <= endTime`:
//       i. If `logs[log_idx][1] >= startTime`, then this log is within the current query window. Add `logs[log_idx][0]` to `active_servers_in_window`.
//       ii. Increment `log_idx`.
//    e. Now, we need to remove logs that are now outside the window from the left. We can use another pointer `left_log_idx` that also advances.
//    f. A simpler way to manage the window and active servers without explicit removal from the set (which can be costly if we need to check counts):
//       - Sort `logs` by time.
//       - For each query `q`:
//         - Initialize a `Set` of `servers_that_received_request` for the current query.
//         - Initialize `current_log_index = 0`.
//         - Iterate through `logs` starting from `current_log_index`.
//         - While `current_log_index < logs.length` and `logs[current_log_index][1] <= q`:
//           - If `logs[current_log_index][1] >= q - x`, then `logs[current_log_index][0]` is a server that received a request in the current window. Add it to `servers_that_received_request`.
//           - Increment `current_log_index`.
//         - This approach re-scans logs for each query, which is still not optimal.
//
// Let's refine the sliding window with sorted logs and a frequency map of servers within the window.
//
// 1. Sort `logs` by `time`.
// 2. Initialize `results` array of size `queries.length`.
// 3. Initialize `log_pointer = 0`.
// 4. Initialize a `Map` called `server_counts_in_window` where keys are `server_id` and values are their counts within the current sliding window.
// 5. Initialize `distinct_servers_in_window = 0`.
// 6. Use a `left_window_pointer = 0` to manage the start of the sliding window in `logs`.
//
// For each query `q` at index `i`:
//    a. `startTime = q - x`
//    b. `endTime = q`
//
//    // Expand the window to the right (include new logs up to endTime)
//    while `log_pointer < logs.length` and `logs[log_pointer][1] <= endTime`:
//        `server_id = logs[log_pointer][0]`
//        `request_time = logs[log_pointer][1]`
//
//        // Only consider logs that are within the [startTime, endTime] for this specific query
//        if `request_time >= startTime`:
//            // If this is the first request for this server in the current window
//            if `server_counts_in_window.get(server_id) === undefined` or `server_counts_in_window.get(server_id) === 0`:
//                `distinct_servers_in_window++`
//            // Increment the count for this server
//            `server_counts_in_window.set(server_id, (server_counts_in_window.get(server_id) || 0) + 1)`
//
//        `log_pointer++` // Move to the next log entry
//
//    // Shrink the window from the left (remove logs older than startTime)
//    // We need to remove logs that are strictly less than `startTime`.
//    // The `left_window_pointer` will point to the first log entry that could potentially be removed.
//    while `left_window_pointer < logs.length` and `logs[left_window_pointer][1] < startTime`:
//        `server_id_to_remove = logs[left_window_pointer][0]`
//        `server_counts_in_window.set(server_id_to_remove, server_counts_in_window.get(server_id_to_remove) - 1)`
//
//        // If the count of this server becomes zero, it means it's no longer active in the window
//        if `server_counts_in_window.get(server_id_to_remove) === 0`:
//            `distinct_servers_in_window--`
//
//        `left_window_pointer++` // Move the left pointer of the window
//
//    // The number of servers that DID NOT receive requests is total_servers - servers_that_received_requests
//    `results[i] = n - distinct_servers_in_window`
//
//    // NOTE: This sliding window logic needs careful implementation. The `log_pointer` moves forward, but `left_window_pointer` also needs to advance to discard old entries.
//    // The `server_counts_in_window` map stores the counts of servers that had requests within the *current* valid window for the *current* query.
//    // When we move to the next query, the `startTime` and `endTime` change.
//
// Let's rethink the sliding window. The queries are not necessarily sorted.
// However, the logs are sorted. This is key.
// For each query, we are interested in logs within `[q - x, q]`.
//
// If we iterate through queries, and for each query, we iterate through logs, it's O(queries * logs.length). Still too slow if `queries.length` and `logs.length` are both large.
//
// The crucial observation is that the time intervals for queries overlap. We can leverage the sorted logs.
//
// Let's sort the queries as well, but keep track of their original indices to return results in the correct order.
//
// 1. Sort `logs` by `time`.
// 2. Create an array of `[query_value, original_index]` pairs for `queries`.
// 3. Sort this new `sorted_queries` array by `query_value`.
// 4. Initialize `results` array of size `queries.length`.
// 5. Initialize `log_idx = 0`.
// 6. Initialize `left_window_idx = 0` (this pointer will track the start of logs that are *too old* for the current query window).
// 7. Initialize `Map<server_id, count_in_window>` called `server_request_counts`. This map will store the number of requests for a server *within the current active window*.
// 8. Initialize `active_servers_count = 0` (number of distinct servers that have received at least one request in the current window).
//
// Iterate through `sorted_queries`:
//    For each `[query_time, original_query_index]` in `sorted_queries`:
//
//        `window_start_time = query_time - x`
//        `window_end_time = query_time`
//
//        // Expand the window: Add logs that fall within the current query's upper bound (endTime)
//        // and are relevant to the current window.
//        while `log_idx < logs.length` and `logs[log_idx][1] <= window_end_time`:
//            `server_id = logs[log_idx][0]`
//            `request_time = logs[log_idx][1]`
//
//            // Check if this log entry is within the specific time window for THIS query.
//            if `request_time >= window_start_time`:
//                // If this server was NOT active in the window before, increment active count.
//                if `server_request_counts.get(server_id) === undefined` || `server_request_counts.get(server_id) === 0`:
//                    `active_servers_count++`
//                // Increment the request count for this server.
//                `server_request_counts.set(server_id, (server_request_counts.get(server_id) || 0) + 1)`
//
//            `log_idx++` // Move to the next log entry
//
//        // Shrink the window: Remove logs that are too old for the current query's window (i.e., older than window_start_time).
//        // `left_window_idx` points to the first log entry that might need removal.
//        while `left_window_idx < logs.length` and `logs[left_window_idx][1] < window_start_time`:
//            `server_id_to_remove = logs[left_window_idx][0]`
//
//            // Decrement the request count for the server being removed from the window.
//            `server_request_counts.set(server_id_to_remove, server_request_counts.get(server_id_to_remove) - 1)`
//
//            // If the count for this server drops to zero, it's no longer active in the window.
//            if `server_request_counts.get(server_id_to_remove) === 0`:
//                `active_servers_count--`
//
//            `left_window_idx++` // Move the left pointer to consider the next log for removal.
//
//        // After adjusting the window, `active_servers_count` holds the number of servers that received at least one request
//        // within the interval [window_start_time, window_end_time].
//        `servers_with_zero_requests = n - active_servers_count`
//        `results[original_query_index] = servers_with_zero_requests`
//
// Time Complexity:
// - Sorting logs: O(L log L), where L is the number of logs.
// - Sorting queries: O(Q log Q), where Q is the number of queries.
// - Iterating through sorted queries: Each log entry is visited at most twice (once by `log_idx` and once by `left_window_idx`). So, the sliding window part is O(L + Q).
// - Overall Time Complexity: O(L log L + Q log Q). If L and Q are of similar magnitude (e.g., 10^5), this is dominated by the sorting.
//
// Space Complexity:
// - `results` array: O(Q)
// - `sorted_queries` array: O(Q)
// - `server_request_counts` map: In the worst case, all servers might have requests in the window, so O(n).
// - Overall Space Complexity: O(Q + n).

// Constraints Check:
// n <= 10^5
// logs.length <= 10^5
// queries.length <= 10^5
// logs[i][1] <= 10^6
// queries[i] <= 10^6
// x < queries[i]
//
// The time values can be up to 10^6. This means the time intervals are within a manageable range.
// The approach seems robust enough for these constraints.

// Let's implement the refined sliding window approach.

/**
 * @param {number} n
 * @param {number[][]} logs
 * @param {number} x
 * @param {number[]} queries
 * @return {number[]}
 */
var countServers = function(n, logs, x, queries) {
    // 1. Sort logs by time in ascending order.
    logs.sort((a, b) => a[1] - b[1]);

    // 2. Create an array of query objects to store query value and original index.
    // This is needed to return results in the original query order after sorting queries.
    const sortedQueries = [];
    for (let i = 0; i < queries.length; i++) {
        sortedQueries.push({ value: queries[i], index: i });
    }

    // 3. Sort queries by their time values in ascending order.
    sortedQueries.sort((a, b) => a.value - b.value);

    // 4. Initialize the results array with the same length as queries.
    const results = new Array(queries.length).fill(0);

    // 5. Initialize pointers and data structures for the sliding window.
    let logPointer = 0; // Pointer for iterating through the sorted logs.
    let leftWindowPointer = 0; // Pointer for the start of the sliding window in logs.

    // Map to store the count of requests for each server within the current sliding window.
    // Key: server_id, Value: count of requests in the window.
    const serverRequestCounts = new Map();

    // Counter for the number of distinct servers that have received at least one request
    // within the current sliding window.
    let distinctServersInWindow = 0;

    // 6. Iterate through the sorted queries to apply the sliding window.
    for (const queryInfo of sortedQueries) {
        const queryTime = queryInfo.value;
        const originalIndex = queryInfo.index;

        // Define the time window for the current query.
        const windowStartTime = queryTime - x;
        const windowEndTime = queryTime;

        // --- Expand the window to the right ---
        // Add all logs whose request time is less than or equal to the current query's end time.
        while (logPointer < logs.length && logs[logPointer][1] <= windowEndTime) {
            const serverId = logs[logPointer][0];
            const requestTime = logs[logPointer][1];

            // Only consider logs that fall within the specific time window [windowStartTime, windowEndTime].
            if (requestTime >= windowStartTime) {
                // If this is the first request for this server in the current window,
                // it means a new distinct server has become active in the window.
                if (!serverRequestCounts.has(serverId) || serverRequestCounts.get(serverId) === 0) {
                    distinctServersInWindow++;
                }
                // Increment the request count for this server in the map.
                serverRequestCounts.set(serverId, (serverRequestCounts.get(serverId) || 0) + 1);
            }
            // Move the log pointer to the next log entry.
            logPointer++;
        }

        // --- Shrink the window from the left ---
        // Remove logs whose request time is strictly less than the current query's start time.
        // These logs are no longer relevant for the current query's window.
        while (leftWindowPointer < logs.length && logs[leftWindowPointer][1] < windowStartTime) {
            const serverIdToRemove = logs[leftWindowPointer][0];

            // Decrement the request count for the server whose log is being removed.
            serverRequestCounts.set(serverIdToRemove, serverRequestCounts.get(serverIdToRemove) - 1);

            // If the request count for this server drops to zero, it means this server is no longer
            // active in the window for this query.
            if (serverRequestCounts.get(serverIdToRemove) === 0) {
                distinctServersInWindow--;
            }
            // Move the left window pointer to consider the next log entry for removal.
            leftWindowPointer++;
        }

        // --- Calculate the result for the current query ---
        // The number of servers that DID NOT receive any requests is the total number of servers
        // minus the number of distinct servers that DID receive requests in the window.
        results[originalIndex] = n - distinctServersInWindow;
    }

    // 7. Return the results array.
    return results;
};
/**
 * @param {number} n
 * @param {number[][]} logs
 * @param {number} x
 * @param {number[]} queries
 * @return {number[]}
 */
// var countServers = function(n, logs, x, queries) {
//     // Sort logs by time for efficient sliding window processing.
//     logs.sort((a, b) => a[1] - b[1]);

//     // Store queries with their original indices to maintain order in the final result.
//     // Format: [{ value: query_time, index: original_index }, ...]
//     const sortedQueries = queries.map((queryTime, index) => ({ value: queryTime, index: index }));

//     // Sort queries by their time values to process them in increasing order,
//     // which allows for an efficient sliding window approach on the sorted logs.
//     sortedQueries.sort((a, b) => a.value - b.value);

//     // Initialize the results array. Its size will be the same as the number of queries.
//     const results = new Array(queries.length).fill(0);

//     // Initialize pointers for the sliding window on the sorted logs.
//     let logPointer = 0; // Pointer that advances to include new logs into the window.
//     let leftWindowPointer = 0; // Pointer that advances to remove old logs from the window.

//     // A Map to store the count of requests for each server within the current active window.
//     // Key: server_id, Value: count of requests in the current window.
//     const serverRequestCounts = new Map();

//     // Counter for the number of distinct servers that have received at least one request
//     // within the current active sliding window.
//     let distinctServersInWindow = 0;

//     // Iterate through the sorted queries.
//     for (const queryInfo of sortedQueries) {
//         const queryTime = queryInfo.value;
//         const originalIndex = queryInfo.index;

//         // Define the time interval for the current query: [queryTime - x, queryTime].
//         const windowStartTime = queryTime - x;
//         const windowEndTime = queryTime;

//         // --- Expand the window ---
//         // Advance `logPointer` to include all log entries up to `windowEndTime`.
//         // These are potential candidates for the current query's window.
//         while (logPointer < logs.length && logs[logPointer][1] <= windowEndTime) {
//             const serverId = logs[logPointer][0];
//             const requestTime = logs[logPointer][1];

//             // If the request time falls within the specific window [windowStartTime, windowEndTime]
//             // for this query, we consider this server active.
//             if (requestTime >= windowStartTime) {
//                 // If the server was not previously active in this window (count is 0 or undefined),
//                 // increment the `distinctServersInWindow` counter.
//                 if (!serverRequestCounts.has(serverId) || serverRequestCounts.get(serverId) === 0) {
//                     distinctServersInWindow++;
//                 }
//                 // Increment the request count for this server.
//                 serverRequestCounts.set(serverId, (serverRequestCounts.get(serverId) || 0) + 1);
//             }
//             // Move to the next log entry.
//             logPointer++;
//         }

//         // --- Shrink the window ---
//         // Advance `leftWindowPointer` to remove log entries that are older than `windowStartTime`.
//         // These logs are no longer relevant for the current query's window.
//         while (leftWindowPointer < logs.length && logs[leftWindowPointer][1] < windowStartTime) {
//             const serverIdToRemove = logs[leftWindowPointer][0];

//             // Decrement the request count for the server whose log is being removed from the window.
//             serverRequestCounts.set(serverIdToRemove, serverRequestCounts.get(serverIdToRemove) - 1);

//             // If the count for this server drops to zero, it means this server is no longer
//             // active in the current window. Decrement `distinctServersInWindow`.
//             if (serverRequestCounts.get(serverIdToRemove) === 0) {
//                 distinctServersInWindow--;
//             }
//             // Move the left window pointer to consider the next log entry for removal.
//             leftWindowPointer++;
//         }

//         // --- Calculate the result ---
//         // The number of servers that did NOT receive any requests is the total number of servers (`n`)
//         // minus the count of distinct servers that DID receive at least one request in the window.
//         results[originalIndex] = n - distinctServersInWindow;
//     }

//     // Return the results in the order of the original queries.
//     return results;
// };
```