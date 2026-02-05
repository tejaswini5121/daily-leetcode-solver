// Problem: Transformed Array
// Summary: Given a circular array, transform each element based on its value and direction of movement.
// Link: https://leetcode.com/problems/transformed-array/
// Approach:
// Iterate through the input array `nums`. For each element `nums[i]`:
// 1. If `nums[i]` is positive, calculate the new index by moving `nums[i]` steps to the right, handling circularity using the modulo operator. The new index is `(i + nums[i]) % n`, where `n` is the length of the array.
// 2. If `nums[i]` is negative, calculate the new index by moving `abs(nums[i])` steps to the left, handling circularity. The new index is `(i - abs(nums[i])) % n`. A common way to handle negative results from modulo in JavaScript is `((i - abs(nums[i])) % n + n) % n`.
// 3. If `nums[i]` is zero, the new value at `result[i]` remains `nums[i]` (which is 0).
// Store the value at the calculated new index in the `result` array at index `i`.
//
// Time Complexity: O(n), where n is the length of the input array. We iterate through the array once.
// Space Complexity: O(n), where n is the length of the input array. We create a new array `result` of the same size.
const transformedArray = (nums) => {
    // Get the length of the input array.
    const n = nums.length;
    // Initialize the result array with the same size as nums.
    const result = new Array(n);

    // Iterate through each element of the nums array.
    for (let i = 0; i < n; i++) {
        const currentValue = nums[i];

        // If the current value is positive, move to the right.
        if (currentValue > 0) {
            // Calculate the new index by moving `currentValue` steps to the right.
            // The modulo operator `% n` ensures we wrap around the circular array.
            const newIndex = (i + currentValue) % n;
            // Set the result at the current index `i` to the value at the `newIndex` in `nums`.
            result[i] = nums[newIndex];
        }
        // If the current value is negative, move to the left.
        else if (currentValue < 0) {
            // Calculate the absolute value of the current number for leftward movement.
            const stepsToMove = Math.abs(currentValue);
            // Calculate the new index by moving `stepsToMove` steps to the left.
            // `(i - stepsToMove) % n` can result in a negative number in JavaScript.
            // Adding `n` and then taking modulo `n` again ensures a positive index within bounds.
            const newIndex = ((i - stepsToMove) % n + n) % n;
            // Set the result at the current index `i` to the value at the `newIndex` in `nums`.
            result[i] = nums[newIndex];
        }
        // If the current value is zero, the result at the current index remains zero.
        else { // currentValue === 0
            result[i] = 0;
        }
    }

    // Return the transformed array.
    return result;
};
```