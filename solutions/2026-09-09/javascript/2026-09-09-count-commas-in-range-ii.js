/**
 * @param {number} n
 * @return {number}
 */
/*
Problem Summary:
Count the total number of commas used when writing all integers from 1 to n in standard number formatting. Commas are inserted every three digits from the right, for numbers with 4 or more digits.

Link: https://leetcode.com/problems/count-commas-in-range-ii/

Approach:
The problem asks us to count commas in numbers from 1 to n. A comma appears for every thousands, millions, billions, etc. This suggests a pattern related to powers of 1000.
For example:
Numbers from 1 to 999: 0 commas.
Numbers from 1000 to 9999: Each number has 1 comma. The number of such numbers is (9999 - 1000 + 1) = 9000.
Numbers from 10000 to 99999: Each number has 1 comma. The number of such numbers is (99999 - 10000 + 1) = 90000.
Numbers from 100000 to 999999: Each number has 1 comma. The number of such numbers is (999999 - 100000 + 1) = 900000.
Numbers from 1000000 to 9999999: Each number has 2 commas. The number of such numbers is (9999999 - 1000000 + 1) = 9000000.

We can observe that for a block of numbers like [10^k, 10^(k+1) - 1] where k is a multiple of 3 (e.g., k=3, 6, 9,...), numbers within this range that have exactly `(k/3)` commas can be counted.
Specifically, for ranges like [1000, 9999], [1,000,000, 9,999,999], etc., each number in these ranges has a fixed number of commas.
The number of integers with `d` digits is `9 * 10^(d-1)`.
A number has `m` commas if it is greater than or equal to `10^(3*m)`.

Let's consider the number of commas for a given `n`.
We can iterate through powers of 1000 (10^3, 10^6, 10^9, ...).
For a power of 1000, say `p = 10^3k`:
All numbers from `p` to `min(n, p * 1000 - 1)` that are within the range [1, n] will have at least `k` commas.

Consider `n` as a string to easily get its length and digits.
Let `n` be represented as a string `S`. The length of `S` is `L`.
The number of digits in `n` is `L`.
The number of full thousands blocks before `n` is `floor((L-1) / 3)`. Let this be `max_commas`.
So, numbers from `10^3` to `10^6 - 1` have 1 comma.
Numbers from `10^6` to `10^9 - 1` have 2 commas.
Numbers from `10^(3k)` to `10^(3(k+1)) - 1` have `k` commas.

We can sum up the commas for all full blocks of 1000, 1,000,000, etc., up to `n`.
And then handle the remaining partial block.

Example: n = 1002
L = 4. max_commas = floor((4-1)/3) = 1.
Block [1000, 9999]: numbers with 1 comma.
We are interested in numbers from 1000 up to 1002.
Numbers: 1000, 1001, 1002. Each has 1 comma. Total = 3.

Example: n = 1000000
L = 7. max_commas = floor((7-1)/3) = 2.
Numbers from 1 to 999: 0 commas.
Numbers from 1000 to 999999: These are numbers with 1 or 2 commas.
Consider full blocks:
Block [10^3, 10^6 - 1] = [1000, 999999]. Numbers in this range have 1 comma.
Number of integers in this block is 999999 - 1000 + 1 = 999000.
Each of these numbers has 1 comma. Total commas from this block = 999000 * 1.

Let's rethink using a mathematical approach based on powers of 1000.
Consider the count of commas up to `N`.
For `N = 1000`:
Integers from 1 to 999: 0 commas.
Integer 1000: 1 comma.
Total = 1.

For `N = 1000000`:
Integers from 1 to 999: 0 commas.
Integers from 1000 to 999999: Each has 1 comma. There are 999999 - 1000 + 1 = 999000 numbers. Total commas = 999000 * 1.
Integer 1000000: 2 commas.
Total = 999000 + 2 = 999002.

The number of commas for `n` is the sum of commas for:
1. All numbers less than the smallest number with `k+1` commas, where `k` is the number of commas in `n`.
2. All numbers between the smallest number with `k+1` commas and `n`, that fall into blocks that would have `k` commas.
3. The number `n` itself.

Let's define a helper function `countCommasUpTo(num)` that calculates the total commas from 1 to `num`.
The main function will then be `countCommasUpTo(n)`.

`countCommasUpTo(num)`:
Convert `num` to string `S`. Length `L = S.length`.
Initialize `totalCommas = 0`.
Initialize `powerOf1000 = 1000`.
Initialize `commasCount = 1`.

Loop while `powerOf1000 <= num`:
  // Calculate the upper bound of the current thousands block.
  // For 1000 (k=1), the block is [1000, 9999]. Upper bound is 1000 * 1000 - 1 = 999999.
  // For 1000000 (k=2), the block is [1000000, 9999999]. Upper bound is 1000000 * 1000 - 1 = 999999999.
  let upper_bound_of_block = powerOf1000 * 1000 - 1;
  let lower_bound_of_block = powerOf1000;

  // Consider the current block of numbers that have `commasCount` commas.
  // This block starts at `lower_bound_of_block` and ends at `upper_bound_of_block`.
  // We need to count numbers within this block that are less than or equal to `num`.

  // Case 1: The current block is entirely before `num`.
  // If `upper_bound_of_block <= num`:
  //   All numbers from `lower_bound_of_block` to `upper_bound_of_block` contribute `commasCount` commas each.
  //   Number of integers in this full block = `upper_bound_of_block - lower_bound_of_block + 1`.
  //   `totalCommas += (upper_bound_of_block - lower_bound_of_block + 1) * commasCount;`
  //   This simplifies to `(powerOf1000 * 1000 - 1) - powerOf1000 + 1` = `powerOf1000 * 1000 - powerOf1000` = `powerOf1000 * 999`.

  // Case 2: The current block is partially within `num`.
  // If `lower_bound_of_block <= num < upper_bound_of_block`:
  //   Numbers from `lower_bound_of_block` up to `num` contribute `commasCount` commas each.
  //   Number of integers in this partial block = `num - lower_bound_of_block + 1`.
  //   `totalCommas += (num - lower_bound_of_block + 1) * commasCount;`
  //   Since we only care about `num`, we can stop here or let the loop handle it.
  //   The loop condition `powerOf1000 <= num` naturally handles this.

  // Revised loop logic:
  // We iterate through the boundaries where the number of commas *increases*.
  // These boundaries are 10^3, 10^6, 10^9, ...
  // For each boundary `p = 10^(3*k)`:
  // Numbers from `p` to `min(num, p*1000 - 1)` have `k` commas.

  let p = powerOf1000; // Current boundary: 1000, 1000000, ...
  let next_p = p * 1000; // Next boundary: 1000000, 1000000000, ...
  let k = commasCount;   // Number of commas for numbers in [p, next_p - 1]

  // The range of numbers with `k` commas is [p, next_p - 1].
  // We are interested in the intersection of this range with [1, num].
  // The relevant interval is [p, min(num, next_p - 1)].

  // If the current boundary `p` is already greater than `num`, we have processed all relevant blocks.
  if (p > num) {
    break;
  }

  // Calculate the upper limit of numbers that have exactly `k` commas and are within `num`.
  // This upper limit is `min(num, next_p - 1)`.
  let current_interval_end = Math.min(num, next_p - 1);

  // The interval of numbers we are considering is from `p` to `current_interval_end`.
  // All numbers `x` in this interval `[p, current_interval_end]` have `k` commas.
  // The count of such numbers is `current_interval_end - p + 1`.
  // Add their contribution to `totalCommas`.

  // Make sure `current_interval_end` is at least `p` to avoid negative counts.
  if (current_interval_end >= p) {
    totalCommas += (current_interval_end - p + 1) * k;
  }

  // Move to the next block.
  powerOf1000 = next_p;
  commasCount++;
}

// The loop above counts commas for numbers in ranges like [1000, 9999], [1000000, 9999999], etc., up to `num`.
// However, it doesn't correctly handle the transition where numbers *start* getting commas.
// For example, for n=1002:
// L=4, max_commas = 1.
// Loop starts with powerOf1000 = 1000, commasCount = 1.
// p = 1000, next_p = 1000000, k = 1.
// current_interval_end = min(1002, 1000000 - 1) = 1002.
// current_interval_end >= p (1002 >= 1000) is true.
// totalCommas += (1002 - 1000 + 1) * 1 = 3 * 1 = 3.
// powerOf1000 becomes 1000000.
// Loop terminates because 1000000 > 1002.
// This seems correct for n=1002.

// Let's try n = 998:
// L=3.
// Loop starts with powerOf1000 = 1000, commasCount = 1.
// p = 1000.
// p > num (1000 > 998) is true. Break.
// totalCommas = 0. Correct.

// Let's try n = 9999:
// L=4. max_commas = 1.
// Loop starts with powerOf1000 = 1000, commasCount = 1.
// p = 1000, next_p = 1000000, k = 1.
// current_interval_end = min(9999, 1000000 - 1) = 9999.
// current_interval_end >= p (9999 >= 1000) is true.
// totalCommas += (9999 - 1000 + 1) * 1 = 9000 * 1 = 9000.
// powerOf1000 becomes 1000000.
// Loop terminates because 1000000 > 9999.
// Total commas for 1 to 9999 is 9000. This is correct.
// (Numbers 1-999 have 0 commas. Numbers 1000-9999 have 1 comma each. There are 9000 such numbers).

// Let's try n = 1000000:
// L=7. max_commas = 2.
// First iteration: powerOf1000 = 1000, commasCount = 1.
//   p = 1000, next_p = 1000000, k = 1.
//   current_interval_end = min(1000000, 1000000 - 1) = 999999.
//   current_interval_end >= p (999999 >= 1000) is true.
//   totalCommas += (999999 - 1000 + 1) * 1 = 999000 * 1 = 999000.
//   powerOf1000 becomes 1000000. commasCount becomes 2.
// Second iteration: powerOf1000 = 1000000, commasCount = 2.
//   p = 1000000, next_p = 1000000000, k = 2.
//   current_interval_end = min(1000000, 1000000000 - 1) = 1000000.
//   current_interval_end >= p (1000000 >= 1000000) is true.
//   totalCommas += (1000000 - 1000000 + 1) * 2 = 1 * 2 = 2.
//   powerOf1000 becomes 1000000000. commasCount becomes 3.
// Loop terminates because 1000000000 > 1000000.
// Total commas = 999000 + 2 = 999002. Correct.

// The logic seems solid. We are summing up contributions from full blocks of thousands (each number having k commas) and the partial block up to n.

// Handle the case where n is very large, up to 10^15.
// JavaScript numbers can handle up to Number.MAX_SAFE_INTEGER (2^53 - 1).
// 10^15 is within this limit. However, intermediate calculations like `powerOf1000 * 1000` might exceed it if not careful.
// `powerOf1000` will go up to `10^15` (if n is close to `10^15`).
// `next_p` could be `10^18`.
// `powerOf1000 * 1000` could be `10^18`.
// `(current_interval_end - p + 1)` could be large, multiplied by `k`.
// `k` can go up to `floor((15-1)/3) = 4`. So `k` is small.
// The product `(current_interval_end - p + 1) * k` could be large.
// If `num = 10^15`, then `L = 16`.
// `max_commas = floor((16-1)/3) = 4`.
// `k` will go up to 4.
// Consider the largest possible values:
// If `num` is slightly less than `10^18`.
// Let `num = 10^18 - 1`.
// L = 18.
// Iteration 1: p=1000, next_p=10^6, k=1. count += (10^6-1 - 1000 + 1)*1 = 999000.
// Iteration 2: p=10^6, next_p=10^9, k=2. count += (10^9-1 - 10^6 + 1)*2 = (10^9 - 10^6)*2 = (1000-1)*10^6*2 = 999 * 10^6 * 2 = 1998 * 10^6.
// Iteration 3: p=10^9, next_p=10^12, k=3. count += (10^12-1 - 10^9 + 1)*3 = (10^12 - 10^9)*3 = (1000-1)*10^9*3 = 999 * 10^9 * 3 = 2997 * 10^9.
// Iteration 4: p=10^12, next_p=10^15, k=4. count += (10^15-1 - 10^12 + 1)*4 = (10^15 - 10^12)*4 = (1000-1)*10^12*4 = 999 * 10^12 * 4 = 3996 * 10^12.
// Iteration 5: p=10^15, next_p=10^18, k=5.
//   If num is 10^15: current_interval_end = min(10^15, 10^18 - 1) = 10^15.
//   current_interval_end >= p (10^15 >= 10^15).
//   count += (10^15 - 10^15 + 1) * 5 = 1 * 5 = 5.
//   Total commas = 999000 + 1998*10^6 + 2997*10^9 + 3996*10^12 + 5.

// This sum can be very large.
// Max value of `num` is `10^15`.
// The maximum `k` would be `floor((15-1)/3) = 4`.
// The number of iterations is small (at most 5 for 10^15).
// Max `powerOf1000` will be `10^15`. `next_p` will be `10^18`.
// `current_interval_end - p + 1` could be up to `10^15`.
// `k` is at most 5.
// The product `(current_interval_end - p + 1) * k` can be up to `10^15 * 5`.
// The sum of these products will also fit within JavaScript's `Number` type (which uses 64-bit floating-point, safe up to 2^53 - 1, which is about 9 * 10^15).
// The intermediate `powerOf1000 * 1000` can indeed reach `10^18`.
// JavaScript's `Number` type can represent numbers up to approximately `1.7976931348623157e+308`.
// So, `10^18` is representable.
// The sums should also be fine.

// Let's confirm if BigInt is needed.
// Number.MAX_SAFE_INTEGER is 9007199254740991.
// 10^15 is within this range.
// 10^18 is also within this range of representable numbers, but might lose precision.
// The problem statement implies `n` is an integer. Standard JavaScript `Number` type is float.
// For precise integer arithmetic up to `10^15` and beyond, `BigInt` is generally safer.
// Let's switch to `BigInt` to be absolutely sure, especially for intermediate products like `powerOf1000 * 1000`.

// Using BigInt:
// Initialize `totalCommas = 0n`.
// `powerOf1000 = 1000n`.
// `commasCount = 1n`.

// Loop while `powerOf1000 <= num`:
//   `p = powerOf1000`
//   `next_p = p * 1000n`
//   `k = commasCount`

//   if (p > num) { break; }

//   `current_interval_end = min(num, next_p - 1n)`

//   if (current_interval_end >= p) {
//     `count_in_interval = current_interval_end - p + 1n`
//     `totalCommas += count_in_interval * k`
//   }

//   `powerOf1000 = next_p`
//   `commasCount++` // or commasCount += 1n

// The input `n` is given as a `number`. It needs to be converted to `BigInt` if we use `BigInt` throughout.
// `n = BigInt(n)` at the start.

// The problem statement uses standard number formatting.
// "A comma is inserted after every three digits from the right."
// "Numbers with fewer than 4 digits contain no commas."
// This implies standard base-10 representation.

// Consider a number like 1234567.
// Digits from right: 7, 6, 5, 4, 3, 2, 1.
// Group 1: 567 (no comma)
// Group 2: 234 (comma here -> 1,234,567)
// Group 3: 1 (no comma)
// Commas are inserted between groups. The first comma is after the 3rd digit from the right, then after the 6th, 9th, etc.
// This means a number `X` has `k` commas if `X >= 10^(3*k)`.
// Example:
// 1000: `10^3`. `k=1`. 1 comma.
// 9999: `9.999 * 10^3`. Number of digits is 4. `floor((4-1)/3) = 1`. 1 comma.
// 10000: `10^4`. Number of digits is 5. `floor((5-1)/3) = 1`. 1 comma.
// 99999: `9.9999 * 10^4`. Number of digits is 5. `floor((5-1)/3) = 1`. 1 comma.
// 100000: `10^5`. Number of digits is 6. `floor((6-1)/3) = 1`. 1 comma.
// 999999: `9.99999 * 10^5`. Number of digits is 6. `floor((6-1)/3) = 1`. 1 comma.
// 1000000: `10^6`. `k=2`. 2 commas.
// The logic of using `powerOf1000` and `commasCount` matches this.
// `commasCount` is the number of commas for numbers that START at `powerOf1000`.
// E.g., `powerOf1000 = 1000`, `commasCount = 1`. Numbers from 1000 to 999999 have 1 comma.
// `powerOf1000 = 1000000`, `commasCount = 2`. Numbers from 1000000 to 999999999 have 2 commas.

// Let's refine the `countCommasUpTo` function.
// `countCommasUpTo(N)` = sum of (count of numbers `x` in `[1, N]` such that `x` has `c` commas) * `c`.

// Alternative perspective:
// Total commas = sum over all k >= 1:
//   (Number of integers `x` in `[1, n]` such that `x` has *exactly* `k` commas) * `k`.
// A number `x` has *exactly* `k` commas if `10^(3k) <= x < 10^(3(k+1))`.

// Let's use a recursive approach or a loop that calculates contribution for each comma level.
// We need to count how many numbers in `[1, n]` fall into ranges `[10^(3k), 10^(3(k+1)) - 1]`.

// Function to calculate number of commas in [1, N].
// `calculate(N)`:
// Convert N to BigInt: `N_big = BigInt(N)`.
// `total_commas = 0n`.
// `power_of_1000 = 1000n`.
// `num_commas = 1`.

// Loop while `power_of_1000 <= N_big`:
//   // The current block of numbers for which `num_commas` applies starts at `power_of_1000`.
//   // The block ends at `power_of_1000 * 1000 - 1`.
//   `block_start = power_of_1000`.
//   `block_end = power_of_1000 * 1000n - 1n`.

//   // We are interested in the intersection of `[block_start, block_end]` and `[1, N_big]`.
//   // The effective range is `[block_start, min(N_big, block_end)]`.

//   // If `block_start` is already beyond `N_big`, we can stop.
//   if (block_start > N_big) {
//     break;
//   }

//   `effective_end = min(N_big, block_end)`.

//   // The number of integers in the range `[block_start, effective_end]` is `effective_end - block_start + 1`.
//   // Each of these integers contributes `num_commas` commas.
//   `count_in_this_level = effective_end - block_start + 1n`.
//   `total_commas += count_in_this_level * BigInt(num_commas)`.

//   // Move to the next level of commas.
//   `power_of_1000 *= 1000n`.
//   `num_commas++`.

// Return `total_commas`.

// Example: n = 1002
// N_big = 1002n.
// total_commas = 0n.
// power_of_1000 = 1000n.
// num_commas = 1.

// Iteration 1:
// power_of_1000 = 1000n <= 1002n.
// block_start = 1000n.
// block_end = 1000n * 1000n - 1n = 999999n.
// block_start (1000n) <= N_big (1002n).
// effective_end = min(1002n, 999999n) = 1002n.
// count_in_this_level = 1002n - 1000n + 1n = 3n.
// total_commas += 3n * BigInt(1) = 3n.
// power_of_1000 becomes 1000n * 1000n = 1000000n.
// num_commas becomes 2.

// Iteration 2:
// power_of_1000 = 1000000n > 1002n. Break.

// Return total_commas = 3n.

// This approach seems correct and simpler.

// Time complexity:
// The loop runs as many times as there are powers of 1000 less than or equal to `n`.
// If `n` is approximately `10^k`, the number of iterations is roughly `k/3`.
// For `n <= 10^15`, `k=15`, so iterations are about `15/3 = 5`.
// Inside the loop, operations are constant time (BigInt arithmetic).
// So, the time complexity is O(log_1000(n)), which is O(log n).

// Space complexity:
// We are using a few BigInt variables. The space used is constant, O(1).

// Let's write the code.
// The function signature should be `countCommas(n)` according to the LeetCode problem name.
// The provided example uses `n` as the parameter name.

// Need to handle the case where n < 1000 separately or ensure the loop works.
// If n = 998:
// N_big = 998n.
// total_commas = 0n.
// power_of_1000 = 1000n.
// num_commas = 1.

// Iteration 1:
// power_of_1000 = 1000n > 998n. Break.
// Return total_commas = 0n. Correct.

// The constraints say 1 <= n. So n will always be at least 1.

// Need to ensure the conversion of `n` from `number` to `BigInt` is correct.
// `BigInt(n)` works for numbers up to `2^53 - 1`.
// For larger numbers, `BigInt('1000000000000000')` is needed.
// However, the input `n` is a `number`. If `n` itself exceeds `MAX_SAFE_INTEGER`, `BigInt(n)` might be problematic.
// The problem statement says "You are given an integer n." and constraints are `1 <= n <= 10^15`.
// A standard JavaScript `number` can represent `10^15`.
// So, `BigInt(n)` should be safe. `10^15` is representable as a `number`.

// Let's ensure all calculations involving `num_commas` are done with BigInt if `total_commas` is BigInt.
// `BigInt(num_commas)` is good.
*/

