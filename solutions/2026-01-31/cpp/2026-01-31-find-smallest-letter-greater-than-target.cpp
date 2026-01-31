// Find the smallest character in a sorted array that is lexicographically greater than a target character.
// If no such character exists, return the first character of the array.
//
// Problem Link: https://leetcode.com/problems/find-smallest-letter-greater-than-target/
//
// Approach:
// The problem states that the input array `letters` is sorted in non-decreasing order.
// This suggests that binary search is an appropriate algorithm to efficiently find the target character.
// We will perform a binary search to find the smallest element in `letters` that is strictly greater than `target`.
//
// The binary search will maintain two pointers, `low` and `high`, representing the current search range.
// In each iteration, we calculate the `mid` index.
// - If `letters[mid]` is less than or equal to `target`, it means the smallest character greater than `target`
//   (if it exists) must be in the right half of the current range. So, we update `low = mid + 1`.
// - If `letters[mid]` is greater than `target`, it means `letters[mid]` is a potential candidate for the
//   smallest character greater than `target`. We store this potential answer and try to find an even smaller
//   character in the left half by updating `high = mid - 1`.
//
// After the binary search loop terminates, if we found a candidate character, we return it.
// If no character greater than `target` was found (i.e., `low` points beyond the array bounds, or the loop
// finished without finding a character strictly greater than target), it means all characters are less than or equal to `target`.
// In this scenario, according to the problem statement, we should wrap around and return the first character of the array.
// The condition `low == letters.size()` after the loop precisely indicates this wrap-around case.
//
// Time Complexity: O(log n), where n is the number of characters in `letters`. This is because binary search
// halves the search space in each step.
// Space Complexity: O(1), as we are only using a few variables to keep track of the search pointers and the result.

#include <vector>
#include <string>
#include <iostream>

class Solution {
public:
    char nextGreatestLetter(std::vector<char>& letters, char target) {
        int n = letters.size();
        int low = 0;
        int high = n - 1;
        char result = letters[0]; // Default result if no character greater than target is found.

        // Binary search to find the smallest character strictly greater than target.
        while (low <= high) {
            int mid = low + (high - low) / 2; // Prevent potential integer overflow

            if (letters[mid] <= target) {
                // If the middle character is less than or equal to target,
                // the next greatest letter must be in the right half.
                low = mid + 1;
            } else {
                // If the middle character is greater than target,
                // it's a potential candidate for the smallest greater letter.
                // We store it and try to find an even smaller one in the left half.
                result = letters[mid]; // Update potential result
                high = mid - 1;
            }
        }

        // If `low` is equal to `n`, it means we have iterated through the entire array
        // and did not find any character strictly greater than `target`.
        // In this case, we wrap around and return the first character of the array.
        // Otherwise, `result` already holds the smallest character greater than `target`.
        if (low == n) {
            return letters[0];
        }
        return result;
    }
};

// Example of how to use the Solution class
// int main() {
//     Solution sol;
//     std::vector<char> letters1 = {'c', 'f', 'j'};
//     char target1 = 'a';
//     std::cout << "Example 1: " << sol.nextGreatestLetter(letters1, target1) << std::endl; // Output: c

//     std::vector<char> letters2 = {'c', 'f', 'j'};
//     char target2 = 'c';
//     std::cout << "Example 2: " << sol.nextGreatestLetter(letters2, target2) << std::endl; // Output: f

//     std::vector<char> letters3 = {'x', 'x', 'y', 'y'};
//     char target3 = 'z';
//     std::cout << "Example 3: " << sol.nextGreatestLetter(letters3, target3) << std::endl; // Output: x

//     std::vector<char> letters4 = {'a', 'b'};
//     char target4 = 'z';
//     std::cout << "Example 4: " << sol.nextGreatestLetter(letters4, target4) << std::endl; // Output: a

//     return 0;
// }
```