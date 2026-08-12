/**
 * @summary Finds the length of the longest subarray where each element's frequency is at most k.
 * @link https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency/
 * @approach This problem can be efficiently solved using the sliding window technique.
 * We maintain a window `[left, right]` and a frequency map (or hash table) to store the count of each element within the current window.
 * We expand the window by moving the `right` pointer. For each element `nums[right]`, we increment its count in the frequency map.
 * If the frequency of `nums[right]` exceeds `k`, it means the current window is no longer "good". To make it good again, we shrink the window from the left by moving the `left` pointer. As we shrink, we decrement the count of `nums[left]` in the frequency map. We continue shrinking until the frequency of `nums[right]` (or any element that caused the violation) becomes less than or equal to `k`.
 * At each step where the window is "good" (i.e., all element frequencies are <= k), we update the maximum length of the good subarray found so far, which is `right - left + 1`.
 *
 * Time Complexity: O(N), where N is the length of `nums`. Both `left` and `right` pointers traverse the array at most once. Hash map operations (insertion, deletion, lookup) take O(1) on average.
 * Space Complexity: O(M), where M is the number of distinct elements in `nums`. In the worst case, all elements are distinct, and the hash map stores all of them. However, since the problem statement implies that the number of distinct elements could be up to N, the space complexity can also be considered O(N) in the worst case if all elements are unique and `k` is large. Given the constraints, the maximum number of distinct elements is at most `nums.length`.
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
const longestSubarray = function(nums, k) {
    // Initialize a frequency map to store counts of elements in the current window.
    const freqMap = new Map();
    // Initialize the left pointer of the sliding window.
    let left = 0;
    // Initialize the maximum length of a good subarray found so far.
    let maxLength = 0;

    // Iterate through the array with the right pointer of the sliding window.
    for (let right = 0; right < nums.length; right++) {
        // Get the current element at the right pointer.
        const currentElement = nums[right];

        // Update the frequency of the current element in the map.
        // If the element is not in the map, initialize its count to 0 before incrementing.
        freqMap.set(currentElement, (freqMap.get(currentElement) || 0) + 1);

        // Check if the frequency of the current element exceeds k.
        // If it does, we need to shrink the window from the left to make it "good" again.
        while (freqMap.get(currentElement) > k) {
            // Get the element at the left pointer.
            const leftElement = nums[left];

            // Decrement the frequency of the element at the left pointer.
            freqMap.set(leftElement, freqMap.get(leftElement) - 1);

            // If the frequency of the element at the left pointer becomes 0, remove it from the map
            // to keep the map clean and efficient.
            if (freqMap.get(leftElement) === 0) {
                freqMap.delete(leftElement);
            }

            // Move the left pointer to the right, effectively shrinking the window.
            left++;
        }

        // At this point, the current window [left, right] is "good" because
        // the frequency of all elements within it is less than or equal to k.
        // Calculate the length of the current good subarray and update maxLength if it's larger.
        maxLength = Math.max(maxLength, right - left + 1);
    }

    // Return the maximum length of a good subarray found.
    return maxLength;
};
```