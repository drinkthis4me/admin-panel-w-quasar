import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from 'src/types/product'
import axios from 'axios'

const API_URL = 'http://localhost:3000/mall'

export const useProductStore = defineStore('product', () => {
  // states
  // const products = ref<Product[]>([])
  const products = ref<Product[]>([
    {
      id: 1,
      sub_category_id: 2,
      name: 'Basic T-shirt',
      description: 'Everyday cotten T-shirt',
      size: 'M',
      color: 'White',
      price: 200,
      quantity: 10,
      image_path: 'https://picsum.photos/800/600',
    },
    {
      id: 3,
      sub_category_id: 2,
      name: 'Nike workout T-shirt',
      description: '圓領 男款 運動 棉質',
      size: 'M',
      color: 'white',
      price: 500,
      quantity: 20,
      image_path: 'https://picsum.photos/800/600',
    },
  ])
  const currentPID = ref<number | null>(null)

  // actions
  const getAll = async () => {
    const url = `${API_URL}/products`
    await axios
      .get(url)
      .then(res => {
        console.log(res.data)
        products.value = res.data
      })
      .catch(err => console.log(err))
  }
  const getTen = async () => {
    const url = `${API_URL}/products`
    await axios
      .get(url)
      .then(res => {
        console.log(res.data)
        products.value = res.data
      })
      .catch(err => console.log(err))
  }
  const createNew = (newProduct: Omit<Product, 'id'>): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      // check null
      if (
        !newProduct.name ||
        !newProduct.description ||
        !newProduct.size ||
        !newProduct.color ||
        !newProduct.price ||
        !newProduct.quantity ||
        !newProduct.sub_category_id
      ) {
        reject('找不到新產品資料')
        return
      }
      // call api
      const url = `${API_URL}/subcategories/${newProduct.sub_category_id}/products`
      await axios
        .post(url, newProduct)
        .then(res => {
          if (
            !res.data.affectedRows ||
            res.data.affectedRows !== 1 ||
            !res.data.insertId
          ) {
            throw new Error('insertId not found')
          }
          // update state
          const newP = {
            ...newProduct,
            id: res.data.insertId as number,
          }
          products.value.push(newP)
          currentPID.value = newP.id
        })
        .catch(err => {
          console.log(err)
          reject('伺服器錯誤')
        })
      resolve()
      return
    })
  }
  const updateCurrent = (newProduct: Product): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      // check null
      if (
        !newProduct.name ||
        !newProduct.description ||
        !newProduct.size ||
        !newProduct.color ||
        !newProduct.price ||
        !newProduct.quantity ||
        !newProduct.sub_category_id ||
        !currentPID.value
      ) {
        reject('找不到新產品資料')
        return
      }
      // call api
      const url = `${API_URL}/products/${currentPID.value}`
      await axios
        .post(url, newProduct)
        .then(res => {
          if (
            !res.data.affectedRows ||
            res.data.affectedRows !== 1 ||
            !res.data.insertId
          ) {
            throw new Error('insertId not found')
          }
          // update state
          const targetIndex = products.value.findIndex(
            p => p.id === currentPID.value
          )
          products.value[targetIndex] = newProduct
        })
        .catch(err => {
          console.log(err)
          reject('伺服器錯誤')
        })
      resolve()
      return
    })
  }
  const deleteCurrent = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      // check null
      if (!currentPID.value) {
        reject('找不到欲刪除的類別')
        return
      }
      // call api
      const url = `${API_URL}/products/${currentPID.value}`
      await axios
        .delete(url)
        .then(res => {
          if (!res.data.affectedRows || res.data.affectedRows !== 1) {
            throw new Error('server error')
          }
          // update state
          const targetIndex = products.value.findIndex(
            p => p.id === currentPID.value
          )
          products.value.splice(targetIndex, 1)
          currentPID.value = null
        })
        .catch(err => {
          console.log(err)
          reject('伺服器錯誤')
        })
      resolve()
      return
    })
  }

  return {
    products,
    currentPID,
    getAll,
    createNew,
    updateCurrent,
    deleteCurrent,
  }
})
