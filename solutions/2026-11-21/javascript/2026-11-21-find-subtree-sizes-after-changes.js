// @leet
// Problem: Find Subtree Sizes After Changes
// Link: https://leetcode.com/problems/find-subtree-sizes-after-changes/
//
// Approach:
// The problem requires us to simulate re-parenting nodes in a tree based on character matches and then calculate subtree sizes.
// Since all changes happen simultaneously, we need to determine the final parent for each node *before* calculating subtree sizes.
// A key observation is that when re-parenting a node `x`, we are looking for the *closest* ancestor `y` with the same character.
// This suggests a Depth-First Search (DFS) approach.
//
// For each node `x` (from 1 to n-1), we need to find its new parent.
// We can do this by traversing up from `x` towards the root. For each ancestor encountered, we check if its character matches `s[x]`. The first such ancestor we find is `y`.
// To efficiently find ancestors and their characters, we can pre-process the tree into an adjacency list representation.
//
// However, the problem states "simultaneously for all nodes x from 1 to n - 1". This means we cannot simply iterate and re-parent one by one because a re-parenting operation for node `x` might affect the path to an ancestor for another node `z`.
//
// A better approach is to determine the *final parent* for each node first.
// We can iterate through nodes from 1 to n-1. For each node `x`, we traverse upwards towards the root. We need to keep track of the *current effective parent* of `x` as we traverse up.
//
// Let's maintain an array `newParent` of size `n`, initialized with the original `parent` array.
// For each node `x` from 1 to `n-1`:
//   Start with `current_node = x`.
//   While `current_node` is not the root (i.e., `newParent[current_node] != -1`):
//     Let `parent_of_current = newParent[current_node]`.
//     If `s[x] == s[parent_of_current]`:
//       // Found the closest ancestor `y` with the same character.
//       // Set `y` as the new parent of `x`.
//       `newParent[x] = parent_of_current`;
//       // Break the inner loop since we've found the new parent for `x`.
//       break;
//     Else:
//       // Move up to the next ancestor.
//       `current_node = parent_of_current`;
//   // If the loop finishes without finding a suitable ancestor, `newParent[x]` remains its original parent (or effectively -1 if it was root's child and no match found).
//
// This approach ensures that for each `x`, we are finding its new parent based on the *original* parent structure, and then we update `newParent[x]`. The key is that we are looking for the closest *ancestor* of `x` in the *original* tree structure that matches `s[x]`. The problem statement is a bit tricky here. "closest node y to node x such that y is an ancestor of x" implies we search upwards from `x`. The crucial part is "remove the edge between x and its current parent and make node y the new parent of x". This suggests that `y` itself might have been re-parented.
//
// Let's re-read: "The parent of node 3 will change from node 1 to node 0."
// In Example 1: parent = [-1,0,0,1,1,1], s = "abaabc"
// Node 0: 'a', Node 1: 'b', Node 2: 'a', Node 3: 'a', Node 4: 'b', Node 5: 'c'
//
// Consider node 3: s[3] = 'a'. Its parent is 1 (s[1] = 'b').
// Ancestors of 3: 1, 0.
// s[3] = 'a'.
// Check ancestor 1: s[1] = 'b'. No match.
// Check ancestor 0: s[0] = 'a'. Match!
// Closest ancestor `y` is 0.
// So, node 3's new parent becomes 0. The edge (1, 3) is removed, and (0, 3) is added.
// This is consistent with the example explanation.
//
// The critical part is "simultaneously". If node 1 is re-parented, it should not affect the search for node 3's new parent *within this step*. We need to establish all new parent relationships based on the *initial* tree structure.
//
// Let's refine the `newParent` determination:
// We can iterate through each node `x` from 1 to `n-1`. For each `x`, we find its *final* parent by looking up its original ancestors.
//
// Data structures:
// 1. Adjacency list: `adj` where `adj[u]` stores children of `u`.
// 2. `s`: input string.
// 3. `parent`: input array.
// 4. `newParent`: an array to store the final parent of each node. Initialize `newParent` with `parent`.
//
// Algorithm:
// 1. Build the adjacency list `adj` from `parent`.
// 2. Initialize `newParent` array with values from `parent`.
// 3. For each node `i` from 1 to `n-1`:
//    Let `curr = i`.
//    While `curr` has a parent in the *original* tree structure (i.e., `parent[curr] != -1`):
//      Let `p = parent[curr]`.
//      If `s[i] == s[p]`:
//        // Found the closest ancestor `p` with matching character.
//        // This `p` is the *original* parent.
//        // Update `newParent[i]` to this `p`.
//        `newParent[i] = p`;
//        break; // Move to the next node `i`.
//      Else:
//        // Continue moving up the original parent chain.
//        `curr = p`;
//
// This still has a potential issue: what if `p` itself was re-parented?
// The problem states: "Find the closest node y to node x such that y is an ancestor of x, and s[x] == s[y]." and then "remove the edge between x and its current parent and make node y the new parent of x".
// This implies that `y` must be an ancestor of `x` in the *initial* tree.
// If `y` had its parent changed, that new parent doesn't matter for `x`'s re-parenting decision. We are looking for an ancestor in the original tree structure.
//
// Let's rethink the "simultaneous" aspect. If we determine the new parent for each node *independently* based on the original tree structure, and then build a new tree, that's simultaneous.
//
// Example 1 again: parent = [-1,0,0,1,1,1], s = "abaabc"
// Initial tree structure:
// 0 (a)
// |- 1 (b)
// |  |- 3 (a)
// |  |- 4 (b)
// |- 2 (a)
//
// Node 1: s[1]='b'. Parent 0 (s[0]='a'). Ancestors: 0. s[1]!=s[0]. No change. `newParent[1]=0`.
// Node 2: s[2]='a'. Parent 0 (s[0]='a'). Ancestors: 0. s[2]==s[0]. `newParent[2]=0`.
// Node 3: s[3]='a'. Parent 1 (s[1]='b'). Ancestors: 1, 0.
//   Check 1: s[3]='a', s[1]='b'. No match.
//   Check 0: s[3]='a', s[0]='a'. Match! `newParent[3]=0`.
// Node 4: s[4]='b'. Parent 1 (s[1]='b'). Ancestors: 1, 0.
//   Check 1: s[4]='b', s[1]='b'. Match! `newParent[4]=1`.
// Node 5: s[5]='c'. Parent 1 (s[1]='b'). Ancestors: 1, 0.
//   Check 1: s[5]='c', s[1]='b'. No match.
//   Check 0: s[5]='c', s[0]='a'. No match. No ancestor found. `newParent[5]` remains 1.
//
// Final `newParent` based on this interpretation: `[-1, 0, 0, 0, 1, 1]`
//
// Now, let's build the final tree using these `newParent` values.
// We need a way to represent the final tree. We can use an adjacency list for children.
// `finalAdj`:
// 0: [2, 3] (children 2 and 3 now point to 0)
// 1: [4]   (child 4 still points to 1)
// 2: []
// 3: []
// 4: []
// 5: [] (node 5's parent is 1, but its edge is *removed* and replaced by another edge *to* node y. If no y is found, it seems like it stays with its parent. The example explanation for node 3 is "The parent of node 3 will change from node 1 to node 0." this implies it gets re-parented. If it doesn't get re-parented, does it remain a child of 1? "remove the edge between x and its current parent and make node y the new parent of x". If y does not exist, "do nothing". This implies the edge remains. So node 5's parent is 1.
//
// Wait, if node 5's parent remains 1, then 1 is still its parent.
//
// Let's carefully re-evaluate example 1 output: [6,3,1,1,1,1]
// Subtree sizes:
// Node 0: 6
// Node 1: 3
// Node 2: 1
// Node 3: 1
// Node 4: 1
// Node 5: 1
//
// This means the final tree structure is:
// 0 is root. Its children must sum up to 5 nodes.
// If node 0 has children X, Y, Z... then size[0] = 1 + size[X] + size[Y] + size[Z]...
//
// Given subtree sizes:
// Node 5 size 1, Node 4 size 1, Node 3 size 1, Node 2 size 1. These are leaves.
//
// Node 1 has size 3. This means its children sum up to 2 nodes. The leaves are 4 and 5. So, node 1 must have children 4 and 5.
//   Tree:
//   1
//  / \
// 4   5
//
// Node 0 has size 6. It has 1 (root) + subtree size of its children. Total 5 nodes are its children's subtrees.
// The remaining nodes are 2 and 3.
// So node 0 must have children 1 and 2, and 3.
//
// If node 0 has children 1, 2, and 3:
// Tree:
//      0
//    / | \
//   1  2  3
//  / \
// 4   5
//
// Let's check this tree with the original rules and parent array.
// Initial parent: [-1,0,0,1,1,1], s = "abaabc"
//
// Node 1: s[1]='b'. Parent 0 (s[0]='a'). Ancestors: 0. s[1]!=s[0]. No re-parent.
// Node 2: s[2]='a'. Parent 0 (s[0]='a'). Ancestors: 0. s[2]==s[0]. Re-parent 2 to 0.
// Node 3: s[3]='a'. Parent 1 (s[1]='b'). Ancestors: 1, 0.
//   Check 1: s[3]='a', s[1]='b'. No match.
//   Check 0: s[3]='a', s[0]='a'. Match. Re-parent 3 to 0.
// Node 4: s[4]='b'. Parent 1 (s[1]='b'). Ancestors: 1, 0.
//   Check 1: s[4]='b', s[1]='b'. Match. Re-parent 4 to 1.
// Node 5: s[5]='c'. Parent 1 (s[1]='b'). Ancestors: 1, 0.
//   Check 1: s[5]='c', s[1]='b'. No match.
//   Check 0: s[5]='c', s[0]='a'. No match. No ancestor found. So node 5 remains child of 1.
//
//
// Okay, the definition of "closest node y to node x such that y is an ancestor of x" might be key.
// "y is an ancestor of x" means y is on the path from x to the root.
// The "closest" implies the one with the shortest path (fewest edges).
//
// Let's trace again, focusing on the `newParent` array determination first.
//
// `parent = [-1,0,0,1,1,1]`, `s = "abaabc"`
// `n = 6`
// `newParent = [-1, 0, 0, 1, 1, 1]` (initial copy)
//
// For `i = 1` (node 1, char 'b'):
//   Original parent is 0 (char 'a').
//   Ancestors of 1: [0].
//   s[1] ('b') == s[0] ('a')? No.
//   No ancestor matches. `newParent[1]` remains 0.
//
// For `i = 2` (node 2, char 'a'):
//   Original parent is 0 (char 'a').
//   Ancestors of 2: [0].
//   s[2] ('a') == s[0] ('a')? Yes.
//   Closest ancestor `y` is 0.
//   `newParent[2] = 0`.
//
// For `i = 3` (node 3, char 'a'):
//   Original parent is 1 (char 'b').
//   Ancestors of 3 (in original tree): 1, then 0.
//   Check ancestor 1: s[3] ('a') == s[1] ('b')? No.
//   Check ancestor 0: s[3] ('a') == s[0] ('a')? Yes.
//   Closest ancestor `y` is 0.
//   `newParent[3] = 0`.
//
// For `i = 4` (node 4, char 'b'):
//   Original parent is 1 (char 'b').
//   Ancestors of 4 (in original tree): 1, then 0.
//   Check ancestor 1: s[4] ('b') == s[1] ('b')? Yes.
//   Closest ancestor `y` is 1.
//   `newParent[4] = 1`.
//
// For `i = 5` (node 5, char 'c'):
//   Original parent is 1 (char 'b').
//   Ancestors of 5 (in original tree): 1, then 0.
//   Check ancestor 1: s[5] ('c') == s[1] ('b')? No.
//   Check ancestor 0: s[5] ('c') == s[0] ('a')? No.
//   No ancestor found. `newParent[5]` remains 1.
//
// So, the `newParent` array is: `[-1, 0, 0, 0, 1, 1]`.
// This means the final parent relationships are:
// 0 is parent of 2, 3.
// 1 is parent of 4, 5.
// Root is 0.
//
// This leads to the tree structure:
//      0
//    / | \
//   1  2  3  <- wait, where did 1 come from?
//  / \
// 4   5
//
// This means node 1 is still a child of 0.
//
// Let's build the final adjacency list based on `newParent`:
// `finalAdj` (children list):
// 0: [1, 2, 3]  (node 1's parent is 0, node 2's parent is 0, node 3's parent is 0)
// 1: [4, 5]    (node 4's parent is 1, node 5's parent is 1)
// 2: []
// 3: []
// 4: []
// 5: []
//
// Now, calculate subtree sizes using DFS on `finalAdj`.
//
// `dfs_size(u)` function:
//   `size = 1`
//   For each child `v` in `finalAdj[u]`:
//     `size += dfs_size(v)`
//   Return `size`
//
// `finalAdj`:
// 0: [1, 2, 3]
// 1: [4, 5]
// 2: []
// 3: []
// 4: []
// 5: []
//
// dfs_size(5) = 1
// dfs_size(4) = 1
// dfs_size(3) = 1
// dfs_size(2) = 1
// dfs_size(1) = 1 + dfs_size(4) + dfs_size(5) = 1 + 1 + 1 = 3
// dfs_size(0) = 1 + dfs_size(1) + dfs_size(2) + dfs_size(3) = 1 + 3 + 1 + 1 = 6
//
// Resulting answer array: [6, 3, 1, 1, 1, 1]
// This matches Example 1 output!
//
// The key insight is that when determining the new parent `y` for node `x`, `y` must be an ancestor of `x` in the *original* tree structure. The decision for `x` is independent of whether its original ancestors were re-parented. We simply look up the chain of original parents.
//
// Implementation details:
// 1. Build the original tree structure (adjacency list for children) from `parent`. This is not strictly necessary for finding the new parent, but it helps conceptualize. We *do* need to iterate up the parent chain.
// 2. Initialize `newParent` array with original `parent` values.
// 3. Iterate through nodes `i` from 1 to `n-1`. For each `i`, traverse up its original parent chain. If a matching character ancestor `p` is found, update `newParent[i] = p` and break.
// 4. Build a `finalAdj` list from the `newParent` array.
// 5. Perform DFS from the root (node 0) on `finalAdj` to calculate subtree sizes.
//
// Time Complexity:
// - Building `newParent`: For each node `i` (from 1 to n-1), we traverse up to its root. In the worst case (a chain), this is O(n) for each node. Total: O(n^2). This is too slow for n=10^5.
//
// We need to optimize finding the ancestor.
//
// Optimization for finding ancestor:
// For a node `i`, we need to find the closest ancestor `p` in the original tree such that `s[i] == s[p]`.
// Instead of re-traversing from `i` every time, we can use DFS.
// When we DFS from the root:
// `dfs_find_new_parent(u, current_path_parents)`
// `current_path_parents` would store ancestors. This can get large.
//
// Alternative: For each node `u`, we want to find the nearest ancestor `v` such that `s[u] == s[v]`.
//
// Consider DFS traversal. As we go down, we maintain the path of ancestors.
// `dfs(node, parent_node, path_chars)`
// `path_chars` could be a map: `char -> nearest_ancestor_index_with_that_char`.
//
// `dfs_build_new_tree(u, parent_map, final_adj)`
// `parent_map`: `char -> index` of the most recent ancestor with that character.
//
// `dfs_build_new_tree(u, char_ancestor_map, final_adj, newParent)`
// `char_ancestor_map`: `Map<Character, Integer>` where key is character, value is the node ID of the closest ancestor with that character.
//
// `char_ancestor_map` stores `s[ancestor] -> ancestor_id`.
//
// Function `dfs_determine_new_parents(u, parent_chain_map, final_adj_children, new_parent_arr, s)`:
//   `char_ancestor_map = new Map()` // char -> node_id of nearest ancestor with this char
//
//   // Add current node's char and ID to the map if it's not root.
//   // The root (node 0) will be handled implicitly or added first.
//   // Let's process nodes from 1 to n-1 for re-parenting.
//
//   The issue with DFS is that it processes children before siblings. The problem is about finding ancestors.
//
//   Let's reconsider the O(N^2) approach:
//   For node `i`:
//     `curr = i`
//     `while parent[curr] != -1:`
//       `p = parent[curr]`
//       `if s[i] == s[p]:`
//         `newParent[i] = p`
//         `break`
//       `curr = p`
//
//   This is O(N^2) because the parent traversal could be O(N) for each of N nodes.
//   We need to make the ancestor search faster.
//
//   For a fixed node `i`, we are looking for `p = parent[parent[...parent[i]...]]` such that `s[i] == s[p]`.
//   This can be viewed as finding the first ancestor `p` on the path from `i` to root such that `s[p]` matches `s[i]`.
//
//   Consider DFS. When we visit node `u`:
//   We can pass down a map of `character -> index of ancestor with that char`.
//   `dfs(u, current_ancestors_by_char)`
//   `current_ancestors_by_char`: map `char -> node_id`.
//
//   `dfs_find_new_parents(u, char_to_ancestor_id, final_adj_children, new_parent_arr, s)`:
//     `// char_to_ancestor_id maps char -> node_id`
//
//     `// For the current node `u`, find its new parent.`
//     `// If `u` is not root (u > 0):`
//       `target_char = s[u]`
//       `if char_to_ancestor_id.has(target_char):`
//         `new_parent_id = char_to_ancestor_id.get(target_char)`
//         `new_parent_arr[u] = new_parent_id`
//
//     `// Store the current node `u` and its character `s[u]` in the map for its children.`
//     `original_char_at_u = s[u]`
//     `original_ancestor_id_for_char = char_to_ancestor_id.get(original_char_at_u)`
//     `char_to_ancestor_id.set(original_char_at_u, u)`
//
//     `// Recurse on children.`
//     `for child in final_adj_children[u]:`
//       `dfs_find_new_parents(child, char_to_ancestor_id, final_adj_children, new_parent_arr, s)`
//
//     `// Backtrack: Restore the map to its state before visiting `u`.`
//     `char_to_ancestor_id.delete(original_char_at_u)`
//     `if original_ancestor_id_for_char !== undefined:`
//       `char_to_ancestor_id.set(original_char_at_u, original_ancestor_id_for_char)`
//     `else:`
//       `char_to_ancestor_id.delete(original_char_at_u)`
//
//   This DFS approach seems promising.
//   1. Build the initial adjacency list `adj` from `parent`.
//   2. Initialize `newParent` array with original `parent` values.
//   3. Initialize `char_to_ancestor_id = new Map()`.
//   4. Call `dfs_find_new_parents(0, char_to_ancestor_id, adj, newParent, s)`.
//      - The root (node 0) will not find a new parent via the map lookup. Its new parent remains -1.
//      - When processing children, the map `char_to_ancestor_id` will contain the correct closest ancestor information.
//   5. After the DFS, `newParent` will hold the final parent for each node.
//   6. Build `finalAdj` from `newParent`.
//   7. Perform DFS to calculate subtree sizes.
//
//   Time Complexity of DFS for `newParent`:
//   Each node is visited once. Map operations (get, set, delete) are O(1) on average for hash maps.
//   Building `adj`: O(N).
//   DFS for `newParent`: O(N).
//   Building `finalAdj`: O(N).
//   DFS for subtree sizes: O(N).
//   Total Time Complexity: O(N).
//
//   Space Complexity:
//   `adj`: O(N)
//   `newParent`: O(N)
//   `char_to_ancestor_id` map: At most 26 entries (for lowercase English letters). O(1) as alphabet size is constant.
//   Recursion stack for DFS: O(N) in worst case (skewed tree).
//   `finalAdj`: O(N)
//   `answer` array: O(N)
//   Total Space Complexity: O(N).
//
// Let's refine the DFS function signature and logic for `dfs_find_new_parents`:
//
// `dfs_determine_new_parents(u, char_ancestor_map, adj, new_parent_arr, s)`:
//   `// char_ancestor_map: Map<char, node_id>`
//
//   `// For node `u`, find its new parent.`
//   `// If `u` is not root (u > 0), check if a matching ancestor exists.`
//   `if (u > 0) {`
//     `const target_char = s[u];`
//     `if (char_ancestor_map.has(target_char)) {`
//       `const new_parent_id = char_ancestor_map.get(target_char);`
//       `new_parent_arr[u] = new_parent_id;`
//     `}`
//   `}`
//
//   `// Store `s[u]` and `u` in the map for its descendants.`
//   `const original_char_at_u = s[u];`
//   `const ancestor_id_for_char_before = char_ancestor_map.get(original_char_at_u); // Store previous value to restore`
//   `char_ancestor_map.set(original_char_at_u, u);`
//
//   `// Recurse on children.`
//   `for (const child of adj[u]) {`
//     `dfs_determine_new_parents(child, char_ancestor_map, adj, new_parent_arr, s);`
//   `}`
//
//   `// Backtrack: Restore the map.`
//   `char_ancestor_map.delete(original_char_at_u);`
//   `if (ancestor_id_for_char_before !== undefined) {`
//     `char_ancestor_map.set(original_char_at_u, ancestor_id_for_char_before);`
//   `}`
//
//
//
// Initial call:
// `const adj = Array.from({ length: n }, () => []);`
// `for (let i = 1; i < n; i++) { adj[parent[i]].push(i); }`
//
// `const newParent = [...parent]; // Copy original parent`
// `const char_ancestor_map = new Map();`
// `dfs_determine_new_parents(0, char_ancestor_map, adj, newParent, s);`
//
// After this DFS, `newParent` is populated correctly.
//
// Then, build `finalAdj` and do size DFS.
//
// `const finalAdj = Array.from({ length: n }, () => []);`
// `for (let i = 1; i < n; i++) {`
//   `// Note: newParent[0] is -1. We only add edges for nodes i > 0.`
//   `// If newParent[i] is valid (>= 0), add i as a child of newParent[i].`
//   `if (newParent[i] !== -1) {`
//     `finalAdj[newParent[i]].push(i);`
//   `}`
// `}`
//
// `const answer = new Array(n);`
// `function dfs_calculate_size(u) {`
//   `let size = 1;`
//   `for (const v of finalAdj[u]) {`
//     `size += dfs_calculate_size(v);`
//   `}`
//   `answer[u] = size;`
//   `return size;`
// `}`
// `dfs_calculate_size(0);`
//
// This looks solid.
//
// Example 2 trace:
// parent = [-1,0,4,0,1], s = "abbba"
// n = 5
//
// Initial adj:
// 0: [1, 3]
// 1: [4]
// 2: [] (child of 4) - Oh, parent[2]=4. So 4 is parent of 2.
// 3: [] (child of 0)
// 4: [2] (child of 1)
//
// Initial adj list construction:
// parent = [-1,0,4,0,1]
// 0: children 1, 3
// 1: child 4
// 2: child is NOT in parent array as parent[i] is parent of i.
// Correct adj construction:
// adj[parent[i]].push(i)
//
// parent[0] = -1 (root)
// parent[1] = 0  => 0 has child 1
// parent[2] = 4  => 4 has child 2
// parent[3] = 0  => 0 has child 3
// parent[4] = 1  => 1 has child 4
//
// Initial adj:
// 0: [1, 3]
// 1: [4]
// 2: []
// 3: []
// 4: [2]
//
// s = "abbba"
// Node 0: a
// Node 1: b
// Node 2: b
// Node 3: b
// Node 4: a
//
// newParent = [-1, 0, 4, 0, 1] (initial copy)
// char_ancestor_map = new Map()
//
// Call dfs_determine_new_parents(0, map, adj, newParent, s)
//
// dfs(0, map={}, adj, newParent, s="abbba")
//   u=0. `u>0` is false.
//   Store s[0]='a' -> 0. map={'a':0}.
//   Children of 0: [1, 3]
//
//   dfs(1, map={'a':0}, adj, newParent, s="abbba")
//     u=1. `u>0` is true.
//     target_char = s[1] = 'b'.
//     map.has('b')? No.
//     Store s[1]='b' -> 1. map={'a':0, 'b':1}.
//     Children of 1: [4]
//
//     dfs(4, map={'a':0, 'b':1}, adj, newParent, s="abbba")
//       u=4. `u>0` is true.
//       target_char = s[4] = 'a'.
//       map.has('a')? Yes. new_parent_id = map.get('a') = 0.
//       newParent[4] = 0. (Original newParent[4] was 1)
//       Store s[4]='a' -> 4. (Previous was 'a'->0. Now overwrite.) map={'a':4, 'b':1}.
//       Children of 4: [2]
//
//       dfs(2, map={'a':4, 'b':1}, adj, newParent, s="abbba")
//         u=2. `u>0` is true.
//         target_char = s[2] = 'b'.
//         map.has('b')? Yes. new_parent_id = map.get('b') = 1.
//         newParent[2] = 1. (Original newParent[2] was 4)
//         Store s[2]='b' -> 2. (Previous was 'b'->1. Now overwrite.) map={'a':4, 'b':2}.
//         Children of 2: [] (no children)
//         Backtrack from 2: delete 'b'. map={'a':4, 'b':1}. Restore 'b' to 1. map={'a':4, 'b':1}.
//       Backtrack from 4: delete 'a'. map={'b':1}. Restore 'a' to 0. map={'a':0, 'b':1}.
//     Backtrack from 1: delete 'b'. map={'a':0}. Restore 'b' to undefined. map={'a':0}.
//
//   dfs(3, map={'a':0}, adj, newParent, s="abbba")
//     u=3. `u>0` is true.
//     target_char = s[3] = 'b'.
//     map.has('b')? No.
//     Store s[3]='b' -> 3. map={'a':0, 'b':3}.
//     Children of 3: []
//     Backtrack from 3: delete 'b'. map={'a':0}. Restore 'b' to undefined. map={'a':0}.
//
// Backtrack from 0: delete 'a'. map={}. Restore 'a' to undefined. map={}.
//
// Final `newParent` array:
// Initial: [-1, 0, 4, 0, 1]
// After dfs: [-1, 0, 1, 0, 0]
//
// Final parent relationships:
// Node 0: parent -1
// Node 1: parent 0
// Node 2: parent 1
// Node 3: parent 0
// Node 4: parent 0
//
// Build `finalAdj`:
// 0: [1, 3, 4]
// 1: [2]
// 2: []
// 3: []
// 4: []
//
// Calculate subtree sizes using `finalAdj`:
// dfs_size(2) = 1
// dfs_size(3) = 1
// dfs_size(4) = 1
// dfs_size(1) = 1 + dfs_size(2) = 1 + 1 = 2
// dfs_size(0) = 1 + dfs_size(1) + dfs_size(3) + dfs_size(4) = 1 + 2 + 1 + 1 = 5
//
// Answer: [5, 2, 1, 1, 1]
// This matches Example 2 output!
//
// The DFS approach for determining new parents is correct and efficient.
//
// Need to implement the DFS carefully for backtracking.
// When restoring `char_ancestor_map`, if `ancestor_id_for_char_before` was undefined, it means that character was not present among the ancestors of `u`'s siblings. So, after `u` is processed, this character should be removed from the map if it was the *only* occurrence of that character in the path leading to `u`.
//
// More precise backtracking logic:
// `const original_char_at_u = s[u];`
// `const ancestor_id_that_was_set_before = char_ancestor_map.get(original_char_at_u); // This is what `u` *replaces*. Might be undefined.`
//
// `char_ancestor_map.set(original_char_at_u, u);` // `u` is now the closest ancestor for its descendants.
//
// `// Recurse...`
//
// `// Backtrack:`
// `char_ancestor_map.delete(original_char_at_u);` // Remove `u`'s entry.
// `if (ancestor_id_that_was_set_before !== undefined) {`
//   `// If there was an ancestor `v` with this char before `u`'s entry was set,`
//   // restore that `v` as the closest ancestor for siblings/cousins.`
//   `char_ancestor_map.set(original_char_at_u, ancestor_id_that_was_set_before);`
// `}`
//
// This logic ensures that `char_ancestor_map` always reflects the closest ancestor for nodes at the current or deeper level.
//
// Final check of constraints and edge cases:
// n = 1: parent=[-1], s="a". adj=[[]]. newParent=[-1]. dfs(0, map, adj, [-1], "a") -> u=0, not >0, map={'a':0}. No children. Backtrack. finalAdj=[[]]. dfs_size(0)=1. answer=[1]. Correct.
// All characters same: s="aaa".
// parent=[-1,0,0,1,1]. n=5.
// adj: 0:[1,2], 1:[3,4]
//
// dfs(0, {}, adj, newParent, s="aaa")
//   u=0, map={'a':0}
//   dfs(1, {'a':0}, adj, newParent, s="aaa")
//     u=1, s[1]='a', map.has('a'), new_parent=0. newParent[1]=0. map={'a':1}
//     dfs(3, {'a':1}, adj, newParent, s="aaa")
//       u=3, s[3]='a', map.has('a'), new_parent=1. newParent[3]=1. map={'a':3}
//       Children of 3: []
//       Backtrack 3: delete 'a'. map={'a':1}. Restore 'a' to 1. map={'a':1}.
//     dfs(4, {'a':1}, adj, newParent, s="aaa")
//       u=4, s[4]='a', map.has('a'), new_parent=1. newParent[4]=1. map={'a':4}
//       Children of 4: []
//       Backtrack 4: delete 'a'. map={'a':1}. Restore 'a' to 1. map={'a':1}.
//     Backtrack 1: delete 'a'. map={}. Restore 'a' to 0. map={'a':0}.
//   dfs(2, {'a':0}, adj, newParent, s="aaa")
//     u=2, s[2]='a', map.has('a'), new_parent=0. newParent[2]=0. map={'a':2}
//     Children of 2: []
//     Backtrack 2: delete 'a'. map={}. Restore 'a' to 0. map={'a':0}.
//   Backtrack 0: delete 'a'. map={}. Restore 'a' to undefined. map={}.
//
// newParent: [-1, 0, 0, 1, 1]
// This is NOT the same as example 1. Let's check example 1.
// parent = [-1,0,0,1,1,1], s = "abaabc"
// newParent was calculated as [-1, 0, 0, 0, 1, 1]
// The trace for example 1 seemed correct.
//
// What's different? "all nodes x from 1 to n - 1" implies we are determining the *new parent of x*.
// The DFS logic: `new_parent_arr[u] = new_parent_id;` correctly sets the new parent of `u`.
//
// Let's retrace the "all same char" case:
// parent = [-1,0,0,1,1], s = "aaa"
// Initial adj:
// 0: [1, 2]
// 1: [3, 4]
// 2: []
// 3: []
// 4: []
//
// newParent = [-1, 0, 0, 1, 1]
//
// dfs(0, {}, adj, newParent, s="aaa")
//   u=0. Map update: {'a': 0}.
//   Children of 0: [1, 2]
//
//   dfs(1, {'a': 0}, adj, newParent, s="aaa")
//     u=1. s[1]='a'. Map has 'a'. new_parent_id = 0. newParent[1] = 0.
//     Map update: {'a': 1} (previous was 0, now 1 is closer).
//     Children of 1: [3, 4]
//
//     dfs(3, {'a': 1}, adj, newParent, s="aaa")
//       u=3. s[3]='a'. Map has 'a'. new_parent_id = 1. newParent[3] = 1.
//       Map update: {'a': 3}.
//       Children of 3: []
//       Backtrack 3: Delete 'a'. Restoring value was 1. Map becomes {'a': 1}.
//
//     dfs(4, {'a': 1}, adj, newParent, s="aaa")
//       u=4. s[4]='a'. Map has 'a'. new_parent_id = 1. newParent[4] = 1.
//       Map update: {'a': 4}.
//       Children of 4: []
//       Backtrack 4: Delete 'a'. Restoring value was 1. Map becomes {'a': 1}.
//
//     Backtrack 1: Delete 'a'. Restoring value was 0. Map becomes {'a': 0}.
//
//   dfs(2, {'a': 0}, adj, newParent, s="aaa")
//     u=2. s[2]='a'. Map has 'a'. new_parent_id = 0. newParent[2] = 0.
//     Map update: {'a': 2}.
//     Children of 2: []
//     Backtrack 2: Delete 'a'. Restoring value was 0. Map becomes {'a': 0}.
//
//   Backtrack 0: Delete 'a'. Restoring value was undefined. Map becomes {}.
//
// Final newParent: [-1, 0, 0, 1, 1]
//
// Final adj construction:
// newParent: [-1, 0, 0, 1, 1]
// 0: children 1, 2
// 1: children 3, 4
// 2: []
// 3: []
// 4: []
//
// This means the tree structure is:
//      0
//     / \
//    1   2
//   / \
//  3   4
//
// Subtree sizes:
// size(3)=1, size(4)=1, size(2)=1
// size(1) = 1 + size(3) + size(4) = 1 + 1 + 1 = 3
// size(0) = 1 + size(1) + size(2) = 1 + 3 + 1 = 5
// Answer: [5, 3, 1, 1, 1]
//
// This seems plausible. The key is that "closest node y to node x" refers to the original tree path. The DFS correctly finds this by using the map to store the *most recent* ancestor with a specific character seen so far on the path from the root.
//
// Double check the problem wording: "Find the closest node y to node x such that y is an ancestor of x, and s[x] == s[y]."
// This is exactly what `char_ancestor_map.get(s[x])` provides IF `char_ancestor_map` correctly stores the nearest ancestor.
// The DFS correctly maintains this by overwriting with more recent ancestors and restoring with older ones upon backtracking.
//
// Final check on implementation details:
// - Ensure correct map handling (delete vs. set for restoration).
// - Ensure `adj` and `finalAdj` are correctly built.
// - Ensure size DFS is correct.
// - Use `let` for variables that change and `const` for those that don't.
// - JS Map `get` returns `undefined` if key is not found. This is handled by `ancestor_id_that_was_set_before !== undefined`.
//
// Code structure:
// 1. `findSubtreeSizesAfterChanges(parent, s)` function.
// 2. Inside: `n = parent.length`.
// 3. Build `adj` from `parent`.
// 4. Initialize `newParent = [...parent]`.
// 5. `char_ancestor_map = new Map()`.
// 6. Define `dfs_determine_new_parents`.
// 7. Call `dfs_determine_new_parents(0, char_ancestor_map, adj, newParent, s)`.
// 8. Build `finalAdj` from `newParent`.
// 9. Initialize `answer = new Array(n)`.
// 10. Define `dfs_calculate_size`.
// 11. Call `dfs_calculate_size(0)`.
// 12. Return `answer`.
//
// One important detail: `parent[0] == -1` means node 0 is the root. The DFS should start from root 0.
// The loop `for (let i = 1; i < n; i++)` for building `adj` is correct.
// The logic `if (u > 0)` inside `dfs_determine_new_parents` is correct, as node 0 doesn't get re-parented.
//
// Let's consider the case where the character of the root `s[0]` is the same as a child's character. E.g., `parent=[-1,0], s="aa"`.
// `adj`: 0:[1].
// `newParent`: [-1,0]
// `dfs(0, {}, adj, newParent, s="aa")`
//   u=0. map update: `{'a': 0}`.
//   Children of 0: [1]
//   `dfs(1, {'a': 0}, adj, newParent, s="aa")`
//     u=1. s[1]='a'. Map has 'a'. `new_parent_id = 0`. `newParent[1] = 0`.
//     Map update: `{'a': 1}`.
//     Children of 1: [].
//     Backtrack 1: delete 'a'. Restoring value was 0. Map becomes `{'a': 0}`.
//   Backtrack 0: delete 'a'. Restoring value was undefined. Map becomes `{}`.
//
// `newParent` becomes `[-1, 0]`.
// `finalAdj`: 0:[1].
// `dfs_size(1)=1`. `dfs_size(0)=1+1=2`. Answer: `[2, 1]`. This is correct.
//
// What if `s="ab"`?
// `adj`: 0:[1].
// `newParent`: [-1,0]
// `dfs(0, {}, adj, newParent, s="ab")`
//   u=0. map update: `{'a': 0}`.
//   Children of 0: [1]
//   `dfs(1, {'a': 0}, adj, newParent, s="ab")`
//     u=1. s[1]='b'. Map has 'b'? No.
//     Map update: `{'a': 0, 'b': 1}`.
//     Children of 1: [].
//     Backtrack 1: delete 'b'. Restoring value undefined. Map becomes `{'a': 0}`.
//   Backtrack 0: delete 'a'. Restoring value undefined. Map becomes `{}`.
//
// `newParent` remains `[-1, 0]`.
// `finalAdj`: 0:[1].
// `dfs_size(1)=1`. `dfs_size(0)=1+1=2`. Answer: `[2, 1]`. This is correct.
//
// The approach appears robust.

