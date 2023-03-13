import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useDataStore } from './useDataStore'
import type { Status } from 'src/types/mall'

const ENDPOINT = import.meta.env.VITE_MYSQL_ENDPOINT

export const useMysqlStore = defineStore('mysql', () => {
  // Create, Update and Delete response
  const CUDStatus = ref<Status>()
  const errorStatus = ref<any>('伺服器錯誤')
  const dataStore = useDataStore()

  const clearStatus = () => {
    CUDStatus.value = undefined
    errorStatus.value = '伺服器錯誤'
  }

  const apiGET = async (url: string) => {
    await axios
      .get(url)
      .then(res => {
        dataStore.categories = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  const listAll = async () => {
    const url = `${ENDPOINT}/mall/categories`
    await apiGET(url)
  }

  const listAllSub = async () => {
    const url = `${ENDPOINT}/mall/subcategories`
    await axios
      .get(url)
      .then(res => {
        dataStore.subcategories = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  const createCate = async (name: string) => {
    interface Payload {
      name: string
      description?: string
    }

    const url = `${ENDPOINT}/mall/categories`
    const payload: Payload = { name: name }
    const isDuplicate = dataStore.findDuplicate(name)

    if (isDuplicate) {
      errorStatus.value = '名稱重複'
      return
    }

    await axios
      .post(url, payload)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }
  const createSub = async (name: string, description: string, id: number) => {
    interface Payload {
      name: string
      description: string
    }

    const url = `${ENDPOINT}/mall/categories/${id}/subcategories`
    const payload: Payload = { name: name, description: description }
    const isDuplicate = dataStore.findDuplicateSub(name, id)

    if (isDuplicate) {
      errorStatus.value = '名稱重複'
      return
    }

    await axios
      .post(url, payload)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  const updateCate = async (payload: { name: string }, id: number) => {
    const url = `${ENDPOINT}/mall/categories/${id}`
    const isDuplicate = dataStore.findDuplicate(payload.name)

    if (isDuplicate) {
      errorStatus.value = '名稱重複'
      return
    }

    await axios
      .put(url, payload)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  interface UpdateSubPayload {
    name: string
    description: string
  }
  const updateSub = async (payload: UpdateSubPayload, subId: number) => {
    const url = `${ENDPOINT}/mall/subcategories/${subId}`
    const isDuplicate = dataStore.findDuplicateSub(payload.name, subId)

    if (isDuplicate) {
      errorStatus.value = '名稱重複'
      return
    }

    await axios
      .put(url, payload)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deleteCate = async (id: number) => {
    const url = `${ENDPOINT}/mall/categories/${id}`

    if (dataStore.hasChild(id)) {
      errorStatus.value = '子類別存在，無法刪除。'
      return
    }

    await axios
      .delete(url)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deleteSub = async (id: number) => {
    const url = `${ENDPOINT}/mall/subcategories/${id}`

    await axios
      .delete(url)
      .then(res => {
        CUDStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  return {
    CUDStatus,
    errorStatus,
    clearStatus,
    listAll,
    listAllSub,
    createCate,
    createSub,
    updateCate,
    updateSub,
    deleteCate,
    deleteSub,
  }
})
