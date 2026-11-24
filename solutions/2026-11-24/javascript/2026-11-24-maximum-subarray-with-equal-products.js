/**
 * @file LeetCode 2556: Maximum Subarray With Equal Products.
 * @summary Finds the length of the longest subarray where the product of elements equals the product of LCM and GCD of those elements.
 * @link https://leetcode.com/problems/maximum-subarray-with-equal-products/
 *
 * @approach
 * The problem states that a subarray `arr` is product equivalent if `prod(arr) == lcm(arr) * gcd(arr)`.
 * We know the fundamental relationship between GCD and LCM: `a * b = gcd(a, b) * lcm(a, b)`.
 * For a subarray with more than two elements, this relationship is more complex. However, we can observe that the product equivalence `prod(arr) == lcm(arr) * gcd(arr)` holds true if and only if all elements in the subarray are the same.
 *
 * Let's prove this:
 * If all elements `x` in the subarray are the same, then:
 * `prod(arr) = x^k` (where `k` is the length of the subarray)
 * `gcd(arr) = x`
 * `lcm(arr) = x`
 * So, `lcm(arr) * gcd(arr) = x * x = x^2`.
 * For `prod(arr) == lcm(arr) * gcd(arr)`, we need `x^k = x^2`.
 * If `x = 1`, then `1^k = 1^2` is always true.
 * If `x > 1`, then `k` must be equal to `2`.
 *
 * This suggests that the condition `prod(arr) == lcm(arr) * gcd(arr)` is very restrictive.
 * A key observation is that for any subarray, if `prod(arr) == lcm(arr) * gcd(arr)`, then all elements in that subarray must be the same, or the subarray length is at most 2.
 *
 * Let's re-examine the examples and the condition more carefully.
 * The problem statement `prod(arr) == lcm(arr) * gcd(arr)` is not generally true for all subarrays.
 * The core mathematical property is that for *any two positive integers* `a` and `b`, `a * b = gcd(a, b) * lcm(a, b)`.
 *
 * Consider a subarray `[a, b, c]`.
 * `prod([a, b, c]) = a * b * c`
 * `gcd([a, b, c]) = gcd(gcd(a, b), c)`
 * `lcm([a, b, c]) = lcm(lcm(a, b), c)`
 *
 * The property `prod(arr) == lcm(arr) * gcd(arr)` simplifies significantly.
 * For an array `[a_1, a_2, ..., a_n]`:
 * `prod(arr) = a_1 * a_2 * ... * a_n`
 * `gcd(arr) = gcd(a_1, a_2, ..., a_n)`
 * `lcm(arr) = lcm(a_1, a_2, ..., a_n)`
 *
 * It is a known property that `prod(arr) = gcd(arr) * lcm(arr)` if and only if the subarray contains at most one element greater than 1, or all elements are identical.
 *
 * Let's test this hypothesis with the examples:
 *
 * Example 1: `nums = [1,2,1,2,1,1,1]`
 * Subarray `[1, 2, 1, 1, 1]` (length 5).
 * prod = 1 * 2 * 1 * 1 * 1 = 2
 * gcd = gcd(1, 2, 1, 1, 1) = 1
 * lcm = lcm(1, 2, 1, 1, 1) = 2
 * prod == gcd * lcm (2 == 1 * 2). This subarray is product equivalent.
 * Notice that this subarray contains only one element greater than 1 (which is 2), and the rest are 1s.
 *
 * Example 2: `nums = [2,3,4,5,6]`
 * Subarray `[3, 4, 5]` (length 3).
 * prod = 3 * 4 * 5 = 60
 * gcd = gcd(3, 4, 5) = 1
 * lcm = lcm(3, 4, 5) = 60
 * prod == gcd * lcm (60 == 1 * 60). This subarray is product equivalent.
 * Here, all elements are distinct and greater than 1. This seems to contradict the initial hypothesis.
 *
 * Let's re-read the problem. "An array arr is called product equivalent if prod(arr) == lcm(arr) * gcd(arr)".
 * This is a property that needs to be checked for each subarray.
 *
 * The constraints `nums[i] <= 10` are crucial. This means the numbers are very small.
 * This suggests that brute-forcing all subarrays and checking the condition might be feasible.
 *
 * Let's re-evaluate the property `prod(arr) == lcm(arr) * gcd(arr)`.
 * This property holds if and only if for every prime `p`, the highest power of `p` that divides any element in `arr` is either 1 or divides all elements in `arr`.
 *
 * More formally, let the prime factorization of `a_i` be `p_1^{e_{i1}} p_2^{e_{i2}} ...`.
 * `prod(arr) = \prod_{i=1}^n \prod_j p_j^{e_{ij}} = \prod_j p_j^{\sum_i e_{ij}}`
 * `gcd(arr) = \prod_j p_j^{\min_i e_{ij}}`
 * `lcm(arr) = \prod_j p_j^{\max_i e_{ij}}`
 *
 * For `prod(arr) == gcd(arr) * lcm(arr)`, for each prime `p_j`, we need:
 * `\sum_i e_{ij} = \min_i e_{ij} + \max_i e_{ij}`
 *
 * This condition `\sum_i e_{ij} = \min_i e_{ij} + \max_i e_{ij}` holds true if and only if the set `{e_{i1}, e_{i2}, ..., e_{in}}` for a given prime `p_j` has at most two distinct values, or if all values are the same.
 *
 * Example: `[3, 4, 5]`
 * Primes involved: 2, 3, 5.
 * For prime 2:
 * 3 = 2^0
 * 4 = 2^2
 * 5 = 2^0
 * Exponents: {0, 2, 0}. Sum = 2. Min = 0. Max = 2. Min + Max = 2. Holds.
 *
 * For prime 3:
 * 3 = 3^1
 * 4 = 3^0
 * 5 = 3^0
 * Exponents: {1, 0, 0}. Sum = 1. Min = 0. Max = 1. Min + Max = 1. Holds.
 *
 * For prime 5:
 * 3 = 5^0
 * 4 = 5^0
 * 5 = 5^1
 * Exponents: {0, 0, 1}. Sum = 1. Min = 0. Max = 1. Min + Max = 1. Holds.
 *
 * So, `[3, 4, 5]` is product equivalent.
 *
 * Example: `[1, 2, 1, 2, 1, 1, 1]` -> subarray `[1, 2, 1, 1, 1]`
 * Primes involved: 2.
 * For prime 2:
 * 1 = 2^0
 * 2 = 2^1
 * 1 = 2^0
 * 1 = 2^0
 * 1 = 2^0
 * Exponents: {0, 1, 0, 0, 0}. Sum = 1. Min = 0. Max = 1. Min + Max = 1. Holds.
 * So, `[1, 2, 1, 1, 1]` is product equivalent.
 *
 * This more precise understanding of the condition is key.
 * Since `nums[i] <= 10`, the primes we care about are 2, 3, 5, 7.
 *
 * The approach will be:
 * 1. Iterate through all possible subarrays. A subarray is defined by its start and end indices (i, j).
 * 2. For each subarray `nums[i...j]`:
 *    a. Check if it's product equivalent.
 *       - To do this, we need helper functions for GCD and LCM.
 *       - We also need a function to calculate the product of a subarray.
 *    b. If it is product equivalent, update the maximum length found so far.
 *
 * The GCD and LCM of a list of numbers can be calculated iteratively.
 * `gcd(a, b, c) = gcd(gcd(a, b), c)`
 * `lcm(a, b, c) = lcm(lcm(a, b), c)`
 *
 * Helper function for GCD of two numbers: Euclidean algorithm.
 * Helper function for LCM of two numbers: `lcm(a, b) = (a * b) / gcd(a, b)`.
 *
 * Since `nums.length <= 100` and `nums[i] <= 10`, the maximum product can be large, but `lcm` and `gcd` will be at most 10. The product of `lcm` and `gcd` will also be manageable.
 *
 * Time Complexity:
 * - There are O(N^2) subarrays, where N is `nums.length`.
 * - For each subarray of length K, calculating product, GCD, and LCM takes O(K * log(max_num)) or O(K * num_primes).
 * - Since max_num is small (10), log(max_num) is small. Number of primes less than or equal to 10 is also small (2, 3, 5, 7).
 * - The GCD/LCM calculation for K numbers will take roughly O(K * log(10)) time.
 * - Total time complexity: O(N^3 * log(max_val)). Given N=100, this is roughly 100^3 * small_constant, which is acceptable.
 *
 * Space Complexity:
 * - O(1) if we don't store the subarrays, just iterate and calculate.
 *
 * Let's implement the helper functions first.
 */

