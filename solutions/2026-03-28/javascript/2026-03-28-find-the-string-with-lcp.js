/**
 * @param {number[][]} lcp
 * @return {string}
 */
// Problem Summary: Reconstruct the lexicographically smallest string given its LCP matrix.
// Link: https://leetcode.com/problems/find-the-string-with-lcp/
// Approach:
// 1. The LCP matrix `lcp[i][j]` represents the length of the longest common prefix between the suffixes starting at indices `i` and `j`.
// 2. `lcp[i][i]` must be equal to `n - i`, as the suffix from `i` to `n-1` has length `n - i`. If this condition is not met for any `i`, return "".
// 3. For any `i` and `j`, `lcp[i][j]` must be equal to `lcp[j][i]` because the LCP of two suffixes is symmetric. If this condition is not met, return "".
// 4. The LCP values can be used to deduce relationships between characters at different positions. Specifically, if `lcp[i][j] = k` and `k > 0`, it implies that `word[i] == word[j]`, `word[i+1] == word[j+1]`, ..., `word[i+k-1] == word[j+k-1]`.
// 5. We can iterate through the string positions and try to assign the lexicographically smallest possible character ('a' through 'z') to each position.
// 6. For each position `i`, we try assigning characters starting from 'a'.
// 7. If we assign a character `c` to `word[i]`, we need to ensure this assignment is consistent with the LCP matrix. This means for any `j` where `lcp[i][j] > 0`, `word[j]` must also be assigned `c`. Also, if `lcp[i][j] = 0`, then `word[i]` must be different from `word[j]`.
// 8. We can use a Disjoint Set Union (DSU) data structure or a Union-Find approach to group indices that must have the same character.
// 9. For each `i` from 0 to `n-1`:
//    a. If `i` has already been assigned a character, continue.
//    b. Iterate through characters `c` from 'a' to 'z'.
//    c. Temporarily assign `c` to `word[i]`.
//    d. Check for consistency:
//       - For all `j` such that `lcp[i][j] > 0`: If `word[j]` is already determined and not equal to `c`, then `c` is not valid. If `word[j]` is not determined, we mark that `word[j]` must be `c`.
//       - For all `j` such that `lcp[i][j] == 0`: If `word[j]` is already determined and equal to `c`, then `c` is not valid.
//    e. If `c` is valid:
//       - Assign `c` to `word[i]`.
//       - Propagate this assignment to all `j` where `lcp[i][j] > 0` (meaning `word[j]` must also be `c`). Use DSU to merge `i` and `j` into the same set.
//       - Break the inner character loop and move to the next `i`.
// 10. After assigning characters to all possible positions, we can construct the final string.
// 11. A more efficient approach:
//     - First, pre-validate the LCP matrix: `lcp[i][i] == n-i` and `lcp[i][j] == lcp[j][i]`.
//     - Initialize `word` array with a placeholder (e.g., null or undefined).
//     - Iterate through `i` from 0 to `n-1`. If `word[i]` is not assigned:
//       - Try characters `c` from 'a' to 'z'.
//       - For a given character `c`, check if assigning `c` to `word[i]` is valid.
//       - Validity check:
//         - For all `j` from 0 to `n-1`:
//           - If `lcp[i][j] > 0`: If `word[j]` is already assigned and `word[j] != c`, then `c` is invalid.
//           - If `lcp[i][j] == 0`: If `word[j]` is already assigned and `word[j] == c`, then `c` is invalid.
//       - If `c` is valid:
//         - Assign `c` to `word[i]`.
//         - Now, propagate this. For all `j` such that `lcp[i][j] > 0`:
//           - If `word[j]` is unassigned, we don't assign it here directly. The logic will handle it when `j` becomes the primary index.
//         - Break from character loop.
//     - After iterating through all `i`, there might be unassigned characters. This implies that the character at `word[i]` can be any character as long as it maintains consistency with already assigned characters.
//     - The core idea for propagation is that if `lcp[i][j] > 0`, then `word[i]` and `word[j]` *must* be the same. This suggests a grouping.
//     - Let's refine the propagation:
//       - Initialize `word` array with a placeholder.
//       - For `i` from 0 to `n-1`:
//         - If `word[i]` is unassigned:
//           - For `c` from 'a' to 'z':
//             - Check if `c` is a valid assignment for `word[i]`.
//             - A character `c` is valid for `word[i]` if for all `j`:
//               - If `lcp[i][j] > 0`: If `word[j]` is assigned and `word[j] != c`, then `c` is invalid.
//               - If `lcp[i][j] == 0`: If `word[j]` is assigned and `word[j] == c`, then `c` is invalid.
//             - If `c` is valid:
//               - Assign `word[i] = c`.
//               - Break from character loop.
//       - After the first pass, `word` might still have unassigned entries. This happens when `lcp[i][j]` values only constrain `word[i]` indirectly through `word[j]`.
//       - The issue is that when we assign a character to `word[i]`, we need to make sure that all `word[j]` where `lcp[i][j] > 0` are also considered.
//       - Let's use BFS/component-based approach:
//         - Initialize `word` array with a placeholder.
//         - Create a `visited` array to track which `i` have been "processed" to determine their character.
//         - For `i` from 0 to `n-1`:
//           - If `visited[i]` is true, continue.
//           - Find the smallest character `c` that can be assigned to `word[i]`. This `c` must be consistent with all `j` such that `lcp[i][j] > 0` or `lcp[i][j] == 0` and `word[j]` is already assigned.
//           - To find `c`:
//             - Keep track of characters that are *forbidden* for `word[i]` based on already assigned `word[j]` values.
//             - `forbidden_chars = new Set()`
//             - For `j` from 0 to `n-1`:
//               - If `lcp[i][j] > 0` and `word[j]` is assigned: `forbidden_chars.add(word[j])` is incorrect. If `lcp[i][j] > 0`, `word[i]` MUST be `word[j]`.
//               - If `lcp[i][j] == 0` and `word[j]` is assigned: `forbidden_chars.add(word[j])`.
//             - Iterate `c` from 'a' to 'z'. If `c` is not in `forbidden_chars`, then `c` is a candidate.
//             - Now, we need to check if this candidate `c` is consistent with `lcp[i][j] > 0`. If `lcp[i][j] > 0` and `word[j]` is unassigned, then `word[j]` *must* eventually become `c`.
//             - This suggests grouping. If `lcp[i][j] > 0`, then `i` and `j` belong to the same group, and all indices in that group must have the same character.
//             - We can use Union-Find. For all `i, j` where `lcp[i][j] > 0`, union `i` and `j`.
//             - After building the Union-Find structure, iterate through each distinct root of the sets. For each root, find the lexicographically smallest character that can be assigned to all elements in its set.
//             - For a set rooted at `root`:
//               - `forbidden_chars_for_set = new Set()`
//               - For each `idx` in the set represented by `root`:
//                 - For `other_idx` from 0 to `n-1`:
//                   - If `lcp[idx][other_idx] == 0` and `word[other_idx]` is assigned: `forbidden_chars_for_set.add(word[other_idx])`.
//               - Find the smallest character `c` from 'a' to 'z' that is not in `forbidden_chars_for_set`.
//               - Assign `word[idx] = c` for all `idx` in the set.
//               - Mark all `idx` in the set as `visited`.
//     - Let's refine this Union-Find approach:
//       - **Step 1: Initial Validation**
//         - Check if `lcp[i][i] == n - i` for all `i`. If not, return `""`.
//         - Check if `lcp[i][j] == lcp[j][i]` for all `i, j`. If not, return `""`.
//       - **Step 2: Grouping Indices with Identical Suffixes**
//         - Initialize a Union-Find data structure for `n` elements.
//         - Iterate through all pairs `(i, j)` where `i < j`.
//         - If `lcp[i][j] > 0`: This means the suffixes `word[i..]` and `word[j..]` share a common prefix of length `lcp[i][j]`. This implies `word[i] == word[j]`. So, union `i` and `j` in the Union-Find structure.
//       - **Step 3: Determine Character for Each Group**
//         - Create an array `group_char` of size `n`, initialized with nulls. This will store the determined character for the representative of each group.
//         - Create an array `group_forbidden_chars` of size `n`, initialized with empty Sets. This will store characters that are forbidden for the character of a group's representative.
//         - Iterate through all `i` from 0 to `n-1`:
//           - Get the representative of the group `i` belongs to: `root_i = find(i)`.
//           - For all `j` from 0 to `n-1`:
//             - If `lcp[i][j] == 0`: This means `word[i]` and `word[j]` must be different.
//               - If `word[j]` has already been assigned a character (i.e., `group_char[find(j)]` is not null):
//                 - The character assigned to `word[j]`'s group is forbidden for `word[i]`'s group.
//                 - Add `group_char[find(j)]` to `group_forbidden_chars[root_i]`.
//       - **Step 4: Assign Lexicographically Smallest Characters**
//         - Create the result string array `word_chars` of size `n`, initialized with nulls.
//         - Iterate through all `i` from 0 to `n-1`:
//           - Get the representative of the group `i`: `root_i = find(i)`.
//           - If `group_char[root_i]` is null (meaning no character has been assigned to this group yet):
//             - Find the lexicographically smallest character `c` (from 'a' to 'z') that is NOT in `group_forbidden_chars[root_i]`.
//             - If no such character can be found (all 26 are forbidden), it means there's no solution. However, this case should theoretically be covered by prior validations if the LCP matrix is valid. But to be safe, we can add a check.
//             - Assign `group_char[root_i] = c`.
//       - **Step 5: Construct the Result String**
//         - For `i` from 0 to `n-1`:
//           - `root_i = find(i)`.
//           - `word_chars[i] = group_char[root_i]`.
//         - Join `word_chars` to form the final string.

