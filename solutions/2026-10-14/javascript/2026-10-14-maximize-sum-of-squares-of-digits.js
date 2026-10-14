// /**
//  * @param {number} num
//  * @param {number} sum
//  * @return {string}
//  */
// /*
// Problem Summary:
// Find a positive integer 'n' with 'num' digits and a digit sum of 'sum' that maximizes the sum of squares of its digits.
// If multiple such integers exist, return the lexicographically largest one. If none exists, return an empty string.
//
// Link: https://leetcode.com/problems/maximize-sum-of-squares-of-digits/
//
// Approach:
// To maximize the sum of squares of digits, we should try to make the digits as large as possible, prioritizing the most significant digits (leftmost). This is a greedy approach.
// We can construct the number from left to right. For each digit position, we try to place the largest possible digit (up to 9) such that the remaining sum of digits can still be achieved with the remaining number of positions.
//
// Let's say we are at the i-th digit position (from left, 0-indexed) and we have 'remaining_sum' and 'remaining_digits' to fill.
// For the current digit, we can try values from 9 down to 0.
// If we place digit 'd' at the current position, we must ensure that:
// 1. The remaining sum ('remaining_sum' - d) is non-negative.
// 2. The remaining sum ('remaining_sum' - d) can be formed by 'remaining_digits' - 1 positions. The minimum sum for 'k' digits is 0 (all zeros), and the maximum sum for 'k' digits is k * 9. So, we must have 0 <= ('remaining_sum' - d) <= ('remaining_digits' - 1) * 9.
//
// We iterate from the first digit to the last. For each position, we find the largest digit 'd' that satisfies these conditions.
//
// Initial checks:
// - If sum > num * 9 (maximum possible sum for 'num' digits), then no such number exists.
// - If sum == 0 and num > 1, no such number exists (since it must be positive, first digit cannot be 0, and if num=1, sum=0 is not possible as it's a positive integer). If sum==0 and num==1, it's also impossible for a positive integer.
// - The problem states positive integers. So a single digit number with sum 0 is not allowed.
//
// Edge case: If num = 1, the only digit must be sum. If sum is 0-9, this is valid.
//
// Greedy construction:
// We maintain `remaining_sum` and `remaining_digits_to_fill`.
// For each digit position from left to right:
//   Iterate `d` from 9 down to 0.
//   Check if `remaining_sum - d >= 0`.
//   Check if `remaining_sum - d <= (remaining_digits_to_fill - 1) * 9`.
//   If both conditions are met, this digit `d` is the largest possible for this position. Append `d` to our result string, subtract `d` from `remaining_sum`, and decrement `remaining_digits_to_fill`. Break the inner loop and move to the next digit position.
//
// After constructing the string, we need to handle the case where the resulting number might have leading zeros if `num > 1` and `sum` is small, but the greedy approach naturally handles this by trying to put larger digits first. The lexicographically largest is achieved by prioritizing larger digits in higher place values.
//
// Example 1: num = 2, sum = 3
// Initially: remaining_sum = 3, remaining_digits_to_fill = 2
//
// Position 1 (most significant digit):
//   Try d=9: 3-9 < 0. Invalid.
//   Try d=8: 3-8 < 0. Invalid.
//   ...
//   Try d=3: 3-3 = 0. remaining_digits_to_fill - 1 = 1. Max sum for 1 digit is 1*9=9. 0 <= 9. Valid.
//   Append '3'. result = "3". remaining_sum = 0. remaining_digits_to_fill = 1.
//
// Position 2:
//   remaining_sum = 0, remaining_digits_to_fill = 1
//   Try d=9: 0-9 < 0. Invalid.
//   ...
//   Try d=0: 0-0 = 0. remaining_digits_to_fill - 1 = 0. Max sum for 0 digits is 0. 0 <= 0. Valid.
//   Append '0'. result = "30". remaining_sum = 0. remaining_digits_to_fill = 0.
//
// Final result: "30"
//
// Example 2: num = 2, sum = 17
// Initially: remaining_sum = 17, remaining_digits_to_fill = 2
//
// Position 1:
//   Try d=9: 17-9 = 8. remaining_digits_to_fill - 1 = 1. Max sum for 1 digit is 9. 8 <= 9. Valid.
//   Append '9'. result = "9". remaining_sum = 8. remaining_digits_to_fill = 1.
//
// Position 2:
//   remaining_sum = 8, remaining_digits_to_fill = 1
//   Try d=9: 8-9 < 0. Invalid.
//   Try d=8: 8-8 = 0. remaining_digits_to_fill - 1 = 0. Max sum for 0 digits is 0. 0 <= 0. Valid.
//   Append '8'. result = "98". remaining_sum = 0. remaining_digits_to_fill = 0.
//
// Final result: "98"
//
// Example 3: num = 1, sum = 10
// Initially: remaining_sum = 10, remaining_digits_to_fill = 1
//
// Position 1:
//   Try d=9: 10-9 = 1. remaining_digits_to_fill - 1 = 0. Max sum for 0 digits is 0. 1 <= 0 is false. Invalid.
//   Try d=8: 10-8 = 2. remaining_digits_to_fill - 1 = 0. 2 <= 0 is false. Invalid.
//   ...
//   Try d=0: 10-0 = 10. remaining_digits_to_fill - 1 = 0. 10 <= 0 is false. Invalid.
//
// No valid digit found. The initial checks should catch this.
// sum = 10, num = 1. Max possible sum is 1 * 9 = 9. 10 > 9. So, return "".
//
// Initial Checks:
// 1. If `sum > num * 9`, return `""`.
// 2. If `sum == 0`, return `""` (since the number must be positive). This covers cases like num=2, sum=0.
//
// Time Complexity Analysis:
// The algorithm iterates through `num` digit positions. For each position, it iterates from 9 down to 0, which is a constant time of 10 operations.
// Therefore, the time complexity is O(num * 10), which simplifies to O(num).
//
// Space Complexity Analysis:
// We store the resulting number in a string. The maximum length of this string is `num`.
// Therefore, the space complexity is O(num) for storing the result.
// */
//
// // /**
// //  * @param {number} num
// //  * @param {number} sum
// //  * @return {string}
// //  */
// const maximizeSumOfSquaresOfDigits = (num, sum) => {
//     // Initial checks for impossible scenarios
//     // If the sum of digits required is greater than the maximum possible sum for 'num' digits (num * 9),
//     // or if the sum is 0 (a positive integer cannot have a sum of digits of 0), no solution exists.
//     if (sum > num * 9 || sum === 0) {
//         return "";
//     }
//
//     // Initialize an array to store the digits of the resulting number.
//     // The length is 'num' because we need exactly 'num' digits.
//     const digits = new Array(num).fill(0);
//
//     // Variables to keep track of the remaining sum of digits to be distributed
//     // and the number of digit positions left to fill.
//     let remainingSum = sum;
//     let digitsToFill = num;
//
//     // Iterate through each digit position from left to right (most significant to least significant).
//     for (let i = 0; i < num; i++) {
//         // For the current digit position, try to place the largest possible digit from 9 down to 0.
//         for (let d = 9; d >= 0; d--) {
//             // Check if placing digit 'd' is valid:
//             // 1. The remaining sum after placing 'd' must be non-negative.
//             // 2. The remaining sum must be achievable by the remaining number of digit positions.
//             //    The maximum sum that can be formed by (digitsToFill - 1) digits is (digitsToFill - 1) * 9.
//             //    So, (remainingSum - d) must be less than or equal to this maximum.
//             //    Also, the remaining sum must be at least 0. This is implicitly handled by the previous check.
//             if (remainingSum - d >= 0 && remainingSum - d <= (digitsToFill - 1) * 9) {
//                 // If valid, place digit 'd' at the current position.
//                 digits[i] = d;
//                 // Update the remaining sum and the count of digits left to fill.
//                 remainingSum -= d;
//                 digitsToFill--;
//                 // Break the inner loop to move to the next digit position,
//                 // as we have found the largest possible digit for the current position.
//                 break;
//             }
//         }
//     }
//
//     // After filling all digit positions, convert the array of digits into a string.
//     // The join('') method concatenates all elements of the array into a single string.
//     return digits.join('');
// };
//
// // Example Usage:
// // console.log(maximizeSumOfSquaresOfDigits(2, 3));  // Output: "30"
// // console.log(maximizeSumOfSquaresOfDigits(2, 17)); // Output: "98"
// // console.log(maximizeSumOfSquaresOfDigits(1, 10)); // Output: ""
// // console.log(maximizeSumOfSquaresOfDigits(3, 27)); // Output: "999"
// // console.log(maximizeSumOfSquaresOfDigits(3, 1));  // Output: "100"
// // console.log(maximizeSumOfSquaresOfDigits(3, 0));  // Output: "" (sum cannot be 0 for a positive integer)
// // console.log(maximizeSumOfSquaresOfDigits(1, 0));  // Output: "" (sum cannot be 0 for a positive integer)
// // console.log(maximizeSumOfSquaresOfDigits(1, 5));  // Output: "5"
// // console.log(maximizeSumOfSquaresOfDigits(4, 10)); // Output: "9100"
//
// // Function to calculate sum of squares for testing purposes (not part of the solution to be returned)
// // const calculateScore = (nStr) => {
// //     let score = 0;
// //     for (const digitChar of nStr) {
// //         const digit = parseInt(digitChar, 10);
// //         score += digit * digit;
// //     }
// //     return score;
// // };
// //
// // const test = (num, sum) => {
// //     const result = maximizeSumOfSquaresOfDigits(num, sum);
// //     console.log(`num: ${num}, sum: ${sum} -> Result: "${result}"`);
// //     if (result !== "") {
// //         // Verification logic can be added here if needed, e.g., checking num digits and sum.
// //         let actualSum = 0;
// //         for (const char of result) {
// //             actualSum += parseInt(char);
// //         }
// //         console.log(`  Digits: ${result.length}, Actual Sum: ${actualSum}, Score: ${calculateScore(result)}`);
// //     }
// // };
// //
// // test(2, 3);
// // test(2, 17);
// // test(1, 10);
// // test(3, 27);
// // test(3, 1);
// // test(3, 0);
// // test(1, 0);
// // test(1, 5);
// // test(4, 10);
// // test(10, 90); // Should be 9999999999
// // test(10, 1);  // Should be 1000000000
// // test(5, 12);  // Expected: 93000 -> Score 81 + 9 = 90
// //               // Try 84000 -> Score 64 + 16 = 80
// //               // Try 75000 -> Score 49 + 25 = 74
// //               // Try 66000 -> Score 36 + 36 = 72
// //               // Try 57000 -> Score 25 + 49 = 74
// //               // Try 48000 -> Score 16 + 64 = 80
// //               // Try 39000 -> Score 9 + 81 = 90
// //               // The largest is 93000.
// // test(5, 12); // Output: "93000"
// // test(10, 5); // Output: "5000000000"
//
// // test(2 * 10**5, 2 * 10**6); // Max possible
// // test(2 * 10**5, 1); // Min possible sum
// // test(2 * 10**5, 2 * 10**6 + 1); // Impossible sum
//
// /**
//  * @param {number} num
//  * @param {number} sum
//  * @return {string}
//  */
const maximizeSumOfSquaresOfDigits = (num, sum) => {
    // Initial checks for impossible scenarios.
    // A number with 'num' digits can have a maximum sum of 'num * 9'. If 'sum' exceeds this, no solution exists.
    // Also, a positive integer cannot have a sum of digits equal to 0.
    if (sum > num * 9 || sum === 0) {
        return "";
    }

    // Array to store the digits of the resulting number. Initialized with zeros.
    const digits = new Array(num).fill(0);

    // 'remainingSum' tracks the sum of digits still needed.
    // 'digitsToFill' tracks the number of digit positions left to populate.
    let remainingSum = sum;
    let digitsToFill = num;

    // Construct the number from left to right (most significant digit to least significant).
    for (let i = 0; i < num; i++) {
        // For the current digit position, we try to place the largest possible digit ('d') from 9 down to 0.
        // This greedy approach ensures we maximize the number lexicographically for a given score.
        for (let d = 9; d >= 0; d--) {
            // Check if placing digit 'd' at the current position is valid.
            // It's valid if:
            // 1. The sum of remaining digits ('remainingSum - d') is non-negative.
            // 2. The sum of remaining digits ('remainingSum - d') can be formed by the remaining 'digitsToFill - 1' positions.
            //    The maximum sum achievable by 'k' digits is k * 9.
            //    So, ('remainingSum - d') must be less than or equal to ('digitsToFill - 1') * 9.
            if (remainingSum - d >= 0 && remainingSum - d <= (digitsToFill - 1) * 9) {
                // If the digit 'd' is valid for this position:
                digits[i] = d;              // Assign 'd' to the current digit position.
                remainingSum -= d;          // Subtract 'd' from the total sum needed.
                digitsToFill--;             // Decrement the count of digits yet to be filled.
                break;                      // Move to the next digit position since we've found the largest possible digit.
            }
        }
    }

    // Convert the array of digits into a string and return it.
    return digits.join('');
};
