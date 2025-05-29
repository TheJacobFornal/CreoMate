from pathlib import Path

curr_dir = Path(__file__).parent
app_dir = curr_dir.parent.parent
bom_dir = app_dir / "BOM"
temp_dir = bom_dir / "template"

print("main_dir: ", temp_dir)

for file in temp_dir.iterdir():
    bom_path = file

with open(bom_path, "r") as f:
    lines = f.readlines()
    first_hash = 0
    second_hash = 0

def mid_space(text, parts):
    text = text.strip()

    # Find index of middle space
    spaces = [i for i, c in enumerate(text) if c == ' ']
    middle_index = spaces[len(spaces) // 2]  # middle space position

    # Split into two parts
    left = text[:middle_index].strip()
    right = text[middle_index + 1:].strip()

    parts.append(parts[3])
    parts[3] = parts[2]
    parts[1] = left
    parts[2] = right

    print("upadate: ", parts)

for i in range (2, 9)
    parts = lines[i].split(",")


    partsNext = lines[i + 1].split(",")

    if len(partsNext) == 2:
        #print(parts)
        temp = parts[1]

        mid_space(temp, parts)

        part_update = parts[1] + " " + partsNext[0].strip()
        parts[1] = part_update
        3print(parts)





