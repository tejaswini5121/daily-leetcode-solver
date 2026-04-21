```python
# Summary: Minimize Hamming distance between source and target arrays using allowed swaps.
# Link: https://leetcode.com/problems/minimize-hamming-distance-after-swap-operations/
#
# Approach:
# The core idea is that if two indices can be swapped (directly or indirectly),
# then the elements at those indices belong to the same "connected component".
# We can use a Union-Find data structure to group indices that are swappable.
#
# For each connected component:
# 1. Collect all elements from `source` that are at indices within this component.
# 2. Collect all elements from `target` that are at indices within this component.
# 3. To minimize the Hamming distance within this component, we should try to match
#    the counts of elements. If the multiset of elements from `source` within the
#    component is the same as the multiset of elements from `target` within the
#    component, then we can achieve 0 Hamming distance for all indices in this component.
#    Otherwise, the minimum number of mismatches will be the total number of elements
#    in the component minus the size of the intersection of the two multisets.
#
# We can use `collections.Counter` to efficiently count elements in each multiset.
#
# Algorithm:
# 1. Initialize a Union-Find data structure for `n` elements.
# 2. Iterate through `allowedSwaps` and `union` the elements at `ai` and `bi` in the Union-Find.
# 3. Create a dictionary `components` where keys are the root of each component (from Union-Find)
#    and values are lists of indices belonging to that component.
# 4. Iterate through `source` and `target` arrays:
#    - For each index `i`, find its root `r` using `find(i)`.
#    - Add `source[i]` to a `source_counts` counter for root `r`.
#    - Add `target[i]` to a `target_counts` counter for root `r`.
# 5. Initialize `min_hamming_distance = 0`.
# 6. Iterate through each root `r` in `components`:
#    - Get the `source_counter` and `target_counter` for this root.
#    - Iterate through the unique elements in `source_counter`:
#        - `count_in_source = source_counter[element]`
#        - `count_in_target = target_counter.get(element, 0)`
#        - `matched_elements = min(count_in_source, count_in_target)`
#        - `unmatched_source_elements = count_in_source - matched_elements`
#        - `min_hamming_distance += unmatched_source_elements`
# 7. Return `min_hamming_distance`.
#
# Time Complexity:
# - Union-Find initialization: O(n)
# - Processing `allowedSwaps`: O(m * alpha(n)), where m is the number of swaps and alpha is the inverse Ackermann function (nearly constant).
# - Grouping indices into components: O(n)
# - Counting elements in source and target for each component: O(n)
# - Calculating mismatches for each component: O(n) (sum of counts across all components)
# Overall: O(n + m * alpha(n)), which is effectively O(n + m).
#
# Space Complexity:
# - Union-Find parent array: O(n)
# - Union-Find rank/size array: O(n)
# - `components` dictionary: O(n) in the worst case (each index in its own component).
# - `source_counts` and `target_counts` (Counters): O(n) in the worst case (all unique elements across all components).
# Overall: O(n).

import collections

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i):
        if self.parent[i] != i:
            self.parent[i] = self.find(self.parent[i]) # Path compression
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            if self.rank[root_i] < self.rank[root_j]:
                self.parent[root_i] = root_j
            elif self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            else:
                self.parent[root_j] = root_i
                self.rank[root_i] += 1
            return True
        return False

class Solution:
    def minHammingDistance(self, source: list[int], target: list[int], allowedSwaps: list[list[int]]) -> int:
        n = len(source)
        uf = UnionFind(n)

        # 1. Build connected components using Union-Find
        for u, v in allowedSwaps:
            uf.union(u, v)

        # 2. Group indices by their connected component root
        # `components_indices` maps root -> list of indices in that component
        components_indices = collections.defaultdict(list)
        for i in range(n):
            root = uf.find(i)
            components_indices[root].append(i)

        min_hamming_distance = 0

        # 3. For each component, compare multisets of source and target elements
        for root, indices in components_indices.items():
            # Count elements from source and target for the current component
            source_counts = collections.Counter()
            target_counts = collections.Counter()

            for idx in indices:
                source_counts[source[idx]] += 1
                target_counts[target[idx]] += 1

            # Calculate the number of elements that *cannot* be matched within this component
            # These unmatched elements will contribute to the Hamming distance.
            unmatched_elements = 0
            # Iterate through all unique elements present in either source or target counts
            all_elements_in_component = set(source_counts.keys()) | set(target_counts.keys())

            for element in all_elements_in_component:
                count_in_source = source_counts.get(element, 0)
                count_in_target = target_counts.get(element, 0)

                # The number of elements that can be matched is the minimum of their counts.
                # The number of elements that are "left over" (unmatched) contributes to the distance.
                # We want to find how many elements from `source` within this component
                # cannot find a matching counterpart from `target` within the same component.
                # This is equivalent to: total elements in source for this component
                # minus the number of elements that can be matched.
                #
                # Alternatively, consider the total number of elements in the component.
                # If source_counts and target_counts are identical multisets, all can be matched.
                # If not, the number of mismatches is `len(indices)` - `size_of_intersection`.
                #
                # A simpler way to calculate mismatches for this component:
                # Total number of elements we have in `source` for this component's indices.
                # Number of elements that can be matched with `target`'s elements in the same component.
                # The difference is the minimum number of elements in `source` that must remain
                # mismatched with `target` within this component.
                matched_count = min(count_in_source, count_in_target)
                unmatched_elements += (count_in_source - matched_count)

            min_hamming_distance += unmatched_elements

        return min_hamming_distance

```