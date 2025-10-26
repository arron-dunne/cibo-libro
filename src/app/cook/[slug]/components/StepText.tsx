
interface StepTextProps {
  text: string;
  keywords: string[];
}

export function StepText({ text, keywords }: StepTextProps) {
  if (!keywords.length) return <p>{text}</p>;

  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
  const parts = text.split(regex);

  return (
    <p className="mt-6 text-2xl/6 md:text-3xl/10 tracking-normal text-orange-950/95">
      {parts.map((part, i) => {
        const isMatch = keywords.some(
          (kw) => kw.toLowerCase() === part.toLowerCase()
        );
        return isMatch ? (
          <span key={i} className="font-bold text-orange-950">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </p>
  );
}
