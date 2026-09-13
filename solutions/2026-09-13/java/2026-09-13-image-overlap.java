/**
 * Calculates the largest possible overlap between two binary images after translation.
 * The images are represented as square n x n matrices of 0s and 1s.
 * The overlap is determined by counting positions with a 1 in both images after shifting one image.
 *
 * Link: https://leetcode.com/problems/image-overlap/
 *
 * Approach:
 * The core idea is to consider all possible relative translations between the two images.
 * For each possible translation, we calculate the overlap. The maximum overlap found across all
 * translations is the answer.
 *
 * A translation can be represented by a difference in row indices (dr) and a difference in column indices (dc).
 * If we consider img2 as stationary, we can slide img1. A '1' at img1[r1][c1] will align with a '1' at
 * img2[r2][c2] if r1 - r2 = dr and c1 - c2 = dc.
 *
 * Instead of iterating through all possible dr and dc values (which would be from -(n-1) to n-1 for both),
 * we can reframe the problem. If a '1' from img1 at (r1, c1) overlaps with a '1' from img2 at (r2, c2),
 * then the translation vector that aligns them is (r1 - r2, c1 - c2).
 *
 * We can iterate through all '1's in img1 and all '1's in img2. For every pair of '1's, we calculate the
 * displacement vector required to align them. This displacement vector (dr, dc) signifies a potential
 * overlap. We can use a map (or an array of arrays if the offset range is manageable) to store the
 * count of how many times each displacement vector occurs.
 *
 * The keys of the map would be the displacement vectors (e.g., encoded as a single integer or a pair),
 * and the values would be the number of times that displacement aligns a '1' from img1 with a '1' from img2.
 * The maximum value in this map will be our answer.
 *
 * For example, if img1 has a '1' at (r1, c1) and img2 has a '1' at (r2, c2), the displacement is
 * (r1 - r2, c1 - c2). We increment the count for this displacement.
 *
 * The range of possible displacements is from -(n-1) to (n-1) for both row and column.
 * So, for dr, the range is -(n-1) to (n-1). For dc, the range is -(n-1) to (n-1).
 *
 * We can use a 2D array `counts[2*n-1][2*n-1]` to store the counts.
 * The offset for row `dr` will be `dr + (n-1)`.
 * The offset for column `dc` will be `dc + (n-1)`.
 * This way, all displacement values are mapped to non-negative indices.
 *
 * Time Complexity:
 * We iterate through all cells of img1 (O(n^2)) and for each cell, we iterate through all cells of img2 (O(n^2)).
 * Inside the inner loop, we perform constant time operations (checking for '1's, map/array updates).
 * Therefore, the overall time complexity is O(n^2 * n^2) = O(n^4).
 *
 * However, if we optimize by only iterating through the '1's in each image:
 * Let L1 be the number of '1's in img1 and L2 be the number of '1's in img2.
 * The complexity becomes O(L1 * L2). In the worst case, L1 and L2 can be up to n^2, leading to O(n^4).
 * With the array approach for counts, we iterate through all n^2 cells of img1, and for each '1', we iterate through
 * all n^2 cells of img2. So it's O(n^2 * n^2) if we check all pairs.
 *
 * A more efficient approach for counting:
 * Iterate through all cells (r1, c1) in img1. If img1[r1][c1] is 1:
 *   Iterate through all cells (r2, c2) in img2. If img2[r2][c2] is 1:
 *     Calculate the shift: dr = r1 - r2, dc = c1 - c2.
 *     Increment a counter for this specific shift (dr, dc).
 * The max count for any shift is the answer.
 *
 * Let's refine the approach with the 2D array for counts:
 * 1. Create a 2D array `counts` of size (2n-1) x (2n-1) initialized to 0.
 * 2. Iterate through img1. For each cell (r1, c1):
 *    If img1[r1][c1] == 1:
 *      Iterate through img2. For each cell (r2, c2):
 *        If img2[r2][c2] == 1:
 *          Calculate row shift: dr = r1 - r2
 *          Calculate col shift: dc = c1 - c2
 *          // Map shifts to array indices:
 *          // Row index: dr + (n - 1)
 *          // Col index: dc + (n - 1)
 *          counts[r1 - r2 + n - 1][c1 - c2 + n - 1]++;
 * 3. Find the maximum value in the `counts` array. This is the largest overlap.
 *
 * Example: n=3
 * Possible dr: -2, -1, 0, 1, 2. Indices: 0, 1, 2, 3, 4. (n-1=2)
 * Possible dc: -2, -1, 0, 1, 2. Indices: 0, 1, 2, 3, 4. (n-1=2)
 * counts array size: (2*3 - 1) x (2*3 - 1) = 5x5.
 *
 * If img1[1][1] = 1 and img2[0][0] = 1:
 * dr = 1 - 0 = 1
 * dc = 1 - 0 = 1
 * Row index = 1 + (3 - 1) = 3
 * Col index = 1 + (3 - 1) = 3
 * counts[3][3]++
 *
 * This approach is indeed O(n^4) in the worst case.
 *
 * Space Complexity:
 * We use a 2D array `counts` of size (2n-1) x (2n-1).
 * This results in a space complexity of O((2n-1)*(2n-1)) which simplifies to O(n^2).
 */
