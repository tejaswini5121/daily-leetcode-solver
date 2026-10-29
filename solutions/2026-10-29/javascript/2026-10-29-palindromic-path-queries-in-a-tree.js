/**
 * @file Palindromic Path Queries in a Tree
 * @brief Determines if a path in a tree can form a palindrome, supporting node updates.
 * @link https://leetcode.com/problems/palindromic-path-queries-in-a-tree/
 *
 * Approach:
 * The core idea is that a string can be rearranged into a palindrome if and only if at most one character appears an odd number of times.
 * For a path in a tree, we can represent the character counts using bitmasks. Each bit in a 32-bit integer can represent the parity of a character ('a' through 'z').
 * A bit is set to 1 if the character appears an odd number of times, and 0 if it appears an even number of times.
 *
 * To find the parity mask for a path between two nodes `u` and `v`, we can use the property of XOR. The parity mask of the path `u` to `v` is equal to `prefix_xor[u] ^ prefix_xor[v] ^ (1 << char_at_lca)`, where `prefix_xor[x]` is the XOR sum of parity masks from the root to node `x`, and `lca` is the lowest common ancestor of `u` and `v`.
 *
 * We can compute `prefix_xor` values using a Depth First Search (DFS) from an arbitrary root (e.g., node 0). During the DFS, we also calculate depths and parent pointers to efficiently find the LCA.
 *
 * For LCA, we can use binary lifting. We precompute `up[i][j]`, which stores the 2^j-th ancestor of node `i`.
 *
 * The queries are of two types: "update" and "query".
 *
 * Update: When a character at a node `u` is updated from `old_char` to `new_char`, we need to update the `prefix_xor` values for `u` and all its descendants. This can be done by XORing the difference in parity masks (`(1 << (old_char - 'a')) ^ (1 << (new_char - 'a'))`) into the `prefix_xor` of `u` and then propagating this change downwards.
 * To efficiently propagate updates and queries to subtrees, we can use an Euler tour (flattening the tree into an array) combined with a data structure like a Segment Tree or a Fenwick Tree (Binary Indexed Tree - BIT).
 * A Segment Tree is suitable here. Each node in the segment tree will store the XOR sum of the parity masks of nodes within its corresponding range in the Euler tour.
 *
 * For an "update ui c" query:
 * 1. Get the old character at `ui`.
 * 2. Calculate the XOR difference: `diff_mask = (1 << (old_char - 'a')) ^ (1 << (new_char - 'a'))`.
 * 3. Update the character in the original string `s`.
 * 4. Update the segment tree at the index corresponding to node `ui` in the Euler tour by XORing `diff_mask`.
 *
 * For a "query ui vi" query:
 * 1. Find the LCA of `ui` and `vi`.
 * 2. Calculate the parity mask of the path `ui` to `vi`: `path_mask = prefix_xor[ui] ^ prefix_xor[vi] ^ (1 << char_at_lca)`.
 * 3. To check if `path_mask` can form a palindrome, we need to see if it has at most one bit set. This can be checked with `(path_mask & (path_mask - 1)) == 0`.
 *
 * However, propagating XOR updates down the tree for every update query would be too slow (O(N) for each update). A better approach for updates and range XOR queries is to use a Fenwick tree on an Euler tour.
 *
 * Euler Tour Approach with Fenwick Tree:
 * 1. Perform a DFS to construct the Euler tour. For each node, record its entry time (`tin`) and exit time (`tout`). The Euler tour is an array where each node appears twice (once on entry, once on exit).
 * 2. Store the character at each node.
 * 3. Calculate the initial XOR prefix sums for each node. The `prefix_xor[i]` will be the XOR sum of parity masks from root to node `i`.
 * 4. Initialize a Fenwick tree (BIT) of size `2*N`. The BIT will store XOR sums.
 * 5. For each node `i`, insert its initial parity mask into the BIT at `tin[i]`. This represents the contribution of node `i` to paths starting from the root and passing through `i`.
 * 6. For an "update ui c" query:
 *    - Get `old_char` and `new_char`.
 *    - Calculate `diff_mask = (1 << (old_char - 'a')) ^ (1 << (new_char - 'a'))`.
 *    - Update the character in `s`.
 *    - Update the BIT at `tin[ui]` by XORing `diff_mask`. This effectively updates the parity contribution of node `ui`.
 * 7. For a "query ui vi" query:
 *    - Find LCA(ui, vi).
 *    - The XOR sum of parity masks for the path `root` to `ui` is obtained by querying the BIT at `tin[ui]`.
 *    - The XOR sum of parity masks for the path `root` to `vi` is obtained by querying the BIT at `tin[vi]`.
 *    - The XOR sum of parity masks for the path `root` to `LCA(ui, vi)` is obtained by querying the BIT at `tin[LCA(ui, vi)]`.
 *    - The XOR sum for the path `ui` to `vi` is `BIT.query(tin[ui]) ^ BIT.query(tin[vi]) ^ (1 << char_at_lca)`. Note that the BIT query for `tin[x]` gives the XOR sum of all characters from the root up to and including node `x` that are relevant to the path XOR.
 *    - A path can form a palindrome if the resulting XOR sum has at most one bit set. `(path_mask & (path_mask - 1)) == 0`.
 *
 *  The LCA computation needs to be efficient. Binary lifting is a standard approach.
 *
 *  Revisiting the query logic:
 *  If we use an Euler tour and a Fenwick tree, the value at `BIT.query(tin[u])` will represent the XOR sum of parity masks of all nodes `x` such that `tin[x] <= tin[u]` and `x` is an ancestor of `u` (or `u` itself). This is not directly the path XOR.
 *
 *  Let's consider the path XOR from `u` to `v` more carefully.
 *  The XOR sum of characters on the path from `root` to `u` is `P_u`.
 *  The XOR sum of characters on the path from `root` to `v` is `P_v`.
 *  The XOR sum of characters on the path from `root` to `LCA(u, v)` is `P_lca`.
 *
 *  The XOR sum of characters on the path `u` to `v` is `P_u ^ P_v ^ parity(char_at_lca)`.
 *  This formula is correct.
 *
 *  How to get `P_x` efficiently using a data structure on the tree?
 *
 *  With an Euler tour, we can assign contributions. For node `i` with character `c`, its parity mask `(1 << (c - 'a'))` is associated with `tin[i]`.
 *  An update at node `u` changes its character. This change needs to be reflected for all paths passing through `u`.
 *
 *  Consider the path from `u` to `v`.
 *  Let `mask(x)` be the parity mask of character at node `x`.
 *  Let `XOR_path(a, b)` be the XOR sum of `mask(x)` for all nodes `x` on the unique path between `a` and `b` (inclusive).
 *
 *  We need to check if `XOR_path(u, v)` can be rearranged into a palindrome.
 *  This means `XOR_path(u, v)` should have at most one bit set.
 *
 *  `XOR_path(u, v) = XOR_path(root, u) ^ XOR_path(root, v) ^ mask(LCA(u, v))` if we define `XOR_path(root, x)` as the XOR sum from root to x.
 *  If `XOR_path(root, x)` is the XOR sum of masks from root *up to but not including* `x`, then `XOR_path(u, v) = XOR_path(root, u) ^ XOR_path(root, v) ^ mask(u) ^ mask(v) ^ mask(LCA(u,v))` which is not quite right.
 *
 *  Let's use the definition: `P[i]` is the XOR sum of masks from root to `i` *inclusive*.
 *  `P[i] = mask(root) ^ mask(child1) ^ ... ^ mask(i)`
 *  Then `XOR_path(u, v) = P[u] ^ P[v] ^ mask(LCA(u, v))`. This is correct.
 *
 *  The problem is how to efficiently update `P[i]` for all `i` in a subtree when a character changes.
 *
 *  We can use a Segment Tree on the Euler tour of the tree.
 *  The Euler tour will be an array of size `2*N`.
 *  `tour`: Stores nodes in DFS order.
 *  `tin[i]`: Entry time of node `i` in the tour.
 *  `tout[i]`: Exit time of node `i` in the tour.
 *
 *  A Segment Tree node covering range `[L, R]` in the Euler tour will store the XOR sum of character masks for all nodes `x` that are "active" (i.e., entered but not yet exited) within that time interval.
 *
 *  Alternative perspective:
 *  Let `bitmask[i]` be the parity mask for `s[i]`.
 *  We want to compute `XOR_sum(path_u_v) = bitmask(u) ^ bitmask(v) ^ (bitmask(LCA(u,v)))`. NO.
 *  It should be `XOR_sum(path_u_v) = bitmask(u) ^ bitmask(v) ^ (bitmask(LCA(u,v)) ^ bitmask(parent_of_LCA))` if LCA is not root.
 *  Correct: `XOR_sum(path_u_v) = (XOR_sum(root, u) ^ XOR_sum(root, v)) ^ bitmask(LCA(u, v))`.
 *  Here `XOR_sum(root, x)` is the XOR sum of bitmasks of nodes on the path from root to `x`, inclusive.
 *
 *  This means we need to maintain `XOR_sum(root, x)` for each node `x`.
 *  When `s[u]` changes from `old_c` to `new_c`, the `bitmask[u]` changes by `diff = bitmask(old_c) ^ bitmask(new_c)`.
 *  This change affects `XOR_sum(root, u)` and all `XOR_sum(root, v)` where `v` is in the subtree of `u`.
 *  Specifically, for any node `v` in the subtree of `u` (including `u` itself), `XOR_sum'(root, v) = XOR_sum(root, v) ^ diff`.
 *
 *  This indicates a point update and range update/query problem on the tree.
 *  A segment tree built on the Euler tour is a good fit.
 *
 *  Let's define the Euler tour and segment tree more concretely:
 *  1. DFS traversal to compute `tin`, `tout`, and `depth` for each node.
 *     `tour`: Array to store nodes in DFS order.
 *     `idx_in_tour`: Array to map node `i` to its first appearance index in `tour`.
 *     `parent[i][k]`: `2^k`-th ancestor of `i` for binary lifting.
 *  2. Build a segment tree on the `tour` array. Each leaf node `i` in the segment tree (corresponding to `tour[i]`) stores the parity mask of the character `s[tour[i]]`.
 *  3. Internal nodes of the segment tree store the XOR sum of their children.
 *  4. For updates ("update ui c"):
 *     - Get `old_char` and `new_char`.
 *     - Calculate `diff_mask = (1 << (old_char - 'a')) ^ (1 << (new_char - 'a'))`.
 *     - Update the character in `s`.
 *     - Update the segment tree at `idx_in_tour[ui]` with `diff_mask`. This means XORing `diff_mask` into the leaf node and propagating the change upwards.
 *  5. For queries ("query ui vi"):
 *     - Find `lca = LCA(ui, vi)` using binary lifting.
 *     - We need `XOR_sum(root, ui)`, `XOR_sum(root, vi)`, and `bitmask(lca)`.
 *     - `bitmask(lca)` is `1 << (s[lca] - 'a')`.
 *
 *     The key insight here is that `XOR_sum(root, x)` can be computed from the segment tree on the Euler tour.
 *     `XOR_sum(root, x)` is the XOR sum of parity masks of all nodes on the path from root to `x`, inclusive.
 *     In the Euler tour, the nodes on the path from root to `x` appear in order, and they are visited before `x`'s subtree is fully explored.
 *     Consider the range `[0, tin[x]]` in the Euler tour. A segment tree query on `[0, tin[x]]` might give us some information, but it will include nodes outside the path to `x` as well.
 *
 *     Let's reconsider the XOR property for path queries.
 *     `path_xor(u, v) = path_xor(root, u) ^ path_xor(root, v) ^ mask(lca)`. This formula is incorrect because `path_xor(root, u)` includes `lca` and `path_xor(root, v)` also includes `lca`. XORing them twice cancels `lca`'s mask. So, the formula becomes `path_xor(u, v) = path_xor(root, u) ^ path_xor(root, v) ^ mask(lca)`. This IS correct.
 *
 *     The issue is efficiently calculating `path_xor(root, x)`.
 *     If we have a segment tree on the Euler tour where each node stores the XOR sum of masks of *all* nodes in its tour segment.
 *     A query for `path_xor(root, x)` would be `segment_tree.query(0, tin[x])`. This gives the XOR sum of characters for all nodes `y` such that `tin[y] <= tin[x]`. This is NOT `path_xor(root, x)`.
 *
 *     Correct approach for path XOR sum using Euler Tour + Segment Tree:
 *     1. Perform DFS: compute `tin`, `tout`, `depth`. `parent[i][k]`.
 *     2. Create `euler_tour`: stores nodes in DFS entry order. `tin[i]` is the index of `i` in `euler_tour`.
 *     3. Create `node_at_time[t]`: the node at index `t` in `euler_tour`.
 *     4. Build a Segment Tree over the `euler_tour` array.
 *        - Each leaf `i` (corresponding to `euler_tour[i]`) stores `1 << (s[euler_tour[i]] - 'a')`.
 *        - Internal nodes store the XOR sum of their children.
 *     5. Update query "update ui c":
 *        - `old_char_mask = 1 << (s[ui] - 'a')`
 *        - `new_char_mask = 1 << (c - 'a')`
 *        - `diff_mask = old_char_mask ^ new_char_mask`
 *        - Update `s[ui] = c`
 *        - Update the Segment Tree at index `tin[ui]` by XORing `diff_mask`.
 *     6. Query query "query ui vi":
 *        - `lca = LCA(ui, vi)`
 *        - `mask_u = query_path_xor(ui)`
 *        - `mask_v = query_path_xor(vi)`
 *        - `mask_lca = query_path_xor(lca)`
 *        - `path_xor_mask = mask_u ^ mask_v ^ mask_lca`
 *
 *     Now, how to implement `query_path_xor(x)`?
 *     `query_path_xor(x)` should return the XOR sum of parity masks of all nodes on the path from `root` to `x` inclusive.
 *
 *     This can be done by using the `tout` times.
 *     The nodes on the path from root to `x` are encountered exactly once in the Euler tour between `tin[x]` and `tout[x]`.
 *     Specifically, the path from root to `x` consists of nodes `r, ..., p, x`.
 *     In the Euler tour, this looks like `r, ..., p, x, ..., (subtree of x), ..., p (exit), ..., r (exit)`.
 *
 *     The XOR sum of masks for the path from root to `x` is `query_segment_tree(0, tin[x])`. This is incorrect.
 *     The range `[tin[x], tout[x]]` in the Euler tour contains `x` and all nodes in its subtree.
 *
 *     Let's use the property that for any node `u`, the XOR sum of characters on the path from root to `u` can be maintained.
 *     When `s[u]` is updated, this change affects `path_xor(root, u)` and `path_xor(root, v)` for all `v` in `u`'s subtree.
 *
 *     Consider a Fenwick tree on the Euler tour indices.
 *     We need to handle two types of updates:
 *     1. Point update: change character at node `u`. This affects `u` and all its descendants.
 *     2. Range query: get XOR sum of masks from root to `x`.
 *
 *     If we have `path_xor(root, x)` for all `x`, then `path_xor(u, v) = path_xor(root, u) ^ path_xor(root, v) ^ mask(lca)`.
 *
 *     How to maintain `path_xor(root, x)`?
 *     When `s[u]` changes from `old_c` to `new_c` (mask difference `diff`):
 *     For `u` and all nodes `v` in `u`'s subtree:
 *       `path_xor'(root, v) = path_xor(root, v) ^ diff`.
 *
 *     This is a range update on subtrees. A segment tree on Euler tour can handle this.
 *     The Euler tour array stores nodes such that `u` and its subtree are contiguous in the tour for a specific traversal.
 *     If we traverse and record `tin[u]` and `tout[u]`, the nodes in `u`'s subtree appear in the tour between `tin[u]` and `tout[u]`.
 *     A segment tree on the Euler tour can perform range updates (XORing a value) and point queries (getting the `path_xor(root, x)`).
 *
 *     Let's refine the Euler tour and Segment Tree approach for range updates and point queries.
 *
 *     1. DFS: compute `tin`, `tout`, `depth`, `parent`.
 *        - `tin[i]`: entry time of node `i`.
 *        - `tout[i]`: exit time of node `i`.
 *        - The segment tree will be built over an array of size `N` (or `2N` if we use both entry and exit times). Let's use an array of size `N` where index `i` corresponds to node `i`.
 *        - We need to perform range updates on subtrees.
 *
 *     2. A segment tree on the `N` nodes directly. For a node `u` and its subtree, the indices in the segment tree corresponding to this subtree need to be updated. This requires mapping subtrees to ranges, which is what the Euler tour provides.
 *        - Let's use an array of size `2*N` for the Euler tour itself.
 *        - `tour_nodes`: Stores the node ID at each step of the Euler tour.
 *        - `tin[i]`: Entry time of node `i`.
 *        - `tout[i]`: Exit time of node `i`.
 *        - Segment tree on `tour_nodes` (size `2*N`).
 *
 *     3. Initial population of Segment Tree:
 *        For each node `i` from 0 to N-1:
 *          Calculate `mask = 1 << (s[i] - 'a')`.
 *          Update the segment tree at `tin[i]` with `mask` (point update).
 *
 *     4. Update query "update ui c":
 *        - `old_char_mask = 1 << (s[ui] - 'a')`
 *        - `new_char_mask = 1 << (c - 'a')`
 *        - `diff_mask = old_char_mask ^ new_char_mask`
 *        - Update `s[ui] = c`
 *        - Perform a range update on the segment tree: XOR `diff_mask` to the range `[tin[ui], tout[ui]]`. (Note: `tout[ui]` needs to be adjusted to be inclusive for the segment tree range, typically `tout[ui]-1` if `tout` is strictly exit time).
 *
 *     5. Query query "query ui vi":
 *        - `lca = LCA(ui, vi)`
 *        - To get `XOR_sum(root, x)`:
 *          We need the XOR sum of masks of nodes encountered on the path from root to `x`.
 *          This is equivalent to querying the segment tree over the range `[0, tin[x]]` and then correcting for nodes that are not ancestors.
 *          A simpler way: `XOR_sum(root, x)` can be obtained by querying the segment tree for the range `[0, tin[x]]`. This range contains all nodes on the path from the root to `x` and potentially some other nodes.
 *
 *          Let's consider the XOR sum of character masks for all nodes `k` such that `tin[k] <= t` and `k` is an ancestor of `tour_nodes[t]`.
 *          If `st` is a segment tree on the Euler tour array `tour_nodes`, where `st[i]` stores the XOR sum of masks in its range.
 *          Then `st.query(0, tin[x])` gives the XOR sum of masks for all nodes `y` such that `tin[y] <= tin[x]`. This is not `XOR_sum(root, x)`.
 *
 *          Correct Segment Tree on Euler Tour for Path XOR:
 *          Build a segment tree on an array of size `2*N`.
 *          For each index `t` in the Euler tour:
 *            If `t` corresponds to the entry of node `u` (`t == tin[u]`):
 *              Store `1 << (s[u] - 'a')` at this leaf.
 *            If `t` corresponds to the exit of node `u` (`t == tout[u]`):
 *              Store `-(1 << (s[u] - 'a'))` or similar to cancel out. This is complicated.
 *
 *          A more standard approach for path queries with updates using Segment Tree on Euler Tour:
 *          1. DFS: Compute `tin`, `tout`, `depth`, `parent`.
 *          2. Create `tour` array: `tour[t]` stores the node that is *entered* at time `t`.
 *          3. Build Segment Tree: on `tour` array (size `2N`).
 *             - Leaf at index `t`: stores `1 << (s[tour[t]] - 'a')` if `tour[t]` is not null.
 *             - Internal nodes: XOR sum.
 *          4. To find `XOR_sum(root, x)`: This is `segment_tree.query(0, tin[x])`. This is still not correct.
 *
 *          Let's simplify. The condition for palindrome is that at most one character has an odd count. This means the XOR sum of parity masks has at most one bit set.
 *          We need to compute `XOR_sum(path_u_v) = XOR_sum(root, u) ^ XOR_sum(root, v) ^ mask(lca)`.
 *
 *          To compute `XOR_sum(root, x)`:
 *          When character `s[i]` changes by `diff`, `XOR_sum(root, v)` changes by `diff` for all `v` in `i`'s subtree.
 *
 *          This suggests a segment tree that supports range XOR updates and point queries.
 *          We can use a segment tree on the Euler tour array of size `2N`.
 *          For a node `u`: `tin[u]` is entry time, `tout[u]` is exit time. The range `[tin[u], tout[u]]` in the Euler tour covers `u` and its entire subtree.
 *
 *          Segment Tree structure:
 *          - Array `tree` of size `4 * 2N`.
 *          - `lazy` array for range updates.
 *          - `build(v, tl, tr)`: Initialize segment tree.
 *            - For a node `i` (0 to N-1):
 *              Calculate `mask = 1 << (s[i] - 'a')`.
 *              Perform a point update on the segment tree at `tin[i]` with `mask`.
 *              The segment tree needs to store the XOR sum of values in its range.
 *          - `update_range(v, tl, tr, l, r, add_val)`: XOR `add_val` to range `[l, r]`.
 *          - `query_point(v, tl, tr, pos)`: Get value at `pos`.
 *
 *          Algorithm refined:
 *          1. Preprocessing:
 *             - Adjacency list for tree.
 *             - DFS from root 0 to compute `tin`, `tout`, `depth`, `parent[i][k]` for binary lifting.
 *             - `euler_tour`: Array of size `2N`. `euler_tour[t]` stores the node ID entered at time `t`.
 *             - `s_masks`: Array of size `N`, `s_masks[i] = 1 << (s[i] - 'a')`.
 *             - `segment_tree`: A segment tree supporting range XOR updates and point XOR queries. The size of the underlying array for the segment tree is `2*N`.
 *             - Initialize segment tree: For each node `i` (0 to N-1), call `segment_tree.update_point(tin[i], s_masks[i])`. This sets the initial XOR contribution at `tin[i]`.
 *
 *          2. Update query "update ui c":
 *             - `old_mask = s_masks[ui]`
 *             - `new_char_code = c.charCodeAt(0) - 'a'`
 *             - `new_mask = 1 << new_char_code`
 *             - `diff_mask = old_mask ^ new_mask`
 *             - Update `s_masks[ui] = new_mask`
 *             - Perform range update on segment tree: `segment_tree.update_range(tin[ui], tout[ui] - 1, diff_mask)`. (Note: The range `[tin[ui], tout[ui]-1]` covers all entries in the Euler tour corresponding to `ui` and its descendants, effectively the whole subtree).
 *
 *          3. Query query "query ui vi":
 *             - `lca = LCA(ui, vi)`
 *             - `mask_u = segment_tree.query_point(tin[ui])`
 *             - `mask_v = segment_tree.query_point(tin[vi])`
 *             - `mask_lca = segment_tree.query_point(tin[lca])`
 *             - `path_xor_mask = mask_u ^ mask_v ^ mask_lca`
 *             - Check if `(path_xor_mask & (path_xor_mask - 1)) == 0`.
 *
 *          Let's recheck the `query_path_xor(x)` definition with this segment tree.
 *          The segment tree is built on the Euler tour. When we update a range `[tin[u], tout[u]-1]` with `diff_mask`, we are effectively XORing `diff_mask` to all nodes within that time range.
 *          A point query at `tin[v]` will give the XOR sum of all `diff_mask` values that were applied to ranges covering `tin[v]`.
 *
 *          If `tin[v]` is the entry time of node `v`, and we query `segment_tree.query_point(tin[v])`, what does it represent?
 *          It represents the XOR sum of `diff_mask` applied to ranges `[tin[u], tout[u]-1]` where `u` is an ancestor of `v` (including `v`).
 *          This is precisely the change in `XOR_sum(root, v)` due to updates.
 *          So, `segment_tree.query_point(tin[v])` gives the *net change* to the initial XOR sum at node `v`.
 *          To get the actual `XOR_sum(root, v)`, we need the initial XOR sum at `v` (which is `s_masks[v]`) XORed with the net change.
 *          `actual_xor_sum_root_v = s_masks[v] ^ segment_tree.query_point(tin[v])`.
 *
 *          So, the path XOR mask becomes:
 *          `path_xor_mask = (s_masks[ui] ^ segment_tree.query_point(tin[ui])) ^ (s_masks[vi] ^ segment_tree.query_point(tin[vi])) ^ (s_masks[lca] ^ segment_tree.query_point(tin[lca]))`.
 *
 *          Let's simplify the segment tree's role.
 *          We need to store `current_char_mask[i]` for each node `i`. Initially `current_char_mask[i] = 1 << (s[i] - 'a')`.
 *          When `s[ui]` changes from `old_c` to `new_c`, `current_char_mask[ui]` changes by `diff`.
 *          We need `XOR_sum(root, x) = current_char_mask[root] ^ ... ^ current_char_mask[x]`.
 *          `XOR_sum(path_u_v) = XOR_sum(root, u) ^ XOR_sum(root, v) ^ current_char_mask[lca]`.
 *
 *          The problem is that updating `current_char_mask[ui]` by `diff` requires updating `XOR_sum(root, v)` for all `v` in `ui`'s subtree.
 *
 *          Let's use a BIT/Fenwick tree on the Euler tour.
 *          The Fenwick tree will support point updates and prefix XOR sum queries.
 *          We build the Fenwick tree on an array of size `2N`.
 *          Initialize BIT: For each node `i`, `bit.update(tin[i], 1 << (s[i] - 'a'))`.
 *
 *          Update query "update ui c":
 *          - `old_char_code = s[ui].charCodeAt(0) - 'a'`
 *          - `new_char_code = c.charCodeAt(0) - 'a'`
 *          - `diff_mask = (1 << old_char_code) ^ (1 << new_char_code)`
 *          - Update `s[ui] = c`
 *          - `bit.update(tin[ui], diff_mask)`. This updates the value at `tin[ui]`.
 *
 *          Query query "query ui vi":
 *          - `lca = LCA(ui, vi)`
 *          - `xor_u = bit.query(tin[ui])` // XOR sum from root up to ui
 *          - `xor_v = bit.query(tin[vi])` // XOR sum from root up to vi
 *          - `xor_lca = bit.query(tin[lca])` // XOR sum from root up to lca
 *          - `path_xor_mask = xor_u ^ xor_v ^ (1 << (s[lca].charCodeAt(0) - 'a'))`
 *          - Check palindrome condition: `(path_xor_mask & (path_xor_mask - 1)) == 0`.
 *
 *          This looks correct. The BIT update at `tin[ui]` with `diff_mask` correctly reflects the change at node `ui`. The `bit.query(t)` will give the XOR sum of all updates applied to indices `j <= t`.
 *          If we initialize the BIT with the character masks of all nodes, then `bit.query(tin[x])` will give the XOR sum of character masks of all nodes `y` such that `tin[y] <= tin[x]` and `y` is on the path from the root to `x`. This is exactly `XOR_sum(root, x)`.
 *
 *          Let's check `tout`. Do we need it?
 *          The BIT approach only uses `tin`. `tout` is mainly for segment trees to define subtree ranges.
 *
 *          Need to implement:
 *          1. Graph representation (adjacency list).
 *          2. DFS for `tin`, `depth`, `parent` (for LCA).
 *          3. LCA function using binary lifting.
 *          4. Fenwick tree (BIT) class for XOR operations.
 *          5. Main logic to parse queries and use BIT and LCA.
 *
 *          Data structures:
 *          - `adj`: `Array<Array<number>>`
 *          - `s`: `string`
 *          - `queries`: `Array<string>`
 *          - `tin`: `Array<number>`
 *          - `depth`: `Array<number>`
 *          - `parent`: `Array<Array<number>>` (binary lifting table)
 *          - `BIT`: Fenwick tree class instance.
 *          - `char_masks`: `Array<number>` to store current character masks for nodes.
 *
 *          Constants:
 *          - `MAXN`: `50005`
 *          - `LOGN`: `16` (for binary lifting, `log2(50005) ~ 15.6`)
 *
 *          BIT implementation for XOR:
 *          - `update(idx, val)`: `idx += 1; while (idx < size) { tree[idx] ^= val; idx += idx & -idx; }`
 *          - `query(idx)`: `idx += 1; sum = 0; while (idx > 0) { sum ^= tree[idx]; idx -= idx & -idx; } return sum;`
 *          Size of BIT should be `N`.
 *
 *          DFS for `tin`, `depth`, `parent`:
 *          `dfs(u, p, d)`:
 *            `tin[u] = timer++`
 *            `depth[u] = d`
 *            `parent[u][0] = p`
 *            For `k` from 1 to `LOGN-1`: `parent[u][k] = parent[parent[u][k-1]][k-1]`
 *            For each neighbor `v` of `u` if `v != p`: `dfs(v, u, d+1)`
 *
 *          LCA(u, v):
 *            If `depth[u] < depth[v]`, swap `u, v`.
 *            Lift `u` to the same depth as `v`.
 *            If `u == v`, return `u`.
 *            For `k` from `LOGN-1` down to 0:
 *              If `parent[u][k] != parent[v][k]`:
 *                `u = parent[u][k]`
 *                `v = parent[v][k]`
 *            Return `parent[u][0]` (which is the LCA).
 *
 *          Initialization:
 *            `char_masks` array.
 *            For `i = 0` to `N-1`: `char_masks[i] = 1 << (s.charCodeAt(i) - 'a')`.
 *            Initialize BIT of size `N`.
 *            For `i = 0` to `N-1`: `bit.update(i, char_masks[i])`.
 *
 *          Update:
 *            Parse `ui`, `c`.
 *            `old_mask = char_masks[ui]`
 *            `new_mask = 1 << (c.charCodeAt(0) - 'a')`
 *            `diff = old_mask ^ new_mask`
 *            `char_masks[ui] = new_mask`
 *            `bit.update(ui, diff)`
 *
 *          Query:
 *            Parse `ui`, `vi`.
 *            `lca = LCA(ui, vi)`
 *            `mask_u = bit.query(ui)`
 *            `mask_v = bit.query(vi)`
 *            `mask_lca = bit.query(lca)`
 *            `path_xor_mask = mask_u ^ mask_v ^ mask_lca`
 *            Check palindrome condition.
 *
 *          This logic appears sound and uses standard techniques.
 *
 * Time Complexity:
 * - Preprocessing (DFS, LCA table): O(N log N)
 * - BIT initialization: O(N log N)
 * - Update queries: O(log N) for BIT update + O(1) for string update. Total O(log N).
 * - Query queries: O(log N) for LCA + O(log N) for BIT queries. Total O(log N).
 * - Total time complexity: O(N log N + Q log N), where N is the number of nodes and Q is the number of queries.
 *
 * Space Complexity:
 * - Adjacency list: O(N)
 * - `s`, `tin`, `depth`, `parent`, `char_masks`: O(N)
 * - `parent` table for binary lifting: O(N log N)
 * - BIT: O(N)
 * - Total space complexity: O(N log N).
 */
