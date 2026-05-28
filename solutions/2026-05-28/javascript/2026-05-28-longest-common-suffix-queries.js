/**
 * @summary Finds the index of a string in `wordsContainer` that has the longest common suffix with each string in `wordsQuery`.
 * If multiple strings share the longest common suffix, select the shortest one. If lengths are tied, select the one with the smallest index.
 * @link https://leetcode.com/problems/longest-common-suffix-queries/
 *
 * @approach
 * The problem requires finding the longest common suffix and then applying tie-breaking rules (shortest length, then smallest index).
 * A Trie data structure is well-suited for suffix-based operations. To efficiently handle common suffixes, we can build a Trie
 * using the reversed strings from `wordsContainer`.
 *
 * For each string in `wordsContainer`, we reverse it and insert it into the Trie. Each node in the Trie will store
 * information about the original strings that pass through it. Specifically, for each node, we want to track the index
 * and length of the *shortest* string that has the suffix represented by the path to that node. This is because if multiple
 * strings share a common suffix, we prefer the shortest one.
 *
 * When processing `wordsQuery`, we also reverse each query string. Then, we traverse the Trie. For each character in the reversed
 * query string, we move down the Trie. If at any point we cannot move further in the Trie (i.e., the corresponding child node
 * doesn't exist), it means the common suffix ends there. The information stored at the *last valid node* reached in the Trie
 * will give us the best candidate (longest common suffix found so far, shortest length, and smallest index).
 *
 * We need to maintain the best candidate found for each query. The "best" candidate is determined by:
 * 1. Longest common suffix length (implicitly handled by Trie traversal depth).
 * 2. Smallest length of the string from `wordsContainer`.
 * 3. Smallest original index in `wordsContainer`.
 *
 * Let's refine the Trie node structure and insertion/query process:
 *
 * Trie Node:
 * Each node will have:
 *   - `children`: An array of 26 pointers (for 'a' through 'z').
 *   - `bestMatch`: An object { index: number, length: number } representing the best match encountered so far for any suffix ending at this node.
 *     - `index`: The original index of the string in `wordsContainer`.
 *     - `length`: The length of that string.
 *     Initially, `bestMatch` can be { index: -1, length: Infinity }.
 *
 * Insertion (`insert(reversedWord, originalIndex, originalLength)`):
 * 1. Start from the root.
 * 2. For each character in `reversedWord`:
 *    a. Get the character's index (e.g., `char.charCodeAt(0) - 'a'.charCodeAt(0)`).
 *    b. If the child node for this character doesn't exist, create it.
 *    c. Move to the child node.
 *    d. Update the `bestMatch` at the current node. If the current node's `bestMatch` is worse than the `originalWord` (i.e., `originalLength` is smaller, or `originalLength` is the same and `originalIndex` is smaller), update `bestMatch`.
 *       The "worse" condition needs careful definition. A candidate is *better* if it's shorter, or if it has the same length but a smaller index. So, we update `bestMatch` if the new word is *better* than the current `bestMatch`.
 *       `new_word_is_better = originalLength < currentNode.bestMatch.length || (originalLength === currentNode.bestMatch.length && originalIndex < currentNode.bestMatch.index)`
 *       If `new_word_is_better`, update `currentNode.bestMatch = { index: originalIndex, length: originalLength }`.
 *
 * Query (`query(reversedQueryWord)`):
 * 1. Initialize `bestQueryResult = { index: -1, length: Infinity }`. This will store the best match found for the entire query.
 * 2. Start from the root.
 * 3. For each character in `reversedQueryWord`:
 *    a. Get the character's index.
 *    b. If the child node for this character does not exist, break the loop. The longest common suffix has been found up to the previous character.
 *    c. Move to the child node.
 *    d. The `bestMatch` at the current node represents the best candidate string from `wordsContainer` that shares the suffix up to this point.
 *    e. Compare the current node's `bestMatch` with `bestQueryResult`. Update `bestQueryResult` if the current node's `bestMatch` is *better* (shorter length, or same length and smaller index).
 *       `current_node_best_is_better = currentNode.bestMatch.length < bestQueryResult.length || (currentNode.bestMatch.length === bestQueryResult.length && currentNode.bestMatch.index < bestQueryResult.index)`
 *       If `current_node_best_is_better`, update `bestQueryResult = currentNode.bestMatch`.
 * 4. After the loop (either fully traversed or broken), `bestQueryResult.index` is the answer for this query.
 *
 * Handling edge cases:
 * - If no common suffix is found (i.e., the Trie traversal breaks immediately or the root's bestMatch is not updated), the problem statement implies that an empty suffix is always common. In this case, we need to find the string with the smallest length from `wordsContainer` (and smallest index if lengths are tied). This can be pre-calculated or handled during Trie construction/query.
 *   A simpler way: if `bestQueryResult` remains `{ index: -1, length: Infinity }` after traversal, it means no common suffix beyond the empty string was found. The problem states "the longest common suffix is "", that is shared with strings at index 0, 1, and 2. Among these, the answer is the string at index 1 because it has the shortest length of 3." This implies that even for queries with no common suffix, we still look for the best match among *all* strings.
 *   The `bestMatch` stored at the root node (after all insertions) implicitly captures the overall best match if no specific suffix is found. If the query traversal breaks early, the last `bestMatch` we encountered from a valid node is our candidate. If the query traversal goes all the way to the end, the `bestMatch` of the final node is our candidate.
 *   Let's refine the query to ensure we always have a valid fallback:
 *   Initialize `bestQueryResult = { index: -1, length: Infinity }`.
 *   Traverse the Trie. At each node, if `currentNode.bestMatch.index !== -1`, compare it with `bestQueryResult` and update `bestQueryResult` if it's a better candidate.
 *   After the loop, if `bestQueryResult.index === -1`, it means no non-empty common suffix was found. In this scenario, the *actual* best match (considering empty suffix) must be the string that resulted in the `bestMatch` at the root of the Trie.
 *   This suggests that the `bestMatch` at the root should be initialized to reflect the overall best string in `wordsContainer`. Let's precompute this.
 *
 * Precomputing overall best match for empty suffix:
 * Iterate through `wordsContainer`. Keep track of the `minLenIndex = { index: -1, length: Infinity }`.
 * For each `wordsContainer[i]`, if `wordsContainer[i].length < minLenIndex.length` or (`wordsContainer[i].length === minLenIndex.length` and `i < minLenIndex.index`), update `minLenIndex`.
 * This `minLenIndex` should be used as the initial `bestMatch` for the root of the Trie, and also as the fallback if `bestQueryResult` remains uninitialized.
 *
 * Revised Trie Node and Logic:
 *
 * Trie Node:
 *   - `children`: `Array(26)` initialized to `null`.
 *   - `bestMatch`: `{ index: number, length: number }`. Stores the best match found for suffixes *ending* at this node.
 *
 * Global variables for Trie:
 *   - `root`: TrieNode.
 *   - `overallBestForEmptySuffix`: `{ index: number, length: number }`. Precomputed from `wordsContainer`.
 *
 * Initialization:
 * 1. Precompute `overallBestForEmptySuffix`.
 * 2. Create `root = new TrieNode()`. Set `root.bestMatch = overallBestForEmptySuffix`.
 * 3. For each `wordsContainer[i]`:
 *    a. Reverse `wordsContainer[i]`.
 *    b. Call `insert(reversedWord, i, wordsContainer[i].length, root)`.
 *
 * `insert(reversedWord, originalIndex, originalLength, root)`:
 *   `currentNode = root`
 *   For each `char` in `reversedWord`:
 *     `charIndex = char.charCodeAt(0) - 'a'.charCodeAt(0)`
 *     If `currentNode.children[charIndex] === null`, create `newNode = new TrieNode()`.
 *     `currentNode.children[charIndex] = newNode`
 *     `currentNode = newNode`
 *     // Update bestMatch at the current node
 *     `newCandidate = { index: originalIndex, length: originalLength }`
 *     If `newCandidate.length < currentNode.bestMatch.length || (newCandidate.length === currentNode.bestMatch.length && newCandidate.index < currentNode.bestMatch.index)`:
 *       `currentNode.bestMatch = newCandidate`
 *
 * `query(reversedQueryWord, root, overallBestForEmptySuffix)`:
 *   `currentNode = root`
 *   `currentBestMatchForQuery = { index: -1, length: Infinity }` // Best match found *during* traversal for this query.
 *
 *   For each `char` in `reversedQueryWord`:
 *     `charIndex = char.charCodeAt(0) - 'a'.charCodeAt(0)`
 *     If `currentNode.children[charIndex] === null`:
 *       // Cannot extend the common suffix. The best match we found so far during traversal is the best for a *non-empty* common suffix.
 *       // The actual best match for this query (including the possibility of an empty suffix) is `currentBestMatchForQuery` OR `overallBestForEmptySuffix` if `currentBestMatchForQuery` is worse.
 *       // Since we update `currentBestMatchForQuery` with the best found so far, and it starts with no match, if it remains no match, we fall back to `overallBestForEmptySuffix`.
 *       break
 *     `currentNode = currentNode.children[charIndex]`
 *     // `currentNode.bestMatch` holds the best match for a suffix *ending* at this Trie node.
 *     // We need to check if this is better than our current best for the query.
 *     If `currentNode.bestMatch.length < currentBestMatchForQuery.length || (currentNode.bestMatch.length === currentBestMatchForQuery.length && currentNode.bestMatch.index < currentBestMatchForQuery.index)`:
 *       `currentBestMatchForQuery = currentNode.bestMatch`
 *
 *   // After loop, determine the final answer for this query.
 *   // If `currentBestMatchForQuery` was never updated (meaning no non-empty common suffix found, or the path led to nodes without valid `bestMatch` updates),
 *   // then the best match is the `overallBestForEmptySuffix`.
 *   // Otherwise, `currentBestMatchForQuery` holds the best match for the longest common suffix found.
 *   If `currentBestMatchForQuery.index === -1`:
 *     // This implies either the loop didn't run (query word is empty, though constraints say length >= 1)
 *     // or the traversal path led to nodes that didn't have any candidate strings registered for them.
 *     // This shouldn't happen if we correctly initialize `bestMatch` in Trie nodes during insertion.
 *     // The `bestMatch` at `root` stores the overall best for empty suffix.
 *     // Let's rethink: the loop correctly updates `currentBestMatchForQuery` if it finds *any* valid suffix.
 *     // If it doesn't find any suffix, `currentBestMatchForQuery` remains `{ index: -1, length: Infinity }`.
 *     // In this case, the best match for the query is indeed the `overallBestForEmptySuffix`.
 *     return overallBestForEmptySuffix.index
 *   Else:
 *     return currentBestMatchForQuery.index
 *
 * Let's refine `insert` and `query` more carefully.
 *
 * `TrieNode`:
 *   `children`: `Array(26)`
 *   `bestMatch`: `{ index: number, length: number }` initialized to `{ index: -1, length: Infinity }` for newly created nodes.
 *
 * `buildTrie(wordsContainer)`:
 *   `root = new TrieNode()`
 *   // Precompute overall best for empty suffix first.
 *   `overallBest = { index: 0, length: wordsContainer[0].length }`
 *   For `i = 1` to `wordsContainer.length - 1`:
 *     `currentWord = wordsContainer[i]`
 *     If `currentWord.length < overallBest.length || (currentWord.length === overallBest.length && i < overallBest.index)`:
 *       `overallBest = { index: i, length: currentWord.length }`
 *
 *   // Insert all words into Trie
 *   For `i = 0` to `wordsContainer.length - 1`:
 *     `word = wordsContainer[i]`
 *     `reversedWord = word.split('').reverse().join('')`
 *     `currentNode = root`
 *     // Update root's best match if this word is better than current overall best
 *     // This is implicitly handled if we treat root itself as a node that can be updated.
 *     // But the problem asks for *common suffix*. Root represents empty suffix.
 *     // So `root.bestMatch` should represent the best string for an empty suffix.
 *     // Let's initialize root's bestMatch with the precomputed overallBest.
 *     `root.bestMatch = overallBest` // This is crucial.
 *
 *     For `j = 0` to `reversedWord.length - 1`:
 *       `char = reversedWord[j]`
 *       `charIndex = char.charCodeAt(0) - 'a'.charCodeAt(0)`
 *       If `currentNode.children[charIndex] === null`:
 *         `currentNode.children[charIndex] = new TrieNode()`
 *       `currentNode = currentNode.children[charIndex]`
 *
 *       // Update bestMatch at the current node (representing a suffix)
 *       `newCandidate = { index: i, length: word.length }`
 *       If `newCandidate.length < currentNode.bestMatch.length || (newCandidate.length === currentNode.bestMatch.length && newCandidate.index < currentNode.bestMatch.index)`:
 *         `currentNode.bestMatch = newCandidate`
 *
 *   Return `{ root, overallBest }`
 *
 * `processQueries(wordsQuery, trieData)`:
 *   `ans = []`
 *   `root = trieData.root`
 *   `overallBestForEmptySuffix = trieData.overallBest`
 *
 *   For each `queryWord` in `wordsQuery`:
 *     `reversedQuery = queryWord.split('').reverse().join('')`
 *     `currentNode = root`
 *     `bestMatchForThisQuery = { index: -1, length: Infinity }` // Stores the best match *found during traversal*.
 *
 *     For `j = 0` to `reversedQuery.length - 1`:
 *       `char = reversedQuery[j]`
 *       `charIndex = char.charCodeAt(0) - 'a'.charCodeAt(0)`
 *
 *       If `currentNode.children[charIndex] === null`:
 *         // Path broken. The longest common suffix cannot be extended.
 *         // `bestMatchForThisQuery` holds the best found for the longest *non-empty* common suffix.
 *         // If `bestMatchForThisQuery.index === -1`, it means no non-empty common suffix was found,
 *         // so we fall back to the overall best for empty suffix.
 *         break
 *
 *       `currentNode = currentNode.children[charIndex]`
 *       // `currentNode.bestMatch` is the best candidate for the suffix represented by this node.
 *       // We need to check if this candidate is better than `bestMatchForThisQuery`.
 *       If `currentNode.bestMatch.length < bestMatchForThisQuery.length || (currentNode.bestMatch.length === bestMatchForThisQuery.length && currentNode.bestMatch.index < bestMatchForThisQuery.index)`:
 *         `bestMatchForThisQuery = currentNode.bestMatch`
 *
 *     // Determine the final answer for this query.
 *     // If `bestMatchForThisQuery` was updated (meaning we found at least one string matching some non-empty suffix),
 *     // then `bestMatchForThisQuery` is our answer.
 *     // Otherwise, if `bestMatchForThisQuery.index === -1`, it means no non-empty common suffix was found,
 *     // so the best match is the `overallBestForEmptySuffix`.
 *     If `bestMatchForThisQuery.index === -1`:
 *       `ans.push(overallBestForEmptySuffix.index)`
 *     Else:
 *       `ans.push(bestMatchForThisQuery.index)`
 *
 *   Return `ans`
 *
 * Example 1 walk-through:
 * wordsContainer = ["abcd","bcd","xbcd"], wordsQuery = ["cd","bcd","xyz"]
 *
 * 1. Precompute `overallBestForEmptySuffix`:
 *    "abcd" (len 4, idx 0)
 *    "bcd"  (len 3, idx 1) -> new overallBest = { index: 1, length: 3 }
 *    "xbcd" (len 4, idx 2)
 *    `overallBestForEmptySuffix = { index: 1, length: 3 }`
 *
 * 2. Build Trie:
 *    Root initialized with `bestMatch = { index: 1, length: 3 }`.
 *
 *    Insert "dcba" (idx 0, len 4):
 *    'd': node_d.bestMatch = {1, 3} -> updated to {0, 4} if better. 4 is not < 3. So node_d.bestMatch remains {1, 3}.
 *    'c': node_dc.bestMatch = {1, 3}
 *    'b': node_dcb.bestMatch = {1, 3}
 *    'a': node_dcba.bestMatch = {1, 3}
 *
 *    Let's re-evaluate `insert` logic for `bestMatch` update. The problem says:
 *    "find a string from wordsContainer that has the longest common suffix with wordsQuery[i]."
 *    "If there are two or more strings in wordsContainer that share the longest common suffix, find the string that is the smallest in length."
 *    "If there are two or more such strings that have the same smallest length, find the one that occurred earlier in wordsContainer."
 *
 *    So, at any Trie node representing a suffix `S`, `bestMatch` should store the `{ index, length }` of the string from `wordsContainer` that:
 *    a) has `S` as a suffix.
 *    b) among all strings satisfying (a), has the minimum length.
 *    c) among all strings satisfying (a) and (b), has the minimum index.
 *
 *    Revised insertion update:
 *    `currentNode = root`
 *    For each `char` in `reversedWord` (from `wordsContainer[i]` with length `word.length`):
 *      ... move to `currentNode` ...
 *      `newCandidate = { index: i, length: word.length }`
 *      // `currentNode.bestMatch` stores the best match *for suffixes ending at this point*.
 *      // We compare `newCandidate` with `currentNode.bestMatch`.
 *      If `newCandidate.length < currentNode.bestMatch.length || (newCandidate.length === currentNode.bestMatch.length && newCandidate.index < currentNode.bestMatch.index)`:
 *        `currentNode.bestMatch = newCandidate`
 *
 *    Let's trace again carefully for Example 1:
 *    wordsContainer = ["abcd"(0,4),"bcd"(1,3),"xbcd"(2,4)]
 *    wordsQuery = ["cd","bcd","xyz"]
 *
 *    1. `overallBestForEmptySuffix`: `minLenIndex = { index: 1, length: 3 }`
 *
 *    2. Build Trie: `root = new TrieNode()`. `root.bestMatch = { index: 1, length: 3 }`.
 *
 *    Insert "abcd" (idx 0, len 4): reversed "dcba"
 *    - 'd': `node_d = new TrieNode()`. `node_d.bestMatch = { index: -1, length: Infinity }`. Compare {0, 4} with { -1, Inf }. {0, 4} is better. `node_d.bestMatch = {0, 4}`. `currentNode` becomes `node_d`.
 *    - 'c': `node_dc = new TrieNode()`. `node_dc.bestMatch = { index: -1, length: Infinity }`. Compare {0, 4} with { -1, Inf }. {0, 4} is better. `node_dc.bestMatch = {0, 4}`. `currentNode` becomes `node_dc`.
 *    - 'b': `node_dcb = new TrieNode()`. `node_dcb.bestMatch = { index: -1, length: Infinity }`. Compare {0, 4} with { -1, Inf }. {0, 4} is better. `node_dcb.bestMatch = {0, 4}`. `currentNode` becomes `node_dcb`.
 *    - 'a': `node_dcba = new TrieNode()`. `node_dcba.bestMatch = { index: -1, length: Infinity }`. Compare {0, 4} with { -1, Inf }. {0, 4} is better. `node_dcba.bestMatch = {0, 4}`. `currentNode` becomes `node_dcba`.
 *
 *    Insert "bcd" (idx 1, len 3): reversed "dcb"
 *    - 'd': `currentNode` is `node_d`. `newCandidate = {1, 3}`. `node_d.bestMatch` is `{0, 4}`. Compare {1, 3} with {0, 4}. 3 < 4. So {1, 3} is better. `node_d.bestMatch = {1, 3}`. `currentNode` becomes `node_d`.
 *    - 'c': `currentNode` is `node_dc`. `newCandidate = {1, 3}`. `node_dc.bestMatch` is `{0, 4}`. Compare {1, 3} with {0, 4}. 3 < 4. So {1, 3} is better. `node_dc.bestMatch = {1, 3}`. `currentNode` becomes `node_dc`.
 *    - 'b': `currentNode` is `node_dcb`. `newCandidate = {1, 3}`. `node_dcb.bestMatch` is `{0, 4}`. Compare {1, 3} with {0, 4}. 3 < 4. So {1, 3} is better. `node_dcb.bestMatch = {1, 3}`. `currentNode` becomes `node_dcb`.
 *
 *    Insert "xbcd" (idx 2, len 4): reversed "dcby"
 *    - 'd': `currentNode` is `node_d`. `newCandidate = {2, 4}`. `node_d.bestMatch` is `{1, 3}`. Compare {2, 4} with {1, 3}. 4 is not < 3. {1, 3} is better. `node_d.bestMatch` remains `{1, 3}`. `currentNode` becomes `node_d`.
 *    - 'c': `currentNode` is `node_dc`. `newCandidate = {2, 4}`. `node_dc.bestMatch` is `{1, 3}`. Compare {2, 4} with {1, 3}. 4 is not < 3. {1, 3} is better. `node_dc.bestMatch` remains `{1, 3}`. `currentNode` becomes `node_dc`.
 *    - 'b': `currentNode` is `node_dcb`. `newCandidate = {2, 4}`. `node_dcb.bestMatch` is `{1, 3}`. Compare {2, 4} with {1, 3}. 4 is not < 3. {1, 3} is better. `node_dcb.bestMatch` remains `{1, 3}`. `currentNode` becomes `node_dcb`.
 *    - 'y': `node_dcby = new TrieNode()`. `node_dcby.bestMatch = { index: -1, length: Infinity }`. Compare {2, 4} with { -1, Inf }. {2, 4} is better. `node_dcby.bestMatch = {2, 4}`. `currentNode` becomes `node_dcby`.
 *
 *    Trie structure summary for relevant paths:
 *    root.bestMatch = {1, 3}
 *    root -> 'd' -> node_d.bestMatch = {1, 3}
 *    node_d -> 'c' -> node_dc.bestMatch = {1, 3}
 *    node_dc -> 'b' -> node_dcb.bestMatch = {1, 3}
 *    node_dcb -> 'a' -> node_dcba.bestMatch = {0, 4}
 *    node_dcb -> 'y' -> node_dcby.bestMatch = {2, 4}
 *
 *    Wait, the logic for "xbcd" is reversed. It should be "dcby". So the last node for "xbcd" is "dcby".
 *    Corrected "xbcd" insertion (reversed "dcby"):
 *    - 'd': `node_d` (already exists) - `newCandidate={2,4}`, `node_d.bestMatch={1,3}`. {1,3} is better. `node_d.bestMatch` remains `{1, 3}`.
 *    - 'c': `node_dc` (already exists) - `newCandidate={2,4}`, `node_dc.bestMatch={1,3}`. {1,3} is better. `node_dc.bestMatch` remains `{1, 3}`.
 *    - 'b': `node_dcb` (already exists) - `newCandidate={2,4}`, `node_dcb.bestMatch={1,3}`. {1,3} is better. `node_dcb.bestMatch` remains `{1, 3}`.
 *    - 'y': `node_dcby = new TrieNode()`. `node_dcby.bestMatch = { -1, Inf }`. Compare `{2,4}` with `{ -1, Inf }`. `{2,4}` is better. `node_dcby.bestMatch = {2, 4}`.
 *
 *    So after insertions:
 *    root.bestMatch = {1, 3}
 *    root -> 'd' -> node_d.bestMatch = {1, 3}
 *    node_d -> 'c' -> node_dc.bestMatch = {1, 3}
 *    node_dc -> 'b' -> node_dcb.bestMatch = {1, 3}
 *    node_dcb -> 'a' -> node_dcba.bestMatch = {0, 4}
 *    node_dcb -> 'y' -> node_dcby.bestMatch = {2, 4}
 *
 * 3. Process Queries:
 *
 *    Query 1: "cd" -> reversed "dc"
 *    - `bestMatchForThisQuery = { -1, Inf }`
 *    - `currentNode = root`
 *    - Char 'd': `charIndex = 'd'-'a'`. `node_d = root.children[charIndex]`. It exists.
 *      `currentNode` becomes `node_d`. `node_d.bestMatch = {1, 3}`.
 *      Compare `{1, 3}` with `{ -1, Inf }`. `{1, 3}` is better. `bestMatchForThisQuery = {1, 3}`.
 *    - Char 'c': `charIndex = 'c'-'a'`. `node_dc = node_d.children[charIndex]`. It exists.
 *      `currentNode` becomes `node_dc`. `node_dc.bestMatch = {1, 3}`.
 *      Compare `{1, 3}` with `{1, 3}`. They are equal. No update needed. `bestMatchForThisQuery` remains `{1, 3}`.
 *    - End of query string.
 *    - `bestMatchForThisQuery.index` is 1 (not -1). So, `ans.push(1)`. Correct for Example 1.
 *
 *    Query 2: "bcd" -> reversed "dcb"
 *    - `bestMatchForThisQuery = { -1, Inf }`
 *    - `currentNode = root`
 *    - Char 'd': `node_d` exists. `currentNode = node_d`. `node_d.bestMatch = {1, 3}`. Compare `{1, 3}` with `{ -1, Inf }`. `{1, 3}` is better. `bestMatchForThisQuery = {1, 3}`.
 *    - Char 'c': `node_dc` exists. `currentNode = node_dc`. `node_dc.bestMatch = {1, 3}`. Compare `{1, 3}` with `{1, 3}`. Equal. `bestMatchForThisQuery` remains `{1, 3}`.
 *    - Char 'b': `node_dcb` exists. `currentNode = node_dcb`. `node_dcb.bestMatch = {1, 3}`. Compare `{1, 3}` with `{1, 3}`. Equal. `bestMatchForThisQuery` remains `{1, 3}`.
 *    - End of query string.
 *    - `bestMatchForThisQuery.index` is 1 (not -1). So, `ans.push(1)`. Correct for Example 1.
 *
 *    Query 3: "xyz" -> reversed "zyx"
 *    - `bestMatchForThisQuery = { -1, Inf }`
 *    - `currentNode = root`
 *    - Char 'z': `charIndex = 'z'-'a'`. `root.children[charIndex]` is null. Path broken. Break loop.
 *    - `bestMatchForThisQuery.index` is -1. So, `ans.push(overallBestForEmptySuffix.index)`, which is 1. Correct for Example 1.
 *
 *    The logic seems sound.
 *
 * Time Complexity:
 * Let N be the number of strings in `wordsContainer`, M be the number of strings in `wordsQuery`.
 * Let L_c be the maximum length of a string in `wordsContainer`, and L_q be the maximum length of a string in `wordsQuery`.
 *
 * 1. Reversing `wordsContainer` strings: O(Sum of lengths of `wordsContainer`). Let this sum be S_c.
 * 2. Building the Trie: For each of N strings, we traverse its reversed length and perform constant time operations (node creation, comparison, assignment). The total number of nodes in the Trie can be at most S_c. The insertion into the Trie takes O(L_c) for each word. So, building the Trie is O(N * L_c), which is effectively O(S_c) because each character of `wordsContainer` contributes to at most one node traversal in the Trie construction path. Total time for building Trie is O(S_c).
 * 3. Reversing `wordsQuery` strings: O(Sum of lengths of `wordsQuery`). Let this sum be S_q.
 * 4. Querying the Trie: For each of M strings, we traverse its reversed length. In the worst case, we traverse the entire length of the query string. Each step takes constant time (child lookup, comparison, assignment). So, querying takes O(M * L_q), which is effectively O(S_q).
 *
 * Total Time Complexity: O(S_c + S_q). Given the constraints, S_c and S_q are at most 5 * 10^5.
 *
 * Space Complexity:
 * 1. Trie storage: The number of nodes in the Trie is at most the total number of characters in `wordsContainer` (S_c), because each character contributes to a unique path segment. Each node stores pointers to children and a `bestMatch` object. So, Trie space is O(S_c).
 * 2. Storing reversed strings: We create reversed copies of strings for insertion and query. This could be considered temporary space, but if we re-use buffers, it's O(max(L_c, L_q)). If new strings are created each time, it's O(S_c + S_q) for all reversed strings if stored simultaneously. In this implementation, we reverse strings one by one for insertion/query, so the space for reversed strings is O(max(L_c, L_q)).
 * 3. `ans` array: O(M).
 *
 * Dominant space complexity is O(S_c) for the Trie.
 *
 * Let's consider the constraints:
 * Sum of `wordsContainer[i].length` is at most 5 * 10^5.
 * Sum of `wordsQuery[i].length` is at most 5 * 10^5.
 *
 * This confirms O(S_c + S_q) for time and O(S_c) for space as the effective complexity.
 *
 * A small detail: If `wordsContainer` is empty, the code might break. Constraints say `wordsContainer.length >= 1`.
 * If `wordsQuery` is empty, the result array will be empty.
 *
 * The `TrieNode` class should be defined.
 *
 *
 * Implementation details:
 * - `char.charCodeAt(0) - 'a'.charCodeAt(0)` is a standard way to get 0-25 index for lowercase chars.
 * - Reversing strings: `str.split('').reverse().join('')` is fine.
 * - `bestMatch` comparison logic is key.
 *
 * Let's consider the case where `wordsContainer` has only one string.
 * `wordsContainer = ["abc"]`, `wordsQuery = ["bc", "ab", "xyz"]`
 *
 * 1. `overallBestForEmptySuffix = { index: 0, length: 3 }`.
 * 2. Trie:
 *    root.bestMatch = {0, 3}
 *    Insert "abc" (reversed "cba"):
 *    - 'c': node_c.bestMatch = {0, 3}
 *    - 'b': node_cb.bestMatch = {0, 3}
 *    - 'a': node_cba.bestMatch = {0, 3}
 *
 * 3. Queries:
 *    "bc" -> reversed "cb"
 *    - `bestMatchForThisQuery = { -1, Inf }`
 *    - 'c': `node_c` exists. `currentNode = node_c`. `node_c.bestMatch = {0, 3}`. `bestMatchForThisQuery = {0, 3}`.
 *    - 'b': `node_cb` exists. `currentNode = node_cb`. `node_cb.bestMatch = {0, 3}`. `{0,3}` vs `{0,3}`. No update. `bestMatchForThisQuery` remains `{0, 3}`.
 *    - End. `bestMatchForThisQuery.index` is 0. Push 0.
 *
 *    "ab" -> reversed "ba"
 *    - `bestMatchForThisQuery = { -1, Inf }`
 *    - 'b': `node_b` does not exist (only 'c', 'cb', 'cba' paths from root). Path broken.
 *    - `bestMatchForThisQuery.index` is -1. Push `overallBestForEmptySuffix.index` which is 0.
 *
 *    "xyz" -> reversed "zyx"
 *    - `bestMatchForThisQuery = { -1, Inf }`
 *    - 'z': `node_z` does not exist. Path broken.
 *    - `bestMatchForThisQuery.index` is -1. Push `overallBestForEmptySuffix.index` which is 0.
 *
 *    Result: [0, 0, 0]. This seems correct.
 *
 * Final check on problem phrasing: "If there are two or more strings in wordsContainer that share the longest common suffix, find the string that is the smallest in length. If there are two or more such strings that have the same smallest length, find the one that occurred earlier in wordsContainer."
 * This is exactly what the `bestMatch` comparison logic `newCandidate.length < currentNode.bestMatch.length || (newCandidate.length === currentNode.bestMatch.length && newCandidate.index < currentNode.bestMatch.index)` achieves.
 *
 * The `overallBest` for empty suffix is also correctly handled. If query traversal breaks early or doesn't find any match, we fall back to the precomputed best for the empty suffix.
 *
 * One more thought: when we traverse the trie for a query, `currentNode.bestMatch` stores the best string that has the suffix represented by the path *ending* at `currentNode`. If the query string is `Q`, and we traverse `Q_rev` up to a certain node `N`, then `N.bestMatch` is the best string from `wordsContainer` whose suffix matches the path to `N`, using the defined criteria. This is what we want.
 *
 * The problem statement: "For each wordsQuery[i], you need to find a string from wordsContainer that has the longest common suffix with wordsQuery[i]."
 *
 * Example 1, Query 2: `wordsQuery[1] = "bcd"`.
 * Strings in `wordsContainer` sharing "bcd" suffix: "abcd", "bcd", "xbcd".
 * Lengths: 4, 3, 4. Smallest length is 3, from "bcd" (index 1). This is the answer.
 *
 * Trie path for "bcd" (reversed "dcb"):
 * root -> 'd' -> node_d.bestMatch = {1, 3} (because "bcd" is shorter than "abcd")
 * node_d -> 'c' -> node_dc.bestMatch = {1, 3}
 * node_dc -> 'b' -> node_dcb.bestMatch = {1, 3}
 *
 * Query "dcb":
 * - 'd': `currentNode=node_d`. `bestMatchForThisQuery` becomes `{1, 3}`.
 * - 'c': `currentNode=node_dc`. `node_dc.bestMatch` is `{1, 3}`. `{1, 3}` vs `{1, 3}`. No update.
 * - 'b': `currentNode=node_dcb`. `node_dcb.bestMatch` is `{1, 3}`. `{1, 3}` vs `{1, 3}`. No update.
 *
 * Final `bestMatchForThisQuery` is `{1, 3}`. Index is 1. Correct.
 *
 * Example 1, Query 0: `wordsQuery[0] = "cd"`.
 * Strings in `wordsContainer` sharing "cd" suffix: "abcd", "bcd", "xbcd".
 * Longest common suffix with "cd" is "cd".
 * Candidates: "abcd" (suffix "bcd"), "bcd" (suffix "bcd"), "xbcd" (suffix "bcd").
 * Wait, the common suffix is "cd".
 * "abcd" ends in "bcd". Common suffix with "cd" is "cd".
 * "bcd" ends in "bcd". Common suffix with "cd" is "cd".
 * "xbcd" ends in "bcd". Common suffix with "cd" is "cd".
 *
 * The longest common suffix for "cd" from `wordsContainer` strings is "cd".
 * Candidates sharing suffix "cd": "abcd" (index 0, len 4), "bcd" (index 1, len 3), "xbcd" (index 2, len 4).
 * Smallest length: 3 (from "bcd", index 1). Answer: 1.
 *
 * Trie path for "cd" (reversed "dc"):
 * root -> 'd' -> node_d.bestMatch = {1, 3} (based on previous insertions, "bcd" is preferred over "abcd" and "xbcd" for suffixes ending with 'd')
 * node_d -> 'c' -> node_dc.bestMatch = {1, 3}
 *
 * Query "dc":
 * - 'd': `currentNode = node_d`. `node_d.bestMatch = {1, 3}`. `bestMatchForThisQuery = {1, 3}`.
 * - 'c': `currentNode = node_dc`. `node_dc.bestMatch = {1, 3}`. `{1, 3}` vs `{1, 3}`. No update.
 *
 * Final `bestMatchForThisQuery` is `{1, 3}`. Index is 1. Correct.
 *
 * The Trie node `bestMatch` should indeed store the best match for the suffix that *ends at that node*.
 * When querying, `bestMatchForThisQuery` accumulates the best match found so far as we extend the common suffix.
 *
 * The logic seems solid.
 */

