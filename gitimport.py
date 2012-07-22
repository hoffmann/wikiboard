import subprocess
import os
import dateutil.parser

base = os.path.expanduser('~/snippets/python')

filename = 'pyrrd_test.py'
p = subprocess.Popen(['git','log', '-n', '1', '--date=iso', filename] , stdout=subprocess.PIPE, cwd=base)
for line in p.stdout.readlines():
    d = "Date: "
    if line.startswith(d):
        datestring = line[len(d):].strip()
        date = dateutil.parser.parse(datestring)
        date.year
        break

