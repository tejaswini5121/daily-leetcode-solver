```python
# Problem: Find Servers That Handled Most Number of Requests
# Link: https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests/
#
# Approach:
# We can simulate the request handling process. We need to keep track of which
# servers are busy and when they will become free. A min-heap (priority queue)
# is suitable for storing busy servers, ordered by their finish time.
# Another min-heap can store available servers, ordered by their server ID.
#
# For each incoming request:
# 1. First, we process all requests that finish *before* the current request arrives.
#    We move servers from the busy heap to the available heap if their finish time
#    is less than or equal to the current arrival time.
# 2. We then try to find an available server for the current request. The target
#    server index is `request_index % k`.
# 3. If the target server is available, we assign the request to it. We remove it
#    from the available heap and add it to the busy heap with its calculated
#    finish time (`arrival_time + load_time`).
# 4. If the target server is busy, we search for the next available server. We
#    take the smallest available server ID from the available heap. If the
#    available heap is empty, the request is dropped.
# 5. We increment the request count for the server that handled the request.
#
# After processing all requests, we find the maximum request count and return
# the IDs of servers that achieved this maximum.
#
# Time Complexity:
# Let N be the number of requests and k be the number of servers.
# For each request, we perform operations on two heaps. In the worst case,
# each server can be pushed and popped from the heaps multiple times.
# Heap operations (push, pop) take O(log k) time.
# Processing arrivals from the busy heap can take up to O(N log k) in total
# across all requests if all requests are handled.
# Finding the next available server also takes O(log k).
# So, the overall time complexity is O(N log k).
#
# Space Complexity:
# We use two heaps to store server information. The `available_servers` heap
# can store up to k server IDs. The `busy_servers` heap can store up to k
# server finish times. We also use an array to store request counts for each
# server, which takes O(k) space.
# Therefore, the space complexity is O(k).
#
import heapq

def findServers(k: int, arrival: list[int], load: list[int]) -> list[int]:
    """
    Finds the servers that handled the most number of requests.

    Args:
        k: The total number of servers.
        arrival: A list of arrival times for each request.
        load: A list of load times for each request.

    Returns:
        A list of server IDs that handled the most requests.
    """

    # Initialize request counts for each server
    request_counts = [0] * k

    # Min-heap to store available servers, ordered by server ID.
    # Initially, all servers are available.
    available_servers = list(range(k))
    heapq.heapify(available_servers)

    # Min-heap to store busy servers, ordered by their finish time.
    # Each element is a tuple: (finish_time, server_id)
    busy_servers = []

    # Iterate through each request
    for i in range(len(arrival)):
        current_arrival_time = arrival[i]
        current_load_time = load[i]

        # 1. Free up servers that have finished processing requests before the current arrival time.
        # Move servers from busy_servers to available_servers if their finish time is <= current_arrival_time.
        while busy_servers and busy_servers[0][0] <= current_arrival_time:
            finish_time, server_id = heapq.heappop(busy_servers)
            heapq.heappush(available_servers, server_id)

        # 2. Determine the target server index for the current request.
        # The target server is (i % k).
        target_server_index = i % k

        # 3. Try to assign the request to the target server if it's available.
        if target_server_index in available_servers:
            # If the target server is available, assign the request to it.
            # Remove it from available_servers and add it to busy_servers.
            # Note: We don't actually need to search in available_servers if we use
            # two heaps intelligently. The logic below handles finding the *next*
            # available server. If target_server_index is available, it will be
            # at the top of available_servers (or a subsequent pop if not).
            # A more direct approach is to check if `target_server_index` is
            # actually in `available_servers` and if so, remove it and proceed.
            # However, the greedy approach of always checking the smallest available
            # server ID after the target server handles cases where target server
            # is busy and a smaller ID server became available earlier.

            # For simplicity and correctness with the problem statement's "next available server"
            # rule, we'll try to find an available server starting from target_server_index.
            # If target_server_index is not directly available, we need to find the next.

            # A more efficient way to check availability for target_server_index and find the next:
            # We need to pick the smallest server ID from available_servers that is >= target_server_index.
            # If all available servers are < target_server_index, then we wrap around and pick the smallest.

            # Let's refine: we need to find an available server for `target_server_index`.
            # If `target_server_index` is available, great.
            # If not, we need to find the *next* available server.

            # The current `available_servers` heap contains server IDs that are free.
            # We need to find a server ID from this heap that is `target_server_index`
            # or the smallest one greater than `target_server_index` (wrapping around).

            assigned_server_id = -1

            # Temporarily store servers popped from available_servers to put them back if not used
            temp_available = []
            found_target_or_next = False

            while available_servers:
                server_id_to_try = heapq.heappop(available_servers)
                if server_id_to_try >= target_server_index:
                    # Found the target server or the next available server that's >= target_server_index
                    assigned_server_id = server_id_to_try
                    found_target_or_next = True
                    break
                else:
                    # This server ID is smaller than target_server_index. Keep it aside
                    # to be potentially put back or used if we wrap around.
                    temp_available.append(server_id_to_try)

            # If we didn't find a server >= target_server_index, it means all remaining
            # available servers have IDs smaller than target_server_index.
            # In this case, we wrap around and pick the smallest available server ID.
            if not found_target_or_next and temp_available:
                # The smallest server ID from temp_available is the one to pick
                assigned_server_id = temp_available[0] # Smallest among those < target_server_index
                # Put all other servers from temp_available back into available_servers
                for s_id in temp_available[1:]:
                    heapq.heappush(available_servers, s_id)
                # The first server in temp_available is used, so remove it from consideration
                # by not pushing it back.
            elif found_target_or_next:
                # Put back any servers we popped from available_servers that were < target_server_index
                # and not selected because we found one >= target_server_index.
                # This happens when we find a server >= target_server_index and there were
                # smaller ones before it that were popped.
                for s_id in temp_available:
                    heapq.heappush(available_servers, s_id)
            else:
                # No available servers at all.
                pass # Request will be dropped if assigned_server_id remains -1

            # If a server was assigned, update its request count and busy status.
            if assigned_server_id != -1:
                request_counts[assigned_server_id] += 1
                finish_time = current_arrival_time + current_load_time
                heapq.heappush(busy_servers, (finish_time, assigned_server_id))
            else:
                # If assigned_server_id is still -1, it means no server was available.
                # The request is dropped.
                pass
        else:
            # Target server index itself is not available. We must find the next available server.
            # This logic is effectively covered by the `if target_server_index in available_servers:` block
            # when `target_server_index` is not directly available. The loop structure
            # `while available_servers:` with `heapq.heappop` and checks correctly
            # finds the smallest available server ID that satisfies the wrap-around logic.

            # The code block above handles the case where target_server_index is not directly available
            # by iterating through `available_servers` to find the correct one.
            # If `available_servers` is empty or no server is found according to the rule,
            # `assigned_server_id` will remain -1.

            # Let's re-verify the logic for finding the next available server when the target is busy.
            # The problem states: "Otherwise, assign the request to the next available server (wrapping around the list of servers and starting from 0 if necessary)."
            # This means we need to find the server with the smallest ID `s_id` in `available_servers`
            # such that `s_id >= target_server_index`. If no such server exists, we take the
            # smallest server ID from `available_servers` (which effectively wraps around).

            assigned_server_id = -1
            servers_to_re_add = [] # To hold servers popped but not used

            # We need to find the smallest server ID `s_id` in `available_servers`
            # such that `s_id >= target_server_index`.
            # If such a server exists, we use it.
            # If not, we use the smallest ID from `available_servers`.

            # A direct way to achieve this with heaps is to pop elements and re-add them.
            # However, a more efficient approach for this specific search is to use
            # a data structure that allows searching for the smallest element >= a value.
            # `SortedList` from `sortedcontainers` would be ideal, but standard library
            # doesn't provide it. With heaps, we have to iterate.

            # Re-implementing the assignment logic carefully:
            # If `target_server_index` is available: we find it.
            # If `target_server_index` is busy: we search for the next available.
            # This search means finding the smallest `server_id` in `available_servers`
            # such that `server_id >= target_server_index`.
            # If no such server exists, we pick the smallest from `available_servers`.

            # This implies we might need to iterate through available_servers.
            # Let's restructure the assignment logic to be more robust.

            server_to_assign = -1
            servers_temporarily_removed = []

            # Try to find the smallest server ID >= target_server_index
            found_candidate = False
            while available_servers:
                current_server_id = heapq.heappop(available_servers)
                if current_server_id >= target_server_index:
                    server_to_assign = current_server_id
                    found_candidate = True
                    break
                else:
                    servers_temporarily_removed.append(current_server_id)

            # If no server >= target_server_index was found, use the smallest available server (wrap around)
            if not found_candidate and servers_temporarily_removed:
                server_to_assign = servers_temporarily_removed[0] # Smallest ID in the removed pool
                # Re-add the rest of the temporarily removed servers back to available_servers
                for s_id in servers_temporarily_removed[1:]:
                    heapq.heappush(available_servers, s_id)
            elif found_candidate:
                # Re-add any servers that were temporarily removed but were smaller than the found candidate
                for s_id in servers_temporarily_removed:
                    heapq.heappush(available_servers, s_id)

            # If a server was assigned, update its count and busy status
            if server_to_assign != -1:
                request_counts[server_to_assign] += 1
                finish_time = current_arrival_time + current_load_time
                heapq.heappush(busy_servers, (finish_time, server_to_assign))
            # If server_to_assign is -1, it means available_servers was empty, so the request is dropped.


    # Find the maximum number of requests handled by any server
    max_requests = 0
    if request_counts: # Ensure request_counts is not empty
        max_requests = max(request_counts)

    # Find all servers that handled the maximum number of requests
    busiest_servers = []
    for server_id, count in enumerate(request_counts):
        if count == max_requests:
            busiest_servers.append(server_id)

    return busiest_servers

```