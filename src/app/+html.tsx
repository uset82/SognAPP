export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html {
                height: 100%;
                -webkit-text-size-adjust: 100%;
              }
              body {
                margin: 0 !important;
                padding: 0 !important;
                min-height: 100% !important;
                background-color: #E4EBE4 !important;
                overflow-x: hidden !important;
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch !important;
                touch-action: manipulation !important;
                -webkit-tap-highlight-color: transparent !important;
              }
              #root {
                min-height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
              }
              button, a, [role="button"] {
                cursor: pointer;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
