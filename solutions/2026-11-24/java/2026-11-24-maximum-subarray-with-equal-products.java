```java
// Problem: Maximum Subarray With Equal Products
// Link: https://leetcode.com/problems/maximum-subarray-with-equal-products/
//
// Problem Summary:
// Find the length of the longest subarray where the product of its elements
// is equal to the least common multiple (LCM) multiplied by the greatest
// common divisor (GCD) of its elements.
//
// Approach Explanation:
// The condition prod(arr) == lcm(arr) * gcd(arr) is a known property that holds
// true for any set of positive integers if and only if for every prime factor p,
// the maximum power of p dividing any element in the set is at most 1.
// This simplifies to checking if all elements in the subarray are either 1 or distinct primes.
// Since the constraints on nums[i] are small (1 <= nums[i] <= 10), the only possible
// prime factors are 2, 3, 5, and 7.
//
// Therefore, a subarray is product equivalent if and only if:
// 1. All elements are 1.
// 2. All elements are distinct primes (2, 3, 5, 7).
// 3. A combination of 1s and distinct primes (2, 3, 5, 7).
//
// The constraint nums[i] <= 10 means that any number greater than 7 (i.e., 8, 9, 10)
// will break the product equivalent property. For example, if a subarray contains 4 (2*2),
// the power of 2 in its prime factorization is more than 1, violating the condition.
// Similarly, 6 (2*3) would be fine if 2 and 3 appear only once in the entire subarray's
// prime factorization. However, the property prod(arr) == lcm(arr) * gcd(arr) implies
// that for any prime p, the highest power of p dividing any element must be at most 1,
// and importantly, for any prime p, the number of elements divisible by p must be at most 1,
// *unless* the elements are 1. A simpler way to think about it for small numbers is:
//
// If a subarray contains a number like 4, 6, 8, 9, 10, it will likely fail the condition.
// Specifically, if any number in the subarray has a prime factor raised to a power greater than 1,
// or if two numbers share a common prime factor (and neither is 1), it might fail.
//
// The core insight for `prod(arr) == lcm(arr) * gcd(arr)` is equivalent to:
// For every prime `p`, let `v_p(x)` be the exponent of `p` in the prime factorization of `x`.
// The condition is equivalent to: `sum(v_p(x) for x in arr) == max(v_p(x) for x in arr) + min(v_p(x) for x in arr)` for all primes `p`.
// For positive integers, `min(v_p(x) for x in arr)` is 0 if `p` doesn't divide any element.
// If `p` divides at least one element, `min(v_p(x) for x in arr)` is at least 1.
//
// This condition `sum(v_p(x)) == max(v_p(x)) + min(v_p(x))` for all primes `p` implies that:
// - For any prime `p`, at most two numbers in `arr` can be divisible by `p`.
// - If exactly two numbers are divisible by `p`, say `a` and `b`, then `v_p(a) = v_p(b) = 1`.
// - If only one number is divisible by `p`, say `a`, then `v_p(a) = 1`.
// - If no number is divisible by `p`, `v_p` terms are 0.
//
// This means for each prime `p`, at most one number in the subarray can have `p` as a factor with exponent > 1,
// and at most two numbers can have `p` as a factor with exponent 1.
//
// Given `nums[i] <= 10`, the primes we care about are 2, 3, 5, 7.
// The numbers involved are 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.
//
// Numbers with prime factor powers > 1: 4 (2^2), 8 (2^3), 9 (3^2).
// Numbers with multiple distinct prime factors: 6 (2*3), 10 (2*5).
//
// If a subarray contains 4, 8, or 9, the condition is violated because the max power of 2 or 3 is > 1.
// If a subarray contains 6 and 10, it has factors 2, 3, 2, 5. The prime 2 appears in two numbers. This is allowed if exponents are 1.
//
// The crucial simplification comes from `nums[i] <= 10`.
// The only way for `prod(arr) == lcm(arr) * gcd(arr)` to hold is if for every prime `p`:
// - The maximum exponent of `p` dividing any element is 1 (i.e., no squares or higher powers of primes).
// - The count of numbers divisible by `p` is at most 2. If it's 2, say `a` and `b`, then `v_p(a) = v_p(b) = 1`.
//
// This means a product-equivalent subarray can only contain:
// - Ones.
// - Distinct primes from {2, 3, 5, 7}.
// - Numbers whose prime factors are all distinct and appear with exponent 1.
//   The numbers from 1 to 10 are:
//   1: ok
//   2: prime, ok
//   3: prime, ok
//   4 = 2*2: NOT ok (prime 2 has exponent 2)
//   5: prime, ok
//   6 = 2*3: ok if 2 and 3 don't appear in other numbers' prime factors (beyond exponent 1)
//   7: prime, ok
//   8 = 2*2*2: NOT ok (prime 2 has exponent 3)
//   9 = 3*3: NOT ok (prime 3 has exponent 2)
//   10 = 2*5: ok if 2 and 5 don't appear in other numbers' prime factors (beyond exponent 1)
//
// So, a subarray is product-equivalent if it does *not* contain:
// - 4, 8, 9 (numbers with prime factors raised to power > 1).
// - Any number that would cause a prime factor to appear with exponent > 1 when combined with other numbers.
//
// The core property of `prod(arr) == lcm(arr) * gcd(arr)` for positive integers is that for every prime `p`, the set of exponents `{v_p(x) | x in arr}` must be ` {0, 0, ..., 0}` or ` {0, 0, ..., 0, 1}` or ` {0, 0, ..., 0, 1, 1}`.
// This means:
// 1. At most one element can be divisible by `p^k` for `k >= 1`. (No squares like 4, 9, or higher powers)
// 2. At most two elements can be divisible by `p` (if `p` is a prime factor).
//
// Considering `nums[i] <= 10`:
// Numbers that violate condition 1: 4, 8, 9. If any of these are in a subarray, it's not product-equivalent.
// So, we only need to consider subarrays formed by elements from {1, 2, 3, 5, 6, 7, 10}.
//
// Now consider condition 2 for primes 2, 3, 5, 7:
//
// Prime 2: Numbers divisible by 2 are {2, 6, 10}.
// If a subarray contains {2, 6}, both are divisible by 2. `v_2(2)=1`, `v_2(6)=1`. This is fine.
// If a subarray contains {2, 10}, both are divisible by 2. `v_2(2)=1`, `v_2(10)=1`. This is fine.
// If a subarray contains {6, 10}, both are divisible by 2. `v_2(6)=1`, `v_2(10)=1`. This is fine.
// If a subarray contains {2, 6, 10}, three numbers divisible by 2. This would violate condition 2.
// So, a product-equivalent subarray can contain at most two numbers from {2, 6, 10}.
//
// Prime 3: Numbers divisible by 3 are {3, 6}.
// If a subarray contains {3, 6}, both are divisible by 3. `v_3(3)=1`, `v_3(6)=1`. Fine.
// If a subarray contains {3, 6, ...}, and another number divisible by 3 appears, it fails.
//
// Prime 5: Numbers divisible by 5 are {5, 10}.
// If a subarray contains {5, 10}, both are divisible by 5. `v_5(5)=1`, `v_5(10)=1`. Fine.
//
// Prime 7: Only {7}.
//
// Combining these: A subarray is product-equivalent if it only contains elements from {1, 2, 3, 5, 6, 7, 10} AND for each prime (2, 3, 5, 7), at most two elements in the subarray are divisible by that prime.
//
// This is still a bit complex to check directly for every subarray.
//
// A simpler perspective:
// The condition `prod(arr) == lcm(arr) * gcd(arr)` is equivalent to saying that for every prime `p`, if `p` divides any element in `arr`, then the set of exponents `{v_p(x) | x in arr}` is a subset of `{0, 1}`.
// This means no element can have a prime factor raised to a power greater than 1.
// So, numbers like 4, 8, 9 are forbidden.
//
// The remaining numbers are {1, 2, 3, 5, 6, 7, 10}.
// Now consider multiple numbers.
// If `arr` contains `a` and `b`, and `p` divides both `a` and `b`.
// Then `v_p(a) = 1` and `v_p(b) = 1`.
// The condition `sum(v_p(x)) == max(v_p(x)) + min(v_p(x))` becomes `1 + 1 == 1 + 1`, which is true.
//
// The problem arises when `p` divides more than two numbers.
// e.g., in {2, 6, 10}, prime 2 divides all three. `v_2(2)=1, v_2(6)=1, v_2(10)=1`.
// Sum of exponents of 2 = 1+1+1 = 3.
// Max exponent of 2 = 1. Min exponent of 2 = 1.
// 3 != 1 + 1. So {2, 6, 10} is NOT product-equivalent.
//
// This means for each prime `p`, at most two numbers in the subarray can be divisible by `p`.
//
// This property implies that any product-equivalent subarray can only contain numbers that are:
// 1. Ones.
// 2. Distinct primes from {2, 3, 5, 7}.
// 3. Products of distinct primes where each prime factor appears only once across the entire subarray.
//
// The actual key insight, given the small constraints on `nums[i] <= 10`, is that
// the condition `prod(arr) == lcm(arr) * gcd(arr)` is violated if any number in the subarray has a prime factor with an exponent greater than 1.
// The numbers from 1 to 10 that have prime factors with exponents > 1 are:
// 4 (2^2), 8 (2^3), 9 (3^2).
//
// So, any product-equivalent subarray cannot contain 4, 8, or 9.
// This means we can effectively treat these numbers as "breakers" of product-equivalent subarrays.
//
// The problem then reduces to finding the longest contiguous subarray that does NOT contain 4, 8, or 9.
// This is a standard "sliding window" or "two pointers" problem to find the longest subarray without certain characters/elements.
//
// We can iterate through the array. If we encounter a 4, 8, or 9, it signifies the end of a potential product-equivalent subarray. We then restart counting from the element after the problematic one.
//
// Algorithm:
// 1. Initialize `maxLength = 0` and `currentLength = 0`.
// 2. Iterate through the `nums` array using a pointer `i`.
// 3. For each element `nums[i]`:
//    a. If `nums[i]` is 4, 8, or 9:
//       i. Update `maxLength = max(maxLength, currentLength)`.
//       ii. Reset `currentLength = 0`.
//    b. If `nums[i]` is NOT 4, 8, or 9:
//       i. Increment `currentLength`.
// 4. After the loop finishes, there might be a valid subarray ending at the last element. Update `maxLength = max(maxLength, currentLength)`.
// 5. Return `maxLength`.
//
// Example 1: nums = [1,2,1,2,1,1,1]
// i=0, nums[0]=1. currentLength=1.
// i=1, nums[1]=2. currentLength=2.
// i=2, nums[2]=1. currentLength=3.
// i=3, nums[3]=2. currentLength=4.
// i=4, nums[4]=1. currentLength=5.
// i=5, nums[5]=1. currentLength=6.
// i=6, nums[6]=1. currentLength=7.
// End of loop. maxLength = max(0, 7) = 7.
// Wait, the example output is 5. What did I miss?
//
// Example 1 Explanation:
// The longest product equivalent subarray is [1, 2, 1, 1, 1], where prod([1, 2, 1, 1, 1]) = 2, gcd([1, 2, 1, 1, 1]) = 1, and lcm([1, 2, 1, 1, 1]) = 2.
//
// The problem statement: "prod(arr) == lcm(arr) * gcd(arr)"
// This property is ONLY true if for every prime `p`, the number of elements divisible by `p` is at most 1, UNLESS the element is 1.
// OR if for every prime `p`, the maximum exponent of `p` in any number is 1, AND for each prime `p`, at most TWO numbers are divisible by `p`.
//
// Let's re-evaluate the property `prod(arr) == lcm(arr) * gcd(arr)`.
// This property holds if and only if for every prime `p`, the multiset of exponents of `p` in the prime factorization of the elements of `arr` is of the form `{0, 0, ..., 0}` or `{0, 0, ..., 0, 1}` or `{0, 0, ..., 0, 1, 1}`.
//
// This means:
// 1. No element can have a prime factor raised to a power greater than 1. (This eliminates 4, 8, 9).
// 2. For any prime `p`, at most two elements in the subarray can be divisible by `p`.
//
// Let's check example 1 again: `nums = [1,2,1,2,1,1,1]`
// Subarrays:
// [1]: prod=1, gcd=1, lcm=1. 1 == 1*1. OK. Len 1.
// [1,2]: prod=2, gcd=1, lcm=2. 2 == 2*1. OK. Len 2.
// [1,2,1]: prod=2, gcd=1, lcm=2. 2 == 2*1. OK. Len 3.
// [1,2,1,2]: prod=4, gcd=1, lcm=2. 4 != 2*1. NOT OK.
//     Why is [1,2,1,2] not OK?
//     Elements: 1, 2, 1, 2.
//     Prime 2: v_2(1)=0, v_2(2)=1, v_2(1)=0, v_2(2)=1.
//     Exponents of 2: {0, 1, 0, 1}. Multiset is {0, 0, 1, 1}. This is allowed.
//     Max exponent of 2 = 1. Min exponent of 2 = 0. Sum of exponents = 2.
//     lcm(1,2,1,2) = 2. gcd(1,2,1,2) = 1. prod(1,2,1,2) = 4.
//     prod = 4. lcm*gcd = 2 * 1 = 2. 4 != 2.
//
// My understanding of the property `prod(arr) == lcm(arr) * gcd(arr)` might be wrong or too simplified.
//
// Let's use the original property directly: `prod(arr) == lcm(arr) * gcd(arr)`.
// This implies `prod(arr) / gcd(arr) == lcm(arr)`.
//
// Consider prime factorization.
// Let `arr = [a1, a2, ..., ak]`.
// `gcd(arr) = p1^min(v_p1(a_i)) * p2^min(v_p2(a_i)) * ...`
// `lcm(arr) = p1^max(v_p1(a_i)) * p2^max(v_p2(a_i)) * ...`
// `prod(arr) = p1^sum(v_p1(a_i)) * p2^sum(v_p2(a_i)) * ...`
//
// The condition becomes:
// `p1^sum(v_p1(a_i)) * p2^sum(v_p2(a_i)) * ...  ==  (p1^max(v_p1(a_i)) * ...) * (p1^min(v_p1(a_i)) * ...)`
//
// For each prime `p`:
// `sum(v_p(a_i)) == max(v_p(a_i)) + min(v_p(a_i))`
//
// This is the fundamental condition.
//
// Let's re-check Example 1: `nums = [1,2,1,2,1,1,1]`
// Subarray `[1,2,1,1,1]` (length 5)
// Elements: {1, 2, 1, 1, 1}
// Prime 2: v_2(1)=0, v_2(2)=1. Exponents of 2: {0, 1, 0, 0, 0}.
//   Sum of exponents of 2 = 1.
//   Max exponent of 2 = 1.
//   Min exponent of 2 = 0.
//   Check: 1 == 1 + 0. True.
// Prime 3, 5, 7...: all exponents are 0. 0 == 0 + 0. True.
// So `[1,2,1,1,1]` is product-equivalent. Length 5.
//
// Subarray `[1,2,1,2]` (length 4)
// Elements: {1, 2, 1, 2}
// Prime 2: v_2(1)=0, v_2(2)=1. Exponents of 2: {0, 1, 0, 1}.
//   Sum of exponents of 2 = 2.
//   Max exponent of 2 = 1.
//   Min exponent of 2 = 0.
//   Check: 2 == 1 + 0. False.
// So `[1,2,1,2]` is NOT product-equivalent.
//
// The condition `sum(v_p(a_i)) == max(v_p(a_i)) + min(v_p(a_i))`
//
// This condition implies that for each prime `p`:
// - At most one element can have `v_p(a_i) > 1`. (This is the standard rule: no squares etc.)
// - And if `v_p(a_i) = 1` for some `i`, then either:
//    - Only one element `a_j` has `v_p(a_j)=1` and all others have `v_p=0`. (Sum=1, Max=1, Min=0 -> 1 == 1+0)
//    - Exactly two elements `a_j, a_k` have `v_p(a_j)=1, v_p(a_k)=1` and others have `v_p=0`. (Sum=2, Max=1, Min=0 -> 2 == 1+0 which is FALSE!)
//
// My understanding of the property derivation is flawed.
// The property `prod(arr) == lcm(arr) * gcd(arr)` is TRUE if and only if for every prime `p`, the number of elements in `arr` divisible by `p` is AT MOST 1.
//
// Let's re-verify this crucial property.
// If for every prime `p`, at most one element `a_i` is divisible by `p` (i.e., `v_p(a_i) > 0` for at most one `i`).
// Then for any prime `p`:
// - If no `a_i` is divisible by `p`, then `v_p(a_i)=0` for all `i`. Sum=0, Max=0, Min=0. 0 == 0+0. OK.
// - If exactly one `a_k` is divisible by `p`, then `v_p(a_k) = E > 0`, and `v_p(a_i)=0` for all `i != k`.
//   Sum of exponents = E. Max exponent = E. Min exponent = 0.
//   Condition: E == E + 0. This is TRUE for any E.
//
// So, the condition `prod(arr) == lcm(arr) * gcd(arr)` is equivalent to:
// For every prime `p`, at most ONE element in `arr` is divisible by `p`.
//
// Let's check example 1: `nums = [1,2,1,2,1,1,1]`
// Subarray `[1,2,1,1,1]` (length 5)
// Elements: {1, 2, 1, 1, 1}
// Prime 2: Only '2' is divisible by 2. Count = 1. OK.
// Other primes (3, 5, 7): No elements divisible by them. Count = 0. OK.
// So `[1,2,1,1,1]` is product-equivalent. Length 5.
//
// Subarray `[1,2,1,2]` (length 4)
// Elements: {1, 2, 1, 2}
// Prime 2: '2' is divisible by 2. Another '2' is divisible by 2. Count = 2.
// This violates the "at most one element divisible by p" rule for prime 2.
// So `[1,2,1,2]` is NOT product-equivalent.
//
// This simplified rule seems to work for example 1.
//
// What numbers can we have?
// If `p` is a prime, only one number in the subarray can be a multiple of `p`.
// Numbers from 1 to 10:
// 1: Not divisible by any prime > 1. OK.
// 2: Divisible by 2. Can only appear once if 2 is the only multiple of 2.
// 3: Divisible by 3. Can only appear once if 3 is the only multiple of 3.
// 4: Divisible by 2. If 4 is in subarray, no other multiple of 2 (2, 6, 8, 10) can be.
// 5: Divisible by 5.
// 6: Divisible by 2 and 3. If 6 is in subarray, no other multiple of 2 (2, 4, 8, 10) and no other multiple of 3 (3, 9) can be.
// 7: Divisible by 7.
// 8: Divisible by 2.
// 9: Divisible by 3.
// 10: Divisible by 2 and 5.
//
// So, a subarray is product-equivalent if:
// For every prime `p` (2, 3, 5, 7), at most one element in the subarray is divisible by `p`.
//
// This is equivalent to:
// For every prime `p`, and every power `p^k` (k>=1), at most one element in the subarray is divisible by `p^k`.
//
// Let's check the numbers from 1 to 10 again:
//
// Numbers divisible by primes:
// Primes themselves: 2, 3, 5, 7. Each divisible by only one prime.
// Multiples of 2: 2, 4, 6, 8, 10.
// Multiples of 3: 3, 6, 9.
// Multiples of 5: 5, 10.
// Multiples of 7: 7.
//
// If a subarray contains '2' and '4', it's invalid (both divisible by 2).
// If a subarray contains '2' and '6', it's invalid (both divisible by 2).
// If a subarray contains '3' and '6', it's invalid (both divisible by 3).
// If a subarray contains '6' and '10', it's invalid (both divisible by 2).
//
// The only numbers that don't share a prime factor with any other number (from 1 to 10, excluding 1) are primes themselves.
//
// Consider the set of "prime factors" each number from 1 to 10 is "responsible" for.
// 1: {}
// 2: {2}
// 3: {3}
// 4: {2}  (4 = 2*2, still primarily a multiple of 2)
// 5: {5}
// 6: {2, 3} (6 = 2*3)
// 7: {7}
// 8: {2}  (8 = 2*2*2)
// 9: {3}  (9 = 3*3)
// 10: {2, 5} (10 = 2*5)
//
// The rule is: for any prime `p`, at most one number in the subarray can have `p` in its "prime factor set".
//
// Example 1: `nums = [1,2,1,2,1,1,1]`
// Subarray `[1,2,1,1,1]`
// Numbers and their prime factor sets: {1: {}, 2: {2}, 1: {}, 1: {}, 1: {}}
// Prime 2: Only '2' has {2}. Count = 1. OK.
// Other primes: Count = 0. OK.
// Valid. Length 5.
//
// Subarray `[1,2,1,2]`
// Numbers and their prime factor sets: {1: {}, 2: {2}, 1: {}, 2: {2}}
// Prime 2: '2' has {2}. Another '2' has {2}. Count = 2. Invalid.
//
// This rule seems solid now.
//
// So, we need to find the longest subarray where for every prime `p` (2, 3, 5, 7), at most one number in the subarray is divisible by `p`.
//
// This means if a subarray contains `x`, it cannot contain any other number `y` such that `gcd(x, y) > 1` AND `x > 1` and `y > 1`.
// (Because `gcd(x,y) > 1` implies they share a prime factor `p`. If `x` and `y` are both > 1 and share `p`, they are both divisible by `p`, violating the rule).
//
// This is not quite right. The rule is about `p` itself, not `gcd(x, y)`.
// Example: [2, 3]. gcd(2,3)=1. Prime 2 divides 2 (once). Prime 3 divides 3 (once). Valid.
// Example: [6]. 6 is divisible by 2 AND 3. This would be invalid under the new rule IF the rule was "at most one number in the subarray can have *any* prime factor `p`".
//
// The property `prod(arr) == lcm(arr) * gcd(arr)` is satisfied IF AND ONLY IF for every prime `p`, the set `{v_p(x) | x in arr}` contains at most two non-zero elements, and if it contains two, they must be 1.
// This means for any prime `p`, at most one number can be divisible by `p^2` or higher powers, AND at most two numbers can be divisible by `p`.
//
// This is still confusing and error-prone to implement directly.
//
// Let's revisit the simplest possible interpretation that fits Example 1.
// The interpretation that "for every prime `p`, at most ONE element in the subarray is divisible by `p`" seemed to work.
//
// Let's try to prove this: `prod(arr) == lcm(arr) * gcd(arr)` <=> for every prime `p`, at most one element in `arr` is divisible by `p`.
//
// Proof of =>: Assume for some prime `p`, two elements `a, b` in `arr` are divisible by `p`. Let `a = p * a'` and `b = p * b'`.
// Then `v_p(a) >= 1` and `v_p(b) >= 1`.
// If `v_p(a) = 1` and `v_p(b) = 1`:
//   Sum of `v_p` = `1 + 1 + sum(v_p(other elements))`
//   Max of `v_p` = `max(1, max(v_p(other elements)))`
//   Min of `v_p` = `min(1, min(v_p(other elements)))`
// If all other `v_p(other elements) = 0`, then Sum=2, Max=1, Min=0.
// Condition `Sum == Max + Min` becomes `2 == 1 + 0`, which is FALSE.
//
// So, it seems the rule is indeed:
// For every prime `p`, at most ONE element in the subarray `arr` is divisible by `p`.
//
// This rule applies to primes 2, 3, 5, 7.
//
// Numbers and their smallest prime factor:
// 1: None
// 2: 2
// 3: 3
// 4: 2
// 5: 5
// 6: 2 (also 3)
// 7: 7
// 8: 2
// 9: 3
// 10: 2 (also 5)
//
// This means a subarray can contain at most one number divisible by 2, at most one number divisible by 3, etc.
//
// This is equivalent to saying that no two numbers `x, y` in the subarray (where `x, y > 1`) can share a prime factor.
// i.e., for all `x, y` in `arr` with `x > 1, y > 1, x != y`, we must have `gcd(x, y) == 1`.
//
// Let's test this hypothesis on the examples.
//
// Example 1: `nums = [1,2,1,2,1,1,1]`
// Subarray `[1,2,1,1,1]` (len 5). Elements > 1: {2}. `gcd` condition is vacuously true. Valid.
// Subarray `[1,2,1,2]` (len 4). Elements > 1: {2, 2}. If we consider unique elements > 1: {2}. Still vacuously true if we consider *distinct* elements. But the problem refers to subarrays, so duplicates matter.
//
// If the rule is "for every prime `p`, at most one element in the subarray is divisible by `p`".
//
// Subarray `[1,2,1,2]`
// Elements: 1, 2, 1, 2
// Prime 2: '2' is divisible by 2. Another '2' is divisible by 2. Two elements divisible by 2. Invalid.
//
// This interpretation is consistent.
//
// So, we need to find the longest subarray where for each prime `p` (2, 3, 5, 7), there is at most one element in the subarray that is a multiple of `p`.
//
// This means a subarray cannot contain two or more numbers from the set:
// Multiples of 2: {2, 4, 6, 8, 10}
// Multiples of 3: {3, 6, 9}
// Multiples of 5: {5, 10}
// Multiples of 7: {7}
//
// This is a sliding window problem.
// We need to maintain counts of how many numbers in the current window are divisible by 2, 3, 5, 7.
//
// State for sliding window: `counts[4]` where `counts[i]` stores the number of elements in window divisible by `primes[i]`.
// `primes = {2, 3, 5, 7}`.
//
// Algorithm using sliding window:
// 1. Initialize `maxLength = 0`, `left = 0`.
// 2. `counts = {0, 0, 0, 0}` for primes {2, 3, 5, 7}.
// 3. Iterate `right` from 0 to `nums.length - 1`:
//    a. Get `num = nums[right]`.
//    b. Determine which primes from {2, 3, 5, 7} divide `num`.
//       For each `p` in {2, 3, 5, 7}: if `num % p == 0`, increment `counts[indexOf(p)]`.
//    c. **Shrink window if invalid:** While any count in `counts` is greater than 1:
//       i. Get `leftNum = nums[left]`.
//       ii. Determine which primes from {2, 3, 5, 7} divide `leftNum`.
//       iii. For each `p` in {2, 3, 5, 7}: if `leftNum % p == 0`, decrement `counts[indexOf(p)]`.
//       iv. Increment `left`.
//    d. **Update maxLength:** `maxLength = max(maxLength, right - left + 1)`.
// 4. Return `maxLength`.
//
// Example 1: `nums = [1,2,1,2,1,1,1]`
// primes = [2, 3, 5, 7]
//
// right=0, num=1: counts={0,0,0,0}. Window OK. maxLength = max(0, 0-0+1) = 1.
// right=1, num=2: Divisible by 2. counts={1,0,0,0}. Window OK. maxLength = max(1, 1-0+1) = 2.
// right=2, num=1: counts={1,0,0,0}. Window OK. maxLength = max(2, 2-0+1) = 3.
// right=3, num=2: Divisible by 2. counts={2,0,0,0}. Count for 2 is 2. Invalid.
//   Shrink: left=0, leftNum=1. counts={2,0,0,0}. left becomes 1.
//   Shrink: left=1, leftNum=2. Divisible by 2. counts={1,0,0,0}. left becomes 2. Window is now OK.
//   maxLength = max(3, 3-2+1) = 3. (current window [1,2] length 2. wait. indices are 2,3. num is 1,2. so [1,2])
//   Let's trace carefully.
//
// Initial: maxLength = 0, left = 0, counts = [0, 0, 0, 0]
//
// right = 0, num = 1:
//   1 % 2 != 0, 1 % 3 != 0, 1 % 5 != 0, 1 % 7 != 0. counts = [0, 0, 0, 0].
//   Window is valid. maxLength = max(0, 0-0+1) = 1.
//
// right = 1, num = 2:
//   2 % 2 == 0. counts = [1, 0, 0, 0].
//   Window is valid. maxLength = max(1, 1-0+1) = 2.
//
// right = 2, num = 1:
//   counts = [1, 0, 0, 0].
//   Window is valid. maxLength = max(2, 2-0+1) = 3.
//
// right = 3, num = 2:
//   2 % 2 == 0. counts = [2, 0, 0, 0].
//   Count for 2 is 2. Invalid.
//   Shrink:
//     left = 0, leftNum = nums[0] = 1.
//     1 is not divisible by 2, 3, 5, 7. counts remains [2, 0, 0, 0].
//     left becomes 1.
//   Shrink again:
//     left = 1, leftNum = nums[1] = 2.
//     2 % 2 == 0. Decrement count for 2. counts = [1, 0, 0, 0].
//     left becomes 2.
//   Window is now valid. Current window indices: [2, 3]. Elements: [1, 2]. Length = 3-2+1 = 2.
//   maxLength = max(3, 2) = 3.
//
// right = 4, num = 1:
//   counts = [1, 0, 0, 0].
//   Window is valid. Current window indices: [2, 4]. Elements: [1, 2, 1]. Length = 4-2+1 = 3.
//   maxLength = max(3, 3) = 3.
//
// right = 5, num = 1:
//   counts = [1, 0, 0, 0].
//   Window is valid. Current window indices: [2, 5]. Elements: [1, 2, 1, 1]. Length = 5-2+1 = 4.
//   maxLength = max(3, 4) = 4.
//
// right = 6, num = 1:
//   counts = [1, 0, 0, 0].
//   Window is valid. Current window indices: [2, 6]. Elements: [1, 2, 1, 1, 1]. Length = 6-2+1 = 5.
//   maxLength = max(4, 5) = 5.
//
// End of loop. Return maxLength = 5. This matches Example 1.
//
// Example 2: `nums = [2,3,4,5,6]`
// primes = [2, 3, 5, 7]
//
// Initial: maxLength = 0, left = 0, counts = [0, 0, 0, 0]
//
// right = 0, num = 2:
//   2 % 2 == 0. counts = [1, 0, 0, 0]. Valid. maxLength = 1.
//
// right = 1, num = 3:
//   3 % 3 == 0. counts = [1, 1, 0, 0]. Valid. maxLength = 2.
//
// right = 2, num = 4:
//   4 % 2 == 0. counts = [2, 1, 0, 0]. Invalid (count for 2 is 2).
//   Shrink:
//     left = 0, leftNum = nums[0] = 2.
//     2 % 2 == 0. Decrement count for 2. counts = [1, 1, 0, 0].
//     left becomes 1.
//   Window is valid. Current window indices: [1, 2]. Elements: [3, 4]. Length = 2-1+1 = 2.
//   maxLength = max(2, 2) = 2.
//
// right = 3, num = 5:
//   5 % 5 == 0. counts = [1, 1, 1, 0]. Valid.
//   Current window indices: [1, 3]. Elements: [3, 4, 5]. Length = 3-1+1 = 3.
//   maxLength = max(2, 3) = 3.
//
// right = 4, num = 6:
//   6 % 2 == 0, 6 % 3 == 0. counts = [1+1, 1+1, 1, 0] = [2, 2, 1, 0]. Invalid (count for 2 is 2, count for 3 is 2).
//   Shrink:
//     left = 1, leftNum = nums[1] = 3.
//     3 % 3 == 0. Decrement count for 3. counts = [2, 1, 1, 0].
//     left becomes 2.
//   Shrink again:
//     left = 2, leftNum = nums[2] = 4.
//     4 % 2 == 0. Decrement count for 2. counts = [1, 1, 1, 0].
//     left becomes 3.
//   Window is valid. Current window indices: [3, 4]. Elements: [5, 6]. Length = 4-3+1 = 2.
//   maxLength = max(3, 2) = 3.
//
// End of loop. Return maxLength = 3. This matches Example 2.
//
// The crucial insight seems to be the condition:
// "For every prime p, at most one element in the subarray is divisible by p."
// This is equivalent to checking that for primes 2, 3, 5, 7, the count of elements divisible by each prime within the sliding window is never more than 1.
//
// Time Complexity:
// The `right` pointer iterates through the array once (N times).
// The `left` pointer also iterates through the array at most once.
// For each element, we do a constant number of operations (modulo checks for 4 primes, increment/decrement counts).
// Therefore, the time complexity is O(N), where N is the length of `nums`.
//
// Space Complexity:
// We use a constant amount of extra space for the `counts` array (size 4) and a few variables.
// Therefore, the space complexity is O(1).
//
// Implementation details:
// Store primes {2, 3, 5, 7} in an array.
// Use an index map or direct check for counts.
// Helper function to get indices of primes that divide a number might be useful.
// Or just inline checks.

class Solution {
    // Helper function to check if a number is divisible by any of the target primes (2, 3, 5, 7).
    // Returns an array where index i is 1 if nums[idx] is divisible by primes[i], 0 otherwise.
    private int[] getPrimeDivisors(int num) {
        int[] divisors = new int[4]; // For primes 2, 3, 5, 7
        if (num % 2 == 0) divisors[0] = 1;
        if (num % 3 == 0) divisors[1] = 1;
        if (num % 5 == 0) divisors[2] = 1;
        if (num % 7 == 0) divisors[3] = 1;
        return divisors;
    }

    public int maxProductEquivSubarray(int[] nums) {
        // The condition prod(arr) == lcm(arr) * gcd(arr) holds if and only if
        // for every prime p, at most one element in the subarray arr is divisible by p.
        // The primes relevant to nums[i] <= 10 are 2, 3, 5, 7.

        int maxLength = 0;
        int left = 0;
        // counts[0] for prime 2, counts[1] for prime 3, counts[2] for prime 5, counts[3] for prime 7.
        int[] counts = new int[4];
        int[] primes = {2, 3, 5, 7};

        for (int right = 0; right < nums.length; right++) {
            int currentNum = nums[right];
            int[] currentDivisors = getPrimeDivisors(currentNum);

            // Add the current number's prime divisibility contributions to the window counts
            for (int i = 0; i < primes.length; i++) {
                if (currentDivisors[i] == 1) {
                    counts[i]++;
                }
            }

            // Shrink the window from the left if any prime count exceeds 1
            // This ensures that for each prime, at most one number in the window is divisible by it.
            while (true) {
                boolean allCountsValid = true;
                for (int count : counts) {
                    if (count > 1) {
                        allCountsValid = false;
                        break;
                    }
                }

                if (allCountsValid) {
                    break; // Window is valid, no need to shrink further from this `right` position
                }

                // If window is invalid, remove the leftmost element and update counts
                int leftNum = nums[left];
                int[] leftDivisors = getPrimeDivisors(leftNum);

                for (int i = 0; i < primes.length; i++) {
                    if (leftDivisors[i] == 1) {
                        counts[i]--;
                    }
                }
                left++; // Move the left pointer to shrink the window
            }

            // The current window (from `left` to `right` inclusive) is product-equivalent.
            // Update the maximum length found so far.
            maxLength = Math.max(maxLength, right - left + 1);
        }

        return maxLength;
    }
}
```