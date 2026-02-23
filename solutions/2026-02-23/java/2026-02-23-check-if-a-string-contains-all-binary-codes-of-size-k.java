```java
// Problem: Check If a String Contains All Binary Codes of Size K
// Link: https://leetcode.com/problems/check-if-a-string-contains-all-binary-codes-of-size-k/
//
// Approach:
// The problem asks us to determine if all possible binary strings of length k are present as substrings within a given binary string s.
// The total number of unique binary strings of length k is 2^k.
//
// We can use a HashSet to store all unique substrings of length k found in s.
// We iterate through the string s and extract all substrings of length k.
// For each substring, we add it to the HashSet.
// After iterating through the entire string, we check if the size of the HashSet is equal to 2^k.
// If it is, it means all possible binary codes of length k were found, and we return true. Otherwise, we return false.
//
// To efficiently extract substrings and manage them, we can use a sliding window approach.
//
// Time Complexity:
// O(N * K) in the worst case if string manipulation takes O(K) for each substring.
// However, if we consider the `substring` operation as amortized O(1) for Java on average due to string interning or shared internal buffers,
// and HashSet add operation as O(K) due to hashing the string of length K, the total time complexity becomes O(N * K).
// A more optimized approach using bit manipulation and a rolling hash can achieve O(N).
//
// Space Complexity:
// O(2^k * K) in the worst case, where 2^k is the maximum number of unique binary codes of length k, and K is the length of each code.
// This is because the HashSet might store up to 2^k distinct binary strings, each of length k.
//
// Optimized Approach using Bit Manipulation and Rolling Hash:
// Instead of storing strings in the HashSet, we can store their integer representations.
// A binary string of length k can be converted to an integer value.
// We can use a sliding window of size k. As we slide the window one position to the right, we can update the integer value efficiently.
// If the current window represents the binary string b_k b_{k-1} ... b_1, and we slide it one position to the right,
// the new window represents b'_{k} b_{k-1} ... b_2.
// The new integer value can be calculated from the old one by:
// new_value = (old_value - (b_k * 2^(k-1))) * 2 + b'_k
// Where b_k is the most significant bit that is removed, and b'_k is the new least significant bit that is added.
//
// Time Complexity for Optimized Approach:
// O(N), where N is the length of the string s. We iterate through the string once.
// Each bit manipulation and HashSet operation (add and check) takes O(1) on average.
//
// Space Complexity for Optimized Approach:
// O(2^k), as the HashSet will store at most 2^k unique integer values.
//
// Since k is small (<= 20), 2^k is at most 2^20, which is about 1 million. This is manageable for space.

import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean hasAllCodes(String s, int k) {
        // If the length of the string s is less than k, it's impossible to have any substring of length k.
        if (s.length() < k) {
            return false;
        }

        // The total number of unique binary codes of length k is 2^k.
        int requiredCodes = 1 << k; // Equivalent to Math.pow(2, k)

        // Use a HashSet to store the unique integer representations of binary codes found.
        Set<Integer> foundCodes = new HashSet<>();

        // Initialize the integer value for the first window of size k.
        int currentCode = 0;
        for (int i = 0; i < k; i++) {
            // Shift currentCode left by 1 and add the new bit (0 or 1).
            // char '0' has ASCII value 48, char '1' has ASCII value 49.
            // Subtracting '0' converts the char to its integer equivalent (0 or 1).
            currentCode = (currentCode << 1) | (s.charAt(i) - '0');
        }
        // Add the first code to the set.
        foundCodes.add(currentCode);

        // Iterate through the string starting from the k-th character to apply the sliding window.
        for (int i = k; i < s.length(); i++) {
            // Calculate the integer value for the new window.
            // 1. Remove the most significant bit from the previous window.
            //    The bit to remove is at position k-1 (0-indexed).
            //    We can do this by subtracting the value of the most significant bit multiplied by 2^(k-1).
            //    However, a simpler way with bit manipulation is to shift `currentCode` right by 1
            //    to effectively remove the least significant bit, and then incorporate the new bit.
            //    This logic is slightly flawed for standard rolling hash interpretation.
            //    Let's re-evaluate the rolling hash update.

            // Correct Rolling Hash Update:
            // The window is s[i-k+1 ... i].
            // The previous window was s[i-k ... i-1].
            // Let `prevCode` be the integer for s[i-k ... i-1].
            // Let `newCode` be the integer for s[i-k+1 ... i].
            //
            // Example: k=3, s="10110"
            // Window 1: "101" -> code = 5
            // Window 2: "011" -> code = 3
            // To get 3 from 5:
            // 1. Remove the most significant bit (1) from "101". This is (5 - 1 * 2^2) = 5 - 4 = 1.
            // 2. Shift the result left by 1: 1 << 1 = 2.
            // 3. Add the new least significant bit (1): 2 | 1 = 3.
            // So, newCode = (prevCode - (msb * 2^(k-1))) * 2 + new_lsb

            // The bit to be removed is s.charAt(i-k).
            // The new bit to be added is s.charAt(i).

            // Update `currentCode` for the new window s[i-k+1 ... i].
            // Shift `currentCode` left by 1 to make space for the new bit.
            currentCode = currentCode << 1;
            // Add the new least significant bit.
            currentCode = currentCode | (s.charAt(i) - '0');

            // Now, `currentCode` represents the binary string s[i-k+1 ... i].
            // To correctly implement the rolling hash, we need to "remove" the bit that is no longer part of the window.
            // The bit that drops out is s.charAt(i-k).
            //
            // A more robust way to get the value for the new window s[i-k+1 ... i] from s[i-k ... i-1]:
            // Let the integer value of s[i-k ... i-1] be `val_prev`.
            // The integer value of s[i-k+1 ... i] is `val_new`.
            //
            // `val_new` can be computed as:
            // `val_new = (val_prev - (s.charAt(i-k) - '0') * (1 << (k-1))) * 2 + (s.charAt(i) - '0')`
            //
            // Let's use this approach.
            // The integer `currentCode` represents the window ending at `i-1`.
            // We need to calculate the code for the window ending at `i`.

            // The integer value for the window s[i-k ... i-1] is what `currentCode` held *before* this iteration.
            // We need to calculate the value for the window s[i-k+1 ... i].
            // Let's re-initialize `currentCode` to be the value for s[0...k-1] and then slide.

            // Re-calculating the code for the window ending at index `i`.
            // The window is s[i - k + 1 ... i].
            // The character that falls out of the window is s.charAt(i - k).
            // The character that enters the window is s.charAt(i).

            // We can maintain the integer representation of the current k-length substring.
            // When we move from s[i-k ... i-1] to s[i-k+1 ... i]:
            // The bit s.charAt(i-k) is removed from the most significant position.
            // The bit s.charAt(i) is added to the least significant position.

            // To calculate the new `currentCode` for the window ending at `i`:
            // Start with the `currentCode` of the window ending at `i-1`.
            // 1. Remove the most significant bit. This bit corresponds to s.charAt(i-k).
            //    The value of this bit is (s.charAt(i-k) - '0') * (1 << (k-1)).
            //    So, `currentCode = currentCode - (s.charAt(i-k) - '0') * (1 << (k-1))`
            // 2. Shift the result left by 1. This effectively multiplies the remaining bits by 2.
            //    `currentCode = currentCode * 2`
            // 3. Add the new least significant bit. This bit is s.charAt(i).
            //    `currentCode = currentCode + (s.charAt(i) - '0')`
            //
            // Combining these:
            // `currentCode = (currentCode - (s.charAt(i - k) - '0') * (1 << (k - 1))) * 2 + (s.charAt(i) - '0');`

            // Let's use a simpler update. The `currentCode` holds the integer for `s[i-k ... i-1]`.
            // We are now at index `i`. The new window is `s[i-k+1 ... i]`.
            // The bit `s.charAt(i-k)` (which was the MSB) is removed.
            // The bit `s.charAt(i)` is added as the LSB.

            // Consider the `currentCode` representing the window `s[i-k ... i-1]`.
            // To get the code for `s[i-k+1 ... i]`:
            // Shift `currentCode` left by 1: `currentCode << 1`. This represents `s[i-k+1 ... i-1]` followed by a 0.
            // Now add the new bit `s.charAt(i) - '0'` at the LSB position.
            // `currentCode = (currentCode << 1) | (s.charAt(i) - '0');`
            //
            // However, this does not remove the MSB contribution.
            // The correct approach is to remove the MSB's contribution, shift, and then add the new LSB.
            // The integer `currentCode` currently represents the binary value of `s[i-k ... i-1]`.
            //
            // To get the value for `s[i-k+1 ... i]`:
            // 1. Subtract the value of the MSB that's being removed: `s.charAt(i-k) - '0'`. This bit was at position `k-1` (0-indexed), so its value was `(s.charAt(i-k) - '0') << (k-1)`.
            // `currentCode = currentCode - ((s.charAt(i-k) - '0') << (k-1));`
            // 2. Shift the remaining bits to the left: `currentCode <<= 1;`
            // 3. Add the new LSB: `currentCode |= (s.charAt(i) - '0');`
            //
            // Let's ensure `currentCode` correctly reflects the window `s[i-k ... i-1]` before this step.

            // The `currentCode` is the integer value of `s[i-k ... i-1]`.
            // When `i` is `k`, the window is `s[0 ... k-1]`. `currentCode` is initialized for this.
            // For the next iteration, `i = k+1`. The window should be `s[1 ... k]`.
            // The character `s.charAt(i-k)` is `s.charAt(1)`. This is the character leaving the window.
            // The character `s.charAt(i)` is `s.charAt(k+1)`. This is the character entering the window.

            // Let's trace `k=2`, `s="00110110"`
            // Initial `currentCode` for "00": `0 << 1 | 0 = 0`. `foundCodes.add(0)`.
            // `i = 2`: char `s.charAt(i-k) = s.charAt(0) = '0'`. char `s.charAt(i) = s.charAt(2) = '1'`.
            // `currentCode` = 0.
            // Remove MSB: `(s.charAt(0) - '0') << (2-1) = 0 << 1 = 0`.
            // `currentCode = 0 - 0 = 0`.
            // Shift left: `currentCode <<= 1;` -> `0 << 1 = 0`.
            // Add LSB: `currentCode |= (s.charAt(2) - '0');` -> `0 | 1 = 1`.
            // New `currentCode` is 1. This represents "01". `foundCodes.add(1)`.

            // `i = 3`: char `s.charAt(i-k) = s.charAt(1) = '0'`. char `s.charAt(i) = s.charAt(3) = '1'`.
            // `currentCode` = 1 (representing "01").
            // Remove MSB: `(s.charAt(1) - '0') << (2-1) = 0 << 1 = 0`.
            // `currentCode = 1 - 0 = 1`.
            // Shift left: `currentCode <<= 1;` -> `1 << 1 = 2`.
            // Add LSB: `currentCode |= (s.charAt(3) - '0');` -> `2 | 1 = 3`.
            // New `currentCode` is 3. This represents "11". `foundCodes.add(3)`.

            // `i = 4`: char `s.charAt(i-k) = s.charAt(2) = '1'`. char `s.charAt(i) = s.charAt(4) = '0'`.
            // `currentCode` = 3 (representing "11").
            // Remove MSB: `(s.charAt(2) - '0') << (2-1) = 1 << 1 = 2`.
            // `currentCode = 3 - 2 = 1`.
            // Shift left: `currentCode <<= 1;` -> `1 << 1 = 2`.
            // Add LSB: `currentCode |= (s.charAt(4) - '0');` -> `2 | 0 = 2`.
            // New `currentCode` is 2. This represents "10". `foundCodes.add(2)`.

            // This seems to work!

            // Get the integer value of the bit that is leaving the window.
            int leavingBitValue = (s.charAt(i - k) - '0');
            // Get the integer value of the bit that is entering the window.
            int enteringBitValue = (s.charAt(i) - '0');

            // Update `currentCode`:
            // 1. Subtract the contribution of the leaving MSB.
            //    The value of the leaving MSB is `leavingBitValue * 2^(k-1)`.
            //    We can express `2^(k-1)` as `1 << (k-1)`.
            currentCode = currentCode - (leavingBitValue << (k - 1));
            // 2. Shift the remaining bits left by 1.
            currentCode = currentCode << 1;
            // 3. Add the entering LSB.
            currentCode = currentCode | enteringBitValue;

            // Add the new code to the set.
            foundCodes.add(currentCode);
        }

        // Check if the number of unique codes found is equal to the total number of possible codes.
        return foundCodes.size() == requiredCodes;
    }
}
```