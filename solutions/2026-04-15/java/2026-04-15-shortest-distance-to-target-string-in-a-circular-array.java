```java
// Problem: Shortest Distance to Target String in a Circular Array
// Link: https://leetcode.com/problems/shortest-distance-to-target-string-in-a-circular-array/
// Approach:
// The problem asks for the shortest distance to a target string in a circular array, starting from a given index.
// Since the array is circular, we can move left or right. For each occurrence of the target string, we calculate the distance from the startIndex.
// The distance can be calculated in two ways: moving right or moving left.
// For a target at index `i`:
// - Distance moving right: `(i - startIndex + n) % n`
// - Distance moving left: `(startIndex - i + n) % n`
// We need to find the minimum of these two distances for all occurrences of the target.
// If the target is not found, return -1.
//
// Time Complexity: O(n*m), where n is the length of `words` and m is the average length of strings in `words`.
// We iterate through the `words` array once (O(n)). Inside the loop, we compare strings.
// In the worst case, string comparison can take O(m) time.
//
// Space Complexity: O(1) (excluding input storage). We only use a few variables to store the minimum distance.
class Solution {
    public int shortestDistance(String[] words, String target, int startIndex) {
        int n = words.length; // Get the length of the words array
        int minDistance = Integer.MAX_VALUE; // Initialize minimum distance to a very large value
        boolean found = false; // Flag to check if the target string is found

        // Iterate through each word in the array
        for (int i = 0; i < n; i++) {
            // Check if the current word matches the target string
            if (words[i].equals(target)) {
                found = true; // Mark that the target has been found

                // Calculate the distance by moving right (clockwise)
                // (i - startIndex + n) % n handles wrap-around for circular array
                int distanceRight = (i - startIndex + n) % n;

                // Calculate the distance by moving left (counter-clockwise)
                // (startIndex - i + n) % n handles wrap-around for circular array
                int distanceLeft = (startIndex - i + n) % n;

                // Update the minimum distance with the shorter of the two calculated distances
                minDistance = Math.min(minDistance, Math.min(distanceRight, distanceLeft));
            }
        }

        // If the target string was not found, return -1
        if (!found) {
            return -1;
        }

        // Return the shortest distance found
        return minDistance;
    }
}
```