```javascript
/**
 * @param {number} n
 * @param {number} l
 * @param {number} r
 * @return {number}
 */

/*
Problem: Number of ZigZag Arrays II
Link: https://leetcode.com/problems/number-of-zigzag-arrays-ii/

Problem Summary:
Counts the number of ZigZag arrays of length n where elements are in [l, r], adjacent elements are different, and no three consecutive elements form a strictly increasing or decreasing sequence.

Approach:
The problem can be modeled using dynamic programming and matrix exponentiation due to the large constraint on n.
The state of our DP will depend on the last two elements of the ZigZag array and the "trend" (increasing or decreasing).
Since l and r are small (<= 75), the number of possible values for each element is limited.
Let m = r - l + 1 be the number of available values.
We can define states based on the last two elements. However, tracking the exact last two elements would lead to too many states.
Instead, we can observe the constraints:
1. No two adjacent elements are equal.
2. No three consecutive elements form a strictly increasing or strictly decreasing sequence.
This means if the sequence is `a, b, c`, then `a < b > c` or `a > b < c`.
This implies that the sequence must "turn" at every step.

Let dp[i][j][k] be the number of valid ZigZag arrays of length i, ending with element j, and the previous element k. This is still too large.

A better approach is to consider the transitions between states based on the last two elements.
Let's define a state by the last two elements. For a sequence `..., prev, curr`, the next element `next` must satisfy:
1. `l <= next <= r`
2. `next != curr`
3. NOT (`prev < curr < next`) and NOT (`prev > curr > next`)

This means `next` cannot be equal to `curr`, `curr+1` if `prev < curr`, or `curr-1` if `prev > curr`.

Since n is very large, we use matrix exponentiation.
We need to build a transition matrix. The size of the matrix will be related to the number of possible (previous, current) pairs.
Let the range of values be `[l, r]`. The number of distinct values is `m = r - l + 1`.
The number of pairs `(prev, curr)` where `prev != curr` is `m * (m - 1)`. This will be the dimension of our transition matrix.

Let's map each valid pair `(prev, curr)` to an index.
We can iterate through all possible `prev` and `curr` values in the range `[l, r]`.
If `prev != curr`, we assign it an index.
Let `val_to_idx` be a map from `(value, value)` pair to an index.
Let `idx_to_val` be a map from an index to `(value, value)` pair.

The transition matrix `T` will have dimensions `(m * (m - 1)) x (m * (m - 1))`.
`T[i][j]` represents the number of ways to transition from the state corresponding to index `j` (ending with `(prev_j, curr_j)`) to the state corresponding to index `i` (ending with `(prev_i, curr_i)`).
Specifically, if state `j` ends with `(prev, curr)` and state `i` ends with `(curr, next)`, then `T[i][j] = 1` if the transition is valid, and `0` otherwise.

A transition from `(prev, curr)` to `(curr, next)` is valid if:
1. `l <= next <= r`
2. `next != curr`
3. NOT (`prev < curr < next`) AND NOT (`prev > curr > next`)

The base case is for arrays of length 2.
For `n = 2`, any pair `(a, b)` with `l <= a, b <= r` and `a != b` is valid.
The initial state vector `V` will represent the counts of sequences of length 2 ending in each `(prev, curr)` pair.
For a pair `(a, b)` where `a != b`, the initial count is 1.
So, `V[index_of_(a, b)] = 1`.

The problem asks for arrays of length `n`. We are interested in the counts for sequences of length `n`.
If `T` is the transition matrix for length `k` to length `k+1`, then `T^(n-2)` will give us transitions from length 2 to length `n`.
The final answer will be the sum of all elements in the resulting state vector after applying `T^(n-2)` to the initial state vector `V`.

The dimensions of the matrix are `M = m * (m - 1)`.
`m = r - l + 1`. Given `r <= 75`, `m <= 75`. So `M <= 75 * 74 = 5550`.
Matrix multiplication is `O(M^3)`. Matrix exponentiation by squaring is `O(M^3 * log n)`.
This is feasible.

Let's refine the state representation and matrix construction.
We have `m = r - l + 1` possible values.
We can consider states as `(last_element, second_last_element)`.
The values `l` through `r` can be mapped to `0` through `m-1`.
So, a state is `(last_val_idx, second_last_val_idx)`.
The number of states is `m * (m-1)`.

Let's represent `(value)` as `value - l`.
State `s` is `(prev_idx, curr_idx)`, where `0 <= prev_idx, curr_idx < m` and `prev_idx != curr_idx`.
Total states = `m * (m-1)`.

We need a function `isValid(prev, curr, next)` which checks the ZigZag conditions for a triplet.
`prev`, `curr`, `next` are actual values from `[l, r]`.
`isValid(p, c, n)`:
1. `n != c` (already handled by `prev_idx != curr_idx` in state transition).
2. NOT (`p < c && c < n`) AND NOT (`p > c && c > n`).

Let's create a mapping from `(prev_val, curr_val)` to an index.
The total number of states is `dim = m * (m - 1)`.
We can use a 2D array `state_to_idx[m][m]` where `state_to_idx[p][c]` stores the index for the pair `(p, c)`. Initialize with -1.
`current_idx = 0`.
Iterate `p` from `l` to `r`.
  Iterate `c` from `l` to `r`.
    If `p != c`:
      `state_to_idx[p-l][c-l] = current_idx++`.

Transition Matrix `T[dim][dim]`.
Iterate `prev_val` from `l` to `r`.
  Iterate `curr_val` from `l` to `r`.
    If `prev_val != curr_val`:
      `idx_prev_curr = state_to_idx[prev_val-l][curr_val-l]`.
      Iterate `next_val` from `l` to `r`.
        If `next_val != curr_val`:
          // Check ZigZag condition: not (prev < curr < next) and not (prev > curr > next)
          `is_triplet_valid = !((prev_val < curr_val && curr_val < next_val) || (prev_val > curr_val && curr_val > next_val))`.
          If `is_triplet_valid`:
            `idx_curr_next = state_to_idx[curr_val-l][next_val-l]`.
            `T[idx_curr_next][idx_prev_curr] = (T[idx_curr_next][idx_prev_curr] + 1) % MOD`.

Base case: For `n = 3`, we need to count valid triplets `(a, b, c)`.
This is equivalent to `sum(T^1 * V)` where `V` is initial vector.
The problem asks for arrays of length `n`.
If `n = 3`, we are looking for `a, b, c` such that `a!=b`, `b!=c`, and not `a<b<c` or `a>b>c`.
The states represent the last two elements.
For length 3, ending in `(b, c)`, the previous element `a` must satisfy the conditions.
The transition matrix `T` calculates how many ways to extend a sequence of length `k` ending in `(prev, curr)` to length `k+1` ending in `(curr, next)`.
So, `T[idx_curr_next][idx_prev_curr]` is the number of ways to append `next_val` to a sequence ending with `prev_val, curr_val` to form `prev_val, curr_val, next_val`.

Initial state vector `V` for length 2.
For every pair `(a, b)` where `l <= a, b <= r` and `a != b`, `V[state_to_idx[a-l][b-l]] = 1`.

We need to compute `T^(n-2)` and multiply it by `V`.
Let `ResultMatrix = matrix_power(T, n - 2)`.
The final answer is `sum(ResultMatrix[i][j] * V[j])` over all `i, j`.
Since `V` is all ones for valid states, this is `sum(ResultMatrix[i][j])` for all `i` and `j` where `j` corresponds to a valid initial state.
Alternatively, `FinalVector = multiplyMatrixVector(ResultMatrix, V)`.
Then the answer is `sum(FinalVector)`.

If `n = 3`: we need `T^(3-2) = T^1`.
Initial vector `V` for length 2: `V[idx_(a,b)] = 1` for all `a!=b`.
ResultVector = `T * V`.
`ResultVector[idx_(c,d)] = sum(T[idx_(c,d)][idx_(a,b)] * V[idx_(a,b)])` over all `a, b`.
Since `V` is 1 for all `a!=b`, this is `sum(T[idx_(c,d)][idx_(a,b)])` over all `a!=b`.
This is the sum of outgoing transitions from states `(a, b)` to state `(c, d)`.
This is NOT what we want for length 3.

Let's re-evaluate the DP states and transitions for length `n`.
We want to count valid arrays of length `n`.
Let `dp[k][curr_val_idx][prev_val_idx]` be the number of valid ZigZag arrays of length `k` ending with `curr_val_idx` and `prev_val_idx`.
This is `O(n * m^2)`. Too slow for large `n`.

Using matrix exponentiation:
The states must represent the necessary information to extend the sequence.
For a sequence `... x, y`, to decide the next element `z`, we need `x` and `y`.
So, states can be represented by the pair `(x, y)`.
Let `m = r - l + 1`.
The possible values are `0, 1, ..., m-1`.
A state is `(prev_val_idx, curr_val_idx)` where `prev_val_idx != curr_val_idx`.
The dimension of the transition matrix is `dim = m * (m - 1)`.

Let `T` be the transition matrix where `T[i][j]` is the number of ways to transition FROM state `j` TO state `i`.
State `j` corresponds to `(prev_j, curr_j)`.
State `i` corresponds to `(prev_i, curr_i)`.
A transition from state `j` to state `i` means that `curr_j = prev_i` and `curr_i` is the new element.
So, if state `j` is `(x, y)` and state `i` is `(y, z)`, then `T[idx_(y,z)][idx_(x,y)]` is 1 if `z` is valid given `x, y`.
The condition is `z != y` AND NOT (`x < y < z`) AND NOT (`x > y > z`).

Let's map values `l...r` to `0...m-1`.
`map_val_to_idx(val)`: returns `val - l`.
`map_idx_to_val(idx)`: returns `idx + l`.

`state_to_idx[m][m]` initialized to -1.
`idx_counter = 0`.
For `pv` from `0` to `m-1`:
  For `cv` from `0` to `m-1`:
    If `pv != cv`:
      `state_to_idx[pv][cv] = idx_counter++`.

Transition matrix `T[dim][dim]`. Initialize to 0.
For `prev_idx` from `0` to `m-1`:
  For `curr_idx` from `0` to `m-1`:
    If `prev_idx != curr_idx`:
      `from_state_idx = state_to_idx[prev_idx][curr_idx]`.
      `prev_val = map_idx_to_val(prev_idx)`.
      `curr_val = map_idx_to_val(curr_idx)`.

      For `next_idx` from `0` to `m-1`:
        If `curr_idx != next_idx`: // next_val != curr_val
          `next_val = map_idx_to_val(next_idx)`.

          // Check ZigZag condition: not (prev < curr < next) and not (prev > curr > next)
          `is_triplet_valid = !((prev_val < curr_val && curr_val < next_val) || (prev_val > curr_val && curr_val > next_val))`.

          If `is_triplet_valid`:
            `to_state_idx = state_to_idx[curr_idx][next_idx]`.
            `T[to_state_idx][from_state_idx] = (T[to_state_idx][from_state_idx] + 1) % MOD`.

Base case: For `n=2`. The number of arrays of length 2 is `m * (m-1)`.
Initial state vector `V` of size `dim`.
For `pv` from `0` to `m-1`:
  For `cv` from `0` to `m-1`:
    If `pv != cv`:
      `state_idx = state_to_idx[pv][cv]`.
      `V[state_idx] = 1`.

We need to compute `T^(n-2)`. Let this be `ResT`.
Then the final state vector `FinalV = ResT * V`.
The total count is `sum(FinalV)`.

Edge cases:
`n = 3`. We need `T^(3-2) = T^1`.
`FinalV = T * V`.
`FinalV[to_state_idx]` = sum over `from_state_idx` of `T[to_state_idx][from_state_idx] * V[from_state_idx]`.
Since `V` is all 1s for valid `from_state_idx`, `FinalV[to_state_idx]` is the sum of all entries in `T` that go INTO `to_state_idx`.
This `to_state_idx` represents a pair `(curr_val, next_val)`.
This sum represents the number of valid triplets `(prev_val, curr_val, next_val)`.
This is correct for `n=3`.

For `n > 3`: `T^(n-2)` correctly computes the transitions for `n-2` steps, extending from length 2 to length `n`.

Modulo is `10^9 + 7`.

Helper functions:
`multiplyMatrices(A, B, mod)`: Multiplies two square matrices.
`matrixPower(A, exp, mod)`: Computes A^exp using binary exponentiation.
`multiplyMatrixVector(M, V, mod)`: Multiplies a matrix by a vector.

Dimensions:
`m = r - l + 1`.
`dim = m * (m - 1)`.
Maximum `m = 75`. Maximum `dim = 75 * 74 = 5550`.
Matrix multiplication is `O(dim^3)`.
Matrix exponentiation is `O(dim^3 * log n)`.

The problem statement guarantees `n >= 3`.

Implementation details:
Need to handle `n-2` calculation when `n=3`. `n-2 = 1`. `T^1 = T`.
If `n-2` is negative (which it won't be, `n>=3`), it's an issue, but here it's fine.

Consider `n = 10^9`. `log10^9` is roughly `9 * log10` which is about `30`. `log2(10^9)` is roughly 30.
So `log n` is small.

Modulo arithmetic:
All additions and multiplications should be followed by `% MOD`.

Let's verify the mapping and indexing carefully.
`m = r - l + 1`.
Values are `l, l+1, ..., r`.
Mapped indices `0, 1, ..., m-1`.
`val_to_idx(v) = v - l`.
`idx_to_val(i) = i + l`.

State: `(prev_val_idx, curr_val_idx)`.
`state_to_idx[m][m]`:
`state_to_idx[prev_idx][curr_idx]` stores the linear index for the state `(prev_idx, curr_idx)`.
This is valid only if `prev_idx != curr_idx`.
Total states `dim = m * (m - 1)`.

Let's use a map for `state_to_idx` for clarity, or a careful 2D array indexing.
A 2D array `state_to_idx[m][m]` initialized to -1.
`idx_counter = 0`.
For `pv` from `0` to `m-1`:
  For `cv` from `0` to `m-1`:
    If `pv != cv`:
      `state_to_idx[pv][cv] = idx_counter++`.

Transition matrix `T` of size `dim x dim`.
`T[to_state_linear_idx][from_state_linear_idx]`.

`from_state_linear_idx` corresponds to `(prev_idx, curr_idx)`.
`to_state_linear_idx` corresponds to `(curr_idx, next_idx)`.

Iterate through all possible `from_state`:
  For `prev_idx` from `0` to `m-1`:
    For `curr_idx` from `0` to `m-1`:
      If `prev_idx != curr_idx`:
        `from_linear_idx = state_to_idx[prev_idx][curr_idx]`.
        `prev_val = idx_to_val(prev_idx)`.
        `curr_val = idx_to_val(curr_idx)`.

        Iterate through all possible `next_val`:
          For `next_idx` from `0` to `m-1`:
            If `curr_idx != next_idx`: // `next_val != curr_val`
              `next_val = idx_to_val(next_idx)`.

              // Check ZigZag condition
              `is_triplet_valid = !((prev_val < curr_val && curr_val < next_val) || (prev_val > curr_val && curr_val > next_val))`.

              If `is_triplet_valid`:
                `to_linear_idx = state_to_idx[curr_idx][next_idx]`.
                `T[to_linear_idx][from_linear_idx] = (T[to_linear_idx][from_linear_idx] + 1) % MOD`.

Initial vector `V` of size `dim`.
For `pv` from `0` to `m-1`:
  For `cv` from `0` to `m-1`:
    If `pv != cv`:
      `state_idx = state_to_idx[pv][cv]`.
      `V[state_idx] = 1`.

Final Calculation:
`exp = n - 2`.
If `exp < 0`, it means `n < 2`, but constraints say `n >= 3`.
If `exp == 0` (i.e., `n=2`), then `T^0` is identity matrix.
But our base case is length 2 represented by `V`. We need `n-2` transitions.
If `n=3`, `exp = 1`. We need `T^1`.
If `n=4`, `exp = 2`. We need `T^2`.

`T_pow_exp = matrixPower(T, exp, MOD)`.
`FinalV = multiplyMatrixVector(T_pow_exp, V, MOD)`.
`TotalSum = 0`.
For `i` from `0` to `dim-1`:
  `TotalSum = (TotalSum + FinalV[i]) % MOD`.

Return `TotalSum`.

Special case: if `n=3`, the logic still holds. `exp = 1`.
`T_pow_1 = T`.
`FinalV = multiplyMatrixVector(T, V, MOD)`.
The `FinalV[to_state]` will be the sum of `T[to_state][from_state] * V[from_state]` over all `from_state`.
Since `V[from_state]` is 1 for all valid `from_state`, this correctly counts the number of valid triplets that end in `to_state`.

Let's implement matrix operations.
MOD = 10^9 + 7.

```javascript
const MOD = 1_000_000_007;

