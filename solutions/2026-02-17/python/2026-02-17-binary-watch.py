```python
# Summary: Given an integer turnedOn representing the number of LEDs on a binary watch,
# find all possible valid times (hours and minutes) that can be displayed.
# Link: https://leetcode.com/problems/binary-watch/
# Approach:
# This problem can be solved using a backtracking or brute-force approach with bit manipulation.
# We can iterate through all possible hours (0-11) and all possible minutes (0-59).
# For each hour and minute combination, we can count the number of set bits (LEDs turned on).
# If the total number of set bits (from hour and minute) equals turnedOn, we format the time and add it to the result list.
#
# To count set bits efficiently, we can use the `bin()` function in Python and count the '1's, or use bitwise operations.
# Alternatively, we can use a recursive helper function (backtracking) to explore combinations of turning on a certain number of LEDs for hours and minutes separately.
#
# For the brute-force approach (chosen here for simplicity and clarity given the constraints):
# 1. Iterate through hours from 0 to 11.
# 2. For each hour, count the number of set bits. Let this be `hour_bits`.
# 3. If `hour_bits` is greater than `turnedOn`, continue to the next hour (no need to check minutes).
# 4. Calculate the remaining LEDs to be turned on for minutes: `minute_bits_needed = turnedOn - hour_bits`.
# 5. Iterate through minutes from 0 to 59.
# 6. For each minute, count the number of set bits. Let this be `minute_bits`.
# 7. If `minute_bits` equals `minute_bits_needed`, format the hour and minute into a string "H:MM" and add it to the result list.
#
# Formatting the time:
# - Hour should not have a leading zero unless it's 0.
# - Minute must be two digits, with a leading zero if necessary.
#
# Time Complexity: O(12 * 60 * log(max_value)) where max_value is the maximum bit representation for hour (11) or minute (59).
# The bit counting takes logarithmic time relative to the number. Since the number of hours and minutes are constant (12 and 60), this is effectively O(1).
# Space Complexity: O(N) where N is the number of valid times returned. In the worst case, all combinations might be valid, but given the constraints, the number of results is manageable.
# The maximum number of set bits is 10. The hour has 4 bits and the minute has 6 bits.
# Max possible set bits for hour: 4 (for 7, 11).
# Max possible set bits for minute: 6 (for 63, but we only go up to 59). Max for 59 is 5 bits.
# Max total set bits from hour and minute is effectively limited by the input `turnedOn`.
class Solution:
    def readBinaryWatch(self, turnedOn: int) -> list[str]:
        # List to store the resulting times
        result = []

        # Iterate through all possible hours from 0 to 11
        for h in range(12):
            # Count the number of set bits (LEDs on) in the current hour
            # bin(h) returns a string like '0b101'. We slice from index 2 to remove '0b'.
            # Then, we count the occurrences of '1'.
            hour_bits = bin(h)[2:].count('1')

            # If the number of set bits in the hour already exceeds turnedOn,
            # then this hour cannot be part of a valid time. Skip to the next hour.
            if hour_bits > turnedOn:
                continue

            # Calculate how many LEDs need to be on for the minutes
            minute_bits_needed = turnedOn - hour_bits

            # Iterate through all possible minutes from 0 to 59
            for m in range(60):
                # Count the number of set bits (LEDs on) in the current minute
                minute_bits = bin(m)[2:].count('1')

                # If the number of set bits in the minute matches the required number,
                # then this hour and minute combination forms a valid time.
                if minute_bits == minute_bits_needed:
                    # Format the time string.
                    # Hour 'h' is formatted without a leading zero unless it's 0.
                    # Minute 'm' is formatted to always have two digits, with a leading zero if necessary (e.g., "01", "09").
                    result.append(f"{h}:{m:02d}")

        # Return the list of all valid times
        return result

```