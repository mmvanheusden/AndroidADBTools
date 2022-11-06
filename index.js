const {
	runCommand,
	platformpath,
	createADBCommand
} = require("./utils")

function sleep(milliseconds) {
	var start = new Date().getTime()
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break
		}
	}
}

function snapss() {
	const path = require("path")
	if (process.platform.toString().includes("win")) {
		runCommand(`adb exec-out screencap -p > ${platformpath() + path.sep}out.png && mspaint ${platformpath() + path.sep}out.png`)
	} else {
		runCommand(`adb exec-out screencap -p > ${platformpath() + path.sep}out.png && xdg-open ${platformpath() + path.sep}out.png`)
	}
}

function startadb() {
	runCommand("adb kill-server")
	runCommand(createADBCommand())
}

function input() {
	runCommand(`adb shell "bash -c 'input text ${document.getElementById("inputbox").value.toString()} && input keyevent 66'"`)
}

function getresolution() {
	runCommand("adb shell wm size").then((output) => {
		const res = output.split(" ")[2].split("x")
		res[1] = res[1].replace("\n", "")
		console.log("Resolution: " + res[0] + "x" + res[1])
	})
}

async function centertap() {
	runCommand("adb shell wm size").then(async (output) => {
		const res = output.split(" ")[2].split("x")
		res[1] = res[1].replace("\n", "")

		await runCommand(`adb shell input tap ${res[0] / 2} ${res[1] / 2}`)
		await runCommand(`adb shell input tap ${res[0] / 2} ${res[1] / 2}`)
		await sleep(400)
		await runCommand("adb shell input keyevent 24")

	})
}

// Add event listeners to the buttons
window.addEventListener("DOMContentLoaded", () => {
	document.getElementById("snapss").addEventListener("click", snapss)
	document.getElementById("startadb").addEventListener("click", startadb)
	document.getElementById("input").addEventListener("click", input)
	document.getElementById("centertap").addEventListener("click", centertap)
	document.getElementById("getresolution").addEventListener("click", getresolution)
})