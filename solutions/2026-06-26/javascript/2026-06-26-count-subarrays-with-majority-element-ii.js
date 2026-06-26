```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */

/*
Problem Summary:
Count the number of subarrays where a given target integer appears strictly more than half the time.

Link:
https://leetcode.com/problems/count-subarrays-with-majority-element-ii/

Approach:
The problem asks us to find subarrays where `target` is the majority element. A majority element in a subarray of length `k` must appear `m` times such that `m > k/2`. This inequality can be rewritten as `2*m > k`.

Let's consider a subarray from index `i` to `j` (inclusive). Let the number of occurrences of `target` in this subarray be `countTarget` and the number of occurrences of other elements be `countOther`. The length of the subarray is `k = j - i + 1`.
For `target` to be the majority element, we need `countTarget > (j - i + 1) / 2`, which is equivalent to `2 * countTarget > j - i + 1`.
Alternatively, we can rewrite this by considering the "score" of elements. Let's assign a score of +1 to `target` and -1 to any other element.
For a subarray `nums[i..j]`, let `score(i, j)` be the sum of scores of its elements.
The condition `2 * countTarget > countTarget + countOther` simplifies to `countTarget > countOther`.
This is equivalent to `countTarget - countOther > 0`.
Since `countTarget - countOther = score(i, j)`, the condition becomes `score(i, j) > 0`.

So, the problem reduces to finding the number of subarrays `nums[i..j]` such that the sum of scores (where `target` is +1 and others are -1) is strictly greater than 0.

We can use prefix sums to efficiently calculate the sum of scores for any subarray.
Let `prefixScore[k]` be the sum of scores for `nums[0..k-1]`.
Then, the score of `nums[i..j]` is `prefixScore[j+1] - prefixScore[i]`.
We need to find pairs `(i, j)` such that `prefixScore[j+1] - prefixScore[i] > 0`, or `prefixScore[j+1] > prefixScore[i]`.

We can iterate through the array `nums` and maintain the prefix scores. For each index `j`, we want to count how many previous indices `i` (where `i <= j`) satisfy `prefixScore[j+1] > prefixScore[i]`.

However, a naive iteration through all `i` for each `j` would be O(n^2).
We can optimize this using a data structure that can efficiently query the number of elements less than a given value. A Fenwick tree (Binary Indexed Tree) or a Segment Tree can be used for this.

The range of prefix scores can be large. If `nums.length` is up to 10^5, the prefix scores can range from -10^5 to +10^5. To use a Fenwick tree, we need to map these scores to a smaller, contiguous range of indices. This is called coordinate compression or discretization.

The distinct values of prefix scores will be at most `n + 1`. We can collect all prefix scores, sort them, and then map them to their ranks.

Algorithm:
1. Create a new array `scores` where `scores[k] = 1` if `nums[k] == target`, and `scores[k] = -1` otherwise.
2. Calculate the prefix scores: `prefixScores[0] = 0`, `prefixScores[k+1] = prefixScores[k] + scores[k]` for `k` from 0 to `n-1`.
3. Collect all unique prefix scores: `uniqueScores = Array.from(new Set(prefixScores))`.
4. Sort `uniqueScores`.
5. Create a mapping from each unique score to its rank (0-indexed position in `uniqueSortedScores`).
6. Initialize a Fenwick tree (BIT) of size `uniqueScores.length`. The BIT will store counts of how many times each rank of prefix score has been encountered so far.
7. Initialize `totalCount = 0`.
8. Iterate through `prefixScores` from `k = 0` to `n`:
    a. Get the current prefix score `currentScore = prefixScores[k]`.
    b. Find the rank of `currentScore` using the mapping: `currentRank = rankMap.get(currentScore)`.
    c. We want to find the number of previous prefix scores `prefixScores[i]` (where `i < k`) such that `prefixScores[k] > prefixScores[i]`. This means we need to sum the counts in the BIT for all ranks that are strictly less than `currentRank`. This can be done by querying the sum from index 0 up to `currentRank - 1` in the BIT. `countSmaller = bit.query(currentRank - 1)`.
    d. Add `countSmaller` to `totalCount`.
    e. Increment the count for `currentScore`'s rank in the BIT: `bit.update(currentRank, 1)`.
9. Return `totalCount`.

Fenwick Tree (BIT) Implementation:
- `update(index, val)`: Adds `val` to the element at `index` and propagates the change up the tree.
- `query(index)`: Returns the sum of elements from index 0 up to `index`.

Detailed steps for `query(index)`:
To get the sum up to `index` (inclusive in 0-based rank), we query the BIT for `index + 1` (in 1-based BIT indexing).
The sum up to rank `r` (0-indexed) requires querying BIT up to `r+1` (1-indexed).
So, `bit.query(currentRank - 1)` in the algorithm corresponds to querying the sum of ranks `0` to `currentRank - 1`. If the BIT uses 1-based indexing internally, this would be `bit.queryInternal(currentRank)`.

Let's refine the BIT usage:
The BIT will be of size `uniqueScores.length + 1` (for 1-based indexing).
When we process `prefixScores[k]`:
1. `currentScore = prefixScores[k]`
2. `currentRank = rankMap.get(currentScore)` (0-indexed rank)
3. We need to count previous `prefixScores[i]` such that `prefixScores[k] > prefixScores[i]`.
   This means we need to count previous prefix scores whose ranks are less than `currentRank`.
   So we query the BIT for the sum of counts from rank 0 to `currentRank - 1`.
   In a 1-based BIT, this query is `bit.query(currentRank)`.
   Let's call this `countSmaller`.
4. `totalCount += countSmaller`.
5. We have now seen `currentScore` with rank `currentRank`. We update the BIT at `currentRank + 1` (1-based index) by adding 1. `bit.update(currentRank + 1, 1)`.

Example walkthrough: nums = [1,2,2,3], target = 2
n = 4

scores: [-1, 1, 1, -1] (2 is target, others are not)

prefixScores:
k=0: prefixScores[0] = 0
k=1: prefixScores[1] = 0 + (-1) = -1
k=2: prefixScores[2] = -1 + 1 = 0
k=3: prefixScores[3] = 0 + 1 = 1
k=4: prefixScores[4] = 1 + (-1) = 0

prefixScores = [0, -1, 0, 1, 0]

Unique scores: {0, -1, 1}
Sorted unique scores: [-1, 0, 1]
Rank map:
-1 -> 0
0  -> 1
1  -> 2

BIT size: 3 + 1 = 4. Initialized to all zeros.
totalCount = 0

Iteration:

k = 0:
  currentScore = prefixScores[0] = 0
  currentRank = rankMap.get(0) = 1
  We need count of previous prefixScores whose rank < 1. This means rank 0.
  Query BIT for sum up to rank 0 (which is `currentRank` in 1-based BIT).
  `countSmaller = bit.query(1)` (sum of ranks 0) = 0.
  totalCount += 0. totalCount = 0.
  Update BIT at rank 1+1=2 (1-based index) by 1. BIT = [0, 0, 1, 0]

k = 1:
  currentScore = prefixScores[1] = -1
  currentRank = rankMap.get(-1) = 0
  We need count of previous prefixScores whose rank < 0. No such ranks.
  Query BIT for sum up to rank -1 (which is `currentRank` in 1-based BIT).
  `countSmaller = bit.query(0)` (sum of ranks < 0) = 0.
  totalCount += 0. totalCount = 0.
  Update BIT at rank 0+1=1 (1-based index) by 1. BIT = [0, 1, 1, 0]

k = 2:
  currentScore = prefixScores[2] = 0
  currentRank = rankMap.get(0) = 1
  We need count of previous prefixScores whose rank < 1. This means rank 0.
  Query BIT for sum up to rank 0 (which is `currentRank` in 1-based BIT).
  `countSmaller = bit.query(1)` (sum of ranks 0) = BIT[1] = 1.
  totalCount += 1. totalCount = 1. (This corresponds to subarray [2], score = 1 > 0)
  Update BIT at rank 1+1=2 (1-based index) by 1. BIT = [0, 1, 2, 0]

k = 3:
  currentScore = prefixScores[3] = 1
  currentRank = rankMap.get(1) = 2
  We need count of previous prefixScores whose rank < 2. This means ranks 0 and 1.
  Query BIT for sum up to rank 1 (which is `currentRank` in 1-based BIT).
  `countSmaller = bit.query(2)` (sum of ranks 0, 1) = BIT[1] + BIT[2] = 1 + 2 = 3.
  totalCount += 3. totalCount = 1 + 3 = 4. (These correspond to:
    - prefixScores[0]=0 (rank 1), 1 > 0 -> subarray [1,2,2] (score 1)
    - prefixScores[1]=-1 (rank 0), 1 > -1 -> subarray [2,2] (score 2)
    - prefixScores[2]=0 (rank 1), 1 > 0 -> subarray [2] (score 1)
  )
  Update BIT at rank 2+1=3 (1-based index) by 1. BIT = [0, 1, 2, 1]

k = 4:
  currentScore = prefixScores[4] = 0
  currentRank = rankMap.get(0) = 1
  We need count of previous prefixScores whose rank < 1. This means rank 0.
  Query BIT for sum up to rank 0 (which is `currentRank` in 1-based BIT).
  `countSmaller = bit.query(1)` (sum of ranks 0) = BIT[1] = 1.
  totalCount += 1. totalCount = 4 + 1 = 5. (This corresponds to:
    - prefixScores[1]=-1 (rank 0), 0 > -1 -> subarray [2,2,3] (score 0 - wait, score is -1 + 1 - 1 = -1. Ah, prefixScore[4]-prefixScore[1] = 0 - (-1) = 1. Yes, 1 > 0.)
  )
  Update BIT at rank 1+1=2 (1-based index) by 1. BIT = [0, 1, 3, 1]

Final totalCount = 5. This matches the example output.

Let's re-check the subarray scores calculation for the last step:
k=4, currentScore=prefixScores[4]=0, currentRank=1.
We need previous prefixScores[i] < currentScore.
Previous scores are [0, -1, 0, 1].
Indices i for prefixScores[i] < 0:
prefixScores[1] = -1. i=1.
Subarray nums[1..3] = [2, 2, 3].
Score = (1 for 2) + (1 for 2) + (-1 for 3) = 1.
Length = 3. 1 > 3/2 is false. 1 > 1.5 is false.
Ah, the condition is `countTarget > countOther`, which is `score > 0`.

Let's re-check the interpretation of prefix scores:
`prefixScores[j+1] - prefixScores[i]` is the sum of scores for `nums[i..j]`.
This is what we need. So `prefixScores[k]` in my loop is actually `prefixScores[j+1]` if we consider `j = k-1`.

Let's use indices more precisely.
We want to count pairs `(i, j)` such that `0 <= i <= j < n` and `score(i, j) > 0`.
`score(i, j) = prefixScore[j+1] - prefixScore[i]`.
So we need `prefixScore[j+1] > prefixScore[i]`.

Let `P` be the array of prefix scores, where `P[0] = 0` and `P[k+1] = P[k] + score(nums[k])` for `k` from 0 to `n-1`.
`P` has `n+1` elements: `P[0], P[1], ..., P[n]`.
We are looking for pairs `(i, j)` such that `0 <= i <= j < n`.
The relevant prefix scores are `P[i]` and `P[j+1]`.
We need `P[j+1] > P[i]` where `0 <= i <= j`. This implies `i <= j+1`.
So we are looking for pairs `(i', k')` from the `P` array such that `i' < k'` and `P[k'] > P[i']`.
Here `i'` corresponds to `i` and `k'` corresponds to `j+1`.

So, the iteration should be:
Iterate `k_prime` from 0 to `n`. `currentPrefixScore = P[k_prime]`.
We need to count previous `P[i_prime]` (where `i_prime < k_prime`) such that `P[k_prime] > P[i_prime]`.

This is exactly what the algorithm is doing.
Let's trace again with `P` array:
`nums = [1,2,2,3], target = 2`
`scores = [-1, 1, 1, -1]`
`P = [0, -1, 0, 1, 0]` (n+1 elements)

Unique scores: {-1, 0, 1}. Sorted: [-1, 0, 1]. Ranks: -1->0, 0->1, 1->2.
BIT size: 3+1 = 4. Initialized to [0,0,0,0].
`totalCount = 0`.

Loop `k` from 0 to `n` (i.e., 0 to 4):

k = 0: `currentPrefixScore = P[0] = 0`. `currentRank = 1`.
  Query BIT for sum up to rank `currentRank - 1 = 0`. `bit.query(1)` (sum of ranks 0). Result is 0.
  `totalCount += 0`. `totalCount = 0`.
  Update BIT at rank `currentRank + 1 = 2` by 1. BIT = [0, 0, 1, 0].

k = 1: `currentPrefixScore = P[1] = -1`. `currentRank = 0`.
  Query BIT for sum up to rank `currentRank - 1 = -1`. `bit.query(0)` (sum of ranks < 0). Result is 0.
  `totalCount += 0`. `totalCount = 0`.
  Update BIT at rank `currentRank + 1 = 1` by 1. BIT = [0, 1, 1, 0].

k = 2: `currentPrefixScore = P[2] = 0`. `currentRank = 1`.
  Query BIT for sum up to rank `currentRank - 1 = 0`. `bit.query(1)` (sum of ranks 0). Result is BIT[1] = 1.
  `totalCount += 1`. `totalCount = 1`. (This means `P[2] > P[i]` for one previous `i`. Which `i`? The one with rank 0. That's `P[1] = -1`. So `P[2] > P[1]`. `j+1=2`, `i=1`. Subarray `nums[1..1] = [2]`. Score = 1. Length = 1. 1 > 1/2. Yes.)

k = 3: `currentPrefixScore = P[3] = 1`. `currentRank = 2`.
  Query BIT for sum up to rank `currentRank - 1 = 1`. `bit.query(2)` (sum of ranks 0 and 1). Result is BIT[1] + BIT[2] = 1 + 1 = 2.
  `totalCount += 2`. `totalCount = 1 + 2 = 3`.
  Previous scores with ranks < 2 (i.e., ranks 0 and 1):
  - Rank 0: `P[1] = -1`. `i'=1`. `j+1=3` => `j=2`. Subarray `nums[1..2] = [2,2]`. Score = 1+1=2. Length=2. 2 > 2/2. Yes.
  - Rank 1: `P[0] = 0` or `P[2] = 0`.
    If `P[0]`: `i'=0`. `j+1=3` => `j=2`. Subarray `nums[0..2] = [1,2,2]`. Score = -1+1+1=1. Length=3. 1 > 3/2. No.
    Ah, the BIT stores counts of prefix scores encountered so far.
    When k=3, currentScore=P[3]=1. We query for previous scores smaller than 1.
    The scores encountered so far before k=3 are P[0]=0, P[1]=-1, P[2]=0.
    Ranks: 1, 0, 1.
    BIT state before update at k=3: [0, 1, 1, 0] (count for rank 0 is 1, count for rank 1 is 1, count for rank 2 is 0).
    Query for sum up to rank 1 (0-indexed): `bit.query(2)` (1-based index) = BIT[1] + BIT[2] = 1 + 1 = 2.
    The counts are:
    - Score -1 (rank 0): 1 occurrence (`P[1]`). `P[3] > P[1]` (1 > -1). Subarray `nums[1..2] = [2,2]`. Score 2. OK.
    - Score 0 (rank 1): 1 occurrence (`P[0]` or `P[2]`). Which one? The BIT counts how many times each rank appeared.
      The `bit.query(currentRank)` sums up counts for ranks `0` to `currentRank - 1`.
      At k=3, currentRank=2. We query for ranks 0 and 1.
      Rank 0 count is 1 (from P[1]).
      Rank 1 count is 1 (from P[0] OR P[2]... wait. The update step adds to the count of the *current* score's rank.
      Let's re-verify BIT update and query logic.

BIT structure:
`tree` array, size `size + 1`.
`update(idx, val)`: `idx` is 1-based.
  while `idx < tree.length`: `tree[idx] += val`, `idx += idx & (-idx)`
`query(idx)`: `idx` is 1-based. Sum from 1 to `idx`.
  sum = 0
  while `idx > 0`: `sum += tree[idx]`, `idx -= idx & (-idx)`
  return sum

Let's correct the mapping to 1-based indexing for BIT and the query logic.
Rank map (0-indexed): -1->0, 0->1, 1->2.
BIT size = 4.
`update_bit(rank_plus_1, val)`
`query_bit(rank)` -> sum of counts for ranks 0 to rank-1. This is `query(rank)` in 1-based indexing.

Loop `k` from 0 to `n` (i.e., 0 to 4):
  `currentPrefixScore = P[k]`
  `currentRank = rankMap.get(currentPrefixScore)` // 0-indexed rank

  // We need to count previous prefix scores P[i'] where i' < k and P[k] > P[i']
  // This means we need to count previous scores whose ranks are strictly less than currentRank.
  // So, we query the BIT for sum of counts of ranks from 0 up to currentRank - 1.
  // In 1-based BIT, this means querying up to index `currentRank`.
  `countSmaller = query_bit(currentRank)`
  `totalCount += countSmaller`

  // Add the current score's rank to the BIT.
  // The rank is `currentRank`. The 1-based index is `currentRank + 1`.
  `update_bit(currentRank + 1, 1)`

Let's re-trace with this BIT logic.
`P = [0, -1, 0, 1, 0]`
Ranks: -1->0, 0->1, 1->2.
BIT size = 4. `tree = [0,0,0,0]`. `totalCount = 0`.

k = 0: `P[0]=0`, `rank=1`.
  `countSmaller = query_bit(1)` (sum of ranks 0) = 0.
  `totalCount = 0`.
  `update_bit(1+1, 1)` => `update_bit(2, 1)`. `tree=[0,0,1,0]`.

k = 1: `P[1]=-1`, `rank=0`.
  `countSmaller = query_bit(0)` (sum of ranks < 0) = 0.
  `totalCount = 0`.
  `update_bit(0+1, 1)` => `update_bit(1, 1)`. `tree=[0,1,1,0]`.

k = 2: `P[2]=0`, `rank=1`.
  `countSmaller = query_bit(1)` (sum of ranks 0) = `tree[1]` = 1.
  `totalCount = 0 + 1 = 1`. (This counts `P[2] > P[1]`, subarray `nums[1..1]=[2]`)
  `update_bit(1+1, 1)` => `update_bit(2, 1)`. `tree=[0,1,2,0]`.

k = 3: `P[3]=1`, `rank=2`.
  `countSmaller = query_bit(2)` (sum of ranks 0, 1) = `tree[1] + tree[2]` = 1 + 2 = 3.
  `totalCount = 1 + 3 = 4`.
  These 3 counts correspond to previous scores smaller than 1 (i.e., -1 and 0):
  - `P[1]=-1` (rank 0). `P[3] > P[1]`. Subarray `nums[1..2]=[2,2]`. Score 2. OK.
  - `P[0]=0` (rank 1). `P[3] > P[0]`. Subarray `nums[0..2]=[1,2,2]`. Score 1. OK.
  - `P[2]=0` (rank 1). `P[3] > P[2]`. Subarray `nums[2..2]=[2]`. Score 1. OK.
  Wait, for `P[0]=0` (rank 1), `j+1=3` => `j=2`. Subarray `nums[0..2]`. My previous calculation was correct.
  The previous scores were: `P[0]=0`, `P[1]=-1`, `P[2]=0`.
  Ranks: 1, 0, 1.
  BIT before update: [0, 1, 1, 0]
  Query for rank < 2 (i.e. ranks 0, 1). `query_bit(2)` sums up counts for ranks 0 and 1.
  `query_bit(2)` will sum `tree[1]` and `tree[2]`.
  `tree[1]` has count for rank 0. It's 1 (from `P[1]`).
  `tree[2]` has sum of counts for ranks covering index 2.
  BIT structure: `tree[1]` covers rank 0. `tree[2]` covers ranks 0 and 1. `tree[3]` covers rank 2. `tree[4]` covers ranks 0,1,2,3.
  Let's assume `query_bit(rank)` correctly sums counts from ranks 0 up to `rank - 1`.
  So `query_bit(currentRank)` should sum counts for ranks 0 to `currentRank - 1`.
  At k=3, `currentRank=2`. We need sum of counts for ranks 0 and 1.
  We call `query_bit(2)`.
  `query_bit(2)` should return count for rank 0 + count for rank 1.
  Count for rank 0 is 1 (from `P[1]`).
  Count for rank 1 is 1 (from `P[0]` or `P[2]`). Which one is used?
  When `P[0]=0` (rank 1) was processed at k=0, `update_bit(1+1, 1)`. `tree=[0,0,1,0]`.
  When `P[1]=-1` (rank 0) was processed at k=1, `update_bit(0+1, 1)`. `tree=[0,1,1,0]`.
  When `P[2]=0` (rank 1) was processed at k=2, `update_bit(1+1, 1)`. `tree=[0,1,2,0]`.
  So, at k=3, `query_bit(2)` = `tree[1] + tree[2]`. This should be sum of counts for ranks 0 and 1.
  `tree[1]` = 1 (count for rank 0 from P[1])
  `tree[2]` = 2 (count for rank 1 from P[0] and P[2] combined).
  Total sum = 1 + 2 = 3. This is correct.

  Update BIT at `currentRank + 1 = 2+1 = 3` by 1. `update_bit(3, 1)`. `tree=[0,1,2,1]`.

k = 4: `P[4]=0`, `rank=1`.
  `countSmaller = query_bit(1)` (sum of ranks 0) = `tree[1]` = 1.
  `totalCount = 4 + 1 = 5`.
  This counts `P[4] > P[i']` for `i'<4` where `rank(P[i']) < rank(P[4])=1`.
  So only rank 0. Previous scores with rank 0: `P[1]=-1`.
  `P[4] > P[1]` (0 > -1). Subarray `nums[1..3]=[2,2,3]`. Score = 1+1-1=1. Length=3. 1 > 3/2. No.
  Wait. The definition of score in the problem is about `target` vs `non-target`.
  `nums[1..3] = [2,2,3]`. Target=2.
  `countTarget = 2`, `countOther = 1`.
  `countTarget > length / 2` => `2 > 3/2` => `2 > 1.5`. True.
  So `nums[1..3]` IS a valid subarray.

  My prefix sum calculation for `nums[1..3]` using `P` values:
  `i=1`, `j=3`.
  `P[j+1] - P[i]` = `P[4] - P[1]` = `0 - (-1)` = `1`.
  This score of 1 represents `countTarget - countOther`.
  Since `1 > 0`, `countTarget > countOther`, which means `countTarget` is the majority.
  This looks correct.

  Update BIT at `currentRank + 1 = 1+1 = 2` by 1. `update_bit(2, 1)`. `tree=[0,1,3,1]`.

Final `totalCount = 5`.

The logic seems solid.
Need to implement the `FenwickTree` class.

Consider the constraints:
`nums.length <= 10^5`.
Prefix sums can range from `-10^5` to `10^5`.
The number of unique prefix sums is at most `10^5 + 1`.
The BIT size will be `~10^5`.
Time complexity:
1. Scoring and prefix sums: O(n)
2. Collecting unique scores and sorting: O(n log n) (since there are at most n+1 unique scores)
3. Creating rank map: O(n)
4. Iterating through prefix scores and BIT operations: O(n log U), where U is the number of unique scores. Since U <= n+1, this is O(n log n).
Overall Time Complexity: O(n log n).

Space Complexity:
1. `scores` array: O(n)
2. `prefixScores` array: O(n)
3. `uniqueScores` array: O(n)
4. `rankMap`: O(n)
5. Fenwick tree: O(U), where U <= n+1. So O(n).
Overall Space Complexity: O(n).

This approach fits within typical limits for LeetCode Hard problems.

One edge case: if `target` is not present in `nums` at all.
Example 3: `nums = [1,2,3], target = 4`
`scores = [-1, -1, -1]`
`prefixScores = [0, -1, -2, -3]`
Unique scores: {0, -1, -2, -3}. Sorted: [-3, -2, -1, 0].
Ranks: -3->0, -2->1, -1->2, 0->3.
BIT size = 4+1 = 5.
`totalCount = 0`.

k=0: P[0]=0, rank=3. query_bit(3)=0. update_bit(4,1). tree=[0,0,0,0,1]
k=1: P[1]=-1, rank=2. query_bit(2)=0. update_bit(3,1). tree=[0,0,0,1,1]
k=2: P[2]=-2, rank=1. query_bit(1)=0. update_bit(2,1). tree=[0,0,1,1,1]
k=3: P[3]=-3, rank=0. query_bit(0)=0. update_bit(1,1). tree=[0,1,1,1,1]

Final `totalCount = 0`. Correct.

Alternative problem interpretation: "majority element II" usually implies an element appears > N/3 times. This problem statement says "strictly more than half of the times", which is the standard definition of majority element (Boyer-Moore for > N/2). The "II" in the problem title seems to be misleading or a remnant from a different problem.

The constraints `1 <= nums[i] <= 10^9` and `1 <= target <= 10^9` mean `target` can be very large, but that's handled by the score +1/-1 assignment. The actual values don't affect the logic other than comparison with `target`.

Double check if `nums.length` can be 1.
If `nums = [2], target = 2`.
`scores = [1]`
`prefixScores = [0, 1]`
Unique: {0, 1}. Sorted: [0, 1]. Ranks: 0->0, 1->1.
BIT size = 3. `tree=[0,0,0]`. `totalCount=0`.

k=0: P[0]=0, rank=0. query_bit(0)=0. update_bit(1,1). tree=[0,1,0].
k=1: P[1]=1, rank=1. query_bit(1)=tree[1]=1. totalCount=1.
  This counts P[1] > P[0] (1>0). Subarray nums[0..0]=[2]. Score=1. Length=1. 1 > 1/2. OK.
Update_bit(2,1). tree=[0,1,1].

Final `totalCount=1`. Correct.

Consider constraints again:
`1 <= nums.length <= 10^5`
`1 <= nums[i] <= 10^9`
`1 <= target <= 10^9`

The Fenwick tree implementation:
It should handle indices correctly. Using 1-based indexing for `tree` array is standard.
`update(idx, val)`: `idx` is 1-based rank + 1.
`query(idx)`: `idx` is 1-based rank. It returns sum from 1 up to `idx`.
So, if we have `currentRank` (0-indexed), we need to sum counts for ranks `0, 1, ..., currentRank - 1`.
This corresponds to `query(currentRank)` in 1-based BIT indexing.

Let's define the `FenwickTree` class carefully.
`constructor(size)`: `this.tree = new Array(size + 1).fill(0);`
`update(index, delta)`: `index` is 1-based.
`query(index)`: `index` is 1-based. Returns sum from 1 to `index`.

The ranks are `0, 1, ..., U-1` where `U` is `uniqueScores.length`.
BIT size should be `U+1`.

When processing `P[k]`:
`currentScore = P[k]`
`currentRank = rankMap.get(currentScore)` (0-indexed rank)

We need count of previous `P[i']` (i' < k) where `P[k] > P[i']`.
This means ranks of `P[i']` must be `< currentRank`.
So we need sum of counts for ranks `0, 1, ..., currentRank - 1`.
This sum is obtained by `bit.query(currentRank)`. (Here `query` is the BIT internal method using 1-based indexing, and `currentRank` is the 1-based index for the upper bound. If `currentRank` is 0, `query(0)` should return 0).

Then, we update the BIT for `currentRank`. The 1-based index is `currentRank + 1`.
`bit.update(currentRank + 1, 1)`.

This confirms the logic.

```javascript
/**
 * Fenwick Tree (Binary Indexed Tree) implementation.
 * Supports point updates and prefix sum queries.
 * Uses 1-based indexing internally for the tree array.
 */
class FenwickTree {
    /**
     * @param {number} size The maximum index that will be updated or queried (exclusive).
     *                      Effectively, it supports indices from 0 to size-1.
     */
    constructor(size) {
        // The tree array size is size + 1 to accommodate 1-based indexing.
        this.tree = new Array(size + 1).fill(0);
    }

    /**
     * Updates the value at a given index by adding a delta.
     * @param {number} index The 1-based index to update.
     * @param {number} delta The value to add.
     */
    update(index, delta) {
        // Ensure index is 1-based.
        // Propagate the update upwards in the tree.
        while (index < this.tree.length) {
            this.tree[index] += delta;
            // Move to the next parent node. The expression `index & (-index)`
            // gets the least significant bit of `index`.
            index += index & (-index);
        }
    }

    /**
     * Queries the prefix sum up to a given index.
     * @param {number} index The 1-based index up to which the sum is calculated (inclusive).
     * @returns {number} The sum of elements from index 1 up to `index`.
     */
    query(index) {
        let sum = 0;
        // Ensure index is 1-based.
        // Traverse downwards from the given index to accumulate the sum.
        while (index > 0) {
            sum += this.tree[index];
            // Move to the next parent node by subtracting the least significant bit.
            index -= index & (-index);
        }
        return sum;
    }
}

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var countSubarraysWithMajorityElementII = function(nums, target) {
    const n = nums.length;

    // Step 1: Calculate scores for each element.
    // Assign +1 to the target element, -1 to all other elements.
    // This transforms the majority condition (countTarget > length / 2)
    // into a sum condition (sum of scores > 0).
    // sum(scores[i..j]) = countTarget - countOther
    // countTarget > (countTarget + countOther) / 2
    // 2 * countTarget > countTarget + countOther
    // countTarget > countOther
    // countTarget - countOther > 0
    // sum(scores[i..j]) > 0
    const scores = nums.map(num => (num === target ? 1 : -1));

    // Step 2: Calculate prefix sums of scores.
    // prefixScores[k] will store the sum of scores from index 0 to k-1.
    // prefixScores[0] = 0 (empty prefix sum).
    // prefixScores[k+1] = prefixScores[k] + scores[k]
    // The sum of scores for subarray nums[i..j] is prefixScores[j+1] - prefixScores[i].
    const prefixScores = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefixScores[i + 1] = prefixScores[i] + scores[i];
    }

    // Step 3: Coordinate Compression for prefix scores.
    // The prefix scores can be large, so we map them to smaller, contiguous ranks.
    // This is necessary for using a Fenwick tree efficiently.
    // Collect all unique prefix scores.
    const uniqueScores = Array.from(new Set(prefixScores));
    // Sort the unique scores to establish an order.
    uniqueScores.sort((a, b) => a - b);

    // Create a map from score value to its 0-based rank.
    const rankMap = new Map();
    for (let i = 0; i < uniqueScores.length; i++) {
        rankMap.set(uniqueScores[i], i);
    }

    // Step 4: Initialize Fenwick Tree and total count.
    // The size of the Fenwick tree is the number of unique scores.
    // It will store counts of how many times each rank of prefix score has appeared so far.
    const numUniqueScores = uniqueScores.length;
    const bit = new FenwickTree(numUniqueScores);
    let totalCount = 0;

    // Step 5: Iterate through prefix scores and use Fenwick tree.
    // We want to find pairs (i, j) such that 0 <= i <= j < n and prefixScores[j+1] - prefixScores[i] > 0.
    // This is equivalent to prefixScores[j+1] > prefixScores[i].
    // Let k = j+1. We iterate through k from 0 to n (representing prefixScores[0] to prefixScores[n]).
    // For each prefixScores[k], we need to count how many previous prefixScores[i] (where i < k)
    // satisfy prefixScores[k] > prefixScores[i].

    for (let k = 0; k <= n; k++) {
        const currentPrefixScore = prefixScores[k];
        // Get the 0-based rank of the current prefix score.
        const currentRank = rankMap.get(currentPrefixScore);

        // We need to count previous prefix scores whose ranks are strictly LESS THAN currentRank.
        // This means ranks from 0 up to currentRank - 1.
        // In the Fenwick tree, we query the sum of counts for these ranks.
        // `bit.query(currentRank)` sums counts from 1-based index 1 up to `currentRank`.
        // If `currentRank` is 0, `bit.query(0)` correctly returns 0.
        const countSmallerPrefixScores = bit.query(currentRank);

        // Add this count to the total. Each `countSmallerPrefixScores` represents
        // a valid `i` for the current `j+1` (which is `k` in this loop).
        totalCount += countSmallerPrefixScores;

        // Now, we add the current prefix score's rank to the Fenwick tree.
        // The rank is `currentRank`, and its 1-based index in the BIT is `currentRank + 1`.
        bit.update(currentRank + 1, 1);
    }

    return totalCount;
};
```