export default function ($) {
    const markdownContainer = $('div.theme-doc-markdown.markdown');
    markdownContainer.find('.theme-admonition, header').remove();
    return markdownContainer;
}
