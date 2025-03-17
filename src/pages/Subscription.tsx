
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Shield, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const planFeatures = {
  free: [
    "Access to basic resources",
    "Browse all categories",
    "Search functionality",
    "Save favorites",
  ],
  premium: [
    "Everything in Free",
    "Access to sponsored resources",
    "Priority support",
    "No advertisements",
    "Early access to new resources",
  ],
};

const Subscription = () => {
  const { user, isPremium, refreshSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleUpgrade = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    try {
      // For demo purposes, we'll just upgrade the user without payment processing
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Create subscription record
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      // Create a subscription with type assertion
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_type: 'premium',
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: oneYearFromNow.toISOString(),
        });

      if (subError) throw subError;

      await refreshSession();
      
      toast({
        title: "Upgrade successful!",
        description: "You now have access to premium content",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Upgrade failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container max-w-6xl mx-auto pt-32 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Unlock all resources including sponsored content with our premium plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free plan */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Free Plan</span>
                <Shield className="h-6 w-6 text-gray-500" />
              </CardTitle>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <CardDescription>
                Best for casual browsing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {planFeatures.free.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={true}>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Premium plan */}
          <Card className={`border-2 ${isPremium ? 'border-green-500 dark:border-green-400' : 'border-amber-500 dark:border-amber-400'} relative`}>
            {!isPremium && (
              <div className="absolute -top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Recommended
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Premium Plan</span>
                <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
              </CardTitle>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <CardDescription>
                Unlock all premium content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {planFeatures.premium.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isPremium ? (
                <Button variant="outline" className="w-full" disabled>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  onClick={handleUpgrade}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Upgrade Now
                    </span>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
