const amqplib = require('amqplib')

const exchangeName = 'fanout_logs'
const msg = process.argv.slice(2).join(' ') || "Fan Out Exchange Type Implementation"

const producer = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = connection.createChannel();
    (await channel).assertExchange(exchangeName, 'fanout', {durable: false});
    (await channel).publish(exchangeName, '', Buffer.from(msg))
    console.log(`[X] Producer: ${msg}`)
    setTimeout(() => {
        connection.close()
        process.exit(0)
    }, 500);

}

producer()