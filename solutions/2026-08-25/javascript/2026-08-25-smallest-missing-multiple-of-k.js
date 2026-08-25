// Find the smallest missing positive multiple of k in an array.
// Link: https://leetcode.com/problems/smallest-missing-multiple-of-k/
//
// Approach:
// We can iterate through multiples of k (k, 2k, 3k, ...) and check if each multiple
// exists in the input array `nums`. To efficiently check for existence, we'll first
// store all elements of `nums` in a Set. The first multiple of k that is not found
// in the Set is our answer.
//
// Time Complexity:
// O(N + M*k), where N is the length of `nums` and M is the number of multiples
// we need to check. In the worst case, we might check up to N+1 multiples.
// However, since nums[i] and k are at most 100, the maximum possible multiple
// we'd check is bounded. The dominant factor is usually N for building the set.
//
// Space Complexity:
// O(N) to store the elements of `nums` in a Set.
//
var findSmallestMissingMultiple = function(nums, k) {
    // Create a Set from the input array for efficient O(1) average time lookups.
    const numSet = new Set(nums);

    // Start checking multiples of k from k itself.
    let currentMultiple = k;

    // Iterate indefinitely until we find the missing multiple.
    while (true) {
        // If the current multiple of k is not present in the set,
        // it means it's the smallest missing multiple.
        if (!numSet.has(currentMultiple)) {
            return currentMultiple;
        }
        // Move to the next multiple of k.
        currentMultiple += k;
    }
};
```