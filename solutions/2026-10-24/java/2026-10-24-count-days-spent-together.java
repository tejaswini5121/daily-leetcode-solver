```java
import java.lang.Math;

class Solution {
    /**
     * Problem: Count Days Spent Together
     * Link: https://leetcode.com/problems/count-days-spent-together/
     *
     * Approach:
     * To count the number of days Alice and Bob spend together, we need to find the overlap between their stay periods.
     * The overlap starts on the later of their arrival dates and ends on the earlier of their departure dates.
     * If the start of the overlap is after the end of the overlap, there is no common day, and the result is 0.
     * Otherwise, the number of common days is the difference between the end and start dates plus one (inclusive).
     * To facilitate date comparisons and calculations, we will convert each date into a numerical representation, specifically the number of days from the beginning of the year.
     * We'll use a helper function to convert a "MM-DD" string into the total number of days from the start of the year.
     * The number of days in each month for a non-leap year is pre-defined.
     *
     * Time Complexity: O(1) - The calculations involve a fixed number of operations regardless of the input dates.
     * Space Complexity: O(1) - We use a constant amount of extra space for storing the days in months and a few variables.
     */
    public int countDaysTogether(String arriveAlice, String leaveAlice, String arriveBob, String leaveBob) {
        // Pre-defined number of days in each month for a non-leap year.
        // Index 0 is unused, months are 1-indexed.
        int[] daysInMonth = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

        // Convert the arrival and departure dates for Alice and Bob into the number of days from the start of the year.
        int arriveAliceDay = dateToDays(arriveAlice, daysInMonth);
        int leaveAliceDay = dateToDays(leaveAlice, daysInMonth);
        int arriveBobDay = dateToDays(arriveBob, daysInMonth);
        int leaveBobDay = dateToDays(leaveBob, daysInMonth);

        // Determine the start of the overlap period. This is the later of the two arrival dates.
        int overlapStart = Math.max(arriveAliceDay, arriveBobDay);
        // Determine the end of the overlap period. This is the earlier of the two departure dates.
        int overlapEnd = Math.min(leaveAliceDay, leaveBobDay);

        // If the start of the overlap is after the end of the overlap, there are no common days.
        // Otherwise, the number of common days is the difference between the end and start dates, plus one (to include both start and end days).
        if (overlapStart > overlapEnd) {
            return 0;
        } else {
            return overlapEnd - overlapStart + 1;
        }
    }

    /**
     * Helper function to convert a date string "MM-DD" into the total number of days from the start of the year.
     *
     * @param date The date string in "MM-DD" format.
     * @param daysInMonth An array containing the number of days in each month for a non-leap year.
     * @return The total number of days from the start of the year to the given date.
     */
    private int dateToDays(String date, int[] daysInMonth) {
        // Extract month and day from the date string.
        int month = Integer.parseInt(date.substring(0, 2));
        int day = Integer.parseInt(date.substring(3, 5));

        // Calculate the total days.
        int totalDays = 0;
        // Sum the days of all preceding months.
        for (int i = 1; i < month; i++) {
            totalDays += daysInMonth[i];
        }
        // Add the days of the current month.
        totalDays += day;

        return totalDays;
    }
}
```