import amqp from "amqplib";

let channel;

export async function connectQueue() {
  const connection = await amqp.connect("amqp://localhost:5672");
  channel = await connection.createChannel();
  await channel.assertQueue("notifications");
  return channel;
}

export function getChannel() {
  if (!channel) throw new Error("RabbitMQ channel is not initialized.");
  return channel;
}
