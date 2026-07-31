```cpp
// Problem: Minimum Number of Pushes to Type Word II
// Link: https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii
//
// Approach Explanation:
// The goal is to minimize the total number of key pushes required to type a given word.
// We are allowed to remap letters to 8 available keys (numbered 2 through 9).
// The cost of typing a letter depends on its position on the key it's mapped to:
// - The first letter mapped to a key costs 1 push.
// - The second letter mapped to that same key costs 2 pushes.
// - The third letter costs 3 pushes, and so on.
//
// To achieve the minimum total pushes, we should apply a greedy strategy:
// Letters that appear most frequently in the word should be assigned to "slots" that require fewer pushes (e.g., 1 push slots).
//
// The approach involves these steps:
// 1.  **Count Character Frequencies**: Iterate through the input `word` and count how many times each lowercase English letter appears. A `std::vector<int>` of size 26 is efficient for this.
// 2.  **Sort Frequencies**: Collect all non-zero frequencies into a list (e.g., another `std::vector<int>`). Then, sort this list in descending order. This ensures that the characters with the highest occurrences are at the beginning.
// 3.  **Calculate Minimum Pushes**: Iterate through the sorted frequencies.
//     - We have 8 keys. This means there are 8 "first slots" available (one on each key, costing 1 push each).
//     - After these 8 are used, there are 8 "second slots" available (one on each key, costing 2 pushes each).
//     - This pattern continues for "third slots" (3 pushes), "fourth slots" (4 pushes), etc.
//     - We use a `pushMultiplier` variable, starting at 1, to track the current cost per character.
//     - We also use `slotsFilledOnCurrentLevel` to count how many characters have been assigned to keys at the current `pushMultiplier` level.
//     - For each frequency `f` in the sorted list:
//         - Add `f * pushMultiplier` to the `totalPushes`.
//         - Increment `slotsFilledOnCurrentLevel`.
//         - If `slotsFilledOnCurrentLevel` reaches 8 (meaning all 8 keys have been assigned a character at the current `pushMultiplier` level), we increment `pushMultiplier` for the next set of characters and reset `slotsFilledOnCurrentLevel` to 0.
//
// This greedy assignment strategy guarantees optimality because assigning a high-frequency character to a lower-cost slot always yields a greater total push reduction than assigning a low-frequency character to that same slot. By processing frequencies in descending order, we ensure the highest-impact characters get the best (lowest-cost) slots.
//
// Time Complexity:
// O(N), where N is the length of the input `word`.
// - Counting character frequencies takes O(N) time.
// - Storing and sorting the at most 26 distinct character frequencies takes O(26 log 26), which is O(1) (constant time) as 26 is a fixed small number.
// - Iterating through the sorted frequencies to calculate total pushes takes O(26), also O(1).
// The dominant factor is iterating through the word, so the overall time complexity is O(N).
//
// Space Complexity:
// O(1).
// - A frequency array/vector of size 26: O(26) = O(1).
// - A vector to store the sorted non-zero frequencies: O(26) = O(1).
// Therefore, the total space complexity is O(1).
```

```cpp
#include <string>    // Required for std::string
#include <vector>    // Required for std::vector
#include <algorithm> // Required for std::sort

// The Solution class contains the logic to solve the problem.
class Solution {
public:
    // This method calculates the minimum number of pushes required to type the given word.
    int minimumPushes(std::string word) {
        // Step 1: Count the frequency of each character in the word.
        // `freq` is a vector of 26 integers, initialized to 0.
        // `freq[0]` will store count for 'a', `freq[1]` for 'b', and so on.
        std::vector<int> freq(26, 0);
        for (char c : word) {
            // Increment the count for the corresponding character.
            // `c - 'a'` converts a character (e.g., 'a') to its 0-based index (0).
            freq[c - 'a']++;
        }

        // Step 2: Collect all non-zero frequencies and sort them in descending order.
        // This ensures that characters appearing most frequently are considered first.
        std::vector<int> sortedFrequencies;
        for (int count : freq) {
            // Only add frequencies for characters that actually appear in the word.
            if (count > 0) {
                sortedFrequencies.push_back(count);
            }
        }
        // Sort the frequencies in descending order (highest frequency first).
        // `rbegin()` and `rend()` provide reverse iterators for descending sort.
        std::sort(sortedFrequencies.rbegin(), sortedFrequencies.rend());

        // Step 3: Calculate the minimum total pushes.
        int totalPushes = 0;
        // `pushMultiplier` tracks the current cost per character assignment (1 for 1st level, 2 for 2nd, etc.).
        int pushMultiplier = 1;
        // `slotsFilledOnCurrentLevel` tracks how many characters have been assigned to slots
        // at the current `pushMultiplier` level across the 8 keys.
        int slotsFilledOnCurrentLevel = 0;

        // Iterate through the frequencies, from highest to lowest.
        for (int currentFreq : sortedFrequencies) {
            // For the current character (with `currentFreq` occurrences),
            // add its contribution to the total pushes.
            // The cost for *each* occurrence is `pushMultiplier`.
            totalPushes += currentFreq * pushMultiplier;
            
            // Increment the count of slots filled at the current `pushMultiplier` level.
            slotsFilledOnCurrentLevel++;

            // If 8 slots have been filled at the current `pushMultiplier` level,
            // it means we've utilized one slot on each of the 8 available keys.
            // For the next character(s), the push cost will increase.
            if (slotsFilledOnCurrentLevel == 8) {
                pushMultiplier++; // Move to the next push level (e.g., from 1-push to 2-push).
                slotsFilledOnCurrentLevel = 0; // Reset the slot counter for the new level.
            }
        }

        // Return the accumulated minimum total pushes.
        return totalPushes;
    }
};

```