// Problem: Longest Balanced Substring II
// Link: https://leetcode.com/problems/longest-balanced-substring-ii/
// Approach:
// We are looking for the longest substring where the counts of 'a', 'b', and 'c' are equal.
// This problem can be rephrased as finding a substring where the difference between
// the counts of any two characters is a constant. Specifically, if the counts are
// equal to `k`, then count('a') - count('b') = 0, count('b') - count('c') = 0,
// and count('a') - count('c') = 0.
//
// Let's define two difference values for each prefix of the string:
// diff1 = count('a') - count('b')
// diff2 = count('b') - count('c')
//
// If a substring from index `i` to `j` (inclusive) is balanced, it means that the
// difference between counts of 'a' and 'b' within this substring is 0, and the
// difference between counts of 'b' and 'c' is also 0.
//
// This implies that:
// (prefix_count('a', j) - prefix_count('b', j)) - (prefix_count('a', i-1) - prefix_count('b', i-1)) = 0
// (prefix_count('b', j) - prefix_count('c', j)) - (prefix_count('b', i-1) - prefix_count('c', i-1)) = 0
//
// So, we are looking for indices `i-1` and `j` such that:
// prefix_diff1[j] == prefix_diff1[i-1]
// prefix_diff2[j] == prefix_diff2[i-1]
//
// We can use a hash map to store the first occurrence of each pair of (diff1, diff2).
// For each index `j`, we calculate `diff1` and `diff2` for the prefix ending at `j`.
// We then check if the pair (diff1, diff2) has been seen before.
// If it has, let the previous index be `prev_idx`. The length of the balanced substring
// ending at `j` would be `j - prev_idx`. We update our maximum length accordingly.
//
// If the pair (diff1, diff2) has not been seen, we store it in the hash map with the current index `j`.
// We also need to handle the case where the balanced substring starts from the beginning of the string.
// This can be done by initializing the hash map with a default entry for (0, 0) at index -1.
//
// The characters 'a', 'b', and 'c' can be mapped to numerical values for easier calculation of differences.
// For example:
// 'a' -> 1
// 'b' -> 0
// 'c' -> -1
//
// Then:
// diff1 = count('a') - count('b')
// diff2 = count('b') - count('c')
//
// A substring is balanced if count('a') = count('b') = count('c') = k.
// This implies:
// count('a') - count('b') = 0
// count('b') - count('c') = 0
//
// Using prefix sums:
// Let p_a[i], p_b[i], p_c[i] be the counts of 'a', 'b', 'c' in s[0...i-1].
// For a substring s[i...j-1] to be balanced:
// (p_a[j] - p_a[i]) == (p_b[j] - p_b[i]) == (p_c[j] - p_c[i])
//
// Rearranging:
// (p_a[j] - p_b[j]) == (p_a[i] - p_b[i])
// (p_b[j] - p_c[j]) == (p_b[i] - p_c[i])
//
// Let diff1[k] = p_a[k] - p_b[k]
// Let diff2[k] = p_b[k] - p_c[k]
//
// We need to find j > i such that diff1[j] == diff1[i] and diff2[j] == diff2[i].
// We can iterate through the string, maintaining current prefix differences.
// We use a map `map<pair<int, int>, int>` to store the first occurrence of a (diff1, diff2) pair.
// The key will be a pair of (diff1, diff2) and the value will be the index.
//
// Initialize:
// max_len = 0
// current_diff1 = 0
// current_diff2 = 0
// map_of_diffs = { {0, 0}: -1 } // Store (diff1, diff2) -> index
//
// Iterate i from 0 to s.length - 1:
//   Update current_diff1 and current_diff2 based on s[i]:
//     If s[i] == 'a', current_diff1++
//     If s[i] == 'b', current_diff1--, current_diff2++
//     If s[i] == 'c', current_diff2--
//
//   Check if (current_diff1, current_diff2) is in map_of_diffs:
//     If yes:
//       prev_idx = map_of_diffs[(current_diff1, current_diff2)]
//       max_len = max(max_len, i - prev_idx)
//     If no:
//       map_of_diffs[(current_diff1, current_diff2)] = i
//
// Return max_len
//
// Time Complexity: O(N), where N is the length of the string. We iterate through the string once. Hash map operations (insertion and lookup) take O(1) on average.
// Space Complexity: O(N) in the worst case. The number of distinct (diff1, diff2) pairs can be up to N if all characters are unique and differences are spread out. However, since diff1 and diff2 are bounded (their values are related to prefix sums which are at most N), the number of distinct pairs is O(N^2). But the actual differences are bounded by N. In the case of only 3 characters, the difference between counts can be at most N. So the number of distinct (diff1, diff2) pairs is O(N).
// The range of diff1 is [-N, N] and diff2 is [-N, N]. The number of possible pairs is (2N+1)*(2N+1).
// However, diff1 + diff2 = (count('a')-count('b')) + (count('b')-count('c')) = count('a') - count('c').
// The sum of counts is at most N. So diff1+diff2 is also bounded by N.
// This limits the number of distinct (diff1, diff2) pairs.
// Consider the total count: `count('a') + count('b') + count('c') = N_prefix`.
// `diff1 = count('a') - count('b')`
// `diff2 = count('b') - count('c')`
//
// The number of distinct pairs (diff1, diff2) is actually O(N) because the sum of counts is related.
// If we consider count_a, count_b, count_c, then we have:
// diff1 = count_a - count_b
// diff2 = count_b - count_c
//
// The states we are looking for are `(count_a - count_b, count_b - count_c)`.
// For a prefix of length `k`, the maximum difference can be `k`. So diff1 and diff2 are in `[-k, k]`.
//
// The number of distinct pairs (diff1, diff2) we can encounter is related to the possible counts.
// For example, if we have a prefix of length `L`, `count_a + count_b + count_c = L`.
// `diff1 = count_a - count_b`
// `diff2 = count_b - count_c`
//
// `count_a = diff1 + count_b`
// `count_c = count_b - diff2`
//
// Substituting into the sum:
// `(diff1 + count_b) + count_b + (count_b - diff2) = L`
// `diff1 - diff2 + 3 * count_b = L`
// `3 * count_b = L - diff1 + diff2`
//
// This means `L - diff1 + diff2` must be divisible by 3.
// This implies that the number of distinct (diff1, diff2) pairs is not simply O(N^2) but more constrained.
// It's still O(N) because for each prefix length `k`, there are at most `k+1` possible values for `count_b` (from 0 to `k`), and for each `count_b`, `diff1` and `diff2` are constrained.
// Hence, space complexity is O(N).

