// Problem Summary: Find the smallest index i in an array where the sum of digits of the element at that index equals the index itself.
// Link: https://leetcode.com/problems/smallest-index-with-digit-sum-equal-to-index/
// Approach: Iterate through the array from left to right (smallest index first). For each element, calculate the sum of its digits. If the sum of digits is equal to the current index, return that index immediately as it's the smallest such index. If the loop completes without finding such an index, return -1.
// Time Complexity: O(N * D), where N is the length of the array and D is the maximum number of digits in any element. The digit sum calculation takes O(D) time for each element. Since constraints are small (nums.length <= 100, nums[i] <= 1000), D is at most 4. Thus, effectively O(N).
// Space Complexity: O(1), as we only use a few variables for iteration and calculations.
const smallestEqual = (nums) => {
    // Helper function to calculate the sum of digits of a number.
    const sumDigits = (num) => {
        let sum = 0;
        // Convert the number to a string to iterate through its digits.
        const numStr = String(num);
        for (let i = 0; i < numStr.length; i++) {
            // Convert each character back to a number and add it to the sum.
            sum += parseInt(numStr[i], 10);
        }
        return sum;
    };

    // Iterate through the array using a for loop.
    for (let i = 0; i < nums.length; i++) {
        // Calculate the sum of digits for the current element nums[i].
        const digitSum = sumDigits(nums[i]);

        // Check if the sum of digits is equal to the current index i.
        if (digitSum === i) {
            // If the condition is met, return the current index i, as it's the smallest such index.
            return i;
        }
    }

    // If the loop finishes without finding any index that satisfies the condition, return -1.
    return -1;
};
