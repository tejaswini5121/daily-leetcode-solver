```java
import java.util.Arrays;
import java.util.Collections;

class Solution {
    /**
     * Problem: Minimum Cost of Buying Candies With Discount
     * Link: https://leetcode.com/problems/minimum-cost-of-buying-candies-with-discount/
     *
     * Approach:
     * To minimize the total cost, we should always aim to get the most expensive candies for free.
     * The rule is that for every two candies bought, the cheapest among the remaining candies can be taken for free.
     * Therefore, to maximize the value of free candies, we should sort the candy costs in descending order.
     * Then, we iterate through the sorted costs. For every three candies, we buy the two most expensive ones
     * and get the third (cheapest of the three) for free.
     *
     * Time Complexity:
     * O(N log N) due to sorting the array, where N is the number of candies.
     * The subsequent iteration is O(N).
     *
     * Space Complexity:
     * O(1) if sorting is done in-place. If a copy is made for sorting, it would be O(N).
     * Java's Arrays.sort for primitives is typically O(log N) to O(N) space depending on implementation.
     * For Integer objects, it uses Timsort which is O(N) space.
     */
    public int minimumCost(int[] cost) {
        // Sort the costs in descending order.
        // We box ints to Integers to use Collections.reverseOrder()
        Integer[] costsBoxed = new Integer[cost.length];
        for (int i = 0; i < cost.length; i++) {
            costsBoxed[i] = cost[i];
        }
        Arrays.sort(costsBoxed, Collections.reverseOrder());

        int totalCost = 0;
        int n = costsBoxed.length;

        // Iterate through the sorted costs.
        // For every three candies, we buy the two most expensive and get the third for free.
        // This means we iterate with a step of 3.
        for (int i = 0; i < n; i++) {
            // The first and second candies in each group of three are bought.
            // The third candy (at index i + 2) will be free.
            // We only add the cost if 'i' is not the index of a free candy.
            // Free candies are at indices 2, 5, 8, ... (i.e., i % 3 == 2)
            if (i % 3 != 2) {
                totalCost += costsBoxed[i];
            }
        }

        return totalCost;
    }
}
```