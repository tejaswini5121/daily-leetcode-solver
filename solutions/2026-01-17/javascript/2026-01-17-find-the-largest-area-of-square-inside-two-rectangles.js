// /**
//  * @param {number[][]} bottomLeft
//  * @param {number[][]} topRight
//  * @return {number}
//  */
// /*
//  * Problem Summary: Find the largest area of a square that can fit within the intersection of any two given rectangles.
//  * Link: https://leetcode.com/problems/find-the-largest-area-of-square-inside-two-rectangles/
//  *
//  * Approach:
//  * The problem asks for the largest square that can fit inside the intersection of *at least* two rectangles.
//  * This means we need to consider all possible pairs of rectangles. For each pair, we calculate their intersection.
//  * If two rectangles intersect, the intersection region is also a rectangle.
//  * For a rectangular intersection defined by (x1, y1) as bottom-left and (x2, y2) as top-right,
//  * the largest square that can fit inside it will have a side length equal to the minimum of (x2 - x1) and (y2 - y1).
//  *
//  * We iterate through all unique pairs of rectangles (i, j) where i < j.
//  * For each pair, we find the coordinates of their intersection rectangle:
//  *   - The bottom-left x-coordinate of the intersection is the maximum of the two rectangles' bottom-left x-coordinates.
//  *   - The bottom-left y-coordinate of the intersection is the maximum of the two rectangles' bottom-left y-coordinates.
//  *   - The top-right x-coordinate of the intersection is the minimum of the two rectangles' top-right x-coordinates.
//  *   - The top-right y-coordinate of the intersection is the minimum of the two rectangles' top-right y-coordinates.
//  *
//  * If the calculated intersection's bottom-left x is less than its top-right x, AND
//  * the calculated intersection's bottom-left y is less than its top-right y,
//  * then the rectangles actually intersect, and the intersection forms a valid rectangle.
//  * The side length of the largest square that can fit in this intersection is `min(intersection_width, intersection_height)`.
//  *
//  * We keep track of the maximum such side length found across all intersecting pairs.
//  * Finally, the maximum area is the square of this maximum side length. If no intersection is found, the maximum side length remains 0, and the area is 0.
//  *
//  * Time Complexity:
//  * We have `n` rectangles. We iterate through all pairs of rectangles, which is O(n^2).
//  * For each pair, the intersection calculation and finding the minimum side length takes constant time O(1).
//  * Therefore, the overall time complexity is O(n^2).
//  *
//  * Space Complexity:
//  * We are only using a few variables to store the maximum side length and intersection coordinates.
//  * The space used does not depend on the input size `n`.
//  * Therefore, the space complexity is O(1).
//  */
// const largestSquareArea = (bottomLeft, topRight) => {
//     // Initialize the maximum side length of a square to 0.
//     let maxSideLength = 0;
//     const n = bottomLeft.length;
//
//     // Iterate through all possible pairs of rectangles.
//     // We use nested loops, ensuring i < j to consider each pair only once.
//     for (let i = 0; i < n; i++) {
//         for (let j = i + 1; j < n; j++) {
//             // Extract coordinates for rectangle i
//             const [x1_i, y1_i] = bottomLeft[i];
//             const [x2_i, y2_i] = topRight[i];
//
//             // Extract coordinates for rectangle j
//             const [x1_j, y1_j] = bottomLeft[j];
//             const [x2_j, y2_j] = topRight[j];
//
//             // Calculate the coordinates of the intersection rectangle.
//             // The bottom-left x of the intersection is the maximum of the two bottom-left x's.
//             const intersection_x1 = Math.max(x1_i, x1_j);
//             // The bottom-left y of the intersection is the maximum of the two bottom-left y's.
//             const intersection_y1 = Math.max(y1_i, y1_j);
//             // The top-right x of the intersection is the minimum of the two top-right x's.
//             const intersection_x2 = Math.min(x2_i, x2_j);
//             // The top-right y of the intersection is the minimum of the two top-right y's.
//             const intersection_y2 = Math.min(y2_i, y2_j);
//
//             // Check if the intersection is valid (i.e., it forms a rectangle, not a point or a line segment).
//             // This is true if the bottom-left x is strictly less than the top-right x, AND
//             // the bottom-left y is strictly less than the top-right y.
//             if (intersection_x1 < intersection_x2 && intersection_y1 < intersection_y2) {
//                 // If the intersection is valid, calculate its width and height.
//                 const intersection_width = intersection_x2 - intersection_x1;
//                 const intersection_height = intersection_y2 - intersection_y1;
//
//                 // The side length of the largest square that can fit inside this intersection
//                 // is the minimum of its width and height.
//                 const currentSideLength = Math.min(intersection_width, intersection_height);
//
//                 // Update the maximum side length found so far.
//                 maxSideLength = Math.max(maxSideLength, currentSideLength);
//             }
//         }
//     }
//
//     // The maximum area is the square of the maximum side length.
//     return maxSideLength * maxSideLength;
// };
//
// // Example Test Cases:
//
// // Example 1:
// // const bottomLeft1 = [[1,1],[2,2],[3,1]];
// // const topRight1 = [[3,3],[4,4],[6,6]];
// // console.log(`Example 1 Output: ${largestSquareArea(bottomLeft1, topRight1)}`); // Expected: 1
//
// // Example 2:
// // const bottomLeft2 = [[1,1],[1,3],[1,5]];
// // const topRight2 = [[5,5],[5,7],[5,9]];
// // console.log(`Example 2 Output: ${largestSquareArea(bottomLeft2, topRight2)}`); // Expected: 4
//
// // Example 3:
// // const bottomLeft3 = [[1,1],[2,2],[1,2]];
// // const topRight3 = [[3,3],[4,4],[3,4]];
// // console.log(`Example 3 Output: ${largestSquareArea(bottomLeft3, topRight3)}`); // Expected: 1
//
// // Example 4:
// // const bottomLeft4 = [[1,1],[3,3],[3,1]];
// // const topRight4 = [[2,2],[4,4],[4,2]];
// // console.log(`Example 4 Output: ${largestSquareArea(bottomLeft4, topRight4)}`); // Expected: 0
//
// // Example with large coordinates, should not cause overflow issues.
// // const bottomLeft5 = [[1,1],[10000000,10000000]];
// // const topRight5 = [[2,2],[10000001,10000001]];
// // console.log(`Example 5 Output: ${largestSquareArea(bottomLeft5, topRight5)}`); // Expected: 1
//
// // Example where intersection is a line, not a rectangle.
// // const bottomLeft6 = [[1,1],[2,2]];
// // const topRight6 = [[3,2],[4,3]];
// // console.log(`Example 6 Output: ${largestSquareArea(bottomLeft6, topRight6)}`); // Expected: 0 (intersection is y=2, x=2 to 3, which is a line)
//
// // Example where intersection is a point.
// // const bottomLeft7 = [[1,1],[2,2]];
// // const topRight7 = [[2,3],[3,2]];
// // console.log(`Example 7 Output: ${largestSquareArea(bottomLeft7, topRight7)}`); // Expected: 0 (intersection is point (2,2))
/**
 * @param {number[][]} bottomLeft
 * @param {number[][]} topRight
 * @return {number}
 */