// Time Complexity:
// - Initial Validation: O(n^2)
// - Union-Find operations:
//   - Building the UF structure by iterating through pairs (i, j) and performing union: O(n^2 * alpha(n)), where alpha is the inverse Ackermann function, which is practically constant.
//   - Determining forbidden characters for each group: For each `i`, we iterate through `j` (O(n)) and potentially access group representatives. This is roughly O(n^2 * alpha(n)).
//   - Assigning characters to groups: For each group (at most `n` groups), we iterate through 26 characters and check against forbidden sets. The size of forbidden sets can grow. In the worst case, when checking forbidden characters for a group, we iterate through all `j` (O(n)) and for each `j`, we check its group. This can be O(n^2 * alpha(n)).
// - Constructing the result string: O(n).
// Overall: O(n^2).

// Space Complexity:
// - Union-Find parent array: O(n)
// - Group forbidden characters sets: In the worst case, each set can contain up to 26 characters. Total O(n * 26) = O(n).
// - `group_char` array: O(n)
// - `word_chars` array: O(n)
// Overall: O(n).

// Edge Case: n=1. lcp = [[1]]. Should return "a".
// n=1, lcp=[[1]].
// Validation: lcp[0][0] == 1 - 0 (1 == 1). OK.
// UF: No unions.
// Group Forbidden: No `lcp[i][j] == 0` for i != j.
// Assign Char: root_0 = 0. group_char[0] is null. forbidden_chars_for_set[0] is empty. Smallest char is 'a'. group_char[0] = 'a'.
// Construct: word_chars[0] = group_char[find(0)] = group_char[0] = 'a'. Return "a".

