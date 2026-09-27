# Blockchain, Web3 & Smart Contracts — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Blockchain, Web3 & Smart Contracts (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 🪙 Course Overview
* **Name**: Blockchain, Web3 & Smart Contracts
* **ID**: `course-blockchain-web3`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Blockchain Developers / Smart Contract Auditors
* **Learning Interface**: Transactions blocks hashes, smart contract structures, gas metrics dashboards, and compilers logs.
* **Evaluation Sandbox**: Blockchain compilers checking transactions signatures, Merkle root tree hashes, gas limit parameters, Solidity modifiers, access control permissions, and reentrancy flows.

---

## 📅 Detailed Day-by-Day Syllabus

### 🪙 Week 1: Blockchain Foundations & Transaction Cryptography

#### 🟢 Day 1: Blockchain Architecture: Ledger Structures & Genesis Blocks
* **Lecture Syllabus**:
  - Ledger structure architectures (Bitcoin vs Ethereum)
  - Block header metadata and genesis parameter values
  - Hash pointer chains linkages
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Cryptographic Keys: Private Keys, Public Keys & ECDSA Signatures
* **Lecture Syllabus**:
  - Asymmetric key cryptography (ECDSA)
  - Generating private/public key pairs
  - Verifying transaction signature bytes formats
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: Hash Functions & Block Header Validation
* **Lecture Syllabus**:
  - Cryptographic hash functions (SHA-256)
  - Mining block difficulty parameters
  - Nonce and block header layouts
* **Coding Exam**: `blockchain-basics-exam-day-3` (`isValidBlockHash`)
  - **Task**: Write a JS function `isValidBlockHash(hash, difficultyDigits)` checking block hash prefixes.
  - **Test**: `isValidBlockHash('0000abc123', 4) === true`.
* **Coding Assignment**: `blockchain-basics-assign-day-3` (`getDifficultyPrefix`)
  - **Task**: Write a JS function `getDifficultyPrefix(digits)` generating difficulty prefix string zeros.
  - **Test**: Returns repeat string.

#### 🟢 Day 4: Transactions validation: Merkle Root Trees hash pointers
* **Lecture Syllabus**:
  - Transactions hash lists validation
  - Merkle tree structure hierarchy
  - Verifying Merkle Root signatures
* **Coding Exam**: `blockchain-basics-exam-day-4` (`getMerkleParent`)
  - **Task**: Write a JS function `getMerkleParent(leftHash, rightHash)` compounding two nodes.
  - **Test**: Returns concatenated hashes with a hyphen separator.
* **Coding Assignment**: `blockchain-basics-assign-day-4` (`isLeafFormatted`)
  - **Task**: Write a JS function `isLeafFormatted(hash)` checking hash formats.
  - **Test**: Enforces startsWith 0x and length 66 constraints.

#### 🟢 Day 5: Transactions signatures: ECDSA signature checkers
* **Lecture Syllabus**:
  - ECDSA signature validation workflows
  - Hashing transaction data structures
  - Decoding public key coordinate values
* **Coding Exam**: `blockchain-basics-exam-day-5` (`isTxSignatureValid`)
  - **Task**: Write a JS function `isTxSignatureValid(txHash, sig, pubKey)` checking signatures.
  - **Test**: Validates signature length checks.
* **Coding Assignment**: `blockchain-basics-assign-day-5` (`hasKeyPrefix`)
  - **Task**: Write a JS function `hasKeyPrefix(pubKey)` checking key prefix flags.
  - **Test**: Confirms true if startsWith 04.

#### 🟢 Day 6: Gas Limits & Ethereum EVM execution costs
* **Lecture Syllabus**:
  - Ethereum gas limits concepts
  - Gas fees calculations structures
  - Prioritizing high gas transactions
* **Coding Exam**: `blockchain-basics-exam-day-6` (`calculateGasFee`)
  - **Task**: Write a JS function `calculateGasFee(gasUsed, gasPriceGwei)` computing fee.
  - **Test**: Multiplies gas used by price bounds.
* **Coding Assignment**: `blockchain-basics-assign-day-6` (`isGasLimitAllowed`)
  - **Task**: Write a JS function `isGasLimitAllowed(gasLimit, maxAllowed)` checking limits.
  - **Test**: Compares limits.