/*
 * Problem Summary: Find the largest area of a square that can fit within the intersection of any two given rectangles.
 * Link: https://leetcode.com/problems/find-the-largest-area-of-square-inside-two-rectangles/
 *
 * Approach:
 * We need to find the largest square that can fit inside the intersecting region of *at least* two rectangles.
 * This means we must examine every pair of rectangles. For each pair, we determine their intersection.
 * The intersection of two rectangles (with sides parallel to axes) is itself a rectangle.
 *
 * For any two rectangles, say rectangle A defined by (x1_A, y1_A) and (x2_A, y2_A),
 * and rectangle B defined by (x1_B, y1_B) and (x2_B, y2_B),
 * their intersection rectangle will have the following coordinates:
 * - Bottom-left x: max(x1_A, x1_B)
 * - Bottom-left y: max(y1_A, y1_B)
 * - Top-right x: min(x2_A, x2_B)
 * - Top-right y: min(y2_A, y2_B)
 *
 * An intersection is valid (i.e., it forms a region and not just a line or a point)
 * if the calculated bottom-left x is strictly less than the calculated top-right x,
 * AND the calculated bottom-left y is strictly less than the calculated top-right y.
 *
 * If an intersection is valid, the largest square that can fit inside it will have a side length equal to the minimum of its width and height.
 * The width is (top-right x - bottom-left x) and the height is (top-right y - bottom-left y).
 *
 * We iterate through all unique pairs of rectangles. For each pair, we calculate the intersection's dimensions.
 * If the intersection is valid, we find the maximum possible square side length for that intersection
 * and update our overall maximum side length found so far.
 *
 * Finally, the maximum area is the square of the largest side length found. If no two rectangles intersect to form a region,
 * the maximum side length remains 0, and thus the area is 0.
 *
 * Time Complexity:
 * There are `n` rectangles. We consider all pairs of rectangles, which involves a nested loop structure.
 * The number of pairs is n * (n-1) / 2, which is O(n^2).
 * For each pair, calculating the intersection and finding the minimum side length takes constant time O(1).
 * Therefore, the total time complexity is O(n^2).
 *
 * Space Complexity:
 * We only use a few variables to store the maximum side length and intermediate intersection coordinates.
 * The space used does not grow with the input size `n`.
 * Therefore, the space complexity is O(1).
 */
