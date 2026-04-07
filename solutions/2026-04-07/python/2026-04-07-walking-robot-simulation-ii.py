```python
# Problem: Walking Robot Simulation II
# Link: https://leetcode.com/problems/walking-robot-simulation-ii/
#
# Approach:
# The core idea is to simulate the robot's movement. Since the robot moves in a grid and turns when hitting boundaries,
# we can pre-calculate the path the robot would take by traversing the perimeter of the grid repeatedly.
# The perimeter of a width x height grid has a length of 2 * (width + height) - 4.
# We can represent the movement along the perimeter as a sequence of positions and directions.
#
# We define the directions and their corresponding changes in x and y coordinates:
# 0: East (dx=1, dy=0)
# 1: North (dx=0, dy=1)
# 2: West (dx=-1, dy=0)
# 3: South (dx=0, dy=-1)
#
# The robot starts at (0, 0) facing East (direction 0).
# The path can be visualized as moving along the edges:
# 1. From (0, 0) to (width-1, 0) (East)
# 2. From (width-1, 0) to (width-1, height-1) (North)
# 3. From (width-1, height-1) to (0, height-1) (West)
# 4. From (0, height-1) to (0, 1) (South - note: excluding (0,0) to avoid double counting)
#
# We can generate all the positions and directions the robot will visit in one full traversal of the perimeter.
# The total number of steps `num` can then be mapped to a specific point in this pre-calculated path.
# If `num` exceeds one full perimeter traversal, we can use the modulo operator to find the equivalent position
# within a single traversal cycle.
#
# To handle the initial state and the repeating nature of the movement, we can store the entire path
# of one full perimeter traversal. The `step(num)` method will then update the robot's current position
# by advancing `num` steps along this path. If `num` is very large, we can use modulo arithmetic
# to determine the final position.
#
# We will maintain the robot's current position (x, y) and current direction.
#
# The `step(num)` function will:
# 1. Determine the total distance covered if the robot were to move `num` steps in its current direction without hitting walls.
# 2. Use this to find the index in the pre-calculated path that corresponds to `num` steps from the current state.
# 3. Update the robot's `current_pos` and `current_dir` based on this index.
#
# We will pre-calculate the sequence of all possible unique positions and directions in a single traversal of the grid's perimeter.
# This sequence will be an infinite loop for the robot's movement.
#
# The perimeter path generation:
# - Start at (0, 0) facing East.
# - Move East until x = width - 1.
# - Turn North.
# - Move North until y = height - 1.
# - Turn West.
# - Move West until x = 0.
# - Turn South.
# - Move South until y = 1 (to avoid re-visiting (0,0) in the same direction).
# - Turn East.
#
# We can store this as a list of (x, y, direction_index) tuples.
# The total number of unique positions in one full perimeter traversal is (width - 1) + (height - 1) + (width - 1) + (height - 2) = 2 * width + 2 * height - 4.
#
# Time Complexity:
# - Initialization: O(width * height) or O(perimeter length) to pre-calculate the path. The perimeter length is O(width + height).
# - step(num): O(1) because we use modulo arithmetic on the total steps to find the final state within the pre-calculated path.
# - getPos(): O(1)
# - getDir(): O(1)
# Overall, with pre-calculation, `step` is O(1). If we didn't pre-calculate and simulated each step, it would be O(num).
#
# Space Complexity:
# - O(width + height) to store the pre-calculated path of one perimeter traversal.

class Robot:

    def __init__(self, width: int, height: int):
        # Store grid dimensions
        self.width = width
        self.height = height
        # Store current position (x, y)
        self.x = 0
        self.y = 0
        # Store current direction. 0: East, 1: North, 2: West, 3: South
        self.direction = 0
        # Directions mapping to (dx, dy) changes
        self.directions = [(1, 0), (0, 1), (-1, 0), (0, -1)] # East, North, West, South
        # Store the sequence of unique positions and directions in one full perimeter traversal
        # Each element will be (x, y, direction_index)
        self.path = []
        self.total_steps_in_path = 0 # Total steps covered by one full perimeter cycle
        self.simulate_perimeter()
        # Keep track of the current index in the pre-calculated path
        self.path_index = 0
        # Keep track of the total steps taken so far by the robot
        self.steps_taken = 0


    def simulate_perimeter(self):
        # Simulate one full traversal of the grid's perimeter and store the path.
        # Start at (0, 0) facing East.
        current_x, current_y = 0, 0
        current_dir_idx = 0 # 0: East

        # Add initial state
        self.path.append((current_x, current_y, current_dir_idx))
        self.total_steps_in_path += 1 # Count initial position as step 0

        # Move East
        while current_x < self.width - 1:
            current_x += 1
            self.path.append((current_x, current_y, current_dir_idx))
            self.total_steps_in_path += 1

        # Turn North
        current_dir_idx = 1
        # Move North
        while current_y < self.height - 1:
            current_y += 1
            self.path.append((current_x, current_y, current_dir_idx))
            self.total_steps_in_path += 1

        # Turn West
        current_dir_idx = 2
        # Move West
        while current_x > 0:
            current_x -= 1
            self.path.append((current_x, current_y, current_dir_idx))
            self.total_steps_in_path += 1

        # Turn South
        current_dir_idx = 3
        # Move South, stopping before reaching (0,0) again to complete one cycle
        # The robot at (0, height-1) turns South. It moves towards (0,0).
        # The path is (0, height-1), (0, height-2), ..., (0, 1). The next would be (0,0).
        # We stop at y=1 because y=0 is the starting point.
        while current_y > 1: # Stop at y=1, as y=0 is the start and will be visited again at the end of a full cycle
            current_y -= 1
            self.path.append((current_x, current_y, current_dir_idx))
            self.total_steps_in_path += 1

        # The length of the perimeter path is (width - 1) + (height - 1) + (width - 1) + (height - 2) = 2*width + 2*height - 4
        # This `total_steps_in_path` variable represents the number of distinct states (position+direction) in one full cycle.
        # For example, if width=2, height=2, perimeter=4. Path: (0,0,E), (1,0,E), (1,1,N), (0,1,W).
        # If total_steps_in_path is 4, then modulo 4 will give the correct index for subsequent steps.


    def step(self, num: int) -> None:
        # Advance the robot by `num` steps.
        # We use modulo arithmetic to find the final position within the pre-calculated path cycle.

        # Calculate the number of full perimeter cycles the robot will complete.
        # The total number of steps in one full cycle is `self.total_steps_in_path`.
        # `self.path_index` tracks our current position in the `self.path` list.
        # `self.steps_taken` is the total number of steps the robot has executed since the beginning.

        # Update total steps taken by the robot.
        self.steps_taken += num

        # The effective number of steps within one cycle is steps_taken % total_steps_in_path
        # However, the `self.path` list stores states. If we are at path_index `p` and take `num` steps,
        # the new index will be `(p + num) % len(self.path)`.
        # Note: len(self.path) might be slightly different than total_steps_in_path if start/end states are handled differently.
        # For example, the initial state (0,0,E) is at path_index 0.
        # After 1 step, it's at path_index 1.
        # So, we want to find the index `(self.path_index + num) % len(self.path)`.

        # Handle the case where the robot is facing South and reaches y=0.
        # The `simulate_perimeter` stops at y=1 when moving South.
        # The path ends with (0, 1, South). The next step would be to turn East at (0,0).
        # The `self.path` has `len(self.path)` states.
        # The total steps it takes to traverse the path once and return to (0,0) facing East is `len(self.path)`.
        # So we use modulo `len(self.path)` for the index.
        new_path_index = (self.path_index + num) % len(self.path)

        # Update the robot's state based on the new path index.
        self.path_index = new_path_index
        self.x, self.y, self.direction = self.path[self.path_index]


    def getPos(self) -> list[int]:
        # Return the current position [x, y].
        return [self.x, self.y]

    def getDir(self) -> str:
        # Return the current direction string.
        if self.direction == 0:
            return "East"
        elif self.direction == 1:
            return "North"
        elif self.direction == 2:
            return "West"
        elif self.direction == 3:
            return "South"
        return "" # Should not happen

```