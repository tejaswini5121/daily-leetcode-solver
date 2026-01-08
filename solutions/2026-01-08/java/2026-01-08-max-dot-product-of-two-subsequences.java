```java
// Problem: Max Dot Product of Two Subsequences
// Link: https://leetcode.com/problems/max-dot-product-of-two-subsequences/
//
// Approach:
// This problem can be solved using dynamic programming. We define a 2D DP table, dp[i][j],
// which represents the maximum dot product considering subsequences from nums1[0...i-1]
// and nums2[0...j-1].
//
// The recurrence relation is as follows:
// For each pair (nums1[i-1], nums2[j-1]), we have two choices:
// 1. Include both nums1[i-1] and nums2[j-1] in the subsequences. The dot product would be
//    nums1[i-1] * nums2[j-1] plus the maximum dot product from previous subproblems.
//    This can be `dp[i-1][j-1] + nums1[i-1] * nums2[j-1]`. However, we also need to consider
//    the case where `dp[i-1][j-1]` might be negative. If `dp[i-1][j-1]` is negative,
//    it's better to start a new subsequence with just `nums1[i-1] * nums2[j-1]`.
//    So, we take `max(nums1[i-1] * nums2[j-1], dp[i-1][j-1] + nums1[i-1] * nums2[j-1])`.
// 2. Exclude nums1[i-1] or nums2[j-1] (or both). This means the maximum dot product
//    would be the maximum of `dp[i-1][j]` (excluding nums1[i-1]) or `dp[i][j-1]`
//    (excluding nums2[j-1]).
//
// Combining these, `dp[i][j]` will be the maximum of:
//    - `nums1[i-1] * nums2[j-1]` (start a new subsequence)
//    - `dp[i-1][j-1] + nums1[i-1] * nums2[j-1]` (extend previous subsequences)
//    - `dp[i-1][j]` (exclude current element from nums1)
//    - `dp[i][j-1]` (exclude current element from nums2)
//
// The base cases:
// dp[0][j] = dp[i][0] = -Infinity (or a very small number) to represent that no subsequence is formed yet.
//
// However, there's a subtlety when all numbers are negative. In such cases, the
// maximum dot product will be the largest single product of an element from nums1
// and an element from nums2. The DP formulation above might result in 0 or a large
// negative number if not handled carefully.
//
// To handle this, we can initialize the DP table with a very small negative number.
//
// If all numbers in nums1 are negative and all numbers in nums2 are negative,
// the result should be the maximum product of a single element from nums1 and a
// single element from nums2. The DP approach naturally handles this if initialized
// correctly. For example, if `nums1 = [-1, -2]` and `nums2 = [-3, -4]`:
// dp[1][1] (considering nums1[0] and nums2[0]): max(-1*-3, -inf + -1*-3) = 3
// dp[1][2] (considering nums1[0] and nums2[0..1]): max(dp[1][1], dp[0][2], nums1[0]*nums2[1]) = max(3, -inf, -1*-4) = 4
// dp[2][1] (considering nums1[0..1] and nums2[0]): max(dp[1][1], dp[2][0], nums1[1]*nums2[0]) = max(3, -inf, -2*-3) = 6
// dp[2][2] (considering nums1[0..1] and nums2[0..1]): max(nums1[1]*nums2[1], dp[1][1] + nums1[1]*nums2[1], dp[1][2], dp[2][1])
//          = max(-2*-4, 3 + -2*-4, 4, 6) = max(8, 3+8, 4, 6) = 11
//
// Special handling for cases where the maximum product might be a single element if all products are negative.
// The DP formulation naturally covers this if we initialize with a very small number.
// For example, if dp[i-1][j-1] is `Integer.MIN_VALUE`, then `dp[i-1][j-1] + nums1[i-1] * nums2[j-1]`
// will be `Integer.MIN_VALUE` plus something, which is still very small.
// However, `nums1[i-1] * nums2[j-1]` might be the largest negative number.
//
// Let's refine the recurrence:
// dp[i][j] = max of:
//   1. nums1[i-1] * nums2[j-1] (Take only these two elements as a subsequence)
//   2. dp[i-1][j-1] + nums1[i-1] * nums2[j-1] (Extend the previous best subsequence)
//   3. dp[i-1][j] (Don't use nums1[i-1])
//   4. dp[i][j-1] (Don't use nums2[j-1])
//
// To ensure that `dp[i-1][j-1]` is only added if it's beneficial (i.e., not a very small negative number),
// we can use `Math.max(nums1[i-1] * nums2[j-1], dp[i-1][j-1] + nums1[i-1] * nums2[j-1])` as one option.
// But `dp[i-1][j-1]` itself might be the best subsequence up to that point.
//
// Let's consider the meaning of dp[i][j] as the max dot product using subsequences ending AT or BEFORE index i-1 in nums1 and index j-1 in nums2.
//
// Corrected recurrence relation:
// dp[i][j] = max of:
//   1. `nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1])`
//      This accounts for taking the current elements and either starting a new subsequence (if dp[i-1][j-1] is negative) or extending the previous one.
//   2. `dp[i-1][j]` (max dot product excluding nums1[i-1])
//   3. `dp[i][j-1]` (max dot product excluding nums2[j-1])
//
// Initialization:
// Initialize dp table with a very small negative number.
//
// Edge case: If all numbers are negative, the result should be the largest negative product.
// The above recurrence might result in 0 if not careful.
//
// Consider the case where all products are negative. The maximum dot product must be
// at least the maximum product of any single pair `nums1[i] * nums2[j]`.
//
// A simpler DP approach often used for LCS-like problems:
// dp[i][j] = max dot product of subsequences of nums1[0..i-1] and nums2[0..j-1].
//
// For dp[i][j]:
// 1. If we don't use nums1[i-1]: dp[i-1][j]
// 2. If we don't use nums2[j-1]: dp[i][j-1]
// 3. If we use both nums1[i-1] and nums2[j-1]:
//    - If dp[i-1][j-1] is positive, we can add the current product: dp[i-1][j-1] + nums1[i-1] * nums2[j-1]
//    - If dp[i-1][j-1] is negative or zero, it's better to start a new subsequence with just the current product: nums1[i-1] * nums2[j-1]
//    So, this option is: `max(nums1[i-1] * nums2[j-1], dp[i-1][j-1] + nums1[i-1] * nums2[j-1])`
//
// Therefore, `dp[i][j] = max(dp[i-1][j], dp[i][j-1], max(nums1[i-1] * nums2[j-1], dp[i-1][j-1] + nums1[i-1] * nums2[j-1]))`
//
// Initialization:
// dp[0][j] = dp[i][0] = Integer.MIN_VALUE for all i, j.
//
// Let's test with an example: nums1 = [2,1,-2,5], nums2 = [3,0,-6]
// n = 4, m = 3
// dp table size: (n+1) x (m+1)
// dp[0][*] and dp[*][0] initialized to very small value (e.g., -1e9 or similar)
//
// i=1 (nums1[0]=2), j=1 (nums2[0]=3):
//   dp[1][1] = max(dp[0][1], dp[1][0], max(2*3, dp[0][0] + 2*3))
//            = max(-inf, -inf, max(6, -inf + 6)) = 6
//
// i=1 (nums1[0]=2), j=2 (nums2[1]=0):
//   dp[1][2] = max(dp[0][2], dp[1][1], max(2*0, dp[0][1] + 2*0))
//            = max(-inf, 6, max(0, -inf + 0)) = 6
//
// i=1 (nums1[0]=2), j=3 (nums2[2]=-6):
//   dp[1][3] = max(dp[0][3], dp[1][2], max(2*(-6), dp[0][2] + 2*(-6)))
//            = max(-inf, 6, max(-12, -inf + -12)) = 6
//
// i=2 (nums1[1]=1), j=1 (nums2[0]=3):
//   dp[2][1] = max(dp[1][1], dp[2][0], max(1*3, dp[1][0] + 1*3))
//            = max(6, -inf, max(3, -inf + 3)) = 6
//
// i=2 (nums1[1]=1), j=2 (nums2[1]=0):
//   dp[2][2] = max(dp[1][2], dp[2][1], max(1*0, dp[1][1] + 1*0))
//            = max(6, 6, max(0, 6 + 0)) = 6
//
// i=2 (nums1[1]=1), j=3 (nums2[2]=-6):
//   dp[2][3] = max(dp[1][3], dp[2][2], max(1*(-6), dp[1][2] + 1*(-6)))
//            = max(6, 6, max(-6, 6 + -6)) = max(6, 6, max(-6, 0)) = 6
//
// i=3 (nums1[2]=-2), j=1 (nums2[0]=3):
//   dp[3][1] = max(dp[2][1], dp[3][0], max(-2*3, dp[2][0] + -2*3))
//            = max(6, -inf, max(-6, -inf + -6)) = 6
//
// i=3 (nums1[2]=-2), j=2 (nums2[1]=0):
//   dp[3][2] = max(dp[2][2], dp[3][1], max(-2*0, dp[2][1] + -2*0))
//            = max(6, 6, max(0, 6 + 0)) = 6
//
// i=3 (nums1[2]=-2), j=3 (nums2[2]=-6):
//   dp[3][3] = max(dp[2][3], dp[3][2], max((-2)*(-6), dp[2][2] + (-2)*(-6)))
//            = max(6, 6, max(12, 6 + 12)) = max(6, 6, 18) = 18
//
// i=4 (nums1[3]=5), j=1 (nums2[0]=3):
//   dp[4][1] = max(dp[3][1], dp[4][0], max(5*3, dp[3][0] + 5*3))
//            = max(6, -inf, max(15, -inf + 15)) = 15
//
// i=4 (nums1[3]=5), j=2 (nums2[1]=0):
//   dp[4][2] = max(dp[3][2], dp[4][1], max(5*0, dp[3][1] + 5*0))
//            = max(6, 15, max(0, 6 + 0)) = 15
//
// i=4 (nums1[3]=5), j=3 (nums2[2]=-6):
//   dp[4][3] = max(dp[3][3], dp[4][2], max(5*(-6), dp[3][2] + 5*(-6)))
//            = max(18, 15, max(-30, 6 + -30)) = max(18, 15, -24) = 18
//
// The final answer is dp[n][m]. This seems to work.
//
// What if all numbers are negative? nums1 = [-1,-1], nums2 = [1,1]
// n = 2, m = 2
// dp table size: 3x3
// Init with -1e9 (a very small number)
//
// i=1 (nums1[0]=-1), j=1 (nums2[0]=1):
//   dp[1][1] = max(dp[0][1], dp[1][0], max(-1*1, dp[0][0] + -1*1))
//            = max(-inf, -inf, max(-1, -inf + -1)) = -1
//
// i=1 (nums1[0]=-1), j=2 (nums2[1]=1):
//   dp[1][2] = max(dp[0][2], dp[1][1], max(-1*1, dp[0][1] + -1*1))
//            = max(-inf, -1, max(-1, -inf + -1)) = -1
//
// i=2 (nums1[1]=-1), j=1 (nums2[0]=1):
//   dp[2][1] = max(dp[1][1], dp[2][0], max(-1*1, dp[1][0] + -1*1))
//            = max(-1, -inf, max(-1, -inf + -1)) = -1
//
// i=2 (nums1[1]=-1), j=2 (nums2[1]=1):
//   dp[2][2] = max(dp[1][2], dp[2][1], max((-1)*1, dp[1][1] + (-1)*1))
//            = max(-1, -1, max(-1, -1 + -1)) = max(-1, -1, -1) = -1
//
// Final answer: dp[2][2] = -1. This also works.
//
// The initialization value for `dp` table should be sufficiently small.
// The maximum product of two elements is 1000 * 1000 = 1,000,000.
// The minimum product of two elements is -1000 * 1000 = -1,000,000.
// The sum of products can go up to 500 * 1,000,000 = 500,000,000.
// A safe small value would be something like -1e9 or `Integer.MIN_VALUE / 2` to avoid overflow if adding.
// Let's use `Integer.MIN_VALUE` for base cases and handle the addition carefully.
//
// An alternative view of the DP state:
// dp[i][j] = maximum dot product of a subsequence of nums1[0...i-1] and nums2[0...j-1].
//
// dp[i][j] = max(
//   dp[i-1][j], // Do not include nums1[i-1]
//   dp[i][j-1], // Do not include nums2[j-1]
//   nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1]) // Include both, ensuring we add if dp[i-1][j-1] is non-negative
// )
//
// This is still problematic for the case where all numbers are negative.
// If dp[i-1][j-1] is negative, `max(0, dp[i-1][j-1])` becomes 0, so we just take `nums1[i-1] * nums2[j-1]`.
//
// Let's stick to the previous formulation:
// dp[i][j] = max(
//   dp[i-1][j], // Exclude nums1[i-1]
//   dp[i][j-1], // Exclude nums2[j-1]
//   max(nums1[i-1] * nums2[j-1], dp[i-1][j-1] + nums1[i-1] * nums2[j-1]) // Include both. Either start new or extend.
// )
//
// Initialization with a very small number (e.g., -1e9, to avoid issues with Integer.MIN_VALUE addition).
//
// Time Complexity: O(n*m), where n is the length of nums1 and m is the length of nums2.
// We iterate through the n*m states of the DP table, and each state takes constant time to compute.
//
// Space Complexity: O(n*m) for the DP table. This can be optimized to O(min(n,m))
// by noticing that dp[i][j] only depends on the previous row (i-1) and current row (i).
// We can use two rows or even one row if we are careful about the update order.
// For simplicity and clarity, we'll use O(n*m) space.
//
// Let's refine the initialization for better robustness.
// A value like `Integer.MIN_VALUE` could lead to overflow if added to a product.
// A value like `-1_000_000_000` (approximately -1e9) should be safe.
// The product of two numbers can be up to 1e6. The sum of products could be up to 500 * 1e6 = 5e8.
// So, if dp[i-1][j-1] is -1e9 and we add 1e6, it becomes -1e9 + 1e6, which is fine.
// However, if dp[i-1][j-1] is -1e9 and we add -1e6, it becomes -1e9 - 1e6, which is also fine.
//
// The problem requires non-empty subsequences.
// If the maximum value in the DP table is still the initial very small number, it implies
// that no valid (non-empty) subsequences could form a product. This should not happen
// given the constraints (lengths >= 1).
//
// Consider the case where the maximum possible product is negative.
// For example, nums1 = [-1], nums2 = [-2]. Result should be 2.
// Our DP should yield 2.
//
// dp[1][1] = max(dp[0][1], dp[1][0], max((-1)*(-2), dp[0][0] + (-1)*(-2)))
//          = max(-inf, -inf, max(2, -inf + 2)) = 2.
//
// Consider nums1 = [-1], nums2 = [1]. Result should be -1.
// dp[1][1] = max(dp[0][1], dp[1][0], max((-1)*1, dp[0][0] + (-1)*1))
//          = max(-inf, -inf, max(-1, -inf + -1)) = -1.
//
// The approach seems solid.
//
// Final check on DP state definition and transitions.
// dp[i][j]: max dot product using subsequences from nums1[0...i-1] and nums2[0...j-1].
//
// For dp[i][j], we consider the element nums1[i-1] and nums2[j-1].
//
// Option 1: Don't use nums1[i-1]. The max dot product is dp[i-1][j].
// Option 2: Don't use nums2[j-1]. The max dot product is dp[i][j-1].
// Option 3: Use both nums1[i-1] and nums2[j-1].
//   - The product of these two elements is `prod = nums1[i-1] * nums2[j-1]`.
//   - If we are extending a previous subsequence (represented by dp[i-1][j-1]), the value would be `dp[i-1][j-1] + prod`.
//   - However, if `dp[i-1][j-1]` is very small (meaning no good subsequence could be formed before),
//     or if starting a new subsequence with `prod` is better than extending `dp[i-1][j-1]`, we should consider `prod` itself.
//   - This is captured by `max(prod, dp[i-1][j-1] + prod)`.
//
// So, `dp[i][j] = max({dp[i-1][j], dp[i][j-1], max(nums1[i-1] * nums2[j-1], dp[i-1][j-1] + nums1[i-1] * nums2[j-1])})`.
//
// Initialization:
// The DP table needs to be initialized such that `dp[i-1][j]`, `dp[i][j-1]`, and `dp[i-1][j-1]`
// represent cases where one or both arrays are empty.
// Since we are looking for non-empty subsequences, `dp[0][j]` and `dp[i][0]` should represent
// an invalid state, meaning no subsequence can be formed. A very small number
// (like negative infinity) is appropriate.
//
// `int[][] dp = new int[n + 1][m + 1];`
// Initialize all elements of `dp` to a sufficiently small negative value.
// `Arrays.stream(dp).forEach(row -> Arrays.fill(row, SOME_SMALL_NEGATIVE_VALUE));`
//
// Let `SOME_SMALL_NEGATIVE_VALUE` be `-1_000_000_000`.
//
// Consider the range of values:
// `nums1[i]`, `nums2[j]` are in [-1000, 1000].
// Product `nums1[i] * nums2[j]` is in [-1,000,000, 1,000,000].
// Max length of subsequences is min(n, m) <= 500.
// Max possible dot product: 500 * 1,000,000 = 500,000,000.
// Min possible dot product: 500 * (-1,000,000) = -500,000,000.
//
// So, using `Integer.MIN_VALUE` might be too small and could cause overflow when adding positive products.
// `Integer.MIN_VALUE + 1000000` could wrap around.
// A safe small value like `-1000000000` is good.
//
// Let's use a helper function for max that handles null or empty values in a conceptual sense.
// Or simply use `Math.max` carefully.
//
// `max(a, b, c)` is `Math.max(a, Math.max(b, c))`.
//
// `val_if_both_used = Math.max(current_product, dp[i-1][j-1] + current_product);`
//
// If `dp[i-1][j-1]` is `-1_000_000_000` and `current_product` is `-500_000`,
// then `dp[i-1][j-1] + current_product` would be `-1_000_000_500`.
// `Math.max(-500_000, -1_000_000_500)` is `-500_000`. This is correct.
//
// The logic `max(nums1[i-1] * nums2[j-1], dp[i-1][j-1] + nums1[i-1] * nums2[j-1])` ensures that if `dp[i-1][j-1]` is
// very negative, we effectively "reset" and start a new subsequence with just the current product.
// This is crucial.
//
// What if `dp[i-1][j-1]` is also initialized with a value such that `dp[i-1][j-1] + nums1[i-1] * nums2[j-1]`
// overflows negatively?
// e.g. `dp[i-1][j-1] = -2 * 10^9` and `nums1*nums2 = -10^6`. Sum is `-2*10^9 - 10^6` which could exceed `Integer.MIN_VALUE`.
//
// The problem constraints are up to 500 elements.
// Max sum of products can be around 500 * 1000 * 1000 = 5 * 10^8.
// `Integer.MAX_VALUE` is about 2 * 10^9. `Integer.MIN_VALUE` is about -2 * 10^9.
// So `int` should be sufficient for the DP table if we choose the initialization value correctly.
//
// Let's initialize with a value that is guaranteed to be smaller than any possible valid dot product.
// Any valid dot product of non-empty subsequences will be at least -1000 * 1000 = -1,000,000 (for single element product).
// Or if we form a subsequence, the sum of products could be around -500 * 1,000,000 = -500,000,000.
// So, a value like `-1_000_000_000` (a bit less than -1e9) would be a safe sentinel value.
//
// Let's use `-1_000_000_000` as the initial value for `dp` table cells.
//
// The final answer is `dp[n][m]`.
//
// Let's consider the example:
// nums1 = [2,1,-2,5], nums2 = [3,0,-6]
// n = 4, m = 3
// dp[5][4] table.
//
// Initialize dp table with -1_000_000_000.
//
// i=1, j=1: nums1[0]=2, nums2[0]=3. prod = 6.
//   dp[1][1] = max(dp[0][1], dp[1][0], max(6, dp[0][0] + 6))
//            = max(-1e9, -1e9, max(6, -1e9 + 6)) = 6
//
// i=1, j=2: nums1[0]=2, nums2[1]=0. prod = 0.
//   dp[1][2] = max(dp[0][2], dp[1][1], max(0, dp[0][1] + 0))
//            = max(-1e9, 6, max(0, -1e9 + 0)) = 6
//
// i=1, j=3: nums1[0]=2, nums2[2]=-6. prod = -12.
//   dp[1][3] = max(dp[0][3], dp[1][2], max(-12, dp[0][2] + -12))
//            = max(-1e9, 6, max(-12, -1e9 + -12)) = 6
//
// i=2, j=1: nums1[1]=1, nums2[0]=3. prod = 3.
//   dp[2][1] = max(dp[1][1], dp[2][0], max(3, dp[1][0] + 3))
//            = max(6, -1e9, max(3, -1e9 + 3)) = 6
//
// i=2, j=2: nums1[1]=1, nums2[1]=0. prod = 0.
//   dp[2][2] = max(dp[1][2], dp[2][1], max(0, dp[1][1] + 0))
//            = max(6, 6, max(0, 6 + 0)) = 6
//
// i=2, j=3: nums1[1]=1, nums2[2]=-6. prod = -6.
//   dp[2][3] = max(dp[1][3], dp[2][2], max(-6, dp[1][2] + -6))
//            = max(6, 6, max(-6, 6 + -6)) = max(6, 6, 0) = 6
//
// i=3, j=1: nums1[2]=-2, nums2[0]=3. prod = -6.
//   dp[3][1] = max(dp[2][1], dp[3][0], max(-6, dp[2][0] + -6))
//            = max(6, -1e9, max(-6, -1e9 + -6)) = 6
//
// i=3, j=2: nums1[2]=-2, nums2[1]=0. prod = 0.
//   dp[3][2] = max(dp[2][2], dp[3][1], max(0, dp[2][1] + 0))
//            = max(6, 6, max(0, 6 + 0)) = 6
//
// i=3, j=3: nums1[2]=-2, nums2[2]=-6. prod = 12.
//   dp[3][3] = max(dp[2][3], dp[3][2], max(12, dp[2][2] + 12))
//            = max(6, 6, max(12, 6 + 12)) = max(6, 6, 18) = 18
//
// i=4, j=1: nums1[3]=5, nums2[0]=3. prod = 15.
//   dp[4][1] = max(dp[3][1], dp[4][0], max(15, dp[3][0] + 15))
//            = max(6, -1e9, max(15, -1e9 + 15)) = 15
//
// i=4, j=2: nums1[3]=5, nums2[1]=0. prod = 0.
//   dp[4][2] = max(dp[3][2], dp[4][1], max(0, dp[3][1] + 0))
//            = max(6, 15, max(0, 6 + 0)) = 15
//
// i=4, j=3: nums1[3]=5, nums2[2]=-6. prod = -30.
//   dp[4][3] = max(dp[3][3], dp[4][2], max(-30, dp[3][2] + -30))
//            = max(18, 15, max(-30, 6 + -30)) = max(18, 15, -24) = 18
//
// Final answer: dp[4][3] = 18. It matches Example 1.
//
// Example 3: nums1 = [-1,-1], nums2 = [1,1]
// n = 2, m = 2
// dp[3][3] table.
//
// Initialize dp table with -1_000_000_000.
//
// i=1, j=1: nums1[0]=-1, nums2[0]=1. prod = -1.
//   dp[1][1] = max(dp[0][1], dp[1][0], max(-1, dp[0][0] + -1))
//            = max(-1e9, -1e9, max(-1, -1e9 + -1)) = -1
//
// i=1, j=2: nums1[0]=-1, nums2[1]=1. prod = -1.
//   dp[1][2] = max(dp[0][2], dp[1][1], max(-1, dp[0][1] + -1))
//            = max(-1e9, -1, max(-1, -1e9 + -1)) = -1
//
// i=2, j=1: nums1[1]=-1, nums2[0]=1. prod = -1.
//   dp[2][1] = max(dp[1][1], dp[2][0], max(-1, dp[1][0] + -1))
//            = max(-1, -1e9, max(-1, -1e9 + -1)) = -1
//
// i=2, j=2: nums1[1]=-1, nums2[1]=1. prod = -1.
//   dp[2][2] = max(dp[1][2], dp[2][1], max(-1, dp[1][1] + -1))
//            = max(-1, -1, max(-1, -1 + -1)) = max(-1, -1, -1) = -1
//
// Final answer: dp[2][2] = -1. It matches Example 3.
//
// Looks good.
```
import java.util.Arrays;

