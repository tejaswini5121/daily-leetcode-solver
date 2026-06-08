```java
/**
 * Rearranges an array such that elements less than pivot come first,
 * followed by elements equal to pivot, and then elements greater than pivot.
 * The relative order within each partition is maintained.
 *
 * Problem Link: https://leetcode.com/problems/partition-array-according-to-given-pivot/
 *
 * Approach:
 * We can solve this problem by iterating through the input array `nums`
 * and categorizing each element into one of three groups:
 * 1. Elements strictly less than `pivot`.
 * 2. Elements equal to `pivot`.
 * 3. Elements strictly greater than `pivot`.
 *
 * To maintain the relative order within each group, we can use three separate lists
 * or arrays to store the elements belonging to each category.
 *
 * After iterating through the entire `nums` array and populating these three
 * temporary storage structures, we can then reconstruct the final `nums` array
 * by concatenating the elements from the "less than pivot" group, followed by
 * the "equal to pivot" group, and finally the "greater than pivot" group.
 *
 * This approach ensures that all conditions of the problem are met:
 * - Elements less than pivot appear before elements greater than pivot.
 * - Elements equal to pivot appear in between.
 * - The relative order of elements within the "less than" and "greater than"
 *   partitions is preserved because we add them to their respective temporary
 *   structures in the order they appear in the original `nums` array.
 *
 * Time Complexity: O(N), where N is the length of the `nums` array.
 * We iterate through the `nums` array once to categorize elements and then
 * iterate through the temporary structures once to reconstruct the result.
 *
 * Space Complexity: O(N), where N is the length of the `nums` array.
 * In the worst case, all elements might belong to one of the temporary lists,
 * leading to O(N) additional space.
 */
class Solution {
    public int[] pivotArray(int[] nums, int pivot) {
        // Temporary lists to store elements less than, equal to, and greater than pivot.
        // Using ArrayLists allows dynamic resizing and preserves insertion order.
        java.util.List<Integer> lessThanPivot = new java.util.ArrayList<>();
        java.util.List<Integer> equalToPivot = new java.util.ArrayList<>();
        java.util.List<Integer> greaterThanPivot = new java.util.ArrayList<>();

        // Iterate through the input array `nums`.
        for (int num : nums) {
            // Categorize each number based on its relation to the pivot.
            if (num < pivot) {
                // If the number is less than pivot, add it to the 'lessThanPivot' list.
                lessThanPivot.add(num);
            } else if (num == pivot) {
                // If the number is equal to pivot, add it to the 'equalToPivot' list.
                equalToPivot.add(num);
            } else {
                // If the number is greater than pivot, add it to the 'greaterThanPivot' list.
                greaterThanPivot.add(num);
            }
        }

        // Reconstruct the `nums` array by combining the three lists in the required order.
        int index = 0; // Pointer for the `nums` array.

        // First, add all elements from the 'lessThanPivot' list.
        for (int num : lessThanPivot) {
            nums[index++] = num;
        }

        // Next, add all elements from the 'equalToPivot' list.
        for (int num : equalToPivot) {
            nums[index++] = num;
        }

        // Finally, add all elements from the 'greaterThanPivot' list.
        for (int num : greaterThanPivot) {
            nums[index++] = num;
        }

        // Return the modified `nums` array.
        return nums;
    }
}
```