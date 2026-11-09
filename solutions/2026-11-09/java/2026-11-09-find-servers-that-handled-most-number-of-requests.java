/**
 * Problem Summary:
 * Assign incoming requests to servers based on arrival time and load, prioritizing the server indicated by (request_index % k) and then searching for the next available server.
 * Identify and return the server(s) that handled the maximum number of requests.
 *
 * Link: https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests/
 *
 * Approach:
 * This problem can be solved using two priority queues (heaps) and an array to track server request counts.
 * 1. `availableServers`: A min-heap to store the indices of servers that are currently free. Initially, it contains all server indices from 0 to k-1.
 * 2. `busyServers`: A min-heap to store pairs of (finish_time, server_index) for servers that are currently busy. The heap is ordered by `finish_time`.
 * 3. `requestCounts`: An array of size k to store the number of requests handled by each server.
 *
 * We iterate through each request:
 * - For the current request `i` arriving at `arrival[i]` with load `load[i]`:
 *   - First, check `busyServers`: While there are busy servers whose `finish_time` is less than or equal to `arrival[i]`, move them back to `availableServers`. This means they have finished their tasks and are now free.
 *   - Determine the target server index: `targetServer = i % k`.
 *   - If `availableServers` is empty (meaning all servers are busy and none have finished by the current arrival time), the request is dropped.
 *   - If `targetServer` is available (i.e., it's in `availableServers`), assign the request to `targetServer`.
 *   - If `targetServer` is busy, find the next available server from `availableServers`. Since `availableServers` is a min-heap, the smallest available server index will be at the top. We extract it.
 *   - Once a server is assigned (either `targetServer` or another available one), calculate its `finish_time = arrival[i] + load[i]`. Add `(finish_time, server_index)` to `busyServers`.
 *   - Increment the `requestCounts` for the assigned server.
 *
 * After processing all requests, find the maximum request count in `requestCounts`. Then, collect the indices of all servers that have this maximum count.
 *
 * Time Complexity:
 * O(N log K), where N is the number of requests and K is the number of servers.
 * For each request, we might perform operations on `availableServers` (up to K elements) and `busyServers` (up to K elements). Heap operations (add, poll, peek) take O(log K) time.
 * In the worst case, all servers can become busy, and then all can become free, leading to O(N log K) for processing all requests.
 * Finding the maximum request count and collecting results takes O(K) time.
 *
 * Space Complexity:
 * O(K) for storing `availableServers` (at most K elements), `busyServers` (at most K elements), and `requestCounts` (K elements).
 */
import java.util.*;

class Solution {
    public List<Integer> busiestServers(int k, int[] arrival, int[] load) {
        // Min-heap to store available server indices.
        // Servers are ordered by their index.
        PriorityQueue<Integer> availableServers = new PriorityQueue<>();
        // Initialize availableServers with all server indices from 0 to k-1.
        for (int i = 0; i < k; i++) {
            availableServers.offer(i);
        }

        // Min-heap to store busy servers.
        // Each element is an array: [finish_time, server_index].
        // Servers are ordered by finish_time.
        PriorityQueue<long[]> busyServers = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));

        // Array to store the number of requests handled by each server.
        int[] requestCounts = new int[k];

        // Iterate through each request.
        for (int i = 0; i < arrival.length; i++) {
            int currentArrivalTime = arrival[i];
            int currentLoad = load[i];

            // Step 1: Free up servers that have finished their tasks before or at the current arrival time.
            // Move servers from busyServers back to availableServers.
            while (!busyServers.isEmpty() && busyServers.peek()[0] <= currentArrivalTime) {
                long[] finishedServer = busyServers.poll();
                availableServers.offer((int) finishedServer[1]); // Add server index back to available.
            }

            // Step 2: Determine the target server index for this request.
            int targetServerIndex = i % k;

            // Step 3: Try to assign the request to a server.

            // Case A: The target server is available.
            if (availableServers.contains(targetServerIndex)) {
                // Remove the target server from availableServers.
                availableServers.remove(targetServerIndex);
                // Mark the target server as busy.
                busyServers.offer(new long[]{currentArrivalTime + currentLoad, targetServerIndex});
                // Increment request count for this server.
                requestCounts[targetServerIndex]++;
            }
            // Case B: The target server is busy, find the next available server.
            else if (!availableServers.isEmpty()) {
                // Get the server with the smallest index from the available servers.
                int nextAvailableServer = availableServers.poll();
                // Mark this server as busy.
                busyServers.offer(new long[]{currentArrivalTime + currentLoad, nextAvailableServer});
                // Increment request count for this server.
                requestCounts[nextAvailableServer]++;
            }
            // Case C: All servers are busy and none are available to handle this request.
            // The request is dropped, so we do nothing.
        }

        // Step 4: Find the maximum number of requests handled by any server.
        int maxRequests = 0;
        for (int count : requestCounts) {
            maxRequests = Math.max(maxRequests, count);
        }

        // Step 5: Collect the indices of all servers that handled the maximum number of requests.
        List<Integer> busiestServersList = new ArrayList<>();
        for (int i = 0; i < k; i++) {
            if (requestCounts[i] == maxRequests) {
                busiestServersList.add(i);
            }
        }

        return busiestServersList;
    }
}
