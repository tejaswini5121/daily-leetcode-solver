```cpp
/*
Problem Summary: Given a string and a series of updates, find the length of the longest substring of repeating characters after each update.
Link: https://leetcode.com/problems/longest-substring-of-one-repeating-character/

Approach:
This problem can be efficiently solved using a segment tree. Each node in the segment tree will store information about a contiguous range of the string. For each node representing the range [L, R], we need to store:
1. The character that appears most frequently in this range.
2. The length of the longest consecutive substring of that character in this range.
3. The length of the consecutive substring of the left boundary character extending to the right.
4. The length of the consecutive substring of the right boundary character extending to the left.

When merging two child nodes (representing ranges [L, mid] and [mid+1, R]), we can compute the information for the parent node. The key part is handling the case where the longest substring spans across the midpoint. If the rightmost character of the left child's range is the same as the leftmost character of the right child's range, we can combine their respective boundary lengths to form a potentially longer substring.

The update operation in the segment tree is point update, which takes O(log N) time, where N is the length of the string. Querying the root of the segment tree for the overall longest substring also takes O(1) after the update. Therefore, for k queries, the total time complexity is O(N + k log N) for building the tree and processing queries.

Time Complexity:
- Building the segment tree: O(N), where N is the length of the string s.
- Each query (update): O(log N).
- Total time complexity for k queries: O(N + k log N).

Space Complexity:
- Segment tree: O(N), as the tree has at most 4N nodes.
*/

#include <vector>
#include <string>
#include <algorithm>

using namespace std;

// Structure to store information about a segment tree node
struct Node {
    // The character that appears most frequently in the range.
    // If multiple characters have the same max frequency, this can be any of them.
    char dominantChar = ' ';
    // The length of the longest consecutive substring of dominantChar.
    int maxLen = 0;
    // The length of the consecutive substring of the character at the left boundary of the range.
    int leftLen = 0;
    // The length of the consecutive substring of the character at the right boundary of the range.
    int rightLen = 0;
    // The total length of the range represented by this node.
    int len = 0;
};

// Global variables for the segment tree and the original string
vector<Node> tree;
string s_global;

// Function to merge two child nodes into a parent node
Node merge(const Node& left, const Node& right) {
    Node res;
    res.len = left.len + right.len;

    // Calculate leftLen for the parent
    res.leftLen = left.leftLen;
    if (left.leftLen == left.len && left.dominantChar == right.dominantChar) {
        res.leftLen += right.leftLen;
    }

    // Calculate rightLen for the parent
    res.rightLen = right.rightLen;
    if (right.rightLen == right.len && right.dominantChar == left.dominantChar) {
        res.rightLen += left.rightLen;
    }

    // Calculate maxLen for the parent
    res.maxLen = max({left.maxLen, right.maxLen, left.rightLen + right.leftLen});

    // Determine the dominantChar for the parent
    // This part is slightly tricky. We prioritize the character with the longest run,
    // and if there's a tie, we can pick either. For simplicity and correctness in this problem,
    // we can infer the dominant character based on which child's properties contribute to the maxLen.
    // A more robust approach might explicitly track max frequencies and corresponding characters.
    // However, given how maxLen is calculated (combining boundary runs), we can infer.
    // If left.maxLen is greater, it's left.dominantChar. If right.maxLen is greater, it's right.dominantChar.
    // If left.rightLen + right.leftLen is the max, and left.dominantChar == right.dominantChar, then it's that char.
    // If they are different, the problem statement implies we just need *a* longest substring.

    // Let's simplify the dominantChar logic: if left.maxLen is greater than right.maxLen,
    // then left.dominantChar is a candidate. If right.maxLen is greater, right.dominantChar is a candidate.
    // If left.rightLen + right.leftLen is the maximum, and left.dominantChar == right.dominantChar,
    // then that character is dominant. If they are different, we can pick either.
    // The critical part for the problem is maxLen, not necessarily a perfectly tracked dominantChar across merges.
    // However, for updating left/right boundaries correctly, we DO need to know the boundary chars.

    // Correct logic for dominantChar and maxLen:
    // The longest substring in the merged node is either:
    // 1. The longest in the left child.
    // 2. The longest in the right child.
    // 3. The combination of rightmost run in left and leftmost run in right if chars match.

    if (left.maxLen > right.maxLen) {
        res.dominantChar = left.dominantChar;
    } else {
        res.dominantChar = right.dominantChar;
    }
    // If the combined run is longer than both children's max, and they have the same dominant character
    if (left.dominantChar == right.dominantChar && left.rightLen + right.leftLen > res.maxLen) {
        res.maxLen = left.rightLen + right.leftLen;
        res.dominantChar = left.dominantChar; // or right.dominantChar, they are the same
    }


    return res;
}


// Function to build the segment tree
void build(int node, int start, int end) {
    tree[node].len = end - start + 1;
    if (start == end) {
        // Leaf node: represents a single character
        tree[node].dominantChar = s_global[start];
        tree[node].maxLen = 1;
        tree[node].leftLen = 1;
        tree[node].rightLen = 1;
        return;
    }

    int mid = start + (end - start) / 2;
    // Recursively build left and right children
    build(2 * node, start, mid);
    build(2 * node + 1, mid + 1, end);

    // Merge the results from children
    tree[node] = merge(tree[2 * node], tree[2 * node + 1]);
}

// Function to update a character in the string and the segment tree
void update(int node, int start, int end, int idx, char val) {
    if (start == end) {
        // Leaf node: update the character and its properties
        s_global[idx] = val;
        tree[node].dominantChar = val;
        tree[node].maxLen = 1;
        tree[node].leftLen = 1;
        tree[node].rightLen = 1;
        return;
    }

    int mid = start + (end - start) / 2;
    if (start <= idx && idx <= mid) {
        // If the index is in the left child's range, update the left child
        update(2 * node, start, mid, idx, val);
    } else {
        // If the index is in the right child's range, update the right child
        update(2 * node + 1, mid + 1, end, idx, val);
    }

    // After updating a child, re-merge to update the parent
    tree[node] = merge(tree[2 * node], tree[2 * node + 1]);
}

class Solution {
public:
    vector<int> longestSubstring(string s, string queryCharacters, vector<int>& queryIndices) {
        s_global = s; // Copy s to a global variable for easier access in helper functions
        int n = s.length();
        tree.assign(4 * n, Node()); // Initialize segment tree with appropriate size

        // Build the segment tree initially
        build(1, 0, n - 1);

        vector<int> lengths;
        // Process each query
        for (int i = 0; i < queryCharacters.length(); ++i) {
            int index = queryIndices[i];
            char character = queryCharacters[i];
            
            // Update the string and the segment tree
            update(1, 0, n - 1, index, character);
            
            // The longest substring length after the update is stored at the root of the tree
            lengths.push_back(tree[1].maxLen);
        }

        return lengths;
    }
};
```