const fs = require('fs');

// transport
{
  const p = 'src/app/transport/page.tsx';
  let t = fs.readFileSync(p, 'utf8');
  const before = (t.match(/Ashwanth Kumar/g) || []).length;
  t = t.replace(
    '<div style={{ fontSize: 14, fontWeight: 900, color: \'#2563eb\', marginTop: 4 }}>Ashwanth Kumar</div>',
    '<div style={{ fontSize: 14, fontWeight: 900, color: \'#2563eb\', marginTop: 4 }}>{user?.displayName || \'Student\'}</div>'
  );
  fs.writeFileSync(p, t);
  console.log('transport remaining', (fs.readFileSync(p, 'utf8').match(/Ashwanth Kumar/g) || []).length, 'was', before);
}

// career-assets
{
  const p = 'src/app/_legacy/career-assets/page.tsx';
  let t = fs.readFileSync(p, 'utf8');
  const before = (t.match(/Ashwanth Kumar/g) || []).length;
  t = t.split('Ashwanth Kumar').join('{displayName}');
  t = t.replace(/ashwanth@pinit\.app/g, 'student@pinit.in');
  t = t.replace(/ashwanth\.pinit\.me/g, 'portfolio.pinit.me');
  t = t.replace(
    'color: \'white\', fontWeight: 800 }}>AK</div>',
    'color: \'white\', fontWeight: 800 }}>{(displayName || \'ST\').split(\' \').map(w => w[0]).join(\'\').slice(0, 2)}</div>'
  );
  fs.writeFileSync(p, t);
  console.log('career-assets remaining', (fs.readFileSync(p, 'utf8').match(/Ashwanth Kumar/g) || []).length, 'was', before);
}
