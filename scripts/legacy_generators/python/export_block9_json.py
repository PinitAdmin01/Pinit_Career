import os
import sys
import json

sys.path.insert(0, os.path.abspath('scripts'))

from react_day41_data import day41
from react_day42_data import day42
from react_day43_data import day43
from react_day44_data import day44
from react_day45_data import day45

days = [day41, day42, day43, day44, day45]

with open('scripts/block9_all_days.json', 'w', encoding='utf-8') as f:
    json.dump(days, f, indent=2)

print("Exported scripts/block9_all_days.json successfully!")
