// Problem: Rectangle Overlap
// Link: https://leetcode.com/problems/rectangle-overlap/
//
// Approach:
// Two rectangles overlap if and only if their horizontal intervals overlap AND their vertical intervals overlap.
// Two intervals [a, b] and [c, d] overlap if max(a, c) < min(b, d).
// For rectangles, the horizontal interval for rec1 is [rec1[0], rec1[2]] and for rec2 is [rec2[0], rec2[2]].
// The vertical interval for rec1 is [rec1[1], rec1[3]] and for rec2 is [rec2[1], rec2[3]].
// So, overlap occurs if:
// max(rec1[0], rec2[0]) < min(rec1[2], rec2[2])  AND
// max(rec1[1], rec2[1]) < min(rec1[3], rec2[3])
//
// Alternatively, we can check for non-overlap conditions. Two rectangles do NOT overlap if:
// 1. One rectangle is entirely to the left of the other.
//    (rec1[2] <= rec2[0]) OR (rec2[2] <= rec1[0])
// 2. One rectangle is entirely below the other.
//    (rec1[3] <= rec2[1]) OR (rec2[3] <= rec1[1])
// If none of these non-overlap conditions are met, then the rectangles must overlap.
//
// Time Complexity: O(1) - The solution involves a fixed number of comparisons.
// Space Complexity: O(1) - The solution uses a constant amount of extra space.

class Solution {
public:
    bool isRectangleOverlap(vector<int>& rec1, vector<int>& rec2) {
        // Extract coordinates for clarity
        int r1x1 = rec1[0];
        int r1y1 = rec1[1];
        int r1x2 = rec1[2];
        int r1y2 = rec1[3];

        int r2x1 = rec2[0];
        int r2y1 = rec2[1];
        int r2x2 = rec2[2];
        int r2y2 = rec2[3];

        // Check for non-overlap conditions
        // Condition 1: rec1 is to the left of rec2 OR rec2 is to the left of rec1
        // This means the right edge of one is to the left of or at the same position as the left edge of the other.
        bool noHorizontalOverlap = (r1x2 <= r2x1) || (r2x2 <= r1x1);

        // Condition 2: rec1 is below rec2 OR rec2 is below rec1
        // This means the top edge of one is below or at the same position as the bottom edge of the other.
        bool noVerticalOverlap = (r1y2 <= r2y1) || (r2y2 <= r1y1);

        // If either of the non-overlap conditions is true, the rectangles do not overlap.
        // Therefore, they overlap if and only if NEITHER of these non-overlap conditions is true.
        return !(noHorizontalOverlap || noVerticalOverlap);
    }
};
