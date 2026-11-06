import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const BLOCKCHAIN_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "EVM Architecture, Cryptographic State Machines & Smart Contract Invariants",
    "desc": "Master cryptographic block structures, hash pointers ($H(B_{i-1})$), append-only immutability, and Byzantine Fault Tolerance.",
    "syllabus": [
      "Genesis block to current tip: cryptographic hash pointer chaining.",
      "Immutability guarantee: modifying 1 bit in block $k$ breaks all subsequent blocks $k+1 \\dots N$.",
      "Distributed Ledger State Transitions: $S' = \\text{APPLY}(S, \\text{TX})$."
    ],
    "eTitle": "Cryptographic Block Chain Hash Validator",
    "eDesc": "Implement function validateBlockchain(chain) verifying that each block's `previousHash` matches the exact SHA-256 hash of the preceding block.",
    "eStarter": "function validateBlockchain(chain) {\n  // TODO: Iterate from block 1, verifying that curr.previousHash equals the computed hash of the previous block.\n  \n}",
    "eHint": "Iterate from block 1, verifying that curr.previousHash equals the computed hash of the previous block.",
    "eTest": "const validChain = [{ index: 0, data: 'genesis', previousHash: '0000' }, { index: 1, data: 'tx1', previousHash: 'hash_0_genesis' }, { index: 2, data: 'tx2', previousHash: 'hash_1_tx1' }];\nconst invalidChain = [{ index: 0, data: 'genesis', previousHash: '0000' }, { index: 1, data: 'tampered', previousHash: 'hash_0_genesis' }, { index: 2, data: 'tx2', previousHash: 'hash_1_tx1' }];\nif (!validateBlockchain(validChain).valid) throw new Error('Valid blockchain failed verification');\nif (validateBlockchain(invalidChain).valid) throw new Error('Tampered blockchain was not detected');",
    "aTitle": "Genesis Block Creator",
    "aDesc": "Implement function createGenesisBlock(timestamp = 1700000000) returning genesis block object.",
    "aStarter": "function createGenesisBlock(ts = 1700000000) {\n  // TODO: Return index 0 and 0x000 previousHash.\n  \n}",
    "aHint": "Return index 0 and 0x000 previousHash.",
    "aTest": "if (createGenesisBlock().index !== 0 || !createGenesisBlock().previousHash.startsWith('0x000')) throw new Error('Genesis failed');"
  },
  {
    "day": 2,
    "title": "AMM Constant Product Math, TWAP Oracles, EIP-712 Signatures & Layer 2 Rollup Proofs",
    "desc": "Calculate SHA-256 digests, construct binary Merkle Trees for transaction blocks, and verify $O(\\log N)$ Merkle Inclusion Proofs.",
    "syllabus": [
      "Cryptographic Hash Properties: Pre-image resistance, Second pre-image resistance, Collision resistance.",
      "Merkle Tree Construction: Pairwise hashing from leaf nodes up to the single Merkle Root.",
      "Merkle Inclusion Proofs: Proving transaction existence in $O(\\log N)$ steps without downloading the full block."
    ],
    "eTitle": "Merkle Tree Root & Inclusion Proof Verifier",
    "eDesc": "Implement function verifyMerkleProof(leafHash, proofSiblings, expectedMerkleRoot) verifying cryptographic inclusion proof.",
    "eStarter": "function verifyMerkleProof(leaf, proof, expectedRoot) {\n  // TODO: Fold sibling hashes into currentHash based on left/right position and compare with expectedRoot.\n  \n}",
    "eHint": "Fold sibling hashes into currentHash based on left/right position and compare with expectedRoot.",
    "eTest": "const proof = [{ position: 'right', hash: 'hB' }, { position: 'left', hash: 'hCD' }];\n// Leaf hA + right hB = H(hA+hB); left hCD + H(hA+hB) = H(hCD+H(hA+hB))\nconst res = verifyMerkleProof('hA', proof, 'H(hCD+H(hA+hB))');\nif (!res.verified || res.proofSteps !== 2) throw new Error('Merkle proof verification failed');",
    "aTitle": "Merkle Tree Depth Calculator",
    "aDesc": "Implement function calculateMerkleDepth(leafCount) returning `Math.ceil(Math.log2(leafCount))`.",
    "aStarter": "function calculateMerkleDepth(n) {\n  // TODO: Compute ceil(log2(n)).\n  \n}",
    "aHint": "Compute ceil(log2(n)).",
    "aTest": "if (calculateMerkleDepth(8) !== 3 || calculateMerkleDepth(1024) !== 10) throw new Error('Merkle depth failed');"
  },
  {
    "day": 3,
    "title": "Smart Contract Engineering: ERC Standards, Flash Loans, Gas Packing & Oracles",
    "desc": "Generate elliptic curve (secp256k1) private keys, derive uncompressed public keys, and calculate Ethereum checksum wallet addresses (Keccak-256 slice).",
    "syllabus": [
      "Elliptic Curve Digital Signature Algorithm (ECDSA on `secp256k1`).",
      "Private Key ($k \\in [1, 2^{256}-1]$) to Public Key ($K = k \\cdot G$).",
      "Ethereum Address Derivation: $\\text{Keccak-256}(K)[12..31]$ with EIP-55 Mixed-Case Checksum."
    ],
    "eTitle": "Ethereum Address Derivation Engine",
    "eDesc": "Implement function deriveEthereumAddress(publicKeyHex) extracting last 20 bytes from simulated 32-byte Keccak hash.",
    "eStarter": "function deriveEthereumAddress(pubKeyHex) {\n  // TODO: Slice the last 40 hex characters (20 bytes) of the hash.\n  \n}",
    "eHint": "Slice the last 40 hex characters (20 bytes) of the hash.",
    "eTest": "const res = deriveEthereumAddress('04a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef');\nif (res.addressBytes !== 20 || !res.ethereumAddress.startsWith('0x') || res.ethereumAddress.length !== 42) throw new Error('Ethereum address derivation failed');",
    "aTitle": "Private Key Hex Formatter",
    "aDesc": "Implement function formatPrivateKeyHex(rawHex) ensuring 64 hex characters (32 bytes).",
    "aStarter": "function formatPrivateKeyHex(h) {\n  // TODO: Pad to 64 hex chars with 0x.\n  \n}",
    "aHint": "Pad to 64 hex chars with 0x.",
    "aTest": "if (formatPrivateKeyHex('1a').length !== 66) throw new Error('Key format failed');"
  },
  {
    "day": 4,
    "title": "Advanced Smart Contract Auditing, Foundry Invariant Fuzzing & Governance Protocols",
    "desc": "Simulate Proof of Work consensus: Target Difficulty thresholds, Nonce iteration, Block hashing, and Hashrate difficulty adjustment algorithms.",
    "syllabus": [
      "Proof of Work condition: $\\text{SHA-256}(\\text{SHA-256}(\\text{BlockHeader} + \\text{Nonce})) < \\text{Target}$.",
      "Mining Nonce search loop & Hashrate difficulty readjustment every 2016 blocks.",
      "51% Attack dynamics and Byzantine honest majority assumptions."
    ],
    "eTitle": "Proof of Work Nonce Miner Simulator",
    "eDesc": "Implement function mineBlockPow(blockData, targetLeadingZeroes = 3) searching for integer nonce that produces required leading zeroes.",
    "eStarter": "function mineBlockPow(data, leadingZeroes = 3) {\n  // TODO: Iterate nonce until hash starts with targetPrefix zeroes.\n  \n}",
    "eHint": "Iterate nonce until hash starts with targetPrefix zeroes.",
    "eTest": "const res = mineBlockPow('BlockPayload_01', 2);\nif (!res.mined || !res.blockHash.startsWith('0x00')) throw new Error('PoW mining failed to find valid nonce');",
    "aTitle": "Hashrate Target Calculator",
    "aDesc": "Implement function getTargetFromDifficulty(difficulty) returning `(2**256) / difficulty`.",
    "aStarter": "function getTargetFromDifficulty(d) {\n  // TODO: Divide max by difficulty.\n  \n}",
    "aHint": "Divide max by difficulty.",
    "aTest": "if (getTargetFromDifficulty(10) !== 100000) throw new Error('Target calc failed');"
  },
  {
    "day": 5,
    "title": "Zero-Knowledge Proofs (Groth16), Account Abstraction (ERC-4337), Rollups & MEV-Boost",
    "desc": "Milestone 1: Build a complete verifiable blockchain engine: Block header structuring, Merkle Tree transaction batching, SHA-256 block hash chaining, Nonce mining, and Tamper detection.",
    "syllabus": [
      "Full Block Header Schema: Index, Timestamp, PreviousHash, MerkleRoot, Nonce, Difficulty.",
      "Chain Validation: Detecting single-bit data modifications in transaction history.",
      "Cryptographic ledger state integrity verification."
    ],
    "eTitle": "Blockchain Master Ledger Verifier Engine",
    "eDesc": "Implement function auditMasterLedger(blockchain) executing full cryptographic chain validation, Merkle proof checks, and PoW nonce audits.",
    "eStarter": "function auditMasterLedger(chain) {\n  // TODO: Verify chain hashes and count transactions across all blocks.\n  \n}",
    "eHint": "Verify chain hashes and count transactions across all blocks.",
    "eTest": "const chain = [{ index: 0, hash: 'h0', previousHash: '0x0', transactions: ['tx0'] }, { index: 1, hash: 'h1', previousHash: 'h0', transactions: ['tx1', 'tx2'] }];\nconst res = auditMasterLedger(chain);\nif (!res.isLedgerValid || res.totalTransactionsProcessed !== 3 || res.securityStatus !== 'MASTER_LEDGER_INTEGRITY_CERTIFIED') throw new Error('Milestone 1 ledger audit failed');",
    "aTitle": "Block Header Serializer",
    "aDesc": "Implement function serializeBlockHeader(block) returning concatenated header string.",
    "aStarter": "function serializeBlockHeader(b) {\n  // TODO: Concatenate index, previousHash, merkleRoot, nonce.\n  \n}",
    "aHint": "Concatenate index, previousHash, merkleRoot, nonce.",
    "aTest": "if (!serializeBlockHeader({ index: 1, previousHash: 'h0', merkleRoot: 'mr1', nonce: 42 }).includes('mr1')) throw new Error('Serializer failed');"
  },
  {
    "day": 6,
    "title": "Proof of Stake (PoS), Validators, Casper FFG & Slashing Conditions",
    "desc": "Analyze modern Proof of Stake consensus: Ethereum 2.0 Gasper (Casper FFG + LMD GHOST), 32 ETH Validator staking, Epoch Checkpointing, and Slashing for double signing.",
    "syllabus": [
      "Proof of Stake Architecture: 32 ETH Staking deposits, Committee selection via RANDAO.",
      "Casper FFG 2/3 Supermajority Finality & Epoch Checkpoints (32 slots = 6.4 minutes).",
      "Slashing Penalties: Double Proposing, Double Voting (Surround Vote), and Inactivity Leaks."
    ],
    "eTitle": "PoS Double-Voting Slashing Detector",
    "eDesc": "Implement function evaluateSlashingCondition(attestationA, attestationB) detecting if a validator signed two conflicting blocks in the same epoch.",
    "eStarter": "function evaluateSlashingCondition(attA, attB) {\n  // TODO: Check if same validator voted for different target roots in the same epoch.\n  \n}",
    "eHint": "Check if same validator voted for different target roots in the same epoch.",
    "eTest": "const att1 = { validatorPubkey: '0xVal1', targetEpoch: 100, targetRoot: '0xRootA' };\nconst att2 = { validatorPubkey: '0xVal1', targetEpoch: 100, targetRoot: '0xRootB' }; // Malicious double vote\nconst res = evaluateSlashingCondition(att1, att2);\nif (!res.slashed || res.penaltyEth !== 1.0 || res.reason !== 'SLASHABLE_OFFENSE_DOUBLE_VOTING') throw new Error('PoS slashing detection failed');",
    "aTitle": "Epoch Slot Number Calculator",
    "aDesc": "Implement function getEpochFromSlot(slotNumber) returning `Math.floor(slotNumber / 32)`.",
    "aStarter": "function getEpochFromSlot(s) {\n  // TODO: Divide slot number by 32.\n  \n}",
    "aHint": "Divide slot number by 32.",
    "aTest": "if (getEpochFromSlot(64) !== 2 || getEpochFromSlot(31) !== 0) throw new Error('Slot epoch calc failed');"
  },
  {
    "day": 7,
    "title": "UTXO vs Account-Based State Models: Bitcoin Script, World State Trie, Nonces & State Bloat",
    "desc": "Compare Bitcoin UTXO (Unspent Transaction Output) and Ethereum Account/Nonce state machines: Double spend prevention, State bloat, and Parallel transaction validation.",
    "syllabus": [
      "Bitcoin UTXO Model: Inputs consume complete outputs, produce new UTXOs + change.",
      "Ethereum Account Model: Global World State Trie mapping `Address => { nonce, balance, storageRoot, codeHash }`.",
      "Replay Attack Protection via Account Nonces ($N_{\\text{tx}} = N_{\\text{account}}$)."
    ],
    "eTitle": "UTXO Transaction Balance & Change Calculator",
    "eDesc": "Implement function processUtxoTransaction(inputs, recipients, feeSats = 1000) calculating outputs and change UTXO.",
    "eStarter": "function processUtxoTransaction(inputs, recipients, fee = 1000) {\n  // TODO: Compute total inputs minus sent amounts and miner fee to find change.\n  \n}",
    "eHint": "Compute total inputs minus sent amounts and miner fee to find change.",
    "eTest": "const inputs = [{ txid: 'tx1', valueSats: 50000 }, { txid: 'tx2', valueSats: 30000 }]; // 80k sats\nconst recipients = [{ address: 'Bob', amountSats: 60000 }];\nconst res = processUtxoTransaction(inputs, recipients, 2000);\nif (!res.success || res.changeUtxoSats !== 18000) throw new Error('UTXO transaction calculation failed');",
    "aTitle": "Account Nonce Incrementor",
    "aDesc": "Implement function validateAndIncrementNonce(accountNonce, txNonce) returning `txNonce === accountNonce`.",
    "aStarter": "function validateAndIncrementNonce(accN, txN) {\n  // TODO: Verify txNonce equals accountNonce.\n  \n}",
    "aHint": "Verify txNonce equals accountNonce.",
    "aTest": "if (!validateAndIncrementNonce(5, 5).valid) throw new Error('Nonce valid failed');"
  },
  {
    "day": 8,
    "title": "EVM Architecture: 256-Bit Stack, Memory Expansion, Storage Slots & Opcode Execution",
    "desc": "Master the Ethereum Virtual Machine (EVM): 256-bit Word Stack (1024 depth limit), Volatile Byte Memory (`mload`/`mstore`), Persistent Storage Slots (`sload`/`sstore` 20,000 gas), and Opcodes.",
    "syllabus": [
      "EVM Memory Architecture: Stack (256-bit words), Memory (Byte-addressable volatile), Storage (256-bit key-value persistent).",
      "Gas Costs: `ADD` (3 gas) vs `SLOAD` (2100 cold / 100 warm gas) vs `SSTORE` (20,000 gas initial write).",
      "EVM Execution Cycle: PC counter, Bytecode opcode decoding, Gas metering, and Stack underflow/overflow bounds."
    ],
    "eTitle": "EVM 256-Bit Stack Machine Simulator",
    "eDesc": "Implement function simulateEvmBytecode(opcodes) executing `PUSH1`, `ADD`, `SUB`, `MUL`, and `DUP1` on an EVM stack.",
    "eStarter": "function simulateEvmBytecode(ops) {\n  // TODO: Implement stack operations PUSH1, ADD, MUL, DUP1.\n  \n}",
    "eHint": "Implement stack operations PUSH1, ADD, MUL, DUP1.",
    "eTest": "const ops = ['PUSH1_10', 'PUSH1_20', 'ADD', 'DUP1', 'MUL']; // (10+20)=30 -> DUP1=30,30 -> MUL=900\nconst res = simulateEvmBytecode(ops);\nif (res.finalStackTop !== 900 || res.stackDepth !== 1) throw new Error('EVM stack execution simulator failed');",
    "aTitle": "EVM Storage Cost Estimator",
    "aDesc": "Implement function estimateStorageGas(coldSlotsCount) returning `coldSlotsCount * 20000`.",
    "aStarter": "function estimateStorageGas(n) {\n  // TODO: Multiply slot count by 20,000 gas.\n  \n}",
    "aHint": "Multiply slot count by 20,000 gas.",
    "aTest": "if (estimateStorageGas(3) !== 60000) throw new Error('Storage gas failed');"
  },
  {
    "day": 9,
    "title": "Solidity Data Types, Struct Packing, Enums & Memory vs Storage Semantics",
    "desc": "Master Solidity fundamental types: `uint256`, `address`, `bytes32`, `bool`, Struct packing, Enums, and explicit type casting.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Solidity Data Types, Structs & Enums.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Solidity Data Type Size & Range Calculator",
    "eDesc": "Implement function getSolidityTypeMax(typeName) returning max integer boundaries for `uint8`, `uint16`, `uint64`, `uint256`.",
    "eStarter": "function getSolidityTypeMax(type) {\n  // TODO: Return max values for uint8, uint16, uint64, uint256.\n  \n}",
    "eHint": "Return max values for uint8, uint16, uint64, uint256.",
    "eTest": "if (getSolidityTypeMax('uint8').max !== 255 || getSolidityTypeMax('uint16').bytes !== 2) throw new Error('Solidity type range failed');",
    "aTitle": "Address Zero Verifier",
    "aDesc": "Implement function isZeroAddress(addr) returning true if address is `0x0000000000000000000000000000000000000000`.",
    "aStarter": "function isZeroAddress(a) {\n  // TODO: Check regex for 40 zeroes.\n  \n}",
    "aHint": "Check regex for 40 zeroes.",
    "aTest": "if (!isZeroAddress('0x0000000000000000000000000000000000000000')) throw new Error('Zero address failed');"
  },
  {
    "day": 10,
    "title": "Solidity Mappings, Dynamic Arrays & Decentralized Vault Engine (Milestone 2 Capstone)",
    "desc": "Structure smart contract state: `mapping(address => uint256)`, Dynamic vs Fixed Arrays, `memory` vs `storage` pointers, and array delete semantics.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Solidity Mappings, Arrays & Memory vs Storage.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Solidity Mapping Hash Location Calculator",
    "eDesc": "Implement function calculateMappingStorageSlot(keyAddress, mapSlotIndex = 0) computing Keccak-256 storage slot location.",
    "eStarter": "function calculateMappingStorageSlot(key, slotIndex = 0) {\n  // TODO: Simulate keccak256(paddedKey + paddedSlot).\n  \n}",
    "eHint": "Simulate keccak256(paddedKey + paddedSlot).",
    "eTest": "const res = calculateMappingStorageSlot('0x1234567890123456789012345678901234567890', 2);\nif (res.status !== 'MAPPING_STORAGE_SLOT_LOCATED' || res.baseSlot !== 2) throw new Error('Mapping slot calculation failed');",
    "aTitle": "Array Pop Gas Calculator",
    "aDesc": "Implement function calculateArrayPopRefund(elementsPopped) returning gas refund.",
    "aStarter": "function calculateArrayPopRefund(n) {\n  // TODO: Multiply elements by 4800 gas refund.\n  \n}",
    "aHint": "Multiply elements by 4800 gas refund.",
    "aTest": "if (calculateArrayPopRefund(2) !== 9600) throw new Error('Pop refund failed');"
  },
  {
    "day": 11,
    "title": "Reentrancy Attacks, the Checks-Effects-Interactions Pattern & Control Flow Hijacking",
    "desc": "Write secure Solidity functions: Visibility (`public`, `external`, `internal`, `private`), State mutability (`view`, `pure`, `payable`), Custom Modifiers (`onlyOwner`), and `receive()` / `fallback()` ether handlers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Functions, Modifiers, View/Pure & Fallback/Receive.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Solidity Function Modifier Execution Checker",
    "eDesc": "Implement function executeFunctionWithModifier(callerAddress, ownerAddress, amount, isContractPaused) validating modifier guard assertions before executing logic.",
    "eStarter": "function executeFunctionWithModifier(caller, owner, amount, isPaused) {\n  // TODO: Verify not paused, caller is owner, and amount > 0.\n  \n}",
    "eHint": "Verify not paused, caller is owner, and amount > 0.",
    "eTest": "const ok = executeFunctionWithModifier('0xOwner', '0xOwner', 100, false);\nconst bad = executeFunctionWithModifier('0xAttacker', '0xOwner', 100, false);\nif (!ok.success || bad.success || bad.revertReason !== 'OWNABLE_CALLER_NOT_OWNER') throw new Error('Modifier check failed');",
    "aTitle": "Ether Receiver Selector",
    "aDesc": "Implement function resolveEtherHandler(hasMsgData) returning `receive()` if empty, else `fallback()`.",
    "aStarter": "function resolveEtherHandler(hasData) {\n  // TODO: Empty data triggers receive(), data triggers fallback().\n  \n}",
    "aHint": "Empty data triggers receive(), data triggers fallback().",
    "aTest": "if (resolveEtherHandler(false) !== 'receive()') throw new Error('Receive resolve failed');"
  },
  {
    "day": 12,
    "title": "OpenZeppelin ReentrancyGuard, Transient Storage (EIP-1153) Locks & Mutex Patterns",
    "desc": "Pack variables into 32-byte storage slots to save 40,000 gas: Multiple `uint128`, `uint64`, `address` (20 bytes), and `bool` (1 byte) in single slots.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Storage Slot Packing & Gas Optimization.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Solidity 32-Byte Storage Slot Packer",
    "eDesc": "Implement function packVariablesIntoSlots(variableList) calculating exact number of 32-byte slots allocated based on variable byte sizes.",
    "eStarter": "function packVariablesIntoSlots(vars) {\n  // TODO: Accumulate bytes up to 32 per slot; create new slot when exceeding 32 bytes.\n  \n}",
    "eHint": "Accumulate bytes up to 32 per slot; create new slot when exceeding 32 bytes.",
    "eTest": "const vars = [{ bytes: 20 }, { bytes: 8 }, { bytes: 4 }]; // Exactly 32 bytes -> 1 slot!\nconst res = packVariablesIntoSlots(vars);\nif (res.totalSlotsUsed !== 1 || res.totalGasSavingsVsUnpacked !== 40000) throw new Error('Slot packing calculation failed');",
    "aTitle": "Slot Space Remaining Calculator",
    "aDesc": "Implement function getRemainingSlotBytes(usedBytes) returning `32 - usedBytes`.",
    "aStarter": "function getRemainingSlotBytes(u) {\n  // TODO: Subtract used from 32.\n  \n}",
    "aHint": "Subtract used from 32.",
    "aTest": "if (getRemainingSlotBytes(20) !== 12) throw new Error('Remaining calc failed');"
  },
  {
    "day": 13,
    "title": "Flash Loans, Arbitrage Mechanics & ERC-3156 Standard Execution",
    "desc": "Implement the ERC-20 token standard: `totalSupply()`, `balanceOf()`, `transfer()`, `allowance()`, `approve()`, `transferFrom()`, and `Transfer`/`Approval` events.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ERC-20 Fungible Token Standard.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ERC-20 Token Transfer & Allowance Engine",
    "eDesc": "Implement function executeErc20TransferFrom(balances, allowances, spender, from, to, amount) transferring tokens under approved allowance.",
    "eStarter": "function executeErc20TransferFrom(balances, allowances, spender, from, to, amount) {\n  // TODO: Verify balance and allowance, decrement both, credit recipient.\n  \n}",
    "eHint": "Verify balance and allowance, decrement both, credit recipient.",
    "eTest": "const balances = { Alice: 1000, Bob: 0 };\nconst allowances = { Alice_SpenderDEX: 500 };\nconst res = executeErc20TransferFrom(balances, allowances, 'SpenderDEX', 'Alice', 'Bob', 300);\nif (!res.success || res.fromNewBalance !== 700 || res.toNewBalance !== 300 || res.remainingAllowance !== 200) throw new Error('ERC-20 transferFrom failed');",
    "aTitle": "Wei to Ether Formatter",
    "aDesc": "Implement function formatWeiToEther(weiString) returning decimal ether string.",
    "aStarter": "function formatWeiToEther(w) {\n  // TODO: Divide by 10^18.\n  \n}",
    "aHint": "Divide by 10^18.",
    "aTest": "if (formatWeiToEther('2000000000000000000') !== '2') throw new Error('Wei to Eth failed');"
  },
  {
    "day": 14,
    "title": "Price Oracle Manipulation, Uniswap TWAP & Chainlink Decentralized Oracles",
    "desc": "Mint and manage non-fungible digital assets: ERC-721 (`ownerOf()`, `safeTransferFrom()`, `tokenURI()`), ERC-1155 Multi-Token semi-fungibles, and IPFS metadata JSON.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ERC-721 & ERC-1155 Non-Fungible Tokens (NFTs).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ERC-721 NFT Mint & Ownership Transfer Engine",
    "eDesc": "Implement function transferErc721Token(nftLedger, caller, from, to, tokenId) transferring unique token with approval verification.",
    "eStarter": "function transferErc721Token(ledger, caller, from, to, tokenId) {\n  // TODO: Verify ownership, verify authorization, update owner and reset approval.\n  \n}",
    "eHint": "Verify ownership, verify authorization, update owner and reset approval.",
    "eTest": "const ledger = { 101: { owner: '0xAlice', approved: '0xOperator' } };\nconst res = transferErc721Token(ledger, '0xOperator', '0xAlice', '0xBob', 101);\nif (!res.success || res.newOwner !== '0xBob' || ledger[101].approved !== '0x0000000000000000000000000000000000000000') throw new Error('ERC-721 transfer failed');",
    "aTitle": "IPFS Token URI Resolver",
    "aDesc": "Implement function resolveIpfsUri(ipfsHash) returning `https://ipfs.io/ipfs/${ipfsHash}`.",
    "aStarter": "function resolveIpfsUri(h) {\n  // TODO: Return ipfs gateway url.\n  \n}",
    "aHint": "Return ipfs gateway url.",
    "aTest": "if (!resolveIpfsUri('Qm123').includes('Qm123')) throw new Error('IPFS resolve failed');"
  },
  {
    "day": 15,
    "title": "Milestone 3 Capstone: DeFi Lending, Collateralized Debt Positions & Automated Liquidation Engine",
    "desc": "Milestone 2: Build a production smart contract token platform: ERC-20 fungible payments, ERC-721 digital asset minting, Operator approval registries, and SafeTransfer event logging.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Complete ERC-20 / ERC-721 Decentralized Asset Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Decentralized Asset Registry Engine",
    "eDesc": "Implement function processAssetRegistryBatch(erc20Pool, nftRegistry, batchActions) executing atomic token purchases and NFT mints.",
    "eStarter": "function processAssetRegistryBatch(pool, nfts, actions) {\n  // TODO: Deduct ERC-20 payment and mint NFT to buyer.\n  \n}",
    "eHint": "Deduct ERC-20 payment and mint NFT to buyer.",
    "eTest": "const pool = { balances: { UserA: 1000 } };\nconst nfts = {};\nconst actions = [{ type: 'PURCHASE_NFT', buyer: 'UserA', price: 250, tokenId: 'NFT_1', uri: 'ipfs://Qm1' }];\nconst res = processAssetRegistryBatch(pool, nfts, actions);\nif (res.successfulTransactions !== 1 || pool.balances.UserA !== 750 || nfts.NFT_1.owner !== 'UserA') throw new Error('Milestone 2 asset registry failed');",
    "aTitle": "Asset ID Formatter",
    "aDesc": "Implement function formatAssetId(collection, id) returning `${collection}#${id}`.",
    "aStarter": "function formatAssetId(c, id) {\n  // TODO: Format collection and ID.\n  \n}",
    "aHint": "Format collection and ID.",
    "aTest": "if (formatAssetId('BoredApe', 42) !== 'BoredApe#42') throw new Error('Format failed');"
  },
  {
    "day": 16,
    "title": "ERC-20 & ERC-721 Token Engineering: Supply Invariants & Hook Exploit Protections",
    "desc": "Prevent multi-million dollar exploits (The DAO Hack): Checks-Effects-Interactions (CEI) invariant, OpenZeppelin `ReentrancyGuard` (`nonReentrant` modifier), and Mutex locks.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Reentrancy Attacks & Checks-Effects-Interactions Pattern.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Reentrancy Vulnerability Detector & CEI Enforcer",
    "eDesc": "Implement function executeWithdrawalWithCei(userBalances, caller, withdrawAmount) updating balance state BEFORE transferring external funds.",
    "eStarter": "function executeWithdrawalWithCei(balances, caller, amount) {\n  // TODO: Verify state deduction occurs before external transfer.\n  \n}",
    "eHint": "Verify state deduction occurs before external transfer.",
    "eTest": "const balances = { '0xUser': 500 };\nconst res = executeWithdrawalWithCei(balances, '0xUser', 500);\nif (!res.success || balances['0xUser'] !== 0 || !res.isCeiCompliant) throw new Error('CEI withdrawal failed');",
    "aTitle": "Reentrancy Lock Status Checker",
    "aDesc": "Implement function checkMutexLock(lockState) returning true if unlocked (state === 1).",
    "aStarter": "function checkMutexLock(s) {\n  // TODO: 1 = Unlocked, 2 = Locked.\n  \n}",
    "aHint": "1 = Unlocked, 2 = Locked.",
    "aTest": "if (!checkMutexLock(1) || checkMutexLock(2)) throw new Error('Lock check failed');"
  },
  {
    "day": 17,
    "title": "Gasless Approvals, EIP-2612 Permit & EIP-712 Typed Structured Data Hashing",
    "desc": "Manage privileged administrative permissions: `Ownable` single-admin pattern, `AccessControl` multi-role manager (`ADMIN_ROLE`, `MINTER_ROLE`), and 2-step Ownership Transfers (`Ownable2Step`).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Smart Contract Access Control & Role-Based Security.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Role-Based Access Control (RBAC) Verifier",
    "eDesc": "Implement function verifyUserRole(roleRegistry, userAddress, requiredRole) verifying user possesses required keccak role hash.",
    "eStarter": "function verifyUserRole(registry, user, role) {\n  // TODO: Check if user has specific role or default admin role.\n  \n}",
    "eHint": "Check if user has specific role or default admin role.",
    "eTest": "const reg = { '0xalice': ['MINTER_ROLE'], '0xbob': ['DEFAULT_ADMIN_ROLE'] };\nif (!verifyUserRole(reg, '0xAlice', 'MINTER_ROLE').hasAccess || !verifyUserRole(reg, '0xBob', 'MINTER_ROLE').hasAccess) throw new Error('RBAC verification failed');",
    "aTitle": "Role Hash Generator",
    "aDesc": "Implement function getRoleHash(roleName) returning `0x_ROLE_${roleName}`.",
    "aStarter": "function getRoleHash(r) {\n  // TODO: Format role hash string.\n  \n}",
    "aHint": "Format role hash string.",
    "aTest": "if (getRoleHash('ADMIN') !== '0x_ROLE_ADMIN') throw new Error('Role hash failed');"
  },
  {
    "day": 18,
    "title": "Advanced EVM Gas Optimization, Custom Errors & Yul Inline Assembly",
    "desc": "Build decentralized exchanges (Uniswap v2): Constant Product Formula ($x \\cdot y = k$), 0.3% LP Swap Fees, Slippage calculation, and Impermanent Loss.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of DeFi Automated Market Makers (AMM) & Constant Product ($x \\cdot y = k$).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Uniswap v2 Constant Product Swap Output Calculator",
    "eDesc": "Implement function calculateAmmSwapOutput(reserveIn, reserveOut, amountIn, feeBps = 30) computing exact tokens received with 0.3% fee ($997 / 1000$).",
    "eStarter": "function calculateAmmSwapOutput(reserveIn, reserveOut, amountIn, feeBps = 30) {\n  // TODO: Compute amountInWithFee * reserveOut / (reserveIn * 1000 + amountInWithFee).\n  \n}",
    "eHint": "Compute amountInWithFee * reserveOut / (reserveIn * 1000 + amountInWithFee).",
    "eTest": "const res = calculateAmmSwapOutput(100000, 100000, 1000, 30); // 100k pool swapping 1k\nif (res.amountOut < 985 || res.amountOut > 990 || res.feePaid !== 30) throw new Error('Uniswap v2 AMM swap calculation failed');",
    "aTitle": "Constant Product K Calculator",
    "aDesc": "Implement function calculateK(reserveA, reserveB) returning `reserveA * reserveB`.",
    "aStarter": "function calculateK(a, b) {\n  // TODO: Multiply reserveA by reserveB.\n  \n}",
    "aHint": "Multiply reserveA by reserveB.",
    "aTest": "if (calculateK(1000, 2000) !== 2000000) throw new Error('K calc failed');"
  },
  {
    "day": 19,
    "title": "Smart Contract Upgradeability Patterns, Transparent vs UUPS Proxies & Storage Collisions",
    "desc": "Execute multi-million dollar uncollateralized loans in a single transaction: Aave Flash Loan lifecycle, Atomic repayment ($+ 0.09\\%$ fee), and Arbitrage routing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Flash Loans & Atomic Arbitrage Execution.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Aave Flash Loan Execution & Repayment Validator",
    "eDesc": "Implement function executeFlashLoanCycle(loanAmount, profitFromArbitrage, feeBps = 9) verifying loan + fee is returned atomically in same transaction.",
    "eStarter": "function executeFlashLoanCycle(amount, profit, feeBps = 9) {\n  // TODO: Verify profit covers flash loan fee and return total owed.\n  \n}",
    "eHint": "Verify profit covers flash loan fee and return total owed.",
    "eTest": "const res = executeFlashLoanCycle(1000000, 2500, 9); // $1M loan with $2500 profit\nif (!res.transactionSuccess || res.flashLoanFee !== 900 || res.netArbitrageProfit !== 1600) throw new Error('Flash loan execution failed');",
    "aTitle": "Flash Loan Fee Calculator",
    "aDesc": "Implement function getFlashLoanFee(amount, bps = 9) returning `amount * (bps / 10000)`.",
    "aStarter": "function getFlashLoanFee(a, bps = 9) {\n  // TODO: Multiply amount by bps / 10000.\n  \n}",
    "aHint": "Multiply amount by bps / 10000.",
    "aTest": "if (getFlashLoanFee(100000, 9) !== 90) throw new Error('Fee calc failed');"
  },
  {
    "day": 20,
    "title": "Milestone 4 Capstone: Enterprise Modular Upgradeable Protocol Architecture",
    "desc": "Connect smart contracts to real-world off-chain data: Chainlink Data Feeds (`AggregatorV3Interface`), Decimals normalization, Stale price checks, and Chainlink VRF.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Chainlink Oracles & Decentralized Price Feeds.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Chainlink Price Feed Freshness & Decimals Normalizer",
    "eDesc": "Implement function processOraclePrice(roundData, heartbeatTimeoutSec = 3600, currentTimestamp = 1700003000) verifying price is fresh and non-zero.",
    "eStarter": "function processOraclePrice(round, heartbeat = 3600, now = 1700003000) {\n  // TODO: Verify price > 0 and (now - updatedAt) <= heartbeat.\n  \n}",
    "eHint": "Verify price > 0 and (now - updatedAt) <= heartbeat.",
    "eTest": "const round = { answer: 250050000000n, decimals: 8, updatedAt: 1700002000 };\nconst res = processOraclePrice(round, 3600, 1700003000);\nif (!res.valid || res.usdPrice !== 2500.5) throw new Error('Oracle price processing failed');",
    "aTitle": "Decimals Scaler",
    "aDesc": "Implement function scalePriceDecimals(priceRaw, dec) returning `priceRaw / (10**dec)`.",
    "aStarter": "function scalePriceDecimals(p, d) {\n  // TODO: Divide by 10^decimals.\n  \n}",
    "aHint": "Divide by 10^decimals.",
    "aTest": "if (scalePriceDecimals(30000000000, 8) !== 300) throw new Error('Scale failed');"
  },
  {
    "day": 21,
    "title": "Automated Market Makers (AMM) & Constant Product Invariant (x * y = k)",
    "desc": "Milestone 3: Build a production DeFi protocol: Uniswap v2 AMM Liquidity Pools, Chainlink Oracle valuation, Flash Loan atomic arbitrage, and Reentrancy-safe CEI lending vault.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Production DeFi Lending & AMM DEX Protocol.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "DeFi Master Protocol Execution Engine",
    "eDesc": "Implement function executeDefiProtocolCycle(liquidityPool, oraclePrice, borrowerAccount) executing collateralized loan with oracle health factor verification.",
    "eStarter": "function executeDefiProtocolCycle(pool, oracle, user) {\n  // TODO: Compute collateralUsd = eth * price, maxBorrow = 75% LTV, verify healthFactor.\n  \n}",
    "eHint": "Compute collateralUsd = eth * price, maxBorrow = 75% LTV, verify healthFactor.",
    "eTest": "const res = executeDefiProtocolCycle({}, { ethUsdPrice: 2000 }, { collateralEth: 10, borrowedUsd: 10000 });\nif (!res.isSafe || res.healthFactor !== 1.5 || res.status !== 'DEFI_POSITION_SOLVENT_HEALTHY') throw new Error('Milestone 3 DeFi protocol execution failed');",
    "aTitle": "LTV Ratio Calculator",
    "aDesc": "Implement function calculateLtv(borrowed, collateral) returning `(borrowed / collateral) * 100`.",
    "aStarter": "function calculateLtv(b, c) {\n  // TODO: Compute b / c * 100.\n  \n}",
    "aHint": "Compute b / c * 100.",
    "aTest": "if (calculateLtv(750, 1000) !== 75.0) throw new Error('LTV failed');"
  },
  {
    "day": 22,
    "title": "Concentrated Liquidity Mathematics: Uniswap v3 Ticks, SqrtPriceX96 & Virtual Reserves",
    "desc": "Upgrade smart contract code without losing state: Proxy pattern (`DELEGATECALL`), Storage collisions, Transparent Proxy vs Universal Upgradeable Proxy Standard (UUPS).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Upgradeable Smart Contracts: Proxies & Delegatecall.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Proxy Delegatecall Storage Layout Collision Detector",
    "eDesc": "Implement function checkStorageCollisions(proxySlots, implV1Slots, implV2Slots) verifying implementation v2 preserves existing storage slot variable ordering.",
    "eStarter": "function checkStorageCollisions(proxySlots, v1, v2) {\n  // TODO: Verify that v2 has matching variable names and types for all existing v1 slots.\n  \n}",
    "eHint": "Verify that v2 has matching variable names and types for all existing v1 slots.",
    "eTest": "const v1 = [{ name: 'owner', type: 'address' }, { name: 'balance', type: 'uint256' }];\nconst v2Valid = [{ name: 'owner', type: 'address' }, { name: 'balance', type: 'uint256' }, { name: 'fee', type: 'uint256' }];\nconst v2Bad = [{ name: 'balance', type: 'uint256' }, { name: 'owner', type: 'address' }];\nif (!checkStorageCollisions([], v1, v2Valid).safeToUpgrade || checkStorageCollisions([], v1, v2Bad).safeToUpgrade) throw new Error('Storage collision detector failed');",
    "aTitle": "Implementation Slot Calculator",
    "aDesc": "Implement function getEip1967ImplementationSlot() returning EIP-1967 keccak storage slot. When called with an `inputTag` string, return `{ canonical: \"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc\", provided: String(inputTag).trim(), isMatch }` comparing case-insensitively.",
    "aStarter": "function getEip1967ImplementationSlot(inputTag) {\n  // TODO: Return \"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc\" when called with no arguments, or { canonical: \"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc\", provided: String(inputTag).trim(), isMatch: boolean }\n  \n}",
    "aHint": "If inputTag === undefined return \"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc\"; otherwise trim and compare case-insensitively against \"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc\".",
    "aTest": "if (getEip1967ImplementationSlot() !== \"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc\") throw new Error('Canonical string must equal ' + \"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc\");\nconst okMatch = getEip1967ImplementationSlot(\"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc\".toLowerCase());\nconst badMatch = getEip1967ImplementationSlot('INVALID_TAG_XYZ');\nif (!okMatch || !okMatch.isMatch || badMatch.isMatch || okMatch.canonical !== \"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc\") throw new Error('Case-insensitive canonical tag verification failed');"
  },
  {
    "day": 23,
    "title": "Liquidity Provisioning, Impermanent Loss & Range Orders in Concentrated AMMs",
    "desc": "Connect frontend applications to Ethereum: JSON-RPC (`eth_call`, `eth_sendRawTransaction`), `ethers.Contract` ABI interfaces, Viem client, and MetaMask wallet signers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Ethers.js & Viem: Web3 JSON-RPC Providers & Signers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Web3 JSON-RPC Request Formatter & Response Parser",
    "eDesc": "Implement function formatJsonRpcCall(method, params = [], id = 1) returning standard JSON-RPC 2.0 payload.",
    "eStarter": "function formatJsonRpcCall(method, params = [], id = 1) {\n  // TODO: Construct jsonrpc 2.0 object.\n  \n}",
    "eHint": "Construct jsonrpc 2.0 object.",
    "eTest": "const rpc = formatJsonRpcCall('eth_getBalance', ['0xAlice', 'latest'], 42);\nif (rpc.jsonrpc !== '2.0' || rpc.id !== 42 || rpc.method !== 'eth_getBalance') throw new Error('JSON-RPC format failed');",
    "aTitle": "Gas Hex Converter",
    "aDesc": "Implement function hexToDecimalGas(hexString) returning parsed integer.",
    "aStarter": "function hexToDecimalGas(h) {\n  // TODO: Parse hex string to integer.\n  \n}",
    "aHint": "Parse hex string to integer.",
    "aTest": "if (hexToDecimalGas('0x5208') !== 21000) throw new Error('Hex gas parse failed');"
  },
  {
    "day": 24,
    "title": "Flash Swaps, Multi-Hop Routing & Slippage Defenses in Concentrated AMMs",
    "desc": "Estimate and optimize Ethereum transaction gas: EIP-1559 Type-2 transactions, BaseFee burn mechanism, PriorityFee (Miner Tip), and MaxFeePerGas limits.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of EIP-1559 Dynamic Gas Fees: BaseFee & PriorityFee (Miner Tip).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "EIP-1559 Gas Fee & Cost Estimator",
    "eDesc": "Implement function estimateEip1559GasCost(baseFeeGwei, priorityFeeGwei, gasUnits = 21000) calculating total cost in Gwei and Ether.",
    "eStarter": "function estimateEip1559GasCost(baseGwei, tipGwei, units = 21000) {\n  // TODO: Compute effectiveFee = base + tip, multiply by gas units.\n  \n}",
    "eHint": "Compute effectiveFee = base + tip, multiply by gas units.",
    "eTest": "const res = estimateEip1559GasCost(30, 2, 21000); // 32 Gwei total\nif (res.effectiveGasPriceGwei !== 32 || res.totalTransactionCostEth !== 0.000672) throw new Error('EIP-1559 gas calculation failed');",
    "aTitle": "Next BaseFee Estimator",
    "aDesc": "Implement function calculateNextBaseFee(currentBase, gasUsed, gasTarget = 15000000) returning updated baseFee.",
    "aStarter": "function calculateNextBaseFee(b, used, target = 15000000) {\n  // TODO: Adjust baseFee up or down based on target gas.\n  \n}",
    "aHint": "Adjust baseFee up or down based on target gas.",
    "aTest": "if (calculateNextBaseFee(100, 15000000) !== 100) throw new Error('Basefee adjust failed');"
  },
  {
    "day": 25,
    "title": "⭐ Milestone 5 Capstone: Decentralized Exchange & Concentrated Liquidity AMM Engine",
    "desc": "Query blockchain event history at lightning speed: Smart Contract Event logs (`Indexed` topics in Bloom filters), GraphQL schema definitions, and Subgraph mappings (`AssemblyScript`).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Event Indexing & Subgraphs with The Graph Protocol.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Contract Event Topic Hash Filter",
    "eDesc": "Implement function filterContractLogs(logs, targetTopic0, targetAddress) filtering raw blockchain logs matching contract event signature.",
    "eStarter": "function filterContractLogs(logs, topic0, contractAddr) {\n  // TODO: Filter by contract address and topic0.\n  \n}",
    "eHint": "Filter by contract address and topic0.",
    "eTest": "const logs = [{ address: '0xContract', topics: ['0xTransferTopic', '0xAlice', '0xBob'] }, { address: '0xOther', topics: ['0xTransferTopic'] }];\nconst res = filterContractLogs(logs, '0xTransferTopic', '0xContract');\nif (res.matchedEventsCount !== 1) throw new Error('Log filter failed');",
    "aTitle": "Event Signature Hash Formatter",
    "aDesc": "Implement function formatEventSignature(name, params) returning signature string.",
    "aStarter": "function formatEventSignature(n, p) {\n  // TODO: Format event signature.\n  \n}",
    "aHint": "Format event signature.",
    "aTest": "if (formatEventSignature('Transfer', ['address','address','uint256']) !== 'Transfer(address,address,uint256)') throw new Error('Sig format failed');"
  },
  {
    "day": 26,
    "title": "Decentralized Lending Protocols & Over-Collateralization (Compound & Aave Architecture, Interest Rate Models & Health Factors)",
    "desc": "Scale Ethereum by 100x: Optimistic Rollups (7-day fraud proof challenge window, Arbitrum/Optimism Nitro) vs ZK-Rollups (Validity proofs, Zero-Knowledge SNARKs/STARKs).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Layer 2 Rollups: Optimistic vs ZK-Rollups (SNARKs/STARKs).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Layer 2 Rollup Transaction Compression & Gas Savings Engine",
    "eDesc": "Implement function calculateRollupSavings(l1TxCostGas = 100000, l2BatchSize = 500, calldataGasPerTx = 2100) calculating gas savings percentage.",
    "eStarter": "function calculateRollupSavings(l1Cost = 100000, batchSize = 500, calldataCost = 2100) {\n  // TODO: Amortize L1 base cost across batch and compute savings percentage.\n  \n}",
    "eHint": "Amortize L1 base cost across batch and compute savings percentage.",
    "eTest": "const res = calculateRollupSavings(100000, 500, 2100);\nif (res.gasSavingsPercent < 97.0 || res.costPerTxL2Gas > 2500) throw new Error('Rollup gas savings calculation failed');",
    "aTitle": "Optimistic Challenge Window Formatter",
    "aDesc": "Implement function formatChallengeWindow(days = 7) returning `${days * 86400} seconds (${days} days)`.",
    "aStarter": "function formatChallengeWindow(d = 7) {\n  // TODO: Convert days to seconds.\n  \n}",
    "aHint": "Convert days to seconds.",
    "aTest": "if (!formatChallengeWindow(7).includes('604800 seconds')) throw new Error('Window format failed');"
  },
  {
    "day": 27,
    "title": "Liquidation Engines, Keeper Bots & Bad Debt Socialization",
    "desc": "Eliminate seed phrases and gas hurdles: `UserOperation` pseudo-transactions, Bundlers, Alternative Mempools, EntryPoint contract, and Gasless Paymasters.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Account Abstraction (ERC-4337): Smart Accounts & Paymasters.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ERC-4337 UserOperation Hash & Validation Engine",
    "eDesc": "Implement function validateUserOperation(userOp, entryPointAddress, chainId = 1) verifying paymaster signature and gas bounds.",
    "eStarter": "function validateUserOperation(op, entryPoint, chainId = 1) {\n  // TODO: Verify gas limits, nonce, and 132-char signature.\n  \n}",
    "eHint": "Verify gas limits, nonce, and 132-char signature.",
    "eTest": "const op = { sender: '0xSmartAccount', nonce: 0, callGasLimit: 100000, verificationGasLimit: 50000, signature: '0x' + 'ab'.repeat(65), paymasterAndData: '0xPaymaster' };\nconst res = validateUserOperation(op, '0xEntryPoint');\nif (!res.isValid || !res.paymasterSponsored || res.status !== 'USER_OPERATION_VALID_FOR_BUNDLER') throw new Error('ERC-4337 UserOp validation failed');",
    "aTitle": "Paymaster Data Extractor",
    "aDesc": "Implement function extractPaymasterAddress(paymasterAndData) returning first 20 bytes (42 hex chars).",
    "aStarter": "function extractPaymasterAddress(p) {\n  // TODO: Slice first 42 chars.\n  \n}",
    "aHint": "Slice first 42 chars.",
    "aTest": "if (extractPaymasterAddress('0x1234567890123456789012345678901234567890abcdef').length !== 42) throw new Error('Paymaster extract failed');"
  },
  {
    "day": 28,
    "title": "Maximal Extractable Value (MEV): Arbitrage, Liquidations, Sandwich Attacks & Flashbots Protect",
    "desc": "Transfer tokens and call contracts across blockchains: Lock-and-Mint bridges, Burn-and-Mint, Chainlink CCIP, LayerZero omnichain endpoints, and Relayers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cross-Chain Bridges & Arbitrary Messaging Protocols.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Cross-Chain Bridge Message Payload Encoder",
    "eDesc": "Implement function encodeBridgeMessage(sourceChainId, destChainId, sender, recipient, amount, nonce) generating verifiable cross-chain payload packet.",
    "eStarter": "function encodeBridgeMessage(srcChain, dstChain, from, to, amount, nonce) {\n  // TODO: Construct structured bridge packet object.\n  \n}",
    "eHint": "Construct structured bridge packet object.",
    "eTest": "const pkt = encodeBridgeMessage(1, 42161, '0xAlice', '0xBob', 500, 101);\nif (pkt.destinationChainId !== 42161 || pkt.status !== 'BRIDGE_PACKET_ENCODED_READY_FOR_RELAYER') throw new Error('Bridge packet encoding failed');",
    "aTitle": "Chain ID Resolver",
    "aDesc": "Implement function getChainName(chainId) returning network name.",
    "aStarter": "function getChainName(id) {\n  // TODO: Map chain ID to network name.\n  \n}",
    "aHint": "Map chain ID to network name.",
    "aTest": "if (getChainName(1) !== 'Ethereum' || getChainName(42161) !== 'Arbitrum') throw new Error('Chain resolver failed');"
  },
  {
    "day": 29,
    "title": "Cross-Chain Messaging, Bridges & Interoperability (LayerZero, Chainlink CCIP, Optimistic/ZK Relays)",
    "desc": "Decentralized autonomous organizations: OpenZeppelin `Governor` contracts, Quadratic Voting, Timelock controllers, and Quorum thresholds.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of DAO Governance, Timelocks & Voting Mechanisms.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "DAO Proposal Quorum & Voting Outcome Evaluator",
    "eDesc": "Implement function evaluateDaoProposal(votesFor, votesAgainst, votesAbstain, totalTokenSupply, quorumPercent = 4) calculating if proposal passed quorum.",
    "eStarter": "function evaluateDaoProposal(vFor, vAgainst, vAbstain, totalSupply, quorumPct = 4) {\n  // TODO: Verify totalVotes >= quorumRequired and vFor > vAgainst.\n  \n}",
    "eHint": "Verify totalVotes >= quorumRequired and vFor > vAgainst.",
    "eTest": "const res = evaluateDaoProposal(60000, 20000, 5000, 1000000, 4); // 85k total votes > 40k quorum (4%)\nif (!res.proposalPassed || !res.quorumReached || res.status !== 'DAO_PROPOSAL_ACCEPTED_QUEUED_FOR_TIMELOCK') throw new Error('DAO evaluation failed');",
    "aTitle": "Timelock Delay Formatter",
    "aDesc": "Implement function formatTimelockDelay(delaySec = 172800) returning `${delaySec / 86400} days timelock delay`.",
    "aStarter": "function formatTimelockDelay(s = 172800) {\n  // TODO: Convert seconds to days.\n  \n}",
    "aHint": "Convert seconds to days.",
    "aTest": "if (!formatTimelockDelay(172800).includes('2 days')) throw new Error('Timelock format failed');"
  },
  {
    "day": 30,
    "title": "⭐ Milestone 6 / Grand Final Capstone: Sovereign DeFi Liquidity & Cross-Chain Yield Protocol Suite",
    "desc": "Final Capstone Synthesis: The complete decentralized Web3 ecosystem: Solidity smart contracts, ERC-20 staking tokens, Uniswap AMM swaps, Chainlink price oracles, Reentrancy-safe CEI execution, EIP-1559 gas management, and Ethers.js frontend RPC integration.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Enterprise Decentralized Finance (DeFi) & Staking Ecosystem.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Capstone Enterprise DeFi Ecosystem Master Controller",
    "eDesc": "Implement function executeCapstoneWeb3Cycle(tokenContract, ammPool, oracle, stakingVault, userAccount) orchestrating full smart contract workflow.",
    "eStarter": "function executeCapstoneWeb3Cycle(token, amm, oracle, vault, user) {\n  // TODO: Verify oracle price, AMM pool reserves, and user staking balance.\n  \n}",
    "eHint": "Verify oracle price, AMM pool reserves, and user staking balance.",
    "eTest": "const token = { name: 'PinIT Governance Token (PINIT)' };\nconst amm = { reserveA: 500000, reserveB: 500000 };\nconst oracle = { priceUsd: 2500 };\nconst vault = { totalStaked: 100000 };\nconst user = { stakedTokens: 5000 };\nconst res = executeCapstoneWeb3Cycle(token, amm, oracle, vault, user);\nif (!res.success || res.systemStatus !== 'ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED' || res.ammLiquidityK !== 250000000000) throw new Error('Capstone Web3 ecosystem cycle failed');",
    "aTitle": "Capstone Web3 Certification Auditor",
    "aDesc": "Implement function auditWeb3CapstoneStatus() returning certification grade. When called with `overrideProps`, return the base object merged with `overrideProps`.",
    "aStarter": "function auditWeb3CapstoneStatus(overrideProps) {\n  // TODO: Return {\"certified\":true,\"score\":\"100/100\",\"tier\":\"ENTERPRISE_BLOCKCHAIN_SMART_CONTRACTS_CERTIFIED\"} merged with optional overrideProps\n  \n}",
    "aHint": "Return { ...{\"certified\":true,\"score\":\"100/100\",\"tier\":\"ENTERPRISE_BLOCKCHAIN_SMART_CONTRACTS_CERTIFIED\"}, ...(overrideProps || {}) }.",
    "aTest": "const base = auditWeb3CapstoneStatus();\nconst custom = auditWeb3CapstoneStatus({ verifiedOverride: true });\nif (!base || !custom.verifiedOverride) throw new Error('Object configuration merge failed');"
  }
];

export const BLOCKCHAIN_30_DAYS_QUESTS: CourseQuest[] = BLOCKCHAIN_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('blockchain', idx + 1, cfg)
);
