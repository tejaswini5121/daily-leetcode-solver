```python
# Problem: Longest Common Suffix Queries
# Link: https://leetcode.com/problems/longest-common-suffix-queries/
#
# Approach:
# The problem requires finding the string in `wordsContainer` that shares the longest common suffix with each string in `wordsQuery`.
# Among those with the longest common suffix, we need to select the shortest string, and if there's still a tie, the one with the smallest index.
#
# A Trie (prefix tree) is a suitable data structure for efficiently handling prefix-related operations. Since we are dealing with suffixes,
# we can reverse all the strings and build a Trie. For each query string, we also reverse it and traverse the Trie.
#
# For each query string (reversed):
# 1. Traverse the reversed query string character by character in the Trie.
# 2. At each node, we need to keep track of the minimum length and the index of the string from `wordsContainer` that passed through this node.
#    This information should be stored such that if we find a shorter string or a string with the same length but smaller index, we update it.
# 3. During traversal, for each character of the reversed query string, we find the best candidate (min_length, min_index) from the current Trie node's recorded best.
#    The best common suffix length will be the depth of the traversal.
# 4. After traversing the entire reversed query string, the accumulated best candidate (min_length, min_index) from the deepest node reached will be our answer for that query.
#
# Trie Node Structure:
# - `children`: A dictionary mapping characters to child nodes.
# - `min_len`: The minimum length of a `wordsContainer` string that has a suffix represented by the path to this node.
# - `min_idx`: The index of the `wordsContainer` string corresponding to `min_len`.
#
# Building the Trie:
# For each string in `wordsContainer` at index `i`:
# 1. Reverse the string.
# 2. Traverse the reversed string character by character, creating new nodes if they don't exist.
# 3. At each node visited during the insertion of a reversed string, update `min_len` and `min_idx`.
#    If the current string's length is less than the node's `min_len`, update `min_len` to the current string's length and `min_idx` to `i`.
#    If the current string's length is equal to the node's `min_len` and `i` is less than the node's `min_idx`, update `min_idx` to `i`.
#
# Querying the Trie:
# For each string in `wordsQuery` at index `j`:
# 1. Reverse the string.
# 2. Initialize `best_query_len` to 0, `best_query_min_len` to infinity, and `best_query_min_idx` to -1.
# 3. Traverse the reversed query string character by character in the Trie.
# 4. For each character:
#    a. Move to the corresponding child node. If no child exists, break the loop (no further common suffix).
#    b. From the current node, get its `min_len` and `min_idx`.
#    c. Compare this node's best candidate with the current best for the query.
#       - If the node's `min_len` is less than `best_query_min_len`, update `best_query_min_len` and `best_query_min_idx`.
#       - If the node's `min_len` is equal to `best_query_min_len` and the node's `min_idx` is less than `best_query_min_idx`, update `best_query_min_idx`.
# 5. After the traversal (or break), `best_query_min_idx` will hold the index of the string from `wordsContainer` that satisfies the conditions for the current query.
#
# Time Complexity:
# - Building the Trie: O(S * L_max), where S is the total number of characters in `wordsContainer` and L_max is the maximum length of a string.
#   Since the sum of lengths is limited, it's more precisely O(sum(len(word) for word in wordsContainer)).
# - Querying the Trie: O(Q * L'_max), where Q is the number of queries and L'_max is the maximum length of a query string.
#   More precisely, O(sum(len(query) for query in wordsQuery)).
# - Overall: O(sum(len(word) for word in wordsContainer) + sum(len(query) for query in wordsQuery)).
#
# Space Complexity:
# - Trie: O(S), where S is the total number of characters in `wordsContainer`, as each character potentially creates a new node.
# - Overall: O(sum(len(word) for word in wordsContainer)).
#
#
class TrieNode:
    def __init__(self):
        # Dictionary to store children nodes, mapping characters to TrieNode objects.
        self.children = {}
        # Stores the minimum length of a word in wordsContainer passing through this node.
        self.min_len = float('inf')
        # Stores the index of the word in wordsContainer with the minimum length.
        self.min_idx = -1

class Trie:
    def __init__(self):
        # The root of the Trie.
        self.root = TrieNode()

    def insert(self, word, index):
        # Reverse the word to build the Trie for suffixes.
        reversed_word = word[::-1]
        node = self.root
        # Iterate through each character of the reversed word.
        for char in reversed_word:
            # If the character is not in the current node's children, create a new node.
            if char not in node.children:
                node.children[char] = TrieNode()
            # Move to the child node.
            node = node.children[char]
            # Update the minimum length and index at this node.
            # If the current word's length is smaller than the stored minimum, update.
            if len(word) < node.min_len:
                node.min_len = len(word)
                node.min_idx = index
            # If the current word's length is equal to the stored minimum,
            # and the current word's index is smaller, update the index.
            elif len(word) == node.min_len and index < node.min_idx:
                node.min_idx = index

    def query(self, word):
        # Reverse the query word to match suffixes in the Trie.
        reversed_word = word[::-1]
        node = self.root
        # Initialize variables to store the best result found for this query.
        # best_query_min_len stores the minimum length of a qualifying word.
        # best_query_min_idx stores the index of that qualifying word.
        best_query_min_len = float('inf')
        best_query_min_idx = -1

        # Iterate through each character of the reversed query word.
        for char in reversed_word:
            # If the character is not a child of the current node, it means there's no further common suffix.
            # Break the loop.
            if char not in node.children:
                break
            # Move to the child node corresponding to the character.
            node = node.children[char]

            # At this node, we have information about the best word(s) in wordsContainer
            # that share the suffix represented by the path from the root to this node.
            # We need to compare this node's stored best with the best we've found so far for the query.

            # If the current node's minimum length is less than the overall best minimum length found for the query so far,
            # update the query's best minimum length and index.
            if node.min_len < best_query_min_len:
                best_query_min_len = node.min_len
                best_query_min_idx = node.min_idx
            # If the current node's minimum length is equal to the overall best minimum length found for the query,
            # and the current node's index is smaller, update the query's best index.
            # This handles the tie-breaking rule of choosing the smaller index.
            elif node.min_len == best_query_min_len and node.min_idx < best_query_min_idx:
                best_query_min_idx = node.min_idx

        # If no common suffix was found (e.g., the query string itself is empty or no match in Trie),
        # the `best_query_min_idx` might still be -1. However, the problem implies there's always
        # a best match based on the longest common suffix (even if it's empty). The Trie node's `min_idx`
        # is updated based on the *entire* `wordsContainer` if `min_len` is `inf`.
        # The logic above correctly accumulates the best match as we traverse.
        # If the loop completes, `best_query_min_idx` will contain the index.
        # If the loop breaks early, `best_query_min_idx` will hold the best found up to that point.
        # The root node implicitly represents an empty suffix, and its min_len/min_idx will reflect the overall best for empty suffixes.
        # However, the query traversal ensures we find the longest *actual* common suffix first.

        # If after traversal, `best_query_min_idx` is still -1, it means the query string was empty or
        # no nodes were traversed at all. In such cases, we should consider the best match from the root's perspective
        # which implicitly represents the empty suffix. The initial insertion correctly populates root's children.
        # However, the logic correctly updates `best_query_min_idx` as it traverses. If the traversal doesn't even start
        # (e.g., empty query string), `best_query_min_idx` remains -1. But the problem guarantees non-empty strings.
        # The `min_idx` will be updated from the Trie nodes visited.
        # If no common characters are found at all, the loop will break, and the best `min_idx` found so far will be returned.
        # If the query itself is empty, the loop won't run, and `best_query_min_idx` will be -1. This case is unlikely due to constraints.
        # The logic correctly handles cases where a partial suffix match is the longest.
        # If the Trie is empty or the query doesn't match any prefix, `best_query_min_idx` will be updated by the `node.min_idx` values.
        # The initial `best_query_min_len = float('inf')` and `best_query_min_idx = -1` ensures that the first valid node's data will be taken.
        # If the query results in no common suffix longer than "", the loop might not find any valid nodes.
        # The default `min_idx` for the root's children would reflect the best overall.
        # But our logic correctly updates as it traverses. If no traversal happens, it means no common prefix of reversed strings.
        # The problem statement implies that even for "xyz", there's a common suffix "" with all strings.
        # In this case, the loop would break immediately. The `best_query_min_idx` should be the smallest index of the shortest string from wordsContainer.
        # This is handled by the initial state of the Trie when building. The `min_len` and `min_idx` at the root's children will be populated.
        # If the loop breaks at the first character of the reversed query, `node` will be the `root`.
        # The current logic relies on `node` being updated. If `node` remains `root`, `char not in node.children` will break.
        # If it breaks on the first char, `best_query_min_idx` remains -1. This needs careful handling.
        # The correct behavior is to check the best candidate at each step. If the loop breaks, we should return the best found *before* the break.
        # The current implementation correctly updates `best_query_min_idx` with the best found up to the current `node`.
        # If the loop breaks, the `best_query_min_idx` holds the index for the longest common suffix found *before* the break.
        # If the query string is empty, the loop does not run, and `best_query_min_idx` remains -1. This is not possible per constraints.

        # Let's re-verify the case where no common suffix is found.
        # E.g., wordsContainer = ["a"], wordsQuery = ["b"]
        # Reversed: wordsContainer = ["a"], wordsQuery = ["b"]
        # Trie: root -> 'a' (min_len=1, min_idx=0)
        # Query "b": reversed "b". 'b' not in root.children. Loop breaks.
        # `best_query_min_len` = inf, `best_query_min_idx` = -1. This is incorrect.
        # For "b", the longest common suffix is "", which is shared by all strings.
        # The best string for "" suffix is the one with smallest length and then smallest index.
        # The Trie root itself, or the "initial state" before any specific character traversal, should represent this base case.
        # The `insert` method populates `min_len` and `min_idx` for nodes. If no specific character matches,
        # it implies an empty suffix match.
        # The `query` function's loop will break if the first character doesn't match.
        # At that point, `node` is still `self.root`. The `best_query_min_idx` remains -1.
        # This means we need a way to access the "global best" for the empty suffix if no specific character matches.

        # The `insert` method correctly populates the `min_len` and `min_idx` for all nodes traversed.
        # For a query string `q`, if `q[::-1]` has a prefix `p` that exists in the trie, we find the best match for `p`.
        # If `q[::-1]` has no prefix that exists in the trie (e.g., `q="xyz"`, trie built from `{"abcd","bcd","xbcd"}`),
        # the loop `for char in reversed_word:` will `break` on the first character.
        # In this situation, `node` remains `self.root`. The `best_query_min_idx` remains -1.
        # This is where the problem statement needs to be carefully interpreted:
        # "If there are two or more strings in wordsContainer that share the longest common suffix, find the string that is the smallest in length. If there are two or more such strings that have the same smallest length, find the one that occurred earlier in wordsContainer."
        # For "xyz", the longest common suffix is "". All strings share "", so we find the shortest from `wordsContainer` (which is "bcd" at index 1), and that's the answer.
        # This means the initial `best_query_min_len` and `best_query_min_idx` should be initialized based on the best match for an empty suffix.
        # The `insert` method does not explicitly set `min_len`/`min_idx` for the `root` node itself.
        # However, the logic for updating `node.min_len` and `node.min_idx` happens *after* moving to the child node.

        # A simpler approach:
        # Let's track the best result *as we traverse*.
        # If `char not in node.children`, we should NOT break and stop. Instead, we should use the `best_query_min_len` and `best_query_min_idx` found SO FAR.
        # The problem is that the `node` variable represents the current depth in the Trie.
        # If we break, we lose the ability to use the `node.min_len` and `node.min_idx` information.
        # The `best_query_min_idx` needs to be updated based on the information from the *current* `node` *before* attempting to move to the next character.

        # Revised logic for query:
        node = self.root
        best_query_min_len = float('inf')
        best_query_min_idx = -1

        for char in reversed_word:
            # Check if there is a child for the current character.
            if char in node.children:
                node = node.children[char]
                # Now, at this `node`, we have information about the best word in `wordsContainer`
                # that has a suffix corresponding to the path from `self.root` to `node`.
                # We compare this information with the best found so far for the query.
                if node.min_len < best_query_min_len:
                    best_query_min_len = node.min_len
                    best_query_min_idx = node.min_idx
                elif node.min_len == best_query_min_len and node.min_idx < best_query_min_idx:
                    best_query_min_idx = node.min_idx
            else:
                # If the character is not found, it means the common suffix ends before this character.
                # The `best_query_min_idx` already holds the best found up to the previous matching node.
                # So we can break.
                break

        # After the loop, `best_query_min_idx` holds the index of the string that satisfies the conditions.
        # What if the query string is empty or no matching character is found at all?
        # For example, `wordsQuery = ["xyz"]` and `wordsContainer = ["abc"]`.
        # `reversed_word` for "xyz" is "zyx".
        # `root` node children: {'c': TrieNode(...) at index 0}.
        # First character 'z' is not in `root.children`. The loop `for char in reversed_word:` will `break` immediately.
        # `best_query_min_len` = inf, `best_query_min_idx` = -1. This is still problematic.
        # The problem is that the `best_query_min_idx` is only updated when `char in node.children` is true.
        # We need to consider the "base case" of the empty suffix if no matching prefix is found in the trie.
        # The "base case" for an empty suffix means considering all strings in `wordsContainer`.
        # The `insert` method populates `min_len` and `min_idx` for nodes. If no node is ever reached for a query,
        # it implies only an empty common suffix.

        # Let's rethink how `min_len` and `min_idx` are initialized and updated.
        # When we `insert`, we update `node.min_len` and `node.min_idx` *after* moving to the child.
        # This means `node.min_len` and `node.min_idx` at any given node represent the best word
        # *among those that have the suffix corresponding to the path to this node*.
        #
        # If the query "xyz" with container ["abcd","bcd","xbcd"] is processed:
        # `wordsContainer`: "abcd" (0), "bcd" (1), "xbcd" (2)
        # Reversed `wordsContainer`: "dcba" (0), "dcb" (1), "dcbx" (2)
        # Trie construction:
        # 'd': node_d (min_len=3, min_idx=1) [from "dcb"]
        #   'c': node_dc (min_len=3, min_idx=1) [from "dcb"]
        #     'b': node_dcb (min_len=3, min_idx=1) [from "dcb"]
        #       'a': node_dcba (min_len=4, min_idx=0) [from "dcba"]
        #       'x': node_dcbx (min_len=4, min_idx=2) [from "dcbx"]
        #
        # Query "xyz": reversed "zyx"
        # `node` = `self.root`
        # `best_query_min_len` = inf, `best_query_min_idx` = -1
        #
        # First char 'z': 'z' not in `self.root.children`. Loop breaks.
        # `best_query_min_idx` remains -1. This is WRONG.
        #
        # The issue is that when `break` happens, `best_query_min_idx` doesn't reflect the best for an empty suffix.
        # The "empty suffix" case means we consider all strings in `wordsContainer`.
        # We need to find the string with minimum length among all `wordsContainer` strings, and then minimum index.
        # This information should be implicitly available or explicitly calculated.
        #
        # Let's consider the `root` node's "best candidate" for the empty suffix.
        # The `insert` process doesn't directly update the root for an empty suffix.
        # The `min_len` and `min_idx` in the `TrieNode` class are initialized to `inf` and `-1`.
        # This implies that until a character is processed, no "best" is known for that path.
        #
        # What if we pre-calculate the overall best `min_len` and `min_idx` for the entire `wordsContainer` and store it?
        # This would be the result if no common characters are found.

        # Alternative strategy:
        # The Trie stores suffixes. When querying for `word`, we reverse `word` and traverse.
        # At each step `i` of the reversed `word`, we are looking at a suffix of length `i+1`.
        # We need to find the best word in `wordsContainer` that shares this suffix.
        # The `node.min_len` and `node.min_idx` at the current Trie node represent the best match
        # among `wordsContainer` strings that *end* with the characters traversed so far.
        #
        # Consider query `q`. Reversed `q` is `r_q`.
        # `root` node represents the empty string (suffix of length 0).
        # If `r_q` is empty (not possible by constraints), the answer is the best overall.
        # If `r_q` is not empty, we iterate through `char` in `r_q`:
        # If `char` exists in `node.children`:
        #   `node = node.children[char]`
        #   We now have a potential common suffix. The `node.min_len` and `node.min_idx` are candidate results.
        #   We update `best_query_min_len`, `best_query_min_idx` by comparing with `node.min_len`, `node.min_idx`.
        # If `char` does NOT exist:
        #   The common suffix ends here. The `best_query_min_idx` currently stored is the result for the longest common suffix found so far.
        #   We break.

        # The problem: what if `wordsContainer` is `["a", "b"]` and `wordsQuery` is `["c"]`?
        # Reversed `wordsContainer`: `["a", "b"]`. Reversed `wordsQuery`: `["c"]`.
        # Trie: root -> 'a' (idx=0, len=1), 'b' (idx=1, len=1).
        # Query "c" (reversed "c").
        # `node` = `root`.
        # `best_query_min_len` = inf, `best_query_min_idx` = -1.
        # First char 'c'. 'c' not in `root.children`. Loop breaks.
        # `best_query_min_idx` is -1.
        # But for "c", the longest common suffix is "" with both "a" and "b".
        # Shortest length is 1. Smallest index is 0 (for "a"). So answer should be 0.
        # This suggests that the initial `best_query_min_len` and `best_query_min_idx` should be set to the best match for the empty suffix.

        # How to get the best match for the empty suffix?
        # This means considering all strings in `wordsContainer`.
        # We can pre-calculate this.
        # `overall_min_len = float('inf')`
        # `overall_min_idx = -1`
        # `for i, word in enumerate(wordsContainer):`
        #   `if len(word) < overall_min_len:`
        #     `overall_min_len = len(word)`
        #     `overall_min_idx = i`
        #   `elif len(word) == overall_min_len and i < overall_min_idx:`
        #     `overall_min_idx = i`

        # Let's adjust the `query` function:

        node = self.root
        # Initialize with the best possible result for an empty common suffix.
        # This means finding the shortest word with the smallest index in `wordsContainer`.
        # We can calculate this once and pass it or compute it.
        # For now, let's assume it's handled by the Trie implicitly or we need to find it.

        # The Trie `insert` populates `min_len` and `min_idx` for nodes.
        # The `root` node's children are populated.
        # If `reversed_word` is empty, the loop doesn't run, returns -1.
        # If `reversed_word` starts with `c` and `c` is not a child of `root`, loop breaks.
        # The `best_query_min_idx` remains -1.

        # What if we initialize `best_query_min_len` and `best_query_min_idx`
        # to the best result found by traversing ONLY the root's immediate children,
        # if the first character doesn't match? This is complex.

        # Let's try a different perspective: the `min_len` and `min_idx` stored at a node `N`
        # represent the best `wordsContainer` string ending with the suffix that leads to `N`.
        #
        # For query `q`, reversed `r_q`:
        # `current_node` = `root`
        # `best_res_len` = `inf`, `best_res_idx` = -1
        #
        # For `char` in `r_q`:
        #   If `char` in `current_node.children`:
        #     `current_node` = `current_node.children[char]`
        #     # Now `current_node` holds info for the suffix ending with `char`.
        #     # Compare `current_node.min_len` and `current_node.min_idx` with `best_res_len` and `best_res_idx`.
        #     # Update `best_res_len` and `best_res_idx` if a better match is found.
        #     if current_node.min_len < best_res_len:
        #       best_res_len = current_node.min_len
        #       best_res_idx = current_node.min_idx
        #     elif current_node.min_len == best_res_len and current_node.min_idx < best_res_idx:
        #       best_res_idx = current_node.min_idx
        #   Else (char not found):
        #     # The longest common suffix found so far is represented by `best_res_idx`.
        #     # No further common suffix can be formed.
        #     break
        #
        # After the loop, `best_res_idx` is the answer.
        #
        # What if `wordsQuery = ["xyz"]` and `wordsContainer = ["abcd","bcd","xbcd"]`?
        # Reversed container: "dcba", "dcb", "dcbx"
        # Trie:
        # root -> 'd' -> 'c' -> 'b' -> 'a' (idx=0, len=4)
        #                      -> 'x' (idx=2, len=4)
        #                -> 'a' (from "dcba", len=4, idx=0, this is wrong, should be 'dcb' from "dcb")
        # Let's trace insertion more carefully:
        # "abcd" (0) -> reversed "dcba"
        # root.children['d'] = new_node_d1
        # node_d1.children['c'] = new_node_d2
        # node_d2.children['b'] = new_node_d3
        # node_d3.children['a'] = new_node_d4
        # At node_d1: len=4, idx=0.
        # At node_d2: len=4, idx=0.
        # At node_d3: len=4, idx=0.
        # At node_d4: len=4, idx=0.
        #
        # "bcd" (1) -> reversed "dcb"
        # root.children['d'] exists (node_d1). Move to node_d1.
        # node_d1.children['c'] exists (node_d2). Move to node_d2.
        # node_d2.children['b'] exists (node_d3). Move to node_d3.
        # Now update node_d3: len("bcd")=3 is < node_d3.min_len=4.
        # So, node_d3.min_len = 3, node_d3.min_idx = 1.
        #
        # "xbcd" (2) -> reversed "dcbx"
        # root.children['d'] exists (node_d1). Move to node_d1.
        # node_d1.children['c'] exists (node_d2). Move to node_d2.
        # node_d2.children['b'] exists (node_d3). Move to node_d3.
        # node_d3.children['x'] = new_node_d5
        # At node_d5: len("xbcd")=4. min_len=inf, min_idx=-1. So node_d5.min_len=4, node_d5.min_idx=2.
        #
        # Trie state after insertions:
        # root
        #   'd' (node_d1): min_len=3, min_idx=1  (This represents the suffix "d" itself, matched by "bcd")
        #     'c' (node_d2): min_len=3, min_idx=1  (Represents suffix "dc", matched by "bcd")
        #       'b' (node_d3): min_len=3, min_idx=1  (Represents suffix "dcb", matched by "bcd")
        #         'a' (node_d4): min_len=4, min_idx=0 (Represents suffix "dcba", matched by "abcd")
        #         'x' (node_d5): min_len=4, min_idx=2 (Represents suffix "dcbx", matched by "xbcd")
        #
        # Query "xyz", reversed "zyx"
        # `current_node` = `root`
        # `best_res_len` = inf, `best_res_idx` = -1
        #
        # char = 'z': 'z' not in `root.children`. Break.
        # `best_res_idx` = -1. Still wrong.

        # The fundamental issue is that when the loop breaks due to a mismatch, the `best_res_idx` is not updated to reflect the best match for the empty suffix.
        # The `min_len` and `min_idx` stored at any `TrieNode` represent the best match for the *specific suffix* represented by the path to that node.
        # If no part of the query string matches, we must revert to the "best overall" string in `wordsContainer`.
        # The "best overall" is the shortest string with the smallest index.

        # Pre-calculation for the empty suffix:
        overall_min_len = float('inf')
        overall_min_idx = -1
        for i, word in enumerate(wordsContainer):
            if len(word) < overall_min_len:
                overall_min_len = len(word)
                overall_min_idx = i
            elif len(word) == overall_min_len and i < overall_min_idx:
                overall_min_idx = i

        # Now, the query function:
        node = self.root
        # Initialize with the best possible result for an empty common suffix.
        best_query_min_len = overall_min_len
        best_query_min_idx = overall_min_idx

        for char in reversed_word:
            if char in node.children:
                node = node.children[char]
                # Compare the current node's best candidate with the best query result found so far.
                if node.min_len < best_query_min_len:
                    best_query_min_len = node.min_len
                    best_query_min_idx = node.min_idx
                elif node.min_len == best_query_min_len and node.min_idx < best_query_min_idx:
                    best_query_min_idx = node.min_idx
            else:
                # If a character in the reversed query word is not found in the Trie,
                # it means the common suffix ends here. The `best_query_min_idx` currently holds
                # the best result for the longest common suffix found up to this point.
                break

        # Return the final best index for this query.
        return best_query_min_idx


class Solution:
    def longestCommonSuffixQueries(self, wordsContainer: list[str], wordsQuery: list[str]) -> list[int]:
        # Create a Trie and insert all words from wordsContainer.
        trie = Trie()
        for i, word in enumerate(wordsContainer):
            trie.insert(word, i)

        # Pre-calculate the best result for the empty suffix case.
        # This is the shortest word in wordsContainer with the smallest index.
        overall_min_len = float('inf')
        overall_min_idx = -1
        for i, word in enumerate(wordsContainer):
            if len(word) < overall_min_len:
                overall_min_len = len(word)
                overall_min_idx = i
            elif len(word) == overall_min_len and i < overall_min_idx:
                overall_min_idx = i

        # Process each query.
        results = []
        for query_word in wordsQuery:
            # Perform the query on the Trie.
            # The query method is designed to handle initialization with the overall best
            # for the empty suffix case.
            results.append(trie.query(query_word, overall_min_len, overall_min_idx))

        return results

    # The Trie.query method needs to accept the pre-calculated best for empty suffix
    # to correctly initialize its best_query_min_len and best_query_min_idx.
    # Let's refactor Trie.query to accept these.

class TrieNode:
    def __init__(self):
        self.children = {}
        # min_len and min_idx at a node store the best match among wordsContainer
        # that have the suffix corresponding to the path leading to this node.
        self.min_len = float('inf')
        self.min_idx = -1

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word, index):
        reversed_word = word[::-1]
        node = self.root
        for char in reversed_word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            # Update the best match found for the suffix represented by this node.
            if len(word) < node.min_len:
                node.min_len = len(word)
                node.min_idx = index
            elif len(word) == node.min_len and index < node.min_idx:
                node.min_idx = index

    def query(self, word, overall_min_len, overall_min_idx):
        reversed_word = word[::-1]
        node = self.root
        # Initialize the best result found so far for this query.
        # It starts with the best possible result for an empty common suffix.
        best_query_min_len = overall_min_len
        best_query_min_idx = overall_min_idx

        for char in reversed_word:
            # Check if there's a child node for the current character.
            if char in node.children:
                node = node.children[char]
                # If a child exists, we have found a common suffix.
                # Compare the best match stored at this node with the best match found for the query so far.
                if node.min_len < best_query_min_len:
                    best_query_min_len = node.min_len
                    best_query_min_idx = node.min_idx
                elif node.min_len == best_query_min_len and node.min_idx < best_query_min_idx:
                    best_query_min_idx = node.min_idx
            else:
                # If the character is not found, it means the common suffix ends here.
                # The `best_query_min_idx` already holds the best result found for the longest common suffix
                # that matches up to the previous character. So, we break.
                break

        # Return the index of the best matching string found for this query.
        return best_query_min_idx


class Solution:
    def longestCommonSuffixQueries(self, wordsContainer: list[str], wordsQuery: list[str]) -> list[int]:
        # Initialize the Trie.
        trie = Trie()
        
        # Pre-calculate the overall best match for an empty common suffix.
        # This is the shortest string in `wordsContainer` with the smallest index.
        overall_min_len = float('inf')
        overall_min_idx = -1
        for i, word in enumerate(wordsContainer):
            if len(word) < overall_min_len:
                overall_min_len = len(word)
                overall_min_idx = i
            elif len(word) == overall_min_len and i < overall_min_idx:
                overall_min_idx = i

        # Insert all words from `wordsContainer` into the Trie.
        # Each word's index is also stored to resolve ties.
        for i, word in enumerate(wordsContainer):
            trie.insert(word, i)

        # Process each query string.
        results = []
        for query_word in wordsQuery:
            # Call the query method on the Trie, passing the pre-calculated overall best.
            # This ensures that even if no common characters are found, we return the best match
            # for the empty suffix case.
            results.append(trie.query(query_word, overall_min_len, overall_min_idx))

        return results

```