#### 🟢 Day 7: JSON-RPC Protocols: Querying Ethereum node states
* **Lecture Syllabus**:
  - JSON-RPC API methods (eth_getBalance)
  - Formatting node request payloads
  - Parsing JSON response structures
* **Coding Exam**: `blockchain-basics-exam-day-7` (`buildRpcPayload`)
  - **Task**: Write a JS function `buildRpcPayload(method, params)` building RPC body.
  - **Test**: Serializes request payload objects.
* **Coding Assignment**: `blockchain-basics-assign-day-7` (`isRpcError`)
  - **Task**: Write a JS function `isRpcError(responseObj)` flagging query failures.
  - **Test**: Checks error property key existence.

---

### 🪙 Week 2: Solidity Fundamentals & ERC Token Standards

#### 🟢 Day 8: Solidity Data Models: Types, storage & variable scopes
* **Lecture Syllabus**:
  - Solidity data types structures
  - Storage vs Memory memory allocations
  - Variable visibility scope constraints
* **Coding Exam**: `blockchain-basics-exam-day-8` (`isVisibilityAllowed`)
  - **Task**: Write a JS function `isVisibilityAllowed(scope)` checking visibility strings.
  - **Test**: Restricts values to public, private, internal, or external.
* **Coding Assignment**: `blockchain-basics-assign-day-8` (`getStorageBytes`)
  - **Task**: Write a JS function `getStorageBytes(type)` mapping type names to storage sizes.
  - **Test**: Returns bytes sizes.

#### 🟢 Day 9: Solidity functions modifiers & requires guardrails
* **Lecture Syllabus**:
  - Solidity modifier wrappers syntax
  - Requirements validations checks (require)
  - Error exception rollbacks
* **Coding Exam**: `blockchain-basics-exam-day-9` (`verifySender`)
  - **Task**: Write a JS function `verifySender(sender, owner)` verifying sender ownership.
  - **Test**: Checks addresses match.
* **Coding Assignment**: `blockchain-basics-assign-day-9` (`isDepositAllowed`)
  - **Task**: Write a JS function `isDepositAllowed(value, limit)` checking limits.
  - **Test**: Restricts inputs.

#### 🟢 Day 10: ERC-20 Token Standards: Transfer methods
* **Lecture Syllabus**:
  - ERC-20 token interfaces parameters
  - Transfer and TransferFrom methods
  - Validating transfer parameters bounds
* **Coding Exam**: `blockchain-basics-exam-day-10` (`checkTransferAllowed`)
  - **Task**: Write a JS function `checkTransferAllowed(balance, amount)` checking transfers.
  - **Test**: Restricts transfers exceeding active balance.
* **Coding Assignment**: `blockchain-basics-assign-day-10` (`getTransferFee`)
  - **Task**: Write a JS function `getTransferFee(amount, feeRate)` calculating fees.
  - **Test**: Computes rounded scales.

#### 🟢 Day 11: ERC-20 Approvals & Allowances mapping
* **Lecture Syllabus**:
  - ERC-20 approve methods
  - Allowance mappings database schemas
  - Securing spender allowance limits
* **Coding Exam**: `blockchain-basics-exam-day-11` (`isAllowanceSufficient`)
  - **Task**: Write a JS function `isAllowanceSufficient(allowance, spend)` checking limits.
  - **Test**: Validates allowances ranges.
* **Coding Assignment**: `blockchain-basics-assign-day-11` (`getAllowanceLeft`)
  - **Task**: Write a JS function `getAllowanceLeft(allowance, spend)` finding remaining balances.
  - **Test**: Subtracts values.

#### 🟢 Day 12: ERC-721 Token Standards: Unique NFTs structures
* **Lecture Syllabus**:
  - ERC-721 token interfaces specifications
  - Unique token identifiers tracking
  - Token metadata descriptors mapping
* **Coding Exam**: `blockchain-basics-exam-day-12` (`isTokenOwner`)
  - **Task**: Write a JS function `isTokenOwner(owner, query)` verifying NFT ownership.
  - **Test**: Checks string match variables.
* **Coding Assignment**: `blockchain-basics-assign-day-12` (`isIpfsUri`)
  - **Task**: Write a JS function `isIpfsUri(tokenUri)` verifying IPFS structures.
  - **Test**: Confirms prefix startsWith 'ipfs://'.