/**
 * Calculates the greatest common divisor (GCD) of two numbers.
 * Uses the Euclidean algorithm.
 * @param {number} a
 * @param {number} b
 * @returns {number} The GCD of a and b.
 */
const gcd = (a, b) => {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
};

/**
 * Calculates the least common multiple (LCM) of two numbers.
 * Uses the formula: lcm(a, b) = (a * b) / gcd(a, b).
 * Handles potential overflow by dividing first if possible, though for small numbers here it's not an issue.
 * @param {number} a
 * @param {number} b
 * @returns {number} The LCM of a and b.
 */
const lcm = (a, b) => {
    if (a === 0 || b === 0) return 0; // LCM with 0 is 0.
    // To prevent potential overflow, divide first if `a` is divisible by `gcd(a, b)`.
    // For numbers <= 10, `a*b` will not overflow standard JS numbers.
    return (a * b) / gcd(a, b);
};

/**
 * Calculates the GCD of an array of numbers.
 * @param {number[]} arr - The array of numbers.
 * @returns {number} The GCD of all numbers in the array.
 */
const arrayGcd = (arr) => {
    if (arr.length === 0) return 0; // Or throw an error, or return 1 if context allows.
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
        result = gcd(result, arr[i]);
        if (result === 1) return 1; // Optimization: if GCD becomes 1, it stays 1.
    }
    return result;
};

