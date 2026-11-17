// Problem: Minimum Changes to Make K Semi-palindromes
// Link: https://leetcode.com/problems/minimum-changes-to-make-k-semi-palindromes/
//
// Approach:
// This problem can be solved using dynamic programming. We need to partition the string `s` into `k` semi-palindromic substrings.
//
// First, we precompute the minimum changes required to make any substring `s[i...j]` a semi-palindrome. Let's call this `cost[i][j]`.
// To calculate `cost[i][j]`, we iterate through all possible divisors `d` of the substring's length `len = j - i + 1`.
// For each `d`, we form `d` groups of characters. The cost for a given `d` is the sum of minimum changes to make each group a palindrome.
// A group of characters `g` of length `m` can be made a palindrome by changing characters to match their symmetric counterparts. The number of changes needed is `m / 2 - (number of matching pairs)`.
// The minimum `cost[i][j]` is the minimum cost over all valid divisors `d`.
//
// Next, we define a DP state `dp[i][p]` which represents the minimum changes needed to partition the first `i` characters of `s` into `p` semi-palindromic substrings.
// The base cases are:
// - `dp[0][0] = 0` (0 characters partitioned into 0 substrings requires 0 changes).
// - `dp[i][0] = Infinity` for `i > 0` (cannot partition non-empty string into 0 substrings).
// - `dp[0][p] = Infinity` for `p > 0` (cannot partition 0 characters into non-zero substrings).
//
// The transitions are:
// `dp[i][p] = min(dp[i][p], dp[j][p - 1] + cost[j][i - 1])` for `0 <= j < i`.
// This means we are considering partitioning the first `i` characters into `p` substrings, where the `p`-th substring is `s[j...i-1]`, and the first `j` characters are partitioned into `p-1` substrings.
//
// The final answer will be `dp[n][k]`, where `n` is the length of `s`.
//
// Time Complexity:
// - Precomputing `cost[i][j]`: For each substring of length `L`, we iterate through its divisors `d`. For each `d`, we iterate through `L/d` groups, each of size `d`. Within each group, we check for palindrome property, taking `O(d)` time. The number of divisors of `L` is roughly `L^(epsilon)` for any small epsilon. A looser upper bound for divisors is `sqrt(L)`. So, for a substring of length `L`, the cost is roughly `sum over divisors d of L of (L/d * d) = sum of L = O(L * num_divisors)`. Considering all substrings, this part is roughly `O(N^3 * sqrt(N))` in a naive divisor count, but can be optimized. A tighter analysis for `cost[i][j]` is that for a substring of length `L`, iterating through all `d` from 1 to `L-1`, and for each `d`, forming `d` groups of size `L/d` and checking palindrome cost `O(L)`, leads to `O(L^2)`. So precomputation is `O(N^3)`.
// - DP: `O(N^2 * K)`.
// Overall: `O(N^3 + N^2 * K)`, which simplifies to `O(N^3)` since `K <= N/2`.
//
// Space Complexity:
// - `cost` table: `O(N^2)`.
// - `dp` table: `O(N * K)`.
// Overall: `O(N^2)` since `K <= N/2`.
//
class Solution {
    /**
     * @param {string} s
     * @param {number} k
     * @return {number}
     */
    minChanges(s, k) {
        const n = s.length;

        // Precompute the minimum changes to make any substring s[i...j] a semi-palindrome.
        // cost[i][j] will store the minimum changes for substring s.substring(i, j + 1).
        const cost = Array(n).fill(0).map(() => Array(n).fill(0));

        // Helper function to calculate the cost to make a group of characters a palindrome.
        // A group of characters 'chars' of length m.
        // We need to make it a palindrome. The number of changes is m/2 - number of matching pairs.
        const calculateGroupCost = (chars) => {
            let changes = 0;
            let left = 0;
            let right = chars.length - 1;
            while (left < right) {
                if (chars[left] !== chars[right]) {
                    changes++;
                }
                left++;
                right--;
            }
            return changes;
        };

        // Iterate through all possible substrings
        for (let i = 0; i < n; i++) {
            for (let j = i; j < n; j++) {
                const subLen = j - i + 1;
                let minSubCost = Infinity;

                // Iterate through all possible divisors 'd' of the substring length (excluding subLen itself).
                // 'd' must be a divisor of subLen, and 1 <= d < subLen.
                for (let d = 1; d < subLen; d++) {
                    if (subLen % d === 0) {
                        let currentDivisorCost = 0;
                        // For a given divisor 'd', we form 'd' groups.
                        // Group 1: s[i], s[i+d], s[i+2d], ...
                        // Group 2: s[i+1], s[i+1+d], s[i+1+2d], ...
                        // ...
                        // Group d: s[i+d-1], s[i+d-1+d], s[i+d-1+2d], ...
                        for (let groupIndex = 0; groupIndex < d; groupIndex++) {
                            let groupChars = "";
                            for (let charIndex = i + groupIndex; charIndex < j + 1; charIndex += d) {
                                groupChars += s[charIndex];
                            }
                            currentDivisorCost += calculateGroupCost(groupChars);
                        }
                        minSubCost = Math.min(minSubCost, currentDivisorCost);
                    }
                }
                // If no valid divisor was found (e.g., subLen is 1 or a prime not allowing d < subLen),
                // or if the minimum cost is still Infinity, it means we cannot form a semi-palindrome with
                // a valid divisor. For a substring of length 1, there's no valid divisor.
                // However, the problem statement implies that even a single character substring can be considered
                // a semi-palindrome if it's part of a larger partition that satisfies the condition.
                // The logic for calculating costs is focused on valid divisors `d < subLen`.
                // If subLen is 1, there are no valid divisors.
                // The `cost[i][j]` represents the minimum changes for substring `s[i...j]` to *become* a semi-palindrome.
                // If `subLen` is 1, it's already a palindrome, and the cost to make it one is 0.
                // The loops for `d` handle cases where `subLen > 1`.
                // If `minSubCost` remains `Infinity` after checking all divisors, it means no valid `d` was found.
                // However, for `cost[i][j]` to be meaningful for DP, it should represent the cost for that segment.
                // For a length 1 substring, the cost is 0.
                // The problem states `d` can range from 1 up to, but not including, the string's length.
                // For strings of length 1, no valid divisor exists, so they are not semi-palindromes by definition of divisor.
                // However, in the context of partitioning, if a substring of length 1 becomes part of a larger valid semi-palindrome,
                // its own transformation cost is considered. If `minSubCost` is `Infinity`, it means no `d` could be applied.
                // This implies that if `subLen` is 1, we can't apply the `d` rule.
                // The DP uses `cost[j][i-1]`. If `i-1 < j`, then the length is `i-1 - j + 1 = i - j`.
                // If `i-1` is the end of substring and `j` is start, then length is `i-j`.
                // Let's reconsider `cost[i][j]` to be `s[i...j]`. length is `j-i+1`.
                // For substring of length `L`, divisors `d` are `1 <= d < L`.
                // If `L=1`, no such `d`.
                // If `L=2`, only `d=1`.
                // If `L=3`, only `d=1`.
                // If `L=4`, `d=1, 2`.
                // If `L=5`, `d=1`.
                // If `L=6`, `d=1, 2, 3`.
                // The `cost[i][j]` precomputation should handle the minimum changes to make `s[i...j]` a semi-palindrome.
                // If `subLen` is 1, it doesn't have a valid divisor `d < subLen`. So, it can't be a semi-palindrome by the definition of semi-palindrome.
                // But for partitioning purposes, we need to assign a cost. The minimum changes to make a string of length 1 a semi-palindrome is 0.
                // The `d` divisor rule is about the structure. A single character is always a palindrome.
                // If the problem implies that segments that are palindromes also count as semi-palindromes (with a specific `d`), then
                // the cost should be 0 if it's already a palindrome.
                // The problem is about making a substring a semi-palindrome.
                // For `subLen = 1`, `d` cannot be chosen. Thus, it cannot fulfill the semi-palindrome definition.
                // However, if we consider a substring of length 1 as a basic building block, the cost to change it is 0.
                // The DP transition is `dp[i][p] = min(dp[j][p - 1] + cost[j][i - 1])`. `cost[j][i-1]` is the cost for `s[j...i-1]`.
                // So if `i-1 == j`, length is 1.
                // If `minSubCost` is `Infinity`, it means no valid `d` worked. We should ensure this `cost[i][j]` is usable.
                // For `subLen = 1`, no `d` satisfies `1 <= d < 1`. So `minSubCost` remains `Infinity`.
                // This indicates that a length-1 substring *cannot* be a semi-palindrome by the provided definition of divisor.
                // This is a critical point. If a substring *must* be a semi-palindrome, and a length-1 substring cannot be,
                // then `cost[i][i]` should be `Infinity`. But that would make DP impossible unless k is very small and we only use long substrings.
                // Let's assume for the purpose of partitioning, if a substring itself is a palindrome, its cost is 0.
                // And the semi-palindrome definition with divisor `d` is for when we *need* to apply that structure.
                //
                // Let's re-evaluate `cost[i][j]`: minimum changes to make `s[i...j]` a semi-palindrome.
                // A semi-palindrome requires a divisor `d < length`.
                // If `subLen = 1`, no such `d`. So `s[i...j]` cannot be a semi-palindrome under the rule.
                // This means `cost[i][j]` should be `Infinity` if no valid `d` can be found.
                // However, example 1: "ab", "cac". "cac" is semi-palindrome. "ab" changes to "aa" (d=1).
                // "ab" length 2. `d=1` is valid. Group 1: 'a', Group 2: 'b'. Not palindromes. Cost for d=1 is 1.
                // So "ab" can be made semi-palindrome with 1 change (to "aa").
                // My `calculateGroupCost` for a single character group is correct (0 changes).
                //
                // Let's trace "abcac", k=2. n=5.
                // `cost` table for substrings:
                // s[0..0]="a", len=1. No d. cost[0][0]=Infinity?  (This interpretation seems wrong for DP).
                // If length is 1, it is a palindrome. Cost to make it a palindrome is 0.
                // If the problem implies that for *any* substring, we must find the minimum changes to make it a semi-palindrome.
                // A substring can be a semi-palindrome if we can find a divisor `d` and make its groups palindromic.
                // For "a", len=1. No divisor `d < 1`.
                // Let's check constraints: `2 <= s.length <= 200`, `1 <= k <= s.length / 2`.
                // This implies substrings will have length at least 1.
                //
                // The crucial part is the definition of semi-palindrome.
                // "Choose a positive divisor d of the string's length. d can range from 1 up to, but not including, the string's length."
                // "For a string of length 1, it does not have a valid divisor as per this definition."
                // This means a string of length 1 CANNOT be a semi-palindrome by itself based on this definition.
                // If `cost[i][j]` represents minimum changes to make `s[i...j]` a semi-palindrome, and length 1 strings cannot be,
                // then `cost[i][i]` should be `Infinity`.
                //
                // Let's re-read "Divide s into k substrings such that the letter changes needed to make each substring a semi-palindrome are minimized."
                // This means the *resulting* k substrings must be semi-palindromes.
                //
                // If `subLen` is 1, `minSubCost` will remain `Infinity` because no `d` is valid.
                // This suggests `cost[i][j]` for `subLen=1` must be `Infinity`.
                // But if `cost[j][i-1]` is `Infinity`, then `dp[i][p]` becomes `Infinity`.
                // This means partitions ending in single characters are impossible. This is wrong.
                //
                // What if "semi-palindrome" is a property we strive for, and the cost is the changes needed to achieve it.
                // For a substring `sub`, we want to find minimum changes to make `sub` a semi-palindrome.
                // If `sub` has length `L`, we try divisors `d < L`.
                // If `L=1`, no `d`.
                // The problem might implicitly mean that a string that is *already* a palindrome can be considered a semi-palindrome.
                // Example 3: "aabbaa", k=3. "aa", "bb", "aa". These are palindromes and semi-palindromes (with d=1). Cost 0.
                //
                // Let's assume the precomputation should find the minimum changes to make `s[i...j]` into *some* semi-palindrome.
                // If `subLen` is `L`, and we iterate `d` from `1` to `L-1` where `L % d == 0`.
                // If no such `d` exists (i.e., `subLen` is prime and greater than 1, or `subLen` is 1), then it cannot be a semi-palindrome via this rule.
                // This is where the difficulty lies.
                //
                // Let's consider the costs for small lengths:
                // Length 1: "a". No valid `d < 1`. Cannot be a semi-palindrome. Cost `Infinity`.
                // Length 2: "ab". Valid `d=1`. Group 1: 'a', Group 2: 'b'. Cost to make group 1 palindrome: 0. Cost to make group 2 palindrome: 0. Total cost for d=1: 0.
                // BUT, "ab" needs 1 change to be "aa" (d=1, Group 1 "aa", Group 2 empty implies d=2, not valid).
                // If `d=1` for "ab", it means we compare `s[0]` with `s[0]`, `s[1]` with `s[1]`.
                // The groups are:
                // d=1: Group 1: s[i], s[i+1], s[i+2]...
                // For "ab" (i=0, j=1, subLen=2). d=1.
                // Group 1: s[0], s[0+1] -> "ab". To make "ab" a palindrome, 1 change.
                // This interpretation is wrong.
                // The groups are based on indices modulo d.
                // For `s[i...j]` of length `L`, with divisor `d`:
                // Group 1: indices `i, i+d, i+2d, ...` that are within `[i, j]`
                // Group 2: indices `i+1, i+1+d, i+1+2d, ...` that are within `[i, j]`
                // ...
                // Group d: indices `i+d-1, i+d-1+d, i+d-1+2d, ...` that are within `[i, j]`
                //
                // Example: s="abcabc", len=6.
                // d=3:
                // Group 1 (start index i=0): indices 0, 0+3=3. Chars: s[0]='a', s[3]='a'. Group: "aa". Palindrome cost: 0.
                // Group 2 (start index i=1): indices 1, 1+3=4. Chars: s[1]='b', s[4]='b'. Group: "bb". Palindrome cost: 0.
                // Group 3 (start index i=2): indices 2, 2+3=5. Chars: s[2]='c', s[5]='c'. Group: "cc". Palindrome cost: 0.
                // Total cost for d=3 is 0. So "abcabc" is a semi-palindrome.
                //
                // Okay, the `calculateGroupCost` is correct based on this understanding.
                // Now, for `cost[i][j]`, we want the *minimum* changes to make `s[i...j]` a semi-palindrome.
                // This minimum is taken over all valid divisors `d`.
                //
                // What if `subLen` is 1? `d` can range from `1` up to `subLen-1`. No `d` possible.
                // So `cost[i][i]` should be `Infinity`.
                //
                // Let's trace Example 1: s="abcac", k=2. n=5.
                //
                // Precomputing `cost[i][j]` for `s="abcac"`:
                // i=0, j=0 (len=1): "a". No valid d. `cost[0][0] = Infinity`.
                // i=1, j=1 (len=1): "b". No valid d. `cost[1][1] = Infinity`.
                // i=2, j=2 (len=1): "c". No valid d. `cost[2][2] = Infinity`.
                // i=3, j=3 (len=1): "a". No valid d. `cost[3][3] = Infinity`.
                // i=4, j=4 (len=1): "c". No valid d. `cost[4][4] = Infinity`.
                //
                // i=0, j=1 (len=2): "ab". Valid d=1.
                //   d=1:
                //     Group 1 (start index 0): s[0], s[0+1]. Chars: "ab". Cost: 1.
                //   minSubCost = 1. `cost[0][1] = 1`.
                //
                // i=1, j=2 (len=2): "bc". Valid d=1.
                //   d=1:
                //     Group 1 (start index 1): s[1], s[1+1]. Chars: "bc". Cost: 1.
                //   minSubCost = 1. `cost[1][2] = 1`.
                //
                // i=2, j=3 (len=2): "ca". Valid d=1.
                //   d=1:
                //     Group 1 (start index 2): s[2], s[2+1]. Chars: "ca". Cost: 1.
                //   minSubCost = 1. `cost[2][3] = 1`.
                //
                // i=3, j=4 (len=2): "ac". Valid d=1.
                //   d=1:
                //     Group 1 (start index 3): s[3], s[3+1]. Chars: "ac". Cost: 1.
                //   minSubCost = 1. `cost[3][4] = 1`.
                //
                // i=0, j=2 (len=3): "abc". Valid d=1.
                //   d=1:
                //     Group 1 (start index 0): s[0], s[1], s[2]. Chars: "abc". Cost: 1.
                //   minSubCost = 1. `cost[0][2] = 1`.
                //
                // i=1, j=3 (len=3): "bca". Valid d=1.
                //   d=1:
                //     Group 1 (start index 1): s[1], s[2], s[3]. Chars: "bca". Cost: 1.
                //   minSubCost = 1. `cost[1][3] = 1`.
                //
                // i=2, j=4 (len=3): "cac". Valid d=1.
                //   d=1:
                //     Group 1 (start index 2): s[2], s[3], s[4]. Chars: "cac". Cost: 0.
                //   minSubCost = 0. `cost[2][4] = 0`.
                //
                // i=0, j=3 (len=4): "abca". Valid d=1, 2.
                //   d=1:
                //     Group 1 (start index 0): s[0], s[1], s[2], s[3]. Chars: "abca". Cost: 1.
                //   d=2:
                //     Group 1 (start index 0): s[0], s[0+2]. Chars: "ac". Cost: 1.
                //     Group 2 (start index 1): s[1], s[1+2]. Chars: "ba". Cost: 1.
                //     Total for d=2: 1 + 1 = 2.
                //   minSubCost = 1. `cost[0][3] = 1`.
                //
                // i=1, j=4 (len=4): "bcac". Valid d=1, 2.
                //   d=1:
                //     Group 1 (start index 1): s[1], s[2], s[3], s[4]. Chars: "bcac". Cost: 1.
                //   d=2:
                //     Group 1 (start index 1): s[1], s[1+2]. Chars: "bc". Cost: 1.
                //     Group 2 (start index 2): s[2], s[2+2]. Chars: "ca". Cost: 1.
                //     Total for d=2: 1 + 1 = 2.
                //   minSubCost = 1. `cost[1][4] = 1`.
                //
                // i=0, j=4 (len=5): "abcac". Valid d=1.
                //   d=1:
                //     Group 1 (start index 0): s[0], s[1], s[2], s[3], s[4]. Chars: "abcac". Cost: 1.
                //   minSubCost = 1. `cost[0][4] = 1`.
                //
                // Summary of `cost[i][j]` for s="abcac" (where Infinity means not possible via definition):
                // (i,j) len cost
                // (0,0) 1  Inf
                // (1,1) 1  Inf
                // (2,2) 1  Inf
                // (3,3) 1  Inf
                // (4,4) 1  Inf
                // (0,1) 2  1  ("ab" -> "aa" or "bb", etc. d=1, groups "ab", needs 1 change)
                // (1,2) 2  1  ("bc" -> "bb", etc. d=1, groups "bc", needs 1 change)
                // (2,3) 2  1  ("ca" -> "aa", etc. d=1, groups "ca", needs 1 change)
                // (3,4) 2  1  ("ac" -> "aa", etc. d=1, groups "ac", needs 1 change)
                // (0,2) 3  1  ("abc". d=1. Group "abc". Needs 1 change)
                // (1,3) 3  1  ("bca". d=1. Group "bca". Needs 1 change)
                // (2,4) 3  0  ("cac". d=1. Group "cac". Needs 0 changes)
                // (0,3) 4  1  ("abca". d=1 cost 1. d=2 cost 2. Min is 1)
                // (1,4) 4  1  ("bcac". d=1 cost 1. d=2 cost 2. Min is 1)
                // (0,4) 5  1  ("abcac". d=1 cost 1. Min is 1)
                //
                // DP table: `dp[i][p]` = min changes for first `i` chars into `p` semi-palindromes.
                // `dp` size: `(n+1) x (k+1)`
                // Initialize `dp` with Infinity, `dp[0][0] = 0`.
                //
                // `n=5`, `k=2`.
                // `dp` is `6 x 3`.
                //
                // `dp[i][p] = min(dp[j][p - 1] + cost[j][i - 1])` for `0 <= j < i`.
                // `cost[j][i-1]` is the cost for substring `s[j...i-1]`.
                //
                // For `p=1`:
                // `dp[i][1] = cost[0][i-1]` for `i` from `1` to `n`.
                // `dp[1][1] = cost[0][0] = Infinity` (substring "a")
                // `dp[2][1] = cost[0][1] = 1`   (substring "ab")
                // `dp[3][1] = cost[0][2] = 1`   (substring "abc")
                // `dp[4][1] = cost[0][3] = 1`   (substring "abca")
                // `dp[5][1] = cost[0][4] = 1`   (substring "abcac")
                //
                // For `p=2`:
                // `dp[i][2]` for `i` from `2` to `n`.
                //
                // `dp[2][2]`: i=2, p=2. j can be 0 or 1.
                //   j=0: `dp[0][1] + cost[0][1] = Infinity + 1 = Infinity`
                //   j=1: `dp[1][1] + cost[1][1] = Infinity + Infinity = Infinity`
                // `dp[2][2] = Infinity`. (Cannot partition "ab" into 2 semi-palindromes. Min substring length is 2. So we need at least 2 characters for 2 partitions).
                //
                // `dp[3][2]`: i=3, p=2. j can be 0, 1, 2.
                //   j=0: `dp[0][1] + cost[0][2] = Infinity + 1 = Infinity`
                //   j=1: `dp[1][1] + cost[1][2] = Infinity + 1 = Infinity`
                //   j=2: `dp[2][1] + cost[2][2] = 1 + Infinity = Infinity` (partition "a" | "bc")
                // `dp[3][2] = Infinity`.
                //
                // `dp[4][2]`: i=4, p=2. j can be 0, 1, 2, 3.
                //   j=0: `dp[0][1] + cost[0][3] = Infinity + 1 = Infinity`
                //   j=1: `dp[1][1] + cost[1][3] = Infinity + 1 = Infinity`
                //   j=2: `dp[2][1] + cost[2][3] = 1 + 1 = 2`. Partition "ab" | "ca". `cost[2][3]` for "ca" is 1.
                //   j=3: `dp[3][1] + cost[3][3] = 1 + Infinity = Infinity`. Partition "abc" | "a".
                // `dp[4][2] = 2`.
                //
                // `dp[5][2]`: i=5, p=2. j can be 0, 1, 2, 3, 4.
                //   j=0: `dp[0][1] + cost[0][4] = Infinity + 1 = Infinity`
                //   j=1: `dp[1][1] + cost[1][4] = Infinity + 1 = Infinity`
                //   j=2: `dp[2][1] + cost[2][4] = 1 + 0 = 1`. Partition "ab" | "cac". `cost[2][4]` for "cac" is 0. This is the optimal split.
                //   j=3: `dp[3][1] + cost[3][4] = 1 + 1 = 2`. Partition "abc" | "ac". `cost[3][4]` for "ac" is 1.
                //   j=4: `dp[4][1] + cost[4][4] = 1 + Infinity = Infinity`. Partition "abca" | "c".
                // `dp[5][2] = 1`.
                //
                // Final answer: `dp[n][k] = dp[5][2] = 1`. This matches Example 1.
                //
                // The interpretation that `cost[i][i]` is `Infinity` (since length 1 cannot be semi-palindrome) seems correct for the DP to work as intended,
                // ensuring that partitions of length 1 are penalized unless they are the *only* character.
                // But the DP transition `dp[j][p-1] + cost[j][i-1]` implies `i-1 >= j`.
                // If `i-1 = j`, then `cost[j][j]` is used.
                //
                // Consider the case `k=1`. `dp[n][1] = cost[0][n-1]`. This is the cost to make the whole string `s` a semi-palindrome.
                //
                // The implementation of `cost[i][j]` precomputation should reflect that `minSubCost` can remain `Infinity` if no valid `d` is found.
                // Then, the DP will naturally propagate these `Infinity` values if `cost[j][i-1]` is `Infinity`.
                //
                // Final check on the loop for divisors: `d` can range from `1` up to, but not including, the string's length.
                // For `subLen`, valid `d` are `d` such that `1 <= d < subLen` and `subLen % d == 0`.
                // If `subLen = 1`, loop `for (let d = 1; d < subLen; d++)` will not run. `minSubCost` remains `Infinity`.
                // If `subLen = 2`, `d=1`. Loop runs for `d=1`.
                // If `subLen = 3`, `d=1`. Loop runs for `d=1`.
                // If `subLen = 4`, `d=1, 2`. Loop runs for `d=1, 2`.
                // This seems correct.

                // If minSubCost is still Infinity after checking all valid divisors, it means
                // the substring s[i...j] cannot be made into a semi-palindrome according to the definition
                // because no valid divisor `d` (1 <= d < subLen) exists or the cost is too high.
                // For the DP to work, we use Infinity for these cases.
                // Note: If `subLen` is 1, the loop `for (let d = 1; d < subLen; d++)` will not execute,
                // and `minSubCost` will remain `Infinity`, which is the correct behavior as a length-1 string
                // cannot be a semi-palindrome by the definition of having a divisor `d < length`.
                if (minSubCost !== Infinity) {
                    cost[i][j] = minSubCost;
                } else {
                    // If no valid divisor was found, or if the length is 1,
                    // this substring cannot be a semi-palindrome by definition.
                    // This will propagate Infinity in the DP.
                    cost[i][j] = Infinity;
                }
            }
        }

        // DP table: dp[i][p] = minimum changes to partition the first i characters into p semi-palindromes.
        // dp[i][p] where i is the length of prefix considered (0 to n), p is the number of partitions (0 to k).
        const dp = Array(n + 1).fill(0).map(() => Array(k + 1).fill(Infinity));

        // Base case: 0 characters partitioned into 0 substrings requires 0 changes.
        dp[0][0] = 0;

        // Fill the DP table
        // i: current prefix length (1 to n)
        // p: number of partitions (1 to k)
        for (let i = 1; i <= n; i++) {
            for (let p = 1; p <= k; p++) {
                // j: represents the split point. The last partition will be s[j...i-1].
                // The first j characters are partitioned into p-1 semi-palindromes.
                // So, j ranges from 0 to i-1.
                // The substring for the last partition is s[j] to s[i-1], which is cost[j][i-1].
                for (let j = 0; j < i; j++) {
                    // Ensure that the previous state dp[j][p-1] is reachable (not Infinity)
                    // and the cost of the current segment cost[j][i-1] is also reachable (not Infinity).
                    // The substring s[j...i-1] has length (i-1) - j + 1 = i - j.
                    // For this to be a valid substring for partitioning, its length `i-j` must be at least 1.
                    // This is guaranteed because `j < i`.
                    // If `i-j = 1`, then `j = i-1`, we use `cost[i-1][i-1]`.
                    // If `cost[i-1][i-1]` is Infinity, this split is invalid.
                    if (dp[j][p - 1] !== Infinity && cost[j][i - 1] !== Infinity) {
                        dp[i][p] = Math.min(dp[i][p], dp[j][p - 1] + cost[j][i - 1]);
                    }
                }
            }
        }

        // The answer is the minimum changes to partition the entire string (n characters) into k semi-palindromes.
        return dp[n][k];
    }
}
```