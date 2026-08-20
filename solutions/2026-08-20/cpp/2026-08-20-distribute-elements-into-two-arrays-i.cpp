```cpp
// Distribute Elements Into Two Arrays I: Distribute elements from nums into two arrays based on a specific rule.
// Link: https://leetcode.com/problems/distribute-elements-into-two-arrays-i/
//
// Approach:
// The problem describes a simulation process to distribute elements from the input array `nums` into two new arrays, `arr1` and `arr2`.
// The distribution follows these rules:
// 1. The first element of `nums` (nums[0]) is appended to `arr1`.
// 2. The second element of `nums` (nums[1]) is appended to `arr2`.
// 3. For subsequent elements (from index 2 onwards), compare the last element of `arr1` with the last element of `arr2`.
//    - If the last element of `arr1` is greater, append the current element from `nums` to `arr1`.
//    - Otherwise, append the current element from `nums` to `arr2`.
// Finally, concatenate `arr1` and `arr2` to form the result array.
//
// Time Complexity: O(n), where n is the number of elements in `nums`. We iterate through `nums` once to distribute the elements. Appending to vectors and accessing the last element are O(1) operations on average. Concatenating the two arrays also takes O(n) time.
// Space Complexity: O(n), where n is the number of elements in `nums`. We create two new arrays, `arr1` and `arr2`, which will store all n elements in total. The result array also stores n elements.

#include <vector>
#include <iostream>

class Solution {
public:
    std::vector<int> distributeElements(std::vector<int>& nums) {
        // Initialize arr1 and arr2.
        std::vector<int> arr1;
        std::vector<int> arr2;

        // Perform the first two operations as per the problem statement.
        // The problem statement uses 1-based indexing for operations but `nums` is 0-indexed in C++.
        // So, nums[0] is the first element, nums[1] is the second.
        if (!nums.empty()) {
            arr1.push_back(nums[0]); // First element goes to arr1.
        }
        if (nums.size() > 1) {
            arr2.push_back(nums[1]); // Second element goes to arr2.
        }

        // Iterate through the remaining elements of nums starting from the third element (index 2).
        for (size_t i = 2; i < nums.size(); ++i) {
            // Get the last elements of arr1 and arr2.
            // We are guaranteed to have at least one element in each array at this point due to the initial conditions and constraints.
            int last_arr1 = arr1.back();
            int last_arr2 = arr2.back();

            // Compare the last elements and append nums[i] to the appropriate array.
            if (last_arr1 > last_arr2) {
                arr1.push_back(nums[i]); // If last_arr1 is greater, append to arr1.
            } else {
                arr2.push_back(nums[i]); // Otherwise, append to arr2.
            }
        }

        // Concatenate arr1 and arr2 to form the result array.
        std::vector<int> result;
        result.reserve(arr1.size() + arr2.size()); // Reserve space for efficiency.
        result.insert(result.end(), arr1.begin(), arr1.end()); // Append elements of arr1.
        result.insert(result.end(), arr2.begin(), arr2.end()); // Append elements of arr2.

        // Return the concatenated result array.
        return result;
    }
};

/*
// Example Usage (for local testing, not part of LeetCode submission)
int main() {
    Solution sol;

    // Example 1
    std::vector<int> nums1 = {2, 1, 3};
    std::vector<int> result1 = sol.distributeElements(nums1);
    std::cout << "Input: [2, 1, 3]" << std::endl;
    std::cout << "Output: [";
    for (size_t i = 0; i < result1.size(); ++i) {
        std::cout << result1[i] << (i == result1.size() - 1 ? "" : ",");
    }
    std::cout << "]" << std::endl; // Expected: [2,3,1]

    // Example 2
    std::vector<int> nums2 = {5, 4, 3, 8};
    std::vector<int> result2 = sol.distributeElements(nums2);
    std::cout << "Input: [5, 4, 3, 8]" << std::endl;
    std::cout << "Output: [";
    for (size_t i = 0; i < result2.size(); ++i) {
        std::cout << result2[i] << (i == result2.size() - 1 ? "" : ",");
    }
    std::cout << "]" << std::endl; // Expected: [5,3,4,8]

    return 0;
}
*/
```