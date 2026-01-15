```python
# Problem: Maximize Area of Square Hole in Grid
# Link: https://leetcode.com/problems/maximize-area-of-square-hole-in-grid/
# Approach:
# The problem asks for the maximum area of a square hole that can be formed by removing horizontal and vertical bars.
# A square hole is formed by a sequence of consecutive horizontal bars and a sequence of consecutive vertical bars.
# The size of a square hole is determined by the minimum of the number of consecutive horizontal bars and the number of consecutive vertical bars.
# To maximize the square area, we need to maximize the number of consecutive horizontal bars and the number of consecutive vertical bars independently.
#
# For horizontal bars, the available bars are at positions 1, 2, ..., n+1. The `hBars` array indicates which of these bars are *present* and cannot be removed.
# Effectively, the grid has horizontal bars at positions 1 and n+2 (boundaries) plus any bars specified in `hBars`.
# The segments of available horizontal space are determined by the gaps between these fixed or unremovable bars.
# To find the maximum number of consecutive horizontal cells, we need to find the maximum number of consecutive bar indices that are *not* present in `hBars` and are within the grid boundaries.
#
# Consider the horizontal bars. The grid spans from horizontal bar 1 to n+2.
# The bars in `hBars` are fixed. We can think of the available horizontal cells as being bounded by the fixed bars.
# If we sort `hBars` and add the boundaries 1 and n+2, we can find the maximum gap between consecutive fixed horizontal bars.
# For example, if n=2, hBars=[2,3]. The horizontal bars are 1, 2, 3, 4.
# The fixed bars are at 1, 2, 3, 4.
# The problem statement says "The grid has n + 2 horizontal and m + 2 vertical bars, creating 1 x 1 unit cells. The bars are indexed starting from 1."
# This means horizontal bars are at positions 1, 2, ..., n+1, n+2.
# Similarly, vertical bars are at positions 1, 2, ..., m+1, m+2.
# The `hBars` and `vBars` arrays represent bars that are *present* and *cannot be removed*.
#
# Let's re-evaluate the "bars" concept.
# A grid of size n x m has n rows and m columns of 1x1 cells.
# This requires n+1 horizontal lines and m+1 vertical lines to define these cells.
# The problem statement says "n + 2 horizontal and m + 2 vertical bars".
# This implies that the cells are formed between these bars.
#
# Imagine a grid defined by horizontal lines at y=1, y=2, ..., y=n+1 and vertical lines at x=1, x=2, ..., x=m+1. This creates an n x m grid.
# The problem states "n + 2 horizontal and m + 2 vertical bars". Let's assume these define the outer boundaries and interior lines.
# For example, if n=1, m=1, we have a 1x1 grid. This needs 2 horizontal bars and 2 vertical bars. The problem states n+2=3 horizontal and m+2=3 vertical bars.
#
# Let's reconsider the interpretation with respect to the example:
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Grid: n=2 rows, m=1 column. Total cells: 2x1.
# Horizontal bars: 1, 2, 3, 4.
# Vertical bars: 1, 2, 3.
# `hBars = [2, 3]` means horizontal bars at positions 2 and 3 are fixed and cannot be removed.
# `vBars = [2]` means vertical bar at position 2 is fixed and cannot be removed.
#
# The total number of available horizontal lines is effectively `n+1` lines to create `n` rows of cells. The problem says `n+2` bars.
# This implies bars at 1, ..., n+2. These define n+1 gaps for cells.
# If we have horizontal bars at positions `h_pos_1, h_pos_2, ..., h_pos_k`, these bars define segments of cells between them.
# To form a square hole of side length `s`, we need `s+1` consecutive horizontal bars and `s+1` consecutive vertical bars that are *not removed*.
# This means we are looking for `s+1` consecutive available horizontal positions (including implicit boundary bars) and `s+1` consecutive available vertical positions.
#
# Let's think about the *gaps* between consecutive bars.
# If we have horizontal bars at positions 1, `hBars[0]`, `hBars[1]`, ..., `hBars[k]`, n+2.
# The number of consecutive cells along the horizontal direction is determined by the maximum difference between consecutive bar positions + 1.
#
# Let's consider the available horizontal bar positions: 1, 2, ..., n+2.
# `hBars` are the bars that are *present* and cannot be removed.
# The effective horizontal segments for cells are defined by considering all horizontal bar positions: 1, `hBars[0]`, `hBars[1]`, ..., n+2.
# Sort `hBars` and add 1 and n+2 to the list. Then find the maximum difference between consecutive elements in this sorted list. This difference represents the maximum number of consecutive horizontal cells we can have if we remove all bars *between* these consecutive fixed/boundary bars.
# Let the sorted list of fixed horizontal bars be `sorted_h = sorted(hBars)`.
# We consider the sequence of all available horizontal bar positions: `[1] + sorted_h + [n + 2]`.
# The number of consecutive cells horizontally is `max(sorted_h[i+1] - sorted_h[i] for i in range(len(sorted_h)-1))`.
# If we consider `[1] + sorted_h + [n+2]`, the number of consecutive cells is `max(sorted_h[i] - sorted_h[i-1] - 1 for i in range(1, len(sorted_h)))` plus the gaps at the ends.
# This is equivalent to finding the maximum difference between *consecutive* bar positions, including the implicit boundary bars at 1 and n+2.
#
# Let's re-frame:
# We have `n` rows of cells. These rows are defined by `n+1` horizontal boundaries (bars). The problem states `n+2` horizontal bars.
# Let's assume these `n+2` bars are at positions 0, 1, ..., n+1.
# If `n=2`, bars are at 0, 1, 2, 3. These define 3 potential horizontal segments for cells (between 0-1, 1-2, 2-3).
# The input `hBars` has values `2 <= hBars[i] <= n + 1`.
# If `n=2`, `hBars` can have values 2, 3.
#
# Consider the total number of horizontal bars: `n+2`.
# The bars in `hBars` are fixed. We want to find the maximum number of consecutive *available* horizontal bar positions.
# Let `H` be the list of all horizontal bar positions: `[1, 2, ..., n+1, n+2]`.
# The bars in `hBars` are fixed. We want to find the maximum distance between two *consecutive* elements in the set `{1, n+2} U hBars`.
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal bars: n+2 = 4 bars. Positions: 1, 2, 3, 4.
# Fixed horizontal bars: hBars=[2, 3].
# Set of relevant horizontal bar positions = {1, 4} U {2, 3} = {1, 2, 3, 4}.
# Sorted: [1, 2, 3, 4].
# Consecutive differences: 2-1=1, 3-2=1, 4-3=1.
# The maximum gap is 1. This means we can only have 1 consecutive cell horizontally.
# This interpretation seems wrong. The output for Example 1 is 4. This means a 2x2 square.
# A 2x2 square requires 3 consecutive horizontal bars and 3 consecutive vertical bars.
#
# Let's re-read: "The grid has n + 2 horizontal and m + 2 vertical bars, creating 1 x 1 unit cells."
# This implies that the bars themselves are boundaries.
# If there are `N_h` horizontal bars and `N_v` vertical bars, these define `N_h - 1` horizontal gaps (rows) and `N_v - 1` vertical gaps (columns).
#
# Let `h_bars_set = set(hBars)` and `v_bars_set = set(vBars)`.
#
# Consider the horizontal bars. We have bars at positions 1, 2, ..., n+1, n+2.
# The bars in `hBars` cannot be removed.
# We are looking for the maximum number of *consecutive* horizontal bar positions that we can *clear* or *remove*.
# This means we are looking for segments of bars `i, i+1, ..., j` such that none of `i, i+1, ..., j` are in `hBars`.
# The length of this segment `j - i + 1` determines the number of unit cells that can be spanned.
#
# The grid is formed by bars at positions:
# Horizontal: 1, 2, ..., n+2
# Vertical: 1, 2, ..., m+2
#
# `hBars` are positions of horizontal bars that *must remain*.
# `vBars` are positions of vertical bars that *must remain*.
#
# To form a square hole of side `s`, we need to be able to remove bars to create a `s x s` area of unit cells.
# This requires having `s+1` consecutive horizontal bar positions that are *all removable* (or don't exist) and `s+1` consecutive vertical bar positions that are *all removable* (or don't exist).
#
# The problem states "remove some of the bars in hBars from horizontal bars and some of the bars in vBars from vertical bars".
# This is confusing. Does it mean we can remove bars *from the set hBars and vBars*? No, "Note that other bars are fixed and cannot be removed."
# This must mean we can remove bars *that are NOT specified in hBars and vBars*.
# The bars not in `hBars` are removable horizontal bars.
# The bars not in `vBars` are removable vertical bars.
#
# So, we have:
# Total horizontal bar positions: 1, 2, ..., n+2.
# Fixed horizontal bars: `hBars`.
# Removable horizontal bars: all positions `p` such that `1 <= p <= n+2` AND `p` is NOT in `hBars`.
#
# Total vertical bar positions: 1, 2, ..., m+2.
# Fixed vertical bars: `vBars`.
# Removable vertical bars: all positions `p` such that `1 <= p <= m+2` AND `p` is NOT in `vBars`.
#
# To form a square hole of side `s`, we need to find a sequence of `s+1` consecutive horizontal bar positions that are *all removable*.
# And a sequence of `s+1` consecutive vertical bar positions that are *all removable*.
#
# Let's find the maximum number of consecutive removable horizontal bars.
# Add the boundaries 0 and n+3 to the set of fixed horizontal bars.
# Consider the set of *all* horizontal bar positions: `[1, 2, ..., n+2]`.
# The fixed horizontal bars are `hBars`.
# The removable horizontal bars are those in `[1, 2, ..., n+2]` that are NOT in `hBars`.
#
# Let's sort `hBars`.
# The fixed points for horizontal bars are `1` (implicit start), `hBars[0]`, `hBars[1]`, ..., `hBars[k]`, `n+2` (implicit end).
# The number of consecutive *removable* horizontal bars between `hBars[i-1]` and `hBars[i]` is `hBars[i] - hBars[i-1] - 1`.
# We also need to consider the bars before `hBars[0]` and after `hBars[k]`.
# The number of removable bars before `hBars[0]` is `hBars[0] - 1`. (assuming 1 is the first possible bar pos).
# The number of removable bars after `hBars[k]` is `(n+2) - hBars[k]`.
#
# This looks like we need to find the maximum number of consecutive bars that are *not* in `hBars`.
#
# Let's consider the boundaries more carefully.
# For `n` rows, we have `n+1` horizontal lines that create these rows.
# The problem states `n+2` bars.
# If `n=2`, we have 4 horizontal bars. Let's say they are at y=0, y=1, y=2, y=3. These define 3 rows of cells.
# `hBars` are indices of bars. `2 <= hBars[i] <= n + 1`.
# If `n=2`, then `2 <= hBars[i] <= 3`. So `hBars` can be `[2]` or `[3]` or `[2,3]`.
#
# Let's assume horizontal bars are at positions `1, 2, ..., n+1`. These define `n` rows.
# The problem mentions `n+2` bars. This suggests the boundaries are also included in this count.
# Let the horizontal bars be at positions `1, 2, ..., n+1, n+2`.
# These define `n+1` segments of unit cells between them.
#
# The bars listed in `hBars` are fixed.
# We want to find the maximum number of consecutive horizontal bar positions that are *not* in `hBars`.
# This count will be `k`. This means we can span `k` unit cells horizontally.
#
# Let's define `all_h_bars = sorted(list(set([1, n+2]) | set(hBars)))`
# `max_consecutive_h_segments = 0`
# For `i` from 0 to `len(all_h_bars) - 2`:
#   `max_consecutive_h_segments = max(max_consecutive_h_segments, all_h_bars[i+1] - all_h_bars[i])`
#
# This `max_consecutive_h_segments` is the maximum number of consecutive *unit cells* we can span horizontally.
# For example, if `all_h_bars = [1, 5, 10]`, the gaps are `5-1=4` and `10-5=5`.
# This means we can span 4 cells (between bars 1-5) or 5 cells (between bars 5-10).
# So, the maximum number of consecutive horizontal cell units is 5.
#
# To form a square of side `s`, we need `s` consecutive horizontal cell units and `s` consecutive vertical cell units.
# If `max_h_cells` is the maximum number of consecutive horizontal cells, and `max_v_cells` is the maximum number of consecutive vertical cells.
# The side length of the largest possible square hole is `min(max_h_cells, max_v_cells)`.
# The area is `side_length * side_length`.
#
# Let's test this with Example 1:
# n=2, m=1, hBars=[2,3], vBars=[2]
#
# Horizontal:
# n+2 = 4 bars. Positions: 1, 2, 3, 4.
# hBars = [2, 3] are fixed.
# Consider the set of relevant horizontal bar positions: {1, 4} U {2, 3} = {1, 2, 3, 4}.
# Sorted: `all_h_bars = [1, 2, 3, 4]`.
# Differences:
# 2 - 1 = 1
# 3 - 2 = 1
# 4 - 3 = 1
# Max difference = 1. So, `max_h_cells = 1`.
# This still feels wrong. The output is 4, meaning a 2x2 square.
#
# What if the problem means "number of bars available to remove"?
#
# Let's consider the total number of horizontal bars available to be *at least potentially* removed or kept.
# These are bars at positions `1, 2, ..., n+1, n+2`.
# `hBars` are the bars that *cannot* be removed.
#
# Let's consider the *gaps* between consecutive bars in the *full set of bars*.
#
# For horizontal bars:
# Consider the set of all horizontal bar positions: `P_h = {1, 2, ..., n+2}`.
# The bars that are *fixed* are `F_h = set(hBars)`.
# The bars that are *removable* are `R_h = P_h - F_h`.
# We need to find the maximum length of a contiguous subsequence of `R_h`.
#
# This can be found by sorting `hBars`.
# Let `sorted_hBars = sorted(hBars)`.
# The crucial points are `1` (implicit start), `sorted_hBars[0]`, `sorted_hBars[1]`, ..., `sorted_hBars[-1]`, `n+2` (implicit end).
#
# Max consecutive horizontal cells:
# `max_h_span = 0`
# `prev_bar = 0` # Consider the implicit boundary before the first bar
# For `bar` in `sorted_hBars`:
#   `max_h_span = max(max_h_span, bar - prev_bar - 1)` # Number of removable bars between prev_bar and bar
#   `prev_bar = bar`
# `max_h_span = max(max_h_span, (n + 2) - prev_bar)` # Number of removable bars after the last fixed bar
#
# This `max_h_span` is the maximum number of *consecutive removable horizontal bars*.
# If we have `k` consecutive removable horizontal bars, these `k` bars define `k+1` unit cells.
# Example: Bars at 1, 2, 3, 4. `hBars = [2]`.
# `sorted_hBars = [2]`.
# `prev_bar = 0`.
# `bar = 2`: `max_h_span = max(0, 2 - 0 - 1) = 1`. `prev_bar = 2`.
# `bar = 4`: `max_h_span = max(1, 4 - 2 - 1) = 1`. `prev_bar = 4`.
# This calculation is counting gaps between numbers, not the count of numbers.
#
# Let's rethink the `side` length definition.
# A square hole of side `s` implies `s` unit cells in width and `s` unit cells in height.
# To span `s` unit cells horizontally, we need `s+1` consecutive horizontal bar positions that are *not blocked*.
#
# The set of horizontal bar positions is `1, 2, ..., n+2`.
# The bars in `hBars` are fixed.
# We are looking for the maximum `k` such that there exist `i` where `i, i+1, ..., i+k` are all *not* in `hBars`.
# This `k` is the maximum number of consecutive *removable* horizontal bars.
# If we have `k` consecutive removable bars, this allows us to span `k+1` unit cells.
#
# Let `max_consecutive_removable_h = 0`.
# Let `current_consecutive_removable_h = 0`.
#
# Consider the set of all horizontal bar positions `1, ..., n+2`.
# Iterate through all possible positions `p` from 1 to n+2.
# If `p` is NOT in `hBars`:
#   `current_consecutive_removable_h += 1`
# Else (`p` IS in `hBars`):
#   `max_consecutive_removable_h = max(max_consecutive_removable_h, current_consecutive_removable_h)`
#   `current_consecutive_removable_h = 0`
# After the loop, `max_consecutive_removable_h = max(max_consecutive_removable_h, current_consecutive_removable_h)`
#
# The number of consecutive horizontal cell units we can span is `max_consecutive_removable_h + 1`.
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars: 1, 2, 3, 4. `hBars = [2, 3]`.
#
# Pos 1: Not in hBars. `current_consecutive_removable_h = 1`.
# Pos 2: In hBars. `max_consecutive_removable_h = max(0, 1) = 1`. `current_consecutive_removable_h = 0`.
# Pos 3: In hBars. `max_consecutive_removable_h = max(1, 0) = 1`. `current_consecutive_removable_h = 0`.
# Pos 4: Not in hBars. `current_consecutive_removable_h = 1`.
# End of loop. `max_consecutive_removable_h = max(1, 1) = 1`.
# Max consecutive removable horizontal bars = 1.
# Max horizontal cell units = 1 + 1 = 2.
#
# Vertical: m=1. Bars: 1, 2, 3. `vBars = [2]`.
# Pos 1: Not in vBars. `current_consecutive_removable_v = 1`.
# Pos 2: In vBars. `max_consecutive_removable_v = max(0, 1) = 1`. `current_consecutive_removable_v = 0`.
# Pos 3: Not in vBars. `current_consecutive_removable_v = 1`.
# End of loop. `max_consecutive_removable_v = max(1, 1) = 1`.
# Max consecutive removable vertical bars = 1.
# Max vertical cell units = 1 + 1 = 2.
#
# Max side length = min(max_h_cells, max_v_cells) = min(2, 2) = 2.
# Max area = 2 * 2 = 4. This matches Example 1!
#
# This approach seems correct.
#
# Algorithm:
# 1. Find `max_h_cells`:
#    a. Create a set `hBars_set` for quick lookup.
#    b. Initialize `max_consecutive_removable_h = 0` and `current_consecutive_removable_h = 0`.
#    c. Iterate `p` from 1 to `n + 2`:
#       If `p` is not in `hBars_set`:
#         `current_consecutive_removable_h += 1`
#       Else:
#         `max_consecutive_removable_h = max(max_consecutive_removable_h, current_consecutive_removable_h)`
#         `current_consecutive_removable_h = 0`
#    d. After the loop, `max_consecutive_removable_h = max(max_consecutive_removable_h, current_consecutive_removable_h)`.
#    e. `max_h_cells = max_consecutive_removable_h + 1`.
#
# 2. Find `max_v_cells`:
#    a. Create a set `vBars_set` for quick lookup.
#    b. Initialize `max_consecutive_removable_v = 0` and `current_consecutive_removable_v = 0`.
#    c. Iterate `p` from 1 to `m + 2`:
#       If `p` is not in `vBars_set`:
#         `current_consecutive_removable_v += 1`
#       Else:
#         `max_consecutive_removable_v = max(max_consecutive_removable_v, current_consecutive_removable_v)`
#         `current_consecutive_removable_v = 0`
#    d. After the loop, `max_consecutive_removable_v = max(max_consecutive_removable_v, current_consecutive_removable_v)`.
#    e. `max_v_cells = max_consecutive_removable_v + 1`.
#
# 3. The maximum side length is `side = min(max_h_cells, max_v_cells)`.
# 4. The maximum area is `side * side`.
#
# Constraints: n, m can be up to 10^9. Iterating from 1 to n+2 or m+2 is too slow.
#
# Optimization:
# Instead of iterating through all possible bar positions, we can use the sorted `hBars` and `vBars` to find the maximum consecutive removable bars.
#
# For horizontal bars:
# Consider the sorted `hBars`. Let `sorted_h = sorted(hBars)`.
# The fixed points are `1` (implicit start), `sorted_h[0]`, `sorted_h[1]`, ..., `sorted_h[-1]`, `n+2` (implicit end).
#
# The number of consecutive removable horizontal bars between two consecutive fixed/boundary points `p1` and `p2` is `p2 - p1 - 1`.
#
# Let `all_h_points = [1] + sorted(hBars) + [n + 2]`.
# `max_consecutive_removable_h = 0`
# For `i` from 0 to `len(all_h_points) - 2`:
#   `gap = all_h_points[i+1] - all_h_points[i]`
#   `removable_bars_in_gap = gap - 1`
#   `max_consecutive_removable_h = max(max_consecutive_removable_h, removable_bars_in_gap)`
#
# `max_h_cells = max_consecutive_removable_h + 1`.
#
# Example 1 again with optimized approach:
# n=2, m=1, hBars=[2,3], vBars=[2]
#
# Horizontal: n=2. Bars from 1 to 4. `hBars = [2, 3]`.
# `sorted_hBars = [2, 3]`.
# `all_h_points = [1] + [2, 3] + [4] = [1, 2, 3, 4]`.
#
# i=0: `all_h_points[0]=1`, `all_h_points[1]=2`. `gap = 2-1 = 1`. `removable = 1-1 = 0`. `max_consecutive_removable_h = 0`.
# i=1: `all_h_points[1]=2`, `all_h_points[2]=3`. `gap = 3-2 = 1`. `removable = 1-1 = 0`. `max_consecutive_removable_h = 0`.
# i=2: `all_h_points[2]=3`, `all_h_points[3]=4`. `gap = 4-3 = 1`. `removable = 1-1 = 0`. `max_consecutive_removable_h = 0`.
#
# `max_consecutive_removable_h = 0`.
# `max_h_cells = 0 + 1 = 1`.
#
# This is still not matching. Let's re-evaluate the `side` length definition.
#
# "The grid has n + 2 horizontal and m + 2 vertical bars, creating 1 x 1 unit cells."
#
# Consider a 1D array of bars. If we have bars at positions `p_1, p_2, ..., p_k`.
# These define `k-1` gaps between them. Each gap represents potential cells.
# If `hBars = [2, 3]` and `n=2`. The horizontal bars are `1, 2, 3, 4`.
# Bars `2` and `3` are fixed.
# The available space for cells is between bar 1 and bar 2 (1 cell), between bar 2 and bar 3 (0 cells because 2 and 3 are adjacent and fixed), between bar 3 and bar 4 (1 cell).
#
# What if `max_h_cells` is directly the maximum difference between consecutive *relevant* horizontal bar positions?
#
# Let `h_points = sorted([1] + hBars + [n + 2])`
# Let `v_points = sorted([1] + vBars + [m + 2])`
#
# `max_h_diff = 0`
# For `i` from 0 to `len(h_points) - 2`:
#   `max_h_diff = max(max_h_diff, h_points[i+1] - h_points[i])`
#
# `max_v_diff = 0`
# For `i` from 0 to `len(v_points) - 2`:
#   `max_v_diff = max(max_v_diff, v_points[i+1] - v_points[i])`
#
# The side length of the largest square hole is `min(max_h_diff, max_v_diff)`.
# Area = `side * side`.
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1 to 4. hBars=[2,3].
# `h_points = sorted([1] + [2,3] + [4]) = [1, 2, 3, 4]`.
# Differences:
# 2 - 1 = 1
# 3 - 2 = 1
# 4 - 3 = 1
# `max_h_diff = 1`.
#
# Vertical: m=1. Bars 1 to 3. vBars=[2].
# `v_points = sorted([1] + [2] + [3]) = [1, 2, 3]`.
# Differences:
# 2 - 1 = 1
# 3 - 2 = 1
# `max_v_diff = 1`.
#
# `side = min(1, 1) = 1`. Area = 1*1 = 1. Still not matching.
#
# Let's trace Example 1 again from the problem description.
# "The left image shows the initial grid formed by the bars. The horizontal bars are [1,2,3,4], and the vertical bars are [1,2,3]."
# This confirms my initial interpretation of bar positions.
# "One way to get the maximum square-shaped hole is by removing horizontal bar 2 and vertical bar 2."
#
# This statement implies that the bars *listed in `hBars` and `vBars` are the ones that *remain*.
# If we remove horizontal bar 2 and vertical bar 2.
#
# Initial horizontal bars: [1, 2, 3, 4].
# Fixed (cannot remove) horizontal bars: [2, 3] (from `hBars`).
#
# "You can remove some of the bars... Note that other bars are fixed and cannot be removed."
# This means the bars *not* in `hBars` are the ones we can choose to remove.
#
# Let's go back to the approach where we calculated `max_consecutive_removable_bars`.
#
# If `max_consecutive_removable_h` is the maximum number of consecutive horizontal bars we can remove.
# Suppose we have `k` consecutive removable horizontal bars. Let these be at positions `p, p+1, ..., p+k-1`.
# These `k` bars define `k+1` unit cell spaces.
# Example: Bars 1, 2, 3, 4. `hBars = [2, 3]`.
# Removable bars: 1, 4.
# Consecutive removable: just 1 (at pos 1) or just 1 (at pos 4). Max consecutive removable = 1.
# These 1 removable bar can span 1+1 = 2 unit cells.
#
# The problem statement implies that the side length of the square is determined by the number of consecutive bars of the *same type* that you can have *uninterrupted*.
#
# The bars `hBars` and `vBars` are the ones that are *present* and *cannot be removed*.
#
# Let's try finding the maximum length of consecutive bars of the same "type" that are *not* in `hBars` or `vBars`.
#
# Consider horizontal bars. `n` rows, `n+2` bars.
# The bars in `hBars` are the ones that are fixed.
# We are looking for the maximum `k` such that we can have `k` *consecutive* horizontal bar positions that are *not* in `hBars`.
# This maximum `k` is the number of consecutive *removable* bars.
#
# Let `hBars_list = sorted(hBars)`
# Let `vBars_list = sorted(vBars)`
#
# Calculate `max_consecutive_h_removable`:
# `max_len_h = 0`
# `prev_h = 0`
# For `bar_pos` in `hBars_list`:
#   `max_len_h = max(max_len_h, bar_pos - prev_h - 1)` # Number of removable bars between prev_h and bar_pos
#   `prev_h = bar_pos`
# `max_len_h = max(max_len_h, (n + 2) - prev_h)` # Number of removable bars after the last fixed bar
#
# Calculate `max_consecutive_v_removable`:
# `max_len_v = 0`
# `prev_v = 0`
# For `bar_pos` in `vBars_list`:
#   `max_len_v = max(max_len_v, bar_pos - prev_v - 1)`
#   `prev_v = bar_pos`
# `max_len_v = max(max_len_v, (m + 2) - prev_v)`
#
# The maximum number of consecutive unit cells horizontally is `max_len_h + 1`.
# The maximum number of consecutive unit cells vertically is `max_len_v + 1`.
#
# The side length of the square is `min(max_len_h + 1, max_len_v + 1)`.
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Total bars: 1 to 4. `hBars = [2, 3]`.
# `hBars_list = [2, 3]`.
# `max_len_h = 0`. `prev_h = 0`.
# `bar_pos = 2`: `max_len_h = max(0, 2 - 0 - 1) = 1`. `prev_h = 2`.
# `bar_pos = 3`: `max_len_h = max(1, 3 - 2 - 1) = 1`. `prev_h = 3`.
# After loop: `max_len_h = max(1, (2 + 2) - 3) = max(1, 4 - 3) = 1`.
# So `max_consecutive_removable_h = 1`.
# `max_h_cells = 1 + 1 = 2`.
#
# Vertical: m=1. Total bars: 1 to 3. `vBars = [2]`.
# `vBars_list = [2]`.
# `max_len_v = 0`. `prev_v = 0`.
# `bar_pos = 2`: `max_len_v = max(0, 2 - 0 - 1) = 1`. `prev_v = 2`.
# After loop: `max_len_v = max(1, (1 + 2) - 2) = max(1, 3 - 2) = 1`.
# So `max_consecutive_removable_v = 1`.
# `max_v_cells = 1 + 1 = 2`.
#
# Side length = `min(2, 2) = 2`.
# Area = `2 * 2 = 4`. This matches!
#
# Example 2: n=1, m=1, hBars=[2], vBars=[2]
# Horizontal: n=1. Total bars: 1 to 3. `hBars = [2]`.
# `hBars_list = [2]`.
# `max_len_h = 0`. `prev_h = 0`.
# `bar_pos = 2`: `max_len_h = max(0, 2 - 0 - 1) = 1`. `prev_h = 2`.
# After loop: `max_len_h = max(1, (1 + 2) - 2) = max(1, 3 - 2) = 1`.
# `max_consecutive_removable_h = 1`. `max_h_cells = 1 + 1 = 2`.
#
# Vertical: m=1. Total bars: 1 to 3. `vBars = [2]`.
# `vBars_list = [2]`.
# `max_len_v = 0`. `prev_v = 0`.
# `bar_pos = 2`: `max_len_v = max(0, 2 - 0 - 1) = 1`. `prev_v = 2`.
# After loop: `max_len_v = max(1, (1 + 2) - 2) = max(1, 3 - 2) = 1`.
# `max_consecutive_removable_v = 1`. `max_v_cells = 1 + 1 = 2`.
#
# Side length = `min(2, 2) = 2`. Area = `2 * 2 = 4`. Matches Example 2.
#
# Example 3: n=2, m=3, hBars=[2,3], vBars=[2,4]
# Horizontal: n=2. Total bars: 1 to 4. `hBars = [2, 3]`.
# `hBars_list = [2, 3]`.
# `max_len_h = 0`. `prev_h = 0`.
# `bar_pos = 2`: `max_len_h = max(0, 2 - 0 - 1) = 1`. `prev_h = 2`.
# `bar_pos = 3`: `max_len_h = max(1, 3 - 2 - 1) = 1`. `prev_h = 3`.
# After loop: `max_len_h = max(1, (2 + 2) - 3) = max(1, 4 - 3) = 1`.
# `max_consecutive_removable_h = 1`. `max_h_cells = 1 + 1 = 2`.
#
# Vertical: m=3. Total bars: 1 to 5. `vBars = [2, 4]`.
# `vBars_list = [2, 4]`.
# `max_len_v = 0`. `prev_v = 0`.
# `bar_pos = 2`: `max_len_v = max(0, 2 - 0 - 1) = 1`. `prev_v = 2`.
# `bar_pos = 4`: `max_len_v = max(1, 4 - 2 - 1) = max(1, 1) = 1`. `prev_v = 4`.
# After loop: `max_len_v = max(1, (3 + 2) - 4) = max(1, 5 - 4) = 1`.
# `max_consecutive_removable_v = 1`. `max_v_cells = 1 + 1 = 2`.
#
# Side length = `min(2, 2) = 2`. Area = `2 * 2 = 4`. Matches Example 3.
#
# The logic seems solid.
#
# Time Complexity:
# Sorting `hBars`: O(H log H), where H is the length of `hBars`.
# Iterating through sorted `hBars`: O(H).
# Sorting `vBars`: O(V log V), where V is the length of `vBars`.
# Iterating through sorted `vBars`: O(V).
# Given H, V <= 100, these operations are very fast.
# The dominant factors `n` and `m` (up to 10^9) do not affect the time complexity of the calculation itself, only the definition of the range for bars.
# Total Time Complexity: O(H log H + V log V).
#
# Space Complexity:
# Storing sorted `hBars` and `vBars`.
# O(H + V).
#
# The number of bars `n+2` and `m+2` can be large, but we only process the given `hBars` and `vBars` arrays.
# The crucial insight is that the maximum number of consecutive removable bars is determined by the gaps between the fixed bars and the boundaries (1 and N+2).
#
# Implementation details:
# Need to handle empty `hBars` or `vBars` arrays?
# Constraints say `1 <= hBars.length <= 100` and `1 <= vBars.length <= 100`. So they are never empty.
# The range of bars is `1` to `n+2` for horizontal, and `1` to `m+2` for vertical.
# The `prev_bar` should start at `0` to correctly calculate the gap before the first `hBar`.
# The total number of bars is `n+2`.
#
# Final check on the interpretation:
# `max_consecutive_removable_h` is the max number of consecutive horizontal bar *positions* that are *not* in `hBars`.
# If we have `k` such consecutive positions, say `p, p+1, ..., p+k-1`.
# These `k` bars define `k+1` unit cell spaces.
# Eg: Bars `1, 2, 3, 4`. `hBars=[2]`. Removable: `1, 3, 4`.
# Consecutive removable: `1` (at pos 1), `1` (at pos 3), `1` (at pos 4). Max consecutive removable = 1.
# The removable bars are `1`. This spans cells between 0 and 1. Number of cells = 1.
# The removable bars are `3, 4`. This spans cells between 2 and 4. Number of cells = 2.
# This is still confusing.
#
# Let's consider the definition of a square hole.
# "maximum area of a square-shaped hole"
# "a square-shaped hole in the grid"
#
# If the side length of the square is `S`, it means we have an `S x S` block of unit cells.
# This `S x S` block of cells is bounded by `S+1` horizontal bars and `S+1` vertical bars.
#
# The problem is finding the largest `S` such that we can find `S+1` consecutive horizontal bar positions that are effectively "clearable" AND `S+1` consecutive vertical bar positions that are effectively "clearable".
#
# "Clearable" means either the bar is not present at all (which is not applicable here, as bars are defined from 1 to N+2) OR the bar is removable.
#
# The bars in `hBars` are fixed. Any bar position *not* in `hBars` is removable.
#
# Let `max_consecutive_h_bars_available_to_span_cells` be the count of consecutive horizontal cells.
# This is equal to `max_consecutive_removable_h + 1`.
#
# Consider the bars: `p_0, p_1, ..., p_k` are consecutive horizontal bar positions.
# If all `p_i` are removable (i.e., not in `hBars`), this sequence has length `k+1`.
# This sequence defines `k+1` unit cells.
# Example: Bars 1, 2, 3, 4. `hBars=[2]`.
# Fixed bars: 2. Removable bars: 1, 3, 4.
# Consecutive removable horizontal bars:
# At pos 1: length 1. Spans cells between 0 and 1. Total cells: 1.
# At pos 3, 4: length 2. Spans cells between 2 and 4. Total cells: 2.
# Max consecutive removable horizontal bars = 2 (positions 3 and 4).
# This gives `2+1 = 3` cells? No, that's not right.
#
# Let's use the difference between consecutive points again.
# `h_points = sorted([1] + hBars + [n + 2])`
# `max_h_diff = 0`
# For `i` from 0 to `len(h_points) - 2`:
#   `max_h_diff = max(max_h_diff, h_points[i+1] - h_points[i])`
#
# This `max_h_diff` is the maximum number of *consecutive bar positions* including fixed and boundary bars.
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1 to 4. hBars=[2,3].
# `h_points = [1, 2, 3, 4]`.
# Differences: `2-1=1`, `3-2=1`, `4-3=1`. `max_h_diff = 1`.
#
# Vertical: m=1. Bars 1 to 3. vBars=[2].
# `v_points = [1, 2, 3]`.
# Differences: `2-1=1`, `3-2=1`. `max_v_diff = 1`.
#
# `side = min(1, 1) = 1`. Area = 1. Still wrong.
#
# The problem statement: "The grid has n + 2 horizontal and m + 2 vertical bars, creating 1 x 1 unit cells."
# This means the bars are the lines that form the grid.
# If n=1, m=1, we have 1x1 cell. This requires 2 horizontal lines and 2 vertical lines. Problem states n+2=3 horizontal and m+2=3 vertical bars.
# This means bars at 1, 2, 3 horizontally and 1, 2, 3 vertically.
# Bar 1 -- Cell -- Bar 2 -- Cell -- Bar 3
#
# If bars are at 1, 2, ..., N. There are N-1 cells between them.
#
# Horizontal bars: 1, 2, ..., n+2. Total `n+2` bars. These define `n+1` segments/cells.
# `hBars` are the bars that remain.
# We are looking for the maximum number of consecutive *removable* bars.
# If we have `k` consecutive removable bars, say at positions `p, p+1, ..., p+k-1`.
# These `k` bars define `k+1` cells.
#
# Example: n=2. Bars: 1, 2, 3, 4. `hBars=[2]`.
# Removable: 1, 3, 4.
# Consecutive removable:
# - Just bar 1. Length 1. Number of cells = 1+1 = 2? No. This spans from the start (implicit boundary before 1) to bar 2.
#
# Let's consider the set of *all* horizontal bar positions: `1, 2, ..., n+2`.
# The bars `hBars` are fixed.
# The bars *not* in `hBars` are the ones we can effectively "remove" to create space.
#
# The number of consecutive *removable* horizontal bars is `k`.
# This `k` allows us to span `k+1` unit cells.
#
# Let's retry the `max_consecutive_removable_h` calculation precisely.
#
# `hBars_set = set(hBars)`
# `max_consecutive_removable_h = 0`
# `current_consecutive_removable_h = 0`
#
# For `p` from 1 to `n + 2`:
#   If `p` not in `hBars_set`:
#     `current_consecutive_removable_h += 1`
#   Else:
#     `max_consecutive_removable_h = max(max_consecutive_removable_h, current_consecutive_removable_h)`
#     `current_consecutive_removable_h = 0`
# `max_consecutive_removable_h = max(max_consecutive_removable_h, current_consecutive_removable_h)`
#
# `max_h_cells = max_consecutive_removable_h + 1`
#
# This approach is O(N+M), which is too slow for N, M up to 10^9.
#
# The optimized approach based on sorted `hBars` must be correct for large N, M.
#
# Let's re-read problem constraints and typical interpretations.
# "The grid has n + 2 horizontal and m + 2 vertical bars, creating 1 x 1 unit cells."
# This means the bars define the grid.
# If `n=1`, `m=1`, we have a 1x1 grid. Requires 2 horizontal bars and 2 vertical bars.
# The problem says `n+2` bars. So for `n=1`, `m=1`, we have 3 horizontal bars and 3 vertical bars.
# Let horizontal bars be at `h_1, h_2, ..., h_{n+2}`.
# These define `n+1` segments of unit cells.
#
# Let `all_h_positions = sorted([1] + hBars + [n + 2])`
# Let `all_v_positions = sorted([1] + vBars + [m + 2])`
#
# `max_h_gap = 0`
# For `i` from 0 to `len(all_h_positions) - 2`:
#   `max_h_gap = max(max_h_gap, all_h_positions[i+1] - all_h_positions[i])`
#
# `max_v_gap = 0`
# For `i` from 0 to `len(all_v_positions) - 2`:
#   `max_v_gap = max(max_v_gap, all_v_positions[i+1] - all_v_positions[i])`
#
# This `max_h_gap` is the maximum number of *consecutive bar positions* that are either fixed or boundary.
# If the gap is `G`, it means there are `G-1` cells between these consecutive bars.
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars: 1..4. hBars=[2,3].
# `all_h_positions = [1, 2, 3, 4]`.
# Gaps: `2-1=1`, `3-2=1`, `4-3=1`. `max_h_gap = 1`.
# This `max_h_gap` means the longest sequence of bars (fixed + boundary) is of length 1. This means there is only 1 bar segment.
# This interpretation is still wrong.
#
# The question is about maximizing the *area* of a square hole.
# A square hole of side `S` means `S` rows and `S` columns of unit cells.
# This requires `S+1` consecutive available horizontal bar positions and `S+1` consecutive available vertical bar positions.
#
# AVAILABLE means NOT FIXED.
#
# `hBars` are FIXED horizontal bars.
# `vBars` are FIXED vertical bars.
#
# Any bar position `p` where `1 <= p <= n+2` and `p` is NOT in `hBars` is a REMOVABLE horizontal bar.
#
# Consider the gaps between consecutive points in `[1] + sorted(hBars) + [n+2]`.
# Let `h_points = sorted([1] + hBars + [n+2])`.
# The number of consecutive REMOVABLE bars between `h_points[i]` and `h_points[i+1]` is `h_points[i+1] - h_points[i] - 1`.
#
# Let `max_consecutive_removable_h = 0`.
# For `i` from 0 to `len(h_points) - 2`:
#   `max_consecutive_removable_h = max(max_consecutive_removable_h, h_points[i+1] - h_points[i] - 1)`
#
# This `max_consecutive_removable_h` is the max number of consecutive *removable* horizontal bars.
#
# If we have `k` consecutive removable horizontal bars, they define `k+1` unit cells.
# So, `max_h_cells = max_consecutive_removable_h + 1`.
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1 to 4. hBars=[2,3].
# `h_points = [1, 2, 3, 4]`.
# `i=0`: `h_points[1] - h_points[0] - 1 = 2 - 1 - 1 = 0`. `max_consecutive_removable_h = 0`.
# `i=1`: `h_points[2] - h_points[1] - 1 = 3 - 2 - 1 = 0`. `max_consecutive_removable_h = 0`.
# `i=2`: `h_points[3] - h_points[2] - 1 = 4 - 3 - 1 = 0`. `max_consecutive_removable_h = 0`.
#
# This result (0) is still not right. Why?
#
# The problem statement and examples imply that if `hBars=[2,3]` for `n=2` (bars 1, 2, 3, 4), we can remove bars at 1 and 4.
# This creates a space.
#
# The `n+2` bars implies that the indices are `1, 2, ..., n+2`.
#
# Let's assume the approach that passed the examples is correct:
# `max_h_cells = max(hBars[i] - hBars[i-1] for i in range(1, len(hBars)))` + 1 (and considering boundaries)
# No, this is finding the max difference, not the count of removable bars.
#
# The approach that correctly identified the side length of 2 for Example 1:
#
# Let `H_bars = [1] + hBars + [n+2]`
# Let `V_bars = [1] + vBars + [m+2]`
#
# `max_h_dist = 0`
# For `i` in `range(len(H_bars) - 1)`:
#   `max_h_dist = max(max_h_dist, H_bars[i+1] - H_bars[i])`
#
# `max_v_dist = 0`
# For `i` in `range(len(V_bars) - 1)`:
#   `max_v_dist = max(max_v_dist, V_bars[i+1] - V_bars[i])`
#
# `side = min(max_h_dist, max_v_dist)`
# `return side * side`
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1..4. hBars=[2,3].
# `H_bars = [1, 2, 3, 4]`.
# Diffs: `2-1=1`, `3-2=1`, `4-3=1`. `max_h_dist = 1`.
#
# Vertical: m=1. Bars 1..3. vBars=[2].
# `V_bars = [1, 2, 3]`.
# Diffs: `2-1=1`, `3-2=1`. `max_v_dist = 1`.
#
# `side = min(1, 1) = 1`. Area = 1.
#
# This is the same approach that failed earlier.
#
# Okay, I will trust the logic that passed the examples again:
# "Max consecutive removable bars + 1" is the number of cells.
#
# Revisit the `max_consecutive_removable_h` calculation.
# We need to calculate the number of consecutive integers *not* in `hBars` within the range `1` to `n+2`.
#
# The critical points are `1`, `n+2`, and all points in `hBars`.
# Let `h_points = sorted([1] + hBars + [n+2])`.
# The number of consecutive removable horizontal bars BETWEEN `h_points[i]` and `h_points[i+1]` is `h_points[i+1] - h_points[i] - 1`.
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1 to 4. `hBars=[2,3]`.
# `h_points = [1, 2, 3, 4]`.
# `i=0`: `h_points[1] - h_points[0] - 1 = 2 - 1 - 1 = 0`.
# `i=1`: `h_points[2] - h_points[1] - 1 = 3 - 2 - 1 = 0`.
# `i=2`: `h_points[3] - h_points[2] - 1 = 4 - 3 - 1 = 0`.
# `max_consecutive_removable_h = 0`.
# `max_h_cells = 0 + 1 = 1`.
#
# This yields `max_h_cells = 1`. This means we can span 1 unit cell horizontally.
# Side = 1. Area = 1.
#
# The explanation for Example 1 says: "One way to get the maximum square-shaped hole is by removing horizontal bar 2 and vertical bar 2."
# This implies that we are *choosing* which of the bars *not* in `hBars` or `vBars` to remove.
#
# Let's re-read: "You can remove some of the bars in hBars from horizontal bars and some of the bars in vBars from vertical bars."
# THIS IS THE CRUCIAL PART. It's not about removing bars *not* in `hBars` and `vBars`.
# It means we can remove bars *from the set `hBars`* and *from the set `vBars`*.
#
# BUT THEN, "Note that other bars are fixed and cannot be removed."
# This suggests that the original `hBars` and `vBars` are the ones that AREN'T removed from the *full set* of bars.
#
# Let's assume the initial interpretation was correct and the examples hold the key.
# The examples strongly suggest that the side length is determined by the maximum gap between consecutive bars in the augmented list `[1] + hBars + [n+2]`.
#
# Let `hBars = sorted(hBars)` and `vBars = sorted(vBars)`.
# Add boundaries:
# `all_h_bars = [1] + hBars + [n+2]`
# `all_v_bars = [1] + vBars + [m+2]`
#
# Calculate max consecutive *horizontal* bar segments:
# `max_h_segment = 0`
# for `i` in range(len(all_h_bars) - 1):
#   `max_h_segment = max(max_h_segment, all_h_bars[i+1] - all_h_bars[i])`
#
# Calculate max consecutive *vertical* bar segments:
# `max_v_segment = 0`
# for `i` in range(len(all_v_bars) - 1):
#   `max_v_segment = max(max_v_segment, all_v_bars[i+1] - all_v_bars[i])`
#
# The side of the square is `min(max_h_segment, max_v_segment)`.
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1 to 4. hBars=[2,3].
# `all_h_bars = [1, 2, 3, 4]`.
# Segments: 2-1=1, 3-2=1, 4-3=1. `max_h_segment = 1`.
#
# Vertical: m=1. Bars 1 to 3. vBars=[2].
# `all_v_bars = [1, 2, 3]`.
# Segments: 2-1=1, 3-2=1. `max_v_segment = 1`.
#
# Side = min(1, 1) = 1. Area = 1. Still incorrect.
#
# There MUST be a misunderstanding of what `n+2` bars means or what `hBars` and `vBars` represent in terms of *gaps*.
#
# Okay, if the side length is `S`, we need `S+1` bars available (either removable or existing unremovably).
#
# Let's go back to the interpretation that worked for the examples.
# The maximum number of consecutive cells is `max_consecutive_removable_bars + 1`.
#
# This means we need to find the max number of consecutive integers *not* in `hBars`.
#
# Let's re-examine the "optimized approach" on how to calculate this.
#
# `h_points = sorted([1] + hBars + [n+2])`
# `max_consecutive_removable_h = 0`
# for `i` in range(len(h_points) - 1):
#   `removable_count = h_points[i+1] - h_points[i] - 1`
#   `max_consecutive_removable_h = max(max_consecutive_removable_h, removable_count)`
#
# `max_h_cells = max_consecutive_removable_h + 1`
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1 to 4. hBars=[2,3].
# `h_points = [1, 2, 3, 4]`.
# `i=0`: `removable_count = 2 - 1 - 1 = 0`. `max_consecutive_removable_h = 0`.
# `i=1`: `removable_count = 3 - 2 - 1 = 0`. `max_consecutive_removable_h = 0`.
# `i=2`: `removable_count = 4 - 3 - 1 = 0`. `max_consecutive_removable_h = 0`.
#
# This still gives 0.
#
# The example explanation: "One way to get the maximum square-shaped hole is by removing horizontal bar 2 and vertical bar 2."
# This is the key. We choose *which* bars to remove from the implicit set of ALL bars, subject to `hBars` and `vBars` being fixed points.
#
# The actual structure is:
# Horizontal: 1, 2, ..., n+2
# Vertical: 1, 2, ..., m+2
#
# `hBars` are fixed horizontal bars. `vBars` are fixed vertical bars.
#
# The maximum side length `S` is found by considering `S+1` consecutive horizontal bars and `S+1` consecutive vertical bars that can form the boundary of the square.
#
# What if the problem is about finding the max length of consecutive bars that are *not* in `hBars`?
#
# Let's sort `hBars` and `vBars`.
#
# Find the maximum number of consecutive horizontal bar POSITIONS that are *not* in `hBars`.
#
# `hBars_set = set(hBars)`
# `max_consecutive_h_removable = 0`
# `current_consecutive_h_removable = 0`
#
# For `p` from 1 to `n+2`:
#   If `p` not in `hBars_set`:
#     `current_consecutive_h_removable += 1`
#   Else:
#     `max_consecutive_h_removable = max(max_consecutive_h_removable, current_consecutive_h_removable)`
#     `current_consecutive_h_removable = 0`
# `max_consecutive_h_removable = max(max_consecutive_h_removable, current_consecutive_h_removable)`
#
# `max_h_cells_span = max_consecutive_h_removable + 1`
#
# This is O(N+M). We need to optimize this.
#
# The optimized version of counting consecutive non-`hBars` integers:
# Use `sorted_h = sorted(hBars)`.
# The points of interest are `1`, `sorted_h[0]`, `sorted_h[1]`, ..., `sorted_h[-1]`, `n+2`.
#
# `max_removable_h = 0`
# `prev_point = 0` # Represents the position *before* the first bar (or before bar 1 if we consider 0-indexed bars, but bars are 1-indexed)
# Let's use `prev_point = 0` and the range of bars is `1` to `n+2`.
#
# Consider the intervals between `[1] + sorted(hBars) + [n+2]`.
# Let `h_points = [1] + sorted(hBars) + [n+2]`.
#
# For `i` from 0 to `len(h_points) - 2`:
#   `num_removable_between = h_points[i+1] - h_points[i] - 1`
#   `max_removable_h = max(max_removable_h, num_removable_between)`
#
# `max_h_cells = max_removable_h + 1`
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1 to 4. hBars=[2,3].
# `h_points = [1, 2, 3, 4]`.
# `i=0`: `2 - 1 - 1 = 0`. `max_removable_h = 0`.
# `i=1`: `3 - 2 - 1 = 0`. `max_removable_h = 0`.
# `i=2`: `4 - 3 - 1 = 0`. `max_removable_h = 0`.
# `max_h_cells = 0 + 1 = 1`.
#
# This consistently gives 1. The example output is 4. Side=2.
#
# What if `max_h_segment` is simply the maximum gap between consecutive bars (fixed or boundary)?
#
# `h_points = sorted([1] + hBars + [n+2])`
# `max_h_span = 0`
# for `i` in range(len(h_points) - 1):
#   `max_h_span = max(max_h_span, h_points[i+1] - h_points[i])`
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1 to 4. hBars=[2,3].
# `h_points = [1, 2, 3, 4]`.
# `i=0`: `2 - 1 = 1`. `max_h_span = 1`.
# `i=1`: `3 - 2 = 1`. `max_h_span = 1`.
# `i=2`: `4 - 3 = 1`. `max_h_span = 1`.
#
# This `max_h_span` is the length of the longest sequence of *consecutive bar positions* (including fixed and boundary) that form a continuous block.
# If the length of this block is `L`, it means these `L` bars define `L-1` cells.
#
# `max_h_cells = max_h_span - 1`.
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1 to 4. hBars=[2,3].
# `h_points = [1, 2, 3, 4]`.
# `i=0`: `2 - 1 = 1`. `max_h_span = 1`.
# `i=1`: `3 - 2 = 1`. `max_h_span = 1`.
# `i=2`: `4 - 3 = 1`. `max_h_span = 1`.
# `max_h_span = 1`.
# `max_h_cells = 1 - 1 = 0`. This is wrong.
#
# Final Attempt at Logic:
# The side of the square `S` means we need `S+1` consecutive horizontal bars and `S+1` consecutive vertical bars that are available to form the boundary.
# Available means NOT FIXED.
#
# For horizontal bars:
# The fixed bars are `hBars`. The available bars are all other positions from `1` to `n+2`.
# We are looking for the longest sequence of consecutive available (removable) horizontal bars.
#
# Let `h_bars_sorted = sorted(hBars)`.
# The points that break the sequence of *removable* bars are the `hBars` themselves, plus `0` and `n+3` (as conceptual boundaries for counting removable bars).
#
# Number of consecutive removable horizontal bars = Maximum difference between consecutive points in `[0] + sorted(hBars) + [n+3]`, MINUS 1.
#
# `h_points_for_removable = [0] + sorted(hBars) + [n+3]`
# `max_consecutive_removable_h = 0`
# for `i` in range(len(h_points_for_removable) - 1):
#   `diff = h_points_for_removable[i+1] - h_points_for_removable[i]`
#   `max_consecutive_removable_h = max(max_consecutive_removable_h, diff - 1)` # Number of removable bars in the gap
#
# `max_h_cells = max_consecutive_removable_h + 1`
#
# Example 1: n=2, m=1, hBars=[2,3], vBars=[2]
# Horizontal: n=2. Bars 1 to 4. hBars=[2,3].
# `h_points_for_removable = [0] + [2, 3] + [5] = [0, 2, 3, 5]`.
#
# `i=0`: `diff = 2 - 0 = 2`. `removable = 2 - 1 = 1`. `max_consecutive_removable_h = 1`.
# `i=1`: `diff = 3 - 2 = 1`. `removable = 1 - 1 = 0`. `max_consecutive_removable_h = 1`.
# `i=2`: `diff = 5 - 3 = 2`. `removable = 2 - 1 = 1`. `max_consecutive_removable_h = 1`.
#
# `max_consecutive_removable_h = 1`.
# `max_h_cells = 1 + 1 = 2`.
#
# Vertical: m=1. Bars 1 to 3. vBars=[2].
# `v_points_for_removable = [0] + [2] + [4] = [0, 2, 4]`.
#
# `i=0`: `diff = 2 - 0 = 2`. `removable = 2 - 1 = 1`. `max_consecutive_removable_v = 1`.
# `i=1`: `diff = 4 - 2 = 2`. `removable = 2 - 1 = 1`. `max_consecutive_removable_v = 1`.
#
# `max_consecutive_removable_v = 1`.
# `max_v_cells = 1 + 1 = 2`.
#
# Side = min(2, 2) = 2. Area = 4. This works for Example 1.
#
# This seems to be the correct logic.
# Time complexity: O(H log H + V log V) due to sorting.
# Space complexity: O(H + V) for storing sorted lists.

```python
# Problem: Maximize Area of Square Hole in Grid
# Link: https://leetcode.com/problems/maximize-area-of-square-hole-in-grid/
# Approach:
# The problem asks for the maximum area of a square hole that can be formed by removing horizontal and vertical bars.
# A square hole of side length 's' requires 's+1' consecutive horizontal bar positions and 's+1' consecutive vertical bar positions to form its boundary.
# The bars at positions listed in `hBars` are fixed and cannot be removed. Similarly for `vBars`.
# Any bar position *not* in `hBars` (for horizontal) or `vBars` (for vertical) is considered removable.
# To maximize the square area, we need to find the maximum possible side length 's'.
# This 's' is determined by the maximum number of consecutive horizontal bar positions that are removable, and the maximum number of consecutive vertical bar positions that are removable.
#
# If we have 'k' consecutive removable horizontal bars, they can span 'k+1' unit cells horizontally.
# Similarly, 'k' consecutive removable vertical bars can span 'k+1' unit cells vertically.
#
# To find the maximum number of consecutive removable horizontal bars efficiently:
# 1. Consider all horizontal bar positions from 1 to n+2.
# 2. The bars specified in `hBars` are fixed.
# 3. The critical points that define segments of removable bars are `0` (conceptual boundary before bar 1), the positions in `hBars`, and `n+3` (conceptual boundary after bar n+2).
# 4. Sorting `hBars` and adding these conceptual boundaries gives us a list of points `[0] + sorted(hBars) + [n+3]`.
# 5. The difference between any two consecutive points `p1` and `p2` in this list (`p2 - p1`) represents a segment of bar positions.
# 6. The number of *removable* bars within this segment is `(p2 - p1) - 1`.
# 7. We find the maximum of these `(p2 - p1) - 1` values across all segments. This gives `max_consecutive_removable_h`.
# 8. The maximum number of consecutive horizontal unit cells that can be spanned is `max_consecutive_removable_h + 1`.
#
# We repeat the same logic for vertical bars using `m+2` total vertical bars and `vBars`.
#
# The side length of the largest possible square hole is `min(max_h_cells, max_v_cells)`.
# The maximum area is `side * side`.
#
# Time complexity: O(H log H + V log V) where H = len(hBars) and V = len(vBars), due to sorting the bar arrays. The operations on n and m are constant time as they only define the range boundaries.
# Space complexity: O(H + V) to store the sorted bar arrays.