class FenwickTree {
    /**
     * @param {number} size The size of the tree (number of elements).
     */
    constructor(size) {
        this.size = size;
        // Tree array is 1-indexed, so size+1. Initialize with zeros.
        this.tree = new Array(size + 1).fill(0);
    }

    /**
     * Updates the value at index `idx` by XORing `val`.
     * Indices are 0-based externally, converted to 1-based internally.
     * @param {number} idx The 0-based index to update.
     * @param {number} val The value to XOR.
     */
    update(idx, val) {
        // Convert to 1-based index
        idx += 1;
        while (idx <= this.size) {
            this.tree[idx] ^= val;
            // Move to the next relevant index in the BIT structure
            idx += idx & (-idx);
        }
    }

    /**
     * Queries the prefix XOR sum from index 0 up to `idx` (inclusive).
     * Indices are 0-based externally, converted to 1-based internally.
     * @param {number} idx The 0-based index to query up to.
     * @returns {number} The prefix XOR sum.
     */
    query(idx) {
        // Convert to 1-based index
        idx += 1;
        let sum = 0;
        while (idx > 0) {
            sum ^= this.tree[idx];
            // Move to the parent index in the BIT structure
            idx -= idx & (-idx);
        }
        return sum;
    }
}

/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {string} s
 * @param {string[]} queries
 * @return {boolean[]}
 */
