---
to: "<%= (frameworks.indexOf('Underscore') >= 0) ? `${directory}/${name}/${name}.jst.ejs` : null %>"
unless_exists: true
---
<div class="<%%= ADDMODS('c-<%= name %>', {<% for(var i=0; i<mods.length; i++) {%><%= mods[i] %>:<%= mods[i] %><% if(i < mods.length - 1){ %>,<% } %> <% } %>}) %%><%%= ADDSTATES({<% for(var i=0; i<states.length; i++) {%><%= states[i] %>:<%= states[i] %><% if(i < states.length - 1){ %>,<% } %> <% } %>}) %%>">
<% for(var i=0; i<elements.length; i++) {%>
    <div class="c-<%= name %>__<%= elements[i] %>">

    </div>
<% } %>
</div>