type HookArgs = {
  modelProps: {
    name: string
    prop: string
    identifier: string | number
  }[]
  updatedAtFromServer: number
  refetch: () => void
}

const createUseModelUpdatesListener =
  () =>
  ({ modelProps, updatedAtFromServer, refetch }: HookArgs) => {
    const paths = modelProps.map((modelProp) => {
      const modelNameId = modelNameGetIdByName(modelProp.name)
      const modelPropId = modelPropertyGetByName(modelProp.prop)

      return `updates/models/${modelNameId}/${modelPropId}/${modelProp.identifier}`
    })

    const updatedFromServerAt = updatedAtFromServer ?? 0

    useEffect(() => {
      if (paths.length === 0) {
        return
      }

      let refetchTimeoutId: NodeJS.Timeout | null = null

      const debouncedRefetch = () => {
        if (refetchTimeoutId) {
          clearTimeout(refetchTimeoutId)
        }

        refetchTimeoutId = setTimeout(refetch, 100)
      }

      const listener = (snapshot: firebase.database.DataSnapshot) => {
        const updatedFromFirebaseAt = snapshot.val()

        if (!unknownIsNumber(updatedFromFirebaseAt)) {
          return
        }

        if (updatedFromFirebaseAt < updatedFromServerAt) {
          return
        }

        debouncedRefetch()
      }

      const firebaseApp = firebaseGetApphiveLegacyApp()

      const firebaseRefs = paths.map((path) => firebaseApp.database().ref(path))

      firebaseRefs.forEach((firebaseRef) => {
        firebaseRef.on('value', listener)
      })

      return () => {
        if (refetchTimeoutId) {
          clearTimeout(refetchTimeoutId)
        }

        firebaseRefs.forEach((firebaseRef) => {
          firebaseRef.off('value', listener)
        })
      }
    }, [refetch, updatedFromServerAt, paths.join(':')])
  }

export default createUseModelUpdatesListener
