import { Route, Routes } from "react-router-dom";
import TopNav from "./components/TopNav";
import ToastViewport from "./components/Toast";
import { ToastProvider } from "./state/ToastContext";
import { HideFlowProvider } from "./state/HideFlowContext";
import { ExtractFlowProvider } from "./state/ExtractFlowContext";
import Home from "./pages/Home";
import HideFlow from "./pages/HideFlow";
import ExtractFlow from "./pages/ExtractFlow";
import About from "./pages/About";

export default function App() {
  return (
    <ToastProvider>
      <HideFlowProvider>
        <ExtractFlowProvider>
          <div className="flex min-h-screen flex-col bg-base text-text">
            <TopNav />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hide" element={<HideFlow />} />
                <Route path="/extract" element={<ExtractFlow />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <footer className="border-t border-border-subtle px-4 py-6 text-center text-xs text-text-faint">
              StegoArt — CNN-autoencoder steganography + feed-forward neural style transfer. Academic demo, runs entirely locally.
            </footer>
          </div>
          <ToastViewport />
        </ExtractFlowProvider>
      </HideFlowProvider>
    </ToastProvider>
  );
}