// Helper function to create an identity matrix
function createIdentityMatrix(size) {
    const matrix = Array(size).fill(0).map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        matrix[i][i] = 1;
    }
    return matrix;
}

// Helper function to multiply two matrices
function multiplyMatrices(A, B, size) {
    const C = Array(size).fill(0).map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
            }
        }
    }
    return C;
}

// Helper function for matrix exponentiation (binary exponentiation)
function matrixPower(matrix, exp, size) {
    if (exp === 0) {
        return createIdentityMatrix(size);
    }
    if (exp === 1) {
        return matrix.map(row => [...row]); // Return a copy
    }

    let result = createIdentityMatrix(size);
    let base = matrix.map(row => [...row]); // Create a copy of the base matrix

    while (exp > 0) {
        if (exp % 2 === 1) {
            result = multiplyMatrices(result, base, size);
        }
        base = multiplyMatrices(base, base, size);
        exp = Math.floor(exp / 2);
    }
    return result;
}

// Helper function to multiply a matrix by a vector
function multiplyMatrixVector(matrix, vector, size) {
    const resultVector = Array(size).fill(0);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            resultVector[i] = (resultVector[i] + matrix[i][j] * vector[j]) % MOD;
        }
    }
    return resultVector;
}

/**
 * @param {number} n
 * @param {number} l
 * @param {number} r
 * @return {number}
 */
