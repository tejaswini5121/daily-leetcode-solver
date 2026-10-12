```cpp
// Problem: Apply Operations on Array to Maximize Sum of Squares
// Link: https://leetcode.com/problems/apply-operations-on-array-to-maximize-sum-of-squares/
//
// Approach:
// The core idea is that the bitwise AND and OR operations preserve the total count of set bits at each bit position across the entire array.
// Specifically, for any bit position, if there are 'c' numbers in the array with that bit set, after any number of operations, there will still be exactly 'c' numbers with that bit set.
// To maximize the sum of squares, we want to construct 'k' numbers that are as large as possible. A number is larger if it has more significant bits set.
// Therefore, for each bit position (from 0 to 30, as nums[i] <= 10^9 < 2^30), we can determine how many numbers can have this bit set in the final 'k' chosen numbers.
// If 'c' numbers in the original array have the i-th bit set, then in the final array, we can have at most 'c' numbers with the i-th bit set.
// To maximize the sum of squares, we greedily assign these set bits to the 'k' numbers we are constructing.
// For each bit position 'b', if 'c' is the count of numbers in the original array with the b-th bit set, we can potentially set the b-th bit for 'c' numbers.
// We have 'k' slots to fill to form our chosen numbers. If 'c >= k', it means we have enough 'set' bits at position 'b' to set this bit in all 'k' numbers we are constructing.
// If 'c < k', it means we can only set the b-th bit in 'c' of the 'k' numbers we are constructing.
// So, for each bit position 'b', we can contribute 'c' times (1 << b) to the sum of the 'k' numbers.
// We maintain an array `counts` of size 31, where `counts[b]` stores the number of elements in `nums` that have the b-th bit set.
// We iterate through `nums` and populate `counts`.
// Then, we iterate from bit 0 to 30. For each bit `b`, let `c = counts[b]`. The number of times we can set this bit across our `k` numbers is `c`.
// We form `k` numbers. For each bit `b`, if `c >= k`, we can set the `b`-th bit for all `k` numbers. If `c < k`, we can set the `b`-th bit for `c` of the `k` numbers.
// To achieve this, we can iterate `k` times, and for each of the `k` numbers being constructed, if `counts[b] >= k`, we add `(1 << b)` to that number. If `counts[b] < k`, we add `(1 << b)` to the first `counts[b]` numbers being constructed.
// This can be simplified: For each bit `b`, we can form `c = counts[b]` segments of `(1 << b)`. We distribute these segments greedily to the `k` numbers we are building.
// So, we can create `k` numbers. For each bit `b` and its count `c = counts[b]`:
// If `c >= k`: all `k` numbers can have the `b`-th bit set. We add `(1 << b)` to each of the `k` numbers.
// If `c < k`: only `c` numbers can have the `b`-th bit set. We add `(1 << b)` to the first `c` numbers.
// After constructing these `k` numbers (let's call them `final_nums`), we calculate the sum of their squares modulo 10^9 + 7.
//
// Time Complexity:
// 1. Counting bits: O(N * log(max(nums[i]))) where N is the length of nums. log(max(nums[i])) is roughly 30 since nums[i] <= 10^9. So, O(30 * N).
// 2. Constructing `k` numbers: O(k * log(max(nums[i]))) which is O(30 * k).
// 3. Calculating sum of squares: O(k).
// Overall: O(N * 30 + k * 30 + k) which simplifies to O(N * 30 + k). Since N can be up to 10^5 and k is at most N, it's roughly O(N).
//
// Space Complexity:
// O(log(max(nums[i]))) for the `counts` array, which is O(30) or O(1) constant space.
// O(k) for storing the `k` numbers we are constructing.
// Overall: O(k).

#include <vector>
#include <cmath>

class Solution {
public:
    int maxSumOfSquares(std::vector<int>& nums, int k) {
        // Modulo constant
        long long MOD = 1e9 + 7;

        // Array to store the count of set bits at each position (0 to 30)
        // Since nums[i] <= 10^9, we need bits up to 2^29, so we consider up to bit 30.
        std::vector<int> counts(31, 0);

        // Iterate through each number in nums to populate the bit counts
        for (int num : nums) {
            for (int bit = 0; bit < 31; ++bit) {
                // Check if the bit is set in the current number
                if ((num >> bit) & 1) {
                    counts[bit]++;
                }
            }
        }

        // Vector to store the k numbers we will construct to maximize the sum of squares
        std::vector<long long> final_nums(k, 0);

        // Construct the k numbers by greedily assigning set bits
        for (int bit = 0; bit < 31; ++bit) {
            int set_bit_count = counts[bit]; // Number of elements that have this bit set
            
            // If the number of available set bits for this position is greater than or equal to k,
            // it means we can set this bit for all k numbers we are constructing.
            // If the number of available set bits is less than k, we can only set this bit for `set_bit_count` numbers.
            // The number of times we can contribute `(1 << bit)` to the sum of our `k` numbers is `set_bit_count`.
            // We distribute these contributions greedily. If `set_bit_count >= k`, each of the `k` numbers gets `(1 << bit)`.
            // If `set_bit_count < k`, then only the first `set_bit_count` numbers among our `k` constructed numbers get `(1 << bit)`.
            // This logic is simplified by observing that we can form `set_bit_count` segments of `(1 << bit)`.
            // We can add `(1 << bit)` to `min(set_bit_count, k)` numbers.
            // More directly, if `set_bit_count >= k`, then `k` numbers can have this bit set. We add `(1 << bit)` to all `k` numbers.
            // If `set_bit_count < k`, then only `set_bit_count` numbers can have this bit set. We add `(1 << bit)` to the first `set_bit_count` numbers.
            
            // The number of times we can add `(1 << bit)` across our `k` chosen numbers is `set_bit_count`.
            // We can assign `(1 << bit)` to `k` numbers if `set_bit_count >= k`.
            // If `set_bit_count < k`, we can only assign `(1 << bit)` to `set_bit_count` numbers.
            // So, we can assign `(1 << bit)` to `min(set_bit_count, k)` numbers.
            // The number of numbers that can receive this bit is `set_bit_count`.
            // We distribute this bit `set_bit_count` times among the `k` slots.
            // For each of the `k` numbers, if `set_bit_count > 0`, we can potentially set the bit.
            // We have `set_bit_count` "units" of `(1 << bit)` to distribute.
            // We can give `(1 << bit)` to a number if `set_bit_count` is at least the number of times this bit has already been assigned to previous numbers.
            // A simpler approach: For each bit `b`, we have `counts[b]` bits available. We have `k` numbers to form.
            // We can set the `b`-th bit in `min(counts[b], k)` of our final `k` numbers.
            // So, if `counts[b] >= k`, we add `(1 << b)` to all `k` numbers.
            // If `counts[b] < k`, we add `(1 << b)` to the first `counts[b]` numbers.
            
            int num_receivers = std::min(set_bit_count, k); // Number of our k elements that can get this bit
            
            // Iterate through the first `num_receivers` elements of `final_nums`
            // and add the current bit value to them.
            for (int i = 0; i < num_receivers; ++i) {
                final_nums[i] += (1LL << bit); // Add the value of the bit (2^bit)
            }
        }

        // Calculate the sum of squares of the k constructed numbers
        long long sum_of_squares = 0;
        for (long long num : final_nums) {
            // Square the number and add to the sum, taking modulo at each step to prevent overflow
            sum_of_squares = (sum_of_squares + (num * num) % MOD) % MOD;
        }

        return (int)sum_of_squares;
    }
};
```