/**
 * Calculates the LCM of an array of numbers.
 * @param {number[]} arr - The array of numbers.
 * @returns {number} The LCM of all numbers in the array.
 */
const arrayLcm = (arr) => {
    if (arr.length === 0) return 1; // LCM of empty set is usually 1.
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
        result = lcm(result, arr[i]);
        // Given nums[i] <= 10, LCM can't exceed lcm(1,2,..,10) which is 2520.
        // No overflow concern here.
    }
    return result;
};

/**
 * Calculates the product of elements in an array.
 * @param {number[]} arr - The array of numbers.
 * @returns {number} The product of all elements in the array.
 */
const arrayProduct = (arr) => {
    if (arr.length === 0) return 1;
    let product = 1;
    for (const num of arr) {
        product *= num;
        // For nums[i] <= 10 and N <= 100, product can be large, but fits in JS Number type.
        // For example, 10^100 is too big, but 10^100 is not possible with N=100 and values <=10.
        // Max product for N=100 with all 10s is 10^100 which is too big.
        // However, if a subarray is product equivalent, its product will not grow excessively.
        // Let's consider the constraints again. The maximum product will not exceed the values that `lcm * gcd` would produce.
        // Max LCM for numbers <= 10 is 2520. Max GCD is 10. Max lcm*gcd is 25200.
        // If prod > 25200 and the numbers are not all 1s, it's unlikely to be product equivalent.
        // This observation might allow for early exit if product gets too large, but for correctness, let's calculate full product.
        // The total product for a subarray of length 100 with all 10s is 10^100, which is definitely too large and will overflow.
        // This implies that product equivalent subarrays must have a product that doesn't grow too large.
        // The condition prod(arr) == lcm(arr) * gcd(arr) implicitly limits the product.
        // If any element is > 1, and the product is large, it's highly unlikely for the condition to hold.
        // Example: subarray [2, 3, 4, 5, 6]. N=5. Product = 720. GCD = 1. LCM = 60. 720 != 1 * 60.
        // Okay, so the direct calculation of product can indeed overflow if the subarray is long and contains large numbers.
        // However, the constraints on `nums[i] <= 10` are very small.
        // The condition `\sum_i e_{ij} = \min_i e_{ij} + \max_i e_{ij}` is the one that really matters.
        // We don't strictly need the product if we can verify this condition directly using prime factorizations.
        //
        // BUT, the problem asks for `prod(arr) == lcm(arr) * gcd(arr)`. If we rely on the prime factorization property, we are assuming it's equivalent.
        // The problem statement and examples suggest that this property IS equivalent.
        //
        // Let's rethink the product overflow.
        // If a subarray `arr` is product equivalent, then `prod(arr) = lcm(arr) * gcd(arr)`.
        // The maximum possible value for `lcm(arr) * gcd(arr)` for numbers `<= 10` is `lcm(1..10) * 10` which is `2520 * 10 = 25200`.
        // Therefore, any product equivalent subarray must have a product that is at most `25200`.
        // This means if `product` exceeds `25200` during the calculation for a subarray, that subarray CANNOT be product equivalent.
        // We can add an early exit to `arrayProduct` if the product exceeds a safe bound.
        // The safe bound is `max_lcm * max_gcd`. Max LCM for numbers <= 10 is 2520. Max GCD is 10. So, `2520 * 10 = 25200`.
        // Any product > 25200 means it cannot be equal to `lcm * gcd`.
        if (product > 25200) { // Safety bound derived from max possible lcm*gcd
            return Infinity; // Indicate overflow / impossible product equivalence
        }
    }
    return product;
};

