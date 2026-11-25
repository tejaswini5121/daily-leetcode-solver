```python
# Summary: Find the minimum length of a subarray that appears only once in the given array.
# Link: https://leetcode.com/problems/smallest-unique-subarray/
#
# Approach:
# The problem asks for the minimum length of a subarray that is unique.
# We can use binary search on the possible lengths of the subarray.
# For a given length `k`, we need to efficiently check if there exists at least one subarray of length `k` that is unique.
# To check for uniqueness of subarrays of length `k`, we can use rolling hash.
# A rolling hash allows us to compute the hash of a subarray in O(1) time after an initial O(k) computation for the first subarray.
#
# For a fixed length `k`:
# 1. Initialize a hash map `seen_hashes` to store hashes of subarrays encountered so far and their counts.
# 2. Compute the hash of the first subarray `nums[0:k]`.
# 3. Store this hash in `seen_hashes` with a count of 1.
# 4. Iterate through the rest of the array, calculating the rolling hash for each subarray of length `k`.
# 5. For each new hash, update its count in `seen_hashes`. If a hash already exists, increment its count.
# 6. After iterating through all subarrays of length `k`, iterate through `seen_hashes`. If any hash has a count of 1, it means a unique subarray of length `k` exists.
#
# The binary search will work as follows:
# - `low = 1` (minimum possible subarray length)
# - `high = n` (maximum possible subarray length)
# - `ans = n` (initialize with the largest possible answer)
# - While `low <= high`:
#   - `mid = (low + high) // 2`
#   - If `check(mid)` returns True (meaning a unique subarray of length `mid` exists):
#     - This `mid` is a potential answer. Try for smaller lengths: `ans = mid`, `high = mid - 1`.
#   - Else (`check(mid)` returns False):
#     - `mid` is too small. Need to try larger lengths: `low = mid + 1`.
#
# The `check(k)` function will use rolling hash.
#
# Rolling Hash Implementation Details:
# - We need a base `p` (a prime number, e.g., 31 or 37) and a modulus `m` (a large prime number, e.g., 10^9 + 7).
# - The hash of a subarray `[a, b, c]` can be calculated as `(a * p^2 + b * p^1 + c * p^0) % m`.
# - To roll the hash from `[a, b, c]` to `[b, c, d]`:
#   - Subtract the contribution of the first element: `(current_hash - a * p^(k-1)) % m`.
#   - Multiply by the base: `(hash_without_a * p) % m`.
#   - Add the contribution of the new element: `(shifted_hash + d) % m`.
#   - Ensure the result is positive by adding `m` if it becomes negative after subtraction: `(val + m) % m`.
# - Pre-computing powers of `p` will be useful.
#
# Time Complexity:
# - Binary search: log(n) iterations.
# - `check(k)` function:
#   - Initial hash computation: O(k).
#   - Rolling hash updates: O(n) for n-k+1 subarrays.
#   - Hash map operations (insert/lookup): On average O(1).
#   - In the worst case, hash collisions can degrade performance, but with good hash functions and a large modulus, it's usually close to O(1).
#   - Total for `check(k)`: O(n).
# - Overall Time Complexity: O(n * log n).
#
# Space Complexity:
# - Hash map `seen_hashes`: Stores up to O(n) hashes. Each entry is (hash, count).
# - Pre-computed powers of `p`: O(n).
# - Overall Space Complexity: O(n).

class Solution:
    def smallestUniqueSubarray(self, nums: list[int]) -> int:
        n = len(nums)

        # Base for rolling hash
        p = 31
        # Modulus for rolling hash (a large prime number)
        m = 10**9 + 7

        # Pre-compute powers of p modulo m
        # powers[i] will store p^i % m
        powers = [1] * (n + 1)
        for i in range(1, n + 1):
            powers[i] = (powers[i - 1] * p) % m

        # Helper function to check if there's a unique subarray of length k
        def check(k: int) -> bool:
            if k == 0: # A subarray of length 0 is not possible, but handle defensively
                return False
            if k > n:
                return False

            # Use a dictionary to store hashes of subarrays and their counts
            # Key: hash_value, Value: count
            seen_hashes = {}

            # Calculate the hash of the first subarray nums[0:k]
            current_hash = 0
            for i in range(k):
                # The value of nums[i] can be up to 10^5, so we add 1 to ensure positive values
                # and avoid issues with 0.
                current_hash = (current_hash * p + (nums[i] + 1)) % m

            # Store the hash of the first subarray
            seen_hashes[current_hash] = seen_hashes.get(current_hash, 0) + 1

            # Iterate through the rest of the array to compute rolling hashes
            # For subarrays starting from index 1 to n-k
            for i in range(1, n - k + 1):
                # Calculate the rolling hash for the subarray nums[i:i+k]

                # 1. Remove the contribution of the first element of the previous subarray (nums[i-1])
                # The term to subtract is (nums[i-1] + 1) * p^(k-1)
                hash_to_remove = ((nums[i - 1] + 1) * powers[k - 1]) % m
                current_hash = (current_hash - hash_to_remove + m) % m # Add m to handle negative results

                # 2. Shift the remaining hash by multiplying by p
                current_hash = (current_hash * p) % m

                # 3. Add the contribution of the new element (nums[i+k-1])
                current_hash = (current_hash + (nums[i + k - 1] + 1)) % m

                # Store the new hash
                seen_hashes[current_hash] = seen_hashes.get(current_hash, 0) + 1

            # Check if any hash has a count of 1
            for count in seen_hashes.values():
                if count == 1:
                    return True # Found at least one unique subarray of length k

            return False # No unique subarray of length k found

        # Binary search for the minimum length
        low = 1
        high = n
        ans = n # Initialize answer to the maximum possible length

        while low <= high:
            mid = (low + high) // 2
            if check(mid):
                # If a unique subarray of length `mid` exists,
                # `mid` is a possible answer. Try smaller lengths.
                ans = mid
                high = mid - 1
            else:
                # If no unique subarray of length `mid` exists,
                # we need to try larger lengths.
                low = mid + 1

        return ans

```