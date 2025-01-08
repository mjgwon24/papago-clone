// 언어 감지
export const detectLanguage = async (text) => {
    const url = `http://127.0.0.1:3000/detect?query=${text}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.langCode;
};

// 번역
export const translateLanguage = async (text, source, target) => {
    const url = `http://127.0.0.1:3000/translate?text=${text}&source=${source}&target=${target}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.message.result.translatedText;
}