/**
 * Counts the total number of commas used when writing all integers from 1 to n in standard number formatting.
 * Commas are inserted every three digits from the right, for numbers with 4 or more digits.
 *
 * Approach:
 * The core idea is to sum the contributions of commas from different magnitude groups of numbers.
 * Numbers from 1 to 999 have no commas.
 * Numbers from 1,000 to 999,999 each have 1 comma.
 * Numbers from 1,000,000 to 999,999,999 each have 2 commas.
 * In general, numbers from 10^(3k) to 10^(3(k+1)) - 1 each have k commas.
 * We iterate through these groups (powers of 1000) and calculate how many numbers within the given range [1, n] fall into each group,
 * multiplying that count by the number of commas for that group, and summing it up.
 * We use BigInt for calculations to handle large input values of n and intermediate results accurately.
 *
 * Time Complexity: O(log n) - The loop runs proportional to the number of thousands-blocks (powers of 1000) that are less than or equal to n.
 * Space Complexity: O(1) - We use a constant amount of extra space for variables.
 *
 * @param {number} n The upper limit of the range (inclusive).
 * @return {number} The total count of commas.
 */
const countCommas = (n) => {
    // Convert input n to BigInt to handle large numbers precisely.
    const N_big = BigInt(n);

    // Initialize total commas count to 0.
    let total_commas = 0n;

    // `power_of_1000` represents the start of a group of numbers that share the same number of commas.
    // For k=1, this starts at 1000 (10^3). For k=2, at 1,000,000 (10^6), and so on.
    // We initialize it to 1000n because numbers less than 1000 have no commas.
    let power_of_1000 = 1000n;

    // `num_commas` is the number of commas applied to numbers within the current `power_of_1000` group.
    // For numbers >= 1000 and < 1,000,000, num_commas = 1.
    // For numbers >= 1,000,000 and < 1,000,000,000, num_commas = 2, and so on.
    let num_commas = 1;

    // Loop as long as the start of the current group (`power_of_1000`) is less than or equal to the input `N_big`.
    // This ensures we consider all relevant magnitude groups up to `n`.
    while (power_of_1000 <= N_big) {
        // `block_start`: The first number in the current group that will have `num_commas` commas.
        const block_start = power_of_1000;

        // `block_end`: The last number in the current group that will have `num_commas` commas.
        // This is `power_of_1000 * 1000 - 1`. For example, if `power_of_1000` is 1000, `block_end` is 999,999.
        const block_end = power_of_1000 * 1000n - 1n;

        // If `block_start` itself is already greater than `N_big`, it means we have gone beyond the input range `n`.
        // All subsequent groups will also be beyond `n`, so we can break the loop.
        if (block_start > N_big) {
            break;
        }

        // `effective_end`: We are only interested in numbers up to `N_big`. So, the actual end of the range
        // for this comma level is the minimum of `N_big` and `block_end`.
        const effective_end = block_end < N_big ? block_end : N_big;
        // Alternative equivalent: const effective_end = block_end < N_big ? block_end : N_big;
        // Or using BigInt's comparison: const effective_end = block_end < N_big ? block_end : N_big;
        // A more robust way for min with BigInt:
        // const effective_end = (block_end < N_big) ? block_end : N_big; // This works because comparison operators are overloaded for BigInt.
        // Or even more explicitly:
        const effective_end_big = block_end < N_big ? block_end : N_big;


        // `count_in_this_level`: The number of integers within the range `[block_start, effective_end_big]`.
        // All these integers have exactly `num_commas` commas.
        // The count is `effective_end_big - block_start + 1`.
        const count_in_this_level = effective_end_big - block_start + 1n;

        // Add the total commas contributed by this level to `total_commas`.
        // We multiply the count of numbers by the number of commas each has.
        // Ensure `num_commas` is converted to BigInt for multiplication.
        total_commas += count_in_this_level * BigInt(num_commas);

        // Move to the next group of numbers: increase `power_of_1000` by a factor of 1000.
        power_of_1000 *= 1000n;
        // Increment the number of commas for the next group.
        num_commas++;
    }

    // Return the final total count of commas.
    return Number(total_commas); // Convert back to Number as the return type is usually expected as number, and the result will fit.
};
```