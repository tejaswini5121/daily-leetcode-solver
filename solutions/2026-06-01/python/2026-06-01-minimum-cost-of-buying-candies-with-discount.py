```python
# Summary: Minimize the cost of buying candies where for every two candies bought,
#          the cheapest of the three can be taken for free.
# Link: https://leetcode.com/problems/minimum-cost-of-buying-candies-with-discount/
#
# Approach:
# To minimize the total cost, we should always try to get the most expensive candies for free.
# The "buy two, get one free" rule applies to groups of three candies. To maximize the value
# of the free candy, we should pair the two most expensive candies and get the cheapest
# among those three for free.
#
# Therefore, the greedy strategy is to sort the candies in descending order. Then, iterate
# through the sorted costs. For every three candies, we buy the two most expensive ones
# and get the third (cheapest in that triplet) for free. The total cost will be the sum
# of the costs of the candies we actually pay for.
#
# We can achieve this by sorting the `cost` array in descending order.
# Then, iterate through the sorted array. For every three elements (i.e., indices i, i+1, i+2),
# we add `cost[i]` and `cost[i+1]` to our total cost (these are the two most expensive
# in the triplet because the array is sorted descendingly). The element at `cost[i+2]`
# will be free. We advance our index by 3 in each step of the iteration.
#
# If the number of candies is not a multiple of 3, the remaining candies at the end
# will be bought individually.
#
# Example walk-through with cost = [6,5,7,9,2,2]:
# 1. Sort cost descending: [9, 7, 6, 5, 2, 2]
# 2. First triplet (indices 0, 1, 2):
#    - Buy 9 and 7.
#    - Get 6 for free.
#    - Current cost: 9 + 7 = 16.
#    - Move to index 3.
# 3. Second triplet (indices 3, 4, 5):
#    - Buy 5 and 2.
#    - Get the second 2 for free.
#    - Current cost: 16 + 5 + 2 = 23.
#    - Move to index 6.
# 4. Array exhausted. Total cost = 23.
#
# Time Complexity:
# O(N log N) due to sorting the `cost` array, where N is the number of candies.
# The iteration after sorting takes O(N) time.
#
# Space Complexity:
# O(1) if we sort the array in-place. If a new sorted array is created, it would be O(N).
# Python's `sort()` method sorts in-place, so it's O(1) auxiliary space.

class Solution:
    def minimumCost(self, cost: list[int]) -> int:
        # Sort the costs in descending order.
        # This greedy approach ensures that we always get the most expensive possible candy for free
        # by pairing it with two other expensive candies.
        cost.sort(reverse=True)

        total_cost = 0
        n = len(cost)

        # Iterate through the sorted costs.
        # We process candies in groups of three.
        # For every three candies, we pay for the two most expensive ones (at indices i and i+1)
        # and the third one (at index i+2) is free because its cost is less than or equal to
        # the minimum of the two purchased candies (cost[i+1] because it's sorted descendingly).
        i = 0
        while i < n:
            # Add the cost of the first candy in the triplet (most expensive).
            total_cost += cost[i]
            # Add the cost of the second candy in the triplet (second most expensive).
            total_cost += cost[i+1]

            # The third candy (cost[i+2]) is taken for free.
            # We increment i by 3 to move to the next group of three.
            i += 3

            # Check if we have reached the end of the array before adding the next two candies.
            # This condition is important if n is not a multiple of 3.
            # If i is already at or beyond n, it means we don't have two more candies to buy.
            # The loop will naturally terminate if i >= n.
            # However, we need to ensure we don't go out of bounds when accessing cost[i+1].
            # The loop condition `i < n` handles the start of the group.
            # Inside the loop, we need to make sure `i+1 < n`.
            # If `i+1 >= n`, it implies there's only one candy left at `cost[i]` that we have to buy,
            # or no candies left.
            # The current logic `total_cost += cost[i]` and `total_cost += cost[i+1]` assumes
            # there are at least two more elements available after `cost[i]`.
            # Let's refine the loop logic to handle remaining candies correctly.

        # Reset total_cost and use a more explicit loop for clarity and correctness.
        total_cost = 0
        i = 0
        while i < n:
            # We buy this candy.
            total_cost += cost[i]
            # We buy this candy.
            # We check if there's a next candy to buy. If not, this is the last candy.
            if i + 1 < n:
                total_cost += cost[i+1]

            # The candy at index i+2 is free.
            # We increment by 3 to skip the free candy and move to the next pair to buy.
            i += 3

        # The above loop logic has a flaw if n is not a multiple of 3.
        # The strategy is: buy two, get one free.
        # So for every 3 candies, we pay for 2.
        # The candies we pay for are at indices `i` and `i+1` if we consider the triplet `i, i+1, i+2`.
        # The indices of candies we pay for are `0, 1`, then `3, 4`, then `6, 7`, etc.
        # The free candies are at indices `2`, then `5`, then `8`, etc.

        total_cost = 0
        n = len(cost)

        # Iterate from the beginning, taking elements in groups of 3.
        # The first two elements of each group of three are paid for.
        # The third element is free.
        for i in range(0, n, 3):
            # We pay for the candy at index i.
            total_cost += cost[i]
            # We pay for the candy at index i+1.
            # We need to ensure that i+1 is within the bounds of the array.
            # If i+1 is out of bounds, it means there's only one candy left (at index i)
            # which we have already paid for. The loop will naturally terminate after this iteration.
            if i + 1 < n:
                total_cost += cost[i+1]
            # The candy at index i+2 (if it exists) is free. We don't add its cost.

        return total_cost

```