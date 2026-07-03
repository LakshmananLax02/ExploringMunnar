export interface GoogleAuthResult {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}
