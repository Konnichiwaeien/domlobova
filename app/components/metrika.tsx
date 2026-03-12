'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

export function Metrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Эта функция срабатывает при загрузке страницы И при смене маршрута
    const url = window.location.href;

    // @ts-ignore
    if (typeof window.ym !== 'undefined') {
      // @ts-ignore
      // Вызываем hit вручную для текущего URL, как требует документация для SPA
      window.ym(107278981, 'hit', url);
    }
  }, [pathname, searchParams]);

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=107278981", "ym");

          ym(107278981, "init", {
            ssr:true, 
            webvisor:true, 
            clickmap:true, 
            ecommerce:"dataLayer", 
            referrer: document.referrer, 
            url: location.href, 
            accurateTrackBounce:true, 
            trackLinks:true,
            defer: true
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src="https://mc.yandex.ru/watch/107278981"
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
