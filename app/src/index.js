let electron = require('electron')

var vm = new Vue({
	el: "#app",
	data: {
		files: [],
		outDir:"./out/"
	},
	methods: {
		OnSelectDir: function () {
			electron.ipcRenderer.send("open-file-dialog-select");
		},
		OnOutDir: function() {
			electron.ipcRenderer.send("open-file-dialog-out");
		},
		OnExport: function() {
			electron.ipcRenderer.send("export");
		}
	}
});

electron.ipcRenderer.on("selected-directory", (e, files) => {
	vm.files = files;
});
electron.ipcRenderer.on("out-directory", (e, dir)=>{
	vm.outDir = dir;
});