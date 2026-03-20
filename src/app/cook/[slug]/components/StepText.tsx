interface StepTextProps {
  text: string;
  keywords: string[];
}

export function StepText({ text, keywords }: StepTextProps) {
  if (!keywords.length) return <p>{text}</p>;

  const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
  const parts = text.split(regex);

  return (
    <p className="my-2 md:my-4 text-2xl/9 md:text-3xl/12 tracking-normal text-black">
      {parts.map((part, i) => {
        const isMatch = keywords.some(
          (kw) => kw.toLowerCase() === part.toLowerCase(),
        );
        return isMatch ? (
          <span key={i} className="font-bold text-black">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </p>
  );
}
