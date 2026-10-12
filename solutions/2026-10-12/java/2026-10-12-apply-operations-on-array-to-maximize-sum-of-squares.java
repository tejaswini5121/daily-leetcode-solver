/**
 * Problem: Apply Operations on Array to Maximize Sum of Squares
 * Link: https://leetcode.com/problems/apply-operations-on-array-to-maximize-sum-of-squares/
 *
 * Approach:
 * The key insight is that the bitwise AND and OR operations between two numbers `a` and `b`
 * result in `a & b` and `a | b`. The sum of these two results is always equal to the
 * sum of the original numbers: `(a & b) + (a | b) = a + b`.
 * This means that the sum of all elements in the array remains invariant under these operations.
 *
 * The operations allow us to redistribute the set bits among the elements. To maximize the
 * sum of squares, we want to make the chosen `k` numbers as large as possible. The largest
 * numbers are formed by having as many set bits as possible, ideally at higher bit positions.
 *
 * We can count the occurrences of each bit position being set across all numbers in the array.
 * For each bit position (from 0 to 30, since `nums[i] <= 10^9` which is less than `2^30`),
 * if `c` numbers have this bit set, we can use this bit to contribute to at most `c` numbers
 * in the final array. To maximize the values, we should distribute these `c` set bits to
 * `c` different numbers.
 *
 * So, for each bit position `b`, if `count[b]` elements have this bit set, we can effectively
 * "assign" this bit to `count[b]` numbers. This means that `count[b]` numbers in the final
 * array will have this bit set.
 *
 * We can construct the `k` largest possible numbers greedily. For each bit position `b` from 0 to 30:
 * If `count[b]` is greater than or equal to `k`, it means we can set this bit in all `k` numbers
 * we are choosing.
 * If `count[b]` is less than `k`, it means we can set this bit in `count[b]` numbers. These `count[b]`
 * numbers will be among the largest `k` we construct.
 *
 * We can maintain an array `final_nums` of size `k` initialized to zeros. For each bit position `b`
 * and its count `count[b]`:
 * We can set the `b`-th bit in the first `count[b]` elements of `final_nums`.
 *
 * After iterating through all bit positions, `final_nums` will contain `k` numbers that
 * are constructed to be as large as possible by distributing the available set bits.
 *
 * Finally, we calculate the sum of squares of these `k` numbers in `final_nums` modulo 10^9 + 7.
 *
 * Time Complexity:
 * - Counting bits: O(N * log(max_val)), where N is the number of elements in nums and max_val is the maximum value in nums (approx 30 for 10^9).
 * - Constructing final_nums: O(k * log(max_val)).
 * - Calculating sum of squares: O(k).
 * Since N can be up to 10^5 and log(max_val) is small (around 30), the dominant factor is O(N * log(max_val)).
 *
 * Space Complexity:
 * - `bit_counts` array: O(log(max_val)) (constant size, typically 31 or 32).
 * - `final_nums` array: O(k).
 * Thus, the space complexity is O(k).
 */
class Solution {
    public int maxSumOfSquares(int[] nums, int k) {
        // Modulo constant
        int MOD = 1_000_000_007;

        // Array to store the count of each bit position (0 to 30, since max value < 2^30)
        int[] bitCounts = new int[31]; // Bits 0 through 30

        // Iterate through each number in the input array
        for (int num : nums) {
            // For each number, iterate through its bits
            for (int i = 0; i < 31; i++) {
                // Check if the i-th bit is set in the current number
                if (((num >> i) & 1) == 1) {
                    // If the bit is set, increment the count for this bit position
                    bitCounts[i]++;
                }
            }
        }

        // Array to store the k numbers that will form the maximum sum of squares.
        // We initialize them to 0.
        int[] finalNums = new int[k];

        // Construct the k largest possible numbers by distributing the set bits.
        // Iterate through each bit position
        for (int i = 0; i < 31; i++) {
            // If the count of the i-th bit is sufficient, we can set this bit
            // in multiple numbers.
            // We want to distribute this bit to as many of the `k` target numbers
            // as possible, up to the `bitCounts[i]` limit.
            // So, we assign this bit to the first `bitCounts[i]` numbers in `finalNums`
            // that are chosen. Since we want to maximize the numbers, we effectively
            // use this bit for `bitCounts[i]` of the largest numbers.
            // The number of times this bit can be set across the `k` chosen numbers is `bitCounts[i]`.
            // We distribute these `bitCounts[i]` set bits greedily to the first `bitCounts[i]` elements
            // of `finalNums`.
            int countForThisBit = bitCounts[i];

            // For each of the first `min(countForThisBit, k)` elements in `finalNums`,
            // set the i-th bit.
            for (int j = 0; j < k && j < countForThisBit; j++) {
                // Set the i-th bit in the j-th element of finalNums
                finalNums[j] |= (1 << i);
            }
        }

        // Calculate the sum of squares of the `k` numbers in `finalNums` modulo MOD.
        long sumOfSquares = 0;
        for (int num : finalNums) {
            // Cast num to long before squaring to avoid overflow if num is large.
            long currentNum = num;
            sumOfSquares = (sumOfSquares + (currentNum * currentNum) % MOD) % MOD;
        }

        return (int) sumOfSquares;
    }
}
