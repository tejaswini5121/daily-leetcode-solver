```cpp
// Problem: Minimum Cost to Convert String I
// Link: https://leetcode.com/problems/minimum-cost-to-convert-string-i/
// Approach:
// This problem can be modeled as a shortest path problem on a graph.
// Each lowercase English letter ('a' through 'z') can be considered a node in the graph.
// The given `original`, `changed`, and `cost` arrays define directed edges between these character nodes.
// An edge exists from `original[i]` to `changed[i]` with a weight of `cost[i]`.
// Since we want the minimum cost to change one character to another, and there might be multiple paths (e.g., 'a' -> 'c' -> 'b' might be cheaper than 'a' -> 'b' directly),
// we need to find the shortest path between each pair of characters that need to be converted.
// The Floyd-Warshall algorithm is suitable here because the number of nodes (characters) is small (26), and it computes all-pairs shortest paths.
// We initialize a 26x26 distance matrix `dist` where `dist[i][j]` stores the minimum cost to convert the i-th character to the j-th character.
// Initially, `dist[i][i]` is 0 for all i, and `dist[i][j]` is infinity for i != j.
// Then, we populate the `dist` matrix with direct conversion costs from the input arrays. If multiple direct conversions exist for the same pair, we take the minimum cost.
// After populating with direct costs, we run the Floyd-Warshall algorithm:
// For k from 0 to 25:
//   For i from 0 to 25:
//     For j from 0 to 25:
//       dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
// This ensures that `dist[i][j]` holds the minimum cost to convert the i-th character to the j-th character, considering all intermediate conversions.
// Finally, we iterate through the `source` and `target` strings. If `source[i]` is different from `target[i]`, we add the `dist[source[i] - 'a'][target[i] - 'a']` to the total cost.
// If at any point `dist[source[i] - 'a'][target[i] - 'a']` is still infinity, it means the conversion is impossible, and we return -1.
//
// Time Complexity:
// 1. Initializing the distance matrix: O(26*26) = O(1) since the alphabet size is constant.
// 2. Populating direct costs: O(N) where N is the length of `original`, `changed`, and `cost`.
// 3. Floyd-Warshall algorithm: O(26^3) = O(1) since the alphabet size is constant.
// 4. Iterating through source and target strings: O(L) where L is the length of `source` and `target`.
// Therefore, the dominant factor is O(L).
//
// Space Complexity:
// O(26*26) = O(1) for the distance matrix, as the alphabet size is constant.
//
class Solution {
public:
    long long minimumCost(string source, string target, vector<char>& original, vector<char>& changed, vector<int>& cost) {
        // Initialize a 26x26 matrix to store minimum costs between any two characters.
        // Each cell dist[i][j] will store the minimum cost to convert the i-th character to the j-th character.
        // We use long long to avoid potential overflow with large costs.
        // Initialize with a large value representing infinity.
        const long long INF = 1e18; // A sufficiently large number for infinity
        vector<vector<long long>> dist(26, vector<long long>(26, INF));

        // The cost to convert a character to itself is 0.
        for (int i = 0; i < 26; ++i) {
            dist[i][i] = 0;
        }

        // Populate the distance matrix with the direct conversion costs given in the input.
        // If there are multiple direct paths between two characters, we take the minimum cost.
        for (int i = 0; i < original.size(); ++i) {
            int u = original[i] - 'a';
            int v = changed[i] - 'a';
            dist[u][v] = min(dist[u][v], (long long)cost[i]);
        }

        // Apply the Floyd-Warshall algorithm to find the shortest path between all pairs of characters.
        // This accounts for indirect conversions (e.g., 'a' -> 'c' -> 'b' might be cheaper than 'a' -> 'b').
        for (int k = 0; k < 26; ++k) { // Intermediate node
            for (int i = 0; i < 26; ++i) { // Starting node
                for (int j = 0; j < 26; ++j) { // Ending node
                    // If a path from i to k and a path from k to j exist,
                    // check if going through k provides a shorter path from i to j.
                    if (dist[i][k] != INF && dist[k][j] != INF) {
                        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                    }
                }
            }
        }

        // Calculate the total minimum cost to convert the source string to the target string.
        long long totalCost = 0;
        for (int i = 0; i < source.length(); ++i) {
            int u = source[i] - 'a';
            int v = target[i] - 'a';

            // If the characters at the current position are different, we need to convert.
            if (u != v) {
                // Get the minimum cost to convert source[i] to target[i].
                long long conversionCost = dist[u][v];

                // If conversionCost is still INF, it means it's impossible to convert
                // the character at this position, so return -1.
                if (conversionCost == INF) {
                    return -1;
                }
                // Add the conversion cost to the total cost.
                totalCost += conversionCost;
            }
        }

        // Return the total minimum cost.
        return totalCost;
    }
};
```