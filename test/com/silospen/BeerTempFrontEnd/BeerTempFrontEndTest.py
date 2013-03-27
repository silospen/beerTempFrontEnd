import unittest
from com.silospen.BeerTempFrontEnd import BeerTempFrontEnd


class BeerTempFrontEndTest(unittest.TestCase):
    def test_parseLogLine(self):
        logLine = "1364249299\t10-00080216ab17\t19.562\t1"
        self.assertEqual({"time": 1364249299, "sensorId": "10-00080216ab17", "temp": 19.562, "active": True},
            BeerTempFrontEnd._parseLogLine(logLine))
