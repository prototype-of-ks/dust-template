import helmet from 'helmet';
import express from 'express';
import { resolve } from 'path';
import dust from 'dustjs-linkedin';
import fs from 'fs';

const TEMPLATE_NAME = 'template_output';

const distPath = resolve(__dirname, './dist');
const template = fs.readFileSync(resolve(distPath, 'template.dust')).toString();

const compiled = dust.compile(template, TEMPLATE_NAME);
dust.loadSource(compiled);
dust.render(TEMPLATE_NAME, {
  gtag: 'G-123456',
}, (err, output) => {
  if (err) {
    console.log('[Error]:', err);
  }
  if (output) console.log('[output]:', output);
});

const app = express();

app.use(
  helmet({
    referrerPolicy: {
      policy: 'no-referrer',
    },
  })
);

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://code.jquery.com/jquery-3.6.4.min.js'],
      styleSrc: ["'default-src'", "'self'"],
      imgSrc: ["'self'"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
    },
  })
);

app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
);

app.use(express.static(distPath));

app.listen(8080, () => {
  console.log(`The Application start at locahost:8080`);
});
