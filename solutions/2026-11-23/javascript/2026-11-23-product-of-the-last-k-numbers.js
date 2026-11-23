/**
 * @file LeetCode Problem: Product of the Last K Numbers
 * @problem-summary Design a class to handle a stream of integers and compute the product of the last k numbers.
 * @link https://leetcode.com/problems/product-of-the-last-k-numbers/
 *
 * @approach
 * The key challenge is to efficiently calculate the product of the last k numbers. A naive approach would be to store all numbers in a list and iterate through the last k elements for each `getProduct` call. This would result in O(k) time complexity for `getProduct`.
 *
 * To achieve O(1) time complexity for `getProduct`, we can leverage prefix products. We'll maintain a list `products` where `products[i]` stores the product of all numbers added to the stream up to (but not including) the i-th number.
 *
 * When `add(num)` is called:
 * 1. If `num` is 0, it means any product including this 0 will become 0. To handle this, we reset our `products` list and start fresh from this 0. We add 1 to the `products` list to represent the prefix product before this 0.
 * 2. If `num` is not 0, we append the product of the last element in `products` and `num` to `products`. This ensures `products[i]` continues to hold the prefix product.
 *
 * When `getProduct(k)` is called:
 * 1. We need the product of the last k numbers. If the current stream has `n` numbers, we want the product from index `n-k` to `n-1`.
 * 2. Using prefix products, this can be calculated as `products[n] / products[n-k]`.
 * 3. If `products[n-k]` is 0 (which happens if there was a 0 in the last k numbers), then the product of the last k numbers will be 0. This is handled implicitly by the division or explicitly by checking if `products[n-k]` is 0.
 *
 * The `products` list will store prefix products. `products[0]` will always be 1 (representing the product before any numbers are added).
 *
 * Example Walkthrough:
 * add(3): products = [1, 3] (n=1, products[1] = products[0]*3 = 1*3 = 3)
 * add(0): products = [1, 1] (reset due to 0. products[0]=1. Then add 0. The prefix product *before* 0 is 1. So list becomes [1, 1]. The last element `products[1]` now represents the product up to the element *before* the last added 0. The actual list is [3,0]. The prefix product list logic needs care here)
 *
 * Let's refine the `products` list definition: `products[i]` stores the product of numbers from index 0 up to index `i-1` of the *actual stream of non-zero numbers*.
 *
 * Corrected Approach:
 * Store prefix products in a list `prefixProducts`. `prefixProducts[i]` will store the product of the first `i` non-zero numbers added to the stream.
 *
 * When `add(num)` is called:
 * 1. If `num` is 0:
 *    - A 0 invalidates any previous prefix product calculation that extends beyond it. We need to restart our prefix product calculation.
 *    - We clear `prefixProducts` and add 1 to it. This signifies that the product before the current (0) number is 1.
 *    - We also need to track the number of zeros encountered, or more simply, the index of the last zero.
 *
 * Let's rethink the `products` list. `products[i]` stores the product of all *non-zero* numbers encountered so far.
 *
 * `products` array will store prefix products. `products[0] = 1`.
 * `add(num)`:
 *  - If `num === 0`: We can't simply continue multiplying. A zero resets our product calculation. The simplest way to handle this is to clear our prefix product list and start anew from 1. We also need a way to know if a zero was encountered recently.
 *  - If `num !== 0`: We append `products.back() * num` to `products`.
 *
 * This still feels complex with zeros.
 *
 * Simpler approach for O(1):
 * We maintain a list `products` where `products[i]` is the product of all *non-zero* numbers encountered *up to the i-th non-zero number*.
 * And a counter `zeroCount` for the number of zeros.
 *
 * When `add(num)` is called:
 * 1. If `num === 0`: Increment `zeroCount`.
 * 2. If `num !== 0`:
 *    - If `products` is empty or `products.length` is equal to `zeroCount` (meaning all previous numbers were zeros), then `products.push(num)`.
 *    - Otherwise, `products.push(products.back() * num)`.
 *
 * When `getProduct(k)` is called:
 * 1. If `zeroCount >= k`: The last k numbers must contain at least one zero, so the product is 0.
 * 2. Otherwise (no zeros in the last k numbers):
 *    - Let `n` be the number of non-zero numbers encountered so far (which is `products.length`).
 *    - The product of the last k *non-zero* numbers is `products[n-1] / products[n-1-k]`. (Note: if `k` is exactly `n`, we need `products[n-1] / products[n-1-n]`. This implies `products` should be indexed such that `products[0]` is the product of the first non-zero number, `products[1]` of first two, etc. This is not ideal.)
 *
 * Let's use the prefix product idea but carefully handle zeros.
 * `stream` will store the actual numbers added.
 * `prefixProducts` will store prefix products. `prefixProducts[i]` = product of `stream[0]` to `stream[i-1]`.
 *
 * `add(num)`:
 *  - Append `num` to `stream`.
 *  - If `num === 0`:
 *     - Append 0 to `prefixProducts`. (This will make all subsequent prefix products 0).
 *  - Else (`num !== 0`):
 *     - If `prefixProducts` is empty or the last element of `prefixProducts` is 0, then append `num` to `prefixProducts`.
 *     - Else, append `prefixProducts.back() * num` to `prefixProducts`.
 *
 * `getProduct(k)`:
 *  - Let `n = stream.length`.
 *  - If `n < k`, this case is guaranteed not to happen by constraints.
 *  - If `prefixProducts[n]` is 0, it means there's a zero in the last `k` numbers. Return 0.
 *  - Otherwise, return `prefixProducts[n] / prefixProducts[n-k]`.
 *
 * This still feels like O(k) for `getProduct` if we need to find `n` first.
 *
 * The actual O(1) approach uses the `prefixProducts` list cleverly.
 * `prefixProducts` list stores the running product of *non-zero* numbers encountered so far.
 *
 * `ProductOfNumbers()`:
 *  - `this.prefixProducts = [1];` // Initialize with 1 for the product before any numbers.
 *
 * `add(num)`:
 *  - If `num === 0`:
 *     - We encountered a zero. This means any product including this zero will be zero. To ensure `getProduct(k)` returns 0 if a zero is within the last k numbers, we can signal this.
 *     - The simplest way is to reset our `prefixProducts` and start again from 1.
 *     - `this.prefixProducts = [1];`
 *  - Else (`num !== 0`):
 *     - Append the new prefix product: `this.prefixProducts.push(this.prefixProducts[this.prefixProducts.length - 1] * num);`
 *
 * `getProduct(k)`:
 *  - Let `n = this.prefixProducts.length`.
 *  - If `n <= k`: This implies that either we have fewer than k non-zero numbers, or we had a zero and reset, and now `k` is larger than the number of non-zero elements. In this case, a zero must have been encountered within the scope of the last `k` effective numbers. Thus, the product is 0.
 *     - Example: stream: [3, 0, 2, 5, 4], k=3. `prefixProducts` would be `[1, 3]` after 0, then `[1, 3, 6, 30]` after 2, 5. If we `add(4)`, `prefixProducts` becomes `[1, 3, 6, 30, 120]`. Length is 5. `k=3`. `n=5`.
 *     - If `k=4` after `add(8)`: stream is `[3,0,2,5,4,8]`. `prefixProducts` resets to `[1]` after 0. Then adds 2,5,4,8. `prefixProducts` becomes `[1, 2, 10, 40, 320]`. Length `n=5`.
 *     - The check should be if `k` is larger than the number of *available non-zero products*.
 *     - If the `prefixProducts` list's length `n` is less than or equal to `k`, it implies that there are not enough non-zero numbers to form a product of `k` non-zero numbers. This can only happen if a 0 was introduced and reset the `prefixProducts`. Therefore, the product of the last `k` numbers (which would include a 0) is 0.
 *     - `if (n <= k) return 0;`
 *  - Otherwise, the product of the last k *non-zero* numbers is `this.prefixProducts[n - 1] / this.prefixProducts[n - 1 - k]`.
 *     - `return this.prefixProducts[n - 1] / this.prefixProducts[n - 1 - k];`
 *
 * This approach works because when a 0 is encountered, `prefixProducts` is reset to `[1]`. If `k` is larger than the new length of `prefixProducts` (which is 1), then `getProduct(k)` will correctly return 0, indicating that a zero was part of the last `k` conceptual numbers.
 *
 * Time Complexity:
 * - `ProductOfNumbers()`: O(1)
 * - `add(num)`: O(1) (Appending to a list is amortized O(1))
 * - `getProduct(k)`: O(1) (Accessing list elements and performing division)
 *
 * Space Complexity:
 * - O(N), where N is the number of non-zero integers added to the stream. In the worst case (no zeros), the `prefixProducts` list will grow linearly with the number of additions.
 *
 * Consider the example:
 * ["ProductOfNumbers","add","add","add","add","add","getProduct","getProduct","getProduct","add","getProduct"]
 * [[],[3],[0],[2],[5],[4],[2],[3],[4],[8],[2]]
 *
 * 1. `ProductOfNumbers()`: `prefixProducts = [1]`
 * 2. `add(3)`: `num = 3`. `prefixProducts = [1, 1*3] = [1, 3]`
 * 3. `add(0)`: `num = 0`. Reset. `prefixProducts = [1]`
 * 4. `add(2)`: `num = 2`. `prefixProducts = [1, 1*2] = [1, 2]`
 * 5. `add(5)`: `num = 5`. `prefixProducts = [1, 2, 2*5] = [1, 2, 10]`
 * 6. `add(4)`: `num = 4`. `prefixProducts = [1, 2, 10, 10*4] = [1, 2, 10, 40]`
 *
 * 7. `getProduct(2)`: `k = 2`. `n = prefixProducts.length = 4`.
 *    `n > k` (4 > 2).
 *    Return `prefixProducts[4-1] / prefixProducts[4-1-2]` = `prefixProducts[3] / prefixProducts[1]` = `40 / 2` = `20`. (Correct: 5 * 4 = 20)
 *
 * 8. `getProduct(3)`: `k = 3`. `n = prefixProducts.length = 4`.
 *    `n > k` (4 > 3).
 *    Return `prefixProducts[4-1] / prefixProducts[4-1-3]` = `prefixProducts[3] / prefixProducts[0]` = `40 / 1` = `40`. (Correct: 2 * 5 * 4 = 40)
 *
 * 9. `getProduct(4)`: `k = 4`. `n = prefixProducts.length = 4`.
 *    `n <= k` (4 <= 4).
 *    Return `0`. (Correct: 0 * 2 * 5 * 4 = 0)
 *
 * 10. `add(8)`: `num = 8`. `prefixProducts = [1, 2, 10, 40, 40*8] = [1, 2, 10, 40, 320]`
 *
 * 11. `getProduct(2)`: `k = 2`. `n = prefixProducts.length = 5`.
 *     `n > k` (5 > 2).
 *     Return `prefixProducts[5-1] / prefixProducts[5-1-2]` = `prefixProducts[4] / prefixProducts[2]` = `320 / 10` = `32`. (Correct: 4 * 8 = 32)
 *
 * The logic seems sound. The key is that when `add(0)` is called, we reset `prefixProducts` to `[1]`. If `getProduct(k)` is called and the length of `prefixProducts` is less than or equal to `k`, it means that the `k` numbers that would have been considered must include at least one zero (because there aren't enough non-zero numbers in `prefixProducts` to satisfy `k` *non-zero* numbers), thus returning 0.
 */
