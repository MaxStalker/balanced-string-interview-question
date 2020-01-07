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

module.exports ={
  roundTrackers,
  roundAndSquareTrackers
};
