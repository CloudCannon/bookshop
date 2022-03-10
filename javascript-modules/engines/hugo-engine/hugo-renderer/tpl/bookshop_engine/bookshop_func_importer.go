package engine

import (
	_ "hugo-renderer/tpl/cast"
	_ "hugo-renderer/tpl/collections" // ———————————— 🥴 TODO: `apply` NYI, relies on tpl.TemplateHandler & co. Reimplement based on bookshop_render -> createFuncMap
	_ "hugo-renderer/tpl/compare"
	_ "hugo-renderer/tpl/crypto"

	// _ "hugo-renderer/tpl/data" // ———————————————— ⏭️ NTBI: Networking / FS / Resources
	_ "hugo-renderer/tpl/debug"
	_ "hugo-renderer/tpl/encoding"
	_ "hugo-renderer/tpl/fmt"

	// _ "hugo-renderer/tpl/hugo" // ———————————————— ❗ TODO: Should this be stubbed out ??
	// _ "hugo-renderer/tpl/images" // —————————————— ❗ TODO: Should this be mocked ??
	_ "hugo-renderer/tpl/inflect"
	// _ "hugo-renderer/tpl/js" // —————————————————— ⏭️ NTBI: Shouldn't be done inside a component
	// _ "hugo-renderer/tpl/lang" // ———————————————— ❗ TODO: Not sure how this would interact in the Bookshop environment
	_ "hugo-renderer/tpl/math"
	// _ "hugo-renderer/tpl/openapi/openapi3" // ———— ❗ TODO: Maybe a rabbit hole
	// _ "hugo-renderer/tpl/os" // —————————————————— ⏭️ NTBI: We don't have an OS
	_ "hugo-renderer/tpl/partials" // ——————————————— ❗ TODO: Return partials / use bookshop module partials
	_ "hugo-renderer/tpl/path"
	_ "hugo-renderer/tpl/reflect"

	// _ "hugo-renderer/tpl/resources" // ——————————— ⏭️ NTBI: Bookshop components won't support resources
	_ "hugo-renderer/tpl/safe"    // ———————————————— 🥴 TODO: `SanitizeURL` NYI — helpers require is too large
	_ "hugo-renderer/tpl/site"    // ———————————————— 🥴 TODO: Partially stubbing out site variables. WIP
	_ "hugo-renderer/tpl/strings" // ———————————————— 🥴 TODO: Only the "Go" title formatting is supported

	// _ "hugo-renderer/tpl/templates" // ——————————— ❗ TODO: Maybe a rabbit hole
	// _ "hugo-renderer/tpl/time" // ———————————————— ❗ TODO: This relies on lang stuff that is thus far excluded
	_ "hugo-renderer/tpl/transform" // —————————————— 🥴 TODO: Highlight, unmarshal, commonmark compat
	// _ "hugo-renderer/tpl/urls" // ———————————————— ❗ TODO: Relies on pathspec that relies on FS impls
)
