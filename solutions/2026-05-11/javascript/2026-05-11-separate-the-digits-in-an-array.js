// Problem: Separate the Digits in an Array
// Link: https://leetcode.com/problems/separate-the-digits-in-an-array/
// Approach: Iterate through each number in the input array. For each number, convert it to a string. Then, iterate through the characters of the string, convert each character back to an integer, and push it into the result array.
// Time Complexity: O(N * D), where N is the number of elements in `nums` and D is the maximum number of digits in any number in `nums`. Converting a number to a string and then iterating through its digits takes time proportional to the number of digits.
// Space Complexity: O(M), where M is the total number of digits in all numbers in `nums`. This is the space required to store the `answer` array.

/**
 * @param {number[]} nums
 * @return {number[]}
 */
const separateDigits = (nums) => {
    // Initialize an empty array to store the separated digits.
    const answer = [];

    // Iterate through each number in the input array 'nums'.
    for (const num of nums) {
        // Convert the current number to a string. This allows us to easily access individual digits.
        const numStr = String(num);

        // Iterate through each character (digit) of the string representation of the number.
        for (const digitChar of numStr) {
            // Convert the character digit back to an integer and push it into the 'answer' array.
            answer.push(parseInt(digitChar, 10));
        }
    }

    // Return the array containing all separated digits in the original order.
    return answer;
};
