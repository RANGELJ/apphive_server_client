import { useContext, useEffect, useRef } from 'react'
import unknownIsNumber from '@rangeljl/shared/unknownIsNumber'
import useApphiveServerSuspenseQuery from './useApphiveServerSuspenseQuery'
import ApphiveServerContext from '../shared/ApphiveServerContext'
import { useSuspenseQuery } from '@tanstack/react-query'
import apphiveServerRequestGet from '../shared/apphiveServerRequestGet'

type HookArgs = {
  modelProps: {
    name: string
    prop: string
    identifier: string | number
  }[]
  updatedAtFromServer: number
  refetch: () => void
}

const useModelUpdatesListener = ({
  modelProps,
  updatedAtFromServer,
  refetch,
}: HookArgs) => {
  const {
    subscribeToFirebaseRealtimeDbPath,
    baseQueryKey,
    serverHost,
    getIdToken,
    extraHeaders,
  } = useContext(ApphiveServerContext)

  const {
    data: { names: modelNames, properties: propertyNames },
  } = useSuspenseQuery({
    queryKey: [baseQueryKey, 'modelsData'],
    queryFn: async () => {
      const names = await apphiveServerRequestGet<
        { id: number; name: string }[]
      >({
        path: '/models/names',
        serverHost,
        getIdToken,
        extraHeaders,
      })

      const properties = await apphiveServerRequestGet<
        { id: number; name: string }[]
      >({
        path: '/models/propertyNames',
        serverHost,
        getIdToken,
        extraHeaders,
      })

      return { names, properties }
    },
  })

  const paths = modelProps.map((modelProp) => {
    const modelNameId = modelNames.find(
      (modelName) => modelName.name === modelProp.name
    )?.id!
    const modelPropId = propertyNames.find(
      (propertyName) => propertyName.name === modelProp.prop
    )?.id!

    return `updates/models/${modelNameId}/${modelPropId}/${modelProp.identifier}`
  })

  const refetchRef = useRef(refetch)
  refetchRef.current = refetch

  const updatedFromServerAtRef = useRef(updatedAtFromServer ?? 0)
  updatedFromServerAtRef.current = updatedAtFromServer ?? 0

  useEffect(() => {
    if (paths.length === 0) {
      return
    }

    let refetchTimeoutId: ReturnType<typeof setTimeout> | null = null

    const debouncedRefetch = () => {
      if (refetchTimeoutId) {
        clearTimeout(refetchTimeoutId)
      }

      refetchTimeoutId = setTimeout(refetchRef.current, 100)
    }

    const listener = (updatedFromFirebaseAt: unknown) => {
      if (!unknownIsNumber(updatedFromFirebaseAt)) {
        return
      }

      if (updatedFromFirebaseAt < updatedFromServerAtRef.current) {
        return
      }

      debouncedRefetch()
    }

    const unsubscribes = paths.map((path) =>
      subscribeToFirebaseRealtimeDbPath(path, listener)
    )

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
      if (refetchTimeoutId) {
        clearTimeout(refetchTimeoutId)
      }
    }
  }, [subscribeToFirebaseRealtimeDbPath, paths.join(':')])
}

export default useModelUpdatesListener
