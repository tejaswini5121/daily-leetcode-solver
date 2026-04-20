```python
# Problem Summary: Find the maximum distance between two houses with different colors.
# Link: https://leetcode.com/problems/two-furthest-houses-with-different-colors/
# Approach:
# To maximize the distance, we want to pick houses that are as far apart as possible.
# The furthest possible pairs of houses are:
# 1. The first house and any other house.
# 2. The last house and any other house.
#
# We can iterate through all houses starting from the second house (index 1) and check
# if its color is different from the first house (index 0). If it is, the distance
# abs(i - 0) is a candidate for the maximum distance.
#
# Similarly, we can iterate through all houses starting from the second to last house
# (index n-2) backwards to the first house (index 0) and check if its color is different
# from the last house (index n-1). If it is, the distance abs((n-1) - i) is another
# candidate for the maximum distance.
#
# The maximum of these candidate distances will be our answer.
#
# Alternatively, a simpler greedy approach:
# Consider the first house (index 0). We want to find the furthest house with a different color.
# We can iterate from the end of the array backwards. The first house we find that has a different
# color from the first house will give us the maximum possible distance involving the first house.
# Let this distance be `dist1 = abs(i - 0)`.
#
# Now, consider the last house (index n-1). We want to find the furthest house with a different color.
# We can iterate from the beginning of the array forwards. The first house we find that has a different
# color from the last house will give us the maximum possible distance involving the last house.
# Let this distance be `dist2 = abs((n-1) - i)`.
#
# The maximum distance will be the maximum of `dist1` and `dist2`. This is because any other pair
# of houses with different colors will be bounded by the distances achievable from the first or last house.
#
# Time Complexity: O(n) because we iterate through the array at most twice.
# Space Complexity: O(1) because we use a constant amount of extra space.
class Solution:
    def maxDistance(self, colors: list[int]) -> int:
        n = len(colors)
        max_dist = 0

        # Check the distance between the first house and any other house
        # Iterate from the end of the array backwards
        for i in range(n - 1, -1, -1):
            # If the current house has a different color than the first house
            if colors[i] != colors[0]:
                # Calculate the distance and update max_dist if it's greater
                max_dist = max(max_dist, abs(i - 0))
                # We found the furthest house from the start with a different color,
                # so we can break this loop and move to checking from the end.
                break

        # Check the distance between the last house and any other house
        # Iterate from the beginning of the array forwards
        for i in range(n):
            # If the current house has a different color than the last house
            if colors[i] != colors[n - 1]:
                # Calculate the distance and update max_dist if it's greater
                max_dist = max(max_dist, abs((n - 1) - i))
                # We found the furthest house from the end with a different color,
                # so we can break this loop.
                break

        # Return the maximum distance found
        return max_dist

```