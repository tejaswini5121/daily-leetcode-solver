```python
# Problem Summary:
# Re-parent nodes in a tree based on character matching with ancestors and return final subtree sizes.
# Link: https://leetcode.com/problems/find-subtree-sizes-after-changes/
#
# Approach:
# 1. Reconstruct the initial adjacency list representation of the tree from the parent array.
# 2. For each node x (from 1 to n-1), perform a DFS upwards from x to find the closest ancestor y with the same character s[x] == s[y].
# 3. Keep track of the new parent for each node. If no such ancestor y is found, the node remains with its original parent.
# 4. After determining all the new parent-child relationships, build a new adjacency list for the final tree.
# 5. Perform a post-order DFS (or any DFS that calculates subtree sizes) on the final tree to compute the size of each subtree.
#
# Time Complexity:
# - Building initial adjacency list: O(n)
# - Finding new parents for each node: For each node x, the upward DFS can go up to its depth. In the worst case (a skewed tree), this can be O(n). So, this step is O(n^2).
# - Building final adjacency list: O(n)
# - Calculating subtree sizes: O(n)
# The dominant factor is finding new parents, leading to O(n^2) in the worst case.
#
# Optimization: The O(n^2) part can be optimized. Instead of re-traversing upwards for each node, we can maintain, for each character, the path of ancestors of a certain character. When processing a node x, we can query this information. This optimization is crucial for passing LeetCode tests within time limits.
#
# Optimized Approach (using character-specific ancestor tracking):
# 1. Build the initial adjacency list.
# 2. For each node x from 1 to n-1:
#    - Traverse upwards from x using the parent array.
#    - For each ancestor y encountered, check if s[x] == s[y]. The first such ancestor found is the new parent.
#    - Store the new parent for node x. If no such ancestor is found, its parent remains the original one.
# 3. Build the final adjacency list based on the determined new parent-child relationships.
# 4. Perform a DFS from the root (node 0) on the final tree to calculate subtree sizes.
#
# Let's refine the upwards traversal:
# We can maintain for each character, a stack of nodes that are ancestors of the current node and have that character.
# When processing node `x`:
# For each character `c`:
#   If `c == s[x]`:
#     If the stack for `c` is not empty, the top element is the closest ancestor `y` with `s[y] == c`. This `y` is the potential new parent for `x`.
#   Push `x` onto the stack for `s[x]`.
# After processing all nodes this way (bottom-up effectively by iterating from 1 to n-1), we will have the correct new parent for each node.
#
# To implement this efficiently without explicit upward DFS for each node, we can use a DFS traversal.
# When we visit a node `u` during DFS:
#   For each character `c`, keep track of the latest ancestor that had character `c`.
#   When processing children `v` of `u`:
#     If `s[v] == s[u]`, `u` is the new parent for `v`.
#     If `s[v] == s[ancestor_with_char_s[v]]`, then `ancestor_with_char_s[v]` is the new parent for `v`.
# This suggests a DFS approach where we pass down information about ancestors.
#
# Let's use a DFS approach and maintain `char_ancestor[char]` which stores the node ID of the most recent ancestor encountered with `char`.
#
# Final Optimized Approach:
# 1. Build the initial adjacency list `adj` where `adj[p]` contains all children of `p`.
# 2. Create a `new_parent` array, initialized with original parents.
# 3. Initialize `char_ancestor` dictionary: `char_ancestor[char]` = node ID.
# 4. Perform a DFS traversal starting from the root (node 0).
#    - In the DFS function `dfs(u, current_char_ancestor)`:
#      - `original_char_ancestor_u_char = current_char_ancestor.get(s[u])` (store the ancestor before updating)
#      - `current_char_ancestor[s[u]] = u` (update the latest ancestor with character s[u])
#      - For each child `v` in `adj[u]`:
#        - Find the closest ancestor `y` of `v` such that `s[v] == s[y]`.
#          This `y` would be `current_char_ancestor.get(s[v])`.
#        - If `y` exists, set `new_parent[v] = y`.
#        - Recursively call `dfs(v, current_char_ancestor.copy())`. Note: passing a copy is important to isolate ancestor paths for different branches.
#      - Restore `current_char_ancestor[s[u]] = original_char_ancestor_u_char` (backtrack)
#
# This DFS approach with passing copies of `char_ancestor` might be too slow due to copy operations.
# A better way is to modify `char_ancestor` in place and then restore it during backtracking.
#
# Revised Optimized DFS Approach:
# 1. Build the initial adjacency list `adj` where `adj[p]` contains all children of `p`.
# 2. Create `new_parent` array of size `n`, initialized with `-1`. `new_parent[0] = -1`.
# 3. Create `char_latest_ancestor` array of size 26 (for 'a' to 'z'). Initialize all to -1.
# 4. Define a DFS function `dfs_reparent(u)`:
#    - Store the original value of `char_latest_ancestor[ord(s[u]) - ord('a')]` before modification. Let this be `prev_ancestor`.
#    - Update `char_latest_ancestor[ord(s[u]) - ord('a')] = u`.
#    - For each child `v` in `adj[u]`:
#      - The closest ancestor of `v` with character `s[v]` is `char_latest_ancestor[ord(s[v]) - ord('a')]`.
#      - If this ancestor is not -1, then `new_parent[v] = char_latest_ancestor[ord(s[v]) - ord('a')]`.
#      - Recursively call `dfs_reparent(v)`.
#    - After visiting all children of `u`, restore the ancestor information for backtracking:
#      `char_latest_ancestor[ord(s[u]) - ord('a')] = prev_ancestor`.
# 5. Call `dfs_reparent(0)`.
# 6. Now `new_parent` array stores the correct new parent for each node (except for node 0, which is the root). Nodes whose parents didn't change will still have their original parent if `new_parent[v]` was not updated. We need to ensure `new_parent` correctly reflects all parent changes. A simpler approach might be to initialize `new_parent` with the original `parent` array and then only update if a new ancestor is found.
#
# Let's use the initial `parent` array for `new_parent` and update it.
#
# Final Optimized DFS Strategy:
# 1. Build the initial adjacency list `adj` where `adj[p]` contains all children of `p`.
# 2. Create `new_parent_mapping` dictionary to store changes: `new_parent_mapping[child] = new_parent`.
# 3. Create `char_latest_ancestor` array of size 26. Initialize all to -1.
# 4. Define `dfs_reparent(u)`:
#    - `char_idx = ord(s[u]) - ord('a')`
#    - `prev_ancestor = char_latest_ancestor[char_idx]`
#    - `char_latest_ancestor[char_idx] = u`
#
#    - For each child `v` in `adj[u]`:
#      - `child_char_idx = ord(s[v]) - ord('a')`
#      - `closest_ancestor_for_v = char_latest_ancestor[child_char_idx]`
#      - If `closest_ancestor_for_v != -1`:
#        `new_parent_mapping[v] = closest_ancestor_for_v`
#      - `dfs_reparent(v)`
#
#    - `char_latest_ancestor[char_idx] = prev_ancestor` (backtrack)
#
# 5. Call `dfs_reparent(0)`.
#
# 6. Build the final adjacency list `final_adj` based on `new_parent_mapping`.
#    Initialize `final_adj` as a list of empty lists.
#    For `i` from 1 to `n-1`:
#      `p = new_parent_mapping.get(i, parent[i])` # Get new parent, fallback to original if no change
#      `final_adj[p].append(i)`
#
# 7. Perform a post-order DFS (`dfs_calculate_size`) on `final_adj` to compute subtree sizes.
#    `subtree_sizes = [0] * n`
#    `dfs_calculate_size(u)`:
#      `size = 1`
#      For each child `v` in `final_adj[u]`:
#        `size += dfs_calculate_size(v)`
#      `subtree_sizes[u] = size`
#      Return `size`
#    Call `dfs_calculate_size(0)`.
#
# 8. Return `subtree_sizes`.
#
# Time Complexity:
# - Building initial adj: O(n)
# - `dfs_reparent`: O(n) because each node is visited once, and operations within are O(1).
# - Building `final_adj`: O(n)
# - `dfs_calculate_size`: O(n)
# Total Time Complexity: O(n)
#
# Space Complexity:
# - `adj`: O(n)
# - `new_parent_mapping`: O(n) in the worst case
# - `char_latest_ancestor`: O(1) (constant size for 26 characters)
# - `final_adj`: O(n)
# - `subtree_sizes`: O(n)
# - Recursion stack for DFS: O(h), where h is the height of the tree (O(n) in worst case).
# Total Space Complexity: O(n)
#
#

import sys

# Increase recursion depth for deep trees
sys.setrecursionlimit(200000)

class Solution:
    def findSubtreeSizesAfterChanges(self, parent: list[int], s: str) -> list[int]:
        n = len(parent)

        # 1. Build the initial adjacency list from the parent array.
        # adj[p] will store a list of children of node p.
        adj = [[] for _ in range(n)]
        for i in range(1, n):
            adj[parent[i]].append(i)

        # This dictionary will store the mapping from a child node to its new parent.
        # We use a dictionary because not all nodes might have their parents changed.
        new_parent_mapping = {}

        # `char_latest_ancestor[k]` will store the node ID of the most recent ancestor
        # encountered during DFS that has the character corresponding to index k.
        # Index k corresponds to the character chr(ord('a') + k).
        char_latest_ancestor = [-1] * 26

        # 4. Define the DFS function to determine new parent relationships.
        def dfs_reparent(u: int):
            # Get the character index for the current node u.
            char_idx = ord(s[u]) - ord('a')
            # Store the previous latest ancestor for this character before updating.
            # This is crucial for backtracking and maintaining correct ancestor chains for siblings.
            prev_ancestor = char_latest_ancestor[char_idx]

            # Update the latest ancestor for the character of node u to be node u itself.
            char_latest_ancestor[char_idx] = u

            # Iterate through all children of the current node u.
            for v in adj[u]:
                # Get the character index for the child node v.
                child_char_idx = ord(s[v]) - ord('a')
                # Find the closest ancestor of v that has the same character as s[v].
                # This is given by char_latest_ancestor[child_char_idx].
                closest_ancestor_for_v = char_latest_ancestor[child_char_idx]

                # If a valid ancestor is found (not -1):
                if closest_ancestor_for_v != -1:
                    # This ancestor is the new parent for node v.
                    new_parent_mapping[v] = closest_ancestor_for_v
                
                # Recursively call dfs_reparent for the child node v.
                dfs_reparent(v)

            # Backtrack: Restore the previous latest ancestor for the character of node u.
            # This undoes the change made at the beginning of this function call for node u,
            # so that sibling nodes correctly see the ancestor chain before u.
            char_latest_ancestor[char_idx] = prev_ancestor

        # 5. Start the DFS traversal from the root node (node 0).
        dfs_reparent(0)

        # 6. Build the final adjacency list based on the determined new parent relationships.
        final_adj = [[] for _ in range(n)]
        for i in range(1, n):
            # Determine the parent of node i.
            # If node i has a new parent defined in new_parent_mapping, use that.
            # Otherwise, use its original parent from the input `parent` array.
            p = new_parent_mapping.get(i, parent[i])
            # Add node i as a child to its determined parent p.
            final_adj[p].append(i)

        # This list will store the size of the subtree rooted at each node in the final tree.
        subtree_sizes = [0] * n

        # 7. Define a DFS function to calculate subtree sizes in the final tree.
        # This function performs a post-order traversal.
        def dfs_calculate_size(u: int) -> int:
            # Initialize the size of the subtree rooted at u to 1 (for node u itself).
            size = 1
            # Iterate through all children of node u in the final adjacency list.
            for v in final_adj[u]:
                # Recursively calculate the size of the subtree rooted at child v,
                # and add it to the size of the subtree rooted at u.
                size += dfs_calculate_size(v)
            
            # Store the calculated subtree size for node u.
            subtree_sizes[u] = size
            # Return the size of the subtree rooted at u.
            return size

        # Start the subtree size calculation DFS from the root node (node 0).
        dfs_calculate_size(0)

        # 8. Return the array containing the sizes of all subtrees in the final tree.
        return subtree_sizes

```