/**
 * @fileoverview LeetCode Problem: Minimum Cost to Convert String I
 * @description Given two strings `source` and `target`, and a list of character conversions with costs, find the minimum cost to transform `source` into `target`.
 * @link https://leetcode.com/problems/minimum-cost-to-convert-string-i/
 *
 * @approach
 * This problem can be modeled as a shortest path problem on a graph. Each lowercase English letter ('a' through 'z') can be considered a node in the graph.
 * The `original` and `changed` arrays define directed edges between these character nodes, and the `cost` array provides the weight of each edge.
 *
 * Since we need the minimum cost to convert any character `x` to any character `y`, we need to find the shortest path between all pairs of character nodes. The Floyd-Warshall algorithm is suitable for finding all-pairs shortest paths in a dense graph (which our graph of 26 characters can be considered).
 *
 * 1. Initialize a 26x26 distance matrix `dist` where `dist[i][j]` stores the minimum cost to convert the i-th letter to the j-th letter.
 *    - Initialize `dist[i][i]` to 0 for all `i` (cost to convert a character to itself is 0).
 *    - Initialize `dist[i][j]` to infinity for `i != j` (representing unreachable initially).
 * 2. Populate the `dist` matrix with direct conversion costs. For each `k` from 0 to `cost.length - 1`:
 *    - Let `u` be the index of `original[k]` (e.g., 'a' -> 0, 'b' -> 1).
 *    - Let `v` be the index of `changed[k]`.
 *    - Update `dist[u][v]` with the minimum of its current value and `cost[k]`. This handles cases where multiple conversions exist for the same pair of characters.
 * 3. Run the Floyd-Warshall algorithm to find all-pairs shortest paths:
 *    - For each intermediate node `k` (from 0 to 25):
 *        - For each source node `i` (from 0 to 25):
 *            - For each destination node `j` (from 0 to 25):
 *                - `dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j])`
 * 4. Calculate the total minimum cost to convert `source` to `target`.
 *    - Iterate through the `source` and `target` strings from index 0 to `n-1`.
 *    - For each index `i`:
 *        - Let `u` be the index of `source[i]`.
 *        - Let `v` be the index of `target[i]`.
 *        - If `source[i]` is already equal to `target[i]`, the cost for this character is 0.
 *        - Otherwise, the cost is `dist[u][v]`.
 *        - If `dist[u][v]` is still infinity, it means `source[i]` cannot be converted to `target[i]`, so return -1.
 *        - Add `dist[u][v]` to the total cost.
 * 5. Return the total calculated cost.
 *
 * @timeComplexity
 * - Floyd-Warshall: O(V^3), where V is the number of vertices (26 lowercase letters). This is O(26^3), which is a constant.
 * - Initializing distance matrix: O(V^2 + E), where E is the number of conversion rules. E is at most 2000. So, O(26^2 + 2000).
 * - Calculating total cost: O(N), where N is the length of the source/target strings.
 *
 * Overall Time Complexity: O(N + V^3 + E), which simplifies to O(N) because V is a constant (26) and E is relatively small compared to N in the worst case.
 *
 * @spaceComplexity
 * - Distance matrix: O(V^2), where V is the number of vertices (26 lowercase letters). This is O(26^2), which is a constant.
 *
 * Overall Space Complexity: O(V^2), which is O(1) as V is constant.
 */
const minCost = (source, target, original, changed, cost) => {
    const ALPHABET_SIZE = 26;
    // Initialize a 26x26 distance matrix.
    // dist[i][j] will store the minimum cost to convert the i-th character to the j-th character.
    // Initialize with infinity, except for the diagonal which is 0 (cost to convert a char to itself).
    const dist = Array(ALPHABET_SIZE).fill(0).map(() => Array(ALPHABET_SIZE).fill(Infinity));

    for (let i = 0; i < ALPHABET_SIZE; i++) {
        dist[i][i] = 0;
    }

    // Populate the distance matrix with direct conversion costs.
    // If multiple conversion paths exist for the same pair, we take the minimum cost.
    for (let i = 0; i < original.length; i++) {
        const u = original.charCodeAt(i) - 'a'.charCodeAt(0);
        const v = changed.charCodeAt(i) - 'a'.charCodeAt(0);
        dist[u][v] = Math.min(dist[u][v], cost[i]);
    }

    // Apply the Floyd-Warshall algorithm to find all-pairs shortest paths.
    // This allows us to find the minimum cost for any character conversion, even if it requires intermediate steps.
    for (let k = 0; k < ALPHABET_SIZE; k++) { // Intermediate node
        for (let i = 0; i < ALPHABET_SIZE; i++) { // Source node
            for (let j = 0; j < ALPHABET_SIZE; j++) { // Destination node
                // If path from i to k and k to j exists, try to update path from i to j
                if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }

    let totalCost = 0;
    // Calculate the total minimum cost to convert the source string to the target string.
    for (let i = 0; i < source.length; i++) {
        const u = source.charCodeAt(i) - 'a'.charCodeAt(0);
        const v = target.charCodeAt(i) - 'a'.charCodeAt(0);

        // If the characters are already the same, no cost is incurred.
        if (u === v) {
            continue;
        }

        // Get the minimum cost to convert source[i] to target[i] from our precomputed dist matrix.
        const conversionCost = dist[u][v];

        // If conversionCost is Infinity, it means it's impossible to convert source[i] to target[i].
        if (conversionCost === Infinity) {
            return -1;
        }

        // Add the conversion cost for this character to the total cost.
        totalCost += conversionCost;
    }

    return totalCost;
};
```