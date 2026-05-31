```python
# Problem Summary: Determine if a planet of given initial mass can destroy all asteroids by colliding with them in some order.
# Link: https://leetcode.com/problems/destroying-asteroids/
# Approach:
# The key insight here is that to maximize the planet's mass gain and thus its ability to destroy larger asteroids,
# we should always collide with the smallest available asteroid first. This is a greedy approach.
# By destroying smaller asteroids first, we increase the planet's mass as much as possible with the least resistance,
# making it more likely to be able to destroy larger asteroids later.
# Therefore, the optimal strategy is to sort the asteroids by mass in ascending order and then iterate through them,
# colliding with each one if the planet's current mass is sufficient. If at any point the planet's mass is less than
# the current asteroid's mass, it means the planet cannot destroy all asteroids, and we return False.
# If the planet successfully destroys all asteroids, we return True.
#
# Time Complexity Analysis:
# Sorting the asteroids takes O(N log N) time, where N is the number of asteroids.
# Iterating through the sorted asteroids takes O(N) time.
# Therefore, the overall time complexity is dominated by sorting, which is O(N log N).
#
# Space Complexity Analysis:
# Sorting the array might require O(log N) or O(N) space depending on the sorting algorithm implementation (e.g., Timsort in Python).
# The space used for variables is constant.
# Thus, the space complexity is O(N) or O(log N) due to sorting.

import sys

class Solution:
    def asteroidsDestroyed(self, mass: int, asteroids: list[int]) -> bool:
        """
        Determines if a planet can destroy all asteroids by colliding with them in an optimal order.

        Args:
            mass: The initial mass of the planet.
            asteroids: A list of asteroid masses.

        Returns:
            True if all asteroids can be destroyed, False otherwise.
        """

        # Sort the asteroids in ascending order of mass.
        # This is crucial for the greedy approach: destroying smaller asteroids first maximizes the planet's mass gain.
        asteroids.sort()

        # Initialize the current mass of the planet with its initial mass.
        current_mass = mass

        # Iterate through the sorted asteroids.
        for asteroid_mass in asteroids:
            # Check if the planet's current mass is sufficient to destroy the current asteroid.
            if current_mass >= asteroid_mass:
                # If sufficient, destroy the asteroid and increase the planet's mass.
                current_mass += asteroid_mass
            else:
                # If the planet's mass is less than the asteroid's mass, it cannot destroy this asteroid.
                # Therefore, it cannot destroy all asteroids. Return False.
                return False

        # If the loop completes without returning False, it means the planet has successfully destroyed all asteroids.
        return True

# Example Usage:
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    mass1 = 10
    asteroids1 = [3, 9, 19, 5, 21]
    print(f"Input: mass = {mass1}, asteroids = {asteroids1}")
    print(f"Output: {solution.asteroidsDestroyed(mass1, asteroids1)}")  # Expected: True

    # Example 2
    mass2 = 5
    asteroids2 = [4, 9, 23, 4]
    print(f"Input: mass = {mass2}, asteroids = {asteroids2}")
    print(f"Output: {solution.asteroidsDestroyed(mass2, asteroids2)}")  # Expected: False

    # Additional Test Case: Large masses, needs careful sorting
    mass3 = 100
    asteroids3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    print(f"Input: mass = {mass3}, asteroids = {asteroids3}")
    print(f"Output: {solution.asteroidsDestroyed(mass3, asteroids3)}") # Expected: True

    # Additional Test Case: A single large asteroid that cannot be destroyed
    mass4 = 50
    asteroids4 = [100]
    print(f"Input: mass = {mass4}, asteroids = {asteroids4}")
    print(f"Output: {solution.asteroidsDestroyed(mass4, asteroids4)}") # Expected: False

    # Additional Test Case: Many small asteroids that sum up to enough mass
    mass5 = 1
    asteroids5 = [1, 1, 1, 1, 1, 10]
    print(f"Input: mass = {mass5}, asteroids = {asteroids5}")
    print(f"Output: {solution.asteroidsDestroyed(mass5, asteroids5)}") # Expected: True

```