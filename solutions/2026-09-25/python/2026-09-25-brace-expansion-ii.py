```python
# Problem: Brace Expansion II
# Link: https://leetcode.com/problems/brace-expansion-ii/
# Approach:
# This problem can be solved using a recursive approach, similar to parsing and evaluating an expression.
# We can define a function that takes a substring of the expression and returns the set of words it represents.
# The base cases are:
# 1. A single lowercase letter: returns a set containing that letter.
# 2. A comma-separated list within braces: recursively call the function for each element and take the union of the results.
# 3. Concatenation of two expressions: recursively call the function for each expression and then compute the Cartesian product of the resulting sets.
#
# To handle nested braces and parsing, we can use a stack-like approach or simply iterate through the string, keeping track of brace nesting levels.
# When we encounter an opening brace '{', we start parsing a new sub-expression.
# When we encounter a comma ',', it separates elements within the current brace level.
# When we encounter a closing brace '}', it signifies the end of a sub-expression.
#
# The concatenation rule is implicit when two sub-expressions appear next to each other without a comma or braces enclosing them as separate elements.
# For example, in "{a,b}{c,d}", "{a,b}" is one expression and "{c,d}" is the second.
#
# We can parse the expression into a structured representation first, or parse and evaluate on the fly.
# Evaluating on the fly seems more direct.
#
# Let's refine the parsing strategy:
# We can use a recursive function `parse(expression_string)` that returns a set of strings.
# Inside `parse`:
# - If `expression_string` is a single character, return `{expression_string}`.
# - If `expression_string` starts with '{' and ends with '}', it's either a union or a concatenation.
#   - We need to find the top-level comma-separated elements or top-level concatenated elements.
#   - We can iterate through the string, maintaining a brace count.
#   - If we find a comma at brace count 0, it's a union: `R(e1, e2, ...) = R(e1) U R(e2) U ...`
#   - If we find a point where brace count is 0 and the character is not a comma or closing brace, and the next character is not a comma or closing brace, it indicates a concatenation: `R(e1 + e2) = {a + b for a in R(e1) for b in R(e2)}`
#
# Example walk-through: "{a,b}{c,{d,e}}"
# Outer expression is a concatenation of "{a,b}" and "{c,{d,e}}".
# 1. Parse "{a,b}": This is a union of "a" and "b". Returns {"a", "b"}.
# 2. Parse "{c,{d,e}}":
#    - This is a union of "c" and "{d,e}".
#    - Parse "c": Returns {"c"}.
#    - Parse "{d,e}": This is a union of "d" and "e". Returns {"d", "e"}.
#    - Union of {"c"} and {"d", "e"} is {"c", "d", "e"}.
# 3. Concatenate {"a", "b"} and {"c", "d", "e"}:
#    - "a" + "c" -> "ac"
#    - "a" + "d" -> "ad"
#    - "a" + "e" -> "ae"
#    - "b" + "c" -> "bc"
#    - "b" + "d" -> "bd"
#    - "b" + "e" -> "be"
#    Result: {"ac", "ad", "ae", "bc", "bd", "be"}. Finally, sort and return as a list.
#
# The core challenge is correctly splitting the expression at top-level commas or concatenations.
# We can use a stack to keep track of brace levels. When we encounter a comma at brace level 0, we split.
# When we reach the end of a braced section and the next part is not a comma, it's a concatenation.
#
# Let's consider a recursive helper function `expand(s)` that returns a list of strings.
# The main function will call `expand` and then sort the unique results.
#
# `expand(s)`:
#   If `s` is a single character: return `[s]`
#   If `s` starts with '{' and ends with '}':
#     Remove outer braces.
#     Find top-level splits:
#       Iterate through `s`, maintaining `brace_level`.
#       If `s[i] == ','` and `brace_level == 0`: this is a top-level union. Collect all such split parts.
#       If no top-level comma found:
#         The content inside the braces is either a single expression or a concatenation of expressions.
#         We need to find the split points for concatenation.
#         Iterate through `s`, maintaining `brace_level`.
#         If `brace_level == 0` and `s[i]` is not '}' and `s[i+1]` is not '{' and `s[i+1]` is not ',' (this needs careful handling for edge cases and adjacent letters).
#         A better approach for concatenation split: find the first point where `brace_level == 0` and the character is NOT a comma.
#         If the entire content is a single unit (e.g., "{a}" or "{a,b,c}"), then it's just union.
#         If it's `{e1}{e2}...` or `e1{e2}...` or `...{e1}e2`, we need to identify these concatenated parts.
#
# Let's simplify the parsing:
# The expression can be seen as a sequence of "units". A unit is either a single letter, or a brace-enclosed expression.
# Example: "{a,b}{c,{d,e}}" -> unit1="{a,b}", unit2="{c,{d,e}}"
# Example: "a{b,c}d" -> unit1="a", unit2="{b,c}", unit3="d"
#
# We can parse the expression into a list of lists of units.
# For "{a,b}{c,{d,e}}":
# Level 0:
#   - "{a,b}" -> Level 1: ["a", "b"] (union)
#   - "{c,{d,e}}" -> Level 1: ["c", "{d,e}"]
#     - "{d,e}" -> Level 2: ["d", "e"] (union)
# This structured representation can be tricky to build.
#
# Alternative: Recursive Descent Parser like approach.
# `parse(expression_segment)` returns `set[str]`
#
# Helper function `parse_segment(s)`:
#   If `s` is a single character: return `{s}`
#   If `s` starts with '{' and ends with '}':
#     `inner_s = s[1:-1]`
#     Find `tokens` by splitting `inner_s` based on top-level commas.
#     For example, "{a,{b,c},d}" -> tokens = ["a", "{b,c}", "d"]
#     `results = set()`
#     For each `token` in `tokens`:
#       `results.update(parse_segment(token))`
#     Return `results`
#
#   If `s` is not enclosed in braces and is a concatenation of parts:
#     Find the first split point for concatenation.
#     Iterate `i` from 0 to `len(s)`:
#       Maintain `brace_level`.
#       If `brace_level == 0`:
#         If `s[i]` is a letter and `s[i+1]` is a letter: `s[i] + s[i+1]` is a valid concatenation part.
#         If `s[i]` is a letter and `s[i+1]` is '{': `s[i]` is part 1, `s[i+1:]` is part 2.
#         If `s[i]` is '}' and `s[i+1]` is a letter: `s[:i+1]` is part 1, `s[i+1:]` is part 2.
#         If `s[i]` is '}' and `s[i+1]` is '{': `s[:i+1]` is part 1, `s[i+1:]` is part 2.
#
# This splitting logic for concatenation is the trickiest.
# Let's use a state machine or index tracking carefully.
#
# `evaluate(expr)`:
#   `parts = []`
#   `i = 0`
#   while `i < len(expr)`:
#     if `expr[i] == '{'`:
#       # Find the matching closing brace
#       `j = i`
#       `brace_count = 0`
#       while `j < len(expr)`:
#         if `expr[j] == '{'`: `brace_count += 1`
#         elif `expr[j] == '}'`: `brace_count -= 1`
#         if `brace_count == 0`: break
#         `j += 1`
#       `parts.append(expr[i:j+1])`
#       `i = j + 1`
#     else: # single letter
#       `parts.append(expr[i])`
#       `i += 1`
#
#   # Now `parts` contains a list of top-level components (single letters or brace-enclosed expressions).
#   # If len(parts) == 1, then `expr` was a single component.
#   # If len(parts) > 1, then `expr` was a concatenation of these parts.
#
#   if len(parts) == 1:
#     `component = parts[0]`
#     if `component[0] == '{'`: # It's a brace-enclosed expression
#       `inner_expr = component[1:-1]`
#       # Check if `inner_expr` is a union or a single expression that needs further parsing.
#       `sub_parts = []`
#       `k = 0`
#       `brace_level = 0`
#       `start = 0`
#       while `k < len(inner_expr)`:
#         if `inner_expr[k] == '{'`: `brace_level += 1`
#         elif `inner_expr[k] == '}'`: `brace_level -= 1`
#         elif `inner_expr[k] == ','` and `brace_level == 0`:
#           `sub_parts.append(inner_expr[start:k])`
#           `start = k + 1`
#         `k += 1`
#       `sub_parts.append(inner_expr[start:])` # Add the last part
#
#       if len(sub_parts) == 1: # It was not a top-level union inside these braces
#         return `evaluate(sub_parts[0])` # Recurse on the single part
#       else: # It was a top-level union
#         `result_set = set()`
#         for `sub_part` in `sub_parts`:
#           `result_set.update(evaluate(sub_part))`
#         return `result_set`
#     else: # It's a single character
#       return `{component}`
#   else: # It's a concatenation of `parts`
#     `result_set = {""}` # Start with an empty string for concatenation
#     for `part` in `parts`:
#       `current_eval = evaluate(part)`
#       `new_result_set = set()`
#       for `res` in `result_set`:
#         for `curr` in `current_eval`:
#           `new_result_set.add(res + curr)`
#       `result_set = new_result_set`
#     return `result_set`
#
# Main function:
#   `result = evaluate(expression)`
#   `return sorted(list(result))`
#
# Let's dry run "{a,b}{c,{d,e}}" with this `evaluate` logic.
# `evaluate("{a,b}{c,{d,e}}")`
#   `parts = ["{a,b}", "{c,{d,e}}"]`
#   `len(parts) > 1`, so it's concatenation.
#   `result_set = {""}`
#   Iterate `part` in `parts`:
#     `part = "{a,b}"`
#       `current_eval = evaluate("{a,b}")`
#         `parts = ["a", "b"]` (inside the braces, after finding top-level comma)
#         `len(sub_parts) > 1`, so it's union.
#         `result_set_inner = set()`
#         `sub_part = "a"` -> `evaluate("a")` returns `{"a"}`. `result_set_inner` becomes `{"a"}`.
#         `sub_part = "b"` -> `evaluate("b")` returns `{"b"}`. `result_set_inner` becomes `{"a", "b"}`.
#         Returns `{"a", "b"}`.
#       `current_eval` is `{"a", "b"}`.
#       `new_result_set = set()`
#       `res` in `{"":}`:
#         `curr` in `{"a", "b"}`:
#           `"" + "a" = "a"`. `new_result_set.add("a")`.
#           `"" + "b" = "b"`. `new_result_set.add("b")`.
#       `result_set` becomes `{"a", "b"}`.
#
#     `part = "{c,{d,e}}"`
#       `current_eval = evaluate("{c,{d,e}}")`
#         `inner_expr = "c,{d,e}"`
#         Split by top-level comma: `sub_parts = ["c", "{d,e}"]`
#         `len(sub_parts) > 1`, so it's union.
#         `result_set_inner = set()`
#         `sub_part = "c"` -> `evaluate("c")` returns `{"c"}`. `result_set_inner` becomes `{"c"}`.
#         `sub_part = "{d,e}"` -> `evaluate("{d,e}")`
#           `inner_expr = "d,e"`
#           Split by top-level comma: `sub_parts = ["d", "e"]`
#           `len(sub_parts) > 1`, so union.
#           `evaluate("d")` returns `{"d"}`.
#           `evaluate("e")` returns `{"e"}`.
#           Union is `{"d", "e"}`. Returns `{"d", "e"}`.
#         `result_set_inner.update({"d", "e"})`. `result_set_inner` becomes `{"c", "d", "e"}`.
#         Returns `{"c", "d", "e"}`.
#       `current_eval` is `{"c", "d", "e"}`.
#       `new_result_set = set()`
#       `res` in `{"a", "b"}`:
#         `curr` in `{"c", "d", "e"}`:
#           `"a" + "c" = "ac"`. `new_result_set.add("ac")`.
#           `"a" + "d" = "ad"`. `new_result_set.add("ad")`.
#           `"a" + "e" = "ae"`. `new_result_set.add("ae")`.
#           `"b" + "c" = "bc"`. `new_result_set.add("bc")`.
#           `"b" + "d" = "bd"`. `new_result_set.add("bd")`.
#           `"b" + "e" = "be"`. `new_result_set.add("be")`.
#       `result_set` becomes `{"ac", "ad", "ae", "bc", "bd", "be"}`.
#
#   Returns `{"ac", "ad", "ae", "bc", "bd", "be"}`.
#   Finally, sort and convert to list.
#
# This seems to cover the logic. The parsing of `parts` and `sub_parts` needs to be robust.
#
# Let's refine the `evaluate` function and its parsing logic.
# The `evaluate` function should return a set of strings.
#
# `evaluate(expr)`:
#   `# Base case: single character`
#   if len(expr) == 1 and 'a' <= expr <= 'z':
#     return {expr}
#
#   `# Find top-level components (either single chars or brace-enclosed groups)`
#   `components = []`
#   `i = 0`
#   while `i < len(expr)`:
#     if expr[i] == '{':
#       `brace_level = 0`
#       `j = i`
#       while j < len(expr):
#         if expr[j] == '{':
#           brace_level += 1
#         elif expr[j] == '}':
#           brace_level -= 1
#         if brace_level == 0:
#           break
#         j += 1
#       components.append(expr[i : j + 1])
#       i = j + 1
#     else: # single letter
#       components.append(expr[i])
#       i += 1
#
#   `# If there's only one component, it's either a single char (handled by base case) or a brace-enclosed expression.`
#   `# Or it's an expression like "abc" which isn't possible according to problem structure unless it's like "a{b}c"`
#   `# The `components` list captures top-level concatenations.`
#   `# E.g., "a{b}c" -> components = ["a", "{b}", "c"]`
#   `# E.g., "{a,b}{c}" -> components = ["{a,b}", "{c}"]`
#
#   `# If `components` has more than one element, it means we have a concatenation at this level.`
#   if len(components) > 1:
#     `result_set = {""}`
#     for `comp` in components:
#       `current_results = evaluate(comp)` # Recursively evaluate each component
#       `new_result_set = set()`
#       for `existing_str` in `result_set`:
#         for `new_str` in `current_results`:
#           `new_result_set.add(existing_str + new_str)`
#       `result_set = new_result_set`
#     return `result_set`
#
#   `# If `components` has only one element, it must be the entire expression.`
#   `# This `component` is either a single letter (handled by base case) or a brace-enclosed expression.`
#   `component = components[0]`
#   if component[0] == '{': # It's a brace-enclosed expression: "{e1, e2, ...}" or "{e1e2...}"
#     `inner_expr = component[1:-1]`
#     `# Now we need to check if `inner_expr` is a union (comma-separated at level 0) or a single expression to evaluate.`
#     `sub_expressions = []`
#     `brace_level = 0`
#     `start = 0`
#     for `i` in range(len(inner_expr)):
#       if inner_expr[i] == '{':
#         brace_level += 1
#       elif inner_expr[i] == '}':
#         brace_level -= 1
#       elif inner_expr[i] == ',' and brace_level == 0:
#         sub_expressions.append(inner_expr[start:i])
#         start = i + 1
#     sub_expressions.append(inner_expr[start:]) # Add the last part
#
#     `# If `sub_expressions` has more than one element, it's a union.`
#     if len(sub_expressions) > 1:
#       `union_result_set = set()`
#       for `sub_expr` in sub_expressions:
#         `union_result_set.update(evaluate(sub_expr))` # Union of results
#       return `union_result_set`
#     else: # It's a single expression inside the braces, e.g., "{a{b,c}}"
#       return `evaluate(sub_expressions[0])` # Recurse on this single inner expression
#   else: # It's a single character (already handled by base case, but good for completeness)
#     return {component}
#
# Time Complexity:
# The length of the expression is at most 60.
# In the worst case, an expression like "{a,b,c,...}{a,b,c,...}..." can lead to a large number of generated strings.
# The number of generated words can be exponential in the structure.
# Consider an expression like `{a,b}{a,b}...{a,b}` (k times). The number of words is 2^k.
# The recursion depth can be proportional to the nesting level of braces.
# Each evaluation step involves string concatenations and set operations.
# The length of generated strings can also grow.
# The complexity is hard to pin down precisely with standard Big O notation due to the combinatorial nature.
# It's likely exponential in the worst case concerning the number of generated words.
# However, since the input length is small (<= 60), the number of possible expansions might be manageable within typical time limits.
# If N is the length of the expression, and W is the maximum number of words generated, and L is the maximum length of a generated word,
# the complexity could be roughly O(N * W * L) for set operations and string concatenations within each recursive call, summed up.
# The number of recursive calls could be related to N.
#
# Space Complexity:
# The space complexity is dominated by the storage of the generated strings in the sets.
# In the worst case, the number of generated words can be exponential, and their lengths can also grow.
# So, the space complexity can also be exponential in the worst case, depending on the output size.
# Given the constraint N <= 60, the total number of words and their lengths are likely bounded in practice by test cases.
#
# Example 2: "{{a,z},a{b,c},{ab,z}}"
# `evaluate("{{a,z},a{b,c},{ab,z}}")`
#   `component = "{{a,z},a{b,c},{ab,z}}"`
#   `inner_expr = "{a,z},a{b,c},{ab,z}"`
#   `sub_expressions` based on top-level comma: `["{a,z}", "a{b,c}", "{ab,z}"]`
#   This is a union of three parts.
#
#   1. `evaluate("{a,z}")`:
#      `inner_expr = "a,z"`
#      `sub_expressions = ["a", "z"]` (union)
#      `evaluate("a")` -> `{"a"}`
#      `evaluate("z")` -> `{"z"}`
#      Union: `{"a", "z"}`
#
#   2. `evaluate("a{b,c}")`:
#      `components = ["a", "{b,c}"]` (concatenation)
#      `result_set = {""}`
#      `comp = "a"` -> `evaluate("a")` -> `{"a"}`
#        `new_result_set`: `{"a"}`. `result_set` becomes `{"a"}`.
#      `comp = "{b,c}"` -> `evaluate("{b,c}")`
#        `inner_expr = "b,c"`
#        `sub_expressions = ["b", "c"]` (union)
#        `evaluate("b")` -> `{"b"}`
#        `evaluate("c")` -> `{"c"}`
#        Union: `{"b", "c"}`
#      `current_results` is `{"b", "c"}`.
#      `new_result_set`:
#        `existing_str = "a"`
#        `new_str = "b"` -> `{"ab"}`
#        `new_str = "c"` -> `{"ac"}`
#      `result_set` becomes `{"ab", "ac"}`.
#      Returns `{"ab", "ac"}`.
#
#   3. `evaluate("{ab,z}")`:
#      `inner_expr = "ab,z"`
#      `sub_expressions = ["ab", "z"]` (union)
#      `evaluate("ab")`:
#        `components = ["a", "b"]` (concatenation)
#        `result_set = {""}`
#        `comp = "a"` -> `{"a"}` -> `result_set = {"a"}`
#        `comp = "b"` -> `{"b"}`
#          `"a" + "b"` -> `{"ab"}`. `result_set` becomes `{"ab"}`.
#        Returns `{"ab"}`.
#      `evaluate("z")` -> `{"z"}`
#      Union: `{"ab", "z"}`
#
#   Now, union the results from 1, 2, and 3:
#   `{"a", "z"} U {"ab", "ac"} U {"ab", "z"}`
#   `= {"a", "z", "ab", "ac"}`
#
#   Sorted list: `["a", "ab", "ac", "z"]`. Matches example output.
#
# The logic appears sound.

