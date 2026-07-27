```java
// Problem: Maximum Product of Two Elements in an Array
// Link: https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/
//
// Approach:
// The problem asks us to find the maximum product of (nums[i]-1) * (nums[j]-1) where i and j are
// different indices. To maximize this product, we need to choose the two largest numbers from the
// array. Subtracting 1 from each of these largest numbers and then multiplying them will give us
// the maximum possible value.
//
// We can find the two largest numbers efficiently. One way is to sort the array and pick the last
// two elements. Another efficient way, especially for large arrays where we only need the top K
// elements, is to use a min-heap (priority queue in Java, by default acts as a min-heap). We can
// iterate through the array and maintain a min-heap of size 2. If the heap size is less than 2,
// we add the current element. If the heap size is 2, we compare the current element with the
// smallest element in the heap (the root). If the current element is larger, we remove the smallest
// element and add the current element. After iterating through the entire array, the heap will
// contain the two largest elements.
//
// Given the constraint nums.length <= 500, sorting the array is also a very efficient and simple
// approach.
//
// Time Complexity:
// Sorting approach: O(N log N) due to sorting the array, where N is the length of the array.
// Heap approach: O(N log K) where K is the size of the heap (K=2 in this case). So, it's O(N log 2) which simplifies to O(N).
// Since N is small (<= 500), both approaches are acceptable. We will use the sorting approach for simplicity.
//
// Space Complexity:
// Sorting approach: O(log N) or O(N) depending on the sorting algorithm used by the Java library (typically Timsort, which can be O(N) in worst case for space). If we consider in-place sorting, it could be O(log N) for recursion stack.
// Heap approach: O(K) where K is the size of the heap (K=2). So, O(1) auxiliary space.
//
// For this implementation, we will use the sorting approach.
class Solution {
    /**
     * Finds the maximum product of (nums[i]-1)*(nums[j]-1) for two different indices i and j.
     *
     * @param nums The input array of integers.
     * @return The maximum product.
     */
    public int maxProduct(int[] nums) {
        // Sort the array in ascending order.
        // This will place the largest elements at the end of the array.
        java.util.Arrays.sort(nums);

        // Get the length of the array.
        int n = nums.length;

        // The two largest elements will be at indices n-1 and n-2 after sorting.
        // Calculate the product of (largest_element - 1) * (second_largest_element - 1).
        int maxProductValue = (nums[n - 1] - 1) * (nums[n - 2] - 1);

        // Return the calculated maximum product.
        return maxProductValue;
    }
}
```