/**
 * @param {number[]} nums
 * @return {number}
 */
// Problem Summary: Calculate the maximum value of a rotation function F(k) for an array nums,
// where F(k) is the weighted sum of elements in the array rotated k times.
// Link: https://leetcode.com/problems/rotate-function/
//
// Approach:
// Let nums be the given array of length n.
// The rotation function F(k) is defined as:
// F(k) = 0 * arrk[0] + 1 * arrk[1] + ... + (n - 1) * arrk[n - 1]
//
// We can observe a relationship between F(k) and F(k+1).
// Let F(k) = sum(i * arrk[i]) for i from 0 to n-1.
//
// When we rotate the array by one position clockwise, arrk becomes arrk+1.
// If arrk = [a, b, c, d], then arrk+1 = [d, a, b, c].
//
// F(k) = 0*a + 1*b + 2*c + 3*d
// F(k+1) = 0*d + 1*a + 2*b + 3*c
//
// Let S be the sum of all elements in nums: S = a + b + c + d.
//
// Consider F(k+1) in terms of F(k):
// F(k+1) = (1*a + 2*b + 3*c) + 0*d
//
// We can rewrite F(k) as:
// F(k) = (0*a) + (1*b + 2*c + 3*d)
//
// Let's look at the difference F(k+1) - F(k):
// F(k+1) - F(k) = (0*d + 1*a + 2*b + 3*c) - (0*a + 1*b + 2*c + 3*d)
// F(k+1) - F(k) = (a + 2b + 3c) - (b + 2c + 3d)
// F(k+1) - F(k) = a + b + c - 3d
//
// This can be generalized. For F(k+1), each element arrk[i] moves to arrk+1[i-1] (with wrap-around for arrk[n-1]).
// The coefficient of arrk[i] in F(k) is i.
// The coefficient of arrk[i] in F(k+1) is (i-1) if i > 0, and (n-1) if i = 0.
//
// Let's consider the relationship:
// F(k+1) = F(k) - S + n * arrk[n-1]
//
// Proof:
// F(k)   = 0*arrk[0] + 1*arrk[1] + ... + (n-1)*arrk[n-1]
//
// arrk+1 = [arrk[n-1], arrk[0], arrk[1], ..., arrk[n-2]]
//
// F(k+1) = 0*arrk[n-1] + 1*arrk[0] + 2*arrk[1] + ... + (n-1)*arrk[n-2]
//
// Consider F(k+1) - F(k):
// F(k+1) - F(k) = [0*arrk[n-1] + 1*arrk[0] + 2*arrk[1] + ... + (n-1)*arrk[n-2]]
//                 - [0*arrk[0] + 1*arrk[1] + 2*arrk[2] + ... + (n-1)*arrk[n-1]]
//
// F(k+1) - F(k) = (1*arrk[0] - 0*arrk[0]) + (2*arrk[1] - 1*arrk[1]) + ... + ((n-1)*arrk[n-2] - (n-2)*arrk[n-2]) - (n-1)*arrk[n-1]
// F(k+1) - F(k) = arrk[0] + arrk[1] + ... + arrk[n-2] - (n-1)*arrk[n-1]
//
// We know that S = arrk[0] + arrk[1] + ... + arrk[n-2] + arrk[n-1]
// So, arrk[0] + arrk[1] + ... + arrk[n-2] = S - arrk[n-1]
//
// Substituting this back:
// F(k+1) - F(k) = (S - arrk[n-1]) - (n-1)*arrk[n-1]
// F(k+1) - F(k) = S - arrk[n-1] - n*arrk[n-1] + arrk[n-1]
// F(k+1) - F(k) = S - n*arrk[n-1]
//
// Rearranging, we get:
// F(k+1) = F(k) + S - n * arrk[n-1]
//
// The last element of arrk[n-1] in the formula for F(k+1) is actually the element at index 0 in the original array that has been rotated to the last position in arrk.
// To be more precise with indices:
// Let nums = [a0, a1, ..., an-1]
//
// F(0) = 0*a0 + 1*a1 + ... + (n-1)*an-1
//
// arr1 = [an-1, a0, a1, ..., an-2]
// F(1) = 0*an-1 + 1*a0 + 2*a1 + ... + (n-1)*an-2
//
// F(1) = F(0) - sum(ai) + n * an-1
//
// The general recurrence is:
// F(k+1) = F(k) - sum(nums) + n * nums[n-1-k]  where nums[n-1-k] is the element that "wraps around" to the beginning of the next rotation.
// This is incorrect. The formula F(k+1) = F(k) + S - n * arrk[n-1] is correct where arrk[n-1] is the element that moves from the last position to the first.
//
// Let's re-verify with indices.
// arrk represents the array rotated k times.
// arrk[j] is the element at index j after k rotations.
//
// arr0 = [nums[0], nums[1], ..., nums[n-1]]
// F(0) = sum(i * nums[i]) for i = 0 to n-1
//
// arr1 = [nums[n-1], nums[0], nums[1], ..., nums[n-2]]
// F(1) = 0*nums[n-1] + 1*nums[0] + 2*nums[1] + ... + (n-1)*nums[n-2]
//
// Sum S = sum(nums[i]) for i = 0 to n-1
//
// F(1) - F(0) = (0*nums[n-1] + 1*nums[0] + 2*nums[1] + ... + (n-1)*nums[n-2]) - (0*nums[0] + 1*nums[1] + ... + (n-1)*nums[n-1])
// F(1) - F(0) = (1*nums[0] - 0*nums[0]) + (2*nums[1] - 1*nums[1]) + ... + ((n-1)*nums[n-2] - (n-2)*nums[n-2]) - (n-1)*nums[n-1] + 0*nums[n-1]
// F(1) - F(0) = nums[0] + nums[1] + ... + nums[n-2] - (n-1)*nums[n-1]
// F(1) - F(0) = (S - nums[n-1]) - (n-1)*nums[n-1]
// F(1) - F(0) = S - nums[n-1] - n*nums[n-1] + nums[n-1]
// F(1) - F(0) = S - n*nums[n-1]
//
// Therefore, F(1) = F(0) + S - n * nums[n-1].
//
// In general, F(k+1) = F(k) + S - n * nums[n-1-k] (this is incorrect with the index of nums)
// The term that gets multiplied by (n-1) in F(k+1) is nums[n-2] and the term that gets multiplied by 0 in F(k+1) is nums[n-1].
// The term that was multiplied by (n-1) in F(k) was nums[n-1]. This term is now multiplied by 0.
// The term that was multiplied by i in F(k) is now multiplied by i+1 in F(k+1), except for the element that moves to index 0.
//
// Let's re-think the transformation from F(k) to F(k+1).
// F(k) = sum_{i=0}^{n-1} i * arrk[i]
// arrk+1 = [arrk[n-1], arrk[0], arrk[1], ..., arrk[n-2]]
//
// F(k+1) = sum_{i=0}^{n-1} i * arrk+1[i]
// F(k+1) = 0*arrk[n-1] + 1*arrk[0] + 2*arrk[1] + ... + (n-1)*arrk[n-2]
//
// Consider F(k+1) - F(k) again.
// F(k+1) - F(k) = (0*arrk[n-1] + 1*arrk[0] + 2*arrk[1] + ... + (n-1)*arrk[n-2])
//                 - (0*arrk[0] + 1*arrk[1] + 2*arrk[2] + ... + (n-1)*arrk[n-1])
//
// Group terms by arrk[i]:
// arrk[0]: 1*arrk[0] - 0*arrk[0] = arrk[0]
// arrk[1]: 2*arrk[1] - 1*arrk[1] = arrk[1]
// ...
// arrk[n-2]: (n-1)*arrk[n-2] - (n-2)*arrk[n-2] = arrk[n-2]
// arrk[n-1]: 0*arrk[n-1] - (n-1)*arrk[n-1] = -(n-1)*arrk[n-1]
//
// So, F(k+1) - F(k) = arrk[0] + arrk[1] + ... + arrk[n-2] - (n-1)*arrk[n-1]
// Since sum(arrk) = sum(nums) = S, we have:
// arrk[0] + arrk[1] + ... + arrk[n-2] = S - arrk[n-1]
//
// F(k+1) - F(k) = (S - arrk[n-1]) - (n-1)*arrk[n-1]
// F(k+1) - F(k) = S - arrk[n-1] - n*arrk[n-1] + arrk[n-1]
// F(k+1) - F(k) = S - n*arrk[n-1]
//
// F(k+1) = F(k) + S - n * arrk[n-1]
//
// This recurrence relation holds.
// arrk[n-1] is the element that was at index n-1 in arrk, which means it was at index (n-1 - k) % n in the original nums array.
// No, arrk[n-1] is the element at the last position of the array after k rotations.
// This means it's the element that has "wrapped around" from the end of the array in the previous rotation.
//
// Let's trace arrk[n-1]:
// arr0 = [nums[0], ..., nums[n-1]] => arr0[n-1] = nums[n-1]
// arr1 = [nums[n-1], nums[0], ..., nums[n-2]] => arr1[n-1] = nums[n-2]
// arr2 = [nums[n-2], nums[n-1], nums[0], ..., nums[n-3]] => arr2[n-1] = nums[n-3]
// ...
// arrk[n-1] = nums[n-1-k] (indices are modulo n, but for k < n, this is simpler)
//
// So the recurrence becomes:
// F(k+1) = F(k) + S - n * nums[n-1-k]  (for k from 0 to n-2)
//
// Algorithm:
// 1. Calculate the sum of all elements in nums (S).
// 2. Calculate F(0).
// 3. Initialize maxF = F(0).
// 4. Iterate from k = 0 to n-2:
//    a. Calculate F(k+1) using the recurrence: F(k+1) = F(k) + S - n * nums[n-1-k].
//    b. Update maxF = max(maxF, F(k+1)).
// 5. Return maxF.
//
// Special case: n = 1.
// If nums = [x], F(0) = 0 * x = 0. The loop won't run. So output is 0, which is correct.
//
// Example 1: nums = [4, 3, 2, 6], n = 4
// S = 4 + 3 + 2 + 6 = 15
//
// F(0) = 0*4 + 1*3 + 2*2 + 3*6 = 0 + 3 + 4 + 18 = 25
// maxF = 25
//
// k = 0:
// F(1) = F(0) + S - n * nums[n-1-0]
// F(1) = 25 + 15 - 4 * nums[3]
// F(1) = 25 + 15 - 4 * 6
// F(1) = 40 - 24 = 16
// maxF = max(25, 16) = 25
//
// k = 1:
// F(2) = F(1) + S - n * nums[n-1-1]
// F(2) = 16 + 15 - 4 * nums[2]
// F(2) = 31 - 4 * 2
// F(2) = 31 - 8 = 23
// maxF = max(25, 23) = 25
//
// k = 2:
// F(3) = F(2) + S - n * nums[n-1-2]
// F(3) = 23 + 15 - 4 * nums[1]
// F(3) = 38 - 4 * 3
// F(3) = 38 - 12 = 26
// maxF = max(25, 26) = 26
//
// Loop finishes. Return maxF = 26. This matches example 1.
//
// Time Complexity:
// - Calculating sum S: O(n)
// - Calculating F(0): O(n)
// - Iterating to calculate F(k+1) and update maxF: O(n)
// Total time complexity is O(n) + O(n) + O(n) = O(n).
//
// Space Complexity:
// - Storing S, F(0), maxF, and loop variables: O(1)
// Total space complexity is O(1).
//
// Implementation details:
// Need to handle the case where n=1 separately or ensure the loop condition is correct.
// The loop runs from k = 0 to n-2. If n=1, n-2 = -1, so the loop doesn't run. This is fine.
// The constraints state 1 <= n <= 10^5, so n=0 is not possible.
// The values in nums are between -100 and 100.
// The sum of elements S can be up to 10^5 * 100 = 10^7.
// F(0) can be up to sum(i * 100) ~ n^2 * 100. For n=10^5, this is too large.
// However, the problem states "The test cases are generated so that the answer fits in a 32-bit integer."
// This implies intermediate calculations might be okay or that values in nums are such that the max F is within limits.
// Let's recheck the range of F(0).
// If nums = [100, 100, ..., 100] (n=10^5)
// F(0) = 0*100 + 1*100 + ... + (n-1)*100 = 100 * (0 + 1 + ... + n-1) = 100 * n*(n-1)/2.
// For n=10^5, this is 100 * 10^5 * (10^5 - 1) / 2 which is approx 5 * 10^11. This is too large for 32-bit int.
//
// Let's consider the maximum possible value of n and the values in nums for F(k).
// F(k) = sum(i * arrk[i])
// The maximum value for arrk[i] is 100, the maximum for i is n-1.
// If nums = [-100, -100, ..., -100], F(0) = 0.
// If nums = [100, 100, ..., 100], F(0) = 100 * n*(n-1)/2.
//
// Ah, the problem statement says "The test cases are generated so that the answer fits in a 32-bit integer."
// This means the *maximum* value of F(k) will fit. Not necessarily intermediate F(k) values or sums.
// A 32-bit signed integer typically goes up to 2^31 - 1, which is about 2 * 10^9.
//
// Let's re-examine the recurrence F(k+1) = F(k) + S - n * arrk[n-1].
// S is sum of nums, which can be up to 10^7.
// n * arrk[n-1] can be up to 10^5 * 100 = 10^7.
// The difference F(k+1) - F(k) is at most S. So F values change by at most S.
// If F(0) is within limits, subsequent F(k) values should also be.
//
// Example: nums = [1000, -1000, 1000, -1000], n=4
// S = 0
// F(0) = 0*1000 + 1*(-1000) + 2*1000 + 3*(-1000) = -1000 + 2000 - 3000 = -2000
// maxF = -2000
//
// k=0:
// F(1) = F(0) + S - n * nums[3] = -2000 + 0 - 4 * (-1000) = -2000 + 4000 = 2000
// maxF = 2000
//
// k=1:
// F(2) = F(1) + S - n * nums[2] = 2000 + 0 - 4 * 1000 = 2000 - 4000 = -2000
// maxF = 2000
//
// k=2:
// F(3) = F(2) + S - n * nums[1] = -2000 + 0 - 4 * (-1000) = -2000 + 4000 = 2000
// maxF = 2000
//
// Result = 2000.
//
// The logic seems sound.

