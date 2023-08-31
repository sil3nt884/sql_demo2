const net = require('net');

/***
 * connect to the minecraft rcon server on port 25575
 * send the password to authenticate and then send the command
 *
 * Packet format:
 * Length    int32    Length of remainder of packet
 * Request ID    int32    Client-generated ID
 * Type    int32    3 for login, 2 to run a command, 0 for a multi-packet response
 * Payload    byte[]    NULL-terminated ASCII text
 * 1-byte pad    byte    NULL
 *
 * @param command
 */


const RCON_PORT = 25575;
const RCON_HOST = 'localhost'; // Change this to your server's IP if not running locally
const RCON_PASSWORD = 'marcopolo123'; // Replace with your RCON password

function sendRconCommand(command) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        const requestId = Math.floor(Math.random() * (10000 - 1)) + 1; // Generate a random request ID

        client.connect(RCON_PORT, RCON_HOST, () => {
            // Send authentication packet
            const authPacket = createPacket(requestId, 3, RCON_PASSWORD);
            client.write(authPacket);
        });
        client.on('data', (data) => {
            const response =read(data);
            if (response.requestId === requestId) {
                if (response.type === 2) {
                    const commandPacket = createPacket(requestId, 2, command);
                    client.write(commandPacket);
                } else if (response.type === 0) {
                    client.destroy();
                    resolve(response.payload);
                }
            }
        });

        client.on('error', (err) => {

            reject(err);
            client.destroy();
        });
    });
}


const read = (buffer) => {
    const HEADER_SIZE = 12;

    if (buffer.length < HEADER_SIZE) {
        throw new Error("Cannot read the whole packet");
    }

    // Little Endian order
    const length = buffer.readInt32LE(0);
    const requestId = buffer.readInt32LE(4);
    const type = buffer.readInt32LE(8);

    // Calculate payload size and extract it
    const payloadSize = length - 4 - 4 - 2;
    if (buffer.length < HEADER_SIZE + payloadSize) {
        throw new Error("Cannot read the whole packet");
    }
    const payload = buffer.slice(HEADER_SIZE, HEADER_SIZE + payloadSize);

    return {
        requestId: requestId,
        type: type,
        payload: String(payload)
    };
};


const createPacket = (requestId, type, payload) => {
    const getPacketLength = (bodyLength) => {
        return 4 + bodyLength;
    };

    const getBodyLength = (payloadLength) => {
        return 8 + payloadLength + 2;
    };

    const bodyLength = getBodyLength(payload.length);
    const packetLength = getPacketLength(bodyLength);
    const buffer = Buffer.alloc(packetLength);

    let offset = 0;

    // Little Endian order
    buffer.writeInt32LE(bodyLength, offset);
    offset += 4;

    buffer.writeInt32LE(requestId, offset);
    offset += 4;

    buffer.writeInt32LE(type, offset);
    offset += 4;

    buffer.write(payload, offset, 'utf8');
    offset += payload.length;

    buffer.writeInt16LE(0, offset); // Two null bytes

    return buffer;
};


module.exports = {sendRconCommand}