// Example 1: lcp = [[4,0,2,0],[0,3,0,1],[2,0,2,0],[0,1,0,1]]
// n = 4
// Validation:
// lcp[0][0]=4 == 4-0. OK.
// lcp[1][1]=3 == 4-1. OK.
// lcp[2][2]=2 == 4-2. OK.
// lcp[3][3]=1 == 4-3. OK.
// lcp[0][1]=0 == lcp[1][0]. OK.
// lcp[0][2]=2 == lcp[2][0]. OK.
// lcp[0][3]=0 == lcp[3][0]. OK.
// lcp[1][2]=0 == lcp[2][1]. OK.
// lcp[1][3]=1 == lcp[3][1]. OK.
// lcp[2][3]=0 == lcp[3][2]. OK.

// UF:
// lcp[0][2] = 2 > 0 => union(0, 2)
// lcp[1][3] = 1 > 0 => union(1, 3)
// Roots: {0, 2}, {1, 3}. Assume root(0)=0, root(1)=1.

// Group Forbidden Chars:
// i=0: root_0 = 0
//   j=1: lcp[0][1]=0. word[1] unassigned. find(1)=1. group_char[1] is null.
//   j=3: lcp[0][3]=0. word[3] unassigned. find(3)=1. group_char[1] is null.
// i=1: root_1 = 1
//   j=0: lcp[1][0]=0. word[0] unassigned. find(0)=0. group_char[0] is null.
//   j=2: lcp[1][2]=0. word[2] unassigned. find(2)=0. group_char[0] is null.
// i=2: root_2 = 0
//   j=1: lcp[2][1]=0. word[1] unassigned. find(1)=1. group_char[1] is null.
//   j=3: lcp[2][3]=0. word[3] unassigned. find(3)=1. group_char[1] is null.
// i=3: root_3 = 1
//   j=0: lcp[3][0]=0. word[0] unassigned. find(0)=0. group_char[0] is null.
//   j=2: lcp[3][2]=0. word[2] unassigned. find(2)=0. group_char[0] is null.
// Nothing added to forbidden sets yet because no `word[j]` is assigned.

