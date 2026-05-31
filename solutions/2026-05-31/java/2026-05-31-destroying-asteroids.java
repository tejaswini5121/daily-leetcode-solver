// Problem: Destroying Asteroids
// Link: https://leetcode.com/problems/destroying-asteroids/
// Problem Summary: Determine if a planet can destroy all asteroids by colliding with them in some order,
// gaining mass from destroyed asteroids.
//
// Approach:
// The key insight is that to maximize the planet's chances of survival, it should always collide
// with the smallest asteroids first. This is a greedy approach. By destroying smaller asteroids,
// the planet gains mass, making it more capable of destroying larger asteroids later.
//
// Steps:
// 1. Sort the asteroids array in ascending order. This ensures we consider the smallest asteroids first.
// 2. Iterate through the sorted asteroids. For each asteroid:
//    a. If the planet's current mass is greater than or equal to the asteroid's mass, the planet destroys the asteroid.
//       The planet's mass is updated by adding the asteroid's mass.
//    b. If the planet's current mass is less than the asteroid's mass, the planet is destroyed, and we can immediately
//       return false.
// 3. If the loop completes without the planet being destroyed, it means all asteroids were destroyed. Return true.
//
// Time Complexity: O(N log N) due to sorting the asteroids array, where N is the number of asteroids.
// The subsequent iteration is O(N).
//
// Space Complexity: O(1) if sorting is done in-place. If a copy is made for sorting, it would be O(N).
// In Java, Arrays.sort() for primitive types is typically O(log N) to O(N) stack space for recursion,
// but can be considered O(1) auxiliary space if we ignore recursion stack space.
class Solution {
    /**
     * Determines if a planet can destroy all asteroids by colliding with them in the optimal order.
     *
     * @param mass      The initial mass of the planet.
     * @param asteroids An array of asteroid masses.
     * @return true if all asteroids can be destroyed, false otherwise.
     */
    public boolean destroy8asteroids(long mass, int[] asteroids) {
        // Sort the asteroids in ascending order. This greedy approach ensures we tackle smaller
        // asteroids first, increasing the planet's mass and thus its ability to destroy larger ones.
        java.util.Arrays.sort(asteroids);

        // Iterate through each asteroid in the sorted array.
        for (int asteroidMass : asteroids) {
            // Check if the planet's current mass is sufficient to destroy the current asteroid.
            if (mass >= asteroidMass) {
                // If the planet's mass is greater than or equal to the asteroid's mass,
                // the asteroid is destroyed, and the planet gains its mass.
                mass += asteroidMass;
            } else {
                // If the planet's mass is less than the asteroid's mass, the planet is destroyed.
                // We can immediately return false as not all asteroids can be destroyed.
                return false;
            }
        }

        // If the loop completes, it means the planet successfully destroyed all asteroids.
        return true;
    }
}