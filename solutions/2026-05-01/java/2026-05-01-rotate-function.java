```java
// Problem: Rotate Function
// Link: https://leetcode.com/problems/rotate-function/
// Summary: Given an array, calculate a rotated function F(k) for each rotation k and find the maximum value.
// F(k) = 0 * arrk[0] + 1 * arrk[1] + ... + (n - 1) * arrk[n - 1], where arrk is nums rotated by k positions.

class Solution {
    /**
     * Calculates the maximum value of the rotation function F(k) for all possible rotations k.
     *
     * Approach:
     * We can observe a relationship between F(k) and F(k+1).
     * Let F(k) = 0*nums[k] + 1*nums[k+1] + ... + (n-1)*nums[k+n-1] (indices are modulo n).
     *
     * Let's consider F(k+1).
     * F(k+1) = 0*nums[k+1] + 1*nums[k+2] + ... + (n-2)*nums[k+n-1] + (n-1)*nums[k] (indices are modulo n).
     *
     * We can rewrite F(k+1) in terms of F(k):
     * F(k+1) = (0*nums[k+1] + 1*nums[k+2] + ... + (n-2)*nums[k+n-1]) + (n-1)*nums[k]
     *
     * Now let's look at F(k):
     * F(k) = 0*nums[k] + 1*nums[k+1] + 2*nums[k+2] + ... + (n-1)*nums[k+n-1]
     *
     * Rearrange F(k):
     * F(k) = 0*nums[k] + (1*nums[k+1] + 2*nums[k+2] + ... + (n-1)*nums[k+n-1])
     *
     * Consider the terms from index 1 onwards in F(k):
     * 1*nums[k+1] + 2*nums[k+2] + ... + (n-1)*nums[k+n-1]
     *
     * If we subtract `sum` (sum of all elements in nums) from F(k), we get:
     * F(k) - sum = (0*nums[k] + 1*nums[k+1] + ... + (n-1)*nums[k+n-1]) - (nums[k] + nums[k+1] + ... + nums[k+n-1])
     * F(k) - sum = -nums[k] + 0*nums[k+1] + 1*nums[k+2] + ... + (n-2)*nums[k+n-1]
     * F(k) - sum = -nums[k] + (0*nums[k+1] + 1*nums[k+2] + ... + (n-2)*nums[k+n-1])
     *
     * Now, let's relate this to F(k+1):
     * F(k+1) = 0*nums[k+1] + 1*nums[k+2] + ... + (n-2)*nums[k+n-1] + (n-1)*nums[k]
     *
     * We see that (0*nums[k+1] + 1*nums[k+2] + ... + (n-2)*nums[k+n-1]) appears in both expressions.
     * From `F(k) - sum = -nums[k] + (0*nums[k+1] + 1*nums[k+2] + ... + (n-2)*nums[k+n-1])`,
     * we can isolate the common part:
     * (0*nums[k+1] + 1*nums[k+2] + ... + (n-2)*nums[k+n-1]) = F(k) - sum + nums[k]
     *
     * Substitute this back into the F(k+1) equation:
     * F(k+1) = (F(k) - sum + nums[k]) + (n-1)*nums[k]
     * F(k+1) = F(k) - sum + nums[k] + n*nums[k] - nums[k]
     * F(k+1) = F(k) - sum + n*nums[k]
     *
     * So, the recurrence relation is: F(k+1) = F(k) + sum - n * nums[k].
     *
     * We can initialize F(0) by calculating it directly.
     * Then, we can iterate from k=0 to n-2 to find F(1), F(2), ..., F(n-1) using the recurrence.
     * We keep track of the maximum F(k) found so far.
     *
     * Time Complexity: O(n) - We iterate through the array twice: once to calculate the initial sum and F(0), and once to compute subsequent F(k) values.
     * Space Complexity: O(1) - We only use a few variables to store the sum, current F value, and the maximum F value.
     */
    public int maxRotateFunction(int[] nums) {
        int n = nums.length;

        // Handle edge case where array has only one element.
        if (n == 1) {
            return 0;
        }

        // Calculate the sum of all elements in nums.
        long sum = 0;
        for (int num : nums) {
            sum += num;
        }

        // Calculate F(0).
        // F(0) = 0*nums[0] + 1*nums[1] + ... + (n-1)*nums[n-1]
        long f0 = 0;
        for (int i = 0; i < n; i++) {
            f0 += (long) i * nums[i];
        }

        // Initialize the maximum rotation function value with F(0).
        long maxF = f0;

        // Iterate to calculate F(1), F(2), ..., F(n-1) using the recurrence relation.
        // F(k+1) = F(k) + sum - n * nums[k]
        long currentF = f0;
        for (int k = 0; k < n - 1; k++) {
            // nums[k] is the element that is "removed" from the highest multiplier position
            // and moves to the lowest multiplier position after rotation.
            // The effect of this move on F is:
            // currentF (which is F(k)) = ... + (n-1)*nums[k]
            // newF (which is F(k+1)) = 0*nums[k] + ...
            // The formula F(k+1) = F(k) + sum - n * nums[k] captures this change.
            currentF = currentF + sum - (long) n * nums[k];
            // Update the maximum F value if the current F is greater.
            maxF = Math.max(maxF, currentF);
        }

        // The problem guarantees the answer fits in a 32-bit integer.
        return (int) maxF;
    }
}
```