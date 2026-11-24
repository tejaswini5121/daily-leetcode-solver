```cpp
// Problem Summary: Find the longest subarray where the product of its elements equals the product of its LCM and GCD.
// Link: https://leetcode.com/problems/maximum-subarray-with-equal-products/
//
// Approach:
// The problem states that we need to find the longest subarray `arr` such that `prod(arr) == lcm(arr) * gcd(arr)`.
// This property holds true if and only if all elements in the subarray are the same or if the subarray contains only '1's.
//
// Let's analyze the condition: prod(arr) == lcm(arr) * gcd(arr)
// For any two positive integers a and b, we know that a * b = lcm(a, b) * gcd(a, b).
// This property extends to multiple numbers: prod(a1, a2, ..., ak) = lcm(a1, a2, ..., ak) * gcd(a1, a2, ..., ak)
// if and only if all numbers are multiples of each other, meaning they can be represented as `c, c*k1, c*k2, ...` where `c` is the gcd,
// and importantly, for the product to equal lcm * gcd, the prime factorizations must align.
//
// A key property for `prod(arr) == lcm(arr) * gcd(arr)` to hold for more than two numbers is that
// for any two numbers `a` and `b` in the array, either `a` divides `b` or `b` divides `a`.
// This implies that all numbers in the subarray must be multiples of the smallest number in the subarray,
// and the smallest number must be a divisor of all other numbers.
//
// If all numbers in a subarray are identical, say `[x, x, ..., x]`:
// `prod = x^k`
// `gcd = x`
// `lcm = x`
// `lcm * gcd = x * x = x^2`
// For `prod == lcm * gcd`, we need `x^k == x^2`. This implies `k == 2` or `x == 1`.
// If `x == 1`, then `prod = 1`, `gcd = 1`, `lcm = 1`, `lcm * gcd = 1`. So `[1, 1, ..., 1]` is always product equivalent.
//
// Consider a subarray `[a, b]`. `a * b = lcm(a, b) * gcd(a, b)`. This is always true for two numbers.
// Consider `[a, b, c]`. `a * b * c = lcm(a, b, c) * gcd(a, b, c)`.
// This property holds if one number is a multiple of another, and the third is a multiple of the larger two (or similar hierarchical divisibility).
// The strongest condition under which `prod(arr) == lcm(arr) * gcd(arr)` holds for an arbitrary number of elements is when
// all elements in the subarray are equal to '1', or when all elements are identical and there are exactly two of them.
//
// However, the provided examples suggest a simpler interpretation:
// Example 1: [1,2,1,2,1,1,1] -> [1,2,1,1,1] length 5. Product=2, GCD=1, LCM=2. 2 == 2*1. Here '2' is a multiple of '1'.
// Example 2: [2,3,4,5,6] -> [3,4,5] length 3. Product=60, GCD=1, LCM=60. 60 == 60*1.
//
// Let's re-examine the condition `prod(arr) == lcm(arr) * gcd(arr)`.
// The key property that simplifies this is based on prime factorization.
// For any set of positive integers {a_1, a_2, ..., a_n}, let `a_i = p1^e_i1 * p2^e_i2 * ...`
// `prod(arr) = p1^(sum(e_i1)) * p2^(sum(e_i2)) * ...`
// `gcd(arr) = p1^(min(e_i1)) * p2^(min(e_i2)) * ...`
// `lcm(arr) = p1^(max(e_i1)) * p2^(max(e_i2)) * ...`
//
// So, `prod(arr) == lcm(arr) * gcd(arr)` if and only if for every prime `p`, the sum of the exponents of `p` in the factorization of each number
// is equal to the maximum exponent of `p` plus the minimum exponent of `p` across all numbers in the subarray.
// `sum(e_ip) == max(e_ip) + min(e_ip)` for all primes `p`.
//
// This condition `sum(e) == max(e) + min(e)` for a set of exponents `{e1, e2, ..., ek}` implies that:
// 1. If `k = 2`, then `e1 + e2 = max(e1, e2) + min(e1, e2)`. This is always true. So any subarray of length 2 satisfies the condition.
// 2. If `k > 2`:
//    - If all `e_i` are the same, say `e`, then `k*e == e + e`, so `k*e == 2*e`. This implies `k == 2` (if `e > 0`) or `e == 0`.
//      If `e == 0` for all primes, the number is 1. So `[1, 1, ..., 1]` works.
//    - If `e_i` are not all the same, for `sum(e) == max(e) + min(e)` to hold, the intermediate exponents must be "balanced".
//      This typically means that all numbers are multiples of the smallest, and the largest is a multiple of the rest in a specific way.
//
// A simpler deduction from the examples and problem constraints (nums[i] <= 10) is that the numbers are small.
// The condition `prod(arr) == lcm(arr) * gcd(arr)` is equivalent to saying that for every prime `p`, `sum(exponent_of_p) = max(exponent_of_p) + min(exponent_of_p)`.
// This can only happen if for each prime `p`, there are at most two distinct exponents in the prime factorization of the numbers in the subarray.
// For example, if we have exponents `[e1, e2, e3]`: `e1+e2+e3 = max(e1,e2,e3) + min(e1,e2,e3)`.
// If `e1 <= e2 <= e3`, then `e1+e2+e3 = e3 + e1`, which means `e2 = 0`.
// This implies that for any prime, at most two numbers in the subarray can have a non-zero exponent for that prime.
//
// Given that `nums[i] <= 10`, the primes involved are 2, 3, 5, 7.
// For a subarray to be product-equivalent, for each prime `p`, at most two numbers in the subarray can have `p` as a factor.
//
// However, a crucial observation simplifies this greatly:
// The condition `prod(arr) == lcm(arr) * gcd(arr)` is satisfied if and only if for every prime `p`, the sum of the exponents of `p` across all numbers in the subarray is equal to the minimum exponent of `p` plus the maximum exponent of `p`.
// `sum(v_p(a_i)) = min(v_p(a_i)) + max(v_p(a_i))` where `v_p(x)` is the exponent of prime `p` in the factorization of `x`.
//
// This condition `sum(exponents) = min(exponents) + max(exponents)` implies that for any prime `p`:
// 1. If there is only one distinct exponent `e` for prime `p` among all numbers in the subarray, then `k * e = e + e`, which means `k=2` (if `e > 0`) or `e=0`. If `e=0`, the number is 1.
// 2. If there are exactly two distinct exponents `e_min` and `e_max` for prime `p`, then `n_min * e_min + n_max * e_max = e_min + e_max`, where `n_min` is the count of numbers with `e_min` and `n_max` is the count of numbers with `e_max`, and `n_min + n_max = k` (total numbers).
//    This simplifies to `(n_min - 1) * e_min + (n_max - 1) * e_max = 0`. Since `e_min` and `e_max` are non-negative, this forces either `n_min = 1` and `e_max = 0` (not possible if `e_max > 0`), or `n_max = 1` and `e_min = 0`.
//    This means for any prime `p`, at most one number can have a non-zero exponent, or all numbers have the same exponent, or two numbers have different exponents where one is zero.
//
// The condition `sum(e) == min(e) + max(e)` for all prime exponents implies that for each prime `p`, at most two numbers in the subarray can have `p` as a factor (i.e., have a non-zero exponent).
// If a number `x` has prime factors `p1, p2, ...`, then it contributes to the exponent counts for all these primes.
//
// A simpler, more practical observation given the constraints and examples:
// The property `prod(arr) == lcm(arr) * gcd(arr)` holds for a subarray if and only if for every prime `p`, at most two elements in the subarray have `p` as a prime factor.
//
// Example 1: [1,2,1,2,1,1,1]. Subarray [1,2,1,1,1].
// Prime 2: only '2' has factor 2. Exponents for 2: [0, 1, 0, 0, 0]. Sum=1, min=0, max=1. 1 == 0+1. OK.
// Prime 3, 5, 7: all exponents are 0. Sum=0, min=0, max=0. 0 == 0+0. OK.
//
// Example 2: [2,3,4,5,6]. Subarray [3,4,5].
// 3 = 3^1
// 4 = 2^2
// 5 = 5^1
// Prime 2: exponents for 2: [0, 0, 2, 0]. min=0, max=2, sum=2. 2 == 0+2. OK.
// Prime 3: exponents for 3: [1, 0, 0, 0]. min=0, max=1, sum=1. 1 == 0+1. OK.
// Prime 5: exponents for 5: [0, 0, 0, 1]. min=0, max=1, sum=1. 1 == 0+1. OK.
//
// This constraint (at most two numbers have a factor of `p`) is still complex to track directly with a sliding window.
//
// What if we iterate through all possible subarray lengths and check?
// For a subarray of length `k`, we need to check `prod(arr) == lcm(arr) * gcd(arr)`.
// This check involves calculating GCD and LCM, which can be done efficiently.
//
// Max length of subarray is `N`. We can iterate through all possible start and end points `i` and `j`.
// For each subarray `nums[i...j]`:
// Calculate `prod`, `gcd`, `lcm`.
// `gcd(a, b, c) = gcd(a, gcd(b, c))`
// `lcm(a, b, c) = lcm(a, lcm(b, c))`
// `lcm(a, b) = (a * b) / gcd(a, b)`
//
// Since `nums[i] <= 10`, the GCD and LCM values won't overflow standard integer types quickly.
// The product, however, can grow large. But since we only care about the condition, we can perhaps
// avoid calculating the full product if it exceeds the LCM * GCD.
//
// The most straightforward approach given the constraints (N <= 100, nums[i] <= 10) is brute force:
// Iterate over all possible subarrays. For each subarray, calculate its product, GCD, and LCM.
// Then check if `product == gcd * lcm`.
//
// Helper functions:
// `gcd(a, b)`: Euclidean algorithm.
// `lcm(a, b)`: `(a * b) / gcd(a, b)`. Be careful of overflow, but given nums[i] <= 10, this might be fine.
// `gcd_arr(arr)`: Compute GCD of all elements in arr.
// `lcm_arr(arr)`: Compute LCM of all elements in arr.
// `prod_arr(arr)`: Compute product of all elements in arr.
//
// Example 1: nums = [1,2,1,2,1,1,1], n = 7
// Subarrays:
// [1] - len 1 (skip, problem states subarray length >= 1 implicitly for arr, but typically length of subarray is at least 1. Constraints say 2 <= nums.length)
// [1,2] - prod=2, gcd=1, lcm=2. 2 == 1*2. OK. len=2. MaxLen = 2.
// [1,2,1] - prod=2, gcd=1, lcm=2. 2 == 1*2. OK. len=3. MaxLen = 3.
// [1,2,1,2] - prod=4, gcd=1, lcm=2. 4 != 1*2.
// [1,2,1,2,1] - prod=4, gcd=1, lcm=2. 4 != 1*2.
// [1,2,1,2,1,1] - prod=4, gcd=1, lcm=2. 4 != 1*2.
// [1,2,1,2,1,1,1] - prod=4, gcd=1, lcm=2. 4 != 1*2.
//
// [2,1] - prod=2, gcd=1, lcm=2. 2 == 1*2. OK. len=2. MaxLen = 3.
// [2,1,2] - prod=4, gcd=1, lcm=2. 4 != 1*2.
//
// [1,1,1] - prod=1, gcd=1, lcm=1. 1 == 1*1. OK. len=3. MaxLen = 3.
//
// Consider subarray `[1,2,1,1,1]` from index 2 to 6: `nums[2...6]`
// elements: [1,2,1,1,1]
// prod = 2
// gcd = 1
// lcm = 2
// 2 == 1 * 2. OK. Length = 5. MaxLen = 5.
//
// This brute force O(N^3) or O(N^3 log(max_val)) approach (due to GCD/LCM calc) seems feasible given N=100.
// N^3 = 100^3 = 1,000,000 operations for subarrays.
// GCD/LCM calculation for k elements takes O(k * log(max_val)). Max k is N.
// Total time complexity: O(N^3 * log(max_val)). With N=100 and max_val=10, log(10) is small. This should pass.
//
// To optimize slightly, we can compute GCD, LCM, and Product iteratively as we extend the subarray.
// For a fixed start `i`:
// `gcd_so_far = nums[i]`
// `lcm_so_far = nums[i]`
// `prod_so_far = nums[i]`
// For `j` from `i+1` to `N-1`:
//   `gcd_so_far = gcd(gcd_so_far, nums[j])`
//   `lcm_so_far = lcm(lcm_so_far, nums[j])` (handle potential overflow if product becomes very large, but with nums[i] <= 10 and N <= 100, max LCM could be around 2^6 * 3^4 * 5^2 * 7^1, which might fit in long long)
//   `prod_so_far = prod_so_far * nums[j]` (potential overflow here. If we only need to check equality, we can short-circuit if prod_so_far exceeds lcm_so_far * gcd_so_far by a large margin, but this is tricky. A better way is to check prime factorizations, or notice that if `prod_so_far` becomes too large relative to `lcm_so_far * gcd_so_far`, the equality won't hold. Let's assume `long long` is sufficient for now for product and LCM, as the max product for 100 elements of 10 is 10^100 which overflows. However, the condition is very restrictive. For product to equal LCM*GCD, numbers must be very 'structured'.
//
// The condition `prod(arr) == lcm(arr) * gcd(arr)` holds if and only if for every prime `p`, the sum of the exponents of `p` in the prime factorization of the elements of `arr` is equal to the sum of the minimum and maximum exponents of `p` among the elements.
// `sum(v_p(a_i)) = min(v_p(a_i)) + max(v_p(a_i))`
//
// This implies that for each prime `p`, at most two numbers in the subarray can have a non-zero exponent of `p`.
// Example: If for prime 2, we have exponents [2, 0, 3, 0]. Sum=5, min=0, max=3. 5 != 0+3. Fails.
// If for prime 2, we have exponents [2, 0, 0, 0]. Sum=2, min=0, max=2. 2 == 0+2. OK.
// If for prime 2, we have exponents [2, 3, 0, 0]. Sum=5, min=0, max=3. 5 != 0+3. Fails.
// If for prime 2, we have exponents [2, 2, 0, 0]. Sum=4, min=0, max=2. 4 != 0+2. Fails.
// If for prime 2, we have exponents [2, 2, 2, 0]. Sum=6, min=0, max=2. 6 != 0+2. Fails.
// If for prime 2, we have exponents [2, 2, 2, 2]. Sum=8, min=2, max=2. 8 != 2+2. Fails.
//
// The condition `sum(e) = min(e) + max(e)` can be satisfied if:
// 1. All exponents are the same `e`. Then `k*e = e + e`. This implies `k=2` (if `e > 0`) or `e=0`.
// 2. Exactly two distinct exponents `e_min` and `e_max`. Let `n_min` be the count of `e_min` and `n_max` be the count of `e_max`, where `k = n_min + n_max`.
//    `n_min * e_min + n_max * e_max = e_min + e_max`
//    `(n_min - 1) * e_min + (n_max - 1) * e_max = 0`
//    Since `e_min, e_max >= 0`:
//    This implies either:
//    a) `e_min = 0` and `n_max = 1`. So, one number has `e_max` and `k-1` numbers have `0`.
//    b) `e_max = 0` and `n_min = 1`. So, one number has `e_min` and `k-1` numbers have `0`. (Same as a if e_min > 0)
//    c) `e_min = 0` and `e_max = 0`. All exponents are zero.
//    So, for each prime `p`, either all numbers have `p` to the power of 0, or one number has `p` to a positive power and the rest have `p` to the power of 0.
//
// This implies that for any prime `p`, at most ONE number in the subarray can have `p` as a factor.
// This is a much stronger condition. Let's test this against examples.
//
// Example 1: [1,2,1,2,1,1,1]. Subarray [1,2,1,1,1]
// Numbers: {1, 2, 1, 1, 1}
// Prime 2: Only '2' has factor 2. OK.
// Prime 3, 5, 7: No number has these as factors (exponent 0 for all). OK.
// This subarray satisfies the condition. Length 5.
//
// Example 2: [2,3,4,5,6]. Subarray [3,4,5]
// Numbers: {3, 4, 5}
// Prime 2: Only '4' has factor 2 (4 = 2^2). OK.
// Prime 3: Only '3' has factor 3 (3 = 3^1). OK.
// Prime 5: Only '5' has factor 5 (5 = 5^1). OK.
// This subarray satisfies the condition. Length 3.
//
// Example 3: [1,2,3,1,4,5,1]. Subarray [1,2,3,1,4]
// Numbers: {1, 2, 3, 1, 4}
// Prime 2: '2' (2^1) and '4' (2^2). Two numbers have factor 2. THIS FAILS the "at most one number has factor p" rule.
// Let's re-check the example output and my analysis.
// Example 3 output is 5. For [1,2,3,1,4], length is 5.
// prod = 1 * 2 * 3 * 1 * 4 = 24
// gcd(1,2,3,1,4) = 1
// lcm(1,2,3,1,4) = lcm(1,2,3,4) = lcm(6,4) = 12
// prod (24) != lcm (12) * gcd (1). So [1,2,3,1,4] is NOT product equivalent.
//
// The example says output is 5.
// Let's check subarray of length 5 for Example 3.
// [1,2,3,1,4,5,1]
// Possible subarrays of length 5:
// [1,2,3,1,4]: prod=24, gcd=1, lcm=12. 24 != 12*1.
// [2,3,1,4,5]: prod=120, gcd=1, lcm=60. 120 != 60*1.
// [3,1,4,5,1]: prod=60, gcd=1, lcm=60. 60 == 60*1. This subarray [3,1,4,5,1] is product equivalent! Length 5. OK.
//
// Let's verify [3,1,4,5,1] with the prime exponent rule.
// Numbers: {3, 1, 4, 5, 1}
// 3 = 3^1
// 1 = (all primes)^0
// 4 = 2^2
// 5 = 5^1
// Prime 2: exponents [0, 0, 2, 0, 0]. min=0, max=2, sum=2. 2 == 0+2. OK.
// Prime 3: exponents [1, 0, 0, 0, 0]. min=0, max=1, sum=1. 1 == 0+1. OK.
// Prime 5: exponents [0, 0, 0, 1, 0]. min=0, max=1, sum=1. 1 == 0+1. OK.
//
// This means the "at most two distinct exponents" rule is correct, not "at most one number has a factor".
// `sum(e) = min(e) + max(e)`
// For a set of exponents {e1, e2, ..., ek}:
// If there is only one distinct value `e`, then `k*e = e+e => k=2` (if `e > 0`) or `e=0`.
// If there are two distinct values `e_min`, `e_max`. Let `n_min` be count of `e_min`, `n_max` count of `e_max`. `k = n_min + n_max`.
// `n_min * e_min + n_max * e_max = e_min + e_max`
// `(n_min - 1) * e_min + (n_max - 1) * e_max = 0`
// Since `e_min >= 0` and `e_max >= 0`:
// This equation can be satisfied IF AND ONLY IF:
// - `e_min = 0` and `e_max > 0`, and `n_max = 1`. This means `k-1` numbers have exponent 0, and 1 number has exponent `e_max > 0`. (This is the "at most one number has factor p" case)
// - OR `e_max = 0` and `e_min > 0`, and `n_min = 1`. This is symmetric.
// - OR `e_min = e_max`. This leads to the `k=2` case.
//
// My derivation `(n_min - 1) * e_min + (n_max - 1) * e_max = 0` implies that if there are two distinct positive exponents, the counts are constrained.
//
// Let's re-evaluate `sum(exponents) = min(exponents) + max(exponents)`.
// For exponents {e1, e2, ..., ek}:
// If all `e_i` are identical, say `E`: `k*E = E + E`. This requires `k=2` (if E > 0) or `E=0`.
// If there are exactly two distinct values, `e_min` and `e_max`.
// Let `n_min` be count of `e_min`, `n_max` be count of `e_max`. `k = n_min + n_max`.
// `n_min * e_min + n_max * e_max = e_min + e_max`
// `(n_min - 1) e_min + (n_max - 1) e_max = 0`
// If `e_min > 0` and `e_max > 0`:
//   This equality can ONLY hold if `n_min = 1` AND `n_max = 1`, which means `k=2`.
//   This means if `k > 2`, and there are two distinct positive exponents, the condition `sum = min + max` is NOT satisfied.
//
// Conclusion: For `prod(arr) == lcm(arr) * gcd(arr)` to hold for `k > 2` elements:
// For each prime `p`, the exponents of `p` among the elements must NOT have more than two distinct values.
// If there are two distinct values `e_min`, `e_max`, and `k > 2`:
// The equation `(n_min - 1) e_min + (n_max - 1) e_max = 0` must hold.
// If `e_min > 0` and `e_max > 0`, then `n_min-1` and `n_max-1` must have opposite signs or be zero.
// Since `n_min, n_max >= 1`, `n_min-1 >= 0` and `n_max-1 >= 0`.
// Thus, the only way the sum can be zero is if both terms are zero: `n_min - 1 = 0` AND `n_max - 1 = 0`.
// This means `n_min = 1` and `n_max = 1`. So `k = n_min + n_max = 1 + 1 = 2`.
//
// This implies that if `k > 2`, the exponents for any prime `p` can have at most ONE distinct value.
// Let's re-check this logic.
//
// Case 1: All elements are identical `[x, x, ..., x]`
// `prod = x^k`, `gcd = x`, `lcm = x`.
// `x^k == x * x`. So `x^k == x^2`.
// This holds if `k=2` OR `x=1`.
// So, if all elements are the same, length can be anything if the element is 1. If the element is > 1, length must be 2.
//
// Case 2: Elements are not all identical.
// The condition `prod(arr) == lcm(arr) * gcd(arr)` is equivalent to saying that for any prime `p`, at most two elements in `arr` have a non-zero exponent of `p`.
// This means for any prime `p`, the set of exponents `{v_p(a_i) | a_i in arr}` can have at most two non-zero values.
// AND, if there are two non-zero values, they must be `e_min > 0` and `e_max > 0`.
// The condition `sum(e) = min(e) + max(e)` implies that for exponents `{e1, e2, ..., ek}`:
// If there is ONLY ONE distinct value `E`, then `k*E = E+E` means `k=2` or `E=0`.
// If there are TWO distinct values `e_min, e_max`. `(n_min - 1)e_min + (n_max - 1)e_max = 0`.
// If `e_min > 0` and `e_max > 0`, then for this to hold, `n_min=1` and `n_max=1`. So `k=2`.
//
// The problem constraints `nums[i] <= 10` are crucial. The primes to consider are 2, 3, 5, 7.
//
// Final conclusion seems to be:
// A subarray `arr` is product-equivalent IF AND ONLY IF for every prime `p` (2, 3, 5, 7), at most two numbers in `arr` have `p` as a prime factor.
//
// Example: [2, 3, 4, 5, 6]
// Subarray [2,3,6]:
// 2 = 2^1
// 3 = 3^1
// 6 = 2^1 * 3^1
// Prime 2: factors in {2, 6}. Two numbers.
// Prime 3: factors in {3, 6}. Two numbers.
// This subarray [2,3,6] should satisfy the condition. Let's check:
// prod = 2 * 3 * 6 = 36
// gcd(2,3,6) = 1
// lcm(2,3,6) = lcm(2,6) = 6
// 36 != 1 * 6.
// My deduction is still flawed.
//
// Let's go back to the definition: `prod(arr) == lcm(arr) * gcd(arr)`
// This equality holds iff for every prime `p`, `sum(v_p(a_i)) = min(v_p(a_i)) + max(v_p(a_i))`.
//
// Let's consider the numbers themselves.
// If all numbers are 1, `[1, 1, ..., 1]`. Product=1, GCD=1, LCM=1. 1 == 1*1. Always true. Longest subarray of 1s.
//
// What if a subarray has numbers `a, b, c, ...` such that for any pair `x, y`, either `x` divides `y` or `y` divides `x`?
// E.g., [2, 4, 8].
// prod = 2*4*8 = 64
// gcd(2,4,8) = 2
// lcm(2,4,8) = 8
// 64 != 8 * 2.
// This hierarchical divisibility is not sufficient.
//
// The most reliable approach is to iterate all subarrays and check the condition directly, assuming `long long` for intermediate products and LCMs.
// Given N <= 100 and nums[i] <= 10:
// Max possible LCM of numbers <= 10 is lcm(1,2,3,4,5,6,7,8,9,10) = lcm(2^3, 3^2, 5, 7) = 8 * 9 * 5 * 7 = 72 * 35 = 2520.
// This is very small.
// Max possible product for a subarray of length 100 with values 10 is 10^100, which overflows `long long`.
//
// However, for the condition `prod(arr) == lcm(arr) * gcd(arr)` to hold, the product cannot be arbitrarily large.
// If `lcm(arr) * gcd(arr)` is relatively small (like 2520 * max_val up to 10 if GCD is 10, i.e. ~25200), then the product `prod(arr)` must also be around this value.
// This means subarrays with many large numbers will quickly fail the condition if they have many distinct prime factors or high powers.
//
// Let's try the O(N^3) approach with GCD/LCM iterative calculation.
// Need `gcd` and `lcm` helper functions.
// `long long gcd(long long a, long long b)`
// `long long lcm(long long a, long long b)`
//
// Main loop:
// `max_len = 0`
// For `i` from 0 to N-1:
//   `current_gcd = nums[i]`
//   `current_lcm = nums[i]`
//   `current_prod = nums[i]` // This needs care if we want to avoid overflow.
//   // Alternative for product: We only care if prod == lcm * gcd.
//   // If current_lcm * current_gcd overflows or exceeds a threshold, and current_prod is already larger, it fails.
//   // A more robust way is to check the prime factorization exponents.
//   // But given constraints, perhaps direct calculation is fine.
//
// Let's analyze the maximum possible value for `lcm(arr) * gcd(arr)`.
// The numbers are <= 10. Primes involved: 2, 3, 5, 7.
// Max GCD is 10. Max LCM of numbers <= 10 is 2520.
// Max `lcm * gcd` could be around 2520 * 10 = 25200.
//
// If `prod` exceeds this value, it's likely to fail.
//
// Let's write a helper for GCD and LCM.
// `std::gcd` and `std::lcm` are available in C++17.
// If not, implement them.
//
// `long long gcd(long long a, long long b) { while (b) { a %= b; swap(a, b); } return a; }`
// `long long lcm(long long a, long long b) { if (a == 0 || b == 0) return 0; return (a / gcd(a, b)) * b; }`
//
// We will iterate `i` from 0 to N-1 (start of subarray).
// We will iterate `j` from `i` to N-1 (end of subarray).
// For each subarray `nums[i...j]`:
//   Calculate `g = gcd_of_subarray(nums, i, j)`
//   Calculate `l = lcm_of_subarray(nums, i, j)`
//   Calculate `p = product_of_subarray(nums, i, j)`
//   If `p == l * g`, update `max_len`.
//
// `gcd_of_subarray`:
// `g = nums[i]`
// for `k` from `i+1` to `j`: `g = gcd(g, nums[k])`
//
// `lcm_of_subarray`:
// `l = nums[i]`
// for `k` from `i+1` to `j`: `l = lcm(l, nums[k])`
//
// `product_of_subarray`:
// `p = 1`
// for `k` from `i` to `j`: `p *= nums[k]` // THIS WILL OVERFLOW.
//
// Problem with product overflow:
// If `nums[i]` are small, the product grows, but the condition `prod == lcm * gcd` requires the product to be NOT TOO LARGE.
// If `lcm(arr) * gcd(arr)` is at most ~25200, then `prod(arr)` must also be at most ~25200.
// So, if `prod_so_far` calculation overflows `long long`, it means it's already much larger than `lcm*gcd` (which is small).
// We can use this to our advantage.
//
// Iterative calculation for a fixed start `i`:
// `max_len = 0`
// `for i = 0 to N-1:`
//   `current_gcd = nums[i]`
//   `current_lcm = nums[i]`
//   `current_prod = 1` // Start with 1 for product.
//   `for j = i to N-1:`
//     // Update GCD, LCM, and Product for subarray nums[i...j]
//     `current_gcd = gcd(current_gcd, nums[j])`
//     `current_lcm = lcm(current_lcm, nums[j])`
//
//     // Check for product overflow. If current_prod * nums[j] would overflow,
//     // it means the product is already very large.
//     // The maximum possible value for lcm * gcd (for numbers <= 10) is relatively small.
//     // Max LCM is 2520. Max GCD is 10. So max lcm*gcd is around 25200.
//     // If current_prod * nums[j] would exceed a reasonable bound (say, slightly above 25200),
//     // we can stop extending this subarray because the product will be too large.
//     // A safe upper bound for comparison could be `2520 * 10 = 25200`.
//     // Let's use a slightly larger safe bound, e.g., 100000 to be very safe.
//     // Or check if current_prod > `LLONG_MAX / nums[j]`.
//     // If `nums[j] == 0`, this check is problematic. But nums[i] are positive.
//
//     // Instead of directly calculating product, let's reason about the condition.
//     // prod(arr) = PI(a_i)
//     // lcm(arr) * gcd(arr) = PI(p^max(v_p(a_i)) * p^min(v_p(a_i)))
//     // prod(arr) = PI(p^sum(v_p(a_i)))
//     // So we need sum(v_p(a_i)) = max(v_p(a_i)) + min(v_p(a_i)) for all primes p.
//
//     // This still leads to the prime factorization approach.
//     // Given N <= 100 and nums[i] <= 10.
//     // The number of primes is small (2, 3, 5, 7).
//     // For each subarray, we can compute the exponents for these primes.
//     // For a subarray `nums[i...j]`:
//     // `map<int, int> prime_counts[4]` // For primes 2, 3, 5, 7. Index 0 for 2, etc.
//     // `bool is_product_equivalent = true;`
//     // For `k` from `i` to `j`:
//     //   `num = nums[k]`
//     //   Iterate through primes {2, 3, 5, 7}:
//     //     `p`:
//     //     `exponent = 0`
//     //     `while (num > 0 && num % p == 0)`:
//     //       `exponent++`
//     //       `num /= p`
//     //     Update prime_counts for prime p with this exponent.
//     //
//     // After processing all numbers in subarray:
//     // For each prime `p`:
//     //   Get the list of exponents for `p` from `prime_counts`.
//     //   Check if `sum(exponents) == min(exponents) + max(exponents)`.
//     //   If not, `is_product_equivalent = false; break;`
//     //
//     // If `is_product_equivalent`, update `max_len`.
//
// This approach has complexity:
// Outer loops: O(N^2) for subarrays.
// Inside loop: For each number in the subarray (up to N numbers), factorize (small number of primes, constant time).
//   Total for one subarray: O(N * num_primes).
// Check condition for each prime: O(num_primes * k) where k is number of elements in subarray.
// Total: O(N^2 * N * num_primes) = O(N^3 * num_primes).
// Since num_primes is small (4), this is effectively O(N^3).
// This is efficient enough.
//
// Let's implement this prime factorization exponent counting approach.
// We need to map primes to indices: 2->0, 3->1, 5->2, 7->3.
// `vector<int> primes = {2, 3, 5, 7};`
// `vector<vector<int>> exponents_for_prime(4);` // stores exponents for each prime for current subarray.
//
// `for i = 0 to N-1:`
//   `exponents_for_prime[0].clear(); ... exponents_for_prime[3].clear();`
//   `for j = i to N-1:`
//     `num = nums[j]`
//     `for p_idx = 0 to 3:`
//       `p = primes[p_idx]`
//       `exponent = 0`
//       `temp_num = num` // use a temporary to not modify original num if needed later
//       `while (temp_num > 0 && temp_num % p == 0)`:
//         `exponent++`
//         `temp_num /= p`
//       `exponents_for_prime[p_idx].push_back(exponent);`
//
//     // Now check the condition for exponents_for_prime
//     `bool ok = true;`
//     `for p_idx = 0 to 3:`
//       `vector<int>& current_exponents = exponents_for_prime[p_idx];`
//       // Need to handle empty current_exponents if subarray is empty, but here j>=i, so not empty.
//       `if (current_exponents.empty()) continue;` // Should not happen for j>=i
//
//       `int min_e = current_exponents[0];`
//       `int max_e = current_exponents[0];`
//       `long long sum_e = 0;` // Use long long for sum just in case, though with N=100 and max exponent for 2,3,5,7 is small.
//
//       `for (int e : current_exponents):`
//         `sum_e += e;`
//         `min_e = min(min_e, e);`
//         `max_e = max(max_e, e);`
//
//       `if (sum_e != (long long)min_e + max_e):` // Cast max_e to long long for safety
//         `ok = false;`
//         `break;`
//
//     `if (ok):`
//       `max_len = max(max_len, j - i + 1);`
//
// The `exponents_for_prime` needs to be cleared and repopulated correctly for each `j`.
// A better structure:
// `for i = 0 to N-1:`
//   `vector<vector<int>> current_prime_exponents(4);` // exponents for primes {2,3,5,7} for subarray nums[i...j]
//   `for j = i to N-1:`
//     `num = nums[j]`
//     `for p_idx = 0 to 3:`
//       `p = primes[p_idx]`
//       `exponent = 0`
//       `temp_num = num;`
//       `while (temp_num > 0 && temp_num % p == 0):`
//         `exponent++;`
//         `temp_num /= p;`
//       `current_prime_exponents[p_idx].push_back(exponent);`
//
//     // Now check condition for current_prime_exponents
//     `bool ok = true;`
//     `for p_idx = 0 to 3:`
//       `vector<int>& exponents = current_prime_exponents[p_idx];`
//       // If a prime is not a factor of ANY number in the subarray, its exponent list will be all zeros.
//       // min_e=0, max_e=0, sum_e=0. 0 == 0+0. This case is handled.
//       // If a prime is a factor of some numbers, list will not be all zeros.
//
//       `int min_e = 0, max_e = 0;`
//       `long long sum_e = 0;`
//       // To find min/max/sum efficiently, we can sort the exponents or iterate.
//       // Since N<=100, direct iteration is fine.
//       `for (int e : exponents):`
//         `sum_e += e;`
//
//       // Find min/max if list is not empty
//       `if (!exponents.empty()) {`
//         `min_e = exponents[0];`
//         `max_e = exponents[0];`
//         `for (size_t k = 1; k < exponents.size(); ++k) {`
//           `min_e = min(min_e, exponents[k]);`
//           `max_e = max(max_e, exponents[k]);`
//         `}`
//       `}` else { // This case should not happen as j>=i implies at least one element
//          continue;
//       }`
//
//       `if (sum_e != (long long)min_e + max_e) {`
//         `ok = false;`
//         `break;`
//       `}`
//
//     `if (ok) {`
//       `max_len = max(max_len, j - i + 1);`
//     `}`
//
// The maximum exponent of prime 2 in numbers <= 10 is 3 (for 8).
// The maximum exponent of prime 3 is 2 (for 9).
// The maximum exponent of prime 5 is 1 (for 5, 10).
// The maximum exponent of prime 7 is 1 (for 7).
// So `max_e` is small (max 3). `sum_e` is at most `N * max_e = 100 * 3 = 300`.
// `long long` for `sum_e` and comparison is safe.
//
// Time Complexity: O(N^2 * P * N_factor), where P is number of primes (4), N_factor is time to get exponents (small constant). So O(N^3).
// Space Complexity: O(N * P) for storing exponents for one subarray. O(N).

