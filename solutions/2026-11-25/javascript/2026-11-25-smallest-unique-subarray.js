/**
 * @brief Finds the minimum length of a subarray that is not identical to any other subarray in nums.
 *
 * Problem: https://leetcode.com/problems/smallest-unique-subarray/
 *
 * Approach:
 * The problem asks for the smallest subarray length that guarantees uniqueness. This suggests a binary search approach on the possible lengths of subarrays. For a given length `k`, we need to efficiently check if there exists at least one subarray of length `k` that appears only once.
 *
 * To efficiently check for subarray occurrences of a fixed length `k`, we can use a rolling hash. A rolling hash allows us to compute the hash of a subarray of length `k` in O(1) time after an initial O(k) computation for the first subarray.
 *
 * The binary search will work as follows:
 * - Initialize `low = 1` and `high = nums.length`.
 * - In each iteration, calculate `mid = floor((low + high) / 2)`.
 * - Define a helper function `hasUniqueSubarray(length)` that uses rolling hash to check if there's any unique subarray of the given `length`.
 *   - Inside `hasUniqueSubarray(length)`:
 *     - Initialize a hash map `seenHashes` to store the count of each hash encountered.
 *     - Choose a prime base `P` and a large prime modulus `MOD` for the rolling hash.
 *     - Calculate the hash of the first subarray of length `length`.
 *     - For subsequent subarrays, use the rolling hash formula to update the hash in O(1).
 *     - For each hash, update its count in `seenHashes`.
 *     - After processing all subarrays of length `length`, iterate through `seenHashes`. If any hash has a count of 1, it means we found a unique subarray, and `hasUniqueSubarray` returns `true`. Otherwise, it returns `false`.
 * - If `hasUniqueSubarray(mid)` is true, it means a unique subarray of length `mid` exists, so we might be able to find an even smaller unique subarray. We set `ans = mid` and `high = mid - 1`.
 * - If `hasUniqueSubarray(mid)` is false, it means all subarrays of length `mid` are duplicates, so we need a larger length. We set `low = mid + 1`.
 * - The binary search continues until `low > high`. The final `ans` will hold the minimum length.
 *
 * To handle potential hash collisions, we can use two different rolling hashes with different bases and moduli, or use a more robust hashing mechanism like polynomial hashing with a large prime modulus. For this problem, a single rolling hash with appropriate `P` and `MOD` should suffice given the constraints.
 *
 * The calculation of powers of `P` can be precomputed to speed up the rolling hash update. `P_pow[i]` will store `P^i % MOD`.
 *
 * Time Complexity:
 * - Binary search performs O(log N) iterations, where N is the length of `nums`.
 * - Inside the binary search, the `hasUniqueSubarray` function takes O(N) time to iterate through all possible subarrays of a given length and compute/update their rolling hashes.
 * - Therefore, the overall time complexity is O(N log N).
 *
 * Space Complexity:
 * - The `seenHashes` map can store up to O(N) distinct hashes in the worst case.
 * - The precomputed powers of `P` take O(N) space.
 * - Thus, the overall space complexity is O(N).
 */

function smallestUniqueSubarray(nums) {
    const n = nums.length;
    // Maximum possible value of nums[i] is 10^5. We can use this as a basis for mapping or use a large prime.
    // Let's use a large prime base and modulus for rolling hash to minimize collisions.
    const P = 31; // A prime base. Could also use a prime larger than max(nums[i]) + 1
    const MOD = 1e9 + 7; // A large prime modulus

    // Precompute powers of P modulo MOD
    const P_pow = new Array(n + 1);
    P_pow[0] = 1;
    for (let i = 1; i <= n; i++) {
        P_pow[i] = (P_pow[i - 1] * P) % MOD;
    }

    /**
     * @brief Checks if there exists at least one unique subarray of the given length.
     * @param {number} length The length of the subarray to check.
     * @returns {boolean} True if a unique subarray of the given length exists, false otherwise.
     */
    const hasUniqueSubarray = (length) => {
        if (length === 0) return false; // A subarray of length 0 is not meaningful.
        if (length > n) return false; // Cannot have a subarray longer than the array itself.

        // Map to store the count of each hash encountered.
        // Key: hash value, Value: count.
        const seenHashes = new Map();

        // Current hash of the window.
        let currentHash = 0;

        // Calculate the hash for the first subarray of length `length`.
        for (let i = 0; i < length; i++) {
            // Hash = (hash * P + nums[i]) % MOD
            // To avoid issues with negative numbers from modulo, ensure values are positive.
            // nums[i] are positive here, but good practice for general rolling hash.
            currentHash = (currentHash * P + nums[i]) % MOD;
        }
        seenHashes.set(currentHash, 1);

        // Roll the hash for subsequent subarrays.
        for (let i = length; i < n; i++) {
            // Remove the contribution of the element leaving the window (nums[i - length]).
            // The term to subtract is (nums[i - length] * P^(length-1)) % MOD.
            // Be careful with negative results from subtraction.
            const outgoingElementContribution = (nums[i - length] * P_pow[length - 1]) % MOD;
            currentHash = (currentHash - outgoingElementContribution + MOD) % MOD; // Add MOD to ensure positive result

            // Add the contribution of the new element entering the window (nums[i]).
            currentHash = (currentHash * P + nums[i]) % MOD;

            // Update the count of this hash in the map.
            seenHashes.set(currentHash, (seenHashes.get(currentHash) || 0) + 1);
        }

        // Check if any hash has a count of 1, indicating a unique subarray.
        for (const count of seenHashes.values()) {
            if (count === 1) {
                return true; // Found at least one unique subarray of this length.
            }
        }

        return false; // No unique subarray of this length was found.
    };

    // Binary search for the smallest length.
    let low = 1;
    let high = n;
    let ans = n; // Initialize ans to the maximum possible length.

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (hasUniqueSubarray(mid)) {
            // If a unique subarray of length `mid` exists,
            // it means `mid` is a possible answer.
            // We try to find an even smaller length by searching in the left half.
            ans = mid;
            high = mid - 1;
        } else {
            // If no unique subarray of length `mid` exists,
            // it means we need a larger length.
            // We search in the right half.
            low = mid + 1;
        }
    }

    return ans;
}
```