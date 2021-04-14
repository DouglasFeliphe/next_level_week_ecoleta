import express from 'express'
import routes from './routes';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate'
const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(errors()) // validação de formulário

dotenv.config() // habilita o acesso a variáveis de ambiente

app.listen(process.env.PORT || 3333, function () {
    console.log(`Express server listening on port 3333 in ${app.settings.env} mode`)
})