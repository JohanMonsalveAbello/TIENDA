import hashlib
import datetime as date

class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        return hashlib.sha256((str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)).encode()).hexdigest()

class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        return Block(0, date.datetime.now(), "Genesis Block", "0")

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, new_block):
        new_block.previous_hash = self.get_latest_block().hash
        new_block.hash = new_block.calculate_hash()
        self.chain.append(new_block)


my_blockchain = Blockchain()

# Crear una transacción (pago con tarjeta)
transaction_data = {
    'sender': '1234 5678 9012 3456',
    'receiver': '9876 5432 1098 7654',
    'amount': 100
}

# Crear un nuevo bloque con la transacción y añadirlo a la cadena
new_block = Block(len(my_blockchain.chain), date.datetime.now(), transaction_data, my_blockchain.get_latest_block().hash)
my_blockchain.add_block(new_block)

# Mostrar la cadena de bloques
for block in my_blockchain.chain:
    print(f"Index: {block.index}")
    print(f"Timestamp: {block.timestamp}")
    print(f"Data: {block.data}")
    print(f"Previous Hash: {block.previous_hash}")
    print(f"Hash: {block.hash}\n")
