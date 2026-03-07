/**
 * @param {string} s
 * @return {number}
 */
// Problem: Minimum Number of Flips to Make the Binary String Alternating
// Link: https://leetcode.com/problems/minimum-number-of-flips-to-make-the-binary-string-alternating/
//
// Approach:
// The core idea is that an alternating binary string can only start with '0' or '1'.
// This means there are only two possible target alternating strings for a given length n:
// 1. "010101..."
// 2. "101010..."
//
// We are allowed to perform a cyclic shift (Type-1 operation) any number of times. A cyclic shift allows us to bring any character to any position. The effect of these shifts is that we can consider any substring of length n from a doubled version of the original string (s + s) as a potential candidate for the final alternating string after some shifts.
//
// For example, if s = "111000" (length n=6), then s+s = "111000111000".
// Substrings of length 6 from s+s are:
// "111000" (0 shifts)
// "110001" (1 shift)
// "100011" (2 shifts)
// "000111" (3 shifts)
// "001110" (4 shifts)
// "011100" (5 shifts)
//
// For each possible target alternating string (starting with '0' or '1'), we can calculate the minimum flips required for each of these n possible cyclic shifts. The overall minimum will be the answer.
//
// Let's consider the target string starting with '0': "010101...".
// For a window of size n in the doubled string (s+s), we want to count the number of characters that do NOT match the ideal "010101..." pattern.
// The ideal character at index `i` in the "010101..." pattern is `i % 2`.
//
// For example, if the window is "100011" (from s="111000", 2 shifts), and n=6.
// Target "010101":
// Index 0: '1' vs '0' (mismatch, needs flip)
// Index 1: '0' vs '1' (mismatch, needs flip)
// Index 2: '0' vs '0' (match)
// Index 3: '0' vs '1' (mismatch, needs flip)
// Index 4: '1' vs '0' (mismatch, needs flip)
// Index 5: '1' vs '1' (match)
// Total mismatches for "010101..." pattern = 4.
//
// Now consider the target string starting with '1': "101010...".
// The ideal character at index `i` is `(i + 1) % 2`.
//
// For the same window "100011":
// Target "101010":
// Index 0: '1' vs '1' (match)
// Index 1: '0' vs '0' (match)
// Index 2: '0' vs '1' (mismatch, needs flip)
// Index 3: '0' vs '0' (match)
// Index 4: '1' vs '1' (mismatch, needs flip)
// Index 5: '1' vs '0' (mismatch, needs flip)
// Total mismatches for "101010..." pattern = 3.
//
// The minimum flips for this window are min(4, 3) = 3.
//
// We can use a sliding window approach on the doubled string `s + s`.
// For each window of size `n`:
// 1. Calculate the number of flips needed to match "010101..."
// 2. Calculate the number of flips needed to match "101010..."
// 3. Take the minimum of these two counts.
// 4. Update the overall minimum flips found so far.
//
// To efficiently update the flip counts as the window slides, we can maintain two counters:
// `flips0` for mismatches against "010101..."
// `flips1` for mismatches against "101010..."
//
// When the window slides one position to the right:
// - The character leaving the window needs to be accounted for its contribution to `flips0` and `flips1`.
// - The character entering the window needs to be accounted for its contribution to `flips0` and `flips1`.
//
// Let the doubled string be `ss = s + s`. The window is `ss[i...i+n-1]`.
// For an element `ss[j]` at index `j` within the original string's context (0 to n-1 for the first n positions, then n to 2n-1 for the second n positions):
//
// For target "010101...":
// If `j` is even, ideal is '0'. If `ss[j]` is '1', it's a mismatch.
// If `j` is odd, ideal is '1'. If `ss[j]` is '0', it's a mismatch.
// This can be summarized: mismatch if `(ss[j] - '0') != (j % 2)`.
//
// For target "101010...":
// If `j` is even, ideal is '1'. If `ss[j]` is '0', it's a mismatch.
// If `j` is odd, ideal is '0'. If `ss[j]` is '1', it's a mismatch.
// This can be summarized: mismatch if `(ss[j] - '0') != ((j + 1) % 2)`.
//
// Let's refine the calculation within the sliding window.
// Consider `ss = s + s`.
// We iterate through `ss` from index `0` to `2*n - 1`.
// For each position `i` in `ss`:
// - If `i` is even, the ideal character for pattern "0101..." is '0', and for "1010..." is '1'.
// - If `i` is odd, the ideal character for pattern "0101..." is '1', and for "1010..." is '0'.
//
// Let's track `diff0` (mismatches for "0101...") and `diff1` (mismatches for "1010...").
//
// Initialize `diff0 = 0`, `diff1 = 0`.
// Iterate `i` from `0` to `n-1` (the first window):
//   Character `c = ss[i]`.
//   If `i` is even:
//     If `c == '1'`, increment `diff0` (mismatch for "0101...").
//     If `c == '0'`, increment `diff1` (mismatch for "1010...").
//   If `i` is odd:
//     If `c == '0'`, increment `diff0` (mismatch for "0101...").
//     If `c == '1'`, increment `diff1` (mismatch for "1010...").
//
// After initializing for the first window, `min_flips = min(diff0, diff1)`.
//
// Now, slide the window from `i = 1` to `n-1`. For each slide:
// The character leaving is `ss[i-1]`. The character entering is `ss[i+n-1]`.
// The *original index* in `s` for `ss[i-1]` is `(i-1) % n`.
// The *original index* in `s` for `ss[i+n-1]` is `(i+n-1) % n`.
//
// This "original index" logic is a bit confusing. A simpler way is to realize that within the doubled string `ss`, the parity of the index `j` (0 to `2n-1`) directly tells us what the target character should be for the two alternating patterns.
//
// Let's consider `ss = s + s`.
// We are interested in `n` windows of size `n`. The first window starts at index `0`, the second at `1`, ..., the last at `n-1`.
//
// For window starting at `start_idx` (from `0` to `n-1`):
// The window elements are `ss[start_idx], ss[start_idx+1], ..., ss[start_idx+n-1]`.
//
// Let's calculate `flips0` for the window `ss[start_idx ... start_idx+n-1]` which aims for "0101..." pattern.
// The character at `ss[k]` (where `k` is the index in `ss` from `start_idx` to `start_idx+n-1`) should ideally be `(k - start_idx) % 2` if `start_idx` is even, or `(k - start_idx + 1) % 2` if `start_idx` is odd for "0101...".
//
// This is still getting complicated. Let's simplify the pattern identification.
//
// Target pattern 1: "010101..."
// For any character `c` at index `k` in `ss`, it should be `k % 2` (as an integer '0' or '1').
// If `c` is '0', it matches if `k % 2 == 0`.
// If `c` is '1', it matches if `k % 2 == 1`.
// So, a mismatch occurs if `(c - '0') != (k % 2)`.
//
// Target pattern 2: "101010..."
// For any character `c` at index `k` in `ss`, it should be `(k + 1) % 2`.
// If `c` is '0', it matches if `(k + 1) % 2 == 0`.
// If `c` is '1', it matches if `(k + 1) % 2 == 1`.
// So, a mismatch occurs if `(c - '0') != ((k + 1) % 2)`.
//
// We can slide a window of size `n` over `ss = s + s`.
//
// Initialize `cost0 = 0` (flips for "0101...") and `cost1 = 0` (flips for "1010...").
//
// For `i` from `0` to `n-1`: (This is the first window of size `n`)
//   Let `char_code = ss[i].charCodeAt(0) - '0'.charCodeAt(0);`
//   If `i % 2 == 0` (ideal for "0101..." is '0'):
//     If `char_code != 0`, increment `cost0`.
//     If `char_code != 1`, increment `cost1`. // Ideal for "1010..." is '1'
//   Else (`i % 2 == 1`) (ideal for "0101..." is '1'):
//     If `char_code != 1`, increment `cost0`.
//     If `char_code != 0`, increment `cost1`. // Ideal for "1010..." is '0'
//
// Initialize `min_flips = min(cost0, cost1)`.
//
// Now, slide the window. For `i` from `1` to `n-1`:
//   Character leaving the window: `ss[i-1]`.
//   Character entering the window: `ss[i+n-1]`.
//   The index for these characters in `ss` are `i-1` and `i+n-1`.
//
//   Let `left_char_code = ss[i-1].charCodeAt(0) - '0'.charCodeAt(0);`
//   Let `right_char_code = ss[i+n-1].charCodeAt(0) - '0'.charCodeAt(0);`
//
//   Update `cost0`:
//   If `(i-1) % 2 == 0` (ideal for "0101..." is '0'):
//     If `left_char_code != 0`, then `cost0` was incremented. Now that it's leaving, decrement `cost0`.
//   Else (`(i-1) % 2 == 1`) (ideal for "0101..." is '1'):
//     If `left_char_code != 1`, then `cost0` was incremented. Now that it's leaving, decrement `cost0`.
//
//   If `(i+n-1) % 2 == 0` (ideal for "0101..." is '0'):
//     If `right_char_code != 0`, then `cost0` needs to be incremented.
//   Else (`(i+n-1) % 2 == 1`) (ideal for "0101..." is '1'):
//     If `right_char_code != 1`, then `cost0` needs to be incremented.
//
//   Update `cost1` similarly.
//
//   `min_flips = min(min_flips, cost0, cost1)`.
//
// Example Walkthrough: s = "111000", n = 6. ss = "111000111000"
//
// Initial window (i=0 to 5): ss[0...5] = "111000"
//
// For cost0 (target "010101"):
// i=0 (even): ss[0]='1'. Ideal='0'. Mismatch. cost0++ (cost0=1)
// i=1 (odd):  ss[1]='1'. Ideal='1'. Match.
// i=2 (even): ss[2]='1'. Ideal='0'. Mismatch. cost0++ (cost0=2)
// i=3 (odd):  ss[3]='0'. Ideal='1'. Mismatch. cost0++ (cost0=3)
// i=4 (even): ss[4]='0'. Ideal='0'. Match.
// i=5 (odd):  ss[5]='0'. Ideal='1'. Mismatch. cost0++ (cost0=4)
// Initial cost0 = 4.
//
// For cost1 (target "101010"):
// i=0 (even): ss[0]='1'. Ideal='1'. Match.
// i=1 (odd):  ss[1]='1'. Ideal='0'. Mismatch. cost1++ (cost1=1)
// i=2 (even): ss[2]='1'. Ideal='1'. Match.
// i=3 (odd):  ss[3]='0'. Ideal='0'. Match.
// i=4 (even): ss[4]='0'. Ideal='1'. Mismatch. cost1++ (cost1=2)
// i=5 (odd):  ss[5]='0'. Ideal='0'. Match.
// Initial cost1 = 2.
//
// min_flips = min(4, 2) = 2.
//
// Slide window (i=1): Window is ss[1...6] = "110001"
//
// Character leaving: ss[0] = '1' at index 0.
// Character entering: ss[6] = '1' at index 6.
//
// Update cost0 (target "010101"):
// Leaving ss[0]='1' at index 0 (even). Ideal was '0'. It contributed to cost0. Decrement cost0. cost0 = 4 - 1 = 3.
// Entering ss[6]='1' at index 6 (even). Ideal is '0'. Mismatch. Increment cost0. cost0 = 3 + 1 = 4.
//
// Update cost1 (target "101010"):
// Leaving ss[0]='1' at index 0 (even). Ideal was '1'. It did NOT contribute to cost1. No change.
// Entering ss[6]='1' at index 6 (even). Ideal is '1'. Match. No change.
//
// Let's re-evaluate the update logic. The logic for updating cost0 and cost1 directly based on parity is cleaner.
//
// For `k` in `0` to `2n-1`:
//   `char_code = ss[k].charCodeAt(0) - '0'.charCodeAt(0);`
//   If `k % 2 == 0`: // Ideal for "0101..." is '0', ideal for "1010..." is '1'
//     If `char_code != 0`, cost0++. // Mismatch for "0101..."
//     If `char_code != 1`, cost1++. // Mismatch for "1010..."
//   Else (`k % 2 == 1`): // Ideal for "0101..." is '1', ideal for "1010..." is '0'
//     If `char_code != 1`, cost0++. // Mismatch for "0101..."
//     If `char_code != 0`, cost1++. // Mismatch for "1010..."
//
// This calculates the total mismatches for the entire `ss` string for both patterns. We need this for a *window* of size `n`.
//
// The sliding window needs to account for the parity relative to the *start of the window*.
//
// Let's use `n = s.length`. Double the string `ss = s + s`.
//
// Initialize `flips0 = 0` (for target "0101...")
// Initialize `flips1 = 0` (for target "1010...")
//
// Iterate through the first window (indices `0` to `n-1` of `ss`):
// For `i` from `0` to `n-1`:
//   `char_val = ss[i] === '1' ? 1 : 0;`
//   If `i % 2 === 0`: // Position `i` should be '0' for target 0101... and '1' for target 1010...
//     If `char_val !== 0`, `flips0++`. // Mismatch with target 0101...
//     If `char_val !== 1`, `flips1++`. // Mismatch with target 1010...
//   Else: // `i % 2 === 1`. Position `i` should be '1' for target 0101... and '0' for target 1010...
//     If `char_val !== 1`, `flips0++`. // Mismatch with target 0101...
//     If `char_val !== 0`, `flips1++`. // Mismatch with target 1010...
//
// `min_flips = Math.min(flips0, flips1);`
//
// Now slide the window from `i = 1` to `n-1`. The window will be `ss[i ... i+n-1]`.
//
// For each `i` from `1` to `n-1`:
//   Character leaving: `ss[i-1]`. Its index in `ss` is `i-1`.
//   Character entering: `ss[i+n-1]`. Its index in `ss` is `i+n-1`.
//
//   Let `leaving_char_val = ss[i-1] === '1' ? 1 : 0;`
//   Let `entering_char_val = ss[i+n-1] === '1' ? 1 : 0;`
//
//   // Update flips0 (target "0101...")
//   // Account for the leaving character at index `i-1`
//   if `(i-1) % 2 === 0`: // Expected '0'
//     if `leaving_char_val !== 0`, `flips0--`. // It was a mismatch for target 0101...
//   else: // Expected '1'
//     if `leaving_char_val !== 1`, `flips0--`. // It was a mismatch for target 0101...
//
//   // Account for the entering character at index `i+n-1`
//   if `(i+n-1) % 2 === 0`: // Expected '0'
//     if `entering_char_val !== 0`, `flips0++`. // It's a mismatch for target 0101...
//   else: // Expected '1'
//     if `entering_char_val !== 1`, `flips0++`. // It's a mismatch for target 0101...
//
//   // Update flips1 (target "1010...")
//   // Account for the leaving character at index `i-1`
//   if `(i-1) % 2 === 0`: // Expected '1'
//     if `leaving_char_val !== 1`, `flips1--`. // It was a mismatch for target 1010...
//   else: // Expected '0'
//     if `leaving_char_val !== 0`, `flips1--`. // It was a mismatch for target 1010...
//
//   // Account for the entering character at index `i+n-1`
//   if `(i+n-1) % 2 === 0`: // Expected '1'
//     if `entering_char_val !== 1`, `flips1++`. // It's a mismatch for target 1010...
//   else: // Expected '0'
//     if `entering_char_val !== 0`, `flips1++`. // It's a mismatch for target 1010...
//
//   `min_flips = Math.min(min_flips, flips0, flips1);`
//
// This logic seems sound. Let's dry run "111000" again. n=6. ss="111000111000".
//
// Initial window (i=0 to 5): ss[0...5] = "111000"
// flips0 (target "010101"):
// i=0 (even): ss[0]=1. Exp=0. Mismatch. flips0++ (1)
// i=1 (odd):  ss[1]=1. Exp=1. Match.
// i=2 (even): ss[2]=1. Exp=0. Mismatch. flips0++ (2)
// i=3 (odd):  ss[3]=0. Exp=1. Mismatch. flips0++ (3)
// i=4 (even): ss[4]=0. Exp=0. Match.
// i=5 (odd):  ss[5]=0. Exp=1. Mismatch. flips0++ (4)
// flips0 = 4.
//
// flips1 (target "101010"):
// i=0 (even): ss[0]=1. Exp=1. Match.
// i=1 (odd):  ss[1]=1. Exp=0. Mismatch. flips1++ (1)
// i=2 (even): ss[2]=1. Exp=1. Match.
// i=3 (odd):  ss[3]=0. Exp=0. Match.
// i=4 (even): ss[4]=0. Exp=1. Mismatch. flips1++ (2)
// i=5 (odd):  ss[5]=0. Exp=0. Match.
// flips1 = 2.
//
// min_flips = min(4, 2) = 2.
//
// Slide window (i=1). Window ss[1...6] = "110001".
// Leaving: ss[0]='1' (index 0). Entering: ss[6]='1' (index 6).
//
// Update flips0 (target "010101"):
// Leaving ss[0]='1' at index 0 (even). Exp='0'. Was mismatch. flips0--. flips0=3.
// Entering ss[6]='1' at index 6 (even). Exp='0'. Mismatch. flips0++. flips0=4.
//
// Update flips1 (target "101010"):
// Leaving ss[0]='1' at index 0 (even). Exp='1'. Was match. No change to flips1.
// Entering ss[6]='1' at index 6 (even). Exp='1'. Match. No change to flips1.
//
// Wait, the logic for updating `flips1` for the leaving character `ss[0]` at index `0` (even) where the target is '1'. `ss[0]` is '1', which is a match. So it *didn't* contribute to `flips1`. So when it leaves, nothing happens to `flips1`. This is correct.
//
// Now entering `ss[6]='1'` at index `6` (even). For target "101010", the target at index 6 is '1'. This is a match. So `flips1` should not be incremented.
//
// Let's retry the update logic carefully.
//
// For a position `k` in `ss`:
// For target "0101...":
//   Ideal char code is `k % 2`.
//   Mismatch if `(ss[k] - '0') != (k % 2)`.
// For target "1010...":
//   Ideal char code is `(k + 1) % 2`.
//   Mismatch if `(ss[k] - '0') != ((k + 1) % 2)`.
//
// When sliding window from `i-1` to `i`:
// Character `ss[i-1]` leaves. Character `ss[i+n-1]` enters.
//
// Let's check the parity of the indices for update:
// `leaving_idx = i-1`
// `entering_idx = i+n-1`
//
// `leaving_char_val = ss[leaving_idx] - '0'`
// `entering_char_val = ss[entering_idx] - '0'`
//
// Update `flips0` (target "0101...")
//
// // Remove contribution of `ss[leaving_idx]`
// if `leaving_char_val != (leaving_idx % 2)`: // If it was a mismatch
//   `flips0--`
//
// // Add contribution of `ss[entering_idx]`
// if `entering_char_val != (entering_idx % 2)`: // If it's a mismatch
//   `flips0++`
//
// Update `flips1` (target "1010...")
//
// // Remove contribution of `ss[leaving_idx]`
// if `leaving_char_val != ((leaving_idx + 1) % 2)`: // If it was a mismatch
//   `flips1--`
//
// // Add contribution of `ss[entering_idx]`
// if `entering_char_val != ((entering_idx + 1) % 2)`: // If it's a mismatch
//   `flips1++`
//
// Example "111000", n=6, ss="111000111000"
//
// Initial window (i=0 to 5):
// flips0:
// i=0: ss[0]='1'. (0%2)=0. 1!=0. flips0++. (1)
// i=1: ss[1]='1'. (1%2)=1. 1==1. Match.
// i=2: ss[2]='1'. (2%2)=0. 1!=0. flips0++. (2)
// i=3: ss[3]='0'. (3%2)=1. 0!=1. flips0++. (3)
// i=4: ss[4]='0'. (4%2)=0. 0==0. Match.
// i=5: ss[5]='0'. (5%2)=1. 0!=1. flips0++. (4)
// flips0 = 4.
//
// flips1:
// i=0: ss[0]='1'. ((0+1)%2)=1. 1==1. Match.
// i=1: ss[1]='1'. ((1+1)%2)=0. 1!=0. flips1++. (1)
// i=2: ss[2]='1'. ((2+1)%2)=1. 1==1. Match.
// i=3: ss[3]='0'. ((3+1)%2)=0. 0==0. Match.
// i=4: ss[4]='0'. ((4+1)%2)=1. 0!=1. flips1++. (2)
// i=5: ss[5]='0'. ((5+1)%2)=0. 0==0. Match.
// flips1 = 2.
//
// min_flips = min(4, 2) = 2.
//
// Slide window (i=1). Window ss[1...6].
// Leaving: ss[0]='1' at index 0. Entering: ss[6]='1' at index 6.
//
// Update flips0:
// Leaving ss[0]='1', leaving_idx=0. (0%2)=0. 1!=0 (mismatch). flips0--. flips0 = 3.
// Entering ss[6]='1', entering_idx=6. (6%2)=0. 1!=0 (mismatch). flips0++. flips0 = 4.
//
// Update flips1:
// Leaving ss[0]='1', leaving_idx=0. ((0+1)%2)=1. 1==1 (match). No change.
// Entering ss[6]='1', entering_idx=6. ((6+1)%2)=1. 1==1 (match). No change.
//
// After slide for i=1: flips0=4, flips1=2.
// min_flips = min(2, 4, 2) = 2.
//
// Slide window (i=2). Window ss[2...7].
// Leaving: ss[1]='1' at index 1. Entering: ss[7]='1' at index 7.
//
// Update flips0:
// Leaving ss[1]='1', leaving_idx=1. (1%2)=1. 1==1 (match). No change.
// Entering ss[7]='1', entering_idx=7. (7%2)=1. 1==1 (match). No change.
// flips0 remains 4.
//
// Update flips1:
// Leaving ss[1]='1', leaving_idx=1. ((1+1)%2)=0. 1!=0 (mismatch). flips1--. flips1 = 1.
// Entering ss[7]='1', entering_idx=7. ((7+1)%2)=0. 1!=0 (mismatch). flips1++. flips1 = 2.
//
// After slide for i=2: flips0=4, flips1=2.
// min_flips = min(2, 4, 2) = 2.
//
// This seems wrong for "111000" -> "100011" -> "101010". The output is 2.
// Let's check the example:
// s = "111000"
// Op 1: "111000" -> "110001" (move '1' from front to end)
// Op 1: "110001" -> "100011" (move '1' from front to end)
// Now s="100011".
// To make it "101010":
// Flip s[2] ('0' to '1') -> "101011"
// Flip s[4] ('1' to '0') -> "101001" - WRONG. Need to flip s[2] and s[4].
//
// Let's look at the window "100011" for n=6.
// Target "010101":
// '1' vs '0' (mismatch)
// '0' vs '1' (mismatch)
// '0' vs '0' (match)
// '0' vs '1' (mismatch)
// '1' vs '0' (mismatch)
// '1' vs '1' (match)
// Total mismatches = 4.
//
// Target "101010":
// '1' vs '1' (match)
// '0' vs '0' (match)
// '0' vs '1' (mismatch)
// '0' vs '0' (match)
// '1' vs '1' (mismatch)
// '1' vs '0' (mismatch)
// Total mismatches = 3.
//
// The minimum for this window "100011" is min(4, 3) = 3.
// The example says the answer is 2. How?
//
// "111000"
// Shift 2 times: "100011"
// Flip s[2] ('0' to '1'): "101011"
// Flip s[4] ('1' to '0'): "101001" - No.
//
// The example explanation is: "Use the first operation two times to make s = "100011". Then, use the second operation on the third and sixth elements to make s = "101010"."
// s = "100011"
// Flip s[2] ('0' to '1'): "101011"
// Flip s[4] ('0' to '1'): "101111" - No.
//
// The example explanation refers to the indices of the string *after* the first operation.
// String after 2 shifts is "100011".
// Third element is '0' at index 2. Flip it to '1'. String becomes "101011".
// Sixth element is '1' at index 5. Flip it to '0'. String becomes "101010".
// This uses 2 flips. So for the shifted string "100011", the minimum flips to "101010" is 2.
//
// Let's re-calculate the flips for window "100011" to match "101010".
// Window:    1 0 0 0 1 1
// Target:    1 0 1 0 1 0
// Matches:   Y Y N Y Y N
// Mismatches:  2   1   2   = 3 mismatches.
// This contradicts the example.
//
// The problem statement: "Return the minimum number of type-2 operations you need to perform such that s becomes alternating." The type-1 operations are free and can be used to "transform" the string.
//
// The key insight is that the cyclic shifts allow us to align any `n`-length substring of `s+s` to be the "original" string, and then we count flips.
//
// Let's go back to the general approach:
// For each starting position `i` of a window in `s+s` (from `0` to `n-1`):
// We consider the substring `ss[i ... i+n-1]`.
// We want to find the minimum flips to make this substring alternating.
// There are two ideal alternating patterns: "0101..." and "1010...".
//
// For the substring `ss[i ... i+n-1]`:
// Target 1: "0101..."
// We need to compare `ss[i+j]` with `j % 2` for `j` from `0` to `n-1`.
// Target 2: "1010..."
// We need to compare `ss[i+j]` with `(j+1) % 2` for `j` from `0` to `n-1`.
//
// The problem is in how we calculate flips for `flips1` in the sliding window.
// The target pattern "101010..." for the window starting at `i` is NOT the same as the target pattern for the window starting at `i+1`.
//
// If the window starts at `i`, its elements are `ss[i], ss[i+1], ..., ss[i+n-1]`.
//
// The alternating patterns depend on the parity of the index within the window, NOT the index within `ss`.
//
// Let's re-think the `flips0` and `flips1` calculation for a window.
//
// Consider a window `W = ss[start_idx ... start_idx + n - 1]`.
//
// For target "0101...":
//   We want `W[j]` to be `j % 2` for `j = 0 ... n-1`.
//   Mismatches = count of `j` where `W[j]` is NOT `j % 2`.
//
// For target "1010...":
//   We want `W[j]` to be `(j + 1) % 2` for `j = 0 ... n-1`.
//   Mismatches = count of `j` where `W[j]` is NOT `(j + 1) % 2`.
//
// The sliding window approach efficiently updates these counts.
//
// Let's consider index `k` in `ss`.
// `k` corresponds to `j = k - start_idx` within the window.
//
// For `flips0` (target "0101..."):
//   The ideal character at `ss[k]` should be `(k - start_idx) % 2`.
//   This is INCORRECT. The target is based on position within the window.
//
// Let's consider two target strings of length `2n`:
// `T0 = "010101..."`
// `T1 = "101010..."`
//
// The characters in `ss` are `ss[0], ss[1], ..., ss[2n-1]`.
// We are looking for a window of length `n`.
//
// For a window starting at `i` (i.e., `ss[i ... i+n-1]`), we want to compare it with a length-`n` substring of `T0` and `T1`.
//
// If `i` is even, the window `ss[i ... i+n-1]` is compared with `T0[i ... i+n-1]` and `T1[i ... i+n-1]`.
// If `i` is odd, the window `ss[i ... i+n-1]` is compared with `T0[i ... i+n-1]` and `T1[i ... i+n-1]`.
//
// The key is that `T0[k]` is `k % 2`. And `T1[k]` is `(k+1) % 2`.
//
// So for the window `ss[i ... i+n-1]`:
//
// Cost for target "0101...":
// Count `k` from `i` to `i+n-1` where `(ss[k] - '0') != (k % 2)`.
//
// Cost for target "1010...":
// Count `k` from `i` to `i+n-1` where `(ss[k] - '0') != ((k + 1) % 2)`.
//
// This is exactly what the sliding window implementation should be calculating.
//
// Let's dry run "111000" again with this logic. n=6, ss="111000111000".
//
// Window i=0: ss[0...5] = "111000"
// Cost0 (target "010101" for indices 0..5):
// k=0: ss[0]='1'. 0%2=0. 1!=0. Cost0++. (1)
// k=1: ss[1]='1'. 1%2=1. 1==1. Match.
// k=2: ss[2]='1'. 2%2=0. 1!=0. Cost0++. (2)
// k=3: ss[3]='0'. 3%2=1. 0!=1. Cost0++. (3)
// k=4: ss[4]='0'. 4%2=0. 0==0. Match.
// k=5: ss[5]='0'. 5%2=1. 0!=1. Cost0++. (4)
// Cost0 = 4.
//
// Cost1 (target "101010" for indices 0..5):
// k=0: ss[0]='1'. (0+1)%2=1. 1==1. Match.
// k=1: ss[1]='1'. (1+1)%2=0. 1!=0. Cost1++. (1)
// k=2: ss[2]='1'. (2+1)%2=1. 1==1. Match.
// k=3: ss[3]='0'. (3+1)%2=0. 0==0. Match.
// k=4: ss[4]='0'. (4+1)%2=1. 0!=1. Cost1++. (2)
// k=5: ss[5]='0'. (5+1)%2=0. 0==0. Match.
// Cost1 = 2.
//
// min_flips = min(4, 2) = 2.
//
// Slide to i=1: Window ss[1...6] = "110001"
// Leaving: ss[0]='1' (idx 0). Entering: ss[6]='1' (idx 6).
//
// Update Cost0 (target "010101" for indices 1..6):
//
// Remove ss[0]:
// `ss[0]` char is '1'. Index `k=0`. Target `k%2` is 0. Mismatch. `cost0` had +1. So `cost0--`. `cost0 = 3`.
//
// Add ss[6]:
// `ss[6]` char is '1'. Index `k=6`. Target `k%2` is 0. Mismatch. `cost0++`. `cost0 = 4`.
//
// Update Cost1 (target "101010" for indices 1..6):
//
// Remove ss[0]:
// `ss[0]` char is '1'. Index `k=0`. Target `(k+1)%2` is 1. Match. `cost1` had no +1. No change. `cost1 = 2`.
//
// Add ss[6]:
// `ss[6]` char is '1'. Index `k=6`. Target `(k+1)%2` is 1. Match. `cost1` has no +1. No change. `cost1 = 2`.
//
// After slide i=1: cost0=4, cost1=2. min_flips = min(2, 4, 2) = 2.
//
// Slide to i=2: Window ss[2...7] = "100011"
// Leaving: ss[1]='1' (idx 1). Entering: ss[7]='1' (idx 7).
//
// Update Cost0 (target "010101" for indices 2..7):
//
// Remove ss[1]:
// `ss[1]` char is '1'. Index `k=1`. Target `k%2` is 1. Match. No change. `cost0 = 4`.
//
// Add ss[7]:
// `ss[7]` char is '1'. Index `k=7`. Target `k%2` is 1. Match. No change. `cost0 = 4`.
//
// Update Cost1 (target "101010" for indices 2..7):
//
// Remove ss[1]:
// `ss[1]` char is '1'. Index `k=1`. Target `(k+1)%2` is 0. Mismatch. `cost1` had +1. `cost1--`. `cost1 = 1`.
//
// Add ss[7]:
// `ss[7]` char is '1'. Index `k=7`. Target `(k+1)%2` is 0. Mismatch. `cost1++`. `cost1 = 2`.
//
// After slide i=2: cost0=4, cost1=2. min_flips = min(2, 4, 2) = 2.
//
// This matches the example output of 2. The logic seems correct now.
//
// Time Complexity:
// - Doubling the string `s`: O(n)
// - Initializing flips for the first window: O(n)
// - Sliding the window `n-1` times: Each slide takes O(1) to update costs. Total O(n).
// - Total Time Complexity: O(n)
//
// Space Complexity:
// - Storing the doubled string `ss`: O(n)
// - Other variables: O(1)
// - Total Space Complexity: O(n)
//
// Let's consider edge cases:
// s.length = 1. e.g., "0".
// ss = "00". n = 1.
// Initial window (i=0 to 0): ss[0] = "0"
// Cost0 (target "0"):
// k=0: ss[0]='0'. 0%2=0. Match. Cost0 = 0.
// Cost1 (target "1"):
// k=0: ss[0]='0'. (0+1)%2=1. Mismatch. Cost1++. Cost1 = 1.
// min_flips = min(0, 1) = 0.
// Loop for sliding window `i` from 1 to `n-1` (1 to 0) doesn't run.
// Correct output: 0.
//
// s = "1". n=1. ss="11".
// Initial window (i=0 to 0): ss[0] = "1"
// Cost0 (target "0"):
// k=0: ss[0]='1'. 0%2=0. Mismatch. Cost0++. Cost0 = 1.
// Cost1 (target "1"):
// k=0: ss[0]='1'. (0+1)%2=1. Match. Cost1 = 0.
// min_flips = min(1, 0) = 0.
// Correct output: 0.
//
// The logic handles single characters correctly.
//
// The core logic is that for a window `ss[i ... i+n-1]`:
// `flips0` counts mismatches with `k % 2` for `k` from `i` to `i+n-1`.
// `flips1` counts mismatches with `(k + 1) % 2` for `k` from `i` to `i+n-1`.
//
// When sliding from `i-1` to `i`:
// `leaving_idx = i-1`
// `entering_idx = i+n-1`
//
// When updating `flips0`:
// - Removing `ss[leaving_idx]`: If `(ss[leaving_idx]-'0') != (leaving_idx % 2)`, then `flips0--`.
// - Adding `ss[entering_idx]`: If `(ss[entering_idx]-'0') != (entering_idx % 2)`, then `flips0++`.
//
// When updating `flips1`:
// - Removing `ss[leaving_idx]`: If `(ss[leaving_idx]-'0') != ((leaving_idx + 1) % 2)`, then `flips1--`.
// - Adding `ss[entering_idx]`: If `(ss[entering_idx]-'0') != ((entering_idx + 1) % 2)`, then `flips1++`.
//
// This appears to be the correct implementation strategy.

