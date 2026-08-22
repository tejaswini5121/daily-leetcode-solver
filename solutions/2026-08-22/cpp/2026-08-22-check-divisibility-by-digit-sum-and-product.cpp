// Problem: Check Divisibility by Digit Sum and Product
// Link: https://leetcode.com/problems/check-divisibility-by-digit-sum-and-product/
//
// Approach:
// To solve this problem, we need to calculate the sum and product of the digits of the given integer `n`.
// We can iterate through the digits of `n` by repeatedly taking the number modulo 10 to get the last digit,
// adding it to the sum, and multiplying it with the product. We then divide `n` by 10 to remove the last digit.
// This process continues until `n` becomes 0.
// After calculating the digit sum and digit product, we add them together to get the total divisor.
// Finally, we check if the original number `n` is divisible by this total divisor.
//
// Time Complexity:
// The time complexity is O(log10(n)), where n is the input integer. This is because the number of digits in n
// is proportional to log10(n), and we iterate through each digit once.
//
// Space Complexity:
// The space complexity is O(1) because we are using a fixed amount of extra space for variables regardless of the input size.

#include <iostream>

class Solution {
public:
    bool checkDivisibility(int n) {
        // Store the original value of n to perform the divisibility check at the end.
        int original_n = n;

        // Initialize variables to store the sum and product of digits.
        int digit_sum = 0;
        int digit_product = 1; // Initialize product to 1, as multiplying by 0 would make the product 0.

        // Handle the case where n is 0. Although constraints say n >= 1, it's good practice.
        if (n == 0) {
            // A number is divisible by 0 only if it's 0.
            // The sum of digits for 0 is 0, product is 0. Total divisor is 0.
            return true; // 0 is divisible by 0.
        }

        // Iterate through the digits of n.
        while (n > 0) {
            // Get the last digit of n.
            int digit = n % 10;

            // Add the digit to the sum.
            digit_sum += digit;

            // Multiply the digit with the product.
            digit_product *= digit;

            // Remove the last digit from n by integer division.
            n /= 10;
        }

        // Calculate the total divisor by summing the digit sum and digit product.
        int total_divisor = digit_sum + digit_product;

        // Check if the original number is divisible by the total divisor.
        // We also need to ensure that the total_divisor is not zero to avoid division by zero.
        // If total_divisor is zero, it means either digit_sum and digit_product are both zero,
        // which only happens if n was initially 0 (already handled).
        // For positive n, digit_sum will always be >= 1, so total_divisor will be >= 1.
        if (total_divisor == 0) {
            // This case should not be reachable given the constraint n >= 1.
            // If it were reachable, and original_n was also 0, it would be true.
            // If original_n was not 0, it would be false.
            return original_n == 0;
        }

        // Return true if original_n is perfectly divisible by total_divisor, false otherwise.
        return original_n % total_divisor == 0;
    }
};

// int main() {
//     Solution sol;
//     std::cout << "Input: 99, Output: " << std::boolalpha << sol.checkDivisibility(99) << std::endl; // Expected: true
//     std::cout << "Input: 23, Output: " << std::boolalpha << sol.checkDivisibility(23) << std::endl; // Expected: false
//     std::cout << "Input: 10, Output: " << std::boolalpha << sol.checkDivisibility(10) << std::endl; // Sum=1, Prod=0, Total=1. 10%1 == 0. Expected: true
//     std::cout << "Input: 1, Output: " << std::boolalpha << sol.checkDivisibility(1) << std::endl;   // Sum=1, Prod=1, Total=2. 1%2 != 0. Expected: false
//     std::cout << "Input: 12, Output: " << std::boolalpha << sol.checkDivisibility(12) << std::endl; // Sum=3, Prod=2, Total=5. 12%5 != 0. Expected: false
//     std::cout << "Input: 100, Output: " << std::boolalpha << sol.checkDivisibility(100) << std::endl; // Sum=1, Prod=0, Total=1. 100%1 == 0. Expected: true
//     return 0;
// }
```