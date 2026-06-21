```cpp
// Problem: Maximum Ice Cream Bars
// Summary: Find the maximum number of ice cream bars a boy can buy given their costs and his total coins.
// Link: https://leetcode.com/problems/maximum-ice-cream-bars/
// Approach:
// The problem asks to maximize the number of ice cream bars. To do this, we should always buy the cheapest ice cream bars first.
// This is a greedy approach. We can efficiently sort the costs using Counting Sort because the maximum cost of an ice cream bar is limited (10^5).
// After sorting, we iterate through the sorted costs, buying an ice cream bar if we have enough coins, and decrementing our coins.
// We keep track of the number of ice cream bars bought.
// Time Complexity: O(N + K), where N is the number of ice cream bars and K is the maximum possible cost of an ice cream bar (10^5).
// The Counting Sort takes O(N + K) time, and the subsequent iteration to buy bars takes O(N) time.
// Space Complexity: O(K) for the counting array used in Counting Sort.
#include <vector>
#include <numeric> // For std::iota if needed, but not strictly for this solution

class Solution {
public:
    int maxIceCream(std::vector<int>& costs, int coins) {
        // Maximum possible cost of an ice cream bar is 10^5 according to constraints.
        // We'll use this to determine the size of our counting array.
        const int MAX_COST = 100001; // +1 because costs are 1-indexed up to 10^5.

        // Create a frequency map (counting array) to store the count of each ice cream bar cost.
        // count[i] will store how many ice cream bars cost 'i'.
        std::vector<int> count(MAX_COST, 0);

        // Populate the frequency map using the given costs.
        // This step takes O(N) time, where N is the number of ice cream bars.
        for (int cost : costs) {
            count[cost]++;
        }

        int iceCreamCount = 0; // Initialize the count of ice cream bars bought.

        // Iterate through possible costs, from cheapest to most expensive.
        // This loop iterates up to MAX_COST, which is a constant.
        // Inside the loop, we iterate based on the frequency of each cost.
        for (int cost = 1; cost < MAX_COST; ++cost) {
            // While we have ice cream bars of the current 'cost' and we have enough 'coins' to buy one:
            while (count[cost] > 0 && coins >= cost) {
                // Buy one ice cream bar.
                coins -= cost;          // Deduct the cost from our coins.
                iceCreamCount++;        // Increment the count of bought ice cream bars.
                count[cost]--;          // Decrement the available count for this cost.
            }
            // If we run out of coins, we can't buy any more ice cream bars.
            if (coins < cost) {
                break; // Exit the loop early.
            }
        }

        // Return the total number of ice cream bars bought.
        return iceCreamCount;
    }
};
```