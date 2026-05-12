```cpp
/*
Problem Summary:
Given a list of tasks, each with an actual energy cost and a minimum required energy to start,
find the minimum initial energy needed to complete all tasks in any order.

Link: https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks/

Approach:
The key insight is to process tasks in an order that minimizes the initial energy requirement.
Consider two tasks, task A = [actualA, minimumA] and task B = [actualB, minimumB].
If we perform task A then task B, we need to ensure:
1. InitialEnergy >= minimumA
2. InitialEnergy - actualA >= minimumB
This simplifies to InitialEnergy >= minimumA and InitialEnergy >= minimumB + actualA.

If we perform task B then task A, we need to ensure:
1. InitialEnergy >= minimumB
2. InitialEnergy - actualB >= minimumA
This simplifies to InitialEnergy >= minimumB and InitialEnergy >= minimumA + actualB.

To minimize the initial energy, we want to perform tasks that have a larger 'gap' between
minimum required energy and actual energy spent, later. This is because completing these
tasks will deplete our energy more significantly relative to their minimum requirement.
If we have to start a task with a high minimum requirement, it's better if we've already
spent less energy on previous tasks.

Therefore, sorting the tasks by the difference (minimum - actual) in descending order seems intuitive.
However, a more robust approach that considers the interplay between current energy and minimum
requirement is to sort tasks by their `minimum` energy requirement in descending order.
This is because tasks with higher minimum energy requirements are the ones that are more likely
to be the bottleneck. If we can satisfy these high minimum requirements early, then subsequent
tasks (with potentially lower minimum requirements but higher actual costs) will be easier to manage.

Let's refine this. The crucial point is that for any task `[actual, minimum]`, at the moment we *start* it,
our energy must be at least `minimum`. After completing it, our energy decreases by `actual`.
The most restrictive condition is when we have to start a task that has a high `minimum` requirement.
If we have two tasks:
Task 1: [a1, m1]
Task 2: [a2, m2]

Scenario 1: Do Task 1 then Task 2.
We need E >= m1. After Task 1, energy is E - a1. We need E - a1 >= m2.
So, E >= m1 and E >= m2 + a1. The required initial energy is max(m1, m2 + a1).

Scenario 2: Do Task 2 then Task 1.
We need E >= m2. After Task 2, energy is E - a2. We need E - a2 >= m1.
So, E >= m2 and E >= m1 + a2. The required initial energy is max(m2, m1 + a2).

To minimize initial energy, we want to pick the order that results in a smaller maximum.
Consider the difference `minimum - actual`. If `m1 - a1 > m2 - a2`, it suggests that Task 1
is "easier" to complete in terms of energy cost relative to its minimum requirement.
If we sort by `minimum - actual` descending, we'd do tasks with larger gaps first.
This means we would do tasks where `minimum` is much larger than `actual` first. This is good.

However, let's reconsider the greedy choice. We want to finish tasks such that at any point,
the energy required to START the next task is met with the LEAST possible initial energy.
The energy we have at any point is `InitialEnergy - Sum of actuals of completed tasks`.
So, `InitialEnergy - Sum(actual_i) >= minimum_j` for the next task `j`.
This means `InitialEnergy >= minimum_j + Sum(actual_i)`.

The critical constraint comes from the tasks that require a high `minimum` energy to *start*.
If we have a task with `minimum = 100` and `actual = 1`, and another with `minimum = 10` and `actual = 50`.
If we do the first task first:
Initial Energy `E`. Need `E >= 100`. After task 1, energy is `E - 1`.
Next, need `E - 1 >= 10`. So `E >= 11`.
Overall requirement: `E >= 100`.

If we do the second task first:
Initial Energy `E`. Need `E >= 10`. After task 2, energy is `E - 50`.
Next, need `E - 50 >= 100`. So `E >= 150`.
Overall requirement: `E >= 150`.

This suggests that tasks with higher `minimum` should be prioritized when deciding the *order* of operations to minimize the *peak* energy requirement.
The problem states "You can finish the tasks in any order you like."
This implies we can pick an order.
Let's sort the tasks based on their `minimum` requirement in descending order. This means we tackle tasks that are "hardest to start" first.
Suppose we have tasks sorted as `t1, t2, ..., tn` where `t_i.minimum >= t_{i+1}.minimum`.
We need to find an initial energy `E` such that for any prefix of tasks `t_1, ..., t_k`, if we have `current_energy` before starting `t_k`, then `current_energy >= t_k.minimum`.
The key is that we want to find the minimum `E` that satisfies this for *all* tasks in *some* order.

The greedy approach that works is to sort the tasks by the difference `minimum[i] - actual[i]` in descending order.
This means tasks where `minimum` is significantly larger than `actual` (i.e., a large "safety margin" is needed to start) are performed first.
Let's test this idea:
Tasks: [[1,2], [2,4], [4,8]]
Differences: (2-1)=1, (4-2)=2, (8-4)=4.
Sorted by difference descending: [[4,8], [2,4], [1,2]]

Let's simulate this sorted order:
Task 1: [4,8]
Task 2: [2,4]
Task 3: [1,2]

We want to find the minimum initial energy `E`.
We can iterate through the tasks in this sorted order. For each task `[actual, minimum]`,
we need to ensure that when we *start* it, our current energy is at least `minimum`.
Let `current_energy` be the energy we have *before* performing the current task.
We need `current_energy >= minimum`.
After performing the task, our energy becomes `current_energy - actual`.

To find the minimum initial energy, we can work backwards or forwards.
Let's try forwards. We will maintain `current_energy` and `max_needed_initial_energy`.
Initially, `current_energy = 0` and `max_needed_initial_energy = 0`.
Iterate through tasks sorted by `minimum - actual` descending.
For task `[actual, minimum]`:
To be able to start this task, our energy must be at least `minimum`.
If our `current_energy` is less than `minimum`, we need to have started with more energy.
The deficit is `minimum - current_energy`. This deficit must be covered by our initial energy.
So, `max_needed_initial_energy = max(max_needed_initial_energy, minimum - current_energy)`.
After satisfying this requirement (conceptually), we perform the task, and our energy is reduced.
However, the `current_energy` we track should represent the energy *after* completing previous tasks, but *before* starting the current one.
This is tricky.

Let's consider the total energy spent. The total actual energy spent will be `Sum(actual_i)`.
Let `E_initial` be the initial energy.
After completing all tasks, the final energy will be `E_initial - Sum(actual_i)`.
The condition is that at *any point* we start a task `i`, our energy must be `>= minimum_i`.

Alternative perspective:
Let's sort the tasks by `minimum` in descending order. This is because tasks with higher `minimum` requirements are more restrictive. If we can meet them, we likely can meet others.
Example 1: [[1,2],[2,4],[4,8]]
Sorted by minimum descending: [[4,8], [2,4], [1,2]]
Let initial energy be `E`.
Consider task [4,8]. We need `E >= 8`. After doing it, energy is `E - 4`.
Consider task [2,4]. We need `E - 4 >= 4`. So `E >= 8`. After doing it, energy is `E - 4 - 2 = E - 6`.
Consider task [1,2]. We need `E - 6 >= 2`. So `E >= 8`.
Minimum E = 8.

Example 3: [[1,7],[2,8],[3,9],[4,10],[5,11],[6,12]]
Sorted by minimum descending: [[6,12], [5,11], [4,10], [3,9], [2,8], [1,7]]
Let initial energy be `E`.
Task [6,12]: Need `E >= 12`. Energy becomes `E - 6`.
Task [5,11]: Need `E - 6 >= 11`. So `E >= 17`. Energy becomes `E - 6 - 5 = E - 11`.
Task [4,10]: Need `E - 11 >= 10`. So `E >= 21`. Energy becomes `E - 11 - 4 = E - 15`.
Task [3,9]: Need `E - 15 >= 9`. So `E >= 24`. Energy becomes `E - 15 - 3 = E - 18`.
Task [2,8]: Need `E - 18 >= 8`. So `E >= 26`. Energy becomes `E - 18 - 2 = E - 20`.
Task [1,7]: Need `E - 20 >= 7`. So `E >= 27`. Energy becomes `E - 20 - 1 = E - 21`.
Minimum E = 27.

This strategy of sorting by `minimum` descending seems to work.
Let's try to prove why this greedy choice is optimal.
Suppose the optimal order is `p1, p2, ..., pn`. Let the initial energy be `E_opt`.
Let our sorted order by `minimum` descending be `s1, s2, ..., sn`.
We want to show that the minimum initial energy required for our sorted order, `E_sorted`, is `E_sorted <= E_opt`.

Consider the order `s1, s2, ..., sn`.
We need to maintain `current_energy` and track the maximum initial energy required.
Let `current_energy = 0`. Let `required_initial_energy = 0`.
For `si = [actual_i, minimum_i]` in sorted order:
To start task `si`, we need `current_energy >= minimum_i`.
If `current_energy < minimum_i`, it means we need an additional `minimum_i - current_energy` energy from our initial pool.
So, we update `required_initial_energy = max(required_initial_energy, minimum_i - current_energy)`.
After we conceptually meet this requirement, we then *perform* the task, which reduces energy.
This is where it gets tricky. The `current_energy` should represent the energy available *right before* starting the current task.
The `required_initial_energy` is the minimum we must start with to ensure all minimums are met.

Let's track the *minimum required initial energy* to reach the point where we can start the current task.
Let `total_actual_spent = 0`.
Let `min_initial_energy = 0`.

Iterate through tasks sorted by `minimum` in descending order.
For task `[actual, minimum]`:
The energy we have available *before* starting this task, assuming we started with `min_initial_energy`, is `min_initial_energy - total_actual_spent`.
We need this to be `>= minimum`.
So, `min_initial_energy - total_actual_spent >= minimum`.
This implies `min_initial_energy >= minimum + total_actual_spent`.
We must ensure this condition holds for all tasks. So, `min_initial_energy` must be the maximum of `minimum + total_actual_spent` over all tasks processed so far.

Let's re-verify with Example 3: [[1,7],[2,8],[3,9],[4,10],[5,11],[6,12]]
Sorted by minimum descending: [[6,12], [5,11], [4,10], [3,9], [2,8], [1,7]]

Initialize: `min_initial_energy = 0`, `total_actual_spent = 0`.

1. Task [6,12]:
   We need `min_initial_energy >= 12 + 0` (total_actual_spent).
   `min_initial_energy = max(0, 12) = 12`.
   Update `total_actual_spent += 6`. So, `total_actual_spent = 6`.

2. Task [5,11]:
   We need `min_initial_energy >= 11 + 6` (total_actual_spent).
   `min_initial_energy = max(12, 17) = 17`.
   Update `total_actual_spent += 5`. So, `total_actual_spent = 11`.

3. Task [4,10]:
   We need `min_initial_energy >= 10 + 11` (total_actual_spent).
   `min_initial_energy = max(17, 21) = 21`.
   Update `total_actual_spent += 4`. So, `total_actual_spent = 15`.

4. Task [3,9]:
   We need `min_initial_energy >= 9 + 15` (total_actual_spent).
   `min_initial_energy = max(21, 24) = 24`.
   Update `total_actual_spent += 3`. So, `total_actual_spent = 18`.

5. Task [2,8]:
   We need `min_initial_energy >= 8 + 18` (total_actual_spent).
   `min_initial_energy = max(24, 26) = 26`.
   Update `total_actual_spent += 2`. So, `total_actual_spent = 20`.

6. Task [1,7]:
   We need `min_initial_energy >= 7 + 20` (total_actual_spent).
   `min_initial_energy = max(26, 27) = 27`.
   Update `total_actual_spent += 1`. So, `total_actual_spent = 21`.

Final `min_initial_energy = 27`. This matches the example.

Why does sorting by `minimum` descending work?
Let's consider two adjacent tasks in the sorted list `s_i` and `s_{i+1}`.
We have `s_i.minimum >= s_{i+1}.minimum`.
Let `E_i` be the minimum initial energy required to complete tasks `s_1, ..., s_i`.
Let `TotalActual_i` be the sum of actual energies for tasks `s_1, ..., s_i`.
When we consider `s_{i+1}`, we need to ensure:
`E_i - TotalActual_i >= s_{i+1}.minimum`
So, `E_i >= s_{i+1}.minimum + TotalActual_i`.
The new minimum initial energy `E_{i+1}` will be `max(E_i, s_{i+1}.minimum + TotalActual_i)`.

Consider an alternative order where `s_{i+1}` is processed before `s_i`.
Suppose we are at a state where we have completed some tasks, and the next two tasks we must consider are `A = [actual_A, minimum_A]` and `B = [actual_B, minimum_B]`.
Assume `minimum_A >= minimum_B`.
Let the current energy before starting either A or B be `C`.
We want to find the minimum initial energy `E` to complete all tasks.

Order A then B:
Requirement for A: `E - TotalActual_before >= minimum_A`. So `E >= minimum_A + TotalActual_before`.
Requirement for B: `(E - TotalActual_before - actual_A) >= minimum_B`. So `E >= minimum_B + actual_A + TotalActual_before`.
Total minimum initial energy for this path from this point: `max(minimum_A + TotalActual_before, minimum_B + actual_A + TotalActual_before)`.

Order B then A:
Requirement for B: `E - TotalActual_before >= minimum_B`. So `E >= minimum_B + TotalActual_before`.
Requirement for A: `(E - TotalActual_before - actual_B) >= minimum_A`. So `E >= minimum_A + actual_B + TotalActual_before`.
Total minimum initial energy for this path from this point: `max(minimum_B + TotalActual_before, minimum_A + actual_B + TotalActual_before)`.

We assumed `minimum_A >= minimum_B`.
We need to compare:
`max(minimum_A + T, minimum_B + actual_A + T)` vs `max(minimum_B + T, minimum_A + actual_B + T)`
where `T = TotalActual_before`.

Let's simplify by removing `T` from the comparison, as it's a common additive term.
We compare `max(minimum_A, minimum_B + actual_A)` vs `max(minimum_B, minimum_A + actual_B)`.

Since `minimum_A >= minimum_B`:
The left side `max(minimum_A, minimum_B + actual_A)` is likely to be larger or equal to `minimum_A` if `minimum_B + actual_A` is small.
The right side `max(minimum_B, minimum_A + actual_B)` has `minimum_A + actual_B` as a term.

Consider the difference `minimum_A - actual_A` vs `minimum_B - actual_B`.
If `minimum_A - actual_A > minimum_B - actual_B`, this means task A is "harder" to satisfy its minimum requirement relative to its cost.
This is equivalent to `minimum_A + actual_B > minimum_B + actual_A`.

If `minimum_A + actual_B > minimum_B + actual_A`:
This suggests doing task B first might be better in some sense if `minimum_A` is not too large.

However, the sorting by `minimum` descending focuses on the initial hurdle.
The core idea is that the energy level needed at the start of a task is `minimum_i`.
If we sort by `minimum` descending, we are ensuring that we address the most stringent starting requirements first.
If we have `E` initial energy, and we do tasks `t1, t2, ..., tk` in some order.
The energy available before task `tj` is `E - sum(actual_i for i < j)`.
This must be `>= minimum_j`.
`E >= minimum_j + sum(actual_i for i < j)`.
To satisfy this for all `j` in the chosen order, `E` must be at least `max(minimum_j + sum(actual_i for i < j))` over all `j`.

The crucial insight from the problem statement and examples is that the order matters.
The greedy strategy is: Sort tasks by `minimum` in descending order. Then, calculate the minimum initial energy required.
Let `current_energy_spent = 0`.
Let `required_initial = 0`.
For each task `[actual, minimum]` in the sorted order:
The energy we *have* before starting this task, assuming we started with `required_initial`, is `required_initial - current_energy_spent`.
We need this to be `>= minimum`.
So, `required_initial - current_energy_spent >= minimum`.
This means `required_initial >= minimum + current_energy_spent`.
We update `required_initial` to be the maximum of its current value and `minimum + current_energy_spent`.
Then, we update `current_energy_spent += actual` to account for the energy spent on this task for the next iteration.

Let's double check with the actual problem link and constraints.
1 <= actuali <= minimumi <= 10^4. This constraint `actuali <= minimumi` is important. It means that for any task, the minimum energy required to start is at least the energy spent. This simplifies things slightly, as completing a task never results in a net energy gain.

The sorting criteria should be `minimum` descending.
The logic:
`min_initial_energy = 0`
`total_actual_spent = 0`
For `task` in `sorted_tasks` (sorted by `minimum` descending):
    `min_initial_energy = max(min_initial_energy, task.minimum + total_actual_spent)`
    `total_actual_spent += task.actual`
Return `min_initial_energy`.

Why does `minimum_A >= minimum_B` imply sorting by `minimum` descending is optimal?
Consider two adjacent tasks A and B where `minimum_A >= minimum_B`.
Order A then B: Required E >= max(minimum_A + T, minimum_B + actual_A + T)
Order B then A: Required E >= max(minimum_B + T, minimum_A + actual_B + T)
Let T be the total actual energy spent *before* these two tasks.

We are comparing `max(minimum_A, minimum_B + actual_A)` vs `max(minimum_B, minimum_A + actual_B)`.
Let's assume `minimum_A + actual_B >= minimum_B + actual_A`.
This implies `minimum_A - actual_A >= minimum_B - actual_B`.
This means Task A has a larger "safety margin" requirement (minimum - actual) than Task B.

If `minimum_A + actual_B >= minimum_B + actual_A`:
The second order (B then A) requires `max(minimum_B, minimum_A + actual_B)`.
The first order (A then B) requires `max(minimum_A, minimum_B + actual_A)`.

Since `minimum_A >= minimum_B` and `minimum_A + actual_B > minimum_B + actual_A`.
The second option (`max(minimum_B, minimum_A + actual_B)`) has `minimum_A + actual_B` which is potentially large.
The first option (`max(minimum_A, minimum_B + actual_A)`) has `minimum_A` as one candidate.

Consider this case:
A = [10, 20] (actual=10, minimum=20)
B = [1, 15]  (actual=1, minimum=15)
Here, `minimum_A > minimum_B` (20 > 15).
`minimum_A - actual_A = 20 - 10 = 10`
`minimum_B - actual_B = 15 - 1 = 14`
So `minimum_B - actual_B > minimum_A - actual_A`.
This means sorting by `minimum - actual` descending would put B first.
Our current logic sorts by `minimum` descending, so A would be first.

Let's test with T=0.
Order A then B: `max(20, 15 + 10) = max(20, 25) = 25`.
Order B then A: `max(15, 20 + 1) = max(15, 21) = 21`.
Here, B then A is better. This is consistent with sorting by `minimum - actual` descending.

Let's check Example 3 again.
Tasks: [[1,7],[2,8],[3,9],[4,10],[5,11],[6,12]]
Sorted by minimum descending: [[6,12], [5,11], [4,10], [3,9], [2,8], [1,7]]
Result: 27

Differences (min-actual):
[6,12] -> 6
[5,11] -> 6
[4,10] -> 6
[3,9]  -> 6
[2,8]  -> 6
[1,7]  -> 6
All differences are the same. So sorting by `minimum` descending is equivalent to any order here.

Let's try Example 2: [[1,3],[2,4],[10,11],[10,12],[8,9]]
Sorted by minimum descending: [[10,12], [10,11], [8,9], [2,4], [1,3]]

1. Task [10,12]:
   `min_initial = max(0, 12 + 0) = 12`.
   `total_actual = 10`.
2. Task [10,11]:
   `min_initial = max(12, 11 + 10) = max(12, 21) = 21`.
   `total_actual = 10 + 10 = 20`.
3. Task [8,9]:
   `min_initial = max(21, 9 + 20) = max(21, 29) = 29`.
   `total_actual = 20 + 8 = 28`.
4. Task [2,4]:
   `min_initial = max(29, 4 + 28) = max(29, 32) = 32`.
   `total_actual = 28 + 2 = 30`.
5. Task [1,3]:
   `min_initial = max(32, 3 + 30) = max(32, 33) = 33`.
   `total_actual = 30 + 1 = 31`.

My calculation for Example 2 gave 33. The expected output is 32.
My sorting criteria might be wrong or my calculation logic.

Let's revisit the problem statement and examples carefully.
"Return the minimum initial amount of energy you will need to finish all the tasks."
The examples show a specific order of execution that yields the minimum initial energy.

Example 1: [[1,2],[2,4],[4,8]] -> Output 8
Order shown: 3rd task ([4,8]), 2nd task ([2,4]), 1st task ([1,2])
This order is [[4,8], [2,4], [1,2]]. This is sorted by minimum descending.
My calculation for this order:
Task [4,8]: need E >= 8. T_actual=4.
Task [2,4]: need E-4 >= 4 => E >= 8. T_actual=4+2=6.
Task [1,2]: need E-6 >= 2 => E >= 8. T_actual=6+1=7.
Result: 8. Matches.

Example 2: [[1,3],[2,4],[10,11],[10,12],[8,9]] -> Output 32
Order shown: [1,3], [2,4], [10,11], [10,12], [8,9] (This is NOT sorted by minimum)
Let's trace this order:
Initial E = 32.
1. [1,3]: Have 32. Need >= 1. OK. Energy becomes 32-1 = 31.
2. [2,4]: Have 31. Need >= 2. OK. Energy becomes 31-2 = 29.
3. [10,11]: Have 29. Need >= 10. OK. Energy becomes 29-10 = 19.
4. [10,12]: Have 19. Need >= 10. OK. Energy becomes 19-10 = 9.
5. [8,9]: Have 9. Need >= 8. OK. Energy becomes 9-8 = 1.
All tasks finished. Initial energy 32 works.

Let's try sorting by `minimum - actual` descending for Example 2.
Tasks: [[1,3],[2,4],[10,11],[10,12],[8,9]]
Differences (min-actual):
[1,3] -> 2
[2,4] -> 2
[10,11] -> 1
[10,12] -> 2
[8,9] -> 1
Sorted by difference descending: [[1,3],[2,4],[10,12], [10,11],[8,9]] (order within same difference might matter, let's use original order as tie-breaker)
Or: [[1,3],[2,4],[10,12], [10,11],[8,9]] (same difference, try this order)

Let's re-calculate using the `min_initial = max(min_initial, task.minimum + total_actual_spent)` logic with the order from Example 2:
Order: [1,3], [2,4], [10,11], [10,12], [8,9]
Initial: `min_initial = 0`, `total_actual = 0`

1. Task [1,3]:
   `min_initial = max(0, 3 + 0) = 3`.
   `total_actual = 0 + 1 = 1`.
2. Task [2,4]:
   `min_initial = max(3, 4 + 1) = max(3, 5) = 5`.
   `total_actual = 1 + 2 = 3`.
3. Task [10,11]:
   `min_initial = max(5, 11 + 3) = max(5, 14) = 14`.
   `total_actual = 3 + 10 = 13`.
4. Task [10,12]:
   `min_initial = max(14, 12 + 13) = max(14, 25) = 25`.
   `total_actual = 13 + 10 = 23`.
5. Task [8,9]:
   `min_initial = max(25, 9 + 23) = max(25, 32) = 32`.
   `total_actual = 23 + 8 = 31`.

This calculation yields 32. This means the order shown in Example 2 is the one that this greedy approach (calculating `max(minimum + total_actual_spent)`) works with.
What is special about this order?
[1,3] min=3, diff=2
[2,4] min=4, diff=2
[10,11] min=11, diff=1
[10,12] min=12, diff=2
[8,9] min=9, diff=1

The example order is NOT sorted by minimum descending.
It's also NOT sorted by (min-actual) descending if we consider the differences of 2 and 1.
The example order:
[1,3] (diff 2)
[2,4] (diff 2)
[10,11] (diff 1)
[10,12] (diff 2)
[8,9] (diff 1)

This order seems to be: sort by `minimum - actual` descending. If differences are equal, sort by `actual` descending?
Differences:
[1,3] -> 2
[2,4] -> 2
[10,12] -> 2
[10,11] -> 1
[8,9] -> 1

Let's group by difference:
Diff 2: [1,3], [2,4], [10,12]
Diff 1: [10,11], [8,9]

Within Diff 2, what order?
Example order used: [1,3], [2,4], [10,12]
Actuals: 1, 2, 10. This is ascending actual.

Within Diff 1, what order?
Example order used: [10,11], [8,9]
Actuals: 10, 8. This is descending actual.

This sorting criteria is getting complicated.

Let's re-evaluate the condition `E >= minimum_j + sum(actual_i for i < j)`.
This condition represents the minimum initial energy required to START task `j` *given* that we have already completed tasks `i < j`.
The critical observation is that `minimum_j` is a requirement at the point of starting task `j`.
The `sum(actual_i for i < j)` represents how much our energy has *decreased* by the time we are about to start task `j`.
So, if we start with `E`, our energy before task `j` is `E - sum(actual_i for i < j)`.
We need `E - sum(actual_i for i < j) >= minimum_j`.
This means `E >= minimum_j + sum(actual_i for i < j)`.

To minimize `E`, we must pick an order such that `max(minimum_j + sum(actual_i for i < j))` over all `j` in that order is minimized.
This is a standard rearrangement inequality type of problem.
It turns out that sorting by `minimum - actual` descending is the correct greedy strategy.
Let's re-check the problem constraints and example 2.
Maybe my manual calculation of difference was off, or tie-breaking was wrong.
Tasks: [[1,3],[2,4],[10,11],[10,12],[8,9]]

Differences (min - actual):
[1,3] -> 3-1 = 2
[2,4] -> 4-2 = 2
[10,11] -> 11-10 = 1
[10,12] -> 12-10 = 2
[8,9] -> 9-8 = 1

Groups of differences:
Diff = 2: [1,3], [2,4], [10,12]
Diff = 1: [10,11], [8,9]

To minimize `max(minimum_j + sum(actual_i for i < j))`, we should process tasks that have a large `minimum_j` relative to the `sum(actual_i for i < j)` they impose.
The term `minimum_j - actual_j` measures how much "buffer" the task itself provides relative to its start requirement. A larger difference means more "room".
If we have a large difference, it means `minimum_j` is significantly larger than `actual_j`. These tasks are "expensive" to start but "cheap" in terms of energy loss.
If we do tasks with large differences first, we ensure we meet their high `minimum` requirement when our energy is high.

Consider tasks A and B.
If we sort by `minimum - actual` descending.
Suppose we have `minimum_A - actual_A > minimum_B - actual_B`.
This implies `minimum_A + actual_B > minimum_B + actual_A`.

Let's apply this sort to Example 2.
Tasks: [[1,3],[2,4],[10,11],[10,12],[8,9]]
Differences:
[1,3] -> 2
[2,4] -> 2
[10,11] -> 1
[10,12] -> 2
[8,9] -> 1

Sorted by difference descending:
Diff=2 group: [1,3], [2,4], [10,12]
Diff=1 group: [10,11], [8,9]

How to break ties within groups?
If `minimum_A - actual_A == minimum_B - actual_B`, how should we order A and B?
This implies `minimum_A + actual_B == minimum_B + actual_A`.
The required initial energy for A then B is `max(minimum_A + T, minimum_B + actual_A + T)`.
The required initial energy for B then A is `max(minimum_B + T, minimum_A + actual_B + T)`.
Since `minimum_A + actual_B = minimum_B + actual_A`, the terms `minimum_B + actual_A + T` and `minimum_A + actual_B + T` are equal.
So we compare `max(minimum_A, minimum_B)` vs `max(minimum_B, minimum_A)`.
Since `minimum_A + actual_B = minimum_B + actual_A`, and `actual_A, actual_B > 0`.
If `actual_A > actual_B`, then `minimum_A < minimum_B`.
If `actual_A < actual_B`, then `minimum_A > minimum_B`.

This suggests that if differences are equal, we should sort by `minimum` descending (or `actual` ascending).
Let's verify this with Example 2.
Diff=2 group: [1,3], [2,4], [10,12]
Differencs are all 2.
Minimums: 3, 4, 12.
Sort by minimum descending: [10,12], [2,4], [1,3].

Diff=1 group: [10,11], [8,9]
Differences are all 1.
Minimums: 11, 9.
Sort by minimum descending: [10,11], [8,9].

Combined sorted order by `minimum - actual` descending, then `minimum` descending:
[10,12] (diff 2, min 12)
[2,4]   (diff 2, min 4)
[1,3]   (diff 2, min 3)
[10,11] (diff 1, min 11)
[8,9]   (diff 1, min 9)

Let's calculate with this order:
Initial: `min_initial = 0`, `total_actual = 0`

1. Task [10,12]:
   `min_initial = max(0, 12 + 0) = 12`.
   `total_actual = 0 + 10 = 10`.
2. Task [2,4]:
   `min_initial = max(12, 4 + 10) = max(12, 14) = 14`.
   `total_actual = 10 + 2 = 12`.
3. Task [1,3]:
   `min_initial = max(14, 3 + 12) = max(14, 15) = 15`.
   `total_actual = 12 + 1 = 13`.
4. Task [10,11]:
   `min_initial = max(15, 11 + 13) = max(15, 24) = 24`.
   `total_actual = 13 + 10 = 23`.
5. Task [8,9]:
   `min_initial = max(24, 9 + 23) = max(24, 32) = 32`.
   `total_actual = 23 + 8 = 31`.

This order yields 32, which is the correct answer for Example 2.
So the sorting criteria is:
1. Sort by `minimum - actual` in descending order.
2. If `minimum - actual` is equal, sort by `minimum` in descending order.

Let's confirm this with Example 3: [[1,7],[2,8],[3,9],[4,10],[5,11],[6,12]]
Differences (min-actual):
[1,7] -> 6
[2,8] -> 6
[3,9] -> 6
[4,10] -> 6
[5,11] -> 6
[6,12] -> 6
All differences are 6. So we sort by `minimum` descending.
[6,12]
[5,11]
[4,10]
[3,9]
[2,8]
[1,7]
This is the same order as before, and it yielded 27.

So, the sorting key is:
`pair<int, int>` where first element is `minimum - actual` and second element is `minimum`.
We sort this pair in descending order.
This means `std::sort` with a custom comparator or by reversing the default `std::pair` comparison.
Or, we can store `{- (minimum - actual), -minimum}` and sort ascendingly.

Let's try to implement this.
The sort will be on `std::vector<std::pair<int, int>>`, where each pair is `{minimum - actual, minimum}`.
We want to sort in descending order for both.

```cpp
#include <vector>
#include <algorithm>
#include <iostream>

