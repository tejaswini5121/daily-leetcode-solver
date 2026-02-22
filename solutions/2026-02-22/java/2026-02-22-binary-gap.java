```java
// Problem Summary: Find the longest distance between adjacent 1s in the binary representation of a positive integer.
// Problem Link: https://leetcode.com/problems/binary-gap/
//
// Approach:
// We can iterate through the binary representation of the number by repeatedly taking the modulo 2 (to get the last bit)
// and dividing by 2 (to shift the bits).
// We need to keep track of the position of the last encountered '1'.
// When we encounter a '1', if we have a previous '1' recorded, we calculate the distance between the current '1' and the previous '1'.
// This distance is the current position minus the position of the previous '1'.
// We then update the maximum distance found so far and update the position of the previous '1' to the current position.
// If we encounter a '0', we simply increment the position counter.
//
// Time Complexity: O(log n), where n is the input integer. This is because the number of bits in the binary representation of n is log base 2 of n.
// Space Complexity: O(1), as we only use a few constant-size variables.
class Solution {
    public int binaryGap(int n) {
        int maxDistance = 0; // Stores the maximum distance found so far
        int lastOnePos = -1; // Stores the position of the last encountered '1'. Initialized to -1, meaning no '1' has been seen yet.
        int currentPos = 0;  // Stores the current bit position, starting from 0 for the least significant bit.

        // Iterate while n is greater than 0, effectively processing each bit from right to left.
        while (n > 0) {
            // Check the last bit of n
            if ((n & 1) == 1) { // If the last bit is 1
                // If we have already encountered a '1' before (lastOnePos is not -1)
                if (lastOnePos != -1) {
                    // Calculate the distance between the current '1' and the last '1'
                    int distance = currentPos - lastOnePos;
                    // Update the maximum distance if the current distance is greater
                    maxDistance = Math.max(maxDistance, distance);
                }
                // Update the position of the last encountered '1' to the current position
                lastOnePos = currentPos;
            }

            // Right shift n by 1 bit to process the next bit
            n >>= 1;
            // Increment the current position counter
            currentPos++;
        }

        // Return the maximum distance found. If no two '1's were adjacent, maxDistance remains 0.
        return maxDistance;
    }
}
```