/**
 * Checks if a subarray is product equivalent.
 * A subarray `arr` is product equivalent if `prod(arr) == lcm(arr) * gcd(arr)`.
 * @param {number[]} subArray - The subarray to check.
 * @returns {boolean} True if the subarray is product equivalent, false otherwise.
 */
const isProductEquivalent = (subArray) => {
    if (subArray.length === 0) return false; // Or true depending on definition of empty product. Problem implies non-empty.

    // Handle single element case: prod([x]) = x, gcd([x]) = x, lcm([x]) = x. x == x * x ? Only if x=1.
    // The constraints state nums.length >= 2, so subarrays will have length >= 1.
    if (subArray.length === 1) {
        // For a single element `x`, product = x, gcd = x, lcm = x.
        // `x == x * x` is true only if `x == 1`.
        // However, the problem example 1 has [1,2,1,1,1] length 5.
        // Example 2 has [3,4,5] length 3.
        // This suggests that the single element case `x=1` is product equivalent.
        // If `x > 1`, `x != x*x`.
        // The problem likely implies subarrays of length >= 1.
        // Let's test with [1]: prod=1, gcd=1, lcm=1. 1 == 1*1. True.
        // Let's test with [2]: prod=2, gcd=2, lcm=2. 2 == 2*2. False.
        // So, a single element subarray is product equivalent only if it's [1].
        // This is consistent with the math. However, the problem asks for the LONGEST.
        // A subarray like [1,1,1] of length 3 is product equivalent: prod=1, gcd=1, lcm=1. 1 == 1*1.
        // This implies that all-ones subarrays are always product equivalent.
        // The constraint `nums.length >= 2` means we are looking for subarrays within an array of size at least 2.
        //
        // Let's re-read again: "Return the length of the longest product equivalent subarray of nums."
        // It does not say subarrays must be of length > 1.
        // If nums = [1, 1, 1], longest product equivalent subarray is [1, 1, 1] with length 3.
        // prod=1, gcd=1, lcm=1. 1 = 1 * 1.

        // The core condition is `prod(arr) == lcm(arr) * gcd(arr)`.
        // For length 1, `x == x * x` only if `x = 1`.
        // Thus, `[1]` is product equivalent, `[2]` is not.
        // This is important.
        return subArray[0] === 1;
    }


    const p = arrayProduct(subArray);
    if (p === Infinity) { // If product overflowed the safe bound
        return false;
    }

    const commonGcd = arrayGcd(subArray);
    const commonLcm = arrayLcm(subArray);

    return p === commonLcm * commonGcd;
};


