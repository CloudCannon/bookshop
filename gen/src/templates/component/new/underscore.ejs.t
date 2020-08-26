---
to: components/<%= name %>/<%= name %>.jst.ejs
unless_exists: true
---
<div class="<%%= ADDMODS('c-<%= name %>', {<% for(var i=0; i<mods.length; i++) {%><%= mods[i] %>:<%= mods[i] %><% if(i < mods.length - 1){ %>,<% } %> <% } %>}) %%>">
<% for(var i=0; i<elements.length; i++) {%>
    <div class="c-<%= name %>__<%= elements[i] %>">

    </div>
<% } %>
</div>