import express from 'express';
import path from 'path';
import { ROOT } from '../parser/constants';

const staticMiddleware = express.static(path.join(ROOT, 'public'));

export default staticMiddleware;
