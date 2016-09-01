import csv
import re
check_orbs = {'Ice', 'Wind', 'Fire', 'Earth', 'Lightning', 'Dark', 'Holy', 'Non-Elemental'}
dict_orbs = dict((x, []) for x in check_orbs)
dict_series = [list() for x in range(15)]
with open('FFRK_Dungeons.csv', 'rb') as csv_file:
    sheet_reader = csv.reader(csv_file)
    for row in sheet_reader:
        name = row[0]
        series = row[1]
        stamina = row[7]
        first_time = row[12]
        mastery = row[13]
        check_string = first_time + "," + mastery
        match_orbs = re.search("([0-9])x Greater (\S+) Orb", check_string)
        if match_orbs:
            total_orbs = match_orbs.group(1)
            orb = match_orbs.group(2)
            if (orb in check_orbs):
                dict_match = {'Name': name, 'Series': series, 'Stamina': stamina, 'Number': total_orbs}
                dict_orbs[orb].append(dict_match)
                dict_series[int(series)].append({'Name': name, 'Stamina': stamina, 'Orb': orb, 'Number': total_orbs})
        else:
            if (series.isdigit()):
                dict_series[int(series)].append({'Name': name, 'Stamina': stamina, 'Orb': 'N/A', 'Number': 0})
    for k, v in dict_orbs.iteritems():
        print k + ":"
        for entry in v:
            print "\t{0:2} - {1:35}[{2:2}]: x{3}".format(entry['Series'], entry['Name'], entry['Stamina'], entry['Number'])
    for i, d in enumerate(dict_series):
        print "{0}:".format(i)
        for entry in d:
            print "\t[{0:2}]{1:35}: {2} x{3}".format(entry['Stamina'], entry['Name'], entry['Orb'], entry['Number'])
