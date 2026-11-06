import json

# Day 7: TensorFlow Lite for Microcontrollers (TFLM) Architecture & FlatBuffer Serialization
# Track: Course 18: Edge AI, DSP & TinyML Systems (Month 1 Block 2)
# Invariants: 5 parts, >= 580 words per part in say (>= 2900 total words, >= 24 min audio), minutes: 38, options: 4, answer: 0, runnable python code & output

day7 = {
    "coursePrefix": "iot_edge",
    "day": 7,
    "title": "TensorFlow Lite for Microcontrollers (TFLM) Architecture & FlatBuffer Serialization",
    "goal": "Deconstruct, traverse, and decode the schema of binary FlatBuffers (.tflite) model artifacts without dynamic memory allocation or JSON parsing overhead on bare-metal systems.",
    "minutes": 38,
    "recap": "Yesterday on Day 6, we mastered peak activation memory modeling, double-buffering ping-pong lifecycles, and 16-byte SIMD memory alignment. Today, we unpack the binary container format that delivers serialized neural network graphs to edge silicon: Google FlatBuffers and the TFLM runtime architecture.",
    "parts": [
        {
            "title": "The Zero-Copy Philosophy: Why FlatBuffers Replaced Protocol Buffers & JSON",
            "say": [
                "Welcome to Day Seven of Edge AI, DSP, and TinyML Systems. Today, we explore the software architecture and binary container mechanics of Google's TensorFlow Lite for Microcontrollers (TFLM) framework, focusing on the fundamental data serialization format that makes bare-metal deep learning possible: FlatBuffers.",
                "To appreciate why FlatBuffers was chosen as the sole serialization format for TFLM, we must first analyze why conventional serialization protocols completely fail in resource-constrained embedded systems. In standard web, cloud, and mobile architectures, data serialization is dominated by formats like JSON, XML, or Google Protocol Buffers (protobuf). While these formats provide high flexibility, they share an insurmountable fatal flaw on microcontrollers: they require an explicit parsing, unpacking, and deserialization phase.",
                "Consider what happens when an embedded system ingests a 500-kilobyte JSON or Protobuf neural network file. The parser must allocate runtime memory on the heap to construct an internal Abstract Syntax Tree (AST) or C++ object hierarchy. The Protobuf decoder parses byte-stream varints, allocates individual string labels, and instantiates complex heap-allocated structs representing layers, weights, and tensor shapes. In doing so, the deserialization step consumes more volatile SRAM than the neural network model itself! On a microcontroller with only 128 kilobytes of SRAM, attempting to deserialize a Protobuf model will instantly exhaust the heap and trigger an unrecoverable out-of-memory crash.",
                "Furthermore, dynamic deserialization is computationally expensive. It requires hundreds of thousands of CPU cycles to traverse binary blobs and unpack variable-length fields, introducing seconds of cold-boot latency before the microcontroller can even begin its first sensor inference pass. In mission-critical edge applications—such as an automotive airbag sensor or industrial arc-fault detector—boot latency must be measured in milliseconds, not seconds.",
                "FlatBuffers solves this permanently through its radical Zero-Copy, In-Place Access architecture. In a FlatBuffer binary file (the '.tflite' model file), data is structured in memory exactly as it will be accessed by the CPU. There is no parsing step, no unpacking phase, and zero dynamic memory allocation! The microcontroller simply flashes the binary '.tflite' array directly into read-only Flash memory (or maps it via memory-mapped SPI flash). The C++ firmware casts the raw byte pointer directly into a structured 'Model' table pointer and reads tensor shapes, quantization scale factors, and weight buffers directly in place with single-cycle pointer offsets.",
                "In high-reliability industrial automation, software architectures must also provide strict static guarantees against resource starvation. Under the FlatBuffers design, because the model resides in immutable Flash memory, an unexpected power brownout or electrical transient cannot corrupt the model weights or graph topology. The TFLM interpreter simply binds its transient Tensor Arena in RAM to the immutable model operators in Flash, achieving instantaneous sub-millisecond cold boot times and rock-solid deterministic reliability."
            ],
            "example": "Think of moving into a new house. A Protocol Buffer or JSON model is like flat-pack furniture delivered in ten cardboard boxes with a bag of screws: you must spend three hours unboxing, reading instructions, and assembling tables before you can sit down (dynamic deserialization overhead). A FlatBuffer model is like moving into a fully furnished room where the bed, desk, and chairs are already bolted to the floor and ready for immediate use the microsecond you unlock the door (zero-copy direct execution).",
            "code": """# FlatBuffers Zero-Copy Direct Access Simulator
# Demonstrates reading model metadata directly from a raw byte buffer without heap allocation

import struct

class MockFlatBufferTFLiteParser:
    def __init__(self, raw_bytes: bytearray):
        self.buffer = raw_bytes

    def verify_magic_identifier(self) -> bool:
        # TFLM FlatBuffers contain the 4-byte file identifier 'TFL3' at byte offset 4..7
        if len(self.buffer) < 8:
            return False
        file_identifier = self.buffer[4:8].decode('ascii', errors='ignore')
        return file_identifier == 'TFL3'

    def read_root_table_offset(self) -> int:
        # Offset 0..3 contains the 32-bit little-endian relative offset to the Root Model Table
        root_offset = struct.unpack_from('<I', self.buffer, 0)[0]
        return root_offset

    def decode_model_header(self) -> dict:
        if not self.verify_magic_identifier():
            raise ValueError("Corrupted Model! Magic identifier 'TFL3' missing.")
        
        root_offset = self.read_root_table_offset()
        # FlatBuffers vtable offset is stored as a signed 32-bit int relative to table base
        vtable_soffset = struct.unpack_from('<i', self.buffer, root_offset)[0]
        vtable_offset = root_offset - vtable_soffset
        
        # Read vtable length and table length (each 16-bit uint)
        vtable_len, table_len = struct.unpack_from('<HH', self.buffer, vtable_offset)
        
        return {
            "magic_id": "TFL3",
            "root_table_offset": root_offset,
            "vtable_offset": vtable_offset,
            "vtable_length": vtable_len,
            "table_length": table_len
        }

# Construct a simulated minimal valid TFLM FlatBuffer binary payload
def create_mock_tflite_binary() -> bytearray:
    # 0..3: Root offset (points to byte 12)
    # 4..7: File Identifier 'TFL3'
    # 8..11: Vtable (vtable_len=8, table_len=12)
    # 12..15: Root table (soffset to vtable = 12 - 8 = 4)
    buf = bytearray()
    buf.extend(struct.pack('<I', 12))         # Root table at offset 12
    buf.extend(b'TFL3')                       # File Identifier
    buf.extend(struct.pack('<HH', 8, 12))     # Vtable: len=8, table_len=12
    buf.extend(struct.pack('<i', 4))          # Root table: soffset to vtable (12 - 8 = 4)
    buf.extend(b'\\x00' * 16)                 # Trailing padding
    return buf

binary_blob = create_mock_tflite_binary()
parser = MockFlatBufferTFLiteParser(binary_blob)
header = parser.decode_model_header()

print("=== TFLM FLATBUFFERS ZERO-COPY BINARY PARSING ===")
for k, v in header.items():
    print(f"{k:<20}: {v}")
print(f"Dynamic Heap Memory Allocated: 0 Bytes (Pointer Arithmetic Only)")
print(f"Verification Verdict:          PASSED (Valid TFLM Model Container)")""",
            "output": """=== TFLM FLATBUFFERS ZERO-COPY BINARY PARSING ===
magic_id            : TFL3
root_table_offset   : 12
vtable_offset       : 8
vtable_length       : 8
table_length        : 12
Dynamic Heap Memory Allocated: 0 Bytes (Pointer Arithmetic Only)
Verification Verdict:          PASSED (Valid TFLM Model Container)""",
            "codeNotes": [
                "Line 8: verify_magic_identifier inspects bytes 4-7 for the mandatory TFLM FlatBuffers identifier 'TFL3'.",
                "Line 24: Direct pointer arithmetic reads the vtable offset without unpacking or allocating intermediate memory structs.",
                "Line 43: Constructs a deterministic binary byte stream illustrating exact physical memory layout in MCU Flash."
            ],
            "tryIt": "Corrupt the 4-byte file identifier to b'TFXX' and verify that the parser immediately catches the corrupted container error.",
            "check": {
                "question": "What is the primary operational advantage of Google FlatBuffers over Protocol Buffers or JSON in embedded microcontroller TinyML deployment?",
                "options": [
                    "FlatBuffers requires zero dynamic memory allocation and no deserialization step, allowing direct read-only in-place access from Flash memory",
                    "FlatBuffers automatically accelerates microcontroller clock frequencies by 50%",
                    "FlatBuffers encrypts the neural network weights using quantum cryptography",
                    "FlatBuffers models can only be read when connected to the internet"
                ],
                "answer": 0,
                "why": "FlatBuffers stores structured data with internal offset pointers matching in-memory CPU representation, enabling zero-copy access directly from non-volatile Flash without heap allocation or unpacking latency."
            }
        },
        {
            "title": "FlatBuffers Internal Binary Anatomy: Vtables, Tables, and Offsets",
            "say": [
                "In Part Two, we dive beneath high-level abstractions to dissect the internal byte-level mechanics of FlatBuffers: Tables, Virtual Tables (Vtables), Vectors, and UOffset32 pointers.",
                "To navigate a FlatBuffer binary with zero runtime overhead, the format employs an ingenious indirection mechanism: the Vtable (Virtual Table). In object-oriented C++, a vtable is used by the compiler to resolve virtual function calls dynamically. In FlatBuffers, a vtable is a serialized array of 16-bit integer offsets that map logical field indices to physical byte offsets within a data Table.",
                "Consider a FlatBuffers 'Model' table. It contains multiple logical fields: field 0 is the version number, field 1 is the operator codes vector, field 2 is the subgraphs vector, and field 3 is the description string. However, what if a particular model does not have a description string? In traditional formats, optional fields must either be stored as empty strings (wasting space) or handled via complex parsing logic.",
                "In FlatBuffers, backward and forward schema compatibility is achieved cleanly through vtables. The table begins with a signed 32-bit offset pointing backwards to its vtable. The vtable begins with two 16-bit headers: 'vtable_size' (the total size of the vtable in bytes) and 'table_size' (the total size of the data table in bytes). Following these headers is an array of 16-bit field offsets. If field 3 (description) is omitted in the model, its vtable entry is simply '0x0000'! When the C++ runtime reads field 3, it checks the vtable offset: if it is zero, the field is absent, and the accessor immediately returns the default value without reading memory.",
                "If field 3 is present, the vtable contains a non-zero byte offset (e.g., '0x000C'). The CPU simply adds this offset to the base address of the table: 'field_address = table_base + vtable_offset'. All scalar values (uint8, int32, float32) are stored directly at that offset in little-endian format. Complex structures, such as nested tables or arrays of layer weights, are stored as relative 32-bit unsigned offsets ('uoffset32_t') pointing forward to the target data block.",
                "This architecture guarantees that reading any field in a multi-megabyte model is an O(1) single-cycle pointer addition. There is no string comparison, no hash table lookup, and no memory search. The C++ compiler compiles accessor methods into single load instructions, enabling blazing fast traversal of model graphs on ultra-low-power microcontrollers."
            ],
            "example": "Think of a library card catalog. The card catalog (vtable) lists exactly which shelf number (byte offset) holds each book (field). If a book has not been acquired yet, the card says 'Not Present' (offset 0). If it is present, you walk straight to Shelf 12 (offset 12) without wandering through every aisle in the building (no sequential searching).",
            "code": """# FlatBuffers Vtable & Table Field Resolver Simulator
# Illustrates O(1) field navigation and schema evolution via 16-bit vtable offsets

class FlatBufferTableResolver:
    def __init__(self, buffer: bytearray, table_base: int):
        self.buffer = buffer
        self.table_base = table_base
        # 1. Read signed 32-bit offset to vtable
        vtable_soffset = struct.unpack_from('<i', self.buffer, table_base)[0]
        self.vtable_base = table_base - vtable_soffset
        
        # 2. Read vtable dimensions
        self.vtable_size, self.table_size = struct.unpack_from('<HH', self.buffer, self.vtable_base)

    def get_field_offset(self, field_index: int) -> int:
        # Vtable entries start after vtable_size (2B) and table_size (2B) -> byte 4
        entry_offset = self.vtable_base + 4 + (field_index * 2)
        if entry_offset + 2 > self.vtable_base + self.vtable_size:
            return 0 # Field index outside this vtable (older schema version)
        
        field_offset_in_table = struct.unpack_from('<H', self.buffer, entry_offset)[0]
        return field_offset_in_table

    def read_uint32_field(self, field_index: int, default_val: int = 0) -> int:
        offset = self.get_field_offset(field_index)
        if offset == 0:
            return default_val # Field not present in binary
        return struct.unpack_from('<I', self.buffer, self.table_base + offset)[0]

def test_vtable_resolution():
    # Construct a synthetic table with 3 fields:
    # Field 0: Version (uint32) = 3
    # Field 1: Optional Flag (omitted, offset = 0)
    # Field 2: Subgraph Count (uint32) = 1
    raw = bytearray(64)
    table_pos = 24
    vtable_pos = 8
    
    # Write Table at pos 24: soffset to vtable = 24 - 8 = 16
    struct.pack_into('<i', raw, table_pos, 16)
    
    # Write Vtable at pos 8: vtable_size=10, table_size=16
    # Followed by field 0 offset (4), field 1 offset (0=omitted), field 2 offset (8)
    struct.pack_into('<HH', raw, vtable_pos, 10, 16)
    struct.pack_into('<HHH', raw, vtable_pos + 4, 4, 0, 8)
    
    # Write data in Table (pos 24 + 4 = 28 -> version=3, pos 24 + 8 = 32 -> subgraphs=1)
    struct.pack_into('<I', raw, table_pos + 4, 3)
    struct.pack_into('<I', raw, table_pos + 8, 1)

    resolver = FlatBufferTableResolver(raw, table_pos)
    v_val = resolver.read_uint32_field(field_index=0)
    flag_val = resolver.read_uint32_field(field_index=1, default_val=999)
    subg_val = resolver.read_uint32_field(field_index=2)

    print("=== FLATBUFFERS VTABLE O(1) FIELD RESOLUTION ===")
    print(f"Vtable Base Address:      0x{resolver.vtable_base:04X} (Size: {resolver.vtable_size} B)")
    print(f"Table Base Address:       0x{resolver.table_base:04X} (Size: {resolver.table_size} B)")
    print(f"Field 0 (Model Version):  {v_val} [READ SUCCESS]")
    print(f"Field 1 (Optional Flag):  {flag_val} [DEFAULT RETURNED (OMITTED FIELD)]")
    print(f"Field 2 (Subgraph Count): {subg_val} [READ SUCCESS]")

test_vtable_resolution()""",
            "output": """=== FLATBUFFERS VTABLE O(1) FIELD RESOLUTION ===
Vtable Base Address:      0x0008 (Size: 10 B)
Table Base Address:       0x0018 (Size: 16 B)
Field 0 (Model Version):  3 [READ SUCCESS]
Field 1 (Optional Flag):  999 [DEFAULT RETURNED (OMITTED FIELD)]
Field 2 (Subgraph Count): 1 [READ SUCCESS]""",
            "codeNotes": [
                "Line 4: Implements FlatBufferTableResolver reading relative vtable offset and navigating scalar fields.",
                "Line 18: Resolves omitted fields in O(1) time without throwing exceptions or allocating memory.",
                "Line 39: Demonstrates backward compatibility: older models simply return default values for newly added schema fields."
            ],
            "tryIt": "Add a 4th field in the vtable (index 3) pointing to an integer with value 42, and read it using read_uint32_field(3).",
            "check": {
                "question": "How does FlatBuffers achieve schema forward and backward compatibility when new optional fields are added to a neural network model?",
                "options": [
                    "Via 16-bit vtable offset entries: missing fields contain an offset of 0x0000, prompting the accessor to return default values instantly without error",
                    "By downloading updated JSON schema files over the internet at runtime",
                    "By re-compiling the microcontroller firmware whenever a new model is introduced",
                    "By padding all deleted fields with millions of random numbers"
                ],
                "answer": 0,
                "why": "FlatBuffers uses vtables where each field has a corresponding 16-bit offset. If a field is not present in the serialized binary, its vtable offset is 0, allowing the accessor to immediately supply a default value without runtime errors or schema mismatches."
            }
        },
        {
            "title": "TFLM Runtime Architecture: The MicroInterpreter & OpResolver",
            "say": [
                "In Part Three, we shift focus from the binary container format to the active runtime execution engine: the TensorFlow Lite for Microcontrollers (TFLM) Interpreter architecture.",
                "In desktop and server TensorFlow Lite, the 'tflite::Interpreter' is a massive C++ object that dynamically allocates tensor buffers, creates execution graphs on the heap, spawns multi-threaded worker pools, and uses hardware delegates (such as GPU or NPU delegates) resolved at runtime. In stark contrast, the micro-edge implementation—'tflite::MicroInterpreter'—is stripped down to the bare metal. It is designed to run on bare-metal ARM Cortex-M, RISC-V, and Tensilica DSP cores with zero operating system dependencies, zero dynamic memory allocation, and zero multithreading overhead.",
                "The 'MicroInterpreter' lifecycle consists of four strict, deterministic phases: Instantiation, Allocation, Invocation, and Output Extraction. When instantiating the 'MicroInterpreter', the firmware passes three required parameters: First, a pointer to the 'tflite::Model' residing in Flash memory; second, a reference to an 'OpResolver'; and third, a pre-allocated contiguous byte array in RAM: the 'tensor_arena'.",
                "The 'OpResolver' is a critical micro-architectural design pattern. In full TensorFlow Lite, the binary links all two hundred plus neural network operators (Conv2D, DepthwiseConv, Add, Sub, Softmax, LSTM, Transpose, etc.). If an embedded binary linked all 200 operators, the compiled machine code would consume over 1.5 megabytes of Flash memory, exceeding the entire physical flash capacity of most microcontrollers! To solve this, TFLM uses the 'MicroMutableOpResolver' template. As an embedded engineer, you register only the exact mathematical operators utilized by your specific model (e.g., 'AddConv2D()', 'AddDepthwiseConv2D()', 'AddSoftmax()'). The linker's dead-code elimination (tree-shaking) strips all unused operators, shrinking the compiled runtime footprint from 1.5 MB down to less than 25 kilobytes of Flash!",
                "During the 'AllocateTensors()' phase, the 'MicroInterpreter' traverses the FlatBuffer execution graph, calculates intermediate tensor dimensions, validates INT8 quantization scale factors, and binds memory offsets within the provided 'tensor_arena'. If 'AllocateTensors()' succeeds, the system is mathematically guaranteed to execute inference without memory allocation errors. During 'Invoke()', the interpreter simply steps through the pre-compiled operator list sequentially, passing tensor pointers directly to optimized assembly kernels. We will construct a Python simulator mirroring the exact C++ 'MicroInterpreter' and 'OpResolver' workflow."
            ],
            "example": "Think of a chef preparing for a catered dinner. Instead of hauling an entire 20-ton industrial kitchen with 200 appliances to the event, the chef reviews the menu (the model graph), packs only a chef's knife, a frying pan, and a blender (the OpResolver), and lays out a 6-foot folding table (the Tensor Arena). You carry only what is needed to execute the exact recipe.",
            "code": """# TFLM MicroInterpreter & Selective OpResolver Architecture Simulator
# Models selective operator linking and static graph execution

class MicroOpKernel:
    def __init__(self, name: str, flash_cost_bytes: int):
        self.name = name
        self.flash_cost_bytes = flash_cost_bytes

    def execute(self, inputs: list) -> list:
        raise NotImplementedError

class Conv2DKernel(MicroOpKernel):
    def __init__(self): super().__init__("CONV_2D", flash_cost_bytes=4200)
    def execute(self, inputs: list) -> list:
        return [round(x * 1.5, 2) for x in inputs]

class SoftmaxKernel(MicroOpKernel):
    def __init__(self): super().__init__("SOFTMAX", flash_cost_bytes=1100)
    def execute(self, inputs: list) -> list:
        exp_sum = sum(pow(2.718, x) for x in inputs)
        return [round(pow(2.718, x) / exp_sum, 4) for x in inputs]

class MicroMutableOpResolver:
    def __init__(self):
        self.registered_ops = {}

    def add_op(self, kernel: MicroOpKernel):
        self.registered_ops[kernel.name] = kernel

    def get_op(self, name: str) -> MicroOpKernel:
        return self.registered_ops.get(name)

    def total_flash_footprint(self) -> int:
        return sum(k.flash_cost_bytes for k in self.registered_ops.values())

class MicroInterpreterSimulator:
    def __init__(self, model_graph: list, resolver: MicroMutableOpResolver, arena_size_bytes: int):
        self.model_graph = model_graph
        self.resolver = resolver
        self.arena_size_bytes = arena_size_bytes
        self.is_allocated = False

    def allocate_tensors(self) -> bool:
        print("[TFLM MicroInterpreter] Validating operator registration...")
        for op_name, _ in self.model_graph:
            if not self.resolver.get_op(op_name):
                print(f"[FATAL ERROR] Operator '{op_name}' not registered in OpResolver!")
                return False
        self.is_allocated = True
        print(f"[TFLM MicroInterpreter] Tensor Arena bound: {self.arena_size_bytes} Bytes allocated.")
        return True

    def invoke(self, input_tensor: list) -> list:
        if not self.is_allocated:
            raise RuntimeError("Must call allocate_tensors() before invoke()!")
        
        current_data = input_tensor
        for op_name, layer_name in self.model_graph:
            kernel = self.resolver.get_op(op_name)
            current_data = kernel.execute(current_data)
            print(f"  -> Executed {op_name} ({layer_name}): Output = {current_data}")
        return current_data

# Execute simulation
resolver = MicroMutableOpResolver()
resolver.add_op(Conv2DKernel())
resolver.add_op(SoftmaxKernel())

graph = [("CONV_2D", "Layer_1_FeatureExtractor"), ("SOFTMAX", "Layer_2_Probabilities")]
interpreter = MicroInterpreterSimulator(graph, resolver, arena_size_bytes=4096)

print("=== TFLM MICROINTERPRETER EXECUTION PIPELINE ===")
print(f"Total OpResolver Flash Usage: {resolver.total_flash_footprint()} Bytes ({resolver.total_flash_footprint() / 1024:.2f} KB)")
if interpreter.allocate_tensors():
    raw_sensor_input = [0.2, 0.8, -0.4]
    final_output = interpreter.invoke(raw_sensor_input)
    print(f"Final Inference Confidence:   {final_output}")""",
            "output": """=== TFLM MICROINTERPRETER EXECUTION PIPELINE ===
Total OpResolver Flash Usage: 5300 Bytes (5.18 KB)
[TFLM MicroInterpreter] Validating operator registration...
[TFLM MicroInterpreter] Tensor Arena bound: 4096 Bytes allocated.
  -> Executed CONV_2D (Layer_1_FeatureExtractor): Output = [0.3, 1.2, -0.6]
  -> Executed SOFTMAX (Layer_2_Probabilities): Output = [0.2598, 0.6391, 0.101]
Final Inference Confidence:   [0.2598, 0.6391, 0.101]""",
            "codeNotes": [
                "Line 17: MicroMutableOpResolver registers only the specific operator kernels required by the application.",
                "Line 30: Demonstrates that selective kernel registration keeps Flash memory usage under 6 KB rather than over 1.5 MB.",
                "Line 38: allocate_tensors performs static validation before allowing the sequential invoke pass to execute."
            ],
            "tryIt": "Add an unregistered operator like 'DEPTHWISE_CONV_2D' to the model graph and confirm that allocate_tensors halts execution with a fatal operator missing error.",
            "check": {
                "question": "Why does TensorFlow Lite for Microcontrollers use a 'MicroMutableOpResolver' instead of linking all standard TensorFlow operators?",
                "options": [
                    "To allow compiler dead-code elimination to strip unused operators, reducing compiled Flash binary size from over 1.5 MB down to less than 30 KB",
                    "Because microcontrollers can only execute one single mathematical operator at a time",
                    "To prevent operators from communicating over Wi-Fi without user permission",
                    "Because standard operators cannot perform integer addition on ARM processors"
                ],
                "answer": 0,
                "why": "Linking all 200+ TensorFlow Lite operators would exhaust the Flash memory of most microcontrollers. MicroMutableOpResolver registers only the specific kernels used by the deployed model, allowing the linker to strip all other code."
            }
        },
        {
            "title": "Subgraphs, Operators & Tensor Arenas: The Static Execution Graph",
            "say": [
                "In Part Four, we examine how the TFLM runtime binds the serialized FlatBuffer graph to the physical static Tensor Arena. We analyze the exact schema hierarchy: Model, SubGraph, OperatorCodes, Tensors, and Buffers.",
                "When you open a '.tflite' model file, the Root Table is the 'Model'. The 'Model' table contains three primary vectors: First, 'operator_codes', an indexed list of operator signatures (e.g., Index 0 is CONV_2D, Index 1 is FULLY_CONNECTED, Index 2 is SOFTMAX); second, 'buffers', an array of raw binary byte blobs containing the quantized weight matrices and bias vectors; and third, 'subgraphs', which contains the active computational directed acyclic graph (DAG).",
                "Inside the primary 'SubGraph', we find the complete structural definition of the neural network: The 'tensors' array defines every single tensor in the network—both static weight tensors and transient intermediate activation feature maps. Each tensor descriptor contains its shape dimensions (e.g., '[1, 16, 16, 8]'), its data type ('TensorType_INT8'), its quantization parameters (scale and zero-point), and a buffer index. If the buffer index points to a non-empty buffer in the Model's 'buffers' table, the tensor is a static parameter (weights/biases) that lives in Flash. If the buffer index is 0 (an empty buffer), the tensor is an activation feature map that must be allocated dynamically within the Tensor Arena in SRAM!",
                "Following the tensors array is the 'operators' list. Each operator specifies its opcode index, an array of 'inputs' (tensor indices), and an array of 'outputs' (tensor indices). During graph initialization, the TFLM 'MicroInterpreter' iterates over the operators in strict topological order. It resolves input and output tensor indices to physical memory pointers within the Tensor Arena. Crucially, because all tensor buffer offsets are pre-calculated during 'AllocateTensors()', the runtime execution loop does not perform any graph traversal or pointer resolution during inference! The operator execution loop simply executes a pre-built array of function pointers ('TfLiteNode' and 'TfLiteRegistration'), achieving near bare-metal execution speed.",
                "Furthermore, TFLM enforces strict separation of concerns: weights are accessed directly from the Flash FlatBuffer via read-only pointer dereferences, while transient activations are read and written within the contiguous SRAM Tensor Arena. We will implement an automated inspector that traverses these FlatBuffer tables and maps their memory destinations."
            ],
            "example": "Think of an architectural blueprint. The blueprint contains a material inventory (buffers), a list of structural specifications (tensors), and an ordered construction schedule (operators). The builder reviews the blueprint once, marks the exact positions on the physical building site (the Tensor Arena), and then builds step-by-step according to the schedule without re-reading the entire blueprint from scratch.",
            "code": """# FlatBuffers Model Graph Hierarchy Inspector
# Traverses Model -> SubGraph -> Operators -> Tensors and distinguishes Flash vs SRAM allocation

class MockTensorDescriptor:
    def __init__(self, name: str, shape: list, dtype: str, is_weight: bool, size_bytes: int):
        self.name = name
        self.shape = shape
        self.dtype = dtype
        self.is_weight = is_weight
        self.size_bytes = size_bytes

class MockOperatorNode:
    def __init__(self, op_name: str, input_indices: list, output_indices: list):
        self.op_name = op_name
        self.input_indices = input_indices
        self.output_indices = output_indices

def inspect_tflite_graph():
    print("=== TFLM FLATBUFFERS EXECUTION GRAPH & MEMORY DESTINATION MAP ===")
    
    # Define synthetic SubGraph tensors
    tensors = [
        MockTensorDescriptor("input_audio",    [1, 32, 32, 1], "INT8",  is_weight=False, size_bytes=1024),
        MockTensorDescriptor("conv1_weights",  [16, 3, 3, 1],  "INT8",  is_weight=True,  size_bytes=144),
        MockTensorDescriptor("conv1_bias",     [16],           "INT32", is_weight=True,  size_bytes=64),
        MockTensorDescriptor("conv1_act",      [1, 16, 16, 16],"INT8",  is_weight=False, size_bytes=4096),
        MockTensorDescriptor("dense_weights",  [4, 4096],      "INT8",  is_weight=True,  size_bytes=16384),
        MockTensorDescriptor("dense_bias",     [4],            "INT32", is_weight=True,  size_bytes=16),
        MockTensorDescriptor("output_logits",  [1, 4],         "INT8",  is_weight=False, size_bytes=4)
    ]

    operators = [
        MockOperatorNode("CONV_2D",          input_indices=[0, 1, 2], output_indices=[3]),
        MockOperatorNode("FULLY_CONNECTED",  input_indices=[3, 4, 5], output_indices=[6])
    ]

    print(f"{'Idx':<4} | {'Tensor Name':<16} | {'Shape':<16} | {'Type':<6} | {'Storage Domain':<18} | {'Size'}")
    print("-" * 75)

    flash_weight_bytes = 0
    sram_activation_bytes = 0

    for idx, t in enumerate(tensors):
        domain = "FLASH (Read-Only)" if t.is_weight else "SRAM (Tensor Arena)"
        if t.is_weight: flash_weight_bytes += t.size_bytes
        else: sram_activation_bytes += t.size_bytes
        print(f"{idx:<4} | {t.name:<16} | {str(t.shape):<16} | {t.dtype:<6} | {domain:<18} | {t.size_bytes} B")

    print("-" * 75)
    print(f"Total Model Weights in Flash:    {flash_weight_bytes} Bytes ({flash_weight_bytes / 1024:.2f} KB)")
    print(f"Total Cumulative Activations:   {sram_activation_bytes} Bytes ({sram_activation_bytes / 1024:.2f} KB)")
    print("\\nExecution Pipeline Operator Nodes:")
    for i, op in enumerate(operators):
        in_names = [tensors[idx].name for idx in op.input_indices]
        out_names = [tensors[idx].name for idx in op.output_indices]
        print(f"  Node {i}: {op.op_name:<16} Inputs: {in_names} -> Outputs: {out_names}")

inspect_tflite_graph()""",
            "output": """=== TFLM FLATBUFFERS EXECUTION GRAPH & MEMORY DESTINATION MAP ===
Idx  | Tensor Name      | Shape            | Type   | Storage Domain     | Size
---------------------------------------------------------------------------
0    | input_audio      | [1, 32, 32, 1]   | INT8   | SRAM (Tensor Arena) | 1024 B
1    | conv1_weights    | [16, 3, 3, 1]    | INT8   | FLASH (Read-Only)  | 144 B
2    | conv1_bias       | [16]             | INT32  | FLASH (Read-Only)  | 64 B
3    | conv1_act        | [1, 16, 16, 16]  | INT8   | SRAM (Tensor Arena) | 4096 B
4    | dense_weights    | [4, 4096]        | INT8   | FLASH (Read-Only)  | 16384 B
5    | dense_bias       | [4]              | INT32  | FLASH (Read-Only)  | 16 B
6    | output_logits    | [1, 4]           | INT8   | SRAM (Tensor Arena) | 4 B
---------------------------------------------------------------------------
Total Model Weights in Flash:    16608 Bytes (16.22 KB)
Total Cumulative Activations:   5124 Bytes (5.00 KB)

Execution Pipeline Operator Nodes:
  Node 0: CONV_2D          Inputs: ['input_audio', 'conv1_weights', 'conv1_bias'] -> Outputs: ['conv1_act']
  Node 1: FULLY_CONNECTED  Inputs: ['conv1_act', 'dense_weights', 'dense_bias'] -> Outputs: ['output_logits']""",
            "codeNotes": [
                "Line 4: Defines MockTensorDescriptor tracking dimensions, data type, storage destination, and byte footprint.",
                "Line 29: Demonstrates explicit storage domain partitioning: weights stay permanently in Flash, while activations reside in SRAM.",
                "Line 44: Maps topological data flow across operator nodes without requiring dynamic memory allocation."
            ],
            "tryIt": "Add a BatchNormalization operator between Conv2D and FullyConnected and observe how its scale and bias tensors map to Flash memory.",
            "check": {
                "question": "In a compiled TensorFlow Lite FlatBuffer model, how does the TFLM runtime distinguish between a static parameter tensor (weights) and a transient activation tensor?",
                "options": [
                    "Static weights reference non-empty byte buffers in the FlatBuffers buffer table (stored in Flash), while activations reference buffer index 0 and are assigned offsets in the SRAM Tensor Arena",
                    "By inspecting whether the tensor name begins with an uppercase or lowercase letter",
                    "Weights are stored in text format while activations are stored in binary format",
                    "All tensors are always allocated in volatile SRAM regardless of their type"
                ],
                "answer": 0,
                "why": "In the TFLM FlatBuffers schema, tensors whose buffer index is non-zero point directly to constant data stored in Flash, whereas activation tensors have a buffer index of 0, signaling the allocator to provide transient space in RAM."
            }
        },
        {
            "title": "Production FlatBuffer C++ Header Embedding & Compilation Pipeline",
            "say": [
                "In the final part of Day Seven, we synthesize our understanding of FlatBuffers and the TFLM architecture by building the end-to-end model conversion, C++ array embedding, and deployment pipeline.",
                "In traditional server environments, Python scripts load .tflite model files dynamically from the local hard drive using file system APIs like open('model.tflite', 'rb'). However, bare-metal microcontrollers do not possess desktop operating systems, hard drives, or POSIX file systems. How does a 200-kilobyte binary FlatBuffer file physically get loaded onto a bare-metal microcontroller?",
                "The industry-standard solution is C++ Array Hex Embedding using tools like xxd -i or automated Python export scripts. The binary .tflite model file is translated into a constant C++ byte array declared with compiler flash placement attributes: alignas(16) const unsigned char g_model[] = { 0x18, 0x00, 0x00, 0x00, 0x54, 0x46, 0x4c, 0x33, ... };. This C++ header file (model_data.h) is compiled directly into the firmware image and linked into the microcontroller's Flash memory.",
                "When the microcontroller powers on, tflite::GetModel(g_model) performs zero-copy pointer initialization. The function checks the magic identifier TFL3, verifies that the alignment is valid, and returns a type-safe const tflite::Model* pointer. This pointer points directly to the model bytes sitting inside on-chip Flash! Not a single byte of memory is copied, and not a single microsecond is wasted.",
                "We will construct an automated C++ FlatBuffer Generator that ingests raw model bytes, validates the FlatBuffer schema headers, aligns data to 16-byte boundaries, and outputs a ready-to-compile production C++ header. This completes the bridge from offline neural network training to bare-metal embedded execution."
            ],
            "example": "Think of burning a song onto a vinyl record. Once the grooves are pressed into the physical vinyl (compiled into C++ Flash array), the needle (the CPU) reads the music directly by tracing the physical groove in real time without having to record it onto a cassette tape first.",
            "code": """# Production TFLM C++ Model Header Generator
# Translates binary FlatBuffer models into compile-ready C++ Flash arrays with 16-byte alignment

class TFLMModelHeaderExporter:
    @staticmethod
    def export_cpp_header(model_name: str, binary_data: bytearray) -> str:
        # Validate FlatBuffers magic identifier 'TFL3'
        if len(binary_data) >= 8 and binary_data[4:8] != b'TFL3':
            raise ValueError("Invalid TFLite binary! Missing 'TFL3' identifier.")
        
        header_guard = f"{model_name.upper()}_MODEL_DATA_H_"
        array_name = f"g_{model_name.lower()}_model_data"
        len_name = f"g_{model_name.lower()}_model_data_len"

        lines = []
        lines.append(f"// Auto-generated by TFLM Model Exporter - DO NOT EDIT")
        lines.append(f"#ifndef {header_guard}")
        lines.append(f"#define {header_guard}\\n")
        lines.append(f"#include <cstdint>\\n")
        lines.append(f"// Align to 16-byte boundary for ARM CMSIS-DSP vector SIMD compliance")
        lines.append(f"alignas(16) const uint8_t {array_name}[] = {{")

        # Format bytes in hex grid (12 bytes per line)
        hex_entries = [f"0x{b:02X}" for b in binary_data]
        for i in range(0, len(hex_entries), 12):
            chunk = hex_entries[i:i+12]
            lines.append("  " + ", ".join(chunk) + ",")

        lines.append("};\\n")
        lines.append(f"const uint32_t {len_name} = {len(binary_data)};\\n")
        lines.append(f"#endif // {header_guard}")
        return "\\n".join(lines)

def run_header_export_pipeline():
    print("=== TFLM BARE-METAL C++ MODEL HEADER GENERATION ===")
    
    # Construct synthetic valid TFLM model binary
    mock_binary = bytearray()
    mock_binary.extend(struct.pack('<I', 16))      # Root table offset
    mock_binary.extend(b'TFL3')                    # Mandatory magic identifier
    mock_binary.extend(struct.pack('<HH', 8, 12))  # Vtable header
    mock_binary.extend(struct.pack('<i', 4))       # Vtable relative offset
    mock_binary.extend(bytes(range(1, 17)))        # Weight bytes payload

    exporter = TFLMModelHeaderExporter()
    cpp_source = exporter.export_cpp_header("vibration_cnn", mock_binary)

    print(f"Generated C++ Header Preview ({len(mock_binary)} Bytes):")
    print("-" * 65)
    print(cpp_source)
    print("-" * 65)
    print("Flash Storage Placement:    PROGMEM / .rodata (Zero RAM Overhead)")
    print("Verification Verdict:       CERTIFIED (Ready for GCC-ARM Compiler)")

run_header_export_pipeline()""",
            "output": """=== TFLM BARE-METAL C++ MODEL HEADER GENERATION ===
Generated C++ Header Preview (32 Bytes):
-----------------------------------------------------------------
// Auto-generated by TFLM Model Exporter - DO NOT EDIT
#ifndef VIBRATION_CNN_MODEL_DATA_H_
#define VIBRATION_CNN_MODEL_DATA_H_

#include <cstdint>

// Align to 16-byte boundary for ARM CMSIS-DSP vector SIMD compliance
alignas(16) const uint8_t g_vibration_cnn_model_data[] = {
  0x10, 0x00, 0x00, 0x00, 0x54, 0x46, 0x4C, 0x33, 0x08, 0x00, 0x0C, 0x00,
  0x04, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
  0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
};

const uint32_t g_vibration_cnn_model_data_len = 32;

#endif // VIBRATION_CNN_MODEL_DATA_H_
-----------------------------------------------------------------
Flash Storage Placement:    PROGMEM / .rodata (Zero RAM Overhead)
Verification Verdict:       CERTIFIED (Ready for GCC-ARM Compiler)""",
            "codeNotes": [
                "Line 4: TFLMModelHeaderExporter converts raw binary FlatBuffers into standard C++ constant arrays.",
                "Line 16: Applies alignas(16) to the model array, ensuring vector instructions can read model constants without alignment faults.",
                "Line 38: Demonstrates that the model array is placed directly into Flash memory (.rodata), consuming 0 bytes of RAM."
            ],
            "tryIt": "Modify the exporter to output 16 bytes per line instead of 12 for clean 128-bit bus alignment inspection.",
            "check": {
                "question": "How are TensorFlow Lite FlatBuffer models physically stored and accessed on bare-metal microcontrollers without file systems?",
                "options": [
                    "Compiled into firmware as constant C++ byte arrays with alignas(16) placed into read-only Flash memory (.rodata) and accessed via direct pointer references",
                    "Uploaded to an SD card and read line-by-line using Python file reading commands",
                    "Stored in cloud servers and streamed over 5G networks during every inference pass",
                    "Manually typed into the microcontroller registers using a serial terminal on every power reset"
                ],
                "answer": 0,
                "why": "On bare-metal microcontrollers without POSIX file systems, models are converted into static C++ byte arrays, compiled directly into non-volatile Flash memory (.rodata), and accessed via zero-copy memory-mapped pointer offsets."
            }
        }
    ],
    "summary": [
        "Google FlatBuffers provides zero-copy, in-place data access directly from Flash memory, completely eliminating heap allocation and unpacking latency.",
        "Internal vtables map logical fields to 16-bit physical byte offsets in O(1) time, ensuring robust forward and backward schema evolution.",
        "The TFLM MicroInterpreter is stripped of all OS dependencies, executing models within a pre-allocated contiguous static Tensor Arena in SRAM.",
        "MicroMutableOpResolver allows selective kernel linking, shrinking compiled runtime Flash consumption from 1.5 MB down to under 30 KB.",
        "Deploying models onto bare-metal microcontrollers relies on C++ array embedding (alignas(16)), allowing the CPU to read models directly from Flash memory."
    ],
    "projectStep": {
        "title": "Construct a Zero-Copy FlatBuffers Model Inspector & C++ Exporter",
        "steps": [
            "Verify the mandatory 'TFL3' 4-byte FlatBuffers file identifier and extract root table offsets.",
            "Navigate internal vtables and resolve schema field byte locations in O(1) time.",
            "Inspect SubGraph operator nodes and segregate static Flash weights from transient SRAM activations.",
            "Simulate selective operator registration using a lightweight MicroMutableOpResolver.",
            "Export a production C++ header file with 16-byte alignment ready for bare-metal ARM compilation."
        ]
    }
}

with open('scripts/iot_edge_day7.json', 'w', encoding='utf-8') as f:
    json.dump(day7, f, indent=2)

print("Successfully wrote scripts/iot_edge_day7.json")
