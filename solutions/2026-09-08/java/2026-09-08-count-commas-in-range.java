// Problem Summary:
// This problem asks us to count the total number of commas used when writing all integers from 1 to a given integer n,
// formatted according to standard rules: a comma is inserted after every three digits from the right, and numbers
// with fewer than 4 digits contain no commas. The input n is constrained such that 1 <= n <= 10^5.

// Link: https://leetcode.com/problems/count-commas-in-range/

// Approach Explanation:
// The key to solving this problem efficiently is to understand how the number of commas scales with the magnitude
// of the integer, given the constraint n <= 10^5.
//
// 1. Numbers with 0 commas:
//    According to standard formatting rules, numbers with fewer than 4 digits contain no commas. This means
//    integers from 1 to 999 (inclusive) will have 0 commas.
//
// 2. Numbers with 1 comma:
//    Numbers that are 4, 5, or 6 digits long will have exactly one comma.
//    For example:
//    - "1,000" (4 digits) has 1 comma.
//    - "10,000" (5 digits) has 1 comma.
//    - "100,000" (6 digits) has 1 comma.
//    This range covers numbers from 1,000 up to 999,999.
//
// 3. Numbers with 2 or more commas:
//    Numbers with 7 or more digits will have two or more commas.
//    For example:
//    - "1,000,000" (7 digits) has 2 commas.
//
// Given the constraint that n <= 10^5 (which is 100,000), the largest number we will consider is 100,000.
// This means no number in the range [1, n] will ever have more than one comma.
// Specifically:
// - All numbers from 1 to 999 have 0 commas.
// - All numbers from 1,000 up to n (if n >= 1,000) have 1 comma.
//
// Therefore, the total number of commas is simply the count of numbers in the range [1, n] that are
// greater than or equal to 1,000. This count is `n - 1000 + 1` if `n >= 1000`, and `0` otherwise.

// Time Complexity: O(1)
// The solution involves a single conditional check and a simple arithmetic calculation. The number of
// operations is constant regardless of the input `n`.

// Space Complexity: O(1)
// The solution uses a fixed amount of memory to store a few variables, independent of the input `n`.
class Solution {
    public int countCommas(int n) {
        // Initialize total commas to 0.
        int totalCommas = 0;

        // Numbers less than 1000 (i.e., 1 to 999) have fewer than 4 digits
        // and thus contain no commas according to the problem statement.
        // If n itself is less than 1000, then all numbers from 1 to n will have
        // fewer than 4 digits, so no commas will be used in total.
        if (n < 1000) {
            return 0; // Return 0 if n is too small to have any comma-containing numbers.
        }

        // If n is 1000 or greater, numbers from 1000 up to n will contribute commas.
        // For the given constraint n <= 10^5, all numbers from 1000 up to n will be
        // 4, 5, or 6 digits long.
        // Examples:
        // - 1,000 (4 digits) has one comma.
        // - 10,000 (5 digits) has one comma.
        // - 100,000 (6 digits) has one comma.
        // According to the rule "A comma is inserted after every three digits from the right",
        // numbers with 4, 5, or 6 digits will always have exactly one comma.
        // For example, 100,000 is formatted as "100,000", which contains a single comma.
        // It does not have two commas (which would require 7+ digits like "1,000,000").
        
        // Therefore, we just need to count how many numbers are in the range [1000, n].
        // Each of these numbers contributes exactly 1 comma to the total sum.
        // The count of numbers from 1000 to n (inclusive) is calculated as (n - 1000 + 1).
        totalCommas = n - 1000 + 1;

        // Return the calculated total number of commas.
        return totalCommas;
    }
}