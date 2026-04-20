/**
 * @param {number[]} colors
 * @return {number}
 */

// Problem: Two Furthest Houses With Different Colors
// Link: https://leetcode.com/problems/two-furthest-houses-with-different-colors/
// Approach:
// The problem asks for the maximum distance between two houses with different colors.
// The distance is defined as the absolute difference of their indices.
// Since we want the maximum distance, we should consider houses at the extremities of the array.
//
// Let's analyze the potential pairs that could yield the maximum distance:
// 1. The first house (index 0) and the furthest house from it that has a different color.
// 2. The last house (index n-1) and the furthest house from it that has a different color.
//
// We can iterate from the beginning of the array to find the first house that has a different color
// than the first house (colors[0]). Let's say this house is at index `i`. The distance is `i - 0 = i`.
//
// Similarly, we can iterate from the end of the array backwards to find the first house (from the end)
// that has a different color than the last house (colors[n-1]). Let's say this house is at index `j`.
// The distance is `(n-1) - j`.
//
// The maximum distance will be the greater of these two calculated distances.
//
// Example: colors = [1,1,1,6,1,1,1] (n=7)
// - Consider house 0 (color 1):
//   - Iterate from start:
//     - colors[1] = 1 (same)
//     - colors[2] = 1 (same)
//     - colors[3] = 6 (different). Distance = 3 - 0 = 3. Max distance so far = 3.
// - Consider house 6 (color 1):
//   - Iterate from end:
//     - colors[5] = 1 (same)
//     - colors[4] = 1 (same)
//     - colors[3] = 6 (different). Distance = 6 - 3 = 3. Max distance so far = max(3, 3) = 3.
//
// Example: colors = [1,8,3,8,3] (n=5)
// - Consider house 0 (color 1):
//   - Iterate from start:
//     - colors[1] = 8 (different). Distance = 1 - 0 = 1. Max distance so far = 1.
// - Consider house 4 (color 3):
//   - Iterate from end:
//     - colors[3] = 8 (different). Distance = 4 - 3 = 1. Max distance so far = max(1, 1) = 1.
//
// Wait, the logic above is not fully correct. We need to find the furthest house with *any* different color.
// The approach should be:
// Find the maximum distance from the first house to any house with a different color.
// Find the maximum distance from the last house to any house with a different color.
// The maximum of these two will be the answer.
//
// Revised Approach:
// 1. Find the first house from the left (index `i`) such that `colors[i]` is different from `colors[0]`.
//    The distance is `i - 0 = i`.
// 2. Find the first house from the right (index `j`) such that `colors[j]` is different from `colors[n-1]`.
//    The distance is `(n-1) - j`.
// 3. The answer is `max(i, (n-1) - j)`.
//
// Let's re-trace with the revised approach:
// Example: colors = [1,1,1,6,1,1,1] (n=7)
// - House 0 color is 1.
//   - Iterate from left to find a different color:
//     - colors[0] = 1 (same)
//     - colors[1] = 1 (same)
//     - colors[2] = 1 (same)
//     - colors[3] = 6 (different). Found at index 3. Distance = 3 - 0 = 3.
// - House 6 color is 1.
//   - Iterate from right to find a different color:
//     - colors[6] = 1 (same)
//     - colors[5] = 1 (same)
//     - colors[4] = 1 (same)
//     - colors[3] = 6 (different). Found at index 3. Distance = 6 - 3 = 3.
// - Maximum distance = max(3, 3) = 3. Correct for Example 1.
//
// Example: colors = [1,8,3,8,3] (n=5)
// - House 0 color is 1.
//   - Iterate from left to find a different color:
//     - colors[0] = 1 (same)
//     - colors[1] = 8 (different). Found at index 1. Distance = 1 - 0 = 1.
// - House 4 color is 3.
//   - Iterate from right to find a different color:
//     - colors[4] = 3 (same)
//     - colors[3] = 8 (different). Found at index 3. Distance = 4 - 3 = 1.
// - Maximum distance = max(1, 1) = 1. This is INCORRECT for Example 2.
//
// The issue is that we are only comparing against the *first* and *last* houses.
// We need to find the furthest distance between *any two* houses of different colors.
// The problem states "Return the maximum distance between two houses with different colors."
//
// This means we need to consider all pairs? No, that would be O(n^2).
// The constraint n <= 100 suggests O(n) or O(n log n) might be acceptable.
//
// Let's rethink the greedy approach.
// The maximum distance must involve at least one of the endpoints if the colors are different.
// Why? Suppose the two furthest houses with different colors are at indices `i` and `j`, where `0 < i < j < n-1`.
// If `colors[i] != colors[j]`.
// Consider house at index 0.
// Case 1: `colors[0] == colors[i]`. Then `colors[0] != colors[j]`. The distance between house 0 and house `j` is `j`. Since `j > i`, and `colors[0]` is different from `colors[j]`, the distance `j` is greater than `i` and potentially greater than `j-i`.
// Case 2: `colors[0] != colors[i]`. The distance between house 0 and house `i` is `i`.
//
// Let's simplify.
// The maximum distance will be between one of the endpoints and the furthest house with a different color.
//
// Consider the first house (index 0). What is the furthest house with a different color from `colors[0]`?
// We can scan from the right end of the array backwards. The first house we find with a color different from `colors[0]` will give us the maximum distance from house 0.
// Let `n` be the length of `colors`.
// Find the largest `k` such that `colors[k] != colors[0]`. The distance is `k - 0 = k`.
//
// Consider the last house (index `n-1`). What is the furthest house with a different color from `colors[n-1]`?
// We can scan from the left end of the array forwards. The first house we find with a color different from `colors[n-1]` will give us the maximum distance from house `n-1`.
// Find the smallest `k` such that `colors[k] != colors[n-1]`. The distance is `(n-1) - k`.
//
// The maximum distance will be `max(k_from_left, (n-1) - k_from_right)`.
//
// Let's re-trace Example 2 again with this interpretation.
// Example: colors = [1,8,3,8,3] (n=5)
// - Target color for left scan: `colors[0] = 1`.
//   - Scan from right (index `n-1=4`):
//     - `colors[4] = 3`. `3 != 1`. Found at index 4. Distance = 4 - 0 = 4.
// - Target color for right scan: `colors[n-1] = colors[4] = 3`.
//   - Scan from left (index `0`):
//     - `colors[0] = 1`. `1 != 3`. Found at index 0. Distance = (5-1) - 0 = 4.
// - Maximum distance = max(4, 4) = 4. Correct for Example 2.
//
// Example: colors = [0,1] (n=2)
// - Target color for left scan: `colors[0] = 0`.
//   - Scan from right (index `n-1=1`):
//     - `colors[1] = 1`. `1 != 0`. Found at index 1. Distance = 1 - 0 = 1.
// - Target color for right scan: `colors[n-1] = colors[1] = 1`.
//   - Scan from left (index `0`):
//     - `colors[0] = 0`. `0 != 1`. Found at index 0. Distance = (2-1) - 0 = 1.
// - Maximum distance = max(1, 1) = 1. Correct for Example 3.
//
// This revised greedy strategy seems to cover all cases and aligns with the problem statement's goal of maximizing distance.
//
// Time Complexity:
// We iterate from the left end once and from the right end once. Each iteration takes O(n) time in the worst case.
// Therefore, the total time complexity is O(n) + O(n) = O(n).
//
// Space Complexity:
// We are only using a few variables to store indices and the maximum distance. This is constant extra space.
// Therefore, the space complexity is O(1).

