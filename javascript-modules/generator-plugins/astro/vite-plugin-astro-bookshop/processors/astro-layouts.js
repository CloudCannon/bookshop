export default (src) => {
  src = src.replace(
    /const Astro2.*$/m,
    `$&
		if(Astro2.props.frontmatter){ __processFrontmatter(Astro2.props.frontmatter);}
		else if(Astro2.props){ __processFrontmatter(Astro2.props);}`
  );
  return `import {processFrontmatter as __processFrontmatter} from '@bookshop/astro-bookshop/helpers/frontmatter-helper.js';\n${src}`;
};
