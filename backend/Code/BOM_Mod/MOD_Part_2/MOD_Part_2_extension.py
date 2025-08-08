
def parse_fixed_width_line(line):
    # Extract fixed-width fields
    field1 = line[0:20].strip().rstrip('`')
    field2 = line[21:47].strip().rstrip('`')
    field3 = line[48:89].strip().rstrip('`')
    field4 = line[90:117].strip().rstrip('`')

    return [field1, field2, field3, field4]



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
    widths = [20, 26, 41, 26]

    # Pad fields with spaces using ljust
    padded_fields = [row[i].strip().ljust(widths[i]) for i in range(min(len(row), len(widths)))]

    return '` '.join(padded_fields)


def count_backticks(line):
    # Count the number of backticks in the line
    return line.count('`')


def main(main_lines):
    del_counter = 0
    changed_lines = []

    for i in range(0, len(main_lines)):                                         # repair too long names MAIN
        if i < len(main_lines):                                                 # correct number of lines after removed next from too long
            curr_line = main_lines[i]

            curr_result = parse_fixed_width_line(curr_line)
            print(curr_line)
            print(curr_result, count_backticks(curr_line))
            print(" ")

            if i < len(main_lines) - 1:                                         # check if next exist
                next_line = main_lines[i + 1]
                next_result = parse_fixed_width_line(next_line)

                if count_backticks(next_line) < 3:                                        # too long name
                    #print(f"Too long name: {curr_result[0]}")
                    new_line = merge_flexible(curr_result, next_result)
                    result = format_row_to_fixed_width(new_line)
                    main_lines[i] = result
                    del(main_lines[i+ 1])
                    del_counter += 1
                    changed_lines.append(i)
                
    for line in main_lines:
        print(line)


    return main_lines

