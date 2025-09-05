import {afterAll, describe, it, expect} from "vitest";
import {request} from "undici";
import {exec} from "node:child_process";
import {build} from "esbuild";
var bundledFile = (format:"esm"|"cjs") => "tests/" + format + "/out/test-bundle" + (format == "esm" ? ".mjs" : ".cjs");
async function bundle(format: "esm"|"cjs"){
  await new Promise((resolve, reject) => {
    exec(
      "npx preprocess \"--default-s=/*REMOVE*/\" \"--default-e=/*!REMOVE*/\" --dirs: \"<tests/" + format + "/src|tests/" + format + "/out>\"", 
      (error) => {
        if (error) reject(error);
        resolve(null);
      }
    )
  });
  return build({
    platform: "node",
    tsconfigRaw: await request("https://raw.githubusercontent.com/ublitzjs/core/refs/heads/main/tsconfig.json")
      .then(response => response.body.text()),
    format,
    bundle: true,
    external: ["uWebSockets.js", "mrmime"],
    target: "node22",
    minify: true,
    alias: {
      stream: "node:stream",
      fs: "node:fs",
      crypto: "node:crypto",
      util: "node:util",
      process: "node:process",
      buffer: "node:buffer",
      events: "tseep",
      "node:events": "tseep",
      timers: "node:timers",
    },
    charset: "utf8",
    ignoreAnnotations: false,
    resolveExtensions: [".mts", ".ts", ".js", ".mjs", ".cts", ".cjs"],
    outfile: bundledFile(format),
    entryPoints: ["tests/" + format + "/out/index.ts"]
  });
};
function suite(serverExports: any){
  serverExports.start();
  afterAll(serverExports.end);
  
  describe("works", ()=>{
    it("hello", async ()=>{
      await request("http://localhost:" + serverExports.port).then(res=>{
        expect(res.statusCode).toBe(404);
      })
    })
  });
}

describe("Openapi example", {concurrent: false, sequential: true}, async ()=>{
  it("bundles", async ()=> await Promise.all([ bundle("esm"), bundle("cjs") ]));
  it("starts", async () => await Promise.all([import(bundledFile("esm")), import(bundledFile("cjs"))]).then((results) => {
    suite(results[0]), suite(results[1])
  }))
});


