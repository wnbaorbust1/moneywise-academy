import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ChevronRight, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { getModuleArticles } from "@/lib/educationHub";

function ArticleView({ article, onBack }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to articles
      </button>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${article.tagColor}`}>
        {article.tag}
      </span>
      <h3 className="font-display font-bold text-lg mt-2 mb-4">{article.title}</h3>
      <div className="prose prose-sm prose-slate max-w-none text-foreground
        [&_strong]:font-semibold [&_strong]:text-foreground
        [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-3
        [&_ul]:text-sm [&_ul]:space-y-1 [&_ul]:pl-4 [&_ul]:list-disc
        [&_ol]:text-sm [&_ol]:space-y-1 [&_ol]:pl-4 [&_ol]:list-decimal
        [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
        [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:font-semibold [&_th]:border-b [&_th]:border-border [&_th]:pb-1 [&_td]:py-1 [&_td]:border-b [&_td]:border-border/40
      ">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </div>
  );
}

function ArticleList({ hub, onSelect }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Short reads to deepen your understanding of <strong>{hub.title}</strong>.
      </p>
      <div className="space-y-3">
        {hub.articles.map((article) => (
          <Card
            key={article.id}
            onClick={() => onSelect(article)}
            className="p-4 cursor-pointer hover:shadow-md transition-all border hover:border-primary/30 group"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${article.tagColor}`}>
                  {article.tag}
                </span>
                <p className="font-semibold text-sm mt-1.5 leading-tight">{article.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {article.content.split("\n")[2]?.replace(/\*\*/g, "").slice(0, 70)}…
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function EducationHubSheet({ moduleIndex }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const hub = getModuleArticles(moduleIndex);

  if (!hub) return null;

  return (
    <Sheet onOpenChange={(open) => { if (!open) setSelectedArticle(null); }}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs shrink-0 border-primary/40 text-primary hover:bg-primary/5">
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Learn More</span>
          <Badge className="ml-0.5 h-4 px-1 text-[9px] bg-primary text-primary-foreground">
            {hub.articles.length}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="font-display text-lg flex items-center gap-2">
            <span className="text-xl">{hub.emoji}</span> Education Hub
          </SheetTitle>
        </SheetHeader>

        {selectedArticle ? (
          <ArticleView article={selectedArticle} onBack={() => setSelectedArticle(null)} />
        ) : (
          <ArticleList hub={hub} onSelect={setSelectedArticle} />
        )}
      </SheetContent>
    </Sheet>
  );
}