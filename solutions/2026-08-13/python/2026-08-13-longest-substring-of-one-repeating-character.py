```python
# Problem: Longest Substring of One Repeating Character
# Link: https://leetcode.com/problems/longest-substring-of-one-repeating-character/
# Approach:
# This problem involves repeated updates and queries about the longest repeating character substring.
# A segment tree is a suitable data structure for this problem because it allows for efficient
# range queries and point updates. Each node in the segment tree will store information about
# the substring it represents.
# For each node in the segment tree, we need to store:
# 1. The longest repeating character substring length within that range.
# 2. The length of the repeating character substring at the left boundary of the range.
# 3. The length of the repeating character substring at the right boundary of the range.
# 4. The character at the left boundary.
# 5. The character at the right boundary.
# 6. The total length of the range.
#
# When merging two child nodes, we can calculate the information for the parent node:
# - The longest repeating substring in the parent can be:
#   a. The longest repeating substring in the left child.
#   b. The longest repeating substring in the right child.
#   c. A substring formed by merging the rightmost repeating substring of the left child
#      and the leftmost repeating substring of the right child, if their characters match.
# - The left boundary information for the parent is taken from the left child, unless
#   the entire left child range consists of the same character and it matches the
#   leftmost character of the right child. In that case, the length will be the sum
#   of lengths.
# - Similarly, the right boundary information is derived from the right child.
#
# When a query updates a character at a specific index, we traverse the segment tree
# to the leaf node corresponding to that index and update its information. Then, we
# propagate these updates upwards to the root.
#
# Time Complexity:
# Building the segment tree: O(N), where N is the length of the string s.
# Each query (update): O(log N) because we traverse down the tree and then update
#                     upwards.
# Total time complexity for k queries: O(N + k log N).
#
# Space Complexity:
# O(N) for storing the segment tree.
#
# Detailed Segment Tree Node Structure:
# Each node will be a tuple or object with the following attributes:
# - `max_len`: The length of the longest repeating character substring within this node's range.
# - `left_len`: The length of the repeating character substring at the left end of this node's range.
# - `right_len`: The length of the repeating character substring at the right end of this node's range.
# - `left_char`: The character at the left end of this node's range.
# - `right_char`: The character at the right end of this node's range.
# - `total_len`: The total length of the range covered by this node.

class SegmentTreeNode:
    def __init__(self, max_len=0, left_len=0, right_len=0, left_char='', right_char='', total_len=0):
        self.max_len = max_len
        self.left_len = left_len
        self.right_len = right_len
        self.left_char = left_char
        self.right_char = right_char
        self.total_len = total_len

def merge_nodes(left_node, right_node):
    if not left_node:
        return right_node
    if not right_node:
        return left_node

    merged_node = SegmentTreeNode()
    merged_node.total_len = left_node.total_len + right_node.total_len

    # Calculate max_len
    merged_node.max_len = max(left_node.max_len, right_node.max_len)
    if left_node.right_char == right_node.left_char:
        merged_node.max_len = max(merged_node.max_len, left_node.right_len + right_node.left_len)

    # Calculate left_len
    merged_node.left_char = left_node.left_char
    merged_node.left_len = left_node.left_len
    if left_node.left_char == right_node.left_char and left_node.left_len == left_node.total_len:
        merged_node.left_len += right_node.left_len

    # Calculate right_len
    merged_node.right_char = right_node.right_char
    merged_node.right_len = right_node.right_len
    if left_node.right_char == right_node.right_char and right_node.right_len == right_node.total_len:
        merged_node.right_len += left_node.right_len

    return merged_node

def build_segment_tree(s, tree, node_idx, start, end):
    if start == end:
        # Leaf node represents a single character
        tree[node_idx] = SegmentTreeNode(max_len=1, left_len=1, right_len=1, left_char=s[start], right_char=s[start], total_len=1)
        return

    mid = (start + end) // 2
    left_child_idx = 2 * node_idx + 1
    right_child_idx = 2 * node_idx + 2

    build_segment_tree(s, tree, left_child_idx, start, mid)
    build_segment_tree(s, tree, right_child_idx, mid + 1, end)

    tree[node_idx] = merge_nodes(tree[left_child_idx], tree[right_child_idx])

def update_segment_tree(s, tree, node_idx, start, end, update_idx, new_char):
    if start == end:
        # Found the leaf node to update
        s[update_idx] = new_char # Update the original string as well for reference if needed elsewhere
        tree[node_idx] = SegmentTreeNode(max_len=1, left_len=1, right_len=1, left_char=new_char, right_char=new_char, total_len=1)
        return

    mid = (start + end) // 2
    left_child_idx = 2 * node_idx + 1
    right_child_idx = 2 * node_idx + 2

    if start <= update_idx <= mid:
        # Update is in the left subtree
        update_segment_tree(s, tree, left_child_idx, start, mid, update_idx, new_char)
    else:
        # Update is in the right subtree
        update_segment_tree(s, tree, right_child_idx, mid + 1, end, update_idx, new_char)

    # After updating child, merge to update parent
    tree[node_idx] = merge_nodes(tree[left_child_idx], tree[right_child_idx])

class Solution:
    def longestRepeating(self, s: str, queryCharacters: str, queryIndices: list[int]) -> list[int]:
        n = len(s)
        # The size of the segment tree is typically 4*N for safe allocation
        tree = [None] * (4 * n)
        s_list = list(s) # Convert string to list for mutable updates

        # Build the segment tree
        build_segment_tree(s_list, tree, 0, 0, n - 1)

        results = []
        for i in range(len(queryCharacters)):
            query_idx = queryIndices[i]
            new_char = queryCharacters[i]

            # Update the segment tree
            update_segment_tree(s_list, tree, 0, 0, n - 1, query_idx, new_char)

            # The longest repeating substring length is stored at the root of the tree
            results.append(tree[0].max_len)

        return results

```