var numberOfZigZagArrays = function(n, l, r) {
    const m = r - l + 1; // Number of distinct values available

    // The number of states is m * (m - 1), representing pairs (previous_value, current_value).
    // We map values l..r to indices 0..m-1.
    // A state is (prev_idx, curr_idx) where prev_idx != curr_idx.
    const dim = m * (m - 1);

    // If dim is 0, it means m < 2, which implies r - l + 1 < 2 => r - l < 1.
    // Since l < r, this case won't happen for n >= 3 (as it implies no valid pairs for length 2).
    // However, if m = 1 (l=r), then dim = 1 * 0 = 0.
    // If m = 1, there's only one value. For n>=3, no valid array can be formed
    // because adjacent elements must be different. So answer is 0.
    if (m < 2) {
        return 0;
    }

    // Map from (prev_val_idx, curr_val_idx) to a linear index (0 to dim-1)
    const state_to_idx = Array(m).fill(0).map(() => Array(m).fill(-1));
    let idx_counter = 0;
    for (let pv = 0; pv < m; pv++) {
        for (let cv = 0; cv < m; cv++) {
            if (pv !== cv) {
                state_to_idx[pv][cv] = idx_counter++;
            }
        }
    }

    // Transition matrix T: T[i][j] is the number of ways to transition
    // FROM state j TO state i.
    // State j = (prev_val_idx_j, curr_val_idx_j)
    // State i = (curr_val_idx_j, next_val_idx)
    const T = Array(dim).fill(0).map(() => Array(dim).fill(0));

    // Function to map index back to value
    const idx_to_val = (idx) => idx + l;

    // Build the transition matrix
    for (let prev_idx = 0; prev_idx < m; prev_idx++) {
        for (let curr_idx = 0; curr_idx < m; curr_idx++) {
            if (prev_idx === curr_idx) continue; // Invalid state

            const from_linear_idx = state_to_idx[prev_idx][curr_idx];
            const prev_val = idx_to_val(prev_idx);
            const curr_val = idx_to_val(curr_idx);

            // Consider all possible next values
            for (let next_idx = 0; next_idx < m; next_idx++) {
                if (curr_idx === next_idx) continue; // Adjacent elements must be different

                const next_val = idx_to_val(next_idx);

                // Check ZigZag condition: no three consecutive elements form a strictly increasing or decreasing sequence.
                // This means we cannot have (prev < curr < next) AND we cannot have (prev > curr > next).
                const is_triplet_valid = !((prev_val < curr_val && curr_val < next_val) || (prev_val > curr_val && curr_val > next_val));

                if (is_triplet_valid) {
                    const to_linear_idx = state_to_idx[curr_idx][next_idx];
                    T[to_linear_idx][from_linear_idx] = (T[to_linear_idx][from_linear_idx] + 1) % MOD;
                }
            }
        }
    }

    // Base case: For arrays of length 2.
    // The initial state vector represents the counts of valid arrays of length 2.
    // For any pair (a, b) where l <= a, b <= r and a != b, there is one such array.
    // The vector size is 'dim'. Each element in the vector corresponds to a state (prev_val_idx, curr_val_idx).
    const initial_vector = Array(dim).fill(0);
    for (let pv = 0; pv < m; pv++) {
        for (let cv = 0; cv < m; cv++) {
            if (pv !== cv) {
                const state_idx = state_to_idx[pv][cv];
                initial_vector[state_idx] = 1;
            }
        }
    }

    // If n = 3, we need to apply the transition matrix once (T^1).
    // If n = 4, we need to apply T twice (T^2).
    // In general, to get from length 2 to length n, we need n - 2 transitions.
    const exponent = n - 2;

    // Compute T raised to the power of (n - 2)
    const T_pow_exp = matrixPower(T, exponent, dim);

    // Multiply the powered matrix by the initial vector to get the final state distribution for length n.
    const final_vector = multiplyMatrixVector(T_pow_exp, initial_vector, dim);

    // The total number of valid ZigZag arrays of length n is the sum of all elements in the final vector.
    let total_count = 0;
    for (let i = 0; i < dim; i++) {
        total_count = (total_count + final_vector[i]) % MOD;
    }

    return total_count;
};
```