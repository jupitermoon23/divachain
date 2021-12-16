# DIVA Blockchain

A blockchain implementation using Practical Byzantine Fault Tolerance (PBFT) in combination with Proof-of-Stake (PoS) as a consensus algorithm. It is therefore a "Weighted Practical Byzantine Fault Tolerance" consensus.

This is a fully anonymous ("Privacy-By-Design"), very lightweight, fast, low-energy and permissionless blockchain.

The load of the PBFT consensus is network bound. The chain gets built by "communication" instead of "computation". Therefore many messages are crossing the network.

The peers in the network communicate over I2P. The peers build the tunnels between each other using a secure and efficient "Challenge/Auth" process based on regular asymmetric keys (public/private keys). "Sodium" gets used as the single crypto library - so all crypto-related code is based on solid, very well tested and proven code.  

## Architecture / Flow

The network itself is permission- and leaderless. Each peer in the network represents a round-based state machine. Each round produces a block. The blocks do have a variable size and blocks are produced on demand.

1. New proposal: each peer in the network may anytime propose a transaction, by sending it to the network. Per round, each peer can only add one own transaction.
2. Voting: each peer receiving a proposal may send a vote to the network. Such a vote represents an agreement of a peer with a specific stack of proposals. Each peer can vote only once. If the peers in the network do not agree (2/3 of the total stake of all peers) on a specific stack of proposals, the voting will go into a new round and all peers can vote again.  
3. Creation of a new block: as soon as consensus is reached through voting for a specific stack of proposals, peers will create the new block. 
 
## Create Your Local Environment

To create a docker based local environment use the project https://codeberg.org/diva.exchange/diva-dockerized.

## Configuration
The configuration can be controlled using environment variables.

### NO_BOOTSTRAPPING
Set to 1 to skip bootstrapping.

Default: 0

### BOOTSTRAP
URL to a entrypoint in the network, like http://diva.i2p.

Default: (empty)

### IP
Default: 127.0.0.1

### PORT
Default: 17468

### BLOCK_FEED_PORT
Default: 17469

### I2P_SOCKS_HOST

### I2P_SOCKS_PORT

### I2P_SAM_HTTP_HOST

### I2P_SAM_HTTP_PORT_TCP

### I2P_SAM_UDP_HOST

### I2P_SAM_UDP_PORT_TCP

### I2P_SAM_UDP_PORT_UDP

### I2P_SAM_FORWARD_HTTP_HOST

### I2P_SAM_FORWARD_HTTP_PORT

### I2P_SAM_LISTEN_UDP_HOST

### I2P_SAM_LISTEN_UDP_PORT

### I2P_SAM_FORWARD_UDP_HOST

### I2P_SAM_FORWARD_UDP_PORT

### NETWORK_P2P_INTERVAL_MS
Interval, in milliseconds, to build and maintain the P2P the network (connect to peers, if needed). 

Minimum: 10000\
Maximum: 60000\
Default: Minimum

### NETWORK_CLEAN_INTERVAL_MS
Interval, in milliseconds, to clean up the network environment (like gossiping data).

Minimum: 30000\
Maximum: 60000\
Default: Minimum

### NETWORK_SYNC_SIZE
Maximum number of blocks of synchronization message might contain. Must not exceed API_MAX_QUERY_SIZE.

Minimum: 10\
Maximum: 100\
Default: Minimum

### BLOCKCHAIN_MAX_BLOCKS_IN_MEMORY
Number of blocks kept in memory (cache).

Minimum: 100\
Maximum: 1000\
Default: Maximum

### API_MAX_QUERY_SIZE
Number of blocks which can be queried through the API.

Minimum: 10\
Maximum: 100\
Default: Maximum

## API Endpoints

### Quering the Blockchain

#### GET /about
Returns an object containing the version, the license and the public key of the peer.

#### GET /network

#### GET /state/{key?}[?filter=some-valid-regex]
Get all or a specific state from the local state database. The local state database is a key/values storage and represents a well-defined set of current states.

