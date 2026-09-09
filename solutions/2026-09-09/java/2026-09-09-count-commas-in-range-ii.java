```java
/**
 * Problem Summary: Counts the total number of commas used when writing integers from 1 to n in standard format.
 * Commas are used as thousands separators, inserted every three digits from the right.
 * Link: https://leetcode.com/problems/count-commas-in-range-ii/
 *
 * Approach:
 * The core idea is to count the number of commas for numbers up to n.
 * A comma appears for every full thousand. For example, 1000-1999 have one comma, 2000-2999 have one comma, etc.
 * The number of commas in a number `x` is `(x - 1) / 1000`.
 * We can calculate the total number of commas by summing this value for all numbers from 1 to n.
 * However, doing this iteratively for n up to 10^15 would be too slow.
 *
 * A more efficient approach involves observing patterns.
 * For numbers up to 999, there are no commas.
 * For numbers 1000 to 9999, each number uses one comma. There are 9000 such numbers (9999 - 1000 + 1).
 * For numbers 10000 to 99999, each number uses one comma. There are 90000 such numbers.
 * For numbers 100000 to 999999, each number uses one comma. There are 900000 such numbers.
 * For numbers 1000000 to 9999999, each number uses two commas. There are 9000000 such numbers.
 *
 * The number of commas in a number `x` is `floor((number_of_digits - 1) / 3)`.
 * Or, more directly, the number of commas in `x` is `(x - 1) / 1000`. This is not quite right.
 * For example, for 1000, it's 1 comma. (1000 - 1) / 1000 = 0.
 * The correct logic is that a number `x` contributes a comma if it is a multiple of 1000, 1000000, etc., up to the number of digits.
 *
 * A better approach is to count the number of "thousands blocks" that are fully completed.
 * For a number `n`, we can count the number of times a comma is introduced.
 * The first comma appears at 1000. So numbers from 1000 to 9999 have 1 comma.
 * The second comma appears at 1000000. So numbers from 1000000 to 9999999 have 2 commas.
 *
 * Let's consider groups of numbers:
 * [1, 999]: 0 commas
 * [1000, 9999]: Each number has 1 comma. Total numbers: 9000. Total commas: 9000 * 1.
 * [10000, 99999]: Each number has 1 comma. Total numbers: 90000. Total commas: 90000 * 1.
 * [100000, 999999]: Each number has 1 comma. Total numbers: 900000. Total commas: 900000 * 1.
 * [1000000, 9999999]: Each number has 2 commas. Total numbers: 9000000. Total commas: 9000000 * 2.
 *
 * We can generalize this. A block of 3 digits (e.g., 000-999) occurs 1000 times for every million.
 *
 * Let's define a function `countCommasUpTo(k)` which counts commas from 1 to `k`.
 * The total commas from 1 to `n` is `countCommasUpTo(n)`.
 *
 * Consider `n = 1002`.
 * `1` to `999`: 0 commas.
 * `1000`: 1 comma.
 * `1001`: 1 comma.
 * `1002`: 1 comma.
 * Total = 3.
 *
 * The number of groups of three digits from the right that are *completed* for a number `x` determines the commas.
 * For `x`, the number of commas is `(number of digits - 1) / 3` if `x` is not a multiple of 1000, 1000000 etc.
 * If `x` is a multiple of 1000, it might have an extra comma.
 *
 * The number of commas in a number `x` is `(length(x) - 1) / 3`. This is wrong.
 * The number of commas in a number `x` is equivalent to `floor((number of digits of x - 1) / 3)`.
 * This is still not entirely correct because of the exact boundary cases.
 *
 * Let's analyze based on number of digits:
 * 1-3 digits: 0 commas.
 * 4-6 digits: 1 comma.
 * 7-9 digits: 2 commas.
 * 10-12 digits: 3 commas.
 * etc.
 *
 * For a number `n`, let its number of digits be `D`.
 * The number of "full thousands groups" before `n` are fully formed determines the number of commas.
 *
 * Consider the number of commas for ranges:
 * Up to 999: 0 commas.
 * Up to 9999: 9000 numbers * 1 comma/number = 9000 commas.
 * Up to 999999: (9000 * 1) + (90000 * 1) + (900000 * 1) = 999000 commas.
 * Up to 999999999: (999000) + (9000000 * 2) = 18999000 commas.
 *
 * This is still too complex. A cleaner approach:
 * The number of commas in `n` is the sum of contributions from each power of 1000.
 *
 * Consider a number `n`.
 * The number of numbers that have at least one comma is `n - 999` (for `n >= 1000`).
 * These numbers range from 1000 up to `n`.
 * For numbers `x` where `1000 <= x <= 9999`, they have 1 comma. There are `9000` such numbers.
 * For numbers `x` where `1000000 <= x <= 9999999`, they have 2 commas. There are `9000000` such numbers.
 *
 * Let's iterate through the powers of 1000:
 * `power_of_1000 = 1000` (for the first comma)
 * `power_of_1000 = 1000000` (for the second comma)
 * `power_of_1000 = 1000000000` (for the third comma)
 * ...
 *
 * For a given `power_of_1000` (e.g., 1000, 1000000, ...):
 * How many numbers from 1 to `n` are multiples of `power_of_1000`? This is `n / power_of_1000`.
 * These are numbers like 1000, 2000, ..., `k * 1000`.
 *
 * The number of times a comma is inserted at a specific position (e.g., after the thousands, after the millions) can be calculated.
 *
 * Let's use a recursive or iterative approach based on the number of digits.
 * The number of commas in a number `x` is `floor((number of digits of x - 1) / 3)`. This is *almost* correct.
 * It's better to think about "blocks of 3 digits".
 *
 * `f(n)` = total commas from 1 to `n`.
 *
 * Let's try to calculate the number of commas for a number `x` and then sum it.
 * The number of commas in `x` is `(length(x) - 1) / 3` if we consider `x` as a string.
 * `1000` -> length 4. (4-1)/3 = 1. Correct.
 * `999` -> length 3. (3-1)/3 = 0. Correct.
 * `1000000` -> length 7. (7-1)/3 = 2. Correct.
 * `1234567` -> length 7. (7-1)/3 = 2. Correct.
 * `9999999` -> length 7. (7-1)/3 = 2. Correct.
 * `10000000` -> length 8. (8-1)/3 = 2. Correct.
 * `123456789` -> length 9. (9-1)/3 = 2. Correct.
 *
 * So, for each number `i` from 1 to `n`, the number of commas is `(String.valueOf(i).length() - 1) / 3`.
 * Summing this from 1 to `n` is too slow.
 *
 * We need to count how many numbers up to `n` fall into each "comma category".
 *
 * Let `n` be the input.
 * We need to count for each `k >= 1` the number of integers `i` in `[1, n]` such that `i` has `k` commas.
 *
 * `k=0` commas: numbers with 1, 2, or 3 digits. Max value is 999.
 * `k=1` comma: numbers with 4, 5, or 6 digits. Max value is 999999. Min value is 1000.
 * `k=2` commas: numbers with 7, 8, or 9 digits. Max value is 999999999. Min value is 1000000.
 * `k=3` commas: numbers with 10, 11, or 12 digits. Max value is 10^12 - 1. Min value is 10^9.
 *
 * Let `pow10 = 10`.
 * `total_commas = 0`.
 * `count_for_current_power = 1` (for 1000 itself).
 *
 * Iterate while `pow10 <= n * 10` (to cover cases where n itself has new commas).
 *
 * Consider the number of commas introduced by blocks of 1000.
 * Numbers 1 to 999: 0 commas.
 * Numbers 1000 to 1999: 1 comma each. Total 1000 numbers. Contribution: 1000 * 1.
 * Numbers 2000 to 2999: 1 comma each. Total 1000 numbers. Contribution: 1000 * 1.
 * ...
 * Numbers 9000 to 9999: 1 comma each. Total 1000 numbers. Contribution: 1000 * 1.
 * Total for 1000-9999: 9000 * 1 commas.
 *
 * Numbers 10000 to 99999: 1 comma each. Total 90000 numbers. Contribution: 90000 * 1.
 * Numbers 100000 to 999999: 1 comma each. Total 900000 numbers. Contribution: 900000 * 1.
 *
 * Numbers 1000000 to 1999999: 2 commas each. Total 1000000 numbers. Contribution: 1000000 * 2.
 *
 * Let `scale = 1000`. This represents a block size where commas are added.
 * `total_commas = 0`.
 * `scale = 1000`.
 *
 * The number of full "comma blocks" up to `n`.
 *
 * For `n = 1002`:
 * `scale = 1000`.
 * Numbers from 1 to 1002.
 * Numbers that are multiples of 1000: `1002 / 1000 = 1`. This is the number 1000.
 *
 * The number of times a comma is introduced for numbers up to `n`.
 * For `n = 1002`:
 * Commas are introduced at 1000, 1000000, etc.
 *
 * Let `power_of_1000 = 1000`.
 * How many numbers from 1 to `n` are multiples of `power_of_1000`?
 * This is `n / power_of_1000`.
 * Example: `n = 1002`, `power_of_1000 = 1000`. `1002 / 1000 = 1`. This means one number (1000) has a comma at this position.
 *
 * Let `power_of_1000 = 1000000`.
 * `n = 1002`, `power_of_1000 = 1000000`. `1002 / 1000000 = 0`. No numbers have a comma at this position.
 *
 * The total number of commas is the sum of `floor(n / power_of_1000)` for `power_of_1000 = 1000, 1000000, 1000000000, ...`
 *
 * Let's re-verify:
 * `n = 1002`.
 * `power_of_1000 = 1000`: `1002 / 1000 = 1`. This contributes 1 comma.
 * `power_of_1000 = 1000000`: `1002 / 1000000 = 0`. No contribution.
 * Total commas = 1. This is wrong. The answer is 3.
 *
 * The problem is that `n / power_of_1000` only counts multiples. We need to count numbers that *contain* a comma.
 *
 * Let `p = 1000`.
 * The number of full blocks of `p` digits from the right.
 * `n = 1002`.
 * `p = 1000`. `n / p = 1`. This represents the number of times `1000` fully "fits" into `n`.
 *
 * For `n = 1002`:
 * Numbers with at least one comma: numbers >= 1000.
 * Numbers in [1000, 1002] are 1000, 1001, 1002. Each has 1 comma. Total 3 commas.
 *
 * Let's consider ranges of numbers based on number of digits.
 *
 * Number of digits `D`:
 * `D = 1..3`: 0 commas. Range [1, 999].
 * `D = 4..6`: 1 comma. Range [1000, 999999].
 * `D = 7..9`: 2 commas. Range [1000000, 999999999].
 * `D = 10..12`: 3 commas. Range [10^9, 10^12 - 1].
 *
 * Let `n` be the input.
 *
 * We can calculate the number of commas by summing up contributions from each "digit group" for `n`.
 *
 * Example: `n = 1002`.
 * Length of `n` is 4.
 *
 * For numbers with 4 digits (1000 to 9999), each has 1 comma.
 * If `n` has 4 digits, say `n = abcd`.
 * Numbers from 1000 to `abcd` have 1 comma.
 * The count of such numbers is `n - 1000 + 1 = n - 999`.
 *
 * For `n = 1002`:
 * Number of digits in `n` is 4.
 * This means we are considering numbers that require up to 1 comma.
 *
 * Total commas = sum of commas for each "thousands block".
 *
 * Let `m = n`.
 * `total_commas = 0`.
 * `scale = 1000`.
 *
 * Iterate while `m > 0`:
 *   `num_blocks = m / scale` (number of full blocks of `scale` for the current number represented by `m`).
 *   `remainder = m % scale`.
 *
 *   For a block of 1000 (e.g., 1000-1999), each number has 1 comma.
 *   If `scale = 1000`, we are looking at the first comma.
 *   How many numbers from 1 to `n` have this first comma?
 *   This occurs for numbers `x` where `x >= 1000`.
 *   The count of such numbers is `n - 999` if `n >= 1000`.
 *
 * The formula for the number of commas in `i` is `(String.valueOf(i).length() - 1) / 3`.
 *
 * Let's count how many numbers are in each comma "tier".
 * Tier 0 (0 commas): [1, 999]. Count: 999.
 * Tier 1 (1 comma): [1000, 999999]. Count: 999999 - 1000 + 1 = 999000.
 * Tier 2 (2 commas): [1000000, 999999999]. Count: 999999999 - 1000000 + 1 = 999000000.
 * Tier 3 (3 commas): [10^9, 10^12 - 1]. Count: 10^12 - 1 - 10^9 + 1 = 10^12 - 10^9.
 *
 * We need to find how many numbers from 1 to `n` fall into each tier.
 *
 * Let `n_str = String.valueOf(n)`.
 * Let `len = n_str.length()`.
 *
 * `total_commas = 0`.
 *
 * `power_of_1000 = 1000`.
 * `num_commas_added = 1`.
 *
 * While `power_of_1000 <= n`:
 *   // Calculate the upper bound for numbers with `num_commas_added` commas.
 *   // This is `power_of_1000 * 1000 - 1`.
 *   // For example, if `power_of_1000 = 1000`, the upper bound is `1000 * 1000 - 1 = 999999`.
 *   // These numbers have 1 comma.
 *
 *   `upper_bound_for_this_comma = power_of_1000 * 1000 - 1`.
 *
 *   If `n >= upper_bound_for_this_comma`:
 *     // All numbers up to `upper_bound_for_this_comma` have `num_commas_added` commas.
 *     // The number of such full blocks is `upper_bound_for_this_comma / power_of_1000 = 999`.
 *     // The count of numbers within this range that are multiples of `power_of_1000` is `999`.
 *     // So, the contribution is `999 * num_commas_added`.
 *     `total_commas += 999L * num_commas_added;`
 *   Else (`n < upper_bound_for_this_comma`):
 *     // `n` falls within the range where numbers have `num_commas_added` commas.
 *     // The lower bound for this comma count is `power_of_1000`.
 *     // The numbers with `num_commas_added` commas are from `power_of_1000` up to `n`.
 *     // The number of such numbers is `n - power_of_1000 + 1`.
 *     `long count_in_this_tier = n - power_of_1000 + 1;`
 *     `total_commas += count_in_this_tier * num_commas_added;`
 *     // Since we've processed the last relevant tier for `n`, we can break.
 *     break;
 *
 *   // Move to the next comma level.
 *   `power_of_1000 *= 1000;`
 *   `num_commas_added++;`
 *
 * This logic seems to be counting total commas if all numbers up to a certain point are present.
 *
 * Let's rethink `n = 1002`.
 * `power_of_1000 = 1000`. `num_commas_added = 1`.
 * `upper_bound_for_this_comma = 1000 * 1000 - 1 = 999999`.
 * `n = 1002` is less than `999999`.
 * So, we are in the `else` block.
 * `count_in_this_tier = 1002 - 1000 + 1 = 3`.
 * `total_commas += 3 * 1 = 3`.
 * Break.
 * This works for `n = 1002`.
 *
 * Let's try `n = 998`.
 * `power_of_1000 = 1000`. `num_commas_added = 1`.
 * `upper_bound_for_this_comma = 999999`.
 * `n = 998` is less than `1000` (the start of this tier).
 * So, the loop condition `power_of_1000 <= n` will be `1000 <= 998`, which is false.
 * The loop doesn't run. `total_commas` remains 0. Correct.
 *
 * Let's try `n = 1000000`.
 *
 * Iteration 1:
 * `power_of_1000 = 1000`. `num_commas_added = 1`.
 * `upper_bound_for_this_comma = 999999`.
 * `n = 1000000` is NOT less than `999999`. It is greater.
 * So, we are in the `if` block.
 * `total_commas += 999L * 1;` // total_commas = 999.
 * `power_of_1000 = 1000 * 1000 = 1000000`.
 * `num_commas_added = 2`.
 *
 * Iteration 2:
 * `power_of_1000 = 1000000`. `num_commas_added = 2`.
 * `upper_bound_for_this_comma = 1000000 * 1000 - 1 = 999999999`.
 * `n = 1000000`.
 * `n` is less than `upper_bound_for_this_comma`.
 * So, we are in the `else` block.
 * `count_in_this_tier = 1000000 - 1000000 + 1 = 1`.
 * `total_commas += 1 * 2;` // total_commas = 999 + 2 = 1001.
 * Break.
 *
 * Let's manually check `n = 1000000`.
 * Numbers 1 to 999: 0 commas.
 * Numbers 1000 to 999999: each has 1 comma. There are 999000 such numbers. Total commas: 999000 * 1 = 999000.
 * Number 1000000: has 2 commas.
 * Total = 999000 + 2 = 999002.
 *
 * My algorithm gave 1001. Something is wrong.
 *
 * The issue is how `count_in_this_tier * num_commas_added` is calculated.
 *
 * Let's simplify the problem: Count commas in `n`.
 * The number of commas in `n` is `floor((length(n) - 1) / 3)`.
 * For `n = 1000`, length 4, (4-1)/3 = 1.
 * For `n = 1002`, length 4, (4-1)/3 = 1.
 *
 * The problem is counting commas for ALL numbers up to `n`.
 *
 * Let `f(num_digits)` be the number of commas for a number with `num_digits`.
 * `f(1..3) = 0`
 * `f(4..6) = 1`
 * `f(7..9) = 2`
 * `f(10..12) = 3`
 *
 * We need to sum up `f(num_digits(i))` for `i` from 1 to `n`.
 *
 * Consider `n = 1002`. Length = 4.
 * Numbers with 1, 2, 3 digits: [1, 999]. Count = 999. Commas per number = 0. Total = 0.
 * Numbers with 4 digits: [1000, 1002]. Count = 3. Commas per number = 1. Total = 3 * 1 = 3.
 * Total = 0 + 3 = 3. Correct.
 *
 * Consider `n = 1000000`. Length = 7.
 * Numbers with 1..3 digits: [1, 999]. Count = 999. Commas = 0. Total = 0.
 * Numbers with 4..6 digits: [1000, 999999]. Count = 999999 - 1000 + 1 = 999000. Commas per number = 1. Total = 999000 * 1 = 999000.
 * Numbers with 7 digits: [1000000, 1000000]. Count = 1. Commas per number = 2. Total = 1 * 2 = 2.
 * Total = 0 + 999000 + 2 = 999002.
 *
 * This approach works! We just need to implement it efficiently for large `n`.
 *
 * The number of digits in `n` can be found using `String.valueOf(n).length()`.
 *
 * Let `n` be the input.
 * `total_commas = 0`.
 * `num_digits_n = String.valueOf(n).length()`.
 *
 * Iterate through the number of digits `d` from 1 up to `num_digits_n`.
 *
 * For `d = 1, 2, 3`: `commas_per_num = 0`.
 * For `d = 4, 5, 6`: `commas_per_num = 1`.
 * For `d = 7, 8, 9`: `commas_per_num = 2`.
 * ...
 * In general, `commas_per_num = (d - 1) / 3`.
 *
 * We need to find the count of numbers from 1 to `n` that have exactly `d` digits.
 *
 * For `d < num_digits_n`:
 *   The numbers with `d` digits range from `10^(d-1)` to `10^d - 1`.
 *   The count of these numbers is `(10^d - 1) - 10^(d-1) + 1 = 10^d - 10^(d-1)`.
 *   This is `9 * 10^(d-1)`.
 *   Contribution to total commas: `(9 * 10^(d-1)) * ((d - 1) / 3)`.
 *
 * For `d == num_digits_n`:
 *   The numbers with `num_digits_n` digits range from `10^(num_digits_n - 1)` to `n`.
 *   The count of these numbers is `n - 10^(num_digits_n - 1) + 1`.
 *   Contribution to total commas: `(n - 10^(num_digits_n - 1) + 1) * ((num_digits_n - 1) / 3)`.
 *
 * Let's implement this. Use `long` for calculations to avoid overflow.
 * `n` can be up to 10^15, so `long` is necessary.
 * Powers of 10 can also grow large.
 *
 * `num_digits_n` will be at most 16 (for 10^15).
 *
 * Example `n = 1002`. `num_digits_n = 4`.
 *
 * d = 1: `commas_per_num = (1-1)/3 = 0`. Range [1, 9]. Count = 9. Contribution = 9 * 0 = 0.
 * d = 2: `commas_per_num = (2-1)/3 = 0`. Range [10, 99]. Count = 90. Contribution = 90 * 0 = 0.
 * d = 3: `commas_per_num = (3-1)/3 = 0`. Range [100, 999]. Count = 900. Contribution = 900 * 0 = 0.
 *
 * d = 4 (num_digits_n): `commas_per_num = (4-1)/3 = 1`.
 *   Lower bound for 4 digits: `10^(4-1) = 1000`.
 *   Count of numbers from 1000 to 1002 is `1002 - 1000 + 1 = 3`.
 *   Contribution = 3 * 1 = 3.
 *
 * Total commas = 0 + 0 + 0 + 3 = 3. Correct.
 *
 * Example `n = 1000000`. `num_digits_n = 7`.
 *
 * d = 1..3: commas_per_num = 0. Contribution = 0.
 *
 * d = 4: `commas_per_num = (4-1)/3 = 1`. Range [1000, 9999]. Count = 9000. Contribution = 9000 * 1 = 9000.
 * d = 5: `commas_per_num = (5-1)/3 = 1`. Range [10000, 99999]. Count = 90000. Contribution = 90000 * 1 = 90000.
 * d = 6: `commas_per_num = (6-1)/3 = 1`. Range [100000, 999999]. Count = 900000. Contribution = 900000 * 1 = 900000.
 *
 * d = 7 (num_digits_n): `commas_per_num = (7-1)/3 = 2`.
 *   Lower bound for 7 digits: `10^(7-1) = 1000000`.
 *   Count of numbers from 1000000 to 1000000 is `1000000 - 1000000 + 1 = 1`.
 *   Contribution = 1 * 2 = 2.
 *
 * Total commas = 0 + 9000 + 90000 + 900000 + 2 = 999002. Correct.
 *
 * We need a helper function to calculate powers of 10.
 * We also need to handle `n` potentially being large, so `long` is crucial.
 *
 * `d` can go up to 16.
 * `power_of_10 = 10^d`. This can reach `10^16`, which fits in `long`.
 * `9 * 10^(d-1)` also fits.
 * `n - lower_bound + 1` also fits.
 *
 * Time Complexity:
 * The loop runs from `d = 1` up to the number of digits in `n`.
 * The number of digits in `n` is `O(log10(n))`.
 * Inside the loop, operations are constant time (arithmetic, power calculation).
 * So, time complexity is `O(log10(n))`.
 *
 * Space Complexity:
 * We use a few variables to store counts and powers of 10.
 * Space complexity is `O(1)`.
 *
 * Edge cases:
 * `n = 1`: `num_digits_n = 1`. Loop for d=1. commas = 0. LB=1. Count=1-1+1=1. Contrib=1*0=0. Total=0. Correct.
 *
 * The calculation of powers of 10 can be done iteratively or using `Math.pow` but casting to `long`. Iterative is safer for large powers and explicit `long` usage.
 *
 * Let's refine the loop structure.
 *
 * `long total_commas = 0;`
 * `String n_str = String.valueOf(n);`
 * `int num_digits_n = n_str.length();`
 *
 * `long power_of_10 = 1;` // Represents 10^(d-1)
 *
 * for (int d = 1; d <= num_digits_n; ++d) {
 *     long commas_per_num = (long)(d - 1) / 3;
 *
 *     if (commas_per_num == 0) { // Numbers with 0 commas, no contribution
 *         power_of_10 *= 10;
 *         continue;
 *     }
 *
 *     long count_of_numbers_with_d_digits;
 *     if (d < num_digits_n) {
 *         // Full range of d-digit numbers
 *         // Range is [10^(d-1), 10^d - 1]
 *         // Count is 9 * 10^(d-1)
 *         count_of_numbers_with_d_digits = 9 * power_of_10;
 *     } else { // d == num_digits_n
 *         // Partial range of d-digit numbers
 *         // Range is [10^(d-1), n]
 *         count_of_numbers_with_d_digits = n - power_of_10 + 1;
 *     }
 *
 *     total_commas += count_of_numbers_with_d_digits * commas_per_num;
 *
 *     power_of_10 *= 10; // Prepare for the next digit count
 * }
 *
 * This looks solid.
 * The initial `power_of_10` should be `1` for `d=1` (representing `10^0`).
 * For `d=4`, `commas_per_num = (4-1)/3 = 1`.
 * If `d < num_digits_n`, then `count = 9 * power_of_10`. Example: for `d=4`, `power_of_10` is `1000`. `count = 9 * 1000 = 9000`. This is correct.
 * If `d == num_digits_n`, then `count = n - power_of_10 + 1`. Example: for `n=1002`, `num_digits_n=4`. At `d=4`, `power_of_10` is `1000`. `count = 1002 - 1000 + 1 = 3`. This is correct.
 *
 * Final check on data types:
 * `n` is `long`.
 * `num_digits_n` is `int`.
 * `commas_per_num` is `long`.
 * `power_of_10` needs to be `long` as it can go up to 10^15.
 * `count_of_numbers_with_d_digits` needs to be `long`.
 * `total_commas` needs to be `long`.
 *
 * The `power_of_10` is `10^(d-1)`.
 * For `d=1`, `power_of_10` is `10^0 = 1`.
 * For `d=2`, `power_of_10` is `10^1 = 10`.
 * For `d=3`, `power_of_10` is `10^2 = 100`.
 * For `d=4`, `power_of_10` is `10^3 = 1000`.
 * This seems correct.
 *
 * When `commas_per_num` is 0, we don't need to add anything, but we still need to update `power_of_10` for the next iteration.
 *
 * Example: n = 999
 * num_digits_n = 3
 *
 * d=1: commas_per_num = 0. power_of_10 = 1. continue. power_of_10 becomes 10.
 * d=2: commas_per_num = 0. power_of_10 = 10. continue. power_of_10 becomes 100.
 * d=3: commas_per_num = 0. power_of_10 = 100. continue. power_of_10 becomes 1000.
 * Loop ends. total_commas = 0. Correct.
 *
 * Example: n = 1000
 * num_digits_n = 4
 *
 * d=1: commas_per_num = 0. power_of_10 = 1. continue. power_of_10 becomes 10.
 * d=2: commas_per_num = 0. power_of_10 = 10. continue. power_of_10 becomes 100.
 * d=3: commas_per_num = 0. power_of_10 = 100. continue. power_of_10 becomes 1000.
 * d=4: commas_per_num = (4-1)/3 = 1.
 *      d == num_digits_n (4 == 4).
 *      count = n - power_of_10 + 1 = 1000 - 1000 + 1 = 1.
 *      total_commas += 1 * 1 = 1.
 *      power_of_10 *= 10; // becomes 10000
 * Loop ends. total_commas = 1. Correct.
 */
class Solution {
    /**
     * Counts the total number of commas used when writing all integers from 1 to n.
     *
     * @param n The upper bound of the range (inclusive).
     * @return The total number of commas.
     */
    public long countCommas(long n) {
        // Total number of commas accumulated.
        long totalCommas = 0;

        // Convert n to a string to easily get its number of digits.
        String nStr = String.valueOf(n);
        int numDigitsN = nStr.length();

        // `powerOf10` will represent 10^(d-1) in each iteration of the loop.
        // It starts at 1 for d=1 (representing 10^0).
        long powerOf10 = 1;

        // Iterate through the number of digits, from 1 up to the number of digits in n.
        for (int d = 1; d <= numDigitsN; ++d) {
            // Calculate the number of commas a number with 'd' digits would have.
            // A comma is added for every 3 digits from the right, after the first 3.
            // E.g., 4 digits -> 1 comma, 7 digits -> 2 commas, 10 digits -> 3 commas.
            // The formula is (number_of_digits - 1) / 3.
            long commasPerNum = (long)(d - 1) / 3;

            // If a number with 'd' digits has 0 commas, we don't need to add anything
            // to the total count for this digit length. We just need to update
            // `powerOf10` for the next iteration.
            if (commasPerNum == 0) {
                // Update powerOf10 for the next digit count (10^d)
                powerOf10 *= 10;
                continue;
            }

            // Variable to store the count of numbers that have 'd' digits within the range [1, n].
            long countOfNumbersWithDdigits;

            // Check if we are processing numbers with fewer digits than n, or n's digit count.
            if (d < numDigitsN) {
                // If `d` is less than the number of digits in `n`, it means we are considering
                // all numbers that have exactly `d` digits.
                // The range of numbers with `d` digits is from 10^(d-1) to 10^d - 1.
                // The count of such numbers is (10^d - 1) - 10^(d-1) + 1 = 10^d - 10^(d-1).
                // This simplifies to 9 * 10^(d-1).
                // `powerOf10` currently holds 10^(d-1).
                countOfNumbersWithDdigits = 9 * powerOf10;
            } else { // d == numDigitsN
                // If `d` is equal to the number of digits in `n`, we are considering
                // numbers from the smallest 'd'-digit number up to `n`.
                // The smallest 'd'-digit number is 10^(d-1).
                // `powerOf10` currently holds 10^(d-1).
                // The count is n - 10^(d-1) + 1.
                countOfNumbersWithDdigits = n - powerOf10 + 1;
            }

            // Add the contribution of these numbers to the total comma count.
            // Each of these `countOfNumbersWithDdigits` numbers contributes `commasPerNum` commas.
            totalCommas += countOfNumbersWithDdigits * commasPerNum;

            // Update powerOf10 for the next digit count.
            // If current `d` had `powerOf10` as 10^(d-1), the next `d+1` will have 10^d.
            powerOf10 *= 10;
        }

        // Return the accumulated total number of commas.
        return totalCommas;
    }
}
```