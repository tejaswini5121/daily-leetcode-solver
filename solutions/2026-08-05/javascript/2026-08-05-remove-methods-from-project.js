// Summary: Identify and remove a group of methods (including method k and its dependents) from a project if no external methods invoke any methods within this suspicious group.
// Link: https://leetcode.com/problems/remove-methods-from-project/
// Approach:
// 1. Represent the method invocations as a directed graph where an edge from `a` to `b` means `a` invokes `b`.
// 2. Identify all "suspicious" methods. A method is suspicious if it's method `k` or if it's invoked, directly or indirectly, by method `k`. We can find these using a Breadth-First Search (BFS) or Depth-First Search (DFS) starting from `k`.
// 3. To check the removal condition, we need to know which methods are *invoked by* other methods. This suggests building a reverse graph (or an adjacency list where each node stores who invokes it).
// 4. For each suspicious method, check if it's invoked by any method *not* in the suspicious set.
// 5. If *any* suspicious method is invoked by a non-suspicious method, then the entire suspicious set cannot be removed. In this case, return all methods.
// 6. Otherwise, if no suspicious method is invoked by a non-suspicious method, return the set of non-suspicious methods.
//
// Detailed Steps:
// a. Build the adjacency list for the invocation graph (`adj`) and the reverse graph (`reverseAdj`).
// b. Perform a BFS or DFS starting from `k` on the `adj` graph to find all suspicious methods and store them in a `suspiciousSet`.
// c. Iterate through all methods in the `suspiciousSet`. For each suspicious method `s`, check its incoming edges in `reverseAdj`.
// d. If `s` is invoked by any method `invoker` such that `invoker` is *not* in `suspiciousSet`, then we cannot remove the suspicious methods. Return all `n` methods.
// e. If the loop completes without finding any external invoker for a suspicious method, then all suspicious methods can be removed. Construct and return an array of non-suspicious methods.
//
// Time Complexity:
// Building graphs: O(N + E), where N is the number of methods and E is the number of invocations.
// Finding suspicious methods (BFS/DFS): O(N + E).
// Checking for external invokers: In the worst case, we might iterate through all edges in the reverse graph. However, we only do this for suspicious nodes and check their direct invokers. If a suspicious node has `d_in` incoming edges, we check `d_in` potential invokers. The total number of incoming edges for all suspicious nodes can be at most E. So, checking takes O(N + E) in total.
// Overall: O(N + E).
//
// Space Complexity:
// Adjacency lists: O(N + E).
// `suspiciousSet`: O(N).
// `visited` set for BFS/DFS: O(N).
// Overall: O(N + E).
var removeMethods = function(n, k, invocations) {
    // Adjacency list to represent method invocations: adj[a] contains methods invoked by a.
    const adj = Array(n).fill(0).map(() => []);
    // Reverse adjacency list to represent who invokes a method: reverseAdj[b] contains methods that invoke b.
    const reverseAdj = Array(n).fill(0).map(() => []);

    // Build the graphs
    for (const [u, v] of invocations) {
        adj[u].push(v);
        reverseAdj[v].push(u);
    }

    // Use a Set to store all suspicious methods for efficient lookups.
    const suspiciousSet = new Set();
    // Queue for BFS to find all methods suspicious directly or indirectly via k.
    const queue = [k];
    // Keep track of visited nodes during BFS to avoid cycles and redundant processing.
    const visited = new Set([k]);
    suspiciousSet.add(k); // Method k is always suspicious.

    // BFS to find all methods that are invoked by k (directly or indirectly).
    while (queue.length > 0) {
        const currentMethod = queue.shift();

        // Explore methods invoked by the current method.
        for (const neighbor of adj[currentMethod]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                suspiciousSet.add(neighbor);
                queue.push(neighbor);
            }
        }
    }

    // Check if any suspicious method is invoked by a non-suspicious method.
    let canRemove = true;
    // Iterate through each method that is potentially suspicious.
    for (const suspiciousMethod of suspiciousSet) {
        // Check all methods that directly invoke the current suspicious method.
        for (const invoker of reverseAdj[suspiciousMethod]) {
            // If an invoker is NOT in the suspicious set, then the suspicious group cannot be removed.
            if (!suspiciousSet.has(invoker)) {
                canRemove = false;
                break; // No need to check further for this suspicious method.
            }
        }
        if (!canRemove) {
            break; // No need to check further suspicious methods.
        }
    }

    // If suspicious methods can be removed, return the remaining non-suspicious methods.
    if (canRemove) {
        const remainingMethods = [];
        // Iterate through all methods from 0 to n-1.
        for (let i = 0; i < n; i++) {
            // If a method is not in the suspicious set, it remains.
            if (!suspiciousSet.has(i)) {
                remainingMethods.push(i);
            }
        }
        return remainingMethods;
    } else {
        // If suspicious methods cannot be removed, return all methods.
        const allMethods = [];
        for (let i = 0; i < n; i++) {
            allMethods.push(i);
        }
        return allMethods;
    }
};
```