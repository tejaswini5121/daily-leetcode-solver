```cpp
// Given a binary string s and an integer k, find the shortest and lexicographically smallest beautiful substring.
// A beautiful substring contains exactly k ones.
// Link: https://leetcode.com/problems/shortest-and-lexicographically-smallest-beautiful-string/
//
// Approach:
// The problem asks for the shortest and then the lexicographically smallest beautiful substring.
// We can iterate through all possible starting positions of a substring and for each starting position,
// expand the substring to the right until it contains exactly k ones.
// This will give us all beautiful substrings.
// We need to keep track of the shortest length found so far and the lexicographically smallest substring
// of that shortest length.
//
// A sliding window approach can be used to efficiently find beautiful substrings.
// We can maintain a window [left, right] and count the number of ones within it.
// When the count of ones equals k, we have a beautiful substring.
// We then compare its length with the current minimum length and update if it's shorter.
// If the length is the same, we compare lexicographically and update if it's smaller.
//
// To handle the lexicographical comparison efficiently, we can iterate through possible
// starting points. For each starting point 'i', we expand a window to the right.
// We count the number of '1's. Once we have 'k' ones, we check the length of this substring.
// If it's the shortest so far, we update our answer. If it's the same length, we compare lexicographically.
//
// Let's refine the sliding window.
// We can iterate through all possible left boundaries of a substring.
// For each left boundary, we expand the right boundary until we find 'k' ones.
// This will give us candidate beautiful substrings.
// We need to find the minimum length first, and then the lexicographically smallest among those.
//
// An alternative approach:
// Iterate through all possible lengths, starting from k up to s.length().
// For each length, iterate through all substrings of that length.
// If a substring is beautiful, it's a candidate. The first beautiful substring found
// for the smallest length will be the answer.
// This might be simpler to implement.
//
// Let's consider the constraints: s.length() <= 100. This suggests that O(N^3) or O(N^2) solutions are acceptable.
//
// A more optimized approach:
// Iterate through all possible right endpoints of a beautiful substring.
// For each right endpoint `j`, we want to find the leftmost `i` such that `s[i...j]` has `k` ones.
// This can be done by keeping track of the indices of '1's.
// If `s[j]` is '1', we record its index. If we have at least `k` ones ending at `j`,
// the `(k-1)`-th '1' from the right (inclusive of `s[j]`) will be at some index `p`.
// The substring `s[p...j]` will have exactly `k` ones.
//
// Let's use a vector to store the indices of '1's.
// Iterate through the string `s`.
// Maintain a list of indices where `s[i] == '1'`.
// When the list of '1' indices has at least `k` elements:
//   The index of the `(count - k)`-th '1' will be the start of a beautiful substring.
//   Let `ones_indices` be the list of indices of '1's.
//   If `ones_indices.size() >= k`:
//     The start index of the candidate beautiful substring is `ones_indices[ones_indices.size() - k]`.
//     The end index is the current index `i`.
//     The substring is `s.substr(start_index, i - start_index + 1)`.
//     We compare its length and lexicographical order with the current best.
//
// Example: s = "100011001", k = 3
// ones_indices = []
// i = 0, s[0] = '1': ones_indices = [0]
// i = 1, s[1] = '0':
// i = 2, s[2] = '0':
// i = 3, s[3] = '0':
// i = 4, s[4] = '1': ones_indices = [0, 4]
// i = 5, s[5] = '1': ones_indices = [0, 4, 5]. size = 3. k = 3.
//   start_index = ones_indices[3 - 3] = ones_indices[0] = 0.
//   end_index = 5. Substring = s.substr(0, 6) = "100011". Ones = 3. Length = 6.
//   Current best: length = 6, substring = "100011".
// i = 6, s[6] = '0':
// i = 7, s[7] = '0':
// i = 8, s[8] = '1': ones_indices = [0, 4, 5, 8]. size = 4. k = 3.
//   start_index = ones_indices[4 - 3] = ones_indices[1] = 4.
//   end_index = 8. Substring = s.substr(4, 5) = "11001". Ones = 3. Length = 5.
//   New shortest length. Current best: length = 5, substring = "11001".
//
// This approach correctly finds the length and lexicographically smallest substring.
// We iterate through the string once. Storing '1' indices is O(N). Substring extraction and comparison is O(N) in worst case.
// Total time complexity: O(N) for string traversal. Inside the loop, substring operations might take O(N).
// However, the substring length is limited. Let's analyze carefully.
// When we have `k` ones, the substring length is `current_index - ones_indices[ones_indices.size() - k] + 1`.
// The comparison of substrings can take up to O(length of substring). The maximum length is N.
// So it might be O(N^2) in the worst case if we have many beautiful substrings of similar lengths to compare.
//
// Given N <= 100, O(N^2) is fine.
//
// Time Complexity: O(N^2) in the worst case. We iterate through the string once (O(N)).
// Inside the loop, when we find a beautiful substring, we extract it (O(length)) and compare
// it with the current best (O(length)). The length of the substring can be up to N.
// Thus, it's O(N * N) = O(N^2).
//
// Space Complexity: O(N) for storing the indices of '1's in the `ones_indices` vector.
// In the worst case, all characters are '1', so the vector can store up to N indices.
//
// Let's consider the definition of lexicographically smallest carefully.
// "Return the lexicographically smallest beautiful substring of string s with length equal to len."
// This means we first find the minimum `len`. Then among all beautiful substrings of length `len`, we find the smallest lexicographically.
//
// The approach above directly finds the shortest beautiful substring first, and then it implicitly compares lexicographically.
// If a new beautiful substring is found:
// 1. If its length is less than `min_len`, update `min_len` and `result_str`.
// 2. If its length is equal to `min_len`, compare lexicographically with `result_str` and update if smaller.
//
// This seems to directly fulfill the requirements.
//
// Let's trace "1011", k = 2
// ones_indices = []
// i = 0, s[0] = '1': ones_indices = [0]
// i = 1, s[1] = '0':
// i = 2, s[2] = '1': ones_indices = [0, 2]. size = 2. k = 2.
//   start_index = ones_indices[2 - 2] = ones_indices[0] = 0.
//   end_index = 2. Substring = s.substr(0, 3) = "101". Ones = 2. Length = 3.
//   min_len = 3, result_str = "101".
// i = 3, s[3] = '1': ones_indices = [0, 2, 3]. size = 3. k = 2.
//   start_index = ones_indices[3 - 2] = ones_indices[1] = 2.
//   end_index = 3. Substring = s.substr(2, 2) = "11". Ones = 2. Length = 2.
//   New shortest length. min_len = 2, result_str = "11".
// Final result: "11". This matches example 2.
//
// Let's consider the initial state of `min_len` and `result_str`.
// `min_len` should be initialized to a value larger than any possible length, e.g., `s.length() + 1`.
// `result_str` can be initialized to an empty string.
//
// Edge case: If no beautiful substring is found, `result_str` remains empty.
// This happens if `ones_indices.size()` never reaches `k`.

class Solution {
public:
    std::string shortestBeautifulSubstring(std::string s, int k) {
        std::vector<int> ones_indices; // Stores indices of '1's in s
        int n = s.length();
        int min_len = n + 1; // Initialize minimum length to a value larger than any possible length
        std::string result_str = ""; // Initialize result string to empty

        // Iterate through the string to find beautiful substrings
        for (int i = 0; i < n; ++i) {
            if (s[i] == '1') {
                ones_indices.push_back(i); // Add the index of '1' to the list
            }

            // Check if we have at least k ones encountered so far
            if (ones_indices.size() >= k) {
                // The start index of the beautiful substring is the index of the (k-1)-th '1' from the right
                // which is ones_indices[ones_indices.size() - k]
                int start_index = ones_indices[ones_indices.size() - k];
                // The current index 'i' is the end index of the beautiful substring
                int current_len = i - start_index + 1; // Calculate the length of the beautiful substring

                // If this is the shortest beautiful substring found so far
                if (current_len < min_len) {
                    min_len = current_len;
                    result_str = s.substr(start_index, current_len);
                }
                // If this beautiful substring has the same length as the current shortest
                else if (current_len == min_len) {
                    // Compare lexicographically and update if the current one is smaller
                    std::string current_substring = s.substr(start_index, current_len);
                    if (current_substring < result_str) {
                        result_str = current_substring;
                    }
                }
            }
        }

        // If min_len is still n + 1, it means no beautiful substring was found
        // In this case, result_str will be its initial empty value, which is correct.
        return result_str;
    }
};
```