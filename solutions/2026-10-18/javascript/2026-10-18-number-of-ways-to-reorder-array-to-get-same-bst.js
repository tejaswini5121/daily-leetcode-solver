/**
 * @param {number[]} nums
 * @return {number}
 */
// Problem: Number of Ways to Reorder Array to Get Same BST
// Link: https://leetcode.com/problems/number-of-ways-to-reorder-array-to-get-same-bst/
//
// Approach:
// The core idea is that for a BST to be identical, the relative order of elements
// within the left subtree and the relative order of elements within the right subtree
// must be preserved. The root of the BST is fixed by the first element of the array.
//
// 1. Root is determined: The first element of the `nums` array will always be the root of the BST.
// 2. Partitioning: All elements smaller than the root will form the left subtree,
//    and all elements larger than the root will form the right subtree.
// 3. Recursive Structure: The problem then reduces to finding the number of ways to
//    reorder the left subarray to form the same left subtree, and similarly for the
//    right subtree.
// 4. Combinations: If the left subtree has `L` nodes and the right subtree has `R` nodes,
//    the number of ways to interleave the elements of the left and right subtrees
//    while preserving their internal order is given by the binomial coefficient C(L+R, L)
//    or C(L+R, R). This is because we need to choose `L` positions out of `L+R` total positions
//    for the elements of the left subtree.
// 5. Base Case: If the array has 0 or 1 element, there's only 1 way to order it
//    (or 0 ways if we consider it an invalid input for reordering). The problem statement implies
//    that for arrays of size 0 or 1, there's only one way, and no other reordering is possible.
//    However, the problem asks for the number of *different* ways to reorder. If there are no
//    other ways besides the original, the answer is 0. For an array of length <= 1, there are
//    no *other* ways, so the count of *additional* ways is 0.
// 6. Modulo Arithmetic: Since the answer can be very large, all calculations must be
//    performed modulo 10^9 + 7. This includes the binomial coefficient calculation.
//
// Detailed Steps:
// - Precompute Pascal's Triangle (or combinations directly) up to N=1000 for efficient C(n, k) calculation modulo 10^9 + 7.
// - Define a recursive function `countWays(arr)`:
//   - If `arr.length <= 1`, return 1 (representing the single valid arrangement).
//   - Let `root = arr[0]`.
//   - Create `left` and `right` arrays by partitioning `arr` (excluding `root`) based on elements < `root` and > `root`.
//   - `numLeft = left.length`
//   - `numRight = right.length`
//   - Calculate `combinations = C(numLeft + numRight, numLeft) % MOD`.
//   - Recursively call `waysLeft = countWays(left)` and `waysRight = countWays(right)`.
//   - The total ways for this subtree is `(combinations * waysLeft % MOD) * waysRight % MOD`.
// - The final answer is `countWays(nums) - 1` (subtract 1 because the original ordering is not counted as a *different* reordering).
//
// Time Complexity:
// - Precomputation of combinations: O(N^2) where N is the maximum length of nums (1000).
// - The recursive function `countWays` visits each element at most `log N` times in a balanced BST,
//   but in the worst case (a skewed BST), it can be O(N) calls. Each call involves partitioning
//   the array and calculating combinations. Partitioning takes O(N). So, roughly O(N^2) in the worst case.
// - Total Time Complexity: O(N^2) due to partitioning and combinations.
//
// Space Complexity:
// - O(N) for storing the left and right sub-arrays in the recursion stack.
// - O(N^2) for the precomputed combinations table if using Pascal's triangle. If combinations are computed on-the-fly using modular inverse and factorials, it can be O(N) for factorials and O(1) extra space per call.
// - Given N <= 1000, O(N^2) space for combinations is acceptable.

const MOD = 10**9 + 7;
const MAX_N = 1000;

// Precompute combinations (Pascal's Triangle)
// C[n][k] will store the value of n choose k modulo MOD
const C = Array(MAX_N + 1).fill(0).map(() => Array(MAX_N + 1).fill(0));

for (let i = 0; i <= MAX_N; i++) {
    C[i][0] = 1; // C(n, 0) = 1
    for (let j = 1; j <= i; j++) {
        // C(n, k) = C(n-1, k-1) + C(n-1, k)
        C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % MOD;
    }
}

/**
 * Recursive function to count the number of ways to reorder a subarray
 * to form the same BST.
 * @param {number[]} arr - The current subarray.
 * @returns {number} The number of ways to reorder this subarray.
 */
const countWays = (arr) => {
    // Base case: If the array has 0 or 1 element, there's only one way to form the BST.
    if (arr.length <= 1) {
        return 1;
    }

    // The first element is always the root of the BST for this subarray.
    const root = arr[0];

    // Partition the rest of the array into left and right subarrays.
    const leftSubarray = [];
    const rightSubarray = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < root) {
            leftSubarray.push(arr[i]);
        } else {
            rightSubarray.push(arr[i]);
        }
    }

    // Number of nodes in the left and right subtrees.
    const numLeft = leftSubarray.length;
    const numRight = rightSubarray.length;

    // The number of ways to interleave the left and right subarrays.
    // This is equivalent to choosing `numLeft` positions for the left subtree
    // elements out of `numLeft + numRight` total positions.
    // We use the precomputed combinations table C[n][k].
    const combinations = C[numLeft + numRight][numLeft];

    // Recursively calculate the number of ways for the left and right subtrees.
    const waysLeft = countWays(leftSubarray);
    const waysRight = countWays(rightSubarray);

    // Total ways for this subtree is:
    // (ways to interleave) * (ways to reorder left subtree) * (ways to reorder right subtree)
    // Apply modulo at each multiplication step to prevent overflow.
    let totalWays = (combinations * waysLeft) % MOD;
    totalWays = (totalWays * waysRight) % MOD;

    return totalWays;
};


/**
 * @param {number[]} nums
 * @return {number}
 */
var numOfWays = function(nums) {
    // The `countWays` function calculates the total number of permutations that result
    // in the same BST, including the original permutation.
    // We need to return the number of *different* ways to reorder.
    // So, we subtract 1 from the total count.
    // If the result is 0 after subtracting 1, it means there were no other ways.
    // For example, if nums = [1,2,3], countWays([1,2,3]) will return 1.
    // 1 - 1 = 0, which is correct.
    const totalPermutations = countWays(nums);
    return (totalPermutations - 1 + MOD) % MOD; // Add MOD before taking modulo to handle negative results if any
};
