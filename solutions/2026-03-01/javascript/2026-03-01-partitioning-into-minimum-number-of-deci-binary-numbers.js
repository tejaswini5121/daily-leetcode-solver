// /**
//  * @param {string} n
//  * @return {number}
//  */
// Problem Summary: Find the minimum number of deci-binary numbers that sum to a given decimal string.
// Problem Link: https://leetcode.com/problems/partitioning-into-minimum-number-of-deci-binary-numbers/
// Approach:
// The key insight is that a deci-binary number can only have digits 0 or 1.
// To sum up to a target number `n`, if `n` has a digit `d`, we need at least `d` deci-binary numbers that contribute to that digit's place value.
// For example, if `n = "32"`, the digit '3' in the tens place means we need at least 3 deci-binary numbers that have a '1' in the tens place.
// Similarly, the digit '2' in the units place means we need at least 2 deci-binary numbers that have a '1' in the units place.
// The maximum digit in `n` determines the minimum number of deci-binary numbers required. This is because the deci-binary numbers we construct will have '1's at positions corresponding to the digits of `n`.
// For instance, to get `n = "32"`, we can construct:
// 10 (contributes 1 to tens place)
// 10 (contributes 1 to tens place)
// 10 (contributes 1 to tens place)
//  1 (contributes 1 to units place)
//  1 (contributes 1 to units place)
// This sums to 30 + 2 = 32. We can combine these to get 3 deci-binary numbers:
// Number 1: 11 (1 in tens, 1 in units)
// Number 2: 11 (1 in tens, 1 in units)
// Number 3: 10 (1 in tens, 0 in units)
// Sum: 32. The maximum digit in "32" is 3.
// Therefore, the problem reduces to finding the largest digit in the input string `n`.
//
// Algorithm:
// 1. Initialize a variable `maxDigit` to 0.
// 2. Iterate through each character (digit) in the input string `n`.
// 3. Convert the character digit to an integer.
// 4. Update `maxDigit` to be the maximum of its current value and the integer digit.
// 5. After iterating through all digits, `maxDigit` will hold the largest digit, which is the minimum number of deci-binary numbers required.
//
// Time Complexity: O(L), where L is the length of the string `n`. We iterate through the string once.
// Space Complexity: O(1), as we only use a constant amount of extra space for `maxDigit`.
// */
//
// // Function to find the maximum digit in a string representing a positive integer.
// const reorderList = (head) => {
//     // If the list is empty or has only one node, no reordering is needed.
//     if (!head || !head.next) {
//         return head;
//     }
//
//     // Step 1: Find the middle of the linked list.
//     let slow = head;
//     let fast = head;
//     while (fast && fast.next) {
//         slow = slow.next;
//         fast = fast.next.next;
//     }
//
//     // `slow` is now at the start of the second half of the list.
//     // Split the list into two halves: `head` to `prevOfSlow` and `slow` to the end.
//     let secondHalf = slow;
//     let prevOfSlow = head;
//     while (prevOfSlow.next !== slow) {
//         prevOfSlow = prevOfSlow.next;
//     }
//     prevOfSlow.next = null; // Break the link to split the list.
//
//     // Step 2: Reverse the second half of the linked list.
//     let prev = null;
//     let current = secondHalf;
//     while (current) {
//         const nextTemp = current.next;
//         current.next = prev;
//         prev = current;
//         current = nextTemp;
//     }
//     // `prev` is now the head of the reversed second half.
//     let reversedSecondHalf = prev;
//
//     // Step 3: Merge the two halves alternately.
//     let firstHalf = head;
//     let mergedList = new ListNode(0); // Dummy head for the merged list.
//     let currentMerged = mergedList;
//
//     while (firstHalf && reversedSecondHalf) {
//         currentMerged.next = firstHalf;
//         firstHalf = firstHalf.next;
//         currentMerged = currentMerged.next;
//
//         currentMerged.next = reversedSecondHalf;
//         reversedSecondHalf = reversedSecondHalf.next;
//         currentMerged = currentMerged.next;
//     }
//
//     // If there's any remaining node in the first half (should not happen if list length is even,
//     // but good for odd length lists where first half might be longer).
//     if (firstHalf) {
//         currentMerged.next = firstHalf;
//     }
//
//     // Return the head of the merged list (skip the dummy head).
//     return mergedList.next;
// };
//
// // Definition for singly-linked list.
// // function ListNode(val, next) {
// //     this.val = (val===undefined ? 0 : val)
// //     this.next = (next===undefined ? null : next)
// // }
//
// // Helper function to convert an array to a linked list.
// function arrayToList(arr) {
//     if (!arr || arr.length === 0) {
//         return null;
//     }
//     let head = new ListNode(arr[0]);
//     let current = head;
//     for (let i = 1; i < arr.length; i++) {
//         current.next = new ListNode(arr[i]);
//         current = current.next;
//     }
//     return head;
// }
//
// // Helper function to convert a linked list to an array for easier comparison.
// function listToArray(head) {
//     const arr = [];
//     let current = head;
//     while (current) {
//         arr.push(current.val);
//         current = current.next;
//     }
//     return arr;
// }
//
// // LeetCode's ListNode definition if running locally without LeetCode environment.
// // In LeetCode, ListNode is provided.
// if (typeof ListNode === 'undefined') {
//     function ListNode(val, next) {
//         this.val = (val === undefined ? 0 : val);
//         this.next = (next === undefined ? null : next);
//     }
// }
//
// /**
//  * @param {string} n
//  * @return {number}
//  */
// const maxDistToClosest = (seats) => {
//     let max_dist = 0;
//     let last_person = -1; // Index of the last person encountered.
//
//     for (let i = 0; i < seats.length; i++) {
//         if (seats[i] === 1) {
//             // If this is the first person encountered
//             if (last_person === -1) {
//                 // The distance is from the beginning of the row to this person.
//                 max_dist = Math.max(max_dist, i);
//             } else {
//                 // The distance is half the gap between the current person and the last person.
//                 max_dist = Math.max(max_dist, Math.floor((i - last_person) / 2));
//             }
//             // Update the index of the last person encountered.
//             last_person = i;
//         }
//     }
//
//     // After the loop, consider the distance from the last person to the end of the row.
//     // `seats.length - 1` is the index of the last seat.
//     max_dist = Math.max(max_dist, seats.length - 1 - last_person);
//
//     return max_dist;
// };
//
// // Example Usage:
// // const n1 = "32";
// // console.log(`Input: "${n1}", Output: ${reorderedPowerOf2(n1)}`); // Expected: 3
//
// // const n2 = "82734";
// // console.log(`Input: "${n2}", Output: ${reorderedPowerOf2(n2)}`); // Expected: 8
//
// // const n3 = "27346209830709182346";
// // console.log(`Input: "${n3}", Output: ${reorderedPowerOf2(n3)}`); // Expected: 9
//
// // Test cases for `reorderList`
// // let head1 = arrayToList([1, 2, 3, 4]);
// // let reordered1 = reorderList(head1);
// // console.log(`Input: [1, 2, 3, 4], Output: [${listToArray(reordered1)}]`); // Expected: [1, 4, 2, 3]
//
// // let head2 = arrayToList([1, 2, 3, 4, 5]);
// // let reordered2 = reorderList(head2);
// // console.log(`Input: [1, 2, 3, 4, 5], Output: [${listToArray(reordered2)}]`); // Expected: [1, 5, 2, 4, 3]
//
// // Test cases for `maxDistToClosest`
// // console.log(`Input: [1,0,0,0], Output: ${maxDistToClosest([1,0,0,0])}`); // Expected: 3
// // console.log(`Input: [1,0,0,1], Output: ${maxDistToClosest([1,0,0,1])}`); // Expected: 2
// // console.log(`Input: [0,1], Output: ${maxDistToClosest([0,1])}`); // Expected: 1
// // console.log(`Input: [1,0,0,0,0,0,1], Output: ${maxDistToClosest([1,0,0,0,0,0,1])}`); // Expected: 3
//
//
// /**
//  * @param {string} n
//  * @return {number}
//  */
// const minPartitions = (n) => {
//     // Initialize the maximum digit found so far to 0.
//     let maxDigit = 0;
//
//     // Iterate through each character (digit) in the input string 'n'.
//     for (let i = 0; i < n.length; i++) {
//         // Convert the character digit to an integer.
//         const currentDigit = parseInt(n[i], 10);
//
//         // Update maxDigit if the current digit is larger.
//         // This is because to form the number 'n', we need at least
//         // `currentDigit` deci-binary numbers to sum up to this place value.
//         // The overall minimum number of partitions will be determined by the
//         // largest digit present in 'n'.
//         if (currentDigit > maxDigit) {
//             maxDigit = currentDigit;
//         }
//     }
//
//     // The maximum digit found is the minimum number of deci-binary numbers required.
//     return maxDigit;
// };
//
// // Example Usage:
// const n1 = "32";
// console.log(`Input: "${n1}", Output: ${minPartitions(n1)}`); // Expected: 3
//
// const n2 = "82734";
// console.log(`Input: "${n2}", Output: ${minPartitions(n2)}`); // Expected: 8
//
// const n3 = "27346209830709182346";
// console.log(`Input: "${n3}", Output: ${minPartitions(n3)}`); // Expected: 9
//
// // Additional test case
// const n4 = "1";
// console.log(`Input: "${n4}", Output: ${minPartitions(n4)}`); // Expected: 1
//
// const n5 = "10";
// console.log(`Input: "${n5}", Output: ${minPartitions(n5)}`); // Expected: 1
//
// const n6 = "999";
// console.log(`Input: "${n6}", Output: ${minPartitions(n6)}`); // Expected: 9
//
// const n7 = "0"; // Though constraint says positive integer, let's consider
// console.log(`Input: "${n7}", Output: ${minPartitions(n7)}`); // Expected: 0 (or handle according to problem if '0' is allowed and how it's defined) - Constraints say "positive integer", so "0" won't be an input.

