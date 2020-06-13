// Generated by the makeTagPage command

import article from "../../../../payloads/dist/articles/tags/irreversible";
import { makePayloadArticlePage } from "../../../../ui/src/components/PayloadArticlePage";
import { makeTagArticleNav } from "../../../../common/nav/makeTagArticleNav";

export const TagArticle = makePayloadArticlePage(article);

TagArticle.mainImage = article.mainImage;
TagArticle.title = article.title;
TagArticle.metaDesc = article.blurb;
TagArticle.nav = makeTagArticleNav(article);

export default TagArticle;