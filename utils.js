/**
 * Download a file from a url, saving it to the current directory (__dirname)
 * @param url The url to download from
 * @returns {Promise<unknown>} A promise that resolves when the download is finished, or rejects if something fails
 */
function download(url) {
	return new Promise((resolve, reject) => {
		const {https} = require("follow-redirects") /* Using follow-redirects to follow redirects */
		const fs = require("fs")
		const path = require("path")
		const file = fs.createWriteStream(platformpath() + path.sep + url.split("/").pop())
		https.get(url, function (response) {
			response.pipe(file)
			file.on("finish", function () {
				file.close()
				resolve()
			})
			file.on("error", function (error) {
				console.error(error)
				reject(error)
			})
		})
	})
}

/**
 * Removes a file from the current directory
 * @param file The filename to remove
 * @returns {Promise<unknown>} A promise that resolves when the file is removed, or rejects if something fails
 */
function removeFile(file) {
	return new Promise((resolve, reject) => {
		const fs = require("fs")
		const path = require("path")
		fs.unlink(platformpath() + path.sep + file, function (error) {
			if (error) {
				reject(error)
				console.error(error)
			} else resolve()
		})
	})
}

/**
 * Removes a directory from the current directory
 * @param dir The directory to remove
 * @returns {Promise<unknown>} A promise that resolves when the directory is removed, or rejects if something fails
 */
function removeDir(dir) {
	return new Promise((resolve, reject) => {
		const fs = require("fs")
		const path = require("path")
		fs.rm(platformpath() + path.sep + dir, {recursive: true, force: true}, function (error) {
			if (error) {
				reject(error)
				console.error(error)
			} else resolve()
		})
	})
}

/**
 * Unzip a file to the current directory
 * @param file The file to unzip, preferably a .zip file
 * @param target The target directory to unzip to
 * @returns {Promise<unknown>} A promise that resolves when the unzip is complete, or rejects if something fails
 */
function unzip(file, target) {
	const {exec} = require("child_process")
	const path = require("path")

	return new Promise((resolve, reject) => {
		if (process.platform.toString().includes("win")) {
			const command = "powershell.exe -Command Expand-Archive -Path " + platformpath() + path.sep + file + " -Destination " + platformpath() + path.sep + target
			exec(command, function (error) {
				if (error) {
					reject(error)
					console.error(error)
				} else resolve()
			})
		} else {
			const command = "unzip -o " + file + " -d ./" + target + "/"
			exec(command, function (error) {
				if (error) {
					reject(error)
					console.error(error)
				} else resolve()
			})
		}
	})
}

/**
 * Runs a command in a separate process, printing errors and debugging info to the console
 * @param command The command to run
 * @returns {Promise<unknown>} A promise that resolves when the command is complete or rejects if something fails
 */
function runCommand(command) {
	return new Promise((resolve, reject) => {
		const {exec} = require("child_process")
		exec(command, function (error) {
			if (error) {
				const msg = "Running command failed with error:\n" + error
				reject(msg)
			} else resolve()
		})
	})
}

/**
 * Returns the path where the actual program is being run from, depending on the operating system.
 * Because __dirname is inconsistent across operating systems, this function is used to get the correct path
 * @returns {string} The absolute path
 */
const platformpath = () => {
	if ((__dirname.includes("AppData") || __dirname.includes("Temp")) && process.platform.toString().includes("win")) {
		// Windows portable exe
		return process.env.PORTABLE_EXECUTABLE_DIR
	} else if (__dirname.includes("/tmp/") && process.platform.toString().includes("linux")) {
		// Linux AppImage
		return process.cwd()
	} else {
		// .zip binary
		return __dirname
	}
}

module.exports = {preDownloadCheck, download, createCommand, runCommand, removeDir, removeFile, unzip, platformpath}