```javascript
/**
 * @param {number[]} parent
 * @param {string} s
 * @return {number[]}
 */
// Problem: Find Subtree Sizes After Changes
// Link: https://leetcode.com/problems/find-subtree-sizes-after-changes/
//
// Approach:
// The problem requires us to simulate re-parenting nodes in a tree based on character matches and then calculate subtree sizes.
// The key challenge is that all changes happen simultaneously. This means we must first determine the final parent for each node *before* constructing the new tree and calculating subtree sizes.
//
// For each node `x` (from 1 to n-1), we need to find its new parent. The rule is to find the *closest ancestor* `y` in the *original tree structure* such that `s[x] == s[y]`. If no such ancestor exists, the node `x` retains its original parent.
//
// To efficiently find this closest ancestor for all nodes, we can use a Depth-First Search (DFS) traversal. During the DFS, we maintain a map `char_ancestor_map` that stores, for each character, the ID of the *most recent* (closest) ancestor encountered on the current path from the root that has that character.
//
// When we visit a node `u` during DFS:
// 1. If `u` is not the root (i.e., `u > 0`), we look up `s[u]` in the `char_ancestor_map`.
// 2. If `s[u]` is found in the map, it means there's an ancestor `y` (whose ID is `char_ancestor_map.get(s[u])`) with the same character. This `y` is the closest ancestor satisfying the condition, so we set `newParent[u] = y`.
// 3. Before recursing on `u`'s children, we update the `char_ancestor_map` by adding `s[u]` mapped to `u`. This is because `u` is now the closest ancestor with character `s[u]` for any of its descendants.
// 4. We then recursively call DFS for each of `u`'s children.
// 5. After returning from the recursive calls for `u`'s children, we must backtrack. This involves restoring the `char_ancestor_map` to its state before `u` was processed. This is done by removing `s[u]` from the map and, if there was a previous ancestor with that character, restoring that ancestor's ID.
//
// After the `newParent` array is populated, we build a new adjacency list (`finalAdj`) representing the final tree structure.
// Finally, we perform another DFS on `finalAdj` starting from the root (node 0) to calculate the size of each subtree.
//
// Time Complexity:
// - Building the initial adjacency list `adj`: O(N).
// - The DFS traversal to determine `newParent`: Each node is visited once. Map operations (get, set, delete) are O(1) on average. Thus, O(N).
// - Building `finalAdj`: O(N).
// - The DFS traversal to calculate subtree sizes: O(N).
// Total Time Complexity: O(N).
//
// Space Complexity:
// - Adjacency list `adj`: O(N).
// - `newParent` array: O(N).
// - `char_ancestor_map`: At most 26 entries (for lowercase English letters), so O(1).
// - Recursion stack for DFS: O(N) in the worst case (a skewed tree).
// - `finalAdj`: O(N).
// - `answer` array: O(N).
// Total Space Complexity: O(N).
//
function findSubtreeSizesAfterChanges(parent, s) {
    const n = parent.length;

    // 1. Build the initial adjacency list for the original tree structure.
    // `adj[i]` will store a list of children of node `i`.
    const adj = Array.from({ length: n }, () => []);
    for (let i = 1; i < n; i++) {
        // `parent[i]` is the parent of node `i`.
        adj[parent[i]].push(i);
    }

    // 2. Initialize `newParent` array. This will store the final parent of each node.
    // We copy the original parent array, as nodes that don't meet re-parenting criteria will retain their original parent.
    const newParent = [...parent];

    // `char_ancestor_map` stores `character -> node_id` of the closest ancestor encountered so far on the DFS path with that character.
    const char_ancestor_map = new Map();

    // 3. DFS function to determine the `newParent` for each node.
    // This function traverses the tree and populates `newParent` based on the re-parenting rules.
    function dfs_determine_new_parents(u, char_ancestor_map, adj, newParent, s) {
        // For the current node `u`, find its new parent if applicable.
        // The root (node 0) does not get re-parented, so we check `u > 0`.
        if (u > 0) {
            const target_char = s[u]; // The character of the current node `u`.
            // Check if there's an ancestor in the map with the same character.
            if (char_ancestor_map.has(target_char)) {
                const new_parent_id = char_ancestor_map.get(target_char);
                // If found, set this ancestor as the new parent of `u`.
                newParent[u] = new_parent_id;
            }
        }

        // Store the current node `u` and its character `s[u]` in the map for its descendants.
        // `u` is now the closest ancestor with character `s[u]` for any nodes in its subtree.
        const original_char_at_u = s[u];
        // Store the previous value associated with `original_char_at_u` to restore it during backtracking.
        const ancestor_id_that_was_set_before = char_ancestor_map.get(original_char_at_u);
        char_ancestor_map.set(original_char_at_u, u);

        // Recurse on children.
        for (const child of adj[u]) {
            dfs_determine_new_parents(child, char_ancestor_map, adj, newParent, s);
        }

        // Backtrack: Restore the `char_ancestor_map` to its state before visiting `u`.
        // Remove `u`'s entry from the map.
        char_ancestor_map.delete(original_char_at_u);
        // If there was a previous ancestor with this character, restore its entry.
        // This ensures that for siblings or cousins of `u`'s descendants, the correct closest ancestor is used.
        if (ancestor_id_that_was_set_before !== undefined) {
            char_ancestor_map.set(original_char_at_u, ancestor_id_that_was_set_before);
        }
    }

    // Start the DFS from the root (node 0).
    dfs_determine_new_parents(0, char_ancestor_map, adj, newParent, s);

    // 4. Build the final adjacency list (`finalAdj`) based on the computed `newParent` array.
    const finalAdj = Array.from({ length: n }, () => []);
    for (let i = 1; i < n; i++) {
        // `newParent[i]` holds the final parent of node `i`.
        // `newParent[0]` is -1, so we only add edges for `i > 0`.
        if (newParent[i] !== -1) {
            finalAdj[newParent[i]].push(i);
        }
    }

    // 5. Prepare the `answer` array to store subtree sizes.
    const answer = new Array(n);

    // 6. DFS function to calculate subtree sizes.
    // This function performs a post-order traversal (calculates size of children first).
    function dfs_calculate_size(u) {
        let size = 1; // Initialize size with 1 for the current node `u`.
        // Sum up the sizes of subtrees rooted at `u`'s children.
        for (const v of finalAdj[u]) {
            size += dfs_calculate_size(v);
        }
        // Store the calculated subtree size for node `u`.
        answer[u] = size;
        // Return the size to be used by the parent node in its calculation.
        return size;
    }

    // Start the size calculation DFS from the root (node 0).
    dfs_calculate_size(0);

    // 7. Return the `answer` array containing the subtree sizes for each node in the final tree.
    return answer;
}
```