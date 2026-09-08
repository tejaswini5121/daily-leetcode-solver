// Problem Summary:
// This problem asks us to calculate the total number of commas used when writing all integers from 1 to n (inclusive)
// in standard number formatting. A comma is inserted after every three digits from the right, and numbers with fewer than 4 digits have no commas.
//
// Problem Link:
// https://leetcode.com/problems/count-commas-in-range/
//
// Approach Explanation:
// The key to solving this problem efficiently for the given constraint (n <= 10^5) is to observe how many commas each number can have.
//
// According to standard number formatting:
// - Numbers from 1 to 999 (fewer than 4 digits) have 0 commas.
// - Numbers from 1,000 to 999,999 have 1 comma. (e.g., 1,000, 10,000, 999,999)
// - Numbers from 1,000,000 to 999,999,999 have 2 commas. (e.g., 1,000,000)
// And so on.
//
// Given the constraint `1 <= n <= 10^5` (i.e., n can be at most 100,000):
// - Any number `k` such that `1 <= k <= 999` will have 0 commas.
// - Any number `k` such that `1,000 <= k <= 100,000` will have exactly 1 comma. (e.g., 1,000, 100,000).
//
// Therefore, we only need to count how many numbers in the range [1, n] fall into the category of having 1 comma.
// Numbers in the range [1, n] that have 0 commas do not contribute to the total count.
// Numbers in the range [1, n] that have 1 comma each contribute 1 to the total count.
//
// The numbers that contribute 1 comma are those from 1,000 up to n.
// - If `n < 1,000`, then no number in the range [1, n] will have any commas. The total count is 0.
// - If `n >= 1,000`, then all numbers from `1,000` to `n` (inclusive) will have one comma each. The count of such numbers is `n - 1,000 + 1`.
//
// We can combine these two cases using `max(0, n - 1000 + 1)`.
// This formula correctly yields 0 if `n < 1000` (e.g., for n=998, `998 - 1000 + 1 = -1`, `max(0, -1) = 0`).
// And it yields the correct count if `n >= 1000` (e.g., for n=1002, `1002 - 1000 + 1 = 3`, `max(0, 3) = 3`).
//
// Time Complexity: O(1)
// The solution involves a single arithmetic calculation, which takes constant time.
//
// Space Complexity: O(1)
// No additional data structures are used, only a few variables for computation.

#include <algorithm> // Required for std::max

class Solution {
public:
    int countCommas(int n) {
        // According to the problem constraints (1 <= n <= 10^5) and formatting rules:
        // 1. Numbers from 1 to 999 have 0 commas.
        // 2. Numbers from 1,000 to 100,000 have 1 comma each.
        //
        // We need to count the total commas from 1 to n.
        // Only numbers starting from 1,000 contribute commas.
        // Each number from 1,000 up to n contributes exactly one comma.

        // If n is less than 1,000, no number in the range [1, n] will have any commas.
        if (n < 1000) {
            return 0;
        }

        // If n is 1,000 or greater, numbers from 1,000 to n (inclusive)
        // will each have exactly one comma.
        // The count of such numbers is (n - 1000 + 1).
        // For example, if n = 1002:
        // Numbers are 1000, 1001, 1002.
        // Count = 1002 - 1000 + 1 = 3.
        return n - 1000 + 1;

        // Alternative concise expression using std::max, which covers both cases:
        // return std::max(0, n - 1000 + 1);
        // This is equivalent to the if-else logic above.
    }
};