/**
 * @param {number[]} nums
 * @param {number[]} queries
 * @return {number[]}
 */
const closestEqualElementQueries = (nums, queries) => {
    // Problem: Find the minimum circular distance to an equal element for each query.
    // Link: https://leetcode.com/problems/closest-equal-element-queries/
    // Approach:
    // 1. Preprocess the `nums` array to store the indices for each unique number. A hash map (JavaScript object) is suitable for this, where keys are the numbers and values are sorted arrays of their indices.
    // 2. For each query, retrieve the target number `nums[queryIndex]`.
    // 3. Get the sorted list of indices for this target number from the preprocessed map.
    // 4. If there's only one index for this number (i.e., the query index itself), then no other equal element exists, return -1.
    // 5. If there are multiple indices, use binary search on the sorted list of indices to find the closest ones to the `queryIndex`.
    // 6. The binary search should find the insertion point for `queryIndex`. The elements immediately before and after this insertion point (if they exist) are the closest indices.
    // 7. Calculate the distances:
    //    - Distance to the element to the left: `queryIndex - leftIndex`.
    //    - Distance to the element to the right: `rightIndex - queryIndex`.
    //    - Circular distances:
    //      - Distance to left (circular): `(queryIndex - leftIndex + n) % n` where `n` is `nums.length`.
    //      - Distance to right (circular): `(rightIndex - queryIndex + n) % n` where `n` is `nums.length`.
    // 8. The minimum of these calculated distances is the answer for the current query.
    // 9. Store the results in an `answer` array and return it.

    // Time Complexity:
    // - Preprocessing: O(N log N) if we sort indices, or O(N) on average if we use `Array.prototype.sort` which is typically Timsort or similar. Let's assume O(N log N) for sorting.
    // - Query processing: For each of Q queries, binary search takes O(log N) on the indices list (max N indices). So, O(Q log N).
    // - Total Time Complexity: O(N log N + Q log N). Given N and Q up to 10^5, this is efficient enough.

    // Space Complexity:
    // - O(N) to store the indices in the hash map, where N is the number of elements in `nums`.

    const n = nums.length;
    const numIndicesMap = new Map(); // Stores { number: [index1, index2, ...] }

    // 1. Preprocess nums to store indices for each number
    for (let i = 0; i < n; i++) {
        const num = nums[i];
        if (!numIndicesMap.has(num)) {
            numIndicesMap.set(num, []);
        }
        numIndicesMap.get(num).push(i);
    }

    const answer = [];

    // 2. Process each query
    for (const queryIndex of queries) {
        const targetNum = nums[queryIndex];
        const indices = numIndicesMap.get(targetNum);

        // If the number only appears once, or doesn't exist (which shouldn't happen if queryIndex is valid)
        if (!indices || indices.length === 0) {
            answer.push(-1);
            continue;
        }

        // If the queried number only appears at the queryIndex, no other equal element exists.
        if (indices.length === 1) {
            answer.push(-1);
            continue;
        }

        let minDistance = Infinity;

        // 3. Use binary search to find the closest indices
        // Find the insertion point for queryIndex in the sorted 'indices' array.
        // This effectively finds the index of the first element >= queryIndex.
        let low = 0;
        let high = indices.length; // Use high as indices.length to handle cases where queryIndex is larger than all existing indices.
        let insertionPoint = 0;

        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (indices[mid] < queryIndex) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        insertionPoint = low; // 'insertionPoint' is the index in 'indices' where queryIndex would be inserted.

        // Check the element to the left of the insertion point (if it exists)
        if (insertionPoint > 0) {
            const leftIndex = indices[insertionPoint - 1];
            const dist = queryIndex - leftIndex; // Direct distance
            const circularDist = (queryIndex - leftIndex + n) % n; // Circular distance
            minDistance = Math.min(minDistance, dist, circularDist);
        }

        // Check the element at the insertion point (if it exists)
        if (insertionPoint < indices.length) {
            const rightIndex = indices[insertionPoint];
            const dist = rightIndex - queryIndex; // Direct distance
            const circularDist = (rightIndex - queryIndex + n) % n; // Circular distance
            minDistance = Math.min(minDistance, dist, circularDist);
        }

        // If minDistance is still Infinity, it means something went wrong or no other element was found.
        // However, given the `indices.length === 1` check, minDistance should always be updated if there's another element.
        // If it's still Infinity, it implies no other elements, which is already handled.
        // But as a safeguard, if it's still Infinity and we reach here, it implies the element is unique.
        if (minDistance === Infinity) {
            answer.push(-1);
        } else {
            answer.push(minDistance);
        }
    }

    return answer;
};
```