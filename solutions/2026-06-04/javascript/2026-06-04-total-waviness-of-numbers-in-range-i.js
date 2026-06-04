/**
 * @file LeetCode problem: Total Waviness of Numbers in Range I
 * @link https://leetcode.com/problems/total-waviness-of-numbers-in-range-i/
 * @summary Calculates the sum of waviness for all numbers in a given inclusive range. Waviness of a number is the count of its peaks and valleys.
 *
 * @approach
 * The problem asks for the total waviness across a range of numbers. A brute-force approach is feasible given the constraints (num2 <= 10^5).
 * We can iterate through each number from num1 to num2. For each number, we convert it to a string to easily access its digits.
 * If the number has fewer than 3 digits, its waviness is 0, so we skip it.
 * For numbers with 3 or more digits, we iterate through the digits from the second digit to the second-to-last digit (index 1 to length - 2).
 * For each middle digit, we check if it's a peak (strictly greater than both neighbors) or a valley (strictly less than both neighbors).
 * If it is a peak or a valley, we increment the waviness count for that number.
 * Finally, we sum up the waviness of all numbers in the range.
 *
 * @timeComplexity
 * Let N be the difference between num2 and num1 (num2 - num1 + 1).
 * Let D be the maximum number of digits in num2. D is approximately log10(num2).
 * For each number in the range, we convert it to a string (O(D)) and then iterate through its digits (O(D)).
 * The total time complexity is O(N * D). Given num2 <= 10^5, D is at most 6. So, roughly O(N * 6), which is efficient enough.
 *
 * @spaceComplexity
 * We use a string to represent each number, which takes O(D) space.
 * The total space complexity is O(D) because we only store one number's string representation at a time.
 */

/**
 * @param {number} num1
 * @param {number} num2
 * @return {number}
 */
const totalWaviness = (num1, num2) => {
    let totalWavinessSum = 0;

    // Iterate through each number in the inclusive range [num1, num2]
    for (let i = num1; i <= num2; i++) {
        const numStr = String(i);
        const n = numStr.length;

        // Numbers with fewer than 3 digits have a waviness of 0.
        if (n < 3) {
            continue;
        }

        let currentWaviness = 0;

        // Iterate through the digits from the second to the second-to-last.
        // These are the only digits that can be peaks or valleys.
        for (let j = 1; j < n - 1; j++) {
            const prevDigit = parseInt(numStr[j - 1], 10);
            const currentDigit = parseInt(numStr[j], 10);
            const nextDigit = parseInt(numStr[j + 1], 10);

            // Check for a peak: current digit is strictly greater than both neighbors
            if (currentDigit > prevDigit && currentDigit > nextDigit) {
                currentWaviness++;
            }
            // Check for a valley: current digit is strictly less than both neighbors
            else if (currentDigit < prevDigit && currentDigit < nextDigit) {
                currentWaviness++;
            }
        }
        // Add the waviness of the current number to the total sum
        totalWavinessSum += currentWaviness;
    }

    // Return the total sum of waviness for all numbers in the range
    return totalWavinessSum;
};
