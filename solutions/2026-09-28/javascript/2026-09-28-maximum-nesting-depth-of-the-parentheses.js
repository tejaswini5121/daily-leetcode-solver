// /**
//  * @param {string} s
//  * @return {number}
//  */
// /*
// Problem Summary:
// The problem asks us to find the maximum nesting depth of parentheses in a given valid parentheses string.
// This means we need to find the deepest level of nested parentheses.

// Link: https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/

// Approach:
// We can solve this problem by iterating through the input string and maintaining a counter for the current nesting depth.
// When we encounter an opening parenthesis '(', we increment the current depth.
// When we encounter a closing parenthesis ')', we decrement the current depth.
// We also keep track of the maximum depth seen so far.
// This approach effectively simulates the process of entering and exiting nested parentheses.

// Time Complexity: O(n)
// The algorithm iterates through the input string once. The length of the string is 'n'. Therefore, the time complexity is linear with respect to the length of the string.

// Space Complexity: O(1)
// We only use a few variables (current depth and maximum depth) to store information. The space used does not depend on the input size. Therefore, the space complexity is constant.
// */
// const maxDepth = function(s) {
//     // Initialize current depth to 0. This will track the current level of nested parentheses.
//     let currentDepth = 0;
//     // Initialize maximum depth to 0. This will store the highest depth encountered.
//     let maxDepth = 0;

//     // Iterate through each character in the input string 's'.
//     for (let i = 0; i < s.length; i++) {
//         const char = s[i];

//         // If the character is an opening parenthesis '(', it means we are entering a new level of nesting.
//         if (char === '(') {
//             // Increment the current depth.
//             currentDepth++;
//             // Update the maximum depth if the current depth is greater than the maximum depth seen so far.
//             maxDepth = Math.max(maxDepth, currentDepth);
//         }
//         // If the character is a closing parenthesis ')', it means we are exiting a level of nesting.
//         else if (char === ')') {
//             // Decrement the current depth.
//             currentDepth--;
//         }
//         // Other characters (digits, operators) do not affect the nesting depth, so we ignore them.
//     }

//     // After iterating through the entire string, maxDepth will hold the maximum nesting depth.
//     return maxDepth;
// };
const maxDepth = function(s) {
    // Initialize currentDepth to 0. This variable will keep track of the current nesting level.
    let currentDepth = 0;
    // Initialize maxDepthFound to 0. This variable will store the maximum nesting depth encountered so far.
    let maxDepthFound = 0;

    // Iterate through each character of the input string s.
    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        // If the current character is an opening parenthesis '(', it signifies entering a deeper nesting level.
        if (char === '(') {
            // Increment the current depth counter.
            currentDepth++;
            // Update the maximum depth found if the current depth is greater.
            maxDepthFound = Math.max(maxDepthFound, currentDepth);
        }
        // If the current character is a closing parenthesis ')', it signifies exiting a nesting level.
        else if (char === ')') {
            // Decrement the current depth counter.
            currentDepth--;
        }
        // For any other characters (digits, operators), they do not affect the nesting depth, so we do nothing.
    }

    // After iterating through the entire string, maxDepthFound will hold the highest nesting depth achieved.
    return maxDepthFound;
};