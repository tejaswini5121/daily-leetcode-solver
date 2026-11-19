/**
 * @summary Find the minimum score (max_diff + min_diff) of an array after changing two elements.
 * @link https://leetcode.com/problems/minimum-score-by-changing-two-elements/
 * @approach
 *
 * The problem asks us to minimize the score, which is the sum of the maximum and minimum absolute differences between any two elements in the array, after changing exactly two elements.
 *
 * To minimize the score, we want to make the range of the numbers (max - min) as small as possible, and also make the minimum difference as small as possible, ideally 0.
 *
 * If we can make all elements equal, the minimum difference will be 0 and the maximum difference will be 0, resulting in a score of 0. This is achievable if we can change two elements to match some existing value or to a new common value.
 *
 * Consider the sorted version of the array. The initial minimum difference is between adjacent elements, and the maximum difference is between the first and last elements.
 *
 * If we change two elements, we have a few strategic choices:
 * 1. Change the smallest two elements: If we change `nums[0]` and `nums[1]` (after sorting) to some value, we can potentially reduce the minimum difference and the overall range.
 * 2. Change the largest two elements: Similarly, changing `nums[n-1]` and `nums[n-2]` can affect the range.
 * 3. Change one smallest and one largest: This might also reduce the range.
 *
 * However, the most impactful changes to reduce the *score* come from either:
 * a) Making all elements the same. This would make both min_diff and max_diff 0.
 * b) Making the difference between the remaining "extreme" elements as small as possible.
 *
 * Let's sort the array first. `nums.sort((a, b) => a - b);`
 *
 * If we change two elements, we effectively have four scenarios that can lead to the minimum score:
 *
 * Scenario 1: Change `nums[0]` and `nums[1]` to `nums[2]`.
 *   - The new array will have `nums[2]` as its smallest element (if `nums[2]` is smaller than or equal to `nums[3]` and onwards).
 *   - The largest element remains `nums[n-1]`.
 *   - The new minimum difference can become 0 (if we change them to `nums[2]`).
 *   - The range becomes `nums[n-1] - nums[2]`.
 *   - The score will be `(nums[n-1] - nums[2]) + 0 = nums[n-1] - nums[2]`.
 *
 * Scenario 2: Change `nums[0]` and `nums[n-1]` to `nums[1]`.
 *   - The new smallest element could be `nums[1]`.
 *   - The new largest element could be `nums[n-2]`.
 *   - The range becomes `nums[n-2] - nums[1]`.
 *   - The score will be `nums[n-2] - nums[1]`.
 *
 * Scenario 3: Change `nums[n-2]` and `nums[n-1]` to `nums[n-3]`.
 *   - The smallest element remains `nums[0]`.
 *   - The new largest element could be `nums[n-3]`.
 *   - The range becomes `nums[n-3] - nums[0]`.
 *   - The score will be `nums[n-3] - nums[0]`.
 *
 * Scenario 4: Change `nums[0]` and `nums[1]` to `nums[n-1]` (or any value such that it doesn't introduce a new minimum outside the original range of the remaining elements).
 *   - If we change `nums[0]` and `nums[1]` to `nums[n-1]`, then the smallest becomes `nums[2]` (assuming `n >= 3`) and the largest is `nums[n-1]`.
 *   - The range is `nums[n-1] - nums[2]`. The score is `nums[n-1] - nums[2]`. This is already covered by Scenario 1 if we pick the correct target value.
 *
 * The key insight is that by changing two elements, we can effectively remove at most two "extreme" values from consideration. These extreme values are either the smallest ones or the largest ones.
 *
 * After sorting, the potential candidates for the minimum and maximum elements that determine the score are:
 * - `nums[0]` and `nums[1]` (smallest)
 * - `nums[n-1]` and `nums[n-2]` (largest)
 *
 * By changing two elements, we can eliminate the two smallest, the two largest, or one smallest and one largest.
 *
 * If we eliminate the two smallest (`nums[0]`, `nums[1]`), the new range is determined by `nums[2]` and `nums[n-1]`. We can make the minimum difference 0 by setting `nums[0]` and `nums[1]` to `nums[2]`. The score would be `nums[n-1] - nums[2]`.
 *
 * If we eliminate the two largest (`nums[n-2]`, `nums[n-1]`), the new range is determined by `nums[0]` and `nums[n-3]`. We can make the minimum difference 0 by setting `nums[n-2]` and `nums[n-1]` to `nums[n-3]`. The score would be `nums[n-3] - nums[0]`.
 *
 * If we eliminate `nums[0]` and `nums[n-1]`, the new range is determined by `nums[1]` and `nums[n-2]`. We can make the minimum difference 0 by setting `nums[0]` to `nums[1]` and `nums[n-1]` to `nums[n-2]`. The score would be `nums[n-2] - nums[1]`.
 *
 * We need to consider all these possibilities and take the minimum.
 *
 * The possible resulting minimum scores (which is the range after making min_diff 0 by intelligently picking target values for the changed elements) are:
 * 1. `nums[n-1] - nums[2]` (by changing `nums[0]` and `nums[1]`)
 * 2. `nums[n-2] - nums[1]` (by changing `nums[0]` and `nums[n-1]`)
 * 3. `nums[n-3] - nums[0]` (by changing `nums[n-2]` and `nums[n-1]`)
 *
 * Note that if `n=3`, `nums[n-3]` is `nums[0]`, `nums[n-2]` is `nums[1]`, `nums[n-1]` is `nums[2]`.
 *
 * Let's trace with `n=3`: `[a, b, c]` (sorted).
 * - Change `nums[0]`, `nums[1]`: new array could be `[b, b, c]`. Range `c - b`. Score `c - b`. This is `nums[2] - nums[1]`.
 * - Change `nums[0]`, `nums[2]`: new array could be `[b, b, b]`. Range `0`. Score `0`. This is `nums[1] - nums[1]`.
 * - Change `nums[1]`, `nums[2]`: new array could be `[a, a, a]`. Range `0`. Score `0`. This is `nums[0] - nums[0]`.
 *
 * The general formulas seem to cover `n=3` correctly if we interpret indices carefully.
 *
 * For `n=3`:
 * - `nums[n-1] - nums[2]` becomes `nums[2] - nums[2]` if we consider the remaining elements. This doesn't seem right.
 *
 * Let's rethink:
 *
 * Sort `nums`. Let `n = nums.length`.
 *
 * Option 1: Change `nums[0]` and `nums[1]`. We can change them to `nums[2]`. The array effectively becomes `[nums[2], nums[2], nums[2], ..., nums[n-1]]`. The min difference is 0. The max difference is `nums[n-1] - nums[2]`. Score: `nums[n-1] - nums[2]`.
 *
 * Option 2: Change `nums[n-2]` and `nums[n-1]`. We can change them to `nums[n-3]`. The array effectively becomes `[nums[0], nums[1], ..., nums[n-3], nums[n-3], nums[n-3]]`. The min difference is 0. The max difference is `nums[n-3] - nums[0]`. Score: `nums[n-3] - nums[0]`.
 *
 * Option 3: Change `nums[0]` and `nums[n-1]`. We can change `nums[0]` to `nums[1]` and `nums[n-1]` to `nums[n-2]`. The array effectively becomes `[nums[1], nums[1], nums[2], ..., nums[n-2], nums[n-2]]`. The min difference is 0. The max difference is `nums[n-2] - nums[1]`. Score: `nums[n-2] - nums[1]`.
 *
 * These three options cover the cases where we eliminate the two smallest, the two largest, or one smallest and one largest element. By setting the changed elements to the new "adjacent" smallest/largest element, we guarantee a minimum difference of 0.
 *
 * The minimum score will be the minimum of these three values:
 * `min(nums[n-1] - nums[2], nums[n-3] - nums[0], nums[n-2] - nums[1])`
 *
 * Let's test with examples:
 *
 * Example 1: `nums = [1,4,7,8,5]`
 * Sorted: `[1, 4, 7, 8, 5]` -> `[1, 4, 5, 7, 8]`. `n = 5`.
 * `nums[0] = 1`, `nums[1] = 4`, `nums[2] = 5`, `nums[3] = 7`, `nums[4] = 8`.
 *
 * Option 1: Change `nums[0]` and `nums[1]` (1 and 4). Target `nums[2]=5`. Array becomes `[5, 5, 5, 7, 8]`.
 *   Score: `nums[n-1] - nums[2]` = `nums[4] - nums[2]` = `8 - 5 = 3`.
 *
 * Option 2: Change `nums[n-2]` and `nums[n-1]` (7 and 8). Target `nums[n-3]=5`. Array becomes `[1, 4, 5, 5, 5]`.
 *   Score: `nums[n-3] - nums[0]` = `nums[2] - nums[0]` = `5 - 1 = 4`.
 *
 * Option 3: Change `nums[0]` and `nums[n-1]` (1 and 8). Target `nums[1]=4` and `nums[n-2]=7`. Array becomes `[4, 4, 5, 7, 7]`.
 *   Score: `nums[n-2] - nums[1]` = `nums[3] - nums[1]` = `7 - 4 = 3`.
 *
 * Minimum score = `min(3, 4, 3)` = `3`. Correct for Example 1.
 *
 * Example 2: `nums = [1,4,3]`
 * Sorted: `[1, 3, 4]`. `n = 3`.
 * `nums[0] = 1`, `nums[1] = 3`, `nums[2] = 4`.
 *
 * Option 1: Change `nums[0]` and `nums[1]` (1 and 3). Target `nums[2]=4`. Array becomes `[4, 4, 4]`.
 *   Score: `nums[n-1] - nums[2]` = `nums[2] - nums[2]` = `4 - 4 = 0`.
 *   Wait, the formula `nums[n-1] - nums[2]` means the largest remaining is `nums[n-1]` and the smallest remaining is `nums[2]`. For `n=3`, `nums[2]` is the last element, and `nums[2]` is the second-to-last element. This is where the indices get tricky for small `n`.
 *
 * Let's be precise about the remaining elements after modification:
 *
 * Case 1: Modify `nums[0]` and `nums[1]`.
 *   We can set them to `nums[2]`. The remaining elements are `nums[2], nums[3], ..., nums[n-1]`.
 *   The minimum value among these is `nums[2]`.
 *   The maximum value among these is `nums[n-1]`.
 *   The score (max_diff + min_diff) becomes `(nums[n-1] - nums[2]) + 0`.
 *   This holds if `n >= 3`.
 *
 * Case 2: Modify `nums[n-2]` and `nums[n-1]`.
 *   We can set them to `nums[n-3]`. The remaining elements are `nums[0], nums[1], ..., nums[n-3]`.
 *   The minimum value among these is `nums[0]`.
 *   The maximum value among these is `nums[n-3]`.
 *   The score becomes `(nums[n-3] - nums[0]) + 0`.
 *   This holds if `n >= 3`.
 *
 * Case 3: Modify `nums[0]` and `nums[n-1]`.
 *   We can set `nums[0]` to `nums[1]` and `nums[n-1]` to `nums[n-2]`. The remaining elements are `nums[1], nums[2], ..., nums[n-2]`.
 *   The minimum value among these is `nums[1]`.
 *   The maximum value among these is `nums[n-2]`.
 *   The score becomes `(nums[n-2] - nums[1]) + 0`.
 *   This holds if `n >= 3`.
 *
 *
 * Let's re-check Example 2: `nums = [1, 3, 4]`. `n = 3`.
 * `nums[0] = 1`, `nums[1] = 3`, `nums[2] = 4`.
 *
 * Case 1: Modify `nums[0]` and `nums[1]`.
 *   Remaining elements conceptually: `nums[2]` (which is 4).
 *   The range here would be 0, as there's only one effective remaining value.
 *   The formula `nums[n-1] - nums[2]` would be `nums[2] - nums[2] = 4 - 4 = 0`. This seems to work.
 *
 * Case 2: Modify `nums[n-2]` and `nums[n-1]`.
 *   Remaining elements conceptually: `nums[0]` (which is 1).
 *   The range here would be 0.
 *   The formula `nums[n-3] - nums[0]` would be `nums[0] - nums[0] = 1 - 1 = 0`. This also works.
 *
 * Case 3: Modify `nums[0]` and `nums[n-1]`.
 *   Remaining elements conceptually: `nums[1]` (which is 3).
 *   The range here would be 0.
 *   The formula `nums[n-2] - nums[1]` would be `nums[1] - nums[1] = 3 - 3 = 0`. This also works.
 *
 * Minimum score = `min(0, 0, 0)` = `0`. Correct for Example 2.
 *
 * The logic seems sound for `n >= 3`. The critical observation is that to minimize the *score* (max_diff + min_diff), we aim to make min_diff = 0. This is achievable by changing two elements. By changing two elements, we can effectively remove the two smallest, the two largest, or one smallest and one largest from the set of elements that determine the range. The remaining elements will then determine the new maximum difference, and we can ensure the minimum difference is 0 by picking appropriate values for the changed elements.
 *
 * The three combinations of elements to change are:
 * 1. `nums[0]` and `nums[1]`
 * 2. `nums[n-2]` and `nums[n-1]`
 * 3. `nums[0]` and `nums[n-1]`
 *
 * For each case, we consider the range of the *remaining* `n-2` elements and add 0 for the minimum difference.
 *
 * Case 1: Change `nums[0]`, `nums[1]`. Remaining are `nums[2], ..., nums[n-1]`. Range: `nums[n-1] - nums[2]`.
 * Case 2: Change `nums[n-2]`, `nums[n-1]`. Remaining are `nums[0], ..., nums[n-3]`. Range: `nums[n-3] - nums[0]`.
 * Case 3: Change `nums[0]`, `nums[n-1]`. Remaining are `nums[1], ..., nums[n-2]`. Range: `nums[n-2] - nums[1]`.
 *
 * We need to ensure that `nums[i]` accesses are valid. Since `nums.length >= 3`:
 *
 * Case 1: `nums[n-1]` and `nums[2]` are always valid.
 * Case 2: `nums[n-3]` and `nums[0]` are always valid.
 * Case 3: `nums[n-2]` and `nums[1]` are always valid.
 *
 * So the formulas are safe.
 *
 * The approach is:
 * 1. Sort the input array `nums`.
 * 2. Calculate the three possible scores:
 *    - `score1 = nums[nums.length - 1] - nums[2]`
 *    - `score2 = nums[nums.length - 3] - nums[0]`
 *    - `score3 = nums[nums.length - 2] - nums[1]`
 * 3. Return the minimum of `score1`, `score2`, and `score3`.
 *
 * Time Complexity:
 * Sorting takes `O(N log N)`, where N is the number of elements in `nums`.
 * Calculating the three scores and finding the minimum takes `O(1)`.
 * Total time complexity: `O(N log N)`.
 *
 * Space Complexity:
 * Sorting might use `O(log N)` or `O(N)` space depending on the implementation (e.g., Timsort in V8 is `O(N)` in worst case for auxiliary space). If sorting in-place is considered `O(1)` auxiliary space. For JavaScript, `Array.prototype.sort` often uses additional space.
 * If we consider the space used by `sort`, it could be `O(N)`.
 * If we consider only the auxiliary variables we create, it's `O(1)`.
 * Let's assume standard JavaScript `sort` might use up to `O(N)` space for its implementation.
 * If the problem statement implies modifying the original array or creating a new one, the space complexity of sort is relevant.
 * Standard competitive programming practice often treats in-place sorts as `O(1)` auxiliary space. However, JS sort is not strictly in-place. Let's state `O(N)` due to sort's potential auxiliary space usage or `O(log N)` if the sort uses that. For simplicity and typical interview expectations, `O(log N)` for typical quicksort/mergesort or `O(N)` if it's a less optimal sort. Given JS engines, `O(N)` is safer to state for the general case.
 *
 * The problem implies modifying the array, so we don't need to worry about creating a new array of size N. The sorting is the main space consumer.
 *
 * Given the constraints `nums.length <= 10^5`, `O(N log N)` time is acceptable.
 *
 * Let's confirm constraints and edge cases.
 * `3 <= nums.length <= 10^5` - Our logic relies on `n >= 3`, so this is good.
 * `1 <= nums[i] <= 10^9` - Values can be large, but absolute differences fit within standard number types.
 *
 * Final check of the logic for `n=3`:
 * `nums = [a, b, c]` (sorted)
 *
 * `score1 = nums[2] - nums[2] = 0`
 * `score2 = nums[0] - nums[0] = 0`
 * `score3 = nums[1] - nums[1] = 0`
 *
 * `min(0, 0, 0) = 0`. This is correct.
 *
 * For `n=4`: `nums = [a, b, c, d]` (sorted)
 *
 * `score1 = nums[3] - nums[2] = d - c`
 * `score2 = nums[1] - nums[0] = b - a`
 * `score3 = nums[2] - nums[1] = c - b`
 *
 * `min(d-c, b-a, c-b)`
 *
 * Example: `[1, 2, 10, 11]`. `n=4`.
 * `a=1, b=2, c=10, d=11`.
 * `score1 = 11 - 10 = 1`
 * `score2 = 2 - 1 = 1`
 * `score3 = 10 - 2 = 8`
 * `min(1, 1, 8) = 1`.
 *
 * Let's verify this manually:
 * `[1, 2, 10, 11]`
 *
 * Option 1 (change 1, 2 to 10): `[10, 10, 10, 11]`. Min diff 0, Max diff `11-10=1`. Score = 1.
 * Option 2 (change 10, 11 to 2): `[1, 2, 2, 2]`. Min diff 0, Max diff `2-1=1`. Score = 1.
 * Option 3 (change 1, 11 to 2 and 10): `[2, 2, 10, 10]`. Min diff 0, Max diff `10-2=8`. Score = 8.
 * Minimum score is 1.
 *
 * The logic holds.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var minScore = function(nums) {
    // Sort the array in ascending order.
    // This is crucial as we want to identify the smallest and largest elements.
    nums.sort((a, b) => a - b);

    // Get the length of the array.
    const n = nums.length;

    // We are allowed to change two elements. To minimize the score (max_diff + min_diff),
    // we aim to make the min_diff = 0. This is achievable by changing two elements.
    // By changing two elements, we can effectively remove the two smallest,
    // the two largest, or one smallest and one largest from influencing the range.
    // For each scenario, we calculate the potential score by considering the range
    // of the remaining n-2 elements and adding 0 for the minimum difference.

    // Scenario 1: Change the two smallest elements (nums[0] and nums[1]).
    // We can change them to nums[2]. The remaining elements are from nums[2] to nums[n-1].
    // The maximum difference among these remaining elements will be nums[n-1] - nums[2].
    // The minimum difference will be 0 (as we made them equal to nums[2]).
    // The score in this case is (nums[n-1] - nums[2]) + 0.
    const score1 = nums[n - 1] - nums[2];

    // Scenario 2: Change the two largest elements (nums[n-2] and nums[n-1]).
    // We can change them to nums[n-3]. The remaining elements are from nums[0] to nums[n-3].
    // The maximum difference among these remaining elements will be nums[n-3] - nums[0].
    // The minimum difference will be 0.
    // The score in this case is (nums[n-3] - nums[0]) + 0.
    const score2 = nums[n - 3] - nums[0];

    // Scenario 3: Change the smallest element (nums[0]) and the largest element (nums[n-1]).
    // We can change nums[0] to nums[1] and nums[n-1] to nums[n-2].
    // The remaining elements are from nums[1] to nums[n-2].
    // The maximum difference among these remaining elements will be nums[n-2] - nums[1].
    // The minimum difference will be 0.
    // The score in this case is (nums[n-2] - nums[1]) + 0.
    const score3 = nums[n - 2] - nums[1];

    // The minimum possible score is the minimum of these three scenarios.
    // We use Math.min to find the smallest score.
    return Math.min(score1, score2, score3);
};
