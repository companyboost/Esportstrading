# Regenerates the ET badge options: python3 _generate.py (then rsvg-convert for PNGs)
import math, os
HERE=os.path.dirname(os.path.abspath(__file__))
OUT=HERE
E=open(HERE+'/_bolt-E.path').read()  # brand bolt E, baked from assets/logo/icon.svg
Y0,Y1=-8.0,604.0; BAR=143.0; KB=0.376; KS=0.431; STEM=220.0
def tpath(G=80, arm=150, arrow=False):
    L0=809+G                          # crossbar left at top
    L1=L0-KB*BAR                      # crossbar left at bar bottom
    s0=L1+arm                         # stem left at bar bottom
    s1=s0+STEM
    R1=s1+arm; R0=R1+KB*BAR
    dy=Y1-(Y0+BAR); sb=s0-KS*dy; sbr=s1-KS*dy
    yb=Y0+BAR
    if not arrow:
        pts=[(L0,Y0),(R0,Y0),(R1,yb),(s1,yb),(sbr,Y1),(sb,Y1),(s0,yb),(L1,yb)]
        right=R0
    else:
        bx=R0-40                      # arrow base at top edge
        ext=58
        tipx=bx+190; tipy=Y0+BAR/2
        pts=[(L0,Y0),(bx,Y0),(bx+KB*ext,Y0-ext),(tipx,tipy),(bx-KB*(BAR+ext),yb+ext),(bx-KB*BAR,yb),(s1,yb),(sbr,Y1),(sb,Y1),(s0,yb),(L1,yb)]
        right=tipx
    return 'M'+' L'.join('%.1f %.1f'%p for p in pts)+' Z', right, (L0,L1,sb)

def defs_letters(tp):
    return f'<path id="E" d="{E}"/><path id="T" d="{tp}"/>'

def place(cx,cy,s,inner,ox=500,oy=500):
    return f'<g transform="translate({ox} {oy}) scale({s:.4f}) translate({-cx:.1f} {-cy:.1f})">{inner}</g>'

def uses(href, fill, stroke=None, sw=0, n=0, dx=0, dy=0, start=0, extra=''):
    o=''
    for i in range(start, n+1):
        t=f' transform="translate({i*dx} {i*dy})"' if i else ''
        st=f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
        o+=f'<use href="#{href}" xlink:href="#{href}" fill="{fill}"{st}{t}{extra}/>'
    return o

def svg(defs, body, title):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1000 1000" width="1000" height="1000">
<title>{title}</title>
<defs>{defs}</defs>
{body}
</svg>
'''
ACID='#EDFC0D'; INK='#0A0A0B'; WHITE='#F4F4F2'

def mono3d(E_face,T_face,E_side,T_side,outline,ow,n,dx,dy,face_stroke=None,fsw=0):
    b =uses('E',outline,outline,ow,n,dx,dy)+uses('T',outline,outline,ow,n,dx,dy)
    b+=uses('E',E_side,None,0,n,dx,dy,start=1)+uses('T',T_side,None,0,n,dx,dy,start=1)
    b+=uses('E',E_face,face_stroke,fsw)+uses('T',T_face,face_stroke,fsw)
    return b

tp,right,_=tpath()
CX=(0+right)/2; CY=(Y0+Y1)/2
files={}

# 1 Classic: close to the client sample, cleaned up
d=defs_letters(tp)+f'''
<radialGradient id="disc" cx="36%" cy="32%" r="75%"><stop offset="0" stop-color="#FDFFD6"/><stop offset=".32" stop-color="{ACID}"/><stop offset=".78" stop-color="#CBD800"/><stop offset="1" stop-color="#8F9800"/></radialGradient>
<linearGradient id="ring" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D2D2D0"/></linearGradient>
<linearGradient id="eF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F9FF8C"/><stop offset=".45" stop-color="{ACID}"/><stop offset="1" stop-color="#C9D500"/></linearGradient>
<linearGradient id="tF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F0F0EE"/><stop offset="1" stop-color="#BDBDBB"/></linearGradient>'''
b=f'<circle cx="500" cy="500" r="498" fill="{INK}"/><circle cx="500" cy="500" r="480" fill="url(#ring)"/><circle cx="500" cy="500" r="446" fill="{INK}"/><circle cx="500" cy="500" r="434" fill="url(#disc)"/>'
b+=place(CX,CY,0.52,mono3d('url(#eF)','url(#tF)','#6F7700','#8A8A88',INK,46,9,3,4,INK,8),500,492)
files['1-classic']=svg(d,b,'Esports Trading ET badge, option 1 Classic')

# 2 Blackout: black disc, acid ring, soft glow
d=defs_letters(tp)+f'''
<radialGradient id="disc" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="#26262B"/><stop offset="1" stop-color="{INK}"/></radialGradient>
<radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{ACID}" stop-opacity=".38"/><stop offset="1" stop-color="{ACID}" stop-opacity="0"/></radialGradient>'''
b=f'<circle cx="500" cy="500" r="498" fill="{ACID}"/><circle cx="500" cy="500" r="472" fill="{INK}"/><circle cx="500" cy="500" r="462" fill="url(#disc)"/><circle cx="500" cy="500" r="446" fill="none" stroke="#FFFFFF" stroke-opacity=".14" stroke-width="3"/>'
b+='<ellipse cx="500" cy="510" rx="380" ry="230" fill="url(#glow)"/>'
b+=place(CX,CY,0.54,mono3d(ACID,WHITE,'#5E6500','#55555A','#000000',18,10,3,4),500,492)
files['2-blackout']=svg(d,b,'Esports Trading ET badge, option 2 Blackout')

