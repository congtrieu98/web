/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from './server';

export const updateSession = async (request: NextRequest) => {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    
    const supabase = await createClient();

    const { data } = await supabase.auth.getUser();
    console.log('user:', data);
    

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