#include <vector>
#include <numeric> // For std::gcd, std::lcm (C++17)
#include <algorithm> // For std::min, std::max
#include <iostream> // For debugging, remove for final submission

// Helper function to calculate GCD of two numbers
// Using std::gcd from <numeric> since C++17
// If using an older standard, you'd implement Euclidean algorithm:
/*
long long gcd(long long a, long long b) {
    while (b) {
        a %= b;
        std::swap(a, b);
    }
    return a;
}
*/

// Helper function to calculate LCM of two numbers
// Using std::lcm from <numeric> since C++17
// If using an older standard, you'd implement:
/*
long long lcm(long long a, long long b) {
    if (a == 0 || b == 0) return 0;
    // Be careful of overflow before division if a*b is large
    // A safer way for positive a, b: (a / gcd(a, b)) * b
    return (a / std::gcd(a, b)) * b;
}
*/

class Solution {
public:
    int longestSubarray(std::vector<int>& nums) {
        int n = nums.size();
        int max_len = 0;

        // The primes we care about for numbers up to 10 are 2, 3, 5, 7.
        std::vector<int> primes = {2, 3, 5, 7};

        // Iterate over all possible start points of a subarray
        for (int i = 0; i < n; ++i) {
            // This vector of vectors will store the exponents for each prime (2, 3, 5, 7)
            // for the current subarray nums[i...j].
            // exponents_for_prime[0] stores exponents for prime 2, [1] for 3, etc.
            std::vector<std::vector<int>> current_prime_exponents(primes.size());

            // Iterate over all possible end points of a subarray, starting from i
            for (int j = i; j < n; ++j) {
                int current_num = nums[j];

                // Calculate the exponents of primes {2, 3, 5, 7} for the current number nums[j]
                for (size_t p_idx = 0; p_idx < primes.size(); ++p_idx) {
                    int p = primes[p_idx];
                    int exponent = 0;
                    int temp_num = current_num; // Use a temporary to avoid modifying current_num

                    // Count how many times prime p divides temp_num
                    while (temp_num > 0 && temp_num % p == 0) {
                        exponent++;
                        temp_num /= p;
                    }
                    // Add this exponent to the list for the current prime for the subarray nums[i...j]
                    current_prime_exponents[p_idx].push_back(exponent);
                }

                // Now, check if the subarray nums[i...j] is product equivalent.
                // This condition holds if and only if for every prime `p`,
                // the sum of the exponents of `p` in the factorization of all numbers in the subarray
                // equals the minimum exponent of `p` plus the maximum exponent of `p`.
                bool is_product_equivalent = true;

                for (size_t p_idx = 0; p_idx < primes.size(); ++p_idx) {
                    const std::vector<int>& exponents = current_prime_exponents[p_idx];

                    // If this prime does not appear in any number in the subarray, its exponents list
                    // will be all zeros. In this case, min=0, max=0, sum=0, which satisfies the condition.
                    // So we only need to process if the list is not empty. (It won't be empty here since j>=i)

                    int min_e = 0;
                    int max_e = 0;
                    long long sum_e = 0; // Use long long for sum for safety, though small numbers here.

                    // Calculate sum, min, and max of exponents for the current prime
                    if (!exponents.empty()) {
                        min_e = exponents[0];
                        max_e = exponents[0];
                        sum_e = 0; // Reset sum_e

                        for (int e : exponents) {
                            sum_e += e;
                            min_e = std::min(min_e, e);
                            max_e = std::max(max_e, e);
                        }
                    } else {
                        // This case should ideally not be reached because j >= i, so there's at least one number.
                        // If somehow an empty list occurs, it implies no number contributed, so sum=0, min=0, max=0.
                        // This is implicitly handled by default values if the loop doesn't run.
                        // However, for robustness, let's ensure it's handled.
                        // A prime will always have at least one exponent entry (possibly 0) if the subarray is non-empty.
                        // For an empty subarray (which we don't consider here as j>=i), sum=0, min=?, max=?
                        // If exponents list is empty, it means no numbers were processed for this prime (which is impossible here).
                        // If a prime is not a factor of any number, the exponent list would be all 0s.
                        // e.g., for prime 7 in [2,3,4,5,6], exponents would be [0,0,0,0,0].
                        // min=0, max=0, sum=0. 0 == 0+0. OK.
                        // So, if exponents is empty, it's an error state for our logic here.
                        // For safety, if it were empty, we'd imply sum=0, min=0, max=0.
                         continue; // Should not happen for j>=i.
                    }

                    // Check the condition: sum of exponents == min exponent + max exponent
                    // Cast to long long for comparison to avoid issues if sum_e is large, though with constraints, it's not strictly necessary.
                    if (sum_e != static_cast<long long>(min_e) + max_e) {
                        is_product_equivalent = false; // Condition failed for this prime
                        break; // No need to check other primes for this subarray
                    }
                }

                // If the condition held for all primes, the subarray is product equivalent
                if (is_product_equivalent) {
                    // Update the maximum length found so far
                    max_len = std::max(max_len, j - i + 1);
                }
            }
        }

        return max_len;
    }
};
```