// Problem: Check if Strings Can be Made Equal With Operations I
// Link: https://leetcode.com/problems/check-if-strings-can-be-made-equal-with-operations-i/
// Approach:
// The allowed operation is swapping characters at indices i and j where j - i = 2.
// This means we can swap characters at indices (0, 2) and (1, 3).
// This operation effectively allows us to swap characters at even indices with each other,
// and characters at odd indices with each other, independently.
// Therefore, for two strings to be made equal, the set of characters at even positions
// in both strings must be the same, and the set of characters at odd positions in
// both strings must also be the same.
// We can check this by:
// 1. Extracting characters at even indices (0 and 2) from s1 and s2. Sort these two pairs and compare.
// 2. Extracting characters at odd indices (1 and 3) from s1 and s2. Sort these two pairs and compare.
// If both pairs of sets are identical, then the strings can be made equal.
// Time Complexity: O(1) - The length of the strings is fixed at 4. Sorting two pairs of characters takes constant time.
// Space Complexity: O(1) - We are using a fixed amount of extra space to store character pairs.

class Solution {
    public boolean canBeEqual(String s1, String s2) {
        // Check if characters at even indices can be made equal.
        // Even indices in a string of length 4 are 0 and 2.
        // We need to check if the multiset of characters at {s1[0], s1[2]}
        // is the same as the multiset of characters at {s2[0], s2[2]}.
        // Sorting them is an easy way to compare multisets.
        char[] s1_even = {s1.charAt(0), s1.charAt(2)};
        char[] s2_even = {s2.charAt(0), s2.charAt(2)};
        java.util.Arrays.sort(s1_even);
        java.util.Arrays.sort(s2_even);

        // If the sorted even character pairs are not equal, the strings cannot be made equal.
        if (!java.util.Arrays.equals(s1_even, s2_even)) {
            return false;
        }

        // Check if characters at odd indices can be made equal.
        // Odd indices in a string of length 4 are 1 and 3.
        // We need to check if the multiset of characters at {s1[1], s1[3]}
        // is the same as the multiset of characters at {s2[1], s2[3]}.
        char[] s1_odd = {s1.charAt(1), s1.charAt(3)};
        char[] s2_odd = {s2.charAt(1), s2.charAt(3)};
        java.util.Arrays.sort(s1_odd);
        java.util.Arrays.sort(s2_odd);

        // If the sorted odd character pairs are equal, and the even pairs were also equal,
        // then the strings can be made equal.
        return java.util.Arrays.equals(s1_odd, s2_odd);
    }
}
