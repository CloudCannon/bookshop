const TOKENS = {
  DELIM: /"|'|`/,
  ESCAPE: /\\/,
  SPACE: /\s|\r|\n/,
  INSCOPE: /\(/,
  OUTSCOPE: /\)/,
  SCOPE: /\./,
}

/**
 * Takes in an identifier string and returns a Javascript-friendly version
 * Usually, this is in the form of convering a dict to an object
 */
export class IdentifierParser {
  constructor(input) {
    this.input = input;
    this.stream = [];
    this.state = `START`;
    this.deps = {};
    this.output = this.input;
  }

  // Some short-circuits for easy to regex patterns to skip the parser
  tryShortCircuit() {
    // change an index of . to be only the index
    const indexDotFunc = /^\s*\(\s*index\s+(?:\(\s*\.\s*\)|\.)\s+(\d+)\s*\)\s*$/
    if (indexDotFunc.test(this.input)) {
      const [, index] = this.input.match(indexDotFunc);
      return `${index}`;
    }

    // change the index function into Bookshop dot notation
    const indexFunc = /^\s*\(\s*index\s+\(?\.?(.+?)\)?\s+(\d+)\s*\)\s*$/
    if (indexFunc.test(this.input)) {
      const [, variable, index] = this.input.match(indexFunc);
      return `${variable}.${index}`;
    }

    // strip the leading . from basic variable references
    if (/^\s*\./.test(this.input)) {
      return this.input.replace(/^\s*\.([^\.\s])/, '$1');
    }

    return null;
  }

  build() {
    let transformedStr = this.tryShortCircuit();
    if (transformedStr) return transformedStr;

    this.stream = this.input.split('');
    while (this.stream.length && this.state !== `BREAK`) {
      this.process(this.stream.shift());
    }
    // Flush any lingering value
    this.process(' ');

    return this.output;
  }

  process(t) {
    switch (this.state) {
      case `START`:
        return this.processSTART(t);
      case `FUNC`:
        return this.processFUNC(t);
      case `DICT_IDENT`:
        return this.processDICT_IDENT(t);
      case `DICT_VALUE`:
        return this.processDICT_VALUE(t);
      case `SLICE`:
        return this.processSLICE(t);
    }
  }

  processSTART(t) {
    if (TOKENS.SPACE.test(t)) { return };

    if (!TOKENS.INSCOPE.test(t)) {
      this.state = `BREAK`;
      return;
    };

    this.state = `FUNC`;
  }

  processFUNC(t) {
    if (TOKENS.SPACE.test(t) && !this.deps.started) { return };
    this.deps.func = this.deps.func || '';
    this.deps.started = true;

    //      ↓
    // (dict "a" "b")
    if (TOKENS.SPACE.test(t)) {
      switch (this.deps.func) {
        case "dict":
          this.state = `DICT_IDENT`;
          this.output = {};
          this.deps = {};
          return;
        case "slice":
          this.state = `SLICE`;
          this.output = [];
          this.deps = {};
          return;
        default:
          this.state = `BREAK`;
          return;
      }
    }

    //  ↓↓↓↓
    // (dict "key" "value")
    this.deps.func += t;
  }

  processDICT_IDENT(t) {
    // skip leading whitespace
    if (TOKENS.SPACE.test(t) && !this.deps.started) { return };
    this.deps.identifier = this.deps.identifier || '';
    this.deps.started = true;

    //       ↓
    // (dict "key" "value")
    if (TOKENS.DELIM.test(t) && !this.deps.delim) {
      return this.deps.delim = new RegExp(t);
    }

    if (TOKENS.OUTSCOPE.test(t)) {
      if (this.deps.identifier.length) {
        throw new Error(`Tried to parse a bad dict: ${this.input}`);
      }
      return this.state = 'BREAK';
    }

    //       ↓
    // (dict key "value")
    if (!this.deps.delim) {
      throw new Error(`Tried to parse a bad dict: ${this.input}`);
    }

    //           ↓
    // (dict "ke\"y" "value")
    if (this.deps.escape) {
      this.deps.identifier += t;
      this.deps.escape = false;
      return;
    }

    //           ↓
    // (dict "key" "value")
    if (this.deps.delim && this.deps.delim.test(t)) {
      this.state = 'DICT_VALUE';
      this.deps = { identifier: this.deps.identifier };
      return;
    }

    //          ↓
    // (dict "ke\"y" "value")
    if (TOKENS.ESCAPE.test(t)) {
      return this.deps.escape = true;
    }

    //        ↓↓↓
    // (dict "key" "value")
    this.deps.identifier += t;
    this.deps.escape = false;
  }

