/**
 * @summary Constructs an array `ans` such that `ans[i] | (ans[i] + 1) == nums[i]` for each element `nums[i]`, minimizing `ans[i]`.
 * @link https://leetcode.com/problems/construct-the-minimum-bitwise-array-i/
 *
 * @approach
 * The core of the problem lies in the bitwise OR operation: `ans[i] | (ans[i] + 1) == nums[i]`.
 * Let's analyze the relationship between a number `x` and `x + 1` in terms of their binary representations.
 * When we increment a number `x` by 1, the rightmost 0 bit in `x` becomes 1, and all the 1s to its right become 0.
 * For example:
 * 3 (011) + 1 = 4 (100)
 * 12 (1100) + 1 = 13 (1101)
 *
 * The bitwise OR operation `a | b` results in a 1 if either `a` or `b` has a 1 at that bit position.
 *
 * Consider the property `ans[i] | (ans[i] + 1) == nums[i]`.
 * If `nums[i]` has a bit set to 1, it means that either `ans[i]` or `ans[i] + 1` (or both) must have a 1 at that position.
 * If `nums[i]` has a bit set to 0, it means that both `ans[i]` and `ans[i] + 1` must have a 0 at that position.
 *
 * Let's examine the bits of `nums[i]`.
 *
 * Case 1: The least significant bit (LSB) of `nums[i]` is 1.
 * If `nums[i]` is odd, its LSB is 1. This means `ans[i]` must have a 0 at the LSB (to keep the OR result's LSB as 1 if `ans[i]+1` has a 1) or `ans[i]` has a 1 and `ans[i]+1` has a 0.
 * Consider `x` and `x+1`. If `x` ends with `...0`, then `x+1` ends with `...1`. The OR will have a 1 at the LSB.
 * If `x` ends with `...1`, then `x+1` ends with `...0`. The OR will have a 1 at the LSB.
 * So, if `nums[i]` has its LSB as 1, it doesn't immediately restrict `ans[i]` in a straightforward way without further analysis of its binary form.
 *
 * Case 2: The LSB of `nums[i]` is 0.
 * If `nums[i]` is even, its LSB is 0. This implies that both `ans[i]` and `ans[i] + 1` must have their LSB as 0.
 * This is impossible because if `ans[i]` has an LSB of 0, `ans[i] + 1` must have an LSB of 1.
 * Therefore, if `nums[i]` is even, it's impossible to satisfy the condition, and `ans[i]` should be -1.
 *
 * Let's revisit the relationship `ans[i] | (ans[i] + 1)`.
 * If `ans[i]` has a bit `b` as 0, and `ans[i] + 1` has the same bit `b` as 0, then `nums[i]` must have bit `b` as 0.
 * If `ans[i]` has a bit `b` as 1, and `ans[i] + 1` has the same bit `b` as 0, then `nums[i]` must have bit `b` as 1.
 * If `ans[i]` has a bit `b` as 0, and `ans[i] + 1` has the same bit `b` as 1, then `nums[i]` must have bit `b` as 1.
 *
 * The key insight comes from observing that `x | (x+1)` will *always* have the same bits as `x` that are 1, and it will also gain a 1 wherever `x` has a 0 followed by a carry that propagates to it.
 * More precisely, if `x` has its least significant 0 bit at position `k` (meaning bits `0` to `k-1` are 1s), then `x+1` will flip all these 1s to 0s and set the bit at position `k` to 1.
 * Example: `x = 010111` (23). LSB 0 is at index 3.
 * `x+1 = 011000` (24).
 * `x | (x+1) = 010111 | 011000 = 011111` (31).
 *
 * Notice that `x | (x+1)` has all bits set from the LSB up to and including the position of the rightmost 0 bit of `x`.
 *
 * So, if `nums[i] == ans[i] | (ans[i] + 1)`, then `nums[i]` must be a number that has all its bits set from the LSB up to some point. This means `nums[i]` must be of the form `2^k - 1` for some `k`.
 *
 * Let's re-examine the problem statement and examples.
 * Example 1: nums = [2,3,5,7]
 * - nums[0] = 2. Binary: 10.
 *   - If ans[0] = 0 (00), ans[0]+1 = 1 (01). 0|1 = 1. Not 2.
 *   - If ans[0] = 1 (01), ans[0]+1 = 2 (10). 1|2 = 3. Not 2.
 *   - If ans[0] = 2 (10), ans[0]+1 = 3 (11). 2|3 = 3. Not 2.
 *   - `ans[0] | (ans[0]+1)` will never be 2. Why?
 *     If `ans[0]` is `x`, then `x | (x+1)` will always be greater than or equal to `x`.
 *     If `x` is even, `x+1` is odd. `x | (x+1)` is odd if `x` is odd, and even if `x` is even, but `x+1` would have a 1 at LSB.
 *     If `x` ends in `...0`, `x+1` ends in `...1`. The OR will have a 1 at the LSB. So `ans[i] | (ans[i]+1)` is always odd if `ans[i]` is even.
 *     If `x` ends in `...1`, `x+1` ends in `...0`. The OR will have a 1 at the LSB. So `ans[i] | (ans[i]+1)` is always odd.
 *     This means `ans[i] | (ans[i]+1)` is *always odd*.
 *     Therefore, if `nums[i]` is even, it's impossible. `ans[i] = -1`.
 *     So for `nums[0] = 2` (even), `ans[0] = -1`. This matches Example 1.
 *
 * - nums[1] = 3. Binary: 11.
 *   - Smallest `ans[1]` such that `ans[1] | (ans[1]+1) = 3`.
 *   - Try `ans[1] = 1` (01). `ans[1]+1 = 2` (10). `1 | 2 = 3`. Yes. So `ans[1] = 1`. Matches Example 1.
 *
 * - nums[2] = 5. Binary: 101.
 *   - Smallest `ans[2]` such that `ans[2] | (ans[2]+1) = 5`.
 *   - Try `ans[2] = 1` (001). `ans[2]+1 = 2` (010). `1 | 2 = 3`. Not 5.
 *   - Try `ans[2] = 2` (010). `ans[2]+1 = 3` (011). `2 | 3 = 3`. Not 5.
 *   - Try `ans[2] = 3` (011). `ans[2]+1 = 4` (100). `3 | 4 = 7`. Not 5.
 *   - Try `ans[2] = 4` (100). `ans[2]+1 = 5` (101). `4 | 5 = 5`. Yes. So `ans[2] = 4`. Matches Example 1.
 *
 * - nums[3] = 7. Binary: 111.
 *   - Smallest `ans[3]` such that `ans[3] | (ans[3]+1) = 7`.
 *   - Try `ans[3] = 3` (011). `ans[3]+1 = 4` (100). `3 | 4 = 7`. Yes. So `ans[3] = 3`. Matches Example 1.
 *
 * What is the pattern for `ans[i]`?
 * If `nums[i]` is odd, we need to find the smallest `ans[i]` such that `ans[i] | (ans[i]+1) == nums[i]`.
 *
 * Consider the bits of `nums[i]`.
 * If `nums[i]` has a bit `k` as 0, then both `ans[i]` and `ans[i]+1` must have bit `k` as 0.
 * If `nums[i]` has a bit `k` as 1, then either `ans[i]` or `ans[i]+1` (or both) must have bit `k` as 1.
 *
 * Let's look at `nums[i]` and `ans[i]`.
 * If `nums[i] == ans[i] | (ans[i] + 1)`:
 *
 * The bits of `ans[i]+1` are related to `ans[i]` by flipping the rightmost 0 to 1 and all trailing 1s to 0s.
 * If `ans[i]` = `...p011...1` (with `k` ones at the end), then `ans[i]+1` = `...p100...0`.
 * Then `ans[i] | (ans[i]+1)` = `...p111...1`.
 *
 * This means `nums[i]` must be of the form `...p111...1`.
 * If `nums[i]` has a 0 at some bit position `j`, and `ans[i]` also has a 0 at bit position `j`, and `ans[i]+1` also has a 0 at bit position `j`. This can only happen if bit `j` is not the position of the rightmost 0 in `ans[i]`, and the carry from `ans[i]` to `ans[i]+1` does not reach bit `j`.
 *
 * A simpler observation:
 * `x | (x+1)` has a 1 at every bit position where `x` has a 1.
 * `x | (x+1)` has a 1 at the position of the rightmost 0 bit of `x`.
 * `x | (x+1)` has a 0 at positions to the right of the rightmost 0 bit of `x` if `x` has 1s there. This is incorrect based on the example 010111 | 011000 = 011111.
 *
 * Let's try to derive `ans[i]` from `nums[i]`.
 * We are given `N = A | (A+1)`. We want to find minimal `A`.
 *
 * Property: `A | (A+1)` is always an odd number (except if A is 0, then A|(A+1)=1).
 * If `A` is even (ends in 0), `A+1` is odd (ends in 1). `A | (A+1)` will have a 1 at the LSB. So it's odd.
 * If `A` is odd (ends in 1), `A+1` is even (ends in 0). `A | (A+1)` will have a 1 at the LSB. So it's odd.
 *
 * So, if `nums[i]` is even, `ans[i] = -1`.
 *
 * If `nums[i]` is odd:
 * Let `N = nums[i]`. We need to find the minimum `A` such that `A | (A+1) = N`.
 *
 * Consider the binary representation of `N`.
 * If the LSB of `N` is 0, it's impossible (covered above, `N` must be odd).
 *
 * If `N` is odd, it has its LSB as 1.
 * Let's look at `N` and `N-1`.
 * If `N = A | (A+1)`.
 *
 * If `A` ends in `011...1` (k ones), `A+1` ends in `100...0`.
 * Then `N = A | (A+1)` ends in `111...1` (k+1 ones).
 * So `N` has a block of 1s at the end.
 * `N = ...p11...1` (k+1 ones).
 * `A` must be `...p01...1` (k ones).
 * `A+1` must be `...p10...0` (k zeros).
 *
 * So, if `N` has a block of `m` ones at the end, `N = ...X11...1` (m ones).
 * Then `A` could be `...X01...1` (m-1 ones).
 * `A+1` would be `...X10...0` (m zeros).
 * `A | (A+1) = ...X11...1` which is `N`.
 *
 * So, if `N` ends with `m` ones, then `A = N - (1 << (m-1))`.
 * Let's test this.
 *
 * N = 3 (011). Ends with 2 ones (m=2).
 * A = N - (1 << (2-1)) = 3 - (1 << 1) = 3 - 2 = 1.
 * Check: 1 | (1+1) = 1 | 2 = 3. Correct.
 *
 * N = 5 (101). Ends with 1 one (m=1).
 * A = N - (1 << (1-1)) = 5 - (1 << 0) = 5 - 1 = 4.
 * Check: 4 | (4+1) = 4 | 5 = 5. Correct.
 *
 * N = 7 (111). Ends with 3 ones (m=3).
 * A = N - (1 << (3-1)) = 7 - (1 << 2) = 7 - 4 = 3.
 * Check: 3 | (3+1) = 3 | 4 = 7. Correct.
 *
 * N = 11 (1011). Ends with 2 ones (m=2).
 * A = N - (1 << (2-1)) = 11 - (1 << 1) = 11 - 2 = 9.
 * Check: 9 | (9+1) = 9 | 10 = 1001 | 1010 = 1011 = 11. Correct.
 *
 * N = 13 (1101). Ends with 1 one (m=1).
 * A = N - (1 << (1-1)) = 13 - (1 << 0) = 13 - 1 = 12.
 * Check: 12 | (12+1) = 12 | 13 = 1100 | 1101 = 1101 = 13. Correct.
 *
 * N = 31 (11111). Ends with 5 ones (m=5).
 * A = N - (1 << (5-1)) = 31 - (1 << 4) = 31 - 16 = 15.
 * Check: 15 | (15+1) = 15 | 16 = 01111 | 10000 = 11111 = 31. Correct.
 *
 * This pattern seems to work:
 * If `nums[i]` is even, `ans[i] = -1`.
 * If `nums[i]` is odd, find the number of trailing ones (`m`) in `nums[i]`.
 * Then `ans[i] = nums[i] - (1 << (m-1))`.
 *
 * How to find the number of trailing ones `m`?
 * `m` is the position of the rightmost 0 bit plus one, IF `nums[i]` were represented as `...011..1`.
 * Or, more directly, `m` is the count of consecutive 1s starting from the LSB.
 * We can find `m` by checking bits from LSB upwards.
 * Alternatively, `N & (N+1)` gives `N` with the rightmost block of ones zeroed out.
 * For example, N = 7 (111). N+1 = 8 (1000). N & (N+1) = 0.
 * For example, N = 11 (1011). N+1 = 12 (1100). N & (N+1) = 1000 (8).
 *
 * If `N = ...X011...1` (m ones), then `N & (N+1)` is `...X000...0`.
 * This means `N - (N & (N+1))` gives the trailing ones `00...011...1`.
 * The number of trailing ones `m` can be found by counting the set bits in `N - (N & (N+1))`.
 *
 * `N = A | (A+1)`
 * `A` has the form `...p011..1` (k ones).
 * `A+1` has the form `...p100..0` (k zeros).
 * `N` has the form `...p111..1` (k+1 ones).
 *
 * If `N` is `...p11...1` (m ones), then `p` is the bit before the block of ones.
 * To get `A`, we need to turn the first `1` in the block of ones into `0` and keep the remaining `m-1` ones.
 * This means `A = N` with the bit at position `m-1` (0-indexed) flipped from 1 to 0.
 *
 * How to find `m` (the number of trailing ones)?
 * `N = ... X 111` (m ones)
 * `N+1 = ... X+1 000` (m zeros). This might not be X+1, it depends on X.
 *
 * Let's try `N ^ (N >> 1)`.
 * N = 3 (011). N >> 1 = 001. N ^ (N >> 1) = 010 (2).
 * N = 5 (101). N >> 1 = 010. N ^ (N >> 1) = 111 (7).
 * N = 7 (111). N >> 1 = 011. N ^ (N >> 1) = 100 (4).
 * N = 11 (1011). N >> 1 = 0101. N ^ (N >> 1) = 1110 (14).
 *
 * Let's look at `N & -N`. This isolates the LSB.
 * N = 3 (011). -N (2's comp) is ...1101. N & -N = 001 (1).
 * N = 5 (101). -N is ...1011. N & -N = 001 (1).
 * N = 7 (111). -N is ...1001. N & -N = 001 (1).
 * N = 11 (1011). -N is ...0101. N & -N = 0001 (1).
 * N = 13 (1101). -N is ...0011. N & -N = 0001 (1).
 *
 * If `N` is odd, `N & -N` is always 1. This is not useful for counting trailing ones.
 *
 * What if we consider the number of set bits in `N`?
 *
 * Let's reconsider the direct condition: `ans[i] | (ans[i] + 1) == nums[i]`.
 * We want the *minimal* `ans[i]`.
 *
 * If `ans[i] = 0`, `ans[i] | (ans[i]+1) = 0 | 1 = 1`. So if `nums[i] = 1`, then `ans[i] = 0`.
 * (But constraints say `nums[i] >= 2`).
 *
 * If `ans[i] = x`, then `x` has some bits set. `x+1` has bits set differently.
 * The operation `x | (x+1)` basically "fills in" the trailing zeros of `x` up to the first zero, and sets that zero to 1.
 * Example: `x = 010100` (20)
 * `x+1 = 010101` (21)
 * `x | (x+1) = 010101` (21)
 *
 * Example: `x = 010011` (19)
 * `x+1 = 010100` (20)
 * `x | (x+1) = 010111` (23)
 *
 * In `x | (x+1) = N`:
 * If a bit `b` is 0 in `N`, it must be 0 in both `x` and `x+1`.
 * If a bit `b` is 1 in `N`, it must be 1 in `x` or `x+1` (or both).
 *
 * This implies that if `N` has a 0 at bit `j`, then `x` and `x+1` must both have a 0 at bit `j`.
 * This is only possible if `j` is not the position of the rightmost 0 bit in `x`, and the carry from `x` to `x+1` doesn't reach `j`.
 *
 * The crucial observation is that `x | (x+1)` will have all the bits of `x` that are 1, plus it will have a 1 at the position of the rightmost 0 bit of `x`. All bits to the right of this rightmost 0 bit in `x` will be 0 in `x | (x+1)` if they were 0 in `x`. But if they were 1s in `x`, they are flipped to 0s in `x+1` and OR-ed with 0s from `x`, resulting in 0s. This is incorrect.
 *
 * Let's re-examine the example: `x = 010111` (23), `x+1 = 011000` (24). `x | (x+1) = 011111` (31).
 * Here, `x` has its rightmost 0 at index 3. Bits 0, 1, 2 are 1s.
 * `x` = `...010` followed by `111`.
 * `x+1` = `...011` followed by `000`.
 * `x | (x+1)` = `...011111`.
 *
 * So, `N = x | (x+1)` will have 1s from the rightmost 0 bit of `x` up to the LSB, and it will inherit all the higher bits of `x`.
 * `N` will look like `(higher_bits_of_x) 1 (all_ones_up_to_LSB)`.
 *
 * If we want to find minimal `A` such that `A | (A+1) == N`.
 *
 * If `N` has a 0 bit at position `k`, then both `A` and `A+1` must have a 0 bit at position `k`.
 * This implies `A` cannot have `k` as its rightmost 0 bit, because then `A+1` would have a 1 at `k`.
 *
 * This means that if `N` has a 0 bit at position `k`, then `A` must also have a 0 bit at position `k`.
 * Why? Suppose `A` has a 1 at position `k`.
 * If `A` has a 0 at position `j < k` (where `j` is the first 0 from the right), then `A+1` has a 1 at `j` and 0s after.
 *
 * Let's go back to the example: `nums = [2,3,5,7]`, `ans = [-1,1,4,3]`.
 *
 * `nums[i] = 2` (10). Even. Impossible. `ans[i] = -1`.
 * `nums[i] = 3` (11). Odd.
 *   `ans[i] = 1` (01). `ans[i]+1 = 2` (10). `1 | 2 = 3`. Minimal.
 * `nums[i] = 5` (101). Odd.
 *   `ans[i] = 4` (100). `ans[i]+1 = 5` (101). `4 | 5 = 5`. Minimal.
 * `nums[i] = 7` (111). Odd.
 *   `ans[i] = 3` (011). `ans[i]+1 = 4` (100). `3 | 4 = 7`. Minimal.
 *
 * Consider `N = A | (A+1)`.
 * If `N` has a bit `k` as 0, then `A` must have a bit `k` as 0.
 * Proof: If `A` had a 1 at bit `k`.
 *   If `A+1` also had a 1 at bit `k`, then `N` would have a 1 at bit `k`. Contradiction.
 *   If `A+1` had a 0 at bit `k`. This happens if bit `k` is the first bit that flips from 0 to 1 in `A+1`. This means `A` must have ended in `...011...1` (with `k` ones after the 0). Then `A+1` ends in `...100...0`.
 *   If `A` ends in `...11..1` (k ones), then `A+1` ends in `...00..0` (k zeros) and the bit before that flips.
 *
 * The critical realization is that `x | (x+1)` differs from `x` only at the positions of the rightmost 0 bit of `x` and all bits to its right.
 * Specifically, if `x` is `...P01...1` (k ones after the 0), then `x+1` is `...P10...0` (k zeros after the 1).
 * Then `x | (x+1)` is `...P11...1` (k+1 ones).
 *
 * So, `N = x | (x+1)` will always have the form `...P11...1` (a sequence of ones at the end).
 * The number of ones at the end of `N` is `k+1`, where `k` is the number of ones following the rightmost zero in `x`.
 *
 * If `N = ...P11...1` (m ones), then `x` must be `...P01...1` (m-1 ones).
 * This means `x` is obtained from `N` by flipping the `m`-th bit (from right, 1-indexed) from 1 to 0.
 *
 * The number of trailing ones in `N` is `m`.
 * To find `x`, we take `N` and unset the `m`-th bit.
 *
 * How to find `m`, the number of trailing ones in `N`?
 * `m` is the count of consecutive 1s from the LSB.
 * We can find this by iterating:
 * `count = 0`
 * `while (N & 1)`:
 *   `count++`
 *   `N >>= 1`
 * `m = count`
 *
 * Then `ans[i]` is obtained by flipping the `m`-th bit of `nums[i]` from 1 to 0.
 * Flipping the `m`-th bit (0-indexed) is equivalent to XORing with `1 << m`.
 * However, we are only supposed to flip a 1 to a 0.
 *
 * If `N = ...P11...1` (m ones), we want `A = ...P01...1` (m-1 ones).
 * This is equivalent to `A = N - (1 << (m-1))`.
 *
 * Let's re-verify this formula: `A = N - (1 << (m-1))`
 *
 * N = 3 (011). m=2. A = 3 - (1 << 1) = 3 - 2 = 1. (01). Correct.
 * N = 5 (101). m=1. A = 5 - (1 << 0) = 5 - 1 = 4. (100). Correct.
 * N = 7 (111). m=3. A = 7 - (1 << 2) = 7 - 4 = 3. (011). Correct.
 * N = 11 (1011). m=2. A = 11 - (1 << 1) = 11 - 2 = 9. (1001). Correct.
 *
 * So the logic is:
 * 1. If `nums[i]` is even, `ans[i] = -1`.
 * 2. If `nums[i]` is odd:
 *    a. Count the number of trailing ones `m` in `nums[i]`.
 *    b. The smallest `ans[i]` is `nums[i] - (1 << (m-1))`.
 *
 * How to implement step 2a efficiently?
 * Find the position of the least significant bit that is 0. Let this be `k`.
 * If `nums[i]` is `...011...1` (with `m` ones after the 0), then `k = m`.
 *
 * Let's use `nums[i] & (nums[i] + 1)`.
 * If `nums[i] = ...P11...1` (m ones)
 * `nums[i] + 1 = ...P'+100...0` (m zeros)
 * If `P` is `...0`, then `nums[i] + 1` is `...(0)+1 00...0` = `...100...0`.
 * `nums[i] & (nums[i] + 1)` would be `(...P11...1) & (...100...0)` = `...P00...0`.
 * So, `nums[i] - (nums[i] & (nums[i] + 1))` gives the trailing ones.
 * `N = 7 (111)`. N+1 = 8 (1000). N & (N+1) = 0. N - (N & (N+1)) = 7 (111).
 * `N = 11 (1011)`. N+1 = 12 (1100). N & (N+1) = 8 (1000). N - (N & (N+1)) = 3 (011).
 *
 * The value `nums[i] & (nums[i] + 1)` isolates the part of `nums[i]` up to the rightmost 0 bit.
 * `nums[i] = (bits_before_rightmost_0) 0 (trailing_ones)`
 * `nums[i] & (nums[i] + 1)` = `(bits_before_rightmost_0) 0 0`
 *
 * So, `nums[i] - (nums[i] & (nums[i] + 1))` gives the value of the trailing ones.
 * Let `trailing_ones_val = nums[i] - (nums[i] & (nums[i] + 1))`.
 *
 * Example: N = 11 (1011). `nums[i] & (nums[i]+1)` = 8 (1000).
 * `trailing_ones_val = 11 - 8 = 3` (0011).
 *
 * The number of trailing ones `m` is `log2(trailing_ones_val + 1)`.
 * Or, we can find `m` by iterating.
 *
 * A simpler way to get the `m-1` value:
 * `N = ...P11...1` (m ones)
 * We want `A = ...P01...1` (m-1 ones)
 *
 * Consider `N ^ (N-1)`.
 * N = 3 (011). N-1 = 2 (010). N ^ (N-1) = 001 (1).
 * N = 5 (101). N-1 = 4 (100). N ^ (N-1) = 001 (1).
 * N = 7 (111). N-1 = 6 (110). N ^ (N-1) = 001 (1).
 * N = 11 (1011). N-1 = 10 (1010). N ^ (N-1) = 0001 (1).
 * This isolates the LSB.
 *
 * Let's use the property that if `N = A | (A+1)`, then `N` must have a 0 at any bit position `k` where `A` has a 0 AND `A+1` has a 0.
 * This implies that if `N` has a 1 at bit `k`, then either `A` has a 1 or `A+1` has a 1 (or both).
 *
 * Consider `A = N ^ mask`. What should the mask be?
 *
 * If `N` is odd, then `N = A | (A+1)`.
 *
 * Let's think about the required properties of `A`.
 * For `A | (A+1) == N`, `A` must satisfy:
 * 1. `A <= N` (since ORing can only turn bits on or keep them on).
 * 2. If bit `k` is 0 in `N`, it must be 0 in `A`.
 *
 * We are looking for the *minimal* `A`.
 *
 * If `N` is odd, let's try to construct `A` greedily from LSB.
 *
 * Consider `N`'s binary representation.
 * If `N[k] == 0`, then `A[k]` must be 0.
 * If `N[k] == 1`:
 *   If `A[k]` is 0, then `A+1` must have a 1 at bit `k`. This happens if `A` has bits `k-1` down to `0` as 1s, and `A[k]` is the first 0.
 *   If `A[k]` is 1, then `A+1` could have 0 or 1 at bit `k`.
 *
 * Let's revisit the rule:
 * If `nums[i]` is odd, let `m` be the count of trailing ones in `nums[i]`.
 * `ans[i] = nums[i] - (1 << (m-1))`.
 *
 * Example: `nums[i] = 5` (101). `m=1`. `ans[i] = 5 - (1 << 0) = 5 - 1 = 4` (100).
 * `4 | (4+1) = 100 | 101 = 101` (5). Correct.
 *
 * Example: `nums[i] = 7` (111). `m=3`. `ans[i] = 7 - (1 << 2) = 7 - 4 = 3` (011).
 * `3 | (3+1) = 011 | 100 = 111` (7). Correct.
 *
 * This formula seems robust.
 *
 * How to compute `m`, the number of trailing ones?
 * `m` is the count of consecutive 1s from the LSB.
 *
 * Method 1: Loop.
 * `m = 0; temp_n = nums[i];`
 * `while (temp_n > 0 && (temp_n & 1) === 1) { m++; temp_n >>= 1; }`
 * This loop will give `m` if `nums[i]` is all ones.
 * If `nums[i] = 5` (101), `temp_n=5`. `(5&1)===1`, `m=1`, `temp_n=2`. `(2&1)===0`. Loop ends. `m=1`. Correct.
 * If `nums[i] = 7` (111), `temp_n=7`. `(7&1)===1`, `m=1`, `temp_n=3`. `(3&1)===1`, `m=2`, `temp_n=1`. `(1&1)===1`, `m=3`, `temp_n=0`. Loop ends. `m=3`. Correct.
 *
 * Method 2: Using bitwise operations.
 * The number of trailing ones `m` is the position of the rightmost zero bit plus one, if `nums[i]` were `...011...1`.
 * More directly, `m` is the count of consecutive 1s from LSB.
 * This count can be found by `__builtin_ctz(N ^ (N - 1))` if N has a single block of ones.
 *
 * Let's consider `N & -N` which isolates the LSB.
 * If `N` is odd, `N & -N` is always 1.
 *
 * Let's think about `N` and `N >> 1`.
 * `N = 7 (111)`. `N>>1 = 3 (011)`.
 * `N ^ (N>>1) = 4 (100)`. The position of the MSB of this result tells us something.
 *
 * A reliable way to find the number of trailing ones `m`:
 * `m = 0`
 * `while ((nums[i] >> m) & 1)`:
 *   `m++`
 * This counts consecutive 1s from the LSB.
 * Example: `nums[i] = 5 (101)`.
 * m=0: `(5 >> 0) & 1` = `5 & 1` = 1. `m` becomes 1.
 * m=1: `(5 >> 1) & 1` = `2 & 1` = 0. Loop terminates.
 * So `m=1`.
 *
 * Example: `nums[i] = 7 (111)`.
 * m=0: `(7 >> 0) & 1` = `7 & 1` = 1. `m` becomes 1.
 * m=1: `(7 >> 1) & 1` = `3 & 1` = 1. `m` becomes 2.
 * m=2: `(7 >> 2) & 1` = `1 & 1` = 1. `m` becomes 3.
 * m=3: `(7 >> 3) & 1` = `0 & 1` = 0. Loop terminates.
 * So `m=3`.
 *
 * This looks correct.
 *
 * Final Algorithm:
 * Iterate through `nums` array. For each `num`:
 *   If `num % 2 == 0` (i.e., `num` is even):
 *     Add `-1` to the result array.
 *   Else (`num` is odd):
 *     Calculate `m`, the count of trailing ones in `num`.
 *       Initialize `m = 0`.
 *       While `(num >> m) & 1` is true:
 *         Increment `m`.
 *     The value `ans_val` is `num - (1 << (m - 1))`.
 *     Add `ans_val` to the result array.
 * Return the result array.
 *
 * Time Complexity:
 * For each element in `nums`, we perform a loop to count trailing ones. The maximum value of `nums[i]` is 1000. The binary representation of 1000 has about 10 bits. So the loop runs at most 10-11 times.
 * The overall time complexity is O(N * log(max(nums))), where N is the length of `nums`.
 * Since `max(nums) <= 1000`, `log(max(nums))` is a small constant (around 10).
 * So, effectively O(N).
 *
 * Space Complexity:
 * O(N) for the result array `ans`. If we modify `nums` in place (not allowed by problem constraints for output), it could be O(1) extra space. But standard practice is to create a new array for `ans`.
 *
 * Example walkthrough:
 * nums = [2,3,5,7]
 *
 * i = 0, num = 2:
 *   2 % 2 == 0. Even. ans[0] = -1.
 *
 * i = 1, num = 3 (binary 11):
 *   3 % 2 != 0. Odd.
 *   Count trailing ones `m`:
 *     m=0: (3>>0)&1 = (3)&1 = 1. m=1.
 *     m=1: (3>>1)&1 = (1)&1 = 1. m=2.
 *     m=2: (3>>2)&1 = (0)&1 = 0. Loop ends. m=2.
 *   ans_val = 3 - (1 << (2 - 1)) = 3 - (1 << 1) = 3 - 2 = 1. ans[1] = 1.
 *
 * i = 2, num = 5 (binary 101):
 *   5 % 2 != 0. Odd.
 *   Count trailing ones `m`:
 *     m=0: (5>>0)&1 = (5)&1 = 1. m=1.
 *     m=1: (5>>1)&1 = (2)&1 = 0. Loop ends. m=1.
 *   ans_val = 5 - (1 << (1 - 1)) = 5 - (1 << 0) = 5 - 1 = 4. ans[2] = 4.
 *
 * i = 3, num = 7 (binary 111):
 *   7 % 2 != 0. Odd.
 *   Count trailing ones `m`:
 *     m=0: (7>>0)&1 = (7)&1 = 1. m=1.
 *     m=1: (7>>1)&1 = (3)&1 = 1. m=2.
 *     m=2: (7>>2)&1 = (1)&1 = 1. m=3.
 *     m=3: (7>>3)&1 = (0)&1 = 0. Loop ends. m=3.
 *   ans_val = 7 - (1 << (3 - 1)) = 7 - (1 << 2) = 7 - 4 = 3. ans[3] = 3.
 *
 * Result: [-1, 1, 4, 3]. Matches Example 1.
 */
