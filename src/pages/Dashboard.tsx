import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Palette, FolderOpen, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import { GradientButton } from "@/components/ui/gradient-button";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchProjects();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const createNewProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: "Untitled Project",
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Project created!");
      navigate(`/editor/${data.id}`);
    } catch (error: any) {
      toast.error("Failed to create project");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span>Webara</span>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Ready to build something amazing?
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6">
            {/* Create New Project Card */}
            <Card 
              className="border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
              onClick={createNewProject}
            >
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create New Project</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Start building a new website from scratch
                </p>
              </CardContent>
            </Card>

            {/* Existing Projects */}
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading projects...
              </div>
            ) : projects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card 
                    key={project.id}
                    className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                    onClick={() => navigate(`/editor/${project.id}`)}
                  >
                    <CardHeader>
                      <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                        <FolderOpen className="w-12 h-12 text-primary/50" />
                      </div>
                      <CardTitle className="truncate">{project.name}</CardTitle>
                      <CardDescription>
                        Updated {new Date(project.updated_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  You don't have any projects yet
                </p>
                <GradientButton onClick={createNewProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </GradientButton>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
