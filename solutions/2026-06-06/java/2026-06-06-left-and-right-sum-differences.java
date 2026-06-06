```java
// Calculates the absolute difference between the sum of elements to the left and right of each element in an array.
// Link: https://leetcode.com/problems/left-and-right-sum-differences/
// Approach:
// 1. Calculate the total sum of the array.
// 2. Iterate through the array, maintaining a running `leftSum`.
// 3. For each element `nums[i]`:
//    a. The `rightSum` can be calculated as `totalSum - leftSum - nums[i]`.
//    b. The difference `answer[i]` is the absolute value of `leftSum - rightSum`.
//    c. Update `leftSum` by adding `nums[i]` for the next iteration.
// Time Complexity: O(n), where n is the length of the input array `nums`. We iterate through the array twice (once for total sum, once for calculating differences).
// Space Complexity: O(n) for the `answer` array. If we can modify the input array in-place, it could be O(1) if `answer` array is not counted.
class Solution {
    public int[] leftRightDifference(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n]; // Array to store the result

        // Calculate the total sum of the array
        long totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }

        long leftSum = 0; // Stores the sum of elements to the left of the current index
        for (int i = 0; i < n; i++) {
            // Calculate the sum of elements to the right of the current index
            // rightSum = totalSum - leftSum (elements to the left) - nums[i] (current element)
            long rightSum = totalSum - leftSum - nums[i];

            // Calculate the absolute difference and store it in the answer array
            answer[i] = (int) Math.abs(leftSum - rightSum);

            // Update leftSum for the next iteration by adding the current element
            leftSum += nums[i];
        }

        return answer;
    }
}
```