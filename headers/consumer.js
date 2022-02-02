const amqplib = require('amqplib')

const exchangeName = 'headers_logs';

const consumer = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'headers', { durable: false })
    const q = await channel.assertQueue('', { exclusive: true })
    console.log(`[X] Consumer: Waiting for message in queue ${q.queue}`)
    channel.bindQueue(q.queue, exchangeName, '', {'account': 'new', 'method': 'facebook', 'x-match': 'any'}) // x-match all
    channel.consume(q.queue, msg => {
        if (msg) console.log(`[X] Consumer: Headers: ${JSON.stringify(msg.properties.headers)}, Message: ${msg.content.toString()}`)
    }, { noAck: true })

}

consumer()