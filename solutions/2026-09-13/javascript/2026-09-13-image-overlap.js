/**
 * @param {number[][]} img1
 * @param {number[][]} img2
 * @return {number}
 *
 * Summary: Find the maximum overlap between two binary images after translating one of them.
 * Link: https://leetcode.com/problems/image-overlap/
 *
 * Approach:
 * The core idea is to consider all possible relative translations between the two images.
 * For each possible translation, we check the overlap.
 * A translation can be represented by a shift in the row (dr) and column (dc).
 * The possible range for dr and dc is from -(n-1) to (n-1), where n is the dimension of the square matrix.
 *
 * Instead of iterating through all possible shifts and then checking overlap, we can reframe the problem.
 * If img1 has a '1' at (r1, c1) and img2 has a '1' at (r2, c2), and we want to align these two '1's,
 * then the required translation for img1 relative to img2 would be:
 * dr = r2 - r1
 * dc = c2 - c1
 *
 * So, we can iterate through all '1's in img1 and all '1's in img2. For each pair of '1's,
 * we calculate the required relative shift (dr, dc). We then use a map (or a 2D array if we discretize the shifts)
 * to count how many times each specific shift (dr, dc) occurs. The shift that occurs most frequently
 * indicates the translation that aligns the maximum number of '1's.
 *
 * The range of possible relative shifts (dr, dc) is such that if a '1' from img1 at (r1, c1) is translated by (dr, dc)
 * to align with a '1' from img2 at (r2, c2), then:
 * r1 + dr = r2  => dr = r2 - r1
 * c1 + dc = c2  => dc = c2 - c1
 *
 * Since 0 <= r1, r2, c1, c2 < n, the range of dr and dc is from -(n-1) to (n-1).
 * To use these shifts as keys in a map or indices in an array, we can offset them.
 * A common way is to add (n-1) to both dr and dc, so the shifted indices range from 0 to 2*(n-1).
 * For example, if n=3, the shifts are from -2 to 2. Adding (3-1)=2 to them gives 0 to 4.
 *
 * Algorithm:
 * 1. Find all coordinates of '1's in img1. Store them in a list `ones1`.
 * 2. Find all coordinates of '1's in img2. Store them in a list `ones2`.
 * 3. Initialize a map `shiftCounts` to store the frequency of each relative shift (dr, dc). The key will be a string "dr,dc".
 * 4. Initialize `maxOverlap = 0`.
 * 5. Iterate through each coordinate `(r1, c1)` in `ones1`.
 * 6. Iterate through each coordinate `(r2, c2)` in `ones2`.
 * 7. Calculate the required shift: `dr = r2 - r1`, `dc = c2 - c1`.
 * 8. Create a key for the shift: `key = `${dr},${dc}``.
 * 9. Increment the count for this key in `shiftCounts`. `shiftCounts[key] = (shiftCounts[key] || 0) + 1`.
 * 10. Update `maxOverlap = Math.max(maxOverlap, shiftCounts[key])`.
 * 11. Return `maxOverlap`.
 *
 * Time Complexity:
 * Let n be the dimension of the square matrices.
 * Finding all '1's in img1 takes O(n^2) time.
 * Finding all '1's in img2 takes O(n^2) time.
 * Let N1 be the number of '1's in img1 and N2 be the number of '1's in img2. In the worst case, N1 and N2 can be up to n^2.
 * The nested loops iterate N1 * N2 times. In the worst case, this is O((n^2) * (n^2)) = O(n^4).
 * Map operations (insertion and retrieval) take O(1) on average.
 * Thus, the overall time complexity is dominated by the nested loops, which is O(n^4).
 *
 * Space Complexity:
 * Storing `ones1` and `ones2` can take up to O(n^2) space if all elements are '1'.
 * The `shiftCounts` map can store up to O((2n-1)^2) entries, which is O(n^2), because there are (2n-1) possible values for dr and (2n-1) for dc.
 * Therefore, the space complexity is O(n^2).
 */
/**
 * @param {number[][]} img1
 * @param {number[][]} img2
 * @return {number}
 */
var largestOverlap = function(img1, img2) {
    const n = img1.length; // Get the dimension of the square matrices

    // Lists to store the coordinates of '1's in each image
    const ones1 = [];
    const ones2 = [];

    // Populate ones1 by iterating through img1
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (img1[r][c] === 1) {
                ones1.push([r, c]);
            }
        }
    }

    // Populate ones2 by iterating through img2
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (img2[r][c] === 1) {
                ones2.push([r, c]);
            }
        }
    }

    // If either image has no '1's, the maximum overlap is 0
    if (ones1.length === 0 || ones2.length === 0) {
        return 0;
    }

    // Map to store the frequency of each relative shift (dr, dc)
    // Key format: "dr,dc" (e.g., "1,-2")
    const shiftCounts = new Map();
    let maxOverlap = 0; // Variable to keep track of the maximum overlap found so far

    // Iterate through each '1' in img1
    for (const [r1, c1] of ones1) {
        // Iterate through each '1' in img2
        for (const [r2, c2] of ones2) {
            // Calculate the required shift (dr, dc) to align (r1, c1) with (r2, c2)
            // If img1[r1][c1] is translated by (dr, dc), it should land on img2[r2][c2].
            // So, r1 + dr = r2  => dr = r2 - r1
            // And, c1 + dc = c2  => dc = c2 - c1
            const dr = r2 - r1;
            const dc = c2 - c1;

            // Create a unique key for this shift
            const key = `${dr},${dc}`;

            // Increment the count for this shift. If the key doesn't exist, initialize it to 0.
            const currentCount = (shiftCounts.get(key) || 0) + 1;
            shiftCounts.set(key, currentCount);

            // Update the maximum overlap found so far
            maxOverlap = Math.max(maxOverlap, currentCount);
        }
    }

    // Return the largest overlap found
    return maxOverlap;
};