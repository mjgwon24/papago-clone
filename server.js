import express from 'express';
import path from 'path';
import HTTP from 'superagent';
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = 3000;

// 현재 모듈의 디렉토리 경로를 얻기 위한 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// public 디렉토리를 정적 파일 디렉토리로 설정
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 언어 감지
app.get('/detect', (req, res) => {
    const dectUrl = 'https://naveropenapi.apigw.ntruss.com/langs/v1/dect';
    const query = req.query.query;
    console.log('detect');
    console.log(`query: ${query}`);
    console.log(`client_id: ${CLIENT_ID}, client_secret: ${CLIENT_SECRET}`);

    HTTP.post(dectUrl)
        .send({ query: query })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-NCP-APIGW-API-KEY-ID', CLIENT_ID)
        .set('X-NCP-APIGW-API-KEY', CLIENT_SECRET)
        .then((resApi) => {
            console.log(resApi.body);
            res.json(resApi.body);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error occurred while calling the API');
        });
});

// 번역
app.get('/translate', (req, res) => {
    const transUrl = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
    const text = req.query.text;
    const source = req.query.source;
    const target = req.query.target;

    console.log('translate');

    HTTP.post(transUrl)
        .send({ text: text, source: source, target: target })
        .set('Content-Type', 'application/json')
        .set('x-ncp-apigw-api-key-id', CLIENT_ID)
        .set('x-ncp-apigw-api-key', CLIENT_SECRET)
        .then((resApi) => {
            console.log(resApi.body);
            res.json(resApi.body);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error occurred while calling the API');
        });
});

app.listen(port,
    () => console.log(`http://127.0.0.1:${port}/ 서버 프로세스가 3000번 포트에서 실행 중입니다.`)
);