
def parse_fixed_width_line(line):
    # Extract fixed-width fields
    field1 = line[0:33].strip().rstrip(',')
    field2 = line[34:67].strip().rstrip(',')
    field3 = line[68:110].strip().rstrip(',')

    # Get remaining fields
    rest = line[110:].split(',')
    rest = [r.strip() for r in rest if r.strip()]

    # Combine all cleaned fields into one array
    return [field1, field2, field3] + rest



def merge_flexible(curr_result, next_result):
    index = 0
    for i in range(0, len(next_result)):
        if next_result[i].strip() != "":
            index = i
            break

    curr_text = curr_result[index].strip()
    next_text = next_result[index].strip()

    final_text = curr_text + " " + next_text
    curr_result[index] = final_text

    return curr_result


def format_row_to_fixed_width(row):
    # Define desired field widths
    widths = [33, 33, 33, 5, 5]

    # Pad fields with spaces using ljust
    padded_fields = [row[i].strip().ljust(widths[i]) for i in range(min(len(row), len(widths)))]

    return ', '.join(padded_fields)


def change_comma_names(main_line):
    main_result = parse_fixed_width_line(main_line)

    field1 = main_result[0]
    field2 = main_result[1]
    field3 = main_result[2]

    changed = False

    if field1.__contains__(","):
        main_result[0] = f'"{field1}"'
        changed = True
    if field2.__contains__(","):
        main_result[1] = f'"{field2}"'
        changed = True
    if field3.__contains__(","):
        main_result[2] = f'"{field3}"'
        changed = True

    if changed:
        return format_row_to_fixed_width(main_result)
    else:
        return None

def remove_last_comma(line):
    return line[:-1]

def main(main_lines):
    del_counter = 0
    changed_lines = []

    for i in range(0, len(main_lines)):                                         # repair too long names
        if i < len(main_lines):                             # correct number of lines after removed next from too long
            curr_line = main_lines[i].strip()
            if curr_line.endswith(","):
                curr_line = remove_last_comma(curr_line)
                main_lines[i] = curr_line


            curr_result = parse_fixed_width_line(curr_line)

            if i < len(main_lines) - 1:                                         # check if next exist
                next_line = main_lines[i + 1]
                next_result = parse_fixed_width_line(next_line)

                if len(next_result) < 4:                                        # too long name
                    new_line = merge_flexible(curr_result, next_result)
                    result = format_row_to_fixed_width(new_line)
                    main_lines[i] = result
                    del(main_lines[i+ 1])
                    del_counter += 1
                    changed_lines.append(i)


    for i in range(1, len(main_lines)):
        if i not in changed_lines:
            new_line = change_comma_names(main_lines[i])
            if new_line is not None:
                main_lines[i] = new_line
                #print(main_lines[i])




    return main_lines

