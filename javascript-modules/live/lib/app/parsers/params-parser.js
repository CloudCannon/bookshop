const TOKENS = {
  ASSIGN: /:|=/,
  DELIM: /"|'|`/,
  ESCAPE: /\\/,
  SPACE: /\s|\r|\n/,
  INSCOPE: /\(/,
  OUTSCOPE: /\)/,
  INDEX: /\[/,
  OUTDEX: /\]/,
}

/**
 * Takes in a param string and returns an array of [identifier: value] pairs
 */
export class ParamsParser {
  constructor(input) {
    this.input = input;
    this.stream = input.split('');
    this.state = `IDENT`;
    this.deps = {};
    this.output = [];
  }

  build() {
    while (this.stream.length) {
      this.process(this.stream.shift());
    }
    // Flush any lingering value
    this.process(' ');

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

    if (TOKENS.ASSIGN.test(t) && !this.deps.escape) {
      //      ↓
      // title: page.title

      if (!this.deps.identifier) { throw new Error("No identifier provided"); }
      this.state = 'VALUE';
      this.deps = { identifier: this.deps.identifier };
      return;
    }

    if (TOKENS.ESCAPE.test(t) && !this.deps.escape) {
      //   ↓  
      // ti\:tle: page.title
      return this.deps.escape = true;
    }

    // ↓↓↓↓↓  
    // title: page.title
    this.deps.identifier += t;
    this.deps.escape = false;
  }

  processVALUE(t) {
    // skip leading whitespace
    if (TOKENS.SPACE.test(t) && !this.deps.started) { return };
    this.deps.value = this.deps.value || '';
    this.deps.started = true;

    //                ↓  
    // title: "Hello \"World"
    if (this.deps.escape) {
      this.deps.value += t;
      this.deps.escape = false;
      return;
    }

    if (TOKENS.ESCAPE.test(t)) {
      //               ↓  
      // title: "Hello \"World"
      this.deps.escape = true;
      return;
    }

    this.deps.value += t;

    if (!this.deps.delim) {
      //        ↓  
      // title: "Hello World"
      if (TOKENS.DELIM.test(t)) {
        return this.deps.delim = new RegExp(t);
      }
      //        ↓  
      // title: (dict "a" "b")
      if (TOKENS.INSCOPE.test(t)) {
        return this.deps.delim = TOKENS.OUTSCOPE;
      }
      //              ↓  
      // title: (0..4)[1]
      if (TOKENS.INDEX.test(t)) {
        return this.deps.delim = TOKENS.OUTDEX;
      }

      this.deps.delim = TOKENS.SPACE

      //        ↓  
      // title: variable
      if (!TOKENS.SPACE.test(t)) {
        return;
      }
    }

    //                               ↓  
    // title: ( dict "a" (slice 1 2 3) ) 
    if (this.deps.delimDepth && this.deps.delim.test(t)) {
      return this.deps.delimDepth -= 1;
    }


    //                     ↓  
    // title: "Hello World" 
    if (this.deps.delim === TOKENS.SPACE && this.deps.delim.test(t)) {
      this.deps.value = this.deps.value.replace(/.$/, '')
      // Remove redundant parenthesis
      this.deps.value = this.deps.value.replace(/^\(\(+(.+)\)+\)$/, "($1)");
      this.deps.value = this.deps.value.replace(/^\((\S+)\)$/, "$1");

      this.output.push([this.deps.identifier, this.deps.value]);
      this.state = 'IDENT';
      this.deps = {};
      return;
    }

    //                    ↓              ↓  ↓
    // title: "Hello World" number: (0..4)[2]
    if (this.deps.delim.test(t)) {
      this.deps.delim = null;
      return;
    }

    // Handed nested parenthesis in Hugo dicts
    //                   ↓  
    // title: ( dict "a" (slice 1 2 3) ) 
    if (this.deps.delim === TOKENS.OUTSCOPE && TOKENS.INSCOPE.test(t)) {
      this.deps.delimDepth = this.deps.delimDepth || 0;
      this.deps.delimDepth += 1;
    }
  }
}