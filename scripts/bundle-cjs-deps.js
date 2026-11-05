// CJS consumers (jest, ts-node) cannot require ESM-only deps, so they are bundled as CJS into dist/cjs/vendor
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const CJS_DIR = path.resolve("dist/cjs");
const VENDOR_DIR = path.join(CJS_DIR, "vendor");
const ESM_ONLY_DEPS = ["arrify", "change-case", "flat", "p-timeout", "query-string"];

const vendorFile = (dep) => path.join(VENDOR_DIR, `${dep}.js`);

await Promise.all(
    ESM_ONLY_DEPS.map((dep) =>
        build({
            entryPoints: [fileURLToPath(import.meta.resolve(dep))],
            outfile: vendorFile(dep),
            bundle: true,
            format: "cjs",
            platform: "neutral",
            mainFields: ["module", "main"],
            target: "es2020",
            logLevel: "warning",
        }),
    ),
);

const files = (await readdir(CJS_DIR, { recursive: true }))
    .map((file) => path.join(CJS_DIR, file))
    .filter((file) => file.endsWith(".js") && !file.startsWith(VENDOR_DIR));

await Promise.all(
    files.map(async (file) => {
        const source = await readFile(file, "utf8");
        const updated = source.replace(/require\("([^"]+)"\)/g, (match, dep) => {
            if (!ESM_ONLY_DEPS.includes(dep)) {
                return match;
            }

            const relative = path.relative(path.dirname(file), vendorFile(dep)).split(path.sep).join("/");
            return `require("${relative.startsWith(".") ? relative : `./${relative}`}")`;
        });

        if (updated !== source) {
            await writeFile(file, updated);
        }
    }),
);
