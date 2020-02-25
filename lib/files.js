const fs = require("fs");
const path = require("path");
/**
 * get the current directory (to get a default repo name)
 * check whether a directory exists (to determine whether the current folder is already a Git repository by looking for a folder named .git).
 */
module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },

  directoryExists: filePath => {
    return fs.existsSync(filePath);
  }
};
