const GA_MEASUREMENT_ID = "G-480LVGNKKT"

/**
 * Renders the standard Google tag (gtag.js) in the initial HTML
 * so it loads immediately and realtime reports work.
 */
export function GoogleAnalyticsScripts() {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `
        }}
      />
    </>
  )
}
