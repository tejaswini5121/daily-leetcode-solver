// Summary: Find the minimum jumps to reach the last index of an array,
// with allowed jumps to adjacent indices or any index with the same value.
// Link: https://leetcode.com/problems/jump-game-iv/
// Approach: This problem can be modeled as finding the shortest path in a graph.
// The array indices are nodes, and the allowed jumps are edges.
// Since we need the minimum number of steps, Breadth-First Search (BFS) is a suitable algorithm.
// We can optimize the BFS by pre-processing the array to store all indices for each value in a HashMap.
// This allows us to quickly find all possible jumps to indices with the same value.
// During BFS, we use a queue to store indices to visit and a set to keep track of visited indices to avoid cycles and redundant computations.
// We also need to clear the list of indices for a value from the HashMap once all its occurrences have been visited.
// This is crucial to prevent re-processing the same set of jumps multiple times, which can lead to Time Limit Exceeded (TLE).
// The BFS proceeds level by level, guaranteeing that the first time we reach the last index, it's via the shortest path.
//
// Time Complexity: O(N), where N is the length of the array.
// In the worst case, each index and each possible jump (i+1, i-1, and same-value jumps) is processed at most once.
// Building the HashMap takes O(N). The BFS explores each node (index) and edge (jump) at most once.
// The clearing of the HashMap entries for visited values ensures that the same value-based jumps aren't revisited repeatedly.
//
// Space Complexity: O(N), where N is the length of the array.
// The HashMap can store up to N entries if all elements are unique, or up to N indices in total across all lists.
// The queue and the visited set can also store up to N elements in the worst case.
import java.util.*;

class Solution {
    public int minJumps(int[] arr) {
        int n = arr.length;

        // Base case: If the array has only one element, we are already at the last index.
        if (n <= 1) {
            return 0;
        }

        // Map to store indices for each value.
        // Key: value in the array
        // Value: list of indices where this value appears
        Map<Integer, List<Integer>> graph = new HashMap<>();
        for (int i = 0; i < n; i++) {
            graph.computeIfAbsent(arr[i], k -> new ArrayList<>()).add(i);
        }

        // Queue for BFS, storing indices to visit.
        Queue<Integer> queue = new LinkedList<>();
        // Set to keep track of visited indices to avoid cycles and redundant computations.
        Set<Integer> visited = new HashSet<>();

        // Start BFS from the first index (index 0).
        queue.offer(0);
        visited.add(0);

        // `steps` variable to count the number of jumps.
        int steps = 0;

        // Perform BFS.
        while (!queue.isEmpty()) {
            // Process all nodes at the current level.
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int currentIndex = queue.poll();

                // If we reached the last index, return the current number of steps.
                if (currentIndex == n - 1) {
                    return steps;
                }

                // 1. Explore jump to `currentIndex + 1`
                if (currentIndex + 1 < n && !visited.contains(currentIndex + 1)) {
                    queue.offer(currentIndex + 1);
                    visited.add(currentIndex + 1);
                }

                // 2. Explore jump to `currentIndex - 1`
                if (currentIndex - 1 >= 0 && !visited.contains(currentIndex - 1)) {
                    queue.offer(currentIndex - 1);
                    visited.add(currentIndex - 1);
                }

                // 3. Explore jumps to indices with the same value (`arr[currentIndex]`).
                int currentValue = arr[currentIndex];
                if (graph.containsKey(currentValue)) {
                    for (int nextIndex : graph.get(currentValue)) {
                        // Only add if it's not the current index and not visited.
                        if (nextIndex != currentIndex && !visited.contains(nextIndex)) {
                            queue.offer(nextIndex);
                            visited.add(nextIndex);
                        }
                    }
                    // Crucial optimization: Clear the list of indices for this value
                    // once all its occurrences have been processed. This prevents
                    // re-exploring the same set of jumps repeatedly, which could lead to TLE.
                    graph.remove(currentValue);
                }
            }
            // Increment the number of steps after processing a level.
            steps++;
        }

        // If the loop finishes without reaching the last index, it means it's unreachable.
        // However, according to the problem constraints, the last index is always reachable.
        return -1; // Should not be reached given problem constraints.
    }
}
