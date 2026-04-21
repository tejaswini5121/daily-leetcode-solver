// Problem: Minimize Hamming Distance After Swap Operations
// Link: https://leetcode.com/problems/minimize-hamming-distance-after-swap-operations/
//
// Approach:
// The core idea is that if two indices are connected through a series of allowed swaps,
// the elements at those indices can be freely permuted among themselves. This means
// we can group indices that are swappable into connected components.
// For each connected component, we want to see how many elements from the 'source'
// array within that component can be matched with elements from the 'target' array
// within the same component. The elements that cannot be matched (after optimal
// rearrangement within the component) contribute to the Hamming distance.
//
// We can use the Union-Find data structure to efficiently group indices into connected
// components based on the allowedSwaps.
//
// After building the connected components, for each component:
// 1. Collect all the values from the 'source' array at indices belonging to this component.
// 2. Collect all the values from the 'target' array at indices belonging to this component.
// 3. Count the occurrences of each number in both the source and target collections for this component.
// 4. The number of elements that can be matched is the sum of the minimum counts for each distinct number
//    across the source and target collections.
// 5. The number of elements that cannot be matched (i.e., contribute to the Hamming distance)
//    is the total number of elements in the component minus the number of matched elements.
//
// We sum up these unmatched counts for all connected components to get the minimum Hamming distance.
//
// Time Complexity:
// - Building the Union-Find structure: O(N + M * alpha(N)), where N is the length of source/target,
//   M is the number of allowed swaps, and alpha is the inverse Ackermann function (practically constant).
// - Iterating through components and counting/matching elements: For each component, we iterate through
//   its indices. In total, each index is processed once to collect source and target values.
//   Counting frequencies using a Map or object takes O(K) where K is the size of the component.
//   The sum of component sizes is N. Thus, this step is roughly O(N * log(max_value)) if using sorted maps
//   or O(N) on average if using hash maps. Given the constraint `1 <= source[i], target[i] <= 105`,
//   we can use arrays as frequency maps if values are within bounds, leading to O(N).
//   If values can be larger and we use Maps, it's O(N).
// - Overall: O(N + M * alpha(N)) which simplifies to O(N + M) as alpha(N) is nearly constant.
//
// Space Complexity:
// - Union-Find parent array: O(N)
// - Rank/Size array for Union-Find: O(N)
// - Storing component indices (e.g., using `componentMap`): O(N)
// - Storing frequency maps for source and target values within each component: In the worst case,
//   a component could contain all N elements, leading to O(N) for the frequency maps.
// - Overall: O(N)
/**
 * @param {number[]} source
 * @param {number[]} target
 * @param {number[][]} allowedSwaps
 * @return {number}
 */
const minimumHammingDistance = (source, target, allowedSwaps) => {
    const n = source.length;

    // --- Union-Find Implementation ---
    // Initialize parent array where each element is its own parent initially.
    const parent = Array(n).fill(0).map((_, i) => i);
    // Rank array to optimize union operation (union by rank/size).
    const rank = Array(n).fill(1);

    // Find operation with path compression.
    // Finds the representative (root) of the set that element `i` belongs to.
    // Path compression flattens the tree structure for faster future lookups.
    const find = (i) => {
        if (parent[i] === i) {
            return i;
        }
        parent[i] = find(parent[i]); // Path compression
        return parent[i];
    };

    // Union operation with union by rank.
    // Merges the sets containing elements `i` and `j`.
    const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);

        if (rootI !== rootJ) {
            // Union by rank: attach the shorter tree under the root of the taller tree.
            if (rank[rootI] < rank[rootJ]) {
                parent[rootI] = rootJ;
                rank[rootJ] += rank[rootI];
            } else {
                parent[rootJ] = rootI;
                rank[rootI] += rank[rootJ];
            }
            return true; // Indicates a successful union
        }
        return false; // Elements were already in the same set
    };
    // --- End of Union-Find Implementation ---

    // Process all allowed swaps to build connected components.
    // For each swap [a, b], union the sets containing indices a and b.
    for (const [u, v] of allowedSwaps) {
        union(u, v);
    }

    // Group indices into connected components.
    // `componentMap` will store, for each root of a component, a list of indices belonging to that component.
    const componentMap = new Map();

    for (let i = 0; i < n; i++) {
        const root = find(i); // Find the representative for index i
        if (!componentMap.has(root)) {
            componentMap.set(root, []);
        }
        componentMap.get(root).push(i);
    }

    let minHammingDistance = 0;

    // Iterate through each connected component.
    for (const indices of componentMap.values()) {
        // For each component, we want to determine how many elements can be placed
        // in their correct target positions.
        // This is equivalent to finding the maximum number of elements that can be matched
        // between the source and target values within this component.

        // Count frequencies of numbers in the source array for the current component.
        const sourceCounts = new Map();
        // Count frequencies of numbers in the target array for the current component.
        const targetCounts = new Map();

        // Populate the frequency maps for source and target values within the component.
        for (const index of indices) {
            const sourceVal = source[index];
            const targetVal = target[index];

            sourceCounts.set(sourceVal, (sourceCounts.get(sourceVal) || 0) + 1);
            targetCounts.set(targetVal, (targetCounts.get(targetVal) || 0) + 1);
        }

        // Calculate the number of elements that can be matched within this component.
        // For each number, the maximum number of matches we can achieve is the minimum
        // of its occurrences in the source and target arrays within this component.
        let matchedCount = 0;
        // Iterate through the unique source values in this component.
        for (const [val, count] of sourceCounts.entries()) {
            // If the target array also contains this value in this component,
            // we can match up to `min(sourceCount, targetCount)` occurrences.
            if (targetCounts.has(val)) {
                matchedCount += Math.min(count, targetCounts.get(val));
            }
        }

        // The number of elements that *cannot* be matched within this component
        // is the total number of elements in the component minus the number that can be matched.
        // These unmatched elements contribute to the Hamming distance.
        const unmatchedCount = indices.length - matchedCount;
        minHammingDistance += unmatchedCount;
    }

    return minHammingDistance;
};