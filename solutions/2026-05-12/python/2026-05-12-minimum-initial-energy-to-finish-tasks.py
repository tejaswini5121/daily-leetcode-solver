```python
# Problem Summary: Find the minimum initial energy needed to complete a set of tasks,
# where each task requires a minimum energy to start and consumes a certain amount of energy.
# Link: https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks/
#
# Approach:
# The key insight is that to minimize the initial energy, we should prioritize tasks
# that have a larger difference between their minimum required energy and their actual
# energy consumption. This is because these tasks are the "tightest" constraints.
# If we have enough energy to start a task with a high `minimum` and a low `actual`,
# we will have more leftover energy for subsequent tasks compared to doing a task
# with a low `minimum` and a high `actual`.
#
# Therefore, we sort the tasks in descending order based on the difference
# `minimum_i - actual_i`. This greedy strategy ensures that we tackle the most
# demanding tasks (in terms of their "slack") first.
#
# After sorting, we iterate through the tasks. We maintain a running sum of the
# energy *actually* consumed by the tasks we've decided to do so far. For each task,
# the minimum energy required to start it must be at least the current energy we
# have *plus* the energy we will have *after* completing all the tasks we've
# already committed to (which is represented by the running sum of actual consumptions).
#
# Let `current_energy` be the energy we have before considering the current task.
# Let `total_actual_consumed` be the sum of `actual_i` for tasks already processed.
# For the current task `[actual_i, minimum_i]`:
# We need `minimum_i` energy to start this task.
# The energy we will have when we start this task is `initial_energy - total_actual_consumed`.
# So, we must have `initial_energy - total_actual_consumed >= minimum_i`.
# This implies `initial_energy >= minimum_i + total_actual_consumed`.
# To find the minimum initial energy, we take the maximum of all such required initial energies.
#
# A simpler way to think about it:
# We process tasks in sorted order (descending `minimum - actual`).
# We keep track of the `total_energy_spent` so far (sum of `actual`s).
# For each task `[actual, minimum]`, the required initial energy must be at least
# `minimum + total_energy_spent`. This is because to start the current task, we need `minimum` energy,
# and we also need to account for the energy that will be spent on all tasks processed *after*
# the current one, which is `total_energy_spent`.
#
# So, we iterate through the sorted tasks, and for each task, we calculate the minimum
# initial energy required *up to that point* to complete it and all preceding tasks.
# The overall minimum initial energy will be the maximum of these per-task minimums.
#
# Time Complexity: O(N log N) due to sorting the tasks.
# Space Complexity: O(N) or O(log N) depending on the sorting algorithm implementation (for recursion stack or auxiliary space).
class Solution:
    def minimumInitialEnergy(self, tasks: list[list[int]]) -> int:
        # Sort tasks in descending order based on the difference between minimum and actual energy.
        # This prioritizes tasks that require more "reserve" energy.
        # The difference (minimum_i - actual_i) tells us how much "slack" there is.
        # A larger difference means we need a higher minimum relative to consumption.
        # Sorting by `minimum - actual` descending means tasks with less slack come first.
        # Example: [1, 10] vs [5, 6].
        # [1, 10]: diff = 9. Needs 10 min, uses 1.
        # [5, 6]: diff = 1. Needs 6 min, uses 5.
        # If we do [5, 6] first: Need 6. Energy becomes 6-5=1. Cannot do [1, 10].
        # If we do [1, 10] first: Need 10. Energy becomes 10-1=9. Now we need to do [5, 6].
        #   To start [5, 6], we need 6. We have 9. Ok. Energy becomes 9-5=4.
        # The sort key `x[1] - x[0]` ensures tasks with higher `minimum` relative to `actual` are considered earlier.
        tasks.sort(key=lambda x: x[1] - x[0], reverse=True)

        # Initialize total energy spent (actual consumption) so far to 0.
        total_actual_consumed = 0
        # Initialize the minimum initial energy required to 0. This will be updated.
        min_initial_energy = 0

        # Iterate through the sorted tasks.
        for actual, minimum in tasks:
            # For the current task, the initial energy must be at least:
            # the minimum energy required to start it (`minimum`)
            # PLUS the total energy that will be consumed by all tasks processed *after* this one.
            # `total_actual_consumed` represents the energy that will be spent by tasks
            # we have already committed to completing (which were sorted to come *after* the current one).
            #
            # To be more precise:
            # Let E_init be the initial energy.
            # Let E_current be the energy we have right now.
            # When we are about to start the current task `[actual, minimum]`,
            # we have already completed some tasks, and their total actual consumption is `total_actual_consumed`.
            # So, our current energy is `E_init - total_actual_consumed`.
            # To start the current task, we must have `E_init - total_actual_consumed >= minimum`.
            # Rearranging this, `E_init >= minimum + total_actual_consumed`.
            # We want to find the minimum `E_init` that satisfies this for all tasks.
            # So, `min_initial_energy` should be the maximum of `minimum + total_actual_consumed` across all tasks.
            required_energy_for_this_task = minimum + total_actual_consumed
            min_initial_energy = max(min_initial_energy, required_energy_for_this_task)

            # Update the total actual energy consumed by adding the current task's actual consumption.
            total_actual_consumed += actual

        # The `min_initial_energy` calculated is the maximum required at any point to start a task.
        # This maximum value is the minimum initial energy needed to complete all tasks.
        return min_initial_energy

```