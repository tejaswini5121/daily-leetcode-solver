/**
 * @file LeetCode Problem 2447: Minimum Distance Between Three Equal Elements I
 * @summary Finds the minimum distance between three equal elements in an array.
 * @link https://leetcode.com/problems/minimum-distance-between-three-equal-elements-i/
 *
 * @approach
 * The problem asks for the minimum distance between three distinct indices i, j, and k such that nums[i] == nums[j] == nums[k].
 * The distance is defined as abs(i - j) + abs(j - k) + abs(k - i).
 *
 * We can iterate through all possible combinations of three distinct indices (i, j, k) and check if the elements at these indices are equal.
 * If they are equal, we calculate the distance and update the minimum distance found so far.
 *
 * To optimize, we can first group the indices by their corresponding values. A hash map (or a Map in JavaScript) can be used for this, where keys are the numbers from the array and values are arrays of indices where that number appears.
 *
 * After populating the map, we iterate through each number that appears at least 3 times. For each such number, we consider all combinations of three indices from its list of occurrences.
 *
 * The distance calculation abs(i - j) + abs(j - k) + abs(k - i) can be simplified. If we assume i < j < k (which we can do by sorting the indices for a given number), the distance becomes (j - i) + (k - j) + (k - i) = 2 * (k - i).
 * Therefore, for a given number, to minimize the distance 2 * (k - i), we need to find the smallest difference between the largest and smallest index among any three occurrences. This is equivalent to finding the smallest difference between the first and last occurrence of any three occurrences.
 *
 * So, for each number that appears at least 3 times, we iterate through all possible triplets of its indices and calculate the distance. We maintain a global minimum distance.
 *
 * If no number appears at least 3 times, or if we can't form any valid triplets, we return -1.
 *
 * @time_complexity
 * Let N be the length of the input array `nums`.
 * Building the hash map: O(N) time.
 * Iterating through the map: In the worst case, one number can appear N times.
 * If a number appears M times, we need to pick 3 indices from M. The number of combinations is O(M^3).
 * In the worst case, M can be N, leading to O(N^3) for picking triplets.
 *
 * However, the problem statement is about "Minimum Distance Between Three Equal Elements I" which suggests a simpler approach might be intended for an "Easy" difficulty.
 * A brute-force approach of checking all triplets of indices (i, j, k) is O(N^3).
 *
 * Let's reconsider the distance simplification. If we have indices i, j, k for the same value, and we sort them such that i_sorted < j_sorted < k_sorted, the distance is abs(i_sorted - j_sorted) + abs(j_sorted - k_sorted) + abs(k_sorted - i_sorted) = (j_sorted - i_sorted) + (k_sorted - j_sorted) + (k_sorted - i_sorted) = 2 * (k_sorted - i_sorted).
 * This means the distance is twice the difference between the largest and smallest index among the three.
 *
 * So, for each number, if it appears multiple times, we need to find triplets of its indices that minimize the difference between the maximum and minimum index.
 *
 * A more efficient approach using the hash map:
 * 1. Create a map `indicesByValue` where keys are numbers and values are arrays of their indices. O(N).
 * 2. Initialize `minDistance` to infinity.
 * 3. Iterate through the `indicesByValue` map. For each value:
 *    a. If the array of indices for a value has length less than 3, skip it.
 *    b. If the array of indices has length >= 3, iterate through all combinations of 3 indices (i, j, k) from this array.
 *       - Calculate the distance: `abs(indices[i] - indices[j]) + abs(indices[j] - indices[k]) + abs(indices[k] - indices[i])`.
 *       - Update `minDistance = min(minDistance, distance)`.
 *
 * The time complexity of step 3b depends on the distribution of elements. If one element appears N times, we might iterate through O(N^3) combinations. This is still O(N^3) in the worst case.
 *
 * Given the "Easy" difficulty and N <= 100, an O(N^3) approach is likely acceptable.
 *
 * Let's stick to the simpler triple nested loop approach for O(N^3) time, as it's easier to implement and understand for an "Easy" problem.
 *
 * The problem statement mentions "distinct indices". The brute force approach will naturally handle distinct indices because the loops are `i` from 0 to N-1, `j` from `i+1` to N-1, and `k` from `j+1` to N-1.
 *
 * @space_complexity
 * O(1) if we don't consider the input array.
 * If we use a hash map to store indices, it could be O(N) in the worst case (e.g., all elements are distinct, or all elements are the same).
 * However, for the brute force O(N^3) approach without explicit pre-processing into a map, the space complexity is O(1).
 * Let's use the O(N^3) brute force approach for simplicity and clarity, given the constraints.
 */
var minDistance = function(nums) {
    const n = nums.length;
    let minDistance = Infinity; // Initialize minimum distance to a very large value
    let foundGoodTuple = false; // Flag to check if any good tuple is found

    // Iterate through all possible combinations of three distinct indices (i, j, k)
    // Ensure i < j < k to avoid duplicate combinations and ensure distinctness
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                // Check if the elements at these indices are equal
                if (nums[i] === nums[j] && nums[j] === nums[k]) {
                    foundGoodTuple = true; // A good tuple is found
                    
                    // Calculate the distance for the current good tuple
                    const currentDistance = Math.abs(i - j) + Math.abs(j - k) + Math.abs(k - i);
                    
                    // Update the minimum distance if the current distance is smaller
                    minDistance = Math.min(minDistance, currentDistance);
                }
            }
        }
    }

    // If no good tuple was found, return -1, otherwise return the minimum distance
    return foundGoodTuple ? minDistance : -1;
};
```