#### 🟢 Day 13: Smart Contracts Compilation errors: Stack validation checks
* **Lecture Syllabus**:
  - Solidity compiler options
  - Parsing compiler errors logs
  - Resolving variables visibility warnings
* **Coding Exam**: `blockchain-basics-exam-day-13` (`hasCompilerErrors`)
  - **Task**: Write a JS function `hasCompilerErrors(buildLogs)` parsing compilation reports.
  - **Test**: Flags ParserError or TypeError strings presence.
* **Coding Assignment**: `blockchain-basics-assign-day-13` (`countWarnings`)
  - **Task**: Write a JS function `countWarnings(logs)` counting warnings.
  - **Test**: Returns warning count.

#### 🟢 Day 14: Smart Contracts Deployment parameters: Constructor args
* **Lecture Syllabus**:
  - Deploying compiled smart contracts
  - Formatting constructor parameters bytes
  - Verifying contract network addresses
* **Coding Exam**: `blockchain-basics-exam-day-14` (`isValidContractAddress`)
  - **Task**: Write a JS function `isValidContractAddress(addr)` verifying contract address structures.
  - **Test**: Checks startsWith 0x and length 42.
* **Coding Assignment**: `blockchain-basics-assign-day-14` (`isCodeHashPresent`)
  - **Task**: Write a JS function `isCodeHashPresent(codeHash)` checking code bounds.
  - **Test**: Checks length matches 66.

---

### 🪙 Week 3: Smart Contract Security & Vulnerability Remediations

#### 🟢 Day 15: Solidity Security: Reentrancy vulnerability detection
* **Lecture Syllabus**:
  - Reentrancy attack mechanisms
  - Evaluating withdraw execution paths
  - Checks-Effects-Interactions pattern rules
* **Coding Exam**: `blockchain-basics-exam-day-15` (`isStateUpdateOrderSafe`)
  - **Task**: Write a JS function `isStateUpdateOrderSafe(stateUpdateIndex, externalCallIndex)` enforcing Checks-Effects.
  - **Test**: Rejects states modifications placed after external calls.
* **Coding Assignment**: `blockchain-basics-assign-day-15` (`isCallValueAllowed`)
  - **Task**: Write a JS function `isCallValueAllowed(val, balance)` checking call values bounds.
  - **Test**: Prevents overflow.

#### 🟢 Day 16: Solidity Security: Arithmetic underflow & overflow rules
* **Lecture Syllabus**:
  - Arithmetic overflow boundaries
  - Solidity 0.8+ overflow compiler checks
  - SafeMath operations integrations
* **Coding Exam**: `blockchain-basics-exam-day-16` (`isAddSafe`)
  - **Task**: Write a JS function `isAddSafe(a, b)` preventing addition overflow.
  - **Test**: Returns true if output sum does not wrap.
* **Coding Assignment**: `blockchain-basics-assign-day-16` (`isSubSafe`)
  - **Task**: Write a JS function `isSubSafe(a, b)` preventing underflow.
  - **Test**: Return true if a >= b.

#### 🟢 Day 17: Solidity Security: Access Control & Owner restrictions
* **Lecture Syllabus**:
  - Solidity access modifiers configurations
  - Mapping admin addresses store fields
  - Securing privileged modifier access
* **Coding Exam**: `blockchain-basics-exam-day-17` (`isAdminRole`)
  - **Task**: Write a JS function `isAdminRole(rolesMap, userAddr)` verifying admin credentials.
  - **Test**: Checks map keys values.
* **Coding Assignment**: `blockchain-basics-assign-day-17` (`isContractOwner`)
  - **Task**: Write a JS function `isContractOwner(addr, ownerAddr)` checking owner address.
  - **Test**: Returns balance checks.

#### 🟢 Day 18: Solidity Security: Integer division precision truncations
* **Lecture Syllabus**:
  - Integer division truncation rules
  - Scaling decimal factors
  - Formatting transaction decimal outputs
* **Coding Exam**: `blockchain-basics-exam-day-18` (`isPrecisionSufficient`)
  - **Task**: Write a JS function `isPrecisionSufficient(value, divisor)` checking division precision checks.
  - **Test**: Checks modulo 0.
