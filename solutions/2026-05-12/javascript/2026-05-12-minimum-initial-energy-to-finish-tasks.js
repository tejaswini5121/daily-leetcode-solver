/**
 * @file LeetCode Problem: Minimum Initial Energy to Finish Tasks
 * @brief Given tasks with actual and minimum energy requirements, find the minimum initial energy to complete all tasks in any order.
 * @link https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks/
 *
 * @approach
 * The key insight to this problem is to process the tasks in an order that minimizes the required initial energy.
 * If we have a task that requires a high minimum energy but has a low actual energy cost, it's more beneficial to perform it later.
 * This is because when we perform it later, we have already accumulated some energy from previous tasks, and our current energy level will be higher.
 * Conversely, tasks with a large difference between minimum and actual energy (meaning they "cost" a lot of potential energy) should ideally be done when our current energy is as high as possible.
 *
 * Consider two tasks: Task A ([actualA, minimumA]) and Task B ([actualB, minimumB]).
 * If we do A then B:
 * Initial energy E.
 * To do A: E >= minimumA. Energy after A: E - actualA.
 * To do B: E - actualA >= minimumB.
 * So, E >= minimumA and E >= minimumB + actualA.
 *
 * If we do B then A:
 * Initial energy E.
 * To do B: E >= minimumB. Energy after B: E - actualB.
 * To do A: E - actualB >= minimumA.
 * So, E >= minimumB and E >= minimumA + actualB.
 *
 * We want to find an ordering such that the maximum of these lower bounds is minimized.
 *
 * Let's consider the condition for task A to be done before task B.
 * If we do A first, we need E >= minimumA and E - actualA >= minimumB, which means E >= minimumB + actualA.
 * If we do B first, we need E >= minimumB and E - actualB >= minimumA, which means E >= minimumA + actualB.
 *
 * We want to choose the order that requires less initial energy.
 * The critical observation is that we should prioritize tasks where `minimumi - actuali` is larger.
 * Tasks with a larger `minimumi - actuali` value represent a larger "gap" between the energy required to start and the energy actually spent. These tasks pose a greater risk of not being able to start if our energy is just barely enough for the `actuali` cost.
 * Therefore, it's optimal to sort the tasks in descending order of `minimumi - actuali`.
 *
 * After sorting, we iterate through the tasks. For each task, we calculate the *maximum* energy required at that point.
 * If our current energy is `current_energy`, and we are about to do task `[actual, minimum]`, we need `current_energy >= minimum`.
 * If `current_energy < minimum`, we *must* have started with enough initial energy to cover this deficit.
 * The total energy needed to finish a task is `actual`.
 *
 * Let's rephrase the greedy strategy:
 * Sort tasks by `minimumi - actuali` in descending order.
 * Iterate through the sorted tasks.
 * Maintain `required_energy` which is the maximum energy we *must* have had at some point to satisfy all preceding minimum requirements and actual expenditures.
 * For each task `[actual, minimum]`:
 *   The energy we need *before* this task is `minimum`.
 *   The energy we will have *after* this task is `current_energy_before_task - actual`.
 *
 *   Let's think about the *final* energy. We want to find the minimum initial energy.
 *   Consider the tasks in reverse order of processing.
 *   If we have `current_energy` after completing all tasks, and the last task was `[actual_last, minimum_last]`, then before doing the last task, we must have had `current_energy + actual_last` energy, and this amount must have been at least `minimum_last`.
 *   So, `current_energy + actual_last >= minimum_last`.
 *
 *   Let's use the sorted order (descending `minimum - actual`).
 *   Iterate through the tasks. Keep track of the `current_energy` available and the `max_initial_energy_needed`.
 *   For each task `[actual, minimum]`:
 *     If `current_energy < minimum`:
 *       We need `minimum - current_energy` more energy *just to start this task*.
 *       This deficit needs to be covered by our initial energy.
 *       So, `max_initial_energy_needed += (minimum - current_energy)`.
 *       Our `current_energy` effectively becomes `minimum` (because we just got the energy to start).
 *     `current_energy -= actual` (we spend the actual energy).
 *
 *   This greedy approach of sorting by `minimum - actual` (descending) and then simulating the process works.
 *   Let's refine the simulation:
 *   Sort tasks by `minimum - actual` in descending order.
 *   Initialize `initial_energy = 0`.
 *   Initialize `current_energy_balance = 0`. (This represents the *surplus* energy accumulated so far if we had enough initial energy).
 *
 *   Iterate through the sorted tasks `[actual, minimum]`:
 *     // We need at least `minimum` energy to start this task.
 *     // The energy we have available right now, considering potential initial energy, is `initial_energy + current_energy_balance`.
 *     // We need `initial_energy + current_energy_balance >= minimum`.
 *     // If this condition is not met, we need to increase `initial_energy`.
 *     // The deficit is `minimum - (initial_energy + current_energy_balance)`.
 *     // If deficit is positive, we add it to `initial_energy`.
 *     // `initial_energy = max(initial_energy, minimum - current_energy_balance)`
 *     // This is equivalent to: if `initial_energy + current_energy_balance < minimum`, we need to increase `initial_energy`.
 *
 *     // A simpler way to think about the required initial energy for the *current* task:
 *     // The minimum energy we *must* have had before this task is `minimum`.
 *     // The energy we *will have* after this task is `energy_before_task - actual`.
 *     // Let `E_init` be the initial energy.
 *     // Let `E_curr` be the energy at any point.
 *
 *     // Revisit the logic:
 *     // Sort tasks by `minimumi - actuali` in descending order.
 *     // Iterate through tasks. Maintain `needed_energy`.
 *     // For each task `[actual, minimum]`:
 *     //   The energy we HAVE before this task is `current_energy_available`.
 *     //   We need `current_energy_available >= minimum`.
 *     //   If `current_energy_available < minimum`, we need `minimum - current_energy_available` extra energy. This extra energy must come from the initial energy.
 *     //   So, `needed_energy = max(needed_energy, minimum - current_energy_available)`.
 *     //   After ensuring we can start, our energy becomes `current_energy_available + (minimum - current_energy_available)` if we had to "top up", or just `current_energy_available` if it was already sufficient.
 *     //   This logic is getting complicated. Let's try a simpler simulation.
 *
 *     // **Correct Greedy Approach:**
 *     // Sort tasks in descending order of `minimumi - actuali`. This prioritizes tasks that require a larger "buffer" to start.
 *     // Iterate through the sorted tasks. Maintain `current_energy`.
 *     // For each task `[actual, minimum]`:
 *     //   If `current_energy < minimum`:
 *     //     This means we cannot even start the task with our current energy.
 *     //     The deficit is `minimum - current_energy`.
 *     //     This deficit *must* have been covered by the initial energy.
 *     //     So, we add this deficit to our `initial_energy` requirement.
 *     //     `initial_energy += (minimum - current_energy)`.
 *     //     Now, our `current_energy` can be thought of as becoming `minimum` (since we just added the deficit).
 *     //   After ensuring we can start (either `current_energy` was already `>= minimum`, or we topped it up), we spend the actual energy:
 *     //   `current_energy -= actual`.
 *
 *     // Let's trace Example 1: tasks = [[1,2],[2,4],[4,8]]
 *     // Differences: [1,2] -> 2-1=1, [2,4] -> 4-2=2, [4,8] -> 8-4=4.
 *     // Sorted by diff descending: [[4,8], [2,4], [1,2]]
 *     //
 *     // Initialize: `initial_energy = 0`, `current_energy = 0`.
 *     //
 *     // Task 1: [4,8]
 *     // `current_energy` (0) < `minimum` (8).
 *     // Deficit = 8 - 0 = 8.
 *     // `initial_energy` += 8. So, `initial_energy = 8`.
 *     // `current_energy` effectively becomes 8.
 *     // `current_energy` -= `actual` (4). So, `current_energy = 8 - 4 = 4`.
 *     //
 *     // Task 2: [2,4]
 *     // `current_energy` (4) >= `minimum` (4). No deficit.
 *     // `current_energy` -= `actual` (2). So, `current_energy = 4 - 2 = 2`.
 *     //
 *     // Task 3: [1,2]
 *     // `current_energy` (2) >= `minimum` (2). No deficit.
 *     // `current_energy` -= `actual` (1). So, `current_energy = 2 - 1 = 1`.
 *     //
 *     // Final `initial_energy = 8`. This matches the example.
 *
 *     // Let's trace Example 2: tasks = [[1,3],[2,4],[10,11],[10,12],[8,9]]
 *     // Differences:
 *     // [1,3] -> 3-1=2
 *     // [2,4] -> 4-2=2
 *     // [10,11] -> 11-10=1
 *     // [10,12] -> 12-10=2
 *     // [8,9] -> 9-8=1
 *     //
 *     // Tasks with diff 2: [1,3], [2,4], [10,12]
 *     // Tasks with diff 1: [10,11], [8,9]
 *     //
 *     // Sorting by `minimum - actual` descending:
 *     // The tasks with `minimum - actual = 2` should come first. Their relative order among themselves doesn't strictly matter based on this difference, but it might matter for the total energy. Let's sort them by `minimum` descending if differences are equal, as a tie-breaker. This is a common heuristic for greedy.
 *     // If `minimumi - actuali` is the same, we should process the one with a higher `minimumi` first. Why? Because a higher `minimumi` implies a greater *potential* requirement, and we want to satisfy that when we are aiming for higher initial energy values.
 *     //
 *     // Let's sort by `minimum - actual` descending, then `minimum` descending.
 *     // Tasks:
 *     // [1,3] -> diff 2, min 3
 *     // [2,4] -> diff 2, min 4
 *     // [10,12] -> diff 2, min 12
 *     // [10,11] -> diff 1, min 11
 *     // [8,9] -> diff 1, min 9
 *     //
 *     // Sorted: [[10,12], [2,4], [1,3], [10,11], [8,9]]
 *     //
 *     // Initialize: `initial_energy = 0`, `current_energy = 0`.
 *     //
 *     // Task 1: [10,12]
 *     // `current_energy` (0) < `minimum` (12).
 *     // Deficit = 12 - 0 = 12.
 *     // `initial_energy` += 12. So, `initial_energy = 12`.
 *     // `current_energy` effectively becomes 12.
 *     // `current_energy` -= `actual` (10). So, `current_energy = 12 - 10 = 2`.
 *     //
 *     // Task 2: [2,4]
 *     // `current_energy` (2) < `minimum` (4).
 *     // Deficit = 4 - 2 = 2.
 *     // `initial_energy` += 2. So, `initial_energy = 12 + 2 = 14`.
 *     // `current_energy` effectively becomes 4.
 *     // `current_energy` -= `actual` (2). So, `current_energy = 4 - 2 = 2`.
 *     //
 *     // Task 3: [1,3]
 *     // `current_energy` (2) < `minimum` (3).
 *     // Deficit = 3 - 2 = 1.
 *     // `initial_energy` += 1. So, `initial_energy = 14 + 1 = 15`.
 *     // `current_energy` effectively becomes 3.
 *     // `current_energy` -= `actual` (1). So, `current_energy = 3 - 1 = 2`.
 *     //
 *     // Task 4: [10,11]
 *     // `current_energy` (2) < `minimum` (11).
 *     // Deficit = 11 - 2 = 9.
 *     // `initial_energy` += 9. So, `initial_energy = 15 + 9 = 24`.
 *     // `current_energy` effectively becomes 11.
 *     // `current_energy` -= `actual` (10). So, `current_energy = 11 - 10 = 1`.
 *     //
 *     // Task 5: [8,9]
 *     // `current_energy` (1) < `minimum` (9).
 *     // Deficit = 9 - 1 = 8.
 *     // `initial_energy` += 8. So, `initial_energy = 24 + 8 = 32`.
 *     // `current_energy` effectively becomes 9.
 *     // `current_energy` -= `actual` (8). So, `current_energy = 9 - 8 = 1`.
 *     //
 *     // Final `initial_energy = 32`. This matches example 2.
 *
 *     // The sorting criteria `minimumi - actuali` descending is correct.
 *     // The tie-breaker `minimumi` descending also seems to be crucial.
 *     // Let's re-evaluate the simulation logic slightly.
 *     // We need to keep track of the `total_energy_spent_so_far` and the `maximum_minimum_required_so_far`.
 *     //
 *     // Let's try a different angle. What is the total energy expenditure? It's the sum of `actuali`.
 *     // Let `S` be the sum of all `actuali`.
 *     // We need initial energy `E_init`.
 *     // After all tasks, our energy is `E_init - S`.
 *     //
 *     // Consider the energy required at each step.
 *     // Let `E_i` be the energy *before* task `i`.
 *     // We need `E_i >= minimum_i`.
 *     // After task `i`, energy becomes `E_i - actual_i`.
 *     //
 *     // The crucial property for sorting comes from considering the "slack" or "margin" a task provides.
 *     // A task `[actual, minimum]` offers a margin of `minimum - actual`.
 *     // If we perform a task with a small margin, we might get stuck later if our energy is just enough for `actual` but not `minimum`.
 *     // If we sort by `minimum - actual` descending, we are prioritizing tasks that have a higher "safety net" requirement.
 *     //
 *     // Let's reconsider the `current_energy` simulation.
 *     // The variable `current_energy` in my trace above represents the energy we *would have* if we had just enough initial energy to pass the previous tasks and then reached the current state.
 *     //
 *     // Let's use `initial_energy_needed` and `current_energy_at_hand`.
 *     //
 *     // Sort tasks by `minimumi - actuali` descending. If `minimumi - actuali` are equal, sort by `minimumi` descending.
 *     //
 *     // Initialize:
 *     // `initial_energy_needed = 0`
 *     // `current_energy_at_hand = 0` (This represents the energy we have *after* some tasks are done, relative to the initial energy required. If initial energy is X, and we have done tasks that sum up to Y actual cost, and required Z minimum at peak, then current_energy_at_hand might be X - Y - Z. This is confusing.)
 *
 *     // Let's use the total sum of actual costs and the maximum *additional* energy needed at any point.
 *     //
 *     // Sort tasks: `tasks.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]) || b[1] - a[1]);`
 *     // This sorts by `minimum - actual` descending, then by `minimum` descending.
 *     //
 *     // `total_actual_energy_spent = 0`
 *     // `max_energy_needed_at_start = 0`
 *     //
 *     // For each task `[actual, minimum]` in sorted tasks:
 *     //   `total_actual_energy_spent += actual`
 *     //   // At this point, to start THIS task, we need at least `minimum` energy.
 *     //   // The energy we HAVE available is `initial_energy_we_started_with - energy_spent_on_previous_tasks`.
 *     //   // We need `initial_energy_we_started_with - energy_spent_on_previous_tasks >= minimum`.
 *     //   // This implies `initial_energy_we_started_with >= minimum + energy_spent_on_previous_tasks`.
 *     //   // The `energy_spent_on_previous_tasks` is variable.
 *     //
 *     //   Let's focus on the peak energy required.
 *     //   If we have `current_energy` at hand, and the next task needs `minimum`, and costs `actual`:
 *     //   If `current_energy < minimum`:
 *     //     We need an additional `minimum - current_energy`. This must come from initial energy.
 *     //     So, the *initial* energy must have been at least `(minimum - current_energy)` higher.
 *     //
 *     // Let's try the simulation variable `current_energy` more literally as the energy available *now*.
 *     //
 *     // Initialize:
 *     // `initial_energy = 0`
 *     // `current_energy_available = 0`
 *     //
 *     // Sort tasks by `minimum - actual` descending, then `minimum` descending.
 *     //
 *     // For each task `[actual, minimum]` in sorted tasks:
 *     //   // Check if we can start the task.
 *     //   if `current_energy_available < minimum`:
 *     //     // We need to increase our initial energy to meet this minimum requirement.
 *     //     // The difference `minimum - current_energy_available` is the energy deficit that needs to be covered by the initial energy.
 *     //     `initial_energy += (minimum - current_energy_available)`
 *     //     // After adding this energy, our current available energy conceptually becomes `minimum`.
 *     //     `current_energy_available = minimum` // This is a conceptual step, the actual energy is reduced by actual cost.
 *     //
 *     //   // Now we can perform the task.
 *     //   `current_energy_available -= actual`
 *
 *     // This logic seems sound and passed the examples.
 *     // The `current_energy_available` is tracking the energy *above* the absolute minimum requirement at any point.
 *     // If `current_energy_available` drops below zero, it means we actually had a deficit relative to the initial energy.
 *     //
 *     // Let's refine the simulation variable name for clarity.
 *     // `required_initial_energy` : accumulates the total minimum initial energy.
 *     // `current_energy_surplus` : represents the energy available *above* what was absolutely needed for past minimums.
 *     //
 *     // Initialize:
 *     // `required_initial_energy = 0`
 *     // `current_energy_surplus = 0`
 *     //
 *     // Sort tasks by `minimumi - actuali` descending, then `minimumi` descending.
 *     //
 *     // For each task `[actual, minimum]` in sorted tasks:
 *     //   // If the energy we have available for "surplus" is less than the minimum required for this task,
 *     //   // it means our current energy level is insufficient to start this task *even if we had enough initial energy to cover previous minimums*.
 *     //   // The amount we are short is `minimum - current_energy_surplus`.
 *     //   // This deficit must be covered by the initial energy.
 *     //   if `current_energy_surplus < minimum`:
 *     //     `deficit = minimum - current_energy_surplus`
 *     //     `required_initial_energy += deficit`
 *     //     // After covering the deficit, our "surplus" energy effectively becomes `minimum`.
 *     //     `current_energy_surplus = minimum`
 *     //
 *     //   // Now that we can start the task, we spend the actual energy.
 *     //   // The surplus energy decreases by the actual cost.
 *     //   `current_energy_surplus -= actual`
 *
 *     // Example 1 again: tasks = [[1,2],[2,4],[4,8]]
 *     // Sorted: [[4,8], [2,4], [1,2]]
 *     // Init: `required_initial_energy = 0`, `current_energy_surplus = 0`
 *     //
 *     // Task 1: [4,8]
 *     // `current_energy_surplus` (0) < `minimum` (8).
 *     // `deficit` = 8 - 0 = 8.
 *     // `required_initial_energy` += 8. So, `required_initial_energy = 8`.
 *     // `current_energy_surplus` = 8.
 *     // `current_energy_surplus` -= `actual` (4). So, `current_energy_surplus = 8 - 4 = 4`.
 *     //
 *     // Task 2: [2,4]
 *     // `current_energy_surplus` (4) >= `minimum` (4). No deficit.
 *     // `current_energy_surplus` -= `actual` (2). So, `current_energy_surplus = 4 - 2 = 2`.
 *     //
 *     // Task 3: [1,2]
 *     // `current_energy_surplus` (2) >= `minimum` (2). No deficit.
 *     // `current_energy_surplus` -= `actual` (1). So, `current_energy_surplus = 2 - 1 = 1`.
 *     //
 *     // Final `required_initial_energy = 8`. Correct.
 *
 *     // Example 2 again: tasks = [[1,3],[2,4],[10,11],[10,12],[8,9]]
 *     // Sorted: [[10,12], [2,4], [1,3], [10,11], [8,9]]
 *     // Init: `required_initial_energy = 0`, `current_energy_surplus = 0`
 *     //
 *     // Task 1: [10,12]
 *     // `current_energy_surplus` (0) < `minimum` (12).
 *     // `deficit` = 12 - 0 = 12.
 *     // `required_initial_energy` += 12. So, `required_initial_energy = 12`.
 *     // `current_energy_surplus` = 12.
 *     // `current_energy_surplus` -= `actual` (10). So, `current_energy_surplus = 12 - 10 = 2`.
 *     //
 *     // Task 2: [2,4]
 *     // `current_energy_surplus` (2) < `minimum` (4).
 *     // `deficit` = 4 - 2 = 2.
 *     // `required_initial_energy` += 2. So, `required_initial_energy = 12 + 2 = 14`.
 *     // `current_energy_surplus` = 4.
 *     // `current_energy_surplus` -= `actual` (2). So, `current_energy_surplus = 4 - 2 = 2`.
 *     //
 *     // Task 3: [1,3]
 *     // `current_energy_surplus` (2) < `minimum` (3).
 *     // `deficit` = 3 - 2 = 1.
 *     // `required_initial_energy` += 1. So, `required_initial_energy = 14 + 1 = 15`.
 *     // `current_energy_surplus` = 3.
 *     // `current_energy_surplus` -= `actual` (1). So, `current_energy_surplus = 3 - 1 = 2`.
 *     //
 *     // Task 4: [10,11]
 *     // `current_energy_surplus` (2) < `minimum` (11).
 *     // `deficit` = 11 - 2 = 9.
 *     // `required_initial_energy` += 9. So, `required_initial_energy = 15 + 9 = 24`.
 *     // `current_energy_surplus` = 11.
 *     // `current_energy_surplus` -= `actual` (10). So, `current_energy_surplus = 11 - 10 = 1`.
 *     //
 *     // Task 5: [8,9]
 *     // `current_energy_surplus` (1) < `minimum` (9).
 *     // `deficit` = 9 - 1 = 8.
 *     // `required_initial_energy` += 8. So, `required_initial_energy = 24 + 8 = 32`.
 *     // `current_energy_surplus` = 9.
 *     // `current_energy_surplus` -= `actual` (8). So, `current_energy_surplus = 9 - 8 = 1`.
 *     //
 *     // Final `required_initial_energy = 32`. Correct.
 *
 *     // This logic is consistent and passes examples. The sorting criteria is key.
 *     // `minimumi - actuali` indicates how much "extra" energy you need beyond the actual cost to satisfy the minimum requirement. Prioritizing tasks with higher `minimumi - actuali` means we address the tasks that are more "risky" or have a higher potential to cause a deficit earlier.
 *     // The tie-breaker of sorting by `minimumi` descending when `minimumi - actuali` is the same: this ensures that if two tasks have the same "risk", we tackle the one that *requires* a higher absolute energy level first. This makes sense because we are trying to build up enough initial energy to meet the highest possible minimum requirement.
 *
 * @timeComplexity
 * Sorting the tasks takes O(N log N) time, where N is the number of tasks.
 * Iterating through the sorted tasks takes O(N) time.
 * Therefore, the overall time complexity is dominated by sorting, which is O(N log N).
 *
 * @spaceComplexity
 * The space complexity is O(1) if we sort the array in-place, or O(N) if a new sorted array is created (depending on the sort implementation in JavaScript, it typically uses O(log N) or O(N) auxiliary space for the call stack or temporary storage). For typical JavaScript `Array.prototype.sort`, it can be O(N) in worst case for non-primitive types. Here, we are sorting objects, so it might take O(N) space for temporary storage. If we consider the input array modification, it's O(1) additional space.
 */
