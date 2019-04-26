let electron = require('electron')

var vm = new Vue({
	el: "#app",
	data: {
		files: [],
		srcDir: "./src/",
		outDir: "./out/"
	},
	created: function () {
		electron.ipcRenderer.on("index-init", (e, srcDir, outDir, files)=>{
			vm.srcDir = srcDir;
            vm.outDir = outDir;
            vm.files = files;
		});
		electron.ipcRenderer.on("selected-directory", (e, dir, files) => {
			vm.srcDir = dir;
			vm.files = files;
		});
		electron.ipcRenderer.on("out-directory", (e, dir) => {
			vm.outDir = dir;
		});

		electron.ipcRenderer.send("request-init");
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
		}
	}
});
