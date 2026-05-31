/**
 * @summary Determines if a planet can destroy all asteroids by colliding with them in a specific order.
 * @link https://leetcode.com/problems/destroying-asteroids/
 * @approach The optimal strategy is to destroy asteroids in increasing order of mass.
 * If the planet's mass is sufficient to destroy the current smallest asteroid, it gains mass.
 * This increased mass then makes it more likely to destroy subsequent, larger asteroids.
 * If at any point the planet's mass is less than the current asteroid's mass, it's impossible to destroy all asteroids.
 * @timeComplexity O(N log N) due to sorting the asteroids array.
 * @spaceComplexity O(1) if sorting in-place, or O(N) if a new sorted array is created (depending on JS sort implementation).
 */
const asteroidsDestroyed = (mass, asteroids) => {
    // Sort the asteroids by their mass in ascending order.
    // This greedy approach ensures we tackle the smallest threats first,
    // maximizing the planet's mass gain before facing larger asteroids.
    asteroids.sort((a, b) => a - b);

    // Initialize the planet's current mass.
    let currentMass = mass;

    // Iterate through the sorted asteroids.
    for (const asteroidMass of asteroids) {
        // Check if the planet's current mass is sufficient to destroy the asteroid.
        if (currentMass >= asteroidMass) {
            // If yes, the planet destroys the asteroid and gains its mass.
            currentMass += asteroidMass;
        } else {
            // If no, the planet is destroyed, and it's impossible to destroy all asteroids.
            // Return false immediately.
            return false;
        }
    }

    // If the loop completes, it means all asteroids were successfully destroyed.
    // Return true.
    return true;
};
```