import sys
from wiki import app
from wiki import db

def main(argv=None):
    #db.insert('/home/ph/wiki')
    db.insert('/home/ph/snippets/python')
    db.insert('/home/ph/snippets/sql', drop=False)
    db.insert('/home/ph/snippets/javascript', drop=False)
    db.insert('/home/ph/snippets/php', drop=False)
    if argv is None:
        argv = sys.argv

    app.debug = True
    app.run(port=5555) 

if __name__ == '__main__':
    main()

