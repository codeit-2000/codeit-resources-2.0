// 쿠키 설정
export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === "undefined") return; // 서버사이드에서 실행되지 않도록 체크
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// 쿠키 가져오기
export const getCookie = (name: string) =>
  document.cookie.split("; ").reduce((r, v) => {
    const [key, val] = v.split("=");
    return key === name ? decodeURIComponent(val) : r;
  }, "");

// 쿠키 만료
export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// 쿠키 전체 지우기
export const clearAllCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();

    // Set the cookie to expire in the past
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};
