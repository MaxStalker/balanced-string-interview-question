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

const stackAccumulator = (input, trackers) => {
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

console.log("Check simple cases");
const case1 = stackAccumulator(simpleValid_1, roundTrackers);
const case2 = stackAccumulator(simpleInvalid_1, roundTrackers);
const case3 = stackAccumulator(simpleInvalid_2, roundTrackers);
console.log(case1);
console.log(case2);
console.log(case3);

console.log("Slightly more complex");
const case4 = stackAccumulator(roundAndSquareValid_1, roundAndSquareTrackers);
const case5 = stackAccumulator(roundAndSquareInvalid_1, roundAndSquareTrackers);
console.log(case4);
console.log(case5);

const case6 = stackAccumulator(valid_2, roundAndSquareTrackers);
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
  if (leftStack.length !== rightStack.length) {
    return false;
  }

  const { isOpposite } = trackers;
  const reversedRight = rightStack.reverse();
  const { length } = leftStack;

  for (let i = 0; i < length; i++) {
    const leftCursor = leftStack[i];
    const rightCursor = reversedRight[i];
    if (!isOpposite(leftCursor, rightCursor)) {
      return false;
    }
  }
  return true;
};

// Now let's start with "serial" solution
const isBalanced = (input, trackers) => {
  const { left, right } = splitInput(input);

  // here we will be able to parallelize process in the future
  const leftStack = stackAccumulator(left, trackers);
  const rightStack = stackAccumulator(right, trackers);

  return compareParts(leftStack, rightStack, trackers);
};

console.log("\n");
console.log("Check our splitting method");

const testMethod1 = "((()))";
console.log(`Checking:, "${testMethod1}"`);
const checkBalanced1 = isBalanced(testMethod1, roundTrackers);
console.log(checkBalanced1.toString());
console.log("\n");

const testMethod2 = "()()()()";
console.log(`Checking:, "${testMethod2}"`);
const checkBalanced2 = isBalanced(testMethod2, roundTrackers);
console.log(checkBalanced2.toString());
console.log("\n");

const testMethod3 = "[(])";
console.log(`Checking:, "${testMethod3}"`);
const checkBalanced3 = isBalanced(testMethod3, roundAndSquareTrackers);
console.log(checkBalanced3.toString());
console.log("\n");

const asyncStackAccumulator = async (input, trackers) => {
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
  return Promise.resolve(stack);
};

// Let's make "parallel" solution now
const asyncIsBalanced = async (input, trackers, delay) => {
  const { left, right } = splitInput(input);
  const [leftStack, rightStack] = await Promise.all([
    asyncStackAccumulator(left, trackers),
    asyncStackAccumulator(right, trackers)
  ]);
  return new Promise(resolve => {
    const result = compareParts(leftStack, rightStack, trackers);
    setTimeout(() => {
      resolve(result);
    }, delay);
  });
};


const runHelper = async (input, trackers, delay = 0) => {
  const result_2 = await asyncIsBalanced(input, trackers, delay);
  console.log(`Async Result: for "${input}" ->  ${result_2.toString()}`);
};

// Check async method
const runAsync = async () => {
  runHelper("Case 1: )))) lots of closing", roundAndSquareTrackers, 30);
  runHelper("Case 2: ()() valid string", roundAndSquareTrackers, 5);
  runHelper(
    "Case 3: longer string which occasionally have have () and [] brackets" +
      " here and there!",
    roundAndSquareTrackers
  );
  runHelper("Case 4: ()() valid string", roundAndSquareTrackers, 5);
};

runAsync();

// Food for thought for more optimization/parallelization:
//
// 1) I believe it's possible to async iteration over stacks inside of
// "compareParts" method
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
