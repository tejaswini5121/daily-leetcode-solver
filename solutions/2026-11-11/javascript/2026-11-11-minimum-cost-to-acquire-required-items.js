/**
 * @summary Calculates the minimum cost to acquire a required number of two types of items,
 *          given the costs of individual items and a combined item.
 * @link https://leetcode.com/problems/minimum-cost-to-acquire-required-items/
 * @approach
 * The problem asks for the minimum cost to satisfy two needs (need1 and need2) using three types of items:
 * type 1 (costs cost1, provides 1 to need1),
 * type 2 (costs cost2, provides 1 to need2),
 * and type 3 (costs costBoth, provides 1 to both need1 and need2).
 *
 * We can consider a few scenarios and combine them to find the minimum:
 *
 * 1. Using only individual items:
 *    Buy need1 items of type 1 and need2 items of type 2. Cost: `need1 * cost1 + need2 * cost2`.
 *
 * 2. Using only combined items (type 3):
 *    To satisfy both need1 and need2, we need at least `max(need1, need2)` items of type 3.
 *    Cost: `max(need1, need2) * costBoth`.
 *
 * 3. Using a mix of individual and combined items:
 *    This is where it gets a bit more nuanced. We can satisfy as much of one need as possible with combined items
 *    and then use individual items for the remainder.
 *    Let's iterate through the number of type 3 items we might buy. Suppose we buy `k` items of type 3.
 *    These `k` items contribute `k` to need1 and `k` to need2.
 *    The remaining need for type 1 is `max(0, need1 - k)`.
 *    The remaining need for type 2 is `max(0, need2 - k)`.
 *    We can then buy the remaining items using type 1 and type 2 items respectively.
 *    The cost for this specific `k` would be `k * costBoth + max(0, need1 - k) * cost1 + max(0, need2 - k) * cost2`.
 *
 *    However, the number of type 3 items `k` can be up to `need1 + need2` in the worst case if we consider
 *    that one type 3 item can fulfill a part of both needs.
 *    A more insightful way to think about the mixed strategy is:
 *    We can satisfy `min(need1, need2)` of both needs using type 3 items.
 *    The cost for this part is `min(need1, need2) * costBoth`.
 *    After this, we have `need1 - min(need1, need2)` remaining need for type 1, and `need2 - min(need1, need2)`
 *    remaining need for type 2.
 *    One of these will be 0.
 *    Let `rem1 = need1 - min(need1, need2)` and `rem2 = need2 - min(need1, need2)`.
 *    We then need to satisfy `rem1` using type 1 items and `rem2` using type 2 items.
 *    The cost for the remaining parts would be `rem1 * cost1 + rem2 * cost2`.
 *    So, one potential cost is `min(need1, need2) * costBoth + (need1 - min(need1, need2)) * cost1 + (need2 - min(need1, need2)) * cost2`.
 *
 *    There's another crucial aspect: the "effective cost" of satisfying both needs with type 3 items versus individual items.
 *    For example, if `costBoth` is very cheap compared to `cost1 + cost2`, we'd prefer `costBoth`.
 *    Conversely, if `costBoth` is expensive, we might prefer individual items.
 *
 *    Let's refine the strategy. We have three main components to consider:
 *    a) Satisfy both needs entirely with type 1 and type 2 items.
 *       Cost: `need1 * cost1 + need2 * cost2`
 *    b) Satisfy both needs entirely with type 3 items.
 *       Cost: `max(need1, need2) * costBoth`
 *    c) Satisfy some needs with type 3 items and the rest with individual items.
 *       The most efficient way to use type 3 items for *both* needs is to satisfy `min(need1, need2)` units for both.
 *       The cost for this is `min(need1, need2) * costBoth`.
 *       The remaining need is `need1 - min(need1, need2)` for type 1 and `need2 - min(need1, need2)` for type 2.
 *       One of these remaining needs will be zero. We satisfy the non-zero remaining need using individual items.
 *       So, the total cost for this scenario is `min(need1, need2) * costBoth + (need1 - min(need1, need2)) * cost1 + (need2 - min(need1, need2)) * cost2`.
 *
 *    However, we can also optimize the fulfillment of *one* of the needs with type 3 items, and then the *other* need with type 3 items.
 *    This means we can buy `need1` items of type 3 (cost `need1 * costBoth`) which covers need1 and `need1` of need2.
 *    Then, we need `max(0, need2 - need1)` more for need2, which we get from type 2 items. Total: `need1 * costBoth + max(0, need2 - need1) * cost2`.
 *    Similarly, we can buy `need2` items of type 3 (cost `need2 * costBoth`) which covers need2 and `need2` of need1.
 *    Then, we need `max(0, need1 - need2)` more for need1, which we get from type 1 items. Total: `need2 * costBoth + max(0, need1 - need2) * cost1`.
 *
 *    Let's consider the minimum cost to satisfy the *remaining* need of one type after using some type 3 items.
 *    Suppose we have `need1_rem` remaining need for type 1 and `need2_rem` remaining need for type 2.
 *    The cost to satisfy these is `min(need1_rem * cost1 + need2_rem * cost2, need1_rem * costBoth + need2_rem * costBoth, ... )`
 *    This leads to the observation that the cost to satisfy *any* number of type 1 needs using only type 1 or type 3 is `min(cost1, costBoth)`.
 *    And similarly, the cost to satisfy *any* number of type 2 needs using only type 2 or type 3 is `min(cost2, costBoth)`.
 *
 *    This implies we can consider the problem as:
 *    We need `need1` units. The effective cost per unit for type 1 is `min(cost1, costBoth)`.
 *    We need `need2` units. The effective cost per unit for type 2 is `min(cost2, costBoth)`.
 *    This is NOT entirely correct because `costBoth` contributes to *both*.
 *
 *    The key insight is that we have three basic ways to fulfill needs:
 *    1. Buy `need1` of type 1 and `need2` of type 2. Cost: `need1 * cost1 + need2 * cost2`.
 *    2. Buy `need1` of type 3 (covers `need1` of need1 and `need1` of need2), then cover remaining `need2` if any with type 2.
 *       Cost: `need1 * costBoth + max(0LL, need2 - need1) * cost2`.
 *    3. Buy `need2` of type 3 (covers `need2` of need2 and `need2` of need1), then cover remaining `need1` if any with type 1.
 *       Cost: `need2 * costBoth + max(0LL, need1 - need2) * cost1`.
 *    4. A special case that covers scenarios where `costBoth` is very cheap: buy `max(need1, need2)` of type 3.
 *       Cost: `max(need1, need2) * costBoth`. This covers both needs if `need1 <= need2` or `need2 <= need1`.
 *       If `need1 > need2`, then `max(need1, need2) = need1`. Buying `need1` type 3 items provides `need1` for type 1 and `need1` for type 2. Since `need1 > need2`, the type 2 requirement is met.
 *       Similarly if `need2 > need1`.
 *
 *    So we have these candidate minimum costs:
 *    - `need1 * cost1 + need2 * cost2` (purely individual items)
 *    - `need1 * costBoth + max(0, need2 - need1) * cost2` (prioritize type 3 for need1, then type 2 for remaining need2)
 *    - `need2 * costBoth + max(0, need1 - need2) * cost1` (prioritize type 3 for need2, then type 1 for remaining need1)
 *    - `max(need1, need2) * costBoth` (buy enough type 3 items to cover the larger need, which will also cover the smaller one)
 *
 *    The minimum of these four options should give the answer.
 *    Note: The `max(0LL, ...)` is important because we can't have negative requirements.
 *    The types `long long` for `need1`, `need2` and the calculation is important because `need1`, `need2` can be up to `10^9` and costs up to `10^6`, so the total cost can exceed `2^31 - 1`.
 *    In JavaScript, numbers are 64-bit floating-point, so they can handle large integers, but `BigInt` might be safer for extreme cases or if precision issues were a concern for very large products. However, for `10^9 * 10^6`, the result `10^15` fits within the safe integer range of JavaScript's standard Number type (`Number.MAX_SAFE_INTEGER` is `2^53 - 1`, which is about `9 * 10^15`). So standard numbers should be fine.
 *
 * Time Complexity: O(1) - The calculation involves a fixed number of arithmetic operations and comparisons.
 * Space Complexity: O(1) - We only use a few variables to store the costs and needs.
 */
