```java
class Solution {
    /**
     * Checks if two axis-aligned rectangles overlap.
     *
     * Approach:
     * Two rectangles overlap if and only if they do NOT NOT overlap.
     * Two rectangles do NOT overlap if one is entirely to the left of the other,
     * or if one is entirely below the other.
     *
     * Rectangle 1: [x1, y1, x2, y2]
     * Rectangle 2: [x3, y3, x4, y4]
     *
     * They do NOT overlap if:
     * 1. rec1 is to the left of rec2: rec1[2] <= rec2[0] (rec1's right edge is at or left of rec2's left edge)
     * 2. rec1 is to the right of rec2: rec1[0] >= rec2[2] (rec1's left edge is at or right of rec2's right edge)
     * 3. rec1 is below rec2: rec1[3] <= rec2[1] (rec1's top edge is at or below rec2's bottom edge)
     * 4. rec1 is above rec2: rec1[1] >= rec2[3] (rec1's bottom edge is at or above rec2's top edge)
     *
     * If any of these conditions are true, the rectangles do not overlap.
     * Therefore, they overlap if NONE of these conditions are true.
     *
     * Time Complexity: O(1) - The check involves a constant number of comparisons.
     * Space Complexity: O(1) - No extra space is used beyond a few variables.
     */
    public boolean isRectangleOverlap(int[] rec1, int[] rec2) {
        // Check if rec1 is to the left of rec2 OR rec1 is to the right of rec2
        // OR rec1 is below rec2 OR rec1 is above rec2.
        // If any of these are true, they do not overlap.
        if (rec1[2] <= rec2[0] || // rec1 is to the left of rec2
            rec1[0] >= rec2[2] || // rec1 is to the right of rec2
            rec1[3] <= rec2[1] || // rec1 is below rec2
            rec1[1] >= rec2[3]) { // rec1 is above rec2
            return false; // No overlap
        }
        // If none of the non-overlapping conditions are met, then they must overlap.
        return true;
    }
}
```