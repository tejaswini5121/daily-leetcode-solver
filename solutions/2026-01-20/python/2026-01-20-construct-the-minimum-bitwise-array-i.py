```python
# Problem: Construct the Minimum Bitwise Array I
# Link: https://leetcode.com/problems/construct-the-minimum-bitwise-array-i/
#
# Approach:
# For each number `num` in the input array `nums`, we need to find the smallest non-negative integer `x` such that `x | (x + 1) == num`.
# If such an `x` exists, we add it to our result array `ans`. Otherwise, we add -1.
#
# Let's analyze the condition `x | (x + 1) == num`.
# Consider the binary representation of `x` and `x + 1`.
# The operation `x + 1` flips the least significant bit (LSB) that is 0 and all subsequent 1s to 0.
# For example:
# x = 3 (011) -> x+1 = 4 (100) -> x | (x+1) = 7 (111)
# x = 4 (100) -> x+1 = 5 (101) -> x | (x+1) = 5 (101)
# x = 1 (001) -> x+1 = 2 (010) -> x | (x+1) = 3 (011)
#
# If the LSB of `x` is 0, then `x+1` will have a 1 at that position, and all bits to the right will be flipped.
# If the LSB of `x` is 1, then `x+1` will flip the LSB to 0 and propagate a carry.
#
# The key observation is that `x | (x + 1)` will always have the same bits set as `x` up to the point where `x+1` differs.
# Specifically, `x | (x + 1)` will be equal to `num` if and only if:
# 1. All bits set in `x` are also set in `num`.
# 2. All bits set in `x + 1` are also set in `num`.
# 3. `num` contains all the bits that are set in either `x` or `x + 1`.
#
# Let's consider the binary representation of `num`. If `num` has a bit set, and `x | (x + 1)` is supposed to equal `num`, then either `x` or `x + 1` must have that bit set.
#
# Crucially, the operation `x | (x + 1)` has a property: the resulting value `num` will always be one greater than `x` if `x` ends with a 0 in binary, or `num` will have its lowest set bit flipped to 0 and a higher bit set if `x` ends with a 1.
#
# A more direct approach:
# For a given `num`, we are looking for the smallest `x` such that `x | (x + 1) == num`.
# We can iterate through possible values of `x` starting from 0. However, this would be inefficient.
#
# Let's analyze the bits of `num`.
# If `x | (x + 1) == num`, then any bit that is 0 in `num` must be 0 in both `x` and `x + 1`.
# This implies that if `num` has a 0 bit, then `x` must also have a 0 bit at that position.
#
# Consider the bits of `num` from least significant to most significant.
# If `num` has a 0 at position `k`, then both `x` and `x + 1` must have a 0 at position `k`.
#
# If `num` is `x | (x + 1)`, then any bit that is 1 in `num` must be 1 in either `x` or `x + 1` (or both).
#
# Let's look at the difference `num - x`.
# `num = x | (x + 1)`
# This means `num` contains all the set bits of `x` and `x + 1`.
#
# Consider the case where `x` is a power of 2 minus 1, e.g., `x = 2^k - 1`.
# Then `x` is `k` ones in binary (e.g., 0111). `x + 1` is `1000`.
# `x | (x + 1) = 1111 = 2^(k+1) - 1`.
#
# Consider the case where `x` has a 0 bit at the LSB position.
# `x = ...0`
# `x + 1 = ...1`
# `x | (x + 1) = ...1`
# In this scenario, `x | (x + 1) = x + 1`.
# So if `num = x + 1`, we need to find `x = num - 1`. The condition is `(num - 1) | num == num`.
# This is true if `num - 1` has all its set bits as a subset of `num`'s set bits.
# This happens when `num` does not have a 1 bit followed by a 0 bit pattern that `num-1` would flip.
# More simply, if `num` ends with a 1 (i.e., `num` is odd), then `num-1` will end with a 0.
# `(num - 1) | num = num` is always true if `num` is odd.
# Because if `num` is odd, its LSB is 1. `num - 1` will have LSB 0. All other bits of `num - 1` will be less than or equal to the corresponding bits of `num`.
# So `(num - 1) | num` will be `num`.
#
# If `num` is odd, we can try `x = num - 1`.
# Example: `num = 3`. `x = 2`. `2 | 3 = 3`. This is not the minimum. Minimum is `x=1`. `1 | 2 = 3`.
#
# Let's rethink.
# `x | (x + 1) = num`
#
# Consider the bits of `num`.
# For each bit position `i`:
# If `num[i]` is 0, then `x[i]` must be 0 and `(x+1)[i]` must be 0.
# If `num[i]` is 1, then `x[i]` must be 1 OR `(x+1)[i]` must be 1.
#
# This implies that `x` must have 0s wherever `num` has 0s.
# So, `x` must be a submask of `num`. This is not correct.
#
# Let's consider the structure of `x` and `x + 1`.
# `x + 1` is obtained by flipping the LSB 0 and all subsequent 1s.
#
# Case 1: `x` ends with a 0.
# `x = ...a0`
# `x + 1 = ...a1`
# `x | (x + 1) = ...a1` which is `x + 1`.
# So if `num` has the form `x + 1`, we can set `x = num - 1`.
# The condition `(num - 1) | num == num` must hold.
# This is always true if `num` is odd. If `num` is odd, `num-1` is even.
# Example: `num = 5 (101)`. Try `x = 4 (100)`. `4 | 5 = 5`. This works.
# Example: `num = 7 (111)`. Try `x = 6 (110)`. `6 | 7 = 7`. This works.
# Example: `num = 11 (1011)`. Try `x = 10 (1010)`. `10 | 11 = 11`. This works.
#
# So if `num` is odd, and we set `x = num - 1`, we have `x | (x + 1) = (num - 1) | num = num`.
# This gives a candidate for `x`. Is it the minimum?
# If `num` is odd, its LSB is 1. `num - 1` has LSB 0.
#
# Case 2: `x` ends with one or more 1s.
# `x = ...b011...1` (k ones)
# `x + 1 = ...b100...0` (k zeros)
# `x | (x + 1) = ...b111...1` (k+1 ones)
#
# If `num` has this structure `...b1` followed by `k+1` ones, then `x` would be `...b0` followed by `k` ones.
#
# Let's consider the bits of `num` that are 0.
# If `num` has a 0 at bit `i`, then `x` must have a 0 at bit `i`, and `x+1` must also have a 0 at bit `i`.
# This means that `x` must have a 0 at bit `i`.
#
# Consider `num`. If `num` has a 0 bit, say at position `k`, then `x` must have a 0 bit at position `k`.
# If `x` has a 0 at position `k`, then `x+1` can have a 0 or 1 at position `k`, depending on carries.
#
# The condition `x | (x + 1) == num` implies that any bit that is 0 in `num` must be 0 in both `x` and `x + 1`.
#
# If `num` has a 0 at bit `i`, then `x` must have a 0 at bit `i`.
# This means `x` must be composed of bits that are set in `num` or bits that are 0 in `num`.
#
# Consider the most significant bit of `num` that is 0. Let this be position `p`.
# If `num[p] == 0`, then `x[p] == 0` and `(x+1)[p] == 0`.
# If `x[p] == 0`, and there's no carry from lower bits into position `p`, then `(x+1)[p]` would be 1. This is a contradiction.
#
# This means that if `num[p] == 0`, then `x` must have a carry from bit `p-1` into bit `p`, such that `x[p]` becomes 0, and `(x+1)[p]` also becomes 0.
# This only happens if `x` has a bit `0` at position `p`, and all bits from `p-1` down to the LSB are `1`.
# So, `x = ...011...1` (k ones).
# And `x+1 = ...100...0`.
#
# If `num[p] == 0` for the most significant 0 bit, then `x` must be of the form `...0` followed by `p` ones.
# `x = (something) * 2^(p+1) + (2^p - 1)`
# `x+1 = (something) * 2^(p+1) + 2^p`
#
# `x | (x+1) = (something) * 2^(p+1) + (2^p - 1) | 2^p`
# If `x+1` has `2^p` set, and `x` has `2^p - 1` set, then `x | (x+1)` has all bits up to `p` set.
#
# Let's use the property `x | (x+1) = x ^ (x+1) ^ (x & (x+1))`. This is not helpful.
#
# Another property: `x + 1 = x ^ (2^k)` where `2^k` is the smallest power of 2 such that `x & 2^k == 0`. Incorrect.
#
# `x + 1` can be computed by flipping the LSB that is 0 and all subsequent 1s.
#
# Consider `num`. We are looking for the smallest `x` such that `x | (x + 1) == num`.
#
# If `num` has a 0 at bit `i`, then `x` must have a 0 at bit `i`.
# This means `x` must be a "submask" of `num` in terms of its 0 bits.
#
# Let's try to construct `x` from `num`.
# For each bit `i`:
# If `num[i] == 0`: then `x[i]` must be 0.
# If `num[i] == 1`: then `x[i]` can be 0 or 1, AND `(x+1)[i]` can be 0 or 1, such that their OR is 1.
#
# If `num[i] == 1` and `num[i-1] == 0`, this implies that at position `i-1`, there was a transition from `0` to `1` in `x+1`.
# This suggests `x` might end with `1`s.
#
# Let's iterate through `num` and try to find `x`.
# For a given `num`, what is the smallest `x` such that `x | (x + 1) == num`?
#
# If `num` is odd, `num = ...1`. Then `num - 1 = ...0`.
# We can try `x = num - 1`.
# `(num - 1) | ((num - 1) + 1) = (num - 1) | num = num`. This always holds if `num` is odd.
# Is `num - 1` always the minimum when `num` is odd?
# Example: `num = 3`. Minimum `x = 1`. `1 | 2 = 3`. `num - 1 = 2`. `2 | 3 = 3`. `1 < 2`. No.
#
# The crucial property for `x | (x+1) = num`:
# If `num` has a 0 at bit `i`, then `x` must have a 0 at bit `i`.
# This means that `x` must be a submask of `num` at all bit positions where `num` has a 0.
#
# Let's consider the bits of `num`.
# If `num` is `1011` (11). We want `x | (x+1) = 1011`.
# Possible `x` values:
# If `x = 9` (1001): `x+1 = 10` (1010). `x | (x+1) = 1011`. This matches.
#
# If `num` is `0101` (5). We want `x | (x+1) = 0101`.
# Possible `x` values:
# If `x = 4` (0100): `x+1 = 5` (0101). `x | (x+1) = 0101`. This matches.
#
# If `num` is `0010` (2). We want `x | (x+1) = 0010`.
# Try `x = 0`: `0 | 1 = 1`. No.
# Try `x = 1`: `1 | 2 = 3`. No.
# Try `x = 2`: `2 | 3 = 3`. No.
# Try `x = 3`: `3 | 4 = 7`. No.
# It seems impossible for `num = 2`. The problem states `nums[i]` are prime.
#
# The condition `x | (x + 1) == num` implies that `num` must have all the bits of `x` and `x+1`.
#
# Let's analyze the bits that are 0 in `num`.
# If `num` has a 0 at position `i`, then `x` must have a 0 at position `i`, and `x+1` must have a 0 at position `i`.
# This means that `x` cannot have a sequence of 1s ending at position `i-1` that would cause a carry to position `i`.
# In other words, if `num[i] == 0`, then `x` cannot have `x[i-1] == 1` AND a carry from lower bits.
# This means that if `num[i] == 0`, then `x` cannot end with a sequence of `1`s that propagate a carry to position `i`.
#
# If `num` has a `0` bit, let the most significant `0` bit be at position `p`.
# Then `num[p] = 0`. This means `x[p] = 0` and `(x+1)[p] = 0`.
# For `(x+1)[p]` to be `0` when `x[p]` is `0`, there must be a carry from bit `p-1` to `p`.
# This implies that all bits from `p-1` down to 0 must be `1` in `x`.
# So, `x` must be of the form `...011...1` (p ones).
# `x = Y * 2^(p+1) + (2^p - 1)`
# `x + 1 = Y * 2^(p+1) + 2^p`
# `x | (x + 1) = Y * 2^(p+1) + (2^p - 1) | 2^p`
# `(2^p - 1) | 2^p` is `2^(p+1) - 1`.
# So `x | (x + 1) = Y * 2^(p+1) + (2^(p+1) - 1)`. This does not look right.
#
# Let's consider the bits of `num` that are 1.
# If `num[i] == 1`, then `x[i] == 1` or `(x+1)[i] == 1`.
#
# Suppose `num` has a `0` bit. Let the position of the most significant `0` bit in `num` be `p`.
# Then `num[p] = 0`.
# This means `x[p] = 0` and `(x+1)[p] = 0`.
# For `(x+1)[p]` to be 0 when `x[p]` is 0, there must be a carry from position `p-1`.
# This means all bits of `x` from 0 to `p-1` must be 1.
# So, `x` must end with `p` ones: `x = ...011...1` (p ones).
# Let `x = A * 2^p + (2^p - 1)`.
# Then `x + 1 = A * 2^p + 2^p = (A+1) * 2^p`.
#
# `x | (x+1) = (A * 2^p + (2^p - 1)) | ((A+1) * 2^p)`
#
# If `A` is even, `A = 2B`, then `A+1 = 2B+1`.
# `x = 2B * 2^p + (2^p - 1)`
# `x+1 = (2B+1) * 2^p = 2B * 2^p + 2^p`
# `x | (x+1) = (2B * 2^p + (2^p - 1)) | (2B * 2^p + 2^p)`
# Bits from `p` downwards: `(2^p - 1)` is `p` ones. `2^p` is `1` followed by `p` zeros.
# So `(2^p - 1) | 2^p` is `2^(p+1) - 1`.
# `x | (x+1) = 2B * 2^p + (2^(p+1) - 1)`.
# This means `num` would have `p+1` ones from LSB upwards, and then the bits of `2B * 2^p`.
# So, if `num` has a 0 at position `p`, and its lower `p` bits are all 1s, and the bit at `p` is 0, then `x` could be `num - 1` (if `num` has `p+1` ones from LSB).
#
# This line of reasoning is getting complicated. Let's try a simpler observation.
#
# If `x | (x+1) == num`, then `num` must have all the bits of `x` and `x+1`.
# This implies that any bit that is 0 in `num` must be 0 in both `x` and `x+1`.
#
# Consider the bits of `num`.
# If `num` has a `0` bit at position `i`, then `x` must have a `0` bit at position `i`.
#
# Let's try to construct `x` by considering the `0` bits in `num`.
# If `num = 2 (0010)`. The only 0 bit is at position 0.
# If `x[0] == 0` and `(x+1)[0] == 0`, this is impossible since `x+1` is always `x` or differs at the LSB.
# At least one of `x[0]` or `(x+1)[0]` must be 1, unless `x` and `x+1` are both 0, which is not possible for non-negative `x`.
#
# The only way `x | (x+1)` can have a 0 bit at position `i` is if both `x` and `x+1` have a 0 bit at position `i`.
# This can only happen if `x` has a sequence of `1`s up to position `i-1` and a `0` at position `i`.
# i.e., `x = ...011...1` (k ones). Then `x+1 = ...100...0`.
# `x[i] = 0`, `(x+1)[i] = 1`. So `x | (x+1)` has a 1 at position `i`.
#
# This suggests that `x | (x+1)` CANNOT have any 0 bits if `x` does not end in `0`.
# If `x` ends in `0`, `x = ...0`. Then `x+1 = ...1`. `x | (x+1) = ...1`.
# So, if `x` ends in `0`, `x | (x+1) = x+1`.
# In this case, `num = x + 1`. So we need `x = num - 1`.
# Condition: `(num - 1) | num == num`. This holds if `num` is odd (LSB of `num` is 1).
#
# If `num` is odd, can we always use `x = num - 1`?
# Example: `num = 3 (011)`. `x = 2 (010)`. `2 | 3 = 3`.
# But minimum is `x = 1 (001)`. `1 | 2 = 3`.
# So `x = num - 1` is not always the minimum.
#
# Let's reconsider the condition `x | (x+1) == num`.
# The bits that are 0 in `num` must be 0 in `x`.
# So `x` must be a "subset" of `num`'s bit positions, where we only consider the bits that are 1 in `num`.
#
# If `num` has a 0 at position `i`, then `x` MUST have a 0 at position `i`.
# This means `x` can only have bits set where `num` has bits set.
#
# Let's try to construct `x` based on the `0` bits of `num`.
# If `num = 5 (101)`. The 0 bit is at position 1. So `x[1]` must be 0.
# We need `x | (x+1) = 101`.
# Possible `x` where `x[1] = 0`:
# `x = 0 (000)`: `0 | 1 = 1`. No.
# `x = 1 (001)`: `1 | 2 = 3`. No.
# `x = 4 (100)`: `4 | 5 = 5`. Yes. Minimum is 4.
#
# If `num = 11 (1011)`. The 0 bit is at position 2. So `x[2]` must be 0.
# We need `x | (x+1) = 1011`.
# Possible `x` where `x[2] = 0`:
# `x = 0..7`.
# Try values of `x` that have `x[2]=0`.
# `x = 8 (1000)`: `8 | 9 = 9`. No.
# `x = 9 (1001)`: `9 | 10 = 11`. Yes. Minimum is 9.
#
# If `num = 3 (0011)`. The 0 bits are at positions 0 and 1 (assuming a larger bit width). Let's consider the highest 0 bit.
# The highest 0 bit is at position 2 for `num=3`. Let's assume we are only working with bits that are set in `num` or necessary for `x+1`.
# For `num = 3 (0011)`.
# Smallest `x` such that `x | (x+1) = 3`.
# `x=0`: `0|1 = 1`.
# `x=1`: `1|2 = 3`. Yes. Minimum is 1.
#
# How do we get `x=1` from `num=3`?
# `num = 3 (0011)`
# `x = 1 (0001)`
# `x+1 = 2 (0010)`
# `x | (x+1) = 3 (0011)`
#
# Notice that `x` is obtained by clearing the most significant bit of `num` and potentially setting some lower bits.
#
# Let `num = 5 (101)`. We got `x=4 (100)`.
# `num` has MSB at position 2.
# `x` has MSB at position 2.
#
# Let `num = 11 (1011)`. We got `x=9 (1001)`.
# `num` has MSB at position 3.
# `x` has MSB at position 3.
#
# Observation: If `num` has a `0` bit at position `p`, then `x` must also have a `0` bit at position `p`.
# This implies that `x` cannot have any bits set at positions higher than the highest `0` bit of `num`.
# So, the most significant bit of `x` will be at most the position of the most significant bit of `num`.
#
# Let `msb_pos` be the position of the most significant bit of `num`.
# If `num` has a 0 bit at `msb_pos`, this is impossible for a positive `num`.
# So `num` must have a 1 at `msb_pos`.
# `x` must have a 0 at position `p` if `num[p] == 0`.
#
# Consider `num`. If `num` has a `0` bit, say at position `p`, then `x` must have a `0` at position `p`.
# This means `x` is "smaller" in terms of bit positions than `num`.
#
# If `num` has a `0` bit, let the position of the most significant `0` bit be `p`.
# Then `x` must have a `0` at position `p`.
# This means `x` is strictly less than `2^(p+1)`.
#
# Let `p` be the position of the most significant bit of `num`.
# If `num` has ANY `0` bit at position `k <= p`, then `x` must have a `0` at position `k`.
#
# If `num` is `011` (3). Most significant bit is at pos 1. No 0 bits below it.
# `num = 0011`. MSB at pos 1.
# If `x | (x+1) = 3`.
# `x=0`, `0|1=1`
# `x=1`, `1|2=3`. Found `x=1`.
#
# If `num` has a `0` at bit `i`, then `x` must have a `0` at bit `i`.
#
# Let `num` be given.
# We are looking for the smallest `x` such that `x | (x + 1) == num`.
#
# Consider the bits of `num` from right to left.
# If `num` has a `0` bit, say `num[i] = 0`, then `x[i]` must be `0`.
# If `x[i] = 0`, for `x | (x+1)` to have a 1 at position `i`, then `(x+1)[i]` must be 1.
# This implies there was no carry into position `i`.
#
# The only way `x | (x+1)` can have a `0` at position `i` is if both `x[i]` and `(x+1)[i]` are `0`.
# This happens if `x` has `0` at position `i` and all bits `0` to `i-1` are `1` in `x`.
# `x = ...011...1` (k ones). Then `x+1 = ...100...0`.
#
# So, if `num` has a `0` at position `i`, it means that `x` must be of the form `...011...1` (i ones).
# And `x+1` would be `...100...0`.
# Then `x | (x+1) = ...111...1` (i+1 ones).
# This implies `num` must end with `i+1` ones.
#
# Let's try a different perspective.
# For `x | (x+1) = num`, the bits that are 1 in `num` must be 1 in `x` or `x+1`.
# The bits that are 0 in `num` must be 0 in `x` AND 0 in `x+1`.
#
# If `num` has a 0 bit, let the highest such bit be at position `p`.
# Then `num[p] = 0`. So `x[p] = 0` and `(x+1)[p] = 0`.
# For `(x+1)[p]` to be 0 while `x[p]` is 0, there must be a carry from `p-1` to `p`.
# This implies `x` must have `1`s at all positions from `0` to `p-1`.
# So `x` must be of the form `...011...1` (p ones).
# Let `x = Y * 2^(p+1) + (2^p - 1)`.
# Then `x+1 = Y * 2^(p+1) + 2^p`.
# `x | (x+1) = (Y * 2^(p+1) + (2^p - 1)) | (Y * 2^(p+1) + 2^p)`
# The bits from `0` to `p-1` are all `1` in `x`.
# The bit at `p` is `0` in `x` and `1` in `x+1`.
# The bits higher than `p` are the same in `x` and `x+1`.
#
# `x | (x+1) = (Y * 2^(p+1)) | (2^p - 1) | (Y * 2^(p+1)) | 2^p`
# `x | (x+1) = (Y * 2^(p+1)) | ((2^p - 1) | 2^p)`
# `(2^p - 1) | 2^p = 2^(p+1) - 1`.
# So `x | (x+1) = (Y * 2^(p+1)) | (2^(p+1) - 1)`.
# This means `x | (x+1)` has the form `...Y'11...1` where there are `p+1` ones.
#
# Therefore, if `num` has a `0` bit at position `p`, and `x | (x+1) == num`, then `num` must have `1`s at all positions from `0` to `p`.
# This is a contradiction: `num[p]` must be `0`.
#
# This implies that if `num` has ANY `0` bit, then it's impossible to find `x` such that `x | (x+1) == num`.
# This is too strong. Let's check the examples.
#
# Example 1: `nums = [2,3,5,7]` Output: `[-1,1,4,3]`
# `num = 2 (0010)`. Has a 0 at bit 0. Output is -1. This matches.
# `num = 3 (0011)`. No 0 bits. Output is 1.
# `num = 5 (0101)`. Has a 0 at bit 1. Output is 4.
# `num = 7 (0111)`. No 0 bits. Output is 3.
#
# The initial hypothesis was wrong. `x | (x+1)` can have 0 bits.
#
# Let's reconsider the property:
# `x | (x+1) == num`.
#
# If `num` has a `0` bit at position `i`, then `x` must have a `0` bit at position `i`.
# And `x+1` must have a `0` bit at position `i`.
#
# This implies that `x` must be such that it has a `0` at bit `i`, and no carry propagates from `i-1` to `i`.
# This means `x` cannot end with a sequence of `1`s that would cause a carry to position `i`.
#
# Let's use the hint: "Minimize each value of ans[i]".
# We want the smallest `x`.
#
# If `x` ends with `0`, then `x = ...0`. `x+1 = ...1`. `x | (x+1) = x+1`.
# So `num = x+1`. Thus `x = num - 1`.
# This requires `(num - 1) | num == num`, which is always true if `num` is odd.
# If `num` is odd, we can potentially use `x = num - 1`.
#
# If `num` is odd (ends with 1), `x = num - 1` ends with 0.
# `(num - 1) | num = num`.
# Is `num - 1` always the minimum when `num` is odd?
# Example: `num = 3`. `num-1 = 2`. `2 | 3 = 3`. Minimum `x=1`. `1 | 2 = 3`. No.
#
# The issue arises when `num` itself has a `0` bit.
#
# If `num` has a `0` bit at position `p`, then `x` must have a `0` bit at position `p`.
#
# Consider `num`. Iterate from `i = 0` up to a reasonable limit (e.g., 30 for 1000).
# For each `i`, check if `i | (i + 1) == num`.
# If it matches, then `i` is a candidate for `x`. We take the smallest such `i`.
# This is brute force, but `nums[i] <= 1000`, so `x` won't be excessively large.
# Maximum `x` such that `x | (x+1) <= 1000`.
# If `x` is around 1000, `x+1` is around 1001. `x | (x+1)` will be around 1001.
# So `x` will be at most around 1000.
# Checking `x` from 0 to 1000 for each `num` is feasible. `100 * 1000` operations.
#
# Algorithm:
# For each `num` in `nums`:
#   Initialize `found_x = -1`.
#   Iterate `x` from 0 up to `num` (or a slightly larger bound like 1024):
#     If `x | (x + 1) == num`:
#       `found_x = x`
#       Break (since we want the minimum `x`)
#   Append `found_x` to the result array `ans`.
# Return `ans`.
#
# Let's test this approach.
# `num = 2`.
# x=0: 0|1=1 != 2
# x=1: 1|2=3 != 2
# x=2: 2|3=3 != 2
# ...
# For `num=2`, we will never find `x` such that `x|(x+1) == 2`. This is because `x|(x+1)` is always odd or `x+1`.
# If `x` ends in `0`, `x|(x+1) = x+1`. If `x+1 = 2`, then `x=1`. `1|(1+1) = 1|2 = 3 != 2`.
# If `x` ends in `1`, `x = ...01..1` (k ones). `x+1 = ...10..0`. `x|(x+1) = ...11..1`.
# So `x|(x+1)` is always greater than or equal to `x+1`.
# The smallest possible value for `x|(x+1)` is `1` (when `x=0`).
# If `x=0`, `x|(x+1) = 0|1 = 1`.
# If `x=1`, `x|(x+1) = 1|2 = 3`.
# If `x=2`, `x|(x+1) = 2|3 = 3`.
# If `x=3`, `x|(x+1) = 3|4 = 7`.
# If `x=4`, `x|(x+1) = 4|5 = 5`.
# If `x=5`, `x|(x+1) = 5|6 = 7`.
# If `x=6`, `x|(x+1) = 6|7 = 7`.
# If `x=7`, `x|(x+1) = 7|8 = 15`.
#
# It seems `x | (x+1)` is related to `2^k - 1` or powers of 2.
# Specifically, `x | (x+1)` is `x+1` if `x` ends with `0`.
# And if `x` ends with `k` ones `x = ...01...1`, then `x+1 = ...10...0`, and `x | (x+1) = ...11...1` (k+1 ones).
#
# So, `x | (x+1)` can take values like: 1, 3, 5, 7, 9, 11, 13, 15, ...
#
# Let `num = 2`.
# We need `x | (x+1) = 2`.
# Possible values of `x | (x+1)`:
# x=0 -> 1
# x=1 -> 3
# x=2 -> 3
# x=3 -> 7
# x=4 -> 5
# x=5 -> 7
# x=6 -> 7
# x=7 -> 15
#
# Notice that for any `x >= 1`, `x | (x+1)` is always odd.
# If `x` is even, `x = ...0`, `x+1 = ...1`, `x | (x+1) = x+1` (odd).
# If `x` is odd, `x = ...01..1` (k ones), `x+1 = ...10..0`, `x | (x+1) = ...11..1` (k+1 ones).
# If `k >= 0`, `x | (x+1)` is odd.
#
# So, if `num` is even, it is impossible to find `x` such that `x | (x+1) == num`, unless `num` is not a standard outcome of `x | (x+1)`.
# The only exception is if `x=0`, which gives `0 | 1 = 1`.
#
# If `num` is even and `num > 0`, it's impossible.
# This explains why `nums = [2, ...]` results in `-1`.
#
# So the condition is: If `num` is even, `ans[i] = -1`.
#
# If `num` is odd:
# We are looking for smallest `x` such that `x | (x+1) == num`.
#
# Let's consider `num` that are odd.
# `num = 3 (0011)`.
# x=0: 1
# x=1: 3. Found `x=1`.
#
# `num = 5 (0101)`.
# x=0: 1
# x=1: 3
# x=2: 3
# x=3: 7
# x=4: 5. Found `x=4`.
#
# `num = 7 (0111)`.
# x=0: 1
# x=1: 3
# x=2: 3
# x=3: 7. Found `x=3`.
#
# `num = 11 (1011)`.
# x=0: 1
# x=1: 3
# x=2: 3
# x=3: 7
# x=4: 5
# x=5: 7
# x=6: 7
# x=7: 15
# x=8: 9. `8 | 9 = 9`. No.
# x=9: 11. `9 | 10 = 11`. Found `x=9`.
#
# The brute-force check from `x=0` up to `num` seems to work and guarantees minimality.
#
# Let's refine the bound for `x`.
# `x | (x+1) = num`.
# Since `x | (x+1) >= x` and `x | (x+1) >= x+1`, we know `num >= x`.
# So `x <= num`.
# We can iterate `x` from `0` to `num`.
#
# Constraints: `nums[i] <= 1000`.
# So `num` is at most 1000.
# The loop for `x` runs at most 1001 times.
# The outer loop runs `n` times (`n <= 100`).
# Total operations roughly `100 * 1000 = 100,000`. This is very efficient.
#
# The logic:
# For each `num` in `nums`:
#   If `num` is even:
#     Append -1 to `ans`.
#   Else (`num` is odd):
#     Iterate `x` from 0 upwards.
#     If `x | (x + 1) == num`:
#       Append `x` to `ans`.
#       Break (found the minimum).
# Return `ans`.
#
# Does `x | (x+1) == num` always produce an odd `num` (for `x > 0`)?
# If `x` is even (`...0`), `x+1` is odd (`...1`). `x | (x+1)` is `x+1` (odd).
# If `x` is odd (`...01..1` k ones), `x+1` is `...10..0`. `x | (x+1)` is `...11..1` (k+1 ones).
# If `k=0`, `x` is odd and ends in `1`. `x=...01`. `x+1 = ...10`. `x | (x+1) = ...11`. Odd.
# If `k>0`, `x` ends in `01..1`. `x | (x+1)` ends in `p+1` ones. Odd.
#
# So, if `x > 0`, `x | (x+1)` is always odd.
# What about `x=0`? `0 | (0+1) = 0 | 1 = 1`. This is odd.
#
# Therefore, if `num` is even, `ans[i]` must be -1.
#
# The check for `x` needs to go up to `num`.
# If `num = 3`:
# x=0, 0|1=1 != 3
# x=1, 1|2=3 == 3. found x=1. ans.append(1).
#
# If `num = 5`:
# x=0, 0|1=1 != 5
# x=1, 1|2=3 != 5
# x=2, 2|3=3 != 5
# x=3, 3|4=7 != 5
# x=4, 4|5=5 == 5. found x=4. ans.append(4).
#
# This seems correct and efficient enough.

