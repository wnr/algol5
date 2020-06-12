import prettier from "prettier";
import fs from "fs-extra";
import path from "path";

const listingsPath = path.join(__dirname, "../dist/listings");
const listings = fs.readdirSync(listingsPath).filter(d => d != ".DS_Store");
for (const listing of listings) {
  const dir = path.join(listingsPath, listing);
  const all = fs
    .readdirSync(dir)
    .filter(f => f != ".DS_Store" && f != "index.ts")
    .map(t => t.replace(/\.ts$/, ""));
  const code = `// Generated by makeListingIndexes command
  ${all.map(id => `import ${id} from './${id}'`).join("\n")}
  import { AlgolListingContainer } from '../../../../types'
  export const ${listing}Listings: AlgolListingContainer = {
    title: "${listing[0].toUpperCase()}${listing.slice(1)}",
    composite: "${listing}.png",
    listings: [${all.join(", ")}]
  };
  export default ${listing}Listings;
  `;
  fs.writeFileSync(
    path.join(dir, "index.ts"),
    prettier.format(code, { filepath: "foo.ts" })
  );
  console.log("Listing index generated for", listing);
}
