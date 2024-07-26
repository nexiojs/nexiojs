import { Glob } from "bun";

const getCommonVersion = async () => {
  const file = Bun.file("./packages/common/package.json");
  const pkg = await file.json();
  return pkg.version;
};

const glob = new Glob("./packages/*/package.json");

const replaceVersion = async () => {
  const version = await getCommonVersion();

  for await (const path of glob.scan(".")) {
    const file = Bun.file(path);
    const pkg = await file.json();

    if (pkg.name === "@nexiojs/common") {
      continue;
    }

    let str = await file.text();
    str = str.replaceAll("workspace:*", `^${version}`);

    await Bun.write(path, str);
  }
};

await replaceVersion();
