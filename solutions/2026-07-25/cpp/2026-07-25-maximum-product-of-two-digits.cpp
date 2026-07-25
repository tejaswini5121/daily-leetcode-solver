```cpp
// Given a positive integer n, return the maximum product of any two digits in n.
// The same digit can be used twice if it appears more than once.
// Link: https://leetcode.com/problems/maximum-product-of-two-digits/
//
// Approach:
// To find the maximum product of two digits, we need to identify the two largest digits in the number.
// We can extract all the digits from the number and store them.
// Then, we sort the digits in descending order and pick the top two digits to calculate their product.
//
// Time Complexity: O(D log D), where D is the number of digits in n.
// Extracting digits takes O(D) time. Sorting D digits takes O(D log D) time.
// Since n <= 10^9, D is at most 10, so D log D is effectively constant.
//
// Space Complexity: O(D), where D is the number of digits in n, to store the digits.
// Similar to time complexity, D is small, so space complexity is effectively constant.

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class Solution {
public:
    int maxProduct(int n) {
        // Vector to store the digits of the number.
        std::vector<int> digits;

        // Extract digits from the integer n.
        // We can convert the integer to a string to easily access each digit.
        std::string s = std::to_string(n);
        for (char c : s) {
            // Convert character digit to integer and add to the vector.
            digits.push_back(c - '0');
        }

        // Sort the digits in descending order to easily find the two largest.
        std::sort(digits.rbegin(), digits.rend());

        // The maximum product will be the product of the two largest digits.
        // If there's only one digit (though constraints say n >= 10),
        // this would still work, but the problem guarantees at least two digits.
        return digits[0] * digits[1];
    }
};

/*
// Example Usage:
int main() {
    Solution sol;

    // Example 1
    int n1 = 31;
    std::cout << "Input: " << n1 << ", Output: " << sol.maxProduct(n1) << std::endl; // Expected: 3

    // Example 2
    int n2 = 22;
    std::cout << "Input: " << n2 << ", Output: " << sol.maxProduct(n2) << std::endl; // Expected: 4

    // Example 3
    int n3 = 124;
    std::cout << "Input: " << n3 << ", Output: " << sol.maxProduct(n3) << std::endl; // Expected: 8

    // Additional test case
    int n4 = 9876;
    std::cout << "Input: " << n4 << ", Output: " << sol.maxProduct(n4) << std::endl; // Expected: 72 (9 * 8)

    return 0;
}
*/
```