import json

with open("scripts/iot_net_day33.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Standalone Part 2 code
standalone_p2_code = """# OPC UA Address Space Traversal & Engineering Units
class NodeClass:
    OBJECT = "Object"
    VARIABLE = "Variable"
    METHOD = "Method"
    OBJECT_TYPE = "ObjectType"

class Reference:
    def __init__(self, ref_type, target_node_id, is_forward=True):
        self.ref_type = ref_type
        self.target_node_id = target_node_id
        self.is_forward = is_forward

class UANode:
    def __init__(self, node_id, browse_name, node_class, value=None):
        self.node_id = node_id
        self.browse_name = browse_name
        self.node_class = node_class
        self.value = value
        self.references = []
        
    def add_reference(self, ref_type, target_node_id):
        self.references.append(Reference(ref_type, target_node_id))

# Initialize base address space
nodes = {
    "ns=0;i=84": UANode("ns=0;i=84", "Root", NodeClass.OBJECT),
    "ns=0;i=85": UANode("ns=0;i=85", "Objects", NodeClass.OBJECT),
    "ns=2;s=Turbine1": UANode("ns=2;s=Turbine1", "Turbine1", NodeClass.OBJECT),
    "ns=2;s=Turbine1.RPM": UANode("ns=2;s=Turbine1.RPM", "RPM", NodeClass.VARIABLE, 3600.0)
}
nodes["ns=0;i=84"].add_reference("Organizes", "ns=0;i=85")
nodes["ns=0;i=85"].add_reference("Organizes", "ns=2;s=Turbine1")
nodes["ns=2;s=Turbine1"].add_reference("HasComponent", "ns=2;s=Turbine1.RPM")

class AddressSpaceNavigator:
    def __init__(self, node_dict):
        self.nodes = node_dict
        
    def resolve_browse_path(self, start_id, path_segments):
        current_id = start_id
        for seg in path_segments:
            curr_node = self.nodes.get(current_id)
            if not curr_node:
                return None
            found = False
            for ref in curr_node.references:
                target = self.nodes.get(ref.target_node_id)
                if target and target.browse_name == seg:
                    current_id = target.node_id
                    found = True
                    break
            if not found:
                return None
        return self.nodes.get(current_id)

# Enrich with EngineeringUnits and EURange properties
nodes["ns=2;s=Turbine1.RPM.EURange"] = UANode("ns=2;s=Turbine1.RPM.EURange", "EURange", NodeClass.VARIABLE, {"low": 0.0, "high": 5000.0})
nodes["ns=2;s=Turbine1.RPM.Units"] = UANode("ns=2;s=Turbine1.RPM.Units", "EngineeringUnits", NodeClass.VARIABLE, "rev/min")
nodes["ns=2;s=Turbine1.RPM"].add_reference("HasProperty", "ns=2;s=Turbine1.RPM.EURange")
nodes["ns=2;s=Turbine1.RPM"].add_reference("HasProperty", "ns=2;s=Turbine1.RPM.Units")

nav = AddressSpaceNavigator(nodes)
target = nav.resolve_browse_path("ns=0;i=85", ["Turbine1", "RPM"])

print("Browse Path Resolution: Objects -> Turbine1 -> RPM")
print(f"Target NodeId: {target.node_id}")
units_val = nodes["ns=2;s=Turbine1.RPM.Units"].value
print(f"Current Value: {target.value} {units_val}")
eu_range = nodes["ns=2;s=Turbine1.RPM.EURange"].value
print(f"Operational Limits (EURange): {eu_range['low']} to {eu_range['high']} {units_val}")
"""

import subprocess
out = subprocess.check_output(["python", "-c", standalone_p2_code], text=True)
d["parts"][1]["code"] = standalone_p2_code
d["parts"][1]["output"] = out

with open("scripts/iot_net_day33.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Updated Day 33 Part 2 code to be completely standalone. New output:")
print(out)
