// Problem: Unique 3-Digit Even Numbers
// Problem Description: Given an array of digits, find the number of distinct three-digit even numbers that can be formed.
// Link: https://leetcode.com/problems/unique-3-digit-even-numbers/
//
// Approach:
// We need to form three-digit numbers using the given digits. A three-digit number has a hundreds digit, a tens digit, and a units digit.
// For the number to be even, the units digit must be an even digit (0, 2, 4, 6, 8).
// The hundreds digit cannot be 0.
// Each digit from the input array can be used at most as many times as it appears in the array.
//
// To solve this, we can iterate through all possible combinations of three digits from the input array.
// A more efficient way is to iterate through all possible hundreds digits, tens digits, and units digits that can be formed using the available digits and check the conditions.
//
// 1. Count the frequency of each digit in the input array. This helps in ensuring that we don't use a digit more times than it's available.
// 2. Iterate through all possible digits for the hundreds place (1 to 9).
// 3. For each hundreds digit, iterate through all possible digits for the tens place (0 to 9).
// 4. For each hundreds and tens digit combination, iterate through all possible digits for the units place (0, 2, 4, 6, 8).
// 5. For each potential three-digit number (hundreds, tens, units), check if the digits used are available in the `digits` array based on their counts.
//    - Decrement the count of the hundreds digit.
//    - Decrement the count of the tens digit.
//    - Decrement the count of the units digit.
//    - If all digits are available (counts are non-negative after decrementing), then this is a valid unique three-digit even number. Increment a counter.
//    - **Important**: Backtrack by incrementing the counts of the digits after checking to explore other combinations.
//
// To ensure distinctness, we can use a `std::set` to store the generated numbers. However, since we are systematically iterating through combinations and checking availability, if we correctly manage the counts, each generated valid number will be distinct by its formation process.
//
// A cleaner approach is to use a frequency map for digits and then iterate.
//
// Let's refine the approach:
// 1. Create a frequency map (an array of size 10) to store the counts of each digit in the input `digits` array.
// 2. Initialize a `std::set<int>` called `uniqueNumbers` to store the distinct three-digit even numbers found.
// 3. Iterate through all possible hundreds digits `h` from 1 to 9.
// 4. If the count of digit `h` in the frequency map is greater than 0:
//    a. Decrement the count of `h`.
//    b. Iterate through all possible tens digits `t` from 0 to 9.
//    c. If the count of digit `t` in the frequency map is greater than 0:
//       i. Decrement the count of `t`.
//       ii. Iterate through all possible units digits `u` from {0, 2, 4, 6, 8}.
//       iii. If the count of digit `u` in the frequency map is greater than 0:
//           - Construct the number: `num = h * 100 + t * 10 + u`.
//           - Insert `num` into the `uniqueNumbers` set.
//       iv. Increment the count of `u` (backtrack for tens digit loop).
//    d. Increment the count of `t` (backtrack for hundreds digit loop).
// 5. Increment the count of `h` (backtrack for main loop).
// 6. The final answer is the size of the `uniqueNumbers` set.
//
// This approach ensures:
// - Three-digit numbers are formed.
// - No leading zeros (hundreds digit is 1-9).
// - Even numbers (units digit is 0, 2, 4, 6, 8).
// - Digits are used according to their availability in the input array.
// - Distinct numbers are counted using the `std::set`.
//
// Time Complexity:
// - Building the frequency map: O(N), where N is the length of the `digits` array.
// - The nested loops iterate:
//   - Hundreds digit: 9 possibilities (1-9).
//   - Tens digit: 10 possibilities (0-9).
//   - Units digit: 5 possibilities (0, 2, 4, 6, 8).
//   - Inside the loops, operations like decrementing/incrementing counts and set insertion take roughly constant time on average for integers.
// - Therefore, the overall time complexity is dominated by the nested loops, which is approximately O(9 * 10 * 5) = O(450) operations, which is effectively O(1) as it's a constant number of iterations. The frequency map building is O(N). So, total is O(N + 1) = O(N).
//
// Space Complexity:
// - Frequency map: O(10) = O(1) space for storing counts of digits 0-9.
// - `std::set<int>`: In the worst case, all possible unique 3-digit even numbers can be formed. The maximum number of 3-digit even numbers is 900 (from 100 to 998). However, the number of unique 3-digit even numbers that can be formed depends on the input digits. The maximum size of the set is bounded by the total number of possible 3-digit even numbers (900), so it's O(1).
// - Total space complexity is O(1).

#include <vector>
#include <numeric>
#include <set>
#include <map> // Can use array as map for digit counts

class Solution {
public:
    int countEven(std::vector<int>& digits) {
        // Frequency map to store counts of each digit available.
        // Index i corresponds to digit i.
        std::vector<int> counts(10, 0);
        for (int digit : digits) {
            counts[digit]++;
        }

        // A set to store the distinct 3-digit even numbers found.
        std::set<int> uniqueNumbers;

        // Iterate through all possible digits for the hundreds place.
        // Hundreds digit cannot be 0.
        for (int h = 1; h <= 9; ++h) {
            // Check if the digit 'h' is available.
            if (counts[h] > 0) {
                // Use the digit 'h' for the hundreds place.
                counts[h]--;

                // Iterate through all possible digits for the tens place.
                for (int t = 0; t <= 9; ++t) {
                    // Check if the digit 't' is available.
                    if (counts[t] > 0) {
                        // Use the digit 't' for the tens place.
                        counts[t]--;

                        // Iterate through all possible digits for the units place.
                        // For an even number, the units digit must be even (0, 2, 4, 6, 8).
                        for (int u = 0; u <= 8; u += 2) {
                            // Check if the digit 'u' is available.
                            if (counts[u] > 0) {
                                // Construct the 3-digit number.
                                int number = h * 100 + t * 10 + u;
                                // Insert the formed number into the set.
                                // The set automatically handles uniqueness.
                                uniqueNumbers.insert(number);
                            }
                        }
                        // Backtrack: restore the count for digit 't' for other combinations.
                        counts[t]++;
                    }
                }
                // Backtrack: restore the count for digit 'h' for other combinations.
                counts[h]++;
            }
        }

        // The size of the set is the count of distinct 3-digit even numbers.
        return uniqueNumbers.size();
    }
};