/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProductEquivalentSubarray = function(nums) {
    let maxLength = 0;
    const n = nums.length;

    // Iterate through all possible start indices.
    for (let i = 0; i < n; i++) {
        // Iterate through all possible end indices starting from the current start index.
        for (let j = i; j < n; j++) {
            // Extract the current subarray.
            const subArray = nums.slice(i, j + 1);
            const currentLength = subArray.length;

            // Check if the current subarray is product equivalent.
            if (isProductEquivalent(subArray)) {
                // If it is, update the maximum length found so far.
                maxLength = Math.max(maxLength, currentLength);
            }
        }
    }

    return maxLength;
};

/*
 * Time Complexity Analysis:
 * The outer two loops iterate through all possible subarrays. There are O(N^2) subarrays, where N is the length of `nums`.
 * For each subarray, `isProductEquivalent` is called.
 * Inside `isProductEquivalent`:
 *   - `arrayProduct` iterates through the subarray. If its length is K, this takes O(K) time.
 *     Crucially, due to the product overflow check (limiting product to 25200), this loop will effectively run for at most a small constant number of iterations on average or until the product exceeds the bound.
 *     Consider the maximum possible product-equivalent value: `lcm(1..10) * 10 = 2520 * 10 = 25200`.
 *     To reach a product of 25200 with numbers <= 10, the maximum length of a product-equivalent subarray is bounded. For example, if all numbers are 2, 2^k <= 25200 implies k <= 14. If numbers are 2 and 3, the length is also limited.
 *     So, `arrayProduct` can be considered almost O(1) in terms of significant iterations before hitting the bound for product-equivalent arrays.
 *   - `arrayGcd` iterates through the subarray. For a subarray of length K, and numbers up to `M` (here M=10), GCD calculation takes O(K * log M) time. Since M=10, log M is small.
 *   - `arrayLcm` iterates through the subarray. For a subarray of length K, LCM calculation also takes O(K * log M) time.
 *
 * The dominant factor for checking a subarray of length K is O(K * log M).
 * In the worst case, K can be up to N. So, checking one subarray is O(N * log M).
 * Total complexity: O(N^2 * N * log M) = O(N^3 * log M).
 * Given N <= 100 and M <= 10, this is roughly 100^3 * log(10), which is feasible.
 *
 * However, a more precise analysis of `arrayProduct` with the bound:
 * If `arrayProduct` hits `Infinity`, it means `product > 25200`. For `nums[i] <= 10`, this happens relatively quickly.
 * For example, to get a product of 25200:
 * - With only 2s: 2^14 = 16384, 2^15 = 32768. So max length is 14.
 * - With mixed numbers, the length will be even smaller.
 * This means the `arrayProduct` loop, for product-equivalent subarrays, effectively runs for a length much smaller than N.
 * The overall check for `isProductEquivalent` might be closer to O(K) on average due to the early exit from `arrayProduct` (considering `log M` as a small constant).
 * If we consider the effective length `K_eff` for product calculation to be small, and GCD/LCM calculations for small `K_eff`, the `isProductEquivalent` call might be considered closer to O(N) in total for its operations.
 *
 * But let's stick to the worst-case scenario for complexity analysis of the loops.
 * The three loops (outer `i`, inner `j`, and then inside `isProductEquivalent` for product, gcd, lcm) result in O(N^3 * log M).
 *
 * Space Complexity Analysis:
 * - The `slice` operation creates a new subarray, which can take up to O(N) space.
 * - Helper functions `gcd` and `lcm` use O(1) space.
 * - `arrayGcd`, `arrayLcm`, `arrayProduct` use O(1) additional space beyond the input array.
 * - The `isProductEquivalent` function creates a subarray which takes O(K) space, where K is the length of the subarray (up to N).
 * - Therefore, the space complexity is O(N) due to slicing for subarrays.
 *
 * Optimization:
 * Instead of slicing, we can pass start and end indices to `isProductEquivalent` and calculate product, gcd, lcm iteratively within the main loops. This would reduce space to O(1).
 * Let's refine the implementation to achieve O(1) space.
 */

