// PROBLEM SUMMARY: Find a horizontal line y that divides the total area of given squares into two equal halves.
// LINK: https://leetcode.com/problems/separate-squares-i/
// APPROACH:
// The problem asks for a y-coordinate such that the sum of areas of squares above the line equals the sum of areas of squares below the line.
// Let's consider a horizontal line at y = `lineY`.
// For each square [xi, yi, li]:
// The square extends from y = yi to y = yi + li.
// The area of the square below `lineY` is `max(0, min(yi + li, lineY) - yi) * li`.
// The area of the square above `lineY` is `max(0, (yi + li) - max(yi, lineY)) * li`.
//
// We can observe that the total area of squares below a certain `lineY` is a monotonically increasing function of `lineY`.
// Similarly, the total area of squares above a certain `lineY` is a monotonically decreasing function of `lineY`.
// This monotonic property suggests that we can use binary search to find the `lineY` where the areas are equal.
//
// The range for our binary search can be determined by the minimum and maximum possible y-coordinates covered by the squares.
// Minimum possible y-coordinate: 0 (given in constraints).
// Maximum possible y-coordinate: The maximum yi + li among all squares. A safe upper bound could be `10^9 + 10^9 = 2 * 10^9`.
//
// The binary search will work as follows:
// 1. Initialize `low` to 0 and `high` to a sufficiently large value (e.g., 2 * 10^9).
// 2. In each iteration, calculate `mid = (low + high) / 2`.
// 3. Calculate the total area below `mid` (`areaBelow`) and the total area above `mid` (`areaAbove`).
//    - For each square `[xi, yi, li]`:
//      - The y-range of the square is `[yi, yi + li]`.
//      - Area below `mid`: `intersect_length = max(0, min(yi + li, mid) - yi)`. The contribution is `intersect_length * li`.
//      - Area above `mid`: `intersect_length = max(0, (yi + li) - max(yi, mid))`. The contribution is `intersect_length * li`.
// 4. If `areaBelow` is approximately equal to `areaAbove` (within a small epsilon like 1e-5), then `mid` is our answer.
// 5. If `areaBelow` is less than `areaAbove`, it means our `mid` is too low, and we need to increase `lineY` to include more area below. So, set `low = mid`.
// 6. If `areaBelow` is greater than `areaAbove`, it means our `mid` is too high, and we need to decrease `lineY` to include more area above. So, set `high = mid`.
// 7. Repeat until `high - low` is very small (e.g., < 1e-5).
//
// To handle floating-point comparisons, we'll check if `abs(areaBelow - areaAbove) < epsilon`.
//
// The total area of all squares can be up to 10^12. The binary search will perform a fixed number of iterations (determined by the desired precision). In each iteration, we iterate through all squares.
//
// Time Complexity Analysis:
// The binary search performs a logarithmic number of iterations relative to the search range and the desired precision. For a precision of 1e-5 over a range of 2 * 10^9, the number of iterations is roughly log_2((2 * 10^9) / 1e-5) which is approximately log_2(2 * 10^14) ≈ 48-50 iterations.
// Inside each iteration of the binary search, we iterate through all `N` squares.
// Therefore, the total time complexity is O(N * log(Range / Precision)), where N is the number of squares.
//
// Space Complexity Analysis:
// We only use a few variables to store `low`, `high`, `mid`, `areaBelow`, `areaAbove`, and loop variables. The space complexity is O(1) besides the input storage.
var separateSquares = function(squares) {
    // Define the epsilon for floating-point comparisons.
    const epsilon = 1e-5;

    // Define the function to calculate the total area below a given lineY.
    // This function will be used in our binary search.
    const calculateAreaBelow = (lineY) => {
        let totalAreaBelow = 0;
        // Iterate through each square to calculate its contribution to the area below lineY.
        for (const [xi, yi, li] of squares) {
            // The y-range of the current square is [yi, yi + li].
            const squareBottom = yi;
            const squareTop = yi + li;

            // Calculate the intersection of the square's y-range with the region below lineY.
            // The intersection starts at max(squareBottom, 0) and ends at min(squareTop, lineY).
            // Note: We assume the lineY can be negative or positive, but the square bottom is always >= 0.
            // So the effective bottom of intersection is max(squareBottom, 0) which simplifies to squareBottom
            // since yi >= 0.
            const intersectionBottom = squareBottom;
            const intersectionTop = Math.min(squareTop, lineY);

            // If the intersection top is greater than the intersection bottom, there is a valid overlap.
            if (intersectionTop > intersectionBottom) {
                // The length of the overlapping segment is intersectionTop - intersectionBottom.
                const overlapLength = intersectionTop - intersectionBottom;
                // The area contributed by this overlap is overlapLength * li (width of the square).
                totalAreaBelow += overlapLength * li;
            }
        }
        return totalAreaBelow;
    };

    // Define the function to calculate the total area above a given lineY.
    // This is complementary to calculateAreaBelow.
    const calculateAreaAbove = (lineY) => {
        let totalAreaAbove = 0;
        // Iterate through each square.
        for (const [xi, yi, li] of squares) {
            // The y-range of the current square is [yi, yi + li].
            const squareBottom = yi;
            const squareTop = yi + li;

            // Calculate the intersection of the square's y-range with the region above lineY.
            // The intersection starts at max(squareBottom, lineY) and ends at squareTop.
            const intersectionBottom = Math.max(squareBottom, lineY);
            const intersectionTop = squareTop;

            // If the intersection top is greater than the intersection bottom, there is a valid overlap.
            if (intersectionTop > intersectionBottom) {
                // The length of the overlapping segment is intersectionTop - intersectionBottom.
                const overlapLength = intersectionTop - intersectionBottom;
                // The area contributed by this overlap is overlapLength * li (width of the square).
                totalAreaAbove += overlapLength * li;
            }
        }
        return totalAreaAbove;
    };

    // Calculate the total area of all squares. This can be useful for debugging or sanity checks,
    // but is not strictly necessary for the binary search logic if we compare areas directly.
    let totalAreaSum = 0;
    for (const [xi, yi, li] of squares) {
        totalAreaSum += li * li;
    }

    // Initialize the binary search range.
    // `low` can be 0, as square coordinates are non-negative.
    // `high` needs to be large enough to cover the maximum possible y-coordinate.
    // The maximum yi is 10^9 and maximum li is 10^9. So yi + li can be up to 2 * 10^9.
    // A safe upper bound for `high` is 2 * 10^9.
    let low = 0.0;
    let high = 2e9; // Sufficiently large upper bound for y-coordinates.

    // Perform binary search for a fixed number of iterations to achieve the required precision.
    // The number of iterations is approximately log2((high - low) / epsilon).
    // For high=2e9, low=0, epsilon=1e-5, this is about log2(2e14) ≈ 48 iterations.
    // We'll use 100 iterations to be absolutely safe and ensure precision.
    for (let i = 0; i < 100; i++) {
        // Calculate the midpoint for the current search range.
        const mid = low + (high - low) / 2; // Use this to avoid potential overflow if low+high is too big.

        // Calculate the total area below and above the `mid` line.
        const areaBelow = calculateAreaBelow(mid);
        const areaAbove = calculateAreaAbove(mid); // Or calculate as totalAreaSum - areaBelow

        // The goal is to find `mid` such that `areaBelow` is approximately equal to `areaAbove`.
        // This is equivalent to `areaBelow` being approximately `totalAreaSum / 2`.
        // Or, we can compare `areaBelow` and `areaAbove` directly.

        // If the area below is significantly less than the area above, it means our `mid` is too low.
        // We need to move the line higher to include more area below.
        if (areaBelow < areaAbove) {
            low = mid;
        }
        // If the area below is significantly greater than the area above, it means our `mid` is too high.
        // We need to move the line lower to include more area above.
        else { // areaBelow >= areaAbove
            high = mid;
        }
    }

    // After the binary search, `low` and `high` will be very close to each other,
    // and either `low` or `high` (or their average) will be the answer.
    // Since the loop condition `areaBelow < areaAbove` moves `low` up, and the `else` moves `high` down,
    // `low` will converge to the smallest y that satisfies the condition, and `high` to the largest.
    // For finding the minimum y, `low` is a good candidate.
    // However, since we are always adjusting `low` or `high` to narrow down the range where the equality holds,
    // either `low` or `high` will be very close to the correct answer.
    // Let's return `low` as it represents the lower bound of our final very small interval.
    // Or we can return `(low + high) / 2` for better precision.
    return low;
};
```