```cpp
// Problem: Find the smallest number >= n whose digit product is divisible by t.
// Link: https://leetcode.com/problems/smallest-divisible-digit-product-i/
// Approach:
// We will iterate through numbers starting from n. For each number, we calculate the product of its digits.
// If the digit product is divisible by t, we return that number.
// The digit product can be 0 if the number contains a 0 digit. 0 is divisible by any non-zero t.
// To calculate the digit product:
// Initialize product to 1.
// Iterate through the digits of the number by repeatedly taking the number modulo 10 to get the last digit,
// and then dividing the number by 10 to remove the last digit.
// If any digit is 0, the product becomes 0.
// Time Complexity: O(N * log10(N)), where N is the smallest number satisfying the condition.
// In the worst case, N can be slightly larger than the initial n. The log10(N) factor comes from calculating the digit product for each number.
// Given the constraints (n <= 100), N will not be excessively large.
// Space Complexity: O(1), as we are only using a few variables to store intermediate results.

#include <iostream>

// Function to calculate the product of digits of a number
long long digitProduct(int num) {
    if (num == 0) {
        return 0; // Product of digits for 0 is 0
    }
    long long product = 1;
    int temp = num;
    while (temp > 0) {
        int digit = temp % 10;
        if (digit == 0) {
            return 0; // If any digit is 0, the product is 0
        }
        product *= digit;
        temp /= 10;
    }
    return product;
}

// Main function to find the smallest number
int smallestDivisibleDigitProduct(int n, int t) {
    int currentNum = n;
    while (true) {
        long long prod = digitProduct(currentNum);
        // Check if the product is divisible by t.
        // If t is 1, any digit product is divisible by 1.
        // If prod is 0, it's divisible by any non-zero t.
        if (t == 1 || (prod != 0 && prod % t == 0) || (prod == 0 && t != 0)) {
            return currentNum;
        }
        currentNum++; // Move to the next number
    }
}

/*
// Example Usage (for testing purposes, not part of the LeetCode submission)
int main() {
    // Example 1
    int n1 = 10, t1 = 2;
    std::cout << "Input: n = " << n1 << ", t = " << t1 << std::endl;
    std::cout << "Output: " << smallestDivisibleDigitProduct(n1, t1) << std::endl; // Expected: 10

    // Example 2
    int n2 = 15, t2 = 3;
    std::cout << "Input: n = " << n2 << ", t = " << t2 << std::endl;
    std::cout << "Output: " << smallestDivisibleDigitProduct(n2, t2) << std::endl; // Expected: 16

    // Additional Test Cases
    int n3 = 1, t3 = 1;
    std::cout << "Input: n = " << n3 << ", t = " << t3 << std::endl;
    std::cout << "Output: " << smallestDivisibleDigitProduct(n3, t3) << std::endl; // Expected: 1

    int n4 = 5, t4 = 7;
    std::cout << "Input: n = " << n4 << ", t = " << t4 << std::endl;
    std::cout << "Output: " << smallestDivisibleDigitProduct(n4, t4) << std::endl; // Expected: 7

    int n5 = 99, t5 = 10;
    std::cout << "Input: n = " << n5 << ", t = " << t5 << std::endl;
    std::cout << "Output: " << smallestDivisibleDigitProduct(n5, t5) << std::endl; // Expected: 100 (prod=0)

    return 0;
}
*/
```