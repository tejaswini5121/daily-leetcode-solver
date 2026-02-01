```javascript
/**
 * @summary Given an array of integers, divide it into 3 disjoint contiguous subarrays.
 * The cost of a subarray is its first element. Return the minimum possible sum of costs.
 * @link https://leetcode.com/problems/divide-an-array-into-subarrays-with-minimum-cost-i/
 * @approach The problem requires dividing the array into exactly 3 contiguous subarrays.
 * This means we need to choose two split points. Let the split points be after index `i` and after index `j`, where `0 <= i < j < n-1`.
 * The three subarrays will be `nums[0...i]`, `nums[i+1...j]`, and `nums[j+1...n-1]`.
 * The cost of the first subarray is `nums[0]`.
 * The cost of the second subarray is `nums[i+1]`.
 * The cost of the third subarray is `nums[j+1]`.
 * We need to find the minimum sum `nums[0] + nums[i+1] + nums[j+1]` over all valid choices of `i` and `j`.
 *
 * A brute-force approach would be to iterate through all possible pairs of split points.
 * The first split point can be after index 0 up to `n-3`.
 * The second split point must be after the first split point, up to `n-2`.
 *
 * Let the first split be after index `i`. This means the first subarray ends at `i`. The second subarray starts at `i+1`.
 * Let the second split be after index `j`. This means the second subarray ends at `j`. The third subarray starts at `j+1`.
 *
 * The valid range for `i` is from `0` to `n-3` (inclusive). If `i = n-3`, the first subarray is `nums[0...n-3]`.
 * The valid range for `j` is from `i+1` to `n-2` (inclusive). If `j = n-2`, the second subarray is `nums[i+1...n-2]`.
 *
 * The three subarrays would be:
 * 1. `nums[0...i]` (cost: `nums[0]`)
 * 2. `nums[i+1...j]` (cost: `nums[i+1]`)
 * 3. `nums[j+1...n-1]` (cost: `nums[j+1]`)
 *
 * So, the total cost is `nums[0] + nums[i+1] + nums[j+1]`.
 * We need to minimize this sum by iterating through all valid `i` and `j`.
 *
 * The constraints are small (`n <= 50`), so a brute-force O(n^2) approach is acceptable.
 *
 * Example: nums = [1, 2, 3, 12], n = 4
 *
 * i = 0:
 *   j = 1:
 *     Subarrays: [1], [2], [3, 12]
 *     Cost: nums[0] + nums[1] + nums[2] = 1 + 2 + 3 = 6
 *   j = 2:
 *     Subarrays: [1], [2, 3], [12]
 *     Cost: nums[0] + nums[1] + nums[3] = 1 + 2 + 12 = 15
 *
 * i = 1: (n-3 = 1, so i can only be 0 or 1)
 *   j = 2: (j must be >= i+1, so j >= 2. And j <= n-2 = 2)
 *     Subarrays: [1, 2], [3], [12]
 *     Cost: nums[0] + nums[2] + nums[3] = 1 + 3 + 12 = 16
 *
 * Minimum cost found is 6.
 *
 * @timeComplexity O(n^2) due to nested loops iterating through possible split points.
 * @spaceComplexity O(1) as we only use a few variables to store the minimum cost and loop indices.
 */
var minimumCost = function(nums) {
    // Get the length of the array.
    const n = nums.length;
    // Initialize the minimum cost to a very large value.
    // This ensures that the first calculated cost will be smaller.
    let minTotalCost = Infinity;

    // The first subarray starts at index 0.
    // We need to choose a split point after index `i`.
    // The first subarray is nums[0...i].
    // The second subarray starts at index `i+1`.
    // The third subarray starts at index `j+1`.
    //
    // Constraints:
    // 1. There must be at least one element in the first subarray (always true as it starts at 0).
    // 2. There must be at least one element in the second subarray, so `i+1 <= j`.
    // 3. There must be at least one element in the third subarray, so `j+1 <= n-1`.
    //
    // From condition 2: `i < j`
    // From condition 3: `j < n-1`
    // Combining these, `i < j < n-1`.
    //
    // The first subarray `nums[0...i]` has cost `nums[0]`.
    // The second subarray `nums[i+1...j]` has cost `nums[i+1]`.
    // The third subarray `nums[j+1...n-1]` has cost `nums[j+1]`.
    //
    // So, we need to iterate through possible `i` and `j` such that:
    // The first split point `i` can be from `0` up to `n-3`.
    // If `i = n-3`, the first subarray is `nums[0...n-3]`.
    //
    // The second split point `j` must be after `i` and before `n-1`.
    // So, `j` can be from `i+1` up to `n-2`.
    // If `j = n-2`, the second subarray is `nums[i+1...n-2]`.
    //
    // This ensures:
    // - First subarray: `nums[0...i]` (length >= 1)
    // - Second subarray: `nums[i+1...j]` (length >= 1 since j >= i+1)
    // - Third subarray: `nums[j+1...n-1]` (length >= 1 since j <= n-2 means j+1 <= n-1)

    // Iterate through all possible end indices `i` for the first subarray.
    // `i` can range from `0` to `n-3`.
    // The first subarray is `nums[0...i]`. Its cost is `nums[0]`.
    // The second subarray starts at `i+1`.
    for (let i = 0; i <= n - 3; i++) {
        // Iterate through all possible end indices `j` for the second subarray.
        // `j` must be after `i` and before the last element.
        // So, `j` can range from `i+1` to `n-2`.
        // The second subarray is `nums[i+1...j]`. Its cost is `nums[i+1]`.
        for (let j = i + 1; j <= n - 2; j++) {
            // The third subarray starts at `j+1`.
            // The third subarray is `nums[j+1...n-1]`. Its cost is `nums[j+1]`.

            // Calculate the total cost for this division.
            // Cost = cost of first subarray + cost of second subarray + cost of third subarray
            const currentTotalCost = nums[0] + nums[i + 1] + nums[j + 1];

            // Update the minimum total cost if the current cost is smaller.
            minTotalCost = Math.min(minTotalCost, currentTotalCost);
        }
    }

    // Return the minimum total cost found.
    return minTotalCost;
};
```