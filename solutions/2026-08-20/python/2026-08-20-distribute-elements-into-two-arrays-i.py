```python
# Distribute Elements Into Two Arrays I
# LeetCode Link: https://leetcode.com/problems/distribute-elements-into-two-arrays-i/
#
# Problem Summary:
# Distribute elements of a given array into two new arrays based on a rule:
# the first two elements go to arr1 and arr2 respectively, and subsequent
# elements are added to the array whose last element is smaller.
#
# Approach:
# We will simulate the distribution process directly.
# Initialize two empty arrays, arr1 and arr2.
# Handle the first two operations separately as specified:
#   - The first element of nums goes to arr1.
#   - The second element of nums goes to arr2.
# Then, iterate through the remaining elements of nums starting from the third element.
# For each element, compare the last element of arr1 with the last element of arr2.
# Append the current element from nums to arr1 if its last element is greater.
# Otherwise, append it to arr2.
# Finally, concatenate arr1 and arr2 to form the result array.
#
# Time Complexity: O(n)
# We iterate through the input array `nums` once. Array appends take amortized O(1) time.
# Concatenating the two arrays also takes O(n) time.
#
# Space Complexity: O(n)
# We create two new arrays, arr1 and arr2, which in total will store all n elements
# from the input array `nums`. The final result array also stores n elements.

class Solution:
    def distributeElements(self, nums: list[int]) -> list[int]:
        # Initialize the two arrays that will store the distributed elements.
        arr1 = []
        arr2 = []

        # Handle the first two operations as per the problem statement.
        # The first element of nums goes to arr1.
        if nums:
            arr1.append(nums[0])
        # The second element of nums goes to arr2.
        if len(nums) > 1:
            arr2.append(nums[1])

        # Iterate through the rest of the elements starting from the third element (index 2).
        for i in range(2, len(nums)):
            # Get the current element to be distributed.
            current_element = nums[i]

            # Check if arr1 is not empty to safely access its last element.
            # This check is technically redundant given the constraints (n >= 3),
            # but good practice for general array handling.
            if arr1:
                # Compare the current element with the last element of arr1.
                # The problem states "If the last element of arr1 is greater than the last element of arr2".
                # This comparison dictates where the *current_element* goes.
                # The logic is: if last of arr1 > last of arr2, current_element goes to arr1.
                # Otherwise, current_element goes to arr2.
                # We need to ensure arr2 also has elements for a valid comparison.
                if arr2 and arr1[-1] > arr2[-1]:
                    arr1.append(current_element)
                else:
                    # If arr2 is empty or arr1's last element is not greater than arr2's last element,
                    # append the current element to arr2.
                    arr2.append(current_element)
            else:
                # This case should not be reached given n >= 3, as arr1 will have at least one element.
                # If arr1 is unexpectedly empty, append to arr2.
                arr2.append(current_element)

        # Concatenate arr1 and arr2 to form the final result array.
        result = arr1 + arr2
        return result

```