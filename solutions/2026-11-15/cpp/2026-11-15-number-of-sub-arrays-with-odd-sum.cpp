```cpp
/*
Problem Summary:
This problem asks us to count the number of subarrays within a given array `arr` whose elements sum up to an odd number. The result should be returned modulo 10^9 + 7.

Problem Link:
https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/

Approach:
We can solve this problem efficiently using the concept of prefix sums and parity.
Let `prefixSum[i]` be the sum of elements from `arr[0]` to `arr[i-1]`.
The sum of a subarray `arr[j...k]` is `prefixSum[k+1] - prefixSum[j]`.
We are interested in subarrays where `prefixSum[k+1] - prefixSum[j]` is odd.

The difference between two numbers is odd if and only if one number is even and the other is odd.
So, we want:
1. `prefixSum[k+1]` is odd AND `prefixSum[j]` is even.
2. `prefixSum[k+1]` is even AND `prefixSum[j]` is odd.

We can iterate through the array and maintain the current prefix sum's parity. We also keep track of the counts of prefix sums encountered so far that are even and odd.

Let `odd_count` be the number of prefix sums encountered so far that are odd.
Let `even_count` be the number of prefix sums encountered so far that are even.

Initialize `odd_count = 0`, `even_count = 1` (because an empty prefix sum, before any elements, is 0, which is even).
Initialize `current_sum = 0` and `total_odd_subarrays = 0`.

Iterate through each element `num` in `arr`:
1. Update `current_sum = (current_sum + num) % 2`. This gives us the parity of the current prefix sum.
2. If `current_sum` is 1 (odd):
   - Any previous prefix sum that was even, when subtracted from the current odd prefix sum, will result in an odd sum. The number of such previous even prefix sums is `even_count`.
   - So, add `even_count` to `total_odd_subarrays`.
   - Increment `odd_count` because the current prefix sum is odd.
3. If `current_sum` is 0 (even):
   - Any previous prefix sum that was odd, when subtracted from the current even prefix sum, will result in an odd sum. The number of such previous odd prefix sums is `odd_count`.
   - So, add `odd_count` to `total_odd_subarrays`.
   - Increment `even_count` because the current prefix sum is even.

Remember to perform calculations modulo 10^9 + 7 at each addition step.

Time Complexity:
O(n), where n is the length of the input array `arr`. We iterate through the array once.

Space Complexity:
O(1). We only use a few variables to store counts and the current sum.
*/
#include <vector>

class Solution {
public:
    int numOfSubarrays(std::vector<int>& arr) {
        // Modulo constant
        int MOD = 1e9 + 7;

        // Counts of prefix sums encountered so far that are even or odd.
        // Initialize even_count to 1 to account for the empty prefix sum (sum = 0, which is even)
        long long odd_count = 0;
        long long even_count = 1;

        // Stores the parity of the current prefix sum.
        // 0 for even, 1 for odd.
        int current_sum_parity = 0;

        // Stores the total count of subarrays with an odd sum.
        long long total_odd_subarrays = 0;

        // Iterate through each element of the array
        for (int num : arr) {
            // Update the parity of the current prefix sum.
            // If num is odd, the parity flips. If num is even, it stays the same.
            current_sum_parity = (current_sum_parity + (num % 2)) % 2;

            // If the current prefix sum's parity is odd (1):
            // A subarray ending at the current position will have an odd sum if its starting
            // prefix sum was even. The number of such even prefix sums encountered so far
            // is `even_count`.
            if (current_sum_parity == 1) {
                total_odd_subarrays = (total_odd_subarrays + even_count) % MOD;
                // Increment the count of odd prefix sums encountered.
                odd_count++;
            }
            // If the current prefix sum's parity is even (0):
            // A subarray ending at the current position will have an odd sum if its starting
            // prefix sum was odd. The number of such odd prefix sums encountered so far
            // is `odd_count`.
            else { // current_sum_parity == 0
                total_odd_subarrays = (total_odd_subarrays + odd_count) % MOD;
                // Increment the count of even prefix sums encountered.
                even_count++;
            }
        }

        // Return the total count of subarrays with an odd sum, modulo 10^9 + 7.
        return static_cast<int>(total_odd_subarrays);
    }
};
```