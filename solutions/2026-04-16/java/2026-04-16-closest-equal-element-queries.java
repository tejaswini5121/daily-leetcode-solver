```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collections;

class Solution {
    /**
     * Problem: Closest Equal Element Queries
     * Link: https://leetcode.com/problems/closest-equal-element-queries/
     *
     * Approach:
     * 1. Preprocessing:
     *    - Create a map where keys are the numbers in `nums` and values are sorted lists of indices where that number appears.
     *    - Iterate through `nums` and populate this map. For each number, add its index to the corresponding list.
     * 2. Query Processing:
     *    - For each query `queries[i]`:
     *      - Get the value `val = nums[queries[i]]` and the current index `currIndex = queries[i]`.
     *      - If the list of indices for `val` in the map has only one element (meaning `val` appears only at `currIndex`), the answer is -1.
     *      - Otherwise, find the indices in the sorted list that are closest to `currIndex`.
     *      - Use binary search (`Collections.binarySearch`) to find `currIndex` in the list of indices for `val`.
     *      - If `currIndex` is found, its insertion point will be negative. The elements closest to it will be at `insertionPoint - 1` and `insertionPoint` (if they exist within bounds).
     *      - If `currIndex` is not found, `binarySearch` returns `-(insertionPoint) - 1`. The elements closest to it will be at `insertionPoint - 1` and `insertionPoint` (if they exist within bounds).
     *      - Calculate the circular distance to the closest indices. The circular distance between two indices `a` and `b` in an array of length `n` is `min(abs(a - b), n - abs(a - b))`.
     *      - The minimum of these circular distances is the answer for the query.
     *
     * Time Complexity:
     * - Preprocessing: O(N log N) if we sort the indices for each number. However, if we just append and then sort only if needed, or if we process queries in a specific order, it can be improved. A simpler approach is to populate the map with indices and then sort each list of indices. This takes O(N) to populate and then O(N log N) in the worst case if all elements are the same and we sort all lists. A better way: O(N) to build the map.
     * - Query Processing: For each query, we perform a binary search on a list of indices. In the worst case, a number can appear O(N) times, making the binary search O(log N). So, for Q queries, it's O(Q log N).
     * - Overall: O(N + Q log N). If sorting each list of indices is done upfront, it becomes O(N log N + Q log N). The current implementation sorts as needed, but `Collections.binarySearch` implicitly handles sorted lists. The crucial part is that the `List<Integer>` is sorted for binary search.
     * - Let's refine the preprocessing:
     *   - Building the map: O(N)
     *   - Sorting all index lists: If a number appears `k` times, sorting its list is O(k log k). Summing over all unique numbers, the total sorting time is at most O(N log N) if all elements are the same, or O(N) if elements are mostly unique. A tighter bound is O(N log N) in the worst case if we sort each list.
     *   - Querying: O(Q log N)
     *   - Total: O(N log N + Q log N) after sorting all lists upfront.
     *
     * Space Complexity:
     * - O(N) to store the map of indices.
     */
    public int[] closestEquidistantQueries(int[] nums, int[] queries) {
        int n = nums.length;
        // Map to store indices for each number: number -> sorted list of indices
        Map<Integer, List<Integer>> valToIndexList = new HashMap<>();

        // Preprocessing: Populate the map with indices for each value
        for (int i = 0; i < n; i++) {
            valToIndexList.computeIfAbsent(nums[i], k -> new ArrayList<>()).add(i);
        }

        // Sort the index lists for each value to enable binary search
        for (List<Integer> indices : valToIndexList.values()) {
            Collections.sort(indices);
        }

        int[] answer = new int[queries.length];

        // Process each query
        for (int i = 0; i < queries.length; i++) {
            int currIndex = queries[i];
            int val = nums[currIndex];

            List<Integer> indices = valToIndexList.get(val);

            // If the value appears only once, there's no other equal element
            if (indices.size() == 1) {
                answer[i] = -1;
            } else {
                // Find the position of the current index in the sorted list of indices
                int searchResult = Collections.binarySearch(indices, currIndex);

                int insertionPoint;
                if (searchResult >= 0) {
                    // currIndex was found at searchResult
                    insertionPoint = searchResult;
                } else {
                    // currIndex was not found, binarySearch returns (-(insertion point) - 1)
                    // The insertion point is where it *would* be inserted to maintain order
                    insertionPoint = -(searchResult + 1);
                }

                int minDistance = Integer.MAX_VALUE;

                // Check the element immediately before the insertion point (if it exists)
                if (insertionPoint > 0) {
                    int prevIndex = indices.get(insertionPoint - 1);
                    // Calculate circular distance
                    int distance = Math.min(Math.abs(currIndex - prevIndex), n - Math.abs(currIndex - prevIndex));
                    minDistance = Math.min(minDistance, distance);
                }

                // Check the element immediately at or after the insertion point (if it exists)
                // If currIndex was found, insertionPoint is its index. We need to check the next element.
                // If currIndex was not found, insertionPoint is where it would be inserted. We check the element at insertionPoint.
                int nextIndexToCheck = (searchResult >= 0) ? insertionPoint + 1 : insertionPoint;
                if (nextIndexToCheck < indices.size()) {
                    int nextIndex = indices.get(nextIndexToCheck);
                    // Calculate circular distance
                    int distance = Math.min(Math.abs(currIndex - nextIndex), n - Math.abs(currIndex - nextIndex));
                    minDistance = Math.min(minDistance, distance);
                }
                
                // The problem statement implies that we are guaranteed to find at least one other index if size > 1.
                // If minDistance is still MAX_VALUE here, it means something is wrong or the only element is currIndex itself (handled by size == 1 check).
                answer[i] = minDistance;
            }
        }

        return answer;
    }
}
```