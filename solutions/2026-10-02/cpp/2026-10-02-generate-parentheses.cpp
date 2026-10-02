// Problem: Generate Parentheses
// Difficulty: Medium
// Topics: String, Dynamic Programming, Backtracking, Bracket Sequences
// Link: https://leetcode.com/problems/generate-parentheses/
//
// Problem Summary:
// Given an integer n, generate all combinations of n pairs of parentheses
// that are well-formed.
//
// Approach:
// We can use a recursive backtracking approach to generate all valid combinations.
// We maintain the count of open and close parentheses used so far.
// At each step, we have two choices:
// 1. Add an open parenthesis '(': This is allowed if we still have open parentheses
//    available to use (i.e., `open_count < n`).
// 2. Add a close parenthesis ')': This is allowed if we have more open parentheses
//    already placed than close parentheses (i.e., `close_count < open_count`).
//
// The base case for the recursion is when the length of the current string
// equals `2 * n`, meaning we have used all `n` pairs of parentheses. At this point,
// we add the generated string to our result list.
//
// Time Complexity:
// The number of valid combinations of n pairs of parentheses is given by the
// n-th Catalan number, which is approximately O(4^n / n^(3/2)).
// For each valid combination, we construct a string of length 2n.
// Therefore, the overall time complexity is roughly O(4^n / sqrt(n)).
//
// Space Complexity:
// The space complexity is dominated by the storage of the generated valid
// combinations and the recursion stack depth.
// The number of valid combinations is O(4^n / n^(3/2)). Each string has length O(n).
// The maximum recursion depth is O(n).
// Thus, the space complexity is O(n * 4^n / n^(3/2)) for storing results, and O(n)
// for the recursion stack. The dominant factor is the result storage.
//
#include <vector>
#include <string>
#include <iostream>
#include <functional> // Required for std::function

class Solution {
public:
    /**
     * @brief Generates all combinations of well-formed parentheses.
     * @param n The number of pairs of parentheses.
     * @return A vector of strings, each representing a well-formed combination.
     */
    std::vector<std::string> generateParenthesis(int n) {
        std::vector<std::string> result; // Stores all valid combinations
        std::string current_combination; // Stores the current string being built

        // Helper function for backtracking
        // open_count: number of open parentheses used so far
        // close_count: number of close parentheses used so far
        std::function<void(int, int)> backtrack =
            [&](int open_count, int close_count) {
            // Base case: If the current combination has reached the desired length (2*n)
            if (current_combination.length() == 2 * n) {
                result.push_back(current_combination); // Add the valid combination to the result
                return; // Stop this recursive path
            }

            // Recursive step 1: Try adding an open parenthesis '('
            // We can add an open parenthesis if we haven't used all `n` open parentheses yet.
            if (open_count < n) {
                current_combination.push_back('('); // Add '(' to the current combination
                backtrack(open_count + 1, close_count); // Recurse with an incremented open_count
                current_combination.pop_back(); // Backtrack: remove '(' to explore other possibilities
            }

            // Recursive step 2: Try adding a close parenthesis ')'
            // We can add a close parenthesis if the number of close parentheses used
            // is less than the number of open parentheses used. This ensures well-formedness.
            if (close_count < open_count) {
                current_combination.push_back(')'); // Add ')' to the current combination
                backtrack(open_count, close_count + 1); // Recurse with an incremented close_count
                current_combination.pop_back(); // Backtrack: remove ')' to explore other possibilities
            }
        };

        // Start the backtracking process from an empty string with 0 open and 0 close parentheses
        backtrack(0, 0);

        return result; // Return the list of all generated well-formed parentheses combinations
    }
};

/*
// Example of how to run the code:
int main() {
    Solution sol;
    int n1 = 3;
    std::vector<std::string> output1 = sol.generateParenthesis(n1);
    std::cout << "Input: n = " << n1 << std::endl;
    std::cout << "Output: [";
    for (size_t i = 0; i < output1.size(); ++i) {
        std::cout << "\"" << output1[i] << "\"";
        if (i < output1.size() - 1) {
            std::cout << ",";
        }
    }
    std::cout << "]" << std::endl;

    int n2 = 1;
    std::vector<std::string> output2 = sol.generateParenthesis(n2);
    std::cout << "Input: n = " << n2 << std::endl;
    std::cout << "Output: [";
    for (size_t i = 0; i < output2.size(); ++i) {
        std::cout << "\"" << output2[i] << "\"";
        if (i < output2.size() - 1) {
            std::cout << ",";
        }
    }
    std::cout << "]" << std::endl;

    return 0;
}
*/
