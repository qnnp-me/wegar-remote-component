import {createElement, FunctionComponent, ReactNode, useEffect, useState} from "react";

export interface RemoteComponentProps<T extends Record<string, unknown>> {
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

function RemoteComponent<T extends Record<string, unknown>>(
  componentProps: RemoteComponentProps<T>): ReactNode {
  const {
    url,
    css = false,
    name,
    props = {} as T,
    children,
    loading,
    fallback,
    cache = true
  } = componentProps
  // 获取文件名
  const scriptFileName = url.replace(/.*?([^/.]+)[.\w]+$/, '$1');

  const [UUID] = useState(`_WegarComponent-${crypto.randomUUID()}`)
  const componentName = name || scriptFileName
  const [componentLoading, setComponentLoading] = useState(!window[componentName as never])

  useEffect(() => {
    // 加载缓存组件
    if (cache && (window[componentName as never] || window[UUID as never])) {
      setComponentLoading(false)
      return
    }
    // 开始加载组件
    setComponentLoading(true)
    const scriptElement = document.createElement('script');
    scriptElement.src = url;
    scriptElement.id = UUID
    scriptElement.type = 'application/javascript'
    scriptElement.onload = () => {
      setComponentLoading(false)
      scriptElement.remove()
    }
    scriptElement.onerror = () => {
      setComponentLoading(false)
      scriptElement.remove()
    }
    document.body.appendChild(scriptElement);
  }, [url, cache, componentName, UUID]);
  useEffect(() => {
    if (css) {
      const linkElement = document.createElement('link');
      linkElement.href = url.replace(/[^/]+$/, `${scriptFileName}.css`);
      linkElement.rel = 'stylesheet';
      document.head.appendChild(linkElement);
      return () => {
        linkElement.remove()
      }
    }
  }, [css, scriptFileName, url]);
  if (componentLoading) {
    return loading ? createElement(loading) : children
  }
  if (window[componentName as never] || typeof window[UUID as never] === 'function') {
    return createElement(((window[componentName as never] || window[UUID as never]) as never), props)
  }
  return fallback && createElement(fallback)
}

export default RemoteComponent