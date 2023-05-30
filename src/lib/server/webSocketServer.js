import { Server } from 'socket.io';

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server) {
		const io = new Server(server.httpServer);

		io.on('connect', (socket) => {
			// forward any event from one socket to all other sockets
			socket.onAny((event, ...args) => {
				io.sockets.emit(event, ...args);
			});
		});
	}
};