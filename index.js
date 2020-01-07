console.clear();
// We need to create algorithm that will check if string is "balanced" or not
// string can be considered balanced if all open "tags", which open new "context"
// have closing "tag" in correct place. Case with 0 opened/closed tags considered
// "balanced" as well

// EXTRA
// - create API to generalize open/closed tags
// - parallelize all the things :)

// Test Cases
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

// Let's think what properties balanced string have
// 1. they are simmetrical in some way
// For example, if we take this string

// ((( [] {} )))
// then slice it in the middle, we will have two strings
// ((( []                             and  {} )))
// left one will have 3 open and      right one will have closed curly context
// closed square context              and 3 closing round brackets
// stack size: 3 + 0                  stake size: 0 + 3

// ((( [] {} )))
// then slice it in the 3rd character, we will have two strings
// (((                            and [] {} )))
// left one will have 3 open      right one will have closed curly and square context
// round context                  and 3 closing round brackets
// stack size: 3                  stack size: 0 + 0 + 3

// let's start with method, which will go one character at a time and simply collect number
// of open contexts

const accumulateStack = (input, trackers) => {
  const { isOpen, isClosing, isOpposite } = trackers;
  let stack = [];

  const inputLength = input.length;
  for (let i = 0; i < inputLength; i++) {
    const cursor = input[i];
    if (isOpen(cursor)) {
      stack.unshift(cursor);
      continue;
    }

    if (isClosing(cursor)) {
      const lastContext = stack[0];
      if (isOpposite(cursor, lastContext)) {
        stack.shift();
      } else {
        stack.unshift(cursor);
      }
    }
  }

  return stack;
};

const roundTrackers = {
  isOpen: chr => chr === "(",
  isClosing: chr => chr === ")",
  isOpposite: (chr, target) => {
    if (chr === "(") return target === ")";
    if (chr === ")") return target === "(";
    return false;
  }
};

console.log("Check simple cases");
const case1 = accumulateStack(simpleValid_1, roundTrackers);
const case2 = accumulateStack(simpleInvalid_1, roundTrackers);
const case3 = accumulateStack(simpleInvalid_2, roundTrackers);
console.log(case1);
console.log(case2);
console.log(case3);

const roundAndSquareTrackers = {
  isOpen: chr => "([".includes(chr),
  isClosing: chr => "])".includes(chr),
  isOpposite: (chr, target) => {
    switch (true) {
      case chr === "(":
        return target === ")";
      case chr === ")":
        return target === "(";
      case chr === "[":
        return target === "]";
      case chr === "]":
        return target === "[";
      default:
        return null;
    }
  }
};

console.log("Slightly more complex");
const case4 = accumulateStack(roundAndSquareValid_1, roundAndSquareTrackers);
const case5 = accumulateStack(roundAndSquareInvalid_1, roundAndSquareTrackers);
console.log(case4);
console.log(case5);

const case6 = accumulateStack(valid_2, roundAndSquareTrackers);
console.log(case6);

const splitInput = input => {
  const midPoint = Math.ceil(input.length / 2);
  const left = input.slice(0, midPoint);
  const right = input.slice(midPoint);
  return { left, right };
};

// Create method that will compare two parts of the string
const compareParts = (leftStack, rightStack, trackers) => {
  // If stacks are of different size - then it's not balanced
  // Since more context were open or closed
  console.log("Compare stacks", leftStack, rightStack);
  if (leftStack.length !== rightStack.length) {
    return false;
  }

  const { length } = leftStack;
  for (let i = 0; i < length; i++) {}

  const { isOpposite } = trackers;
  return false;
};

// Now let's start with "serial" solution
const isBalanced = (input, trackers) => {
  const { left, right } = splitInput(input);

  // here we will be able to parallelize process in the future
  const leftStack = accumulateStack(left, trackers);
  const rightStack = accumulateStack(right, trackers);

  return compareParts(leftStack, rightStack, trackers);
};

console.clear();
console.log("Check our splitting method");
const checkBalanced1 = isBalanced(")(()))", roundTrackers);
console.log(checkBalanced1.toString());

// Food for thought for more optimization/parallelization:
//
// 1) I belive it's possible to async iteration over stacks inside of "compareParts" method
// 2) Split string into more pieces (multiple of 2) - 4, 8
// 3) Method can be refactored to be used for arrays instead of strings,
//   thus allowing more complex cases, i.e. HTML tags

// Before publishing method as a library, it's probably would be bettter to go through
// "pre-flight" checklist below:
//
// 1) add thorough tests for edge cases
// 2) add input validation. currently method will throw an error, if input is not a string
// 3) create documentation for method
// 3) prepare at least basic examples, showing intended use case
