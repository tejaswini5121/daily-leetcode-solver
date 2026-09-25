/**
 * @summary Given a brace expansion expression, return the sorted list of unique words it represents.
 * @link https://leetcode.com/problems/brace-expansion-ii/
 * @approach The problem can be solved using a recursive approach with a stack.
 * We can parse the expression by iterating through it and using a stack to manage nested braces and comma-separated alternatives.
 * When we encounter a letter, we add it to the current string being built.
 * When we see an opening brace '{', we push the current state (current word and its alternatives) onto the stack and start a new state.
 * When we see a comma ',', it signifies an alternative within the current brace level. We add the completed word to the current set of alternatives and reset the current word.
 * When we see a closing brace '}', we finalize the current set of alternatives. If it's a simple letter, it's a single word. If it's a list of words, it's a union.
 * If the closing brace is followed by another expression (concatenation), we perform a cartesian product of the words from the previous expression and the current expression.
 * The recursion helps to handle nested structures and the cartesian product logic generates all possible combinations.
 * Finally, we sort the resulting set of unique words.
 *
 * Time Complexity: O(N * 2^N), where N is the number of characters in the expression. In the worst case, an expression like "{a,b}{c,d}...{y,z}" can lead to an exponential number of combinations. The recursive calls and set operations contribute to this complexity.
 * Space Complexity: O(N * 2^N), due to the recursion depth and the storage required for the intermediate and final sets of words, which can grow exponentially.
 */
const braceExpansionII = (expression) => {
    /**
     * Parses a sub-expression and returns a set of words.
     * @param {string} expr The sub-expression to parse.
     * @returns {Set<string>} A set of words represented by the sub-expression.
     */
    const parse = (expr) => {
        const result = new Set(); // Stores the set of words for the current sub-expression.
        let currentWord = ""; // Stores the word being built at the current level.
        const stack = []; // Stack to manage nested braces and alternatives.

        for (let i = 0; i < expr.length; i++) {
            const char = expr[i];

            if (char === '{') {
                // When we encounter an opening brace, push the current state onto the stack.
                // The state includes the current word and its list of alternatives (which is just the currentWord itself initially).
                stack.push({ word: currentWord, alternatives: new Set([currentWord]) });
                currentWord = ""; // Reset currentWord for the new nested level.
            } else if (char === '}') {
                // When we encounter a closing brace, we finalize the current level.
                let currentLevelAlternatives = new Set(); // Alternatives at the current brace level.

                // If currentWord is not empty, it means we have a simple word or concatenation within this brace.
                if (currentWord !== "") {
                    currentLevelAlternatives.add(currentWord);
                }

                // If the stack is not empty, we are closing a nested brace.
                if (stack.length > 0) {
                    const prevState = stack.pop(); // Get the previous state from the stack.
                    const previousWords = prevState.alternatives; // Words from the outer level.
                    const newCombinedWords = new Set(); // Words after combining with the current level's alternatives.

                    // Perform cartesian product if there are previous words and current level alternatives.
                    if (previousWords.size > 0 && currentLevelAlternatives.size > 0) {
                        for (const prevWord of previousWords) {
                            for (const currentAlt of currentLevelAlternatives) {
                                newCombinedWords.add(prevWord + currentAlt);
                            }
                        }
                        // Update currentWord to be the combined set of words.
                        // If currentWord was empty, we take the combined words. Otherwise, we merge.
                        currentWord = ""; // Reset currentWord as the result is now a set of words.
                        for (const word of newCombinedWords) {
                            currentLevelAlternatives.add(word);
                        }
                    } else if (previousWords.size > 0) {
                        // If only previous words exist, take those.
                        currentWord = ""; // Reset currentWord.
                        for (const word of previousWords) {
                            currentLevelAlternatives.add(word);
                        }
                    } else if (currentLevelAlternatives.size > 0) {
                        // If only current level alternatives exist, take those.
                        currentWord = ""; // Reset currentWord.
                        for (const word of currentLevelAlternatives) {
                            currentLevelAlternatives.add(word);
                        }
                    } else {
                        // If both are empty, the result is empty.
                        currentWord = "";
                    }

                    // Update the alternatives for the previous state.
                    prevState.alternatives = currentLevelAlternatives;
                    // If the stack is now empty, these are the final words for this part of the expression.
                    if (stack.length === 0) {
                        for (const word of prevState.alternatives) {
                            result.add(word);
                        }
                    } else {
                        // Otherwise, push the updated state back to the stack.
                        stack.push(prevState);
                    }
                } else {
                    // If stack is empty, this is the top-level brace.
                    for (const word of currentLevelAlternatives) {
                        result.add(word);
                    }
                    currentWord = ""; // Reset for potential further top-level concatenations.
                }
            } else if (char === ',') {
                // When we see a comma, it signifies an alternative within the current brace level.
                // If we are inside a brace (stack is not empty), add the currentWord to the alternatives of the top of the stack.
                if (stack.length > 0) {
                    const top = stack[stack.length - 1];
                    if (currentWord !== "") {
                        top.alternatives.add(currentWord);
                    }
                    currentWord = ""; // Reset currentWord for the next alternative.
                } else {
                    // If we are at the top level and encounter a comma, it's an error or not handled by this grammar interpretation directly.
                    // For this problem, commas are only within braces.
                }
            } else {
                // For a lowercase letter, append it to the currentWord.
                currentWord += char;
            }
        }

        // After iterating through the expression, if there's any remaining currentWord, add it to the result.
        if (currentWord !== "") {
            result.add(currentWord);
        }

        // If the stack is not empty, it means there are unclosed braces, which shouldn't happen with valid input.
        // However, if there are still items on the stack, it means they represent the final results after unions.
        while (stack.length > 0) {
            const lastState = stack.pop();
            for (const word of lastState.alternatives) {
                result.add(word);
            }
        }

        return result;
    };

    // The initial call to parse handles the entire expression.
    const wordSet = parse(expression);

    // Convert the set to an array and sort it lexicographically.
    return Array.from(wordSet).sort();
};