export default function ($) {
    const article = $('article section');
    article.find('.speechify-ignore, header').remove();
    return article;
}
