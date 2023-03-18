import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Subcategory } from 'src/types/subcategory'
import type { Status } from 'src/types/status'

const API_URL = 'http://localhost:3000/mall'

export const useSubcategoriesStore = defineStore('subcategories', () => {
  const subcategories = ref<Subcategory[]>([])
  // // dummy data
  // const subcategories = ref<Subcategory[]>([
  //   {
  //     id: 2,
  //     category_id: 10001,
  //     name: '男士上衣',
  //     description: 'T-shirt, 連帽T, 襯衫, 內衣',
  //   },
  //   {
  //     id: 7,
  //     category_id: 10001,
  //     name: '男士褲裝',
  //     description: 'Pants, Jeans and Leggings',
  //   },
  //   {
  //     id: 9,
  //     category_id: 10002,
  //     name: '肉類',
  //     description: '牛雞豬魚',
  //   },
  //   {
  //     id: 10,
  //     category_id: 10002,
  //     name: 'Drinks',
  //     description: 'Soda, Juice, Milk and Water',
  //   },
  //   {
  //     id: 11,
  //     category_id: 10002,
  //     name: 'Snacks',
  //     description: 'Chips, Candies and Crackers',
  //   },
  //   {
  //     id: 12,
  //     category_id: 10002,
  //     name: 'Fresh Vegetables',
  //     description: 'Sourced from Local Farmers',
  //   },
  //   {
  //     id: 14,
  //     category_id: 10010,
  //     name: 'Notebooks',
  //     description: 'MacBook, MS Surface, Asus, MSI, HP',
  //   },
  //   {
  //     id: 15,
  //     category_id: 10010,
  //     name: 'LCD Monitors',
  //     description: 'Asus, BenQ, SAMSUNG, LG, MSI',
  //   },
  //   {
  //     id: 16,
  //     category_id: 10011,
  //     name: 'Tables',
  //     description: 'Handcraft Wooden Tables',
  //   },
  //   {
  //     id: 33,
  //     category_id: 10041,
  //     name: '浴廁清潔',
  //     description: '水桶, 地板刷',
  //   },
  //   {
  //     id: 45,
  //     category_id: 10041,
  //     name: '廚房清潔',
  //     description: '抹布, 拖把',
  //   },
  //   {
  //     id: 46,
  //     category_id: 10041,
  //     name: '車用',
  //     description: '手持吸塵器',
  //   },
  // ])
  const currentSubID = ref<number | null>(null)
  // Create, Update and Delete status
  const serverResposeStatus = ref<Status | null>(null)
  const errorMessage = ref('')

  const getAll = async () => {
    const url = `${API_URL}/subcategories`
    await axios
      .get(url)
      .then(res => {
        subcategories.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorMessage.value = '伺服器錯誤'
      })
  }
  const createNew = async (newSubcategory: Omit<Subcategory, 'id'>) => {
    if (
      !newSubcategory.name ||
      !newSubcategory.category_id ||
      !newSubcategory.description
    ) {
      throw new Error('Cannot find new subcategory')
    }
    const { name, description, category_id } = newSubcategory
    if (!subcategories.value) throw new Error('subcategories is null')

    // find subs by cateID
    const filteredSubs = subcategories.value.filter(
      sub => sub.category_id === category_id
    )
    // find duplicate name
    const isDuplicate = filteredSubs.some(
      sub => sub.name.toLowerCase() === name.toLowerCase()
    )
    if (isDuplicate) {
      errorMessage.value = '名稱重複'
      console.log('dupe')
      throw new Error('client error')
    }

    // call api
    const url = `${API_URL}/categories/${category_id}/subcategories`
    const dataToSend = {
      name: name,
      description: description,
    }
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
  const createNewLocal = (newSubcategory: Subcategory) => {
    if (!subcategories.value || subcategories.value.length === 0) {
      throw new Error('Cannot find subcategories')
    }
    if (
      !newSubcategory.id ||
      !newSubcategory.name ||
      !newSubcategory.category_id ||
      !newSubcategory.description
    ) {
      throw new Error('Cannot find new subcategories')
    }

    subcategories.value.push(newSubcategory)
    currentSubID.value = newSubcategory.id
  }
  const updateCurrent = async (newSubcategory: Subcategory) => {
    if (
      !newSubcategory.id ||
      !newSubcategory.name ||
      !newSubcategory.category_id ||
      !newSubcategory.description
    ) {
      throw new Error('Cannot find new subcategory')
    }
    const { id, name, category_id } = newSubcategory

    // find subs by cateID
    const filteredSubs = subcategories.value.filter(
      sub => sub.category_id === category_id
    )
    // find duplicate name
    const isDuplicate = filteredSubs.some(
      sub => sub.name.toLowerCase() === name.toLowerCase()
    )
    if (isDuplicate) {
      errorMessage.value = '名稱重複'
      throw new Error('client error')
    }

    // call api
    const url = `${API_URL}/subcategories/${id}`
    const dataToSend = {
      name: newSubcategory.name,
      description: newSubcategory.description,
    }
    await axios
      .put(url, dataToSend)
      .then(res => {
        serverResposeStatus.value = res.data
        if (res.data.affectedRows <= 0) {
          throw new Error('server error')
        }
      })
      .catch(err => {
        console.log(err)
        errorMessage.value = '伺服器錯誤'
        throw new Error('server error')
      })
  }
  const updateCurrentLocal = (newSubcategory: Subcategory) => {
    if (
      !newSubcategory.id ||
      !newSubcategory.name ||
      !newSubcategory.category_id ||
      !newSubcategory.description
    ) {
      throw new Error('Cannot find new subcategories')
    }
    if (!subcategories.value || subcategories.value.length === 0)
      throw new Error('Cannot find subcategories')
    if (!currentSubID.value) throw new Error('Cannot find subID')

    const targetIndex = subcategories.value.findIndex(
      sub => sub.id === currentSubID.value
    )
    if (targetIndex === -1) throw new Error('Cannot find target')

    subcategories.value[targetIndex] = newSubcategory
  }
  const deleteCurrent = async () => {
    if (!currentSubID.value) throw new Error('Cannot find id')
    const url = `${API_URL}/subcategories/${currentSubID.value}`

    await axios
      .delete(url)
      .then(res => {
        serverResposeStatus.value = res.data
      })
      .catch(err => {
        console.log(err)
        errorMessage.value = '伺服器錯誤'
        throw new Error('server error')
      })
  }
  const deleteCurrentLocal = () => {
    if (!subcategories.value || subcategories.value.length === 0)
      throw new Error('Cannot find subcategories')
    if (!currentSubID.value) throw new Error('Cannot find subID')

    const targetIndex = subcategories.value.findIndex(
      sub => sub.id === currentSubID.value
    )
    if (targetIndex === -1) throw new Error('Cannot find target')
    subcategories.value.splice(targetIndex, 1)

    currentSubID.value = null
  }
  const clearStatus = () => {
    serverResposeStatus.value = null
    errorMessage.value = ''
  }

  return {
    subcategories,
    currentSubID,
    serverResposeStatus,
    errorMessage,
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
