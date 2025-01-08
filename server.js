import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import HTTP from 'superagent';

const app = express();
const port = 3000;

// public 디렉토리를 정적 파일 디렉토리로 설정
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port,
    () => console.log(`http://127.0.0.1:${port}/ 서버 프로세스가 3000번 포트에서 실행 중입니다.`)
);