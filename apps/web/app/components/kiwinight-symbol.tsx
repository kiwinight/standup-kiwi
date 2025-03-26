import React from "react";

interface KiwinightSymbolProps extends React.SVGProps<SVGSVGElement> {
  appearance: "light" | "dark" | "inherit";
}

function KiwinightSymbol({ ref, appearance, ...props }: KiwinightSymbolProps) {
  const appearanceColorObj = {
    light: "#000",
    dark: "#ffffff",
    inherit: "#000",
  };

  const symbolColor = appearanceColorObj[appearance] || "#000";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={90}
      height={90}
      viewBox="0 0 90 90"
      fill="none"
      {...props}
    >
      <path
        fill={symbolColor}
        d="M83.7 9.7s-16 5.4-21.5 7L79.7.9s.1-1-1-.6-18.8 14.3-18.8 14.3-9.2-1.4-12.5 2c0 0-.2.3-.2.5s.7.2.7.2-2.7 1.2-3.8 3.9c-.7 1.5-1 2.1-1 2.1s-.4.4-.1.6c.3.1.7-.2.7-.2s-.7 1.2-2 2.3c0 0-.5.2-.4.5.1.2.4 0 .4 0S38.5 36 25.6 38.1c-11.5 2-17.2 12.5-18.2 14.3-.1.2-.2.4-.4.6-.3.5-.8 1.3-.3 1.1L7 54s-4.8 11.3 3.7 17.8c0 0 .7.7.8 1.1 0 0 .4-.1.5-.5 0 0 1.2 1.5 1.4 2.2 0 0 .2.5.5.3.3-.1.7-.9.7-.9s.5.7.3 1.1c-.2.5 1.8.3 1.8.3s.7 1 1.7.9c0 0 .4.5-.1 1 0 0 1.3.5 3.2-.4 0 0 .7-.1 1.2-.1l.9.1c-.2.9.3 2.5.5 3.1 1.1 2.1 4.1 7.4 4.1 7.4s.3.7-.2 1c-.7.6-1.3.3-1.3.3s-1.2-.4-1.7.1c-.5.6-.3 1-.3 1H45s0-1.9-1.9-1.9c-1.4 0-1.9.7-4.5.6-3-.1-7.4-.8-9.8-7.4C27.3 78.4 30 77 30 77s.5-.7 1.2-.3c0 0 .2.6.7.6.9.1 2.9-1.5 2.9-1.5s1-.2 1.4-.6c0 0-.1.5.3.7.7.4 2-.4 2-.4s5.2-3.4 7.2-6.9c0 0 .5 0 .8-.6.3-.6 1.8-3.4 4.3-10.1 0 0 .2.7.4.5.2-.2.3-1 .3-1s.7-4.4 1-6c.4-2 3-18.2 10.1-29.3 0 0 1.6-2.8 5.7-4.8 0 0 12.5-5.9 15.1-6.4 0 0 1-.4.9-1.1-.1-.1-.1-.3-.6-.1ZM57 20c-.6.6-1.2.7-1.6.5-.4-.4-.2-1.1.3-1.7.5-.6 1.2-.7 1.6-.5.5.4.3 1.2-.3 1.7Z"
      />
      <path
        fill={symbolColor}
        d="M41.1 75.2s1.4 1.9 1.6 2.3c.1.4 1.2 1.3 2.1.9C45.7 78 47 77 48 76c.8-.8 7.2-5.6 7.1-5.6 0 0 1.2-.9 3.4-.7 0 0 2 .3 3.3.7 1.3.5 1.6-.3 1.6-.3s.3-.7-.9-1.2c-1.2-.6-3.6-1.1-5.9-1.2 0 0 3.7-.8 7.7.1 1.7.5 2.3.2 2.3-.5s-.7-1-2.5-1.2c-1.6-.2-6.2-.5-8.5.2-.7.2-1.6.7-2.1 1.2-.6.5-1.3 1.1-2.1 2-2 2.1-3.4 3.1-4.6 3.5-1.1.5-1.7 0-1.7 0l-.7-.7-3.3 2.9Z"
      />
    </svg>
  );
}

export default KiwinightSymbol;
