import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                height: 100%;
                height: 100dvh;
                max-height: 100dvh;
              }
              html, body { margin: 0; overflow: hidden; background: #1A2320; }
              #root { display: flex; flex-direction: column; min-height: 0; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
