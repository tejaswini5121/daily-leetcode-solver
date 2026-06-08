```cpp
// Problem: Partition Array According to Given Pivot
// LeetCode Link: https://leetcode.com/problems/partition-array-according-to-given-pivot/
//
// Approach:
// The problem requires partitioning an array based on a pivot value while maintaining the relative order of elements within each partition (less than, equal to, and greater than pivot).
// We can achieve this by iterating through the original array three times.
// In the first pass, we collect all elements strictly less than the pivot into a temporary list.
// In the second pass, we collect all elements equal to the pivot into another temporary list.
// In the third pass, we collect all elements strictly greater than the pivot into a third temporary list.
// Finally, we concatenate these three temporary lists in order (less than, equal to, greater than) to form the rearranged array.
// This approach ensures that the relative order within each partition is preserved because we are appending elements in the order they appear in the original array.
//
// Time Complexity: O(N), where N is the number of elements in `nums`. We iterate through the array three times, and each iteration takes O(N) time. Concatenating the lists also takes O(N) time in total.
// Space Complexity: O(N), where N is the number of elements in `nums`. We use three temporary lists to store elements, which can collectively store up to N elements in the worst case.
#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<int> pivotArray(std::vector<int>& nums, int pivot) {
        // Temporary vectors to store elements less than, equal to, and greater than the pivot.
        std::vector<int> lessThanPivot;
        std::vector<int> equalToPivot;
        std::vector<int> greaterThanPivot;

        // First pass: Collect elements less than the pivot.
        // This preserves the relative order of elements smaller than the pivot.
        for (int num : nums) {
            if (num < pivot) {
                lessThanPivot.push_back(num);
            }
        }

        // Second pass: Collect elements equal to the pivot.
        // This preserves the relative order of elements equal to the pivot.
        for (int num : nums) {
            if (num == pivot) {
                equalToPivot.push_back(num);
            }
        }

        // Third pass: Collect elements greater than the pivot.
        // This preserves the relative order of elements greater than the pivot.
        for (int num : nums) {
            if (num > pivot) {
                greaterThanPivot.push_back(num);
            }
        }

        // Concatenate the three vectors in the required order:
        // 1. Elements less than pivot
        // 2. Elements equal to pivot
        // 3. Elements greater than pivot
        std::vector<int> result;
        result.reserve(nums.size()); // Optimize by reserving space

        // Append elements less than pivot
        result.insert(result.end(), lessThanPivot.begin(), lessThanPivot.end());
        // Append elements equal to pivot
        result.insert(result.end(), equalToPivot.begin(), equalToPivot.end());
        // Append elements greater than pivot
        result.insert(result.end(), greaterThanPivot.begin(), greaterThanPivot.end());

        return result; // Return the partitioned array.
    }
};
```