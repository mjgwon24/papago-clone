import {detectLanguage, translateLanguage} from "./api.js";

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
        timer = setTimeout(async () => {
            const query = beforeTransText.value;

            const langCode = await detectLanguage(query);
            detLan.textContent = langCode === 'ko' ? '한국어' : '영어';

            const source = detLan.textContent === '한국어' ? 'ko' : 'en';
            const target = transLan.textContent === '한국어' ? 'ko' : 'en';
            const text = beforeTransText.value;

            // source와 target이 같다면 번역하지 않음
            if (source === target) {
                afterTransText.value = text;
                return;
            }

            // 번역
            afterTransText.value = await translateLanguage(text, source, target);
        }, 1000);
    });
});