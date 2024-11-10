import { handleErrorResponse } from "./error.utils";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import useUserStore from "@/stores/user.store";
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
interface PostFormDataOptions {
  headers?: Headers;
  onUploadProgress?: (progressEvent: { loaded: number; total: number }) => void;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Record<string, string[]>;
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
  const token = useUserStore.getState().token ?? null;
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
export async function patchJson<T>(
  url: string,
  dataObject: Record<string, any>,
  options: FetchWrapperOptions = {
    excludeAuthHeader: false,
  }
): Promise<FetchResponseWrapper<T>> {
  const token = useUserStore.getState().token ?? null;
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
      method: "PATCH",
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
  const token = useUserStore.getState().token ?? null;
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
  options: PostFormDataOptions = {}
): Promise<ApiResponse<T>> {
  const token = useUserStore.getState().token ?? null;

  try {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      // Logging the incoming dataObject
      console.log("Original dataObject:", dataObject);

      // Convert dataObject to FormData and log each entry
      Object.keys(dataObject).forEach((key) => {
        const value = dataObject[key];
        console.log(`Processing key "${key}":`, value);

        if (value && typeof value === "object" && "uri" in value) {
          // Handle file objects
          const fileObject = {
            uri: value.uri,
            type: value.type || "application/octet-stream",
            name: value.name || "file",
          };
          console.log(`Appending file for "${key}":`, fileObject);
          formData.append(key, fileObject as any);
        } else if (Array.isArray(value)) {
          // Handle arrays
          const arrayString = JSON.stringify(value);
          console.log(`Appending array for "${key}":`, arrayString);
          formData.append(key, arrayString);
        } else if (value !== null && value !== undefined) {
          // Handle primitive values
          console.log(`Appending value for "${key}":`, value.toString());
          formData.append(key, value.toString());
        }
      });

      // Log headers that will be sent
      const headersToSend = {
        Authorization: token ? `Bearer ${token}` : undefined,
        XAT: "U",
        "X-IDT": "A",
        ...options.headers,
      };
      console.log("Headers to be sent:", headersToSend);

      // Log the full request details
      console.log("Request details:", {
        url,
        method: "POST",
        headers: headersToSend,
        formDataKeys: Object.keys(dataObject),
      });

      xhr.upload.onprogress = (event) => {
        if (options.onUploadProgress) {
          const progress = {
            loaded: event.loaded,
            total: event.total,
          };
          console.log("Upload progress:", progress);
          options.onUploadProgress(progress);
        }
      };

      xhr.onload = async () => {
        try {
          const response = JSON.parse(xhr.responseText);
          console.log("Server response:", response);

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              success: true,
              message: response.message || "Operation successful",
              data: response.data || response,
            });
          } else {
            resolve({
              success: false,
              message: response.message || "Operation failed",
              data: null,
              errors: response.errors || {
                general: [`HTTP Error: ${xhr.status}`],
              },
            });
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          resolve({
            success: false,
            message: "Failed to parse server response",
            data: null,
            errors: {
              general: ["Invalid server response"],
            },
          });
        }
      };

      xhr.onerror = () => {
        console.error("XHR error occurred");
        resolve({
          success: false,
          message: "Network error occurred",
          data: null,
          errors: {
            general: ["Failed to connect to server"],
          },
        });
      };

      xhr.ontimeout = () => {
        console.error("XHR timeout occurred");
        resolve({
          success: false,
          message: "Request timed out",
          data: null,
          errors: {
            general: ["Server took too long to respond"],
          },
        });
      };

      xhr.open("POST", url, true);

      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }
      xhr.setRequestHeader("XAT", "U");
      xhr.setRequestHeader("X-IDT", "A");

      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          console.log(`Setting custom header: ${key}:`, value);
          xhr.setRequestHeader(key, value);
        });
      }

      console.log("Sending request...");
      xhr.send(formData);
    });
  } catch (error) {
    console.error("Caught error in postFormData:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
      errors: {
        general: [error instanceof Error ? error.message : "Unknown error"],
      },
    };
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
  if (response.status == 403) {
    // FlashMessage("Session expired, please login again", "danger");
    // // alert("refetching");
    // //  response.json().then((data) => console.log();
    // store.dispatch(logout());
    setTimeout(() => {
      useUserStore.getState().logout();
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
          router.push("/(auth)/login");
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
