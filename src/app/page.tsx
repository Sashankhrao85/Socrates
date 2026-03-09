import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-2xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to Socrates
        </h1>
        <p className="text-lg text-muted-foreground">
          I won&apos;t give you the answer. Instead, I&apos;ll help you discover
          it yourself through guided questions, visual aids, and audio hints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
        <Link href="/chat">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-primary/10">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Start Learning</CardTitle>
              </div>
              <CardDescription>
                Ask any question and I&apos;ll guide you to the answer through
                Socratic dialogue with text, images, and audio.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/analytics">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-primary/10">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">View Insights</CardTitle>
              </div>
              <CardDescription>
                See which learning modalities work best for you based on your
                engagement patterns and breakthrough moments.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <p className="mt-12 text-sm text-muted-foreground italic">
        &ldquo;I cannot teach anybody anything. I can only make them think.&rdquo;
      </p>
    </div>
  );
}
