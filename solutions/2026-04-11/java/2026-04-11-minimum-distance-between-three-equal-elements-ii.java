```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    /*
     * Problem Summary: Find the minimum distance between three distinct indices with equal values in an array.
     * Link: https://leetcode.com/problems/minimum-distance-between-three-equal-elements-ii/
     *
     * Approach:
     * The problem asks for the minimum distance between three distinct indices (i, j, k) such that nums[i] == nums[j] == nums[k].
     * The distance is defined as abs(i - j) + abs(j - k) + abs(k - i).
     *
     * We can iterate through the array and store the indices for each unique number. A HashMap is suitable for this,
     * where the key is the number and the value is a list of indices where that number appears.
     *
     * After populating the HashMap, we iterate through each value (list of indices) in the HashMap.
     * If a list has fewer than 3 indices, we cannot form a good tuple with that number, so we skip it.
     *
     * For each list of indices with at least 3 elements, we need to find the minimum distance.
     * The distance formula abs(i - j) + abs(j - k) + abs(k - i) can be simplified.
     * Let's assume i < j < k without loss of generality. Then the distance is (j - i) + (k - j) + (k - i) = 2*(k - i).
     * This means for any three indices, the minimum distance will always be between the smallest and largest index, multiplied by 2.
     *
     * So, for each list of indices for a given number, we need to find the minimum possible value of 2 * (max_index - min_index).
     *
     * However, the problem states "distinct indices", and the distance formula implies we should consider all combinations of three distinct indices.
     * Let the three indices be `idx1`, `idx2`, `idx3`. The distance is `abs(idx1 - idx2) + abs(idx2 - idx3) + abs(idx3 - idx1)`.
     *
     * Let's analyze the distance formula: `abs(a - b) + abs(b - c) + abs(c - a)`.
     * Consider the indices sorted: `x <= y <= z`.
     * The distance is `(y - x) + (z - y) + (z - x) = 2 * (z - x)`.
     * This holds true for any three distinct indices. The minimum distance will always be achieved when we pick the smallest and largest indices among the three, and the middle index can be any of the remaining occurrences. The formula `2 * (max_index - min_index)` is correct for a triplet.
     *
     * So, for each number, if it appears at indices `idx_1, idx_2, ..., idx_m` (where `m >= 3`), we need to find the minimum `abs(idx_a - idx_b) + abs(idx_b - idx_c) + abs(idx_c - idx_a)` for distinct `a, b, c`.
     *
     * A crucial observation about the distance formula: `abs(i - j) + abs(j - k) + abs(k - i)`.
     * If we fix two indices `i` and `k`, we want to find a `j` such that `nums[j] == nums[i] == nums[k]` and `abs(i - j) + abs(j - k)` is minimized.
     *
     * Consider a value that appears at indices `p1, p2, p3, ..., pn` where `n >= 3`.
     * We are looking for `min(abs(pi - pj) + abs(pj - pk) + abs(pk - pi))` for distinct `i, j, k`.
     *
     * Let's consider a specific value `v`. Let its indices be `indices = [idx_1, idx_2, ..., idx_m]`.
     * If `m < 3`, we can't form a triplet.
     * If `m >= 3`, we can iterate through all possible triplets of indices from `indices`. This would be O(m^3) for each number, which is too slow.
     *
     * The distance `abs(i - j) + abs(j - k) + abs(k - i)` can be rewritten.
     * Let's consider `i < j < k`. The distance is `(j - i) + (k - j) + (k - i) = 2 * (k - i)`.
     *
     * This implies that for any triplet of indices `i, j, k` where `nums[i] == nums[j] == nums[k]`, the distance is `2 * (max(i, j, k) - min(i, j, k))`.
     * This is a significant simplification. We just need to find the minimum `2 * (max_index - min_index)` among all triplets of equal elements.
     *
     * So, for each value, if it appears at least 3 times, we need to find the minimum `max_index - min_index` across all triplets.
     *
     * Let's re-examine the distance. For indices `a, b, c`, the distance is `abs(a-b) + abs(b-c) + abs(c-a)`.
     * If we sort these indices as `x <= y <= z`, the distance becomes `(y-x) + (z-y) + (z-x) = 2(z-x)`.
     * This formula is correct if `x, y, z` are the indices.
     *
     * So, the problem reduces to finding the minimum `2 * (max_index - min_index)` over all triplets of indices with equal values.
     *
     * For a specific number, let its indices be `idx_1, idx_2, ..., idx_m`.
     * If `m < 3`, we skip.
     * If `m >= 3`, we need to find the minimum `2 * (idx_k - idx_i)` where `idx_i` and `idx_k` are indices from the list, and there exists at least one other index `idx_j` such that `nums[idx_i] == nums[idx_j] == nums[idx_k]`.
     *
     * The problem statement implies we need to pick *three distinct indices* `i, j, k`.
     * If we have indices `p1, p2, p3, ..., pm` for a number.
     * We need to find `min_{i, j, k distinct} (abs(pi - pj) + abs(pj - pk) + abs(pk - pi))`.
     *
     * Let's consider the distance for indices `a, b, c`.
     * If `a < b < c`, distance is `(b-a) + (c-b) + (c-a) = 2(c-a)`.
     * If `a < c < b`, distance is `(c-a) + (b-c) + (b-a) = 2(b-a)`.
     * In general, let `x = min(a, b, c)` and `z = max(a, b, c)`. Let `y` be the middle one.
     * The distance is `abs(a-b) + abs(b-c) + abs(c-a)`.
     * Let `a=0, b=2, c=3`. `nums[0]=1, nums[2]=1, nums[3]=1`.
     * Distance = `abs(0-2) + abs(2-3) + abs(3-0) = 2 + 1 + 3 = 6`.
     * Here `min=0`, `max=3`. `2 * (3-0) = 6`.
     *
     * Let `a=2, b=4, c=6`. `nums[2]=2, nums[4]=2, nums[6]=2`.
     * Distance = `abs(2-4) + abs(4-6) + abs(6-2) = 2 + 2 + 4 = 8`.
     * Here `min=2`, `max=6`. `2 * (6-2) = 8`.
     *
     * It seems the formula `2 * (max_index - min_index)` for any triplet of indices `i, j, k` with equal values is indeed correct.
     *
     * This means, for each number, if it appears at indices `idx_1, idx_2, ..., idx_m` (sorted), we need to find the minimum `2 * (idx_k - idx_i)` where `idx_k > idx_i` and there is at least one other index `idx_j` in between.
     *
     * This is equivalent to finding the minimum `max_index - min_index` over all valid triplets.
     *
     * For a number that appears at indices `p1, p2, p3, ..., pm` (sorted), we need to iterate through all possible pairs `(pi, pk)` where `i < k`. If `k - i >= 2` (meaning there's at least one index `pj` in between `pi` and `pk`), then `(pi, pj, pk)` forms a valid triplet. The distance is `2 * (pk - pi)`.
     *
     * So, for each number, if its list of indices has size `m >= 3`, we iterate through `i` from `0` to `m-3` and `k` from `i+2` to `m-1`. The distance is `2 * (indices[k] - indices[i])`. We want to minimize this over all such `i` and `k`.
     *
     * This approach would be:
     * 1. Create `Map<Integer, List<Integer>> indicesMap`.
     * 2. Populate `indicesMap` by iterating through `nums`.
     * 3. Initialize `minDistance = Integer.MAX_VALUE`.
     * 4. Iterate through `indicesMap.values()`:
     *    a. If `list.size() < 3`, continue.
     *    b. For `i` from `0` to `list.size() - 3`:
     *       For `k` from `i + 2` to `list.size() - 1`:
     *          `currentDistance = 2 * (list.get(k) - list.get(i))`
     *          `minDistance = Math.min(minDistance, currentDistance)`
     * 5. If `minDistance == Integer.MAX_VALUE`, return -1. Otherwise, return `minDistance`.
     *
     * Time Complexity:
     * - Populating the map: O(N), where N is the length of `nums`.
     * - Iterating through the map values: For each number, let `m` be the number of its occurrences. The nested loops iterate `O(m^2)` times. In the worst case, all elements are the same, so `m = N`. This would lead to `O(N^2)` for a single number, which is too slow.
     *
     * Let's reconsider the distance calculation.
     * For a fixed value `v`, let its indices be `p1, p2, ..., pm` sorted.
     * We want to minimize `abs(pi - pj) + abs(pj - pk) + abs(pk - pi)` for distinct `i, j, k`.
     *
     * The crucial part is that the distance `abs(a-b) + abs(b-c) + abs(c-a)` is always `2 * (max(a,b,c) - min(a,b,c))`. This is a proven geometric property for any three points on a line.
     *
     * So, for each number, we need to find the minimum difference between the largest and smallest index among *any* three occurrences.
     *
     * For a list of indices `p1, p2, ..., pm`, we want to find `min(pk - pi)` such that there exists `pj` where `pi < pj < pk`.
     * This means we need `k - i >= 2`.
     *
     * This implies that for each number, if it appears at least 3 times, we only need to consider the difference between the first and the last index, the first and the second-to-last index, etc.
     *
     * Actually, the problem simplifies to this: for each number, if it occurs at least 3 times, find the minimum `indices.get(k) - indices.get(i)` where `k >= i + 2`.
     *
     * Let's rethink the problem. We need to pick three *distinct* indices `i, j, k`.
     * The distance is `abs(i - j) + abs(j - k) + abs(k - i)`.
     *
     * Consider the sorted indices for a number: `idx_1, idx_2, ..., idx_m`.
     *
     * A triplet `(idx_a, idx_b, idx_c)` where `a, b, c` are distinct indices into this list.
     * Let `x = min(idx_a, idx_b, idx_c)` and `z = max(idx_a, idx_b, idx_c)`. The distance is `2 * (z - x)`.
     *
     * This means we want to find the minimum `z - x` where `x` and `z` are indices of the same number, and there is at least one other index of that same number strictly between `x` and `z`.
     *
     * So, for each number, if it appears at indices `p1, p2, ..., pm` (sorted):
     * We iterate through `i` from `0` to `m-1` (this will be our `x = pi`).
     * We iterate through `k` from `i+1` to `m-1` (this will be our `z = pk`).
     * If `k - i >= 2`, it means there's at least one index `pj` between `pi` and `pk` (i.e., `pi < pj < pk`).
     * Then the distance is `2 * (pk - pi)`. We update our `minDistance`.
     *
     * The complexity of iterating through `i` and `k` for a list of size `m` is `O(m^2)`.
     * In the worst case, all elements are the same (`m=N`), leading to `O(N^2)`. This is still too slow given N <= 10^5.
     *
     * What if we optimize finding the minimum `pk - pi` for `k >= i + 2`?
     *
     * For a fixed `i`, we are looking for `min(pk - pi)` where `k >= i + 2`. This is equivalent to finding `min(pk)` for `k >= i + 2`.
     *
     * For each number, let its indices be `p_0, p_1, ..., p_{m-1}`.
     *
     * We can iterate through `j` from `1` to `m-2` (this `p_j` will be our middle element).
     * For each `p_j`, we want to find the minimum `p_j - p_i` (where `i < j`) and the minimum `p_k - p_j` (where `k > j`).
     *
     * If we choose `p_j` as the middle element, we can potentially pair it with the closest element before it (`p_{j-1}`) and the closest element after it (`p_{j+1}`).
     * The distance would be `abs(p_{j-1} - p_j) + abs(p_j - p_{j+1}) + abs(p_{j+1} - p_{j-1})`.
     * If `p_{j-1} < p_j < p_{j+1}`, this simplifies to `(p_j - p_{j-1}) + (p_{j+1} - p_j) + (p_{j+1} - p_{j-1}) = 2 * (p_{j+1} - p_{j-1})`.
     *
     * This means we only need to consider adjacent triplets of indices for a given number.
     *
     * So, for each number:
     * If `indices.size() < 3`, continue.
     * Iterate `j` from `1` to `indices.size() - 2`.
     * Consider the triplet `(indices.get(j-1), indices.get(j), indices.get(j+1))`.
     * The distance is `2 * (indices.get(j+1) - indices.get(j-1))`.
     * Update `minDistance`.
     *
     * Example 1: `nums = [1,2,1,1,3]`
     * `indicesMap = {1: [0, 2, 3], 2: [1], 3: [4]}`
     * For number 1, indices are `[0, 2, 3]`. Size is 3.
     * `j` goes from `1` to `3-2 = 1`. So `j = 1`.
     * Triplet is `(indices.get(0), indices.get(1), indices.get(2))`, which is `(0, 2, 3)`.
     * Distance = `2 * (indices.get(2) - indices.get(0)) = 2 * (3 - 0) = 6`.
     * `minDistance = 6`.
     *
     * Example 2: `nums = [1,1,2,3,2,1,2]`
     * `indicesMap = {1: [0, 1, 5], 2: [2, 4, 6], 3: [3]}`
     * For number 1, indices are `[0, 1, 5]`. Size is 3.
     * `j = 1`. Triplet `(0, 1, 5)`. Distance = `2 * (5 - 0) = 10`. `minDistance = 10`.
     * For number 2, indices are `[2, 4, 6]`. Size is 3.
     * `j = 1`. Triplet `(2, 4, 6)`. Distance = `2 * (6 - 2) = 8`. `minDistance = min(10, 8) = 8`.
     *
     * This approach seems correct and has a better time complexity.
     *
     * Time Complexity:
     * - Populating the map: O(N).
     * - Iterating through the map values: For each number, let `m` be its occurrences. We iterate `m-2` times. The total number of iterations across all numbers is `sum(m_i - 2)` for `m_i >= 3`.
     *   Since `sum(m_i) = N`, the total number of iterations is at most `N`.
     *   Each iteration takes O(1) time.
     * - Total Time Complexity: O(N).
     *
     * Space Complexity:
     * - Storing the indices in the HashMap: In the worst case, all elements are distinct, so each list has size 1. In the case where all elements are the same, one list stores N indices.
     * - Total Space Complexity: O(N).
     *
     * This optimized approach appears to be the correct one.
     */
    public int minimumDistance(int[] nums) {
        // Map to store indices for each unique number.
        // Key: the number from nums
        // Value: a list of indices where this number appears in nums.
        Map<Integer, List<Integer>> indicesMap = new HashMap<>();

        // Populate the map by iterating through the input array.
        for (int i = 0; i < nums.length; i++) {
            // Get the current number.
            int num = nums[i];
            // If the number is not yet in the map, create a new list for it.
            // Otherwise, get the existing list.
            indicesMap.computeIfAbsent(num, k -> new ArrayList<>()).add(i);
        }

        // Initialize minimum distance to a very large value.
        // This will be updated as we find valid good tuples.
        int minDistance = Integer.MAX_VALUE;

        // Iterate through each list of indices in the map.
        // Each list corresponds to a unique number.
        for (List<Integer> indices : indicesMap.values()) {
            // A "good tuple" requires at least 3 distinct indices.
            // If a number appears less than 3 times, it cannot form a good tuple.
            if (indices.size() < 3) {
                continue; // Skip to the next number.
            }

            // The distance of a good tuple (i, j, k) is abs(i - j) + abs(j - k) + abs(k - i).
            // It can be proven that for any three indices x, y, z, the distance is 2 * (max(x, y, z) - min(x, y, z)).
            // To minimize this distance, we want to minimize (max_index - min_index).
            // This minimum will occur for adjacent triplets in the sorted list of indices for a number.
            // Consider indices p_{j-1}, p_j, p_{j+1} from the sorted list.
            // The distance for the triplet (p_{j-1}, p_j, p_{j+1}) is 2 * (p_{j+1} - p_{j-1}).
            // We iterate through all possible middle elements p_j.
            // j runs from 1 up to size - 2, ensuring we always have a previous (j-1) and a next (j+1) index.
            for (int j = 1; j < indices.size() - 1; j++) {
                // Get the indices for the current triplet:
                // p_{j-1} (previous index), p_j (current middle index), p_{j+1} (next index).
                int prevIndex = indices.get(j - 1);
                int currentIndex = indices.get(j); // This is the middle element used for iteration.
                int nextIndex = indices.get(j + 1);

                // Calculate the distance for this triplet.
                // The triplet is (prevIndex, currentIndex, nextIndex).
                // min_index = prevIndex, max_index = nextIndex.
                // Distance = 2 * (nextIndex - prevIndex).
                int currentDistance = 2 * (nextIndex - prevIndex);

                // Update the overall minimum distance found so far.
                minDistance = Math.min(minDistance, currentDistance);
            }
        }

        // If minDistance is still its initial large value, it means no good tuples were found.
        // In this case, return -1 as per the problem statement.
        // Otherwise, return the calculated minimum distance.
        return (minDistance == Integer.MAX_VALUE) ? -1 : minDistance;
    }
}
```