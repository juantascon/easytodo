#! /usr/bin/env python2
import os
import unittest
import http

class ApiTest(unittest.TestCase):

    def setUp(self):
        http.app.config['TESTING'] = True
        http.app.store.clear() #empty the db
        self.app = http.app.test_client()
        
    def test_empty_store(self):
        rv = self.app.get('/api/todos')
        assert len(rv.data) > 0, "store is not empty"
        

if __name__ == '__main__':
    unittest.main()