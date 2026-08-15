// Summary: Find the length of the longest subsequence of an array whose bitwise XOR is non-zero.
// Link: https://leetcode.com/problems/longest-subsequence-with-non-zero-bitwise-xor/
// Approach:
// The problem asks for the longest subsequence with a non-zero XOR.
// If the bitwise XOR of all elements in `nums` is non-zero, then the longest subsequence is `nums` itself,
// and its length is `nums.length`.
// If the bitwise XOR of all elements in `nums` is zero, it means that including all elements
// results in an XOR sum of 0. To get a non-zero XOR sum, we must remove at least one element.
// To maximize the subsequence length while ensuring a non-zero XOR, we should try to remove just one element.
// If we can find a single element such that removing it from the entire array results in a non-zero XOR sum,
// then the longest subsequence would be `nums.length - 1`.
// The property of XOR is that `a ^ b ^ b = a`. If the XOR sum of all elements is `S`, and we remove an element `x`,
// the new XOR sum will be `S ^ x`.
// If `S = 0`, then removing `x` results in `0 ^ x = x`. So, if `S = 0`, and there's any non-zero element `x` in `nums`,
// we can remove it to get a non-zero XOR sum `x`.
// The only case where we cannot achieve a non-zero XOR sum is if all elements in `nums` are 0.
// In that specific case, any subsequence (including the entire array) will have an XOR sum of 0.
// So, if the XOR sum of all elements is 0:
//  - If all elements are 0, then the longest subsequence with non-zero XOR is 0.
//  - If there's at least one non-zero element, removing any single non-zero element will result in a non-zero XOR.
//    The length will be `nums.length - 1`.
// Therefore, the algorithm is:
// 1. Calculate the bitwise XOR of all elements in `nums`.
// 2. If the total XOR sum is non-zero, return `nums.length`.
// 3. If the total XOR sum is zero:
//    a. Check if all elements are zero. This can be done by checking if `nums.length > 0` and the total XOR sum is 0,
//       and if we can find at least one non-zero element. However, a simpler check is to iterate and see if any element is non-zero.
//       If the total XOR is 0, and there is at least one non-zero element, then removing that element will yield a non-zero XOR.
//       The longest subsequence will have length `nums.length - 1`.
//    b. If all elements are zero, then no non-zero XOR subsequence exists, return 0.
//    The condition `total_xor == 0` covers the case where all elements are 0 if there are no non-zero elements.
//    If `total_xor == 0` and `nums.length > 0`, it implies that we can achieve a non-zero XOR by removing one element, UNLESS all elements were 0.
//    So, if `total_xor == 0`, we need to check if there's any non-zero element.
//    A cleaner logic:
//    Calculate `total_xor`.
//    If `total_xor != 0`, return `nums.length`.
//    If `total_xor == 0`:
//      Iterate through `nums`. If we find any `num != 0`, return `nums.length - 1`.
//      If the loop finishes without finding a non-zero number (meaning all numbers were 0), return 0.
//
// Time Complexity: O(N), where N is the number of elements in `nums`. We iterate through the array twice in the worst case (once to calculate XOR, once to check for non-zero if XOR is 0).
// Space Complexity: O(1), as we only use a few extra variables.

#include <vector>
#include <numeric>

class Solution {
public:
    int longestSubsequence(std::vector<int>& nums) {
        // Calculate the bitwise XOR of all elements in the array.
        int total_xor = 0;
        for (int num : nums) {
            total_xor ^= num;
        }

        // If the XOR sum of all elements is non-zero, then the entire array itself
        // is the longest subsequence with a non-zero XOR.
        if (total_xor != 0) {
            return nums.size();
        } else {
            // If the XOR sum of all elements is zero, it means that the entire array
            // results in a zero XOR. To get a non-zero XOR, we must exclude at least
            // one element.
            // We try to achieve a non-zero XOR by removing just one element.
            // If there is at least one non-zero element in the array, removing it
            // will result in a non-zero XOR sum. This is because if the total XOR is 0,
            // and we remove an element `x`, the new XOR sum becomes `0 ^ x = x`.
            // If `x` is non-zero, then the new XOR sum is non-zero.
            // The longest subsequence will then have a length of `nums.size() - 1`.
            // If all elements in the array are zero, then any subsequence (including
            // the entire array) will have an XOR sum of zero. In this case, no
            // subsequence with a non-zero XOR exists.
            bool found_non_zero = false;
            for (int num : nums) {
                if (num != 0) {
                    found_non_zero = true;
                    break; // We only need to find one non-zero element
                }
            }

            if (found_non_zero) {
                // If we found at least one non-zero element, we can form a non-zero XOR
                // subsequence by removing that element (or any element that makes the total XOR non-zero).
                // The longest such subsequence will have size `nums.size() - 1`.
                return nums.size() - 1;
            } else {
                // If all elements are zero, then any subsequence will have an XOR of 0.
                // No subsequence with a non-zero XOR exists.
                return 0;
            }
        }
    }
};
