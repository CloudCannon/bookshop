const TOKENS = {
  ESCAPE: /\\/,
  SPACE: /\s|\r|\n/,
  INSCOPE: /\(/,
  OUTSCOPE: /\)/,
  END: /END/,
}

/**
 * Takes in a comment string and returns an object of named groups
 */
export class CommentParser {
  constructor(input) {
    this.input = input;
    this.stream = input.split('');
    this.state = `IDENT`;
    this.deps = {};
    this.output = {};
  }

  build() {
    while (this.stream.length) {
      this.process(this.stream.shift());
    }
    // Flush any lingering value
    this.process('END');

    return this.output;
  }

  process(t) {
    switch (this.state) {
      case `IDENT`:
        return this.processIDENT(t);
      case `VALUE`:
        return this.processVALUE(t);
    }
  }

  processIDENT(t) {
    // skip leading whitespace
    if (TOKENS.SPACE.test(t) && !this.deps.started) { return };
    this.deps.identifier = this.deps.identifier || '';
    this.deps.started = true;

    //    ↓  
    // end
    if (TOKENS.END.test(t)) {
      if (this.deps.identifier) {
        this.output[this.deps.identifier] = true;
      }
      return;
    }

    //     ↓  
    // name(title)
    if (TOKENS.INSCOPE.test(t) && !this.deps.escape) {
      if (!this.deps.identifier) { throw new Error("No identifier provided"); }
      this.state = 'VALUE';
      this.deps = { identifier: this.deps.identifier }
      return;
    }

    if (TOKENS.ESCAPE.test(t) && !this.deps.escape) {
      //   ↓  
      // na\(me(title)
      return this.deps.escape = true;
    }

    // ↓↓↓↓  
    // name(title)
    this.deps.identifier += t;
    this.deps.escape = false;
  }

  processVALUE(t) {
    // skip leading whitespace
    if (TOKENS.SPACE.test(t) && !this.deps.started) { return };
    this.deps.value = this.deps.value || '';
    this.deps.started = true;

    //         ↓  
    // name(ti\(tle)
    if (this.deps.escape) {
      this.deps.value += t;
      this.deps.escape = false;
      return;
    }

    //           ↓  
    // name(title)
    if (TOKENS.OUTSCOPE.test(t) && !this.deps.delimDepth) {
      this.output[this.deps.identifier] = this.deps.value;
      this.state = 'IDENT';
      this.deps = {};
      return;
    }

    //        ↓  
    // name(ti\(tle)
    if (TOKENS.ESCAPE.test(t)) {
      this.deps.escape = true;
      return;
    }

    //      ↓↓↓↓↓  
    // name(title)
    this.deps.value += t;

    //        ↓  
    // name(ti(t)le)
    if (TOKENS.INSCOPE.test(t)) {
      this.deps.delimDepth = this.deps.delimDepth || 0;
      this.deps.delimDepth += 1;
    }

    //          ↓  
    // name(ti(t)le)
    if (TOKENS.OUTSCOPE.test(t) && this.deps.delimDepth) {
      this.deps.delimDepth -= 1;
    }
  }
}