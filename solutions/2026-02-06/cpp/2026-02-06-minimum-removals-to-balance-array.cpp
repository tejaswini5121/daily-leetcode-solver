```cpp
// Problem: Minimum Removals to Balance Array
// Link: https://leetcode.com/problems/minimum-removals-to-balance-array/
//
// Approach:
// The problem asks for the minimum number of elements to remove so that the remaining
// array is balanced, meaning max_element <= min_element * k.
//
// If we sort the array first, any subarray of the sorted array will have its minimum
// element at the leftmost position and its maximum element at the rightmost position.
//
// So, after sorting `nums`, we are looking for the longest subarray `nums[i...j]`
// such that `nums[j] <= nums[i] * k`.
//
// We can iterate through all possible starting points `i` of a subarray. For each `i`,
// we want to find the largest `j` such that `nums[j] <= nums[i] * k`. This can be
// efficiently found using binary search (specifically `std::upper_bound`) because
// the array is sorted. `upper_bound(nums.begin() + i, nums.end(), nums[i] * k)`
// will return an iterator to the first element strictly greater than `nums[i] * k`.
// The index of the element just before this iterator (if it exists and is within bounds)
// will be our `j`.
//
// The length of such a balanced subarray starting at `i` would be `j - i + 1`. We want
// to maximize this length. The number of elements to remove for a subarray of length `L`
// from an original array of length `N` is `N - L`. Therefore, minimizing removals is
// equivalent to maximizing the length of the balanced subarray.
//
// We initialize `max_len` to 0 (or 1, since an array of size 1 is always balanced).
// We iterate `i` from 0 to `n-1`. For each `i`, we find the upper bound of `nums[i] * k`
// in the range `[i, n)`. Let this be `it`. The valid end index `j` of our balanced
// subarray is `std::distance(nums.begin(), it) - 1`.
// If `j` is greater than or equal to `i`, the length of the balanced subarray is `j - i + 1`.
// We update `max_len = max(max_len, j - i + 1)`.
//
// The minimum number of removals will then be `n - max_len`.
//
// Time Complexity:
// Sorting the array takes O(N log N) time.
// Iterating through the sorted array (N elements for `i`) and performing a binary search
// (O(log N)) for each element takes O(N log N) time.
// Total time complexity: O(N log N) + O(N log N) = O(N log N).
//
// Space Complexity:
// Sorting might use O(log N) or O(N) space depending on the implementation.
// The rest of the algorithm uses O(1) extra space.
// Total space complexity: O(log N) or O(N).
//
// Note: For the edge case where `nums` has only one element, the initial `max_len` should be 1,
// and the result will be `n - 1 = 1 - 1 = 0`, which is correct. If `nums` is empty,
// this problem statement implies `nums.length >= 1`, so we don't need to handle empty arrays.
//
// Optimization using two pointers:
// Since the array is sorted, as `i` increases, `nums[i]` increases. This means that
// `nums[i] * k` also increases. Consequently, the potential `j` for the current `i`
// will be at least as large as the `j` for the previous `i`. This allows us to use
// a two-pointer approach.
// We use `i` as the left pointer and `j` as the right pointer.
// Initialize `i = 0`, `j = 0`, `max_len = 0`.
// Iterate `i` from 0 to `n-1`.
// For each `i`, advance `j` as long as `j < n` and `nums[j] <= nums[i] * k`.
// Once the condition `nums[j] <= nums[i] * k` is no longer met (or `j` reaches `n`),
// the valid balanced subarray starting at `i` ends at `j-1`.
// The length of this subarray is `j - i`.
// Update `max_len = max(max_len, j - i)`.
// The minimum number of removals is `n - max_len`.
//
// Time Complexity (Two Pointers):
// Sorting takes O(N log N).
// The two pointers `i` and `j` each traverse the array at most once.
// Total time complexity: O(N log N) for sorting + O(N) for two pointers = O(N log N).
//
// Space Complexity (Two Pointers):
// O(log N) or O(N) for sorting. O(1) for pointers.
// Total space complexity: O(log N) or O(N).

#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator> // For std::distance

class Solution {
public:
    int minimumRemovals(std::vector<int>& nums, int k) {
        int n = nums.size();

        // Sort the array. This is crucial because a balanced array's minimum and
        // maximum will be the start and end of a contiguous subarray in the sorted version.
        std::sort(nums.begin(), nums.end());

        // If the array has only one element, it's already balanced.
        if (n <= 1) {
            return 0;
        }

        int max_len = 0; // Stores the maximum length of a balanced subarray found so far.
                         // An array of size 1 is balanced, so minimum possible max_len is 1.
                         // We initialize to 0 and will update based on subarray lengths.

        // --- Two-Pointer Approach ---
        int j = 0; // Right pointer
        for (int i = 0; i < n; ++i) { // Left pointer
            // For the current minimum element `nums[i]`, find the furthest element `nums[j]`
            // such that `nums[j] <= nums[i] * k`.
            // We advance `j` as long as it's within bounds and the condition holds.
            // `j` will always be greater than or equal to `i`.
            while (j < n && nums[j] <= (long long)nums[i] * k) { // Use long long to prevent overflow
                j++;
            }
            // At this point, `j` is either `n` or `nums[j] > nums[i] * k`.
            // The balanced subarray starting at `i` extends up to index `j-1`.
            // The length of this balanced subarray is `j - i`.
            max_len = std::max(max_len, j - i);
        }

        // The minimum number of removals is the total number of elements minus the
        // length of the longest balanced subarray.
        return n - max_len;

        /*
        // --- Binary Search Approach ---
        // This approach is conceptually similar but uses binary search instead of a second pointer.
        // It's less efficient than the two-pointer approach for this specific problem
        // due to the monotonic nature of the condition when the array is sorted.
        int max_len_bs = 0;
        for (int i = 0; i < n; ++i) {
            // Find the first element strictly greater than nums[i] * k.
            // We are looking for an element `x` such that `x <= nums[i] * k`.
            // `upper_bound` finds the first element `> val`.
            // So, `upper_bound(..., nums[i] * k)` gives an iterator to the first element
            // that violates the condition `nums[j] <= nums[i] * k`.
            auto it = std::upper_bound(nums.begin() + i, nums.end(), (long long)nums[i] * k);

            // `it` points to the first element `> nums[i] * k` or `nums.end()`.
            // The valid elements for our balanced subarray are from `nums.begin() + i` up to `it - 1`.
            // The distance from `nums.begin()` to `it` gives the index of the first element that's too large.
            // The number of elements from `i` to this point is `std::distance(nums.begin(), it) - i`.
            int current_len = std::distance(nums.begin(), it) - i;
            max_len_bs = std::max(max_len_bs, current_len);
        }
        return n - max_len_bs;
        */
    }
};
```