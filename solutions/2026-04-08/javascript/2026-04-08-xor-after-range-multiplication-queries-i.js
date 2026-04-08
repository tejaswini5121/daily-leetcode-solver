```javascript
/**
 * @param {number[]} nums
 * @param {number[][]} queries
 * @return {number}
 */
// Problem: XOR After Range Multiplication Queries I
// Link: https://leetcode.com/problems/xor-after-range-multiplication-queries-i/
// Approach:
// The problem requires applying a series of range multiplication updates to an array and then calculating the XOR sum of the final array.
// Since the constraints on n and q are up to 10^3, a direct simulation of each query is feasible.
// For each query [li, ri, ki, vi]:
// We iterate from index li to ri with a step of ki.
// At each such index `idx`, we update nums[idx] by multiplying it with vi and taking the modulo 10^9 + 7.
// After processing all queries, we iterate through the modified nums array and calculate the bitwise XOR of all its elements.
// The modulo operation (10^9 + 7) is a common practice in competitive programming to prevent integer overflow.
// Time Complexity: O(q * n) in the worst case. For each query, the inner loop can iterate up to n times.
// Space Complexity: O(1) if we modify the input array in-place. If we consider the input array as part of the space, it's O(n).
const xorAfterRangeMultiplicationQueries = (nums, queries) => {
    const MOD = 10**9 + 7; // Define the modulo constant

    // Iterate through each query
    for (const query of queries) {
        const [li, ri, ki, vi] = query; // Destructure query parameters

        // Iterate through the specified range with the given step
        for (let idx = li; idx <= ri; idx += ki) {
            // Update the element at idx: (nums[idx] * vi) % MOD
            nums[idx] = (nums[idx] * vi) % MOD;
        }
    }

    // Calculate the XOR sum of all elements in the modified nums array
    let xorSum = 0;
    for (const num of nums) {
        xorSum ^= num;
    }

    // Return the final XOR sum
    return xorSum;
};
```