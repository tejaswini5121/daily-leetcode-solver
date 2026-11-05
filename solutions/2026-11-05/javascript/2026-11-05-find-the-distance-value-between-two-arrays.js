// Finds the number of elements in arr1 for which no element in arr2 is within distance d.
// Problem Link: https://leetcode.com/problems/find-the-distance-value-between-two-arrays/
//
// Approach:
// For each element in arr1, iterate through all elements in arr2.
// If for any element arr2[j], the absolute difference |arr1[i] - arr2[j]| is less than or equal to d,
// then arr1[i] does not contribute to the distance value.
// If after checking all elements in arr2, no such arr2[j] is found for arr1[i],
// then arr1[i] contributes to the distance value.
//
// Optimization: Sorting arr2 and using binary search can significantly improve performance.
// For each element `num1` in `arr1`, we want to find if there exists any `num2` in `arr2`
// such that `|num1 - num2| <= d`. This is equivalent to checking if `num1 - d <= num2 <= num1 + d`.
// If `arr2` is sorted, we can use binary search to efficiently find if any element in `arr2`
// falls within this range. We look for the insertion point for `num1 - d`. If this insertion point
// exists and the element at that index (or the preceding one if it's not an exact match)
// is within `num1 + d`, then `num1` is not counted.
//
// Time Complexity:
// If arr2 is not sorted: O(n*m), where n is the length of arr1 and m is the length of arr2.
// If arr2 is sorted: O(m log m + n log m), where m log m is for sorting arr2,
// and n log m is for performing binary search for each element in arr1.
//
// Space Complexity:
// O(1) if sorting is done in-place, or O(log m) or O(m) depending on the sorting algorithm used by the environment.
// For the binary search approach, we are not using any significant extra space beyond input storage.
//
// NOTE: The problem constraints are small (lengths up to 500), so the O(n*m) approach is acceptable.
// However, the binary search approach is more efficient and demonstrates better algorithmic practice.
// We will implement the binary search approach for better performance.

/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @param {number} d
 * @return {number}
 */
var findTheDistanceValue = function(arr1, arr2, d) {
    // Sort arr2 to enable efficient binary search.
    arr2.sort((a, b) => a - b);

    let distanceValue = 0; // Initialize the count of elements in arr1 that satisfy the condition.

    // Iterate through each element in arr1.
    for (const num1 of arr1) {
        let foundCloseElement = false; // Flag to check if a close element is found in arr2.

        // Define the search range for arr2: [num1 - d, num1 + d].
        const lowerBound = num1 - d;
        const upperBound = num1 + d;

        // Use binary search to find if any element in arr2 falls within the range [lowerBound, upperBound].
        // We are essentially looking for an element `num2` such that `num2 >= lowerBound` and `num2 <= upperBound`.

        // Find the index of the first element in arr2 that is greater than or equal to lowerBound.
        let left = 0;
        let right = arr2.length; // Use arr2.length as exclusive upper bound for 'right' pointer.
        let insertionPoint = arr2.length; // Initialize to arr2.length, indicating no element found >= lowerBound.

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (arr2[mid] >= lowerBound) {
                insertionPoint = mid; // Potential candidate found, try to find an earlier one.
                right = mid;
            } else {
                left = mid + 1; // arr2[mid] is too small, search in the right half.
            }
        }

        // After finding the potential insertion point (first element >= lowerBound),
        // check if this element is within the upper bound.
        // If insertionPoint is within the bounds of arr2 (i.e., < arr2.length)
        // AND the element at insertionPoint is less than or equal to upperBound,
        // it means we found an element arr2[j] such that |num1 - arr2[j]| <= d.
        if (insertionPoint < arr2.length && arr2[insertionPoint] <= upperBound) {
            foundCloseElement = true;
        }

        // If no close element was found in arr2 for the current num1, increment the distance value.
        if (!foundCloseElement) {
            distanceValue++;
        }
    }

    // Return the total count of elements in arr1 that have no element in arr2 within distance d.
    return distanceValue;
};
```