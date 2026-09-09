```cpp
// Problem: Count Commas in Range II
// Link: https://leetcode.com/problems/count-commas-in-range-ii/
// Approach:
// The problem asks us to count the total number of commas used when writing all integers from 1 to n.
// Commas are inserted every three digits from the right, starting from numbers with 4 or more digits.
//
// We can solve this by calculating the number of commas up to 'n' and subtracting the number of commas up to '0' (which is 0).
// The core idea is to count commas for numbers in specific digit length ranges.
//
// Let's define a function `countCommasUpTo(x)` that counts the total commas for numbers from 1 to x.
//
// For a given number `x`, we can determine the number of digits it has. Let's say `x` has `D` digits.
//
// The numbers from 1 to 999 have no commas.
//
// Numbers from 1000 to 9999 (4 digits):
// - There are 9000 such numbers.
// - Each of these numbers has one comma (e.g., 1,000).
// - The first comma appears at the 1000th number.
//
// Numbers from 10000 to 99999 (5 digits):
// - There are 90000 such numbers.
// - Each of these numbers has one comma (e.g., 10,000).
//
// Numbers from 100000 to 999999 (6 digits):
// - There are 900000 such numbers.
// - Each of these numbers has one comma (e.g., 100,000).
//
// Numbers from 1000000 to 9999999 (7 digits):
// - There are 9000000 such numbers.
// - Each of these numbers has two commas (e.g., 1,000,000).
//
// Generalizing for a number `x` with `D` digits:
//
// We can iterate through powers of 10 to count commas.
//
// Let's consider the ranges based on powers of 1000 (which correspond to comma placements):
//
// 1-999: 0 commas
// 1000-999999: 1 comma (e.g., 1,000 to 999,999)
// 1000000-999999999: 2 commas (e.g., 1,000,000 to 999,999,999)
//
// For a number `x`:
// - If `x` has `D` digits.
// - The number of full groups of 3 digits from the right is `floor(D / 3)`.
// - Each number with at least `k` groups of 3 digits (i.e., numbers >= 10^(3*k)) will have at least `k` commas.
//
// We can calculate the total commas by considering the contribution of each comma position.
//
// Let's count commas for numbers from 1 to `N`.
//
// Consider the first comma position (thousands place): It appears in numbers from 1000 to N.
// The count of numbers from 1000 to N is `max(0LL, N - 999)`.
//
// Consider the second comma position (millions place): It appears in numbers from 1000000 to N.
// The count of numbers from 1000000 to N is `max(0LL, N - 999999)`.
//
// Consider the third comma position (billions place): It appears in numbers from 1000000000 to N.
// The count of numbers from 1000000000 to N is `max(0LL, N - 999999999)`.
//
// And so on.
//
// We can iterate through powers of 1000 (10^3, 10^6, 10^9, ...) up to a value less than or equal to `N`.
// For each power `p = 1000^k`, the numbers from `p` to `N` will have at least `k` commas.
// The numbers that contribute to the `k`-th comma (from the right) are those that are greater than or equal to `10^(3*k)`.
//
// Let `countCommas(num)` be the function to calculate commas up to `num`.
//
// For `num`:
// - If `num < 1000`, return 0.
// - Initialize `totalCommas = 0`.
// - Initialize `powerOf1000 = 1000`.
// - Initialize `commaCount = 1`.
// - While `powerOf1000 <= num`:
//     - The numbers from `powerOf1000` to `num` will have at least `commaCount` commas.
//     - We are interested in the count of numbers that have a comma at the `commaCount`-th position.
//     - The numbers that have the `commaCount`-th comma inserted are those >= `powerOf1000`.
//     - The count of such numbers up to `num` is `max(0LL, num - powerOf1000 + 1)`.
//     - Wait, this is not quite right. This counts all numbers that are >= `powerOf1000`.
//
// Let's rephrase: How many numbers from 1 to `num` have at least one comma? These are numbers >= 1000.
// Count is `num - 999` (if `num >= 1000`).
// How many numbers from 1 to `num` have at least two commas? These are numbers >= 1,000,000.
// Count is `num - 999999` (if `num >= 1000000`).
//
// General form: For the k-th comma (from the right), it appears for numbers >= `10^(3*k)`.
// The number of such integers from 1 to `num` is `max(0LL, num - (10^(3*k) - 1))`.
//
// So, the total number of commas is the sum of `max(0LL, num - (10^(3*k) - 1))` for `k = 1, 2, 3, ...` as long as `10^(3*k) <= num`.
//
// We need to be careful about integer overflow. `n` can be up to 10^15.
// `10^(3*k)` can reach up to `10^15`. Using `long long` is essential.
//
// Example: n = 1002
// k = 1: 10^(3*1) = 1000.
//   Count for k=1: `max(0LL, 1002 - (1000 - 1)) = max(0LL, 1002 - 999) = max(0LL, 3) = 3`.
//   Numbers are 1000, 1001, 1002. Each has one comma. Total 3.
// k = 2: 10^(3*2) = 1,000,000.
//   1,000,000 > 1002, so we stop.
// Total commas = 3.
//
// Example: n = 10000
// k = 1: 1000.
//   Count for k=1: `max(0LL, 10000 - 999) = 9001`.
//   This means there are 9001 numbers from 1000 to 10000 that have at least one comma.
// k = 2: 1,000,000.
//   1,000,000 > 10000, stop.
// Total commas = 9001.
// Let's check for n = 10000 manually:
// 1000 to 9999: 9000 numbers, each with 1 comma. Total 9000.
// 10000: 1 comma.
// Total = 9000 + 1 = 9001. Correct.
//
// The logic seems to be:
// `countCommas(num)` function:
//   Initialize `totalCommas = 0`.
//   Initialize `powerOf1000 = 1000`.
//   Initialize `threshold = 999`. (This is 1000 - 1)
//   While `powerOf1000 <= num`:
//     `count = num - threshold`; // Number of integers from `powerOf1000` to `num`
//     If `count > 0`:
//       `totalCommas += count`;
//     `powerOf1000 *= 1000`;
//     `threshold = threshold * 1000 + 999`; // This is the next `powerOf1000 - 1`
//     // Careful with overflow for threshold.
//     // A better way for threshold:
//     // `threshold = powerOf1000 - 1;`
//     // but this also has potential overflow for `powerOf1000`.
//     // Let's manage powers of 10 directly.
//
// Revised `countCommas(num)` function:
//   Initialize `totalCommas = 0`.
//   Initialize `powerOf3Digits = 1000LL`. // 10^3
//   Initialize `count = 1`. // Corresponds to the first comma position.
//   While `powerOf3Digits <= num`:
//     // Number of integers from `powerOf3Digits` to `num` that have a comma at this position.
//     // This is `num - powerOf3Digits + 1`.
//     // However, we need to consider the numbers that fall into this *group*.
//     // For example, for 1000 to 999999 (6 digits), there is one comma.
//     // The range for the first comma is 1000-9999.
//     // The range for the second comma is 1000000-999999999.
//
// Let's consider the contribution of each *digit position* from the right that is a comma position.
//
// For a number `N`:
//
// Number of digits in `N` is `D`.
//
// Commas occur at positions 3, 6, 9, 12, 15, ... from the right (1-indexed).
//
// For a given `N`, the number of times the 3rd digit from the right is a separator (i.e., the number has >= 4 digits) is `N - 999` if `N >= 1000`.
// These are numbers like `1,XXX`, `2,XXX`, ..., `N` (if N is 4 digits).
//
// The number of times the 6th digit from the right is a separator (i.e., the number has >= 7 digits) is `N - 999999` if `N >= 1000000`.
// These are numbers like `1,XXX,XXX`, `2,XXX,XXX`, ..., `N` (if N is 7 digits).
//
// Let's define `countCommas(num)`:
//
// If `num < 1000`, return 0.
//
// `totalCommas = 0`
//
// `// Count for numbers with one comma (e.g., 1,XXX)`
// `// These are numbers from 1000 up to num.`
// `// The range is [1000, num].`
// `// The number of integers is num - 1000 + 1.`
// `// If num < 1000, this count is 0.`
// `// The count of numbers from 1000 to num is max(0LL, num - 1000 + 1)`
// `// This counts the first comma for numbers >= 1000.`
// `// Let's think about the range of numbers for which a specific comma exists.`
//
// For numbers `1` to `N`:
//
// Count of numbers with at least one comma: `N >= 1000`. Count = `max(0LL, N - 999)`.
// These numbers contribute their first comma.
//
// Count of numbers with at least two commas: `N >= 1000000`. Count = `max(0LL, N - 999999)`.
// These numbers contribute their second comma.
//
// Count of numbers with at least three commas: `N >= 1000000000`. Count = `max(0LL, N - 999999999)`.
// These numbers contribute their third comma.
//
// This seems correct.
//
// The function `countCommas(num)`:
//   Initialize `totalCommas = 0`.
//   Initialize `limit = 1000LL`.
//   Initialize `separator = 999LL`.
//   Loop for `k = 1, 2, 3, ...`
//     If `limit > num`, break.
//     // The number of integers from `limit` to `num` is `num - limit + 1`.
//     // This is incorrect. The number of integers from `limit` to `num` is `num - limit + 1`.
//     // For the k-th comma (which appears for numbers >= 10^(3k)), the count of numbers up to N is N - (10^(3k) - 1) if N >= 10^(3k).
//     // Which simplifies to `max(0LL, N - (powerOf1000 - 1))`
//
// Let's try this structure:
// `long long solve(long long n)`:
//   `long long total_commas = 0;`
//   `long long power_of_1000 = 1000;`
//   `long long threshold = 999;` // Represents 1000 - 1, 1000000 - 1, etc.
//
//   // Loop as long as the current power of 1000 is less than or equal to n.
//   // This means we are considering comma positions that could exist in numbers up to n.
//   while (power_of_1000 <= n) {
//     // `threshold` is the number just before the `power_of_1000` mark.
//     // For example, when `power_of_1000` is 1000, `threshold` is 999.
//     // The count of numbers that have this comma inserted is `n - threshold`.
//     // These are numbers from `power_of_1000` up to `n`.
//     // Example: n=1002. power_of_1000=1000, threshold=999.
//     // Count = 1002 - 999 = 3. (Numbers are 1000, 1001, 1002)
//     // These 3 numbers each have their first comma.
//     // So, we add `n - threshold` to `total_commas`.
//     // We use `max(0LL, n - threshold)` in case n is smaller than threshold, though the while condition `power_of_1000 <= n` should prevent this for the first iteration.
//     // However, for subsequent iterations, it's possible that `power_of_1000` becomes very large, and `n - threshold` could be negative if `n` is smaller than `threshold`.
//     // The correct way to calculate the count of numbers between `power_of_1000` and `n` (inclusive) is `n - power_of_1000 + 1`.
//     // Let's rethink the meaning of `n - threshold`.
//     // If `n = 1002`:
//     // k=1: power_of_1000 = 1000, threshold = 999.
//     // Numbers from 1000 to 1002 have a comma. Count = 1002 - 999 = 3.
//     // This seems correct for the first comma position.
//     //
//     // k=2: power_of_1000 = 1000000, threshold = 999999.
//     // 1000000 > 1002, loop terminates.
//     //
//     // If `n = 10000`:
//     // k=1: power_of_1000 = 1000, threshold = 999.
//     // Count = 10000 - 999 = 9001.
//     // These are numbers from 1000 to 10000. All have one comma.
//     //
//     // k=2: power_of_1000 = 1000000, threshold = 999999.
//     // 1000000 > 10000, loop terminates.
//     // Total commas = 9001. This matches the manual calculation.
//
//     // The number of integers from `power_of_1000` to `n` inclusive is `n - power_of_1000 + 1`.
//     // But we are counting how many numbers *have* this comma.
//     // This means numbers that are at least `power_of_1000`.
//     // The count of numbers from 1 to `n` that are >= `power_of_1000` is `max(0LL, n - power_of_1000 + 1)`.
//     //
//     // Let's stick to the `n - threshold` logic for now, it seems to capture the count correctly.
//     // Example: n = 1002
//     // k=1: p=1000, t=999. count = 1002-999 = 3. (1000, 1001, 1002) -> 3 commas
//     //
//     // Example: n = 10000
//     // k=1: p=1000, t=999. count = 10000-999 = 9001. (1000...10000) -> 9001 commas
//     //
//     // Example: n = 1000000
//     // k=1: p=1000, t=999. count = 1000000 - 999 = 999001. (1000...1000000 have their 1st comma)
//     // k=2: p=1000000, t=999999. count = 1000000 - 999999 = 1. (Only 1000000 has its 2nd comma)
//     // Total commas = 999001 + 1 = 999002.
//     // Let's check this:
//     // Numbers 1000 to 999999: 999000 numbers. Each has 1 comma. Total 999000.
//     // Number 1000000: Has 2 commas.
//     // Total = 999000 + 2 = 999002. This matches.
//
//     // The count of numbers from `power_of_1000` to `n` is `n - power_of_1000 + 1`.
//     // These numbers each contribute *one* comma at this specific comma position.
//     // So, if `power_of_1000 <= n`, then all numbers from `power_of_1000` to `n`
//     // will have the comma corresponding to `power_of_1000`.
//     // The number of such integers is `n - power_of_1000 + 1`.
//     // Example: n = 1002. power_of_1000 = 1000. Count = 1002 - 1000 + 1 = 3. (1000, 1001, 1002). Add 3.
//     // Example: n = 10000. power_of_1000 = 1000. Count = 10000 - 1000 + 1 = 9001. (1000..10000). Add 9001.
//     // Example: n = 1000000.
//     // k=1: p=1000. Count = 1000000 - 1000 + 1 = 999001. Add 999001.
//     // k=2: p=1000000. Count = 1000000 - 1000000 + 1 = 1. Add 1.
//     // Total = 999001 + 1 = 999002.
//
//     // This seems correct. The count of numbers from `power_of_1000` to `n` inclusive.
//     // We only add if `n >= power_of_1000`. The loop condition `power_of_1000 <= n` ensures this.
//     total_commas += (n - power_of_1000 + 1);
//
//     // Prepare for the next comma position.
//     // We need to check for overflow when multiplying `power_of_1000` and `threshold`.
//     // `power_of_1000` can go up to 10^15. `power_of_1000 * 1000` could exceed `long long` limit (approx 9e18).
//     // 10^15 * 1000 = 10^18. This is within `long long`.
//     // The next `power_of_1000` would be 10^18. If `n` is 10^15, the loop will stop before exceeding.
//     // What if `n` is near 10^15?
//     // Example: n = 10^15.
//     // k=1: p=1000. Add 10^15 - 1000 + 1.
//     // k=2: p=10^6. Add 10^15 - 10^6 + 1.
//     // k=3: p=10^9. Add 10^15 - 10^9 + 1.
//     // k=4: p=10^12. Add 10^15 - 10^12 + 1.
//     // k=5: p=10^15. Add 10^15 - 10^15 + 1 = 1.
//     // k=6: p=10^18. 10^18 > 10^15. Loop ends.
//
//     // Check if `power_of_1000` will overflow if multiplied by 1000.
//     // The maximum value for `long long` is approximately 9e18.
//     // If `power_of_1000 > LLONG_MAX / 1000`, then `power_of_1000 * 1000` will overflow.
//     // If `n <= 10^15`, then `power_of_1000` will not exceed `10^15` during the loop.
//     // The next value `power_of_1000 * 1000` could be `10^18`. This fits in `long long`.
//     // The next value after that would be `10^21`, which overflows.
//     // Since `n <= 10^15`, we only need powers up to `10^15`.
//     // So `power_of_1000 * 1000` will not overflow for `n <= 10^15`.
//     if (power_of_1000 > n / 1000) { // Check to prevent overflow for the next `power_of_1000`
//         // If `power_of_1000 * 1000` would exceed `n`, we should stop.
//         // But the loop condition `power_of_1000 <= n` already handles this for the current iteration.
//         // We need to break if `power_of_1000 * 1000` would overflow or become larger than `n`.
//         // If `power_of_1000 > LLONG_MAX / 1000`, then `power_of_1000 * 1000` will overflow.
//         // Given `n <= 10^15`, the largest `power_of_1000` we care about is `10^15`.
//         // The next would be `10^18`.
//         // `power_of_1000` will not exceed `10^15` within the loop for `n <= 10^15`.
//         // So `power_of_1000 * 1000` will be at most `10^18`, which fits in `long long`.
//         // We can safely update `power_of_1000`.
//     }
//     power_of_1000 *= 1000;
//   }
//   return total_commas;
//
// Time Complexity:
// The loop iterates for powers of 1000 (10^3, 10^6, 10^9, ...) up to `n`.
// The number of iterations is logarithmic with respect to `n` in base 1000.
// For `n = 10^15`, the powers are 10^3, 10^6, 10^9, 10^12, 10^15. That's 5 iterations.
// So, the time complexity is O(log1000(n)), which is effectively O(log n).
//
// Space Complexity:
// We are using a few variables to store counts and powers of 10.
// The space used is constant, regardless of the input `n`.
// So, the space complexity is O(1).

