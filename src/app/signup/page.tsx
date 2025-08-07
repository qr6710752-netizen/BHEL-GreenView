
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const mockUsers = [
  { name: "Priya Singh", email: "priya.singh@example.com", department: "Engineering" },
  { name: "Ravi Sharma", email: "ravi.sharma@example.com", department: "Marketing" },
  { name: "Anil Kumar", email: "anil.kumar@example.com", department: "Operations" },
];

const DEFAULT_MOCK_PASSWORD = "password123";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMockLoading, setIsMockLoading] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update user's profile in Firebase Auth
      await updateProfile(user, {
        displayName: name,
      });

      // 3. Create user document in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: name,
        email: user.email,
        department: "Unassigned",
        role: email === "admin123@gmail.com" ? "admin" : "user",
        points: 0,
        badges: [],
      });
      
      toast({
        title: "Sign Up Successful",
        description: "Please login with your new account.",
      });

      router.push("/login");

    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";
      if (error.code === 'auth/email-already-in-use') {
          errorMessage = "This email is already registered. Please log in instead.";
      } else {
          errorMessage = error.message;
      }
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateMockUser = async (mockUser: typeof mockUsers[0]) => {
      setIsMockLoading(mockUser.email);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, mockUser.email, DEFAULT_MOCK_PASSWORD);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: mockUser.name
        });

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            name: mockUser.name,
            email: mockUser.email,
            department: mockUser.department,
            role: "user",
            points: Math.floor(Math.random() * 2500) + 500, // Assign random points
            badges: [],
        });
        
        toast({
            title: "Mock Account Created!",
            description: `${mockUser.name}'s account is ready. You can now log in.`,
        });

      } catch (error: any) {
          let errorMessage = "An unexpected error occurred.";
          if (error.code === 'auth/email-already-in-use') {
              errorMessage = "This mock account already exists. Please log in.";
          } else {
              errorMessage = error.message;
          }
          toast({
              variant: "destructive",
              title: "Creation Failed",
              description: errorMessage,
          });
      } finally {
          setIsMockLoading(null);
      }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
           <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              BHEL GreenView
            </h1>
          </div>
        </div>
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || !!isMockLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || !!isMockLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || !!isMockLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || !!isMockLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign Up
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
                <h3 className="text-center text-sm font-medium text-muted-foreground">Or create a mock account</h3>
                <div className="grid grid-cols-1 gap-2">
                    {mockUsers.map(mock => (
                        <Button 
                            key={mock.email} 
                            variant="outline" 
                            onClick={() => handleCreateMockUser(mock)}
                            disabled={isLoading || !!isMockLoading}
                        >
                             {isMockLoading === mock.email && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create {mock.name}
                        </Button>
                    ))}
                </div>
                <p className="text-xs text-center text-muted-foreground">
                    This directly creates the account. The default password is "{DEFAULT_MOCK_PASSWORD}".
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