// Assign Lexicographically Smallest Characters:
// i=0: root_0 = 0. group_char[0] is null.
//   group_forbidden_chars[0] is empty. Smallest char is 'a'.
//   group_char[0] = 'a'.
// i=1: root_1 = 1. group_char[1] is null.
//   group_forbidden_chars[1] is empty. Smallest char is 'a'.
//   group_char[1] = 'a'.
// i=2: root_2 = 0. group_char[0] is 'a'. Already assigned.
// i=3: root_3 = 1. group_char[1] is 'a'. Already assigned.

// Wait, this logic is wrong. The `group_forbidden_chars` should be populated during the assignment phase, not before.
// Let's rethink Step 3 and 4.

// Corrected Approach:
// 1. **Initial Validation:** Same as before. O(n^2).
// 2. **Group Indices with Identical Suffixes using Union-Find:** Same as before. O(n^2 * alpha(n)).
// 3. **Determine Character for Each Group:**
//    - `group_assignment`: Array of size `n`, initialized to null. `group_assignment[root]` will store the character for the group represented by `root`.
//    - Iterate through `i` from 0 to `n-1`.
//      - Get `root_i = find(i)`.
//      - If `group_assignment[root_i]` is null:
//        - Try characters `c` from 'a' to 'z'.
//        - For a character `c`, check if it's valid for the group represented by `root_i`.
//        - A character `c` is valid if for ALL `k` in the set represented by `root_i`:
//          - For ALL `j` from 0 to `n-1`:
//            - If `lcp[k][j] == 0`: This means `word[k]` (which is `c`) and `word[j]` must be different.
//              - If `word[j]` has already been assigned a character: `assigned_char_j = group_assignment[find(j)]`. If `assigned_char_j` is not null and `assigned_char_j == c`, then `c` is invalid.
//        - If `c` is valid, assign `group_assignment[root_i] = c` and break from the character loop.
//      - If `group_assignment[root_i]` is still null after trying all characters, it means no solution exists, return "".
// 4. **Construct the Result String:**
//    - Create `word_chars` array of size `n`.
//    - For `i` from 0 to `n-1`:
//      - `root_i = find(i)`.
//      - `word_chars[i] = group_assignment[root_i]`.
//    - Join `word_chars`.

// Example 1: lcp = [[4,0,2,0],[0,3,0,1],[2,0,2,0],[0,1,0,1]]
// n = 4
// UF: Groups {0, 2} and {1, 3}. Let root(0)=0, root(1)=1.
// group_assignment = [null, null, null, null] (size n, for roots).
// word_chars = [null, null, null, null]

