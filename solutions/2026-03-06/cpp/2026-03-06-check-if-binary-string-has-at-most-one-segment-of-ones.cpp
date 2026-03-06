// Problem: Check if Binary String Has at Most One Segment of Ones
// Link: https://leetcode.com/problems/check-if-binary-string-has-at-most-one-segment-of-ones/
// Approach:
// We can iterate through the string and keep track of whether we are currently inside a segment of ones.
// We can use a boolean flag to indicate if we have already encountered a segment of ones.
// If we see a '1' and we are not currently in a segment of ones, we set a flag indicating we've entered a segment.
// If we see a '0' after being in a segment of ones, it signifies the end of that segment.
// If we encounter another '1' after having already seen a segment of ones (and potentially moved past it by seeing a '0'),
// it means there are at least two separate segments of ones, and we can return false.
// We can also detect this by looking for the pattern "01" after the first "1" is encountered.
// A simpler approach: iterate and count consecutive ones. If a '0' is encountered after a '1', check if another '1' appears later.
// Even simpler: Scan for the first occurrence of '0' after a '1'. If such a '0' is found, then check if there are any '1's after this '0'.
// If there are any '1's after the first encountered '0' (which followed a '1'), then there are multiple segments.
// Time Complexity: O(N), where N is the length of the string, because we iterate through the string at most once.
// Space Complexity: O(1), as we only use a few extra variables for tracking state.

#include <string>
#include <vector>

class Solution {
public:
    bool checkZeroOneOne(std::string s) {
        // Flag to indicate if we have encountered the end of a '1' segment.
        bool foundZeroAfterOne = false;

        // Iterate through the string.
        for (int i = 0; i < s.length(); ++i) {
            // If we see a '0' and we haven't found a '0' after a '1' yet,
            // and the previous character was a '1', then this is the end of a potential segment.
            if (s[i] == '0' && i > 0 && s[i-1] == '1') {
                foundZeroAfterOne = true;
            }
            // If we see a '1' and we have already found a '0' after a '1',
            // it means there's a second segment of ones.
            if (s[i] == '1' && foundZeroAfterOne) {
                return false;
            }
        }

        // If we complete the loop without finding a second segment of ones, return true.
        return true;
    }
};
