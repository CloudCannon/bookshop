<div>
{% for block in content_blocks %}
    {% comment %} 
        # The bind parameter here passes the inner fields of block to the component.
        # Imagine it like the ...spread operator in JavaScript.
    {% endcomment %}
    {% bookshop "{{block._bookshop_name}}" bind: block %}
{% endfor %}
</div>
