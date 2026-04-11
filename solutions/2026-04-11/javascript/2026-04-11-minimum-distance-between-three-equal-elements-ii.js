// Problem Summary: Find the minimum distance between three distinct indices that have the same value in an array.
// Link: https://leetcode.com/problems/minimum-distance-between-three-equal-elements-ii/
// Approach:
// 1. Use a hash map (or a Map in JavaScript) to store the indices for each unique number. The key will be the number, and the value will be an array of indices where that number appears.
// 2. Iterate through the input array `nums`. For each element `nums[i]` at index `i`:
//    a. If `nums[i]` is already a key in the map, append `i` to its corresponding array of indices.
//    b. If `nums[i]` is not in the map, create a new entry with `nums[i]` as the key and `[i]` as the value.
// 3. Initialize `minDistance` to infinity.
// 4. Iterate through the values (arrays of indices) in the hash map.
// 5. For each array of indices `indices` associated with a number:
//    a. If the length of `indices` is less than 3, skip this number as it cannot form a good tuple.
//    b. If the length is 3 or more, we need to find the minimum distance between any three indices from this list.
//       The distance formula is `abs(i - j) + abs(j - k) + abs(k - i)`.
//       Let the three indices be `a`, `b`, and `c` in increasing order (`a < b < c`). The distance is `(b - a) + (c - b) + (c - a) = 2 * (c - a)`.
//       This means to minimize the distance, we need to minimize the difference between the smallest and largest index among any three.
//       However, the problem states "minimum distance between THREE equal elements". The distance definition `abs(i - j) + abs(j - k) + abs(k - i)` can be simplified if we consider the order of indices. If `i < j < k`, then distance is `(j-i) + (k-j) + (k-i) = 2(k-i)`. This implies that for a fixed set of three indices, the minimum distance is achieved when they are ordered, and it's twice the difference between the largest and smallest index.
//       The problem statement is a bit tricky. "The distance of a good tuple is abs(i - j) + abs(j - k) + abs(k - i)". This distance formula is invariant to the order of i, j, k.
//       Consider three indices `i1, i2, i3`. The distance is `|i1 - i2| + |i2 - i3| + |i3 - i1|`.
//       Let's sort these indices: `a <= b <= c`. The distance is `(b-a) + (c-b) + (c-a) = 2(c-a)`.
//       So, for a set of indices `[idx1, idx2, idx3, ...]`, we need to find three indices `i, j, k` such that `nums[i] == nums[j] == nums[k]` and `abs(i - j) + abs(j - k) + abs(k - i)` is minimized.
//       If we have indices `i1 < i2 < i3 < ... < iN` for a given number.
//       We need to find `i_p, i_q, i_r` from this list such that `abs(i_p - i_q) + abs(i_q - i_r) + abs(i_r - i_p)` is minimized.
//       If we pick any three indices `a, b, c` from the sorted list `indices`, let `a < b < c`. The distance is `2 * (c - a)`.
//       So, for a list of indices `[i_1, i_2, ..., i_N]` where `i_1 < i_2 < ... < i_N`, to minimize `2 * (i_k - i_j)` for any distinct `j, k` from `1` to `N`, we need to pick `j` and `k` such that `i_k - i_j` is minimized. This happens when `k = j + 1`.
//       So, for a sorted list of indices `[i_1, i_2, i_3, ..., i_N]`, we iterate through all adjacent triplets `(i_j, i_{j+1}, i_{j+2})`. The distance for such a triplet `(a, b, c)` where `a < b < c` is `2 * (c - a)`.
//       We are looking for the minimum distance between ANY three equal elements. This implies we need to consider ALL possible combinations of three distinct indices `i, j, k` from the list `indices` for a given number.
//       The crucial observation is that `abs(i-j) + abs(j-k) + abs(k-i)` is minimized when `i, j, k` are as close as possible. If we have indices `p < q < r`, the distance is `(q-p) + (r-q) + (r-p) = 2(r-p)`. This is NOT necessarily minimal.
//       Let's re-evaluate the distance formula. `abs(i - j) + abs(j - k) + abs(k - i)`.
//       Consider three indices `idx1, idx2, idx3`. Let `min_idx = min(idx1, idx2, idx3)` and `max_idx = max(idx1, idx2, idx3)`.
//       The sum of pairwise absolute differences is `|idx1 - idx2| + |idx2 - idx3| + |idx3 - idx1|`.
//       Let's consider the sorted order `a <= b <= c`. The distance is `(b-a) + (c-b) + (c-a) = 2(c-a)`.
//       This formula `2(c-a)` is correct if `a, b, c` are the only three indices.
//       However, the problem implies that the set of indices for a number could be `[1, 5, 10, 15]`.
//       If we pick `(1, 5, 10)`, distance is `|1-5| + |5-10| + |10-1| = 4 + 5 + 9 = 18`.
//       If we pick `(1, 5, 15)`, distance is `|1-5| + |5-15| + |15-1| = 4 + 10 + 14 = 28`.
//       If we pick `(1, 10, 15)`, distance is `|1-10| + |10-15| + |15-1| = 9 + 5 + 14 = 28`.
//       If we pick `(5, 10, 15)`, distance is `|5-10| + |10-15| + |15-5| = 5 + 5 + 10 = 20`.
//       The minimum distance for `[1, 5, 10, 15]` is 18 using `(1, 5, 10)`.
//       The key insight is that for a set of indices `S` for a number, we need to find three indices `i, j, k` from `S` that minimize `abs(i-j) + abs(j-k) + abs(k-i)`.
//       Let `i, j, k` be any three distinct indices from the sorted list `indices = [idx_1, idx_2, ..., idx_N]` where `idx_1 < idx_2 < ... < idx_N`.
//       The sum `abs(i-j) + abs(j-k) + abs(k-i)` is minimized when the three chosen indices are "close" to each other.
//       Consider any three indices `a, b, c` from the list `indices`.
//       If we fix one index, say `i`, and want to find `j` and `k` such that `abs(i-j) + abs(j-k) + abs(k-i)` is minimized.
//       Let `i` be an index. We need to find two other indices `j` and `k` from `indices` to minimize `abs(i-j) + abs(j-k) + abs(k-i)`.
//       Let's consider a sliding window approach on the sorted `indices` array.
//       For each index `i` in `indices`, we need to find two other indices `j` and `k` from `indices` that are closest to `i` to minimize the sum of absolute differences.
//       The problem states "minimum distance between three equal elements". This means we pick three distinct indices from the list of indices for a given number.
//       Let the sorted indices for a number be `i_1 < i_2 < i_3 < ... < i_N`.
//       We need to find `i_p, i_q, i_r` (distinct `p, q, r`) such that `abs(i_p - i_q) + abs(i_q - i_r) + abs(i_r - i_p)` is minimized.
//       Let the three selected indices be `a < b < c`. The distance is `(b-a) + (c-b) + (c-a) = 2(c-a)`. This assumes `a, b, c` are the only indices.
//       This interpretation `2(c-a)` is likely WRONG. The sum of absolute differences can be thought of as the perimeter of a triangle with vertices at `i, j, k` on a number line.
//       Consider the indices `a, b, c`. If `a < b < c`, the distance is `(b-a) + (c-b) + (c-a) = 2(c-a)`.
//       If we consider indices `i, j, k` and sort them as `a <= b <= c`, the sum `abs(i-j) + abs(j-k) + abs(k-i)` simplifies to `2 * (max(i,j,k) - min(i,j,k))`.
//       So, for a given number, we need to find three indices `i, j, k` from its list of indices such that `max(i, j, k) - min(i, j, k)` is minimized.
//       This means we need to find the smallest range that contains at least three indices.
//       So, for each number, if it appears at least 3 times, we iterate through its sorted list of indices.
//       For each index `indices[p]`, we look for two other indices `indices[q]` and `indices[r]` that are closest to `indices[p]` to minimize `abs(indices[p] - indices[q]) + abs(indices[p] - indices[r]) + abs(indices[q] - indices[r])`.
//       Let the sorted indices be `idx_1 < idx_2 < ... < idx_N`.
//       We are looking for `idx_p, idx_q, idx_r` to minimize `abs(idx_p - idx_q) + abs(idx_q - idx_r) + abs(idx_r - idx_p)`.
//       This sum is equal to `2 * (max(idx_p, idx_q, idx_r) - min(idx_p, idx_q, idx_r))`.
//       So, for a list of indices `[i_1, i_2, ..., i_N]`, we need to find `i_p, i_q, i_r` such that `i_k - i_j` is minimized where `i_k` is the largest and `i_j` is the smallest among `i_p, i_q, i_r`.
//       This means we need to find the minimum difference between any two indices, such that there's at least one index between them.
//       This is equivalent to finding three indices `a < b < c` such that `c - a` is minimized.
//       So, for each number, if it appears at least 3 times:
//       Iterate through its sorted list of indices `[i_1, i_2, ..., i_N]`.
//       For each `i_j`, consider `i_{j+1}` and `i_{j+2}`. The distance would be `2 * (i_{j+2} - i_j)`.
//       This approach seems to be correct based on the property `abs(x-y) + abs(y-z) + abs(z-x) = 2 * (max(x,y,z) - min(x,y,z))`.
//       To minimize `2 * (max - min)`, we need to minimize `max - min`.
//       For a list of indices `[i_1, i_2, ..., i_N]`, we want to pick three indices `i_p, i_q, i_r` such that `max(i_p, i_q, i_r) - min(i_p, i_q, i_r)` is minimized.
//       This happens when we pick three CONSECUTIVE indices from the sorted list.
//       Let the sorted indices be `idx_1 < idx_2 < idx_3 < ... < idx_N`.
//       We want to find `p < q < r` that minimize `idx_r - idx_p`.
//       This minimum difference will occur between adjacent elements.
//       Consider the triplet `(idx_j, idx_{j+1}, idx_{j+2})`. The distance is `2 * (idx_{j+2} - idx_j)`.
//       We need to iterate through all `j` from `0` to `N-3`.
//       So, for each number, iterate through its sorted list of indices. For every `k` from `0` to `indices.length - 3`, calculate the distance `2 * (indices[k+2] - indices[k])` and update `minDistance`.
//
// Time Complexity:
// - Building the hash map: O(N), where N is the length of `nums`. We iterate through the array once.
// - Iterating through the hash map: In the worst case, all elements are distinct, and the map has N entries. If all elements are the same, the map has 1 entry with N indices.
// - For each number, if it appears `M` times, sorting its indices takes O(M log M). However, since we store them in order as we iterate through `nums`, they are already sorted. So, no explicit sort is needed if we process indices as they are encountered.
// - Processing each list of indices: For a number appearing `M` times, we iterate `M-2` times to calculate distances.
// - The total number of index entries across all lists is N.
// - If a number appears `M` times, we do `M-2` calculations. The sum of `M` over all distinct numbers is `N`.
// - The total number of distance calculations is `sum(M_i - 2)` for all numbers `i` that appear at least 3 times, where `M_i` is the count of number `i`. This sum is at most `N`.
// - Overall time complexity: O(N) because building the map is O(N), and processing the indices takes a total of O(N) operations across all numbers.
//
// Space Complexity:
// - The hash map stores at most N indices in total across all its values. So, the space complexity is O(N).
//
//
// Example 1 walkthrough:
// nums = [1,2,1,1,3]
// map = {
//   1: [0, 2, 3],
//   2: [1],
//   3: [4]
// }
//
// Process number 1: indices = [0, 2, 3]
// Length is 3.
// We need to find three indices. The only triplet is (0, 2, 3).
// min_idx = 0, max_idx = 3.
// Distance = abs(0-2) + abs(2-3) + abs(3-0) = 2 + 1 + 3 = 6.
// Or using the simplified formula: 2 * (max_idx - min_idx) = 2 * (3 - 0) = 6.
// minDistance = 6.
//
// Process number 2: indices = [1]. Length < 3. Skip.
// Process number 3: indices = [4]. Length < 3. Skip.
//
// Return minDistance = 6.
//
// Example 2 walkthrough:
// nums = [1,1,2,3,2,1,2]
// map = {
//   1: [0, 1, 5],
//   2: [2, 4, 6],
//   3: [3]
// }
//
// Process number 1: indices = [0, 1, 5]
// Length is 3. Triplet is (0, 1, 5).
// min_idx = 0, max_idx = 5.
// Distance = 2 * (5 - 0) = 10.
// minDistance = 10.
//
// Process number 2: indices = [2, 4, 6]
// Length is 3. Triplet is (2, 4, 6).
// min_idx = 2, max_idx = 6.
// Distance = 2 * (6 - 2) = 2 * 4 = 8.
// minDistance = min(10, 8) = 8.
//
// Process number 3: indices = [3]. Length < 3. Skip.
//
// Return minDistance = 8.
//
// The logic of `2 * (max_idx - min_idx)` for a triplet `a < b < c` is indeed `(b-a) + (c-b) + (c-a) = 2(c-a)`.
// So, for each number that appears at least 3 times, we iterate through its sorted list of indices `[i_1, i_2, ..., i_N]`.
// We consider all triplets `(i_j, i_k, i_l)` where `j < k < l`.
// The distance is `2 * (i_l - i_j)`. To minimize this, we need to minimize `i_l - i_j`.
// This minimum `i_l - i_j` will occur when `l` and `j` are as close as possible, meaning `l = j + 2`.
// So we only need to check adjacent triplets in the sorted index list.
// For each number, iterate from `p = 0` to `indices.length - 3`. Calculate `2 * (indices[p+2] - indices[p])`.
//

