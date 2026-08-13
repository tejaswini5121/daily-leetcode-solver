/**
 * @param {string} s
 * @param {string} queryCharacters
 * @param {number[]} queryIndices
 * @return {number[]}
 */
// Problem: Longest Substring of One Repeating Character
// Link: https://leetcode.com/problems/longest-substring-of-one-repeating-character/
// Approach:
// This problem requires efficiently updating the string and querying the longest repeating substring.
// A segment tree is a suitable data structure for this. Each node in the segment tree will store
// information about the substring it represents. Specifically, for each character ('a' through 'z'),
// a node will store:
// 1. `count`: The length of the longest consecutive repeating substring of that character within the node's range.
// 2. `prefixCount`: The length of the consecutive repeating substring of that character starting from the left end of the node's range.
// 3. `suffixCount`: The length of the consecutive repeating substring of that character ending at the right end of the node's range.
//
// When performing a query update, we traverse the segment tree to find the leaf node corresponding to the updated index.
// We then update the information in that leaf node. As we backtrack up the tree, we merge the information from child nodes
// to update the parent node.
// The merge operation for two child nodes (left and right) into a parent node involves:
// - `count`: For each character, the `count` in the parent is the maximum of the `count`s in the left and right children.
//            Additionally, if the suffix of the left child matches the prefix of the right child for a character,
//            we also consider the sum of their prefix and suffix counts.
// - `prefixCount`: If the left child's prefix for a character covers its entire range, the parent's prefix is the
//                  sum of the left child's prefix and the right child's prefix. Otherwise, it's just the left child's prefix.
// - `suffixCount`: Similarly, if the right child's suffix for a character covers its entire range, the parent's suffix is the
//                  sum of the right child's suffix and the left child's suffix. Otherwise, it's just the right child's suffix.
//
// After each update, the `count` for the character 'a' in the root node will hold the overall longest repeating substring length.
//
// Time Complexity:
// - Building the segment tree: O(N * 26), where N is the length of the string s. This is because each node is processed, and we do 26 character checks.
// - Querying (updating): O(log N * 26). Each update traverses the tree (log N levels), and at each level, we merge information for 26 characters.
// - Total time complexity for k queries: O(N * 26 + k * log N * 26) which simplifies to O(N + k log N) since 26 is a constant.
//
// Space Complexity:
// - Segment tree: O(N * 26) for storing node information for each character. This simplifies to O(N).
// - Output array: O(k) for storing the results of each query.
// - Total space complexity: O(N + k).
//
const MOD = 26; // For the 26 lowercase English letters

class Node {
    constructor() {
        // For each character 'a' through 'z', store:
        // count: length of the longest repeating substring of this character.
        // prefixCount: length of the repeating substring starting from the left.
        // suffixCount: length of the repeating substring ending at the right.
        this.counts = Array(MOD).fill(0);
        this.prefixCounts = Array(MOD).fill(0);
        this.suffixCounts = Array(MOD).fill(0);
    }
}

class SegmentTree {
    constructor(s) {
        this.n = s.length;
        // The tree array will store Node objects. The size is roughly 4*n for a complete binary tree.
        this.tree = Array(4 * this.n).fill(null).map(() => new Node());
        this.s = s.split(''); // Convert string to array for easier modification.
        this.build(0, 0, this.n - 1);
    }

    // Merge operation for two child nodes into a parent node.
    merge(parent, left, right) {
        for (let charCode = 0; charCode < MOD; charCode++) {
            // The longest repeating substring in the parent is the max of the longest in children.
            parent.counts[charCode] = Math.max(left.counts[charCode], right.counts[charCode]);
            // If the suffix of the left child and prefix of the right child match for this char,
            // we can potentially form a longer repeating substring across the boundary.
            if (left.suffixCounts[charCode] + right.prefixCounts[charCode] > parent.counts[charCode]) {
                parent.counts[charCode] = left.suffixCounts[charCode] + right.prefixCounts[charCode];
            }

            // Calculate prefix count for the parent.
            // If the left child's prefix covers its entire range, then the parent's prefix
            // is the sum of left's prefix and right's prefix. Otherwise, it's just left's prefix.
            if (left.prefixCounts[charCode] === (right.end - right.start + 1)) { // Check if left child's range is fully covered by its prefix
                parent.prefixCounts[charCode] = left.prefixCounts[charCode] + right.prefixCounts[charCode];
            } else {
                parent.prefixCounts[charCode] = left.prefixCounts[charCode];
            }

            // Calculate suffix count for the parent.
            // If the right child's suffix covers its entire range, then the parent's suffix
            // is the sum of right's suffix and left's suffix. Otherwise, it's just right's suffix.
            if (right.suffixCounts[charCode] === (right.end - right.start + 1)) { // Check if right child's range is fully covered by its suffix
                parent.suffixCounts[charCode] = right.suffixCounts[charCode] + left.suffixCounts[charCode];
            } else {
                parent.suffixCounts[charCode] = right.suffixCounts[charCode];
            }
        }
    }

