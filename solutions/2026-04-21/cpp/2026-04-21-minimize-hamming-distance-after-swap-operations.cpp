```cpp
// Problem: Minimize Hamming Distance After Swap Operations
// Link: https://leetcode.com/problems/minimize-hamming-distance-after-swap-operations/
//
// Summary: Given two arrays source and target, and a list of allowed swaps between indices in source,
// find the minimum Hamming distance between source and target after performing any number of allowed swaps.
//
// Approach:
// The problem can be modeled as a graph problem. Each index in the array can be considered a node.
// An allowed swap [a, b] represents an edge between nodes 'a' and 'b'.
// If two indices are connected directly or indirectly through a series of allowed swaps, it means
// the elements at these indices in the 'source' array can be freely moved among themselves.
// This partitions the indices into disjoint sets (connected components).
//
// Within each connected component, we can arrange the elements of 'source' arbitrarily.
// To minimize the Hamming distance, for each connected component, we should try to match
// as many elements from 'source' to 'target' as possible. This means that for a given
// connected component, if the multiset of elements from 'source' at the indices within
// this component is the same as the multiset of elements from 'target' at the same indices,
// then we can achieve a Hamming distance of 0 for this component.
//
// The strategy is:
// 1. Build an undirected graph where nodes are indices (0 to n-1) and edges represent allowed swaps.
// 2. Find the connected components of this graph using Depth First Search (DFS) or Breadth First Search (BFS).
//    A Union-Find data structure is also a very efficient way to find connected components.
// 3. For each connected component:
//    a. Collect all indices that belong to this component.
//    b. For these indices, collect the values from 'source' into a frequency map (or multiset).
//    c. For these same indices, collect the values from 'target' into a frequency map (or multiset).
//    d. The number of elements that *cannot* be matched within this component contributes to the Hamming distance.
//       This is calculated as: (total number of elements in the component) - (number of common elements between source and target multisets).
//       A simpler way to think about this is to count how many elements in the 'source' multiset for a component are *not* present in the 'target' multiset for the same component.
//       For each element value, the number of matches we can make is the minimum of its count in the source multiset and its count in the target multiset.
//       The number of mismatches for a component is the sum of (source_count[x] - min(source_count[x], target_count[x])) for all unique values 'x' in the component.
//       This is equivalent to: (size of component) - (sum of min(source_count[x], target_count[x]) for all x).
//
// We will use Union-Find for finding connected components due to its efficiency.
//
// Time Complexity:
// - Building the Union-Find structure: O(N + M * alpha(N)), where N is the length of source/target, M is the number of allowedSwaps, and alpha is the inverse Ackermann function (practically constant).
// - Iterating through connected components: O(N). For each component, we iterate through its elements.
// - Frequency map operations (insertions and lookups): For each component, we iterate through its indices and then through unique elements. In total, across all components, each index is processed once. If `k` is the number of unique values in a component, and `s` is the size of the component, it takes O(s log k) or O(s) with hash maps. Since all indices are visited, the total for frequency map operations across all components is roughly O(N log(max_val)) or O(N) with hash maps, where max_val is the maximum value in the arrays.
// Overall: O(N + M * alpha(N)) which is effectively O(N + M).
//
// Space Complexity:
// - Union-Find parent array: O(N)
// - Union-Find size array: O(N)
// - Storing values for each component (e.g., in vectors or maps): In the worst case, all elements could be in one component, leading to O(N) for storing source values and O(N) for target values per component. If we process components one by one, we can reuse space.
// - Frequency maps: In the worst case, a component can have N elements, and unique values can be up to N, so O(N) for each map.
// Overall: O(N).
//
#include <vector>
#include <numeric>
#include <unordered_map>
#include <algorithm>

class UnionFind {
private:
    std::vector<int> parent; // Stores the parent of each element
    std::vector<int> size;   // Stores the size of the set for each root

public:
    // Constructor: Initializes the Union-Find structure for 'n' elements.
    // Each element is initially in its own set.
    UnionFind(int n) {
        parent.resize(n);
        std::iota(parent.begin(), parent.end(), 0); // Initialize parent[i] = i
        size.assign(n, 1);                         // Initialize size[i] = 1
    }

    // Find operation: Returns the representative (root) of the set containing element 'i'.
    // Uses path compression for optimization.
    int find(int i) {
        if (parent[i] == i) {
            return i; // If 'i' is the root, return 'i'
        }
        // Path compression: Set parent[i] to the root of its set
        return parent[i] = find(parent[i]);
    }

    // Union operation: Merges the sets containing elements 'i' and 'j'.
    // Uses union by size for optimization.
    void unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);

        if (root_i != root_j) {
            // Union by size: Attach the smaller tree to the root of the larger tree
            if (size[root_i] < size[root_j]) {
                std::swap(root_i, root_j); // Ensure root_i is the root of the larger set
            }
            parent[root_j] = root_i;    // Make root_i the parent of root_j
            size[root_i] += size[root_j]; // Update the size of the merged set
        }
    }

    // Get the size of the set containing element 'i'.
    int getSize(int i) {
        return size[find(i)];
    }
};

class Solution {
public:
    int minimumHammingDistance(std::vector<int>& source, std::vector<int>& target, std::vector<std::vector<int>>& allowedSwaps) {
        int n = source.length(); // Get the length of the arrays
        UnionFind uf(n);         // Initialize Union-Find for 'n' indices

        // Process all allowed swaps to build connected components
        for (const auto& swap_pair : allowedSwaps) {
            uf.unite(swap_pair[0], swap_pair[1]); // Unite the sets containing the two indices
        }

        // Map to store components: key is the root of the component, value is a vector of indices belonging to that component.
        std::unordered_map<int, std::vector<int>> components;
        for (int i = 0; i < n; ++i) {
            components[uf.find(i)].push_back(i); // Add index 'i' to its corresponding component
        }

        int min_hamming_distance = 0; // Initialize the minimum Hamming distance

        // Iterate through each connected component
        for (auto const& [root, indices] : components) {
            // For each component, we want to see how many elements from 'source' can be moved to match 'target'.
            // This is equivalent to finding the number of elements that *cannot* be matched within the component.

            std::unordered_map<int, int> source_counts; // Frequency map for elements in 'source' within this component
            std::unordered_map<int, int> target_counts; // Frequency map for elements in 'target' within this component

            // Populate frequency maps for source and target within the current component
            for (int index : indices) {
                source_counts[source[index]]++;
                target_counts[target[index]]++;
            }

            // Calculate the number of elements that can be matched within this component.
            // For each distinct value, the maximum number of matches we can achieve is
            // min(count in source, count in target).
            int matched_elements = 0;
            for (auto const& [val, count] : source_counts) {
                if (target_counts.count(val)) { // If the value exists in target_counts
                    matched_elements += std::min(count, target_counts[val]);
                }
            }

            // The number of elements that *cannot* be matched in this component
            // is the total number of elements in the component minus the number of matched elements.
            // This directly contributes to the Hamming distance.
            min_hamming_distance += indices.size() - matched_elements;
        }

        return min_hamming_distance; // Return the total minimum Hamming distance
    }
};
```