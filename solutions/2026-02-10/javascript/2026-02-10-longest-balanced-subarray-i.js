/**
 * @summary Given an array of integers, find the length of the longest subarray where the count of distinct even numbers equals the count of distinct odd numbers.
 * @link https://leetcode.com/problems/longest-balanced-subarray-i/
 * @approach The problem asks for a subarray where the count of distinct even numbers equals the count of distinct odd numbers. This condition can be rephrased as: (count of distinct even numbers) - (count of distinct odd numbers) = 0.
 *
 * We can iterate through all possible subarrays and for each subarray, count the distinct even and odd numbers. This would be O(n^3) or O(n^2) if we optimize counting. Given n <= 1500, this might be too slow.
 *
 * A more efficient approach involves transforming the problem into finding the longest subarray with a prefix sum difference of zero.
 *
 * Let's assign a value of +1 to each distinct even number encountered and -1 to each distinct odd number encountered within a subarray. If we can track the *difference* between the count of distinct even and odd numbers, we can use a prefix sum approach.
 *
 * However, the "distinct" requirement complicates a direct prefix sum on individual elements.
 *
 * Consider the difference `distinct_even_count - distinct_odd_count`.
 *
 * Let's iterate through the array and maintain the counts of distinct even and odd numbers encountered so far.
 *
 * A key observation is that if we know the difference `(distinct_even_count - distinct_odd_count)` at a certain index `i`, and we encounter the same difference again at index `j` (where `j > i`), it means the subarray `nums[i+1...j]` has a difference of zero between distinct even and odd numbers. This is because the prefix sums of the difference between index 0 and i are the same as the prefix sums between index 0 and j.
 *
 * So, we can iterate through the array and for each prefix, calculate the difference `distinct_even_count - distinct_odd_count`. We can store the first occurrence of each difference value in a hash map (or a JavaScript object).
 *
 * The state we need to track for each prefix is the set of distinct even numbers and the set of distinct odd numbers seen so far. The *difference* between the sizes of these sets is what matters.
 *
 * `prefix_diff[i] = (number of distinct even elements in nums[0...i]) - (number of distinct odd elements in nums[0...i])`
 *
 * If `prefix_diff[j] == prefix_diff[i]` for `j > i`, then the subarray `nums[i+1...j]` is balanced, and its length is `j - i`. We want to maximize this length.
 *
 * Let's refine the state: we need to track the difference of counts of *distinct* numbers.
 *
 * We can iterate through the array. For each element `nums[k]`:
 * 1. If `nums[k]` is even, we add it to a `seen_even` set.
 * 2. If `nums[k]` is odd, we add it to a `seen_odd` set.
 * 3. The current difference is `seen_even.size - seen_odd.size`.
 * 4. We store this difference and the index `k` in a map. If we see a difference again, say at index `j`, and it was previously seen at index `i` with the same difference, then the subarray `nums[i+1...j]` is balanced. Its length is `j - i`.
 *
 * Example: nums = [2, 5, 4, 3]
 *
 * k=0, num=2 (even): seen_even={2}, seen_odd={}. diff = 1-0 = 1. map[1] = 0.
 * k=1, num=5 (odd): seen_even={2}, seen_odd={5}. diff = 1-1 = 0. map[0] = 1. (Since 0 was seen at -1 implicitly, the length is 1 - (-1) = 2). Longest = 2.
 * k=2, num=4 (even): seen_even={2,4}, seen_odd={5}. diff = 2-1 = 1. map[1] = 2. (Since 1 was seen at 0, length = 2 - 0 = 2). Longest = 2.
 * k=3, num=3 (odd): seen_even={2,4}, seen_odd={5,3}. diff = 2-2 = 0. map[0] = 3. (Since 0 was seen at 1, length = 3 - 1 = 2). Longest = 2.
 *
 * This doesn't seem to capture the subarray correctly. The issue is that the `seen_even` and `seen_odd` sets are global and don't reset for subarrays.
 *
 * Let's consider the problem from a different angle. For a fixed starting point `i`, we want to find the largest `j` such that `nums[i...j]` is balanced.
 *
 * For each `i` from 0 to n-1:
 *   Initialize `distinct_even = new Set()`, `distinct_odd = new Set()`.
 *   For each `j` from `i` to n-1:
 *     If `nums[j]` is even: `distinct_even.add(nums[j])`
 *     Else: `distinct_odd.add(nums[j])`
 *     If `distinct_even.size == distinct_odd.size`:
 *       `maxLength = max(maxLength, j - i + 1)`
 * This approach is O(n^2) because the Set operations are O(1) on average. Given n <= 1500, n^2 is around 2.25 * 10^6, which should be acceptable.
 *
 * Let's trace Example 1: nums = [2, 5, 4, 3]
 *
 * i = 0:
 *   j = 0, num=2 (even): distinct_even={2}, distinct_odd={}. 1 != 0.
 *   j = 1, num=5 (odd): distinct_even={2}, distinct_odd={5}. 1 == 1. Balanced. maxLength = max(0, 1-0+1) = 2. Subarray: [2, 5].
 *   j = 2, num=4 (even): distinct_even={2,4}, distinct_odd={5}. 2 != 1.
 *   j = 3, num=3 (odd): distinct_even={2,4}, distinct_odd={5,3}. 2 == 2. Balanced. maxLength = max(2, 3-0+1) = 4. Subarray: [2, 5, 4, 3].
 *
 * i = 1:
 *   j = 1, num=5 (odd): distinct_even={}, distinct_odd={5}. 0 != 1.
 *   j = 2, num=4 (even): distinct_even={4}, distinct_odd={5}. 1 == 1. Balanced. maxLength = max(4, 2-1+1) = 4. Subarray: [5, 4].
 *   j = 3, num=3 (odd): distinct_even={4}, distinct_odd={5,3}. 1 != 2.
 *
 * i = 2:
 *   j = 2, num=4 (even): distinct_even={4}, distinct_odd={}. 1 != 0.
 *   j = 3, num=3 (odd): distinct_even={4}, distinct_odd={3}. 1 == 1. Balanced. maxLength = max(4, 3-2+1) = 4. Subarray: [4, 3].
 *
 * i = 3:
 *   j = 3, num=3 (odd): distinct_even={}, distinct_odd={3}. 0 != 1.
 *
 * Final maxLength = 4. This O(n^2) approach works.
 *
 * Let's re-evaluate the prefix sum idea.
 * The problem statement implies we can assign a "value" to numbers that contribute to the balance.
 *
 * A subtle point: the definition is "number of distinct even numbers" and "number of distinct odd numbers".
 *
 * Let `val(x)` be:
 *   +1 if `x` is a distinct even number not seen before in the current subarray.
 *   -1 if `x` is a distinct odd number not seen before in the current subarray.
 *   0 otherwise.
 *
 * This `val` function depends on the *current subarray*, which makes prefix sums on individual values difficult directly.
 *
 * What if we consider a transformation?
 * For each number, let's assign it a "contribution" to the balance:
 *   If `num` is even and it's the *first time* we see this even number in the subarray: +1
 *   If `num` is odd and it's the *first time* we see this odd number in the subarray: -1
 *
 * This still requires tracking seen numbers within each subarray.
 *
 * The O(n^2) approach seems the most straightforward and likely efficient enough.
 *
 * Time Complexity: O(n^2), where n is the length of nums. We have two nested loops, and Set operations (add, size) take O(1) on average.
 * Space Complexity: O(n) in the worst case. In each outer loop iteration, we create new Set objects. The size of these sets can grow up to n/2 elements each.
 */
