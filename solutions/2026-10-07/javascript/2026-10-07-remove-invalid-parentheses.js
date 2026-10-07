// Summary: Remove minimum invalid parentheses to make the string valid.
// Link: https://leetcode.com/problems/remove-invalid-parentheses/
// Approach: This problem can be solved using Breadth-First Search (BFS).
// We start with the original string in a queue. In each step, we explore all possible strings
// by removing one parenthesis at a time. We maintain a set of visited strings to avoid duplicates.
// When we find the first valid string, we know that all other valid strings found at the same BFS level
// will also be valid with the minimum number of removals. We continue exploring the current level
// to collect all such strings. If no valid string is found at a certain level and we have already
// found valid strings at the previous level, we stop.
//
// Time Complexity: O(N * 2^N) in the worst case. N is the length of the string.
// In each level of BFS, we might generate strings by removing a parenthesis.
// There are N possible positions to remove a parenthesis. In the worst case, we might explore
// many combinations. The check for validity takes O(N).
//
// Space Complexity: O(N * 2^N) in the worst case. This is due to storing visited strings
// and the strings in the queue.
const removeInvalidParentheses = (s) => {
    // Helper function to check if a string has valid parentheses
    const isValid = (str) => {
        let balance = 0;
        for (const char of str) {
            if (char === '(') {
                balance++;
            } else if (char === ')') {
                balance--;
            }
            // If balance drops below zero, it means a closing parenthesis appeared without an opening one
            if (balance < 0) {
                return false;
            }
        }
        // A valid string must have a balance of zero at the end
        return balance === 0;
    };

    // Queue for BFS, storing strings to process
    let queue = [s];
    // Set to keep track of visited strings to avoid redundant computations and duplicates
    let visited = new Set([s]);
    // Array to store the results (valid strings with minimum removals)
    let result = [];
    // Flag to indicate if we have found at least one valid string
    let foundValid = false;

    // Perform BFS
    while (queue.length > 0) {
        // Get the current level's size
        let levelSize = queue.length;
        // Process all strings at the current level
        for (let i = 0; i < levelSize; i++) {
            let currentString = queue.shift();

            // If the current string is valid, add it to the result
            if (isValid(currentString)) {
                result.push(currentString);
                // Set the flag to true, indicating we've found valid strings at this level
                foundValid = true;
            }

            // If we have already found valid strings, we don't need to explore further by removing more characters
            // from strings at this level, as we are looking for minimum removals.
            if (foundValid) {
                continue;
            }

            // Generate next possible strings by removing one parenthesis at a time
            for (let j = 0; j < currentString.length; j++) {
                let char = currentString[j];

                // Only consider removing parentheses
                if (char === '(' || char === ')') {
                    // Create a new string by removing the character at index j
                    let nextString = currentString.substring(0, j) + currentString.substring(j + 1);

                    // If this new string hasn't been visited yet
                    if (!visited.has(nextString)) {
                        // Add it to the queue for processing in the next level
                        queue.push(nextString);
                        // Mark it as visited
                        visited.add(nextString);
                    }
                }
            }
        }

        // If we found valid strings in this level, we can stop searching deeper
        // because any further removals would mean more than the minimum number of removals.
        if (foundValid) {
            break;
        }
    }

    // If no valid strings were found (e.g., input was ")("), return an empty string in a list.
    // The BFS will naturally handle this if no valid strings are produced.
    // However, if the input itself is invalid and cannot be made valid, the `result` array might be empty.
    // The problem statement for s = ")(" implies "" is the output.
    // If result is empty after BFS, it means even removing all parentheses didn't yield a valid string (which is rare given constraints)
    // or the only valid string requires removing all parentheses.
    // If the input string itself is empty, it's considered valid.
    // The BFS will naturally find the "" string if it's the only option.
    // For cases like ")(" where the only valid output is "", the BFS would eventually reach ""
    // and if it's valid, it will be added.
    // If no valid string is found after exhaustive search (which should not happen with valid inputs),
    // returning [""] is the correct behavior as per example 3.
    if (result.length === 0 && s.length === 0) {
        return [""];
    }
    if (result.length === 0) {
        // This case handles inputs like ")(" where the only valid result after minimum removals is ""
        // The BFS would have explored all possibilities and if no other valid string is found,
        // it means the only valid string is the empty string.
        // If the original string was all letters, it's already valid.
        // The BFS logic above correctly handles adding "" if it's a valid outcome.
        // If result is still empty, it implies that even removing all parentheses leads to an invalid state,
        // which is unlikely for the given constraints. However, if s was only invalid parentheses,
        // the BFS would eventually find "" which is valid.
        // The example ")(" -> [""] confirms this behavior.
        // The code will correctly push "" to result if it's valid and minimal.
        // If the loop finishes and result is empty, it means no valid string was formed.
        // This scenario is covered by the BFS finding "" if it's the minimal valid form.
        // For instance, if s = ")(", the BFS will explore:
        // ")(", ")", "(", "".
        // "" is valid. If "" is the only valid string at the minimal removal level, it will be added.
        return [""];
    }


    return result;
};
