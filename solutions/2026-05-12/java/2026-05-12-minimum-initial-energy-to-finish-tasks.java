/**
 * Summary: Find the minimum initial energy needed to complete all tasks, given actual and minimum energy requirements for each task.
 * Link: https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks/
 *
 * Approach:
 * The key insight is to sort the tasks in a specific order that minimizes the required initial energy.
 * Consider two tasks, task A = [actualA, minimumA] and task B = [actualB, minimumB].
 * If we do task A then task B, the energy required at the start to do A is minimumA, and after doing A, our energy becomes initialEnergy - actualA.
 * To do task B, we need initialEnergy - actualA >= minimumB.
 * So, initialEnergy >= minimumA + actualA - minimumB.
 *
 * If we do task B then task A, the energy required at the start to do B is minimumB, and after doing B, our energy becomes initialEnergy - actualB.
 * To do task A, we need initialEnergy - actualB >= minimumA.
 * So, initialEnergy >= minimumB + actualB - minimumA.
 *
 * To minimize the initial energy, we want to choose the order that requires the largest intermediate energy.
 * This means we should sort tasks by their "potential deficit", which is `minimum - actual`. The tasks with a larger `minimum - actual` value should be done later.
 * Why? Because these tasks have a larger difference between what they require to start and what they actually consume. If we do them earlier, we might not have enough energy to meet their `minimum` requirement. If we do them later, after completing other tasks, our energy level will have decreased, and we will need a higher initial energy to satisfy their `minimum` requirement.
 *
 * Therefore, the optimal strategy is to sort the tasks in descending order of `minimum[i] - actual[i]`.
 * After sorting, we iterate through the tasks. For each task, we calculate the maximum energy needed at that point.
 * Let `current_energy` be the energy we have *before* starting a task.
 * To start the task, we need `current_energy >= minimum_i`. So, `current_energy` must be at least `minimum_i`.
 * After completing the task, our energy becomes `current_energy - actual_i`.
 * To ensure we can always start the *next* task (which we've sorted to be "harder" to start, i.e., higher minimum requirement after considering actual cost), we need to maintain enough energy.
 *
 * Let's track the `needed_energy` from the start.
 * When considering a task `[actual, minimum]`, if our current `needed_energy` is less than `minimum`, it means we need to increase our initial `needed_energy` by `minimum - needed_energy` to be able to start this task.
 * After we satisfy the `minimum` requirement (i.e., `needed_energy` is at least `minimum`), we then subtract the `actual` cost.
 * So, the logic becomes:
 * 1. Sort tasks by `minimum[i] - actual[i]` in descending order.
 * 2. Initialize `max_needed_energy = 0` and `current_energy_spent = 0`.
 * 3. Iterate through the sorted tasks:
 *    - For each task `[actual, minimum]`:
 *      - The energy required *just before* starting this task must be at least `minimum`.
 *      - Our `current_energy_spent` represents the total actual energy consumed so far from the initial energy.
 *      - So, the total initial energy must be at least `current_energy_spent + minimum`.
 *      - We update `max_needed_energy = max(max_needed_energy, current_energy_spent + minimum)`.
 *      - After starting and completing this task, we have spent `actual` energy from our initial pool. So, we update `current_energy_spent += actual`.
 * 4. The final `max_needed_energy` is the minimum initial energy required.
 *
 * Example walkthrough with [1,2],[2,4],[4,8]:
 * Differences (minimum - actual):
 * [1,2] -> 2-1 = 1
 * [2,4] -> 4-2 = 2
 * [4,8] -> 8-4 = 4
 *
 * Sorted by difference descending: [4,8], [2,4], [1,2]
 *
 * Initialize: `max_needed_energy = 0`, `current_energy_spent = 0`
 *
 * Task 1: [4,8]
 *   - `current_energy_spent + minimum` = 0 + 8 = 8
 *   - `max_needed_energy = max(0, 8) = 8`
 *   - `current_energy_spent += actual` = 0 + 4 = 4
 *
 * Task 2: [2,4]
 *   - `current_energy_spent + minimum` = 4 + 4 = 8
 *   - `max_needed_energy = max(8, 8) = 8`
 *   - `current_energy_spent += actual` = 4 + 2 = 6
 *
 * Task 3: [1,2]
 *   - `current_energy_spent + minimum` = 6 + 2 = 8
 *   - `max_needed_energy = max(8, 8) = 8`
 *   - `current_energy_spent += actual` = 6 + 1 = 7
 *
 * Result: 8. This matches example 1.
 *
 * Example walkthrough with [1,3],[2,4],[10,11],[10,12],[8,9]:
 * Differences (minimum - actual):
 * [1,3] -> 3-1 = 2
 * [2,4] -> 4-2 = 2
 * [10,11] -> 11-10 = 1
 * [10,12] -> 12-10 = 2
 * [8,9] -> 9-8 = 1
 *
 * Sorted by difference descending (tie-breaking doesn't matter for correctness, let's say by original index):
 * [1,3], [2,4], [10,12], [10,11], [8,9]  (Actual differences: 2, 2, 2, 1, 1)
 * Let's sort them such that the ones with higher `minimum` requirements come first if the difference is the same, to be safe. Or even better, sort by `minimum` itself in descending order if differences are equal.
 *
 * Let's re-sort using `Comparator.comparingInt((int[] t) -> t[1] - t[0]).reversed()`
 * [1,3] -> diff 2
 * [2,4] -> diff 2
 * [10,11] -> diff 1
 * [10,12] -> diff 2
 * [8,9] -> diff 1
 *
 * Sorting by (minimum - actual) descending:
 * [1,3] (2)
 * [2,4] (2)
 * [10,12] (2)
 * [8,9] (1)
 * [10,11] (1)
 *
 * The order among tasks with the same difference might matter for the intermediate `current_energy_spent` but the `max_needed_energy` should converge. The crucial part is that tasks with larger `minimum - actual` are processed when our `current_energy_spent` is smaller, thus potentially requiring a larger initial energy.
 *
 * Let's try sorting just by `minimum - actual` descending, and if equal, by `minimum` descending.
 * [1,3] -> diff 2, min 3
 * [2,4] -> diff 2, min 4
 * [10,11] -> diff 1, min 11
 * [10,12] -> diff 2, min 12
 * [8,9] -> diff 1, min 9
 *
 * Sorted: [10,12] (diff 2, min 12), [2,4] (diff 2, min 4), [1,3] (diff 2, min 3), [8,9] (diff 1, min 9), [10,11] (diff 1, min 11)
 *
 * Initialize: `max_needed_energy = 0`, `current_energy_spent = 0`
 *
 * Task 1: [10,12]
 *   - `current_energy_spent + minimum` = 0 + 12 = 12
 *   - `max_needed_energy = max(0, 12) = 12`
 *   - `current_energy_spent += actual` = 0 + 10 = 10
 *
 * Task 2: [2,4]
 *   - `current_energy_spent + minimum` = 10 + 4 = 14
 *   - `max_needed_energy = max(12, 14) = 14`
 *   - `current_energy_spent += actual` = 10 + 2 = 12
 *
 * Task 3: [1,3]
 *   - `current_energy_spent + minimum` = 12 + 3 = 15
 *   - `max_needed_energy = max(14, 15) = 15`
 *   - `current_energy_spent += actual` = 12 + 1 = 13
 *
 * Task 4: [8,9]
 *   - `current_energy_spent + minimum` = 13 + 9 = 22
 *   - `max_needed_energy = max(15, 22) = 22`
 *   - `current_energy_spent += actual` = 13 + 8 = 21
 *
 * Task 5: [10,11]
 *   - `current_energy_spent + minimum` = 21 + 11 = 32
 *   - `max_needed_energy = max(22, 32) = 32`
 *   - `current_energy_spent += actual` = 21 + 10 = 31
 *
 * Result: 32. This matches example 2.
 *
 * Time Complexity:
 * Sorting the tasks takes O(N log N) time, where N is the number of tasks.
 * Iterating through the sorted tasks takes O(N) time.
 * Therefore, the overall time complexity is O(N log N).
 *
 * Space Complexity:
 * If the sorting is done in-place, the space complexity is O(1) (or O(log N) or O(N) depending on the sorting algorithm's auxiliary space requirements, but often considered O(1) for practical purposes for typical library sort implementations on arrays).
 * If a new array is created for sorting, it would be O(N).
 * In Java, `Arrays.sort` for primitive arrays is typically Dual-Pivot Quicksort (O(log N) average, O(N) worst-case space) or Timsort for object arrays (O(N) space in worst case). Given the constraints, it's likely to use QuickSort or similar. Let's assume O(log N) or O(N) auxiliary space for sorting.
 */