var longestBalancedSubstring = function(s) {
    // Initialize the maximum length of a balanced substring found so far.
    let maxLength = 0;
    
    // Initialize the current differences between counts of 'a' and 'b', and 'b' and 'c'.
    // diff1 tracks count('a') - count('b')
    // diff2 tracks count('b') - count('c')
    let diff1 = 0;
    let diff2 = 0;
    
    // Use a Map to store the first encountered index for each pair of (diff1, diff2).
    // The key of the map will be a string representation of the pair "diff1,diff2".
    // The value will be the index.
    // We initialize it with { "0,0": -1 } to handle balanced substrings starting from index 0.
    // If we encounter "0,0" again at index `i`, it means the substring from index 0 to `i` is balanced,
    // and its length is `i - (-1) = i + 1`.
    const diffMap = new Map();
    diffMap.set("0,0", -1);
    
    // Iterate through the string from left to right.
    for (let i = 0; i < s.length; i++) {
        // Update the differences based on the current character.
        if (s[i] === 'a') {
            diff1++; // Increment count of 'a'
        } else if (s[i] === 'b') {
            diff1--; // Decrement count of 'a' relative to 'b' (or increment count of 'b' relative to 'a')
            diff2++; // Increment count of 'b'
        } else { // s[i] === 'c'
            diff2--; // Decrement count of 'b' relative to 'c' (or increment count of 'c' relative to 'b')
        }
        
        // Create a string key for the current (diff1, diff2) pair.
        const currentKey = `${diff1},${diff2}`;
        
        // Check if this (diff1, diff2) pair has been seen before.
        if (diffMap.has(currentKey)) {
            // If it has been seen, calculate the length of the balanced substring.
            // The substring starts from the index after the previous occurrence of this pair.
            // The length is the current index `i` minus the index stored in the map.
            const previousIndex = diffMap.get(currentKey);
            maxLength = Math.max(maxLength, i - previousIndex);
        } else {
            // If this (diff1, diff2) pair is encountered for the first time,
            // store the current index `i` in the map for this key.
            diffMap.set(currentKey, i);
        }
    }
    
    // Return the maximum length found.
    return maxLength;
};
```