// Problem: Rectangle Overlap
// Summary: Checks if two axis-aligned rectangles have a positive overlapping area.
// Link: https://leetcode.com/problems/rectangle-overlap/
// Approach:
// Two rectangles overlap if and only if they do NOT NOT overlap.
// Two rectangles do NOT overlap if one is entirely to the left, right, below, or above the other.
//
// Let rec1 = [x1, y1, x2, y2] and rec2 = [x3, y3, x4, y4].
//
// Condition for NOT overlapping:
// 1. rec1 is to the left of rec2: x2 <= x3
// 2. rec1 is to the right of rec2: x1 >= x4
// 3. rec1 is below rec2: y2 <= y3
// 4. rec1 is above rec2: y1 >= y4
//
// If ANY of these conditions are true, the rectangles do NOT overlap.
// Therefore, if NONE of these conditions are true, the rectangles MUST overlap.
//
// The overlap condition can be expressed as:
// NOT (x2 <= x3 OR x1 >= x4 OR y2 <= y3 OR y1 >= y4)
//
// Using De Morgan's laws, this is equivalent to:
// (x2 > x3) AND (x1 < x4) AND (y2 > y3) AND (y1 < y4)
//
// This means:
// - The right edge of rec1 must be to the right of the left edge of rec2 (x2 > x3).
// - The left edge of rec1 must be to the left of the right edge of rec2 (x1 < x4).
// - The top edge of rec1 must be above the bottom edge of rec2 (y2 > y3).
// - The bottom edge of rec1 must be below the top edge of rec2 (y1 < y4).
//
// Time complexity: O(1) - We perform a constant number of comparisons.
// Space complexity: O(1) - We use a constant amount of extra space.
/**
 * @param {number[]} rec1
 * @param {number[]} rec2
 * @return {boolean}
 */
var isRectangleOverlap = function(rec1, rec2) {
    // Extract coordinates for clarity
    const [x1, y1, x2, y2] = rec1;
    const [x3, y3, x4, y4] = rec2;

    // Check for non-overlapping conditions.
    // If any of these are true, the rectangles do NOT overlap.
    // 1. rec1 is to the left of rec2 (rec1's right edge is at or left of rec2's left edge)
    // 2. rec1 is to the right of rec2 (rec1's left edge is at or right of rec2's right edge)
    // 3. rec1 is below rec2 (rec1's top edge is at or below rec2's bottom edge)
    // 4. rec1 is above rec2 (rec1's bottom edge is at or above rec2's top edge)
    const noOverlap = (
        x2 <= x3 || // rec1 is left of rec2
        x1 >= x4 || // rec1 is right of rec2
        y2 <= y3 || // rec1 is below rec2
        y1 >= y4    // rec1 is above rec2
    );

    // If they do NOT overlap, return false.
    // Otherwise, they must overlap, so return true.
    return !noOverlap;

    // Alternative implementation using the direct overlap condition:
    // This checks if the horizontal and vertical intervals overlap.
    // For horizontal overlap: the right edge of rec1 must be past the left edge of rec2,
    // AND the left edge of rec1 must be before the right edge of rec2.
    // Similarly for vertical overlap.
    //
    // return (
    //     x1 < x4 && // Left edge of rec1 is to the left of right edge of rec2
    //     x3 < x2 && // Left edge of rec2 is to the left of right edge of rec1
    //     y1 < y4 && // Bottom edge of rec1 is below top edge of rec2
    //     y3 < y2    // Bottom edge of rec2 is below top edge of rec1
    // );
};
```