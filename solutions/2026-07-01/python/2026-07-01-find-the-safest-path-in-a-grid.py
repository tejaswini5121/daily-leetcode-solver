```python
# Finds the maximum safeness factor of a path from (0,0) to (n-1,n-1) in a grid.
# The safeness factor is the minimum Manhattan distance from any path cell to any thief.
# Link: https://leetcode.com/problems/find-the-safest-path-in-a-grid/
#
# Approach:
# 1. Precompute the minimum distance from each cell to the nearest thief using BFS.
#    We initialize a distance matrix with infinity and add all thief cells to the BFS queue
#    with distance 0. Then, we perform a multi-source BFS to populate the distance matrix.
# 2. The problem now transforms into finding a path from (0,0) to (n-1,n-1) such that
#    the minimum of these precomputed distances along the path is maximized.
# 3. This is a classic problem that can be solved using Binary Search on the answer (safeness factor).
#    For a given potential safeness factor 'k', we check if a path exists from (0,0) to (n-1,n-1)
#    where every cell on the path has a precomputed distance to a thief of at least 'k'.
# 4. The check for a given 'k' can be done using BFS or DFS. We only consider cells (r, c)
#    where `dist_to_thief[r][c] >= k`.
#
# Time Complexity:
# - Step 1 (Precomputing distances): O(N*N), where N is the dimension of the grid.
#   This is because each cell is visited at most once by the BFS.
# - Step 3 & 4 (Binary Search and Path Checking): The binary search performs log(MaxDistance) iterations.
#   The maximum possible Manhattan distance is 2*(N-1). So, log(N) iterations.
#   Inside each iteration, the path checking (BFS/DFS) takes O(N*N) time.
#   Therefore, the overall time complexity is O(N*N * log(N)).
#
# Space Complexity:
# - O(N*N) for storing the distance matrix and the BFS queue.

import collections
import heapq

class Solution:
    def maximumSafenessFactor(self, grid: list[list[int]]) -> int:
        n = len(grid)
        
        # Step 1: Precompute minimum distance from each cell to the nearest thief using BFS.
        # Initialize distances with infinity.
        dist_to_thief = [[float('inf')] * n for _ in range(n)]
        
        # Queue for BFS, storing (distance, row, col)
        q = collections.deque()
        
        # Add all thief locations to the queue with distance 0.
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 1:
                    dist_to_thief[r][c] = 0
                    q.append((r, c))
        
        # Directions for BFS (up, down, left, right)
        dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        
        # Perform BFS to calculate minimum distances.
        while q:
            r, c = q.popleft()
            
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                
                # Check if the neighbor is within grid bounds.
                if 0 <= nr < n and 0 <= nc < n:
                    # If the current path to the neighbor is shorter than its recorded distance, update it.
                    # The distance to the neighbor is one more than the current cell's distance.
                    if dist_to_thief[r][c] + 1 < dist_to_thief[nr][nc]:
                        dist_to_thief[nr][nc] = dist_to_thief[r][c] + 1
                        q.append((nr, nc))

        # Step 2: Binary Search for the maximum safeness factor.
        # The possible safeness factors range from 0 to 2*(n-1) (max Manhattan distance).
        low = 0
        high = 2 * (n - 1)
        max_safeness = 0
        
        # Iterate while the search space is valid.
        while low <= high:
            mid = (low + high) // 2 # Current potential safeness factor.
            
            # Step 3 & 4: Check if a path exists with a minimum safeness factor of 'mid'.
            # We use BFS for path checking.
            if self.can_reach_end(grid, dist_to_thief, mid):
                # If a path exists with safeness 'mid', it means we might be able to achieve a higher safeness.
                # Store 'mid' as a potential answer and try for higher values.
                max_safeness = mid
                low = mid + 1
            else:
                # If no path exists with safeness 'mid', we need to aim for a lower safeness factor.
                high = mid - 1
                
        return max_safeness

    def can_reach_end(self, grid: list[list[int]], dist_to_thief: list[list[int]], min_safeness: int) -> bool:
        """
        Checks if there is a path from (0,0) to (n-1,n-1) where every cell's
        distance to the nearest thief is at least 'min_safeness'.
        """
        n = len(grid)
        
        # If the starting or ending cell itself is unsafe (less than min_safeness),
        # then no path can exist.
        if dist_to_thief[0][0] < min_safeness or dist_to_thief[n-1][n-1] < min_safeness:
            return False
        
        # Queue for BFS, storing (row, col).
        q = collections.deque()
        # Set to keep track of visited cells to avoid cycles.
        visited = set()
        
        # Add the starting cell to the queue and mark as visited.
        q.append((0, 0))
        visited.add((0, 0))
        
        # Directions for BFS.
        dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        
        # Perform BFS.
        while q:
            r, c = q.popleft()
            
            # If we reached the destination, return True.
            if r == n - 1 and c == n - 1:
                return True
            
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                
                # Check if the neighbor is within bounds, has not been visited,
                # and its distance to the nearest thief is at least 'min_safeness'.
                if (0 <= nr < n and 0 <= nc < n and
                    (nr, nc) not in visited and
                    dist_to_thief[nr][nc] >= min_safeness):
                    
                    # Add the valid neighbor to the queue and mark as visited.
                    q.append((nr, nc))
                    visited.add((nr, nc))
                    
        # If the BFS completes without reaching the destination, it means no such path exists.
        return False

```