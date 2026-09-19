// Summary: Checks if a circle and an axis-aligned rectangle overlap.
// Link: https://leetcode.com/problems/circle-and-rectangle-overlapping/
// Approach: The core idea is to find the point on the rectangle that is closest to the circle's center.
// If the distance between this closest point and the circle's center is less than or equal to the radius,
// then there is an overlap.
// To find the closest point on the rectangle to the circle's center (xCenter, yCenter):
// 1. For the x-coordinate:
//    - If xCenter is less than x1, the closest x on the rectangle is x1.
//    - If xCenter is greater than x2, the closest x on the rectangle is x2.
//    - Otherwise (xCenter is between x1 and x2), the closest x on the rectangle is xCenter itself.
// 2. For the y-coordinate:
//    - If yCenter is less than y1, the closest y on the rectangle is y1.
//    - If yCenter is greater than y2, the closest y on the rectangle is y2.
//    - Otherwise (yCenter is between y1 and y2), the closest y on the rectangle is yCenter itself.
// Once the closest point (closestX, closestY) is found, calculate the squared distance between
// (xCenter, yCenter) and (closestX, closestY): `distX*distX + distY*distY`.
// Compare this squared distance with the squared radius (`radius*radius`). If it's less than or equal to, they overlap.
// Using squared distances avoids the costly `Math.sqrt()` operation.
// Time Complexity: O(1) - The calculations involve a fixed number of operations regardless of input size.
// Space Complexity: O(1) - The algorithm uses a constant amount of extra space for variables.

/**
 * @param {number} radius
 * @param {number} xCenter
 * @param {number} yCenter
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @return {boolean}
 */
var checkOverlap = function(radius, xCenter, yCenter, x1, y1, x2, y2) {
    // Find the closest x-coordinate on the rectangle to the circle's center.
    // If xCenter is to the left of the rectangle, closestX is x1.
    // If xCenter is to the right of the rectangle, closestX is x2.
    // Otherwise, xCenter is within the rectangle's x-bounds, so closestX is xCenter.
    const closestX = Math.max(x1, Math.min(xCenter, x2));

    // Find the closest y-coordinate on the rectangle to the circle's center.
    // If yCenter is below the rectangle, closestY is y1.
    // If yCenter is above the rectangle, closestY is y2.
    // Otherwise, yCenter is within the rectangle's y-bounds, so closestY is yCenter.
    const closestY = Math.max(y1, Math.min(yCenter, y2));

    // Calculate the distance between the circle's center and the closest point on the rectangle.
    // We are using squared distances to avoid the `Math.sqrt()` operation for efficiency.
    const distX = xCenter - closestX;
    const distY = yCenter - closestY;

    // Calculate the squared distance.
    const distanceSquared = (distX * distX) + (distY * distY);

    // The circle and rectangle overlap if the squared distance between the circle's center
    // and the closest point on the rectangle is less than or equal to the squared radius.
    return distanceSquared <= (radius * radius);
};
