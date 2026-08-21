```javascript
/**
 * @file LeetCode Problem: Kth Smallest Amount With Single Denomination Combination
 * @description Given an array of coin denominations and an integer k, find the kth smallest amount that can be formed using any single denomination of coin.
 * @link https://leetcode.com/problems/kth-smallest-amount-with-single-denomination-combination/
 *
 * Approach:
 * The problem asks for the kth smallest amount that can be formed by using *any single denomination*. This means we are considering multiples of each coin denomination. For example, if coins = [3, 6, 9], the amounts we can form are:
 * - Multiples of 3: 3, 6, 9, 12, 15, ...
 * - Multiples of 6: 6, 12, 18, 24, ...
 * - Multiples of 9: 9, 18, 27, 36, ...
 *
 * The set of all possible amounts is the union of all these multiples. We need to find the kth smallest element in this union.
 *
 * A naive approach would be to generate a large number of multiples for each coin and then sort them. However, k can be as large as 2 * 10^9, making this infeasible.
 *
 * This problem can be solved efficiently using binary search on the answer. We can binary search for the kth smallest amount `x`. For a given `x`, we need to determine how many amounts less than or equal to `x` can be formed using the given denominations.
 *
 * Let's say we are checking a potential answer `mid`. We need to count how many numbers `y` (where `1 <= y <= mid`) are divisible by at least one of the `coins[i]`.
 *
 * This counting can be done using the Principle of Inclusion-Exclusion.
 *
 * The number of amounts less than or equal to `mid` that are divisible by `coins[i]` is `floor(mid / coins[i])`.
 * The number of amounts less than or equal to `mid` that are divisible by both `coins[i]` and `coins[j]` is `floor(mid / lcm(coins[i], coins[j]))`.
 * And so on.
 *
 * The principle of inclusion-exclusion states that the size of the union of sets A1, A2, ..., An is:
 * Sum |Ai| - Sum |Ai intersect Aj| + Sum |Ai intersect Aj intersect Ak| - ... + (-1)^(n-1) |A1 intersect ... intersect An|
 *
 * In our case, the sets are the multiples of each coin. The intersection of multiples of `coins[i]` and `coins[j]` is the set of multiples of `lcm(coins[i], coins[j])`.
 *
 * So, for a given `mid`, the count of numbers divisible by at least one coin is:
 * count = sum(mid / coins[i]) - sum(mid / lcm(coins[i], coins[j])) + sum(mid / lcm(coins[i], coins[j], coins[k])) - ...
 *
 * We can iterate through all possible subsets of `coins`. For each subset, we calculate the LCM of its elements. If the subset has an odd number of elements, we add `floor(mid / lcm)` to the count. If the subset has an even number of elements, we subtract `floor(mid / lcm)`.
 *
 * The `gcd` and `lcm` functions are helper functions. `lcm(a, b) = (a * b) / gcd(a, b)`. We need to be careful about potential overflow when calculating `a * b`, so it's better to use `(a / gcd(a, b)) * b`.
 *
 * The binary search range:
 * - Lower bound: 1 (smallest possible amount)
 * - Upper bound: A sufficiently large number. The maximum possible `k` is 2 * 10^9, and the smallest coin denomination is 1. So, the kth smallest amount could be up to `k * smallest_coin`, which could be around `2 * 10^9 * 25`. A safe upper bound could be `2 * 10^14` (e.g., `k * max(coins)`).
 *
 * Algorithm:
 * 1. Implement `gcd(a, b)` and `lcm(a, b)` functions.
 * 2. Define `count_multiples(mid, coins)` function:
 *    - Iterate through all non-empty subsets of `coins` using bit manipulation (from 1 to `(1 << coins.length) - 1`).
 *    - For each subset:
 *      - Calculate the LCM of the coins in the subset. If LCM exceeds `mid` at any point during calculation, it means `mid / lcm` will be 0, so we can break early.
 *      - If the subset size is odd, add `floor(mid / lcm)` to the total count.
 *      - If the subset size is even, subtract `floor(mid / lcm)` from the total count.
 *    - Return the total count.
 * 3. Perform binary search:
 *    - `low = 1`, `high = 2e14` (a sufficiently large upper bound).
 *    - `ans = high` (initialize with a value that will be updated).
 *    - While `low <= high`:
 *      - `mid = floor((low + high) / 2)`.
 *      - `count = count_multiples(mid, coins)`.
 *      - If `count >= k`: This `mid` is potentially our answer or a larger value than the answer. We try to find a smaller one. Set `ans = mid` and `high = mid - 1`.
 *      - If `count < k`: We need a larger amount. Set `low = mid + 1`.
 * 4. Return `ans`.
 *
 * Time Complexity:
 * - Binary search performs `log(Range)` iterations, where `Range` is the search space (approx. 2 * 10^14). So, `log(2 * 10^14)` is roughly 48.
 * - Inside each binary search iteration, `count_multiples` is called.
 * - `count_multiples` iterates through `2^n` subsets, where `n` is `coins.length`. Since `n <= 15`, `2^15 = 32768`.
 * - For each subset, calculating LCM takes `O(n)` time (iterating through coins in the subset) with `gcd` which is `O(log(max_coin))`.
 * - So, the overall time complexity is `O(2^n * n * log(max_coin) * log(Range))`.
 * - Given `n <= 15`, this is roughly `32768 * 15 * log(25) * 48`, which is feasible.
 *
 * Space Complexity:
 * - `O(n)` for storing the current subset of coins during LCM calculation, or `O(1)` if we consider the subset generation as part of the iteration without explicit storage. The `gcd` and `lcm` functions use constant additional space.
 * - Thus, the space complexity is `O(1)` if we don't count the input array.
 */

/**
 * Calculates the greatest common divisor (GCD) of two numbers.
 * @param {number} a
 * @param {number} b
 * @returns {number} The GCD of a and b.
 */
const gcd = (a, b) => {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
};

/**
 * Calculates the least common multiple (LCM) of two numbers.
 * Handles potential overflow by dividing before multiplying.
 * @param {number} a
 * @param {number} b
 * @returns {number} The LCM of a and b. Returns Infinity if LCM exceeds a safe bound to prevent overflow and unnecessary calculations.
 */
const lcm = (a, b) => {
    if (a === 0 || b === 0) return 0;
    // Use BigInt for intermediate calculation to prevent overflow before division
    // Although with given constraints, standard number might suffice if done carefully.
    // (a * b) / gcd(a, b) can overflow.
    // A safer way is (a / gcd(a, b)) * b.
    // We also need to check if the result exceeds a reasonable upper bound for our binary search.
    // A large number like 2e14 is the upper bound of our search. If LCM exceeds this,
    // floor(mid / lcm) will be 0 anyway.
    const commonDivisor = gcd(a, b);
    // To prevent intermediate overflow, perform division first.
    // Check if a / commonDivisor will result in a value such that multiplied by b
    // exceeds a threshold (e.g., a value larger than our binary search upper bound).
    // A threshold slightly larger than the maximum possible answer (e.g., 2e14 * 2) can be used.
    // For simplicity, let's assume standard numbers are sufficient if we are careful.
    // If a is very large and b is very large, their product can overflow.
    // If a/gcd(a,b) * b results in a number too large, it's practically infinity for our purpose.
    // The maximum value of mid in binary search is around 2e14.
    // If lcm > mid, then mid / lcm = 0. So we can cap lcm at a value slightly larger than max mid.
    // Let's use a threshold of 4e14 for lcm check.
    const SAFE_LCM_THRESHOLD = 4e14; // A value larger than our expected max answer
    
    // Calculate potentially large product carefully
    // Using BigInt for intermediate step is safer, but constraints might allow careful number arithmetic.
    // If a/commonDivisor is large, and b is large, the product can overflow.
    // Example: lcm(25, 24) = 600. lcm(25, 23) = 575.
    // Consider lcm of multiple numbers: lcm(1, 2, 3, ..., 15)
    // lcm of numbers up to 25 can grow very large.
    // e.g., lcm(23, 24, 25) = lcm(23, 600) = 23 * 600 = 13800.
    // lcm(19, 23, 24, 25) = lcm(19, 13800) = 19 * 13800 = 262200.
    // The maximum LCM of a subset of numbers up to 25 would be lcm of primes less than 25, e.g., 2,3,5,7,11,13,17,19,23.
    // lcm(2,3,5,7,11,13,17,19,23) is a very large number.
    // We need to cap the LCM calculation if it exceeds `mid` or our search upper bound.
    
    // Instead of checking against SAFE_LCM_THRESHOLD directly, check if intermediate multiplication would overflow.
    // If a/commonDivisor > Number.MAX_SAFE_INTEGER / b, then overflow will occur.
    // Given our binary search range, we only care if lcm <= mid.
    // If a/commonDivisor * b exceeds `mid`, then floor(mid / lcm) is 0.
    // This is critical. We need to ensure that if lcm exceeds `mid`, we return a value that correctly signals this.
    // Returning `mid + 1` or `SAFE_LCM_THRESHOLD` would work.
    
    let res = (a / commonDivisor);
    if (res > SAFE_LCM_THRESHOLD / b) { // Check for potential overflow before multiplication
        return SAFE_LCM_THRESHOLD; // Return a value that ensures mid / lcm is 0
    }
    res *= b;
    return res;
};

/**
 * Counts how many numbers less than or equal to `limit` are divisible by at least one of the coins.
 * Uses the Principle of Inclusion-Exclusion.
 * @param {number} limit The upper bound for counting multiples.
 * @param {number[]} coins The array of coin denominations.
 * @returns {number} The count of numbers <= limit divisible by at least one coin.
 */
const countMultiples = (limit, coins) => {
    let count = 0;
    const n = coins.length;

    // Iterate through all non-empty subsets of coins using bit manipulation.
    // A subset is represented by a bitmask from 1 to (1 << n) - 1.
    for (let i = 1; i < (1 << n); i++) {
        let currentLcm = 1;
        let setBits = 0; // Counts the number of elements in the current subset.

        // For each bit in the mask 'i'
        for (let j = 0; j < n; j++) {
            // If the j-th bit is set, it means coins[j] is in the current subset.
            if ((i >> j) & 1) {
                setBits++;
                // Calculate LCM of the current subset.
                // If currentLcm becomes larger than 'limit' during calculation,
                // further calculations for this subset are not needed as mid/lcm will be 0.
                // We can stop processing this subset and proceed to the next one.
                currentLcm = lcm(currentLcm, coins[j]);
                if (currentLcm > limit) {
                    break; // Optimization: if LCM exceeds limit, mid/lcm will be 0.
                }
            }
        }

        // If currentLcm exceeded the limit, we already broke the inner loop.
        // This check ensures we don't process if it's already too large.
        if (currentLcm > limit) {
            continue;
        }

        // Apply Inclusion-Exclusion Principle:
        // If the number of elements in the subset (setBits) is odd, add multiples.
        // If the number of elements is even, subtract multiples.
        if (setBits % 2 === 1) {
            count += Math.floor(limit / currentLcm);
        } else {
            count -= Math.floor(limit / currentLcm);
        }
    }
    return count;
};


/**
 * @param {number[]} coins
 * @param {number} k
 * @return {number}
 */
var kthSmallestAmount = function(coins, k) {
    // Binary search for the kth smallest amount.
    // The possible amounts range from 1 up to a large number.
    // A safe upper bound for the kth smallest amount could be k * max(coin denomination).
    // Since k can be 2 * 10^9 and max coin can be 25, the upper bound could be ~5 * 10^10.
    // However, the problem states coins[i] <= 25.
    // The kth smallest amount might be related to the LCM of coins.
    // A safe, large upper bound for binary search is 2 * 10^14.
    // For example, if coins = [1], k = 2 * 10^9, the answer is 2 * 10^9.
    // If coins = [25], k = 2 * 10^9, the answer is 25 * 2 * 10^9 = 5 * 10^10.
    // Let's use a slightly larger bound like 4 * 10^10 or even 2 * 10^14 to be absolutely safe.
    // The constraints on `coins[i]` and `k` suggest that the answer can be quite large.
    // Let's consider the worst case: k = 2 * 10^9 and coins = [25]. The answer is 5 * 10^10.
    // If coins = [25, 24, ...], the LCM can grow.
    // The largest possible LCM of numbers up to 25 is lcm(primes <= 25) = lcm(2,3,5,7,11,13,17,19,23). This is a huge number.
    // However, we are limited by `k`. The `k`th amount will not exceed `k * min(coins)`.
    // With `min(coins) = 1` and `k = 2 * 10^9`, answer can be `2 * 10^9`.
    // With `min(coins) = 25` and `k = 2 * 10^9`, answer can be `50 * 10^9`.
    // A bound of 10^11 seems reasonable. Let's use 2e14 to be very safe as per common LeetCode binary search practices.
    
    let low = 1;
    let high = 2e14; // A sufficiently large upper bound.
    let ans = high; // Initialize answer to a value that will be updated.

    while (low <= high) {
        // Calculate mid point. Use bitwise right shift for integer division by 2.
        // Ensure mid is calculated without overflow if low and high are very large.
        // (low + high) / 2 is safe in JS for numbers up to Number.MAX_SAFE_INTEGER.
        // For values close to 2e14, low+high might exceed 2e14, but is still within JS number limits.
        let mid = Math.floor((low + high) / 2);

        // Count how many numbers less than or equal to 'mid' can be formed.
        let count = countMultiples(mid, coins);

        // If the count of formable amounts up to 'mid' is at least 'k',
        // it means 'mid' could be our answer, or the answer is smaller.
        // So, we try to find a smaller 'mid' by searching in the lower half.
        if (count >= k) {
            ans = mid; // 'mid' is a potential answer
            high = mid - 1; // Try to find a smaller answer
        } else {
            // If the count is less than 'k', we need a larger amount.
            // Search in the upper half.
            low = mid + 1;
        }
    }

    return ans;
};
```