class Solution {
public:
    long long countCommas(long long n) {
        // Base case: Numbers less than 1000 do not have any commas.
        if (n < 1000) {
            return 0;
        }

        long long total_commas = 0;
        // `power_of_1000` represents the start of ranges that have a comma at a specific position.
        // For example, 1000 for the first comma, 1000000 for the second, and so on.
        long long power_of_1000 = 1000;

        // Iterate through each comma position (thousands, millions, billions, etc.).
        // The loop continues as long as the current `power_of_1000` is less than or equal to `n`.
        // This ensures we only consider comma positions that can appear in numbers up to `n`.
        while (power_of_1000 <= n) {
            // `power_of_1000` marks the beginning of a new "comma group".
            // For example, if `power_of_1000` is 1000, we are counting numbers from 1000 onwards.
            // If `power_of_1000` is 1000000, we are counting numbers from 1000000 onwards.
            //
            // The number of integers from `power_of_1000` to `n` (inclusive) is `n - power_of_1000 + 1`.
            // Each of these numbers contributes *one* comma at this specific comma position.
            // For instance, numbers from 1000 to 1002 (if n=1002) all have their first comma.
            // The count is 1002 - 1000 + 1 = 3.
            //
            // We use `n - power_of_1000 + 1` because `power_of_1000` is the first number in the range that receives this comma.
            // E.g., for the first comma (thousands place), the numbers are 1000, 1001, ...
            // If n = 1002, the numbers are 1000, 1001, 1002. The count is 3.
            //
            // We add this count to `total_commas`.
            total_commas += (n - power_of_1000 + 1);

            // Prepare for the next comma position.
            // We need to check if multiplying `power_of_1000` by 1000 will exceed `n` or cause overflow.
            // Since `n` is up to 10^15, `power_of_1000` can go up to 10^15.
            // The next `power_of_1000` would be 10^18, which fits within `long long`.
            // If `power_of_1000 > n / 1000`, it implies that `power_of_1000 * 1000` would be greater than `n`.
            // In this case, the next iteration's `power_of_1000` will be greater than `n`, and the loop will terminate.
            // This check also helps prevent potential overflow if `n` was extremely close to `LLONG_MAX`.
            // Given `n <= 10^15`, `power_of_1000` will be at most `10^15`, and `power_of_1000 * 1000` will be at most `10^18`, which is safe for `long long`.
            // So, a simple multiplication is sufficient.
            if (power_of_1000 > n / 1000) { // Check to avoid overflow and to break early if the next power is already > n
                 break; // Exit loop if next `power_of_1000` would exceed `n` or overflow.
            }
            power_of_1000 *= 1000;
        }

        return total_commas;
    }
};
```