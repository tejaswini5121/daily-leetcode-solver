/*
Problem Summary:
This problem requires decoding an `encodedText` string that was created using a slanted transposition cipher. The `originalText` was placed into a matrix of a specified number of `rows` diagonally (top-left to bottom-right), with empty cells filled by spaces. The `encodedText` is then formed by reading this matrix row-wise. We need to reverse this process, given `encodedText` and `rows`, to return the `originalText`.

Link:
https://leetcode.com/problems/decode-the-slanted-ciphertext/

Approach Explanation:
1.  **Determine Matrix Dimensions**: The `encodedText` is formed by reading the matrix row-wise. Therefore, the total number of cells in the matrix is `encodedText.length`. Given `rows`, the number of columns `cols` can be calculated as `encodedText.length / rows`.
2.  **Diagonal Traversal for Decoding**: The `originalText` was filled into the matrix by traversing diagonals. The first character goes into `(0,0)`, the second into `(1,1)`, and so on, until a diagonal is exhausted or `originalText` runs out. Then, the next diagonal starts from `(0,1)`, filling `(0,1)`, `(1,2)`, `(2,3)`, etc. This pattern continues for diagonals starting at `(0, k)` for `k` from `0` up to `cols - 1`.
3.  **Reconstruct `originalText`**: To decode, we simulate this diagonal filling order. We iterate `k` (the starting column of a diagonal, from `0` to `cols - 1`). For each `k`, we iterate `r` (row index, from `0` to `rows - 1`). The corresponding column `c` for a cell `(r, c)` on this diagonal is `k + r`. The character at `matrix[r][c]` can be retrieved from `encodedText` at index `r * cols + c`. We append these characters to a list.
4.  **Handle Trailing Spaces**: After collecting all characters from the relevant diagonals, the resulting string might have trailing spaces. This happens because empty cells in the matrix (that were filled with spaces) might be encountered during diagonal traversal, especially if the `originalText` was short. The problem states that `originalText` does not have any trailing spaces, so we must `trimEnd()` the reconstructed string before returning it.

Time Complexity:
O(L), where L is the length of `encodedText`.
- Calculating `cols` is an O(1) operation.
- The nested loops iterate through positions `(r, c)` that correspond to where `originalText` characters could have been placed. In the worst case, this covers all `rows * cols` cells, which is equal to `encodedText.length`. Each cell access and array push is O(1).
- Joining the character array into a string takes O(L) time.
- The `trimEnd()` operation also takes O(L) time in the worst case (e.g., if the entire string is spaces or ends with many spaces).
Thus, the overall time complexity is linear with respect to the length of `encodedText`.

Space Complexity:
O(L), where L is the length of `encodedText`.
- An array `originalTextChars` is used to store the characters of the `originalText`. In the worst case, if `originalText` contains many spaces or is very long, this array can hold up to L characters.
- Other variables use constant space.
*/
var decodeCiphertext = function(encodedText, rows) {
    // If the encoded text is empty, the original text must also be empty.
    if (encodedText.length === 0) {
        return "";
    }

    // Calculate the number of columns in the conceptual matrix.
    // The `encodedText` is formed by reading the matrix row-wise,
    // so its total length equals `rows * cols`.
    const cols = encodedText.length / rows;

    // This array will accumulate characters for the `originalText` in their decoded order.
    // Using an array and then joining it is generally more efficient for building strings
    // in JavaScript compared to repeated string concatenation, especially for larger strings.
    const originalTextChars = [];

    // Iterate through the diagonals to reconstruct the `originalText`.
    // The `originalText` was filled into the matrix starting from the top-left cell (0,0),
    // then (1,1), (2,2), etc., forming the first diagonal.
    // Then, the next diagonal starts from (0,1), filling (0,1), (1,2), (2,3), etc.
    // We iterate 'k' which represents the starting column of each diagonal (from (0, k)).
    // 'k' ranges from 0 up to `cols - 1`.
    for (let k = 0; k < cols; k++) {
        // For each diagonal starting at `(0, k)`, we traverse its cells.
        // 'r' is the current row index, starting from 0 for the first cell in the diagonal.
        // 'c' is the current column index, which for a cell on this diagonal is `k + r`.
        for (let r = 0; r < rows; r++) {
            const c = k + r; // Calculate the column index for the current cell on the diagonal.

            // Check if the current cell `(r, c)` is within the matrix bounds.
            // The row index `r` is guaranteed to be within bounds (`0` to `rows-1`) by the outer loop condition.
            // We only need to ensure the column index `c` is within bounds (`0` to `cols-1`).
            if (c < cols) {
                // If the cell `(r, c)` is within bounds, retrieve its character.
                // In the `encodedText`, the character at conceptual `matrix[r][c]` is located
                // at the linear index `r * cols + c`.
                originalTextChars.push(encodedText[r * cols + c]);
            } else {
                // If `c` goes out of bounds (`c >= cols`), it means this diagonal has ended
                // or gone beyond the right edge of the matrix.
                // Any subsequent cells in this diagonal (with increasing `r`) would also have `c` out of bounds.
                // Therefore, we can break from this inner loop and proceed to the next diagonal (increment `k`).
                break;
            }
        }
    }

    // After traversing all relevant diagonals, join the collected characters to form the `originalText` string.
    let originalText = originalTextChars.join('');

    // The problem statement specifies that the `originalText` does not have any trailing spaces.
    // Our diagonal reconstruction might pick up space characters from empty cells at the end of diagonals
    // that were originally filled with spaces during encoding.
    // We use JavaScript's `trimEnd()` method to remove any such trailing spaces from the reconstructed string.
    return originalText.trimEnd();
};