var minInitialEnergy = function(tasks) {
    // Sort the tasks. The primary sorting criterion is the difference between
    // minimum required energy and actual energy spent (minimum - actual), in descending order.
    // This prioritizes tasks that have a larger "buffer" or "safety net" requirement.
    // If two tasks have the same difference, the secondary criterion is the minimum energy
    // required (minimum), also in descending order. This ensures that among tasks with
    // the same difference, we tackle the one that demands a higher absolute energy level first,
    // as this is more critical to satisfy early on.
    tasks.sort((a, b) => {
        const diffA = a[1] - a[0]; // minimum - actual for task a
        const diffB = b[1] - b[0]; // minimum - actual for task b

        if (diffB !== diffA) {
            return diffB - diffA; // Sort by difference descending
        } else {
            return b[1] - a[1]; // If differences are equal, sort by minimum descending
        }
    });

    let requiredInitialEnergy = 0;
    let currentEnergySurplus = 0; // Represents the energy available above the absolute minimum requirement at the current step.

    // Iterate through the sorted tasks to determine the minimum initial energy needed.
    for (const task of tasks) {
        const actualCost = task[0];
        const minimumRequired = task[1];

        // If the current surplus energy is less than the minimum required for this task,
        // it means we don't have enough energy to even start it.
        // The deficit (minimumRequired - currentEnergySurplus) must be covered by the initial energy.
        if (currentEnergySurplus < minimumRequired) {
            const deficit = minimumRequired - currentEnergySurplus;
            requiredInitialEnergy += deficit; // Add the deficit to our total required initial energy.
            // After covering the deficit, our "surplus" energy effectively becomes the minimum required energy.
            // This is because we imagine we just got enough energy to start.
            currentEnergySurplus = minimumRequired;
        }

        // Now that we can start the task (either `currentEnergySurplus` was already sufficient,
        // or we covered the deficit), we spend the actual energy cost of the task.
        // The surplus energy decreases by the actual cost.
        currentEnergySurplus -= actualCost;
    }

    // The accumulated `requiredInitialEnergy` is the minimum initial energy needed to complete all tasks.
    return requiredInitialEnergy;
};
```