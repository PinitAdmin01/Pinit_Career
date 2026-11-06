# Script to ensure every part in Days 31-35 has >= 585 words and <= 630 words
import sys
import os

# We can append deep pedagogical paragraphs to each part that is under 585 words
def expand_paragraphs(say_list, target_min=585, additions=None):
    current = len(" ".join(say_list).split())
    if current >= target_min:
        return say_list
    
    needed = target_min - current
    if additions:
        for p in additions:
            say_list.append(p)
            current = len(" ".join(say_list).split())
            if current >= target_min:
                break
    return say_list

print("Expansion helper ready.")