// Helper class for Trie Node
class TrieNode {
    constructor() {
        // children[i] stores the TrieNode for the character ('a' + i)
        this.children = Array(26).fill(null);
        // Stores the best match encountered for any suffix ending at this node.
        // Format: { index: number, length: number }
        // index: original index in wordsContainer
        // length: length of the string from wordsContainer
        // Initialized to { index: -1, length: Infinity } meaning no valid match found yet.
        this.bestMatch = { index: -1, length: Infinity };
    }
}

/**
 * Builds the Trie from the wordsContainer.
 * Each node in the Trie stores the best matching string from wordsContainer
 * for the suffix represented by the path to that node.
 *
 * @param {string[]} wordsContainer - The array of strings to build the Trie from.
 * @returns {{root: TrieNode, overallBestForEmptySuffix: {index: number, length: number}}} An object containing the Trie root and the best match for an empty suffix.
 */
function buildTrie(wordsContainer) {
    const root = new TrieNode();

    // 1. Precompute the overall best match for an empty suffix.
    // This is the string with the minimum length, and if lengths are tied, the one with the minimum index.
    let overallBestForEmptySuffix = { index: 0, length: wordsContainer[0].length };
    for (let i = 1; i < wordsContainer.length; i++) {
        const currentWord = wordsContainer[i];
        if (currentWord.length < overallBestForEmptySuffix.length || (currentWord.length === overallBestForEmptySuffix.length && i < overallBestForEmptySuffix.index)) {
            overallBestForEmptySuffix = { index: i, length: currentWord.length };
        }
    }

    // Set the bestMatch at the root to this overall best. This serves as the fallback
    // for queries that don't have any non-empty common suffix.
    root.bestMatch = overallBestForEmptySuffix;

    // 2. Insert each word into the Trie.
    for (let i = 0; i < wordsContainer.length; i++) {
        const word = wordsContainer[i];
        // Reverse the word to build the Trie based on suffixes.
        const reversedWord = word.split('').reverse().join('');
        let currentNode = root;

        // Traverse the reversed word and update Trie nodes.
        for (const char of reversedWord) {
            const charIndex = char.charCodeAt(0) - 'a'.charCodeAt(0);

            // If the child node doesn't exist, create it.
            if (currentNode.children[charIndex] === null) {
                currentNode.children[charIndex] = new TrieNode();
            }
            // Move to the child node.
            currentNode = currentNode.children[charIndex];

            // Update the bestMatch at the current node.
            // A new candidate is better if it's shorter, or if it has the same length and a smaller index.
            const newCandidate = { index: i, length: word.length };
            if (newCandidate.length < currentNode.bestMatch.length || (newCandidate.length === currentNode.bestMatch.length && newCandidate.index < currentNode.bestMatch.index)) {
                currentNode.bestMatch = newCandidate;
            }
        }
    }

    return { root, overallBestForEmptySuffix };
}

