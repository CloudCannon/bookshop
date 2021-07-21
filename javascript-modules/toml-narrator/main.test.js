const {RewriteTOML} = require('./main');

test("should do nothing if nothing needs to be done", () => {
  bookshop_toml = f`
  a = "b"
  `
  expected_toml = f`
  a = "b"
  `
  expect(RewriteTOML(bookshop_toml)).toBe(expected_toml);
});

test("should rewrite a plain comment", () => {
  bookshop_toml = f`
  blog = false #: Comment on a boolean
  `
  expected_toml = f`
  blog--bookshop_comment = "Comment on a boolean"
  blog = false #: Comment on a boolean
  `
  expect(RewriteTOML(bookshop_toml)).toBe(expected_toml);
});

test("should rewrite a string comment", () => {
  bookshop_toml = f`
  blog = "Blog Title" #: Comment on a string
  `
  expected_toml = f`
  blog--bookshop_comment = "Comment on a string"
  blog = "Blog Title" #: Comment on a string
  `
  expect(RewriteTOML(bookshop_toml)).toBe(expected_toml);
});

test("should rewrite a nested comment", () => {
  bookshop_toml = f`
  blog.title = "Blog Title" #: Nested comment
  `
  expected_toml = f`
  blog.title--bookshop_comment = "Nested comment"
  blog.title = "Blog Title" #: Nested comment
  `
  expect(RewriteTOML(bookshop_toml)).toBe(expected_toml);
});

test("should not rewrite a non-comment hashtag", () => {
  bookshop_toml = f`
  color = "#407AFC"
  `
  expected_toml = f`
  color = "#407AFC"
  `
  expect(RewriteTOML(bookshop_toml)).toBe(expected_toml);
});

test("should pick up a second hashtag after a non-comment hashtag", () => {
  bookshop_toml = f`
  color = "#407AFC" #: Color comment
  `
  expected_toml = f`
  color--bookshop_comment = "Color comment"
  color = "#407AFC" #: Color comment
  `
  expect(RewriteTOML(bookshop_toml)).toBe(expected_toml);
});

test("should rewrite a commented array", () => {
  bookshop_toml = f`
  links = ["a", "b"] #: Array Comment
  `
  expected_toml = f`
  links--bookshop_comment = "Array Comment"
  links = ["a", "b"] #: Array Comment
  `
  expect(RewriteTOML(bookshop_toml)).toBe(expected_toml);
});

test("should rewrite an object heading", () => {
  bookshop_toml = f`
  [thing.inner] #: Hello from a heading
  `
  expected_toml = f`
  [thing.inner] #: Hello from a heading
  --bookshop_comment = "Hello from a heading"
  `
  expect(RewriteTOML(bookshop_toml)).toBe(expected_toml);
});

test("should rewrite an array heading", () => {
  bookshop_toml = f`
  [[thing.inner]] #: Hello from an array heading
  `
  expected_toml = f`
  [[thing.inner]] #: Hello from an array heading
  --bookshop_comment = "Hello from an array heading"
  `
  expect(RewriteTOML(bookshop_toml)).toBe(expected_toml);
});