# 3 Acid stamp: flat black on acid with speed bars
d=defs_letters(tp)+'<clipPath id="c"><circle cx="500" cy="500" r="446"/></clipPath>'
b=f'<circle cx="500" cy="500" r="498" fill="{INK}"/><circle cx="500" cy="500" r="480" fill="{ACID}"/><circle cx="500" cy="500" r="452" fill="none" stroke="{INK}" stroke-width="7"/>'
# speed bars: parallelograms leaning with the E, running off the left edge of the disc
bars=''
s3=0.5; ox3,oy3=532,494
def ty(y): return oy3+s3*(y-CY)
def tx(x): return ox3+s3*(x-CX)
k=0.431
for (ya,yb,gap) in [(Y0,Y0+60,55),(Y0+84,Y0+BAR,90),(437,510,55),(534,604,90)]:
    # right end sits a gap before the E spine at that height, leaning with the E
    xa=tx(264-k*(ya-Y0))-gap*s3*1.2; xb=tx(264-k*(yb-Y0))-gap*s3*1.2
    bars+=f'<path d="M20 {ty(ya):.1f} L{xa:.1f} {ty(ya):.1f} L{xb:.1f} {ty(yb):.1f} L20 {ty(yb):.1f} Z" fill="{INK}"/>'
b+=f'<g clip-path="url(#c)">{bars}</g>'
b+=place(CX,CY,s3,uses('E','#C4D000',None,0,6,3,4,start=1)+uses('T','#C4D000',None,0,6,3,4,start=1)+uses('E',INK)+uses('T',INK),ox3,oy3)
files['3-acid-stamp']=svg(d,b,'Esports Trading ET badge, option 3 Acid Stamp')