class Solution {
    public int largestOverlap(int[][] img1, int[][] img2) {
        int n = img1.length; // Get the dimension of the square images

        // Create a 2D array to store the count of overlaps for each possible shift.
        // The size is (2*n - 1) x (2*n - 1) because the row and column shifts can range
        // from -(n-1) to (n-1). We use an offset of (n-1) to map these shifts to
        // non-negative indices (0 to 2*n - 2).
        // For example, a shift of -(n-1) maps to index 0, a shift of 0 maps to index n-1,
        // and a shift of (n-1) maps to index 2*n-2.
        int[][] counts = new int[2 * n - 1][2 * n - 1];

        // Maximum overlap found so far. Initialize to 0.
        int maxOverlap = 0;

        // Iterate through all cells of the first image (img1).
        for (int r1 = 0; r1 < n; r1++) {
            for (int c1 = 0; c1 < n; c1++) {
                // If we find a '1' in img1, it's a potential point for overlap.
                if (img1[r1][c1] == 1) {
                    // Now, iterate through all cells of the second image (img2).
                    for (int r2 = 0; r2 < n; r2++) {
                        for (int c2 = 0; c2 < n; c2++) {
                            // If we find a '1' in img2, check if it can align with the '1' from img1.
                            if (img2[r2][c2] == 1) {
                                // Calculate the relative shift in rows and columns required to align
                                // the '1' at (r1, c1) in img1 with the '1' at (r2, c2) in img2.
                                // If img1[r1][c1] is to overlap with img2[r2][c2], then
                                // the shift in rows for img1 would be r1 - r2, and for columns c1 - c2.
                                int rowShift = r1 - r2;
                                int colShift = c1 - c2;

                                // Map these shifts to indices in our `counts` array.
                                // The offset is (n - 1) to ensure all indices are non-negative.
                                // A shift of `rowShift` corresponds to index `rowShift + (n - 1)`.
                                // A shift of `colShift` corresponds to index `colShift + (n - 1)`.
                                int rowIndex = rowShift + (n - 1);
                                int colIndex = colShift + (n - 1);

                                // Increment the count for this specific shift. This means that this
                                // particular shift aligns a '1' from img1 with a '1' from img2.
                                counts[rowIndex][colIndex]++;

                                // Update the maximum overlap found so far.
                                // `counts[rowIndex][colIndex]` represents the number of pairs of '1's that
                                // align for this specific shift.
                                maxOverlap = Math.max(maxOverlap, counts[rowIndex][colIndex]);
                            }
                        }
                    }
                }
            }
        }

        // Return the largest overlap found across all possible translations.
        return maxOverlap;
    }
}