/**
 * Processes each query against the built Trie.
 *
 * @param {string[]} wordsQuery - The array of query strings.
 * @param {{root: TrieNode, overallBestForEmptySuffix: {index: number, length: number}}} trieData - The Trie data structure and overall best match for empty suffix.
 * @returns {number[]} An array of indices corresponding to the best matches for each query.
 */
function processQueries(wordsQuery, trieData) {
    const ans = [];
    const root = trieData.root;
    const overallBestForEmptySuffix = trieData.overallBestForEmptySuffix;

    for (const queryWord of wordsQuery) {
        // Reverse the query word for Trie traversal.
        const reversedQuery = queryWord.split('').reverse().join('');
        let currentNode = root;
        // This variable will store the best match found *during the traversal* for a non-empty common suffix.
        let bestMatchForThisQuery = { index: -1, length: Infinity };

        // Traverse the Trie using the reversed query string.
        for (const char of reversedQuery) {
            const charIndex = char.charCodeAt(0) - 'a'.charCodeAt(0);

            // If the path breaks (no child node for the character), we've found the longest common suffix.
            // `bestMatchForThisQuery` holds the best candidate for this longest common suffix.
            if (currentNode.children[charIndex] === null) {
                break;
            }

            // Move to the next node in the Trie.
            currentNode = currentNode.children[charIndex];

            // The `bestMatch` at the current node represents the best candidate string
            // from `wordsContainer` that shares the suffix represented by the path to this node.
            // We check if this candidate is better than our current `bestMatchForThisQuery`.
            if (currentNode.bestMatch.length < bestMatchForThisQuery.length || (currentNode.bestMatch.length === bestMatchForThisQuery.length && currentNode.bestMatch.index < bestMatchForThisQuery.index)) {
                bestMatchForThisQuery = currentNode.bestMatch;
            }
        }

        // Determine the final answer for the current query.
        // If `bestMatchForThisQuery` was never updated (meaning no non-empty common suffix was found,
        // or the path led to nodes without any matching candidates registered),
        // then the best match is the `overallBestForEmptySuffix`.
        if (bestMatchForThisQuery.index === -1) {
            ans.push(overallBestForEmptySuffix.index);
        } else {
            // Otherwise, `bestMatchForThisQuery` holds the index of the best matching string
            // for the longest common suffix found.
            ans.push(bestMatchForThisQuery.index);
        }
    }

    return ans;
}


/**
 * @param {string[]} wordsContainer
 * @param {string[]} wordsQuery
 * @return {number[]}
 */
var longestCommonSuffixQueries = function(wordsContainer, wordsQuery) {
    // Build the Trie from wordsContainer.
    const trieData = buildTrie(wordsContainer);

    // Process each query using the built Trie.
    const result = processQueries(wordsQuery, trieData);

    return result;
};
