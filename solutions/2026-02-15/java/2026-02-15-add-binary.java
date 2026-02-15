```java
/**
 * Problem: Add Binary
 * Summary: Given two binary strings, compute their sum as a binary string.
 * Link: https://leetcode.com/problems/add-binary/
 *
 * Approach:
 * We can simulate the manual process of binary addition. We iterate from the rightmost
 * digits of both strings, keeping track of a `carry`. In each step, we sum the
 * current digits from `a` and `b` (if they exist) and the `carry`. The least
 * significant bit of this sum becomes the current digit of the result, and the
 * remaining part is the new `carry` for the next iteration. We build the result
 * string by prepending the current digit. Finally, if there's a remaining `carry`
 * after processing all digits, we prepend '1' to the result.
 *
 * Time Complexity: O(max(N, M)), where N and M are the lengths of strings a and b.
 * We iterate through the strings at most once.
 *
 * Space Complexity: O(max(N, M)) for storing the result string. In the worst case,
 * the sum can be one digit longer than the longer input string.
 */
class Solution {
    public String addBinary(String a, String b) {
        // Use a StringBuilder to efficiently build the result string by prepending.
        StringBuilder sb = new StringBuilder();

        // Initialize pointers for the end of both strings.
        int i = a.length() - 1;
        int j = b.length() - 1;

        // Initialize carry to 0.
        int carry = 0;

        // Loop as long as there are digits in either string or there's a carry.
        while (i >= 0 || j >= 0 || carry > 0) {
            // Get the current digit from string 'a'. If i is out of bounds, treat it as 0.
            int digitA = (i >= 0) ? a.charAt(i) - '0' : 0;
            // Get the current digit from string 'b'. If j is out of bounds, treat it as 0.
            int digitB = (j >= 0) ? b.charAt(j) - '0' : 0;

            // Calculate the sum of the current digits and the carry.
            int currentSum = digitA + digitB + carry;

            // The current digit of the result is the remainder when currentSum is divided by 2.
            // This is the least significant bit of the sum.
            sb.insert(0, currentSum % 2);

            // The new carry is the quotient when currentSum is divided by 2.
            // This determines if there's a carry-over to the next position.
            carry = currentSum / 2;

            // Move the pointers to the left.
            i--;
            j--;
        }

        // Return the constructed binary string.
        return sb.toString();
    }
}
```