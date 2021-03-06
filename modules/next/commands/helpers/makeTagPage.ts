import fs from "fs-extra";
import path from "path";
import prettier from "prettier";
import { AlgolArticle } from "../../../types";

const tagFolder = path.join(__dirname, "../../pages/tags");

export const makeTagPage = (article: AlgolArticle) => {
  const content = `
  // Generated by the makeTagPage command
  
  import article from "../../../../payloads/dist/articles/tags/${article.id}";
  import { makePayloadArticlePage } from "../../../../ui/src/components/PayloadArticlePage";
  import { makeTagArticleNav } from "../../../../common/nav/makeTagArticleNav";
  
  export const TagArticle = makePayloadArticlePage(article);
  
  TagArticle.mainImage = article.mainImage;
  TagArticle.title = article.title;
  TagArticle.metaDesc = article.blurb;
  TagArticle.nav = makeTagArticleNav(article);
  
  export default TagArticle;
  `;
  const out = path.join(tagFolder, article.slug);
  fs.emptyDirSync(out);
  fs.writeFileSync(
    path.join(out, "index.tsx"),
    prettier.format(content, { filepath: "foo.ts" })
  );
  console.log("Made tag page for", article.id);
};
