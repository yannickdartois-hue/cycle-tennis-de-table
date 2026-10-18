/* Données du cycle de tennis de table (Lycée G. Pompidou) : séances, schémas, échauffements.
   Partagées par l'écran de cours (index.html) et l'outil complet (tennis-de-table-old.html). */
let SID=0;
const S=118, MX=1.2, MY=0.62, TL=2.74, TW=1.525;
const X=m=>(m+MX)*S, Y=m=>(m+MY)*S;
function arrowPath(a,b,bend){
  const [x1,y1]=[X(a[0]),Y(a[1])],[x2,y2]=[X(b[0]),Y(b[1])];
  if(!bend) return {d:`M${x1},${y1} L${x2},${y2}`};
  const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1;
  const cx=mx-dy/len*bend*S, cy=my+dx/len*bend*S;
  return {d:`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`};
}
function svgDefs(id){
  return `<defs>
   <marker id="${id}b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="c-head-b"/></marker>
   <marker id="${id}r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="c-head-r"/></marker>
   <marker id="${id}g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="c-head-g"/></marker>
   <marker id="${id}o" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="c-head-o"/></marker>
  </defs>`;
}
function tt(sp){
  const id='s'+(++SID);
  const W=(TL+2*MX)*S,H=(TW+2*MY)*S;
  let g=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${sp.alt||'Schéma de table'}" xmlns="http://www.w3.org/2000/svg">${svgDefs(id)}`;
  if(!sp.noTable){
    const half=sp.fold==='R';
    g+=`<rect class="c-edge" x="${X(0)+4}" y="${Y(0)+4}" width="${(half?TL/2:TL)*S}" height="${TW*S}" rx="3"/>`;
    g+=`<rect class="c-floor" x="${X(0)}" y="${Y(0)}" width="${(half?TL/2:TL)*S}" height="${TW*S}" rx="2"/>`;
    g+=`<rect class="c-line" x="${X(0)+1.5}" y="${Y(0)+1.5}" width="${(half?TL/2:TL)*S-3}" height="${TW*S-3}"/>`;
    g+=`<line class="c-mid" x1="${X(0)}" y1="${Y(TW/2)}" x2="${X(half?TL/2:TL)}" y2="${Y(TW/2)}"/>`;
    if(half){
      g+=`<rect class="c-fold" x="${X(TL/2)}" y="${Y(-0.03)}" width="${0.13*S}" height="${(TW+0.06)*S}" rx="2"/><text class="c-label" x="${X(TL/2+0.2)}" y="${Y(TW/2)}" dominant-baseline="central">moitié relevée (mur)</text>`;
    }else{
      g+=`<line class="c-net" x1="${X(TL/2)}" y1="${Y(-0.15)}" x2="${X(TL/2)}" y2="${Y(TW+0.15)}"/>`;
      g+=`<circle class="c-netpost" cx="${X(TL/2)}" cy="${Y(-0.15)}" r="3.5"/><circle class="c-netpost" cx="${X(TL/2)}" cy="${Y(TW+0.15)}" r="3.5"/>`;
    }
  }
  (sp.zones||[]).forEach(z=>{g+=`<rect class="c-zone${z.no?' no':''}" x="${X(z.x)}" y="${Y(z.y)}" width="${z.w*S}" height="${z.h*S}" rx="3"/>`; if(z.t) g+=`<text class="c-zonet" x="${X(z.x+z.w/2)}" y="${Y(z.y)+12}" text-anchor="middle">${z.t}</text>`});
  (sp.targets||[]).forEach(t=>{g+=`<circle class="c-target" cx="${X(t.x)}" cy="${Y(t.y)}" r="${(t.r||0.14)*S}"/>`; if(t.t) g+=`<text class="c-labt" x="${X(t.x)}" y="${Y(t.y)+4}" text-anchor="middle">${t.t}</text>`});
  (sp.baskets||[]).forEach(b=>{g+=`<rect class="c-basket" x="${X(b[0])-11}" y="${Y(b[1])-8}" width="22" height="16" rx="3"/><circle class="c-bounce" cx="${X(b[0])-4}" cy="${Y(b[1])-1}" r="3"/><circle class="c-bounce" cx="${X(b[0])+4}" cy="${Y(b[1])+1}" r="3"/>`});
  (sp.sheets||[]).forEach(b=>{g+=`<rect class="c-sheet" x="${X(b[0])-8}" y="${Y(b[1])-10}" width="16" height="20" rx="2"/><line class="c-sheet" x1="${X(b[0])-4}" y1="${Y(b[1])-4}" x2="${X(b[0])+4}" y2="${Y(b[1])-4}"/><line class="c-sheet" x1="${X(b[0])-4}" y1="${Y(b[1])+1}" x2="${X(b[0])+4}" y2="${Y(b[1])+1}"/><line class="c-sheet" x1="${X(b[0])-4}" y1="${Y(b[1])+6}" x2="${X(b[0])+2}" y2="${Y(b[1])+6}"/>`});
  (sp.runs||[]).forEach(r=>{const p=arrowPath(r[0],r[1],r[2]||0);g+=`<path class="c-run" d="${p.d}" marker-end="url(#${id}r)"/>`});
  (sp.balls||[]).forEach(r=>{const p=arrowPath(r[0],r[1],r[2]===undefined?0.18:r[2]);g+=`<path class="c-ball" d="${p.d}" marker-end="url(#${id}b)"/>`});
  (sp.bounces||[]).forEach(b=>{g+=`<circle class="c-bounce" cx="${X(b[0])}" cy="${Y(b[1])}" r="4.5"/>`});
  (sp.players||[]).forEach(p=>{const cls=p.team==='b'?'c-pb':p.team==='n'?'c-pn':'c-pa';g+=`<circle class="${cls}" cx="${X(p.x)}" cy="${Y(p.y)}" r="${0.15*S}"/><text class="c-pt" x="${X(p.x)}" y="${Y(p.y)}">${p.l||''}</text>`});
  (sp.says||[]).forEach(s=>{g+=`<text class="c-say" x="${X(s.x)}" y="${Y(s.y)}" text-anchor="${s.a||'middle'}">${s.t}</text>`});
  (sp.labels||[]).forEach(s=>{g+=`<text class="${s.w?'c-labt':'c-label'}" x="${X(s.x)}" y="${Y(s.y)}" text-anchor="${s.a||'middle'}" dominant-baseline="central">${s.t}</text>`});
  g+=`</svg>`;
  return g;
}
function salle(sp){
  const id='s'+(++SID),n=sp.n||5,tw=90,th=50,gap=56,W=n*tw+(n-1)*gap+40,H=210;
  let g=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${sp.alt||'Salle'}" xmlns="http://www.w3.org/2000/svg">${svgDefs(id)}`;
  for(let i=0;i<n;i++){
    const x=20+i*(tw+gap),y=80;
    g+=`<rect class="c-tbl" x="${x}" y="${y}" width="${tw}" height="${th}" rx="3"/><rect class="c-tbll" x="${x+2}" y="${y+2}" width="${tw-4}" height="${th-4}"/><line class="c-net" x1="${x+tw/2}" y1="${y-4}" x2="${x+tw/2}" y2="${y+th+4}"/>`;
    g+=`<text class="c-tnum" x="${x+tw/2}" y="${y+th+22}" text-anchor="middle">Table ${i+1}${i===0?' · haut':i===n-1?' · bas':''}</text>`;
    const pl=sp.k===2?[[x-8,y+th/2,'a'],[x+tw+8,y+th/2,'b']]:sp.k===4?[[x-8,y+14,'a'],[x-8,y+th-14,'a'],[x+tw+8,y+14,'b'],[x+tw+8,y+th-14,'b']]:[[x-8,y+th/2,'a'],[x+tw+8,y+th/2,'b'],[x+tw/2,y-14,'n']];
    pl.forEach(p=>{g+=`<circle class="${p[2]==='b'?'c-pb':p[2]==='n'?'c-pn':'c-pa'}" cx="${p[0]}" cy="${p[1]}" r="9"/>`});
    if(i>0) g+=`<path class="c-move" d="M${x+tw/2-14},${y-30} Q${x-gap/2},${y-70} ${x-gap-tw/2+14},${y-30}" marker-end="url(#${id}g)"/>`;
    if(i<n-1) g+=`<path class="c-down" d="M${x+tw/2+12},${y+th+32} Q${x+tw+gap/2},${y+th+64} ${x+tw+gap+tw/2-12},${y+th+32}" marker-end="url(#${id}o)"/>`;
  }
  g+=`<text class="c-label" x="20" y="16">${sp.up||'le 1er de la table monte'}</text><text class="c-label" x="${W-20}" y="${H-6}" text-anchor="end">${sp.down||'le dernier descend'}</text></svg>`;
  return g;
}
const LEGEND=`<div class="legend"><span><i class="dot" style="background:var(--accent)"></i>joueur qui travaille</span><span><i class="dot" style="background:var(--team-b)"></i>serveur / fournisseur / adversaire</span><span><i class="dot" style="background:var(--team-n)"></i>arbitre / observateur / ramasseur</span><span><i class="lineo"></i>trajet de la balle (point = rebond)</span><span><i class="liner"></i>déplacement</span><span>pointillés blancs : ligne médiane (double)</span></div>`;
const H2=TW/2;
const ZCD_A={x:0,y:H2,w:TL/2,h:H2}, ZCD_B={x:TL/2,y:0,w:TL/2,h:H2}, ZRV_A={x:0,y:0,w:TL/2,h:H2}, ZRV_B={x:TL/2,y:H2,w:TL/2,h:H2};
const SCH={
 recordCD:{alt:'Record d’échanges en coup droit dans la diagonale coup droit',zones:[Object.assign({t:'CD de A'},ZCD_A),Object.assign({t:'CD de B'},ZCD_B)],
  players:[{x:-0.4,y:1.15,l:'A'},{x:3.14,y:0.38,l:'B'},{x:1.95,y:1.95,l:'C',team:'n'}],
  balls:[[[-0.25,1.08],[2.15,0.4],-0.15],[[2.99,0.45],[0.6,1.12],-0.15]],bounces:[[2.15,0.4],[0.6,1.12]],
  labels:[{x:2.15,y:1.95,t:'C compte, puis remplace A',a:'start'}],
  cap:'Coup droit sur coup droit dans la diagonale coup droit. C compte un échange chaque fois que la balle revient au serveur (méthode de C.). Rotation toutes les 2 min : C remplace A, A remplace B, B devient compteur.'},
 recordRV:{alt:'Record d’échanges en revers dans la diagonale revers',zones:[Object.assign({t:'RV de A'},ZRV_A),Object.assign({t:'RV de B'},ZRV_B)],
  players:[{x:-0.4,y:0.4,l:'A'},{x:3.14,y:1.15,l:'B'},{x:1.95,y:-0.42,l:'C',team:'n'}],
  balls:[[[-0.25,0.45],[2.15,1.12],0.15],[[2.99,1.1],[0.6,0.42],0.15]],bounces:[[2.15,1.12],[0.6,0.42]],
  labels:[{x:2.15,y:-0.42,t:'C compte les échanges',a:'start'}],
  cap:'Revers sur revers dans la diagonale revers. Frapper devant le ventre, coude en avant, avant-bras qui se déplie, poignet fixe.'},
 huit:{alt:'Le 8 : A joue toujours en diagonale, B toujours en ligne',
  players:[{x:-0.42,y:1.12,l:'A'},{x:3.16,y:0.76,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],
  runs:[[[-0.62,1.0],[-0.62,0.42],0],[[3.36,0.95],[3.36,0.57],0]],
  balls:[[[-0.25,1.08],[2.1,0.42],-0.1],[[2.98,0.62],[0.62,0.4],0.1],[[-0.25,0.44],[2.1,1.12],0.1],[[2.98,0.9],[0.62,1.12],-0.1]],
  bounces:[[2.1,0.42],[0.62,0.4],[2.1,1.12],[0.62,1.12]],
  labels:[{x:-1.1,y:-0.42,t:'A : toujours en diagonale',a:'start'},{x:3.85,y:-0.42,t:'B : toujours en ligne',a:'end'},{x:1.58,y:1.97,t:'C compte',a:'start'}],
  cap:'Le « 8 » (C., T.) : A joue diagonale, B joue ligne. A alterne coup droit et revers, B se déplace d’un côté à l’autre. On inverse les rôles à chaque rotation.'},
 rupture:{alt:'Rupture sur balle haute après 5 échanges',zones:[{x:2.05,y:0.06,w:0.62,h:0.6,t:'cible'}],
  players:[{x:-0.42,y:1.12,l:'A'},{x:3.16,y:0.4,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],
  balls:[[[2.98,0.45],[0.85,1.05],-0.55],[[-0.25,1.05],[2.36,0.36],-0.05]],bounces:[[0.85,1.05],[2.36,0.36]],
  says:[{x:-0.35,y:1.62,t:'« Banco ! »',a:'start'}],labels:[{x:1.1,y:-0.42,t:'5e échange : B renvoie une balle haute',a:'middle'},{x:1.58,y:1.97,t:'C compte et note les ruptures',a:'start'}],
  cap:'Après 5 échanges en coup droit, B donne une balle haute au centre. A annonce « Banco ! », se place et frappe fort vers la cible. 1 point par frappe gagnante.'},
 service4:{alt:'Service dans 4 zones',zones:[{x:1.45,y:0.05,w:0.6,h:0.66,t:'1 court'},{x:2.1,y:0.05,w:0.59,h:0.66,t:'2 long'},{x:1.45,y:0.81,w:0.6,h:0.66,t:'3 court'},{x:2.1,y:0.81,w:0.59,h:0.66,t:'4 long'}],
  players:[{x:-0.42,y:1.1,l:'A'},{x:3.16,y:0.76,l:'B',team:'b'},{x:3.0,y:-0.42,l:'C',team:'n'}],baskets:[[-0.95,1.75]],
  balls:[[[-0.27,1.05],[0.5,0.95],0.05],[[0.5,0.95],[2.4,0.38],-0.12],[[2.98,0.76],[0.7,0.76],0.12]],bounces:[[0.5,0.95],[2.4,0.38],[0.7,0.76]],
  labels:[{x:-0.72,y:1.75,t:'balles',a:'start'},{x:2.75,y:-0.42,t:'C ramasse',a:'end'},{x:3.16,y:1.97,t:'B remet au centre',a:'end'}],
  cap:'A annonce la zone (1 à 4), sert, B renvoie doucement au centre. 10 services puis rotation : C sert, A reçoit, B ramasse. La balle rebondit d’abord dans le camp du serveur.'},
 serv3:{alt:'Service puis troisième balle à l’opposé',zones:[{x:2.1,y:0.05,w:0.59,h:0.66,t:'1'},{x:2.1,y:0.81,w:0.59,h:0.66,t:'3'}],
  players:[{x:-0.42,y:1.1,l:'A'},{x:3.16,y:0.6,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],sheets:[[1.75,1.97]],
  balls:[[[-0.27,1.05],[0.45,1.0],0.05],[[0.45,1.0],[2.4,0.38],-0.12],[[2.98,0.6],[0.8,0.76],0.1],[[-0.2,0.85],[2.4,1.14],0.1]],bounces:[[0.45,1.0],[2.4,0.38],[0.8,0.76],[2.4,1.14]],
  labels:[{x:-1.1,y:-0.42,t:'1 · A sert dans une zone',a:'start'},{x:3.85,y:-0.42,t:'2 · B remet au centre',a:'end'},{x:1.95,y:1.97,t:'3 · A frappe à l’opposé · C note',a:'start'}],
  cap:'Construire le point dès le service (C.) : service dans une zone, remise au centre, 3e balle à l’opposé de la 1re frappe. C note une croix si le point est gagné, 0 sinon.'},
 servCL:{alt:'Service court puis attaque longue',zones:[{x:1.45,y:0.18,w:0.42,h:1.17,t:'court'},{x:2.28,y:0.06,w:0.41,h:1.41,t:'long'}],
  players:[{x:-0.42,y:0.95,l:'A'},{x:3.16,y:0.76,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],
  balls:[[[-0.27,0.92],[0.95,0.85],0.04],[[0.95,0.85],[1.65,0.6],-0.06],[[2.98,0.76],[0.7,0.5],0.1],[[-0.2,0.6],[2.48,1.15],0.12]],bounces:[[0.95,0.85],[1.65,0.6],[0.7,0.5],[2.48,1.15]],
  labels:[{x:-1.1,y:-0.42,t:'service court coupé',a:'start'},{x:3.85,y:-0.42,t:'B remet',a:'end'},{x:1.58,y:1.97,t:'C note : point en 2 frappes ?',a:'start'}],
  cap:'Le service court (2 rebonds possibles chez B) empêche B d’attaquer. A attaque ensuite long, loin du receveur.'},
 remise:{alt:'Remise de service dans la zone annoncée',zones:[{x:1.45,y:0.18,w:0.42,h:1.17,t:'court'},{x:2.28,y:0.06,w:0.41,h:1.41,t:'long'}],
  players:[{x:-0.42,y:0.76,l:'A'},{x:3.16,y:1.1,l:'S',team:'b'},{x:1.37,y:-0.42,l:'C',team:'n'}],baskets:[[3.75,1.75]],
  balls:[[[2.99,1.05],[2.3,0.95],-0.04],[[2.3,0.95],[0.55,0.45],0.1],[[-0.27,0.72],[1.66,0.9],-0.08]],bounces:[[2.3,0.95],[0.55,0.45],[1.66,0.9]],
  says:[{x:1.6,y:-0.42,t:'« court ! »',a:'start'}],labels:[{x:-1.1,y:1.97,t:'A remet dans la zone annoncée par C',a:'start'},{x:3.85,y:-0.42,t:'S sert, varié',a:'end'}],
  cap:'S sert (court ou long, avec ou sans effet). C annonce « court » ou « long » au moment du service. A remet dans la zone annoncée. 10 services, puis rotation.'},
 match3:{alt:'Match à trois par table : deux jouent, un arbitre',players:[{x:-0.42,y:0.95,l:'A'},{x:3.16,y:0.55,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],sheets:[[1.75,1.97]],
  balls:[[[-0.27,0.92],[2.2,0.5],-0.1],[[2.99,0.6],[0.6,1.0],-0.1]],bounces:[[2.2,0.5],[0.6,1.0]],
  labels:[{x:1.95,y:1.97,t:'C arbitre : score du serveur en premier',a:'start'},{x:-1.1,y:-0.42,t:'1er à 11 ou 4 min',a:'start'}],
  cap:'Groupe de 3 : B–C (A arbitre), A–C (B arbitre), A–B (C arbitre). Le 1er de la table monte, le 3e descend. L’arbitre annonce le score du serveur en premier, ce qui autorise le service.'},
 demi:{alt:'Jamais deux fois de suite sur la même demi-table',zones:[{x:1.45,y:0.06,w:1.24,h:0.63,t:'1re frappe'},{x:1.45,y:0.83,w:1.24,h:0.63,t:'2e frappe'}],
  players:[{x:-0.42,y:0.95,l:'A'},{x:3.16,y:0.4,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],
  runs:[[[3.3,0.55],[3.3,1.05],0]],
  balls:[[[-0.27,0.92],[2.2,0.38],-0.1],[[-0.27,0.98],[2.2,1.15],0.1]],bounces:[[2.2,0.38],[2.2,1.15]],
  labels:[{x:1.58,y:1.97,t:'C arbitre et vérifie l’alternance',a:'start'}],
  cap:'Chaque joueur doit changer de demi-table (gauche/droite) à chacune de ses frappes. Deux fois de suite au même endroit = point perdu. Variante profondeur : alterner court et long.'},
 coupfort:{alt:'Jouer seulement avec son coup fort',zones:[Object.assign({t:'côté revers'},ZRV_A,{no:true})],
  players:[{x:-0.42,y:1.1,l:'A'},{x:3.16,y:0.6,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],
  runs:[[[-0.45,0.95],[-0.62,0.45],0.1]],
  balls:[[[2.99,0.6],[0.62,0.4],0.1],[[-0.5,0.35],[2.2,0.95],0.08]],bounces:[[0.62,0.4],[2.2,0.95]],
  labels:[{x:-1.1,y:-0.42,t:'A pivote pour frapper en coup droit',a:'start'},{x:1.58,y:1.97,t:'C arbitre',a:'start'}],
  cap:'Match à thème : je ne joue qu’avec mon coup fort (choisi au début du match). Sur une balle côté faible, je me déplace pour la jouer avec mon coup fort.'},
 double:{alt:'Double : service de la demi-table droite vers la demi-table droite',zones:[{x:0,y:H2,w:TL/2,h:H2,t:'droite de A1'},{x:TL/2,y:0,w:TL/2,h:H2,t:'droite de B1'}],
  players:[{x:-0.42,y:1.15,l:'A1'},{x:-0.9,y:0.42,l:'A2'},{x:3.16,y:0.38,l:'B1',team:'b'},{x:3.64,y:1.1,l:'B2',team:'b'}],
  runs:[[[-0.5,1.3],[-0.95,1.62],0.05],[[-0.95,0.58],[-0.6,0.98],0]],
  balls:[[[-0.27,1.1],[0.55,1.12],0.04],[[0.55,1.12],[2.2,0.4],-0.1]],bounces:[[0.55,1.12],[2.2,0.4]],
  labels:[{x:-1.1,y:-0.42,t:'A1 sert puis s’écarte, A2 entre',a:'start'},{x:3.85,y:1.97,t:'ordre : A1 → B1 → A2 → B2',a:'end'}],
  cap:'Double : le service part de la demi-table droite du serveur et arrive dans la demi-table droite du receveur (ligne médiane). Ensuite, les partenaires frappent à tour de rôle : je frappe, je sors, mon partenaire entre.'},
 doubleR:{alt:'Continuité en double, frappes alternées',zones:[Object.assign({t:''},ZCD_A),Object.assign({t:''},ZCD_B)],
  players:[{x:-0.42,y:1.15,l:'A1'},{x:-0.9,y:0.62,l:'A2'},{x:3.16,y:0.38,l:'B1',team:'b'},{x:3.64,y:0.9,l:'B2',team:'b'}],
  runs:[[[-0.5,1.3],[-0.95,1.62],0.05],[[-0.95,0.75],[-0.6,1.0],0]],
  balls:[[[-0.27,1.1],[2.15,0.4],-0.12],[[2.99,0.45],[0.6,1.12],-0.12]],bounces:[[2.15,0.4],[0.6,1.12]],
  labels:[{x:-1.1,y:-0.42,t:'je frappe, je sors par l’arrière',a:'start'},{x:3.85,y:1.97,t:'le partenaire entre',a:'end'}],
  cap:'Continuité en double dans la diagonale coup droit : chaque équipe frappe à tour de rôle. Le joueur qui vient de frapper sort par l’arrière, du côté de son revers, pour laisser la place.'},
 obs:{alt:'Match d’observation',players:[{x:-0.42,y:0.95,l:'A'},{x:3.16,y:0.55,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],sheets:[[1.75,1.97]],
  zones:[{x:1.45,y:0.06,w:1.24,h:0.63,t:'RV de B ?'},{x:1.45,y:0.83,w:1.24,h:0.63,t:'CD de B ?'}],
  balls:[[[-0.27,0.92],[2.2,0.38],-0.1],[[2.99,0.6],[0.6,1.0],-0.1]],bounces:[[2.2,0.38],[0.6,1.0]],
  labels:[{x:1.95,y:1.97,t:'C note où et comment B perd ses points',a:'start'}],
  cap:'C coache A : il note chaque point perdu par B (coup droit/revers, court/long, sur service ou en échange). Au bout de 2 min, temps mort de 30 s : C donne à A un seul conseil.'},
 bloc:{alt:'Attaque coup droit contre bloc',zones:[Object.assign({t:''},ZCD_B)],
  players:[{x:-0.55,y:1.15,l:'A'},{x:3.08,y:0.42,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],
  balls:[[[-0.38,1.08],[2.25,0.42],-0.12],[[2.94,0.47],[0.75,1.1],-0.1]],bounces:[[2.25,0.42],[0.75,1.1]],
  labels:[{x:-1.1,y:-0.42,t:'A attaque (frappe ou lifté)',a:'start'},{x:3.85,y:-0.42,t:'B bloque, près de la table',a:'end'},{x:1.58,y:1.97,t:'C compte',a:'start'}],
  cap:'A attaque en coup droit dans la diagonale, B bloque (raquette fermée, sans armer, balle prise tôt). Record d’attaques consécutives, puis rotation.'},
 relais:{alt:'Rencontre entre deux binômes en relais',players:[{x:-0.42,y:0.95,l:'A1'},{x:3.16,y:0.55,l:'B1',team:'b'},{x:0.95,y:-0.42,l:'A2'},{x:1.8,y:1.97,l:'B2',team:'b'}],sheets:[[1.3,-0.42],[2.15,1.97]],
  balls:[[[-0.27,0.92],[2.2,0.5],-0.1],[[2.99,0.6],[0.6,1.0],-0.1]],bounces:[[2.2,0.5],[0.6,1.0]],
  labels:[{x:1.55,y:-0.42,t:'A2 : arbitre (annonce) et coach de A1',a:'start'},{x:2.4,y:1.97,t:'B2 : marqueur et coach de B1',a:'start'}],
  cap:'Binôme A contre binôme B. Pendant le simple, les deux partenaires arbitrent : l’un annonce le score, l’autre le note ; entre les manches et au temps mort, chacun coache son partenaire.'},
 panier:{alt:'Table à moitié relevée : service et régularité contre le mur',fold:'R',
  players:[{x:-0.42,y:1.0,l:'A'},{x:-0.6,y:-0.3,l:'B',team:'n'}],baskets:[[-0.95,1.8]],
  balls:[[[-0.27,0.98],[0.75,0.55],-0.12],[[1.36,0.62],[0.5,1.05],-0.15]],bounces:[[0.75,0.55],[0.5,1.05]],
  labels:[{x:-0.4,y:-0.3,t:'B compte et passe les balles',a:'start'}],
  cap:'12e table : une moitié relevée sert de mur. Record de frappes contre le mur, ou service au panier. 2 élèves maximum.'},
 lancer:{alt:'Renvoi sur balle lancée à la main',zones:[{x:1.45,y:0.06,w:1.24,h:1.41,t:'zone large'}],
  players:[{x:-0.42,y:0.95,l:'A'},{x:1.6,y:-0.42,l:'L',team:'b'},{x:3.16,y:0.76,l:'R',team:'n'}],baskets:[[2.1,-0.42]],
  balls:[[[1.47,-0.3],[0.55,0.85],0.15],[[-0.27,0.92],[2.1,0.76],-0.08]],bounces:[[0.55,0.85],[2.1,0.76]],
  labels:[{x:3.85,y:1.97,t:'R ramasse et rend les balles à L',a:'end'}],
  cap:'L, à côté du filet, lance la balle à la main pour qu’elle rebondisse devant A. A la renvoie en coup droit dans la moitié adverse. 10 balles, puis rotation.'},
 trois:{alt:'Construction annoncée en trois frappes',zones:[{x:1.45,y:0.06,w:0.5,h:0.63,t:'1'},{x:2.2,y:0.83,w:0.49,h:0.63,t:'2'},{x:2.2,y:0.06,w:0.49,h:0.63,t:'3'}],
  players:[{x:-0.42,y:0.95,l:'A'},{x:3.16,y:0.76,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],
  balls:[[[-0.27,0.92],[1.7,0.4],-0.08],[[-0.27,0.98],[2.45,1.15],0.06],[[-0.27,0.9],[2.45,0.38],-0.1]],bounces:[[1.7,0.4],[2.45,1.15],[2.45,0.38]],
  says:[{x:-1.1,y:-0.42,t:'« court revers, long coup droit, long revers »',a:'start'}],labels:[{x:1.58,y:1.97,t:'C vérifie l’annonce et compte',a:'start'}],
  cap:'A annonce sa construction en 3 frappes, puis la joue. B remet au centre sans chercher à gagner. Variante : B joue le point normalement après la 2e frappe.'},
 serv10:{alt:'Dix services : gagner le point vite',players:[{x:-0.42,y:1.1,l:'A'},{x:3.16,y:0.6,l:'B',team:'b'},{x:1.37,y:1.97,l:'C',team:'n'}],sheets:[[1.75,1.97]],baskets:[[-0.95,1.75]],
  balls:[[[-0.27,1.05],[0.45,1.0],0.05],[[0.45,1.0],[2.4,0.4],-0.12]],bounces:[[0.45,1.0],[2.4,0.4]],
  labels:[{x:1.95,y:1.97,t:'C annonce et note : 4, 3, 2, 1 ou 0',a:'start'},{x:-1.1,y:-0.42,t:'A sert 10 fois de suite',a:'start'}],
  cap:'« Mettre l’adversaire en difficulté dès le service » (C.) : point gagné sur le service = 4, à la 2e frappe = 3, à la 3e = 2, à la 4e = 1, perdu = 0. B joue le point normalement.'},
 salle3:{salle:true,k:3,n:5,alt:'Montante-descendante par groupes de 3',cap:'Groupes de 3 : après le tour (3 matchs), le 1er de chaque table monte d’une table, le 3e descend. À la table 1, le 1er reste ; à la dernière, le 3e reste.'},
 salle4:{salle:true,k:4,n:5,alt:'Montante-descendante par binômes',up:'le binôme gagnant monte',down:'le binôme perdant descend',cap:'Deux binômes par table : après la rencontre en relais, le binôme gagnant monte d’une table, le perdant descend.'}
};
const EVAL_SHORT={e1:'AFL1 élément 1 : actions techniques d’attaque et de défense (/8)',e2:'AFL1 élément 2 : choix au regard du rapport de force (/4)',a2:'AFL2 : se préparer et s’entraîner',a3:'AFL3 : rôles (coach-partenaire, double, arbitre)'};
const ROT3='Groupe de 3 : A et B jouent, C compte et ramasse. Rotation toutes les 2 min dans le sens des aiguilles d’une montre : C remplace A, A passe en B, B devient compteur. Chacun joue 10 min sur 15.';
const CR_CD='Coup droit : frapper la balle sur le côté et devant soi, pied gauche devant (droitier), rotation des épaules, raquette légèrement fermée, accompagner vers la cible (C.).';
const CR_RV='Revers : frapper devant le ventre, coude en avant, avant-bras qui se déplie, poignet fixe, appuis parallèles.';
const WARMUPS=[
 {t:'Échauffement guidé (S1–S2)',d:'10 min',k:'Menée par le prof',disp:'Par groupe de table, autour de sa table. 1 balle par table, numérotée (on ne touche pas la balle d’une autre table).',deroul:['2 min · Articulaire : poignets (cercles, flexions), épaules (moulinets avant et arrière), rotations du buste, nuque.','2 min · Déplacements le long de la table : posture de base (pieds plus écartés que les épaules, genoux fléchis, buste penché), pas chassés coup droit–revers, fentes latérales, petits sauts sur place.','3 min · Jongles : 10 en coup droit, 10 en revers, puis alternés, puis en marchant autour de la table.','3 min · Échanges libres au centre de la table, trajectoires hautes puis plus tendues.'],cons:['Balle au sol : on s’arrête et on la ramasse (risque d’entorse si on marche dessus).','Jamais de balle récupérée sur la table voisine pendant un échange.'],reus:'Chaque groupe enchaîne les 4 temps sans arrêt.'},
 {t:'Jongles',d:'3–5 min',k:'Contact balle-raquette · L. N1',disp:'Chacun sa balle, à côté de sa table.',deroul:['10 jongles en coup droit, 10 en revers.','15 jongles en alternant les faces.','Parcours en jonglant autour de la table, balle sous la hauteur des épaules.'],cons:['Raquette horizontale, on pousse plus qu’on ne frappe.','Appuis le plus immobiles possible : c’est l’élève qui dirige la balle.'],reus:'Une série de 10 dans chaque version.'},
 {t:'Record d’échanges en 1 min',d:'4 min',k:'Continuité · T., C.',sch:'recordCD',disp:'Par 2 à la table, le 3e compte.',deroul:['1 min libre, 1 min trajectoires hautes, 1 min trajectoires basses (« le plus près possible du filet »), 1 min « le plus vite possible ».','Le compteur annonce le total à la fin de chaque minute ; on note le record.'],cons:['Trajectoires basses : raquette plus fermée, balle prise juste après le rebond.','Trajectoires hautes : raquette ouverte, balle prise en descente.'],reus:'Battre son record à chaque modalité.'},
 {t:'La tournante',d:'4 min',k:'Déplacement · T.',disp:'Tout le groupe de table (3 ou 4), 1 balle.',deroul:['Chacun frappe une fois puis tourne autour de la table (par la droite) pour se replacer de l’autre côté.','D’abord sans élimination, en comptant les frappes du groupe.','Puis avec élimination : celui qui rate sort ; les 2 derniers font un match en 3 points.'],cons:['Je frappe et je pars aussitôt : je ne regarde pas ma balle.','Trajectoire haute et au centre : je laisse du temps au suivant.'],reus:'20 frappes du groupe sans faute.'},
 {t:'Deux frappes chacun, en ligne',d:'4 min',k:'Placement et déplacement · T.',disp:'Groupe de 4 : 2 de chaque côté, l’un derrière l’autre.',deroul:['Chaque joueur fait 2 frappes puis se décale pour laisser la place au suivant.','Puis 1 frappe chacun, d’abord sans précision, puis dans la diagonale coup droit, puis dans la diagonale revers.'],cons:['Sortir sur le côté, jamais devant la table.'],reus:'10 passages sans faute.'},
 {t:'Déplacements à vide (shadow)',d:'2 min',k:'Coordination',disp:'Chacun derrière sa table, sans balle.',deroul:['Le coach montre coup droit ou revers ; tout le groupe se déplace en pas chassés et fait le geste.','Pivot : sur le côté revers, je tourne autour de la balle pour jouer coup droit.'],cons:['Je reviens au centre après chaque geste.','Posture basse, poids sur l’avant des pieds.'],reus:'20 gestes enchaînés sans perdre la posture.'},
 {t:'Échauffement d’avant-rencontre (S8–S9)',d:'10 min',k:'Jour de l’épreuve · AFL2',disp:'Les deux binômes de la table, comme en compétition.',deroul:['3 min · Général et articulaire, chaque binôme seul.','3 min · Échanges libres contre le binôme adverse (en compétition, l’échauffement à la table dure 2 min).','2 min · Services : 5 services chacun dans les zones choisies pour le match.','2 min · Double : continuité en frappes alternées.'],cons:['Le binôme mène seul son échauffement : c’est l’élément « préparation » de l’AFL2.','On profite des échanges pour repérer le coup fort et le coup faible de l’adversaire.'],reus:'Les 4 joueurs sont prêts en 10 min, sans aide.'}
];
const EX={
 record:(v)=>({bas:'Échanges au centre, trajectoire haute, record en 1 min (banque · Continuité N1).',t:'Fil rouge 1 · Record d’échanges',k:'Continuité · C., T.',sch:'recordCD',
  disp:'11 tables, groupes de 3 (une table à 2) ; 1 balle numérotée par table, une balle de réserve dans la poche du compteur. La 12e table, moitié relevée, accueille 2 élèves sur la fiche Débutants si besoin.',
  four:ROT3,
  deroul:v.deroul||['1 min en coup droit dans la diagonale coup droit, 1 min en revers dans la diagonale revers.','Le compteur annonce le total à la fin de la minute et note le record de chaque paire sur la fiche de la table.','Balle perdue : on repart aussitôt avec la balle de réserve, le comptage continue.'],
  cons:[CR_CD,CR_RV].concat(v.cons||[]),
  reus:v.reus||'Record de la paire : 30 échanges en 1 min en coup droit, 20 en revers (repères de départ, à ajuster après la séance).',
  moins:'Jouer au centre de la table, trajectoire plus haute.',plus:v.plus||'Balle prise au sommet du rebond, trajectoire plus tendue.'}),
 huit:(v)=>({bas:'Record dans la diagonale coup droit, puis revers (banque · Continuité N2) : pas de déplacement tant que la diagonale ne tient pas 15 échanges.',t:'Fil rouge 1 · Le 8',k:'Continuité et déplacement · C., T.',sch:'huit',
  disp:'Groupes de 3, 11 tables. Une balle par table.',four:ROT3+' Celui qui joue en diagonale passe en ligne à la rotation suivante.',
  deroul:['A joue toujours en diagonale, B toujours en ligne : A alterne coup droit et revers, B se déplace d’un côté à l’autre.','2 × 1 min par rotation, le compteur note le meilleur score.'].concat(v.deroul||[]),
  cons:['Revenir au centre de sa demi-largeur entre deux frappes : pas chassés, jamais de pas croisés.','Changer d’orientation des épaules, pas seulement du bras.'].concat(v.cons||[]),
  reus:v.reus||'15 échanges de suite sans faute dans chaque rôle.',moins:'Le joueur en ligne reste fixe et joue au centre.',plus:v.plus||'Celui qui joue en ligne choisit librement (le 8 irrégulier).'}),
 rupture:(v)=>({bas:'Frapper la balle haute lancée à la main par le partenaire (banque · Attaque N1), sans échange avant.',t:'Fil rouge 1 · Le 8, puis la rupture',k:'Continuité → rupture · C. S3, B. SRP3',sch:'rupture',
  disp:'Groupes de 3, 11 tables. Une cible (feuille A5 ou plot plat) dans un coin de la table adverse.',four:ROT3+' Le compteur note aussi les ruptures réussies.',
  deroul:['5 échanges en coup droit (ou le 8 pour les plus forts), puis B donne une balle haute au centre.','A annonce « Banco ! » avant de frapper et tente un coup gagnant vers la cible.','On inverse les rôles après 5 ruptures.'].concat(v.deroul||[]),
  cons:['Balle attaquable : haute, lente, qui tombe près du filet (B. : « jouer vite » n’est pas « jouer fort »).','Se placer d’abord (petits pas), frapper ensuite, au sommet du rebond, vers le bas.'],
  reus:v.reus||'5 ruptures gagnantes sur 10 (balle non renvoyée).',moins:'Rupture après 3 échanges ; zone d’arrivée = toute la moitié de table.',plus:'B choisit lui-même quand il donne la balle haute, et la bloque si elle est mal frappée.'}),
 service4:(v)=>({bas:'Du lâcher au service réglementaire (banque · Service N1), puis 2 zones seulement.',t:'Fil rouge 2 · Service dans 4 zones',k:'Service · C. S3, T. L1',sch:'service4',
  disp:'Groupes de 3, 11 tables. Une boîte de 6 balles par table (on sert les 6 d’affilée, on ramasse ensuite).',four:'A sert 10 fois, B remet doucement au centre, C ramasse et juge si le service est réglementaire. Rotation après 10 services : C sert, A reçoit, B ramasse.',
  deroul:['Règles du service (2 min, démonstration) : balle posée sur la paume ouverte, lancée verticalement d’au moins 16 cm, frappée en descendant, derrière la ligne de fond, toujours visible ; elle rebondit d’abord dans le camp du serveur. Filet touché sur un bon service : on rejoue (let).','A annonce la zone (1 à 4) avant chaque service.'].concat(v.deroul||[]),
  cons:['Pieds décalés, épaule libre vers la table ; la raquette va vers l’avant et vers le bas.','Premier rebond près de sa ligne de fond pour servir long, près du filet pour servir court.'],
  reus:v.reus||'7 services sur 10 réglementaires et dans la zone annoncée.',moins:'Deux zones seulement (gauche ou droite).',plus:'Service avec effet coupé : raquette ouverte, on brosse le dessous de la balle.'}),
 serv3:(v)=>({bas:'Service dans 2 zones (gauche ou droite), le receveur rattrape la balle : pas de 3e balle tant que le service n’est pas réglementaire.',t:'Fil rouge 2 · Service et 3e balle',k:'Construire le point dès le service · C.',sch:'serv3',
  disp:v.disp||'Groupes de 3, 11 tables. Une boîte de 6 balles par table.',four:v.four||'A sert, B remet au centre, C observe et note une croix si A gagne le point en 3 frappes, 0 sinon. Rotation après 6 services.',
  deroul:['A sert dans une zone, B remet au centre de la table sans chercher à gagner.','A joue sa 3e balle à l’opposé de son service (ligne si service diagonale, long si service court) et tente de marquer.'].concat(v.deroul||[]),
  cons:['Avant de servir, je sais où ira ma 3e balle.','Après le service, je reviens tout de suite en position d’attente.'].concat(v.cons||[]),
  reus:v.reus||'4 points gagnés en 3 frappes sur 6.',moins:'B remet toujours au même endroit (coup droit de A).',plus:v.plus||'B remet où il veut : A doit lire et choisir.'}),
 servCL:(v)=>({bas:'Service long dans la moitié de table, remise au centre, 3e balle dans toute la table.',t:'Fil rouge 2 · Service court, attaque longue',k:'Service et 3e balle · C. S4',sch:'servCL',
  disp:v.disp||'Groupes de 3, 11 tables. Une boîte de 6 balles par table.',four:v.four||'A sert, B remet, C note si A marque en 2 frappes ou moins après son service. Rotation après 6 services.',
  deroul:['A sert court coupé (la balle pourrait rebondir deux fois chez B), B remet comme il peut.','A attaque la remise en jouant long, loin de B.'].concat(v.deroul||[]),
  cons:['Service court : premier rebond près du filet, raquette ouverte, geste court.','Sur la remise, se placer avant de frapper : le pied du côté de la frappe recule.'].concat(v.cons||[]),
  reus:v.reus||'3 points marqués en 2 frappes sur 6 services.',moins:'Service long, puis attaque.',plus:'B a le droit d’attaquer un service trop long : A doit vraiment servir court.'}),
 remise:(v)=>({bas:'Remettre au centre un service lent et long (banque · Remise N1).',t:'Remise de service dans la zone annoncée',k:'Remise · référentiel D4 « le service neutralise l’attaque »',sch:'remise',
  disp:'Groupes de 3, 11 tables. Une boîte de 6 balles par table.',four:'S sert varié (court, long, avec ou sans effet), A remet, C annonce « court » ou « long » au moment du service et compte les réussites. Rotation après 10 services.',
  deroul:['10 services : A remet dans la zone annoncée par C.','Puis 10 services : A choisit lui-même — remise courte sur service court, attaque sur service long.'],
  cons:['Attendre le service genoux fléchis, raquette devant soi, au milieu de la table.','Service coupé : ouvrir la raquette et accompagner vers l’avant. Service long : reculer d’un pas et attaquer.'],
  reus:'6 remises sur 10 dans la zone annoncée ; puis 5 bons choix sur 10.',moins:'Le serveur sert lent, sans effet.',plus:'Le serveur joue le point après la remise : la remise doit empêcher son attaque.'}),
 serv10:(v)=>({bas:'Le receveur remet sans attaquer ; le serveur marque des points seulement si la 3e balle est dans la table.',t:v.t||'10 services pour marquer',k:'Service · C. « Mettre l’adversaire en difficulté dès le service »',sch:'serv10',
  disp:v.disp||'Groupes de 3, 11 tables. Une boîte de 6 balles par table.',four:v.four||'A sert 10 fois de suite, B joue le point normalement, C arbitre : il annonce et note les points de A (4, 3, 2, 1 ou 0). Puis B sert, C reçoit, A arbitre ; puis C sert.',
  deroul:['Point gagné sur le service = 4, à la 2e frappe du serveur = 3, à la 3e = 2, à la 4e = 1, point perdu = 0.','Classement des 3 joueurs à la fin.'].concat(v.deroul||[]),
  cons:['Varier : on ne gagne pas 10 points avec le même service.','Chercher à marquer vite, mais pas n’importe comment : une faute directe vaut 0.'],
  reus:v.reus||'25 points sur 10 services.',moins:'Le receveur remet sans attaquer.',plus:'Le serveur n’a que 2 services du même type.'}),
 obs:(v)=>({bas:'Même match ; le coach note seulement « coup droit » ou « revers » pour chaque point perdu.',t:'Match d’observation, coaché',k:'Repérer forces et faiblesses · AFL2, AFL3',sch:'obs',
  disp:'Groupes de 3, 11 tables. Une fiche d’observation par table.',four:'A et B jouent un match de 4 min. C observe B (le futur adversaire de A) et note où il perd ses points ; au temps mort de 30 s, il donne un seul conseil à A. Rotation : 3 matchs, chacun joue 2 fois et coache 1 fois.',
  deroul:['C note chaque point perdu par B : coup droit ou revers, court ou long, sur service, sur remise ou en échange.','À 2 min, temps mort de 30 s : C dit à A « joue sur… ».','Fin du match : C dit à B son point fort et son point faible.'],
  cons:['Un seul conseil, simple, à appliquer tout de suite.','Le coach parle de l’adversaire (« son revers est faible ») plutôt que de la technique de son joueur.'],
  reus:'Le coach a noté au moins 6 points et a repéré un point fort et un point faible.',moins:'Le coach note seulement coup droit ou revers.',plus:'Le coach note aussi ce qui marche pour A, et prévoit un conseil de rechange.'}),
 bloc:(v)=>({bas:'Record en diagonale coup droit ; le partenaire renvoie haut au lieu de bloquer.',t:'Fil rouge 1 · Attaque contre bloc',k:'Rythme · contrer le coup fort adverse',sch:'bloc',
  disp:'Groupes de 3, 11 tables.',four:ROT3+' Celui qui bloque attaque à la rotation suivante.',
  deroul:['A attaque en coup droit dans la diagonale coup droit, B bloque près de la table ; record d’attaques consécutives.','Puis B a le droit de bloquer une fois en ligne : A doit se replacer.'],
  cons:['Bloquer : rester près de la table, raquette fermée devant soi, sans armer, prendre la balle tôt.','Attaquer : épaules tournées, frappe vers l’avant et un peu vers le haut si la balle est basse.'],
  reus:'Le bloqueur renvoie 6 attaques de suite.',moins:'L’attaquant frappe à mi-vitesse.',plus:'Le bloqueur peut contre-attaquer une attaque trop haute.'}),
 trois:(v)=>({bas:'Jamais deux fois au même endroit, en coopération (banque · Placement N2) ; construction en 2 frappes.',t:'Fil rouge 2 · Construction annoncée en 3 frappes',k:'Projet de jeu · C. S6',sch:'trois',
  disp:'Groupes de 3, 11 tables (on garde le volume de frappes ; les binômes se retrouvent pour la rencontre).',four:'Groupe de 3 : A travaille, B est l’adversaire, C coache A. Rotation toutes les 2 min 30 : C passe en A, A en B, B en C. Chacun travaille 5 min et coache 5 min.',
  deroul:['A annonce sa construction (« je sers court sur le revers, puis long sur le coup droit, puis long sur le revers »), puis la joue. B remet au centre.','Après 5 essais : B joue le point normalement dès la 2e frappe.','C vérifie l’annonce et compte les réussites ; entre deux séries, il aide A à choisir une construction qui gêne vraiment B.'],
  cons:['Construire en fonction de l’adversaire : commencer sur son point faible, finir à l’opposé.'],
  reus:'3 constructions réussies sur 5, puis 2 points gagnés sur 5 contre une vraie opposition.',moins:'Construction en 2 frappes.',plus:'Le coach impose la construction au dernier moment.'}),
 doubleR:(v)=>({bas:'Tournante à 4 (banque · Double N1) : apprendre à sortir après sa frappe.',t:'Continuité en double',k:'Double · C. S5, T.',sch:'doubleR',
  disp:'Deux binômes par table (8 tables). Les 4 tables restantes : une moitié relevée pour le travail au mur, ou 2 élèves sur la fiche Débutants.',four:'Les 4 jouent : chaque binôme frappe à tour de rôle. Toutes les 2 min, on change de diagonale (coup droit, puis revers).',
  deroul:['Rappel des règles du double (2 min) : service de la demi-table droite vers la demi-table droite adverse ; ensuite, les joueurs d’une équipe frappent obligatoirement à tour de rôle.','Continuité dans la diagonale coup droit, puis revers, puis dans toute la table.','Le binôme qui sert joue toujours en diagonale, l’autre toujours en ligne (C.).'],
  cons:['Je frappe, je sors par l’arrière du côté de mon revers ; mon partenaire entre par l’autre côté.','Je dis « oui » quand je prends la balle.'],
  reus:'15 échanges de suite dans chaque diagonale.',moins:'Une seule diagonale.',plus:'Le binôme qui reçoit joue où il veut.'}),
 doubleServ:(v)=>({bas:'Service long autorisé ; la 3e balle se joue au centre, sans chercher à marquer.',t:'Fil rouge 2 · Service et 3e balle en double',k:'Double · service + 3e balle',sch:'double',
  disp:'Deux binômes par table (8 tables).',four:'A1 sert, B1 remet, A2 joue la 3e balle ; B2 joue la 4e si la balle revient. 5 services, puis A2 sert ; puis le binôme B sert.',
  deroul:['A1 sert court de sa demi-table droite vers celle de B1.','B1 remet comme il veut, A2 attaque la 3e balle.','Le binôme décide avant chaque service : « je sers court, tu attaques sur son revers ».'],
  cons:['Le serveur annonce son service à son partenaire (signe sous la table, comme en compétition).','Ordre de frappe : A1, B1, A2, B2, A1…'],
  reus:'Le binôme serveur gagne 5 points sur 10 services.',moins:'Service long autorisé.',plus:'Le binôme receveur peut attaquer un service trop long.'}),
 servWeak:(v)=>({bas:'Service dans la moitié de table du côté faible, sans 3e balle imposée.',t:'Fil rouge 2 · Servir sur le point faible repéré',k:'Exploiter une faiblesse · AFL1 élément 2',sch:'serv3',
  disp:'Groupes de 3, 11 tables (les mêmes qu’à l’exercice 1). Une boîte de 6 balles par table.',four:'Groupe de 3 : A travaille, B est l’adversaire, C coache A. Rotation toutes les 2 min 30 : C passe en A, A en B, B en C. Chacun travaille 5 min et coache 5 min. Le coach a repéré le point faible de B à l’exercice 1 : c’est lui qui choisit où A sert.',
  deroul:['C dit à A où servir et où jouer la 3e balle ; B joue le point normalement.','6 services, puis bilan de 30 s entre A et C : le plan marche-t-il ?','Rotation : chacun sert une fois sur le point faible repéré.'],
  cons:['Le plan tient en une phrase : « service court sur son revers, puis long sur son coup droit ».'],
  reus:'Le serveur gagne 4 points sur 6.',moins:'B remet au centre.',plus:'B sait où on va servir : le plan doit marcher quand même.'}),
 /* ----- situations finales ----- */
 md3:(v)=>({bas:'Aux tables du bas : la balle qui touche le bord est bonne, service simplifié (lâcher) autorisé, matchs en 4 min sans limite de points.',t:v.t||'Montante-descendante à 3',k:'Jeu · '+(v.k||'matchs libres'),sch:v.sch||'match3',
  disp:'11 tables numérotées (la 12e : débutants ou panier). Bouton Tournoi : groupes de 3, matchs de 4 min ou 11 points, 1 min pour changer de table. 2 tours.',
  four:'Dans chaque groupe : B–C (A arbitre), A–C (B arbitre), A–B (C arbitre). L’arbitre annonce le score du serveur en premier, ce qui autorise le service, et le note sur la fiche de la table.',
  deroul:(v.deroul||[]).concat(['Fin du tour : le 1er de la table monte d’une table, le 3e descend. Classement : victoires, puis différence de points.']),
  cons:v.cons||['Changement de service tous les 2 points ; à 10-10, chacun sert une fois.'],
  reus:v.reus||'Tous les matchs joués et notés ; chaque élève a arbitré 2 matchs.',moins:v.moins,plus:v.plus}),
 relais:(v)=>({bas:'Aux tables du bas : relais de 4 points (jusqu’à 20 pour le double) au lieu de 6 ; le bord de la table compte bon.',t:v.t||'Rencontre en relais, montante-descendante',k:'Jeu · format de l’épreuve en 15 min · T.',sch:'relais',
  disp:'8 tables, deux binômes par table. Les exercices se font par 3 : afficher au tableau la table de chaque rencontre pour passer des groupes de 3 aux binômes en 1 min. Bouton Tournoi : mode binômes, rencontres de 13 min, 2 min de changement. 2 tours.',
  four:'Pendant chaque simple, les deux partenaires qui ne jouent pas arbitrent : A2 annonce le score, B2 le note. À chaque relais (tous les 6 points), 30 s de coaching. En double, le serveur annonce le score.',
  deroul:['Score cumulé : A1–B1 jusqu’à ce qu’un binôme atteigne 6 ; A2–B2 jusqu’à 12 ; A1–B2 jusqu’à 18 ; A2–B1 jusqu’à 24 ; double jusqu’à 30.','C’est l’ordre de l’épreuve : chaque joueur joue 2 simples et le double.'].concat(v.deroul||[]).concat(['Fin de la rencontre : le binôme gagnant monte d’une table, le perdant descend.']),
  cons:v.cons||['Le coach parle entre deux relais, pas pendant l’échange.'],
  reus:v.reus||'Les 2 rencontres terminées ; chaque élève a arbitré ou noté 4 relais.',moins:v.moins,plus:v.plus})
};
const T_SESSIONS=[
 {id:'t1',n:'S1',short:'Diagnostic',status:'next',title:'Diagnostic : régularité, service et premiers matchs',lead:'Faire jouer tout le monde tout de suite, apprendre les règles du service et de l’arbitrage, et repérer le coup préférentiel de chaque élève pour former les premières tables.',
  tl:[['Échauffement','10'],['Record d’échanges','15'],['Service dans 4 zones','15'],['Montante-descendante à 3, 2 tours','30'],['Bilan','5']],
  eval:[['e1','Repérer le niveau de départ : nombreuses fautes (degré 1) ou coup préférentiel efficace (degré 2).'],['a2','Premier record d’échanges noté : la preuve de progrès pour l’engagement.'],['a3','Arbitrage dès la 1re séance : score du serveur en premier, service réglementaire.']],
  warm:'Échauffement guidé (fiche Échauffements, n° 1).',
  ex:[EX.record({}),EX.service4({}),EX.md3({k:'matchs libres, observation du prof',deroul:['1er tour : placement libre ; le prof note pour chaque élève son coup préférentiel, son service (simple mise en jeu ou intention) et ses fautes directes.']})],
  bilan:'Quel est ton coup le plus sûr : coup droit ou revers ? Écris-le sur la fiche de table : c’est ton point de départ.',check:'Les fiches de table (records, classement) servent à constituer les tables de S2.'},
 {id:'t2',n:'S2',short:'Placer, déplacer',status:'next',title:'Placer la balle pour déplacer l’adversaire',lead:'Le fil rouge 1 devient le 8 : on tient l’échange en se déplaçant. Le fil rouge 2 ajoute la 3e balle : servir, puis frapper à l’opposé.',
  tl:[['Échauffement','10'],['Le 8','15'],['Service et 3e balle','15'],['Montante-descendante : demi-tables','30'],['Bilan','5']],
  eval:[['e1','Degré 2 → 3 : des renvois placés, des coups organisés.'],['e2','Degré 2 : un projet qui exploite une faiblesse de l’adversaire (le déplacer).']],
  warm:'Échauffement guidé, puis la tournante (fiche Échauffements, n° 4).',
  ex:[EX.huit({}),EX.serv3({}),EX.md3({t:'Montante-descendante : jamais deux fois sur la même demi-table',k:'match à thème · C. S3',sch:'demi',deroul:['Règle du match : deux frappes de suite sur la même demi-table (gauche ou droite) = point perdu. L’arbitre surveille.','2e tour : on alterne court et long au lieu de gauche et droite.']})],
  bilan:'Combien de points as-tu gagnés en faisant courir ton adversaire ? Où était-il quand tu as marqué ?'},
 {id:'t3',n:'S3',short:'Rompre l’échange',status:'next',title:'Rompre l’échange sur la balle facile',lead:'Reconnaître la balle à attaquer et la frapper au bon moment. Le service court prépare l’attaque. Premier échauffement d’équipe mené par un élève coach.',
  tl:[['Échauffement d’équipe','10'],['Le 8, puis la rupture','15'],['Service court, attaque longue','15'],['Montante-descendante « Banco »','30'],['Bilan','5']],
  eval:[['e1','Degré 3 : smash, frappes fortes ; service qui prépare l’attaque.'],['e2','Exploiter son coup fort.'],['a2','Premier échauffement d’équipe : choix de l’axe, carnet du coach.']],
  warm:'Échauffement d’équipe, première fois : présenter la fiche (2 min), le coach de la table mène. <a href="#" data-go="equipe">Fiche Échauffement d’équipe</a>',
  ex:[EX.rupture({}),EX.servCL({}),EX.md3({t:'Montante-descendante « Banco »',k:'match à thème · C. S3',deroul:['Le joueur qui crie « Banco ! » avant sa frappe et gagne l’échange marque 3 points ; s’il rate, l’adversaire marque 1 point de plus.','Match en 15 points ou 4 min.'],cons:['« Banco » seulement sur une balle haute ou courte : l’arbitre note les « Banco » réussis et ratés.']})],
  bilan:'Combien de « Banco » réussis et ratés ? Sur quelle balle as-tu eu raison d’attaquer ?'},
 {id:'t4',n:'S4',short:'Remise · binômes',status:'next',title:'Remettre le service et choisir son binôme',lead:'La remise empêche le serveur d’attaquer. En fin de séance, chacun choisit son partenaire d’épreuve, ses rôles et sa répartition AFL2/AFL3.',
  tl:[['Échauffement d’équipe','10'],['Remise dans la zone annoncée','15'],['10 services pour marquer','15'],['Montante-descendante : score parlant','30'],['Bilan et choix des binômes','5']],
  eval:[['e1','Degré 3–4 : services variés qui neutralisent l’attaque adverse ; remise qui empêche l’attaque.'],['a2','Choix de la répartition AFL2/AFL3 : 6/2, 4/4 ou 2/6.'],['a3','Choix du partenaire (au moins 3 leçons avant l’épreuve : ici 4) et des rôles évalués : coach et arbitre.']],
  warm:'Échauffement d’équipe, le coach change. <a href="#" data-go="equipe">Fiche Échauffement d’équipe</a>',
  ex:[EX.remise({}),EX.serv10({}),EX.md3({t:'Montante-descendante : score parlant au service',k:'match à thème · T., B. SRP1',deroul:['Point gagné par le serveur en 2 frappes ou moins (service compris) = 3 points. Les autres points valent 1.','Match en 4 min.']})],
  bilan:'Écris sur la fiche de choix : ton partenaire, ta répartition AFL2/AFL3, tes 2 rôles. Le référentiel conseille un partenaire de niveau proche du tien.',
  check:'Le référentiel impose de choisir le partenaire au moins 3 leçons avant l’épreuve. Le faire en S4 laisse S5 à S8 au binôme.'},
 {id:'t5',n:'S5',short:'Double · relais',status:'next',title:'Jouer à deux : le double et la rencontre en relais',lead:'Les binômes sont formés : on passe à deux binômes par table. Règles du double, service en double, puis première rencontre au format de l’épreuve en version courte.',
  tl:[['Échauffement d’équipe','10'],['Continuité en double','15'],['Service et 3e balle en double','15'],['Rencontres en relais, 2 tours','30'],['Bilan','5']],
  eval:[['a3','Degré 2 → 3 en double : stratégie établie, puis respectée ; communication.'],['a3','Coach entre les relais, arbitre et marqueur pendant les simples.'],['e2','Le binôme choisit qui joue contre qui : choix tactique.']],
  warm:'Échauffement d’équipe par binôme, puis 2 min ensemble. <a href="#" data-go="equipe">Fiche Échauffement d’équipe</a>',
  ex:[EX.doubleR({}),EX.doubleServ({}),EX.relais({deroul:['Avant la rencontre, chaque binôme décide qui joue en A1 et en A2.']})],
  bilan:'En double, qui a pris les balles du milieu ? Décidez une règle pour la prochaine fois.'},
 {id:'t6',n:'S6',short:'Points forts, faibles',status:'next',title:'Repérer les forces et faiblesses de l’adversaire',lead:'Le coach observe, note et donne un seul conseil. Puis le binôme sert sur le point faible repéré. La rencontre se termine comme à l’épreuve : chacun écrit les points forts et faibles de ses adversaires.',
  tl:[['Échauffement d’équipe','10'],['Match d’observation, coaché','15'],['Servir sur le point faible','15'],['Rencontres en relais + fiche','30'],['Bilan','5']],
  eval:[['a2','Degré 2–4 : repérer un point fort OU faible (D2), les deux sur un match (D3), sur chaque match (D4).'],['e2','Projet de jeu qui exploite une faiblesse de l’adversaire.'],['a3','Coach : conseils simples puis pertinents.']],
  warm:'Échauffement d’équipe. <a href="#" data-go="equipe">Fiche Échauffement d’équipe</a>',
  ex:[EX.obs({}),EX.servWeak({}),EX.relais({t:'Rencontres en relais, fiche forts/faibles',deroul:['Après chaque simple, le joueur écrit 1 point fort et 1 point faible de son adversaire (comme le jour de l’épreuve).'],reus:'Chaque élève a rempli sa fiche pour ses 2 simples.'})],
  bilan:'Relis ta fiche : le point faible que tu as noté, l’as-tu exploité dans ton 2e simple ?'},
 {id:'t7',n:'S7',short:'Adapter son projet',status:'next',title:'Contrer le coup fort adverse et adapter son projet en cours de match',lead:'Bloquer l’attaque adverse, puis construire son point en trois frappes. En rencontre, le coach utilise son temps mort pour faire changer le projet de jeu.',
  tl:[['Échauffement d’équipe','10'],['Attaque contre bloc','15'],['Construction en 3 frappes','15'],['Rencontres : temps mort et projet','30'],['Bilan','5']],
  eval:[['e2','Degré 4 : adapter son projet au cours du set selon l’évolution du rapport de force.'],['e1','Degré 3–4 : organiser ses coups en système de jeu (attaque ou défense : bloc).'],['a3','Degré 4 du coach : exploiter avec pertinence le temps mort.']],
  warm:'Échauffement d’équipe, l’axe est choisi d’après la fiche forts/faibles de S6. <a href="#" data-go="equipe">Fiche Échauffement d’équipe</a>',
  ex:[EX.bloc({}),EX.trois({}),EX.relais({t:'Rencontres en relais : temps mort et projet',deroul:['Avant la rencontre, chaque joueur écrit son projet en une phrase.','Chaque binôme a 1 temps mort de 30 s par simple ; le coach dit ce qu’il faut changer et le note sur la fiche.'],cons:['À l’entraînement, on utilise le temps mort à chaque fois pour l’apprendre ; le jour de l’épreuve, il reste une possibilité.']})],
  bilan:'Ton projet a-t-il changé après le temps mort ? Qu’est-ce qui a marché ?'},
 {id:'t8',n:'S8',short:'Rencontre blanche',status:'next',title:'Rencontre blanche au format de l’épreuve',lead:'Les binômes vivent exactement les conditions de S9 : échauffement autonome, routines d’avant-match, rencontre complète. Tu chronomètres la rencontre pour régler le format du jour J.',
  tl:[['Échauffement autonome','10'],['Routine : service','5'],['Routine : remise et 3e balle','5'],['Rencontre blanche complète','50'],['Bilan','5']],
  eval:[['a2','Préparation : échauffement autonome et complet (degré 3–4).'],['a3','Arbitres et coachs observés dans les conditions de l’épreuve.'],['e1','Dernier repérage des degrés AFL1 avant l’épreuve.']],
  warm:'Échauffement d’avant-rencontre, mené par les binômes seuls (fiche Échauffements, n° 7).',
  ex:[{t:'Routine d’avant-match 1 : service',k:'Préparation',bas:'Service long dans la moitié de table, 2 zones seulement ; le service simplifié reste interdit : c’est le service de l’épreuve.',sch:'service4',disp:'Chaque binôme à sa table de rencontre.',four:'A1 et A2 servent 5 fois chacun dans les zones prévues pour le match ; le binôme adverse fait la même chose de l’autre côté.',deroul:['Le binôme répète les 2 services qu’il utilisera le plus.'],cons:['Ce sont les services du projet de jeu, pas des services nouveaux.'],reus:'8 services sur 10 dans la zone.'},
   {t:'Routine d’avant-match 2 : remise et 3e balle',k:'Préparation',bas:'Service et remise au centre, sans 3e balle : on se règle, on ne cherche pas à marquer.',sch:'serv3',disp:'Même table.',four:'Chaque binôme sert à son tour ; l’autre remet. 5 services par joueur.',deroul:['Service, remise, 3e balle : on joue le point à mi-vitesse.'],cons:['On regarde comment l’adversaire remet : c’est déjà de l’observation.'],reus:'Chacun a servi et remis 5 fois.'},
   {t:'Rencontre blanche complète',k:'Jeu · format S9',sch:'relais',disp:'8 tables, deux binômes de niveau proche par table (ceux de l’épreuve si possible).',four:'Pendant les simples : les deux partenaires arbitrent (l’un annonce, l’autre note) et coachent entre les manches. Pendant le double : le serveur annonce le score.',
    deroul:['Ordre de l’épreuve (C.) : A1–B1, A2–B2, A1–B2, A2–B1, puis le double. Matchs en 2 manches gagnantes de 11 points.','Chronomètre lancé au premier service, arrêté à la fin du double : note le temps de chaque table.','Après chaque simple, chaque joueur écrit les points forts et faibles de son adversaire.'],
    cons:['Si une table dépasse 50 min, décide maintenant du format de S9 (voir l’onglet Évaluation).'],reus:'Rencontre terminée sur toutes les tables ; fiches remplies.'}],
  bilan:'Combien de temps a duré ta rencontre ? Compte les points marqués par ton binôme : c’est l’indicateur de l’AFL1 élément 2 (moins de 35, 35 à 60, 60 à 75, plus de 75).'},
 {id:'t9',n:'S9',short:'Évaluation',status:'eval',evalPage:true,title:'Évaluation'}
];
const P_SESSIONS=[
 {id:'p1',n:'S1',short:'Règles · diagnostic',status:'next',title:'Règles, service réglementaire et premiers matchs',lead:'Même départ qu’en Terminale, avec plus de temps sur les règles : service réglementaire, arbitrage, montante-descendante. Le prof repère le coup préférentiel de chacun.',
  tl:[['Échauffement','10'],['Record d’échanges','15'],['Service dans 4 zones','15'],['Montante-descendante à 3, 2 tours','30'],['Bilan','5']],
  eval:[['e1','Niveau de départ : nombreuses fautes (D1) ou coup préférentiel efficace (D2).'],['a2','Premier record noté.'],['a3','Gestes d’arbitre : annonce du score du serveur en premier, faute de service, let.']],
  warm:'Échauffement guidé (fiche Échauffements, n° 1).',
  ex:[EX.record({}),EX.service4({deroul:['Élèves qui ne servent pas réglementairement : fiche Débutants, « du lâcher au service réglementaire », sur la 12e table.']}),EX.md3({k:'matchs libres · gestes d’arbitre',deroul:['Avant le 1er match, 2 min de démonstration de l’arbitrage : bras levé du côté du serveur, annonce du score, let, faute de service.']})],
  bilan:'Coup droit ou revers : lequel est ton coup le plus sûr ? Écris-le sur la fiche de table.'},
 {id:'p2',n:'S2',short:'Coup fort',status:'next',title:'Tenir l’échange en coup droit et en revers, choisir son coup fort',lead:'Le record devient plus exigeant (balle prise au sommet), puis le 8 oblige à se déplacer. En match, chacun ne joue qu’avec son coup fort.',
  tl:[['Échauffement','10'],['Record d’échanges : balle au sommet','15'],['Le 8','15'],['Montante-descendante : coup fort seul','30'],['Bilan','5']],
  eval:[['e1','Degré 2 : un coup préférentiel efficace, en coup droit ou en revers.'],['e2','Degré 2 : exploiter son coup fort.']],
  warm:'Échauffement guidé, puis jongles (fiche Échauffements, n° 2).',
  ex:[EX.record({deroul:['Même dispositif qu’en S1 : on bat le record de S1.','2e minute : balle prise au sommet du rebond, trajectoire plus tendue.'],reus:'Battre son record de S1.'}),EX.huit({}),EX.md3({t:'Montante-descendante : seulement avec son coup fort',k:'match à thème · C. S2',sch:'coupfort',deroul:['Chaque joueur annonce son coup fort au début du match et ne joue qu’avec lui.','Il se déplace (pivot) pour jouer son coup fort sur les balles de l’autre côté.']})],
  bilan:'As-tu réussi à jouer ton coup fort sur les balles côté faible ? Qu’est-ce qui t’en a empêché ?'},
 {id:'p3',n:'S3',short:'Placer',status:'next',title:'Placer la balle : servir et jouer à l’opposé',lead:'Premier échauffement d’équipe. Le 8 revient, puis le service prépare la 3e balle. En match, on ne joue jamais deux fois au même endroit.',
  tl:[['Échauffement d’équipe','10'],['Le 8','15'],['Service et 3e balle','15'],['Montante-descendante : demi-tables','30'],['Bilan','5']],
  eval:[['e1','Degré 2 → 3 : renvois placés, service qui n’est plus une simple mise en jeu.'],['e2','Exploiter une faiblesse : déplacer l’adversaire.'],['a2','Premier échauffement d’équipe.']],
  warm:'Échauffement d’équipe, première fois : présenter la fiche (2 min). <a href="#" data-go="equipe">Fiche Échauffement d’équipe</a>',
  ex:[EX.huit({reus:'20 échanges de suite dans chaque rôle.'}),EX.serv3({}),EX.md3({t:'Montante-descendante : jamais deux fois sur la même demi-table',k:'match à thème · C. S3',sch:'demi',deroul:['Deux frappes de suite sur la même demi-table = point perdu.']})],
  bilan:'Sur quels points as-tu fait courir ton adversaire ? Qu’as-tu servi avant ?'},
 {id:'p4',n:'S4',short:'Rupture · binômes',status:'next',title:'Rompre l’échange et choisir son binôme',lead:'Reconnaître la balle facile, la frapper. Le service court prépare l’attaque. En fin de séance, chacun choisit son partenaire, ses rôles et sa répartition AFL2/AFL3.',
  tl:[['Échauffement d’équipe','10'],['Le 8, puis la rupture','15'],['Service court, attaque longue','15'],['Montante-descendante « Banco »','30'],['Bilan et choix des binômes','5']],
  eval:[['e1','Degré 3 : smash, frappes fortes.'],['a2','Choix de la répartition AFL2/AFL3 : 6/2, 4/4 ou 2/6.'],['a3','Choix du partenaire (au moins 3 leçons avant l’épreuve : ici 4) et des rôles.']],
  warm:'Échauffement d’équipe. <a href="#" data-go="equipe">Fiche Échauffement d’équipe</a>',
  ex:[EX.rupture({}),EX.servCL({}),EX.md3({t:'Montante-descendante « Banco »',k:'match à thème · C. S3',deroul:['« Banco ! » annoncé puis échange gagné = 3 points ; raté = 1 point de plus pour l’adversaire.','Match en 15 points ou 4 min.']})],
  bilan:'Fiche de choix : ton partenaire, ta répartition AFL2/AFL3, tes 2 rôles (coach et arbitre).',check:'Le partenaire est choisi au moins 3 leçons avant l’épreuve (référentiel).'},
 {id:'p5',n:'S5',short:'Double · relais',status:'next',title:'Jouer à deux : le double et la rencontre en relais',lead:'Les binômes sont formés. Règles du double, service en double, puis la rencontre en relais : le format de l’épreuve en 15 min.',
  tl:[['Échauffement d’équipe','10'],['Continuité en double','15'],['Service et 3e balle en double','15'],['Rencontres en relais, 2 tours','30'],['Bilan','5']],
  eval:[['a3','S’intégrer dans un duo : stratégie établie (D2), puis tenue (D3).'],['a3','Arbitre et marqueur pendant les simples ; coach entre les relais.']],
  warm:'Échauffement d’équipe par binôme. <a href="#" data-go="equipe">Fiche Échauffement d’équipe</a>',
  ex:[EX.doubleR({}),EX.doubleServ({}),EX.relais({deroul:['Avant la rencontre, chaque binôme décide qui joue en A1 et en A2.']})],
  bilan:'En double, qui prend les balles du milieu ? Écrivez votre règle.'},
 {id:'p6',n:'S6',short:'Servir pour marquer',status:'next',title:'Servir pour marquer',lead:'Le service devient une arme : marquer en peu de frappes, sous le regard du coach. La rencontre compte double les points gagnés vite.',
  tl:[['Échauffement d’équipe','10'],['10 services pour marquer','15'],['Service court et 3e balle, coachés','15'],['Rencontres : score parlant','30'],['Bilan','5']],
  eval:[['e1','Degré 3 : variété des services (placements, vitesses, effets).'],['e1','Degré 4 : le service crée des occasions de marque.'],['a3','Coach : conseils simples et ciblés.']],
  warm:'Échauffement d’équipe. <a href="#" data-go="equipe">Fiche Échauffement d’équipe</a>',
  ex:[EX.serv10({}),EX.servCL({four:'Groupe de 3 : A travaille, B est l’adversaire, C coache A. Rotation toutes les 2 min 30 : C passe en A, A en B, B en C. Chacun travaille 5 min et coache 5 min. Le coach C note si A marque en 2 frappes ou moins et lui propose un autre service après 3 échecs.'}),EX.relais({t:'Rencontres en relais : score parlant',deroul:['Point gagné par le serveur en 2 frappes ou moins (service compris) = 2 points.']})],
  bilan:'Quel service t’a rapporté le plus de points ? Ce sera ton service de l’épreuve.'},
 {id:'p7',n:'S7',short:'Points forts, faibles',status:'next',title:'Repérer la faiblesse de l’adversaire et coacher',lead:'Le coach observe et donne un conseil, le binôme sert sur le point faible repéré. La rencontre se termine comme à l’épreuve, avec la fiche forts/faibles et le temps mort.',
  tl:[['Échauffement d’équipe','10'],['Match d’observation, coaché','15'],['Servir sur le point faible','15'],['Rencontres : fiche et temps mort','30'],['Bilan','5']],
  eval:[['a2','Repérer un point fort OU faible (D2), les deux (D3), sur chaque match (D4).'],['e2','Projet qui exploite une faiblesse adverse ou contre un coup fort.'],['a3','Coach : exploiter le temps mort (D4).']],
  warm:'Échauffement d’équipe. <a href="#" data-go="equipe">Fiche Échauffement d’équipe</a>',
  ex:[EX.obs({}),EX.servWeak({}),EX.relais({t:'Rencontres : fiche forts/faibles et temps mort',deroul:['1 temps mort de 30 s par simple pour chaque binôme.','Après chaque simple, le joueur écrit 1 point fort et 1 point faible de son adversaire.']})],
  bilan:'Le point faible repéré par ton coach : l’as-tu exploité ? Combien de points ça t’a rapporté ?'},
 {id:'p8',n:'S8',short:'Rencontre blanche',status:'next',title:'Rencontre blanche au format de l’épreuve',lead:'Mêmes conditions qu’en S9 : échauffement autonome, routines, rencontre complète chronométrée.',
  tl:[['Échauffement autonome','10'],['Routine : service','5'],['Routine : remise et 3e balle','5'],['Rencontre blanche complète','50'],['Bilan','5']],
  eval:[['a2','Préparation autonome et complète.'],['a3','Arbitres et coachs dans les conditions de l’épreuve.'],['e1','Dernier repérage des degrés.']],
  warm:'Échauffement d’avant-rencontre (fiche Échauffements, n° 7).',ex:null,bilan:'Combien de temps a duré la rencontre ? Combien de points a marqués ton binôme ?'},
 {id:'p9',n:'S9',short:'Évaluation',status:'eval',evalPage:true,title:'Évaluation'}
];
P_SESSIONS[7].ex=T_SESSIONS[7].ex;
const A_SESSIONS=[
 {id:'a1',n:'L1',short:'Je m’évalue en match',status:'next',title:'Situation de référence : je m’évalue en match',lead:'Les binômes jouent la forme de l’épreuve (2 équipes de 2, chaque joueur rencontre les 2 adversaires). Le coach note comment son joueur gagne ses points ; chacun se situe ensuite sur son étoile. C’est le point de départ de tout le cycle.',
  tl:[['Échauffement guidé','10'],['Apprendre la grille d’observation','10'],['Rencontre de référence : 1er match','25'],['Rencontre de référence : 2e match','25'],['Bilan : je me situe sur l’étoile','5']],
  eval:[['e1','Niveau de départ en match réel : nombreuses fautes (D1) ou coup préférentiel (D2) ?'],['e2','« Je prévois de gagner en… » : premier projet de jeu écrit.'],['a3','Premier rôle de coach-observateur.']],
  warm:'Échauffement guidé (onglet Échauffements de l’entrée « cycle guidé », n° 1).',
  ex:[{t:'Apprendre la grille d’observation',k:'Analyse · carnet de D., leçon 1',disp:'Toute la classe, puis les binômes à leur table. Une feuille « Comment se gagne l’échange » par élève, un plot (ou une feuille de journal) au centre de chaque table.',four:'Le professeur montre un échange ; tous les élèves notent. Puis, à chaque table : un joueur joue un échange, son coach note, on compare.',deroul:['Codes : 0 = dernier rebond sur le plot ou faute non provoquée de l’adversaire ; 1 = rebond hors du plot non renvoyé ; 2 = smash non renvoyé ; 3 = projet de jeu annoncé et réalisé ; x = faute sur balle facile ou au service.','Chaque joueur écrit son projet : « Je prévois de gagner en… » (ex. : service sur le revers et smash dès que possible).'],cons:['On note chaque point gagné, et chaque faute facile par une croix.','Le score observé = la somme des 1, 2 et 3.'],reus:'Deux observateurs de la même table notent le même code sur 8 échanges sur 10.'},
   {t:'Rencontre de référence : 1er match',k:'Situation complexe · forme de l’épreuve',sch:'relais',disp:'2 équipes de 2 par table (8 tables). Matchs en 2 manches gagnantes de 11 points (11 points secs si le temps manque). Outil Auto-évaluation : grille de comptage.',four:'Un joueur de chaque équipe joue ; son coach note ses points avec la grille ; l’autre coach fait de même pour son joueur. Coaching entre les deux manches. L’arbitrage est fait par les coachs (l’un annonce, l’autre note).',deroul:['A1 contre B1 : les coachs A2 et B2 notent.','Puis A2 contre B2 : les coachs A1 et B1 notent.','Entre les manches, le coach dit à son joueur ce qu’il voit.'],cons:['Le coach écrit une phrase de diagnostic : « Il joue trop au centre, smashe peu, fait beaucoup de fautes : CONTINUITÉ et SMASH ».'],reus:'Chaque élève a sa grille remplie et une phrase de diagnostic.'},
   {t:'Rencontre de référence : 2e match',k:'Situation complexe · forme de l’épreuve',sch:'relais',disp:'Même dispositif, adversaires croisés.',four:'A1 contre B2, puis A2 contre B1 ; les coachs notent. Si le temps le permet, le double (le serveur annonce le score).',deroul:['Même grille ; comparer le score observé du 1er et du 2e match.','Fin de rencontre : chaque élève se situe sur son étoile (7 axes, 4 degrés) avec l’aide de son coach.'],cons:['On se situe avec les faits notés, pas avec l’impression.'],reus:'Chaque élève a placé ses 7 axes sur l’étoile.'}],
  bilan:'Sur ton étoile, quels sont les 2 axes les plus faibles ? Écris-les dans ton carnet : ce sont tes pistes pour la leçon 2.'},
 {id:'a2',n:'L2',short:'Je repère mes problèmes',status:'next',title:'Je repère mes problèmes : matchs à thème',lead:'Chaque élève joue les matchs à thème liés à ses axes faibles. Le match à thème montre le problème (« je n’utilise pas mon coup fort », « je joue au centre »…) ; l’élève choisit ensuite son axe de travail et ses premiers exercices dans le catalogue.',
  tl:[['Échauffement en duo','10'],['Match à thème de mon 1er axe faible','15'],['Match à thème de mon 2e axe faible','15'],['Premier essai des exercices choisis','25'],['Bilan : mon axe de travail','10']],
  eval:[['a2','Analyse : relier un problème repéré à un thème et à des exercices.'],['e2','Repérer son coup fort et le point faible adverse (match à thème 1).']],
  warm:'Échauffement en duo : « D’abord 2 min de diagonale revers ! » (catalogue, thème 10, exercice A3).',
  ex:[{t:'Match à thème de mon 1er axe faible',k:'Situation complexe ciblée',disp:'Le professeur regroupe les élèves par match à thème (onglet Suivi : comptage des choix) ; 3 élèves par table. Affiche du match à thème sur la table.',four:'Deux jouent le match à thème, le 3e arbitre et compte les bonus avec la grille du match à thème. Rotation à chaque match de 4 min.',deroul:['Lire la règle du match à thème sur l’affiche.','Après chaque match : cocher dans la liste des « problèmes » ceux qu’on a eus.'],cons:['Le match à thème rend le problème visible : on ne cherche pas encore à le corriger.'],reus:'Chaque élève a coché au moins un problème.'},
   {t:'Match à thème de mon 2e axe faible',k:'Situation complexe ciblée',disp:'Même organisation, autre match à thème.',four:'Deux jouent, le 3e arbitre et compte.',deroul:['Même démarche.','Comparer : lequel des deux thèmes me pose le plus de problèmes ?'],cons:['Choisir l’axe où je perds le plus de points.'],reus:'Un axe de travail choisi, écrit dans le carnet.'},
   {t:'Premier essai des exercices choisis',k:'Catalogue · travail en autonomie',disp:'Groupes de 3 par table, si possible sur le même thème. Affiches du catalogue sur les tables.',four:'Chacun son exercice : le joueur travaille, le partenaire renvoie comme indiqué dans la case « partenaires », le 3e compte, observe et conseille. Rotation toutes les 4 min.',deroul:['Choisir 2 exercices du thème dans le catalogue.','Lire la consigne, les critères (ampoule) et les niveaux à atteindre.','Noter dans le carnet le numéro et le niveau atteint.'],cons:['Commencer par le niveau le plus simple.'],reus:'Chaque élève a essayé 2 exercices et noté son niveau.'}],
  bilan:'Carnet : mon axe de travail, le problème repéré, les numéros des exercices choisis et le niveau atteint.'},
 ...[3,4,5,6,7].map(k=>({id:'a'+k,n:'L'+k,status:'next',
  short:{3:'Autonomie · axe 1',4:'Autonomie · binômes',5:'Autonomie · rôles',6:'Autonomie · contrer',7:'Autonomie · projet'}[k],
  title:{3:'Travail en autonomie sur mon premier axe',4:'Travail en autonomie, choix du binôme',5:'Travail en autonomie, coach et arbitre',6:'Travail en autonomie : repérer et contrer une stratégie',7:'Travail en autonomie : mon projet pour l’épreuve'}[k],
  lead:{3:'Chaque élève reprend l’axe choisi en L2 : 2 exercices du catalogue, puis le match à thème pour valider. Le professeur circule de table en table et vérifie les carnets.',
   4:'Même déroulé. L’élève qui a validé son match à thème passe à un 2e thème ou à un niveau supérieur. En fin de séance : choix du partenaire d’épreuve (au moins 3 leçons avant), de la répartition AFL2/AFL3 et des rôles.',
   5:'Même déroulé, avec un axe de rôle obligatoire : coach (thèmes 11–12) ou arbitre (thèmes 13–14), pour préparer l’AFL3. Les binômes travaillent ensemble.',
   6:'Le thème 9 entre dans les matchs : projet « secret » en 1re mi-temps, concertation coach-joueur à la mi-temps pour le contrer. Les exercices restent au choix.',
   7:'Dernière leçon de travail : chaque binôme choisit les exercices qui servent son projet pour l’épreuve, puis rencontre un autre binôme en relais.'}[k],
  tl:[['Échauffement en duo','10'],['Exercice choisi n° 1','15'],['Exercice choisi n° 2','15'],[k>=6?'Matchs : '+(k===6?'repérer et contrer':'rencontre en relais'):'Match à thème de validation, puis matchs','30'],['Bilan dans le carnet','5']],
  eval:[['a2','Engagement et autonomie : choisir, persévérer, valider (carnet, onglet Suivi).'],k===5?['a3','Rôle travaillé : coach ou arbitre (thèmes 11 à 14).']:k===6?['e2','Degré 4 : adapter son projet au cours du set (thème 9).']:['e1','Le niveau validé dans les exercices montre les acquis techniques.'],k===4?['a3','Choix du partenaire, des rôles et de la répartition AFL2/AFL3.']:['a2','Analyse : le problème repéré dans le match à thème a-t-il disparu ?']],
  warm:'Échauffement en duo adapté à l’axe choisi (thème 10, exercice A3 : « j’adapte ma routine à mon axe »).',
  ex:[{t:'Exercice choisi n° 1',k:'Catalogue · au choix de l’élève',disp:'Tables organisées par thème (onglet Suivi : nombre d’élèves par thème et tables proposées). Affiches du catalogue posées sur les tables ; la 12e table, moitié relevée, sert aux exercices 9 (mur) et 23 à 26 (services).',four:'Groupe de 3 : chacun son exercice. Le joueur travaille ; le partenaire fait ce qu’indique la case « partenaires » (renvoyer, compter, distribuer) ; le 3e observe avec les critères (ampoule) et conseille. Rotation toutes les 5 min.',deroul:['Relire dans le carnet le problème repéré et le niveau atteint la fois précédente.','Faire l’exercice jusqu’au niveau visé ; noter le niveau atteint.'],cons:['Valider un niveau avant de passer à l’exercice suivant (thème 10 : persévérer).'],reus:'Un niveau de plus validé, noté dans le carnet.'},
   {t:'Exercice choisi n° 2',k:'Catalogue · au choix de l’élève',disp:'Même organisation.',four:'Même rotation.',deroul:['Deuxième exercice du même thème, ou exercice d’un 2e thème si le 1er est validé.'],cons:['Un exercice réussi sans effort : on prend le niveau ou l’exercice suivant.'],reus:'Un niveau de plus validé.'},
   {t:k===7?'Rencontre en relais':k===6?'Matchs : repérer et contrer une stratégie':'Match à thème de validation, puis matchs',k:'Validation et jeu',sch:k===7?'relais':'match3',disp:k===7?'2 binômes par table (8 tables), onglet Tournois en mode binômes.':'Groupes de 3 par table ; onglet Tournois (montante-descendante ou ronde suisse) ou Défi ATP pour les matchs.',
    four:k===7?'Pendant les simples, les partenaires arbitrent (l’un annonce, l’autre note) et coachent entre les relais.':'Deux jouent, le 3e arbitre et compte les bonus ; rotation à chaque match.',
    deroul:k===7?['Rencontre en relais (6, 12, 18, 24, double jusqu’à 30).','Avant : chaque joueur écrit son projet ; après : 1 point fort et 1 point faible de chaque adversaire.']:k===6?['Tournoi de matchs de 4 min (2 mi-temps) : le gagnant reste.','1re mi-temps : un joueur suit un projet « secret » ; à la mi-temps, l’adversaire et son coach se concertent pour le contrer.']:['10 min : le match à thème de son axe ; l’arbitre compte les bonus. Validé si le problème coché en L2 a disparu ou si le score atteint le bonus visé.','20 min : matchs avec un projet de jeu annoncé (montante-descendante ou défi ATP).'],
    cons:['Le match à thème valide l’acquisition : c’est là qu’on voit si l’exercice a servi.'],reus:k===7?'Chaque élève a sa fiche forts/faibles.':'Match à thème validé, ou problème noté pour la leçon suivante.'}],
  bilan:k===4?'Carnet, puis fiche de choix : ton partenaire, ta répartition AFL2/AFL3, tes 2 rôles.':'Carnet : niveau atteint, match à thème validé ou non, ce que je travaille la prochaine fois.'})),
 {id:'a8',n:'L8',short:'Préparer l’épreuve',status:'next',title:'Préparer l’épreuve : ma gestion des 15 minutes et la rencontre blanche',lead:'D. appelle cette leçon « Pour préparer l’évaluation, je choisis » : chaque binôme gère seul ses 15 min de préparation (duo, duel, routines de son axe), puis joue une rencontre blanche complète en analysant ses adversaires.',
  tl:[['Ma gestion des 15 min : duo','5'],['Ma gestion des 15 min : routines de mon axe','10'],['Ma gestion des 15 min : duel','5'],['Rencontre blanche complète','50'],['Bilan','5']],
  eval:[['a2','Préparation autonome et complète (D3–D4).'],['a3','Coach et arbitre dans les conditions de l’épreuve.'],['e2','Projet de jeu écrit avant chaque match ; points binôme comptés.']],
  warm:'Les 15 premières minutes sont l’échauffement : le binôme les organise seul et l’écrit dans le carnet.',
  ex:[{t:'Ma gestion des 15 min : routines de mon axe',k:'Préparation · AFL2',disp:'À la table de la rencontre.',four:'Les deux binômes partagent la table : chacun son tour, 5 min de routines de son axe, l’autre binôme renvoie.',deroul:['Duo (5 min) : échanges longs, réguliers.','Routines de mon axe (10 min) : exercice validé, au niveau atteint.','Duel (5 min) : points joués, pour se mettre dans le match.'],cons:['Les routines choisies servent le projet de jeu de l’épreuve.'],reus:'Les 15 min sont écrites dans le carnet et respectées.'},
   {t:'Ma gestion des 15 min : duel',k:'Préparation',disp:'Même table.',four:'Points joués entre binômes.',deroul:['Quelques points, service compris, pour se mettre dans le match.'],cons:['Observer déjà l’adversaire : où joue-t-il ? quel coup fort ?'],reus:'Prêt à jouer.'},
   T_SESSIONS[7].ex[2]],
  bilan:'Mon analyse des matchs : le style de jeu de chaque adversaire, ses points forts et faibles, ma stratégie. Combien de points a marqués mon binôme ?'},
 {id:'a9',n:'L9',short:'Évaluation',status:'eval',evalPage:true,title:'Évaluation'}
];
A_SESSIONS[7].ex=[A_SESSIONS[7].ex[0],A_SESSIONS[7].ex[1],A_SESSIONS[7].ex[2]];
P_SESSIONS.forEach(s=>s.orig=s.status);
T_SESSIONS.forEach(s=>s.orig=s.status);
A_SESSIONS.forEach(s=>s.orig=s.status);
