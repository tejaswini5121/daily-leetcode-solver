```java
/**
 * LeetCode problem: Maximum Ice Cream Bars
 * Problem Summary: Find the maximum number of ice cream bars that can be bought given their costs and a budget, using counting sort.
 * Problem Link: https://leetcode.com/problems/maximum-ice-cream-bars/
 *
 * Approach:
 * The problem asks us to maximize the number of ice cream bars bought. To do this, we should always prioritize buying the cheapest ice cream bars first.
 * This is a greedy approach.
 *
 * We are required to use counting sort. Counting sort is efficient for sorting elements within a known, limited range.
 * The constraints state that `costs[i]` is between 1 and 10^5. This range is suitable for counting sort.
 *
 * Steps:
 * 1. Determine the maximum possible cost of an ice cream bar to define the range for counting sort.
 * 2. Create a count array (or frequency map) to store the frequency of each ice cream bar cost.
 * 3. Iterate through the `costs` array and populate the count array. `count[c]` will store the number of ice cream bars with cost `c`.
 * 4. Iterate through the possible costs (from 1 up to the maximum cost).
 * 5. For each cost, check how many ice cream bars have that cost from the count array.
 * 6. If we can afford to buy all available ice cream bars of the current cost, buy them, decrease `coins` by the total cost, and increment the count of bought ice cream bars.
 * 7. If we can only afford some of the ice cream bars of the current cost, buy as many as possible with the remaining `coins`, update `coins` and the bought count, and stop since we cannot afford any more expensive bars.
 * 8. Return the total count of ice cream bars bought.
 *
 * Time Complexity:
 * - Finding the maximum cost: O(n), where n is the number of ice cream bars.
 * - Populating the count array: O(n).
 * - Iterating through costs and buying bars: O(max_cost), where max_cost is the maximum price of an ice cream bar (10^5).
 * - Overall time complexity is O(n + max_cost). Since max_cost is up to 10^5 and n is up to 10^5, this is effectively O(n) or O(max_cost), whichever is larger.
 *
 * Space Complexity:
 * - The count array requires O(max_cost) space to store frequencies of costs.
 * - Overall space complexity is O(max_cost).
 */
class Solution {
    public int maxIceCream(int[] costs, int coins) {
        // Find the maximum cost to determine the size of the count array.
        int maxCost = 0;
        for (int cost : costs) {
            if (cost > maxCost) {
                maxCost = cost;
            }
        }

        // Create a count array. `count[i]` will store the number of ice cream bars
        // with cost `i`. The size is maxCost + 1 because costs are 1-indexed.
        // Since costs are at most 10^5, we can directly use an array.
        int[] count = new int[maxCost + 1];

        // Populate the count array with frequencies of each cost.
        for (int cost : costs) {
            count[cost]++;
        }

        int iceCreamsBought = 0; // Initialize the count of ice cream bars bought.

        // Iterate through possible costs from the cheapest to the most expensive.
        for (int cost = 1; cost <= maxCost; cost++) {
            // If there are ice cream bars with the current cost:
            if (count[cost] > 0) {
                // Calculate the total cost if we buy all ice cream bars of this price.
                long totalCostForThisPrice = (long) cost * count[cost];

                // If we can afford all ice cream bars of the current cost:
                if (coins >= totalCostForThisPrice) {
                    coins -= totalCostForThisPrice;       // Deduct the cost from our coins.
                    iceCreamsBought += count[cost];      // Add all bars of this price to our count.
                } else {
                    // If we cannot afford all ice cream bars of the current cost,
                    // buy as many as we can with the remaining coins.
                    int affordableBars = coins / cost; // Number of bars we can afford.
                    iceCreamsBought += affordableBars; // Add the affordable bars to our count.
                    coins -= (long) affordableBars * cost; // Deduct the cost of affordable bars.
                    // Since we cannot afford any more bars of this price or more expensive ones,
                    // we can break the loop.
                    break;
                }
            }
        }

        return iceCreamsBought; // Return the total number of ice cream bars bought.
    }
}
```