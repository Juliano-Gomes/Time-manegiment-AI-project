// server.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const upload = multer({ dest: '/src/prediction/model-trained' });

app.use((request, response, next) => {
    console.log(`[ Request  ] : ${new Date()} - ${request.method} - ${request.url}`)
    next()
})

app.post('/model-trained/', upload.any(), (req, res) => {
    const destDir = path.join(__dirname, 'model-trained');

    // Cria diretório se não existir
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    if (req.files) {

        req.files.forEach(file => {
            const destPath = path.join(destDir, file.originalname);
            fs.renameSync(file.path, destPath);
        });
        res.send({ status: 'Modelo salvo com sucesso!' });
    }

});

app.use('/model', express.static(path.join(__dirname, 'model-trained')));

app.listen(88, () => {
    console.log('Servidor ouvindo em http://localhost:88');
});
