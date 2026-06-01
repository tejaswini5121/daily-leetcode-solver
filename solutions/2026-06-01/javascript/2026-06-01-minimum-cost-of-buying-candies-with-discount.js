/**
 * @summary Calculates the minimum cost to buy all candies, given a "buy 2, get 1 free" discount.
 * @link https://leetcode.com/problems/minimum-cost-of-buying-candies-with-discount/
 *
 * @approach
 * The problem states that for every two candies bought, the customer gets a third candy for free,
 * provided the free candy's cost is less than or equal to the minimum cost of the two bought candies.
 * To minimize the total cost, we should always aim to get the most expensive candies for free.
 * This means we should sort the candies by cost in descending order.
 * Then, we iterate through the sorted costs. For every three candies, we buy the two most expensive ones
 * and take the cheapest one (which is the third one in the sorted list) for free.
 * We continue this process until all candies are accounted for.
 *
 * Example: cost = [6, 5, 7, 9, 2, 2]
 * Sorted descending: [9, 7, 6, 5, 2, 2]
 *
 * Iteration 1:
 * Buy 9 and 7. Take 6 for free (since 6 <= min(9, 7)). Total cost so far: 9 + 7 = 16.
 * Remaining: [5, 2, 2]
 *
 * Iteration 2:
 * Buy 5 and 2. Take the other 2 for free (since 2 <= min(5, 2)). Total cost so far: 16 + 5 + 2 = 23.
 * Remaining: []
 *
 * Total minimum cost: 23
 *
 * If the number of candies is not a multiple of 3, the remaining candies will be bought individually.
 *
 * @timeComplexity O(N log N) where N is the number of candies. This is dominated by the sorting step.
 * The iteration afterwards is O(N).
 * @spaceComplexity O(1) if we sort in-place, or O(N) if a new array is created for sorting (depending on the language's sort implementation).
 * JavaScript's sort might use extra space. For simplicity, we'll consider it O(N) worst case due to potential array copying during sort if not in-place.
 */

/**
 * @param {number[]} cost
 * @return {number}
 */
var minimumCost = function(cost) {
    // Sort the costs in descending order. This allows us to greedily pick the most expensive candies
    // and get the cheapest one among the three for free.
    cost.sort((a, b) => b - a);

    let totalCost = 0;
    // Iterate through the sorted costs. We process candies in groups of three.
    // For every two candies we buy, the third one (the cheapest in the group) can be taken for free.
    for (let i = 0; i < cost.length; i += 3) {
        // We buy the first two candies in the group of three (the most expensive ones).
        // The third candy (at index i+2) will be free if it exists and its cost is <= min of the two bought.
        // Since we sorted descending, the candy at `i` and `i+1` are the most expensive,
        // and the candy at `i+2` is the cheapest in this triplet.
        // The condition for taking the free candy is automatically met due to the sorting.
        
        // Add the cost of the first candy in the triplet (most expensive).
        totalCost += cost[i];
        
        // Add the cost of the second candy in the triplet (second most expensive).
        // We only do this if the second candy actually exists in the array.
        if (i + 1 < cost.length) {
            totalCost += cost[i + 1];
        }
        
        // The third candy (at index i+2) is implicitly taken for free because we only add
        // the costs of the first two candies in each triplet. If i+2 is out of bounds,
        // it means there are no more candies to consider for this triplet, and no free candy is taken.
    }

    return totalCost;
};
```