class ProductOfNumbers {
    constructor() {
        // prefixProducts will store the cumulative product of non-zero numbers.
        // prefixProducts[i] will be the product of the first i non-zero numbers added.
        // We initialize it with [1] to handle cases where getProduct(k) is called with k equal to the number of non-zero elements.
        // This also serves as the base for multiplication.
        this.prefixProducts = [1];
    }

    /**
     * Appends the integer num to the stream.
     * If num is 0, it resets the prefix product calculation because any product involving 0 becomes 0.
     * If num is non-zero, it updates the cumulative product.
     * @param {number} num The integer to add to the stream.
     * @return {void}
     */
    add(num) {
        if (num === 0) {
            // If a zero is encountered, any product that includes this zero will be zero.
            // To ensure getProduct correctly returns 0 when a zero is within the last k numbers,
            // we reset our prefix product list. The new list starts with 1, representing the product before the next non-zero number.
            this.prefixProducts = [1];
        } else {
            // If the number is non-zero, we calculate the new prefix product by multiplying
            // the last prefix product with the current number.
            // this.prefixProducts.length - 1 gives the index of the last element.
            const lastProduct = this.prefixProducts[this.prefixProducts.length - 1];
            this.prefixProducts.push(lastProduct * num);
        }
    }

    /**
     * Returns the product of the last k numbers in the current list.
     * Assumes that the current list has at least k numbers.
     * @param {number} k The number of last elements to consider for the product.
     * @return {number} The product of the last k numbers.
     */
    getProduct(k) {
        // n is the number of elements in our prefixProducts list.
        // This corresponds to the count of non-zero numbers encountered since the last zero (or from the beginning).
        const n = this.prefixProducts.length;

        // If n <= k, it means we don't have enough non-zero numbers to form a product of k.
        // This can only happen if a zero was introduced in the stream, resetting our prefixProducts list.
        // Therefore, the product of the last k numbers (which must include a zero) is 0.
        if (n <= k) {
            return 0;
        } else {
            // To get the product of the last k non-zero numbers:
            // The total product of the last 'n' non-zero numbers is prefixProducts[n-1].
            // The product of the first 'n-k' non-zero numbers is prefixProducts[n-1-k].
            // Dividing the total product by the product of the initial part gives us the product of the last k numbers.
            // Example: prefixProducts = [1, 2, 6, 24] (for numbers 2, 3, 4)
            // If k=2, we want product of last 2 numbers (3*4=12).
            // n = 4.
            // prefixProducts[4-1] = prefixProducts[3] = 24.
            // prefixProducts[4-1-2] = prefixProducts[1] = 2.
            // 24 / 2 = 12.
            return this.prefixProducts[n - 1] / this.prefixProducts[n - 1 - k];
        }
    }
}
/**
 * Your ProductOfNumbers object will be instantiated and called as such:
 * var obj = new ProductOfNumbers()
 * obj.add(num)
 * var param_2 = obj.getProduct(k)
 */
