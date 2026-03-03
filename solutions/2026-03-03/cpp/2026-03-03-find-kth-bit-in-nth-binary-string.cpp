```cpp
// Find Kth Bit in Nth Binary String
// LeetCode Link: https://leetcode.com/problems/find-kth-bit-in-nth-binary-string/
// Approach:
// The problem defines a recursive relationship for generating binary strings.
// S1 = "0"
// Si = Si-1 + "1" + reverse(invert(Si-1))
// The length of Si is 2^n - 1.
// We can observe that the middle element of Si (at index 2^(n-1)) is always "1" for n > 1.
// The first half of Si is the same as Si-1.
// The second half of Si is derived from Si-1 by reversing and inverting it.
//
// We can use this recursive structure to find the kth bit without actually generating the entire string.
//
// Let's define a function `findKthBit(n, k)`:
// 1. Base case: If n == 1, return '0'.
// 2. Calculate the length of Sn-1: `prevLen = (1 << (n - 1)) - 1`.
// 3. If k <= prevLen: The kth bit is in the first part (Si-1). Recursively call `findKthBit(n - 1, k)`.
// 4. If k == prevLen + 1: This is the middle '1'. Return '1'.
// 5. If k > prevLen + 1: The kth bit is in the reversed and inverted part of Si-1.
//    The index in the reversed and inverted part corresponds to `k - (prevLen + 1)`.
//    Let `new_k = k - (prevLen + 1)`.
//    The original index in Si-1 that corresponds to this `new_k` position in the reversed part is `prevLen - new_k + 1`.
//    We need to find the bit at this original index in Si-1 and then invert it.
//    So, recursively call `findKthBit(n - 1, prevLen - new_k + 1)` and invert the result.
//
// Time Complexity: O(N). In each recursive call, we either move to a smaller N or return. The maximum depth of recursion is N.
// Space Complexity: O(N) due to the recursion stack.
class Solution {
public:
    char findKthBit(int n, int k) {
        // Base case: For n=1, the string is "0".
        if (n == 1) {
            return '0';
        }

        // Calculate the length of the previous string (Sn-1).
        // The length of Si is 2^i - 1. So, length of Sn-1 is 2^(n-1) - 1.
        // Using bit shift for 2^(n-1) is more efficient.
        int prevLen = (1 << (n - 1)) - 1;

        // Case 1: k is in the first half, which is exactly Si-1.
        // Recursively find the kth bit in Sn-1.
        if (k <= prevLen) {
            return findKthBit(n - 1, k);
        }
        // Case 2: k is the middle bit, which is always '1' for n > 1.
        else if (k == prevLen + 1) {
            return '1';
        }
        // Case 3: k is in the second half, which is reverse(invert(Si-1)).
        else {
            // The position in the reversed and inverted part.
            int new_k = k - (prevLen + 1);

            // To find the bit at `new_k` in the reversed part, we need to find
            // the corresponding bit in the original Si-1.
            // If Si-1 has length `prevLen`, the `new_k`-th element from the start
            // of the reversed part corresponds to the `(prevLen - new_k + 1)`-th
            // element from the start of the original Si-1.
            // For example, if Si-1 = "011" (prevLen=3), and we are looking at
            // new_k=1 (the first element of reversed part which is '1'), it
            // corresponds to the 3rd element of "011" which is '1'.
            // `prevLen - new_k + 1 = 3 - 1 + 1 = 3`.
            char bit_in_prev = findKthBit(n - 1, prevLen - new_k + 1);

            // Invert the found bit.
            if (bit_in_prev == '0') {
                return '1';
            } else {
                return '0';
            }
        }
    }
};
```