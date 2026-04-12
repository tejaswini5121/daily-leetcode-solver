/**
 * @summary Calculates the minimum distance to type a word using two fingers on a virtual keyboard.
 * @link https://leetcode.com/problems/minimum-distance-to-type-a-word-using-two-fingers/
 *
 * @approach
 * This problem can be solved using dynamic programming. We need to keep track of the positions of both fingers after typing each character.
 * The state of our DP will involve the index of the character in the `word` we are currently typing, and the positions of the two fingers.
 * Since the keyboard layout is fixed and the positions are represented by uppercase letters, we can precompute the coordinates of each letter.
 *
 * Let `dp[i][finger1_char_idx][finger2_char_idx]` represent the minimum distance to type the first `i` characters of `word`,
 * with `finger1` ending on the character at `finger1_char_idx` (or a special value if not used yet) and `finger2` ending on the character
 * at `finger2_char_idx` (or a special value if not used yet).
 *
 * The special value (e.g., -1) can represent a finger being free (not having typed any character yet).
 *
 * The transitions would involve considering which finger types the `i`-th character:
 * 1. Finger 1 types `word[i]`: The previous state would be `dp[i-1][prev_finger1_char_idx][finger2_char_idx]`. The cost added is the distance
 *    between `prev_finger1_char_idx` and `word[i]`. `finger1_char_idx` becomes `word[i]`.
 * 2. Finger 2 types `word[i]`: The previous state would be `dp[i-1][finger1_char_idx][prev_finger2_char_idx]`. The cost added is the distance
 *    between `prev_finger2_char_idx` and `word[i]`. `finger2_char_idx` becomes `word[i]`.
 *
 * The base case would be `dp[0][initial_finger1_pos][initial_finger2_pos] = 0`. However, since the initial positions are free, we can
 * consider typing the first character with either finger.
 *
 * A more refined DP state: `dp[i][char1_idx][char2_idx]` where `i` is the index of the character to be typed next (from 0 to `word.length`),
 * `char1_idx` is the index of the character that finger 1 is currently on (or 26 if it's free/uninitialized), and `char2_idx` is the index
 * of the character that finger 2 is currently on (or 26 if it's free/uninitialized).
 *
 * `dp[i][pos1][pos2]` = minimum cost to type `word[i:]` given that finger 1 is at `pos1` and finger 2 is at `pos2`.
 *
 * The base case: `dp[word.length][pos1][pos2] = 0` for any `pos1`, `pos2`.
 *
 * For `dp[i][pos1][pos2]`:
 * Let `currentChar = word[i]`.
 *
 * Option 1: Finger 1 types `currentChar`.
 *   `new_pos1 = currentChar_idx`.
 *   `cost1 = distance(pos1, currentChar_idx) + dp[i+1][new_pos1][pos2]`
 *
 * Option 2: Finger 2 types `currentChar`.
 *   `new_pos2 = currentChar_idx`.
 *   `cost2 = distance(pos2, currentChar_idx) + dp[i+1][pos1][new_pos2]`
 *
 * `dp[i][pos1][pos2] = min(cost1, cost2)`
 *
 * We need to handle the initial state where fingers are free. We can represent a free finger by an index of 26.
 * The initial call would be `solve(0, 26, 26)`.
 *
 * Let's define the keyboard layout:
 * 'A': (0,0), 'B': (0,1), 'C': (0,2), 'D': (0,3), 'E': (0,4),
 * 'F': (1,0), 'G': (1,1), 'H': (1,2), 'I': (1,3), 'J': (1,4),
 * 'K': (2,0), 'L': (2,1),
 * 'M': (3,0), 'N': (3,1), 'O': (3,2), 'P': (3,3),
 * 'Q': (4,0), 'R': (4,1), 'S': (4,2), 'T': (4,3), 'U': (4,4),
 * 'V': (5,0), 'W': (5,1), 'X': (5,2), 'Y': (5,3), 'Z': (5,4).
 *
 * The coordinates can be stored in a map or an array.
 *
 * `keyboard_coords = {
 *   'A': [0,0], 'B': [0,1], 'C': [0,2], 'D': [0,3], 'E': [0,4],
 *   'F': [1,0], 'G': [1,1], 'H': [1,2], 'I': [1,3], 'J': [1,4],
 *   'K': [2,0], 'L': [2,1],
 *   'M': [3,0], 'N': [3,1], 'O': [3,2], 'P': [3,3],
 *   'Q': [4,0], 'R': [4,1], 'S': [4,2], 'T': [4,3], 'U': [4,4],
 *   'V': [5,0], 'W': [5,1], 'X': [5,2], 'Y': [5,3], 'Z': [5,4]
 * };`
 *
 * `dist(char1, char2)` function calculates Manhattan distance between two characters.
 *
 * `memo` table will store results for `solve(char_idx, finger1_char_idx, finger2_char_idx)`.
 * `char_idx`: index in `word` we are trying to type.
 * `finger1_char_idx`: index in alphabet (0-25) of the character finger 1 is on. 26 for free.
 * `finger2_char_idx`: index in alphabet (0-25) of the character finger 2 is on. 26 for free.
 *
 * The state space is `word.length * 27 * 27`.
 *
 * @time_complexity O(N * M^2), where N is the length of the word and M is the number of possible keyboard positions (26 for uppercase letters + 1 for free).
 * This is because the DP table has dimensions approximately N * 27 * 27, and each state takes constant time to compute.
 *
 * @space_complexity O(N * M^2) for the memoization table.
 */
