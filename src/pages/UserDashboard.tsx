
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BookOpen, History, Star, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Resource } from "@/types";

const UserDashboard = () => {
  const { user, isAuthenticated, isPremium, isLoading, userJourney, updateUserJourney } = useAuth();
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [isResourceLoading, setIsResourceLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    } else if (isAuthenticated) {
      loadRecentResources();
    }
  }, [isAuthenticated, isLoading, navigate]);

  const loadRecentResources = async () => {
    try {
      setIsResourceLoading(true);
      
      // Get recently clicked resources
      const { data, error } = await supabase
        .from('analytics')
        .select(`
          resource_id,
          created_at,
          resources (*)
        `)
        .eq('event_type', 'click')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const resources = data
          .filter(item => item.resources) // Filter out any null resources
          .map(item => item.resources as Resource);
          
        setRecentResources(resources);
      }
    } catch (error) {
      console.error("Failed to load recent resources:", error);
    } finally {
      setIsResourceLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account and view your personalized content
              </p>
            </div>
            
            {!isPremium && (
              <Button 
                onClick={() => navigate('/subscription')} 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            )}
          </div>
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Account Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan:</span>
                        <span className="font-medium flex items-center">
                          {isPremium ? (
                            <>
                              Premium 
                              <Sparkles className="ml-1 h-4 w-4 text-amber-500" />
                            </>
                          ) : (
                            "Free"
                          )}
                        </span>
                      </div>
                      
                      {!isPremium && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => navigate('/subscription')}
                          >
                            Upgrade Now
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="mr-2 h-5 w-5" /> 
                      Premium Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className={isPremium ? "text-green-500" : "text-gray-400"}>✓</span>
                        <span className="ml-2">Access to sponsored resources</span>
                      </li>
                      <li className="flex items-center">
                        <span className={isPremium ? "text-green-500" : "text-gray-400"}>✓</span>
                        <span className="ml-2">Daily email with resource updates</span>
                      </li>
                      <li className="flex items-center">
                        <span className={isPremium ? "text-green-500" : "text-gray-400"}>✓</span>
                        <span className="ml-2">No advertisements</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {!userJourney.hasCompletedOnboarding && (
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Your Setup</CardTitle>
                    <CardDescription>
                      Let's personalize your experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>Select your favorite categories to get personalized recommendations</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => updateUserJourney({ hasCompletedOnboarding: true })}>
                      Complete Setup
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="mr-2 h-5 w-5" />
                    Recently Viewed Resources
                  </CardTitle>
                  <CardDescription>
                    Keep track of resources you've viewed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isResourceLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : recentResources.length > 0 ? (
                    <div className="space-y-4">
                      {recentResources.map((resource) => (
                        <div key={resource.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {resource.source} • {resource.category}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => window.open(resource.link, "_blank")}>
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You haven't viewed any resources yet.</p>
                      <Button 
                        variant="link" 
                        onClick={() => navigate('/')}
                        className="mt-2"
                      >
                        Browse Resources
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5" />
                    Favorite Resources
                  </CardTitle>
                  <CardDescription>
                    Your saved resources for easy access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't saved any favorites yet.</p>
                    <p className="text-sm mt-2">
                      This feature will be available soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
