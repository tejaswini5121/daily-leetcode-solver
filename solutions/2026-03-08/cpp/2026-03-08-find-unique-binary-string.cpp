// Problem: Find Unique Binary String
// Summary: Given a list of unique binary strings of length n, find a binary string of length n not present in the list.
// Link: https://leetcode.com/problems/find-unique-binary-string/
// Approach:
// We can use the property that there are 2^n possible binary strings of length n.
// Since the input array `nums` contains `n` unique binary strings, and `n` is at most 16,
// the total number of possible binary strings (2^n) is at most 2^16 = 65536, which is manageable.
// We can convert each binary string in `nums` to its integer representation.
// Then, we iterate through all possible integers from 0 to 2^n - 1.
// For each integer, we convert it back to its binary string representation of length `n`.
// If this generated binary string is not found in the set of existing binary strings (from `nums`),
// we return it as the unique binary string.
//
// To efficiently check for the presence of a binary string, we can store all binary strings from `nums`
// in a hash set (std::unordered_set<std::string> in C++).
//
// Alternatively, a more direct and elegant approach leverages Cantor's diagonalization argument.
// We can construct a unique binary string by taking the i-th character of the i-th string in `nums`
// and flipping it (0 becomes 1, 1 becomes 0).
// For example, if `nums = ["01", "10"]`:
// - For the 0-th string "01", we take the 0-th character '0' and flip it to '1'.
// - For the 1-st string "10", we take the 1-st character '0' and flip it to '1'.
// The resulting string is "11". This string is guaranteed to be different from all strings in `nums`
// because its i-th character differs from the i-th character of the i-th string in `nums`.
//
// Time Complexity:
// Using the diagonalization approach: O(n^2) to iterate through the strings and their characters.
// Using the set approach: O(n^2) to insert all strings into the set and O(n^2) in the worst case
// to generate and check for each potential unique string. Overall, O(n^2).
//
// Space Complexity:
// Using the diagonalization approach: O(n) to store the result string.
// Using the set approach: O(n^2) to store all strings in the hash set.
//
// We will implement the diagonalization approach for its efficiency and simplicity.

#include <vector>
#include <string>
#include <unordered_set>
#include <algorithm>

class Solution {
public:
    std::string findDifferentBinaryString(std::vector<std::string>& nums) {
        // n represents the length of each binary string and the number of strings in nums.
        int n = nums.size();
        // The result string will store the unique binary string we construct.
        std::string result = "";

        // Iterate through each position (index i) from 0 to n-1.
        for (int i = 0; i < n; ++i) {
            // For the i-th string in `nums` (which is `nums[i]`),
            // we consider its i-th character (`nums[i][i]`).
            // We flip this character to construct the i-th character of our result string.
            // If the character is '0', we append '1' to the result.
            // If the character is '1', we append '0' to the result.
            if (nums[i][i] == '0') {
                result += '1';
            } else {
                result += '0';
            }
        }

        // The constructed `result` string is guaranteed to be unique.
        // This is because for any string `nums[i]` in the input, the i-th character of `result`
        // is different from the i-th character of `nums[i]`.
        // Therefore, `result` cannot be equal to any string in `nums`.
        return result;
    }
};
