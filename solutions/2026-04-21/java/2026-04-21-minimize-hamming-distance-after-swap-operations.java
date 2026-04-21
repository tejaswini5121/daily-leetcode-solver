```java
// Problem: Minimize Hamming Distance After Swap Operations
// Link: https://leetcode.com/problems/minimize-hamming-distance-after-swap-operations/
//
// Problem Summary: Given two arrays source and target, and a list of allowed swaps between indices in source,
// find the minimum Hamming distance between source and target after performing any number of allowed swaps.
//
// Approach:
// The allowed swaps define connected components of indices in the 'source' array.
// Within each connected component, we can rearrange the elements of 'source' arbitrarily.
// To minimize the Hamming distance, for each connected component, we should try to match
// the elements present in that component of 'source' with the elements present at the
// corresponding indices in 'target'.
//
// We can use a Union-Find data structure to efficiently determine these connected components.
// For each index 'i', we will find its root (representative) in the Union-Find structure.
// Then, we will group all indices that belong to the same connected component.
//
// For each connected component:
// 1. Collect all elements from 'source' at indices belonging to this component.
// 2. Collect all elements from 'target' at indices belonging to this component.
// 3. Count the frequency of each number in both collections.
// 4. For each number, the number of matches we can achieve within this component is the minimum
//    of its frequency in the 'source' elements and its frequency in the 'target' elements.
// 5. The number of mismatches for this component is the total number of elements in the component
//    minus the total number of matches.
//
// The total minimum Hamming distance is the sum of mismatches across all connected components.
//
// Time Complexity:
// - Union-Find operations (union and find): Nearly constant time on average with path compression and union by rank/size.
// - Building the Union-Find structure: O(N + M), where N is the length of arrays and M is the number of allowed swaps.
// - Grouping elements by component: O(N).
// - Counting frequencies and calculating mismatches for each component: For each component, we iterate through its elements. In total, this is O(N).
//   Using HashMaps to store frequencies, insertions and lookups are O(1) on average.
// Overall Time Complexity: O(N + M)
//
// Space Complexity:
// - Union-Find parent array: O(N)
// - HashMaps to store frequencies for each component: In the worst case, all elements might be in different components, leading to O(N) for each component. However, the total number of distinct elements across all components is at most N. So, the space for frequency maps across all components will be O(N) in total.
// - Lists to store elements for each component: O(N) in total.
// Overall Space Complexity: O(N)
//
class Solution {
    // Union-Find data structure to manage connected components.
    private static class UnionFind {
        private int[] parent;
        private int[] size; // To optimize union by size

        public UnionFind(int n) {
            parent = new int[n];
            size = new int[n];
            for (int i = 0; i < n; i++) {
                parent[i] = i; // Initially, each element is its own parent.
                size[i] = 1;   // Initially, each set has size 1.
            }
        }

        // Find the representative (root) of the set containing element i.
        // Uses path compression for optimization.
        public int find(int i) {
            if (parent[i] == i) {
                return i;
            }
            // Path compression: set parent[i] to the root directly.
            parent[i] = find(parent[i]);
            return parent[i];
        }

        // Unite the sets containing elements i and j.
        // Uses union by size for optimization.
        public void union(int i, int j) {
            int rootI = find(i);
            int rootJ = find(j);

            if (rootI != rootJ) {
                // Union by size: attach smaller tree under root of larger tree.
                if (size[rootI] < size[rootJ]) {
                    parent[rootI] = rootJ;
                    size[rootJ] += size[rootI];
                } else {
                    parent[rootJ] = rootI;
                    size[rootI] += size[rootJ];
                }
            }
        }
    }

    public int minHammingDistance(int[] source, int[] target, int[][] allowedSwaps) {
        int n = source.length;
        UnionFind uf = new UnionFind(n);

        // Build connected components using allowedSwaps.
        for (int[] swap : allowedSwaps) {
            uf.union(swap[0], swap[1]);
        }

        // Use a HashMap to group indices by their connected component root.
        // Key: root of the component, Value: List of indices in that component.
        Map<Integer, List<Integer>> components = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int root = uf.find(i);
            components.computeIfAbsent(root, k -> new ArrayList<>()).add(i);
        }

        int minHammingDistance = 0;

        // Iterate through each connected component.
        for (List<Integer> indices : components.values()) {
            // For each component, we need to find the best possible matches.
            // This involves counting the frequencies of elements in 'source' and 'target'
            // within the current component's indices.

            // Map to store frequency of numbers from 'source' in this component.
            Map<Integer, Integer> sourceFreq = new HashMap<>();
            // Map to store frequency of numbers from 'target' in this component.
            Map<Integer, Integer> targetFreq = new HashMap<>();

            // Populate frequencies for the current component.
            for (int index : indices) {
                sourceFreq.put(source[index], sourceFreq.getOrDefault(source[index], 0) + 1);
                targetFreq.put(target[index], targetFreq.getOrDefault(target[index], 0) + 1);
            }

            // Calculate the number of elements that *cannot* be matched within this component.
            // This is the number of mismatches for this component.
            int currentComponentMismatches = 0;

            // We iterate through the elements present in the source for this component.
            // For each number, the maximum number of matches we can achieve is limited by
            // its frequency in source and its frequency in target.
            for (Map.Entry<Integer, Integer> entry : sourceFreq.entrySet()) {
                int num = entry.getKey();
                int countInSource = entry.getValue();
                int countInTarget = targetFreq.getOrDefault(num, 0);

                // The number of occurrences of 'num' that can be matched is min(countInSource, countInTarget).
                // The number of occurrences of 'num' that *cannot* be matched is countInSource - min(countInSource, countInTarget).
                // However, a simpler way to think about it is that the total number of elements in the component is 'indices.size()'.
                // The number of elements that *can* be matched is the sum of min(sourceFreq[x], targetFreq[x]) for all numbers 'x'.
                // The number of mismatches is indices.size() - (sum of matches).

                // Let's count the matches directly.
                int matchesForNum = Math.min(countInSource, countInTarget);
                // We subtract these matches from the total available 'countInSource' for this number.
                // The remaining 'countInSource - matchesForNum' cannot be placed at the target positions for this number.
                // These will contribute to the Hamming distance.
                currentComponentMismatches += (countInSource - matchesForNum);
            }

            // An alternative and perhaps cleaner way to calculate mismatches:
            // Total elements in component = indices.size()
            // Total elements that CAN be matched = sum of min(sourceFreq[num], targetFreq[num]) for all distinct numbers 'num'.
            // Mismatches = indices.size() - (total elements that can be matched)

            // Let's re-calculate using the second approach for clarity:
            int totalMatchesInComponent = 0;
            // Consider all unique numbers that appear in either sourceFreq or targetFreq for this component.
            Set<Integer> allUniqueNums = new HashSet<>(sourceFreq.keySet());
            allUniqueNums.addAll(targetFreq.keySet());

            for(int num : allUniqueNums) {
                int countInSource = sourceFreq.getOrDefault(num, 0);
                int countInTarget = targetFreq.getOrDefault(num, 0);
                totalMatchesInComponent += Math.min(countInSource, countInTarget);
            }
            
            // The number of positions in this component that will have a mismatch is
            // the total number of elements in the component minus the maximum number of matches we can achieve.
            minHammingDistance += (indices.size() - totalMatchesInComponent);
        }

        return minHammingDistance;
    }
}
```