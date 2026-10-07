// Problem: Remove Invalid Parentheses
// Link: https://leetcode.com/problems/remove-invalid-parentheses/
//
// Approach:
// This problem can be solved using Breadth-First Search (BFS). The idea is to explore all possible valid strings by removing parentheses, starting with the original string and progressively removing one parenthesis at a time.
//
// 1. Calculate the minimum number of left and right parentheses to remove.
//    Iterate through the string to count the balance of parentheses.
//    If '(', increment left_remove.
//    If ')', and balance > 0, decrement balance.
//    If ')', and balance == 0, increment right_remove.
//
// 2. Perform BFS.
//    Use a queue to store strings to be processed.
//    Use a set to keep track of visited strings to avoid redundant computations and ensure uniqueness of results.
//    Start BFS with the original string in the queue.
//
// 3. In each BFS level:
//    Dequeue a string.
//    Check if it's a valid string with the minimum removals (i.e., left_remove == 0 and right_remove == 0 for that string's balance).
//    If valid, add it to the result list.
//    If not valid and we haven't reached the minimum removals yet:
//        Generate all possible next strings by removing one parenthesis at a time from the current string.
//        For each generated string:
//            If it hasn't been visited, add it to the queue and the visited set.
//
// 4. A helper function `is_valid` is used to check if a string has a balanced number of parentheses.
//
// Time Complexity:
// In the worst case, we might explore many invalid strings. The number of parentheses to remove can be up to `n`. For each removal, we generate `n` new strings. The number of valid strings could be exponential in the worst case. However, due to the constraint of removing the *minimum* number of parentheses, the BFS approach prunes the search space effectively.
// The `is_valid` check takes O(N) time.
// The total time complexity is difficult to pinpoint precisely but is bounded by O(N * 2^N) in a naive exploration. However, with the BFS approach and focusing on minimum removals, it's significantly better in practice. A more precise analysis is complex, but it's related to the number of valid subsequences and the cost of generating them. Given N <= 25, this BFS approach is feasible.
//
// Space Complexity:
// The space complexity is dominated by the queue and the set used for BFS. In the worst case, the queue and set can store a significant number of strings. Each string can be up to length N. Thus, the space complexity can be O(N * 2^N) in the absolute worst theoretical scenario, but practically it's more constrained by the number of reachable valid states.
//
//
// Constraints: 1 <= s.length <= 25. This constraint suggests that an exponential time complexity might be acceptable if the base of the exponent is small or the depth of the recursion/BFS is limited.
//
// This BFS approach guarantees finding all unique valid strings with the minimum number of removals.
//
#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <unordered_set>
#include <algorithm>

class Solution {
public:
    // Helper function to check if a string has valid parentheses
    bool is_valid(const std::string& s) {
        int balance = 0;
        for (char c : s) {
            if (c == '(') {
                balance++;
            } else if (c == ')') {
                balance--;
            }
            if (balance < 0) {
                return false; // More closing than opening parentheses at some point
            }
        }
        return balance == 0; // Must have equal numbers of opening and closing parentheses
    }

    // Main function to remove invalid parentheses
    std::vector<std::string> removeInvalidParentheses(std::string s) {
        std::vector<std::string> result;
        if (s.empty()) {
            result.push_back("");
            return result;
        }

        std::queue<std::string> q;
        std::unordered_set<std::string> visited;

        q.push(s);
        visited.insert(s);

        bool found_valid = false; // Flag to indicate if we've found any valid strings at the current level

        while (!q.empty()) {
            std::string current_s = q.front();
            q.pop();

            // If the current string is valid, add it to the result
            if (is_valid(current_s)) {
                result.push_back(current_s);
                found_valid = true; // Mark that we found a valid string
            }

            // If we have already found valid strings at this level, we don't need to explore further removals
            // because we are looking for the MINIMUM number of removals. Any further removals would be more than minimum.
            if (found_valid) {
                continue;
            }

            // If the current string is not valid, generate next possible strings by removing one parenthesis
            for (int i = 0; i < current_s.length(); ++i) {
                // Only consider removing parentheses
                if (current_s[i] == '(' || current_s[i] == ')') {
                    // Create a new string by removing the character at index i
                    std::string next_s = current_s.substr(0, i) + current_s.substr(i + 1);

                    // If this new string hasn't been visited, add it to the queue and visited set
                    if (visited.find(next_s) == visited.end()) {
                        q.push(next_s);
                        visited.insert(next_s);
                    }
                }
            }
        }

        // If no valid string was found (e.g., input was ")("), the BFS might finish without finding any.
        // In such cases, an empty string is the only valid result.
        if (result.empty()) {
            result.push_back("");
        }

        return result;
    }
};
```