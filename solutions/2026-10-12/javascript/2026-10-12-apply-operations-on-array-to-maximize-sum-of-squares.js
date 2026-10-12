// Brief problem summary: Maximize the sum of squares of k chosen elements from an array by applying bitwise AND/OR operations.
// Link: https://leetcode.com/problems/apply-operations-on-array-to-maximize-sum-of-squares/
//
// Approach Explanation:
// The core idea is that the bitwise AND and OR operations allow us to redistribute bits among the numbers.
// Specifically, for any pair of numbers (a, b), after the operation, the new numbers are (a & b) and (a | b).
// The key observation is that the sum of bits at each position across all numbers remains invariant under these operations.
// For example, if we have numbers x and y, and consider a specific bit position.
// If the bit is 0 in both x and y, it remains 0 in (x & y) and 0 in (x | y). Total 0 bits.
// If the bit is 1 in x and 0 in y, it becomes 0 in (x & y) and 1 in (x | y). Total 1 bit.
// If the bit is 0 in x and 1 in y, it becomes 0 in (x & y) and 1 in (x | y). Total 1 bit.
// If the bit is 1 in both x and y, it becomes 1 in (x & y) and 1 in (x | y). Total 2 bits.
//
// This means we can consolidate all the set bits (1s) at each bit position across all numbers into as few numbers as possible.
// For each bit position (from 0 to 30, since nums[i] <= 10^9 < 2^30), we count how many numbers have that bit set.
// Let `count[b]` be the number of elements in `nums` that have the `b`-th bit set.
//
// To maximize the sum of squares, we want to create numbers with as many high-order bits set as possible.
// We can imagine forming `k` new numbers. For each bit position `b`, if `count[b]` numbers have this bit set, we can distribute these `count[b]` set bits among our `k` target numbers.
// To maximize the resulting numbers, we should give these `count[b]` set bits to the first `count[b]` numbers we are forming.
//
// So, we can construct `k` numbers. For each bit position `b` from 0 to 30:
// If `count[b]` is greater than 0, we can set the `b`-th bit for the first `count[b]` numbers that we are building.
//
// We will maintain an array, say `result_nums`, of size `k`, initialized to zeros.
// For each bit `b` from 0 to 30:
//   Iterate from `i = 0` to `count[b] - 1`.
//   Set the `b`-th bit of `result_nums[i]`.
//
// After processing all bit positions, `result_nums` will contain the `k` numbers that maximize the sum of squares.
// Then, we calculate the sum of squares of these `k` numbers modulo 10^9 + 7.
//
// Example walk-through: nums = [2, 6, 5, 8], k = 2
// Binary representations:
// 2: 0010
// 6: 0110
// 5: 0101
// 8: 1000
//
// Bit counts:
// Bit 0: 1 (from 5)
// Bit 1: 2 (from 2, 6)
// Bit 2: 2 (from 6, 5)
// Bit 3: 1 (from 8)
//
// We need k=2 numbers. Initialize result_nums = [0, 0].
//
// Bit 0: count[0] = 1. Set bit 0 for result_nums[0]. result_nums = [1, 0].
// Bit 1: count[1] = 2. Set bit 1 for result_nums[0] and result_nums[1]. result_nums = [1 | (1<<1), 0 | (1<<1)] = [3, 2].
// Bit 2: count[2] = 2. Set bit 2 for result_nums[0] and result_nums[1]. result_nums = [3 | (1<<2), 2 | (1<<2)] = [7, 6].
// Bit 3: count[3] = 1. Set bit 3 for result_nums[0]. result_nums = [7 | (1<<3), 6] = [15, 6].
//
// Final result_nums = [15, 6].
// Sum of squares = 15^2 + 6^2 = 225 + 36 = 261.
//
// Time Complexity Analysis:
// 1. Counting bits for each position: We iterate through `nums` (length N) and for each number, we check up to 30 bits. This is O(N * log(max(nums))).
// 2. Constructing the `k` numbers: We iterate through 30 bit positions. For each bit position `b`, we iterate up to `count[b]` times, where `count[b]` <= N. In the worst case, this is O(log(max(nums)) * N).
// 3. Calculating sum of squares: We iterate through `k` numbers, each operation is O(1). This is O(k).
// Overall time complexity: O(N * log(max(nums))) which is approximately O(N * 30). Since N can be up to 10^5, and log(max(nums)) is around 30, this is efficient.
//
// Space Complexity Analysis:
// 1. `bitCounts` array: Stores counts for 30 bits. O(log(max(nums))).
// 2. `result_nums` array: Stores `k` numbers. O(k).
// Overall space complexity: O(k + log(max(nums))). Since k can be up to N, this is O(N) in the worst case if we consider k as N. More precisely, it's O(k) if k is much smaller than N and O(N) if k is close to N.

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxSumSquare = function(nums, k) {
    // Modulo constant
    const MOD = 1e9 + 7;
    // Maximum possible bit to consider (since nums[i] <= 10^9 < 2^30)
    const MAX_BITS = 30;

    // Array to store the count of numbers that have the i-th bit set.
    // bitCounts[i] will store the count for the i-th bit.
    const bitCounts = new Array(MAX_BITS).fill(0);

    // Iterate through each number in nums
    for (const num of nums) {
        // For each number, iterate through its bits
        for (let i = 0; i < MAX_BITS; i++) {
            // Check if the i-th bit is set in the current number
            // (num >> i) & 1 checks the i-th bit.
            if (((num >> i) & 1) === 1) {
                // If the bit is set, increment the count for this bit position.
                bitCounts[i]++;
            }
        }
    }

    // Array to store the k numbers we will form to maximize the sum of squares.
    // Initialize with k zeros.
    const resultNums = new Array(k).fill(0);

    // Now, construct the k numbers by distributing the set bits.
    // For each bit position, we assign the set bits to the first `count[bit_pos]` numbers in `resultNums`.
    for (let i = 0; i < MAX_BITS; i++) {
        // If the i-th bit is set in at least one number from the original nums
        if (bitCounts[i] > 0) {
            // Distribute this set bit to the first `bitCounts[i]` numbers in our result array.
            // We take `bitCounts[i]` because at most `bitCounts[i]` numbers can have this bit set.
            // To maximize the values, we give these bits to the first `bitCounts[i]` elements.
            // Also, we only need to assign this bit if `bitCounts[i]` is less than or equal to `k` (the number of elements we can form).
            // If `bitCounts[i]` is greater than `k`, it means more than `k` numbers had this bit. We can still only assign it to `k` numbers.
            // So, we take the minimum of `bitCounts[i]` and `k`.
            const numToAssignBit = Math.min(bitCounts[i], k);

            for (let j = 0; j < numToAssignBit; j++) {
                // Set the i-th bit for the j-th number in resultNums.
                // (1 << i) creates a number with only the i-th bit set.
                // Using bitwise OR (|) to set the bit.
                resultNums[j] |= (1 << i);
            }
        }
    }

    // Calculate the sum of squares of the k chosen numbers.
    let sumOfSquares = 0;
    for (const num of resultNums) {
        // Calculate square and add to sum, applying modulo at each step to prevent overflow.
        // (num * num) % MOD is the square modulo MOD.
        // (sumOfSquares + ...) % MOD adds the square to the running sum modulo MOD.
        sumOfSquares = (sumOfSquares + (num * num) % MOD) % MOD;
    }

    // Return the final maximum sum of squares modulo 10^9 + 7.
    return sumOfSquares;
};
```