"""
Fix Day 58 Part 2 code directly via JSON manipulation.
"""
import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from scripts.nlp_builder.day58 import DAY_58_DATA

new_code = '''from dataclasses import dataclass
from typing import List, Set, Dict, Optional
import json

class JSONGrammarFSM:
    def __init__(self):
        self.state = 0
        self.buffer = ''

    def get_valid_chars(self) -> Set[str]:
        if self.state == 0:
            return {'{'}
        elif self.state == 1:
            return set('abcdefghijklmnopqrstuvwxyz0123456789_\"')
        elif self.state == 2:
            return {':'}
        elif self.state == 3:
            return set('0123456789. ,}')
        elif self.state == 4:
            return {',', '}'}
        elif self.state == 5:
            return set()
        return set()

    def transition(self, char: str):
        self.buffer += char
        if self.state == 0 and char == '{':
            self.state = 1
        elif self.state == 1 and char == '\"':
            if self.buffer.count('\"') >= 2:
                self.state = 2
        elif self.state == 2 and char == ':':
            self.state = 3
        elif self.state == 3 and char == '}':
            self.state = 5

class ConstrainedDecoderSimulator:
    def __init__(self, fsm: JSONGrammarFSM):
        self.fsm = fsm

    def mask_and_sample(self, candidate_logits: Dict[str, float]) -> str:
        valid_chars = self.fsm.get_valid_chars()
        filtered = {k: v for k, v in candidate_logits.items() if k in valid_chars}
        if not filtered:
            raise ValueError(f'No valid tokens available in FSM state {self.fsm.state}')
        best_char = max(filtered.items(), key=lambda item: item[1])[0]
        self.fsm.transition(best_char)
        return best_char

fsm = JSONGrammarFSM()
decoder = ConstrainedDecoderSimulator(fsm)

target_sequence = ['{', '\"', 'q', '3', '\"', ':', '1', '4', '5', '}']
generated = []

for char in target_sequence:
    simulated_logits = {
        char: 8.5,
        '<INVALID_TOKEN>': 12.0,
        'random_text': 6.0
    }
    chosen = decoder.mask_and_sample(simulated_logits)
    generated.append(chosen)

result_str = ''.join(generated)
parsed = json.loads(result_str)

print('=== GRAMMAR-CONSTRAINED DECODING SIMULATION ===')
print(f'Raw Output Stream: {result_str}')
print(f'FSM Final State: {fsm.state} (5=Done)')
print(f'Valid JSON Verified: {parsed}')
print(f'Parsed Key: \"q3\" -> Value: {parsed[\"q3\"]}')'''

DAY_58_DATA["parts"][1]["code"] = new_code

import json
data_attr = "DAY_58_DATA"
file_path = "scripts/nlp_builder/day58.py"
title = DAY_58_DATA.get("title", "")
with open(file_path, "w", encoding="utf-8") as f:
    f.write(f'\"\"\"\nDay 58: {title}\nCourse 37: Natural Language Processing & Computational Linguistics\nPinIT Career OS - Month 2 Enterprise Expansion\n\"\"\"\n\n')
    f.write(f"{data_attr} = " + json.dumps(DAY_58_DATA, indent=4, ensure_ascii=False) + "\n")

print("Day 58 Part 2 code successfully updated!")
