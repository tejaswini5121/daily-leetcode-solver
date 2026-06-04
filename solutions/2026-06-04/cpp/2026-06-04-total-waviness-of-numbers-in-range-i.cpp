```cpp
/*
Problem Summary: Calculate the total sum of waviness for all numbers in a given inclusive range [num1, num2]. Waviness of a number is the count of its peaks and valleys, where peaks are digits strictly greater than their neighbors and valleys are digits strictly less than their neighbors. The first and last digits cannot be peaks or valleys. Numbers with fewer than 3 digits have a waviness of 0.
Link: https://leetcode.com/problems/total-waviness-of-numbers-in-range-i/

Approach:
The problem involves iterating through a range of numbers and calculating the waviness for each. Since the range is up to 10^5, a direct iteration is feasible.
For each number, we can convert it to a string or extract its digits to easily access neighbors.
A number has waviness 0 if it has less than 3 digits.
For numbers with 3 or more digits, we iterate through the digits from the second digit to the second-to-last digit. For each digit at index `i`, we check if it's a peak (digit[i] > digit[i-1] and digit[i] > digit[i+1]) or a valley (digit[i] < digit[i-1] and digit[i] < digit[i+1]). If it is, we increment the waviness count for that number.
Finally, we sum up the waviness of all numbers in the range.

Time Complexity Analysis:
The range of numbers is from num1 to num2. Let N = num2 - num1 + 1 be the number of elements in the range.
For each number, converting to a string takes O(log10(num)) time, where num is the number itself.
Iterating through the digits of a number to check for peaks and valleys also takes O(log10(num)) time.
Since num <= 10^5, log10(num) is at most 6.
Therefore, the total time complexity is approximately O((num2 - num1 + 1) * log10(num2)). In the worst case, num1 = 1 and num2 = 10^5, so it's roughly O(10^5 * 6), which is efficient enough.

Space Complexity Analysis:
We convert each number to a string to process its digits. The space required for the string representation of a number is O(log10(num)). Since this is done for each number iteratively and the space is reused, the auxiliary space complexity is O(log10(max_num)), which is O(log10(10^5)) or O(6) in this case. This is constant space.
*/

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    /**
     * Calculates the waviness of a single number.
     * Waviness is the count of peaks and valleys in the digits of the number.
     * A digit is a peak if it's strictly greater than both neighbors.
     * A digit is a valley if it's strictly less than both neighbors.
     * The first and last digits cannot be peaks or valleys.
     * Numbers with fewer than 3 digits have a waviness of 0.
     * @param num The number for which to calculate waviness.
     * @return The waviness of the number.
     */
    int calculateWaviness(int num) {
        // Convert the number to a string to easily access digits.
        std::string s = std::to_string(num);
        int n = s.length();

        // Numbers with fewer than 3 digits have a waviness of 0.
        if (n < 3) {
            return 0;
        }

        int waviness = 0;
        // Iterate through the digits from the second to the second-to-last.
        // The first and last digits cannot be peaks or valleys.
        for (int i = 1; i < n - 1; ++i) {
            int prev_digit = s[i - 1] - '0';
            int current_digit = s[i] - '0';
            int next_digit = s[i + 1] - '0';

            // Check for a peak: current digit is strictly greater than both neighbors.
            if (current_digit > prev_digit && current_digit > next_digit) {
                waviness++;
            }
            // Check for a valley: current digit is strictly less than both neighbors.
            else if (current_digit < prev_digit && current_digit < next_digit) {
                waviness++;
            }
        }
        return waviness;
    }

    /**
     * Calculates the total waviness for all numbers in the inclusive range [num1, num2].
     * @param num1 The starting number of the range.
     * @param num2 The ending number of the range.
     * @return The total sum of waviness for all numbers in the range.
     */
    int totalWaviness(int num1, int num2) {
        int total_waviness_sum = 0;
        // Iterate through each number in the given range [num1, num2].
        for (int num = num1; num <= num2; ++num) {
            // Add the waviness of the current number to the total sum.
            total_waviness_sum += calculateWaviness(num);
        }
        return total_waviness_sum;
    }
};

// Example Usage:
// int main() {
//     Solution sol;
//     std::cout << "Example 1: num1 = 120, num2 = 130 -> Output: " << sol.totalWaviness(120, 130) << std::endl; // Expected: 3
//     std::cout << "Example 2: num1 = 198, num2 = 202 -> Output: " << sol.totalWaviness(198, 202) << std::endl; // Expected: 3
//     std::cout << "Example 3: num1 = 4848, num2 = 4848 -> Output: " << sol.totalWaviness(4848, 4848) << std::endl; // Expected: 2
//     std::cout << "Example 4: num1 = 1, num2 = 10 -> Output: " << sol.totalWaviness(1, 10) << std::endl; // Expected: 0
//     std::cout << "Example 5: num1 = 99, num2 = 101 -> Output: " << sol.totalWaviness(99, 101) << std::endl; // Expected: 1 (for 101, 0 is a valley)
//     return 0;
// }
```