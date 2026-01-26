/**
 * @summary Given an array of distinct integers, find all pairs with the minimum absolute difference.
 * @link https://leetcode.com/problems/minimum-absolute-difference/
 * @approach
 * 1. Sort the input array `arr` in ascending order. This is crucial because the minimum absolute difference between any two elements will always occur between adjacent elements in a sorted array.
 * 2. Initialize `minDiff` to a very large number (e.g., `Infinity`) to keep track of the minimum absolute difference found so far.
 * 3. Iterate through the sorted array from the second element (`i = 1`). For each element, calculate the absolute difference with its preceding element (`arr[i] - arr[i-1]`).
 * 4. Update `minDiff` if the current difference is smaller than `minDiff`.
 * 5. After finding the `minDiff`, iterate through the sorted array again.
 * 6. For each adjacent pair, if their difference equals `minDiff`, add this pair `[arr[i-1], arr[i]]` to the `result` list.
 * 7. Return the `result` list.
 * @timeComplexity O(N log N) due to sorting. The subsequent traversals are O(N).
 * @spaceComplexity O(N) in the worst case for storing the result pairs, or O(log N) or O(N) for sorting depending on the implementation.
 */
const minimumAbsDifference = (arr) => {
    // Sort the array in ascending order.
    // This allows us to find the minimum absolute difference by comparing adjacent elements.
    arr.sort((a, b) => a - b);

    // Initialize minDiff to Infinity to ensure the first calculated difference will be smaller.
    let minDiff = Infinity;

    // First pass: Find the minimum absolute difference.
    for (let i = 1; i < arr.length; i++) {
        const diff = arr[i] - arr[i - 1];
        // Update minDiff if a smaller difference is found.
        minDiff = Math.min(minDiff, diff);
    }

    // Initialize an empty array to store the pairs with the minimum absolute difference.
    const result = [];

    // Second pass: Collect all pairs with the minimum absolute difference.
    for (let i = 1; i < arr.length; i++) {
        const diff = arr[i] - arr[i - 1];
        // If the current difference is equal to the minimum absolute difference,
        // add the pair [arr[i-1], arr[i]] to the result list.
        if (diff === minDiff) {
            result.push([arr[i - 1], arr[i]]);
        }
    }

    // Return the list of pairs.
    return result;
};
```