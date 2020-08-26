---
to: "<%= (frameworks.indexOf('Jekyll') >= 0) ? `components/${name}/${name}.jekyll.html` : null %>"
unless_exists: true
---
<div class="{{ 'c-<%= name %>' | addmods: <% for(var i=0; i<mods.length; i++) {%><%= mods[i] %>:include.<%= mods[i] %><% if(i < mods.length - 1){ %>,<% } %> <% } %>}}">
<% for(var i=0; i<elements.length; i++) {%>
    <div class="c-<%= name %>__<%= elements[i] %>">

    </div>
<% } %>
</div>