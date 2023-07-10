export default function ($) {
    const article = $('.md-content');
    article
        .find(
            '.admonition'
        )
        .remove();
    return article;
}