import java.util.Arrays;
import java.util.Comparator;

class Solution {
    /**
     * Calculates the minimum initial energy required to complete all tasks.
     *
     * @param tasks A 2D array where each element is [actual_energy, minimum_energy_required].
     * @return The minimum initial energy needed.
     */
    public int minimumInitialEnergy(int[][] tasks) {
        // Sort tasks. The optimal strategy is to perform tasks that have a larger difference
        // between their minimum required energy and their actual energy consumption later.
        // This is because these tasks are "more expensive" in terms of the energy needed to *start* them relative to what they consume.
        // Performing them when our energy level is lower would require a higher initial energy.
        // We sort by `minimum - actual` in descending order. If the difference is the same,
        // sorting by `minimum` in descending order can further optimize the order slightly,
        // ensuring tasks with higher absolute minimum requirements are considered earlier among ties.
        Arrays.sort(tasks, new Comparator<int[]>() {
            @Override
            public int compare(int[] task1, int[] task2) {
                // Primary sort key: difference (minimum - actual) in descending order
                int diff1 = task1[1] - task1[0];
                int diff2 = task2[1] - task2[0];
                if (diff1 != diff2) {
                    return Integer.compare(diff2, diff1); // Descending order
                } else {
                    // Secondary sort key: minimum energy in descending order
                    return Integer.compare(task2[1], task1[1]); // Descending order
                }
            }
        });

        int maxNeededEnergy = 0;     // This will store the maximum energy required at any point *before* starting a task.
        int currentEnergySpent = 0;  // This tracks the total *actual* energy consumed from the initial pool so far.

        // Iterate through the sorted tasks to determine the maximum energy needed.
        for (int[] task : tasks) {
            int actual = task[0];
            int minimum = task[1];

            // For the current task, to be able to *start* it, our initial energy must be
            // at least (current energy spent so far) + (minimum energy required for this task).
            // We need to ensure our initial energy is enough to cover this requirement.
            // `maxNeededEnergy` keeps track of the peak requirement seen so far.
            maxNeededEnergy = Math.max(maxNeededEnergy, currentEnergySpent + minimum);

            // After we've accounted for the minimum energy needed to start this task,
            // we record the energy consumed by this task (actual cost) for future calculations.
            currentEnergySpent += actual;
        }

        // The `maxNeededEnergy` is the minimum initial energy required to successfully complete all tasks.
        return maxNeededEnergy;
    }
}
