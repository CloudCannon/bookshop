[module]
hugoVersion.extended = true
hugoVersion.min = "0.86.1"

[[module.mounts]]
source = "."
target = "layouts/partials/bookshop"
includeFiles = ["**/*.hugo.html"]

[[module.mounts]]
source = "."
target = "assets/bookshop"
