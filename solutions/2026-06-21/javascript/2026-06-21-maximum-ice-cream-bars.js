// Summary: Find the maximum number of ice cream bars one can buy given their costs and a total budget.
// Link: https://leetcode.com/problems/maximum-ice-cream-bars/
// Approach:
// To maximize the number of ice cream bars, we should always buy the cheapest ones first.
// This problem explicitly requires the use of Counting Sort. Since the maximum cost of an ice cream bar is 10^5,
// we can use a counting array to efficiently count the occurrences of each price.
// After counting, we iterate through the possible prices from the lowest (1) to the highest.
// For each price, we check how many ice cream bars of that price are available.
// We greedily buy as many as possible at that price without exceeding the remaining budget.
// We keep track of the total number of ice cream bars bought.
//
// Time Complexity: O(N + M), where N is the number of ice cream bars (length of costs) and M is the maximum possible cost of an ice cream bar (10^5 in this case).
// The counting sort part takes O(N + M). Iterating through the possible prices takes O(M).
// The dominant factor will be M if M > N, or N if N > M. Given the constraints (N <= 10^5, costs[i] <= 10^5), it's O(N + max_cost).
// Space Complexity: O(M), where M is the maximum possible cost of an ice cream bar (10^5). This is for the counting array.

var maxIceCream = function(costs, coins) {
    // Find the maximum cost to determine the size of the counting array.
    let maxCost = 0;
    for (const cost of costs) {
        if (cost > maxCost) {
            maxCost = cost;
        }
    }

    // Create a counting array. `counts[i]` will store the number of ice cream bars with cost `i`.
    // The array size is `maxCost + 1` to accommodate costs from 0 up to `maxCost`.
    // Initialize all counts to 0.
    const counts = new Array(maxCost + 1).fill(0);

    // Populate the counting array by iterating through the input `costs`.
    for (const cost of costs) {
        counts[cost]++;
    }

    // Initialize the number of ice cream bars bought.
    let iceCreamBarsBought = 0;

    // Iterate through possible ice cream bar prices, starting from the cheapest (1).
    // We only need to go up to `maxCost` because any bar with a cost higher than that
    // would have already been considered if it existed, and if it's higher than our
    // budget, we wouldn't be able to buy it anyway.
    for (let price = 1; price <= maxCost; price++) {
        // Get the number of ice cream bars available at the current `price`.
        const numAvailable = counts[price];

        // If there are no ice cream bars at this price, continue to the next price.
        if (numAvailable === 0) {
            continue;
        }

        // Calculate how many ice cream bars of this `price` we can afford.
        // We can afford `Math.floor(coins / price)` bars in total at this price.
        // We also cannot buy more than `numAvailable` bars.
        const affordableCount = Math.min(numAvailable, Math.floor(coins / price));

        // If we can afford at least one bar of this price:
        if (affordableCount > 0) {
            // Add the number of bars we can afford to our total count.
            iceCreamBarsBought += affordableCount;
            // Deduct the cost of these bars from our `coins`.
            coins -= affordableCount * price;
        }

        // If we have run out of coins, we can stop buying.
        if (coins <= 0) {
            break;
        }
    }

    // Return the total number of ice cream bars bought.
    return iceCreamBarsBought;
};
```