```cpp
/*
Problem: Smallest Index With Digit Sum Equal to Index
Link: https://leetcode.com/problems/smallest-index-with-digit-sum-equal-to-index/

Approach:
Iterate through the input array `nums` from left to right. For each element `nums[i]` at index `i`:
1. Calculate the sum of the digits of `nums[i]`.
2. Compare this digit sum with the current index `i`.
3. If the digit sum is equal to `i`, return `i` immediately as we are looking for the smallest such index.
If the loop completes without finding any such index, return -1.

The function to calculate the digit sum will take an integer, repeatedly take its last digit using the modulo operator (`% 10`), add it to a running sum, and then remove the last digit by integer division (`/ 10`) until the number becomes 0.

Time Complexity:
O(N * log(M)), where N is the length of the array `nums` and M is the maximum value of an element in `nums`.
The outer loop iterates N times. For each element, we calculate the digit sum. The number of digits in an integer `x` is approximately `log10(x)`. So, calculating the digit sum takes O(log(M)) time.

Space Complexity:
O(1). We only use a few extra variables to store the digit sum and loop counters, which do not depend on the input size.
*/

#include <vector>
#include <numeric> // Not strictly necessary for this problem, but useful for other array operations.

class Solution {
public:
    // Helper function to calculate the sum of digits of a non-negative integer.
    int sumOfDigits(int n) {
        int sum = 0;
        // Loop continues as long as n is greater than 0.
        while (n > 0) {
            // Get the last digit of n using the modulo operator.
            sum += n % 10;
            // Remove the last digit from n using integer division.
            n /= 10;
        }
        // Return the calculated sum of digits.
        return sum;
    }

    int smallestEqual(std::vector<int>& nums) {
        // Iterate through the array using an index-based for loop.
        // i represents the current index.
        for (int i = 0; i < nums.size(); ++i) {
            // Calculate the sum of digits for the element at the current index nums[i].
            int digitSum = sumOfDigits(nums[i]);
            // Check if the sum of digits is equal to the current index i.
            if (digitSum == i) {
                // If they are equal, we've found the smallest such index, so return it.
                return i;
            }
        }
        // If the loop finishes without finding any index that satisfies the condition,
        // return -1 to indicate that no such index exists.
        return -1;
    }
};
```