var palindromicPathQueries = function(n, edges, s, queries) {
    // Constants for binary lifting
    const LOGN = Math.floor(Math.log2(n)) + 1;

    // Adjacency list to represent the tree
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }

    // Arrays for DFS results and LCA preprocessing
    const tin = new Array(n).fill(0); // Entry time in DFS traversal
    const depth = new Array(n).fill(0); // Depth of each node from root
    // parent[i][k] stores the 2^k-th ancestor of node i
    const parent = Array.from({ length: n }, () => new Array(LOGN).fill(0));
    // Stores the current character mask for each node.
    // A bit is set if the character appears an odd number of times.
    const charMasks = new Array(n).fill(0);

    let timer = 0; // Timer for DFS entry times

    /**
     * Performs Depth First Search to compute entry times, depths, and parents for LCA.
     * @param {number} u The current node.
     * @param {number} p The parent of the current node.
     * @param {number} d The current depth.
     */
    function dfs(u, p, d) {
        tin[u] = timer++;
        depth[u] = d;
        parent[u][0] = p; // The immediate parent

        // Precompute 2^k-th ancestors for binary lifting
        for (let k = 1; k < LOGN; k++) {
            parent[u][k] = parent[parent[u][k - 1]][k - 1];
        }

        // Initialize the character mask for the current node
        charMasks[u] = 1 << (s.charCodeAt(u) - '0');

        // Traverse neighbors
        for (const v of adj[u]) {
            if (v !== p) {
                dfs(v, u, d + 1);
            }
        }
    }

    // Start DFS from root node 0. Its parent is itself, depth is 0.
    dfs(0, 0, 0);

    /**
     * Finds the Lowest Common Ancestor (LCA) of two nodes u and v.
     * Uses binary lifting for efficient computation.
     * @param {number} u The first node.
     * @param {number} v The second node.
     * @returns {number} The LCA of u and v.
     */
    function getLCA(u, v) {
        // Ensure u is deeper or at the same depth as v
        if (depth[u] < depth[v]) {
            [u, v] = [v, u]; // Swap u and v
        }

        // Lift u to the same depth as v
        for (let k = LOGN - 1; k >= 0; k--) {
            if (depth[u] - (1 << k) >= depth[v]) {
                u = parent[u][k];
            }
        }

        // If u and v are the same, then v (or u) is the LCA
        if (u === v) {
            return u;
        }

        // Lift u and v simultaneously until their parents are different
        for (let k = LOGN - 1; k >= 0; k--) {
            if (parent[u][k] !== parent[v][k]) {
                u = parent[u][k];
                v = parent[v][k];
            }
        }

        // The parent of u (or v) is the LCA
        return parent[u][0];
    }

    // Initialize Fenwick tree (BIT) for XOR operations.
    // The BIT will store XOR sums related to character masks.
    // Its size needs to be `n` to cover indices 0 to n-1.
    const bit = new FenwickTree(n);

    // Populate the BIT with initial character masks.
    // The value at index `tin[i]` will represent the XOR contribution of node `i`.
    for (let i = 0; i < n; i++) {
        // Update the BIT at the entry time of node `i` with its character mask.
        // This effectively associates the mask with node `i` for path calculations.
        bit.update(tin[i], charMasks[i]);
    }

    // Array to store the results of query operations
    const answer = [];

    // Process each query
    for (const query of queries) {
        const parts = query.split(' ');
        const type = parts[0];

        if (type === "update") {
            const ui = parseInt(parts[1]);
            const c = parts[2];

            // Get the current character mask for node ui
            const oldMask = charMasks[ui];
            // Calculate the new character mask
            const newMask = 1 << (c.charCodeAt(0) - 'a');
            // Calculate the difference mask due to the update
            const diffMask = oldMask ^ newMask;

            // Update the character mask for node ui
            charMasks[ui] = newMask;
            // Update the BIT. We XOR the difference mask at the entry time of ui.
            // This propagates the change to all path XOR sums that include ui.
            bit.update(tin[ui], diffMask);

        } else if (type === "query") {
            const ui = parseInt(parts[1]);
            const vi = parseInt(parts[2]);

            // Find the LCA of ui and vi
            const lca = getLCA(ui, vi);

            // Calculate the XOR sum of character masks on the path from root to ui.
            // This is obtained by querying the BIT up to the entry time of ui.
            const maskU = bit.query(tin[ui]);
            // Calculate the XOR sum of character masks on the path from root to vi.
            const maskV = bit.query(tin[vi]);
            // Calculate the XOR sum of character masks on the path from root to LCA.
            const maskLCA = bit.query(tin[lca]);

            // The XOR sum of character masks for the path ui to vi is:
            // (Path XOR sum root to ui) XOR (Path XOR sum root to vi) XOR (Mask of LCA)
            // This works because XORing path sums cancels out the common part (root to LCA-1)
            // and leaves the path from LCA to ui and LCA to vi. XORing with LCA's mask
            // correctly accounts for the LCA node itself.
            const pathXorMask = maskU ^ maskV ^ maskLCA;

            // A string can be rearranged into a palindrome if at most one character appears an odd number of times.
            // In terms of bitmasks, this means the pathXorMask should have at most one bit set.
            // A number has at most one bit set if `(number & (number - 1))` is 0.
            // The `pathXorMask` represents the parity of character counts. If it's 0 or a power of 2, it can form a palindrome.
            const canFormPalindrome = (pathXorMask & (pathXorMask - 1)) === 0;
            answer.push(canFormPalindrome);
        }
    }

    return answer;
};
```