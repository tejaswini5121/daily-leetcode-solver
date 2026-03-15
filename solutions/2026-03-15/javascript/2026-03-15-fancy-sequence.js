// Problem Summary: Implement a Fancy sequence API supporting append, addAll, multAll operations, and getIndex for values modulo 10^9 + 7.
// Link: https://leetcode.com/problems/fancy-sequence/
// Approach Explanation: The core idea is to track the transformations (multiplication and addition) applied to the sequence globally, and for each appended value, "undo" these global transformations to store its original value. When getIndex is called, we re-apply the global transformations that were active at the time of the getIndex call.
// To handle this efficiently, we maintain two global variables: `globalMult` and `globalAdd`, representing the cumulative multiplication and addition applied to all elements currently in the sequence. These are updated by `multAll` and `addAll`.
// When `append(val)` is called, the `val` being appended has implicitly been affected by all prior `multAll` and `addAll` calls. To store `val` in its "original" state (what it would be if no global transformations had occurred after its append), we need to reverse the current `globalMult` and `globalAdd`.
// If `v_actual = v_original * M + A`, then `v_original = (v_actual - A) * M_inv`, where `M_inv` is the modular multiplicative inverse of `M`. So, we store `(val - globalAdd) * globalMult_inv` in our sequence.
// When `getIndex(idx)` is called, we retrieve this "original" stored value `v_original` and apply the global transformations (`globalMult` and `globalAdd`) that were active *at the time of the call*. This means we need to store `globalMult` and `globalAdd` as they were at the point of each `append`, `addAll`, or `multAll` operation.
// A simpler approach to `getIndex` is to store the "base" value for each index, and the `globalMult` and `globalAdd` values at the *time of its append*. Then, at `getIndex(idx)`, we apply the *current* `globalMult` and `globalAdd` to the base value. However, this is incorrect as `addAll` and `multAll` apply to *existing* elements.
// The correct simplified approach: For each element `v_i` in the sequence, its value can always be expressed as `v_i = (base_i * M_i + A_i)`.
// `base_i` is the value `val` provided in `append(val)`.
// `M_i` and `A_i` are the cumulative multiplication and addition operations *applied to element `i` after it was appended*.
// When `append(val)` is called, we store `val` along with the current state of global transformations (`globalMult` and `globalAdd`). Let's denote these as `m_k` and `a_k` for the k-th operation.
// When `getIndex(idx)` is called, we need to find the effective `M` and `A` that have been applied to `idx` since its append.
// Let `P_k = (m_k, a_k)` be the pair representing the total cumulative `multAll` and `addAll` applied up to operation `k`.
// When `append(val)` occurs at operation `k`, we store `(val, P_{k-1})`.
// When `multAll(m)` occurs at operation `k`: `P_k = (P_{k-1}.m * m, P_{k-1}.a * m)`.
// When `addAll(inc)` occurs at operation `k`: `P_k = (P_{k-1}.m, P_{k-1}.a + inc)`.
// When `getIndex(idx)` is called at operation `current_op`:
// We retrieve the original `val` and the `(m_appended, a_appended)` pair at which `idx` was appended.
// The value at `idx` is `val * (current_m / m_appended) + (current_a - a_appended * (current_m / m_appended))`.
// This derivation is a bit complex. A more robust way is to store for each element, what its "local" multiplier and adder are.
// `localMult` initially 1, `localAdd` initially 0.
// `multAll(m)`: global `localMult *= m`, `localAdd *= m`.
// `addAll(inc)`: global `localAdd += inc`.
// `append(val)`: store `val` and the *current* `localMult` and `localAdd`. These values represent the `(M, A)` transformation active *at the time of append*.
// Let's call these `m_at_append` and `a_at_append`.
// When `getIndex(idx)`:
// Let `val_base` be the value appended at `idx`.
// Let `m_idx` and `a_idx` be the global `localMult` and `localAdd` values when `val_base` was appended.
// The current value at `idx` is `(val_base * (localMult_current / m_idx) + (localAdd_current - a_idx * (localMult_current / m_idx))) % MOD`.
// This formula is valid. If we represent the state as `(mult, add)` for `x -> x * mult + add`:
// Initial: `(1, 0)`
// `multAll(m)` on `(M, A)` becomes `(M*m, A*m)`
// `addAll(inc)` on `(M, A)` becomes `(M, A+inc)`
// When `append(val)`: We store `(val, current_mult, current_add)`.
// When `getIndex(idx)`:
// Retrieve `(val_original, M_at_append, A_at_append)` for `idx`.
// Let current total transformation be `(M_total, A_total)`.
// We need to apply the transformation from `(M_at_append, A_at_append)` to `(M_total, A_total)` to `val_original`.
// This effectively means `val_original` gets multiplied by `M_total / M_at_append` and then added by `A_total - A_at_append * (M_total / M_at_append)`.
// So the value is `(val_original * (M_total * M_at_append_inv) + (A_total - A_at_append * M_total * M_at_append_inv)) % MOD`.
// `M_at_append_inv` is the modular multiplicative inverse of `M_at_append`.
// This requires storing the sequence elements as `[val, m_at_append, a_at_append]`.
// Time Complexity:
// `append`: O(1) - Pushing to an array.
// `addAll`: O(1) - Updating two global variables.
// `multAll`: O(1) - Updating two global variables.
// `getIndex`: O(log MOD) for modular inverse calculation (using Fermat's Little Theorem or extended Euclidean algorithm), or O(1) if inverses are precomputed or calculated iteratively. In this case, `M_at_append` can be accumulated through multiplications. Precomputing inverses is not feasible as `M_at_append` can be any value. Iterative approach for inverse is `pow(m, MOD - 2, MOD)`.
// Overall, if modular inverse takes O(log MOD), `getIndex` is O(log MOD). Otherwise, if it's considered constant time for practical purposes (small MOD), it's O(1).
// Total operations are 10^5, so O(log MOD) per `getIndex` is acceptable.
// Space Complexity: O(N) where N is the number of `append` calls. We store `N` triplets of `[val, m_at_append, a_at_append]`.

