const test = require('ava');
const {f} = require('./util/_test-helpers');
const {RewriteTOML} = require('./main');

test("should do nothing if nothing needs to be done", t => {
  bookshop_toml = f`
  a = "b"
  `
  expected_toml = f`
  a = "b"
  `
  t.is(RewriteTOML(bookshop_toml), expected_toml);
});

test("should rewrite a plain comment", t => {
  bookshop_toml = f`
  blog = false #: Comment on a boolean
  `
  expected_toml = f`
  blog--bookshop_comment = "Comment on a boolean"
  blog = false #: Comment on a boolean
  `
  t.is(RewriteTOML(bookshop_toml), expected_toml);
});

test("should rewrite a string comment", t => {
  bookshop_toml = f`
  blog = "Blog Title" #: Comment on a string
  `
  expected_toml = f`
  blog--bookshop_comment = "Comment on a string"
  blog = "Blog Title" #: Comment on a string
  `
  t.is(RewriteTOML(bookshop_toml), expected_toml);
});

test("should rewrite a nested comment", t => {
  bookshop_toml = f`
  blog.title = "Blog Title" #: Nested comment
  `
  expected_toml = f`
  blog.title--bookshop_comment = "Nested comment"
  blog.title = "Blog Title" #: Nested comment
  `
  t.is(RewriteTOML(bookshop_toml), expected_toml);
});

test("should not rewrite a non-comment hashtag", t => {
  bookshop_toml = f`
  color = "#407AFC"
  `
  expected_toml = f`
  color = "#407AFC"
  `
  t.is(RewriteTOML(bookshop_toml), expected_toml);
});

test("should escape double quotes inside the comment", t => {
  bookshop_toml = f`
  title = "Hello World" #: A "simple" title
  `
  expected_toml = f`
  title--bookshop_comment = "A \"simple\" title"
  title = "Hello World" #: A "simple" title
  `
  t.is(RewriteTOML(bookshop_toml), expected_toml);
});

test("should pick up a second hashtag after a non-comment hashtag", t => {
  bookshop_toml = f`
  color = "#407AFC" #: Color comment
  `
  expected_toml = f`
  color--bookshop_comment = "Color comment"
  color = "#407AFC" #: Color comment
  `
  t.is(RewriteTOML(bookshop_toml), expected_toml);
});

test("should rewrite a commented array", t => {
  bookshop_toml = f`
  links = ["a", "b"] #: Array Comment
  `
  expected_toml = f`
  links--bookshop_comment = "Array Comment"
  links = ["a", "b"] #: Array Comment
  `
  t.is(RewriteTOML(bookshop_toml), expected_toml);
});

test("should rewrite an object heading", t => {
  bookshop_toml = f`
  [thing.inner] #: Hello from a heading
  `
  expected_toml = f`
  [thing.inner] #: Hello from a heading
  --bookshop_comment = "Hello from a heading"
  `
  t.is(RewriteTOML(bookshop_toml), expected_toml);
});

test("should rewrite an array heading", t => {
  bookshop_toml = f`
  [[thing.inner]] #: Hello from an array heading
  `
  expected_toml = f`
  [[thing.inner]] #: Hello from an array heading
  --bookshop_comment = "Hello from an array heading"
  `
  t.is(RewriteTOML(bookshop_toml), expected_toml);
});
