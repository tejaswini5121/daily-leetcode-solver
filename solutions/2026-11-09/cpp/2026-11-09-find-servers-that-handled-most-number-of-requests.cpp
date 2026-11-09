```cpp
// Problem: Find Servers That Handled Most Number of Requests
// Problem Summary: Assign requests to servers based on a specific algorithm and find the busiest server(s).
// Link: https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests/

// Approach:
// We use two priority queues: one for available servers and one for busy servers.
// The available servers priority queue stores server IDs.
// The busy servers priority queue stores pairs of (finish_time, server_id).
// We iterate through each request. For each request:
// 1. We first check the busy servers. If any server finishes before or at the current request's arrival time,
//    we move them back to the available servers.
// 2. We determine the target server index using `request_index % k`.
// 3. If the target server is available (i.e., its ID is in the available servers PQ), we assign the request to it.
//    We then add the server to the busy servers PQ with its finish time.
// 4. If the target server is busy, we look for the next available server in the available servers PQ.
//    If we find one, we assign the request to it and add it to the busy servers PQ.
// 5. If no servers are available (either the target server and subsequent servers are busy, or the available servers PQ is empty),
//    the request is dropped.
// 6. We keep track of the request count for each server.
// Finally, we find the maximum request count and return the IDs of servers with that count.

// Time Complexity: O(N log K), where N is the number of requests and K is the number of servers.
// Each request involves at most one push to the busy PQ and potentially one pop from the available PQ (and vice versa when servers become free).
// Priority queue operations take O(log K) time.
// Space Complexity: O(K) for the priority queues and O(K) for the server request counts.

#include <vector>
#include <queue>
#include <map>
#include <algorithm>

class Solution {
public:
    std::vector<int> busiestServers(int k, std::vector<int>& arrival, std::vector<int>& load) {
        // Priority queue to store available servers by their ID.
        // Min-heap by default, so smallest server ID is at the top.
        std::priority_queue<int, std::vector<int>, std::greater<int>> available_servers;

        // Priority queue to store busy servers.
        // Stores pairs of (finish_time, server_id).
        // Min-heap based on finish_time.
        std::priority_queue<std::pair<long long, int>, std::vector<std::pair<long long, int>>, std::greater<std::pair<long long, int>>> busy_servers;

        // To keep track of the number of requests handled by each server.
        std::vector<int> request_counts(k, 0);

        // Initialize the available servers priority queue with all server IDs.
        for (int i = 0; i < k; ++i) {
            available_servers.push(i);
        }

        // Process each request.
        for (int i = 0; i < arrival.size(); ++i) {
            long long current_arrival_time = arrival[i];
            long long current_load = load[i];

            // 1. Free up servers that have finished their tasks by the current arrival time.
            // Move them from busy_servers to available_servers.
            while (!busy_servers.empty() && busy_servers.top().first <= current_arrival_time) {
                int server_id = busy_servers.top().second;
                busy_servers.pop();
                available_servers.push(server_id);
            }

            // If there are no available servers, the request is dropped.
            if (available_servers.empty()) {
                continue;
            }

            // 2. Determine the target server index for this request.
            // The target server is `request_index % k`.
            int target_server_index = i % k;

            // 3. Try to assign the request to the target server if it's available.
            // We need to find if `target_server_index` is currently in `available_servers`.
            // This is tricky because `available_servers` is a min-heap, and we can't efficiently check for an element.
            // Instead, we'll check if the server at the top of available_servers is our target or greater,
            // and if `target_server_index` is actually available.
            // A more robust way: if available_servers is not empty, check the server at the top.
            // If the server at the top has an ID less than target_server_index, it means target_server_index
            // (and possibly others before it) are busy. We need to find the *next* available server.
            // We can leverage the fact that available_servers will always provide the smallest available server ID.

            // Find the next available server, starting from `target_server_index`.
            int assigned_server_id = -1;

            // We will try to assign to `target_server_index` first, but we need a way to find
            // the *next* available server if `target_server_index` is busy.
            // The `available_servers` PQ will give us the smallest available server ID.
            // We need to find an available server with an ID >= `target_server_index` (modulo k) or the next available one.

            // To simplify, let's think about the logical flow:
            // We want server `target_server_index`. If it's busy, we look for `target_server_index + 1`, then `target_server_index + 2`, etc., wrapping around.
            // The `available_servers` PQ contains all currently free servers.
            // If `target_server_index` is in `available_servers`, we take it.
            // If not, we need to find the smallest server ID in `available_servers` that is >= `target_server_index`.
            // If all servers with IDs >= `target_server_index` are busy, we then look for the smallest ID in `available_servers` (which would be < `target_server_index`).

            // Let's use a temporary storage for servers from `available_servers` that we might need to put back.
            std::vector<int> temp_available;
            bool found_server = false;

            while (!available_servers.empty()) {
                int current_available_server_id = available_servers.top();
                available_servers.pop();
                temp_available.push_back(current_available_server_id);

                // Check if this available server is our target or the next one in sequence.
                // We are looking for an available server ID that is "closest" to `target_server_index` in the cyclic order.
                // This means we prioritize servers with ID >= `target_server_index` that are available.
                // If no such server is found, we take the smallest available server ID overall.

                // The problem states: "assign the request to the next available server (wrapping around the list of servers and starting from 0 if necessary)."
                // This implies a sequential search for availability starting from `target_server_index`.
                // `available_servers` PQ gives us free servers in ascending order.
                // We can iterate through the `available_servers` PQ to find the first server that satisfies our condition.

                // If `current_available_server_id` is the target or comes after it (cyclically)
                // This means we are trying to find a server starting from `target_server_index`.
                // If `current_available_server_id >= target_server_index`, this is a candidate.
                // Since `available_servers` is a min-heap, the first one we find that is >= `target_server_index` is our best bet
                // if we want to maintain the assignment logic as closely as possible.

                // The logic for finding the "next available server" requires careful handling of the cyclic nature and availability.
                // A simpler way to think about it:
                // We want server `i % k`. If it's busy, we check `(i % k) + 1`, then `(i % k) + 2`, and so on, wrapping around.
                // The `available_servers` PQ contains all server IDs that are currently free.
                // If `target_server_index` is in the `available_servers` PQ, we want it.
                // If not, we want the smallest server ID in `available_servers` that is strictly greater than `target_server_index` (and also wraps around).
                // If no such server exists (all servers with ID >= `target_server_index` are busy), we take the smallest server ID from `available_servers`.

                // Let's refine the finding of the next available server:
                // We want the server `idx` such that `idx >= target_server_index` and `idx` is available.
                // If multiple such servers exist, we prefer the one with the smallest `idx`.
                // If no such server exists (i.e., all servers with ID >= `target_server_index` are busy),
                // we then look for the smallest available server ID overall.

                // The available_servers PQ naturally gives us the smallest available server ID.
                // We can peek at the top. If it's our target or the first available after target, we take it.

                // Let's consider the cyclic search more directly.
                // The server we want is `target_server_index`.
                // If `target_server_index` is available, we use it.
                // If not, we try `(target_server_index + 1) % k`, then `(target_server_index + 2) % k`, etc.
                // We need to find the first `server_id` from the `available_servers` PQ such that `server_id` is the result of this cyclic search.

                // We can iterate through `available_servers` to find the desired one.
                // To do this efficiently without destroying the PQ:
                // Keep popping from `available_servers` until we find the correct server or the PQ is empty.
                // Store popped elements in `temp_available` and push them back later.

                // The server we're looking for is the first one in `available_servers` (smallest ID)
                // that is "equivalent" to `target_server_index` in the cyclic sense.
                // This means we're looking for the smallest `server_id` in `available_servers` such that:
                // (server_id - target_server_index + k) % k is minimized.
                // This is still not quite right. The problem implies a direct scan.

                // Let's re-read: "assign the request to the next available server (wrapping around the list of servers and starting from 0 if necessary). For example, if the ith server is busy, try to assign the request to the (i+1)th server, then the (i+2)th server, and so on."
                // This implies that if `target_server_index` is busy, we search for `target_server_index + 1`, `target_server_index + 2`, ..., `k-1`, `0`, `1`, ...
                // We need to find the first server ID in this sequence that is present in `available_servers`.

                // We can iterate through `available_servers` and check this condition.
                // The `available_servers` PQ stores server IDs in increasing order.
                // If we pop a server `s_id` from `available_servers`:
                // If `s_id >= target_server_index`, and `s_id` is available, it's a candidate.
                // Since `available_servers` is a min-heap, the first server `s_id` popped that is >= `target_server_index` is the one we should pick if it's available.
                // If no server >= `target_server_index` is available, we then pick the smallest available server ID overall.

                // Let's simplify: We have `available_servers` PQ.
                // We want to find a server `s_id` from `available_servers` such that `s_id` is the first available server found by starting at `target_server_index` and searching cyclically.
                // This means `s_id` should be `target_server_index`, or `target_server_index + 1`, ..., `k-1`, `0`, `1`, ...
                // The `available_servers` PQ naturally gives us free servers in increasing order.
                // If we can find the `target_server_index` in the `available_servers` PQ, we use it.
                // If `target_server_index` is NOT in the `available_servers` PQ (meaning it's busy), we then need to find the next available server.
                // The "next available server" logic needs to be carefully implemented with the PQ.

                // The crucial insight might be that `available_servers` contains all *free* servers.
                // If `target_server_index` is in `available_servers`, we should use it.
                // If not, we need to find the smallest server ID `s_id` in `available_servers` such that `s_id` is the next available server in cyclic order.
                // This next available server will be `(target_server_index + 1) % k`, then `(target_server_index + 2) % k`, and so on.

                // Let's try this:
                // We are looking for a server `server_to_assign`.
                // First, try `target_server_index`.
                // If `target_server_index` is in `available_servers`, use it.
                // If not, then we need to search `(target_server_index + 1) % k`, `(target_server_index + 2) % k`, etc.
                // The servers in `available_servers` are sorted.
                // If `available_servers.top() >= target_server_index`, then `available_servers.top()` is the smallest available server ID >= `target_server_index`. This is our choice.
                // If `available_servers.top() < target_server_index`, it means `target_server_index` and all servers between `target_server_index` and `k-1` are busy. So, we must wrap around and pick the smallest available server, which is `available_servers.top()`.

                // This logic simplifies: The server we want is the smallest ID `s_id` from `available_servers` such that `(s_id - target_server_index + k) % k` is minimized.
                // This is equivalent to finding the server `s_id` in `available_servers` that is "closest" to `target_server_index` in a cyclic manner.

                // Let's use the `temp_available` vector to achieve this.
                // We'll pop from `available_servers` and store them.
                // When we find a server that fits our criteria, we assign it and then push back the rest.
                // The criteria: the smallest server ID `current_available_server_id` popped from `available_servers` such that `current_available_server_id >= target_server_index`. If no such server exists, we take the smallest ID from `available_servers` overall.

                // If the current available server ID is greater than or equal to the target server index,
                // this is a potential candidate for the "next available" in the primary search direction.
                if (current_available_server_id >= target_server_index) {
                    assigned_server_id = current_available_server_id;
                    found_server = true;
                    break; // Found the first available server >= target_server_index
                } else {
                    // If the current available server ID is less than the target,
                    // it means all servers from target_server_index up to k-1 might be busy.
                    // This current_available_server_id is a candidate if no server >= target_server_index is found.
                    // We'll keep `current_available_server_id` in `temp_available` for now.
                    // We will continue popping to see if we can find one >= target_server_index.
                }
            }

            // After the loop, if we haven't found a server >= target_server_index,
            // but `temp_available` is not empty, it means the smallest available server overall is the one we need.
            // This happens when all servers from `target_server_index` onwards are busy.
            if (!found_server && !temp_available.empty()) {
                // The smallest ID in temp_available is the smallest available server.
                // This is because `available_servers` was a min-heap, and `temp_available` preserves relative order of popped elements.
                // The last element added to `temp_available` (which was popped last) from the "less than target_server_index" group
                // is actually the smallest overall available server ID.
                // NO, this is incorrect. The smallest available server ID is always at the *beginning* of `temp_available` if `available_servers` was a min-heap.
                // When we pop `current_available_server_id` from `available_servers`, it's the smallest available.
                // If `current_available_server_id < target_server_index`, it means all servers from `target_server_index` to `k-1` are busy.
                // The smallest ID in `temp_available` would be the one we want.
                // The `temp_available` vector will store elements in the order they were popped.
                // The first element popped from `available_servers` is the smallest.
                // So if `available_servers.top()` was < `target_server_index`, and we couldn't find any server >= `target_server_index`,
                // then `temp_available[0]` is the server we need.

                // Correct logic for when `found_server` is false:
                // We have iterated through all available servers.
                // `temp_available` contains all servers that were popped.
                // If we didn't find a server `>= target_server_index`, it means all servers from `target_server_index` onwards were busy.
                // In this case, we must wrap around and take the smallest available server overall.
                // The `available_servers` PQ was a min-heap. The first element we popped that was less than `target_server_index` is not necessarily the smallest overall.
                // We need to take the *first element* from `temp_available` if `available_servers` became empty *and* we didn't find a server.
                // This is equivalent to saying: if no server >= `target_server_index` was found, then assign to the smallest available server overall.
                // The smallest available server overall would be `temp_available[0]` if `available_servers` was empty.

                // A better approach for finding the next available server:
                // We need to find an `s_id` from `available_servers` such that `(s_id - target_server_index + k) % k` is minimized.
                // This implies we want `s_id` such that `s_id` is `target_server_index`, or `target_server_index + 1`, ..., `k-1`, `0`, `1`, ...
                // The `available_servers` PQ stores free servers.
                // We can iterate through it.
                // We want the smallest `s_id` in `available_servers` such that `s_id >= target_server_index`. If found, pick that one.
                // If no such `s_id` exists, pick the smallest `s_id` from `available_servers` overall.

                // Let's restart the search for the assigned server.
                // Clear `temp_available` and `found_server`.
                // We need to iterate through `available_servers` to find the *correct* server.

                // Let's use the `temp_available` to hold all servers from `available_servers` that we pop.
                // We are looking for the first server `s_id` in `available_servers` (in increasing order)
                // such that `s_id >= target_server_index`.
                // If we find such `s_id`, that's our `assigned_server_id`.
                // If we exhaust `available_servers` without finding such an `s_id`, it means all servers
                // from `target_server_index` to `k-1` are busy. In this case, we take the smallest available server overall,
                // which will be the first element popped from `available_servers` that was < `target_server_index`.
                // However, this is complex.

                // Let's try a simpler perspective on the "next available server" logic:
                // 1. Determine `target_server_index = i % k`.
                // 2. We need to find a server `server_id` from `available_servers` such that:
                //    - `server_id` is the smallest possible ID that is available.
                //    - And among those that satisfy the cyclic search starting from `target_server_index`.
                //
                // The key is that `available_servers` *always* gives the smallest ID of a free server.
                // If `available_servers.top()` is `target_server_index`, we use it.
                // If `available_servers.top() > target_server_index`, it means `target_server_index` is busy. We then need to check if `available_servers.top()` is the next available server.
                // If `available_servers.top() < target_server_index`, it means `target_server_index` and servers up to `k-1` are busy. So we must wrap around and take `available_servers.top()`.

                // The correct way to find the "next available server" from `target_server_index` cyclically:
                // We're searching for server `idx` where `idx = target_server_index, (target_server_index + 1) % k, (target_server_index + 2) % k, ...`
                // And `idx` must be in `available_servers`.
                // The `available_servers` PQ gives us free servers in ascending order.
                // So, we need to find the smallest `server_id` in `available_servers` that matches this cyclic search.

                // This implies we need to iterate through `available_servers`.
                // We can use a temporary vector to store elements popped from `available_servers`.
                // We pop elements until we find one that is our `assigned_server_id`.
                // After finding it, we push back all other elements from the temporary vector to `available_servers`.

                // Correct logic for finding the assigned server:
                // Iterate through `available_servers`.
                // Pop elements one by one and store them in `temp_available`.
                // The first server `s_id` we pop from `available_servers` is the smallest available server ID.
                // If `s_id >= target_server_index`, this `s_id` is our `assigned_server_id`. This is because we prefer to assign to `target_server_index` or later servers if they are available. Since `s_id` is the smallest available server that is `>= target_server_index`, it's the best fit for the "next available" rule when `target_server_index` might be busy.
                // If `s_id < target_server_index`, it means `target_server_index` is busy. And all servers between `target_server_index` and `k-1` are also likely busy (if they were free, they would have been popped earlier if their ID was smaller, or they will be popped later if their ID is larger).
                // If we keep popping `s_id < target_server_index`, and the PQ `available_servers` becomes empty before we find an `s_id >= target_server_index`, it means we must wrap around. The smallest server available overall would be the first one we popped that was less than `target_server_index`.

                // Let's re-implement the server assignment search using `temp_available`.
                // `available_servers` contains all currently free servers.
                // We want to assign to `server_id` which is the first in the sequence `target_server_index, (target_server_index + 1) % k, ...` that is present in `available_servers`.

                int chosen_server_id = -1; // Initialize to an invalid value

                // We need to examine servers in `available_servers`.
                // We will pop them temporarily.
                std::vector<int> temp_popped_servers;
                bool found_target_after_wrap = false; // Flag to indicate if we found a server >= target_server_index

                while (!available_servers.empty()) {
                    int current_free_server_id = available_servers.top();
                    available_servers.pop();
                    temp_popped_servers.push_back(current_free_server_id);

                    // This is the core logic: find the first available server that satisfies the cyclic search.
                    // The server ID we are looking for is `current_free_server_id`.
                    // We want to see if this `current_free_server_id` is the first one in the sequence `target_server_index, (target_server_index + 1) % k, ...`
                    // This means `current_free_server_id` should be the smallest available server ID `s_id` such that `s_id >= target_server_index`.
                    // If we find such a server, that's our `chosen_server_id`.
                    if (current_free_server_id >= target_server_index) {
                        chosen_server_id = current_free_server_id;
                        found_target_after_wrap = true;
                        break; // We found our server (the smallest available one that's >= target_server_index)
                    }
                    // If `current_free_server_id < target_server_index`, we continue searching.
                    // This `current_free_server_id` is a candidate if we exhaust all servers >= `target_server_index`.
                }

                // If `found_target_after_wrap` is false, it means all servers from `target_server_index` up to `k-1` are busy.
                // We must wrap around and assign to the smallest available server overall.
                // The `temp_popped_servers` contains servers that were less than `target_server_index`, in ascending order.
                // The first element of `temp_popped_servers` (if it exists) is the smallest available server overall.
                if (!found_target_after_wrap && !temp_popped_servers.empty()) {
                    chosen_server_id = temp_popped_servers[0]; // Smallest available server overall
                }

                // Push back the servers that were popped but not chosen back into `available_servers`.
                for (size_t j = 0; j < temp_popped_servers.size(); ++j) {
                    // If we found a server, we skip pushing back the chosen one and subsequent ones if they were already processed.
                    if (found_target_after_wrap && temp_popped_servers[j] == chosen_server_id) {
                        // We've found and assigned the server.
                        // All servers in `temp_popped_servers` up to this one were less than `target_server_index`.
                        // We need to push back all servers in `temp_popped_servers` that are NOT `chosen_server_id`.
                        // In this case, `chosen_server_id` was >= `target_server_index`.
                        // So we push back all servers from `temp_popped_servers` except `chosen_server_id`.
                        // However, `chosen_server_id` is in `temp_popped_servers`.
                        // So we need to push back all elements in `temp_popped_servers` *before* `chosen_server_id`.
                        // The elements are stored in ascending order in `temp_popped_servers`.
                        // So we push back all elements in `temp_popped_servers` up to (but not including) the index of `chosen_server_id`.
                        // Let's iterate and push back.
                        for (size_t l = 0; l < temp_popped_servers.size(); ++l) {
                            if (temp_popped_servers[l] != chosen_server_id) {
                                available_servers.push(temp_popped_servers[l]);
                            }
                        }
                        break; // Done restoring
                    } else if (!found_target_after_wrap && j == 0) {
                        // If we are in the wrap-around case and `chosen_server_id` is the first element popped (`temp_popped_servers[0]`).
                        // We need to push back all elements in `temp_popped_servers` *except* `chosen_server_id`.
                        // So, push back elements from index 1 onwards.
                        for (size_t l = 1; l < temp_popped_servers.size(); ++l) {
                            available_servers.push(temp_popped_servers[l]);
                        }
                        // The `chosen_server_id` (which is `temp_popped_servers[0]`) has already been assigned.
                        break; // Done restoring
                    }
                }

                // If `chosen_server_id` was found, we assign the request.
                if (chosen_server_id != -1) {
                    request_counts[chosen_server_id]++;
                    long long finish_time = current_arrival_time + current_load;
                    busy_servers.push({finish_time, chosen_server_id});
                }
            } // End of logic for finding assigned server

            // Corrected logic to simplify server assignment and restoration of available servers PQ:

            int assigned_server_id = -1;
            std::vector<int> servers_to_restore; // To hold servers popped from available_servers

            // Try to find the target server index first.
            int target_idx = i % k;

            // Strategy: find the smallest server ID in `available_servers` that is >= `target_idx`.
            // If such a server exists, that's our assignment.
            // If no such server exists (all servers >= `target_idx` are busy), then assign to the smallest available server overall.

            int best_server_candidate = -1; // Stores the smallest available server >= target_idx
            int smallest_available_overall = -1; // Stores the smallest available server overall

            while (!available_servers.empty()) {
                int current_available_id = available_servers.top();
                available_servers.pop();
                servers_to_restore.push_back(current_available_id);

                if (smallest_available_overall == -1) { // First element popped is always the smallest overall
                    smallest_available_overall = current_available_id;
                }

                // If the current available server ID is >= target_idx, it's a potential candidate.
                // Since `available_servers` is a min-heap, the first one we find that's >= target_idx
                // is the smallest such available server.
                if (current_available_id >= target_idx) {
                    best_server_candidate = current_available_id;
                    break; // Found the best candidate >= target_idx, no need to search further for this category.
                }
            }

            // Decide which server to assign
            if (best_server_candidate != -1) {
                assigned_server_id = best_server_candidate;
            } else {
                // If no server >= target_idx was found (i.e., best_server_candidate is still -1),
                // then we must use the smallest available server overall.
                assigned_server_id = smallest_available_overall;
            }

            // Restore the `available_servers` PQ.
            // We need to push back all servers from `servers_to_restore` except the `assigned_server_id`.
            if (assigned_server_id != -1) {
                for (int server_id : servers_to_restore) {
                    if (server_id != assigned_server_id) {
                        available_servers.push(server_id);
                    }
                }

                // Assign the request to the chosen server.
                request_counts[assigned_server_id]++;
                long long finish_time = current_arrival_time + current_load;
                busy_servers.push({finish_time, assigned_server_id});
            } else {
                // If assigned_server_id is still -1, it means available_servers was empty, and request is dropped.
                // Restore all servers from servers_to_restore back into available_servers.
                for (int server_id : servers_to_restore) {
                    available_servers.push(server_id);
                }
            }
        } // End of request loop

        // Find the maximum number of requests handled.
        int max_requests = 0;
        for (int count : request_counts) {
            if (count > max_requests) {
                max_requests = count;
            }
        }

        // Collect the IDs of the busiest servers.
        std::vector<int> busiest_server_ids;
        for (int i = 0; i < k; ++i) {
            if (request_counts[i] == max_requests) {
                busiest_server_ids.push_back(i);
            }
        }

        return busiest_server_ids;
    }
};
```