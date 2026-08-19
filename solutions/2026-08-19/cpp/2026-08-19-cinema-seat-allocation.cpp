```cpp
// Problem: Cinema Seat Allocation
// Summary: Maximize the number of four-person groups assigned to available contiguous seat blocks in a cinema.
// Link: https://leetcode.com/problems/cinema-seat-allocation/
//
// Approach:
// The problem involves allocating four-person groups to specific seat blocks within rows.
// Since each row has 10 seats and the potential blocks are (2,3,4,5), (4,5,6,7), and (6,7,8,9),
// we can observe that the middle block (4,5,6,7) overlaps with the other two.
// If a row has no reserved seats, it can accommodate at most two groups:
// one in (2,3,4,5) and one in (6,7,8,9). The middle block (4,5,6,7) cannot be used in this case
// as it would conflict with both.
//
// If a row has reserved seats, we need to check the availability of each block.
// The key observation is that we only care about reserved seats in rows that actually have reservations.
// Rows without reservations can accommodate two groups.
// We can use a hash map (or an unordered_map in C++) to store the reserved seats for each row.
// The key will be the row number, and the value will be a bitmask representing the reserved seats in that row.
// A bitmask is efficient here because there are only 10 seats per row. The i-th bit (0-indexed) can represent seat i+1.
// For example, if seats 2 and 8 are reserved, the bitmask would be (1 << 1) | (1 << 7) = 2 | 128 = 130.
//
// For each row with reservations:
// 1. Calculate the bitmask of reserved seats.
// 2. Check if the left block (seats 2-5, represented by bits 1-4) is available.
//    This means bits 1, 2, 3, 4 should not be set in the bitmask.
//    Condition: !((mask >> 1) & 0b1111)
// 3. Check if the right block (seats 6-9, represented by bits 5-8) is available.
//    This means bits 5, 6, 7, 8 should not be set in the bitmask.
//    Condition: !((mask >> 5) & 0b1111)
// 4. Check if the middle block (seats 4-7, represented by bits 3-6) is available.
//    This means bits 3, 4, 5, 6 should not be set in the bitmask.
//    Condition: !((mask >> 3) & 0b1111)
//
// For each row with reservations, we can assign groups greedily:
// - If both the left block (2-5) and the right block (6-9) are available, we can assign two groups.
// - If only one of them is available, we can assign one group.
// - If neither the left nor the right block is available, we then check if the middle block (4-7) is available. If it is, we can assign one group.
//
// A simpler way to think about available blocks in a row:
// Let's define the available seat ranges:
// Block A: seats 2, 3, 4, 5 (bits 1, 2, 3, 4)
// Block B: seats 4, 5, 6, 7 (bits 3, 4, 5, 6)
// Block C: seats 6, 7, 8, 9 (bits 5, 6, 7, 8)
//
// For a given row's bitmask `mask`:
// - Check if Block A is free: `!((mask >> 1) & 0b1111)` (seats 2,3,4,5)
// - Check if Block C is free: `!((mask >> 5) & 0b1111)` (seats 6,7,8,9)
// - Check if Block B is free: `!((mask >> 3) & 0b1111)` (seats 4,5,6,7)
//
// If both Block A and Block C are free, we can seat 2 groups.
// If either Block A or Block C is free (but not both), and Block B is free, we can seat 1 group.
// If neither Block A nor Block C is free, but Block B is free, we can seat 1 group.
//
// The most efficient way to count is:
// For each row with reservations:
//  int groups_in_row = 0;
//  bool left_available = !((mask >> 1) & 0b1111); // seats 2-5
//  bool right_available = !((mask >> 5) & 0b1111); // seats 6-9
//  bool middle_available = !((mask >> 3) & 0b1111); // seats 4-7
//
//  if (left_available && right_available) {
//      groups_in_row = 2;
//  } else if (left_available || right_available || middle_available) {
//      // If left or right is available, that's one group.
//      // If neither left nor right is available, but middle is, that's one group.
//      groups_in_row = 1;
//  }
//
//  total_groups += groups_in_row;
//
// The number of rows `n` can be very large (10^9), so we cannot iterate through all rows.
// However, the number of `reservedSeats` is limited. This means most rows will have no reservations.
// Each row with no reservations can accommodate 2 groups.
//
// So, the total number of groups will be:
// (n - number of rows with reservations) * 2  +  sum of groups from rows with reservations.
//
// Time Complexity:
// O(R), where R is the number of reserved seats. We iterate through the reserved seats once to build the hash map.
// Then, we iterate through the entries in the hash map (at most R entries).
//
// Space Complexity:
// O(min(N, R)), where N is the number of rows and R is the number of reserved seats. In the worst case, all rows with reservations could be distinct,
// but the number of distinct rows is at most R. Since N can be very large, and R is limited, the space complexity is effectively O(R)
// due to the hash map storing distinct rows with reservations.
//
#include <vector>
#include <unordered_map>

class Solution {
public:
    int maxNumberOfFamilies(int n, std::vector<std::vector<int>>& reservedSeats) {
        // Use an unordered_map to store reserved seats for each row.
        // Key: row number, Value: bitmask representing reserved seats.
        // Bit i (0-indexed) corresponds to seat i+1.
        std::unordered_map<int, int> row_reservations;

        // Populate the map with reservations.
        for (const auto& seat_info : reservedSeats) {
            int row = seat_info[0];
            int seat = seat_info[1];
            // Set the corresponding bit in the bitmask.
            // Seat numbers are 1-indexed, so we use seat-1 for 0-indexed bit position.
            row_reservations[row] |= (1 << (seat - 1));
        }

        // Initialize the total number of groups.
        // Each row with no reservations can accommodate 2 families (one in 2-5, one in 6-9).
        // We will calculate this from rows with reservations and then add the remaining.
        int families_from_reserved_rows = 0;

        // Iterate through the rows that have at least one reservation.
        for (auto const& [row_num, mask] : row_reservations) {
            int groups_in_this_row = 0;

            // Check availability of the three possible seat blocks.
            // Block 1: seats 2, 3, 4, 5 (corresponds to bits 1, 2, 3, 4)
            // To check if seats 2-5 are available, we check if bits 1 through 4 are NOT set.
            // We can do this by shifting the mask right by 1 to align bits 1-4 with positions 0-3,
            // then masking with 0b1111 (which is 15 in decimal).
            bool left_block_available = !((mask >> 1) & 0b1111); // Seats 2,3,4,5

            // Block 2: seats 6, 7, 8, 9 (corresponds to bits 5, 6, 7, 8)
            // To check if seats 6-9 are available, we check if bits 5 through 8 are NOT set.
            // Shift mask right by 5 to align bits 5-8 with positions 0-3, then mask.
            bool right_block_available = !((mask >> 5) & 0b1111); // Seats 6,7,8,9

            // Block 3: seats 4, 5, 6, 7 (corresponds to bits 3, 4, 5, 6)
            // To check if seats 4-7 are available, we check if bits 3 through 6 are NOT set.
            // Shift mask right by 3 to align bits 3-6 with positions 0-3, then mask.
            bool middle_block_available = !((mask >> 3) & 0b1111); // Seats 4,5,6,7

            // Greedily assign families.
            // If both the left and right blocks are available, we can seat 2 families.
            if (left_block_available && right_block_available) {
                groups_in_this_row = 2;
            }
            // If only one of the outer blocks (left or right) is available, OR if the middle block is available
            // (and the outer ones are not fully available), we can seat 1 family.
            // The condition `left_block_available || right_block_available || middle_block_available` covers all cases
            // where at least one block can be used. If the first `if` (2 families) was not met, it means we can't get 2 families.
            // So, if any block is available, we can get 1 family.
            else if (left_block_available || right_block_available || middle_block_available) {
                groups_in_this_row = 1;
            }
            
            families_from_reserved_rows += groups_in_this_row;
        }

        // Calculate the number of rows that have NO reservations.
        // Total rows `n` minus the number of rows that had at least one reservation (which is the size of our map).
        int rows_without_reservations = n - row_reservations.size();

        // Each row without reservations can accommodate 2 families.
        int families_from_empty_rows = rows_without_reservations * 2;

        // The total maximum number of families is the sum from rows with reservations and rows without.
        return families_from_reserved_rows + families_from_empty_rows;
    }
};
```