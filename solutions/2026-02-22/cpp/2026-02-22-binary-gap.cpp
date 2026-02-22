// Problem: Binary Gap
// Link: https://leetcode.com/problems/binary-gap/
// Summary: Find the longest distance between adjacent 1s in the binary representation of a number.

/*
Approach:
We can iterate through the binary representation of the number by repeatedly taking the modulo 2 and dividing by 2.
We need to keep track of the position of the last encountered '1' and the current maximum gap.
When we encounter a '1':
1. If it's the first '1' we've seen, we store its position.
2. If it's not the first '1', we calculate the distance between the current '1' and the last '1' found.
   We update the maximum gap if this calculated distance is greater.
   Then, we update the position of the last '1' to the current position.

We can use a variable `last_one_pos` to store the index of the most recently seen '1'.
We can use a variable `max_gap` to store the maximum binary gap found so far.
We can use a variable `current_pos` to track the current bit position (starting from 0).

Initialize `last_one_pos = -1` (to indicate no '1' has been found yet).
Initialize `max_gap = 0`.
Initialize `current_pos = 0`.

Iterate while `n > 0`:
  Get the last bit: `bit = n % 2`.
  If `bit == 1`:
    If `last_one_pos != -1` (meaning we've seen a '1' before):
      Calculate the current gap: `current_gap = current_pos - last_one_pos`.
      Update `max_gap = max(max_gap, current_gap)`.
    Update `last_one_pos = current_pos`.
  Increment `current_pos`.
  Divide `n` by 2: `n = n / 2`.

Return `max_gap`.

Time Complexity: O(log n)
The loop runs for each bit in the binary representation of n. The number of bits is approximately log2(n).

Space Complexity: O(1)
We are using a few constant space variables.
*/
#include <algorithm> // For std::max

class Solution {
public:
    int binaryGap(int n) {
        int last_one_pos = -1; // Stores the position (index) of the last encountered '1'. -1 indicates no '1' seen yet.
        int max_gap = 0;       // Stores the maximum binary gap found so far.
        int current_pos = 0;   // Tracks the current bit position, starting from the least significant bit (0).

        // Iterate through the binary representation of n from right to left (LSB to MSB).
        while (n > 0) {
            // Check the last bit of n.
            int bit = n % 2;

            // If the current bit is a '1':
            if (bit == 1) {
                // If we have encountered a '1' before (last_one_pos is not -1),
                // calculate the distance between the current '1' and the previous '1'.
                if (last_one_pos != -1) {
                    int current_gap = current_pos - last_one_pos;
                    // Update max_gap if the current gap is larger.
                    max_gap = std::max(max_gap, current_gap);
                }
                // Update the position of the last encountered '1' to the current position.
                last_one_pos = current_pos;
            }

            // Move to the next bit position.
            current_pos++;
            // Right shift n by 1 to process the next bit (equivalent to integer division by 2).
            n = n / 2;
        }

        // Return the maximum binary gap found. If no two adjacent 1's were found, max_gap will remain 0.
        return max_gap;
    }
};
