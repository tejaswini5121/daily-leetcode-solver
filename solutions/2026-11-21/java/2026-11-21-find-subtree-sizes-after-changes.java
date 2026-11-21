```java
import java.util.*;

// Problem: Find Subtree Sizes After Changes
// Link: https://leetcode.com/problems/find-subtree-sizes-after-changes/
// Approach:
// 1. Represent the tree using an adjacency list where each node stores its children.
// 2. For each node from 1 to n-1, find its closest ancestor with the same character.
//    This can be done by traversing up the parent links and keeping track of the character.
//    We can optimize this by pre-calculating for each character, the path from the root
//    to the current node and the last occurrence of that character.
// 3. Store the new parent for each node. Since changes happen simultaneously, we need
//    to store the new parent for all nodes before actually re-structuring the tree.
// 4. Build the new tree structure based on the new parent assignments.
// 5. Perform a DFS traversal from each node in the new tree to calculate its subtree size.
//
// Optimization for finding closest ancestor:
// For each node `x`, we want to find the closest ancestor `y` such that `s[x] == s[y]`.
// We can use a map for each character to store the path of ancestors with that character.
// `Map<Character, List<Integer>> charAncestors`: key is character, value is a list of ancestors' node indices in increasing order of depth.
//
// Time Complexity:
// - Building adjacency list: O(N)
// - Finding new parents: For each node, we might traverse up to its depth. In the worst case (a skewed tree), this could be O(N^2).
//   However, using a data structure that keeps track of the last seen ancestor for each character can optimize this.
//   If we maintain `Map<Character, Integer> lastAncestor` during a traversal from root, then for each node `i`,
//   finding `y` can be O(1) after O(N) precomputation.
//   Let's re-evaluate: If we iterate from root and keep track of the last seen ancestor for each character.
//   `Map<Character, Integer> lastSeenAncestorForChar`:
//   When processing node `u` with character `c = s[u]`:
//     `newParent[u] = lastSeenAncestorForChar.getOrDefault(c, -1)` (if not root).
//     Update `lastSeenAncestorForChar.put(c, u)`.
//   This needs careful handling as the changes are simultaneous. The problem states "closest node y to node x such that y is an ancestor of x".
//   This implies looking upwards from `x`.
//   A DFS approach from root, keeping track of the path and last seen character is better.
//   `Map<Character, Integer> lastAncestorMap`: stores the latest ancestor encountered for each character.
//   When visiting node `u`:
//     `char currentChar = s.charAt(u);`
//     `int newParentForU = -1;`
//     `if (lastAncestorMap.containsKey(currentChar)) {`
//       `newParentForU = lastAncestorMap.get(currentChar);`
//     `}`
//     `// Store this for later when constructing the new tree`
//     `newParent[u] = newParentForU;`
//     `// For children, we need to know the *current* parent as a potential ancestor`
//     `// The problem implies a search from x upwards to its ancestors.`
//     `// This means a DFS from root to build the tree is not directly applicable for finding the new parent.`
//
//   Corrected approach for finding new parents:
//   Iterate from node 1 to n-1. For each node `i`:
//     Traverse `curr = i` upwards using `parent` array.
//     While `parent[curr] != -1`:
//       `if (s.charAt(curr) == s.charAt(parent[curr]))`:
//         `newParent[i] = parent[curr];`
//         `break;`
//       `curr = parent[curr];`
//   This still looks like O(N^2) in worst case.
//
//   Let's use the map approach carefully. We need to identify the *new* parent.
//   The changes are simultaneous.
//   Let's precompute the *initial* tree structure.
//   `List<List<Integer>> adj = new ArrayList<>();`
//   `for (int i = 0; i < n; i++) adj.add(new ArrayList<>());`
//   `for (int i = 1; i < n; i++) adj.get(parent[i]).add(i);`
//
//   We need a way to find `y` efficiently for each `x`.
//   Consider a DFS from the root. At each node `u`, we maintain `Map<Character, Integer> lastSeen` which stores the last ancestor node index for each character.
//   `dfs_find_new_parents(u, p, s, adj, lastSeen, newParents)`
//     `char currentChar = s.charAt(u);`
//     `int potentialNewParent = lastSeen.getOrDefault(currentChar, -1);`
//     `newParents[u] = potentialNewParent;`
//     `// Store the current node `u` as the last seen for its character for its descendants.`
//     `int prevCharAncestor = lastSeen.get(currentChar); // Save for backtracking`
//     `lastSeen.put(currentChar, u);`
//
//     `for (int v : adj.get(u)) {`
//       `dfs_find_new_parents(v, u, s, adj, lastSeen, newParents);`
//     `}`
//     `// Backtrack: Restore the map for other branches`
//     `if (prevCharAncestor == null) {`
//       `lastSeen.remove(currentChar);`
//     `} else {`
//       `lastSeen.put(currentChar, prevCharAncestor);`
//     `}`
//   This DFS approach for finding new parents seems to work correctly given the problem statement's "simultaneous" nature and the goal of finding the *closest* ancestor.
//   The time complexity for finding new parents will be O(N) because of the DFS.
//
// 5. Build the final adjacency list for the modified tree.
//    `List<List<Integer>> finalAdj = new ArrayList<>();`
//    `for (int i = 0; i < n; i++) finalAdj.add(new ArrayList<>());`
//    `for (int i = 1; i < n; i++) {`
//      `if (newParents[i] != -1) {`
//        `finalAdj.get(newParents[i]).add(i);`
//      `} else {`
//        `// If newParent is -1, it means it's still a child of the original parent, but `
//        `// the problem states "remove the edge between x and its current parent and make node y the new parent of x".`
//        `// If y doesn't exist (newParent[i] == -1), it implies no change for this node and it stays with its original parent.`
//        `// This interpretation is crucial. Let's re-read: "Find the closest node y ... If node y does not exist, do nothing."`
//        `// "do nothing" means it remains attached to its current parent.`
//        `finalAdj.get(parent[i]).add(i);`
//      `}`
//    `}`
//
//   Let's rethink step 4. The problem states: "remove the edge between x and its current parent and make node y the new parent of x".
//   This implies if `y` exists, `x` becomes a child of `y`. If `y` does not exist, `x` *remains* a child of its original parent.
//   So, the `newParents` array should store the `y` if found, otherwise a sentinel value indicating to keep the old parent.
//   Actually, it's simpler. For each node `i` from 1 to n-1:
//   `int newParentFor_i = findClosestAncestor(i, parent, s);`
//   If `newParentFor_i != -1`, then `i` becomes a child of `newParentFor_i`.
//   If `newParentFor_i == -1`, then `i` remains a child of `parent[i]`.
//
//   The DFS approach `dfs_find_new_parents` calculates the `y` for node `u`.
//   `newParents[u]` stores the `y` for node `u`. If `y` is not found, it's -1.
//   So, if `newParents[u] == -1`, `u` stays with its original parent.
//
//   Reconstructing `finalAdj`:
//   `List<List<Integer>> finalAdj = new ArrayList<>();`
//   `for (int i = 0; i < n; i++) finalAdj.add(new ArrayList<>());`
//   `for (int i = 1; i < n; i++) {`
//     `if (newParents[i] != -1) { // If a new parent 'y' was found`
//       `finalAdj.get(newParents[i]).add(i); // 'i' becomes child of 'y'`
//     `} else { // If no such ancestor 'y' was found`
//       `finalAdj.get(parent[i]).add(i); // 'i' remains child of its original parent`
//     `}`
//   `}`
//
// 6. Calculate subtree sizes using DFS on `finalAdj`.
//    `dfs_calculate_size(u, finalAdj, subtreeSizes)`
//      `int size = 1;`
//      `for (int v : finalAdj.get(u)) {`
//        `size += dfs_calculate_size(v, finalAdj, subtreeSizes);`
//      `}`
//      `subtreeSizes[u] = size;`
//      `return size;`
//
// Time Complexity:
// - Building initial adjacency list: O(N)
// - Finding new parents using DFS: O(N) (each node visited once, map operations are amortized O(1) for character keys).
// - Building final adjacency list: O(N)
// - Calculating subtree sizes using DFS: O(N)
// Total Time Complexity: O(N)
//
// Space Complexity:
// - Adjacency list (initial and final): O(N)
// - `newParents` array: O(N)
// - `subtreeSizes` array: O(N)
// - `lastSeen` map in DFS: O(AlphabetSize) which is O(1) since alphabet is lowercase English letters.
// Total Space Complexity: O(N)
class Solution {
    public int[] findSubtreeSizesAfterChanges(int[] parent, String s) {
        int n = parent.length;

        // 1. Build the initial adjacency list representation of the tree.
        // This helps in performing DFS traversals.
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
        for (int i = 1; i < n; i++) {
            // Add node `i` as a child of its parent `parent[i]`.
            adj.get(parent[i]).add(i);
        }

        // Array to store the new parent for each node.
        // newParents[i] will store the closest ancestor `y` of node `i` such that s[i] == s[y].
        // If no such ancestor exists, newParents[i] will be -1.
        int[] newParents = new int[n];
        Arrays.fill(newParents, -1); // Initialize with -1, meaning no new parent found yet.

        // Map to keep track of the last seen ancestor for each character during DFS.
        // Key: character, Value: node index of the last ancestor seen with that character.
        Map<Character, Integer> lastSeenAncestorForChar = new HashMap<>();

        // 2. Perform DFS to find the closest ancestor for each node.
        // This DFS traverses the initial tree structure.
        dfsFindNewParents(0, s, adj, lastSeenAncestorForChar, newParents);

        // 3. Build the final adjacency list for the modified tree.
        List<List<Integer>> finalAdj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            finalAdj.add(new ArrayList<>());
        }

