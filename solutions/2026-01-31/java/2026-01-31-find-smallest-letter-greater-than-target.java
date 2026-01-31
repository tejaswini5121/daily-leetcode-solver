```java
// Problem: Find Smallest Letter Greater Than Target
// Summary: Given a sorted array of characters and a target character, find the smallest character in the array that is lexicographically greater than the target. If no such character exists, return the first character of the array.
// Link: https://leetcode.com/problems/find-smallest-letter-greater-than-target/
// Approach:
// We can use binary search to efficiently find the smallest character greater than the target.
// The array 'letters' is sorted, which is a prerequisite for binary search.
// We initialize two pointers, 'low' to the beginning of the array and 'high' to the end.
// In each step of the binary search, we calculate the middle index.
// If the character at the middle index is less than or equal to the target, it means the smallest character greater than target (if it exists) must be in the right half of the current search space. So, we move 'low' to mid + 1.
// If the character at the middle index is greater than the target, it means this character could be our answer, or a smaller character greater than target might exist in the left half. So, we store this character as a potential answer and move 'high' to mid - 1.
// After the binary search loop finishes, 'low' will point to the index of the smallest character greater than target.
// If 'low' goes beyond the array bounds (i.e., low == letters.length), it means no character in the array is greater than the target. In this case, as per the problem statement, we return the first character of the array (letters[0]).
// Otherwise, we return the character at the index pointed to by 'low'.
//
// Time Complexity: O(log n), where n is the number of characters in the 'letters' array. This is because binary search divides the search space in half with each comparison.
// Space Complexity: O(1), as we are only using a few variables to store pointers and the result, regardless of the input size.
class Solution {
    public char nextGreatestLetter(char[] letters, char target) {
        int low = 0;
        int high = letters.length - 1;

        // If target is greater than or equal to the last character,
        // the smallest character greater than target must be the first character (due to wrap-around logic implied by the problem).
        // This check also handles cases where target is larger than any character in the array.
        if (target >= letters[high]) {
            return letters[0];
        }

        // Perform binary search
        while (low <= high) {
            int mid = low + (high - low) / 2; // Calculate mid to prevent potential integer overflow

            // If the character at mid is less than or equal to the target,
            // we need to search in the right half for a larger character.
            if (letters[mid] <= target) {
                low = mid + 1;
            }
            // If the character at mid is greater than the target,
            // this character is a potential candidate. We store it and
            // try to find an even smaller character in the left half.
            else {
                high = mid - 1;
            }
        }

        // After the loop, 'low' points to the index of the smallest character
        // that is strictly greater than 'target'.
        // If 'low' is out of bounds, it implies no such character was found,
        // and we should return the first character of the array as per the problem.
        // However, the initial check `if (target >= letters[high])` already handles
        // the case where we need to wrap around to the first element.
        // Therefore, if the loop finishes, 'low' will always be a valid index
        // pointing to the first element greater than target.
        return letters[low];
    }
}
```