// Summary: Find all possible times on a binary watch given the number of turned-on LEDs.
// Link: https://leetcode.com/problems/binary-watch/
// Approach:
// The problem can be solved by iterating through all possible hour and minute combinations and checking if the total number of set bits (LEDs turned on) in their binary representations equals the given `turnedOn`.
//
// The hours are represented by 4 LEDs, so the possible hour values range from 0 to 11.
// The minutes are represented by 6 LEDs, so the possible minute values range from 0 to 59.
//
// We can use a helper function `countSetBits` to count the number of set bits in an integer.
// For each possible hour `h` from 0 to 11:
//   For each possible minute `m` from 0 to 59:
//     Calculate the total number of set bits: `totalBits = countSetBits(h) + countSetBits(m)`.
//     If `totalBits === turnedOn`:
//       Format the time as "h:mm" (handling leading zeros for minutes) and add it to the result list.
//
// The `countSetBits` function can be implemented by repeatedly taking the number modulo 2 and dividing by 2, or by using bitwise operations. A more efficient way for fixed bit lengths (like 4 for hours and 6 for minutes) would be to iterate through the bits directly.
//
// Alternative approach (Backtracking/Combinations):
// This problem can also be framed as finding combinations. We need to choose `h_bits` from the 4 hour LEDs and `m_bits` from the 6 minute LEDs such that `h_bits + m_bits = turnedOn`.
//
// For each possible number of bits for the hour (`h_bits` from 0 to `turnedOn`):
//   Let `m_bits = turnedOn - h_bits`.
//   If `h_bits <= 4` and `m_bits <= 6`:
//     Generate all hour values with exactly `h_bits` set bits (from 0 to 11).
//     Generate all minute values with exactly `m_bits` set bits (from 0 to 59).
//     Combine each hour with each minute and add to the result.
//
// The combination generation can be done recursively.
//
// For this solution, we'll use the simpler brute-force iteration through all possible hours and minutes, and a `countSetBits` helper.
//
// Time Complexity: O(1)
// The number of possible hours is fixed (12: 0-11) and the number of possible minutes is fixed (60: 0-59). The `countSetBits` function takes constant time for fixed-size integers (e.g., 32 bits). Therefore, the total number of operations is constant.
//
// Space Complexity: O(1)
// The space used is primarily for storing the result list. In the worst case, `turnedOn` can be up to 10. The maximum number of possible times is limited, and the number of valid times for a given `turnedOn` is also bounded. For instance, if `turnedOn` is 0, there's only one time ("0:00"). If `turnedOn` is 10, there are also a limited number of combinations. The output list size is not dependent on the input size in a way that grows indefinitely.
//
// NOTE: The problem states "0 <= turnedOn <= 10".
// Hours have 4 bits, minutes have 6 bits. Total 10 bits.
// So `turnedOn` can range from 0 (all bits off) to 10 (all bits on).
//
// Let's refine the countSetBits for clarity and efficiency within the context of fixed bits.
// For hours (0-11), 4 bits are sufficient.
// For minutes (0-59), 6 bits are sufficient.
//
// We can use a bit manipulation trick to count set bits efficiently for small numbers.
// `n & (n - 1)` unsets the least significant set bit.
//
// Example: n = 6 (binary 110)
// n-1 = 5 (binary 101)
// n & (n-1) = 4 (binary 100) - one bit unset
//
// So, `countSetBits(n)` can be implemented by repeatedly doing `n = n & (n-1)` and incrementing a counter until `n` becomes 0.

/**
 * @param {number} turnedOn
 * @return {string[]}
 */
var readBinaryWatch = function(turnedOn) {
    // Helper function to count the number of set bits (1s) in an integer.
    // This is equivalent to counting the number of LEDs turned on for a given hour or minute.
    const countSetBits = (n) => {
        let count = 0;
        while (n > 0) {
            // n & (n - 1) unsets the least significant set bit.
            // We repeat this until n becomes 0, counting how many times we did it.
            n &= (n - 1);
            count++;
        }
        return count;
    };

    const result = []; // Array to store all possible valid times.

    // Iterate through all possible hour values (0 to 11).
    for (let h = 0; h < 12; h++) {
        // Iterate through all possible minute values (0 to 59).
        for (let m = 0; m < 60; m++) {
            // Calculate the total number of LEDs turned on for the current hour and minute.
            // `countSetBits(h)` gives the number of lit LEDs for the hour.
            // `countSetBits(m)` gives the number of lit LEDs for the minute.
            const totalLights = countSetBits(h) + countSetBits(m);

            // If the total number of lit LEDs matches the input `turnedOn`,
            // then this combination of hour and minute is a valid time.
            if (totalLights === turnedOn) {
                // Format the time string.
                // Hours should not have leading zeros (e.g., "1:00" instead of "01:00").
                // Minutes must have two digits, with a leading zero if necessary (e.g., "10:02" instead of "10:2").
                // `m < 10 ? '0' + m : m` ensures the minute part is always two digits.
                const timeString = `${h}:${m < 10 ? '0' + m : m}`;
                result.push(timeString);
            }
        }
    }

    // Return the list of all valid times found.
    return result;
};
