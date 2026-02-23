// Problem: Check If a String Contains All Binary Codes of Size K
// Problem Summary: Determine if all possible binary strings of length k exist as substrings within a given binary string s.
// Link: https://leetcode.com/problems/check-if-a-string-contains-all-binary-codes-of-size-k/
//
// Approach:
// The problem asks us to check if every unique binary code of length k is present as a substring in the given binary string s.
// The total number of unique binary codes of length k is 2^k.
// We can iterate through the string s and extract all substrings of length k.
// For each substring, we can add it to a Set to keep track of unique binary codes found.
// If the size of the Set reaches 2^k, it means we have found all possible binary codes.
//
// To efficiently extract substrings of length k and manage them, we can use a sliding window approach.
// As we slide the window one position to the right, we can update the current binary code by removing the leftmost bit and adding the new rightmost bit.
// A more direct way is to convert each substring of length k into its integer representation and store these integers in a Set. This avoids string manipulations and potential Set overhead for strings.
//
// The maximum number of unique binary codes of size k is 2^k.
// The constraints state k <= 20, so 2^k can be up to 2^20, which is about 1 million. This is manageable for a Set.
//
// Algorithm:
// 1. Calculate the total number of unique binary codes required: `requiredCodes = 2^k`.
// 2. Initialize an empty Set called `foundCodes` to store the unique binary codes encountered.
// 3. Iterate through the string `s` from index 0 up to `s.length - k`. This loop represents the start of each substring of length k.
// 4. For each starting index `i`, extract the substring of length k: `substring = s.substring(i, i + k)`.
// 5. Add this `substring` to the `foundCodes` Set.
// 6. After iterating through all possible substrings, check if the size of `foundCodes` is equal to `requiredCodes`.
// 7. If `foundCodes.size === requiredCodes`, return `true`. Otherwise, return `false`.
//
// Optimization using rolling hash or integer representation:
// Instead of storing strings in the Set, we can store their integer representations. This might be slightly more efficient.
// For a substring `sub` of length `k`, its integer value can be calculated.
// For example, if `k=3` and `sub="101"`, its integer value is `1*2^2 + 0*2^1 + 1*2^0 = 4 + 0 + 1 = 5`.
//
// Revised Algorithm using integer representation:
// 1. Calculate `requiredCodes = 1 << k` (which is 2^k).
// 2. Initialize an empty Set `foundCodes`.
// 3. Iterate through the string `s` from index 0 up to `s.length - k`.
// 4. For each starting index `i`, extract the substring `s.substring(i, i + k)`.
// 5. Convert this substring to its integer representation. A simpler way without explicitly converting to a string first and then to an integer is to maintain a running integer value.
//
// Rolling integer conversion:
// Let's consider a window of size `k`. We can calculate the integer value for the first window `s[0...k-1]`.
// Then, for the next window `s[1...k]`, we can update the integer value:
// `newValue = (oldValue - (s[0] - '0') * 2^(k-1)) * 2 + (s[k] - '0')`
// This is equivalent to `(oldValue * 2) % 2^k` if we are careful about the most significant bit being removed and the least significant bit being added.
//
// Let's re-think the rolling integer conversion more carefully.
// If the current window is `s[i...i+k-1]` with integer value `currentValue`.
// The next window is `s[i+1...i+k]`.
// To get the `nextValue` from `currentValue`:
// 1. Remove the contribution of `s[i]` (the leftmost bit). This bit was multiplied by `2^(k-1)`. So, `currentValue = currentValue - (s[i] - '0') * 2^(k-1)`.
// 2. Shift the remaining bits to the left by one position. This is equivalent to multiplying by 2. So, `currentValue = currentValue * 2`.
// 3. Add the contribution of `s[i+k]` (the new rightmost bit). This bit is multiplied by `2^0 = 1`. So, `currentValue = currentValue + (s[i+k] - '0')`.
//
// The problem is that `2^(k-1)` can be large and we are dealing with binary codes. We can use bitwise operations.
//
// Integer representation with bit manipulation:
// current_num = 0;
// for i from 0 to k-1:
//   current_num = (current_num << 1) | (s[i] - '0');
// Add current_num to set.
//
// For i from k to s.length - 1:
//   // Remove the leftmost bit (s[i-k])
//   // current_num &= ~(1 << (k - 1)); // This is incorrect for removing MSB
//   // A better way to remove the leftmost bit and shift:
//   // If current_num represents bits b_{k-1} b_{k-2} ... b_0
//   // We want to get b_{k-2} ... b_0 new_bit
//   // This is equivalent to: (current_num << 1) & ((1 << k) - 1)
//   // The `& ((1 << k) - 1)` masks to keep only k bits.
//
// Let's refine the integer rolling approach:
// 1. Calculate `requiredCodes = 1 << k`.
// 2. Initialize an empty Set `seenCodes`.
// 3. Initialize `currentCode = 0`.
// 4. First, calculate the integer value for the first k bits:
//    For `i` from 0 to `k-1`:
//      `currentCode = (currentCode << 1) | (s.charCodeAt(i) - '0');`
// 5. Add `currentCode` to `seenCodes`.
// 6. Now, slide the window:
//    For `i` from `k` to `s.length - 1`:
//      // Remove the leftmost bit `s[i-k]` from `currentCode`.
//      // The value of the leftmost bit `s[i-k]` contributed `(s.charCodeAt(i-k) - '0') * 2^(k-1)` to `currentCode`.
//      // A simpler way is to observe that shifting left by 1 and masking by `(1 << k) - 1` effectively discards the MSB and shifts the rest.
//      `currentCode = (currentCode << 1) & ((1 << k) - 1);`
//      // Add the new rightmost bit `s[i]`.
//      `currentCode = currentCode | (s.charCodeAt(i) - '0');`
//      // Add the new `currentCode` to `seenCodes`.
//      `seenCodes.add(currentCode);`
// 7. Finally, return `seenCodes.size === requiredCodes`.
//
// Edge case: If `s.length < k`, it's impossible to form any substring of length k, so we should return false. However, the loop structure naturally handles this as the outer loop won't execute. The total number of required codes will be 2^k, and `seenCodes` will be empty if `s.length < k`, so `seenCodes.size` will not equal `requiredCodes`.
//
// Example Walkthrough: s = "00110110", k = 2
// requiredCodes = 1 << 2 = 4.
// seenCodes = {}
//
// Initial window (i = 0 to k-1 = 1):
// i = 0: s[0] = '0'. currentCode = (0 << 1) | 0 = 0.
// i = 1: s[1] = '0'. currentCode = (0 << 1) | 0 = 0.
// Substring "00" (integer 0) added to seenCodes. seenCodes = {0}.
//
// Sliding window (i = k = 2 to s.length - 1 = 7):
// i = 2:
//   s[i-k] = s[0] = '0'. s[i] = s[2] = '1'.
//   currentCode = (currentCode << 1) & ((1 << 2) - 1) = (0 << 1) & 3 = 0 & 3 = 0.
//   currentCode = 0 | (s.charCodeAt(2) - '0') = 0 | 1 = 1.
//   Substring "01" (integer 1) added. seenCodes = {0, 1}.
//
// i = 3:
//   s[i-k] = s[1] = '0'. s[i] = s[3] = '1'.
//   currentCode = (currentCode << 1) & ((1 << 2) - 1) = (1 << 1) & 3 = 2 & 3 = 2.
//   currentCode = 2 | (s.charCodeAt(3) - '0') = 2 | 1 = 3.
//   Substring "11" (integer 3) added. seenCodes = {0, 1, 3}.
//
// i = 4:
//   s[i-k] = s[2] = '1'. s[i] = s[4] = '0'.
//   currentCode = (currentCode << 1) & ((1 << 2) - 1) = (3 << 1) & 3 = 6 & 3 = 2.
//   currentCode = 2 | (s.charCodeAt(4) - '0') = 2 | 0 = 2.
//   Substring "10" (integer 2) added. seenCodes = {0, 1, 3, 2}.
//
// i = 5:
//   s[i-k] = s[3] = '1'. s[i] = s[5] = '1'.
//   currentCode = (currentCode << 1) & ((1 << 2) - 1) = (2 << 1) & 3 = 4 & 3 = 0.
//   currentCode = 0 | (s.charCodeAt(5) - '0') = 0 | 1 = 1.
//   Substring "01" (integer 1) already present. seenCodes = {0, 1, 3, 2}.
//
// i = 6:
//   s[i-k] = s[4] = '0'. s[i] = s[6] = '1'.
//   currentCode = (currentCode << 1) & ((1 << 2) - 1) = (1 << 1) & 3 = 2 & 3 = 2.
//   currentCode = 2 | (s.charCodeAt(6) - '0') = 2 | 1 = 3.
//   Substring "11" (integer 3) already present. seenCodes = {0, 1, 3, 2}.
//
// i = 7:
//   s[i-k] = s[5] = '1'. s[i] = s[7] = '0'.
//   currentCode = (currentCode << 1) & ((1 << 2) - 1) = (3 << 1) & 3 = 6 & 3 = 2.
//   currentCode = 2 | (s.charCodeAt(7) - '0') = 2 | 0 = 2.
//   Substring "10" (integer 2) already present. seenCodes = {0, 1, 3, 2}.
//
// Loop ends.
// seenCodes.size = 4.
// requiredCodes = 4.
// seenCodes.size === requiredCodes. Return true.
//
// The integer conversion approach seems robust and efficient.
//
// Time Complexity Analysis:
// The algorithm iterates through the string `s` once to extract all substrings of length `k` and their integer representations.
// The initial calculation of the first `k` bits takes O(k) time.
// The sliding window loop runs from `k` to `s.length - 1`, which is `s.length - k` iterations. Each iteration involves constant time operations (bit shifts, OR, set add).
// Therefore, the total time complexity is O(k + (s.length - k)) = O(s.length).
// The number of unique codes is 2^k. If 2^k is very large, the `Set.add` operation could take O(log(2^k)) which is O(k) if it uses a balanced tree, or amortized O(1) on average for hash tables. Assuming average O(1) for hash set operations, the overall time complexity remains O(s.length).
//
// Space Complexity Analysis:
// We use a `Set` to store the unique binary codes encountered.
// The maximum number of unique binary codes of length `k` is `2^k`.
// In the worst case, all `2^k` codes might be present, and we store their integer representations.
// So, the space complexity is O(min(s.length, 2^k)), as the number of unique substrings of length k cannot exceed s.length - k + 1. The number of possible distinct binary codes is 2^k.
// Since `k` is up to 20, `2^k` can be up to `2^20` (approx 1 million).
// So, the space complexity is O(2^k) in the worst case, considering k <= 20. If s.length is smaller than 2^k, then it's O(s.length).
// The problem constraints state `1 <= k <= 20`, so `2^k` is at most `2^20`.
// The space complexity is effectively O(2^k).
//
// Final check on constraints and potential issues:
// s.length up to 5 * 10^5, k up to 20.
// 2^20 is roughly 1 million. A set of 1 million integers is acceptable memory-wise.
// The integer representation of k bits will fit within standard integer types.
// The masking `((1 << k) - 1)` is crucial to ensure `currentCode` always stays within `k` bits.
// `(1 << k)` creates a number with the k-th bit set (e.g., if k=3, `1 << 3` is `1000` binary, which is 8 decimal).
// `((1 << k) - 1)` creates a mask of k ones (e.g., if k=3, `8 - 1 = 7`, which is `0111` binary). This ensures that `currentCode` only holds `k` bits, effectively wrapping around if more bits were generated by shifting.
//
// A slightly more direct way to calculate the integer value of the initial window:
// `currentCode = 0;`
// `for (let i = 0; i < k; i++) {`
//   `currentCode = (currentCode << 1) | (s.charCodeAt(i) - '0');`
// `}`
// This is correct and clear.
//
// For the sliding window:
// `for (let i = k; i < s.length; i++) {`
//   `// Remove the leftmost bit (s[i-k]) by shifting and masking`
//   `// The current code represents bits b_{k-1} b_{k-2} ... b_0.`
//   `// We want to remove b_{k-1} and shift the rest.`
//   `// Shifting left by 1 gives b_{k-2} ... b_0 0.`
//   `// The mask (1 << k) - 1 ensures we only keep k bits, effectively discarding the bit that was shifted out from the left.`
//   `currentCode = (currentCode << 1) & ((1 << k) - 1);`
//   `// Add the new rightmost bit s[i]`
//   `currentCode = currentCode | (s.charCodeAt(i) - '0');`
//   `seenCodes.add(currentCode);`
// `}`
// This looks correct.
//
// What if k=1?
// s = "0110", k = 1
// requiredCodes = 1 << 1 = 2.
// seenCodes = {}
//
// Initial window (i = 0 to k-1 = 0):
// i = 0: s[0] = '0'. currentCode = (0 << 1) | 0 = 0.
// Substring "0" (integer 0) added. seenCodes = {0}.
//
// Sliding window (i = k = 1 to s.length - 1 = 3):
// i = 1:
//   s[i-k] = s[0] = '0'. s[i] = s[1] = '1'.
//   currentCode = (currentCode << 1) & ((1 << 1) - 1) = (0 << 1) & 1 = 0 & 1 = 0.
//   currentCode = 0 | (s.charCodeAt(1) - '0') = 0 | 1 = 1.
//   Substring "1" (integer 1) added. seenCodes = {0, 1}.
//
// i = 2:
//   s[i-k] = s[1] = '1'. s[i] = s[2] = '1'.
//   currentCode = (currentCode << 1) & ((1 << 1) - 1) = (1 << 1) & 1 = 2 & 1 = 0.
//   currentCode = 0 | (s.charCodeAt(2) - '0') = 0 | 1 = 1.
//   Substring "1" (integer 1) already present. seenCodes = {0, 1}.
//
// i = 3:
//   s[i-k] = s[2] = '1'. s[i] = s[3] = '0'.
//   currentCode = (currentCode << 1) & ((1 << 1) - 1) = (1 << 1) & 1 = 2 & 1 = 0.
//   currentCode = 0 | (s.charCodeAt(3) - '0') = 0 | 0 = 0.
//   Substring "0" (integer 0) already present. seenCodes = {0, 1}.
//
// Loop ends.
// seenCodes.size = 2.
// requiredCodes = 2.
// Return true. Correct for Example 2.
//
// Example 3: s = "0110", k = 2
// requiredCodes = 1 << 2 = 4.
// seenCodes = {}
//
// Initial window (i = 0 to k-1 = 1):
// i = 0: s[0] = '0'. currentCode = 0.
// i = 1: s[1] = '1'. currentCode = (0 << 1) | 1 = 1.
// Substring "01" (integer 1) added. seenCodes = {1}.
//
// Sliding window (i = k = 2 to s.length - 1 = 3):
// i = 2:
//   s[i-k] = s[0] = '0'. s[i] = s[2] = '1'.
//   currentCode = (currentCode << 1) & ((1 << 2) - 1) = (1 << 1) & 3 = 2 & 3 = 2.
//   currentCode = 2 | (s.charCodeAt(2) - '0') = 2 | 1 = 3.
//   Substring "11" (integer 3) added. seenCodes = {1, 3}.
//
// i = 3:
//   s[i-k] = s[1] = '1'. s[i] = s[3] = '0'.
//   currentCode = (currentCode << 1) & ((1 << 2) - 1) = (3 << 1) & 3 = 6 & 3 = 2.
//   currentCode = 2 | (s.charCodeAt(3) - '0') = 2 | 0 = 2.
//   Substring "10" (integer 2) added. seenCodes = {1, 3, 2}.
//
// Loop ends.
// seenCodes.size = 3.
// requiredCodes = 4.
// seenCodes.size !== requiredCodes. Return false. Correct for Example 3.
//
// The logic seems sound.

