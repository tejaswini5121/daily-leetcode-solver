/**
 * @param {string[]} words
 * @param {string} target
 * @param {number} startIndex
 * @return {number}
 */
// Problem Summary: Find the shortest distance from a starting index to a target string in a circular array.
// Problem Link: https://leetcode.com/problems/shortest-distance-to-target-string-in-a-circular-array/
// Approach:
// 1. Iterate through the array to find all occurrences of the target string.
// 2. For each occurrence, calculate the distance from the startIndex in both clockwise and counter-clockwise directions, considering the circular nature of the array.
// 3. Keep track of the minimum distance found.
// 4. If the target is not found, return -1.
// Time Complexity: O(n), where n is the length of the words array. We iterate through the array once to find occurrences and calculate distances.
// Space Complexity: O(1), as we only use a few variables to store the minimum distance and current index.
const shortestDistance = (words, target, startIndex) => {
    const n = words.length; // Get the length of the array
    let minDistance = Infinity; // Initialize minimum distance to infinity

    // Iterate through the array to find all occurrences of the target
    for (let i = 0; i < n; i++) {
        // Check if the current word matches the target
        if (words[i] === target) {
            // Calculate the clockwise distance from startIndex to the current index i
            // If i is after startIndex, the distance is i - startIndex.
            // If i is before startIndex, we wrap around: n - startIndex + i.
            const clockwiseDistance = (i - startIndex + n) % n;

            // Calculate the counter-clockwise distance from startIndex to the current index i
            // If i is before startIndex, the distance is startIndex - i.
            // If i is after startIndex, we wrap around: startIndex + n - i.
            const counterClockwiseDistance = (startIndex - i + n) % n;

            // The shortest distance to this occurrence is the minimum of clockwise and counter-clockwise distances
            const currentDistance = Math.min(clockwiseDistance, counterClockwiseDistance);

            // Update the overall minimum distance if the current distance is smaller
            minDistance = Math.min(minDistance, currentDistance);
        }
    }

    // If minDistance is still Infinity, it means the target was not found.
    // Otherwise, return the shortest distance found.
    return minDistance === Infinity ? -1 : minDistance;
};
```