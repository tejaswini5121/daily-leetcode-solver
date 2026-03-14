```cpp
// LeetCode problem: The k-th Lexicographical String of All Happy Strings of Length n
// Link: https://leetcode.com/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/
//
// Problem Summary:
// Find the k-th lexicographically smallest "happy string" of length n.
// A happy string only contains 'a', 'b', 'c' and no adjacent characters are the same.
//
// Approach:
// This problem can be solved using a backtracking (Depth First Search) approach.
// We generate all happy strings of length n in lexicographical order.
// We maintain a count of the happy strings found. When the count reaches k,
// we have found our target string.
//
// The backtracking function will:
// 1. Take the current string being built and its length as parameters.
// 2. Base Case: If the current string's length equals n, we have formed a complete happy string.
//    Increment the global count of happy strings. If this count equals k, store the current
//    string as the result and set a flag to stop further exploration.
// 3. Recursive Step: For each character ('a', 'b', 'c'):
//    a. If the current string is empty or the current character is different from the last
//       character of the current string, append the character.
//    b. Recursively call the backtracking function with the updated string.
//    c. Backtrack: Remove the last appended character to explore other possibilities.
//
// To ensure lexicographical order, we iterate through characters 'a', 'b', 'c' in that order
// within the recursive step.
//
// We can optimize by pre-calculating the number of happy strings.
// For a string of length `len`, starting with a character `c`:
// - If `len == 1`, there are 3 possibilities ('a', 'b', 'c').
// - If `len > 1`, the first character has 3 choices. The second character has 2 choices (cannot be same as first).
//   The third character has 2 choices (cannot be same as second), and so on.
//   So, the total number of happy strings of length `n` is `3 * 2^(n-1)`.
//
// However, since `n` is small (up to 10) and `k` is also relatively small (up to 100),
// generating them directly via backtracking and stopping once we find the k-th is efficient enough.
//
// Time Complexity:
// In the worst case, we might explore all possible happy strings up to length n.
// The number of happy strings of length n is 3 * 2^(n-1). For n=10, this is 3 * 2^9 = 1536.
// For each string generated, we perform constant time operations (string append/pop, character comparison).
// Thus, the time complexity is approximately O(3 * 2^n), which is efficient given the constraints.
//
// Space Complexity:
// The space complexity is dominated by the recursion depth, which is `n` (the length of the string).
// We also store the current string being built, which takes O(n) space.
// Therefore, the space complexity is O(n).
//
class Solution {
private:
    int count; // Global counter for happy strings found
    std::string result; // Stores the k-th happy string
    int target_k; // The k value from input
    int target_n; // The n value from input

    // Backtracking function to generate happy strings
    void backtrack(std::string current_string) {
        // If we've already found the k-th string, stop exploring
        if (!result.empty()) {
            return;
        }

        // Base case: if the current string has reached the desired length n
        if (current_string.length() == target_n) {
            count++; // Increment the count of happy strings found
            // If this is the k-th string, store it as the result
            if (count == target_k) {
                result = current_string;
            }
            return; // Stop further recursion for this branch
        }

        // Recursive step: try appending 'a', 'b', or 'c'
        for (char c : {'a', 'b', 'c'}) {
            // Check if the current character can be appended:
            // 1. If the string is empty, any character can be appended.
            // 2. If the string is not empty, the current character must be different from the last character.
            if (current_string.empty() || current_string.back() != c) {
                // Append the character and recurse
                current_string.push_back(c);
                backtrack(current_string);
                // Backtrack: remove the character to explore other possibilities
                current_string.pop_back();
            }
        }
    }

public:
    // Main function to find the k-th happy string
    std::string getHappyString(int n, int k) {
        // Initialize global variables
        count = 0;
        result = "";
        target_k = k;
        target_n = n;

        // Start the backtracking process with an empty string
        backtrack("");

        // Return the found k-th happy string, or an empty string if k is out of bounds
        return result;
    }
};
```