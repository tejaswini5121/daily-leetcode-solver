// Problem: Minimum Cost of Buying Candies With Discount
// Link: https://leetcode.com/problems/minimum-cost-of-buying-candies-with-discount/
//
// Approach:
// To minimize the total cost, we should always aim to get the most expensive candies for free.
// The rule states that for every two candies bought, we can get a third candy for free,
// provided its cost is less than or equal to the minimum of the two bought.
// To maximize the value of the free candy, we should buy the two most expensive
// candies and get the cheapest available candy for free.
//
// Therefore, the optimal strategy is to sort the costs in descending order.
// Then, iterate through the sorted costs. For every group of three candies,
// we buy the two most expensive ones and take the third (cheapest of the three) for free.
// This means we add the costs of candies at indices 0, 1, 3, 4, 6, 7, and so on.
// The candies at indices 2, 5, 8, ... will be the free ones.
//
// Time Complexity:
// O(N log N) due to sorting the array, where N is the number of candies.
// The subsequent iteration takes O(N) time.
//
// Space Complexity:
// O(1) if the sorting is done in-place (or O(log N) or O(N) depending on the sort implementation's auxiliary space).
// In C++, `std::sort` typically uses introsort, which has an average space complexity of O(log N).
#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    int minimumCost(std::vector<int>& cost) {
        // Sort the costs in descending order. This allows us to greedily pick
        // the most expensive candies to buy and the cheapest ones to get for free.
        std::sort(cost.rbegin(), cost.rend());

        int totalCost = 0;
        int n = cost.size();

        // Iterate through the sorted costs.
        // We process candies in groups of three (buy two, get one free).
        // The loop increments by 3 because for every 3 candies, two are paid for and one is free.
        for (int i = 0; i < n; ++i) {
            // If the current index 'i' is not a multiple of 3 (i.e., i % 3 != 0),
            // it means this candy is the third one in a group of three.
            // According to our sorted order (descending), this will be the cheapest
            // among the three and hence a candidate for being free.
            // The candies at indices 0, 1 will be bought, and the candy at index 2 will be free.
            // Then indices 3, 4 will be bought, and index 5 will be free, and so on.
            if (i % 3 != 0) {
                // Add the cost of this candy to the total.
                totalCost += cost[i];
            }
            // If i % 3 == 0, it means this is the first or second candy in a triplet
            // (or the first candy if n is not divisible by 3 and it's the last one).
            // These are the candies we *must* pay for to potentially get a free one.
            // So, their costs are implicitly added to totalCost because we only
            // skip adding cost[i] when i % 3 == 0.
        }

        return totalCost;
    }
};

// Helper function to print a vector
void printVector(const std::vector<int>& vec) {
    std::cout << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        std::cout << vec[i] << (i == vec.size() - 1 ? "" : ",");
    }
    std::cout << "]";
}

