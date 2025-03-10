import {createElement, ReactNode, useEffect, useState} from "react";

const RemoteComponent = <T extends Record<string, unknown>>(
  {
    url,
    css = false,
    name,
    props,
    children = null,
    error = 'Load Remote Component Error!'
  }: {
    url: string
    css?: boolean | string
    name?: string
    props?: T
    children?: ReactNode
    error?: ReactNode
  }
) => {
  const [componentLoading, setComponentLoading] = useState(true)
  const scriptFileName = url.replace(/.*?([^/.]+)[.\w]+$/, '$1');

  useEffect(() => {
    setComponentLoading(true)
    const scriptElement = document.createElement('script');
    scriptElement.src = url;
    scriptElement.onload = () => {
      setComponentLoading(false)
      scriptElement.remove()
    }
    scriptElement.onerror = () => {
      setComponentLoading(false)
      scriptElement.remove()
    }
    document.body.appendChild(scriptElement);
  }, [url]);
  useEffect(() => {
    if (css == true) {
      const linkElement = document.createElement('link');
      linkElement.href = url.replace(/[^/]+$/, `${scriptFileName}.css`);
      linkElement.rel = 'stylesheet';
      document.head.appendChild(linkElement);
      return () => {
        linkElement.remove()
      }
    }
  }, [css]);
  if (componentLoading) {
    return children
  }
  if (window[(name || scriptFileName) as never]) {
    return createElement((window[(name || scriptFileName) as never] as never), props)
  }
  return error
}
export default RemoteComponent