  processDICT_VALUE(t) {
    // skip leading whitespace
    if (TOKENS.SPACE.test(t) && !this.deps.started) { return };
    this.deps.value = this.deps.value || '';
    this.deps.started = true;

    //                 ↓
    // (dict "key" "va\"lue")
    if (this.deps.escape) {
      this.deps.value += t;
      this.deps.escape = false;
      return;
    }

    //                ↓
    // (dict "key" "va\"lue")
    if (TOKENS.ESCAPE.test(t)) {
      this.deps.escape = true;
      return;
    }

    //             ↓↓↓↓↓↓↓
    // (dict "key" "value")
    this.deps.value += t;

    if (!this.deps.delim) {
      //             ↓
      // (dict "key" "value")
      if (TOKENS.DELIM.test(t)) {
        return this.deps.delim = new RegExp(t);
      }
      //             ↓
      // (dict "key" (slice 1 2 3))
      if (TOKENS.INSCOPE.test(t)) {
        return this.deps.delim = TOKENS.OUTSCOPE;
      }

      this.deps.delim = TOKENS.SPACE

      //             ↓
      // (dict "key" .variable)
      if (!TOKENS.SPACE.test(t)) {
        return;
      }
    }

    //                         ↓
    // (dict "key" (slice 1 2 3))
    if (this.deps.delimDepth && this.deps.delim.test(t)) {
      return this.deps.delimDepth -= 1;
    }

    //                 ↓
    // (dict "key" .var)
    if (!this.deps.delimDepth && this.deps.delim !== TOKENS.OUTSCOPE && TOKENS.OUTSCOPE.test(t)) {
      if (this.deps.delim !== TOKENS.OUTSCOPE) this.deps.value = this.deps.value.replace(/.$/, '');
      this.output[this.deps.identifier] = (new IdentifierParser(this.deps.value)).build();
      this.state = 'BREAK';
      this.deps = {};
      return;
    }

    //                 ↓                ↓
    // (dict "key" .var "key2" (len .arr))
    if (this.deps.delim.test(t)) {
      if (this.deps.delim === TOKENS.SPACE) this.deps.value = this.deps.value.replace(/.$/, '');
      this.output[this.deps.identifier] = (new IdentifierParser(this.deps.value)).build();
      this.state = 'DICT_IDENT';
      this.deps = {};
      return;
    }

    // Handed nested parentheses
    //             ↓
    // (dict "key" (slice 1 2 3))
    if (this.deps.delim === TOKENS.OUTSCOPE && TOKENS.INSCOPE.test(t)) {
      this.deps.delimDepth = this.deps.delimDepth || 0;
      this.deps.delimDepth += 1;
    }
  }

  processSLICE(t) {
    // skip leading whitespace
    if (TOKENS.SPACE.test(t) && !this.deps.started) { return };
    this.deps.value = this.deps.value || '';
    this.deps.started = true;

    //                    ↓
    // (slice "value" "va\"lue")
    if (this.deps.escape) {
      this.deps.value += t;
      this.deps.escape = false;
      return;
    }

    //                   ↓
    // (slice "value" "va\"lue")
    if (TOKENS.ESCAPE.test(t)) {
      this.deps.escape = true;
      return;
    }

    //        ↓↓↓↓↓↓↓ ↓↓↓↓↓↓
    // (slice "value" .value)
    this.deps.value += t;

    if (!this.deps.delim) {
      //        ↓
      // (slice "value")
      if (TOKENS.DELIM.test(t)) {
        return this.deps.delim = new RegExp(t);
      }
      //                ↓
      // (slice "value" (slice 1 2 3))
      if (TOKENS.INSCOPE.test(t)) {
        return this.deps.delim = TOKENS.OUTSCOPE;
      }

      this.deps.delim = TOKENS.SPACE

      //                ↓
      // (slice "value" .variable)
      if (!TOKENS.SPACE.test(t)) {
        return;
      }
    }

    //                            ↓
    // (slice "value" (slice 1 2 3))
    if (this.deps.delimDepth && this.deps.delim.test(t)) {
      return this.deps.delimDepth -= 1;
    }

    //                    ↓
    // (slice "value" .var)
    if (!this.deps.delimDepth && TOKENS.OUTSCOPE.test(t)) {
      this.deps.value = this.deps.value.replace(/.$/, '')
      this.output.push((new IdentifierParser(this.deps.value)).build());
      this.state = 'BREAK';
      this.deps = {};
      return;
    }

    //              ↓      ↓
    // (slice "value" .val2 3)
    if (this.deps.delim.test(t)) {
      if (this.deps.delim === TOKENS.SPACE) this.deps.value = this.deps.value.replace(/.$/, '');
      this.output.push((new IdentifierParser(this.deps.value)).build());
      this.deps = {};
      return;
    }

    // Handed nested parentheses
    //                ↓
    // (slice "value" (slice 1 2 3))
    if (this.deps.delim === TOKENS.OUTSCOPE && TOKENS.INSCOPE.test(t)) {
      this.deps.delimDepth = this.deps.delimDepth || 0;
      this.deps.delimDepth += 1;
    }
  }
}