/**
 * @param {number[]} nums
 * @return {number[]}
 */
const constructBitwiseArray = (nums) => {
    // Initialize the result array.
    const ans = [];

    // Iterate through each number in the input array nums.
    for (const num of nums) {
        // Check if the number is even.
        // If num is even, it's impossible to find an integer 'x' such that x | (x + 1) == num.
        // This is because x | (x + 1) is always odd.
        if (num % 2 === 0) {
            // If impossible, append -1 to the result array.
            ans.push(-1);
        } else {
            // If the number is odd, we need to find the smallest 'ans_val' such that ans_val | (ans_val + 1) == num.
            // Let num = A | (A + 1).
            // If num has a binary representation like ...P11...1 (with 'm' trailing ones),
            // then the smallest A must have a binary representation like ...P01...1 (with 'm-1' trailing ones).
            // This means A is obtained by flipping the m-th bit (1-indexed from right) of num from 1 to 0.
            // This is equivalent to: A = num - (1 << (m - 1)).

            // First, we need to find 'm', the count of consecutive trailing ones in 'num'.
            let m = 0;
            // We shift 'num' to the right and check the least significant bit.
            // This loop counts how many 1s are present consecutively from the LSB.
            while (((num >> m) & 1) === 1) {
                m++;
            }

            // 'm' now holds the count of trailing ones.
            // The formula derived is: ans_val = num - (1 << (m - 1)).
            // This effectively turns the rightmost block of 'm' ones into 'm-1' ones,
            // and flips the bit before that block from 1 to 0 (which was implicitly handled by subtracting 2^(m-1)).
            // Example: num = 7 (111), m=3. ans_val = 7 - (1 << (3-1)) = 7 - (1 << 2) = 7 - 4 = 3 (011).
            // Example: num = 5 (101), m=1. ans_val = 5 - (1 << (1-1)) = 5 - (1 << 0) = 5 - 1 = 4 (100).
            const ans_val = num - (1 << (m - 1));

            // Append the calculated minimal value to the result array.
            ans.push(ans_val);
        }
    }

    // Return the constructed array.
    return ans;
};
