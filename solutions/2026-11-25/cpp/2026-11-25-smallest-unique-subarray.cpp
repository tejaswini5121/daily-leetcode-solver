```cpp
// Find the minimum length of a subarray that is not identical to any other subarray.
// Problem Link: https://leetcode.com/problems/smallest-unique-subarray/
// Approach:
// We can use binary search on the possible lengths of the subarray. For a given length `L`,
// we need to check if there exists a unique subarray of length `L`.
// To efficiently check for uniqueness, we can use rolling hashes. A rolling hash allows
// us to compute the hash of a subarray of length `L` in O(1) time after an initial O(L) setup.
// We can store the hashes of all subarrays of length `L` in a hash map and count their frequencies.
// If any hash has a frequency of 1, then a unique subarray of length `L` exists.
//
// The binary search will work as follows:
// Low = 1 (minimum possible subarray length)
// High = nums.length (maximum possible subarray length)
// While low <= high:
//   mid = low + (high - low) / 2
//   If check(mid) is true (a unique subarray of length `mid` exists):
//     ans = mid
//     high = mid - 1 (try for a smaller length)
//   Else:
//     low = mid + 1 (need a larger length)
//
// The `check(L)` function:
// 1. Precompute powers of a prime base and inverse powers for efficient rolling hash updates.
// 2. Calculate the hash of the first subarray of length `L`.
// 3. Store this hash and its starting index in a map (e.g., `std::unordered_map<long long, std::vector<int>>`).
// 4. Iterate through the rest of the array, updating the hash for each subsequent subarray of length `L` using the rolling hash property.
// 5. For each computed hash, check its frequency in the map. If a hash appears only once, a unique subarray of length `L` exists. Return true.
// 6. If after checking all subarrays of length `L`, no unique hash is found, return false.
//
// To handle hash collisions, we can use a pair of hashes with different bases and moduli, or extend the map to store actual subarrays if a hash collision is detected. However, for LeetCode constraints and typical hash functions, a single good hash function is often sufficient. If it fails, one can consider double hashing or other collision resolution strategies.
//
// A robust rolling hash implementation:
// Hash = (h[i+L] - h[i] * P^L) * P_inv^L mod M
// where P is a prime base and M is a large prime modulus.
// h[i] is the prefix hash up to index i.
// We need to precompute powers of P and modular inverses of P.
//
// For this problem, the values in nums can be up to 10^5, so we might need to map them to smaller integers if the hash function is sensitive to large inputs, or use a hash function that handles large numbers. A common approach is to use a prime base larger than any possible element value.
//
// Time Complexity:
// Binary search performs O(log N) iterations, where N is nums.length.
// Inside each iteration, the `check(L)` function takes O(N) time to compute and store/check rolling hashes.
// Therefore, the overall time complexity is O(N log N).
//
// Space Complexity:
// The `check(L)` function uses a hash map to store hashes and their indices. In the worst case, it can store O(N) entries.
// Precomputing powers of the base and its inverse takes O(N) space.
// Therefore, the overall space complexity is O(N).

#include <vector>
#include <iostream>
#include <unordered_map>
#include <algorithm>

// Using unsigned long long for hash values to avoid overflow issues and rely on natural wrap-around.
// Alternatively, a pair of (hash1, hash2) with different bases/moduli can be used for better collision avoidance.
using ull = unsigned long long;

// Rolling Hash parameters
const ull BASE = 31; // A common prime base. Can be tuned.
const ull MOD = 1e9 + 7; // A large prime modulus.

class Solution {
public:
    int minLength;
    std::vector<int> nums_vec;
    int n;
    std::vector<ull> p_pow; // Stores powers of BASE modulo MOD
    std::vector<ull> p_inv_pow; // Stores modular inverse powers of BASE modulo MOD

    // Function to compute modular exponentiation (base^exp % mod)
    ull power(ull base, ull exp) {
        ull res = 1;
        base %= MOD;
        while (exp > 0) {
            if (exp % 2 == 1) res = (res * base) % MOD;
            base = (base * base) % MOD;
            exp /= 2;
        }
        return res;
    }

    // Function to compute modular inverse using Fermat's Little Theorem (a^(MOD-2) % MOD)
    ull modInverse(ull n) {
        return power(n, MOD - 2);
    }

    // Precompute powers of BASE and their modular inverses
    void precompute_powers(int max_len) {
        p_pow.resize(max_len + 1);
        p_inv_pow.resize(max_len + 1);
        p_pow[0] = 1;
        p_inv_pow[0] = 1; // Inverse of 1 is 1

        ull inv_base = modInverse(BASE);

        for (int i = 1; i <= max_len; ++i) {
            p_pow[i] = (p_pow[i - 1] * BASE) % MOD;
            p_inv_pow[i] = (p_inv_pow[i - 1] * inv_base) % MOD;
        }
    }

    // Computes the hash of a subarray nums_vec[start...start+len-1]
    // This is a helper for initial hash calculation.
    ull calculate_initial_hash(int start, int len) {
        ull current_hash = 0;
        for (int i = 0; i < len; ++i) {
            // We map nums[i] to a value that is at least 1. Adding 1 ensures no issues if element is 0.
            // Since constraints say nums[i] >= 1, we can just use nums_vec[start+i].
            current_hash = (current_hash + (ull)(nums_vec[start + i] - 1 + 1) * p_pow[i]) % MOD;
        }
        return current_hash;
    }

    // Checks if there exists a unique subarray of a given length `L`.
    bool check(int L) {
        if (L == 0) return false; // Length 0 subarray is not meaningful.
        if (L > n) return false; // Cannot have a subarray longer than the array.

        // Map to store hashes and the starting indices where they occur.
        // Using std::unordered_map for average O(1) operations.
        std::unordered_map<ull, std::vector<int>> hash_counts;

        // Calculate hash for the first subarray of length L.
        ull current_hash = 0;
        for (int i = 0; i < L; ++i) {
            // Ensure element values are positive and suitable for hashing.
            // Since nums[i] >= 1, (nums_vec[i] - 1 + 1) simplifies to nums_vec[i].
            current_hash = (current_hash + (ull)nums_vec[i] * p_pow[i]) % MOD;
        }
        hash_counts[current_hash].push_back(0);

        // Rolling hash for subsequent subarrays.
        // For subarray nums_vec[i...i+L-1], the hash is derived from nums_vec[i-1...i+L-2].
        // hash(i..i+L-1) = ( (hash(i-1..i+L-2) - nums_vec[i-1]) * inv_base + nums_vec[i+L-1] * P^(L-1) ) mod MOD
        // A more common and robust rolling hash formula:
        // Let h[k] be the hash of the prefix nums_vec[0...k-1].
        // Hash of nums_vec[i...j] = (h[j+1] - h[i] * P^(j-i+1)) * P_inv^(i) mod M
        // In our case, j = i + L - 1. So j-i+1 = L.
        // Hash(i...i+L-1) = (h[i+L] - h[i] * P^L) * P_inv^i mod M
        // To avoid recomputing prefix sums, we can update incrementally:
        // hash_next = ( (hash_current - val_leaving) * inv_base + val_entering * P^(L-1) ) mod MOD
        // Note: val_leaving is (nums_vec[i-1]-1+1) * P^0
        // val_entering is (nums_vec[i+L-1]-1+1) * P^(L-1)

        for (int i = 1; i <= n - L; ++i) {
            // Remove the contribution of the element leaving the window (nums_vec[i-1]).
            // Its contribution was (nums_vec[i-1] * P^0).
            // We need to subtract it from the hash.
            // The formula for rolling hash:
            // H(i, i+L-1) = ( H(i-1, i+L-2) - (val(i-1) * P^0) ) * inv(P) + (val(i+L-1) * P^(L-1)) mod M
            // Where val(k) = nums_vec[k]
            //
            // Let's refine the hash calculation to use powers of P correctly for index i.
            // Hash of subarray nums_vec[i ... i+L-1] with polynomial rolling hash:
            // H = sum_{k=0}^{L-1} nums_vec[i+k] * P^k mod M
            //
            // To update from H(i-1, i+L-2) to H(i, i+L-1):
            // H(i-1, i+L-2) = nums_vec[i-1]*P^0 + nums_vec[i]*P^1 + ... + nums_vec[i+L-2]*P^(L-2)
            // H(i, i+L-1)   = nums_vec[i]*P^0   + nums_vec[i+1]*P^1 + ... + nums_vec[i+L-1]*P^(L-1)
            //
            // From H(i-1, i+L-2), to get to H(i, i+L-1):
            // 1. Subtract the first term: nums_vec[i-1] * P^0
            // 2. Divide by P (multiply by modular inverse of P):
            //    (H(i-1, i+L-2) - nums_vec[i-1]) * inv_base
            //    This shifts all powers down by 1: nums_vec[i]*P^-1 + ... + nums_vec[i+L-2]*P^(L-3) -- This is not what we want.
            //
            // A better way to think about it:
            // H(i-1, i+L-2) = sum_{k=0}^{L-1} nums_vec[i-1+k] * P^k
            // H(i, i+L-1)   = sum_{k=0}^{L-1} nums_vec[i+k] * P^k
            //
            // Let H_prev = H(i-1, i+L-2).
            // H_prev = nums_vec[i-1]*P^0 + nums_vec[i]*P^1 + ... + nums_vec[i+L-2]*P^(L-2)
            //
            // To get H_current = H(i, i+L-1):
            // 1. Remove nums_vec[i-1]*P^0.
            //    temp = H_prev - nums_vec[i-1]
            // 2. Divide by P (multiply by inv_base). This aligns the powers:
            //    temp = (temp * inv_base) % MOD
            //    Now, temp represents: nums_vec[i]*P^0 + nums_vec[i+1]*P^1 + ... + nums_vec[i+L-2]*P^(L-3)
            // 3. Add the new element's contribution at the highest power: nums_vec[i+L-1]*P^(L-1).
            //    H_current = (temp + (ull)nums_vec[i+L-1] * p_pow[L-1]) % MOD

            // Ensure element values are positive and suitable for hashing.
            ull val_leaving = (ull)nums_vec[i - 1];
            ull val_entering = (ull)nums_vec[i + L - 1];

            // Subtract contribution of the leaving element (at P^0)
            current_hash = (current_hash - val_leaving + MOD) % MOD; // Add MOD to handle negative results of subtraction

            // Divide by BASE (multiply by modular inverse of BASE)
            current_hash = (current_hash * modInverse(BASE)) % MOD;

            // Add contribution of the entering element (at P^(L-1))
            current_hash = (current_hash + val_entering * p_pow[L - 1]) % MOD;
            
            hash_counts[current_hash].push_back(i);
        }

        // Check if any hash has a count of 1.
        for (auto const& [hash_val, indices] : hash_counts) {
            if (indices.size() == 1) {
                return true; // Found a unique subarray of length L.
            }
        }
        return false; // No unique subarray of length L found.
    }

    int smallestUniqueSubarray(std::vector<int>& nums) {
        nums_vec = nums;
        n = nums.size();
        minLength = n; // Initialize with the maximum possible length.

        // Precompute powers up to n, as the maximum subarray length is n.
        precompute_powers(n);

        int low = 1, high = n;
        int ans = n; // Default answer is n if no shorter unique subarray is found.

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (check(mid)) {
                // If a unique subarray of length 'mid' exists, it means we might be able to find
                // an even smaller unique subarray. So, we record 'mid' as a potential answer
                // and try searching in the left half [low, mid-1].
                ans = mid;
                high = mid - 1;
            } else {
                // If no unique subarray of length 'mid' exists, we need to consider longer subarrays.
                // So, we search in the right half [mid+1, high].
                low = mid + 1;
            }
        }
        return ans;
    }
};
```