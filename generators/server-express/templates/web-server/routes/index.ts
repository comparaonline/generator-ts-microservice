import * as express from 'express';
import * as healthcheck from 'express-healthcheck';
import test from './test';

const router = express.Router();

router.use('/test', test);
router.use('/healthcheck', healthcheck());

export default router;
