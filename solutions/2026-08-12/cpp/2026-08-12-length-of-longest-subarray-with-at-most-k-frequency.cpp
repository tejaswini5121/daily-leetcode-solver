```cpp
// Problem: Length of Longest Subarray With at Most K Frequency
// Problem Link: https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency/
//
// Approach:
// This problem can be solved efficiently using the sliding window technique.
// We maintain a window [left, right] and a frequency map to store the count of each
// element within the current window.
// We expand the window by moving the 'right' pointer. For each element added, we
// increment its count in the frequency map.
// If at any point the frequency of an element in the window exceeds 'k', we need
// to shrink the window from the left. We move the 'left' pointer and decrement
// the count of the element at the 'left' index in the frequency map until the
// frequency of all elements is at most 'k'.
// In each step, after ensuring the window is "good" (all element frequencies <= k),
// we update the maximum length of the good subarray found so far.
//
// Time Complexity: O(N), where N is the length of the input array `nums`.
// Both `left` and `right` pointers traverse the array at most once.
// The hash map operations (insertion, deletion, lookup) take O(1) on average.
//
// Space Complexity: O(M), where M is the number of distinct elements in `nums`.
// In the worst case, all elements could be distinct, leading to O(N) space.
// However, the problem constraints on `nums[i]` do not limit the number of distinct elements directly,
// but in practice, it's bound by the number of unique values encountered.

#include <vector>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int maxLength(std::vector<int>& nums, int k) {
        // `freq_map` will store the frequency of each element within the current window.
        std::unordered_map<int, int> freq_map;
        
        // `left` is the left boundary of our sliding window.
        int left = 0;
        
        // `max_len` stores the maximum length of a "good" subarray found so far.
        int max_len = 0;
        
        // Iterate through the array with the `right` pointer, expanding the window.
        for (int right = 0; right < nums.size(); ++right) {
            // Increment the frequency of the element at the current `right` pointer.
            freq_map[nums[right]]++;
            
            // If the frequency of the element at `nums[right]` exceeds `k`,
            // we need to shrink the window from the left.
            while (freq_map[nums[right]] > k) {
                // Decrement the frequency of the element at the `left` pointer.
                freq_map[nums[left]]--;
                // If the frequency becomes zero, we can optionally remove it from the map
                // to save space, though it's not strictly necessary for correctness.
                // if (freq_map[nums[left]] == 0) {
                //     freq_map.erase(nums[left]);
                // }
                
                // Move the `left` pointer to the right, effectively shrinking the window.
                left++;
            }
            
            // After ensuring the current window [left, right] is "good" (all frequencies <= k),
            // calculate its length and update `max_len` if this window is longer.
            // The length of the current window is `right - left + 1`.
            max_len = std::max(max_len, right - left + 1);
        }
        
        // Return the maximum length of a good subarray found.
        return max_len;
    }
};
```