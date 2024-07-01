// authService.ts
export const login = async (adminName: string, password: string): Promise<boolean> => {
  // Replace this with actual authentication logic (e.g., API call)
  if (adminName === 'admin' && password === 'password') {
    return true;
  } else {
    return false;
  }
};
