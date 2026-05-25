/*
Problem Summary:
Given a binary string `s` and jump ranges `minJump` and `maxJump`, determine if it's possible to reach the last index (s.length - 1) starting from index 0. You can only jump from index `i` to `j` if `s[j]` is '0' and `minJump <= j - i <= maxJump`.

Problem Link:
https://leetcode.com/problems/jump-game-vii/

Approach Explanation:
This problem can be solved using dynamic programming combined with a sliding window or prefix sum optimization to efficiently check jumpability.

Let `dp[i]` be a boolean indicating whether index `i` is reachable.
`dp[0]` is true, as we start at index 0.
For any other index `i` (where `s[i] == '0'`), `dp[i]` is true if there exists some `j` such that `dp[j]` is true and `minJump <= i - j <= maxJump`. This can be rewritten as `i - maxJump <= j <= i - minJump`.

A naive DP approach would iterate `j` for each `i`, leading to O(N * (maxJump - minJump + 1)) time complexity, which could be O(N^2) in the worst case (maxJump close to N), too slow for N = 10^5.

To optimize, we observe that for `dp[i]` to be true (assuming `s[i] == '0'`), we need to check if *any* `j` in the range `[i - maxJump, i - minJump]` has `dp[j] == true`. This is a range query for truthiness. A sliding window sum or prefix sum approach can answer this efficiently.

We can maintain a count of reachable indices within the current valid jump range `[i - maxJump, i - minJump]`. Let `reachable_count` be the number of `j`'s such that `dp[j]` is true and `j` falls within the current sliding window.

As we iterate `i` from 1 to `s.length - 1`:
1. If `s[i] == '1'`, then `dp[i]` must be false. We can skip this index.
2. If `s[i] == '0'`:
   a. Update the sliding window:
      - When `i` increments, the window `[i - maxJump, i - minJump]` also slides.
      - We might "lose" `dp[i - maxJump - 1]` from the left end of the window (if `i - maxJump - 1 >= 0` and `dp[i - maxJump - 1]` was true).
      - We might "gain" `dp[i - minJump]` at the right end of the window (if `i - minJump >= 0` and `dp[i - minJump]` was true).
   b. `dp[i]` is true if `reachable_count > 0`.
   c. If `dp[i]` becomes true, we increment `reachable_count` for future `i`'s that can jump from `i`.

Let's refine the sliding window logic. We can use a variable `count_reachable_prev_range` to store the number of `true` values in `dp` within the range `[i - maxJump, i - minJump]`.
Initialize `dp` array of size `s.length` with all `false`.
`dp[0] = true`.
`count_reachable_prev_range = 0`.
Since we can jump from 0 to `j` where `minJump <= j <= maxJump`, we initialize `count_reachable_prev_range` based on `dp[0]`.
For `i = 0`, if `i` is within `[0 - maxJump, 0 - minJump]` (which doesn't make sense as `j` is the current index and `i` is the previous), we need a slightly different perspective.

Alternative: Maintain a count of reachable indices `j` such that `j` is a valid *origin* for future jumps.
Initialize `dp[s.length]` with `false`, `dp[0] = true`.
`reachable_origins = 0`.
`queue` or `deque` can also be used, but a simple counter `reachable_origins` will work better with prefix sums idea.
A more common sliding window DP approach uses a prefix sum array `prefix_dp` where `prefix_dp[k]` stores the number of reachable indices from 0 to `k-1`.
`prefix_dp[k] = dp[0] + dp[1] + ... + dp[k-1]`.
Then the count of reachable indices in `[L, R]` is `prefix_dp[R+1] - prefix_dp[L]`.

Let `prefix_sums[k]` store the number of reachable indices from 0 to `k-1` (i.e., `sum(dp[0...k-1])`).
`prefix_sums` array will be `s.length + 1` long.
`dp[0] = true`, `prefix_sums[1] = 1`. All other `prefix_sums[0]` and `dp[i]` are 0/false.

For `i` from 1 to `s.length - 1`:
   If `s[i] == '0'`:
      Calculate the range `[left_bound, right_bound]` for previous reachable `j`s:
      `left_bound = i - maxJump`
      `right_bound = i - minJump`
      Ensure bounds are valid: `left_bound = Math.max(0, left_bound)`
      
      Number of reachable previous indices in `[left_bound, right_bound]` is `prefix_sums[right_bound + 1] - prefix_sums[left_bound]`.
      If this count is greater than 0, then `dp[i] = true`.
   
   Update `prefix_sums[i + 1] = prefix_sums[i] + (dp[i] ? 1 : 0)`.

This approach correctly handles the sliding window by using prefix sums.
`prefix_sums[k]` means count of reachable indices from `0` to `k-1`.
For `dp[i]`, we need to check `dp[j]` for `j` in `[i - maxJump, i - minJump]`.
Let `L = i - maxJump` and `R = i - minJump`.
The number of `true` values in `dp` from `L` to `R` (inclusive) is `prefix_sums[R + 1] - prefix_sums[L]`.
We need to make sure `L` is at least 0.

Example walkthrough for `s = "011010", minJump = 2, maxJump = 3`:
`n = 6`
`dp` array of size 6, all false initially.
`prefix_sums` array of size 7, all 0 initially.

`dp[0] = true`
`prefix_sums[1] = 1` (because `dp[0]` is true)

`i = 1`: `s[1] = '1'`. `dp[1] = false`. `prefix_sums[2] = prefix_sums[1] + (dp[1] ? 1 : 0) = 1 + 0 = 1`.
`i = 2`: `s[2] = '1'`. `dp[2] = false`. `prefix_sums[3] = prefix_sums[2] + (dp[2] ? 1 : 0) = 1 + 0 = 1`.
`i = 3`: `s[3] = '0'`.
   `L = 3 - maxJump = 3 - 3 = 0`
   `R = 3 - minJump = 3 - 2 = 1`
   Range for `j` is `[0, 1]`.
   `count = prefix_sums[R + 1] - prefix_sums[L] = prefix_sums[1 + 1] - prefix_sums[0] = prefix_sums[2] - prefix_sums[0] = 1 - 0 = 1`.
   Since `count > 0`, `dp[3] = true`.
   `prefix_sums[4] = prefix_sums[3] + (dp[3] ? 1 : 0) = 1 + 1 = 2`.
`i = 4`: `s[4] = '1'`. `dp[4] = false`. `prefix_sums[5] = prefix_sums[4] + (dp[4] ? 1 : 0) = 2 + 0 = 2`.
`i = 5`: `s[5] = '0'`.
   `L = 5 - maxJump = 5 - 3 = 2`
   `R = 5 - minJump = 5 - 2 = 3`
   Range for `j` is `[2, 3]`.
   `count = prefix_sums[R + 1] - prefix_sums[L] = prefix_sums[3 + 1] - prefix_sums[2] = prefix_sums[4] - prefix_sums[2] = 2 - 1 = 1`.
   Since `count > 0`, `dp[5] = true`.
   `prefix_sums[6] = prefix_sums[5] + (dp[5] ? 1 : 0) = 2 + 1 = 3`.

Finally, return `dp[s.length - 1]`, which is `dp[5] = true`.

This seems correct.

Time Complexity:
O(N) - We iterate through the string `s` once. Inside the loop, all operations (array access, arithmetic) are O(1).

Space Complexity:
O(N) - We use `dp` array of size `N` and `prefix_sums` array of size `N+1`.

*/
function canReach(s, minJump, maxJump) {
    const n = s.length;

    // dp[i] will be true if index i is reachable, false otherwise.
    // Initialize with false.
    const dp = new Array(n).fill(false);
    
    // prefix_sums[k] stores the count of reachable indices from 0 to k-1 (exclusive of k).
    // This allows us to query the sum of true values in dp[L...R] as prefix_sums[R+1] - prefix_sums[L].
    // prefix_sums will have size n+1.
    const prefix_sums = new Array(n + 1).fill(0);

    // Starting at index 0 is always possible.
    dp[0] = true;
    
    // Update prefix_sums for the initial state.
    // prefix_sums[1] means count of reachable indices from 0 to 0, which is dp[0].
    prefix_sums[1] = 1;

    // Iterate through the string from index 1 to n-1.
    for (let i = 1; i < n; i++) {
        // If s[i] is '1', this index cannot be landed on, so it's not reachable.
        // dp[i] remains false.
        if (s[i] === '1') {
            // Update prefix_sums for current index. Since dp[i] is false, prefix_sums doesn't change from previous.
            prefix_sums[i + 1] = prefix_sums[i];
            continue;
        }

        // Calculate the range [left_bound, right_bound] of previous indices `j`
        // from which we could potentially jump to `i`.
        // `i - maxJump <= j <= i - minJump`
        const left_bound = i - maxJump;
        const right_bound = i - minJump;

        // Ensure the left_bound is not less than 0.
        const actual_left_bound = Math.max(0, left_bound);
        
        // Count how many reachable indices `j` exist within `[actual_left_bound, right_bound]`.
        // This count is `prefix_sums[right_bound + 1] - prefix_sums[actual_left_bound]`.
        // Note: `right_bound + 1` is used because `prefix_sums` is 1-indexed for ranges.
        // e.g., sum(dp[0...k-1]) is prefix_sums[k]. So sum(dp[L...R]) is prefix_sums[R+1] - prefix_sums[L].
        const count_reachable_in_range = prefix_sums[right_bound + 1] - prefix_sums[actual_left_bound];

        // If there's at least one reachable index `j` in the valid jump range,
        // then index `i` is reachable.
        if (count_reachable_in_range > 0) {
            dp[i] = true;
        }

        // Update prefix_sums for the current index `i`.
        // prefix_sums[i + 1] is the count of reachable indices from 0 to `i`.
        // It's the previous prefix_sums[i] plus 1 if dp[i] is true, or 0 otherwise.
        prefix_sums[i + 1] = prefix_sums[i] + (dp[i] ? 1 : 0);
    }

    // The answer is whether the last index (n-1) is reachable.
    return dp[n - 1];
}