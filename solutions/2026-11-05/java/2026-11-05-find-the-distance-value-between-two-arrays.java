```java
// Find the Distance Value Between Two Arrays
// Link: https://leetcode.com/problems/find-the-distance-value-between-two-arrays/
//
// Problem Summary:
// Count elements in arr1 that are "distant" from all elements in arr2.
// An element arr1[i] is distant if for all arr2[j], the absolute difference
// |arr1[i] - arr2[j]| is greater than d.
//
// Approach Explanation:
// For each element in arr1, we check if it satisfies the distance condition.
// To efficiently check this condition, we can sort arr2. Once arr2 is sorted,
// for a given element arr1[i], we only need to check elements in arr2 that are
// "close" to arr1[i]. Specifically, we can use binary search (or two pointers)
// to find if there's any element in arr2 within the range [arr1[i] - d, arr1[i] + d].
// If no such element is found in arr2 for arr1[i], we increment our distance count.
// Sorting arr2 first optimizes the search for each element in arr1.
//
// Time Complexity Analysis:
// Let n be the length of arr1 and m be the length of arr2.
// Sorting arr2 takes O(m log m) time.
// For each of the n elements in arr1, we perform a binary search on arr2, which
// takes O(log m) time.
// Therefore, the total time complexity is O(m log m + n log m).
//
// Space Complexity Analysis:
// If we sort arr2 in-place, the space complexity is O(1) (excluding the input arrays).
// If a new array is created for sorting or if the sorting algorithm used requires
// auxiliary space, it could be O(m) in the worst case for some sort implementations.
// For Java's Arrays.sort(), it's typically O(log m) for primitive types due to quicksort.
class Solution {
    public int findTheDistanceValue(int[] arr1, int[] arr2, int d) {
        // Sort arr2 to enable efficient searching using binary search or two pointers.
        java.util.Arrays.sort(arr2);

        int distanceValue = 0; // Initialize the count of elements in arr1 that satisfy the condition.

        // Iterate through each element in arr1.
        for (int num1 : arr1) {
            // For each element in arr1, check if there exists any element in arr2
            // such that the absolute difference is less than or equal to d.
            // We assume that the current element num1 is "distant" until proven otherwise.
            boolean isDistant = true;

            // Use binary search to find if there's any element in arr2 within the range [num1 - d, num1 + d].

            // Find the index of the first element in arr2 that is greater than or equal to num1 - d.
            // This is equivalent to finding the lower bound of (num1 - d) in arr2.
            int searchResultIndex = binarySearchLowerBound(arr2, num1 - d);

            // Check if the element found by binary search is within the allowed range.
            // If searchResultIndex is within bounds of arr2 AND the element at this index
            // is less than or equal to num1 + d, it means we found an element in arr2
            // that is too close to num1.
            if (searchResultIndex < arr2.length && arr2[searchResultIndex] <= num1 + d) {
                isDistant = false; // The current num1 is not distant.
            }

            // If after checking, num1 is still considered distant, increment the count.
            if (isDistant) {
                distanceValue++;
            }
        }

        // Return the total count of elements in arr1 that are distant from all elements in arr2.
        return distanceValue;
    }

    // Helper function to perform binary search and find the index of the first element
    // that is greater than or equal to the target value. This is similar to `lower_bound` in C++.
    private int binarySearchLowerBound(int[] arr, int target) {
        int low = 0;
        int high = arr.length; // 'high' is exclusive, representing one past the last element.

        // Standard binary search loop.
        while (low < high) {
            int mid = low + (high - low) / 2; // Calculate midpoint to avoid potential overflow.

            // If the middle element is less than the target, we need to search in the right half.
            if (arr[mid] < target) {
                low = mid + 1; // Move the lower bound to mid + 1.
            }
            // If the middle element is greater than or equal to the target,
            // it could be our answer, or an element to its left could be.
            // So, we include mid in the potential search space by setting high = mid.
            else {
                high = mid; // Move the upper bound to mid.
            }
        }
        // When the loop terminates, 'low' (which is also 'high') will be the index
        // of the first element >= target, or arr.length if no such element exists.
        return low;
    }
}
```