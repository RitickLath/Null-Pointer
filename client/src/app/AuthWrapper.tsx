import { AuthProvider } from "./context/AuthContext";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthWrapper;
