/**
 * @param {number[]} nums
 * @return {number}
 */
/*
Problem Summary:
Given an integer array, find all integers 'k' that divide the array's length 'n' and allow the array to be sorted by partitioning it into subarrays of length 'k' and cyclically rotating each subarray independently.

Link: https://leetcode.com/problems/sum-of-sortable-integers/

Approach:
1. Iterate through all possible divisors 'k' of 'n'.
2. For each divisor 'k', check if it's possible to sort the array by partitioning and rotating.
3. To check if 'k' is sortable:
    a. Iterate through the array in chunks of size 'k'.
    b. For each chunk (subarray), determine the minimum and maximum values within that chunk.
    c. If any element in the original array that *should* be in this chunk (based on the sorted version of the entire array) falls outside the range [min_in_chunk, max_in_chunk], then 'k' is not sortable. This is because cyclic rotations can only rearrange elements within the chunk; they cannot change the set of values present in that chunk.
    d. If all chunks satisfy this condition, then 'k' is sortable.
4. Sum up all sortable 'k' values.

To efficiently check step 3c, we can create a sorted version of the original `nums` array. Then, for each chunk of size `k` in the original `nums` array, we compare the range of values in that chunk with the corresponding range of values in the sorted array.

Time Complexity:
- Finding divisors of n: O(sqrt(n)).
- For each divisor 'k':
    - Creating a sorted copy of nums: O(n log n).
    - Iterating through nums in chunks of size k: O(n).
    - For each chunk, finding min/max and comparing with sorted subarray: O(k) or O(1) if pre-calculated.
    - The dominant part for checking a single 'k' is O(n log n) if we sort `nums` for every `k`, or O(n) if we sort `nums` once and then process chunks.
Since we sort `nums` only once, the overall complexity is O(n log n + D * n), where D is the number of divisors of n. The number of divisors D is significantly less than n in most cases, and can be bounded. A loose upper bound for D is roughly O(n^(1/3)) on average, and worst case can be larger but still much smaller than n. For example, for n <= 10^5, the maximum number of divisors is for 75600 or 92400, which have 128 divisors.
Therefore, the overall time complexity is dominated by the initial sort and then iterating through divisors: O(n log n + n * D), which is practically O(n log n).

Space Complexity:
- Storing the sorted version of `nums`: O(n).
- Other variables: O(1).
Therefore, the space complexity is O(n).
*/
var sumOfSortableIntegers = function(nums) {
    const n = nums.length;
    let sumOfSortableK = 0;

    // Create a sorted version of nums to compare against.
    // This is done once to avoid repeated sorting.
    const sortedNums = [...nums].sort((a, b) => a - b);

    // Function to check if a subarray (chunk) can be sorted by cyclic rotation.
    // A subarray can be sorted by cyclic rotation if and only if
    // all elements that should belong to this sorted subarray are present within it.
    // In other words, the minimum and maximum values in the original chunk
    // must encompass the minimum and maximum values of the corresponding sorted chunk.
    const isChunkSortable = (startIndex, k) => {
        const subArray = nums.slice(startIndex, startIndex + k);
        const sortedSubArray = sortedNums.slice(startIndex, startIndex + k);

        const minOriginal = Math.min(...subArray);
        const maxOriginal = Math.max(...subArray);
        const minSorted = sortedSubArray[0];
        const maxSorted = sortedSubArray[k - 1];

        // For the chunk to be sortable, the set of numbers in the original chunk
        // must be the same as the set of numbers in the sorted chunk.
        // This implies that the min and max of the original chunk must fall
        // within the range of the sorted chunk's min and max.
        // If the original chunk contains numbers that should not be in this
        // sorted position (i.e., numbers smaller than minSorted or larger than maxSorted),
        // then no amount of cyclic rotation can fix it.
        return minOriginal >= minSorted && maxOriginal <= maxSorted;
    };

    // Iterate through all possible divisors 'k' of 'n'.
    // We only need to check divisors up to sqrt(n) and their corresponding pairs.
    for (let k = 1; k * k <= n; k++) {
        if (n % k === 0) {
            // Check k as a sortable integer
            if (checkSortable(n, k, nums, sortedNums, isChunkSortable)) {
                sumOfSortableK += k;
            }

            // If k*k != n, then n/k is another distinct divisor. Check it.
            if (k * k !== n) {
                const k2 = n / k;
                if (checkSortable(n, k2, nums, sortedNums, isChunkSortable)) {
                    sumOfSortableK += k2;
                }
            }
        }
    }

    return sumOfSortableK;
};

// Helper function to check if a given divisor 'k' is sortable.
const checkSortable = (n, k, nums, sortedNums, isChunkSortableFunc) => {
    // Partition nums into consecutive subarrays of length k.
    // Check if each subarray can be cyclically rotated to match its
    // corresponding sorted subarray.
    for (let i = 0; i < n; i += k) {
        if (!isChunkSortableFunc(i, k)) {
            // If any chunk is not sortable, then k is not sortable.
            return false;
        }
    }
    // If all chunks are sortable, then k is sortable.
    return true;
};
