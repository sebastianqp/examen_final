import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import investigadorRoutes from './routes/investigadorRoutes.js';
import lineaRoutes from './routes/lineaRoutes.js';
import disponibilidadRoutes from './routes/disponibilidadRoutes.js';
import asignacionRoutes from './routes/asignacionRoutes.js';
import grupoRoutes from './routes/grupoRoutes.js';

const app = express();

app.use(json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.send('API de Investigación colaborativa'));

app.use('/api/investigadores', investigadorRoutes);
app.use('/api/lineas', lineaRoutes);
app.use('/api/disponibilidades', disponibilidadRoutes);
app.use('/api/asignaciones', asignacionRoutes);
app.use('/api/grupos', grupoRoutes);

export default app;
