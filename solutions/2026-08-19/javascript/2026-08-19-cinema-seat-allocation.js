// Summary: Calculate the maximum number of 4-person groups that can be seated in a cinema with n rows and 10 seats per row, given a list of reserved seats.
// Link: https://leetcode.com/problems/cinema-seat-allocation/
// Approach:
// The problem can be solved by iterating through the unique rows that have reserved seats. For each such row, we determine how many groups can be accommodated.
// Rows with no reserved seats can always accommodate 2 groups (seats 2-5 and seats 6-9).
// For rows with reserved seats, we need to check the availability of the three potential seating blocks:
// 1. Seats 2, 3, 4, 5
// 2. Seats 4, 5, 6, 7
// 3. Seats 6, 7, 8, 9
// We can represent the reserved seats for a given row using a bitmask or by checking individual seats. Since there are only 10 seats and a limited number of blocks, checking individual seats is efficient enough.
// We can use a map to store the reserved seats for each row, where the key is the row number and the value is a set of reserved seat numbers for that row.
//
// For each row with reserved seats:
// - Check if seats 2, 3, 4, 5 are all available.
// - Check if seats 4, 5, 6, 7 are all available.
// - Check if seats 6, 7, 8, 9 are all available.
//
// Based on availability:
// - If seats 2-5 and 6-9 are available, we can seat 2 groups.
// - If only seats 2-5 is available and 6-9 is not, and 4-7 is not, we can seat 1 group.
// - If only seats 4-7 is available and neither 2-5 nor 6-9 are fully available, we can seat 1 group.
// - If only seats 6-9 is available and 2-5 is not, and 4-7 is not, we can seat 1 group.
//
// More precisely, for a row with reserved seats:
// Let `left_available` be true if seats 2, 3, 4, 5 are free.
// Let `mid_available` be true if seats 4, 5, 6, 7 are free.
// Let `right_available` be true if seats 6, 7, 8, 9 are free.
//
// - If `left_available` and `right_available`, we can seat 2 groups.
// - Else if `left_available` or `mid_available` or `right_available`, we can seat 1 group.
//
// The total number of groups will be (n - number of rows with reserved seats) * 2 (for the empty rows) + the sum of groups that can be seated in rows with reservations.
//
// Time Complexity: O(R), where R is the number of reserved seats. We iterate through the reserved seats once to populate the map. Then, we iterate through the unique rows in the map. In the worst case, each reserved seat is in a different row, but the number of distinct rows is at most R. The operations within the loop for each row are constant time.
// Space Complexity: O(U), where U is the number of unique rows with reserved seats. This is the space used by the map to store reserved seats for each row. In the worst case, U can be equal to R if each reserved seat is in a different row.
var maxNumberOfFamilies = function(n, reservedSeats) {
    // Map to store reserved seats for each row.
    // Key: row number, Value: Set of reserved seat numbers.
    const reservedMap = new Map();

    // Populate the map with reserved seats.
    for (const [row, seat] of reservedSeats) {
        if (!reservedMap.has(row)) {
            reservedMap.set(row, new Set());
        }
        reservedMap.get(row).add(seat);
    }

    // Variable to store the total number of groups that can be seated.
    let totalGroups = 0;

    // Calculate groups for rows that have no reservations.
    // Each such row can accommodate 2 groups (seats 2-5 and seats 6-9).
    // The number of rows without reservations is n - reservedMap.size.
    totalGroups += (n - reservedMap.size) * 2;

    // Iterate through the rows that have reserved seats.
    for (const [row, reservedSeatsForRow] of reservedMap.entries()) {
        // Check availability of the three potential seating blocks.
        // Block 1: Seats 2, 3, 4, 5
        let leftAvailable = true;
        if (reservedSeatsForRow.has(2) || reservedSeatsForRow.has(3) || reservedSeatsForRow.has(4) || reservedSeatsForRow.has(5)) {
            leftAvailable = false;
        }

        // Block 2: Seats 4, 5, 6, 7
        let midAvailable = true;
        if (reservedSeatsForRow.has(4) || reservedSeatsForRow.has(5) || reservedSeatsForRow.has(6) || reservedSeatsForRow.has(7)) {
            midAvailable = false;
        }

        // Block 3: Seats 6, 7, 8, 9
        let rightAvailable = true;
        if (reservedSeatsForRow.has(6) || reservedSeatsForRow.has(7) || reservedSeatsForRow.has(8) || reservedSeatsForRow.has(9)) {
            rightAvailable = false;
        }

        // Determine how many groups can be seated in this row.
        if (leftAvailable && rightAvailable) {
            // If both the left block (2-5) and the right block (6-9) are available, we can seat 2 groups.
            totalGroups += 2;
        } else if (leftAvailable || midAvailable || rightAvailable) {
            // If at least one of the blocks (left, middle, or right) is available, we can seat 1 group.
            // Note: If both left and right are available, the condition `leftAvailable && rightAvailable` would have already been met,
            // so this `else if` covers cases where only one or two of the blocks are partially or fully available,
            // allowing for at least one group. For instance, if only left is available, we add 1. If only mid is available, we add 1.
            // If only right is available, we add 1.
            totalGroups += 1;
        }
        // If none of the blocks are available, we add 0 groups for this row.
    }

    // Return the total number of groups that can be assigned.
    return totalGroups;
};
```