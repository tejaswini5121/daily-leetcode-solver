```java
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * Replaces each element in an array with its rank based on its value.
     * The rank starts at 1, larger elements have larger ranks, and equal elements share the same rank.
     * Link: https://leetcode.com/problems/rank-transform-of-an-array/
     *
     * Approach:
     * 1. Create a sorted copy of the original array to determine the order of elements.
     * 2. Use a HashMap to store the rank of each unique element. Iterate through the sorted array,
     *    assigning ranks starting from 1. If an element is a duplicate, it gets the same rank as
     *    the previous occurrence.
     * 3. Create a result array of the same size as the original array.
     * 4. Iterate through the original array again and for each element, look up its rank in the HashMap
     *    and place it in the corresponding position in the result array.
     *
     * Time Complexity:
     * O(N log N) due to sorting the array. The subsequent iterations through the arrays and HashMap lookups
     * take O(N) time.
     *
     * Space Complexity:
     * O(N) for storing the sorted copy of the array, the HashMap, and the result array.
     */
    public int[] arrayRankTransform(int[] arr) {
        // Handle the edge case of an empty array.
        if (arr == null || arr.length == 0) {
            return new int[0];
        }

        // Create a copy of the original array to sort it without modifying the original.
        int[] sortedArr = Arrays.copyOf(arr, arr.length);
        // Sort the copied array. This helps in determining the relative order of elements.
        Arrays.sort(sortedArr);

        // Use a HashMap to store the rank of each unique number.
        // The key is the number, and the value is its rank.
        Map<Integer, Integer> rankMap = new HashMap<>();

        // Initialize the rank counter. Ranks start from 1.
        int rank = 1;
        // Iterate through the sorted array to assign ranks.
        for (int num : sortedArr) {
            // If the number is not already in the map, it means it's a new unique element.
            // Assign it the current rank and then increment the rank for the next unique element.
            // If the number is already in the map, we do nothing, effectively giving duplicates the same rank.
            if (!rankMap.containsKey(num)) {
                rankMap.put(num, rank);
                rank++;
            }
        }

        // Create the result array to store the transformed ranks.
        int[] result = new int[arr.length];
        // Iterate through the original array.
        for (int i = 0; i < arr.length; i++) {
            // For each element in the original array, look up its rank in the HashMap.
            // Place the corresponding rank into the result array at the same index.
            result[i] = rankMap.get(arr[i]);
        }

        // Return the array with ranks transformed.
        return result;
    }
}
```