const amqplib = require('amqplib')
const { v4: uuidvv4 } = require('uuid')

const queueName = 'rpc_queue'
const args = process.argv.splice(2)

if (args.length === 0) {
    console.log("Usage: node rpc_client.js num")
    process.exit(1)
}

const num = +args[0]
const uuid = uuidvv4()

const rpc_client = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const q = await channel.assertQueue('', { durable: false, exclusive: true })

    channel.sendToQueue(queueName, Buffer.from(num.toString()), {
        replyTo: q.queue,
        correlationId: uuid
    })
    channel.consume(q.queue, message => {
        if (message.properties.correlationId === uuid) {
            console.log(`[x] Fibbonaci of ${num} is ${message.content.toString()}`)
            setTimeout(() => {
                connection.close();
                process.exit(0)
            }, 500);
        }
    }, { noAck: true })

}

rpc_client()