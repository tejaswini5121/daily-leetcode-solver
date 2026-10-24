```python
# Problem: Count Days Spent Together
# Link: https://leetcode.com/problems/count-days-spent-together/
# Approach:
# 1. Convert all dates (arrival and departure for both Alice and Bob) into a numerical representation.
#    A good way to do this is to calculate the total number of days from the beginning of the year
#    up to the given date. This can be done by summing the days in preceding months and adding the day of the month.
# 2. Determine the overlapping period. The period they spend together starts on the later of their arrival dates
#    and ends on the earlier of their departure dates.
# 3. Calculate the number of days in this overlapping period. If the start of the overlapping period is
#    after the end of the overlapping period, then they don't spend any days together, and the result is 0.
#    Otherwise, the number of days is `end_overlap - start_overlap + 1`.
#
# Time complexity: O(1) - The operations involve a fixed number of date conversions and comparisons.
# Space complexity: O(1) - The space used is constant, regardless of the input date values.

class Solution:
    def countDaysTogether(self, arriveAlice: str, leaveAlice: str, arriveBob: str, leaveBob: str) -> int:
        # Days in each month for a non-leap year
        days_in_month = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        # Prefix sums of days in month to quickly calculate day of year
        prefix_days = [0] * 13
        for i in range(1, 13):
            prefix_days[i] = prefix_days[i-1] + days_in_month[i]

        # Helper function to convert "MM-DD" string to day of the year
        def date_to_day_of_year(date_str: str) -> int:
            month = int(date_str[:2])
            day = int(date_str[3:])
            # Day of year = sum of days in preceding months + day of current month
            return prefix_days[month - 1] + day

        # Convert all arrival and departure dates to day of the year
        alice_arrive_day = date_to_day_of_year(arriveAlice)
        alice_leave_day = date_to_day_of_year(leaveAlice)
        bob_arrive_day = date_to_day_of_year(arriveBob)
        bob_leave_day = date_to_day_of_year(leaveBob)

        # Determine the start and end of the overlapping period
        # The overlap starts on the later of the two arrival dates
        overlap_start = max(alice_arrive_day, bob_arrive_day)
        # The overlap ends on the earlier of the two departure dates
        overlap_end = min(alice_leave_day, bob_leave_day)

        # Calculate the number of days they spent together
        # If the overlap_start is after overlap_end, there's no overlap.
        # Otherwise, the number of days is overlap_end - overlap_start + 1.
        if overlap_start > overlap_end:
            return 0
        else:
            return overlap_end - overlap_start + 1

```