var maxDistance = function(colors) {
    // Get the total number of houses.
    const n = colors.length;

    // Initialize maxDistance to 0.
    let maxDist = 0;

    // --- First Pass: Find the furthest house from the left end with a different color ---
    // The color of the first house.
    const firstHouseColor = colors[0];
    // Iterate from the second house (index 1) to the end.
    for (let i = 1; i < n; i++) {
        // If we find a house with a different color than the first house...
        if (colors[i] !== firstHouseColor) {
            // Calculate the distance from the first house (index 0) to this house (index i).
            // The distance is simply i, as abs(i - 0) = i.
            // Update maxDist if this distance is greater.
            maxDist = Math.max(maxDist, i);
            // Since we are iterating from the left, the first different color we find
            // will give us the maximum possible distance from the first house.
            // Therefore, we can break this loop.
            break;
        }
    }

    // --- Second Pass: Find the furthest house from the right end with a different color ---
    // The color of the last house.
    const lastHouseColor = colors[n - 1];
    // Iterate from the second-to-last house (index n-2) backwards to the beginning.
    for (let i = n - 2; i >= 0; i--) {
        // If we find a house with a different color than the last house...
        if (colors[i] !== lastHouseColor) {
            // Calculate the distance from this house (index i) to the last house (index n-1).
            // The distance is (n-1) - i, as abs((n-1) - i) = (n-1) - i.
            // Update maxDist if this distance is greater.
            maxDist = Math.max(maxDist, (n - 1) - i);
            // Since we are iterating from the right, the first different color we find
            // will give us the maximum possible distance from the last house.
            // Therefore, we can break this loop.
            break;
        }
    }

    // Return the maximum distance found.
    return maxDist;
};
```