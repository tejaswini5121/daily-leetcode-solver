```python
# Problem: Maximum Ice Cream Bars
# Link: https://leetcode.com/problems/maximum-ice-cream-bars/
#
# Approach:
# To maximize the number of ice cream bars bought with a limited number of coins,
# the boy should always buy the cheapest available ice cream bars first. This is a
# classic greedy approach. The problem specifically requires using counting sort.
#
# 1. Determine the maximum possible cost of an ice cream bar. This will define
#    the range for our counting sort.
# 2. Create a counting array (or frequency map) to store the count of each ice cream bar price.
# 3. Iterate through the `costs` array and populate the counting array.
# 4. Iterate through the possible prices from the minimum to the maximum. For each price:
#    a. If there are ice cream bars with this price, buy as many as possible without
#       exceeding the remaining `coins`.
#    b. Decrement `coins` by the total cost of the bought ice cream bars.
#    c. Increment the count of bought ice cream bars.
#    d. If `coins` becomes 0 or negative, stop the process.
#
# Time Complexity:
# - Counting the frequencies: O(n) where n is the number of ice cream bars.
# - Iterating through prices for counting sort: O(max_cost) where max_cost is the maximum price in `costs`.
# - Overall: O(n + max_cost). Since max_cost can be up to 10^5 and n up to 10^5, this is efficient.
#
# Space Complexity:
# - O(max_cost) for the counting array. In this problem, max_cost is up to 10^5.

class Solution:
    def maxIceCream(self, costs: list[int], coins: int) -> int:
        # Find the maximum price to determine the size of the counting array
        max_cost = 0
        for cost in costs:
            max_cost = max(max_cost, cost)

        # Create a counting array (frequency map) for prices.
        # The size needs to be max_cost + 1 to accommodate prices from 0 up to max_cost.
        # Initialize all counts to 0.
        # Note: Since minimum cost is 1, we can consider prices from 1 to max_cost.
        # We use max_cost + 1 for simplicity in indexing, or alternatively, a dictionary could be used.
        # However, since max_cost is bounded and reasonable, an array is fine.
        price_counts = [0] * (max_cost + 1)

        # Populate the counting array with the frequency of each ice cream bar price
        for cost in costs:
            price_counts[cost] += 1

        # Initialize the count of ice cream bars bought
        bars_bought = 0

        # Iterate through possible prices from the cheapest to the most expensive
        # We start from price 1 because ice cream costs are at least 1.
        for price in range(1, max_cost + 1):
            # If there are ice cream bars available at the current price
            if price_counts[price] > 0:
                # Calculate how many ice cream bars of this price we can afford
                # We can afford at most `price_counts[price]` bars,
                # and we can afford up to `coins // price` bars with the remaining money.
                num_can_afford = min(price_counts[price], coins // price)

                # If we can afford at least one bar of this price
                if num_can_afford > 0:
                    # Subtract the cost of the bought bars from our coins
                    coins -= num_can_afford * price
                    # Add the number of bought bars to our total count
                    bars_bought += num_can_afford
                
                # If we've run out of money, we can stop early
                if coins <= 0:
                    break
        
        # Return the total number of ice cream bars bought
        return bars_bought

```