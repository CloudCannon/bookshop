export default function (Liquid) {
  this.registerTag("loop_context", {
    parse: function (token) {
			this.args = token.args;
		},
    render: function (ctx, hash) {
      const argsString = this.args.replace(' in ', ': ');
      return `<!--bookshop-live context(${argsString}[${ctx.get(['forloop','index0'])}])-->`;
    },
  });
}
