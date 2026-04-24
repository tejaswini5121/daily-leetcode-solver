// LeetCode Problem: Furthest Point From Origin
// Problem Summary: Find the maximum absolute displacement from the origin given a string of moves 'L', 'R', and '_', where '_' can be chosen as either 'L' or 'R'.
// Link: https://leetcode.com/problems/furthest-point-from-origin/
// Approach:
// The goal is to maximize the absolute distance from the origin.
// 'L' moves always decrease the position (move left).
// 'R' moves always increase the position (move right).
// '_' moves can be chosen as either 'L' or 'R'. To maximize the distance, we should use '_' strategically.
// To get to the furthest positive point, we'd want to maximize 'R' moves.
// To get to the furthest negative point, we'd want to maximize 'L' moves.
//
// Let's count the number of 'L' moves, 'R' moves, and '_' moves.
// Let `countL` be the number of 'L' moves.
// Let `countR` be the number of 'R' moves.
// Let `countUnderscore` be the number of '_' moves.
//
// To reach the furthest positive point, we should treat all '_' as 'R'.
// The total 'R' moves would be `countR + countUnderscore`.
// The final position would be `(countR + countUnderscore) - countL`.
//
// To reach the furthest negative point, we should treat all '_' as 'L'.
// The total 'L' moves would be `countL + countUnderscore`.
// The final position would be `countR - (countL + countUnderscore)`.
//
// The furthest distance from the origin is the maximum of the absolute values of these two potential final positions.
//
// Alternatively, we can think of the net displacement.
// Initial position is 0.
// For each 'L', we move -1.
// For each 'R', we move +1.
// For each '_', we can choose to move -1 or +1.
//
// To maximize the positive displacement:
// Assign all '_' to '+1' (effectively 'R').
// Net displacement = (number of 'R' + number of '_') - (number of 'L')
//
// To maximize the negative displacement:
// Assign all '_' to '-1' (effectively 'L').
// Net displacement = (number of 'R') - (number of 'L' + number of '_')
//
// The furthest point will be the maximum of the absolute values of these two scenarios.
//
// A simpler way to think about this is to calculate the fixed displacement and the flexible displacement.
// Fixed displacement comes from 'L' and 'R'. Let's say `right_moves = countR` and `left_moves = countL`.
// The net fixed displacement is `right_moves - left_moves`.
//
// The flexible moves are the underscores. We have `countUnderscore` of them.
// To maximize the positive displacement, we add `countUnderscore` to the right.
// Furthest positive position = `(right_moves - left_moves) + countUnderscore`.
//
// To maximize the negative displacement, we subtract `countUnderscore` from the left.
// Furthest negative position = `(right_moves - left_moves) - countUnderscore`.
//
// The absolute furthest distance is `max(abs((right_moves - left_moves) + countUnderscore), abs((right_moves - left_moves) - countUnderscore))`.
//
// Notice that `abs(a + b)` and `abs(a - b)` where `b >= 0` will always have the larger absolute value when `b` is added to the term with the larger magnitude.
//
// Consider the difference `countR - countL`.
// If `countR >= countL`, then `countR - countL >= 0`.
// The two values are `(countR - countL) + countUnderscore` and `(countR - countL) - countUnderscore`.
// The furthest point will be `(countR - countL) + countUnderscore`.
//
// If `countL > countR`, then `countR - countL < 0`.
// The two values are `(countR - countL) + countUnderscore` and `(countR - countL) - countUnderscore`.
// Let `diff = countR - countL`.
// The values are `diff + countUnderscore` and `diff - countUnderscore`.
// Since `diff` is negative, `diff - countUnderscore` will be more negative than `diff + countUnderscore`.
// The absolute value of `diff - countUnderscore` will be greater.
// The furthest point will be `abs((countR - countL) - countUnderscore)`.
//
// In both cases, the furthest distance is achieved by taking the absolute difference between the count of 'R' and 'L' moves and adding all the '_' moves to the direction that maximizes the absolute displacement.
//
// Let's re-evaluate:
// `countL`: number of 'L'
// `countR`: number of 'R'
// `count_ = ` number of '_'
//
// Total rightward potential = `countR + count_`
// Total leftward potential = `countL + count_`
//
// The maximum distance we can go right is `countR + count_`.
// The maximum distance we can go left is `countL + count_`.
//
// The problem states "Return the distance from the origin of the furthest point you can get to after n moves." This means we need to find a *single* sequence of moves.
//
// Let's track the net position.
// `pos = 0`
// For each character in `moves`:
//   If char is 'L': `pos -= 1`
//   If char is 'R': `pos += 1`
//   If char is '_': we can choose.
//
// To maximize the final absolute position:
// We have `countUnderscore` flexible moves.
// We have `countR` guaranteed right moves and `countL` guaranteed left moves.
//
// If we decide to go as far right as possible:
// We use all `countR` moves to the right.
// We use all `countUnderscore` moves to the right.
// We use all `countL` moves to the left.
// Final position = `countR + countUnderscore - countL`.
//
// If we decide to go as far left as possible:
// We use all `countL` moves to the left.
// We use all `countUnderscore` moves to the left.
// We use all `countR` moves to the right.
// Final position = `countR - (countL + countUnderscore)`.
//
// The furthest point from the origin is `max(abs(countR + countUnderscore - countL), abs(countR - countL - countUnderscore))`.
//
// Example 1: moves = "L_RL__R"
// countL = 2
// countR = 2
// count_ = 3
//
// Furthest right: 2 (R) + 3 (_) - 2 (L) = 3
// Furthest left: 2 (R) - (2 (L) + 3 (_)) = 2 - 5 = -3
// Max distance = max(abs(3), abs(-3)) = 3. Correct.
//
// Example 2: moves = "_R__LL_"
// countL = 2
// countR = 1
// count_ = 4
//
// Furthest right: 1 (R) + 4 (_) - 2 (L) = 5 - 2 = 3
// Furthest left: 1 (R) - (2 (L) + 4 (_)) = 1 - 6 = -5
// Max distance = max(abs(3), abs(-5)) = 5. Correct.
//
// Example 3: moves = "_______"
// countL = 0
// countR = 0
// count_ = 7
//
// Furthest right: 0 (R) + 7 (_) - 0 (L) = 7
// Furthest left: 0 (R) - (0 (L) + 7 (_)) = -7
// Max distance = max(abs(7), abs(-7)) = 7. Correct.
//
// This logic seems sound. The implementation will involve iterating through the string once to count the characters.
//
// Time Complexity: O(n), where n is the length of the `moves` string, because we iterate through the string once to count the characters.
// Space Complexity: O(1), because we only use a few variables to store the counts.

/**
 * @param {string} moves
 * @return {number}
 */
const furthestDistance = function(moves) {
    // Initialize counts for 'L', 'R', and '_' characters.
    let countL = 0;
    let countR = 0;
    let countUnderscore = 0;

    // Iterate through the input string 'moves'.
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        // Increment the corresponding counter based on the character.
        if (move === 'L') {
            countL++;
        } else if (move === 'R') {
            countR++;
        } else { // move === '_'
            countUnderscore++;
        }
    }

    // To find the furthest point to the right:
    // We use all 'R' moves and treat all '_' as 'R' moves.
    // Then we subtract all 'L' moves.
    // This gives the maximum possible positive displacement.
    const furthestRight = countR + countUnderscore - countL;

    // To find the furthest point to the left:
    // We use all 'L' moves and treat all '_' as 'L' moves.
    // Then we subtract all 'R' moves.
    // This gives the maximum possible negative displacement.
    const furthestLeft = countR - (countL + countUnderscore);

    // The furthest point from the origin is the maximum of the absolute values
    // of the furthest right and furthest left positions.
    return Math.max(Math.abs(furthestRight), Math.abs(furthestLeft));
};
```