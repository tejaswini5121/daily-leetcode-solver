```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Problem: Minimum Distance Between Three Equal Elements I
 * Link: https://leetcode.com/problems/minimum-distance-between-three-equal-elements-i/
 *
 * Approach:
 * The problem asks for the minimum distance between three distinct indices i, j, and k such that nums[i] == nums[j] == nums[k].
 * The distance is defined as abs(i - j) + abs(j - k) + abs(k - i).
 *
 * We can iterate through the array and store the indices for each unique number. A HashMap can be used where the key is the number
 * and the value is a list of indices where that number appears.
 *
 * After populating the HashMap, we iterate through each number in the HashMap. If a number appears at least three times (i.e., its list of indices has a size >= 3),
 * we then iterate through all possible combinations of three distinct indices from its list. For each combination, we calculate the distance and update the minimum distance found so far.
 *
 * The distance formula abs(i - j) + abs(j - k) + abs(k - i) can be simplified. Let's assume i < j < k without loss of generality for a moment.
 * Then the distance is (j - i) + (k - j) + (k - i) = 2k - 2i.
 * However, the indices are not necessarily ordered. The expression abs(i - j) + abs(j - k) + abs(k - i) represents the sum of pairwise distances between three points on a line.
 * This sum is minimized when the three points are clustered as close as possible.
 * For any three indices i, j, k, if we sort them as a <= b <= c, the distance is (b - a) + (c - b) + (c - a) = 2(c - a).
 * This means the distance is twice the difference between the maximum and minimum index.
 *
 * So, for each number that appears at least 3 times, we find the minimum and maximum index among its occurrences and calculate 2 * (max_index - min_index).
 * This is because if we pick the minimum index `min_idx` and the maximum index `max_idx` along with any other index `mid_idx` between them, the distance will be:
 * abs(min_idx - mid_idx) + abs(mid_idx - max_idx) + abs(max_idx - min_idx).
 * Since min_idx <= mid_idx <= max_idx, this simplifies to (mid_idx - min_idx) + (max_idx - mid_idx) + (max_idx - min_idx) = 2 * (max_idx - min_idx).
 * To minimize this, we need to find the three indices that are closest together.
 *
 * Upon re-reading the problem and the distance formula, the sum is indeed abs(i - j) + abs(j - k) + abs(k - i).
 * The simplified formula 2 * (max - min) is only true if the middle index is *between* the min and max.
 * For example, if indices are 0, 5, 10, then distance is abs(0-5) + abs(5-10) + abs(10-0) = 5 + 5 + 10 = 20. And 2*(10-0) = 20.
 * If indices are 0, 1, 10, then distance is abs(0-1) + abs(1-10) + abs(10-0) = 1 + 9 + 10 = 20. And 2*(10-0) = 20.
 *
 * The crucial insight is that for any three indices `idx1`, `idx2`, `idx3`, the expression `abs(idx1 - idx2) + abs(idx2 - idx3) + abs(idx3 - idx1)` is always equal to `2 * (max(idx1, idx2, idx3) - min(idx1, idx2, idx3))`.
 * Proof: Let `a <= b <= c` be the sorted indices.
 * `abs(a - b) + abs(b - c) + abs(c - a) = (b - a) + (c - b) + (c - a)` (since `b-a >= 0`, `c-b >= 0`, `c-a >= 0`)
 * `= b - a + c - b + c - a`
 * `= 2c - 2a`
 * `= 2 * (c - a)`
 * Since `c` is the maximum and `a` is the minimum, this is `2 * (max(idx1, idx2, idx3) - min(idx1, idx2, idx3))`.
 *
 * Therefore, to minimize the distance, we need to find three occurrences of the same number whose minimum and maximum indices are as close as possible.
 *
 * So, for each number, if it appears at least 3 times, we iterate through all combinations of three indices.
 *
 * Example 1: nums = [1,2,1,1,3]
 * Map: {1: [0, 2, 3], 2: [1], 3: [4]}
 * For '1': indices [0, 2, 3].
 *   Combinations of 3 indices: (0, 2, 3).
 *   Distance = abs(0 - 2) + abs(2 - 3) + abs(3 - 0) = 2 + 1 + 3 = 6.
 *   Min distance = 6.
 *
 * Example 2: nums = [1,1,2,3,2,1,2]
 * Map: {1: [0, 1, 5], 2: [2, 4, 6], 3: [3]}
 * For '1': indices [0, 1, 5].
 *   Combination (0, 1, 5): abs(0 - 1) + abs(1 - 5) + abs(5 - 0) = 1 + 4 + 5 = 10.
 * For '2': indices [2, 4, 6].
 *   Combination (2, 4, 6): abs(2 - 4) + abs(4 - 6) + abs(6 - 2) = 2 + 2 + 4 = 8.
 * Min distance = 8.
 *
 * Initialize min_distance to infinity (or a very large number).
 * If no good tuple is found, return -1.
 *
 * Time Complexity:
 * Building the HashMap: O(N), where N is the length of nums.
 * Iterating through the HashMap: At most N distinct numbers.
 * For each number, if it appears M times, we iterate through combinations of 3 indices, which is O(M^3).
 * In the worst case, all elements are the same, so M = N. This would be O(N^3).
 * However, the constraints state N <= 100. So N^3 is acceptable (100^3 = 1,000,000).
 *
 * Space Complexity:
 * O(N) for the HashMap in the worst case, where all elements are distinct and stored with their indices.
 */
class Solution {
    public int minimumDistance(int[] nums) {
        // Use a HashMap to store indices for each number.
        // Key: the number from nums.
        // Value: a List of indices where this number appears.
        Map<Integer, List<Integer>> numIndices = new HashMap<>();

        // Populate the HashMap by iterating through the input array.
        for (int i = 0; i < nums.length; i++) {
            // Get the list of indices for the current number, or create a new list if it doesn't exist.
            numIndices.computeIfAbsent(nums[i], k -> new ArrayList<>()).add(i);
        }

        // Initialize the minimum distance to a very large value.
        // This will be updated as we find good tuples.
        int minDistance = Integer.MAX_VALUE;

        // Iterate through each number and its list of indices stored in the HashMap.
        for (Map.Entry<Integer, List<Integer>> entry : numIndices.entrySet()) {
            List<Integer> indices = entry.getValue();

            // A "good tuple" requires at least three distinct indices.
            // If a number appears less than 3 times, it cannot form a good tuple.
            if (indices.size() >= 3) {
                // Iterate through all unique combinations of three indices from the list.
                // We use three nested loops for this. The indices i, j, and k must be distinct.
                // By ensuring i < j < k, we guarantee distinctness and avoid redundant combinations.
                for (int i = 0; i < indices.size(); i++) {
                    for (int j = i + 1; j < indices.size(); j++) {
                        for (int k = j + 1; k < indices.size(); k++) {
                            // Get the actual indices from the list.
                            int index1 = indices.get(i);
                            int index2 = indices.get(j);
                            int index3 = indices.get(k);

                            // Calculate the distance for the current good tuple (index1, index2, index3).
                            // The distance is the sum of absolute differences between each pair of indices.
                            int currentDistance = Math.abs(index1 - index2) + Math.abs(index2 - index3) + Math.abs(index3 - index1);

                            // Update the minimum distance found so far.
                            minDistance = Math.min(minDistance, currentDistance);
                        }
                    }
                }
            }
        }

        // If minDistance is still Integer.MAX_VALUE, it means no good tuples were found.
        // In this case, return -1 as per the problem statement.
        // Otherwise, return the calculated minimum distance.
        return (minDistance == Integer.MAX_VALUE) ? -1 : minDistance;
    }
}
```