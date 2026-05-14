/**
 * Problem: Check if Array is Good
 * Link: https://leetcode.com/problems/check-if-array-is-good/
 *
 * Summary:
 * Given an integer array nums, determine if it's a permutation of a base array of the form [1, 2, ..., n-1, n, n].
 *
 * Approach:
 * 1. Find the maximum element in the input array `nums`. This maximum element is our candidate for `n`.
 * 2. The length of `base[n]` is `n + 1`. So, the length of `nums` must be `n + 1`. If `nums.length` is not equal to `max_element + 1`, it cannot be a good array.
 * 3. We need to check if `nums` contains all numbers from 1 to `n-1` exactly once, and the number `n` exactly twice.
 * 4. We can use a frequency map (or a boolean array since the constraints are small) to count the occurrences of each number in `nums`.
 * 5. Iterate from 1 to `n-1`. Each of these numbers must appear exactly once. If any number from 1 to `n-1` is missing or appears more than once, the array is not good.
 * 6. The number `n` must appear exactly twice.
 * 7. If all these conditions are met, the array is good.
 *
 * Time Complexity: O(N), where N is the length of the input array `nums`.
 * We iterate through the array once to find the maximum and populate the frequency map, and then iterate up to `n` (which is at most N) to check frequencies.
 *
 * Space Complexity: O(N), where N is the length of the input array `nums`.
 * This is due to the frequency map (or boolean array) which can store up to N distinct elements in the worst case. Given the constraints on `nums[i]` (<= 200), a boolean array of size 201 would be O(1) in terms of input size, but conceptually it depends on the range of values. For general cases where `n` could be large, it's O(N).
 */
class Solution {
    public boolean isGood(int[] nums) {
        // Find the maximum element in the array. This is our candidate for 'n'.
        int maxElement = 0;
        for (int num : nums) {
            if (num > maxElement) {
                maxElement = num;
            }
        }

        // The length of a 'good' array base[n] is n + 1.
        // So, the length of nums must be equal to maxElement + 1.
        if (nums.length != maxElement + 1) {
            return false;
        }

        // Use a frequency map (or a boolean array for smaller constraints)
        // to count occurrences of each number.
        // Since nums[i] <= 200, an array is efficient.
        // The size needs to be maxElement + 1 to accommodate maxElement itself.
        int[] counts = new int[maxElement + 1];

        for (int num : nums) {
            // If a number is greater than maxElement, it can't be part of base[n].
            // Also, if a number is 0 or negative (though constraints say 1 <= num[i]),
            // it's invalid.
            if (num > maxElement || num <= 0) {
                return false;
            }
            counts[num]++;
        }

        // Check the frequencies according to the definition of base[n] = [1, 2, ..., n-1, n, n].
        // Numbers from 1 to n-1 (i.e., 1 to maxElement - 1) must appear exactly once.
        for (int i = 1; i < maxElement; i++) {
            if (counts[i] != 1) {
                return false;
            }
        }

        // The number 'n' (which is maxElement) must appear exactly twice.
        if (counts[maxElement] != 2) {
            return false;
        }

        // If all checks pass, the array is 'good'.
        return true;
    }
}
