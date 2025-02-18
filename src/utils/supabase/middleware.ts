import { NextResponse, type NextRequest } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
