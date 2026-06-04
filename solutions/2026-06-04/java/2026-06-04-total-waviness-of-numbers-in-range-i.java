```java
/*
 * Problem Summary:
 * Calculate the total sum of "waviness" for all numbers within a given inclusive range [num1, num2].
 * Waviness of a number is defined by the count of its peaks and valleys (digits strictly greater/less than both neighbors),
 * excluding the first and last digits. Numbers with fewer than 3 digits have a waviness of 0.
 *
 * Problem Link:
 * https://leetcode.com/problems/total-waviness-of-numbers-in-range-i/
 *
 * Approach Explanation:
 * The problem requires iterating through each number in the given range [num1, num2] and calculating its waviness.
 * For each number, we convert it to a string to easily access its digits.
 * Then, we iterate through the digits from the second digit up to the second-to-last digit.
 * For each middle digit, we check if it forms a peak (greater than both neighbors) or a valley (less than both neighbors).
 * If it does, we increment the waviness count for that number.
 * Finally, we sum up the waviness of all numbers in the range.
 *
 * Time Complexity Analysis:
 * Let N be the range size (num2 - num1 + 1).
 * Let D be the maximum number of digits in the numbers within the range. For num2 <= 10^5, D is at most 6.
 * The outer loop iterates N times. Inside the loop, converting a number to a string takes O(D) time.
 * The inner loop iterates through the digits, which also takes O(D) time.
 * Therefore, the overall time complexity is O(N * D). Since D is very small and bounded (log10(max_num)), it can be considered a constant factor, making the complexity effectively O(N).
 *
 * Space Complexity Analysis:
 * We use a string to store the digits of each number. The space for this string is O(D), where D is the number of digits.
 * Since D is small and bounded, the space complexity is O(1) (constant).
 */
class Solution {
    /**
     * Calculates the total waviness for all numbers in the range [num1, num2].
     *
     * @param num1 The start of the inclusive range.
     * @param num2 The end of the inclusive range.
     * @return The total sum of waviness for all numbers in the range.
     */
    public int totalWaviness(int num1, int num2) {
        int totalWavinessSum = 0; // Initialize the sum of waviness for the entire range

        // Iterate through each number in the inclusive range [num1, num2]
        for (int number = num1; number <= num2; number++) {
            // Calculate the waviness for the current number and add it to the total sum
            totalWavinessSum += calculateWaviness(number);
        }

        return totalWavinessSum; // Return the accumulated total waviness
    }

    /**
     * Calculates the waviness of a single number.
     * Waviness is the count of peaks and valleys, excluding the first and last digits.
     * A digit is a peak if it's strictly greater than both neighbors.
     * A digit is a valley if it's strictly less than both neighbors.
     * Numbers with fewer than 3 digits have a waviness of 0.
     *
     * @param number The number for which to calculate waviness.
     * @return The waviness of the number.
     */
    private int calculateWaviness(int number) {
        // Convert the number to a string to easily access its digits
        String s = String.valueOf(number);
        int n = s.length(); // Get the number of digits

        // Numbers with fewer than 3 digits have a waviness of 0
        if (n < 3) {
            return 0;
        }

        int waviness = 0; // Initialize waviness for the current number

        // Iterate through the digits from the second digit (index 1) up to the second-to-last digit (index n-2)
        // The first and last digits cannot be peaks or valleys by definition.
        for (int i = 1; i < n - 1; i++) {
            // Get the current digit and its neighbors as integers
            int prevDigit = s.charAt(i - 1) - '0';
            int currentDigit = s.charAt(i) - '0';
            int nextDigit = s.charAt(i + 1) - '0';

            // Check if the current digit is a peak: strictly greater than both neighbors
            if (currentDigit > prevDigit && currentDigit > nextDigit) {
                waviness++; // Increment waviness if it's a peak
            }
            // Check if the current digit is a valley: strictly less than both neighbors
            else if (currentDigit < prevDigit && currentDigit < nextDigit) {
                waviness++; // Increment waviness if it's a valley
            }
        }

        return waviness; // Return the calculated waviness for this number
    }
}
```