const minimumCost = (cost1, cost2, costBoth, need1, need2) => {
    // If no items are needed, the cost is 0.
    if (need1 === 0 && need2 === 0) {
        return 0;
    }

    // Candidate 1: Buy only individual items of type 1 and type 2.
    // Cost = (need1 * cost1) + (need2 * cost2)
    // Using BigInt to avoid potential overflow if need1/need2 and costs are very large,
    // although standard JS numbers are usually sufficient for these constraints.
    // For safety and explicit large integer handling, BigInt is preferred.
    const option1 = BigInt(need1) * BigInt(cost1) + BigInt(need2) * BigInt(cost2);

    // Candidate 2: Buy enough type 3 items to satisfy need1 completely,
    // then buy type 2 items for any remaining need2.
    // If need2 is less than or equal to need1, buying need1 type 3 items is sufficient.
    // If need2 is greater than need1, we buy need1 type 3 items, and then need2 - need1 more of type 2.
    const option2 = BigInt(need1) * BigInt(costBoth) + BigInt(Math.max(0, need2 - need1)) * BigInt(cost2);

    // Candidate 3: Buy enough type 3 items to satisfy need2 completely,
    // then buy type 1 items for any remaining need1.
    // If need1 is less than or equal to need2, buying need2 type 3 items is sufficient.
    // If need1 is greater than need2, we buy need2 type 3 items, and then need1 - need2 more of type 1.
    const option3 = BigInt(need2) * BigInt(costBoth) + BigInt(Math.max(0, need1 - need2)) * BigInt(cost1);

    // Candidate 4: Buy enough type 3 items to cover the larger of the two needs.
    // This implicitly covers both needs if one is a subset of the other.
    // For example, if need1 = 5, need2 = 3, buying 5 type 3 items covers both (5 for need1, 5 for need2).
    // If need1 = 3, need2 = 5, buying 5 type 3 items covers both (5 for need2, 5 for need1).
    const option4 = BigInt(Math.max(need1, need2)) * BigInt(costBoth);

    // The minimum cost is the smallest among these four candidates.
    // We compare BigInts.
    let minCost = option1;
    if (option2 < minCost) {
        minCost = option2;
    }
    if (option3 < minCost) {
        minCost = option3;
    }
    if (option4 < minCost) {
        minCost = option4;
    }

    // Return the minimum cost as a standard JavaScript Number.
    // Since the constraints ensure the final result fits within a standard number,
    // we can safely convert it back.
    return Number(minCost);
};
```