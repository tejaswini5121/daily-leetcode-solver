```python
# Summary: Simulate robot collisions based on their positions, health, and directions.
#          Robots with lower health are eliminated, or both if health is equal.
#          Return the health of surviving robots in their original order.
# Link: https://leetcode.com/problems/robot-collisions/
#
# Approach:
# 1. Combine robot information: Create a list of tuples, where each tuple contains
#    (original_index, position, health, direction). This is crucial for returning results
#    in the original order.
# 2. Sort robots by position: Collisions only happen between robots moving towards each other.
#    Sorting by position allows us to process potential collisions efficiently.
# 3. Use a stack: A stack will store robots moving to the right ('R') that haven't collided yet.
#    When a robot moving left ('L') is encountered, it might collide with robots on the stack.
# 4. Collision simulation:
#    - If a robot moves right ('R'), push it onto the stack.
#    - If a robot moves left ('L'):
#      - While the stack is not empty and the robot on top of the stack is moving right ('R'):
#        - Get the health of the left-moving robot (`current_health`) and the right-moving
#          robot on top of the stack (`stack_top_health`).
#        - If `current_health == stack_top_health`: Both robots are destroyed. Pop from stack.
#        - If `current_health > stack_top_health`: The right-moving robot is destroyed.
#          Decrement the left-moving robot's health and pop from stack. Continue checking
#          for further collisions with the next robot on the stack.
#        - If `current_health < stack_top_health`: The left-moving robot is destroyed.
#          Decrement the right-moving robot's health on the stack by 1. Break the inner loop
#          (since this left-moving robot is now destroyed).
#      - If the stack becomes empty or the top robot is moving left, the current left-moving
#        robot has survived potential collisions with right-moving robots and needs to be
#        processed later (or added to a list of survivors if it survives all).
# 5. Collect survivors: After iterating through all sorted robots, any robots remaining on the
#    stack are survivors. Also, any left-moving robots that were not destroyed in step 4 need
#    to be accounted for. We can keep track of all surviving robots (including those that
#    never collided or those that survived collisions initiated by 'L' robots) in a separate
#    data structure. A dictionary mapping original index to remaining health is a good approach.
# 6. Final output: Construct the result array by iterating through the original robot indices
#    (0 to n-1) and appending the health of the survivors from the dictionary.
#
# Time Complexity: O(N log N) due to sorting. The stack operations are O(N) in total
#                  because each robot is pushed and popped at most once.
# Space Complexity: O(N) for storing robot information, the stack, and the result mapping.

def survivedRobotsHealth(positions: list[int], healths: list[int], directions: str) -> list[int]:
    n = len(positions)

    # 1. Combine robot information: (original_index, position, health, direction)
    # This is important for maintaining the original order in the output.
    robots = []
    for i in range(n):
        robots.append((i, positions[i], healths[i], directions[i]))

    # 2. Sort robots by position
    # Robots only collide if they are moving towards each other. Sorting by position
    # allows us to process potential collisions linearly.
    robots.sort(key=lambda x: x[1])

    # Stack to store robots moving to the right ('R') that are candidates for collision.
    # Each element in the stack will be a tuple: (original_index, health)
    stack = []

    # Dictionary to store the final health of surviving robots, keyed by their original index.
    survivors = {}

    # 3. Process robots and simulate collisions
    for original_index, pos, health, direction in robots:
        if direction == 'R':
            # If robot moves right, push it onto the stack.
            stack.append([original_index, health])
        else: # direction == 'L'
            # If robot moves left, it might collide with robots on the stack (moving right).
            current_health = health
            while stack:
                # Get the top robot from the stack (moving right).
                stack_top_original_index, stack_top_health = stack.pop()

                if current_health == stack_top_health:
                    # If healths are equal, both robots are destroyed.
                    # The current left-moving robot is also destroyed, so we break the loop.
                    current_health = 0 # Mark as destroyed
                    break
                elif current_health > stack_top_health:
                    # If current robot has more health, the stack top robot is destroyed.
                    # The current robot's health decreases by 1.
                    current_health -= 1
                    # The current robot continues moving left, so we check for further collisions.
                    # The stack is already popped, so we continue the loop.
                else: # current_health < stack_top_health
                    # If stack top robot has more health, the current robot is destroyed.
                    # The stack top robot's health decreases by 1.
                    stack_top_health -= 1
                    # Re-add the surviving right-moving robot to the stack with its updated health.
                    stack.append([stack_top_original_index, stack_top_health])
                    # The current left-moving robot is destroyed, so we break the inner loop.
                    current_health = 0 # Mark as destroyed
                    break

            # If the current left-moving robot survived all collisions with right-moving robots
            # (i.e., current_health > 0), record its final health.
            if current_health > 0:
                survivors[original_index] = current_health

    # 4. Add remaining robots from the stack to survivors
    # Any robots left on the stack are those moving right that never collided.
    for original_index, health in stack:
        survivors[original_index] = health

    # 5. Construct the final result array in the original order.
    result = []
    for i in range(n):
        if i in survivors:
            result.append(survivors[i])

    return result
```