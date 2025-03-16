
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await refreshSession();
        navigate('/');
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/auth');
      }
    };
    
    handleCallback();
  }, [navigate, refreshSession]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-purple mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Completing authentication...</h2>
        <p className="text-muted-foreground">You'll be redirected shortly</p>
      </div>
    </div>
  );
};

export default AuthCallback;
