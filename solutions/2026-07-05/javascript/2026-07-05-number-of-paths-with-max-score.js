/**
 * Problem Summary:
 * This problem asks us to find the maximum score and the number of paths to achieve that score
 * from the bottom-right ('S') to the top-left ('E') of a given board.
 * We can move up, left, or diagonally up-left. Cells can be numbers (1-9), 'X' (obstacle), 'E', or 'S'.
 *
 * Problem Link:
 * https://leetcode.com/problems/number-of-paths-with-max-score/
 *
 * Approach Explanation:
 * This problem can be solved using dynamic programming. We need to store two pieces of information for each cell (r, c):
 * 1. The maximum score achievable when reaching cell (r, c).
 * 2. The number of paths that achieve this maximum score.
 *
 * Let dp[r][c] be an array [max_score, count_paths] for cell (r, c).
 * The board dimensions are N x N. We will iterate from bottom-right to top-left.
 *
 * Base Case:
 * The starting cell 'S' (board[N-1][N-1]) has an initial score of 0 and 1 path.
 * So, dp[N-1][N-1] = [0, 1]. All other cells are initialized to [negative_infinity, 0] or [0, 0] depending on interpretation.
 * Since we collect scores *on* cells we visit, and 'S' doesn't contribute score, its initial score is 0.
 *
 * Transition:
 * For each cell (r, c) (from N-1 down to 0, N-1 down to 0, excluding 'S'):
 * 1. If board[r][c] is 'X', then dp[r][c] = [-Infinity, 0] (no path through an obstacle).
 * 2. Otherwise, we consider three possible previous cells: (r+1, c) (from below), (r, c+1) (from right), and (r+1, c+1) (from diagonal bottom-right).
 *    Let's denote their DP values as dp_below, dp_right, dp_diag.
 *    We need to find the maximum score among these three reachable cells.
 *    max_prev_score = max(dp_below[0], dp_right[0], dp_diag[0])
 *
 *    If max_prev_score is -Infinity (meaning no valid paths from any of the three directions), then
 *    dp[r][c] = [-Infinity, 0].
 *
 *    Otherwise, the current cell's score is board[r][c] (or 0 if it's 'E').
 *    current_cell_value = (board[r][c] === 'E' || board[r][c] === 'S') ? 0 : parseInt(board[r][c]);
 *
 *    The max score to reach (r, c) would be max_prev_score + current_cell_value.
 *    The number of paths to achieve this max score is the sum of path counts from the previous cells
 *    that contributed to `max_prev_score`.
 *
 *    Initialize current_max_score = -Infinity, current_count = 0.
 *
 *    For each of the three potential previous cells (below, right, diagonal):
 *    If its max_score (e.g., dp_below[0]) is equal to max_prev_score:
 *        Add its path count (e.g., dp_below[1]) to current_count.
 *
 *    dp[r][c] = [max_prev_score + current_cell_value, current_count % MOD].
 *
 * Special Handling for 'E':
 * The cell 'E' is the target. Its value should be considered 0, as per the problem statement "collect numeric characters".
 * When we are calculating the value for 'E', we should not add the 'E' character itself.
 * The score in dp[0][0] represents the score collected *up to and including* cell (0,0).
 *
 * The problem states "start at 'S'", "reach 'E'". The score from 'S' is 0. The score for 'E' is 0.
 *
 * The modulo operation (10^9 + 7) should be applied to the path counts at each step.
 *
 * Final Result:
 * The result is dp[0][0]. If dp[0][0][0] is -Infinity, it means no path, so return [0, 0].
 *
 * Time Complexity:
 * O(N*N) where N is the board dimension. We iterate through each cell of the N x N board once.
 * For each cell, we perform a constant number of operations (checking three neighbors, max/sum operations).
 *
 * Space Complexity:
 * O(N*N) for the dp table, which stores a pair of integers for each of the N x N cells.
 */