class Fancy {
    // Modulo constant
    static MOD = 10 ** 9 + 7;

    // Array to store the sequence elements. Each element is an array [original_val, m_at_append, a_at_append].
    // original_val: The value provided during `append`.
    // m_at_append: The `globalMult` value at the time this element was appended.
    // a_at_append: The `globalAdd` value at the time this element was appended.
    sequence = [];

    // Global multiplier applied to all existing elements.
    // Represents `M` in `x -> x*M + A`.
    globalMult = 1;

    // Global adder applied to all existing elements.
    // Represents `A` in `x -> x*M + A`.
    globalAdd = 0;

    constructor() {
        // Initialize the object with an empty sequence.
        // `globalMult` and `globalAdd` are already initialized to 1 and 0 respectively.
    }

    /**
     * Appends an integer val to the end of the sequence.
     * @param {number} val
     * @return {void}
     */
    append(val) {
        // Store the original value along with the current global transformation state.
        // This state (globalMult, globalAdd) defines the transformation function
        // `f(x) = x * globalMult + globalAdd` that was active at this point in time.
        this.sequence.push([val, this.globalMult, this.globalAdd]);
    }

    /**
     * Increments all existing values in the sequence by an integer inc.
     * @param {number} inc
     * @return {void}
     */
    addAll(inc) {
        // Only update the global additive component.
        // The transformation `x -> x*M + A` becomes `x -> x*M + (A + inc)`.
        this.globalAdd = (this.globalAdd + inc) % Fancy.MOD;
    }

    /**
     * Multiplies all existing values in the sequence by an integer m.
     * @param {number} m
     * @return {void}
     */
    multAll(m) {
        // Update both global multiplicative and additive components.
        // The transformation `x -> x*M + A` becomes `x -> (x*M + A)*m = x*(M*m) + (A*m)`.
        this.globalMult = (this.globalMult * m) % Fancy.MOD;
        this.globalAdd = (this.globalAdd * m) % Fancy.MOD;
    }

