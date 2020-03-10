let Vue = require('vue');
let electron = require('electron');

var vm = new Vue({
	el: "#app",
	data: {
		files: [],
		targets: ["default"],
		srcDir: "./src",
		outDir: "./out",
		inputShow: false,
		popupText: "",
		currentSelected: ""
	},
	created: function () {
		electron.ipcRenderer.on("index-init", (e, targets, srcDir, outDir, files, selected) => {
			vm.targets = targets;
			vm.srcDir = srcDir;
			vm.outDir = outDir;
			vm.files = files;
			vm.currentSelected = selected;
		});
		electron.ipcRenderer.on("reload-files", (e, srcDir, outDir, files, selected) => {
			vm.srcDir = srcDir;
			vm.outDir = outDir;
			vm.files = files;
			vm.currentSelected = selected;
		});
		electron.ipcRenderer.on("selected-directory", (e, dir, files) => {
			vm.srcDir = dir;
			vm.files = files;
		});
		electron.ipcRenderer.on("out-directory", (e, dir) => {
			vm.outDir = dir;
		});
		electron.ipcRenderer.on("new-project-result", (e, bSuccess, name) => {
			if (bSuccess) {
				vm.inputShow = false;
				vm.targets.push(name);
				vm.srcDir = "";
				vm.outDir = "";
				vm.files = [];
				vm.currentSelected = name;
			} else {
				alert("The name: [" + name + "] is exist");
			}
		});
		electron.ipcRenderer.on("export-result", (e, errorList, successList) => {
			let showMessage = "";
			if (errorList.length > 0) {
				showMessage += "以下文件解析失败!\n";
				for (const str of errorList) {
					showMessage += "[!] " + str + "\n";
				}
				showMessage += "------------------\n";
			}
			if (successList.length > 0) {
				showMessage += "此次导出:\n";
				for (const str of successList) {
					showMessage += "[√] " + str + "\n";
				}
			}
			alert(showMessage);
		});

		electron.ipcRenderer.send("request-init");
	},
	mounted: function () {

	},
	methods: {
		OnSelectDir: function () {
			electron.ipcRenderer.send("open-file-dialog-select");
		},
		OnOutDir: function () {
			electron.ipcRenderer.send("open-file-dialog-out");
		},
		OnExport: function (type) {
			electron.ipcRenderer.send("export", type, vm.srcDir, vm.outDir, vm.files);
		},
		OnAddProject: function () {
			vm.inputShow = true;
		},
		OnRemoveCurrent: function () {
			electron.ipcRenderer.send("delete-project", vm.currentSelected);
		},
		OnClear: function () {
			electron.ipcRenderer.send("delete-all");
		},
		OnPopupInput: function (bOk) {
			if (bOk) {
				electron.ipcRenderer.send("new-project", vm.popupText);
			} else {
				vm.inputShow = false;
			}
			vm.popupText = "";
		},
		OnProjectClick: function (target) {
			electron.ipcRenderer.send("click-project", target);
		}
	}
});
