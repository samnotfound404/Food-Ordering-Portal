const API_BACKEND = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = `${API_BACKEND}/api/v1`;

import { getCookie } from "cookies-next";

interface ApiCallOptions {
  method?: string;
  isAuth?: boolean;
  body?: object | null;
  next?: object | null;
  formData?: FormData | null;
}

export const apiCall = async (
  path: string,
  {
    method = "GET",
    isAuth = true,
    body = null,
    formData = null,
    next = null,
  }: ApiCallOptions = {}
) => {
  const accessToken = getCookie("accessToken");
  if (!accessToken && isAuth && window.location.pathname != "/login" && window.location.pathname != "/register") {
    window.location.href = "/login";
    return;
  }

  let requestUrl = `${BASE_URL}${path}/`;
  const csrftoken = getCSRFCookie("csrftoken")!;

  console.log(csrftoken)

  const headers: HeadersInit = {};

  const req: any = {
    method: method,
  };

  if ((method == "POST" || method == "PATCH") && body) {
    req["body"] = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }
  if ((method == "POST" || method == "PATCH") && formData) {
    req["body"] = formData;
    headers["accept"] = "application/json";
  }
  if (method == "DELETE") {
    headers["accept"] = "application/json";
  }

  if (isAuth) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

    headers["X-CSRFToken"] = csrftoken;


  req["headers"] = headers;

  if (next) {
    req["next"] = next;
  }

  const res = await fetch(requestUrl, req);
  if (method!="DELETE") {
  return res.json();}
};

function getCSRFCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export async function getHotelList() {
    return apiCall("/hotels", {method: "GET"});
}