// Custom comparator for sorting
struct TaskComparator {
    bool operator()(const std::vector<int>& a, const std::vector<int>& b) const {
        int diff_a = a[1] - a[0]; // minimum_a - actual_a
        int diff_b = b[1] - b[0]; // minimum_b - actual_b

        if (diff_a != diff_b) {
            return diff_a > diff_b; // Sort by difference descending
        }
        // If differences are equal, sort by minimum descending
        return a[1] > b[1];
    }
};

class Solution {
public:
    int minimumInitialEnergy(std::vector<std::vector<int>>& tasks) {
        // Sort tasks based on the greedy strategy:
        // 1. Primary sort key: (minimum - actual) in descending order.
        //    This prioritizes tasks that require a large minimum energy relative to their actual cost.
        // 2. Secondary sort key: minimum energy in descending order.
        //    This breaks ties when (minimum - actual) is the same, prioritizing tasks that are harder to start.
        std::sort(tasks.begin(), tasks.end(), TaskComparator());

        long long min_initial_energy = 0;
        long long total_actual_spent = 0;

        for (const auto& task : tasks) {
            int actual = task[0];
            int minimum = task[1];

            // For the current task, we need `current_energy >= minimum`.
            // `current_energy` is `min_initial_energy - total_actual_spent`.
            // So, `min_initial_energy - total_actual_spent >= minimum`.
            // Rearranging, `min_initial_energy >= minimum + total_actual_spent`.
            // We update `min_initial_energy` to be the maximum required so far.
            min_initial_energy = std::max(min_initial_energy, (long long)minimum + total_actual_spent);

            // After accounting for the minimum requirement, we update the total actual energy spent.
            total_actual_spent += actual;
        }

        return min_initial_energy;
    }
};

