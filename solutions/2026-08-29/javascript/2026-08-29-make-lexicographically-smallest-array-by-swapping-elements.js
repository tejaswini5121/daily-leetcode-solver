/**
 * Problem: Make Lexicographically Smallest Array by Swapping Elements
 * Link: https://leetcode.com/problems/make-lexicographically-smallest-array-by-swapping-elements/
 *
 * Approach:
 * This problem asks us to find the lexicographically smallest array by swapping elements if their absolute difference is within a given limit.
 * This condition (|nums[i] - nums[j]| <= limit) defines a relationship between elements: if two elements can be swapped, they are "connected".
 * Since swaps can be performed any number of times, this relationship is transitive. If A can be swapped with B, and B can be swapped with C,
 * then A, B, and C can all be rearranged amongst their original positions. This forms connected components.
 *
 * Specifically, if |nums[i] - nums[j]| <= limit, nums[i] and nums[j] are in the same "swappable group".
 * This property can be modeled using a Union-Find data structure. For each connected component, all elements within that component can be
 * freely permuted among the original indices occupied by elements of that component.
 *
 * To achieve the lexicographically smallest array, for each connected component, we should:
 * 1. Collect all original values of elements in this component.
 * 2. Collect all original indices occupied by elements in this component.
 * 3. Sort the collected values in ascending order.
 * 4. Sort the collected indices in ascending order.
 * 5. Assign the smallest sorted value to the smallest sorted index, the second smallest value to the second smallest index, and so on.
 *
 * This process ensures that for each component, the smallest possible values are placed at the earliest possible indices, contributing to a
 * lexicographically smallest overall array.
 *
 * The overall algorithm will be:
 * 1. Create pairs of (value, original_index) to keep track of original positions after sorting.
 * 2. Sort these pairs based on their values. This helps in efficiently identifying connectable elements.
 * 3. Initialize a Union-Find data structure.
 * 4. Iterate through the sorted pairs. For each pair (val_i, idx_i), compare it with the previous pair (val_prev, idx_prev).
 *    If |val_i - val_prev| <= limit, then nums[idx_i] and nums[idx_prev] are connectable. Union their groups using the Union-Find structure.
 *    Note: Because the array is sorted by value, we only need to compare an element with its immediate predecessor to identify direct connections.
 *    Transitivity will be handled by Union-Find. If A is connected to B, and B to C, then `find(A)` and `find(B)` will eventually be the same, and `find(B)` and `find(C)` will eventually be the same.
 *    This ensures that `find(A)` and `find(C)` also become the same.
 * 5. After building the Union-Find structure, we iterate through the original array `nums`.
 *    For each element `nums[i]`, find its root `root_i` using `find(i)`.
 *    We need to collect all indices and values belonging to the same root.
 *    A map (e.g., `Map<number, { values: number[], indices: number[] }>`) can store this information, where keys are root indices.
 * 6. For each root in the map:
 *    a. Sort the `values` array for that root.
 *    b. Sort the `indices` array for that root.
 *    c. Assign `sorted_values[k]` to `result_array[sorted_indices[k]]` for all `k`.
 * 7. Return the `result_array`.
 *
 * Time Complexity:
 * - Creating pairs: O(N)
 * - Sorting pairs: O(N log N)
 * - Union-Find operations:
 *   - N initial `makeSet` operations implicitly.
 *   - N-1 potential `union` operations (worst case, iterating through sorted pairs).
 *   - Finding roots for grouping: N `find` operations.
 *   - Each `union` and `find` operation takes nearly constant time on average due to path compression and union by size/rank (amortized O(alpha(N)), where alpha is the inverse Ackermann function, practically constant).
 *   - So, Union-Find part is O(N * alpha(N)).
 * - Grouping values and indices: O(N) for iterating and pushing to arrays.
 * - Sorting values and indices within each component: If there are K components, and component `c_j` has `s_j` elements, this step takes Sum(s_j log s_j) over all components. Since Sum(s_j) = N, this is at most O(N log N).
 * - Assigning results: O(N).
 * Overall Time Complexity: O(N log N) dominated by sorting.
 *
 * Space Complexity:
 * - Pairs array: O(N)
 * - Union-Find parent array and size array: O(N)
 * - Map to store values and indices for components: O(N) in total across all lists.
 * - Result array: O(N)
 * Overall Space Complexity: O(N)
 */

