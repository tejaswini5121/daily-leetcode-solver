// Problem: Length of Longest Subarray With at Most K Frequency
// Link: https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency/
//
// Approach:
// This problem can be solved efficiently using the sliding window technique.
// We maintain a window defined by two pointers, `left` and `right`.
// We also use a hash map (`freqMap`) to store the frequency of each element within the current window.
// As we expand the window by moving the `right` pointer, we update the frequency of the current element.
// If, at any point, the frequency of an element exceeds `k`, it means the current window is no longer "good".
// To make the window "good" again, we shrink it from the left by moving the `left` pointer.
// While shrinking, we decrement the frequency of the element at the `left` pointer.
// We continue shrinking until the element's frequency becomes `k` or less, making the window "good" again.
// In each step where the window is "good" (i.e., all element frequencies are <= k), we update the `maxLength`
// by taking the maximum of its current value and the current window size (`right - left + 1`).
// This process ensures that we find the longest possible good subarray.
//
// Time Complexity: O(N), where N is the length of the `nums` array.
// Both `left` and `right` pointers traverse the array at most once.
// Hash map operations (get, put, remove) take O(1) on average.
//
// Space Complexity: O(M), where M is the number of distinct elements in `nums`.
// In the worst case, all elements are distinct, and the hash map will store all of them.
// M can be at most N.

import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maxLength(int[] nums, int k) {
        // Initialize the frequency map to store counts of elements in the current window.
        Map<Integer, Integer> freqMap = new HashMap<>();
        // Initialize the left pointer of the sliding window.
        int left = 0;
        // Initialize the maximum length found so far.
        int maxLength = 0;

        // Iterate through the array with the right pointer to expand the window.
        for (int right = 0; right < nums.length; right++) {
            // Get the current element at the right pointer.
            int currentElement = nums[right];
            // Increment the frequency of the current element in the map.
            // If the element is not present, its frequency becomes 1.
            freqMap.put(currentElement, freqMap.getOrDefault(currentElement, 0) + 1);

            // Check if the frequency of the current element exceeds `k`.
            // If it does, we need to shrink the window from the left.
            while (freqMap.get(currentElement) > k) {
                // Get the element at the left pointer.
                int leftElement = nums[left];
                // Decrement the frequency of the element at the left pointer.
                freqMap.put(leftElement, freqMap.get(leftElement) - 1);

                // If the frequency of the left element becomes 0, remove it from the map.
                // This is an optimization, but not strictly necessary for correctness.
                if (freqMap.get(leftElement) == 0) {
                    freqMap.remove(leftElement);
                }

                // Move the left pointer to the right to shrink the window.
                left++;
            }

            // After ensuring the current window is "good" (all frequencies <= k),
            // update the maximum length found so far.
            // The current window length is `right - left + 1`.
            maxLength = Math.max(maxLength, right - left + 1);
        }

        // Return the maximum length of a good subarray.
        return maxLength;
    }
}
