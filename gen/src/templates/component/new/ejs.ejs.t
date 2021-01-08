---
to: "<%= (frameworks.indexOf('EJS') >= 0) ? `${directory}/${name}/${name}.ejs` : null %>"
unless_exists: true
---
<div class="c-<%= name %>">
<% for(var i=0; i<elements.length; i++) {%>
    <div class="c-<%= name %>__<%= elements[i] %>">

    </div>
<% } %>
</div>