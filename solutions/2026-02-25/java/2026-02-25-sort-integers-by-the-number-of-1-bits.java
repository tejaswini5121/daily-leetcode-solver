// Problem: Sort Integers by The Number of 1 Bits
// Link: https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/
//
// Approach:
// The problem requires sorting an array of integers based on two criteria:
// 1. The number of set bits (1s) in their binary representation (ascending).
// 2. If the number of set bits is the same, then sort by the integer value itself (ascending).
//
// We can achieve this by using a custom comparator with Java's `Arrays.sort()` method.
// The comparator will first count the set bits for each pair of numbers.
// If the counts are different, it sorts based on the counts.
// If the counts are the same, it sorts based on the actual integer values.
//
// To count the set bits in an integer, we can use the `Integer.bitCount()` method provided by Java,
// which efficiently counts the number of set bits.
//
// Time Complexity:
// The `Arrays.sort()` method for primitive arrays typically uses a dual-pivot quicksort algorithm,
// which has an average time complexity of O(N log N), where N is the length of the array.
// The custom comparator involves `Integer.bitCount()`, which takes O(log M) time where M is the maximum
// value of an integer (or O(1) as the number of bits in an integer is fixed, e.g., 32 for int).
// Therefore, the overall time complexity is O(N log N * log M) or effectively O(N log N) because
// `Integer.bitCount()` is very efficient.
//
// Space Complexity:
// The `Arrays.sort()` method, in its in-place implementation (or with limited auxiliary space),
// typically has a space complexity of O(log N) for the recursion stack in quicksort, or O(1)
// for some iterative sorts. The `Integer.bitCount()` method uses constant extra space.
// Thus, the overall space complexity is O(log N) or O(1) depending on the specific sort implementation details.
// For Java's `Arrays.sort` on primitive arrays, it's generally considered O(log N) due to recursion.
//
class Solution {
    public int[] sortByBits(int[] arr) {
        // Use Arrays.sort with a custom comparator.
        // The comparator defines the sorting logic.
        // We need to sort the array of primitive integers, so we'll box them into an Integer array
        // to use the comparator, and then convert back to an int array.
        Integer[] boxedArr = new Integer[arr.length];
        for (int i = 0; i < arr.length; i++) {
            boxedArr[i] = arr[i];
        }

        // Sort the boxed array using a lambda expression as a custom comparator.
        java.util.Arrays.sort(boxedArr, (a, b) -> {
            // Count the number of set bits (1s) in the binary representation of 'a' and 'b'.
            int bitsA = Integer.bitCount(a);
            int bitsB = Integer.bitCount(b);

            // First, compare based on the number of set bits.
            if (bitsA != bitsB) {
                // If the number of bits is different, sort in ascending order of bit count.
                return bitsA - bitsB;
            } else {
                // If the number of bits is the same, sort in ascending order of the integer values.
                return a - b;
            }
        });

        // Convert the sorted boxed array back to a primitive int array.
        int[] sortedArr = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            sortedArr[i] = boxedArr[i];
        }

        // Return the sorted array.
        return sortedArr;
    }
}