var pathsWithMaxScore = function(board) {
    const N = board.length;
    const MOD = 10**9 + 7;

    // dp[r][c] will store [max_score, count_paths] to reach (r, c)
    // Initialize dp table with [-Infinity, 0] for all cells
    // -Infinity for score indicates an unreachable cell.
    // 0 for count indicates no paths found yet.
    const dp = Array(N).fill(null).map(() => Array(N).fill(null).map(() => [-Infinity, 0]));

    // Helper to get value of a cell. 'E' and 'S' are 0, 'X' is unreachable, numbers are their integer value.
    const getCellValue = (r, c) => {
        if (r < 0 || r >= N || c < 0 || c >= N || board[r][c] === 'X') {
            return -Infinity; // Effectively an obstacle or out of bounds
        }
        if (board[r][c] === 'E' || board[r][c] === 'S') {
            return 0; // 'E' and 'S' don't add to the score
        }
        return parseInt(board[r][c]);
    };

    // Base case: Start at 'S' (bottom-right: N-1, N-1).
    // The score collected UP TO and including 'S' is 0, and there's 1 way to be at 'S'.
    // We are starting *from* 'S', so 'S' doesn't contribute to the score of the path.
    // The path starts *at* 'S' and moves away from it.
    dp[N - 1][N - 1] = [0, 1];

    // Iterate from bottom-right towards top-left (excluding 'S')
    for (let r = N - 1; r >= 0; r--) {
        for (let c = N - 1; c >= 0; c--) {
            // If current cell is 'S', it's already handled as base case or skipped because we only
            // calculate values for cells we move *to*. Its value is 0.
            if (board[r][c] === 'S') {
                continue;
            }

            // If current cell is an obstacle, it's unreachable with score -Infinity, 0 paths.
            if (board[r][c] === 'X') {
                dp[r][c] = [-Infinity, 0];
                continue;
            }

            // Consider moves from three possible previous cells:
            // 1. From cell below (r+1, c) - moving Up
            // 2. From cell right (r, c+1) - moving Left
            // 3. From cell diagonally below-right (r+1, c+1) - moving Up-Left

            // Get DP values for neighbors (pad with [-Infinity, 0] if out of bounds)
            const fromBelow = (r + 1 < N) ? dp[r + 1][c] : [-Infinity, 0];
            const fromRight = (c + 1 < N) ? dp[r][c + 1] : [-Infinity, 0];
            const fromDiag = (r + 1 < N && c + 1 < N) ? dp[r + 1][c + 1] : [-Infinity, 0];

            // Find the maximum score achievable among these three paths
            const maxPrevScore = Math.max(fromBelow[0], fromRight[0], fromDiag[0]);

            // If maxPrevScore is -Infinity, it means no valid path reaches (r, c)
            if (maxPrevScore === -Infinity) {
                dp[r][c] = [-Infinity, 0]; // Keep it unreachable
                continue;
            }

            // Calculate the score of the current cell. 'E' also has 0 score contribution.
            const currentCellScore = getCellValue(r, c);

            let currentPathCount = 0;
            // Add counts from paths that lead to maxPrevScore
            if (fromBelow[0] === maxPrevScore) {
                currentPathCount = (currentPathCount + fromBelow[1]) % MOD;
            }
            if (fromRight[0] === maxPrevScore) {
                currentPathCount = (currentPathCount + fromRight[1]) % MOD;
            }
            if (fromDiag[0] === maxPrevScore) {
                currentPathCount = (currentPathCount + fromDiag[1]) % MOD;
            }
            
            // Store the calculated max score and path count for the current cell
            dp[r][c] = [maxPrevScore + currentCellScore, currentPathCount];
        }
    }

    // The result is at dp[0][0] (top-left, 'E')
    let finalScore = dp[0][0][0];
    let finalCount = dp[0][0][1];

    // If finalScore is -Infinity, it means no path exists. Return [0, 0].
    if (finalScore === -Infinity) {
        return [0, 0];
    } else {
        // 'E' itself does not add to the score, which is already handled by getCellValue.
        // The problem asks for the sum of numeric characters collected.
        // If we reached 'E', the max score collected is finalScore, and finalCount paths.
        return [finalScore, finalCount];
    }
};