    // Build the segment tree recursively.
    build(treeIndex, start, end) {
        // Store range information in the node itself for easier merging.
        this.tree[treeIndex].start = start;
        this.tree[treeIndex].end = end;

        // Base case: if it's a leaf node (single character).
        if (start === end) {
            const charCode = this.s[start].charCodeAt(0) - 'a'.charCodeAt(0);
            this.tree[treeIndex].counts[charCode] = 1;
            this.tree[treeIndex].prefixCounts[charCode] = 1;
            this.tree[treeIndex].suffixCounts[charCode] = 1;
            return;
        }

        // Recursive step: divide the range into two halves and build children.
        const mid = Math.floor((start + end) / 2);
        const leftChildIndex = 2 * treeIndex + 1;
        const rightChildIndex = 2 * treeIndex + 2;

        this.build(leftChildIndex, start, mid);
        this.build(rightChildIndex, mid + 1, end);

        // Merge the information from children into the parent node.
        this.merge(this.tree[treeIndex], this.tree[leftChildIndex], this.tree[rightChildIndex]);
    }

    // Update a character at a specific index.
    update(treeIndex, start, end, updateIndex, newChar) {
        // Base case: if the current node's range is the index to be updated.
        if (start === end) {
            // Reset all counts for the old character.
            const oldCharCode = this.s[updateIndex].charCodeAt(0) - 'a'.charCodeAt(0);
            this.tree[treeIndex].counts[oldCharCode] = 0;
            this.tree[treeIndex].prefixCounts[oldCharCode] = 0;
            this.tree[treeIndex].suffixCounts[oldCharCode] = 0;

            // Update the character in the original string array.
            this.s[updateIndex] = newChar;
            const newCharCode = newChar.charCodeAt(0) - 'a'.charCodeAt(0);

            // Set counts for the new character.
            this.tree[treeIndex].counts[newCharCode] = 1;
            this.tree[treeIndex].prefixCounts[newCharCode] = 1;
            this.tree[treeIndex].suffixCounts[newCharCode] = 1;
            return;
        }

        const mid = Math.floor((start + end) / 2);
        const leftChildIndex = 2 * treeIndex + 1;
        const rightChildIndex = 2 * treeIndex + 2;

        // Recurse into the appropriate child.
        if (updateIndex <= mid) {
            this.update(leftChildIndex, start, mid, updateIndex, newChar);
        } else {
            this.update(rightChildIndex, mid + 1, end, updateIndex, newChar);
        }

        // After updating a child, re-merge to update the parent.
        this.merge(this.tree[treeIndex], this.tree[leftChildIndex], this.tree[rightChildIndex]);
    }

    // Get the length of the longest repeating substring of a specific character.
    // This is always available at the root of the tree for each character.
    getLongestRepeatingSubstringLength(charCode) {
        // The longest repeating substring is stored in the root node's counts for that character.
        return this.tree[0].counts[charCode];
    }
}

/**
 * @param {string} s
 * @param {string} queryCharacters
 * @param {number[]} queryIndices
 * @return {number[]}
 */
var longestRepeatingCharacters = function(s, queryCharacters, queryIndices) {
    const k = queryCharacters.length;
    const lengths = [];
    const segmentTree = new SegmentTree(s);

    // Process each query.
    for (let i = 0; i < k; i++) {
        const indexToUpdate = queryIndices[i];
        const newCharacter = queryCharacters[i];

        // Update the segment tree with the new character at the specified index.
        segmentTree.update(0, 0, segmentTree.n - 1, indexToUpdate, newCharacter);

        // After each update, find the maximum length among all characters.
        let maxLen = 0;
        for (let charCode = 0; charCode < MOD; charCode++) {
            maxLen = Math.max(maxLen, segmentTree.getLongestRepeatingSubstringLength(charCode));
        }
        lengths.push(maxLen);
    }

    return lengths;
};
