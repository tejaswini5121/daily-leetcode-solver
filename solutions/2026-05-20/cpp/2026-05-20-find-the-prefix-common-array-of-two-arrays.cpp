// Problem: Find the Prefix Common Array of Two Arrays
// Link: https://leetcode.com/problems/find-the-prefix-common-array-of-two-arrays/
//
// Approach:
// We can iterate through the arrays A and B from index 0 to n-1. For each index i,
// we need to count how many numbers from A[0...i] are also present in B[0...i].
// To efficiently check for the presence of numbers in the prefixes, we can use hash sets
// (or boolean arrays since the numbers are within a small range 1 to n).
//
// For each index `i`:
// 1. Maintain two hash sets: `setA` for elements in A[0...i] and `setB` for elements in B[0...i].
// 2. Add A[i] to `setA` and B[i] to `setB`.
// 3. Iterate through `setA` and for each element, check if it exists in `setB`.
//    The count of such elements will be `C[i]`.
//
// A more optimized approach:
// Instead of re-iterating through the sets at each step, we can maintain a global count of common elements.
// For each index `i`:
// 1. Add `A[i]` to a set `seenA`.
// 2. Add `B[i]` to a set `seenB`.
// 3. Check if `A[i]` is present in `seenB`. If it is, increment the `currentCommonCount`.
// 4. Check if `B[i]` is present in `seenA`. If it is, increment the `currentCommonCount`.
// 5. **Correction**: The above logic is slightly flawed. If `A[i] == B[i]`, we would count it twice.
//    A better approach is to use a single set of all numbers seen so far in A and a single set for B.
//    Then, for each index `i`, we check how many elements in A[0...i] are also in B[0...i].
//
// Let's refine the approach using boolean arrays for presence tracking since n <= 50.
// We can use two boolean arrays, `seenA` and `seenB`, of size n+1.
//
// For each index `i` from 0 to n-1:
// 1. Mark `seenA[A[i]] = true` and `seenB[B[i]] = true`.
// 2. Initialize a counter `commonCount = 0`.
// 3. Iterate from `k = 1` to `n`. If `seenA[k]` is true AND `seenB[k]` is true, increment `commonCount`.
// 4. Store `commonCount` in `C[i]`.
//
// Time Complexity:
// The outer loop runs n times (for each index i). Inside the loop, we iterate from 1 to n to count common elements.
// Therefore, the time complexity is O(n * n) = O(n^2).
//
// Space Complexity:
// We use two boolean arrays of size n+1 and the result array C of size n.
// Therefore, the space complexity is O(n).
//
// Given n <= 50, O(n^2) time and O(n) space are well within limits.

#include <vector>
#include <numeric>

class Solution {
public:
    std::vector<int> findPrefixCommonArray(std::vector<int>& A, std::vector<int>& B) {
        int n = A.size();
        std::vector<int> C(n); // The prefix common array to store results

        // Boolean arrays to keep track of seen numbers in A and B prefixes.
        // Size n+1 because numbers are from 1 to n. Index 0 will be unused.
        std::vector<bool> seenA(n + 1, false);
        std::vector<bool> seenB(n + 1, false);

        // Iterate through the arrays to build the prefix common array.
        for (int i = 0; i < n; ++i) {
            // Mark the current elements as seen in their respective arrays.
            seenA[A[i]] = true;
            seenB[B[i]] = true;

            int currentCommonCount = 0; // Counter for common elements up to index i

            // Iterate through all possible numbers (1 to n) to check for common presence.
            for (int num = 1; num <= n; ++num) {
                // If a number is seen in both A's prefix and B's prefix, it's common.
                if (seenA[num] && seenB[num]) {
                    currentCommonCount++;
                }
            }
            // Store the count of common elements for the current prefix.
            C[i] = currentCommonCount;
        }

        return C; // Return the computed prefix common array.
    }
};
```