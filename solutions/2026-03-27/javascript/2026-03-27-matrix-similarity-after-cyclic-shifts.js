/**
 * @param {number[][]} mat
 * @param {number} k
 * @return {boolean}
 */
// Problem Summary: Check if a matrix returns to its original state after k cyclic shifts on even and odd rows.
// Link: https://leetcode.com/problems/matrix-similarity-after-cyclic-shifts/
// Approach:
// The core idea is to realize that for the matrix to be identical after k shifts, each row must return to its original state after k shifts.
// For even-indexed rows, a left cyclic shift by 1 moves the first element to the end. After `mat[0].length` shifts, the row returns to its original state.
// For odd-indexed rows, a right cyclic shift by 1 moves the last element to the beginning. After `mat[1].length` shifts, the row returns to its original state.
// Therefore, we only need to check if `k` is a multiple of the row length for each row. If `k % row.length === 0`, then that row will return to its original state.
// We iterate through each row. If it's an even-indexed row, we check if `k % mat[i].length === 0`. If it's an odd-indexed row, we also check if `k % mat[i].length === 0`.
// If for any row, `k % mat[i].length !== 0`, then that row will not return to its original state, and thus the entire matrix will not be similar. We can immediately return `false`.
// If we iterate through all rows and `k` is a multiple of every row's length, it means all rows will return to their original positions, and we return `true`.
//
// Time Complexity: O(m), where m is the number of rows. We iterate through each row once. The modulo operation takes constant time.
// Space Complexity: O(1). We are not using any extra space that depends on the input size.
const matrix1758 = (mat, k) => {
    const m = mat.length;
    // Iterate through each row of the matrix
    for (let i = 0; i < m; i++) {
        // Check if the number of shifts k is a multiple of the row's length.
        // If k is a multiple of the row length, then after k shifts, the row will return to its original state.
        // This is because a cyclic shift by `row.length` positions brings the row back to its original configuration.
        if (k % mat[i].length !== 0) {
            // If for any row, k is not a multiple of its length,
            // that row will not be in its original state after k shifts.
            // Therefore, the entire matrix will not be similar to the original.
            return false;
        }
    }
    // If k is a multiple of every row's length, then all rows will return to their original states.
    // Thus, the matrix will be identical to the original.
    return true;
};
```