const largestSquareArea = (bottomLeft, topRight) => {
    // Initialize the maximum side length of a square found so far to 0.
    // This will be our base if no intersecting regions can form a square.
    let maxSideLength = 0;
    const n = bottomLeft.length; // Number of rectangles.

    // Iterate through all possible unique pairs of rectangles.
    // The outer loop selects the first rectangle of the pair.
    for (let i = 0; i < n; i++) {
        // The inner loop selects the second rectangle of the pair.
        // We start `j` from `i + 1` to ensure we consider each pair only once
        // and do not compare a rectangle with itself or in reverse order.
        for (let j = i + 1; j < n; j++) {
            // Extract the coordinates of the bottom-left and top-right corners for rectangle `i`.
            const [x1_i, y1_i] = bottomLeft[i];
            const [x2_i, y2_i] = topRight[i];

            // Extract the coordinates of the bottom-left and top-right corners for rectangle `j`.
            const [x1_j, y1_j] = bottomLeft[j];
            const [x2_j, y2_j] = topRight[j];

            // Calculate the coordinates of the intersection rectangle.
            // The bottom-left x-coordinate of the intersection is the maximum of the two rectangles' bottom-left x-coordinates.
            const intersection_x1 = Math.max(x1_i, x1_j);
            // The bottom-left y-coordinate of the intersection is the maximum of the two rectangles' bottom-left y-coordinates.
            const intersection_y1 = Math.max(y1_i, y1_j);
            // The top-right x-coordinate of the intersection is the minimum of the two rectangles' top-right x-coordinates.
            const intersection_x2 = Math.min(x2_i, x2_j);
            // The top-right y-coordinate of the intersection is the minimum of the two rectangles' top-right y-coordinates.
            const intersection_y2 = Math.min(y2_i, y2_j);

            // Check if the calculated intersection forms a valid rectangular region.
            // A valid intersection exists only if the bottom-left corner is strictly to the left of and below the top-right corner.
            // This means the width (intersection_x2 - intersection_x1) must be greater than 0,
            // and the height (intersection_y2 - intersection_y1) must be greater than 0.
            if (intersection_x1 < intersection_x2 && intersection_y1 < intersection_y2) {
                // If an intersection is valid, calculate its width and height.
                const intersection_width = intersection_x2 - intersection_x1;
                const intersection_height = intersection_y2 - intersection_y1;

                // The side length of the largest square that can fit inside this intersection
                // is limited by the smaller dimension (either width or height).
                const currentSideLength = Math.min(intersection_width, intersection_height);

                // Update `maxSideLength` if the current square's side length is greater.
                maxSideLength = Math.max(maxSideLength, currentSideLength);
            }
        }
    }

    // The maximum area of a square is the square of the maximum side length found.
    // If `maxSideLength` is still 0 (meaning no valid intersections were found),
    // the area will correctly be 0.
    return maxSideLength * maxSideLength;
};