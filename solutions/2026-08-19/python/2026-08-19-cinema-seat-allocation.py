```python
# Problem: Cinema Seat Allocation
# Link: https://leetcode.com/problems/cinema-seat-allocation/
#
# Approach:
# The problem asks to find the maximum number of 4-person groups that can be seated in a cinema.
# Each row has 10 seats, and groups can occupy specific 4-seat blocks.
# The key observation is that the seat allocation within a row is independent of other rows,
# except for the fact that 'n' can be very large, making it impractical to iterate through all rows.
# However, the `reservedSeats` are limited, meaning only a finite number of rows will have reservations.
# Therefore, we only need to consider rows that have at least one reserved seat.
# For rows without any reserved seats, each such row can accommodate 2 groups (seats 2-5 and 7-10, or seats 4-7).
# We can calculate the number of completely empty rows by subtracting the number of unique rows with reservations from 'n'.
#
# For each row with reservations, we need to determine how many groups can be seated.
# The possible 4-seat blocks are:
# 1. Seats 2, 3, 4, 5 (left block)
# 2. Seats 4, 5, 6, 7 (middle block)
# 3. Seats 6, 7, 8, 9 (right block)
#
# We can represent the reserved seats in a row using a bitmask for efficient checking.
# Since seats are numbered 1 to 10, we can use an integer where each bit from right to left represents a seat.
# For example, if seat 2 is reserved, we can set the 2nd bit (from the right, 0-indexed).
# So, seat 1 is bit 0, seat 2 is bit 1, ..., seat 10 is bit 9.
#
# The bitmasks for the available blocks would be:
# Left block (seats 2, 3, 4, 5): Binary 0000011110 (decimal 30)
# Middle block (seats 4, 5, 6, 7): Binary 0001111000 (decimal 120)
# Right block (seats 6, 7, 8, 9): Binary 0111100000 (decimal 240)
#
# The strategy for a row with reservations is:
# 1. Create a bitmask for the reserved seats in that row.
# 2. Check if the left block (seats 2-5) is available. This means checking if the bits corresponding to seats 2, 3, 4, 5 are NOT set in the row's bitmask.
#    Condition: (row_mask & 0000011110) == 0. Note: The problem statement uses 1-based indexing for seats. So seat 2 is index 1, seat 5 is index 4. The mask should cover bits 1 to 4. So 2^1 + 2^2 + 2^3 + 2^4 = 2 + 4 + 8 + 16 = 30.
# 3. Check if the right block (seats 6-9) is available. This means checking if the bits corresponding to seats 6, 7, 8, 9 are NOT set.
#    Condition: (row_mask & 0111100000) == 0. Note: Seat 6 is index 5, seat 9 is index 8. So 2^5 + 2^6 + 2^7 + 2^8 = 32 + 64 + 128 + 256 = 480.
#
# Let's re-evaluate the bitmasks based on seats 1-10.
# Seats 1-10 correspond to bits 0-9.
# Left block: seats 2, 3, 4, 5. Bits 1, 2, 3, 4. Mask: (1<<1) | (1<<2) | (1<<3) | (1<<4) = 2 | 4 | 8 | 16 = 30 (binary 00000011110)
# Middle block: seats 4, 5, 6, 7. Bits 3, 4, 5, 6. Mask: (1<<3) | (1<<4) | (1<<5) | (1<<6) = 8 | 16 | 32 | 64 = 120 (binary 0001111000)
# Right block: seats 6, 7, 8, 9. Bits 5, 6, 7, 8. Mask: (1<<5) | (1<<6) | (1<<7) | (1<<8) = 32 | 64 | 128 | 256 = 480 (binary 0111100000)
#
# The optimal strategy for a row with reservations:
# - If both left (2-5) and right (6-9) blocks are available, we can seat 2 groups.
# - If only one of them is available, we can seat 1 group.
# - If neither is available, but the middle block (4-7) is available, we can seat 1 group.
#
# A more direct approach for a row:
# Count the number of groups for a specific row's `row_mask`:
# `groups_in_row = 0`
# `left_possible = (row_mask & 30) == 0` # Seats 2,3,4,5
# `right_possible = (row_mask & 480) == 0` # Seats 6,7,8,9
# `middle_possible = (row_mask & 120) == 0` # Seats 4,5,6,7
#
# If `left_possible` AND `right_possible`, `groups_in_row = 2`.
# ELSE IF `left_possible` OR `right_possible`, `groups_in_row = 1`.
# ELSE IF `middle_possible`, `groups_in_row = 1`.
# ELSE `groups_in_row = 0`.
#
# This can be simplified:
# If left and right are possible, assign 2 groups.
# Otherwise, if left is possible, assign 1 group.
# Otherwise, if right is possible, assign 1 group.
# Otherwise, if middle is possible, assign 1 group.
#
# A more efficient way to check for a row's groups:
#
# `groups = 0`
#
# Check for seats 2-5 (left block): `(row_mask & 30) == 0`
# Check for seats 6-9 (right block): `(row_mask & 480) == 0`
# Check for seats 4-7 (middle block): `(row_mask & 120) == 0`
#
# Priority is to fill 2 groups if possible. This happens if seats 2-5 AND 6-9 are available.
# This is equivalent to seats 2-5 and seats 6-9 being available.
# If both are available, we get 2 groups.
#
# If not, we check if we can fit one group.
# This can be done by checking if (2-5) is available OR (6-9) is available OR (4-7) is available.
#
# So, for a row:
#
# `can_left = (row_mask & 30) == 0`
# `can_right = (row_mask & 480) == 0`
# `can_middle = (row_mask & 120) == 0`
#
# `groups = 0`
#
# If `can_left` and `can_right`:
#     `groups = 2`
# Elif `can_left` or `can_right` or `can_middle`:
#     `groups = 1`
#
# This logic is slightly flawed because if `can_left` and `can_right` are both true, we get 2 groups.
# If only `can_left` is true, we get 1 group.
# If only `can_right` is true, we get 1 group.
# If neither `can_left` nor `can_right` is true, but `can_middle` is true, we get 1 group.
#
# The key is that seats 4,5 overlap between left and middle, and seats 6,7 overlap between middle and right.
#
# The most straightforward way to count groups for a row:
# `row_groups = 0`
# `left_block_available = (row_mask & 30) == 0` # Seats 2,3,4,5
# `right_block_available = (row_mask & 480) == 0` # Seats 6,7,8,9
# `middle_block_available = (row_mask & 120) == 0` # Seats 4,5,6,7
#
# If `left_block_available` and `right_block_available`:
#     `row_groups = 2`
# Else if `left_block_available` or `right_block_available`:
#     `row_groups = 1`
# Else if `middle_block_available`:
#     `row_groups = 1`
#
# This correctly handles overlaps.
# If both left and right are free, we can place two groups.
# If not, we check if *any* of the three blocks can fit a group.
#
# Let's consider the available regions for a single group:
# Region 1: Seats 2, 3, 4, 5 (mask 30)
# Region 2: Seats 4, 5, 6, 7 (mask 120)
# Region 3: Seats 6, 7, 8, 9 (mask 480)
#
# Total groups for a row = 0
#
# If seats 2,3,4,5 are free AND seats 6,7,8,9 are free:
#   We can place 2 groups.
#   This is the case if `(row_mask & 30) == 0` AND `(row_mask & 480) == 0`.
#   This gives 2 groups.
#
# Else if seats 2,3,4,5 are free:
#   We can place 1 group.
#   This is the case if `(row_mask & 30) == 0`.
#
# Else if seats 6,7,8,9 are free:
#   We can place 1 group.
#   This is the case if `(row_mask & 480) == 0`.
#
# Else if seats 4,5,6,7 are free:
#   We can place 1 group.
#   This is the case if `(row_mask & 120) == 0`.
#
# Combining these:
#
# `groups_count = 0`
# `row_mask = 0` # to be populated from reservedSeats
#
# `is_left_free = (row_mask & 30) == 0`
# `is_right_free = (row_mask & 480) == 0`
#
# if `is_left_free` and `is_right_free`:
#     `groups_count = 2`
# elif `is_left_free` or `is_right_free`:
#     `groups_count = 1`
# elif `(row_mask & 120) == 0`: # Check middle only if left/right combo doesn't give 2, and neither left nor right alone gives 1.
#     `groups_count = 1`
#
# This logic is still a bit tricky. Let's simplify the decision for a row:
#
# A row can accommodate groups in three primary contiguous blocks of 4 seats:
# Block A: seats 2, 3, 4, 5
# Block B: seats 4, 5, 6, 7
# Block C: seats 6, 7, 8, 9
#
# We want to maximize the number of groups.
#
# Case 1: Can we place two groups?
# This is possible if Block A and Block C are both available.
# If `(row_mask & 30) == 0` AND `(row_mask & 480) == 0`, then we can place 2 groups.
#
# Case 2: If not two groups, can we place one group?
# This is possible if ANY of the blocks are available.
# - Block A is available: `(row_mask & 30) == 0`
# - Block B is available: `(row_mask & 120) == 0`
# - Block C is available: `(row_mask & 480) == 0`
#
# So, the number of groups in a row is:
#
# `groups_in_row = 0`
#
# `left_free = (row_mask & 30) == 0`
# `middle_free = (row_mask & 120) == 0`
# `right_free = (row_mask & 480) == 0`
#
# If `left_free` and `right_free`:
#     `groups_in_row = 2`
# Elif `left_free` or `middle_free` or `right_free`:
#     `groups_in_row = 1`
#
# This covers all possibilities correctly.
# If left and right are free, we get 2.
# If not both left and right are free, but at least one of them is free, we get 1.
# If neither left nor right is free, but middle is free, we get 1.
#
# Example: row_mask for row 1 in example 1: [[1,2],[1,3],[1,8]]
# Seats 2, 3, 8 are reserved.
# Bit representation (1-indexed seats correspond to powers of 2, starting from 2^0 for seat 1):
# Seat 2: bit 1 (2^1 = 2)
# Seat 3: bit 2 (2^2 = 4)
# Seat 8: bit 7 (2^7 = 128)
# row_mask = 2 + 4 + 128 = 134
#
# Check availability:
# Left block (seats 2,3,4,5): mask 30 (binary 00000011110)
# (134 & 30) = (binary 10000110 & 0000011110) = 000000100 = 2. Not 0. So left is NOT free.
#
# Right block (seats 6,7,8,9): mask 480 (binary 0111100000)
# (134 & 480) = (binary 10000110 & 0111100000) = 010000000 = 128. Not 0. So right is NOT free.
#
# Middle block (seats 4,5,6,7): mask 120 (binary 0001111000)
# (134 & 120) = (binary 10000110 & 0001111000) = 000001000 = 8. Not 0. So middle is NOT free.
#
# So, for row 1, groups_in_row = 0. This matches intuition, seats 2,3,8 are reserved and block the options.
#
# Let's consider row 1 again in Example 1: reservedSeats = [[1,2],[1,3],[1,8],[2,6],[3,1],[3,10]]
# Row 1 reservations: [1,2], [1,3], [1,8]
# Bitmask for row 1: (1<<1) | (1<<2) | (1<<7) = 2 | 4 | 128 = 134.
#
# Left block (2-5): mask 30. 134 & 30 = 2 (not free)
# Right block (6-9): mask 480. 134 & 480 = 128 (not free)
# Middle block (4-7): mask 120. 134 & 120 = 8 (not free)
# Groups for row 1 = 0.
#
# This is WRONG based on Example 1 output (4).
# The example explanation shows seats 2-5 and 7-10 being used in row 1. Wait, the problem states seats 2,3,4,5; 4,5,6,7; 6,7,8,9.
# So in row 1: seats 2,3,4,5 are available? No, 2 and 3 are reserved.
# The example diagram shows:
# Row 1: blue seats are 2,3,8. Orange seats are 4,5,6,7 and 9,10,1,2. This is confusing.
# "seats 2, 3, 4, 5"
# "seats 4, 5, 6, 7"
# "seats 6, 7, 8, 9"
#
# Let's use the given blocks:
# Block 1: [2, 3, 4, 5]
# Block 2: [4, 5, 6, 7]
# Block 3: [6, 7, 8, 9]
#
# Example 1: n=3, reservedSeats = [[1,2],[1,3],[1,8],[2,6],[3,1],[3,10]]
# Row 1: Reserved seats: 2, 3, 8.
#   Block 1 (2,3,4,5): Seats 2,3 are reserved. Not available.
#   Block 2 (4,5,6,7): Seats 4,5,6,7 are available. Available.
#   Block 3 (6,7,8,9): Seat 8 is reserved. Not available.
#   So for row 1, only Block 2 is available. This gives 1 group.
#
# Row 2: Reserved seats: 6.
#   Block 1 (2,3,4,5): Available.
#   Block 2 (4,5,6,7): Seat 6 is reserved. Not available.
#   Block 3 (6,7,8,9): Seat 6 is reserved. Not available.
#   So for row 2, only Block 1 is available. This gives 1 group.
#
# Row 3: Reserved seats: 1, 10.
#   Block 1 (2,3,4,5): Available.
#   Block 2 (4,5,6,7): Available.
#   Block 3 (6,7,8,9): Available.
#   Here, we can place groups strategically.
#   If we place a group in Block 1 (2,3,4,5), seats 4,5 are occupied.
#   Then Block 2 (4,5,6,7) is blocked.
#   Block 3 (6,7,8,9) is available. We can place a group here.
#   So, we can place 2 groups in row 3.
#
# Total groups: Row 1 (1) + Row 2 (1) + Row 3 (2) = 4. This matches Example 1.
#
# The logic for determining groups in a row needs to consider these three blocks and their overlaps.
# We need a way to map seat numbers to bit positions.
# Seat 1 -> bit 0
# Seat 2 -> bit 1
# ...
# Seat 10 -> bit 9
#
# Block 1 (seats 2,3,4,5): bits 1,2,3,4. Mask = (1<<1)|(1<<2)|(1<<3)|(1<<4) = 2|4|8|16 = 30.
# Block 2 (seats 4,5,6,7): bits 3,4,5,6. Mask = (1<<3)|(1<<4)|(1<<5)|(1<<6) = 8|16|32|64 = 120.
# Block 3 (seats 6,7,8,9): bits 5,6,7,8. Mask = (1<<5)|(1<<6)|(1<<7)|(1<<8) = 32|64|128|256 = 480.
#
# Let's refine the logic for a single row's mask (`row_mask`):
#
# `groups_in_row = 0`
#
# `can_block1 = (row_mask & 30) == 0` # Seats 2,3,4,5 free?
# `can_block2 = (row_mask & 120) == 0` # Seats 4,5,6,7 free?
# `can_block3 = (row_mask & 480) == 0` # Seats 6,7,8,9 free?
#
# If `can_block1` AND `can_block3`:
#     # If both outer blocks are free, we can place two groups.
#     # This implicitly means middle block is also available, or at least parts of it.
#     # The problem says "A four-person group must be assigned to four seats in the same row.
#     # The group can be seated in one of the following seat blocks".
#     # This implies that we cannot split a block or use partially.
#     # If Block 1 (2-5) and Block 3 (6-9) are both free, then we can seat 2 groups.
#     `groups_in_row = 2`
#
# Else if `can_block1` OR `can_block2` OR `can_block3`:
#     # If we cannot place two groups, we check if we can place at least one group.
#     # If any of the three blocks is available, we can place one group.
#     `groups_in_row = 1`
#
# This looks correct.
#
# Implementation details:
# - Use a dictionary `row_masks` to store bitmasks for each row. Key: row number, Value: bitmask.
# - Iterate through `reservedSeats`. For each `[row_i, seat_i]`:
#   - Update `row_masks[row_i] |= (1 << (seat_i - 1))`.
# - Calculate `total_groups = 0`.
# - The number of rows with reservations is `len(row_masks)`.
# - The number of completely empty rows is `n - len(row_masks)`. Each empty row contributes 2 groups (since seats 2-5 and 6-9 can be filled).
#   So, `total_groups += (n - len(row_masks)) * 2`.
# - Iterate through the `row_masks` dictionary:
#   - For each `row_mask` in `row_masks.values()`:
#     - Calculate `groups_in_row` using the logic derived above.
#     - `total_groups += groups_in_row`.
# - Return `total_groups`.
#
# Time Complexity:
# - Populating `row_masks`: O(R), where R is the number of reserved seats.
# - Iterating through `row_masks`: O(U), where U is the number of unique rows with reservations. U <= R.
# - The calculation for each row is O(1).
# - Total time complexity: O(R).
#
# Space Complexity:
# - Storing `row_masks`: O(U), where U is the number of unique rows with reservations. U <= R.
# - Total space complexity: O(U).
#
# Edge cases:
# - `n` can be very large (10^9), but `reservedSeats.length` is limited (10^4). This confirms that we should only process rows with reservations.
# - `reservedSeats` can be empty. In this case, all `n` rows are empty, and `total_groups = n * 2`.
#
# Let's re-check the bitmasks with an example:
# Reserved seat: [1, 5]
# Seat 5 corresponds to bit 4 (1 << 4).
# row_mask = 16 (binary 10000)
#
# Block 1 (2,3,4,5): mask 30 (0000011110)
# 16 & 30 = 16 (not 0). Block 1 is NOT free.
#
# Block 2 (4,5,6,7): mask 120 (0001111000)
# 16 & 120 = 16 (not 0). Block 2 is NOT free.
#
# Block 3 (6,7,8,9): mask 480 (0111100000)
# 16 & 480 = 0. Block 3 IS free.
#
# So, groups_in_row = 1 (because Block 3 is free, and it's not the case where Block 1 AND Block 3 are free).
# This seems correct.
#
# The problem statement "Each row has 10 seats, numbered from 1 to 10."
# "seats 2, 3, 4, 5"
# "seats 4, 5, 6, 7"
# "seats 6, 7, 8, 9"
#
# The crucial part is understanding that if Block 1 (2-5) and Block 3 (6-9) are available, it implies that seats 2,3,4,5 are free AND seats 6,7,8,9 are free.
# This means seats 2,3,4,5,6,7,8,9 are available.
# If seats 2-9 are all available, then Block 1, Block 2, and Block 3 are all available.
# If Block 1 and Block 3 are available, we can indeed seat two groups.
# For example, place one group in 2-5 and another in 6-9. These are distinct.
#
# So the logic:
# `groups_in_row = 0`
# `left_possible = (row_mask & 30) == 0`
# `right_possible = (row_mask & 480) == 0`
# `middle_possible = (row_mask & 120) == 0`
#
# If `left_possible` and `right_possible`:
#     `groups_in_row = 2`
# Elif `left_possible` or `middle_possible` or `right_possible`:
#     `groups_in_row = 1`
#
# This logic is sound.
#
# Let's reconsider the example 1 row 1 with this logic.
# Row 1: reserved seats 2, 3, 8. `row_mask = 134`.
# `left_possible = (134 & 30) == 0` -> `(2) == 0` -> False.
# `right_possible = (134 & 480) == 0` -> `(128) == 0` -> False.
# `middle_possible = (134 & 120) == 0` -> `(8) == 0` -> False.
#
# If `left_possible` and `right_possible`: False (since both are False)
# Elif `left_possible` or `middle_possible` or `right_possible`: False (since all are False)
# So `groups_in_row = 0`. This is consistent with the row having reservations that block all options.
#
# Let's re-evaluate row 1 in example 1: [[1,2],[1,3],[1,8]]
# The diagram for example 1 shows in row 1:
# Seats 2,3,8 are blue (reserved).
# The orange groups are:
# 1. Seats 4,5,6,7. These are available.
# 2. Seats 9,10,1,2. This block is NOT described in the problem. This might be a typo in the example explanation image.
# The problem statement clearly defines the three blocks:
# 1. seats 2, 3, 4, 5
# 2. seats 4, 5, 6, 7
# 3. seats 6, 7, 8, 9
#
# Let's trust the problem statement definition of blocks.
# Row 1, reserved: 2, 3, 8. mask = 134.
# Block 1 (2-5): needs 2,3,4,5. Seats 2,3 are reserved. Not free.
# Block 2 (4-7): needs 4,5,6,7. No reservations in row 1 for these seats. FREE.
# Block 3 (6-9): needs 6,7,8,9. Seat 8 is reserved. Not free.
#
# So for row 1:
# `left_possible = False`
# `right_possible = False`
# `middle_possible = True`
#
# `groups_in_row = 0`
# If `left_possible` and `right_possible`: False
# Elif `left_possible` or `middle_possible` or `right_possible`: True (because `middle_possible` is True) -> `groups_in_row = 1`.
#
# This yields 1 group for row 1.
#
# Row 2: reserved seats 6. mask = (1<<5) = 32.
# `left_possible = (32 & 30) == 0` -> `(0) == 0` -> True.
# `right_possible = (32 & 480) == 0` -> `(32) == 0` -> False.
# `middle_possible = (32 & 120) == 0` -> `(32) == 0` -> False.
#
# If `left_possible` and `right_possible`: False
# Elif `left_possible` or `middle_possible` or `right_possible`: True (because `left_possible` is True) -> `groups_in_row = 1`.
#
# This yields 1 group for row 2.
#
# Row 3: reserved seats 1, 10. mask = (1<<0) | (1<<9) = 1 | 512 = 513.
# `left_possible = (513 & 30) == 0` -> `(0) == 0` -> True.
# `right_possible = (513 & 480) == 0` -> `(0) == 0` -> True.
# `middle_possible = (513 & 120) == 0` -> `(0) == 0` -> True.
#
# If `left_possible` and `right_possible`: True and True -> True -> `groups_in_row = 2`.
#
# This yields 2 groups for row 3.
#
# Total groups = 1 (row 1) + 1 (row 2) + 2 (row 3) = 4.
# This matches the example output. The logic seems robust now.
#
# The number of totally empty rows is `n - len(row_masks)`.
# For example 1, n=3. `row_masks` will have keys 1, 2, 3. So `len(row_masks) = 3`.
# Number of empty rows = 3 - 3 = 0.
#
# So for example 1:
# `total_groups = (3 - 3) * 2 + 1 + 1 + 2 = 0 * 2 + 4 = 4`.
#
# The calculation `(n - len(row_masks)) * 2` correctly accounts for rows with no reservations.
#
# Final check on bitmasks and logic:
#
# Mask for block 1 (seats 2,3,4,5): bits 1,2,3,4. Binary `00000011110`. Decimal 30.
# Mask for block 2 (seats 4,5,6,7): bits 3,4,5,6. Binary `0001111000`. Decimal 120.
# Mask for block 3 (seats 6,7,8,9): bits 5,6,7,8. Binary `0111100000`. Decimal 480.
#
# `row_mask`: bit `i-1` is set if seat `i` is reserved.
#
# `left_possible = (row_mask & 30) == 0`
# `right_possible = (row_mask & 480) == 0`
# `middle_possible = (row_mask & 120) == 0`
#
# `row_groups = 0`
# if `left_possible` and `right_possible`:
#     `row_groups = 2`
# elif `left_possible` or `middle_possible` or `right_possible`:
#     `row_groups = 1`
#
# This is the correct logic.
#
# The maximum value of n is 10^9, so we cannot iterate through all rows.
# The number of reserved seats is at most 10^4.
# This means the number of unique rows with reservations is at most 10^4.
# So, using a hash map (dictionary in Python) to store reservations per row is efficient.
#
# `row_reservations = {}` # Use a defaultdict for convenience
# `from collections import defaultdict`
# `row_reservations = defaultdict(int)`
#
# For each `[row_i, seat_i]` in `reservedSeats`:
#    `row_reservations[row_i] |= (1 << (seat_i - 1))`
#
# `total_groups = (n - len(row_reservations)) * 2`
#
# For `mask` in `row_reservations.values()`:
#    `groups_in_row = 0`
#    `left_possible = (mask & 30) == 0`
#    `right_possible = (mask & 480) == 0`
#    `middle_possible = (mask & 120) == 0`
#
#    if `left_possible` and `right_possible`:
#        `groups_in_row = 2`
#    elif `left_possible` or `middle_possible` or `right_possible`:
#        `groups_in_row = 1`
#
#    `total_groups += groups_in_row`
#
# This is the complete algorithm.

```python
from collections import defaultdict

