```cpp
// Problem: Destroying Asteroids
// Link: https://leetcode.com/problems/destroying-asteroids/
// Summary: Determine if a planet can destroy all asteroids by colliding with them in some order.
//
// Approach:
// The key insight is that to maximize the planet's chances of destroying all asteroids,
// it should always collide with the smallest possible asteroid first. This greedy strategy
// ensures that the planet's mass increases as quickly as possible, making it more likely
// to be able to destroy larger asteroids later.
//
// 1. Sort the asteroids array in ascending order.
// 2. Iterate through the sorted asteroids. For each asteroid:
//    a. If the current planet mass is less than the asteroid's mass, the planet is destroyed,
//       and we return false.
//    b. If the planet's mass is greater than or equal to the asteroid's mass, the asteroid
//       is destroyed, and the planet's mass increases by the asteroid's mass.
// 3. If the loop completes without the planet being destroyed, it means all asteroids
//    could be destroyed, so return true.
//
// Time Complexity: O(N log N), where N is the number of asteroids. This is dominated by
// the sorting step. The iteration is O(N).
// Space Complexity: O(log N) or O(N) depending on the sorting algorithm used by the
// standard library's sort function. If an in-place sort is used, it could be O(log N)
// for recursion stack. If a copy is made, it could be O(N).

#include <vector>
#include <algorithm>

class Solution {
public:
    bool asteroidsDestroyed(int mass, std::vector<int>& asteroids) {
        // Sort the asteroids in ascending order to apply the greedy strategy.
        // This ensures we always try to destroy the smallest asteroids first,
        // maximizing the planet's mass gain.
        std::sort(asteroids.begin(), asteroids.end());

        // We need to use a long long for the planet's mass because the sum of masses
        // can exceed the range of an int.
        long long current_mass = mass;

        // Iterate through the sorted asteroids.
        for (int asteroid_mass : asteroids) {
            // If the current planet's mass is less than the asteroid's mass,
            // the planet cannot destroy this asteroid and will be destroyed itself.
            if (current_mass < asteroid_mass) {
                return false; // Planet destroyed
            }
            // If the planet's mass is sufficient, it destroys the asteroid and gains its mass.
            current_mass += asteroid_mass;
        }

        // If the loop completes, it means the planet successfully destroyed all asteroids.
        return true;
    }
};
```