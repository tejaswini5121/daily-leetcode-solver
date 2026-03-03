/**
 * Problem: Find Kth Bit in Nth Binary String
 * Link: https://leetcode.com/problems/find-kth-bit-in-nth-binary-string/
 *
 * Approach:
 * The problem can be solved using recursion. We observe the pattern of how Sn is constructed from Sn-1.
 * The length of Sn is 2 * length(Sn-1) + 1.
 * Let L(n) be the length of Sn. L(n) = 2^n - 1.
 *
 * If k is the middle element of Sn, which is at index (L(n) + 1) / 2, then the bit is '1'.
 * If k is in the first half of Sn (k < (L(n) + 1) / 2), then the kth bit of Sn is the same as the kth bit of Sn-1.
 * If k is in the second half of Sn (k > (L(n) + 1) / 2), then the kth bit of Sn corresponds to a bit in the reversed and inverted part of Sn-1.
 * Specifically, if k is at position `k_prime` in the reversed and inverted part, where `k_prime = k - (L(n) + 1) / 2`,
 * then the bit at `k_prime` in the reversed and inverted part is derived from the `(L(n-1) - k_prime + 1)`-th bit of Sn-1, inverted.
 *
 * Base case: When n = 1, S1 = "0". If k = 1, return '0'.
 *
 * Time Complexity: O(N) because at each recursive step, N decreases by 1. The length of the string grows exponentially, but we are only interested in a single bit, and each recursive call effectively halves the search space or determines the bit.
 * Space Complexity: O(N) due to the recursion depth.
 */
class Solution {
    /**
     * Finds the kth bit of the nth binary string.
     *
     * @param n The index of the binary string to consider (1-based).
     * @param k The index of the bit to find (1-based).
     * @return The kth bit of the nth binary string as a character ('0' or '1').
     */
    public char findKthBit(int n, int k) {
        // Base case: S1 = "0"
        if (n == 1) {
            return '0';
        }

        // Calculate the length of Sn-1. L(n-1) = 2^(n-1) - 1.
        // The middle index of Sn is (L(n) + 1) / 2 = (2^n - 1 + 1) / 2 = 2^(n-1).
        // The length of Sn is 2^n - 1.
        // The total length of Sn is 2 * (length of Sn-1) + 1.
        // If n = 2, Sn-1 = S1 ("0"), length is 1. Sn = "011", length is 3. Middle index = 2.
        // If n = 3, Sn-1 = S2 ("011"), length is 3. Sn = "0111001", length is 7. Middle index = 4.
        // The length of Sn is 2^n - 1. The middle index is (2^n - 1 + 1) / 2 = 2^(n-1).
        int mid = 1 << (n - 1); // This is 2^(n-1), the length of Sn-1 + 1, which is the middle index of Sn.

        // If k is the middle element, the bit is '1'.
        if (k == mid) {
            return '1';
        }
        // If k is in the first half, the kth bit of Sn is the same as the kth bit of Sn-1.
        else if (k < mid) {
            return findKthBit(n - 1, k);
        }
        // If k is in the second half, we need to find the corresponding bit in Sn-1, inverted.
        // The k in the second half corresponds to a bit in the reversed and inverted part of Sn-1.
        // The index in the reversed part is k - mid.
        // The bit in the reversed and inverted part at position `k - mid` (1-based index from start of this part)
        // is derived from the bit at `mid - (k - mid) + 1` position in Sn-1.
        // `mid - (k - mid) + 1` = `mid - k + mid + 1` which is not right.
        // Let's re-evaluate the index.
        // The second half starts at index `mid + 1`.
        // The length of the second half is `mid - 1`.
        // The index `k` in `Sn` corresponds to the `k - mid`-th element in the reversed and inverted suffix.
        // If the suffix is `reverse(invert(Sn-1))`, then the `i`-th element of this suffix is `invert( (length(Sn-1) - i + 1)-th element of Sn-1 )`.
        // The length of `Sn-1` is `mid - 1`.
        // So, the `(k - mid)`-th element of the suffix is `invert( ((mid - 1) - (k - mid) + 1)-th element of Sn-1 )`.
        // `(mid - 1) - (k - mid) + 1 = mid - 1 - k + mid + 1 = 2 * mid - k`.
        // So, we need to find the `(2 * mid - k)`-th bit of `Sn-1` and invert it.
        else { // k > mid
            // Calculate the position in Sn-1 that this bit corresponds to after reversal and inversion.
            // The number of bits before the reversed part is `mid`.
            // `k` is in the reversed part. The offset from the start of the reversed part is `k - mid`.
            // The length of `Sn-1` is `mid - 1`.
            // If we consider the reversed and inverted part, its `i`-th character corresponds to the `(length_of_Sn-1 - i + 1)`-th character of `Sn-1`, inverted.
            // Here, `i = k - mid`.
            // So the original position in `Sn-1` is `(mid - 1) - (k - mid) + 1 = mid - 1 - k + mid + 1 = 2 * mid - k`.
            int originalK = mid - (k - mid); // This simplifies to 2*mid - k.
            char originalBit = findKthBit(n - 1, originalK);

            // Invert the bit.
            if (originalBit == '0') {
                return '1';
            } else {
                return '0';
            }
        }
    }
}
