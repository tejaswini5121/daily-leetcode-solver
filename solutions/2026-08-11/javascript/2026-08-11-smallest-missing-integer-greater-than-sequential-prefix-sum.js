/**
 * @fileoverview Finds the smallest missing integer greater than or equal to the sum of the longest sequential prefix sum of an array.
 * @problem_link https://leetcode.com/problems/smallest-missing-integer-greater-than-sequential-prefix-sum/
 *
 * Approach:
 * 1. Iterate through the array to find the longest sequential prefix. A prefix is sequential if each element is one greater than the previous one.
 * 2. Calculate the sum of this longest sequential prefix.
 * 3. To efficiently check for missing numbers, store all numbers from the input array in a Set for O(1) average time lookups.
 * 4. Starting from the calculated prefix sum, iterate upwards, checking if each number exists in the Set. The first number not found in the Set is the smallest missing integer greater than or equal to the prefix sum.
 *
 * Time Complexity:
 * - Finding the longest sequential prefix and its sum: O(n), where n is the length of the nums array.
 * - Populating the Set: O(n) on average.
 * - Finding the smallest missing integer: In the worst case, we might iterate up to the sum of the prefix plus n. Since n and nums[i] are at most 50, this part is effectively O(1) in terms of the problem constraints, but generally could be O(S + n) where S is the prefix sum. Given the constraints, it's very small.
 * Overall: O(n)
 *
 * Space Complexity:
 * - Storing numbers in a Set: O(n) in the worst case, where n is the number of unique elements in nums.
 * Overall: O(n)
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var missingInteger = function(nums) {
    // Initialize the current sum and the index for the sequential prefix check.
    let currentSum = nums[0];
    let i = 1;

    // Find the longest sequential prefix and calculate its sum.
    // The loop continues as long as we are within the array bounds
    // and the current element is exactly one greater than the previous one.
    while (i < nums.length && nums[i] === nums[i - 1] + 1) {
        currentSum += nums[i]; // Add the current element to the sum.
        i++; // Move to the next element.
    }

    // Store all numbers from the input array in a Set for efficient lookups.
    // This allows us to check for the existence of a number in O(1) on average.
    const numSet = new Set(nums);

    // Start checking for the smallest missing integer from the calculated prefix sum.
    let missingNum = currentSum;

    // Keep checking numbers starting from currentSum upwards.
    // The loop continues as long as the current missingNum is found in the set.
    while (numSet.has(missingNum)) {
        missingNum++; // Increment to check the next integer.
    }

    // Return the first integer that was not found in the set.
    return missingNum;
};
