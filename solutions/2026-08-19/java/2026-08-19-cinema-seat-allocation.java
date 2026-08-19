```java
// Problem: Cinema Seat Allocation
// Link: https://leetcode.com/problems/cinema-seat-allocation/
//
// Approach:
// The problem asks us to maximize the number of four-person groups that can be
// seated in a cinema with n rows and 10 seats per row. Groups must occupy
// contiguous seats within a row, and specific seat blocks are available.
//
// The available seat blocks for a four-person group are:
// 1. Seats 2, 3, 4, 5
// 2. Seats 4, 5, 6, 7
// 3. Seats 6, 7, 8, 9
//
// Notice that seats 1 and 10 are never part of any of the valid four-person blocks.
// This means that if a row has no reserved seats, we can potentially fit 2 groups
// (one in 2-5 and another in 6-9, or even 2-5 and 4-7 if seats 4-5 are free).
// Specifically, if no seats are reserved in a row, we can fit 2 groups.
// If seats 2,3,4,5 are free, we can fit one group.
// If seats 6,7,8,9 are free, we can fit one group.
// If seats 4,5,6,7 are free, we can fit one group.
//
// The key observation is that each row is independent of other rows, except for
// the total number of rows `n`. Since `n` can be very large (up to 10^9), we cannot
// simulate each row if most of them are empty.
//
// We only need to consider rows that have at least one reserved seat.
// For rows with no reserved seats, we can calculate how many groups can be
// placed in the available blocks.
//
// We can use a HashMap to store the reserved seats for each row. The key will be
// the row number, and the value will be a bitmask or a set representing the
// reserved seats in that row. A bitmask is efficient for representing seats 1-10.
// Let's use a bitmask where the i-th bit (from right, starting at 0) represents
// seat i+1. So, seat 2 corresponds to bit 1, seat 3 to bit 2, and so on.
//
// For each row with reservations:
// 1. Determine which of the three possible four-person blocks can be used.
//    - Block 1 (seats 2, 3, 4, 5): Check if seats 2, 3, 4, 5 are available.
//    - Block 2 (seats 4, 5, 6, 7): Check if seats 4, 5, 6, 7 are available.
//    - Block 3 (seats 6, 7, 8, 9): Check if seats 6, 7, 8, 9 are available.
//
//    To check availability efficiently using a bitmask:
//    - Block 1 (2,3,4,5): Seats correspond to bits 1, 2, 3, 4.
//      Let's define a mask for this block: `(1 << 1) | (1 << 2) | (1 << 3) | (1 << 4)`
//    - Block 2 (4,5,6,7): Seats correspond to bits 3, 4, 5, 6.
//      Mask: `(1 << 3) | (1 << 4) | (1 << 5) | (1 << 6)`
//    - Block 3 (6,7,8,9): Seats correspond to bits 5, 6, 7, 8.
//      Mask: `(1 << 5) | (1 << 6) | (1 << 7) | (1 << 8)`
//
//    For a row's bitmask `rowMask`, a block is available if `(rowMask & blockMask) == 0`.
//
// 2. Count the number of groups for that row.
//    - If seats 2-5 are free AND seats 6-9 are free, we can fit 2 groups. (This implies seats 4-7 are also free, but prioritizing the two separate blocks gives 2 groups).
//    - Otherwise, if seats 2-5 are free, we can fit 1 group.
//    - Else if seats 6-9 are free, we can fit 1 group.
//    - Else if seats 4-7 are free, we can fit 1 group. (This case is covered if 2-5 and 6-9 are not both free, but 4-7 is).
//
//    A more structured way to count:
//    Let `can_2_5 = (rowMask & ((1<<1)|(1<<2)|(1<<3)|(1<<4))) == 0`
//    Let `can_6_9 = (rowMask & ((1<<5)|(1<<6)|(1<<7)|(1<<8))) == 0`
//    Let `can_4_7 = (rowMask & ((1<<3)|(1<<4)|(1<<5)|(1<<6))) == 0`
//
//    If `can_2_5` and `can_6_9`: `groups_in_row = 2`
//    Else if `can_2_5` or `can_6_9` or `can_4_7`: `groups_in_row = 1`
//    Else: `groups_in_row = 0`
//
//    Let's refine the counting logic to be more direct and avoid overlaps:
//    Check for the most permissive arrangement first:
//    If seats 2-5 are free AND seats 6-9 are free, we can place 2 groups.
//    Else if seats 2-5 are free, we can place 1 group.
//    Else if seats 6-9 are free, we can place 1 group.
//    Else if seats 4-7 are free, we can place 1 group.
//
//    Let's represent the blocks and their seat indices (1-based)
//    Block 1: {2, 3, 4, 5}
//    Block 2: {4, 5, 6, 7}
//    Block 3: {6, 7, 8, 9}
//
//    Consider the seats within a row that can be occupied by a group:
//    Seats 2-9.
//    The middle seats 4,5,6,7 are crucial for overlapping.
//
//    Let's map seats 1-10 to bit positions 0-9.
//    Seat 2 -> bit 1
//    Seat 3 -> bit 2
//    Seat 4 -> bit 3
//    Seat 5 -> bit 4
//    Seat 6 -> bit 5
//    Seat 7 -> bit 6
//    Seat 8 -> bit 7
//    Seat 9 -> bit 8
//
//    Block 1 (2,3,4,5) corresponds to bits 1,2,3,4. Mask: `(1<<1) | (1<<2) | (1<<3) | (1<<4)`
//    Block 2 (4,5,6,7) corresponds to bits 3,4,5,6. Mask: `(1<<3) | (1<<4) | (1<<5) | (1<<6)`
//    Block 3 (6,7,8,9) corresponds to bits 5,6,7,8. Mask: `(1<<5) | (1<<6) | (1<<7) | (1<<8)`
//
//    Let's check availability greedily:
//    If seats 2-5 are available AND seats 6-9 are available: 2 groups can be placed.
//    Else if seats 2-5 are available OR seats 4-7 are available OR seats 6-9 are available: 1 group can be placed.
//
//    Let's use bitmasks for clarity and efficiency.
//    Mask for seats 2,3,4,5: `(1 << 1) | (1 << 2) | (1 << 3) | (1 << 4)` which is `0b00011110` or `30`.
//    Mask for seats 4,5,6,7: `(1 << 3) | (1 << 4) | (1 << 5) | (1 << 6)` which is `0b01111000` or `120`.
//    Mask for seats 6,7,8,9: `(1 << 5) | (1 << 6) | (1 << 7) | (1 << 8)` which is `0b111100000` or `480`.
//
//    For a given row's `rowMask` (where bits represent reserved seats):
//    `can_2_5 = (rowMask & 30) == 0`
//    `can_4_7 = (rowMask & 120) == 0`
//    `can_6_9 = (rowMask & 480) == 0`
//
//    Groups for the row:
//    If `can_2_5` AND `can_6_9`: `groups_in_row = 2`
//    Else if `can_2_5` OR `can_4_7` OR `can_6_9`: `groups_in_row = 1`
//    Else: `groups_in_row = 0`
//
// Total groups = (n - number of rows with reservations) * 2 (for empty rows)
//              + sum of groups calculated for each row with reservations.
//
// Example 1 walkthrough: n = 3, reservedSeats = [[1,2],[1,3],[1,8],[2,6],[3,1],[3,10]]
//
// Map reserved seats to HashMap<Integer, Integer> rowMasks:
// Row 1: [1,2], [1,3], [1,8] -> Seat 2 (bit 1), Seat 3 (bit 2), Seat 8 (bit 7)
//        rowMasks.put(1, (1<<1) | (1<<2) | (1<<7)) = 2 | 4 | 128 = 134
// Row 2: [2,6] -> Seat 6 (bit 5)
//        rowMasks.put(2, (1<<5)) = 32
// Row 3: [3,1], [3,10] -> Seat 1 (bit 0), Seat 10 (bit 9)
//        rowMasks.put(3, (1<<0) | (1<<9)) = 1 | 512 = 513
//
// Process rows with reservations:
// Row 1 (mask 134):
//   Seats 2,3,4,5 (bits 1,2,3,4): (134 & 30) = (0b10000110 & 0b00011110) = 0b00000110 = 6 != 0. NOT `can_2_5`.
//   Seats 4,5,6,7 (bits 3,4,5,6): (134 & 120) = (0b10000110 & 0b01111000) = 0b00000000 = 0. IS `can_4_7`.
//   Seats 6,7,8,9 (bits 5,6,7,8): (134 & 480) = (0b10000110 & 0b111100000) = 0b10000000 = 128 != 0. NOT `can_6_9`.
//   `can_4_7` is true. So, 1 group for row 1.
//
// Row 2 (mask 32):
//   Seats 2,3,4,5 (bits 1,2,3,4): (32 & 30) = (0b00100000 & 0b00011110) = 0b00000000 = 0. IS `can_2_5`.
//   Seats 4,5,6,7 (bits 3,4,5,6): (32 & 120) = (0b00100000 & 0b01111000) = 0b00100000 = 32 != 0. NOT `can_4_7`.
//   Seats 6,7,8,9 (bits 5,6,7,8): (32 & 480) = (0b00100000 & 0b111100000) = 0b00100000 = 32 != 0. NOT `can_6_9`.
//   `can_2_5` is true. So, 1 group for row 2.
//
// Row 3 (mask 513):
//   Seats 2,3,4,5 (bits 1,2,3,4): (513 & 30) = (0b1000000001 & 0b00011110) = 0b00000000 = 0. IS `can_2_5`.
//   Seats 4,5,6,7 (bits 3,4,5,6): (513 & 120) = (0b1000000001 & 0b01111000) = 0b00000000 = 0. IS `can_4_7`.
//   Seats 6,7,8,9 (bits 5,6,7,8): (513 & 480) = (0b1000000001 & 0b111100000) = 0b00000000 = 0. IS `can_6_9`.
//   `can_2_5` AND `can_6_9` are true. So, 2 groups for row 3.
//
// Total groups from reserved rows = 1 (row 1) + 1 (row 2) + 2 (row 3) = 4.
// Number of rows with reservations = 3.
// Number of empty rows = n - 3 = 3 - 3 = 0.
// Groups from empty rows = 0 * 2 = 0.
// Total groups = 4 + 0 = 4. This matches Example 1.
//
// Let's re-evaluate the conditions for 2 groups.
// If seats 2-5 and 6-9 are free, that's 2 groups.
// What if seats 4-7 are free, but 2-5 or 6-9 are not?
//
// Consider a row with no reservations.
// `rowMask = 0`.
// `can_2_5 = true`.
// `can_4_7 = true`.
// `can_6_9 = true`.
// `can_2_5` AND `can_6_9` is true. So 2 groups. This is correct.
//
// Let's refine the logic for counting groups in a row with reservations:
// We have three potential blocks:
// Block A: seats 2, 3, 4, 5
// Block B: seats 4, 5, 6, 7
// Block C: seats 6, 7, 8, 9
//
// A row can accommodate:
// - 2 groups if Block A and Block C are both available. This configuration ensures there are no conflicts and maximizes groups.
// - 1 group if Block A is available, OR Block B is available, OR Block C is available.
//
// So, for a given `rowMask`:
// `int groups = 0;`
// `boolean available_2_5 = (rowMask & 30) == 0;` // Seats 2,3,4,5
// `boolean available_4_7 = (rowMask & 120) == 0;` // Seats 4,5,6,7
// `boolean available_6_9 = (rowMask & 480) == 0;` // Seats 6,7,8,9
//
// `if (available_2_5 && available_6_9) {`
// `  groups = 2;`
// `} else if (available_2_5 || available_4_7 || available_6_9) {`
// `  groups = 1;`
// `}`
// `totalGroups += groups;`
//
// This logic seems correct. The key is that seats 1 and 10 are irrelevant.
// Any row with no reserved seats contributes 2 groups.
//
// Data Structure: HashMap<Integer, Integer> to store row number -> bitmask of reserved seats.
// Iterate through `reservedSeats`. For each `[row, seat]`:
//   Update the bitmask for `row` in the HashMap.
//
// Calculate the number of rows that actually have reservations. Let this be `numReservedRows`.
// The number of completely empty rows is `n - numReservedRows`.
// Each empty row contributes 2 groups. So, `(n - numReservedRows) * 2`.
//
// Iterate through the `values()` of the HashMap (which are the bitmasks for rows with reservations).
// For each `rowMask`, calculate the groups it can accommodate using the logic derived above.
// Add these groups to the total.
//
// The total number of groups will be the sum.
//
// Time Complexity:
// - Populating the HashMap: O(R), where R is the number of reserved seats.
// - Iterating through the HashMap: O(N_res), where N_res is the number of unique rows with reservations. N_res <= R.
// - Calculating groups for each reserved row: O(1) per row (constant bitwise operations).
// - Calculating groups for empty rows: O(1) (constant arithmetic operations).
// Overall Time Complexity: O(R) because R is at most 10^4, and we iterate through reservations once and then through unique rows once.
//
// Space Complexity:
// - HashMap: O(N_res) to store the bitmasks for unique rows with reservations. N_res <= R.
// Overall Space Complexity: O(R) in the worst case where all reserved seats are in different rows. However, since there are only 10 seats per row, the maximum number of distinct rows we care about is limited by R and also implicitly by n if n is small. The actual number of entries in the map will be at most R.
//
// Final check on constraints:
// `1 <= n <= 10^9`: This confirms we must handle large n efficiently by accounting for empty rows.
// `reservedSeats.length <= min(10 * n, 10^4)`: `reservedSeats.length` is at most 10^4. This is the dominant factor for processing reservations.
//
// The approach is sound.
//
// Bitmasks for seat availability:
// Mask for seats 2,3,4,5: `(1 << 1) | (1 << 2) | (1 << 3) | (1 << 4)` = `2 | 4 | 8 | 16` = `30`.
// Mask for seats 4,5,6,7: `(1 << 3) | (1 << 4) | (1 << 5) | (1 << 6)` = `8 | 16 | 32 | 64` = `120`.
// Mask for seats 6,7,8,9: `(1 << 5) | (1 << 6) | (1 << 7) | (1 << 8)` = `32 | 64 | 128 | 256` = `480`.
//
// These masks are correct.

import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maxNumberOfFamilies(int n, int[][] reservedSeats) {
        // HashMap to store the bitmask of reserved seats for each row.
        // Key: row number, Value: bitmask where the i-th bit (from right, 0-indexed)
        // corresponds to seat i+1.
        Map<Integer, Integer> rowMasks = new HashMap<>();

        // Populate the HashMap with reserved seats.
        for (int[] seatInfo : reservedSeats) {
            int row = seatInfo[0];
            int seat = seatInfo[1];
            // Get the current mask for the row, or 0 if it's the first reservation for this row.
            int currentMask = rowMasks.getOrDefault(row, 0);
            // Set the bit corresponding to the reserved seat.
            // Seat 1 -> bit 0, Seat 2 -> bit 1, ..., Seat 10 -> bit 9.
            currentMask |= (1 << (seat - 1));
            rowMasks.put(row, currentMask);
        }

        // Total number of groups that can be assigned.
        int totalGroups = 0;

        // Calculate groups for rows that have at least one reservation.
        // Each entry in rowMasks represents a row that is NOT completely empty.
        // The number of such rows is rowMasks.size().
        for (int mask : rowMasks.values()) {
            // Check availability of the three potential 4-seat blocks.
            // We use bitmasks for efficiency.
            // Block 1: Seats 2, 3, 4, 5. Corresponds to bits 1, 2, 3, 4.
            // Mask: (1<<1)|(1<<2)|(1<<3)|(1<<4) = 2|4|8|16 = 30
            boolean canOccupyBlock1 = (mask & 30) == 0;

            // Block 2: Seats 4, 5, 6, 7. Corresponds to bits 3, 4, 5, 6.
            // Mask: (1<<3)|(1<<4)|(1<<5)|(1<<6) = 8|16|32|64 = 120
            boolean canOccupyBlock2 = (mask & 120) == 0;

            // Block 3: Seats 6, 7, 8, 9. Corresponds to bits 5, 6, 7, 8.
            // Mask: (1<<5)|(1<<6)|(1<<7)|(1<<8) = 32|64|128|256 = 480
            boolean canOccupyBlock3 = (mask & 480) == 0;

            // Determine how many groups can be placed in this row.
            if (canOccupyBlock1 && canOccupyBlock3) {
                // If both the left block (2-5) and the right block (6-9) are free,
                // we can place 2 groups. This is the maximum for any row.
                totalGroups += 2;
            } else if (canOccupyBlock1 || canOccupyBlock2 || canOccupyBlock3) {
                // If at least one of the three blocks is free, we can place 1 group.
                // The '||' handles cases where only one block is available, or
                // overlapping blocks like 4-7 are available when 2-5 or 6-9 are not fully free.
                totalGroups += 1;
            }
            // If none of the blocks are available, 0 groups are added for this row.
        }

        // Calculate the number of rows that have no reserved seats.
        // These rows are guaranteed to be able to seat 2 families.
        // Total rows 'n' minus the number of rows that have at least one reservation (rowMasks.size()).
        int emptyRows = n - rowMasks.size();

        // Add groups from all completely empty rows.
        totalGroups += emptyRows * 2;

        return totalGroups;
    }
}
```