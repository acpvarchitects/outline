/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { exec } = require("child_process");
const { readdirSync, existsSync, mkdirSync, copyFileSync, rmSync } = require("fs");
const path = require("path");

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout ? stdout : stderr);
      }
    });
  });
}

/**
 * Cross-platform recursive directory removal
 * @param {string} dirPath - Path to directory to remove
 */
function removeDir(dirPath) {
  try {
    rmSync(dirPath, { recursive: true, force: true });
  } catch (err) {
    console.error(`Error removing directory ${dirPath}:`, err);
  }
}

/**
 * Cross-platform file copy
 * @param {string} src - Source file path
 * @param {string} dest - Destination file path
 */
function copyFile(src, dest) {
  try {
    const destDir = path.dirname(dest);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    copyFileSync(src, dest);
  } catch (err) {
    console.error(`Error copying file from ${src} to ${dest}:`, err);
  }
}

/**
 * Cross-platform directory creation
 * @param {string} dirPath - Path to directory to create
 */
function makeDir(dirPath) {
  try {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  } catch (err) {
    console.error(`Error creating directory ${dirPath}:`, err);
  }
}

async function build() {
  // Clean previous build
  console.log("Clean previous build…");

  removeDir(path.join("build", "server"));
  removeDir(path.join("build", "plugins"));

  const d = getDirectories("plugins");

  // Compile server and shared
  console.log("Compiling…");
  await Promise.all([
    execAsync(
      `yarn babel --extensions .ts,.tsx --quiet -d ${path.join("build", "server")} server`
    ),
    execAsync(
      `yarn babel --extensions .ts,.tsx --quiet -d ${path.join("build", "shared")} shared`
    ),
    ...d.map(async (plugin) => {
      const hasServer = existsSync(path.join("plugins", plugin, "server"));

      if (hasServer) {
        await execAsync(
          `yarn babel --extensions .ts,.tsx --quiet -d "${path.join("build", "plugins", plugin, "server")}" "${path.join("plugins", plugin, "server")}"`
        );
      }

      const hasShared = existsSync(path.join("plugins", plugin, "shared"));

      if (hasShared) {
        await execAsync(
          `yarn babel --extensions .ts,.tsx --quiet -d "${path.join("build", "plugins", plugin, "shared")}" "${path.join("plugins", plugin, "shared")}"`
        );
      }
    }),
  ]);

  // Copy static files
  console.log("Copying static files…");
  await Promise.all([
    new Promise((resolve) => {
      copyFile(
        path.join("server", "collaboration", "Procfile"),
        path.join("build", "server", "collaboration", "Procfile")
      );
      resolve();
    }),
    new Promise((resolve) => {
      copyFile(
        path.join("server", "static", "error.dev.html"),
        path.join("build", "server", "error.dev.html")
      );
      resolve();
    }),
    new Promise((resolve) => {
      copyFile(
        path.join("server", "static", "error.prod.html"),
        path.join("build", "server", "error.prod.html")
      );
      resolve();
    }),
    new Promise((resolve) => {
      copyFile("package.json", path.join("build", "package.json"));
      resolve();
    }),
    ...d.map(async (plugin) => {
      const pluginJsonSrc = path.join("plugins", plugin, "plugin.json");
      const pluginJsonDest = path.join("build", "plugins", plugin, "plugin.json");
      
      makeDir(path.join("build", "plugins", plugin));
      
      if (existsSync(pluginJsonSrc)) {
        copyFile(pluginJsonSrc, pluginJsonDest);
      }
    }),
  ]);

  console.log("Done!");
}

void build();