class Solution {
    /**
     * Finds the maximum dot product between non-empty subsequences of two given arrays.
     *
     * Approach: Dynamic Programming.
     * We use a 2D DP table `dp[i][j]` to store the maximum dot product achievable
     * using subsequences from `nums1[0...i-1]` and `nums2[0...j-1]`.
     *
     * The recurrence relation is defined as follows:
     * `dp[i][j]` considers the elements `nums1[i-1]` and `nums2[j-1]`.
     *
     * There are three main possibilities for `dp[i][j]`:
     * 1. Exclude `nums1[i-1]`: The maximum dot product is inherited from `dp[i-1][j]`.
     * 2. Exclude `nums2[j-1]`: The maximum dot product is inherited from `dp[i][j-1]`.
     * 3. Include both `nums1[i-1]` and `nums2[j-1]`:
     *    The product of these two elements is `current_product = nums1[i-1] * nums2[j-1]`.
     *    We can either start a new subsequence with just these two elements (`current_product`),
     *    or extend a previously found maximum dot product subsequence (`dp[i-1][j-1] + current_product`).
     *    We take the maximum of these two: `max(current_product, dp[i-1][j-1] + current_product)`.
     *    This handles cases where `dp[i-1][j-1]` is very negative, making it better to start fresh.
     *
     * Therefore, `dp[i][j]` is the maximum of these possibilities:
     * `dp[i][j] = max(dp[i-1][j], dp[i][j-1], max(nums1[i-1] * nums2[j-1], dp[i-1][j-1] + nums1[i-1] * nums2[j-1]))`
     *
     * Initialization:
     * The DP table is initialized with a very small negative number (e.g., -1e9) to represent
     * an invalid state (no valid non-empty subsequence formed yet). This sentinel value ensures
     * that any valid product will be greater than it.
     *
     * Time Complexity: O(n*m), where n is the length of nums1 and m is the length of nums2.
     * We fill an n x m DP table, and each cell computation takes O(1) time.
     *
     * Space Complexity: O(n*m) for the DP table. This can be optimized to O(min(n,m))
     * using only two rows or one row, but O(n*m) is used for clarity.
     *
     * @param nums1 The first array.
     * @param nums2 The second array.
     * @return The maximum dot product between non-empty subsequences of nums1 and nums2.
     */
    public int maxDotProduct(int[] nums1, int[] nums2) {
        int n = nums1.length;
        int m = nums2.length;

        // Initialize DP table with a sufficiently small negative value.
        // This sentinel value represents an invalid or unreachable state.
        // The product of two numbers is between -1,000,000 and 1,000,000.
        // The sum of products can go up to 500 * 1,000,000 = 500,000,000.
        // A value like -1e9 is safely smaller than any possible valid dot product.
        // Using long for intermediate calculations to prevent potential overflow,
        // though the final result fits in int given constraints.
        // The problem statement implies the result fits in an int.
        // Max possible value for int is ~2 * 10^9.
        // Min possible value for int is ~-2 * 10^9.
        // The sum of products can be up to 500 * 1000 * 1000 = 5 * 10^8.
        // The sum of products can be down to -500 * 1000 * 1000 = -5 * 10^8.
        // These values fit within `int`.
        // However, if `dp[i-1][j-1]` is `Integer.MIN_VALUE` and we add a negative product,
        // it can underflow. So, using a slightly less extreme sentinel value is better.
        // Let's use a value that ensures `sentinel + product` doesn't underflow.
        // The smallest possible product is -1,000,000.
        // If sentinel is -1,000,000,000, then -1,000,000,000 + (-1,000,000) = -1,001,000,000, which is fine.
        final int SENTINEL = -1_000_000_000; // A very small negative number
        int[][] dp = new int[n + 1][m + 1];

        // Initialize DP table. dp[0][j] and dp[i][0] represent cases where one array is empty,
        // meaning no non-empty subsequence can be formed.
        for (int i = 0; i <= n; i++) {
            Arrays.fill(dp[i], SENTINEL);
        }

        // Fill the DP table
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                int currentProduct = nums1[i - 1] * nums2[j - 1];

                // Option 1: Include both nums1[i-1] and nums2[j-1].
                // We can either start a new subsequence with currentProduct,
                // or extend the best subsequence ending at dp[i-1][j-1].
                // If dp[i-1][j-1] is SENTINEL, it means no valid subsequence was formed
                // before, so we essentially start new with currentProduct.
                int includeBoth = currentProduct; // Start new subsequence
                if (dp[i - 1][j - 1] != SENTINEL) {
                    // If a valid subsequence existed, we can extend it.
                    includeBoth = Math.max(currentProduct, dp[i - 1][j - 1] + currentProduct);
                } else {
                    // If dp[i-1][j-1] is SENTINEL, it means we must start a new subsequence.
                    // The only option is currentProduct.
                    includeBoth = currentProduct;
                }


                // Option 2: Exclude nums1[i-1]. Max dot product is dp[i-1][j].
                // Option 3: Exclude nums2[j-1]. Max dot product is dp[i][j-1].
                //
                // dp[i][j] is the maximum of these three possibilities.
                // We need to be careful if dp[i-1][j] or dp[i][j-1] are SENTINEL.
                // If they are, it means those paths didn't yield a valid subsequence.
                // However, includeBoth will always yield a valid value (at least currentProduct).
                //
                // To simplify, we can always consider dp[i-1][j] and dp[i][j-1] as candidates
                // if they are not SENTINEL. If they are SENTINEL, they won't affect the max if includeBoth is valid.
                
                dp[i][j] = includeBoth; // Initialize with the option of including both

                // Consider excluding nums1[i-1]
                if (dp[i - 1][j] != SENTINEL) {
                    dp[i][j] = Math.max(dp[i][j], dp[i - 1][j]);
                }
                // Consider excluding nums2[j-1]
                if (dp[i][j - 1] != SENTINEL) {
                    dp[i][j] = Math.max(dp[i][j], dp[i][j - 1]);
                }
            }
        }

        // The final answer is in dp[n][m].
        // If dp[n][m] is still SENTINEL, it implies no valid non-empty subsequence could be formed.
        // However, given constraints (lengths >= 1), this should not happen.
        // Every element pair nums1[i]*nums2[j] will be considered and become a candidate.
        // The minimum possible answer for non-empty subsequences would be the largest single product
        // if all products are negative.
        return dp[n][m];
    }
}
```