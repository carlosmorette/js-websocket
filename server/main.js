// Official documentation
// https://www.npmjs.com/package/ws

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

let count = 0
const names = ['John', 'Maguie', 'Tayler']
const MESSAGE_TYPES = ["INFORMATIVE", "MESSAGE"]

function sendJSONMessage(client, type, message) {
	if (Array.isArray(message)) {
		if (MESSAGE_TYPES.includes(type)) {
			const data = [type, message]
			client.send(JSON.stringify(data))
		} else {
			throw new Error("Message Type Not Found")
		}
	} else {
		throw new Error("Message Invalid Format")
	}
}

wss.on("connection", (ws, req) => {
	console.log("New client connected!")

	count++
	sendJSONMessage(ws, "INFORMATIVE", ["New client connected: " + count])
	//sendJSONMessage(ws, names)

	ws.on("message", name => {
		console.log(`Client has sent us: ${name}`)
		names.push(name)
		wss.clients.forEach((c) => {
			if (c.readyState === WebSocket.OPEN && c !== ws) {
				sendJSONMessage(c, "MESSAGE", [name])
			}
		})
	})

	ws.on("close", () => {
		console.log("Client has disconnected!")
	})
})

