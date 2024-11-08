import { handleErrorResponse } from "./error.utils";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import userStore from "../stores/user.store";
import { LoginSuccessResponse } from "@/types/auth.types";
import { BASE_URL } from "@/constants/network";
interface FetchWrapperOptions {
  excludeAuthHeader: boolean;
}
export interface FetchResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
}

async function getAccessToken() {
  const item_value: string | null = await SecureStore.getItemAsync(
    "userDetails"
  );

  const user: null | LoginSuccessResponse["data"] = item_value
    ? JSON.parse(item_value)
    : null;
  return user?.token;
}
export function unwrapErrors(
  errorObject: Record<string, string[]>
): { title: string; description: string }[] {
  const unwrappedErrors = [];

  for (const key in errorObject) {
    const title = key;
    const description = errorObject[key][0]; // Assuming the first element is the description

    unwrappedErrors.push({ title, description });
  }

  return unwrappedErrors;
}

export function objectToFormData(obj: any) {
  const formData = new FormData();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      formData.append(key, obj[key]);
    }
  }
  return formData;
}

export function logFormData(formData: FormData) {
  console.log("Logging formdata...");
  if (formData && formData.values()) {
    for (let value of formData.values()) {
      console.log(value);
    }
  } else {
    console.log("Formdata is undefined");
  }
}

export function objectToHeaders(obj: any) {
  const headers = new Headers();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      headers.append(key, obj[key]);
    }
  }
  return headers;
}

export async function fetchGet<T>(
  url: string,
  headers: undefined | Headers = new Headers()
): Promise<T> {
  try {
    const token = getAccessToken();

    const headers_ = objectToHeaders({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
      XAT: "U",
      "X-IDT": "A",
    });

    const response = await fetch(url, {
      method: "GET",
      headers: headers_,
    });
    handleSessionExpiry(response);

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
// export async function axiosfetchGet<T>(
//   url: string,
//   headers?: RawAxiosRequestHeaders | AxiosHeaders
// ): Promise<T> {
//   try {
//     const response = await api.get(url, {
//       headers,
//     });
//     return await response.data;
//   } catch (error) {
//     console.error("Fetch error:", error);
//     throw error;
//   }
// }
// export async function axiosPost<T>(
//   url: string,
//   headers?: RawAxiosRequestHeaders | AxiosHeaders,
//   data?: any
// ): Promise<T> {
//   try {
//     const response = await api.post(url, data, {
//       headers: headers,
//     });
//     return await response.data;
//   } catch (error: any) {
//     handleErrorResponse(error);

//     console.error("Fetch error:", error);
//     throw error;
//   }
// }

export async function postJson<T>(
  url: string,
  dataObject: Record<string, any>,
  options: FetchWrapperOptions = {
    excludeAuthHeader: false,
  }
): Promise<FetchResponseWrapper<T>> {
  const token = await getAccessToken();
  const headers_ =
    options.excludeAuthHeader === false
      ? objectToHeaders({
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        })
      : new Headers({
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        });

  const body = JSON.stringify(dataObject);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers_,
      body,
    });
    // alert(response.status);
    handleSessionExpiry(response);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function fetchDelete<T>(
  url: string,
  headers: Headers = new Headers()
): Promise<T> {
  try {
    const token = await getAccessToken();

    const headers_ = objectToHeaders({
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
      XAT: "U",
      "X-IDT": "A",
      ...headers,
    });

    const response = await fetch(url, {
      method: "DELETE",
      headers: headers_,
    });

    handleSessionExpiry(response);
    alert(response);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchPost<T>(
  url: string,
  dataObject: Record<string, any>,
  noAuthHeader = false
): Promise<T> {
  const token = getAccessToken();
  const headers_ =
    noAuthHeader === false
      ? objectToHeaders({
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        })
      : new Headers({
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        });

  const body = JSON.stringify(dataObject);
  console.log(body, "headers");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers_,

      body,
    });
    handleSessionExpiry(response);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchJson<T>(
  url: string,
  options: FetchWrapperOptions = {
    excludeAuthHeader: false,
  }
): Promise<T> {
  const token = userStore.getState().user?.token ?? null;
  const headers_ =
    options.excludeAuthHeader === false
      ? objectToHeaders({
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
          XAT: "U",
          "X-IDT": "A",
        })
      : new Headers();
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers_,
    });
    handleSessionExpiry(response);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchWithFormData<T>(
  url: string,
  dataObject: Record<string, any>,
  method = "POST",
  headers: Headers = new Headers()
): Promise<T> {
  const formData = objectToFormData(dataObject);

  try {
    const response = await fetch(url, {
      method: method,
      body: formData,
      headers,
    });
    handleSessionExpiry(response);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function postFormData<T>(
  url: string,
  dataObject: Record<string, any>,
  headers: Headers = new Headers()
): Promise<T> {
  const formData = objectToFormData(dataObject);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers,
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function fetchWithParams<T>(
  url: string,
  params: { [key: string]: string | number | null | undefined },
  headersObj: { [key: string]: string } = {}
): Promise<T> {
  const filteredParams = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .reduce<{ [key: string]: string }>((acc, [key, value]) => {
      acc[key] = value as string;
      return acc;
    }, {});

  const searchParams = new URLSearchParams(filteredParams).toString();
  const fullUrl = searchParams ? `${url}?${searchParams}` : url;

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headersObj,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data from:", url, error);
    throw error;
  }
}

const handleSessionExpiry = (response: Response) => {
  // alert(response.status);
  // alert(response.status + "response info");
  if (response.status == 403 || response.status == 404) {
    // FlashMessage("Session expired, please login again", "danger");
    // // alert("refetching");
    // //  response.json().then((data) => console.log();
    // store.dispatch(logout());
    setTimeout(() => {
      userStore.getState().logout();
    }, 10);
  }
};

export const usePromise = (props: PromiseProps) => {
  const { url, token, body, method } = props;
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}${url}`, {
      method: method ? method : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-IDT": "A",
        XAT: "U",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.status === 403) {
          // Check if status code is 403
          router.push("/auth/sign-in/");
          // Replace '/login' with the actual URL of your login page
          // Throw error to be caught in the .catch() block
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
type PromiseProps = {
  url?: any;
  token?: any;
  body?: any;
  method?: any;
};
