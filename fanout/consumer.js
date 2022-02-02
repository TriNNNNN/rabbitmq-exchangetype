const amqplib = require('amqplib')

const exchangeName = 'fanout_logs'

const consumer = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    channel.assertExchange(exchangeName, 'fanout', { durable: false })
    const q = await channel.assertQueue('', { exclusive: true })
    console.log(`[X] Consumer: Waiting for message in queue ${q.queue}`)
    channel.bindQueue(q.queue, exchangeName, '')
    channel.consume(q.queue, message => {
        if (message.content) console.log(`[X] Consumer: ${message.content}`)
    }, {noAck: true})
}

consumer()