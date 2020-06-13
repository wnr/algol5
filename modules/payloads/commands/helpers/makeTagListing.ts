import prettier from "prettier";
import fs from "fs-extra";
import path from "path";
import { AlgolListing } from "../../../types";
import tagsCompositeMap from "../../../payloads/dist/composites/tags/tags";

const outFolder = path.join(__dirname, "../../dist/listings/tags");

export const makeTagListing = (tagId: string) => {
  const meta = require(`../../../content/dist/tags/${tagId}/listing`).listing;
  const composite = tagsCompositeMap[meta.thumbnail];
  const listing: AlgolListing = {
    blurb: meta.blurb,
    preloads: meta.preloads,
    url: `/tags/${meta.slug}`,
    title: meta.title,
    sort: meta.sort,
    composite,
  };
  const code = `// generated by makeTagListing
import { AlgolListing } from '../../../../types'

export const ${tagId}: AlgolListing = ${JSON.stringify(listing)};

export default ${tagId}
`;
  fs.ensureDirSync(outFolder);
  fs.writeFileSync(
    path.join(outFolder, `${tagId}.ts`),
    prettier.format(code, { filepath: "foo.ts" })
  );
  console.log("Made listing for tag", tagId);
};