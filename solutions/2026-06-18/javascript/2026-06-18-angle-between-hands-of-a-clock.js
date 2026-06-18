// Problem: Angle Between Hands of a Clock
// Link: https://leetcode.com/problems/angle-between-hands-of-a-clock/
//
// Approach:
// The core idea is to calculate the position of both the hour and minute hands
// in degrees relative to the 12 o'clock position.
//
// Minute hand:
// A clock has 360 degrees. The minute hand completes a full circle in 60 minutes.
// Therefore, each minute corresponds to 360 / 60 = 6 degrees.
// The angle of the minute hand is `minutes * 6`.
//
// Hour hand:
// The hour hand moves 360 degrees in 12 hours.
// So, each hour corresponds to 360 / 12 = 30 degrees.
// However, the hour hand also moves as the minutes change. In 60 minutes, the hour hand
// moves from one hour mark to the next (30 degrees). This means for each minute,
// the hour hand moves (30 / 60) = 0.5 degrees.
// So, the angle of the hour hand is `(hour % 12 + minutes / 60) * 30`.
// We use `hour % 12` to handle the 12 o'clock case correctly (12 should be treated as 0 for calculation, but then add 30 degrees for the 12 o'clock position if it's exactly 12). The `hour % 12` handles this naturally if we consider 12 as 0 for the calculation of its position relative to 0, then add the offset. A simpler way is to just use `hour % 12`. If hour is 12, `12 % 12` is 0, then `0 + minutes/60` gives the fractional part. Then `(0 + minutes/60) * 30` correctly calculates the offset.
//
// The angle between the hands is the absolute difference between their angles.
// We need to return the smaller angle, so we take `min(abs_diff, 360 - abs_diff)`.
//
// Time Complexity: O(1) - The calculations are all constant time operations.
// Space Complexity: O(1) - We are only using a few variables to store intermediate results.
//
var angleClock = function(hour, minutes) {
    // Calculate the angle of the minute hand.
    // Each minute mark represents 360 / 60 = 6 degrees.
    const minuteAngle = minutes * 6;

    // Calculate the angle of the hour hand.
    // Each hour mark represents 360 / 12 = 30 degrees.
    // The hour hand also moves with the minutes. For every minute, it moves 30 / 60 = 0.5 degrees.
    // We use `hour % 12` to handle the 12 o'clock case. 12 should be treated as 0 for
    // calculating its position relative to the 12.
    const hourAngle = (hour % 12 + minutes / 60) * 30;

    // Calculate the absolute difference between the two angles.
    let diff = Math.abs(hourAngle - minuteAngle);

    // Return the smaller angle.
    // The angle can be `diff` or `360 - diff`. We want the smaller one.
    return Math.min(diff, 360 - diff);
};
