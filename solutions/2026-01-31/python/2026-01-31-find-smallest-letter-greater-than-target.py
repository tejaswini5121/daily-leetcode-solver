```python
# Problem: Find Smallest Letter Greater Than Target
# Link: https://leetcode.com/problems/find-smallest-letter-greater-than-target/
# Approach:
# The problem asks for the smallest character in a sorted array 'letters' that is lexicographically greater than a given 'target'.
# Since the array is sorted, we can use binary search to efficiently find the position of the smallest character greater than the target.
# The binary search will aim to find the first element that is greater than 'target'.
# If the binary search completes without finding an element greater than 'target' (meaning all elements are less than or equal to 'target'),
# it implies that the 'target' is greater than or equal to the largest element in 'letters'.
# In this case, according to the problem statement, we should wrap around and return the first character of 'letters'.
# The binary search maintains a 'low' and 'high' pointer.
# In each iteration, it calculates the 'mid' index.
# If letters[mid] is greater than target, it means this character *could* be our answer, so we store it as a potential result and try to find an even smaller character by searching in the left half (high = mid - 1).
# If letters[mid] is less than or equal to target, we need to look for a larger character, so we search in the right half (low = mid + 1).
# After the loop, if we found a potential result, we return it. Otherwise, we return letters[0].
# Time Complexity: O(log n), where n is the length of the 'letters' array, due to the binary search.
# Space Complexity: O(1), as we only use a few variables for pointers and the result.

def nextGreatestLetter(letters, target):
    """
    Finds the smallest character in a sorted array 'letters' that is lexicographically greater than 'target'.
    If no such character exists, it returns the first character of 'letters'.

    Args:
        letters: A list of characters sorted in non-decreasing order.
        target: A character.

    Returns:
        The smallest character in 'letters' greater than 'target', or letters[0] if none exists.
    """
    n = len(letters)
    low = 0
    high = n - 1
    result = letters[0]  # Default to the first element in case no greater element is found.

    while low <= high:
        mid = (low + high) // 2

        # If the middle character is greater than the target,
        # it's a potential candidate. We store it and try to find an even smaller one in the left half.
        if letters[mid] > target:
            result = letters[mid]
            high = mid - 1
        # If the middle character is less than or equal to the target,
        # we need to look in the right half for a larger character.
        else:
            low = mid + 1

    # If the loop finishes and 'result' is still the first character (meaning no character greater than target was found),
    # then according to the problem, we should return the first character of 'letters'.
    # Our initialization of 'result = letters[0]' handles this correctly.
    # If a character greater than target was found, 'result' would have been updated.
    return result

# Example Usage:
# print(nextGreatestLetter(["c","f","j"], "a"))  # Output: "c"
# print(nextGreatestLetter(["c","f","j"], "c"))  # Output: "f"
# print(nextGreatestLetter(["x","x","y","y"], "z")) # Output: "x"
# print(nextGreatestLetter(["e","e","e","e","e","e","n","n","n","n"], "e")) # Output: "n"
```