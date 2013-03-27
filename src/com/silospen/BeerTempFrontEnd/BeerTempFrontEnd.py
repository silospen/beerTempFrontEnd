from flask import Flask, render_template, json
from os.path import expanduser

app = Flask(__name__)
TEMP_LOG_FILE = expanduser("~") + "/tempLog"
# HTML

@app.route('/')
@app.route('/index.html')
def handleHumans():
    return render_template('index.html')


@app.route('/beerTemp', methods=['get'])
def getBeerTempData():
    with open(TEMP_LOG_FILE, 'r') as logFile:
        return json.dumps([_parseLogLine(line.strip()) for line in logFile.readlines()])


def _parseLogLine(logLine):
    parts = logLine.split('\t')
    return {'time': long(parts[0]), 'sensorId': parts[1], 'temp': float(parts[2]),
            'active': True if parts[3] is "1" else False}


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
