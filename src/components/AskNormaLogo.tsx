export default function AskNormaLogo({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 340 76"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="askNorma"
      fill="currentColor"
    >
      <text
        x="50%"
        y="58"
        textAnchor="middle"
        fontFamily="'Newsreader', Georgia, serif"
        fontStyle="italic"
        fontWeight="500"
        fontSize="56"
        letterSpacing="-0.5"
      >
        askNorma
      </text>
    </svg>
  );
}
