
import { AuthButton } from "@/components/auth/AuthButton";

export default function Hero() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-fade-up">
          Mabot
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-blue-800 dark:text-blue-200 max-w-2xl mx-auto animate-fade-up animation-delay-100">
          Create powerful AI bots with an intuitive visual interface
        </p>
        <div className="mt-8 flex justify-center gap-4 animate-fade-up animation-delay-200">
          <AuthButton />
          <a href="#samples" className="inline-flex items-center justify-center px-6 py-2 border border-blue-300 dark:border-blue-700 rounded-md text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800/50 transition-colors">
            View Samples
          </a>
        </div>
      </div>
    </div>
  );
}
