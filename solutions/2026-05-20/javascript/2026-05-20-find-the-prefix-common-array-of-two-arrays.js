// Problem: Find the Prefix Common Array of Two Arrays
// Link: https://leetcode.com/problems/find-the-prefix-common-array-of-two-arrays/
//
// Approach:
// We can iterate through the arrays A and B simultaneously. For each index `i`,
// we need to count how many numbers from the prefixes A[0...i] and B[0...i] are common.
// To efficiently check for common elements, we can use two hash sets (or Sets in JavaScript).
// `setA` will store elements encountered so far in A, and `setB` will store elements
// encountered so far in B.
// For each index `i`:
// 1. Add A[i] to `setA`.
// 2. Add B[i] to `setB`.
// 3. Iterate from `j = 0` to `i` and check if A[j] is present in `setB`. If it is,
//    increment a counter for the current index `i`.
// 4. Store this count in the result array `C` at index `i`.
//
// A more optimized approach within the loop:
// Instead of re-iterating from `j = 0` to `i` for each `i`, we can maintain the
// count of common elements incrementally.
// Let `count` be the number of common elements up to index `i-1`.
// When we consider index `i`:
// 1. Add A[i] to `setA`.
// 2. Add B[i] to `setB`.
// 3. Check if A[i] is present in `setB`. If it is, increment `count`.
// 4. Check if B[i] is present in `setA`. If it is, increment `count`.
// Note: If A[i] == B[i], it will be counted twice by the above checks.
// A simpler way is to maintain the count of elements seen in A and B.
// Let `seenA` be a Set of elements seen in A.
// Let `seenB` be a Set of elements seen in B.
// Let `commonCount` be the current number of common elements.
// For each index `i`:
//   1. Add A[i] to `seenA`.
//   2. Add B[i] to `seenB`.
//   3. If A[i] is in `seenB`, increment `commonCount`.
//   4. If B[i] is in `seenA`, increment `commonCount`.
//   5. If A[i] and B[i] are the same, we have double counted. We need to adjust.
//
// A cleaner approach using two hash sets and checking presence:
// For each index `i`:
//   1. Add A[i] to `setA`.
//   2. Add B[i] to `setB`.
//   3. Initialize `currentCommon = 0`.
//   4. If A[i] is in `setB`, increment `currentCommon`.
//   5. If B[i] is in `setA`, increment `currentCommon`.
//   6. If A[i] == B[i], it means this number is in both prefixes. The previous two steps
//      would have incremented `currentCommon` by 1 for A[i] and 1 for B[i] if they were
//      distinct and both present in the other's prefix.
//      If A[i] is in `setB`, and B[i] is in `setA`, and A[i] == B[i], then A[i] is common.
//      The `currentCommon` variable will correctly reflect the count of elements that are
//      present in *both* sets at the current prefix.
//
// Let's refine the logic for `commonCount` update:
// Initialize `commonCount = 0`.
// Initialize `setA = new Set()`, `setB = new Set()`.
// For `i` from 0 to `n-1`:
//   1. Add A[i] to `setA`.
//   2. Add B[i] to `setB`.
//   3. If `setA.has(B[i])`, increment `commonCount`.
//   4. If `setB.has(A[i])`, increment `commonCount`.
//   5. If `A[i] === B[i]`, then this element is common. However, if A[i] was already
//      in `setB` and B[i] was already in `setA` before this iteration, then `commonCount`
//      would have been incremented for both.
//      The key is to count elements present in *both* sets at index `i`.
//      A simpler way is to count elements that are present in *both* `setA` and `setB`
//      after adding A[i] and B[i].
//
// Final optimized approach:
// Initialize `commonCount = 0`.
// Initialize `seenA = new Set()`.
// Initialize `seenB = new Set()`.
// Initialize `result = []`.
// For `i` from 0 to `n-1`:
//   1. Add `A[i]` to `seenA`.
//   2. Add `B[i]` to `seenB`.
//   3. If `seenA.has(A[i])` AND `seenB.has(A[i])`, AND `A[i]` was not counted as common in the *previous* step.
//      This is getting complicated.
//
// Let's rethink the count: C[i] is the count of numbers present at or before index i in BOTH A and B.
//
// Example 1: A = [1,3,2,4], B = [3,1,2,4]
// i = 0: A[0]=1, B[0]=3. seenA={1}, seenB={3}. Common = 0. C[0]=0.
// i = 1: A[1]=3, B[1]=1. seenA={1,3}, seenB={3,1}.
//        Numbers in A[0..1]: {1,3}. Numbers in B[0..1]: {3,1}.
//        Common numbers in these sets: {1,3}. Count = 2. C[1]=2.
// i = 2: A[2]=2, B[2]=2. seenA={1,3,2}, seenB={3,1,2}.
//        Numbers in A[0..2]: {1,3,2}. Numbers in B[0..2]: {3,1,2}.
//        Common numbers: {1,2,3}. Count = 3. C[2]=3.
// i = 3: A[3]=4, B[3]=4. seenA={1,3,2,4}, seenB={3,1,2,4}.
//        Numbers in A[0..3]: {1,3,2,4}. Numbers in B[0..3]: {3,1,2,4}.
//        Common numbers: {1,2,3,4}. Count = 4. C[3]=4.
//
// The `commonCount` can be maintained by observing the new elements added.
// Initialize `commonCount = 0`.
// Initialize `seenA = new Set()`.
// Initialize `seenB = new Set()`.
// Initialize `result = []`.
// For `i` from 0 to `n-1`:
//   1. Add `A[i]` to `seenA`.
//   2. Add `B[i]` to `seenB`.
//   3. Now, `seenA` contains all elements from `A[0...i]` and `seenB` contains all from `B[0...i]`.
//   4. We need to count how many elements are in *both* `seenA` and `seenB`.
//      Instead of recounting, we can update `commonCount`.
//      When `A[i]` is added to `seenA`: if `seenB` already contains `A[i]`, it means `A[i]`
//      is now common up to index `i`.
//      When `B[i]` is added to `seenB`: if `seenA` already contains `B[i]`, it means `B[i]`
//      is now common up to index `i`.
//      Let's track the count of elements that are present in *both* sets at step `i`.
//
// Refined logic for `commonCount` update:
// Initialize `commonCount = 0`.
// Initialize `seenA = new Set()`.
// Initialize `seenB = new Set()`.
// Initialize `result = []`.
// For `i` from 0 to `n-1`:
//   1. Get `numA = A[i]` and `numB = B[i]`.
//   2. Add `numA` to `seenA`.
//   3. Add `numB` to `seenB`.
//   4. If `seenA.has(numB)`, it means `numB` is now present in both prefixes.
//      This implies `numB` is a newly common element.
//      However, if `numA === numB`, and both were added in this step, we need to be careful.
//      Let's consider the elements being added.
//      If `numA` is added to `seenA`, and `numB` is in `seenB` (from previous steps or this step),
//      then `numA` contributes to the common count.
//      If `numB` is added to `seenB`, and `numA` is in `seenA` (from previous steps or this step),
//      then `numB` contributes to the common count.
//
// The key insight might be that if `A[i]` is already in `setB` (elements seen in B up to `i-1`),
// then `A[i]` becomes a common element. Similarly, if `B[i]` is already in `setA` (elements
// seen in A up to `i-1`), then `B[i]` becomes a common element.
//
// Let `count` be the number of common elements up to index `i`.
// Initialize `count = 0`.
// Initialize `setA = new Set()`.
// Initialize `setB = new Set()`.
// Initialize `result = []`.
// For `i` from 0 to `n-1`:
//   1. `numA = A[i]`.
//   2. `numB = B[i]`.
//   3. If `setA.has(numA)`, it means `numA` has appeared before in A. This doesn't
//      directly help with commonality between A and B.
//
// Consider the state *after* adding `A[i]` and `B[i]`.
// Let `common = 0`.
// Let `setA = new Set()`, `setB = new Set()`.
// For `i` from 0 to `n-1`:
//   `numA = A[i]`.
//   `numB = B[i]`.
//   `setA.add(numA)`.
//   `setB.add(numB)`.
//   // Now, `setA` has `A[0..i]` and `setB` has `B[0..i]`.
//   // We need to count elements in `setA` that are also in `setB`.
//   // This would require iterating through `setA` and checking `setB.has()`, which is O(N) for each i, leading to O(N^2).
//
// Let's use the `commonCount` update idea more carefully.
// At step `i`, `C[i]` is the count of numbers in `A[0...i]` that are also in `B[0...i]`.
// Let `count` be the running count of common elements.
// Initialize `count = 0`.
// Initialize `seenA = new Set()`.
// Initialize `seenB = new Set()`.
// For `i` from 0 to `n-1`:
//   `numA = A[i]`.
//   `numB = B[i]`.
//   // Check if `numA` is already in `seenB`. If yes, it means `numA` is common.
//   // Check if `numB` is already in `seenA`. If yes, it means `numB` is common.
//   // If `numA === numB`, it's definitely common.
//
//   // Case 1: `numA` is added to `seenA`. If `numA` was already in `seenB`, it becomes common.
//   // Case 2: `numB` is added to `seenB`. If `numB` was already in `seenA`, it becomes common.
//   // If `numA === numB`, and both are added in this step, then if `numA` was already seen in `seenB`,
//   // it's counted. If `numB` was already seen in `seenA`, it's counted.
//   // If `numA === numB` and neither was seen before, then after adding, `seenA.has(numB)` is true
//   // and `seenB.has(numA)` is true.
//
//   // Let's track contribution:
//   let contributionA = 0;
//   let contributionB = 0;
//
//   if (seenB.has(numA)) {
//       // numA is now present in A[0..i] AND it was present in B[0..i-1] (or B[i] if numA === numB)
//       // So, numA is a common element for the prefix up to i.
//       contributionA = 1;
//   }
//   if (seenA.has(numB)) {
//       // numB is now present in B[0..i] AND it was present in A[0..i-1] (or A[i] if numA === numB)
//       // So, numB is a common element for the prefix up to i.
//       contributionB = 1;
//   }
//
//   // If numA === numB, we might double count if we simply add contributionA and contributionB.
//   // Example: A=[1], B=[1]. i=0. numA=1, numB=1. seenA={}, seenB={}.
//   // seenB.has(1) is false. seenA.has(1) is false. count = 0.
//   // seenA.add(1), seenB.add(1).
//   // Correct count should be 1.
//
//   // The most straightforward way is to check presence in the *other* set.
//   // When we add A[i] to seenA, if B[i] is in seenA, then A[i] (which is B[i]) is common.
//   // When we add B[i] to seenB, if A[i] is in seenB, then B[i] (which is A[i]) is common.
//
//   // Let's use a variable `common_elements_count`.
//   // `common_elements_count` at step `i` is the number of elements in `setA_i` and `setB_i`.
//   // Where `setA_i = {A[0], ..., A[i]}` and `setB_i = {B[0], ..., B[i]}`.
//
//   // Initialize `current_common_count = 0`.
//   // Initialize `seenA = new Set()`.
//   // Initialize `seenB = new Set()`.
//   // For `i` from 0 to `n-1`:
//   //   `numA = A[i]`.
//   //   `numB = B[i]`.
//   //
//   //   // Add to sets FIRST.
//   //   seenA.add(numA);
//   //   seenB.add(numB);
//   //
//   //   // Now, check for the NEWLY common elements due to this step.
//   //   // If numA is present in seenB, it's common.
//   //   // If numB is present in seenA, it's common.
//   //   // If numA == numB, it's common IF it's present in both sets.
//   //
//   //   // Let's check for each element *in the current prefix* if it is common.
//   //   // This leads back to O(N^2).
//   //
//   //   // The key is to realize that `C[i]` is the count of numbers present in `A[0...i]` AND `B[0...i]`.
//   //   // If `A[i]` is present in `B[0...i]`, it contributes to the count.
//   //   // If `B[i]` is present in `A[0...i]`, it contributes to the count.
//   //
//   //   // Consider the elements `A[i]` and `B[i]` individually.
//   //   // If `A[i]` is found in `seenB` (elements seen in B up to this point), then `A[i]` is a common number.
//   //   // If `B[i]` is found in `seenA` (elements seen in A up to this point), then `B[i]` is a common number.
//   //   // If `A[i] === B[i]`, and this number is common, it should only be counted once.
//   //
//   //   let common_count_increment = 0;
//   //
//   //   if (seenB.has(numA)) {
//   //       common_count_increment++;
//   //   }
//   //   if (seenA.has(numB)) {
//   //       common_count_increment++;
//   //   }
//   //   // If numA == numB, and it was already in seenB (meaning numB was in seenA previously too),
//   //   // then common_count_increment would be 2 if we are not careful.
//   //   // Example: A=[1,2], B=[1,2].
//   //   // i=0: A[0]=1, B[0]=1. seenA={}, seenB={}.
//   //   // seenB.has(1) is false. seenA.has(1) is false. common_count_increment = 0.
//   //   // After adding: seenA={1}, seenB={1}.
//   //   // C[0] should be 1.
//   //   // This means we need to check AFTER adding to the sets.
//
//   // Let's use the commonCount directly.
//   // Initialize `commonCount = 0`.
//   // Initialize `setA = new Set()`.
//   // Initialize `setB = new Set()`.
//   // For `i` from 0 to `n-1`:
//   //   `numA = A[i]`.
//   //   `numB = B[i]`.
//   //
//   //   // Add the current elements to their respective sets.
//   //   setA.add(numA);
//   //   setB.add(numB);
//   //
//   //   // Now, check for the NEWLY formed commonality based on the added elements.
//   //   // If `numA` is now present in `setB` (meaning it's in `B[0..i]`), and it wasn't counted yet.
//   //   // If `numB` is now present in `setA` (meaning it's in `A[0..i]`), and it wasn't counted yet.
//   //
//   //   // The simplest way is: if `A[i]` is found in `setB`, it's a common element.
//   //   // If `B[i]` is found in `setA`, it's a common element.
//   //   // If `A[i] === B[i]`, we need to ensure it's only counted once.
//   //
//   //   let increment = 0;
//   //   if (setB.has(numA)) { // If A[i] is present in B[0...i]
//   //       increment++;
//   //   }
//   //   if (setA.has(numB)) { // If B[i] is present in A[0...i]
//   //       increment++;
//   //   }
//   //   // If numA === numB, and it's common, it would have been added to both sets.
//   //   // So, setB.has(numA) will be true, and setA.has(numB) will be true.
//   //   // This means `increment` will be 2 if numA === numB.
//   //   // So, if `numA === numB`, we only add 1.
//   //   // If `numA !== numB`, we add `increment`.
//   //   // This is still not quite right.
//
//   // Let's look at the *elements* that are common.
//   // `C[i]` = | { x | x in A[0..i] AND x in B[0..i] } |
//
//   // Correct Logic:
//   // We maintain two sets, `seenA` and `seenB`.
//   // `commonCount` is the number of elements *currently* in both sets.
//   // For each index `i`:
//   // 1. Add `A[i]` to `seenA`.
//   // 2. Add `B[i]` to `seenB`.
//   // 3. If `A[i]` was already in `seenB` *before* adding `B[i]`, then `A[i]` is a common element.
//   // 4. If `B[i]` was already in `seenA` *before* adding `A[i]`, then `B[i]` is a common element.
//   //
//   // This suggests that we should check *before* adding.
//
//   // Let `commonCount = 0`.
//   // Let `seenA = new Set()`.
//   // Let `seenB = new Set()`.
//   // For `i` from 0 to `n-1`:
//   //   `numA = A[i]`.
//   //   `numB = B[i]`.
//   //
//   //   // If `numA` is present in `seenB`, it means `numA` is a common element for the prefix up to `i`.
//   //   // Since `numA` is now definitely in `seenA` (we're about to add it or it was already there),
//   //   // and it was already in `seenB`, it's common.
//   //   if (seenB.has(numA)) {
//   //       commonCount++;
//   //   }
//   //   // If `numB` is present in `seenA`, it means `numB` is a common element for the prefix up to `i`.
//   //   // Since `numB` is now definitely in `seenB` (we're about to add it or it was already there),
//   //   // and it was already in `seenA`, it's common.
//   //   if (seenA.has(numB)) {
//   //       commonCount++;
//   //   }
//   //
//   //   // If `numA === numB`, and it was already in `seenB`, then `seenA.has(numB)` will also be true
//   //   // if `numA` was in `seenA`.
//   //   // This approach counts elements that become common *due to the current step*.
//   //   // If numA === numB, and numA was NOT in seenB, and numB was NOT in seenA, then after adding,
//   //   // numA IS in seenB (because B[i] is numB, which is numA) and numB IS in seenA (because A[i] is numA, which is numB).
//   //   // So commonCount gets incremented by 2.
//   //   // We need to subtract 1 if `numA === numB`.
//   //
//   //   if (numA === numB) {
//   //       // If numA was in seenB, we incremented count. If numB was in seenA, we incremented count.
//   //       // If numA === numB, and it was already common, it would have been counted in a previous step.
//   //       // The issue is when numA === numB, and they are *newly* common in this step.
//   //       // Example: A=[1], B=[1]. i=0. numA=1, numB=1. seenA={}, seenB={}.
//   //       // seenB.has(1) is false. seenA.has(1) is false. commonCount=0.
//   //       // Now add them: seenA={1}, seenB={1}. C[0] should be 1.
//   //       // My logic above gives 0.
//
//   // The most reliable way is to check AFTER adding.
//   // `commonCount` = | `seenA` INTERSECTION `seenB` |
//   //
//   // Initialize `commonCount = 0`.
//   // Initialize `seenA = new Set()`.
//   // Initialize `seenB = new Set()`.
//   // For `i` from 0 to `n-1`:
//   //   `numA = A[i]`.
//   //   `numB = B[i]`.
//   //
//   //   // Add the current elements to their respective sets.
//   //   seenA.add(numA);
//   //   seenB.add(numB);
//   //
//   //   // Now, `seenA` has `A[0..i]` and `seenB` has `B[0..i]`.
//   //   // We need to count the elements that are present in *both* sets.
//   //   // This implies iterating and counting.
//   //
//   //   // Alternative perspective:
//   //   // When `A[i]` is added to `seenA`, if `A[i]` is already in `seenB`, then `A[i]` is common.
//   //   // When `B[i]` is added to `seenB`, if `B[i]` is already in `seenA`, then `B[i]` is common.
//   //
//   //   // Let `commonCount` track the number of common elements up to `i-1`.
//   //   // For step `i`:
//   //   // Check `A[i]`: If `A[i]` is in `seenB` (elements from `B[0...i-1]`), it becomes common.
//   //   // Check `B[i]`: If `B[i]` is in `seenA` (elements from `A[0...i-1]`), it becomes common.
//   //   // If `A[i] === B[i]`:
//   //   //   If `A[i]` was already in `seenB`, then it's common.
//   //   //   If `B[i]` was already in `seenA`, then it's common.
//   //   //   If `A[i] === B[i]` and it was NOT in `seenB` and NOT in `seenA`, then AFTER adding, it IS in both.
//   //   //   This means we need to be careful about double counting.
//
//   // Let's use the example again: A = [1,3,2,4], B = [3,1,2,4]
//   // Initialize `count = 0`.
//   // Initialize `setA = new Set()`, `setB = new Set()`.
//   //
//   // i = 0: A[0]=1, B[0]=3.
//   //   Add 1 to setA. seenA = {1}.
//   //   Add 3 to setB. seenB = {3}.
//   //   Check: seenB.has(1)? No.
//   //          seenA.has(3)? No.
//   //   count remains 0. result.push(0).
//   //
//   // i = 1: A[1]=3, B[1]=1.
//   //   Add 3 to setA. seenA = {1, 3}.
//   //   Add 1 to setB. seenB = {3, 1}.
//   //   Check: seenB.has(3)? Yes. count++. count = 1.
//   //          seenA.has(1)? Yes. count++. count = 2.
//   //   result.push(2).
//   //
//   // i = 2: A[2]=2, B[2]=2.
//   //   Add 2 to setA. seenA = {1, 3, 2}.
//   //   Add 2 to setB. seenB = {3, 1, 2}.
//   //   Check: seenB.has(2)? Yes. count++. count = 3.
//   //          seenA.has(2)? Yes. count++. count = 4.
//   //   BUT A[2] === B[2] (which is 2). We've double counted this element.
//   //   If A[i] === B[i], and it's common, it should only add 1 to the count.
//   //   So, if A[i] === B[i], and seenB.has(A[i]) is true, we increment count. Then we add A[i] to seenA.
//   //   Then we check if B[i] (which is A[i]) is in seenA. Yes. We increment again. This is wrong.
//
//   // Final, correct and simple approach:
//   // We want `C[i]` = |{ `A[k]` | `0 <= k <= i` AND `A[k]` is in `B[0...i]` }|
//   // We can iterate and add elements to `seenA` and `seenB`.
//   // Then, we can efficiently count the intersection.
//   // `count = 0`
//   // `seenA = new Set()`
//   // `seenB = new Set()`
//   // For `i` from 0 to `n-1`:
//   //   `seenA.add(A[i])`
//   //   `seenB.add(B[i])`
//   //   // Now `seenA` contains `A[0...i]` and `seenB` contains `B[0...i]`.
//   //   // The number of common elements up to `i` is the size of the intersection.
//   //   // This intersection check is what needs to be efficient.
//   //   // If we iterate `seenA` and check `seenB`, it's O(N) for each `i`, total O(N^2).
//   //   // Given N <= 50, O(N^2) is acceptable.
//   //   `current_common_count = 0`
//   //   For each `element` in `seenA`:
//   //     If `seenB.has(element)`:
//   //       `current_common_count++`
//   //   `result.push(current_common_count)`
//   //
//   // Let's trace this O(N^2) approach:
//   // A = [1,3,2,4], B = [3,1,2,4]
//   // n = 4
//   // result = []
//   //
//   // i = 0: A[0]=1, B[0]=3
//   //   seenA = {1}
//   //   seenB = {3}
//   //   Iterate seenA:
//   //     element = 1. seenB.has(1)? No.
//   //   current_common_count = 0. result.push(0).
//   //
//   // i = 1: A[1]=3, B[1]=1
//   //   seenA = {1, 3}
//   //   seenB = {3, 1}
//   //   Iterate seenA:
//   //     element = 1. seenB.has(1)? Yes. current_common_count = 1.
//   //     element = 3. seenB.has(3)? Yes. current_common_count = 2.
//   //   result.push(2).
//   //
//   // i = 2: A[2]=2, B[2]=2
//   //   seenA = {1, 3, 2}
//   //   seenB = {3, 1, 2}
//   //   Iterate seenA:
//   //     element = 1. seenB.has(1)? Yes. current_common_count = 1.
//   //     element = 3. seenB.has(3)? Yes. current_common_count = 2.
//   //     element = 2. seenB.has(2)? Yes. current_common_count = 3.
//   //   result.push(3).
//   //
//   // i = 3: A[3]=4, B[3]=4
//   //   seenA = {1, 3, 2, 4}
//   //   seenB = {3, 1, 2, 4}
//   //   Iterate seenA:
//   //     element = 1. seenB.has(1)? Yes. current_common_count = 1.
//   //     element = 3. seenB.has(3)? Yes. current_common_count = 2.
//   //     element = 2. seenB.has(2)? Yes. current_common_count = 3.
//   //     element = 4. seenB.has(4)? Yes. current_common_count = 4.
//   //   result.push(4).
//   //
//   // Final result: [0, 2, 3, 4]. This works.
//
// Time Complexity:
// The outer loop runs `n` times (from `i = 0` to `n-1`).
// Inside the loop, adding elements to Sets is O(1) on average.
// The inner loop iterates through `seenA`. In the worst case, `seenA` can have up to `i+1` elements.
// So, for `i = n-1`, the inner loop iterates up to `n` times.
// Thus, the overall time complexity is O(n * n) = O(n^2).
// Given n <= 50, n^2 is at most 2500 operations per test case, which is very efficient.
//
// Space Complexity:
// We use two Sets, `seenA` and `seenB`. In the worst case, each set can store up to `n` elements.
// The `result` array also stores `n` elements.
// Therefore, the space complexity is O(n) for the sets and the result array.
//
/**
 * @param {number[]} A
 * @param {number[]} B
 * @return {number[]}
 */
var findPrefixCommonArray = function(A, B) {
    // n is the length of the input arrays.
    const n = A.length;
    // result array to store the prefix common counts.
    const result = [];
    // seenA will store elements encountered so far in array A.
    const seenA = new Set();
    // seenB will store elements encountered so far in array B.
    const seenB = new Set();

    // Iterate through the arrays from the beginning up to the end.
    for (let i = 0; i < n; i++) {
        // Add the current element from array A to seenA.
        seenA.add(A[i]);
        // Add the current element from array B to seenB.
        seenB.add(B[i]);

        // Initialize a counter for common elements at the current prefix.
        let currentCommonCount = 0;
        // Iterate through all elements seen in A up to index i.
        for (const element of seenA) {
            // If an element from seenA is also present in seenB,
            // it means this element is common to both prefixes A[0...i] and B[0...i].
            if (seenB.has(element)) {
                currentCommonCount++;
            }
        }
        // Add the count of common elements for the current prefix to the result array.
        result.push(currentCommonCount);
    }

    // Return the prefix common array.
    return result;
};