/**
 * UnionFind data structure
 */
class UnionFind {
    constructor(n) {
        this.parent = new Array(n);
        this.size = new Array(n); // Used for union by size
        for (let i = 0; i < n; i++) {
            this.parent[i] = i; // Each element is initially its own parent
            this.size[i] = 1;   // Each set initially has size 1
        }
    }

    /**
     * Finds the representative (root) of the set that element `i` belongs to.
     * Performs path compression for efficiency.
     * @param {number} i The element to find the root for.
     * @returns {number} The root of the set.
     */
    find(i) {
        if (this.parent[i] === i) {
            return i;
        }
        // Path compression: set parent[i] directly to the root
        this.parent[i] = this.find(this.parent[i]);
        return this.parent[i];
    }

    /**
     * Unites the sets containing elements `i` and `j`.
     * Uses union by size for efficiency.
     * @param {number} i One element.
     * @param {number} j The other element.
     * @returns {boolean} True if a union occurred, false if they were already in the same set.
     */
    union(i, j) {
        let rootI = this.find(i);
        let rootJ = this.find(j);

        if (rootI !== rootJ) {
            // Union by size: attach smaller tree under root of larger tree
            if (this.size[rootI] < this.size[rootJ]) {
                [rootI, rootJ] = [rootJ, rootI]; // Swap to ensure rootI is the larger tree
            }
            this.parent[rootJ] = rootI;
            this.size[rootI] += this.size[rootJ];
            return true;
        }
        return false;
    }
}

/**
 * @param {number[]} nums
 * @param {number} limit
 * @return {number[]}
 */
var makeLexicographicallySmallestArray = function(nums, limit) {
    const n = nums.length;

    // Step 1: Create pairs of (value, original_index)
    // This is crucial because sorting by value will lose original indices.
    const indexedNums = new Array(n);
    for (let i = 0; i < n; i++) {
        indexedNums[i] = { value: nums[i], originalIndex: i };
    }

    // Step 2: Sort these pairs based on their values.
    // This allows us to easily check adjacent elements for the `limit` condition.
    indexedNums.sort((a, b) => a.value - b.value);

    // Step 3: Initialize Union-Find structure.
    // The UnionFind operates on original indices.
    const uf = new UnionFind(n);

    // Step 4: Iterate through the sorted pairs to build connected components.
    // Compare each element with its immediate predecessor in the sorted list.
    // If their difference is within the limit, they can be swapped, so union their groups.
    for (let i = 1; i < n; i++) {
        const current = indexedNums[i];
        const previous = indexedNums[i - 1];

        // Check if the absolute difference between values is within the limit.
        // Since `indexedNums` is sorted by value, `current.value - previous.value` is always non-negative.
        if (current.value - previous.value <= limit) {
            // If they can be swapped, union the sets of their original indices.
            uf.union(current.originalIndex, previous.originalIndex);
        }
    }

    // Step 5: Group values and original indices by their component root.
    // A map will store {rootIndex: {values: [], indices: []}}
    const components = new Map();
    for (let i = 0; i < n; i++) {
        const root = uf.find(i); // Find the root for the original index i

        if (!components.has(root)) {
            components.set(root, { values: [], indices: [] });
        }
        // Add the current value (from original nums) and its index to the respective component.
        components.get(root).values.push(nums[i]);
        components.get(root).indices.push(i);
    }

    // Step 6: Construct the result array.
    const result = new Array(n);
    // Iterate through each connected component.
    for (const [root, data] of components.entries()) {
        // a. Sort the values within this component.
        data.values.sort((a, b) => a - b);
        // b. Sort the original indices within this component.
        data.indices.sort((a, b) => a - b);

        // c. Assign the smallest sorted value to the smallest sorted index, etc.
        // This ensures lexicographical smallest arrangement for this component.
        for (let i = 0; i < data.values.length; i++) {
            result[data.indices[i]] = data.values[i];
        }
    }

    // Step 7: Return the lexicographically smallest array.
    return result;
};