```java
// Problem: Unique 3-Digit Even Numbers
// Link: https://leetcode.com/problems/unique-3-digit-even-numbers/
// Approach:
// We need to form three-digit even numbers using the given digits.
// An even number must end with an even digit (0, 2, 4, 6, 8).
// The first digit cannot be 0.
// We can use a frequency map (or an array of size 10) to count the occurrences of each digit.
// We then iterate through all possible combinations of three digits:
// - The last digit (hundreds place) must be an even digit from the input array and not 0.
// - The middle digit (tens place) can be any digit from the input array.
// - The first digit (units place) can be any digit from the input array.
// For each combination, we check if we have enough occurrences of each digit in our frequency map.
// If a valid number is formed, we add it to a HashSet to ensure uniqueness.
// Finally, we return the size of the HashSet.
//
// To optimize, instead of generating all combinations and checking validity,
// we can directly iterate through all possible 3-digit even numbers and check if they can be formed.
// A 3-digit even number `abc` can be formed if:
// 1. `a` (hundreds digit) is not 0.
// 2. `c` (units digit) is even.
// 3. The count of digit `a` in the input `digits` is at least 1.
// 4. The count of digit `b` in the input `digits` is at least 1.
// 5. The count of digit `c` in the input `digits` is at least 1.
// If `a`, `b`, and `c` are all the same, we need the count of that digit to be at least 3.
// If two digits are the same (e.g., `a == b`), we need the count of that digit to be at least 2.
//
// We can use a frequency array `counts` of size 10 to store the occurrences of each digit in `digits`.
// Then, we iterate from 100 to 999. For each number `i`:
// - Extract its digits: hundreds `h`, tens `t`, units `u`.
// - Check if `u` is even.
// - Check if `h` is not 0.
// - Check if we have enough counts for `h`, `t`, and `u` from the `counts` array.
//   - If `h == t == u`, we need `counts[h] >= 3`.
//   - If `h == t` and `t != u`, we need `counts[h] >= 2`.
//   - If `h == u` and `h != t`, we need `counts[h] >= 2`.
//   - If `t == u` and `t != h`, we need `counts[t] >= 2`.
//   - If `h`, `t`, and `u` are distinct, we need `counts[h] >= 1`, `counts[t] >= 1`, and `counts[u] >= 1`.
// If all conditions are met, increment a result counter.
//
// Time Complexity: O(1) because the range of numbers to check (100-999) is constant, and operations inside the loop are constant time.
// Space Complexity: O(1) because we only use a frequency array of fixed size 10.
import java.util.HashSet;
import java.util.Set;

class Solution {
    /**
     * Calculates the number of unique three-digit even numbers that can be formed using the given digits.
     *
     * @param digits An array of digits.
     * @return The count of unique three-digit even numbers.
     */
    public int countEven(int[] digits) {
        // Frequency array to store the count of each digit from 0 to 9.
        int[] counts = new int[10];
        for (int digit : digits) {
            counts[digit]++;
        }

        // Set to store unique valid three-digit even numbers.
        // Although not strictly necessary for counting, it ensures uniqueness if we were to list them.
        // For this problem, a simple counter is sufficient.
        int uniqueNumbersCount = 0;

        // Iterate through all possible three-digit numbers (100 to 999).
        for (int num = 100; num <= 999; num++) {
            // Extract digits of the current number.
            int hundredsDigit = num / 100;
            int tensDigit = (num / 10) % 10;
            int unitsDigit = num % 10;

            // Check if the number is even (units digit is even).
            if (unitsDigit % 2 == 0) {
                // Check if we have enough occurrences of each digit to form this number.

                // Case 1: All three digits are the same.
                if (hundredsDigit == tensDigit && tensDigit == unitsDigit) {
                    if (counts[hundredsDigit] >= 3) {
                        uniqueNumbersCount++;
                    }
                }
                // Case 2: Two digits are the same.
                else if (hundredsDigit == tensDigit) { // hundreds == tens, units is different
                    if (counts[hundredsDigit] >= 2 && counts[unitsDigit] >= 1) {
                        uniqueNumbersCount++;
                    }
                } else if (hundredsDigit == unitsDigit) { // hundreds == units, tens is different
                    if (counts[hundredsDigit] >= 2 && counts[tensDigit] >= 1) {
                        uniqueNumbersCount++;
                    }
                } else if (tensDigit == unitsDigit) { // tens == units, hundreds is different
                    if (counts[tensDigit] >= 2 && counts[hundredsDigit] >= 1) {
                        uniqueNumbersCount++;
                    }
                }
                // Case 3: All three digits are distinct.
                else {
                    if (counts[hundredsDigit] >= 1 && counts[tensDigit] >= 1 && counts[unitsDigit] >= 1) {
                        uniqueNumbersCount++;
                    }
                }
            }
        }

        return uniqueNumbersCount;
    }
}
```