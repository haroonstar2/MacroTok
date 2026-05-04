export function MacroTokLogo({
  size = "large",
  color = "white",
}: {
  size?: "large" | "small";
  color?: "gradient" | "white";
}) {
  const isLarge = size === "large";
  const isGradient = color === "gradient";

  if (isGradient) {
    return (
      <p
        // className={`bg-clip-text font-['Abyssinica_SIL:Regular',_sans-serif] not-italic text-nowrap tracking-[-1.2px]${isLarge ? " text-[48px] leading-[48px]" : " text-[24px] leading-[24px] tracking-[-0.6px]"}`}
        style={{
          WebkitTextFillColor: "transparent",
          backgroundImage:
            "linear-gradient(90deg, rgb(54, 65, 83) 0%, rgb(54, 65, 83) 100%), linear-gradient(166.884deg, rgb(16, 24, 40) 0%, rgb(74, 85, 101) 50%, rgb(16, 24, 40) 100%)",
        }}
      >
        MacroTok
      </p>
    );
  }

  return (
    <p
      className={`font-['Abyssinica_SIL:Regular',_sans-serif] not-italic text-nowrap text-white tracking-[-1.2px]${isLarge ? " text-[48px] leading-[48px]" : " text-[24px] leading-[24px] tracking-[-0.6px]"}`}
    >
      MacroTok
    </p>
  );
}
