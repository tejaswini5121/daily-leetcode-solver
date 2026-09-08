// Problem: Count Commas in Range
// Summary: Counts the total number of commas used when writing integers from 1 to n in standard format.
// Link: https://leetcode.com/problems/count-commas-in-range/
//
// Approach:
// We iterate through each number from 1 to n. For each number, we determine how many commas it would contain.
// A number contains a comma if it has 4 or more digits. The number of commas is related to the number of digits.
// Specifically, a number with 'd' digits will have floor((d - 1) / 3) commas.
// We can calculate the number of digits by repeatedly dividing the number by 10 or by converting it to a string and getting its length.
// For optimization, instead of checking each number individually, we can observe a pattern.
// Numbers from 1 to 999 have 0 commas.
// Numbers from 1000 to 9999 have 1 comma. There are 9000 such numbers.
// Numbers from 10000 to 99999 have 1 or 2 commas.
// Numbers from 100000 to 999999 have 2 commas.
//
// A more efficient approach is to consider the ranges where commas start appearing.
// Numbers 1-999: 0 commas
// Numbers 1000-9999: 1 comma each. The count of such numbers up to n is max(0, n - 999). Each of these contributes 1 comma.
// Numbers 10000-99999: 1 or 2 commas.
//   Numbers 10000-99999 have 1 comma. The count of such numbers is max(0, n - 9999).
//   Numbers 100000-999999 have 2 commas.
//
// Let's break it down by powers of 10:
// For numbers < 1000, there are 0 commas.
// For numbers from 1000 to 9999:
//   All numbers in this range (1000 to min(n, 9999)) contribute 1 comma.
//   The count is max(0, min(n, 9999) - 999).
// For numbers from 10000 to 99999:
//   Numbers like 10000 to 99999 have 1 comma. This happens when digits are like X,XXX.
//   Numbers like 10000 to 99999 that *also* have a second comma are like XX,XXX.
//   This is becoming complicated.
//
// A simpler approach is to calculate how many numbers have at least one comma, how many have at least two, and so on.
// Number of integers with at least 1 comma (i.e., >= 1000): max(0, n - 999)
// Number of integers with at least 2 commas (i.e., >= 100000): max(0, n - 99999)
// Number of integers with at least 3 commas (i.e., >= 1000000): max(0, n - 999999)
// And so on...
//
// Let's trace the number of commas for ranges:
// 1 to 999: 0 commas. Total = 0
// 1000 to 9999: Each has 1 comma. Count = n - 999 (if n >= 1000). Total = max(0, n - 999) * 1
// 10000 to 99999:
//    These numbers look like "XX,XXX". They have 1 comma.
//    However, some of these numbers have *two* commas. This occurs from 100,000 onwards.
//    So, numbers from 10000 to 99999 have exactly 1 comma if they are less than 100000.
//    The numbers that introduce a *second* comma are from 100,000 onwards.
//
// Let's consider the contribution of each comma position:
// Comma after the 3rd digit (thousands place): appears in numbers >= 1000. Count = max(0, n - 999)
// Comma after the 6th digit (millions place): appears in numbers >= 1000000. Count = max(0, n - 999999)
// Comma after the 9th digit (billions place): appears in numbers >= 1000000000. Count = max(0, n - 999999999)
//
// This is for standard formatting.
// For a number like 1002, it's "1,002" - 1 comma.
// For a number like 10000, it's "10,000" - 1 comma.
// For a number like 100000, it's "100,000" - 1 comma.
// For a number like 1000000, it's "1,000,000" - 2 commas.
//
// The number of commas in an integer `x` is `floor((number_of_digits(x) - 1) / 3)`.
//
// Let's iterate and count for `n` up to 10^5.
//
// n = 1002:
// Numbers from 1 to 999: 0 commas.
// Numbers from 1000 to 1002:
//   1000: 4 digits. floor((4-1)/3) = 1 comma.
//   1001: 4 digits. floor((4-1)/3) = 1 comma.
//   1002: 4 digits. floor((4-1)/3) = 1 comma.
// Total = 1 + 1 + 1 = 3.
//
// n = 998:
// All numbers have < 4 digits. 0 commas. Total = 0.
//
// Let's re-think the problem and the standard number formatting.
// "A comma is inserted after every three digits from the right."
//
// Number of digits in `x`: `len(str(x))`
// Number of commas in `x`: `floor((len(str(x)) - 1) / 3)` if `len(str(x)) >= 4`, otherwise 0.
//
// Example: n = 1002
// 1-999: 0 commas.
// 1000: 4 digits. floor((4-1)/3) = 1.
// 1001: 4 digits. floor((4-1)/3) = 1.
// 1002: 4 digits. floor((4-1)/3) = 1.
// Total = 3.
//
// This direct simulation approach seems feasible given the constraint n <= 10^5.
// For n = 10^5, we loop 100,000 times. Inside the loop, we convert to string and get length, which is efficient.
//
// Let's verify the number of digits calculation.
// num = 1 -> 1 digit -> floor((1-1)/3) = 0
// num = 9 -> 1 digit -> floor((1-1)/3) = 0
// num = 10 -> 2 digits -> floor((2-1)/3) = 0
// num = 99 -> 2 digits -> floor((2-1)/3) = 0
// num = 100 -> 3 digits -> floor((3-1)/3) = 0
// num = 999 -> 3 digits -> floor((3-1)/3) = 0
// num = 1000 -> 4 digits -> floor((4-1)/3) = 1. Correct.
// num = 9999 -> 4 digits -> floor((4-1)/3) = 1. Correct.
// num = 10000 -> 5 digits -> floor((5-1)/3) = floor(4/3) = 1. Correct.
// num = 99999 -> 5 digits -> floor((5-1)/3) = floor(4/3) = 1. Correct.
// num = 100000 -> 6 digits -> floor((6-1)/3) = floor(5/3) = 1. Correct.
// num = 999999 -> 6 digits -> floor((6-1)/3) = floor(5/3) = 1. This is wrong.
// 999,999 should have two commas: "999,999".
//
// The formula `floor((d - 1) / 3)` is for how many full groups of three digits *after the first digit* are there.
//
// Let's use the string length and check:
// If `s.length <= 3`, 0 commas.
// If `s.length == 4`, 1 comma. "1,000"
// If `s.length == 5`, 1 comma. "10,000"
// If `s.length == 6`, 1 comma. "100,000"
// If `s.length == 7`, 2 commas. "1,000,000"
//
// The number of commas is `ceil(s.length / 3) - 1`? No.
//
// Let's re-read: "A comma is inserted after every three digits from the right."
// This means for a number `abcdefghi`:
// `abc,def,ghi`
//
// Number of digits `d`.
// If `d = 1, 2, 3`: 0 commas.
// If `d = 4, 5, 6`: 1 comma. (e.g., `a,bcd`, `ab,cde`, `abc,def`)
// If `d = 7, 8, 9`: 2 commas. (e.g., `a,bcd,efg`, `ab,cde,fgh`, `abc,def,ghi`)
//
// Number of commas = `floor((d - 1) / 3)` is still what I get when I test this:
// d=1: floor(0/3)=0
// d=2: floor(1/3)=0
// d=3: floor(2/3)=0
// d=4: floor(3/3)=1
// d=5: floor(4/3)=1
// d=6: floor(5/3)=1
// d=7: floor(6/3)=2
// d=8: floor(7/3)=2
// d=9: floor(8/3)=2
//
// This formula seems correct. Why was I doubting it for 999,999?
// 999,999 has 6 digits. `floor((6-1)/3) = floor(5/3) = 1`.
// But standard formatting is "999,999". This has *one* comma. My previous reasoning was wrong.
//
// Example:
// 1,000 -> 4 digits, 1 comma
// 10,000 -> 5 digits, 1 comma
// 100,000 -> 6 digits, 1 comma
// 1,000,000 -> 7 digits, 2 commas
//
// So the logic `floor((number_of_digits - 1) / 3)` appears to be correct for calculating commas.
//
// The problem statement constraints are `1 <= n <= 10^5`.
// For `n = 10^5`:
// Numbers < 1000: 0 commas.
// Numbers 1000 to 9999: 1 comma each. Count = `max(0, min(n, 9999) - 999)`
// Numbers 10000 to 99999: 1 comma each. Count = `max(0, min(n, 99999) - 9999)`
// Numbers 100000: 1 comma. Count = `max(0, min(n, 999999) - 99999)`
//
// Let's use the direct iteration method. It's simple and efficient enough for n <= 10^5.
//
// Time Complexity: O(N * log10(N)) where N is n. This is because for each number from 1 to n, we are converting it to a string (or calculating its length), which takes logarithmic time with respect to the number's value. Since N <= 10^5, log10(10^5) = 5. This is very close to O(N).
// Space Complexity: O(log10(N)) or O(1) if we consider the space for storing the number string to be constant for practical purposes within the given constraints.

var countCommas = function(n) {
    let totalCommas = 0; // Initialize the total count of commas

    // Iterate through each number from 1 up to n (inclusive)
    for (let i = 1; i <= n; i++) {
        // Convert the current number to a string to easily determine its length
        const numStr = i.toString();
        const numDigits = numStr.length;

        // If the number has 4 or more digits, it will contain commas.
        // The number of commas in a number with 'd' digits is floor((d - 1) / 3).
        // This formula correctly counts commas based on standard formatting:
        // e.g., 1000 (4 digits) -> floor((4-1)/3) = 1 comma
        // e.g., 10000 (5 digits) -> floor((5-1)/3) = 1 comma
        // e.g., 100000 (6 digits) -> floor((6-1)/3) = 1 comma
        // e.g., 1000000 (7 digits) -> floor((7-1)/3) = 2 commas
        if (numDigits >= 4) {
            // Calculate the number of commas for the current number
            const commasForNum = Math.floor((numDigits - 1) / 3);
            // Add the calculated commas to the total count
            totalCommas += commasForNum;
        }
    }

    // Return the final total count of commas
    return totalCommas;
};
```