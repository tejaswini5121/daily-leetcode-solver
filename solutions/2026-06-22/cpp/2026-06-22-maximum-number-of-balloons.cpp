```cpp
// Problem: Maximum Number of Balloons
// Link: https://leetcode.com/problems/maximum-number-of-balloons/
// Approach:
// The problem asks us to find the maximum number of times we can form the word "balloon"
// using the characters from a given text. Each character can be used at most once.
//
// To solve this, we need to count the occurrences of each required character ('b', 'a', 'l', 'o', 'n')
// in the input `text`.
//
// The word "balloon" requires:
// - 1 'b'
// - 1 'a'
// - 2 'l's
// - 2 'o's
// - 1 'n'
//
// We can use a frequency map (or an array of size 26 for lowercase English letters) to store
// the counts of characters in `text`.
//
// After counting the characters in `text`, we can determine how many "balloon" instances
// we can form. For each character in "balloon", we find the maximum number of times that character
// can contribute to forming "balloon" instances based on its available count in `text`.
//
// For 'b', 'a', and 'n', each available character allows for one "balloon" instance.
// For 'l' and 'o', since "balloon" requires two of each, we can form `count_of_l / 2`
// and `count_of_o / 2` instances, respectively.
//
// The overall maximum number of "balloon" instances will be limited by the character
// that allows for the fewest instances. Therefore, we take the minimum of the possible
// instances for each required character.
//
// Time Complexity:
// O(N), where N is the length of the input `text`.
// We iterate through the `text` once to count character frequencies.
// Then, we iterate through the required characters of "balloon" (a constant number, 5 distinct characters).
//
// Space Complexity:
// O(1), because we use a fixed-size array (size 26) to store character counts, which does not depend on the input size.
// Alternatively, if a hash map were used, it would still be O(1) as it would store at most 26 entries.

#include <string>
#include <vector>
#include <algorithm>
#include <unordered_map>

class Solution {
public:
    int maxNumberOfBalloons(std::string text) {
        // Use an unordered_map to store the frequency of each character in the input text.
        // Alternatively, a std::vector<int> of size 26 could be used for lowercase English letters.
        std::unordered_map<char, int> counts;

        // Iterate through the input string and count the occurrences of each character.
        for (char c : text) {
            counts[c]++;
        }

        // The word "balloon" requires:
        // 'b': 1
        // 'a': 1
        // 'l': 2
        // 'o': 2
        // 'n': 1

        // Calculate how many "balloon" instances can be formed based on the count of each character.
        // For 'b', 'a', 'n', each character allows for one instance.
        // For 'l' and 'o', two characters are needed per instance, so we divide their counts by 2.
        // If a character is not present in `counts`, its count will be 0, which correctly limits instances to 0.

        // Number of 'b' instances possible
        int b_instances = counts.count('b') ? counts['b'] : 0;
        // Number of 'a' instances possible
        int a_instances = counts.count('a') ? counts['a'] : 0;
        // Number of 'l' instances possible (need 2 'l's per balloon)
        int l_instances = counts.count('l') ? counts['l'] / 2 : 0;
        // Number of 'o' instances possible (need 2 'o's per balloon)
        int o_instances = counts.count('o') ? counts['o'] / 2 : 0;
        // Number of 'n' instances possible
        int n_instances = counts.count('n') ? counts['n'] : 0;

        // The maximum number of "balloon" instances is limited by the character that can form the fewest instances.
        // We find the minimum among the possible instances for 'b', 'a', 'l', 'o', and 'n'.
        return std::min({b_instances, a_instances, l_instances, o_instances, n_instances});
    }
};
```