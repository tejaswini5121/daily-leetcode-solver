```python
# Problem: Find Kth Bit in Nth Binary String
# Link: https://leetcode.com/problems/find-kth-bit-in-nth-binary-string/
#
# Approach:
# The problem defines a recursive relationship for generating binary strings.
# Sn = Sn-1 + "1" + reverse(invert(Sn-1)).
# The length of Sn is 2^n - 1.
#
# To find the kth bit of Sn, we can observe the structure:
# 1. If k is the middle element (length of Sn-1 + 1), the bit is "1".
# 2. If k is in the first half (k <= length of Sn-1), the bit is the same as the kth bit of Sn-1.
# 3. If k is in the second half (k > length of Sn-1 + 1), the bit is the inverted and mirrored bit of Sn-1.
#    Specifically, if k' is the corresponding index in the inverted and reversed Sn-1,
#    then k' = (length of Sn) - k + 1. The bit at Sn[k] will be invert(Sn-1[k']).
#
# We can implement this logic recursively. The base case is n = 1, where S1 is "0".
#
# Time Complexity:
# The length of Sn is 2^n - 1. In each recursive call, we reduce n by 1 and perform constant time operations (comparisons, arithmetic).
# The depth of recursion is n.
# Therefore, the time complexity is O(n).
#
# Space Complexity:
# The space complexity is determined by the recursion depth, which is n.
# Therefore, the space complexity is O(n) due to the call stack.

def findKthBit(n: int, k: int) -> str:
    """
    Finds the kth bit of the nth binary string Sn.
    """

    # Base case: For n = 1, S1 is "0".
    if n == 1:
        return "0"

    # Calculate the length of Sn-1.
    # The length of Sn is 2^n - 1.
    # The length of Sn-1 is 2^(n-1) - 1.
    # The midpoint of Sn is at index (2^n - 1 + 1) / 2 = 2^(n-1).
    len_sn_minus_1 = (1 << (n - 1)) - 1

    # If k is the middle bit of Sn (which is always '1' for n > 1)
    if k == len_sn_minus_1 + 1:
        return "1"
    # If k is in the first half of Sn, it's the same as the kth bit of Sn-1.
    elif k <= len_sn_minus_1:
        return findKthBit(n - 1, k)
    # If k is in the second half of Sn, it's the inverted and mirrored bit of Sn-1.
    else:
        # Calculate the corresponding index in Sn-1 for the inverted and reversed part.
        # The index in Sn-1 is (length of Sn-1) - (k - (length of Sn-1 + 1))
        # Simplified: len_sn_minus_1 - (k - len_sn_minus_1 - 1)
        # Further simplified: 2 * len_sn_minus_1 + 1 - k
        # The length of Sn is 2^n - 1. The midpoint is 2^(n-1).
        # The index in Sn-1 is (2^n - 1) - k + 1 = 2^n - k.
        # Or, relative to Sn-1: len_sn_minus_1 - (k - (len_sn_minus_1 + 1)) = len_sn_minus_1 - k + len_sn_minus_1 + 1 = 2*len_sn_minus_1 + 1 - k
        # More intuitive: the reflection point is at k = 2^(n-1).
        # The position in the second half is k - 2^(n-1).
        # The corresponding index in the *reversed* Sn-1 is 2^(n-1) - (k - 2^(n-1)) = 2*2^(n-1) - k = 2^n - k.
        # Let's use the length of Sn: mid_index = 2**(n-1).
        # The index in the reversed part of Sn is (2**n - 1) - k + 1 = 2**n - k.
        # The index in Sn-1 is (2**(n-1)) - (k - (2**(n-1))) = 2**(n-1) - k + 2**(n-1) = 2**n - k.
        # Wait, this is incorrect.
        # Let's trace:
        # S2 = S1 + "1" + reverse(invert(S1)) = "0" + "1" + reverse(invert("0")) = "0" + "1" + reverse("1") = "011". Length = 3. Midpoint = 2.
        # S3 = S2 + "1" + reverse(invert(S2)) = "011" + "1" + reverse(invert("011")) = "011" + "1" + reverse("100") = "011" + "1" + "001" = "0111001". Length = 7. Midpoint = 4.
        # For k in the second half of Sn (k > 2^(n-1)):
        # The index in the reversed and inverted part is k - 2^(n-1).
        # The corresponding index in Sn-1 (before reversal) is 2^(n-1) - (k - 2^(n-1)).
        # For example, if n=3, length of S2 is 3. Midpoint of S3 is 4.
        # If k = 5, it's in the second half. k > 4.
        # Corresponding index in invert(S2) is 4 - (5-4) = 4-1 = 3. This is wrong.
        #
        # Let's re-evaluate the mapping for the second half:
        # Sn = Sn-1 + "1" + reverse(invert(Sn-1))
        # The length of Sn-1 is L = 2^(n-1) - 1.
        # The length of Sn is 2L + 1 = 2^n - 1.
        # The middle element is at index L+1.
        # For k > L+1:
        # The k-th element is in the `reverse(invert(Sn-1))` part.
        # The position within this part is `k - (L + 1)`.
        # The index in `invert(Sn-1)` (before reversal) is `L - (k - (L + 1)) = L - k + L + 1 = 2L + 1 - k`.
        # This `2L + 1` is the length of Sn. So the index in `invert(Sn-1)` is `(length of Sn) - k`.
        # The index in `Sn-1` is `(length of Sn-1) - ((length of Sn) - k) = L - (2L + 1 - k) = L - 2L - 1 + k = k - L - 1`. This is still wrong.
        #
        # Let's use the midpoint. Midpoint of Sn is `mid = 2**(n-1)`.
        # For `k > mid`:
        # The element at `k` is part of `reverse(invert(Sn-1))`.
        # The position relative to the start of `reverse(invert(Sn-1))` is `k - mid`.
        # This `k - mid` corresponds to an element in `invert(Sn-1)` from its end.
        # The index in `invert(Sn-1)` is `mid - (k - mid)`.
        # Example n=3, k=5. Midpoint = 2^2 = 4.
        # Position in second half = 5 - 4 = 1.
        # Corresponding index in invert(S2) is 4 - 1 = 3.
        # S2 = "011". invert(S2) = "100". The 3rd bit of "100" is '0'.
        # So, the bit at Sn[5] should be '0'.
        # S3 = "0111001". S3[5] is '0'. This matches.
        #
        # So, the index in Sn-1 is `mid - (k - mid)`.
        corresponding_k_in_sn_minus_1 = len_sn_minus_1 + 1 - (k - (len_sn_minus_1 + 1)) # This is the index in Sn-1 for the reversed part.
        # It should be `mid - (k - mid)`. Let `mid = 2**(n-1)`.
        mid = 1 << (n - 1)
        # The index in Sn-1 whose bit we need to find, after inversion.
        # The element at index `k` in `Sn` corresponds to the element at index `mid - (k - mid)` in `Sn-1` *before* inversion.
        # Example n=3, k=5. Midpoint=4.
        # `k - mid = 5 - 4 = 1`. This is the 1st element in the reversed part.
        # `mid - (k - mid) = 4 - 1 = 3`. We need to find the 3rd bit of Sn-1.
        # S2 = "011". The 3rd bit of S2 is '1'.
        # Invert it: '0'. This should be the answer.
        # S3 = "0111001". S3[5] is '0'. Correct.
        #
        # So, the recursive call should be to `findKthBit(n - 1, mid - (k - mid))`.
        # And then we invert the result.

        # Calculate the corresponding k in Sn-1.
        # The midpoint of Sn is at index 2^(n-1).
        # If k is in the second half (k > 2^(n-1)),
        # its position relative to the start of the reversed part is k - 2^(n-1).
        # The original position in Sn-1 (before reversal) is 2^(n-1) - (k - 2^(n-1)).
        # This simplifies to 2 * 2^(n-1) - k = 2^n - k.
        # Let's use length of Sn-1: L = 2^(n-1) - 1. Midpoint index = L+1.
        # Position in reversed part: k - (L+1).
        # Original index in Sn-1: L - (k - (L+1)).
        # Simplified: L - k + L + 1 = 2L + 1 - k. This is `len(Sn) - k`.
        # The index in Sn-1 to query is `mid - (k - mid)` if we think of indices starting from 1.
        # If we think of k as 1-indexed, and mid is the index of '1'.
        # If k is in the second half, its distance from the end is (len(Sn) - k).
        # Its corresponding position in the reversed part is `len(Sn) - k + 1`.
        # The index in Sn-1 is `len(Sn-1) - (len(Sn) - k + 1) + 1` ?? This is getting complicated.
        #
        # Let's use the midpoint index `mid = 1 << (n - 1)`.
        # If k > mid:
        # The bit at index k is the inversion of the bit at index `mid - (k - mid)` in Sn-1.
        original_bit_in_sn_minus_1 = findKthBit(n - 1, mid - (k - mid))

        # Invert the bit.
        if original_bit_in_sn_minus_1 == "0":
            return "1"
        else:
            return "0"

# Example Usage:
# print(findKthBit(3, 1)) # Output: "0"
# print(findKthBit(4, 11)) # Output: "1"
# print(findKthBit(1, 1)) # Output: "0"
# print(findKthBit(2, 1)) # Output: "0"
# print(findKthBit(2, 2)) # Output: "1"
# print(findKthBit(2, 3)) # Output: "1"
# print(findKthBit(3, 4)) # Output: "1"
# print(findKthBit(3, 5)) # Output: "0"
```