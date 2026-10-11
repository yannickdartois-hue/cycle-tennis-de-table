"""Faux Google Sheet pour les vérifications : même protocole que synchro-google-sheet/Code.gs."""
import http.server, json, sys
ROOT = sys.argv[2]
STORE = {}
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
    def repondre(s, o):
        b = json.dumps(o).encode(); s.send_response(200)
        s.send_header('Content-Type', 'application/json'); s.end_headers(); s.wfile.write(b)
    def do_GET(s):
        if s.path.startswith('/__store'): return s.repondre(STORE)
        super().do_GET()
    def do_POST(s):
        req = json.loads(s.rfile.read(int(s.headers['Content-Length'])))
        if req.get('key') != 'secret': return s.repondre({'ok': False, 'err': 'mot_de_passe'})
        app = req['app']
        if req['action'] == 'pull':
            return s.repondre({'ok': True, 'docs': [d for k, d in STORE.items() if k.split('|')[0] == app]})
        acc, rej = [], []
        for d in req['docs']:
            k = app + '|' + d['id']; old = STORE.get(k)
            if old and old['updated'] >= d['updated']: rej.append(d['id']); continue
            STORE[k] = d; acc.append(d['id'])
        s.repondre({'ok': True, 'accepted': acc, 'rejected': rej})
http.server.ThreadingHTTPServer(('127.0.0.1', int(sys.argv[1])), H).serve_forever()