    /**
     * Gets the current value at index idx (0-indexed) of the sequence modulo 10^9 + 7.
     * If the index is greater or equal than the length of the sequence, return -1.
     * @param {number} idx
     * @return {number}
     */
    getIndex(idx) {
        // Check for out-of-bounds index.
        if (idx >= this.sequence.length) {
            return -1;
        }

        // Retrieve the stored values for this index.
        const [original_val, m_at_append, a_at_append] = this.sequence[idx];

        // The current overall transformation is `x -> x * this.globalMult + this.globalAdd`.
        // The transformation applied to `original_val` at its append time was `x -> x * m_at_append + a_at_append`.
        // We need to find the "net" transformation that happened *between* the append time and now.
        // Let `f_current(x) = x * this.globalMult + this.globalAdd`.
        // Let `f_append(x) = x * m_at_append + a_at_append`.
        // We are looking for `f_net` such that `f_current(x) = f_net(f_append(x))`.
        // Or more directly: value at index `idx` is `val_base` transformed by `f_current` relative to `f_append`.
        // This is equivalent to applying `f_current` to `val_base` but "undoing" `f_append`.
        // The transformation can be expressed as: `val_final = original_val * M_delta + A_delta`.
        // Where `M_delta = this.globalMult * modInverse(m_at_append)`
        // And `A_delta = (this.globalAdd - a_at_append * M_delta) % Fancy.MOD`.
        // (Ensure `A_delta` is non-negative.)

        // Calculate modular inverse of `m_at_append`.
        // `m_at_append` can be 0 if `multAll(0)` was called before this append.
        // If `m_at_append` is 0, it means the base value was effectively multiplied by 0.
        // If `m_at_append` is 0, then any subsequent `multAll(m)` will keep it 0.
        // If it's 0, we need to handle this specially.
        // If `m_at_append` is 0, then the value `original_val` was effectively `0 * original_val + a_at_append = a_at_append`.
        // The current state is `current_val = current_mult * X + current_add`.
        // So `X` effectively became `a_at_append`.
        // We are looking for the value of `original_val` after applying the current transformations.
        // If `m_at_append` is 0, then the value was `a_at_append` when appended.
        // The current value should be `a_at_append * this.globalMult + this.globalAdd`.
        // Let's analyze `m_at_append` could be 0. Constraints say `m >= 1`.
        // So `m_at_append` will always be >= 1.
        // Therefore `m_at_append` will always have a modular inverse.
        
        const m_at_append_inv = this._modInverse(m_at_append);

        // Calculate the effective multiplier difference.
        // `M_delta = this.globalMult * m_at_append_inv`.
        const m_delta = (this.globalMult * m_at_append_inv) % Fancy.MOD;

        // Calculate the effective adder difference.
        // `A_delta = this.globalAdd - a_at_append * m_delta`.
        // Ensure result is non-negative for modulo operations.
        let a_delta = (this.globalAdd - (a_at_append * m_delta) % Fancy.MOD + Fancy.MOD) % Fancy.MOD;

        // Apply the net transformation to the original value.
        // `result = (original_val * M_delta + A_delta) % Fancy.MOD`.
        let result = (original_val * m_delta + a_delta) % Fancy.MOD;

        return result;
    }

    /**
     * Calculates (base^exp) % MOD using modular exponentiation (binary exponentiation).
     * @param {number} base
     * @param {number} exp
     * @return {number}
     */
    _power(base, exp) {
        let res = 1;
        base %= Fancy.MOD;
        while (exp > 0) {
            if (exp % 2 === 1) res = (res * base) % Fancy.MOD;
            base = (base * base) % Fancy.MOD;
            exp = Math.floor(exp / 2);
        }
        return res;
    }

    /**
     * Calculates the modular multiplicative inverse of n modulo MOD.
     * Uses Fermat's Little Theorem: a^(MOD-2) % MOD is inverse of a % MOD
     * (valid for prime MOD and a not multiple of MOD).
     * @param {number} n
     * @return {number}
     */
    _modInverse(n) {
        return this._power(n, Fancy.MOD - 2);
    }
}