var hasAllCodes = function(s, k) {
    // Calculate the total number of unique binary codes of length k.
    // This is 2^k. We use bit shift for efficiency: 1 << k is equivalent to 2^k.
    const requiredCodes = 1 << k;

    // If the length of the string 's' is less than k, it's impossible to form any
    // substring of length k, let alone all of them.
    // Also, if s.length - k + 1 (the number of substrings of length k) is less than
    // the required number of unique codes (2^k), then it's impossible to have all codes.
    // This check is implicitly handled by the loop and the final size comparison,
    // but adding it upfront can be a minor optimization for some cases.
    // For example, if s.length = 5, k = 3, requiredCodes = 8. Max substrings = 3.
    // If s.length < k, the loop for initial code calculation would fail.
    if (s.length < k) {
        return false;
    }

    // Use a Set to store the unique integer representations of binary codes found.
    // Using integers is generally more efficient than storing strings in a Set.
    const seenCodes = new Set();

    // Variable to hold the integer representation of the current window (substring of length k).
    let currentCode = 0;

    // Calculate the integer representation for the first k characters (the first window).
    for (let i = 0; i < k; i++) {
        // Left shift currentCode by 1 to make space for the new bit.
        // Then, add the integer value of the current character ('0' becomes 0, '1' becomes 1).
        // s.charCodeAt(i) - '0' gets the integer value of the character.
        currentCode = (currentCode << 1) | (s.charCodeAt(i) - '0');
    }

    // Add the integer representation of the first code to the set.
    seenCodes.add(currentCode);

    // Slide the window across the string s.
    // The loop starts from index k because we've already processed the first k characters.
    // The loop goes up to s.length - 1, processing each character that can be the
    // end of a k-length substring.
    for (let i = k; i < s.length; i++) {
        // To get the next code, we need to:
        // 1. Remove the contribution of the leftmost bit (s[i-k]) from currentCode.
        //    This is achieved by left-shifting currentCode by 1 and then applying
        //    a bitwise AND with a mask. The mask `(1 << k) - 1` ensures that only
        //    the lower k bits are retained. Shifting left by 1 effectively
        //    discards the most significant bit (which corresponds to s[i-k]'s contribution
        //    when it was the MSB of a k-bit number).
        //    Example: if k=3, mask is 0b111 (7). If currentCode was 0b101 (5),
        //    currentCode << 1 is 0b1010 (10). (10 & 7) = 0b0010 (2).
        //    This successfully removed the '1' from the left and shifted '01' to the left.
        currentCode = (currentCode << 1) & ((1 << k) - 1);

        // 2. Add the new rightmost bit s[i] to currentCode.
        //    We use a bitwise OR operation to set the least significant bit
        //    to the value of s[i].
        currentCode = currentCode | (s.charCodeAt(i) - '0');

        // Add the newly formed integer code to the set.
        seenCodes.add(currentCode);
    }

    // Finally, check if the number of unique codes found in the set is equal to
    // the total number of possible unique binary codes of length k (which is 2^k).
    return seenCodes.size === requiredCodes;
};
