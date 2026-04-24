```python
# Problem: Furthest Point From Origin
# Link: https://leetcode.com/problems/furthest-point-from-origin/
#
# Approach:
# To maximize the distance from the origin, we should try to move as far in one direction as possible.
# For 'L' moves, we always move left. For 'R' moves, we always move right.
# For '_' moves, we have a choice: we can either move left or right. To maximize the distance, we should
# use the '_' moves to further extend our position in the direction that is already more dominant.
#
# We can count the number of 'L's, 'R's, and '_'s.
# Let num_L be the count of 'L's, num_R be the count of 'R's, and num_underscore be the count of '_'s.
#
# The furthest point to the left we can reach is when all 'L's and all '_'s are used as left moves.
# This position would be -(num_L + num_underscore).
#
# The furthest point to the right we can reach is when all 'R's and all '_'s are used as right moves.
# This position would be +(num_R + num_underscore).
#
# The absolute distance from the origin for the furthest left point is |-(num_L + num_underscore)| = num_L + num_underscore.
# The absolute distance from the origin for the furthest right point is |+(num_R + num_underscore)| = num_R + num_underscore.
#
# The furthest point from the origin will be the maximum of these two absolute distances.
# Therefore, the furthest distance is max(num_L + num_underscore, num_R + num_underscore).
#
# This can be simplified:
# If num_L > num_R, then num_L + num_underscore is likely larger. The furthest is to the left.
# If num_R > num_L, then num_R + num_underscore is likely larger. The furthest is to the right.
# If num_L == num_R, then both directions have the same potential for distance using '_' moves.
#
# A more direct way to think about it:
# The net displacement from 'L' and 'R' moves is (num_R - num_L).
# We have 'num_underscore' moves that can be arbitrarily assigned to either left or right.
# To maximize the distance, we should assign all '_' moves to the direction that is already winning.
#
# If num_R > num_L: We have a net rightward displacement of (num_R - num_L). We can add all '_' moves to this.
# The total displacement to the right becomes (num_R + num_underscore) - num_L.
#
# If num_L > num_R: We have a net leftward displacement of (num_L - num_R). We can add all '_' moves to this.
# The total displacement to the left becomes (num_L + num_underscore) - num_R.
#
# In both cases, the absolute furthest distance is the sum of the count of the majority type ('L' or 'R') and the count of underscores.
#
# Alternatively, consider the difference `num_L - num_R`.
# If `num_L > num_R`, the furthest we can go left is `(num_L - num_R) + num_underscore`.
# If `num_R > num_L`, the furthest we can go right is `(num_R - num_L) + num_underscore`.
#
# The problem asks for the furthest *distance*, which is the absolute value.
# So, the furthest distance is `max(abs(num_L - num_R) + num_underscore, 0)`.
# However, `abs(num_L - num_R) + num_underscore` is always non-negative given `num_underscore >= 0`.
# So, the answer is simply `abs(num_L - num_R) + num_underscore`.
#
# Time Complexity: O(n), where n is the length of the moves string. We iterate through the string once to count characters.
# Space Complexity: O(1), as we only use a few variables to store counts.

class Solution:
    def furthestDistance(self, moves: str) -> int:
        # Initialize counts for left, right, and underscore moves
        count_l = 0
        count_r = 0
        count_underscore = 0

        # Iterate through the moves string to count each character
        for move in moves:
            if move == 'L':
                count_l += 1
            elif move == 'R':
                count_r += 1
            else:  # move == '_'
                count_underscore += 1

        # Calculate the absolute difference between left and right moves.
        # This represents the net displacement if underscores are not used.
        net_displacement = abs(count_l - count_r)

        # To maximize the distance, we should use all underscore moves
        # to push us further in the direction that is already leading.
        # So, we add the count of underscores to the net displacement.
        furthest_distance = net_displacement + count_underscore

        # Return the calculated furthest distance from the origin.
        return furthest_distance

```