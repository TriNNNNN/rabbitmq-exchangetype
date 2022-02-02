const amqplib = require('amqplib')
const { v4: uuidv4 } = require('uuid')

const queueName = 'rpc_queue'

function fibb(n) {
    if (n === 0 || n === 1) {
        return n
    } else {
        return fibb(n - 1) + fibb(n - 2)
    }
}

const rpc_server = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false, exclusive: true })
    channel.prefetch(1)
    console.log(`[x] Awaiting RPC Request`)

    channel.consume(queueName, message => {
        const num = +message.content.toString()
        const fibbResult = fibb(num)
        channel.sendToQueue(message.properties.replyTo, Buffer.from(fibbResult.toString()), {
            correlationId: message.properties.correlationId
        })
        channel.ack(message)
    }, { noAck: false })

}

rpc_server()