// i=0: root_0 = 0. group_assignment[0] is null.
//   Try 'a':
//     Check for root_0 (elements 0, 2):
//       k=0:
//         j=1: lcp[0][1]=0. find(1)=1. group_assignment[1] is null. OK.
//         j=3: lcp[0][3]=0. find(3)=1. group_assignment[1] is null. OK.
//       k=2:
//         j=1: lcp[2][1]=0. find(1)=1. group_assignment[1] is null. OK.
//         j=3: lcp[2][3]=0. find(3)=1. group_assignment[1] is null. OK.
//     'a' is valid for group 0.
//     group_assignment[0] = 'a'.

// i=1: root_1 = 1. group_assignment[1] is null.
//   Try 'a':
//     Check for root_1 (elements 1, 3):
//       k=1:
//         j=0: lcp[1][0]=0. find(0)=0. group_assignment[0] = 'a'. Since lcp[1][0]=0, word[1] must be != word[0]. 'a' == 'a'. So 'a' is INVALID for group 1.
//     Try 'b':
//       Check for root_1 (elements 1, 3):
//       k=1:
//         j=0: lcp[1][0]=0. find(0)=0. group_assignment[0] = 'a'. 'b' != 'a'. OK.
//         j=2: lcp[1][2]=0. find(2)=0. group_assignment[0] = 'a'. 'b' != 'a'. OK.
//       k=3:
//         j=0: lcp[3][0]=0. find(0)=0. group_assignment[0] = 'a'. 'b' != 'a'. OK.
//         j=2: lcp[3][2]=0. find(2)=0. group_assignment[0] = 'a'. 'b' != 'a'. OK.
//     'b' is valid for group 1.
//     group_assignment[1] = 'b'.

// i=2: root_2 = 0. group_assignment[0] is 'a'. Already processed.
// i=3: root_3 = 1. group_assignment[1] is 'b'. Already processed.

// Construct Result:
// i=0: root_0 = 0. word_chars[0] = group_assignment[0] = 'a'.
// i=1: root_1 = 1. word_chars[1] = group_assignment[1] = 'b'.
// i=2: root_2 = 0. word_chars[2] = group_assignment[0] = 'a'.
// i=3: root_3 = 1. word_chars[3] = group_assignment[1] = 'b'.
// word_chars = ['a', 'b', 'a', 'b']. Join -> "abab". Correct for Example 1.

// Example 3: lcp = [[4,3,2,1],[3,3,2,1],[2,2,2,1],[1,1,1,3]]
// n = 4
// Validation:
// lcp[3][3] = 3. Expected n-i = 4-3 = 1. `lcp[3][3] != n-3`. Return "". Correct for Example 3.

// Implementation details for Union-Find:
// `parent` array: `parent[i]` stores the parent of `i`. Initially `parent[i] = i`.
// `find(i)` function: Recursively finds the root of `i` with path compression.
// `union(i, j)` function: Merges the sets containing `i` and `j` by making one root a child of the other (e.g., by rank or size, though simple union is fine here).

// Let's re-verify the logic for `lcp[i][j] > 0` implications.
// If `lcp[i][j] = k > 0`, it means `word[i..i+k-1] == word[j..j+k-1]`.
// This implies `word[i] == word[j]`, `word[i+1] == word[j+1]`, ..., `word[i+k-1] == word[j+k-1]`.
// The Union-Find should group indices `i` and `j` if `word[i] == word[j]`.
// The condition `lcp[i][j] > 0` guarantees `word[i] == word[j]`. So, union `i` and `j` if `lcp[i][j] > 0`. This part is correct.

// The `group_assignment` array should be indexed by the root of the set.
// So, `group_assignment` size `n`, where `group_assignment[root]` stores the character for the group.

// Let's consider the case where `word[j]` is assigned, but `find(j)` is not the same as `j`.
// When checking `c` for `root_i`:
//   For `k` in the set of `root_i`:
//     For `j` from 0 to `n-1`:
//       If `lcp[k][j] == 0`:
//         `root_j = find(j)`.
//         If `group_assignment[root_j]` is not null:
//           `assigned_char_j = group_assignment[root_j]`.
//           If `assigned_char_j == c`: `c` is invalid.

// This seems correct. The character for a group is determined based on constraints from other groups that are explicitly different (`lcp == 0`).

