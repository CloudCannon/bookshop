---
to: "<%= (frameworks.indexOf('Svelte') >= 0) ? `${directory}/${name}/${name}.svelte` : null %>"
unless_exists: true
---
<script>
<% for(var i=0; i<mods.length; i++) {%>
	export let <%= mods[i] %><% } %>
<% for(var i=0; i<states.length; i++) {%>
	export let <%= states[i] %><% } %>

	const c = "c-<%= name %>";
	const component_class = () => {
		const classes = [c];<% for(var i=0; i<mods.length; i++) {%>
		if (<%= mods[i] %>) classes.push(`${c}--<%= mods[i] %>`);
		<% } %><% for(var i=0; i<states.length; i++) {%>
		if (<%= states[i] %>) classes.push(`is-<%= states[i] %>`);
		<% } %>
		return classes.join(' ');
	}
</script>

<div class={component_class()}>
<% for(var i=0; i<elements.length; i++) {%>
    <div class="{c}__<%= elements[i] %>">

    </div>
<% } %>
</div>