```
Test with examples:
Example 1: tasks = [[1,2],[2,4],[4,8]]
Differences: [1,2]->1, [2,4]->2, [4,8]->4
Sorted by (min-act) desc, then min desc:
[4,8] (diff 4, min 8)
[2,4] (diff 2, min 4)
[1,2] (diff 1, min 2)

1. Task [4,8]:
   min_initial = max(0, 8 + 0) = 8
   total_actual = 4
2. Task [2,4]:
   min_initial = max(8, 4 + 4) = 8
   total_actual = 4 + 2 = 6
3. Task [1,2]:
   min_initial = max(8, 2 + 6) = 8
   total_actual = 6 + 1 = 7
Result: 8. Correct.

Example 2: tasks = [[1,3],[2,4],[10,11],[10,12],[8,9]]
Differences:
[1,3] -> 2
[2,4] -> 2
[10,11] -> 1
[10,12] -> 2
[8,9] -> 1

Groups by diff:
Diff 2: [1,3](min 3), [2,4](min 4), [10,12](min 12)
Diff 1: [10,11](min 11), [8,9](min 9)

Sort by min desc within diff groups:
Diff 2: [10,12], [2,4], [1,3]
Diff 1: [10,11], [8,9]

Combined sorted order: [10,12], [2,4], [1,3], [10,11], [8,9]
1. Task [10,12]:
   min_initial = max(0, 12 + 0) = 12
   total_actual = 10
2. Task [2,4]:
   min_initial = max(12, 4 + 10) = 14
   total_actual = 10 + 2 = 12
3. Task [1,3]:
   min_initial = max(14, 3 + 12) = 15
   total_actual = 12 + 1 = 13
4. Task [10,11]:
   min_initial = max(15, 11 + 13) = 24
   total_actual = 13 + 10 = 23
5. Task [8,9]:
   min_initial = max(24, 9 + 23) = 32
   total_actual = 23 + 8 = 31
Result: 32. Correct.

Example 3: tasks = [[1,7],[2,8],[3,9],[4,10],[5,11],[6,12]]
Differences are all 6.
Sort by min desc:
[6,12], [5,11], [4,10], [3,9], [2,8], [1,7]
1. Task [6,12]:
   min_initial = max(0, 12 + 0) = 12
   total_actual = 6
2. Task [5,11]:
   min_initial = max(12, 11 + 6) = 17
   total_actual = 6 + 5 = 11
3. Task [4,10]:
   min_initial = max(17, 10 + 11) = 21
   total_actual = 11 + 4 = 15
4. Task [3,9]:
   min_initial = max(21, 9 + 15) = 24
   total_actual = 15 + 3 = 18
5. Task [2,8]:
   min_initial = max(24, 8 + 18) = 26
   total_actual = 18 + 2 = 20
6. Task [1,7]:
   min_initial = max(26, 7 + 20) = 27
   total_actual = 20 + 1 = 21
Result: 27. Correct.

The greedy strategy seems solid now.
The data types `long long` for `min_initial_energy` and `total_actual_spent` are used to prevent potential overflow, as `tasks.length` can be up to 10^5 and `minimum_i` up to 10^4. The sum of `minimum_i + total_actual_spent` could exceed `INT_MAX`. Maximum possible `min_initial_energy` could be roughly `10^5 * 10^4 = 10^9`, which fits in `int`. However, `minimum + total_actual_spent` could be `10^4 + 10^5 * 10^4 = 10^4 + 10^9`, which can exceed `INT_MAX`. So `long long` is appropriate.

Time Complexity:
Sorting takes O(N log N), where N is the number of tasks.
The loop iterates through tasks once, taking O(N).
Therefore, the overall time complexity is O(N log N).

Space Complexity:
The `std::sort` might use O(log N) or O(N) space depending on the implementation (in-place or not).
We are using a custom comparator, which doesn't add significant space.
The variables `min_initial_energy` and `total_actual_spent` use O(1) space.
So, the space complexity is dominated by sorting, which is O(log N) or O(N) auxiliary space. If `std::sort` is in-place, it's O(log N) for the recursion stack.

```cpp
/*
Problem Summary:
Find the minimum initial energy required to complete all tasks, where each task has an
actual energy cost and a minimum energy requirement to start.

Link: https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks/

Approach:
The problem can be solved using a greedy approach. The key is to determine the optimal order
to perform the tasks. Consider the condition for starting any task `i`: `current_energy >= minimum_i`.
After completing the task, the energy becomes `current_energy - actual_i`. If we start with
`E_initial` energy, and have completed tasks with a total actual energy `TotalActualSpent` so far,
the energy available before starting the next task `j` is `E_initial - TotalActualSpent`.
Thus, the requirement is `E_initial - TotalActualSpent >= minimum_j`, which rearranges to
`E_initial >= minimum_j + TotalActualSpent`.

To minimize `E_initial`, we need to find an order of tasks such that the maximum value of
`minimum_j + TotalActualSpent` across all tasks `j` in that order is minimized.

The optimal sorting strategy is:
1. Sort tasks primarily by the difference `(minimum_i - actual_i)` in descending order.
   Tasks with a larger difference have a higher `minimum_i` relative to their `actual_i`,
   meaning they require a substantial amount of energy to start but don't deplete energy as much
   relative to their starting requirement. Processing these first ensures we meet their high
   starting thresholds when our energy is highest.
2. If two tasks have the same `(minimum_i - actual_i)` difference, sort them secondarily
   by `minimum_i` in descending order. This handles ties by prioritizing tasks that are
   simply harder to start, even if their relative difference is the same.

After sorting, we iterate through the tasks, keeping track of the `total_actual_spent` so far.
For each task, we calculate the minimum initial energy required to meet its `minimum` requirement
given the `total_actual_spent` from previous tasks. This minimum required initial energy is
`minimum + total_actual_spent`. We maintain the maximum such value encountered as our overall
`min_initial_energy`.

Time complexity: O(N log N) due to sorting.
Space complexity: O(log N) or O(N) due to sorting (depending on implementation details of std::sort).
*/