* **Coding Assignment**: `blockchain-basics-assign-day-18` (`scalePriceValue`)
  - **Task**: Write a JS function `scalePriceValue(price, scale)` applying multiplier limits.
  - **Test**: Returns product.

#### 🟢 Day 19: Smart Contracts Optimization: Gas reduction techniques
* **Lecture Syllabus**:
  - EVM storage layout properties
  - Solidity packing variables strategies
  - Minimizing external transaction calls
* **Coding Exam**: `blockchain-basics-exam-day-19` (`canPackVariables`)
  - **Task**: Write a JS function `canPackVariables(sizeA, sizeB)` checking packing capabilities.
  - **Test**: Confirms sum of variables fits inside 32-bytes slot capacity.
* **Coding Assignment**: `blockchain-basics-assign-day-19` (`calculateSlotOverhead`)
  - **Task**: Write a JS function `calculateSlotOverhead(slotCount)` calculating slot writes overhead.
  - **Test**: Scales count.

#### 🟢 Day 20: Solidity Auditing: Static Analysis tool configurations
* **Lecture Syllabus**:
  - Solidity static analysis configurations (Slither)
  - Locating compiler version warnings
  - Configuring security parameters lists
* **Coding Exam**: `blockchain-basics-exam-day-20` (`hasHighVulnerabilities`)
  - **Task**: Write a JS function `hasHighVulnerabilities(issues)` parsing reports.
  - **Test**: Checks array for high severity warnings.
* **Coding Assignment**: `blockchain-basics-assign-day-20` (`filterLowImpactIssues`)
  - **Task**: Write a JS function `filterLowImpactIssues(issues)` filtering issue logs.
  - **Test**: Filters out low impact items.

#### 🟢 Day 21: Solidity Auditing: Smart Contract Security Audit
* **Lecture Syllabus**:
  - Smart contract security audit methodologies
  - Locating transaction exploits paths
  - Verifying checks-effects pattern guidelines
* **Coding Exam**: `blockchain-basics-exam-day-21` (`verifyAuditCompliance`)
  - **Task**: Write a JS function `verifyAuditCompliance(report)` verifying contract compliance states.
  - **Test**: Audits reentrancy and overflow parameters.
* **Coding Assignment**: `blockchain-basics-assign-day-21` (`getAuditRating`)
  - **Task**: Write a JS function `getAuditRating(issuesCount)` mapping ratings.
  - **Test**: Emits EXCELLENT, MEDIUM, or CRITICAL.

---

### 🪙 Week 4: Applied Auditing & Capstone Security Review

#### 🟢 Day 22: Smart Contract Security Audit (Review)
* **Lecture Syllabus**:
  - Reviewing compiled smart contracts
  - Assembling final security audit reports
  - Verifying bytecode parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Smart Contract Security Audit (Review)
* **Lecture Syllabus**:
  - Reviewing compiled smart contracts
  - Assembling final security audit reports
  - Verifying bytecode parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Smart Contract Security Audit (Review)
* **Lecture Syllabus**:
  - Reviewing compiled smart contracts
  - Assembling final security audit reports
  - Verifying bytecode parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Smart Contract Security Audit (Review)
* **Lecture Syllabus**:
  - Reviewing compiled smart contracts
  - Assembling final security audit reports
  - Verifying bytecode parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Smart Contract Security Audit (Review)
* **Lecture Syllabus**:
  - Reviewing compiled smart contracts
  - Assembling final security audit reports
  - Verifying bytecode parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Smart Contract Security Audit (Review)
* **Lecture Syllabus**:
  - Reviewing compiled smart contracts
  - Assembling final security audit reports
  - Verifying bytecode parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Smart Contract Security Audit (Review)
* **Lecture Syllabus**:
  - Reviewing compiled smart contracts
  - Assembling final security audit reports
  - Verifying bytecode parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Smart Contract Security Audit (Review)
* **Lecture Syllabus**:
  - Reviewing compiled smart contracts
  - Assembling final security audit reports
  - Verifying bytecode parameters
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Smart Contract Security Audit (Review)
* **Lecture Syllabus**:
  - Assemble final smart contract audit report
  - Verify ERC token compatibility and bytecode outputs
  - Confirm security modifiers checklist and deployment parameters
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
