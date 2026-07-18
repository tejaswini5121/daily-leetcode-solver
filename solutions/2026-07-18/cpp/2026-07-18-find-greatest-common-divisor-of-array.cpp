// Problem: Find Greatest Common Divisor of Array
// LeetCode Link: https://leetcode.com/problems/find-greatest-common-divisor-of-array/
//
// Approach:
// The problem asks for the greatest common divisor (GCD) of the smallest and largest numbers in a given array.
// 1. Find the minimum and maximum elements in the input array `nums`.
// 2. Implement a GCD function (e.g., using the Euclidean algorithm) that takes two integers and returns their greatest common divisor.
// 3. Call the GCD function with the minimum and maximum elements found in step 1.
//
// Euclidean Algorithm for GCD:
// gcd(a, b):
//   if b is 0, return a
//   otherwise, return gcd(b, a % b)
//
// Time Complexity:
// - Finding min/max: O(n), where n is the length of the array.
// - GCD calculation: O(log(min(a, b))), where a and b are the min and max numbers. Since nums[i] <= 1000, this is effectively O(log(1000)) which is a small constant.
// Overall: O(n) due to finding min/max.
//
// Space Complexity:
// - O(1), as we only use a few variables to store min, max, and intermediate GCD values.

#include <iostream>
#include <vector>
#include <algorithm> // For std::min_element and std::max_element
#include <numeric>   // For std::gcd in C++17 and later, but implementing manually for broader compatibility

class Solution {
public:
    // Function to calculate the Greatest Common Divisor (GCD) of two numbers
    // using the Euclidean algorithm.
    int calculateGCD(int a, int b) {
        // The Euclidean algorithm repeatedly applies the division algorithm
        // until the remainder is 0. The GCD is the last non-zero remainder.
        while (b != 0) {
            int temp = b; // Store the current value of b
            b = a % b;    // Update b to be the remainder of a divided by b
            a = temp;     // Update a to be the previous value of b
        }
        // When b becomes 0, a holds the GCD.
        return a;
    }

    // Main function to find the GCD of the smallest and largest numbers in an array.
    int findGCD(std::vector<int>& nums) {
        // Find the smallest element in the array.
        // std::min_element returns an iterator to the smallest element.
        // Dereferencing it gives the value of the smallest element.
        int minNum = *std::min_element(nums.begin(), nums.end());

        // Find the largest element in the array.
        // std::max_element returns an iterator to the largest element.
        // Dereferencing it gives the value of the largest element.
        int maxNum = *std::max_element(nums.begin(), nums.end());

        // Calculate and return the GCD of the minimum and maximum numbers found.
        return calculateGCD(minNum, maxNum);
    }
};

// Main function for testing purposes.
int main() {
    Solution sol; // Create an instance of the Solution class

    // Example 1
    std::vector<int> nums1 = {2, 5, 6, 9, 10};
    int result1 = sol.findGCD(nums1);
    std::cout << "Input: [2, 5, 6, 9, 10]" << std::endl;
    std::cout << "Output: " << result1 << std::endl; // Expected output: 2

    // Example 2
    std::vector<int> nums2 = {7, 5, 6, 8, 3};
    int result2 = sol.findGCD(nums2);
    std::cout << "Input: [7, 5, 6, 8, 3]" << std::endl;
    std::cout << "Output: " << result2 << std::endl; // Expected output: 1

    // Example 3
    std::vector<int> nums3 = {3, 3};
    int result3 = sol.findGCD(nums3);
    std::cout << "Input: [3, 3]" << std::endl;
    std::cout << "Output: " << result3 << std::endl; // Expected output: 3

    // Additional test case
    std::vector<int> nums4 = {10, 20, 5, 15};
    int result4 = sol.findGCD(nums4);
    std::cout << "Input: [10, 20, 5, 15]" << std::endl;
    std::cout << "Output: " << result4 << std::endl; // Expected output: 5 (min=5, max=20, gcd(5,20)=5)

    return 0; // Indicate successful execution
}
```