import { app, Menu, shell } from 'electron'

const isMac = process.platform === 'darwin'

export interface GenerateMenuArgs {
	onAboutClick: () => void
	onUpdateClick: () => void
}

export function generateMenu({ onAboutClick, onUpdateClick }: GenerateMenuArgs) {
	const menuTemplate: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = []

	if (isMac) {
		// { role: 'appMenu' }
		menuTemplate.push({
			label: app.name,
			submenu: [
				{ role: 'about' },
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideOthers' },
				{ role: 'unhide' },
				{ type: 'separator' },
				{ role: 'quit' },
			],
		})
	}

	// { role: 'fileMenu' }
	menuTemplate.push({
		label: 'File',
		submenu: [{ role: isMac ? 'close' : 'quit' }],
	})

	// { role: 'editMenu' }
	menuTemplate.push({
		label: 'Edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			...(isMac
				? [
						{ role: 'pasteAndMatchStyle' as const },
						{ role: 'delete' as const },
						{ role: 'selectAll' as const },
						{ type: 'separator' as const },
						{
							label: 'Speech',
							submenu: [{ role: 'startSpeaking' as const }, { role: 'stopSpeaking' as const }],
						},
				  ]
				: [{ role: 'delete' as const }, { type: 'separator' as const }, { role: 'selectAll' as const }]),
		],
	})

	// { role: 'viewMenu' }
	menuTemplate.push({
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'forceReload' },
			{ role: 'toggleDevTools' },
			{ type: 'separator' },
			{ role: 'resetZoom' },
			{ role: 'zoomIn' },
			{ role: 'zoomOut' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' },
		],
	})

	// { role: 'windowMenu' }
	menuTemplate.push({
		label: 'Window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'zoom' },
			...(isMac
				? [
						{ type: 'separator' as const },
						{ role: 'front' as const },
						{ type: 'separator' as const },
						{ role: 'window' as const },
				  ]
				: [{ role: 'close' as const }]),
		],
	})

	menuTemplate.push({
		role: 'help',
		submenu: [
			{
				label: 'Documentation',
				click: async () => {
					await shell.openExternal('https://github.com/SuperFlyTV/SuperConductor')
				},
			},
			{
				label: 'Search Issues',
				click: async () => {
					await shell.openExternal('https://github.com/SuperFlyTV/SuperConductor/issues')
				},
			},
			{
				label: 'Check For Updates',
				click: onUpdateClick,
			},
			{
				label: 'About',
				click: onAboutClick,
			},
		],
	})

	return Menu.buildFromTemplate(menuTemplate)
}
