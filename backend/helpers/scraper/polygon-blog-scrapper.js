export default function ($) {
    const article = $('.container-small');
    article
        .find(
            '.blog-main-heading, .blog_detail-wrapper, .blog_social-share-absolute, .blog-tags_wrapper'
        )
        .remove();
    article.find('p').last().remove();
    return article;
}
