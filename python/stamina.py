import csv
import re

dict_series = []
with open('FFRK_Dungeons.csv', 'rb') as csv_file:
    sheet_reader = csv.reader(csv_file)
    sheet_reader.next()
    for row in sheet_reader:
        series = row[0]
        name = row[1]
        dict_normal = {'stamina': row[2], 'first_time': row[5], 'mastery': row[6], 'reward': 0}
        dict_elite = {'stamina': row[7], 'first_time': row[10], 'mastery': row[11], 'reward': 0}
        if (not(dict_normal['stamina'].isdigit()) or not(dict_elite['stamina'].isdigit())):
            continue
        check_elite = dict_elite['first_time'] + "," + dict_elite['mastery']
        check_normal = dict_normal['first_time'] + "," + dict_normal['mastery']
        expression = re.compile("Stamina Shard x([0-9])")
        match_shard = expression.findall(check_normal)
        for e in match_shard:
            dict_normal['reward'] += int(e)
        match_shard = expression.findall(check_elite)
        for e in match_shard:
            dict_elite['reward'] += int(e)
        ratio_normal = 0.0 if dict_normal['reward'] == 0 else float(dict_normal['reward']) / float(dict_normal['stamina'])
        ratio_elite = 0.0 if dict_elite['reward'] == 0 else float(dict_elite['reward']) / float(dict_elite['stamina'])
        dict_series.append({'Series': series, 'Name': name, 
                            'Normal':{'Stamina': int(dict_normal['stamina']), 'Reward': int(dict_normal['reward']), 'Ratio': ratio_normal},
                            'Elite': {'Stamina': int(dict_elite['stamina']), 'Reward': int(dict_elite['reward']), 'Ratio': ratio_elite}
                          })
    sorted_elite = sorted(dict_series, reverse=True, key=lambda element: element['Elite']['Ratio'])
    for entry in sorted_elite:
        print "{:4} - {:34} Elite : {:3} {:1} {:.2}".format(entry['Series'], entry['Name'], entry['Elite']['Stamina'], entry['Elite']['Reward'], entry['Elite']['Ratio'])
    print ""
    sorted_normal = sorted(dict_series, reverse=True, key=lambda element: element['Normal']['Reward'])
    for entry in sorted_normal:
        print "{:4} - {:34} Normal : {:3} {:1} {:.2}".format(entry['Series'], entry['Name'], entry['Normal']['Stamina'], entry['Normal']['Reward'], entry['Normal']['Ratio'])
