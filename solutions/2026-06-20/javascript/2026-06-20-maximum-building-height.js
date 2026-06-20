/**
 * Problem: Maximum Building Height
 * Summary: Given n buildings and restrictions on specific building heights, find the maximum possible height of the tallest building. The first building must be height 0, adjacent buildings' height difference cannot exceed 1, and all heights must be non-negative.
 * Link: https://leetcode.com/problems/maximum-building-height/
 *
 * Approach Explanation:
 * The problem can be broken down into two main phases:
 * 1. Preprocessing and Initial Bounds:
 *    - Add virtual restrictions for building 1 (height 0) and building n (no explicit max height but implied by adjacent diff constraints).
 *    - Sort all restrictions by building ID.
 *    - For each restriction `[id, maxH]`, calculate an initial `allowedH` based on the previous building's restriction. `allowedH` for building `i` is `min(maxH_i, allowedH_{i-1} + (id_i - id_{i-1}))`. This propagates the maximum possible height from left to right, considering both explicit `maxH` and the adjacent difference constraint.
 *
 * 2. Propagating Bounds from Right to Left:
 *    - After the first pass, `allowedH_i` represents the maximum height building `i` can have given all restrictions to its left and its own explicit `maxH`.
 *    - Now, iterate from right to left (from `n` down to `1`). For each building `i`, update its `allowedH` based on the *next* building's `allowedH`. `allowedH_i = min(allowedH_i, allowedH_{i+1} + (id_{i+1} - id_i))`. This ensures that `allowedH_i` respects restrictions from the right side as well.
 *    - After this second pass, `allowedH_i` for each restricted building `i` represents the true maximum height that building `i` can achieve while satisfying all constraints.
 *
 * 3. Finding Maximum Height in Gaps:
 *    - The maximum height might not be at one of the restricted buildings, but rather in a "gap" between two restricted buildings `[id_i, allowedH_i]` and `[id_{i+1}, allowedH_{i+1}]`.
 *    - In such a gap, the height profile forms a "tent" shape. The peak of this tent is limited by `allowedH_i`, `allowedH_{i+1}`, and the distance between `id_i` and `id_{i+1}`.
 *    - The maximum height in a gap is `floor((allowedH_i + allowedH_{i+1} + (id_{i+1} - id_i)) / 2)`. This formula comes from finding the intersection of two lines with slopes +1 and -1, starting from `(id_i, allowedH_i)` and `(id_{i+1}, allowedH_{i+1})` respectively.
 *    - Calculate this maximum height for all gaps and take the overall maximum among these gap heights and all `allowedH_i` values.
 *
 * Time Complexity:
 * O(M log M + M) where M is the number of restrictions.
 * - Adding virtual restrictions: O(1)
 * - Sorting restrictions: O(M log M)
 * - Two passes (left-to-right, right-to-left) over restrictions: O(M)
 * - Calculating max height in gaps: O(M)
 * Overall, dominated by sorting: O(M log M).
 *
 * Space Complexity:
 * O(M) for storing the modified restrictions array.
 */
function maxBuilding(n, restrictions) {
    // Add virtual restrictions for building 1 and building n.
    // Building 1 must have height 0.
    // Building n has no explicit height restriction, but we add it to simplify iteration and boundary conditions.
    // Its maxHeight is effectively `n - 1` initially, which is a very loose upper bound,
    // but it will be constrained by its left neighbor.
    // Using n-1 as a initial bound for building n is safe because if no restrictions,
    // heights can go up to n-1. We need to cap it at least.
    const allRestrictions = [[1, 0]];
    for (const r of restrictions) {
        allRestrictions.push(r);
    }
    // Add a restriction for the last building (n) with a very large height.
    // This serves as a right boundary and ensures the last segment is considered.
    // The actual maximum height for building n will be determined by its left neighbor
    // and the adjacent difference constraint.
    allRestrictions.push([n, n - 1 + (n - 1)]); // A sufficiently large height, e.g., n-1 (max possible without explicit restrictions) + max possible diff.

    // Sort restrictions by building ID to process them in order.
    allRestrictions.sort((a, b) => a[0] - b[0]);

    // First pass: Propagate maximum allowed heights from left to right.
    // For each building `i`, its `allowedH` is limited by its own `maxHeight`
    // and by `allowedH_{i-1} + (id_i - id_{i-1})` (adjacent diff constraint).
    for (let i = 1; i < allRestrictions.length; i++) {
        const prevId = allRestrictions[i - 1][0];
        const prevAllowedH = allRestrictions[i - 1][1];
        const currentId = allRestrictions[i][0];
        const currentMaxH = allRestrictions[i][1];

        // The maximum height for the current building, considering the previous building
        // and the adjacent height difference constraint.
        const maxPossibleFromLeft = prevAllowedH + (currentId - prevId);
        // Update the current building's allowed height, taking the minimum of
        // its explicit max height and what's possible from the left.
        allRestrictions[i][1] = Math.min(currentMaxH, maxPossibleFromLeft);
    }

    // Second pass: Propagate maximum allowed heights from right to left.
    // This ensures that `allowedH` for each building respects restrictions from its right side as well.
    for (let i = allRestrictions.length - 2; i >= 0; i--) {
        const nextId = allRestrictions[i + 1][0];
        const nextAllowedH = allRestrictions[i + 1][1];
        const currentId = allRestrictions[i][0];
        const currentAllowedH = allRestrictions[i][1];

        // The maximum height for the current building, considering the next building
        // and the adjacent height difference constraint.
        const maxPossibleFromRight = nextAllowedH + (nextId - currentId);
        // Update the current building's allowed height, taking the minimum of
        // its current (left-propagated) allowed height and what's possible from the right.
        allRestrictions[i][1] = Math.min(currentAllowedH, maxPossibleFromRight);
    }

    // After two passes, allRestrictions[i][1] now stores the maximum possible height
    // for building `allRestrictions[i][0]` that satisfies all constraints (its own,
    // from left neighbors, and from right neighbors).

    let maxOverallHeight = 0;

    // Calculate the maximum height in between restricted buildings (gaps).
    // The height profile between two restricted buildings (id_i, h_i) and (id_{i+1}, h_{i+1})
    // forms a "tent" shape. The peak height can be calculated.
    for (let i = 0; i < allRestrictions.length; i++) {
        const id = allRestrictions[i][0];
        const h = allRestrictions[i][1];
        maxOverallHeight = Math.max(maxOverallHeight, h); // Max height could be at a restricted building itself.

        if (i < allRestrictions.length - 1) {
            const nextId = allRestrictions[i + 1][0];
            const nextH = allRestrictions[i + 1][1];

            // Distance between the two buildings.
            const distance = nextId - id;

            // Heights must satisfy:
            // h_peak <= h + (peak_id - id)
            // h_peak <= nextH + (nextId - peak_id)
            // Summing these: 2 * h_peak <= h + nextH + (nextId - id)
            // h_peak <= (h + nextH + distance) / 2
            // This represents the maximum possible height at the peak of the "tent" structure
            // between these two restricted buildings.
            const peakHeightInGap = Math.floor((h + nextH + distance) / 2);
            maxOverallHeight = Math.max(maxOverallHeight, peakHeightInGap);
        }
    }

    return maxOverallHeight;
}