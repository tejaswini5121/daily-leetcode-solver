/*
 * Problem Summary:
 * Given a list of intervals [li, ri), remove any interval [a, b) that is covered by another interval [c, d) in the list (i.e., c <= a and b <= d). Return the count of remaining intervals.
 *
 * Link: https://leetcode.com/problems/remove-covered-intervals/
 *
 * Approach Explanation:
 * The core idea is to sort the intervals to streamline the coverage detection process.
 * We sort the intervals primarily by their start points (li) in ascending order. When two intervals have the same start point, we apply a secondary sort criterion: we sort them by their end points (ri) in descending order.
 *
 * After sorting, we iterate through the intervals. We maintain a variable `maxRightBoundary` which stores the maximum end point encountered so far among the intervals that have *not* been covered by previous ones.
 * For each interval `[left, right]` in the sorted list:
 * 1. If `right` is less than or equal to `maxRightBoundary`, it implies that this current interval `[left, right]` is fully contained within a previously processed non-covered interval (or one whose right boundary contributed to `maxRightBoundary`). Therefore, this interval is covered, and we simply skip it.
 * 2. If `right` is greater than `maxRightBoundary`, it means this interval extends beyond the reach of any previously processed non-covered interval. Thus, it cannot be covered by them. We count this interval as a "remaining" interval and update `maxRightBoundary` to its `right` value, as this new interval might now cover subsequent intervals.
 *
 * The descending sort for `ri` when `li` are equal is critical. For instance, given `[[1,5], [1,4]]`, sorting `ri` descending ensures `[1,5]` comes before `[1,4]`. When `[1,5]` is processed, `maxRightBoundary` becomes 5. Then, when `[1,4]` is processed, its `right` (4) is less than or equal to `maxRightBoundary` (5), correctly identifying `[1,4]` as covered. If `ri` were sorted ascending, `[1,4]` would come first, `maxRightBoundary` would become 4, and then `[1,5]` would be incorrectly deemed not covered.
 *
 * Time Complexity:
 * O(N log N), where N is the number of intervals. This complexity is primarily driven by the initial sorting step. The subsequent iteration through the sorted array takes O(N) time.
 *
 * Space Complexity:
 * O(N) in the worst case, largely dependent on the sorting algorithm used by JavaScript's `Array.prototype.sort()`. Some sort implementations (like merge sort) require O(N) auxiliary space, while others (like quicksort) might use O(log N) stack space in the average case. The rest of the algorithm uses only a few constant-space variables (O(1)).
 */

/**
 * @param {number[][]} intervals
 * @return {number}
 */
var removeCoveredIntervals = function(intervals) {
    // Step 1: Sort the intervals according to the defined criteria.
    // Primary sort key: start point (intervals[i][0]) in ascending order.
    // Secondary sort key (for ties in start point): end point (intervals[i][1]) in descending order.
    intervals.sort((a, b) => {
        // If the start points are different, sort by start point in ascending order.
        if (a[0] !== b[0]) {
            return a[0] - b[0];
        }
        // If the start points are the same, sort by end point in descending order.
        // This ensures that for intervals like [1,5] and [1,4], [1,5] is processed first.
        // This is crucial because the wider interval needs to set the `maxRightBoundary`
        // so it can correctly cover narrower intervals that start at the same point.
        return b[1] - a[1];
    });

    // Initialize a counter for the number of intervals that are not covered.
    let remainingIntervalsCount = 0;
    // `maxRightBoundary` tracks the maximum right boundary among the intervals
    // that we have processed so far and have determined are not covered.
    // We initialize it to -1, as interval end points `ri` are always `ri >= 0`.
    let maxRightBoundary = -1;

    // Step 2: Iterate through the sorted intervals to count non-covered ones.
    for (let i = 0; i < intervals.length; i++) {
        const currentInterval = intervals[i];
        const currentRight = currentInterval[1]; // Get the end point of the current interval.

        // Check if the current interval is covered by a previously processed non-covered interval.
        // An interval `[currentLeft, currentRight]` is covered if:
        // 1. Its start point `currentLeft` is greater than or equal to the start point
        //    of a previous non-covered interval (guaranteed by our sorting `a[0] - b[0]`).
        // 2. Its end point `currentRight` is less than or equal to the end point
        //    of that previous non-covered interval (checked by `maxRightBoundary`).
        if (currentRight <= maxRightBoundary) {
            // If the current interval's right boundary is less than or equal to `maxRightBoundary`,
            // it means this interval is completely covered by an earlier, non-covered interval.
            // We do not count it and do not update `maxRightBoundary` as it doesn't extend our reach.
            continue;
        } else {
            // If the current interval's right boundary is greater than `maxRightBoundary`,
            // it means this interval is not covered by any previous non-covered intervals.
            // It potentially extends beyond what we've seen before.
            // So, we count this interval as a remaining (non-covered) interval.
            remainingIntervalsCount++;
            // We then update `maxRightBoundary` to this interval's right point.
            // This new `maxRightBoundary` will be used to check subsequent intervals.
            maxRightBoundary = currentRight;
        }
    }

    // Step 3: Return the final count of intervals that are not covered.
    return remainingIntervalsCount;
};