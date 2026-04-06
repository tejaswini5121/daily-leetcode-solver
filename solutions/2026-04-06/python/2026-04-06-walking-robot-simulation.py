```python
# Problem Summary:
# Simulate a robot's movement on an infinite grid with obstacles and return the maximum squared Euclidean distance from the origin.
# Link: https://leetcode.com/problems/walking-robot-simulation/
#
# Approach:
# We can simulate the robot's movement step by step. We'll maintain the robot's current position (x, y) and its current direction.
# The directions can be represented as integers: 0 for North (+y), 1 for East (+x), 2 for South (-y), and 3 for West (-x).
# When the robot receives a 'turn left' command (-2), we update the direction by (current_direction - 1) % 4.
# When the robot receives a 'turn right' command (-1), we update the direction by (current_direction + 1) % 4.
# When the robot receives a 'move forward' command (k), we move k steps one by one. For each step, we calculate the next potential position.
# Before moving to the next position, we check if it contains an obstacle. If it does, the robot stays at its current position and the step is effectively skipped.
# If there's no obstacle, we update the robot's current position and calculate the squared Euclidean distance from the origin. We keep track of the maximum squared distance encountered.
# To efficiently check for obstacles, we can store them in a set for O(1) average time lookups.
#
# Time Complexity:
# O(N * K_max + M), where N is the number of commands, K_max is the maximum move command value (9), and M is the number of obstacles.
# In the worst case, each move command of value k might require checking k positions.
# If we consider the total number of unit steps across all commands, it's bounded.
# The total number of steps a robot takes is the sum of all positive commands.
# Let S be the sum of all positive commands. The time complexity is O(S + M) for obstacle lookups. Since the maximum value of a command is 9 and the number of commands is 10^4, S can be up to 9 * 10^4.
# Thus, the time complexity is effectively O(sum(commands) + |obstacles|).
#
# Space Complexity:
# O(M), where M is the number of obstacles, to store the obstacles in a set.

class Solution:
    def robotSim(self, commands: list[int], obstacles: list[list[int]]) -> int:
        # Store obstacles in a set for O(1) average time lookup.
        obstacle_set = set()
        for obs_x, obs_y in obstacles:
            obstacle_set.add((obs_x, obs_y))

        # Robot's current position (x, y)
        x, y = 0, 0
        # Robot's current direction.
        # 0: North (+y)
        # 1: East (+x)
        # 2: South (-y)
        # 3: West (-x)
        direction = 0

        # Maximum squared Euclidean distance reached so far.
        max_sq_dist = 0

        # Define direction vectors for (dx, dy) corresponding to each direction.
        # For example, if direction is 0 (North), dx=0, dy=1.
        dx = [0, 1, 0, -1]
        dy = [1, 0, -1, 0]

        # Iterate through each command.
        for command in commands:
            if command == -1:  # Turn right
                direction = (direction + 1) % 4
            elif command == -2:  # Turn left
                direction = (direction - 1) % 4
            else:  # Move forward k units
                k = command
                # Move one step at a time to check for obstacles at each unit.
                for _ in range(k):
                    # Calculate the next potential position.
                    next_x = x + dx[direction]
                    next_y = y + dy[direction]

                    # Check if the next position is an obstacle.
                    if (next_x, next_y) in obstacle_set:
                        # If it's an obstacle, the robot stays at its current position.
                        # No need to update x, y, just break the inner loop and move to the next command.
                        break
                    else:
                        # If no obstacle, update the robot's position.
                        x = next_x
                        y = next_y
                        # Update the maximum squared distance.
                        max_sq_dist = max(max_sq_dist, x * x + y * y)

        # Return the maximum squared Euclidean distance.
        return max_sq_dist
```