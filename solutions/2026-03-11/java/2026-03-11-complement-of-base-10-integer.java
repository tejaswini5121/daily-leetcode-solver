```java
/**
 * Problem: Complement of Base 10 Integer
 * LeetCode Link: https://leetcode.com/problems/complement-of-base-10-integer/
 *
 * Approach:
 * The complement of a number is found by flipping its bits.
 * To do this, we first need to determine the number of bits required to represent the input number `n`.
 * We can find the smallest power of 2 that is greater than or equal to `n`.
 * Let this power of 2 be `mask`. For example, if `n = 5` (binary "101"), the smallest power of 2
 * greater than or equal to 5 is 8 (binary "1000").
 * A mask of all ones up to the most significant bit of `n` can be created by `mask - 1`.
 * For `n = 5`, `mask = 8` ("1000"), `mask - 1 = 7` ("0111").
 * The complement of `n` can then be found by XORing `n` with this mask of ones.
 * For example, `5 ^ 7` = "101" ^ "0111" = "010" (which is 2).
 * If `n = 0`, its binary representation is "0", and its complement is "1".
 * The loop to find the mask needs to handle the case where `n=0` separately.
 *
 * Time Complexity: O(log n) - The loop to find the mask runs for as many bits as `n` has, which is logarithmic with respect to `n`.
 * Space Complexity: O(1) - We are only using a few variables to store intermediate results.
 */
class Solution {
    public int bitwiseComplement(int n) {
        // Handle the edge case where n is 0.
        // The binary representation of 0 is "0", and its complement is "1".
        if (n == 0) {
            return 1;
        }

        // Initialize a variable `mask` to 1. This will be used to find the smallest power of 2
        // that is greater than or equal to `n`.
        int mask = 1;

        // Loop until `mask` is greater than or equal to `n`.
        // In each iteration, left-shift `mask` by 1, effectively multiplying it by 2.
        // This finds the smallest power of 2 that is greater than or equal to `n`.
        // For example, if n=5 ("101"), mask will become 1, 2, 4, 8. It stops at 8.
        while (mask < n) {
            mask <<= 1;
        }

        // Now `mask` is the smallest power of 2 >= n.
        // To get a mask of all ones up to the most significant bit of `n`, we subtract 1 from `mask`.
        // For example, if mask is 8 ("1000"), mask - 1 is 7 ("0111").
        // This "all ones" mask is then XORed with `n` to get its complement.
        // XORing a bit with 1 flips the bit.
        // e.g., n=5 ("101"), mask-1=7 ("0111")
        // 5 ^ 7 = "101" ^ "0111" = "010" (which is 2)
        return (mask - 1) ^ n;
    }
}
```