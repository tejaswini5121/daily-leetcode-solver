/**
 * Problem Summary: Given an initial string and a series of updates, find the longest
 * substring of a single repeating character after each update.
 *
 * Problem Link: https://leetcode.com/problems/longest-substring-of-one-repeating-character/
 *
 * Approach:
 * This problem requires efficient handling of range queries and point updates. A segment tree is a suitable data structure for this.
 * Each node in the segment tree will represent a substring of 's'. For each node, we need to store information that allows us to
 * efficiently calculate the longest repeating character substring within its range.
 *
 * What to store in each segment tree node:
 * For a given range [L, R], we can store:
 * 1. `len`: The length of the longest substring of a single repeating character within the range [L, R].
 * 2. `leftLen`: The length of the longest repeating character substring starting from the leftmost character of the range [L, R].
 * 3. `rightLen`: The length of the longest repeating character substring ending at the rightmost character of the range [L, R].
 * 4. `leftChar`: The character at the leftmost position of the range [L, R].
 * 5. `rightChar`: The character at the rightmost position of the range [L, R].
 *
 * How to merge nodes:
 * When merging two child nodes (left and right) to form a parent node:
 * - `parent.leftChar = leftChild.leftChar`
 * - `parent.rightChar = rightChild.rightChar`
 * - `parent.len` will be the maximum of:
 *   - `leftChild.len`
 *   - `rightChild.len`
 *   - `leftChild.rightLen + rightChild.leftLen` IF `leftChild.rightChar == rightChild.leftChar` (merge case)
 * - `parent.leftLen`:
 *   - If `leftChild.leftChar == rightChild.leftChar` AND the entire left child range is filled with `leftChild.leftChar`, then `leftChild.leftLen + rightChild.leftLen`.
 *   - Otherwise, `leftChild.leftLen`.
 * - `parent.rightLen`:
 *   - If `leftChild.rightChar == rightChild.rightChar` AND the entire right child range is filled with `rightChild.rightChar`, then `rightChild.rightLen + leftChild.rightLen`.
 *   - Otherwise, `rightChild.rightLen`.
 *
 * Note: The logic for `leftLen` and `rightLen` merge can be simplified. If `leftChild.leftChar == rightChild.leftChar`, then `parent.leftLen` is `leftChild.leftLen + rightChild.leftLen`. Otherwise, it's `leftChild.leftLen`. Similarly for `rightLen`.
 *
 * Build phase:
 * The segment tree will be built recursively. For leaf nodes (representing a single character), `len`, `leftLen`, and `rightLen` will all be 1. `leftChar` and `rightChar` will be the character itself.
 *
 * Update phase:
 * When a query updates a character at a specific index, we perform a point update on the segment tree. This involves traversing down to the leaf node corresponding to the index, updating its values, and then propagating the changes upwards by re-merging parent nodes.
 *
 * After each update, the `len` of the root node of the segment tree will give us the answer for that query.
 *
 * Time Complexity:
 * - Building the segment tree: O(N), where N is the length of the string 's'.
 * - Each query (update): O(log N). Since there are K queries, the total time for queries is O(K log N).
 * - Overall Time Complexity: O(N + K log N).
 *
 * Space Complexity:
 * - Segment tree: O(N) to store the tree nodes.
 * - Overall Space Complexity: O(N).
 */
class Solution {
    // Node class for the segment tree.
    // Each node stores information about the longest repeating character substring
    // within its corresponding range.
    private static class Node {
        int len; // Length of the longest repeating character substring in the range.
        int leftLen; // Length of the longest repeating character substring starting from the left.
        int rightLen; // Length of the longest repeating character substring ending at the right.
        char leftChar; // The character at the leftmost position of the range.
        char rightChar; // The character at the rightmost position of the range.

        Node(int len, int leftLen, int rightLen, char leftChar, char rightChar) {
            this.len = len;
            this.leftLen = leftLen;
            this.rightLen = rightLen;
            this.leftChar = leftChar;
            this.rightChar = rightChar;
        }

        // Default constructor for initialization.
        Node() {
        }
    }

    private Node[] tree; // The segment tree array.
    private char[] sChars; // Character array representation of the input string 's'.
    private int n; // Length of the input string 's'.

