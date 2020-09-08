---
to: <%= directory %>/<%= name %>/<%= name %>.stories.toml
unless_exists: true
---
[defaults]
<% for(var j=0; j<mods.length; j++) {-%>
<%= mods[j] %> = false
<% } %>
<% for(var j=0; j<knobs.length; j++) {-%>
<% if (knobs[j] == 'Text') {%>text = "Hello World"<% } -%>
<% if (knobs[j] == 'Number') {%>number = 1<% } -%>
<% if (knobs[j] == 'Boolean') {%>boolean = true<% } -%>
<% if (knobs[j] == 'Color') {%>color = "#407AFC"<% } -%>
<% if (knobs[j] == 'Array') {%>array = ["a", "b", "c" , "d"]<% } -%>
<% if (knobs[j] == 'Object') {%>object = "{key: [{name: 'Hello'}, {name: 'World'}]}"<% } -%>
<% if (knobs[j] == 'Select') {%>  [<%= mods[i] %>.select]
  Big = "big"
  Small = "small"<% } %>
<% } %>

[standard]

<% for(var i=0; i<mods.length; i++) {-%>
[<%= mods[i] %>]
<% for(var j=0; j<mods.length; j++) {-%>
<% if (mods[i] == mods[j]) {-%>
<%= mods[j] %> = true
<% } -%>
<% } %>

<% } %>