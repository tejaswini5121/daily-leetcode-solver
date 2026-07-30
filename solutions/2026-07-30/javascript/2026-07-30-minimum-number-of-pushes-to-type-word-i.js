/**
 * @file LeetCode problem: Minimum Number of Pushes to Type Word I
 * @summary Calculates the minimum number of key presses required to type a given word by remapping telephone keys.
 * @link https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-i/
 *
 * Approach:
 * The problem states that all letters in `word` are distinct. This means we can assign each letter to a unique key press count.
 * To minimize the total number of pushes, we should assign the most frequent letters (which are all effectively occurring once here as they are distinct) to keys that require fewer pushes.
 * Telephone keys 2 through 9 can be used. Key 2 can be mapped to up to 1 letter (1 push), key 3 to up to 2 letters (1 or 2 pushes), key 4 to up to 3 letters (1, 2, or 3 pushes), and so on.
 * This suggests a greedy approach:
 * 1. Determine the number of distinct letters in `word`. Let this be `n`.
 * 2. Assign the first 8 letters to keys requiring 1 push (keys 2-9).
 * 3. Assign the next 8 letters to keys requiring 2 pushes.
 * 4. Assign the next 8 letters to keys requiring 3 pushes.
 *
 * Since `word.length` is at most 26, and all letters are distinct:
 * - The first 8 letters will contribute 1 push each.
 * - The next 8 letters (from 9th to 16th) will contribute 2 pushes each.
 * - The remaining letters (from 17th to 26th) will contribute 3 pushes each.
 *
 * We can iterate through the letters of the word and assign them to keys in this prioritized manner.
 *
 * Example: word = "xycdefghij" (length 10)
 * - 'x' -> 1 push (key 2)
 * - 'y' -> 2 pushes (key 2)
 * - 'c' -> 1 push (key 3)
 * - 'd' -> 2 pushes (key 3)
 * - 'e' -> 1 push (key 4)
 * - 'f' -> 1 push (key 5)
 * - 'g' -> 1 push (key 6)
 * - 'h' -> 1 push (key 7)
 * - 'i' -> 1 push (key 8)
 * - 'j' -> 1 push (key 9)
 *
 * Total pushes: 1 + 2 + 1 + 2 + 1 + 1 + 1 + 1 + 1 + 1 = 12
 *
 * This pattern holds:
 * - Letters 1-8: 1 push each
 * - Letters 9-16: 2 pushes each
 * - Letters 17-26: 3 pushes each
 *
 * Time Complexity: O(N), where N is the length of the word. We iterate through the word once.
 * Space Complexity: O(1), as we only use a few variables to store the total pushes and the current push count.
 */

/**
 * @param {string} word
 * @return {number}
 */
var minimumPushes = function(word) {
    // Get the number of letters in the word. Since all letters are distinct, this is the number of unique characters.
    const n = word.length;

    // Initialize the total number of pushes to 0.
    let totalPushes = 0;

    // We have keys 2-9 available, which can be used to map letters.
    // Key 2 can map 1 letter (1 push).
    // Key 3 can map 2 letters (1 or 2 pushes).
    // Key 4 can map 3 letters (1, 2, or 3 pushes).
    // And so on, up to key 9.

    // The strategy is to assign the first 8 letters to keys requiring 1 push.
    // The next 8 letters to keys requiring 2 pushes.
    // The remaining letters to keys requiring 3 pushes.

    // If the word has 8 or fewer letters, all will require 1 push.
    if (n <= 8) {
        totalPushes = n * 1;
    }
    // If the word has between 9 and 16 letters (inclusive).
    // The first 8 letters take 8 * 1 = 8 pushes.
    // The remaining (n - 8) letters take (n - 8) * 2 pushes.
    else if (n <= 16) {
        totalPushes = (8 * 1) + ((n - 8) * 2);
    }
    // If the word has between 17 and 26 letters (inclusive).
    // The first 8 letters take 8 * 1 = 8 pushes.
    // The next 8 letters (from 9 to 16) take 8 * 2 = 16 pushes.
    // The remaining (n - 16) letters take (n - 16) * 3 pushes.
    else { // n > 16, and since max length is 26, n will be between 17 and 26.
        totalPushes = (8 * 1) + (8 * 2) + ((n - 16) * 3);
    }

    // Return the calculated minimum number of pushes.
    return totalPushes;
};
```