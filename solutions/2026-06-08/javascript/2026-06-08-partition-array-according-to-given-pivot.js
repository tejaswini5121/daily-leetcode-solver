// @leetCode: Partition Array According to Given Pivot
// @leetCodeLink: https://leetcode.com/problems/partition-array-according-to-given-pivot/
//
// Problem Summary:
// Rearrange an array such that elements smaller than the pivot come first,
// followed by elements equal to the pivot, and then elements greater than the pivot.
// The relative order within the smaller and greater partitions must be maintained.
//
// Approach:
// The problem requires maintaining the relative order of elements within partitions.
// A simple approach is to create three separate lists: one for elements smaller than the pivot,
// one for elements equal to the pivot, and one for elements greater than the pivot.
// We iterate through the input array `nums` and append each element to the
// corresponding list based on its comparison with the `pivot`.
// Finally, we concatenate these three lists in order (less, equal, greater)
// to form the rearranged array.
//
// Time Complexity:
// O(N), where N is the length of the `nums` array.
// We iterate through the array once to populate the three lists.
// Concatenating the lists also takes O(N) time in total.
//
// Space Complexity:
// O(N), where N is the length of the `nums` array.
// We use three auxiliary arrays to store the partitioned elements. In the worst case,
// all elements could fall into one of these lists, requiring O(N) space.

/**
 * @param {number[]} nums
 * @param {number} pivot
 * @return {number[]}
 */
var pivotArray = function(nums, pivot) {
    // Initialize three arrays to store elements based on their relation to the pivot.
    // 'less' will store elements smaller than pivot.
    // 'equal' will store elements equal to pivot.
    // 'greater' will store elements greater than pivot.
    const less = [];
    const equal = [];
    const greater = [];

    // Iterate through each number in the input array 'nums'.
    for (const num of nums) {
        // If the current number is less than the pivot, add it to the 'less' array.
        if (num < pivot) {
            less.push(num);
        }
        // If the current number is equal to the pivot, add it to the 'equal' array.
        else if (num === pivot) {
            equal.push(num);
        }
        // If the current number is greater than the pivot, add it to the 'greater' array.
        else {
            greater.push(num);
        }
    }

    // Concatenate the three arrays in the specified order: less, equal, then greater.
    // This ensures that all elements less than pivot appear before elements greater than pivot,
    // and elements equal to pivot are in between.
    // The relative order within 'less' and 'greater' arrays is preserved because
    // we used push() which appends elements in the order they were encountered.
    return less.concat(equal, greater);
};
