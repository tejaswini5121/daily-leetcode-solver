// Problem: Rank Transform of an Array
// Link: https://leetcode.com/problems/rank-transform-of-an-array/
// Approach:
// 1. Create a sorted copy of the input array `arr` to determine the order of elements.
// 2. Use a Map to store the rank for each unique element. Iterate through the sorted array.
//    For each unique element, assign it a rank starting from 1 and incrementing for each new unique element encountered.
// 3. Iterate through the original array `arr` and replace each element with its corresponding rank from the Map.
// Time Complexity: O(N log N) due to sorting the array. Map operations (insertion and lookup) are O(1) on average.
// Space Complexity: O(N) to store the sorted array and the rank map.
/**
 * @param {number[]} arr
 * @return {number[]}
 */
var arrayRankTransform = function(arr) {
    // If the input array is empty, return an empty array.
    if (arr.length === 0) {
        return [];
    }

    // Create a sorted copy of the original array.
    // This will help us determine the rank of each element.
    const sortedArr = [...arr].sort((a, b) => a - b);

    // Use a Map to store the rank of each unique number.
    // The key will be the number, and the value will be its rank.
    const rankMap = new Map();

    // Initialize the rank counter. Ranks start from 1.
    let rank = 1;

    // Iterate through the sorted array to populate the rankMap.
    for (const num of sortedArr) {
        // If the number is not already in the map, assign it the current rank.
        // This ensures that duplicate numbers get the same rank.
        if (!rankMap.has(num)) {
            rankMap.set(num, rank);
            // Increment the rank for the next unique number.
            rank++;
        }
    }

    // Create the result array by mapping each element in the original array to its rank.
    // The `map` function iterates through `arr` and for each element `num`,
    // it looks up its rank in `rankMap` and returns it.
    const result = arr.map(num => rankMap.get(num));

    // Return the array with ranks transformed.
    return result;
};
```