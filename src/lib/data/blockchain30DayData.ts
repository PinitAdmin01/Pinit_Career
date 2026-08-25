import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const BLOCKCHAIN_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Blockchain Fundamentals & Distributed Ledgers",
    "desc": "Master cryptographic block structures, hash pointers ($H(B_{i-1})$), append-only immutability, and Byzantine Fault Tolerance.",
    "syllabus": [
      "Genesis block to current tip: cryptographic hash pointer chaining.",
      "Immutability guarantee: modifying 1 bit in block $k$ breaks all subsequent blocks $k+1 \\dots N$.",
      "Distributed Ledger State Transitions: $S' = \\text{APPLY}(S, \\text{TX})$."
    ],
    "eTitle": "Cryptographic Block Chain Hash Validator",
    "eDesc": "Implement function validateBlockchain(chain) verifying that each block's `previousHash` matches the exact SHA-256 hash of the preceding block.",
    "eStarter": "function validateBlockchain(chain) {\n  for (let i = 1; i < chain.length; i++) {\n    const prev = chain[i - 1];\n    const curr = chain[i];\n    // Simulated hash calculation: prev.index + prev.data + prev.previousHash\n    const expectedHash = `hash_${prev.index}_${prev.data}`;\n    if (curr.previousHash !== expectedHash) {\n      return { valid: false, tamperedBlockIndex: i, reason: 'HASH_CHAIN_INTEGRITY_VIOLATION' };\n    }\n  }\n  return { valid: true, totalBlocks: chain.length, status: 'BLOCKCHAIN_LEDGER_AUTHENTIC' };\n}",
    "eHint": "Iterate from block 1, verifying that curr.previousHash equals the computed hash of the previous block.",
    "eTest": "const validChain = [{ index: 0, data: 'genesis', previousHash: '0000' }, { index: 1, data: 'tx1', previousHash: 'hash_0_genesis' }, { index: 2, data: 'tx2', previousHash: 'hash_1_tx1' }];\nconst invalidChain = [{ index: 0, data: 'genesis', previousHash: '0000' }, { index: 1, data: 'tampered', previousHash: 'hash_0_genesis' }, { index: 2, data: 'tx2', previousHash: 'hash_1_tx1' }];\nif (!validateBlockchain(validChain).valid) throw new Error('Valid blockchain failed verification');\nif (validateBlockchain(invalidChain).valid) throw new Error('Tampered blockchain was not detected');",
    "aTitle": "Genesis Block Creator",
    "aDesc": "Implement function createGenesisBlock(timestamp = 1700000000) returning genesis block object.",
    "aStarter": "function createGenesisBlock(ts = 1700000000) { return { index: 0, timestamp: ts, data: 'GENESIS_BLOCK_PINIT', previousHash: '0x0000000000000000000000000000000000000000' }; }",
    "aHint": "Return index 0 and 0x000 previousHash.",
    "aTest": "if (createGenesisBlock().index !== 0 || !createGenesisBlock().previousHash.startsWith('0x000')) throw new Error('Genesis failed');"
  },
  {
    "day": 2,
    "title": "Cryptographic Hashing (SHA-256) & Merkle Trees",
    "desc": "Calculate SHA-256 digests, construct binary Merkle Trees for transaction blocks, and verify $O(\\log N)$ Merkle Inclusion Proofs.",
    "syllabus": [
      "Cryptographic Hash Properties: Pre-image resistance, Second pre-image resistance, Collision resistance.",
      "Merkle Tree Construction: Pairwise hashing from leaf nodes up to the single Merkle Root.",
      "Merkle Inclusion Proofs: Proving transaction existence in $O(\\log N)$ steps without downloading the full block."
    ],
    "eTitle": "Merkle Tree Root & Inclusion Proof Verifier",
    "eDesc": "Implement function verifyMerkleProof(leafHash, proofSiblings, expectedMerkleRoot) verifying cryptographic inclusion proof.",
    "eStarter": "function verifyMerkleProof(leaf, proof, expectedRoot) {\n  // proof = [{ position: 'left'|'right', hash: string }]\n  let currentHash = leaf;\n  for (const p of proof) {\n    if (p.position === 'left') {\n      currentHash = `H(${p.hash}+${currentHash})`;\n    } else {\n      currentHash = `H(${currentHash}+${p.hash})`;\n    }\n  }\n  const isVerified = (currentHash === expectedRoot);\n  return {\n    verified: isVerified,\n    calculatedRoot: currentHash,\n    expectedRoot,\n    proofSteps: proof.length\n  };\n}",
    "eHint": "Fold sibling hashes into currentHash based on left/right position and compare with expectedRoot.",
    "eTest": "const proof = [{ position: 'right', hash: 'hB' }, { position: 'left', hash: 'hCD' }];\n// Leaf hA + right hB = H(hA+hB); left hCD + H(hA+hB) = H(hCD+H(hA+hB))\nconst res = verifyMerkleProof('hA', proof, 'H(hCD+H(hA+hB))');\nif (!res.verified || res.proofSteps !== 2) throw new Error('Merkle proof verification failed');",
    "aTitle": "Merkle Tree Depth Calculator",
    "aDesc": "Implement function calculateMerkleDepth(leafCount) returning `Math.ceil(Math.log2(leafCount))`.",
    "aStarter": "function calculateMerkleDepth(n) { return Math.ceil(Math.log2(n)); }",
    "aHint": "Compute ceil(log2(n)).",
    "aTest": "if (calculateMerkleDepth(8) !== 3 || calculateMerkleDepth(1024) !== 10) throw new Error('Merkle depth failed');"
  },
  {
    "day": 3,
    "title": "Asymmetric Cryptography & Ethereum Keypairs",
    "desc": "Generate elliptic curve (secp256k1) private keys, derive uncompressed public keys, and calculate Ethereum checksum wallet addresses (Keccak-256 slice).",
    "syllabus": [
      "Elliptic Curve Digital Signature Algorithm (ECDSA on `secp256k1`).",
      "Private Key ($k \\in [1, 2^{256}-1]$) to Public Key ($K = k \\cdot G$).",
      "Ethereum Address Derivation: $\\text{Keccak-256}(K)[12..31]$ with EIP-55 Mixed-Case Checksum."
    ],
    "eTitle": "Ethereum Address Derivation Engine",
    "eDesc": "Implement function deriveEthereumAddress(publicKeyHex) extracting last 20 bytes from simulated 32-byte Keccak hash.",
    "eStarter": "function deriveEthereumAddress(pubKeyHex) {\n  // Simulated Keccak-256 hash output of uncompressed 64-byte public key:\n  const mockKeccak = `0xabcdef0123456789${pubKeyHex.slice(0, 40)}`;\n  // Last 20 bytes (40 hex chars) formatted with 0x prefix:\n  const rawAddress = `0x${mockKeccak.slice(-40).toLowerCase()}`;\n  return {\n    publicKey: pubKeyHex,\n    ethereumAddress: rawAddress,\n    addressBytes: 20,\n    status: 'ETH_ADDRESS_DERIVED_NOMINAL'\n  };\n}",
    "eHint": "Slice the last 40 hex characters (20 bytes) of the hash.",
    "eTest": "const res = deriveEthereumAddress('04a1b2c3d4e5f60718293a4b5c6d7e8f901234567890abcdef1234567890abcdef');\nif (res.addressBytes !== 20 || !res.ethereumAddress.startsWith('0x') || res.ethereumAddress.length !== 42) throw new Error('Ethereum address derivation failed');",
    "aTitle": "Private Key Hex Formatter",
    "aDesc": "Implement function formatPrivateKeyHex(rawHex) ensuring 64 hex characters (32 bytes).",
    "aStarter": "function formatPrivateKeyHex(h) { const clean = h.replace(/^0x/, '').padStart(64, '0'); return `0x${clean}`; }",
    "aHint": "Pad to 64 hex chars with 0x.",
    "aTest": "if (formatPrivateKeyHex('1a').length !== 66) throw new Error('Key format failed');"
  },
  {
    "day": 4,
    "title": "Proof of Work (PoW) Mining & Difficulty Nonce",
    "desc": "Simulate Proof of Work consensus: Target Difficulty thresholds, Nonce iteration, Block hashing, and Hashrate difficulty adjustment algorithms.",
    "syllabus": [
      "Proof of Work condition: $\\text{SHA-256}(\\text{SHA-256}(\\text{BlockHeader} + \\text{Nonce})) < \\text{Target}$.",
      "Mining Nonce search loop & Hashrate difficulty readjustment every 2016 blocks.",
      "51% Attack dynamics and Byzantine honest majority assumptions."
    ],
    "eTitle": "Proof of Work Nonce Miner Simulator",
    "eDesc": "Implement function mineBlockPow(blockData, targetLeadingZeroes = 3) searching for integer nonce that produces required leading zeroes.",
    "eStarter": "function mineBlockPow(data, leadingZeroes = 3) {\n  let nonce = 0;\n  const targetPrefix = '0'.repeat(leadingZeroes);\n  while (nonce < 1000000) {\n    // Simulated hash function: (data + nonce) mod hash pattern\n    const hash = ((nonce * 2654435761) >>> 0).toString(16).padStart(8, '0');\n    if (hash.startsWith(targetPrefix)) {\n      return {\n        mined: true,\n        nonce,\n        blockHash: `0x${hash}`,\n        difficultyZeroes: leadingZeroes,\n        status: 'POW_BLOCK_MINED_SUCCESS'\n      };\n    }\n    nonce++;\n  }\n  return { mined: false, nonce };\n}",
    "eHint": "Iterate nonce until hash starts with targetPrefix zeroes.",
    "eTest": "const res = mineBlockPow('BlockPayload_01', 2);\nif (!res.mined || !res.blockHash.startsWith('0x00')) throw new Error('PoW mining failed to find valid nonce');",
    "aTitle": "Hashrate Target Calculator",
    "aDesc": "Implement function getTargetFromDifficulty(difficulty) returning `(2**256) / difficulty`.",
    "aStarter": "function getTargetFromDifficulty(d) { return d > 0 ? (1000000 / d) : 0; }",
    "aHint": "Divide max by difficulty.",
    "aTest": "if (getTargetFromDifficulty(10) !== 100000) throw new Error('Target calc failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Cryptographic Blockchain Ledger & Merkle Validator Engine",
    "desc": "Milestone 1: Build a complete verifiable blockchain engine: Block header structuring, Merkle Tree transaction batching, SHA-256 block hash chaining, Nonce mining, and Tamper detection.",
    "syllabus": [
      "Full Block Header Schema: Index, Timestamp, PreviousHash, MerkleRoot, Nonce, Difficulty.",
      "Chain Validation: Detecting single-bit data modifications in transaction history.",
      "Cryptographic ledger state integrity verification."
    ],
    "eTitle": "Blockchain Master Ledger Verifier Engine",
    "eDesc": "Implement function auditMasterLedger(blockchain) executing full cryptographic chain validation, Merkle proof checks, and PoW nonce audits.",
    "eStarter": "function auditMasterLedger(chain) {\n  let isValid = true;\n  let totalTransactions = 0;\n  for (let i = 0; i < chain.length; i++) {\n    const b = chain[i];\n    totalTransactions += b.transactions.length;\n    if (i > 0 && b.previousHash !== chain[i - 1].hash) {\n      isValid = false;\n      break;\n    }\n  }\n  return {\n    isLedgerValid: isValid,\n    totalBlocks: chain.length,\n    totalTransactionsProcessed: totalTransactions,\n    securityStatus: isValid ? 'MASTER_LEDGER_INTEGRITY_CERTIFIED' : 'TAMPERED_BLOCKCHAIN_REJECTED'\n  };\n}",
    "eHint": "Verify chain hashes and count transactions across all blocks.",
    "eTest": "const chain = [{ index: 0, hash: 'h0', previousHash: '0x0', transactions: ['tx0'] }, { index: 1, hash: 'h1', previousHash: 'h0', transactions: ['tx1', 'tx2'] }];\nconst res = auditMasterLedger(chain);\nif (!res.isLedgerValid || res.totalTransactionsProcessed !== 3 || res.securityStatus !== 'MASTER_LEDGER_INTEGRITY_CERTIFIED') throw new Error('Milestone 1 ledger audit failed');",
    "aTitle": "Block Header Serializer",
    "aDesc": "Implement function serializeBlockHeader(block) returning concatenated header string.",
    "aStarter": "function serializeBlockHeader(b) { return `${b.index}:${b.previousHash}:${b.merkleRoot}:${b.nonce}`; }",
    "aHint": "Concatenate index, previousHash, merkleRoot, nonce.",
    "aTest": "if (!serializeBlockHeader({ index: 1, previousHash: 'h0', merkleRoot: 'mr1', nonce: 42 }).includes('mr1')) throw new Error('Serializer failed');"
  },
  {
    "day": 6,
    "title": "Proof of Stake (PoS), Validators & Slashing Conditions",
    "desc": "Analyze modern Proof of Stake consensus: Ethereum 2.0 Gasper (Casper FFG + LMD GHOST), 32 ETH Validator staking, Epoch Checkpointing, and Slashing for double signing.",
    "syllabus": [
      "Proof of Stake Architecture: 32 ETH Staking deposits, Committee selection via RANDAO.",
      "Casper FFG 2/3 Supermajority Finality & Epoch Checkpoints (32 slots = 6.4 minutes).",
      "Slashing Penalties: Double Proposing, Double Voting (Surround Vote), and Inactivity Leaks."
    ],
    "eTitle": "PoS Double-Voting Slashing Detector",
    "eDesc": "Implement function evaluateSlashingCondition(attestationA, attestationB) detecting if a validator signed two conflicting blocks in the same epoch.",
    "eStarter": "function evaluateSlashingCondition(attA, attB) {\n  const sameValidator = (attA.validatorPubkey === attB.validatorPubkey);\n  const sameEpoch = (attA.targetEpoch === attB.targetEpoch);\n  const conflictingRoots = (attA.targetRoot !== attB.targetRoot);\n  const isDoubleVote = sameValidator && sameEpoch && conflictingRoots;\n  return {\n    slashed: isDoubleVote,\n    validator: attA.validatorPubkey,\n    penaltyEth: isDoubleVote ? 1.0 : 0.0, // Minimum 1 ETH immediate slash\n    reason: isDoubleVote ? 'SLASHABLE_OFFENSE_DOUBLE_VOTING' : 'ATTENTION_VALID'\n  };\n}",
    "eHint": "Check if same validator voted for different target roots in the same epoch.",
    "eTest": "const att1 = { validatorPubkey: '0xVal1', targetEpoch: 100, targetRoot: '0xRootA' };\nconst att2 = { validatorPubkey: '0xVal1', targetEpoch: 100, targetRoot: '0xRootB' }; // Malicious double vote\nconst res = evaluateSlashingCondition(att1, att2);\nif (!res.slashed || res.penaltyEth !== 1.0 || res.reason !== 'SLASHABLE_OFFENSE_DOUBLE_VOTING') throw new Error('PoS slashing detection failed');",
    "aTitle": "Epoch Slot Number Calculator",
    "aDesc": "Implement function getEpochFromSlot(slotNumber) returning `Math.floor(slotNumber / 32)`.",
    "aStarter": "function getEpochFromSlot(s) { return Math.floor(s / 32); }",
    "aHint": "Divide slot number by 32.",
    "aTest": "if (getEpochFromSlot(64) !== 2 || getEpochFromSlot(31) !== 0) throw new Error('Slot epoch calc failed');"
  },
  {
    "day": 7,
    "title": "UTXO vs Account-Based State Models",
    "desc": "Compare Bitcoin UTXO (Unspent Transaction Output) and Ethereum Account/Nonce state machines: Double spend prevention, State bloat, and Parallel transaction validation.",
    "syllabus": [
      "Bitcoin UTXO Model: Inputs consume complete outputs, produce new UTXOs + change.",
      "Ethereum Account Model: Global World State Trie mapping `Address => { nonce, balance, storageRoot, codeHash }`.",
      "Replay Attack Protection via Account Nonces ($N_{\\text{tx}} = N_{\\text{account}}$)."
    ],
    "eTitle": "UTXO Transaction Balance & Change Calculator",
    "eDesc": "Implement function processUtxoTransaction(inputs, recipients, feeSats = 1000) calculating outputs and change UTXO.",
    "eStarter": "function processUtxoTransaction(inputs, recipients, fee = 1000) {\n  const totalInput = inputs.reduce((sum, utxo) => sum + utxo.valueSats, 0);\n  const totalSent = recipients.reduce((sum, r) => sum + r.amountSats, 0);\n  const totalNeeded = totalSent + fee;\n  if (totalInput < totalNeeded) {\n    return { success: false, error: 'INSUFFICIENT_UTXO_INPUT_FUNDS' };\n  }\n  const changeSats = totalInput - totalNeeded;\n  return {\n    success: true,\n    totalInputSats: totalInput,\n    totalSentSats: totalSent,\n    minerFeeSats: fee,\n    changeUtxoSats: changeSats\n  };\n}",
    "eHint": "Compute total inputs minus sent amounts and miner fee to find change.",
    "eTest": "const inputs = [{ txid: 'tx1', valueSats: 50000 }, { txid: 'tx2', valueSats: 30000 }]; // 80k sats\nconst recipients = [{ address: 'Bob', amountSats: 60000 }];\nconst res = processUtxoTransaction(inputs, recipients, 2000);\nif (!res.success || res.changeUtxoSats !== 18000) throw new Error('UTXO transaction calculation failed');",
    "aTitle": "Account Nonce Incrementor",
    "aDesc": "Implement function validateAndIncrementNonce(accountNonce, txNonce) returning `txNonce === accountNonce`.",
    "aStarter": "function validateAndIncrementNonce(accN, txN) { return accN === txN ? { valid: true, nextNonce: accN + 1 } : { valid: false }; }",
    "aHint": "Verify txNonce equals accountNonce.",
    "aTest": "if (!validateAndIncrementNonce(5, 5).valid) throw new Error('Nonce valid failed');"
  },
  {
    "day": 8,
    "title": "EVM Architecture: Stack, Memory, Storage & Opcodes",
    "desc": "Master the Ethereum Virtual Machine (EVM): 256-bit Word Stack (1024 depth limit), Volatile Byte Memory (`mload`/`mstore`), Persistent Storage Slots (`sload`/`sstore` 20,000 gas), and Opcodes.",
    "syllabus": [
      "EVM Memory Architecture: Stack (256-bit words), Memory (Byte-addressable volatile), Storage (256-bit key-value persistent).",
      "Gas Costs: `ADD` (3 gas) vs `SLOAD` (2100 cold / 100 warm gas) vs `SSTORE` (20,000 gas initial write).",
      "EVM Execution Cycle: PC counter, Bytecode opcode decoding, Gas metering, and Stack underflow/overflow bounds."
    ],
    "eTitle": "EVM 256-Bit Stack Machine Simulator",
    "eDesc": "Implement function simulateEvmBytecode(opcodes) executing `PUSH1`, `ADD`, `SUB`, `MUL`, and `DUP1` on an EVM stack.",
    "eStarter": "function simulateEvmBytecode(ops) {\n  const stack = [];\n  for (let i = 0; i < ops.length; i++) {\n    const op = ops[i];\n    if (op.startsWith('PUSH1_')) {\n      const val = parseInt(op.split('_')[1], 10);\n      stack.push(val);\n    } else if (op === 'ADD') {\n      const a = stack.pop(), b = stack.pop();\n      stack.push(a + b);\n    } else if (op === 'MUL') {\n      const a = stack.pop(), b = stack.pop();\n      stack.push(a * b);\n    } else if (op === 'DUP1') {\n      const top = stack[stack.length - 1];\n      stack.push(top);\n    }\n  }\n  return {\n    finalStackTop: stack[stack.length - 1],\n    stackDepth: stack.length,\n    stack\n  };\n}",
    "eHint": "Implement stack operations PUSH1, ADD, MUL, DUP1.",
    "eTest": "const ops = ['PUSH1_10', 'PUSH1_20', 'ADD', 'DUP1', 'MUL']; // (10+20)=30 -> DUP1=30,30 -> MUL=900\nconst res = simulateEvmBytecode(ops);\nif (res.finalStackTop !== 900 || res.stackDepth !== 1) throw new Error('EVM stack execution simulator failed');",
    "aTitle": "EVM Storage Cost Estimator",
    "aDesc": "Implement function estimateStorageGas(coldSlotsCount) returning `coldSlotsCount * 20000`.",
    "aStarter": "function estimateStorageGas(n) { return n * 20000; }",
    "aHint": "Multiply slot count by 20,000 gas.",
    "aTest": "if (estimateStorageGas(3) !== 60000) throw new Error('Storage gas failed');"
  },
  {
    "day": 9,
    "title": "Solidity Data Types, Structs & Enums",
    "desc": "Master Solidity fundamental types: `uint256`, `address`, `bytes32`, `bool`, Struct packing, Enums, and explicit type casting.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Solidity Data Types, Structs & Enums.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Solidity Data Type Size & Range Calculator",
    "eDesc": "Implement function getSolidityTypeMax(typeName) returning max integer boundaries for `uint8`, `uint16`, `uint64`, `uint256`.",
    "eStarter": "function getSolidityTypeMax(type) {\n  const bits = parseInt(type.replace('uint', ''), 10);\n  if (bits === 8) return { type, max: 255, bytes: 1 };\n  if (bits === 16) return { type, max: 65535, bytes: 2 };\n  if (bits === 64) return { type, max: '18446744073709551615', bytes: 8 };\n  if (bits === 256) return { type, max: '1.157920892373162e+77', bytes: 32 };\n  return { type, max: 0, bytes: 0 };\n}",
    "eHint": "Return max values for uint8, uint16, uint64, uint256.",
    "eTest": "if (getSolidityTypeMax('uint8').max !== 255 || getSolidityTypeMax('uint16').bytes !== 2) throw new Error('Solidity type range failed');",
    "aTitle": "Address Zero Verifier",
    "aDesc": "Implement function isZeroAddress(addr) returning true if address is `0x0000000000000000000000000000000000000000`.",
    "aStarter": "function isZeroAddress(a) { return /^0x0{40}$/i.test(a); }",
    "aHint": "Check regex for 40 zeroes.",
    "aTest": "if (!isZeroAddress('0x0000000000000000000000000000000000000000')) throw new Error('Zero address failed');"
  },
  {
    "day": 10,
    "title": "Solidity Mappings, Arrays & Memory vs Storage",
    "desc": "Structure smart contract state: `mapping(address => uint256)`, Dynamic vs Fixed Arrays, `memory` vs `storage` pointers, and array delete semantics.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Solidity Mappings, Arrays & Memory vs Storage.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Solidity Mapping Hash Location Calculator",
    "eDesc": "Implement function calculateMappingStorageSlot(keyAddress, mapSlotIndex = 0) computing Keccak-256 storage slot location.",
    "eStarter": "function calculateMappingStorageSlot(key, slotIndex = 0) {\n  const cleanKey = key.toLowerCase().replace(/^0x/, '').padStart(64, '0');\n  const cleanSlot = slotIndex.toString(16).padStart(64, '0');\n  const combined = `keccak256(${cleanKey}+${cleanSlot})`;\n  return {\n    keyAddress: key,\n    baseSlot: slotIndex,\n    computedStorageSlot: `0x_storage_loc_${cleanKey.slice(-8)}_${cleanSlot.slice(-2)}`,\n    status: 'MAPPING_STORAGE_SLOT_LOCATED'\n  };\n}",
    "eHint": "Simulate keccak256(paddedKey + paddedSlot).",
    "eTest": "const res = calculateMappingStorageSlot('0x1234567890123456789012345678901234567890', 2);\nif (res.status !== 'MAPPING_STORAGE_SLOT_LOCATED' || res.baseSlot !== 2) throw new Error('Mapping slot calculation failed');",
    "aTitle": "Array Pop Gas Calculator",
    "aDesc": "Implement function calculateArrayPopRefund(elementsPopped) returning gas refund.",
    "aStarter": "function calculateArrayPopRefund(n) { return n * 4800; }",
    "aHint": "Multiply elements by 4800 gas refund.",
    "aTest": "if (calculateArrayPopRefund(2) !== 9600) throw new Error('Pop refund failed');"
  },
  {
    "day": 11,
    "title": "Functions, Modifiers, View/Pure & Fallback/Receive",
    "desc": "Write secure Solidity functions: Visibility (`public`, `external`, `internal`, `private`), State mutability (`view`, `pure`, `payable`), Custom Modifiers (`onlyOwner`), and `receive()` / `fallback()` ether handlers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Functions, Modifiers, View/Pure & Fallback/Receive.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Solidity Function Modifier Execution Checker",
    "eDesc": "Implement function executeFunctionWithModifier(callerAddress, ownerAddress, amount, isContractPaused) validating modifier guard assertions before executing logic.",
    "eStarter": "function executeFunctionWithModifier(caller, owner, amount, isPaused) {\n  if (isPaused) return { success: false, revertReason: 'PAUSABLE_CONTRACT_IS_PAUSED' };\n  if (caller.toLowerCase() !== owner.toLowerCase()) return { success: false, revertReason: 'OWNABLE_CALLER_NOT_OWNER' };\n  if (amount <= 0) return { success: false, revertReason: 'INVALID_AMOUNT_MUST_BE_POSITIVE' };\n  return { success: true, executedAmount: amount, status: 'FUNCTION_EXECUTION_SUCCESSFUL' };\n}",
    "eHint": "Verify not paused, caller is owner, and amount > 0.",
    "eTest": "const ok = executeFunctionWithModifier('0xOwner', '0xOwner', 100, false);\nconst bad = executeFunctionWithModifier('0xAttacker', '0xOwner', 100, false);\nif (!ok.success || bad.success || bad.revertReason !== 'OWNABLE_CALLER_NOT_OWNER') throw new Error('Modifier check failed');",
    "aTitle": "Ether Receiver Selector",
    "aDesc": "Implement function resolveEtherHandler(hasMsgData) returning `receive()` if empty, else `fallback()`.",
    "aStarter": "function resolveEtherHandler(hasData) { return hasData ? 'fallback()' : 'receive()'; }",
    "aHint": "Empty data triggers receive(), data triggers fallback().",
    "aTest": "if (resolveEtherHandler(false) !== 'receive()') throw new Error('Receive resolve failed');"
  },
  {
    "day": 12,
    "title": "Storage Slot Packing & Gas Optimization",
    "desc": "Pack variables into 32-byte storage slots to save 40,000 gas: Multiple `uint128`, `uint64`, `address` (20 bytes), and `bool` (1 byte) in single slots.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Storage Slot Packing & Gas Optimization.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Solidity 32-Byte Storage Slot Packer",
    "eDesc": "Implement function packVariablesIntoSlots(variableList) calculating exact number of 32-byte slots allocated based on variable byte sizes.",
    "eStarter": "function packVariablesIntoSlots(vars) {\n  // vars = [{ name: 'a', bytes: 20 }, { name: 'b', bytes: 8 }, { name: 'c', bytes: 4 }]\n  let slots = 1;\n  let currentSlotBytes = 0;\n  for (const v of vars) {\n    if (currentSlotBytes + v.bytes > 32) {\n      slots++;\n      currentSlotBytes = v.bytes;\n    } else {\n      currentSlotBytes += v.bytes;\n    }\n  }\n  return {\n    totalVariables: vars.length,\n    totalSlotsUsed: slots,\n    totalGasSavingsVsUnpacked: (vars.length - slots) * 20000\n  };\n}",
    "eHint": "Accumulate bytes up to 32 per slot; create new slot when exceeding 32 bytes.",
    "eTest": "const vars = [{ bytes: 20 }, { bytes: 8 }, { bytes: 4 }]; // Exactly 32 bytes -> 1 slot!\nconst res = packVariablesIntoSlots(vars);\nif (res.totalSlotsUsed !== 1 || res.totalGasSavingsVsUnpacked !== 40000) throw new Error('Slot packing calculation failed');",
    "aTitle": "Slot Space Remaining Calculator",
    "aDesc": "Implement function getRemainingSlotBytes(usedBytes) returning `32 - usedBytes`.",
    "aStarter": "function getRemainingSlotBytes(u) { return Math.max(0, 32 - u); }",
    "aHint": "Subtract used from 32.",
    "aTest": "if (getRemainingSlotBytes(20) !== 12) throw new Error('Remaining calc failed');"
  },
  {
    "day": 13,
    "title": "ERC-20 Fungible Token Standard",
    "desc": "Implement the ERC-20 token standard: `totalSupply()`, `balanceOf()`, `transfer()`, `allowance()`, `approve()`, `transferFrom()`, and `Transfer`/`Approval` events.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ERC-20 Fungible Token Standard.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ERC-20 Token Transfer & Allowance Engine",
    "eDesc": "Implement function executeErc20TransferFrom(balances, allowances, spender, from, to, amount) transferring tokens under approved allowance.",
    "eStarter": "function executeErc20TransferFrom(balances, allowances, spender, from, to, amount) {\n  const fromBal = balances[from] || 0;\n  const allowKey = `${from}_${spender}`;\n  const allowed = allowances[allowKey] || 0;\n  if (fromBal < amount) return { success: false, error: 'ERC20_INSUFFICIENT_BALANCE' };\n  if (allowed < amount) return { success: false, error: 'ERC20_INSUFFICIENT_ALLOWANCE' };\n  balances[from] -= amount;\n  balances[to] = (balances[to] || 0) + amount;\n  allowances[allowKey] -= amount;\n  return {\n    success: true,\n    fromNewBalance: balances[from],\n    toNewBalance: balances[to],\n    remainingAllowance: allowances[allowKey]\n  };\n}",
    "eHint": "Verify balance and allowance, decrement both, credit recipient.",
    "eTest": "const balances = { Alice: 1000, Bob: 0 };\nconst allowances = { Alice_SpenderDEX: 500 };\nconst res = executeErc20TransferFrom(balances, allowances, 'SpenderDEX', 'Alice', 'Bob', 300);\nif (!res.success || res.fromNewBalance !== 700 || res.toNewBalance !== 300 || res.remainingAllowance !== 200) throw new Error('ERC-20 transferFrom failed');",
    "aTitle": "Wei to Ether Formatter",
    "aDesc": "Implement function formatWeiToEther(weiString) returning decimal ether string.",
    "aStarter": "function formatWeiToEther(w) { return (BigInt(w) / 1000000000000000000n).toString(); }",
    "aHint": "Divide by 10^18.",
    "aTest": "if (formatWeiToEther('2000000000000000000') !== '2') throw new Error('Wei to Eth failed');"
  },
  {
    "day": 14,
    "title": "ERC-721 & ERC-1155 Non-Fungible Tokens (NFTs)",
    "desc": "Mint and manage non-fungible digital assets: ERC-721 (`ownerOf()`, `safeTransferFrom()`, `tokenURI()`), ERC-1155 Multi-Token semi-fungibles, and IPFS metadata JSON.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ERC-721 & ERC-1155 Non-Fungible Tokens (NFTs).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ERC-721 NFT Mint & Ownership Transfer Engine",
    "eDesc": "Implement function transferErc721Token(nftLedger, caller, from, to, tokenId) transferring unique token with approval verification.",
    "eStarter": "function transferErc721Token(ledger, caller, from, to, tokenId) {\n  const token = ledger[tokenId];\n  if (!token) return { success: false, error: 'ERC721_NONEXISTENT_TOKEN' };\n  if (token.owner.toLowerCase() !== from.toLowerCase()) return { success: false, error: 'ERC721_FROM_IS_NOT_OWNER' };\n  const isAuthorized = (caller.toLowerCase() === from.toLowerCase()) || (token.approved.toLowerCase() === caller.toLowerCase());\n  if (!isAuthorized) return { success: false, error: 'ERC721_CALLER_NOT_OWNER_NOR_APPROVED' };\n  token.owner = to;\n  token.approved = '0x0000000000000000000000000000000000000000'; // Reset approval on transfer\n  return { success: true, tokenId, newOwner: to, status: 'NFT_TRANSFER_CONFIRMED' };\n}",
    "eHint": "Verify ownership, verify authorization, update owner and reset approval.",
    "eTest": "const ledger = { 101: { owner: '0xAlice', approved: '0xOperator' } };\nconst res = transferErc721Token(ledger, '0xOperator', '0xAlice', '0xBob', 101);\nif (!res.success || res.newOwner !== '0xBob' || ledger[101].approved !== '0x0000000000000000000000000000000000000000') throw new Error('ERC-721 transfer failed');",
    "aTitle": "IPFS Token URI Resolver",
    "aDesc": "Implement function resolveIpfsUri(ipfsHash) returning `https://ipfs.io/ipfs/${ipfsHash}`.",
    "aStarter": "function resolveIpfsUri(h) { return `https://ipfs.io/ipfs/${h}`; }",
    "aHint": "Return ipfs gateway url.",
    "aTest": "if (!resolveIpfsUri('Qm123').includes('Qm123')) throw new Error('IPFS resolve failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete ERC-20 / ERC-721 Decentralized Asset Engine",
    "desc": "Milestone 2: Build a production smart contract token platform: ERC-20 fungible payments, ERC-721 digital asset minting, Operator approval registries, and SafeTransfer event logging.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Complete ERC-20 / ERC-721 Decentralized Asset Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Decentralized Asset Registry Engine",
    "eDesc": "Implement function processAssetRegistryBatch(erc20Pool, nftRegistry, batchActions) executing atomic token purchases and NFT mints.",
    "eStarter": "function processAssetRegistryBatch(pool, nfts, actions) {\n  let processed = 0;\n  for (const act of actions) {\n    if (act.type === 'PURCHASE_NFT') {\n      if (pool.balances[act.buyer] >= act.price) {\n        pool.balances[act.buyer] -= act.price;\n        nfts[act.tokenId] = { owner: act.buyer, metadata: act.uri };\n        processed++;\n      }\n    }\n  }\n  return {\n    successfulTransactions: processed,\n    activeNftCount: Object.keys(nfts).length,\n    status: 'ASSET_REGISTRY_BATCH_EXECUTED'\n  };\n}",
    "eHint": "Deduct ERC-20 payment and mint NFT to buyer.",
    "eTest": "const pool = { balances: { UserA: 1000 } };\nconst nfts = {};\nconst actions = [{ type: 'PURCHASE_NFT', buyer: 'UserA', price: 250, tokenId: 'NFT_1', uri: 'ipfs://Qm1' }];\nconst res = processAssetRegistryBatch(pool, nfts, actions);\nif (res.successfulTransactions !== 1 || pool.balances.UserA !== 750 || nfts.NFT_1.owner !== 'UserA') throw new Error('Milestone 2 asset registry failed');",
    "aTitle": "Asset ID Formatter",
    "aDesc": "Implement function formatAssetId(collection, id) returning `${collection}#${id}`.",
    "aStarter": "function formatAssetId(c, id) { return `${c}#${id}`; }",
    "aHint": "Format collection and ID.",
    "aTest": "if (formatAssetId('BoredApe', 42) !== 'BoredApe#42') throw new Error('Format failed');"
  },
  {
    "day": 16,
    "title": "Reentrancy Attacks & Checks-Effects-Interactions Pattern",
    "desc": "Prevent multi-million dollar exploits (The DAO Hack): Checks-Effects-Interactions (CEI) invariant, OpenZeppelin `ReentrancyGuard` (`nonReentrant` modifier), and Mutex locks.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Reentrancy Attacks & Checks-Effects-Interactions Pattern.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Reentrancy Vulnerability Detector & CEI Enforcer",
    "eDesc": "Implement function executeWithdrawalWithCei(userBalances, caller, withdrawAmount) updating balance state BEFORE transferring external funds.",
    "eStarter": "function executeWithdrawalWithCei(balances, caller, amount) {\n  // 1. CHECKS\n  const currentBal = balances[caller] || 0;\n  if (currentBal < amount) return { success: false, error: 'INSUFFICIENT_BALANCE' };\n  // 2. EFFECTS (Update state FIRST before external call!)\n  balances[caller] -= amount;\n  // 3. INTERACTIONS (Simulated external call)\n  const externalCallSuccess = true;\n  return {\n    success: true,\n    withdrawnAmount: amount,\n    remainingBalance: balances[caller],\n    isCeiCompliant: true,\n    status: 'WITHDRAWAL_PROTECTED_AGAINST_REENTRANCY'\n  };\n}",
    "eHint": "Verify state deduction occurs before external transfer.",
    "eTest": "const balances = { '0xUser': 500 };\nconst res = executeWithdrawalWithCei(balances, '0xUser', 500);\nif (!res.success || balances['0xUser'] !== 0 || !res.isCeiCompliant) throw new Error('CEI withdrawal failed');",
    "aTitle": "Reentrancy Lock Status Checker",
    "aDesc": "Implement function checkMutexLock(lockState) returning true if unlocked (state === 1).",
    "aStarter": "function checkMutexLock(s) { return s === 1; }",
    "aHint": "1 = Unlocked, 2 = Locked.",
    "aTest": "if (!checkMutexLock(1) || checkMutexLock(2)) throw new Error('Lock check failed');"
  },
  {
    "day": 17,
    "title": "Smart Contract Access Control & Role-Based Security",
    "desc": "Manage privileged administrative permissions: `Ownable` single-admin pattern, `AccessControl` multi-role manager (`ADMIN_ROLE`, `MINTER_ROLE`), and 2-step Ownership Transfers (`Ownable2Step`).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Smart Contract Access Control & Role-Based Security.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Role-Based Access Control (RBAC) Verifier",
    "eDesc": "Implement function verifyUserRole(roleRegistry, userAddress, requiredRole) verifying user possesses required keccak role hash.",
    "eStarter": "function verifyUserRole(registry, user, role) {\n  const userRoles = registry[user.toLowerCase()] || [];\n  const hasRole = userRoles.includes(role) || userRoles.includes('DEFAULT_ADMIN_ROLE');\n  return {\n    user,\n    roleChecked: role,\n    hasAccess: hasRole,\n    status: hasRole ? 'ACCESS_GRANTED' : 'ACCESS_DENIED_MISSING_ROLE'\n  };\n}",
    "eHint": "Check if user has specific role or default admin role.",
    "eTest": "const reg = { '0xalice': ['MINTER_ROLE'], '0xbob': ['DEFAULT_ADMIN_ROLE'] };\nif (!verifyUserRole(reg, '0xAlice', 'MINTER_ROLE').hasAccess || !verifyUserRole(reg, '0xBob', 'MINTER_ROLE').hasAccess) throw new Error('RBAC verification failed');",
    "aTitle": "Role Hash Generator",
    "aDesc": "Implement function getRoleHash(roleName) returning `0x_ROLE_${roleName}`.",
    "aStarter": "function getRoleHash(r) { return `0x_ROLE_${r}`; }",
    "aHint": "Format role hash string.",
    "aTest": "if (getRoleHash('ADMIN') !== '0x_ROLE_ADMIN') throw new Error('Role hash failed');"
  },
  {
    "day": 18,
    "title": "DeFi Automated Market Makers (AMM) & Constant Product ($x \\cdot y = k$)",
    "desc": "Build decentralized exchanges (Uniswap v2): Constant Product Formula ($x \\cdot y = k$), 0.3% LP Swap Fees, Slippage calculation, and Impermanent Loss.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of DeFi Automated Market Makers (AMM) & Constant Product ($x \\cdot y = k$).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Uniswap v2 Constant Product Swap Output Calculator",
    "eDesc": "Implement function calculateAmmSwapOutput(reserveIn, reserveOut, amountIn, feeBps = 30) computing exact tokens received with 0.3% fee ($997 / 1000$).",
    "eStarter": "function calculateAmmSwapOutput(reserveIn, reserveOut, amountIn, feeBps = 30) {\n  // Formula: amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000 + amountInWithFee)\n  const amountInWithFee = amountIn * (1000 - feeBps);\n  const numerator = amountInWithFee * reserveOut;\n  const denominator = (reserveIn * 1000) + amountInWithFee;\n  const amountOut = Math.floor(numerator / denominator);\n  const slippagePercent = ((amountIn / (reserveIn + amountIn)) * 100);\n  return {\n    amountIn,\n    amountOut,\n    feePaid: amountIn * (feeBps / 1000),\n    estimatedSlippagePercent: Number(slippagePercent.toFixed(2))\n  };\n}",
    "eHint": "Compute amountInWithFee * reserveOut / (reserveIn * 1000 + amountInWithFee).",
    "eTest": "const res = calculateAmmSwapOutput(100000, 100000, 1000, 30); // 100k pool swapping 1k\nif (res.amountOut < 985 || res.amountOut > 990 || res.feePaid !== 30) throw new Error('Uniswap v2 AMM swap calculation failed');",
    "aTitle": "Constant Product K Calculator",
    "aDesc": "Implement function calculateK(reserveA, reserveB) returning `reserveA * reserveB`.",
    "aStarter": "function calculateK(a, b) { return a * b; }",
    "aHint": "Multiply reserveA by reserveB.",
    "aTest": "if (calculateK(1000, 2000) !== 2000000) throw new Error('K calc failed');"
  },
  {
    "day": 19,
    "title": "Flash Loans & Atomic Arbitrage Execution",
    "desc": "Execute multi-million dollar uncollateralized loans in a single transaction: Aave Flash Loan lifecycle, Atomic repayment ($+ 0.09\\%$ fee), and Arbitrage routing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Flash Loans & Atomic Arbitrage Execution.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Aave Flash Loan Execution & Repayment Validator",
    "eDesc": "Implement function executeFlashLoanCycle(loanAmount, profitFromArbitrage, feeBps = 9) verifying loan + fee is returned atomically in same transaction.",
    "eStarter": "function executeFlashLoanCycle(amount, profit, feeBps = 9) {\n  const fee = amount * (feeBps / 10000); // 0.09% Aave fee\n  const totalOwed = amount + fee;\n  const netGain = profit - fee;\n  const isSolvent = netGain > 0;\n  return {\n    loanAmount: amount,\n    flashLoanFee: fee,\n    totalRepaidToPool: totalOwed,\n    netArbitrageProfit: Number(netGain.toFixed(2)),\n    transactionSuccess: isSolvent,\n    status: isSolvent ? 'FLASH_LOAN_ARBITRAGE_SUCCESS' : 'TRANSACTION_REVERTED_INSUFFICIENT_PROFIT'\n  };\n}",
    "eHint": "Verify profit covers flash loan fee and return total owed.",
    "eTest": "const res = executeFlashLoanCycle(1000000, 2500, 9); // $1M loan with $2500 profit\nif (!res.transactionSuccess || res.flashLoanFee !== 900 || res.netArbitrageProfit !== 1600) throw new Error('Flash loan execution failed');",
    "aTitle": "Flash Loan Fee Calculator",
    "aDesc": "Implement function getFlashLoanFee(amount, bps = 9) returning `amount * (bps / 10000)`.",
    "aStarter": "function getFlashLoanFee(a, bps = 9) { return a * (bps / 10000); }",
    "aHint": "Multiply amount by bps / 10000.",
    "aTest": "if (getFlashLoanFee(100000, 9) !== 90) throw new Error('Fee calc failed');"
  },
  {
    "day": 20,
    "title": "Chainlink Oracles & Decentralized Price Feeds",
    "desc": "Connect smart contracts to real-world off-chain data: Chainlink Data Feeds (`AggregatorV3Interface`), Decimals normalization, Stale price checks, and Chainlink VRF.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Chainlink Oracles & Decentralized Price Feeds.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Chainlink Price Feed Freshness & Decimals Normalizer",
    "eDesc": "Implement function processOraclePrice(roundData, heartbeatTimeoutSec = 3600, currentTimestamp = 1700003000) verifying price is fresh and non-zero.",
    "eStarter": "function processOraclePrice(round, heartbeat = 3600, now = 1700003000) {\n  // round = { answer: 250000000000n, decimals: 8, updatedAt: 1700002000 }\n  const isNonZero = round.answer > 0n;\n  const isFresh = (now - round.updatedAt) <= heartbeat;\n  if (!isNonZero || !isFresh) {\n    return { valid: false, error: !isNonZero ? 'ORACLE_PRICE_ZERO' : 'ORACLE_PRICE_STALE_HEARTBEAT_EXPIRED' };\n  }\n  const normalPrice = Number(round.answer) / (10 ** round.decimals);\n  return {\n    valid: true,\n    usdPrice: normalPrice,\n    updatedAt: round.updatedAt,\n    status: 'ORACLE_DATA_VERIFIED_AUTHENTIC'\n  };\n}",
    "eHint": "Verify price > 0 and (now - updatedAt) <= heartbeat.",
    "eTest": "const round = { answer: 250050000000n, decimals: 8, updatedAt: 1700002000 };\nconst res = processOraclePrice(round, 3600, 1700003000);\nif (!res.valid || res.usdPrice !== 2500.5) throw new Error('Oracle price processing failed');",
    "aTitle": "Decimals Scaler",
    "aDesc": "Implement function scalePriceDecimals(priceRaw, dec) returning `priceRaw / (10**dec)`.",
    "aStarter": "function scalePriceDecimals(p, d) { return p / (10 ** d); }",
    "aHint": "Divide by 10^decimals.",
    "aTest": "if (scalePriceDecimals(30000000000, 8) !== 300) throw new Error('Scale failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Production DeFi Lending & AMM DEX Protocol",
    "desc": "Milestone 3: Build a production DeFi protocol: Uniswap v2 AMM Liquidity Pools, Chainlink Oracle valuation, Flash Loan atomic arbitrage, and Reentrancy-safe CEI lending vault.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Production DeFi Lending & AMM DEX Protocol.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "DeFi Master Protocol Execution Engine",
    "eDesc": "Implement function executeDefiProtocolCycle(liquidityPool, oraclePrice, borrowerAccount) executing collateralized loan with oracle health factor verification.",
    "eStarter": "function executeDefiProtocolCycle(pool, oracle, user) {\n  const collateralUsd = user.collateralEth * oracle.ethUsdPrice;\n  const maxBorrowUsd = collateralUsd * 0.75; // 75% LTV\n  const isSolvent = user.borrowedUsd <= maxBorrowUsd;\n  const healthFactor = maxBorrowUsd / (user.borrowedUsd || 1);\n  return {\n    userCollateralUsd: collateralUsd,\n    maxBorrowAllowedUsd: maxBorrowUsd,\n    healthFactor: Number(healthFactor.toFixed(2)),\n    isSafe: isSolvent,\n    status: isSolvent ? 'DEFI_POSITION_SOLVENT_HEALTHY' : 'LIQUIDATION_RISK_HEALTH_BELOW_1'\n  };\n}",
    "eHint": "Compute collateralUsd = eth * price, maxBorrow = 75% LTV, verify healthFactor.",
    "eTest": "const res = executeDefiProtocolCycle({}, { ethUsdPrice: 2000 }, { collateralEth: 10, borrowedUsd: 10000 });\nif (!res.isSafe || res.healthFactor !== 1.5 || res.status !== 'DEFI_POSITION_SOLVENT_HEALTHY') throw new Error('Milestone 3 DeFi protocol execution failed');",
    "aTitle": "LTV Ratio Calculator",
    "aDesc": "Implement function calculateLtv(borrowed, collateral) returning `(borrowed / collateral) * 100`.",
    "aStarter": "function calculateLtv(b, c) { return Number(((b / c) * 100).toFixed(1)); }",
    "aHint": "Compute b / c * 100.",
    "aTest": "if (calculateLtv(750, 1000) !== 75.0) throw new Error('LTV failed');"
  },
  {
    "day": 22,
    "title": "Upgradeable Smart Contracts: Proxies & Delegatecall",
    "desc": "Upgrade smart contract code without losing state: Proxy pattern (`DELEGATECALL`), Storage collisions, Transparent Proxy vs Universal Upgradeable Proxy Standard (UUPS).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Upgradeable Smart Contracts: Proxies & Delegatecall.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Proxy Delegatecall Storage Layout Collision Detector",
    "eDesc": "Implement function checkStorageCollisions(proxySlots, implV1Slots, implV2Slots) verifying implementation v2 preserves existing storage slot variable ordering.",
    "eStarter": "function checkStorageCollisions(proxySlots, v1, v2) {\n  for (let i = 0; i < v1.length; i++) {\n    if (v2[i]?.name !== v1[i].name || v2[i]?.type !== v1[i].type) {\n      return { collisionDetected: true, corruptedSlot: i, error: 'UPGRADE_STORAGE_LAYOUT_COLLISION' };\n    }\n  }\n  return { collisionDetected: false, safeToUpgrade: true, status: 'UUPS_UPGRADE_STORAGE_LAYOUT_VERIFIED' };\n}",
    "eHint": "Verify that v2 has matching variable names and types for all existing v1 slots.",
    "eTest": "const v1 = [{ name: 'owner', type: 'address' }, { name: 'balance', type: 'uint256' }];\nconst v2Valid = [{ name: 'owner', type: 'address' }, { name: 'balance', type: 'uint256' }, { name: 'fee', type: 'uint256' }];\nconst v2Bad = [{ name: 'balance', type: 'uint256' }, { name: 'owner', type: 'address' }];\nif (!checkStorageCollisions([], v1, v2Valid).safeToUpgrade || checkStorageCollisions([], v1, v2Bad).safeToUpgrade) throw new Error('Storage collision detector failed');",
    "aTitle": "Implementation Slot Calculator",
    "aDesc": "Implement function getEip1967ImplementationSlot() returning EIP-1967 keccak storage slot.",
    "aStarter": "function getEip1967ImplementationSlot() { return '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'; }",
    "aHint": "Return EIP-1967 implementation slot.",
    "aTest": "if (!getEip1967ImplementationSlot().startsWith('0x3608')) throw new Error('EIP-1967 slot failed');"
  },
  {
    "day": 23,
    "title": "Ethers.js & Viem: Web3 JSON-RPC Providers & Signers",
    "desc": "Connect frontend applications to Ethereum: JSON-RPC (`eth_call`, `eth_sendRawTransaction`), `ethers.Contract` ABI interfaces, Viem client, and MetaMask wallet signers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Ethers.js & Viem: Web3 JSON-RPC Providers & Signers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Web3 JSON-RPC Request Formatter & Response Parser",
    "eDesc": "Implement function formatJsonRpcCall(method, params = [], id = 1) returning standard JSON-RPC 2.0 payload.",
    "eStarter": "function formatJsonRpcCall(method, params = [], id = 1) {\n  return {\n    jsonrpc: '2.0',\n    id,\n    method,\n    params,\n    serializedPayload: JSON.stringify({ jsonrpc: '2.0', id, method, params })\n  };\n}",
    "eHint": "Construct jsonrpc 2.0 object.",
    "eTest": "const rpc = formatJsonRpcCall('eth_getBalance', ['0xAlice', 'latest'], 42);\nif (rpc.jsonrpc !== '2.0' || rpc.id !== 42 || rpc.method !== 'eth_getBalance') throw new Error('JSON-RPC format failed');",
    "aTitle": "Gas Hex Converter",
    "aDesc": "Implement function hexToDecimalGas(hexString) returning parsed integer.",
    "aStarter": "function hexToDecimalGas(h) { return parseInt(h, 16); }",
    "aHint": "Parse hex string to integer.",
    "aTest": "if (hexToDecimalGas('0x5208') !== 21000) throw new Error('Hex gas parse failed');"
  },
  {
    "day": 24,
    "title": "EIP-1559 Dynamic Gas Fees: BaseFee & PriorityFee (Miner Tip)",
    "desc": "Estimate and optimize Ethereum transaction gas: EIP-1559 Type-2 transactions, BaseFee burn mechanism, PriorityFee (Miner Tip), and MaxFeePerGas limits.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of EIP-1559 Dynamic Gas Fees: BaseFee & PriorityFee (Miner Tip).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "EIP-1559 Gas Fee & Cost Estimator",
    "eDesc": "Implement function estimateEip1559GasCost(baseFeeGwei, priorityFeeGwei, gasUnits = 21000) calculating total cost in Gwei and Ether.",
    "eStarter": "function estimateEip1559GasCost(baseGwei, tipGwei, units = 21000) {\n  const effectiveFeePerGas = baseGwei + tipGwei;\n  const totalCostGwei = effectiveFeePerGas * units;\n  const totalCostEth = totalCostGwei / 1e9;\n  return {\n    effectiveGasPriceGwei: effectiveFeePerGas,\n    burnedBaseFeeEth: (baseGwei * units) / 1e9,\n    minerTipEth: (tipGwei * units) / 1e9,\n    totalTransactionCostEth: totalCostEth\n  };\n}",
    "eHint": "Compute effectiveFee = base + tip, multiply by gas units.",
    "eTest": "const res = estimateEip1559GasCost(30, 2, 21000); // 32 Gwei total\nif (res.effectiveGasPriceGwei !== 32 || res.totalTransactionCostEth !== 0.000672) throw new Error('EIP-1559 gas calculation failed');",
    "aTitle": "Next BaseFee Estimator",
    "aDesc": "Implement function calculateNextBaseFee(currentBase, gasUsed, gasTarget = 15000000) returning updated baseFee.",
    "aStarter": "function calculateNextBaseFee(b, used, target = 15000000) { const delta = (used - target) / target; return Number((b * (1 + delta * 0.125)).toFixed(2)); }",
    "aHint": "Adjust baseFee up or down based on target gas.",
    "aTest": "if (calculateNextBaseFee(100, 15000000) !== 100) throw new Error('Basefee adjust failed');"
  },
  {
    "day": 25,
    "title": "Event Indexing & Subgraphs with The Graph Protocol",
    "desc": "Query blockchain event history at lightning speed: Smart Contract Event logs (`Indexed` topics in Bloom filters), GraphQL schema definitions, and Subgraph mappings (`AssemblyScript`).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Event Indexing & Subgraphs with The Graph Protocol.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Contract Event Topic Hash Filter",
    "eDesc": "Implement function filterContractLogs(logs, targetTopic0, targetAddress) filtering raw blockchain logs matching contract event signature.",
    "eStarter": "function filterContractLogs(logs, topic0, contractAddr) {\n  const filtered = logs.filter(l => \n    l.address.toLowerCase() === contractAddr.toLowerCase() && \n    l.topics[0].toLowerCase() === topic0.toLowerCase()\n  );\n  return {\n    totalLogsScanned: logs.length,\n    matchedEventsCount: filtered.length,\n    matchedEvents: filtered\n  };\n}",
    "eHint": "Filter by contract address and topic0.",
    "eTest": "const logs = [{ address: '0xContract', topics: ['0xTransferTopic', '0xAlice', '0xBob'] }, { address: '0xOther', topics: ['0xTransferTopic'] }];\nconst res = filterContractLogs(logs, '0xTransferTopic', '0xContract');\nif (res.matchedEventsCount !== 1) throw new Error('Log filter failed');",
    "aTitle": "Event Signature Hash Formatter",
    "aDesc": "Implement function formatEventSignature(name, params) returning signature string.",
    "aStarter": "function formatEventSignature(n, p) { return `${n}(${p.join(',')})`; }",
    "aHint": "Format event signature.",
    "aTest": "if (formatEventSignature('Transfer', ['address','address','uint256']) !== 'Transfer(address,address,uint256)') throw new Error('Sig format failed');"
  },
  {
    "day": 26,
    "title": "Layer 2 Rollups: Optimistic vs ZK-Rollups (SNARKs/STARKs)",
    "desc": "Scale Ethereum by 100x: Optimistic Rollups (7-day fraud proof challenge window, Arbitrum/Optimism Nitro) vs ZK-Rollups (Validity proofs, Zero-Knowledge SNARKs/STARKs).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Layer 2 Rollups: Optimistic vs ZK-Rollups (SNARKs/STARKs).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Layer 2 Rollup Transaction Compression & Gas Savings Engine",
    "eDesc": "Implement function calculateRollupSavings(l1TxCostGas = 100000, l2BatchSize = 500, calldataGasPerTx = 2100) calculating gas savings percentage.",
    "eStarter": "function calculateRollupSavings(l1Cost = 100000, batchSize = 500, calldataCost = 2100) {\n  const l1TotalCost = l1Cost * batchSize; // 50M gas\n  const l2BatchCost = l1Cost + (calldataCost * batchSize); // 100k + 1.05M = 1.15M gas\n  const costPerTxL2 = l2BatchCost / batchSize;\n  const savingsPercent = ((l1Cost - costPerTxL2) / l1Cost) * 100;\n  return {\n    costPerTxL1Gas: l1Cost,\n    costPerTxL2Gas: Number(costPerTxL2.toFixed(0)),\n    gasSavingsPercent: Number(savingsPercent.toFixed(1))\n  };\n}",
    "eHint": "Amortize L1 base cost across batch and compute savings percentage.",
    "eTest": "const res = calculateRollupSavings(100000, 500, 2100);\nif (res.gasSavingsPercent < 97.0 || res.costPerTxL2Gas > 2500) throw new Error('Rollup gas savings calculation failed');",
    "aTitle": "Optimistic Challenge Window Formatter",
    "aDesc": "Implement function formatChallengeWindow(days = 7) returning `${days * 86400} seconds (${days} days)`.",
    "aStarter": "function formatChallengeWindow(d = 7) { return `${d * 86400} seconds (${d} days)`; }",
    "aHint": "Convert days to seconds.",
    "aTest": "if (!formatChallengeWindow(7).includes('604800 seconds')) throw new Error('Window format failed');"
  },
  {
    "day": 27,
    "title": "Account Abstraction (ERC-4337): Smart Accounts & Paymasters",
    "desc": "Eliminate seed phrases and gas hurdles: `UserOperation` pseudo-transactions, Bundlers, Alternative Mempools, EntryPoint contract, and Gasless Paymasters.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Account Abstraction (ERC-4337): Smart Accounts & Paymasters.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ERC-4337 UserOperation Hash & Validation Engine",
    "eDesc": "Implement function validateUserOperation(userOp, entryPointAddress, chainId = 1) verifying paymaster signature and gas bounds.",
    "eStarter": "function validateUserOperation(op, entryPoint, chainId = 1) {\n  const hasValidGas = op.callGasLimit > 0 && op.verificationGasLimit > 0;\n  const hasValidNonce = op.nonce >= 0;\n  const isAuthorized = op.signature && op.signature.length === 132;\n  const valid = hasValidGas && hasValidNonce && isAuthorized;\n  return {\n    userOpHash: `0x_user_op_${op.sender.slice(-6)}_${op.nonce}`,\n    isValid: valid,\n    paymasterSponsored: Boolean(op.paymasterAndData && op.paymasterAndData !== '0x'),\n    status: valid ? 'USER_OPERATION_VALID_FOR_BUNDLER' : 'INVALID_USER_OP_REJECTED'\n  };\n}",
    "eHint": "Verify gas limits, nonce, and 132-char signature.",
    "eTest": "const op = { sender: '0xSmartAccount', nonce: 0, callGasLimit: 100000, verificationGasLimit: 50000, signature: '0x' + 'ab'.repeat(65), paymasterAndData: '0xPaymaster' };\nconst res = validateUserOperation(op, '0xEntryPoint');\nif (!res.isValid || !res.paymasterSponsored || res.status !== 'USER_OPERATION_VALID_FOR_BUNDLER') throw new Error('ERC-4337 UserOp validation failed');",
    "aTitle": "Paymaster Data Extractor",
    "aDesc": "Implement function extractPaymasterAddress(paymasterAndData) returning first 20 bytes (42 hex chars).",
    "aStarter": "function extractPaymasterAddress(p) { return p.slice(0, 42); }",
    "aHint": "Slice first 42 chars.",
    "aTest": "if (extractPaymasterAddress('0x1234567890123456789012345678901234567890abcdef').length !== 42) throw new Error('Paymaster extract failed');"
  },
  {
    "day": 28,
    "title": "Cross-Chain Bridges & Arbitrary Messaging Protocols",
    "desc": "Transfer tokens and call contracts across blockchains: Lock-and-Mint bridges, Burn-and-Mint, Chainlink CCIP, LayerZero omnichain endpoints, and Relayers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cross-Chain Bridges & Arbitrary Messaging Protocols.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Cross-Chain Bridge Message Payload Encoder",
    "eDesc": "Implement function encodeBridgeMessage(sourceChainId, destChainId, sender, recipient, amount, nonce) generating verifiable cross-chain payload packet.",
    "eStarter": "function encodeBridgeMessage(srcChain, dstChain, from, to, amount, nonce) {\n  return {\n    packetHeader: `BRIDGE_V1_${srcChain}_TO_${dstChain}`,\n    sourceChainId: srcChain,\n    destinationChainId: dstChain,\n    senderAddress: from,\n    recipientAddress: to,\n    amountLocked: amount,\n    sequenceNonce: nonce,\n    packetHash: `0x_cross_chain_msg_${srcChain}_${dstChain}_${nonce}`,\n    status: 'BRIDGE_PACKET_ENCODED_READY_FOR_RELAYER'\n  };\n}",
    "eHint": "Construct structured bridge packet object.",
    "eTest": "const pkt = encodeBridgeMessage(1, 42161, '0xAlice', '0xBob', 500, 101);\nif (pkt.destinationChainId !== 42161 || pkt.status !== 'BRIDGE_PACKET_ENCODED_READY_FOR_RELAYER') throw new Error('Bridge packet encoding failed');",
    "aTitle": "Chain ID Resolver",
    "aDesc": "Implement function getChainName(chainId) returning network name.",
    "aStarter": "function getChainName(id) { const m = { 1: 'Ethereum', 42161: 'Arbitrum', 10: 'Optimism', 137: 'Polygon' }; return m[id] || 'Unknown'; }",
    "aHint": "Map chain ID to network name.",
    "aTest": "if (getChainName(1) !== 'Ethereum' || getChainName(42161) !== 'Arbitrum') throw new Error('Chain resolver failed');"
  },
  {
    "day": 29,
    "title": "DAO Governance, Timelocks & Voting Mechanisms",
    "desc": "Decentralized autonomous organizations: OpenZeppelin `Governor` contracts, Quadratic Voting, Timelock controllers, and Quorum thresholds.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of DAO Governance, Timelocks & Voting Mechanisms.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "DAO Proposal Quorum & Voting Outcome Evaluator",
    "eDesc": "Implement function evaluateDaoProposal(votesFor, votesAgainst, votesAbstain, totalTokenSupply, quorumPercent = 4) calculating if proposal passed quorum.",
    "eStarter": "function evaluateDaoProposal(vFor, vAgainst, vAbstain, totalSupply, quorumPct = 4) {\n  const totalVotesCast = vFor + vAgainst + vAbstain;\n  const quorumRequired = totalSupply * (quorumPct / 100);\n  const quorumReached = totalVotesCast >= quorumRequired;\n  const majorityPassed = vFor > vAgainst;\n  const isApproved = quorumReached && majorityPassed;\n  return {\n    totalVotesCast,\n    quorumRequiredVotes: quorumRequired,\n    quorumReached,\n    majorityPassed,\n    proposalPassed: isApproved,\n    status: isApproved ? 'DAO_PROPOSAL_ACCEPTED_QUEUED_FOR_TIMELOCK' : 'DAO_PROPOSAL_REJECTED'\n  };\n}",
    "eHint": "Verify totalVotes >= quorumRequired and vFor > vAgainst.",
    "eTest": "const res = evaluateDaoProposal(60000, 20000, 5000, 1000000, 4); // 85k total votes > 40k quorum (4%)\nif (!res.proposalPassed || !res.quorumReached || res.status !== 'DAO_PROPOSAL_ACCEPTED_QUEUED_FOR_TIMELOCK') throw new Error('DAO evaluation failed');",
    "aTitle": "Timelock Delay Formatter",
    "aDesc": "Implement function formatTimelockDelay(delaySec = 172800) returning `${delaySec / 86400} days timelock delay`.",
    "aStarter": "function formatTimelockDelay(s = 172800) { return `${s / 86400} days timelock delay`; }",
    "aHint": "Convert seconds to days.",
    "aTest": "if (!formatTimelockDelay(172800).includes('2 days')) throw new Error('Timelock format failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Decentralized Finance (DeFi) & Staking Ecosystem",
    "desc": "Final Capstone Synthesis: The complete decentralized Web3 ecosystem: Solidity smart contracts, ERC-20 staking tokens, Uniswap AMM swaps, Chainlink price oracles, Reentrancy-safe CEI execution, EIP-1559 gas management, and Ethers.js frontend RPC integration.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Enterprise Decentralized Finance (DeFi) & Staking Ecosystem.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Capstone Enterprise DeFi Ecosystem Master Controller",
    "eDesc": "Implement function executeCapstoneWeb3Cycle(tokenContract, ammPool, oracle, stakingVault, userAccount) orchestrating full smart contract workflow.",
    "eStarter": "function executeCapstoneWeb3Cycle(token, amm, oracle, vault, user) {\n  // 1. Verify Oracle Price\n  const ethPrice = oracle.priceUsd;\n  // 2. AMM Swap\n  const swapSuccess = amm.reserveA > 0 && amm.reserveB > 0;\n  // 3. Staking Deposit\n  const stakedAmount = user.stakedTokens;\n  const isSolvent = swapSuccess && ethPrice > 0 && stakedAmount > 0;\n  return {\n    success: isSolvent,\n    tokenName: token.name,\n    ammLiquidityK: amm.reserveA * amm.reserveB,\n    userStakedBalance: stakedAmount,\n    systemStatus: 'ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED'\n  };\n}",
    "eHint": "Verify oracle price, AMM pool reserves, and user staking balance.",
    "eTest": "const token = { name: 'PinIT Governance Token (PINIT)' };\nconst amm = { reserveA: 500000, reserveB: 500000 };\nconst oracle = { priceUsd: 2500 };\nconst vault = { totalStaked: 100000 };\nconst user = { stakedTokens: 5000 };\nconst res = executeCapstoneWeb3Cycle(token, amm, oracle, vault, user);\nif (!res.success || res.systemStatus !== 'ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED' || res.ammLiquidityK !== 250000000000) throw new Error('Capstone Web3 ecosystem cycle failed');",
    "aTitle": "Capstone Web3 Certification Auditor",
    "aDesc": "Implement function auditWeb3CapstoneStatus() returning certification grade.",
    "aStarter": "function auditWeb3CapstoneStatus() { return { certified: true, score: '100/100', tier: 'ENTERPRISE_BLOCKCHAIN_SMART_CONTRACTS_CERTIFIED' }; }",
    "aHint": "Return certification object.",
    "aTest": "if (auditWeb3CapstoneStatus().certified !== true) throw new Error('Capstone audit failed');"
  }
];

export const BLOCKCHAIN_30_DAYS_QUESTS: CourseQuest[] = BLOCKCHAIN_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('blockchain', idx + 1, cfg)
);
