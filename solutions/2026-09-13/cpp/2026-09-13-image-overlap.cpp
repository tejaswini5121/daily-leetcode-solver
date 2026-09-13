```cpp
/*
Problem Summary: Given two n x n binary matrices, find the maximum overlap between them after translating one image.

Link: https://leetcode.com/problems/image-overlap/

Approach:
The core idea is to iterate through all possible translations of one image (say, img1) relative to the other (img2) and count the overlap for each translation.
A translation can be represented by a displacement in the row (dr) and column (dc).
If we fix img2, we can think of sliding img1. For each '1' in img1 at (r1, c1) and each '1' in img2 at (r2, c2), if img1 is translated such that (r1, c1) aligns with (r2, c2), then the translation vector would be (r2 - r1, c2 - c1).
We can iterate through all '1's in img1 and all '1's in img2. For each pair of '1's, say at (r1, c1) in img1 and (r2, c2) in img2, the translation vector (dr, dc) = (r2 - r1, c2 - c1) is a potential candidate for the maximum overlap.
We can use a map or a hash table to store the count of occurrences for each translation vector (dr, dc). The key of the map would be the pair (dr, dc), and the value would be the number of '1' pairs that result in this translation.
After iterating through all pairs of '1's, the maximum value in the map will give us the largest overlap.

To handle the range of translations:
The possible row displacements `dr` can range from `-(n-1)` to `(n-1)`.
The possible column displacements `dc` can range from `-(n-1)` to `(n-1)`.
This is because if a '1' at the top-left of img1 (0,0) aligns with a '1' at the bottom-right of img2 (n-1, n-1), the row displacement is (n-1 - 0) = n-1 and column displacement is (n-1 - 0) = n-1.
Conversely, if a '1' at the bottom-right of img1 (n-1, n-1) aligns with a '1' at the top-left of img2 (0,0), the row displacement is (0 - (n-1)) = -(n-1) and column displacement is (0 - (n-1)) = -(n-1).

Algorithm:
1. Initialize a map `overlap_counts` to store the frequency of each translation vector (dr, dc). The key can be a pair or a custom struct.
2. Iterate through each cell (r1, c1) in `img1`.
3. If `img1[r1][c1] == 1`:
    a. Iterate through each cell (r2, c2) in `img2`.
    b. If `img2[r2][c2] == 1`:
        i. Calculate the translation vector: `dr = r2 - r1`, `dc = c2 - c1`.
        ii. Increment the count for the pair `(dr, dc)` in `overlap_counts`.
4. Initialize `max_overlap = 0`.
5. Iterate through the `overlap_counts` map. For each `(dr, dc)` and its count `c`:
    a. Update `max_overlap = max(max_overlap, c)`.
6. Return `max_overlap`.

Time Complexity:
The algorithm involves nested loops iterating through `img1` (n*n) and `img2` (n*n). Inside these loops, we perform constant time operations (calculating displacement and map update).
If `N` is the number of 1s in `img1` and `M` is the number of 1s in `img2`, the complexity of filling the map is O(N * M).
In the worst case, N and M can be up to n*n. So, the complexity is O((n^2) * (n^2)) = O(n^4).
Iterating through the map takes at most O(n^2) entries (since there are (2n-1)*(2n-1) possible translations).
Therefore, the overall time complexity is dominated by filling the map: O(n^4).

Space Complexity:
The `overlap_counts` map can store up to `(2n-1) * (2n-1)` distinct translation vectors.
So, the space complexity is O(n^2) in the worst case.
*/

#include <vector>
#include <map>
#include <algorithm>

class Solution {
public:
    int largestOverlap(std::vector<std::vector<int>>& img1, std::vector<std::vector<int>>& img2) {
        int n = img1.size(); // Get the size of the square matrices

        // Map to store the frequency of each translation vector (dr, dc)
        // The key is a pair of integers representing (row_displacement, col_displacement)
        // The value is the count of '1' pairs that result in this translation
        std::map<std::pair<int, int>, int> overlap_counts;

        // Iterate through each cell of img1
        for (int r1 = 0; r1 < n; ++r1) {
            for (int c1 = 0; c1 < n; ++c1) {
                // If we find a '1' in img1, it can potentially overlap with a '1' in img2
                if (img1[r1][c1] == 1) {
                    // Iterate through each cell of img2 to find potential overlaps
                    for (int r2 = 0; r2 < n; ++r2) {
                        for (int c2 = 0; c2 < n; ++c2) {
                            // If we find a '1' in img2
                            if (img2[r2][c2] == 1) {
                                // Calculate the translation vector (dr, dc) needed to align img1[r1][c1] with img2[r2][c2]
                                // dr = r2 - r1: the vertical shift of img1
                                // dc = c2 - c1: the horizontal shift of img1
                                int dr = r2 - r1;
                                int dc = c2 - c1;

                                // Increment the count for this specific translation vector
                                overlap_counts[{dr, dc}]++;
                            }
                        }
                    }
                }
            }
        }

        // Initialize the maximum overlap found so far to 0
        int max_overlap = 0;

        // Iterate through all the recorded translation counts
        // The value in the map represents the number of overlapping '1's for a specific translation
        for (auto const& [translation, count] : overlap_counts) {
            // Update max_overlap if the current count is greater
            max_overlap = std::max(max_overlap, count);
        }

        // Return the largest overlap found among all possible translations
        return max_overlap;
    }
};
```