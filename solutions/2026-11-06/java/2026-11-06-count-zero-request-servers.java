/**
 * Problem Summary: Count servers that don't receive requests within a given time window for multiple queries.
 * Link: https://leetcode.com/problems/count-zero-request-servers/
 *
 * Approach:
 * The core idea is to efficiently determine which servers received requests within the specified time interval for each query.
 *
 * 1. Preprocessing Logs:
 *    - Sort the `logs` array based on the `time` of the requests. This allows us to process logs chronologically and use a sliding window approach.
 *
 * 2. Processing Queries:
 *    - For each `query`:
 *        - Define the time interval: `[query - x, query]`.
 *        - Use a sliding window to identify all servers that received requests within this interval.
 *        - Maintain a set of `servers_with_requests` within the current window.
 *        - Initialize two pointers, `left` and `right`, to iterate through the sorted `logs`.
 *        - As `right` pointer moves, add the `server_id` from `logs[right]` to `servers_with_requests` if its `time` is within the current query's window (`<= query`).
 *        - As `left` pointer moves, remove `server_id` from `servers_with_requests` if its `time` is outside the current query's window (`< query - x`).
 *        - The number of servers that received requests in the interval is `servers_with_requests.size()`.
 *        - The number of servers with zero requests is `n - servers_with_requests.size()`.
 *
 * Time Complexity:
 * - Sorting logs: O(L log L), where L is the number of logs.
 * - Processing queries: For each query, the `left` and `right` pointers traverse the sorted logs at most once. So, O(Q * L) in a naive implementation with repeated traversals.
 *   However, with a single pass of `right` pointer and careful management of `left` pointer for each query, it becomes more efficient.
 *   The dominant part is the sorting of logs. The query processing with sliding window can be optimized.
 *   If we process queries in sorted order of their end times, we can maintain a single sliding window over logs.
 *   However, the queries are not necessarily sorted and `x` can vary.
 *   A more optimized approach:
 *   Sort logs by time: O(L log L).
 *   For each query, we can use binary search (or two pointers) on the sorted logs to find the start and end indices of requests within the `[query - x, query]` interval.
 *   Finding indices for each query: O(log L) or O(L) in worst case if all logs fall in interval.
 *   Total for queries: O(Q * log L) or O(Q * L).
 *   Let's refine the sliding window approach:
 *   Sort logs by time: O(L log L).
 *   Store queries along with their original indices. Sort queries by their end time (query).
 *   Iterate through sorted logs with a `right` pointer.
 *   For each query, advance `left` pointer to remove logs older than `query - x`.
 *   The `servers_with_requests` set will correctly reflect servers in the current window `[query - x, query]`.
 *   This optimized approach leads to: O(L log L + Q log Q + L + Q) ≈ O(L log L + Q log Q) if we sort queries.
 *   If we don't sort queries, and use a sliding window for each query independently:
 *   Sort logs: O(L log L).
 *   For each query (Q of them), a sliding window pass on logs: O(L). Total for queries: O(Q*L).
 *   Given the constraints (L, Q <= 10^5), O(Q*L) is too slow.
 *
 *   Let's reconsider the sliding window with queries processed in their given order:
 *   Sort `logs` by time: O(L log L).
 *   Initialize `left = 0`.
 *   Use a `Map<Integer, Integer>` to store the counts of active servers within the current window.
 *   For each query `q`:
 *      - `startTime = q - x`
 *      - `endTime = q`
 *      - Advance `left` pointer: While `left < logs.length` and `logs[left][1] < startTime`:
 *          - Decrement count of `logs[left][0]` in the map. If count becomes 0, remove from map.
 *          - Increment `left`.
 *      - Advance `right` pointer (implicitly via iterating up to `logs.length` for this query):
 *          - We need to find all logs with `time` between `startTime` and `endTime`.
 *          - A better approach: For each query, determine the range of log indices that fall within `[query - x, query]`.
 *          - We can use binary search on the sorted logs to find the `startIndex` of logs >= `query - x` and `endIndex` of logs <= `query`.
 *          - Then, iterate from `startIndex` to `endIndex` to populate a `HashSet` of unique server IDs.
 *          - Time complexity: O(L log L) for sorting. O(Q * (log L + L_interval)), where L_interval is the number of logs in the interval, which can be O(L). This is still potentially O(Q*L).
 *
 *   The most efficient approach involves sorting logs and then using a two-pointer/sliding window technique where we process queries *together* with logs.
 *   Let's re-evaluate with the provided constraints.
 *   L, Q <= 10^5, times <= 10^6.
 *
 *   Optimized approach:
 *   1. Sort `logs` by time: O(L log L).
 *   2. For each query, we want to count unique servers in `[query - x, query]`.
 *   3. Instead of re-scanning logs for each query, we can leverage the sorted logs.
 *   4. For a query `q`:
 *      - Find the index `startIdx` of the first log with `time >= q - x` using binary search.
 *      - Find the index `endIdx` of the last log with `time <= q` using binary search.
 *      - Iterate from `startIdx` to `endIdx` and add server IDs to a `HashSet`. The size of the set is the count of active servers.
 *      - Time complexity: O(L log L) for sort. For each query: O(log L) for binary searches + O(k) to populate set where k is number of logs in interval. In worst case, k can be L. So, O(Q*L). This is still too slow.
 *
 *   The key is that the *time window* shifts for each query.
 *
 *   Let's think about a single pass over sorted logs.
 *   Sort `logs` by time: O(L log L).
 *   Create a list of `(query_time, query_index, is_start_of_interval)` for all queries.
 *   For each query `q`, we add two events: `(q - x, i, START)` and `(q, i, END)`.
 *   Sort these events by time.
 *   Initialize an empty `Set<Integer> active_servers`.
 *   Initialize `result` array of size Q.
 *   Iterate through the sorted events:
 *      - If event is `(time, query_index, START)`: This marks the beginning of the time window for `query_index`. We need to *remove* servers that fall out of this window.
 *      - If event is `(time, query_index, END)`: This marks the end of the time window for `query_index`. We need to *add* servers that fall into this window.
 *
 *   This event-based approach with a single pass over sorted events (logs + query boundaries) is more promising.
 *   Events: O(L + 2Q) events. Sorting events: O((L+Q) log (L+Q)).
 *   Iterate through sorted events: O(L+Q).
 *   Using a `Set` to track active servers: Add/remove is O(1) on average.
 *   Total Time Complexity: O(L log L + Q log Q + (L+Q) log (L+Q)) ≈ O((L+Q) log (L+Q)).
 *   Space Complexity: O(L) for sorted logs, O(Q) for query events, O(N) for active servers set (at most N servers). So, O(L+Q+N).
 *
 *   Refined Event-based Approach:
 *   1. Create a list of `LogEvent` objects. Each `LogEvent` stores `time`, `type` (request, query_start, query_end), `server_id` (for requests), `query_index` (for queries).
 *   2. For each log `[server_id, time]`: Add a `LogEvent(time, REQUEST, server_id)`.
 *   3. For each query `queries[i]` at index `i`:
 *      - Add a `LogEvent(queries[i] - x, QUERY_START, i)`.
 *      - Add a `LogEvent(queries[i], QUERY_END, i)`.
 *   4. Sort all `LogEvent`s. Crucially, when times are equal:
 *      - Process `QUERY_START` before `REQUEST`.
 *      - Process `REQUEST` before `QUERY_END`.
 *      - This ensures that a server requested exactly at `queries[i] - x` is considered active for that window, and a server requested exactly at `queries[i]` is also considered active.
 *   5. Initialize `Set<Integer> activeServers`.
 *   6. Initialize `int[] results` of size `queries.length`.
 *   7. Iterate through sorted `LogEvent`s:
 *      - If `event.type == REQUEST`:
 *          - Add `event.server_id` to `activeServers`.
 *      - If `event.type == QUERY_START`:
 *          - This is the start of a window `[event.time, queries[event.query_index]]`.
 *          - We need to determine how many servers *were not* active *before* this point but *will be* active within the window.
 *          - This logic is tricky. Let's rethink the meaning of the set.
 *
 *   Alternative sliding window on sorted logs, processing queries in order:
 *   1. Sort `logs` by time: O(L log L).
 *   2. Initialize `left = 0`, `activeServers = new HashMap<Integer, Integer>()` (server_id -> count of requests in window), `results = new int[queries.length]`.
 *   3. For `i` from 0 to `queries.length - 1`:
 *      - `queryTime = queries[i]`, `startTime = queryTime - x`.
 *      - Advance `left` pointer: While `left < logs.length` and `logs[left][1] < startTime`:
 *          - `serverId = logs[left][0]`.
 *          - `activeServers.put(serverId, activeServers.get(serverId) - 1);`
 *          - If `activeServers.get(serverId) == 0`:
 *              - `activeServers.remove(serverId);`
 *          - `left++`.
 *      - Now, we need to add servers for the current query up to `queryTime`.
 *      - Find `right` pointer: We need to find the last log that falls within `queryTime`.
 *      - The `left` pointer is at the first log *after* `startTime`.
 *      - We need to iterate from `left` up to the end of logs, but only consider logs with `time <= queryTime`.
 *      - Let's maintain `currentWindowServers = new HashSet<Integer>()` for each query.
 *      - This still looks like O(Q*L) if we iterate logs for each query.
 *
 *   Consider the Example 1: n = 3, logs = [[1,3],[2,6],[1,5]], x = 5, queries = [10,11]
 *   Sorted logs: [[1,3], [1,5], [2,6]]
 *
 *   Query 1: queries[0] = 10, x = 5. Interval: [5, 10].
 *   - Servers requested in [5, 10]:
 *     - [1, 5] -> server 1
 *     - [2, 6] -> server 2
 *   - Unique servers: {1, 2}.
 *   - Servers with zero requests: n - 2 = 3 - 2 = 1 (server 3).
 *
 *   Query 2: queries[1] = 11, x = 5. Interval: [6, 11].
 *   - Servers requested in [6, 11]:
 *     - [2, 6] -> server 2
 *   - Unique servers: {2}.
 *   - Servers with zero requests: n - 1 = 3 - 1 = 2 (servers 1, 3).
 *
 *   Final strategy:
 *   1. Sort `logs` by time: O(L log L).
 *   2. For each query `q` at index `i`:
 *      - Define the time interval `[startTime, endTime] = [q - x, q]`.
 *      - Use two pointers, `logLeft` and `logRight`, to scan the sorted `logs`.
 *      - `logLeft` starts at 0. `logRight` also starts at 0.
 *      - `serversRequested = new HashSet<Integer>()`.
 *      - Iterate `logRight` from 0 to `logs.length - 1`:
 *          - If `logs[logRight][1] <= endTime`:
 *              - Add `logs[logRight][0]` to `serversRequested`.
 *          - Else (current log is past `endTime`):
 *              - Break the inner loop for this query.
 *      - Now, we need to remove servers from `serversRequested` that were requested *before* `startTime`.
 *      - Iterate `logLeft` from 0 up to `logRight` (or the current `logRight` index reached):
 *          - If `logs[logLeft][1] < startTime`:
 *              - If `serversRequested.contains(logs[logLeft][0])`:
 *                  - We need to check if this server has *any other* requests within `[startTime, endTime]`.
 *                  - This implies we need to count occurrences or use a frequency map for servers in the window.
 *
 *   The most efficient solution will likely involve processing queries and logs together, possibly by sorting both or by using a data structure that can answer range queries on server requests.
 *
 *   Let's try the approach using binary search to find log indices for each query.
 *   1. Sort `logs` by time: O(L log L).
 *   2. `results = new int[queries.length]`.
 *   3. For `i` from 0 to `queries.length - 1`:
 *      - `queryTime = queries[i]`.
 *      - `startTime = queryTime - x`.
 *      - `endTime = queryTime`.
 *
 *      - Find `firstLogIndex` (inclusive) for `time >= startTime`:
 *        Use `Arrays.binarySearch` or a custom binary search to find the insertion point.
 *        `Arrays.binarySearch` returns `-(insertion_point) - 1` if not found.
 *        We need a `Comparator` for `binarySearch` or a manual binary search.
 *
 *      - Find `lastLogIndex` (inclusive) for `time <= endTime`:
 *        Similar binary search.
 *
 *      - Let's use `Collections.binarySearch` for clarity on finding indices. We'll need to adapt it for `int[][]`.
 *      - A cleaner way is to define a helper function for binary search on the `logs` array based on time.
 *
 *      - `startIndex = findFirstLogIndex(logs, startTime)` // index of first log with time >= startTime
 *      - `endIndex = findLastLogIndex(logs, endTime)`   // index of last log with time <= endTime
 *
 *      - If `startIndex == -1` or `endIndex == -1` or `startIndex > endIndex`:
 *          - No logs in the interval. All `n` servers are zero-request. `results[i] = n`.
 *          - Continue to the next query.
 *
 *      - `serversInInterval = new HashSet<Integer>()`.
 *      - For `j` from `startIndex` to `endIndex`:
 *          - `serversInInterval.add(logs[j][0])`.
 *
 *      - `results[i] = n - serversInInterval.size()`.
 *
 *   Helper functions for binary search:
 *   `findFirstLogIndex(logs, targetTime)`: returns index of first log with `logs[index][1] >= targetTime`.
 *   `findLastLogIndex(logs, targetTime)`: returns index of last log with `logs[index][1] <= targetTime`.
 *
 *   `findFirstLogIndex`:
 *     `low = 0`, `high = logs.length - 1`, `ans = -1`.
 *     While `low <= high`:
 *       `mid = low + (high - low) / 2`.
 *       If `logs[mid][1] >= targetTime`:
 *         `ans = mid`;
 *         `high = mid - 1`; // Try to find an earlier one
 *       Else (`logs[mid][1] < targetTime`):
 *         `low = mid + 1`;
 *     Return `ans`.
 *
 *   `findLastLogIndex`:
 *     `low = 0`, `high = logs.length - 1`, `ans = -1`.
 *     While `low <= high`:
 *       `mid = low + (high - low) / 2`;
 *       If `logs[mid][1] <= targetTime`:
 *         `ans = mid`;
 *         `low = mid + 1`; // Try to find a later one
 *       Else (`logs[mid][1] > targetTime`):
 *         `high = mid - 1`;
 *     Return `ans`.
 *
 *   Time Complexity:
 *   - Sorting logs: O(L log L).
 *   - For each query:
 *     - Two binary searches: O(log L).
 *     - Iterating through the interval: In the worst case, all L logs can fall into the interval, leading to O(L).
 *   - Total for queries: O(Q * (log L + L)) = O(Q * L). This is still too slow if L is large for many queries.
 *
 *   The issue is that `findLastLogIndex - findFirstLogIndex` can be O(L).
 *
 *   Let's revisit the sliding window approach with two pointers on sorted logs and pre-processing queries.
 *
 *   Correct Sliding Window Approach (Optimized):
 *   1. Sort `logs` by time: O(L log L).
 *   2. Store queries with their original indices: `List<QueryInfo>`. Each `QueryInfo` has `queryTime`, `startTime = queryTime - x`, `endTime = queryTime`, `originalIndex`.
 *   3. Sort `QueryInfo` list by `endTime`: O(Q log Q). This allows processing queries as their windows are entered/exited chronologically.
 *   4. Initialize `results = new int[queries.length]`.
 *   5. Initialize `left = 0` (pointer for logs).
 *   6. Initialize `serverCounts = new HashMap<Integer, Integer>()` to store counts of active servers in the *current* `[logLeft, currentEventTime]` window.
 *   7. Iterate through the sorted `QueryInfo` objects:
 *      - For each `queryInfo`:
 *          - `currentQueryEndTime = queryInfo.endTime`.
 *          - `currentQueryStartTime = queryInfo.startTime`.
 *
 *          - Advance `left` pointer of logs:
 *            While `left < logs.length` AND `logs[left][1] <= currentQueryEndTime`:
 *               `serverId = logs[left][0]`.
 *               `serverCounts.put(serverId, serverCounts.getOrDefault(serverId, 0) + 1);`
 *               `left++`.
 *
 *          - Now, `serverCounts` contains all servers that had *any* request up to `currentQueryEndTime`.
 *          - We need to subtract servers whose *last* request was before `currentQueryStartTime`.
 *
 *          - This still needs refinement. The `serverCounts` map needs to reflect requests strictly within `[startTime, endTime]`.
 *
 *   Let's go back to the `n` servers and count active ones.
 *
 *   Final Correct & Efficient Approach using a Single Pass with Two Pointers on Sorted Logs and Processed Queries:
 *   1. Sort `logs` by time: O(L log L).
 *   2. Create a new array of `QueryEvent`s: For each `queries[i]`, create two events:
 *      - `(queries[i] - x, i, START)`
 *      - `(queries[i], i, END)`
 *      This gives 2Q events.
 *   3. Combine `logs` and `QueryEvent`s into a single list of `TimeEvent` objects.
 *      - `TimeEvent` can be a custom class or a simple `int[]` or `Pair<Integer, Integer>` where `int[0]` is time and `int[1]` encodes type and index.
 *      - For logs: `(time, type = 0, server_id)`
 *      - For query start: `(time, type = 1, query_index)`
 *      - For query end: `(time, type = 2, query_index)`
 *   4. Sort this combined list of `TimeEvent`s. If times are equal, the order matters:
 *      - `START` events should be processed before `LOG` events at the same time. This is because `query - x` is inclusive, so a log exactly at `query - x` should be counted.
 *      - `LOG` events should be processed before `END` events at the same time. This is because `query` is inclusive, so a log exactly at `query` should be counted.
 *      So, order for equal times: `START` (type 1) < `LOG` (type 0) < `END` (type 2). Let's use types: 0 for `LOG`, 1 for `QUERY_START`, 2 for `QUERY_END`.
 *      Correction: The event types for sorting: `QUERY_START` (1), `LOG` (0), `QUERY_END` (2). This is WRONG.
 *      Correct sort order for same times:
 *      - `QUERY_START` (let's say type 0): Server is *out* of the window *before* this time.
 *      - `LOG` (type 1): Server is *in* the window during this time.
 *      - `QUERY_END` (type 2): Server is *out* of the window *after* this time.
 *
 *      Let's define event types carefully for sorting:
 *      - `LOG`: `time`, `server_id`.
 *      - `QUERY_START`: `time`, `query_index`.
 *      - `QUERY_END`: `time`, `query_index`.
 *
 *      Combined list of events:
 *      For each log `[s, t]`: `(t, 0, s)` // Type 0 for log
 *      For each query `queries[i]` at index `i`:
 *        `startTime = queries[i] - x`, `endTime = queries[i]`.
 *        `(startTime, 1, i)` // Type 1 for query start
 *        `(endTime, 2, i)`   // Type 2 for query end
 *
 *      Sort these events primarily by `time`. Secondarily, if times are equal:
 *      `LOG` (0) < `QUERY_START` (1) < `QUERY_END` (2).
 *      This order ensures:
 *      - If a `LOG` occurs at `startTime`, it's counted *after* the `QUERY_START` event for that query, meaning it's within the window.
 *      - If a `LOG` occurs at `endTime`, it's counted *before* the `QUERY_END` event for that query, meaning it's within the window.
 *
 *   5. Initialize `activeServers = new HashSet<Integer>()`.
 *   6. Initialize `results = new int[queries.length]`.
 *   7. Iterate through the sorted combined events:
 *      - If `event.type == 0` (LOG):
 *          - Add `event.server_id` to `activeServers`.
 *      - If `event.type == 1` (QUERY_START):
 *          - This is the start time `q - x`. We need to determine how many servers *currently in `activeServers`* will *not* be in the window up to `q`.
 *          - A different interpretation of the set is needed. The `activeServers` set should contain servers *active in the current sliding window*.
 *
 *   Let's simplify: What is the state we need to maintain? For a given time `t`, which servers have had a request in the interval `[t-x, t]`?
 *   When we process a query `q`, we want to know unique servers that received requests in `[q-x, q]`.
 *
 *   Consider the `logs` sorted by time.
 *   For each query `q`:
 *     We need logs with `time` in `[q-x, q]`.
 *     Let `left_ptr` point to the first log with `time >= q - x`.
 *     Let `right_ptr` point to the last log with `time <= q`.
 *     All logs between `left_ptr` and `right_ptr` (inclusive) are relevant.
 *     The number of unique server IDs in `logs[left_ptr ... right_ptr]` gives the count of active servers.
 *
 *   The efficiency bottleneck is finding `left_ptr` and `right_ptr` for each query, and then potentially iterating over a large range.
 *
 *   The crucial observation for efficiency might be that we are dealing with *counts of unique servers*.
 *   We sort logs. For each query, we identify the range of logs.
 *
 *   Let's use the binary search approach again, but focus on the data structures.
 *   1. Sort `logs` by time: O(L log L).
 *   2. `results = new int[queries.length]`.
 *   3. Create `logTimes = new ArrayList<Integer>()` and `serverIds = new ArrayList<Integer>()` from `logs` to use with `Collections.binarySearch`.
 *   4. For `i` from 0 to `queries.length - 1`:
 *      - `queryTime = queries[i]`.
 *      - `startTime = queryTime - x`.
 *      - `endTime = queryTime`.
 *
 *      - Find `startIndex` (inclusive): the first index `k` such that `logTimes.get(k) >= startTime`.
 *        `startSearchIdx = Collections.binarySearch(logTimes, startTime);`
 *        If `startSearchIdx < 0`, `startSearchIdx = -(startSearchIdx + 1)`. This is the insertion point.
 *
 *      - Find `endIndex` (inclusive): the last index `k` such that `logTimes.get(k) <= endTime`.
 *        `endSearchIdx = Collections.binarySearch(logTimes, endTime);`
 *        If `endSearchIdx < 0`, `endSearchIdx = -(endSearchIdx + 1) - 1`. This points to the element *before* the insertion point.
 *        We need to adjust `endSearchIdx` to point to the last element `<= endTime`.
 *        If `endSearchIdx` is valid (>=0), it might be the index of `endTime`. If `endTime` is not present, the correct insertion point `-(endSearchIdx + 1)` means elements before it are `<= endTime`. So, `endSearchIdx` should be `insertion_point - 1`.
 *
 *      - A more robust way to find `endIndex` for `<= endTime`: find insertion point for `endTime + 1`. The index before that is the last element `<= endTime`.
 *        `endSearchIdx_plus_1 = Collections.binarySearch(logTimes, endTime + 1);`
 *        If `endSearchIdx_plus_1 < 0`, `endSearchIdx_plus_1 = -(endSearchIdx_plus_1 + 1)`.
 *        `endIndex = endSearchIdx_plus_1 - 1`.
 *
 *      - Handle edge cases for `startSearchIdx` and `endIndex`:
 *        If `startSearchIdx >= logTimes.size()` or `endIndex < 0` or `startSearchIdx > endIndex`:
 *           `results[i] = n`.
 *           continue.
 *
 *      - `serversInInterval = new HashSet<Integer>()`.
 *      - For `j` from `startSearchIdx` to `endIndex`:
 *          `serversInInterval.add(serverIds.get(j))`.
 *
 *      - `results[i] = n - serversInInterval.size()`.
 *
 *   Time Complexity:
 *   - Sorting logs: O(L log L).
 *   - Creating `logTimes` and `serverIds`: O(L).
 *   - For each query:
 *     - Two binary searches on `logTimes`: O(log L).
 *     - Iterating from `startSearchIdx` to `endIndex`: In the worst case, this range can contain O(L) elements. Example: all logs are within `[q-x, q]`.
 *   - Total for queries: O(Q * (log L + L)) = O(Q * L). Still O(Q*L). This is the fundamental issue if the range of logs for a query is large.
 *
 *   The provided constraints (n, logs.length, queries.length <= 10^5) strongly suggest a solution better than O(Q*L). This points towards an O((L+Q)log(L+Q)) or O(L log L + Q) or O(L log L + Q log Q) complexity.
 *
 *   The correct approach must involve processing logs and queries in a combined, ordered manner.
 *
 *   Let's consider the event-based approach one last time.
 *
 *   1. Create a list of events. Each event has a `time`.
 *      - For each log `[server_id, time]`: Add event `(time, TYPE_LOG, server_id)`.
 *      - For each query `queries[i]` at index `i`:
 *          - `startTime = queries[i] - x`
 *          - `endTime = queries[i]`
 *          - Add event `(startTime, TYPE_QUERY_START, i)`.
 *          - Add event `(endTime, TYPE_QUERY_END, i)`.
 *
 *   2. Sort the events. The sort order for equal times is crucial:
 *      - `TYPE_QUERY_START` (let's use value 0)
 *      - `TYPE_LOG` (value 1)
 *      - `TYPE_QUERY_END` (value 2)
 *      This order means:
 *      - When `time = query_start_time`: The `QUERY_START` event is processed first. This means any log *exactly* at `query_start_time` should be considered *after* this event, so it's included in the `[query_start_time, query_end_time]` window.
 *      - When `time = query_end_time`: The `LOG` events at this time are processed first. Then `QUERY_END`. This means logs at `query_end_time` are included.
 *      So, the order for equal times should be: `QUERY_START` < `LOG` < `QUERY_END`.
 *
 *   3. Initialize `results = new int[queries.length]`.
 *   4. Initialize `activeServers = new HashSet<Integer>()`.
 *   5. Initialize `queryWindowActiveServers = new HashMap<Integer, Integer>()` to store the count of *unique* servers that have been active within the window for each query. This is not quite right.
 *
 *   Let's think about what `activeServers` should represent.
 *   When we are at time `t`, and `activeServers` contains `server_id`s that have had requests in `[t - x, t]`.
 *
 *   Consider processing the events in sorted order.
 *   When we encounter a `LOG` event `(time, TYPE_LOG, server_id)`:
 *      - We need to consider which queries' windows this `server_id` is now part of.
 *      - This suggests that `activeServers` needs to be a count of requests for each server, not just presence.
 *
 *   Let's try the `HashMap<Integer, Integer>` for server counts.
 *   1. Sort `logs` by time: O(L log L).
 *   2. `results = new int[queries.length]`.
 *   3. `left = 0` (pointer for logs).
 *   4. `serverCounts = new HashMap<Integer, Integer>()` // server_id -> count of requests in current window.
 *   5. For `i` from 0 to `queries.length - 1`:
 *      - `queryTime = queries[i]`.
 *      - `startTime = queryTime - x`.
 *      - `endTime = queryTime`.
 *
 *      - Advance `left` pointer:
 *        While `left < logs.length` and `logs[left][1] < startTime`:
 *           `serverId = logs[left][0]`.
 *           `serverCounts.put(serverId, serverCounts.get(serverId) - 1);`
 *           if `serverCounts.get(serverId) == 0`:
 *              `serverCounts.remove(serverId);`
 *           `left++`.
 *
 *      - Now, `serverCounts` has counts of servers whose requests are `>= startTime`.
 *      - We need to add servers whose requests are `<= endTime` and were not removed by the `left` pointer.
 *      - The problem is that the `left` pointer only moves forward. We might need to re-scan logs for the current query to add new servers that fall into `[startTime, endTime]`.
 *
 *   This points to the O((L+Q) log (L+Q)) approach being the correct one conceptually.
 *
 *   Refined Event-based Approach (Final Attempt):
 *   1. Define an `Event` class/structure: `time`, `type` (0: LOG, 1: QUERY_START, 2: QUERY_END), `id` (server_id for LOG, query_index for QUERY).
 *   2. Create a list of `Event` objects:
 *      - For each log `[server_id, time]`: Add `new Event(time, 0, server_id)`.
 *      - For each query `queries[i]` at index `i`:
 *          - `startTime = queries[i] - x`.
 *          - `endTime = queries[i]`.
 *          - Add `new Event(startTime, 1, i)`.
 *          - Add `new Event(endTime, 2, i)`.
 *   3. Sort the `events` list:
 *      - Primary key: `time` (ascending).
 *      - Secondary key (if `time` is equal): `type` (ascending: 0 < 1 < 2).
 *        This order ensures:
 *        - QUERY_START is processed before LOGs at the same time.
 *        - LOGs are processed before QUERY_ENDs at the same time.
 *
 *   4. Initialize `results = new int[queries.length]`.
 *   5. Initialize `activeServers = new HashSet<Integer>()`. This set will track servers that have had at least one request within the *current overall time sweep* up to the current event time, and we'll adjust for query windows.
 *   6. Initialize `currentActiveServersForQuery = new HashMap<Integer, Integer>()`. This map will store, for each query index, the count of servers that are active *within that query's window*.
 *
 *   7. Iterate through sorted `events`:
 *      - If `event.type == 0` (LOG):
 *          - `serverId = event.id`.
 *          - Add `serverId` to `activeServers`. (This `activeServers` is tracking all servers that have ever received a request up to `event.time`. This is not what we want.)
 *
 *   Let's reconsider the meaning of the set. What if the set tracks servers that *have had requests in the current sliding window* that is defined by the overall time sweep?
 *
 *   Correct Event-based Approach (Final Final):
 *   1. Create a list of `Event` objects. Each `Event` has `time`, `type`, and `data` (server_id or query_index).
 *      - `type = 0`: LOG. `data = server_id`.
 *      - `type = 1`: QUERY_START. `data = query_index`.
 *      - `type = 2`: QUERY_END. `data = query_index`.
 *   2. Populate events:
 *      - For each log `[s, t]`: Add `new Event(t, 0, s)`.
 *      - For each query `queries[i]` at index `i`:
 *          - `startTime = queries[i] - x`.
 *          - `endTime = queries[i]`.
 *          - Add `new Event(startTime, 1, i)`.
 *          - Add `new Event(endTime, 2, i)`.
 *   3. Sort `events` by `time`. Tie-breaking: `QUERY_START` (1) < `LOG` (0) < `QUERY_END` (2). (The sorting order of types needs to be correct. For equal times: process STARTs first, then LOGs, then ENDs. So, type values should be such that `START < LOG < END`. Let `START=0`, `LOG=1`, `END=2`).
 *      So, `type`: 0 for QUERY_START, 1 for LOG, 2 for QUERY_END.
 *
 *   4. Initialize `results = new int[queries.length]`.
 *   5. Initialize `activeServers = new HashSet<Integer>()`. This set will store servers that have been active in the time span *covered by the current sweep of events*.
 *   6. Iterate through sorted `events`:
 *      - If `event.type == 1` (QUERY_START):
 *          - This is the start of the window `[event.time, queries[event.data]]`.
 *          - The number of servers *not* requested in this window is `n - current_count`.
 *          - The number of servers *requested* in this window is the size of `activeServers` that have a request in `[event.time, queries[event.data]]`.
 *          - This is still tricky because `activeServers` grows monotonically.
 *
 *   The problem is essentially a 2D range query or offline processing problem.
 *
 *   Let's stick to the binary search on sorted logs, but optimize the counting of unique servers.
 *   1. Sort `logs` by time: O(L log L).
 *   2. Store `logTimes` and `serverIds` separately.
 *   3. For each query `q` at index `i`:
 *      - `startTime = q - x`, `endTime = q`.
 *      - Find `startIdx` (first log >= `startTime`).
 *      - Find `endIdx` (last log <= `endTime`).
 *      - If `startIdx > endIdx`, `results[i] = n`, continue.
 *      - We need to count unique servers in `serverIds` from `startIdx` to `endIdx`.
 *      - If the range `endIdx - startIdx + 1` is small, direct `HashSet` is fine.
 *      - If the range is large, we need something faster.
 *      - This implies we need to answer "count distinct elements in a range" efficiently.
 *      - This is a classic problem often solved offline with a Fenwick tree (BIT) or segment tree.
 *
 *   Offline Approach with Fenwick Tree (BIT):
 *   1. Sort `logs` by time: O(L log L).
 *   2. Create `QueryInfo` objects: `(queryTime, startTime, queryIndex)`. Store only `startTime` and `queryIndex` because `endTime` is implicitly `queryTime`.
 *   3. Sort `QueryInfo` objects by `queryTime` (which is the `endTime` of the interval). O(Q log Q).
 *   4. Initialize `results = new int[queries.length]`.
 *   5. Initialize `BIT` of size `n + 1` (or `max_server_id`).
 *   6. Initialize `lastRequestTime = new HashMap<Integer, Integer>()` mapping `server_id` to its latest request time.
 *   7. Use two pointers: `logPtr = 0` for logs, `queryPtr = 0` for sorted queries.
 *
 *   8. Iterate while `queryPtr < Q`:
 *      - `currentQueryInfo = sortedQueries[queryPtr]`.
 *      - `currentQueryEndTime = currentQueryInfo.queryTime`.
 *      - `currentQueryStartTime = currentQueryInfo.startTime`.
 *      - `currentQueryIndex = currentQueryInfo.queryIndex`.
 *
 *      - Process logs up to `currentQueryEndTime`:
 *        While `logPtr < L` and `logs[logPtr][1] <= currentQueryEndTime`:
 *           `serverId = logs[logPtr][0]`.
 *           `logTime = logs[logPtr][1]`.
 *
 *           // If this server had a previous request, remove its contribution from BIT at its old position.
 *           if `lastRequestTime.containsKey(serverId)`:
 *              `previousTime = lastRequestTime.get(serverId)`.
 *              // Need to map server ID to BIT index. Assuming server IDs are 1-based.
 *              `BIT.update(serverId, -1)`. // Remove old contribution
 *
 *           // Add the current request's contribution.
 *           `BIT.update(serverId, 1)`. // Add new contribution
 *           `lastRequestTime.put(serverId, logTime)`.
 *           `logPtr++`.
 *
 *      - Now, the BIT contains the *latest* request time for each server that has had a request up to `currentQueryEndTime`.
 *      - We need to count servers whose latest request time is `>= currentQueryStartTime`.
 *      - This requires the BIT to store counts based on *time* or use a different structure.
 *
 *   The standard BIT approach for distinct elements in a range relies on processing queries sorted by their right endpoint.
 *   When we process a log `(time, server_id)`:
 *   1. If `server_id` was seen before at `prev_time`, remove its contribution from BIT at `prev_time` index.
 *   2. Add its contribution to BIT at `time` index.
 *   When we process a query `(query_time, query_index)`:
 *   The answer for this query is `BIT.query(query_time)`.
 *
 *   This counts *distinct elements up to `query_time`*. We need distinct elements in `[q-x, q]`.
 *
 *   Let's rephrase the problem: for each query `q`, count servers `s` such that there exists a log `(s, t)` where `q - x <= t <= q`.
 *
 *   Consider the sorted logs. For a query `q`, we are interested in logs in `[q-x, q]`.
 *
 *   Final Strategy: Binary Search on Logs for Each Query, but with Optimization on Counting Unique Servers.
 *   1. Sort `logs` by time: O(L log L).
 *   2. For each query `i` from 0 to Q-1:
 *      - `q_time = queries[i]`, `start_time = q_time - x`, `end_time = q_time`.
 *      - Find `first_log_idx` such that `logs[first_log_idx][1] >= start_time` using binary search.
 *      - Find `last_log_idx` such that `logs[last_log_idx][1] <= end_time` using binary search.
 *      - If `first_log_idx > last_log_idx` or no logs found, `results[i] = n`.
 *      - Else, we need to count unique servers in `logs[first_log_idx...last_log_idx]`.
 *      - This is the "count distinct elements in a range" subproblem.
 *
 *      - Since we are processing queries offline, we can sort queries by `end_time`.
 *      - Create `QueryInfo` objects: `(query_idx, query_time, start_time, end_time)`.
 *      - Sort `QueryInfo` by `end_time`: O(Q log Q).
 *      - Use a Fenwick Tree (BIT) of size `n+1` (or max server ID + 1).
 *      - `last_occurrence = new HashMap<Integer, Integer>()` mapping `server_id` to its latest *index* in the BIT.
 *      - `log_idx = 0`.
 *      - Iterate through sorted `QueryInfo`:
 *          - For current `query = sorted_queries[i]`:
 *              - Process logs up to `query.end_time`:
 *                While `log_idx < logs.length` and `logs[log_idx][1] <= query.end_time`:
 *                   `server_id = logs[log_idx][0]`.
 *                   `log_time = logs[log_idx][1]`.
 *
 *                   // If this server was seen before, remove its old entry from BIT.
 *                   if `last_occurrence.containsKey(server_id)`:
 *                       `BIT.update(last_occurrence.get(server_id), -1)`.
 *
 *                   // Add this server's current occurrence to BIT. We map server ID to its index in BIT.
 *                   // If server IDs are large, map them to smaller indices or use map for BIT indices.
 *                   // Assuming server IDs are 1-based and up to N.
 *                   `BIT.update(server_id, 1)`.
 *                   `last_occurrence.put(server_id, server_id)`. // Store the server_id itself as the index in BIT.
 *                   `log_idx++`.
 *
 *              - Now the BIT contains unique servers active up to `query.end_time`.
 *              - We need to count those whose last occurrence was at or after `query.start_time`.
 *              - This requires querying the BIT for a range of server IDs based on their *latest time*.
 *              - The standard BIT for distinct elements in range [L, R] based on *index* works like this:
 *                `count_distinct(L, R) = query(R) - query(L-1)`. This requires BIT indices to correspond to array indices.
 *
 *              - We need to map server IDs to indices in BIT (e.g., if server IDs are sparse).
 *              - Let's assume server IDs are `1..N`.
 *
 *              - The number of unique servers active up to `query.end_time` whose latest request time is `>= query.start_time`.
 *              - This is not directly solvable by a simple BIT on server IDs.
 *
 *              - The problem is asking for the number of unique servers `s` such that `exists log (s, t)` with `q - x <= t <= q`.
 *              - The BIT should be indexed by time.
 *              - If BIT[t] stores count of servers whose *latest* request was at time `t`.
 *              - When processing a log `(s, time)`:
 *                  - if `s` was seen at `prev_time`: `BIT.update(prev_time, -1)`.
 *                  - `BIT.update(time, 1)`.
 *                  - `last_request_time.put(s, time)`.
 *              - For a query `(q_idx, q_time, start_time)`:
 *                  - The result is `BIT.query_range(start_time, q_time)`.
 *              - The maximum time is 10^6, so BIT size is feasible.
 *
 *   Final Strategy using BIT indexed by time:
 *   1. Sort `logs` by time: O(L log L).
 *   2. Create `QueryInfo` objects: `(query_idx, q_time, start_time)`. `end_time` is `q_time`.
 *   3. Sort `QueryInfo` objects by `q_time` (ascending). O(Q log Q).
 *   4. Initialize `results = new int[queries.length]`.
 *   5. Initialize `BIT` of size `10^6 + 2` (max time + safety margin). Fenwick tree for point updates and range sums.
 *   6. `lastRequestTime = new HashMap<Integer, Integer>()` mapping `server_id` to its latest request time.
 *   7. `log_ptr = 0`.
 *   8. Iterate through sorted `QueryInfo`:
 *      - For current `query = sortedQueries[i]`:
 *          - `q_idx = query.query_idx`.
 *          - `q_time = query.q_time`.
 *          - `start_time = query.start_time`.
 *
 *          - Process logs up to `q_time`:
 *            While `log_ptr < L` and `logs[log_ptr][1] <= q_time`:
 *               `serverId = logs[log_ptr][0]`.
 *               `logTime = logs[log_ptr][1]`.
 *
 *               // If this server had a previous request, remove its contribution from BIT at its old time.
 *               if `lastRequestTime.containsKey(serverId)`:
 *                  `previousTime = lastRequestTime.get(serverId)`.
 *                  `BIT.update(previousTime, -1)`. // Remove count at previous time
 *
 *               // Add the current request's contribution.
 *               `BIT.update(logTime, 1)`. // Add count at current time
 *               `lastRequestTime.put(serverId, logTime)`.
 *               `log_ptr++`.
 *
 *          - After processing all logs up to `q_time`, the BIT represents `count of servers whose latest request was at time t`.
 *          - We need to count servers whose latest request time `t_latest` satisfies `start_time <= t_latest <= q_time`.
 *          - This is a range sum query on the BIT: `BIT.query(q_time) - BIT.query(start_time - 1)`.
 *          - `results[q_idx] = BIT.query(q_time) - BIT.query(start_time - 1)`.
 *
 *   Time Complexity:
 *   - Sorting logs: O(L log L).
 *   - Creating and sorting queries: O(Q log Q).
 *   - BIT operations (update, query): O(log T), where T is max time (10^6).
 *   - Total for BIT processing: O((L+Q) log T).
 *   - Overall: O(L log L + Q log Q + (L+Q) log T). This is efficient.
 *
 *   Space Complexity:
 *   - `logs`: O(L).
 *   - `queries`: O(Q).
 *   - `BIT`: O(T).
 *   - `lastRequestTime`: O(N).
 *   - `QueryInfo`: O(Q).
 *   - Overall: O(L + Q + T + N).
 *
 *   Max T = 10^6, N = 10^5. This is feasible.
 */

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {

    // Fenwick Tree (Binary Indexed Tree) implementation
    private static class FenwickTree {
        private int[] tree;
        private int size;

        // Constructor: initializes the tree with a given size
        public FenwickTree(int size) {
            this.size = size;
            this.tree = new int[size + 1]; // 1-based indexing for the tree
        }

        // Updates the value at a specific index by 'delta'
        // Adds 'delta' to the element at 'index' and propagates the change up the tree.
        public void update(int index, int delta) {
            // Ensure index is within bounds and use 1-based indexing for the tree
            index++; // Convert to 1-based index
            while (index <= size) {
                tree[index] += delta;
                index += index & (-index); // Move to the next parent node
            }
        }

        // Queries the prefix sum up to a specific index
        // Returns the sum of elements from index 0 up to 'index' (inclusive).
        public int query(int index) {
            // Ensure index is within bounds and use 1-based indexing for the tree
            index++; // Convert to 1-based index
            int sum = 0;
            while (index > 0) {
                sum += tree[index];
                index -= index & (-index); // Move to the next ancestor node
            }
            return sum;
        }

        // Queries the sum of elements in a range [left, right] (inclusive)
        public int queryRange(int left, int right) {
            if (left > right) {
                return 0;
            }
            return query(right) - query(left - 1);
        }
    }

    // Helper class to store query information for offline processing
    private static class QueryInfo {
        int queryIndex;     // Original index of the query
        int queryTime;      // The query's end time (q)
        int startTime;      // The query's start time (q - x)

        QueryInfo(int queryIndex, int queryTime, int startTime) {
            this.queryIndex = queryIndex;
            this.queryTime = queryTime;
            this.startTime = startTime;
        }
    }

    // Method to count zero request servers
    public int[] countZeroRequestServers(int n, int[][] logs, int x, int[] queries) {
        // 1. Sort logs by time in ascending order.
        // This is crucial for processing events chronologically.
        Arrays.sort(logs, Comparator.comparingInt(a -> a[1]));

        // 2. Create a list of QueryInfo objects.
        // Each object stores the query's original index, its end time, and its start time.
        // We will sort these queries by their end time for offline processing.
        List<QueryInfo> queryInfos = new ArrayList<>();
        for (int i = 0; i < queries.length; i++) {
            queryInfos.add(new QueryInfo(i, queries[i], queries[i] - x));
        }

        // 3. Sort QueryInfo objects by their end time (queryTime).
        // This allows us to process queries in the order their time windows close.
        Collections.sort(queryInfos, Comparator.comparingInt(q -> q.queryTime));

        // 4. Initialize results array.
        int[] results = new int[queries.length];

        // 5. Initialize Fenwick Tree (BIT).
        // The BIT will be indexed by time. The maximum time is 10^6.
        // tree[t] will store the count of servers whose *latest* request was at time 't'.
        // We add a buffer (e.g., +2) to handle indices up to max_time.
        int maxTime = 0;
        for (int[] log : logs) {
            maxTime = Math.max(maxTime, log[1]);
        }
        for (int query : queries) {
            maxTime = Math.max(maxTime, query);
        }
        FenwickTree bit = new FenwickTree(maxTime + 1); // Size up to max possible time

        // 6. Initialize a map to store the last request time for each server.
        // This is needed to correctly update the BIT when a server's request time changes.
        // Key: server_id, Value: latest request time.
        Map<Integer, Integer> lastRequestTime = new HashMap<>();

        // 7. Use two pointers: logPtr for iterating through sorted logs, queryPtr for sorted queries.
        int logPtr = 0;

        // 8. Iterate through the sorted QueryInfo objects.
        for (QueryInfo queryInfo : queryInfos) {
            int queryIndex = queryInfo.queryIndex;
            int queryEndTime = queryInfo.queryTime;
            int queryStartTime = queryInfo.startTime;

            // Process all logs whose time is less than or equal to the current query's end time.
            // This ensures that our BIT reflects all requests up to the current query's end time.
            while (logPtr < logs.length && logs[logPtr][1] <= queryEndTime) {
                int serverId = logs[logPtr][0];
                int logTime = logs[logPtr][1];

                // If this server had a previous request, its previous time contribution
                // needs to be removed from the BIT.
                if (lastRequestTime.containsKey(serverId)) {
                    int previousTime = lastRequestTime.get(serverId);
                    // Decrement the count at the previous request time in the BIT.
                    bit.update(previousTime, -1);
                }

                // Add the current request's contribution to the BIT at the current log time.
                // This means the server's latest request is now at 'logTime'.
                bit.update(logTime, 1);

                // Update the last request time for this server.
                lastRequestTime.put(serverId, logTime);

                // Move to the next log.
                logPtr++;
            }

            // After processing logs up to queryEndTime, the BIT contains counts of servers
            // whose latest request time is 't'.
            // We need to count servers whose latest request time 't_latest' falls within
            // the query's interval: queryStartTime <= t_latest <= queryEndTime.
            // This is equivalent to a range sum query on the BIT from queryStartTime to queryEndTime.
            //
            // The result for this query is the number of unique servers active in the interval.
            // If a server's latest request is at time 't', and start_time <= t <= query_time,
            // then that server had a request in the interval [query_time - x, query_time].
            //
            // The queryRange(start, end) on the BIT gives the sum of values from index 'start' to 'end'.
            // Here, indices are times. So, it counts servers whose latest request was between start_time and query_time.
            results[queryIndex] = bit.queryRange(queryStartTime, queryEndTime);
        }

        // 9. Return the results array.
        return results;
    }
}
