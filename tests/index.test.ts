import {afterAll, describe, it, expect} from "vitest";
import {request} from "undici";
import {exec} from "node:child_process";
import {build} from "esbuild";
var bundledFile = (format:"esm"|"cjs") => "tests/" + format + "/out/test-bundle" + (format == "esm" ? ".mjs" : ".cjs");
async function buildExample(format: "esm"|"cjs"){
  await new Promise((resolve, reject) =>{
    exec(
      "BUILD_DOCS=true npx tsx tests/" + format + "/src/index" + (format == "esm" ? ".mts" : ".cts"),
      (err)=>{
        if(err) reject(err)
        resolve(null);
      }
    )
  })
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
    entryPoints: ["tests/" + format + "/out/index" + (format == "esm" ? ".mts" : ".cts")]
  });
};
async function suite(serverExports: any, format: "esm" | "cjs"){
  await serverExports.start();
  afterAll(serverExports.end);
  
  describe(format, ()=>{
    it("hello", async ()=>{
      await request("http://localhost:" + serverExports.port).then(res=>{
        expect(res.statusCode).toBe(404);
      })
    })
  });
}

describe("Openapi example", {concurrent: true, sequential: false}, async ()=>{
  await Promise.all([ buildExample("esm"), buildExample("cjs") ])
  var results = await Promise.all([ import(bundledFile("esm")), import(bundledFile("cjs"))])

  await Promise.all([
    suite(results[1], "cjs"),
    suite(results[0], "esm")
  ])
 
});