class Solution:
    def braceExpansionII(self, expression: str) -> list[str]:
        # Helper function to recursively evaluate the expression.
        # It returns a set of strings representing the expanded words.
        def evaluate(expr: str) -> set[str]:
            # Base case: If the expression is a single lowercase letter,
            # it represents a set containing only that letter.
            if len(expr) == 1 and 'a' <= expr <= 'z':
                return {expr}

            # Find top-level components. These are either single letters or
            # complete brace-enclosed sub-expressions.
            # For example, in "a{b}c", the components are "a", "{b}", "c".
            # In "{a,b}{c}", the components are "{a,b}", "{c}".
            components = []
            i = 0
            while i < len(expr):
                if expr[i] == '{':
                    # Find the matching closing brace for the current opening brace.
                    brace_level = 0
                    j = i
                    while j < len(expr):
                        if expr[j] == '{':
                            brace_level += 1
                        elif expr[j] == '}':
                            brace_level -= 1
                        if brace_level == 0:
                            break
                        j += 1
                    # Add the entire brace-enclosed sub-expression as a component.
                    components.append(expr[i : j + 1])
                    i = j + 1 # Move pointer past the found component
                else:
                    # If it's not a brace, it must be a single letter (given problem constraints).
                    components.append(expr[i])
                    i += 1 # Move pointer to the next character

            # If there is more than one component, it means we have a concatenation
            # at this level of the expression.
            # Example: "a{b}c" has components ["a", "{b}", "c"].
            # We need to compute the Cartesian product of the evaluated components.
            if len(components) > 1:
                # Start with a set containing an empty string. This serves as the identity
                # element for concatenation.
                result_set = {""}
                for comp in components:
                    # Recursively evaluate each component.
                    current_results = evaluate(comp)
                    # Create a new set to store the concatenated strings.
                    new_result_set = set()
                    # For every string already in result_set, concatenate it with
                    # every string from the current component's evaluation.
                    for existing_str in result_set:
                        for new_str in current_results:
                            new_result_set.add(existing_str + new_str)
                    # Update result_set with the newly formed concatenated strings.
                    result_set = new_result_set
                return result_set

            # If there is only one component, it means the entire expression (at this level)
            # is either a single character (handled by the base case) or a single
            # brace-enclosed expression.
            component = components[0]

            # If the component starts with '{', it's a brace-enclosed expression.
            # This could represent a union (comma-separated elements like "{a,b,c}")
            # or a single complex expression within braces (like "{a{b,c}}").
            if component[0] == '{':
                # Extract the content inside the outer braces.
                inner_expr = component[1:-1]
                
                # Find sub-expressions within `inner_expr` that are separated by
                # top-level commas.
                sub_expressions = []
                brace_level = 0
                start = 0
                for i in range(len(inner_expr)):
                    if inner_expr[i] == '{':
                        brace_level += 1
                    elif inner_expr[i] == '}':
                        brace_level -= 1
                    # If we encounter a comma at the outermost brace level (level 0),
                    # it signifies a union of sub-expressions.
                    elif inner_expr[i] == ',' and brace_level == 0:
                        sub_expressions.append(inner_expr[start:i])
                        start = i + 1 # Start collecting the next sub-expression
                # Add the last sub-expression after the loop.
                sub_expressions.append(inner_expr[start:])

                # If `sub_expressions` contains more than one item, it means `inner_expr`
                # was a union of these sub-expressions.
                if len(sub_expressions) > 1:
                    union_result_set = set()
                    # Recursively evaluate each sub-expression and add its results to a union set.
                    for sub_expr in sub_expressions:
                        union_result_set.update(evaluate(sub_expr))
                    return union_result_set
                else:
                    # If there's only one sub-expression, it means the content within the braces
                    # was a single unit that needs further evaluation.
                    # Example: "{a{b,c}}" -> evaluate("a{b,c}")
                    return evaluate(sub_expressions[0])
            else:
                # If the component is not enclosed in braces, it must be a single character.
                # This case is technically handled by the initial base case, but included for clarity.
                return {component}

        # The main function calls the evaluate helper and then sorts the unique results.
        result_set = evaluate(expression)
        return sorted(list(result_set))

```