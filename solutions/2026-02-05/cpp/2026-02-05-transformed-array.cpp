// Problem: Transformed Array
// Link: https://leetcode.com/problems/transformed-array/
// Summary: Given a circular integer array, create a new array where each element is determined by moving a certain number of steps (positive for right, negative for left) from its original index in the circular array.
//
// Approach:
// We iterate through the input array `nums`. For each element `nums[i]`, we determine the number of steps to move and the direction.
// - If `nums[i]` is positive, we move `nums[i]` steps to the right.
// - If `nums[i]` is negative, we move `abs(nums[i])` steps to the left.
// - If `nums[i]` is zero, the result at that index is also zero.
//
// To handle circularity, we use the modulo operator.
// For a move of `steps` from index `i` in an array of length `n`:
// - Right move: `(i + steps) % n`
// - Left move: `(i - steps % n + n) % n`. The `+ n` and then `% n` ensures that the result is non-negative even if `i - steps` is negative.
//
// We store the value of `nums` at the calculated landing index into `result[i]`.
//
// Time Complexity: O(N), where N is the length of the input array `nums`. We iterate through the array once.
// Space Complexity: O(N), for storing the `result` array. If modifying in-place were allowed and we were only returning the modified array, it could be O(1) auxiliary space. However, the problem statement requires creating a new array.
#include <vector>
#include <cmath> // For abs

class Solution {
public:
    std::vector<int> transformedArray(std::vector<int>& nums) {
        // Get the size of the input array
        int n = nums.size();
        // Initialize the result array with the same size
        std::vector<int> result(n);

        // Iterate through each element of the input array
        for (int i = 0; i < n; ++i) {
            // Get the current value and its index
            int currentValue = nums[i];

            // Handle the case where the value is 0
            if (currentValue == 0) {
                result[i] = 0; // If value is 0, the result is 0
            } else if (currentValue > 0) {
                // If the value is positive, move to the right
                // Calculate the landing index using modulo for circularity
                // (i + currentValue) % n gives the new index after moving right
                int landingIndex = (i + currentValue) % n;
                // Set the result at the current index to the value at the landing index
                result[i] = nums[landingIndex];
            } else {
                // If the value is negative, move to the left
                // Get the absolute value of the negative number for steps
                int stepsToMoveLeft = std::abs(currentValue);
                // Calculate the landing index using modulo for circularity
                // (i - stepsToMoveLeft % n + n) % n handles negative results correctly
                // Adding 'n' before modulo ensures the result of the subtraction is non-negative
                int landingIndex = (i - (stepsToMoveLeft % n) + n) % n;
                // Set the result at the current index to the value at the landing index
                result[i] = nums[landingIndex];
            }
        }
        // Return the newly created transformed array
        return result;
    }
};
```