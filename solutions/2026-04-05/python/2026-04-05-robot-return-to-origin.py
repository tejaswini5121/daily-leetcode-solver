```python
# Problem: Robot Return to Origin
# Link: https://leetcode.com/problems/robot-return-to-origin/
#
# Approach:
# We can simulate the robot's movement by keeping track of its current x and y coordinates.
# Initialize x and y to 0.
# Iterate through the `moves` string.
# For each move:
#   - If the move is 'U', increment y.
#   - If the move is 'D', decrement y.
#   - If the move is 'R', increment x.
#   - If the move is 'L', decrement x.
# After processing all moves, check if both x and y are 0.
# If both are 0, the robot returned to the origin, so return True. Otherwise, return False.
#
# Alternative Approach (more efficient for this specific problem):
# Instead of simulating step-by-step, we can count the occurrences of each move.
# The robot returns to the origin if and only if the number of 'U' moves equals the number of 'D' moves,
# AND the number of 'L' moves equals the number of 'R' moves.
# This is because 'U' and 'D' cancel each other out vertically, and 'L' and 'R' cancel each other out horizontally.
#
# Time Complexity: O(N), where N is the length of the `moves` string.
# We iterate through the string once to count the moves.
# Space Complexity: O(1), as we only use a few variables to store counts, regardless of input size.

class Solution:
    def judgeCircle(self, moves: str) -> bool:
        # Initialize counts for each direction.
        # We can use variables or a dictionary/Counter.
        # Using variables is slightly more efficient for a fixed set of characters.
        up_count = 0
        down_count = 0
        left_count = 0
        right_count = 0

        # Iterate through each move in the input string.
        for move in moves:
            if move == 'U':
                up_count += 1
            elif move == 'D':
                down_count += 1
            elif move == 'L':
                left_count += 1
            elif move == 'R':
                right_count += 1

        # Check if the net movement in the vertical direction is zero.
        # This means the number of 'U' moves must equal the number of 'D' moves.
        vertical_return = (up_count == down_count)

        # Check if the net movement in the horizontal direction is zero.
        # This means the number of 'L' moves must equal the number of 'R' moves.
        horizontal_return = (left_count == right_count)

        # The robot returns to the origin if and only if both vertical and horizontal
        # movements result in a return to the origin.
        return vertical_return and horizontal_return

# Example Usage:
# solver = Solution()
# print(solver.judgeCircle("UD"))  # Output: True
# print(solver.judgeCircle("LL"))  # Output: False
# print(solver.judgeCircle("RRDD")) # Output: False
# print(solver.judgeCircle("LDRRLRUULR")) # Output: False
```