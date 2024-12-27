from kafka import KafkaConsumer
import json

class KafkaConsumerService:
    def __init__(self, topic, kafka_server='localhost:9092', group_id='anomaly_detection_group'):
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=kafka_server,
            auto_offset_reset='earliest',
            enable_auto_commit=True,
            group_id=group_id,
            value_deserializer=lambda v: json.loads(v.decode('utf-8'))
        )

    def consume(self):
        for message in self.consumer:
            print(f"Key: {message.key}, Value: {message.value}")
            # Process the message
