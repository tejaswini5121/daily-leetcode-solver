```python
# Summary: Find the maximum dot product of non-empty subsequences of equal length from two given arrays.
# Link: https://leetcode.com/problems/max-dot-product-of-two-subsequences/
# Approach:
# This problem can be solved using dynamic programming. We define dp[i][j] as the maximum dot product considering
# the first i elements of nums1 and the first j elements of nums2.
# There are two main decisions at each step (i, j):
# 1. Include nums1[i-1] and nums2[j-1] in the subsequences: The dot product will be nums1[i-1] * nums2[j-1]
#    plus the maximum dot product from dp[i-1][j-1].
# 2. Exclude either nums1[i-1] or nums2[j-1] (or both) from consideration for the current step. This means
#    the maximum dot product would be either dp[i-1][j] or dp[i][j-1].
# The recurrence relation becomes:
# dp[i][j] = max(nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1]),  # Option 1: include both, add product, if positive
#                dp[i-1][j],                                    # Option 2: exclude nums1[i-1]
#                dp[i][j-1])                                    # Option 3: exclude nums2[j-1]
#
# However, the above recurrence has a flaw. If we have all negative numbers, simply adding max(0, dp[i-1][j-1])
# might lead to incorrect results if the optimal solution involves only negative products.
#
# A more robust DP state would be:
# dp[i][j] = maximum dot product of a subsequence of nums1[:i] and a subsequence of nums2[:j] that *must* end
# with nums1[i-1] and nums2[j-1] respectively.
#
# Then, the overall maximum dot product would be the maximum value in the entire dp table.
#
# The recurrence for this state is:
# dp[i][j] = nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1])  # Current product + previous best product ending at i-1, j-1
#                                                          # If dp[i-1][j-1] is negative, we don't want to carry it over,
#                                                          # hence max(0, ...) ensures we start a new subsequence if it improves.
#
# To handle cases where the optimal solution involves taking a single element from each array (e.g., only one positive element),
# and to ensure we consider subsequences that don't necessarily extend previous ones, we also need to consider:
#
# dp[i][j] = max(nums1[i-1] * nums2[j-1],  # The dot product of just these two elements as a subsequence of length 1
#                nums1[i-1] * nums2[j-1] + dp[i-1][j-1], # Current product extending the best subsequence ending at i-1, j-1
#                dp[i-1][j],  # Max dot product considering nums1[:i-1] and nums2[:j]
#                dp[i][j-1])  # Max dot product considering nums1[:i] and nums2[:j-1]
#
# However, the definition of dp[i][j] as the maximum dot product of subsequences of nums1[:i] and nums2[:j] (not necessarily ending at i-1, j-1)
# is more standard for this type of problem. Let's refine that:
#
# dp[i][j] = maximum dot product of *any* non-empty subsequence of nums1[:i] and *any* non-empty subsequence of nums2[:j].
#
# At dp[i][j], we have the following options:
# 1. The maximum dot product does not involve nums1[i-1]. This is dp[i-1][j].
# 2. The maximum dot product does not involve nums2[j-1]. This is dp[i][j-1].
# 3. The maximum dot product involves both nums1[i-1] and nums2[j-1].
#    a. These two form a subsequence of length 1: nums1[i-1] * nums2[j-1].
#    b. These two extend a previous subsequence: nums1[i-1] * nums2[j-1] + dp[i-1][j-1].
#
# So,
# dp[i][j] = max(dp[i-1][j], dp[i][j-1], nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1]))
#
# The `max(0, dp[i-1][j-1])` part is crucial. If `dp[i-1][j-1]` is negative, it means any subsequence ending there
# yields a negative dot product. In such cases, it's better to start a new subsequence with `nums1[i-1] * nums2[j-1]`
# rather than extending a negative sum.
#
# Initialisation:
# The DP table needs to be initialized. A common practice is to use negative infinity for states that are not yet computed
# or represent invalid states. However, since we are guaranteed non-empty subsequences and the problem asks for the maximum,
# we can initialize the DP table with a very small negative number to represent "not achievable yet".
#
# Let's use a DP table of size (m+1) x (n+1) where m = len(nums1) and n = len(nums2).
# dp[i][j] will store the max dot product considering nums1[:i] and nums2[:j].
#
# The base cases: dp[0][j] and dp[i][0] are not really used in the direct recurrence as they represent empty prefixes.
#
# A key edge case is when all numbers in one of the arrays are negative, and all numbers in the other are also negative.
# In this scenario, the maximum dot product will be the product of the largest (least negative) numbers from each array.
# For example, nums1 = [-1, -2], nums2 = [-3, -4]. The max dot product is (-1) * (-3) = 3.
#
# If all numbers are negative, the `max(0, dp[i-1][j-1])` logic might prevent finding the actual maximum.
#
# A simpler DP formulation often used for Longest Common Subsequence style problems that can be adapted here:
# Let dp[i][j] be the maximum dot product of a subsequence of nums1[:i] and a subsequence of nums2[:j].
#
# When considering nums1[i-1] and nums2[j-1]:
# 1. We can form a subsequence of length 1 using these two: `nums1[i-1] * nums2[j-1]`.
# 2. We can extend the best subsequence from `dp[i-1][j-1]` by adding `nums1[i-1] * nums2[j-1]`.
#    This product is `nums1[i-1] * nums2[j-1] + dp[i-1][j-1]`.
# 3. The maximum dot product might not involve `nums1[i-1]` (so we take `dp[i-1][j]`).
# 4. The maximum dot product might not involve `nums2[j-1]` (so we take `dp[i][j-1]`).
#
# Thus, `dp[i][j]` is the maximum of:
#   - `dp[i-1][j]` (don't use nums1[i-1])
#   - `dp[i][j-1]` (don't use nums2[j-1])
#   - `nums1[i-1] * nums2[j-1]` (use only these two as subsequences of length 1)
#   - `nums1[i-1] * nums2[j-1] + dp[i-1][j-1]` (extend the best subsequence from previous states)
#
# The state definition where `dp[i][j]` is the max dot product ending with `nums1[i-1]` and `nums2[j-1]` is more suitable.
# Let `dp[i][j]` be the maximum dot product using a subsequence of `nums1[:i]` and a subsequence of `nums2[:j]`,
# where the subsequence from `nums1` *must* include `nums1[i-1]` and the subsequence from `nums2` *must* include `nums2[j-1]`.
#
# Then, the recurrence is:
# `dp[i][j] = nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1])`
# The `max(0, dp[i-1][j-1])` is to ensure that if the previous best dot product ending at `(i-1, j-1)` was negative,
# we can choose to start a new subsequence from `(i, j)` instead of carrying over a negative value.
#
# The overall maximum dot product will then be the maximum value in the `dp` table.
#
# Initialisation:
# `dp` table of size `(m+1) x (n+1)`.
# Initialize all entries with negative infinity.
# When calculating `dp[i][j]`:
# `val = nums1[i-1] * nums2[j-1]`
# `dp[i][j] = val` (This is the dot product if we take only these two elements)
# `if dp[i-1][j-1] != -inf:`
#   `dp[i][j] = max(dp[i][j], val + dp[i-1][j-1])` (Extend previous best)
#
# This still doesn't correctly account for cases like `[-1,-1]` and `[1,1]` where the answer is -1.
# The state definition `dp[i][j]` as the maximum dot product of subsequences of `nums1[:i]` and `nums2[:j]`
# which *may or may not* include `nums1[i-1]` and `nums2[j-1]` respectively, is more standard.
#
# Let `dp[i][j]` be the maximum dot product of subsequences of `nums1[:i]` and `nums2[:j]`.
#
# `dp[i][j]` can be derived from:
# 1. `dp[i-1][j]` (maximum dot product without considering `nums1[i-1]`)
# 2. `dp[i][j-1]` (maximum dot product without considering `nums2[j-1]`)
# 3. The dot product formed by including `nums1[i-1]` and `nums2[j-1]`.
#    This can be `nums1[i-1] * nums2[j-1]` (if they form a subsequence of length 1)
#    OR `nums1[i-1] * nums2[j-1] + dp[i-1][j-1]` (if they extend a previous subsequence).
#
# To ensure we get the maximum, we should take the maximum over all these possibilities.
#
# `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`  # Carry over the best from previous states
# `current_product = nums1[i-1] * nums2[j-1]`
#
# Now, we need to consider including `nums1[i-1]` and `nums2[j-1]`.
# If `dp[i-1][j-1]` is the maximum dot product of subsequences from `nums1[:i-1]` and `nums2[:j-1]`,
# then `current_product + dp[i-1][j-1]` is a candidate.
#
# The issue is the "non-empty subsequence" constraint.
#
# Let's use `dp[i][j]` to represent the maximum dot product of non-empty subsequences of `nums1[:i]` and `nums2[:j]`.
#
# Transitions for `dp[i][j]`:
#
# Option 1: We don't include `nums1[i-1]` in our subsequences. The maximum dot product is `dp[i-1][j]`.
# Option 2: We don't include `nums2[j-1]` in our subsequences. The maximum dot product is `dp[i][j-1]`.
# Option 3: We include both `nums1[i-1]` and `nums2[j-1]`.
#    This product is `nums1[i-1] * nums2[j-1]`.
#    If we are extending a previous best subsequence (whose max dot product is `dp[i-1][j-1]`),
#    the new dot product is `nums1[i-1] * nums2[j-1] + dp[i-1][j-1]`.
#    However, if `dp[i-1][j-1]` is negative, it's better to just take `nums1[i-1] * nums2[j-1]` by itself
#    as a subsequence of length 1.
#
# So, when considering `nums1[i-1]` and `nums2[j-1]`:
# `prod = nums1[i-1] * nums2[j-1]`
# `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`  # Carry over best from excluding one of the current elements
# `dp[i][j] = max(dp[i][j], prod)`         # Consider prod as a subsequence of length 1
# `if dp[i-1][j-1] != -infinity:`         # If there was a valid previous subproblem
#   `dp[i][j] = max(dp[i][j], prod + dp[i-1][j-1])` # Extend previous best
#
# The base cases and initialization are critical.
# Let `dp[i][j]` be the maximum dot product using `nums1[:i]` and `nums2[:j]`.
# Initialize `dp` table of size `(m+1) x (n+1)` with a very small negative number (e.g., `float('-inf')`).
#
# For `i` from 1 to `m`:
#   For `j` from 1 to `n`:
#     `prod = nums1[i-1] * nums2[j-1]`
#     `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`  # Max if we don't use current pair
#     `dp[i][j] = max(dp[i][j], prod)`        # Max if we use current pair as a length-1 subsequence
#     `if dp[i-1][j-1] != float('-inf'):`
#       `dp[i][j] = max(dp[i][j], prod + dp[i-1][j-1])` # Max if we extend previous subsequence
#
# The final answer is `dp[m][n]`.
#
# Example 1 walk-through: nums1 = [2,1,-2,5], nums2 = [3,0,-6]
# m = 4, n = 3
# dp table of size 5x4 initialized with -inf
#
# i=1, nums1[0]=2
#   j=1, nums2[0]=3
#     prod = 2*3 = 6
#     dp[1][1] = max(-inf, -inf) = -inf
#     dp[1][1] = max(-inf, 6) = 6
#     dp[1][1] = max(6, 6 + dp[0][0]) = max(6, 6 - inf) = 6  (since dp[0][0] is -inf, this condition doesn't apply)
#
#   j=2, nums2[1]=0
#     prod = 2*0 = 0
#     dp[1][2] = max(dp[0][2], dp[1][1]) = max(-inf, 6) = 6
#     dp[1][2] = max(6, 0) = 6
#     dp[1][2] = max(6, 0 + dp[0][1]) = max(6, 0 - inf) = 6
#
#   j=3, nums2[2]=-6
#     prod = 2*(-6) = -12
#     dp[1][3] = max(dp[0][3], dp[1][2]) = max(-inf, 6) = 6
#     dp[1][3] = max(6, -12) = 6
#     dp[1][3] = max(6, -12 + dp[0][2]) = max(6, -12 - inf) = 6
#
# i=2, nums1[1]=1
#   j=1, nums2[0]=3
#     prod = 1*3 = 3
#     dp[2][1] = max(dp[1][1], dp[2][0]) = max(6, -inf) = 6
#     dp[2][1] = max(6, 3) = 6
#     dp[2][1] = max(6, 3 + dp[1][0]) = max(6, 3 - inf) = 6
#
#   j=2, nums2[1]=0
#     prod = 1*0 = 0
#     dp[2][2] = max(dp[1][2], dp[2][1]) = max(6, 6) = 6
#     dp[2][2] = max(6, 0) = 6
#     dp[2][2] = max(6, 0 + dp[1][1]) = max(6, 0 + 6) = 6
#
#   j=3, nums2[2]=-6
#     prod = 1*(-6) = -6
#     dp[2][3] = max(dp[1][3], dp[2][2]) = max(6, 6) = 6
#     dp[2][3] = max(6, -6) = 6
#     dp[2][3] = max(6, -6 + dp[1][2]) = max(6, -6 + 6) = 6
#
# i=3, nums1[2]=-2
#   j=1, nums2[0]=3
#     prod = -2*3 = -6
#     dp[3][1] = max(dp[2][1], dp[3][0]) = max(6, -inf) = 6
#     dp[3][1] = max(6, -6) = 6
#     dp[3][1] = max(6, -6 + dp[2][0]) = max(6, -6 - inf) = 6
#
#   j=2, nums2[1]=0
#     prod = -2*0 = 0
#     dp[3][2] = max(dp[2][2], dp[3][1]) = max(6, 6) = 6
#     dp[3][2] = max(6, 0) = 6
#     dp[3][2] = max(6, 0 + dp[2][1]) = max(6, 0 + 6) = 6
#
#   j=3, nums2[2]=-6
#     prod = -2*(-6) = 12
#     dp[3][3] = max(dp[2][3], dp[3][2]) = max(6, 6) = 6
#     dp[3][3] = max(6, 12) = 12
#     dp[3][3] = max(12, 12 + dp[2][2]) = max(12, 12 + 6) = 18  <-- Correctly captures 18
#
# i=4, nums1[3]=5
#   j=1, nums2[0]=3
#     prod = 5*3 = 15
#     dp[4][1] = max(dp[3][1], dp[4][0]) = max(6, -inf) = 6
#     dp[4][1] = max(6, 15) = 15
#     dp[4][1] = max(15, 15 + dp[3][0]) = max(15, 15 - inf) = 15
#
#   j=2, nums2[1]=0
#     prod = 5*0 = 0
#     dp[4][2] = max(dp[3][2], dp[4][1]) = max(6, 15) = 15
#     dp[4][2] = max(15, 0) = 15
#     dp[4][2] = max(15, 0 + dp[3][1]) = max(15, 0 + 6) = 15
#
#   j=3, nums2[2]=-6
#     prod = 5*(-6) = -30
#     dp[4][3] = max(dp[3][3], dp[4][2]) = max(18, 15) = 18
#     dp[4][3] = max(18, -30) = 18
#     dp[4][3] = max(18, -30 + dp[3][2]) = max(18, -30 + 6) = max(18, -24) = 18
#
# Final answer is dp[4][3] = 18.
#
# Consider Example 3: nums1 = [-1,-1], nums2 = [1,1]
# m=2, n=2
# dp table 3x3
#
# i=1, nums1[0]=-1
#   j=1, nums2[0]=1
#     prod = -1*1 = -1
#     dp[1][1] = max(-inf, -inf) = -inf
#     dp[1][1] = max(-inf, -1) = -1
#     dp[1][1] = max(-1, -1 + dp[0][0]) = -1
#
#   j=2, nums2[1]=1
#     prod = -1*1 = -1
#     dp[1][2] = max(dp[0][2], dp[1][1]) = max(-inf, -1) = -1
#     dp[1][2] = max(-1, -1) = -1
#     dp[1][2] = max(-1, -1 + dp[0][1]) = -1
#
# i=2, nums1[1]=-1
#   j=1, nums2[0]=1
#     prod = -1*1 = -1
#     dp[2][1] = max(dp[1][1], dp[2][0]) = max(-1, -inf) = -1
#     dp[2][1] = max(-1, -1) = -1
#     dp[2][1] = max(-1, -1 + dp[1][0]) = -1
#
#   j=2, nums2[1]=1
#     prod = -1*1 = -1
#     dp[2][2] = max(dp[1][2], dp[2][1]) = max(-1, -1) = -1
#     dp[2][2] = max(-1, -1) = -1
#     dp[2][2] = max(-1, -1 + dp[1][1]) = max(-1, -1 + (-1)) = max(-1, -2) = -1
#
# Final answer dp[2][2] = -1. This logic seems to work for all cases.
#
# Time complexity: O(m * n) where m is the length of nums1 and n is the length of nums2, due to the nested loops for the DP table.
# Space complexity: O(m * n) for storing the DP table. This can be optimized to O(min(m, n)) by using only two rows or one row,
# but given the constraints (m, n <= 500), O(m*n) space is acceptable.
#
# Optimization: Space complexity can be reduced to O(min(m, n)) by using only two rows of the DP table since each state
# `dp[i][j]` only depends on `dp[i-1][j]`, `dp[i][j-1]`, and `dp[i-1][j-1]`. We can iterate such that we only need
# the previous row and the current row.
# Let's use `dp[j]` to store the max dot product for `nums1[:i]` and `nums2[:j]`. We'll need a temporary variable to store `dp[i-1][j-1]`
# (which is the `prev_diag` value from the previous iteration of `j`).
#
# Optimized DP approach (using O(n) space where n is the length of the shorter array, or just n):
# Let dp[j] store the maximum dot product considering `nums1[:i]` and `nums2[:j]`.
# We iterate through `nums1` (outer loop `i`), and for each `i`, we compute the `dp` array for `nums2`.
#
# For each `i` from 1 to `m`:
#   `prev_diag = float('-inf')`  # Represents dp[i-1][j-1] for the current j
#   For each `j` from 1 to `n`:
#     `temp = dp[j]`  # Store dp[i-1][j] before it's overwritten
#     `prod = nums1[i-1] * nums2[j-1]`
#
#     # The values available:
#     # dp[j] (before update): represents dp[i-1][j]
#     # dp[j-1] (current value): represents dp[i][j-1]
#     # prev_diag: represents dp[i-1][j-1]
#
#     # Option 1 & 2: Don't use current elements, carry over from previous
#     `dp[j] = max(dp[j], dp[j-1])`  # max(dp[i-1][j], dp[i][j-1])
#
#     # Option 3a: Use current elements as length-1 subsequence
#     `dp[j] = max(dp[j], prod)`
#
#     # Option 3b: Extend previous subsequence
#     `if prev_diag != float('-inf'):`
#       `dp[j] = max(dp[j], prod + prev_diag)`
#
#     `prev_diag = temp`  # Update prev_diag for the next iteration of j
#
# This O(n) space approach needs careful initialization and handling of the base cases where `dp[0]` is used.
# Let's redefine `dp[j]` to be the max dot product of subsequences of `nums1[:i]` and `nums2[:j]`.
# When processing `nums1[i-1]`, we update `dp` for `nums2[:j]`.
#
# Let `dp[j]` store `max_dot_product(nums1[:i], nums2[:j])`.
# Initialize `dp` of size `n+1` with `float('-inf')`.
#
# For `i` from 1 to `m`:
#   `prev_diag = float('-inf')` # Stores dp[i-1][j-1]
#   For `j` from 1 to `n`:
#     `temp_dp_j = dp[j]` # Store dp[i-1][j]
#     `prod = nums1[i-1] * nums2[j-1]`
#
#     # Calculate dp[i][j]
#     # Option 1: Max dot product from nums1[:i-1] and nums2[:j]
#     `val1 = dp[j]`
#     # Option 2: Max dot product from nums1[:i] and nums2[:j-1]
#     `val2 = dp[j-1]`
#     # Option 3: Dot product using current elements
#     `val3 = prod`
#     # Option 4: Extend previous best
#     `val4 = prod + prev_diag` if `prev_diag != float('-inf')` else `float('-inf')`
#
#     `dp[j] = max(val1, val2, val3, val4)` # This is incorrect logic.
#
# The O(m*n) space approach is simpler to implement correctly first.
#
# Re-thinking the O(m*n) DP state definition.
# Let `dp[i][j]` be the maximum dot product of any non-empty subsequence of `nums1[:i]` and any non-empty subsequence of `nums2[:j]`.
#
# For `dp[i][j]`:
# We have the following choices for subsequences using `nums1[:i]` and `nums2[:j]`:
#
# 1. The maximum dot product does not involve `nums1[i-1]`. The result is `dp[i-1][j]`.
# 2. The maximum dot product does not involve `nums2[j-1]`. The result is `dp[i][j-1]`.
# 3. The maximum dot product involves both `nums1[i-1]` and `nums2[j-1]`.
#    a. These two elements form subsequences of length 1: `nums1[i-1] * nums2[j-1]`.
#    b. These two elements extend previous subsequences: `nums1[i-1] * nums2[j-1] + dp[i-1][j-1]`.
#
# So, `dp[i][j]` should be the maximum of these possibilities.
# `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`  # Options 1 and 2
#
# Then, consider using `nums1[i-1]` and `nums2[j-1]`.
# `current_prod = nums1[i-1] * nums2[j-1]`
#
# `dp[i][j] = max(dp[i][j], current_prod)` # Option 3a: use them as length-1 subsequences
#
# `if dp[i-1][j-1] != float('-inf'):`  # If there was a valid previous subsequence
#   `dp[i][j] = max(dp[i][j], current_prod + dp[i-1][j-1])` # Option 3b: extend previous
#
# Initialization:
# `dp` table of size `(m+1) x (n+1)`.
# Initialize `dp[0][:]` and `dp[:][0]` to `float('-inf')` to represent that no valid non-empty subsequence can be formed from an empty prefix.
#
# The final answer is `dp[m][n]`.
#
# Edge case: What if all numbers are negative, e.g., nums1 = [-1], nums2 = [-1]?
# m=1, n=1
# dp table 2x2
# dp[0][0] = dp[0][1] = dp[1][0] = -inf
#
# i=1, j=1:
#   nums1[0]=-1, nums2[0]=-1
#   prod = (-1)*(-1) = 1
#   dp[1][1] = max(dp[0][1], dp[1][0]) = max(-inf, -inf) = -inf
#   dp[1][1] = max(-inf, prod) = max(-inf, 1) = 1
#   dp[1][1] = max(1, prod + dp[0][0]) = max(1, 1 + (-inf)) = 1.
# This is incorrect. The answer should be 1. Wait, the example says -1 for [-1,-1] and [1,1].
# Ah, for nums1 = [-1,-1], nums2 = [1,1], the subsequences are [-1] from nums1 and [1] from nums2. Dot product = -1.
#
# The definition of dp[i][j] must be: "maximum dot product of non-empty subsequences of nums1[:i] and nums2[:j]"
#
# Let's check the edge case when all numbers are negative.
# nums1 = [-1, -2], nums2 = [-3, -4]
# m=2, n=2
# dp table 3x3
# dp[0][:] = dp[:][0] = -inf
#
# i=1, nums1[0]=-1
#   j=1, nums2[0]=-3. prod = 3
#     dp[1][1] = max(dp[0][1], dp[1][0]) = -inf
#     dp[1][1] = max(-inf, 3) = 3
#     dp[1][1] = max(3, 3 + dp[0][0]) = 3
#
#   j=2, nums2[1]=-4. prod = 4
#     dp[1][2] = max(dp[0][2], dp[1][1]) = max(-inf, 3) = 3
#     dp[1][2] = max(3, 4) = 4
#     dp[1][2] = max(4, 4 + dp[0][1]) = 4
#
# i=2, nums1[1]=-2
#   j=1, nums2[0]=-3. prod = 6
#     dp[2][1] = max(dp[1][1], dp[2][0]) = max(3, -inf) = 3
#     dp[2][1] = max(3, 6) = 6
#     dp[2][1] = max(6, 6 + dp[1][0]) = 6
#
#   j=2, nums2[1]=-4. prod = 8
#     dp[2][2] = max(dp[1][2], dp[2][1]) = max(4, 6) = 6
#     dp[2][2] = max(6, 8) = 8
#     dp[2][2] = max(8, 8 + dp[1][1]) = max(8, 8 + 3) = 11.
#
# The expected answer for [-1,-2] and [-3,-4] is:
# Subsequence [-1] and [-3] -> dot product = 3
# Subsequence [-1] and [-4] -> dot product = 4
# Subsequence [-2] and [-3] -> dot product = 6
# Subsequence [-2] and [-4] -> dot product = 8
# Subsequence [-1,-2] and [-3,-4] -> dot product = (-1)*(-3) + (-2)*(-4) = 3 + 8 = 11.
# So, 11 is correct.
#
# The DP formulation seems to be:
# dp[i][j] = maximum dot product using nums1[:i] and nums2[:j].
#
# To compute dp[i][j]:
# We have two main scenarios:
# 1. The subsequences do NOT include `nums1[i-1]` and `nums2[j-1]` together.
#    In this case, the max dot product is `max(dp[i-1][j], dp[i][j-1])`.
# 2. The subsequences DO include `nums1[i-1]` and `nums2[j-1]`.
#    a. They form a subsequence of length 1: `nums1[i-1] * nums2[j-1]`.
#    b. They extend a previous subsequence ending at `(i-1, j-1)`.
#       The product here is `nums1[i-1] * nums2[j-1] + dp[i-1][j-1]`.
#       Crucially, we should only add `dp[i-1][j-1]` if it's positive, otherwise, it's better to start a new subsequence.
#       No, this logic is flawed for negative numbers. The correct logic for extending is `nums1[i-1] * nums2[j-1] + dp[i-1][j-1]`,
#       but `dp[i-1][j-1]` itself already represents the maximum, which could be negative.
#
# Let's refine the case of including `nums1[i-1]` and `nums2[j-1]`:
# The product contributed by these two elements is `nums1[i-1] * nums2[j-1]`.
# To this, we can either add the best dot product from `dp[i-1][j-1]` or add 0 (effectively starting a new subsequence).
# So, the value considering these two elements is `nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1])`.
#
# Therefore, the recurrence relation:
# `dp[i][j] = max(dp[i-1][j], dp[i][j-1], nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1]))`
#
# This formula ensures we consider:
# - Not using `nums1[i-1]` (covered by `dp[i-1][j]`)
# - Not using `nums2[j-1]` (covered by `dp[i][j-1]`)
# - Using both `nums1[i-1]` and `nums2[j-1]`. This is achieved by `nums1[i-1] * nums2[j-1]` plus the best
#   previous sum. If the best previous sum `dp[i-1][j-1]` is negative, `max(0, dp[i-1][j-1])` will be 0,
#   meaning we effectively start a new subsequence with `nums1[i-1] * nums2[j-1]`.
#
# Initialization:
# `dp` table of size `(m+1) x (n+1)` with `float('-inf')`.
# The base cases `dp[0][j]` and `dp[i][0]` remain `float('-inf')` because an empty prefix cannot form a non-empty subsequence.
#
# Let's re-trace Example 3: nums1 = [-1,-1], nums2 = [1,1]
# m=2, n=2
# dp table 3x3, initialized with -inf
#
# i=1, nums1[0]=-1
#   j=1, nums2[0]=1. prod = -1. max(0, dp[0][0]) = 0
#     dp[1][1] = max(dp[0][1], dp[1][0], -1 + max(0, dp[0][0]))
#              = max(-inf, -inf, -1 + max(0, -inf)) = max(-inf, -inf, -1 + 0) = -1
#
#   j=2, nums2[1]=1. prod = -1. max(0, dp[0][1]) = 0
#     dp[1][2] = max(dp[0][2], dp[1][1], -1 + max(0, dp[0][1]))
#              = max(-inf, -1, -1 + max(0, -inf)) = max(-inf, -1, -1 + 0) = -1
#
# i=2, nums1[1]=-1
#   j=1, nums2[0]=1. prod = -1. max(0, dp[1][0]) = 0
#     dp[2][1] = max(dp[1][1], dp[2][0], -1 + max(0, dp[1][0]))
#              = max(-1, -inf, -1 + max(0, -inf)) = max(-1, -inf, -1 + 0) = -1
#
#   j=2, nums2[1]=1. prod = -1. max(0, dp[1][1]) = max(0, -1) = 0
#     dp[2][2] = max(dp[1][2], dp[2][1], -1 + max(0, dp[1][1]))
#              = max(-1, -1, -1 + max(0, -1)) = max(-1, -1, -1 + 0) = -1
#
# Final answer dp[2][2] = -1. This seems correct.
#
# The `max(0, dp[i-1][j-1])` part handles the case where the previous best is negative and it's better to start a new subsequence.
# This looks like the correct DP formulation for this problem.
#
# Time complexity: O(m * n)
# Space complexity: O(m * n)
#
# For the O(n) space optimization:
# We can use two arrays, `prev_dp` and `curr_dp`, of size `n+1`.
# `prev_dp` will store the values for `dp[i-1][:]`
# `curr_dp` will store the values for `dp[i][:]`
#
# For `i` from 1 to `m`:
#   `curr_dp[0] = float('-inf')`
#   For `j` from 1 to `n`:
#     `prod = nums1[i-1] * nums2[j-1]`
#     `prev_diag_val = prev_dp[j-1]`
#     `curr_dp[j] = max(prev_dp[j], curr_dp[j-1], prod + max(0, prev_diag_val))`
#   `prev_dp = curr_dp[:]` # Copy current to previous for next iteration.
#
# The base cases need careful handling. `prev_dp` should be initialized with `-inf` everywhere.
#
# Let's consider the initialization of `prev_dp` correctly.
#
# `prev_dp = [float('-inf')] * (n + 1)`
#
# For `i` from 1 to `m`:
#   `curr_dp = [float('-inf')] * (n + 1)`
#   For `j` from 1 to `n`:
#     `prod = nums1[i-1] * nums2[j-1]`
#     `prev_diag_val = prev_dp[j-1]`
#
#     # Transition:
#     # dp[i][j] = max(dp[i-1][j], dp[i][j-1], nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1]))
#
#     # In terms of prev_dp and curr_dp:
#     # dp[i-1][j]   -> prev_dp[j]
#     # dp[i][j-1]   -> curr_dp[j-1]
#     # dp[i-1][j-1] -> prev_dp[j-1]
#
#     `curr_dp[j] = max(prev_dp[j], curr_dp[j-1])` # Max if we don't use the current pair
#     `current_pair_contrib = prod + max(0, prev_diag_val)` # Consider using the current pair
#     `curr_dp[j] = max(curr_dp[j], current_pair_contrib)`
#
#   `prev_dp = curr_dp` # Update prev_dp for the next outer loop iteration
#
# After the loop, the result is `prev_dp[n]`.
#
# This optimized version seems correct.
#
# Time complexity: O(m * n)
# Space complexity: O(n) (or O(min(m, n)) if we ensure n is the length of the shorter array).

```python
class Solution:
    def maxDotProduct(self, nums1: list[int], nums2: list[int]) -> int:
        m, n = len(nums1), len(nums2)

        # DP state definition:
        # dp[i][j] will store the maximum dot product of non-empty subsequences
        # of nums1[:i] (first i elements of nums1) and nums2[:j] (first j elements of nums2).
        #
        # Initialize DP table with a very small negative number to represent
        # states that are not yet computed or unreachable for non-empty subsequences.
        # We use float('-inf') to handle cases where all products are negative.
        # The table size is (m+1) x (n+1) to handle base cases (empty prefixes).
        dp = [[float('-inf')] * (n + 1) for _ in range(m + 1)]

        # Iterate through nums1 (outer loop)
        for i in range(1, m + 1):
            # Iterate through nums2 (inner loop)
            for j in range(1, n + 1):
                # Current product of the elements nums1[i-1] and nums2[j-1]
                current_prod = nums1[i - 1] * nums2[j - 1]

                # There are a few possibilities for dp[i][j]:
                # 1. The maximum dot product does not involve nums1[i-1].
                #    In this case, it's the same as the max dot product for nums1[:i-1] and nums2[:j], which is dp[i-1][j].
                # 2. The maximum dot product does not involve nums2[j-1].
                #    In this case, it's the same as the max dot product for nums1[:i] and nums2[:j-1], which is dp[i][j-1].
                # 3. The maximum dot product involves both nums1[i-1] and nums2[j-1].
                #    a. These two elements form subsequences of length 1. The dot product is current_prod.
                #    b. These two elements extend a previous subsequence ending at nums1[i-2] and nums2[j-2].
                #       The dot product would be current_prod + dp[i-1][j-1].
                #       However, if dp[i-1][j-1] is negative, it's better to start a new subsequence with just current_prod.
                #       This is handled by `current_prod + max(0, dp[i-1][j-1])`.
                #       The `max(0, ...)` ensures that if `dp[i-1][j-1]` is negative, we effectively consider starting a new subsequence
                #       from the current elements `nums1[i-1]` and `nums2[j-1]`.

                # Calculate the value considering the case where both nums1[i-1] and nums2[j-1] are used.
                # If dp[i-1][j-1] is -inf, it means no valid subsequence could be formed previously.
                # In such a case, `max(0, dp[i-1][j-1])` will be 0, and `current_prod + 0` correctly represents
                # starting a new subsequence of length 1 with `current_prod`.
                prod_with_prev = current_prod + max(0, dp[i - 1][j - 1])

                # Update dp[i][j] by taking the maximum of the possible scenarios:
                # - Max product not using nums1[i-1] (dp[i-1][j])
                # - Max product not using nums2[j-1] (dp[i][j-1])
                # - Max product using both current elements, either as a new subsequence or extending a previous one.
                #   The `max(0, dp[i-1][j-1])` part correctly combines starting anew or extending.
                dp[i][j] = max(dp[i - 1][j],          # Don't use nums1[i-1]
                               dp[i][j - 1],          # Don't use nums2[j-1]
                               prod_with_prev)        # Use both nums1[i-1] and nums2[j-1]

        # The final answer is the maximum dot product considering all elements of nums1 and nums2.
        return dp[m][n]

```