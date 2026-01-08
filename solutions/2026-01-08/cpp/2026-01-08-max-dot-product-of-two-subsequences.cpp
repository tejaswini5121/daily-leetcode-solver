// Problem: Max Dot Product of Two Subsequences
// Link: https://leetcode.com/problems/max-dot-product-of-two-subsequences/
// Approach:
// This problem can be solved using dynamic programming. We define dp[i][j] as the maximum dot product
// considering subsequences from nums1[:i] and nums2[:j].
//
// There are a few cases to consider for dp[i][j]:
// 1. We don't include nums1[i-1] and nums2[j-1] in the subsequences. In this case, the maximum dot product
//    is the same as dp[i-1][j] or dp[i][j-1]. We take the maximum of these two.
// 2. We include nums1[i-1] and nums2[j-1] as the last elements of the subsequences.
//    The dot product for this pair is nums1[i-1] * nums2[j-1].
//    If this product is positive, we can add it to the maximum dot product obtained from
//    dp[i-1][j-1] (i.e., dp[i-1][j-1] + nums1[i-1] * nums2[j-1]).
//    If this product is negative, we have two sub-cases for forming a non-empty subsequence:
//        a. The current product nums1[i-1] * nums2[j-1] itself forms a valid non-empty subsequence.
//        b. We append nums1[i-1] * nums2[j-1] to a previous maximum dot product. If dp[i-1][j-1]
//           was positive, we can add it. If dp[i-1][j-1] was negative, adding a negative product
//           will further decrease it, so we might not want to do that. However, to ensure we
//           cover cases where all products are negative, we consider `max(nums1[i-1] * nums2[j-1], dp[i-1][j-1] + nums1[i-1] * nums2[j-1])`.
//
// Combining these, the recurrence relation is:
// dp[i][j] = max(
//     dp[i-1][j], // Exclude nums1[i-1]
//     dp[i][j-1], // Exclude nums2[j-1]
//     nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1]), // Include both, and consider if dp[i-1][j-1] was positive
//     nums1[i-1] * nums2[j-1] // Include both, as a new subsequence
// )
//
// However, this standard LCS-like DP can be tricky with negative numbers and the "non-empty" constraint.
// A more robust DP state definition is: dp[i][j] is the maximum dot product of any
// non-empty subsequence ending with nums1[i-1] and nums2[j-1].
//
// When considering dp[i][j]:
// The current product is `current_product = nums1[i-1] * nums2[j-1]`.
// This `current_product` can be:
// 1. The start of a new subsequence. So, `current_product` itself is a candidate.
// 2. Appended to a previous subsequence ending at `dp[i-1][j-1]`.
//    - If `dp[i-1][j-1]` is positive, we can add `current_product` to it: `dp[i-1][j-1] + current_product`.
//    - If `dp[i-1][j-1]` is negative, adding `current_product` to it might make it smaller.
//      However, we need to ensure we capture cases where the maximum is a negative number.
//      So, we consider `max(current_product, dp[i-1][j-1] + current_product)`.
//
// Therefore, `dp[i][j] = max(current_product, dp[i-1][j-1] + current_product)`.
// This state definition assumes the subsequence *must* end with nums1[i-1] and nums2[j-1].
//
// To get the overall maximum dot product, we need to consider the maximum value in the entire
// dp table.
//
// Base cases:
// If dp[i-1][j-1] is uninitialized or represents an invalid state (e.g., negative infinity if we were trying to achieve a minimum),
// we should initialize it. Since we want the maximum, and the problem guarantees non-empty subsequences,
// the smallest possible result can be a single negative product.
//
// A more common and easier-to-implement DP for this problem:
// dp[i][j] = maximum dot product of subsequences from nums1[0...i-1] and nums2[0...j-1].
//
// When calculating dp[i][j]:
// 1. `dp[i-1][j]` (don't use nums1[i-1])
// 2. `dp[i][j-1]` (don't use nums2[j-1])
// 3. `nums1[i-1] * nums2[j-1]` (use both as a new single-element subsequence)
// 4. `dp[i-1][j-1] + nums1[i-1] * nums2[j-1]` (use both, and extend a previous subsequence)
//
// The key is how to handle the "non-empty" constraint and negative numbers.
// If all numbers are negative, the maximum dot product will be the largest single product.
//
// Let's use `dp[i][j]` as the maximum dot product of subsequences from `nums1[0..i-1]` and `nums2[0..j-1]`.
//
// Initialization:
// We need to initialize dp table with a very small number to represent negative infinity, because
// the maximum dot product could be negative. `LLONG_MIN` is suitable.
// `dp[0][j] = LLONG_MIN` for all j.
// `dp[i][0] = LLONG_MIN` for all i.
//
// Transition:
// For `dp[i][j]`:
// `current_product = (long long)nums1[i-1] * nums2[j-1]`
//
// Options for `dp[i][j]`:
// a) We don't include `nums1[i-1]` and `nums2[j-1]` in the subsequences that form the max dot product for `dp[i][j]`.
//    This means the max dot product comes from `dp[i-1][j]` or `dp[i][j-1]`.
//    So, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.
//
// b) We include `nums1[i-1]` and `nums2[j-1]` as the pair that contributes to the dot product at this step.
//    - If `dp[i-1][j-1]` is `LLONG_MIN` (meaning no valid previous subsequence ending at `i-1, j-1`),
//      then the current pair `nums1[i-1] * nums2[j-1]` must form a new subsequence by itself.
//      So, we consider `current_product`.
//    - If `dp[i-1][j-1]` is not `LLONG_MIN`, it means there's a valid previous max dot product.
//      We can either:
//        i) Extend it: `dp[i-1][j-1] + current_product`
//        ii) Start a new subsequence with `current_product` if `dp[i-1][j-1]` is negative and `current_product` is larger.
//
//    This suggests that `dp[i][j]` should be `max(dp[i-1][j], dp[i][j-1], current_product, dp[i-1][j-1] + current_product)`.
//    However, we need to be careful with `dp[i-1][j-1] + current_product`. If `dp[i-1][j-1]` is `LLONG_MIN`,
//    this addition will overflow or be incorrect.
//
// A refined DP state: `dp[i][j]` is the maximum dot product using subsequences from `nums1[0...i-1]` and `nums2[0...j-1]`.
//
// Initialization:
// `dp[i][j]` can be `LLONG_MIN` (representing no valid subsequence found yet).
//
// For `dp[i][j]`:
// `val = (long long)nums1[i-1] * nums2[j-1]`
//
// `dp[i][j] = max({dp[i-1][j], dp[i][j-1]})`  // Don't use nums1[i-1] or nums2[j-1]
//
// Now consider using `nums1[i-1]` and `nums2[j-1]`:
// The current pair `val` can:
// 1. Be the start of a subsequence: `val`.
// 2. Be added to a previous valid subsequence: If `dp[i-1][j-1]` is not `LLONG_MIN`, then `dp[i-1][j-1] + val`.
//
// So, if `dp[i-1][j-1]` is not `LLONG_MIN`:
// `dp[i][j] = max({dp[i][j], dp[i-1][j-1] + val})`
//
// And always consider `val` itself:
// `dp[i][j] = max({dp[i][j], val})`
//
// This means:
// `dp[i][j] = max({dp[i-1][j], dp[i][j-1], val})`
// If `dp[i-1][j-1] != LLONG_MIN`:
//    `dp[i][j] = max({dp[i][j], dp[i-1][j-1] + val})`
//
// This correctly handles cases where all products are negative, because `val` itself will be considered.
//
// Example walkthrough: nums1 = [2,1,-2,5], nums2 = [3,0,-6]
// n1 = 4, n2 = 3
// dp table size (n1+1) x (n2+1)
// Initialize with LLONG_MIN
//
// i=1, j=1: nums1[0]=2, nums2[0]=3. val = 6.
// dp[1][1] = max({LLONG_MIN, LLONG_MIN, 6}) = 6
//
// i=1, j=2: nums1[0]=2, nums2[1]=0. val = 0.
// dp[1][2] = max({dp[0][2]=LLONG_MIN, dp[1][1]=6, 0}) = 6
//
// i=1, j=3: nums1[0]=2, nums2[2]=-6. val = -12.
// dp[1][3] = max({dp[0][3]=LLONG_MIN, dp[1][2]=6, -12}) = 6
//
// i=2, j=1: nums1[1]=1, nums2[0]=3. val = 3.
// dp[2][1] = max({dp[1][1]=6, dp[2][0]=LLONG_MIN, 3}) = 6
//
// i=2, j=2: nums1[1]=1, nums2[1]=0. val = 0.
// dp[2][2] = max({dp[1][2]=6, dp[2][1]=6, 0}) = 6
//
// i=2, j=3: nums1[1]=1, nums2[2]=-6. val = -6.
// dp[2][3] = max({dp[1][3]=6, dp[2][2]=6, -6}) = 6
//
// i=3, j=1: nums1[2]=-2, nums2[0]=3. val = -6.
// dp[3][1] = max({dp[2][1]=6, dp[3][0]=LLONG_MIN, -6}) = 6
//
// i=3, j=2: nums1[2]=-2, nums2[1]=0. val = 0.
// dp[3][2] = max({dp[2][2]=6, dp[3][1]=6, 0}) = 6
//
// i=3, j=3: nums1[2]=-2, nums2[2]=-6. val = 12.
// dp[3][3] = max({dp[2][3]=6, dp[3][2]=6, 12}) = 12
// dp[i-1][j-1] = dp[2][2] = 6.
// dp[3][3] = max({12, dp[2][2] + val}) = max({12, 6 + 12}) = 18.
// So, dp[3][3] = max({6, 6, 12, 18}) = 18.
//
// i=4, j=1: nums1[3]=5, nums2[0]=3. val = 15.
// dp[4][1] = max({dp[3][1]=6, dp[4][0]=LLONG_MIN, 15}) = 15
//
// i=4, j=2: nums1[3]=5, nums2[1]=0. val = 0.
// dp[4][2] = max({dp[3][2]=6, dp[4][1]=15, 0}) = 15
//
// i=4, j=3: nums1[3]=5, nums2[2]=-6. val = -30.
// dp[4][3] = max({dp[3][3]=18, dp[4][2]=15, -30}) = 18
// dp[i-1][j-1] = dp[3][2] = 6.
// dp[4][3] = max({18, dp[3][2] + val}) = max({18, 6 + (-30)}) = 18.
// So, dp[4][3] = max({18, 15, -30, 18}) = 18.
//
// The final answer is dp[n1][n2].
//
// Special case: If all numbers in nums1 and nums2 are such that any product of non-empty
// subsequences results in a negative number, and the maximum of these is still negative,
// the result will be that maximum negative number.
//
// What if all numbers are negative? e.g., nums1 = [-1, -1], nums2 = [1, 1]
// n1 = 2, n2 = 2
// dp table size 3x3, initialized to LLONG_MIN
//
// i=1, j=1: nums1[0]=-1, nums2[0]=1. val = -1.
// dp[1][1] = max({LLONG_MIN, LLONG_MIN, -1}) = -1
//
// i=1, j=2: nums1[0]=-1, nums2[1]=1. val = -1.
// dp[1][2] = max({dp[0][2]=LLONG_MIN, dp[1][1]=-1, -1}) = -1
//
// i=2, j=1: nums1[1]=-1, nums2[0]=1. val = -1.
// dp[2][1] = max({dp[1][1]=-1, dp[2][0]=LLONG_MIN, -1}) = -1
//
// i=2, j=2: nums1[1]=-1, nums2[1]=1. val = -1.
// dp[2][2] = max({dp[1][2]=-1, dp[2][1]=-1, -1}) = -1
// dp[i-1][j-1] = dp[1][1] = -1.
// dp[2][2] = max({-1, dp[1][1] + val}) = max({-1, -1 + (-1)}) = -1.
// So, dp[2][2] = max({-1, -1, -1, -1}) = -1.
//
// This seems to work. The key is that `val` itself is always considered, ensuring that if the best we can do is a single negative product, it's captured.
//
// Time Complexity: O(m*n), where m is the length of nums1 and n is the length of nums2.
// We fill an m x n DP table.
//
// Space Complexity: O(m*n) for the DP table. This can be optimized to O(min(m, n)) by
// observing that dp[i][j] only depends on the previous row (i-1) and the current row (i).
// We can use two rows or even one row if we iterate carefully.
// For simplicity, let's stick to O(m*n) first. The constraints (500x500) allow for this.
//
#include <vector>
#include <algorithm>
#include <climits> // For LLONG_MIN

