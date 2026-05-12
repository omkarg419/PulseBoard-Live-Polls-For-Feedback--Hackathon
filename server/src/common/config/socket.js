let socketIO = null;

export const setSocketIO = (io) => {
	socketIO = io;
	return socketIO;
};

export const getSocketIO = () => socketIO;

export const emitToPollRoom = (pollId, eventName, payload) => {
	if (!socketIO) {
		return;
	}

	socketIO.to(String(pollId)).emit(eventName, payload);
};
