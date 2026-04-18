```cpp
// Problem: Mirror Distance of an Integer
// LeetCode Link: https://leetcode.com/problems/mirror-distance-of-an-integer/
// Approach:
// 1. Reverse the digits of the input integer n.
//    - We can do this by repeatedly taking the last digit (n % 10),
//      adding it to the reversed number (multiplied by 10 to shift existing digits),
//      and then removing the last digit from n (n /= 10).
// 2. Calculate the absolute difference between n and its reversed version.
// 3. Return the absolute difference.
// Time Complexity: O(log10(n)) - The number of digits in n is proportional to log10(n).
// Space Complexity: O(1) - We only use a few variables to store intermediate results.

#include <cmath> // For abs()

class Solution {
public:
    int mirrorDistance(int n) {
        // Store the original number to calculate the difference later
        int original_n = n;
        // Variable to store the reversed number
        int reversed_n = 0;

        // Loop to reverse the digits of n
        while (n > 0) {
            // Get the last digit of n
            int digit = n % 10;
            // Append the digit to the reversed_n.
            // We multiply reversed_n by 10 to make space for the new digit.
            reversed_n = reversed_n * 10 + digit;
            // Remove the last digit from n
            n /= 10;
        }

        // Calculate the absolute difference between the original number and its reverse
        return std::abs(original_n - reversed_n);
    }
};
```