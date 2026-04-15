// Problem: Shortest Distance to Target String in a Circular Array
// Link: https://leetcode.com/problems/shortest-distance-to-target-string-in-a-circular-array/
// Approach: Iterate through the circular array, considering both clockwise and counter-clockwise movements from the startIndex to find all occurrences of the target string. For each occurrence, calculate the distance and keep track of the minimum distance found.
// Time Complexity: O(n), where n is the length of the words array. In the worst case, we might traverse the entire array twice.
// Space Complexity: O(1), as we only use a few variables to store the minimum distance and current index.

#include <vector>
#include <string>
#include <cmath>
#include <algorithm>

class Solution {
public:
    int shortestDistance(std::vector<std::string>& words, std::string target, int startIndex) {
        int n = words.size();
        int min_distance = -1; // Initialize min_distance to -1, indicating target not found yet.

        // Iterate through the array to find all occurrences of the target string.
        for (int i = 0; i < n; ++i) {
            // Check if the current word matches the target.
            if (words[i] == target) {
                // Calculate the distance in the clockwise direction.
                int distance_clockwise = (i - startIndex + n) % n;
                // Calculate the distance in the counter-clockwise direction.
                int distance_counter_clockwise = (startIndex - i + n) % n;

                // The shortest distance to this occurrence is the minimum of the two directions.
                int current_distance = std::min(distance_clockwise, distance_counter_clockwise);

                // If this is the first occurrence found, set min_distance.
                // Otherwise, update min_distance if the current_distance is smaller.
                if (min_distance == -1 || current_distance < min_distance) {
                    min_distance = current_distance;
                }
            }
        }

        // Return the shortest distance found, or -1 if the target was not found.
        return min_distance;
    }
};
