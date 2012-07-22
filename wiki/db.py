import hashlib 
import os.path 
import codecs 
import datetime

from sqlalchemy import create_engine


class DB(object):
    def __init__(self, url=None):
        if url is None:
            url = 'sqlite:///test.db'
        self.url = url
        self.db = create_engine(self.url)
    
    def create(self, drop=False):
        if drop:
            sql = "DROP TABLE search"
            try:
                self.db.execute(sql)
            except Exception, e:
                pass

        sql = """CREATE VIRTUAL TABLE search USING FTS3(
                        sha1 TEXT,
                        title TEXT,
                        created_at TIMESTAMP,
                        content TEXT
                        );"""
        try:
            self.db.execute(sql)
        except Exception, e:
            pass
    def insert(self, e):
        sql = 'insert into search values(:sha1, :title, :created_at, :content)'
        self.db.execute(sql, dict(sha1=e.sha1, title=e.title, created_at=e.created_at, content=e.content))

    def search(self, q):
        sql = "select sha1, title, created_at, snippet(search) as snippet from search where search match :q order by created_at desc"
        return self.db.execute(sql, dict(q=q)).fetchall()
    
    def list(self):
        sql = "select sha1, title, created_at, substr(content, 0, 200) as snippet from search order by created_at desc"
        return self.db.execute(sql).fetchall()

    def get(self, sha1):
        sql = "select sha1, title, created_at, content from search where sha1 = :sha1"
        return self.db.execute(sql, dict(sha1=sha1)).fetchone()




class Entry(object):
    def __init__(self, fullpath):
        self.fullpath = fullpath
        self.filename= os.path.split(self.fullpath)[1]
        self.created_at = datetime.datetime.fromtimestamp(os.path.getmtime(self.fullpath))
        self.content = codecs.open(self.fullpath, 'r', 'utf-8').read()

        self.ext = os.path.splitext(self.filename)[1]
        print self.ext
        d = {'.py': 'python', '.sql': 'sql', '.js': 'javascript', '.php': 'php'}
        if self.ext in d:
            self.content = '```%s\n%s\n```\n' %(d[self.ext], self.content)

        s = self.filename
        s += self.created_at.isoformat()
        s += self.content.encode('utf-8')
        self.sha1 = hashlib.sha1(s).hexdigest()

        self.title = os.path.splitext(self.filename)[0].replace('-', ' ').replace('_', ' ')


def insert(directory, drop=True, d=None):
    if d is None:
        d = DB()
    d.create(drop=drop)
    for f in os.listdir(directory):
        fullpath = os.path.join(directory, f)
        if os.path.isfile(fullpath) and not f.startswith('.'):
            d.insert(Entry(fullpath))
            
