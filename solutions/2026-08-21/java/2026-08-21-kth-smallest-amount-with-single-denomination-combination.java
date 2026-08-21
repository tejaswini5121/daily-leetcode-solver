```java
/**
 * Problem: Kth Smallest Amount With Single Denomination Combination
 * Link: https://leetcode.com/problems/kth-smallest-amount-with-single-denomination-combination/
 *
 * Approach:
 * The problem asks for the kth smallest amount that can be formed by taking multiples of at least one coin denomination.
 * Since we can use an infinite number of coins of each denomination, the amounts we can form are multiples of the given coin values.
 * The key insight is that the set of all possible amounts is the union of the sets of multiples of each coin.
 * We are looking for the kth smallest element in this union.
 *
 * This problem can be solved efficiently using binary search on the answer. We are searching for a value `x` such that there are exactly `k` amounts less than or equal to `x` that can be formed by the coins.
 *
 * To count the number of amounts less than or equal to a given `mid` value that can be formed by the coins, we can use the Principle of Inclusion-Exclusion.
 * Let `S` be the set of coin denominations. For a given `mid`, we want to find the size of the union of sets:
 * { multiples of c1 <= mid } U { multiples of c2 <= mid } U ... U { multiples of cn <= mid }
 * where c1, c2, ..., cn are the coin denominations.
 *
 * The number of multiples of a number `d` less than or equal to `mid` is `mid / d`.
 *
 * Using Inclusion-Exclusion:
 * Sum of (mid / c_i) for all i
 * - Sum of (mid / lcm(c_i, c_j)) for all distinct pairs i, j
 * + Sum of (mid / lcm(c_i, c_j, c_k)) for all distinct triplets i, j, k
 * - ... and so on.
 *
 * The least common multiple (lcm) of a set of numbers can be calculated iteratively: lcm(a, b, c) = lcm(lcm(a, b), c).
 * We also need a way to calculate gcd (greatest common divisor) to find lcm: lcm(a, b) = (a * b) / gcd(a, b).
 *
 * The binary search will work as follows:
 * - The lower bound for the search space can be 1 (smallest possible amount).
 * - The upper bound can be estimated. A loose upper bound could be `k * max(coins)`. A tighter, more practical upper bound is `2 * 10^14` (since k is up to 2*10^9 and coins up to 25, though even 10^14 should be sufficient given the constraints and the nature of multiples). The problem statement implies the answer fits within a 64-bit integer.
 * - In each step of binary search, we calculate `mid`.
 * - We then count how many numbers less than or equal to `mid` are multiples of at least one coin denomination using the Inclusion-Exclusion principle.
 * - If the count is less than `k`, it means our `mid` is too small, so we need to search in the upper half: `low = mid + 1`.
 * - If the count is greater than or equal to `k`, it means `mid` could be our answer or is too large, so we search in the lower half: `high = mid`.
 *
 * The maximum number of subsets to consider for Inclusion-Exclusion is 2^N, where N is the number of coins. Since N <= 15, 2^15 = 32768, which is manageable.
 *
 * Time Complexity:
 * The binary search performs `log(MAX_AMOUNT)` iterations, where `MAX_AMOUNT` is the upper bound of our search space (e.g., ~10^14).
 * Inside each iteration, we iterate through all 2^N subsets of coins. For each subset, we compute the LCM.
 * GCD computation takes `O(log(min(a, b)))` time. LCM computation for multiple numbers involves repeated GCDs. In the worst case, computing LCM for a subset of size `m` takes `O(m * log(max_coin_value))`.
 * The overall time complexity is approximately `O(2^N * N * log(MAX_AMOUNT) * log(MAX_COIN_VALUE))`.
 * With N=15, 2^N is ~32768. log(MAX_AMOUNT) is ~50. log(MAX_COIN_VALUE) is small.
 * This should be feasible.
 *
 * Space Complexity:
 * `O(N)` for storing coin values and for recursion/stack if LCM is computed recursively. If iterative LCM is used, it can be `O(1)` extra space beyond input.
 */
public class KthSmallestAmount {

    public long findKthSmallest(int[] coins, int k) {
        // Binary search range for the kth smallest amount.
        // Lower bound is 1, the smallest possible amount.
        long low = 1;
        // A sufficiently large upper bound.
        // Since k can be up to 2*10^9 and coins up to 25,
        // the kth smallest amount could be large.
        // A safe upper bound considering k * max_coin would be roughly 2*10^9 * 25 = 5*10^10.
        // However, multiples can grow faster. A bound like 10^14 is safer and typical for such problems.
        // Given the constraints, a value around 2 * 10^14 should cover the maximum possible answer.
        long high = 2_000_000_000_000_000L; // 2 * 10^15

        // The answer will be stored here.
        long ans = high;

        // Perform binary search
        while (low <= high) {
            // Calculate the middle value
            long mid = low + (high - low) / 2;

            // Count how many numbers less than or equal to 'mid' can be formed by the coins.
            // This count is achieved using the Principle of Inclusion-Exclusion.
            long count = countAmounts(coins, mid);

            // If the count of formable amounts up to 'mid' is less than 'k',
            // it means 'mid' is too small. We need to search in the upper half.
            if (count < k) {
                low = mid + 1;
            }
            // If the count is greater than or equal to 'k',
            // it means 'mid' could be our answer, or it's too large.
            // We record 'mid' as a potential answer and try to find a smaller value in the lower half.
            else {
                ans = mid; // 'mid' is a possible candidate for the kth smallest amount
                high = mid - 1;
            }
        }
        return ans;
    }

    /**
     * Calculates the number of distinct amounts less than or equal to 'limit'
     * that can be formed using the given coin denominations.
     * This is done using the Principle of Inclusion-Exclusion.
     *
     * @param coins The array of coin denominations.
     * @param limit The upper bound for the amounts to count.
     * @return The count of formable amounts.
     */
    private long countAmounts(int[] coins, long limit) {
        long totalCount = 0;
        int n = coins.length;

        // Iterate through all possible non-empty subsets of coins.
        // A bitmask from 1 to (1 << n) - 1 represents each subset.
        // Each bit in the mask corresponds to a coin in the 'coins' array.
        for (int i = 1; i < (1 << n); i++) {
            long currentLcm = 1; // Initialize LCM for the current subset
            int setBits = 0;     // Count of coins in the current subset

            // Iterate through each coin to check if it's in the current subset
            for (int j = 0; j < n; j++) {
                // If the j-th bit is set in the mask 'i', it means coins[j] is in this subset.
                if ((i & (1 << j)) != 0) {
                    setBits++; // Increment the count of coins in this subset

                    // Calculate the LCM of 'currentLcm' and 'coins[j]'.
                    // We need to handle potential overflow if LCM exceeds the limit.
                    // If LCM exceeds 'limit', any further multiples of this LCM will also exceed 'limit',
                    // so we can stop calculating for this subset and contribute 0 to the count.
                    currentLcm = lcm(currentLcm, coins[j]);

                    // If currentLcm becomes greater than limit, then any multiple of this LCM
                    // will also be greater than limit. So we can break early for this subset.
                    if (currentLcm > limit) {
                        break;
                    }
                }
            }

            // If currentLcm exceeded limit during calculation, it means no multiples of this LCM
            // (and subsequent LCMs for larger subsets containing these coins) will be <= limit.
            // So, we skip adding to totalCount.
            if (currentLcm > limit) {
                continue;
            }

            // Apply Inclusion-Exclusion principle:
            // If the number of elements in the subset (setBits) is odd, we add the count of multiples.
            // If the number of elements is even, we subtract the count of multiples.
            // The number of multiples of 'currentLcm' less than or equal to 'limit' is 'limit / currentLcm'.
            if (setBits % 2 == 1) {
                totalCount += limit / currentLcm;
            } else {
                totalCount -= limit / currentLcm;
            }
        }
        return totalCount;
    }

    /**
     * Calculates the greatest common divisor (GCD) of two numbers using the Euclidean algorithm.
     *
     * @param a The first number.
     * @param b The second number.
     * @return The GCD of 'a' and 'b'.
     */
    private long gcd(long a, long b) {
        while (b != 0) {
            long temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    /**
     * Calculates the least common multiple (LCM) of two numbers.
     * lcm(a, b) = (a * b) / gcd(a, b).
     * We use (a / gcd(a, b)) * b to prevent potential overflow before division.
     *
     * @param a The first number.
     * @param b The second number.
     * @return The LCM of 'a' and 'b'.
     */
    private long lcm(long a, long b) {
        if (a == 0 || b == 0) return 0;
        // To prevent overflow, calculate as (a / gcd(a, b)) * b
        return (a / gcd(a, b)) * b;
    }
}
```