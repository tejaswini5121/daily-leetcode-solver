// Problem: Count the Number of Complete Components
// Link: https://leetcode.com/problems/count-the-number-of-complete-components/
//
// Approach:
// We can use Depth First Search (DFS) or Breadth First Search (BFS) to find connected components.
// For each connected component, we need to verify if it's a "complete" component.
// A component is complete if every pair of vertices within that component has an edge.
//
// To do this efficiently:
// 1. Build an adjacency list representation of the graph.
// 2. Maintain a `visited` array to keep track of visited nodes.
// 3. Iterate through each vertex from 0 to n-1.
// 4. If a vertex hasn't been visited, start a DFS/BFS from it to find a connected component.
// 5. During the DFS/BFS traversal, collect all vertices belonging to the current component and count their degrees within that component.
// 6. After finding a component, check if it's complete. A component with `k` vertices is complete if each of its vertices has a degree of `k-1` *within that component*.
//    Also, ensure that the number of edges within the component is exactly `k * (k - 1) / 2`.
// 7. If the component is complete, increment a counter.
// 8. Return the final counter.
//
// Time Complexity:
// Building the adjacency list: O(E), where E is the number of edges.
// Traversing the graph: Each vertex and edge will be visited at most once across all DFS/BFS calls.
// For each component of size k and m edges, checking completeness takes O(k + m) (to count degrees and then compare with k*(k-1)/2).
// In the worst case, we might have a single large component.
// Total time complexity is roughly O(N + E), where N is the number of vertices and E is the number of edges.
// Given N <= 50, this is very efficient.
//
// Space Complexity:
// Adjacency list: O(N + E)
// Visited array: O(N)
// Recursion stack for DFS (or queue for BFS): O(N) in the worst case.
// Total space complexity is O(N + E).
// Given N <= 50, this is very efficient.

function countCompleteComponents(n, edges) {
    // 1. Build the adjacency list and count total edges for checking completeness later.
    const adj = new Array(n).fill(0).map(() => []);
    // Store the actual number of edges in the graph
    const totalEdges = edges.length;

    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }

    // Array to keep track of visited vertices.
    const visited = new Array(n).fill(false);
    // Counter for complete components.
    let completeComponentsCount = 0;

    // Iterate through each vertex to find connected components.
    for (let i = 0; i < n; i++) {
        // If the vertex hasn't been visited yet, it's the start of a new potential component.
        if (!visited[i]) {
            // Variables to store information about the current component being explored.
            let componentVertices = []; // List of vertices in the current component.
            let componentEdges = 0;     // Count of edges within the current component.

            // Start DFS to find all vertices and edges in this connected component.
            const stack = [i];
            visited[i] = true; // Mark the starting node as visited.

            // Perform DFS
            while (stack.length > 0) {
                const u = stack.pop();
                componentVertices.push(u); // Add vertex to the current component's list.

                // Count edges originating from this vertex that connect to other vertices *within this component*.
                // Each edge will be counted twice (once for each endpoint), so we'll divide by 2 later.
                componentEdges += adj[u].length;

                // Explore neighbors.
                for (const v of adj[u]) {
                    if (!visited[v]) {
                        visited[v] = true; // Mark neighbor as visited.
                        stack.push(v);     // Add neighbor to the stack for further exploration.
                    }
                }
            }

            // After DFS, we have all vertices (`componentVertices`) and the total degree sum (`componentEdges`).
            // The number of vertices in the component is `k`.
            const k = componentVertices.length;
            // The number of edges within this component is `m = componentEdges / 2`.
            const m = componentEdges / 2;

            // Check if the component is "complete".
            // A component is complete if:
            // 1. The number of vertices is `k`.
            // 2. The number of edges within this component is `k * (k - 1) / 2`.
            // This condition implies that every vertex has a degree of `k-1` within the component,
            // as the sum of degrees (`componentEdges`) must be `k * (k-1)`.
            if (m === (k * (k - 1)) / 2) {
                completeComponentsCount++; // If it's complete, increment the counter.
            }
        }
    }

    // Return the total count of complete components.
    return completeComponentsCount;
}