/**
 * Checks if a subarray nums[start...end] is product equivalent.
 * A subarray `arr` is product equivalent if `prod(arr) == lcm(arr) * gcd(arr)`.
 * @param {number[]} nums - The original array.
 * @param {number} start - The starting index of the subarray (inclusive).
 * @param {number} end - The ending index of the subarray (inclusive).
 * @returns {boolean} True if the subarray is product equivalent, false otherwise.
 */
const isProductEquivalentOptimized = (nums, start, end) => {
    const length = end - start + 1;
    if (length === 0) return false;

    // Handle single element case.
    if (length === 1) {
        return nums[start] === 1;
    }

    let currentProduct = 1;
    let currentGcd = nums[start];
    let currentLcm = nums[start];

    // Iterate through the subarray from the second element.
    for (let k = start + 1; k <= end; k++) {
        const num = nums[k];

        // Calculate product and check for overflow.
        currentProduct *= num;
        if (currentProduct > 25200) { // Safe bound for product-equivalent subarrays
            return false; // Product is too large to be equal to lcm*gcd
        }

        // Update GCD and LCM iteratively.
        currentGcd = gcd(currentGcd, num);
        currentLcm = lcm(currentLcm, num);

        // Optimization: If LCM exceeds the max possible product-equivalent value,
        // it's impossible for the condition to hold, as product cannot exceed LCM.
        // Max prod == Max lcm * Max gcd. Max lcm * max gcd = 25200.
        // If currentLcm itself exceeds 25200, we can stop.
        // However, for nums[i] <= 10, max lcm is 2520. So this specific check isn't strictly needed.
        // if (currentLcm > 25200) return false;
    }
    
    // Re-calculate the full product for the subarray (can be done in the loop as well).
    // For clarity, let's calculate it separately or ensure the loop above correctly accumulates it.
    // The `currentProduct` in the loop is the product of `nums[start...k]`. We need `nums[start...end]`.
    // Let's re-do the loop to correctly accumulate product, gcd, and lcm together.

    currentGcd = nums[start];
    currentLcm = nums[start];
    currentProduct = nums[start]; // Start with the first element

    for (let k = start + 1; k <= end; k++) {
        const num = nums[k];

        // Update product and check overflow.
        currentProduct *= num;
        if (currentProduct > 25200) {
            return false;
        }

        // Update GCD and LCM.
        currentGcd = gcd(currentGcd, num);
        currentLcm = lcm(currentLcm, num);
    }

    // Final check
    return currentProduct === currentLcm * currentGcd;
};


/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProductEquivalentSubarray_O1_space = function(nums) {
    let maxLength = 0;
    const n = nums.length;

    // Iterate through all possible start indices.
    for (let i = 0; i < n; i++) {
        // Iterate through all possible end indices starting from the current start index.
        for (let j = i; j < n; j++) {
            // Check if the subarray nums[i...j] is product equivalent.
            if (isProductEquivalentOptimized(nums, i, j)) {
                const currentLength = j - i + 1;
                maxLength = Math.max(maxLength, currentLength);
            }
        }
    }

    return maxLength;
};

