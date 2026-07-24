/**
 * Problem: Number of Unique XOR Triplets II
 * Summary: Given an integer array nums, find the number of unique XOR values resulting from triplets (nums[i] XOR nums[j] XOR nums[k]) where i <= j <= k.
 * Link: https://leetcode.com/problems/number-of-unique-xor-triplets-ii/
 *
 * Approach:
 * The problem asks for unique XOR sums of three elements from the array, with the condition i <= j <= k.
 * The constraints are nums.length <= 1500 and nums[i] <= 1500.
 * A naive O(N^3) approach would be to iterate through all possible (i, j, k) triplets, calculate their XOR sum, and store it in a Set to count unique values.
 * N^3 for N=1500 is (1500)^3 = 3.375 * 10^9, which is too slow.
 *
 * We need a more efficient approach. Let's analyze the properties of XOR.
 * The maximum value of nums[i] is 1500. This means each number fits in 11 bits (2^10 = 1024, 2^11 = 2048).
 * The maximum possible XOR sum of three such numbers would also be less than 2048.
 *
 * The constraint i <= j <= k is crucial. It means we can pick the same element multiple times.
 *
 * Let's consider a dynamic programming approach or a variation of it.
 * We can pre-calculate unique XOR sums for two elements, and then use that to find sums for three elements.
 *
 * One common optimization for XOR problems is to count frequencies or use a frequency array/map.
 * Since nums[i] values are small (up to 1500), we can use a frequency array `counts` to store how many times each number appears in `nums`.
 * Let `uniqueNums` be the set of unique numbers present in `nums`.
 *
 * The problem is effectively asking for unique values of `a XOR b XOR c` where `a, b, c` are elements from `nums`.
 * The condition `i <= j <= k` implies we can pick `a=nums[i]`, `b=nums[j]`, `c=nums[k]` from the original array.
 * However, if we only care about the values `a, b, c` and not their original indices, and we have their counts, we can iterate over unique numbers.
 *
 * Let's simplify: we need `x ^ y ^ z` where `x, y, z` are values from `nums`.
 *
 * If we iterate through `x` and `y` (from the unique numbers in `nums`), we can calculate `x ^ y`.
 * Then, for each `x ^ y`, we need to XOR it with `z` (another unique number in `nums`).
 *
 * Let `uniqueXorPairs` be a Set to store all possible `a XOR b` values, considering the counts.
 * We can iterate `a` from `uniqueNums`, `b` from `uniqueNums`.
 * - If `a == b`: we need `counts[a] >= 2` to pick two `a`'s.
 * - If `a != b`: we need `counts[a] >= 1` and `counts[b] >= 1`.
 *
 * A simpler approach might be to just consider the distinct values in `nums`. Let these be `distinctNums`.
 * Let `dp[i]` be the set of all unique XOR sums we can form using `i` elements from `nums`.
 * `dp[1]` would be the set of all distinct values in `nums`.
 * `dp[2]` would be `a XOR b` for all `a, b` from `nums`.
 * `dp[3]` would be `a XOR b XOR c` for all `a, b, c` from `nums`.
 *
 * Building `dp[k]` from `dp[k-1]`:
 * `dp[k]` = { `prev_xor_sum XOR val` | `prev_xor_sum` in `dp[k-1]`, `val` in `nums` }
 *
 * This approach correctly enumerates all possible XOR sums using `k` elements, but it doesn't strictly adhere to `i <= j <= k`.
 * However, because XOR is commutative and associative, `nums[i] XOR nums[j] XOR nums[k]` is just a value `v1 XOR v2 XOR v3` where `v1, v2, v3` are elements from `nums`. The specific indices don't matter *for the final value*, only for whether that combination of values is *possible*.
 *
 * If we have `nums = [A, A, B]`, then:
 * `A XOR A XOR A` is possible (indices 0,0,0 or 1,1,1 or 0,0,1 or 0,1,1 etc)
 * `A XOR A XOR B` is possible
 * `A XOR B XOR B` is possible
 * `B XOR B XOR B` is possible (if there were 3 B's)
 *
 * Let's process the input `nums` to get a frequency map `freqMap`.
 * Also, get `distinctNums` (an array of unique values in `nums`).
 *
 * `set1` will store unique XOR sums of 1 element.
 * Initialize `set1` with all distinct values from `nums`.
 *
 * `set2` will store unique XOR sums of 2 elements.
 * For each `x` in `distinctNums`:
 *   For each `y` in `distinctNums`:
 *     If `x == y` and `freqMap[x] >= 2`: add `x XOR y` to `set2`.
 *     If `x != y`: add `x XOR y` to `set2`.
 *
 * `set3` will store unique XOR sums of 3 elements.
 * For each `xy_xor` in `set2`:
 *   For each `z` in `distinctNums`:
 *     Add `xy_xor XOR z` to `set3`.
 *
 * This approach seems correct and addresses the repeated elements through the frequency map, by ensuring we have enough elements to form `x XOR y` or `x XOR y XOR z`.
 * Let's check the constraints.
 * Max `nums[i]` is 1500. So `distinctNums.length` is at most 1500.
 *
 * `set1` size: at most 1500.
 * `set2` generation:
 *   Outer loop `distinctNums.length` times (max 1500).
 *   Inner loop `distinctNums.length` times (max 1500).
 *   Total iterations: `1500 * 1500 = 2.25 * 10^6`.
 *   Each operation is a Set add and XOR, which is fast.
 *   Max value in `set2` is `1500 XOR 1500` (less than 2048).
 *   `set2` size: at most 2048 (since values are bounded by `2*MAX_VAL_BITS`). Max 2048 because `A XOR B` will have bits set only up to the highest bit of A or B. If max value is 1500 (10111011100_2), then max XOR sum is less than 2^11 = 2048.
 *
 * `set3` generation:
 *   Outer loop `set2.size` times (max 2048).
 *   Inner loop `distinctNums.length` times (max 1500).
 *   Total iterations: `2048 * 1500 = 3.072 * 10^6`.
 *   Each operation is a Set add and XOR.
 *   `set3` size: at most 2048.
 *
 * Overall complexity:
 * 1. Building `freqMap` and `distinctNums`: O(N) where N is `nums.length`. At most 1500 operations.
 * 2. Building `set1`: O(D) where D is `distinctNums.length`. At most 1500 operations.
 * 3. Building `set2`: O(D^2). Max `1500^2` operations.
 * 4. Building `set3`: O(`set2.size` * D). Max `2048 * 1500` operations.
 *
 * Dominant term is `O(D^2 + set2.size * D)`. Given D <= 1500 and set2.size <= 2048, this is roughly `1500^2 + 2048*1500` which is in the order of `~5 * 10^6` operations, well within typical time limits (1 second allows ~10^8 operations).
 *
 * Space complexity:
 * `freqMap`: O(D) or O(MAX_VAL) depending on implementation (hash map or array). If array, O(1501).
 * `distinctNums`: O(D). At most 1500 elements.
 * `set1`, `set2`, `set3`: Each stores at most 2048 integers. O(MAX_XOR_VAL).
 * Total space complexity: O(MAX_VAL + MAX_XOR_VAL). In this case, MAX_VAL and MAX_XOR_VAL are similar, so O(MAX_VAL). This is O(1501) which is constant and very small.
 *
 * Example 1 Walkthrough:
 * `nums = [1, 3]`
 * `freqMap = {1: 2, 3: 2}` (assuming the example implies original nums are `[1,1,3,3]` or we can pick 1 and 3 two times. Ah, no, `nums = [1,3]` means we have one 1 and one 3.
 * The example output explanation (0,0,0) -> 1 XOR 1 XOR 1 suggests that if `nums` contains `1` then we can pick `1` multiple times. This means the array is essentially a "bag" of available numbers. So `nums[i]` just refers to picking the i-th number from the original array. If `nums = [1,3]`, then `nums[0]=1, nums[1]=3`.
 * `(0,0,0) -> nums[0] XOR nums[0] XOR nums[0] = 1 XOR 1 XOR 1 = 1`
 * `(0,0,1) -> nums[0] XOR nums[0] XOR nums[1] = 1 XOR 1 XOR 3 = 3`
 * `(0,1,1) -> nums[0] XOR nums[1] XOR nums[1] = 1 XOR 3 XOR 3 = 1`
 * `(1,1,1) -> nums[1] XOR nums[1] XOR nums[1] = 3 XOR 3 XOR 3 = 3`
 * Unique values: {1, 3}. Output: 2.
 *
 * My current approach with `freqMap` handles this:
 * `nums = [1, 3]`
 * `freqMap = {1: 1, 3: 1}` (actual counts)
 * `distinctNums = [1, 3]`
 *
 * `set1 = {1, 3}`
 *
 * `set2` generation:
 *   x=1, y=1: `freqMap[1]` is 1, not `>=2`. Skip.
 *   x=1, y=3: `freqMap[1]>=1`, `freqMap[3]>=1`. Add `1 XOR 3 = 2`. `set2 = {2}`.
 *   x=3, y=1: `freqMap[3]>=1`, `freqMap[1]>=1`. Add `3 XOR 1 = 2`. `set2 = {2}`.
 *   x=3, y=3: `freqMap[3]` is 1, not `>=2`. Skip.
 *
 *   So `set2 = {2}`. This is NOT correct for the problem's interpretation.
 *   The problem says `i <= j <= k`. This means we can always pick `nums[i]` three times, or `nums[i]` twice and `nums[j]` once, etc.
 *   The interpretation of `i <= j <= k` is not about distinct elements `a,b,c` being picked from `nums` if they are available.
 *   It means we are picking `nums[i]`, `nums[j]`, `nums[k]` from the *original array at those specific indices*.
 *   So if `nums = [1, 3]`, we have `nums[0]=1` and `nums[1]=3`.
 *   To pick `1 XOR 1 XOR 1`, we use `(nums[0], nums[0], nums[0])`. This is valid because `0 <= 0 <= 0`.
 *   To pick `1 XOR 1 XOR 3`, we use `(nums[0], nums[0], nums[1])`. This is valid because `0 <= 0 <= 1`.
 *   To pick `1 XOR 3 XOR 3`, we use `(nums[0], nums[1], nums[1])`. This is valid because `0 <= 1 <= 1`.
 *   To pick `3 XOR 3 XOR 3`, we use `(nums[1], nums[1], nums[1])`. This is valid because `1 <= 1 <= 1`.
 *
 *   This means that we can always pick *any* element `x` from `nums` any number of times (up to three times in a triplet), *as long as that `x` is present in `nums` at least once*.
 *   The indices `i, j, k` are not referring to distinct positions in the array, but rather selecting an element from the array at a position. If `nums[i] = A`, we can use `A` as many times as we want for `v1, v2, v3` in `v1 XOR v2 XOR v3`, provided that `A` itself is one of the distinct values in `nums`.
 *
 *   Example: `nums = [1, 3]`
 *   Possible values for `x, y, z` are from `{1, 3}`.
 *   `1 XOR 1 XOR 1 = 1`
 *   `1 XOR 1 XOR 3 = 3`
 *   `1 XOR 3 XOR 3 = 1`
 *   `3 XOR 3 XOR 3 = 3`
 *
 *   The constraint `i <= j <= k` is just to clarify that we can choose the same element multiple times if we want. It doesn't mean we need `freqMap[x] >= 2` to use `x` twice. If `x` exists in `nums` at all, we can pick it from `nums[idx]` and use `nums[idx]` again, and again.
 *
 *   So, the `freqMap` is actually NOT needed to check counts. We only need the set of `distinctNums` from `nums`.
 *
 *   Corrected approach:
 *   Let `distinctNums` be an array of unique values in `nums`.
 *   `set1`: { `x` | `x` in `distinctNums` }
 *   `set2`: { `x XOR y` | `x` in `distinctNums`, `y` in `distinctNums` }
 *   `set3`: { `xy_xor XOR z` | `xy_xor` in `set2`, `z` in `distinctNums` }
 *
 *   Example 1 with corrected approach: `nums = [1, 3]`
 *   `distinctNums = [1, 3]`
 *
 *   `set1 = {1, 3}`
 *
 *   `set2` generation:
 *     x=1, y=1: add `1 XOR 1 = 0`. `set2 = {0}`.
 *     x=1, y=3: add `1 XOR 3 = 2`. `set2 = {0, 2}`.
 *     x=3, y=1: add `3 XOR 1 = 2`. `set2 = {0, 2}`.
 *     x=3, y=3: add `3 XOR 3 = 0`. `set2 = {0, 2}`.
 *
 *   `set2 = {0, 2}`. Still not matching example's logic for intermediate steps, but let's see.
 *
 *   `set3` generation:
 *     `xy_xor = 0`:
 *       z=1: add `0 XOR 1 = 1`. `set3 = {1}`.
 *       z=3: add `0 XOR 3 = 3`. `set3 = {1, 3}`.
 *     `xy_xor = 2`:
 *       z=1: add `2 XOR 1 = 3`. `set3 = {1, 3}`.
 *       z=3: add `2 XOR 3 = 1`. `set3 = {1, 3}`.
 *
 *   Final `set3 = {1, 3}`. Size is 2. This matches Example 1 output!
 *   So the interpretation of `i <= j <= k` is indeed that we can freely pick any *value* from the set of distinct values in `nums` up to three times.
 *
 * Implementation details:
 * Use `Set` objects for `set1`, `set2`, `set3` for efficient unique value storage.
 * First pass to get `distinctNums` can be done by populating a `Set` from `nums`, then converting to an array.
 * Max `nums[i]` is 1500. A number `x` `XOR`ed with `y` will be less than `2 * 1500` (no, it will be less than the smallest power of 2 greater than 1500, which is 2048). So values will be in range `[0, 2047]`.
 *
 * The solution structure will be:
 * 1. Initialize `distinctNumsSet = new Set()` and populate it from `nums`.
 * 2. Convert `distinctNumsSet` to `distinctNumsArray = Array.from(distinctNumsSet)`.
 * 3. Initialize `set2 = new Set()`.
 * 4. Loop `x` over `distinctNumsArray`:
 *    Loop `y` over `distinctNumsArray`:
 *      `set2.add(x ^ y)`.
 * 5. Initialize `set3 = new Set()`.
 * 6. Loop `xy_xor` over `set2`:
 *    Loop `z` over `distinctNumsArray`:
 *      `set3.add(xy_xor ^ z)`.
 * 7. Return `set3.size`.
 *
 * This revised approach holds up and correctly explains Example 1.
 * Time and space complexity remain the same as derived earlier:
 * Time: O(N + D^2 + S2*D) where N is nums.length, D is distinctNums.length, S2 is set2.size.
 * Max N=1500, Max D=1500, Max S2=2048.
 * This is roughly 1500 + 1500^2 + 2048*1500 = 1500 + 2.25M + 3.072M ~ 5.3M operations, which is efficient enough.
 * Space: O(D + S2 + S3) which is O(MAX_VAL_RANGE) for numbers up to 1500, i.e., O(2048).
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
const numberOfUniqueXORTripletsII = (nums) => {
    // Step 1: Get all unique numbers from the input array nums.
    // The problem statement's i <= j <= k implies that any number
    // present in `nums` can be used multiple times in a triplet.
    // For example, if `nums = [1,3]`, we can form `1^1^1` or `1^1^3` etc.,
    // as if we have an infinite supply of each unique number present in `nums`.
    // So, we only need the set of distinct values.
    const distinctNumsSet = new Set();
    for (const num of nums) {
        distinctNumsSet.add(num);
    }
    // Convert the Set of distinct numbers to an array for easier iteration.
    const distinctNumsArray = Array.from(distinctNumsSet);

    // Step 2: Calculate all unique XOR sums of two numbers (x ^ y).
    // x and y are picked from the `distinctNumsArray`.
    // This intermediate set `set2` will contain all possible XOR sums
    // of two elements, allowing for x=y.
    const set2 = new Set();
    // Iterate over all possible first numbers (x).
    for (const x of distinctNumsArray) {
        // Iterate over all possible second numbers (y).
        for (const y of distinctNumsArray) {
            // Add their XOR sum to set2.
            set2.add(x ^ y);
        }
    }

    // Step 3: Calculate all unique XOR sums of three numbers (x ^ y ^ z).
    // We already have all `x ^ y` values in `set2`.
    // Now, we take each `xy_xor` from `set2` and XOR it with a `z` from `distinctNumsArray`.
    // This forms the final set of unique XOR triplet values.
    const set3 = new Set();
    // Iterate over all possible XOR sums of two elements.
    for (const xy_xor of set2) {
        // Iterate over all possible third numbers (z).
        for (const z of distinctNumsArray) {
            // Add the final triplet XOR sum to set3.
            set3.add(xy_xor ^ z);
        }
    }

    // Step 4: The number of unique XOR triplet values is the size of set3.
    return set3.size;
};