/**
 * @param {number[]} nums
 * @return {number}
 */
var minDistanceBetweenThreeEqualElements = function(nums) {
    // Use a Map to store the indices for each number.
    // Key: number from nums
    // Value: array of indices where the number appears
    const indexMap = new Map();

    // Populate the map with indices for each number.
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        if (!indexMap.has(num)) {
            indexMap.set(num, []);
        }
        indexMap.get(num).push(i);
    }

    // Initialize minimum distance to infinity.
    let minDistance = Infinity;

    // Iterate through each number and its list of indices in the map.
    for (const indices of indexMap.values()) {
        // A good tuple requires at least 3 occurrences of a number.
        if (indices.length >= 3) {
            // The distance of a good tuple (i, j, k) is abs(i - j) + abs(j - k) + abs(k - i).
            // If we sort these indices as a <= b <= c, the distance simplifies to (b-a) + (c-b) + (c-a) = 2 * (c - a).
            // To minimize this distance, we need to find three indices a, b, c such that the difference between the largest (c) and smallest (a) is minimized.
            // This minimum difference will occur between three indices that are close to each other in the sorted list.
            // Specifically, we only need to check triplets of consecutive indices in the sorted `indices` array.
            // For indices i_p < i_q < i_r, the distance is 2 * (i_r - i_p).
            // We iterate through all possible starting points `p` for such triplets.
            for (let p = 0; p <= indices.length - 3; p++) {
                // The three indices are indices[p], indices[p+1], indices[p+2].
                // The minimum index is indices[p].
                // The maximum index is indices[p+2].
                const currentDistance = 2 * (indices[p + 2] - indices[p]);
                minDistance = Math.min(minDistance, currentDistance);
            }
        }
    }

    // If minDistance is still Infinity, it means no good tuples were found.
    // Otherwise, return the minimum distance found.
    return minDistance === Infinity ? -1 : minDistance;
};
