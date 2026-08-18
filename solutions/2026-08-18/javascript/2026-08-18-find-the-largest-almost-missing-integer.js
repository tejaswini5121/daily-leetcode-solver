// Problem: Find the Largest Almost Missing Integer
// Link: https://leetcode.com/problems/find-the-largest-almost-missing-integer/
//
// Approach:
// We need to count the occurrences of each number within all possible subarrays of size k.
// A hash map (or an array since the numbers are small) can be used to store the count of subarrays each number appears in.
// We iterate through all subarrays of size k. For each subarray, we use a set to keep track of the unique numbers within that subarray.
// Then, for each unique number in the subarray, we increment its count in our main count map.
// Finally, we iterate through our count map to find the largest number that has a count of exactly 1.
//
// Time Complexity: O(n * k) where n is the length of nums.
// We have n - k + 1 subarrays of size k. For each subarray, we iterate through its k elements.
// Inside the inner loop, set insertion and map updates take amortized O(1) time.
// In the worst case, if all elements are unique in each window, the set creation could take O(k).
// Then, we iterate through the unique elements in the window (at most k) to update the global counts.
// So, the overall time is roughly (n - k + 1) * k. Given the constraints, n <= 50, k <= 50, this is efficient.
// A more precise analysis: There are n-k+1 windows. For each window, we iterate k elements. For each element, we add to a set (O(1) on average) and then iterate through the unique elements in the set (at most k) to update counts.
// So, it's O((n-k+1) * k) for processing windows. The final scan of the counts is O(max_num), which is at most 51.
//
// Space Complexity: O(max_num) where max_num is the maximum possible value of a number in nums (50 in this case).
// We use a frequency map (or array) to store counts for numbers up to 50.
// We also use a set for each window to store unique elements, which can store up to k elements. However, this set is recreated for each window.
// The dominant space complexity comes from the frequency map.

function largestAlmostMissingInteger(nums: number[], k: number): number {
    // Use a map to store the count of subarrays each number appears in.
    // The key is the number, and the value is the number of subarrays it has appeared in.
    // Since numbers are constrained to 0-50, we can also use an array of size 51 for counts.
    const counts = new Map<number, number>();

    // Iterate through all possible subarrays of size k.
    // The starting index `i` goes from 0 up to `nums.length - k`.
    for (let i = 0; i <= nums.length - k; i++) {
        // For each subarray, we need to find the unique numbers within it.
        // Using a Set ensures we only count each number once per subarray.
        const currentSubarrayUniqueNums = new Set<number>();

        // Iterate through the elements of the current subarray.
        for (let j = 0; j < k; j++) {
            const num = nums[i + j];
            // Add the number to the set of unique numbers for this subarray.
            currentSubarrayUniqueNums.add(num);
        }

        // Now, for each unique number found in this subarray, increment its global count.
        for (const num of currentSubarrayUniqueNums) {
            // Get the current count for this number, defaulting to 0 if it's not in the map yet.
            const currentCount = counts.get(num) || 0;
            // Increment the count and update the map.
            counts.set(num, currentCount + 1);
        }
    }

    // After counting occurrences in all subarrays, find the largest number with a count of exactly 1.
    let largestAlmostMissing = -1;

    // Iterate through the map entries.
    for (const [num, count] of counts.entries()) {
        // If a number appears in exactly one subarray:
        if (count === 1) {
            // Update `largestAlmostMissing` if this number is larger than the current largest.
            if (num > largestAlmostMissing) {
                largestAlmostMissing = num;
            }
        }
    }

    // Return the largest almost missing integer found, or -1 if none exists.
    return largestAlmostMissing;
}
;