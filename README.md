## "Balanced" Strings

### Description

We need to create algorithm that will check if string is "balanced" or not
string can be considered balanced if all open "tags", which open new "context"
have closing "tag" in correct place. Case with 0 opened/closed tags considered
"balanced" as well

### Extra Tasks
    - create API to generalize open/closed tags
    - parallelize all the things :)

### Examples

```
// TRUTHY
const valid_1 = "[({( || () () [] )})]";
const valid_2 = "brackets never open";

const simpleValid_1 = "(())";
const roundAndSquareValid_1 = "[([])]";

// FALSY
const false_1 = "(( just two open";
const false_2 = "single closing tag here )";
const false_3 = "[( wrong order ])";

const simpleInvalid_1 = "(() helllo (";
const simpleInvalid_2 = ")))) lots of closing";
const roundAndSquareInvalid_1 = "[(])";
```

### Food for thought

    1. I believe it's possible to async iteration over stacks inside of "compareParts" method
    2. Split string into more pieces (multiple of 2) - 4, 8
    3. Method can be refactored to be used for arrays instead of strings,
       thus allowing more complex cases, i.e. HTML tags

Before publishing method as a library, it's probably would be bettter to go through
"pre-flight" checklist below:

    1. add thorough tests for edge cases
    2. add input validation. currently method will throw an error, if input is not a string
    3. create documentation for method
    4. prepare at least basic examples, showing intended use case