class Solution {
public:
    int maxDotProduct(std::vector<int>& nums1, std::vector<int>& nums2) {
        int n1 = nums1.size();
        int n2 = nums2.size();

        // dp[i][j] will store the maximum dot product of subsequences from
        // nums1[0...i-1] and nums2[0...j-1].
        // We use long long for dp values to avoid potential overflow.
        // Initialize with LLONG_MIN to correctly handle negative dot products and
        // cases where no valid subsequence is found yet.
        std::vector<std::vector<long long>> dp(n1 + 1, std::vector<long long>(n2 + 1, LLONG_MIN));

        // Iterate through each element of nums1
        for (int i = 1; i <= n1; ++i) {
            // Iterate through each element of nums2
            for (int j = 1; j <= n2; ++j) {
                // Calculate the product of the current elements from nums1 and nums2.
                long long current_product = (long long)nums1[i - 1] * nums2[j - 1];

                // Option 1: Don't include nums1[i-1] in the subsequence.
                // The max dot product is whatever we found using nums1[0...i-2] and nums2[0...j-1].
                dp[i][j] = std::max(dp[i][j], dp[i - 1][j]);

                // Option 2: Don't include nums2[j-1] in the subsequence.
                // The max dot product is whatever we found using nums1[0...i-1] and nums2[0...j-2].
                dp[i][j] = std::max(dp[i][j], dp[i][j - 1]);

                // Option 3: Include both nums1[i-1] and nums2[j-1].
                // There are two sub-cases here:
                // a) The current pair `current_product` starts a new non-empty subsequence.
                //    This is always a possibility.
                // b) The current pair `current_product` extends a previous non-empty subsequence.
                //    This is possible if `dp[i-1][j-1]` is not LLONG_MIN (meaning a valid previous
                //    subsequence ending at i-1, j-1 was found).
                //
                // We consider the maximum of:
                // - `current_product` itself (starting a new subsequence)
                // - `dp[i-1][j-1] + current_product` (extending a previous subsequence, if possible)

                if (dp[i - 1][j - 1] != LLONG_MIN) {
                    // If there was a valid previous dot product, we can extend it.
                    dp[i][j] = std::max(dp[i][j], dp[i - 1][j - 1] + current_product);
                }
                // Always consider the current_product as a potential maximum by itself.
                // This handles cases where the maximum dot product is a single pair,
                // or where all possible extensions lead to smaller values.
                dp[i][j] = std::max(dp[i][j], current_product);
            }
        }

        // The final answer is the maximum dot product considering all elements of both arrays.
        // If dp[n1][n2] is still LLONG_MIN, it implies no non-empty subsequence could be formed
        // which is not possible given problem constraints (lengths are at least 1).
        // However, in edge cases where all products might be extremely small negative numbers
        // and the DP logic could somehow end up with LLONG_MIN if not handled carefully,
        // we should ensure the result is at least one of the single element products.
        // The way `current_product` is always considered for `dp[i][j]` ensures this.
        return (int)dp[n1][n2];
    }
};