        // Iterate through all nodes from 1 to n-1 (root is handled implicitly as it has no parent to change).
        for (int i = 1; i < n; i++) {
            if (newParents[i] != -1) {
                // If a new parent `y` was found (newParents[i] != -1),
                // node `i` becomes a child of `y`.
                finalAdj.get(newParents[i]).add(i);
            } else {
                // If no such ancestor `y` was found (newParents[i] == -1),
                // node `i` remains a child of its original parent.
                // We need to find the original parent of `i`. Since we have the parent array, we can use it.
                // However, to ensure consistency and to avoid re-finding original parents,
                // we can implicitly assume if newParents[i] is -1, it stays with parent[i].
                // We only add edges for nodes that *change* their parent, or nodes that stay with original parent.
                // Let's reconstruct based on the original parent array for nodes that don't change.
                // This implies that if `newParents[i]` is -1, `i` is still a child of `parent[i]`.
                // This requires us to iterate through the original parent array again.
                // A cleaner way is to rebuild the entire finalAdj from scratch based on `newParents`.

                // The loop below correctly builds the `finalAdj` based on the `newParents` logic.
                // If `newParents[i]` is -1, it means node `i` *should have been* a child of its original parent.
                // However, the `newParents` array is populated only when a *new* parent is found.
                // The problem states: "If node y does not exist, do nothing." This implies the edge to the original parent is retained.
                // So, if `newParents[i]` is -1, it means node `i` is still a child of its `parent[i]`.
                finalAdj.get(parent[i]).add(i); // Add `i` as child of its original parent.
            }
        }


