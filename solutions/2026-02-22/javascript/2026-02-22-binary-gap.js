// Problem Summary: Find the longest distance between adjacent 1s in a positive integer's binary representation.
// Link: https://leetcode.com/problems/binary-gap/
// Approach:
// 1. Convert the integer to its binary string representation.
// 2. Initialize `maxGap` to 0 and `lastOneIndex` to -1 (to indicate no '1' has been found yet).
// 3. Iterate through the binary string.
// 4. If a '1' is encountered:
//    a. If `lastOneIndex` is not -1 (meaning we've found a previous '1'), calculate the current gap (`currentIndex - lastOneIndex`).
//    b. Update `maxGap` if the current gap is larger.
//    c. Update `lastOneIndex` to the `currentIndex`.
// 5. Return `maxGap`.
// Time Complexity: O(log n) - The conversion to binary string takes logarithmic time with respect to n, and iterating through the string also takes time proportional to the number of bits, which is log n.
// Space Complexity: O(log n) - The space used to store the binary string.

/**
 * @param {number} n
 * @return {number}
 */
var binaryGap = function(n) {
    // Convert the integer to its binary string representation.
    const binaryString = n.toString(2);
    
    // Initialize maxGap to 0. This will store the longest distance found.
    let maxGap = 0;
    
    // Initialize lastOneIndex to -1. This will store the index of the most recently encountered '1'.
    // A value of -1 indicates that no '1' has been seen yet.
    let lastOneIndex = -1;

    // Iterate through each character (bit) of the binary string.
    for (let i = 0; i < binaryString.length; i++) {
        // Check if the current character is '1'.
        if (binaryString[i] === '1') {
            // If a '1' is found and we've already seen a previous '1' (lastOneIndex is not -1).
            if (lastOneIndex !== -1) {
                // Calculate the distance between the current '1' and the last '1'.
                const currentGap = i - lastOneIndex;
                // Update maxGap if the current gap is larger than the maximum gap found so far.
                maxGap = Math.max(maxGap, currentGap);
            }
            // Update lastOneIndex to the current index 'i', as this is now the most recent '1'.
            lastOneIndex = i;
        }
    }

    // Return the maximum gap found. If no two adjacent 1s were found, maxGap will remain 0.
    return maxGap;
};
```