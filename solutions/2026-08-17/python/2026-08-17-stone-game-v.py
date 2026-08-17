```python
# Problem: Stone Game V
# Link: https://leetcode.com/problems/stone-game-v/
#
# Approach:
# This problem can be solved using dynamic programming.
# Let dp[i][j] represent the maximum score Alice can get from the subarray of stones from index i to j (inclusive).
# To calculate dp[i][j], Alice needs to make a split at some index k (where i <= k < j).
# This splits the subarray [i...j] into two subarrays: [i...k] and [k+1...j].
# Bob will then discard the row with the larger sum. Alice's score will be the sum of the row that is NOT discarded.
#
# Alice wants to maximize her score. For each possible split k, Alice gets either the sum of [i...k] or the sum of [k+1...j].
# The sum of [i...k] is prefixSum[k+1] - prefixSum[i].
# The sum of [k+1...j] is prefixSum[j+1] - prefixSum[k+1].
#
# If sum([i...k]) < sum([k+1...j]): Bob discards [k+1...j]. Alice gets sum([i...k]) + dp[k+1][j].
# If sum([i...k]) > sum([k+1...j]): Bob discards [i...k]. Alice gets sum([k+1...j]) + dp[i][k].
# If sum([i...k]) == sum([k+1...j]): Alice can choose which to discard. She will choose the option that maximizes her score.
#    - Alice discards [k+1...j]: her score is sum([i...k]) + dp[k+1][j].
#    - Alice discards [i...k]: her score is sum([k+1...j]) + dp[i][k].
#    So, she takes the maximum of these two options.
#
# The base case is when the subarray has only one stone (i == j). In this case, no splits are possible, and Alice's score is 0.
#
# We can precompute prefix sums to efficiently calculate the sum of any subarray.
# The outer loops will iterate over the length of the subarray (len) and then the starting index (i).
# The ending index j will be i + len - 1.
# The inner loop will iterate over all possible split points k.
#
# Time Complexity: O(n^3), where n is the number of stones.
#   - O(n) for prefix sums.
#   - O(n^3) for the DP calculation:
#     - len from 1 to n: O(n)
#     - i from 0 to n-len: O(n)
#     - k from i to j-1: O(n)
# Space Complexity: O(n^2) for the DP table.
#
# Optimization (O(n^2) time):
# Notice that when we calculate dp[i][j], we are splitting at k.
# The two sums are sum(stones[i...k]) and sum(stones[k+1...j]).
# We are looking for a split k such that sum(stones[i...k]) >= sum(stones[k+1...j]) to maximize Alice's score.
# Specifically, if sum(stones[i...k]) is smaller, Alice gets sum(stones[i...k]) + dp[k+1][j].
# If sum(stones[k+1...j]) is smaller, Alice gets sum(stones[k+1...j]) + dp[i][k].
#
# Let's refine the DP transition. For a subarray [i...j], Alice makes a split at k (i <= k < j).
# Left sum = sum(stoneValue[i...k])
# Right sum = sum(stoneValue[k+1...j])
#
# If Left sum < Right sum: Bob throws away Right. Alice gets Left sum + dp[k+1][j].
# If Left sum > Right sum: Bob throws away Left. Alice gets Right sum + dp[i][k].
# If Left sum == Right sum: Alice chooses to maximize.
#   Alice could discard Right: Left sum + dp[k+1][j]
#   Alice could discard Left: Right sum + dp[i][k]
#   Alice takes max(Left sum + dp[k+1][j], Right sum + dp[i][k])
#
# We can iterate through the split point k.
# For each subarray [i, j], we iterate through k from i to j-1.
# The prefix sums allow O(1) sum calculation.
# The inner loop for k still makes it O(n^3).
#
# Consider the perspective: Alice splits at k.
# The score Alice gets depends on the minimum of the two sums.
# Alice wants to maximize `min(sum_left, sum_right) + (if sum_left < sum_right then dp[k+1][j] else dp[i][k])`
# Or more generally: `max(score_if_left_discarded, score_if_right_discarded)`
#
# If Left sum < Right sum: Bob discards Right. Alice gets Left sum + dp[k+1][j].
# If Left sum > Right sum: Bob discards Left. Alice gets Right sum + dp[i][k].
# If Left sum == Right sum: Alice gets max(Left sum + dp[k+1][j], Right sum + dp[i][k]).
#
# The issue is that the problem states "Alice's score increases by the value of the remaining row".
# This implies that if sum_left < sum_right, Alice gets sum_left. Then the game continues on sum_right row.
# If sum_left > sum_right, Alice gets sum_right. Then the game continues on sum_left row.
# If sum_left == sum_right, Alice decides. She will choose to keep the row that leads to her max score.
#
# Let's re-read: "Alice divides the row into two non-empty rows (i.e. left row and right row), then Bob calculates the value of each row... Bob throws away the row which has the maximum value, and Alice's score increases by the value of the remaining row."
#
# This means if sum_left < sum_right, Bob throws away right. Alice's score increases by sum_left. The next round starts with the right row.
# If sum_left > sum_right, Bob throws away left. Alice's score increases by sum_right. The next round starts with the left row.
# If sum_left == sum_right, Alice can choose which to throw away.
#   If Alice chooses to throw away right, she gets sum_left, and the next round is on the left row.
#   If Alice chooses to throw away left, she gets sum_right, and the next round is on the right row.
#   Alice will choose the option that yields a higher total score for her.
#
# This implies that dp[i][j] should be the maximum score Alice can get starting with the subarray stoneValue[i...j].
#
# For a split at k (i <= k < j):
# sum_left = sum(stoneValue[i...k])
# sum_right = sum(stoneValue[k+1...j])
#
# Case 1: sum_left < sum_right
#   Bob discards right. Alice's score in this round = sum_left.
#   Game continues with stoneValue[k+1...j].
#   Total score = sum_left + dp[k+1][j]
#
# Case 2: sum_left > sum_right
#   Bob discards left. Alice's score in this round = sum_right.
#   Game continues with stoneValue[i...k].
#   Total score = sum_right + dp[i][k]
#
# Case 3: sum_left == sum_right
#   Alice chooses to maximize her score.
#   Option A: Discard right. Alice gets sum_left. Game continues with stoneValue[i...k]. Total score = sum_left + dp[i][k].
#   Option B: Discard left. Alice gets sum_right. Game continues with stoneValue[k+1...j]. Total score = sum_right + dp[k+1][j].
#   Alice takes max(sum_left + dp[i][k], sum_right + dp[k+1][j]). Since sum_left == sum_right, this is max(sum_left + dp[i][k], sum_left + dp[k+1][j]).
#
# We need to iterate through all possible lengths of subarrays (l) from 2 to n.
# Then iterate through all possible start indices (i) for that length.
# The end index (j) is i + l - 1.
# For each subarray [i...j], iterate through all possible split points (k) from i to j-1.
#
# Time Complexity remains O(n^3).
# Space Complexity remains O(n^2).
#
# Let's re-evaluate the O(n^2) optimization possibility.
# The core issue is the calculation of `dp[i][j]` based on splits `k`.
# `dp[i][j] = max_{i <= k < j} { ... }`
#
# For a fixed `i` and `j`, as `k` increases from `i` to `j-1`:
# `sum_left = sum(stoneValue[i...k])` increases.
# `sum_right = sum(stoneValue[k+1...j])` decreases.
#
# We are looking for a split `k` that balances `sum_left` and `sum_right` in a way that maximizes Alice's gain in the current step plus her future gains from the remaining subproblem.
#
# Consider the split point `k`.
# We compare `sum_left` and `sum_right`.
# If `sum_left < sum_right`, Alice gets `sum_left` and the game continues on `[k+1, j]`. The score is `sum_left + dp[k+1][j]`.
# If `sum_left > sum_right`, Alice gets `sum_right` and the game continues on `[i, k]`. The score is `sum_right + dp[i][k]`.
# If `sum_left == sum_right`, Alice chooses `max(sum_left + dp[i][k], sum_right + dp[k+1][j])`.
#
# This can be simplified. Let `S(i, j)` be the sum of `stoneValue[i...j]`.
# For a split at `k`:
# `S_left = S(i, k)`
# `S_right = S(k+1, j)`
#
# If `S_left < S_right`: Score = `S_left + dp[k+1][j]`
# If `S_left > S_right`: Score = `S_right + dp[i][k]`
# If `S_left == S_right`: Score = `max(S_left + dp[i][k], S_right + dp[k+1][j])`
#
# `dp[i][j] = max_{i <= k < j} {
#     score_at_k
# }`
#
# To optimize to O(n^2):
# For a fixed `i` and `j`, as `k` increases, `S_left` increases and `S_right` decreases.
# We are interested in the point where `S_left` and `S_right` are "close".
#
# Let's try to find the optimal `k` more efficiently for each `(i, j)`.
# For a fixed `i` and `j`, we want to maximize `f(k)`.
# `f(k)` is one of the three forms depending on the comparison of `S_left` and `S_right`.
#
# Consider the condition `S_left >= S_right`. This means `S(i, k) >= S(k+1, j)`.
# The split point `k` that satisfies this condition is what we need to find.
# For a fixed `i` and `j`, we can find a `k_opt` such that `S(i, k_opt) >= S(k_opt+1, j)` and `S(i, k_opt-1) < S(k_opt, j)` (or similar boundary conditions). This `k_opt` can be found using binary search or two pointers for each `(i, j)` if the objective function were monotonic.
# However, the objective function `score_at_k` is not necessarily monotonic.
#
# The crucial observation for O(n^2) is often related to how the optimal split point `k` for `dp[i][j]` relates to the optimal split point for `dp[i][j-1]` or `dp[i+1][j]`.
#
# Let's try to find the split `k` that makes `sum(i...k)` and `sum(k+1...j)` as close as possible.
# For a fixed `i` and `j`, we can find a `k` such that `prefixSum[k+1] - prefixSum[i]` is approximately `(prefixSum[j+1] - prefixSum[i]) / 2`.
# This can be done using binary search on `k` for each `(i, j)` to find the `k` that makes the sums closest. This would be O(n^2 log n).
#
# The true O(n^2) solution for problems like this often comes from the fact that the optimal split point `k` for `dp[i][j]` is non-decreasing with `j` (for fixed `i`) and non-increasing with `i` (for fixed `j`). This property is called Quadrangle Inequality or Convexity, which allows Knuth-Yao optimization or simpler two-pointer optimizations.
#
# Let's examine the objective function more closely for fixed `i` and `j`.
# We want to maximize `max_score` over `i <= k < j`.
# `sum_left = ps[k+1] - ps[i]`
# `sum_right = ps[j+1] - ps[k+1]`
#
# We are looking for a `k` where `sum_left` is close to `sum_right`.
# Specifically, we want to find `k` such that `sum_left` is as large as possible while `sum_left <= sum_right`.
# Or `sum_right` is as large as possible while `sum_right < sum_left`.
#
# Let `target_sum = (ps[j+1] - ps[i]) / 2`.
# We can find the split `k_best` which makes `ps[k_best+1] - ps[i]` closest to `target_sum`.
# This `k_best` can be found using `bisect_left` or binary search on `k` for each `(i, j)`.
#
# For a given `i` and `j`, find `k_split` such that `ps[k_split+1] - ps[i]` is the largest value less than or equal to `(ps[j+1] - ps[i]) / 2`.
# The candidate split points to consider are `k_split` and `k_split + 1`.
#
# Let `total_sum = ps[j+1] - ps[i]`.
# We are looking for `k` such that `ps[k+1] - ps[i]` is close to `total_sum / 2`.
#
# For a fixed `i` and `j`:
# Iterate `k` from `i` to `j-1`.
# `s_left = ps[k+1] - ps[i]`
# `s_right = ps[j+1] - ps[k+1]`
#
# If `s_left < s_right`:
#   Candidate score = `s_left + dp[k+1][j]`
# Else if `s_left > s_right`:
#   Candidate score = `s_right + dp[i][k]`
# Else (`s_left == s_right`):
#   Candidate score = `max(s_left + dp[i][k], s_right + dp[k+1][j])`
#
# `dp[i][j] = max(dp[i][j], candidate_score)`
#
# The O(n^3) solution is straightforward to implement. Let's stick with that for correctness and then consider optimization if needed or if a simpler O(n^2) approach is evident.
#
# The example explanation suggests Alice *chooses* the split. Bob *then* throws away.
# "Alice divides the row to [6,2,3], [4,5,5]. The left row has the value 11 and the right row has value 14. Bob throws away the right row and Alice's score is now 11."
# This confirms: If left_sum < right_sum, Alice gets left_sum and the game continues on the right part.
# If left_sum > right_sum, Alice gets right_sum and the game continues on the left part.
# If left_sum == right_sum, Alice chooses which part to keep.
#
# Example 1 walkthrough: stoneValue = [6,2,3,4,5,5]
# n = 6
# Prefix sums: [0, 6, 8, 11, 15, 20, 25]
#
# dp table size: 6x6, initialized to 0.
#
# len = 2:
# dp[0][1] (stones [6,2]): split at 0. left=[6], right=[2]. sum_l=6, sum_r=2. sum_l > sum_r. Alice gets 2. Game on [6]. dp[1][1]=0. Score = 2 + 0 = 2.
# dp[1][2] (stones [2,3]): split at 1. left=[2], right=[3]. sum_l=2, sum_r=3. sum_l < sum_r. Alice gets 2. Game on [3]. dp[2][2]=0. Score = 2 + 0 = 2.
# dp[2][3] (stones [3,4]): split at 2. left=[3], right=[4]. sum_l=3, sum_r=4. sum_l < sum_r. Alice gets 3. Game on [4]. dp[3][3]=0. Score = 3 + 0 = 3.
# dp[3][4] (stones [4,5]): split at 3. left=[4], right=[5]. sum_l=4, sum_r=5. sum_l < sum_r. Alice gets 4. Game on [5]. dp[4][4]=0. Score = 4 + 0 = 4.
# dp[4][5] (stones [5,5]): split at 4. left=[5], right=[5]. sum_l=5, sum_r=5. sum_l == sum_r.
#   Option A (discard right): Alice gets 5. Game on [5]. dp[4][4]=0. Total = 5 + 0 = 5.
#   Option B (discard left): Alice gets 5. Game on [5]. dp[5][5]=0. Total = 5 + 0 = 5.
#   dp[4][5] = max(5, 5) = 5.
#
# len = 3:
# dp[0][2] (stones [6,2,3]): ps[3]-ps[0] = 11.
#   k=0: left=[6] (6), right=[2,3] (5). sum_l > sum_r. Alice gets 5. Game on [6]. dp[0][0]=0. Score = 5 + 0 = 5.
#   k=1: left=[6,2] (8), right=[3] (3). sum_l > sum_r. Alice gets 3. Game on [6,2]. dp[0][1]=2. Score = 3 + 2 = 5.
#   dp[0][2] = max(5, 5) = 5.
#
# dp[1][3] (stones [2,3,4]): ps[4]-ps[1] = 15 - 6 = 9.
#   k=1: left=[2] (2), right=[3,4] (7). sum_l < sum_r. Alice gets 2. Game on [3,4]. dp[2][3]=3. Score = 2 + 3 = 5.
#   k=2: left=[2,3] (5), right=[4] (4). sum_l > sum_r. Alice gets 4. Game on [2,3]. dp[1][2]=2. Score = 4 + 2 = 6.
#   dp[1][3] = max(5, 6) = 6.
#
# dp[2][4] (stones [3,4,5]): ps[5]-ps[2] = 20 - 8 = 12.
#   k=2: left=[3] (3), right=[4,5] (9). sum_l < sum_r. Alice gets 3. Game on [4,5]. dp[3][4]=4. Score = 3 + 4 = 7.
#   k=3: left=[3,4] (7), right=[5] (5). sum_l > sum_r. Alice gets 5. Game on [3,4]. dp[2][3]=3. Score = 5 + 3 = 8.
#   dp[2][4] = max(7, 8) = 8.
#
# dp[3][5] (stones [4,5,5]): ps[6]-ps[3] = 25 - 11 = 14.
#   k=3: left=[4] (4), right=[5,5] (10). sum_l < sum_r. Alice gets 4. Game on [5,5]. dp[4][5]=5. Score = 4 + 5 = 9.
#   k=4: left=[4,5] (9), right=[5] (5). sum_l > sum_r. Alice gets 5. Game on [4,5]. dp[3][4]=4. Score = 5 + 4 = 9.
#   dp[3][5] = max(9, 9) = 9.
#
# len = 4:
# dp[0][3] (stones [6,2,3,4]): ps[4]-ps[0] = 15.
#   k=0: left=[6] (6), right=[2,3,4] (9). sum_l < sum_r. Alice gets 6. Game on [2,3,4]. dp[1][3]=6. Score = 6 + 6 = 12.
#   k=1: left=[6,2] (8), right=[3,4] (7). sum_l > sum_r. Alice gets 7. Game on [6,2]. dp[0][1]=2. Score = 7 + 2 = 9.
#   k=2: left=[6,2,3] (11), right=[4] (4). sum_l > sum_r. Alice gets 4. Game on [6,2,3]. dp[0][2]=5. Score = 4 + 5 = 9.
#   dp[0][3] = max(12, 9, 9) = 12.
#
# dp[1][4] (stones [2,3,4,5]): ps[5]-ps[1] = 20 - 6 = 14.
#   k=1: left=[2] (2), right=[3,4,5] (12). sum_l < sum_r. Alice gets 2. Game on [3,4,5]. dp[2][4]=8. Score = 2 + 8 = 10.
#   k=2: left=[2,3] (5), right=[4,5] (9). sum_l < sum_r. Alice gets 5. Game on [4,5]. dp[3][4]=4. Score = 5 + 4 = 9.
#   k=3: left=[2,3,4] (9), right=[5] (5). sum_l > sum_r. Alice gets 5. Game on [2,3,4]. dp[1][3]=6. Score = 5 + 6 = 11.
#   dp[1][4] = max(10, 9, 11) = 11.
#
# dp[2][5] (stones [3,4,5,5]): ps[6]-ps[2] = 25 - 8 = 17.
#   k=2: left=[3] (3), right=[4,5,5] (14). sum_l < sum_r. Alice gets 3. Game on [4,5,5]. dp[3][5]=9. Score = 3 + 9 = 12.
#   k=3: left=[3,4] (7), right=[5,5] (10). sum_l < sum_r. Alice gets 7. Game on [5,5]. dp[4][5]=5. Score = 7 + 5 = 12.
#   k=4: left=[3,4,5] (12), right=[5] (5). sum_l > sum_r. Alice gets 5. Game on [3,4,5]. dp[2][4]=8. Score = 5 + 8 = 13.
#   dp[2][5] = max(12, 12, 13) = 13.
#
# len = 5:
# dp[0][4] (stones [6,2,3,4,5]): ps[5]-ps[0] = 20.
#   k=0: left=[6] (6), right=[2,3,4,5] (14). sum_l < sum_r. Alice gets 6. Game on [2,3,4,5]. dp[1][4]=11. Score = 6 + 11 = 17.
#   k=1: left=[6,2] (8), right=[3,4,5] (12). sum_l < sum_r. Alice gets 8. Game on [3,4,5]. dp[2][4]=8. Score = 8 + 8 = 16.
#   k=2: left=[6,2,3] (11), right=[4,5] (9). sum_l > sum_r. Alice gets 9. Game on [6,2,3]. dp[0][2]=5. Score = 9 + 5 = 14.
#   k=3: left=[6,2,3,4] (15), right=[5] (5). sum_l > sum_r. Alice gets 5. Game on [6,2,3,4]. dp[0][3]=12. Score = 5 + 12 = 17.
#   dp[0][4] = max(17, 16, 14, 17) = 17.
#
# dp[1][5] (stones [2,3,4,5,5]): ps[6]-ps[1] = 25 - 6 = 19.
#   k=1: left=[2] (2), right=[3,4,5,5] (17). sum_l < sum_r. Alice gets 2. Game on [3,4,5,5]. dp[2][5]=13. Score = 2 + 13 = 15.
#   k=2: left=[2,3] (5), right=[4,5,5] (14). sum_l < sum_r. Alice gets 5. Game on [4,5,5]. dp[3][5]=9. Score = 5 + 9 = 14.
#   k=3: left=[2,3,4] (9), right=[5,5] (10). sum_l < sum_r. Alice gets 9. Game on [5,5]. dp[4][5]=5. Score = 9 + 5 = 14.
#   k=4: left=[2,3,4,5] (14), right=[5] (5). sum_l > sum_r. Alice gets 5. Game on [2,3,4,5]. dp[1][4]=11. Score = 5 + 11 = 16.
#   dp[1][5] = max(15, 14, 14, 16) = 16.
#
# len = 6:
# dp[0][5] (stones [6,2,3,4,5,5]): ps[6]-ps[0] = 25.
#   k=0: left=[6] (6), right=[2,3,4,5,5] (19). sum_l < sum_r. Alice gets 6. Game on [2,3,4,5,5]. dp[1][5]=16. Score = 6 + 16 = 22.
#   k=1: left=[6,2] (8), right=[3,4,5,5] (17). sum_l < sum_r. Alice gets 8. Game on [3,4,5,5]. dp[2][5]=13. Score = 8 + 13 = 21.
#   k=2: left=[6,2,3] (11), right=[4,5,5] (14). sum_l < sum_r. Alice gets 11. Game on [4,5,5]. dp[3][5]=9. Score = 11 + 9 = 20.
#   k=3: left=[6,2,3,4] (15), right=[5,5] (10). sum_l > sum_r. Alice gets 10. Game on [6,2,3,4]. dp[0][3]=12. Score = 10 + 12 = 22.
#   k=4: left=[6,2,3,4,5] (20), right=[5] (5). sum_l > sum_r. Alice gets 5. Game on [6,2,3,4,5]. dp[0][4]=17. Score = 5 + 17 = 22.
#   dp[0][5] = max(22, 21, 20, 22, 22) = 22.
#
# The example output is 18. My manual trace gives 22. What went wrong?
#
# Let's re-read the example again:
# Example 1:
# Input: stoneValue = [6,2,3,4,5,5]
# Output: 18
# Explanation: In the first round, Alice divides the row to [6,2,3], [4,5,5]. The left row has the value 11 and the right row has value 14. Bob throws away the right row and Alice's score is now 11.
#   This matches my calculation: k=2, left=[6,2,3] (11), right=[4,5,5] (14). sum_l < sum_r. Alice gets 11. Game continues on [4,5,5].
#   So, dp[0][5] with split k=2 should be 11 + dp[3][5]. My dp[3][5] was 9. So 11 + 9 = 20.
#   Wait, this is `dp[0][2]` in the example calculation? No, it's `dp[i][j]` where `i=0, j=5`. The split is at `k=2`.
#   The state for the next game is `[k+1, j]`, which is `[3, 5]`. So `dp[3][5]`.
#   My calculation for `dp[0][5]` with `k=2` was `sum_left + dp[k+1][j]` which is `11 + dp[3][5]`.
#   So if `dp[3][5]` is 9, score is 20.
#
# Let's re-check the example calculation step by step.
# Initial: [6,2,3,4,5,5]. Alice splits into [6,2,3] (sum 11) and [4,5,5] (sum 14).
# Bob throws away [4,5,5] because 14 > 11. Alice's score = 11. Remaining row: [6,2,3].
# Next round, row is [6,2,3]. Alice splits into [6] (sum 6) and [2,3] (sum 5).
# Bob throws away [6] because 6 > 5. Alice's score = 11 + 5 = 16. Remaining row: [2,3].
# Next round, row is [2,3]. Alice splits into [2] (sum 2) and [3] (sum 3).
# Bob throws away [3] because 3 > 2. Alice's score = 16 + 2 = 18. Remaining row: [2].
# Game ends. Alice's total score = 18.
#
# This means that the DP state `dp[i][j]` is indeed the maximum score Alice can get from the subarray `stoneValue[i...j]`.
#
# Let's trace the example's logic with my DP definition.
#
# Row: [6,2,3,4,5,5] (i=0, j=5). Total sum = 25.
# Alice splits into [6,2,3] (i=0, k=2) and [4,5,5] (k+1=3, j=5).
# Sum left = 11. Sum right = 14.
# sum_left < sum_right. Bob throws away right. Alice gets sum_left = 11. Game continues on the right part.
# Wait, "Bob throws away the row which has the maximum value, and Alice's score increases by the value of the remaining row."
# If sum_left < sum_right, Bob throws away right. Remaining row is left. Alice gets sum_left.
# So if sum_left < sum_right, Alice gets sum_left, and game continues on the left part [i...k].
# My interpretation was reversed.
#
# Corrected logic:
# For a split at k (i <= k < j):
# sum_left = sum(stoneValue[i...k])
# sum_right = sum(stoneValue[k+1...j])
#
# Case 1: sum_left < sum_right
#   Bob discards right. Alice's score in this round = sum_left.
#   Game continues with stoneValue[i...k].
#   Total score = sum_left + dp[i][k]
#
# Case 2: sum_left > sum_right
#   Bob discards left. Alice's score in this round = sum_right.
#   Game continues with stoneValue[k+1...j].
#   Total score = sum_right + dp[k+1][j]
#
# Case 3: sum_left == sum_right
#   Alice chooses to maximize her score.
#   Option A: Bob discards right. Alice gets sum_left. Game continues with stoneValue[i...k]. Total score = sum_left + dp[i][k].
#   Option B: Bob discards left. Alice gets sum_right. Game continues with stoneValue[k+1...j]. Total score = sum_right + dp[k+1][j].
#   Alice takes max(sum_left + dp[i][k], sum_right + dp[k+1][j]).
#
# Let's re-trace example 1 with this corrected logic.
# stoneValue = [6,2,3,4,5,5], n=6
# ps = [0, 6, 8, 11, 15, 20, 25]
# dp table 6x6, initialized to 0.
#
# len = 2:
# dp[0][1] ([6,2]): k=0. left=[6](6), right=[2](2). sum_l > sum_r. Alice gets 2. Game on [2] (k+1=1, j=1). dp[1][1]=0. Score = 2 + 0 = 2.
# dp[1][2] ([2,3]): k=1. left=[2](2), right=[3](3). sum_l < sum_r. Alice gets 2. Game on [2] (i=1, k=1). dp[1][1]=0. Score = 2 + 0 = 2.
# dp[2][3] ([3,4]): k=2. left=[3](3), right=[4](4). sum_l < sum_r. Alice gets 3. Game on [3] (i=2, k=2). dp[2][2]=0. Score = 3 + 0 = 3.
# dp[3][4] ([4,5]): k=3. left=[4](4), right=[5](5). sum_l < sum_r. Alice gets 4. Game on [4] (i=3, k=3). dp[3][3]=0. Score = 4 + 0 = 4.
# dp[4][5] ([5,5]): k=4. left=[5](5), right=[5](5). sum_l == sum_r.
#   Option A (discard right): Alice gets 5. Game on [5] (i=4, k=4). dp[4][4]=0. Total = 5 + 0 = 5.
#   Option B (discard left): Alice gets 5. Game on [5] (k+1=5, j=5). dp[5][5]=0. Total = 5 + 0 = 5.
#   dp[4][5] = max(5, 5) = 5.
#
# len = 3:
# dp[0][2] ([6,2,3]): ps[3]-ps[0] = 11.
#   k=0: left=[6](6), right=[2,3](5). sum_l > sum_r. Alice gets 5. Game on [2,3] (k+1=1, j=2). dp[1][2]=2. Score = 5 + 2 = 7.
#   k=1: left=[6,2](8), right=[3](3). sum_l > sum_r. Alice gets 3. Game on [6,2] (i=0, k=1). dp[0][1]=2. Score = 3 + 2 = 5.
#   dp[0][2] = max(7, 5) = 7.
#
# dp[1][3] ([2,3,4]): ps[4]-ps[1] = 9.
#   k=1: left=[2](2), right=[3,4](7). sum_l < sum_r. Alice gets 2. Game on [2] (i=1, k=1). dp[1][1]=0. Score = 2 + 0 = 2.
#   k=2: left=[2,3](5), right=[4](4). sum_l > sum_r. Alice gets 4. Game on [2,3] (k+1=3, j=3). dp[3][3]=0. Score = 4 + 0 = 4.
#   dp[1][3] = max(2, 4) = 4.
#
# dp[2][4] ([3,4,5]): ps[5]-ps[2] = 12.
#   k=2: left=[3](3), right=[4,5](9). sum_l < sum_r. Alice gets 3. Game on [3] (i=2, k=2). dp[2][2]=0. Score = 3 + 0 = 3.
#   k=3: left=[3,4](7), right=[5](5). sum_l > sum_r. Alice gets 5. Game on [3,4] (k+1=4, j=4). dp[4][4]=0. Score = 5 + 0 = 5.
#   dp[2][4] = max(3, 5) = 5.
#
# dp[3][5] ([4,5,5]): ps[6]-ps[3] = 14.
#   k=3: left=[4](4), right=[5,5](10). sum_l < sum_r. Alice gets 4. Game on [4] (i=3, k=3). dp[3][3]=0. Score = 4 + 0 = 4.
#   k=4: left=[4,5](9), right=[5](5). sum_l > sum_r. Alice gets 5. Game on [4,5] (k+1=5, j=5). dp[5][5]=0. Score = 5 + 0 = 5.
#   dp[3][5] = max(4, 5) = 5.
#
# len = 4:
# dp[0][3] ([6,2,3,4]): ps[4]-ps[0] = 15.
#   k=0: left=[6](6), right=[2,3,4](9). sum_l < sum_r. Alice gets 6. Game on [6] (i=0, k=0). dp[0][0]=0. Score = 6 + 0 = 6.
#   k=1: left=[6,2](8), right=[3,4](7). sum_l > sum_r. Alice gets 7. Game on [3,4] (k+1=2, j=3). dp[2][3]=3. Score = 7 + 3 = 10.
#   k=2: left=[6,2,3](11), right=[4](4). sum_l > sum_r. Alice gets 4. Game on [6,2,3] (k+1=3, j=3). dp[3][3]=0. Score = 4 + 0 = 4.
#   dp[0][3] = max(6, 10, 4) = 10.
#
# dp[1][4] ([2,3,4,5]): ps[5]-ps[1] = 14.
#   k=1: left=[2](2), right=[3,4,5](12). sum_l < sum_r. Alice gets 2. Game on [2] (i=1, k=1). dp[1][1]=0. Score = 2 + 0 = 2.
#   k=2: left=[2,3](5), right=[4,5](9). sum_l < sum_r. Alice gets 5. Game on [2,3] (i=1, k=2). dp[1][2]=2. Score = 5 + 2 = 7.
#   k=3: left=[2,3,4](9), right=[5](5). sum_l > sum_r. Alice gets 5. Game on [2,3,4] (k+1=4, j=4). dp[4][4]=0. Score = 5 + 0 = 5.
#   dp[1][4] = max(2, 7, 5) = 7.
#
# dp[2][5] ([3,4,5,5]): ps[6]-ps[2] = 17.
#   k=2: left=[3](3), right=[4,5,5](14). sum_l < sum_r. Alice gets 3. Game on [3] (i=2, k=2). dp[2][2]=0. Score = 3 + 0 = 3.
#   k=3: left=[3,4](7), right=[5,5](10). sum_l < sum_r. Alice gets 7. Game on [3,4] (i=2, k=3). dp[2][3]=3. Score = 7 + 3 = 10.
#   k=4: left=[3,4,5](12), right=[5](5). sum_l > sum_r. Alice gets 5. Game on [3,4,5] (k+1=5, j=5). dp[5][5]=0. Score = 5 + 0 = 5.
#   dp[2][5] = max(3, 10, 5) = 10.
#
# len = 5:
# dp[0][4] ([6,2,3,4,5]): ps[5]-ps[0] = 20.
#   k=0: left=[6](6), right=[2,3,4,5](14). sum_l < sum_r. Alice gets 6. Game on [6] (i=0, k=0). dp[0][0]=0. Score = 6 + 0 = 6.
#   k=1: left=[6,2](8), right=[3,4,5](12). sum_l < sum_r. Alice gets 8. Game on [6,2] (i=0, k=1). dp[0][1]=2. Score = 8 + 2 = 10.
#   k=2: left=[6,2,3](11), right=[4,5](9). sum_l > sum_r. Alice gets 9. Game on [4,5] (k+1=3, j=4). dp[3][4]=4. Score = 9 + 4 = 13.
#   k=3: left=[6,2,3,4](15), right=[5](5). sum_l > sum_r. Alice gets 5. Game on [6,2,3,4] (k+1=4, j=4). dp[4][4]=0. Score = 5 + 0 = 5.
#   dp[0][4] = max(6, 10, 13, 5) = 13.
#
# dp[1][5] ([2,3,4,5,5]): ps[6]-ps[1] = 19.
#   k=1: left=[2](2), right=[3,4,5,5](17). sum_l < sum_r. Alice gets 2. Game on [2] (i=1, k=1). dp[1][1]=0. Score = 2 + 0 = 2.
#   k=2: left=[2,3](5), right=[4,5,5](14). sum_l < sum_r. Alice gets 5. Game on [2,3] (i=1, k=2). dp[1][2]=2. Score = 5 + 2 = 7.
#   k=3: left=[2,3,4](9), right=[5,5](10). sum_l < sum_r. Alice gets 9. Game on [2,3,4] (i=1, k=3). dp[1][3]=4. Score = 9 + 4 = 13.
#   k=4: left=[2,3,4,5](14), right=[5](5). sum_l > sum_r. Alice gets 5. Game on [2,3,4,5] (k+1=5, j=5). dp[5][5]=0. Score = 5 + 0 = 5.
#   dp[1][5] = max(2, 7, 13, 5) = 13.
#
# len = 6:
# dp[0][5] ([6,2,3,4,5,5]): ps[6]-ps[0] = 25.
#   k=0: left=[6](6), right=[2,3,4,5,5](19). sum_l < sum_r. Alice gets 6. Game on [6] (i=0, k=0). dp[0][0]=0. Score = 6 + 0 = 6.
#   k=1: left=[6,2](8), right=[3,4,5,5](17). sum_l < sum_r. Alice gets 8. Game on [6,2] (i=0, k=1). dp[0][1]=2. Score = 8 + 2 = 10.
#   k=2: left=[6,2,3](11), right=[4,5,5](14). sum_l < sum_r. Alice gets 11. Game on [6,2,3] (i=0, k=2). dp[0][2]=7. Score = 11 + 7 = 18.
#   k=3: left=[6,2,3,4](15), right=[5,5](10). sum_l > sum_r. Alice gets 10. Game on [5,5] (k+1=4, j=5). dp[4][5]=5. Score = 10 + 5 = 15.
#   k=4: left=[6,2,3,4,5](20), right=[5](5). sum_l > sum_r. Alice gets 5. Game on [6,2,3,4,5] (k+1=5, j=5). dp[5][5]=0. Score = 5 + 0 = 5.
#   dp[0][5] = max(6, 10, 18, 15, 5) = 18.
#
# This matches the example output! The DP state and transitions are correct now.
# The O(n^3) time complexity seems necessary given the structure.
# The constraints (N=500) suggest O(N^3) might be too slow if N=500, (500^3 = 125,000,000 operations).
# Maybe there's a way to optimize the inner loop.
#
# For fixed `i` and `j`, we iterate `k` from `i` to `j-1`.
# `s_left = ps[k+1] - ps[i]`
# `s_right = ps[j+1] - ps[k+1]`
#
# We want to maximize:
# `score_k = `
#   `if s_left < s_right: s_left + dp[i][k]`
#   `elif s_left > s_right: s_right + dp[k+1][j]`
#   `else: max(s_left + dp[i][k], s_right + dp[k+1][j])`
#
# `dp[i][j] = max(dp[i][j], score_k)`
#
# The key might be to find the split point `k` that approximately equalizes `s_left` and `s_right`.
# `ps[k+1] - ps[i] = ps[j+1] - ps[k+1]`
# `2 * ps[k+1] = ps[i] + ps[j+1]`
# `ps[k+1] = (ps[i] + ps[j+1]) / 2`
#
# For a fixed `i` and `j`, we can use binary search on `k` (from `i` to `j-1`) to find `k_target` such that `ps[k_target+1]` is closest to `(ps[i] + ps[j+1]) / 2`.
#
# Let `target = (ps[i] + ps[j+1]) / 2`.
# We want to find `k` such that `ps[k+1]` is close to `target`.
# We can use `bisect_left` on the prefix sum array `ps` to find `k_idx` where `ps[k_idx]` is just greater than or equal to `target`.
# The corresponding `k` would be `k_idx - 1`.
#
# Let's consider the potential optimal split points around this `k_target`.
# If `k` is such that `s_left < s_right`, we consider `s_left + dp[i][k]`. As `k` increases, `s_left` increases, `dp[i][k]` might fluctuate.
# If `k` is such that `s_left > s_right`, we consider `s_right + dp[k+1][j]`. As `k` increases, `s_right` decreases, `dp[k+1][j]` might fluctuate.
#
# It turns out that for any `i`, `j`, the optimal split `k` has the property that `k` is non-decreasing as `j` increases (for fixed `i`), and `k` is non-increasing as `i` increases (for fixed `j`). This is a property related to the convexity of the "cost" function.
# This allows us to use a two-pointer approach for the inner loop.
#
# Let `opt_k[i][j]` be the optimal split point for `dp[i][j]`.
# When calculating `dp[i][j]`, we know that `opt_k[i][j-1] <= opt_k[i][j] <= opt_k[i+1][j]`.
#
# For `dp[i][j]`:
# The range of possible `k` is `[i, j-1]`.
# We can maintain a `k_pointer` for `dp[i][j]`.
#
# For `len = 2` to `n`:
#   For `i = 0` to `n - len`:
#     `j = i + len - 1`
#     If `len == 2`: `k_pointer = i`
#     Else: `k_pointer = opt_k[i][j-1]` (or `opt_k[i+1][j]`)
#     While `k_pointer < j`:
#       Calculate score for `k_pointer`.
#       If score for `k_pointer` is better than current `dp[i][j]`, update `dp[i][j]` and `opt_k[i][j] = k_pointer`.
#       Consider the case where `k_pointer + 1` might be better.
#       The update rule for `k_pointer` is based on comparing the score from `k_pointer` and `k_pointer + 1`.
#       If `score(k_pointer)` is potentially less than `score(k_pointer + 1)`, we advance `k_pointer`.
#       The condition for advancing `k_pointer` is usually related to the convexity.
#       Specifically, we advance `k_pointer` if `score_at(k_pointer)` is worse than `score_at(k_pointer + 1)`.
#       The "score_at(k)" calculation is the one we defined.
#
# This optimization uses the fact that the optimal split point for `dp[i][j]` lies within the range of optimal split points for subproblems that contribute to `dp[i][j]`.
# The DP relation is of the form `dp[i][j] = min_{i <= k < j} (dp[i][k] + dp[k+1][j] + cost(i, k, j))`. In our case, the structure is slightly different due to Bob's action.
#
# The property that the optimal split `k` for `dp[i][j]` is non-decreasing with `j` (for fixed `i`) and non-increasing with `i` (for fixed `j`) implies that for computing `dp[i][j]`, we don't need to check `k` from `i` to `j-1`. We can start checking `k` from `opt_k[i][j-1]` (or `opt_k[i+1][j]`).
#
# Let's consider `opt_k_start = opt_k[i][j-1]` when computing `dp[i][j]`.
# For `dp[i][j]`, the valid `k` range is `[i, j-1]`.
# We iterate `k` from `i` up to `j-1`.
#
# The O(n^2) approach needs to be carefully implemented. For the scope of this problem, and given that O(N^3) might pass for N=500 if the constant factor is small, let's stick to the O(N^3) for now. The question asked for executable code.
#
# Final check on the DP formulation:
# `dp[i][j]` = max score Alice can get from `stoneValue[i...j]`.
# Base case: `dp[i][i] = 0` for all `i`.
#
# For `len` from 2 to `n`:
#   For `i` from 0 to `n - len`:
#     `j = i + len - 1`
#     `max_score_ij = 0`
#     For `k` from `i` to `j - 1`:
#       `s_left = ps[k+1] - ps[i]`
#       `s_right = ps[j+1] - ps[k+1]`
#
#       `current_round_score = 0`
#       `next_dp_state_score = 0`
#
#       if `s_left < s_right`:
#         `current_round_score = s_left`
#         `next_dp_state_score = dp[i][k]`
#       elif `s_left > s_right`:
#         `current_round_score = s_right`
#         `next_dp_state_score = dp[k+1][j]`
#       else: # s_left == s_right
#         # Alice chooses to maximize her total score
#         # Option 1: Bob discards right (value s_right). Alice gets s_left. Game on left [i, k].
#         score1 = s_left + dp[i][k]
#         # Option 2: Bob discards left (value s_left). Alice gets s_right. Game on right [k+1, j].
#         score2 = s_right + dp[k+1][j]
#         # Alice picks the better option.
#         `max_score_ij = max(max_score_ij, score1, score2)`
#         continue # Skip the general update for this k when s_left == s_right
#
#       `total_score_for_k = current_round_score + next_dp_state_score`
#       `max_score_ij = max(max_score_ij, total_score_for_k)`
#
#     `dp[i][j] = max_score_ij`
#
# The `s_left == s_right` case needs to be handled correctly within the `max_score_ij` update.
# The `continue` statement above is problematic. The loop should simply find the maximum over all `k`.
#
# Corrected logic for the loop:
# For `len` from 2 to `n`:
#   For `i` from 0 to `n - len`:
#     `j = i + len - 1`
#     `max_score_ij = 0`
#     For `k` from `i` to `j - 1`:
#       `s_left = ps[k+1] - ps[i]`
#       `s_right = ps[j+1] - ps[k+1]`
#
#       `score_from_split_k = 0`
#       if `s_left < s_right`:
#         `score_from_split_k = s_left + dp[i][k]`
#       elif `s_left > s_right`:
#         `score_from_split_k = s_right + dp[k+1][j]`
#       else: # s_left == s_right
#         `score_from_split_k = max(s_left + dp[i][k], s_right + dp[k+1][j])`
#
#       `max_score_ij = max(max_score_ij, score_from_split_k)`
#
#     `dp[i][j] = max_score_ij`
#
# This looks correct.
```
class Solution:
    def stoneGameV(self, stoneValue: list[int]) -> int:
        n = len(stoneValue)

        # If there's only one stone, Alice gets 0 score.
        if n == 1:
            return 0

        # Precompute prefix sums for efficient subarray sum calculation.
        # ps[i] will store the sum of stoneValue[0]...stoneValue[i-1].
        # ps[0] = 0.
        ps = [0] * (n + 1)
        for i in range(n):
            ps[i + 1] = ps[i] + stoneValue[i]

        # dp[i][j] will store the maximum score Alice can obtain from the subarray
        # stoneValue[i...j] (inclusive).
        # Initialize dp table with zeros. The size is n x n.
        dp = [[0] * n for _ in range(n)]

        # Iterate over the length of the subarray, from 2 up to n.
        # 'length' represents the number of stones in the current subarray being considered.
        for length in range(2, n + 1):
            # Iterate over all possible starting indices 'i' for subarrays of the current 'length'.
            for i in range(n - length + 1):
                # Calculate the ending index 'j' for the current subarray.
                j = i + length - 1

                # 'max_score_ij' will store the maximum score Alice can get for the subarray stoneValue[i...j].
                # Initialize it to 0, as Alice's score can only increase.
                max_score_ij = 0

                # Iterate over all possible split points 'k' for the subarray stoneValue[i...j].
                # A split at 'k' divides the subarray into stoneValue[i...k] (left part)
                # and stoneValue[k+1...j] (right part).
                # 'k' ranges from 'i' up to 'j-1', ensuring both parts are non-empty.
                for k in range(i, j):
                    # Calculate the sum of the left part: stoneValue[i...k].
                    # Using prefix sums: sum(i to k) = ps[k+1] - ps[i].
                    sum_left = ps[k + 1] - ps[i]

                    # Calculate the sum of the right part: stoneValue[k+1...j].
                    # Using prefix sums: sum(k+1 to j) = ps[j+1] - ps[k+1].
                    sum_right = ps[j + 1] - ps[k + 1]

                    # Variable to store the total score Alice gets for this specific split 'k'.
                    score_from_split_k = 0

                    # Determine the outcome based on the comparison of left and right sums,
                    # and update Alice's score and the next subproblem state.
                    if sum_left < sum_right:
                        # If left sum is smaller, Bob discards the right row.
                        # Alice's score increases by the value of the left row (sum_left).
                        # The game continues with the left subarray (stoneValue[i...k]).
                        score_from_split_k = sum_left + dp[i][k]
                    elif sum_left > sum_right:
                        # If right sum is smaller, Bob discards the left row.
                        # Alice's score increases by the value of the right row (sum_right).
                        # The game continues with the right subarray (stoneValue[k+1...j]).
                        score_from_split_k = sum_right + dp[k + 1][j]
                    else: # sum_left == sum_right
                        # If the sums are equal, Alice decides which row to throw away.
                        # She will choose the option that maximizes her total score.
                        # Option 1: Alice discards the right row (Bob would have discarded it).
                        #   Alice gets sum_left. Game continues on stoneValue[i...k].
                        score_option1 = sum_left + dp[i][k]
                        # Option 2: Alice discards the left row (Bob would have discarded it).
                        #   Alice gets sum_right. Game continues on stoneValue[k+1...j].
                        score_option2 = sum_right + dp[k + 1][j]
                        # Alice chooses the maximum of these two options.
                        score_from_split_k = max(score_option1, score_option2)

                    # Update the maximum score obtainable for the current subarray stoneValue[i...j]
                    # by considering the score from the current split 'k'.
                    max_score_ij = max(max_score_ij, score_from_split_k)

                # Store the maximum score for the subarray stoneValue[i...j] in the DP table.
                dp[i][j] = max_score_ij

        # The final answer is the maximum score Alice can obtain from the entire array,
        # which is stored in dp[0][n-1].
        return dp[0][n - 1]

```