```python
# Problem: Product of the Last K Numbers
# Link: https://leetcode.com/problems/product-of-the-last-k-numbers/
#
# Approach:
# To efficiently calculate the product of the last k numbers, especially to achieve O(1) for getProduct,
# we can maintain a list of prefix products. However, a naive prefix product list will be affected by zeros.
# When a zero is encountered, all subsequent products will become zero.
#
# To handle zeros, we can reset our prefix product calculation whenever a zero appears.
# We can store the indices of zeros. If `k` is large enough to include a zero, the product will be 0.
# Otherwise, we can use the prefix products calculated since the last zero.
#
# A more refined approach for O(1) `add` and `getProduct`:
# We will store a list `products` where `products[i]` is the product of numbers from the beginning of the stream
# up to the current number, EXCLUDING any zeros.
#
# When `add(num)` is called:
# - If `num` is 0, we need to signal that any product involving this zero will be 0. We can do this by
#   clearing our `products` list and storing the index of this zero or simply marking that a zero has been seen.
#   A common strategy is to restart the prefix product list from 1 and remember the count of numbers added
#   since the last zero.
# - If `num` is not 0, we append `num` to our current prefix product list. If the list is empty (meaning a zero
#   was just added or it's the very first number), we start with `num`. Otherwise, we append the previous prefix
#   product multiplied by `num`.
#
# Let's refine the O(1) approach for both `add` and `getProduct`.
# We will store a list `prefix_products`. `prefix_products[i]` will be the product of the first `i` non-zero numbers encountered so far.
# When a zero is encountered, it effectively "resets" the stream for product calculations.
#
# We can store the current prefix product. When `add(num)` is called:
# If `num` is 0: We need to invalidate all current prefix products. A simple way is to store a sentinel value or reset.
# A better approach: store the prefix products in a list. If `num` is 0, we clear the list and add a placeholder (e.g., 1).
# Then, we keep track of the last seen zero's index.
#
# Let's use a list `stream` to store the actual numbers for simplicity first, and then optimize.
# Initial thought: `stream` list. `add` is O(1), `getProduct` is O(k).
#
# For O(1) `getProduct`:
# We can maintain a list `prefix_products`. `prefix_products[i]` will be the product of the first `i` numbers *that are not zero*.
# When `add(num)` is called:
# - If `num` is 0, we clear `prefix_products` and add a sentinel value (like 1) to indicate that a zero was encountered.
#   We also need to keep track of how many numbers have been added since the last zero.
# - If `num` is not 0, we append `num * prefix_products[-1]` to `prefix_products`.
#
# Let's use a list `products` where `products[i]` is the product of numbers seen *so far, not including zeros*.
# When `add(num)` is called:
# - If `num` is 0: We clear our `products` list and add `1` as a dummy element to mark the reset.
# - If `num` is not 0: We take the last element of `products`, multiply it by `num`, and append the result.
#   If `products` is empty (meaning it was just reset due to a zero or it's the first element), we append `num`.
#
# `getProduct(k)`:
# - If `k` is greater than or equal to the current effective length of the non-zero stream (which is `len(products) - 1` if `products[0]` is the dummy 1),
#   it means a zero is involved in the last `k` numbers. Return 0.
# - Otherwise, the product of the last `k` numbers is `products[-1] // products[-k-1]`.
#
# Example Walkthrough:
# `productOfNumbers = ProductOfNumbers()`
# `products = [1]` (initial dummy)
# `add(3)`: `products = [1, 3]`
# `add(0)`: `products = [1]` (cleared and reset)
# `add(2)`: `products = [1, 2]`
# `add(5)`: `products = [1, 2, 10]`
# `add(4)`: `products = [1, 2, 10, 40]`
# `getProduct(2)`: `k=2`. `len(products) = 4`. `k < len(products)-1` (2 < 3).
#                Result: `products[-1] // products[-2]` = `40 // 10` = `4`. This is wrong.
#
# The prefix product should be of the *numbers themselves*, not cumulative.
#
# Let's try another approach: store prefix products.
# `prefix_products = [1]` (sentinel for the start)
# `add(num)`:
#   If `num == 0`:
#     `prefix_products = [1]` (reset, effectively starting a new stream)
#   Else:
#     `prefix_products.append(prefix_products[-1] * num)`
#
# `getProduct(k)`:
#   If `k >= len(prefix_products)`: This means there were fewer than `k` non-zero numbers since the last reset.
#                                  This indicates that a zero must be within the last `k` original numbers. Return 0.
#   Else: The product of the last `k` non-zero numbers is `prefix_products[-1] // prefix_products[-k-1]`.
#
# Example Walkthrough with this refined approach:
# `productOfNumbers = ProductOfNumbers()`
# `prefix_products = [1]`
#
# `add(3)`: `prefix_products = [1, 3]`
# `add(0)`: `prefix_products = [1]` (reset)
# `add(2)`: `prefix_products = [1, 2]`
# `add(5)`: `prefix_products = [1, 2, 10]`
# `add(4)`: `prefix_products = [1, 2, 10, 40]`
#
# `getProduct(2)`: `k=2`. `len(prefix_products)=4`. `k < len(prefix_products)` (2 < 4).
#                Result: `prefix_products[-1] // prefix_products[-2]` = `40 // 10` = `4`. Still wrong.
#
# The problem is the interpretation of "last k numbers". It refers to the last k numbers added to the stream,
# regardless of whether they are zero or not.
#
# If we store the stream directly:
# `stream = []`
# `add(num)`: `stream.append(num)`
# `getProduct(k)`: Iterate `stream[-k:]`, calculate product. This is O(k).
#
# To achieve O(1) for `getProduct`, we need to avoid iterating.
# The issue with zeros is critical. If a zero is in the last `k` numbers, the product is 0.
#
# Let's reconsider the prefix product approach, but carefully handle zeros.
# We can store the actual numbers in a list, and *also* maintain a list of prefix products of non-zero numbers.
#
# `numbers = []` # Stores all numbers added.
# `prefix_product_non_zero = [1]` # Stores prefix products of non-zero numbers only.
#
# `add(num)`:
#   `numbers.append(num)`
#   If `num == 0`:
#     `prefix_product_non_zero = [1]` # Reset because any subsequent product will be zero if it includes this zero.
#   Else:
#     `prefix_product_non_zero.append(prefix_product_non_zero[-1] * num)`
#
# `getProduct(k)`:
#   Check if there's a zero in the last `k` numbers of `numbers`.
#   If `len(numbers) < k`: This case is guaranteed not to happen by the problem statement ("always the current list has at least k numbers").
#   So, we need to check `numbers[len(numbers)-k : ]` for zeros.
#   If any number in `numbers[len(numbers)-k : ]` is 0, return 0.
#   Otherwise, the product is determined by the non-zero numbers.
#   The number of non-zero elements to consider from the end is `k`.
#   If a zero was encountered, `prefix_product_non_zero` would have been reset.
#   If the current `len(prefix_product_non_zero)` is less than or equal to `k`, it implies that within the last `k` original numbers,
#   there were enough zeros such that the count of non-zero numbers is at most `k-1` (or `k` if the last number was non-zero and there was no zero before it in the last k).
#   This is getting complicated.
#
# Let's simplify the state. We only need the prefix products of the NON-ZERO elements *since the last zero*.
#
# `prefix_products = [1]` # Stores the running product of non-zero numbers. `prefix_products[i]` is the product of the first `i` non-zero numbers.
#
# `add(num)`:
#   If `num == 0`:
#     `prefix_products = [1]` # Reset the list. This signals that any product including this 0 will be 0.
#   Else:
#     `prefix_products.append(prefix_products[-1] * num)`
#
# `getProduct(k)`:
#   The length of `prefix_products` tells us how many non-zero numbers are available *since the last zero*.
#   If `len(prefix_products) <= k`: This means that the last `k` original numbers MUST contain at least one zero.
#                                  Why? Because `len(prefix_products)` counts the non-zero numbers. If this count
#                                  is less than or equal to `k`, it means that even if all the last `k` numbers
#                                  were non-zero, we would still need `k` elements in `prefix_products`. If we have `k` or fewer,
#                                  it means there were fewer than `k` non-zero numbers in the last `k` original numbers.
#                                  This can only happen if there was a zero in between.
#                                  Example: Stream `[3, 5, 2, 4]`. `prefix_products = [1, 3, 15, 30, 120]`. `len = 5`.
#                                  `getProduct(2)`: `k=2`. `len=5`. `len > k`. Product = `prefix_products[5] / prefix_products[5-2]` = `prefix_products[5] / prefix_products[3]` = `120 / 15` = `8`. Wrong.
#                                  It should be `5 * 4 = 20`.
#
# The prefix product list should correspond to the indices of the numbers themselves, not just non-zeros.
#
# Final strategy attempt:
# We store prefix products in a list. `prefix_products[i]` = product of `nums[0]...nums[i-1]`.
# If we encounter a 0, we need a way to distinguish.
#
# Let's store the list of numbers itself, `self.nums`.
# `self.nums = []`
# `add(num)`: `self.nums.append(num)`
# `getProduct(k)`: Calculate product of `self.nums[-k:]`. This is O(k).
#
# For O(1) getProduct:
# We must precompute or store enough information.
# The core issue is the zero.
#
# Consider storing a list of prefix products of non-zero numbers, and an indicator of when the last zero was.
#
# `prefix_products = [1]` # `prefix_products[i]` is the product of the first `i` non-zero numbers.
# `last_zero_idx = -1` # Index of the last zero in the original stream.
# `stream_len = 0` # Number of elements added to the stream.
#
# `add(num)`:
#   `stream_len += 1`
#   If `num == 0`:
#     `prefix_products = [1]` # Reset prefix products.
#     `last_zero_idx = stream_len - 1` # Record the index of this zero.
#   Else:
#     `prefix_products.append(prefix_products[-1] * num)`
#
# `getProduct(k)`:
#   The total number of elements in the stream is `stream_len`.
#   The last `k` elements are from index `stream_len - k` to `stream_len - 1`.
#
#   If `last_zero_idx >= stream_len - k`: This means the last zero occurred within the last `k` elements.
#                                          So, the product of the last `k` numbers must be 0. Return 0.
#
#   Else (no zero in the last `k` elements):
#     We need the product of the last `k` *non-zero* numbers that are relevant.
#     The number of non-zero elements available *since the last zero* is `len(prefix_products) - 1`.
#     If `k` is greater than this count, it means there are fewer than `k` non-zero elements available since the last zero,
#     which contradicts the fact that there's no zero in the last `k` elements.
#     So, `len(prefix_products) - 1` must be >= `k`.
#
#     The last non-zero product we have is `prefix_products[-1]`. This corresponds to the product of the first `len(prefix_products) - 1` non-zero numbers.
#     We need the product of the last `k` non-zero numbers.
#     This is `prefix_products[-1] // prefix_products[len(prefix_products) - 1 - k]`.
#
# Example Walkthrough:
# `productOfNumbers = ProductOfNumbers()`
# `prefix_products = [1]`
# `last_zero_idx = -1`
# `stream_len = 0`
#
# `add(3)`:
#   `stream_len = 1`
#   `num = 3` (not 0)
#   `prefix_products = [1, 3]`
#
# `add(0)`:
#   `stream_len = 2`
#   `num = 0`
#   `prefix_products = [1]`
#   `last_zero_idx = 1` (index of the 0 is 2-1=1)
#
# `add(2)`:
#   `stream_len = 3`
#   `num = 2` (not 0)
#   `prefix_products = [1, 2]`
#
# `add(5)`:
#   `stream_len = 4`
#   `num = 5` (not 0)
#   `prefix_products = [1, 2, 10]`
#
# `add(4)`:
#   `stream_len = 5`
#   `num = 4` (not 0)
#   `prefix_products = [1, 2, 10, 40]`
#
# `getProduct(2)`:
#   `k = 2`
#   `stream_len = 5`
#   `last_zero_idx = 1`
#   Check `last_zero_idx >= stream_len - k`: `1 >= 5 - 2` => `1 >= 3` (False). No zero in last 2 elements.
#   Calculate product: `len(prefix_products) - 1 = 4 - 1 = 3`.
#   We need the product of the last `k=2` non-zero numbers.
#   The non-zero numbers since last zero are: 2, 5, 4. Their products are 2, 10, 40.
#   `prefix_products` has `[1, 2, 10, 40]`.
#   The index in `prefix_products` corresponding to `k` non-zero elements from the end is `len(prefix_products) - 1 - k`.
#   Here, `4 - 1 - 2 = 1`. So we need `prefix_products[1]`.
#   The result is `prefix_products[-1] // prefix_products[len(prefix_products) - 1 - k]`.
#   `40 // prefix_products[4 - 1 - 2]` => `40 // prefix_products[1]` => `40 // 2` = `20`. Correct!
#
# `getProduct(3)`:
#   `k = 3`
#   `stream_len = 5`
#   `last_zero_idx = 1`
#   Check `last_zero_idx >= stream_len - k`: `1 >= 5 - 3` => `1 >= 2` (False). No zero in last 3 elements.
#   Calculate product: `len(prefix_products) - 1 = 3`.
#   We need the product of the last `k=3` non-zero numbers.
#   Index in `prefix_products`: `len(prefix_products) - 1 - k` = `4 - 1 - 3 = 0`. So we need `prefix_products[0]`.
#   Result: `prefix_products[-1] // prefix_products[0]` = `40 // 1` = `40`. Correct!
#
# `getProduct(4)`:
#   `k = 4`
#   `stream_len = 5`
#   `last_zero_idx = 1`
#   Check `last_zero_idx >= stream_len - k`: `1 >= 5 - 4` => `1 >= 1` (True). Zero IS in last 4 elements.
#   Return 0. Correct!
#
# `add(8)`:
#   `stream_len = 6`
#   `num = 8` (not 0)
#   `prefix_products = [1, 2, 10, 40, 320]`
#
# `getProduct(2)`:
#   `k = 2`
#   `stream_len = 6`
#   `last_zero_idx = 1`
#   Check `last_zero_idx >= stream_len - k`: `1 >= 6 - 2` => `1 >= 4` (False). No zero in last 2.
#   Calculate product: `len(prefix_products) - 1 = 5 - 1 = 4`.
#   We need the product of the last `k=2` non-zero numbers.
#   Index in `prefix_products`: `len(prefix_products) - 1 - k` = `5 - 1 - 2 = 2`. So we need `prefix_products[2]`.
#   Result: `prefix_products[-1] // prefix_products[2]` = `320 // 10` = `32`. Correct!
#
# This approach seems to work and gives O(1) for both operations.
#
# Time Complexity:
# - `__init__`: O(1)
# - `add(num)`: O(1) (list append and arithmetic operations are constant time).
# - `getProduct(k)`: O(1) (list indexing, arithmetic operations, and comparisons are constant time).
#
# Space Complexity:
# - O(N), where N is the number of elements added to the stream without encountering a zero since the last zero.
#   In the worst case (no zeros), the `prefix_products` list can grow up to N elements.
#   The `last_zero_idx` and `stream_len` take O(1) space.
#   Thus, the space complexity is dominated by the `prefix_products` list.
#
# Constraint Check:
# - "The product of the stream at any point in time will fit in a 32-bit integer." This is guaranteed, so no overflow issues with intermediate products.
# - "at most 4 * 10^4 calls". The space complexity is acceptable.
#
# Edge Case: What if the first number added is 0?
# `productOfNumbers = ProductOfNumbers()`
# `prefix_products = [1]`
# `last_zero_idx = -1`
# `stream_len = 0`
#
# `add(0)`:
#   `stream_len = 1`
#   `num = 0`
#   `prefix_products = [1]`
#   `last_zero_idx = 0`
#
# `add(5)`:
#   `stream_len = 2`
#   `num = 5`
#   `prefix_products = [1, 5]`
#
# `getProduct(1)`:
#   `k = 1`
#   `stream_len = 2`
#   `last_zero_idx = 0`
#   Check `last_zero_idx >= stream_len - k`: `0 >= 2 - 1` => `0 >= 1` (False). No zero in last 1 element.
#   Calculate product: `len(prefix_products) - 1 = 2 - 1 = 1`.
#   Index in `prefix_products`: `len(prefix_products) - 1 - k` = `2 - 1 - 1 = 0`. So we need `prefix_products[0]`.
#   Result: `prefix_products[-1] // prefix_products[0]` = `5 // 1` = `5`. Correct.
#
# The logic holds. The initial `prefix_products = [1]` serves as a base case, and `prefix_products[i]`
# represents the product of the first `i` non-zero numbers.
# When `k` non-zero numbers are needed, we look at the last `k+1` elements in `prefix_products` (from `prefix_products[len - 1 - k]` up to `prefix_products[len - 1]`).
# The product of the last `k` non-zero numbers is `prefix_products[-1] / prefix_products[len - 1 - k]`.
# The index `len - 1 - k` refers to the prefix product *before* the `k` non-zero numbers we are interested in.

