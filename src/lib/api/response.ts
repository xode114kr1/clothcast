import { NextResponse } from "next/server";

export type ApiSuccessResponseBody<TData> = {
  status: "success";
  message: string;
  data: TData;
};

export type ApiErrorResponseBody<TCode extends string = string> = {
  status: "error";
  message: string;
  data: {
    code: TCode;
  };
};

export function apiSuccess<TData>(
  message: string,
  data: TData,
  init?: ResponseInit,
) {
  return NextResponse.json<ApiSuccessResponseBody<TData>>(
    {
      status: "success",
      message,
      data,
    },
    init,
  );
}

export function apiError<TCode extends string>(
  message: string,
  code: TCode,
  init?: ResponseInit,
) {
  return NextResponse.json<ApiErrorResponseBody<TCode>>(
    {
      status: "error",
      message,
      data: { code },
    },
    init,
  );
}
