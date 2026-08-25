import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const BLOCKCHAIN_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Blockchain Fundamentals & Distributed Ledgers",
    "overviewMetaphor": "A Blockchain is a tamper-evident glass tower of notary ledgers: each page (Block) contains 1,000 recorded bank transactions; before gluing the next page on top, the notary signs the bottom with the exact digital wax seal (Cryptographic Hash) of the previous page; if an evil attacker attempts to secretly change 1 dollar on Page 3, Page 3's wax seal changes instantly, breaking the seal on Page 4, Page 5, and the entire glass tower collapses visibly across the network.",
    "blocks": [
      {
        "id": "chain-d1-b1-hash-pointer-immutability",
        "day": 1,
        "blockNumber": 1,
        "title": "Cryptographic Hash Pointers & The Immutability Invariant",
        "conceptBudget": {
          "primaryConcept": "Hash Pointer Immutability",
          "supportingTerms": [
            "Block Structure (Index, Timestamp, Data, Nonce, PreviousHash, CurrentHash)",
            "Hash Pointer ($H(B_{i-1})$)",
            "Tamper-Evident Avalanche Effect (Changing 1 single bit changes 100% of the SHA-256 hash digest)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Sequential Hash Pointer Chain",
              "boxes": [
                {
                  "label": "Block 0 (Genesis)",
                  "value": "Hash: 0x0000abc1 | Prev: 0x00000000 | Data: 'Genesis Mint'",
                  "varType": "Genesis Block",
                  "isUpdated": false
                },
                {
                  "label": "Block 1",
                  "value": "Hash: 0x0000def2 | Prev: 0x0000abc1 (Locks Block 0)",
                  "varType": "Block 1",
                  "isUpdated": false
                },
                {
                  "label": "Block 2",
                  "value": "Hash: 0x00007893 | Prev: 0x0000def2 (Locks Block 1)",
                  "varType": "Block 2",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "hash_chain_demo.js",
            "initialCode": "function evaluateChainLink(prevHash, actualPrevHash) {\n  return (prevHash === actualPrevHash)\n    ? 'CHAIN_VALID: UNTAMPERED_APPEND_ONLY_LEDGER'\n    : 'TAMPER_DETECTED: HASH_POINTER_MISMATCH_REJECTED';\n}\n\nconsole.log(evaluateChainLink('0xabc1', '0xabc1'));\nconsole.log(evaluateChainLink('0xabc1', '0xfake9'));",
            "expectedOutput": "CHAIN_VALID: UNTAMPERED_APPEND_ONLY_LEDGER\nTAMPER_DETECTED: HASH_POINTER_MISMATCH_REJECTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when a block's `previousHash` matches the cryptographic hash of the prior block?",
          "expectedStringOutput": "CHAIN_VALID: UNTAMPERED_APPEND_ONLY_LEDGER",
          "acceptableAnswers": [
            "CHAIN_VALID: UNTAMPERED_APPEND_ONLY_LEDGER",
            "CHAIN_VALID"
          ],
          "primaryMisconceptionId": "MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING",
          "diagnosisMap": {
            "TAMPER": {
              "misconceptionId": "MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING",
              "errorExplanation": "Matching hashes confirm CHAIN_VALID: UNTAMPERED_APPEND_ONLY_LEDGER.",
              "recoveryPath": {
                "simplerExplanation": "Matching hashes = CHAIN_VALID.",
                "guidedFixPrompt": "Type CHAIN_VALID: UNTAMPERED_APPEND_ONLY_LEDGER"
              }
            }
          }
        }
      },
      {
        "id": "chain-d1-b2-distributed-p2p-gossip",
        "day": 1,
        "blockNumber": 2,
        "title": "Peer-to-Peer (P2P) Gossip Protocol & State Synchronization",
        "conceptBudget": {
          "primaryConcept": "P2P Gossip State Synchronization",
          "supportingTerms": [
            "Gossip Network Protocol",
            "Mempool (Unconfirmed transaction waiting room)",
            "State Transition Function ($S' = \\text{APPLY}(S, \\text{TX})$)",
            "Byzantine Fault Tolerance (BFT: Tolerating up to 33% malicious traitor nodes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d1-b1-hash-pointer-immutability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Blockchain P2P Transaction Propagation Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "User signs transaction with private key -> Broadcasts to local node",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Node verifies signature & nonce -> Stores in local Mempool",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Gossip protocol broadcasts tx to 8 connected peer nodes in O(log N) hops",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Miner / Validator packages tx into next block -> Committed to global state!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gossip_sim.js",
            "initialCode": "function simulateGossipSpread(totalNodes, fanout = 8) {\n  let informedNodes = 1;\n  let hops = 0;\n  while (informedNodes < totalNodes) {\n    informedNodes *= fanout;\n    hops++;\n  }\n  return `In a network of ${totalNodes} nodes, gossip spreads to 100% of peers in ${hops} network hops!`;\n}\n\nconsole.log(simulateGossipSpread(10000, 8));",
            "expectedOutput": "In a network of 10000 nodes, gossip spreads to 100% of peers in 5 network hops!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary function of a blockchain node's Mempool?",
          "options": [
            "A temporary memory buffer where valid, signed transactions wait before being selected by a miner/validator to be included in the next block",
            "A hard drive backup folder for deleted transactions",
            "A mining reward wallet"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING",
              "errorExplanation": "The mempool holds pending transactions awaiting block inclusion.",
              "recoveryPath": {
                "simplerExplanation": "Temporary waiting room for unconfirmed transactions.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d1-b3-byzantine-generals-problem",
        "day": 1,
        "blockNumber": 3,
        "title": "The Byzantine Generals Problem & Distributed Consensus",
        "conceptBudget": {
          "primaryConcept": "Byzantine Fault Tolerance",
          "supportingTerms": [
            "Byzantine Traitor Nodes (Nodes sending conflicting conflicting blocks to different peers)",
            "Honest Majority Invariant ($> 50\\%$ PoW or $> 66.7\\%$ PoS)",
            "Sybil Attack Prevention (Tying voting power to scarce physical resources: Energy or Capital)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d1-b2-distributed-p2p-gossip",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bft_math_demo.js",
            "initialCode": "function evaluateBftSafety(totalNodes, maliciousNodes) {\n  const maxTolerated = Math.floor((totalNodes - 1) / 3);\n  const isSafe = maliciousNodes <= maxTolerated;\n  return {\n    totalNodes,\n    maliciousNodes,\n    maxTraitorNodesTolerated: maxTolerated,\n    consensusGuaranteed: isSafe,\n    status: isSafe ? 'BFT_CONSENSUS_STABLE' : 'BYZANTINE_SPLIT_HAZARD'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBftSafety(100, 30))); // 30 < 33 -> Safe\nconsole.log(JSON.stringify(evaluateBftSafety(100, 35))); // 35 > 33 -> Danger",
            "expectedOutput": "{\"totalNodes\":100,\"maliciousNodes\":30,\"maxTraitorNodesTolerated\":33,\"consensusGuaranteed\":true,\"status\":\"BFT_CONSENSUS_STABLE\"}\n{\"totalNodes\":100,\"maliciousNodes\":35,\"maxTraitorNodesTolerated\":33,\"consensusGuaranteed\":false,\"status\":\"BYZANTINE_SPLIT_HAZARD\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum number of malicious traitor nodes tolerated in a standard 100-node BFT network ($(100-1)/3$)?",
          "expectedStringOutput": "33",
          "acceptableAnswers": [
            "33",
            "maxTraitorNodesTolerated\":33"
          ],
          "primaryMisconceptionId": "MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING",
              "errorExplanation": "Classic BFT tolerates up to 1/3 (33 nodes). PoW longest-chain tolerates up to 50%.",
              "recoveryPath": {
                "simplerExplanation": "BFT threshold = 33 nodes.",
                "guidedFixPrompt": "Type 33"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Cryptographic Hashing (SHA-256) & Merkle Trees",
    "overviewMetaphor": "A Merkle Tree is a pyramid tournament bracket for cryptographic transactions: instead of downloading 5,000 transactions to prove you bought a coffee, the transactions sit at the bottom as leaf hashes; adjacent hashes combine pairwise into parent hashes ($H(A + B)$), rising to a single 32-byte Merkle Root stored in the block header; a Light Client (SPV) only needs 4 sibling hashes (Merkle Proof) to mathematically verify your transaction in milliseconds.",
    "blocks": [
      {
        "id": "chain-d2-b1-sha256-cryptographic-properties",
        "day": 2,
        "blockNumber": 1,
        "title": "SHA-256 Properties: Determinism, Pre-image & Collision Resistance",
        "conceptBudget": {
          "primaryConcept": "SHA-256 Properties",
          "supportingTerms": [
            "Deterministic (Same input always yields exact same 256-bit 64-character hex digest)",
            "One-Way Pre-Image Resistance (Computationally impossible to reverse $H(x) \\to x$)",
            "Avalanche Effect (Changing 1 bit flips ~50% of the output bits)",
            "256-Bit Output Space ($2^{256} \\approx 10^{77}$ atoms in observable universe)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d1-b1-hash-pointer-immutability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sha256_avalanche_demo.js",
            "initialCode": "function evaluateHashProperties() {\n  return 'SHA-256 guarantees: 1. Determinism | 2. Pre-image Resistance (One-Way) | 3. Collision Resistance | 4. Avalanche Effect';\n}\n\nconsole.log(evaluateHashProperties());",
            "expectedOutput": "SHA-256 guarantees: 1. Determinism | 2. Pre-image Resistance (One-Way) | 3. Collision Resistance | 4. Avalanche Effect",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is Pre-Image Resistance in cryptographic hashing?",
          "options": [
            "Given a hash digest $Y$, it is computationally infeasible to find the original input $X$ such that $H(X) = Y$ (One-way property)",
            "The ability to decode passwords easily",
            "Speeding up memory storage"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_MERKLE_TREE_ROOT_PROOF_VERIFICATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_MERKLE_TREE_ROOT_PROOF_VERIFICATION",
              "errorExplanation": "Pre-image resistance means the hash function cannot be reversed.",
              "recoveryPath": {
                "simplerExplanation": "One-way property: cannot reverse hash Y back to input X.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d2-b2-merkle-tree-root-construction",
        "day": 2,
        "blockNumber": 2,
        "title": "Binary Merkle Tree Construction & Pairwise Hash Rolling",
        "conceptBudget": {
          "primaryConcept": "Merkle Tree Construction",
          "supportingTerms": [
            "Leaf Nodes ($H(\\text{TX}_0), H(\\text{TX}_1) \\dots$)",
            "Pairwise Concatenation ($H_{01} = H(H_0 + H_1)$)",
            "Odd Node Duplication (If leaf count is odd, the last hash is duplicated to complete the pair)",
            "Merkle Root (Single 32-byte summary in Block Header)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d2-b1-sha256-cryptographic-properties",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Binary Merkle Tree Level Hierarchy",
              "boxes": [
                {
                  "label": "Level 2 (Root)",
                  "value": "Merkle Root: H( H(A+B) + H(C+D) ) -> Stored in Block Header",
                  "varType": "Merkle Root",
                  "isUpdated": true
                },
                {
                  "label": "Level 1 (Branches)",
                  "value": "Branch Left: H(A+B) | Branch Right: H(C+D)",
                  "varType": "Parent Hashes",
                  "isUpdated": false
                },
                {
                  "label": "Level 0 (Leaves)",
                  "value": "TxA: H(tx0) | TxB: H(tx1) | TxC: H(tx2) | TxD: H(tx3)",
                  "varType": "Leaf Hashes",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "merkle_root_demo.js",
            "initialCode": "function buildMerkleRoot(leaves) {\n  let currentLevel = [...leaves];\n  while (currentLevel.length > 1) {\n    if (currentLevel.length % 2 !== 0) {\n      currentLevel.push(currentLevel[currentLevel.length - 1]); // Duplicate odd tail\n    }\n    const nextLevel = [];\n    for (let i = 0; i < currentLevel.length; i += 2) {\n      nextLevel.push(`H(${currentLevel[i]}+${currentLevel[i+1]})`);\n    }\n    currentLevel = nextLevel;\n  }\n  return currentLevel[0];\n}\n\nconsole.log(buildMerkleRoot(['A', 'B', 'C', 'D']));",
            "expectedOutput": "H(H(A+B)+H(C+D))",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Merkle Root is constructed for 4 transaction leaves ['A', 'B', 'C', 'D']?",
          "expectedStringOutput": "H(H(A+B)+H(C+D))",
          "acceptableAnswers": [
            "H(H(A+B)+H(C+D))"
          ],
          "primaryMisconceptionId": "MC_CHAIN_MERKLE_TREE_ROOT_PROOF_VERIFICATION",
          "diagnosisMap": {
            "H(A+B+C+D)": {
              "misconceptionId": "MC_CHAIN_MERKLE_TREE_ROOT_PROOF_VERIFICATION",
              "errorExplanation": "Merkle trees hash pairwise hierarchically: H(H(A+B)+H(C+D)).",
              "recoveryPath": {
                "simplerExplanation": "Combines in pairs -> H(H(A+B)+H(C+D)).",
                "guidedFixPrompt": "Type H(H(A+B)+H(C+D))"
              }
            }
          }
        }
      },
      {
        "id": "chain-d2-b3-merkle-inclusion-proofs-spv",
        "day": 2,
        "blockNumber": 3,
        "title": "Simplified Payment Verification (SPV) & $O(\\log N)$ Merkle Proofs",
        "conceptBudget": {
          "primaryConcept": "Merkle Inclusion Proofs (SPV)",
          "supportingTerms": [
            "Light Client (Downloads only 80-byte block headers, zero transaction payloads)",
            "Merkle Proof ($K = \\log_2 N$ sibling hashes)",
            "Verifying 1 transaction out of 1,000,000 in 20 hash steps"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d2-b2-merkle-tree-root-construction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "spv_proof_demo.js",
            "initialCode": "function calculateProofSize(txCount) {\n  const hashesNeeded = Math.ceil(Math.log2(txCount));\n  const proofBytes = hashesNeeded * 32;\n  return {\n    totalTransactionsInBlock: txCount,\n    merkleProofHashesNeeded: hashesNeeded,\n    totalProofDataSize: `${proofBytes} bytes`,\n    efficiencyRatio: `${(txCount / hashesNeeded).toFixed(0)}x REDUCTION`\n  };\n}\n\nconsole.log(JSON.stringify(calculateProofSize(1048576))); // 1 Million transactions!",
            "expectedOutput": "{\"totalTransactionsInBlock\":1048576,\"merkleProofHashesNeeded\":20,\"totalProofDataSize\":\"640 bytes\",\"efficiencyRatio\":\"52429x REDUCTION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many 32-byte sibling hashes are required to prove transaction inclusion in a block with 1,048,576 transactions ($\\log_2(2^{20})$)?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "merkleProofHashesNeeded\":20",
            "20 hashes"
          ],
          "primaryMisconceptionId": "MC_CHAIN_MERKLE_TREE_ROOT_PROOF_VERIFICATION",
          "diagnosisMap": {
            "1000000": {
              "misconceptionId": "MC_CHAIN_MERKLE_TREE_ROOT_PROOF_VERIFICATION",
              "errorExplanation": "Merkle proofs scale logarithmically O(log2 N). log2(1,048,576) = 20 hashes.",
              "recoveryPath": {
                "simplerExplanation": "log2(1048576) = 20 hashes.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Asymmetric Cryptography & Ethereum Keypairs",
    "overviewMetaphor": "Asymmetric Keypairs are a padlocked mailbox: your Public Key (and Derived Wallet Address) is your house mailbox slot on the street (Anyone can drop money or letters in!); your Private Key is the master physical key kept in your pocket (Only you can unlock the box and spend the money); if you lose your private key, the mailbox remains welded shut forever because no bank manager has a duplicate master key.",
    "blocks": [
      {
        "id": "chain-d3-b1-secp256k1-elliptic-curve-math",
        "day": 3,
        "blockNumber": 1,
        "title": "Elliptic Curve Cryptography (`secp256k1`: $y^2 = x^3 + 7 \\pmod p$)",
        "conceptBudget": {
          "primaryConcept": "secp256k1 Elliptic Curve Math",
          "supportingTerms": [
            "Curve Equation: $y^2 = x^3 + 7 \\pmod p$",
            "Generator Point $G$",
            "Private Key $k$ (256-bit integer)",
            "Public Key Point: $K = k \\cdot G$ (Elliptic curve point multiplication)",
            "Discrete Logarithm Hardness (Impossible to divide $K / G$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d2-b1-sha256-cryptographic-properties",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ECDSA secp256k1 Key Generation Invariant",
            "codeSnippet": "// 1. Generate 256-bit random private key integer k:\nconst privateKey = crypto.randomBytes(32);\n\n// 2. Compute Public Key Point K = k * G on curve y^2 = x^3 + 7:\nconst publicKey = secp256k1.publicKeyCreate(privateKey, false); // 65 bytes (0x04 + X + Y)\n\n// 3. Point multiplication is ONE-WAY (Trapdoor function): k*G is instant; K/G is impossible!",
            "lineNotes": {
              "5": "Creates uncompressed 65-byte public key point (X, Y).",
              "7": "ECDSA security relies on the hardness of the Discrete Logarithm problem."
            }
          },
          {
            "type": "runnable_code",
            "filename": "secp256k1_demo.js",
            "initialCode": "function evaluateKeypair() {\n  return 'Private Key (k) -> [x Generator Point G] -> Public Key Point (K) -> [Keccak-256 slice last 20 bytes] -> 0x Ethereum Wallet Address';\n}\n\nconsole.log(evaluateKeypair());",
            "expectedOutput": "Private Key (k) -> [x Generator Point G] -> Public Key Point (K) -> [Keccak-256 slice last 20 bytes] -> 0x Ethereum Wallet Address",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is it mathematically impossible for an attacker to calculate your private key $k$ from your public key $K$?",
          "options": [
            "Because elliptic curve scalar point multiplication ($K = k \\cdot G$) is a one-way trapdoor function; reversing it requires solving the Elliptic Curve Discrete Logarithm Problem (ECDLP), which would take billions of years on modern supercomputers",
            "Because public keys are hidden on private servers",
            "Because Ethereum uses passwords"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_ASYMMETRIC_SECP256K1_KEYPAIR_ADDRESS_DERIVATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_ASYMMETRIC_SECP256K1_KEYPAIR_ADDRESS_DERIVATION",
              "errorExplanation": "Security is rooted in the computational hardness of the Elliptic Curve Discrete Logarithm Problem.",
              "recoveryPath": {
                "simplerExplanation": "One-way ECDLP math cannot be reversed.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d3-b2-ethereum-address-derivation",
        "day": 3,
        "blockNumber": 2,
        "title": "Ethereum Address Derivation: Keccak-256 & 20-Byte Truncation",
        "conceptBudget": {
          "primaryConcept": "Ethereum Address Derivation",
          "supportingTerms": [
            "Uncompressed Public Key (64 bytes: 32 bytes $X$ + 32 bytes $Y$ without `0x04` prefix)",
            "Keccak-256 Hash Digest (32 bytes)",
            "Address Truncation (Take last 20 bytes: Bytes 12..31)",
            "40 Hex characters + `0x` prefix = 42-character address"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d3-b1-secp256k1-elliptic-curve-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Ethereum Address Extraction from Keccak-256 Hash",
              "boxes": [
                {
                  "label": "Bytes 0 - 11 (12 Bytes / 24 Hex Chars)",
                  "value": "Discarded prefix (First 96 bits dropped)",
                  "varType": "Discarded",
                  "isUpdated": false
                },
                {
                  "label": "Bytes 12 - 31 (20 Bytes / 40 Hex Chars)",
                  "value": "Kept as Ethereum Wallet Address (160 bits: e.g. 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045)",
                  "varType": "Wallet Address",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "eth_address_calc_demo.js",
            "initialCode": "function deriveAddressFromHash(keccak32Hex) {\n  const raw20Bytes = keccak32Hex.slice(-40);\n  return `0x${raw20Bytes.toLowerCase()}`;\n}\n\nconst mockHash = '0x1234567890abcdef1234567890abcdefd8da6bf26964af9d7eed9e03e53415d37aa96045';\nconsole.log('Derived Address:', deriveAddressFromHash(mockHash));",
            "expectedOutput": "Derived Address: 0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total bytes are extracted from the Keccak-256 public key hash to form an Ethereum address?",
          "expectedStringOutput": "20 bytes",
          "acceptableAnswers": [
            "20 bytes",
            "20",
            "20 Bytes",
            "160 bits"
          ],
          "primaryMisconceptionId": "MC_CHAIN_ASYMMETRIC_SECP256K1_KEYPAIR_ADDRESS_DERIVATION",
          "diagnosisMap": {
            "32": {
              "misconceptionId": "MC_CHAIN_ASYMMETRIC_SECP256K1_KEYPAIR_ADDRESS_DERIVATION",
              "errorExplanation": "32 bytes is the full hash. Ethereum addresses keep only the last 20 bytes.",
              "recoveryPath": {
                "simplerExplanation": "Keeps the last 20 bytes (40 hex chars).",
                "guidedFixPrompt": "Type 20 bytes"
              }
            }
          }
        }
      },
      {
        "id": "chain-d3-b3-eip55-checksum-capitalization",
        "day": 3,
        "blockNumber": 3,
        "title": "EIP-55 Mixed-Case Checksum Formatting",
        "conceptBudget": {
          "primaryConcept": "EIP-55 Address Checksums",
          "supportingTerms": [
            "Typos Hazard (Sending millions of dollars to a mistyped hexadecimal address burns funds forever)",
            "EIP-55 Checksum: Capitalize hex char $i$ if $i$-th nibble of $\\text{Keccak-256}(\\text{lowercaseAddress}) \\ge 8$",
            "Instantly detects mistyped letters in wallets"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d3-b2-ethereum-address-derivation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "eip55_checksum_demo.js",
            "initialCode": "function evaluateEip55(address) {\n  const hasMixedCase = /[a-f]/.test(address) && /[A-F]/.test(address);\n  return hasMixedCase\n    ? 'EIP55_CHECKSUM_VALIDATED: PROTECTED_AGAINST_TYPOS'\n    : 'RAW_UNCHECKED_ADDRESS';\n}\n\nconsole.log(evaluateEip55('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'));",
            "expectedOutput": "EIP55_CHECKSUM_VALIDATED: PROTECTED_AGAINST_TYPOS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What problem does the EIP-55 mixed-case checksum standard solve for Ethereum addresses?",
          "options": [
            "It embeds an error-checking hash into the uppercase/lowercase capitalization of address letters, preventing users from accidentally sending funds to mistyped wallet addresses",
            "It speeds up transaction mining",
            "It reduces gas fees"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_ASYMMETRIC_SECP256K1_KEYPAIR_ADDRESS_DERIVATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_ASYMMETRIC_SECP256K1_KEYPAIR_ADDRESS_DERIVATION",
              "errorExplanation": "EIP-55 detects mistyped hexadecimal addresses to prevent loss of funds.",
              "recoveryPath": {
                "simplerExplanation": "Prevents typo errors when typing addresses.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Proof of Work (PoW) Mining & Difficulty Nonce",
    "overviewMetaphor": "Proof of Work Mining is a global lottery with 100-sided dice: all miners roll trillions of random Nonce numbers per second trying to find a combined block hash that starts with 10 leading zeroes ($H(\\text{Block} + \\text{Nonce}) < \\text{Target}$); finding the winning Nonce requires immense electrical energy; but once found, any other computer can verify the winner in 1 microsecond by running 1 single hash calculation (Asymmetric verification!).",
    "blocks": [
      {
        "id": "chain-d4-b1-pow-target-difficulty-math",
        "day": 4,
        "blockNumber": 1,
        "title": "The Proof of Work Target Condition ($H(\\text{Header}) < \\text{Target}$)",
        "conceptBudget": {
          "primaryConcept": "Proof of Work Target Math",
          "supportingTerms": [
            "Target Threshold (256-bit number: smaller target = harder difficulty)",
            "Leading Zeroes requirement",
            "Nonce (32-bit arbitrary number incremented in mining loop)",
            "ExtraNonce in Coinbase transaction"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d2-b1-sha256-cryptographic-properties",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Proof of Work Mining Loop Algorithm",
            "codeSnippet": "let nonce = 0;\nconst target = getNetworkTargetDifficulty();\nwhile (true) {\n  const headerHash = sha256(sha256(serializeHeader(block, nonce)));\n  if (BigInt(headerHash) < target) {\n    block.nonce = nonce;\n    block.hash = headerHash;\n    broadcastBlockToPeers(block); // Winning block mined!\n    break;\n  }\n  nonce++;\n}",
            "lineNotes": {
              "5": "Condition for valid block: hash interpreted as integer must be strictly less than Target.",
              "6": "Saves winning nonce in header for O(1) instant peer verification."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pow_target_sim.js",
            "initialCode": "function checkPowCondition(hashHex, leadingZeroesRequired) {\n  const prefix = '0'.repeat(leadingZeroesRequired);\n  const passed = hashHex.startsWith(prefix);\n  return {\n    hashHex,\n    leadingZeroesRequired,\n    isValidProofOfWork: passed,\n    status: passed ? 'POW_ACCEPTED_BLOCK_VALID' : 'POW_REJECTED_DIFFICULTY_NOT_MET'\n  };\n}\n\nconsole.log(JSON.stringify(checkPowCondition('0000abc123456789', 4)));\nconsole.log(JSON.stringify(checkPowCondition('0012abc123456789', 4)));",
            "expectedOutput": "{\"hashHex\":\"0000abc123456789\",\"leadingZeroesRequired\":4,\"isValidProofOfWork\":true,\"status\":\"POW_ACCEPTED_BLOCK_VALID\"}\n{\"hashHex\":\"0012abc123456789\",\"leadingZeroesRequired\":4,\"isValidProofOfWork\":false,\"status\":\"POW_REJECTED_DIFFICULTY_NOT_MET\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms a block hash starting with 4 leading zeroes when 4 zeroes are required?",
          "expectedStringOutput": "POW_ACCEPTED_BLOCK_VALID",
          "acceptableAnswers": [
            "POW_ACCEPTED_BLOCK_VALID",
            "status\":\"POW_ACCEPTED_BLOCK_VALID\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_WORK_DIFFICULTY_NONCE",
          "diagnosisMap": {
            "REJECTED": {
              "misconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_WORK_DIFFICULTY_NONCE",
              "errorExplanation": "4 leading zeroes matches requirement, returning POW_ACCEPTED_BLOCK_VALID.",
              "recoveryPath": {
                "simplerExplanation": "Matches requirement -> POW_ACCEPTED_BLOCK_VALID.",
                "guidedFixPrompt": "Type POW_ACCEPTED_BLOCK_VALID"
              }
            }
          }
        }
      },
      {
        "id": "chain-d4-b2-difficulty-adjustment-algorithm",
        "day": 4,
        "blockNumber": 2,
        "title": "Dynamic Difficulty Readjustment: Maintaining 10-Minute Blocks",
        "conceptBudget": {
          "primaryConcept": "Difficulty Readjustment",
          "supportingTerms": [
            "Target Block Time ($T_{\\text{target}} = 10\\text{ minutes}$ in Bitcoin)",
            "2016 Block Adjustment Window ($\\approx 2\\text{ weeks}$)",
            "Formula: $\\text{NewTarget} = \\text{OldTarget} \\times \\frac{\\text{ActualTime}}{20160\\text{ min}}$",
            "Damping factor (Target adjustment clamped between $0.25x$ and $4x$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d4-b1-pow-target-difficulty-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "difficulty_retarget_demo.js",
            "initialCode": "function calculateRetarget(expectedMinutes = 20160, actualMinutes = 10080) {\n  // If blocks mined in half the time (hashrate doubled), difficulty must double!\n  const ratio = actualMinutes / expectedMinutes;\n  const clampedRatio = Math.max(0.25, Math.min(4.0, ratio));\n  return {\n    expectedMinutes,\n    actualMinutes,\n    targetMultiplier: clampedRatio,\n    adjustmentAction: (clampedRatio < 1.0) ? 'INCREASE_DIFFICULTY_MAKE_MINING_HARDER' : 'DECREASE_DIFFICULTY'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRetarget(20160, 10080)));",
            "expectedOutput": "{\"expectedMinutes\":20160,\"actualMinutes\":10080,\"targetMultiplier\":0.5,\"adjustmentAction\":\"INCREASE_DIFFICULTY_MAKE_MINING_HARDER\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if massive new mining hardware joins the network and mines 2016 blocks in only 1 week instead of 2 weeks?",
          "options": [
            "The difficulty readjustment algorithm cuts the Target in half, doubling mining difficulty so future blocks return to the steady 10-minute target average",
            "The blockchain shuts down",
            "Transactions become free"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_WORK_DIFFICULTY_NONCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_WORK_DIFFICULTY_NONCE",
              "errorExplanation": "Difficulty increases to maintain constant average block production times.",
              "recoveryPath": {
                "simplerExplanation": "Increases difficulty to keep block times at 10 minutes.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d4-b3-fifty-one-percent-attack-dynamics",
        "day": 4,
        "blockNumber": 3,
        "title": "Longest Chain Rule & The 51% Double-Spend Attack",
        "conceptBudget": {
          "primaryConcept": "Longest Chain Rule & 51% Attack",
          "supportingTerms": [
            "Heaviest / Longest Chain Rule (Cumulative Proof of Work determines canonical ledger truth)",
            "51% Hashrate Attack (Mining an alternate private chain faster than the honest network)",
            "Double-Spending (Reversing confirmed payments)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d4-b2-difficulty-adjustment-algorithm",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fifty_one_sim.js",
            "initialCode": "function evaluateChainFork(chainAWork, chainBWork) {\n  return (chainBWork > chainAWork)\n    ? 'CHAIN_B_WINS: REORGANIZE_CANONICAL_STATE_TO_LONGEST_CHAIN'\n    : 'CHAIN_A_MAINTAINS_CONSENSUS';\n}\n\nconsole.log(evaluateChainFork(1000, 1500)); // Chain B has more accumulated work",
            "expectedOutput": "CHAIN_B_WINS: REORGANIZE_CANONICAL_STATE_TO_LONGEST_CHAIN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which chain is accepted as canonical by all honest nodes when Chain B has 1500 cumulative PoW work vs Chain A with 1000 work?",
          "expectedStringOutput": "CHAIN_B_WINS: REORGANIZE_CANONICAL_STATE_TO_LONGEST_CHAIN",
          "acceptableAnswers": [
            "CHAIN_B_WINS: REORGANIZE_CANONICAL_STATE_TO_LONGEST_CHAIN",
            "CHAIN_B_WINS",
            "Chain B"
          ],
          "primaryMisconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_WORK_DIFFICULTY_NONCE",
          "diagnosisMap": {
            "CHAIN_A": {
              "misconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_WORK_DIFFICULTY_NONCE",
              "errorExplanation": "Nodes always follow the chain with the most accumulated Proof of Work (Chain B).",
              "recoveryPath": {
                "simplerExplanation": "Longest chain with highest PoW work wins.",
                "guidedFixPrompt": "Type CHAIN_B_WINS: REORGANIZE_CANONICAL_STATE_TO_LONGEST_CHAIN"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Cryptographic Blockchain Ledger & Merkle Validator Engine",
    "overviewMetaphor": "Milestone 1 — The Sovereign Ledger: We build the complete foundational cryptographic ledger: transaction batching, binary Merkle Tree construction, SHA-256 block hash chaining, dynamic difficulty nonce mining, and tamper-detection engines that catch modified transactions instantly.",
    "blocks": [
      {
        "id": "chain-d5-b1-block-schema-and-mining",
        "day": 5,
        "blockNumber": 1,
        "title": "Block Header Schema & Nonce Proof Mining Engine",
        "conceptBudget": {
          "primaryConcept": "Complete Block Header Architecture",
          "supportingTerms": [
            "Block Header (Index, Timestamp, MerkleRoot, PreviousHash, Nonce, Difficulty)",
            "Mining Engine Loop",
            "O(1) Instant Verification Guarantee"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d4-b1-pow-target-difficulty-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Block Header Object Schema",
            "codeSnippet": "const block = {\n  index: 1,\n  timestamp: 1700000000,\n  transactions: ['Alice -> Bob: 5 PINIT', 'Carol -> Dave: 10 PINIT'],\n  merkleRoot: '0x3a4f...',\n  previousHash: '0x0000abc1...',\n  nonce: 48291,\n  hash: '0x0000789d...'\n};",
            "lineNotes": {
              "4": "Merkle root summarizes all transactions in 32 bytes.",
              "6": "Nonce discovered by mining loop satisfying difficulty threshold."
            }
          },
          {
            "type": "runnable_code",
            "filename": "milestone1_ledger_demo.js",
            "initialCode": "function executeMiningCycle(index, data, prevHash, leadingZeroes = 2) {\n  let nonce = 0;\n  const target = '0'.repeat(leadingZeroes);\n  while (nonce < 100000) {\n    const hash = ((nonce * 2654435761) >>> 0).toString(16).padStart(8, '0');\n    if (hash.startsWith(target)) {\n      return { index, nonce, hash: `0x${hash}`, status: 'BLOCK_MINED_AND_COMMITTED' };\n    }\n    nonce++;\n  }\n  return { status: 'FAILED' };\n}\n\nconsole.log(executeMiningCycle(1, 'TX_POOL_01', '0x0000abc1', 2).status);",
            "expectedOutput": "BLOCK_MINED_AND_COMMITTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms successful mining and commitment of a cryptographic block?",
          "expectedStringOutput": "BLOCK_MINED_AND_COMMITTED",
          "acceptableAnswers": [
            "BLOCK_MINED_AND_COMMITTED",
            "status: BLOCK_MINED_AND_COMMITTED"
          ],
          "primaryMisconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_WORK_DIFFICULTY_NONCE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_WORK_DIFFICULTY_NONCE",
              "errorExplanation": "Matches BLOCK_MINED_AND_COMMITTED.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLOCK_MINED_AND_COMMITTED.",
                "guidedFixPrompt": "Type BLOCK_MINED_AND_COMMITTED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d5-b2-tamper-detection-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Cryptographic Tamper-Detection & Ledger State Audit",
        "conceptBudget": {
          "primaryConcept": "Ledger State Audit",
          "supportingTerms": [
            "Audit Verification Loop",
            "Detecting hash pointer breakage",
            "Merkle root consistency check"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d5-b1-block-schema-and-mining",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ledger_audit_demo.js",
            "initialCode": "function auditLedgerIntegrity(blockCount, tamperedIndex = -1) {\n  const isClean = tamperedIndex === -1;\n  return {\n    blocksAudited: blockCount,\n    isCryptographicallyIntact: isClean,\n    grade: isClean ? 'LEDGER_AUDIT_PASSED_100_PERCENT' : 'TAMPERED_BLOCK_REJECTED'\n  };\n}\n\nconsole.log(JSON.stringify(auditLedgerIntegrity(500, -1)));",
            "expectedOutput": "{\"blocksAudited\":500,\"isCryptographicallyIntact\":true,\"grade\":\"LEDGER_AUDIT_PASSED_100_PERCENT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded to an untampered 500-block cryptographic ledger?",
          "expectedStringOutput": "LEDGER_AUDIT_PASSED_100_PERCENT",
          "acceptableAnswers": [
            "LEDGER_AUDIT_PASSED_100_PERCENT",
            "grade\":\"LEDGER_AUDIT_PASSED_100_PERCENT\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING",
          "diagnosisMap": {
            "REJECTED": {
              "misconceptionId": "MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING",
              "errorExplanation": "Untampered ledger passes 100%, awarding LEDGER_AUDIT_PASSED_100_PERCENT.",
              "recoveryPath": {
                "simplerExplanation": "Awards LEDGER_AUDIT_PASSED_100_PERCENT.",
                "guidedFixPrompt": "Type LEDGER_AUDIT_PASSED_100_PERCENT"
              }
            }
          }
        }
      },
      {
        "id": "chain-d5-b3-milestone1-blockchain-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Cryptographic Blockchain Ledger Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Blockchain Ledger Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d5-b2-tamper-detection-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_chain_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Cryptographic Blockchain Ledger & Merkle Validator Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Cryptographic Blockchain Ledger & Merkle Validator Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Cryptographic Blockchain Ledger & Merkle Validator Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Cryptographic Blockchain Ledger & Merkle Validator Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_IMMUTABLE_HASH_POINTER_BLOCK_TAMPERING",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Cryptographic Blockchain Ledger & Merkle Validator Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Proof of Stake (PoS), Validators & Slashing Conditions",
    "overviewMetaphor": "Proof of Stake is a court security bail bond: instead of burning megawatts of electricity running supercomputers (PoW), a Validator deposits 32 ETH in an escrow vault as security collateral; if the validator acts honestly and votes on valid blocks, they earn 4% annual staking interest; but if the validator tries to double-vote or submit conflicting blocks (Traitor behavior), the blockchain's Slashing Protocol destroys their 32 ETH bond and permanently bans their validator node.",
    "blocks": [
      {
        "id": "chain-d6-b1-pos-staking-and-validators",
        "day": 6,
        "blockNumber": 1,
        "title": "Ethereum Proof of Stake Architecture (32 ETH Staking & RANDAO)",
        "conceptBudget": {
          "primaryConcept": "Proof of Stake Architecture",
          "supportingTerms": [
            "32 ETH Validator Deposit",
            "Slot (12 seconds) vs Epoch (32 slots = 6.4 minutes)",
            "RANDAO Randomness Beacon for leader selection",
            "Attestations (Signatures voting on source and target checkpoints)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d4-b1-pow-target-difficulty-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Ethereum PoS Epoch & Slot Time Breakdown",
              "boxes": [
                {
                  "label": "1. Slot (12 Seconds)",
                  "value": "1 Block proposed by 1 chosen Validator + Attested by Committee",
                  "varType": "Slot Time",
                  "isUpdated": false
                },
                {
                  "label": "2. Epoch (32 Slots = 6.4 Minutes)",
                  "value": "Checkpoint boundary for Casper FFG 2/3 supermajority finalization",
                  "varType": "Epoch Time",
                  "isUpdated": false
                },
                {
                  "label": "3. Finalized State (2 Epochs = 12.8 Min)",
                  "value": "Irreversible cryptographic finality (Requires 33% total ETH burn to revert!)",
                  "varType": "Finality",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pos_epoch_demo.js",
            "initialCode": "function calculateEpochTimes(slotsPerEpoch = 32, secondsPerSlot = 12) {\n  const epochDurationSec = slotsPerEpoch * secondsPerSlot;\n  return {\n    slotsPerEpoch,\n    secondsPerSlot,\n    epochDurationMinutes: Number((epochDurationSec / 60).toFixed(1)),\n    finalityDurationMinutes: Number(((epochDurationSec * 2) / 60).toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(calculateEpochTimes(32, 12)));",
            "expectedOutput": "{\"slotsPerEpoch\":32,\"secondsPerSlot\":12,\"epochDurationMinutes\":6.4,\"finalityDurationMinutes\":12.8}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the duration of an Ethereum PoS epoch in minutes ($32 \\times 12\\text{s} / 60$)?",
          "expectedStringOutput": "6.4",
          "acceptableAnswers": [
            "6.4",
            "6.4 minutes",
            "epochDurationMinutes\":6.4"
          ],
          "primaryMisconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_STAKE_SLASHING_VALIDATOR",
          "diagnosisMap": {
            "12": {
              "misconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_STAKE_SLASHING_VALIDATOR",
              "errorExplanation": "12 seconds is for 1 slot. 1 epoch (32 slots) is 6.4 minutes.",
              "recoveryPath": {
                "simplerExplanation": "32 * 12 / 60 = 6.4 minutes.",
                "guidedFixPrompt": "Type 6.4"
              }
            }
          }
        }
      },
      {
        "id": "chain-d6-b2-slashing-penalties-and-inactivity",
        "day": 6,
        "blockNumber": 2,
        "title": "Slashing Protocols: Double Signing & Surround Votes",
        "conceptBudget": {
          "primaryConcept": "Slashing Penalties",
          "supportingTerms": [
            "Double Propose (Proposing 2 distinct blocks for the same slot)",
            "Double Vote / Surround Vote (Voting for 2 conflicting checkpoint targets)",
            "Immediate 1 ETH Penalty + Correlation Penalty + Ejection from Validator Set"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d6-b1-pos-staking-and-validators",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Honest Single Vote vs Slashing Double Vote Diff",
              "brokenCode": "// ❌ MALICIOUS DOUBLE VOTE (Slashing Triggered!):\nAttestation 1: { epoch: 100, targetRoot: 0xRootA }\nAttestation 2: { epoch: 100, targetRoot: 0xRootB } // Slashed for signing two conflicting realities!",
              "fixedCode": "// ✅ 100% HONEST VALIDATOR SIGNATURE:\nAttestation: { epoch: 100, targetRoot: 0xRootA } // Single unequivocal vote on canonical block!",
              "errorLine": 3,
              "errorReason": "Signing two different blocks for the same target epoch breaks consensus safety.",
              "fixExplanation": "Validators must sign exactly one attestation per epoch."
            }
          },
          {
            "type": "runnable_code",
            "filename": "slashing_eval_demo.js",
            "initialCode": "function evaluateSlashing(isDoubleSigner) {\n  return isDoubleSigner\n    ? 'SLASHED: VALIDATOR_DEPOSIT_DESTROYED_AND_EJECTED'\n    : 'HONEST_VALIDATOR: STAKING_REWARDS_ACCRUED';\n}\n\nconsole.log(evaluateSlashing(true));\nconsole.log(evaluateSlashing(false));",
            "expectedOutput": "SLASHED: VALIDATOR_DEPOSIT_DESTROYED_AND_EJECTED\nHONEST_VALIDATOR: STAKING_REWARDS_ACCRUED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does the Proof of Stake protocol instantly slash validators who double-sign conflicting blocks?",
          "options": [
            "Because signing conflicting blocks creates competing chain forks, threatening consensus finality; slashing burns the validator's staked ETH to make attacks financially catastrophic",
            "Because double signing uses too much electricity",
            "To reset user balances"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_STAKE_SLASHING_VALIDATOR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_STAKE_SLASHING_VALIDATOR",
              "errorExplanation": "Slashing imposes financial penalties to eliminate double-signing attacks.",
              "recoveryPath": {
                "simplerExplanation": "Makes conflicting chain attacks financially ruinous.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d6-b3-casper-ffg-finality-gadget",
        "day": 6,
        "blockNumber": 3,
        "title": "Casper FFG 2/3 Supermajority Finality Gadget",
        "conceptBudget": {
          "primaryConcept": "Casper FFG Supermajority Finality",
          "supportingTerms": [
            "2/3 Supermajority Threshold ($> 66.67\\%$ active stake)",
            "Justified Epoch $\\to$ Finalized Epoch",
            "Economic Finality (Reverting requires destroying $> 33\\%$ of all staked ETH on Earth = $10+ Billion)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d6-b2-slashing-penalties-and-inactivity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "casper_ffg_demo.js",
            "initialCode": "function evaluateCasperFinality(activeStakeEth, votesForCheckpointEth) {\n  const voteRatio = votesForCheckpointEth / activeStakeEth;\n  const isFinalized = voteRatio >= (2 / 3);\n  return {\n    votePercent: `${(voteRatio * 100).toFixed(1)}%`,\n    isSupermajorityMet: isFinalized,\n    status: isFinalized ? 'CHECKPOINT_FINALIZED_ECONOMICALLY_IRREVERSIBLE' : 'JUSTIFIED_AWAITING_VOTES'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCasperFinality(30000000, 22000000))); // 73.3% > 66.7%",
            "expectedOutput": "{\"votePercent\":\"73.3%\",\"isSupermajorityMet\":true,\"status\":\"CHECKPOINT_FINALIZED_ECONOMICALLY_IRREVERSIBLE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is achieved when 73.3% of active stake votes for an epoch checkpoint (exceeding the 2/3 supermajority)?",
          "expectedStringOutput": "CHECKPOINT_FINALIZED_ECONOMICALLY_IRREVERSIBLE",
          "acceptableAnswers": [
            "CHECKPOINT_FINALIZED_ECONOMICALLY_IRREVERSIBLE",
            "status\":\"CHECKPOINT_FINALIZED_ECONOMICALLY_IRREVERSIBLE\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_STAKE_SLASHING_VALIDATOR",
          "diagnosisMap": {
            "JUSTIFIED": {
              "misconceptionId": "MC_CHAIN_CONSENSUS_PROOF_OF_STAKE_SLASHING_VALIDATOR",
              "errorExplanation": "73.3% > 66.7% completes finalization: CHECKPOINT_FINALIZED_ECONOMICALLY_IRREVERSIBLE.",
              "recoveryPath": {
                "simplerExplanation": "Matches CHECKPOINT_FINALIZED_ECONOMICALLY_IRREVERSIBLE.",
                "guidedFixPrompt": "Type CHECKPOINT_FINALIZED_ECONOMICALLY_IRREVERSIBLE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "UTXO vs Account-Based State Models",
    "overviewMetaphor": "UTXO vs Accounts is Physical Cash vs Bank Balances: Bitcoin's UTXO model is paying with physical $20 bills from your wallet (To spend $15, you hand over the $20 bill (Input) and receive a fresh $5 bill (Change UTXO); bills cannot be split into halves); Ethereum's Account Model is a checking account spreadsheet (Your balance is a single number $1,000; sending $15 simply subtracts 15 from your row and adds 15 to the recipient's row).",
    "blocks": [
      {
        "id": "chain-d7-b1-utxo-transaction-graph",
        "day": 7,
        "blockNumber": 1,
        "title": "Bitcoin UTXO (Unspent Transaction Output) Graph Architecture",
        "conceptBudget": {
          "primaryConcept": "UTXO Graph Model",
          "supportingTerms": [
            "Unspent Transaction Output (UTXO: Atomic immutable cash note)",
            "Transaction Inputs (Consume complete UTXOs via `txid:vout` reference)",
            "Transaction Outputs (Create new UTXOs with locking script `scriptPubKey`)",
            "Miner Fee: $\\text{Fee} = \\sum \\text{Inputs} - \\sum \\text{Outputs}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d1-b1-hash-pointer-immutability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "UTXO Consumption & Output Generation",
              "boxes": [
                {
                  "label": "1. Inputs (Consumed)",
                  "value": "UTXO #1: 0.50 BTC + UTXO #2: 0.30 BTC -> Total Input: 0.80 BTC",
                  "varType": "Consumed Inputs",
                  "isUpdated": false
                },
                {
                  "label": "2. Output 1 (Recipient)",
                  "value": "Pay Bob: 0.60 BTC (Locked to Bob's address)",
                  "varType": "Sent Payment",
                  "isUpdated": false
                },
                {
                  "label": "3. Output 2 (Change)",
                  "value": "Return Alice: 0.199 BTC (Change UTXO back to Alice)",
                  "varType": "Change UTXO",
                  "isUpdated": true
                },
                {
                  "label": "4. Implicit Miner Fee",
                  "value": "0.80 - (0.60 + 0.199) = 0.001 BTC fee to miner",
                  "varType": "Miner Fee",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "utxo_fee_demo.js",
            "initialCode": "function calculateUtxoFee(inputTotalSats, outputTotalSats) {\n  const fee = inputTotalSats - outputTotalSats;\n  return {\n    inputTotalSats,\n    outputTotalSats,\n    implicitMinerFeeSats: fee,\n    isValid: fee >= 0\n  };\n}\n\nconsole.log(JSON.stringify(calculateUtxoFee(80000000, 79900000)));",
            "expectedOutput": "{\"inputTotalSats\":80000000,\"outputTotalSats\":79900000,\"implicitMinerFeeSats\":100000,\"isValid\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the implicit miner fee (in Satoshis) when inputs total 80,000,000 sats and outputs total 79,900,000 sats?",
          "expectedStringOutput": "100000",
          "acceptableAnswers": [
            "100000",
            "100,000",
            "implicitMinerFeeSats\":100000"
          ],
          "primaryMisconceptionId": "MC_CHAIN_UTXO_VS_ACCOUNT_BASED_STATE_MODELS",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_CHAIN_UTXO_VS_ACCOUNT_BASED_STATE_MODELS",
              "errorExplanation": "80,000,000 - 79,900,000 = 100,000 Satoshis implicit miner fee.",
              "recoveryPath": {
                "simplerExplanation": "Difference between inputs and outputs = 100,000 sats fee.",
                "guidedFixPrompt": "Type 100000"
              }
            }
          }
        }
      },
      {
        "id": "chain-d7-b2-ethereum-account-trie-model",
        "day": 7,
        "blockNumber": 2,
        "title": "Ethereum Account Model & Merkle Patricia Trie",
        "conceptBudget": {
          "primaryConcept": "Ethereum Account State Model",
          "supportingTerms": [
            "Externally Owned Account (EOA: Controlled by private key)",
            "Contract Account (Controlled by EVM code)",
            "Account State 4-Tuple (`nonce`, `balance`, `storageRoot`, `codeHash`)",
            "Modified Merkle Patricia Trie (MPT)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d7-b1-utxo-transaction-graph",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Ethereum Account State 4-Tuple",
              "boxes": [
                {
                  "label": "1. Nonce (uint64)",
                  "value": "Number of transactions sent (Prevents replay attacks)",
                  "varType": "Nonce",
                  "isUpdated": false
                },
                {
                  "label": "2. Balance (uint256)",
                  "value": "Ether balance denominated in Wei (10^18 Wei = 1 ETH)",
                  "varType": "Balance",
                  "isUpdated": false
                },
                {
                  "label": "3. StorageRoot (bytes32)",
                  "value": "256-bit hash of the MPT storing contract variable storage",
                  "varType": "Storage Trie",
                  "isUpdated": true
                },
                {
                  "label": "4. CodeHash (bytes32)",
                  "value": "Hash of EVM bytecode (Empty hash for standard EOA wallets)",
                  "varType": "Code Hash",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "account_state_demo.js",
            "initialCode": "function evaluateAccountType(codeHash) {\n  const emptyCodeHash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';\n  return (codeHash === emptyCodeHash || codeHash === '0x')\n    ? 'EXTERNALLY_OWNED_ACCOUNT_EOA (User Wallet)'\n    : 'SMART_CONTRACT_ACCOUNT (Contains EVM Bytecode)';\n}\n\nconsole.log(evaluateAccountType('0x'));\nconsole.log(evaluateAccountType('0x9a8f...code'));",
            "expectedOutput": "EXTERNALLY_OWNED_ACCOUNT_EOA (User Wallet)\nSMART_CONTRACT_ACCOUNT (Contains EVM Bytecode)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What account classification applies to an address with an empty codeHash (controlled by a private key)?",
          "expectedStringOutput": "EXTERNALLY_OWNED_ACCOUNT_EOA (User Wallet)",
          "acceptableAnswers": [
            "EXTERNALLY_OWNED_ACCOUNT_EOA (User Wallet)",
            "EXTERNALLY_OWNED_ACCOUNT_EOA",
            "EOA"
          ],
          "primaryMisconceptionId": "MC_CHAIN_UTXO_VS_ACCOUNT_BASED_STATE_MODELS",
          "diagnosisMap": {
            "CONTRACT": {
              "misconceptionId": "MC_CHAIN_UTXO_VS_ACCOUNT_BASED_STATE_MODELS",
              "errorExplanation": "Empty codeHash indicates an Externally Owned Account (EOA).",
              "recoveryPath": {
                "simplerExplanation": "Matches EXTERNALLY_OWNED_ACCOUNT_EOA (User Wallet).",
                "guidedFixPrompt": "Type EXTERNALLY_OWNED_ACCOUNT_EOA (User Wallet)"
              }
            }
          }
        }
      },
      {
        "id": "chain-d7-b3-replay-attacks-and-nonces",
        "day": 7,
        "blockNumber": 3,
        "title": "Replay Attack Prevention via Transaction Nonces",
        "conceptBudget": {
          "primaryConcept": "Transaction Nonce Ordering",
          "supportingTerms": [
            "Replay Attack (Malicious node resubmitting an identical valid signed transfer)",
            "Strict Monotonic Nonce ($N_{\\text{tx}} = N_{\\text{account}}$, incremented $+1$ on success)",
            "Pending Nonce Gaps (Transaction with nonce 5 cannot execute until nonces 0..4 have executed)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d7-b2-ethereum-account-trie-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nonce_replay_demo.js",
            "initialCode": "function evaluateTxNonce(accountNonce, txNonce) {\n  if (txNonce < accountNonce) return 'REJECTED: NONCE_TOO_LOW_REPLAY_ATTACK_DEFENSE';\n  if (txNonce > accountNonce) return 'QUEUED: NONCE_GAP_AWAITING_PRIOR_TRANSACTIONS';\n  return 'EXECUTED: NONCE_VALID_STATE_UPDATED';\n}\n\nconsole.log(evaluateTxNonce(5, 4)); // Past nonce -> Replay attempt\nconsole.log(evaluateTxNonce(5, 5)); // Current nonce -> Executes\nconsole.log(evaluateTxNonce(5, 7)); // Future nonce -> Queued",
            "expectedOutput": "REJECTED: NONCE_TOO_LOW_REPLAY_ATTACK_DEFENSE\nEXECUTED: NONCE_VALID_STATE_UPDATED\nQUEUED: NONCE_GAP_AWAITING_PRIOR_TRANSACTIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why will Ethereum nodes immediately reject a signed transaction with nonce 4 if the account's current nonce is 5?",
          "options": [
            "Because nonce 4 was already executed in a past transaction; accepting it again would allow an attacker to double-spend funds by replaying your old transaction",
            "Because Ethereum only accepts odd nonces",
            "To save memory"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_UTXO_VS_ACCOUNT_BASED_STATE_MODELS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_UTXO_VS_ACCOUNT_BASED_STATE_MODELS",
              "errorExplanation": "Strict monotonic nonces prevent historical replay attacks.",
              "recoveryPath": {
                "simplerExplanation": "Prevents replay of past transactions.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "EVM Architecture: Stack, Memory, Storage & Opcodes",
    "overviewMetaphor": "The EVM (Ethereum Virtual Machine) is a computational clockwork engine in a bank vault: the Stack is a tower of 1024 plates (Numbers are pushed and popped 256 bits at a time; very cheap: 3 gas); the Memory is a whiteboard erased after every math problem (Byte-addressable scratchpad; medium gas); the Storage is a vault of steel safety deposit boxes permanently welded into the blockchain (Each box holds 32 bytes; writing costs a massive 20,000 gas!).",
    "blocks": [
      {
        "id": "chain-d8-b1-evm-memory-regions-triad",
        "day": 8,
        "blockNumber": 1,
        "title": "The EVM Triad: Stack, Memory & Persistent Storage Slots",
        "conceptBudget": {
          "primaryConcept": "EVM Memory Regions",
          "supportingTerms": [
            "Stack (256-bit word stack, max depth 1024)",
            "Memory (Linear byte-addressable volatile memory, quadratic gas expansion)",
            "Storage (Persistent $2^{256} \\to 2^{256}$ key-value slots in world state)",
            "Calldata (Read-only immutable input byte array)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d7-b2-ethereum-account-trie-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "EVM Memory Regions Comparison",
              "boxes": [
                {
                  "label": "1. Stack (256-Bit Words)",
                  "value": "Lifetime: Instruction | Max Depth: 1024 words | Cost: ~3 gas (Ultra cheap)",
                  "varType": "Stack Words",
                  "isUpdated": false
                },
                {
                  "label": "2. Memory (Byte Array)",
                  "value": "Lifetime: Tx execution | Expands: Quadratically | Cost: Cheap -> High if huge",
                  "varType": "Volatile RAM",
                  "isUpdated": false
                },
                {
                  "label": "3. Calldata (Byte Array)",
                  "value": "Lifetime: Tx execution | Mutability: READ-ONLY | Cost: 4/16 gas per byte",
                  "varType": "Read-Only Inputs",
                  "isUpdated": false
                },
                {
                  "label": "4. Storage (Key-Value Slots)",
                  "value": "Lifetime: PERMANENT | Size: 2^256 slots | Cost: 20,000 gas (Most expensive!)",
                  "varType": "Permanent State",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "evm_regions_demo.js",
            "initialCode": "function evaluateStorageCost(region) {\n  if (region === 'STORAGE_WRITE') return 'SSTORE: 20,000 GAS (Permanent blockchain write)';\n  if (region === 'STACK_OP') return 'ADD/SUB: 3 GAS (Cheap in-register CPU op)';\n  return 'STANDARD';\n}\n\nconsole.log(evaluateStorageCost('STORAGE_WRITE'));\nconsole.log(evaluateStorageCost('STACK_OP'));",
            "expectedOutput": "SSTORE: 20,000 GAS (Permanent blockchain write)\nADD/SUB: 3 GAS (Cheap in-register CPU op)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the initial gas cost of an `SSTORE` opcode writing to a cold persistent storage slot in the EVM?",
          "expectedStringOutput": "20,000",
          "acceptableAnswers": [
            "20,000",
            "20000",
            "20000 gas",
            "20,000 GAS"
          ],
          "primaryMisconceptionId": "MC_CHAIN_EVM_ARCHITECTURE_OPCODES_STACK_MEMORY_STORAGE",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_CHAIN_EVM_ARCHITECTURE_OPCODES_STACK_MEMORY_STORAGE",
              "errorExplanation": "3 gas is for stack operations. Persistent SSTORE costs 20,000 gas.",
              "recoveryPath": {
                "simplerExplanation": "Persistent storage write = 20,000 gas.",
                "guidedFixPrompt": "Type 20,000"
              }
            }
          }
        }
      },
      {
        "id": "chain-d8-b2-evm-opcodes-stack-underflow",
        "day": 8,
        "blockNumber": 2,
        "title": "EVM Opcodes & The Stack Underflow/Overflow Boundary",
        "conceptBudget": {
          "primaryConcept": "EVM Opcode Execution",
          "supportingTerms": [
            "Stack Limit Invariant: Max 1024 words ($> 1024 \\implies$ `StackOverflow`)",
            "Stack Underflow ($< 2$ items on `ADD` $\\implies$ `StackUnderflow`)",
            "`PUSH1..32`, `POP`, `DUP1..16`, `SWAP1..16`",
            "Stack Too Deep Error (Solidity cannot reach beyond top 16 stack slots)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d8-b1-evm-memory-regions-triad",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "EVM Bytecode Execution Trace",
            "codeSnippet": "// Bytecode: 600a601401 (PUSH1 0x0a, PUSH1 0x14, ADD)\n// 1. PUSH1 0x0a -> Stack: [10]\n// 2. PUSH1 0x14 -> Stack: [10, 20]\n// 3. ADD        -> Pops 10 and 20 -> Pushes (10 + 20) = 30 -> Stack: [30]",
            "lineNotes": {
              "2": "Pushes 10 onto stack.",
              "4": "Pops top 2 items and pushes sum 30."
            }
          },
          {
            "type": "runnable_code",
            "filename": "stack_limit_demo.js",
            "initialCode": "function evaluateStackDepth(depth) {\n  if (depth > 1024) return 'ERROR: STACK_OVERFLOW_EXCEEDED_1024';\n  if (depth < 0) return 'ERROR: STACK_UNDERFLOW';\n  return 'STACK_STATE_NOMINAL';\n}\n\nconsole.log(evaluateStackDepth(1025));\nconsole.log(evaluateStackDepth(50));",
            "expectedOutput": "ERROR: STACK_OVERFLOW_EXCEEDED_1024\nSTACK_STATE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum allowed stack depth limit in the EVM before a `StackOverflow` occurs?",
          "expectedStringOutput": "1024",
          "acceptableAnswers": [
            "1024",
            "1024 words",
            "1024 items"
          ],
          "primaryMisconceptionId": "MC_CHAIN_EVM_ARCHITECTURE_OPCODES_STACK_MEMORY_STORAGE",
          "diagnosisMap": {
            "256": {
              "misconceptionId": "MC_CHAIN_EVM_ARCHITECTURE_OPCODES_STACK_MEMORY_STORAGE",
              "errorExplanation": "256 is the word size in bits. Max stack depth is 1024 words.",
              "recoveryPath": {
                "simplerExplanation": "Max stack depth is 1024.",
                "guidedFixPrompt": "Type 1024"
              }
            }
          }
        }
      },
      {
        "id": "chain-d8-b3-memory-quadratic-gas-expansion",
        "day": 8,
        "blockNumber": 3,
        "title": "Quadratic Gas Cost Expansion in Volatile Memory",
        "conceptBudget": {
          "primaryConcept": "Memory Gas Expansion Formula",
          "supportingTerms": [
            "Linear cost: $3 \\times a$",
            "Quadratic cost: $\\frac{a^2}{512}$ (where $a$ is words allocated)",
            "Preventing memory exhaustion denial-of-service attacks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d8-b2-evm-opcodes-stack-underflow",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "memory_gas_demo.js",
            "initialCode": "function calculateMemoryGas(words) {\n  const linear = 3 * words;\n  const quadratic = Math.floor((words * words) / 512);\n  const totalGas = linear + quadratic;\n  return {\n    wordsAllocated: words,\n    linearGas: linear,\n    quadraticGas: quadratic,\n    totalGasCost: totalGas\n  };\n}\n\nconsole.log(JSON.stringify(calculateMemoryGas(32)));   // Small memory: 1 KB\nconsole.log(JSON.stringify(calculateMemoryGas(1024))); // Large memory: 32 KB",
            "expectedOutput": "{\"wordsAllocated\":32,\"linearGas\":96,\"quadraticGas\":2,\"totalGasCost\":98}\n{\"wordsAllocated\":1024,\"linearGas\":3072,\"quadraticGas\":2048,\"totalGasCost\":5120}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does the EVM apply a quadratic gas cost formula ($words^2 / 512$) when allocating large amounts of volatile memory?",
          "options": [
            "To prevent Denial-of-Service (DoS) attacks where a malicious transaction allocates gigabytes of RAM on every blockchain validator node for free",
            "Because RAM is slower than SSDs",
            "To delete stack words"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_EVM_ARCHITECTURE_OPCODES_STACK_MEMORY_STORAGE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_EVM_ARCHITECTURE_OPCODES_STACK_MEMORY_STORAGE",
              "errorExplanation": "Quadratic memory gas prevents RAM exhaustion attacks on validator nodes.",
              "recoveryPath": {
                "simplerExplanation": "Prevents RAM exhaustion DoS attacks on network nodes.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Solidity Data Types, Structs & Enums",
    "overviewMetaphor": "Solidity Data Types are laser-cut steel molds: unlike flexible JavaScript numbers where any floating-point number fits, Solidity uses fixed-size integers (`uint8` from 0 to 255; `uint256` for colossal numbers); an `address` is a 20-byte digital identity badge; a `struct` is a pre-printed passport booklet binding a user's name, balance, and ID into one organized record.",
    "blocks": [
      {
        "id": "chain-d9-b1-value-types-and-overflows",
        "day": 9,
        "blockNumber": 1,
        "title": "Solidity Value Types: `uint`, `int`, `address`, `bytes32` & Overflow Checks",
        "conceptBudget": {
          "primaryConcept": "Solidity Primitive Types",
          "supportingTerms": [
            "`uint8`..`uint256` (Unsigned integers in 8-bit increments)",
            "`address` (20 bytes: EOA or contract)",
            "`address payable` (Address equipped with `.transfer()` and `.send()`)",
            "`bytes32` (Fixed-size byte array for cryptographic hashes)",
            "Solidity 0.8+ Built-in Overflow/Underflow Reverts"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d8-b1-evm-memory-regions-triad",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Pre-0.8 Integer Overflow vs Modern Auto-Revert Diff",
              "brokenCode": "// ❌ SOLIDITY < 0.8 SILENT OVERFLOW HAZARD (BatchOverflow Exploit):\nuint8 balance = 255;\nbalance += 1; // Silently wraps to 0 without error -> Bank account wiped!",
              "fixedCode": "// ✅ SOLIDITY 0.8+ BUILT-IN OVERFLOW REVERT:\nuint8 balance = 255;\nbalance += 1; // Automatically reverts transaction with Panic(0x11) arithmetic overflow!",
              "errorLine": 2,
              "errorReason": "Pre-0.8 arithmetic lacked automated boundary checks, leading to catastrophic overflow exploits.",
              "fixExplanation": "Solidity 0.8+ automatically reverts arithmetic overflows without requiring SafeMath."
            }
          },
          {
            "type": "runnable_code",
            "filename": "value_types_demo.js",
            "initialCode": "function evaluateSolidityInt(val, type = 'uint8') {\n  if (val > 255 && type === 'uint8') {\n    return 'PANIC(0x11): ARITHMETIC_OVERFLOW_TRANSACTION_REVERTED';\n  }\n  return `VALID_${type.toUpperCase()}_VALUE: ${val}`;\n}\n\nconsole.log(evaluateSolidityInt(256, 'uint8'));\nconsole.log(evaluateSolidityInt(200, 'uint8'));",
            "expectedOutput": "PANIC(0x11): ARITHMETIC_OVERFLOW_TRANSACTION_REVERTED\nVALID_UINT8_VALUE: 200",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What happens in Solidity 0.8+ when `uint8` with value 255 has 1 added to it?",
          "expectedStringOutput": "PANIC(0x11): ARITHMETIC_OVERFLOW_TRANSACTION_REVERTED",
          "acceptableAnswers": [
            "PANIC(0x11): ARITHMETIC_OVERFLOW_TRANSACTION_REVERTED",
            "PANIC(0x11)",
            "Arithmetic overflow revert"
          ],
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
              "errorExplanation": "In Solidity 0.8+, overflows do not wrap to 0; they revert with Panic(0x11).",
              "recoveryPath": {
                "simplerExplanation": "Solidity 0.8+ reverts on overflow: PANIC(0x11): ARITHMETIC_OVERFLOW_TRANSACTION_REVERTED.",
                "guidedFixPrompt": "Type PANIC(0x11): ARITHMETIC_OVERFLOW_TRANSACTION_REVERTED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d9-b2-structs-and-custom-data-types",
        "day": 9,
        "blockNumber": 2,
        "title": "Solidity Custom Structs & Enums",
        "conceptBudget": {
          "primaryConcept": "Structs & Enums Definition",
          "supportingTerms": [
            "`struct` definition (Grouping diverse types into a composite record)",
            "`enum` (Type-safe finite state machine labels: `enum Status { Pending, Approved, Rejected }`)",
            "Passing Structs in Memory vs Calldata"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d9-b1-value-types-and-overflows",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Solidity Struct & Enum Definition",
            "codeSnippet": "enum ProposalStatus { PENDING, ACTIVE, DEFEATED, SUCCEEDED, EXECUTED }\n\nstruct Proposal {\n  uint256 id;\n  address proposer;\n  uint256 votesFor;\n  uint256 votesAgainst;\n  ProposalStatus status;\n}",
            "lineNotes": {
              "1": "Enum limits state to 5 discrete values (represented internally as uint8 0..4).",
              "8": "Composite struct bundling proposal data."
            }
          },
          {
            "type": "runnable_code",
            "filename": "struct_enum_demo.js",
            "initialCode": "function getEnumLabel(index) {\n  const statuses = ['PENDING', 'ACTIVE', 'DEFEATED', 'SUCCEEDED', 'EXECUTED'];\n  return statuses[index] || 'UNKNOWN';\n}\n\nconsole.log('Enum Index 3 maps to:', getEnumLabel(3));",
            "expectedOutput": "Enum Index 3 maps to: SUCCEEDED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What text label corresponds to Enum index 3 in `enum ProposalStatus { PENDING, ACTIVE, DEFEATED, SUCCEEDED, EXECUTED }`?",
          "expectedStringOutput": "SUCCEEDED",
          "acceptableAnswers": [
            "SUCCEEDED",
            "Status: SUCCEEDED"
          ],
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
          "diagnosisMap": {
            "DEFEATED": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
              "errorExplanation": "0=PENDING, 1=ACTIVE, 2=DEFEATED, 3=SUCCEEDED.",
              "recoveryPath": {
                "simplerExplanation": "Index 3 is SUCCEEDED.",
                "guidedFixPrompt": "Type SUCCEEDED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d9-b3-explicit-type-conversions",
        "day": 9,
        "blockNumber": 3,
        "title": "Explicit Type Casting & Address Conversions",
        "conceptBudget": {
          "primaryConcept": "Type Conversions & Casting",
          "supportingTerms": [
            "Explicit Casting (`uint256(myUint128)`, `payable(msg.sender)`)",
            "Address to `uint160` (160 bits = 20 bytes)",
            "Dangerous Downcasting Hazard (Truncating `uint256` into `uint8` drops higher bits)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d9-b2-structs-and-custom-data-types",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "casting_demo.js",
            "initialCode": "function evaluateDowncasting(val256) {\n  const truncatedUint8 = val256 & 0xFF;\n  return {\n    originalValue: val256,\n    downcastedUint8: truncatedUint8,\n    dataLossOccurred: val256 > 255\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDowncasting(300))); // 300 % 256 = 44",
            "expectedOutput": "{\"originalValue\":300,\"downcastedUint8\":44,\"dataLossOccurred\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value is produced when downcasting integer 300 into a `uint8` ($300 \\& 0xFF$)?",
          "expectedStringOutput": "44",
          "acceptableAnswers": [
            "44",
            "downcastedUint8\":44"
          ],
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
          "diagnosisMap": {
            "300": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
              "errorExplanation": "300 does not fit in 8 bits; high bits are dropped, leaving 300 % 256 = 44.",
              "recoveryPath": {
                "simplerExplanation": "300 mod 256 = 44.",
                "guidedFixPrompt": "Type 44"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Solidity Mappings, Arrays & Memory vs Storage",
    "overviewMetaphor": "Mappings vs Arrays is an Infinite Address Book vs a Bulleted List: a `mapping(address => uint256)` is an infinite hash table of $2^{256}$ keys (Looking up any user's balance is instant $O(1)$; but you cannot count how many users exist or iterate over all keys!); a dynamic `uint256[]` array is a numbered list (You can count `.length` and loop with `for`, but expanding it costs expensive gas per element).",
    "blocks": [
      {
        "id": "chain-d10-b1-mappings-hash-lookups",
        "day": 10,
        "blockNumber": 1,
        "title": "Solidity Hash Mappings (`mapping(keyType => valueType)`)",
        "conceptBudget": {
          "primaryConcept": "Solidity Mappings Architecture",
          "supportingTerms": [
            "$O(1)$ Hash Table Lookup (`keccak256(key + slot)`)",
            "No Length Property (Cannot do `myMap.length`)",
            "Non-Iterable by default",
            "Default Zero Value for all uninitialized keys"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d9-b1-value-types-and-overflows",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mapping Storage Slot Keccak Location",
              "boxes": [
                {
                  "label": "Declared Mapping Slot",
                  "value": "Declared at slot p (e.g. slot 0) -> Contains zero data itself!",
                  "varType": "Base Slot",
                  "isUpdated": false
                },
                {
                  "label": "Data Storage Location",
                  "value": "keccak256(h(k) . p) -> Maps anywhere in 2^256 address space (Zero collisions!)",
                  "varType": "Keccak Mapped",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mapping_lookup_demo.js",
            "initialCode": "function getMappingValue(store, key) {\n  return store[key] !== undefined ? store[key] : 0; // Default zero\n}\n\nconst balances = { '0xAlice': 100 };\nconsole.log('Alice balance:', getMappingValue(balances, '0xAlice'));\nconsole.log('Unknown balance:', getMappingValue(balances, '0xBob'));",
            "expectedOutput": "Alice balance: 100\nUnknown balance: 0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value is returned in Solidity when querying an uninitialized key in a `mapping(address => uint256)`?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "zero",
            "Default zero"
          ],
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
          "diagnosisMap": {
            "null": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
              "errorExplanation": "Solidity does not have null or undefined; uninitialized mappings return 0.",
              "recoveryPath": {
                "simplerExplanation": "Uninitialized mapping keys return 0.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "chain-d10-b2-storage-vs-memory-pointers",
        "day": 10,
        "blockNumber": 2,
        "title": "Memory vs Storage References: Pass-by-Reference Hazards",
        "conceptBudget": {
          "primaryConcept": "Memory vs Storage Data Locations",
          "supportingTerms": [
            "`storage` pointer (Direct mutable pointer to persistent blockchain state)",
            "`memory` pointer (Temporary independent copy in RAM; changes do NOT persist to blockchain!)",
            "Accidental storage overwrite hazard"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d10-b1-mappings-hash-lookups",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Memory Copy Bug vs Storage Pointer Fix Diff",
              "brokenCode": "// ❌ ACCIDENTAL MEMORY COPY BUG (State changes NOT saved!):\nUser memory user = users[msg.sender];\nuser.balance += 100; // Modifies temporary RAM copy only! Blockchain state remains unchanged!",
              "fixedCode": "// ✅ 100% PERSISTENT STORAGE POINTER:\nUser storage user = users[msg.sender];\nuser.balance += 100; // Directly updates persistent blockchain storage slot!",
              "errorLine": 2,
              "errorReason": "Using memory creates a disconnected copy that discards modifications when function returns.",
              "fixExplanation": "Use storage keyword to mutate persistent contract state."
            }
          },
          {
            "type": "runnable_code",
            "filename": "storage_pointer_demo.js",
            "initialCode": "function evaluatePointerType(isStoragePointer) {\n  return isStoragePointer\n    ? 'STORAGE_MUTABLE: MODIFICATIONS_PERSIST_ON_CHAIN'\n    : 'MEMORY_COPY_ONLY: MODIFICATIONS_DISCARDED_ON_RETURN';\n}\n\nconsole.log(evaluatePointerType(true));\nconsole.log(evaluatePointerType(false));",
            "expectedOutput": "STORAGE_MUTABLE: MODIFICATIONS_PERSIST_ON_CHAIN\nMEMORY_COPY_ONLY: MODIFICATIONS_DISCARDED_ON_RETURN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if a developer declares a local struct as `User memory u = users[msg.sender]` and modifies `u.balance`?",
          "options": [
            "The modification affects only a temporary copy in volatile RAM; when the transaction function finishes, the changes are lost and the persistent blockchain balance is NEVER updated",
            "The blockchain crashes",
            "Gas is refunded completely"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
              "errorExplanation": "Memory variables are temporary copies that do not mutate persistent storage.",
              "recoveryPath": {
                "simplerExplanation": "Memory copies discard changes when the function returns.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d10-b3-dynamic-arrays-gas-pitfalls",
        "day": 10,
        "blockNumber": 3,
        "title": "Dynamic Arrays (`.push()`, `.pop()`) & Gas DoS Pitfalls",
        "conceptBudget": {
          "primaryConcept": "Dynamic Array Gas Pitfalls",
          "supportingTerms": [
            "Dynamic Array (`uint256[]`)",
            "Unbounded Loop DoS Hazard (Looping over a 10,000 element array hits block gas limit and permanently freezes contract!)",
            "Withdrawal Pattern (Pull over Push)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d10-b2-storage-vs-memory-pointers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "array_dos_demo.js",
            "initialCode": "function evaluateArrayLoopGas(elementsCount) {\n  const gasPerItem = 2100;\n  const totalGas = elementsCount * gasPerItem;\n  const blockGasLimit = 30000000; // 30M gas limit\n  const isFrozen = totalGas > blockGasLimit;\n  return {\n    elementsCount,\n    estimatedGas: totalGas,\n    status: isFrozen ? 'DOS_CONTRACT_FROZEN_EXCEEDS_BLOCK_GAS_LIMIT' : 'LOOP_SAFE_WITHIN_GAS_LIMIT'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateArrayLoopGas(20000))); // 42M gas > 30M limit!",
            "expectedOutput": "{\"elementsCount\":20000,\"estimatedGas\":42000000,\"status\":\"DOS_CONTRACT_FROZEN_EXCEEDS_BLOCK_GAS_LIMIT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status occurs when iterating an array of 20,000 storage items requiring 42,000,000 gas (exceeding the 30M block gas limit)?",
          "expectedStringOutput": "DOS_CONTRACT_FROZEN_EXCEEDS_BLOCK_GAS_LIMIT",
          "acceptableAnswers": [
            "DOS_CONTRACT_FROZEN_EXCEEDS_BLOCK_GAS_LIMIT",
            "status\":\"DOS_CONTRACT_FROZEN_EXCEEDS_BLOCK_GAS_LIMIT\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
          "diagnosisMap": {
            "SAFE": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_TYPES_MAPPINGS_ARRAYS_STRUCTS",
              "errorExplanation": "42M gas exceeds 30M block limit, triggering DOS_CONTRACT_FROZEN_EXCEEDS_BLOCK_GAS_LIMIT.",
              "recoveryPath": {
                "simplerExplanation": "Exceeds block gas limit -> contract freezes.",
                "guidedFixPrompt": "Type DOS_CONTRACT_FROZEN_EXCEEDS_BLOCK_GAS_LIMIT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Functions, Modifiers, View/Pure & Fallback/Receive",
    "overviewMetaphor": "Solidity Function Security is a VIP nightclub entrance: Function Visibility (`public`, `external`, `internal`, `private`) determines which doors are unlocked (External only from outside; Private only for the bouncer); Function Modifiers (`onlyOwner`) are security guards checking VIP badges before allowing anyone to step onto the dance floor; `receive()` and `fallback()` are mail slots in the front door for accepting Ether donations even when no function name is specified.",
    "blocks": [
      {
        "id": "chain-d11-b1-function-visibility-and-mutability",
        "day": 11,
        "blockNumber": 1,
        "title": "Function Visibility & State Mutability (`view`, `pure`, `payable`)",
        "conceptBudget": {
          "primaryConcept": "Solidity Function Specifiers",
          "supportingTerms": [
            "Visibility (`external`, `public`, `internal`, `private`)",
            "`view` (Reads storage, zero gas when called off-chain via `eth_call`)",
            "`pure` (Does not read nor write storage: deterministic math)",
            "`payable` (Allows function to receive Ether alongside call data)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d10-b1-mappings-hash-lookups",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "State Mutability Restrictions",
              "boxes": [
                {
                  "label": "1. pure Functions",
                  "value": "Reads Storage: NO | Writes Storage: NO | Receives Ether: NO (Pure math)",
                  "varType": "Pure Math",
                  "isUpdated": false
                },
                {
                  "label": "2. view Functions",
                  "value": "Reads Storage: YES | Writes Storage: NO | Free off-chain calls (eth_call)",
                  "varType": "Read-Only",
                  "isUpdated": false
                },
                {
                  "label": "3. Non-payable State Changing",
                  "value": "Reads Storage: YES | Writes Storage: YES | Receives Ether: REVERTS",
                  "varType": "State Write",
                  "isUpdated": false
                },
                {
                  "label": "4. payable Functions",
                  "value": "Reads: YES | Writes: YES | Receives Ether: YES (Accesses msg.value)",
                  "varType": "Ether Receiver",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mutability_demo.js",
            "initialCode": "function evaluateCallGas(mutability, isOffChainCall) {\n  if (isOffChainCall && (mutability === 'view' || mutability === 'pure')) {\n    return 'ZERO_GAS_FREE_OFFCHAIN_RPC_CALL';\n  }\n  return 'GAS_REQUIRED_TRANSACTION_BROADCAST';\n}\n\nconsole.log(evaluateCallGas('view', true));\nconsole.log(evaluateCallGas('payable', true));",
            "expectedOutput": "ZERO_GAS_FREE_OFFCHAIN_RPC_CALL\nGAS_REQUIRED_TRANSACTION_BROADCAST",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the gas cost when reading a `view` function off-chain via an RPC `eth_call` query?",
          "expectedStringOutput": "ZERO_GAS_FREE_OFFCHAIN_RPC_CALL",
          "acceptableAnswers": [
            "ZERO_GAS_FREE_OFFCHAIN_RPC_CALL",
            "ZERO_GAS",
            "Free",
            "0 gas"
          ],
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_FUNCTIONS_VIEW_PURE_PAYABLE_FALLBACK",
          "diagnosisMap": {
            "21000": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_FUNCTIONS_VIEW_PURE_PAYABLE_FALLBACK",
              "errorExplanation": "Off-chain view calls are evaluated locally by the node for free (ZERO_GAS_FREE_OFFCHAIN_RPC_CALL).",
              "recoveryPath": {
                "simplerExplanation": "Off-chain view calls cost zero gas.",
                "guidedFixPrompt": "Type ZERO_GAS_FREE_OFFCHAIN_RPC_CALL"
              }
            }
          }
        }
      },
      {
        "id": "chain-d11-b2-custom-modifiers-and-guards",
        "day": 11,
        "blockNumber": 2,
        "title": "Custom Function Modifiers & The Merge Point (`_;`)",
        "conceptBudget": {
          "primaryConcept": "Solidity Function Modifiers",
          "supportingTerms": [
            "`modifier onlyOwner()`",
            "The Underscore Merge Point (`_;` executes wrapped function body)",
            "`require(condition, error)` assertion checks",
            "Pre-conditions vs Post-conditions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d11-b1-function-visibility-and-mutability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Custom Modifier Structure",
            "codeSnippet": "modifier onlyOwner() {\n  require(msg.sender == owner, 'CALLER_NOT_OWNER');\n  _;\n}\n\nfunction mint(address to, uint256 amount) external onlyOwner {\n  balances[to] += amount; // Executes ONLY if require passes!\n}",
            "lineNotes": {
              "2": "Asserts authorization condition before entering function.",
              "3": "_; represents the body of the function being modified."
            }
          },
          {
            "type": "runnable_code",
            "filename": "modifier_demo.js",
            "initialCode": "function executeWithGuard(caller, owner, fn) {\n  if (caller !== owner) return 'REVERT: CALLER_NOT_OWNER';\n  return fn();\n}\n\nconsole.log(executeWithGuard('0xAlice', '0xAlice', () => 'MINT_SUCCESS'));\nconsole.log(executeWithGuard('0xAttacker', '0xAlice', () => 'MINT_SUCCESS'));",
            "expectedOutput": "MINT_SUCCESS\nREVERT: CALLER_NOT_OWNER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the purpose of the semicolon-underscore symbol (`_;`) in a Solidity modifier definition?",
          "options": [
            "It indicates the exact execution point where the modified function's body code is injected and executed",
            "It ends the smart contract file",
            "It refunds leftover gas"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_FUNCTIONS_VIEW_PURE_PAYABLE_FALLBACK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_FUNCTIONS_VIEW_PURE_PAYABLE_FALLBACK",
              "errorExplanation": "_; marks the insertion point for the target function body.",
              "recoveryPath": {
                "simplerExplanation": "Specifies where the function body runs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d11-b3-receive-and-fallback-handlers",
        "day": 11,
        "blockNumber": 3,
        "title": "Ether Handlers: `receive() external payable` vs `fallback()`",
        "conceptBudget": {
          "primaryConcept": "Receive vs Fallback Functions",
          "supportingTerms": [
            "`receive() external payable` (Invoked on plain Ether transfers with empty `msg.data`)",
            "`fallback() external payable` (Invoked when function signature does NOT match any known contract function)",
            "2300 Gas Stipend on `.transfer()` / `.send()`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d11-b2-custom-modifiers-and-guards",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Ether Reception Routing Tree",
              "nodes": [
                {
                  "id": "1",
                  "label": "Contract receives transaction containing Ether",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Is msg.data empty? -> YES -> Does receive() exist? -> Invoke receive()",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Is msg.data empty? -> NO or receive() missing -> Invoke fallback()",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Neither exists and data present? -> Transaction REVERTS!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ether_routing_demo.js",
            "initialCode": "function routeIncomingEther(msgDataEmpty, hasReceive) {\n  if (msgDataEmpty && hasReceive) return 'ROUTED_TO_RECEIVE_FUNCTION';\n  return 'ROUTED_TO_FALLBACK_FUNCTION';\n}\n\nconsole.log(routeIncomingEther(true, true));\nconsole.log(routeIncomingEther(false, true));",
            "expectedOutput": "ROUTED_TO_RECEIVE_FUNCTION\nROUTED_TO_FALLBACK_FUNCTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which function is invoked when a contract receives plain Ether with empty `msg.data` and a `receive()` function is defined?",
          "expectedStringOutput": "ROUTED_TO_RECEIVE_FUNCTION",
          "acceptableAnswers": [
            "ROUTED_TO_RECEIVE_FUNCTION",
            "receive()",
            "receive",
            "receive function"
          ],
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_FUNCTIONS_VIEW_PURE_PAYABLE_FALLBACK",
          "diagnosisMap": {
            "fallback": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_FUNCTIONS_VIEW_PURE_PAYABLE_FALLBACK",
              "errorExplanation": "Empty msg.data routes directly to receive().",
              "recoveryPath": {
                "simplerExplanation": "Empty data triggers receive().",
                "guidedFixPrompt": "Type ROUTED_TO_RECEIVE_FUNCTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Storage Slot Packing & Gas Optimization",
    "overviewMetaphor": "Storage Slot Packing is packing a shipping container efficiently: each persistent storage slot in the EVM holds exactly 32 bytes (256 bits); if you declare a 20-byte `address` on Line 1 and a 32-byte `uint256` on Line 2, they cannot fit together (2 slots used = 40,000 gas!); but if you place an `address` (20B), a `uint64` (8B), and a `uint32` (4B) consecutively, they pack perfectly into one single 32-byte slot, saving 20,000 gas ($20+ in real cash per transaction).",
    "blocks": [
      {
        "id": "chain-d12-b1-32-byte-slot-alignment",
        "day": 12,
        "blockNumber": 1,
        "title": "The 32-Byte Storage Slot Rule & Consecutive Variable Packing",
        "conceptBudget": {
          "primaryConcept": "Storage Slot Packing Mechanics",
          "supportingTerms": [
            "Slot Size: Exactly 32 bytes (256 bits)",
            "Byte sizes: `address` (20B), `bool` (1B), `uint8` (1B), `uint64` (8B), `uint128` (16B), `uint256` (32B)",
            "Order-dependent packing: Consecutive variables summing $\\le 32$ bytes share 1 slot",
            "Unpackable `uint256` always forces a new slot boundary"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d8-b1-evm-memory-regions-triad",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Unpacked 3-Slot Layout vs Packed 1-Slot Layout Diff",
              "brokenCode": "// ❌ UNPACKED (Takes 3 FULL 32-Byte Storage Slots = 60,000 Gas!):\nuint128 a; // Slot 0: 16 bytes (16 bytes wasted)\nuint256 b; // Slot 1: 32 bytes\nuint128 c; // Slot 2: 16 bytes (16 bytes wasted)",
              "fixedCode": "// ✅ 100% PACKED (Takes ONLY 2 Storage Slots = 40,000 Gas!):\nuint128 a; // Slot 0: Bytes 0..15\nuint128 c; // Slot 0: Bytes 16..31 (PACKED TOGETHER IN SLOT 0!)\nuint256 b; // Slot 1: Bytes 0..31 (32 bytes)",
              "errorLine": 2,
              "errorReason": "Placing a 32-byte uint256 between smaller types breaks consecutive packing, wasting storage slots.",
              "fixExplanation": "Group smaller types together to fit within 32-byte boundaries."
            }
          },
          {
            "type": "runnable_code",
            "filename": "slot_packing_demo.js",
            "initialCode": "function evaluatePacking(layout) {\n  let slots = 1, used = 0;\n  for (const b of layout) {\n    if (used + b > 32) { slots++; used = b; } else { used += b; }\n  }\n  return { totalSlots: slots, totalGas: slots * 20000 };\n}\n\nconsole.log('Unpacked [16, 32, 16]:', JSON.stringify(evaluatePacking([16, 32, 16])));\nconsole.log('Packed [16, 16, 32]:', JSON.stringify(evaluatePacking([16, 16, 32])));",
            "expectedOutput": "Unpacked [16, 32, 16]: {\"totalSlots\":3,\"totalGas\":60000}\nPacked [16, 16, 32]: {\"totalSlots\":2,\"totalGas\":40000}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many 32-byte storage slots are used by the packed variable list `[uint128 (16B), uint128 (16B), uint256 (32B)]`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 slots",
            "totalSlots\":2"
          ],
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_STORAGE_SLOTS_PACKING_GAS",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_STORAGE_SLOTS_PACKING_GAS",
              "errorExplanation": "The two uint128s pack together into Slot 0 (16+16=32B), so only 2 slots are needed.",
              "recoveryPath": {
                "simplerExplanation": "16 + 16 = 32B (Slot 0), uint256 = Slot 1 -> 2 slots.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "chain-d12-b2-custom-errors-vs-strings",
        "day": 12,
        "blockNumber": 2,
        "title": "Gas Optimization: Custom Errors (`error CustomError()`) vs Error Strings",
        "conceptBudget": {
          "primaryConcept": "Custom Errors vs Revert Strings",
          "supportingTerms": [
            "`revert('Caller is not authorized to mint tokens!')` (Stores large UTF-8 string, costs huge deployment and execution gas)",
            "`error Unauthorized()` (Stores 4-byte selector: `0x82b42900`)",
            "Saves ~100-300 gas per revert and reduces contract deployment bytecode size"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d12-b1-32-byte-slot-alignment",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Custom Error Definition & Usage",
            "codeSnippet": "error InsufficientBalance(uint256 available, uint256 required);\n\nfunction withdraw(uint256 amount) external {\n  if (balances[msg.sender] < amount) {\n    revert InsufficientBalance(balances[msg.sender], amount); // 4-byte selector + params!\n  }\n}",
            "lineNotes": {
              "1": "Custom error declaration.",
              "5": "Reverts with 4-byte selector instead of expensive string."
            }
          },
          {
            "type": "runnable_code",
            "filename": "custom_error_demo.js",
            "initialCode": "function evaluateErrorGas(isCustomError) {\n  return isCustomError\n    ? { errorType: 'CUSTOM_ERROR', byteSize: 4, gasCost: 'LOW_OPTIMAL' }\n    : { errorType: 'STRING_REVERT', byteSize: 64, gasCost: 'EXPENSIVE_BYTECODE_BLOAT' };\n}\n\nconsole.log(JSON.stringify(evaluateErrorGas(true)));\nconsole.log(JSON.stringify(evaluateErrorGas(false)));",
            "expectedOutput": "{\"errorType\":\"CUSTOM_ERROR\",\"byteSize\":4,\"gasCost\":\"LOW_OPTIMAL\"}\n{\"errorType\":\"STRING_REVERT\",\"byteSize\":64,\"gasCost\":\"EXPENSIVE_BYTECODE_BLOAT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why are custom errors (`error MyError()`) preferred over `require(condition, 'Long error message string')` in modern Solidity?",
          "options": [
            "Custom errors compile down to a concise 4-byte function selector, reducing both contract deployment size and execution gas costs compared to encoding long string literals into bytecode",
            "Because strings are deprecated in JavaScript",
            "To make contracts unreadable"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_STORAGE_SLOTS_PACKING_GAS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_STORAGE_SLOTS_PACKING_GAS",
              "errorExplanation": "Custom errors encode into 4-byte selectors, saving deployment and execution gas.",
              "recoveryPath": {
                "simplerExplanation": "4-byte selectors save deployment and execution gas.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d12-b3-immutable-and-constant-variables",
        "day": 12,
        "blockNumber": 3,
        "title": "`constant` & `immutable` Variables: Zero Storage Gas",
        "conceptBudget": {
          "primaryConcept": "Constant & Immutable Optimization",
          "supportingTerms": [
            "`constant` (Compiled directly into bytecode at compile-time: 0 storage gas)",
            "`immutable` (Assigned once in `constructor`, baked into runtime bytecode: 0 storage gas)",
            "Eliminating `SLOAD` (2,100 gas) on every contract read"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d12-b2-custom-errors-vs-strings",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "immutable_demo.js",
            "initialCode": "function evaluateVariableStorage(modifier) {\n  if (modifier === 'constant' || modifier === 'immutable') {\n    return 'BAKED_INTO_BYTECODE: ZERO_STORAGE_SLOTS_USED (0 Gas SLOAD)';\n  }\n  return 'STORAGE_SLOT_ALLOCATED (Costs 2100 gas SLOAD)';\n}\n\nconsole.log(evaluateVariableStorage('immutable'));\nconsole.log(evaluateVariableStorage('standard_storage'));",
            "expectedOutput": "BAKED_INTO_BYTECODE: ZERO_STORAGE_SLOTS_USED (0 Gas SLOAD)\nSTORAGE_SLOT_ALLOCATED (Costs 2100 gas SLOAD)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What storage allocation status applies to an `immutable` variable assigned in the constructor?",
          "expectedStringOutput": "BAKED_INTO_BYTECODE: ZERO_STORAGE_SLOTS_USED (0 Gas SLOAD)",
          "acceptableAnswers": [
            "BAKED_INTO_BYTECODE: ZERO_STORAGE_SLOTS_USED (0 Gas SLOAD)",
            "BAKED_INTO_BYTECODE",
            "Zero storage slots"
          ],
          "primaryMisconceptionId": "MC_CHAIN_SOLIDITY_STORAGE_SLOTS_PACKING_GAS",
          "diagnosisMap": {
            "SLOT": {
              "misconceptionId": "MC_CHAIN_SOLIDITY_STORAGE_SLOTS_PACKING_GAS",
              "errorExplanation": "Immutable variables are baked directly into runtime bytecode and consume 0 storage slots.",
              "recoveryPath": {
                "simplerExplanation": "Baked into bytecode with 0 storage slots.",
                "guidedFixPrompt": "Type BAKED_INTO_BYTECODE: ZERO_STORAGE_SLOTS_USED (0 Gas SLOAD)"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "ERC-20 Fungible Token Standard",
    "overviewMetaphor": "The ERC-20 Token Standard is an international currency exchange agreement: every US Dollar bill is identical and interchangeable (Fungible); the ERC-20 standard establishes 6 universal interface rules (`totalSupply`, `balanceOf`, `transfer`, `allowance`, `approve`, `transferFrom`); when a Uniswap DEX or MetaMask wallet connects to your token contract, it immediately knows how to display balances and execute transfers without custom code.",
    "blocks": [
      {
        "id": "chain-d13-b1-erc20-interface-methods",
        "day": 13,
        "blockNumber": 1,
        "title": "The 6 Core ERC-20 Methods & 2 Events",
        "conceptBudget": {
          "primaryConcept": "ERC-20 Interface Standard",
          "supportingTerms": [
            "Core Getters: `totalSupply()`, `balanceOf(address)`",
            "Direct Transfer: `transfer(address to, uint256 amount)`",
            "Delegated Transfer: `allowance(owner, spender)`, `approve(spender, amount)`, `transferFrom(from, to, amount)`",
            "Events: `Transfer(from, to, value)`, `Approval(owner, spender, value)`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d10-b1-mappings-hash-lookups",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "IERC20 Interface Specification (EIP-20)",
            "codeSnippet": "interface IERC20 {\n  function totalSupply() external view returns (uint256);\n  function balanceOf(address account) external view returns (uint256);\n  function transfer(address to, uint256 amount) external returns (bool);\n  function allowance(address owner, address spender) external view returns (uint256);\n  function approve(address spender, uint256 amount) external returns (bool);\n  function transferFrom(address from, address to, uint256 amount) external returns (bool);\n\n  event Transfer(address indexed from, address indexed to, uint256 value);\n  event Approval(address indexed owner, address indexed spender, uint256 value);\n}",
            "lineNotes": {
              "4": "Direct peer-to-peer transfer.",
              "7": "Allows smart contract DEXes to spend tokens on behalf of approved users."
            }
          },
          {
            "type": "runnable_code",
            "filename": "erc20_methods_demo.js",
            "initialCode": "function verifyErc20Compliance(methodsList) {\n  const required = ['totalSupply', 'balanceOf', 'transfer', 'allowance', 'approve', 'transferFrom'];\n  const isCompliant = required.every(m => methodsList.includes(m));\n  return {\n    methodsChecked: methodsList.length,\n    isErc20StandardCompliant: isCompliant,\n    status: isCompliant ? 'ERC20_COMPLIANT_TOKEN_CERTIFIED' : 'NON_COMPLIANT_TOKEN'\n  };\n}\n\nconsole.log(JSON.stringify(verifyErc20Compliance(['totalSupply', 'balanceOf', 'transfer', 'allowance', 'approve', 'transferFrom'])));",
            "expectedOutput": "{\"methodsChecked\":6,\"isErc20StandardCompliant\":true,\"status\":\"ERC20_COMPLIANT_TOKEN_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms full compliance with the 6 core methods of the ERC-20 standard?",
          "expectedStringOutput": "ERC20_COMPLIANT_TOKEN_CERTIFIED",
          "acceptableAnswers": [
            "ERC20_COMPLIANT_TOKEN_CERTIFIED",
            "status\":\"ERC20_COMPLIANT_TOKEN_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
          "diagnosisMap": {
            "NON_COMPLIANT": {
              "misconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
              "errorExplanation": "All 6 methods present confirms ERC20_COMPLIANT_TOKEN_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Matches ERC20_COMPLIANT_TOKEN_CERTIFIED.",
                "guidedFixPrompt": "Type ERC20_COMPLIANT_TOKEN_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d13-b2-allowance-and-transferfrom-pattern",
        "day": 13,
        "blockNumber": 2,
        "title": "The Approve / TransferFrom Delegated Spending Pattern",
        "conceptBudget": {
          "primaryConcept": "Approve & TransferFrom Pattern",
          "supportingTerms": [
            "Nested Allowance Mapping (`mapping(address => mapping(address => uint256)) allowances`)",
            "Two-Step Protocol Interaction (Step 1: User calls `approve(DEX, 500)`; Step 2: DEX calls `transferFrom(User, Pool, 500)`)",
            "Allowance race condition mitigation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d13-b1-erc20-interface-methods",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Approve and TransferFrom Lifecycle Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "User calls token.approve(DEX_Contract, 100 Tokens)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Token contract updates allowance: allowances[User][DEX] = 100",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "User calls DEX_Contract.swapTokens()",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "DEX calls token.transferFrom(User, Vault, 100) -> Allowance decremented to 0!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "allowance_flow_demo.js",
            "initialCode": "function executeAllowanceSpend(allowance, amount) {\n  if (allowance < amount) return { success: false, error: 'INSUFFICIENT_ALLOWANCE' };\n  return {\n    success: true,\n    spent: amount,\n    remainingAllowance: allowance - amount\n  };\n}\n\nconsole.log(JSON.stringify(executeAllowanceSpend(500, 300)));\nconsole.log(JSON.stringify(executeAllowanceSpend(100, 300)));",
            "expectedOutput": "{\"success\":true,\"spent\":300,\"remainingAllowance\":200}\n{\"success\":false,\"error\":\"INSUFFICIENT_ALLOWANCE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must a user call `token.approve(DEX, amount)` before swapping tokens on a Decentralized Exchange (DEX)?",
          "options": [
            "Because smart contracts cannot automatically withdraw tokens from a user's wallet; the user must explicitly grant permission via an allowance so the DEX can execute `transferFrom`",
            "Because Ethereum requires two signatures for every transaction",
            "To pay for electricity"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
              "errorExplanation": "Approve grants explicit allowance permissions for delegated contract withdrawals.",
              "recoveryPath": {
                "simplerExplanation": "Grants allowance permission for the contract to pull tokens.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d13-b3-decimals-18-math-scaling",
        "day": 13,
        "blockNumber": 3,
        "title": "Decimals (18) Fixed-Point Arithmetic & Fractional Precision",
        "conceptBudget": {
          "primaryConcept": "ERC-20 18-Decimals Precision",
          "supportingTerms": [
            "No Native Floating-Point in EVM",
            "18 Decimals Standard ($1.0\\text{ Token} = 10^{18} = 1,000,000,000,000,000,000\\text{ base units}$)",
            "USDC / USDT (6 Decimals: $1.0\\text{ USDC} = 10^6 = 1,000,000\\text{ units}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d13-b2-allowance-and-transferfrom-pattern",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "decimals_scaling_demo.js",
            "initialCode": "function convertTokenToBaseUnits(humanAmount, decimals = 18) {\n  const baseUnits = BigInt(humanAmount) * (10n ** BigInt(decimals));\n  return baseUnits.toString();\n}\n\nconsole.log('5.0 Tokens with 18 decimals:', convertTokenToBaseUnits(5, 18));\nconsole.log('5.0 USDC with 6 decimals:', convertTokenToBaseUnits(5, 6));",
            "expectedOutput": "5.0 Tokens with 18 decimals: 5000000000000000000\n5.0 USDC with 6 decimals: 5000000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many base units represent 5.0 tokens with standard 18 decimals ($5 \\times 10^{18}$)?",
          "expectedStringOutput": "5000000000000000000",
          "acceptableAnswers": [
            "5000000000000000000",
            "5 * 10^18"
          ],
          "primaryMisconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
              "errorExplanation": "18 decimals means multiplying by 10^18 -> 5000000000000000000.",
              "recoveryPath": {
                "simplerExplanation": "Multiply by 10^18 -> 5000000000000000000.",
                "guidedFixPrompt": "Type 5000000000000000000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "ERC-721 & ERC-1155 Non-Fungible Tokens (NFTs)",
    "overviewMetaphor": "An ERC-721 NFT is a digital land deed certificate: unlike ERC-20 dollar bills where every bill is identical, each NFT has a unique `tokenId` (e.g. Token #4242); `ownerOf(4242)` points to a single owner address; `tokenURI(4242)` points to an immutable IPFS JSON file containing the artwork image, description, and metadata attributes.",
    "blocks": [
      {
        "id": "chain-d14-b1-erc721-unique-ownership-mapping",
        "day": 14,
        "blockNumber": 1,
        "title": "ERC-721 Architecture: Unique `tokenId` to Owner Mappings",
        "conceptBudget": {
          "primaryConcept": "ERC-721 NFT Mappings",
          "supportingTerms": [
            "`mapping(uint256 => address) _owners`",
            "`mapping(address => uint256) _balances`",
            "`ownerOf(uint256 tokenId)`",
            "`safeTransferFrom(from, to, tokenId)` with `onERC721Received` hook"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d13-b1-erc20-interface-methods",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ERC-721 Internal Storage Mappings",
              "boxes": [
                {
                  "label": "_owners Mapping",
                  "value": "mapping(uint256 => address) -> Token #101 = 0xAlice | Token #102 = 0xBob",
                  "varType": "Token Ownership",
                  "isUpdated": true
                },
                {
                  "label": "_tokenApprovals",
                  "value": "mapping(uint256 => address) -> Token #101 approved for 0xOpenSeaContract",
                  "varType": "Single Approvals",
                  "isUpdated": false
                },
                {
                  "label": "_operatorApprovals",
                  "value": "mapping(address => mapping(address => bool)) -> Alice approved OpenSea for ALL",
                  "varType": "All Approvals",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "erc721_mint_demo.js",
            "initialCode": "function mintNft(ownersMap, balancesMap, to, tokenId) {\n  if (ownersMap[tokenId]) return { success: false, error: 'TOKEN_ALREADY_MINTED' };\n  ownersMap[tokenId] = to;\n  balancesMap[to] = (balancesMap[to] || 0) + 1;\n  return {\n    success: true,\n    tokenId,\n    owner: to,\n    userTotalNftBalance: balancesMap[to]\n  };\n}\n\nconst owners = {}; const balances = {};\nconsole.log(JSON.stringify(mintNft(owners, balances, '0xAlice', 101)));",
            "expectedOutput": "{\"success\":true,\"tokenId\":101,\"owner\":\"0xAlice\",\"userTotalNftBalance\":1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is returned by `ownerOf(101)` after minting token 101 to `0xAlice`?",
          "expectedStringOutput": "0xAlice",
          "acceptableAnswers": [
            "0xAlice",
            "owner\":\"0xAlice\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_ERC721_ERC1155_NFT_TOKEN_URI_ROYALTIES",
          "diagnosisMap": {
            "null": {
              "misconceptionId": "MC_CHAIN_ERC721_ERC1155_NFT_TOKEN_URI_ROYALTIES",
              "errorExplanation": "Minting writes the recipient to _owners[tokenId], returning 0xAlice.",
              "recoveryPath": {
                "simplerExplanation": "Returns owner 0xAlice.",
                "guidedFixPrompt": "Type 0xAlice"
              }
            }
          }
        }
      },
      {
        "id": "chain-d14-b2-metadata-json-and-ipfs-uris",
        "day": 14,
        "blockNumber": 2,
        "title": "Metadata JSON Schemas & Decentralized IPFS Storage",
        "conceptBudget": {
          "primaryConcept": "NFT Metadata & IPFS URIs",
          "supportingTerms": [
            "Metadata JSON standard (`name`, `description`, `image`, `attributes`)",
            "Decentralized IPFS URI (`ipfs://Qm...` vs Centralized HTTP)",
            "Immutable Content Addressing (CID)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d14-b1-erc721-unique-ownership-mapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Standard ERC-721 Metadata JSON Schema",
            "codeSnippet": "{\n  \"name\": \"Cyber Samurai #42\",\n  \"description\": \"A 3D rigged cybernetic avatar for the metaverse\",\n  \"image\": \"ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/42.png\",\n  \"attributes\": [\n    { \"trait_type\": \"Armor\", \"value\": \"Titanium Gold\" },\n    { \"trait_type\": \"Level\", \"value\": 99 }\n  ]\n}",
            "lineNotes": {
              "4": "IPFS content identifier points immutably to image asset.",
              "5": "Standard traits parsed automatically by marketplaces."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ipfs_uri_demo.js",
            "initialCode": "function evaluateMetadataStorage(uri) {\n  return uri.startsWith('ipfs://')\n    ? 'IMMUTABLE_DECENTRALIZED_IPFS_METADATA'\n    : 'CENTRALIZED_WEB2_SERVER_RUGPULL_RISK';\n}\n\nconsole.log(evaluateMetadataStorage('ipfs://Qm12345/metadata.json'));\nconsole.log(evaluateMetadataStorage('https://my-central-api.com/meta/1'));",
            "expectedOutput": "IMMUTABLE_DECENTRALIZED_IPFS_METADATA\nCENTRALIZED_WEB2_SERVER_RUGPULL_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should NFT metadata images be stored on IPFS (`ipfs://`) rather than standard HTTP web servers (`https://`)?",
          "options": [
            "Because HTTP web servers can be shut down or altered by the owner, breaking the NFT image; IPFS uses content-addressable cryptographic hashes, ensuring metadata can never be modified or deleted",
            "Because IPFS images load in 1 millisecond",
            "Because OpenSea bans PNG images"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_ERC721_ERC1155_NFT_TOKEN_URI_ROYALTIES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_ERC721_ERC1155_NFT_TOKEN_URI_ROYALTIES",
              "errorExplanation": "IPFS guarantees immutability through cryptographic content addressing.",
              "recoveryPath": {
                "simplerExplanation": "IPFS content addressing prevents metadata tampering or deletion.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d14-b3-erc1155-multi-token-standard",
        "day": 14,
        "blockNumber": 3,
        "title": "ERC-1155 Multi-Token: Semi-Fungible Items & Batch Transfers",
        "conceptBudget": {
          "primaryConcept": "ERC-1155 Multi-Token Standard",
          "supportingTerms": [
            "Single Contract Multi-Token (Supports Fungible currencies, Semi-Fungibles, and Non-Fungibles in 1 contract)",
            "`safeBatchTransferFrom` (Transferring 50 swords, 100 gold coins, and 1 unique shield in 1 draw call)",
            "90% gas savings over deploying multiple ERC-20 and ERC-721 contracts"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d14-b2-metadata-json-and-ipfs-uris",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "erc1155_batch_demo.js",
            "initialCode": "function evaluateBatchSavings(itemTypesCount) {\n  const erc721Gas = itemTypesCount * 65000; // Individual transfers\n  const erc1155BatchGas = 85000; // 1 batch transfer\n  const savingsPercent = ((erc721Gas - erc1155BatchGas) / erc721Gas) * 100;\n  return {\n    itemsTransferred: itemTypesCount,\n    erc721IndividualGas: erc721Gas,\n    erc1155BatchGas,\n    gasSavingsPercent: Number(savingsPercent.toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBatchSavings(10))); // Batch transfer 10 item types",
            "expectedOutput": "{\"itemsTransferred\":10,\"erc721IndividualGas\":650000,\"erc1155BatchGas\":85000,\"gasSavingsPercent\":86.9}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What gas savings percentage is achieved by batch transferring 10 game item types in an ERC-1155 contract vs separate ERC-721 transfers?",
          "expectedStringOutput": "86.9",
          "acceptableAnswers": [
            "86.9",
            "86.9%",
            "gasSavingsPercent\":86.9"
          ],
          "primaryMisconceptionId": "MC_CHAIN_ERC721_ERC1155_NFT_TOKEN_URI_ROYALTIES",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_CHAIN_ERC721_ERC1155_NFT_TOKEN_URI_ROYALTIES",
              "errorExplanation": "650,000 gas down to 85,000 gas achieves an 86.9% gas reduction.",
              "recoveryPath": {
                "simplerExplanation": "Saves 86.9% gas.",
                "guidedFixPrompt": "Type 86.9"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete ERC-20 / ERC-721 Decentralized Asset Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete decentralized digital economy: 1. Deploy ERC-20 fungible payment currency; 2. Deploy ERC-721 unique NFT certificate registry; 3. Execute atomic purchases via `approve` and `transferFrom`; 4. Resolve immutable IPFS metadata URIs; 5. Verify zero arithmetic overflow vulnerabilities under Solidity 0.8+.",
    "blocks": [
      {
        "id": "chain-d15-b1-asset-engine-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Decentralized Asset & Token Ecosystem Synthesis",
        "conceptBudget": {
          "primaryConcept": "Token Ecosystem Synthesis",
          "supportingTerms": [
            "ERC-20 Payments",
            "ERC-721 NFT Minting",
            "Operator Approvals",
            "SafeTransfer Event Logging"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d14-b1-erc721-unique-ownership-mapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Decentralized Token Purchase & Mint Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "User approves Marketplace to spend 100 PINIT tokens",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Marketplace calls transferFrom() -> Pulls 100 PINIT from User to Treasury",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Marketplace invokes NFT.mint(User, #101) -> Sets owner to User",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Emits Transfer events -> User owns verified on-chain NFT asset!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "asset_engine_sim.js",
            "initialCode": "function runAssetEngine() {\n  return {\n    erc20Payment: 'PINIT_TOKEN_TRANSFERRED',\n    erc721Mint: 'METAVERSE_NFT_MINTED',\n    ipfsResolution: 'METADATA_CID_VERIFIED',\n    systemStatus: 'DECENTRALIZED_ASSET_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runAssetEngine().systemStatus);",
            "expectedOutput": "DECENTRALIZED_ASSET_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What system status confirms active operational synthesis of the Decentralized Asset Engine?",
          "expectedStringOutput": "DECENTRALIZED_ASSET_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "DECENTRALIZED_ASSET_ENGINE_ACTIVE",
            "systemStatus: DECENTRALIZED_ASSET_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
              "errorExplanation": "Matches DECENTRALIZED_ASSET_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches DECENTRALIZED_ASSET_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type DECENTRALIZED_ASSET_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "chain-d15-b2-token-security-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Smart Contract Token Security & Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Token Security Invariant Audit",
          "supportingTerms": [
            "Total Supply Conservation Invariant ($\\sum \\text{balances} == \\text{totalSupply}$)",
            "Zero Address Transfer Reverts",
            "Approval reset on transfer"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d15-b1-asset-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "token_audit_demo.js",
            "initialCode": "function auditTokenSecurity(totalSupply, sumOfBalances, zeroAddressBlocked) {\n  const isConserved = (totalSupply === sumOfBalances);\n  const isSecure = isConserved && zeroAddressBlocked;\n  return {\n    totalSupply,\n    sumOfBalances,\n    isSupplyConserved: isConserved,\n    grade: isSecure ? 'TOKEN_SECURITY_AUDIT_PASSED' : 'SECURITY_VULNERABILITY_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(auditTokenSecurity(1000000, 1000000, true)));",
            "expectedOutput": "{\"totalSupply\":1000000,\"sumOfBalances\":1000000,\"isSupplyConserved\":true,\"grade\":\"TOKEN_SECURITY_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when token supply is perfectly conserved and zero-address transfers are blocked?",
          "expectedStringOutput": "TOKEN_SECURITY_AUDIT_PASSED",
          "acceptableAnswers": [
            "TOKEN_SECURITY_AUDIT_PASSED",
            "grade\":\"TOKEN_SECURITY_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
              "errorExplanation": "Security invariants met, awarding TOKEN_SECURITY_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards TOKEN_SECURITY_AUDIT_PASSED.",
                "guidedFixPrompt": "Type TOKEN_SECURITY_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d15-b3-milestone2-blockchain-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Decentralized Asset Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Decentralized Asset Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d15-b2-token-security-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_chain_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete ERC-20 / ERC-721 Decentralized Asset Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete ERC-20 / ERC-721 Decentralized Asset Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete ERC-20 / ERC-721 Decentralized Asset Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete ERC-20 / ERC-721 Decentralized Asset Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_ERC20_TOKEN_STANDARD_ALLOWANCE_TRANSFERFROM",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete ERC-20 / ERC-721 Decentralized Asset Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Reentrancy Attacks & Checks-Effects-Interactions Pattern",
    "overviewMetaphor": "A Reentrancy Attack is an ATM cash withdrawal glitch (The DAO Hack that stole $60 Million): a user asks the ATM for $100; the buggy ATM hands over the $100 bill FIRST; but before the ATM can subtract $100 from the user's bank balance, the attacker's robot interrupts the transaction and calls \"Withdraw $100\" again; because the balance was never subtracted, the ATM hands over another $100, repeating until the bank vault is completely empty; the Checks-Effects-Interactions (CEI) rule requires the ATM to deduct the balance FIRST before handing over physical cash.",
    "blocks": [
      {
        "id": "chain-d16-b1-reentrancy-vulnerability-anatomy",
        "day": 16,
        "blockNumber": 1,
        "title": "The Reentrancy Attack Flow: External Calls before State Updates",
        "conceptBudget": {
          "primaryConcept": "Reentrancy Vulnerability Flow",
          "supportingTerms": [
            "External Call Hazard (`msg.sender.call{value: amount}(\"\")`)",
            "Control Flow Hijacking via Malicious `fallback()` function",
            "Recursive Execution Loop before state variable update",
            "The DAO Hack Root Cause"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d11-b3-receive-and-fallback-handlers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Vulnerable Withdrawal vs CEI Reentrancy Defense Diff",
              "brokenCode": "// ❌ VULNERABLE TO REENTRANCY (The DAO Hack Pattern):\nfunction withdraw() external {\n  uint256 bal = balances[msg.sender];\n  require(bal > 0);\n  (bool sent, ) = msg.sender.call{value: bal}(\"\"); // 1. INTERACTION FIRST! Calls attacker fallback()\n  require(sent);\n  balances[msg.sender] = 0; // 2. EFFECT TOO LATE! Never reached during recursive loop!\n}",
              "fixedCode": "// ✅ 100% REENTRANCY SAFE (Checks-Effects-Interactions):\nfunction withdraw() external {\n  uint256 bal = balances[msg.sender]; // 1. CHECKS\n  require(bal > 0, 'ZERO_BALANCE');\n  balances[msg.sender] = 0; // 2. EFFECTS (Subtract balance FIRST before external call!)\n  (bool sent, ) = msg.sender.call{value: bal}(\"\"); // 3. INTERACTIONS\n  require(sent, 'ETH_TRANSFER_FAILED');\n}",
              "errorLine": 5,
              "errorReason": "Transferring Ether before zeroing balance allows the attacker's fallback() function to re-enter withdraw() recursively.",
              "fixExplanation": "Apply the Checks-Effects-Interactions pattern: update internal state before making external calls."
            }
          },
          {
            "type": "runnable_code",
            "filename": "reentrancy_sim.js",
            "initialCode": "function simulateReentrancy(isCeiProtected) {\n  return isCeiProtected\n    ? 'PROTECTED: BALANCE_ZEROED_BEFORE_EXTERNAL_CALL -> REENTRANCY_FAILS_WITH_ZERO_BALANCE'\n    : 'EXPLOITED: RECURSIVE_FALLBACK_DRAINS_ENTIRE_VAULT';\n}\n\nconsole.log(simulateReentrancy(true));\nconsole.log(simulateReentrancy(false));",
            "expectedOutput": "PROTECTED: BALANCE_ZEROED_BEFORE_EXTERNAL_CALL -> REENTRANCY_FAILS_WITH_ZERO_BALANCE\nEXPLOITED: RECURSIVE_FALLBACK_DRAINS_ENTIRE_VAULT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does updating `balances[msg.sender] = 0` BEFORE transferring Ether prevent reentrancy attacks?",
          "options": [
            "Because when the attacker's fallback function attempts to call `withdraw()` recursively, the balance check `require(balances[msg.sender] > 0)` immediately fails and reverts the attack",
            "Because external calls cannot execute code",
            "Because Solidity forbids recursion"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_REENTRANCY_ATTACK_CHECKS_EFFECTS_INTERACTIONS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_REENTRANCY_ATTACK_CHECKS_EFFECTS_INTERACTIONS",
              "errorExplanation": "Zeroing balance first ensures subsequent reentrant calls fail their balance requirements.",
              "recoveryPath": {
                "simplerExplanation": "Balance is 0 on recursive call, failing the check.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d16-b2-openzeppelin-reentrancy-guard-mutex",
        "day": 16,
        "blockNumber": 2,
        "title": "OpenZeppelin `ReentrancyGuard` & Mutex Locks (`nonReentrant`)",
        "conceptBudget": {
          "primaryConcept": "ReentrancyGuard Mutex",
          "supportingTerms": [
            "Mutex Lock Variable (`uint256 private _status`)",
            "`_NOT_ENTERED = 1`, `_ENTERED = 2` (Using 1 and 2 instead of 0 and 1 saves 20,000 gas SLOAD/SSTORE refund warm slots!)",
            "`nonReentrant` modifier",
            "Cross-Function Reentrancy defense"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d16-b1-reentrancy-vulnerability-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "OpenZeppelin ReentrancyGuard Mutex Implementation",
            "codeSnippet": "uint256 private constant _NOT_ENTERED = 1;\nuint256 private constant _ENTERED = 2;\nuint256 private _status = _NOT_ENTERED;\n\nmodifier nonReentrant() {\n  require(_status != _ENTERED, 'ReentrancyGuard: reentrant call');\n  _status = _ENTERED; // Lock the door!\n  _;\n  _status = _NOT_ENTERED; // Unlock door on exit\n}",
            "lineNotes": {
              "5": "Reverts immediately if function is called while already executing.",
              "6": "Locks state before entering function body."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mutex_gas_demo.js",
            "initialCode": "function evaluateMutexValues(valNotEntered, valEntered) {\n  const isOptimal = (valNotEntered === 1 && valEntered === 2);\n  return {\n    notEnteredValue: valNotEntered,\n    enteredValue: valEntered,\n    isGasOptimal: isOptimal,\n    reason: isOptimal ? 'SAVES_20000_GAS_BY_AVOIDING_ZERO_TO_NONZERO_WRITE' : 'EXPENSIVE_COLD_SSTORE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateMutexValues(1, 2)));",
            "expectedOutput": "{\"notEnteredValue\":1,\"enteredValue\":2,\"isGasOptimal\":true,\"reason\":\"SAVES_20000_GAS_BY_AVOIDING_ZERO_TO_NONZERO_WRITE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does OpenZeppelin `ReentrancyGuard` use `1` and `2` instead of `false (0)` and `true (1)` for mutex lock states?",
          "options": [
            "Because writing a non-zero value (`1`) to another non-zero value (`2`) costs only 5,000 gas, whereas writing from `0` (clean slot) to `1` (dirty slot) incurs an expensive 20,000 gas SSTORE penalty",
            "Because Solidity does not have booleans",
            "To support negative numbers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_REENTRANCY_ATTACK_CHECKS_EFFECTS_INTERACTIONS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_REENTRANCY_ATTACK_CHECKS_EFFECTS_INTERACTIONS",
              "errorExplanation": "Using 1 and 2 avoids the expensive zero-to-non-zero 20,000 gas SSTORE write penalty.",
              "recoveryPath": {
                "simplerExplanation": "Avoids 20,000 gas cold SSTORE write from zero.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d16-b3-read-only-reentrancy-hazards",
        "day": 16,
        "blockNumber": 3,
        "title": "Read-Only Reentrancy & DeFi Price Oracle Manipulation",
        "conceptBudget": {
          "primaryConcept": "Read-Only Reentrancy",
          "supportingTerms": [
            "Read-Only Reentrancy (Exploiting a `view` function that returns temporarily distorted LP pool balances during mid-withdrawal)",
            "Lending protocol collateral miscalculation",
            "Applying `nonReentrant` or price smoothing (TWAP) to view queries"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d16-b2-openzeppelin-reentrancy-guard-mutex",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "readonly_reentrancy_demo.js",
            "initialCode": "function evaluatePoolState(isMidWithdrawal) {\n  return isMidWithdrawal\n    ? 'DANGEROUS_MID_STATE: LP_PRICES_DISTORTED_READ_ONLY_REENTRANCY_RISK'\n    : 'STABLE_SETTLED_STATE: SAFE_FOR_ORACLE_VALUATION';\n}\n\nconsole.log(evaluatePoolState(true));\nconsole.log(evaluatePoolState(false));",
            "expectedOutput": "DANGEROUS_MID_STATE: LP_PRICES_DISTORTED_READ_ONLY_REENTRANCY_RISK\nSTABLE_SETTLED_STATE: SAFE_FOR_ORACLE_VALUATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What risk state occurs when a secondary lending protocol queries an AMM pool's LP balance while an external withdrawal is midway in flight?",
          "expectedStringOutput": "DANGEROUS_MID_STATE: LP_PRICES_DISTORTED_READ_ONLY_REENTRANCY_RISK",
          "acceptableAnswers": [
            "DANGEROUS_MID_STATE: LP_PRICES_DISTORTED_READ_ONLY_REENTRANCY_RISK",
            "DANGEROUS_MID_STATE",
            "Read-Only Reentrancy Risk"
          ],
          "primaryMisconceptionId": "MC_CHAIN_REENTRANCY_ATTACK_CHECKS_EFFECTS_INTERACTIONS",
          "diagnosisMap": {
            "STABLE": {
              "misconceptionId": "MC_CHAIN_REENTRANCY_ATTACK_CHECKS_EFFECTS_INTERACTIONS",
              "errorExplanation": "Mid-withdrawal states contain distorted temporary balances: DANGEROUS_MID_STATE: LP_PRICES_DISTORTED_READ_ONLY_REENTRANCY_RISK.",
              "recoveryPath": {
                "simplerExplanation": "Matches DANGEROUS_MID_STATE: LP_PRICES_DISTORTED_READ_ONLY_REENTRANCY_RISK.",
                "guidedFixPrompt": "Type DANGEROUS_MID_STATE: LP_PRICES_DISTORTED_READ_ONLY_REENTRANCY_RISK"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Smart Contract Access Control & Role-Based Security",
    "overviewMetaphor": "Access Control is an enterprise corporate badge system: `Ownable` is giving the CEO the single master gold keycard (If the CEO loses their key or gets hacked, the whole company is compromised!); `AccessControl` is Role-Based Security (The CFO has `TREASURER_ROLE` to withdraw funds; the Engineer has `MINTER_ROLE` to create tokens; the Board has `ADMIN_ROLE` to manage permissions), ensuring no single compromised key can destroy the protocol.",
    "blocks": [
      {
        "id": "chain-d17-b1-ownable-vs-access-control",
        "day": 17,
        "blockNumber": 1,
        "title": "Ownable vs Role-Based Access Control (OpenZeppelin `AccessControl`)",
        "conceptBudget": {
          "primaryConcept": "AccessControl Architecture",
          "supportingTerms": [
            "`Ownable` (Single owner address bottleneck)",
            "`AccessControl` (`bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE')`)",
            "`hasRole(role, account)`",
            "`grantRole` / `revokeRole`",
            "`DEFAULT_ADMIN_ROLE` (Admin of all roles)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d11-b2-custom-modifiers-and-guards",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Role-Based Access Control Pattern",
            "codeSnippet": "bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');\nbytes32 public constant BURNER_ROLE = keccak256('BURNER_ROLE');\n\nfunction mint(address to, uint256 amount) external {\n  require(hasRole(MINTER_ROLE, msg.sender), 'CALLER_MISSING_MINTER_ROLE');\n  _mint(to, amount);\n}",
            "lineNotes": {
              "1": "Stores unique 32-byte hash identifying the role.",
              "5": "Verifies specific role membership rather than monolithic ownership."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rbac_roles_demo.js",
            "initialCode": "function evaluateAccessControl(userRoles, targetRole) {\n  const hasAccess = userRoles.includes(targetRole) || userRoles.includes('ADMIN');\n  return {\n    userRoles,\n    targetRole,\n    accessGranted: hasAccess,\n    status: hasAccess ? 'RBAC_ACCESS_AUTHORIZED' : 'RBAC_PERMISSION_DENIED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAccessControl(['MINTER'], 'MINTER')));\nconsole.log(JSON.stringify(evaluateAccessControl(['VIEWER'], 'MINTER')));",
            "expectedOutput": "{\"userRoles\":[\"MINTER\"],\"targetRole\":\"MINTER\",\"accessGranted\":true,\"status\":\"RBAC_ACCESS_AUTHORIZED\"}\n{\"userRoles\":[\"VIEWER\"],\"targetRole\":\"MINTER\",\"accessGranted\":false,\"status\":\"RBAC_PERMISSION_DENIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when a user with role `['MINTER']` attempts to invoke a function requiring `MINTER`?",
          "expectedStringOutput": "RBAC_ACCESS_AUTHORIZED",
          "acceptableAnswers": [
            "RBAC_ACCESS_AUTHORIZED",
            "status\":\"RBAC_ACCESS_AUTHORIZED\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_ACCESS_CONTROL_OWNABLE_ROLES_TIMELOCK",
          "diagnosisMap": {
            "DENIED": {
              "misconceptionId": "MC_CHAIN_ACCESS_CONTROL_OWNABLE_ROLES_TIMELOCK",
              "errorExplanation": "Matching roles return RBAC_ACCESS_AUTHORIZED.",
              "recoveryPath": {
                "simplerExplanation": "Matches role -> RBAC_ACCESS_AUTHORIZED.",
                "guidedFixPrompt": "Type RBAC_ACCESS_AUTHORIZED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d17-b2-ownable2step-transfer-pattern",
        "day": 17,
        "blockNumber": 2,
        "title": "2-Step Ownership Transfers (`Ownable2Step`): Preventing Lockouts",
        "conceptBudget": {
          "primaryConcept": "Ownable2Step Transfer Pattern",
          "supportingTerms": [
            "1-Step Mistake Hazard (Calling `transferOwnership(0xTypo)` permanently locks the contract!)",
            "`Ownable2Step` Protocol (Step 1: Current owner nominates `pendingOwner`; Step 2: New owner must explicitly call `acceptOwnership()` from the new key)",
            "Zero-risk ownership transitions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d17-b1-ownable-vs-access-control",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Ownable2Step Safe Transfer Handshake",
              "nodes": [
                {
                  "id": "1",
                  "label": "Owner calls transferOwnership(0xNewOwner)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Contract sets pendingOwner = 0xNewOwner (Owner remains unchanged!)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "0xNewOwner calls acceptOwnership() from their wallet",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Owner updated to 0xNewOwner -> Ownership safely transferred with zero typo risk!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ownable2step_demo.js",
            "initialCode": "function process2StepOwnership(currentOwner, pendingOwner, caller) {\n  if (caller !== pendingOwner) {\n    return { success: false, error: 'CALLER_NOT_PENDING_OWNER', activeOwner: currentOwner };\n  }\n  return { success: true, activeOwner: pendingOwner, status: 'OWNERSHIP_SAFELY_ACCEPTED' };\n}\n\nconsole.log(JSON.stringify(process2StepOwnership('0xAlice', '0xBob', '0xBob')));",
            "expectedOutput": "{\"success\":true,\"activeOwner\":\"0xBob\",\"status\":\"OWNERSHIP_SAFELY_ACCEPTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is `Ownable2Step` universally recommended over standard `Ownable` for critical contracts?",
          "options": [
            "It requires the new owner to actively sign an `acceptOwnership()` transaction from their new wallet before ownership transfers, preventing catastrophic permanent lockouts caused by mistyping the new owner address",
            "Because it makes gas free",
            "To prevent transfers completely"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_ACCESS_CONTROL_OWNABLE_ROLES_TIMELOCK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_ACCESS_CONTROL_OWNABLE_ROLES_TIMELOCK",
              "errorExplanation": "2-step ownership requires the recipient to accept, eliminating typo bricking risks.",
              "recoveryPath": {
                "simplerExplanation": "Prevents typo lockouts by requiring the new owner to accept.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d17-b3-timelocks-and-multisig-governance",
        "day": 17,
        "blockNumber": 3,
        "title": "Timelock Controllers & Multi-Signature Safe Approvals",
        "conceptBudget": {
          "primaryConcept": "Timelocks & Multi-Sig Governance",
          "supportingTerms": [
            "Timelock Delay (48-hour mandatory queue before executing admin transactions)",
            "Rug-pull protection (Users have 48 hours to withdraw funds if malicious upgrade proposed)",
            "Gnosis Safe ($M$-of-$N$ multi-sig approval threshold)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d17-b2-ownable2step-transfer-pattern",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "timelock_queue_demo.js",
            "initialCode": "function evaluateTimelockExecution(queueTimestamp, currentTimestamp, minDelaySec = 172800) {\n  const elapsed = currentTimestamp - queueTimestamp;\n  const isReady = elapsed >= minDelaySec;\n  return {\n    elapsedHours: (elapsed / 3600).toFixed(1),\n    minDelayHours: (minDelaySec / 3600).toFixed(1),\n    canExecute: isReady,\n    status: isReady ? 'TIMELOCK_EXPIRED_READY_FOR_EXECUTION' : 'TIMELOCK_ACTIVE_OPERATION_QUEUED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateTimelockExecution(1700000000, 1700200000, 172800))); // 200k > 172.8k (48h)",
            "expectedOutput": "{\"elapsedHours\":\"55.6\",\"minDelayHours\":\"48.0\",\"canExecute\":true,\"status\":\"TIMELOCK_EXPIRED_READY_FOR_EXECUTION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is achieved when 55.6 hours have elapsed on a 48-hour Timelock controller?",
          "expectedStringOutput": "TIMELOCK_EXPIRED_READY_FOR_EXECUTION",
          "acceptableAnswers": [
            "TIMELOCK_EXPIRED_READY_FOR_EXECUTION",
            "status\":\"TIMELOCK_EXPIRED_READY_FOR_EXECUTION\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_ACCESS_CONTROL_OWNABLE_ROLES_TIMELOCK",
          "diagnosisMap": {
            "ACTIVE": {
              "misconceptionId": "MC_CHAIN_ACCESS_CONTROL_OWNABLE_ROLES_TIMELOCK",
              "errorExplanation": "55.6h > 48h fulfills the delay: TIMELOCK_EXPIRED_READY_FOR_EXECUTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches TIMELOCK_EXPIRED_READY_FOR_EXECUTION.",
                "guidedFixPrompt": "Type TIMELOCK_EXPIRED_READY_FOR_EXECUTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "DeFi Automated Market Makers (AMM) & Constant Product ($x \\cdot y = k$)",
    "overviewMetaphor": "An AMM Liquidity Pool is a two-sided vending machine with 1,000 Apples ($x$) and 1,000 Oranges ($y$): the mathematical rule of the vending machine is $x \\cdot y = k$ ($1000 \\times 1000 = 1,000,000$ constant); if you deposit 100 Apples into the machine, the machine must give you enough Oranges so the product of the remaining fruits stays exactly $1,000,000$ ($1100 \\times y = 1,000,000 \\implies y = 909.09$, giving you $90.91$ Oranges); no order books or market makers needed!",
    "blocks": [
      {
        "id": "chain-d18-b1-constant-product-formula-math",
        "day": 18,
        "blockNumber": 1,
        "title": "The Constant Product Invariant ($x \\cdot y = k$) & Swap Pricing",
        "conceptBudget": {
          "primaryConcept": "Constant Product AMM Formula",
          "supportingTerms": [
            "Reserves ($x = \\text{Token A}, y = \\text{Token B}$)",
            "Invariant $k = x \\cdot y$",
            "Swap Formula: $\\Delta y = \\frac{y \\cdot \\Delta x}{x + \\Delta x}$ (without fees)",
            "Marginal Price: $P = y / x$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d13-b1-erc20-interface-methods",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Uniswap v2 Constant Product Math",
            "codeSnippet": "// Invariant: (x + dx) * (y - dy) = k = x * y\n// Solving for dy (Tokens received):\n// dy = (y * dx) / (x + dx)\n// With 0.3% LP fee (dxWithFee = dx * 997):\n// dy = (y * dx * 997) / (x * 1000 + dx * 997)",
            "lineNotes": {
              "4": "Standard Uniswap v2 swap equation taking 0.3% fee."
            }
          },
          {
            "type": "runnable_code",
            "filename": "amm_math_demo.js",
            "initialCode": "function calculateAmmOutput(reserveX, reserveY, dx) {\n  const k = reserveX * reserveY;\n  const newX = reserveX + dx;\n  const newY = k / newX;\n  const dy = reserveY - newY;\n  return {\n    dxDeposited: dx,\n    dyReceived: Number(dy.toFixed(2)),\n    newReserveX: newX,\n    newReserveY: Number(newY.toFixed(2)),\n    invariantK: k\n  };\n}\n\nconsole.log(JSON.stringify(calculateAmmOutput(1000, 1000, 100)));",
            "expectedOutput": "{\"dxDeposited\":100,\"dyReceived\":90.91,\"newReserveX\":1100,\"newReserveY\":909.09,\"invariantK\":1000000}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many tokens ($dy$) are received from a 1000/1000 pool when depositing 100 tokens ($dx$) without fees ($1000 - 1000000/1100$)?",
          "expectedStringOutput": "90.91",
          "acceptableAnswers": [
            "90.91",
            "dyReceived\":90.91"
          ],
          "primaryMisconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
              "errorExplanation": "Slippage occurs on constant product curves; 100 in yields 90.91 out.",
              "recoveryPath": {
                "simplerExplanation": "Constant product formula yields 90.91 tokens.",
                "guidedFixPrompt": "Type 90.91"
              }
            }
          }
        }
      },
      {
        "id": "chain-d18-b2-lp-tokens-and-mint-burn",
        "day": 18,
        "blockNumber": 2,
        "title": "Liquidity Provider (LP) Tokens: Minting & Burning",
        "conceptBudget": {
          "primaryConcept": "LP Token Mint & Burn",
          "supportingTerms": [
            "Initial Mint: $\\text{LP} = \\sqrt{x \\cdot y} - 1000$ (Burning minimum 1000 LP tokens to prevent inflation attack)",
            "Proportional Deposit: $\\frac{\\Delta x}{x} = \\frac{\\Delta y}{y}$",
            "Burning LP: Withdrawing proportional share of both pool reserves"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d18-b1-constant-product-formula-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lp_mint_demo.js",
            "initialCode": "function calculateLpShare(userLp, totalLp, reserveA, reserveB) {\n  const shareRatio = userLp / totalLp;\n  return {\n    sharePercent: `${(shareRatio * 100).toFixed(1)}%`,\n    tokenAWithdrawn: reserveA * shareRatio,\n    tokenBWithdrawn: reserveB * shareRatio\n  };\n}\n\nconsole.log(JSON.stringify(calculateLpShare(250, 1000, 50000, 50000))); // 25% pool share",
            "expectedOutput": "{\"sharePercent\":\"25.0%\",\"tokenAWithdrawn\":12500,\"tokenBWithdrawn\":12500}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many Token A are withdrawn when burning 250 LP tokens out of 1000 total LP tokens in a 50,000 pool (25%)?",
          "expectedStringOutput": "12500",
          "acceptableAnswers": [
            "12500",
            "tokenAWithdrawn\":12500"
          ],
          "primaryMisconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
          "diagnosisMap": {
            "25000": {
              "misconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
              "errorExplanation": "25% of 50,000 = 12,500 tokens.",
              "recoveryPath": {
                "simplerExplanation": "0.25 * 50,000 = 12,500.",
                "guidedFixPrompt": "Type 12500"
              }
            }
          }
        }
      },
      {
        "id": "chain-d18-b3-impermanent-loss-calculation",
        "day": 18,
        "blockNumber": 3,
        "title": "Impermanent Loss (IL) & Price Divergence Math",
        "conceptBudget": {
          "primaryConcept": "Impermanent Loss Mathematics",
          "supportingTerms": [
            "Impermanent Loss (Value difference between holding tokens in wallet vs depositing in AMM pool)",
            "Formula: $\\text{IL} = \\frac{2\\sqrt{k}}{1 + k} - 1$ (where $k = P_{\\text{new}} / P_{\\text{old}}$)",
            "$2x$ price change = $5.7\\%$ IL; $5x$ price change = $25.5\\%$ IL"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d18-b2-lp-tokens-and-mint-burn",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "impermanent_loss_demo.js",
            "initialCode": "function calculateImpermanentLoss(priceRatioK) {\n  const il = (2 * Math.sqrt(priceRatioK)) / (1 + priceRatioK) - 1.0;\n  return {\n    priceRatio: priceRatioK,\n    impermanentLossPercent: Number((il * 100).toFixed(2))\n  };\n}\n\nconsole.log(JSON.stringify(calculateImpermanentLoss(2.0))); // 2x price change\nconsole.log(JSON.stringify(calculateImpermanentLoss(5.0))); // 5x price change",
            "expectedOutput": "{\"priceRatio\":2,\"impermanentLossPercent\":-5.72}\n{\"priceRatio\":5,\"impermanentLossPercent\":-25.46}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is Impermanent Loss called 'impermanent' in DeFi AMM pools?",
          "options": [
            "Because the loss is only realized when the LP withdraws their liquidity; if the relative prices of both tokens return to their original ratio, the loss disappears completely (minus accumulated trading fees)",
            "Because it only lasts for 1 minute",
            "Because smart contracts cannot lose money"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
              "errorExplanation": "The loss vanishes if token prices return to their initial ratio.",
              "recoveryPath": {
                "simplerExplanation": "Reversible if prices return to original ratio.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Flash Loans & Atomic Arbitrage Execution",
    "overviewMetaphor": "A Flash Loan is borrowing $100,000,000 with zero collateral for 12 seconds: because EVM transactions are completely Atomic (Either 100% of instructions succeed, or 100% roll back as if nothing happened!), Aave lends you $100M; you buy cheap tokens on Uniswap and sell high on Sushiswap; in the very same transaction, you repay the $100M + $90,000 fee; if the arbitrage fails to make a profit, the transaction reverts and the loan never existed.",
    "blocks": [
      {
        "id": "chain-d19-b1-flash-loan-atomic-lifecycle",
        "day": 19,
        "blockNumber": 1,
        "title": "The Flash Loan Lifecycle: Borrow $\\to$ Execute $\\to$ Repay",
        "conceptBudget": {
          "primaryConcept": "Flash Loan Atomic Lifecycle",
          "supportingTerms": [
            "Uncollateralized Borrowing",
            "`executeOperation()` callback hook",
            "Atomic Execution Invariant (Zero default risk for liquidity pool: if borrower cannot repay, EVM reverts entire transaction!)",
            "Aave 0.09% Flash Loan Fee"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d18-b1-constant-product-formula-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Aave Flash Loan Execution Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Borrower calls pool.flashLoanSimple(1,000,000 USDC)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Pool transfers 1M USDC to Borrower contract -> Calls executeOperation()",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Borrower executes DEX Arbitrage / Liquidation -> Generates profit",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Pool pulls 1,000,900 USDC (Loan + 0.09% fee) -> Transaction commits successfully!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "flash_loan_demo.js",
            "initialCode": "function evaluateFlashLoanSolvency(borrowed, profit, feePercent = 0.0009) {\n  const fee = borrowed * feePercent;\n  const netProfit = profit - fee;\n  const isSolvent = netProfit > 0;\n  return {\n    borrowedAmount: borrowed,\n    feeOwed: fee,\n    netArbitrageProfit: Number(netProfit.toFixed(2)),\n    status: isSolvent ? 'TRANSACTION_COMMITTED_PROFIT_REALIZED' : 'TRANSACTION_REVERTED_INSUFFICIENT_FEE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFlashLoanSolvency(1000000, 2000))); // $2k profit > $900 fee\nconsole.log(JSON.stringify(evaluateFlashLoanSolvency(1000000, 500)));  // $500 profit < $900 fee",
            "expectedOutput": "{\"borrowedAmount\":1000000,\"feeOwed\":900,\"netArbitrageProfit\":1100,\"status\":\"TRANSACTION_COMMITTED_PROFIT_REALIZED\"}\n{\"borrowedAmount\":1000000,\"feeOwed\":900,\"netArbitrageProfit\":-400,\"status\":\"TRANSACTION_REVERTED_INSUFFICIENT_FEE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the net profit from a $1,000,000 flash loan (0.09% fee = $900) generating $2,000 in DEX arbitrage?",
          "expectedStringOutput": "1100",
          "acceptableAnswers": [
            "1100",
            "1100.00",
            "netArbitrageProfit\":1100",
            "$1100"
          ],
          "primaryMisconceptionId": "MC_CHAIN_DEFI_FLASH_LOANS_ATOMIC_ARBITRAGE",
          "diagnosisMap": {
            "2000": {
              "misconceptionId": "MC_CHAIN_DEFI_FLASH_LOANS_ATOMIC_ARBITRAGE",
              "errorExplanation": "Must deduct the $900 Aave fee: $2000 - $900 = $1100 net profit.",
              "recoveryPath": {
                "simplerExplanation": "2000 - 900 = 1100.",
                "guidedFixPrompt": "Type 1100"
              }
            }
          }
        }
      },
      {
        "id": "chain-d19-b2-flash-loan-attack-vectors",
        "day": 19,
        "blockNumber": 2,
        "title": "Flash Loan Attack Vectors: Spot Price Manipulation",
        "conceptBudget": {
          "primaryConcept": "Flash Loan Oracle Exploits",
          "supportingTerms": [
            "Instantaneous Spot Price Manipulation (Dumping millions into a single AMM pool to artificially crash token price for 1 block)",
            "Exploiting lending protocols that rely on spot AMM reserves instead of decentralized oracles (Chainlink)",
            "TWAP (Time-Weighted Average Price) defenses"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d19-b1-flash-loan-atomic-lifecycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Spot Price Vulnerability vs Chainlink TWAP Defense Diff",
              "brokenCode": "// ❌ VULNERABLE TO FLASH LOAN MANIPULATION:\nuint256 price = ammPool.getReserveB() / ammPool.getReserveA();\n// Attacker uses $50M flash loan to dump Token A into pool, crashing price 90% in 1 transaction!",
              "fixedCode": "// ✅ 100% FLASH LOAN RESISTANT (Decentralized Chainlink Oracle):\n(, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();\nrequire(price > 0 && block.timestamp - updatedAt < 3600, 'STALE_ORACLE_PRICE');",
              "errorLine": 2,
              "errorReason": "Using instantaneous spot AMM pool balances allows attackers to artificially skew prices using flash loan capital.",
              "fixExplanation": "Use decentralized off-chain oracles (Chainlink) or multi-block TWAP pricing."
            }
          },
          {
            "type": "runnable_code",
            "filename": "oracle_exploit_demo.js",
            "initialCode": "function evaluatePriceSource(source) {\n  return (source === 'CHAINLINK_AGGREGATOR_V3')\n    ? 'IMMUNE_TO_FLASH_LOAN_MANIPULATION: DECENTRALIZED_CONSENSUS'\n    : 'HIGH_EXPLOIT_RISK: SPOT_AMM_RESERVE_CAN_BE_SKEWED';\n}\n\nconsole.log(evaluatePriceSource('CHAINLINK_AGGREGATOR_V3'));\nconsole.log(evaluatePriceSource('SPOT_UNISWAP_RESERVE'));",
            "expectedOutput": "IMMUNE_TO_FLASH_LOAN_MANIPULATION: DECENTRALIZED_CONSENSUS\nHIGH_EXPLOIT_RISK: SPOT_AMM_RESERVE_CAN_BE_SKEWED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should DeFi lending protocols NEVER use instantaneous spot AMM pool reserves as a price oracle?",
          "options": [
            "Because an attacker can borrow $100M via a flash loan to temporarily skew the AMM reserve ratio in a single block, artificially manipulating collateral valuations and draining the lending protocol",
            "Because AMM pools cannot calculate division",
            "To save gas"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_DEFI_FLASH_LOANS_ATOMIC_ARBITRAGE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_DEFI_FLASH_LOANS_ATOMIC_ARBITRAGE",
              "errorExplanation": "Flash loans allow attackers to temporarily distort spot AMM pool reserves for instant exploit profit.",
              "recoveryPath": {
                "simplerExplanation": "Spot reserves are vulnerable to flash loan price skewing.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d19-b3-atomic-arbitrage-routing",
        "day": 19,
        "blockNumber": 3,
        "title": "Atomic Multi-DEX Arbitrage Routing & Liquidation Bots",
        "conceptBudget": {
          "primaryConcept": "Atomic Arbitrage Routing",
          "supportingTerms": [
            "Multi-DEX Price Discrepancies (Uniswap vs Sushiswap)",
            "MEV (Maximal Extractable Value)",
            "Searcher Bots & Private Mempools (Flashbots Builder)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d19-b2-flash-loan-attack-vectors",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mev_arbitrage_demo.js",
            "initialCode": "function evaluateArbitrageSpread(priceDexA, priceDexB) {\n  const spread = Math.abs(priceDexA - priceDexB);\n  const spreadPercent = (spread / Math.min(priceDexA, priceDexB)) * 100;\n  const isProfitable = spreadPercent > 0.5; // Profitable after 0.3% fees\n  return {\n    priceDexA,\n    priceDexB,\n    spreadPercent: Number(spreadPercent.toFixed(2)),\n    status: isProfitable ? 'ARBITRAGE_OPPORTUNITY_DETECTED' : 'SPREAD_BELOW_FEE_THRESHOLD'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateArbitrageSpread(2000, 2050))); // 2.5% spread",
            "expectedOutput": "{\"priceDexA\":2000,\"priceDexB\":2050,\"spreadPercent\":2.5,\"status\":\"ARBITRAGE_OPPORTUNITY_DETECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when a 2.5% price spread is detected between DEX A ($2000) and DEX B ($2050)?",
          "expectedStringOutput": "ARBITRAGE_OPPORTUNITY_DETECTED",
          "acceptableAnswers": [
            "ARBITRAGE_OPPORTUNITY_DETECTED",
            "status\":\"ARBITRAGE_OPPORTUNITY_DETECTED\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_DEFI_FLASH_LOANS_ATOMIC_ARBITRAGE",
          "diagnosisMap": {
            "BELOW": {
              "misconceptionId": "MC_CHAIN_DEFI_FLASH_LOANS_ATOMIC_ARBITRAGE",
              "errorExplanation": "2.5% spread exceeds the 0.5% fee threshold: ARBITRAGE_OPPORTUNITY_DETECTED.",
              "recoveryPath": {
                "simplerExplanation": "Matches ARBITRAGE_OPPORTUNITY_DETECTED.",
                "guidedFixPrompt": "Type ARBITRAGE_OPPORTUNITY_DETECTED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Chainlink Oracles & Decentralized Price Feeds",
    "overviewMetaphor": "A Chainlink Oracle is a jury of 31 independent financial judges: a smart contract on Ethereum cannot make HTTP `fetch()` requests to Nasdaq (The EVM is a closed sandbox without internet!); Chainlink solves this via a Decentralized Oracle Network (DON): 31 independent node operators fetch real-time ETH/USD prices from Coinbase, Binance, and Kraken; the nodes discard outliers and calculate the Median price on-chain, feeding reliable tamper-proof financial data into smart contracts.",
    "blocks": [
      {
        "id": "chain-d20-b1-chainlink-aggregator-v3-interface",
        "day": 20,
        "blockNumber": 1,
        "title": "The `AggregatorV3Interface` & Round Data Consumption",
        "conceptBudget": {
          "primaryConcept": "Chainlink AggregatorV3 Interface",
          "supportingTerms": [
            "`AggregatorV3Interface.latestRoundData()`",
            "Return Tuple: `(uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)`",
            "Decimals Normalization (`priceFeed.decimals() = 8` for USD feeds)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d11-b1-function-visibility-and-mutability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Consuming Chainlink latestRoundData Securely",
            "codeSnippet": "import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';\n\nfunction getLatestPrice() public view returns (uint256) {\n  (\n    uint80 roundId,\n    int256 price,\n    ,\n    uint256 updatedAt,\n    uint80 answeredInRound\n  ) = priceFeed.latestRoundData();\n  \n  require(price > 0, 'INVALID_ORACLE_PRICE_NEGATIVE');\n  require(answeredInRound >= roundId, 'STALE_ROUND_DATA');\n  require(block.timestamp - updatedAt < 3600, 'HEARTBEAT_EXPIRED');\n  \n  return uint256(price); // Price scaled with 8 decimals ($2000 = 200000000000)\n}",
            "lineNotes": {
              "11": "Validates price is positive.",
              "13": "Heartbeat check guarantees price freshness."
            }
          },
          {
            "type": "runnable_code",
            "filename": "chainlink_feed_demo.js",
            "initialCode": "function decodeOraclePrice(rawAnswer, decimals = 8) {\n  const normalUsd = Number(rawAnswer) / (10 ** decimals);\n  return {\n    rawOracleAnswer: rawAnswer.toString(),\n    decimals,\n    normalizedUsdPrice: Number(normalUsd.toFixed(2))\n  };\n}\n\nconsole.log(JSON.stringify(decodeOraclePrice(250050000000n, 8)));",
            "expectedOutput": "{\"rawOracleAnswer\":\"250050000000\",\"decimals\":8,\"normalizedUsdPrice\":2500.5}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the normalized USD price for raw Chainlink answer `250050000000` with 8 decimals ($250050000000 / 10^8$)?",
          "expectedStringOutput": "2500.5",
          "acceptableAnswers": [
            "2500.5",
            "2500.50",
            "normalizedUsdPrice\":2500.5",
            "$2500.50"
          ],
          "primaryMisconceptionId": "MC_CHAIN_ORACLES_CHAINLINK_PRICE_FEEDS_VRF",
          "diagnosisMap": {
            "250050": {
              "misconceptionId": "MC_CHAIN_ORACLES_CHAINLINK_PRICE_FEEDS_VRF",
              "errorExplanation": "Divide by 10^8 (100,000,000) -> 2500.50 USD.",
              "recoveryPath": {
                "simplerExplanation": "250050000000 / 10^8 = 2500.5.",
                "guidedFixPrompt": "Type 2500.5"
              }
            }
          }
        }
      },
      {
        "id": "chain-d20-b2-heartbeat-and-staleness-validation",
        "day": 20,
        "blockNumber": 2,
        "title": "Heartbeat Expiration & Stale Price Attack Defenses",
        "conceptBudget": {
          "primaryConcept": "Oracle Staleness & Heartbeat Checks",
          "supportingTerms": [
            "Heartbeat Interval (e.g. 1 hour / 3600s or 0.5% deviation trigger)",
            "`block.timestamp - updatedAt > heartbeat` Hazard (Market crashes while oracle feed stops updating, allowing insolvent borrows!)",
            "Multi-oracle fallback"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d20-b1-chainlink-aggregator-v3-interface",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "heartbeat_demo.js",
            "initialCode": "function evaluateStaleness(updatedAt, currentTimestamp, heartbeatSec = 3600) {\n  const ageSec = currentTimestamp - updatedAt;\n  const isFresh = ageSec <= heartbeatSec;\n  return {\n    priceAgeSeconds: ageSec,\n    heartbeatLimitSeconds: heartbeatSec,\n    isFresh,\n    status: isFresh ? 'ORACLE_DATA_FRESH_VALID' : 'ORACLE_STALE_HEARTBEAT_EXPIRED_REVERT'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateStaleness(1700000000, 1700001000, 3600))); // 1000s < 3600s\nconsole.log(JSON.stringify(evaluateStaleness(1700000000, 1700005000, 3600))); // 5000s > 3600s",
            "expectedOutput": "{\"priceAgeSeconds\":1000,\"heartbeatLimitSeconds\":3600,\"isFresh\":true,\"status\":\"ORACLE_DATA_FRESH_VALID\"}\n{\"priceAgeSeconds\":5000,\"heartbeatLimitSeconds\":3600,\"isFresh\":false,\"status\":\"ORACLE_STALE_HEARTBEAT_EXPIRED_REVERT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when an oracle price update is 5000 seconds old (exceeding the 3600s heartbeat limit)?",
          "expectedStringOutput": "ORACLE_STALE_HEARTBEAT_EXPIRED_REVERT",
          "acceptableAnswers": [
            "ORACLE_STALE_HEARTBEAT_EXPIRED_REVERT",
            "status\":\"ORACLE_STALE_HEARTBEAT_EXPIRED_REVERT\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_ORACLES_CHAINLINK_PRICE_FEEDS_VRF",
          "diagnosisMap": {
            "VALID": {
              "misconceptionId": "MC_CHAIN_ORACLES_CHAINLINK_PRICE_FEEDS_VRF",
              "errorExplanation": "Age 5000s > 3600s triggers ORACLE_STALE_HEARTBEAT_EXPIRED_REVERT.",
              "recoveryPath": {
                "simplerExplanation": "Age > Heartbeat -> ORACLE_STALE_HEARTBEAT_EXPIRED_REVERT.",
                "guidedFixPrompt": "Type ORACLE_STALE_HEARTBEAT_EXPIRED_REVERT"
              }
            }
          }
        }
      },
      {
        "id": "chain-d20-b3-chainlink-vrf-verifiable-randomness",
        "day": 20,
        "blockNumber": 3,
        "title": "Chainlink VRF: Provably Fair Verifiable Random Functions",
        "conceptBudget": {
          "primaryConcept": "Chainlink VRF Randomness",
          "supportingTerms": [
            "Blockhash Weakness (`block.timestamp` and `blockhash` can be manipulated by miners!)",
            "Verifiable Random Function (VRF: Cryptographic proof that random number was generated off-chain without bias)",
            "Two-Phase Request / Fulfillment Pattern (`fulfillRandomWords`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d20-b2-heartbeat-and-staleness-validation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "vrf_demo.js",
            "initialCode": "function evaluateRandomnessSource(source) {\n  return (source === 'CHAINLINK_VRF_V2')\n    ? 'PROVABLY_FAIR: CRYPTOGRAPHIC_PROOF_VERIFIED_ON_CHAIN'\n    : 'INSECURE: MINER_EXPLOITABLE_PSEUDORANDOM';\n}\n\nconsole.log(evaluateRandomnessSource('CHAINLINK_VRF_V2'));\nconsole.log(evaluateRandomnessSource('BLOCK_TIMESTAMP_HASH'));",
            "expectedOutput": "PROVABLY_FAIR: CRYPTOGRAPHIC_PROOF_VERIFIED_ON_CHAIN\nINSECURE: MINER_EXPLOITABLE_PSEUDORANDOM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must NFT lottery mints and gaming smart contracts use Chainlink VRF rather than `keccak256(abi.encodePacked(block.timestamp, block.prevrandao))`?",
          "options": [
            "Because miners and validators can choose to omit blocks or manipulate timestamps if the resulting pseudo-random number is unfavorable; Chainlink VRF provides a cryptographic zero-knowledge proof that the random number was unmanipulated",
            "Because keccak256 is deprecated",
            "To speed up minting"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_ORACLES_CHAINLINK_PRICE_FEEDS_VRF",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_ORACLES_CHAINLINK_PRICE_FEEDS_VRF",
              "errorExplanation": "On-chain timestamps can be biased by block producers; VRF is provably unmanipulated.",
              "recoveryPath": {
                "simplerExplanation": "VRF provides cryptographic proof against validator bias.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Production DeFi Lending & AMM DEX Protocol",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete decentralized finance protocol: 1. Constant Product AMM liquidity pools ($x \\cdot y = k$) with 0.3% LP swap fees; 2. Chainlink decentralized price oracle integration with heartbeat staleness guards; 3. Flash Loan borrowing with atomic repayment; 4. Reentrancy-protected Checks-Effects-Interactions (CEI) collateralized lending vault.",
    "blocks": [
      {
        "id": "chain-d21-b1-defi-protocol-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Complete DeFi Lending & AMM Protocol Synthesis",
        "conceptBudget": {
          "primaryConcept": "DeFi Protocol Architecture",
          "supportingTerms": [
            "Uniswap AMM Engine",
            "Chainlink Oracle Feeder",
            "Flash Loan Manager",
            "ReentrancyGuard Lending Vault"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d20-b2-heartbeat-and-staleness-validation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "End-to-End DeFi Protocol Architecture Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Chainlink Oracle updates ETH/USD price with heartbeat validation",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "AMM Pools execute 0.3% fee token swaps via constant product math (x*y=k)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Lending Vault checks 75% LTV collateral solvency before approving loans",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Flash Loan module provides atomic liquidity with reentrancy protection!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "defi_engine_sim.js",
            "initialCode": "function runDefiEngine() {\n  return {\n    ammPoolStatus: 'CONSTANT_PRODUCT_SWAP_ACTIVE',\n    oracleStatus: 'CHAINLINK_AGGREGATOR_V3_FRESH',\n    flashLoanModule: 'ATOMIC_REPAYMENT_VERIFIED',\n    lendingVault: 'CEI_REENTRANCY_GUARD_SECURE',\n    protocolStatus: 'DEFI_MASTER_PROTOCOL_NOMINAL'\n  };\n}\n\nconsole.log(runDefiEngine().protocolStatus);",
            "expectedOutput": "DEFI_MASTER_PROTOCOL_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What protocol status string confirms complete operational synthesis of the DeFi protocol?",
          "expectedStringOutput": "DEFI_MASTER_PROTOCOL_NOMINAL",
          "acceptableAnswers": [
            "DEFI_MASTER_PROTOCOL_NOMINAL",
            "protocolStatus: DEFI_MASTER_PROTOCOL_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
              "errorExplanation": "Matches DEFI_MASTER_PROTOCOL_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches DEFI_MASTER_PROTOCOL_NOMINAL.",
                "guidedFixPrompt": "Type DEFI_MASTER_PROTOCOL_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "chain-d21-b2-defi-solvency-benchmarking",
        "day": 21,
        "blockNumber": 2,
        "title": "Protocol Solvency Benchmarking & Liquidation Health Factor",
        "conceptBudget": {
          "primaryConcept": "DeFi Health Factor & Solvency",
          "supportingTerms": [
            "Health Factor ($H = \\frac{\\text{Collateral} \\times \\text{LiquidationThreshold}}{\\text{Borrowed}}$)",
            "$H > 1.0$ (Solvent)",
            "$H < 1.0$ (Liquidation Triggered)",
            "Liquidation Penalty ($5-10\\%$ reward to liquidator bot)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d21-b1-defi-protocol-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "health_factor_demo.js",
            "initialCode": "function evaluateHealthFactor(collateralUsd, borrowedUsd, liqThreshold = 0.80) {\n  const maxBorrow = collateralUsd * liqThreshold;\n  const health = maxBorrow / borrowedUsd;\n  const isSolvent = health >= 1.0;\n  return {\n    collateralUsd,\n    borrowedUsd,\n    healthFactor: Number(health.toFixed(2)),\n    isSolvent,\n    status: isSolvent ? 'LOAN_POSITION_HEALTHY' : 'LIQUIDATION_TRIGGERED_UNDERCOLLATERALIZED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateHealthFactor(10000, 6000, 0.80))); // Health 1.33\nconsole.log(JSON.stringify(evaluateHealthFactor(10000, 8500, 0.80))); // Health 0.94",
            "expectedOutput": "{\"collateralUsd\":10000,\"borrowedUsd\":6000,\"healthFactor\":1.33,\"isSolvent\":true,\"status\":\"LOAN_POSITION_HEALTHY\"}\n{\"collateralUsd\":10000,\"borrowedUsd\":8500,\"healthFactor\":0.94,\"isSolvent\":false,\"status\":\"LIQUIDATION_TRIGGERED_UNDERCOLLATERALIZED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What position status is assigned to a borrower whose health factor falls to 0.94 (below 1.0)?",
          "expectedStringOutput": "LIQUIDATION_TRIGGERED_UNDERCOLLATERALIZED",
          "acceptableAnswers": [
            "LIQUIDATION_TRIGGERED_UNDERCOLLATERALIZED",
            "status\":\"LIQUIDATION_TRIGGERED_UNDERCOLLATERALIZED\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
          "diagnosisMap": {
            "HEALTHY": {
              "misconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
              "errorExplanation": "Health factor < 1.0 triggers LIQUIDATION_TRIGGERED_UNDERCOLLATERALIZED.",
              "recoveryPath": {
                "simplerExplanation": "Health factor < 1.0 triggers liquidation.",
                "guidedFixPrompt": "Type LIQUIDATION_TRIGGERED_UNDERCOLLATERALIZED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d21-b3-milestone3-blockchain-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Production DeFi Lending & AMM Protocol Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "DeFi Protocol Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d21-b2-defi-solvency-benchmarking",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_chain_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Production DeFi Lending & AMM DEX Protocol [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Production DeFi Lending & AMM DEX Protocol [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Production DeFi Lending & AMM DEX Protocol [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Production DeFi Lending & AMM DEX Protocol [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_DEFI_AUTOMATED_MARKET_MAKER_CONSTANT_PRODUCT_AMM",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Production DeFi Lending & AMM DEX Protocol [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Upgradeable Smart Contracts: Proxies & Delegatecall",
    "overviewMetaphor": "An Upgradeable Smart Contract Proxy is a smartphone and its removable SIM card: the Proxy Contract is the permanent phone (Has the constant contract address and stores all user balances in its persistent storage); the Implementation Contract (Logic V1 / V2) is the software code; when the Proxy receives a call, it uses `DELEGATECALL` to borrow the logic from V1, executing the code inside the Proxy's own storage; to upgrade, the admin simply points the pointer to Logic V2 without moving a single dollar of user funds.",
    "blocks": [
      {
        "id": "chain-d22-b1-delegatecall-context-execution",
        "day": 22,
        "blockNumber": 1,
        "title": "The `DELEGATECALL` Opcode: Borrowing Code into Proxy Storage",
        "conceptBudget": {
          "primaryConcept": "DELEGATECALL Execution Context",
          "supportingTerms": [
            "Standard `CALL` (Executes code in callee storage with callee `msg.sender` and `msg.value`)",
            "`DELEGATECALL` (Executes callee code inside CALLER's storage, preserving original `msg.sender` and `msg.value`!)",
            "Proxy Pattern foundation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d8-b1-evm-memory-regions-triad",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CALL vs DELEGATECALL Context Comparison",
              "boxes": [
                {
                  "label": "Standard CALL",
                  "value": "Code: Target Contract | Storage: Target Contract | msg.sender: Proxy Address",
                  "varType": "Standard Context",
                  "isUpdated": false
                },
                {
                  "label": "DELEGATECALL",
                  "value": "Code: Target Contract | Storage: PROXY STORAGE | msg.sender: ORIGINAL USER!",
                  "varType": "Proxy Context",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "delegatecall_demo.js",
            "initialCode": "function evaluateCallContext(isDelegatecall) {\n  return isDelegatecall\n    ? 'STORAGE_MUTATED_IN_PROXY_CONTRACT (Original msg.sender preserved)'\n    : 'STORAGE_MUTATED_IN_CALLEE_CONTRACT';\n}\n\nconsole.log(evaluateCallContext(true));\nconsole.log(evaluateCallContext(false));",
            "expectedOutput": "STORAGE_MUTATED_IN_PROXY_CONTRACT (Original msg.sender preserved)\nSTORAGE_MUTATED_IN_CALLEE_CONTRACT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Where is storage mutated when Contract A executes `DELEGATECALL` to Contract B?",
          "options": [
            "Inside Contract A's persistent storage (Contract A executes Contract B's logic code directly in its own storage context)",
            "Inside Contract B's storage",
            "In RAM memory only"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_UPGRADEABLE_CONTRACTS_PROXY_DELEGATECALL_UUPS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_UPGRADEABLE_CONTRACTS_PROXY_DELEGATECALL_UUPS",
              "errorExplanation": "DELEGATECALL mutates caller storage (Contract A).",
              "recoveryPath": {
                "simplerExplanation": "Mutates caller storage (Contract A).",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d22-b2-storage-layout-collision-hazards",
        "day": 22,
        "blockNumber": 2,
        "title": "Storage Layout Collisions & EIP-1967 Unstructured Storage",
        "conceptBudget": {
          "primaryConcept": "Storage Slot Collision Prevention",
          "supportingTerms": [
            "Storage Collision Hazard (Proxy Slot 0 `owner` overwritten if Implementation Slot 0 is `balance`!)",
            "EIP-1967 Standard Storage Slots (`bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1)`)",
            "Append-Only Variable Invariant on V2 upgrades"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d22-b1-delegatecall-context-execution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Storage Collision Hazard vs EIP-1967 Fix Diff",
              "brokenCode": "// ❌ STORAGE COLLISION HAZARD (Naive Implementation Upgrade):\n// Logic V1: Slot 0 = uint256 count;\n// Logic V2: Slot 0 = address newAdmin; Slot 1 = uint256 count; // REORDERED!\n// Corrupts existing count data and bricking the proxy state!",
              "fixedCode": "// ✅ 100% COLLISION-FREE UPGRADE (Append-Only Rule):\n// Logic V1: Slot 0 = uint256 count;\n// Logic V2: Slot 0 = uint256 count; (PRESERVED!)\n//          Slot 1 = address newAdmin; (NEW VARIABLES APPENDED TO END!)",
              "errorLine": 3,
              "errorReason": "Reordering or inserting variables before existing state slots corrupts proxy storage layouts.",
              "fixExplanation": "Always append new state variables at the end of the storage layout."
            }
          },
          {
            "type": "runnable_code",
            "filename": "storage_collision_demo.js",
            "initialCode": "function evaluateUpgradeSafety(v1Slots, v2Slots) {\n  for (let i = 0; i < v1Slots.length; i++) {\n    if (v2Slots[i] !== v1Slots[i]) {\n      return 'CRITICAL_ERROR: STORAGE_SLOT_COLLISION_DETECTED';\n    }\n  }\n  return 'SAFE_UPGRADE: STORAGE_LAYOUT_PRESERVED';\n}\n\nconsole.log(evaluateUpgradeSafety(['count', 'owner'], ['count', 'owner', 'fee'])); // Appended\nconsole.log(evaluateUpgradeSafety(['count', 'owner'], ['fee', 'count', 'owner'])); // Prepended",
            "expectedOutput": "SAFE_UPGRADE: STORAGE_LAYOUT_PRESERVED\nCRITICAL_ERROR: STORAGE_SLOT_COLLISION_DETECTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when Logic V2 appends a new `fee` variable to the end of existing `['count', 'owner']` slots?",
          "expectedStringOutput": "SAFE_UPGRADE: STORAGE_LAYOUT_PRESERVED",
          "acceptableAnswers": [
            "SAFE_UPGRADE: STORAGE_LAYOUT_PRESERVED",
            "SAFE_UPGRADE"
          ],
          "primaryMisconceptionId": "MC_CHAIN_UPGRADEABLE_CONTRACTS_PROXY_DELEGATECALL_UUPS",
          "diagnosisMap": {
            "CRITICAL_ERROR": {
              "misconceptionId": "MC_CHAIN_UPGRADEABLE_CONTRACTS_PROXY_DELEGATECALL_UUPS",
              "errorExplanation": "Appending to the end preserves existing slots, ensuring SAFE_UPGRADE: STORAGE_LAYOUT_PRESERVED.",
              "recoveryPath": {
                "simplerExplanation": "Appending to end is safe -> SAFE_UPGRADE: STORAGE_LAYOUT_PRESERVED.",
                "guidedFixPrompt": "Type SAFE_UPGRADE: STORAGE_LAYOUT_PRESERVED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d22-b3-transparent-vs-uups-proxies",
        "day": 22,
        "blockNumber": 3,
        "title": "Transparent Upgradeable Proxy vs UUPS (Universal Upgradeable Proxy Standard)",
        "conceptBudget": {
          "primaryConcept": "Transparent vs UUPS Proxy Architecture",
          "supportingTerms": [
            "Transparent Proxy (Upgrade logic in Proxy; Admin calls routed to admin functions, user calls routed to implementation; Higher gas)",
            "UUPS Proxy (Upgrade logic `upgradeToAndCall()` inside Implementation contract; Cheaper deployment and lower gas overhead)",
            "OpenZeppelin `Initializable` (`initialize()` replaces constructor)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d22-b2-storage-layout-collision-hazards",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "uups_gas_demo.js",
            "initialCode": "function evaluateProxyType(type) {\n  return (type === 'UUPS')\n    ? { type, upgradeLogicLocation: 'IMPLEMENTATION', gasPerCall: 'LOW_OPTIMAL' }\n    : { type, upgradeLogicLocation: 'PROXY', gasPerCall: 'HIGHER_ADMIN_CHECK_OVERHEAD' };\n}\n\nconsole.log(JSON.stringify(evaluateProxyType('UUPS')));\nconsole.log(JSON.stringify(evaluateProxyType('TRANSPARENT')));",
            "expectedOutput": "{\"type\":\"UUPS\",\"upgradeLogicLocation\":\"IMPLEMENTATION\",\"gasPerCall\":\"LOW_OPTIMAL\"}\n{\"type\":\"TRANSPARENT\",\"upgradeLogicLocation\":\"PROXY\",\"gasPerCall\":\"HIGHER_ADMIN_CHECK_OVERHEAD\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Where does the upgrade logic (`upgradeToAndCall`) reside in a UUPS (Universal Upgradeable Proxy Standard) architecture?",
          "options": [
            "Inside the Implementation contract itself (reducing proxy gas costs and allowing the contract to permanently disable upgradability in future versions)",
            "Inside MetaMask",
            "On an AWS server"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_UPGRADEABLE_CONTRACTS_PROXY_DELEGATECALL_UUPS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_UPGRADEABLE_CONTRACTS_PROXY_DELEGATECALL_UUPS",
              "errorExplanation": "UUPS places the upgrade functions directly in the Implementation contract.",
              "recoveryPath": {
                "simplerExplanation": "Placed in the Implementation contract.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Ethers.js & Viem: Web3 JSON-RPC Providers & Signers",
    "overviewMetaphor": "Providers and Signers are a Telescope vs a Pen: a Web3 Provider (Ethers/Viem) is a high-powered digital telescope pointed at the blockchain (You can read any contract state, inspect balances, and query blocks for free via `eth_call`); a Signer is an ink pen loaded with your private key (When you want to transfer tokens or call state-mutating functions, the Signer signs the raw transaction bytes with your ECDSA key and submits it via `eth_sendRawTransaction`).",
    "blocks": [
      {
        "id": "chain-d23-b1-json-rpc-wire-protocol",
        "day": 23,
        "blockNumber": 1,
        "title": "The Ethereum JSON-RPC 2.0 Protocol: Wire Payloads",
        "conceptBudget": {
          "primaryConcept": "JSON-RPC 2.0 Wire Protocol",
          "supportingTerms": [
            "JSON-RPC Standard (`jsonrpc: '2.0'`, `id`, `method`, `params`)",
            "`eth_blockNumber`",
            "`eth_getBalance(address, 'latest')`",
            "`eth_call` (Read-only simulation)",
            "`eth_sendRawTransaction` (Broadcast signed hex bytes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d8-b1-evm-memory-regions-triad",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Standard JSON-RPC 2.0 Wire Payload",
            "codeSnippet": "{\n  \"jsonrpc\": \"2.0\",\n  \"id\": 42,\n  \"method\": \"eth_getBalance\",\n  \"params\": [\"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\", \"latest\"]\n}",
            "lineNotes": {
              "3": "Standard RPC method name.",
              "4": "Parameters: target address + block tag ('latest' or hex block number)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "json_rpc_demo.js",
            "initialCode": "function buildRpcCall(method, params = [], id = 1) {\n  return JSON.stringify({ jsonrpc: '2.0', id, method, params });\n}\n\nconsole.log(buildRpcCall('eth_blockNumber', []));\nconsole.log(buildRpcCall('eth_getBalance', ['0xAlice', 'latest'], 101));",
            "expectedOutput": "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_blockNumber\",\"params\":[]}\n{\"jsonrpc\":\"2.0\",\"id\":101,\"method\":\"eth_getBalance\",\"params\":[\"0xAlice\",\"latest\"]}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What JSON-RPC method is used to query an account's Ether balance at the latest block?",
          "expectedStringOutput": "eth_getBalance",
          "acceptableAnswers": [
            "eth_getBalance",
            "method\":\"eth_getBalance\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_ETHERS_VIEM_JSON_RPC_PROVIDER_SIGNER",
          "diagnosisMap": {
            "get_balance": {
              "misconceptionId": "MC_CHAIN_ETHERS_VIEM_JSON_RPC_PROVIDER_SIGNER",
              "errorExplanation": "The Ethereum standard method is prefixed: eth_getBalance.",
              "recoveryPath": {
                "simplerExplanation": "Standard Ethereum RPC method is eth_getBalance.",
                "guidedFixPrompt": "Type eth_getBalance"
              }
            }
          }
        }
      },
      {
        "id": "chain-d23-b2-ethers-vs-viem-architecture",
        "day": 23,
        "blockNumber": 2,
        "title": "Modern Client Libraries: Ethers.js v6 vs Viem Lightweight Clients",
        "conceptBudget": {
          "primaryConcept": "Ethers.js vs Viem Architecture",
          "supportingTerms": [
            "Ethers v6 `Contract` Abstraction (ABI encoding/decoding)",
            "Viem (Modular, tree-shakeable, TypeScript-first, 4x smaller bundle size)",
            "`publicClient.readContract()` vs `walletClient.writeContract()`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d23-b1-json-rpc-wire-protocol",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Ethers v6 vs Viem Feature Comparison",
              "boxes": [
                {
                  "label": "1. Ethers.js v6",
                  "value": "Style: Class-based OOP | Bundle: ~130 KB | Interface: new ethers.Contract(addr, abi, signer)",
                  "varType": "Ethers OOP",
                  "isUpdated": false
                },
                {
                  "label": "2. Viem (Modern Standard)",
                  "value": "Style: Functional modular | Bundle: ~35 KB (4x lighter!) | Type inference: 100% Strict TS",
                  "varType": "Viem Modular",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "viem_ethers_demo.js",
            "initialCode": "function evaluateWeb3Client(lib) {\n  return (lib === 'viem')\n    ? { library: 'VIEM', bundleSizeKb: 35, treeShakeable: true, typing: 'STRICT_ABI_INFERENCE' }\n    : { library: 'ETHERS_V6', bundleSizeKb: 130, treeShakeable: false, typing: 'STANDARD' };\n}\n\nconsole.log(JSON.stringify(evaluateWeb3Client('viem')));",
            "expectedOutput": "{\"library\":\"VIEM\",\"bundleSizeKb\":35,\"treeShakeable\":true,\"typing\":\"STRICT_ABI_INFERENCE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why has Viem become widely adopted for modern Web3 Next.js applications?",
          "options": [
            "Because Viem is designed with a lightweight, functional modular architecture that tree-shakes down to ~35KB with automatic end-to-end TypeScript ABI type inference",
            "Because Viem runs without internet",
            "Because Ethers.js was banned"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_ETHERS_VIEM_JSON_RPC_PROVIDER_SIGNER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_ETHERS_VIEM_JSON_RPC_PROVIDER_SIGNER",
              "errorExplanation": "Viem's small bundle size and strict TS ABI inference make it ideal for Next.js apps.",
              "recoveryPath": {
                "simplerExplanation": "Lightweight, tree-shakeable, and strict TypeScript types.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d23-b3-abi-function-selectors-encoding",
        "day": 23,
        "blockNumber": 3,
        "title": "Application Binary Interface (ABI) & 4-Byte Function Selectors",
        "conceptBudget": {
          "primaryConcept": "ABI Function Selectors & Calldata",
          "supportingTerms": [
            "4-Byte Selector: $\\text{Keccak-256}(\\text{\"transfer(address,uint256)\"})[0..3]$ (`0xa9059cbb`)",
            "Calldata Encoding (4-byte selector + 32-byte padded parameters)",
            "Decoding return data via ABI specification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d23-b2-ethers-vs-viem-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "abi_selector_demo.js",
            "initialCode": "function getSelectorPrefix(fnSignature) {\n  const selectors = {\n    'transfer(address,uint256)': '0xa9059cbb',\n    'approve(address,uint256)': '0x095ea7b3',\n    'balanceOf(address)': '0x70a08231'\n  };\n  return selectors[fnSignature] || '0x00000000';\n}\n\nconsole.log('transfer() selector:', getSelectorPrefix('transfer(address,uint256)'));\nconsole.log('approve() selector:', getSelectorPrefix('approve(address,uint256)'));",
            "expectedOutput": "transfer() selector: 0xa9059cbb\napprove() selector: 0x095ea7b3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 4-byte hexadecimal function selector corresponds to standard ERC-20 `transfer(address,uint256)`?",
          "expectedStringOutput": "0xa9059cbb",
          "acceptableAnswers": [
            "0xa9059cbb",
            "a9059cbb"
          ],
          "primaryMisconceptionId": "MC_CHAIN_ETHERS_VIEM_JSON_RPC_PROVIDER_SIGNER",
          "diagnosisMap": {
            "0x00000000": {
              "misconceptionId": "MC_CHAIN_ETHERS_VIEM_JSON_RPC_PROVIDER_SIGNER",
              "errorExplanation": "Keccak('transfer(address,uint256)')[0..3] is 0xa9059cbb.",
              "recoveryPath": {
                "simplerExplanation": "Standard transfer selector is 0xa9059cbb.",
                "guidedFixPrompt": "Type 0xa9059cbb"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "EIP-1559 Dynamic Gas Fees: BaseFee & PriorityFee (Miner Tip)",
    "overviewMetaphor": "EIP-1559 is a restaurant bill with a mandatory food charge plus an optional waiter tip: under the old First-Price Auction (Legacy), users wildly overpaid gas hoping miners would pick their transactions; under EIP-1559, the blockchain dynamically sets a mandatory Base Fee burned by the network (Deflationary burn!); users add a small Priority Fee (Tip) directly to the validator (e.g. 2 Gwei) to ensure instant block inclusion.",
    "blocks": [
      {
        "id": "chain-d24-b1-eip1559-type2-transactions",
        "day": 24,
        "blockNumber": 1,
        "title": "EIP-1559 Type-2 Transaction Architecture & The BaseFee Burn",
        "conceptBudget": {
          "primaryConcept": "EIP-1559 Type-2 Gas Architecture",
          "supportingTerms": [
            "Type-2 Transactions (`0x02` envelope)",
            "`BaseFee` (Protocol-mandated gas price per block, 100% BURNED!)",
            "`MaxPriorityFeePerGas` (Validator tip)",
            "`MaxFeePerGas` (Hard upper cap: `BaseFee + PriorityFee`)",
            "Effective Gas Price: $\\min(\\text{MaxFee}, \\text{BaseFee} + \\text{PriorityFee})$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d23-b1-json-rpc-wire-protocol",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "EIP-1559 Fee Decomposition",
              "boxes": [
                {
                  "label": "1. Base Fee (e.g. 30 Gwei)",
                  "value": "Mandatory base rate -> 100% BURNED permanently (Reduces ETH supply!)",
                  "varType": "Burned ETH",
                  "isUpdated": true
                },
                {
                  "label": "2. Priority Fee (e.g. 2 Gwei)",
                  "value": "Miner / Validator Tip -> Paid directly to block producer for fast inclusion",
                  "varType": "Validator Tip",
                  "isUpdated": false
                },
                {
                  "label": "3. Total Effective Fee",
                  "value": "30 + 2 = 32 Gwei total gas price paid by user",
                  "varType": "Effective Price",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "eip1559_math_demo.js",
            "initialCode": "function calculateEffectiveGasPrice(baseFeeGwei, maxPriorityGwei, maxFeeGwei) {\n  const effectiveTip = Math.min(maxPriorityGwei, maxFeeGwei - baseFeeGwei);\n  const effectivePrice = baseFeeGwei + effectiveTip;\n  return {\n    baseFeeGwei,\n    effectiveTipGwei: effectiveTip,\n    effectiveGasPriceGwei: effectivePrice,\n    refundGwei: maxFeeGwei - effectivePrice\n  };\n}\n\nconsole.log(JSON.stringify(calculateEffectiveGasPrice(30, 2, 50)));",
            "expectedOutput": "{\"baseFeeGwei\":30,\"effectiveTipGwei\":2,\"effectiveGasPriceGwei\":32,\"refundGwei\":18}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the effective gas price in Gwei when `baseFee = 30`, `maxPriority = 2`, and `maxFee = 50`?",
          "expectedStringOutput": "32",
          "acceptableAnswers": [
            "32",
            "32 Gwei",
            "effectiveGasPriceGwei\":32"
          ],
          "primaryMisconceptionId": "MC_CHAIN_TRANSACTION_GAS_ESTIMATION_EIP1559_NONCE",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_CHAIN_TRANSACTION_GAS_ESTIMATION_EIP1559_NONCE",
              "errorExplanation": "50 is max cap. Effective price is baseFee (30) + tip (2) = 32 Gwei.",
              "recoveryPath": {
                "simplerExplanation": "30 + 2 = 32 Gwei.",
                "guidedFixPrompt": "Type 32"
              }
            }
          }
        }
      },
      {
        "id": "chain-d24-b2-basefee-adjustment-elasticity",
        "day": 24,
        "blockNumber": 2,
        "title": "Block Elasticity & The 12.5% BaseFee Adjustment Formula",
        "conceptBudget": {
          "primaryConcept": "BaseFee Elasticity Mechanism",
          "supportingTerms": [
            "Target Gas per Block (15M gas)",
            "Max Gas per Block (30M gas = $2x$ target)",
            "Formula: $\\text{BaseFee}_{t+1} = \\text{BaseFee}_t \\times \\left(1 + \\frac{1}{8} \\cdot \\frac{\\text{GasUsed} - \\text{Target}}{\\text{Target}}\\right)$",
            "Max 12.5% price increase per consecutive full block"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d24-b1-eip1559-type2-transactions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "basefee_elasticity_demo.js",
            "initialCode": "function calculateNextBaseFee(currentBase, gasUsed, target = 15000000) {\n  const delta = (gasUsed - target) / target;\n  const change = currentBase * (delta * 0.125);\n  const nextBase = currentBase + change;\n  return {\n    currentBaseFeeGwei: currentBase,\n    gasUsed,\n    nextBaseFeeGwei: Number(nextBase.toFixed(2))\n  };\n}\n\nconsole.log('100% Full Block (30M gas):', JSON.stringify(calculateNextBaseFee(100, 30000000)));\nconsole.log('50% Target Block (15M gas):', JSON.stringify(calculateNextBaseFee(100, 15000000)));",
            "expectedOutput": "100% Full Block (30M gas): {\"currentBaseFeeGwei\":100,\"gasUsed\":30000000,\"nextBaseFeeGwei\":112.5}\n50% Target Block (15M gas): {\"currentBaseFeeGwei\":100,\"gasUsed\":15000000,\"nextBaseFeeGwei\":100}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the next block's BaseFee (in Gwei) when the current BaseFee is 100 Gwei and the block is 100% full (30M gas, +12.5% max increase)?",
          "expectedStringOutput": "112.5",
          "acceptableAnswers": [
            "112.5",
            "112.5 Gwei",
            "nextBaseFeeGwei\":112.5"
          ],
          "primaryMisconceptionId": "MC_CHAIN_TRANSACTION_GAS_ESTIMATION_EIP1559_NONCE",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_CHAIN_TRANSACTION_GAS_ESTIMATION_EIP1559_NONCE",
              "errorExplanation": "Max baseFee increase per block is strictly capped at +12.5% -> 112.5 Gwei.",
              "recoveryPath": {
                "simplerExplanation": "100 * 1.125 = 112.5.",
                "guidedFixPrompt": "Type 112.5"
              }
            }
          }
        }
      },
      {
        "id": "chain-d24-b3-gas-estimation-and-speedup-cancel",
        "day": 24,
        "blockNumber": 3,
        "title": "Transaction Speedup (`Replacement Underpriced`) & Cancellations",
        "conceptBudget": {
          "primaryConcept": "Transaction Speedup & Replacement",
          "supportingTerms": [
            "Pending Nonce Stuck Hazard (Low gas transaction stuck in mempool for hours)",
            "Replacement Rule (Must increase `PriorityFee` by at least $+10\\%$ with exact same Nonce!)",
            "Transaction Cancellation (Sending a 0 ETH transfer to yourself with matching Nonce and $+10\\%$ gas)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d24-b2-basefee-adjustment-elasticity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tx_speedup_demo.js",
            "initialCode": "function evaluateReplacementGas(oldTipGwei, newTipGwei) {\n  const minRequired = oldTipGwei * 1.10;\n  const isAccepted = newTipGwei >= minRequired;\n  return {\n    oldTipGwei,\n    newTipGwei,\n    minRequiredTipGwei: Number(minRequired.toFixed(2)),\n    status: isAccepted ? 'REPLACEMENT_TRANSACTION_BROADCAST_SUCCESS' : 'ERROR_REPLACEMENT_TRANSACTION_UNDERPRICED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateReplacementGas(10, 11.5))); // 15% boost -> Accepted\nconsole.log(JSON.stringify(evaluateReplacementGas(10, 10.5))); // 5% boost -> Underpriced error",
            "expectedOutput": "{\"oldTipGwei\":10,\"newTipGwei\":11.5,\"minRequiredTipGwei\":11,\"status\":\"REPLACEMENT_TRANSACTION_BROADCAST_SUCCESS\"}\n{\"oldTipGwei\":10,\"newTipGwei\":10.5,\"minRequiredTipGwei\":11,\"status\":\"ERROR_REPLACEMENT_TRANSACTION_UNDERPRICED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How do you cancel or speed up a transaction that is stuck in the Ethereum mempool?",
          "options": [
            "Broadcast a new transaction with the exact same Nonce but with a Priority Fee that is at least 10% higher, replacing the old transaction in validator mempools",
            "Call customer service",
            "Delete your MetaMask wallet"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_TRANSACTION_GAS_ESTIMATION_EIP1559_NONCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_TRANSACTION_GAS_ESTIMATION_EIP1559_NONCE",
              "errorExplanation": "Reusing the same nonce with +10% higher gas replaces the stuck transaction.",
              "recoveryPath": {
                "simplerExplanation": "Same nonce + 10% higher gas replaces the stuck tx.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Event Indexing & Subgraphs with The Graph Protocol",
    "overviewMetaphor": "The Graph Protocol is Google Search for Smart Contract Events: querying a raw blockchain node for \"All Uniswap swaps by Alice in 2025\" requires scanning 50,000,000 blocks one by one (Takes 12 hours!); The Graph Protocol runs indexer nodes listening to smart contract `emit Transfer()` events in real-time, structuring them into a fast PostgreSQL database accessible via lightning-fast GraphQL queries (`query { transfers(where: { from: '0xAlice' }) { id, amount } }`) in 10 milliseconds.",
    "blocks": [
      {
        "id": "chain-d25-b1-solidity-events-and-bloom-filters",
        "day": 25,
        "blockNumber": 1,
        "title": "Solidity Events, `indexed` Topics & Bloom Filter Logs",
        "conceptBudget": {
          "primaryConcept": "Solidity Events & Topics",
          "supportingTerms": [
            "`event Transfer(address indexed from, address indexed to, uint256 value)`",
            "Topics: `topic[0]` (Keccak hash of event signature); `topic[1..3]` (Up to 3 `indexed` parameters for $O(1)$ Bloom filter filtering)",
            "Data field: Unindexed parameters encoded in log data",
            "Zero Storage Gas (Events are logged, NOT stored in contract state!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d11-b1-function-visibility-and-mutability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Solidity Event Log Anatomy",
              "boxes": [
                {
                  "label": "Topic 0",
                  "value": "keccak256('Transfer(address,address,uint256)') -> Identifies event signature",
                  "varType": "Event Sig",
                  "isUpdated": false
                },
                {
                  "label": "Topic 1 (Indexed)",
                  "value": "32-byte padded 'from' address (Enables instant lookup by sender)",
                  "varType": "Sender Topic",
                  "isUpdated": false
                },
                {
                  "label": "Topic 2 (Indexed)",
                  "value": "32-byte padded 'to' address (Enables instant lookup by recipient)",
                  "varType": "Recipient Topic",
                  "isUpdated": false
                },
                {
                  "label": "Data (Unindexed)",
                  "value": "256-bit uint256 token amount (Stored in log data payload)",
                  "varType": "Data Payload",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "event_topics_demo.js",
            "initialCode": "function evaluateEventGas(isStoredInState) {\n  return isStoredInState\n    ? 'STORAGE_VARIABLE: SSTORE_20000_GAS (Expensive persistent state)'\n    : 'EVENT_LOG_EMISSION: LOG3_1500_GAS (Cheap indexed log history)';\n}\n\nconsole.log(evaluateEventGas(false));\nconsole.log(evaluateEventGas(true));",
            "expectedOutput": "EVENT_LOG_EMISSION: LOG3_1500_GAS (Cheap indexed log history)\nSTORAGE_VARIABLE: SSTORE_20000_GAS (Expensive persistent state)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many maximum `indexed` topic parameters can be declared in a single Solidity event?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 topics",
            "up to 3"
          ],
          "primaryMisconceptionId": "MC_CHAIN_EVENT_INDEXING_GRAPH_PROTOCOL_SUBGRAPHS",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_CHAIN_EVENT_INDEXING_GRAPH_PROTOCOL_SUBGRAPHS",
              "errorExplanation": "Solidity limits indexed parameters to 3 (plus topic 0 for event signature = 4 total).",
              "recoveryPath": {
                "simplerExplanation": "Max 3 indexed parameters.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "chain-d25-b2-subgraph-manifest-and-mappings",
        "day": 25,
        "blockNumber": 2,
        "title": "The Graph: Manifest (`subgraph.yaml`), Schema & AssemblyScript Mappings",
        "conceptBudget": {
          "primaryConcept": "The Graph Subgraph Architecture",
          "supportingTerms": [
            "`subgraph.yaml` (Defines target contracts, networks, and event handlers)",
            "`schema.graphql` (Defines entity schemas: `@entity`)",
            "Mapping Handlers (AssemblyScript functions: `handleTransfer(event: Transfer): void`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d25-b1-solidity-events-and-bloom-filters",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Subgraph AssemblyScript Mapping Handler",
            "codeSnippet": "export function handleTransfer(event: TransferEvent): void {\n  let id = event.params.from.toHexString() + '-' + event.params.to.toHexString();\n  let transfer = new Transfer(id);\n  transfer.from = event.params.from;\n  transfer.to = event.params.to;\n  transfer.value = event.params.value;\n  transfer.blockNumber = event.block.number;\n  transfer.save(); // Commits entity to indexed PostgreSQL database!\n}",
            "lineNotes": {
              "2": "Unique entity ID.",
              "8": "Saves entity for sub-second GraphQL queries."
            }
          },
          {
            "type": "runnable_code",
            "filename": "subgraph_sim.js",
            "initialCode": "function evaluateGraphQuerySpeed(isIndexedBySubgraph) {\n  return isIndexedBySubgraph\n    ? 'SUBGRAPH_GRAPHQL_QUERY: 15ms LATENCY (Indexed PostgreSQL)'\n    : 'RAW_RPC_FULL_SCAN: 45000ms LATENCY (Scanning 10M blocks sequentially)';\n}\n\nconsole.log(evaluateGraphQuerySpeed(true));\nconsole.log(evaluateGraphQuerySpeed(false));",
            "expectedOutput": "SUBGRAPH_GRAPHQL_QUERY: 15ms LATENCY (Indexed PostgreSQL)\nRAW_RPC_FULL_SCAN: 45000ms LATENCY (Scanning 10M blocks sequentially)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do production Web3 frontends query Subgraphs rather than making direct RPC calls to scan blockchain event logs?",
          "options": [
            "Because Subgraphs index and structure event data into a database ahead of time, allowing frontends to query complex filtered history in milliseconds via GraphQL without overloading RPC nodes",
            "Because RPC nodes delete past transactions",
            "To hide user transactions"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_EVENT_INDEXING_GRAPH_PROTOCOL_SUBGRAPHS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_EVENT_INDEXING_GRAPH_PROTOCOL_SUBGRAPHS",
              "errorExplanation": "Subgraphs pre-index blockchain events into relational tables for high-speed queries.",
              "recoveryPath": {
                "simplerExplanation": "Pre-indexes events for fast GraphQL querying.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d25-b3-graphql-queries-pagination",
        "day": 25,
        "blockNumber": 3,
        "title": "GraphQL Queries, Filtering & Cursor-Based Pagination",
        "conceptBudget": {
          "primaryConcept": "GraphQL Subgraph Querying",
          "supportingTerms": [
            "GraphQL Query Syntax (`query { tokens(first: 10, orderBy: totalVolumeUSD, orderDirection: desc) { id, name } }`)",
            "Filtering (`where: { value_gt: '1000' }`)",
            "Cursor pagination using `id_gt`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d25-b2-subgraph-manifest-and-mappings",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "graphql_query_demo.js",
            "initialCode": "function buildGraphQuery(entity, filterField, filterVal, limit = 10) {\n  return `{\\n  ${entity}(first: ${limit}, where: { ${filterField}: \"${filterVal}\" }) {\\n    id\\n    amount\\n  }\\n}`;\n}\n\nconsole.log(buildGraphQuery('transfers', 'from', '0xAlice', 5));",
            "expectedOutput": "{\n  transfers(first: 5, where: { from: \"0xAlice\" }) {\n    id\n    amount\n  }\n}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What GraphQL keyword specifies the maximum number of items returned in a Subgraph query list?",
          "expectedStringOutput": "first",
          "acceptableAnswers": [
            "first",
            "first: 10",
            "first keyword"
          ],
          "primaryMisconceptionId": "MC_CHAIN_EVENT_INDEXING_GRAPH_PROTOCOL_SUBGRAPHS",
          "diagnosisMap": {
            "limit": {
              "misconceptionId": "MC_CHAIN_EVENT_INDEXING_GRAPH_PROTOCOL_SUBGRAPHS",
              "errorExplanation": "The Graph uses GraphQL 'first: N' instead of SQL 'LIMIT N'.",
              "recoveryPath": {
                "simplerExplanation": "The Graph uses 'first' for limit.",
                "guidedFixPrompt": "Type first"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Layer 2 Rollups: Optimistic vs ZK-Rollups (SNARKs/STARKs)",
    "overviewMetaphor": "Layer 2 Rollups are a compressed ZIP archive of transactions sent to the Supreme Court (Ethereum Layer 1): instead of executing 1,000 separate transactions directly on Ethereum L1 ($50 each = $50,000 gas!), an L2 Sequencer executes all 1,000 transactions off-chain, compresses the signatures and state diffs into 1 single data payload (Calldata / Blobs), and posts it to L1 for $50 total (Dividing gas cost by 1,000x = $0.05 per transfer!).",
    "blocks": [
      {
        "id": "chain-d26-b1-optimistic-rollups-fraud-proofs",
        "day": 26,
        "blockNumber": 1,
        "title": "Optimistic Rollups (Arbitrum, Optimism): Fraud Proofs & 7-Day Challenge Window",
        "conceptBudget": {
          "primaryConcept": "Optimistic Rollup Mechanics",
          "supportingTerms": [
            "Optimistic Execution (Assume all sequencer state roots are valid without computing upfront proofs)",
            "7-Day Fraud Proof Challenge Window (Any challenger can submit a multi-round interactive fraud proof on L1 to overturn invalid states and slash the sequencer)",
            "Bridge Withdrawal Delays"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d8-b1-evm-memory-regions-triad",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Optimistic Rollup Fraud Proof Lifecycle",
              "nodes": [
                {
                  "id": "1",
                  "label": "Sequencer batches 1,000 txs -> Posts state root to L1",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "7-Day Challenge Window opens -> Verifiers monitor state diffs",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Malicious state detected? -> Challenger submits interactive bisection proof on L1",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "L1 EVM runs single disputed instruction -> Slashes malicious sequencer and reverts state!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "optimistic_rollup_demo.js",
            "initialCode": "function evaluateOptimisticWithdrawal(elapsedSeconds) {\n  const sevenDaysSec = 7 * 86400; // 604,800 seconds\n  const isReady = elapsedSeconds >= sevenDaysSec;\n  return {\n    elapsedHours: (elapsedSeconds / 3600).toFixed(1),\n    challengeWindowComplete: isReady,\n    status: isReady ? 'L1_NATIVE_BRIDGE_WITHDRAWAL_FINALIZED' : 'AWAITING_7_DAY_FRAUD_PROOF_WINDOW'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateOptimisticWithdrawal(604801))); // 7 days + 1 sec",
            "expectedOutput": "{\"elapsedHours\":\"168.0\",\"challengeWindowComplete\":true,\"status\":\"L1_NATIVE_BRIDGE_WITHDRAWAL_FINALIZED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard dispute challenge window duration (in days) required before native bridge withdrawals finalize on Optimistic Rollups?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "7 days",
            "7 Days"
          ],
          "primaryMisconceptionId": "MC_CHAIN_LAYER2_ROLLUPS_OPTIMISTIC_FRAUD_PROOF_ZK_SNARK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_LAYER2_ROLLUPS_OPTIMISTIC_FRAUD_PROOF_ZK_SNARK",
              "errorExplanation": "Optimistic rollups enforce a 7-day challenge window for fraud proof security.",
              "recoveryPath": {
                "simplerExplanation": "Standard challenge window is 7 days.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      },
      {
        "id": "chain-d26-b2-zk-rollups-validity-proofs",
        "day": 26,
        "blockNumber": 2,
        "title": "ZK-Rollups (zkSync, Starknet): Validity Proofs (SNARKs/STARKs) & Instant Finality",
        "conceptBudget": {
          "primaryConcept": "ZK-Rollup Validity Proofs",
          "supportingTerms": [
            "Zero-Knowledge Validity Proofs (ZK-SNARK / ZK-STARK)",
            "Mathematical Finality Guarantee (Zero dispute windows; proof verified cryptographically on L1 in milliseconds)",
            "Off-chain computation + On-chain polynomial proof verification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d26-b1-optimistic-rollups-fraud-proofs",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Optimistic vs ZK-Rollup Comparison",
              "boxes": [
                {
                  "label": "1. Optimistic Rollup (Arbitrum)",
                  "value": "Security: Fraud Proofs | L1 Verification: Only on dispute | Withdrawal: 7 DAYS DELAY",
                  "varType": "Optimistic L2",
                  "isUpdated": false
                },
                {
                  "label": "2. ZK-Rollup (zkSync / Starknet)",
                  "value": "Security: Math Validity Proofs | L1 Verification: Every batch | Withdrawal: INSTANT (Minutes!)",
                  "varType": "ZK-Rollup L2",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "zk_rollup_demo.js",
            "initialCode": "function evaluateRollupType(type) {\n  return (type === 'ZK_ROLLUP')\n    ? { type, proofType: 'VALIDITY_SNARK', finalityDelay: 'INSTANT_ON_L1_VERIFICATION (Minutes)', fraudWindow: 'NONE' }\n    : { type, proofType: 'FRAUD_PROOF', finalityDelay: '7_DAYS_DELAY', fraudWindow: '7_DAYS' };\n}\n\nconsole.log(JSON.stringify(evaluateRollupType('ZK_ROLLUP')));",
            "expectedOutput": "{\"type\":\"ZK_ROLLUP\",\"proofType\":\"VALIDITY_SNARK\",\"finalityDelay\":\"INSTANT_ON_L1_VERIFICATION (Minutes)\",\"fraudWindow\":\"NONE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do ZK-Rollups offer instant L1 finality without a 7-day challenge window?",
          "options": [
            "Because ZK-Rollups generate a cryptographic Zero-Knowledge Validity Proof for every batch; once verified by the L1 smart contract, state transitions are mathematically proven correct with zero possibility of fraud",
            "Because ZK-Rollups have no smart contracts",
            "Because Ethereum trusts zkSync automatically"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_LAYER2_ROLLUPS_OPTIMISTIC_FRAUD_PROOF_ZK_SNARK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_LAYER2_ROLLUPS_OPTIMISTIC_FRAUD_PROOF_ZK_SNARK",
              "errorExplanation": "Validity proofs mathematically guarantee correctness on L1 without dispute delays.",
              "recoveryPath": {
                "simplerExplanation": "Validity proofs provide instant cryptographic proof of correctness.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d26-b3-eip4844-proto-danksharding-blobs",
        "day": 26,
        "blockNumber": 3,
        "title": "EIP-4844 Proto-Danksharding: Transient Data Blobs",
        "conceptBudget": {
          "primaryConcept": "EIP-4844 Data Blobs",
          "supportingTerms": [
            "Blob-Carrying Transactions (`0x03` type)",
            "Transient Storage (Blobs pruned after ~18 days, zero permanent state bloat)",
            "KZG Polynomial Commitments",
            "95% L2 gas fee reduction"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d26-b2-zk-rollups-validity-proofs",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "blob_gas_demo.js",
            "initialCode": "function evaluateBlobSavings(calldataCostUsd, blobCostUsd) {\n  const savingsRatio = calldataCostUsd / blobCostUsd;\n  return {\n    calldataCostUsd,\n    blobCostUsd,\n    feeReductionRatio: `${savingsRatio.toFixed(0)}x CHEAPER`,\n    status: 'EIP4844_BLOB_GAS_OPTIMIZED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBlobSavings(1.50, 0.03))); // $1.50 down to 3 cents!",
            "expectedOutput": "{\"calldataCostUsd\":1.5,\"blobCostUsd\":0.03,\"feeReductionRatio\":\"50x CHEAPER\",\"status\":\"EIP4844_BLOB_GAS_OPTIMIZED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms transaction optimization using EIP-4844 ephemeral data blobs?",
          "expectedStringOutput": "EIP4844_BLOB_GAS_OPTIMIZED",
          "acceptableAnswers": [
            "EIP4844_BLOB_GAS_OPTIMIZED",
            "status\":\"EIP4844_BLOB_GAS_OPTIMIZED\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_LAYER2_ROLLUPS_OPTIMISTIC_FRAUD_PROOF_ZK_SNARK",
          "diagnosisMap": {
            "STANDARD": {
              "misconceptionId": "MC_CHAIN_LAYER2_ROLLUPS_OPTIMISTIC_FRAUD_PROOF_ZK_SNARK",
              "errorExplanation": "Matches EIP4844_BLOB_GAS_OPTIMIZED.",
              "recoveryPath": {
                "simplerExplanation": "Matches EIP4844_BLOB_GAS_OPTIMIZED.",
                "guidedFixPrompt": "Type EIP4844_BLOB_GAS_OPTIMIZED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Account Abstraction (ERC-4337): Smart Accounts & Paymasters",
    "overviewMetaphor": "Account Abstraction (ERC-4337) turns every crypto wallet into a programmable smart smartphone: instead of rigid EOA wallets bound to fragile 12-word seed phrases, your wallet is a Smart Contract Account; a Paymaster can sponsor your gas fees (Gasless Web3 onboarding!); you can sign transactions with Apple FaceID / Passkeys (WebAuthn); and social recovery allows trusted friends or family to reset your account if you lose your phone.",
    "blocks": [
      {
        "id": "chain-d27-b1-erc4337-user-operation-architecture",
        "day": 27,
        "blockNumber": 1,
        "title": "The ERC-4337 Architecture: `UserOperation`, Bundlers & `EntryPoint`",
        "conceptBudget": {
          "primaryConcept": "ERC-4337 Architecture",
          "supportingTerms": [
            "`UserOperation` (Higher-level pseudo-transaction object in alternative mempool)",
            "Bundler (Node that packages UserOps into standard L1 transactions)",
            "The Global `EntryPoint.sol` Contract (Single verified entry point for all smart accounts)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d7-b2-ethereum-account-trie-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "ERC-4337 Account Abstraction Workflow",
              "nodes": [
                {
                  "id": "1",
                  "label": "User creates signed UserOperation (Passkey / Session Key)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Bundler picks UserOp from Alt Mempool -> Simulates validation",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Bundler sends bundle to EntryPoint.handleOps()",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "EntryPoint executes User Account logic & Paymaster gas sponsorship!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "syntax_anatomy",
            "title": "UserOperation Struct Schema",
            "codeSnippet": "struct UserOperation {\n  address sender; // Smart Account address\n  uint256 nonce;\n  bytes initCode; // Deploys account if not yet created!\n  bytes callData;\n  uint256 callGasLimit;\n  uint256 verificationGasLimit;\n  uint256 preVerificationGas;\n  uint256 maxFeePerGas;\n  uint256 maxPriorityFeePerGas;\n  bytes paymasterAndData; // Gas sponsorship data\n  bytes signature; // Arbitrary signature (e.g. WebAuthn FaceID)\n}",
            "lineNotes": {
              "4": "Counterfactual deployment: deploys smart contract account on very first user operation.",
              "11": "Allows arbitrary cryptographic signatures beyond ECDSA."
            }
          },
          {
            "type": "runnable_code",
            "filename": "user_op_demo.js",
            "initialCode": "function evaluateUserOp(op) {\n  const hasPaymaster = op.paymasterAndData && op.paymasterAndData !== '0x';\n  return {\n    account: op.sender,\n    isGasSponsored: hasPaymaster,\n    status: hasPaymaster ? 'GASLESS_USER_EXPERIENCE_SPONSORED' : 'SELF_FUNDED_GAS_OP'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateUserOp({ sender: '0xSmartAcc', paymasterAndData: '0xPaymaster123' })));",
            "expectedOutput": "{\"account\":\"0xSmartAcc\",\"isGasSponsored\":true,\"status\":\"GASLESS_USER_EXPERIENCE_SPONSORED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What user experience status is achieved when a UserOperation includes valid `paymasterAndData` sponsorship?",
          "expectedStringOutput": "GASLESS_USER_EXPERIENCE_SPONSORED",
          "acceptableAnswers": [
            "GASLESS_USER_EXPERIENCE_SPONSORED",
            "status\":\"GASLESS_USER_EXPERIENCE_SPONSORED\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_ACCOUNT_ABSTRACTION_ERC4337_BUNDLER_PAYMASTER",
          "diagnosisMap": {
            "SELF_FUNDED": {
              "misconceptionId": "MC_CHAIN_ACCOUNT_ABSTRACTION_ERC4337_BUNDLER_PAYMASTER",
              "errorExplanation": "Paymaster data activates GASLESS_USER_EXPERIENCE_SPONSORED.",
              "recoveryPath": {
                "simplerExplanation": "Activates GASLESS_USER_EXPERIENCE_SPONSORED.",
                "guidedFixPrompt": "Type GASLESS_USER_EXPERIENCE_SPONSORED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d27-b2-paymasters-and-gas-sponsorship",
        "day": 27,
        "blockNumber": 2,
        "title": "Paymasters: Gasless dApps & Paying Gas in ERC-20 Tokens (USDC)",
        "conceptBudget": {
          "primaryConcept": "Paymaster Gas Sponsorship",
          "supportingTerms": [
            "`validatePaymasterUserOp` (Paymaster verifies sponsorship criteria)",
            "Gasless Onboarding (dApp pays gas for users to play game or mint NFT)",
            "ERC-20 Gas Payments (Paymaster swaps user's USDC to cover ETH gas)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d27-b1-erc4337-user-operation-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "paymaster_demo.js",
            "initialCode": "function evaluatePaymasterFee(gasEthCost, userUsdcBalance, ethPriceUsd = 2000) {\n  const usdCost = gasEthCost * ethPriceUsd;\n  const hasEnoughUsdc = userUsdcBalance >= usdCost;\n  return {\n    gasCostUsd: usdCost,\n    userUsdcBalance,\n    approved: hasEnoughUsdc,\n    status: hasEnoughUsdc ? 'GAS_PAID_WITH_USDC_SUCCESS' : 'INSUFFICIENT_USDC_FOR_GAS'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePaymasterFee(0.001, 10.0, 2000))); // $2 gas, $10 balance",
            "expectedOutput": "{\"gasCostUsd\":2,\"userUsdcBalance\":10,\"approved\":true,\"status\":\"GAS_PAID_WITH_USDC_SUCCESS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How do ERC-4337 Paymasters enable users to transact on Ethereum without holding any ETH in their wallet?",
          "options": [
            "The Paymaster smart contract deposits ETH into EntryPoint to pay the blockchain gas fee, while either sponsoring the fee for free or deducting an equivalent amount of USDC/ERC-20 from the user's smart account",
            "By hacking validator nodes",
            "By disabling Ethereum gas metering"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_ACCOUNT_ABSTRACTION_ERC4337_BUNDLER_PAYMASTER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_ACCOUNT_ABSTRACTION_ERC4337_BUNDLER_PAYMASTER",
              "errorExplanation": "Paymasters front ETH to EntryPoint and collect USDC or sponsor the transaction.",
              "recoveryPath": {
                "simplerExplanation": "Fronts ETH gas and accepts ERC-20 or sponsors costs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d27-b3-passkeys-and-social-recovery",
        "day": 27,
        "blockNumber": 3,
        "title": "Passkeys (WebAuthn), Session Keys & Social Recovery Guardians",
        "conceptBudget": {
          "primaryConcept": "Smart Account Innovations",
          "supportingTerms": [
            "WebAuthn / Passkeys (`secp256r1` signature validation in smart contracts)",
            "Session Keys (Pre-authorizing a game to spend up to 5 USDC for 2 hours with 0 popups)",
            "Social Recovery Guardians ($M$-of-$N$ guardian approval to reset owner key)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d27-b2-paymasters-and-gas-sponsorship",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "social_recovery_demo.js",
            "initialCode": "function evaluateRecovery(guardianVotes, totalGuardians, threshold = 3) {\n  const isApproved = guardianVotes >= threshold;\n  return {\n    guardianVotes,\n    thresholdRequired: threshold,\n    recoveryApproved: isApproved,\n    status: isApproved ? 'ACCOUNT_KEY_RESET_SUCCESSFUL' : 'AWAITING_GUARDIAN_CONSENT'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateRecovery(3, 5, 3))); // 3 of 5 guardians vote",
            "expectedOutput": "{\"guardianVotes\":3,\"thresholdRequired\":3,\"recoveryApproved\":true,\"status\":\"ACCOUNT_KEY_RESET_SUCCESSFUL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms successful account key reset when 3 of 5 guardians vote to recover a smart account?",
          "expectedStringOutput": "ACCOUNT_KEY_RESET_SUCCESSFUL",
          "acceptableAnswers": [
            "ACCOUNT_KEY_RESET_SUCCESSFUL",
            "status\":\"ACCOUNT_KEY_RESET_SUCCESSFUL\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_ACCOUNT_ABSTRACTION_ERC4337_BUNDLER_PAYMASTER",
          "diagnosisMap": {
            "AWAITING": {
              "misconceptionId": "MC_CHAIN_ACCOUNT_ABSTRACTION_ERC4337_BUNDLER_PAYMASTER",
              "errorExplanation": "3 votes reaches threshold, returning ACCOUNT_KEY_RESET_SUCCESSFUL.",
              "recoveryPath": {
                "simplerExplanation": "Reaches threshold -> ACCOUNT_KEY_RESET_SUCCESSFUL.",
                "guidedFixPrompt": "Type ACCOUNT_KEY_RESET_SUCCESSFUL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Cross-Chain Bridges & Arbitrary Messaging Protocols",
    "overviewMetaphor": "A Cross-Chain Bridge is a secure international currency vault between two foreign islands (Ethereum and Arbitrum): when you move $1,000 from Ethereum to Arbitrum, the bridge locks your $1,000 in a steel vault on Island A; the bridge notarizes the lock with a cryptographic message packet; on Island B, the bridge contract mints $1,000 of wrapped tokens; when returning, Island B burns the tokens, unlocking the original $1,000 on Island A.",
    "blocks": [
      {
        "id": "chain-d28-b1-lock-mint-vs-burn-mint-bridges",
        "day": 28,
        "blockNumber": 1,
        "title": "Bridge Architectures: Lock-and-Mint vs Burn-and-Mint",
        "conceptBudget": {
          "primaryConcept": "Cross-Chain Bridge Architectures",
          "supportingTerms": [
            "Lock-and-Mint (Lock native tokens on Source Chain $\\implies$ Mint wrapped token on Destination Chain)",
            "Burn-and-Mint (Burn wrapped token on Source $\\implies$ Unlock native token on Destination)",
            "Liquidity Pool Bridges (Rebalancing native liquidity pools across chains)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d13-b1-erc20-interface-methods",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Lock-and-Mint Cross-Chain Bridge Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "User calls bridge.deposit(100 ETH) on Ethereum L1",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "L1 Bridge Contract locks 100 ETH in Vault -> Emits DepositLock event",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Relayers / Oracle Network verify event -> Transmit signed cross-chain message to L2",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "L2 Bridge Contract invokes mint(User, 100 WETH) -> 100 WETH credited on L2!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bridge_lock_demo.js",
            "initialCode": "function executeBridgeDeposit(sourceVault, destMintLedger, user, amount) {\n  sourceVault.lockedTotal = (sourceVault.lockedTotal || 0) + amount;\n  destMintLedger[user] = (destMintLedger[user] || 0) + amount;\n  return {\n    user,\n    amountBridged: amount,\n    sourceVaultLockedTotal: sourceVault.lockedTotal,\n    destUserWrappedBalance: destMintLedger[user],\n    status: 'CROSS_CHAIN_ASSET_BRIDGED'\n  };\n}\n\nconst vault = {}; const dest = {};\nconsole.log(JSON.stringify(executeBridgeDeposit(vault, dest, '0xAlice', 50)));",
            "expectedOutput": "{\"user\":\"0xAlice\",\"amountBridged\":50,\"sourceVaultLockedTotal\":50,\"destUserWrappedBalance\":50,\"status\":\"CROSS_CHAIN_ASSET_BRIDGED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms successful cross-chain asset transfer via lock-and-mint bridge mechanics?",
          "expectedStringOutput": "CROSS_CHAIN_ASSET_BRIDGED",
          "acceptableAnswers": [
            "CROSS_CHAIN_ASSET_BRIDGED",
            "status\":\"CROSS_CHAIN_ASSET_BRIDGED\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_CROSS_CHAIN_BRIDGES_MESSAGE_PASSING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_CROSS_CHAIN_BRIDGES_MESSAGE_PASSING",
              "errorExplanation": "Matches CROSS_CHAIN_ASSET_BRIDGED.",
              "recoveryPath": {
                "simplerExplanation": "Matches CROSS_CHAIN_ASSET_BRIDGED.",
                "guidedFixPrompt": "Type CROSS_CHAIN_ASSET_BRIDGED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d28-b2-arbitrary-cross-chain-messaging",
        "day": 28,
        "blockNumber": 2,
        "title": "Arbitrary Cross-Chain Messaging: Chainlink CCIP & LayerZero",
        "conceptBudget": {
          "primaryConcept": "Arbitrary Cross-Chain Messaging",
          "supportingTerms": [
            "Cross-Chain Interoperability Protocol (Chainlink CCIP)",
            "LayerZero Omnichain Endpoints (`lzReceive`)",
            "Passing arbitrary calldata across different virtual machines"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d28-b1-lock-mint-vs-burn-mint-bridges",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ccip_message_demo.js",
            "initialCode": "function buildCcipMessage(destChainSelector, recipient, payload) {\n  return {\n    destinationChainSelector: destChainSelector,\n    receiver: recipient,\n    data: payload,\n    tokenAmounts: [],\n    feeToken: 'LINK',\n    status: 'CCIP_CROSS_CHAIN_MESSAGE_ENCODED'\n  };\n}\n\nconsole.log(JSON.stringify(buildCcipMessage('16015286601757825753', '0xDestContract', '0xa9059cbb...')));",
            "expectedOutput": "{\"destinationChainSelector\":\"16015286601757825753\",\"receiver\":\"0xDestContract\",\"data\":\"0xa9059cbb...\",\"tokenAmounts\":[],\"feeToken\":\"LINK\",\"status\":\"CCIP_CROSS_CHAIN_MESSAGE_ENCODED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary advantage of arbitrary messaging protocols (Chainlink CCIP / LayerZero) over basic token bridges?",
          "options": [
            "They allow smart contracts on Chain A to execute arbitrary function calls and governance decisions on Chain B in a single transaction, rather than just transferring token balances",
            "They make gas free on all chains",
            "They eliminate all validators"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_CROSS_CHAIN_BRIDGES_MESSAGE_PASSING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_CROSS_CHAIN_BRIDGES_MESSAGE_PASSING",
              "errorExplanation": "Arbitrary messaging allows executing smart contract logic and composability across chains.",
              "recoveryPath": {
                "simplerExplanation": "Enables cross-chain contract execution and logic calling.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d28-b3-bridge-hack-vulnerabilities-relayer-multisigs",
        "day": 28,
        "blockNumber": 3,
        "title": "Bridge Security Vulnerabilities: Relayer Multisigs & Validator Compromise",
        "conceptBudget": {
          "primaryConcept": "Bridge Security Vulnerabilities",
          "supportingTerms": [
            "Multisig Relayer Key Compromise (Ronin Bridge Hack $624M: 5 of 9 validator keys stolen)",
            "Fake Deposit Verification (Wormhole Bridge Hack $320M: forged guardian signature check)",
            "Defense: Optimistic challenge periods + Rate limits"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d28-b2-arbitrary-cross-chain-messaging",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bridge_rate_limit_demo.js",
            "initialCode": "function evaluateBridgeWithdrawal(requestedAmount, dailyRateLimit = 1000000) {\n  const isApproved = requestedAmount <= dailyRateLimit;\n  return {\n    requestedAmount,\n    dailyRateLimit,\n    status: isApproved ? 'WITHDRAWAL_APPROVED_WITHIN_RATE_LIMIT' : 'ALERT_RATE_LIMIT_EXCEEDED_TRANSACTION_PAUSED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBridgeWithdrawal(500000)));\nconsole.log(JSON.stringify(evaluateBridgeWithdrawal(5000000)));",
            "expectedOutput": "{\"requestedAmount\":500000,\"dailyRateLimit\":1000000,\"status\":\"WITHDRAWAL_APPROVED_WITHIN_RATE_LIMIT\"}\n{\"requestedAmount\":5000000,\"dailyRateLimit\":1000000,\"status\":\"ALERT_RATE_LIMIT_EXCEEDED_TRANSACTION_PAUSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security status is triggered when an anomalous $5,000,000 withdrawal exceeds a bridge's $1,000,000 daily rate limit?",
          "expectedStringOutput": "ALERT_RATE_LIMIT_EXCEEDED_TRANSACTION_PAUSED",
          "acceptableAnswers": [
            "ALERT_RATE_LIMIT_EXCEEDED_TRANSACTION_PAUSED",
            "status\":\"ALERT_RATE_LIMIT_EXCEEDED_TRANSACTION_PAUSED\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_CROSS_CHAIN_BRIDGES_MESSAGE_PASSING",
          "diagnosisMap": {
            "APPROVED": {
              "misconceptionId": "MC_CHAIN_CROSS_CHAIN_BRIDGES_MESSAGE_PASSING",
              "errorExplanation": "Exceeding rate limits triggers ALERT_RATE_LIMIT_EXCEEDED_TRANSACTION_PAUSED.",
              "recoveryPath": {
                "simplerExplanation": "Exceeding limit pauses transaction.",
                "guidedFixPrompt": "Type ALERT_RATE_LIMIT_EXCEEDED_TRANSACTION_PAUSED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "DAO Governance, Timelocks & Voting Mechanisms",
    "overviewMetaphor": "A DAO (Decentralized Autonomous Organization) is a direct democratic parliament written entirely in smart contracts: token holders submit legislative bills (Proposals); community members vote using their governance token balances; if the proposal reaches a 4% Quorum and passes with a majority, it enters a mandatory 48-hour Timelock; once the timelock expires, the smart contract automatically executes the proposal's bytecode instructions without any human politician or CEO involved.",
    "blocks": [
      {
        "id": "chain-d29-b1-openzeppelin-governor-lifecycle",
        "day": 29,
        "blockNumber": 1,
        "title": "The OpenZeppelin `Governor` Lifecycle: Propose $\\to$ Vote $\\to$ Queue $\\to$ Execute",
        "conceptBudget": {
          "primaryConcept": "Governor Contract Lifecycle",
          "supportingTerms": [
            "Proposal States (`Pending`, `Active`, `Canceled`, `Defeated`, `Succeeded`, `Queued`, `Expired`, `Executed`)",
            "Voting Delay (Time before voting starts)",
            "Voting Period (Voting window duration)",
            "Proposal Threshold (Minimum tokens required to submit proposal)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d17-b3-timelocks-and-multisig-governance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "OpenZeppelin Governor Proposal Lifecycle",
              "nodes": [
                {
                  "id": "1",
                  "label": "Propose: User with > 10,000 tokens submits proposal with target bytecode actions",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Voting Period: Community votes (For / Against / Abstain) over 7 days",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Queue: If quorum & majority met, proposal is queued in TimelockController",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Execute: Timelock delay passes -> Anyone calls execute() to trigger on-chain actions!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "governor_lifecycle_demo.js",
            "initialCode": "function evaluateProposalOutcome(votesFor, votesAgainst, quorumVotes) {\n  const totalVotes = votesFor + votesAgainst;\n  const quorumMet = totalVotes >= quorumVotes;\n  const majorityWon = votesFor > votesAgainst;\n  const passed = quorumMet && majorityWon;\n  return {\n    totalVotes,\n    quorumMet,\n    majorityWon,\n    status: passed ? 'PROPOSAL_SUCCEEDED_QUEUED_IN_TIMELOCK' : 'PROPOSAL_DEFEATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateProposalOutcome(60000, 20000, 50000))); // 80k > 50k quorum, 60k > 20k",
            "expectedOutput": "{\"totalVotes\":80000,\"quorumMet\":true,\"majorityWon\":true,\"status\":\"PROPOSAL_SUCCEEDED_QUEUED_IN_TIMELOCK\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state is reached when a proposal achieves 80,000 votes (exceeding 50,000 quorum) with 60,000 For votes vs 20,000 Against?",
          "expectedStringOutput": "PROPOSAL_SUCCEEDED_QUEUED_IN_TIMELOCK",
          "acceptableAnswers": [
            "PROPOSAL_SUCCEEDED_QUEUED_IN_TIMELOCK",
            "status\":\"PROPOSAL_SUCCEEDED_QUEUED_IN_TIMELOCK\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_GOVERNANCE_DAOS_VOTING_QUORUM_PROPOSALS",
          "diagnosisMap": {
            "DEFEATED": {
              "misconceptionId": "MC_CHAIN_GOVERNANCE_DAOS_VOTING_QUORUM_PROPOSALS",
              "errorExplanation": "Quorum and majority met transitions proposal to PROPOSAL_SUCCEEDED_QUEUED_IN_TIMELOCK.",
              "recoveryPath": {
                "simplerExplanation": "Passes quorum and majority -> PROPOSAL_SUCCEEDED_QUEUED_IN_TIMELOCK.",
                "guidedFixPrompt": "Type PROPOSAL_SUCCEEDED_QUEUED_IN_TIMELOCK"
              }
            }
          }
        }
      },
      {
        "id": "chain-d29-b2-erc20votes-checkpoints-historical-weight",
        "day": 29,
        "blockNumber": 2,
        "title": "Historical Voting Weight: `ERC20Votes` Checkpoints & Flash Loan Defenses",
        "conceptBudget": {
          "primaryConcept": "ERC20Votes Historical Checkpoints",
          "supportingTerms": [
            "Flash Loan Governance Attack (Borrowing $50M in flash loan to vote on a malicious proposal in 1 block and steal treasury!)",
            "`ERC20Votes` Checkpointing (Snapshots voting weight at proposal creation block `getPastVotes(account, blockNumber)`)",
            "Zero flash loan exploit vulnerability"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d29-b1-openzeppelin-governor-lifecycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Naive Balance Voting vs ERC20Votes Snapshot Diff",
              "brokenCode": "// ❌ VULNERABLE TO FLASH LOAN GOVERNANCE ATTACK:\nfunction getVotes(address user) external view returns (uint256) {\n  return token.balanceOf(user); // Attacker borrows 10M tokens via flash loan and votes instantly!\n}",
              "fixedCode": "// ✅ 100% FLASH LOAN RESISTANT (ERC20Votes Historical Checkpoint):\nfunction getVotes(address user, uint256 proposalSnapshotBlock) external view returns (uint256) {\n  return token.getPastVotes(user, proposalSnapshotBlock); // Queries balance at historical past block!\n}",
              "errorLine": 3,
              "errorReason": "Using real-time balance allows flash loans to borrow voting power and drain protocol treasuries in a single transaction.",
              "fixExplanation": "Use ERC20Votes getPastVotes() to query historical checkpointed balance at proposal creation block."
            }
          },
          {
            "type": "runnable_code",
            "filename": "governance_snapshot_demo.js",
            "initialCode": "function evaluateVotingPower(hasHistoricalSnapshot) {\n  return hasHistoricalSnapshot\n    ? 'IMMUNE_TO_FLASH_LOANS: VOTING_POWER_LOCKED_TO_HISTORICAL_BLOCK_SNAPSHOT'\n    : 'HIGH_EXPLOIT_RISK: REALTIME_BALANCE_CAN_BE_FLASH_LOANED';\n}\n\nconsole.log(evaluateVotingPower(true));\nconsole.log(evaluateVotingPower(false));",
            "expectedOutput": "IMMUNE_TO_FLASH_LOANS: VOTING_POWER_LOCKED_TO_HISTORICAL_BLOCK_SNAPSHOT\nHIGH_EXPLOIT_RISK: REALTIME_BALANCE_CAN_BE_FLASH_LOANED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does OpenZeppelin `ERC20Votes` check voting power at a historical block snapshot (`getPastVotes`) rather than current balance (`balanceOf`)?",
          "options": [
            "To completely prevent Flash Loan governance attacks, where a malicious actor borrows millions of tokens for a single transaction block to vote in favor of stealing the protocol's treasury",
            "Because balanceOf is deprecated",
            "To save memory"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_CHAIN_GOVERNANCE_DAOS_VOTING_QUORUM_PROPOSALS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_CHAIN_GOVERNANCE_DAOS_VOTING_QUORUM_PROPOSALS",
              "errorExplanation": "Historical snapshots prevent flash loans from borrowing voting power during active votes.",
              "recoveryPath": {
                "simplerExplanation": "Prevents flash loans from voting with borrowed tokens.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "chain-d29-b3-quadratic-voting-mechanisms",
        "day": 29,
        "blockNumber": 3,
        "title": "Quadratic Voting & Gitcoin Grants Sybil Defense",
        "conceptBudget": {
          "primaryConcept": "Quadratic Voting Mathematics",
          "supportingTerms": [
            "Quadratic Voting Formula: $\\text{Cost} = (\\text{Votes})^2 \\implies \\text{VotingPower} = \\sqrt{\\text{Tokens}}$",
            "Diminishing returns for wealthy plutocrats",
            "Sybil Attack vulnerability (Splitting tokens across 100 accounts requires Gitcoin Passport / WorldID proof of humanity)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d29-b2-erc20votes-checkpoints-historical-weight",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "quadratic_voting_demo.js",
            "initialCode": "function calculateQuadraticVotes(tokens) {\n  const votes = Math.sqrt(tokens);\n  return {\n    tokensSpent: tokens,\n    effectiveVotes: Number(votes.toFixed(2)),\n    costPerMarginalVote: `${(tokens / votes).toFixed(2)} tokens/vote`\n  };\n}\n\nconsole.log('100 Tokens:', JSON.stringify(calculateQuadraticVotes(100)));   // 10 votes\nconsole.log('10000 Tokens:', JSON.stringify(calculateQuadraticVotes(10000))); // 100 votes (100x tokens = only 10x votes!)",
            "expectedOutput": "100 Tokens: {\"tokensSpent\":100,\"effectiveVotes\":10,\"costPerMarginalVote\":\"10.00 tokens/vote\"}\n10000 Tokens: {\"tokensSpent\":10000,\"effectiveVotes\":100,\"costPerMarginalVote\":\"100.00 tokens/vote\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many effective votes are granted to a user spending 10,000 tokens under Quadratic Voting ($\\sqrt{10000}$)?",
          "expectedStringOutput": "100",
          "acceptableAnswers": [
            "100",
            "100 votes",
            "effectiveVotes\":100"
          ],
          "primaryMisconceptionId": "MC_CHAIN_GOVERNANCE_DAOS_VOTING_QUORUM_PROPOSALS",
          "diagnosisMap": {
            "10000": {
              "misconceptionId": "MC_CHAIN_GOVERNANCE_DAOS_VOTING_QUORUM_PROPOSALS",
              "errorExplanation": "Quadratic voting takes the square root: sqrt(10,000) = 100 votes.",
              "recoveryPath": {
                "simplerExplanation": "sqrt(10,000) = 100.",
                "guidedFixPrompt": "Type 100"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Decentralized Finance (DeFi) & Staking Ecosystem",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete decentralized Web3 enterprise architecture: 1. Deploy ERC-20 staking and governance tokens with historical snapshot voting (`ERC20Votes`); 2. Deploy Uniswap v2 constant product AMM liquidity pools; 3. Integrate Chainlink AggregatorV3 price feeds with heartbeat staleness guards; 4. Execute uncollateralized flash loans with atomic reentrancy-safe repayment; 5. Deploy UUPS upgradeable smart contract proxies with EIP-1967 storage layouts; 6. Connect Viem / Ethers.js JSON-RPC frontends with EIP-1559 dynamic gas estimation; 7. Verify zero security vulnerabilities repository-wide.",
    "blocks": [
      {
        "id": "chain-d30-b1-capstone-architecture-orchestration",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Web3 & DeFi Ecosystem Architecture",
        "conceptBudget": {
          "primaryConcept": "Enterprise Web3 Architecture",
          "supportingTerms": [
            "Solidity 0.8+ Security",
            "AMM Constant Product Engine",
            "Chainlink Oracle Integration",
            "ERC-4337 Account Abstraction",
            "UUPS Upgradeability"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d29-b1-openzeppelin-governor-lifecycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Enterprise Web3 DeFi Ecosystem Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Smart Accounts (ERC-4337) with Passkeys & Paymaster gas sponsorship",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "EIP-1559 Dynamic Gas Engine routes txs to L2 Rollups via EIP-4844 Blobs",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Uniswap AMM + Chainlink Oracle + Flash Loan lending vault execute trades",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "The Graph indexes event logs for Next.js/Viem frontends -> 100% Web3 Mastery!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_web3_sim.js",
            "initialCode": "function runCapstoneWeb3Ecosystem() {\n  return {\n    smartContractEngine: 'SOLIDITY_08_CEI_REENTRANCY_SECURE',\n    ammPools: 'UNISWAP_V2_CONSTANT_PRODUCT_ACTIVE',\n    oracleFeeds: 'CHAINLINK_AGGREGATOR_V3_FRESH',\n    l2RollupIntegration: 'EIP4844_BLOB_SCALED',\n    accountAbstraction: 'ERC4337_PAYMASTER_SPONSORED',\n    systemStatus: 'ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED'\n  };\n}\n\nconsole.log(runCapstoneWeb3Ecosystem().systemStatus);",
            "expectedOutput": "ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What system status string confirms certification of the Enterprise Web3 DeFi Ecosystem Capstone?",
          "expectedStringOutput": "ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED",
          "acceptableAnswers": [
            "ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED",
            "systemStatus: ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED"
          ],
          "primaryMisconceptionId": "MC_CHAIN_CAPSTONE_ENTERPRISE_DEFI_DEX_STAKING_ECOSYSTEM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_CAPSTONE_ENTERPRISE_DEFI_DEX_STAKING_ECOSYSTEM",
              "errorExplanation": "Matches ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Matches ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED.",
                "guidedFixPrompt": "Type ENTERPRISE_WEB3_DEFI_ECOSYSTEM_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d30-b2-capstone-security-audit-suite",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise Smart Contract Security Audit & Formal Verification",
        "conceptBudget": {
          "primaryConcept": "Smart Contract Formal Audit",
          "supportingTerms": [
            "Slither Static Analysis (Zero high/critical security warnings)",
            "Foundry Invariant Fuzzing (`echidna` / `forge test`)",
            "Formal Verification of state invariants"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d30-b1-capstone-architecture-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "formal_audit_demo.js",
            "initialCode": "function runSecurityAudit(reentrancySafe, overflowSafe, oracleFresh, accessControlValid) {\n  const passed = reentrancySafe && overflowSafe && oracleFresh && accessControlValid;\n  return {\n    reentrancyProtected: reentrancySafe,\n    arithmeticOverflowSafe: overflowSafe,\n    chainlinkOracleFresh: oracleFresh,\n    accessControlEnforced: accessControlValid,\n    auditGrade: passed ? 'GRADE_A_ENTERPRISE_SECURITY_CERTIFIED' : 'AUDIT_FAILED_SECURITY_DEFECTS'\n  };\n}\n\nconsole.log(JSON.stringify(runSecurityAudit(true, true, true, true)));",
            "expectedOutput": "{\"reentrancyProtected\":true,\"arithmeticOverflowSafe\":true,\"chainlinkOracleFresh\":true,\"accessControlEnforced\":true,\"auditGrade\":\"GRADE_A_ENTERPRISE_SECURITY_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded to an enterprise Web3 protocol with 100% verification across all security dimensions?",
          "expectedStringOutput": "GRADE_A_ENTERPRISE_SECURITY_CERTIFIED",
          "acceptableAnswers": [
            "GRADE_A_ENTERPRISE_SECURITY_CERTIFIED",
            "auditGrade\":\"GRADE_A_ENTERPRISE_SECURITY_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_CHAIN_CAPSTONE_ENTERPRISE_DEFI_DEX_STAKING_ECOSYSTEM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_CAPSTONE_ENTERPRISE_DEFI_DEX_STAKING_ECOSYSTEM",
              "errorExplanation": "All checks passed awards GRADE_A_ENTERPRISE_SECURITY_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Awards GRADE_A_ENTERPRISE_SECURITY_CERTIFIED.",
                "guidedFixPrompt": "Type GRADE_A_ENTERPRISE_SECURITY_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "chain-d30-b3-day30-final-capstone-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "Day 30 Final Capstone Graduation & Web3 Engineer Certification",
        "conceptBudget": {
          "primaryConcept": "Day 30 Capstone Graduation",
          "supportingTerms": [
            "PinIT Career OS Web3 Graduate",
            "Production Blockchain Engineer Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "chain-d30-b2-capstone-security-audit-suite",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "web3_graduation_cert.js",
            "initialCode": "console.log('🏆 PIN IT CAREER OS — BLOCKCHAIN, WEB3 & SMART CONTRACTS MASTERY [GRADUATED 100%]');",
            "expectedOutput": "🏆 PIN IT CAREER OS — BLOCKCHAIN, WEB3 & SMART CONTRACTS MASTERY [GRADUATED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What graduation string confirms complete mastery of Course 13: Blockchain, Web3 & Smart Contracts?",
          "expectedStringOutput": "🏆 PIN IT CAREER OS — BLOCKCHAIN, WEB3 & SMART CONTRACTS MASTERY [GRADUATED 100%]",
          "acceptableAnswers": [
            "🏆 PIN IT CAREER OS — BLOCKCHAIN, WEB3 & SMART CONTRACTS MASTERY [GRADUATED 100%]",
            "GRADUATED 100%"
          ],
          "primaryMisconceptionId": "MC_CHAIN_CAPSTONE_ENTERPRISE_DEFI_DEX_STAKING_ECOSYSTEM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_CHAIN_CAPSTONE_ENTERPRISE_DEFI_DEX_STAKING_ECOSYSTEM",
              "errorExplanation": "Matches graduation header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 PIN IT CAREER OS — BLOCKCHAIN, WEB3 & SMART CONTRACTS MASTERY [GRADUATED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];
