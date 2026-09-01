# Problem: Minimum Moves to Clean the Classroom
# Summary: Find the minimum moves to collect all litter ('L') in a grid, starting from 'S', with limited energy that can be replenished at 'R' cells.
# Link: https://leetcode.com/problems/minimum-moves-to-clean-the-classroom/
# Approach: This problem can be modeled as a shortest path problem on a state graph. Each state is defined by (row, col, current_energy, collected_litter_mask). Since we need to find the minimum number of moves, Breadth-First Search (BFS) is appropriate.
#
# The state for BFS will be (row, col, current_energy, collected_litter_mask).
# - `row`, `col`: Current position in the grid.
# - `current_energy`: Remaining energy. This can range from 0 to `initial_energy`.
# - `collected_litter_mask`: A bitmask representing which litter items have been collected. Since there are at most 10 'L' cells, a 10-bit integer is sufficient (2^10 = 1024 states).
#
# We need to pre-process the grid to find the coordinates of all 'L' cells and assign them an index (0 to N-1) to build the bitmask.
#
# BFS Steps:
# 1. Initialize a queue with the starting state: (start_row, start_col, initial_energy, 0, 0_moves).
# 2. Use a `visited` set to store (row, col, current_energy, collected_litter_mask) to avoid redundant computations and cycles.
# 3. When exploring neighbors:
#    a. A move costs 1 energy. If energy becomes 0 and the cell is not 'R', it's an invalid move.
#    b. If the cell is 'R', reset energy to `initial_energy`.
#    c. If the cell contains 'L', update the `collected_litter_mask`.
#    d. If the new state (neighbor_row, neighbor_col, new_energy, new_mask) has not been visited, add it to the queue and mark as visited.
# 4. The BFS terminates when a state is reached where `collected_litter_mask` indicates all litter items have been collected. The number of moves at that point is the answer.
# 5. If the queue becomes empty and not all litter items are collected, it's impossible, return -1.
#
# Time Complexity:
# Let M be the number of rows, N be the number of columns.
# Let E be the initial maximum energy.
# Let L be the number of litter cells (at most 10).
#
# The number of possible states is `M * N * (E + 1) * 2^L`.
# - `M * N`: For grid positions.
# - `E + 1`: For energy levels (0 to E).
# - `2^L`: For the litter collection mask.
#
# Each state can have up to 4 neighbors. Processing each state involves constant time operations.
# So, the time complexity is approximately O(M * N * E * 2^L).
# Given M, N <= 20, E <= 50, L <= 10:
# 20 * 20 * 50 * 2^10 = 400 * 50 * 1024 = 20000 * 1024 = 20,480,000.
# This should be acceptable within typical time limits (usually ~10^8 operations).
#
# Space Complexity:
# The `visited` set and the BFS queue can store up to O(M * N * E * 2^L) states.
# Each state stores (row, col, energy, mask, moves).
# So, the space complexity is O(M * N * E * 2^L).
# Using the same numbers, 20,480,000 states, each state a tuple, will consume significant memory but likely within limits (e.g., 20M tuples of 4 integers).

import collections

