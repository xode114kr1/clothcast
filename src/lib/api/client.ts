export type ApiResponse<T = unknown> = {
  status: "success" | "error";
  message: string;
  data?: T;
};

type ApiErrorMessages = Record<string, string>;

type FetchApiOptions<T> = {
  fallbackMessage: string;
  invalidDataMessage?: string;
  errorMessages?: ApiErrorMessages;
  validateData?: (data: unknown) => data is T;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
    readonly code?: string,
    readonly response?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getApiErrorCode(data: unknown) {
  if (!isRecord(data) || !isRecord(data.data)) {
    return null;
  }

  return typeof data.data.code === "string" ? data.data.code : null;
}

export function getApiResponseMessage(
  data: unknown,
  fallbackMessage: string,
  errorMessages?: ApiErrorMessages,
) {
  const code = getApiErrorCode(data);

  if (code && errorMessages?.[code]) {
    return errorMessages[code];
  }

  if (isRecord(data) && typeof data.message === "string") {
    return data.message;
  }

  return fallbackMessage;
}

async function parseApiJson(response: Response) {
  return (await response.json().catch(() => null)) as ApiResponse | null;
}

export async function fetchApiData<T = unknown>(
  input: RequestInfo | URL,
  init: RequestInit,
  options: FetchApiOptions<T>,
) {
  const response = await fetch(input, init);
  const data = await parseApiJson(response);

  if (!response.ok || data?.status !== "success") {
    const code = getApiErrorCode(data);

    throw new ApiClientError(
      getApiResponseMessage(data, options.fallbackMessage, options.errorMessages),
      response.status,
      code ?? undefined,
      data,
    );
  }

  if (options.validateData && !options.validateData(data.data)) {
    throw new ApiClientError(
      options.invalidDataMessage ?? options.fallbackMessage,
      response.status,
      undefined,
      data,
    );
  }

  return data.data as T;
}

export async function fetchApiJson<T = unknown>(
  input: RequestInfo | URL,
  init: Omit<RequestInit, "body"> & { body?: unknown },
  options: FetchApiOptions<T>,
) {
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetchApiData<T>(
    input,
    {
      ...init,
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    },
    options,
  );
}
