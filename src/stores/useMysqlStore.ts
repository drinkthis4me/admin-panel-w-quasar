import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useDataStore } from './useDataStore'
import type { Category, Status } from 'src/types/mall'

const ENDPOINT = import.meta.env.VITE_MYSQL_ENDPOINT

export const useMysqlStore = defineStore('mysql', () => {
  // response from Read(listAll and getOne)
  const results = ref<Category[]>()
  // status for Create, Update and Delete
  const CUDStatus = ref<Status>()
  const errorStatus = ref()
  const dataStore = useDataStore()

  const clearStatus = () => {
    CUDStatus.value = undefined
    errorStatus.value = undefined
  }

  const apiGET = async (url: string) => {
    await axios
      .get(url)
      .then((res) => {
        results.value = res.data
        dataStore.categories = res.data
      })
      .catch((err) => {
        console.log(err)
        errorStatus.value = err.message
      })
  }

  const listAll = async () => {
    const url = ENDPOINT + '/mall/categories'
    await apiGET(url)
  }

  const listAllSub = async () => {
    const url = ENDPOINT + '/mall/subcategories'
    await axios
      .get(url)
      .then((res) => {
        results.value = res.data
        dataStore.subcategories = res.data
      })
      .catch((err) => {
        console.log(err)
        errorStatus.value = err.message
      })
  }

  const getOne = async (id: number, subId?: number) => {
    let url = `${ENDPOINT}/mall/categories/${id}`
    if (subId) {
      url += `/subcategories/${subId}`
    }
    await apiGET(url)
  }

  const create = async (name: string, description?: string, id?: number) => {
    interface Payload {
      name: string
      description?: string
    }

    let url = `${ENDPOINT}/mall/categories`
    const payload: Payload = { name: name }
    let isDuplicate = false

    if (id && description) {
      url += `/${id}/subcategories`
      payload.description = description
      isDuplicate = dataStore.findDuplicate(name, id)
    } else {
      isDuplicate = dataStore.findDuplicate(name)
    }

    if (isDuplicate) {
      errorStatus.value = 'Duplicate name found'
      console.log('Duplicate name found')
    } else {
      await axios
        .post(url, payload)
        .then((res) => {
          console.log(res)
          CUDStatus.value = res.data
        })
        .catch((err) => {
          errorStatus.value = err.message
          console.log(err)
        })
    }
  }

  const updateOld = async (payload: any, id: number, subId?: number) => {
    let url = `${ENDPOINT}/mall/categories/${id}`
    if (subId) {
      url += `/subcategories/${subId}`
    }

    await axios
      .put(url, payload)
      .then((res) => {
        console.log(res)
        CUDStatus.value = res.data
      })
      .catch((err) => {
        errorStatus.value = err.message
        console.log(err)
      })
  }

  const deleteOld = async (id: number, subId?: number) => {
    let url = `${ENDPOINT}/mall/categories/${id}`
    if (subId) {
      url += `/subcategories/${subId}`
    }

    await axios
      .delete(url)
      .then((res) => {
        console.log(res)
        CUDStatus.value = res.data
      })
      .catch((err) => {
        errorStatus.value = err.message
        console.log(err)
      })
  }

  return {
    results,
    CUDStatus,
    errorStatus,
    clearStatus,
    listAll,
    listAllSub,
    getOne,
    create,
    updateOld,
    deleteOld,
  }
})
