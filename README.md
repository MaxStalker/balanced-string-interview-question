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
