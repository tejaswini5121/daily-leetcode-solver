/**
 * @fileoverview LeetCode problem: Shortest and Lexicographically Smallest Beautiful String
 * @link https://leetcode.com/problems/shortest-and-lexicographically-smallest-beautiful-string/
 * @summary Finds the shortest beautiful substring (exactly k ones) and returns the lexicographically smallest among them.
 *
 * @approach
 * This problem requires finding the shortest substring with exactly k ones and then, among all shortest ones,
 * finding the lexicographically smallest.
 *
 * We can iterate through all possible substrings of `s`. For each substring, we count the number of ones.
 * If the count is equal to `k`, we consider it a "beautiful" substring.
 *
 * We maintain two variables:
 * 1. `minLength`: The length of the shortest beautiful substring found so far. Initialize to infinity.
 * 2. `smallestBeautifulSubstring`: The lexicographically smallest beautiful substring found so far. Initialize to an empty string.
 *
 * As we iterate through substrings:
 * - If a substring is beautiful:
 *   - If its length is less than `minLength`:
 *     - Update `minLength` to the current substring's length.
 *     - Update `smallestBeautifulSubstring` to the current substring.
 *   - If its length is equal to `minLength`:
 *     - Compare the current substring with `smallestBeautifulSubstring` lexicographically.
 *     - If the current substring is lexicographically smaller, update `smallestBeautifulSubstring`.
 *
 * Since the constraints on `s.length` are small (<= 100), a brute-force approach of checking all substrings is feasible.
 * The number of substrings is O(n^2), and counting ones in each takes O(n) in the worst case if we rescan.
 *
 * To optimize counting ones, we can use a sliding window approach or prefix sums.
 * However, with N <= 100, the brute force `O(N^3)` approach (N^2 substrings * N to count ones) is also acceptable.
 * A slightly optimized brute-force checking all substrings and counting ones for each is O(N^3).
 *
 * Let's refine the approach to be more efficient.
 * We can iterate through all possible starting points `i` of a substring.
 * For each `i`, we expand the substring to the right (ending at `j`).
 * While expanding, we maintain a count of ones.
 *
 * `minLength` initialized to `s.length + 1` (or Infinity).
 * `smallestBeautifulSubstring` initialized to `""`.
 *
 * Outer loop for `i` from 0 to `s.length - 1` (start of substring).
 * Inner loop for `j` from `i` to `s.length - 1` (end of substring).
 *
 * For each `(i, j)` pair, extract `substring = s.substring(i, j + 1)`.
 * Count ones in `substring`.
 *
 * If `count_ones == k`:
 *   `currentLength = j - i + 1`.
 *   If `currentLength < minLength`:
 *     `minLength = currentLength`.
 *     `smallestBeautifulSubstring = substring`.
 *   Else if `currentLength == minLength`:
 *     If `substring < smallestBeautifulSubstring` (lexicographically):
 *       `smallestBeautifulSubstring = substring`.
 *
 * This is still O(N^3) because substring extraction and counting ones take O(N).
 *
 * A better approach for counting ones within the inner loop:
 *
 * `minLength` initialized to `s.length + 1`.
 * `smallestBeautifulSubstring` initialized to `""`.
 *
 * For `i` from 0 to `s.length - 1`:
 *   `onesCount = 0`.
 *   For `j` from `i` to `s.length - 1`:
 *     If `s[j] == '1'`:
 *       `onesCount++`.
 *     If `onesCount == k`:
 *       `currentSubstring = s.substring(i, j + 1)`.
 *       `currentLength = j - i + 1`.
 *       If `currentLength < minLength`:
 *         `minLength = currentLength`.
 *         `smallestBeautifulSubstring = currentSubstring`.
 *       Else if `currentLength == minLength`:
 *         If `currentSubstring < smallestBeautifulSubstring`:
 *           `smallestBeautifulSubstring = currentSubstring`.
 *       // Once we found a beautiful substring starting at `i`, we can break the inner loop
 *       // for this `i` if we only care about the *first* occurrence of k ones for a given `i`
 *       // to potentially find shorter ones. However, we need to consider all substrings.
 *       // The above logic handles finding the shortest and lexicographically smallest correctly.
 *       // The break below is incorrect because a longer substring starting at `i` might still be the shortest *overall* if `k` is large.
 *       // No, we actually want to find the *first* occurrence of k ones for a given `i` to potentially get the shortest.
 *       // If `onesCount` reaches `k` at index `j`, then `s.substring(i, j+1)` is a candidate. Any further extension `s.substring(i, j'+1)` where `j' > j` will be longer.
 *       // So, if `onesCount == k`, we record it and can potentially break the inner loop for `i` to find shorter ones from new `i`s.
 *       // Let's re-evaluate.
 *
 * The problem asks for the shortest beautiful substring, then the lexicographically smallest *among those shortest*.
 *
 * Corrected Sliding Window/Two Pointers idea:
 * The problem implies we need to check all possible beautiful substrings to find the shortest, and then the lexicographically smallest.
 * Brute-force iteration of all substrings and counting ones within each seems unavoidable without a more complex data structure.
 *
 * Let's consider the constraints again: s.length <= 100.
 * O(N^3) is 100^3 = 1,000,000 operations, which is fine.
 *
 * The algorithm described above with nested loops:
 * `minLength = s.length + 1`
 * `smallestBeautifulSubstring = ""`
 *
 * For `i` from 0 to `s.length - 1`:
 *   `onesCount = 0`
 *   For `j` from `i` to `s.length - 1`:
 *     If `s[j] == '1'`:
 *       `onesCount++`
 *     If `onesCount == k`:
 *       `currentSubstring = s.substring(i, j + 1)`
 *       `currentLength = j - i + 1`
 *
 *       If `currentLength < minLength`:
 *         `minLength = currentLength`
 *         `smallestBeautifulSubstring = currentSubstring`
 *       Else if `currentLength == minLength`:
 *         // Lexicographical comparison
 *         If `currentSubstring < smallestBeautifulSubstring`:
 *           `smallestBeautifulSubstring = currentSubstring`
 *
 * This approach correctly finds the shortest length first, and then among those, the lexicographically smallest.
 * The time complexity is O(N^3) due to:
 * - Outer loop: N iterations
 * - Inner loop: N iterations
 * - `s.substring(i, j + 1)`: O(N) in worst case (copying characters)
 * - Counting ones: implicitly done in O(1) per character increment in the inner loop.
 *
 * Total time: O(N * N * N) = O(N^3)
 * Space complexity: O(N) for storing the `smallestBeautifulSubstring`.
 *
 * Let's try to optimize substring creation and comparison.
 * When `onesCount == k`, we have found a candidate beautiful substring `s[i...j]`.
 *
 * `minLength = Infinity`
 * `smallestBeautifulSubstring = ""`
 *
 * For `i` from 0 to `s.length - 1`:
 *   `onesCount = 0`
 *   For `j` from `i` to `s.length - 1`:
 *     If `s[j] == '1'`:
 *       `onesCount++`
 *
 *     // If we have exactly k ones in s[i...j]
 *     If `onesCount == k`:
 *       `currentLength = j - i + 1`
 *
 *       // If this is the first beautiful substring found, or shorter than current shortest
 *       If `currentLength < minLength`:
 *         `minLength = currentLength`
 *         `smallestBeautifulSubstring = s.substring(i, j + 1)`
 *       // If this beautiful substring has the same length as the current shortest
 *       Else if `currentLength == minLength`:
 *         // Compare lexicographically and update if current is smaller
 *         `currentSubstring = s.substring(i, j + 1)`
 *         If `currentSubstring < smallestBeautifulSubstring`:
 *           `smallestBeautifulSubstring = currentSubstring`
 *       // Once we have `k` ones for a starting `i`, any further extension `s[i...j']` (j' > j)
 *       // will be longer. So we can break the inner loop for `j` to save time,
 *       // as we are looking for the *shortest* length first.
 *       // This break is crucial for optimization and correctness because if we already found a beautiful
 *       // substring of length `L` starting at `i`, any longer substring starting at `i` is not a candidate
 *       // for being the *shortest* unless no other substring of length `L` exists.
 *       // The logic needs to ensure we find the minimum length *globally*.
 *       // The current logic does this. If we find a length `L`, `minLength` becomes `L`.
 *       // Any subsequent substring of length `L` is compared lexicographically.
 *       // Any substring longer than `L` is ignored for shortest length purposes.
 *       // The break: if `onesCount == k`, we've found a potential candidate. Any `j' > j` will result in `s[i...j']` having more than `k` ones (unless `s[j'+1]` is '0', but the count is already `k`).
 *       // The goal is to find the *shortest* length first. Once `onesCount` hits `k`, `s.substring(i, j+1)` is the shortest beautiful substring *starting at `i`*.
 *       // So, we can record it and move to the next `i`.
 *       // The break statement is correct here to avoid checking longer substrings starting at `i`.
 *       break; // Move to the next starting position `i` after finding the first occurrence of `k` ones.
 *
 * This optimization improves performance by not checking unnecessarily longer substrings from the same starting `i` once `k` ones are found.
 *
 * Time Complexity:
 * The outer loop runs `N` times.
 * The inner loop, on average, will run until `k` ones are found. In the worst case, it might run up to `N` times.
 * `s.substring` takes `O(L)` where `L` is the length of the substring (at most `N`).
 *
 * Let's consider the `break`. When `onesCount == k` for `s[i...j]`, we have found a beautiful substring of length `j-i+1`.
 * Any `s[i...j']` with `j' > j` will be longer than `j-i+1`.
 * Since we are looking for the *shortest* length, we only care about substrings of that minimum length.
 * If `j-i+1` is the current `minLength`, we do the lexicographical comparison.
 * If `j-i+1` is shorter than `minLength`, we update `minLength`.
 *
 * The break statement ensures that for a given `i`, we only consider the *shortest* beautiful substring starting at `i`.
 * This is crucial.
 *
 * Example: s = "1001101", k = 3
 * i=0:
 *   j=0: s[0]='1', ones=1
 *   j=1: s[1]='0', ones=1
 *   j=2: s[2]='0', ones=1
 *   j=3: s[3]='1', ones=2
 *   j=4: s[4]='1', ones=3. Found k=3 ones.
 *        Substring: "10011", length = 5.
 *        minLength = 5, smallestBeautifulSubstring = "10011".
 *        Break inner loop for j.
 * i=1:
 *   j=1: s[1]='0', ones=0
 *   j=2: s[2]='0', ones=0
 *   j=3: s[3]='1', ones=1
 *   j=4: s[4]='1', ones=2
 *   j=5: s[5]='0', ones=2
 *   j=6: s[6]='1', ones=3. Found k=3 ones.
 *        Substring: "001101", length = 6.
 *        Length 6 > minLength 5, ignore for shortest.
 *        Break inner loop for j.
 * i=2:
 *   j=2: s[2]='0', ones=0
 *   j=3: s[3]='1', ones=1
 *   j=4: s[4]='1', ones=2
 *   j=5: s[5]='0', ones=2
 *   j=6: s[6]='1', ones=3. Found k=3 ones.
 *        Substring: "01101", length = 5.
 *        Length 5 == minLength 5.
 *        Compare "01101" with "10011". "01101" < "10011".
 *        smallestBeautifulSubstring = "01101".
 *        Break inner loop for j.
 * i=3:
 *   j=3: s[3]='1', ones=1
 *   j=4: s[4]='1', ones=2
 *   j=5: s[5]='0', ones=2
 *   j=6: s[6]='1', ones=3. Found k=3 ones.
 *        Substring: "1101", length = 4.
 *        Length 4 < minLength 5.
 *        minLength = 4, smallestBeautifulSubstring = "1101".
 *        Break inner loop for j.
 * i=4:
 *   j=4: s[4]='1', ones=1
 *   j=5: s[5]='0', ones=1
 *   j=6: s[6]='1', ones=2. Not k=3.
 * i=5:
 *   j=5: s[5]='0', ones=0
 *   j=6: s[6]='1', ones=1. Not k=3.
 * i=6:
 *   j=6: s[6]='1', ones=1. Not k=3.
 *
 * Final result: "1101". This seems correct.
 *
 * The time complexity is indeed O(N^3) in the worst case if `s.substring` is O(N).
 * In JavaScript, `substring` might be O(N). If we avoid explicit `substring` creation and only use indices,
 * we can improve lexicographical comparison. But standard string comparison `s1 < s2` already handles it.
 *
 * Let's stick with the O(N^3) approach with the `break` as it correctly implements the logic and is efficient enough for N=100.
 *
 * Edge cases:
 * - k=0 is not possible by constraints (k is positive).
 * - If no beautiful substring is found, `smallestBeautifulSubstring` remains `""`.
 *
 * Implementation details:
 * - Initialize `minLength` to `s.length + 1` to ensure any valid length is smaller.
 * - Initialize `smallestBeautifulSubstring` to an empty string.
 * - The loop for `i` goes from `0` to `s.length - 1`.
 * - The loop for `j` goes from `i` to `s.length - 1`.
 * - `onesCount` is updated within the `j` loop.
 * - When `onesCount == k`, we have a candidate: `s.substring(i, j + 1)`.
 * - Compare lengths and then lexicographically.
 * - `break` the inner `j` loop once `onesCount == k` is met.
 *
 * If `minLength` remains `s.length + 1` after all loops, it means no beautiful substring was found.
 * Return `smallestBeautifulSubstring`.
 *
 * Consider example 1: s = "100011001", k = 3
 * i=0:
 *   j=4: "10001", ones=2
 *   j=5: "100011", ones=3. Length=6. minLength=6, smallest="100011". Break.
 * i=1:
 *   j=5: "00011", ones=2
 *   j=6: "000110", ones=2
 *   j=7: "0001100", ones=2
 *   j=8: "00011001", ones=3. Length=8. 8 > 6, ignore. Break.
 * i=2: ...
 * i=4:
 *   j=4: "1", ones=1
 *   j=5: "11", ones=2
 *   j=6: "110", ones=2
 *   j=7: "1100", ones=2
 *   j=8: "11001", ones=3. Length=5. 5 < 6. minLength=5, smallest="11001". Break.
 * i=5:
 *   j=5: "1", ones=1
 *   j=6: "10", ones=1
 *   j=7: "100", ones=1
 *   j=8: "1001", ones=2. Not k=3.
 * i=6:
 *   j=6: "0", ones=0
 *   j=7: "00", ones=0
 *   j=8: "001", ones=1. Not k=3.
 * i=7:
 *   j=7: "0", ones=0
 *   j=8: "01", ones=1. Not k=3.
 * i=8:
 *   j=8: "1", ones=1. Not k=3.
 *
 * Final result: "11001". Matches example.
 *
 * The logic appears sound.
 */
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
const shortestBeautifulSubstring = (s, k) => {
    // Initialize minLength to a value larger than any possible string length.
    // s.length + 1 is a safe upper bound.
    let minLength = s.length + 1;
    // Initialize the result string to empty.
    let smallestBeautifulSubstring = "";

    // Outer loop iterates through all possible start indices of a substring.
    for (let i = 0; i < s.length; i++) {
        let onesCount = 0; // Counter for '1's in the current substring.

        // Inner loop iterates through all possible end indices of a substring,
        // starting from the current start index `i`.
        for (let j = i; j < s.length; j++) {
            // If the current character is '1', increment the ones count.
            if (s[j] === '1') {
                onesCount++;
            }

            // Check if the current substring `s[i...j]` has exactly `k` ones.
            if (onesCount === k) {
                // Calculate the length of the current beautiful substring.
                const currentLength = j - i + 1;

                // If the current beautiful substring is shorter than the shortest one found so far,
                // update `minLength` and `smallestBeautifulSubstring`.
                if (currentLength < minLength) {
                    minLength = currentLength;
                    smallestBeautifulSubstring = s.substring(i, j + 1);
                }
                // If the current beautiful substring has the same length as the shortest one found so far,
                // we need to compare them lexicographically.
                else if (currentLength === minLength) {
                    const currentSubstring = s.substring(i, j + 1);
                    // If the current substring is lexicographically smaller, update `smallestBeautifulSubstring`.
                    if (currentSubstring < smallestBeautifulSubstring) {
                        smallestBeautifulSubstring = currentSubstring;
                    }
                }

                // Once we found a beautiful substring starting at `i` (with exactly `k` ones),
                // any further extension of this substring (i.e., `s[i...j']` where `j' > j`)
                // will necessarily be longer. Since we are looking for the *shortest* beautiful substring,
                // we can stop extending from this `i` and move to the next starting position.
                // This `break` optimizes the search by avoiding unnecessary checks of longer substrings
                // that cannot possibly be the shortest.
                break;
            }
        }
    }

    // After checking all possible substrings, if `minLength` is still its initial value (`s.length + 1`),
    // it means no beautiful substring was found. In this case, `smallestBeautifulSubstring` will still be `""`.
    // Otherwise, it holds the shortest and lexicographically smallest beautiful substring.
    return smallestBeautifulSubstring;
};