    /**
     * Merges two child nodes into a parent node.
     * This is the core logic for calculating the segment tree properties.
     *
     * @param leftChild  The left child node.
     * @param rightChild The right child node.
     * @return The merged parent node.
     */
    private Node merge(Node leftChild, Node rightChild) {
        Node parent = new Node();

        // The leftmost character of the parent is the leftmost character of the left child.
        parent.leftChar = leftChild.leftChar;
        // The rightmost character of the parent is the rightmost character of the right child.
        parent.rightChar = rightChild.rightChar;

        // Calculate parent.len:
        // It's the maximum of:
        // 1. The longest substring in the left child.
        // 2. The longest substring in the right child.
        // 3. The combined length of the rightmost substring of the left child and the leftmost substring of the right child,
        //    IF their characters match (meaning they can merge into a single longer substring).
        parent.len = Math.max(leftChild.len, rightChild.len);
        if (leftChild.rightChar == rightChild.leftChar) {
            parent.len = Math.max(parent.len, leftChild.rightLen + rightChild.leftLen);
        }

        // Calculate parent.leftLen:
        // If the leftmost character of the left child is the same as the leftmost character of the right child,
        // and the entire left child range consists of that character (leftLen == range_size_of_left_child),
        // then we can extend the left substring of the right child.
        // However, a simpler logic works: if leftChild.leftChar == rightChild.leftChar,
        // we can potentially extend. The actual length is leftChild.leftLen + rightChild.leftLen.
        // If they are different, then the leftLen is simply leftChild.leftLen.
        parent.leftLen = leftChild.leftLen;
        if (leftChild.leftChar == rightChild.leftChar) {
            parent.leftLen += rightChild.leftLen;
        }


        // Calculate parent.rightLen:
        // Similar logic to parent.leftLen, but for the right side.
        parent.rightLen = rightChild.rightLen;
        if (leftChild.rightChar == rightChild.rightChar) {
            parent.rightLen += leftChild.rightLen;
        }

        return parent;
    }

    /**
     * Builds the segment tree recursively.
     *
     * @param nodeIndex The index of the current node in the 'tree' array.
     * @param start     The start index of the range covered by the current node.
     * @param end       The end index of the range covered by the current node.
     */
    private void build(int nodeIndex, int start, int end) {
        // Base case: If the range is a single element (leaf node).
        if (start == end) {
            char c = sChars[start];
            tree[nodeIndex] = new Node(1, 1, 1, c, c);
            return;
        }

        // Recursive step: Divide the range and build children.
        int mid = start + (end - start) / 2;
        int leftChildIndex = 2 * nodeIndex + 1;
        int rightChildIndex = 2 * nodeIndex + 2;

        build(leftChildIndex, start, mid);
        build(rightChildIndex, mid + 1, end);

        // Merge the children's information into the current node.
        tree[nodeIndex] = merge(tree[leftChildIndex], tree[rightChildIndex]);
    }

    /**
     * Updates a character at a specific index in the string and propagates the change up the segment tree.
     *
     * @param nodeIndex The index of the current node in the 'tree' array.
     * @param start     The start index of the range covered by the current node.
     * @param end       The end index of the range covered by the current node.
     * @param updateIdx The index of the character to update.
     * @param newChar   The new character to set.
     */
    private void update(int nodeIndex, int start, int end, int updateIdx, char newChar) {
        // Base case: If the current node's range contains the update index (leaf node).
        if (start == end) {
            sChars[updateIdx] = newChar; // Update the character in the original array.
            tree[nodeIndex] = new Node(1, 1, 1, newChar, newChar); // Update the segment tree node.
            return;
        }

        // Recursive step: Determine which child to traverse.
        int mid = start + (end - start) / 2;
        int leftChildIndex = 2 * nodeIndex + 1;
        int rightChildIndex = 2 * nodeIndex + 2;

        if (updateIdx <= mid) {
            // Update is in the left child's range.
            update(leftChildIndex, start, mid, updateIdx, newChar);
        } else {
            // Update is in the right child's range.
            update(rightChildIndex, mid + 1, end, updateIdx, newChar);
        }

        // After updating the child, re-merge the children's information into the current node.
        tree[nodeIndex] = merge(tree[leftChildIndex], tree[rightChildIndex]);
    }

    /**
     * Solves the problem by processing each query and returning the lengths of the
     * longest repeating character substrings.
     *
     * @param s               The initial string.
     * @param queryCharacters The characters to update with.
     * @param queryIndices    The indices to update at.
     * @return An array of lengths after each query.
     */
    public int[] longestRepeating(String s, String queryCharacters, int[] queryIndices) {
        this.n = s.length();
        this.sChars = s.toCharArray();

        // The segment tree will have at most 4*N nodes.
        this.tree = new Node[4 * n];

        // Build the initial segment tree.
        build(0, 0, n - 1);

        int k = queryCharacters.length();
        int[] lengths = new int[k];

        // Process each query.
        for (int i = 0; i < k; i++) {
            char queryChar = queryCharacters.charAt(i);
            int queryIndex = queryIndices[i];

            // Update the segment tree with the new character at the specified index.
            update(0, 0, n - 1, queryIndex, queryChar);

            // The length of the longest repeating substring after this update is stored
            // in the root node (index 0) of the segment tree.
            lengths[i] = tree[0].len;
        }

        return lengths;
    }
}