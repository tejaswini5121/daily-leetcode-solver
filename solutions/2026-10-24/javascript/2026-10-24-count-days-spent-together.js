/**
 * @summary Counts the number of days Alice and Bob are together in Rome.
 * @link https://leetcode.com/problems/count-days-spent-together/
 * @approach
 * The problem asks to find the overlap in the periods Alice and Bob are in Rome.
 * We can convert each date into a day number of the year (1-indexed).
 * The number of days in each month of a non-leap year is provided: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31].
 * We can create a helper function `dateToDayNumber` that takes a date string "MM-DD" and returns the day number of the year.
 * This function will first parse the month and day, then sum up the days of the preceding months and add the current day.
 *
 * Once we have the start and end day numbers for both Alice and Bob, we can determine the overlapping period.
 * Let Alice's period be [arriveAliceDay, leaveAliceDay] and Bob's be [arriveBobDay, leaveBobDay].
 * The start of the overlapping period is the maximum of their arrival days: `max(arriveAliceDay, arriveBobDay)`.
 * The end of the overlapping period is the minimum of their leaving days: `min(leaveAliceDay, leaveBobDay)`.
 *
 * If the start of the overlap is greater than the end of the overlap, it means there is no common period, and the result is 0.
 * Otherwise, the number of days they spend together is `endOverlapDay - startOverlapDay + 1`.
 *
 * Time Complexity: O(1) - The number of months is fixed (12), so converting dates to day numbers and finding the overlap takes constant time.
 * Space Complexity: O(1) - We use a fixed-size array for days in months and a few variables, resulting in constant space usage.
 */

// Helper function to convert a date string "MM-DD" to its day number in a non-leap year.
const dateToDayNumber = (dateStr) => {
    const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 0-indexed for easier prefix sum calculation
    let cumulativeDays = 0;

    const month = parseInt(dateStr.substring(0, 2), 10);
    const day = parseInt(dateStr.substring(3, 5), 10);

    // Sum up days from previous months
    for (let i = 1; i < month; i++) {
        cumulativeDays += daysInMonth[i];
    }

    // Add the current day
    cumulativeDays += day;

    return cumulativeDays;
};

/**
 * @param {string} arriveAlice
 * @param {string} leaveAlice
 * @param {string} arriveBob
 * @param {string} leaveBob
 * @return {number}
 */
const countDaysTogether = (arriveAlice, leaveAlice, arriveBob, leaveBob) => {
    // Convert all arrival and leave dates to their respective day numbers of the year.
    const arriveAliceDay = dateToDayNumber(arriveAlice);
    const leaveAliceDay = dateToDayNumber(leaveAlice);
    const arriveBobDay = dateToDayNumber(arriveBob);
    const leaveBobDay = dateToDayNumber(leaveBob);

    // Determine the start of the overlapping period.
    // This is the later of the two arrival dates.
    const startOverlap = Math.max(arriveAliceDay, arriveBobDay);

    // Determine the end of the overlapping period.
    // This is the earlier of the two leaving dates.
    const endOverlap = Math.min(leaveAliceDay, leaveBobDay);

    // If the start of the overlap is after the end of the overlap,
    // it means there is no common period.
    if (startOverlap > endOverlap) {
        return 0;
    }

    // The number of days spent together is the difference between the end and start dates, plus 1 (inclusive).
    return endOverlap - startOverlap + 1;
};
