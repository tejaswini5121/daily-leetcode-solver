```cpp
// Problem: Binary Watch
// Problem Summary: Find all possible times (hours:minutes) given the total number of LEDs turned on.
// Link: https://leetcode.com/problems/binary-watch/
// Approach:
// We can iterate through all possible combinations of hours (0-11) and minutes (0-59).
// For each hour and minute combination, we count the number of set bits (LEDs on) in their binary representations.
// If the sum of set bits for the hour and minute equals `turnedOn`, we format the time and add it to the result.
// To count set bits, we can use `__builtin_popcount()` for efficiency.
// For formatting, hours less than 10 should not have a leading zero (e.g., "1:00"), while minutes should always have two digits with a leading zero if necessary (e.g., "10:02").
//
// Time Complexity: O(1)
// The maximum hour is 11 and the maximum minute is 59. The number of possible combinations is fixed (12 * 60 = 720).
// For each combination, counting set bits is a constant time operation using `__builtin_popcount()`.
// Therefore, the overall time complexity is constant.
//
// Space Complexity: O(N)
// Where N is the number of valid time combinations. In the worst case, `turnedOn` can be small, leading to more combinations.
// The space is used to store the resulting vector of strings.

#include <vector>
#include <string>
#include <algorithm>
#include <cstdio> // For sprintf

class Solution {
public:
    // Function to count set bits in an integer.
    // `__builtin_popcount(n)` is a GCC/Clang intrinsic that efficiently counts set bits.
    int countSetBits(int n) {
        return __builtin_popcount(n);
    }

    // Main function to generate all possible times.
    std::vector<std::string> readBinaryWatch(int turnedOn) {
        std::vector<std::string> result; // Vector to store the resulting time strings.

        // Iterate through all possible hours (0 to 11).
        for (int h = 0; h < 12; ++h) {
            // Iterate through all possible minutes (0 to 59).
            for (int m = 0; m < 60; ++m) {
                // Calculate the total number of LEDs turned on for the current hour and minute.
                // The hour uses 4 bits, and the minute uses 6 bits.
                // We sum the number of set bits in the binary representation of 'h' and 'm'.
                if (countSetBits(h) + countSetBits(m) == turnedOn) {
                    // If the total number of turned-on LEDs matches 'turnedOn', format the time.
                    char timeStr[6]; // Buffer to store the formatted time string (e.g., "H:MM").
                    // `sprintf` is used for formatting.
                    // `%d` for the hour.
                    // `%02d` for the minute, ensuring it's always two digits with a leading zero if needed.
                    sprintf(timeStr, "%d:%02d", h, m);
                    // Add the formatted time string to the result vector.
                    result.push_back(timeStr);
                }
            }
        }
        // Return the vector containing all valid time strings.
        return result;
    }
};
```