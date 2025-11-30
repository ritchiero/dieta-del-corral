import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Plan from "./pages/Plan";
import Entrenamiento from "./pages/Entrenamiento";
import Calendario from "./pages/Calendario";
import Reglas from "./pages/Reglas";
import Integracion from "./pages/Integracion";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route>
        <ProtectedRoute>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/plan" component={Plan} />
              <Route path="/entrenamiento" component={Entrenamiento} />
              <Route path="/calendario" component={Calendario} />
              <Route path="/reglas" component={Reglas} />
              <Route path="/integracion" component={Integracion} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