_Example:_ `http://url-divachain-api/state/?filter=^DivaExchange:` will return those states where the key starts with "DivaExchange:".

#### GET /stack
Get the stack (queue) of local transactions.

#### GET /pool/tx
Get the current transactions in the pool. 

#### GET /pool/votes
Get the current votes in the pool. 

#### GET /block/genesis
Get the genesis block.

#### GET /block/latest
Get the latest block on the chain.

#### GET /block/{height}
Get a specific block on the given height. 

_Example:_ `http://url-divachain-api/block/10` will return the block on height 10.

_Error handling:_ If a block is not yet available, 404 (Not Found) will be returned.

#### GET /blocks/{from?}/{to?}/[?filter=some-valid-regex]
Get all blocks between height "from" (inclusive) and height "to" (inclusive). If "to" is not yet available, the blocks until the current height will be returned.

The _optional_ query parameter `filter` is also supported. Supply some valid regex to filter the blocks. 

_Example:_ `http://url-divachain-api/blocks/10/19/` will return 10 blocks (block 10 until 19, if all blocks are already).
 
_Example:_ `http://url-divachain-api/blocks` will return the latest API_MAX_QUERY_SIZE blocks (at most).

_Example:_ `http://url-divachain-api/blocks/10/19/?filter=abc` will return those blocks within the range of block 10 until 19, which do contain the string "abc".

_Error handling:_ 404 (Not Found) will be returned.

_Remark:_ Not more than API_MAX_QUERY_SIZE can be requested at once.

#### GET /page/{page}/{size?}
Get a specific page of the blockchain, starting at the current height (reverse order).
If size is not given, it will return API_MAX_QUERY_SIZE blocks or less. 

_Example:_ `http://url-divachain-api/page/1/5` will return the **last** 5 or less blocks of the chain.

#### GET /transaction/{origin}/{ident}
Get a well-defined transaction.

_Error handling:_ 404 (Not Found) will be returned if the transaction is not available.

### Transmitting Transactions

#### PUT /transaction/{ident?}
Submit a new transaction proposal to the network. The body must contain an array of transaction objects.

### Joining and Leaving the Network

#### GET /join/{base64url}
This endpoint is part of an automated process.

Request to join the network. Requires a base6url (RFC4648) encoded string containing the http and udp endpoint and the public key. 

Send this GET request to any remote peer in the network which is online. This remote peer will later - in some seconds or even minutes - send back an independent GET request to the local /challenge/ endpoint. 

#### GET /leave/{address}
This endpoint is part of an automated process.

TBD.

#### GET /challenge/{token}
This endpoint is part of an automated process.

Response will contain the signed token. Verify the response with the public key of the remote peer.

### Network Synchronization

#### GET /sync/{height}
This endpoint is part of an automated process.

Get a well-defined number of blocks starting from {height} (including). See NETWORK_SYNC_SIZE.  

## How to Run Unit Tests

If a local I2P test environment is wanted, start the local testnet container:
```
docker-compose -f test/local-i2p-testnet.yml up -d
```

Unit tests can be executed using:

```
npm run test
```
Unit tests contain functional tests and will create some blocks within the local storage.


To stop the local I2P test environment (and purge all data):
```
docker-compose -f test/local-i2p-testnet.yml down --volumes
```

## Linting

To lint the code, use
```
npm run lint
```

## Contact the Developers

On [DIVA.EXCHANGE](https://www.diva.exchange) you'll find various options to get in touch with the team.

Talk to us via Telegram [https://t.me/diva_exchange_chat_de]() (English or German).

## Donations

Your donation goes entirely to the project. Your donation makes the development of DIVA.EXCHANGE faster.

XMR: 42QLvHvkc9bahHadQfEzuJJx4ZHnGhQzBXa8C9H3c472diEvVRzevwpN7VAUpCPePCiDhehH4BAWh8kYicoSxpusMmhfwgx

BTC: 3Ebuzhsbs6DrUQuwvMu722LhD8cNfhG1gs

Awesome, thank you!

## License

[AGPLv3](LICENSE)
