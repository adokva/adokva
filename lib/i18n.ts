import ru from "../messages/ru.json";
import en from "../messages/en.json";
import ar from "../messages/ar.json";

export const messages = {
  ru,
  en,
  ar,
};

export type Language =
  keyof typeof messages;

export function getMessages(
  language: Language
) {
  return (
    messages[language] ??
    messages.en
  );
}

export function detectLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  /*
    Если пользователь уже выбирал язык,
    используем его.
  */

  const saved =
    localStorage.getItem(
      "adokva-language"
    ) as Language | null;

  if (
    saved &&
    saved in messages
  ) {
    return saved;
  }

  /*
    Пока определяем язык браузера.
    Позже сюда добавим определение
    страны по IP.
  */

  const browser =
    navigator.language
      .toLowerCase();

  if (browser.startsWith("ru")) {
    return "ru";
  }

  if (browser.startsWith("ar")) {
    return "ar";
  }

  return "en";
}

export function saveLanguage(
  language: Language
) {
  localStorage.setItem(
    "adokva-language",
    language
  );
}