#include <vector>
#include <algorithm> // For std::sort and std::max
#include <iostream>  // For potential debugging, not strictly required for the solution

// Custom comparator struct to define the sorting order for tasks.
struct TaskComparator {
    // The comparison function for sorting tasks.
    // 'a' and 'b' are vectors representing tasks, e.g., {actual_i, minimum_i}.
    bool operator()(const std::vector<int>& a, const std::vector<int>& b) const {
        // Calculate the difference between minimum and actual energy for task 'a'.
        // This difference represents how much 'buffer' or 'safety margin' the task provides
        // relative to its starting requirement. A larger difference is prioritized.
        int diff_a = a[1] - a[0]; // a[1] is minimum_a, a[0] is actual_a

        // Calculate the difference for task 'b'.
        int diff_b = b[1] - b[0]; // b[1] is minimum_b, b[0] is actual_b

        // Primary sorting criterion: descending order of the difference (minimum - actual).
        // If diff_a is greater than diff_b, task 'a' should come before task 'b'.
        if (diff_a != diff_b) {
            return diff_a > diff_b;
        }
        // Secondary sorting criterion: descending order of minimum energy requirement.
        // This tie-breaker is applied when the (minimum - actual) differences are equal.
        // Prioritizing tasks with a higher minimum energy requirement ensures we tackle
        // the most restrictive starting conditions first among tasks with equal differences.
        return a[1] > b[1];
    }
};

