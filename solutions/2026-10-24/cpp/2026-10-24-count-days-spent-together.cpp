```cpp
/*
Problem: Count Days Spent Together
Link: https://leetcode.com/problems/count-days-spent-together/

Approach:
The problem asks us to find the number of overlapping days Alice and Bob spend in Rome.
We are given their arrival and departure dates in "MM-DD" format.
Since all dates are in the same non-leap year, we can convert each date into a day number from the beginning of the year.
To do this, we'll use an array representing the number of days in each month. For a given month and day, the day number can be calculated by summing the days of all preceding months and adding the day of the current month.

Once we have the arrival and departure dates for both Alice and Bob as day numbers, we need to find the intersection of their stays.
Let Alice's stay be [arriveAlice_day, leaveAlice_day] and Bob's stay be [arriveBob_day, leaveBob_day].
The days they spend together will be from max(arriveAlice_day, arriveBob_day) to min(leaveAlice_day, leaveBob_day).
Let the start of the overlap be start_overlap = max(arriveAlice_day, arriveBob_day) and the end of the overlap be end_overlap = min(leaveAlice_day, leaveBob_day).
If start_overlap <= end_overlap, then the number of days they spent together is end_overlap - start_overlap + 1. Otherwise, it's 0.

Helper function `dateToDayNumber(date_str)`:
1. Parses the month (MM) and day (DD) from the input string.
2. Uses a pre-defined array `daysInMonth` for a non-leap year.
3. Iterates through months from 1 up to (but not including) the current month, summing the days.
4. Adds the current day to get the total day number.

Main logic:
1. Convert `arriveAlice`, `leaveAlice`, `arriveBob`, `leaveBob` to their respective day numbers using `dateToDayNumber`.
2. Calculate `start_overlap = max(arriveAlice_day, arriveBob_day)`.
3. Calculate `end_overlap = min(leaveAlice_day, leaveBob_day)`.
4. If `start_overlap <= end_overlap`, return `end_overlap - start_overlap + 1`.
5. Otherwise, return 0.

Time Complexity:
The `dateToDayNumber` function iterates through at most 12 months. String parsing takes constant time as the format is fixed. Therefore, converting all four dates takes O(1) time.
The calculations for overlap start and end, and the final subtraction, also take O(1) time.
Overall time complexity: O(1).

Space Complexity:
We use a constant-size array `daysInMonth`. The space used for storing parsed month and day integers is also constant.
Overall space complexity: O(1).
*/

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Solution {
private:
    // Array storing the number of days in each month for a non-leap year.
    // Index 0 is unused, months are 1-indexed.
    const int daysInMonth[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

    // Helper function to convert a date string "MM-DD" to its day number from the start of the year.
    int dateToDayNumber(const std::string& date_str) {
        // Extract month and day from the string.
        int month = std::stoi(date_str.substr(0, 2));
        int day = std::stoi(date_str.substr(3, 2));

        int dayNumber = 0;
        // Sum the days of all preceding months.
        for (int i = 1; i < month; ++i) {
            dayNumber += daysInMonth[i];
        }
        // Add the day of the current month.
        dayNumber += day;

        return dayNumber;
    }

public:
    int countDaysTogether(std::string arriveAlice, std::string leaveAlice, std::string arriveBob, std::string leaveBob) {
        // Convert all arrival and departure dates to their day numbers from the start of the year.
        int arriveAlice_day = dateToDayNumber(arriveAlice);
        int leaveAlice_day = dateToDayNumber(leaveAlice);
        int arriveBob_day = dateToDayNumber(arriveBob);
        int leaveBob_day = dateToDayNumber(leaveBob);

        // Determine the start of the overlapping period.
        // This is the later of the two arrival dates.
        int start_overlap = std::max(arriveAlice_day, arriveBob_day);

        // Determine the end of the overlapping period.
        // This is the earlier of the two departure dates.
        int end_overlap = std::min(leaveAlice_day, leaveBob_day);

        // If the start of the overlap is less than or equal to the end of the overlap,
        // it means there is at least one common day.
        if (start_overlap <= end_overlap) {
            // The number of days together is the total days in the overlapping range, inclusive.
            return end_overlap - start_overlap + 1;
        } else {
            // If start_overlap > end_overlap, there is no overlap.
            return 0;
        }
    }
};

// Example Usage (for testing purposes, not part of the LeetCode submission requirement)
int main() {
    Solution sol;

    // Example 1
    std::string arriveAlice1 = "08-15";
    std::string leaveAlice1 = "08-18";
    std::string arriveBob1 = "08-16";
    std::string leaveBob1 = "08-19";
    std::cout << "Example 1 Output: " << sol.countDaysTogether(arriveAlice1, leaveAlice1, arriveBob1, leaveBob1) << std::endl; // Expected: 3

    // Example 2
    std::string arriveAlice2 = "10-01";
    std::string leaveAlice2 = "10-31";
    std::string arriveBob2 = "11-01";
    std::string leaveBob2 = "12-31";
    std::cout << "Example 2 Output: " << sol.countDaysTogether(arriveAlice2, leaveAlice2, arriveBob2, leaveBob2) << std::endl; // Expected: 0

    // Additional Test Case
    std::string arriveAlice3 = "01-01";
    std::string leaveAlice3 = "01-31";
    std::string arriveBob3 = "01-01";
    std::string leaveBob3 = "01-31";
    std::cout << "Additional Test 1 Output: " << sol.countDaysTogether(arriveAlice3, leaveAlice3, arriveBob3, leaveBob3) << std::endl; // Expected: 31

    std::string arriveAlice4 = "02-01";
    std::string leaveAlice4 = "02-28";
    std::string arriveBob4 = "03-01";
    std::string leaveBob4 = "03-31";
    std::cout << "Additional Test 2 Output: " << sol.countDaysTogether(arriveAlice4, leaveAlice4, arriveBob4, leaveBob4) << std::endl; // Expected: 0

    std::string arriveAlice5 = "03-01";
    std::string leaveAlice5 = "03-10";
    std::string arriveBob5 = "03-05";
    std::string leaveBob5 = "03-15";
    std::cout << "Additional Test 3 Output: " << sol.countDaysTogether(arriveAlice5, leaveAlice5, arriveBob5, leaveBob5) << std::endl; // Expected: 6 (Mar 5 to Mar 10)

    return 0;
}
```