class Solution:
    def maxNumberOfFamilies(self, n: int, reservedSeats: list[list[int]]) -> int:
        # Approach:
        # The problem asks to find the maximum number of four-person groups that can be seated.
        # A group must occupy one of three specific contiguous 4-seat blocks in a single row.
        # The blocks are: seats 2-5, seats 4-7, and seats 6-9.
        #
        # Since 'n' (number of rows) can be very large (up to 10^9), we cannot iterate through all rows.
        # However, the number of reserved seats is limited (up to 10^4). This means only a small
        # fraction of rows will have reservations.
        # We only need to consider rows that have at least one reserved seat.
        # Rows with no reservations can always accommodate 2 groups (by filling seats 2-5 and 6-9).
        #
        # We can use a dictionary (or defaultdict) to store the reserved seats for each row that has reservations.
        # The key will be the row number, and the value will be a bitmask representing the reserved seats in that row.
        # Each bit from 0 to 9 in the bitmask corresponds to seats 1 to 10, respectively.
        #
        # The three possible blocks and their corresponding bitmasks:
        # Block 1: seats 2, 3, 4, 5. These correspond to bits 1, 2, 3, 4.
        #          Mask = (1<<1) | (1<<2) | (1<<3) | (1<<4) = 2 | 4 | 8 | 16 = 30.
        # Block 2: seats 4, 5, 6, 7. These correspond to bits 3, 4, 5, 6.
        #          Mask = (1<<3) | (1<<4) | (1<<5) | (1<<6) = 8 | 16 | 32 | 64 = 120.
        # Block 3: seats 6, 7, 8, 9. These correspond to bits 5, 6, 7, 8.
        #          Mask = (1<<5) | (1<<6) | (1<<7) | (1<<8) = 32 | 64 | 128 | 256 = 480.
        #
        # For each row with reservations, we determine the maximum number of groups that can be seated.
        # The logic is:
        # 1. If both Block 1 (seats 2-5) and Block 3 (seats 6-9) are available, we can seat 2 groups.
        #    This is because these two blocks are disjoint except for the potential middle section,
        #    but if both outer blocks are fully available, we can fill them.
        # 2. Otherwise, if any of Block 1 (2-5), Block 2 (4-7), or Block 3 (6-9) is available, we can seat 1 group.
        #
        # Time Complexity: O(R), where R is the number of reserved seats.
        #   - Populating the row_reservations dictionary takes O(R) time.
        #   - Iterating through the unique rows with reservations takes O(U) time, where U <= R.
        #   - Calculating groups for each row is O(1).
        # Space Complexity: O(U), where U is the number of unique rows with reservations. U <= R.

        # Dictionary to store bitmasks of reserved seats for each row.
        # Key: row number, Value: bitmask of reserved seats.
        row_reservations = defaultdict(int)

        # Populate the row_reservations dictionary.
        # For each reserved seat [row_i, seat_i]:
        # - seat_i is 1-indexed, so it corresponds to bit (seat_i - 1).
        # - We OR the current bitmask for the row with the bit for the reserved seat.
        for row_i, seat_i in reservedSeats:
            row_reservations[row_i] |= (1 << (seat_i - 1))

        # Total number of groups that can be seated.
        total_groups = 0

        # Calculate groups from rows with NO reservations.
        # These rows can always accommodate 2 groups (using seats 2-5 and 6-9).
        # Number of rows with reservations = len(row_reservations).
        # Number of completely empty rows = n - len(row_reservations).
        num_empty_rows = n - len(row_reservations)
        total_groups += num_empty_rows * 2

        # Now, calculate groups for rows that DO have reservations.
        for mask in row_reservations.values():
            groups_in_row = 0

            # Check availability of the three blocks using bitwise AND.
            # If (mask & block_mask) is 0, it means none of the bits set in block_mask are set in mask,
            # so the block is available.

            # Block 1: seats 2, 3, 4, 5 (mask = 30)
            left_possible = (mask & 30) == 0

            # Block 3: seats 6, 7, 8, 9 (mask = 480)
            right_possible = (mask & 480) == 0

            # Block 2: seats 4, 5, 6, 7 (mask = 120)
            middle_possible = (mask & 120) == 0

            # Logic to determine groups_in_row:
            # If both outer blocks (2-5 and 6-9) are available, we can seat 2 groups.
            if left_possible and right_possible:
                groups_in_row = 2
            # Otherwise, if any of the three blocks is available, we can seat 1 group.
            # This covers cases where only left is available, only right is available,
            # or only the middle block is available (if outer ones are blocked).
            elif left_possible or middle_possible or right_possible:
                groups_in_row = 1
            # If none of the blocks are available, groups_in_row remains 0.

            total_groups += groups_in_row

        return total_groups

```