var longestBalancedSubarray = function(nums) {
    let maxLength = 0; // Initialize the maximum length of a balanced subarray found so far
    const n = nums.length; // Get the length of the input array

    // Iterate through all possible start indices of a subarray
    for (let i = 0; i < n; i++) {
        // For each starting index, we will explore all possible ending indices
        let distinctEven = new Set(); // Set to store distinct even numbers in the current subarray
        let distinctOdd = new Set();  // Set to store distinct odd numbers in the current subarray

        // Iterate through all possible end indices of a subarray, starting from the current start index 'i'
        for (let j = i; j < n; j++) {
            // Check if the current number is even or odd
            if (nums[j] % 2 === 0) {
                // If the number is even, add it to the distinctEven set
                // Set automatically handles uniqueness, so duplicates don't increase the count
                distinctEven.add(nums[j]);
            } else {
                // If the number is odd, add it to the distinctOdd set
                distinctOdd.add(nums[j]);
            }

            // Check if the number of distinct even numbers equals the number of distinct odd numbers
            if (distinctEven.size === distinctOdd.size) {
                // If they are equal, this subarray nums[i...j] is balanced
                // Calculate the length of this balanced subarray
                const currentLength = j - i + 1;
                // Update maxLength if the current balanced subarray is longer
                maxLength = Math.max(maxLength, currentLength);
            }
        }
    }

    // Return the maximum length found
    return maxLength;
};
