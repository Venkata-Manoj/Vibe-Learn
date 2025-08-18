
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { Separator } from '@/components/ui/separator';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24px"
      height="24px"
      {...props}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.06,4.701C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C39.901,35.636,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const { user, loading, signUp, signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleAuthSuccess = (action: 'Sign-In' | 'Sign-Up' | 'Google Sign-In') => {
    toast({
      title: `${action} Successful`,
      description: 'Welcome!',
    });
    router.push('/');
  }

  const handleAuthError = (error: any, action: string) => {
    let description = `Could not ${action.toLowerCase()}. Please try again.`;
     if (error instanceof FirebaseError) {
      if (error.code === 'auth/unauthorized-domain') {
          description = 'This domain is not authorized for Google Sign-In. Please authorize localhost in your Firebase console under Authentication > Settings > Authorized domains.';
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        description = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        description = 'This email is already in use. Please sign in instead.';
        setIsLoginView(true);
      } else if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
         description = error.message;
      }
    }
    if (!(error instanceof FirebaseError && (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user'))) {
      toast({
        variant: 'destructive',
        title: `${action} Error`,
        description: description,
      });
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn(email, password);
      handleAuthSuccess('Sign-In');
    } catch (error: any) {
      handleAuthError(error, 'Sign-In');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      await signUp(email, password);
      handleAuthSuccess('Sign-Up');
    } catch (error: any) {
       handleAuthError(error, 'Sign-Up');
    } finally {
        setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
        await signInWithGoogle();
        handleAuthSuccess('Google Sign-In');
    } catch (error: any) {
        handleAuthError(error, 'Google Sign-In');
    } finally {
        setIsLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter both email and password.',
      });
      return;
    }

    if (isLoginView) {
        handleSignIn();
    } else {
        handleSignUp();
    }
  }

  if (loading || user) {
    return null; // Don't render anything while checking auth or redirecting
  }

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{isLoginView ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
          <CardDescription>
            {isLoginView ? 'Sign in to continue your journey.' : 'Join VibeLearn to start learning.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

            <div className="relative my-6">
                <Separator />
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
               {isLoading ? 'Processing...' : (
                <>
                    <GoogleIcon className="mr-2" />
                    Sign in with Google
                </>
                )}
            </Button>


           <div className="mt-4 text-center text-sm">
            <Button variant="link" onClick={() => setIsLoginView(!isLoginView)} disabled={isLoading}>
                {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
