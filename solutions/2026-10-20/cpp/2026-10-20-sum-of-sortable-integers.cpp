```cpp
// Problem: Sum of Sortable Integers
// Link: https://leetcode.com/problems/sum-of-sortable-integers/
//
// Approach:
// The problem asks us to find all divisors 'k' of the array length 'n' such that
// the array 'nums' can be sorted by partitioning it into consecutive subarrays of
// length 'k' and cyclically rotating each subarray independently.
//
// For a given divisor 'k', we need to check if it's "sortable".
// The condition for a subarray to be sortable is that all elements within that subarray
// must be the same. This is because if a subarray contains distinct elements, say [a, b, c]
// where a < b < c, and we can rotate it, the sorted version would be [a, b, c].
// However, if the subarray is [c, a, b], rotating it can give [a, b, c] or [b, c, a].
// The critical observation is that to sort the entire array `nums` into non-decreasing order,
// if we partition `nums` into subarrays of length `k`, each subarray must contain the
// same set of elements as it would in the globally sorted version of `nums`.
//
// Let the sorted version of `nums` be `sorted_nums`.
// If `k` is sortable, then for each subarray of length `k` in `nums`, its elements must be
// a cyclic permutation of the corresponding subarray of length `k` in `sorted_nums`.
// This implies that the multiset of elements in `nums[i*k ... (i+1)*k - 1]` must be
// identical to the multiset of elements in `sorted_nums[i*k ... (i+1)*k - 1]`.
//
// More importantly, for a subarray to be sortable by cyclic rotation, all elements within
// that subarray must be identical. If there are distinct elements in a subarray, no amount
// of cyclic rotation will arrange them in non-decreasing order if the original subarray
// is not already sorted (and even then, it only works if all elements are the same).
//
// Therefore, the condition for 'k' to be sortable is:
// For every block of size 'k' (i.e., `nums[i*k ... (i+1)*k - 1]`), all elements within that
// block must be identical.
//
// We can iterate through all divisors 'k' of 'n'. For each divisor 'k', we check this condition.
// If the condition holds, we add 'k' to the total sum.
//
// Steps:
// 1. Calculate the length of the array, `n`.
// 2. Find all divisors of `n`. We can do this by iterating from 1 up to `sqrt(n)`.
//    If `i` divides `n`, then both `i` and `n/i` are divisors.
// 3. For each divisor `k`:
//    a. Initialize a flag `is_sortable = true`.
//    b. Iterate through the array in steps of `k`. For each subarray `nums[i*k ... (i+1)*k - 1]`:
//       i. Check if all elements in this subarray are the same. This can be done by comparing
//          each element with the first element of the subarray.
//       ii. If any element is different, set `is_sortable = false` and break the inner loop.
//    c. If `is_sortable` is still `true` after checking all subarrays for this `k`, then `k` is sortable. Add `k` to the `total_sum`.
// 4. Return `total_sum`.
//
// Time Complexity:
// Finding divisors takes O(sqrt(n)).
// For each divisor `k`, we iterate through the array `nums` of length `n`. The check within each subarray of size `k` takes O(k).
// The total number of elements checked across all subarrays for a fixed `k` is `n`.
// So, checking a single `k` takes O(n).
// The number of divisors of `n` is typically much smaller than `n`. The maximum number of divisors for a number up to 10^5 is relatively small (e.g., for 75600 or 92400, it's around 128).
// Let `d(n)` be the number of divisors of `n`. The total time complexity is roughly O(sqrt(n) + d(n) * n).
// Given `n <= 10^5`, `sqrt(n)` is about 316. The maximum `d(n)` for `n <= 10^5` is 128.
// So, the complexity is roughly O(316 + 128 * 10^5) which is dominated by O(d(n) * n).
//
// Space Complexity:
// O(1) extra space if we don't store divisors explicitly, or O(d(n)) if we store them.
// We can compute divisors on the fly.
//

#include <vector>
#include <numeric>
#include <cmath>
#include <algorithm>
#include <set>

class Solution {
public:
    int sumOfSortableIntegers(std::vector<int>& nums) {
        int n = nums.size();
        long long total_sum = 0; // Use long long for sum to avoid overflow

        // Find all divisors of n
        std::set<int> divisors;
        for (int i = 1; i * i <= n; ++i) {
            if (n % i == 0) {
                divisors.insert(i);
                divisors.insert(n / i);
            }
        }

        // For each divisor k, check if it's sortable
        for (int k : divisors) {
            bool k_is_sortable = true;

            // Iterate through nums in blocks of size k
            for (int i = 0; i < n; i += k) {
                // Check if all elements in the current subarray [i, i+k-1] are the same
                int first_element = nums[i];
                for (int j = i + 1; j < i + k; ++j) {
                    if (nums[j] != first_element) {
                        k_is_sortable = false;
                        break; // This subarray is not sortable, so k is not sortable
                    }
                }
                if (!k_is_sortable) {
                    break; // No need to check further subarrays for this k
                }
            }

            // If all subarrays were sortable, add k to the total sum
            if (k_is_sortable) {
                total_sum += k;
            }
        }

        return static_cast<int>(total_sum);
    }
};
```