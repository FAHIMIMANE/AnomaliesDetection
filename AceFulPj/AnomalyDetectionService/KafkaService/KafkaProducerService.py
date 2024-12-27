from kafka import KafkaProducer
import json

class KafkaProducerService:
    def __init__(self, topic, kafka_server='localhost:9092'):
        self.producer = KafkaProducer(
            bootstrap_servers=kafka_server,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        self.topic = topic

    def send(self, key, value):
        self.producer.send(self.topic, key=key.encode('utf-8'), value=value)
        self.producer.flush()