// The original `maxProductEquivalentSubarray` function uses slicing and O(N) space.
// The `maxProductEquivalentSubarray_O1_space` uses indices and achieves O(1) space.
// Given the problem constraints and difficulty, either approach is likely fine,
// but the O(1) space is technically better. The problem likely expects the O(N^3) time.
// I will provide the O(1) space solution for the final answer.

// Final decision on which function to export: the O1 space one.
var maxProductEquivalentSubarray = maxProductEquivalentSubarray_O1_space;


// Example Test Cases:
// console.log(maxProductEquivalentSubarray([1,2,1,2,1,1,1])); // Expected: 5
// console.log(maxProductEquivalentSubarray([2,3,4,5,6]));     // Expected: 3
// console.log(maxProductEquivalentSubarray([1,2,3,1,4,5,1])); // Expected: 5
// console.log(maxProductEquivalentSubarray([1,1,1,1,1]));     // Expected: 5
// console.log(maxProductEquivalentSubarray([2,2,2,2]));       // Expected: 2 (subarray [2,2], prod=4, gcd=2, lcm=2, 4 == 2*2)
// console.log(maxProductEquivalentSubarray([2,3,2]));         // Expected: 1 (subarray [2] or [3] or [2]. [2,3,2]: prod=12, gcd=1, lcm=6. 12!=1*6. [2,3]: prod=6, gcd=1, lcm=6. 6==1*6. Length 2)
// Let's re-check [2,3,2] for length 2 subarrays:
// [2,3]: prod=6, gcd=1, lcm=6. 6 == 1*6. Product Equivalent. Length 2.
// [3,2]: prod=6, gcd=1, lcm=6. 6 == 1*6. Product Equivalent. Length 2.
// So for [2,3,2], output should be 2.
// My isProductEquivalentOptimized should handle this correctly.
// For [2,3,2], i=0, j=1: subarray [2,3]. Length 2.
// currentGcd=2, currentLcm=2, currentProduct=2.
// k=1 (num=3): currentProduct = 2*3 = 6. 6 <= 25200. OK.
// currentGcd = gcd(2,3) = 1. currentLcm = lcm(2,3) = 6.
// End loop. return 6 === 6 * 1. True. maxLength = max(0, 2) = 2.
//
// For [2,2,2,2], i=0, j=1: subarray [2,2]. Length 2.
// currentGcd=2, currentLcm=2, currentProduct=2.
// k=1 (num=2): currentProduct = 2*2 = 4. 4 <= 25200. OK.
// currentGcd = gcd(2,2) = 2. currentLcm = lcm(2,2) = 2.
// End loop. return 4 === 2 * 2. True. maxLength = max(0, 2) = 2.
//
// The logic appears sound.
// The early exit `currentProduct > 25200` is crucial for performance if subarrays were much longer or numbers larger, but here it acts as a strong hint.
// The true condition is `sum(e_p) = min(e_p) + max(e_p)` for each prime `p`.
// The `prod(arr) == lcm(arr) * gcd(arr)` is equivalent to this condition.
// The maximum value of `lcm(arr) * gcd(arr)` for `nums[i] <= 10` is `lcm(1..10) * 10 = 2520 * 10 = 25200`.
// So any product-equivalent subarray *must* have its product <= 25200.
// This is why the product overflow check `currentProduct > 25200` is a valid pruning step.
//
// Time complexity is indeed O(N^3 * log(max_val)) because `isProductEquivalentOptimized` takes O(K * log(max_val)) time, where K is the length of the subarray (up to N).
// K iterations, each involves GCD/LCM which take log(max_val) time.
// N^2 subarrays, each check takes up to N * log(max_val).
// N^2 * N * log(max_val) = N^3 * log(max_val).
// Space complexity is O(1) because we only use a few variables to store intermediate calculations.
*/
```