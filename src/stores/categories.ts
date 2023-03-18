import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Category } from 'src/types/category'
import type { Status } from 'src/types/status'
import { useSubcategoriesStore } from 'src/stores/subcategories'

const API_URL = 'http://localhost:3000/mall'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  // // dummy data
  // const categories = ref<Category[]>([
  //   {
  //     id: 10001,
  //     name: '服裝',
  //   },
  //   {
  //     id: 10002,
  //     name: '食品',
  //   },
  //   {
  //     id: 10010,
  //     name: '3C',
  //   },
  //   {
  //     id: 10011,
  //     name: '家用電器',
  //   },
  //   {
  //     id: 10028,
  //     name: '美妝',
  //   },
  //   {
  //     id: 10041,
  //     name: '清潔',
  //   },
  // ])
  const currentID = ref<number | null>(null)
  // Create, Update and Delete status
  const serverResposeStatus = ref<Status | null>(null)
  const errorMessage = ref('')
  const subStore = useSubcategoriesStore()

  // categories as rows in q-table
  const rowsForTable = computed(() => {
    return categories.value.map(c => {
      if (subStore.subcategories) {
        return {
          id: c.id,
          name: c.name,
          subcategoriesCount: subStore.subcategories.filter(
            sub => sub.category_id === c.id
          ).length,
        }
      }
    })
  })
  // options for q-select
  const optionsForSelct = computed(() => {
    return categories.value.map(c => {
      return { label: c.name, value: c.id }
    })
  })
  const getAll = async () => {
    const url = `${API_URL}/categories`
    await axios
      .get(url)
      .then(res => {
        categories.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorMessage.value = '伺服器錯誤'
      })
  }
  const createNew = async (name: string) => {
    // check duplicate
    if (!categories.value || !categories.value.length) await getAll()
    const isDuplicate = categories.value.some(
      c => c.name.toLowerCase() === name.toLowerCase()
    )
    if (isDuplicate) {
      errorMessage.value = '名稱重複'
      throw new Error('client error')
    }
    // call api
    const url = `${API_URL}/categories`
    const dataToSend = { name: name }
    await axios
      .post(url, dataToSend)
      .then(res => {
        if (res.data.affectedRows !== 1 || !res.data.insertId) {
          throw new Error('server error')
        }
        serverResposeStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorMessage.value = '伺服器錯誤'
        throw new Error('server error')
      })
  }
  const createNewLocal = (newCategory: Category) => {
    if (!categories.value || !categories.value.length)
      throw new Error('Cannot find categories')
    if (!newCategory.name || !newCategory.id)
      throw new Error('Cannot find new category')

    categories.value.push(newCategory)
    currentID.value = newCategory.id
  }
  const updateCurrent = async (newCategory: Category) => {
    if (!newCategory.id || !newCategory.name) {
      throw new Error('Cannot find categories')
    }
    const { id, name } = newCategory
    const isDuplicate = categories.value.some(
      c => c.name.toLowerCase() === name.toLowerCase()
    )
    if (isDuplicate) {
      errorMessage.value = '名稱重複'
      throw new Error('client error')
    }

    const url = `${API_URL}/categories/${id}`
    await axios
      .put(url, newCategory)
      .then(res => {
        serverResposeStatus.value = res.data
        if (res.data.affectedRows !== 1) {
          throw new Error('server error')
        }
      })
      .catch(err => {
        console.log(err)
        errorMessage.value = '伺服器錯誤'
        throw new Error('server error')
      })
  }
  const updateCurrentLocal = (newCategory: Category) => {
    if (!newCategory.id || !newCategory.name)
      throw new Error('Cannot find new category')
    if (!categories.value || !categories.value.length)
      throw new Error('Cannot find categories')
    if (!currentID.value) throw new Error('Cannot find id')

    const { name } = newCategory
    const targetIndex = categories.value.findIndex(
      c => c.id === currentID.value
    )
    if (targetIndex === -1) throw new Error('Cannot find categories')

    categories.value[targetIndex].name = name
  }
  const deleteCurrent = async () => {
    if (!currentID.value) throw new Error('Cannot find id')
    const url = `${API_URL}/categories/${currentID.value}`

    if (!subStore.subcategories) throw new Error('Cannot find subcategories')

    const subExists = subStore.subcategories.some(
      sub => sub.category_id === currentID.value
    )
    if (subExists) {
      errorMessage.value = '子類別存在，無法刪除。'
      throw new Error('client error')
    }

    await axios
      .delete(url)
      .then(res => {
        serverResposeStatus.value = res.data
        if (res.data.affectedRows !== 1) {
          throw new Error('伺服器錯誤')
        }
      })
      .catch(err => {
        console.log(err)
        errorMessage.value = '伺服器錯誤'
        throw new Error('伺服器錯誤')
      })
  }
  const deleteCurrentLocal = () => {
    if (!categories.value || !categories.value.length)
      throw new Error('Cannot find categories')
    if (!currentID.value) throw new Error('Cannot find id')

    const targetIndex = categories.value.findIndex(
      c => c.id === currentID.value
    )
    if (targetIndex === -1) throw new Error('Cannot find target')
    categories.value.splice(targetIndex, 1)

    currentID.value = null
  }
  const clearStatus = () => {
    serverResposeStatus.value = null
    errorMessage.value = ''
  }

  return {
    categories,
    currentID,
    serverResposeStatus,
    errorMessage,
    rowsForTable,
    optionsForSelct,
    getAll,
    createNew,
    createNewLocal,
    updateCurrent,
    updateCurrentLocal,
    deleteCurrent,
    deleteCurrentLocal,
    clearStatus,
  }
})
