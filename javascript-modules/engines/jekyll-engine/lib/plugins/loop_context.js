export default function (Liquid) {
  this.registerTag("loop_context", {
    parse: function (token) {
			this.args = token.args;
		},
    render: function (ctx, hash) {
      const argsString = this.args.replace(/\binclude\./g, '').replace(/\s+in\s+/, '=').split(' ')[0];
      return `<!--bookshop-live context(${argsString}[${ctx.get(['forloop','index0'])}])-->`;
    },
  });
}
