import {createElement, FunctionComponent, ReactNode, useEffect, useState} from "react";

const RemoteComponent = <T extends Record<string, unknown>>(
  {
    url,
    css = false,
    name,
    props = {} as T,
    children,
    loading,
    fallback,
    cache = true
  }: {
    /**
     * 组件文件地址
     */
    url: string
    /**
     * 如果 css 为 true, 则使用 url 最后一个 / 后面的文件名作为 css 文件名，否则视为直接 css 文件地址
     *
     * ```
     * 如 /js/index.umd.js 则加载 /css/index.css
     * ```
     */
    css?: boolean | string
    /**
     * 如果 name 为空, 则使用 url 最后一个 / 后面的文件名作为组件名
     *
     * ```
     * 如 /js/index.umd.js 则 name 为 index
     * ```
     */
    name?: string
    /**
     * 组件的 props
     */
    props?: T
    /**
     * 组件加载中的 loading 组件
     */
    loading?: FunctionComponent
    /**
     * 如果没有 loading 组件, 则使用 children 作为组件加载中的 loading 组件
     */
    children?: ReactNode
    /**
     * 组件加载失败的 fallback 组件
     */
    fallback?: FunctionComponent
    /**
     * 是否已挂载的缓存组件
     */
    cache?: boolean
  }
) => {
  const scriptFileName = url.replace(/.*?([^/.]+)[.\w]+$/, '$1');
  const [componentLoading, setComponentLoading] = useState(!window[(name || scriptFileName) as never])

  useEffect(() => {
    if (cache && window[(name || scriptFileName) as never]) {
      setComponentLoading(false)
      return
    }
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
  }, [url, cache]);
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
    return loading ? createElement(loading) : children
  }
  if (window[(name || scriptFileName) as never]) {
    return createElement((window[(name || scriptFileName) as never] as never), props)
  }
  return fallback && createElement(fallback)
}
export default RemoteComponent