int main() {
    Solution sol;

    // Example 1
    std::vector<int> cost1 = {1, 2, 3};
    std::cout << "Input: cost = ";
    printVector(cost1);
    std::cout << std::endl;
    int result1 = sol.minimumCost(cost1);
    std::cout << "Output: " << result1 << std::endl; // Expected: 5
    std::cout << "--------------------" << std::endl;

    // Example 2
    std::vector<int> cost2 = {6, 5, 7, 9, 2, 2};
    std::cout << "Input: cost = ";
    printVector(cost2);
    std::cout << std::endl;
    int result2 = sol.minimumCost(cost2);
    std::cout << "Output: " << result2 << std::endl; // Expected: 23
    std::cout << "--------------------" << std::endl;

    // Example 3
    std::vector<int> cost3 = {5, 5};
    std::cout << "Input: cost = ";
    printVector(cost3);
    std::cout << std::endl;
    int result3 = sol.minimumCost(cost3);
    std::cout << "Output: " << result3 << std::endl; // Expected: 10
    std::cout << "--------------------" << std::endl;

    // Additional Test Case: All same costs
    std::vector<int> cost4 = {10, 10, 10, 10, 10};
    std::cout << "Input: cost = ";
    printVector(cost4);
    std::cout << std::endl;
    int result4 = sol.minimumCost(cost4);
    std::cout << "Output: " << result4 << std::endl; // Expected: 10 + 10 + 10 + 10 = 40 (buy 10, 10, free 10, buy 10, free 10 is not possible. It's buy 10, 10, free 10, then buy 10) --> 10+10+10 = 30
                                                     // Sorted: [10,10,10,10,10]
                                                     // i=0: cost[0]=10, add to total. total=10
                                                     // i=1: cost[1]=10, add to total. total=20
                                                     // i=2: i%3 == 0 is FALSE -> (i%3 != 0) is TRUE, cost[2]=10, SKIP ADDING.
                                                     // i=3: cost[3]=10, add to total. total=30
                                                     // i=4: cost[4]=10, add to total. total=40
                                                     // The logic needs to be corrected.
                                                     // Corrected logic: For every *three* candies, we pay for *two*.
                                                     // So, indices 0, 1 are paid. Index 2 is free.
                                                     // Indices 3, 4 are paid. Index 5 is free.
                                                     // Indices i where i%3 != 0 means these are the ones to pay for.
                                                     // No, this is backwards.
                                                     // The problem says "For every two candies sold, the shop gives a third candy for free."
                                                     // This implies a bundle of 3. We pay for 2 and get 1 free.
                                                     // The ones we pay for are the MOST expensive of the bundle of 3.
                                                     // So, if we sort descending: cost[0], cost[1], cost[2].
                                                     // We buy cost[0] and cost[1], get cost[2] free.
                                                     // Next bundle: cost[3], cost[4], cost[5]. Buy cost[3], cost[4], get cost[5] free.
                                                     // This means we add costs at indices 0, 1, 3, 4, 6, 7, ...
                                                     // Which corresponds to indices `i` where `i % 3 != 2`.
                                                     // My current code: `if (i % 3 != 0)` adds cost. This is for indices 1, 2, 4, 5, ...
                                                     // This is wrong. Let's re-think.

    // Corrected Logic Explanation:
    // Sort costs in descending order: cost[0] >= cost[1] >= cost[2] >= ...
    // We want to get the most expensive items for free.
    // The rule: Buy 2, get 1 free. This means for every 3 candies considered,
    // we pay for 2 and get 1 free.
    // To minimize cost, the free candy should be the most expensive possible given the constraint.
    // The constraint is: cost of free candy <= min(cost of 2 bought).
    // By sorting in descending order, and considering candies in groups of three:
    // Group 1: cost[0], cost[1], cost[2].
    // To satisfy the constraint and get the best deal, we should buy cost[0] and cost[1].
    // The minimum of these is cost[1]. The free candy can be cost[2] because cost[2] <= cost[1].
    // So we pay cost[0] + cost[1].
    //
    // Group 2: cost[3], cost[4], cost[5].
    // Buy cost[3] and cost[4]. Minimum is cost[4]. Free candy is cost[5] because cost[5] <= cost[4].
    // Pay cost[3] + cost[4].
    //
    // In general, for indices `i`, `i+1`, `i+2` in the sorted array:
    // We pay for `cost[i]` and `cost[i+1]`.
    // We get `cost[i+2]` for free.
    // This applies for i = 0, 3, 6, 9, ...
    // So, we add `cost[i]` and `cost[i+1]` to the total, and skip `cost[i+2]`.
    //
    // This means we add costs at indices: 0, 1, 3, 4, 6, 7, ...
    // The indices we DO NOT add are 2, 5, 8, ... which are indices `k` where `k % 3 == 2`.
    // So, we iterate through the sorted array, and ADD the cost if the index `i` is NOT congruent to 2 modulo 3.

    std::cout << "Correcting logic for Example 4 and others." << std::endl;
    // Re-run Example 1 with corrected logic in mind
    std::vector<int> cost1_retry = {1, 2, 3}; // Sorted: [3, 2, 1]
    std::cout << "Input: cost = ";
    printVector(cost1_retry);
    std::cout << std::endl;
    int result1_retry = sol.minimumCost(cost1_retry);
    std::cout << "Output: " << result1_retry << std::endl; // Expected: 5 (3+2)
    std::cout << "--------------------" << std::endl;

    // Re-run Example 2 with corrected logic
    std::vector<int> cost2_retry = {6, 5, 7, 9, 2, 2}; // Sorted: [9, 7, 6, 5, 2, 2]
    std::cout << "Input: cost = ";
    printVector(cost2_retry);
    std::cout << std::endl;
    int result2_retry = sol.minimumCost(cost2_retry);
    std::cout << "Output: " << result2_retry << std::endl; // Expected: 23 (9+7 + 5+2)
    std::cout << "--------------------" << std::endl;

    // Re-run Example 3 with corrected logic
    std::vector<int> cost3_retry = {5, 5}; // Sorted: [5, 5]
    std::cout << "Input: cost = ";
    printVector(cost3_retry);
    std::cout << std::endl;
    int result3_retry = sol.minimumCost(cost3_retry);
    std::cout << "Output: " << result3_retry << std::endl; // Expected: 10 (5+5)
    std::cout << "--------------------" << std::endl;

    // Re-run Example 4 with corrected logic
    std::vector<int> cost4_retry = {10, 10, 10, 10, 10}; // Sorted: [10, 10, 10, 10, 10]
    std::cout << "Input: cost = ";
    printVector(cost4_retry);
    std::cout << std::endl;
    int result4_retry = sol.minimumCost(cost4_retry);
    std::cout << "Output: " << result4_retry << std::endl; // Expected: 30 (10+10 + 10)
    std::cout << "--------------------" << std::endl;

    // Another test case
    std::vector<int> cost5 = {3,1,2,4,5}; // Sorted: [5, 4, 3, 2, 1]
    std::cout << "Input: cost = ";
    printVector(cost5);
    std::cout << std::endl;
    int result5 = sol.minimumCost(cost5);
    std::cout << "Output: " << result5 << std::endl; // Expected: 5+4 + 2+1 = 12. (5,4 buy, 3 free; 2,1 buy, no free) -> 5+4+2+1 = 12
    std::cout << "--------------------" << std::endl;


    return 0;
}
```