// The number of groups can be at most `n`.
// The `group_assignment` array maps root indices to characters. So, its effective size is the number of distinct roots, which is at most `n`. However, allocating `n` and using `find(idx)` to get the correct index is cleaner.

// Need to implement the Union-Find structure.
// The `parent` array will store `parent[i]`. The root of `i` is found by `find(i)`.
// `group_assignment` will be indexed by the root. For example, if `root_i = find(i)`, we check `group_assignment[root_i]`.

// Final check on constraints and potential issues:
// `n <= 1000`. O(n^2) is acceptable.
// Lowercase English letters: 26 characters.
// Alphabetically smallest string. This is handled by iterating 'a' through 'z'.

// What if `group_assignment[root_i]` remains null after checking all characters?
// This implies that for the group `root_i`, any character we pick ('a' through 'z') conflicts with some other assigned character via `lcp == 0`.
// This means there's no valid string. So, return "".

// The prompt specifies generating ONLY executable JavaScript code. No markdown or text outside comments.
// This means the entire output must be a single JavaScript file.
// The solution needs to be enclosed within a function.

class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill(0).map((_, i) => i);
        // Optional: for union by rank/size, but not strictly necessary for correctness here.
    }

    find(i) {
        if (this.parent[i] === i) {
            return i;
        }
        // Path compression
        this.parent[i] = this.find(this.parent[i]);
        return this.parent[i];
    }

    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            // Simple union: make rootJ child of rootI
            this.parent[rootJ] = rootI;
        }
    }
}

/**
 * @param {number[][]} lcp
 * @return {string}
 */