class ProductOfNumbers:
    def __init__(self):
        # `prefix_products` stores the running product of non-zero numbers encountered so far.
        # `prefix_products[i]` represents the product of the first `i` non-zero numbers.
        # We initialize with `[1]` to handle cases where the first few numbers are non-zero,
        # and to have a base for division.
        self.prefix_products = [1]

        # `last_zero_idx` stores the index in the conceptual stream where the last zero was encountered.
        # This is crucial for determining if the last `k` numbers include a zero.
        # Initialized to -1 as no zero has been seen yet.
        self.last_zero_idx = -1

        # `stream_len` keeps track of the total number of elements added to the stream.
        self.stream_len = 0

    def add(self, num: int) -> None:
        # Increment the stream length for each number added.
        self.stream_len += 1

        if num == 0:
            # If a zero is encountered, it effectively resets the product calculation for any subsequent numbers.
            # We clear `prefix_products` and reset it to `[1]`. This signifies the start of a new sequence of non-zero products.
            self.prefix_products = [1]
            # We record the index of this zero. The index is `stream_len - 1` because stream is 0-indexed.
            self.last_zero_idx = self.stream_len - 1
        else:
            # If the number is not zero, we update the prefix product.
            # We multiply the last prefix product by the current number and append it.
            # This means `prefix_products[-1]` now holds the product of all non-zero numbers from the beginning up to this point (since the last zero).
            self.prefix_products.append(self.prefix_products[-1] * num)

    def getProduct(self, k: int) -> int:
        # To find the product of the last `k` numbers, we first check if any of these `k` numbers were zero.
        # The last `k` numbers in the stream span from index `self.stream_len - k` to `self.stream_len - 1`.
        # If the `last_zero_idx` is greater than or equal to `self.stream_len - k`, it means the last zero
        # occurred within the window of the last `k` numbers.
        if self.last_zero_idx >= self.stream_len - k:
            # If a zero is present in the last `k` numbers, the product is 0.
            return 0
        else:
            # If there are no zeros in the last `k` numbers, we can calculate the product using prefix products.
            # The `prefix_products` list contains products of non-zero numbers.
            # `self.prefix_products[-1]` is the product of all non-zero numbers in the stream since the last zero.
            # We need the product of the last `k` *non-zero* numbers that are relevant.
            # The number of non-zero elements available is `len(self.prefix_products) - 1`.
            # To get the product of the last `k` non-zero numbers, we divide the total product of non-zeros
            # by the product of non-zeros *before* these last `k`.
            # The index of the prefix product just before the last `k` non-zero elements is `len(self.prefix_products) - 1 - k`.
            # Example: prefix_products = [1, 3, 15, 30, 120] (non-zeros 3, 5, 2, 4). len=5.
            # If k=2, we want 5*4=20. `last_k_non_zeros_product = prefix_products[-1] / prefix_products[len-1-k]`
            # `120 / prefix_products[5-1-2]` = `120 / prefix_products[2]` = `120 / 15` = `8`. Still wrong.

            # Correct logic for division:
            # `prefix_products = [1, p1, p1*p2, p1*p2*p3, ...]`
            # If we want the product of the last `k` non-zero numbers, say `p_i, p_{i+1}, ..., p_{i+k-1}`,
            # where `p_j` is the j-th non-zero number added.
            # The total product of non-zeros is `prefix_products[-1]`.
            # The product of non-zeros up to `p_{i-1}` is `prefix_products[index_of_p_{i-1}]`.
            # The index `len(self.prefix_products) - 1` corresponds to the index of the last non-zero number added.
            # The index for `k` elements back is `len(self.prefix_products) - 1 - k`.
            # This `prefix_products[len(self.prefix_products) - 1 - k]` is the product of all non-zeros *up to and including* the element *before* the last `k` non-zero elements.
            # So, `product = prefix_products[-1] // prefix_products[len(self.prefix_products) - 1 - k]` is indeed the product of the last `k` non-zero elements.

            # Let's re-trace example `[3,0,2,5,4]` with `getProduct(2)`.
            # `prefix_products = [1, 2, 10, 40]`. `stream_len=5`. `last_zero_idx=1`.
            # `k=2`. `last_zero_idx < stream_len - k` (1 < 3).
            # We need product of last 2 non-zeros. The non-zeros are 2, 5, 4. The last two are 5, 4. Product is 20.
            # `prefix_products = [1, 2, 10, 40]`. Length is 4.
            # The index `len(self.prefix_products) - 1 - k` is `4 - 1 - 2 = 1`.
            # `prefix_products[1]` is `2`.
            # Result: `prefix_products[-1] // prefix_products[1]` = `40 // 2` = `20`. This matches the example's logic.
            # The previous calculation mistake was `prefix_products[index_of_p_{i-1}]`.
            # `prefix_products[idx]` means product of `idx` non-zero numbers.
            # So if `len(prefix_products)` is `L`, then `prefix_products[L-1]` is product of `L-1` non-zero numbers.
            # We need product of last `k` non-zero numbers.
            # This is `(prod of first L-1 non-zeros) / (prod of first L-1-k non-zeros)`
            # Which is `prefix_products[L-1] / prefix_products[L-1-k]`.
            # Here `L` is `len(self.prefix_products)`.
            # So, `self.prefix_products[-1] // self.prefix_products[len(self.prefix_products) - 1 - k]` is correct.

            # The index `len(self.prefix_products) - 1 - k` points to the product *before* the block of `k` non-zero numbers.
            # For instance, if `prefix_products = [1, a, ab, abc, abcd]` and `k=2`, we need `bcd`.
            # This is `abcd / ab`. `abcd` is `prefix_products[-1]`. `ab` is `prefix_products[2]`.
            # `len(prefix_products)` is 5. `k` is 2.
            # Index we need is `len(prefix_products) - 1 - k` = `5 - 1 - 2` = `2`. Correct.

            return self.prefix_products[-1] // self.prefix_products[len(self.prefix_products) - 1 - k]

```