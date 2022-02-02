const amqplib = require('amqplib')

const exchangeName = 'headers_logs';
const args = process.argv.splice(2)
const message = args[0] || "Headers Exchange Type Implementation"

const producer = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'headers', { durable: false })
    channel.publish(exchangeName, '', Buffer.from(message), { headers: { account: 'new', method: 'google'} })
    console.log(`[X] Producer: Message: ${message}`)
    setTimeout(() => {
        connection.close()
        process.exit(0)
    }, 500);
}

producer()