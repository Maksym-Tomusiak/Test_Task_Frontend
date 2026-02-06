import { AuthProvider } from './contexts/AuthContext';
import Router from './router/Router';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
