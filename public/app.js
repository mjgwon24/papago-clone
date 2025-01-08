document.addEventListener('DOMContentLoaded', () => {
    const beforeTransText = document.getElementById('beforeTransText');
    const afterTransText = document.getElementById('afterTransText');
    const lang = document.getElementById('lang');
    const detLan = document.getElementById('detLan');
    const transLan = document.getElementById('transLan');

    const dropdown = document.getElementById('dropDown');
    const dropdown2 = document.getElementById('dropDown2');
    const dropdownContent = document.getElementById('dropdownContent');
    const dropdownContent2 = document.getElementById('dropdownContent2');

    let timer;

    // 언어 선택
    try {
        dropdown.addEventListener('click', () => {
            if (dropdownContent.style.display === 'none') {
                dropdownContent.style.display = 'block';
            } else {
                dropdownContent.style.display = 'none';
            }
        });

        dropdown2.addEventListener('click', () => {
            if (dropdownContent2.style.display === 'none') {
                dropdownContent2.style.display = 'block';
            } else {
                dropdownContent2.style.display = 'none';
            }
        });
    } catch (error) {
        console.error(error);
    }

    // 문자 입력시
    beforeTransText.addEventListener('input', () => {
        const text = beforeTransText.value;
        const textLength = text.length;

        // 3000자 이상 입력 방지
        try {
            if (textLength > 3000) {
                text.value = text.slice(0, 3000);
                return;
            }

            lang.textContent = textLength;
        } catch (error) {
            console.error(error);
        }

        if (timer) clearTimeout(timer);

        // 입력 문자 언어 감지 (1초 후)
        timer = setTimeout(() => {
            const query = beforeTransText.value;
            console.log(`query: ${query}`);

            // 1. XHR API(객체) 호출
            const xhr = new XMLHttpRequest(); // Web API(브라우저에서만 가능)

            // 2. Node.js 서버로부터 요청 결과를 받았을 경우 처리할 로직(onload, 콜백)
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    detLan.textContent = data.langCode == 'ko' ? '한국어' : '영어';
                } else {
                    console.error('Error occurred while calling the API');
                }
            };

            // 3. 요청 준비
            const DETECT_LANGUAGES_URL = `http://127.0.0.1:3000/detect?query=${query}`;
            xhr.open('GET', DETECT_LANGUAGES_URL);

            // 4. 요청 전송
            xhr.send();
        }, 1000);

        // 입력 문자 번역 (1초 후)
        timer = setTimeout(() => {
            const source = detLan.textContent == '한국어' ? 'ko' : 'en';
            const target = transLan.textContent == '한국어' ? 'ko' : 'en';
            const text = beforeTransText.value;

            // source와 target이 같다면 번역하지 않음
            if (source == target) {
                afterTransText.value = text;
                return;
            }

            console.log(`text: ${text}, source: ${source}, target: ${target}`);

            // 1. XHR API(객체) 호출
            const xhr = new XMLHttpRequest(); // Web API(브라우저에서만 가능)

            // 2. Node.js 서버로부터 요청 결과를 받았을 경우 처리할 로직(onload, 콜백)
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    afterTransText.value = data.message.result.translatedText;
                } else {
                    console.error('Error occurred while calling the API');
                }
            };

            // 3. 요청 준비
            const TRANSLATE_URL = `http://127.0.0.1:3000/translate?text=${text}&source=${source}&target=${target}`;
            xhr.open('GET', TRANSLATE_URL);

            // 4. 요청 전송
            xhr.send();
        }, 1000);
    });
});