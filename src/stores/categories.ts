import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Category } from 'src/types/category'
import type { Subcategory } from 'src/types/subcategory'

const API_URL = 'http://localhost:3000/mall'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  // dummy data
  // const categories = ref<Category[]>([
  //   {
  //     id: 10001,
  //     name: '服裝',
  //     subcategories: [
  //       {
  //         id: 2,
  //         name: '男士上衣',
  //         description: 'T-shirt, 連帽T, 襯衫, 內衣',
  //         category_id: 10001,
  //       },
  //       {
  //         id: 7,
  //         name: '男士褲裝',
  //         description: 'Pants, Jeans and Leggings',
  //         category_id: 10001,
  //       },
  //     ],
  //   },
  //   {
  //     id: 10002,
  //     name: '食品',
  //     subcategories: [
  //       {
  //         id: 9,
  //         name: '肉類',
  //         description: '牛雞豬魚',
  //         category_id: 10002,
  //       },
  //       {
  //         id: 10,
  //         name: 'Drinks',
  //         description: 'Soda, Juice, Milk and Water',
  //         category_id: 10002,
  //       },
  //       {
  //         id: 11,
  //         name: 'Snacks',
  //         description: 'Chips, Candies and Crackers',
  //         category_id: 10002,
  //       },
  //       {
  //         id: 12,
  //         name: 'Fresh Vegetables',
  //         description: 'Sourced from Local Farmers',
  //         category_id: 10002,
  //       },
  //     ],
  //   },
  //   {
  //     id: 10010,
  //     name: '3C',
  //     subcategories: [
  //       {
  //         id: 14,
  //         name: 'Notebooks',
  //         description: 'MacBook, MS Surface, Asus, MSI, HP',
  //         category_id: 10010,
  //       },
  //       {
  //         id: 15,
  //         name: 'LCD Monitors',
  //         description: 'Asus, BenQ, SAMSUNG, LG, MSI',
  //         category_id: 10010,
  //       },
  //     ],
  //   },
  //   {
  //     id: 10011,
  //     name: '家用電器',
  //     subcategories: [
  //       {
  //         id: 16,
  //         name: 'Tables',
  //         description: 'Handcraft Wooden Tables',
  //         category_id: 10011,
  //       },
  //     ],
  //   },
  //   {
  //     id: 10028,
  //     name: '美妝',
  //     subcategories: [],
  //   },
  //   {
  //     id: 10041,
  //     name: '清潔',
  //     subcategories: [
  //       {
  //         id: 33,
  //         name: '浴廁清潔',
  //         description: '水桶, 地板刷',
  //         category_id: 10041,
  //       },
  //       {
  //         id: 45,
  //         name: '廚房清潔',
  //         description: '抹布, 拖把',
  //         category_id: 10041,
  //       },
  //       {
  //         id: 46,
  //         name: '車用',
  //         description: '手持吸塵器',
  //         category_id: 10041,
  //       },
  //     ],
  //   },
  // ])
  const currentID = ref<number | null>(null)
  const currentSubID = ref<number | null>(null)
  const currentSubs = computed(
    () => categories.value.find(c => c.id === currentID.value)?.subcategories
  )

  // actions
  const getAll = async () => {
    const url = `${API_URL}/categories`
    await axios
      .get(url)
      .then(res => {
        categories.value = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }
  const createNew = (newName: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      // check null
      if (!newName) {
        reject('找不到新類別名稱')
        return
      }
      // refresh categories
      await getAll()
      // check duplicate
      let isDuplicate = false
      if (categories.value.length > 0) {
        isDuplicate = categories.value.some(
          c => c.name.toLowerCase() === newName.toLowerCase()
        )
      }
      if (isDuplicate) {
        reject('名稱重複')
        return
      }
      // call api
      const url = `${API_URL}/categories`
      const dataToSend = { name: newName }
      await axios
        .post(url, dataToSend)
        .then(res => {
          if (
            !res.data.affectedRows ||
            res.data.affectedRows !== 1 ||
            !res.data.insertId
          ) {
            throw new Error('insertId not found')
          }
          // update state
          const newCategory = {
            name: newName,
            id: res.data.insertId as number,
            subcategories: [],
          }
          categories.value.push(newCategory)
          currentID.value = newCategory.id
        })
        .catch(err => {
          console.log(err)
          reject('伺服器錯誤')
        })
      resolve()
    })
  }
  const createNewSub = (
    newSubcategory: Omit<Subcategory, 'id'>
  ): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      // check null
      if (
        !newSubcategory.name ||
        !newSubcategory.description ||
        !newSubcategory.category_id
      ) {
        reject('找不到新子類別資料')
        return
      }
      // refresh categories
      await getAll()
      // check duplicate
      const currentC = categories.value.find(c => c.id === currentID.value)
      if (!currentC) {
        reject('找不到所屬類別')
        return
      }
      let isDuplicate = false
      if (currentC && currentC.subcategories.length > 0) {
        isDuplicate = currentC.subcategories.some(
          sub => sub.name.toLowerCase() === newSubcategory.name.toLowerCase()
        )
      }
      if (isDuplicate) {
        reject('名稱重複')
        return
      }
      // call api
      const url = `${API_URL}/categories/${currentID.value}/subcategories`
      const dataToSend = {
        name: newSubcategory.name,
        description: newSubcategory.description,
      }
      await axios
        .post(url, dataToSend)
        .then(res => {
          if (
            !res.data.affectedRows ||
            res.data.affectedRows !== 1 ||
            !res.data.insertId
          ) {
            throw new Error('insertId not found')
          }
          // update state
          const newSub = {
            ...newSubcategory,
            id: res.data.insertId as number,
          }
          currentC?.subcategories.push(newSub)
          currentSubID.value = newSub.id
        })
        .catch(err => {
          console.log(err)
          reject('伺服器錯誤')
        })
      resolve()
    })
  }
  const updateCurrent = (newName: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      // check null
      if (!newName || !currentID.value) {
        reject('找不到新類別')
        return
      }
      // refresh categories
      await getAll()
      // check duplicate
      const isDuplicate = categories.value.some(
        c => c.name.toLowerCase() === newName.toLowerCase()
      )
      if (isDuplicate) {
        reject('名稱重複')
        return
      }
      // call api
      const url = `${API_URL}/categories/${currentID.value}`
      const dataToSend = { name: newName }
      await axios
        .put(url, dataToSend)
        .then(res => {
          if (!res.data.affectedRows || res.data.affectedRows !== 1) {
            throw new Error('server error')
          }
          // update state
          updateCurrentLocal(newName)
        })
        .catch(err => {
          console.log(err)
          reject('伺服器錯誤')
        })
      resolve()
    })
  }
  const updateCurrentLocal = (newName: string) => {
    const currentC = categories.value.find(c => c.id === currentID.value)
    if (!currentC) throw new Error('Cannot find categories')
    currentC.name = newName
  }
  const updateCurrentSub = (newSubcategory: {
    name: string
    description: string
  }): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      // check null
      if (
        !newSubcategory.name ||
        !newSubcategory.description ||
        !currentID.value ||
        !currentSubID.value
      ) {
        reject('找不到新子類別')
        return
      }
      // refresh categories
      await getAll()
      // check duplicate
      const currentC = categories.value.find(c => c.id === currentID.value)
      if (!currentC) {
        reject('找不到所屬類別')
        return
      }
      const isDuplicate = currentC.subcategories
        .filter(sub => sub.id !== currentSubID.value)
        .some(
          sub => sub.name.toLowerCase() === newSubcategory.name.toLowerCase()
        )
      if (isDuplicate) {
        reject('名稱重複')
        return
      }
      // call api
      const url = `${API_URL}/subcategories/${currentSubID.value}`
      await axios
        .put(url, newSubcategory)
        .then(res => {
          if (!res.data.affectedRows || res.data.affectedRows !== 1) {
            throw new Error('server error')
          }
          // update state
          const currentSub = currentC.subcategories.find(
            sub => sub.id === currentSubID.value
          )
          if (!currentSub) throw new Error('Cannot find sub')
          currentSub.name = newSubcategory.name
          currentSub.description = newSubcategory.description
        })
        .catch(err => {
          console.log(err)
          reject('伺服器錯誤')
        })
      resolve()
    })
  }

  const deleteCurrent = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      // check null
      if (!currentID.value) {
        reject('找不到欲刪除的類別')
        return
      }
      // refresh categories
      await getAll()
      // find target index
      const currentCIndex = categories.value.findIndex(
        c => c.id === currentID.value
      )
      if (currentCIndex === -1) {
        reject('找不到欲刪除的類別')
        return
      }
      // check subcategory count
      const currentLengthOfSubs =
        categories.value[currentCIndex].subcategories.length
      if (currentLengthOfSubs > 0) {
        reject('本類別底下有子類別，不可刪除')
        return
      }
      // call api
      const url = `${API_URL}/categories/${currentID.value}`
      await axios
        .delete(url)
        .then(res => {
          if (!res.data.affectedRows || res.data.affectedRows !== 1) {
            throw new Error('server error')
          }
          // update state
          categories.value.splice(currentCIndex, 1)
          currentID.value = null
        })
        .catch(err => {
          console.log(err)
          reject('伺服器錯誤')
        })
      resolve()
    })
  }
  const deleteCurrentSub = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      // check null
      if (!currentID.value || !currentSubID.value) {
        reject('找不到欲刪除的子類別')
        return
      }
      // refresh categories
      await getAll()
      // call api
      const url = `${API_URL}/subcategories/${currentSubID.value}`
      await axios
        .delete(url)
        .then(res => {
          if (!res.data.affectedRows || res.data.affectedRows !== 1) {
            throw new Error('server error')
          }
          // update state
          deleteCurrentSubLocal()
          currentSubID.value = null
        })
        .catch(err => {
          console.log(err)
          reject('伺服器錯誤')
        })
      resolve()
    })
  }
  const deleteCurrentSubLocal = () => {
    const currentC = categories.value.find(c => c.id === currentID.value)
    if (!currentC) throw new Error('Cannot find target c')
    const currentSubIndex = currentC.subcategories.findIndex(
      sub => sub.id === currentSubID.value
    )
    if (currentSubIndex === -1) throw new Error('Cannot find target sub')
    currentC.subcategories.splice(currentSubIndex, 1)
  }

  return {
    categories,
    currentID,
    currentSubID,
    currentSubs,
    getAll,
    createNew,
    createNewSub,
    updateCurrent,
    updateCurrentSub,
    deleteCurrent,
    deleteCurrentSub,
  }
})
