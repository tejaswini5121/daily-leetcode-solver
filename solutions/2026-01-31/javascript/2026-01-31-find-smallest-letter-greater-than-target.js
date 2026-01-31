/**
 * @file LeetCode Problem 744: Find Smallest Letter Greater Than Target.
 * Given a sorted array of characters and a target character, find the smallest character in the array that is lexicographically greater than the target. If no such character exists, return the first character of the array.
 * @link https://leetcode.com/problems/find-smallest-letter-greater-than-target/
 * @approach We can use binary search to efficiently find the smallest character greater than the target.
 * We initialize two pointers, `left` and `right`, to the beginning and end of the `letters` array, respectively.
 * In each step of the binary search, we calculate the middle index `mid`.
 * If `letters[mid]` is less than or equal to `target`, it means the smallest character greater than `target` must be in the right half of the array, so we move `left` to `mid + 1`.
 * If `letters[mid]` is greater than `target`, it means `letters[mid]` is a potential candidate for the smallest character greater than `target`. We store this as a potential answer and try to find an even smaller character in the left half by moving `right` to `mid - 1`.
 * After the binary search loop finishes, `left` will point to the index of the smallest character greater than `target`.
 * If `left` goes beyond the array bounds (i.e., `left === letters.length`), it means no character in the array is greater than `target`, so we return the first character of the array as per the problem statement. Otherwise, we return `letters[left]`.
 * @timeComplexity O(log n), where n is the length of the `letters` array, due to the binary search.
 * @spaceComplexity O(1), as we only use a few variables for pointers and the result.
 */

/**
 * @param {character[]} letters
 * @param {character} target
 * @return {character}
 */
const smallestLetterGreaterThanTarget = function(letters, target) {
    // Initialize left and right pointers for binary search.
    let left = 0;
    let right = letters.length - 1;
    // Initialize result to the first character of the array.
    // This will be the default return value if no character is greater than target.
    let result = letters[0];

    // Perform binary search.
    while (left <= right) {
        // Calculate the middle index.
        const mid = Math.floor((left + right) / 2);

        // If the character at the middle index is less than or equal to the target,
        // it means the smallest character greater than target must be in the right half.
        if (letters[mid] <= target) {
            left = mid + 1;
        } else {
            // If the character at the middle index is greater than the target,
            // it's a potential candidate for our result.
            // We store it and try to find an even smaller character in the left half.
            result = letters[mid];
            right = mid - 1;
        }
    }

    // After the loop, `left` will point to the index of the smallest character
    // greater than `target`. If `left` is out of bounds, it means no such character
    // was found, and we return the initially set `result` (which is `letters[0]`).
    // Otherwise, `result` holds the correct smallest character found.
    return result;
};