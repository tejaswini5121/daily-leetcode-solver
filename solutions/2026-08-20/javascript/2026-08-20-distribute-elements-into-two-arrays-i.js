// Distribute Elements Into Two Arrays I
// LeetCode: https://leetcode.com/problems/distribute-elements-into-two-arrays-i/
//
// Approach:
// The problem describes a simulation process. We need to maintain two arrays, arr1 and arr2,
// and follow a specific set of rules to distribute elements from the input array 'nums'.
//
// 1. Initialization:
//    - Create two empty arrays: arr1 and arr2.
//
// 2. First Two Operations:
//    - The first element of nums (nums[0] in 0-indexed) is always appended to arr1.
//    - The second element of nums (nums[1] in 0-indexed) is always appended to arr2.
//
// 3. Subsequent Operations (from the 3rd element onwards):
//    - For each remaining element in nums (starting from nums[2]):
//      - Compare the last element of arr1 with the last element of arr2.
//      - If the last element of arr1 is greater, append the current nums element to arr1.
//      - Otherwise (if the last element of arr2 is greater or equal), append the current nums element to arr2.
//
// 4. Result:
//    - After processing all elements in nums, concatenate arr1 and arr2 to form the final result array.
//
// Time Complexity Analysis:
// The algorithm iterates through the input array 'nums' exactly once.
// For each element, we perform a constant number of operations (comparisons and appends).
// Appending to a JavaScript array typically takes amortized O(1) time.
// Concatenating the two arrays at the end takes O(N) time, where N is the total number of elements.
// Therefore, the overall time complexity is O(N), where N is the length of nums.
//
// Space Complexity Analysis:
// We are creating two new arrays, arr1 and arr2, to store the distributed elements.
// In the worst case, all elements might end up in one of the arrays.
// The total space used by these two arrays will be proportional to the number of elements in 'nums'.
// Therefore, the space complexity is O(N), where N is the length of nums.

var distributeElements = function(nums) {
    // Initialize arr1 and arr2
    const arr1 = [];
    const arr2 = [];

    // Handle the first two operations as specified
    // The problem statement is 1-indexed, but JavaScript arrays are 0-indexed.
    // So, nums[1] in problem statement corresponds to nums[0] in JS.
    // And nums[2] in problem statement corresponds to nums[1] in JS.
    arr1.push(nums[0]);
    arr2.push(nums[1]);

    // Iterate through the rest of the elements starting from the 3rd element (index 2)
    for (let i = 2; i < nums.length; i++) {
        // Get the last elements of arr1 and arr2 for comparison
        const lastArr1 = arr1[arr1.length - 1];
        const lastArr2 = arr2[arr2.length - 1];

        // Compare the last elements and append to the appropriate array
        if (lastArr1 > lastArr2) {
            arr1.push(nums[i]);
        } else {
            arr2.push(nums[i]);
        }
    }

    // Concatenate arr1 and arr2 to form the result array
    // The spread syntax (...) is used here for concatenation, which is equivalent to arr1.concat(arr2)
    const result = [...arr1, ...arr2];

    // Return the final result array
    return result;
};
```