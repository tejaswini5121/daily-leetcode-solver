// Summary: Find the minimum moves to make all array elements equal by incrementing.
// Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements-iii/
//
// Approach:
// The problem states that we can only *increase* elements. To minimize the total number of moves,
// we should aim to make all elements equal to the maximum element in the array.
// For each element `nums[i]`, the number of moves required to make it equal to the maximum
// element `max_val` is `max_val - nums[i]`.
// The total minimum moves will be the sum of these differences for all elements.
//
// Time Complexity: O(N), where N is the length of the input array `nums`.
// We iterate through the array once to find the maximum element and then iterate again
// to sum up the differences.
//
// Space Complexity: O(1). We only use a few variables to store the maximum value and the sum of moves.
class Solution {
    public int minMoves(int[] nums) {
        // Handle edge case of an empty array, though constraints say length >= 1.
        if (nums == null || nums.length == 0) {
            return 0;
        }

        // Initialize `minVal` to the first element.
        // This will be used to find the minimum element, not maximum.
        // Re-reading the problem: "increase the value of any single element nums[i] by 1."
        // This means we want to make all elements equal to *some* target value.
        // The optimal target value is the median if we could also decrease.
        // However, since we can only INCREASE, to minimize moves, we should make all elements
        // equal to the MAXIMUM element. The number of moves for `nums[i]` to reach `max_val` is `max_val - nums[i]`.
        // The total moves is sum(max_val - nums[i]) for all i.
        // This can be rewritten as N * max_val - sum(nums[i]).

        // Let's re-evaluate. The problem statement in the LeetCode link provided is actually
        // "Minimum Moves to Equal Array Elements II", where we can increment or decrement.
        // The problem description provided in the prompt is "Minimum Moves to Equal Array Elements III",
        // which states "In one move, you may increase the value of any single element nums[i] by 1."
        //
        // For the problem as described in the prompt ("increase by 1"):
        // To minimize moves by *only* increasing, we must bring all elements up to the level of the maximum element.
        // Example: [1, 2, 3]. Max is 3.
        // To make 1 become 3, needs 2 moves.
        // To make 2 become 3, needs 1 move.
        // To make 3 become 3, needs 0 moves.
        // Total moves = 2 + 1 + 0 = 3.
        //
        // This is equivalent to finding the minimum element and summing the differences between
        // each element and the minimum element IF we could decrement. But we can only increment.
        //
        // Let's re-read carefully: "In one move, you may increase the value of any single element nums[i] by 1."
        // This is the exact description for LeetCode problem 453 "Minimum Moves to Equal Array Elements".
        // The prompt's description matches problem 453, not 462 (II) or the yet-to-be-clarified "III".
        // The "III" in the prompt title might be a typo or a misinterpretation if it's referencing
        // the difficulty level "Easy" and associating it with a higher number than typical Easy problems.
        // Assuming the prompt description is paramount: "increase the value of any single element nums[i] by 1".
        //
        // In this scenario, making all elements equal to the maximum element is NOT optimal.
        // Consider [1, 5].
        // Option 1: Make all 5. Moves: (5-1) = 4. Total 4.
        // Option 2: Make all 2. Moves: (2-1) = 1. Total 1.
        // Option 3: Make all 3. Moves: (3-1) + (3-5) -- wait, we can only increase.
        //
        // If we can *only* increase, to make all elements equal to a target `T`, then `T` must be greater than or equal to all elements.
        // To minimize `sum(T - nums[i])` where `T >= nums[i]` for all `i`.
        // This sum is minimized when `T` is the maximum element.
        // So, the original logic for problem 453 (Minimum Moves to Equal Array Elements) applies.
        // The number of moves to make all elements equal to the maximum element is sum(max_val - nums[i]).
        //
        // Let's re-verify the examples provided in the prompt.
        // Example 1: nums = [2,1,3]
        // Output: 3
        // Explanation: "Increase nums[0] = 2 by 1 to make it 3. Increase nums[1] = 1 by 1 to make it 2. Increase nums[1] = 2 by 1 to make it 3."
        // This explanation suggests a target of 3.
        // (3-2) + (3-1) = 1 + 2 = 3. This matches.
        //
        // Example 2: nums = [4,4,5]
        // Output: 2
        // Explanation: "Increase nums[0] = 4 by 1 to make it 5. Increase nums[1] = 4 by 1 to make it 5."
        // This suggests a target of 5.
        // (5-4) + (5-4) = 1 + 1 = 2. This matches.
        //
        // So the approach is indeed: find the maximum element and sum the differences.

        // Find the maximum element in the array.
        int maxVal = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > maxVal) {
                maxVal = nums[i];
            }
        }

        // Calculate the total number of moves required.
        // For each element, the moves needed are `maxVal - nums[i]`.
        int totalMoves = 0;
        for (int num : nums) {
            totalMoves += (maxVal - num);
        }

        return totalMoves;
    }
}