# Time Complexity:
# For each number `num` in `nums` (length `n`), we iterate from `x = 0` up to `num`.
# The maximum value of `num` is 1000.
# So, for each number, the inner loop runs at most `1001` times.
# Total time complexity is O(n * max(nums)).
# Given n <= 100 and max(nums) <= 1000, this is O(100 * 1000) = O(100,000) operations, which is efficient.

# Space Complexity:
# We are creating a result array `ans` of the same length as `nums`.
# The space complexity is O(n), where `n` is the length of `nums`.

class Solution:
    def construct_minimum_bitwise_array(self, nums: list[int]) -> list[int]:
        ans = []  # Initialize the result array

        # Iterate through each number in the input array
        for num in nums:
            # According to the analysis, x | (x+1) can never be an even number (for x >= 0).
            # If num is even, it's impossible to find such x.
            if num % 2 == 0:
                ans.append(-1)
                continue

            # If num is odd, we need to find the smallest non-negative integer x
            # such that x | (x + 1) == num.
            # We can iterate x from 0 upwards. Since x | (x+1) >= x and x | (x+1) >= x+1,
            # we know that x must be less than or equal to num.
            # The problem asks for the minimum x, so the first x we find will be the minimum.
            found_x = -1  # Initialize to -1, indicating no solution found yet

            # Iterate through possible values of x, starting from 0.
            # The maximum possible value for x is num itself, as x | (x+1) >= x.
            for x in range(num + 1):
                # Check if the condition x | (x + 1) == num is satisfied
                if (x | (x + 1)) == num:
                    found_x = x  # Store the found value of x
                    break  # We found the minimum x, so we can stop searching for this num

            # Append the found minimum x (or -1 if not found) to the result array
            ans.append(found_x)

        return ans

```