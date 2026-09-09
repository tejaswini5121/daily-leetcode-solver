```python
# Problem: Count Commas in Range II
# Link: https://leetcode.com/problems/count-commas-in-range-ii/
#
# Approach:
# The problem asks us to count the total number of commas used when writing all integers from 1 to n.
# A comma is inserted after every three digits from the right. Numbers with fewer than 4 digits have no commas.
#
# The core idea is to realize that the number of commas for a number `x` depends on its number of digits.
# A number `x` will have `k` commas if `x` is greater than or equal to 1000, 1,000,000, 1,000,000,000, and so on.
# Specifically, a number `x` has:
# - 0 commas if 1 <= x <= 999
# - 1 comma if 1000 <= x <= 999,999
# - 2 commas if 1,000,000 <= x <= 999,999,999
# - 3 commas if 1,000,000,000 <= x <= 999,999,999,999
# - 4 commas if 1,000,000,000,000 <= x <= 999,999,999,999,999 (which is the maximum possible value for n)
#
# We can count the total number of commas by summing up the commas contributed by each "block" of numbers.
# For example, consider n = 1002.
# - Numbers from 1 to 999: 0 commas each. Total = 0.
# - Numbers from 1000 to 1002: each has 1 comma. Total = 3 * 1 = 3.
#
# Let's generalize. We can iterate through powers of 1000 (10^3, 10^6, 10^9, 10^12, ...).
# For a given power of 1000, say `p`, and the next power of 1000, `p_next`:
# - Numbers from `p` to `min(n, p_next - 1)` contribute one more comma than the numbers less than `p`.
#
# Let's define `count_commas(x)` as the total number of commas for numbers from 1 to `x`.
# We want to calculate `count_commas(n)`.
#
# `count_commas(x)`:
# - If `x < 1000`: return 0
# - If `1000 <= x < 10^6`: The numbers from 1000 to `x` each have 1 comma. The count is `x - 1000 + 1 = x - 999`.
# - If `10^6 <= x < 10^9`:
#   - Numbers from 1000 to 999,999: there are 999,000 such numbers, each with 1 comma. Total = 999,000.
#   - Numbers from 1,000,000 to `x`: each has 2 commas. This is where it gets tricky if we simply iterate.
#
# A better approach is to directly calculate the contribution of each magnitude.
#
# Let's define a function `calculate_commas_up_to(limit)` which calculates the total commas for numbers from 1 up to `limit`.
#
# For a `limit`:
#
# 1. Numbers from 1 to 999 contribute 0 commas.
# 2. Numbers from 1000 to 999,999:
#    - There are `999,999 - 1000 + 1 = 999,000` numbers in this range.
#    - Each of these numbers has exactly one comma.
#    - Contribution from this range: `min(limit, 999999) - 1000 + 1` (if `limit >= 1000`)
#    - Number of numbers with at least one comma: `max(0, limit - 999)`
#    - Total commas from this "thousands" group: `max(0, limit - 999)`
#
# 3. Numbers from 1,000,000 to 999,999,999:
#    - These numbers have at least two commas.
#    - The range is from `10^6` to `10^9 - 1`.
#    - Numbers with at least two commas are those >= `10^6`.
#    - Number of numbers with at least two commas: `max(0, limit - 999999)`. Each of these contributes an *additional* comma compared to the previous block.
#    - So, `max(0, limit - 999999)` additional commas.
#
# 4. Numbers from 1,000,000,000 to 999,999,999,999:
#    - These numbers have at least three commas.
#    - Numbers with at least three commas are those >= `10^9`.
#    - Number of numbers with at least three commas: `max(0, limit - 999999999)`. Each of these contributes yet *another* additional comma.
#    - So, `max(0, limit - 999999999)` additional commas.
#
# 5. Numbers from 1,000,000,000,000 to 999,999,999,999,999:
#    - These numbers have at least four commas.
#    - Numbers with at least four commas are those >= `10^12`.
#    - Number of numbers with at least four commas: `max(0, limit - 999999999999)`. Each of these contributes a fourth additional comma.
#    - So, `max(0, limit - 999999999999)` additional commas.
#
# The total number of commas for numbers from 1 to `limit` is the sum of these contributions:
#
# `total_commas = max(0, limit - 999) + max(0, limit - 999999) + max(0, limit - 999999999) + max(0, limit - 999999999999)`
#
# This formula calculates the total number of commas. For example, if `limit = 1002`:
# - `max(0, 1002 - 999) = max(0, 3) = 3`
# - `max(0, 1002 - 999999) = max(0, -998997) = 0`
# - `max(0, 1002 - 999999999) = max(0, ... ) = 0`
# - `max(0, 1002 - 999999999999) = max(0, ... ) = 0`
# Total = 3. Correct for Example 1.
#
# If `limit = 998`:
# - `max(0, 998 - 999) = max(0, -1) = 0`
# - `max(0, 998 - 999999) = 0`
# - `max(0, 998 - 999999999) = 0`
# - `max(0, 998 - 999999999999) = 0`
# Total = 0. Correct for Example 2.
#
# If `limit = 1000000`:
# - `max(0, 1000000 - 999) = 999001` (numbers 1000 to 1000000 have 1 comma each)
# - `max(0, 1000000 - 999999) = 1` (number 1000000 has an additional comma)
# - `max(0, 1000000 - 999999999) = 0`
# - `max(0, 1000000 - 999999999999) = 0`
# Total = 999001 + 1 = 999002.
# Let's verify:
# Numbers 1 to 999: 0 commas.
# Numbers 1000 to 999999: 999000 numbers, 1 comma each. Total = 999000.
# Number 1000000: 2 commas.
# Total for 1 to 1000000: 999000 (from 1000-999999) + 1 (from 1000000) from the first comma position + 1 (from 1000000) from the second comma position.
# This is becoming confusing. Let's re-evaluate the formula.
#
# The formula `max(0, limit - threshold) + ...` counts how many numbers are *greater than or equal to* the `threshold`.
#
# Let's think about the *number of commas inserted* at each "level" of thousands.
#
# Level 1 (thousands separator): applies to numbers >= 1000.
#   Number of integers in [1, n] that are >= 1000 is `max(0, n - 999)`.
#   These numbers contribute one comma *each* for this first separator.
#
# Level 2 (millions separator): applies to numbers >= 1,000,000.
#   Number of integers in [1, n] that are >= 1,000,000 is `max(0, n - 999999)`.
#   These numbers contribute a *second* comma *each*.
#
# Level 3 (billions separator): applies to numbers >= 1,000,000,000.
#   Number of integers in [1, n] that are >= 1,000,000,000 is `max(0, n - 999999999)`.
#   These numbers contribute a *third* comma *each*.
#
# Level 4 (trillions separator): applies to numbers >= 1,000,000,000,000.
#   Number of integers in [1, n] that are >= 1,000,000,000,000 is `max(0, n - 999999999999)`.
#   These numbers contribute a *fourth* comma *each*.
#
# Total commas = (commas from level 1) + (commas from level 2) + (commas from level 3) + (commas from level 4)
#
# Total commas = `max(0, n - 999)` + `max(0, n - 999999)` + `max(0, n - 999999999)` + `max(0, n - 999999999999)`
#
# This formula looks correct.
#
# For n = 10^15 (maximum constraint)
#
# `n - 999` is approximately 10^15
# `n - 999999` is approximately 10^15
# `n - 999999999` is approximately 10^15
# `n - 999999999999` is approximately 10^15
#
# Total commas will be roughly 4 * 10^15, which fits in a 64-bit integer (long long in C++, standard int in Python handles arbitrary precision).
#
# Time Complexity:
# The solution involves a constant number of arithmetic operations and `max` calls.
# The number of operations does not depend on the input `n` (it's fixed to 4 levels of commas).
# Therefore, the time complexity is O(1).
#
# Space Complexity:
# The solution uses a few variables to store intermediate results.
# The space used is constant and does not depend on the input `n`.
# Therefore, the space complexity is O(1).

class Solution:
    def countCommas(self, n: int) -> int:
        """
        Calculates the total number of commas used when writing all integers from 1 to n.
        """
        total_commas = 0

        # A comma is inserted after every three digits from the right.
        # Numbers with fewer than 4 digits contain no commas.

        # The first comma appears for numbers 1,000 and above.
        # Numbers >= 1000 have at least one comma.
        # The count of numbers in [1, n] that are >= 1000 is max(0, n - 999).
        # Each of these contributes one comma from the thousands separator.
        threshold1 = 1000
        # The number of integers from 1 to n that are >= threshold1
        count_ge_threshold1 = max(0, n - (threshold1 - 1))
        total_commas += count_ge_threshold1

        # The second comma appears for numbers 1,000,000 and above.
        # Numbers >= 1,000,000 have at least two commas.
        # The count of numbers in [1, n] that are >= 1,000,000 is max(0, n - 999999).
        # Each of these contributes a second comma from the millions separator.
        threshold2 = 1000000
        count_ge_threshold2 = max(0, n - (threshold2 - 1))
        total_commas += count_ge_threshold2

        # The third comma appears for numbers 1,000,000,000 and above.
        # Numbers >= 1,000,000,000 have at least three commas.
        # The count of numbers in [1, n] that are >= 1,000,000,000 is max(0, n - 999999999).
        # Each of these contributes a third comma from the billions separator.
        threshold3 = 1000000000
        count_ge_threshold3 = max(0, n - (threshold3 - 1))
        total_commas += count_ge_threshold3

        # The fourth comma appears for numbers 1,000,000,000,000 and above.
        # Numbers >= 1,000,000,000,000 have at least four commas.
        # The count of numbers in [1, n] that are >= 1,000,000,000,000 is max(0, n - 999999999999).
        # Each of these contributes a fourth comma from the trillions separator.
        threshold4 = 1000000000000
        count_ge_threshold4 = max(0, n - (threshold4 - 1))
        total_commas += count_ge_threshold4

        # Note: The constraint n <= 10^15 means we only need to consider up to 4 commas.
        # 10^12 is the smallest number with 4 commas (1,000,000,000,000).
        # 10^15 is the maximum input value.

        return total_commas

```