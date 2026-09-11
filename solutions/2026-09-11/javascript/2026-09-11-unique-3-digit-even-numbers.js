// Summary: Find the count of distinct three-digit even numbers formed from a given array of digits.
// Link: https://leetcode.com/problems/unique-3-digit-even-numbers/
// Approach:
// 1. Count the frequency of each digit in the input array using a frequency map (or an array of size 10).
// 2. Iterate through all possible hundreds digits (1-9, to avoid leading zeros).
// 3. For each hundreds digit, iterate through all possible tens digits (0-9).
// 4. For each pair of hundreds and tens digits, iterate through all possible units digits that make the number even (0, 2, 4, 6, 8).
// 5. For each potential number (hundreds, tens, units), check if the required digits are available in sufficient quantities based on the frequency map.
// 6. If all digits are available, form the number and add it to a Set to ensure uniqueness.
// 7. The final answer is the size of the Set.
//
// Time Complexity: O(10 * 10 * 5 * 10) which simplifies to O(1) because the input size is small and fixed (digits length up to 10, digits 0-9).
// The outer loops iterate through hundreds (1-9), tens (0-9), and units (0,2,4,6,8).
// Inside these loops, we check the frequency of digits, which takes constant time.
// Adding to a Set takes average O(1) time.
// Space Complexity: O(1) because the frequency map (or array) will store at most 10 counts, and the Set will store at most the total number of unique 3-digit even numbers possible, which is also a constant bound.

/**
 * @param {number[]} digits
 * @return {number}
 */
const countEven = function(digits) {
    // Frequency map to store the count of each digit.
    // `counts[i]` will store the number of occurrences of digit `i`.
    const counts = new Array(10).fill(0);
    for (const digit of digits) {
        counts[digit]++;
    }

    // A Set to store the unique 3-digit even numbers found.
    const uniqueNumbers = new Set();

    // Iterate through all possible hundreds digits (from 1 to 9 to avoid leading zeros).
    for (let i = 1; i <= 9; i++) {
        // Check if the current digit `i` is available.
        if (counts[i] > 0) {
            // Decrement the count of digit `i` to "use" it for the hundreds place.
            counts[i]--;

            // Iterate through all possible tens digits (from 0 to 9).
            for (let j = 0; j <= 9; j++) {
                // Check if the current digit `j` is available.
                if (counts[j] > 0) {
                    // Decrement the count of digit `j` to "use" it for the tens place.
                    counts[j]--;

                    // Iterate through all possible units digits that make the number even (0, 2, 4, 6, 8).
                    for (let k = 0; k <= 8; k += 2) {
                        // Check if the current digit `k` is available.
                        if (counts[k] > 0) {
                            // Decrement the count of digit `k` to "use" it for the units place.
                            counts[k]--;

                            // Form the 3-digit number.
                            const num = i * 100 + j * 10 + k;
                            // Add the formed number to the Set. Sets automatically handle uniqueness.
                            uniqueNumbers.add(num);

                            // Increment the count of digit `k` back (backtrack) to explore other possibilities.
                            counts[k]++;
                        }
                    }
                    // Increment the count of digit `j` back (backtrack).
                    counts[j]++;
                }
            }
            // Increment the count of digit `i` back (backtrack).
            counts[i]++;
        }
    }

    // The size of the Set is the count of distinct 3-digit even numbers.
    return uniqueNumbers.size;
};
