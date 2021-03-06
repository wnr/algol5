const fs = require("fs-extra");
const path = require("path");

const list = require("../../games/dist/gameList");

const gamePayloadsFolder = path.join(__dirname, "../dist/games");

const code = `// Generated by the exportAllGamePayloads command
${list.map(gameId => `import ${gameId} from './${gameId}';`).join("\n")}

export const allPayloads = {
${list.map(gameId => `  ${gameId},`).join("\n")}
};

export default allPayloads;
`;

fs.ensureDirSync(gamePayloadsFolder);
fs.writeFileSync(path.join(gamePayloadsFolder, "index.ts"), code);
