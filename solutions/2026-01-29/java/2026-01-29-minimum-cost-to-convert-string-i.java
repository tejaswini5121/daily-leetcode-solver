/**
 * Problem Summary: Given two strings `source` and `target` of equal length, and a list of possible character transformations with associated costs, find the minimum cost to convert `source` to `target`.
 * Link: https://leetcode.com/problems/minimum-cost-to-convert-string-i/
 *
 * Approach:
 * This problem can be modeled as finding the shortest path between characters in a graph. Each lowercase English letter ('a' through 'z') can be considered a node in the graph. The given `original`, `changed`, and `cost` arrays define directed edges between characters. An edge from `original[i]` to `changed[i]` has a weight of `cost[i]`. Since we want the minimum cost to change one character to another, we need to find the shortest path between any two characters in this graph.
 *
 * We can precompute the all-pairs shortest paths for all 26 lowercase English letters. Floyd-Warshall algorithm is a suitable choice for this, as the number of nodes (characters) is small (26).
 *
 * 1. Initialize a 26x26 distance matrix `dist` where `dist[i][j]` represents the minimum cost to change character `i` to character `j`. Initialize `dist[i][i]` to 0 (cost to change a character to itself is 0) and all other entries to infinity (a large value indicating no direct path or an unreachable state).
 * 2. Populate the `dist` matrix with direct transformation costs: For each `k` from 0 to `cost.length - 1`, update `dist[original[k] - 'a'][changed[k] - 'a']` with the minimum of its current value and `cost[k]`. This handles cases where multiple direct transformations exist for the same character pair, ensuring we use the cheapest direct one.
 * 3. Run the Floyd-Warshall algorithm: For each intermediate character `k` (from 'a' to 'z'), and for each source character `i` (from 'a' to 'z'), and for each destination character `j` (from 'a' to 'z'), update `dist[i][j]` if a cheaper path is found through `k`: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.
 * 4. Calculate the total minimum cost: Iterate through the `source` and `target` strings. For each index `i`, if `source[i]` is different from `target[i]`, find the minimum cost to convert `source[i]` to `target[i]` using the precomputed `dist` matrix (`dist[source[i] - 'a'][target[i] - 'a']`). If this cost is infinity (meaning it's impossible to convert), return -1. Otherwise, add this cost to the total cost.
 * 5. Return the total calculated cost.
 *
 * Time Complexity:
 * - Floyd-Warshall: O(V^3), where V is the number of vertices (26 lowercase English letters). This is O(26^3), which is a constant.
 * - Populating initial distances: O(C), where C is the length of `original`, `changed`, and `cost` arrays.
 * - Calculating total cost: O(N), where N is the length of `source` and `target` strings.
 *
 * Overall Time Complexity: O(C + N + V^3). Since V is constant, it simplifies to O(C + N).
 *
 * Space Complexity:
 * - Distance matrix: O(V^2), where V is the number of vertices (26 lowercase English letters). This is O(26^2), which is a constant.
 *
 * Overall Space Complexity: O(1).
 */
class Solution {
    public long minimumCost(String source, String target, char[] original, char[] changed, int[] cost) {
        // Number of lowercase English letters
        final int ALPHABET_SIZE = 26;
        // A large value to represent infinity (unreachable)
        final long INF = Long.MAX_VALUE / 2; // Use half of MAX_VALUE to prevent overflow during addition

        // Initialize the distance matrix for all-pairs shortest paths.
        // dist[i][j] will store the minimum cost to convert character 'a' + i to 'a' + j.
        long[][] dist = new long[ALPHABET_SIZE][ALPHABET_SIZE];

        // Initialize distances:
        // - Distance from a character to itself is 0.
        // - All other distances are initialized to infinity.
        for (int i = 0; i < ALPHABET_SIZE; i++) {
            for (int j = 0; j < ALPHABET_SIZE; j++) {
                if (i == j) {
                    dist[i][j] = 0;
                } else {
                    dist[i][j] = INF;
                }
            }
        }

        // Populate the distance matrix with direct transformation costs.
        // If there are multiple ways to directly transform one character to another,
        // we take the minimum cost.
        for (int i = 0; i < original.length; i++) {
            int u = original[i] - 'a'; // Convert character to index (0-25)
            int v = changed[i] - 'a';  // Convert character to index (0-25)
            dist[u][v] = Math.min(dist[u][v], (long) cost[i]);
        }

        // Apply the Floyd-Warshall algorithm to find all-pairs shortest paths.
        // This algorithm considers all possible intermediate characters k to find the
        // shortest path between any two characters i and j.
        for (int k = 0; k < ALPHABET_SIZE; k++) { // Intermediate character
            for (int i = 0; i < ALPHABET_SIZE; i++) { // Source character
                for (int j = 0; j < ALPHABET_SIZE; j++) { // Destination character
                    // If a path exists from i to k AND from k to j
                    if (dist[i][k] != INF && dist[k][j] != INF) {
                        // Update the shortest path from i to j if the path through k is cheaper
                        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                    }
                }
            }
        }

        // Calculate the total minimum cost to convert source to target.
        long totalCost = 0;
        for (int i = 0; i < source.length(); i++) {
            char sChar = source.charAt(i);
            char tChar = target.charAt(i);

            // If the characters are already the same, no cost is incurred for this position.
            if (sChar == tChar) {
                continue;
            }

            // Get the minimum cost to convert sChar to tChar from the precomputed distance matrix.
            int u = sChar - 'a';
            int v = tChar - 'a';
            long costForChar = dist[u][v];

            // If costForChar is INF, it means it's impossible to convert sChar to tChar.
            if (costForChar == INF) {
                return -1; // Impossible to convert the string
            }

            // Add the minimum cost for this character conversion to the total cost.
            totalCost += costForChar;
        }

        // Return the overall minimum cost.
        return totalCost;
    }
}
