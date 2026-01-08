// Problem: Max Dot Product of Two Subsequences
// Link: https://leetcode.com/problems/max-dot-product-of-two-subsequences/
//
// Approach:
// This problem can be solved using dynamic programming. We define a 2D DP array `dp` where `dp[i][j]`
// represents the maximum dot product of non-empty subsequences from `nums1[0...i-1]` and `nums2[0...j-1]`.
//
// The recurrence relation is as follows:
//
// For `dp[i][j]`, we have a few choices for the elements `nums1[i-1]` and `nums2[j-1]`:
//
// 1. We include both `nums1[i-1]` and `nums2[j-1]` in our subsequences.
//    The dot product from previous subsequences is `dp[i-1][j-1]`.
//    If `dp[i-1][j-1]` is positive, we can add `nums1[i-1] * nums2[j-1]` to it.
//    If `dp[i-1][j-1]` is negative or zero, it's better to start a new subsequence with just `nums1[i-1] * nums2[j-1]`.
//    So, this case contributes `max(nums1[i-1] * nums2[j-1], dp[i-1][j-1] + nums1[i-1] * nums2[j-1])`.
//
// 2. We exclude `nums1[i-1]` and consider the maximum dot product from `nums1[0...i-2]` and `nums2[0...j-1]`.
//    This is `dp[i-1][j]`.
//
// 3. We exclude `nums2[j-1]` and consider the maximum dot product from `nums1[0...i-1]` and `nums2[0...j-2]`.
//    This is `dp[i][j-1]`.
//
// Therefore, `dp[i][j] = max(nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1]), dp[i-1][j], dp[i][j-1])`.
//
// Base cases:
// - When `i` or `j` is 0, `dp[i][j]` would conceptually be negative infinity as we need non-empty subsequences.
//   However, initializing the DP table with a very small negative number handles this.
//   A simpler initialization for `dp[0][j]` and `dp[i][0]` is to propagate the values from their left/top counterparts,
//   but the core logic relies on `dp[i-1][j-1]`.
//
// Initialization:
// We can initialize the `dp` table with a very small negative number (e.g., -Infinity or a sufficiently small integer like -1e9)
// to ensure that any valid dot product will be greater.
//
// The final answer will be `dp[m][n]`, where `m` is the length of `nums1` and `n` is the length of `nums2`.
//
// Special Handling for All Negative Numbers:
// If all possible dot products are negative, the DP approach might yield a result that is greater than
// the maximum single product if the `dp[i-1][j-1]` term was always negative.
// For instance, if nums1 = [-1, -2] and nums2 = [-3, -4], the max dot product is (-1)*(-3) = 3.
// However, if nums1 = [-1, -1] and nums2 = [1, 1], the max dot product is (-1)*1 = -1.
// The DP state `dp[i][j]` should correctly capture the maximum value by considering `nums1[i-1] * nums2[j-1]` as a standalone
// product if it yields a better result than extending a previous subsequence, especially when previous subsequences resulted in negative dot products.
//
// The formula `max(nums1[i-1] * nums2[j-1] + max(0, dp[i-1][j-1]), dp[i-1][j], dp[i][j-1])` handles this by considering
// `nums1[i-1] * nums2[j-1]` itself.
//
// Example Walkthrough (nums1 = [2,1,-2,5], nums2 = [3,0,-6]):
//
// dp table of size (m+1) x (n+1), initialized to -Infinity.
// m = 4, n = 3
// dp[0][*] = -Inf, dp[*][0] = -Inf
//
// i=1 (nums1[0]=2):
//  j=1 (nums2[0]=3): dp[1][1] = max(2*3 + max(0, dp[0][0]), dp[0][1], dp[1][0]) = max(6 + 0, -Inf, -Inf) = 6
//  j=2 (nums2[1]=0): dp[1][2] = max(2*0 + max(0, dp[0][1]), dp[0][2], dp[1][1]) = max(0 + 0, -Inf, 6) = 6
//  j=3 (nums2[2]=-6): dp[1][3] = max(2*-6 + max(0, dp[0][2]), dp[0][3], dp[1][2]) = max(-12 + 0, -Inf, 6) = 6
//
// i=2 (nums1[1]=1):
//  j=1 (nums2[0]=3): dp[2][1] = max(1*3 + max(0, dp[1][0]), dp[1][1], dp[2][0]) = max(3 + 0, 6, -Inf) = 6
//  j=2 (nums2[1]=0): dp[2][2] = max(1*0 + max(0, dp[1][1]), dp[1][2], dp[2][1]) = max(0 + max(0, 6), 6, 6) = max(6, 6, 6) = 6
//  j=3 (nums2[2]=-6): dp[2][3] = max(1*-6 + max(0, dp[1][2]), dp[1][3], dp[2][2]) = max(-6 + max(0, 6), 6, 6) = max(0, 6, 6) = 6
//
// i=3 (nums1[2]=-2):
//  j=1 (nums2[0]=3): dp[3][1] = max(-2*3 + max(0, dp[2][0]), dp[2][1], dp[3][0]) = max(-6 + 0, 6, -Inf) = 6
//  j=2 (nums2[1]=0): dp[3][2] = max(-2*0 + max(0, dp[2][1]), dp[2][2], dp[3][1]) = max(0 + max(0, 6), 6, 6) = max(6, 6, 6) = 6
//  j=3 (nums2[2]=-6): dp[3][3] = max(-2*-6 + max(0, dp[2][2]), dp[2][3], dp[3][2]) = max(12 + max(0, 6), 6, 6) = max(18, 6, 6) = 18
//
// i=4 (nums1[3]=5):
//  j=1 (nums2[0]=3): dp[4][1] = max(5*3 + max(0, dp[3][0]), dp[3][1], dp[4][0]) = max(15 + 0, 6, -Inf) = 15
//  j=2 (nums2[1]=0): dp[4][2] = max(5*0 + max(0, dp[3][1]), dp[3][2], dp[4][1]) = max(0 + max(0, 6), 6, 15) = max(6, 6, 15) = 15
//  j=3 (nums2[2]=-6): dp[4][3] = max(5*-6 + max(0, dp[3][2]), dp[3][3], dp[4][2]) = max(-30 + max(0, 6), 18, 15) = max(-24, 18, 15) = 18
//
// Final Answer: dp[4][3] = 18.
//
// Time complexity: O(m * n), where m is the length of nums1 and n is the length of nums2.
// We iterate through each cell of the m x n DP table once.
//
// Space complexity: O(m * n) for the DP table.
// This can be optimized to O(min(m, n)) space by noticing that `dp[i][j]` only depends on the previous row
// (or previous column). However, given the constraints (up to 500x500), O(m*n) space is acceptable.
//
var maxDotProduct = function(nums1, nums2) {
    const m = nums1.length;
    const n = nums2.length;

    // Initialize DP table with a very small negative number to represent negative infinity.
    // This ensures that any valid dot product (even negative) will be greater than this initial value.
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(-Infinity));

    // Iterate through each element of nums1 and nums2.
    // i and j are 1-indexed for convenience with the DP table.
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            // Calculate the product of the current elements.
            const currentProduct = nums1[i - 1] * nums2[j - 1];

            // The maximum dot product ending at dp[i][j] can be formed in several ways:
            //
            // 1. Extend a previous subsequence:
            //    If dp[i-1][j-1] is positive, it means we had a positive dot product up to the previous elements.
            //    We can extend this by adding the current product: dp[i-1][j-1] + currentProduct.
            //    If dp[i-1][j-1] is negative or zero, it's better to start a new subsequence with just currentProduct,
            //    so we take max(0, dp[i-1][j-1]) to ensure we only add if it's beneficial, and then add currentProduct.
            //    This simplifies to: currentProduct + Math.max(0, dp[i-1][j-1])
            //
            // 2. Exclude nums1[i-1] and take the max dot product from dp[i-1][j].
            //
            // 3. Exclude nums2[j-1] and take the max dot product from dp[i][j-1].
            //
            // We take the maximum of these three possibilities.
            // Note: currentProduct itself is also a candidate if it's the best standalone product.
            // The formula `currentProduct + Math.max(0, dp[i-1][j-1])` implicitly handles the case where currentProduct
            // is the best standalone option if dp[i-1][j-1] is negative or -Infinity. If dp[i-1][j-1] is -Infinity,
            // Math.max(0, dp[i-1][j-1]) is 0, and we'd consider currentProduct.
            //
            // So, dp[i][j] is the maximum of:
            // - The current product itself (if it's the best standalone choice).
            // - The current product added to the best previous dot product (if extending improves it).
            // - The best dot product excluding nums1[i-1] (dp[i-1][j]).
            // - The best dot product excluding nums2[j-1] (dp[i][j-1]).
            //
            // Combining these, the core logic is:
            // dp[i][j] = max(
            //              currentProduct + max(0, dp[i-1][j-1]), // Include both current elements, potentially extending.
            //              dp[i-1][j],                         // Exclude nums1[i-1].
            //              dp[i][j-1)                          // Exclude nums2[j-1].
            //
            // However, a more direct and robust way to think about it that handles all cases:
            // The maximum dot product ending at (i, j) is the maximum of:
            // 1. The product of nums1[i-1] and nums2[j-1] itself. This is important if all previous products were negative
            //    and this positive product is the best we can do.
            // 2. The product of nums1[i-1] and nums2[j-1] *added* to the maximum dot product ending at (i-1, j-1).
            //    This is `currentProduct + dp[i-1][j-1]`. This is only beneficial if `dp[i-1][j-1]` is not negative infinity.
            //    If `dp[i-1][j-1]` is negative, `currentProduct` itself is better.
            //    So we can say: `max(currentProduct, currentProduct + dp[i-1][j-1])` which is `currentProduct + max(0, dp[i-1][j-1])` IF `dp[i-1][j-1]` is a valid sum.
            //    But if `dp[i-1][j-1]` is -Infinity, `max(0, dp[i-1][j-1])` is 0. The actual value of `dp[i-1][j-1]` matters if it's a computed negative value.
            //    The most robust way to ensure we consider the current product as a *start* is to compare it with extending.
            //    So, we take `max(currentProduct, dp[i-1][j-1] + currentProduct)`
            // 3. The maximum dot product without using nums1[i-1], which is `dp[i-1][j]`.
            // 4. The maximum dot product without using nums2[j-1], which is `dp[i][j-1]`.
            //
            // Therefore, the state transition is:
            // dp[i][j] = max(
            //              currentProduct,                      // Current product as a subsequence of length 1.
            //              dp[i-1][j-1] + currentProduct,       // Extend previous subsequence.
            //              dp[i-1][j],                          // Skip nums1[i-1].
            //              dp[i][j-1)                           // Skip nums2[j-1].
            //           )
            //
            // If `dp[i-1][j-1]` is -Infinity, then `dp[i-1][j-1] + currentProduct` will also be -Infinity.
            // This means the `currentProduct` will be compared against `dp[i-1][j]` and `dp[i][j-1]`.
            //
            dp[i][j] = Math.max(
                currentProduct, // Option 1: Start a new subsequence with just currentProduct
                dp[i-1][j-1] + currentProduct, // Option 2: Extend the best subsequence ending at (i-1, j-1)
                dp[i-1][j], // Option 3: Do not include nums1[i-1]
                dp[i][j-1] // Option 4: Do not include nums2[j-1]
            );

             // This logic is a bit more consolidated and handles cases correctly.
             // When considering dp[i][j], we have these options:
             // 1. Include nums1[i-1] and nums2[j-1] as the *first* elements of a subsequence.
             //    The dot product is just `currentProduct`.
             // 2. Include nums1[i-1] and nums2[j-1] and extend a previous subsequence.
             //    The dot product is `dp[i-1][j-1] + currentProduct`. This is only meaningful if `dp[i-1][j-1]` is not -Infinity.
             // 3. Do not include nums1[i-1]. The max dot product is `dp[i-1][j]`.
             // 4. Do not include nums2[j-1]. The max dot product is `dp[i][j-1]`.
             //
             // We need to take the maximum of these.
             // If `dp[i-1][j-1]` is -Infinity, then `dp[i-1][j-1] + currentProduct` will also be -Infinity.
             // So, `max(currentProduct, dp[i-1][j-1] + currentProduct)` correctly handles starting a new subsequence or extending.
             //
             // The state can be updated as:
             // dp[i][j] = max(
             //                currentProduct + max(0, dp[i-1][j-1]), // If dp[i-1][j-1] is positive, extend. If not, just take currentProduct.
             //                dp[i-1][j],
             //                dp[i][j-1)
             //             )
             // This is also correct and often seen. Let's stick with the more explicit one for clarity.
        }
    }

    // The maximum dot product of non-empty subsequences is stored in dp[m][n].
    return dp[m][n];
};
```