const minDistance = function(word) {
    // Precompute keyboard coordinates for quick lookup.
    const keyboard = {};
    let charCode = 'A'.charCodeAt(0);
    for (let r = 0; r < 6; r++) {
        if (r === 0) for (let c = 0; c < 5; c++) keyboard[String.fromCharCode(charCode++)] = [r, c];
        else if (r === 1) for (let c = 0; c < 5; c++) keyboard[String.fromCharCode(charCode++)] = [r, c];
        else if (r === 2) for (let c = 0; c < 2; c++) keyboard[String.fromCharCode(charCode++)] = [r, c];
        else if (r === 3) for (let c = 0; c < 4; c++) keyboard[String.fromCharCode(charCode++)] = [r, c];
        else if (r === 4) for (let c = 0; c < 5; c++) keyboard[String.fromCharCode(charCode++)] = [r, c];
        else if (r === 5) for (let c = 0; c < 5; c++) keyboard[String.fromCharCode(charCode++)] = [r, c];
    }

    // Helper function to calculate Manhattan distance between two characters.
    // If a character index is 26, it means the finger is free/uninitialized.
    const calculateDistance = (char1Idx, char2Idx) => {
        if (char1Idx === 26 || char2Idx === 26) return 0; // No cost if one finger is free.
        const [x1, y1] = keyboard[String.fromCharCode(char1Idx + 'A'.charCodeAt(0))];
        const [x2, y2] = keyboard[String.fromCharCode(char2Idx + 'A'.charCodeAt(0))];
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    };

    // Memoization table: memo[charIdx][finger1Idx][finger2Idx]
    // charIdx: current character index in 'word' to be typed (0 to word.length)
    // finger1Idx: index of the character finger 1 is currently on (0-25 for 'A'-'Z', 26 for free)
    // finger2Idx: index of the character finger 2 is currently on (0-25 for 'A'-'Z', 26 for free)
    const memo = new Array(word.length + 1).fill(null).map(() =>
        Array(27).fill(null).map(() => Array(27).fill(-1))
    );

    // Recursive function with memoization to find the minimum distance.
    // charIdx: The index of the character in 'word' we are about to type.
    // finger1Pos: The character index (0-25) of where finger 1 is currently located, or 26 if it's free.
    // finger2Pos: The character index (0-25) of where finger 2 is currently located, or 26 if it's free.
    const solve = (charIdx, finger1Pos, finger2Pos) => {
        // Base case: If we have typed all characters, the cost is 0.
        if (charIdx === word.length) {
            return 0;
        }

        // If the result for this state is already computed, return it.
        if (memo[charIdx][finger1Pos][finger2Pos] !== -1) {
            return memo[charIdx][finger1Pos][finger2Pos];
        }

        const currentChar = word[charIdx];
        const currentCharIdx = currentChar.charCodeAt(0) - 'A'.charCodeAt(0);

        let minCost = Infinity;

        // Option 1: Finger 1 types the current character.
        // The cost is the distance from finger1's previous position to the current character,
        // plus the minimum cost to type the rest of the word with finger 1 now on the current character.
        const cost1 = calculateDistance(finger1Pos, currentCharIdx) + solve(charIdx + 1, currentCharIdx, finger2Pos);
        minCost = Math.min(minCost, cost1);

        // Option 2: Finger 2 types the current character.
        // The cost is the distance from finger2's previous position to the current character,
        // plus the minimum cost to type the rest of the word with finger 2 now on the current character.
        const cost2 = calculateDistance(finger2Pos, currentCharIdx) + solve(charIdx + 1, finger1Pos, currentCharIdx);
        minCost = Math.min(minCost, cost2);

        // Store the computed minimum cost in the memo table.
        memo[charIdx][finger1Pos][finger2Pos] = minCost;
        return minCost;
    };

    // Start the recursion. Initially, both fingers are free (represented by 26).
    return solve(0, 26, 26);
};
```