import icons from '__filled_material_icons__';

export const iconSvg = (name) => {
    const svgStr = '<svg style="font-size: inherit;height: 1em;"';
    if (!icons[name]) return icons["check_box_outline_blank"]?.replace(/^<svg/, svgStr);
    return icons[name].replace(/^<svg/, svgStr);
}
