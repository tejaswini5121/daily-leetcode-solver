```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    /**
     * Problem: Construct the Minimum Bitwise Array I
     * Link: https://leetcode.com/problems/construct-the-minimum-bitwise-array-i/
     *
     * Approach:
     * For each number `num` in `nums`, we need to find the smallest `x` such that `x | (x + 1) == num`.
     * Let's analyze the condition `x | (x + 1) == num`.
     * Consider the binary representation of `x` and `x + 1`.
     * Adding 1 to `x` flips the trailing zeros to ones and flips the rightmost one to zero.
     * For example:
     * If x = 3 (binary 011), x + 1 = 4 (binary 100). x | (x + 1) = 011 | 100 = 111 (7).
     * If x = 4 (binary 100), x + 1 = 5 (binary 101). x | (x + 1) = 100 | 101 = 101 (5).
     *
     * If the least significant bit (LSB) of `num` is 1, it means the LSB of `x` must be 0.
     * If the LSB of `num` is 0, it means the LSB of `x` must be 1 (because `x + 1` will have a 0 at this position if `x` has a 1).
     *
     * Let's consider the property that `x | (x + 1)` will have the same bits as `x` wherever `x` has a 1,
     * and also the bits that are flipped from 0 to 1 in `x + 1`.
     * Specifically, `x + 1` differs from `x` at the rightmost set bit and all bits to its right.
     * For example, if `x = ...a100...0` (k zeros), then `x + 1 = ...a011...1` (k ones).
     * `x | (x + 1)` will have all the bits of `x` and all the bits of `x + 1`.
     *
     * The condition `x | (x + 1) == num` implies that `num` must have all the bits of `x` set, and also the bits that are turned on when adding 1.
     * Crucially, `x + 1` will always have a 1 at the position where `x` has its rightmost 0, and a 0 at the position where `x` has its rightmost 1.
     *
     * Consider `num` in binary.
     * If the LSB of `num` is 1, then `x` must have LSB 0. `x | (x+1)` would then have LSB 1.
     * If the LSB of `num` is 0, then `x` must have LSB 1. `x | (x+1)` would then have LSB 0.
     *
     * Let `num` be the target. We are looking for the smallest `x` such that `x | (x + 1) == num`.
     *
     * If `num` has its LSB as 0:
     * This means `x` must have its LSB as 1.
     * Then `x + 1` will have its LSB as 0.
     * The OR operation will result in the LSB of `num` being 0.
     * This implies that `num` must have all bits set that are set in `x` OR `x+1`.
     *
     * Key Observation: `x | (x + 1)` is related to `num`.
     * If we look at the bits of `num`, if a bit is 0, it must be 0 in both `x` and `x+1` in that position.
     * If a bit is 1 in `num`, it must be 1 in either `x` or `x+1` (or both, though that's rare for adjacent `x` and `x+1`).
     *
     * Let's test values of `x` from 0 upwards and check the condition. Since we need the minimum `ans[i]`, this brute-force approach for each `num` is feasible given the constraints (nums[i] <= 1000).
     * For a given `num`, we can iterate `x` from 0. The maximum possible `x` such that `x | (x + 1) == num` can't be much larger than `num`. Since `x | (x+1)` can only set bits that are present in `x` or `x+1`, `x` cannot be greater than `num`. In fact, `x` will be less than or equal to `num`.
     *
     * The most efficient way to find `x` is by examining the binary representation of `num`.
     * `x | (x + 1) == num`
     * This means that for every bit that is 0 in `num`, that bit must be 0 in `x` and 0 in `x + 1`.
     * For every bit that is 1 in `num`, that bit must be 1 in `x` or 1 in `x + 1`.
     *
     * Let's consider the rightmost unset bit in `num`. Let this be at position `k`.
     * If `num` has a 0 at position `k`, then both `x` and `x + 1` must have a 0 at position `k`.
     * This means that `x` must have a 0 at position `k` and all bits to the right of `k` must be 1s to ensure `x+1` flips this 0 to a 1 and trailing 1s to 0s.
     *
     * Consider the rightmost bit where `num` has a 0. Let this be bit `p`.
     * If `x | (x + 1) == num`, then at bit `p`, `x` must have a 0 and `x + 1` must have a 0.
     * This implies that `x` must have a 1 at bit `p-1`, and all bits to the right of `p-1` in `x` must be 1s.
     * E.g., if `num = ...0111`, the rightmost 0 is at bit `p`. So `x` must end in `...0111`.
     *
     * Let's try to construct `x` from `num`.
     * If `num` has a 0 bit at position `i`:
     * This means that `x` must have a 0 at position `i` and `x+1` must have a 0 at position `i`.
     * The only way `x+1` can have a 0 at position `i` is if `x` had a 0 at position `i` and carries stop before reaching `i`.
     *
     * Consider `num`. If `num` has a 0 at some bit position, then both `x` and `x+1` must have a 0 at that bit position.
     * This can only happen if all bits to the right of that 0 in `x` are 1s.
     * For example, if `num = 5` (binary `101`).
     * We want `x | (x + 1) == 101`.
     * Iterating `x`:
     * x = 0: 0 | 1 = 1 (not 5)
     * x = 1: 1 | 2 = 3 (not 5)
     * x = 2: 2 | 3 = 3 (not 5)
     * x = 3: 3 | 4 = 7 (not 5)
     * x = 4: 4 | 5 = 5 (found it! x = 4)
     *
     * For `num = 2` (binary `10`).
     * We want `x | (x + 1) == 10`.
     * x = 0: 0 | 1 = 1 (not 2)
     * x = 1: 1 | 2 = 3 (not 2)
     * No solution for `x=0, 1`. If we test larger `x`, e.g., x = 2: 2 | 3 = 3.
     * The property `x | (x+1)` means that if `x` ends with `...011...1` (k ones), then `x+1` ends with `...100...0` (k zeros). The OR will set all these bits.
     * So `x | (x+1)` will have a pattern of bits that are consecutive 1s from some point onwards, or it can have blocks of 1s.
     *
     * Let's rethink `x | (x+1) == num`.
     * This means `num` has all the bits of `x` set, and also the bits that flip when going from `x` to `x+1`.
     * The bits that flip are the rightmost zero bit in `x` (becomes 1) and all the ones to its right (become 0).
     *
     * If `num` has a 0 at bit `i`, then `x` has 0 at bit `i` AND `x+1` has 0 at bit `i`.
     * The only way `x+1` can have a 0 at bit `i` is if `x` had a 0 at bit `i` and no carry propagated to `i`.
     * This implies that all bits to the right of `i` in `x` must be 1s.
     * So, if `num` has a 0 at bit `i`, `x` must end in `...011...1` (with `i` ones to the right of 0).
     *
     * Consider the bits of `num`.
     * If `num` has a 0 bit at position `p`: This means `x` must have a 0 at position `p`.
     * For `x | (x + 1)` to equal `num`, all bits in `num` that are 0 must also be 0 in `x` and `x+1`.
     * If `num` has a 0 at bit `p`, then `x` must have a 0 at bit `p`.
     * For `x+1` to also have a 0 at bit `p`, all bits to the right of `p` in `x` must be 1s.
     * Example: `num = 2` (binary `10`). Rightmost 0 is at bit 0.
     * If `x` has a 0 at bit 0, then `x` is even.
     * `x` must end in `...0`. `x+1` ends in `...1`. `x | (x+1)` has LSB 1.
     * This is contradictory if `num` has LSB 0.
     *
     * Let's look at `num - x`. This is always 1 if there's no borrow.
     * Or `num ^ x` will have the bits that are set in `num` but not in `x`.
     *
     * Crucial observation: If `x | (x + 1) == num`, then `num` must contain all the set bits of `x`.
     * This means `x <= num`.
     * Also, `x + 1` must not introduce any new set bits beyond `num`.
     *
     * Let's analyze `num & 1`.
     * If `num & 1 == 1` (LSB is 1):
     * This means `x` must have LSB 0 and `x+1` must have LSB 1. This is impossible.
     * OR
     * This means `x` has LSB 0 and `x+1` has LSB 1, and the OR operation results in 1.
     * If `x` is even (ends in 0), `x+1` is odd (ends in 1). `x | (x+1)` will end in 1. This is consistent.
     * If `num & 1 == 0` (LSB is 0):
     * This means `x` must have LSB 1 and `x+1` must have LSB 0. `x | (x+1)` will end in 0. This is consistent.
     *
     * So, the LSB of `num` dictates the LSB of `x`:
     * If `num` is odd, `x` must be even.
     * If `num` is even, `x` must be odd.
     *
     * Consider `num = 5` (binary `101`). `num` is odd. `x` must be even.
     * We are looking for smallest `x` such that `x | (x+1) == 5`.
     * Try even `x`: 0, 2, 4, ...
     * x = 0: 0 | 1 = 1 != 5
     * x = 2: 2 | 3 = 3 != 5
     * x = 4: 4 | 5 = 5. Bingo! `x=4`.
     *
     * Consider `num = 2` (binary `10`). `num` is even. `x` must be odd.
     * We are looking for smallest `x` such that `x | (x+1) == 2`.
     * Try odd `x`: 1, 3, 5, ...
     * x = 1: 1 | 2 = 3 != 2
     * x = 3: 3 | 4 = 7 != 2
     * It seems no odd `x` works here.
     * The condition `x | (x + 1) == num` implies that `num` must have a certain structure.
     *
     * If `num` has a 0 bit at position `p`, then both `x` and `x+1` must have a 0 at position `p`.
     * This means that the bits to the right of `p` in `x` must all be 1s.
     * If `x` ends in `...0111` (with `k` ones), then `x+1` ends in `...1000` (with `k` zeros).
     * `x | (x + 1)` will then be `...1111` up to the bit before the last 0 of `x`.
     *
     * So, `num` must be of the form `(...1)0` where the `0` is the rightmost `0` bit, and all bits to the right are `1`s.
     * No, this is not quite right.
     *
     * Let's consider the property `x | (x + 1)`.
     * If `x` is `...b011..1` (k ones), then `x+1` is `...b100..0` (k zeros).
     * `x | (x+1)` is `...b111..1` (k ones).
     * This means `num` must have a contiguous block of 1s at its lower bits, up to the position of the rightmost 0 in `x`.
     *
     * Example: `x = 4` (binary `100`). `k=0`. `x | (x+1)` is `100 | 101 = 101` (5). `num = 5`. The rightmost 0 in `x` is at bit 2. The bits to the right are none. The `1` is at bit 2. `num` has a `1` at bit 2 and all bits to its right are `1`? No.
     *
     * Correct interpretation:
     * For `x | (x+1) == num`:
     * If `num` has a 0 at bit `p`, then both `x` and `x+1` must have a 0 at bit `p`.
     * This is only possible if `x` has a 0 at bit `p` and all bits to the right of `p` in `x` are 1s.
     * Example: if `num` has 0 at bit 2 (`1011` -> `1011`).
     * Then `x` must have 0 at bit 2, and bits 0 and 1 must be 1. So `x` ends in `011`.
     * E.g., `x = 3` (binary `011`). `x+1 = 4` (binary `100`). `x | (x+1) = 7` (binary `111`). `num = 7`. Here, `num` has a 0 at bit 3. `x` has 0 at bit 3.
     *
     * If `num` has a 0 at bit `p`, then `x` must have a 0 at bit `p`, AND all bits to the right of `p` in `x` must be 1s.
     * So `x` would look like `Y011...1` (where there are `p` ones).
     * Then `x+1` would look like `Y100...0` (where there are `p` zeros).
     * `x | (x+1)` would look like `Y111...1` (where there are `p` ones).
     *
     * So, `num` must be of the form `Z` followed by a `1`, followed by `p` ones. `num = Z11...1` (`p` ones).
     * And `x` is `Z011...1` (`p` ones).
     *
     * What if `num` has a 1 at bit `p`?
     * If `num` has a 1 at bit `p`.
     * Case 1: `x` has 1 at bit `p`. Then `x+1` might have 0 or 1.
     * Case 2: `x` has 0 at bit `p`. Then `x+1` must have 1 at bit `p` (carry from `p-1`).
     *
     * Consider the simplest condition: `x` has `k` trailing zeros.
     * `x = A011...1` (k ones)
     * `x+1 = A100...0` (k zeros)
     * `x | (x+1) = A111...1` (k ones)
     * So, `num` must be composed of some prefix `A` followed by a `1` followed by `k` ones.
     * `num = A10...0` (k zeros) is not possible if we want `x | (x+1) == num`.
     *
     * If `num = 2` (binary `10`). It does not fit the pattern `A11...1`. So, maybe no solution.
     * The problem states `nums[i]` are prime numbers.
     * Primes >= 2: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, ...
     *
     * Let's consider `num` in binary.
     * Find the rightmost bit that is 0. Let this be position `p`.
     * If `num` has a 0 at position `p`, then `x` must have a 0 at position `p`.
     * For `x+1` to also have a 0 at position `p`, all bits to the right of `p` in `x` must be 1s.
     * So `x` would be of the form `Y011...1` (p ones).
     * Then `x+1` would be `Y100...0` (p zeros).
     * `x | (x+1)` would be `Y111...1` (p ones).
     * This means `num` must be of the form `Y11...1` (p ones).
     *
     * If `num` does NOT have such a form (i.e., it doesn't end with a 0 followed by only 1s), then no solution exists.
     * This is because if `num` has a 0 at bit `p`, and *any* bit to the right of `p` is also 0, then it's impossible.
     *
     * Example: `num = 2` (binary `10`). The rightmost 0 is at bit 0. The bit to its right is not applicable.
     * The form `Y11...1` means the suffix of `num` must be `1` or `11` or `111` etc.
     * If `num` is `10`: Does it end with a `0` followed by `1`s? No.
     * So `2` cannot be formed by `x | (x+1)`. Hence `ans[0] = -1`.
     *
     * Example: `num = 3` (binary `11`). Does it end with `0` followed by `1`s? No. But it can be formed.
     * `x = 1` (binary `01`). `x+1 = 2` (binary `10`). `x | (x+1) = 3` (binary `11`).
     * Here, `x` is `01`, `x+1` is `10`. The OR is `11`.
     *
     * Let's reconsider `x | (x+1) == num`.
     * This implies `x <= num`.
     *
     * If `num` has the property that `num & (num + 1) == num`:
     * This means `num` has `k` trailing 1s, like `...011...1`.
     * For example, `num=3` (binary `11`). `num+1=4` (binary `100`). `3 & 4 = 0`. Not `3`.
     * The property `num & (num + 1) == num` is incorrect.
     *
     * Let's try to construct `x` for a given `num`.
     * If `num` has a 0 at bit `p`, then `x` must have a 0 at bit `p` and `x+1` must have a 0 at bit `p`.
     * This implies that all bits to the right of `p` in `x` are 1s.
     * So, `x` must end in `011...1` (p ones).
     * `x = prefix | ( (1 << p) - 1 )` where the bit at `p` in `prefix` is 0.
     * And `x+1 = prefix | (1 << p)`
     * `x | (x+1) = prefix | (1 << p) | ( (1 << p) - 1 )`.
     * This simplifies to `prefix | ( (1 << (p+1)) - 1 )`.
     *
     * So, if `num` has a 0 at bit `p`, then `num` must be of the form `Y11...1` (p ones).
     * And `x` is `Y011...1` (p ones).
     *
     * To find such `x` for a given `num`:
     * 1. Find the position `p` of the rightmost 0 bit in `num`.
     * 2. Check if all bits to the right of `p` in `num` are 1s.
     *    This can be checked by: `(num >> p) == ((1 << (bit_length_of_num - p)) - 1)`
     *    Or more simply: `(num & ((1 << p) - 1)) == ((1 << p) - 1)`
     *    No, this is wrong.
     *
     * Let `p` be the position of the rightmost 0 bit in `num`.
     * Example: `num = 5` (binary `101`). `p=1` (second bit from right is 0).
     * Bits to the right of `p` in `num` must be 1s. In `101`, the bit at position 0 is 1. This holds.
     * The candidate for `x` is obtained by flipping the bit at position `p` to 0 (if it was 1 in `num`) and setting all bits to the right of `p` to 1.
     *
     * Let's find the rightmost unset bit of `num`.
     * `rightmost_unset = (~num) & (num + 1)`
     * This gives a mask with only the rightmost unset bit of `num`.
     *
     * If `rightmost_unset == 0`, it means `num` is all 1s (e.g., `111`).
     * `num = 7` (binary `111`). `num+1 = 8` (binary `1000`). `~7` is `...000`. `~7 & 8 = 0`.
     * If `num` is all 1s, like `3` (`11`), `7` (`111`), `15` (`1111`), then `x = num - 1`.
     * E.g., `num = 3`. `x = 2`. `2 | 3 = 3`. Correct.
     * E.g., `num = 7`. `x = 6`. `6 | 7 = 7`. Correct.
     * E.g., `num = 15`. `x = 14`. `14 | 15 = 15`. Correct.
     * This covers cases like `num = 3, 7, 15, 31, ...` which are `(1 << k) - 1`.
     * If `num = (1 << k) - 1`, then `ans[i] = num - 1`.
     *
     * If `num` is not of the form `(1 << k) - 1`:
     * Find the rightmost 0 bit in `num`. Let its position be `p`.
     * `num = Y011...1` (p ones)
     * The bits to the right of `p` in `num` must all be 1.
     * This can be checked: `(num & ((1 << p) - 1)) == ((1 << p) - 1)`.
     *
     * Let's re-examine `x | (x + 1) == num`.
     * Consider `num`.
     * If `num` has a 0 at bit `p`, then `x` must have a 0 at bit `p`, and `x+1` must have a 0 at bit `p`.
     * This implies that `x` must end in `...011...1` (p ones).
     * So `x = Y011...1` (p ones).
     * Then `x+1 = Y100...0` (p zeros).
     * `x | (x+1) = Y111...1` (p ones).
     *
     * This means `num` MUST have the form `Y11...1` (p ones).
     * So, `num` has a 0 at position `p`, and all bits to the right of `p` are 1s.
     * This check: `(num & ((1 << p) - 1)) == ((1 << p) - 1)` where `p` is the index of the rightmost zero.
     *
     * If this condition holds, then `x` is formed by taking `num`, flipping the bit at position `p` to 0.
     * `x = num & ~(1 << p)`.
     *
     * Let's test:
     * `num = 2` (binary `10`). Rightmost 0 is at `p=0`. Check `(2 & ((1 << 0) - 1)) == ((1 << 0) - 1)` => `(2 & 0) == 0` => `0 == 0`. This condition seems to hold.
     * Candidate `x = 2 & ~(1 << 0) = 2 & ~1 = 2 & ...1110 = 0`.
     * Check `x | (x+1)`: `0 | (0+1) = 0 | 1 = 1`. But `num` is 2. So this `x` is wrong.
     *
     * What is wrong with the logic?
     * The condition `x | (x+1) == num` implies that `num` must be composed of `x` and the carry bits.
     * The critical insight must be about how `x` and `x+1` differ.
     * `x+1` differs from `x` at the rightmost 0 of `x` (it becomes 1) and all trailing 1s (they become 0).
     *
     * Let's trace the values:
     * `num = 2` (binary `10`). We want `x | (x+1) = 10`.
     * Try values for `x`:
     * `x=0` (`00`): `0 | 1 = 1` (`01`)
     * `x=1` (`01`): `1 | 2 = 3` (`11`)
     *
     * `num = 3` (binary `11`). We want `x | (x+1) = 11`.
     * `x=1` (`01`): `1 | 2 = 3` (`11`). Correct. `ans[1] = 1`.
     *
     * `num = 5` (binary `101`). We want `x | (x+1) = 101`.
     * `x=4` (`100`): `4 | 5 = 5` (`101`). Correct. `ans[2] = 4`.
     *
     * `num = 7` (binary `111`). We want `x | (x+1) = 111`.
     * `x=3` (`011`): `3 | 4 = 7` (`111`). Correct. `ans[3] = 3`.
     *
     * It seems the key is `num` must be formed by `x` and `x+1` bits.
     * Any bit that is 0 in `num` must be 0 in both `x` and `x+1`.
     * Any bit that is 1 in `num` must be 1 in `x` OR 1 in `x+1`.
     *
     * If a bit `p` is 0 in `num`:
     * Then `x` has 0 at `p` AND `x+1` has 0 at `p`.
     * This means `x` must have a 0 at bit `p`, and no carry propagated to bit `p`.
     * This implies all bits to the right of `p` in `x` must be 1s.
     * So `x` looks like `Y011...1` (p ones).
     * Then `x+1` looks like `Y100...0` (p zeros).
     * `x | (x+1)` looks like `Y111...1` (p ones).
     *
     * Therefore, for `x | (x+1) == num` to have a solution, `num` MUST be of the form `Y11...1` (p ones), where `p` is the position of the rightmost 0 in `num`.
     * In other words, `num` has a 0 at bit `p`, and all bits `0` to `p-1` are 1s.
     *
     * How to check this property for `num`:
     * Find the position `p` of the rightmost 0 bit in `num`.
     * `p = Integer.numberOfTrailingZeros(~num)`. If `num` is all 1s, `~num` is 0, `numberOfTrailingZeros(0)` is undefined or 32.
     * If `num` is all 1s (e.g., 3, 7, 15), then `ans = num - 1`.
     *
     * Let's handle the all-ones case first. If `num == (1 << k) - 1` for some `k`, then `ans = num - 1`.
     * For `num=3` (`11`), `k=2`. `ans = 3-1 = 2`? No, `ans=1`.
     * Wait, `x = num - 1` is NOT always the answer when `num` is all ones.
     * `num = 3` (`11`). `ans = 1`. `1 | 2 = 3`.
     * `num = 7` (`111`). `ans = 3`. `3 | 4 = 7`.
     * `num = 15` (`1111`). `ans = ?`. `15 = 1111`. We need `x | (x+1) = 1111`.
     * Try `x=7` (`0111`). `x+1=8` (`1000`). `x | (x+1) = 15` (`1111`). So `ans = 7`.
     * It seems if `num` is `(1 << k) - 1`, then `ans = (1 << (k-1)) - 1`.
     *
     * General Approach:
     * For each `num` in `nums`:
     * 1. Find the smallest `x >= 0` such that `x | (x + 1) == num`.
     * 2. If no such `x` exists, `ans[i] = -1`.
     * 3. Minimize `x`.
     *
     * Brute force check for each `num`: iterate `x` from 0 up to `num` (or a bit beyond).
     * Since `nums[i] <= 1000`, `x` will not exceed 1000.
     * Max `x` could be is roughly `num`. So `x` up to 1000 is fine.
     *
     * For a given `num`:
     * Iterate `x` from 0 to `num` (or slightly higher, e.g., 1024 as a safe upper bound).
     * If `(x | (x + 1)) == num`, then this `x` is a potential candidate. Since we are iterating `x` from 0, the first one we find will be the minimum.
     * If the loop finishes without finding a solution, set `ans[i] = -1`.
     *
     * Example: `num = 2`.
     * x = 0: 0 | 1 = 1 != 2
     * x = 1: 1 | 2 = 3 != 2
     * x = 2: 2 | 3 = 3 != 2
     * ... loop finishes, ans = -1.
     *
     * Example: `num = 3`.
     * x = 0: 0 | 1 = 1 != 3
     * x = 1: 1 | 2 = 3 == 3. Found! ans = 1. Break.
     *
     * Example: `num = 5`.
     * x = 0: 0 | 1 = 1 != 5
     * x = 1: 1 | 2 = 3 != 5
     * x = 2: 2 | 3 = 3 != 5
     * x = 3: 3 | 4 = 7 != 5
     * x = 4: 4 | 5 = 5 == 5. Found! ans = 4. Break.
     *
     * This brute-force approach seems correct and efficient enough given the constraints.
     *
     * Time Complexity: O(N * M), where N is the length of `nums` and M is the maximum value in `nums` (or the upper bound for `x` we check, e.g., 1024).
     * Given `N <= 100` and `M <= 1000`, `100 * 1000 = 100,000` operations per test case, which is well within limits.
     *
     * Space Complexity: O(N) for the result array `ans`.
     */
    public int[] constructBitwiseArray(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n]; // Initialize the result array

        // Iterate through each number in the input array nums
        for (int i = 0; i < n; i++) {
            int num = nums[i]; // The target value for ans[i] OR (ans[i] + 1)
            boolean found = false; // Flag to indicate if a solution is found for the current num

            // Iterate through possible values of ans[i] starting from 0.
            // We only need to check up to a reasonable upper bound.
            // Since x | (x + 1) can only set bits present in x or x+1,
            // x will not be significantly larger than num.
            // A safe upper bound like 1024 is sufficient since nums[i] <= 1000.
            for (int x = 0; x < 1024; x++) {
                // Check if the condition ans[i] OR (ans[i] + 1) == nums[i] is met
                if ((x | (x + 1)) == num) {
                    ans[i] = x; // Assign the minimum found value of x to ans[i]
                    found = true; // Set the flag to true
                    break; // Since we are looking for the minimum x, we can break once found
                }
            }

            // If no solution was found after checking all possible x values
            if (!found) {
                ans[i] = -1; // Set ans[i] to -1 as per problem statement
            }
        }

        return ans; // Return the constructed array
    }
}
```