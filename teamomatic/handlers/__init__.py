# -*- coding: utf-8 -*-
#
# Copyright (C) 2011 by Tomasz Wójcik <labs@tomekwojcik.pl>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
"""Common handler-specific things."""

import tornado.web
import json
from copy import copy
from random import sample, shuffle

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('../templates/index.html')
        
    def post(self):
        try:
            payload = json.loads(self.request.body)
        except:
            raise tornado.web.HTTPError(400)
            
        while True:
            try:
                payload.remove('')
            except:
                break
            
        if len(payload) < 2:
            raise tornado.web.HTTPError(400)
        
        teams = []
        for i in range(0, 3):
            _payload = copy(payload)
            shuffle(_payload)
            _teams = []
            while len(_payload) > 1:
                team = sample(_payload, 2)
                _teams.append(team)
                for item in team:
                    _payload.remove(item)
                    
            if len(_payload) == 1:
                new_member = sample(payload, 1)[0]
                while new_member == _payload[0]:
                    new_member = sample(payload, 1)[0]
                _payload.append(new_member)
                _teams.append(_payload)
                
            teams.append(_teams)
            
        self.write({ 'teams': sample(teams, 1)[0]})