```java
import java.util.ArrayList;
import java.util.List;

// Problem: Separate the Digits in an Array
// Link: https://leetcode.com/problems/separate-the-digits-in-an-array/
// Approach:
// The problem asks us to take an array of positive integers and return a new array
// containing each digit of each number, in the order they appear.
// We can iterate through each number in the input array `nums`.
// For each number, we need to extract its digits. A common way to do this is
// by repeatedly taking the number modulo 10 to get the last digit, and then
// dividing the number by 10 to remove the last digit, until the number becomes 0.
// However, this extracts digits in reverse order. To maintain the original order,
// we can convert the number to a string and then iterate through the characters
// of the string, converting each character back to an integer.
// Alternatively, we can use a mathematical approach to extract digits in the correct order.
// For a number like 123, we can find the number of digits first. For 123, it has 3 digits.
// Then, we can calculate 123 / 10^(3-1) = 123 / 100 = 1 (the first digit).
// Then, we can update the number to be the remainder: 123 % 100 = 23.
// Repeat for 23: 23 / 10^(2-1) = 23 / 10 = 2 (the second digit).
// Update number: 23 % 10 = 3.
// Repeat for 3: 3 / 10^(1-1) = 3 / 1 = 3 (the third digit).
// Update number: 3 % 1 = 0.
// This mathematical approach can be a bit more complex to implement correctly.
// The string conversion method is generally simpler and more readable for this problem.
// We will use the string conversion method.
// We initialize an empty `ArrayList` called `answer`.
// We iterate through each `num` in the input array `nums`.
// For each `num`, we convert it to a string using `String.valueOf(num)`.
// Then, we iterate through each character `c` in the string.
// For each character `c`, we convert it to an integer by subtracting the ASCII value of '0'.
// We add this integer digit to our `answer` list.
// Finally, after processing all numbers, we return the `answer` list.
//
// Time Complexity: O(N * L), where N is the number of elements in `nums` and L is the maximum number of digits in any number in `nums`.
// Converting a number to a string and iterating through its digits takes time proportional to the number of digits.
// Since `nums[i] <= 10^5`, the maximum number of digits is 6. So, L is small and effectively constant.
// Thus, the time complexity can be considered O(N).
//
// Space Complexity: O(D), where D is the total number of digits in all numbers in `nums`.
// This is the space required to store the `answer` list.
// In the worst case, if each number has `L` digits, and there are `N` numbers, then `D = N * L`.
// Again, since `L` is small and effectively constant, the space complexity is O(N).

class Solution {
    public List<Integer> separateDigits(int[] nums) {
        // Initialize an ArrayList to store the separated digits.
        List<Integer> answer = new ArrayList<>();

        // Iterate through each number in the input array `nums`.
        for (int num : nums) {
            // Convert the current number to a string to easily access its digits.
            String numStr = String.valueOf(num);

            // Iterate through each character in the string representation of the number.
            for (char c : numStr.toCharArray()) {
                // Convert the character digit back to an integer.
                // Subtracting the ASCII value of '0' from the character 'c'
                // gives its integer representation (e.g., '1' - '0' = 1).
                int digit = c - '0';
                // Add the extracted digit to our result list.
                answer.add(digit);
            }
        }

        // Return the list containing all separated digits in the correct order.
        return answer;
    }
}
```