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
              html, body { margin: 0; background: #E4EBE4; }
              html, body, #root { min-height: 100%; }
              body { overflow-y: auto; -webkit-overflow-scrolling: touch; }
              #root { display: block; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
