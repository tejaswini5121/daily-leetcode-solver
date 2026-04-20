```java
/**
 * Problem Summary: Find the maximum distance between two houses with different colors.
 * Problem Link: https://leetcode.com/problems/two-furthest-houses-with-different-colors/
 *
 * Approach:
 * The problem asks for the maximum distance between any two houses that have different colors.
 * The distance is simply the absolute difference of their indices.
 *
 * Since we want to maximize the distance, we should consider pairs of houses that are as far apart as possible.
 * The furthest possible pairs of houses are:
 * 1. The first house (index 0) and any other house.
 * 2. The last house (index n-1) and any other house.
 *
 * We can iterate through the houses from the beginning to find the first house whose color is different
 * from the first house (index 0). The distance to this house will be a candidate for the maximum distance.
 * Similarly, we can iterate through the houses from the end to find the first house whose color is different
 * from the last house (index n-1). The distance to this house will also be a candidate.
 *
 * The maximum of these two distances will be the overall maximum distance between two houses with different colors.
 *
 * Example 1: colors = [1,1,1,6,1,1,1]
 * - Compare house 0 (color 1) with houses from the right:
 *   - House 6 (color 1) - same
 *   - House 5 (color 1) - same
 *   - House 4 (color 1) - same
 *   - House 3 (color 6) - different. Distance = abs(0 - 3) = 3. This is a candidate.
 * - Compare house 6 (color 1) with houses from the left:
 *   - House 0 (color 1) - same
 *   - House 1 (color 1) - same
 *   - House 2 (color 1) - same
 *   - House 3 (color 6) - different. Distance = abs(6 - 3) = 3. This is a candidate.
 * The maximum distance is 3.
 *
 * Time Complexity: O(n)
 * We iterate through the array at most twice (once from the beginning, once from the end).
 *
 * Space Complexity: O(1)
 * We only use a few variables to store indices and distances, so the space used is constant.
 */
class Solution {
    /**
     * Calculates the maximum distance between two houses with different colors.
     * @param colors An array representing the colors of the houses.
     * @return The maximum distance between two houses with different colors.
     */
    public int maxDistance(int[] colors) {
        int n = colors.length;
        int maxDist = 0;

        // Strategy 1: Compare the first house (index 0) with all other houses.
        // We only need to find the furthest house from the start that has a different color.
        // Iterate from the end towards the beginning to find the first house with a different color.
        for (int i = n - 1; i > 0; i--) {
            if (colors[i] != colors[0]) {
                // The distance between house 0 and house i is i.
                maxDist = Math.max(maxDist, i);
                // Once we find one, this is the furthest from the start, so we can break.
                break;
            }
        }

        // Strategy 2: Compare the last house (index n-1) with all other houses.
        // We only need to find the furthest house from the end that has a different color.
        // Iterate from the beginning towards the end to find the first house with a different color.
        for (int i = 0; i < n - 1; i++) {
            if (colors[i] != colors[n - 1]) {
                // The distance between house n-1 and house i is (n-1) - i.
                maxDist = Math.max(maxDist, (n - 1) - i);
                // Once we find one, this is the furthest from the end, so we can break.
                break;
            }
        }

        // The maximum of the distances found by comparing the first house with others
        // and comparing the last house with others will be the overall maximum distance.
        return maxDist;
    }
}
```