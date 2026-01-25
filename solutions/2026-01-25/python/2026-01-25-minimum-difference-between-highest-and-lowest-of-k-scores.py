```python
# Find the minimum difference between the highest and lowest of k scores.
# LeetCode Problem: Minimum Difference Between Highest and Lowest of K Scores
# Link: https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/
#
# Approach:
# The problem asks us to find a subset of k scores from the given array `nums`
# such that the difference between the maximum and minimum score in that subset
# is minimized.
#
# If we sort the array `nums` first, then any contiguous subarray of length k
# will represent a potential subset of k scores. This is because if we pick k
# scores, to minimize the difference between the highest and lowest, these k
# scores should ideally be close to each other in value. Sorting ensures that
# when we consider a window of size k, the elements within that window are
# already ordered. The minimum difference for a window of size k will always
# be between the first and last element of that window after sorting.
#
# Therefore, the strategy is:
# 1. Sort the input array `nums`.
# 2. Iterate through the sorted array using a sliding window of size k.
# 3. For each window, calculate the difference between the last element (highest in the window)
#    and the first element (lowest in the window).
# 4. Keep track of the minimum difference found so far.
#
# Time Complexity:
# - Sorting the array takes O(N log N) time, where N is the length of `nums`.
# - The sliding window iteration takes O(N - k + 1) which is O(N) time.
# - The dominant factor is sorting, so the overall time complexity is O(N log N).
#
# Space Complexity:
# - If sorting is done in-place, the space complexity is O(1) (or O(log N) if recursion stack is considered for some sort implementations).
# - If a new array is created for sorting, it would be O(N). Python's `sort()` is typically Timsort which uses O(N) auxiliary space in the worst case.
#   However, for competitive programming, it's often considered O(log N) or O(1) depending on the interpretation.
#   For this problem, we will use Python's built-in sort.
#
class Solution:
    def minimumDifference(self, nums: list[int], k: int) -> int:
        # If k is 1, the difference between the highest and lowest is always 0.
        if k == 1:
            return 0

        # Sort the array `nums` in ascending order.
        # This is crucial because we want to find k elements that are as close
        # in value as possible. After sorting, consecutive elements are candidates
        # for forming the minimum difference window.
        nums.sort()

        # Initialize the minimum difference to a very large value.
        # We use float('inf') to ensure that the first calculated difference
        # will be smaller and update this variable.
        min_diff = float('inf')

        # Iterate through the sorted array using a sliding window of size k.
        # The loop runs from index 0 up to `len(nums) - k`.
        # For each `i`, the window will be `nums[i:i+k]`.
        # The first element of the window is `nums[i]`, and the last is `nums[i+k-1]`.
        for i in range(len(nums) - k + 1):
            # Calculate the difference between the highest and lowest score in the current window.
            # In the sorted window `nums[i:i+k]`, `nums[i+k-1]` is the highest score
            # and `nums[i]` is the lowest score.
            current_diff = nums[i + k - 1] - nums[i]

            # Update `min_diff` if the `current_diff` is smaller.
            min_diff = min(min_diff, current_diff)

        # Return the minimum difference found across all possible windows of size k.
        return min_diff

```