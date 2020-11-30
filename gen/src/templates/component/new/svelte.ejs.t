---
to: "<%= (frameworks.indexOf('Svelte') >= 0) ? `${directory}/${name}/${name}.svelte` : null %>"
unless_exists: true
---
<script>
<% for(var i=0; i<mods.length; i++) {%>
	export let {<%= mods[i] %>}<% } %>
<% for(var i=0; i<states.length; i++) {%>
	export let {<%= states[i] %>}<% } %>
</script>

<div class="c-<%= name %>" <% for(var i=0; i<mods.length; i++) {%>
	c-<%= name %>--<%= mods[i] %>={<%= mods[i] %>}<% } %>
	<% for(var i=0; i<states.length; i++) {%>
	is--<%= states[i] %>={<%= states[i] %>}<% } %>>

<% for(var i=0; i<elements.length; i++) {%>
    <div class="c-<%= name %>__<%= elements[i] %>">

    </div>
<% } %>
</div>