        // 4. Calculate the size of each subtree in the final tree using DFS.
        int[] subtreeSizes = new int[n];
        dfsCalculateSubtreeSizes(0, finalAdj, subtreeSizes);

        return subtreeSizes;
    }

    /**
     * Performs DFS to find the closest ancestor `y` for each node `u` such that s[u] == s[y].
     * This function populates the `newParents` array.
     *
     * @param u                      The current node being visited.
     * @param s                      The string of characters assigned to nodes.
     * @param adj                    The initial adjacency list of the tree.
     * @param lastSeenAncestorForChar A map tracking the last seen ancestor node for each character.
     * @param newParents             The array to store the computed new parent for each node.
     */
    private void dfsFindNewParents(int u, String s, List<List<Integer>> adj, Map<Character, Integer> lastSeenAncestorForChar, int[] newParents) {
        char currentChar = s.charAt(u);

        // Store the previous value for this character in the map for backtracking.
        // This is crucial because when we move to a sibling's subtree, we don't want
        // the current node `u` to be considered an ancestor for characters found in other branches.
        Integer previousAncestorWithSameChar = lastSeenAncestorForChar.get(currentChar);

        // If there's a previously seen ancestor with the same character,
        // this ancestor is the closest one for node `u`.
        if (lastSeenAncestorForChar.containsKey(currentChar)) {
            newParents[u] = lastSeenAncestorForChar.get(currentChar);
        }
        // else newParents[u] remains -1 (its initial value).

        // Update the map to consider the current node `u` as the latest ancestor
        // for its character, for its descendants.
        lastSeenAncestorForChar.put(currentChar, u);

        // Recursively call DFS for all children of the current node `u` in the initial tree.
        for (int v : adj.get(u)) {
            dfsFindNewParents(v, s, adj, lastSeenAncestorForChar, newParents);
        }

        // Backtrack: Restore the map to its state before visiting node `u`.
        // This is essential for correctness when traversing different branches of the tree.
        // If there was no previous ancestor, remove the entry.
        if (previousAncestorWithSameChar == null) {
            lastSeenAncestorForChar.remove(currentChar);
        } else {
            // Otherwise, restore the previous ancestor.
            lastSeenAncestorForChar.put(currentChar, previousAncestorWithSameChar);
        }
    }

    /**
     * Performs DFS to calculate the size of the subtree rooted at `u` in the final tree.
     *
     * @param u           The current node.
     * @param finalAdj    The adjacency list of the final tree structure.
     * @param subtreeSizes The array to store the computed subtree sizes.
     * @return The size of the subtree rooted at `u`.
     */
    private int dfsCalculateSubtreeSizes(int u, List<List<Integer>> finalAdj, int[] subtreeSizes) {
        // Initialize the size of the current subtree to 1 (for the node itself).
        int size = 1;

        // Recursively call DFS for all children of `u` in the final tree.
        for (int v : finalAdj.get(u)) {
            // Add the size of the child's subtree to the current node's subtree size.
            size += dfsCalculateSubtreeSizes(v, finalAdj, subtreeSizes);
        }

        // Store the computed subtree size for node `u`.
        subtreeSizes[u] = size;
        return size;
    }
}
```