// Problem Summary: Reconstruct the lexicographically smallest string given its LCP matrix.
// Link: https://leetcode.com/problems/find-the-string-with-lcp/
// Approach:
// The problem requires constructing a string `word` given its LCP (Longest Common Prefix) matrix.
// The LCP matrix `lcp[i][j]` stores the length of the longest common prefix between suffixes `word[i..n-1]` and `word[j..n-1]`.
//
// Key Observations and Constraints:
// 1. `lcp[i][i]` must be equal to `n - i`, as the suffix starting at `i` has length `n - i`.
// 2. `lcp[i][j]` must be equal to `lcp[j][i]` due to the symmetric nature of LCP.
// 3. If `lcp[i][j] = k > 0`, it implies that the first `k` characters of the suffixes `word[i..n-1]` and `word[j..n-1]` are identical. This means `word[i] == word[j]`, `word[i+1] == word[j+1]`, ..., `word[i+k-1] == word[j+k-1]`.
// 4. If `lcp[i][j] = 0`, it implies that the suffixes `word[i..n-1]` and `word[j..n-1]` have no common prefix, meaning `word[i]` and `word[j]` must be different characters.
//
// Strategy:
// We can use a Union-Find (Disjoint Set Union) data structure to group indices that must have the same character.
//
// Steps:
// 1. **Initial Validation:**
//    - Check if `lcp[i][i] == n - i` for all `i` from 0 to `n-1`. If not, return `""`.
//    - Check if `lcp[i][j] == lcp[j][i]` for all `i, j`. If not, return `""`.
//
// 2. **Group Indices with Identical Characters using Union-Find:**
//    - Initialize a Union-Find structure for `n` elements.
//    - Iterate through all pairs `(i, j)` where `i < j`.
//    - If `lcp[i][j] > 0`, it implies `word[i]` must be equal to `word[j]`. Therefore, union the sets containing `i` and `j`.
//
// 3. **Determine the Lexicographically Smallest Character for Each Group:**
//    - We need to assign a character to each group (represented by its root in the Union-Find structure).
//    - `group_assignment`: An array of size `n`, where `group_assignment[root]` will store the determined character for the group represented by `root`. Initialize with `null`.
//    - Iterate through each index `i` from 0 to `n-1`.
//    - Find the root of the group `i` belongs to: `root_i = uf.find(i)`.
//    - If `group_assignment[root_i]` is `null` (meaning this group hasn't been assigned a character yet):
//      - Try assigning characters `c` from 'a' to 'z' (lexicographically smallest first).
//      - For a candidate character `c`, check if it's valid for the entire group represented by `root_i`.
//      - Validity Check for `c` for group `root_i`:
//        - Iterate through all elements `k` that belong to `root_i` (i.e., `uf.find(k) === root_i`).
//        - For each such `k`, iterate through all indices `j` from 0 to `n-1`.
//        - If `lcp[k][j] == 0`: This means `word[k]` (which is `c`) must be different from `word[j]`.
//          - Find the root of `j`: `root_j = uf.find(j)`.
//          - If `group_assignment[root_j]` is not `null` (meaning `word[j]`'s group already has an assigned character):
//            - Let `assigned_char_j = group_assignment[root_j]`.
//            - If `assigned_char_j == c`, then character `c` is **invalid** for group `root_i`. Break the inner loops and try the next character for `c`.
//      - If `c` passes the validity check for all `k` in `root_i` and all `j`:
//        - Assign `group_assignment[root_i] = c`.
//        - Break from the character iteration loop ('a' to 'z') for this group and move to the next `i`.
//    - If after trying all characters 'a' through 'z', `group_assignment[root_i]` is still `null`, it means no valid character can be assigned to this group, so return `""`.
//
// 4. **Construct the Result String:**
//    - Create a character array `word_chars` of size `n`.
//    - For each index `i` from 0 to `n-1`:
//      - Find the root of `i`: `root_i = uf.find(i)`.
//      - The character for `word[i]` is `group_assignment[root_i]`. Store it in `word_chars[i]`.
//    - Join the `word_chars` array to form the final string and return it.
//
// Time Complexity:
// - Initial Validation: O(n^2)
// - Union-Find operations:
//   - Initializing UF: O(n)
//   - Union operations (in step 2): O(n^2 * alpha(n)), where alpha is the inverse Ackermann function (practically constant).
//   - Finding roots repeatedly in step 3: For each `i` (n times), and for each `k` in `root_i` (at most n times), and for each `j` (n times), calling `find()` takes O(alpha(n)). This part is roughly O(n * n * n * alpha(n)) if not optimized.
//   - Optimization for step 3 validity check: Instead of iterating through all `k` in `root_i` for every `(i, j)` pair, we can optimize.
//   - A better way for Step 3:
//     Iterate through each `i` from 0 to `n-1`.
//     Find `root_i = uf.find(i)`.
//     If `group_assignment[root_i]` is null:
//       Initialize `forbidden_chars_for_root_i = new Set()`.
//       For `j` from 0 to `n-1`:
//         If `lcp[i][j] == 0`:
//           `root_j = uf.find(j)`.
//           If `group_assignment[root_j]` is not null:
//             `forbidden_chars_for_root_i.add(group_assignment[root_j])`.
//       Now, try assigning the smallest char `c` from 'a' to 'z' that is not in `forbidden_chars_for_root_i`.
//       If a valid `c` is found, assign `group_assignment[root_i] = c`.
//       If no valid `c` is found, return `""`.
//   - With this optimization, Step 3 becomes:
//     Outer loop for `i` (n times).
//     Finding `root_i`: O(alpha(n)).
//     Inner loop for `j` (n times).
//     Finding `root_j`: O(alpha(n)).
//     Set additions: O(1) average.
//     Character assignment: O(26 * n) in the worst case (checking each element of the group against forbidden chars).
//     Total for step 3: O(n * (alpha(n) + n * alpha(n) + 26 * n)) which simplifies to O(n^2).
// - Constructing the result string: O(n * alpha(n)) for finding roots, then O(n) for joining.
// Overall Time Complexity: O(n^2).
//
// Space Complexity:
// - Union-Find `parent` array: O(n)
// - `group_assignment` array: O(n)
// - `word_chars` array: O(n)
// - `forbidden_chars` set within the loop: at most O(26).
// Overall Space Complexity: O(n).
class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill(0).map((_, i) => i);
    }

    find(i) {
        if (this.parent[i] === i) {
            return i;
        }
        // Path compression
        this.parent[i] = this.find(this.parent[i]);
        return this.parent[i];
    }

    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            // Simple union: make rootJ child of rootI
            this.parent[rootJ] = rootI;
        }
    }
}

