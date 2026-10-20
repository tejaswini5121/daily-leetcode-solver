```java
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

/**
 * Problem Summary: Given an integer array `nums`, find the sum of all integers `k`
 * that divide the length of `nums` (`n`) such that `nums` can be sorted by
 * partitioning it into subarrays of length `k` and cyclically rotating each subarray.
 * Link: https://leetcode.com/problems/sum-of-sortable-integers/
 *
 * Approach:
 * 1. Find all divisors of n.
 * 2. For each divisor `k`, check if it's sortable.
 * 3. To check if `k` is sortable:
 *    a. Iterate through `nums` in chunks of size `k`.
 *    b. For each chunk (subarray), check if it can be rotated to form a sorted sequence.
 *    c. A subarray can be rotated into a sorted sequence if and only if the number of elements
 *       that are out of place relative to the smallest element in the subarray is at most
 *       `k - 1`. In other words, if we sort the subarray, the original subarray must be a
 *       cyclic shift of the sorted subarray. This can be checked by comparing the original subarray
 *       with its sorted version. If all elements in the original subarray are present in the sorted
 *       subarray, and the number of elements that are not in their correct sorted position is
 *       at most `k-1` (meaning they can be "shifted" into place), then the subarray is sortable.
 *       A simpler way to check this is: if we sort the subarray, can we find a cyclic shift of the
 *       sorted subarray that matches the original subarray? This is equivalent to checking if the
 *       original subarray contains all elements of the sorted subarray and if the relative order
 *       of elements is consistent with a cyclic shift. A more efficient check: for a subarray `sub`
 *       and its sorted version `sorted_sub`, `sub` is a cyclic shift of `sorted_sub` if `sub`
 *       contains the same elements as `sorted_sub` and when comparing `sub` with `sorted_sub`,
 *       the number of mismatches is less than `k`.
 *       An even simpler check for sortability of a subarray: if we sort the subarray `sub` to get `sorted_sub`,
 *       then `sub` can be cyclically rotated to `sorted_sub` if and only if `sub` contains the same
 *       elements as `sorted_sub` and `sub` appears as a substring in `sorted_sub + sorted_sub`.
 *       However, since we only care if the *original* subarray can be rotated to *any* sorted sequence,
 *       we need to check if the elements within the subarray, when sorted, can be formed by cyclically
 *       rotating the original subarray. This means the original subarray must contain the same elements
 *       as its sorted version. The condition for sortability of a subarray is that its elements, when
 *       sorted, can be obtained by cyclically rotating the original subarray. This means that if `sub`
 *       is the original subarray and `sorted_sub` is its sorted version, then `sub` must be a cyclic
 *       permutation of `sorted_sub`. A practical way to check this is to ensure that all elements
 *       in `sub` are present in `sorted_sub`, and that the count of elements in `sub` that are *not*
 *       in their final sorted position (i.e., `sub[i] != sorted_sub[i]`) is at most `k-1`.
 *       A more robust check: For a subarray `sub` of length `k`, let `sorted_sub` be its sorted version.
 *       `sub` is sortable if `sub` can be cyclically shifted to become `sorted_sub`. This is true if
 *       the multiset of elements in `sub` is the same as in `sorted_sub` (which is always true by definition of sorting)
 *       AND for any element `x` in `sub`, its index in `sub` minus its index in `sorted_sub` (modulo `k`) is
 *       consistent across all elements.
 *       Actually, a subarray `sub` of length `k` is sortable if and only if `sub` can be cyclically rotated to match
 *       its sorted version. This means if we sort `sub` to get `sorted_sub`, then `sub` must be a cyclic shift
 *       of `sorted_sub`. This can be checked by comparing `sub` with `sorted_sub` and counting mismatches.
 *       If the number of mismatches is `m`, then we need `m <= k-1` for it to be sortable by rotation.
 *       However, this is not quite right. The condition is simpler: if `sorted_sub` is the sorted version of `sub`,
 *       then `sub` is a cyclic permutation of `sorted_sub` if and only if `sub` contains the same elements as
 *       `sorted_sub` and the elements that are out of place can be cyclically shifted.
 *       The most straightforward check: sort the subarray, then check if the original subarray can be rotated to match the sorted subarray.
 *       This is true if and only if the number of elements that are not in their correct sorted positions is at most `k-1` (if we consider the sorted array as the target).
 *       Let's re-evaluate: A subarray `sub` of length `k` can be sorted by cyclic rotation if and only if its elements form a contiguous range when considered cyclically.
 *       This means that if we sort `sub` to get `sorted_sub`, then `sub` must be a cyclic shift of `sorted_sub`.
 *       The condition for `sub` to be a cyclic shift of `sorted_sub` is that `sub` must contain the same elements as `sorted_sub`, and the relative order is preserved under cyclic shift.
 *       A key insight: for a subarray `sub` of length `k` to be sortable by cyclic rotation, if we sort it to `sorted_sub`, then `sub` must be equal to `sorted_sub` shifted by some amount `s`.
 *       This means for every element `sub[i]`, its corresponding element in `sorted_sub` is `sorted_sub[(i+s) % k]`.
 *       This implies that for each `i`, `sub[i]` must appear at some position `j` in `sorted_sub`, and `sub[(i+1)%k]` must appear at `sorted_sub[(j+1)%k]`.
 *       A simpler check: For each subarray `sub`, create a sorted version `sorted_sub`. Then, for each possible starting shift `s` from 0 to `k-1`, check if `sub[i] == sorted_sub[(i+s) % k]` for all `i`. If any `s` works, the subarray is sortable.
 *       This is still O(k^2) per subarray.
 *
 *       Correct and efficient check for sortability of a subarray `sub` of length `k`:
 *       1. Sort `sub` to get `sorted_sub`.
 *       2. Check if the multiset of elements in `sub` is the same as in `sorted_sub` (this is always true by definition of sorting).
 *       3. The subarray `sub` can be cyclically rotated to match `sorted_sub` if and only if for every element `x` in `sub`, if its index in `sub` is `i` and its index in `sorted_sub` is `j`, then the difference `(i - j + k) % k` must be the same for all elements. This is incorrect.
 *
 *       Let's reconsider the definition: "Cyclically rotate each subarray independently any number of times".
 *       This means we can pick an arbitrary starting point for the cyclic rotation.
 *       For a subarray `sub` of length `k`, let `sorted_sub` be its sorted version.
 *       `sub` is sortable if there exists a rotation `s` such that `sub[i] == sorted_sub[(i+s) % k]` for all `i` from 0 to `k-1`.
 *       This is equivalent to checking if `sub` is a cyclic shift of `sorted_sub`.
 *       A way to check if array `A` is a cyclic shift of array `B` (of the same length):
 *       Concatenate `B` with itself: `B_double = B + B`. Then check if `A` is a subarray of `B_double`.
 *       However, this is for exact match. Here, we need to check if `sub` can be rotated to form `sorted_sub`.
 *       This means the elements of `sub` *must* be exactly the elements of `sorted_sub` in some cyclic order.
 *       So, first, sort `sub` to get `sorted_sub`.
 *       Then, check if `sub` is a cyclic permutation of `sorted_sub`.
 *       This can be done by checking if `sub` appears as a contiguous subsequence within `sorted_sub + sorted_sub`.
 *       Example: `sub = [3,1,2]`, `sorted_sub = [1,2,3]`. `sorted_sub + sorted_sub = [1,2,3,1,2,3]`.
 *       Is `[3,1,2]` a contiguous subsequence? Yes, starting at index 2. So `[3,1,2]` is a cyclic shift of `[1,2,3]`.
 *       This check is `O(k^2)` naively or `O(k)` using KMP.
 *
 *       For `k=3`, subarray `[3,1,2]`. Sorted is `[1,2,3]`. Is `[3,1,2]` a cyclic shift of `[1,2,3]`? Yes.
 *       For `k=3`, subarray `[7,6,5]`. Sorted is `[5,6,7]`. Is `[7,6,5]` a cyclic shift of `[5,6,7]`? No.
 *
 *       Algorithm refined:
 *       1. Find all divisors of `n`.
 *       2. Initialize `total_sum_sortable_k = 0`.
 *       3. For each divisor `k`:
 *          a. `is_k_sortable = true`.
 *          b. Iterate from `i = 0` to `n-1` with step `k`:
 *             i. Extract subarray `sub = nums[i...i+k-1]`.
 *             ii. Create a sorted copy `sorted_sub` of `sub`.
 *             iii. Check if `sub` is a cyclic permutation of `sorted_sub`.
 *                 - A simple way: create `sorted_sub_doubled = sorted_sub + sorted_sub`.
 *                 - Iterate `s` from 0 to `k-1` (potential start of `sub` in `sorted_sub_doubled`).
 *                 - For each `s`, check if `sub[j] == sorted_sub_doubled[s+j]` for all `j` from 0 to `k-1`.
 *                 - If a match is found, this subarray is sortable. Break inner loop.
 *                 - If no `s` works for this subarray, set `is_k_sortable = false` and break outer loop (over subarrays).
 *          c. If `is_k_sortable` is true, add `k` to `total_sum_sortable_k`.
 *       4. Return `total_sum_sortable_k`.
 *
 *       Complexity:
 *       Finding divisors: `O(sqrt(n))`.
 *       Number of divisors can be large, but on average is much smaller. Max number of divisors for `N <= 10^5` is relatively small (e.g., 75600 has 128 divisors).
 *       For each divisor `k`:
 *       Iterating through subarrays: `n/k` subarrays.
 *       For each subarray:
 *         - Extracting subarray: `O(k)`.
 *         - Sorting subarray: `O(k log k)`.
 *         - Checking cyclic permutation: `O(k^2)` using naive string matching, or `O(k)` using KMP.
 *       Total for a divisor `k`: `(n/k) * (O(k log k) + O(k^2))` or `(n/k) * (O(k log k) + O(k))`.
 *       If we use `O(k^2)` check: `(n/k) * O(k^2) = O(nk)`.
 *       Sum over all divisors `k` of `n`: `Sum(nk)` for `k | n`. This can be up to `O(n^2)` in worst case if `k` is small for many divisors (not possible here due to constraints).
 *       The sum `Sum(nk)` for `k|n` is related to sum of divisors function `sigma_1(n)`. The sum `Sum_{d|n} d` is `sigma_1(n)`. We have `n/k` * k^2 roughly.
 *       This is `Sum_{k|n} n/k * k^2 = Sum_{k|n} n*k`. This is `n * Sum_{k|n} k = n * sigma_1(n)`.
 *       For `n <= 10^5`, `sigma_1(n)` can be up to `O(n log log n)` (highly composite numbers).
 *       So `O(n * sigma_1(n))` could be too slow.
 *
 *       Let's optimize the cyclic permutation check.
 *       For a subarray `sub` of length `k`, sorted is `sorted_sub`.
 *       We need to check if `sub` is a cyclic shift of `sorted_sub`.
 *       This means `sub` is equal to `sorted_sub` rotated by `s` positions, i.e., `sub[i] == sorted_sub[(i+s) % k]` for some `s`.
 *       This means `sub[i]` must appear in `sorted_sub` at index `j`, and `sub[(i+1)%k]` must appear at index `(j+1)%k` (modulo k).
 *       Consider the indices of elements in `sub` relative to their positions in `sorted_sub`.
 *       For each element `x` in `sub` at index `i`, find its index `p_x` in `sorted_sub`.
 *       Then `(i - p_x + k) % k` must be constant for all elements `x` in `sub`.
 *       This is incorrect. The indices are not unique if there are duplicates.
 *
 *       Correct Check for `sub` being a cyclic shift of `sorted_sub`:
 *       1. Create `sorted_sub`.
 *       2. For each element `x` in `sub` at index `i`, find *all* its occurrences in `sorted_sub`.
 *       3. Let `pos_in_sub[i]` be the index of `sub[i]` in `sorted_sub`. This requires mapping elements from `sub` to `sorted_sub`.
 *       4. The condition for cyclic shift is that `(pos_in_sub[i] - i + k) % k` is constant for all `i`. This assumes unique elements.
 *
 *       With duplicates:
 *       1. Create `sorted_sub`.
 *       2. Store original indices for `sorted_sub`. E.g., `sorted_sub_with_indices = [(val, original_index), ...]`.
 *       3. For `sub`, we have `sub[i]`. We need to match `sub[i]` with its corresponding element in `sorted_sub`.
 *       4. A crucial observation: If `sub` is a cyclic shift of `sorted_sub`, then the count of elements `sub[i]` that are strictly greater than `sub[0]` is the same as the count of elements in `sorted_sub` that are strictly greater than `sorted_sub[0]` (after appropriate shift).
 *
 *       Let's use the `sorted_sub_doubled` approach, but optimize the check.
 *       For subarray `sub` and its sorted version `sorted_sub`:
 *       We want to find `s` such that `sub[j] == sorted_sub[(j+s)%k]` for all `j`.
 *       This is equivalent to checking if `sub` matches `sorted_sub` shifted by `s`.
 *       Instead of iterating through `s`, we can use string matching algorithms on the integer arrays.
 *       Create `pattern = sub` and `text = sorted_sub + sorted_sub`. We need to find if `pattern` occurs in `text`.
 *       This can be done using KMP in `O(k)` time after constructing `text` (which takes `O(k)`).
 *       So, for each subarray: `O(k log k)` for sorting + `O(k)` for KMP.
 *       Total for a divisor `k`: `(n/k) * (O(k log k) + O(k)) = O(n log k + n) = O(n log k)`.
 *       Sum over all divisors `k` of `n`: `Sum_{k|n} O(n log k)`.
 *       The maximum value of `log k` is `log n`.
 *       This sum is `O(n * Sum_{k|n} log k)`.
 *       `Sum_{k|n} log k = log(Product_{k|n} k)`.
 *       The product of divisors `k` of `n` is `n^(d(n)/2)`, where `d(n)` is the number of divisors.
 *       So `log(Product_{k|n} k) = (d(n)/2) * log n`.
 *       The complexity becomes `O(n * d(n) * log n)`.
 *       For `n=10^5`, `d(n)` is at most around 128. `log n` is around 17.
 *       `10^5 * 128 * 17` is roughly `2 * 10^8`, which might be acceptable.
 *
 *       Let's implement KMP check for cyclic permutation.
 *
 *       KMP preprocessing (compute LPS array): O(pattern length)
 *       KMP search: O(text length)
 *
 *       Function `isCyclic(sub, sorted_sub)`:
 *         `k = sub.length`
 *         `text = new int[2*k]`
 *         for `i = 0` to `k-1`: `text[i] = sorted_sub[i]`, `text[i+k] = sorted_sub[i]`
 *         `pattern = sub`
 *         Compute LPS array for `pattern`.
 *         Search `pattern` in `text` using KMP.
 *         If found, return true. Else, return false.
 *
 *       Let's try an example: `nums = [3,1,2]`, `n=3`. Divisors: 1, 3.
 *       k=1:
 *         Subarrays: `[3]`, `[1]`, `[2]`.
 *         For `[3]`: sorted `[3]`. Cyclic match.
 *         For `[1]`: sorted `[1]`. Cyclic match.
 *         For `[2]`: sorted `[2]`. Cyclic match.
 *         Is k=1 sortable? Yes, all subarrays of length 1 are trivially sortable.
 *         Wait, the problem says "sort nums in non-decreasing order".
 *         If k=1, the operation is to cyclically rotate each element. This does nothing.
 *         So, if k=1, `nums` must already be sorted.
 *         Example 1: `nums = [3,1,2]`, `n=3`. `k=1`. Not sorted. `k=1` is NOT sortable.
 *         Example 3: `nums = [5,8]`, `n=2`. `k=1`. `[5]` sorted, `[8]` sorted. Array `[5,8]` is already sorted. So `k=1` IS sortable.
 *
 *       Revised check for `k=1`: If `k=1`, the array `nums` must already be sorted.
 *
 *       Correct logic for `k=1`:
 *       If `k=1`, then `nums` is partitioned into `n` subarrays of length 1. Rotating a single element does nothing. So, for `k=1` to be sortable, the original `nums` array must already be sorted non-decreasingly.
 *
 *       Let's re-check example 1: `nums = [3,1,2]`, `n=3`. Divisors: 1, 3.
 *       k=1: `nums` is not sorted. So k=1 is not sortable.
 *       k=3: subarray `[3,1,2]`. Sorted `[1,2,3]`.
 *         Check if `[3,1,2]` is a cyclic shift of `[1,2,3]`.
 *         `text = [1,2,3,1,2,3]`, `pattern = [3,1,2]`.
 *         Using KMP:
 *         LPS for `[3,1,2]`: `[0,0,0]` (no proper prefix is also a suffix).
 *         Search:
 *           `i=0, j=0`: `text[0]=1`, `pattern[0]=3`. Mismatch. `j=0`.
 *           `i=1, j=0`: `text[1]=2`, `pattern[0]=3`. Mismatch. `j=0`.
 *           `i=2, j=0`: `text[2]=3`, `pattern[0]=3`. Match. `j=1`.
 *           `i=3, j=1`: `text[3]=1`, `pattern[1]=1`. Match. `j=2`.
 *           `i=4, j=2`: `text[4]=2`, `pattern[2]=2`. Match. `j=3`.
 *           `j == k` (3). Pattern found at `text` index `i - j = 4 - 3 = 1`. Wait, this is index in `text`. The actual start index in the first `k` elements of `text` is what matters. The pattern `[3,1,2]` is found starting at `text[2]`. So it is a cyclic shift.
 *         So k=3 is sortable.
 *         Sum = 3. Correct for Example 1.
 *
 *       Example 2: `nums = [7,6,5]`, `n=3`. Divisors: 1, 3.
 *       k=1: `nums` not sorted. k=1 not sortable.
 *       k=3: subarray `[7,6,5]`. Sorted `[5,6,7]`.
 *         Check if `[7,6,5]` is a cyclic shift of `[5,6,7]`.
 *         `text = [5,6,7,5,6,7]`, `pattern = [7,6,5]`.
 *         LPS for `[7,6,5]`: `[0,0,0]`.
 *         Search:
 *           `i=0, j=0`: `text[0]=5 != pattern[0]=7`. `j=0`.
 *           `i=1, j=0`: `text[1]=6 != pattern[0]=7`. `j=0`.
 *           `i=2, j=0`: `text[2]=7 == pattern[0]=7`. Match. `j=1`.
 *           `i=3, j=1`: `text[3]=5 != pattern[1]=6`. Mismatch. `j = lps[j-1] = lps[0] = 0`.
 *           `i=3, j=0`: `text[3]=5 != pattern[0]=7`. `j=0`.
 *           `i=4, j=0`: `text[4]=6 != pattern[0]=7`. `j=0`.
 *           `i=5, j=0`: `text[5]=7 == pattern[0]=7`. Match. `j=1`.
 *           `i=6` (end of text). Pattern not found.
 *         So k=3 is not sortable.
 *         Sum = 0. Correct for Example 2.
 *
 *       Example 3: `nums = [5,8]`, `n=2`. Divisors: 1, 2.
 *       k=1: `nums` is sorted. k=1 sortable. Sum = 1.
 *       k=2: subarray `[5,8]`. Sorted `[5,8]`.
 *         Check if `[5,8]` is a cyclic shift of `[5,8]`.
 *         `text = [5,8,5,8]`, `pattern = [5,8]`.
 *         LPS for `[5,8]`: `[0,0]`.
 *         Search:
 *           `i=0, j=0`: `text[0]=5 == pattern[0]=5`. Match. `j=1`.
 *           `i=1, j=1`: `text[1]=8 == pattern[1]=8`. Match. `j=2`.
 *           `j == k` (2). Pattern found.
 *         So k=2 is sortable. Sum = 1 + 2 = 3. Correct for Example 3.
 *
 *       The KMP approach seems correct and within complexity bounds.
 *
 *       Implementation details:
 *       - `getDivisors(n)` function.
 *       - `isSortable(k, nums)` function.
 *       - Inside `isSortable`:
 *         - Special case for `k=1`.
 *         - Loop through subarrays.
 *         - For each subarray:
 *           - Copy subarray.
 *           - Sort copy.
 *           - Call `checkCyclicShift(sub, sorted_sub)`
 *       - `checkCyclicShift(pattern_arr, text_arr_doubled)` using KMP.
 *       - KMP `computeLPSArray(pattern_arr)`.
 *
 *       Need to implement KMP efficiently for integer arrays.
 *       The `text` array for KMP will be `sorted_sub_doubled`. The `pattern` is `sub`.
 *       The indices should be handled carefully.
 *
 *       The constraints on `nums[i]` and `n` are up to `10^5`. Integer arrays are fine.
 *       The total sum could potentially exceed `Integer.MAX_VALUE` if there are many large sortable `k` values.
 *       Max sum could be `Sum of divisors of n`. For `n=10^5`, `sigma_1(n)` can be large but for typical numbers it's manageable. The problem asks for an integer, so assume it fits in `int`.
 *
 *       Consider edge cases:
 *       - `n=1`: `nums=[x]`. Divisors of 1 are just 1.
 *         k=1: `nums` is sorted. k=1 is sortable. Sum = 1.
 *
 *       Alternative for `checkCyclicShift` without explicit KMP:
 *       For subarray `sub` and `sorted_sub`:
 *       If `sub` is a cyclic shift of `sorted_sub`, then `sub` must appear as a subsequence in `sorted_sub + sorted_sub`.
 *       We can check this by:
 *       Iterate through `sorted_sub + sorted_sub` to find the first element of `sub`.
 *       Once found at index `start_idx` in `sorted_sub_doubled`, check if `sub[j] == sorted_sub_doubled[start_idx + j]` for `j` from 0 to `k-1`.
 *       If `sub[0]` appears multiple times in `sorted_sub`, try each occurrence as a starting point.
 *       This is essentially what KMP does but implemented more directly.
 *       The search can be optimized.
 *       If `sub` is a cyclic shift of `sorted_sub`, then `sub[0]` must be equal to some `sorted_sub[p]`.
 *       The potential shift `s` is `(p - 0 + k) % k`.
 *       So, find all indices `p` where `sorted_sub[p] == sub[0]`.
 *       For each such `p`, calculate `s = p`.
 *       Then check if `sub[i] == sorted_sub[(i+s) % k]` for all `i = 1 to k-1`.
 *       This is `O(k^2)` in the worst case if `sub[0]` appears many times, or `O(k)` if `sub[0]` is unique or appears few times.
 *       Example: `sub = [1,1,1]`, `sorted_sub = [1,1,1]`. `sub[0] = 1`. `sorted_sub[0]=1`, `sorted_sub[1]=1`, `sorted_sub[2]=1`.
 *       p=0: s=0. Check `sub[1]==sorted_sub[1]`, `sub[2]==sorted_sub[2]`. Yes.
 *       p=1: s=1. Check `sub[1]==sorted_sub[(1+1)%3=2]`, `sub[2]==sorted_sub[(2+1)%3=0]`. No.
 *       p=2: s=2. Check `sub[1]==sorted_sub[(1+2)%3=0]`, `sub[2]==sorted_sub[(2+2)%3=1]`. No.
 *
 *       The naive check for cyclic shift:
 *       For subarray `sub` and sorted `sorted_sub`:
 *         `k = sub.length`
 *         `found_shift = false`
 *         For `s` from `0` to `k-1`:
 *           `is_current_shift_valid = true`
 *           For `i` from `0` to `k-1`:
 *             If `sub[i] != sorted_sub[(i+s) % k]`:
 *               `is_current_shift_valid = false`
 *               Break
 *           If `is_current_shift_valid`:
 *             `found_shift = true`
 *             Break
 *         Return `found_shift`
 *       This is `O(k^2)` per subarray. Total `O(n/k * k^2) = O(nk)` per divisor.
 *       Sum over divisors: `Sum_{k|n} O(nk)`. This is `O(n * Sum_{k|n} k) = O(n * sigma_1(n))`.
 *       This is likely too slow given `n=10^5`.
 *
 *       Let's stick to KMP for `O(n log k)` per divisor, totaling `O(n * d(n) * log n)`.
 *       We need to implement KMP.
 *
 *       The `computeLPSArray` function:
 *       `lps = new int[pattern.length]`
 *       `length = 0` (length of previous longest prefix suffix)
 *       `i = 1`
 *       `lps[0] = 0`
 *       while `i < pattern.length`:
 *         if `pattern[i] == pattern[length]`:
 *           `length++`
 *           `lps[i] = length`
 *           `i++`
 *         else:
 *           if `length != 0`:
 *             `length = lps[length-1]`
 *           else:
 *             `lps[i] = 0`
 *             `i++`
 *       Return `lps`.
 *
 *       The `KMPSearch` function:
 *       `n_text = text.length`
 *       `m_pattern = pattern.length`
 *       `lps = computeLPSArray(pattern)`
 *       `i = 0` (index for text)
 *       `j = 0` (index for pattern)
 *       while `i < n_text`:
 *         if `pattern[j] == text[i]`:
 *           `i++`
 *           `j++`
 *         if `j == m_pattern`:
 *           // Pattern found at index i-j in text
 *           return true
 *         else if `i < n_text` and `pattern[j] != text[i]`:
 *           if `j != 0`:
 *             `j = lps[j-1]`
 *           else:
 *             `i++`
 *       Return false.
 *
 *       The `checkCyclicShift` function:
 *       `k = pattern.length`
 *       `text_doubled = new int[2 * k]`
 *       for `i = 0` to `k-1`: `text_doubled[i] = text_arr[i]`, `text_doubled[i+k] = text_arr[i]`
 *       Return `KMPSearch(pattern_arr, text_doubled)`
 *
 *       The `isSortable` function:
 *       `n = nums.length`
 *       if `k == 1`:
 *         Check if `nums` is sorted. Return true if sorted, false otherwise.
 *       Loop `i` from `0` to `n-1` step `k`:
 *         Extract `sub_arr` (from `nums` indices `i` to `i+k-1`).
 *         Create `sorted_sub_arr` by copying `sub_arr` and sorting it.
 *         If `!checkCyclicShift(sub_arr, sorted_sub_arr)`:
 *           Return `false`
 *       Return `true`
 *
 *       The `getDivisors` function:
 *       Loop `i` from `1` to `sqrt(n)`.
 *       If `n % i == 0`:
 *         Add `i` to divisors.
 *         If `i * i != n`, add `n / i` to divisors.
 *       Return sorted list of divisors.
 *
 *       Main function `sumOfSortableIntegers(nums)`:
 *       `n = nums.length`
 *       `divisors = getDivisors(n)`
 *       `total_sum = 0`
 *       For `k` in `divisors`:
 *         If `isSortable(k, nums)`:
 *           `total_sum += k`
 *       Return `total_sum`
 *
 *       Consider using `ArrayList<Integer>` for subarrays and KMP patterns/texts for simplicity in Java.
 *       The KMP implementation needs to be careful with array indexing.
 */
class Solution {

    /**
     * Calculates all divisors of a given integer n.
     * @param n The integer to find divisors for.
     * @return A List of integers representing the divisors of n.
     */
    private List<Integer> getDivisors(int n) {
        List<Integer> divisors = new ArrayList<>();
        // Iterate up to the square root of n to find divisors.
        for (int i = 1; i * i <= n; i++) {
            if (n % i == 0) {
                divisors.add(i);
                // If i is not the square root, then n/i is also a distinct divisor.
                if (i * i != n) {
                    divisors.add(n / i);
                }
            }
        }
        // Sort divisors for consistent processing, though not strictly necessary for correctness.
        Collections.sort(divisors);
        return divisors;
    }

    /**
     * Checks if the array nums is already sorted in non-decreasing order.
     * This is a helper for the k=1 case.
     * @param nums The input array.
     * @return true if nums is sorted, false otherwise.
     */
    private boolean isArraySorted(int[] nums) {
        for (int i = 0; i < nums.length - 1; i++) {
            if (nums[i] > nums[i + 1]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if a given subarray can be sorted by cyclically rotating it.
     * A subarray 'sub' can be cyclically rotated to match its sorted version 'sorted_sub'
     * if and only if 'sub' is a cyclic permutation of 'sorted_sub'.
     * This is checked by verifying if 'sub' appears as a contiguous subsequence
     * within 'sorted_sub' concatenated with itself. KMP algorithm is used for efficient search.
     *
     * @param sub The original subarray.
     * @param sorted_sub The sorted version of the subarray.
     * @return true if the subarray is sortable by cyclic rotation, false otherwise.
     */
    private boolean checkCyclicShift(int[] sub, int[] sorted_sub) {
        int k = sub.length;
        // If k is 0 or 1, it's trivially sortable.
        if (k <= 1) {
            return true;
        }

        // Create a doubled version of sorted_sub to search for sub as a substring.
        // For example, if sorted_sub = [1, 2, 3], then text_for_search = [1, 2, 3, 1, 2, 3].
        int[] text_for_search = new int[2 * k];
        for (int i = 0; i < k; i++) {
            text_for_search[i] = sorted_sub[i];
            text_for_search[i + k] = sorted_sub[i];
        }

        // Use KMP algorithm to find if 'sub' (pattern) exists in 'text_for_search'.
        return KMPSearch(sub, text_for_search);
    }

    /**
     * Computes the Longest Proper Prefix which is also a Suffix (LPS) array
     * for the KMP algorithm.
     * The LPS array stores for each index `i`, the length of the longest proper prefix
     * of the pattern[0...i] that is also a suffix of pattern[0...i].
     *
     * @param pattern The pattern array for KMP.
     * @return The LPS array.
     */
    private int[] computeLPSArray(int[] pattern) {
        int m = pattern.length;
        int[] lps = new int[m];
        int length = 0; // Length of the previous longest prefix suffix
        int i = 1;
        lps[0] = 0; // LPS array for pattern[0] is always 0.

        // Loop calculates lps[i] for i = 1 to m-1
        while (i < m) {
            if (pattern[i] == pattern[length]) {
                length++;
                lps[i] = length;
                i++;
            } else {
                // This is tricky. Consider the example.
                // AAACAAAA and i = 7. The idea is similar to search step.
                // We look for the next possible longest prefix suffix
                // which is shorter than the current one.
                if (length != 0) {
                    // This is not changing i, we are trying to find a shorter prefix that matches.
                    length = lps[length - 1];
                } else {
                    // if length is 0, then the only option is lps[i] = 0.
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    }

    /**
     * Searches for a given pattern within a text using the KMP algorithm.
     *
     * @param pattern The pattern array to search for.
     * @param text The text array to search within.
     * @return true if the pattern is found in the text, false otherwise.
     */
    private boolean KMPSearch(int[] pattern, int[] text) {
        int m = pattern.length;
        int n = text.length;

        if (m == 0) return true; // Empty pattern is found everywhere.
        if (n == 0) return false; // Cannot find non-empty pattern in empty text.

        int[] lps = computeLPSArray(pattern);

        int i = 0; // Index for text
        int j = 0; // Index for pattern

        while (i < n) {
            if (pattern[j] == text[i]) {
                i++;
                j++;
            }

            if (j == m) {
                // Pattern found at index i - j
                return true; // We only need to know if it exists at least once.
                // If we needed all occurrences, we would reset j using LPS:
                // j = lps[j - 1];
            } else if (i < n && pattern[j] != text[i]) {
                // Mismatch after j matches
                // Do not match lps[0..lps[j-1]] characters,
                // they will match anyway
                if (j != 0) {
                    j = lps[j - 1];
                } else {
                    // if j = 0, we just move to the next character in text.
                    i++;
                }
            }
        }
        return false; // Pattern not found in text
    }

    /**
     * Checks if an integer k is sortable for the given array nums.
     * An integer k is sortable if k divides n and nums can be sorted by
     * partitioning it into consecutive subarrays of length k and cyclically
     * rotating each subarray independently.
     *
     * @param k The divisor to check.
     * @param nums The input array.
     * @return true if k is sortable, false otherwise.
     */
    private boolean isSortable(int k, int[] nums) {
        int n = nums.length;

        // Special case: If k is 1, the array must already be sorted.
        if (k == 1) {
            return isArraySorted(nums);
        }

        // Iterate through the array in chunks of size k.
        for (int i = 0; i < n; i += k) {
            // Extract the current subarray.
            int[] sub_array = new int[k];
            for (int j = 0; j < k; j++) {
                sub_array[j] = nums[i + j];
            }

            // Create a sorted version of the subarray.
            int[] sorted_sub_array = Arrays.copyOf(sub_array, k);
            Arrays.sort(sorted_sub_array);

            // Check if the original subarray can be rotated to match its sorted version.
            // If any subarray cannot be sorted, then k is not sortable.
            if (!checkCyclicShift(sub_array, sorted_sub_array)) {
                return false;
            }
        }

        // If all subarrays are sortable, then k is sortable.
        return true;
    }

    /**
     * Given an integer array nums of length n.
     * An integer k is called sortable if k divides n and you can sort nums in non-decreasing order
     * by sequentially performing the following operations:
     * Partition nums into consecutive subarrays of length k.
     * Cyclically rotate each subarray independently any number of times to the left or to the right.
     * Return an integer denoting the sum of all possible sortable integers k.
     *
     * @param nums The input integer array.
     * @return The sum of all sortable integers k.
     */
    public int sumOfSortableIntegers(int[] nums) {
        int n = nums.length;
        // Find all divisors of n.
        List<Integer> divisors = getDivisors(n);

        int totalSumOfSortableK = 0;

        // For each divisor k, check if it is sortable.
        for (int k : divisors) {
            if (isSortable(k, nums)) {
                totalSumOfSortableK += k;
            }
        }

        return totalSumOfSortableK;
    }
}
```