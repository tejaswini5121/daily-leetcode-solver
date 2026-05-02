// Summary: Counts good numbers up to n, where good numbers change value after rotating each digit 180 degrees.
// Link: https://leetcode.com/problems/rotated-digits/
// Approach:
// We can iterate through each number from 1 to n and check if it's a "good" number.
// A number is "good" if, after rotating each digit individually, the new number is valid and different from the original number.
// The valid rotations are:
// 0 -> 0
// 1 -> 1
// 8 -> 8
// 2 -> 5
// 5 -> 2
// 6 -> 9
// 9 -> 6
// Any other digit (3, 4, 7) makes the rotated number invalid.
// A number is "good" if it contains at least one digit that rotates to a different digit (2, 5, 6, 9) AND does not contain any invalid digits (3, 4, 7).
// We can use a helper function to perform the rotation and validation.
// Time Complexity: O(n * log10(n)). We iterate up to n, and for each number, we process its digits (log10(n) digits).
// Space Complexity: O(1), as we only use a few variables for calculations.

/**
 * @param {number} n
 * @return {number}
 */
var rotatedDigits = function(n) {
    // Helper function to check if a number is "good".
    // A number is good if it can be rotated to a different, valid number.
    const isGood = (num) => {
        let rotatedNumStr = ""; // String to build the rotated number
        let hasChangedDigit = false; // Flag to check if any digit rotated to a different one

        // Convert the number to a string to iterate through its digits.
        const numStr = String(num);

        for (let i = 0; i < numStr.length; i++) {
            const digit = numStr[i];
            let rotatedDigit = "";

            // Determine the rotated digit based on the rules.
            if (digit === '0' || digit === '1' || digit === '8') {
                rotatedDigit = digit; // These digits rotate to themselves.
            } else if (digit === '2') {
                rotatedDigit = '5';
                hasChangedDigit = true; // Digit 2 rotates to 5, so the number will change.
            } else if (digit === '5') {
                rotatedDigit = '2';
                hasChangedDigit = true; // Digit 5 rotates to 2, so the number will change.
            } else if (digit === '6') {
                rotatedDigit = '9';
                hasChangedDigit = true; // Digit 6 rotates to 9, so the number will change.
            } else if (digit === '9') {
                rotatedDigit = '6';
                hasChangedDigit = true; // Digit 9 rotates to 6, so the number will change.
            } else {
                // Digits 3, 4, 7 are invalid after rotation.
                return false; // The rotated number would be invalid.
            }
            rotatedNumStr += rotatedDigit;
        }

        // A number is "good" if it doesn't contain invalid digits (handled above)
        // AND at least one digit has changed its value during rotation.
        return hasChangedDigit;
    };

    let count = 0; // Initialize the count of good numbers.

    // Iterate through all numbers from 1 to n.
    for (let i = 1; i <= n; i++) {
        // If the current number is a good number, increment the count.
        if (isGood(i)) {
            count++;
        }
    }

    return count; // Return the total count of good numbers.
};