class Solution:
    def minimumMoves(self, classroom: list[str], energy: int) -> int:
        m, n = len(classroom), len(classroom[0])

        # Find starting position 'S' and all 'L' positions
        start_pos = None
        litter_coords = []
        for r in range(m):
            for c in range(n):
                if classroom[r][c] == 'S':
                    start_pos = (r, c)
                elif classroom[r][c] == 'L':
                    litter_coords.append((r, c))
        
        # Map litter coordinates to an index for the bitmask
        litter_map = {coord: i for i, coord in enumerate(litter_coords)}
        total_litter = len(litter_coords)
        
        # Target mask when all litter is collected
        target_mask = (1 << total_litter) - 1

        # BFS Queue: stores (row, col, current_energy, collected_litter_mask, moves)
        # Using a deque for efficient popleft
        queue = collections.deque()

        # Visited set: stores (row, col, current_energy, collected_litter_mask)
        # We don't store moves here because BFS inherently finds the shortest path,
        # so if we visit a state with more moves, it's not optimal.
        visited = set()

        # Add initial state to queue
        # (start_row, start_col, initial_energy, 0_collected_mask, 0_moves)
        start_r, start_c = start_pos
        queue.append((start_r, start_c, energy, 0, 0))
        visited.add((start_r, start_c, energy, 0))

        # Directions for movement: up, down, left, right
        dr = [-1, 1, 0, 0]
        dc = [0, 0, -1, 1]

        while queue:
            r, c, current_energy, current_mask, moves = queue.popleft()

            # If all litter collected, return moves
            if current_mask == target_mask:
                return moves

            # Explore all 4 adjacent cells
            for i in range(4):
                nr, nc = r + dr[i], c + dc[i]

                # Check bounds
                if not (0 <= nr < m and 0 <= nc < n):
                    continue

                # Obstacle 'X' cannot be passed
                if classroom[nr][nc] == 'X':
                    continue

                # Calculate new energy after moving
                new_energy = current_energy - 1

                # If energy drops to 0 or below, check if we are on 'R'
                # If new_energy is negative, it implies we moved without sufficient energy.
                # However, the problem states "If the energy reaches 0, the student can only continue
                # if they are on a reset area 'R'". This implies if current_energy is 0 and we
                # move to a non-'R' cell, it's invalid.
                # If current_energy is > 0 and we move to a cell, new_energy becomes current_energy - 1.
                # If current_energy is 1, new_energy becomes 0. If this cell is not 'R', we can't move from it.
                # This logic is applied at the point of making the move.
                # Let's simplify: moving costs 1 energy. If current_energy is 0, we can't move unless
                # we are standing on 'R' (which resets energy *before* moving).
                # The interpretation should be: if current_energy - 1 < 0 and the current cell is not 'R',
                # then we cannot move.
                # A better way to handle energy:
                # 1. Moving always costs 1 energy.
                # 2. If new_energy < 0, this move is impossible.
                # 3. If the destination cell classroom[nr][nc] is 'R', then new_energy becomes `energy` (max capacity).
                #
                # Re-evaluating the energy rule: "If the energy reaches 0, the student can only continue if they are on a reset area 'R', which resets the energy to its maximum capacity energy."
                # This implies:
                # - If current_energy > 0: Student can move. New energy will be current_energy - 1.
                # - If current_energy == 0: Student *cannot* move to any cell unless the *current cell* (r, c) is 'R'.
                #   If (r, c) is 'R', energy gets reset to `energy` *before* the move, and then a move costs 1.
                #   So, from (r, c) being 'R' with 0 energy, student can move with `energy - 1`.
                
                # Case 1: Student has energy > 0.
                if current_energy > 0:
                    next_energy_after_move = current_energy - 1
                    next_mask = current_mask
                    
                    # If destination is 'L', collect it
                    if (nr, nc) in litter_map:
                        litter_idx = litter_map[(nr, nc)]
                        next_mask |= (1 << litter_idx)
                    
                    # If destination is 'R', reset energy
                    if classroom[nr][nc] == 'R':
                        next_energy_after_move = energy # Reset to full capacity

                    # Check if this new state has been visited
                    if (nr, nc, next_energy_after_move, next_mask) not in visited:
                        visited.add((nr, nc, next_energy_after_move, next_mask))
                        queue.append((nr, nc, next_energy_after_move, next_mask, moves + 1))
                
                # Case 2: Student has 0 energy.
                # They can only move if current position (r, c) is an 'R' cell.
                elif current_energy == 0: # current_energy is 0
                    if classroom[r][c] == 'R':
                        # Energy is reset to max BEFORE moving
                        energy_after_reset_and_move = energy - 1
                        
                        # This implies we can only move if `energy - 1 >= 0`, which is true since energy >= 1.
                        # However, if `energy` itself is 0, this rule breaks. Constraints state `energy >= 1`.
                        
                        next_mask = current_mask
                        # If destination is 'L', collect it
                        if (nr, nc) in litter_map:
                            litter_idx = litter_map[(nr, nc)]
                            next_mask |= (1 << litter_idx)
                        
                        # If destination is 'R', reset energy. This is essentially double reset,
                        # first at (r,c), then at (nr,nc). The rule is "restores the student's energy to full capacity"
                        # when *on* 'R'. So if we move to 'R', energy becomes full.
                        # The `energy_after_reset_and_move` is energy - 1. If (nr,nc) is 'R', it becomes `energy`.
                        if classroom[nr][nc] == 'R':
                            next_energy_after_move_final = energy
                        else:
                            next_energy_after_move_final = energy_after_reset_and_move

                        if (nr, nc, next_energy_after_move_final, next_mask) not in visited:
                            visited.add((nr, nc, next_energy_after_move_final, next_mask))
                            queue.append((nr, nc, next_energy_after_move_final, next_mask, moves + 1))
                    # If current_energy is 0 and current cell is not 'R', student cannot move.
                    # This branch does nothing, which is correct.

        # If queue becomes empty and target_mask was not reached
        return -1

# Test cases (example usage):
# sol = Solution()
# print(sol.minimumMoves(classroom = ["S.", "XL"], energy = 2)) # Expected: 2
# print(sol.minimumMoves(classroom = ["LS", "RL"], energy = 4)) # Expected: 3
# print(sol.minimumMoves(classroom = ["L.S", "RXL"], energy = 3)) # Expected: -1