// The problem is Partitioning Into Minimum Number Of Deci-Binary Numbers.
// The provided code is for Partitioning Into Minimum Number Of Deci-Binary Numbers.
// I will provide the code for Partitioning Into Minimum Number Of Deci-Binary Numbers.

/**
 * @param {string} n
 * @return {number}
 */
// Problem Summary: Find the minimum number of deci-binary numbers that sum to a given decimal string.
// Problem Link: https://leetcode.com/problems/partitioning-into-minimum-number-of-deci-binary-numbers/
// Approach:
// The key insight is that a deci-binary number can only have digits 0 or 1.
// To sum up to a target number `n`, if `n` has a digit `d`, we need at least `d` deci-binary numbers that contribute to that digit's place value.
// For example, if `n = "32"`, the digit '3' in the tens place means we need at least 3 deci-binary numbers that have a '1' in the tens place.
// Similarly, the digit '2' in the units place means we need at least 2 deci-binary numbers that have a '1' in the units place.
// The maximum digit in `n` determines the minimum number of deci-binary numbers required. This is because the deci-binary numbers we construct will have '1's at positions corresponding to the digits of `n`.
// For instance, to get `n = "32"`, we can construct:
// 10 (contributes 1 to tens place)
// 10 (contributes 1 to tens place)
// 10 (contributes 1 to tens place)
//  1 (contributes 1 to units place)
//  1 (contributes 1 to units place)
// This sums to 30 + 2 = 32. We can combine these to get 3 deci-binary numbers:
// Number 1: 11 (1 in tens, 1 in units)
// Number 2: 11 (1 in tens, 1 in units)
// Number 3: 10 (1 in tens, 0 in units)
// Sum: 32. The maximum digit in "32" is 3.
// Therefore, the problem reduces to finding the largest digit in the input string `n`.
//
// Algorithm:
// 1. Initialize a variable `maxDigit` to 0.
// 2. Iterate through each character (digit) in the input string `n`.
// 3. Convert the character digit to an integer.
// 4. Update `maxDigit` to be the maximum of its current value and the integer digit.
// 5. After iterating through all digits, `maxDigit` will hold the largest digit, which is the minimum number of deci-binary numbers required.
//
// Time Complexity: O(L), where L is the length of the string `n`. We iterate through the string once.
// Space Complexity: O(1), as we only use a constant amount of extra space for `maxDigit`.
const minPartitions = (n) => {
    // Initialize the maximum digit found so far to 0.
    let maxDigit = 0;

    // Iterate through each character (digit) in the input string 'n'.
    for (let i = 0; i < n.length; i++) {
        // Convert the character digit to an integer.
        const currentDigit = parseInt(n[i], 10);

        // Update maxDigit if the current digit is larger.
        // This is because to form the number 'n', we need at least
        // `currentDigit` deci-binary numbers to sum up to this place value.
        // The overall minimum number of partitions will be determined by the
        // largest digit present in 'n'.
        if (currentDigit > maxDigit) {
            maxDigit = currentDigit;
        }
    }

    // The maximum digit found is the minimum number of deci-binary numbers required.
    return maxDigit;
};
// Example Usage:
const n1 = "32";
console.log(`Input: "${n1}", Output: ${minPartitions(n1)}`);

const n2 = "82734";
console.log(`Input: "${n2}", Output: ${minPartitions(n2)}`);

const n3 = "27346209830709182346";
console.log(`Input: "${n3}", Output: ${minPartitions(n3)}`);