var findTheStringWithLCP = function(lcp) {
    const n = lcp.length;

    // Step 1: Initial Validation
    for (let i = 0; i < n; i++) {
        // The length of the suffix word[i..n-1] is n-i.
        // So, lcp[i][i] (LCP of a suffix with itself) must be n-i.
        if (lcp[i][i] !== n - i) {
            return "";
        }
        for (let j = i + 1; j < n; j++) {
            // LCP is symmetric.
            if (lcp[i][j] !== lcp[j][i]) {
                return "";
            }
        }
    }

    const uf = new UnionFind(n);

    // Step 2: Group Indices with Identical Characters using Union-Find
    // If lcp[i][j] > 0, it implies word[i] == word[j].
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (lcp[i][j] > 0) {
                uf.union(i, j);
            }
        }
    }

    // group_assignment[root] will store the determined character for the group represented by 'root'.
    // It's indexed by the root of the set. We can use an array of size n,
    // and only set entries where the index is a root.
    const group_assignment = Array(n).fill(null);

    // Step 3: Determine the Lexicographically Smallest Character for Each Group
    // Iterate through each index. If its group hasn't been assigned a character yet,
    // determine the smallest valid character for that group.
    for (let i = 0; i < n; i++) {
        const root_i = uf.find(i);

        // If the group of 'i' has already been assigned a character, continue.
        if (group_assignment[root_i] !== null) {
            continue;
        }

        // Determine the set of characters forbidden for the group represented by root_i.
        // A character 'c' is forbidden if there exists some element 'k' in root_i's group
        // and some index 'j' such that lcp[k][j] == 0, and word[j] (or its group's assigned char) is 'c'.
        const forbidden_chars_for_root_i = new Set();

        // We only need to check constraints originating from the current group `root_i`.
        // Iterate through all indices `j` to find constraints.
        for (let j = 0; j < n; j++) {
            // Find the root of j.
            const root_j = uf.find(j);

            // If word[i] must be different from word[j] (i.e., lcp[i][j] == 0)
            // AND word[j]'s group is already assigned a character.
            // The logic here is: if `lcp[i][j] == 0`, then `word[i]` and `word[j]` must differ.
            // If `root_i` and `root_j` are different groups:
            // Then the character assigned to `root_j` is forbidden for `root_i`.
            //
            // We iterate `i` from 0 to n-1. When we are processing `i`, its root `root_i` is what we are trying to assign a character to.
            // The constraints come from `lcp[k][j] == 0` where `k` is in `root_i`'s group and `j` is in `root_j`'s group.
            // To avoid redundant checks and to correctly populate forbidden characters,
            // we can iterate through all possible `i` from 0 to `n-1` and populate `forbidden_chars_for_root_i` for its `root_i`.

            // For a given `i` and its `root_i`:
            // For every `j` such that `lcp[i][j] == 0`:
            // If `root_i != root_j` AND `group_assignment[root_j]` is assigned:
            //   Then `group_assignment[root_j]` is forbidden for `root_i`.

            if (lcp[i][j] === 0) { // word[i] must be different from word[j]
                const root_j = uf.find(j);
                if (root_i !== root_j && group_assignment[root_j] !== null) {
                    forbidden_chars_for_root_i.add(group_assignment[root_j]);
                }
            }
        }


        // Try assigning the lexicographically smallest character.
        let char_assigned = false;
        for (let char_code = 'a'.charCodeAt(0); char_code <= 'z'.charCodeAt(0); char_code++) {
            const c = String.fromCharCode(char_code);
            if (!forbidden_chars_for_root_i.has(c)) {
                group_assignment[root_i] = c;
                char_assigned = true;
                break; // Found the smallest valid character for this group.
            }
        }

        // If no character could be assigned to this group, no solution exists.
        if (!char_assigned) {
            return "";
        }
    }

    // Step 4: Construct the Result String
    const word_chars = Array(n);
    for (let i = 0; i < n; i++) {
        const root_i = uf.find(i);
        word_chars[i] = group_assignment[root_i];
    }

    return word_chars.join('');
};
```