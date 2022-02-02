const amqplib = require('amqplib')

const exchangeName = 'direct_logs';
const routingKeys = process.argv.splice(2)

if (routingKeys.length === 0) {
    console.log("Usage: node consumer.js [error] [info] [warning]")
    process.exit(1)
}

const consumer = async() => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'direct', {durable: false})
    const q = await channel.assertQueue('', {exclusive: true})
    console.log(`[X] Consumer: Waiting for message in queue ${q.queue}`)
    routingKeys.forEach(bindingKey => {
        channel.bindQueue(q.queue, exchangeName, bindingKey)
    });
    channel.consume(q.queue, msg => {
        if(msg) console.log(`[X] Consumer: Log Type: ${msg.fields.routingKey}, Message: ${msg.content.toString()}`)
    }, {noAck: true})
    
}

consumer()