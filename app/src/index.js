let electron = require('electron')

var vm = new Vue({
	el: "#app",
	data: {
		files: [],
		srcDir:"./src/",
		outDir:"./out/"
	},
	methods: {
		OnSelectDir: function () {
			electron.ipcRenderer.send("open-file-dialog-select");
		},
		OnOutDir: function() {
			electron.ipcRenderer.send("open-file-dialog-out");
		},
		OnExport: function(type) {
			electron.ipcRenderer.send("export", type);
		}
	}
});

electron.ipcRenderer.on("selected-directory", (e, dir, files) => {
	vm.srcDir = dir;
	vm.files = files;
});
electron.ipcRenderer.on("out-directory", (e, dir)=>{
	vm.outDir = dir;
});