var maxRotateFunction = function(nums) {
    const n = nums.length;

    // Handle the edge case where n = 1. The only rotation F(0) will be 0.
    if (n === 1) {
        return 0;
    }

    // Calculate the sum of all elements in nums. This will be used in the recurrence relation.
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += nums[i];
    }

    // Calculate F(0), which is the initial rotation function value.
    // F(0) = 0 * nums[0] + 1 * nums[1] + ... + (n-1) * nums[n-1]
    let f0 = 0;
    for (let i = 0; i < n; i++) {
        f0 += i * nums[i];
    }

    // Initialize the maximum F value found so far with F(0).
    let maxF = f0;

    // Iterate through possible rotations (from F(1) to F(n-1)).
    // We use the recurrence relation: F(k+1) = F(k) + sum - n * nums[n-1-k]
    // Here, `currentF` represents F(k) in the iteration, and we calculate F(k+1).
    // The loop runs from k = 0 to n-2.
    // When k=0, we calculate F(1) using F(0).
    // When k=n-2, we calculate F(n-1) using F(n-2).
    let currentF = f0;
    for (let k = 0; k < n - 1; k++) {
        // Calculate the next F value using the recurrence relation.
        // currentF holds F(k).
        // The element that "moves" from the end to the beginning in the next rotation
        // is nums[n - 1 - k]. This element was at index n-1 in arrk.
        currentF = currentF + sum - n * nums[n - 1 - k];

        // Update the maximum F value if the current F is greater.
        if (currentF > maxF) {
            maxF = currentF;
        }
    }

    // Return the maximum value of F(k) found.
    return maxF;
};