class Solution {
public:
    /**
     * @brief Calculates the minimum initial energy required to finish all tasks.
     *
     * @param tasks A vector of tasks, where each task is a vector of two integers:
     *              [actual_energy_spent, minimum_energy_required_to_start].
     * @return The minimum initial energy needed.
     */
    int minimumInitialEnergy(std::vector<std::vector<int>>& tasks) {
        // Sort the tasks according to the defined greedy strategy using the custom comparator.
        std::sort(tasks.begin(), tasks.end(), TaskComparator());

        // Initialize variables to track the minimum initial energy required and the
        // total actual energy spent across all processed tasks.
        // Use long long to prevent potential integer overflow, as sums can become large.
        long long min_initial_energy = 0;
        long long total_actual_spent = 0;

        // Iterate through the tasks in the sorted order.
        for (const auto& task : tasks) {
            int actual = task[0];   // Energy spent to complete this task.
            int minimum = task[1];  // Minimum energy required to start this task.

            // Calculate the minimum initial energy needed to start the current task.
            // If we start with `min_initial_energy` and have already spent `total_actual_spent`,
            // our current energy before starting this task is `min_initial_energy - total_actual_spent`.
            // This must be at least `minimum`.
            // So, `min_initial_energy - total_actual_spent >= minimum`.
            // Rearranging, `min_initial_energy >= minimum + total_actual_spent`.
            // We update `min_initial_energy` to be the maximum value required by any task processed so far.
            min_initial_energy = std::max(min_initial_energy, (long long)minimum + total_actual_spent);

            // After determining the required initial energy based on the current task's minimum,
            // we add the actual energy spent on this task to `total_actual_spent`. This updated
            // `total_actual_spent` will be used for calculating the requirement of the next task.
            total_actual_spent += actual;
        }

        // The final `min_initial_energy` holds the minimum initial energy needed to complete all tasks.
        return static_cast<int>(min_initial_energy);
    }
};
```