# 4 Split: diagonal split through the gap between E and T
L0,L1,sb=tpath()[2]
gx_top=(809+L0)/2; gx_bot=(596+sb)/2
s4=0.55; ox,oy=500,492
def tc(x,y): return (ox+s4*(x-CX), oy+s4*(y-CY))
a=tc(gx_top,Y0); c2=tc(gx_bot,Y1)
vx,vy=c2[0]-a[0],c2[1]-a[1]; n=math.hypot(vx,vy); vx/=n; vy/=n
p1=(a[0]-vx*900,a[1]-vy*900); p2=(a[0]+vx*900,a[1]+vy*900)
left=f'M{p1[0]:.1f} {p1[1]:.1f} L{p2[0]:.1f} {p2[1]:.1f} L-600 1600 L-600 -600 Z'
d=defs_letters(tp)+f'<clipPath id="disc"><circle cx="500" cy="500" r="474"/></clipPath>'
b=f'<circle cx="500" cy="500" r="498" fill="{WHITE}"/><g clip-path="url(#disc)"><rect width="1000" height="1000" fill="{ACID}"/><path d="{left}" fill="{INK}"/><path d="M{p1[0]:.1f} {p1[1]:.1f} L{p2[0]:.1f} {p2[1]:.1f}" stroke="{WHITE}" stroke-width="8"/></g>'
b+=place(CX,CY,s4,uses('E',ACID)+uses('T',INK),ox,oy)
files['4-split']=svg(d,b,'Esports Trading ET badge, option 4 Split')

# 5 Ticker: tick ring with an acid run, T crossbar ends in a forward arrow
tpa,righta,_=tpath(arrow=True)
CXa=(0+righta)/2
d=defs_letters(tpa)+f'<radialGradient id="disc" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#1E1E22"/><stop offset="1" stop-color="{INK}"/></radialGradient>'
b=f'<circle cx="500" cy="500" r="498" fill="{INK}"/><circle cx="500" cy="500" r="498" fill="url(#disc)"/>'
ticks=''
N=96
for i in range(N):
    ang=-90+i*360/N
    on = i<=34                      # acid run clockwise from 12 o'clock
    r1,r2=(432,476) if i%8==0 else (446,476)
    col=ACID if on else '#3A3A40'
    x1=500+r1*math.cos(math.radians(ang)); y1=500+r1*math.sin(math.radians(ang))
    x2=500+r2*math.cos(math.radians(ang)); y2=500+r2*math.sin(math.radians(ang))
    ticks+=f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{col}" stroke-width="{7 if i%8==0 else 5}" stroke-linecap="round"/>'
b+=ticks
b+=place(CXa,CY,0.49,mono3d(ACID,WHITE,'#5E6500','#4A4A50','#000000',14,8,3,4),505,500)
files['5-ticker']=svg(d,b,'Esports Trading ET badge, option 5 Ticker')

# 6 Chrome: metal ring, gunmetal disc, chrome T
d=defs_letters(tp)+f'''
<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".22" stop-color="#8C8C92"/><stop offset=".45" stop-color="#F2F2F2"/><stop offset=".7" stop-color="#55555B"/><stop offset="1" stop-color="#E0E0E0"/></linearGradient>
<radialGradient id="disc" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#34343A"/><stop offset=".6" stop-color="#141417"/><stop offset="1" stop-color="{INK}"/></radialGradient>
<radialGradient id="spot" cx="50%" cy="0%" r="70%"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".16"/><stop offset="1" stop-color="{ACID}" stop-opacity="0"/></radialGradient>
<linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".42" stop-color="#D6D6DA"/><stop offset=".5" stop-color="#7B7B82"/><stop offset=".62" stop-color="#C9C9CE"/><stop offset="1" stop-color="#F7F7F7"/></linearGradient>
<linearGradient id="eF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAFF9A"/><stop offset=".45" stop-color="{ACID}"/><stop offset=".5" stop-color="#B7C200"/><stop offset=".62" stop-color="#DCE800"/><stop offset="1" stop-color="{ACID}"/></linearGradient>'''
b=f'<circle cx="500" cy="500" r="498" fill="url(#metal)"/><circle cx="500" cy="500" r="468" fill="{INK}"/><circle cx="500" cy="500" r="458" fill="url(#disc)"/><circle cx="500" cy="500" r="458" fill="url(#spot)"/>'
b+=place(CX,CY,0.53,mono3d('url(#eF)','url(#chrome)','#4B5000','#3C3C42','#000000',26,10,3,4,'#000000',6),500,494)
files['6-chrome']=svg(d,b,'Esports Trading ET badge, option 6 Chrome')

for k,v in files.items():
    open(f'{OUT}/et-badge-{k}.svg','w').write(v)
print('ok', list(files))