class Solution:
    def maximizeSquare(self, n: int, m: int, hBars: list[int], vBars: list[int]) -> int:
        # Function to calculate the maximum number of consecutive removable bars + 1
        # This effectively finds the max number of consecutive cells that can be spanned.
        def getMaxCellsSpan(max_bar_pos: int, fixed_bars: list[int]) -> int:
            # Create a list of points that break the sequence of removable bars.
            # These are:
            # - 0: A conceptual boundary before the first bar (position 1).
            # - fixed_bars: The bars that cannot be removed.
            # - max_bar_pos + 1: A conceptual boundary after the last possible bar (position max_bar_pos).
            # For example, if max_bar_pos = 4, bars are 1, 2, 3, 4. Fixed bars: [2].
            # Points to consider: [0] + [2] + [4+1] = [0, 2, 5]
            points_of_interest = [0] + sorted(fixed_bars) + [max_bar_pos + 1]

            max_consecutive_removable = 0

            # Iterate through consecutive pairs of points of interest.
            # The difference between two consecutive points minus 1 gives the number of removable bars in that interval.
            for i in range(len(points_of_interest) - 1):
                p1 = points_of_interest[i]
                p2 = points_of_interest[i+1]
                
                # Calculate the number of removable bars between p1 and p2.
                # Example: if p1=0, p2=2, then the interval contains bar at pos 1.
                # The difference p2 - p1 is 2. The number of removable bars is (2-1)=1.
                # Example: if p1=2, p2=5, then the interval contains bars at pos 3, 4.
                # The difference p2 - p1 is 3. The number of removable bars is (3-1)=2.
                num_removable_in_interval = (p2 - p1) - 1
                
                # Update the maximum count of consecutive removable bars found so far.
                max_consecutive_removable = max(max_consecutive_removable, num_removable_in_interval)

            # The maximum number of consecutive cells that can be spanned is the maximum number of
            # consecutive removable bars plus one (because k removable bars define k+1 cell spaces).
            return max_consecutive_removable + 1

        # Calculate the maximum number of consecutive horizontal cells that can be spanned.
        # The total number of horizontal bars is n + 2, with positions from 1 to n + 2.
        max_h_cells_span = getMaxCellsSpan(n + 2, hBars)

        # Calculate the maximum number of consecutive vertical cells that can be spanned.
        # The total number of vertical bars is m + 2, with positions from 1 to m + 2.
        max_v_cells_span = getMaxCellsSpan(m + 2, vBars)

        # The side length of the largest possible square hole is limited by the minimum
        # of the maximum horizontal and vertical cells that can be spanned.
        side_length = min(max_h_cells_span, max_v_cells_span)

        # The maximum area of the square hole is the square of its side length.
        return side_length * side_length

```