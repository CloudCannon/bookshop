---
to: <%= directory %>/<%= name %>/<%= name %>.stories.toml
unless_exists: true
---
[meta]
_hidden = false
array_structures = []
label = "<%= name %>"
description = "<%= name %> description"
icon = "fiber_new"
tags = ["uncategorized"]

[defaults]
<% for(var j=0; j<mods.length; j++) {-%>
<%= mods[j] %> = false
<% } %><% for(var j=0; j<states.length; j++) {-%>
<%= states[j] %> = false
<% } %><% for(var j=0; j<knobs.length; j++) {-%>
<% if (knobs[j] == 'Text') {%>text = "Hello World"<% } -%>
<% if (knobs[j] == 'Number') {%>number = 1<% } -%>
<% if (knobs[j] == 'Boolean') {%>boolean = true<% } -%>
<% if (knobs[j] == 'Color') {%>color = "#407AFC"<% } -%>
<% if (knobs[j] == 'Array') {%>array = ["a", "b", "c" , "d"]<% } -%>
<% if (knobs[j] == 'Object') {%>[defaults.object]
A = "a"
B = "b"<% } %><% if (knobs[j] == 'Repeat') {%>[defaults.object--repeat]
A = "a"
B = "b"<% } %><% if (knobs[j] == 'Select') {%>[defaults.object--select]
A = "a"
B = "b"<% } %>
<% } %>
[standard]

<% for(var i=0; i<mods.length; i++) {-%>
[<%= mods[i] %>]
<% for(var j=0; j<mods.length; j++) {-%>
<% if (mods[i] == mods[j]) {-%>
<%= mods[j] %> = true
<% } -%><% } %>

<% } %><% for(var i=0; i<states.length; i++) {-%>
[<%= states[i] %>]
<% for(var j=0; j<states.length; j++) {-%>
<% if (states[i] == states[j]) {-%>
<%= states[j] %> = true
<% } -%>
<% } %>

<% } %>