var minFlips = function(s) {
    const n = s.length;
    // Double the string to simulate cyclic shifts using a sliding window.
    const ss = s + s;
    
    // Initialize flip counts for two target alternating patterns:
    // 1. Starts with '0': "010101..."
    // 2. Starts with '1': "101010..."
    let flips0 = 0; // Mismatches for target "0101..."
    let flips1 = 0; // Mismatches for target "1010..."
    
    // Calculate initial flips for the first window (s itself, i.e., ss[0...n-1])
    for (let i = 0; i < n; i++) {
        const char_val = ss[i] === '1' ? 1 : 0;
        
        // For target "010101...", the expected char at index i is i % 2.
        if (i % 2 === 0) { // Expected '0'
            if (char_val !== 0) {
                flips0++;
            }
            // For target "101010...", the expected char at index i is (i + 1) % 2.
            // Since i is even, (i+1)%2 is 1. Expected '1'.
            if (char_val !== 1) {
                flips1++;
            }
        } else { // i % 2 === 1. Expected '1' for "0101..."
            if (char_val !== 1) {
                flips0++;
            }
            // Since i is odd, (i+1)%2 is 0. Expected '0' for "1010..."
            if (char_val !== 0) {
                flips1++;
            }
        }
    }
    
    // The minimum flips for the first window is the best we can do so far.
    let min_flips = Math.min(flips0, flips1);
    
    // Slide the window across the doubled string.
    // The window will be ss[i ... i+n-1] for i from 1 to n-1.
    for (let i = 1; i < n; i++) {
        // Character leaving the window from the left.
        const leaving_idx = i - 1;
        const leaving_char_val = ss[leaving_idx] === '1' ? 1 : 0;
        
        // Character entering the window from the right.
        const entering_idx = i + n - 1;
        const entering_char_val = ss[entering_idx] === '1' ? 1 : 0;
        
        // Update flips0 (for target "0101...")
        // Remove the contribution of the character leaving the window.
        // Check if the leaving character caused a mismatch for the "0101..." pattern.
        if (leaving_idx % 2 === 0) { // Expected '0' at leaving_idx
            if (leaving_char_val !== 0) { // It was a mismatch
                flips0--;
            }
        } else { // Expected '1' at leaving_idx
            if (leaving_char_val !== 1) { // It was a mismatch
                flips0--;
            }
        }
        
        // Add the contribution of the character entering the window.
        // Check if the entering character causes a mismatch for the "0101..." pattern.
        if (entering_idx % 2 === 0) { // Expected '0' at entering_idx
            if (entering_char_val !== 0) { // It's a mismatch
                flips0++;
            }
        } else { // Expected '1' at entering_idx
            if (entering_char_val !== 1) { // It's a mismatch
                flips0++;
            }
        }
        
        // Update flips1 (for target "1010...")
        // Remove the contribution of the character leaving the window.
        // Check if the leaving character caused a mismatch for the "1010..." pattern.
        if (leaving_idx % 2 === 0) { // Expected '1' at leaving_idx for "1010..."
            if (leaving_char_val !== 1) { // It was a mismatch
                flips1--;
            }
        } else { // Expected '0' at leaving_idx for "1010..."
            if (leaving_char_val !== 0) { // It was a mismatch
                flips1--;
            }
        }
        
        // Add the contribution of the character entering the window.
        // Check if the entering character causes a mismatch for the "1010..." pattern.
        if (entering_idx % 2 === 0) { // Expected '1' at entering_idx for "1010..."
            if (entering_char_val !== 1) { // It's a mismatch
                flips1++;
            }
        } else { // Expected '0' at entering_idx for "1010..."
            if (entering_char_val !== 0) { // It's a mismatch
                flips1++;
            }
        }
        
        // Update the overall minimum flips found so far.
        min_flips = Math.min(min_flips, flips0, flips1);
    }
    
    return min_flips;
};
```