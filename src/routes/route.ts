import { Router } from 'express'
import { Donate, index, LogMeIn, PutMeIn } from '../controllers'
import { JWT_VERIFY } from '../Middlewares/jwt.verify'

export const route = Router()

route.post('/Predict', JWT_VERIFY, index)
route.post('/Donetation', Donate)
route.post('/LogMeIn', LogMeIn)
route.post('/PutMeIn', PutMeIn)